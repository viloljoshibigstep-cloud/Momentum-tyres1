import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DealerSidebar } from "@/components/layout/DealerSidebar";

export default async function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dealer-login?error=session_expired");
  }

  const { data: dealer } = await supabase
    .from("dealers")
    .select("*, tier:dealer_tiers(*)")
    .eq("id", user.id)
    .single();

  if (!dealer) {
    redirect("/dealer-login?error=not_authorized");
  }

  if (dealer.status === "suspended") {
    redirect("/dealer-login?error=suspended");
  }

  if (dealer.status === "pending") {
    redirect("/dealer-login?error=pending_approval");
  }

  return (
    <div className="flex min-h-screen bg-brand-surface">
      <DealerSidebar dealerName={dealer.company_name} tierName={dealer.tier?.tier_name} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
