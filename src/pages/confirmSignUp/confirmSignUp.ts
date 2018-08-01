import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { LoginPage } from '../login/login';

const logger = new Logger('ConfirmSignUp');

@Component({
  selector: 'page-confirm-signup',
  templateUrl: 'confirmSignUp.html'
})
export class ConfirmSignUpPage {
  
  public code: string;
  public username: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.username = navParams.get('username');
  }

  confirm() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    Auth.confirmSignUp(this.username, this.code)
      .then(() => {
        this.showAlert("Success", "Code verfied");
        this.navCtrl.push(LoginPage);
      })
      .catch(err => {
        logger.debug('confirm error', err);
        this.showAlert("Error", "Code verification failed");
      })
      .then(() => loading.dismiss());
  }

  resendCode() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    Auth.resendSignUp(this.username)
      .then(() => {
        logger.debug('sent');
        this.showAlert("Success", "Code resent");
      })
      .catch(err => {
        logger.debug('send code error', err);
        this.showAlert("Error", "Failed to send code");
      })
      .then(() => loading.dismiss());
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
