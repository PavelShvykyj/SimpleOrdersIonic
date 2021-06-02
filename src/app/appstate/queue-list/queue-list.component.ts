import { map, take } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { doQueue, UpdateQueue } from './../../queue/queue-store.actions';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store, props, select } from '@ngrx/store';
import { DatabaseService } from 'src/app/database/database.service';
import { Queue } from 'src/app/queue/queue-store.reducer';
import { State } from 'src/app/reducers';
import { selectAllQueue } from 'src/app/queue/queue-store.selectors';

@Component({
  selector: 'app-queue-list',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.scss'],
})
export class QueueListComponent implements OnInit {

  queue : Array<Queue> = []
  @Input('stateData')
  stateData : any
  wievitems : Array<any> = []


  constructor(private store: Store<State>,
              public modalController: ModalController
              ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.Refresh(); 
  }

  GetFormatedItems(items: Array<Queue>) : Array<any>{
    const qids = items.map(el => {return el.commandParametr.orderid})
    const idset = new Set(qids);
    let wievitems = [];
    for (let orderid of idset.keys()) {
      
      let orderq = items.filter(el=> el.commandParametr.orderid === orderid);
      
      let header = {
        id: orderid, 
        isheader : true,
        hallid : orderq[0].commandParametr.hallid,
        table  : orderq[0].commandParametr.table,
        waiter : orderq[0].commandParametr.waiter
      }

      wievitems.push(header);
      wievitems = wievitems.concat(orderq);

      // console.log('wievitems',wievitems);
      
      
    }

    
    return wievitems
  }

  Refresh() {
    this.store.pipe(select(selectAllQueue),
    take(1)
    ).subscribe(
      items => {
        this.queue = items;
        this.wievitems = this.GetFormatedItems(items)}
    ) 
  }

  Cancel(){
    this.modalController.dismiss({
      'canseled': true
    });
  }

  Save() {
    this.store.dispatch(UpdateQueue({data: this.queue}))
    this.modalController.dismiss({
      'canseled': true
    });
  }

  Clear(q) {
    this.wievitems.splice(this.wievitems.indexOf(q),1);
    this.queue.splice(this.queue.indexOf(q),1);
  }

  Send() {
    if (this.stateData.queueCount>0 &&  this.stateData.PingStatus) {
      this.store.dispatch(doQueue());
    }
    this.modalController.dismiss({
      'canseled': true
    });
  }

  GoToOrder(q){
    this.modalController.dismiss({
      'canseled': false,
      'q':q
    });
  }

}
