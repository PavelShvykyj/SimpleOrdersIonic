import { selectAppSettings } from './../appsettings/app-settings.selectors';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { State } from '../reducers';


const FAKE_HALLS : Array<Hall> = [
  {
    id:"1",
    name: "Main"
  },

  {
    id:"2",
    name: "Курилка"
  },

  {
    id:"3",
    name: "2 этаж"
  },

  {
    id:"4",
    name: "Камчатка"
  },

  {
    id:"5",
    name: "Второй этаж"
  },

  {
    id:"6",
    name: "Терраса"
  },

]


@Injectable({
  providedIn: 'root'
})
export class OnecConnectorService implements OnInit {

  serverIP : string;
  baseName : string;

  constructor(private hclient : HttpClient, 
    private store : Store<State>) { }

  ngOnInit() {
    this.store.pipe(select(selectAppSettings)).subscribe(data=>{
      this.serverIP = data.onecIP;
      this.baseName = data.onecBase;
    });
  }  

  GetHalls() : Observable<Array<Hall>> {
    
    const URL : string = "http://192.168.1.112/Base/hs/Worksheets/halls";
    let headers = new HttpHeaders().append('Content-Type','text/json');
    
   
    return this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(map(res => JSON.parse(res)));

    
    //return of(FAKE_HALLS);
  }


}
