import { Star, Quote } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Mike Thompson",
    company: "Thompson's Tyres",
    city: "Hamilton",
    tier: "Gold",
    years: 6,
    rating: 5,
    quote:
      "Momentum Tyres has been our go-to supplier for 6 years. The product quality is consistent, pricing is competitive, and they actually deliver when they say they will. That matters in this industry.",
    highlight: "Reliable supply chain that never lets us down.",
  },
  {
    name: "Sarah Chen",
    company: "Pacific Auto Care",
    city: "Auckland",
    tier: "Gold",
    years: 4,
    rating: 5,
    quote:
      "The B2B portal is a game-changer. I can check stock, place orders, and manage everything at 10pm if I need to. No waiting for business hours. Our account manager is also excellent — always responds quickly.",
    highlight: "24/7 ordering has transformed how we manage stock.",
  },
  {
    name: "James Patel",
    company: "Patel's Automotive",
    city: "Wellington",
    tier: "Silver",
    years: 3,
    rating: 5,
    quote:
      "We switched to Momentum 3 years ago after constantly chasing our previous supplier. Night and day difference. Same-day dispatch is real, not just a marketing slogan, and the tyre quality has improved our customer retention.",
    highlight: "Switching was the best decision we made.",
  },
  {
    name: "Rachel O'Brien",
    company: "South Island Tyre Centre",
    city: "Christchurch",
    tier: "Silver",
    years: 2,
    rating: 4,
    quote:
      "Even from Christchurch, delivery is fast and consistent. The product range covers everything from passenger to heavy truck, so we're not piecing together orders from multiple suppliers anymore. Simplified our whole operation.",
    highlight: "One supplier for our entire product range.",
  },
  {
    name: "David Nguyen",
    company: "Express Auto & Tyres",
    city: "Tauranga",
    tier: "Bronze",
    years: 1,
    rating: 5,
    quote:
      "We're a smaller shop but Momentum treats us like we matter. The Bronze tier pricing is still excellent, and we've already grown our tyre revenue significantly in the first year. Looking to hit Silver by end of year.",
    highlight: "Felt valued as a dealer from day one.",
  },
  {
    name: "Karen Wells",
    company: "Wells Fleet Services",
    city: "Palmerston North",
    tier: "Gold",
    years: 5,
    rating: 5,
    quote:
      "We run a large fleet operation and Momentum is critical to keeping our trucks on the road. The TBR range is exceptional — load ratings, tread life, everything is spec-on. The dedicated account manager handles our custom pricing without fuss.",
    highlight: "Critical partner for our fleet operations.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= rating ? "text-brand-orange fill-brand-orange" : "text-brand-border"}
        />
      ))}
    </div>
  );
}

const tierColors: Record<string, string> = {
  Gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Silver: "bg-slate-50 text-slate-600 border-slate-200",
  Bronze: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto text-center">
          <p className="section-label mb-3">Dealer Stories</p>
          <h1 className="text-4xl font-black text-white mb-4">
            What Our Dealers Say
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Don&apos;t just take our word for it. Hear from the dealers who run their businesses
            with Momentum Tyres.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-black text-white">200+</div>
              <div className="text-xs text-slate-400 mt-1">Active Dealers</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">4.9/5</div>
              <div className="text-xs text-slate-400 mt-1">Average Rating</div>
            </div>
            <div className="w-px h-10 bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">97%</div>
              <div className="text-xs text-slate-400 mt-1">Renewal Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-brand-surface">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-brand-border rounded-2xl p-7 hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Quote icon */}
                <Quote size={24} className="text-brand-orange/30 mb-4 flex-shrink-0" />

                {/* Quote */}
                <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Highlight */}
                <div className="bg-brand-surface rounded-lg px-3 py-2 mb-5">
                  <p className="text-xs font-semibold text-brand-orange">{t.highlight}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
                  <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-navy text-sm truncate">{t.name}</p>
                    <p className="text-xs text-brand-muted truncate">
                      {t.company} · {t.city}
                    </p>
                    <StarRating rating={t.rating} />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md border flex-shrink-0 ${tierColors[t.tier]}`}
                  >
                    {t.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="bg-brand-navy rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-black mb-4">Join Our Dealer Network</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Be one of 200+ dealers who trust Momentum Tyres to keep their customers happy and
              their business growing.
            </p>
            <Link
              href="/become-dealer"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Apply to Become a Dealer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
