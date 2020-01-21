import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavParams, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  name: any
  userName: any;
  password: any;
  repeatPassword: any;
  email: any;
  loader: any;
  data: any;
  signObj: any;
  constructor(
    public navCtrl: Router,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private https: Http,
    private route: Router
  ) { }

  ngOnInit() {
  }
  async presentToast(msg) {
    const alert = await this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    alert.present();
  }
  /////Loading wait
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    this.loader.present();
  }
  signup(name, userName, email, password, repeatPassword) {
    if (name == undefined || name == '') {
      this.presentToast('Please Enter Name');
      return false;
    }
    if (userName == undefined || userName == '') {
      this.presentToast('Please Enter Username');
      return false;
    }
    if (email == undefined || email == '') {
      this.presentToast('Please Enter Email');
      return false;
    }
    if (password == undefined || password == '') {
      this.presentToast('Please Enter Password');
      return false;
    }
    if (repeatPassword == undefined || repeatPassword == '') {
      this.presentToast('Please Enter Repeat Password');
      return false;
    }
    if (password != repeatPassword) {
      this.presentToast('Password Not Matched');
      return false;
    }
    this.signObj = [];
    this.signObj = {
      'name': name,
      'username': userName,
      'email': email,
      'password': password,
      'password_confirmation': repeatPassword
    };
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    this.https.post('https://wizdiary.com/api/register', this.signObj, { headers: headers })
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data['_body']);
          this.name = '';
          this.userName='';
          this.password='';
          this.repeatPassword='';
          this.email='';
          this.presentToast('Welcome To WizDiary!!');
        }
      }, error => {
        var array = JSON.parse(error['_body']);
        var email_m = array.error.email;
        var username_m = array.error.username;
        if (email_m == undefined) {
          email_m = '';
        }
        if (username_m == undefined) {
          username_m = '';
        }

        if (array.error.password != undefined) {
          if (password.length < 8) {
            var password_m = 'Password Length Sould be more than 8 Char'
          }
        } else {
          password_m = "";
        }
        var msg = email_m + '<br>' + username_m + '<br>' + password_m;
        this.presentToast(msg);
      });
  }
  toLogin() {
    this.route.navigate(['home']);
  }

}
