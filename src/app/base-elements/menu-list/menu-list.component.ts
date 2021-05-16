import { concatMap, map, take } from 'rxjs/operators';

import { Menu } from './../../menu-store/menu-store.reducer';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectMemuByid, selectMemuByName, selectMemuByParent } from 'src/app/menu-store/menu-store.selectors';
import { State } from 'src/app/reducers';
import { Observable, Subscription } from 'rxjs';
import { CubToolbarComponent } from '../cub-toolbar/cub-toolbar.component';
import { selectOrderItems } from 'src/app/home/halls/hall-state-store/hallstate.selectors';


@Component({
  selector: 'menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  menuitems$ : Observable<Array<Menu>>
  //menuitems: Array<Menu> = []
  @ViewChild(CubToolbarComponent, { static: false })
  toolbar: CubToolbarComponent;

  @Output('MenuElementSelect')
  MenuElementSelect = new EventEmitter();

  
  callBack :  Function;
  GetOrderId : Function;
  hallid: string = "";  
  table : string = "";

  orderid : string;
  items : {[key:string]:number} = {};
  itemssubs : Subscription
  intervalref

  @ViewChild('search') search ;

  constructor(private store: Store<State>, private detector : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.menuitems$ = this.store.pipe(select(selectMemuByParent,""));
    this.OnOrderIdChange();
    //   ,tap((data)=>{
    //   this.menuitems = data;
    //   this.detector.detectChanges();
      
    // }));
    
    
  }

  ionViewDidLeave() {
    this.itemssubs.unsubscribe();
    if (this.intervalref) {
      clearInterval(this.intervalref);
    }

  }

  OnOrderIdChange() {
    if (this.itemssubs) {
      this.itemssubs.unsubscribe();
    }
    this.itemssubs = this.store.pipe(select(selectOrderItems, this.orderid),
    map(orderitems => {
      let items =  ({} as {[key:string]:number});
      orderitems.forEach(el => {
        items[el.goodid.trim()]=el.quantity;
      })
      return items
    })).subscribe(res => {this.items=res}); 

  }

  OnNameFilterInput(event) {
    
    if (event.length == 0) {
      
      this.menuitems$ = this.store.pipe(select(selectMemuByParent,  this.currentParentID ));
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = ".*"+event.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
      this.menuitems$ = this.store.pipe(select(selectMemuByName, {  filter: reg, onlyfolders: false }));
    }

  }

  // depricatesd
  OnLentaElementClicked(event) {
    if (this.search.value.length != 0) {
      this.OnSearhLeave();
    } 
    
    let id = "";
    if (event != undefined)  {
      id = event.id
    }
    
    this.menuitems$ = this.store.pipe(select(selectMemuByParent,id))
  }

  OnHomeClick() {
    this.OnSearhLeave();
    this.toolbar.ElementClicked(undefined);
  }

  ElementClicked(item:Menu) {
    if (this.search.value.length != 0) {
      this.OnSearhLeave();
      if(!item.isFolder && item.parentid != this.currentParentID) {
        this.store.pipe(select(selectMemuByid,item.parentid),take(1)).subscribe(el=>{
          this.ElementClicked(el);
        })  
      }
    } 
    
    if (item.isFolder) {
      
      this.menuitems$ = this.store.pipe(select(selectMemuByParent,item.id))
      this.toolbar.AddElement(item);
      
    } else {     
      this.callBack(item);
      if (!this.orderid && !this.intervalref) {
        this.intervalref = setInterval(()=>{
          this.orderid= this.GetOrderId();
          if (this.orderid) {
            clearInterval(this.intervalref);
            this.OnOrderIdChange();  
          }  
        },500)
      }
    }

  }

  OnToolbarCommandClicked(event) {

  }

  OnBackClick() {
    this.OnSearhLeave();
    if (this.toolbar) {
      if (this.toolbar.lenta.length!=0) {
        this.toolbar.lenta.splice(this.toolbar.lenta.length-1);
        this.toolbar.ElementClicked(this.toolbar.lenta[0]);
      } 

    }
  }

  OnSearhLeave() {
    this.search.value = '';
    this.OnNameFilterInput('');
    this.search.getInputElement().then(el=> {
      
      el.blur();
    });

  }

  public get currentParentID(): string | undefined {
    const parent = this.currentParent;
    if (parent == undefined) {
      return ""
    } else {
      return parent.id
    }
  }

 

  public get currentParent(): Menu | undefined {
    let parent: Menu = undefined;
    if (this.toolbar.lenta.length != 0) {
      parent = this.toolbar.lenta[this.toolbar.lenta.length - 1];
    }
    return parent;

  }
  
  public get parentName() : string {
    if (this.toolbar ) {
      return this.toolbar.currenName;
    }
   
    return "";
  }
  
  ActivateSearch() {
    setTimeout(() => {
      this.search.setFocus();
    }, 50);
  }

  trackByFn(index,item:Menu) {
    return item.id;
  }

}
