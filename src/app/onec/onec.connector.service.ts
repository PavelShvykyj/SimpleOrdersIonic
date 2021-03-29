import { selectAppSettings } from './../appsettings/app-settings.selectors';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, timeout, catchError, tap } from 'rxjs/operators';
import { State } from '../reducers';
import { HallsState } from '../home/halls/hall-state-store/hallstate.reducer';
import { setPing } from '../net/netcontrol.actions';
import { Menu } from '../menu-store/menu-store.reducer';



const FAKE_HALLS : Array<Hall> = [
  {
    id:"1",
    name: "Main",
    tables: ["1","2","3"]
  },

  {
    id:"2",
    name: "Курилка",
    tables: ["1","2","3"]
  },

  {
    id:"3",
    name: "2 этаж",
    tables: ["1","2","3"]
  },

  {
    id:"4",
    name: "Камчатка",
    tables: ["1","2","3"]
  },

  {
    id:"5",
    name: "Второй этаж",
    tables: ["1","2","3"]
  },

  {
    id:"6",
    name: "Терраса",
    tables: ["1","2","3"]
  },

]


@Injectable({
  providedIn: 'root'
})
export class OnecConnectorService implements OnInit {

  serverIP : string = "127.0.0.1";
  baseName : string = "nobasename";
  currentStatus : boolean;

  constructor(private hclient : HttpClient, 
    private store : Store<State>) { 
      
      this.store.pipe(select(selectAppSettings)).subscribe(data=>{
        this.serverIP = data.onecIP;
        this.baseName = data.onecBase;
        
      });
      console.log("servise ctor");
      setTimeout(this.Ping.bind(this),1000); 
      

    }

  ngOnInit() {
  }  

  ChangeStatus(newStatus: boolean) {
    if (newStatus != this.currentStatus) {
      this.store.dispatch(setPing({status:newStatus}));
      this.currentStatus = newStatus;
    }
  }

  Ping() {
    console.log("PING");
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/ping`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),
        map(res => {
          console.log('ping', res);
          if (res = "ping good") {
            this.ChangeStatus(true)
          } else {
            this.ChangeStatus(false)           
          }
         }),
        catchError(err=>{
          console.log('ping bad');
          
          this.ChangeStatus(false);        
          return of(err)
        }
          ),
        ).subscribe(
          ()=>setTimeout( this.Ping.bind(this), 4000),
          err=> setTimeout( this.Ping.bind(this), 4000)
        )
  }


  GetMenu() : Observable<Array<Menu>> {
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/menu`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    
   
    return this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),  
        map(res => JSON.parse(res)));

    
    //return of(FAKE_HALLS);
  }


  GetHalls() : Observable<Array<Hall>> {
    
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/halls`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    
   
    return this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),  
        map(res => JSON.parse(res)));

    
    //return of(FAKE_HALLS);
  }

  GetHallState() : Observable<any> {
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/hallstate`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    
   
    return this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),  
        map(res => JSON.parse(res))
        );


  }

}