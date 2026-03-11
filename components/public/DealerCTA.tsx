import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Tiered dealer pricing (Gold / Silver / Bronze)",
  "Real-time stock visibility",
  "Online trade ordering portal",
  "Dedicated account manager",
  "Same-day dispatch for stocked items",
];

export function DealerCTA() {
  return (
    <section className="py-20 hero-dark relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute -right-32 -top-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl" />
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <p className="section-label mb-4">Partner With Us</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              Join New Zealand&apos;s
              <br />
              <span className="text-brand-orange">Fastest Growing</span>
              <br />
              Dealer Network
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8">
              Apply to become an authorised Momentum Tyres dealer and access
              exclusive wholesale pricing, full stock visibility and our streamlined
              B2B ordering platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/become-dealer" className="btn-primary">
                Apply Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-ghost-white">
                Talk to Sales
              </Link>
            </div>
          </div>

          {/* Right: benefit list */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-6">
              What You Get as a Dealer
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={12} className="text-brand-orange" />
                  </div>
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-slate-400 text-xs">
                Already a dealer?{" "}
                <Link
                  href="/dealer-login"
                  className="text-brand-orange hover:underline font-medium"
                >
                  Sign in to your portal →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
