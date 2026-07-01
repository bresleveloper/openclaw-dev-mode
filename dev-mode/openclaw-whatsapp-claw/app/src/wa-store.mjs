import { existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const AUDIT_DDL = `
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
  CREATE INDEX IF NOT EXISTS idx_wa_claw_audit_jid ON wa_claw_audit(jid);
`;

// Defensive: dev-mode/openclaw-whatsapp-claw.ts owns this table (group/contact names).
// Created here too so an old db — or the seeded sample db — never trips the
// listChats lookup. `IF NOT EXISTS` no-ops when openclaw-whatsapp-claw.ts already made it.
const CHATS_DDL = `
  CREATE TABLE IF NOT EXISTS chats (
    jid TEXT PRIMARY KEY,
    name TEXT,
    chat_type TEXT,
    updated_at TEXT,
    phone_e164 TEXT
  );
`;

const HANDLERS_DDL = `
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
`;

/**
 * Open the openclaw-whatsapp-claw database for the panel.
 * Opens read/write ONLY to ensure the `wa_claw_audit` table exists;
 * never writes the `messages` table.
 * @param {string} dbPath
 */
export function openStore(dbPath) {
  if (!existsSync(dbPath)) {
    throw new Error(`openclaw-whatsapp-claw.db not found at: ${dbPath}`);
  }
  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec(AUDIT_DDL);
  db.exec(CHATS_DDL);
  db.exec(HANDLERS_DDL);

  const listChatsStmt = db.prepare(`
    SELECT jid,
           chat_type   AS chatType,
           MAX(timestamp) AS lastTimestamp,
           COUNT(*)    AS messageCount
    FROM messages
    GROUP BY jid
    ORDER BY lastTimestamp DESC
  `);
  const displayNameStmt = db.prepare(`
    SELECT push_name AS pushName
    FROM messages
    WHERE jid = ? AND from_me = 0 AND push_name IS NOT NULL AND push_name <> ''
    ORDER BY timestamp DESC
    LIMIT 1
  `);
  const chatNameStmt = db.prepare(`
    SELECT name
    FROM chats
    WHERE jid = ? AND name IS NOT NULL AND name <> ''
  `);
  // Take the most-recent `limit` messages, then re-sort the page oldest-first
  // so the conversation reads top-to-bottom ending at the latest message.
  const messagesStmt = db.prepare(`
    SELECT id, sender, pushName, timestamp, body, fromMe FROM (
      SELECT id, sender, push_name AS pushName, timestamp, body, from_me AS fromMe
      FROM messages
      WHERE jid = ?
      ORDER BY timestamp DESC
      LIMIT ?
    )
    ORDER BY timestamp ASC
  `);
  const auditStmt = db.prepare(`
    SELECT id, jid, message_id AS messageId, ts, handler, outcome, reason, detail
    FROM wa_claw_audit
    WHERE jid = ?
    ORDER BY ts DESC
    LIMIT ?
  `);

  const getHandlerStmt = db.prepare(`
    SELECT jid, phone_e164, handler_type, config_json, enabled, created_at, updated_at
    FROM wa_claw_handlers
    WHERE jid = ?
  `);
  const upsertHandlerStmt = db.prepare(`
    INSERT OR REPLACE INTO wa_claw_handlers (jid, phone_e164, handler_type, config_json, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `);
  const deleteHandlerStmt = db.prepare(`
    DELETE FROM wa_claw_handlers WHERE jid = ?
  `);
  const getDefaultsStmt = db.prepare(`
    SELECT id, handler_type, config_json, enabled, updated_at
    FROM wa_claw_defaults
    WHERE id = 1
  `);
  const upsertDefaultsStmt = db.prepare(`
    INSERT OR REPLACE INTO wa_claw_defaults (id, handler_type, config_json, updated_at)
    VALUES (1, ?, ?, datetime('now'))
  `);
  const getLastRunStmt = db.prepare(`
    SELECT session_key, jid, phone_e164, last_run_at, updated_at
    FROM wa_claw_last_run
    WHERE session_key = ?
  `);
  const logAuditStmt = db.prepare(`
    INSERT INTO wa_claw_audit (jid, message_id, handler, outcome, reason, detail, phone_e164)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  function listChats() {
    return listChatsStmt.all().map((r) => {
      const jid = String(r.jid);
      const isGroup = jid.endsWith("@g.us");
      let displayName;
      if (isGroup) {
        // Prefer the real group subject captured by openclaw-whatsapp-claw.ts; fall back
        // to a short JID label for groups whose name was never recorded.
        const named = chatNameStmt.get(jid);
        displayName = named?.name || `Group ${jid.replace("@g.us", "")}`;
      } else {
        const nameRow = displayNameStmt.get(jid);
        displayName = nameRow?.pushName || jid.replace("@s.whatsapp.net", "");
      }
      return {
        jid,
        chatType: r.chatType || (isGroup ? "group" : "dm"),
        displayName,
        lastTimestamp: r.lastTimestamp ?? 0,
        messageCount: r.messageCount ?? 0,
      };
    });
  }

  function getMessages(jid, limit = 50) {
    return messagesStmt.all(jid, limit).map((r) => ({
      id: r.id,
      sender: r.sender,
      pushName: r.pushName,
      timestamp: r.timestamp ?? 0,
      body: r.body ?? "",
      fromMe: r.fromMe === 1,
    }));
  }

  function getAudit(jid, limit = 100) {
    return auditStmt.all(jid, limit);
  }

  function getHandler(jid) {
    return getHandlerStmt.get(jid) ?? null;
  }

  function upsertHandler(jid, handler_type, config_json, phone_e164) {
    return upsertHandlerStmt.run(jid, phone_e164, handler_type, config_json);
  }

  function deleteHandler(jid) {
    return deleteHandlerStmt.run(jid);
  }

  function getDefaults() {
    return getDefaultsStmt.get() ?? null;
  }

  function upsertDefaults(handler_type, config_json) {
    return upsertDefaultsStmt.run(handler_type, config_json);
  }

  function getLastRun(session_key) {
    return getLastRunStmt.get(session_key) ?? null;
  }

  function logAudit(jid, message_id, handler, outcome, reason, detail, phone_e164) {
    return logAuditStmt.run(jid, message_id, handler, outcome, reason, detail, phone_e164);
  }

  function close() {
    db.close();
  }

  return {
    listChats,
    getMessages,
    getAudit,
    getHandler,
    upsertHandler,
    deleteHandler,
    getDefaults,
    upsertDefaults,
    getLastRun,
    logAudit,
    close,
  };
}
