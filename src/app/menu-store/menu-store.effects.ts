import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, tap } from 'rxjs/operators';
import { EMPTY, from, of } from 'rxjs';

import * as MenuStoreActions from './menu-store.actions';
import { DatabaseService } from '../database/database.service';
import { OnecConnectorService } from '../onec/onec.connector.service';
import { LoadingController } from '@ionic/angular';
import { Menu } from './menu-store.reducer';



@Injectable()
export class MenuStoreEffects {

  loadIndicator: HTMLIonLoadingElement;


  //refreshHallsstores
  refreshHallsstores$ = createEffect(() => {
    return this.actions$.pipe( 
      /// фильтруем событие
      ofType(MenuStoreActions.refreshMenuStores),
      concatMap(()=> { return from(this.loadingController.create({message: "Loading menu",keyboardClose:true,spinner: "lines"}))}),
      concatMap((el) => {
        el.present();
        return this.webdb.GetMenu().pipe(
          /// положили полученное в харнилище
          tap((updmenu)=> {
            this.localdb.SaveData<Array<Menu>>('menu',updmenu)
          }),
          ///продолжили поток акшенов
          map((updhall)=> {el.dismiss(); return MenuStoreActions.loadMenuStoresSuccess({data:updhall})}),
          catchError(error => {el.dismiss(); return of(MenuStoreActions.loadMenuStoresFailure({error: ''}))})
        )
      }))});


      loadHallsstores$ = createEffect(() => {
        return this.actions$.pipe( 
          /// фильтруем событие
          ofType(MenuStoreActions.loadMenuStores),
          /// создаем елемент спиннера
          concatMap(()=> { return from(this.loadingController.create({message: "Loading menu",keyboardClose:true,spinner: "lines"}))}),
          /// обращемся к локальному хранилищу
          concatMap((el) => {
            this.loadIndicator = el;
            this.loadIndicator.present();
            return this.localdb.GetData<Array<Menu>>('menu').pipe(
              catchError(error =>  of([])  )
          )}),
          /// если локальное хранилище вернуло путототу или ошибка обращаемся к 1с 
          concatMap((menu,el)=>{
            if (menu.length===0) {
              return this.webdb.GetMenu().pipe(
                /// положили полученное в харнилище
                tap((updmenu)=> {this.localdb.SaveData<Array<Menu>>('menu',updmenu)}),
                ///продолжили поток акшенов
                map((updmenu)=> {this.loadIndicator.dismiss();  return MenuStoreActions.loadMenuStoresSuccess({data:updmenu})}),
                catchError(error => {this.loadIndicator.dismiss(); return of(MenuStoreActions.loadMenuStoresFailure({error: ''}))})
              )
            } else {
              this.loadIndicator.dismiss();
              return  of(MenuStoreActions.loadMenuStoresSuccess({data:menu}))
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
