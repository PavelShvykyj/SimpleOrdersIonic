import { concatMap, take, tap } from 'rxjs/operators';
import { loadAppSettings } from './appsettings/app-settings.actions';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { NetcontrolService } from './net/netcontrol.service';
import { State } from './reducers';
import { loadHallsstores } from './home/halls-store/hallsstore.actions';
import { loadHallstates } from './home/halls/hall-state-store/hallstate.actions';
import { IonRouterOutlet,  Platform, ToastController   } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { selectHallstateState } from './home/halls/hall-state-store/hallstate.selectors';
import { DatabaseService } from './database/database.service';
import { HallsState } from './home/halls/hall-state-store/hallstate.reducer';
import { Observable } from 'rxjs';
import { loadMenuStores } from './menu-store/menu-store.actions';
import { loadQueueStores } from './queue/queue-store.actions';


const { App } = Plugins;
const { SplashScreen } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  @ViewChild(IonRouterOutlet) 
  private  ion_outlet : IonRouterOutlet
  
  constructor(private netservise : NetcontrolService,
    private store: Store<State>,
    private localdb: DatabaseService,
    private platform : Platform,
    public toastController: ToastController
    ) {
    
  }



  ngOnInit() {
    this.platform.ready().then(()=>{
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);
    });
   
    this.netservise.isOnline("");
    this.store.dispatch(loadAppSettings());
    this.store.dispatch(loadHallsstores());
    this.store.dispatch(loadHallstates());
    this.store.dispatch(loadMenuStores());
    this.store.dispatch(loadQueueStores());
    this.PrepareToExit();
    
  }

  

  PrepareToExit() {
    this.platform.backButton.subscribeWithPriority(-100, (processNextHandler) => {
      
      processNextHandler();
      
      if (!this.ion_outlet.canGoBack() && this.ion_outlet.getLastUrl().search("block-app") != -1) {
        
        
        
        this.toastController.create({
          header: 'Do you want to exit ?',
          position: 'middle',
          color: "medium",
          buttons: [
            {
              
              side: 'end',
              text: 'yes',
              role: 'confirm',
              handler: () => {
                this.BeforeExit().subscribe(()=>App.exitApp())
              }
            }, {
              text: 'no',
              role: 'cancel',
            }
          ]
        }).then(cntr=>{
          cntr.present();
        })
      }
    });
  }

  BeforeExit() : Observable<any> {
    return this.store.pipe(
      select(selectHallstateState),
      take(1),
      concatMap(snap => this.localdb.SaveData<HallsState>('hallstateSnap',snap)
    ));

  }


}
