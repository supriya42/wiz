import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.page.html',
  styleUrls: ['./subject.page.scss'],
})
export class SubjectPage implements OnInit {
  toPostJobs:any;
  htext:any="Subject Access";
  noproimg:any;
  loader: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userId: any;
  billTab: boolean;
  diaryTab: boolean;
  followTab: boolean;
  jobTab: boolean;
  follow: any;
  billboard: any;
  jobs: any;
  diary: any;
  billLikes: any;
  showBillBoard: boolean = false;
  data: any;
  userKey: any;
  constructor(
    public httpg: HttpClient,
    private router : Router,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private keyboard: Keyboard,
    private global: GlobalServiceService
  ) {
    this.billTab = true;
     this.diaryImgUrl = 'https://wizdiary.com/public/assets/diary_uploads/';
     this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
     this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";
    //  this.locationObj = globalData.userLocation;


    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getData();
          }
        });
      });
    }else{
      this.getData();
    }
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
  }
  ngOnInit() {
    this.noproimg = "assets/icon/nopro.png";
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
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });

  }
  ShowProfile(uname){
    this.router.navigate(['profile/'+uname])
  }
  changeTab(tabName) {
    switch (tabName) {
      case 'billTab':
        this.billTab = true;
        this.diaryTab = false;
        this.followTab = false;
        this.jobTab = false;
        break;
      case 'diaryTab':
        this.billTab = false;
        this.diaryTab = true;
        this.followTab = false;
        this.jobTab = false;
        break;
      case 'followTab':
        this.billTab = false;
        this.diaryTab = false;
        this.followTab = true;
        this.jobTab = false;
        break;
      case 'jobTab':
        this.billTab = false;
        this.diaryTab = false;
        this.followTab = false;
        this.jobTab = true;
        break;
      default:
        this.billTab = true;
    }

  }
  getData() {
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/request_access_subject'
    //  + id
     , { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          this.loader.dismiss();
          this.billboard = this.data.data.billboards;
          this.diary = this.data.data.notifications;
          this.follow = this.data.data.follows;
          this.jobs = this.data.data.jobs;
          this.billLikes = this.data.data.billLikes;

        }
      }, error => {
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });
  }
}
