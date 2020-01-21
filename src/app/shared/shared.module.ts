import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../components/header/header.component';
import { BillboardComponent } from '../components/billboard/billboard.component';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [HeaderComponent,BillboardComponent,FooterComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
 exports:[HeaderComponent,BillboardComponent,FooterComponent]
})
export class SharedModule { }
