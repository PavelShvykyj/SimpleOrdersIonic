import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HallsPageRoutingModule } from './halls-routing.module';

import { HallsPage } from './halls.page';
import { AppstateModule } from 'src/app/appstate/appstate.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HallsPageRoutingModule,
    AppstateModule
  ],
  declarations: [HallsPage]
})
export class HallsPageModule {}
