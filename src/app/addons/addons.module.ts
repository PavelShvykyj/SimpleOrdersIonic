import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddonsPageRoutingModule } from './addons-routing.module';

import { AddonsPage } from './addons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddonsPageRoutingModule
  ],
  declarations: [AddonsPage]
})
export class AddonsPageModule {}
