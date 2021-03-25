


import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as HallstateActions from './hallstate.actions';

export const hallstateFeatureKey = 'hallstate';

export interface OrderHeader {
  waitername: string,
  summ: number,
  quantity : number,
  modified: Date,
  status: string,
}

export interface Table {
  id: string,
  ownerid: string,
  name : string,
  orderid: string,
  header: OrderHeader
}

export interface OrdersOnTable {
  hallid : string,
  tableid : string,
  orders: Array<string>
}

export interface OrdersOnTableData {
  hallid : string,
  tableid : string,
  orders: Array<ItemsInOrdersData | string>
}

export interface ItemsInOrders {
  orderid : string,
  orderheader? : OrderHeader,
  rowides : Array<string>
}

export interface ItemsInOrdersData {
  orderid : string,
  orderheader? : OrderHeader,
  rowides : Array<Orderitem | string>
}

export interface Orderitem {
  orderid : string,
  rowid : string,
  goodid : string,
  goodname : string,
  quantity : number,
  quantityprint : number,
  price : number,
  summ : number,
  discountsumm : number,
  isexcise : boolean,
  isprecheck : boolean,
  comment : string,
  waitername : string,
  dicountname : string,
  dicountid : string,
  modified : Date
}

export interface HallStateData {
  id: string,
  name : string,
  tables : Array<OrdersOnTableData | string>
}


export interface OrderitemState extends EntityState<Orderitem> {}
export const OrderitemAdapter: EntityAdapter<Orderitem> = createEntityAdapter<Orderitem>({
  selectId: (item) => item.rowid
});
export const initialOrderitemState: OrderitemState = OrderitemAdapter.getInitialState();

export interface ItemsInOrdersState extends EntityState<ItemsInOrders> {}
export const ItemsInOrdersAdapter: EntityAdapter<ItemsInOrders> = createEntityAdapter<ItemsInOrders>(
  {
    selectId: (item) => item.orderid,
  }
);
export const initialItemsInOrdersState: ItemsInOrdersState = ItemsInOrdersAdapter.getInitialState();

export interface OrdersOnTableState extends EntityState<OrdersOnTable> {}
export const OrdersOnTableAdapter: EntityAdapter<OrdersOnTable> = createEntityAdapter<OrdersOnTable>(
  {
    selectId: (item) => item.hallid+" "+item.tableid,
  }
);
export const initialOrdersOnTableState: OrdersOnTableState = OrdersOnTableAdapter.getInitialState();


export interface HallsState  {
  Orderitems : OrderitemState,
  ItemsInOrder : ItemsInOrdersState,
  OrdersOnTable : OrdersOnTableState

}



export const initialState: HallsState = {
  Orderitems : initialOrderitemState,
  ItemsInOrder : initialItemsInOrdersState,
  OrdersOnTable : initialOrdersOnTableState 
}

function LoadState(state:HallsState, action) {
  
  try {
    return action.data
    
    // {...state,
    //   OrdersOnTable: OrdersOnTableAdapter.setAll(action.data.OrdersOnTable,state.OrdersOnTable),
    //   ItemsInOrder: ItemsInOrdersAdapter.setAll(action.data.ItemsInOrder,state.ItemsInOrder), 
    //   Orderitems: OrderitemAdapter.setAll(action.data.Orderitems, state.Orderitems)
    // }
} catch (error) {
    alert('error');
    return state

  }
}

function RefresState(state:HallsState, action) {
  
  try {
    return {...state,
      OrdersOnTable: OrdersOnTableAdapter.setAll(action.data.OrdersOnTable,state.OrdersOnTable),
      ItemsInOrder: ItemsInOrdersAdapter.setAll(action.data.ItemsInOrder,state.ItemsInOrder), 
      Orderitems: OrderitemAdapter.setAll(action.data.Orderitems, state.Orderitems)
    }
} catch (error) {
    alert('error');
    return state

  }
}


export const reducer = createReducer(
  initialState,
  on(HallstateActions.loadHallstatesSuccess, (state, action) => LoadState(state, action)),
  on(HallstateActions.refreshHallstatesSuccess, (state, action) => RefresState(state, action)),
  on(HallstateActions.loadHallstatesFailure, (state, action) => state),
  on(HallstateActions.refreshHallstatesFailure, (state, action) => state),

);

export const {selectAll : selectAllItems , selectEntities : selectItemEntities, selectIds : selectItemIds }  = OrderitemAdapter.getSelectors();
export const {selectAll : selectAllItemsInOrders , selectEntities : selectItemsInOrdersEntities, selectIds : selectItemsInOrdersIds }  = ItemsInOrdersAdapter.getSelectors();
export const {selectAll : selectAllOrdersOnTable , selectEntities : selectOrdersOnTableEntities, selectIds : selectOrdersOnTableIds }  = OrdersOnTableAdapter.getSelectors();

export function hallstatereducer(state: HallsState | undefined, action: Action) {
  return reducer(state, action);
}