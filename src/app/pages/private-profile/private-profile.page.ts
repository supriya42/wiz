import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';
@Component({
  selector: 'app-private-profile',
  templateUrl: './private-profile.page.html',
  styleUrls: ['./private-profile.page.scss'],
})
export class PrivateProfilePage implements OnInit {
  htext = "Private Profile"
  loader: any;
  username: any;
  headers: any;
  userData: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userId: any;
  data: any;
  uname: any;
  userKey: any;
  toGallery: any;
  toPostJobs: any;
  noproimg = "assets/icon/nopro.png";
  hidefollow :boolean ;
  hideunfollow:boolean;
  startDate:any;
  // noproimg:
  constructor(
    public router: Router,
    // public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private route: ActivatedRoute,
    // private file: File,
    private socialSharing: SocialSharing,
    public httpg: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public alertCtrl: AlertController,
    private httpp: Http,
    private global : GlobalServiceService,
  ) {
   
  }

  ngOnInit() {    
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    // this.gallerimgUrl = "https://wizdiary.com/public/gallery_images/";
    this.storage.get('UserId').then((val) => {
      if (val != null) {
      this.userId = val;
      }
    });
    this.getUserName();
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
  getUserName() {
    this.uname = this.route.snapshot.paramMap.get('uname');   
      this.userKey = this.global.getKey();
      if (this.userKey == undefined) {
        this.storage.ready().then(() => {
          this.storage.get('Key').then((val) => {
            this.userKey = val;
            if (val != null) {
              this.getPublicProfile(this.uname,val);
            }
          });
        });
      }else{
        this.getPublicProfile(this.uname,this.userKey);
      }
  }
  toPublicProfile(username){
      this.router.navigate(['profile/'+username]);
  }
  getPublicProfile(username,val) {
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + val);

    this.httpg.get('https://wizdiary.com/api/v1/user-profile/' + username,
      { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          this.loader.dismiss();
          this.userData = this.data.data;
          this.startDate = this.userData.user.startup_date.slice(0,10);
        }
      },
        error => {
          this.loader.dismiss();
          this.presentToast(error);

        });

  }

  followUser(id) {
    let followObj = {
      user_id: id,
      // user_to_id:this.userId
    }

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/follow-user', JSON.stringify(followObj), { headers: headers })
      .subscribe(data => {
        if (data.ok == true) {
          this.hidefollow = true;
          this.hideunfollow = false;
          this.userData.follow = 1;
          var array = JSON.parse(data["_body"]);
          this.presentToast(array.message)
          }
        }, error => {
          this.presentToast("Sorry!!")
        }
        );
  }

  unfollowUser(id) {
    let unFollowObj = {
      user_id: id,
      // user_to_id: this.userId
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/unfollow-user', JSON.stringify(unFollowObj), { headers: headers })
      .subscribe(data => {
        if (data.ok == true) {          
          this.hidefollow = false;
          this.hideunfollow= true;
          this.userData.follow = 0;
          var array = JSON.parse(data["_body"]);
          this.presentToast(array.message)
          }
        }, error => {
          this.presentToast("Sorry!!")
        }
        );

  }

  async  showPrompt() {
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
        this.presentToast(error);
      });

  }
  sendMessage(id,s_uname) {
    // this..navigateByUrl('/ChatPage');
    // localStorage.setItem('firstChatId',id);
    this.router.navigate(['chat/'+id +'/'+s_uname]);
  }

}
