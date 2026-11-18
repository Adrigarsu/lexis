// Interface texts live in locales/*.json, never in the code (RNF-33, ADR-012).
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';

export const defaultNS = 'translation';
export const resources = { es: { [defaultNS]: es } } as const;

export const i18n = i18next.createInstance();

// Synchronous init: there is a single bundled language, so t() works on the
// first render and in tests without awaiting anything.
void i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  defaultNS,
  resources,
  initAsync: false,
  interpolation: {
    // React already escapes every text it renders.
    escapeValue: false,
  },
});
