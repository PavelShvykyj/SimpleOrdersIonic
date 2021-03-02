import { isLoggedIn } from './../authtorisation/auth.selectors';
import { Observable, of } from 'rxjs';
import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isLoggedin$ : Observable<boolean>;

  constructor(private store: Store<State>) {
      this.isLoggedin$ = this.store.pipe(select(isLoggedIn));  
  }



}
