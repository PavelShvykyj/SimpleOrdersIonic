import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';
import { loggOut } from 'src/app/authtorisation/auth.actions';
import { DatabaseService } from 'src/app/database/database.service';
import { State } from 'src/app/reducers';
import { HallsState } from '../halls/hall-state-store/hallstate.reducer';
import { selectHallstateState } from '../halls/hall-state-store/hallstate.selectors';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
const { App } = Plugins;


@Component({
  selector: 'app-block-app',
  templateUrl: './block-app.page.html',
  styleUrls: ['./block-app.page.scss'],
})
export class BlockAppPage implements OnInit {

  constructor(private store: Store<State>, 
    private localdb: DatabaseService,
    public toastController: ToastController
    ) { }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.store.dispatch(loggOut());
  }


  PrepareToExit() {
        this.toastController.create({
          header: 'Действительно закрыть  ?',
          position: 'middle',
          color: "medium",
          buttons: [
            {
              
              side: 'end',
              text: 'да',
              role: 'confirm',
              handler: () => {
                this.BeforeExit().subscribe(()=>App.exitApp())
              }
            }, {
              text: 'нет',
              role: 'cancel',
            }
          ]
        }).then(cntr=>{
          cntr.present();
        })
  }


  BeforeExit() : Observable<any> {
    return this.store.pipe(
      select(selectHallstateState),
      take(1),
      concatMap(snap => this.localdb.SaveData<HallsState>('hallstateSnap',snap)
    ));
  }

  
}
