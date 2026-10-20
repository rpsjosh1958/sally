"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment, useState, type ReactNode } from "react";
import { EMAIL } from "@/lib/work";
import { ArrowButton, EXPO, Rise, SNAP, STAGE, pad, shown } from "./ui";

const STATEMENT = "Samuel Agyeman-Bio directs, shoots and designs — work that would rather be *felt* than scrolled past.".split(" ");
const TABS = ["PROFILE", "PRACTICE", "CLIENTS", "CONTACT"];
const PRACTICE = ["Creative direction", "Film & motion", "Art direction", "Identity"];
const CLIENTS = ["Client One", "Client Two", "Client Three", "Client Four"];
const FACTS = [["BASED", "[City]"], ["PRACTICE", "Creative"], ["STATUS", "Taking commissions"]];

function Panel({ on, className, children }: { on: boolean; className: string; children: ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }}
      transition={{ opacity: { duration: 0.5 }, y: { duration: 0.7, ease: EXPO } }}
      className={`absolute inset-0 ${on ? "" : "pointer-events-none"} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function About({ active, on, onContact }: { active: boolean; on: boolean; onContact: () => void }) {
  const [tab, setTab] = useState(0);
  return (
    <section className={`${STAGE} grid grid-cols-1 grid-rows-[42vh_auto] overflow-y-auto md:grid-cols-[minmax(0,.85fr)_minmax(0,1.25fr)] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden ${shown(active)}`}>
      <div className="relative min-h-0 px-[2.5vw] pt-2.5 md:py-3 md:pr-0 md:pl-[2.5vw]">
        <motion.div
          initial={false}
          animate={{ clipPath: active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
          transition={{ duration: 1.3, ease: SNAP, delay: 0.1 }}
          className="relative size-full overflow-hidden rounded-2xl bg-card md:rounded-[22px]"
        >
          <motion.div initial={false} animate={{ scale: on ? 1 : 1.12 }} transition={{ duration: 8, ease: EXPO }} className="absolute inset-0">
            <Image src="/uploads/IMG_4692.jpg" alt="Samuel Agyeman-Bio" fill sizes="(max-width: 760px) 100vw, 40vw" className="object-cover object-[50%_30%]" />
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap justify-between gap-x-3 gap-y-1 bg-linear-to-t from-ink/70 to-ink/0 px-5 py-[18px] text-[10px] tracking-[.22em] whitespace-nowrap">
            <span>S. AGYEMAN-BIO</span>
            <span>MMXXVI</span>
          </div>
        </motion.div>
      </div>

      <div className="flex min-h-0 min-w-0 flex-col justify-between gap-[4vh] px-[6vw] pt-[3vh] pb-[4vh] md:pt-[4vh] md:pr-[5vw] md:pb-[3.5vh] md:pl-[4.5vw]">
        <div className="flex justify-between gap-3 text-[10px] tracking-[.3em] text-mute">
          <span>(ABOUT)</span>
          <span>THE PERSON BEHIND THE FRAME</span>
        </div>

        <p className="flex max-w-[21ch] flex-wrap gap-x-[.26em] font-serif text-[27px] leading-[1.1] tracking-[-.01em] md:text-[clamp(30px,5.4vh,66px)]">
          {STATEMENT.map((w, i) => (
            <Rise key={i} on={on} delay={0.15 + i * 0.045} className={`inline-block ${w.includes("*") || i < 2 ? "italic" : ""}`}>
              {w.replaceAll("*", "")}
            </Rise>
          ))}
        </p>

        <div className={`flex flex-col gap-[2.4vh] transition-opacity delay-700 duration-900 ${active ? "" : "opacity-0"}`}>
          <div className="flex flex-wrap gap-x-[22px] overflow-hidden border-t border-paper/25 md:gap-x-[clamp(16px,2.2vw,34px)]">
            {TABS.map((label, i) => (
              <button
                key={label}
                onClick={() => setTab(i)}
                className={`relative flex h-12 flex-none items-center gap-2 text-[10px] tracking-[.2em] whitespace-nowrap transition-colors duration-300 hover:text-paper ${i === tab ? "text-paper" : "text-dim"}`}
              >
                <span>{pad(i + 1)}</span>
                <span>{label}</span>
                <span className={`absolute -top-px left-0 h-px bg-paper transition-[width] duration-600 ease-snap ${i === tab ? "w-full" : "w-0"}`} />
              </button>
            ))}
          </div>

          <div className="relative h-[230px] md:h-[min(22vh,210px)]">
            <Panel on={tab === 0} className="grid grid-cols-1 content-start gap-x-[4vw] gap-y-[3vh] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <p className="font-serif text-[clamp(17px,2.1vh,22px)] leading-[1.45] text-pretty text-[#d9d6cf]">
                Two or three sentences in Samuel’s own voice — where he’s from, what he makes, and why it looks the way it does.
              </p>
              <div className="grid grid-cols-[auto_1fr] self-start text-[11px] tracking-[.16em]">
                {FACTS.map(([k, v], j) => (
                  <Fragment key={k}>
                    <span className={`border-t border-paper/25 py-[9px] text-mute ${j === 2 ? "border-b" : ""}`}>{k}</span>
                    <span className={`border-t border-paper/25 py-[9px] text-right ${j === 2 ? "border-b" : ""}`}>{v}</span>
                  </Fragment>
                ))}
              </div>
            </Panel>

            <Panel on={tab === 1} className="grid grid-cols-2 content-start gap-x-[3vw] gap-y-[1.6vh]">
              {PRACTICE.map((t, i) => (
                <div key={t} className="flex items-baseline gap-3 border-b border-paper/25 pb-[1.2vh]">
                  <span className="text-[10px] tracking-[.2em] text-mute">{pad(i + 1)}</span>
                  <span className="font-serif text-[24px] leading-[1.1] italic md:text-[clamp(22px,3.2vh,36px)]">{t}</span>
                </div>
              ))}
            </Panel>

            <Panel on={tab === 2} className="flex flex-wrap content-start gap-x-[1.4vw] gap-y-[1vh] font-serif text-[24px] leading-[1.2] md:text-[clamp(22px,3.2vh,36px)]">
              {CLIENTS.map((c, i) => (
                <Fragment key={c}>
                  {i > 0 && <span className="text-dim">/</span>}
                  <span>{c}</span>
                </Fragment>
              ))}
            </Panel>

            <Panel on={tab === 3} className="flex flex-col items-start gap-[2vh]">
              <a href={`mailto:${EMAIL}`} className="border-b border-paper pb-1 font-serif text-[24px] break-all italic md:text-[clamp(22px,3.2vh,36px)]">{EMAIL}</a>
              <div className="flex flex-wrap gap-6 text-[10px] tracking-[.26em]">
                <a href="#">INSTAGRAM ↗</a>
                <a href="#">VIMEO ↗</a>
                <a href="#">LINKEDIN ↗</a>
              </div>
              <ArrowButton onClick={onContact} className="mt-[1vh]">GET IN TOUCH</ArrowButton>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
