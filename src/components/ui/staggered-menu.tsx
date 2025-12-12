"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import "./staggered-menu.css";
import { cn } from "@/lib/utils";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
export interface StaggeredMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  description?: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string; // Optional logo image
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  closeOnClickAway?: boolean;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export const StaggeredMenu = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items,
  socialItems,
  displaySocials = false,
  displayItemNumbering = true,
  className,
  logoUrl,
  menuButtonColor = "#ffffff",
  openMenuButtonColor = "#020617",
  accentColor = "rgba(94, 92, 255, 1)",
  changeMenuColorOnOpen = true,
  onMenuOpen,
  onMenuClose,
  closeOnClickAway = true,
}: StaggeredMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle Function
  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      onMenuClose?.();
    } else {
      setIsOpen(true);
      onMenuOpen?.();
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onMenuClose?.();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onMenuClose]);

  // Determine slide direction
  const slideInitial = position === "left" ? "-100%" : "100%";
  const slideExit = position === "left" ? "-100%" : "100%";

  // Trigger Button Color
  const triggerColor =
    isOpen && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* 1. Closed State: Card Trigger */}
      <div 
        className="staggered-menu-closed-card flex flex-col items-center justify-center group"
        onClick={toggleMenu}
      >
        <div className="staggered-menu-grid-bg" />
        
        {/* Menu + Text */}
        <div className="absolute top-4 right-4 z-10">
             <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1 cursor-pointer"
             >
                <span 
                    className="staggered-menu-trigger-text"
                    style={{ color: "#fff" }} // Always white in closed state usually
                >
                    Menu
                </span>
                <Plus className="w-4 h-4 text-white" />
             </motion.div>
        </div>

        {/* Center Hint (Optional) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <span className="text-white/50 text-xs uppercase tracking-widest">Ouvrir</span>
        </div>
      </div>

      {/* 2. Open State: AnimatePresence Wrapper */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay / Click Away */}
            {closeOnClickAway && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                onClick={() => {
                  setIsOpen(false);
                  onMenuClose?.();
                }}
              />
            )}

            {/* Main Panel Wrapper (Fixed Position) */}
            <div className={cn(
                "fixed top-0 bottom-0 z-[100] w-full max-w-[480px] p-4 flex items-center",
                position === "left" ? "left-0" : "right-0"
            )}>
                
                {/* 3. Staggered Underlay Layers */}
                {colors.map((color, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: slideInitial, scale: 0.9, opacity: 0 }}
                        animate={{ 
                            x: 0, 
                            scale: 1, 
                            opacity: 1,
                            translateX: (idx + 1) * 8, // Reduced offset
                            translateY: (idx + 1) * 8 
                        }}
                        exit={{ x: slideExit, opacity: 0 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 150, 
                            damping: 25,
                            delay: idx * 0.05 
                        }}
                        className="absolute inset-4 rounded-[1.5rem] bg-current"
                        style={{ color: color, zIndex: -1 - idx }}
                    />
                ))}

                {/* 4. Main Panel (Dark Theme) */}
                <motion.div
                    initial={{ x: slideInitial }}
                    animate={{ x: 0 }}
                    exit={{ x: slideExit }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className="relative w-full h-full bg-[#020617] border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col text-slate-200"
                >
                    {/* Header: Logo & Close */}
                    <div className="flex justify-between items-center p-8">
                        {logoUrl ? (
                            <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
                        ) : (
                           <span className="text-xl font-bold tracking-tight text-white">VYXO CODEX</span>
                        )}

                        <button 
                            onClick={toggleMenu}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <span className="uppercase text-xs font-bold tracking-widest text-slate-400">Close</span>
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 flex flex-col justify-center px-8 md:px-12 space-y-4 overflow-y-auto">
                        {items.map((item, idx) => {
                            const numberStr = (idx + 1).toString().padStart(2, '0');
                            
                            return (
                                <Link 
                                    key={idx} 
                                    href={item.href || "#"} 
                                    onClick={(e) => {
                                        if (!item.href) e.preventDefault();
                                        item.onClick?.();
                                        setIsOpen(false);
                                        onMenuClose?.();
                                    }}
                                    className="group flex items-center gap-4 py-2"
                                >
                                    {displayItemNumbering && (
                                        <span 
                                            className="staggered-menu-item-number text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity"
                                            style={{ color: accentColor }}
                                        >
                                            {numberStr}
                                        </span>
                                    )}
                                    <span 
                                        className="text-xl md:text-2xl font-bold uppercase tracking-wide transition-all duration-300 group-hover:translate-x-2"
                                        style={{ color: "white" }} 
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = accentColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = "white";
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer / Socials */}
                    {displaySocials && socialItems && (
                        <div className="p-8 border-t border-white/5 flex gap-6">
                            {socialItems.map((social, idx) => (
                                <Link 
                                    key={idx} 
                                    href={social.href} 
                                    className="text-slate-500 hover:text-white transition-colors"
                                    target="_blank"
                                >
                                    {social.icon || social.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
