import Link from "next/link";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { getNewsArticles } from "@/services/news";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

const categoryColors: Record<string, string> = {
  "Industry News": "bg-blue-50 text-blue-700",
  "Product Update": "bg-green-50 text-green-700",
  "Dealer News": "bg-orange-50 text-orange-700",
  "Technical": "bg-purple-50 text-purple-700",
};

export default async function NewsPage() {
  const articles = await getNewsArticles(20);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-navy py-16">
        <div className="container mx-auto text-center">
          <p className="section-label mb-3">Latest Updates</p>
          <h1 className="text-4xl font-black text-white mb-4">News & Insights</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Industry news, product updates, and insights from the Momentum Tyres team.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag size={28} className="text-brand-muted" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">No Articles Yet</h3>
              <p className="text-brand-muted">Check back soon for the latest news and updates.</p>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {articles[0] && (
                <div className="mb-12">
                  <Link href={`/news/${articles[0].slug}`} className="group">
                    <div className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="h-64 lg:h-auto bg-brand-surface flex items-center justify-center">
                          {articles[0].image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={articles[0].image_url}
                              alt={articles[0].title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-8">
                              <div className="text-6xl font-black text-brand-orange/20 mb-2">MT</div>
                              <p className="text-brand-muted text-sm">Momentum Tyres</p>
                            </div>
                          )}
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            {articles[0].category && (
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                  categoryColors[articles[0].category] || "bg-brand-surface text-brand-muted"
                                }`}
                              >
                                {articles[0].category}
                              </span>
                            )}
                            <span className="text-xs text-brand-muted flex items-center gap-1">
                              <Calendar size={12} />
                              {formatDate(articles[0].published_at || articles[0].created_at)}
                            </span>
                          </div>
                          <h2 className="text-2xl font-black text-brand-navy mb-3 group-hover:text-brand-orange transition-colors">
                            {articles[0].title}
                          </h2>
                          {articles[0].excerpt && (
                            <p className="text-brand-muted leading-relaxed mb-6">
                              {articles[0].excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-brand-orange font-semibold text-sm">
                            Read Article <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Article grid */}
              {articles.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.slice(1).map((article) => (
                    <Link key={article.id} href={`/news/${article.slug}`} className="group">
                      <div className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                        <div className="h-44 bg-brand-surface flex items-center justify-center overflow-hidden">
                          {article.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-4xl font-black text-brand-orange/20">MT</div>
                            </div>
                          )}
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            {article.category && (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  categoryColors[article.category] || "bg-brand-surface text-brand-muted"
                                }`}
                              >
                                {article.category}
                              </span>
                            )}
                            <span className="text-xs text-brand-muted ml-auto flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(article.published_at || article.created_at)}
                            </span>
                          </div>
                          <h3 className="font-black text-brand-navy mb-2 group-hover:text-brand-orange transition-colors leading-tight">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-brand-muted text-sm leading-relaxed flex-1 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-brand-orange font-semibold text-xs mt-4">
                            Read more <ArrowRight size={12} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
