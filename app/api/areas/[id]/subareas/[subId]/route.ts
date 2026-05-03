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
  { params }: { params: Promise<{ id: string; subId: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { id, subId } = await params;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sub_areas")
    .delete()
    .eq("id", subId)
    .eq("area_id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
