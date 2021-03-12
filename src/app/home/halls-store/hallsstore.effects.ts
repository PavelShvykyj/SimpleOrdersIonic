import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import {  of } from 'rxjs';

import * as HallsstoreActions from './hallsstore.actions';
import { DatabaseService } from 'src/app/database/database.service';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';
import { Hall } from './hallsstore.reducer';



@Injectable()
export class HallsstoreEffects {


  //refreshHallsstores
  refreshHallsstores$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(HallsstoreActions.refreshHallsstores),
      concatMap(() => {
        return this.webdb.GetHalls().pipe(
          /// положили полученное в харнилище
          tap((updhall)=> {this.localdb.SaveData<Array<Hall>>('halls',updhall)}),
          ///продолжили поток акшенов
          map((updhall)=> HallsstoreActions.loadHallsstoresSuccess({data:updhall})),
          catchError(error => of(HallsstoreActions.loadHallsstoresFailure({error: ''})))
        )
      }))});



  loadHallsstores$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(HallsstoreActions.loadHallsstores),
      /// обращемся к локальному хранилищу
      concatMap(() => {
        return this.localdb.GetData<Array<Hall>>('halls').pipe(
          catchError(error =>  of([]))
      )}),
      /// если локальное хранилище вернуло путототу или ошибка обращаемся к 1с 
      concatMap((halls)=>{
        if (halls.length===0) {
          return this.webdb.GetHalls().pipe(
            /// положили полученное в харнилище
            tap((updhall)=> {this.localdb.SaveData<Array<Hall>>('halls',updhall)}),
            ///продолжили поток акшенов
            map((updhall)=> HallsstoreActions.loadHallsstoresSuccess({data:updhall})),
            catchError(error => of(HallsstoreActions.loadHallsstoresFailure({error: ''})))
          )
        } else {
          return of(HallsstoreActions.loadHallsstoresSuccess({data:halls}))
        }
      })
    );
  });



  constructor(private actions$: Actions,
              private localdb : DatabaseService,
              private webdb : OnecConnectorService
              ) {}

}
