import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  template: `
    <div>
      <app-sidebar [user]='loggedInUser'></app-sidebar>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedInUser: firebase.User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.user;

    this.userService.userSubject.subscribe(
      (user) => {
        this.loggedInUser = user;
      }
    );
  }
}
