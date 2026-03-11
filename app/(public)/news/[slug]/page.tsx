import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { getNewsArticleBySlug, getNewsArticles } from "@/services/news";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = true;

export default async function NewsArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getNewsArticleBySlug(params.slug);

  if (!article) notFound();

  const related = await getNewsArticles(4);
  const relatedFiltered = related.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-12">
        <div className="container mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to News
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              {article.category && (
                <span className="text-xs font-semibold bg-brand-orange/20 text-brand-orange px-2 py-1 rounded">
                  {article.category}
                </span>
              )}
              <span className="text-slate-400 text-xs flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {article.image_url && (
                <div className="rounded-2xl overflow-hidden mb-8 h-72 bg-brand-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {article.excerpt && (
                <p className="text-lg text-brand-muted leading-relaxed mb-8 font-medium border-l-4 border-brand-orange pl-4">
                  {article.excerpt}
                </p>
              )}

              {article.content ? (
                <div className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-orange">
                  {article.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-slate-700 leading-relaxed mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-brand-muted">Full article content coming soon.</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 mb-6">
                  <h3 className="font-black text-brand-navy mb-4 text-sm uppercase tracking-wide">
                    Article Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-brand-muted">
                      <Calendar size={14} />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    {article.category && (
                      <div className="flex items-center gap-2 text-brand-muted">
                        <Tag size={14} />
                        <span>{article.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related */}
                {relatedFiltered.length > 0 && (
                  <div>
                    <h3 className="font-black text-brand-navy mb-4 text-sm uppercase tracking-wide">
                      Related Articles
                    </h3>
                    <div className="space-y-3">
                      {relatedFiltered.map((r) => (
                        <Link
                          key={r.id}
                          href={`/news/${r.slug}`}
                          className="block bg-white border border-brand-border rounded-xl p-3 hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-brand-navy text-sm hover:text-brand-orange transition-colors line-clamp-2">
                            {r.title}
                          </p>
                          <p className="text-xs text-brand-muted mt-1">
                            {formatDate(r.published_at || r.created_at)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
