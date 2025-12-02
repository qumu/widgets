import { describe, it, expect, beforeEach, vitest, Mock, afterEach } from 'vitest';
import { ConfigurationService } from '../configuration.service';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';

describe('ConfigurationService', () => {
  const configurationService: ConfigurationService = new ConfigurationService();

  let consoleWarnSpy: Mock;

  beforeEach(() => {
    consoleWarnSpy = vitest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('validate', () => {
    const validConfiguration: WidgetConfiguration = {
      guid: 'test-guid-123',
      host: 'example.com',
      selector: '#my-widget',
    };

    it('should end silently when no errors occur', () => {
      expect(() => configurationService.validate(validConfiguration)).not.toThrow();
    });

    it('should throw error when configuration is not an object', () => {
      expect(() => configurationService.validate(null as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );

      expect(() => configurationService.validate(42 as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );

      expect(() => configurationService.validate('invalid' as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );
    });

    it('should warn for unsupported fields in configuration', () => {
      const configWithExtraField = {
        ...validConfiguration,
        extraField: 'not-supported',
      } as unknown as WidgetConfiguration;

      expect(() => configurationService.validate(configWithExtraField)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported field `extraField` in configuration');
    });

    it('should throw error for unsupported fields in widgetOptions', () => {
      const configWithExtraField = {
        ...validConfiguration,
        widgetOptions: {
          extraField: 'not-supported',
        },
      } as unknown as WidgetConfiguration;

      expect(() => configurationService.validate(configWithExtraField)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported field `widgetOptions.extraField` in configuration');
    });

    describe('selector validation', () => {
      it('should throw error when selector is undefined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).selector;

        expect(() => configurationService.validate(config)).toThrow(
          '`selector` is not defined in the configuration',
        );
      });

      it('should throw error when selector is null', () => {
        const config = {
          ...validConfiguration,
          selector: null as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`selector` is not defined in the configuration',
        );
      });

      it('should throw error when selector is not a string', () => {
        const config = {
          ...validConfiguration,
          selector: 123 as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`selector` must be a string',
        );
      });

      it('should throw error when selector is an empty string', () => {
        const config = {
          ...validConfiguration,
          selector: '',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`selector` cannot be an empty string',
        );
      });

      it('should throw error when selector is only whitespace', () => {
        const config = {
          ...validConfiguration,
          selector: '   ',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`selector` cannot be an empty string',
        );
      });
    });

    describe('host validation', () => {
      it('should throw error when host is undefined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).host;

        expect(() => configurationService.validate(config)).toThrow(
          '`host` is not defined in the configuration',
        );
      });

      it('should throw error when host is null', () => {
        const config = {
          ...validConfiguration,
          host: null as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`host` is not defined in the configuration',
        );
      });

      it('should throw error when host is not a string', () => {
        const config = {
          ...validConfiguration,
          host: 42 as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`host` must be a string',
        );
      });

      it('should throw error when host is an empty string', () => {
        const config = {
          ...validConfiguration,
          host: '',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`host` cannot be an empty string',
        );
      });

      it('should throw error when host is only whitespace', () => {
        const config = {
          ...validConfiguration,
          host: '   ',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`host` cannot be an empty string',
        );
      });

      it('should accept valid domain names', () => {
        const validHosts = [
          'example.com',
          'subdomain.example.com',
          'test-site.co.uk',
          'localhost',
        ];

        validHosts.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).not.toThrow();
        });
      });

      it('should accept host with https protocol and remove it', () => {
        const config = {
          ...validConfiguration,
          host: 'https://example.com',
        };

        expect(() => configurationService.validate(config)).not.toThrow();
      });

      it('should throw error for invalid domain names', () => {
        const invalidHosts = [
          'spaces in domain.com',
          'domain with spaces',
          `aaaaa${String.fromCharCode(0)}bbbbb`,
          `${String.fromCharCode(0)}domain.com`,
        ];

        invalidHosts.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).toThrow(
            '`host` must be a valid domain name',
          );
        });
      });

      it('should throw empty string error for hosts that become empty when trimmed', () => {
        const emptyWhenTrimmedHosts = [
          '\n\n',
          '\t\t',
          '   ',
        ];

        emptyWhenTrimmedHosts.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).toThrow(
            '`host` cannot be an empty string',
          );
        });
      });

      it('should accept some edge case hosts that URL constructor allows', () => {
        const edgeCaseHosts = [
          'invalid..domain',
          '192.168.1.',
          'ftp://invalid.com',
          'http://[::1]:3000/',
          'domain\nwith\nnewlines',
          'domain\twith\ttabs',
          'domain/with/path/../../../etc/passwd',
        ];

        edgeCaseHosts.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).not.toThrow();
        });
      });
    });

    describe('guid validation', () => {
      it('should throw error when guid is undefined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).guid;

        expect(() => configurationService.validate(config)).toThrow(
          '`guid` is not defined in the configuration',
        );
      });

      it('should throw error when guid is null', () => {
        const config = {
          ...validConfiguration,
          guid: null as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`guid` is not defined in the configuration',
        );
      });

      it('should throw error when guid is not a string', () => {
        const config = {
          ...validConfiguration,
          guid: true as unknown as string,
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`guid` must be a string',
        );
      });

      it('should throw error when guid is an empty string', () => {
        const config = {
          ...validConfiguration,
          guid: '',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`guid` cannot be an empty string',
        );
      });

      it('should throw error when guid is only whitespace', () => {
        const config = {
          ...validConfiguration,
          guid: '   ',
        };

        expect(() => configurationService.validate(config)).toThrow(
          '`guid` cannot be an empty string',
        );
      });

      it('should accept valid guid formats', () => {
        const validGuids = [
          'simple-guid',
          'guid-with-numbers-123',
          'UPPERCASE-GUID',
          'MixedCase-Guid-456',
          'guid_with_underscores',
          'very-long-guid-with-many-parts-and-numbers-12345',
        ];

        validGuids.forEach((guid) => {
          const config = {
            ...validConfiguration,
            guid,
          };

          expect(() => configurationService.validate(config)).not.toThrow();
        });
      });
    });

    describe('edge cases', () => {
      it('should throw error for fields with leading/trailing spaces', () => {
        const config: WidgetConfiguration = {
          guid: '  test-guid  ',
          host: '  example.com  ',
          selector: '  #my-widget  ',
        };

        // Should throw because host validation fails with spaces
        expect(() => configurationService.validate(config)).toThrow(
          '`host` must be a valid domain name',
        );
      });

      it('should validate fields that pass the trim check', () => {
        const config: WidgetConfiguration = {
          guid: 'test-guid',
          host: 'example.com',
          selector: '#my-widget',
        };

        expect(() => configurationService.validate(config)).not.toThrow();
      });

      it('should validate all required fields in sequence', () => {
        const config = {
          guid: '',
          host: undefined,
          selector: null,
        } as unknown as WidgetConfiguration;

        // Should throw for the first field it encounters (selector)
        expect(() => configurationService.validate(config)).toThrow(
          '`selector` is not defined in the configuration',
        );
      });
    });

    describe('URL validation', () => {
      it('should accept valid IP addresses as hosts', () => {
        const validIPs = [
          '192.168.1.1',
          '10.0.0.1',
          '127.0.0.1',
        ];

        validIPs.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).not.toThrow();
        });
      });

      it('should accept localhost variants', () => {
        const localhostVariants = [
          'localhost',
          'localhost:3000',
          '127.0.0.1:8080',
          'example.local',
        ];

        localhostVariants.forEach((host) => {
          const config = {
            ...validConfiguration,
            host,
          };

          expect(() => configurationService.validate(config)).not.toThrow();
        });
      });
    });
  });

  describe('validateWidgetOptions', () => {
    it('should end silently when widgetOptions is undefined, null or empty', () => {
      expect(() => configurationService.validateWidgetOptions(undefined)).not.toThrow();
      expect(() => configurationService.validateWidgetOptions(null as unknown as undefined)).not.toThrow();
      expect(() => configurationService.validateWidgetOptions({})).not.toThrow();
    });

    describe('playbackMode validation', () => {
      it('should accept valid playbackMode values', () => {
        expect(() => configurationService.validateWidgetOptions({ playbackMode: 'inline' })).not.toThrow();
        expect(() => configurationService.validateWidgetOptions({ playbackMode: 'inline-autoload' })).not.toThrow();
        expect(() => configurationService.validateWidgetOptions({ playbackMode: 'inline-autoplay' })).not.toThrow();
        expect(() => configurationService.validateWidgetOptions({ playbackMode: 'modal' })).not.toThrow();
      });

      it('should throw error when playbackMode is invalid', () => {
        const invalidValues = ['fullscreen', 'popup', '', 123, true, null, {}];

        invalidValues.forEach((value) => {
          expect(() => configurationService.validateWidgetOptions({ playbackMode: value as unknown as WidgetOptions['playbackMode'] })).toThrow(
            '`widgetOptions.playbackMode` must be either "inline", "inline-autoload", "inline-autoplay" or "modal"',
          );
        });
      });

      it('should allow undefined playbackMode', () => {
        expect(() => configurationService.validateWidgetOptions({ playbackMode: undefined })).not.toThrow();
      });
    });
  });

  describe('setDefaults', () => {
    it('should set default playerOptions when they are undefined', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
      };

      const result = configurationService.setDefaults(initialConfig);

      expect(result.playerOptions).toEqual({});
    });

    it('should set default widgetOptions when they are undefined', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
      };

      const result = configurationService.setDefaults(initialConfig);

      expect(result.widgetOptions).toEqual({
        playbackMode: 'inline',
      });
    });

    it('should not override existing widgetOptions', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
        widgetOptions: {
          playbackMode: 'modal',
        },
      };

      const result = configurationService.setDefaults(initialConfig);

      expect(result.widgetOptions).toEqual({
        playbackMode: 'modal',
      });
    });
  });
});
