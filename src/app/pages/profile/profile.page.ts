import { Component, OnInit } from '@angular/core';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  htext: string;
  loader: any;
  headers: any;
  userData: any;
  userData2: any;
  userPic: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  albumsImages: any;
  gallerimgUrl: any;
  userId: any;
  data: any;
  userKey: any;
  uname: any;
  noproimg: any;
  sendMessage:any;
  toPostJobs:any;
  pressEvent:any;
  startDate:any;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private httpg: HttpClient,
    private httpp: Http,
    private photoViewer: PhotoViewer,
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private route: ActivatedRoute,
    private global:GlobalServiceService,
  ) {
    
  }

  ngOnInit() {
    this.htext = " Public Profile"
    this.noproimg = "assets/icon/camera.png";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.gallerimgUrl = "https://wizdiary.com/public/gallery_images/";
    this.storage.get('UserId').then((val) => {
      if (val != null) {
      this.userId = val;
      }
    });
    this.uname = this.route.snapshot.paramMap.get('uname');
    if (this.uname != null) {
      // this.getPublicProfile(uname);
      this.getkey();
    }
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
  getkey() {
    this.uname = this.route.snapshot.paramMap.get('uname');   
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getPublicProfile(this.uname)
          }
        });
      });
    }else{
      this.getPublicProfile(this.uname)
    }
    
  }

  getPublicProfile(username) {
    this.presentLoading();
    this.data = '';
    this.albumsImages = [];
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/public-profile/' + username, { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          this.loader.dismiss();
          this.userData = this.data.data.user;
          this.userPic = this.userData.profile_pic;
           this.albumsImages = this.data.data.albumImages;
           this.startDate = this.userData.startup_date.slice(0,10);
        }
      },
        error => {
          this.loader.dismiss();
          this.presentToast(error);
        }
      );
    this.data = '';
    this.httpg.get('https://wizdiary.com/api/v1/user-profile/' + username
      // + '/' + this.userId
      , { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          this.userData2 = this.data.data;
          // this.startDate = this.userData2.start_date.slice(0,10)
        }
        else {
        }
      });


  }
  toPrivateProfile() {
    // console.log(username);
    // this.router.navigateByUrl('/PrivateprofilePage');
    // localStorage.setItem('uname', username);
    this.router.navigate(['private-profile/' + this.uname]);

  }

  getAlbumImages(id) {
    //this.presentLoading();
    this.data = '';
    this.albumsImages = [];
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/gallery_all/'
     + id, 
     { headers: headers })
      .subscribe((response) => {
        this.data = response;
        // 
          if (this.data.success == true) {
            this.loader.dismiss();
            for (let r of this.data) {
            this.albumsImages.push(r)// = r.data;
            }
          }
        
      },error=>{
          this.loader.dismiss();
          this.presentToast("Not able to get Gallary");
      });

  }
  viewImage(url, title) {
    this.photoViewer.show(url, title, { share: false });
  }
  // pressEvent(e, id) {
  //   this.showConfirm(id);
  // }

  // async showConfirm(id) {
  //   const confirm = await this.alertCtrl.create({
  //     header: 'Are You Sure',
  //     message: 'Do you want to DELETE this Picutre?',
  //     buttons: [
  //       {
  //         text: 'Cancle',
  //         handler: () => {

  //         }
  //       },
  //       {
  //         text: 'Delete',
  //         handler: () => {
  //           this.deletePicture(id);
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }


  // deletePicture(id) {
  //   this.presentLoading();
  //   this.headers = { 'Content-Type': 'application/json' };
  //   this.httpg.get('https://wizdiary.com/api/v1/delete-album-image/' + id, { headers: this.headers })
  //     .subscribe((response) => {
  //       this.data = response;
  //       for (let r of this.data) {
  //         if (r.success == true) {
  //           this.loader.dismiss();
  //           this.getAlbumImages(localStorage.getItem('albumId'));
  //         }
  //         else {
  //           this.loader.dismiss();
  //           this.presentToast(r.message);
  //         }
  //       }
  //     });


  // }


  // followUser(id) {
  //   let followObj = {
  //     user_id: id
  //   }
  //   var headers = new Headers();
  //   headers.append("Accept", "application/json");
  //   headers.append("Content-Type", "application/json");
  //   headers.append("Authorization", "Bearer " + this.userKey);
  //   this.httpp.post('https://wizdiary.com/api/v1/follow-user', JSON.stringify(followObj), { headers: headers })
  //     .subscribe(data => {
  //       if (data.ok == true) {
  //       var array = JSON.parse(data["_body"]);
  //       this.presentToast(array.message)
  //       }
  //     }, error => {
  //       this.presentToast("Sorry!!")
  //     }
  //     );

  // }

  // unfollowUser(id) {
  //   let unFollowObj = {
  //     user_id: id,
  //     user_to_id: this.userId
  //   }
  //   this.data = '';
  //   this.headers = { 'Content-Type': 'application/json' };
  //   this.httpp.post('https://wizdiary.com/api/v1/unfollow-user', JSON.stringify(unFollowObj), { headers: this.headers })
  //     .subscribe((response) => {
  //       this.data = response;
  //       for (let r of this.data) {
  //         if (r.success == true) {
  //           // this.getUserName();
  //           this.presentToast(r.message)
  //         }
  //         else {
  //           this.loader.dismiss();
  //           this.presentToast(r.message);

  //         }
  //       }
  //     });

  // }
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
        this.presentToast("Error in Invitation");
      });

  }
}
