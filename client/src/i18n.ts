import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// eslint-disable-next-line import/no-named-as-default
const i18n = i18next.use(Backend).use(LanguageDetector).use(initReactI18next);

i18n.init({
  backend: {
    loadPath: '/translations/{{lng}}/{{ns}}.json',
  },
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ['en', 'ko'],
  fallbackLng: 'ko',
  lng: 'ko',
  detection: {
    order: ['localStorage', 'cookie', 'navigator'],
    caches: ['localStorage'],
  },
  defaultNS: 'common',
  ns: ['common', 'error'],
  debug: false,
  returnObjects: true,
});

export default i18n;
