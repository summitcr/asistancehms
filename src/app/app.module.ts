import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CrudService } from './services/crud.service';
import { UtilsService } from './services/utils.service';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { BeaconService } from './services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalPagePage } from './modal-page/modal-page.page';
import { SeePeoplePage } from './see-people/see-people.page';
import { NotificationsComponent } from './notifications/notifications.component';
import { ModalNotificationPage } from './modal-notification/modal-notification.page';

@NgModule({
  declarations: [AppComponent, ModalPagePage,NotificationsComponent, ModalNotificationPage],
  entryComponents: [ModalPagePage,NotificationsComponent, ModalNotificationPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,AutoCompleteModule,IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CrudService,UtilsService, BeaconService,IBeacon, BLE, Toast, QRScanner, LocalNotifications,SeePeoplePage,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
