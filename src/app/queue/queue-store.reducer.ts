import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as QueueStoreActions from './queue-store.actions';

export const queueStoreFeatureKey = 'queueStore';

export interface QueueStore extends EntityState<Queue> {}  

export interface Queue {
  id: string,
  command : string,
  commandParametr : Object
  commandDate : Date,
  gajet: string
}

export const adapter: EntityAdapter<Queue> = createEntityAdapter<Queue>({
  
});

export const initialState = adapter.getInitialState();

export const reducer = createReducer(
  initialState,

  on(QueueStoreActions.loadQueueStores, state => state),
  on(QueueStoreActions.loadQueueStoresSuccess, (state, action) =>  adapter.setAll(action.data,state)),
  on(QueueStoreActions.inQueue,(state, action) => adapter.addOne(action.data,state)),
  on(QueueStoreActions.delQueue,(state, action) => adapter.getInitialState()),
  on(QueueStoreActions.loadQueueStoresFailure, (state, action) => state),

);


export const {selectAll, selectEntities} = adapter.getSelectors();

export function queuestorereducer(state: QueueStore | undefined, action: Action) {
  return reducer(state, action);
}

