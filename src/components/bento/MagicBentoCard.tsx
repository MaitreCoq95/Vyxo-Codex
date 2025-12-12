"use client";

import React, { useRef, useState, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "./MagicBento.css";
import { ArrowUpRight } from "lucide-react";

export interface MagicBentoCardProps {
  label?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  color?: string; // Hex or generic color name if supported
  className?: string;
  enableTilt?: boolean;
  enableSpotlight?: boolean;
  children?: ReactNode;
}

export const MagicBentoCard = ({
  label,
  title,
  description,
  icon,
  onClick,
  href,
  color,
  className,
  enableTilt = false,
  enableSpotlight = true,
  children,
}: MagicBentoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update CSS variables for spotlight
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    cardRef.current.style.setProperty("--spotlight-radius", "260px");

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
      const rotateY = ((x - centerX) / centerX) * 5;

      setRotation({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    if (enableTilt) {
      setRotation({ x: 0, y: 0 });
    }
  };

  // Determine effective styles
  const effectiveColor = color || "var(--vx-indigo)";
  const effectiveBg = color ? `${color}20` : "rgba(94, 92, 255, 0.1)"; // 20 hex = ~12% opacity

  const containerStyle: React.CSSProperties = {
    ...(enableTilt
      ? {
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }
      : {}),
    // Override local variables if color is provided
    ...(color ? {
        '--vx-indigo': color,
        '--vx-indigo-glow': `${color}40`,
        borderColor: `${color}30`, // Subtle colored border
    } as React.CSSProperties : {}),
  };

  const Content = (
    <>
      {enableSpotlight && <div className="bento-spotlight" />}
      
      <div className="bento-content">
        <div className="flex flex-col items-start w-full h-full">
          {/* Header */}
          {(icon || label) && (
            <div className="flex items-center justify-between w-full mb-4">
               <div className="flex items-center gap-3">
                 {icon && (
                    <div 
                        className="bento-icon-wrapper"
                        style={{
                            color: effectiveColor,
                            backgroundColor: effectiveBg,
                            // Ensure override of CSS class defaults if needed
                        }}
                    >
                        {icon}
                    </div>
                 )}
                 {label && (
                   <span className="bento-label" style={{ color: effectiveColor }}>
                     {label}
                   </span>
                 )}
               </div>
               
               {/* Arrow hint for links */}
               {(href || onClick) && (
                 <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-white transition-colors" />
               )}
            </div>
          )}

          <h3 className="bento-title group-hover:text-white transition-colors mb-2">{title}</h3>

          {description && (
            <p className="bento-description mb-4">
              {description}
            </p>
          )}

          {/* Custom Children (Tags, Badges, etc) */}
          {children && (
            <div className="mt-auto w-full">
              {children}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const containerClasses = cn("magic-bento-card group h-full", className);

  if (href) {
    return (
      <Link
        href={href}
        className={containerClasses}
        onMouseMove={handleMouseMove as any} // Cast to avoid detailed event mismatch
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={containerStyle}
      >
        <div ref={cardRef} className="w-full h-full"> 
            {/* Wrap Ref in a div inside Link to avoid ref mismatch */}
            {Content}
        </div>
      </Link>
    );
  }

  return (
    <div
      ref={cardRef}
      className={containerClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={containerStyle}
      role={onClick ? "button" : undefined}
    >
      {Content}
    </div>
  );
};
