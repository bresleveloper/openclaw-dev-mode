/**
 * Dev-mode WhatsApp message history logger (openclaw-whatsapp-claw).
 * Attaches to Baileys socket and saves all messages to SQLite.
 * Controlled by OPENCLAW_DEV_MODE=1 — no other config needed.
 * Uses Node built-in node:sqlite (Node 22.5+).
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";
import {
  AuditHandlerSource,
  AuditOutcome,
  CustomHandlerType,
} from "./openclaw-whatsapp-claw.enums.js";

const DEFAULT_DB_PATH = path.join(
  process.env.HOME ?? process.env.USERPROFILE ?? ".",
  ".openclaw",
  "dev-mode",
  "openclaw-whatsapp-claw.db",
);

const LOG_PATH = path.join(
  process.env.HOME ?? process.env.USERPROFILE ?? ".",
  ".openclaw",
  "dev-mode",
  "openclaw-whatsapp-claw.log",
);

function logToFile(
  level: string,
  fn: string,
  message: string,
  extra?: Record<string, unknown>,
): void {
  try {
    const entry = JSON.stringify({
      ts: new Date().toISOString(),
      level,
      fn,
      message,
      ...extra,
    });
    fs.appendFileSync(LOG_PATH, entry + "\n");
  } catch {
    // logging must never crash the gateway
  }
}

/** Prefix prepended to every auto-generated reply (plan-v2 §6 response format). */
const AUTO_REPLY_PREFIX = "[OpenClaw Auto AI Generated Response:]";

let db: DatabaseSync | null = null;

