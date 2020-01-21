import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GallaryPage } from './gallary.page'; 
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: GallaryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    ,SharedModule,
    RouterModule.forChild(routes)
  ],
  // exports:[HeaderComponent,],
  declarations: [GallaryPage]
})
export class GallaryPageModule {}
