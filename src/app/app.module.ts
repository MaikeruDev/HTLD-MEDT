import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import {HttpClientModule} from '@angular/common/http';

import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgCalendarModule } from 'ionic2-calendar';

import { IonicSelectableModule } from 'ionic-selectable';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ColorPickerModule, IonicSelectableModule, NgCalendarModule, ImageCropperModule, HttpClientModule, NgxQRCodeModule, BrowserModule, IonicModule.forRoot({mode: "md"}), AppRoutingModule, AngularFireStorageModule, AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig), AngularFirestoreModule, AngularFireAuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
