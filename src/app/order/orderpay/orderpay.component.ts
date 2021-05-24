
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('cashinputId', {static: false}) cashinputId ;

  form : FormGroup;
  isCredid : boolean = false;


  constructor(public modalController: ModalController,
    public toastController: ToastController        
      ) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      "cash" : new FormControl(this.OrderSumm,[Validators.min(this.OrderSumm), Validators.required]),
      "paytype"  : new FormControl( 'cash' , Validators.required) 
    })
  }

  
  ionViewDidEnter() {
    // setTimeout(()=>this.cashinputId.setFocus(),50);
    // setTimeout(()=>this.cashinputId.setFocus(),10);
  }

  OnPayTypeSelect(event) {
    const paytype = event.target.value;
    this.form.get('paytype').patchValue(paytype);
    this.isCredid = (paytype === "credit");
    let cashControl  = this.form.get('cash');
    if (this.isCredid) {
      cashControl.patchValue(this.OrderSumm);
      cashControl.disable();
    } else {
      cashControl.enable();
    }

    

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
      canseled : false,
      paytype  : this.form.get('paytype').value, 
      cash     : this.form.get('cash').value,
    });
  }

  Cancel() {
    this.modalController.dismiss({
      canseled: true
    });
  }

  ActivateSumm() {
    setTimeout(()=>this.cashinputId.setFocus(),10);
  }
  
  OnSummInput() {
    this.cashinputId.getInputElement().then(el=> el.blur());
  }

  OnInputFocus(IonInput) {
    IonInput.target.getInputElement().then(el=>{
      el.select()
    });
  }

  public get cash() : number {
    return this.form.get('cash').value; 
  }
  

}
