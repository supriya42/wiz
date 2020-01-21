import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  noproimg: any = "assets/icon/nopro.png";
  headtext: any = "Messages";
  loader: any;
  headers: any;
  billBoradsData: any;
  locationObj: any;
  diaryImgUrl: any;
  profielImgUrl: any;
  billboardImg: any;
  gImg: any;
  userId: any;
  getGroup: any;
  getMessages: any;
  showBillBoard: boolean = false;
  data: any;
  userKey: any;
  toPostJobs: any;
  toUploadBillboard: any
  constructor(
    public router: Router,
    public httpg: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private camera: Camera,
    private httpp: Http,
    private transfer: FileTransfer,
    // private file: File,
    public actionSheetCtrl: ActionSheetController,
    private keyboard: Keyboard,
    private global: GlobalServiceService,
  ) {
    this.diaryImgUrl = "https://wizdiary.com/public/assets/diary_uploads/";
    this.profielImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.billboardImg = "https://wizdiary.com/public/billboard_resized_images/";

    this.getKey();


    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showBillBoard = true;
       document.body.classList.add('keyboard-is-open');
    });

    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showBillBoard = false;
      document.body.classList.remove('keyboard-is-open');
    });
  }

  ngOnInit() {
  }
  getuserId() {
    this.storage.get('UserId').then((val) => {
      if (val != null) {
        this.userId = val;
        this.getAllMessages();
      }
    })
  }
  getKey() {
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getuserId();
          }
        });
      });
    }else{
      this.getuserId();
    }

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


  getAllMessages() {
    this.presentLoading()
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + this.userKey);
    this.httpg.get('https://wizdiary.com/api/v1/messages'
      //  + id
      , { headers: headers })
      .subscribe(
        response => {
          this.data = response;
          if (this.data.success == true) {
            this.loader.dismiss();
            this.getMessages = this.data.data.allMessages;
            this.getGroup = this.data.data.groups;
          }

        }, error => {
          this.loader.dismiss();
          this.presentToast(error);
        }
      );

  }

  openchat(sender, receiver, s_uname) {
    let ids = {
      s: sender,
      r: receiver,
      s_n: s_uname
    }
    this.router.navigate(['chat/' + sender + '/' + s_uname]);
    localStorage.setItem('chatObj', JSON.stringify(ids));
  }

  toNewGroup() {
    this.router.navigate(['crate-group-chat']);
  }

  openGroup(id) {
    console.log(id);
    this.router.navigate(['/group-chat']);
    localStorage.setItem('groupId', id);
  }

  editGroup(id) {
    console.log(id);
    this.router.navigate(['edit-group-page']);
    localStorage.setItem('id', id);
  }

}
