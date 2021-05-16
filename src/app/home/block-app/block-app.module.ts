import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockAppPageRoutingModule } from './block-app-routing.module';

import { BlockAppPage } from './block-app.page';
import { AppstateModule } from 'src/app/appstate/appstate.module';
import { GlobalDirectivesModule } from 'src/app/global-directives/global-directives.module';

@NgModule({
  imports: [
    GlobalDirectivesModule,
    AppstateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    BlockAppPageRoutingModule
  ],
  declarations: [BlockAppPage]
})
export class BlockAppPageModule {}
