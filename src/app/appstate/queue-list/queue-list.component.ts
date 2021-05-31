import { take } from 'rxjs/operators';
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


  constructor(private store: Store<State>,
              public modalController: ModalController
              ) { }

  ngOnInit() {
    this.store.pipe(select(selectAllQueue),take(1)).subscribe(
      items => this.queue = items
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
    this.queue.splice(this.queue.indexOf(q),1);
  }

  Send() {
    if (this.stateData.queueCount>0 &&  this.stateData.PingStatus) {
      this.store.dispatch(doQueue());
    }
  }

  GoToOrder(q){
    this.modalController.dismiss({
      'canseled': false,
      'q':q
    });
  }

}
