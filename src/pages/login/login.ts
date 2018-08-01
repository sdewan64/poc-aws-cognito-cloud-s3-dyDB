import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { NavController, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';

const logger = new Logger('Login');
declare let AWS: any;

export class LoginDetails {
  username: string;
  password: string;
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  public loginDetails: LoginDetails;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private fb: Facebook
            ) {
    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    if (details.username === '' || details.username === undefined) {
      loading.dismiss();
      this.showAlert("Error", "Missing username")
      return;
    }
    if (details.password === '' || details.password === undefined) {
      loading.dismiss();
      this.showAlert("Error", "Missing password")
      return;
    }

    logger.info('login..');
    Auth.signIn(details.username, details.password)
      .then(user => {
        logger.debug('signed in user', user);
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(err => console.log(err))
      .then(() => loading.dismiss());
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  loginWithFacebook() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    logger.debug('login with FB..');
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        logger.debug('Logged into Facebook!');
        this.getUserDetail(res.authResponse.userID);
        if (res.authResponse) {
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:f2ea6b2a-9a73-4de0-97c1-9caccb985626',
            Logins: {
              'graph.facebook.com': res.authResponse.accessToken
            }
          });
          
          const user = {userID: res.authResponse.userID};

          let loadingAmplify = this.loadingCtrl.create({
            content: 'Authenticating...'
          });
          loadingAmplify.present();
          Auth.federatedSignIn('facebook', { token: res.authResponse.accessToken, expires_at: res.authResponse.expiresIn }, user)
          .then(user => {
            logger.debug("Got Amplify user")
            loadingAmplify.dismiss();
            let loadingCredential = this.loadingCtrl.create({
              content: 'Fetching credentials...'
            });
            loadingCredential.present();
            AWS.config.credentials.get(() => {
              Auth.currentAuthenticatedUser()
                .then(() => {
                  loadingCredential.dismiss(); 
                  this.navCtrl.setRoot(TabsPage);
                })
                .catch(() => { 
                  loadingCredential.dismiss();
                  logger.debug("Auth Failed"); 
                  this.showAlert("Error", "Could not log into Facebook");
                });
            });
          })
          .catch(err => {
            logger.debug(err);
            this.showAlert("Error", "Could not log into Facebook");
          });
        }
      })
      .catch(e => {
        logger.debug('Error logging into Facebook', e);
        this.showAlert("Error", "Could not log into Facebook");
      })
      .then(() => loading.dismiss());
  }

  getUserDetail(userid) {
    logger.debug('getting user details');
    this.fb.api("/"+userid+"/?fields=email",["public_profile"])
      .then(res => {
        // response is not needed right now.
        // might need to update cognito with this response in future
      })
      .catch(e => {
        logger.debug(e);
      });
  }

  notImplementedYet() {
    this.showAlert('Wait', 'This functionality is not yet implemented');
  }

  showAlert(title: String, message: String) {
    let alert = this.alertCtrl.create({
      title: title.toString(),
      subTitle: message.toString(),
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
