import { Component } from '@angular/core';
import { NetcontrolService } from './net/netcontrol.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private netservise : NetcontrolService) {
    this.netservise.isOnline("");
  }
}
