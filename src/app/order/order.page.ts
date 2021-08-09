import { AuthState } from './../authtorisation/reducers/index';

import { Orderitem } from './../home/halls/hall-state-store/hallstate.reducer';
import { AddRow, UpdateOrderItemsValues } from './../home/halls/hall-state-store/hallstate.actions';
import { concatMap, map, take, tap, first, filter } from 'rxjs/operators';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { Observable, Subscription } from 'rxjs';
import { selectOrderItems, selectOrdersOnTableBuId } from '../home/halls/hall-state-store/hallstate.selectors';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { selectHallByid } from '../home/halls-store/hallsstore.selectors';
import { ActionSheetController, IonInfiniteScroll,  ModalController, NavController, ToastController } from '@ionic/angular';
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
import { MenuListComponent } from '../base-elements/menu-list/menu-list.component';
import { AnketaComponent } from './anketa/anketa.component';
import { selectLoginState } from '../authtorisation/auth.selectors';
import { PermissionsService } from '../permissions.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit, OnDestroy {

  //// order parametrs 
  items$: Observable<Array<Orderitem>>;
  hall$: Observable<Hall>;
  itemssubs: Subscription;
  hallid: string;
  table: string;  /// СТОЛ
  orderid: string;

  //// versions , totals , acces
  itemsview: Array<Orderitem> = [];
  page_size = 8;
  last_index = 0;
  userdata: AuthState;
  isprecheck : boolean = false;


  totals;
  startControlsumm: number;
  currentControlsumm: number;
  localAccesAllowed: boolean = false;
  version: number;
  lastGajet: string;
  waiter: string;

  /// local navigation (router no changes )
  MenuComp = MenuListComponent;
  AnketaComp = AnketaComponent;
  MenuProps: { [key: string]: any } = {};
  @ViewChild('navlinkmenu', { static: false }) navlinkmenu;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;



  actions = {
    header: 'Выбрать действие :',

    buttons: [
      {
        text: 'ЗАКРЫТЬ ЭТО МЕНЮ',
        handler:
          () => { this.OnOrderActionClick("ЗАКРЫТЬ ЭТО МЕНЮ") }
      },

      {
        text: 'АНКЕТА',
        handler:
          () => { this.OnOrderActionClick(orderactions.ANKETA) }
      },


      {
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
      }

    ]
  }

  actionsAfterPrecheck = {
    header: 'Выбрать действие :',

    buttons: [
      {
        text: 'ЗАКРЫТЬ ЭТО МЕНЮ',
        handler:
          () => { this.OnOrderActionClick("ЗАКРЫТЬ ЭТО МЕНЮ") }
      },
      {
        text: 'АНКЕТА',
        handler:
          () => { this.OnOrderActionClick(orderactions.ANKETA) }
      },
      {
        text: 'ОТМЕТИТЬ ФИСКАЛ',
        handler: () => { this.OnOrderActionClick(orderactions.FISKAL) }
      },
      {
        text: 'ПРЕЧЕК',
        handler: () => { this.OnOrderActionClick(orderactions.PRECHECK) }
      },
      {
        text: 'ОПЛАТА',
        handler: () => { this.OnOrderActionClick(orderactions.PAY) }
      }
    ]
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private setingsService: AppsettingsService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public toastController: ToastController,
    public ctrl: NavController,
    private Permissions: PermissionsService,
    private detector: ChangeDetectorRef
  ) { }



  ionViewWillLeave() {
    // console.log("Will Leave");
  }

  ionViewDidLeave() {
    // console.log("DID Leave");
  }


  ionViewWillEnter() {
    // console.log("Will Enter");
  }

  ionViewDidEnter() {
    // console.log("DID Enter");
  }


  ngOnInit() {
    
    this.init();
  }

  ngAfterViewInit() {
    this.infiniteScroll.disabled = false;
  }

  ngOnDestroy() {
    // console.log("ngOnDestroy");
    // console.log(this.currentControlsumm);
    // console.log(this.startControlsumm);
    if (this.currentControlsumm != this.startControlsumm) {
      this.items$.pipe(take(1)).subscribe(
        items => {
          this.inQueue(this.GetQueueElement(orderactions.SAVE, items),
            true,
            (el: Orderitem) => { 
              return {isSelected: false, isChanged: true}
            }
          );
        });
    }
    this.itemssubs.unsubscribe();
    this.itemsview = [];
    this.last_index = 0;
  }

  doInfinite(event) {
    this.items$.pipe(take(1)).subscribe(items => {
      // console.log('doInfinite');
      // console.log(items.length);
      // console.log(this.itemsview.length);

      if (items.length === this.itemsview.length) {
        event.target.complete();
        event.target.disabled = true;
        return
      }

      setTimeout(() => {
        this.last_index = this.last_index + 8;
        this.itemsview = items.slice(0, this.last_index);
        event.target.complete();
        if (items.length === this.itemsview.length) {
          event.target.disabled = true;
        }
      }, 10);
    })
  }

  init() {
    this.store.pipe(select(selectLoginState), take(1)).subscribe(
      userdata => this.userdata = userdata
    )

    this.hall$ = this.route.queryParamMap.pipe(
      tap(params => {
        this.hallid = params.get('hallid');
        this.table = params.get('tableid');
        this.orderid = params.get('orderid');

        this.OnOrderidChages();

        this.MenuProps.callBack = this.OnMenuElementSelect.bind(this);
        this.MenuProps.GetOrderId = this.GetOrderID.bind(this);
        this.MenuProps.AddQountityFromMenu = this.AddQountityFromMenu.bind(this);
        this.MenuProps.hallid = this.hallid;
        this.MenuProps.orderid = this.orderid;
        this.MenuProps.table = this.table;
      }),
      concatMap(params => this.store.select(selectHallByid, params.get('hallid')))
    )
  }

  ShowActions() {
    let actionsToShow = this.isprecheck ? this.actionsAfterPrecheck : this.actions; 
    this.actionSheetController.create(actionsToShow).then(cntrl => {
      cntrl.present();
    })
  }

  trackByOrderitemFn(index, item: Orderitem) {
    return item.rowid
  }

  AccessLocalChanges(items: Array<Orderitem>) {

    this.store.pipe(select(selectLoginState),
      take(1),
      tap(UserData => {
        if (items.length === 0) {
          this.localAccesAllowed = true;
          return
        }
        const FirstItem = items[0];
        this.localAccesAllowed =
          // после пречека еще оплата идет
          (!FirstItem.isprecheck) && 
          (UserData.UserName === FirstItem.waitername || UserData.IsAdmin)
      })).subscribe()


  }


  GetOrderID() {

    return this.orderid;
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

  GetQueueElement(command, items): Queue {
    let commandParametr = {
      orderid: this.orderid,
      hallid: this.hallid,
      table: this.table,
      waiter: this.waiter,
      items: items
    }

    let elQueue: Queue = {
      id: uuidv4() as string,
      command: command,
      commandParametr: commandParametr,
      commandDate: new Date(),
      status: 'не обрабатывалась',
      version: this.version,
      gajet: this.setingsService.deviceID
    };

    return elQueue
  }

  GetTotals(items: Array<Orderitem>) {


    if (items.length === 0) {
      //this.slider.slideTo(1);
      return { summ: 0, discountname: "", discountsumm: 0 }
    }

    const discountname = items[0].dicountname;

    let summ = 0;
    let discountsumm = 0;
    items.forEach(el => {
      {
        if (!el.isCanceled) {
          summ = summ + el.summ; discountsumm = discountsumm + el.discountsumm;
        }
      }
    })



    return { summ, discountname, discountsumm }

  }

  GetControlSumm(items): number {

    const clearItems = items.map(el => { return { ...el, isSelected: false, isChanged: false, noControlSummCalculate: false } })

    return CRC32.str(JSON.stringify(clearItems))
  }

  inQueue(command: Queue, noControlSummCheck = false, changesFn, filterFn = undefined) {
    let items = command.commandParametr.items;
    if (filterFn === undefined) {
      filterFn = (el) => { return true };
    }


    if (this.startControlsumm != this.GetControlSumm(items) || noControlSummCheck) {
      this.version = this.version + 1;

      /// в копии ТЧ подменяем версию на текщую на всякий случай (версия в команде и в данных совпадает тогда) 
      const itemsnewversion = items.map(el => { return { ...el, version: this.version, gajet: this.setingsService.deviceID } });
      command.version = this.version;
      command.commandParametr.items = itemsnewversion;
      const InQueueAction = inQueue({ data: command });

      this.Permissions.CheckPerpission(InQueueAction)
        .pipe(take(1))
        .subscribe(allowed => {
          if (allowed) {
            /// отмечаем оптимистичные данные устанавливаем  версию и устройство сбрасываем необходимость сохранения при выходе
            this.ChangeRows((el: Orderitem) => { return { id: el.rowid, changes: { ...changesFn(el), noControlSummCalculate: false, version: this.version, gajet: this.setingsService.deviceID } } },
              filterFn,
              {
                editcanceled: true,
                isLocal: true
              });
            this.store.dispatch(InQueueAction);
          }
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

  AddQountityFromMenu(q, menuitem: Menu, event) {
    this.GetOrderRowByMenuItem(menuitem)
      .subscribe(editingRow => {

        if (editingRow) {
          this.AddQountity(q, editingRow, event);

        } else {
          let data = {
            data: {
              quantity: q,
              comment: '',
              price: menuitem.price,
              canseled: false,
              goodid: menuitem.id,
              goodname: menuitem.name
            }
          }

          this.OnEditRowDialogClosed(data, editingRow);
        }


      })
  }

  AddQountity(q, item: Orderitem, event) {
    event.stopPropagation();

    const quantity = item.quantity + q;
    if (quantity < item.quantityprint) {
      return
    }

    let data = {
      data: {
        quantity: quantity,
        comment: '',
        price: item.price,
        canseled: false,
      }
    }

    this.OnEditRowDialogClosed(data, item);

  }

  GoBack() {
    console.time('GoBack')
    setTimeout(() => {
      console.timeEnd('GoBack');
      this.ctrl.navigateBack('/home/halls/hallstate/' + this.hallid);
    }, 350)

    //this.router.navigateByUrl('/home/halls/hallstate/' + this.hallid);
  }

  ChangeRows(FnChange: Function, FnFilter: Function, params) {
    /// если передали этот параметр то эти изменения на контрольную сумму влиять не должны
    /// поетому ставим признак пересчета стартовой т.е. приравниаем последние изменения к стартовым
    /// пересчет произойдет в подписке на select(selectOrderItems) 


    this.items$.pipe(
      take(1),
      // игнорируем отмененные строки если не сказаоно обратного
      map(items => items.filter(el => !el.isCanceled || params.in)),
      // отбираем по переданному фильтру
      map(items => items.filter(el => FnFilter(el))))
      .subscribe(items => {

        const itemchanges: Array<Update<Orderitem>> =
          items.map((el) => FnChange(el, params));
        // двойной цикл .... нужно в самой функции прописывать
        //.map((el) => {return el.changes = {...el.changes, isChanged: true, isSelected: false}});

        this.store.dispatch(UpdateOrderItemsValues({ data: itemchanges }))
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
    if (this.orderid === undefined) {
      this.orderid = "";
    }
    
    this.MenuProps.orderid = this.orderid;


    this.items$ = this.store.pipe(select(selectOrderItems, this.orderid),
      map(items => {
        return items.map(el => {
          return { ...el, isSelected: !!el.isSelected, isChanged: !!el.isChanged, noControlSummCalculate: !!el.noControlSummCalculate };
        })
      }),
    );

    /// navigate to menu in new order make once                                   
    this.items$.pipe(
      take(1),
      filter(items => { return items.length === 0 })
    ).subscribe(() => {

      setTimeout(() => {
        this.navlinkmenu.el.click();
      }, 300);
    });


    /// versions , totals  , acces - lsten changes 
    this.itemssubs = this.items$.subscribe(items => {
      /// при первом открытии сначала покажем только первые n позиций для ускорения

      // if (this.itemsview.length === 0) {
      //   setTimeout(() => {
      //     this.itemsview = items;  
      //   }, 300);
      // } else {
      //   this.itemsview = items;  
      // }

      //console.log('itemsview.length ',this.itemsview.length)
      if (this.itemsview.length === 0) {
        setTimeout(() => {
          this.itemsview = items.slice(0, 8);
          this.last_index = 8;
        }, 200);

      } else {
        this.itemsview = items;
      }

      this.waiter = items.length === 0 ? this.userdata.UserName : items[0].waitername;
      this.version = items.length === 0 ? 0 : items[0].version;
      this.lastGajet = items.length === 0 ? "" : items[0].gajet;
      this.isprecheck = items.length === 0 ? false : items[0].isprecheck;
      const noControlSummCalculate = items.find(el => !!el.noControlSummCalculate) != undefined;
      this.currentControlsumm = this.GetControlSumm(items);
      if (!noControlSummCalculate) {
        this.startControlsumm = this.currentControlsumm;
      }
      console.log('noControlSummCalculate',noControlSummCalculate);
      console.log('startControlsumm',this.startControlsumm);
      console.log('currentControlsumm',this.currentControlsumm);
      this.AccessLocalChanges(items);
      this.totals = this.GetTotals(items);
    });
  }

  OnOrderActionClick(command: string) {
    this.items$.pipe(take(1)).subscribe(
      items => {
        switch (command) {
          case "ЗАКРЫТЬ ЭТО МЕНЮ":
            return;
          case orderactions.FISKAL:
            /// простоую отметку на 1С не гоняем
            this.ChangeRows((el: Orderitem) => { return { id: el.rowid, changes: { isexcise: el.isSelected, isSelected: false, isChanged: !!el.isexcise != !!el.isSelected } } },
              (el) => { return true },
              {});
            return;
          case orderactions.PAY:
            this.OpenPayDialog(items);
            return;
          case orderactions.PRECHECK:
            this.inQueue(this.GetQueueElement(command, items),
              true,
              (el: Orderitem) => { return { isprecheck: true, isSelected: false, isChanged: true } }
            );
            return;
          case orderactions.PRINT:
            /// в очердь версию данных для печати



            this.inQueue(this.GetQueueElement(command, items),
              true,
              (el: Orderitem) => { return { quantityprint: el.quantity, isSelected: false, isChanged: el.quantity != el.quantityprint } }
            );

            /// оптимистичные изменения для отображения без передачи на 1С (перенесено в inQueue)



            return;


          case orderactions.CANCEL_ROW:
            let FakeQueueEl = this.GetQueueElement(command, items);
            FakeQueueEl.commandParametr = { ...FakeQueueEl.commandParametr, checkOnlySelectedRows: true }

            const InQueueFakeAction = inQueue({ data: FakeQueueEl });

            this.Permissions.CheckPerpission(InQueueFakeAction)
              .pipe(take(1))
              .subscribe(allowed => {
                if (allowed) {
                  this.ChangeRows((el: Orderitem) => { return { id: el.rowid, changes: { isCanceled: el.isSelected, isSelected: false, isChanged: !!el.isSelected != !!el.isCanceled } } },
                    (el) => { return true },
                    { editcanceled: true });
                } 
              });
            return;
          case orderactions.ANKETA:
            this.OpenAnketaDialog();    

            return;
          case orderactions.DISCOUNT:
            this.OpenDiscountDialog();
            return;
          default:
          this.inQueue(this.GetQueueElement(orderactions.SAVE, items),
            false,
            (el: Orderitem) => {}
          ); 
          
          
        }
      }
    )

  }

  OpenEditRowDialog(editingRow: Orderitem, menuitem?: Menu) {
    if (editingRow != undefined && editingRow.isCanceled) {
      return;
    }

    if (!this.localAccesAllowed) {
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

  OnPayDialogClosed(res, items) {
    const dialogres = res.data;
    if (dialogres.canseled) {
      return
    }


    let el: Queue = this.GetQueueElement(orderactions.PAY, items);
    el.commandParametr = {
      ...el.commandParametr,
      paytype: dialogres.paytype,
      cash: dialogres.cash
    }

    const noControlSummCheck = true

    this.inQueue(el,
      noControlSummCheck,
      (el: Orderitem) => {},
      (el) => { return false }
    );
    //this.store.dispatch(inQueue({ data: el }));



    this.router.navigateByUrl('/home/halls/hallstate/' + this.hallid);
  }

  OnDiscountDialogClosed(res) {
    const dialogres = res.data;

    if (dialogres.canseled) {
      return
    }

    this.items$.pipe(take(1)).subscribe(items => {
      let el: Queue = this.GetQueueElement(orderactions.DISCOUNT, items);
      el.commandParametr = {
        ...el.commandParametr,
        discountcode: dialogres.data
      }

      this.inQueue(el,
        true,
        (el: Orderitem) => { return { discountsumm: 0, dicountname: 'Знижка обробляеться 1С' } }
      )

    })


    // оптимистичные изменения сбрасываем предыдущую скидку до ответа от 1С
    //   this.ChangeRows((el: Orderitem) => {return {id: el.rowid ,changes: {discountsumm: 0, dicountname: 'Знижка обробляеться 1С' }}},
    //   (el) => {return true},
    //   {});
  }

  OnAnketaDialogClosed(res) {
    const dialogres = res.data;
    console.log('OnAnketaDialogClosed',dialogres);
    if (dialogres.canseled) {
      return
    }

    this.items$.pipe(take(1)).subscribe((items) => {
      
      let el: Queue = this.GetQueueElement(orderactions.ANKETA, items);
      el.commandParametr = {
        ...el.commandParametr,
        anketa: dialogres.data
      }
      console.log('el.commandParametr',el.commandParametr);

      this.inQueue(el,
      true,
      (el: Orderitem) => {}
      ); 

    })


 

    

  }

  OnEditRowDialogClosed(data, editingRow: Orderitem) {
    if (data.data.canseled) {
      return;
    }

    if (data.data.quantity === 0) {
      return;
    }

    let kaskad = {
      orderid: "",
      rowid: "",
      hallid: this.hallid,
      tableid: this.table
    }


    if (this.orderid === undefined || this.orderid === "" || this.orderid === null) {
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
        waitername: this.waiter,
        dicountname: "",
        dicountid: "",
        modified: new Date(),
        isChanged: true,
        isSelected: true,
        version: this.version,
        gajet: this.setingsService.deviceID,
        noControlSummCalculate: true
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
          noControlSummCalculate: true

        }
      };
      this.store.dispatch(ModifyOrderItem({ data: changes, kaskad: kaskad }));

      /// сумма дисконта должна перерасчитатья на стороне 1С 
      this.ChangeRows((el: Orderitem) => { return { id: el.rowid, changes: { discountsumm: 0, dicountname: 'Знижка обробляеться 1С', noControlSummCalculate: true } } },
        (el) => { return true },
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

  OpenPayDialog(items) {
    //this.totals$.pipe(take(1)).subscribe(total => {

    this.modalController.create({
      component: OrderpayComponent,
      // cssClass: 'my-custom-class',
      componentProps: {
        OrderSumm: this.totals.summ
      }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnPayDialogClosed(data, items));
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

  OpenAnketaDialog() {
    
    if (!this.orderid) {
      this.toastController.create({
        color:'danger',
        duration:1000,
        message:"Сначала запишите заказ."
      }).then(el => el.present());
      return;
    }  
    
    this.modalController.create({
      component: AnketaComponent,
      // cssClass: 'my-custom-class',
      // componentProps: {
      // }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnAnketaDialogClosed(data));
      modalEl.present();
    });



  }

  itemHeightFn(tem, index) {
    return 85;
  }
}
