export type RoastStyle = 'brutal' | 'elegant' | 'standup' | 'chill' | 'random';

export type ScoreLevel = 'archived' | 'rescatable' | 'prometedor' | 'contratame';

export interface ScoreInfo {
  emoji: string;
  label: string;
  level: ScoreLevel;
}

export interface PunchCard {
  critique: string;
  before: string;
  after: string;
}

export interface Cliche {
  word: string;
  context: string;
}

export interface RoastResult {
  veredicto: string;
  score: ScoreInfo;
  strengths?: string[];
  priorities?: string[];
  roastCards: PunchCard[];
  cliches: Cliche[];
  aiDetected: boolean;
  aiCard?: PunchCard;
  language: string;
  resolvedStyle?: string;
}

export const SCORE_LEVELS: { level: ScoreLevel; emoji: string; label: string }[] = [
  { level: 'archived', emoji: '💀', label: 'Archived' },
  { level: 'rescatable', emoji: '🩹', label: 'Salvageable' },
  { level: 'prometedor', emoji: '😏', label: 'Promising' },
  { level: 'contratame', emoji: '🔥', label: 'Hire Me' },
];

export const ROAST_STYLES: {
  id: RoastStyle;
  emoji: string;
  name: string;
  description: string;
}[] = [
  {
    id: 'brutal',
    emoji: '🔪',
    name: 'Brutal & Unfiltered',
    description: 'No anesthesia, the truth hurts',
  },
  {
    id: 'elegant',
    emoji: '🥂',
    name: 'Sarcastic Elegant',
    description: 'Destroys you with class and vocabulary',
  },
  {
    id: 'standup',
    emoji: '🎤',
    name: 'Stand-up Roast',
    description: "You're the involuntary star of a comedy show",
  },
  {
    id: 'chill',
    emoji: '🤗',
    name: 'Chill but Deadly',
    description: 'Friendly tone, deadly punches',
  },
  {
    id: 'random',
    emoji: '🎲',
    name: 'Random',
    description: 'Surprise me, pick any style',
  },
];

export const LOADING_MESSAGES: Record<RoastStyle, string[]> = {
  brutal: [
    'Counting how many times you said "passionate about"...',
    'Looking for metrics that clearly don\'t exist...',
    'Preparing the truth nobody ever told you...',
    'Calculating the damage level caused by "Microsoft Office"...',
    'Sharpening the scalpel for your CV...',
    'Auditing every cliché with surgical precision...',
  ],
  elegant: [
    'Uncorking the champagne of professional failure...',
    'Selecting the precise words for your refined humiliation...',
    'Consulting the thesaurus of "mediocre"...',
    'Preparing a critique worthy of The New Yorker...',
    'Dressing the truth in a tuxedo and white gloves...',
  ],
  standup: [
    'Writing the monologue of your professional tragedy...',
    'Preparing the most painful stand-up set of your life...',
    'Finding the joke in "results-oriented team player"...',
    'Adjusting the mic to roast you with humor...',
    'Testing the material on the most brutal audience...',
  ],
  chill: [
    'Taking a deep breath before telling you the truth...',
    'Brewing tea while reading your CV...',
    'Looking for something positive to say (this may take a while)...',
    'Being kind while gently destroying you...',
    'Choosing words carefully (with love)...',
  ],
  random: [
    'Rolling the dice on your professional destiny...',
    'Choosing the weapon of choice...',
    'The wheel of professional shame is spinning...',
    'Consulting the oracle of the roast...',
    'Preparing the surprise...',
  ],
};
