import { createAction, props } from '@ngrx/store';

export const loadHallstates = createAction(
  '[Hallstate] Load Hallstates'
);

export const loadHallstatesSuccess = createAction(
  '[Hallstate] Load Hallstates Success',
  props<{ data: any }>()
);

export const loadHallstatesFailure = createAction(
  '[Hallstate] Load Hallstates Failure',
  props<{ error: any }>()
);
