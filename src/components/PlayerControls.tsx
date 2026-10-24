'use client';

import React from 'react';
import { SPRITES, SIZES } from '../lib/sprites';
import { Track } from '../lib/types';

interface PlayerControlsProps {
  track: Track;
  isPlaying: boolean;
  isShuffle: boolean;
  isRepeat: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  showLyricsOverlay: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onToggleMute: () => void;
  onChangeVolume: (val: number) => void;
  onSeek: (seconds: number) => void;
  onToggleLyrics: () => void;
}

function fmtTime(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function PlayerControls({
  track,
  isPlaying,
  isShuffle,
  isRepeat,
  isMuted,
  volume,
  currentTime,
  duration,
  showLyricsOverlay,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
  onToggleMute,
  onChangeVolume,
  onSeek,
  onToggleLyrics,
}: PlayerControlsProps) {
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const playSpriteKey = isPlaying ? 'pause_button' : 'play_button';
  const playSize = SIZES[playSpriteKey];

  const speakerSpriteKey = isMuted || volume === 0 ? 'speaker_mute' : 'speaker';
  const speakerSize = SIZES[speakerSpriteKey];

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <>
      {/* Track Information Display */}
      <div className="track-info">
        <div className="track-title" id="trackTitle">
          {track.title}
        </div>
        <div className="track-meta">
          <span id="trackArtist">{track.artist}</span>
          <span className="track-chip" id="trackMode">
            {track.genre}
          </span>
          <button
            className={`sheet-toggle-btn ${showLyricsOverlay ? 'active' : ''}`}
            id="lyricsToggleBtn"
            style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '0.38rem' }}
            title="Toggle Big Pixel Lyrics Overlay"
            onClick={onToggleLyrics}
          >
            {showLyricsOverlay ? 'LYRICS: ON' : 'LYRICS: OFF'}
          </button>
        </div>
      </div>

      {/* Seekbar & Timestamps */}
      <div className="progress-row">
        <span className="time-label" id="timeCurrent">
          {fmtTime(currentTime)}
        </span>
        <div
          className="bar-track"
          id="seekBar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          onClick={handleSeekClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="bar-fill" id="seekFill" style={{ width: `${pct}%` }} />
        </div>
        <span className="time-label" id="timeTotal">
          {duration > 0 ? fmtTime(duration) : '--:--'}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="controls">
        <button
          className={`btn btn-secondary ${isShuffle ? 'active' : ''}`}
          id="shuffleBtn"
          title="Shuffle (S)"
          aria-label="Shuffle"
          aria-pressed={isShuffle}
          onClick={onToggleShuffle}
        >
          <svg viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M2 4h3l3 4h1l-3-4h3l4 5-4 5h-3l3-4h-1l-3 4H2v-2h2l4-5-4-5H2V4zm11 0h3l4 5-4 5h-3l3-4h-4v-2h4L13 4z"
            />
          </svg>
        </button>

        <button
          className="btn btn-secondary"
          id="prevBtn"
          title="Previous Track (Left Arrow)"
          aria-label="Previous Track"
          onClick={onPrev}
        >
          <svg viewBox="0 0 20 20">
            <rect x="3" y="3" width="3" height="14" fill="currentColor" />
            <path fill="currentColor" d="M17 3 7 10l10 7z" />
          </svg>
        </button>

        {/* 3D Pixel Play / Pause button */}
        <button
          className="btn-play-wrap"
          id="playBtn"
          title="Play / Pause (Space)"
          aria-label="Play or Pause"
          aria-pressed={isPlaying}
          onClick={onTogglePlay}
        >
          <span
            id="playIcon"
            dangerouslySetInnerHTML={{
              __html: `<svg viewBox="0 0 ${playSize.w} ${playSize.h}">${SPRITES[playSpriteKey]}</svg>`,
            }}
          />
        </button>

        <button
          className="btn btn-secondary"
          id="nextBtn"
          title="Next Track (Right Arrow)"
          aria-label="Next Track"
          onClick={onNext}
        >
          <svg viewBox="0 0 20 20">
            <rect x="14" y="3" width="3" height="14" fill="currentColor" />
            <path fill="currentColor" d="m3 3 10 7-10 7z" />
          </svg>
        </button>

        <button
          className={`btn btn-secondary ${isRepeat ? 'active' : ''}`}
          id="repeatBtn"
          title="Repeat Track (R)"
          aria-label="Repeat Track"
          aria-pressed={isRepeat}
          onClick={onToggleRepeat}
        >
          <svg viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M7 4h10v6h-2V6H7V4zm6 12H3v-6h2v4h8v2zm-2-10 4-3v6l-4-3zm-2 10-4 3v-6l4 3z"
            />
          </svg>
        </button>
      </div>

      {/* Volume Control */}
      <div className="volume-wrap">
        <button
          className="vol-btn"
          id="muteBtn"
          title="Mute / Unmute (M)"
          aria-label="Mute or Unmute"
          onClick={onToggleMute}
        >
          <span
            id="speakerIcon"
            dangerouslySetInnerHTML={{
              __html: `<svg viewBox="0 0 ${speakerSize.w} ${speakerSize.h}">${SPRITES[speakerSpriteKey]}</svg>`,
            }}
          />
        </button>
        <input
          type="range"
          className="vol-slider"
          id="volumeSlider"
          min="0"
          max="100"
          value={isMuted ? 0 : Math.round(volume * 100)}
          aria-label="Volume Slider"
          onChange={(e) => onChangeVolume(Number(e.target.value) / 100)}
        />
      </div>
    </>
  );
}

