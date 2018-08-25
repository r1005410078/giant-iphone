import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WillRentPage } from './will-rent.page';
import { NgxQRCodeModule } from '../../../node_modules/ngx-qrcode2';

const routes: Routes = [
  {
    path: '',
    component: WillRentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WillRentPage]
})
export class WillRentPageModule {}
