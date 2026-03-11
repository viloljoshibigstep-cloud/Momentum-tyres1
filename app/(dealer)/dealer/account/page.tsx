"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, AlertCircle, LogOut, User, Building, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, getTierColor } from "@/lib/utils";
import type { Dealer, DealerTier } from "@/types";

const profileSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  contact_name: z.string().min(2, "Contact name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function DealerAccountPage() {
  const router = useRouter();
  const [dealer, setDealer] = useState<Dealer & { tier?: DealerTier } | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileForm = useForm<ProfileData>({ resolver: zodResolver(profileSchema) });
  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/dealer-login"); return; }
      setEmail(user.email || "");

      const { data } = await supabase
        .from("dealers")
        .select("*, tier:dealer_tiers(*)")
        .eq("id", user.id)
        .single();

      if (data) {
        setDealer(data);
        profileForm.reset({
          company_name: data.company_name,
          contact_name: data.contact_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
      setLoading(false);
    }
    load();
  }, [router, profileForm]);

  async function onProfileSubmit(data: ProfileData) {
    setProfileStatus("loading");
    setProfileError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase.from("dealers").update(data).eq("id", user.id);
      if (error) throw error;
      setProfileStatus("success");
      setTimeout(() => setProfileStatus("idle"), 3000);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Update failed");
      setProfileStatus("error");
    }
  }

  async function onPasswordSubmit(data: PasswordData) {
    setPasswordStatus("loading");
    setPasswordError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: data.password });
      if (error) throw error;
      setPasswordStatus("success");
      passwordForm.reset();
      setTimeout(() => setPasswordStatus("idle"), 3000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Password update failed");
      setPasswordStatus("error");
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dealer-login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-brand-navy">My Account</h1>
          <p className="text-brand-muted text-sm mt-1">{email}</p>
        </div>
        {dealer?.tier && (
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${getTierColor(dealer.tier.tier_name)}`}>
            {dealer.tier.tier_name} Dealer
          </span>
        )}
      </div>

      {/* Account info summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Building, label: "Company", value: dealer?.company_name || "—" },
          { icon: User, label: "Member Since", value: dealer ? formatDate(dealer.created_at) : "—" },
          { icon: Shield, label: "Account Status", value: dealer?.status === "active" ? "Active" : dealer?.status || "—" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-brand-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <item.icon size={14} className="text-brand-muted" />
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <p className="font-semibold text-brand-navy text-sm">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Profile form */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 mb-6">
        <h2 className="font-black text-brand-navy mb-5">Business Details</h2>

        {profileStatus === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <AlertCircle size={14} className="text-brand-red" />
            <p className="text-xs text-brand-red">{profileError}</p>
          </div>
        )}

        {profileStatus === "success" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <CheckCircle size={14} className="text-brand-green" />
            <p className="text-xs text-brand-green">Profile updated successfully.</p>
          </div>
        )}

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Company Name *
              </label>
              <input
                {...profileForm.register("company_name")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              {profileForm.formState.errors.company_name && (
                <p className="text-xs text-brand-red mt-1">
                  {profileForm.formState.errors.company_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Contact Name *
              </label>
              <input
                {...profileForm.register("contact_name")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Phone
              </label>
              <input
                {...profileForm.register("phone")}
                type="tel"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Business Address
              </label>
              <input
                {...profileForm.register("address")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={profileStatus === "loading"}
            className="btn-primary text-sm"
          >
            {profileStatus === "loading" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 mb-6">
        <h2 className="font-black text-brand-navy mb-5">Change Password</h2>

        {passwordStatus === "error" && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <AlertCircle size={14} className="text-brand-red" />
            <p className="text-xs text-brand-red">{passwordError}</p>
          </div>
        )}

        {passwordStatus === "success" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <CheckCircle size={14} className="text-brand-green" />
            <p className="text-xs text-brand-green">Password updated successfully.</p>
          </div>
        )}

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                New Password
              </label>
              <input
                {...passwordForm.register("password")}
                type="password"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Min. 8 characters"
              />
              {passwordForm.formState.errors.password && (
                <p className="text-xs text-brand-red mt-1">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Confirm Password
              </label>
              <input
                {...passwordForm.register("confirm")}
                type="password"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Repeat new password"
              />
              {passwordForm.formState.errors.confirm && (
                <p className="text-xs text-brand-red mt-1">
                  {passwordForm.formState.errors.confirm.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={passwordStatus === "loading"}
            className="btn-primary text-sm"
          >
            {passwordStatus === "loading" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-white border border-brand-border rounded-2xl p-6">
        <h2 className="font-black text-brand-navy mb-2">Sign Out</h2>
        <p className="text-sm text-brand-muted mb-4">
          Sign out of your dealer account on this device.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-brand-red text-brand-red hover:bg-red-50 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
