import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as QueueStoreActions from './queue-store.actions';
import { OnecConnectorService } from '../onec/onec.connector.service';
import { DatabaseService } from '../database/database.service';
import { LoadingController } from '@ionic/angular';
import { Queue } from './queue-store.reducer';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { selectAllQueue } from './queue-store.selectors';



@Injectable()
export class QueueStoreEffects {

  loadIndicator: HTMLIonLoadingElement;

  inQueueEffect$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.inQueue),
      concatMap(() => { return this.store.pipe(select(selectAllQueue))  }),
      concatMap((queue) => { return this.localdb.SaveData<Array<Queue>>('queue',queue)})
      
    )}, { dispatch: false });

    delQueueEffect$ = createEffect(() => {
      return this.actions$.pipe( 
        /// фильтруем событие
        ofType(QueueStoreActions.delQueue),
        concatMap(() => { return this.localdb.DellItem('queue')})
      )}, { dispatch: false });    


  loadQueueStores$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.loadQueueStores),
      /// создаем елемент спиннера
      concatMap(()=> { return from(this.loadingController.create({message: "Loading queue",keyboardClose:true,spinner: "lines"}))}),
      /// обращемся к локальному хранилищу
      concatMap((el) => {
        this.loadIndicator = el;
        this.loadIndicator.present();
        return this.localdb.GetData<Array<Queue>>('queue').pipe(
          catchError(error =>  of([])  )
      )}),
      concatMap((menu)=>{
        this.loadIndicator.dismiss();
        return  of(QueueStoreActions.loadQueueStoresSuccess({data:menu}))
      })
    );
  });

 


  constructor(private actions$: Actions,
    private localdb : DatabaseService,
    private store: Store<State>,
    private webdb : OnecConnectorService,
    public loadingController: LoadingController
    ) {}

}
