import { Package, Clock, CheckCircle, Truck } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    total: number;
    submitted: number;
    approved: number;
    dispatched: number;
    this_month: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: "Orders This Month",
      value: stats.this_month,
      icon: Package,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10",
    },
    {
      label: "Pending Review",
      value: stats.submitted,
      icon: Clock,
      color: "text-brand-yellow",
      bg: "bg-brand-yellow-light",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-brand-green",
      bg: "bg-brand-green-light",
    },
    {
      label: "Dispatched",
      value: stats.dispatched,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-brand-border rounded-xl p-5"
        >
          <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
            <card.icon size={20} className={card.color} />
          </div>
          <div className="text-2xl font-black text-brand-navy">{card.value}</div>
          <div className="text-xs text-brand-muted mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
