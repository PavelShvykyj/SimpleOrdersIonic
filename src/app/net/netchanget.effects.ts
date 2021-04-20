import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as NetActions from './netcontrol.actions';
import { NetcontrolService } from './netcontrol.service';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';
import { selectOnecIP } from '../appsettings/app-settings.selectors';



@Injectable()
export class NetchangetEffects {

  SetIpOnNetTypeChanged$ = createEffect(() => {
    return this.actions$.pipe( 
     ofType(NetActions.loadNetcontrols),
     concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        this.netservice.GetIP().pipe(
          map(data =>{  return NetActions.setIP({ IP: data.ip } )}),
          catchError(error => of(NetActions.setIP({ IP: "0.0.0.0" }))))
      )
    );
  });

  SetNetCorrectOnIpChanged$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NetActions.setIP),
      concatMap(() =>this.store.pipe(select(selectOnecIP))),
      map(onecip => NetActions.setNetCorrect({onecip}))
    )
  })
  


  constructor(private actions$: Actions, private netservice : NetcontrolService,private store: Store<State> ) {}

}
