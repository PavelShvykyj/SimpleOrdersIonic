import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './reducers/index';
import { AuthState } from './reducers/index';

export const selectAuthState = createFeatureSelector<AuthState>(fromAuth.authtorisationFeatureKey);

export const isLoggedIn = createSelector(
    selectAuthState,
    state => {return state.isLoggedIn} 
);


export const SelectUserName = createSelector(
    selectAuthState,
    state => state.UserName
);

export const SelectUserToken = createSelector(
    selectAuthState,
    state => state.UserToken
);

export const selectLoginState = createSelector(
    selectAuthState,
    state => state
);

