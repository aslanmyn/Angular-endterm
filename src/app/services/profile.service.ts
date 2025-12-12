import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable, map, switchMap, of } from 'rxjs';

export interface UserProfile {
  photoData?: string;
  displayName?: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  profilePictureUrl = signal<string | null>(null);

  constructor() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.loadProfilePicture(user.uid);
      } else {
        this.profilePictureUrl.set(null);
      }
    });
  }

  private async loadProfilePicture(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, `users/${uid}`);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const photoData = data['photoData'];
        if (photoData) {
          const dataUrl = `data:image/jpeg;base64,${photoData}`;
          this.profilePictureUrl.set(dataUrl);
        } else {
          this.profilePictureUrl.set(null);
        }
      } else {
        this.profilePictureUrl.set(null);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
      this.profilePictureUrl.set(null);
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async uploadProfilePicture(file: File, compressedBlob: Blob): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const base64Data = await this.blobToBase64(compressedBlob);

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, { photoData: base64Data }, { merge: true });

    const dataUrl = `data:image/jpeg;base64,${base64Data}`;
    this.profilePictureUrl.set(dataUrl);
    return dataUrl;
  }

  getProfilePictureUrl(uid: string): Observable<string | null> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user && user.uid === uid) {
          const docRef = doc(this.firestore, `users/${uid}`);
          return new Observable<string | null>(observer => {
            getDoc(docRef).then(snap => {
              if (snap.exists()) {
                const photoData = snap.data()['photoData'];
                const url = photoData ? `data:image/jpeg;base64,${photoData}` : null;
                observer.next(url);
              } else {
                observer.next(null);
              }
              observer.complete();
            }).catch(err => {
              observer.error(err);
            });
          });
        }
        return of(null);
      })
    );
  }
}

