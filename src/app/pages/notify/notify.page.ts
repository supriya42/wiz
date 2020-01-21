import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.page.html',
  styleUrls: ['./notify.page.scss'],
})
export class NotifyPage implements OnInit {
  diaryData:any;
  data:any;
  userKey:any;
  htext="Notifications"
  constructor(
    private storage: Storage,
    private httpg:HttpClient,
    private global : GlobalServiceService,
  ) { this.userKey = this.global.getKey();
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
getData(val){  
  var headers: HttpHeaders = new HttpHeaders()
  .set("Accept", "application/json")
  .set("Content-Type", "application/json")
  .set("Authorization", "Bearer " + val)
  this.httpg.get('https://wizdiary.com/api/v1/notifications' ,
  { headers: headers })
  .subscribe(data=> {
  this.data = data;
  this.diaryData=[];
  if (this.data.success == true) {
    if(this.data.data.length == 0){
      this.diaryData = this.data.data;
      console.log(this.diaryData)
    }else{
    for(let r of this.data.data){
      this.diaryData.push(r);
      console.log(this.diaryData)
    }
  }
}  
},error=>{
console.log(error);
});
}


  ngOnInit() {
  }

}
