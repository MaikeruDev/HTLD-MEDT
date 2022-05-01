import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewObjectPageRoutingModule } from './new-object-routing.module';

import { NewObjectPage } from './new-object.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewObjectPageRoutingModule
  ],
  declarations: [NewObjectPage]
})
export class NewObjectPageModule {}
