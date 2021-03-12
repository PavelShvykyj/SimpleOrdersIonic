import { Observable } from 'rxjs';
import {  ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/reducers';

import { Hall } from '../../halls-store/hallsstore.reducer';
import { selectHallByid } from '../../halls-store/hallsstore.selectors';

@Component({
  selector: 'app-hall-state',
  templateUrl: './hall-state.page.html',
  styleUrls: ['./hall-state.page.scss'],
})
export class HallStatePage implements OnInit {

  hall$ : Observable<Hall>
  hallid : string

  constructor(private rout : ActivatedRoute, private store: Store<State> ) { }


  ngOnInit() {
    this.rout.paramMap.subscribe(snap=>{
      this.hallid = snap.get('id');
      this.hall$ = this.store.pipe(select(selectHallByid,this.hallid));
    })
  }

}
