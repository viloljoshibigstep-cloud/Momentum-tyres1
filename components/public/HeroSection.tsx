import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const proofPoints = [
  "Gleeson & Cox — 100+ trucks on Aeolus since 2007",
  "Aeolus NEO: Italian-engineered premium technology",
  "Same-day dispatch from Wiri, Auckland",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy" style={{ minHeight: "88vh" }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80"
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Strong left-to-right gradient — keeps text legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/30" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Orange top stripe */}
      <div className="absolute top-0 inset-x-0 h-1 bg-brand-orange" />

      {/* Vertical left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-orange via-brand-orange/60 to-transparent" />

      {/* Main content */}
      <div
        className="container mx-auto relative z-10 flex flex-col justify-center"
        style={{ minHeight: "calc(88vh - 56px)", paddingTop: "6rem", paddingBottom: "5rem" }}
      >
        <div className="max-w-3xl">
          {/* Tagline label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-brand-orange" />
            <span className="text-brand-orange text-xs font-bold uppercase tracking-[0.3em]">
              Where Service Meets The Road
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="font-black text-white leading-[0.88] tracking-tight mb-8"
            style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
          >
            New Zealand&apos;s<br />
            <span className="text-brand-orange">Trusted</span> Tyre<br />
            Distributor
          </h1>

          {/* Sub-copy */}
          <p className="text-slate-300 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl">
            Premium Aeolus and Inning tyres for passenger cars, commercial
            fleets and heavy transport. Supplying New Zealand since 2003 —
            with a reputation built on product quality and personal service.
          </p>

          {/* Proof points */}
          <div className="flex flex-col gap-3 mb-10">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-brand-orange flex-shrink-0" />
                <span className="text-slate-300 text-sm">{point}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="btn-primary text-base px-8 py-4 hover:scale-[1.02] transition-transform"
            >
              Browse Products
              <ArrowRight size={20} />
            </Link>
            <Link href="/become-dealer" className="btn-ghost-white text-base px-8 py-4">
              Become a Dealer
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { value: "2003", label: "Founded" },
            { value: "500+", label: "Product SKUs" },
            { value: "200+", label: "Active Dealers" },
            { value: "NZ Wide", label: "Delivery" },
          ].map((s) => (
            <div
              key={s.label}
              className="py-5 px-6 text-center backdrop-blur-sm bg-black/20"
            >
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
