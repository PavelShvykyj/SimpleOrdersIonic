import { createAction, props } from '@ngrx/store';

export const loggOut = createAction(
  '[BLOCK PAGE] Log out'
);

export const loggIn = createAction(
  '[AUTH PAGE] logg in',
  props<{ UserName : string, UserToken : string    }>()
);

