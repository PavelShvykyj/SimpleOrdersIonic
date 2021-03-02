import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddonsPage } from './addons.page';

const routes: Routes = [
  {
    path: '',
    component: AddonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddonsPageRoutingModule {}
