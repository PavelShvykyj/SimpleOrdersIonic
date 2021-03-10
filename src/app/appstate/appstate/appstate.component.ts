import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, tap, debounceTime } from 'rxjs/operators';
import { SelectUserName } from 'src/app/authtorisation/auth.selectors';
import { isConnected, isNetworkCorrect, selectnettype } from 'src/app/net/netcontrol.selectors';
import { State } from 'src/app/reducers';

@Component({
  selector: 'app-state',
  templateUrl: './appstate.component.html',
  styleUrls: ['./appstate.component.css']
})
export class AppstateComponent implements OnInit , OnDestroy {
  stateData$ :Observable<{userName:string, netName:string, isConnected:boolean, isNetworkCorrect:boolean,queueCount:number}>;
  refreshersubs: Subscription

  constructor(private detector : ChangeDetectorRef, private store: Store<State>) {


   }

  ngOnInit(): void {
    const userName$  = this.store.pipe(select(SelectUserName),tap(()=>this.detector.detectChanges()));
    const netName$   = this.store.pipe(select(selectnettype),tap(()=>this.detector.detectChanges()));
    const isConnected$    = this.store.pipe(select(isConnected),tap(()=>this.detector.detectChanges()));
    const isNetworkCorrect$ = this.store.pipe(select(isNetworkCorrect),tap(()=>this.detector.detectChanges()));
    const queueCount$  = of(5); 

    this.stateData$ = combineLatest([
      userName$, 
      netName$,
      isConnected$,
      isNetworkCorrect$,
      queueCount$]
      ).pipe(map((res)=>{return {
        userName:res[0],
        netName:res[1],
        isConnected:res[2],
        isNetworkCorrect:res[3],
        queueCount:res[4]}}));

    this.refreshersubs = this.stateData$.pipe(debounceTime(10)).subscribe((res)=>{ this.detector.detectChanges(); } );    

  }

  ngOnDestroy() {
    this.refreshersubs.unsubscribe();
  }

}
