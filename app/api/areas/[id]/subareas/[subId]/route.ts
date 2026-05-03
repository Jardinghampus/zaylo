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
  { params }: { params: { id: string; subId: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("sub_areas")
    .delete()
    .eq("id", params.subId)
    .eq("area_id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
