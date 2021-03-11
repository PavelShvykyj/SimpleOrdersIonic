import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallsPage } from './halls.page';

const routes: Routes = [
  {
    path: '',
    component: HallsPage
  },
  {
    path: 'hall-state/:id',
    loadChildren: () => import('./hall-state/hall-state.module').then( m => m.HallStatePageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HallsPageRoutingModule {}
