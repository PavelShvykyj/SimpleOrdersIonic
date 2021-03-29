import { refreshHallsstores } from './../halls-store/hallsstore.actions';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';

import { Hall } from '../halls-store/hallsstore.reducer';
import { selectAllHalls } from '../halls-store/hallsstore.selectors';

@Component({
  selector: 'app-halls',
  templateUrl: './halls.page.html',
  styleUrls: ['./halls.page.scss'],
})
export class HallsPage implements OnInit {

  halls$ : Observable<Array<Hall>>

  //selectAllHalls
  constructor(private store: Store<State>,public loadingController: LoadingController ) { }

  ngOnInit() {
    this.halls$ = this.store.select(selectAllHalls);
  }

  Refresh() {
    this.store.dispatch(refreshHallsstores())
  }



 

}
