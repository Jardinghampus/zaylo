const DEMO_MODE = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export async function requireAdmin(): Promise<boolean> {
  if (DEMO_MODE) return true;
  const { auth } = await import("@clerk/nextjs/server");
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  return (sessionClaims?.publicMetadata as { role?: string })?.role === "admin";
}
