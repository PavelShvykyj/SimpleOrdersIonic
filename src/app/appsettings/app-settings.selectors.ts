import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAppSettings from './app-settings.reducer';

export const selectAppSettingsState = createFeatureSelector<fromAppSettings.SettingsState>(
  fromAppSettings.appSettingsFeatureKey
);

export const selectAppSettings = createSelector(
  selectAppSettingsState,
  state => {return {...state}}
)

export const selectOnecIP = createSelector(
  selectAppSettingsState,
  state => state.onecIP
)
export const selectisDevMode = createSelector(
  selectAppSettingsState,
  state => state.isDevMode
)