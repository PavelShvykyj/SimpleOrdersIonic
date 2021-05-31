import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, filter, tap, withLatestFrom, take } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as QueueStoreActions from './queue-store.actions';
import { OnecConnectorService } from '../onec/onec.connector.service';
import { DatabaseService } from '../database/database.service';
import { LoadingController } from '@ionic/angular';
import { Queue } from './queue-store.reducer';
import { Store, select, props } from '@ngrx/store';
import { State } from '../reducers';
import { selectAllQueue } from './queue-store.selectors';
import { PingStatus } from '../net/netcontrol.selectors';
import { refreshHallstates } from '../home/halls/hall-state-store/hallstate.actions';



@Injectable()
export class QueueStoreEffects {

  loadIndicator: HTMLIonLoadingElement;

  inQueueEffect$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.inQueue),
      concatMap(() => { return this.store.pipe(select(selectAllQueue),take(1)) }),
      concatMap((queue) => { return this.localdb.SaveData<Array<Queue>>('queue',queue).pipe(take(1))}),
      map(() => {return QueueStoreActions.doQueue() } )
      
    )});

  doQueueEffect$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.doQueue),
      concatMap(()=> {return from(this.loadingController.create({message: "Send to 1C",keyboardClose:true,spinner: "lines"}))}),
      withLatestFrom(this.store.pipe(select(PingStatus))),
      /// если статус плох вызываем действие пустышку "провал" 
      tap((data) => { 
          if (!data[1]) {
            return QueueStoreActions.doQueueFailure()
          }}),
      //// дальше идем только если статус хорош
      filter(data => data[1]) ,   
      withLatestFrom(this.store.pipe(select(selectAllQueue))),
      concatMap((data) => {
          data[0][0].present();
          return this.webdb.doQueue(data[1]).pipe(
            /////   тут нужено обработать ответ или это конкретный заказ или весь холл стэйт
            /////   после успешной чистки очереди обновляем зал  см delQueueEffect
            map((response)=> {
              const newQ : Array<Queue> = JSON.parse(response); 
              if (newQ.length === 0) {
                return QueueStoreActions.delQueue()  
              } else {
                
                return QueueStoreActions.UpdateQueue({data: newQ})
              }
             
              
            
            }),
            catchError((err) => { return of(QueueStoreActions.doQueueFailure())} ),
            tap(()=> data[0][0].dismiss())
          )
      } )
    )});  


  delQueueEffect$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.delQueue),
      tap(() => { this.localdb.DellItem('queue')} ),
      map(()=> {return refreshHallstates()} )
    )});    


  updateQueueEffect$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(QueueStoreActions.UpdateQueue),
      tap((props) => { this.localdb.SaveData('queue',props.data) } )
    )},
    { dispatch: false });    


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
