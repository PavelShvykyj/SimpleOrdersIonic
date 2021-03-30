import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as OrderstoreActions from './orderstore.actions';



@Injectable()
export class OrderstoreEffects {

  loadOrderstores$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(OrderstoreActions.loadOrderstores),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => OrderstoreActions.loadOrderstoresSuccess({ data })),
          catchError(error => of(OrderstoreActions.loadOrderstoresFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
