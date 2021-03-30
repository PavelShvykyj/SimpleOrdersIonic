import { createAction, props } from '@ngrx/store';

export const loadOrderstores = createAction(
  '[Orderstore] Load Orderstores'
);

export const loadOrderstoresSuccess = createAction(
  '[Orderstore] Load Orderstores Success',
  props<{ data: any }>()
);

export const loadOrderstoresFailure = createAction(
  '[Orderstore] Load Orderstores Failure',
  props<{ error: any }>()
);
