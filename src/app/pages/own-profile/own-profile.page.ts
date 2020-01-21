import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, MenuController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Http, Headers } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { HttpHeaders, HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-own-profile',
  templateUrl: './own-profile.page.html',
  styleUrls: ['./own-profile.page.scss'],
})
export class OwnProfilePage implements OnInit {
  htext: any = "Own Profile"
  Likeid: any;
  headers: any;
  loader: any;
  userDataDiary: any;
  userDataFollowers: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  billBoradsData: any;
  userId: any;
  userKey: any;
  commentid: any;
  locationObj: any;
  myuserImg: any;
  postImage: any;
  confirmImage: any;
  shareObj: any;
  diaryComm = [];
  sc: boolean;
  is_image: number;
  myshare: any;
  showBillBoard: boolean = false;
  datahome: any;
  databill: any;
  noproimg: any;
  username: any;
  data: any;
  userData: any;
  albumsImages: any;
  userPic: any;
  // toPrivateProfile: any;
  // showPrompt: any;
  gallerimgUrl: any;
  pressEvent: any;
  toPostJobs: any;
  viewImage: any;
  startDate:any;
  constructor(private global: GlobalServiceService,
    private router: Router,
    public alertController: AlertController,
    // private geolocation: Geolocation,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    // private file: File,
    private socialSharing: SocialSharing,
    public menuCtrl: MenuController,
    public httpg: HttpClient,
    private httpP: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private keyboard: Keyboard,
    private platform: Platform, 
    private httpp : Http,
    private alertCtrl : AlertController) {
    this.userDataDiary = [];
    this.sc = false;

    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";
    this.gallerimgUrl = "https://wizdiary.com/public/gallery_images/";
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = false;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
    this.getId();
  }

  ngOnInit() {
    this.noproimg = "assets/icon/camera.png";
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await this.loader.present();
  }
  getMydata() {
    this.storage.get("UserObject").then(val => {
      if (val != null) {
        this.myuserImg = val.profile_pic;
        this.username = val.username;
        console.log(this.myuserImg);
        this.getData(this.userKey);
      }
    });
  }
  getId() {
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getMydata();
          }
        });
      });
    } else {
      this.getMydata();
    }
  }
  async presentToast(m) {
    const toast = await this.toastCtrl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }
  getData(val) {
    this.albumsImages = [];
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + val);

    this.httpg.get('https://wizdiary.com/api/v1/user-profile/' + this.username,
      { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          this.loader.dismiss();
          this.userData = this.data.data.user;
          this.startDate = this.userData.startup_date.slice(0,10);
          this.userPic = this.userData.profile_pic;
          this.albumsImages = this.data.data.albumImages;
        }
      },
        error => {
          this.loader.dismiss();
          this.presentToast(error);

        });
  }
  toPrivateProfile(username){
    
    this.router.navigate(['private-profile/' + username]);
  }
  async showPrompt(){
    const prompt = await this.alertCtrl.create({
      header: 'Invite a Friend',
      message: "An E-mail will be send to your Friend",
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter Comma Seperated Email'
        },
        {
          name: 'message',
          placeholder: 'Enter Your 50 Character Message',
          max: 50
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.email == undefined || data.email == null || data.email == '') {
              this.presentToast('Enter Email Comma Speperated Emails.');
              return false;
            }
            if (data.message != '') {
              let str = data.message;
              if (str.length > 50) {
                this.presentToast("Please Type 50 charecter only.");
                return false;
              }
            }
            this.sendEmail(data.email, data.message);
          }
        }
      ]
    });
    prompt.present();

  }
  sendEmail(email, m) {
    let inviteObj = {
      user_id: this.userId,
      message: email,
      description: m
    }
    // this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/send-invite', JSON.stringify(inviteObj), { headers: headers })
      .subscribe(       
        data => {
          if (data.ok == true) {
            var array = JSON.parse(data["_body"]);
            this.presentToast(array.message);
          }
      },error=>{
        this.presentToast("Error in Invitation");
      });

  }
}
