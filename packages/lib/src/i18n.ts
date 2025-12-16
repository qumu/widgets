import { I18nService } from '@qumu/ui-shared-module-i18n';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';

/**
 * Get the language from the closest `lang` attribute for the given element
 *
 * @param element The HTML element
 */
function getLanguage(element: HTMLElement): string {
  const closestElement = element.closest<HTMLElement>('[lang]');

  return closestElement ? closestElement.lang : 'en';
}

let i18nService: I18nService;

export function createI18n(element: HTMLElement) {
  i18nService = new I18nService({
    locale: getLanguage(element),
    messages: {
      en,
      fr,
      ja,
    },
  });
}

export function useI18n() {
  return i18nService;
}
