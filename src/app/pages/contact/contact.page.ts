import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
loader:any;
htext:any="Contact Us"
userKey:any;
name:any;
email:any;
message:any;
showBillBoard:any;
  constructor(
    private httpp:Http,
    private toastCtrl: ToastController,
    private loadingCtrl:LoadingController,
    private storage: Storage,
    private global: GlobalServiceService,
  ) {
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
          }
        });
      });
    }
   }

ngOnInit() {
}
async presentToast(m) {
  const toast = await this.toastCtrl.create({
    message: m,
    duration: 3000
  });
  toast.present();
}
async presentLoading() {
  this.loader = await this.loadingCtrl.create({
    message: "Please wait..."
  });
  await this.loader.present();
}
submit(name, email, message){
  if (name == undefined || name == '') {
    this.presentToast('Please Enter Name');
    return false;
  }
  if (email == undefined || email == '') {
    this.presentToast('Please Enter Email');
    return false;
  }
  if (message == undefined || message == '') {
    this.presentToast('Please Enter Message');
    return false;
  }

  let contactObj = {
    name: name,
    email: email,
    msg: message
  };
  this.presentLoading();

  var headers = new Headers();
  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", "Bearer " + this.userKey);
  this.httpp.post('https://wizdiary.com/api/v1/contact-us',
    JSON.stringify(contactObj), { headers: headers })
    .subscribe(data => {
      if (data.ok == true) {
        this.name="";
        this.email="";
        this.message="";
        this.loader.dismiss();
        var array = JSON.parse(data["_body"]);
        this.presentToast(array.message)
      }
    },
      error => {
        this.loader.dismiss();
        this.presentToast(error);
        console.log(error);
      });
    }


}
