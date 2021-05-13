import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-anketa',
  templateUrl: './anketa.component.html',
  styleUrls: ['./anketa.component.scss'],
})
export class AnketaComponent implements OnInit {
  form: FormGroup;
  @ViewChild('inputGuestsId', {static: false}) inputGuestsId;
  @ViewChild('inputFeedBackId', {static: false}) inputFeedBackId;
  
  constructor(private keyboard: Keyboard) { }

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

  OnInputFeedBackLeave() {
    this.inputFeedBackId.getInputElement().then(el=> el.blur());
  }

  OnInputFocus(IonInput) {
    IonInput.target.getInputElement().then(el=>{
      el.select()
    });
  }

}
