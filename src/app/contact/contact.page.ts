import { Component, OnInit, ViewChild } from '@angular/core';
import { order_list_api, order_settlement_api } from '../../api';
import { InfiniteScroll, LoadingController } from '../../../node_modules/@ionic/angular';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { tap } from '../../../node_modules/rxjs/operators';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage implements OnInit {
  private data = [];
  private pageSize = 20;
  private pageIndex = 1;
  private total = 0;
  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  constructor (
    private http: HttpClient,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  settlementOrder (item) {
    this.http.post(order_settlement_api, {
      order_no: item.deposit_order_sn
    })
    .subscribe((res: any) => {
      this.loadData();
      this.notification.success('结算成功');
    });
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
      rent_status: 1
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
