import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
//#region extensions/whatsapp/src/dev-mode/wa-history.ts
/**
* Dev-mode WhatsApp message history logger.
* Attaches to Baileys socket and saves all messages to SQLite.
* Controlled by OPENCLAW_DEV_MODE=1 — no other config needed.
* Uses Node built-in node:sqlite (Node 22.5+).
*
* Schema (incl. phone_e164) mirrors the whatsapp-kapso-claw plugin's
* wa-claw-baileys.db (src/baileys/store.ts) so this in-fork logger can open
* the same on-disk database the plugin already created/migrated.
*/
const DEFAULT_DB_PATH = path.join(process.env.HOME ?? process.env.USERPROFILE ?? ".", ".openclaw", "dev-mode", "wa-history.db");
let db = null;
/**
* Port of the whatsapp-kapso-claw plugin's jidToPhoneE164 — resolves a
* Baileys JID to an E.164 phone number, falling back to `remoteJidAlt` for
* the `@lid` JIDs Baileys 7.x introduced. Groups never resolve to a phone.
*/
function jidToPhoneE164(jid, remoteJidAlt) {
	if (!jid) return null;
	if (jid.endsWith("@g.us")) return null;
	if (jid.endsWith("@s.whatsapp.net")) {
		const num = jid.slice(0, -15);
		return num ? `+${num}` : null;
	}
	if (jid.endsWith("@lid")) {
		if (remoteJidAlt?.endsWith("@s.whatsapp.net")) {
			const num = remoteJidAlt.slice(0, -15);
			return num ? `+${num}` : null;
		}
		return null;
	}
	return null;
}
/**
* Best-effort schema migration: `CREATE TABLE IF NOT EXISTS` cannot add a
* column to a table that already existed without it (e.g. a pre-phone_e164
* dev-mode DB). No-op against a fresh table or a DB that already has the
* column (the plugin's existing store).
*/
function ensureColumn(database, table, column, ddlType) {
	try {
		if (!database.prepare(`PRAGMA table_info(${table})`).all().some((row) => row.name === column)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddlType}`);
	} catch {}
}
function getDb(dbPath) {
	if (db) return db;
	const resolved = dbPath ?? DEFAULT_DB_PATH;
	fs.mkdirSync(path.dirname(resolved), { recursive: true });
	db = new DatabaseSync(resolved);
	db.exec("PRAGMA journal_mode = WAL");
	db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      jid TEXT NOT NULL,
      sender TEXT,
      push_name TEXT,
      timestamp INTEGER,
      body TEXT,
      chat_type TEXT,
      from_me INTEGER DEFAULT 0,
      raw_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      phone_e164 TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_messages_jid ON messages(jid);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    CREATE INDEX IF NOT EXISTS idx_messages_phone_e164 ON messages(phone_e164);
    CREATE TABLE IF NOT EXISTS chats (
      jid TEXT PRIMARY KEY,
      name TEXT,
      chat_type TEXT,
      updated_at TEXT,
      phone_e164 TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_chats_phone_e164 ON chats(phone_e164);
  `);
	ensureColumn(db, "messages", "phone_e164", "TEXT");
	ensureColumn(db, "chats", "phone_e164", "TEXT");
	return db;
}
function attachWaHistoryLogger(sock, opts) {
	const database = getDb(opts?.dbPath);
	const insert = database.prepare(`
    INSERT OR IGNORE INTO messages (id, jid, sender, push_name, timestamp, body, chat_type, from_me, raw_json, phone_e164)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
	const upsertChat = database.prepare(`
    INSERT INTO chats (jid, name, chat_type, updated_at, phone_e164)
    VALUES (?, ?, ?, datetime('now'), ?)
    ON CONFLICT(jid) DO UPDATE SET
      name = excluded.name,
      chat_type = excluded.chat_type,
      updated_at = excluded.updated_at,
      phone_e164 = COALESCE(chats.phone_e164, excluded.phone_e164)
  `);
	/** Store a chat's display name (group subject). Best-effort. */
	function recordChatName(jid, name) {
		if (!jid || !name) return;
		try {
			const phoneE164 = jidToPhoneE164(jid, null);
			upsertChat.run(jid, name, jid.endsWith("@g.us") ? "group" : "dm", phoneE164);
		} catch {}
	}
	sock.ev.on("messages.upsert", (upsert) => {
		for (const msg of upsert.messages) try {
			const jid = msg.key?.remoteJid ?? "";
			const chatType = jid.endsWith("@g.us") ? "group" : "dm";
			const sender = msg.key?.participant ?? msg.key?.remoteJid ?? "";
			const fromMe = msg.key?.fromMe ? 1 : 0;
			const pushName = msg.pushName ?? "";
			const timestamp = typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : typeof msg.messageTimestamp?.low === "number" ? msg.messageTimestamp.low : Math.floor(Date.now() / 1e3);
			const body = msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
			const id = msg.key?.id ?? `${jid}-${timestamp}-${Math.random()}`;
			const phoneE164 = jidToPhoneE164(jid, msg.key?.remoteJidAlt ?? null);
			insert.run(id, jid, sender, pushName, timestamp, body, chatType, fromMe, JSON.stringify(msg), phoneE164);
			const stubType = String(msg.messageStubType ?? "");
			if (stubType === "GROUP_CREATE" || stubType === "GROUP_CHANGE_SUBJECT") recordChatName(jid, msg.messageStubParameters?.[0]);
		} catch {}
	});
	let backfilled = false;
	async function backfillGroupNames() {
		try {
			const all = await sock.groupFetchAllParticipating();
			let count = 0;
			for (const meta of Object.values(all ?? {})) {
				const m = meta;
				if (m?.id && m?.subject) {
					recordChatName(m.id, m.subject);
					count += 1;
				}
			}
			backfilled = true;
			console.log(`[dev-mode] WA history: stored ${count} group names`);
		} catch {}
	}
	sock.ev.on("connection.update", (update) => {
		if (update?.connection === "open" && !backfilled) backfillGroupNames();
	});
	sock.ev.on("groups.upsert", (groups) => {
		for (const g of groups ?? []) recordChatName(g?.id, g?.subject);
	});
	sock.ev.on("groups.update", (updates) => {
		for (const u of updates ?? []) recordChatName(u?.id, u?.subject);
	});
	console.log("[dev-mode] WhatsApp history logger attached");
}
//#endregion
export { attachWaHistoryLogger };
