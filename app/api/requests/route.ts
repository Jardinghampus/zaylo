import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requestSchema } from "@/lib/validations/request.schema";

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const intent = searchParams.get("intent");

  let query = supabase
    .from("requests")
    .select("*, request_areas(area_id, area:areas(id,name))")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (intent) query = query.eq("intent", intent);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const shaped = (data ?? []).map((r) => ({
    ...r,
    areas: (r.request_areas ?? []).map((ra: { area: unknown }) => ra.area).filter(Boolean),
  }));

  return NextResponse.json(shaped);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { area_ids, ...rest } = parsed.data;

  const { data, error } = await supabase
    .from("requests")
    .insert({ ...rest, status: "active" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (area_ids.length > 0) {
    await supabase.from("request_areas").insert(
      area_ids.map((area_id) => ({ request_id: data.id, area_id }))
    );
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
