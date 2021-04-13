import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromQueueStore from './queue-store.reducer';

export const selectQueueStoreState = createFeatureSelector<fromQueueStore.QueueStore>(
  fromQueueStore.queueStoreFeatureKey
);

export const selectAllQueue = createSelector(
  selectQueueStoreState,
  fromQueueStore.selectAll
)

export const selectQueueLenth = createSelector(
  selectAllQueue,
  elements => elements.length
)
