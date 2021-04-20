import { Store, select } from '@ngrx/store';
import { Observable, pipe } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { take, tap } from 'rxjs/operators';
import { NetState } from '../net/netcontrol.reducer';
import { State } from '../reducers';
import { selectNetcontrolState } from '../net/netcontrol.selectors';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.page.html',
  styleUrls: ['./addons.page.scss'],
})
export class AddonsPage implements OnInit {


  keys$ : Observable<Array<string>>;
  netState$ : Observable<NetState>

  constructor(private db : DatabaseService, private store: Store<State>,private detector : ChangeDetectorRef) { }

  ngOnInit() {
    this.keys$ = this.db.GetKeys();
    this.netState$ = this.store.pipe(select(selectNetcontrolState), tap(()=>{ this.detector.detectChanges()} ))

  }

  Clear(key: string) {
    this.db.DellItem(key);
  }

  Wiev(key: string) {
    this.db.GetData<any>(key).pipe(take(1)).subscribe(data => 
      alert(JSON.stringify(data))
    )
  }
}
