import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abouus',
  templateUrl: './abouus.page.html',
  styleUrls: ['./abouus.page.scss'],
})
export class AbouusPage implements OnInit {
htext: string;
  constructor() { }

  ngOnInit() {
    this.htext = "About Us";
  }

}
