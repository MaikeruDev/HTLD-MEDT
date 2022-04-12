import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ObjectInfoPageRoutingModule } from './object-info-routing.module';

import { ObjectInfoPage } from './object-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ObjectInfoPageRoutingModule
  ],
  declarations: [ObjectInfoPage]
})
export class ObjectInfoPageModule {}
