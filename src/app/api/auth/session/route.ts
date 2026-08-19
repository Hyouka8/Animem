import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/pocketbase/server";

// Speichert den PocketBase-Auth-Token (vom Browser-Login/Registrierung) als
// sicheres, httpOnly-Cookie, damit der Server bei jedem Request weiß, wer da ist.
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Kein Token übergeben" }, { status: 400 });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 Tage — entspricht PocketBase's Standard-Token-Laufzeit
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  cookies().delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
