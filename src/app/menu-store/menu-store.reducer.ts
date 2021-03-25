import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as MenuStoreActions from './menu-store.actions';

export const menuStoreFeatureKey = 'menuStore';

export interface Menu {
  id: string,
  isFolder: boolean,
  parentid: string, 
  name: string,
  price: string,
  isBlocked: boolean
  unitName: string
  }

  export interface MenuStore extends EntityState<Menu> {}  

export const adapter: EntityAdapter<Menu> = createEntityAdapter<Menu>();

export const initialState = adapter.getInitialState();






export const reducer = createReducer(
  initialState,

  on(MenuStoreActions.loadMenuStores, state => state),
  on(MenuStoreActions.loadMenuStoresSuccess, (state, action) => state),
  on(MenuStoreActions.loadMenuStoresFailure, (state, action) => state),

);

export const {selectAll, selectEntities} = adapter.getSelectors();

export function menustorereducer(state: MenuStore | undefined, action: Action) {
  return reducer(state, action);
}
