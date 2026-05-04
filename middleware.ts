import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminApiRoute = createRouteMatcher([
  "/api/listings/:id",
  "/api/areas/:id(.*)",
  "/api/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Demo mode: no Clerk keys configured — allow all routes
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return;

  if (isAdminRoute(req) || isAdminApiRoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
