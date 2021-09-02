import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { loggIn, loggOut } from './auth.actions';
import { BarcodeScanner, BarcodeScanResult, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { selectisDevMode } from '../appsettings/app-settings.selectors';
import { map, take, filter, concatMap } from 'rxjs/operators';
import { OnecConnectorService } from '../onec/onec.connector.service';
import { InitialState } from './reducers';
import { from } from 'rxjs';
import * as CRC32 from 'crc-32';  
import { DatabaseService } from '../database/database.service';
import { stringify } from '@angular/compiler/src/util';
import { AppsettingsService } from '../appsettings/appsettings.service';


@Component({
  selector: 'app-authtorisation',
  templateUrl: './authtorisation.page.html',
  styleUrls: ['./authtorisation.page.scss'],
})
export class AuthtorisationPage implements OnInit {

  form : FormGroup;
  inFocus : boolean = false;
  @ViewChild('passinputid', {static: false}) passinputid;
  loadIndicator;
  constructor(private store: Store<State>, 
              private onecConn : OnecConnectorService,
              private router : Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController,
              public loadingController: LoadingController,
              private localdb : DatabaseService,
              private setingsService: AppsettingsService,  
              ) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl(null,Validators.required),
    });
  }

  ionViewDidEnter() {
    setTimeout(()=>this.passinputid.setFocus(),10)
  }

  Loggin() {
    
    if (!this.form.valid) {
      this.toastController.create({
      message: 'не указан пароль',
      duration:3000,
      position:'middle',
      color: 'danger'}).then(el=>el.present());
    return
    }
    
    this.store.pipe(
      select(selectisDevMode),
      take(1),
      map(isDevMode=>{
        if (isDevMode) {
          this.store.dispatch(loggIn({data : {...InitialState, isLoggedIn: true, IsAdmin: true, UserName: 'Admin', UserToken: 'Developer'}} ));
          setTimeout(() => {
            this.router.navigateByUrl('home/halls');
          }, 10);
        } 
        return isDevMode
      }),
      filter(isDevMode=>!isDevMode),    
      concatMap(()=> { return from(this.loadingController.create({message: "Авторизация",keyboardClose:true,spinner: "lines"}))}),
      concatMap((el) => {
        this.loadIndicator = el;
        this.loadIndicator.present();
        
        return this.onecConn.Login(this.password.value)
      }),
      map((loginData)=> {
        this.loadIndicator.dismiss();
        if (!loginData.success) {
           this.toastController.create({message: 'Не авторизовано. Возможно не верный пароль или нет связи',
           duration: 2500,
           color: 'danger'}).then(el=>el.present());
           this.store.dispatch(loggOut());


        } else {
          const loginState = {...loginData.state, isLoggedIn : true};
          
          const authData = btoa(`${this.setingsService.deviceID}:${this.password.value}`);

          this.localdb.SaveData('LastLogin', {
            authData : authData,
            loginState : loginState
          })
          this.store.dispatch(loggIn({data : loginState}));
        }
        
        
        setTimeout(() => {
          this.router.navigateByUrl('home/halls');
        }, 10);
      })


      ).subscribe()

  }
  
  OnInputFocus(event) {
    this.inFocus = true;
    event.target.getInputElement().then(el=>{
      el.select()
    });
  }

  OnInputBlur() {
    this.inFocus = false;
  }

  OnPasswordLeave() {
    this.passinputid.getInputElement().then(el=>{
      this.inFocus = false;
      el.blur()
    });
    
    this.Loggin();
  }

  LogginWithCard() {

    const scanoptions : BarcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: false,
      torchOn: true
    };
    
    this.barcodeScanner.scan(scanoptions)
    .then(res => {
      if (!res.cancelled) {
        this.password.patchValue(res.text); 
      } else {
        alert('cancelled');
        this.password.patchValue(null);
        this.store.dispatch(loggOut());
      }
    })
    .catch(err=> {
      alert('somthing vrong '+JSON.stringify(err));
      this.password.patchValue(null);
    })
      
  }

  ActivatePass() {
    setTimeout(()=>this.passinputid.setFocus(),10)
  }  

  private get password()  {
    return this.form.get('password')
  }
  
}
