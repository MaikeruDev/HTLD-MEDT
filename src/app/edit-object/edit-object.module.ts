import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditObjectPageRoutingModule } from './edit-object-routing.module';

import { EditObjectPage } from './edit-object.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditObjectPageRoutingModule
  ],
  declarations: [EditObjectPage]
})
export class EditObjectPageModule {}
