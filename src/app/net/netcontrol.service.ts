import { Injectable, OnDestroy } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Store } from '@ngrx/store';
import { Subscription, Observable, of, from } from 'rxjs';
import { debounceTime, concatMap } from 'rxjs/operators';
import { State } from '../reducers';
import { loadNetcontrols } from './netcontrol.actions';



@Injectable({
  providedIn: 'root'
})
export class NetcontrolService implements OnDestroy {
  netSubs : Subscription;

  constructor(private net : Network, private netIP :NetworkInterface , private store: Store<State>) {
    this.store.dispatch(loadNetcontrols({netType: this.net.type, isConnected : this.isOnline(this.net.type)}));
    
    
    this.netSubs = this.net.onChange().pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.store.dispatch(
        loadNetcontrols({netType: this.net.type, isConnected : this.isOnline(this.net.type)}))
    });
   }

   isOnline(netType) {
    return netType === this.net.Connection.WIFI; //!(netType === this.net.Connection.NONE || netType === this.net.Connection.UNKNOWN || netType === null);
  }

  GetIP() : Observable<any> {
    return from( this.netIP.getWiFiIPAddress());
  }
  

  ngOnDestroy() {
    
    this.netSubs.unsubscribe();


  }
}
