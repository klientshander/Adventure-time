'use client';

import React, { useRef, useEffect } from 'react';
import { SPRITES, SIZES } from '../lib/sprites';
import { StageType, LyricLine } from '../lib/types';

interface HeroStageProps {
  activeStage: StageType;
  isPlaying: boolean;
  popCount: number;
  isPopOpen: boolean;
  onPopClick: () => void;
  currentLyric: LyricLine | null;
  showLyricsOverlay: boolean;
}

export default function HeroStage({
  activeStage,
  isPlaying,
  popCount,
  isPopOpen,
  onPopClick,
  currentLyric,
  showLyricsOverlay,
}: HeroStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activeStage === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [activeStage]);

  return (
    <div className={`art-wrap ${isPlaying ? 'is-playing' : ''}`} id="artWrap">
      <div className="art-stage" id="heroCanvas">
        {activeStage === 'boombox' && (
          <svg
            className="boombox-hero"
            viewBox={`0 0 ${SIZES.boombox.w} ${SIZES.boombox.h}`}
            dangerouslySetInnerHTML={{ __html: SPRITES.boombox }}
          />
        )}

        {activeStage === 'cassette' && (
          <svg
            className="cassette-hero"
            viewBox={`0 0 ${SIZES.cassette.w} ${SIZES.cassette.h}`}
            dangerouslySetInnerHTML={{ __html: SPRITES.cassette }}
          />
        )}

        {activeStage === 'headphones' && (
          <svg
            className="headphones-hero"
            viewBox={`0 0 ${SIZES.headphones.w} ${SIZES.headphones.h}`}
            dangerouslySetInnerHTML={{ __html: SPRITES.headphones }}
          />
        )}

        {activeStage === 'equalizer' && (
          <svg
            className="equalizer-hero"
            id="eqHeroSvg"
            viewBox={`0 0 ${SIZES.equalizer.w} ${SIZES.equalizer.h}`}
            dangerouslySetInnerHTML={{ __html: SPRITES.equalizer }}
          />
        )}

        {activeStage === 'popcat' && (
          <div
            className="popcat-hero-wrap"
            id="popcatHero"
            title="Click to POP!"
            onClick={onPopClick}
          >
            <div className="pop-hint-badge" id="popBadge">
              POPS: {popCount}
            </div>
            {!isPopOpen ? (
              <svg
                className="popcat-frame"
                id="popcatClosedSvg"
                viewBox={`0 0 ${SIZES.popcat_closed.w} ${SIZES.popcat_closed.h}`}
                dangerouslySetInnerHTML={{ __html: SPRITES.popcat_closed }}
              />
            ) : (
              <svg
                className="popcat-frame"
                id="popcatOpenSvg"
                viewBox={`0 0 ${SIZES.popcat_open.w} ${SIZES.popcat_open.h}`}
                dangerouslySetInnerHTML={{ __html: SPRITES.popcat_open }}
              />
            )}
          </div>
        )}

        {activeStage === 'video' && (
          <div className="hero-video-wrap">
            <video
              ref={videoRef}
              className="hero-video-player"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/adventure_chill_loop.mp4" type="video/mp4" />
            </video>
            <div className="hero-video-badge">FINN, JAKE & BMO</div>
          </div>
        )}
      </div>

      {/* Floating stage lyric bar */}
      <div
        className={`stage-lyric-bar ${
          showLyricsOverlay && currentLyric && currentLyric.text ? 'visible' : ''
        }`}
        id="stageLyricBar"
      >
        <span className="stage-lyric-text" id="stageLyricText">
          {currentLyric?.text ?? ''}
        </span>
      </div>
    </div>
  );
}

