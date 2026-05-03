import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

async function requireAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  return (sessionClaims?.publicMetadata as { role?: string })?.role === "admin";
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const supabase = createServiceClient();

  const { count } = await supabase
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("area_id", params.id)
    .neq("status", "removed");

  if (count && count > 0) {
    return NextResponse.json(
      { error: "Cannot remove area with active listings" },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("areas").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
