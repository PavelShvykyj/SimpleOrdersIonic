import { select } from '@ngrx/store';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Orderitem } from 'src/app/home/halls/hall-state-store/hallstate.reducer';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'edit-order-item',
  templateUrl: './edit-order-item.component.html',
  styleUrls: ['./edit-order-item.component.css']
})
export class EditOrderItemComponent implements OnInit {
  @Input('item')
  item : Partial<Orderitem>

  minus: number = 1;
  form : FormGroup;

  @ViewChild('inputId', {static: false}) ionInput;
  @ViewChild('commentinputId', {static: false}) commentinputId;

  

  constructor(public modalController: ModalController,public toastController: ToastController,private keyboard: Keyboard ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      "quantity" : new FormControl(this.item.quantity === 0 ? 1 : this.item.quantity ,Validators.min(this.item.quantityprint)),
      "comment"  : new FormControl(this.item.comment), 
    })
  
  }


  setFocusOnInput() {
    this.ionInput.setFocus();
  }

  ionViewDidEnter() {
    //setTimeout(()=>this.ionInput.setFocus(),10)
  }

  OnQuantityLeave() {
    setTimeout(()=>this.commentinputId.setFocus(),10)
  }

  OnCommentLeave() {
    this.commentinputId.getInputElement().then(el=> el.blur());
  }

  Save() {
    if (!this.form.valid) {
      this.toastController.create({message: "Не верное значение",
        duration: 1500,
        position: 'middle',
        color: 'danger'}).then(ctrl=> ctrl.present())
      return;
    }
    this.modalController.dismiss({
      'canseled'    : false,
      'quantity'    : this.form.get('quantity').value, 
      'comment'     : this.form.get('comment').value,
      'goodname'    : this.item.goodname,
      'price'       : this.item.price,
      'goodid'      : this.item.goodid
    });

  }


  Cancel() {
    this.modalController.dismiss({
      'canseled': true
    });
  }

  SetMinus() {
    this.minus = this.minus*(-1);
  }

  OnAddClick(quontity:number) {
    const val = this.form.get('quantity').value;
    this.form.get('quantity').patchValue(Math.max(this.item.quantityprint, val+quontity*this.minus));
  }

  EnterNumber() {
    setTimeout(()=>this.ionInput.setFocus(),10);
  }

  OnInputFocus(IonInput) {
    IonInput.target.getInputElement().then(el=>{
      el.select()
    });
  }

}
