const PB_URL = 'http://127.0.0.1:8091';
const EMAIL = 'I_Scream10@proton.me';
const PASS = 'hurakan187';

async function main() {
  // 1. Admin/Superuser Auth
  let authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: EMAIL, password: PASS })
  });

  if (!authRes.ok) {
    authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: EMAIL, password: PASS })
    });
  }

  const authData = await authRes.json();
  if (!authData.token) {
    console.error("Login Fehlgeschlagen:", authData);
    return;
  }

  const token = authData.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token
  };

  console.log("✓ Login erfolgreich!");

  // 2. Animes Collection ID auslesen
  const animeRes = await fetch(`${PB_URL}/api/collections/Animes`, { headers });
  const animeData = await animeRes.json();
  const animeColId = animeData.id;

  // 3. Episodes Collection anlegen
  console.log("Erstelle episodes...");
  const epRes = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'episodes',
      type: 'base',
      schema: [
        { name: 'anime', type: 'relation', required: true, options: { collectionId: animeColId, maxSelect: 1 } },
        { name: 'episode_number', type: 'number', required: true },
        { name: 'title', type: 'text' },
        { name: 'stream_url', type: 'url' }
      ]
    })
  });
  console.log("Episodes Response:", epRes.status, await epRes.json());

  // 4. Support Tickets Collection anlegen
  console.log("Erstelle support_tickets...");
  const ticketRes = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: 'support_tickets',
      type: 'base',
      schema: [
        { name: 'user', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', maxSelect: 1 } },
        { name: 'subject', type: 'text', required: true },
        { name: 'message', type: 'text', required: true },
        { name: 'status', type: 'select', options: { maxSelect: 1, values: ['open', 'in_progress', 'closed'] } }
      ]
    })
  });
  console.log("Support Tickets Response:", ticketRes.status, await ticketRes.json());
}

main();
