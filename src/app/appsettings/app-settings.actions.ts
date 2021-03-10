import { createAction, props } from '@ngrx/store';
import { SettingsState } from './app-settings.reducer';

export const loadAppSettings = createAction(
  '[AppSettings] Load AppSettingss'
);

export const loadAppSettingssSuccess = createAction(
  '[AppSettings] Load AppSettingss Success',
  props<SettingsState>()
);

export const loadAppSettingssFailure = createAction(
  '[AppSettings] Load AppSettingss Failure',
  props<{ error: any }>()
);

export const setAppSettings = createAction('[Set App settings settings page]', props<{key: string, data: SettingsState}>());
export const onAppSettingsSet = createAction('[On Set App settings settings effect]', props<SettingsState>());