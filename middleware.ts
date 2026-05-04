import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Demo mode: plain pass-through with no auth.
// Restore clerkMiddleware here once NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in Vercel.
export default function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
