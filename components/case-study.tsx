"use client";

import { motion, useIsPresent } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { N, WORK } from "@/lib/work";
import { SNAP, Shimmer, pad } from "./ui";

const NOTES = [
  ["THE BRIEF", "What the client walked in with — the problem, in two or three plain sentences."],
  ["THE IDEA", "The angle you found and why it worked. The one decision that made the project."],
  ["THE OUTCOME", "What changed after. A number if you have one, a reaction if you don’t."],
];
const QUOTES = ["“Short press or client quote.”", "“A second line of praise.”", "“And a third, for rhythm.”"];

export function CaseStudy({ i, onClose, onNext }: { i: number; onClose: () => void; onNext: () => void }) {
  const w = WORK[i];
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const present = useIsPresent();

  useEffect(() => {
    if (ref.current!.readyState >= 2) setReady(true);
  }, []);
  useEffect(() => {
    if (!present) ref.current?.pause(); // stop the sound as soon as it starts closing
  }, [present]);

  const play = () => {
    const v = ref.current!;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setPlaying(true);
  };

  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 1.1, ease: SNAP }}
      className={`absolute inset-0 z-5 overflow-y-auto bg-paper text-ink select-text ${present ? "" : "pointer-events-none"}`}
    >
      <div className="sticky top-0 z-2 flex h-16 items-center justify-between border-b border-ink bg-paper px-[2.5vw] text-[11px] tracking-[.24em]">
        <span>CASE STUDY — {pad(i + 1)} / {pad(N)}</span>
        <button onClick={onClose} className="h-10 border border-ink px-4 text-[11px] tracking-[.24em] hover:bg-ink hover:text-paper">CLOSE ✕</button>
      </div>

      <div className="mx-auto flex max-w-[1500px] flex-col gap-[5vh] px-[5vw] pt-[6vh] pb-[8vh]">
        <div className="flex flex-col gap-[2vh]">
          <span className="text-[11px] tracking-[.3em]">({w.cat})</span>
          <h1 className="font-serif text-[clamp(52px,12vw,190px)] leading-[.9] font-normal tracking-[-.03em] italic">{w.title}</h1>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 border-y border-ink py-4 text-[11px] tracking-[.16em]">
          {[["ROLE", w.role], ["CLIENT", "Client name"], ["YEAR", w.year], ["RUNTIME", w.runtime || "—"]].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <span className="text-dim">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </div>

        <div className="relative aspect-video max-h-[78vh] w-full overflow-hidden bg-black">
          <video
            ref={ref}
            src={w.loop}
            preload="auto"
            playsInline
            controls={playing}
            onLoadedData={() => setReady(true)}
            className={`absolute inset-0 size-full bg-black ${playing ? "object-contain" : "object-cover"}`}
          />
          <Shimmer on={!ready} />
          {!playing && (
            <button
              onClick={play}
              className="absolute top-1/2 left-1/2 flex size-[132px] -translate-1/2 flex-col items-center justify-center gap-1.5 rounded-full bg-ink text-[10px] tracking-[.3em] text-paper transition-transform duration-400 hover:scale-[1.08]"
            >
              <span className="text-base">▶</span>
              <span>PLAY FILM</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[4vw]">
          {NOTES.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-3">
              <span className="text-[11px] tracking-[.3em]">{k}</span>
              <span className="font-serif text-xl leading-[1.4] text-pretty">{v}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[2vw] border-t border-ink pt-[5vh]">
          {QUOTES.map((q) => (
            <div key={q} className="flex flex-col gap-3">
              <span className="text-xs tracking-[.4em]">★★★★★</span>
              <span className="font-serif text-[clamp(24px,2.6vw,36px)] leading-[1.1] italic">{q}</span>
              <span className="text-[10px] tracking-[.24em] text-dim">— PUBLICATION</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          {["Still B", "Still C"].map((s) => (
            <div key={s} className="grid aspect-[4/5] place-items-center bg-[rgba(127,127,127,.08)] text-[11px] tracking-[.2em] text-dim">{s}</div>
          ))}
        </div>

        <button onClick={onNext} className="flex items-baseline justify-between gap-5 border-t border-ink pt-[4vh] text-left hover:opacity-60">
          <span className="text-[11px] tracking-[.3em]">NEXT —</span>
          <span className="font-serif text-[clamp(36px,6vw,88px)] leading-none italic">{WORK[(i + 1) % N].title} →</span>
        </button>
      </div>
    </motion.div>
  );
}
