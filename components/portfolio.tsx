"use client";

import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { N, WORK } from "@/lib/work";
import { About } from "./about";
import { CaseStudy } from "./case-study";
import { Contact } from "./contact";
import { Intro } from "./intro";
import { Reel } from "./reel";
import { IO, pad, stripe } from "./ui";

type View = "work" | "about" | "contact";
const VIEWS: View[] = ["work", "about", "contact"];

export default function Portfolio() {
  const [{ vw, vh }, setSize] = useState({ vw: 1440, vh: 900 });
  const [phase, setPhase] = useState<"intro" | "out" | "home">("intro");
  const [hin, setHin] = useState(false); // home content has started revealing
  const [view, setView] = useState<View>("work");
  const [pending, setPending] = useState<View | null>(null);
  const [flash, setFlash] = useState(false);
  const [wipe, setWipe] = useState(0);
  const [idx, setIdx] = useState(0);
  const [caseOpen, setCaseOpen] = useState(-1);
  const [clock, setClock] = useState("");
  const lastWheel = useRef(0);
  const shutter = useMotionValue(0);
  const shutterMask = useTransform(shutter, (v) => stripe(v, vw));

  const step = useCallback((d: number) => setIdx((i) => (i + d + N) % N), []);

  useEffect(() => {
    const resize = () => setSize({ vw: window.innerWidth, vh: window.innerHeight });
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    resize();
    tick();
    const id = setInterval(tick, 1000);
    window.addEventListener("resize", resize);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Blinds close over the intro, the home screen swaps in underneath, blinds reopen.
  const entered = useRef(false);
  const enter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    setPhase("out");
    animate(shutter, [0, 1, 1, 0], { duration: 1, times: [0, 0.45, 0.55, 1], ease: IO });
    setTimeout(() => setPhase("home"), 480);
    setTimeout(() => setHin(true), 730);
  }, [shutter]);

  // A paper panel wipes across; the view swaps while it covers the screen.
  const nav = (v: View) => {
    setCaseOpen(-1);
    if (v === view || pending) return;
    setPending(v);
    setWipe((w) => w + 1);
    setFlash(true);
    setTimeout(() => { setView(v); setPending(null); }, 430);
    setTimeout(() => setFlash(false), 900);
  };

  const home = phase === "home";
  const onWork = home && view === "work" && caseOpen < 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!home) return;
      if (e.key === "Escape" && caseOpen >= 0) return setCaseOpen(-1);
      if (!onWork) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      else if (e.key === "Enter") setCaseOpen(idx);
    };
    const onWheel = (e: WheelEvent) => {
      if (!onWork) return;
      e.preventDefault();
      const dv = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX, now = performance.now();
      if (Math.abs(dv) < 20 || now - lastWheel.current < 1000) return;
      lastWheel.current = now;
      step(dv > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [home, onWork, caseOpen, idx, step]);

  const navColor = (v: View) => ((pending ?? view) === v ? "text-paper" : "text-mute");
  const workOnly = view === "work" ? "" : "opacity-0";

  return (
    <MotionConfig reducedMotion="user">
      <main className="fixed inset-0 overflow-hidden bg-ink text-paper">
        <div className={`absolute inset-0 ${home ? "" : "pointer-events-none opacity-0"}`}>
          <Reel idx={idx} step={step} open={setCaseOpen} hin={hin} flash={flash} active={view === "work"} playing={onWork} vw={vw} vh={vh} />
          <About active={view === "about"} on={view === "about" && !pending} onContact={() => nav("contact")} />
          <Contact active={view === "contact"} on={view === "contact" && !pending} vw={vw} />

          <header className="absolute inset-x-0 top-0 flex h-[54px] items-center justify-between gap-5 border-b border-paper/12 px-[2.5vw] md:h-16">
            <button onClick={() => nav("work")} className="font-serif text-lg whitespace-nowrap italic md:text-[22px]">S. Agyeman-Bio</button>
            <nav className="hidden gap-9 md:flex">
              {VIEWS.map((v) => (
                <button key={v} onClick={() => nav(v)} className={`flex items-center gap-2 py-1.5 text-[11px] tracking-[.28em] uppercase transition-colors duration-300 hover:text-paper ${navColor(v)}`}>
                  <span className={`size-[5px] rounded-full bg-current ${(pending ?? view) === v ? "" : "opacity-0"}`} />
                  {v}
                </button>
              ))}
            </nav>
            <span className="hidden text-[11px] tracking-[.2em] text-mute tabular-nums md:inline">{clock}</span>
          </header>

          <footer className="absolute inset-x-0 bottom-0 flex h-[60px] items-center justify-between gap-4 border-t border-paper/12 px-[2.5vw] text-[10px] tracking-[.24em] md:h-16">
            <div className={`hidden items-center gap-3 text-mute md:flex ${workOnly}`}>
              <span className="relative h-px w-[34px] overflow-hidden bg-mute">
                <span className="hint absolute inset-y-0 w-2.5 bg-paper" />
              </span>
              SCROLL · DRAG · ↑ ↓
            </div>
            <nav className="flex gap-1 md:hidden">
              {VIEWS.map((v) => (
                <button key={v} onClick={() => nav(v)} className={`h-11 px-2.5 text-[10px] tracking-[.24em] uppercase ${navColor(v)}`}>{v}</button>
              ))}
            </nav>
            <div className={`flex items-center gap-1.5 ${workOnly}`}>
              {WORK.map((w, i) => (
                <span key={w.title} className={`h-0.5 transition-[width,background-color] duration-600 ease-snap ${i === idx ? "w-7 bg-paper" : "w-2.5 bg-[#4a4946]"}`} />
              ))}
            </div>
            <div className={`hidden tabular-nums md:flex ${workOnly}`}>{pad(idx + 1)} / {pad(N)}</div>
          </footer>
        </div>

        {wipe > 0 && (
          <motion.div
            key={wipe}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.86, ease: IO }}
            className="pointer-events-none absolute inset-0 bg-paper"
          />
        )}

        <AnimatePresence>
          {caseOpen >= 0 && (
            <CaseStudy
              key={caseOpen}
              i={caseOpen}
              onClose={() => setCaseOpen(-1)}
              onNext={() => { const n = (caseOpen + 1) % N; setCaseOpen(n); setIdx(n); }}
            />
          )}
        </AnimatePresence>

        {!home && <Intro vw={vw} leaving={phase === "out"} onEnter={enter} />}

        <motion.div style={{ mask: shutterMask, WebkitMask: shutterMask }} className="pointer-events-none absolute inset-0 bg-paper" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[.22] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_60%,rgba(0,0,0,.45)_100%)]" />
      </main>
    </MotionConfig>
  );
}
