import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { InfiniteScroll, LoadingController, PopoverController, AlertController } from '../../../node_modules/@ionic/angular';
// tslint:disable-next-line:max-line-length
import { order_list_api, order_updateDepositMoney_api, order_createAlipayQrcode_api, order_settlement_api, order_paySuccess_api } from '../../api';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { PopoverComponent } from '../popover/popover.component';
import { tap, switchMap } from '../../../node_modules/rxjs/operators';
import { NgxQRCodeComponent } from '../../../node_modules/ngx-qrcode2';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  private data = null;
  private pageSize = 20;
  private pageIndex = 1;
  private total = 0;

  private popover = null;
  private codeUrl = '';

  @ViewChild('qrcode') qrcodeRef: NgxQRCodeComponent;

  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  get username () {
    return localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : '';
  }

  constructor (
    private http: HttpClient,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async presentAlertConfirm(url) {
    const alert = await this.alertController.create({
      header: '支付二维码',
      message: `<img style="width: 400" src="${url}">`,
      buttons: [
        {
          text: '确定',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertPrompt(item) {
    const alert = await this.alertController.create({
      header: '支付押金',
      inputs: [
        {
          name: 'money',
          type: 'number',
          value: item.deposit_money,
          placeholder: '请输入押金金额'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: item.deposit_type === '支付宝' ? '二维码支付' : item.deposit_type === '微信' ? '确定，并通知用户重新提交订单' : '生成订单',
          handler: (e) => {
            this.http.post(order_updateDepositMoney_api, {
              money: e.money,
              order_sn: item.deposit_order_sn
            })
            .pipe(
              switchMap(() => {
                if (item.deposit_type === '支付宝') {
                  return this.http.post(order_createAlipayQrcode_api, {
                    order_no: item.deposit_order_sn
                  });
                } else if (item.deposit_type === '微信') {
                  // 通知用户去
                  this.notification.success('修改押金成功，通知用户在小程序中重新提交订单');
                  return [];
                } else {
                  return this.http.post(order_paySuccess_api, {
                    order_no: item.deposit_order_sn
                  }).pipe(
                    tap(res => {
                      this.notification.success('现金订单生成成功');
                      this.loadData();
                    })
                  );
                }
              })
            )
            .subscribe((res: any) => {
              if (res && res.data.url) {
                this.codeUrl = res.data.url;
                this.qrcodeRef.value = this.codeUrl;
                this.qrcodeRef.toDataURL().then(url => {
                  this.presentAlertConfirm(url);
                });
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  settlementOrder (item) {
    this.presentAlertPrompt(item);
  }

  async presentPopover(event: any) {
    this.popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
      componentProps: {
        popover: this
      },
      translucent: true
    });
    return await this.popover.present();
  }

  async loadData(event?) {
    if (event) {
      this.pageIndex += 1;
    } else {
      this.pageIndex = 1;
      this.infiniteScroll.disabled = false;
    }
    this.http.post(order_list_api, {
      deposit_status: 0,
      page_size: this.pageSize,
      page: this.pageIndex,
      rent_status: 0
    })
    .subscribe((res: any) => {
      this.total = res.data.total;
      if (event) {
        this.data = this.data.concat(res.data.data);
        event.target.complete();
        if (this.data.length === this.total) {
          event.target.disabled = true;
        }
      } else {
        this.data = res.data.data;
      }
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
