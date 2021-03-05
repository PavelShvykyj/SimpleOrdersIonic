import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  form : FormGroup

  constructor() {
      this.form = new FormGroup({
        ServerIP: new FormControl(null,Validators.required),
        BaseName: new FormControl(null,Validators.required)
      });

   }

  ngOnInit() {
  }

}
