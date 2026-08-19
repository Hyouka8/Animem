/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "9nxzljgkflogars",
    "created": "2026-08-19 11:01:29.203Z",
    "updated": "2026-08-19 11:01:29.203Z",
    "name": "watchlists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "xrqasbfb",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "72phu9x17nqvf0u",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "jbss8i5m",
        "name": "status",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "watching",
            "completed",
            "plan_to_watch",
            "dropped"
          ]
        }
      },
      {
        "system": false,
        "id": "uhxwedkv",
        "name": "progress_episode",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("9nxzljgkflogars");

  return dao.deleteCollection(collection);
})
