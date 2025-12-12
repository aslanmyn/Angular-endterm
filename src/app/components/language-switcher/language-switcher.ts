import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.css']
})
export class LanguageSwitcher {
  languageService = inject(LanguageService);
  currentLanguage = this.languageService.currentLanguage;
  availableLanguages = this.languageService.getAvailableLanguages();

  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
  }
}





