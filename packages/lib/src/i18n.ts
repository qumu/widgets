import { I18nService } from '@/services/i18n.service';
import en from './locales/en.json';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';

/**
 * Get the language from the closest `lang` attribute for the given element
 *
 * @param element The HTML element
 */
function getLanguage(element: HTMLElement): string {
  const closestElement = element.closest<HTMLElement>('[lang]');

  if (closestElement) {
    return closestElement.lang;
  }

  return window.navigator.language || 'en';
}

let i18nService: I18nService;

export function createI18n(element: HTMLElement, locales?: WidgetConfiguration['locales']) {
  i18nService = new I18nService({
    locale: getLanguage(element),
    messages: {
      en,
      ...locales,
    },
  });
}

export function useI18n() {
  return i18nService;
}
