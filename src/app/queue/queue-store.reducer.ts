import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as QueueStoreActions from './queue-store.actions';

function QcomparerFn(el1: Queue, el2: Queue): number {
  if (el1.commandParametr.orderid > el2.commandParametr.orderid) {
    return 1
  } else if (el1.commandParametr.orderid < el2.commandParametr.orderid) {
    return -1
  } else {
    if (el1.version > el2.version) {
      return 1
    } else if (el1.version < el2.version) {
      return -1
    } else {
      return 0
    }
  }
}

export const queueStoreFeatureKey = 'queueStore';

export interface QueueStore extends EntityState<Queue> { }

export interface Queue {
  id: string,
  status?: string,
  command: string,
  commandParametr: any,
  commandDate: Date,
  gajet: string,
  version: number,
}

export const adapter: EntityAdapter<Queue> = createEntityAdapter<Queue>({
  sortComparer: QcomparerFn
});

export const initialState = adapter.getInitialState();

export const reducer = createReducer(
  initialState,

  on(QueueStoreActions.loadQueueStores, state => state),
  on(QueueStoreActions.loadQueueStoresSuccess, (state, action) => adapter.setAll(action.data, state)),
  on(QueueStoreActions.inQueue, (state, action) => adapter.addOne(action.data, state)),
  on(QueueStoreActions.delQueue, (state, action) => adapter.getInitialState()),
  on(QueueStoreActions.loadQueueStoresFailure, (state, action) => state),
  on(QueueStoreActions.UpdateQueue, (state, action) => adapter.setAll(action.data, state)),
);


export const { selectAll, selectEntities } = adapter.getSelectors();

export function queuestorereducer(state: QueueStore | undefined, action: Action) {
  return reducer(state, action);
}

