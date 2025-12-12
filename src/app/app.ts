import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { OfflineService } from './services/offline.service';
import { NotificationService } from './services/notification.service';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Offline } from './components/offline/offline';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, CommonModule, Offline],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private offlineService = inject(OfflineService);
  private notificationService = inject(NotificationService);
  private languageService = inject(LanguageService);
  private translate = inject(TranslateService);
  isOnline = this.offlineService.isOnline;

  async ngOnInit() {
    this.offlineService.isOnline.set(navigator.onLine);
    
    const savedLang = localStorage.getItem('language') || 'en';
    this.translate.setDefaultLang('en');
    this.translate.use(savedLang);
    
    if ('serviceWorker' in navigator && 'Notification' in window) {
      await this.notificationService.initializeForUser();
      this.notificationService.setupMessageHandler((payload) => {
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'New notification', {
            body: payload.notification?.body,
            icon: payload.notification?.icon || '/favicon.ico'
          });
        }
      });
    }
  }
}
