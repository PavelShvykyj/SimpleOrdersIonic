import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-anketa',
  templateUrl: './anketa.component.html',
  styleUrls: ['./anketa.component.scss'],
})
export class AnketaComponent implements OnInit {
  form: FormGroup;
  @ViewChild('inputGuestsId', {static: false}) inputGuestsId: { setFocus: () => void; };
  @ViewChild('inputFeedBackId', {static: false}) inputFeedBackId: { setFocus: () => void; };
  
  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      GuestsQuontity: new FormControl(null),
      FeedBack: new FormControl(null),
    });
  }

  ionViewDidEnter() {
    setTimeout(()=>this.inputGuestsId.setFocus(),10)
  }

  OnInputGuestsLeave() {
    setTimeout(()=>this.inputFeedBackId.setFocus(),10)
  }
}
