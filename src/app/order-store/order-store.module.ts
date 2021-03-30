import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { OrderstoreEffects } from './orderstore.effects';
import { StoreModule } from '@ngrx/store';
import { orderstoreFeatureKey, orderstorereducer } from './orderstore.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([OrderstoreEffects]),
    StoreModule.forFeature(orderstoreFeatureKey, orderstorereducer ),
  ]
})
export class OrderStoreModule { }
