import { loadAppSettings } from './appsettings/app-settings.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NetcontrolService } from './net/netcontrol.service';
import { State } from './reducers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private netservise : NetcontrolService,private store: Store<State>) {
    
  }

  ngOnInit() {
    this.netservise.isOnline("");
    this.store.dispatch(loadAppSettings());

  }

}
