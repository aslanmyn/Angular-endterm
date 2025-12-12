import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage, MessagePayload } from '@angular/fire/messaging';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messaging = inject(Messaging);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async requestPermission(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(this.messaging, {
          vapidKey: 'BC8DPxRAPJhrWh4PvpNqpCZFpVbI2OR6FWDf3k37BCl6en0gHO_33_iSHmt3P6ORPpSNvLwsGGeoMIRkWFL8noo'
        });
        
        if (token) {
          const user = this.auth.currentUser;
          if (user) {
            const tokenDocRef = doc(this.firestore, `users/${user.uid}/tokens`, 'fcm');
            await setDoc(tokenDocRef, { token, updatedAt: new Date() }, { merge: true });
          }
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return null;
    }
  }

  setupMessageHandler(callback: (payload: MessagePayload) => void): void {
    onMessage(this.messaging, callback);
  }

  async initializeForUser(): Promise<void> {
    authState(this.auth).pipe(take(1)).subscribe(async user => {
      if (user) {
        const permission = Notification.permission;
        if (permission === 'default') {
          await this.requestPermission();
        } else if (permission === 'granted') {
          const token = await getToken(this.messaging, {
            vapidKey: 'BC8DPxRAPJhrWh4PvpNqpCZFpVbI2OR6FWDf3k37BCl6en0gHO_33_iSHmt3P6ORPpSNvLwsGGeoMIRkWFL8noo'
          });
          if (token && user) {
            const tokenDocRef = doc(this.firestore, `users/${user.uid}/tokens`, 'fcm');
            await setDoc(tokenDocRef, { token, updatedAt: new Date() }, { merge: true });
          }
        }
      }
    });
  }
}

