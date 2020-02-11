import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as firebase from 'firebase';
import { Channel, ChannelService } from '../../services/channel.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPotentialUser } from '../../../../../exercise-v00-end/src/app/services/user.service';

@Component({
  selector: 'app-home',
  template: `
    <div>
      <button (click)='addChannel()'>Add channel</button>
      <app-sidebar [user]='currentUser'></app-sidebar>

      <ul>
        <li *ngFor='let channel of channels'>
          {{ channel.id }}
          {{ channel.name }}
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: firebase.User | null = null;
  channels: Channel[];
  private channelsSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private userService: UserService, private channelService: ChannelService) {
  }

  ngOnInit(): void {
    this.userService.currentUserSubject
      .pipe(
        filter(isPotentialUser)
      )
      .subscribe(
        (user) => {
          this.currentUser = user;
        }
      );

    this.channelsSubscription = this.channelService.getChannels()
      .subscribe(channels => this.channels = channels);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.channelsSubscription) {
      this.channelsSubscription.unsubscribe();
    }
  }

  addChannel() {
    this.channelService.upsertChannel({name: 'General'});
  }
}
