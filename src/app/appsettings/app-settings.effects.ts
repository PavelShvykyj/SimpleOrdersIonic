import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as AppSettingsActions from './app-settings.actions';



@Injectable()
export class AppSettingsEffects {

  loadAppSettingss$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(AppSettingsActions.loadAppSettingss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => AppSettingsActions.loadAppSettingssSuccess({ data })),
          catchError(error => of(AppSettingsActions.loadAppSettingssFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
