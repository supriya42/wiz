import { Component, OnInit } from '@angular/core';
import { AlertController, NavParams, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';
@Component({
  selector: 'app-gallary',
  templateUrl: './gallary.page.html',
  styleUrls: ['./gallary.page.scss'],
})
export class GallaryPage implements OnInit {
  htext: any = "Gallary";
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userKey: any;
  userId: any;
  myAlbums: any;
  albumsImages: any;
  gallerimgUrl: any;
  data: any;
  userloc: any;
  showBillBoard: boolean = false;
  toUploadBillboard: any;
  albumName: any;
  toPostJobs: any;
  constructor(

    public alertCtrl: AlertController,
    public navCtrl: Router,
    // public navParams: NavParams,
    public httpg: HttpClient,
    private httpp: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private photoViewer: PhotoViewer,
    private keyboard: Keyboard,
    private global: GlobalServiceService,
  ) {
    this.billBoradsData = [];
    this.gallerimgUrl = "https://wizdiary.com/public/gallery_images/";
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";

    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getUserId(val);
          }
        });
      });
    }
    else {
      this.getUserId(this.userKey);
    }
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
  getUserId(val) {
    this.storage.get("UserId").then(val => {
      if (val != null) {
        this.userId = val;

        this.getAlbums(val);
        this.getAlbumImages(val);
      }
    });

  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loader.present();

  }

  shareViaSocial(c, s) {
    console.log(s);
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });

  }

  getAlbums(val) {

    this.myAlbums = [];
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/gallery', { headers: headers })
      .subscribe((response) => {
        this.data = response;
        if (this.data.success == true) {
          for (let r of this.data.data) {
            this.myAlbums.push(r);
          }
        }
      },
        error => {
          this.presentToast(error);

        });

  }

  openAlbum(id) {
    this.navCtrl.navigate(['gallaryimage/'+ id]);
    localStorage.setItem('albumId', id);
  }

  pressEvent(e, id) {
    console.log(id);
    this.showConfirm(id);
  }

  async  showConfirm(id) {
    const confirm = await this.alertCtrl.create({
      header: 'Are You Sure',
      message: 'Do you want to DELETE this Album?',
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
            this.deleteAlbum(id);
          }
        },
        {
          text: 'Open Gallary',
          handler: () => {
            console.log('Agree clicked');
            this.openAlbum(id);
          }
        }
      ]
    });
    confirm.present();
  }


  deleteAlbum(id) {
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/delete-album/' + id, { headers: headers })

      .subscribe((response) => {
        this.data = response;
        // for (let r of this.data) {
        // console.log(response);
        if (this.data.success == true) {
          this.loader.dismiss();
          this.getAlbums(this.userId);
        }

      }, error => {
        this.loader.dismiss();
        this.presentToast(this.data.message);
      });

  }

  addAlbum(albumName) {
    // console.log(albumName);
    if (albumName == undefined) {
      this.presentToast("Please Enter Album name");
      return false;
    }
    let albumObj = {
      user_id: this.userId,
      album_name: albumName
    };
    this.presentLoading();

    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp.post('https://wizdiary.com/api/v1/add-album', JSON.stringify(albumObj), { headers: headers })

      .subscribe(data => {
        if (data.ok == true) {
          this.albumName = '';
          this.loader.dismiss();
          this.getAlbums(this.userKey);
          var array = JSON.parse(data["_body"]);
        }
      }, error => {
        this.loader.dismiss();
        this.presentToast("Error" + error)
      }
      );

  }
  getAlbumImages(id) {
    //this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/gallery_all'
      // +id
      , { headers: headers })
      .subscribe(data => {
        this.data = data;
        if (this.data.success == true) {
          this.albumsImages = "";
          for (let r of this.data.data) {
            this.albumsImages.push(r);
          }
        }
      }, error => {
        this.presentToast(this.data.message);
      });

  }
  viewImage(url, title) {
    console.log(url, title);
    this.photoViewer.show(url, title, { share: false });
  }


  pressEvents(e, id) {
    console.log(id);
    this.showConfirms(id);
  }

  async showConfirms(id) {
    const confirm = await this.alertCtrl.create({
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


  deletePicture(id) {
    this.presentLoading();
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/delete-album-image/' + id, { headers: headers })
      .subscribe(response => {
        this.data = response;
        console.log(response);
        if (this.data.success == true) {
          this.getAlbumImages(this.userId);
          this.loader.dismiss();
        }
      },
        error => {
          this.loader.dismiss();
          this.presentToast(this.data.message);
        });

  }

}
