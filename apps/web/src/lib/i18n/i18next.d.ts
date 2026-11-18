// Typed keys: t('missing.key') is a tsc error instead of a broken text on screen.
import 'i18next';
import type { defaultNS, resources } from '.';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['es'];
  }
}
