import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // ── Dealer portal protection ──────────────────────────────────────────
  if (path.startsWith("/dealer/")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dealer-login";
      url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }

    const { data: dealer } = await supabase
      .from("dealers")
      .select("status")
      .eq("id", user.id)
      .single();

    if (!dealer) {
      const url = request.nextUrl.clone();
      url.pathname = "/dealer-login";
      url.searchParams.set("error", "not_authorized");
      return NextResponse.redirect(url);
    }

    if (dealer.status === "suspended") {
      const url = request.nextUrl.clone();
      url.pathname = "/dealer-login";
      url.searchParams.set("error", "suspended");
      return NextResponse.redirect(url);
    }

    if (dealer.status === "pending") {
      const url = request.nextUrl.clone();
      url.pathname = "/dealer-login";
      url.searchParams.set("error", "pending_approval");
      return NextResponse.redirect(url);
    }
  }

  // ── Admin portal protection ──────────────────────────────────────────
  if (path.startsWith("/admin/")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("error", "session_expired");
      return NextResponse.redirect(url);
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("error", "not_authorized");
      return NextResponse.redirect(url);
    }
  }

  // ── Redirect authenticated dealers away from login ──────────────────
  if (path === "/dealer-login" && user) {
    const { data: dealer } = await supabase
      .from("dealers")
      .select("status")
      .eq("id", user.id)
      .single();

    if (dealer?.status === "active") {
      const url = request.nextUrl.clone();
      url.pathname = "/dealer/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dealer/:path*",
    "/admin/:path*",
    "/dealer-login",
    "/admin-login",
  ],
};
