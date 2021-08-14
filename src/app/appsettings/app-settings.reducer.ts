import { Action, createReducer, on, State, Store } from '@ngrx/store';
import * as AppSettingsActions from './app-settings.actions';

export const appSettingsFeatureKey = 'appSettings';

export interface SettingsState {
  onecIP: string,
  onecBase : string,
  isDevMode:boolean

}

//0.101
export const initialState: SettingsState = {
  onecIP: '192.168.0.101',
  onecBase: 'SimplePUB',
  isDevMode: false

};


export const reducer = createReducer(
  initialState,
  on(AppSettingsActions.onAppSettingsSet, (state, action) => {return {onecIP:action.onecIP, onecBase: action.onecBase, isDevMode:action.isDevMode}}),
  on(AppSettingsActions.loadAppSettings, state => state),
  on(AppSettingsActions.loadAppSettingssSuccess, (state, action) =>  {return {onecIP:action.onecIP, onecBase: action.onecBase, isDevMode:action.isDevMode}}),
  on(AppSettingsActions.loadAppSettingssFailure, (state, action) => state),

);

export function settingsreducer(state: SettingsState | undefined, action: Action) {
  return reducer(state, action);
}