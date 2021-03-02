import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthtorisationPageRoutingModule } from './authtorisation-routing.module';

import { AuthtorisationPage } from './authtorisation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthtorisationPageRoutingModule
  ],
  declarations: [AuthtorisationPage]
})
export class AuthtorisationPageModule {}
