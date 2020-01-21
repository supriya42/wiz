import { Component, OnInit } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { Router } from '@angular/router';
import {Storage} from '@ionic/storage';
import { GlobalServiceService } from 'src/app/services/global-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
 htext : any;
 searchList:any;
 userKey:any;
 search_term:any;
 hideSearch = true;
 profileImgUrl:any;
 noproimg:any;
 toPostJobs:any;
  constructor( private httpp: Http,
    private storage: Storage,
    private router: Router,
    private global:GlobalServiceService) { }

  ngOnInit() {
    this.htext = "Search";
    this.searchList = [];
    this.profileImgUrl = "https://wizdiary.com/public/assets/frontend/user_profile_images/";
    this.noproimg = "assets/icon/nopro.png";
    this.getId();
  }
  getId() {
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
  }
  filterList(event){
    this.searchList = [];
    let search ={
      search_term : this.search_term
    }
    var headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + this.userKey);
    this.httpp
      .post(
        "https://wizdiary.com/api/v1/search-user",
        JSON.stringify(search),
        { headers: headers }
      )
      .subscribe(data => {
        if (data.ok == true) {
          var array = JSON.parse(data["_body"]);
          for(let i of array.data.users){
               this.searchList.push(i);
          }
        }
        console.log( array.data.users);
      },
        error => {
          console.log(error);
        }
      );
  }
  DisplayPublicPro(username){
    this.router.navigate(['profile/'+username])
  }
}
