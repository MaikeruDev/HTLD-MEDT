import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoryPageRoutingModule } from './create-category-routing.module';

import { CreateCategoryPage } from './create-category.page';

import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCategoryPageRoutingModule,
    ColorPickerModule
  ],
  declarations: [CreateCategoryPage]
})
export class CreateCategoryPageModule {}
