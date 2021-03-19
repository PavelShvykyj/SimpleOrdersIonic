


import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Hall } from '../../halls-store/hallsstore.reducer';
import * as fromHallstate from './hallstate.reducer';

function CalculateHeader(order ) 
{
  order.orderheader = {
    waitername: order.rowides[0].waitername,
    summ: 0,
    quantity: order.rowides.ength,
    modified: order.rowides[0].modified,
    status: "",
  }
  order.rowides.forEach(element => {
    order.orderheader.summ = order.orderheader.summ + (element.summ - element.discountsumm)
  });
  return order;
}


export const selectHallstateState = createFeatureSelector<fromHallstate.HallsState>(
  fromHallstate.hallstateFeatureKey
);

export const selectItemsState = createSelector(
  selectHallstateState,
  state => state.Orderitems)


export const selectAllItems = createSelector(
  selectItemsState,
  fromHallstate.selectAllItems // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectItemsEntyties = createSelector(
  selectItemsState,
  fromHallstate.selectItemEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)


export const selectItemsInOrdersState = createSelector(
  selectHallstateState,
  state => state.ItemsInOrder)

export const selectItemsInOrdersEntyties = createSelector(
  selectItemsInOrdersState,
    fromHallstate.selectItemsInOrdersEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
  )

  

  export const selectOrdersOnTableState = createSelector(
    selectHallstateState,
    state => state.OrdersOnTable)
  
  export const selectOrdersOnTableEntyties = createSelector(
    selectOrdersOnTableState,
    fromHallstate.selectOrdersOnTableEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
  )
  

  // на выходе массив Array<OrdersOnTable> 
  // {
  // hallid : string,
  // tableid : string,
  // orders: Array<string>
  // } для каждого берем orders и вызываем selectItemsInOrdersByID
  export const selectOrdersOnTableBuId = createSelector(
    selectOrdersOnTableEntyties,
    (entities, props) => props.ids.map(id => entities[id]))

  
  // на выходе массив Array<ItemsInOrders> 
  // {
  //   orderid : string,
  //   orderheader : OrderHeader {
  //   waitername: string,
  //   summ: number,
  //   modified: Date,
  //   status: string,
// // }
  //   rowides : Array<string>
  // }
  // для каждого берем rowides и вызываем selectItemsByID
    export const selectItemsInOrdersByID = createSelector(
      selectItemsInOrdersEntyties,
      (entities, props) => props.ids.map(id => entities[id])
    );


   // на выходе массив Array<Orderitem>  
    export const selectItemsByID  = createSelector(
      selectItemsEntyties, 
      (entities, props) => props.ids.map(id => entities[id]))

  /// и теперь все вместе 
  export const selectHallStateData = createSelector(
    selectOrdersOnTableEntyties,
    selectItemsInOrdersEntyties,
    selectItemsEntyties,
    (OrdersOnTable : Dictionary<fromHallstate.OrdersOnTable>, ItemsInOrders : Dictionary<fromHallstate.ItemsInOrders> , Items : Dictionary<fromHallstate.Orderitem>, hall: Hall ) => {
      let hallstate = {... hall};
      const newhallstate = {...hallstate, tables:  hallstate.tables.map(id => OrdersOnTable[hall.id+" "+id] === undefined ?  {hallid : hallstate.id, tableid: id , orders: []} : 
      OrdersOnTable[id].orders
      .map(id=> ItemsInOrders[id].rowides.map(id => Items[id]))
      )};
      /// переписать  так как map возвращает новый объект
      return newhallstate;})
        

