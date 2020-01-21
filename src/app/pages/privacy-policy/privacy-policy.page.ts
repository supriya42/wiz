import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
htext:string;
userKey:any;
data:any;
cookiesData:any;
showBillBoard:any;
  constructor(
    private storage : Storage,
    private httpg: HttpClient,
    private global:GlobalServiceService,
  ) { 
   
    this.userKey = this.global.getKey();
    if (this.userKey == undefined) {
      this.storage.ready().then(() => {
        this.storage.get('Key').then((val) => {
          this.userKey = val;
          if (val != null) {
            this.getCookies();
          }
        });
      });
    }else{
      this.getCookies();
    }
  }

  ngOnInit() {
    this.htext = "Privacy Policy"
  }
  getCookies(){
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + this.userKey)
  this.httpg.get('https://wizdiary.com/api/v1/static-pages', {headers: headers})
  .subscribe(response => {
    this.data = response;
      if (this.data.success == true) {
        this.cookiesData = this.data.data.staticPage.terms_condition;
           
     }
  },error=>{
     console.log(error);
  });

}
}
