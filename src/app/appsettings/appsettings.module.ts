import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { AppSettingsEffects } from './app-settings.effects';
import { StoreModule } from '@ngrx/store';
import { appSettingsFeatureKey, settingsreducer } from './app-settings.reducer';
import { ToastController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';



@NgModule({
  declarations: [],
  providers: [ToastController, Device],
  imports: [
    CommonModule,
    EffectsModule.forFeature([AppSettingsEffects]),
    StoreModule.forFeature(appSettingsFeatureKey, settingsreducer )
  ]
})
export class AppsettingsModule { }
