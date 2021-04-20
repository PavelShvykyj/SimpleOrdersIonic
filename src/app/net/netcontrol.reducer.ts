import { isLoggedIn } from './../authtorisation/auth.selectors';
import { Action, createReducer, on } from '@ngrx/store';
import * as NetcontrolActions from './netcontrol.actions';

export const netcontrolFeatureKey = 'netcontrol';

export interface NetState {
  netType : string,
  IP : string,
  isConnected : boolean,
  NetworkCorrect : boolean,
  ServerPingStatus : boolean,
  ServerPingAnswer : string,
  ServerPingTry : Date,

}

export const initialState: NetState = {
  netType : 'hz',
  IP : '127.0.0.1',
  isConnected : false,
  NetworkCorrect : true,
  ServerPingStatus : false,
  ServerPingAnswer : "",
  ServerPingTry : new Date(),

};

function SetNetCorrect(state : NetState ,onecip : string) : NetState {
  return {...state, NetworkCorrect: true}

  try {
    const subNet = state.IP.split(".")[2];
    const subNetOnec = onecip.split(".")[2];
  
    return {...state,  NetworkCorrect: (subNet === subNetOnec)}    
  } catch (error) {
    
    return {...state,  NetworkCorrect: false}    
  }

}

export const NetReducer = createReducer(
  initialState,
  on(NetcontrolActions.loadNetcontrols, (state,action) => {return {...state,  netType: action.netType, isConnected: action.isConnected }}),
  on(NetcontrolActions.setIP, (state,action) => {return {...state, IP:action.IP}}),
  on(NetcontrolActions.setNetCorrect,  (state,action) => SetNetCorrect(state,action.onecip)),
  on(NetcontrolActions.setPing, (state,action) => {return {...state, ServerPingStatus:action.status, ServerPingTry: new Date(), ServerPingAnswer : action.answer  }}),
 
);

export function netreducer(state: NetState | undefined, action: Action) {
  return NetReducer(state, action);
}
