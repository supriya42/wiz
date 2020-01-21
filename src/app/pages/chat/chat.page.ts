import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ActionSheetController, LoadingController, ToastController } from '@ionic/angular';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Storage } from "@ionic/storage";
import { GlobalServiceService } from 'src/app/services/global-service.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  htext: any = "Chat";
  loader: any;
  headers: any;
  locationObj: any;
  userId: any;
  getChatObj: any;
  chats: any;
  myuserImg: any;
  newMessage: any;
  msg: any;
  sendAtt: any;
  groupMediaUrl: any;
  postImage: any;
  showBillBoard: boolean = false;
  data: any;
  userKey: any;
  userLoc: any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  likebill: any;
  toUploadBillboard:any;
  username:any;
  constructor(
    public navCtrl: Router,
    public route: ActivatedRoute,
    public httpg: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private camera: Camera,
    private transfer: FileTransfer,
    private httpp: Http,
    // private file: File,
    public actionSheetCtrl: ActionSheetController,
    private keyboard: Keyboard,
    private global : GlobalServiceService,
  ) {
    this.newMessage = '';
    this.groupMediaUrl = "https://www.wizdiary.com//public/assets/message_uploads/";
    this.getChatObj = this.route.snapshot.paramMap.get('chatid');
    this.storage.get('UserId').then((val) => {
      this.userId = val;
      if( val != null){
        this.getuserkey();
      }
    });   


    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });

  }
  getuserkey() {
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getChat(this.userId,this.getChatObj);
          }
        });
      });
    }else{
      this.getChat(this.userId,this.getChatObj);
    }
  }
  ngOnInit() {
  }
  scrollTobottom() {
    // this.content.scrollToBottom(300);
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

  getMydata() {
    this.storage.get('UserObject').then((val) => {
      this.myuserImg = val.profile_pic;
      console.log(this.myuserImg);
    })
  }

  shareViaSocial(m,s) {
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });

  }
  getChat(sender, rece) {
    this.chats = [];
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/user-chat/'+ rece, 
    { headers: headers })
      .subscribe(
        data => {
          this.data = data;
          for (let r of this.data.data.messages) {
            this.chats.push(r);
            this.storage.set('OldChats', this.chats);
          }
        },
        error => { 
          this.presentToast(error);
        }
      );
     this.getPublicProfile(this.route.snapshot.paramMap.get('chatuname'))
  }
  getPublicProfile(username) {
    // this.presentLoading();
    this.data = '';
    // this.albumsImages = [];
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/public-profile/' + username, { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          // this.loader.dismiss();
          this.htext = this.username = this.data.data.user.display_name;
          if(this.htext == null){
            this.htext =  this.data.data.user.username;
          }
        }
      },
        error => {
          this.loader.dismiss();
          this.presentToast(error);
        }
      );
   


  }
  chosePhoto() {
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
    });

  }

  takeNewPhoto() {
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
    fileTransfer.upload(path, "https://wizdiary.com/api/v1/group-uploads", options)
      .then((data) => {
        console.log(data + " Uploaded Successfully");
        console.log(JSON.parse(data.response));
        let res = JSON.parse(data.response);
        if (res.success == true) {
          this.sendAtt = res.data;
          this.sendSendAtt(this.sendAtt)
          console.log(res.data);
        }
        this.loader.dismiss();

      }, (err) => {
        console.log(err);
        this.loader.dismiss();
        this.presentToast('Failed to Upload');
      });
  }

  videoUpload(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'attachment',
      fileName: '.mp4',
      chunkedMode: false,
      //mimeType: "image/jpeg",
    }

    this.presentLoading();
    var token = 'Bearer ' + this.userKey;
    var headers = { 'Authorization': token };

    //Here is the magic!
    options.headers = headers;
    fileTransfer.upload(path, 'https://wizdiary.com/api/v1/group-uploads', options)
      .then((data) => {
        console.log(data + " Uploaded Successfully");
        console.log(JSON.parse(data.response));
        let res = JSON.parse(data.response);
        if (res.success == true) {
          this.sendAtt = res.data;
          this.sendSendAtt(this.sendAtt)
          console.log(res.data);
        }
        this.loader.dismiss();

      }, (err) => {
        console.log(err);
        this.loader.dismiss();
        this.presentToast(err);
      });
  }

  sendSendAtt(att) {
    this.msg = {
      msg_to_id: this.getChatObj,
      user_from_id: this.userId,
      subject: "hello",
      message: '',
      file: att,
      is_image: 1
    }

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/send-message', JSON.stringify(this.msg),
     { headers: headers })
      .subscribe(data => {
          if (data.ok == true) {
            if (this.route.snapshot.paramMap.get('chatid') != null) {
              this.getChat(this.userId, this.route.snapshot.paramMap.get('chatid'));
            }
            else {
              this.getChat(this.userId, this.getChatObj);
            }
          }

      },error=>{
        this.presentToast(error);
      });
  }
  sendMessage(newMessage) {

    let mMsg = newMessage;
    this.newMessage = '';
    var rec = this.route.snapshot.paramMap.get('chatid')
    if ( rec != null) {
      this.msg = {
        user_to_id: this.getChatObj,
        message: mMsg,
        is_image: 0
      }
    }
    else {
      this.msg = {       
        user_to_id:this.getChatObj,
        subject: "hello",
        message: mMsg,
        file: '',
        is_image: 0
      }
    }

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    // this.httpp.post('https://wizdiary.com/api/v1/send-message', 

    this.httpp.post('https://wizdiary.com/api/v1/user-chat',
    // +rec,
      JSON.stringify(this.msg), { headers: headers })

      .subscribe(
        data => {
          if (data.ok == true) {
            var array = JSON.parse(data["_body"]);
            // this.getUserId();
            // this.Likeid = id;
            // this.diaryLike = array.count;
            this.newMessage = '';
            if (this.route.snapshot.paramMap.get('chatid') != null) {
              this.getChat(this.userId, this.route.snapshot.paramMap.get('chatid'));
            }
            else {
              this.getChat(this.userId, this.getChatObj);
            }
        }
      }, error=>{
  this.presentToast(error);
});
      
  }

getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

isImage(filename) {
  var ext = this.getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      //etc
      return true;
  }
  return false;
}

async presentActionSheet() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Upload Image or Video',
    buttons: [
      {
        text: 'Open Gallery',
        //          role: 'destructive',
        handler: () => {
          console.log('Image clicked');
          this.chosePhoto();
        }
      },
      {
        text: 'Open Camera',
        //          role: 'destructive',
        handler: () => {
          console.log('Image clicked');
          this.takeNewPhoto();
        }
      }, {
        text: 'Select Video',
        handler: () => {
          console.log('Video clicked');
          const options: CameraOptions = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
          }

          this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            this.postImage = imageData
            console.log(this.postImage);
            if (this.postImage != undefined) {
              this.videoUpload(this.postImage);
            }
          }, (err) => {
            // Handle error
          });
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  await actionSheet.present();
}

}
