"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./MagicBento.css";
import { MagicBentoCard, MagicBentoCardProps } from "./MagicBentoCard";

export interface MagicBentoProps {
  children?: ReactNode;
  cardData?: MagicBentoCardProps[];
  className?: string;
  
  // Customization
  enableSpotlight?: boolean;
  enableStars?: boolean; // Particles placeholder
  enableTilt?: boolean;
  spotlightRadius?: number;
  glowColor?: string; // e.g. "94,92,255"
}

export const MagicBento = ({
  children,
  cardData,
  className,
  enableSpotlight = true,
  enableStars = false,
  enableTilt = false,
  spotlightRadius = 260,
  glowColor = "94, 92, 255",
}: MagicBentoProps) => {

  const containerStyle = {
    "--spotlight-radius": `${spotlightRadius}px`,
    "--vx-indigo-glow": `rgba(${glowColor}, 0.22)`,
    "--vx-indigo": `rgba(${glowColor}, 1)`,
  } as React.CSSProperties;

  return (
    <div className={cn("magic-bento-grid", className)} style={containerStyle}>
      {/* Optional Particles Background (Global for grid) */}
      {enableStars && (
        <div className="bento-particles">
          {/* Implementation dependent - simplified for now */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none" />
        </div>
      )}

      {/* Render from Data */}
      {cardData && cardData.length > 0
        ? cardData.map((card, idx) => (
            <MagicBentoCard
              key={idx}
              {...card}
              enableTilt={enableTilt}
              enableSpotlight={enableSpotlight}
            />
          ))
        : children}
    </div>
  );
};
