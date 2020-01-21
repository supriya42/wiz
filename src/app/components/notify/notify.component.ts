import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { getLocaleDateFormat } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  diaryData:any;
  data:any;
  userKey:any;
  constructor(
    private storage: Storage,
    private httpg:HttpClient,
    private global : GlobalServiceService,
  ){
    this.userKey = this.global.getKey();
    if(this.userKey == null){
    this.storage.ready().then(() => {
    this.storage.get("Key").then(val=>{
      if(val != null){
        this.getData(val);
      }
    });
  });
}else{
  this.getData(this.userKey);
}
  }
  ngOnInit() {
    
  }
  getData(val){  
    var headers: HttpHeaders = new HttpHeaders()
    .set("Accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + val)
    this.httpg.get('https://wizdiary.com/api/v1/notifications' ,
    { headers: headers })
    .subscribe(data=> {
    this.data = data;
    if (this.data.success == true) {
      if(this.data.data.length == undefined){
        this.diaryData = this.data.data;
        console.log(this.diaryData)
      }else{
      for(let r of this.data.data){
        this.diaryData.push(r);
      }
    }
  }  
},error=>{
  console.log(error);
});
}
}
