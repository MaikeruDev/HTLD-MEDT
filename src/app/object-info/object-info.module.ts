import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjectInfoPageRoutingModule } from './object-info-routing.module';

import { ObjectInfoPage } from './object-info.page';

import { NgCalendarModule } from 'ionic2-calendar';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjectInfoPageRoutingModule,
    NgCalendarModule,
    IonicSelectableModule
  ],
  declarations: [ObjectInfoPage]
})
export class ObjectInfoPageModule {}
