import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {of} from 'rxjs';
import { Router } from '@angular/router';
import { UserinfoService } from './userinfo.service';
import { LoadingController, ToastController } from '../../node_modules/@ionic/angular';
import { order_count_api } from '../api';
import { NotificationService } from './notification.service';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  loading = [];
  constructor(
    private router: Router,
    private userinfo: UserinfoService,
    public loadingController: LoadingController,
    private notification: NotificationService
  ) {

  }

  async createLoading () {
    const loading = await this.loadingController.create({
      content: '正在加载...',
    });
    this.loading.push(loading);
    return loading.present();
  }

  async dismiss (loading) {
   if (loading) {
    await loading;
    this.loading.forEach(l => l.dismiss());
    this.loading = [];
   }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let loading = null;
    if (req.url !== order_count_api) {
      loading = this.createLoading();
    }

    return next.handle(req.clone()).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          // console.error('HttpResponse error')
        }
        this.dismiss(loading);
        return event;
      }),
      catchError(event => {
        if (event.status === 401) {
          this.userinfo.logout();
          this.notification.error('登陆已失效, 请重新登陆');
        }
        if (event.status === 400) {
          this.notification.error(event.error.error_msg);
        }
        this.dismiss(loading);
        return of(event.error);
      })
    );
  }
}
