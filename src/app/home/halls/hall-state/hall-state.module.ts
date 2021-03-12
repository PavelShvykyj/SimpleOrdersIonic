
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallStatePageRoutingModule } from './hall-state-routing.module';

import { HallStatePage } from './hall-state.page';

@NgModule({
  imports: [
    CommonModule,
    
    FormsModule,
    IonicModule,
    HallStatePageRoutingModule
  ],
  declarations: [HallStatePage]
})
export class HallStatePageModule {}
