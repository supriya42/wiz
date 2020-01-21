import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage'
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PopoverController } from '@ionic/angular';
import { NotifyComponent } from '../notify/notify.component';
import { GlobalServiceService } from 'src/app/services/global-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userKey: any;
  diaryData: any = [];
  data: any;
  count: number;
  @Input() public HeadText: string = "Diary";
  @Input() public HideBtn: boolean = false;
  constructor(
    private router: Router,
    private httpg: HttpClient,
    private storage: Storage,
    private popoverCtrl: PopoverController,
    private global: GlobalServiceService,
  ) {
    this.userKey = this.global.getKey();
    if (this.userKey == null) {
      this.storage.ready().then(() => {
        this.storage.get("Key").then(val => {
          if (val != null) {
            this.getNotify(val);
          }
        });
      });
    } else {
      this.getNotify(this.userKey);
    }
  }

  ngOnChanges() { }
  ngOnInit() { }
  GotoContact(){
    this.router.navigate(['contact']);
  }
  toSearch() {
    this.router.navigate(['search']);
  }
  GotoDiary() {
    this.router.navigate(['diary']);
  }
  GotoMessage() {
    this.router.navigate(['messages']);
  }
 
GotoNotify() {
    // const popover = await this.popoverCtrl.create({
    //   component: NotifyComponent,
    //   event: ev,
    //   animated: true,
    //   showBackdrop: true
    // });
    // return await popover.present();
    this.router.navigate(['notify']);
  }
  getNotify(val) {
    this.count = 0;
    var headers: HttpHeaders = new HttpHeaders()
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", "Bearer " + val)
    this.httpg.get('https://wizdiary.com/api/v1/notifications',
      { headers: headers })
      .subscribe(data => {
        this.data = data;
        if (this.data.success == true) {
          if (this.data.data.length == undefined) {
            this.diaryData = this.data.data;
            this.count = 1;
          } else {
            for (let r of this.data.data) {
              this.count = this.count + 1;
              this.diaryData.push(r);

            }
          }
          this.storage.set("NotifydDta", this.diaryData);

        }

      }, error => {
        console.log(error);
      });
  }
}
