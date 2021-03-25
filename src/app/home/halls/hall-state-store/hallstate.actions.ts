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

export const refreshHallstatesSuccess = createAction(
  '[Hallstate] refresh Hallstates Success',
  props<{ data: HallsState }>()
);

export const refreshHallstatesFailure = createAction(
  '[Hallstate] refresh Hallstates Failure',
  props<{ error: any }>()
);



export const loadHallstatesFailure = createAction(
  '[Hallstate] Load Hallstates Failure',
  props<{ error: any }>()
);

export const loadSnapshotHallState = createAction(
  '[Hallstate App component] Load HallstateSnapshot '
);

export const saveHallstates = createAction(
  '[SaveHallstate]  Hallstates effect',
  props<{ data: HallsState }>()
);