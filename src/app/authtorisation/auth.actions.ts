import { createAction, props } from '@ngrx/store';
import { AuthState } from './reducers';

export const loggOut = createAction(
  '[BLOCK PAGE] Log out'
);

export const loggIn = createAction(
  '[AUTH PAGE] logg in',
  props<{ data :  AuthState  }>()
);

