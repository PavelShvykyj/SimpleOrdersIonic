import { tap } from 'rxjs/operators';
import { Menu } from './../../menu-store/menu-store.reducer';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { selectMemuByName, selectMemuByParent } from 'src/app/menu-store/menu-store.selectors';
import { State } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { CubToolbarComponent } from '../cub-toolbar/cub-toolbar.component';


@Component({
  selector: 'menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  menuitems$ : Observable<Array<Menu>>
  menuitems: Array<Menu> = []
  @ViewChild(CubToolbarComponent, { static: false })
  toolbar: CubToolbarComponent;

  @Output('MenuElementSelect')
  MenuElementSelect = new EventEmitter();


  constructor(private store: Store<State>, private detector : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.menuitems$ = this.store.pipe(select(selectMemuByParent,""),tap((data)=>{
      this.menuitems = data;
      this.detector.detectChanges();
      console.log('emty parent',  data);
    }));

  }

  OnNameFilterInput(event) {
    
    if (event.length == 0) {
      
      this.menuitems$ = this.store.pipe(select(selectMemuByParent,  this.GetCurrentParentID() ));
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = ".*"+event.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
      this.menuitems$ = this.store.pipe(select(selectMemuByName, {  filter: reg, onlyfolders: false }));
    }

  }

  OnLentaElementClicked(event) {
    let id = "";
    if (event != undefined)  {
      id = event.id
    }
    
    this.menuitems$ = this.store.pipe(select(selectMemuByParent,id))
  }

  ElementClicked(item) {
    if (item.isFolder) {
      //this.ds.GetList(item.id);
      
      this.menuitems$ = this.store.pipe(select(selectMemuByParent,item.id))
      this.toolbar.AddElement(item);
      
    } else {     
      this.MenuElementSelect.emit(item);
    }

  }

  OnToolbarCommandClicked(event) {

  }

  GetCurrentParentID(): string | undefined {
    const parent = this.GetCurrentParent();
    if (parent == undefined) {
      return ""
    } else {
      return parent.id
    }
  }

  GetCurrentParent(): Menu | undefined {
    let parent: Menu = undefined;
    if (this.toolbar.lenta.length != 0) {
      parent = this.toolbar.lenta[this.toolbar.lenta.length - 1];
    }
    return parent;

  }


}