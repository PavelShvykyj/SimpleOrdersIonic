import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {  Store } from '@ngrx/store';
import { State } from '../reducers';
import { loggIn, loggOut } from './auth.actions';
import { BarcodeScanner, BarcodeScanResult, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-authtorisation',
  templateUrl: './authtorisation.page.html',
  styleUrls: ['./authtorisation.page.scss'],
})
export class AuthtorisationPage implements OnInit {

  form : FormGroup;

  constructor(private store: Store<State>, 
              private router : Router,
              private barcodeScanner: BarcodeScanner,
              public toastController: ToastController) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl(null,Validators.required),
    });
  }

  Loggin() {
    
    if (!this.form.valid) {
      this.toastController.create({message: 'не указан пароль',
      duration:500,
      color: 'danger'}).then(el=>el.present());
    return
    }
    
    this.store.dispatch(loggIn({UserName: this.password.value, UserToken : "TokenDemo" }));
    setTimeout(() => {
      this.router.navigateByUrl('home/halls');
    }, 10);
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

  
  private get password()  {
    return this.form.get('password')
  }
  
}
