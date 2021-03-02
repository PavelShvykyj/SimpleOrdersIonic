import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loggOut } from 'src/app/authtorisation/auth.actions';
import { State } from 'src/app/reducers';

@Component({
  selector: 'app-block-app',
  templateUrl: './block-app.page.html',
  styleUrls: ['./block-app.page.scss'],
})
export class BlockAppPage implements OnInit {

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.store.dispatch(loggOut());
  }
  
}
