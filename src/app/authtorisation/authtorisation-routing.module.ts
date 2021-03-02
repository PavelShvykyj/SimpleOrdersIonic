import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthtorisationPage } from './authtorisation.page';

const routes: Routes = [
  {
    path: '',
    component: AuthtorisationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthtorisationPageRoutingModule {}
