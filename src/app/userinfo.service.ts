import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '../../node_modules/@angular/router';
import { HttpClient } from '../../node_modules/@angular/common/http';
import { loginApi } from '../api';
import { catchError } from '../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logout () {
    localStorage.removeItem('userInfo');
    this.router.navigateByUrl('login');
  }

  login (model: {username: string, password: string}) {
    this.http.post( loginApi , model)
    .subscribe((value: {ok: boolean, data?: {token: string}, error_msg?: string}) => {
      if (value.ok) {
        localStorage.setItem('userInfo', JSON.stringify({token: value.data.token}));
        this.router.navigateByUrl('');
      }
    });
  }
}
