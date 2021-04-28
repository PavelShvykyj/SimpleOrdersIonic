import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap,  filter, withLatestFrom } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as HallstateActions from './hallstate.actions';
import { DatabaseService } from 'src/app/database/database.service';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';
import { LoadingController } from '@ionic/angular';
import { HallsState } from './hallstate.reducer';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { selectQueueLenth } from 'src/app/queue/queue-store.selectors';



@Injectable()
export class HallstateEffects {

  loadIndicator: HTMLIonLoadingElement;

  refreshHallstates$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(HallstateActions.refreshHallstates),
      withLatestFrom(this.store.pipe(select(selectQueueLenth))),
      tap(data=> {
        if(data[1]!=0) {
          return HallstateActions.refreshHallstatesFailure({ error: 'Очередь не пуста' })
        }
      }),
      //// ТОЛЬКО ЕСЛИ ОЧЕРЕДЬ ПУСТА
      filter(data=>data[1]===0),
      concatMap(() => { return from(this.loadingController.create({ message: "Refreshing halstate", keyboardClose: true, spinner: "lines" })) }),
      concatMap((el) => {
        el.present();
        return this.webdb.GetHallState().pipe(
          map((hallstate) => { el.dismiss(); return HallstateActions.refreshHallstatesSuccess({ data: hallstate }) }),
          catchError(error => { el.dismiss(); return of(HallstateActions.refreshHallstatesFailure({ error: '' })) })
        )
      }))
  });

  loadHallstates$ = createEffect(() => {
    return this.actions$.pipe(
      /// фильтруем событие
      ofType(HallstateActions.loadHallstates),
      concatMap(() => { return from(this.loadingController.create({ message: "load halstate", keyboardClose: true, spinner: "lines" })) }),
      concatMap((el) => {
        el.present();
        return this.localdb.GetData<HallsState>('hallstateSnap').pipe(
          map((hallstate) => { el.dismiss();  return HallstateActions.loadHallstatesSuccess({ data: hallstate }) }),
          catchError(error => { el.dismiss(); return of(HallstateActions.loadHallstatesFailure({ error: '' })) })
        )
      }))
  });


 
  // loadHallstates$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     /// фильтруем событие
  //     ofType(HallstateActions.loadHallstates),
  //     /// создаем елемент спиннера
  //     concatMap(() => { return from(this.loadingController.create({ message: "Loading halstate", keyboardClose: true, spinner: "lines" })) }),
  //     /// обращемся к локальному хранилищу
  //     concatMap((el) => {
  //       this.loadIndicator = el;
  //       this.loadIndicator.present();
  //       return this.localdb.GetData<HallsState>('hallstate').pipe(
  //         catchError(error => of(undefined))
  //       )
  //     }),
  //     /// если локальное хранилище вернуло путототу или ошибка обращаемся к 1с 
  //     concatMap((hallstate, el) => {
  //       if (hallstate === undefined) {
  //         return this.webdb.GetHallState().pipe(
  //           ///продолжили поток акшенов
  //           map((updhallstate) => { this.loadIndicator.dismiss(); return HallstateActions.loadHallstatesSuccess({ data: updhallstate }) }),
  //           catchError(error => { this.loadIndicator.dismiss(); return of(HallstateActions.loadHallstatesFailure({ error: '' })) })
  //         )
  //       } else {
  //         this.loadIndicator.dismiss();
  //         return of(HallstateActions.loadHallstatesSuccess({ data: hallstate }))
  //       }
  //     })
  //   );
  // });




  constructor(private actions$: Actions,
    private localdb: DatabaseService,
    private store: Store<State>,
    private webdb: OnecConnectorService,
    public loadingController: LoadingController
  ) { }

}
