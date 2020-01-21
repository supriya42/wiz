import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-crate-group-chat',
  templateUrl: './crate-group-chat.page.html',
  styleUrls: ['./crate-group-chat.page.scss'],
})
export class CrateGroupChatPage implements OnInit {
htext:any;
loader:any;
headers:any;
billBoradsData:any;
locationObj:any;
diaryImgUrl:any;
profielImgUrl:any;
billboardImg:any;
userId:any;
confirmImage:any;
gropuImgs:any;
returnNames = [];
data:any;
userKey:any;
selectId:any;
gName:any;
useName:any;
showBillBoard:boolean= false;
  constructor(
    public navCtrl: Router,
    // public navParams: NavParams,
     public httpg: HttpClient,
    private camera: Camera,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private transfer: FileTransfer,
    // private file: File,
    private keyboard: Keyboard,
    private httpp:Http,
    private global : GlobalServiceService,
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
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
    });
  }
  

  ngOnInit() {
    this.htext="Group Chat";
  }
  async presentToast(m) {
    const toast = await this.toastCtrl.create({
      message: m,
      duration: 3000
    });
    toast.present();
  }

  async presentLoading() {
    this.loader =  await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loader.present();
    
  }
  shareViaSocial(s){
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
        this.presentToast('Share Successfull');
    }).catch(() => {
        this.presentToast('Something Went Wrong');
    });

  }


  chosePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     //let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imageUpload(imageData);
    }, (err) => {
     this.presentToast('Something Went Wrong');
    })

  }

imageUpload(path) {
  const fileTransfer: FileTransferObject = this.transfer.create();
  let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: '.png',
      chunkedMode: false,
      //mimeType: "image/jpeg",
    }

    this.presentLoading();
    var token = 'Bearer ' + this.userKey;
    var headers = { 'Authorization': token };

    //Here is the magic!
    options.headers = headers;
    fileTransfer.upload(path, 'https://wizdiary.com/api/v1/group_image', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      console.log(JSON.parse(data.response));
      let res = JSON.parse(data.response);
      if (res.success == true) {
          this.confirmImage = res.image_name
          console.log('returened Image name: ' +this.confirmImage);
      }
      this.loader.dismiss();
      
    }, (err) => {
      console.log(err);
      this.loader.dismiss();
      this.presentToast(err);
    });
}

searchNow(useName){
  if (useName == undefined || useName == '') {
    this.presentToast('Please Enter Query');
    return false;
  }

  let searObj = {
    search_term: useName
  }

  this.presentLoading();
  
  var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/search-user-group', JSON.stringify(searObj),
       {headers: headers})
      
      .subscribe(data => {
          if (data.ok == true) {
            this.loader.dismiss();
            var array = JSON.parse(data["_body"]);
          	for(let n of array.data){
          		this.returnNames.push(n);
          	}
          }
      },error=>{
       this.loader.dismiss();
      });
}

selectedUser(name, id){
  console.log(id);
  if(name == undefined || name == ''){
    this.presentToast('Please Enter Group Name');
    return false;
  }
  if (this.confirmImage == undefined) {
    this.presentToast('Please Upload Group Image');
    return false;
  }


  let groupObj = {
    user_id:this.userId,
    group_name:name,
    image: this.confirmImage,
    user:id
  }
  this.presentLoading();
  var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/add-group', JSON.stringify(groupObj), {headers: headers}) 
      .subscribe(data => {
          if (data.ok == true) {
            this.loader.dismiss();
            var array = JSON.parse(data["_body"]);
            this.presentToast('Group Created');
          }
      },error=>{
        this.loader.dismiss();
        this.presentToast(error);
      
      });

}
}
