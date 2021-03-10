import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {  from, Observable, of } from 'rxjs';
import { SettingsState } from '../appsettings/app-settings.reducer';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db : NativeStorage) { 
    
  }

  SaveData(key:string,data:SettingsState) : Observable<SettingsState> {
    
    return from(this.db.setItem(key,data));
  }

  GetData(key: string) : Observable<SettingsState> {
    
    return from(this.db.getItem(key))
  }
  

}
