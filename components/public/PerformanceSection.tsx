import Image from "next/image";
import Link from "next/link";
import { Shield, Clock, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "ISO-Certified Quality",
    description:
      "Aeolus manufacturing is certified to ISO9001 and ISOTS16949 — stringent quality standards applied across 1.3 million m² of production facilities.",
    score: 5,
    position: "top-left",
  },
  {
    icon: Clock,
    title: "Italian NEO Technology",
    description:
      "The Aeolus NEO range is fully Italian-designed — tread patterns, compounding and casing engineered under licence from a globally renowned Italian tyre company.",
    score: 5,
    position: "top-right",
  },
  {
    icon: Zap,
    title: "Proven on NZ Roads",
    description:
      "Gleeson & Cox Transport has run Aeolus on their 100+ truck fleet since 2007 — consistently delivering the lowest tyre running costs of any brand tested.",
    score: 5,
    position: "bottom-left",
  },
  {
    icon: CheckCircle,
    title: "Top 20 Global Manufacturer",
    description:
      "Aeolus Tyre Co., founded in 1965, is a ChemChina subsidiary supplying commercial, earthmoving and agricultural tyres to all 5 continents.",
    score: 5,
    position: "bottom-right",
  },
];

function ScoreBar({ score, total = 5 }: { score: number; total?: number }) {
  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex gap-0.5">
        {[...Array(total)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-all ${
              i < score ? "bg-brand-green" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-brand-muted font-medium">{score}/{total}</span>
    </div>
  );
}

export function PerformanceSection() {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="container mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <p className="section-label mb-3">Why Aeolus & Inning</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Built for the Demands of NZ Roads
          </h2>
        </div>

        {/* Main grid: features + tyre image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left features */}
          <div className="space-y-4">
            {features.slice(0, 2).map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <feature.icon size={20} className="text-brand-orange mb-3" />
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <ScoreBar score={feature.score} />
              </div>
            ))}
          </div>

          {/* Centre tyre */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-64 h-64 lg:w-72 lg:h-72">
              {/* Glow */}
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl" />
              {/* Crosshair lines */}
              <div className="absolute top-1/2 left-4 right-4 h-px bg-white/20 -translate-y-1/2" />
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/20 -translate-x-1/2" />
              <Image
                src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&q=80"
                alt="Commercial truck with Aeolus tyres"
                fill
                className="object-cover rounded-full relative drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]"
                unoptimized
              />
            </div>
            <Link href="/products" className="btn-primary text-sm">
              Find Your Perfect Tyre
            </Link>
          </div>

          {/* Right features */}
          <div className="space-y-4">
            {features.slice(2, 4).map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <feature.icon size={20} className="text-brand-orange mb-3" />
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <ScoreBar score={feature.score} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
