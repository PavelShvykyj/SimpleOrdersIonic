import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { AppSettingsEffects } from './app-settings.effects';
import { StoreModule } from '@ngrx/store';
import { appSettingsFeatureKey, settingsreducer } from './app-settings.reducer';
import { ToastController } from '@ionic/angular';



@NgModule({
  declarations: [],
  providers: [ToastController],
  imports: [
    CommonModule,
    EffectsModule.forFeature([AppSettingsEffects]),
    StoreModule.forFeature(appSettingsFeatureKey, settingsreducer )
  ]
})
export class AppsettingsModule { }
