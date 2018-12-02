import { Component, ViewChild, OnInit } from '@angular/core';
import { order_list_api } from '../../api';
import { InfiniteScroll, LoadingController, PopoverController } from '../../../node_modules/@ionic/angular';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { UserinfoService } from '../userinfo.service';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {
  private data = null;
  private pageSize = 20;
  private pageIndex = 1;
  private total = 0;
  @ViewChild(InfiniteScroll)
  private infiniteScroll: InfiniteScroll;

  rentStation = '选择租车驿站';
  returnStation = '选择还车驿站';
  stationParams: { rent_station_id?: string, return_station_id?: string } = {};

  constructor (
    private http: HttpClient,
    public userinfoService: UserinfoService,
    public popoverController: PopoverController
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

  async loadData(event?) {
    if (event) {
      this.pageIndex += 1;
    } else {
      this.pageIndex = 1;
      this.infiniteScroll.disabled = false;
    }
    this.http.post(order_list_api, {
      deposit_status: 2,
      page_size: this.pageSize,
      page: this.pageIndex,
      rent_status: 1,
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
