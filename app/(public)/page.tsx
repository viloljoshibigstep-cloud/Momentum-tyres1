import { HeroSection } from "@/components/public/HeroSection";
import { CategoryTicker } from "@/components/public/CategoryTicker";
import { StatsBar } from "@/components/public/StatsBar";
import { CategoryGrid } from "@/components/public/CategoryGrid";
import { PerformanceSection } from "@/components/public/PerformanceSection";
import { FeaturedProducts } from "@/components/public/FeaturedProducts";
import { WhyChooseUs } from "@/components/public/WhyChooseUs";
import { Testimonials } from "@/components/public/Testimonials";
import { DealerCTA } from "@/components/public/DealerCTA";
import { NewsSection } from "@/components/public/NewsSection";
import { getCategories } from "@/services/categories";
import { getFeaturedProducts } from "@/services/products";
import { getNewsArticles } from "@/services/news";

export const revalidate = 3600; // ISR: 1 hour

export default async function HomePage() {
  const [categories, featuredProducts, newsArticles] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewsArticles(3),
  ]);

  return (
    <>
      <HeroSection />
      <CategoryTicker />
      <StatsBar />
      <CategoryGrid categories={categories} />
      <PerformanceSection />
      <FeaturedProducts products={featuredProducts} />
      <WhyChooseUs />
      <Testimonials />
      <DealerCTA />
      <NewsSection articles={newsArticles} />
    </>
  );
}
