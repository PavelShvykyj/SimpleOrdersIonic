import { doQueue } from './../../queue/queue-store.actions';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, tap, debounceTime } from 'rxjs/operators';
import { SelectUserName } from 'src/app/authtorisation/auth.selectors';
import { isConnected, isNetworkCorrect, PingStatus, selectnettype } from 'src/app/net/netcontrol.selectors';
import { selectQueueLenth } from 'src/app/queue/queue-store.selectors';
import { State } from 'src/app/reducers';
import { ModalController, NavController } from '@ionic/angular';
import { QueueListComponent } from '../queue-list/queue-list.component';
import { Queue } from 'src/app/queue/queue-store.reducer';


@Component({
  selector: 'app-state',
  templateUrl: './appstate.component.html',
  styleUrls: ['./appstate.component.css']
})
export class AppstateComponent implements OnInit , OnDestroy {
  //stateData$ :Observable<{userName:string, netName:string, queueCount:number}>;
  stateData : {userName:string, netName:string, queueCount:number};
  refreshersubs: Subscription

  constructor(private detector : ChangeDetectorRef,
              private store: Store<State>,
              public ctrl: NavController,
              public modalController: ModalController) {


   }

  ngOnInit(): void {
    // const userName$  = this.store.pipe(select(SelectUserName),tap(()=>this.detector.detectChanges()));
    // const netName$   = this.store.pipe(select(selectnettype),tap(()=>this.detector.detectChanges()));
    // const queueCount$  = this.store.pipe(select(selectQueueLenth),tap(()=>this.detector.detectChanges()));
    // const PingStatus$  = this.store.pipe(select(PingStatus),tap(()=>this.detector.detectChanges()));

    
    this.refreshersubs = combineLatest([
    this.store.pipe(select(SelectUserName),tap(()=>this.detector.detectChanges())),
    this.store.pipe(select(selectnettype),tap(()=>this.detector.detectChanges())),
    this.store.pipe(select(selectQueueLenth),tap(()=>this.detector.detectChanges())),
    this.store.pipe(select(PingStatus),tap(()=>this.detector.detectChanges()))
    ]).pipe(
      
      
      map((res)=>{return {
        userName:res[0],
        netName:res[1],
        queueCount:res[2],
        PingStatus:res[3],
      }})
      ).subscribe((res)=>{ 
      this.stateData = res;
      

       } );    

  }

  ngOnDestroy() {
    this.refreshersubs.unsubscribe();
  }


  OnQueueClicked(stateData) {
    this.modalController.create({
      componentProps: {stateData},
      component: QueueListComponent,
    }).then(modalEl => {
      modalEl.onWillDismiss().then(data => this.OnQListDialogClosed(data));
      modalEl.present();
    });
  }

  OnQListDialogClosed(data: any) {
    

    if (data.data.canseled) {
      return
    }

    const q : Queue = data.data.q;
    const queryParams = {
      orderid: q.commandParametr.orderid ,
      hallid: q.commandParametr.hallid,
      tableid : q.commandParametr.table
    };
    console.log('queryParams',queryParams);
    this.ctrl.navigateForward("/order",{  queryParams:queryParams  })
  }


}
