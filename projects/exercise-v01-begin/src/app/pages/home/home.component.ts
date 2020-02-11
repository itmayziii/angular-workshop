import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as firebase from 'firebase';
import { Channel, ChannelService } from '../../services/channel.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPotentialUser } from '../../../../../exercise-v00-end/src/app/services/user.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  template: `
    <div class='home'>
      <app-sidebar [user]='currentUser' [channels]='channels'
        (newChannelEvent)='addChannel($event)'
        (channelSelectedEvent)='setCurrentChannel($event)'>
      </app-sidebar>
      <div class='message-area'>
        <ul>
          <li *ngFor='let message of currentChannel?.messages'>{{message.userDisplayName}} - {{message.text}}</li>
        </ul>
        <input type='text' [formControl]='message'>
        <button (click)='addMessageToChannel(this.currentChannel)'>add mess</button>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: firebase.User | null = null;
  channels: Channel[] = [];
  private channelsSubscription: Subscription | undefined;
  private userSubscription: Subscription | undefined;
  currentChannel: Channel | null = null;
  message = new FormControl('', [Validators.required]);

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
      .subscribe(channels => {
        this.channels = channels;
        this.setCurrentChannel(this.channels[0]);
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.channelsSubscription) {
      this.channelsSubscription.unsubscribe();
    }
  }

  addChannel(data: Omit<Channel, 'id'>) {
    console.log(data);
    this.channelService.upsertChannel(data);
  }

  addMessageToChannel(channel: Channel) {
    if (this.message.invalid) {
      return;
    }

    this.channelService.addMessageToChannel(channel, {
      userID: this.currentUser.uid,
      userDisplayName: this.currentUser.displayName,
      text: this.message.value
    })
      .then(() => this.message.reset());
  }

  setCurrentChannel(channel?: Channel) {
    if (!channel) {
      this.currentChannel = null;
      return;
    }

    this.currentChannel = channel;
    this.channelService.getMessagesForChannel(channel)
      .subscribe((newChannelData) => this.currentChannel = newChannelData);
  }
}
