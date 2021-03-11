import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as HallstateActions from './hallstate.actions';



@Injectable()
export class HallstateEffects {

  loadHallstates$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(HallstateActions.loadHallstates),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => HallstateActions.loadHallstatesSuccess({ data })),
          catchError(error => of(HallstateActions.loadHallstatesFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
