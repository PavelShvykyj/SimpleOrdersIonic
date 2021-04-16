import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { HallsState, Orderitem } from './hallstate.reducer';

export const loadHallstates = createAction(
  '[Hallstate] Load Hallstates'
);

export const refreshHallstates = createAction(
  '[Hallstate] Refresh Hallstates'
);

export const loadHallstatesSuccess = createAction(
  '[Hallstate] Load Hallstates Success',
  props<{ data: HallsState }>()
);

export const refreshHallstatesSuccess = createAction(
  '[Hallstate] refresh Hallstates Success',
  props<{ data: HallsState }>()
);

export const refreshHallstatesFailure = createAction(
  '[Hallstate] refresh Hallstates Failure',
  props<{ error: any }>()
);

export const SelectItem = createAction(
  '[Hallsstore] Select item in order page',
  props<{ data : Update<Orderitem>}>()
);  

/// прежде чем сохранить данные нужно где то  помнить изменения
export const ModifyOrderItem = createAction(
  '[Hallsstore] Modify item in order page',
  props<{ data : Update<Orderitem>, kaskad: {rowid: string , orderid: string, hallid: string, tableid: string}}>()
);  

export const UpdateOrderItemsValues = createAction(
  '[Hallsstore] Update Order Items Values in order page',
  props<{ data :Update<Orderitem>[]}>());

export const AddOrderOntable = createAction(
  '[Hallsstore] Add order on table in order page', 
   props<{hallid: string, orderid: string, tableid: string}>()
  );  
  
export const AddRowInOrder = createAction(
    '[Hallsstore] Add row on order in order page', 
     props<{orderid: string , rowid: string}>()
);

export const AddRow = createAction(
  '[Hallsstore] Add row  in order page', 
   props<{data : Orderitem, kaskad: {rowid: string , orderid: string , hallid: string, tableid: string}}>()
);





export const loadHallstatesFailure = createAction(
  '[Hallstate] Load Hallstates Failure',
  props<{ error: any }>()
);

export const loadSnapshotHallState = createAction(
  '[Hallstate App component] Load HallstateSnapshot '
);

export const saveHallstates = createAction(
  '[SaveHallstate]  Hallstates effect',
  props<{ data: HallsState }>()
);