import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const supabase = createServiceClient();

  const [total, pending, requests] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).neq("status", "removed"),
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("requests").select("id", { count: "exact", head: true }).eq("status", "active"),
  ]);

  return NextResponse.json({
    totalListings: total.count ?? 0,
    pendingVerification: pending.count ?? 0,
    activeRequests: requests.count ?? 0,
  });
}
