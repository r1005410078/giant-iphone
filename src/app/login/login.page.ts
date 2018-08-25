import { Component, OnInit } from '@angular/core';
import { UserinfoService } from '../userinfo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  private model = {
    username: '',
    password: ''
  };

  constructor(
    private userinfo: UserinfoService
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.userinfo.login(this.model);
  }

}
