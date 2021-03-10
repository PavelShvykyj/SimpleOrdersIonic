import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NativeStorage } from '@ionic-native/native-storage/ngx';


@NgModule({
  declarations: [],
  providers: [NativeStorage],
  imports: [
    CommonModule
  ]
})
export class DatabaseModule { }
