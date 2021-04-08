import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CubToolbarComponent } from './cub-toolbar/cub-toolbar.component';
import { MenuListComponent } from './menu-list/menu-list.component';


@NgModule({
  declarations: [CubToolbarComponent, MenuListComponent],
  imports: [
    CommonModule
  ],
  exports: [MenuListComponent,CubToolbarComponent ]
})
export class BaseElementsModule { }
