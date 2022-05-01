import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCategoryPageRoutingModule } from './edit-category-routing.module';

import { EditCategoryPage } from './edit-category.page';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCategoryPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [EditCategoryPage]
})
export class EditCategoryPageModule {}
