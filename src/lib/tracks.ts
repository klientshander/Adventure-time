import { LyricLine, Track, SizeOption } from './types';

export const ISLAND_SONG_LYRICS: LyricLine[] = [
  { time: 0.0, text: "♫ (COME ALONG WITH ME) ♫" },
  { time: 1.57, text: "Come along with me" },
  { time: 5.53, text: "And the butterflies and bees" },
  { time: 9.45, text: "We can wander through the forest" },
  { time: 13.05, text: "And do so as we please" },
  { time: 17.49, text: "Come along with me" },
  { time: 20.94, text: "To a cliff under a tree" },
  { time: 24.96, text: "Where we can gaze upon the water" },
  { time: 28.78, text: "As an everlasting dream" },
  { time: 33.10, text: "All of my collections" },
  { time: 36.78, text: "I'll share them all with you" },
  { time: 40.85, text: "Maybe by next summer" },
  { time: 44.20, text: "We won't have changed our tune" },
  { time: 48.51, text: "We'll still want to be" },
  { time: 52.32, text: "With the butterflies and bees" },
  { time: 56.12, text: "Making up new numbers" },
  { time: 59.83, text: "And living so merrily" },
  { time: 64.14, text: "All of my collections" },
  { time: 67.72, text: "I'll share them all with you" },
  { time: 71.85, text: "I'll be here for you always" },
  { time: 75.53, text: "And always be with you" },
  { time: 79.46, text: "Come along with me" },
  { time: 83.11, text: "And the butterflies and bees" },
  { time: 87.06, text: "We can wander through the forest" },
  { time: 90.82, text: "And do so as we please" },
  { time: 95.39, text: "Living so merrily" },
  { time: 102.00, text: "♫ (OUTRO) ♫" }
];

export const TRACKS: Track[] = [
  {
    title: "Island Song (Come Along with Me)",
    artist: "Ashley Eriksson",
    genre: "ADVENTURE",
    duration: 108,
    icon: 'film_icon',
    audioSrc: "/island_song.mp3",
    altSrc: "/Island Song (Come Along with Me) (feat. Ashley Eriksson).mp3",
    autoStage: 'video'
  },
  {
    title: "Cassette Dreams",
    artist: "Lo-Fi 8-Bit Arpeggio",
    genre: "CHIP-CHILL",
    duration: 135,
    icon: 'cassette',
    bpm: 110,
    scale: [261.63, 329.63, 392.00, 493.88, 523.25, 659.25],
    bassPattern: [130.81, 130.81, 164.81, 196.00],
    arpPattern: [0, 1, 2, 4, 3, 2, 1, 2],
    autoStage: 'cassette'
  },
  {
    title: "Popcat Bop",
    artist: "Playful Pop Chiptune",
    genre: "POPCAT",
    duration: 120,
    icon: 'popcat_closed',
    bpm: 132,
    scale: [329.63, 392.00, 440.00, 523.25, 659.25, 783.99],
    bassPattern: [164.81, 196.00, 164.81, 220.00],
    arpPattern: [0, 2, 3, 5, 4, 3, 1, 2],
    isPopcatTrack: true,
    autoStage: 'popcat'
  },
  {
    title: "Stereo Boombox",
    artist: "Upbeat Arcade Groove",
    genre: "ARCADE",
    duration: 142,
    icon: 'boombox',
    bpm: 128,
    scale: [293.66, 349.23, 440.00, 523.25, 587.33],
    bassPattern: [146.83, 146.83, 174.61, 220.00],
    arpPattern: [0, 2, 3, 4, 3, 2, 0, 1],
    autoStage: 'boombox'
  },
  {
    title: "Quiet Hours",
    artist: "Ambient Headphone Chill",
    genre: "LO-FI",
    duration: 160,
    icon: 'headphones',
    bpm: 96,
    scale: [220.00, 261.63, 329.63, 392.00, 440.00],
    bassPattern: [110.00, 110.00, 130.81, 164.81],
    arpPattern: [0, 1, 3, 2, 4, 3, 1, 2],
    autoStage: 'headphones'
  },
  {
    title: "Spectrum Pulse",
    artist: "Synthwave Frequency",
    genre: "SYNTH",
    duration: 128,
    icon: 'equalizer',
    bpm: 134,
    scale: [246.94, 293.66, 369.99, 440.00, 493.88],
    bassPattern: [123.47, 123.47, 146.83, 185.00],
    arpPattern: [4, 3, 2, 1, 0, 1, 2, 3],
    autoStage: 'equalizer'
  },
  {
    title: "Pixel Waves",
    artist: "Retro Speaker Jam",
    genre: "8-BIT",
    duration: 148,
    icon: 'speaker',
    bpm: 120,
    scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
    bassPattern: [130.81, 164.81, 196.00, 164.81],
    arpPattern: [0, 2, 4, 5, 4, 2, 1, 3]
  },
  {
    title: "Double Melody",
    artist: "Classic Chiptune Fanfare",
    genre: "GAMEBOY",
    duration: 118,
    icon: 'beamed_note',
    bpm: 140,
    scale: [329.63, 392.00, 493.88, 587.33, 659.25],
    bassPattern: [164.81, 164.81, 196.00, 246.94],
    arpPattern: [0, 1, 2, 3, 4, 3, 2, 1]
  },
  {
    title: "Drop / Load Custom Audio",
    artist: "Open any MP3, WAV or OGG",
    genre: "CUSTOM",
    duration: 0,
    icon: 'play_button',
    isCustom: true
  }
];

export const SIZES_MAP: SizeOption[] = [
  { label: 'SIZE: S', width: '350px' },
  { label: 'SIZE: M', width: '420px' },
  { label: 'SIZE: L', width: '490px' }
];

export const BG_LABELS: Record<string, string> = {
  treehouse: 'BG: TREE',
  video: 'BG: VIDEO',
  mint: 'BG: MINT'
};

