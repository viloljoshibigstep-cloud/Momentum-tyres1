import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { NewsArticle } from "@/types";
import { formatDateShort } from "@/lib/utils";

// Fallback articles when DB is empty
const fallbackArticles: Partial<NewsArticle>[] = [
  {
    id: "1",
    slug: "momentum-expands-tbr-range-2024",
    title: "Momentum Expands TBR Range with New Heavy-Duty SKUs",
    excerpt:
      "We are proud to introduce 12 new Truck & Bus Radial tyres to our portfolio, covering key commercial applications across NZ fleets.",
    image_url:
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80",
    category: "Product News",
    published_at: "2024-10-15T00:00:00Z",
  },
  {
    id: "2",
    slug: "new-dealer-portal-launch",
    title: "Upgraded Dealer Portal Now Live — Faster Ordering",
    excerpt:
      "Our new B2B dealer portal is now live with improved product search, real-time stock visibility, and streamlined order submission.",
    image_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    category: "Company News",
    published_at: "2024-09-01T00:00:00Z",
  },
  {
    id: "3",
    slug: "suv-range-performance-testing",
    title: "Momentum SUV Range Achieves Top EU Label Ratings",
    excerpt:
      "Independent testing confirms our Trailblazer SUV range achieves A-rated wet grip and fuel efficiency ratings across the full size lineup.",
    image_url:
      "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=400&q=80",
    category: "Technical",
    published_at: "2024-08-20T00:00:00Z",
  },
];

interface NewsSectionProps {
  articles?: NewsArticle[];
}

export function NewsSection({ articles }: NewsSectionProps) {
  const displayArticles =
    articles && articles.length > 0 ? articles.slice(0, 3) : fallbackArticles;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">Latest Updates</p>
            <h2 className="section-title">Industry News</h2>
          </div>
          <Link
            href="/news"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-orange hover:gap-3 transition-all"
          >
            All Articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group flex flex-col bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-md hover:border-brand-orange/30 transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={
                    article.image_url ||
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
                  }
                  alt={article.title || ""}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                {article.category && (
                  <span className="absolute top-3 left-3 bg-brand-navy text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-3">
                  <Calendar size={12} />
                  {article.published_at
                    ? formatDateShort(article.published_at)
                    : ""}
                </div>
                <h3 className="font-bold text-brand-navy text-base leading-snug mb-3 group-hover:text-brand-orange transition-colors line-clamp-2 flex-1">
                  {article.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand-orange mt-auto group-hover:gap-2 transition-all">
                  Read More <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
