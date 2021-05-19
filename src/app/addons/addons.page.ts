import { setIP } from './../net/netcontrol.actions';
import { Store, select } from '@ngrx/store';
import { Observable, pipe } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { take, tap } from 'rxjs/operators';
import { NetState } from '../net/netcontrol.reducer';
import { State } from '../reducers';
import { selectNetcontrolState } from '../net/netcontrol.selectors';
import { NetcontrolService } from '../net/netcontrol.service';
import { OnecConnectorService } from '../onec/onec.connector.service';
import { AppsettingsService } from '../appsettings/appsettings.service';


@Component({
  selector: 'app-addons',
  templateUrl: './addons.page.html',
  styleUrls: ['./addons.page.scss'],
})
export class AddonsPage implements OnInit {


  keys$ : Observable<Array<string>>;
  netState$ : Observable<NetState>
  measure : Array<{res:boolean, duration : number}> = [];
  gajet   : string = ""; 


  constructor(private onec : OnecConnectorService,
              private netService : NetcontrolService,
              private db : DatabaseService,
              private store: Store<State>,
              private detector : ChangeDetectorRef,
              private appService : AppsettingsService
              ) { }

  ngOnInit() {
    this.keys$ = this.db.GetKeys();
    this.netState$ = this.store.pipe(select(selectNetcontrolState), tap(()=>{ this.detector.detectChanges()} ))
    this.gajet = this.appService.deviceID;
  }

  ionViewDidEnter() {
    this.gajet = this.appService.deviceID;

  }

  Clear(key: string) {
    this.db.DellItem(key);
  }

  Wiev(key: string) {
    this.db.GetData<any>(key).pipe(take(1)).subscribe(data => 
      alert(JSON.stringify(data))
    )
  }

  WievString(long : string) {
    alert(long);
  }


  RefreshIP() {
    this.netService.GetIP().pipe(take(1)).subscribe(data => {
      this.store.dispatch(setIP({IP: data.ip}));
    })

  }

  DoMeasure() {
    const start = Date.now();
    this.onec.GetHallState().subscribe(()=> {
      this.measure.push({res: true, duration :  Date.now()- start})
    }, err => {
      this.measure.push({res: false, duration :   Date.now() - start })
    })

  }

  Measure() {
    this.measure = []; 
    let  interval = setInterval(this.DoMeasure.bind(this),1000);    
    setTimeout(()=> {clearInterval(interval)},5001);
  }


}
