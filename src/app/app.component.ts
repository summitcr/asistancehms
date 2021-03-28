import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';
import { UtilStorageService } from './services/util-storage.service';

declare var cordova;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  rootPage:any = 'LoginPage';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ble: BLE,
    private router: Router,
    private storeService: StorageService,
    private localParam: UtilStorageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("1D355E");
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.backgroundMode();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
      this.preventWebBackButton();
      this.enableBluetooth();
      this.canActivate();
    });
  }

  backgroundMode() {
    if (this.platform.is('cordova')) {
      cordova.plugins.backgroundMode.setDefaults({ 
        title: 'Hospital Monseñor Sanabria',
        text: '¡HMS se encuentra activo!',
        hidden: false,
        silent: false,
        sticky: true,
        resume: false,
        foreground: true,
        lockscreen: true,
       });

      cordova.plugins.backgroundMode.enable();
      cordova.plugins.backgroundMode.disableBatteryOptimizations();
      cordova.plugins.backgroundMode.on('activate', () => {
        cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
      });
    }
  }
  enableBluetooth(){
    if(this.platform.is('android')){
      this.ble.enable(
        );
    }
  }
  preventWebBackButton() {
    if (this.platform.is('android') && this.platform.is('mobileweb')) {
      history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      window.addEventListener('popstate', (e) => {
        e.preventDefault();
        history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      });
    } else if (this.platform.is('ios') && this.platform.is('mobileweb')) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
  }

  async canActivate(): Promise<boolean>{
    const isComplete = await this.storeService.localGet(this.localParam.localParam.tutorial);

    if(!isComplete){
      this.router.navigateByUrl('/tutorial');
    }

    return isComplete;
  
  }
}
