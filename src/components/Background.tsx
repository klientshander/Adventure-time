'use client';

import React, { useEffect, useRef } from 'react';
import { BgMode } from '../lib/types';

interface BackgroundProps {
  mode: BgMode;
}

export default function Background({ mode }: BackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const leavesRef = useRef<HTMLDivElement>(null);

  // Parallax tracking
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * -12;
      targetY = ((e.clientY - cy) / cy) * -8;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      if (containerRef.current) {
        if (mode === 'treehouse') {
          containerRef.current.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        } else {
          containerRef.current.style.transform = 'none';
        }
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [mode]);

  // Video playback sync
  useEffect(() => {
    if (videoRef.current) {
      if (mode === 'video') {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [mode]);

  // Drifting Pixel Leaves
  useEffect(() => {
    if (!leavesRef.current) return;
    leavesRef.current.innerHTML = '';
    const LEAF_COLORS = ['#78be43', '#5b9b42', '#a47240', '#d89b34', '#4d8935'];
    for (let i = 0; i < 18; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'pixel-leaf';
      const c = LEAF_COLORS[i % LEAF_COLORS.length];
      leaf.innerHTML = `
        <svg viewBox="0 0 6 6" width="12" height="12">
          <rect x="2" y="0" width="2" height="1" fill="${c}"/>
          <rect x="1" y="1" width="4" height="3" fill="${c}"/>
          <rect x="0" y="2" width="6" height="2" fill="${c}"/>
          <rect x="2" y="4" width="2" height="2" fill="${c}"/>
        </svg>
      `;
      leaf.style.left = `${Math.random() * 100}vw`;
      const dur = 9 + Math.random() * 11;
      const delay = Math.random() * 16;
      const dx = (Math.random() * 160 - 80).toFixed(0) + 'px';
      const rot = (Math.random() * 720 - 360).toFixed(0) + 'deg';
      leaf.style.setProperty('--dx', dx);
      leaf.style.setProperty('--rot', rot);
      leaf.style.animationDuration = `${dur}s`;
      leaf.style.animationDelay = `${delay}s`;
      leavesRef.current.appendChild(leaf);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-container mode-${mode}`}
      id="bgContainer"
    >
      <div className="bg-image" id="bgImage" />
      <div className="bg-leaves" id="bgLeaves" ref={leavesRef} />
      <video
        ref={videoRef}
        className="bg-video"
        id="bgVideo"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/adventure_chill_loop.mp4" type="video/mp4" />
      </video>
      <div className="bg-overlay" />
    </div>
  );
}

