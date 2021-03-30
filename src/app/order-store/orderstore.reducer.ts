import { Action, createReducer, on } from '@ngrx/store';
import * as OrderstoreActions from './orderstore.actions';

export const orderstoreFeatureKey = 'orderstore';

export interface OrderState {

}

export const initialState: OrderState = {

};


export const reducer = createReducer(
  initialState,

  on(OrderstoreActions.loadOrderstores, state => state),
  on(OrderstoreActions.loadOrderstoresSuccess, (state, action) => state),
  on(OrderstoreActions.loadOrderstoresFailure, (state, action) => state),

);

export function orderstorereducer(state: OrderState | undefined, action: Action) {
  return reducer(state, action);
}

