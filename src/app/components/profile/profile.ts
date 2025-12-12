import { Component, inject, signal, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ImageCompressionService } from '../../services/image-compression.service';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {
  private auth = inject(AuthService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private compressionService = inject(ImageCompressionService);
  private favoritesService = inject(FavoritesService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  user = toSignal(this.auth.currentUser$, { initialValue: null });
  profilePictureUrl = this.profileService.profilePictureUrl;
  favoritesCount = computed(() => this.favoritesService.favorites().length);
  uploading = signal(false);
  error = signal<string | null>(null);

  get accountCreatedDate(): string | null {
    const user = this.user();
    if (!user?.metadata?.creationTime) return null;
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  get lastSignInDate(): string | null {
    const user = this.user();
    if (!user?.metadata?.lastSignInTime) return null;
    return new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      this.error.set('Please select a JPG or PNG image');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.error.set('Image size must be less than 10MB');
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    try {
      const compressedBlob = await this.compressionService.compressImage(file);
      await this.profileService.uploadProfilePicture(file, compressedBlob);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to upload image');
    } finally {
      this.uploading.set(false);
      input.value = '';
    }
  }
}
