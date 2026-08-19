import "server-only";
import PocketBase from "pocketbase";

export const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL!;
export const SESSION_COOKIE = "animem-session";

// Der Admin-Client hat vollen Zugriff auf alle Collections (umgeht die
// PocketBase-eigenen API-Regeln komplett). Rechteprüfung passiert bewusst
// in unserem eigenen Code (lib/permissions.ts) — genau wie zuvor mit dem
// Appwrite-Server-Key. Der Auth-Token wird zwischen Requests im selben
// warmen Server-Prozess wiederverwendet, damit nicht bei jedem einzelnen
// Request ein zusätzlicher Login-Roundtrip nötig ist.
let cachedAdmin: PocketBase | null = null;

export async function createAdminClient(): Promise<PocketBase> {
  if (cachedAdmin && cachedAdmin.authStore.isValid) return cachedAdmin;

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL!,
    process.env.POCKETBASE_ADMIN_PASSWORD!
  );

  cachedAdmin = pb;
  return pb;
}

// Prüft einen Session-Token (aus dem Cookie) und liefert den zugehörigen
// Nutzer-Datensatz zurück — oder null, wenn der Token ungültig/abgelaufen ist.
export async function getUserFromToken(token: string) {
  const pb = new PocketBase(PB_URL);
  pb.authStore.save(token, null);

  try {
    const result = await pb.collection("users").authRefresh();
    return result.record;
  } catch {
    return null;
  }
}
