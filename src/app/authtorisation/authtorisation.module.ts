import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthtorisationPageRoutingModule } from './authtorisation-routing.module';

import { AuthtorisationPage } from './authtorisation.page';
import { StoreModule } from '@ngrx/store';
import * as fromAuthtorisation from './reducers';
import { authreducer } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthtorisationPageRoutingModule,
    StoreModule.forFeature(fromAuthtorisation.authtorisationFeatureKey, authreducer, { metaReducers: fromAuthtorisation.metaReducers })
  ],
  declarations: [AuthtorisationPage]
})
export class AuthtorisationPageModule {}
