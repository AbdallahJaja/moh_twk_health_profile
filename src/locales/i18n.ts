import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationAR from './ar/translation.json';
import translationEN from './en/translation.json';

// The translations
const resources = {
  ar: {
    translation: translationAR
  },
  en: {
    translation: translationEN
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'ar',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    },
    
    // Language detection options
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      
      // keys or params to lookup language from
      lookupLocalStorage: 'language',
      
      // cache user language on
      caches: ['localStorage'],
      
      // optional expire and domain for set cookie
      cookieExpirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
    }
  });

export default i18n;