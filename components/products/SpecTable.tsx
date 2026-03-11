import { ProductSpecifications } from "@/types";

interface SpecTableProps {
  size: string;
  pattern?: string | null;
  application?: string | null;
  specifications?: ProductSpecifications | null;
  sku?: string | null;
}

const specLabels: Record<keyof ProductSpecifications, string> = {
  load_index: "Load Index",
  speed_rating: "Speed Rating",
  tread_depth_mm: "Tread Depth (mm)",
  ply_rating: "Ply Rating",
  construction: "Construction",
  tread_pattern: "Tread Pattern",
  sidewall: "Sidewall",
  overall_diameter_mm: "Overall Diameter (mm)",
  section_width_mm: "Section Width (mm)",
  rim_width_range: "Rim Width Range",
  max_load_kg: "Max Load (kg)",
  max_pressure_kpa: "Max Pressure (kPa)",
  eu_label_fuel: "EU Fuel Efficiency",
  eu_label_wet: "EU Wet Grip",
  noise_db: "Noise Level (dB)",
  noise_class: "Noise Class",
};

export function SpecTable({ size, pattern, application, specifications, sku }: SpecTableProps) {
  const coreSpecs = [
    { label: "Size", value: size, mono: true },
    ...(sku ? [{ label: "SKU", value: sku, mono: true }] : []),
    ...(pattern ? [{ label: "Tread Pattern", value: pattern, mono: false }] : []),
    ...(application ? [{ label: "Application", value: application, mono: false }] : []),
  ];

  const technicalSpecs = specifications
    ? Object.entries(specifications)
        .filter(([, v]) => v !== null && v !== undefined && v !== "")
        .map(([key, value]) => ({
          label: specLabels[key as keyof ProductSpecifications] || key,
          value: value as string,
          mono: ["load_index", "speed_rating", "tread_depth_mm"].includes(key),
        }))
    : [];

  const allSpecs = [...coreSpecs, ...technicalSpecs];

  if (allSpecs.length === 0) return null;

  return (
    <div className="spec-table overflow-hidden rounded-xl border border-brand-border">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left w-1/2">Specification</th>
            <th className="text-left w-1/2">Value</th>
          </tr>
        </thead>
        <tbody>
          {allSpecs.map((spec, idx) => (
            <tr key={idx}>
              <td className="font-medium text-brand-navy">{spec.label}</td>
              <td className={spec.mono ? "font-mono font-semibold text-brand-navy" : "text-slate-700"}>
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