function getDb(dbPath?: string): DatabaseSync {
  if (db) {
    return db;
  }
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
    CREATE TABLE IF NOT EXISTS chats (
      jid TEXT PRIMARY KEY,
      name TEXT,
      chat_type TEXT,
      updated_at TEXT,
      phone_e164 TEXT
    );
  `);
  // Idempotent migration for existing DBs created before phone_e164 was added.
  // Must run BEFORE index creation — indexes reference phone_e164.
  try {
    db.exec("ALTER TABLE messages ADD COLUMN phone_e164 TEXT");
  } catch {
    /* column already exists */
  }
  try {
    db.exec("ALTER TABLE chats ADD COLUMN phone_e164 TEXT");
  } catch {
    /* column already exists */
  }
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_jid ON messages(jid);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(phone_e164);
    CREATE INDEX IF NOT EXISTS idx_chats_phone ON chats(phone_e164);
  `);
  // New v2 tables.
  db.exec(`
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
  return db;
}

function jidToPhoneE164(jid: string, remoteJidAlt: string | null | undefined): string | null {
  if (!jid) {
    return null;
  }
  if (jid.endsWith("@g.us")) {
    return null;
  }
  if (jid.endsWith("@s.whatsapp.net")) {
    const num = jid.slice(0, -"@s.whatsapp.net".length);
    return num ? `+${num}` : null;
  }
  if (jid.endsWith("@lid")) {
    if (remoteJidAlt && remoteJidAlt.endsWith("@s.whatsapp.net")) {
      const num = remoteJidAlt.slice(0, -"@s.whatsapp.net".length);
      return num ? `+${num}` : null;
    }
    return null;
  }
  return null;
}

/**
 * Inverse of jidToPhoneE164: convert E.164 phone (+972...) or bare number to
 * a WhatsApp DM JID (972...@s.whatsapp.net). If the input already contains
 * "@" it is returned unchanged (already a JID).
 */
function phoneE164ToJid(phone: string): string {
  if (phone.includes("@")) {
    return phone;
  }
  const stripped = phone.startsWith("+") ? phone.slice(1) : phone;
  return `${stripped}@s.whatsapp.net`;
}

/** Ollama/OpenAI-style tool schema used by I2 stateless handler turns. */
interface I2ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
}

interface I2Tool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, I2ToolParameter>;
      required: string[];
    };
  };
}

/** Returns the 4 tool definitions available to I2 stateless handler model calls. */
export function getI2ToolDefinitions(): I2Tool[] {
  return [
    {
      type: "function",
      function: {
        name: "message_send",
        description: "Send a WhatsApp message (used to escalate to the human owner).",
        parameters: {
          type: "object",
          properties: {
            to: {
              type: "string",
              description: "E.164 phone like +972... or a full WhatsApp JID",
            },
            text: {
              type: "string",
              description: "message body",
            },
          },
          required: ["to", "text"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "db_audit_log",
        description: "Write a row to the wa_claw_audit table.",
        parameters: {
          type: "object",
          properties: {
            jid: { type: "string" },
            message_id: { type: "string" },
            handler: { type: "string" },
            outcome: {
              type: "string",
              description: "one of replied/silent/escalated/error",
              enum: ["replied", "silent", "escalated", "error"],
            },
            reason: { type: "string" },
            detail: { type: "string" },
          },
          required: ["jid", "outcome"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "db_last_run_update",
        description: "Upsert the last-run timestamp for a session/cron key.",
        parameters: {
          type: "object",
          properties: {
            session_key: { type: "string" },
            jid: { type: "string" },
            last_run_at: {
              type: "string",
              description: "ISO timestamp; omit to use now",
            },
          },
          required: ["session_key", "jid"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "db_query",
        description:
          "Run a read-only SELECT against the openclaw-whatsapp-claw.db database (e.g. to look up owner_phone). Only SELECT is permitted.",
        parameters: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "a single read-only SELECT statement",
            },
          },
          required: ["sql"],
        },
      },
    },
  ];
}

/** Module-level cache for the wa-auto-prompt.md contents. */
let waAutoPromptCache: string | null = null;

/**
 * Load the central WA auto-prompt from wa-auto-prompt.md.
 * Searches several candidate locations relative to this module's dist path,
 * the CWD, and an optional env-var override. Caches the result and returns ""
 * with a one-time console.log if the file cannot be found.
 */
function loadWaAutoPrompt(): string {
  if (waAutoPromptCache !== null) {
    return waAutoPromptCache;
  }
  const relativeTarget = path.join("dev-mode", "openclaw-whatsapp-claw", "wa-auto-prompt.md");

  const candidates: string[] = [];

  // Env-var override.
  const envPath = process.env.OPENCLAW_DEV_MODE_WA_AUTO_PROMPT_PATH;
  if (envPath) {
    candidates.push(envPath);
  }

  // Walk up from this module's compiled location (up to 6 parent dirs).
  try {
    let dir = path.dirname(fileURLToPath(import.meta.url));
    for (let i = 0; i < 6; i++) {
      candidates.push(path.join(dir, relativeTarget));
      const parent = path.dirname(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
  } catch {
    // import.meta.url unavailable in some contexts — fall through to CWD.
  }

  // CWD fallback.
  candidates.push(path.join(process.cwd(), relativeTarget));

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const content = fs.readFileSync(candidate, "utf8");
        waAutoPromptCache = content;
        return waAutoPromptCache;
      }
    } catch {
      // Try next candidate.
    }
  }

  console.log("[dev-mode] WA Claw: wa-auto-prompt.md not found, I2 system prompt will be empty");
  waAutoPromptCache = "";
  return waAutoPromptCache;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attachWaHistoryLogger(sock: any, opts?: { dbPath?: string }): void {
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

  const selectHandler = database.prepare(
    "SELECT handler_type, config_json, enabled FROM wa_claw_handlers WHERE jid = ?",
  );
  const selectDefaults = database.prepare(
    "SELECT handler_type, config_json, enabled FROM wa_claw_defaults WHERE id = 1",
  );
  const insertAudit = database.prepare(`
    INSERT INTO wa_claw_audit (jid, phone_e164, message_id, handler, outcome, reason, detail)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const upsertLastRun = database.prepare(
    "INSERT OR REPLACE INTO wa_claw_last_run (session_key, jid, phone_e164, last_run_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'))",
  );

  function logAudit(
    auditJid: string,
    auditPhone: string | null,
    auditMessageId: string,
    handler: string,
    outcome: string,
    reason: string | null,
    detail: string | null,
  ): void {
    try {
      insertAudit.run(auditJid, auditPhone, auditMessageId, handler, outcome, reason, detail);
    } catch {
      // best-effort — never crash the gateway for audit logging
    }
  }

  function parseConfig(json: string): Record<string, unknown> {
    try {
      const parsed = JSON.parse(json) as unknown;
      return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }

  type ResolvedHandler = { handlerType: string; config: Record<string, unknown> };

  /**
   * Resolve the active handler for a chat: the chat-specific row in
   * wa_claw_handlers, else the singleton wa_claw_defaults row. Disabled rows
   * (enabled = 0) are ignored. Returns null when nothing applies — OC handles
   * the message in that case.
   */
  function resolveHandler(lookupJid: string): ResolvedHandler | null {
    const row = selectHandler.get(lookupJid) as
      | { handler_type: string; config_json: string; enabled: number }
      | undefined;
    if (row && row.enabled !== 0) {
      return { handlerType: row.handler_type, config: parseConfig(row.config_json) };
    }
    const def = selectDefaults.get() as
      | { handler_type: string; config_json: string; enabled: number }
      | undefined;
    if (def && def.enabled !== 0) {
      return { handlerType: def.handler_type, config: parseConfig(def.config_json) };
    }
    return null;
  }

  /**
   * Execute a single tool call issued by the I2 stateless model. Returns a
   * JSON string result. Never throws — errors become {"ok":false,"error":"..."}.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function executeI2Tool(call: {
    function?: { name?: string; arguments?: any };
  }): Promise<string> {
    const name = call.function?.name ?? "";
    let args: Record<string, unknown> = {};
    try {
      const raw = call.function?.arguments;
      if (typeof raw === "string") {
        args = JSON.parse(raw) as Record<string, unknown>;
      } else if (raw && typeof raw === "object") {
        args = raw as Record<string, unknown>;
      }
    } catch {
      args = {};
    }

    if (name === "message_send") {
      const to = typeof args.to === "string" ? args.to : "";
      const text = typeof args.text === "string" ? args.text : "";
      const targetJid = phoneE164ToJid(to);
      const outText = text.startsWith(AUTO_REPLY_PREFIX) ? text : `${AUTO_REPLY_PREFIX} ${text}`;
      try {
        await sock.sendMessage(targetJid, { text: outText });
        return JSON.stringify({ ok: true });
      } catch (err) {
        return JSON.stringify({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (name === "db_audit_log") {
      const jid = typeof args.jid === "string" ? args.jid : "";
      const message_id = typeof args.message_id === "string" ? args.message_id : "";
      const handler =
        typeof args.handler === "string" ? args.handler : AuditHandlerSource.Stateless;
      const outcome = typeof args.outcome === "string" ? args.outcome : "";
      const reason = typeof args.reason === "string" ? args.reason : null;
      const detail = typeof args.detail === "string" ? args.detail : null;
      logAudit(jid, jidToPhoneE164(jid, null), message_id, handler, outcome, reason, detail);
      return JSON.stringify({ ok: true });
    }

    if (name === "db_last_run_update") {
      const session_key = typeof args.session_key === "string" ? args.session_key : "";
      const jid = typeof args.jid === "string" ? args.jid : "";
      const last_run_at =
        typeof args.last_run_at === "string" ? args.last_run_at : new Date().toISOString();
      try {
        upsertLastRun.run(session_key, jid, jidToPhoneE164(jid, null), last_run_at);
        return JSON.stringify({ ok: true });
      } catch (err) {
        return JSON.stringify({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (name === "db_query") {
      const sql = typeof args.sql === "string" ? args.sql : "";
      const trimmed = sql.trim();
      // Only allow SELECT; reject if the statement does not start with SELECT.
      if (!/^select\b/i.test(trimmed)) {
        return JSON.stringify({ ok: false, error: "only SELECT queries are allowed" });
      }
      // Reject if a semicolon appears anywhere except as a single optional trailing character.
      const withoutTrailingSemi = trimmed.endsWith(";") ? trimmed.slice(0, -1) : trimmed;
      if (withoutTrailingSemi.includes(";")) {
        return JSON.stringify({ ok: false, error: "only SELECT queries are allowed" });
      }
      try {
        const rows = database.prepare(trimmed).all();
        return JSON.stringify({ ok: true, rows });
      } catch (err) {
        return JSON.stringify({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return JSON.stringify({ ok: false, error: `unknown tool: ${name}` });
  }

  /**
   * Perform an I2 stateless model turn: build a system + user message pair,
   * call Ollama's /api/chat, and execute any tool calls the model requests until
   * a final text response is produced. Returns the final text (may be "").
   * Throws on configuration or network errors — the caller is responsible for
   * catching and logging an audit row.
   */
  async function handleI2Turn(
    handler: ResolvedHandler,
    inboundText: string,
    waAutoPrompt: string,
  ): Promise<string> {
    // Resolve model: handler config → WA Claw defaults → OC global default.
    let model =
      typeof handler.config.model === "string" && handler.config.model !== ""
        ? handler.config.model
        : null;
    if (!model) {
      const defRow = selectDefaults.get() as
        | { handler_type: string; config_json: string; enabled: number }
        | undefined;
      if (defRow) {
        const defConfig = parseConfig(defRow.config_json);
        if (typeof defConfig.model === "string" && defConfig.model !== "") {
          model = defConfig.model;
        }
      }
    }
    if (!model) {
      try {
        const { execFileSync } = await import("node:child_process");
        const stdout = execFileSync(
          "openclaw",
          ["config", "get", "agents.defaults.model.primary", "--json"],
          {
            encoding: "utf8",
            timeout: 10_000,
          },
        );
        const parsed = JSON.parse(stdout.trim());
        if (typeof parsed === "string" && parsed !== "") {
          model = parsed;
        }
      } catch {
        // OC CLI not available or config unset — fall through to error
      }
    }
    if (!model) {
      throw new Error("no model configured for stateless handler");
    }
    // Strip ollama/ prefix for the Ollama HTTP API.
    const ollamaModel = model.startsWith("ollama/") ? model.slice("ollama/".length) : model;

    const userPrompt = typeof handler.config.prompt === "string" ? handler.config.prompt : "";
    const messages: Array<Record<string, unknown>> = [
      { role: "system", content: `${waAutoPrompt}\n${userPrompt}` },
      { role: "user", content: inboundText },
    ];
    const tools = getI2ToolDefinitions();

    const MAX_ITERATIONS = 8;
    let lastContent = "";

    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort();
      }, 60000);
      let response: Response;
      try {
        response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: ollamaModel, messages, tools, stream: false }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
      if (!response.ok) {
        throw new Error(`Ollama /api/chat returned HTTP ${response.status}`);
      }
      const result = (await response.json()) as {
        message?: {
          content?: string;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tool_calls?: Array<{ function?: { name?: string; arguments?: any } }>;
        };
      };
      const toolCalls = result.message?.tool_calls;
      if (!toolCalls?.length) {
        return result.message?.content ?? "";
      }
      // Tool calls present — push assistant message and execute each tool.
      if (result.message) {
        messages.push(result.message as Record<string, unknown>);
        lastContent = typeof result.message.content === "string" ? result.message.content : "";
      }
      for (const call of toolCalls) {
        const toolResult = await executeI2Tool(call);
        messages.push({
          role: "tool",
          content: toolResult,
          tool_name: call.function?.name,
        });
      }
    }

    // Hit iteration cap — return whatever the model last said.
    return lastContent;
  }

  /**
   * I1 static auto-reply handler. Looks up the chat's handler config and, for
   * handler_type = "static", sends the configured fixed text (with the §6
   * prefix) back to the same chat, then logs the outcome to wa_claw_audit.
   * I2 (stateless) is wired below. Best-effort: never throws.
   */
  async function handleInstantMessage(
    handlerJid: string,
    handlerPhone: string | null,
    handlerMessageId: string,
    inboundText: string,
  ): Promise<void> {
    let resolved: ResolvedHandler | null = null;
    try {
      resolved = resolveHandler(handlerJid);
    } catch (err) {
      logToFile("error", "handleInstantMessage", "resolveHandler failed", {
        jid: handlerJid,
        error: err instanceof Error ? err.message : String(err),
      });
      return;
    }
    if (!resolved) {
      return;
    }
    if (resolved.handlerType === CustomHandlerType.Static) {
      const text = typeof resolved.config.text === "string" ? resolved.config.text : "";
      if (!text) {
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Static,
          AuditOutcome.Error,
          "static handler config has no text",
          null,
        );
        return;
      }
      const replyText = `${AUTO_REPLY_PREFIX} ${text}`;
      try {
        await sock.sendMessage(handlerJid, { text: replyText });
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Static,
          AuditOutcome.Replied,
          null,
          replyText,
        );
      } catch (err) {
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Static,
          AuditOutcome.Error,
          err instanceof Error ? err.message : String(err),
          null,
        );
      }
    }
    if (resolved.handlerType === CustomHandlerType.Stateless) {
      let finalText = "";
      try {
        const waAutoPrompt = loadWaAutoPrompt();
        finalText = await handleI2Turn(resolved, inboundText, waAutoPrompt);
      } catch (err) {
        logToFile("error", "handleI2Turn", err instanceof Error ? err.message : String(err), {
          jid: handlerJid,
          messageId: handlerMessageId,
        });
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Stateless,
          AuditOutcome.Error,
          err instanceof Error ? err.message : String(err),
          null,
        );
        return;
      }
      const trimmed = finalText.trim();
      if (trimmed === "" || trimmed === "NO_REPLY") {
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Stateless,
          AuditOutcome.Silent,
          "model returned NO_REPLY",
          null,
        );
        return;
      }
      const replyText = trimmed.startsWith(AUTO_REPLY_PREFIX)
        ? trimmed
        : `${AUTO_REPLY_PREFIX} ${trimmed}`;
      try {
        await sock.sendMessage(handlerJid, { text: replyText });
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Stateless,
          AuditOutcome.Replied,
          null,
          replyText,
        );
      } catch (err) {
        logAudit(
          handlerJid,
          handlerPhone,
          handlerMessageId,
          AuditHandlerSource.Stateless,
          AuditOutcome.Error,
          err instanceof Error ? err.message : String(err),
          null,
        );
      }
    }
  }

  /** Store a chat's display name (group subject). Best-effort. */
  function recordChatName(jid: string | null | undefined, name: string | null | undefined): void {
    if (!jid || !name) {
      return;
    }
    try {
      upsertChat.run(jid, name, jid.endsWith("@g.us") ? "group" : "dm", jidToPhoneE164(jid, null));
    } catch {
      // best-effort — never crash the gateway for history logging
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sock.ev.on("messages.upsert", (upsert: { messages: any[]; type: string }) => {
    for (const msg of upsert.messages) {
      try {
        const jid: string = msg.key?.remoteJid ?? "";
        const chatType = jid.endsWith("@g.us") ? "group" : "dm";
        const sender: string = msg.key?.participant ?? msg.key?.remoteJid ?? "";
        const fromMe: number = msg.key?.fromMe ? 1 : 0;
        const pushName: string = msg.pushName ?? "";
        const timestamp: number =
          typeof msg.messageTimestamp === "number"
            ? msg.messageTimestamp
            : typeof msg.messageTimestamp?.low === "number"
              ? msg.messageTimestamp.low
              : Math.floor(Date.now() / 1000);
        const body: string =
          msg.message?.conversation ?? msg.message?.extendedTextMessage?.text ?? "";
        const id: string = msg.key?.id ?? `${jid}-${timestamp}-${Math.random()}`;
        const remoteJidAlt: string | null = msg.key?.remoteJidAlt ?? null;
        const phoneE164 = jidToPhoneE164(jid, remoteJidAlt);

        insert.run(
          id,
          jid,
          sender,
          pushName,
          timestamp,
          body,
          chatType,
          fromMe,
          JSON.stringify(msg),
          phoneE164,
        );

        // Group create / rename system messages carry the new subject.
        const stubType = String(msg.messageStubType ?? "");
        if (stubType === "GROUP_CREATE" || stubType === "GROUP_CHANGE_SUBJECT") {
          recordChatName(jid, msg.messageStubParameters?.[0]);
        }

        // I1 static auto-reply (dev-mode custom handler). Fire only on live
        // inbound messages: skip history sync (type !== "notify") and our own
        // sends (fromMe), which would otherwise create a reply loop.
        if (upsert.type === "notify" && fromMe === 0) {
          void handleInstantMessage(jid, phoneE164, id, body);
        }
      } catch (err) {
        logToFile("error", "messages.upsert", err instanceof Error ? err.message : String(err));
      }
    }
  });

  // --- Group names ---------------------------------------------------------
  // The `messages` table stores only JIDs; the panel needs real group
  // subjects. Backfill every joined group once the socket is live, and keep
  // names fresh as groups are created / renamed.
  let backfilled = false;
  async function backfillGroupNames(): Promise<void> {
    try {
      const all = await sock.groupFetchAllParticipating();
      let count = 0;
      for (const meta of Object.values(all ?? {})) {
        const m = meta as { id?: string; subject?: string };
        if (m?.id && m?.subject) {
          recordChatName(m.id, m.subject);
          count += 1;
        }
      }
      backfilled = true;
      console.log(`[dev-mode] WA history: stored ${count} group names`);
    } catch {
      // socket not ready / call failed — retried on the next 'open'
    }
  }

  sock.ev.on("connection.update", (update: { connection?: string }) => {
    if (update?.connection === "open" && !backfilled) {
      void backfillGroupNames();
    }
  });
  sock.ev.on("groups.upsert", (groups: Array<{ id?: string; subject?: string }>) => {
    for (const g of groups ?? []) {
      recordChatName(g?.id, g?.subject);
    }
  });
  sock.ev.on("groups.update", (updates: Array<{ id?: string; subject?: string }>) => {
    for (const u of updates ?? []) {
      recordChatName(u?.id, u?.subject);
    }
  });

  console.log("[dev-mode] WhatsApp history logger attached");
}
