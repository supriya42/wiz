import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Storage } from '@ionic/storage';
import { LoadingController, ToastController, NavParams, ActionSheetController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-gallaryimage',
  templateUrl: './gallaryimage.page.html',
  styleUrls: ['./gallaryimage.page.scss'],
})
export class GallaryimagePage implements OnInit {
  htext:any="Gallery Image";
  loader:any;
  caption:any;
  headers:any;
  title:any;
  toPostJobs:any;
  billBoradsData:any;
  locationObj:any;
  diaryImgUrl:any;
  profielImgUrl:any;
  billboardImg:any;
  userId:any;
  albumsImages:any;
  albumId:any;
  gallerimgUrl:any;
  showBillBoard:boolean= false;
  data:any;
  UserKey:any;
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: Router,
    public route : ActivatedRoute,
    private transfer: FileTransfer,
    // private file: File,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
  	// public navParams: NavParams,
  	private photoViewer: PhotoViewer,
     public httpg: HttpClient,
     private httpp:Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private keyboard: Keyboard,
    private global : GlobalServiceService,
  ) {
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";
    this.gallerimgUrl = "https://wizdiary.com/public/gallery_images/";
    this.UserKey = this.global.getKey();
    if (this.UserKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.UserKey = val;
          if (val != null) {
            this.getAlbumImages(this.route.snapshot.paramMap.get('alid'));
          }
        });
      });
    }else{
      this.getAlbumImages(this.route.snapshot.paramMap.get('alid'));
    }
   
    // this.getBillboards(this.locationObj);
    this.storage.get('userId').then((val)=>{
      this.userId = val;
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

	getAlbumImages(id){
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + this.UserKey);
      this.httpg.get('https://wizdiary.com/api/v1/album_images/'+id , {headers: headers})
      .subscribe((response) => {
        this.data = response;
          if (this.data.success == true) {
            this.loader.dismiss();
            this.albumsImages = this.data.data;                  
        }
      });
     
	}

	viewImage(url, title){
		console.log(url, title);
		this.photoViewer.show(url, title, {share: false});
	}
	pressEvent(e, id){
		console.log(id);
		this.showConfirm(id);
	}

async	showConfirm(id) {
	    const confirm =await this.alertCtrl.create({
	      header: 'Are You Sure',
	      message: 'Do you want to DELETE this Picutre?',
	      buttons: [
	        {
	          text: 'Cancle',
	          handler: () => {
	            console.log('Disagree clicked');
	            
	          }
	        },
	        {
	          text: 'Delete',
	          handler: () => {
	            console.log('Agree clicked');
	            this.deletePicture(id);
	          }
	        }
	      ]
	    });
	    confirm.present();
	}


	deletePicture(id){
		this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + this.UserKey);
      this.httpg.get('https://wizdiary.com/api/v1/delete-album-image/'+id, {headers: headers})
        
      .subscribe((response) => {
        this.data = response;
          if (this.data.success == true) {
            this.loader.dismiss();
            this.albumsImages = this.data.data;                
          }
          else{
            this.loader.dismiss();
            this.presentToast(this.data.message);
          }
      });
     

	}

  takePhoto(caption, title){
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
     //let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.imageUpload(imageData, caption, title);

    }, (err) => {
       this.presentToast('Something Went Wrong');
    })

  }
  chosePhoto(caption, title){
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
        this.imageUpload(imageData, caption, title);
      }
    }, (err) => {
      // Handle error
      this.presentToast("Not Able to Upload your Picture..")
    });
  }

  addPhotos(caption, title){
      if (caption == undefined || caption == '') {
          this.presentToast('Please Enter Caption');
          return false;
      }
      if (title == undefined || title == '') {
          this.presentToast('Please Enter Title');
          return false;
      }
      this.presentActionSheet(caption, title);
  }


  async presentActionSheet(caption, title) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Modify your album',
      buttons: [
        {
          text: 'Open Camera',
          handler: () => {
            console.log('Camera clicked');
            this.takePhoto(caption, title);
          }
        },{
          text: 'Open Gallery',
          handler: () => {
            console.log('Archive clicked');
            this.chosePhoto(caption, title);
          }
        },{
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

  imageUpload(path, caption, title) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
        fileKey: 'image',
        fileName: '.png',
        chunkedMode: false,
        //mimeType: "image/jpeg",
      }

      this.presentLoading();
      var token = 'Bearer ' + this.UserKey;
      var headers = { 'Authorization': token };
      //Here is the magic!
      options.headers = headers;
      fileTransfer.upload(path, 'https://wizdiary.com/api/v1/album-media', options)
        .then((data) => {
        let res = JSON.parse(data.response);
        if (res.success == true) {
          let ImgObj = {
            album_id: this.route.snapshot.paramMap.get('alid'),
            caption: caption,
            title: title,
            image_name:res.image_name
          }
          this.uploadwithImage(ImgObj);                       
        }
        this.loader.dismiss();
        
      }, (err) => {
        this.loader.dismiss();
        this.presentToast('Failed to upload');
      });
  }

  uploadwithImage(obj){
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.UserKey);
      this.httpp.post('https://wizdiary.com/api/v1/add-album-image',JSON.stringify(obj) , {headers: headers})    
      .subscribe((response) => {
        this.data = response;
      
          if (this.data.ok == true) {
            this.getAlbumImages(this.route.snapshot.paramMap.get('alid'));
            this.loader.dismiss();
            this.presentToast("Image Uploaded");
          }
          else{
            this.loader.dismiss();
            this.presentToast("Error In File upload");
          }
        
      });
    

  }
}
