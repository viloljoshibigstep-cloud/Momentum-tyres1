"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const errorMessages: Record<string, string> = {
  session_expired: "Your admin session has expired. Please sign in again.",
  not_authorized: "This account doesn't have admin access.",
  unauthorized: "Access denied.",
};

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

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
        setErrorMsg(
          error.message.includes("Invalid login")
            ? "Invalid email or password."
            : "Connection failed. Please try again."
        );
        setStatus("error");
        return;
      }

      // Check admin status
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMsg("Authentication failed.");
        setStatus("error");
        return;
      }

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!adminUser) {
        await supabase.auth.signOut();
        setErrorMsg("This account does not have administrator access.");
        setStatus("error");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMsg("Connection failed. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
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
          <div className="flex items-center justify-center gap-2 mt-3">
            <ShieldCheck size={14} className="text-slate-400" />
            <p className="text-slate-400 text-sm">Admin Portal</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-brand-navy">Administrator Sign In</h1>
            <p className="text-brand-muted text-sm mt-1">Restricted access — authorised personnel only</p>
          </div>

          {(errorMsg || errorParam) && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <AlertCircle size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
              <p className="text-sm text-brand-red">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Admin Email
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="admin@momentumtyres.co.nz"
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
                  placeholder="Enter admin password"
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
              className="w-full bg-brand-navy hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  Sign In as Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border text-center">
            <Link href="/" className="text-sm text-brand-muted hover:text-brand-navy">
              ← Back to Public Site
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          &copy; {new Date().getFullYear()} Momentum Tyres. Admin access only.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-orange" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
