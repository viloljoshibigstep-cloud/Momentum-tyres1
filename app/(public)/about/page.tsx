import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Globe, Users, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Momentum Tyres — New Zealand's trusted tyre distributor since 2003.",
};

const milestones = [
  { year: "2003", event: "Momentum Tyres founded as the New Zealand distributor for Aeolus Tyres" },
  { year: "2007", event: "Gleeson & Cox Transport begins running Aeolus on their entire 100+ truck fleet" },
  { year: "2010", event: "Momentum acquired by Gleeson & Cox Transport — securing supply for the heavy transport industry" },
  { year: "2017", event: "Aeolus launches the NEO range: Italian-designed premium truck tyres under ChemChina licence" },
  { year: "2020", event: "200+ active dealer partners across New Zealand" },
  { year: "2024", event: "New B2B digital ordering platform launched for all dealer partners" },
];

const values = [
  {
    icon: Award,
    title: "Quality First",
    desc: "Every product in our range meets international quality certifications before reaching our dealers.",
  },
  {
    icon: Users,
    title: "Dealer Partnership",
    desc: "We build long-term relationships with our dealers, providing support, training and exclusive pricing tiers.",
  },
  {
    icon: Globe,
    title: "NZ Market Focus",
    desc: "Our product selection is curated specifically for New Zealand roads, climate and vehicle types.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Growth",
    desc: "We continually expand our range to serve new markets, applications and customer requirements.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)", backgroundSize: "50px 50px" }} />
        <div className="container mx-auto relative text-center">
          <p className="section-label mb-4">Our Story</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Where Service Meets The Road.
            <br />
            <span className="text-brand-orange">Since 2003.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Momentum Tyres began as New Zealand&apos;s dedicated distributor for Aeolus Tyres —
            and has since grown into the preferred wholesale tyre partner for independent retailers,
            fleet operators and tyre specialists nationwide.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=700&q=80"
                alt="Momentum Tyres warehouse"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="section-label mb-4">Who We Are</p>
              <h2 className="section-title mb-6">
                New Zealand&apos;s Trusted Tyre Distributor
              </h2>
              <div className="space-y-4 text-brand-muted leading-relaxed">
                <p>
                  Momentum Tyres was started in 2003 as the exclusive New Zealand distributor
                  for Aeolus Tyres. Aeolus quickly gained a reputation for delivering trouble-free
                  running, excellent mileage and low running costs across a wide range of
                  application-specific markets.
                </p>
                <p>
                  In February 2010, Momentum was acquired by Gleeson & Cox Transport — one of NZ&apos;s
                  largest heavy transport operators, who had been running Aeolus on almost every one
                  of their 100+ trucks since 2007. The acquisition ensured a continued commitment to
                  providing great tyres and outstanding service to the entire heavy transport
                  industry in New Zealand.
                </p>
                <p>
                  Today, alongside Aeolus and the premium Italian-engineered NEO range, we also
                  stock Inning tyres — covering passenger, SUV, light truck, TBR and off-road
                  categories with 500+ SKUs available to our nationwide dealer network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-surface py-14 border-y border-brand-border">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "22+", label: "Years in NZ" },
              { value: "500+", label: "Product SKUs" },
              { value: "200+", label: "Dealer Partners" },
              { value: "100+", label: "Fleet Trucks" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black text-brand-navy">{stat.value}</div>
                <div className="text-sm text-brand-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">What Drives Us</p>
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div key={v.title} className="p-6 bg-brand-surface rounded-2xl border border-brand-border">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
                  <v.icon size={20} className="text-brand-orange" />
                </div>
                <h3 className="font-bold text-brand-navy mb-2">{v.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-brand-navy">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Our Journey</p>
            <h2 className="text-3xl font-black text-white">Key Milestones</h2>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-6">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center font-bold text-xs text-white flex-shrink-0 relative z-10">
                    {m.year.slice(2)}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1">
                    <span className="text-brand-orange font-bold text-sm">{m.year}</span>
                    <p className="text-slate-300 text-sm mt-1">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-black text-brand-navy mb-4">
            Ready to Partner With Us?
          </h2>
          <p className="text-brand-muted mb-8 max-w-xl mx-auto">
            Join our dealer network and access NZ&apos;s most comprehensive wholesale tyre catalogue
            with exclusive tiered pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-dealer" className="btn-primary">Apply to Become a Dealer</Link>
            <Link href="/contact" className="btn-secondary">Contact Our Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
