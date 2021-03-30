import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HallsPage } from './halls.page';

const routes: Routes = [
  {
    path: '',
    component: HallsPage
  },  
    
      {
        path: 'hallstate/:id',
        loadChildren: () => import('./hall-state/hall-state.module').then( m => m.HallStatePageModule)
      },
      {
        path: '',
        redirectTo: 'block-app',
        pathMatch: 'full'
      }
    ];



  



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HallsPageRoutingModule {}
