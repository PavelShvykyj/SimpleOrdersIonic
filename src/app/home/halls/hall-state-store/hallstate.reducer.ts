import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as HallstateActions from './hallstate.actions';

export const hallstateFeatureKey = 'hallstate';

export interface TableHeader {
  waitername: string,
  summ: number,
  modified: Date,
  status: string,
  rowshash: Array<string>
}

export interface Table {
  id: string,
  ownerid: string,
  name : string,
  orderid: string,
  header: TableHeader
}

export interface HallsState extends EntityState<Table> {
}

export const adapter: EntityAdapter<Table> = createEntityAdapter<Table>();

export const initialState: HallsState = adapter.getInitialState();


export const reducer = createReducer(
  initialState,

  on(HallstateActions.loadHallstates, state => state),
  on(HallstateActions.loadHallstatesSuccess, (state, action) => state),
  on(HallstateActions.loadHallstatesFailure, (state, action) => state),

);

export const {selectAll, selectEntities} = adapter.getSelectors();

export function hallstatereducer(state: HallsState | undefined, action: Action) {
  return reducer(state, action);
}