import { createAction, props } from '@ngrx/store';
import { HallsState } from './hallstate.reducer';

export const loadHallstates = createAction(
  '[Hallstate] Load Hallstates'
);

export const refreshHallstates = createAction(
  '[Hallstate] Refresh Hallstates'
);

export const loadHallstatesSuccess = createAction(
  '[Hallstate] Load Hallstates Success',
  props<{ data: HallsState }>()
);

export const loadHallstatesFailure = createAction(
  '[Hallstate] Load Hallstates Failure',
  props<{ error: any }>()
);
