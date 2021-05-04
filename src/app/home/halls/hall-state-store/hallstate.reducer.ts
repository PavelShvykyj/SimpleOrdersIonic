


import { EntityState, EntityAdapter, createEntityAdapter, Update } from '@ngrx/entity';
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
  comment : string,
  waitername : string,
  dicountname : string,
  dicountid : string,
  modified : Date,
  Cancelreason? : string,
  isexcise : boolean,
  isprecheck : boolean,
  isChanged?  : boolean,
  isSelected? : boolean,
  isCanceled? : boolean,
  noControlSummCalculate? : boolean
  version : number,
  gajet : string

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

function AddOrderOntable(state: HallsState, action) {
  
  const itemid = action.hallid + " " + action.tableid;
    
    if ((<Array<string>>state.OrdersOnTable.ids).indexOf(itemid) === -1) {
      let new_ordersontable = {hallid:action.hallid , tableid :action.tableid , orders: [action.orderid]  };
      
      return {...state,  OrdersOnTable : OrdersOnTableAdapter.addOne(new_ordersontable,state.OrdersOnTable)};
    } 
    else {
      const ordersontable = state.OrdersOnTable.entities[itemid];
      let new_ordersontable = {...ordersontable  };
      
      let newids = new_ordersontable.orders.map(el=> el);
      newids.push(action.orderid);
      new_ordersontable.orders = newids;
      //new_ordersontable.orders.push(action.orderid);
      return {...state,  OrdersOnTable : OrdersOnTableAdapter.upsertOne(new_ordersontable,state.OrdersOnTable)};
    }
}

function AddRowInOrder(state : HallsState, action) {
  
  if ((<Array<string>>state.ItemsInOrder.ids).indexOf(action.data.orderid) === -1) {
    const new_iteminorder = {
      orderid : action.data.orderid,
      rowides : [action.data.rowid]
    }
    return {...state,  ItemsInOrder : ItemsInOrdersAdapter.addOne(new_iteminorder,state.ItemsInOrder)};
  } else {
    
    const iteminorder = state.ItemsInOrder.entities[action.data.orderid];
    
    let new_iteminorder = {...iteminorder  };
    let newids = new_iteminorder.rowides.map(el=> el);
    newids.push(action.data.rowid);
    new_iteminorder.rowides = newids;
    let nextState  = {...state,  ItemsInOrder : ItemsInOrdersAdapter.upsertOne(new_iteminorder,state.ItemsInOrder)};
    return nextState
  }

  
}

function AddRow(state : HallsState, action) {
  let nextState = {...state, Orderitems: OrderitemAdapter.addOne(action.data,state.Orderitems) };
  
  if (action.kaskad.orderid) {
    nextState = {...AddOrderOntable(nextState,action.kaskad)};
  }

  if (action.kaskad.rowid) {

    
    nextState = {...AddRowInOrder(nextState,action)} ;
  }

  return nextState;
}  

function ModifyRow(state : HallsState, action ) {
  let nextState = {...state, Orderitems: OrderitemAdapter.updateOne(action.data,state.Orderitems) };
  
  if (action.kaskad.rowid) {
    nextState = AddRowInOrder(nextState,action);
  }

  if (action.kaskad.orderid) {
    nextState = AddOrderOntable(nextState,action);
  }

  
  return nextState;
}  

function UpdateRow(state, action) {
  return {...state, Orderitems: OrderitemAdapter.updateMany(action.data,state.Orderitems) }
}


export const reducer = createReducer(
  initialState,
  
  
  on(HallstateActions.loadHallstatesSuccess, (state, action) => LoadState(state, action)),
  on(HallstateActions.refreshHallstatesSuccess, (state, action) => RefresState(state, action)),
  on(HallstateActions.loadHallstatesFailure, (state, action) => state),
  on(HallstateActions.refreshHallstatesFailure, (state, action) => state),
   

  ////                                     EDIT ORDER
  on(HallstateActions.AddOrderOntable, (state, action) => AddOrderOntable(state, action)),
  on(HallstateActions.AddRowInOrder, (state, action) => AddRowInOrder(state, action)),
  
  on(HallstateActions.ModifyOrderItem, (state, action) => ModifyRow(state, action)),
  on(HallstateActions.UpdateOrderItemsValues, (state, action) => UpdateRow(state, action)),
  on(HallstateActions.AddRow, (state, action) => AddRow(state, action)),
  on(HallstateActions.SelectItem, (state, action) => {return {...state, Orderitems: OrderitemAdapter.updateOne(action.data,state.Orderitems) }}),
);

export const {selectAll : selectAllItems , selectEntities : selectItemEntities, selectIds : selectItemIds }  = OrderitemAdapter.getSelectors();
export const {selectAll : selectAllItemsInOrders , selectEntities : selectItemsInOrdersEntities, selectIds : selectItemsInOrdersIds }  = ItemsInOrdersAdapter.getSelectors();
export const {selectAll : selectAllOrdersOnTable , selectEntities : selectOrdersOnTableEntities, selectIds : selectOrdersOnTableIds }  = OrdersOnTableAdapter.getSelectors();

export function hallstatereducer(state: HallsState | undefined, action: Action) {
  return reducer(state, action);
}