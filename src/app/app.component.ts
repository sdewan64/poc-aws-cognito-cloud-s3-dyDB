import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Auth } from 'aws-amplify';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    let globalActions = function() {
      statusBar.styleDefault();
      statusBar.overlaysWebView(false);
      splashScreen.hide();
    };

    platform.ready()
      .then(() => {
        statusBar.overlaysWebView(false);
        Auth.currentAuthenticatedUser()
          .then(() => { 
            this.rootPage = TabsPage; 
          })
          .catch(() => { this.rootPage = LoginPage; })
          .then(() => globalActions());
      });
  }
}
