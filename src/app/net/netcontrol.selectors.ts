import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNetcontrol from './netcontrol.reducer';

export const selectNetcontrolState = createFeatureSelector<fromNetcontrol.NetState>(
  fromNetcontrol.netcontrolFeatureKey
);

export const isConnected = createSelector(
  selectNetcontrolState,
  state => state.isConnected
) 

export const selectnettype = createSelector(
  selectNetcontrolState,
  state => state.netType
) 

export const appIP = createSelector(
  selectNetcontrolState,
  state => state.IP
) 

export const PingStatus = createSelector(
  selectNetcontrolState,
  state => state.ServerPingStatus
) 


export const isNetworkCorrect = createSelector(
  selectNetcontrolState,
  state => state.NetworkCorrect
) 
