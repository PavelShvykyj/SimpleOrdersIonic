import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'halls',
        loadChildren: () => import('../halls/halls.module').then( m => m.HallsPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('../reports/reports.module').then( m => m.ReportsPageModule)
      },
      
      {
        path: 'block-app',
        loadChildren: () => import('./block-app/block-app.module').then( m => m.BlockAppPageModule)
      },

      {
        path: '',
        redirectTo: 'block-app',
        pathMatch: 'full'
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
