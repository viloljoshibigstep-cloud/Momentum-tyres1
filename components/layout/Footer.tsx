import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";

const productLinks = [
  { label: "Passenger Car (PCR)", href: "/products/pcr" },
  { label: "SUV & 4x4", href: "/products/suv-4x4" },
  { label: "Light Truck", href: "/products/light-truck" },
  { label: "Truck & Bus (TBR)", href: "/products/tbr" },
  { label: "Off-Road", href: "/products/off-road" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "/contact" },
];

const dealerLinks = [
  { label: "Become a Dealer", href: "/become-dealer" },
  { label: "Dealer Login", href: "/dealer-login" },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Main footer */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-orange rounded flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <div>
                <div className="font-black text-lg leading-none tracking-tight">MOMENTUM</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 leading-none">
                  Tyres
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              New Zealand&apos;s trusted tyre distributor since 2003. Premium Aeolus
              and Inning tyres — where service meets the road.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-orange flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-5">
              Products
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mt-8 mb-5">
              Dealers
            </h3>
            <ul className="space-y-3">
              {dealerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-5">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-400">
                  17 Aerovista Place, <br />
                  Wiri, Auckland <br />
                  New Zealand
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-orange flex-shrink-0" />
                <a
                  href="tel:0800236587"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  0800 236 587
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-orange flex-shrink-0" />
                <a
                  href="mailto:sales@momentumtyres.co.nz"
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  sales@momentumtyres.co.nz
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Business Hours
              </p>
              <p className="text-sm text-slate-300">Mon–Fri: 8:00 AM – 5:00 PM</p>
              <p className="text-sm text-slate-300">Sat: 9:00 AM – 1:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Momentum Tyres Ltd. All rights reserved.
            Registered in New Zealand.
          </p>
          <div className="flex items-center gap-5 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
