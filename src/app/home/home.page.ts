import { Component } from '@angular/core';
import { ToastController, AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../services/global-service.service';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpClientModule, } from '@angular/common/http';
import { ForgotComponent } from '../components/forgot/forgot.component';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  htext: string;
  loader: any;
  headers: any;
  logindata: any;
  email:any = '';
  password:any = '';
  ev:any;
  ngOnInit() { this.htext = "Diary"
  
}
  constructor(
    private router: Router,
    private http: HttpClientModule,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public https: Http,
    private popoverController: PopoverController,
    public global: GlobalServiceService,
    public storage: Storage) {
    
     }
  ///message dispaly
  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['Okay']
    });
    await alert.present();
  }
 
  /////Loading wait
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    this.loader.present();
  };
  //////Verify Email
  login(email, password) {
    if (email == undefined || email == '') {
      this.presentAlert('Please Enter Email');
      return false;
    }
    if (password == undefined || password == '') {
      this.presentAlert('Please Enter Password');
      return false;
    }
    this.presentLoading();
    // PostloginValidation(email,password){
    var dvId;
    this.logindata = [];
    this.logindata = {
      'email': email,
      'password': password,
      'device_token': dvId
    };
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    this.https.post('https://wizdiary.com/api/login', this.logindata, { headers: headers })
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data['_body']);
          this.global.SetKey(array.success.token);
          this.storage.set('Key', array.success.token);
          this.storage.set("Email",email);
          this.loader.dismiss();
          this.router.navigate(['diary'])
        }
      }, error => {
        this.loader.dismiss();
        this.presentAlert('Wrong Email ID or Password');
      });

  }
  
  
  toSignup() {
    this.router.navigate(['signup']);
  }
  async presentPopover(ev) {
    const popover = await this.popoverController.create({
      component: ForgotComponent,
      event: ev,
      cssClass: 'popover'
      // translucent: true
    });
    return await popover.present();
  }


}
