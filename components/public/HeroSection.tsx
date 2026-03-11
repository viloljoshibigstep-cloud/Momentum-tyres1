"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=85",
    caption: "Commercial Fleet · TBR",
  },
  {
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85",
    caption: "Passenger Car · PCR",
  },
  {
    img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1920&q=85",
    caption: "SUV & 4×4 · Light Truck",
  },
];

const ROTATING_WORDS = ["Trusted", "Preferred", "Leading"];

const PROOF_PILLS = [
  "Gleeson & Cox — 100+ trucks since 2007",
  "Aeolus NEO Italian-engineered technology",
  "Same-day dispatch · Wiri, Auckland",
];

function StatCounter({
  target,
  suffix,
  label,
  delay,
  noComma = false,
}: {
  target: number;
  suffix: string;
  label: string;
  delay: number;
  noComma?: boolean;
}) {
  const [val, setVal] = useState(target > 1000 ? target - 50 : 0);

  useEffect(() => {
    const t = setTimeout(() => {
      const start = Date.now();
      const from = target > 1000 ? target - 50 : 0;
      const dur = 1800;
      function step() {
        const p = Math.min((Date.now() - start) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(from + e * (target - from)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);

  return (
    <div className="py-5 px-4 lg:px-6 text-center border-r border-white/[0.08] last:border-0">
      <div className="text-xl lg:text-2xl font-black text-white tabular-nums leading-none">
        {noComma ? val : val.toLocaleString()}
        {suffix}
      </div>
      <div className="text-[10px] text-slate-500 uppercase tracking-[0.18em] mt-1.5">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  // Slide rotation every 5s
  useEffect(() => {
    const t = setInterval(() => setSlideIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Word rotation every 3.2s
  useEffect(() => {
    const t = setInterval(() => {
      setWordVisible(false);
      const inner = setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setWordVisible(true);
      }, 280);
      return () => clearTimeout(inner);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#08111F]" style={{ minHeight: "92vh" }}>
      {/* ── Cycling slide backgrounds ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.img}
          className={cn("absolute inset-0 slide-transition", i === slideIdx ? "opacity-100" : "opacity-0")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.img} alt="" aria-hidden className="w-full h-full object-cover" />
        </div>
      ))}

      {/* ── Overlays ── */}
      {/* Strong left-dominant gradient to keep text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08111F] via-[#08111F]/90 to-[#08111F]/35" />
      {/* Bottom fade into page */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#08111F]/75 via-transparent to-transparent" />
      {/* Atmospheric orange glow — subtle warmth */}
      <div className="absolute -left-24 top-1/3 w-[560px] h-[560px] bg-brand-orange/[0.07] rounded-full blur-[180px] pointer-events-none" />

      {/* Fine grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Top accent bar */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-brand-orange" />

      {/* ── Main content ── */}
      <div
        className="container mx-auto relative z-10 flex flex-col justify-center"
        style={{ minHeight: "calc(92vh - 64px)", paddingTop: "5rem", paddingBottom: "8rem" }}
      >
        <div className="max-w-2xl">
          {/* Brand tag */}
          <div className="flex items-center gap-3 mb-8 hero-enter" style={{ animationDelay: "0ms" }}>
            <span className="h-px w-10 bg-brand-orange shrink-0" />
            <span className="text-brand-orange text-[10px] font-bold uppercase tracking-[0.38em]">
              Since 2003 · New Zealand
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-black text-white leading-[0.88] tracking-tight mb-7 hero-enter"
            style={{ fontSize: "clamp(3rem, 7.2vw, 5.6rem)", animationDelay: "70ms" }}
          >
            <span
              className="block font-extrabold text-slate-300/90"
              style={{ fontSize: "clamp(1.2rem, 2.8vw, 1.9rem)", letterSpacing: "-0.01em" }}
            >
              New Zealand&apos;s
            </span>
            <span className="block">
              <span
                className={cn(
                  "text-brand-orange inline-block transition-all duration-[280ms] ease-out",
                  wordVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                )}
              >
                {ROTATING_WORDS[wordIdx]}
              </span>{" "}
              Tyre
            </span>
            <span className="block">Distributor</span>
          </h1>

          {/* Sub-copy */}
          <p
            className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8 max-w-[500px] hero-enter"
            style={{ animationDelay: "150ms" }}
          >
            Premium Aeolus and Inning tyres for passenger cars, commercial fleets and heavy
            transport. Supplying New Zealand since 2003.
          </p>

          {/* Proof pills */}
          <div className="flex flex-wrap gap-2.5 mb-10 hero-enter" style={{ animationDelay: "230ms" }}>
            {PROOF_PILLS.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-white/[0.055] border border-white/[0.09] rounded-full px-3.5 py-1.5 backdrop-blur-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                {pill}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 hero-enter" style={{ animationDelay: "310ms" }}>
            <Link href="/products" className="btn-primary text-sm px-7 py-3">
              Browse Products <ArrowRight size={15} />
            </Link>
            <Link href="/become-dealer" className="btn-ghost-white text-sm px-7 py-3">
              Become a Dealer
            </Link>
          </div>
        </div>
      </div>

      {/* ── Slide indicator (bottom right) ── */}
      <div className="absolute bottom-[76px] right-8 lg:right-12 z-10 flex flex-col items-end gap-2.5">
        <p className="text-[10px] text-slate-500 uppercase tracking-[0.22em] transition-all duration-500">
          {SLIDES[slideIdx].caption}
        </p>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className={cn(
                "h-[2px] rounded-full transition-all duration-500",
                i === slideIdx ? "w-8 bg-brand-orange" : "w-3.5 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/[0.07] bg-black/25 backdrop-blur-md">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4">
          {[
            { target: 2003, suffix: "", label: "Established", delay: 900, noComma: true },
            { target: 500, suffix: "+", label: "Product SKUs", delay: 1050 },
            { target: 200, suffix: "+", label: "Active Dealers", delay: 1200 },
            { target: 100, suffix: "+", label: "Fleet Trucks", delay: 1350 },
          ].map((s) => (
            <StatCounter key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
