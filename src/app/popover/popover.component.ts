import { Component, OnInit, Output } from '@angular/core';
import { UserinfoService } from '../userinfo.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
  @Output() popover;

  constructor(
    private user: UserinfoService
  ) { }

  ngOnInit() {
  }

  logout () {
    this.popover.dismiss();
    this.user.logout();
  }
}
