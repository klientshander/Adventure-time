'use client';

import React from 'react';
import { BRAND_SVG } from '../lib/brandSvg';
import { BG_LABELS } from '../lib/tracks';
import { BgMode, SizeOption } from '../lib/types';

interface TitleBarProps {
  currentSize: SizeOption;
  onToggleSize: () => void;
  bgMode: BgMode;
  onToggleBg: () => void;
  onOpenSheet: () => void;
}

export default function TitleBar({
  currentSize,
  onToggleSize,
  bgMode,
  onToggleBg,
  onOpenSheet,
}: TitleBarProps) {
  return (
    <div className="titlebar">
      <div className="titlebar-brand">
        <span
          className="titlebar-brand-svg-wrap"
          dangerouslySetInnerHTML={{ __html: BRAND_SVG }}
        />
        SHANDER SANTILLAN
      </div>
      <div className="titlebar-actions">
        <button
          className="sheet-toggle-btn"
          id="sizeToggleBtn"
          title="Switch Card Size (Small / Medium / Large)"
          onClick={onToggleSize}
        >
          {currentSize.label}
        </button>
        <button
          className="sheet-toggle-btn"
          id="bgToggleBtn"
          title="Cycle Background (Treehouse / Video Loop / Mint)"
          onClick={onToggleBg}
        >
          <span>{BG_LABELS[bgMode]}</span>
        </button>
        <button
          className="sheet-toggle-btn"
          id="openSheetBtn"
          onClick={onOpenSheet}
        >
          SHEET
        </button>
      </div>
    </div>
  );
}

