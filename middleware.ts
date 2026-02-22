import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];
const AUTH_ROUTES   = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

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

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute   = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isApiRoute    = pathname.startsWith("/api/");

  // Let API routes handle their own auth
  if (isApiRoute) return supabaseResponse;

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname); // preserve intended destination
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from login/register
  if (user && isAuthRoute) {
    const next = request.nextUrl.searchParams.get("next") ?? "/upload";
    const url = request.nextUrl.clone();
    url.pathname = next;
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
