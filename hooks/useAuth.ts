"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Dealer, DealerTier } from "@/types";

interface AuthState {
  user: User | null;
  dealer: Dealer | null;
  tier: DealerTier | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    dealer: null,
    tier: null,
    isLoading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ user: null, dealer: null, tier: null, isLoading: false, isAdmin: false });
        return;
      }

      const [dealerResult, adminResult] = await Promise.all([
        supabase
          .from("dealers")
          .select("*, tier:dealer_tiers(*)")
          .eq("id", user.id)
          .single(),
        supabase.from("admin_users").select("id").eq("id", user.id).single(),
      ]);

      setState({
        user,
        dealer: dealerResult.data || null,
        tier: (dealerResult.data?.tier as DealerTier | null) || null,
        isLoading: false,
        isAdmin: !!adminResult.data,
      });
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return state;
}
