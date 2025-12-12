import { TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [LanguageService]
    });

    service = TestBed.inject(LanguageService);
    translateService = TestBed.inject(TranslateService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language if none saved', () => {
    expect(service.currentLanguage()).toBe('en');
  });

  it('should load saved language from localStorage', () => {
    localStorage.setItem('language', 'ru');
    const newService = new LanguageService(translateService);
    expect(newService.currentLanguage()).toBe('ru');
  });

  it('should set language and save to localStorage', () => {
    service.setLanguage('ru');
    expect(service.currentLanguage()).toBe('ru');
    expect(localStorage.getItem('language')).toBe('ru');
  });

  it('should update TranslateService when setting language', () => {
    spyOn(translateService, 'use');
    service.setLanguage('ru');
    expect(translateService.use).toHaveBeenCalledWith('ru');
  });

  it('should return available languages', () => {
    const languages = service.getAvailableLanguages();
    expect(languages.length).toBe(2);
    expect(languages[0].code).toBe('en');
    expect(languages[1].code).toBe('ru');
    expect(languages[0].name).toBe('English');
    expect(languages[1].name).toBe('Русский');
  });
});





