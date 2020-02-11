import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { map } from 'rxjs/operators';

export interface Channel {
  id: string;
  name: string;
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
            return { id: channelSnapshot.payload.doc.id, name: data.name };
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
}
