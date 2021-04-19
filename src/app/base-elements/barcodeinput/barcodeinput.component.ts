import { Component, OnInit, Output } from '@angular/core';
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
        this.barcode.patchValue(res.text); 
        
      } else {
        alert('cancelled');
        
        
      }
    })
    .catch(err=> {
      alert('somthing throng'+JSON.stringify(err));
      this.barcode.patchValue(null);
    })
    
  }

  Save() {
    this.modalController.dismiss({data: this.barcode});
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
