import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as AppSettingsActions from './app-settings.actions';
import { DatabaseService } from '../database/database.service';
import { ToastController } from '@ionic/angular';
import { SettingsState } from './app-settings.reducer';


@Injectable()
export class AppSettingsEffects {

  loadAppSettingss$ = createEffect(() => {
    return this.actions$.pipe(

      ofType(AppSettingsActions.loadAppSettings),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.db_service.GetData<SettingsState>('appsettings').pipe(
          map(data => AppSettingsActions.loadAppSettingssSuccess(data)),
          catchError(error => of(AppSettingsActions.loadAppSettingssFailure({ error }))))
      )
    );
  });

  saveAppSettings$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AppSettingsActions.setAppSettings),
        
        mergeMap(action =>
          
          this.db_service.SaveData<SettingsState>(action.key, action.data).pipe(
            map((action) =>{
              
              this.ShowToast('Saved','primary',400);
              return AppSettingsActions.onAppSettingsSet(
              { onecIP: action.onecIP, onecBase: action.onecBase, isDevMode: action.isDevMode})}),
            catchError(error =>{
              
              this.ShowToast('not saved','danger',1500);
              return of(AppSettingsActions.loadAppSettingssFailure({ error }))}))
        )
      );
    });

  constructor(private actions$: Actions, private db_service: DatabaseService, public toastController: ToastController) { }

  ShowToast(message : string, Color: string,duration:number) {
    this.toastController.create({message: message,
                                duration:duration,
                                color: Color}).then(el=>el.present());
  }

  


}
