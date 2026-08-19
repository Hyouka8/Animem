import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/pocketbase/server";
import { COL } from "@/lib/pocketbase/collections";
import { getCurrentUser } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { enrichWithProfiles } from "@/lib/pocketbase/enrich";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const pb = await createAdminClient();
  const raw = await pb.collection(COL.ticketMessages).getFullList({
    filter: pb.filter("ticket_id = {:id}", { id: params.id }),
    sort: "created",
  });

  const enriched = await enrichWithProfiles(pb, raw, "sender_id");
  const withSender = enriched.map(({ user: u, ...rest }: any) => ({ ...rest, sender: u }));
  return NextResponse.json(withSender);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "Nachricht fehlt" }, { status: 400 });

  const isStaff = can.moderate(user.role);
  const pb = await createAdminClient();

  try {
    const data = await pb.collection(COL.ticketMessages).create({
      ticket_id: params.id,
      sender_id: user.id,
      content,
      is_staff: isStaff,
    });

    // Staff-Antwort setzt das Ticket automatisch auf "IN_PROGRESS"
    if (isStaff) {
      await pb.collection(COL.tickets).update(params.id, { status: "IN_PROGRESS" });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
