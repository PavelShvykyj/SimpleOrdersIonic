import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderNavComponent } from './order-nav/order-nav.component';


import { OrderPage } from './order.page';

const routes: Routes = [
  {
    path: '',
    component: OrderNavComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPageRoutingModule {}
