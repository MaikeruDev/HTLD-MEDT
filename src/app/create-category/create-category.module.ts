import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateCategoryPageRoutingModule } from './create-category-routing.module';

import { CreateCategoryPage } from './create-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateCategoryPageRoutingModule
  ],
  declarations: [CreateCategoryPage]
})
export class CreateCategoryPageModule {}
