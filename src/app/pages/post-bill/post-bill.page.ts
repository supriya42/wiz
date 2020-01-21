import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Http, Headers } from '@angular/http';
import { PayPalPayment, PayPalConfiguration, PayPal } from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-post-bill',
  templateUrl: './post-bill.page.html',
  styleUrls: ['./post-bill.page.scss'],
})
export class PostBillPage implements OnInit {
  loader:any;
  
  planPrice: any;
  hidepay:any=true;
  paidBilboard:boolean;
  headers:any;
  billBoradsData:any;
  locationObj:any;
  diaryImgUrl:any;
  profielImgUrl:any;
  billboardImg:any;
  uploadBillboardImg:any;
  confirmImage:any;
  userId:any;
  myBill:any;
  address:any;
  showBillBoard:boolean= false;
  data:any;
  userKey:any;
  status:any;
  billboardType:any;
  businessName:any;
  toMap:any;
  toPostJobs
  constructor(
    public router: Router,
  
    private camera: Camera,
    private transfer: FileTransfer,
    // private file: File,
  	 public httpg: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private httpp:Http,
    private keyboard: Keyboard,
    public actionSheetCtrl: ActionSheetController,    
    private payPal: PayPal,
    
    ) {
      // this.getBillboards(this.locationObj);
      this.storage.get('Key').then((val)=>{
        this.userKey = val;
        if( val!=null){
          // this.getMyBoards(val);
          // this.getPlans();
          this.storage.get('UserId').then((val)=>{
            this.userId = val;
            if( val!=null){
              this.getMyBoards(this.userId);
            }
          });
        }
      });
      
 
     this.keyboard.onKeyboardShow().subscribe(() => {
       this.showBillBoard = true;
     });
 
     this.keyboard.onKeyboardHide().subscribe(() => {
       this.showBillBoard = false;
     });
     }
     ionViewDidLoad() {
      console.log('ionViewDidLoad PostbillboardPage');
  
    }
    ionViewWillEnter(){
      // if(globalData.globalAddress != ''){
      //    this.address = globalData.globalAddress;
      // }
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
  

  ngOnInit() {
  }
  getPlans() {
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/job-price-plan', { headers: headers })
      .subscribe(response => {
        this.data = response;
        if (this.data.success == true) {
          this.planPrice = this.data.data;
        }

      }, error => {
        this.presentToast(this.data.message);
      });
  }
  BillType(ev){
   if(ev.detail.value == "paid"){
     this.getPlans();
    this.hidepay = false;
   }else{
     this.hidepay = true;
   }
   
  }
  chosePhoto(){
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
             this.uploadBillboardImg = imageData
             console.log(this.uploadBillboardImg);
             if (this.uploadBillboardImg != undefined) {
                 this.imageUpload(this.uploadBillboardImg);
             }
            }, (err) => {
             // Handle error
            });
  }

    takePhoto(){
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
             this.uploadBillboardImg = imageData
             console.log(this.uploadBillboardImg);
             if (this.uploadBillboardImg != undefined) {
                 this.imageUpload(this.uploadBillboardImg);
             }
            }, (err) => {
             // Handle error
            });
  }
  showBill(){
    this.router.navigate(['/post-job']);
  }

 async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Upload BillBoard Image',
      buttons: [
        {
          text: 'Open Camera',
          handler: ()=>{
            this.takePhoto();
          }
        },
        {
          text: 'Open gallery',
          handler: () => {
            this.chosePhoto();
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
  await  actionSheet.present();
  }

imageUpload(path) {
  const fileTransfer: FileTransferObject = this.transfer.create();
  let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: '.png',
      chunkedMode: false,
      //mimeType: "image/jpeg",
    }
    var token = 'Bearer ' + this.userKey;
    var headers = { 'Authorization': token };

    //Here is the magic!
    options.headers = headers;
    this.presentLoading();
    fileTransfer.upload(path, 'https://wizdiary.com/api/v1/billboard-media', options)
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

  addBillboard(businessName, address, status, billboardType){

    if(this.confirmImage == undefined || this.confirmImage == ''){
        this.presentToast('Please Upload Billboard Picture');
        return false;
    }
    if(businessName == undefined || businessName == ''){
        this.presentToast('Please Enter Business Name');
        return false;
    }
    if(address == undefined || address == ''){
        this.presentToast('Please Enter Address');
        return false;
    }
    if(status == undefined || status == ''){
        this.presentToast('Please Select Status');
        return false;
    }
    if(billboardType == undefined || billboardType == ''){
        this.presentToast('Please Select Billboard Type');
        return false;
    }
    if (billboardType == 'paid') {
      this.paidBilboard = true;
    }

    let billObj = {
      user_id: this.userId,
      title: businessName,
      image: this.confirmImage,
      address: address, 
      status: status, 
      billboard_type: billboardType
    }

    this.presentLoading();
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/billboard', JSON.stringify(billObj),{headers: headers})
      .subscribe(data => {
        // this.data = response;
        // for (let r of this.data) {
        //   console.log(response);
          if (data.ok == true) {
            this.loader.dismiss();
            this.presentToast('Billboard Uploaded Successfully');
            var array = JSON.parse(data["_body"]);
            if (this.paidBilboard == true) {
                this.router.navigate(['/post-job']);
                this.storage.set('billId', array.id);
            }
        }
      },error=>{
        this.loader.dismiss();
        this.presentToast("Sorry Cannot Post your Job, Please Wait...");
      });

  }
  getMyBoards(id){
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
      this.httpg.get('https://wizdiary.com/api/v1/billboard'
      // +id
      , {headers: headers})
      .subscribe((response) => {
        this.data = response;
          if (this.data.success == true) {
            this.myBill = this.data.data.billboards;
      }
      },error=>{
        this.presentToast("Not Able to get BillBoard")
      });
  }

  disableBill(id){
    this.presentLoading();

    let statusObj = {
      id:id,
      status:"disabled"
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/billboard-status', 
      JSON.stringify(statusObj),{headers: headers})
      
      .subscribe(data => {
        // this.data = response;
        // for (let r of this.data) {
        //   console.log(response);
          if (data.ok == true) {
            this.getMyBoards(this.userId);
            this.loader.dismiss();
      }
      },error=>{
        
        this.loader.dismiss();
        this.presentToast("Disabled!!");
      });

  }

  enableBill(id){

    this.presentLoading();

    let statusObj = {
      id:id,
      status:"enabled"
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/billboard-status', JSON.stringify(statusObj),
      {headers: headers})
      
      .subscribe(data => {
          if (data.ok == true) {
            this.getMyBoards(this.userId);
            this.loader.dismiss();
      }
      },error=>{
        
        this.loader.dismiss();
        this.presentToast("Enabled!!");
      });
    

  }

  deleteBill(id){
    this.presentLoading();

    let deleteObj = {
      billboard_id: id
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
      this.httpp.post('https://wizdiary.com/api/v1/delete-billboard', JSON.stringify(deleteObj),
      {headers: headers})
      .subscribe(data => {
          if (data.ok == true) {
            this.getMyBoards(this.userId);
            this.loader.dismiss();
      }
      },error=>{        
        this.loader.dismiss();
        this.presentToast("Pending....");
      });

  }
  
  PayNow(pId, price) {
    console.log(price);
    this.payPal.init({
      PayPalEnvironmentProduction: 'AcVUIQCXWJvY986trjsU2Gr11K-xcP8Y5eJPLyiejZIsEwUZBIGMlsld9DQgYI9nyUZYQZxXAeAn_Vza',
      PayPalEnvironmentSandbox: 'Ada-e73nbGMxN-tXAbaCBnIDLwXJ7xp1pwa7qmOIQgLMsT-Phi6eErYTH4cu_owqAN-u9qUf_iDHTgtm'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(price.toString(), 'USD', 'Billboard Payment', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((val) => {
          // Successfully paid
          console.log("from val: " + val);
          let res = JSON.stringify(val);
          let responseParse = JSON.parse(res)

          console.log(responseParse);

          console.log("from payment: " + payment);
          let res2 = JSON.stringify(payment);
          // this.confirmPayment(this.navParams.get('billId'), pId);

        }, (a) => {
          // Error or render dialog closed without being successful
          console.log(a);
          this.presentToast('Error in rendering ')
        });
      }, (b) => {
        // Error in configuration
        console.log(b);
        this.presentToast('Error in Configuration ')
      });
    }, (c) => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log(c);
      this.presentToast('Error in initialiting or support')
    });

  }


  confirmPayment(billId, pid) {
    this.presentLoading();
    let payObj = {
      billboard_id: billId,
      plan_id: pid
    };
    this.headers = { 'Content-Type': 'application/json' };
    this.httpp.post('https://wizdiary.com/api/v1/billboard-payment-success', { headers: this.headers })


      .subscribe((response) => {
        this.data = response;
        for (let r of this.data) {
          console.log(response);
          if (r.success == true) {
            this.loader.dismiss();
            this.presentToast(r.message);
          }
          else {
            this.presentToast(r.message);
          }
        }

      });

  }

}
