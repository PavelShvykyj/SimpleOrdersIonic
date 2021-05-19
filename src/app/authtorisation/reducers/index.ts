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

export interface Permissions {
  [key : string] : {
    allowed : boolean,
    afterPrint : boolean,
    afterPrecheck : boolean
  }
}

export interface AuthState {
  isLoggedIn: boolean,
  IsAdmin   : boolean,
  UserToken : string,
  UserName  : string,
  Permissions : Permissions
}

export const InitialState : AuthState = {
  isLoggedIn: false,
  UserToken : '',
  UserName  : '',
  IsAdmin   : false,
  Permissions : {} 
}


export const AuthReducer = createReducer(
  InitialState,
  on(loggOut,(state,action)=>{return InitialState}),
  on(loggIn,(state,action)=>{return action.data}),
  );

export function authreducer(state: AuthState | undefined, action: Action) {
    return AuthReducer(state, action);
}




export const metaReducers: MetaReducer<AuthState>[] = !environment.production ? [] : [];
