import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HallstateEffects } from './hallstate.effects';
import { StoreModule } from '@ngrx/store';
import { hallstateFeatureKey, hallstatereducer } from './hallstate.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([HallstateEffects]),
    StoreModule.forFeature(hallstateFeatureKey, hallstatereducer ),
  ]
})
export class HallStateStoreModule { }
