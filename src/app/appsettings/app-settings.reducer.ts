import { Action, createReducer, on, State, Store } from '@ngrx/store';
import * as AppSettingsActions from './app-settings.actions';

export const appSettingsFeatureKey = 'appSettings';

export interface SettingsState {
  onecIP: string,
  onecBase : string

}

export const initialState: SettingsState = {
  onecIP: '127.0.0.1',
  onecBase : 'fakebase'

};


export const reducer = createReducer(
  initialState,
  on(AppSettingsActions.onAppSettingsSet, (state, action) => {return {onecIP:action.onecIP, onecBase: action.onecBase}}),
  on(AppSettingsActions.loadAppSettings, state => state),
  on(AppSettingsActions.loadAppSettingssSuccess, (state, action) =>  {return {onecIP:action.onecIP, onecBase: action.onecBase}}),
  on(AppSettingsActions.loadAppSettingssFailure, (state, action) => state),

);

export function settingsreducer(state: SettingsState | undefined, action: Action) {
  return reducer(state, action);
}