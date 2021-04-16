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

  SaveData<T>(key:string,data:T) : Observable<T> {
    
    return from((this.db.setItem(key,data) as Promise<T>).catch<T>(err=>{ 
      return new Promise<T>((resolve, reject) => {
        ////// тут какой то лог придумать и в других методах тоже
        resolve(err);
    })}));
  }

  GetKeys() : Observable<Array<string>> {
    return from(this.db.keys());
  }
 
  DellItem(key: string) {
    return from(this.db.remove(key));
  }

  GetData<T>(key: string) : Observable<T> {
    return from(this.db.getItem(key) as Promise<T>)
  }

}
