import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from '../../../node_modules/rxjs';
import { tap } from '../../../node_modules/rxjs/operators';
import { order_count_api } from '../../api';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  private orderCount: Subscription;
  private pendingDepositCount = null;
  private pendingCompletionCount = null;
  private rentCount = null;
  constructor (private http: HttpClient) {

  }
  ngOnInit(): void {
    this.orderCount = interval(5000)
      .pipe(
        tap(parmas => {
          this.http.post(order_count_api, {
            deposit_status: 0,
            rent_status: 0
          })
          .subscribe((res: any) => {
            this.pendingDepositCount = res.data.count;
          });
        }),
        tap(parmas => {
          return this.http.post(order_count_api, {
            deposit_status: 1,
            rent_status: 0
          })
          .subscribe((res: any) => {
            this.rentCount = res.data.count;
          });
        }),
        tap(parmas => {
          return this.http.post(order_count_api, {
            deposit_status: 1,
            rent_status: 1
          })
          .subscribe((res: any) => {
            this.pendingCompletionCount = res.data.count;
          });
        })
    )
    .subscribe((data) => {
      // console.log(1111, data);
    });
  }
  ngOnDestroy(): void {
    this.orderCount.unsubscribe();
  }
}
