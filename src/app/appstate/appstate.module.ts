import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppstateComponent } from './appstate/appstate.component';



@NgModule({
  declarations: [AppstateComponent],
  exports: [AppstateComponent],
  imports: [
    CommonModule
  ]
})
export class AppstateModule { }
