import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CubToolbarComponent } from './cub-toolbar/cub-toolbar.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { BarcodeinputComponent } from './barcodeinput/barcodeinput.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [CubToolbarComponent, MenuListComponent, BarcodeinputComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [MenuListComponent,CubToolbarComponent, BarcodeinputComponent ]
})
export class BaseElementsModule { }
