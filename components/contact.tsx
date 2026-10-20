"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { EMAIL } from "@/lib/work";
import { Rise, STAGE, shown, stripe } from "./ui";

const INFO = [
  ["ENQUIRIES", "Commissions & collaborations"],
  ["BASED", "[City] — working worldwide"],
  ["AVAILABILITY", "Booking for 2027"],
];

export function Contact({ active, on, vw }: { active: boolean; on: boolean; vw: number }) {
  const fill = useMotionValue(0);
  const mask = useTransform(fill, (v) => stripe(v, vw));
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const words = (line: string, base: number) =>
    line.split(" ").map((t, i) => <Rise key={i} on={on} delay={base + i * 0.07} dur={1.2}>{t}</Rise>);

  const copy = () => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className={`${STAGE} flex flex-col justify-between gap-[2.4vh] overflow-y-auto px-[6vw] py-[4vh] md:overflow-hidden md:px-[5vw] md:pt-[3.5vh] md:pb-[2.5vh] ${shown(active)}`}>
      <div className="flex justify-between gap-4 text-[10px] tracking-[.3em] text-mute">
        <span>(CONTACT)</span>
        <span>FINAL SCENE</span>
      </div>

      <div className="flex flex-col gap-[2.6vh]">
        <h2 className="font-serif text-[15vw] leading-[.98] font-normal tracking-[-.03em] md:text-[min(9vw,12vh)] lg:text-[min(9vw,14vh)]">
          <span className="flex flex-wrap gap-x-[.24em]">{words("Let’s make", 0.15)}</span>
          <span className="flex flex-wrap gap-x-[.24em] italic md:pl-[12vw]">{words("the next one.", 0.35)}</span>
        </h2>

        <div className={`flex flex-wrap items-center gap-x-[22px] gap-y-4 transition-opacity delay-700 duration-900 ${on ? "" : "opacity-0"}`}>
          <a
            href={`mailto:${EMAIL}`}
            onMouseEnter={() => animate(fill, 1, { duration: 0.5, ease: "easeOut" })}
            onMouseLeave={() => animate(fill, 0, { duration: 0.5, ease: "easeOut" })}
            className="relative -ml-2.5 inline-block border-b border-paper px-2.5 py-1 font-serif text-[22px] leading-[1.2] break-all italic md:text-[clamp(22px,min(3vw,6vh),46px)]"
          >
            <span>{EMAIL}</span>
            <motion.span aria-hidden style={{ mask, WebkitMask: mask }} className="pointer-events-none absolute inset-0 bg-paper px-2.5 py-1 text-ink">
              {EMAIL}
            </motion.span>
          </a>
          <button onClick={copy} className="h-10 border border-paper/50 px-4 text-[10px] tracking-[.28em] whitespace-nowrap hover:border-paper">
            {copied ? "COPIED ✓" : "COPY EMAIL"}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-x-[3vw] text-[11px] tracking-[.16em] transition-opacity delay-900 duration-1000 md:grid-cols-2 lg:grid-cols-4 ${on ? "" : "opacity-0"}`}>
        {INFO.map(([k, v]) => (
          <div key={k} className="flex min-w-0 flex-col gap-1.5 border-t border-paper/25 py-[9px]">
            <span className="text-[10px] tracking-[.26em] text-mute">{k}</span>
            <span>{v}</span>
          </div>
        ))}
        <div className="flex min-w-0 flex-col gap-1.5 border-t border-paper/25 py-[9px]">
          <span className="text-[10px] tracking-[.26em] text-mute">ELSEWHERE</span>
          <span className="flex gap-3.5 whitespace-nowrap">
            <a href="#">Instagram ↗</a>
            <a href="#">Vimeo ↗</a>
            <a href="#">LinkedIn ↗</a>
          </span>
        </div>
      </div>
    </section>
  );
}
