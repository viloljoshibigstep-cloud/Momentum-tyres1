export function StatsBar() {
  return (
    <section className="bg-brand-orange">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-orange-400">
          {[
            { value: "22+", label: "Years in NZ", sub: "Established 2003" },
            { value: "500+", label: "Product SKUs", sub: "Across all categories" },
            { value: "200+", label: "Active Dealers", sub: "Nationwide network" },
            { value: "100+", label: "Fleet Trucks", sub: "Running Aeolus daily" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="py-8 px-6 lg:px-10 text-center lg:text-left"
            >
              <div className="text-4xl lg:text-5xl font-black text-white leading-none mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-white/90 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-orange-100/80 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
