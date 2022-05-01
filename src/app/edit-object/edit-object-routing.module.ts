import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditObjectPage } from './edit-object.page';

const routes: Routes = [
  {
    path: '',
    component: EditObjectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditObjectPageRoutingModule {}
