import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewTeacherPageRoutingModule } from './new-teacher-routing.module';

import { NewTeacherPage } from './new-teacher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewTeacherPageRoutingModule
  ],
  declarations: [NewTeacherPage]
})
export class NewTeacherPageModule {}
