"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  width: z.string().optional(),
  aspect_ratio: z.string().optional(),
  rim_diameter: z.string().optional(),
  pattern: z.string().optional(),
  application: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  base_price: z.number().positive().optional().nullable(),
  category_id: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [categories, setCategories] = useState<Pick<Category, 'id' | 'name' | 'slug'>[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, is_featured: false },
  });

  const nameValue = watch("name");

  // Auto-slug from name (only for new products)
  useEffect(() => {
    if (isNew && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, isNew, setValue]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const [catRes, productRes] = await Promise.all([
      supabase.from("categories").select("id, name, slug").order("sort_order"),
      !isNew
        ? supabase.from("products").select("*").eq("id", id).single()
        : Promise.resolve({ data: null }),
    ]);
    setCategories(catRes.data || []);

    if (productRes.data) {
      const p = productRes.data;
      reset({
        name: p.name,
        slug: p.slug,
        sku: p.sku || "",
        size: p.size,
        width: p.width || "",
        aspect_ratio: p.aspect_ratio || "",
        rim_diameter: p.rim_diameter || "",
        pattern: p.pattern || "",
        application: p.application || "",
        description: p.description || "",
        image_url: p.image_url || "",
        base_price: p.base_price,
        category_id: p.category_id || "",
        is_active: p.is_active,
        is_featured: p.is_featured,
      });
    }
    setLoading(false);
  }, [id, isNew, reset]);

  useEffect(() => { load(); }, [load]);

  async function onSubmit(data: FormData) {
    setSaveStatus("loading");
    setSaveError("");
    try {
      const supabase = createClient();
      const payload = {
        ...data,
        sku: data.sku || null,
        image_url: data.image_url || null,
        category_id: data.category_id || null,
        base_price: data.base_price || null,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
      }

      setSaveStatus("success");
      setTimeout(() => {
        if (isNew) router.push("/admin/products");
        else setSaveStatus("idle");
      }, 1500);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
      setSaveStatus("error");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("products").delete().eq("id", id);
    router.push("/admin/products");
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="text-brand-muted hover:text-brand-navy">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-black text-brand-navy">
            {isNew ? "Add New Product" : "Edit Product"}
          </h1>
        </div>
        {!isNew && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-brand-red hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>

      {saveStatus === "error" && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <AlertCircle size={16} className="text-brand-red flex-shrink-0 mt-0.5" />
          <p className="text-sm text-brand-red">{saveError}</p>
        </div>
      )}

      {saveStatus === "success" && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <CheckCircle size={16} className="text-brand-green" />
          <p className="text-sm text-brand-green">Product saved successfully.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          <h2 className="font-black text-brand-navy mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Product Name *
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Momentum Revex"
              />
              {errors.name && <p className="text-xs text-brand-red mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Slug *
              </label>
              <input
                {...register("slug")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="momentum-revex-225-45r17"
              />
              {errors.slug && <p className="text-xs text-brand-red mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                SKU
              </label>
              <input
                {...register("sku")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="MT-REV-22545R17"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                {...register("category_id")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Application
              </label>
              <select
                {...register("application")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              >
                <option value="">Select</option>
                <option>Passenger</option>
                <option>SUV</option>
                <option>Light Truck</option>
                <option>Truck</option>
                <option>Off-Road</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sizing */}
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          <h2 className="font-black text-brand-navy mb-4">Tyre Sizing</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Full Size * (e.g. 225/45R17)
              </label>
              <input
                {...register("size")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="225/45R17"
              />
              {errors.size && <p className="text-xs text-brand-red mt-1">{errors.size.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Width
              </label>
              <input
                {...register("width")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="225"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Aspect Ratio
              </label>
              <input
                {...register("aspect_ratio")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Rim Diameter
              </label>
              <input
                {...register("rim_diameter")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="17"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Pattern
              </label>
              <input
                {...register("pattern")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="Asymmetric"
              />
            </div>
          </div>
        </div>

        {/* Pricing + image */}
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          <h2 className="font-black text-brand-navy mb-4">Pricing & Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Base Price (NZD ex. GST)
              </label>
              <input
                {...register("base_price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="89.95"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Image URL
              </label>
              <input
                {...register("image_url")}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                placeholder="https://..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy uppercase tracking-wide mb-1.5">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange resize-none"
                placeholder="Product description..."
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white border border-brand-border rounded-2xl p-6">
          <h2 className="font-black text-brand-navy mb-4">Visibility</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register("is_active")} type="checkbox" className="w-4 h-4 accent-brand-orange" />
              <span className="text-sm font-semibold text-brand-navy">Active (visible in catalogue)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register("is_featured")} type="checkbox" className="w-4 h-4 accent-brand-orange" />
              <span className="text-sm font-semibold text-brand-navy">Featured on homepage</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saveStatus === "loading"}
            className="btn-primary"
          >
            {saveStatus === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              isNew ? "Create Product" : "Save Changes"
            )}
          </button>
          <Link href="/admin/products" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
