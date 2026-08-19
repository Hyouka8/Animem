"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/pocketbase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    try {
      const pb = createBrowserClient();

      // Bei PocketBase ist der Auth-Datensatz zugleich das Profil — ein
      // create()-Aufruf legt Konto UND Profilfelder (username, role, …) in
      // einem Schritt an, kein separater Schritt mehr nötig.
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password,
        username,
        role: "USER",
        avatar_url: "",
        bio: "",
        display_name: "",
        is_banned: false,
      });

      await pb.collection("users").authWithPassword(email, password);
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: pb.authStore.token }),
      });

      router.push("/");
      router.refresh();
    } catch (err: any) {
      const raw = err?.response?.data?.username?.message || err?.response?.data?.email?.message;
      setError(
        raw ||
          (err?.message?.includes("valid")
            ? "Bitte überprüfe E-Mail, Benutzername und Passwort."
            : "Registrierung fehlgeschlagen. Benutzername oder E-Mail evtl. schon vergeben.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6">
        <h1 className="mb-6 text-xl font-bold text-white">Konto erstellen</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">
              Benutzername
            </label>
            <input
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-400">Passwort</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Registrieren…" : "Registrieren"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Schon ein Konto?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
            Jetzt anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
