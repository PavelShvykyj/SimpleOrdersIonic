import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { MenuStoreEffects } from './menu-store.effects';
import { menuStoreFeatureKey, menustorereducer } from './menu-store.reducer';
import { StoreModule } from '@ngrx/store';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(menuStoreFeatureKey, menustorereducer ),
    EffectsModule.forFeature([MenuStoreEffects])
  ]
})
export class MenuStoreModule { }
