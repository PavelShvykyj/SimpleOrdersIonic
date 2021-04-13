import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { BaseElementsModule } from '../base-elements/base-elements.module';
import { EditOrderItemComponent } from './edit-order-item/edit-order-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    OrderPageRoutingModule,
    BaseElementsModule
  ],
  declarations: [OrderPage, EditOrderItemComponent]
})
export class OrderPageModule {}
