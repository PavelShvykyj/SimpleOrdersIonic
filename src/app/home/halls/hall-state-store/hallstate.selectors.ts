import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHallstate from './hallstate.reducer';

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
    selectOrdersOnTableBuId,
    selectItemsInOrdersByID,
    selectItemsByID,
    (OrdersOnTable, ItemsInOrders, Items, hall ) => {
      let hallstate = {... hall};
      hallstate.tables.map(id => (OrdersOnTable[id] ? undefined : {} , OrdersOnTable[id])
        .orders.map(id=> ItemsInOrders[id].rowides.map(id => Items[id])
        /// учесть возможность неопределенности  
          
          )
        );
      return hallstate;})
        


     
