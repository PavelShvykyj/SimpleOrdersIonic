import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { setAppSettings } from '../appsettings/app-settings.actions';
import { selectAppSettings, selectAppSettingsState } from '../appsettings/app-settings.selectors';
import { State } from '../reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  form : FormGroup
  

  constructor(private store: Store<State>,public loadingController: LoadingController, public toastController: ToastController) {

   }

  ngOnInit() {
    this.form = new FormGroup({
      ServerIP: new FormControl(null,Validators.required),
      BaseName: new FormControl(null,Validators.required),
      isDevMode: new FormControl(true),
    });

    this.loadingController.create({message:"loading"}).then(
      el=> this.InitForm(el));
    

  }

  InitForm(loadElement: HTMLIonLoadingElement) {
    loadElement.present();
    this.store.pipe(select(selectAppSettings),take(1)).subscribe(res=>{
      this.form.setValue({ServerIP: res.onecIP, BaseName: res.onecBase, isDevMode: res.isDevMode});
      setTimeout(() => {
        loadElement.dismiss();
      }, 200); 
    });
  }

  SaveSettings() {
    if (!this.form.valid) {
      this.toastController.create({message: 'не верно заполнена форма',
        duration:500,
        color: 'danger'}).then(el=>el.present());
      return
    }
    this.store.dispatch(setAppSettings({key:'appsettings',data: {
      onecIP: this.form.get('ServerIP').value,
      onecBase: this.form.get('BaseName').value,
      isDevMode: this.form.get('isDevMode').value
  }}))
  }

}
