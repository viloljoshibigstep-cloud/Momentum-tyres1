import Link from "next/link";
import {
  Shield,
  Truck,
  Users,
  Award,
  BarChart3,
  Headphones,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "Every Momentum tyre undergoes rigorous quality testing to meet international safety standards. We stand behind every product we ship.",
    stat: "ISO 9001 Certified",
  },
  {
    icon: Truck,
    title: "Same-Day Dispatch",
    description:
      "Orders placed before 2pm NZST on business days are dispatched same day. Our Auckland warehouse stocks all 500+ SKUs ready to go.",
    stat: "95% same-day dispatch rate",
  },
  {
    icon: Users,
    title: "Dedicated Account Managers",
    description:
      "Every dealer gets a dedicated account manager — one point of contact who knows your business and helps you grow.",
    stat: "Average response: 2 hours",
  },
  {
    icon: BarChart3,
    title: "Real-Time Stock Visibility",
    description:
      "Our B2B portal gives you live inventory data across all SKUs 24/7. No phone calls needed to check availability.",
    stat: "500+ SKUs always visible",
  },
  {
    icon: Award,
    title: "Tiered Wholesale Pricing",
    description:
      "Our Gold, Silver, and Bronze tier system rewards volume. The more you buy, the better your margins — built-in incentive to grow.",
    stat: "Up to 25% below RRP",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description:
      "Our technical team provides product training, fitment guidance, and after-sales support. We're the partner behind your expertise.",
    stat: "Free training available",
  },
];

const process = [
  {
    step: "01",
    title: "Apply to Become a Dealer",
    description:
      "Fill out our simple dealer application form. We review applications within 2–3 business days.",
  },
  {
    step: "02",
    title: "Account Activation",
    description:
      "Once approved, we set up your account with the right tier, pricing, and access to our B2B portal.",
  },
  {
    step: "03",
    title: "Browse & Order 24/7",
    description:
      "Log in to your portal, browse 500+ SKUs with your pricing, check live stock, and place orders at any time.",
  },
  {
    step: "04",
    title: "Fast Delivery Nationwide",
    description:
      "Orders are picked, packed, and dispatched same day. Nationwide NZ delivery within 1–3 business days.",
  },
];

const certifications = [
  "ISO 9001:2015 Quality Management",
  "UN ECE R117 Tyre Rolling Sound",
  "UN ECE R30 Passenger Car Tyres",
  "UN ECE R54 Commercial Vehicle Tyres",
  "New Zealand Transport Agency Approved",
  "Australian Standards AS 1973-1997",
];

export default function WhyChooseUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-20">
        <div className="container mx-auto text-center">
          <p className="section-label mb-3">Why Momentum</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
            New Zealand&apos;s Most Reliable
            <br />
            <span className="text-brand-orange">Tyre Distributor</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Over 200 dealers across New Zealand trust Momentum Tyres for quality product, reliable
            stock, and a distribution partnership that helps their business grow.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-orange py-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: "25+", label: "Years in Industry" },
              { value: "500+", label: "SKUs in Stock" },
              { value: "200+", label: "Active Dealers" },
              { value: "95%", label: "Same-Day Dispatch" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black">{s.value}</div>
                <div className="text-sm text-orange-100 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The Momentum Difference</p>
            <h2 className="section-title">6 Reasons Dealers Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="bg-white border border-brand-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-4">
                  <r.icon size={22} className="text-brand-orange" />
                </div>
                <h3 className="font-black text-brand-navy text-lg mb-2">{r.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed mb-4">{r.description}</p>
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-brand-green" />
                  <span className="text-xs font-semibold text-brand-green">{r.stat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-brand-surface">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="section-title">Getting Started Is Simple</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                <div className="text-6xl font-black text-brand-orange/10 mb-2">{p.step}</div>
                <h3 className="font-black text-brand-navy text-lg mb-2">{p.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{p.description}</p>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight size={20} className="text-brand-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-3">Quality Assurance</p>
              <h2 className="section-title mb-6">Certified to the Highest Standards</h2>
              <p className="text-brand-muted mb-8 leading-relaxed">
                Momentum Tyres is certified and compliant with all relevant New Zealand and
                international standards. When you stock our product, you can sell with confidence.
              </p>
              <ul className="space-y-3">
                {certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-700">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-brand-navy rounded-3xl p-10 text-white text-center">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={24} className="text-brand-orange fill-brand-orange" />
                ))}
              </div>
              <h3 className="text-2xl font-black mb-4">Trusted by 200+ Dealers</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                &ldquo;Momentum Tyres has been our go-to supplier for 6 years. The product quality
                is consistent, pricing is competitive, and they actually deliver when they say they
                will. That matters in this industry.&rdquo;
              </p>
              <div>
                <p className="font-semibold">Mike Thompson</p>
                <p className="text-sm text-slate-400">Thompson&apos;s Tyres, Hamilton — Gold Dealer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-orange py-16">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-black mb-4">Ready to Join the Network?</h2>
          <p className="text-orange-100 mb-8 max-w-lg mx-auto">
            Apply to become a Momentum Tyres dealer today and start accessing wholesale pricing,
            live stock, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/become-dealer"
              className="inline-flex items-center gap-2 bg-white text-brand-orange font-bold px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors"
            >
              Apply Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
