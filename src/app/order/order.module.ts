import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { BaseElementsModule } from '../base-elements/base-elements.module';
import { EditOrderItemComponent } from './edit-order-item/edit-order-item.component';
import { OrderpayComponent } from './orderpay/orderpay.component';
import { OrderNavComponent } from './order-nav/order-nav.component';
import { AnketaComponent } from './anketa/anketa.component';
import { GlobalDirectivesModule } from '../global-directives/global-directives.module';




@NgModule({
  imports: [
    GlobalDirectivesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OrderPageRoutingModule,
    BaseElementsModule
  ],
  declarations: [ OrderPage, EditOrderItemComponent, OrderpayComponent, OrderNavComponent, AnketaComponent]
})
export class OrderPageModule {}
