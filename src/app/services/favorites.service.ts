import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { Observable, map, switchMap, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private readonly STORAGE_KEY = 'favorites';
  private readonly SYNCED_KEY = 'favorites_synced';

  favorites = signal<number[]>([]);
  syncMessage = signal<string | null>(null);

  constructor() {
    authState(this.auth).subscribe(user => {
      if (user) {
        this.loadFromFirestore(user.uid);
      } else {
        this.loadFromLocalStorage();
      }
    });
  }

  private async loadFromFirestore(uid: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, `users/${uid}/favorites`, 'list');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const firestoreIds = data['itemIds'] || [];
        
        const localIds = this.getLocalStorageFavorites();
        const synced = localStorage.getItem(this.SYNCED_KEY) === 'true';
        
        if (localIds.length > 0 && !synced) {
          const merged = [...new Set([...firestoreIds, ...localIds])];
          await this.saveToFirestore(uid, merged);
          localStorage.removeItem(this.STORAGE_KEY);
          localStorage.setItem(this.SYNCED_KEY, 'true');
          this.syncMessage.set('Local favorites synced with your account');
          setTimeout(() => this.syncMessage.set(null), 5000);
          this.favorites.set(merged);
        } else {
          this.favorites.set(firestoreIds);
        }
      } else {
        const localIds = this.getLocalStorageFavorites();
        const synced = localStorage.getItem(this.SYNCED_KEY) === 'true';
        
        if (localIds.length > 0 && !synced) {
          await this.saveToFirestore(uid, localIds);
          localStorage.removeItem(this.STORAGE_KEY);
          localStorage.setItem(this.SYNCED_KEY, 'true');
          this.syncMessage.set('Local favorites synced with your account');
          setTimeout(() => this.syncMessage.set(null), 5000);
          this.favorites.set(localIds);
        } else {
          await this.saveToFirestore(uid, []);
          this.favorites.set([]);
        }
      }
    } catch (error) {
      console.error('Error loading favorites from Firestore:', error);
      this.loadFromLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    const ids = this.getLocalStorageFavorites();
    this.favorites.set(ids);
  }

  private getLocalStorageFavorites(): number[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private async saveToFirestore(uid: string, itemIds: number[]): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}/favorites`, 'list');
    await setDoc(docRef, { itemIds }, { merge: true });
  }

  private saveToLocalStorage(itemIds: number[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itemIds));
  }

  async toggleFavorite(itemId: number): Promise<void> {
    const user = this.auth.currentUser;
    const current = this.favorites();
    const isFavorite = current.includes(itemId);
    
    let updated: number[];
    if (isFavorite) {
      updated = current.filter(id => id !== itemId);
    } else {
      updated = [...current, itemId];
    }
    
    this.favorites.set(updated);
    
    if (user) {
      const docRef = doc(this.firestore, `users/${user.uid}/favorites`, 'list');
      if (isFavorite) {
        await updateDoc(docRef, { itemIds: arrayRemove(itemId) });
      } else {
        await updateDoc(docRef, { itemIds: arrayUnion(itemId) });
      }
    } else {
      this.saveToLocalStorage(updated);
    }
  }

  isFavorite(itemId: number): boolean {
    return this.favorites().includes(itemId);
  }

  favorites$(): Observable<number[]> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user) {
          const docRef = doc(this.firestore, `users/${user.uid}/favorites`, 'list');
          return new Observable<number[]>(observer => {
            getDoc(docRef).then(snap => {
              const ids = snap.exists() ? (snap.data()['itemIds'] || []) : [];
              observer.next(ids);
              observer.complete();
            }).catch(err => {
              observer.error(err);
            });
          });
        } else {
          return of(this.getLocalStorageFavorites());
        }
      })
    );
  }
}





