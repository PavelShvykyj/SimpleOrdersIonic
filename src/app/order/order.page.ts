import { Orderitem } from './../home/halls/hall-state-store/hallstate.reducer';
import { AddRow, UpdateOrderItemsValues } from './../home/halls/hall-state-store/hallstate.actions';
import { concatMap,  map, take, tap,  first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Observable  } from 'rxjs';
import { selectOrderItems, selectOrdersOnTableBuId } from '../home/halls/hall-state-store/hallstate.selectors';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { selectHallByid } from '../home/halls-store/hallsstore.selectors';
import { ActionSheetController, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Menu } from '../menu-store/menu-store.reducer';
import { EditOrderItemComponent } from './edit-order-item/edit-order-item.component';
import { orderactions } from '../global.enums';
import { ModifyOrderItem, SelectItem } from '../home/halls/hall-state-store/hallstate.actions';
import { Update } from '@ngrx/entity';
import { v4 as uuidv4 } from 'uuid';
import { inQueue } from '../queue/queue-store.actions';
import { Queue } from '../queue/queue-store.reducer';
import { AppsettingsService } from '../appsettings/appsettings.service';
import { BarcodeinputComponent } from '../base-elements/barcodeinput/barcodeinput.component';
import { OrderpayComponent } from './orderpay/orderpay.component';

