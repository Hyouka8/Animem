import { pb } from './pocketbase';

// Login mit E-Mail und Passwort
export async function login(identity, password) {
  return await pb.collection('users').authWithPassword(identity, password);
}

// Logout
export function logout() {
  pb.authStore.clear();
}

// Aktuell eingeloggten User abfragen
export function getCurrentUser() {
  return pb.authStore.record;
}
