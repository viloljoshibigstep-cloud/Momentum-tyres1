"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2, Phone, Mail, MapPin, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "0800 236 587",
    sub: "Mon–Fri 8am–5pm NZST",
  },
  {
    icon: Mail,
    label: "Email",
    value: "sales@momentumtyres.co.nz",
    sub: "We reply within 1 business day",
  },
  {
    icon: MapPin,
    label: "Head Office",
    value: "17 Aerovista Place, Wiri",
    sub: "Auckland, New Zealand",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Monday – Friday",
    sub: "8:00am – 5:00pm NZST",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.from("contact_submissions").insert([data]);
      if (error) throw error;
      setStatus("success");
      reset();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto text-center">
          <p className="section-label mb-3">Get In Touch</p>
          <h1 className="text-4xl font-black text-white mb-4">Contact Momentum Tyres</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Have a question about our products, pricing, or dealer programme? Our team is here to
            help.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-black text-brand-navy mb-6">Contact Information</h2>
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-brand-orange" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="font-semibold text-brand-navy text-sm">{item.value}</p>
                      <p className="text-xs text-brand-muted">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="mt-8 rounded-2xl overflow-hidden border border-brand-border h-48 bg-brand-surface flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-brand-muted mx-auto mb-2" />
                  <p className="text-sm text-brand-muted">17 Aerovista Place, Wiri</p>
                  <p className="text-xs text-brand-muted">New Zealand</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-brand-green" />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-3">Message Sent!</h3>
                  <p className="text-brand-muted mb-6">
                    Thank you for reaching out. We&apos;ll get back to you within 1 business day.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn-primary text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-brand-navy mb-6">Send Us a Message</h2>

                  {status === "error" && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                      <AlertCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-brand-red">{errorMsg}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Your Name *
                        </label>
                        <input
                          {...register("name")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="John Smith"
                        />
                        {errors.name && (
                          <p className="text-xs text-brand-red mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Email Address *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="john@business.co.nz"
                        />
                        {errors.email && (
                          <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Phone Number
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="+64 9 555 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Subject *
                        </label>
                        <select
                          {...register("subject")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                        >
                          <option value="">Select a subject</option>
                          <option>Product Enquiry</option>
                          <option>Dealer Programme</option>
                          <option>Pricing & Wholesale</option>
                          <option>Technical Support</option>
                          <option>Order / Delivery</option>
                          <option>Other</option>
                        </select>
                        {errors.subject && (
                          <p className="text-xs text-brand-red mt-1">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                        Message *
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                        placeholder="Tell us how we can help..."
                      />
                      {errors.message && (
                        <p className="text-xs text-brand-red mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full btn-primary justify-center py-3"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
