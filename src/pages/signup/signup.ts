import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, LoadingController } from 'ionic-angular';
import { Auth, Logger } from 'aws-amplify';

import { LoginPage } from '../login/login';
import { ConfirmSignUpPage } from '../confirmSignUp/confirmSignUp';

const logger = new Logger('SignUp');

export class UserDetails {
    username: string;
    email: string;
    phone_number: string;
    password: string;
}

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  public userDetails: UserDetails;

  error: any;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
   this.userDetails = new UserDetails();
  }

  signup() {
    
    if (!this.valid()) {
      return;  
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.userDetails;
    this.error = null;
    logger.debug('register');
    Auth.signUp(details.username, details.password, details.email, details.phone_number)
      .then(user => {
        this.navCtrl.push(ConfirmSignUpPage, { username: details.username });
      })
      .catch(err => { this.error = err; })
      .then(() => loading.dismiss());
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  valid() {
    if (this.userDetails.username === undefined || this.userDetails.email === undefined  || this.userDetails.password === undefined || this.userDetails.phone_number === undefined) {
      this.error = { message: 'All fields are required'};
      return false;
    }
    return true;
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
