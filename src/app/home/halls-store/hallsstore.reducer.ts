import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as HallsstoreActions from './hallsstore.actions';

export const hallstoreFeatureKey = 'hallstore';

export interface Hall {
  id: string,
  name : string
};

export interface HallsStore extends EntityState<Hall> {
};

export const adapter: EntityAdapter<Hall> = createEntityAdapter<Hall>();

export const initialState: HallsStore = adapter.getInitialState();


export const reducer = createReducer(
  initialState,

  on(HallsstoreActions.loadHallsstores, state => state),
  on(HallsstoreActions.loadHallsstoresSuccess, (state, action) => state),
  on(HallsstoreActions.loadHallsstoresFailure, (state, action) => state),

);

export const {selectAll, selectEntities} = adapter.getSelectors();

export function hallstorereducer(state: HallsStore | undefined, action: Action) {
  return reducer(state, action);
}