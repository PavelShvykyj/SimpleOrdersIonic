import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-barcodeinput',
  templateUrl: './barcodeinput.component.html',
  styleUrls: ['./barcodeinput.component.css']
})
export class BarcodeinputComponent implements OnInit {

  form : FormGroup;
  @ViewChild('inputCodeId', {static: false}) inputGuestsId;


  constructor(private barcodeScanner: BarcodeScanner,
              public modalController: ModalController) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      barcode: new FormControl(null,Validators.required),
    });

  }

  Scan() {
    const scanoptions : BarcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: false,
      torchOn: true
    };
    
    this.barcodeScanner.scan(scanoptions)
    .then(res => {
      if (!res.cancelled) {
        this.form.get('barcode').patchValue(res.text)
      } else {
        alert('cancelled');
      }
    })
    .catch(err=> {
      alert('somthing vrong '+JSON.stringify(err));
      this.form.get('barcode').patchValue(null)
    })
    
  }


  Activate() {
    setTimeout(()=>this.inputGuestsId.setFocus(),10)
  }

  OninputCodeIdLeave() {
    this.inputGuestsId.getInputElement().then(el=> el.blur());
  }


  Save() {
    this.modalController.dismiss({data: this.barcode});
  }

  OnInputFocus(IonInput) {
    IonInput.target.getInputElement().then(el=>{
      el.select()
    });
  }

  Cancel() {
    this.modalController.dismiss({
      'canseled': true
    });
  }

  
  private get barcode()  {
    return this.form.get('barcode').value;
  }
}
