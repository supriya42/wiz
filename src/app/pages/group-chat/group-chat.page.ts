import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import {Storage} from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';
@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
})
export class GroupChatPage implements OnInit {
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userKey: any;
  messages: any;
  newMessage: any;
  sendGroupAtt: any;
  groupMediaUrl: any;
  showBillBoard: boolean = false;
  data: any;
  toUploadBillboard:any;
  userId:any;
  likeBillboard:any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public httpg: HttpClient,
    private httpp: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private camera: Camera,
    private transfer: FileTransfer,
    private keyboard: Keyboard,
    private global : GlobalServiceService,
  ) {
    this.billBoradsData = [];
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
    // this.storage.ready().then(() => {
      this.storage.get('UserId').then((val) => {
        this.userId = val;
        if (val != null) {
        }
      });
    // });
    this.getGroupChat(this.route.snapshot.paramMap.get('groupId'));

    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
  }

  ngOnInit() {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupchatPage');
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

  getGroupChat(id) {
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/group-chat/' + id, { headers: headers })
      .subscribe((response) => {
        this.data = response;
          if (this.data.success == true) {
            for(let r of this.data.data){
              this.messages.push(r) ;//= this.data.data;
            }
           
            // setTimeout(()=>{that.content.scrollToBottom();},200);                          
          }
      },error=>{
         this.presentToast("Not able to Get your Group")
      });
   
  }

  sendMessage(newMessage) {
    let m = newMessage;
    this.newMessage = '';
    let nM = {
      to_actor: this.route.snapshot.paramMap.get('groupId'),
      user_from_id: this.userId,
      message: m
    }
    var headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/send-group-chat-message', JSON.stringify(nM), 
    { headers: headers })
      .subscribe(data => {
          
          if (data.ok == true) {
            this.getGroupChat(this.route.snapshot.paramMap.get('groupId'))
          }
        
      },error=>{
        this.presentToast("Not able to Send Message to your Group");
      });
  }

  sendSendAtt(att) {
    let AttchObj = {
      to_actor: this.route.snapshot.paramMap.get('groupId'),
      attachment: att,
      user_from_id: this.userId
    }

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/send-group-chat-message', JSON.stringify(AttchObj), 
    { headers: headers })
      .subscribe(data => {
          if (data.ok == true) {
            this.getGroupChat(this.route.snapshot.paramMap.get('groupId'))
          }
      },error=>{
        this.presentToast("Sorry for No response");
      });
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

  imageUpload(path) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'attachment',
      fileName: '.png',
      chunkedMode: false,
      //mimeType: "image/jpeg",
    }

    this.presentLoading();
    fileTransfer.upload(path, 'https://wizdiary.com/api/v1/group-uploads', options)
      .then((data) => {
        console.log(data + " Uploaded Successfully");
        console.log(JSON.parse(data.response));
        let res = JSON.parse(data.response);
        if (res.success == true) {
          this.sendGroupAtt = res.data;
          console.log(res.data);
          this.sendSendAtt(this.sendGroupAtt);
        }
        this.loader.dismiss();

      }, (err) => {
        console.log(err);
        this.loader.dismiss();
        this.presentToast(err);
      });
  }

}


