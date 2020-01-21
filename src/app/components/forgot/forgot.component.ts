import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController, PopoverController } from '@ionic/angular';
import { Http,Headers } from '@angular/http';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  loader: any;
  data: any;
  emailObj:any;
  email :any;
  constructor(
    private popoverController: PopoverController,
    public http: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) { }

  ngOnInit() { }
  async presentToast(m) {
    const toast = await this.toastCtrl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 2000
    });
    await this.loader.present();

  }
  async closeForgot() {
    await this.popoverController.dismiss();
  }
  sendresetLink(email) {
    this.emailObj = [];
    if (email == undefined || email == "") {
      this.presentToast('Please Enter Email');
      return false;
    }
    this.emailObj ={
      'email':email
    };
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    this.presentLoading();
    this.http.post('https://wizdiary.com/api/forget-password', this.emailObj, {headers: headers})
    .subscribe(data=>{
      var array = JSON.parse(data['_body']);
      console.log(array)
    },error =>{
      var array = JSON.parse(error['_body']);
      console.log(array)
    })
  }
}
