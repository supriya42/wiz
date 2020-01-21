import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Events, LoadingController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
//import { HttpClient } from 'selenium-webdriver/http';
import { Router } from '@angular/router';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  htext = "Setting";
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  accountTab: any;
  privacyTab: any;
  securityTab: any;
  userKey: any;
  myImg: any;
  confirmImage: any;
  myuserImg: any;
  finalObj: any;
  oldData: any;
  address: any;
  phoneNumber: any;
  displayName: any;
  about: any;
  profileStatus: any;
  showBillBoard: boolean = false;
  data: any;
  oldpassword: any;
  newpassword: any;
  confirmpassword: any;
  myDate: any;
  gender: any;
  country: any;
  noproimg : any = "assets/icon/nopro.png";  
  postImage:any;
  constructor(
    public navCtrl: Router,
    public httpg: HttpClient,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private camera: Camera,
    private transfer: FileTransfer,
    private socialSharing: SocialSharing,
    public events: Events,
    private keyboard: Keyboard,
    private global: GlobalServiceService,
    private httpp: Http,
    public actionSheetCtrl: ActionSheetController,
    private fileChooser: FileChooser,
    private filepath: FilePath,
  ) {
    this.billBoradsData = [];
    this.accountTab = true;
    this.diaryImgUrl = 'https://wizdiary.com/public/assets/diary_uploads/';
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";
    this.getId();
    this.storage.get('Key').then((val) => {
      this.userKey = val;
    })
    // this.storage.ready()
    this.storage.get('UserObject').then((val) => {
      this.oldData = val;
      if(val != null){
      // console.log(val);
      this.myuserImg = this.oldData.profile_pic;
      this.address = this.oldData.address;
      this.phoneNumber = this.oldData.phone_number;
      this.displayName = this.oldData.display_name;
      this.about = this.oldData.about_you;
      this.profileStatus = this.oldData.status;
      this.myDate       = this.oldData.startup_date;
      this.gender  = this.oldData.gender;
      this.country = this.oldData.country;
      }
    })

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
  getId() {
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
 
  shareViaSocial(s) {
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });

  }

  changeTab(tabName) {
    switch (tabName) {
      case 'accountTab':
        this.accountTab = true;
        this.privacyTab = false;
        this.securityTab = false;

        break;
      case 'privacyTab':
        this.accountTab = false;
        this.privacyTab = true;
        this.securityTab = false;

        break;
      case 'securityTab':
        this.accountTab = false;
        this.privacyTab = false;
        this.securityTab = true;

        break;
      default:
        this.accountTab = true;
    }
  }


  // privacy settings Page (PASSWORD WALA PAGE)

  saveChanges(oldpassword, newpassword, confirmpassword) {
    if (oldpassword == undefined || oldpassword == '') {
      this.presentToast('Please Enter Old Password')
      return false;
    }
    if (newpassword == undefined || newpassword == '') {
      this.presentToast('Please Enter New Password')
      return false;
    }
    if (confirmpassword == undefined || confirmpassword == '') {
      this.presentToast('Please Enter Confirm Password')
      return false;
    }
    if (newpassword != confirmpassword) {
      this.presentToast("Passowrn didn't Match");
      return false;
    }

    let passwordObj = {
      // user_id: this.oldData.id,
      old_password: oldpassword,
      new_password: newpassword
    }

    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/post-security-settings', JSON.stringify(passwordObj), { headers: headers })
      .subscribe(response => {
        this.data = response;
          if (this.data.ok == true) {
            this.loader.dismiss();
            this.presentToast(this.data.message);
          }
      },error=>{        
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });
  }

  async showConfirm(check) {
    if (check == 1) {

      const confirm = await this.alertCtrl.create({
        header: 'Are you Sure?',
        message: 'Are you sure to Deactivate your Account?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
              this.deactivateAccount()
            }
          }
        ]
      });
      confirm.present();

    }
    else if (check == 2) {
      const confirm = await this.alertCtrl.create({
        header: 'Are you Sure?',
        message: 'Are you sure to DELETE your Account?',
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              console.log('Agree clicked');
              this.deleteAccount();
            }
          }
        ]
      });
      confirm.present();
    }

  }
  deactivateAccount() {
    console.log('Deactivate Account Called');
    let deactivateObj = {
      user_id: this.oldData.id
    }
    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/dc_account', JSON.stringify(deactivateObj), { headers: headers })
      .subscribe(response => {
        this.data = response;
        // for (let r of this.data) {
          // console.log(response);
          if (this.data.ok == true) {
            this.loader.dismiss();
            this.storage.clear();
            this.presentToast(this.data.message);
            this.navCtrl.navigateByUrl('/home');
          }
      },error=>{        
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });
  }

  deleteAccount() {
    console.log('Delete Account Called');

    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/delete_account_wizdiary/' 
    // + this.oldData.id
    , { headers: headers })
      .subscribe(response => {
        this.data = response;
          if (this.data.success == true) {            
          var array = JSON.parse(this.data["_body"]);
            this.loader.dismiss();
            this.presentToast(array.message);
            this.storage.clear();
            this.navCtrl.navigateByUrl('/home');
          }
      },error=>{
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });

  }

  //Privacy Settings

  async showPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'Subject Access Request',
      message: "An E-mail will be send to your Email Address",
      inputs: [
        {
          name: 'email',
          placeholder: 'Enter Your Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data.email);
            if (data.email == undefined || data.email == null || data.email == '') {
              this.presentToast('Enter Email Associated to your Account');
              return false;
            }
            this.sendEmail(data.email);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  sendEmail(email) {
    console.log(email);

    // let subjectObj = {
    //   email: email
    // }
    this.presentLoading();
    
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/send_access_mail' 
    , { headers: headers })
      .subscribe(response => {
        this.data = response;
          if (this.data.success == true) {
            this.loader.dismiss();
            this.presentToast(this.data.message);
          }
      },error=>{
        this.loader.dismiss();
        this.presentToast("Not able to Generate Code");
      });
  }

  async subjectCode() {
    const prompt = await this.alertCtrl.create({
      header: 'Subject Access Request Code',
      message: "Enter Your Code",
      inputs: [
        {
          name: 'code',
          placeholder: 'Enter Your Code'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log(data.code);
            if (data.code == undefined || data.code == null || data.code == '') {
              this.presentToast('Enter Code You Received');
              return false;
            }
            this.sendsubjectCode(data.code);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();

  }
  sendsubjectCode(code) {
    let subjectCodeObj = {
      id: this.oldData.id,
      code: code
    }
    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/submit_access_mail', JSON.stringify(subjectCodeObj), 
    { headers: headers })
      .subscribe(response => {
        this.data = response;
          if (this.data.ok == true) {
            this.loader.dismiss();
            var array = JSON.parse(this.data["_body"]);
            // this.presentToast('Your code has been matched');
            this.navCtrl.navigateByUrl('/subject');
          }
      },error=>{
        this.loader.dismiss();
            this.presentToast('Your Code Doesnt match');
      });

  }
  saveChangesPrivacy(myDate, gender, country) {
    if (myDate == undefined || myDate == '') {
      this.presentToast('Please Enter Startup Date');
      return false;
    }
    if (gender == undefined || gender == '') {
      this.presentToast('Please Select Gender');
      return false;
    }
    if (country == undefined || country == '') {
      this.presentToast('Please Enter Country Name');
      return false;
    }

    let privacyObj = {
      user_id: this.oldData.id,
      start_date: myDate,
      gender: gender,
      country: country
    }
    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/post-account-settings', JSON.stringify(privacyObj),
    { headers: headers })
      .subscribe(response => {
        this.data = response;
          if (this.data.ok == true) {            
          var array = JSON.parse(this.data["_body"]);
            this.storage.set('UserObject', this.data.data);
            this.loader.dismiss();
            this.presentToast(array.message);
          }
      },error=>{
        this.loader.dismiss();
        this.presentToast(error);
      });
  }

  // Security Settings.
  getMydata() {
    this.storage.get('UserObject').then((val) => {
      this.myuserImg = val.profile_pic;
    })
  }
  async takeImg() {
  const actionSheet = await this.actionSheetCtrl.create({
      header: "Upload Image or Video",
      buttons: [
        {
          text: "Open Camera",
          //          role: 'destructive',
          handler: () => {
            
            const options: CameraOptions = {
              quality: 30,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.CAMERA
            }
        
            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64 (DATA_URL):
              if (imageData != undefined) {
                this.imageUpload(imageData);
              }
            }, (err) => {
              // Handle error
            });
          }
        },
        {
          text: "Select Image",
          //          role: 'destructive',
          handler: () => {
            const options: CameraOptions = {
              quality: 30,
              destinationType: this.camera.DestinationType.FILE_URI,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
            }
        
            this.camera.getPicture(options).then((imageData) => {
              // imageData is either a base64 encoded string or a file URI
              // If it's base64 (DATA_URL):
              if (imageData != undefined) {
                this.imageUpload(imageData);
              }
            }, (err) => {
              // Handle error
              this.presentToast("Not Able to Upload your Profile Picture..")
            });
          }
        }, {
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

  imageUpload(path) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: 'attachment',
        fileName: '.png',
        chunkedMode: false,
        //mimeType: "image/jpeg",
      }
  
      this.presentLoading();
      var token = 'Bearer ' + this.userKey;
      var headers = { 'Authorization': token };
  
      //Here is the magic!
      options.headers = headers;
      fileTransfer.upload(path, "https://wizdiary.com/api/v1/post-image-settings", options)
        .then((data) => {
          let res = JSON.parse(data.response);
          if (res.success == true) {
            this.confirmImage = res.data;
          }
          this.loader.dismiss();
          this.presentToast("Profile Picture has been updated!!");
  
        }, (err) => {
          this.loader.dismiss();
          this.presentToast("Not Able to Upload your Profile Picture..");
        });
  }

  saveSettings(address, phoneNumber, displayName, about, profileStatus) {
    if (address == undefined || address == '') {
      this.presentToast('Please Enter Address');
      return false;
    }
    if (phoneNumber == undefined || phoneNumber == '') {
      this.presentToast('Please Enter Phone Number');
      return false;
    }
    if (displayName == undefined || displayName == '') {
      this.presentToast('Please Enter Display name');
      return false;
    }
    if (about == undefined || about == '') {
      this.presentToast('Please Enter About');
      return false;
    }

    if (profileStatus == undefined || profileStatus == '') {
      this.presentToast('Please Enter your Status');
      return false;
    }

    if (this.confirmImage == undefined || this.confirmImage == null) {

      this.finalObj = {
        user_id: this.oldData.id,
        address: address,
        image: this.myuserImg,
        name: displayName,
        about: about,
        profile_status: profileStatus,
        phone_number: phoneNumber
      }
    }
    else {
      this.finalObj = {
        user_id: this.oldData.id,
        address: address,
        image: this.confirmImage,
        name: displayName,
        about: about,
        profile_status: profileStatus,
        phone_number: phoneNumber
      }

    }

    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/post-general-settings',
     JSON.stringify(this.finalObj), { headers: headers })
      .subscribe(response => {
        this.data = response;
        // for (let r of this.data) {
        //   console.log(response);
          if (this.data.ok == true) {
            this.storage.set('UserObject', this.data.data);
            // this.events.publish('user:created', this.data.data);
            // globalData.sideMenuDp = r.data.profile_pic;
            this.loader.dismiss();
            this.presentToast(this.data.message);
          }
      },error=>{
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });

  }

}
