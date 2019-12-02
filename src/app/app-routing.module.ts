import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeartrateComponent } from './heartrate/heartrate.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  
  { path: 'see-people', loadChildren: './see-people/see-people.module#SeePeoplePageModule' },
  { path: 'heart-rate', component: HeartrateComponent },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'modal-notification', loadChildren: './modal-notification/modal-notification.module#ModalNotificationPageModule' },
 
  

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
