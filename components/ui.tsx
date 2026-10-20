"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EXPO = [0.16, 1, 0.3, 1] as const;
export const SNAP = [0.7, 0, 0.2, 1] as const;
export const IO = [0.65, 0, 0.35, 1] as const; // ≈ cubic ease-in-out

export const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const eio = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
export const pad = (n: number) => String(n).padStart(2, "0");

// Area between header and footer that every view fills.
export const STAGE = "absolute inset-x-0 top-[54px] bottom-[60px] md:top-16 md:bottom-16";
export const shown = (on: boolean) => (on ? "" : "invisible pointer-events-none opacity-0");

// Venetian-blind mask: vertical bars covering `w` (0–1) of every ~2.2vw period (4.6vw on mobile).
export function stripe(w: number, vw: number) {
  if (w <= 0.001) return "linear-gradient(transparent,transparent)";
  if (w >= 0.999) return "none";
  const P = Math.max(8, Math.round((vw * (vw < 760 ? 4.6 : 2.2)) / 100));
  const wp = Math.max(1, Math.round(w * P)), a = Math.floor((P - wp) / 2), b = a + wp;
  return `linear-gradient(90deg,transparent ${a}px,#000 ${a}px,#000 ${b}px,transparent ${b}px) 0 0 / ${P}px 100% repeat`;
}

// Text that slides up out of a clipped line.
export function Rise({ on, delay = 0, dur = 1.1, className = "inline-block", children }: {
  on: boolean; delay?: number; dur?: number; className?: string; children: ReactNode;
}) {
  return (
    <span className={`-mb-[.14em] overflow-hidden pb-[.14em] ${className}`}>
      <motion.span
        className="inline-block"
        initial={false}
        animate={{ y: on ? "0%" : "115%" }}
        transition={{ duration: dur, ease: EXPO, delay: on ? delay : 0 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Shimmer({ on }: { on: boolean }) {
  return (
    <div className={`shimmer pointer-events-none absolute inset-0 grid place-items-center bg-[#141414] transition-opacity duration-900 ${on ? "" : "opacity-0"}`}>
      <span className="text-[10px] tracking-[.34em] text-dim">LOADING</span>
    </div>
  );
}

// Muted background loop; plays only while `playing`.
export function Loop({ src, playing }: { src: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ref.current!.readyState >= 2) setReady(true); // loaded before hydration
  }, []);
  useEffect(() => {
    const v = ref.current!;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  return (
    <>
      <video ref={ref} src={src} muted loop playsInline preload="auto" onLoadedData={() => setReady(true)}
        className="pointer-events-none absolute inset-0 size-full object-cover" />
      <Shimmer on={!ready} />
    </>
  );
}

export function ArrowButton({ children, onClick, wide = false, className = "" }: {
  children: ReactNode; onClick: () => void; wide?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className={`flex items-stretch border border-paper text-[11px] transition-colors duration-350 hover:bg-paper hover:text-ink ${wide ? "h-12 tracking-[.42em]" : "h-[46px] tracking-[.34em]"} ${className}`}
    >
      <span className={`flex items-center ${wide ? "pr-[26px] pl-[calc(26px+.42em)]" : "pr-5 pl-[calc(20px+.34em)]"}`}>{children}</span>
      <span className={`flex items-center border-l border-current text-[15px] tracking-normal ${wide ? "px-4" : "px-3.5"}`}>→</span>
    </button>
  );
}
