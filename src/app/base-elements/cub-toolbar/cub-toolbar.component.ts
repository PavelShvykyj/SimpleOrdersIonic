import { Menu } from './../../menu-store/menu-store.reducer';



import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

export interface ILentaElement extends Menu  {
  last: boolean,
  parity: boolean
}

export interface ITolbarCommandsList {
  commandName: string,
  buttonName: string,
  iconeName: string,
  class? : string
}


@Component({
  selector: 'cub-toolbar',
  templateUrl: './cub-toolbar.component.html',
  styleUrls: ['./cub-toolbar.component.css']
})
export class CubToolbarComponent implements OnInit {

  public lenta: ILentaElement[] = [];
  
  
  @Input('toolbarcommands') toolbarcommands: ITolbarCommandsList[]=[];

  @Output('OnElementClicked') OnElementClicked = new EventEmitter<Menu>();
  @Output('OnToolbarCommandClicked') OnToolbarCommandClicked = new EventEmitter<string>();


  @ViewChild(CubToolbarComponent, {static: false})
  toolbar: CubToolbarComponent;

  constructor() { }

  ngOnInit() {
    this.lenta = [];
  }


  AddElement(item: Menu): void {
    if(item == undefined) {
      return
    }

    if (this.lenta.length == 0) {
      const LentaElement: ILentaElement = <ILentaElement>{
        parity: false,
        last: true,
        ...item
      }
      this.lenta.push(LentaElement);
      return;
    } else {
      const newElemnt: ILentaElement = <ILentaElement>{
        parity: !this.lenta[this.lenta.length-1].parity,
        last: true,
        ...item
      }
      this.lenta[this.lenta.length-1].last = false;
      this.lenta.push(newElemnt);
    }
    
  }

  public ElementClicked(item: ILentaElement | undefined) {
    if(item == undefined) {
      this.lenta = [];
    } else {
      this.lenta.splice(0, this.lenta.indexOf(item));
      if(this.lenta.length!=0) {
        this.lenta[this.lenta.length-1].last=true;
      }
    }
    
    this.OnElementClicked.emit(item); 
  }

  ToolbarCommandClicked(commandName:string) {
    this.OnToolbarCommandClicked.emit(commandName);
  } 

  Getcommandclass(command) {
    return command.class = undefined ? "empty" : command.class;
  }

  GetColumsQuont() {
    const LentaLenth = this.lenta.length;

    if (LentaLenth <= 1) {
      return 1
    } else if(LentaLenth >= 2 && LentaLenth <= 4) {
      return 2
    } else if(LentaLenth > 4 && LentaLenth <= 6) {
      return 3
    } else {
      return 4
    }
  }

  
  public get currenName() : string {
    return this.lenta.length === 0 ? "" : this.lenta[this.lenta.length-1].name;
  }
  

}
