import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { AuthState } from './authtorisation/reducers';
import { Orderitem } from './home/halls/hall-state-store/hallstate.reducer';
import { Queue } from './queue/queue-store.reducer';
import { State } from './reducers';
import { selectLoginState } from './authtorisation/auth.selectors';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { inQueue } from './queue/queue-store.actions';
import { selectisDevMode } from './appsettings/app-settings.selectors';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(
    private store: Store<State>,
    public ctrl : ToastController

  ) { }


  CheckPerpission(action:Action) : Observable<boolean> {
    return this.store.pipe(select(selectLoginState),
    withLatestFrom(this.store.pipe(select(selectisDevMode))),
    map(datamap=> {
      const isDevmode = datamap[1];
      let data = datamap[0];
      if (isDevmode) {
        return {isAllowed: true, action}
      }

      let authState : AuthState = data;
      let isAllowed : boolean = true;
      const askActiontype = action.type;
      let resoult = {action,isAllowed  }
      switch (askActiontype) {
          case inQueue.type:
              resoult = this.CheckInQueueAction(action,authState)
              break;
          default:
              break;
      }
      return resoult
  }),
  tap((res)=> {
    if (!res.isAllowed) {
      this.ShowAccesDenied()
    }
  }),
  map((res)=> {
    return res.isAllowed
  }))
}

ShowAccesDenied() {
  this.ctrl.create({
    message: 'Действие запрещено',
    duration:3000,
    position:'middle',
    color: 'danger'}).then(el=>el.present());
}




CheckInQueueAction(action ,authState:AuthState ) : {action:Action ,isAllowed:boolean } {
  
  let isAllowed = false;
  const q : Queue = action.data;
  
  let items : Array<Orderitem> = q.commandParametr.items;
  if (items.length === 0) {
      /// empty order
      return {action, isAllowed: false}
  }

  let context : 'allowed' | 'afterPrint' | 'afterPrecheck' =  'allowed';
  const checkOnlySelectedRows = !!q.commandParametr.checkOnlySelectedRows;
  items = items.filter(el => {return (!checkOnlySelectedRows || !!el.isSelected)});
  
  
  items.forEach(el=> {
      if (el.isprecheck) {
          context = 'afterPrecheck';
      }

      if (el.quantityprint != 0) {
          context = context === 'afterPrecheck' ? 'afterPrecheck' : 'afterPrint';
      }

  })
  console.log('check command', q.command);
  console.log('check context', context);
  isAllowed = !!authState.Permissions[q.command][context];

  return {action, isAllowed}
}
}


