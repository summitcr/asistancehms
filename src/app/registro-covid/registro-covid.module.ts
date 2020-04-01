import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistroCovidPage } from './registro-covid.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroCovidPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes), 
  ],
  declarations: [RegistroCovidPage]
})
export class RegistroCovidPageModule {}
