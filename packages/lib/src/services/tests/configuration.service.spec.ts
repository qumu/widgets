import { afterEach, beforeEach, describe, expect, it, Mock, vitest } from 'vitest';
import { ConfigurationService } from '../configuration.service';
import { WidgetConfiguration } from '@/interfaces/widget-configuration';
import { WidgetOptions } from '@/interfaces/widget-options';
import { PlayerParameters } from '@/interfaces/player-parameters';

describe('ConfigurationService', () => {
  const configurationService: ConfigurationService = new ConfigurationService();

  let consoleWarnSpy: Mock;

  beforeEach(() => {
    consoleWarnSpy = vitest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('createConfiguration', () => {
    const validConfiguration = {
      guid: 'test-guid-123',
      host: 'example.com',
      selector: '#my-widget',
    } as unknown as WidgetConfiguration;

    it('should end silently when no errors occur', () => {
      expect(() => configurationService.createConfiguration(validConfiguration)).not.toThrow();
    });

    it('should throw error when configuration is not an object', () => {
      expect(() => configurationService.createConfiguration(null as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );

      expect(() => configurationService.createConfiguration(42 as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );

      expect(() => configurationService.createConfiguration('invalid' as unknown as WidgetConfiguration)).toThrow(
        'Configuration must be a valid object',
      );
    });

    it('should warn for unsupported fields in configuration', () => {
      const configWithExtraField = {
        ...validConfiguration,
        extraField: 'not-supported',
      } as unknown as WidgetConfiguration;

      expect(() => configurationService.createConfiguration(configWithExtraField)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported field `extraField` in configuration');
    });

    it('should throw error for unsupported fields in widgetOptions', () => {
      const configWithExtraField = {
        ...validConfiguration,
        widgetOptions: {
          extraField: 'not-supported',
        },
      } as unknown as WidgetConfiguration;

      expect(() => configurationService.createConfiguration(configWithExtraField)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported field `widgetOptions.extraField` in configuration');
    });

    it('should not mutate the input configuration object', () => {
      const inputConfig = {
        guid: 'test-guid-123',
        host: 'example.com',
        selector: '#my-widget',
        unsupportedField: 'not-supported',
        widgetOptions: {
          playbackMode: 'inline',
          playIcon: {
            position: 'center',
            unsupportedField: 'not-supported',
            url: 'https://example.com/play-icon.png',
          },
          unsupportedField: 'not-supported',
        },
      } as unknown as WidgetConfiguration;

      const inputConfigCopy = JSON.parse(JSON.stringify(inputConfig)) as unknown as WidgetConfiguration;

      configurationService.createConfiguration(inputConfig);

      expect(inputConfig).toEqual(inputConfigCopy);
    });

    describe('selector validation', () => {
      it('should throw error when selector is not defined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).selector;

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` is not defined in the configuration',
        );
      });

      it('should throw error when selector is null', () => {
        const config = {
          ...validConfiguration,
          selector: null as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` is undefined or null',
        );
      });

      it('should throw error when selector is not a string or an instance of HTMLElement', () => {
        const config = {
          ...validConfiguration,
          selector: 123 as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` must be a string or an instance of HTMLElement',
        );
      });

      it('should throw error when selector is an empty string', () => {
        const config = {
          ...validConfiguration,
          selector: '',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` cannot be an empty string',
        );
      });

      it('should throw error when selector is only whitespace', () => {
        const config = {
          ...validConfiguration,
          selector: '   ',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` cannot be an empty string',
        );
      });
    });

    describe('host validation', () => {
      it('should throw error when host is not defined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).host;

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`host` is not defined in the configuration',
        );
      });

      it('should throw error when host is null', () => {
        const config = {
          ...validConfiguration,
          host: null as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`host` is undefined or null',
        );
      });

      it('should throw error when host is not a string', () => {
        const config = {
          ...validConfiguration,
          host: 42 as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`host` must be a string',
        );
      });

      it('should throw error when host is an empty string', () => {
        const config = {
          ...validConfiguration,
          host: '',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`host` cannot be an empty string',
        );
      });

      it('should throw error when host is only whitespace', () => {
        const config = {
          ...validConfiguration,
          host: '   ',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
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

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
        });
      });

      it('should accept host with https protocol and remove it', () => {
        const config = {
          ...validConfiguration,
          host: 'https://example.com',
        };

        expect(() => configurationService.createConfiguration(config)).not.toThrow();
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

          expect(() => configurationService.createConfiguration(config)).toThrow(
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

          expect(() => configurationService.createConfiguration(config)).toThrow(
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

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
        });
      });
    });

    describe('guid validation', () => {
      it('should throw error when guid is not defined', () => {
        const config = { ...validConfiguration };

        delete (config as Record<string, unknown>).guid;

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`guid` is not defined in the configuration',
        );
      });

      it('should throw error when guid is null', () => {
        const config = {
          ...validConfiguration,
          guid: null as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`guid` is undefined or null',
        );
      });

      it('should throw error when guid is not a string', () => {
        const config = {
          ...validConfiguration,
          guid: true as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`guid` must be a string',
        );
      });

      it('should throw error when guid is an empty string', () => {
        const config = {
          ...validConfiguration,
          guid: '',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`guid` cannot be an empty string',
        );
      });

      it('should throw error when guid is only whitespace', () => {
        const config = {
          ...validConfiguration,
          guid: '   ',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
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

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
        });
      });
    });

    describe('sortOrder validation', () => {
      it('should throw error when sortOrder has invalid value', () => {
        const invalidSortOrders = ['UP', 'DOWN', 'ascending', 'descending', 'asc', 'desc', '', 123, true, null, {}];

        invalidSortOrders.forEach((sortOrder) => {
          const config = {
            ...validConfiguration,
            sortOrder: sortOrder as unknown as 'ASCENDING' | 'DESCENDING',
          };

          expect(() => configurationService.createConfiguration(config)).toThrow(
            '`sortOrder` must be either "ASCENDING" or "DESCENDING"',
          );
        });
      });

      it('should accept valid sortOrder values', () => {
        const validSortOrders = ['ASCENDING', 'DESCENDING'];

        validSortOrders.forEach((sortOrder) => {
          const config = {
            ...validConfiguration,
            sortOrder: sortOrder as 'ASCENDING' | 'DESCENDING',
          };

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
        });
      });
    });

    describe('sortBy validation', () => {
      it('should throw error when sortBy is not a string', () => {
        const config = {
          ...validConfiguration,
          sortBy: 123 as unknown as string,
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`sortBy` must be a string',
        );
      });

      it('should throw error when sortBy is an empty string', () => {
        const config = {
          ...validConfiguration,
          sortBy: '',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`sortBy` cannot be an empty string',
        );
      });

      it('should throw error when sortBy is only whitespace', () => {
        const config = {
          ...validConfiguration,
          sortBy: '   ',
        };

        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`sortBy` cannot be an empty string',
        );
      });
    });

    describe('edge cases', () => {
      it('should throw error for fields with leading/trailing spaces', () => {
        const config = {
          guid: '  test-guid  ',
          host: '  example.com  ',
          selector: '  #my-widget  ',
        } as unknown as WidgetConfiguration;

        // Should throw because host validation fails with spaces
        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`host` must be a valid domain name',
        );
      });

      it('should validate fields that pass the trim check', () => {
        const config = {
          guid: 'test-guid',
          host: 'example.com',
          selector: '#my-widget',
        } as unknown as WidgetConfiguration;

        expect(() => configurationService.createConfiguration(config)).not.toThrow();
      });

      it('should validate all required fields in sequence', () => {
        const config = {
          guid: '',
          host: undefined,
          selector: null,
        } as unknown as WidgetConfiguration;

        // Should throw for the first field it encounters (selector)
        expect(() => configurationService.createConfiguration(config)).toThrow(
          '`selector` is undefined or null',
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

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
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

          expect(() => configurationService.createConfiguration(config)).not.toThrow();
        });
      });
    });
  });

  describe('createConfiguration', () => {
    it('should end silently when playerParameters is undefined, null or empty', () => {
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        playerParameters: undefined,
        selector: '#widget',
      })).not.toThrow();
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        playerParameters: null as unknown as PlayerParameters,
        selector: '#widget',
      })).not.toThrow();
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        playerParameters: {},
        selector: '#widget',
      })).not.toThrow();
    });

    it('should warn for unsupported fields in playerParameters', () => {
      const configuration = {
        guid: 'foo',
        host: 'example.com',
        playerParameters: {
          extraField: 'not-supported',
        },
        selector: '#widget',
      } as unknown as WidgetConfiguration;

      expect(() => configurationService.createConfiguration(configuration)).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Unsupported field `playerParameters.extraField` in configuration');
    });

    it('should throw error when pv has an invalid value', () => {
      const invalidPVs = ['invalid', 'PIPLS', '', 123, true, null, {}];

      invalidPVs.forEach((pv) => {
        const configuration = {
          guid: 'foo',
          host: 'example.com',
          playerParameters: {
            pv: pv as unknown as PlayerParameters['pv'],
          },
          selector: '#widget',
        };

        expect(() => configurationService.createConfiguration(configuration)).toThrow(
          '`playerParameters.pv` must be either "pipls", "pipss" or "sbs"',
        );
      });
    });

    it('should accept valid pv values', () => {
      const validPVs = ['pipls', 'pipss', 'sbs'];

      validPVs.forEach((pv) => {
        const configuration = {
          guid: 'foo',
          host: 'example.com',
          playerParameters: {
            pv: pv as PlayerParameters['pv'],
          },
          selector: '#widget',
        };

        expect(() => configurationService.createConfiguration(configuration)).not.toThrow();
      });
    });

    it('should throw an error when quality has invalid value', () => {
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        playerParameters: {
          quality: 'high' as PlayerParameters['quality'],
        },
        selector: '#widget',
      })).toThrow(
        '`playerParameters.quality` must be either "240p", "480p", "720p", "1080p", "1440p", "auto" or "best"',
      );
    });

    it('should accept valid quality values', () => {
      const validQualities = ['240p', '480p', '720p', '1080p', '1440p', 'auto', 'best'];

      validQualities.forEach((quality) => {
        const configuration = {
          guid: 'foo',
          host: 'example.com',
          playerParameters: {
            quality: quality as PlayerParameters['quality'],
          },
          selector: '#widget',
        };

        expect(() => configurationService.createConfiguration(configuration)).not.toThrow();
      });
    });
  });

  describe('createConfiguration', () => {
    it('should end silently when widgetOptions is undefined, null or empty', () => {
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        selector: '#widget',
        widgetOptions: undefined,
      })).not.toThrow();
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        selector: '#widget',
        widgetOptions: null as unknown as WidgetOptions,
      })).not.toThrow();
      expect(() => configurationService.createConfiguration({
        guid: 'foo',
        host: 'example.com',
        selector: '#widget',
        widgetOptions: {},
      })).not.toThrow();
    });

    describe('playbackMode validation', () => {
      it('should accept valid playbackMode values', () => {
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playbackMode: 'inline',
          },
        })).not.toThrow();
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playbackMode: 'inline-autoload',
          },
        })).not.toThrow();
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playbackMode: 'inline-autoplay',
          },
        })).not.toThrow();
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playbackMode: 'modal',
          },
        })).not.toThrow();
      });

      it('should throw error when playbackMode is invalid', () => {
        const invalidValues = ['fullscreen', 'popup', '', 123, true, null, {}];

        invalidValues.forEach((value) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              playbackMode: value as unknown as WidgetOptions['playbackMode'],
            },
          })).toThrow(
            '`widgetOptions.playbackMode` must be either "inline", "inline-autoload", "inline-autoplay" or "modal"',
          );
        });
      });

      it('should allow undefined playbackMode', () => {
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playbackMode: undefined,
          },
        })).not.toThrow();
      });
    });

    describe('position validation', () => {
      it('should accept valid playIcon.position values', () => {
        const validPositions = [
          'center',
          'top',
          'top-right',
          'right',
          'bottom-right',
          'bottom',
          'bottom-left',
          'left',
          'top-left',
        ];

        validPositions.forEach((position) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              playIcon: {
                position: position as WidgetOptions['playIcon']['position'],
              },
            },
          })).not.toThrow();
        });
      });

      it('should allow undefined playIcon.position', () => {
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            playIcon: {},
          },
        })).not.toThrow();
      });

      it('should throw error when playIcon.position is invalid', () => {
        const invalidPositions = ['middle', 'upper-left', 'bottom-center', '', 123, true, null, {}];

        invalidPositions.forEach((position) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              playIcon: {
                position: position as WidgetOptions['playIcon']['position'],
              },
            },
          })).toThrow(
            '`widgetOptions.playIcon.position` must be a valid position value',
          );
        });
      });
    });

    describe('playIcon validation', () => {
      it('should warn when playIcon is used with unsupported playbackMode', () => {
        const unsupportedModes = ['inline-autoload', 'inline-autoplay', undefined];

        unsupportedModes.forEach((mode) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              playbackMode: mode as WidgetOptions['playbackMode'],
              playIcon: {
                url: 'https://example.com/play-icon.png',
              },
            },
          })).not.toThrow();

          expect(consoleWarnSpy)
            .toHaveBeenCalledWith('`widgetOptions.playIcon` is only applicable when `widgetOptions.playbackMode` is either "modal" or "inline"');
        });
      });

      it('should not warn when playIcon is used with supported playbackMode', () => {
        const supportedModes = ['modal', 'inline'];

        supportedModes.forEach((mode) => {
          consoleWarnSpy.mockClear();

          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              playbackMode: mode as WidgetOptions['playbackMode'],
              playIcon: { url: 'https://example.com/play-icon.png' },
            },
          })).not.toThrow();

          expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('onIframeLoad validation', () => {
      it('should throw error when onIframeLoad is not a function', () => {
        const invalidValues = ['', 123, true, null, {}];

        invalidValues.forEach((value) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              onIframeLoad: value as unknown as WidgetOptions['onIframeLoad'],
              playbackMode: 'modal',
            },
          })).toThrow(
            '`widgetOptions.onIframeLoad` must be a function',
          );
        });
      });

      it('should allow onIframeLoad to be a function', () => {
        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            onIframeLoad: () => {},
            playbackMode: 'modal',
          },
        })).not.toThrow();
      });
    });

    describe('onThumbnailClick validation', () => {
      it('should throw error when onThumbnailClick is not a function', () => {
        const invalidValues = ['', 123, true, null, {}];

        invalidValues.forEach((value) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              onThumbnailClick: value as WidgetOptions['onThumbnailClick'],
              playbackMode: 'inline',
            },
          })).toThrow(
            '`widgetOptions.onThumbnailClick` must be a function',
          );
        });
      });

      it('should warn when onThumbnailClick is used with unsupported playbackMode', () => {
        const unsupportedModes = ['inline-autoload', 'inline-autoplay', 'modal', undefined];

        unsupportedModes.forEach((mode) => {
          expect(() => configurationService.createConfiguration({
            guid: 'foo',
            host: 'example.com',
            selector: '#widget',
            widgetOptions: {
              onThumbnailClick: () => {},
              playbackMode: mode as WidgetOptions['playbackMode'],
            },
          })).not.toThrow();

          expect(consoleWarnSpy)
            .toHaveBeenCalledWith('`widgetOptions.onThumbnailClick` is only applicable when `widgetOptions.playbackMode` is "inline"');
        });
      });

      it('should not warn when onThumbnailClick is used with supported playbackMode', () => {
        consoleWarnSpy.mockClear();

        expect(() => configurationService.createConfiguration({
          guid: 'foo',
          host: 'example.com',
          selector: '#widget',
          widgetOptions: {
            onThumbnailClick: () => {},
            playbackMode: 'inline',
          },
        })).not.toThrow();

        expect(consoleWarnSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('createConfiguration', () => {
    it('should set default playerParameters when they are undefined', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
      };

      const result = configurationService.createConfiguration(initialConfig);

      expect(result.playerParameters).toEqual({});
    });

    it('should set default widgetOptions when they are undefined', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
      };

      const result = configurationService.createConfiguration(initialConfig);

      expect(result.widgetOptions).toEqual({
        playbackMode: 'inline',
        playIcon: {
          height: 44,
          position: 'center',
          width: 44,
        },
      });
    });

    it('should not override existing widgetOptions', () => {
      const initialConfig: WidgetConfiguration = {
        guid: 'test-guid',
        host: 'example.com',
        selector: '#widget',
        widgetOptions: {
          playbackMode: 'modal',
          playerConfigurationGuid: 'custom-guid',
          playIcon: {
            height: 100,
            position: 'top-right',
            url: 'https://qumu.com/play-button.png',
            width: 100,
          },
        },
      };

      const initialWidgetOptions = JSON.parse(JSON.stringify(initialConfig.widgetOptions)) as unknown as WidgetOptions;

      const result = configurationService.createConfiguration(initialConfig);

      expect(result.widgetOptions).toEqual(initialWidgetOptions);
    });
  });
});
