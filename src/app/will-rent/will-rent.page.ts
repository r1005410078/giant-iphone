import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { InfiniteScroll, LoadingController, PopoverController, AlertController } from '../../../node_modules/@ionic/angular';
import { order_list_api,
  order_updateDepositMoney_api,
  order_createAlipayQrcode_api,
  order_settlement_api, order_paySuccess_api } from '../../api';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { PopoverComponent } from '../popover/popover.component';
import { tap, switchMap } from '../../../node_modules/rxjs/operators';
import { NgxQRCodeComponent } from '../../../node_modules/ngx-qrcode2';
import { NotificationService } from '../notification.service';
import { of } from '../../../node_modules/rxjs';
import { UserinfoService } from '../userinfo.service';

@Component({
  selector: 'app-will-rent',
  templateUrl: './will-rent.page.html',
  styleUrls: ['./will-rent.page.scss'],
})
export class WillRentPage implements OnInit {

  private data = null;
  private pageSize = 20;
  private pageIndex = 1;
  private total = 0;

  private popover = null;
  private codeUrl = '';

  @ViewChild('qrcode') qrcodeRef: NgxQRCodeComponent;

  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  rentStation = '选择租车驿站';
  returnStation = '选择还车驿站';
  stationParams: { rent_station_id?: string, return_station_id?: string } = {};

  constructor (
    private http: HttpClient,
    public userinfoService: UserinfoService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  filter(rent_station_id: string): void {
    this.userinfoService.stationList(station => {
      this.rentStation = station.text;
      if (station.value) {
        Object.assign(this.stationParams, {rent_station_id: station.value});
      } else {
        delete this.stationParams.rent_station_id;
      }
      this.loadData();
    });
  }

  returnFilter(return_station_id: string): void {
    this.userinfoService.stationList(station => {
      this.returnStation = station.text;
      if (station.value) {
        Object.assign(this.stationParams, {return_station_id: station.value});
      } else {
        delete this.stationParams.return_station_id;
      }
      this.loadData();
    });
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

  onCreateOrder (data) {
    this.userinfoService.onCreateOrder(data, () => this.loadData());
  }

  presentAlertPrompt(item) {
    of(item).pipe(
      switchMap(() => {
        if (item.rent_type === '支付宝') {
          return this.http.post(order_createAlipayQrcode_api, {
            order_no: item.rent_order_sn
          });
        } else if (item.rent_type === '微信') {
          // 通知用户去
          this.notification.success('修改押金成功，通知用户在小程序中重新提交订单');
        } else {
          return this.http.post(order_paySuccess_api, {
            order_no: item.rent_order_sn
          }).pipe(
            tap(res => {
              this.notification.success('现金订单生成成功');
              this.loadData();
            })
          );
        }
        return [];
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
      deposit_status: 1,
      page_size: this.pageSize,
      page: this.pageIndex,
      rent_status: 0,
      ...this.stationParams
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
