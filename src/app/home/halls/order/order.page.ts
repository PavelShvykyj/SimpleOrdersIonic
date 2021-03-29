import { concatMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { of, Observable } from 'rxjs';
import { selectItemsByID, selectItemsInOrdersByID } from '../hall-state-store/hallstate.selectors';
import { Orderitem } from '../hall-state-store/hallstate.reducer';
import { Hall } from '../../halls-store/hallsstore.reducer';
import { selectHallByid } from '../../halls-store/hallsstore.selectors';
import { ActionSheetController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  items$ : Observable<Array<Orderitem>>;
  hall$  : Observable<Hall>;
  hallid: string;
  table:string;
  orderid:string;
  form : FormGroup;

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
        console.log('Favorite clicked');
      }
    }, {
      text: 'Cancel',
      
      
      handler: () => {
        
      }
    }]
  }
  
  constructor(private route : ActivatedRoute,
     private store: Store<State>,
     public actionSheetController: ActionSheetController) {


   }

  ngOnInit() {
  
    this.form = new FormGroup({
      GuestsQuontity: new FormControl(null),
      FeedBack: new FormControl(null),
    });



    this.hall$ = this.route.queryParamMap.pipe(
      tap(params => {
        
        this.hallid = params.get('hallid');
        this.table = params.get('tableid');
        this.orderid = params.get('orderid');
      }),
      concatMap(params => this.store.select(selectHallByid,params.get('hallid'))) 
    )
    
    this.items$ = this.route.queryParamMap.pipe(
      concatMap(params => {
        const ids = []
        
        ids.push(params.get('orderid'));
        
        return this.store.select(selectItemsInOrdersByID, {ids});
      }),
      concatMap(iio => {
        
        return this.store.select(selectItemsByID,{ids: iio[0].rowides})
      })
    );

    
  }

  ShowActions() {
    this.actionSheetController.create(this.actions).then(cntrl=> {
       cntrl.present();
    })
  }

}
