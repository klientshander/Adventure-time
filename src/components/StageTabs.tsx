'use client';

import React from 'react';
import { SPRITES, SIZES } from '../lib/sprites';
import { StageType } from '../lib/types';

interface StageTabsProps {
  activeStage: StageType;
  onSelectStage: (stage: StageType) => void;
}

interface TabDef {
  id: StageType;
  label: string;
  iconKey: keyof typeof SPRITES;
}

const TABS: TabDef[] = [
  { id: 'boombox', label: 'BOOM', iconKey: 'boombox' },
  { id: 'cassette', label: 'TAPE', iconKey: 'cassette' },
  { id: 'headphones', label: 'CHILL', iconKey: 'headphones' },
  { id: 'equalizer', label: 'WAVE', iconKey: 'equalizer' },
  { id: 'popcat', label: 'CAT', iconKey: 'popcat_closed' },
  { id: 'video', label: 'TIME', iconKey: 'film_icon' },
];

export default function StageTabs({ activeStage, onSelectStage }: StageTabsProps) {
  return (
    <div className="stage-tabs">
      {TABS.map((tab) => {
        const size = SIZES[tab.iconKey] || { w: 18, h: 18 };
        const isActive = activeStage === tab.id;
        return (
          <button
            key={tab.id}
            className={`tab-btn ${isActive ? 'active' : ''}`}
            data-stage={tab.id}
            onClick={() => onSelectStage(tab.id)}
          >
            <span
              className="tab-icon"
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 ${size.w} ${size.h}">${SPRITES[tab.iconKey]}</svg>`,
              }}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

