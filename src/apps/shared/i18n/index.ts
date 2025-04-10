import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import ptTranslation from './locales/pt/translation.json';

// Get language from URL query parameter
const getLanguageFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang')?.toLowerCase();
  return langParam || 'en';
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      pt: {
        translation: ptTranslation
      }
    },
    lng: getLanguageFromUrl(), // Set language from URL
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    },
    load: 'languageOnly' // This will treat 'pt-br' as 'pt'
  });

export default i18n; 