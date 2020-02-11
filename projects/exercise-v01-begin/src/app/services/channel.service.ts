import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

export interface Channel {
  id?: string;
  name: string;
  messages?: Message[];
}

export interface Message {
  id?: string;
  userID: string;
  userDisplayName: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private channelsCollection: AngularFirestoreCollection<any> = this.fireStore.collection('channels');

  constructor(private fireStore: AngularFirestore) { }

  public getChannels() {
    return this.channelsCollection.snapshotChanges()
      .pipe(
        map((channelSnapshots) => {
          return channelSnapshots.map((channelSnapshot) => {
            const data = channelSnapshot.payload.doc.data();
            return { id: channelSnapshot.payload.doc.id, name: data.name, messages: data.messages };
          });
        })
      );
  }

  public upsertChannel(channel) {
    if (channel.id) {
      this.channelsCollection.doc(channel.id).set(channel);
      return;
    }

    this.channelsCollection.add(channel);
  }

  public getMessagesForChannel(channel: Channel) {
    return this.channelsCollection.doc(channel.id)
      .collection('messages')
      .snapshotChanges()
      .pipe(
        map((messageSnapshots) => {
          const messages = messageSnapshots.map((messageSnapshot) => {
            const data = messageSnapshot.payload.doc.data();
            return { id: messageSnapshot.payload.doc.id, userID: data.userID, userDisplayName: data.userDisplayName, text: data.text };
          });

          return {...channel, messages };
        })
      );
  }

  public addMessageToChannel(channel: Channel, message: Message): Promise<firebase.firestore.DocumentReference> {
    return this.channelsCollection.doc(channel.id)
      .collection('messages').add(message);
  }
}
