import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppstateComponent } from './appstate/appstate.component';
import { QueueListComponent } from './queue-list/queue-list.component';



@NgModule({
  declarations: [AppstateComponent,QueueListComponent],
  exports: [AppstateComponent],
  imports: [
    CommonModule
  ]
})
export class AppstateModule { }
