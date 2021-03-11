import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromOrderstore from './orderstore.reducer';

export const selectOrderstoreState = createFeatureSelector<fromOrderstore.State>(
  fromOrderstore.orderstoreFeatureKey
);
