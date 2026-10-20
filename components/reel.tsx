"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { N, WORK } from "@/lib/work";
import { ArrowButton, Loop, Rise, SNAP, STAGE, shown } from "./ui";

const wrap = (rel: number) => (rel > N / 2 ? rel - N : rel < -N / 2 ? rel + N : rel);

const QUOTES = ["“A short line of press or client praise.”", "“A second quote that earns its place.”", "“And a third, for rhythm.”"];

// Full-bleed vertical reel: one card per project, scrolled by wheel / drag / arrows.
export function Reel({ idx, step, open, hin, flash, active, playing, vw, vh }: {
  idx: number; step: (d: number) => void; open: (i: number) => void;
  hin: boolean; flash: boolean; active: boolean; playing: boolean; vw: number; vh: number;
}) {
  const mb = vw < 760;
  const padY = mb ? 8 : 10;
  const h = vh - (mb ? 114 : 128) - padY - (mb ? 22 : 56); // stage minus a peek of the next card

  // Cards that wrap from one end of the loop to the other jump instead of flying across.
  const rels = WORK.map((_, i) => wrap(i - idx));
  const prev = useRef<number[]>([]);
  const jumped = rels.map((r, i) => prev.current[i] !== undefined && Math.abs(prev.current[i] - r) > 1);
  useEffect(() => { prev.current = rels; });

  const [drag, setDrag] = useState<number | null>(null);
  const dragRef = useRef({ y0: 0, d: 0, moved: false });
  const dragging = drag !== null;
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      const r = dragRef.current;
      r.d = e.clientY - r.y0;
      if (Math.abs(r.d) > 6) r.moved = true;
      setDrag(r.d);
    };
    const up = () => {
      const { d, moved } = dragRef.current, thr = Math.min(90, window.innerHeight * 0.12);
      if (moved) {
        // a drag that ends on a button shouldn't click it
        const swallow = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); };
        window.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => window.removeEventListener("click", swallow, true), 50);
      }
      setDrag(null);
      if (d < -thr) step(1);
      else if (d > thr) step(-1);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, step]);

  // Trailing "SCROLL" cursor (desktop)
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cx = useSpring(mx, { stiffness: 180, damping: 27 }), cy = useSpring(my, { stiffness: 180, damping: 27 });
  const [cursorIn, setCursorIn] = useState(false);

  return (
    <div
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragRef.current = { y0: e.clientY, d: 0, moved: false };
        setDrag(0);
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left - 52, y = e.clientY - r.top - 52;
        mx.set(x); my.set(y);
        if (!cursorIn) { cx.jump(x); cy.jump(y); setCursorIn(true); }
      }}
      onPointerLeave={() => setCursorIn(false)}
      className={`${STAGE} touch-none overflow-hidden transition-opacity duration-200 md:cursor-none ${shown(active)}`}
    >
      {WORK.map((w, i) => {
        const rel = rels[i], act = rel === 0, on = act && hin;
        return (
          <motion.div
            key={w.title}
            initial={false}
            animate={{
              y: padY + rel * (h + 14) + (drag ?? 0) * 0.7,
              scale: act || !hin ? 1 : 0.97,
              opacity: hin && Math.abs(rel) <= 1 ? 1 : 0,
            }}
            transition={dragging || jumped[i] ? { duration: 0 } : { duration: 1.15, ease: SNAP, opacity: { duration: 0.8, ease: "easeOut" } }}
            style={{ height: h }}
            className="absolute inset-x-[2.5vw] top-0 isolate overflow-hidden rounded-2xl bg-card will-change-transform md:rounded-[22px]"
          >
            <Loop src={w.loop} playing={playing && act} />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(90deg,rgba(11,11,11,.7) 0%,rgba(11,11,11,.12) 46%,rgba(11,11,11,.6) 100%),linear-gradient(0deg,rgba(11,11,11,.75) 0%,rgba(11,11,11,0) 45%)" }}
            />

            <div className={`pointer-events-none absolute top-[3vw] left-[3vw] hidden flex-col gap-1.5 transition-opacity delay-300 duration-900 md:flex ${on ? "" : "opacity-0"}`}>
              <span className="font-serif text-[clamp(28px,3.4vw,48px)] leading-none">{w.year}</span>
              <span className="text-[10px] tracking-[.3em]">OFFICIAL SELECTION</span>
              <span className="text-[10px] tracking-[.3em] text-soft">Festival / award name</span>
            </div>

            <div className="pointer-events-none absolute inset-x-[22px] bottom-[92px] flex flex-col items-center gap-[1.6vh] text-center md:right-auto md:bottom-[3vw] md:left-[3vw] md:max-w-[min(620px,55%)] md:items-stretch md:text-left">
              <Rise on={on && !flash} delay={0.1} dur={1} className="block text-[10px] tracking-[.42em]">{w.cat}</Rise>
              <Rise on={on && !flash} delay={0.2} dur={1.2} className="block font-serif text-[13vw] leading-[.95] tracking-[-.02em] italic md:text-[min(7.5vw,12vh)]">
                {w.title}
              </Rise>
              <div className={`hidden grid-cols-[auto_1fr] text-[11px] tracking-[.18em] transition-opacity delay-500 duration-900 md:grid ${on ? "" : "opacity-0"}`}>
                {[["ROLE", w.role], ["YEAR", w.year], ["CATEGORY", w.cat]].map(([k, v], j) => (
                  <Fragment key={k}>
                    <span className={`border-t border-paper py-[7px] text-soft ${j === 2 ? "border-b" : ""}`}>{k}</span>
                    <span className={`border-t border-paper py-[7px] text-right ${j === 2 ? "border-b" : ""}`}>{v}</span>
                  </Fragment>
                ))}
              </div>
            </div>

            <div className={`pointer-events-none absolute top-[3vw] right-[3vw] bottom-[calc(3vw+80px)] hidden w-[min(300px,26%)] flex-col justify-around text-center transition-opacity delay-600 duration-1000 md:flex ${on ? "" : "opacity-0"}`}>
              {QUOTES.map((q) => (
                <div key={q} className="flex flex-col items-center gap-2.5">
                  <span className="text-[11px] tracking-[.4em]">★★★★★</span>
                  <span className="text-[9px] tracking-[.42em] text-soft">PUBLICATION</span>
                  <span className="font-serif text-[clamp(18px,1.8vw,28px)] leading-[1.1] text-balance italic">{q}</span>
                </div>
              ))}
            </div>

            <div className={`absolute inset-x-[22px] bottom-[22px] flex justify-center transition-opacity delay-600 duration-900 md:right-[3vw] md:bottom-[3vw] md:left-auto ${on ? "" : "opacity-0"} ${act ? "" : "pointer-events-none"}`}>
              <ArrowButton onClick={() => open(i)} className="bg-ink/25 text-paper">EXPLORE</ArrowButton>
            </div>
          </motion.div>
        );
      })}

      <motion.div
        style={{ x: cx, y: cy, scale: dragging ? 0.8 : 1, opacity: cursorIn ? 1 : 0 }}
        className="pointer-events-none absolute top-0 left-0 hidden size-[104px] items-center justify-center rounded-full border border-paper pl-[.3em] text-[10px] tracking-[.3em] text-paper mix-blend-difference transition-opacity duration-300 md:flex"
      >
        {dragging ? "DRAG" : "SCROLL"}
      </motion.div>
    </div>
  );
}
