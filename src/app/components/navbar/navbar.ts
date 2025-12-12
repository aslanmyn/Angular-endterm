import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, UpperCasePipe, TranslateModule, LanguageSwitcher],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  private auth = inject(AuthService);
  private router = inject(Router);
  profileService = inject(ProfileService);

  user$ = this.auth.currentUser$;
  profilePictureUrl = this.profileService.profilePictureUrl;

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }
}
