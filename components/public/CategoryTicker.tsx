const ITEMS = [
  "Passenger Car (PCR)",
  "SUV & 4×4",
  "Light Truck",
  "Truck & Bus (TBR)",
  "Off-Road",
  "Aeolus",
  "Inning Tyres",
  "NEO Technology",
  "ISO 9001 Certified",
  "NZ Nationwide",
  "Same-Day Dispatch",
  "500+ Product SKUs",
];

export function CategoryTicker() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-[#060D18] border-b border-white/[0.05] py-3.5 overflow-hidden select-none">
      <div className="animate-ticker flex items-center whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 px-7">
              {item}
            </span>
            <span className="w-[3px] h-[3px] rounded-full bg-brand-orange/40 shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}
