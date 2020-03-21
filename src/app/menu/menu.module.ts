import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import { CovidComponent } from '../covid/covid.component';


const routes: Routes = [
  {
    path: '',
    component: MenuPage,
  children:[
    {
      path: 'first',
      loadChildren: '../tabs/tabs.module#TabsPageModule'
    },
    /*{
      path: 'firts/notifications',
      loadChildren: '../notification/notification.module#NotificationPageModule' 
    },*/
    {
      path:'seconds',
      loadChildren: '../see-people/see-people.module#SeePeoplePageModule' 
    },
    {
      path:'third',
      loadChildren: '../notification/notification.module#NotificationPageModule'
    },
    { path: 'four', 
    loadChildren: '../coronavirus/coronavirus.module#CoronavirusPageModule' },
  ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
