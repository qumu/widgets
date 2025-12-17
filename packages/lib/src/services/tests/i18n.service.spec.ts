import { describe, expect, it } from 'vitest';
import { I18nService } from '../i18n.service';

describe('Service : I18nService', () => {
  describe('AddMessages', () => {
    it('should add messages after initializing the plugin', () => {
      const text = 'text';
      const localeEn = {
        [text]: 'Translated text',
      };
      const langEn = 'en';

      const i18nService = new I18nService({
        locale: langEn,
        messages: {
          [langEn]: localeEn,
        },
      });

      expect(i18nService.t(text)).toEqual(localeEn[text]);

      const langJa = 'ja';
      const localeJa = {
        [text]: '翻訳されたテキスト',
      };

      i18nService.addMessages(langJa, localeJa);
      i18nService.setLocale(langJa);

      expect(i18nService.t(text)).toEqual(localeJa[text]);
    });
  });

  describe('getLocale', () => {
    it('should return the language when a locale is set', () => {
      const i18nService = new I18nService({
        locale: 'fr-FR',
      });

      expect(i18nService.getLanguage()).toEqual('fr');
    });

    it('should return the language when the locale is not set', () => {
      const i18nService = new I18nService({
        locale: 'fr',
      });

      expect(i18nService.getLanguage()).toEqual('fr');
    });
  });

  describe('getLocale', () => {
    it('should return the locale', () => {
      const i18nService = new I18nService({
        locale: 'fr',
      });

      expect(i18nService.getLocale()).toEqual('fr');
    });
  });

  describe('setLocale', () => {
    it('should set the locale', () => {
      const lang = 'ja';
      const i18nService = new I18nService({});

      i18nService.setLocale(lang);

      expect(i18nService.getLocale()).toEqual(lang);
    });
  });

  describe('t', () => {
    it('should return the given text if not initialized', () => {
      const text = 'test:foo.bar';

      const i18nService = new I18nService({});

      expect(i18nService.t(text)).toEqual(text);
    });

    it('should return the given text for missing translation', () => {
      const locale = {
        foo: 'Translated foo',
      };
      const text = 'bar';
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text)).toEqual(text);
    });

    it('should perform a basic translation', () => {
      const text = 'foo';
      const locale = {
        [text]: 'Translated foo',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text)).toEqual(locale[text]);
    });

    it('should perform a basic translation fallback', () => {
      const text = 'foo';
      const locale = {
        [text]: 'Translated foo',
      };
      const lang = 'de';

      const i18nService = new I18nService({
        fallbackLocale: 'en',
        locale: lang,
        messages: {
          en: locale,
          [lang]: {},
        },
      });

      expect(i18nService.getLocale()).toEqual(lang);
      expect(i18nService.t(text)).toEqual(locale[text]);
    });

    it('should return the given text for a missing translation fallback', () => {
      const text = 'foo';
      const lang = 'de';

      const i18nService = new I18nService({
        fallbackLocale: 'en',
        locale: lang,
        messages: {
          [lang]: {},
        },
      });

      expect(i18nService.t(text)).toEqual(text);
    });

    it('should return the given text for a missing, nested translation key', () => {
      const path = 'foo.bar.baz';
      const locale = {
        foo: 'foo',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(path)).toEqual(path);
    });

    it('should translate a nested translation key', () => {
      const path = 'foo.bar.baz';
      const text = 'Translation text';
      const locale = {
        [path.split('.')[0]]: {
          [path.split('.')[1]]: {
            [path.split('.')[2]]: text,
          },
        },
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(path)).toEqual(text);
    });

    it('should translate a plural type', () => {
      const text = 'dog';
      const locale = {
        [text]: '{{count}} dog',
        [`${text}_plural`]: '{{count}} dogs',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { count: 0 })).toEqual('0 dogs');
      expect(i18nService.t(text, { count: 1 })).toEqual('1 dog');
      expect(i18nService.t(text, { count: 2 })).toEqual('2 dogs');
      expect(i18nService.t(text, { count: 7 })).toEqual('7 dogs');
    });

    it('should translate a plural type #2', () => {
      const text = 'dog';
      const locale = {
        [text]: '{{count}} dog',
        [`${text}_plural`]: '{{count}} dogs',
      };
      const lang = 'en-US';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { count: 0 })).toEqual('0 dogs');
      expect(i18nService.t(text, { count: 1 })).toEqual('1 dog');
      expect(i18nService.t(text, { count: 2 })).toEqual('2 dogs');
      expect(i18nService.t(text, { count: 7 })).toEqual('7 dogs');
    });

    it('should translate a plural type #3', () => {
      const text = 'dog';
      const enMessages = {
        [text]: '{{count}} dog',
        [`${text}_plural`]: '{{count}} dogs',
      };
      const locale = 'en-GB';

      const i18nService = new I18nService({
        locale,
        messages: {
          en: enMessages,
        },
      });

      expect(i18nService.t(text, { count: 0 })).toEqual('0 dogs');
      expect(i18nService.t(text, { count: 1 })).toEqual('1 dog');
      expect(i18nService.t(text, { count: 2 })).toEqual('2 dogs');
      expect(i18nService.t(text, { count: 7 })).toEqual('7 dogs');
    });

    it('should translate a plural type #4', () => {
      const text = 'dog';
      const enMessages = {
        [text]: '{{count}} dog',
        [`${text}_plural`]: '{{count}} dogs',
      };
      const enGbMessages = {
        [text]: '{{count}} dog (en-GB)',
        [`${text}_plural`]: '{{count}} dogs (en-GB)',
      };
      const locale = 'en-GB';

      const i18nService = new I18nService({
        locale,
        messages: {
          en: enMessages,
          'en-GB': enGbMessages,
        },
      });

      expect(i18nService.t(text, { count: 0 })).toEqual('0 dogs (en-GB)');
      expect(i18nService.t(text, { count: 1 })).toEqual('1 dog (en-GB)');
      expect(i18nService.t(text, { count: 2 })).toEqual('2 dogs (en-GB)');
      expect(i18nService.t(text, { count: 7 })).toEqual('7 dogs (en-GB)');
    });

    it('should translate a plural type for a language not supporting plurals', () => {
      const text = 'dog';
      const locale = {
        [text]: '{{count}} dogs',
      };
      const lang = 'ja';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { count: 0 })).toEqual('0 dogs');
      expect(i18nService.t(text, { count: 1 })).toEqual('1 dogs');
      expect(i18nService.t(text, { count: 2 })).toEqual('2 dogs');
      expect(i18nService.t(text, { count: 7 })).toEqual('7 dogs');
    });

    it('should return the given text for a missing plural translation', () => {
      const text = 'dog';
      const locale = {
        [text]: '{{count}} dog',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { count: 1 })).toEqual('1 dog');
      expect(i18nService.t(text, { count: 2 })).toEqual('dog');
    });

    it('should translate a key with context specified', () => {
      const text = 'dog';

      const locale = {
        [text]: 'just dog',
        [`${text}_small`]: 'small dog',
        [`${text}_big`]: 'big dog',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text)).toEqual('just dog');
      expect(i18nService.t(text, { context: 'small' })).toEqual('small dog');
      expect(i18nService.t(text, { context: 'big' })).toEqual('big dog');
      expect(i18nService.t(text, { context: 'unknown' })).toEqual('dog');
    });

    it('should interpolate variables in translations', () => {
      const text = 'dog';

      const locale = {
        [text]: 'dog',
        [`${text}-variable`]: '{{size}} dog',
        [`${text}-multiple-variables`]: '{{size}} and {{color}} dog',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { size: 'big' })).toEqual('dog');
      expect(i18nService.t(`${text}-variable`)).toEqual('undefined dog');
      expect(i18nService.t(`${text}-variable`, { size: 'big' })).toEqual('big dog');
      expect(i18nService.t(`${text}-variable`, { size: '$&' })).toEqual('$& dog');
      expect(i18nService.t(
        `${text}-multiple-variables`,
        {
          color: 'black',
          size: 'big',
        },
      )).toEqual('big and black dog');
    });

    it('should interpolate variables in translations with custom interpolation prefix and suffix', () => {
      const text = 'dog';

      const locale = {
        [text]: 'dog',
        [`${text}-variable`]: '{{size}} dog',
        [`${text}-multiple-variables`]: '{{size}} and {{color}} dog',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text, { size: 'big' })).toEqual('dog');
      expect(i18nService.t(`${text}-variable`)).toEqual('undefined dog');
      expect(i18nService.t(`${text}-variable`, { size: 'big' })).toEqual('big dog');
      expect(i18nService.t(`${text}-variable`, { size: '$&' })).toEqual('$& dog');
      expect(i18nService.t(
        `${text}-multiple-variables`,
        {
          color: 'black',
          size: 'big',
        },
      )).toEqual('big and black dog');
    });

    it('should perform nested translation', () => {
      const text = 'foo';

      const locale = {
        bar: 'baz',
        baz: 'quux',
        [text]: 'foo and $t(bar)',
        [`${text}-multi`]: 'foo and $t(bar) and $t(baz)',
        [`${text}-variable`]: 'foo, {{bar}} and $t({{bar}})',
      };
      const lang = 'en';

      const i18nService = new I18nService({
        locale: lang,
        messages: {
          [lang]: locale,
        },
      });

      expect(i18nService.t(text)).toEqual('foo and baz');
      expect(i18nService.t(`${text}-multi`)).toEqual('foo and baz and quux');
      expect(i18nService.t(`${text}-variable`, { bar: 'baz' })).toEqual('foo, baz and quux');
    });
  });
});
