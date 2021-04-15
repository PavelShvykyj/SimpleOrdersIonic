import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';

@Injectable({
  providedIn: 'root'
})
export class AppsettingsService {

  _deviceID : string

  constructor(private device: Device) {
    
    setTimeout(()=> {this._deviceID = this.device.uuid}, 150) ;
   }

   
   public get deviceID() : string {
     return this._deviceID;
   }
   

}
