import { createAction, props } from '@ngrx/store';
import { Hall } from './hallsstore.reducer';

export const loadHallsstores = createAction(
  '[Hallsstore] Load Hallsstores in app component'
);

export const refreshHallsstores = createAction(
  '[Hallsstore] Load Hallsstores in halls component'
);



export const getHallsstore = createAction(
  '[Hallsstore] Get Hallsstores in get effect',
  props<{ data: Array<Hall> }>()
);


export const loadHallsstoresSuccess = createAction(
  '[Hallsstore] Load Hallsstores Success in effect',
  props<{ data: Array<Hall> }>()
);

export const loadHallsstoresFailure = createAction(
  '[Hallsstore] Load Hallsstores Failure in effect',
  props<{ error: any }>()
);
