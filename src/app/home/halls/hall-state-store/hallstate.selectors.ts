import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHallstate from './hallstate.reducer';

export const selectHallstateState = createFeatureSelector<fromHallstate.HallsState>(
  fromHallstate.hallstateFeatureKey
);

export const selectAllHallEntities = createSelector(
  selectHallstateState,
  fromHallstate.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectHallByid = createSelector(
  selectAllHallEntities,
  (entities,id) => {return entities[id]}
)

export const selectAllHalls = createSelector(
  selectHallstateState,
  fromHallstate.selectAll
)