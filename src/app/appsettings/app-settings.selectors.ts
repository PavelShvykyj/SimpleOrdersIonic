import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAppSettings from './app-settings.reducer';

export const selectAppSettingsState = createFeatureSelector<fromAppSettings.SettingsState>(
  fromAppSettings.appSettingsFeatureKey
);

export const selectOnecIP = createSelector(
  selectAppSettingsState,
  state => state.onecIP
)