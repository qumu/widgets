import {
  boolean,
  custom,
  literal,
  number,
  object,
  optional,
  partial,
  string,
  union,
} from 'valibot';

// Recursive schema using a custom validator
const recursiveRecordSchema = custom((val) => {
  const isRecursive = (obj: unknown): boolean => {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    return Object.values(obj).every(
      (v) => typeof v === 'string' || (typeof v === 'object' && v !== null && isRecursive(v)),
    );
  };

  return isRecursive(val);
});

// --- PlayerParameters schema ---
const playerParametersSchema = object({
  captions: string(),
  debug: boolean(),
  loop: boolean(),
  playerConfigurationGuid: string(),
  pv: union([literal('pipls'), literal('pipss'), literal('sbs')]),
  quality: union([
    literal('auto'),
    literal('best'),
    literal('1440p'),
    literal('1080p'),
    literal('720p'),
    literal('480p'),
    literal('240p'),
  ]),
  reporting: boolean(),
  reportingId: string(),
  showControlPanel: boolean(),
  sidebar: boolean(),
  speech: string(),
  speechTerm: string(),
  start: number(),
  volume: number(),
});

// --- PlayIcon schema (partial) ---
const playIconSchema = partial(
  object({
    height: optional(number(), 44),
    position: optional(union([
      literal('top-left'),
      literal('top'),
      literal('top-right'),
      literal('left'),
      literal('center'),
      literal('right'),
      literal('bottom-left'),
      literal('bottom'),
      literal('bottom-right'),
    ]), 'center'),
    width: optional(number(), 44),
  }),
);

// --- WidgetOptions schema ---
const widgetOptionsSchema = partial(
  object({
    onIframeLoad: optional(custom((val) => typeof val === 'function', 'onIframeLoad must be a function')),
    onThumbnailClick: optional(
      custom((val) => typeof val === 'function', 'onThumbnailClick must be a function'),
    ),
    playbackMode: union([
      literal('inline'),
      literal('inline-autoload'),
      literal('inline-autoplay'),
      literal('modal'),
    ]),
    playIcon: playIconSchema,
  }),
);

// --- WidgetConfiguration schema ---
export const widgetConfigurationSchema = object({
  guid: string(),
  host: string(),
  locales: optional(recursiveRecordSchema),
  playerParameters: optional(partial(playerParametersSchema), {}),
  selector: union([
    string(),
    custom((val) => val instanceof HTMLElement, 'selector must be a string or HTMLElement'),
  ]),
  sortBy: optional(string()),
  sortOrder: optional(union([literal('ASCENDING'), literal('DESCENDING')])),
  widgetOptions: optional(partial(widgetOptionsSchema), {}),
});
