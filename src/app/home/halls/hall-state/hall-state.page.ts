import { concatMap, map, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/reducers';

import { Hall } from '../../halls-store/hallsstore.reducer';
import { selectHallByid } from '../../halls-store/hallsstore.selectors';
import { selectHallStateData } from '../hall-state-store/hallstate.selectors';
import { OrdersOnTableData } from '../hall-state-store/hallstate.reducer';
import { loadHallstates, refreshHallstates } from '../hall-state-store/hallstate.actions';
import { PingStatus } from 'src/app/net/netcontrol.selectors';
import { NavController } from '@ionic/angular';

const GRID_COLUMS_QUONTITY: number = 4;

@Component({
  selector: 'app-hall-state',
  templateUrl: './hall-state.page.html',
  styleUrls: ['./hall-state.page.scss'],
})
export class HallStatePage implements OnInit {

  hall$: Observable<Hall>;
  hallstate$: Observable<Array<Array<OrdersOnTableData>>>;
  hallid: string;
  items: Array<any> = [];



  constructor(private router : Router,public navCtrl: NavController, private rout: ActivatedRoute, private store: Store<State>) {
    
    // this.items = [];
    //     for (let i = 1; i < 200; i++) {
    //         this.items.push({
    //            title: 'Title ' + i,

    //         });
    //     }        
  }

  ionViewWillEnter() {
    this.store.pipe(select(PingStatus),take(1)).subscribe(
      status => {
        if (status) {
          this.store.dispatch(refreshHallstates());      
        }
      }
    )
  }


  OrderCompare(o1,o2) {
    return o1 && o2 ? o1.orderid === o2.orderid : o1 === o2; 
  }

  OnOrderSelected(orderontable , select) {
    if (select.value===undefined) {
      return
    }
    const queryParams = {'orderid': select.value.orderid , hallid: orderontable.hallid, tableid : orderontable.tableid}
    
    //{ animated: false, queryParams:queryParams,  }
    this.navCtrl.navigateForward("/order",{  queryParams:queryParams  });

    //this.router.navigate(["/order"] ,{ queryParams:queryParams });
    setTimeout(()=> {select.value=undefined; select.selectedText = ''},2);

  }

  Refresh() {
    this.store.dispatch(refreshHallstates());
  }

  ngOnInit() {

    this.rout.paramMap.subscribe(snap => {
      this.hallid = snap.get('id');
      this.hall$ = this.store.pipe(select(selectHallByid, this.hallid));
      this.hallstate$ = this.hall$.pipe(
        concatMap(hall => this.store.select(selectHallStateData, hall)),
        map(hallstate => {
          let rows = []
          if (hallstate.tables.length === 0) {
            return rows;
          }
          const bloc: number = GRID_COLUMS_QUONTITY - 1;
          let end = hallstate.tables.length - 1;
          let sliceStart = 0;
          let sliceEnd = Math.min(bloc, end);

          do {
            
            let ItemBloc = hallstate.tables.slice(sliceStart, sliceEnd);
            rows.push(ItemBloc.map(item => (item as OrdersOnTableData)));
            sliceStart = sliceStart + bloc;
            sliceEnd = sliceEnd + bloc;
          } while (sliceEnd <= end)
          if (sliceEnd > end) {
            let ItemBloc = hallstate.tables.slice(sliceStart);
            rows.push(ItemBloc.map(item => (item as OrdersOnTableData)));
          }
          return rows;
        })
      );
    });
  }
  GetInterfaceOpt(tableid) {
    return {
      header: `Заказы на столе ${tableid}`

    }
  }

  trackByFn(index,item:OrdersOnTableData) {
    return item.hallid+item.tableid;
  }

}
