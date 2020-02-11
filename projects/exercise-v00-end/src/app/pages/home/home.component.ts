import { Component, OnInit } from '@angular/core';
import { isPotentialUser, UserService } from '../../services/user.service';
import * as firebase from 'firebase';
import { filter } from 'rxjs/operators';

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
    this.userService.currentUserSubject
      .pipe(
        filter(isPotentialUser)
      )
      .subscribe(
      (user) => {
        this.loggedInUser = user;
      }
    );
  }
}
