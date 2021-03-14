import {
  Action,
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { loggIn, loggOut } from '../auth.actions';

export const authtorisationFeatureKey = 'authtorisation';

export interface AuthState {
  isLoggedIn: boolean,
  UserToken : string,
  UserName  : string
}

export const InitialState : AuthState = {
  isLoggedIn: false,
  UserToken : '',
  UserName  : '' 
}


export const AuthReducer = createReducer(
  InitialState,
  on(loggOut,(state,action)=>{return {...state, isLoggedIn:false, UserToken: "", UserName: "not login"}}),
  on(loggIn,(state,action)=>{return {...state,isLoggedIn:true, UserToken: action.UserToken, UserName: action.UserName}}),
  );

export function authreducer(state: AuthState | undefined, action: Action) {
    return AuthReducer(state, action);
}




export const metaReducers: MetaReducer<AuthState>[] = !environment.production ? [] : [];
