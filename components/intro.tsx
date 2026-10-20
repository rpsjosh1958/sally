"use client";

import { motion, useAnimationFrame, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { ArrowButton, cl, eio, pad, stripe } from "./ui";

// 1 while the intro clock is inside (a, b), else 0.
const useBand = (t: MotionValue<number>, a: number, b = Infinity) => useTransform(t, (v) => (v > a && v < b ? 1 : 0));

// Timeline (seconds): 0.9 blinds start opening · 2.7 surname fades in · 3.35 ENTER appears.
export function Intro({ vw, leaving, onEnter }: { vw: number; leaving: boolean; onEnter: () => void }) {
  const t = useMotionValue(0);
  useAnimationFrame((_, dt) => t.set(Math.min(9, t.get() + Math.min(0.1, dt / 1000))));

  const blinds = useTransform(t, (v) => {
    const p = cl((v - 0.9) / (1.6 / 1.8)); // blinds open 1.8× faster than the design's 1.6s
    return stripe(p <= 0 ? 0 : 0.14 + 0.86 * eio(p), vw);
  });
  const frame = useTransform(t, (v) => "FR " + String(Math.floor(v * 24)).padStart(4, "0"));
  const timecode = useTransform(t, (v) => `00:00:${pad(Math.floor(v))}:${pad(Math.floor((v % 1) * 24))}`);
  const loading = useTransform(t, (v) => `LOADING ${String(Math.round(cl((v - 0.9) / 2.3) * 100)).padStart(3, "0")}%`);
  const corners = useBand(t, 0.9), loadO = useBand(t, 0.9, 3.25), skipO = useBand(t, 0.9, 3.2);
  const surname = useBand(t, 2.7), gate = useBand(t, 3.35);
  const skipPe = useTransform(skipO, (o) => (o ? "auto" : "none"));
  const gatePe = useTransform(gate, (o) => (o ? "auto" : "none"));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && t.get() > 3.35) {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [t, onEnter]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper">
      <motion.div
        style={{ mask: blinds, WebkitMask: blinds }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-[4.5vh] bg-ink text-paper"
      >
        <div className="font-serif text-[min(21vw,30vh)] leading-[.86] font-extrabold tracking-[-.035em] whitespace-nowrap md:text-[min(21vw,32vh)]">
          SAMUEL
        </div>
        <motion.div style={{ opacity: surname }} className="pl-[.9em] text-[11px] tracking-[.9em] whitespace-nowrap transition-opacity duration-1200 md:text-[min(1.5vw,14px)]">
          AGYEMAN-BIO
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: corners }} className="pointer-events-none absolute inset-[3vh_3vw] text-[10px] tracking-[.26em] text-paper tabular-nums mix-blend-difference">
        <span className="absolute top-0 left-0">SAB / REEL 00</span>
        <motion.span className="absolute top-0 right-0">{frame}</motion.span>
        <span className="absolute bottom-0 left-0">MONOCHROME · 24 FPS</span>
        <motion.span className="absolute right-0 bottom-0">{timecode}</motion.span>
      </motion.div>

      <motion.div style={{ opacity: loadO }} className="absolute inset-x-0 bottom-[12vh] flex justify-center text-[10px] tracking-[.3em] text-paper tabular-nums mix-blend-difference">
        {loading}
      </motion.div>

      <motion.div style={{ opacity: gate, pointerEvents: leaving ? "none" : gatePe }} className="absolute inset-x-0 bottom-[11vh] flex justify-center text-paper transition-opacity duration-900">
        <ArrowButton wide onClick={onEnter}>ENTER</ArrowButton>
      </motion.div>

      <motion.button
        style={{ opacity: skipO, pointerEvents: skipPe }}
        onClick={() => t.set(3.2)}
        className="absolute right-[3vw] bottom-[calc(3vh+22px)] py-2 text-[10px] tracking-[.3em] text-paper mix-blend-difference"
      >
        SKIP →
      </motion.button>
    </div>
  );
}
