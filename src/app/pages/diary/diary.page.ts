import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Router } from '@angular/router';
import { ActionSheetController, MenuController, ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { FilePath } from "@ionic-native/file-path/ngx";
// import { AndroidPermissions, AndroidPermissionsOriginal } from '@ionic-native/android-permissions';
// import { LinkyModule } from 'angular-linky';
@Component({
  selector: "app-diary",
  templateUrl: "./diary.page.html",
  styleUrls: ["./diary.page.scss"]
})
export class DiaryPage implements OnInit {
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
  diaryLike: any;
  toUploadBillboard: any;

  constructor(
    private global: GlobalServiceService,
    private router: Router,
    public alertController: AlertController,
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
    private fileChooser: FileChooser,
    private filepath: FilePath,

    // androidPermissions: AndroidPermissions,
  ) {
    this.billBoradsData = [];
    this.userDataDiary = [];
    this.sc = false;
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";

    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = false;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
    this.getId();
  }


  ngOnInit() {
    this.noproimg = "assets/icon/nopro.png";
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Allow Your Location',
      // subHeader: 'Subtitle',
      // message: 'This is an alert message.',
      buttons: ['Allow']
    });

    await alert.present();
  }
  doRefresh(refresher) {
    console.log("Begin async operation", refresher);

    setTimeout(() => {
      console.log("Async operation has ended");
      this.getId();


      refresher.complete();
    }, 2000);
  }
  doPull(event) {
    //Emitted while the user is pulling down the content and exposing the refresher.
    console.log('ionPull Event Triggered!');
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
  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Upload Image or Video",
      buttons: [
        {
          text: "Open Camera",
          //          role: 'destructive',
          handler: () => {
            console.log("Camera clicked");
            const options: CameraOptions = {
              quality: 30,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.CAMERA
            };

            this.camera.getPicture(options).then(
              imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                this.postImage = imageData;
                console.log(this.postImage);
                if (this.postImage != undefined) {
                  this.imageUpload(this.postImage);
                }
              },
              err => {
                // Handle error
              }
            );
          }
        },
        {
          text: "Select Image",
          //          role: 'destructive',
          handler: () => {
            console.log("Image clicked");
            const options: CameraOptions = {
              quality: 30,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            };

            // this.camera.getPicture(options).then(
            //   imageData => {
            //     // imageData is either a base64 encoded string or a file URI
            //     // If it's base64 (DATA_URL):
            //     this.postImage = imageData;
            //     console.log(this.postImage);
            //     if (this.postImage != undefined) {
            //       this.imageUpload(this.postImage);
            //     }
            //   },
            //   err => {
            //     // Handle error
            //   }
            // );
            this.fileChooser.open().then((uri) => {
              this.filepath.resolveNativePath(uri).then((nativepath) => {

                this.imageUpload(nativepath);
              })
            })
          }
        },
        {
          text: "Select Video",
          handler: () => {
            console.log("Video clicked");
            const options: CameraOptions = {
              quality: 10,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.VIDEO,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            };

            this.camera.getPicture(options).then(
              imageData => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                this.postImage = imageData;
                console.log(this.postImage);
                if (this.postImage != undefined) {
                  this.imageVideo(this.postImage);
                }
              },
              err => {
                // Handle error
              }
            );
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await actionSheet.present();
  }
  getMydata() {
    // this.storage.get("UserObject").then(val => {
    //   this.myuserImg = val.profile_pic;
    //   console.log(this.myuserImg);
    // });
    var body ={
      user_id:''
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpP
      .post(
        "https://wizdiary.com/api/v1/details", JSON.stringify(body),
        { headers: headers }
      )
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data["_body"]);
          this.myuserImg = array.success.profile_pic;
          // this.presentToast(array.message);
          this.storage.set("UserObject", array.success);
          this.storage.set("UserId",array.success.id);
        }
      },
        error => {
          console.log("Not able to get Your Profile");
        }
      );
  }

  getId() {
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getData(val);
            this.getMydata();
          }
        });
      });
    }
    else {
      this.getData(this.userKey);
      this.getMydata();
    }
    this.getUserId();
  }
  getUserId() {
    this.storage.get("UserId").then(val => {
      if (val != null) {
        this.userId = val;
      }
    });

  }
  getData(key) {
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + key)
      .set('Access-Control-Allow-Origin', '*');
    // .set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.httpg.get("https://wizdiary.com/api/v1/home", { headers }).subscribe(
      data => {
        this.datahome = data;
        for (let r of this.datahome.data) {
          this.userDataDiary.push(r);
        }
      },
      error => { }
    );
  }



  imageUpload(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: ".png",
      chunkedMode: false
      //mimeType: "image/jpeg",
    };

    this.presentLoading();
    var token = 'Bearer ' + this.userKey;
    var headers = { 'Authorization': token };

    //Here is the magic!
    options.headers = headers;
    fileTransfer
      .upload(path, "https://wizdiary.com/api/v1/diary-media", options)
      .then(
        data => {
          console.log(data + " Uploaded Successfully");
          console.log(JSON.parse(data.response));
          let res = JSON.parse(data.response);
          if (res.success == true) {
            this.confirmImage = res.image_name;
            console.log("returened Image name: " + this.confirmImage);
            this.is_image = 1;
          }
          this.loader.dismiss();
        },
        err => {
          console.log(err);
          this.loader.dismiss();
          this.presentToast(err);
        }
      );
  }
  imageVideo(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: ".mp4",
      chunkedMode: false
      //mimeType: "image/jpeg",
    };
    var token = 'Bearer ' + this.userKey;
    var headers = { 'Authorization': token };

    //Here is the magic!
    options.headers = headers;
    this.presentLoading();
    fileTransfer
      .upload(path, "https://wizdiary.com/api/v1/diary-media", options)
      .then(
        data => {
          console.log(data + " Uploaded Successfully");
          console.log(JSON.parse(data.response));
          let res = JSON.parse(data.response);
          if (res.success == true) {
            this.confirmImage = res.image_name;
            console.log("returened Video name: " + this.confirmImage);
            this.is_image = 0;
          }
          this.loader.dismiss();
        },
        err => {
          console.log(err);
          this.loader.dismiss();
          this.presentToast(err);
        }
      );
  }

  shareDiary(myshare) {
    if (myshare == undefined || myshare == null || myshare == "") {
      this.presentToast("Please Enter your Diary");
      return false;
    }

    if (this.confirmImage != undefined && this.confirmImage != null) {
      this.shareObj = {
        user_id: this.userId,
        description: myshare,
        image_name: this.confirmImage,
        is_image: this.is_image
      };
    } else {
      this.shareObj = {
        user_id: this.userId,
        description: myshare
      };
    }
    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpP
      .post(
        "https://wizdiary.com/api/v1/share-diary",
        JSON.stringify(this.shareObj),
        { headers: headers }
      )
      .subscribe(data => {
        if (data.ok == true) {
          this.myshare = ""
          // this.getData(this.userKey);
          this.loader.dismiss();
          var array = JSON.parse(data["_body"]);
          this.presentToast(array.message);
        }
      },
        error => {
          this.loader.dismiss();
          console.log(error);
        }
      );
  }
  shareViaSocial(c, s) {
    console.log(c, s);
    this.socialSharing
      .share(c, null, null, s)
      .then(() => {
        this.presentToast("Share Successfull");
      })
      .catch(error => {
        console.log(error);
        this.presentToast("Something Went Wrong");
      });
  }

  showComment(id) {
    // if (this.sc == false) {
    //   this.sc = true;
    // } else if (this.sc == true) {
    //   this.sc = false;
    // }
    this.sc = !this.sc;
    this.commentid = id;
  }

  diaryLikes(id) {
    this.Likeid = '';
    let likesDiary = {
      diary_id: id,
      user_id: this.userId
    };
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpP
      .post(
        "https://wizdiary.com/api/v1/diary-likes",
        JSON.stringify(likesDiary),
        { headers: headers }
      )
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data["_body"]);
          // this.getUserId();
          this.Likeid = id;
          this.diaryLike = array.count;
          this.presentToast("Diary Liked");
        }
      }, error => {
        this.presentToast(error);
      });
  }
  GotoProfile(uname) {
    this.router.navigate(['profile/' + uname])
  }
  diaryComment(id, userComment) {
    console.log('comments')
    if (userComment == undefined || userComment == null || userComment == "") {
      this.presentToast("Please Enter Comment");
      return false;
    }

    let commentObj = {
      user_id: this.userId,
      diary_id: id,
      comment: userComment
    };
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpP
      .post(
        "https://wizdiary.com/api/v1/diary-comment",
        JSON.stringify(commentObj),
        { headers: headers }
      )
      .subscribe(response => {
        this.datahome = response;
        for (let r of this.datahome) {
          console.log(response);
          if (r.success == true) {
            this.getData(this.userKey);
            this.presentToast("Comment Added");
          } else {
            this.presentToast(r.message);
          }
        }
      });
  }
  toPostJobs() {
    this.router.navigate(['post-job']);
  }
}
