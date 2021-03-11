import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as HallsstoreActions from './hallsstore.actions';



@Injectable()
export class HallsstoreEffects {

  loadHallsstores$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(HallsstoreActions.loadHallsstores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => HallsstoreActions.loadHallsstoresSuccess({ data })),
          catchError(error => of(HallsstoreActions.loadHallsstoresFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
