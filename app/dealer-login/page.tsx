"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const errorMessages: Record<string, string> = {
  session_expired: "Your session has expired. Please log in again.",
  not_authorized: "This account doesn't have dealer access.",
  suspended: "Your dealer account has been suspended. Please contact us.",
  pending_approval: "Your application is under review. We'll notify you once approved.",
  unauthorized: "You don't have permission to access that area.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const redirectTo = searchParams.get("redirect") || "/dealer/dashboard";

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState(
    errorParam ? errorMessages[errorParam] || "An error occurred." : ""
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        if (error.message.includes("Invalid login")) {
          setErrorMsg("Invalid email or password. Please try again.");
        } else if (error.message.includes("Network")) {
          setErrorMsg("Connection failed. Please check your internet and try again.");
        } else {
          setErrorMsg(error.message);
        }
        setStatus("error");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setErrorMsg("Connection failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                MOMENTUM <span className="text-brand-orange">TYRES</span>
              </span>
            </div>
          </Link>
          <p className="text-slate-400 text-sm mt-3">Dealer Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-brand-navy">Sign In</h1>
            <p className="text-brand-muted text-sm mt-1">Access your wholesale dealer account</p>
          </div>

          {/* Error from URL param or login attempt */}
          {(errorMsg || errorParam) && (
            <div
              className={`flex items-start gap-3 rounded-xl p-4 mb-6 ${
                errorParam === "suspended"
                  ? "bg-red-50 border border-red-200"
                  : errorParam === "pending_approval"
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <AlertCircle
                size={18}
                className={`flex-shrink-0 mt-0.5 ${
                  errorParam === "pending_approval" ? "text-yellow-600" : "text-brand-red"
                }`}
              />
              <p
                className={`text-sm ${
                  errorParam === "pending_approval" ? "text-yellow-700" : "text-brand-red"
                }`}
              >
                {errorMsg}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="dealer@business.co.nz"
              />
              {errors.email && (
                <p className="text-xs text-brand-red mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-navy"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-brand-red mt-1">{errors.password.message}</p>
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
                  Signing in...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Sign In to Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border text-center space-y-3">
            <p className="text-sm text-brand-muted">
              Not a dealer yet?{" "}
              <Link href="/become-dealer" className="text-brand-orange hover:underline font-semibold">
                Apply to Join
              </Link>
            </p>
            <p className="text-xs text-brand-muted">
              Having trouble?{" "}
              <Link href="/contact" className="text-brand-orange hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} Momentum Tyres. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function DealerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-orange" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
