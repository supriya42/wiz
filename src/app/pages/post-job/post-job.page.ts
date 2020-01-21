import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-post-job',
  templateUrl: './post-job.page.html',
  styleUrls: ['./post-job.page.scss'],
})
export class PostJobPage implements OnInit {
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userKey: any;
  jobsData: any;
  showBillBoard: boolean = false;
  data: any;
  htext:any="Post Job";
  constructor(
    public httpp: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private keyboard: Keyboard,
    private global:GlobalServiceService,
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

    this.storage.get('userLoc').then((val) => {
      if (this.locationObj != val) {
        this.locationObj = val;
        this.getJobs();
      }
    });

    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
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
      message: 'Please wait...'
    });
    await this.loader.present();

  }
  shareViaSocial(s) {
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });
  }
  getJobs() {
    this.jobsData = [];
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/all-posted-jobs', JSON.stringify(this.locationObj)
      , { headers: headers })
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data["_body"]);
          for (let r of this.data) {
            this.jobsData.push(r);
          }
        }
      });
  }
  shareJobsViaSocial(s) {
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });
  }

}
