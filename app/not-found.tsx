import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-brand-orange/20 mb-4">404</div>
        <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search size={28} className="text-brand-orange" />
        </div>
        <h1 className="text-2xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary justify-center">
            <Home size={16} />
            Go to Homepage
          </Link>
          <Link href="/products" className="btn-ghost-white justify-center">
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
