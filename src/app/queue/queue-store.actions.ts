import { createAction, props } from '@ngrx/store';
import { Queue } from './queue-store.reducer';

export const loadQueueStores = createAction(
  '[QueueStore] Load QueueStores'
);

export const loadQueueStoresSuccess = createAction(
  '[QueueStore] Load QueueStores Success',
  props<{ data: any }>()
);

export const loadQueueStoresFailure = createAction(
  '[QueueStore] Load QueueStores Failure',
  props<{ error: any }>()
);

export const inQueue = createAction(
  '[QueueStore] add command in queue',
  props<{ data : Queue }>()
);

export const UpdateQueue = createAction(
  '[QueueStore] update  queue',
  props<{ data : Array<Queue> }>()
);


export const inQueueSuccess = createAction(
  '[QueueStore] add command in queue',
  props<{ data : Queue }>()
);

export const inQueueFailure = createAction(
  '[QueueStore] add command in queue',
  props<{ data : Queue }>()
);

export const doQueue = createAction(
  '[QueueStore] send queue to backend',
);

export const doQueueFailure = createAction(
  '[QueueStore] send queue to backend failure',
);

export const delQueue = createAction(
  '[QueueStore] clear queue',
);

export const delQueueSuccess = createAction(
  '[QueueStore] dell queue sucsess',
);




