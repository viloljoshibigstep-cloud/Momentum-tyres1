"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_name: z.string().min(2, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  abn: z.string().optional(),
  business_type: z.string().min(1, "Please select a business type"),
  annual_volume: z.string().min(1, "Please select estimated volume"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const benefits = [
  "Tiered wholesale pricing (Gold / Silver / Bronze)",
  "Real-time stock visibility across 500+ SKUs",
  "Online B2B ordering portal 24/7",
  "Dedicated account manager",
  "Same-day dispatch for in-stock items",
  "Technical product training & support",
  "Access to exclusive dealer promotions",
];

export default function BecomeDealerPage() {
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
      const { error } = await supabase.from("dealer_applications").insert([data]);
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
          <p className="section-label mb-3">Dealer Network</p>
          <h1 className="text-4xl font-black text-white mb-4">Become a Momentum Dealer</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Apply to join New Zealand&apos;s fastest growing tyre distributor network and
            access exclusive wholesale pricing and ordering tools.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-black text-brand-navy mb-6">
                What You Get as a Momentum Dealer
              </h2>
              <ul className="space-y-4 mb-10">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Already a dealer */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border p-6">
                <h3 className="font-bold text-brand-navy mb-2">Already a Dealer?</h3>
                <p className="text-sm text-brand-muted mb-4">
                  Log in to your dealer portal to browse products, check stock and place orders.
                </p>
                <Link href="/dealer-login" className="btn-primary text-sm py-2">
                  Go to Dealer Login <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white border border-brand-border rounded-2xl p-8 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-brand-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-brand-green" />
                  </div>
                  <h3 className="text-xl font-black text-brand-navy mb-3">
                    Application Submitted!
                  </h3>
                  <p className="text-brand-muted mb-6">
                    Thank you for your application. Our team will review it and contact you
                    within 2–3 business days.
                  </p>
                  <Link href="/" className="btn-primary text-sm">
                    Back to Home
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black text-brand-navy mb-6">
                    Dealer Application Form
                  </h2>

                  {status === "error" && (
                    <div className="flex items-start gap-3 bg-brand-red-light border border-red-200 rounded-xl p-4 mb-6">
                      <AlertCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-brand-red">{errorMsg}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Company Name *
                        </label>
                        <input
                          {...register("company_name")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="Your Business Ltd"
                        />
                        {errors.company_name && (
                          <p className="text-xs text-brand-red mt-1">{errors.company_name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Contact Name *
                        </label>
                        <input
                          {...register("contact_name")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="John Smith"
                        />
                        {errors.contact_name && (
                          <p className="text-xs text-brand-red mt-1">{errors.contact_name.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Email *
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
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Phone *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="+64 9 555 0000"
                        />
                        {errors.phone && (
                          <p className="text-xs text-brand-red mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                        Business Address *
                      </label>
                      <input
                        {...register("address")}
                        className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        placeholder="123 Main St, Auckland"
                      />
                      {errors.address && (
                        <p className="text-xs text-brand-red mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          NZBN / GST Number
                        </label>
                        <input
                          {...register("abn")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          placeholder="123456789"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                          Business Type *
                        </label>
                        <select
                          {...register("business_type")}
                          className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                        >
                          <option value="">Select type</option>
                          <option>Independent Tyre Shop</option>
                          <option>Auto Repair Workshop</option>
                          <option>Fleet Operator</option>
                          <option>Tyre & Wheel Specialist</option>
                          <option>Other</option>
                        </select>
                        {errors.business_type && (
                          <p className="text-xs text-brand-red mt-1">{errors.business_type.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                        Estimated Annual Tyre Volume *
                      </label>
                      <select
                        {...register("annual_volume")}
                        className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                      >
                        <option value="">Select volume</option>
                        <option>Under 200 tyres/year</option>
                        <option>200–500 tyres/year</option>
                        <option>500–1,000 tyres/year</option>
                        <option>1,000–5,000 tyres/year</option>
                        <option>5,000+ tyres/year</option>
                      </select>
                      {errors.annual_volume && (
                        <p className="text-xs text-brand-red mt-1">{errors.annual_volume.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                        Additional Message
                      </label>
                      <textarea
                        {...register("message")}
                        rows={3}
                        className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                        placeholder="Tell us more about your business or any specific requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full btn-primary justify-center py-3"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>

                    <p className="text-xs text-brand-muted text-center">
                      By submitting you agree to our{" "}
                      <Link href="/terms" className="text-brand-orange hover:underline">
                        Terms & Conditions
                      </Link>
                    </p>
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
