import { Component, ViewChild } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("1D355E");
      this.statusBar.overlaysWebView(false);
      this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
      this.preventWebBackButton();
    });
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
}
