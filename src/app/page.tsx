'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Background from '../components/Background';
import TitleBar from '../components/TitleBar';
import StageTabs from '../components/StageTabs';
import HeroStage from '../components/HeroStage';
import PlayerControls from '../components/PlayerControls';
import PlaylistSheet from '../components/PlaylistSheet';
import { TRACKS, SIZES_MAP, ISLAND_SONG_LYRICS } from '../lib/tracks';
import { AudioEngine } from '../lib/audioEngine';
import { BgMode, StageType, LyricLine } from '../lib/types';

export default function AudioExperiencePage() {
  const [sizeIdx, setSizeIdx] = useState(0); // Small (350px) by default
  const [bgMode, setBgMode] = useState<BgMode>('treehouse');
  const [activeStage, setActiveStage] = useState<StageType>('boombox');
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(108);
  const [showLyricsOverlay, setShowLyricsOverlay] = useState(true);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [popCount, setPopCount] = useState(0);
  const [isPopOpen, setIsPopOpen] = useState(false);

  const audioEngineRef = useRef<AudioEngine | null>(null);
  const popTimeoutRef = useRef<any>(null);

  // Trigger Popcat animation + sound
  const handlePopClick = useCallback((withSound = true) => {
    if (!audioEngineRef.current) return;
    if (withSound) {
      audioEngineRef.current.playPopSound();
    }
    setPopCount((prev) => prev + 1);
    setIsPopOpen(true);
    if (popTimeoutRef.current) clearTimeout(popTimeoutRef.current);
    popTimeoutRef.current = setTimeout(() => {
      setIsPopOpen(false);
    }, 120);
  }, []);

  // Compute current lyric line
  const getCurrentLyric = (): LyricLine | null => {
    if (currentTrackIdx !== 0) return null;
    let found = ISLAND_SONG_LYRICS[0];
    for (let i = 0; i < ISLAND_SONG_LYRICS.length; i++) {
      if (currentTime >= ISLAND_SONG_LYRICS[i].time) {
        found = ISLAND_SONG_LYRICS[i];
      } else {
        break;
      }
    }
    return found;
  };

  // Switch Track relative
  const handleGoRelative = useCallback(
    (delta: number) => {
      let nextIdx: number;
      if (isShuffle) {
        nextIdx = Math.floor(Math.random() * TRACKS.length);
      } else {
        nextIdx = (currentTrackIdx + delta + TRACKS.length) % TRACKS.length;
      }
      handleSelectTrack(nextIdx, true);
    },
    [currentTrackIdx, isShuffle]
  );

  // Initialize AudioEngine
  useEffect(() => {
    const engine = new AudioEngine();
    audioEngineRef.current = engine;

    engine.setCallbacks(
      (cur, dur) => {
        setCurrentTime(cur);
        setDuration(dur);
      },
      () => {
        if (isRepeat) {
          engine.seek(0);
          engine.play();
        } else {
          handleGoRelative(1);
        }
      },
      () => {
        // Popcat beat sync
        handlePopClick(false);
      }
    );

    // Initial load
    engine.loadTrack(TRACKS[0], false);

    return () => {
      engine.destroy();
    };
  }, [handleGoRelative, handlePopClick, isRepeat]);

  // Select Track handler
  const handleSelectTrack = (idx: number, autoPlay = true) => {
    setCurrentTrackIdx(idx);
    const track = TRACKS[idx];
    setCurrentTime(0);
    setDuration(track.duration || 120);

    if (track.autoStage) {
      setActiveStage(track.autoStage as StageType);
    }

    if (audioEngineRef.current) {
      audioEngineRef.current.loadTrack(track, autoPlay);
      setIsPlaying(autoPlay);
    }
  };

  // Play / Pause
  const handleTogglePlay = () => {
    if (!audioEngineRef.current) return;
    if (isPlaying) {
      audioEngineRef.current.pause();
      setIsPlaying(false);
    } else {
      audioEngineRef.current.play();
      setIsPlaying(true);
    }
  };

  // Seek
  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioEngineRef.current) {
      audioEngineRef.current.seek(seconds);
    }
  };

  // Volume
  const handleChangeVolume = (val: number) => {
    setVolume(val);
    setIsMuted(false);
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(val);
    }
  };

  const handleToggleMute = () => {
    if (audioEngineRef.current) {
      const muted = audioEngineRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  // Custom File Loader
  const handleLoadCustomFile = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const customTrack = TRACKS[TRACKS.length - 1];
    customTrack.title = file.name.replace(/\.[^/.]+$/, '');
    customTrack.artist = 'Local Audio File';
    customTrack.duration = 0;

    if (audioEngineRef.current) {
      audioEngineRef.current.setCustomAudioUrl(fileUrl);
    }
    handleSelectTrack(TRACKS.length - 1, true);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleGoRelative(1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleGoRelative(-1);
      } else if (e.key === 's' || e.key === 'S') {
        setIsShuffle((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        setIsRepeat((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const currentTrack = TRACKS[currentTrackIdx];
  const currentSize = SIZES_MAP[sizeIdx];

  const handleToggleBg = () => {
    const modes: BgMode[] = ['treehouse', 'video', 'mint'];
    const nextIdx = (modes.indexOf(bgMode) + 1) % modes.length;
    setBgMode(modes[nextIdx]);
  };

  return (
    <>
      <Background mode={bgMode} />

      <div className="app" style={{ maxWidth: currentSize.width }}>
        <TitleBar
          currentSize={currentSize}
          onToggleSize={() => setSizeIdx((sizeIdx + 1) % SIZES_MAP.length)}
          bgMode={bgMode}
          onToggleBg={handleToggleBg}
          onOpenSheet={() => setIsSheetModalOpen(true)}
        />

        <div className="player">
          <StageTabs
            activeStage={activeStage}
            onSelectStage={(stage) => setActiveStage(stage)}
          />

          <HeroStage
            activeStage={activeStage}
            isPlaying={isPlaying}
            popCount={popCount}
            isPopOpen={isPopOpen}
            onPopClick={() => handlePopClick(true)}
            currentLyric={getCurrentLyric()}
            showLyricsOverlay={showLyricsOverlay}
          />

          <PlayerControls
            track={currentTrack}
            isPlaying={isPlaying}
            isShuffle={isShuffle}
            isRepeat={isRepeat}
            isMuted={isMuted}
            volume={volume}
            currentTime={currentTime}
            duration={duration}
            showLyricsOverlay={showLyricsOverlay}
            onTogglePlay={handleTogglePlay}
            onPrev={() => handleGoRelative(-1)}
            onNext={() => handleGoRelative(1)}
            onToggleShuffle={() => setIsShuffle(!isShuffle)}
            onToggleRepeat={() => setIsRepeat(!isRepeat)}
            onToggleMute={handleToggleMute}
            onChangeVolume={handleChangeVolume}
            onSeek={handleSeek}
            onToggleLyrics={() => setShowLyricsOverlay(!showLyricsOverlay)}
          />

          <PlaylistSheet
            currentTrackIdx={currentTrackIdx}
            onSelectTrack={(i) => handleSelectTrack(i, true)}
            onLoadCustomFile={handleLoadCustomFile}
            isSheetModalOpen={isSheetModalOpen}
            onCloseSheetModal={() => setIsSheetModalOpen(false)}
          />
        </div>

        <p className="hint">Adventure Time • Big Pixel Lyrics • Ashley Eriksson</p>
      </div>
    </>
  );
}

