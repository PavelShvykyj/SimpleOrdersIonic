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
  isBlocked: boolean,
  unitSaleCount : number,
  unitName: string
  }

  function sortByNameFoldersFirst(a:Menu,b:Menu) : number {
    const folrerSort = (a.isFolder === b.isFolder)? 0 : a.isFolder? -1 : 1;
    if (folrerSort != 0) {
      return folrerSort
    }
    
    // /// here a , b - same or both folder or both items
    // const countSort = !a.isFolder ?  0 : 
    // a.unitSaleCount === b.unitSaleCount ? 0 : 
    // a.unitSaleCount> b.unitSaleCount ? -1 : 1;  
    // if (countSort != 0) {
    //   return countSort
    // }

    const nameSort = (a.name.toUpperCase()).localeCompare(b.name.toUpperCase());
    return nameSort;
  } 

  export interface MenuStore extends EntityState<Menu> {}  

export const adapter: EntityAdapter<Menu> = createEntityAdapter<Menu>({
  sortComparer: sortByNameFoldersFirst,
});

export const initialState = adapter.getInitialState();






export const reducer = createReducer(
  initialState,

  on(MenuStoreActions.loadMenuStores, state => state),
  on(MenuStoreActions.loadMenuStoresSuccess, (state, action) => adapter.setAll(action.data,state)),
  on(MenuStoreActions.loadMenuStoresFailure, (state, action) => state),

);

export const {selectAll, selectEntities} = adapter.getSelectors();

export function menustorereducer(state: MenuStore | undefined, action: Action) {
  return reducer(state, action);
}
