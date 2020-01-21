import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GlobalServiceService } from 'src/app/services/global-service.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-bill',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss'],
})
export class BillboardComponent implements OnInit {

  showBillBoard: boolean = false;
  toUploadBillboard: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userKey: any;
  userId: any;
  loader: any;
  data:any;
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  constructor(
    private socialSharing: SocialSharing,
    private storage: Storage,
    public httpp: Http,
    private httpg: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private platform: Platform,
    private keyboard : Keyboard,
    private global: GlobalServiceService,
  ) {
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
       document.body.classList.add('keyboard-is-open');
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
      document.body.classList.remove('keyboard-is-open');
    });
    //  this.getBillboards(this.locationObj);
    //  this.getPlans();
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
    this.locationObj = this.global.getUserLocation();
    if(this.locationObj == undefined ){   
      this.storage.ready().then(() => {
        this.storage.get('UserLoc').then((val) => {
          this.locationObj = val;
          if (val != null) {
            this.getBillboards(this.locationObj);
            this.global.setUserLocation(this.locationObj);
          }
          else{
            this.getUserLocation();
          }
        });
      });     

    }else{
      this.getBillboards(this.locationObj);
    }
   
  }

  ngOnInit() { }
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
  getUserLocation() {
    this.platform.ready().then(() => {
      this.geolocation
        .getCurrentPosition({
          maximumAge: 0,
          timeout: 5000,
          enableHighAccuracy: true
        })
        .then(resp => {
          this.locationObj = {
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          };
          this.global.setUserLocation(this.locationObj);
          this.storage.set('UserLoc', this.locationObj);
          // this.getId();
        })
        .catch(error => {
          this.presentToast("Not able to get your Location !! " + error);
        });

      let watch = this.geolocation.watchPosition();
      watch.subscribe(data => { });
    });
    // this.getId();
  }
  getBillboards(latlng) {
    this.billBoradsData = [];
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);

    this.httpp.post("https://wizdiary.com/api/v1/show-billboards",
      JSON.stringify(latlng), { headers: headers }
    )
      .subscribe(
        data => {
          if (data.ok == true) {
            var array = JSON.parse(data["_body"]);
            for (let r of array.data.billboards) {

              this.billBoradsData.push(r);
            }
          }
        },
        error => {
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
  likeBillboard(id) {
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg
      .get("https://wizdiary.com/api/v1/like-billboards/"
        // + this.userId + "/"
        + id,
        { headers: headers }
      ).subscribe(
      (response) => {
        this.data = response;
        if (this.data.success == true) {
          this.getBillboards(this.locationObj);
             this.presentToast("Billboard Liked");
        }
      },
        error => {         
          this.presentToast("Like");
        }
      );

  }
}
