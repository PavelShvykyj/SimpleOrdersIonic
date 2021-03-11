import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HallsstoreEffects } from './hallsstore.effects';
import { StoreModule } from '@ngrx/store';
import { hallstoreFeatureKey, hallstorereducer } from './hallsstore.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(hallstoreFeatureKey, hallstorereducer ),
    EffectsModule.forFeature([HallsstoreEffects])
  ]
})
export class HallsStoreModule { }
