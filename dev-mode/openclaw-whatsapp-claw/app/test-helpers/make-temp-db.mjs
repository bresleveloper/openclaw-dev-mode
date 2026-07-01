import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * Sample message rows. Two DMs from "Mom" + one group message.
 * Shape matches the `messages` table written by dev-mode/openclaw-whatsapp-claw.ts.
 */
export const SAMPLE_ROWS = [
  {
    id: "m1",
    jid: "111@s.whatsapp.net",
    sender: "111@s.whatsapp.net",
    pushName: "Mom",
    timestamp: 1000,
    body: "hi",
    chatType: "dm",
    fromMe: 0,
  },
  {
    id: "m2",
    jid: "111@s.whatsapp.net",
    sender: "me",
    pushName: "",
    timestamp: 1001,
    body: "hello mom",
    chatType: "dm",
    fromMe: 1,
  },
  {
    id: "m3",
    jid: "999@g.us",
    sender: "222@s.whatsapp.net",
    pushName: "Bob",
    timestamp: 1002,
    body: "group msg",
    chatType: "group",
    fromMe: 0,
  },
];

/**
 * Create a throwaway openclaw-whatsapp-claw.db populated with the given rows.
 * The `chats` table (group/contact names, written by dev-mode/openclaw-whatsapp-claw.ts)
 * is always created; pass `chatRows` to populate it.
 * @param {Array<object>} [rows] message rows
 * @param {Array<{jid:string, name:string, chatType?:string}>} [chatRows] chat-name rows
 * @returns {{ dbPath: string, cleanup: () => void }}
 */
export function makeTempDb(rows = SAMPLE_ROWS, chatRows = []) {
  const dir = mkdtempSync(join(tmpdir(), "wa-claw-test-"));
  const dbPath = join(dir, "openclaw-whatsapp-claw.db");
  const db = new DatabaseSync(dbPath);
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
      created_at TEXT,
      phone_e164 TEXT
    );
    CREATE TABLE chats (
      jid TEXT PRIMARY KEY,
      name TEXT,
      chat_type TEXT,
      updated_at TEXT,
      phone_e164 TEXT
    );
    CREATE TABLE IF NOT EXISTS wa_claw_handlers (
      jid TEXT PRIMARY KEY,
      phone_e164 TEXT,
      handler_type TEXT NOT NULL,
      config_json TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wa_claw_defaults (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      handler_type TEXT NOT NULL,
      config_json TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wa_claw_last_run (
      session_key TEXT PRIMARY KEY,
      jid TEXT NOT NULL,
      phone_e164 TEXT,
      last_run_at TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS wa_claw_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jid TEXT,
      phone_e164 TEXT,
      message_id TEXT,
      ts TEXT DEFAULT (datetime('now')),
      handler TEXT,
      outcome TEXT,
      reason TEXT,
      detail TEXT
    );
  `);
  const insert = db.prepare(
    `INSERT INTO messages (id, jid, sender, push_name, timestamp, body, chat_type, from_me)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const r of rows) {
    insert.run(r.id, r.jid, r.sender, r.pushName, r.timestamp, r.body, r.chatType, r.fromMe);
  }
  const insertChat = db.prepare(`INSERT INTO chats (jid, name, chat_type) VALUES (?, ?, ?)`);
  for (const c of chatRows) {
    insertChat.run(c.jid, c.name, c.chatType ?? (c.jid.endsWith("@g.us") ? "group" : "dm"));
  }
  db.close();
  return { dbPath, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}
