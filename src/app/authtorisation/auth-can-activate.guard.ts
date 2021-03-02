import { isLoggedIn, selectAuthState } from './auth.selectors';
import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { State } from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthCanActivateGuard implements CanActivate , OnDestroy {
  isLoggedInSubs : Subscription;
  
  constructor(private router : Router, private store: Store<State>) {
    
    
  }
  
  ngOnDestroy() {
     this.isLoggedInSubs.unsubscribe(); 
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const canActivate$ : Observable<boolean> = this.store.pipe(select(isLoggedIn));
      this.isLoggedInSubs = canActivate$.subscribe(isLoggedIn=> { 
        if (!isLoggedIn) {
         this.router.navigateByUrl('/home/block-app'); 
        }
       })
      
      return canActivate$;
  }
  
}
