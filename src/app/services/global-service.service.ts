import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage'
import { Key } from 'protractor';
@Injectable({
  providedIn: 'root'
})
export class GlobalServiceService {
  Akey:any;
  userLoc:any;
  constructor(private  http : Http,
    private storage: Storage,) { }
  
  setUserLocation( userloc){
    this.userLoc = userloc;
  }
  getUserLocation()
  {
     return this.userLoc;
  }
  SetKey(key){
    this.Akey = key;
  }
  getKey(){
    return this.Akey;
  }
  
  }

