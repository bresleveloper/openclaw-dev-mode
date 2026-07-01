import { existsSync, rmSync } from "node:fs";
// Create a sample openclaw-whatsapp-claw.db so the panel can be demoed without OpenClaw.
// Usage: node scripts/seed-sample-db.mjs [outputPath]
//   default outputPath: ./sample.db
import { DatabaseSync } from "node:sqlite";

const outPath = process.argv[2] || "./sample.db";
if (existsSync(outPath)) {
  rmSync(outPath);
}

const db = new DatabaseSync(outPath);
db.exec(`
  CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    jid TEXT NOT NULL,
    sender TEXT,
    push_name TEXT,
    timestamp INTEGER,
    body TEXT,
    chat_type TEXT,
    from_me INTEGER DEFAULT 0,
    raw_json TEXT,
    created_at TEXT
  );
  CREATE TABLE chats (
    jid TEXT PRIMARY KEY,
    name TEXT,
    chat_type TEXT,
    updated_at TEXT
  );
`);
const insert = db.prepare(
  `INSERT INTO messages (id, jid, sender, push_name, timestamp, body, chat_type, from_me)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
);
const now = Math.floor(Date.now() / 1000);
const rows = [
  [
    "s1",
    "111@s.whatsapp.net",
    "111@s.whatsapp.net",
    "Mom",
    now - 600,
    "are you coming for dinner?",
    "dm",
    0,
  ],
  ["s2", "111@s.whatsapp.net", "me", "", now - 590, "yes, around 7", "dm", 1],
  [
    "s3",
    "222@s.whatsapp.net",
    "222@s.whatsapp.net",
    "Supplier Dan",
    now - 300,
    "invoice attached",
    "dm",
    0,
  ],
  ["s4", "999@g.us", "333@s.whatsapp.net", "Alice", now - 120, "team standup at 10", "group", 0],
  ["s5", "999@g.us", "444@s.whatsapp.net", "Bob", now - 60, "on my way", "group", 0],
];
for (const r of rows) {
  insert.run(...r);
}
// Group names — written on the VPS by dev-mode/openclaw-whatsapp-claw.ts; seeded here so
// the local demo shows a real group subject instead of "Group 999".
db.prepare(`INSERT INTO chats (jid, name, chat_type) VALUES (?, ?, ?)`).run(
  "999@g.us",
  "Project Team",
  "group",
);
db.close();
console.log(`Seeded ${rows.length} messages into ${outPath}`);
