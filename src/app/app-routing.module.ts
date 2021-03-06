import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HeartrateComponent } from './heartrate/heartrate.component';
import { CovidComponent } from './covid/covid.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)},
  { path: 'menu', loadChildren: './menu/menu.module#MenuPageModule' },
  
  { path: 'see-people', loadChildren: './see-people/see-people.module#SeePeoplePageModule' },
  { path: 'heart-rate', component: HeartrateComponent },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'modal-notification', loadChildren: './modal-notification/modal-notification.module#ModalNotificationPageModule' },
  { path: 'Covid-19', component: CovidComponent },
  { path: 'coronavirus', loadChildren: './coronavirus/coronavirus.module#CoronavirusPageModule' },
  { path: 'confirmed', loadChildren: './confirmed/confirmed.module#ConfirmedPageModule' },
  { path: 'registro-covid', loadChildren: './registro-covid/registro-covid.module#RegistroCovidPageModule' },
  { path: 'prenatal-control', loadChildren: './prenatal-control/prenatal-control.module#PrenatalControlPageModule' },
  { path: 'map-routing', loadChildren: './map-routing/map-routing.module#MapRoutingPageModule' },
  { path: 'servicios', loadChildren: './servicios/servicios.module#ServiciosPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
