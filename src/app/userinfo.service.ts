import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '../../node_modules/@angular/router';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { loginApi } from '../api';
import { catchError, map } from '../../node_modules/rxjs/operators';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  public stations = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    private actionSheetCtrl: ActionSheetController
  ) {
    if (localStorage.getItem('userInfo')) {
      this.initStationList();
    }
  }
  initStationList () {
    this.http.post('/api/system/station/list', {
      'page': 1,
      'page_size': 100
    }).pipe(
      map(
        (data: any) => data.data.data
          .map(item => ({ text: item.name, value: item.id }))
          .concat({text: '全部驿站', value: ''})
      )
    )
    .subscribe(data => {
      this.stations = data;
    });
  }

  logout () {
    localStorage.removeItem('userInfo');
    location.reload();
  }

  login (model: {username: string, password: string}) {
    this.http.post( loginApi , model)
    .subscribe((value: {ok: boolean, data?: {token: string, username: string}, error_msg?: string}) => {
      if (value.ok) {
        localStorage.setItem('userInfo', JSON.stringify({token: value.data.token, username: value.data.username}));
        this.initStationList();
        this.router.navigateByUrl('');
      }
    });
  }
  async stationList(next = station => {}) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: '请选择驿站',
      buttons: this.stations.map(station => {
        return {
          text: station.text,
          role: 'destructive',
          handler: () => next(station)
        };
      })
    });
    await actionSheet.present();
  }
  async toast(message) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  async onCreateOrder (data, next) {
    const alert = await this.alertController.create({
      header: '租车订单',
      message: '是否确认还车？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: '确定',
          handler: () => {
            this.http.post('/api/system/order/confirm', {
              order_no: data.deposit_order_sn
            })
            .subscribe((ret: any) => {
              this.toast('订单确认成功，告知用户支付租金');
              next(ret);
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
