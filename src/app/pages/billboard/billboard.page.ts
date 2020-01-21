import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Storage } from '@ionic/storage';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Http, Headers } from '@angular/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.page.html',
  styleUrls: ['./billboard.page.scss'],
})
export class BillboardPage implements OnInit {
  jobTitle:any;
  enableBill:any;
  disableBill:any;
  description:any;
  address:any;
  status:any;
  adType:any;
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  userId: any;
  planPrice: any;
  finalPrice: any;
  data: any;
  nowPay:boolean;
  myPostedJobs:any;
  showBillBoard: boolean = false;
  toUploadBillboard: any;
  userKey: any;
  toPostJobs: any;
  constructor(
    public router: Router,
    private httpg: HttpClient,
    // public navParams: NavParams,
    public httpp: Http,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private keyboard: Keyboard,
    private global: GlobalServiceService,
  ) {
    //  this.diaryImgUrl = globalData.diaryUrl;
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";

    //  this.getBillboards(this.locationObj);
    //  this.getPlans();
    this.userKey = this.global.getKey();
    if (this.userKey == null) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            // this.getPlans();
            this.getloc(val);
            this.getMyJobs();
          }
        });
      });
    } else {
      // this.getPlans();
      this.getloc(this.userKey);
      this.getMyJobs();
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

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loader.present();

  }
  getloc(userkey) {
    this.storage.get('UserId').then((val) => {
      this.userId = val;
    });
    this.storage.get('UserLoc').then((val) => {
      this.locationObj = val;
      // this.getBillboards(val);

    });
  }

  shareViaSocial(s) {
    // Share via email
    this.socialSharing.share('Check My Diary', null, null, s).then(() => {
      this.presentToast('Share Successfull');
    }).catch(() => {
      this.presentToast('Something Went Wrong');
    });

  }
  addJobAd(jobTitle, description, address, status, adType){
    if(jobTitle == undefined || jobTitle == ''){
        this.presentToast('Please Enter Job Title');
        return false;
    }
    if(description == undefined || description == ''){
        this.presentToast('Please Enter Job Description');
        return false;
    }
    if(address == undefined || address == ''){
        this.presentToast('Please Enter Addres');
        return false;
    }
    if(status == undefined || status == ''){
        this.presentToast('Please Select Status');
        return false;
    }
    if(adType == undefined || adType == ''){
        this.presentToast('Please Status Ad Type');
        return false;
    }
    if (adType == 'paid') {
        this.nowPay = true
    }
    else{
      this.nowPay = false;
    }

    let jobObj = {
      user_id:this.userId,
      job_title:jobTitle,
      job_description:description,
      address:address,
      status:status,
      job_type:adType
    }

    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/add-posted-job', 
      JSON.stringify(jobObj),{headers: headers})
      .subscribe(response => {
        this.data = response;
        if (this.data.ok == true) {
          var array = JSON.parse(this.data["_body"]);
          this.loader.dismiss();
          this.presentToast('Job posted Successfully');
          this.getMyJobs();
          //   if (this.nowPay == true) {
          //       this.router.navigateByUrl('/JobpaymentPage');
          //   }
        }
       },
      error => {
        this.loader.dismiss();
          this.presentToast("Not found");
      }
      );
  
    }

  getMyJobs(){
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/add-posted-job', {headers: headers})
      .subscribe((response) => {
        this.data = response;
          console.log(response);
          if (this.data.success == true) {
            this.myPostedJobs = this.data.data;
      }
        
      },error=>{
        this.presentToast("Not Found");
      });
  }


  deleteJob(id){
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.presentLoading();
    this.headers = {'Content-Type':'application/json'};
      this.httpg.get('https://wizdiary.com/api/v1/delete-job/'+id, {headers: headers})
      .subscribe((response) => {
        this.data = response;
          console.log(response);
          if (this.data.success == true) {
            this.getMyJobs();
            this.loader.dismiss();
      }
      
      },error=>{
        this.loader.dismiss();
        this.presentToast("Not Found");
      });

  }

}
