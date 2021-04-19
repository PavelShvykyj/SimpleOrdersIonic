import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-orderpay',
  templateUrl: './orderpay.component.html',
  styleUrls: ['./orderpay.component.css']
})
export class OrderpayComponent implements OnInit {
  @Input('OrderSumm')
  OrderSumm : number

  form : FormGroup;

  constructor(public modalController: ModalController,
    public toastController: ToastController        
      ) { }

  ngOnInit(): void {
    console.log('OrderSumm', this.OrderSumm)
    this.form = new FormGroup({
      "cash" : new FormControl(this.OrderSumm,[Validators.min(this.OrderSumm), Validators.required]),
      "paytype"  : new FormControl( 'cash' , Validators.required) 
    })
  }

  OnPayTypeSelect(event) {
    this.form.get('paytype').patchValue(event);
  }

  Save() {
    
    if (!this.form.valid) {
      this.toastController.create({
        message: 'Заполните форму правильно',
        duration: 2000,
        color:'danger',
        position:'middle',
        header:'Ошибки заполнения формы'
      }).then(toast => toast.present());
      
    }
    
    this.modalController.dismiss({
      'canseled' : false,
      'paytype'  : this.form.get('paytype').value, 
      'cash'     : this.form.get('cash').value,
    });
  }

  Cancel() {
    this.modalController.dismiss({
      'canseled': true
    });
  }

  
  public get cash() : number {
    return this.form.get('cash').value; 
  }
  

}
