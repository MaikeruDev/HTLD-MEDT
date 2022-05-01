import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewTeacherPage } from './new-teacher.page';

const routes: Routes = [
  {
    path: '',
    component: NewTeacherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewTeacherPageRoutingModule {}
