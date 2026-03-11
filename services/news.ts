import { createClient } from "@/lib/supabase/server";
import { NewsArticle } from "@/types";

export async function getNewsArticles(limit = 10): Promise<NewsArticle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data;
}
