'use client';

import React, { useRef, useState } from 'react';
import { SPRITES, SIZES } from '../lib/sprites';
import { SHEET_SVG } from '../lib/sheetSvg';
import { TRACKS } from '../lib/tracks';
import { Track } from '../lib/types';

interface PlaylistSheetProps {
  currentTrackIdx: number;
  onSelectTrack: (idx: number) => void;
  onLoadCustomFile: (file: File) => void;
  isSheetModalOpen: boolean;
  onCloseSheetModal: () => void;
}

function fmtTime(sec: number): string {
  if (isNaN(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function PlaylistSheet({
  currentTrackIdx,
  onSelectTrack,
  onLoadCustomFile,
  isSheetModalOpen,
  onCloseSheetModal,
}: PlaylistSheetProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadCustomFile(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        id="audioFileInput"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Track List Header */}
      <div
        className="playlist-header"
        id="playlistToggle"
        title="Click to Collapse / Expand Playlist"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span>TRACK SELECTION</span>
        <span
          id="playlistToggleText"
          style={{ fontSize: '0.42rem', color: 'var(--blue)', cursor: 'pointer' }}
        >
          {isCollapsed ? '[SHOW]' : '[HIDE]'}
        </span>
      </div>

      {/* Track List */}
      <ul className={`playlist ${isCollapsed ? 'collapsed' : ''}`} id="playlist">
        {TRACKS.map((track, i) => {
          const isCurrent = i === currentTrackIdx;
          const iconKey = track.icon as keyof typeof SPRITES;
          const s = SIZES[iconKey] || SIZES.cassette;
          const spriteHtml = SPRITES[iconKey] || SPRITES.cassette;

          return (
            <li
              key={i}
              className={`track-row ${isCurrent ? 'playing' : ''}`}
              onClick={() => {
                if (track.isCustom) {
                  fileInputRef.current?.click();
                } else {
                  onSelectTrack(i);
                }
              }}
            >
              <div
                className="row-slot"
                dangerouslySetInnerHTML={{
                  __html: `<svg viewBox="0 0 ${s.w} ${s.h}">${spriteHtml}</svg>`,
                }}
              />
              <div className="row-info">
                <span className="row-name">{track.title}</span>
                <span className="row-desc">{track.artist}</span>
              </div>
              <span className="row-dur">
                {track.duration > 0 ? fmtTime(track.duration) : '--:--'}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Sprite Sheet Inspection Modal */}
      <div
        className={`sheet-modal ${isSheetModalOpen ? 'open' : ''}`}
        id="sheetModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheetTitle"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onCloseSheetModal();
          }
        }}
      >
        <div className="sheet-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-dialog-header">
            <h3 className="sheet-dialog-title" id="sheetTitle">
              PIXEL ASSET SHEET
            </h3>
            <button
              className="sheet-toggle-btn"
              id="closeSheetBtn"
              onClick={onCloseSheetModal}
            >
              CLOSE
            </button>
          </div>
          <div
            className="sheet-preview-wrap"
            dangerouslySetInnerHTML={{ __html: SHEET_SVG }}
          />
        </div>
      </div>
    </>
  );
}

