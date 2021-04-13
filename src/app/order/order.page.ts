import { AddRow } from './../home/halls/hall-state-store/hallstate.actions';

import { Orderitem } from 'src/app/home/halls/hall-state-store/hallstate.reducer';
import { concatMap, filter, map, take, tap, debounceTime } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { of, Observable } from 'rxjs';
import { selectItemsByID, selectItemsInOrdersByID } from '../home/halls/hall-state-store/hallstate.selectors';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { selectHallByid } from '../home/halls-store/hallsstore.selectors';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Menu } from '../menu-store/menu-store.reducer';
import { EditOrderItemComponent } from './edit-order-item/edit-order-item.component';
import { orderactions } from '../global.enums';
import { AddOrderOntable, AddRowInOrder, ModifyOrderItem, SelectItem } from '../home/halls/hall-state-store/hallstate.actions';
import { Update } from '@ngrx/entity';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  items$: Observable<Array<Orderitem>>;
  hall$: Observable<Hall>;
  hallid: string;
  table: string;
  orderid: string;
  form: FormGroup;

  actions = {
    header: 'order actions',

    buttons: [{
      text: 'save',
      handler: () => {
        
      }
    }, {
      text: 'print',

      handler: () => {

      }
    }, {
      text: 'remove',

      handler: () => {

      }
    }, {
      text: 'precheck',

      handler: () => {
        
      }
    }, {
      text: 'Cancel',


      handler: () => {

      }
    }]
  }

  constructor(private route: ActivatedRoute,
    private router : Router,    
    private store: Store<State>,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController
  ) {


  }

  init() {
    this.hall$ = this.route.queryParamMap.pipe(
      tap(params => {

        this.hallid = params.get('hallid');
        this.table = params.get('tableid');
        this.orderid = params.get('orderid');
      }),
      concatMap(params => this.store.select(selectHallByid, params.get('hallid')))
    )

    this.items$ = this.route.queryParamMap.pipe(
      concatMap(params => {
        const ids = []

        ids.push(params.get('orderid'));

        return this.store.select(selectItemsInOrdersByID, { ids });
      }),
      concatMap(iio => {

        if (iio[0] === undefined) {
          return of([])
        }
        return this.store.select(selectItemsByID, { ids: iio[0].rowides })
      })
    );


  }

  ngOnInit() {

    this.form = new FormGroup({
      GuestsQuontity: new FormControl(null),
      FeedBack: new FormControl(null),
    });

    this.init();


  }

  ShowActions() {
    this.actionSheetController.create(this.actions).then(cntrl => {
      cntrl.present();
    })
  }

  GetOrderRowByMenuItem(menuitem: Menu): Observable<Orderitem | undefined> {
    return this.items$.pipe(
      map(items => {
        const itemsinorder = items.filter(item => {
          return item.goodid.trim().toUpperCase() === menuitem.id.trim().toUpperCase() 
        });
        console.log('itemsinorder',itemsinorder);

        if (itemsinorder.length > 0) {
          return itemsinorder[itemsinorder.length - 1];
        }
        else {
          return undefined
        }
      }),
      take(1));
  }

  CallEditRowDialog(editingRow : Orderitem, menuitem?) {
        
        // call dialog
        this.modalController.create({
          component: EditOrderItemComponent,
          // cssClass: 'my-custom-class',
          componentProps: {
            'item': {
              price: editingRow === undefined ? menuitem.price : editingRow.price,
              goodname: editingRow === undefined ?  menuitem.name : editingRow.goodname,
              goodid:editingRow === undefined ?  menuitem.id : editingRow.goodid,
              quantity: editingRow === undefined ? 0 : editingRow.quantity,
              comment: editingRow === undefined ? "" : editingRow.comment
            }
          }
        }).then(modalEl => {
          modalEl.onWillDismiss().then(data => this.OnOrderRowChanged(data, editingRow));
          modalEl.present();
        });
  }


  OnOrderRowChanged(data, editingRow: Orderitem) {
    
    
    if (data.data.canseled) {
      return;
    }
    

    let changes : Update<Orderitem>= {id:"", changes: {}};
    changes.changes = {
      isChanged: true,
      quantity:data.data.quantity,
      comment:data.data.comment,
      summ:data.data.quantity*data.data.price
    }

    if (this.orderid === undefined || this.orderid === "") {
      this.orderid =  uuidv4();
      
      this.store.dispatch(AddOrderOntable({hallid : this.hallid, orderid: this.orderid, tableid: this.table}));
    }


    if (editingRow === undefined) {
      const rowid = uuidv4() as string;
      
      this.store.dispatch(AddRowInOrder({ orderid: this.orderid, rowid: rowid }));
      console.log('data',data);
      const new_row : Orderitem = {
        orderid : this.orderid, 
        rowid : rowid,
        goodid : data.data.goodid,
        goodname : data.data.goodname,
        quantity : data.data.quantity,
        quantityprint : 0,
        price : data.data.price,
        summ : data.data.quantity*data.data.price,
        discountsumm : 0,
        isexcise : false,
        isprecheck : false,
        comment : data.data.comment,
        waitername : "",
        dicountname : "",
        dicountid : "",
        modified : new Date(),
        isChanged  : true,
        isSelected : true
      }
      console.log('new_row',new_row);
      this.store.dispatch(AddRow({data: new_row}));

    } 

     else {
      changes.id = editingRow.rowid;
      this.store.dispatch(ModifyOrderItem({data: changes}));
    }
    

    // refresh wiev 
    this.hall$ = this.store.select(selectHallByid, this.hallid)
    const ids = [this.orderid];
    console.log('ids',ids);
    this.items$ = this.store.select(selectItemsInOrdersByID, { ids }).pipe(
      debounceTime(100),
      concatMap(iio => {
        console.log('iio',iio);
        if (iio[0] === undefined) {
          return of([])
        }
        return this.store.select(selectItemsByID, { ids: iio[0].rowides })
      })
    );
  }


  OnMenuElementSelect(event) {
    // search row
    console.log('event',event);
    this.GetOrderRowByMenuItem(event)
      .subscribe(editingRow => {
        this.CallEditRowDialog(editingRow,event)
      })
  }


  OnItemSelected(item: Orderitem,checked : boolean) {
    this.store.dispatch(SelectItem({data: {id:item.rowid, changes: {isSelected:checked}}}))
  }


}
