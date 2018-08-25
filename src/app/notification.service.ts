import { Injectable } from '@angular/core';
import { ToastController } from '../../node_modules/@ionic/angular';

@Injectable()
export class NotificationService {

  constructor( public toastController: ToastController) { }

  async success(message) {
    const toast = await this.toastController.create({
      message: message,
      cssClass: 'toast-success',
      duration: 2000,
      position: 'top'
    });
    return toast.present();
  }

  async error(message) {
    const toast = await this.toastController.create({
      message: message,
      cssClass: 'toast-error',
      duration: 2000,
      position: 'top'
    });
    return toast.present();
  }
}
