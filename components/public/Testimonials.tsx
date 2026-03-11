import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    company: "Pacific Fleet Services",
    contact: "Jason Taufa",
    role: "Operations Manager",
    city: "Auckland",
    tier: "Gold",
    rating: 5,
    text:
      "Momentum has been our primary tyre supplier for 8 years. The consistency of product quality and the responsiveness of their team is unmatched. The dealer portal has streamlined our ordering process enormously.",
  },
  {
    company: "South Island Truck Centre",
    contact: "Mike Henderson",
    role: "Proprietor",
    city: "Christchurch",
    tier: "Silver",
    rating: 5,
    text:
      "The TBR range from Momentum is exceptional for our commercial fleet customers. Competitive pricing, reliable stock availability and the tiered pricing model rewards our volume perfectly.",
  },
  {
    company: "Kiwi Tyre & Auto",
    contact: "Sarah Ngata",
    role: "Workshop Manager",
    city: "Wellington",
    tier: "Silver",
    rating: 5,
    text:
      "Switched to Momentum 3 years ago and haven't looked back. Their passenger car range covers every fitment we need, stock is always available and the online portal makes ordering quick and easy.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-brand-surface">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Dealer Stories</p>
          <h2 className="section-title">What Our Dealers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.company}
              className="bg-white rounded-2xl p-7 shadow-sm border border-brand-border hover:shadow-md transition-shadow"
            >
              {/* Quote icon */}
              <Quote size={28} className="text-brand-orange/30 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-brand-orange fill-brand-orange" />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {t.contact.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-navy">{t.contact}</p>
                  <p className="text-xs text-brand-muted">
                    {t.role} · {t.company}
                  </p>
                  <p className="text-xs text-brand-muted">{t.city}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      t.tier === "Gold"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.tier}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
