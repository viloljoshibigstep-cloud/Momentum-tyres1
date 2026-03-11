import Link from "next/link";
import {
  Award,
  Truck,
  Headphones,
  BarChart3,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const reasons = [
  {
    icon: Award,
    title: "22+ Years in NZ Market",
    description:
      "Established in 2003, we know New Zealand roads, vehicles and the real-world demands of both passenger and commercial tyre applications.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    description:
      "Strategically located distribution centres ensure rapid delivery to all major NZ cities and regions. Most orders dispatched same-day.",
  },
  {
    icon: BarChart3,
    title: "Competitive Tiered Pricing",
    description:
      "Our multi-tier dealer pricing rewards loyalty and volume. The more you order, the better your pricing. Transparent, consistent and fair.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "All Momentum products meet international quality certifications. Every batch is tested for consistency, safety ratings and performance standards.",
  },
  {
    icon: Headphones,
    title: "Dedicated Dealer Support",
    description:
      "A dedicated account manager for every dealer. Technical specs, fitment advice, and product training available to all our partners.",
  },
  {
    icon: Wrench,
    title: "Technical Expertise",
    description:
      "Our team includes qualified tyre engineers who provide fitment guidance, load calculations and application advice for any fleet requirement.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: content */}
          <div>
            <p className="section-label mb-3">Why Momentum</p>
            <h2 className="section-title mb-6">
              The Preferred Choice of
              <br />
              NZ Tyre Dealers
            </h2>
            <p className="text-brand-muted leading-relaxed mb-8">
              From independent tyre shops to national fleet operators like Gleeson &amp; Cox Transport,
              Momentum Tyres delivers the product quality, pricing consistency and personal service
              that keeps our customers coming back year after year.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {["No minimum order", "Same-day dispatch", "Online ordering 24/7", "Tiered pricing"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-brand-navy">{item}</span>
                  </div>
                )
              )}
            </div>

            <Link href="/become-dealer" className="btn-primary">
              Join Our Dealer Network
            </Link>
          </div>

          {/* Right: feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="p-5 bg-brand-surface rounded-2xl border border-brand-border hover:border-brand-orange/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-3">
                  <reason.icon size={20} className="text-brand-orange" />
                </div>
                <h3 className="text-sm font-bold text-brand-navy mb-2">
                  {reason.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
