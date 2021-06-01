


import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Hall } from '../../halls-store/hallsstore.reducer';
import * as fromHallstate from './hallstate.reducer';

interface anydata {
  [key: string]: any
}

const orderontable: fromHallstate.OrdersOnTableData = {
  hallid: "", tableid: "", orders: []
};


function EmptyTableData(hallid: string, id: string): fromHallstate.OrdersOnTableData {
  return {...orderontable,hallid:hallid, tableid : id}
}

function TableData(

  OrdersOnTable: Dictionary<fromHallstate.OrdersOnTable>,
  ItemsInOrders: Dictionary<fromHallstate.ItemsInOrders>,
  Items: Dictionary<fromHallstate.Orderitem>,
  id: string,
  hallid: string,): fromHallstate.OrdersOnTableData {

  const EmtyHeader : fromHallstate.OrderHeader = {
    waitername: "",
    summ: 0,
    quantity: 0,
    modified: new Date(),
    status: ""
  };;  

  let OrderOnTable: fromHallstate.OrdersOnTableData = {...OrdersOnTable[""+hallid+" "+id]};
  OrderOnTable.orders = OrderOnTable.orders.map(orderid => {
    let order: fromHallstate.ItemsInOrdersData = {...ItemsInOrders[orderid as string],orderheader : {...EmtyHeader} };
    

    order.rowides = order.rowides.map(rowid => {
      let rowitem = {...Items[rowid as string]};
      order.orderheader.waitername = rowitem.waitername;
      order.orderheader.summ = order.orderheader.summ + rowitem.summ;
      order.orderheader.quantity = order.orderheader.quantity + 1;
      order.orderheader.modified = rowitem.modified;
      order.orderheader.status = "";
      return rowitem;
    })
    return order
  })
  return OrderOnTable
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
  state => { return state.OrdersOnTable } )

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
//    waitername: string,
//    summ: number,
//    modified: Date,
//    status: string,
// //}
//   rowides : Array<string>
// }
// для каждого берем rowides и вызываем selectItemsByID
export const selectItemsInOrdersByID = createSelector(
  selectItemsInOrdersEntyties,
  (entities, props) => props.ids.map(id => entities[id])
);


// на выходе массив Array<Orderitem>  
export const selectItemsByID = createSelector(
  selectItemsEntyties,
  (entities, props) => props.ids.map(id => entities[id]))

// /// и теперь все вместе 
// export const selectHallStateData_ = createSelector(
//   selectOrdersOnTableEntyties,
//   selectItemsInOrdersEntyties,
//   selectItemsEntyties,
//   (OrdersOnTable: Dictionary<fromHallstate.OrdersOnTable>, ItemsInOrders: Dictionary<fromHallstate.ItemsInOrders>, Items: Dictionary<fromHallstate.Orderitem>, hall: Hall) => {
//     let hallstate:   = { ...hall };
//     const newhallstate = {
//       ...hallstate, tables: hallstate.tables.map(id => OrdersOnTable[hall.id + " " + id] === undefined ? { hallid: hallstate.id, tableid: id, orders: [] } :
//         OrdersOnTable[id].orders
//           .map(id => ItemsInOrders[id].rowides.map(id => Items[id]))
//       )
//     };
//     /// переписать  так как map возвращает новый объект
//     return newhallstate;
//   })

export const selectHallStateData = createSelector(
  selectOrdersOnTableEntyties,
  selectItemsInOrdersEntyties,
  selectItemsEntyties,
  (OrdersOnTable: Dictionary<fromHallstate.OrdersOnTable>,
    ItemsInOrders: Dictionary<fromHallstate.ItemsInOrders>,
    Items: Dictionary<fromHallstate.Orderitem>,
    hall: Hall) => {
    console.log("OrdersOnTable",OrdersOnTable);
      let newhallstate: fromHallstate.HallStateData = { ...hall };
    newhallstate.tables = newhallstate.tables.map(id => {
      return (OrdersOnTable[hall.id + " " + id] === undefined) ?
        EmptyTableData(hall.id, id as string) : TableData(OrdersOnTable, ItemsInOrders, Items, id as string, hall.id)
    });

    
    return newhallstate;
  })


  export const selectOrderItems = createSelector(
    
    selectItemsInOrdersEntyties,
    selectItemsEntyties,
    ( ItemsInOrders: Dictionary<fromHallstate.ItemsInOrders>,
      Items: Dictionary<fromHallstate.Orderitem>,
      id: string
    ) => { 
      console.log('selectOrderItems',id);
      if (id === undefined) {
        return []
      }
      
      const order =  ItemsInOrders[id];
      console.log('order',order);
      if (order === undefined) {
        return []
      }
          
      return order.rowides.map(id => Items[id])


    })
