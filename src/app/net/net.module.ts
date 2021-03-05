import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { netcontrolFeatureKey, netreducer } from './netcontrol.reducer';
import { Network } from '@ionic-native/network/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { EffectsModule } from '@ngrx/effects';
import { NetchangetEffects } from './netchanget.effects';






@NgModule({
  declarations: [],
  exports : [],
  providers: [Network,NetworkInterface],
  imports: [
    CommonModule,
    StoreModule.forFeature(netcontrolFeatureKey, netreducer ),
    EffectsModule.forFeature([NetchangetEffects])
  ]
})
export class NetModule { }
