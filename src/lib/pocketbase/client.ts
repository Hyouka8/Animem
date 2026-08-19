"use client";

import PocketBase from "pocketbase";

export function createBrowserClient(): PocketBase {
  return new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL!);
}
