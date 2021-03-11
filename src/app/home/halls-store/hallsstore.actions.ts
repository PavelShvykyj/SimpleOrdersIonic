import { createAction, props } from '@ngrx/store';

export const loadHallsstores = createAction(
  '[Hallsstore] Load Hallsstores'
);

export const loadHallsstoresSuccess = createAction(
  '[Hallsstore] Load Hallsstores Success',
  props<{ data: any }>()
);

export const loadHallsstoresFailure = createAction(
  '[Hallsstore] Load Hallsstores Failure',
  props<{ error: any }>()
);
