import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  Store } from '@ngrx/store';
import { State } from '../reducers';
import { loggIn } from './auth.actions';

@Component({
  selector: 'app-authtorisation',
  templateUrl: './authtorisation.page.html',
  styleUrls: ['./authtorisation.page.scss'],
})
export class AuthtorisationPage implements OnInit {

  constructor(private store: Store<State>, private router : Router) { }

  ngOnInit() {
  }

  Loggin() {
    this.store.dispatch(loggIn({UserName: "Demo", UserToken : "TokenDemo" }));
    setTimeout(() => {
      this.router.navigateByUrl('home/halls');
    }, 10);
    
    
  }


}
