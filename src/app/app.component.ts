import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { GlobalServiceService } from './services/global-service.service';
import { Router } from '@angular/router';
import {Storage} from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
 hide:boolean = false;
  public appPages = [
        {
      title: 'Diary',
      url: '/diary',
      icon: 'document'
    }, {
      title: 'Gallery',
      url: '/gallary',
      icon: 'images'
    }, {  
      title: 'Profile',
      url: '/own-profile',
      icon: 'person'
    }, {
      title: 'Post Job / Adboard',
      url: '/billboard',
      icon: 'link'
    }, {
      title: 'Billboard',
      url: '/post-bill',
      icon: 'disc'
    }, {
      title: 'Message',
      url: '/messages',
      icon: 'mail'
    }, {
      title: 'Setting',
      url: '/setting',
      icon: 'settings'
    }, 
    {
      title: 'Logout',
      url: '/logout',
      icon: 'log-out'
    },
    {
      title: 'Cookies',
      url: '/cookies',
      icon: 'football'
    }, {
      title: 'Privacy Policy',
      url: '/privacy-policy',
      icon: 'lock'
    }, {
      title: 'About Us',
      url: '/aboutus',
      icon: 'information-circle-outline'
    },
    {
      title: 'Contact Us',
      url: '/contact',
      icon: 'contacts'
    },
  ];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage : Storage,
    private route : Router,
  ) {
    this.initializeApp();
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  logoutClicked(){
    this.platform.backButton.subscribe(()=>{
      console.log ('exit');
      navigator['app'].exitApp();
    })
    
    this.storage.clear();
    this.route.navigate(['home']);
  }

}
