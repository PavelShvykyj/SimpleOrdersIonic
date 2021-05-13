import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State } from '../reducers';
import { loggIn, loggOut } from './auth.actions';
import { BarcodeScanner, BarcodeScanResult, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { selectisDevMode } from '../appsettings/app-settings.selectors';
import { map, take, filter, concatMap } from 'rxjs/operators';
import { OnecConnectorService } from '../onec/onec.connector.service';

@Component({
  selector: 'app-authtorisation',
  templateUrl: './authtorisation.page.html',
  styleUrls: ['./authtorisation.page.scss'],
})
export class AuthtorisationPage implements OnInit {

  form : FormGroup;
  @ViewChild('passinputid', {static: false}) passinputid;

  constructor(private store: Store<State>, 
              private onecConn : OnecConnectorService,
              private router : Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController) { }

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
      this.toastController.create({message: 'не указан пароль',
      duration:500,
      color: 'danger'}).then(el=>el.present());
    return
    }
    
    this.store.pipe(
      select(selectisDevMode),
      take(1),
      map(isDevMode=>{
        if (isDevMode) {
          this.store.dispatch(loggIn({UserName: this.password.value, UserToken : "TokenDemo" }));
          setTimeout(() => {
            this.router.navigateByUrl('home/halls');
          }, 10);
        } else {
          // this.toastController.create({message: 'авторизиция доступна в режиме разработки.',
          // duration:500,
          // color: 'danger'}).then(el=>el.present());
        }
        return isDevMode
      }),
      filter(isDevMode=>!isDevMode),    
      concatMap(() => {return this.onecConn.Login(this.password.value)}),
      map(loginData=> {
        if (!loginData.success) {
          // here show error 
        } 
        
        this.store.dispatch(loggIn({UserName: this.password.value, UserToken : "TokenDemo" }));
        setTimeout(() => {
          this.router.navigateByUrl('home/halls');
        }, 10);
      })


      ).subscribe()

  }
  
  OnInputFocus(event) {
    event.target.getInputElement().then(el=>{
      el.select()
    });
  }

  OnPasswordLeave() {
    this.passinputid.getInputElement().then(el=>{
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
        this.Loggin(); 
      } else {
        alert('cancelled');
        this.store.dispatch(loggOut());
        this.password.patchValue(null);
      }
    })
    .catch(err=> {
      alert('somthing throng'+JSON.stringify(err));
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
