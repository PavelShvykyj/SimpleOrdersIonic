import { createAction, props } from '@ngrx/store';

export const loadAppSettingss = createAction(
  '[AppSettings] Load AppSettingss'
);

export const loadAppSettingssSuccess = createAction(
  '[AppSettings] Load AppSettingss Success',
  props<{ data: any }>()
);

export const loadAppSettingssFailure = createAction(
  '[AppSettings] Load AppSettingss Failure',
  props<{ error: any }>()
);
