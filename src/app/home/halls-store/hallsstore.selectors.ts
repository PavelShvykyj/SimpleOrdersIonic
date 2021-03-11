import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHallstore from './hallsstore.reducer';


export const selectHallstoreState = createFeatureSelector<fromHallstore.HallsStore>(
  fromHallstore.hallstoreFeatureKey
);

export const selectAllHallEntities = createSelector(
  selectHallstoreState,
  fromHallstore.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectHallByid = createSelector(
  selectAllHallEntities,
  (entities,id) => {return entities[id]}
)

export const selectAllHalls = createSelector(
  selectHallstoreState,
  fromHallstore.selectAll
)