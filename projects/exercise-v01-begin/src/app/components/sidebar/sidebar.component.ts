import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as firebase from 'firebase';
import { Channel } from '../../services/channel.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class='sidebar'>
      <nav>
        <span class='display-name'>{{user?.displayName}}</span>
        <ul class='channels'>
          <li class='channel' *ngFor='let channel of channels' (click)='channelSelectedEvent.emit(channel)'>#{{channel.name}}</li>
        </ul>
      </nav>
      <form class='new-channel-form' [formGroup]='newChannelForm' (ngSubmit)='emitNewChannel()'>
        <input type='text' formControlName='name'/>
        <button type='submit'>Add Channel</button>
      </form>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() user: firebase.User | null;
  @Input() channels: Channel[] = [];
  @Output() newChannelEvent = new EventEmitter<Omit<Channel, 'id'>>();
  @Output() channelSelectedEvent = new EventEmitter<Omit<Channel, 'id'>>();
  newChannelForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required])
  });

  constructor(private formBuilder: FormBuilder) {
  }

  emitNewChannel() {
    if (!this.newChannelForm.valid) {
      return;
    }

    this.newChannelEvent.emit(this.newChannelForm.value);
    this.newChannelForm.reset();
  }
}
