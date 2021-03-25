import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMenuStore from './menu-store.reducer';

export const selectMenuStoreState = createFeatureSelector<fromMenuStore.MenuStore>(
  fromMenuStore.menuStoreFeatureKey
);

export const selectAllMenuEntities = createSelector(
  selectMenuStoreState,
  fromMenuStore.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectMemuByid = createSelector(
  selectAllMenuEntities,
  (entities,id) => {return entities[id]}
)

export const selectAllMenu = createSelector(
  selectMenuStoreState,
  fromMenuStore.selectAll
)