import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectInfoPage } from './object-info.page';

const routes: Routes = [
  {
    path: '',
    component: ObjectInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObjectInfoPageRoutingModule {}
