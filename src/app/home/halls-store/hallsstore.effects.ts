import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import {  from, of } from 'rxjs';

import * as HallsstoreActions from './hallsstore.actions';
import { DatabaseService } from 'src/app/database/database.service';
import { OnecConnectorService } from 'src/app/onec/onec.connector.service';
import { Hall } from './hallsstore.reducer';
import { LoadingController } from '@ionic/angular';



@Injectable()
export class HallsstoreEffects {

  loadIndicator: HTMLIonLoadingElement;


  //refreshHallsstores
  refreshHallsstores$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(HallsstoreActions.refreshHallsstores),
      concatMap(()=> { return from(this.loadingController.create({message: "Loading hals",keyboardClose:true,spinner: "lines"}))}),
      concatMap((el) => {
        el.present();
        return this.webdb.GetHalls().pipe(
          /// положили полученное в харнилище
          tap((updhall)=> {
            this.localdb.SaveData<Array<Hall>>('halls',updhall)
          }),
          ///продолжили поток акшенов
          map((updhall)=> {el.dismiss(); return HallsstoreActions.loadHallsstoresSuccess({data:updhall})}),
          catchError(error => {el.dismiss(); return of(HallsstoreActions.loadHallsstoresFailure({error: ''}))})
        )
      }))});


      loadHallsstores$ = createEffect(() => {
        return this.actions$.pipe( 
          /// фильтруем событие
          ofType(HallsstoreActions.loadHallsstores),
          /// создаем елемент спиннера
          concatMap(()=> { return from(this.loadingController.create({message: "Loading hals",keyboardClose:true,spinner: "lines"}))}),
          /// обращемся к локальному хранилищу
          concatMap((el) => {
            this.loadIndicator = el;
            this.loadIndicator.present();
            return this.localdb.GetData<Array<Hall>>('halls').pipe(
              catchError(error =>  of([])  )
          )}),
          /// если локальное хранилище вернуло путототу или ошибка обращаемся к 1с 
          concatMap((halls,el)=>{
            if (halls.length===0) {
              return this.webdb.GetHalls().pipe(
                /// положили полученное в харнилище
                tap((updhall)=> {this.localdb.SaveData<Array<Hall>>('halls',updhall)}),
                ///продолжили поток акшенов
                map((updhall)=> {this.loadIndicator.dismiss();  return HallsstoreActions.loadHallsstoresSuccess({data:updhall})}),
                catchError(error => {this.loadIndicator.dismiss(); return of(HallsstoreActions.loadHallsstoresFailure({error: ''}))})
              )
            } else {
              this.loadIndicator.dismiss();
              return  of(HallsstoreActions.loadHallsstoresSuccess({data:halls}))
            }
          })
        );
      });
    
    
 

  constructor(private actions$: Actions,
              private localdb : DatabaseService,
              private webdb : OnecConnectorService,
              public loadingController: LoadingController
              ) {}

}
