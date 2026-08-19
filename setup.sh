#!/bin/bash

# 1. Admin Login & Token holen
TOKEN=$(curl -s -X POST "http://127.0.0.1:8091/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{"identity":"I_Scream10@proton.me", "password":"hurakan187"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Fehler: Token konnte nicht abgerufen werden!"
  exit 1
fi

echo "Token erfolgreich abgerufen."

# 2. Animes Collection ID auslesen
ANIME_COL_ID=$(curl -s "http://127.0.0.1:8091/api/collections/Animes" \
  -H "Authorization: Admin $TOKEN" | grep -o '"id":"[^"]*' | head -n 1 | cut -d'"' -f4)

# 3. Episodes Collection anlegen
echo "Erstelle episodes Collection..."
curl -s -X POST "http://127.0.0.1:8091/api/collections" \
  -H "Authorization: Admin $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"episodes\",
    \"type\": \"base\",
    \"schema\": [
      {\"name\": \"anime\", \"type\": \"relation\", \"required\": true, \"options\": {\"collectionId\": \"$ANIME_COL_ID\", \"maxSelect\": 1}},
      {\"name\": \"episode_number\", \"type\": \"number\", \"required\": true},
      {\"name\": \"title\", \"type\": \"text\"},
      {\"name\": \"stream_url\", \"type\": \"url\"}
    ]
  }"

echo ""

# 4. Support Tickets Collection anlegen
echo "Erstelle support_tickets Collection..."
curl -s -X POST "http://127.0.0.1:8091/api/collections" \
  -H "Authorization: Admin $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "support_tickets",
    "type": "base",
    "schema": [
      {"name": "user", "type": "relation", "required": true, "options": {"collectionId": "_pb_users_auth_", "maxSelect": 1}},
      {"name": "subject", "type": "text", "required": true},
      {"name": "message", "type": "text", "required": true},
      {"name": "status", "type": "select", "options": {"maxSelect": 1, "values": ["open", "in_progress", "closed"]}}
    ]
  }'

echo ""
echo "Fertig!"
