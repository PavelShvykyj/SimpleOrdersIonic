import { Platform } from '@ionic/angular';
import { doQueue } from './../queue/queue-store.actions';
import { selectAppSettings } from './../appsettings/app-settings.selectors';
import { Store, select } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { Hall } from '../home/halls-store/hallsstore.reducer';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, timeout, catchError, tap,  concatMap, take } from 'rxjs/operators';
import { State } from '../reducers';
import { setPing } from '../net/netcontrol.actions';
import { Menu } from '../menu-store/menu-store.reducer';
import { Queue } from '../queue/queue-store.reducer';
import { HTTP } from '@ionic-native/http/ngx';
import { AppsettingsService } from '../appsettings/appsettings.service';
import { DatabaseService } from '../database/database.service';
import { SelectUserName, SelectUserToken } from '../authtorisation/auth.selectors';



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
export class OnecConnectorService  {

  serverIP : string = "127.0.0.1";
  baseName : string = "nobasename";
  currentStatus : boolean;
  userToken : string;

  constructor(private hclient : HttpClient, 
              private mhclient: HTTP,
              private localdb : DatabaseService,
              private setingsService: AppsettingsService,  
              private store : Store<State>,
              private plt : Platform) { 
      
      this.store.pipe(select(selectAppSettings)).subscribe(data=>{
        this.serverIP = data.onecIP;
        this.baseName = data.onecBase;
        
      });

      this.store.pipe(select(SelectUserToken)).subscribe(token=>{
        this.userToken = token;
        
        
      });

      
      setTimeout(this.Ping.bind(this),1000); 
    }


  ChangeStatus(newStatus: boolean, answer: string) {
    if (newStatus != this.currentStatus ) {
      this.store.dispatch(setPing({status:newStatus, answer: answer}));
      this.currentStatus = newStatus;
    }
  }

  Ping() {
    //console.log("PING");
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/ping`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    

    if (this.plt.is('cordova') ) {
      from(this.mhclient.get(URL,{},{})).pipe(
        timeout(5000),
        
        map(res => {
          //console.log('ping', res);
          if (res.data = "ping good") {
            this.ChangeStatus(true, "ping good")
          } else {
            this.ChangeStatus(false, 'timeout')           
          }
         }),
        catchError(err=>{
          //console.log('ping bad');
          //alert(JSON.stringify(err));
          this.ChangeStatus(false, JSON.stringify(err));        
          return of(err)
        }
          ),
        ).subscribe(
          ()=>setTimeout( this.Ping.bind(this), 4000),
          err=> setTimeout( this.Ping.bind(this), 4000)
        )
    } else {
    
    
    this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),
        
        map(res => {
          //console.log('ping', res);
          if (res = "ping good") {
            this.ChangeStatus(true, "ping good")
          } else {
            this.ChangeStatus(false, 'timeout')           
          }
         }),
        catchError(err=>{
          //console.log('ping bad');
          //alert(JSON.stringify(err));
          this.ChangeStatus(false, JSON.stringify(err));        
          return of(err)
        }
          ),
        ).subscribe(
          ()=>setTimeout( this.Ping.bind(this), 4000),
          err=> setTimeout( this.Ping.bind(this), 4000)
        )}
  }

  Login(pass:string) : Observable<any> {
    
    let authData;
   
    try {
      authData = btoa(`${this.setingsService.deviceID}:${pass}`);
    } catch (error) {
      return of({success : false })
    }
    

    /// off line mode -- logg by last login
    if (!this.currentStatus &&  this.plt.is('cordova'))  {
     return this.localdb.GetData<{authData: string , loginState: any}>("LastLogin").pipe( map(auth => {
        if (auth === undefined || auth === null) {
          return {success : false };
        }
        if (auth.authData === authData) {
          return {success : true, state : auth.loginState }
        } else {
          return {success : false };
        }
      })); 
    }

    /// normal login
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/login`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    headers.append('Authorization',authData)

    return this.hclient.post(URL,authData,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(
        timeout(5000),  
        catchError((err: HttpErrorResponse) => {
          let errState;
          if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', err.error.message);
            errState = err.error.message;
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
            errState = err.status;
          }
          return of({
            success : false,
            state : err
          })
        }),
        map(res => {
           if (typeof res === "string") {
            return {
              success : true,
              state : JSON.parse(res)
            }
            
          } else {
            return res
          }
        })
        ); 
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
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/hallstate/${this.userToken}`;
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

  GetReportsData() : Observable<any> {
    
   return this.store.pipe(
      select(SelectUserName),
      concatMap(username =>{
        console.log("userToken",this.userToken);
        const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/report/${this.userToken}/${username}`;
        let headers = new HttpHeaders().append('Content-Type','text/json');
        return this.hclient.get(URL,{headers:headers,
          observe: 'body',
          withCredentials:false,
          reportProgress:false,
          responseType:'text'}).pipe(
            timeout(5000),  
            map(res => JSON.parse(res)));
      }))
  } 
  
  GetUserInvoices() : Observable<string> {
  
    // USE mhclient on cordova !!!
    // if (this.plt.is('cordova') ) {
    //   from(this.mhclient.get(URL,{},{})).pipe(
  
    return this.store.pipe(
      select(SelectUserName),
      concatMap(userName =>{
        
        const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/userinvoices/${this.userToken}/${userName}`;
        
        let headers = new HttpHeaders().append('Content-Type','text/json');
        return this.hclient.get(URL,{headers:headers,
          observe: 'body',
          withCredentials:false,
          reportProgress:false,
          responseType:'text'})
          .pipe(
            timeout(5000), 
            catchError((err: HttpErrorResponse) => {

              if (err.error instanceof Error) {
                // A client-side or network error occurred. Handle it accordingly.
                console.error('An error occurred:', err.error.message);
              } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
              }
              // ...optionally return a default fallback value so app can continue (pick one)
              // which could be a default value
              // return Observable.of<any>({my: "default value..."});
              // or simply an empty observable
              return of("[]")})
              // ,
              // map(res => res)
              );
      }))
  }

  GetInvoiceData(id: string)  {
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets//invoice/${this.userToken}/${id}`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
   
    return this.hclient.get(URL,{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'})
      .pipe(
        timeout(5000), 
        catchError((err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.error('An error occurred:', err.error.message);
          } else {
            console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
          }
          return of("")}))
  }


  doQueue(queue: Queue[]) {
    const URL : string = `http://${this.serverIP}/${this.baseName}/hs/Worksheets/domobileactions/${this.userToken}`;
    let headers = new HttpHeaders().append('Content-Type','text/json');
    
   
    return this.hclient.post(URL,JSON.stringify(queue),{headers:headers,
      observe: 'body',
      withCredentials:false,
      reportProgress:false,
      responseType:'text'}).pipe(timeout(5000));
  }

}
