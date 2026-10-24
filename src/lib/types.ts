export type StageType = 'boombox' | 'cassette' | 'headphones' | 'equalizer' | 'popcat' | 'video';

export type BgMode = 'treehouse' | 'video' | 'mint';

export interface LyricLine {
  time: number;
  text: string;
}

export interface Track {
  title: string;
  artist: string;
  genre: string;
  duration: number;
  icon: string;
  audioSrc?: string;
  altSrc?: string;
  autoStage?: string;
  bpm?: number;
  scale?: number[];
  bassPattern?: number[];
  arpPattern?: number[];
  isPopcatTrack?: boolean;
  isCustom?: boolean;
}

export interface SizeOption {
  label: string;
  width: string;
}

