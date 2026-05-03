export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { listingSchema } from "@/lib/validations/listing.schema";
import { generateReference } from "@/lib/utils/format";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(req.url);
  const area_id = searchParams.get("area_id");
  const intent = searchParams.get("intent");
  const status = searchParams.get("status") ?? "active";

  let query = supabase
    .from("listings")
    .select("*, area:areas(id,name), sub_area:sub_areas(id,name)")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (area_id) query = query.eq("area_id", area_id);
  if (intent === "sale") query = query.eq("list_for_sale", true);
  if (intent === "rent") query = query.eq("list_for_rent", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createServiceClient();
  const reference = generateReference();

  const { data, error } = await supabase
    .from("listings")
    .insert({ ...parsed.data, status: "pending" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Admin email notification
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Zaylo <notifications@zaylo.ae>",
      to: process.env.ADMIN_EMAIL,
      subject: `New listing pending verification — ${parsed.data.bedrooms}BR ${parsed.data.property_type}`,
      html: `
        <h2>New Listing Submitted</h2>
        <p><strong>Owner:</strong> ${parsed.data.owner_name}</p>
        <p><strong>WhatsApp:</strong> ${parsed.data.whatsapp}</p>
        <p><strong>Property:</strong> ${parsed.data.bedrooms}BR ${parsed.data.property_type}</p>
        ${parsed.data.list_for_sale ? `<p><strong>Sale Price:</strong> AED ${parsed.data.sale_price?.toLocaleString()}</p>` : ""}
        ${parsed.data.list_for_rent ? `<p><strong>Rent:</strong> AED ${parsed.data.rent_price?.toLocaleString()}/year</p>` : ""}
        ${parsed.data.title_deed_url ? `<p><strong>Title Deed:</strong> <a href="${parsed.data.title_deed_url}">View</a></p>` : ""}
        <p><strong>Reference:</strong> ${reference}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/listings">Review in admin →</a></p>
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ id: data.id, reference }, { status: 201 });
}
