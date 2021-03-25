import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AuthtorisationPageModule } from './authtorisation/authtorisation.module';
import { NetModule } from './net/net.module';
import { AppsettingsModule } from './appsettings/appsettings.module';
import { DatabaseModule } from './database/database.module';
import { HallsStoreModule } from './home/halls-store/halls-store.module';
import { HttpClientModule } from '@angular/common/http';
import { HallStateStoreModule } from './home/halls/hall-state-store/hall-state-store.module';
import { MenuStoreModule } from './menu-store/menu-store.module';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
            HttpClientModule,
            IonicModule.forRoot(),
            AppRoutingModule,
            EffectsModule.forRoot([]),
            StoreModule.forRoot(reducers, { metaReducers }), !environment.production ? StoreDevtoolsModule.instrument() : [], StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
            AuthtorisationPageModule,
            NetModule,
            AppsettingsModule,
            HallsStoreModule,
            HallStateStoreModule,
            MenuStoreModule,
            DatabaseModule
            
          ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