import * as CRC32 from 'crc-32';   






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
  totals;
  startControlsumm : number;
  version: number;
  lastGajet : string;
  

  @ViewChild('slider', { static: true })
  slider: IonSlides

  actions = {
    header: 'order actions',

    buttons: [{
      text: 'СОХРАНИТЬ',
      handler:
        () => { this.OnOrderActionClick(orderactions.SAVE) }
    }, {
      text: 'ПЕЧАТЬ',

      handler: () => { this.OnOrderActionClick(orderactions.PRINT) }
    }, {
      text: 'ОТМЕНА ПОЗИЦИЙ',
      handler: () => { this.OnOrderActionClick(orderactions.CANCEL_ROW) }

    },
    {
      text: 'ОТМЕТИТЬ ФИСКАЛ',
      handler: () => { this.OnOrderActionClick(orderactions.FISKAL) }

    },
    {
      text: 'ПРЕЧЕК',
      handler: () => { this.OnOrderActionClick(orderactions.PRECHECK) }

    }, {
      text: 'ДИСКОНТ',
      handler: () => { this.OnOrderActionClick(orderactions.DISCOUNT) }
    }, {
      text: 'ОПЛАТА',
      handler: () => { this.OnOrderActionClick(orderactions.PAY) }
    }]
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private setingsService: AppsettingsService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  
  ionViewWillLeave() {
    this.OnOrderActionClick(orderactions.SAVE);
  } 
 
  ionViewWillEnter() {

  }

  ngOnInit() {

    this.form = new FormGroup({
      GuestsQuontity: new FormControl(null),
      FeedBack: new FormControl(null),
    });

    this.init();


  }

  init() {
    this.hall$ = this.route.queryParamMap.pipe(

      tap(params => {
        
        this.hallid = params.get('hallid');
        this.table = params.get('tableid');
        this.orderid = params.get('orderid');
        this.OnOrderidChages();
      }),
      concatMap(params => this.store.select(selectHallByid, params.get('hallid')))
    )
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
          return item.goodid.trim().toUpperCase() === menuitem.id.trim().toUpperCase() && !item.isCanceled
        });
        

        if (itemsinorder.length > 0) {
          return itemsinorder[itemsinorder.length - 1];
        }
        else {
          return undefined
        }
      }),
      take(1));
  }

  GetQueueElement(command , items) : Queue {
    let commandParametr = {
      orderid : this.orderid,
      hallid: this.hallid,
      table: this.table,
      waiter : "Admin",
      items: items
    }
    
    let elQueue: Queue = {
      id: uuidv4() as string,
      command: command,
      commandParametr: commandParametr,
      commandDate: new Date(),
      version : this.version,
      gajet: this.setingsService.deviceID
    };         

    return elQueue
  }

  GetTotals(items) {
    if (items.length === 0) {
      this.slider.slideTo(1);
      return { summ: 0, discountname: "", discountsumm: 0 }
    }

    const discountname = items[0].dicountname;

    let summ = 0;
    let discountsumm = 0;
    items.forEach(el => { { if (!el.isCanceled) {
      summ = summ + el.summ; discountsumm = discountsumm + el.discountsumm;
    }  } })

    return { summ, discountname, discountsumm }

  }

  GetControlSumm(items) : number {
    
    const clearItems = items.map(el => {return {...el,isSelected:false, isChanged: false, noControlSummCalculate: false}})
    
    return CRC32.str(JSON.stringify(clearItems))
  }

  inQueue(command: Queue, noControlSummCheck = false, changesFn ) {
    let items = command.commandParametr.items; 
    
    

    if (this.startControlsumm != this.GetControlSumm(items) || noControlSummCheck) {
      this.version = this.version + 1;
      
      /// в копии ТЧ подменяем версию на текщую на всякий случай (версия в команде и в данных совпадает тогда) 
      const itemsnewversion = items.map(el => {return {...el, version : this.version, gajet : this.setingsService.deviceID  }} );
      command.version = this.version;
      command.commandParametr.items = itemsnewversion;
      this.store.dispatch(inQueue({data: command}));  
    
      /// отмечаем оптимистичные данные устанавливаем  версию и устройство 
      this.ChangeRows((el: Orderitem) => { return {id: el.rowid ,changes: {...changesFn(el),version : this.version, gajet : this.setingsService.deviceID }}},
      (el) => {return true},
      {editcanceled: true,
       isLocal : true 
      });
        
      
      
    } 

  }
 

  NextOrder(par: number) {
    if (par === 0) {
      this.router.navigate(this.route.snapshot.url, { queryParams: { orderid: "", hallid: this.hallid, tableid: this.table } });
      return;
    }

    this.store.pipe(select(selectOrdersOnTableBuId, { ids: [this.hallid + " " + this.table] }), first()).subscribe(el => {
      if (el.lenth === 0) {
        return
      }
      const nextorderindex = this.orderid === "" ? 0 : el[0].orders.indexOf(this.orderid) + par;
      if (nextorderindex >= 0 && nextorderindex <= el[0].orders.length - 1) {
        this.router.navigate(this.route.snapshot.url, { queryParams: { orderid: el[0].orders[nextorderindex], hallid: this.hallid, tableid: this.table } });
      }
    })
  }

  ChangeRows(FnChange: Function , FnFilter : Function , params ) {
    /// если передали этот параметр то эти изменения на контрольную сумму влиять не должны
    /// поетому ставим признак пересчета стартовой т.е. приравниаем последние изменения к стартовым
    /// пересчет произойдет в подписке на select(selectOrderItems) 

    
    this.items$.pipe(
      take(1),
      // игнорируем отмененные строки если не сказаоно обратного
      map(items => items.filter(el=> !el.isCanceled || params.editcanceled)),
      // отбираем по переданному фильтру
      map(items => items.filter(el => FnFilter(el))))
      .subscribe(items => {
        const itemchanges : Array<Update<Orderitem>> = 
        items.map((el) => FnChange(el,params))
             // двойной цикл .... нужно в самой функции прописывать
             //.map((el) => {return el.changes = {...el.changes, isChanged: true, isSelected: false}});
        this.store.dispatch(UpdateOrderItemsValues({data: itemchanges} ))
      });

  }

  OnMenuElementSelect(event) {
    // search row

    this.GetOrderRowByMenuItem(event)
      .subscribe(editingRow => {
        this.OpenEditRowDialog(editingRow, event)
      })
  }
 
  OnItemSelected(item: Orderitem, checked: boolean) {
    
    if (item.isCanceled) {
      return;
    }
    this.store.dispatch(SelectItem({ data: { id: item.rowid, changes: { isSelected: checked } } }))
  }

  OnOrderidChages() {
    
    this.items$ = this.store.pipe(select(selectOrderItems, this.orderid),
                                  tap(items => {
                                    this.version = items.length === 0 ? 0 : items[0].version;
                                    this.lastGajet = items.length === 0 ? "" : items[0].gajet;
                                    const noControlSummCalculate = items.find(el => !!el.noControlSummCalculate)!=undefined; 
                                    if (!noControlSummCalculate) {
                                      this.startControlsumm = this.GetControlSumm(items);
                                    }
                                    this.totals = this.GetTotals(items)
                                    }),
                                    map(items => {return items.map(el =>{return {...el,isSelected: !!el.isSelected, isChanged: !!el.isChanged,  noControlSummCalculate: false } } )})
                                    
                                    )
    // this.totals$ = this.items$.pipe(map(items => {
    //   if (items.length === 0) {
    //     this.slider.slideTo(1);
    //     return { summ: 0, discountname: "", discountsumm: 0 }
    //   }

    //   const discountname = items[0].dicountname;

    //   let summ = 0;
    //   let discountsumm = 0;
    //   items.forEach(el => { { if (!el.isCanceled) {
    //     summ = summ + el.summ; discountsumm = discountsumm + el.discountsumm;
    //   }  } })

    //   return { summ, discountname, discountsumm }
    // }))
    
    // const ids = [this.orderid];
    // this.items$ = this.store.select(selectItemsInOrdersByID, { ids })
    //   .pipe(concatMap(iio => {
    //     if (iio[0] === undefined) {
    //       return of([])
    //     }
    //     return this.store.select(selectItemsByID, { ids: iio[0].rowides })
    //   }));

  }

  OnOrderActionClick(command: orderactions) {
    
    this.items$.pipe(take(1)).subscribe(
      items => {
        switch (command) {
          case orderactions.FISKAL:
            /// простоую отметку на 1С не гоняем
            this.ChangeRows((el: Orderitem) => {return {id: el.rowid ,changes: {isexcise: el.isSelected, isSelected:false, isChanged : !!el.isexcise != !!el.isSelected }}},
                            (el) => {return el.isSelected},
                            { });
            return;
          case orderactions.PAY:
            this.OpenPayDialog(); 
            return;
          case orderactions.PRINT:
            /// в очердь версию данных для печати
            
            const noControlSummCheck = true;

            this.inQueue(this.GetQueueElement(command, items),
            noControlSummCheck,
            (el: Orderitem) => {return  {quantityprint: el.quantity, isSelected:false, isChanged : el.quantity!=el.quantityprint}}
            );
            
            /// оптимистичные изменения для отображения без передачи на 1С
            // this.ChangeRows((el: Orderitem) => {return {id: el.rowid ,changes: {quantityprint: el.quantity, isSelected:false, isChanged : el.quantity!=el.quantityprint}}},
            // (el) => {return true},
            // {});



            return;  
            
            
          case orderactions.CANCEL_ROW:
            this.ChangeRows((el: Orderitem) => { return {id: el.rowid ,changes: {isCanceled: el.isSelected, isSelected:false, isChanged : !!el.isSelected != !!el.isCanceled}}},
            (el) => {return true},
            {editcanceled: true});
            return;  
          case orderactions.DISCOUNT:
            this.OpenDiscountDialog();           
            return;
          default:
          
          this.inQueue(this.GetQueueElement(command, items),false,(el)=> {return {}});
            
          }
      }
    )



    // switch (action) {
    //   case orderactions.SAVE:
    //   case orderactions.PRINT:
    //   case orderactions.PRECHECK:
    //   case orderactions.PAY:
    //   case orderactions.DISCOUNT:
    //   case orderactions.CANCEL_ROW:  
    //   default:
    //     break;
    // }

  }

  OpenEditRowDialog(editingRow: Orderitem, menuitem?: Menu) {
    if (editingRow != undefined && editingRow.isCanceled) {
      return;
    }

    // call dialog
    this.modalController.create({
      component: EditOrderItemComponent,
      // cssClass: 'my-custom-class',
      componentProps: {
        'item': {
          price: editingRow === undefined ? menuitem.price : editingRow.price,
          goodname: editingRow === undefined ? menuitem.name : editingRow.goodname,
          goodid: editingRow === undefined ? menuitem.id : editingRow.goodid,
          quantity: editingRow === undefined ? 0 : editingRow.quantity,
          comment: editingRow === undefined ? "" : editingRow.comment,
          quantityprint: editingRow === undefined ? 0 : editingRow.quantityprint,
        }
      }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnEditRowDialogClosed(data, editingRow));
      modalEl.present();
    });
  }

  OnPayDialogClosed(res) {
    const dialogres = res.data;
    if (dialogres.canseled) {
      return
    }
    
    let el: Queue = this.GetQueueElement(orderactions.PAY,[]);
    el.commandParametr = {...el.commandParametr,
      paytype: dialogres.paytype,
      cash: dialogres.res
    }  
  
    this.store.dispatch(inQueue({ data: el }));



    this.router.navigateByUrl('/home/halls/hallstate/'+this.hallid);
  }

  OnDiscountDialogClosed(res) {
    const dialogres = res.data;
    
    if (dialogres.canseled) {
      return
    }
    

    let el: Queue = this.GetQueueElement(orderactions.DISCOUNT,[]);
    el.commandParametr = {...el.commandParametr,
      discountcode : dialogres.data
    }  

    this.inQueue(el,
      true,
      (el: Orderitem) => {return {discountsumm: 0, dicountname: 'Знижка обробляеться 1С' }}
      )

    // оптимистичные изменения сбрасываем предыдущую скидку до ответа от 1С
    //   this.ChangeRows((el: Orderitem) => {return {id: el.rowid ,changes: {discountsumm: 0, dicountname: 'Знижка обробляеться 1С' }}},
    //   (el) => {return true},
    //   {});
   }

  OnEditRowDialogClosed(data, editingRow: Orderitem) {
    if (data.data.canseled) {
      return;
    }

    let kaskad = {
      orderid: "",
      rowid: "",
      hallid: this.hallid,
      tableid: this.table
    }


    if (this.orderid === undefined || this.orderid === "") {
      this.orderid = uuidv4();
      kaskad.orderid = this.orderid

    }

    if (editingRow === undefined) {
      const rowid = uuidv4() as string;
      kaskad.rowid = rowid;


      const new_row: Orderitem = {
        orderid: this.orderid,
        rowid: rowid,
        goodid: data.data.goodid,
        goodname: data.data.goodname,
        quantity: data.data.quantity,
        quantityprint: 0,
        price: data.data.price,
        summ: data.data.quantity * data.data.price,
        discountsumm: 0,
        isexcise: false,
        isprecheck: false,
        comment: data.data.comment,
        waitername: "",
        dicountname: "",
        dicountid: "",
        modified: new Date(),
        isChanged: true,
        isSelected: true,
        version : this.version,
        gajet   : this.setingsService.deviceID,
        noControlSummCalculate:true 
      }

      this.store.dispatch(AddRow({ data: new_row, kaskad: kaskad }));
    }
    else {
      const changes: Update<Orderitem> = {
        id: editingRow.rowid,
        changes: {
          isChanged: true,
          quantity: data.data.quantity,
          comment: data.data.comment,
          summ: data.data.quantity * data.data.price,
          noControlSummCalculate:true 

        }
      };
      this.store.dispatch(ModifyOrderItem({ data: changes, kaskad: kaskad }));
     
      /// сумма дисконта должна перерасчитатья на стороне 1С 
      this.ChangeRows((el: Orderitem) => {return {id: el.rowid ,changes: {discountsumm: 0, dicountname: 'Знижка обробляеться 1С', noControlSummCalculate:true  }}},
      (el) => {return true},
      {});
    }

    
    if (kaskad.orderid) {
      this.OnOrderidChages();
      ///  мы перечитали заказ с первой добавленной строкой 
      ///  фактически создали новый ордер ид - ноцжно на негоподписаться
      ///  при этом стартовая контролька рассчиталась 
      ///  что бы передать изменения на 1С - сбросим ее
      this.startControlsumm = 0;
    }

  }



  OpenPayDialog() {
    //this.totals$.pipe(take(1)).subscribe(total => {
    
    this.modalController.create({
      component: OrderpayComponent,
      // cssClass: 'my-custom-class',
      componentProps: {
        OrderSumm : this.totals.summ
       }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnPayDialogClosed(data));
      modalEl.present();
    }); 
    //});
  }

  OpenDiscountDialog() {
   
  
    this.modalController.create({
      component: BarcodeinputComponent,
      // cssClass: 'my-custom-class',
      // componentProps: {
      // }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnDiscountDialogClosed(data));
      modalEl.present();
    }); 

  }
  
  
}
