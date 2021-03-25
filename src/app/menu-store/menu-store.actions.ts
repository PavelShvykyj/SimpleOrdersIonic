import { createAction, props } from '@ngrx/store';

export const loadMenuStores = createAction(
  '[MenuStore] Load MenuStores'
);

export const refreshMenuStores = createAction(
  '[MenuStore] Refresh Hallsstores in halls component'
);

export const loadMenuStoresSuccess = createAction(
  '[MenuStore] Load MenuStores Success',
  props<{ data: any }>()
);

export const loadMenuStoresFailure = createAction(
  '[MenuStore] Load MenuStores Failure',
  props<{ error: any }>()
);
