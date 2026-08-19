import { pb } from './pocketbase.js';

// 1. Registrierung mit E-Mail, Passwort, Username (@handle) und Display Name
export async function registerUser({ email, password, username, displayName }) {
  try {
    const newUser = await pb.collection('users').create({
      email: email,
      password: password,
      passwordConfirm: password,
      username: username.replace(/^@/, ''), // Entfernt ein eventuelles '@' am Anfang
      display_name: displayName,
    });
    console.log("User erfolgreich registriert:", newUser);
    return newUser;
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    throw error;
  }
}

// 2. Login (funktioniert in PocketBase wahlweise mit E-Mail ODER @username!)
export async function loginUser(identity, password) {
  try {
    const authData = await pb.collection('users').authWithPassword(identity, password);
    console.log("Erfolgreich eingeloggt als:", authData.record.username);
    return authData;
  } catch (error) {
    console.error("Login fehlgeschlagen:", error);
    throw error;
  }
}

export function logoutUser() {
  pb.authStore.clear();
}

export function getCurrentUser() {
  return pb.authStore.record;
}
