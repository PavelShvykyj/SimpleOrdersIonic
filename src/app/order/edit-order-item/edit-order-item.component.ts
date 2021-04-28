import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Orderitem } from 'src/app/home/halls/hall-state-store/hallstate.reducer';

@Component({
  selector: 'edit-order-item',
  templateUrl: './edit-order-item.component.html',
  styleUrls: ['./edit-order-item.component.css']
})
export class EditOrderItemComponent implements OnInit {
  @Input('item')
  item : Partial<Orderitem>

  form : FormGroup;

  @ViewChild('inputId', {static: false}) ionInput: { setFocus: () => void; };
  

  constructor(public modalController: ModalController,public toastController: ToastController ) { }

  ngOnInit(): void {
    console.log('quantityprint', this.item.quantityprint);
    this.form = new FormGroup({
      "quantity" : new FormControl(this.item.quantity,Validators.min(this.item.quantityprint)),
      "comment"  : new FormControl(this.item.comment), 
    })
  
  }


  setFocusOnInput() {
    this.ionInput.setFocus();
  }

  ionViewDidEnter() {
    setTimeout(()=>this.ionInput.setFocus(),200)
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



}
