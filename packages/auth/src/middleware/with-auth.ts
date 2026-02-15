import { NextRequest, NextResponse } from "next/server";
import { auth } from "../lib/auth";
import type { AuthUser } from "../types";

/**
 * Middleware logic to protect routes.
 * Returns a redirect URL or NextResponse.
 */
export async function withAuth(req: NextRequest, signInPath = "/auth/sign-in") {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = signInPath;
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Middleware logic to protect admin routes.
 */
export async function withAdminAuth(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const user = session?.user as AuthUser | undefined;

  if (!session || user?.role !== "SUPER_ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
