import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { QueueStoreEffects } from './queue-store.effects';
import { StoreModule } from '@ngrx/store';
import { queueStoreFeatureKey, queuestorereducer } from './queue-store.reducer';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(queueStoreFeatureKey, queuestorereducer ),
    EffectsModule.forFeature([QueueStoreEffects])
  ]
})
export class QueueModule { }
