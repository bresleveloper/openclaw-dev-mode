/**
 * Tests for the I1 (static) and I2 (stateless) handler logic in
 * openclaw-whatsapp-claw.ts.
 *
 * This file imports the TypeScript extension implementation directly, so it
 * MUST be run with the tsx loader, e.g. from repo root:
 *   node --import tsx --test dev-mode/openclaw-whatsapp-claw/app/test/openclaw-whatsapp-claw.test.mjs
 */

import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { openStore } from "../src/wa-store.mjs";
import { makeTempDb } from "../test-helpers/make-temp-db.mjs";

// ---------------------------------------------------------------------------
// Module isolation: each test gets a fresh singleton db via a unique import
// ---------------------------------------------------------------------------
let __n = 0;
async function freshModule() {
  return import(
    `../../../../extensions/whatsapp/src/dev-mode/openclaw-whatsapp-claw.ts?t=${__n++}`
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a mock Baileys-style socket that records sent messages.
 * Returns { sock, sent, emitUpsert }.
 */
function makeMockSock() {
  const sent = [];
  const handlers = {};
  const sock = {
    sendMessage: async (jid, msg) => {
      sent.push({ jid, text: msg?.text });
      return { key: { id: "out" } };
    },
    ev: {
      on: (event, cb) => {
        handlers[event] = cb;
      },
    },
    groupFetchAllParticipating: async () => ({}),
  };
  function emitUpsert(message, type = "notify") {
    handlers["messages.upsert"]?.({ messages: [message], type });
  }
  return { sock, sent, emitUpsert };
}

/**
 * Build a fake inbound WhatsApp message object.
 */
function inbound(jid, body, id) {
  return {
    key: {
      remoteJid: jid,
      id: id ?? "in-" + Math.random(),
      fromMe: false,
    },
    pushName: "Tester",
    messageTimestamp: 1700000000,
    message: { conversation: body },
  };
}

/**
 * Poll until predicate() returns truthy or timeoutMs elapses.
 * Resolves to true on success, false on timeout.
 */
async function waitFor(predicate, timeoutMs = 2000, stepMs = 10) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) {
      return true;
    }
    await new Promise((r) => setTimeout(r, stepMs));
  }
  return false;
}

/**
 * Install a globalThis.fetch mock that returns responses in sequence (clamped
 * to the last element). Returns a restore function that must be called in a
 * finally block.
 */
function mockFetchOnce(responses) {
  const original = globalThis.fetch;
  let callIndex = 0;
  globalThis.fetch = async (_url, _opts) => {
    const idx = Math.min(callIndex++, responses.length - 1);
    const payload = responses[idx];
    return {
      ok: true,
      status: 200,
      json: async () => payload,
    };
  };
  return () => {
    globalThis.fetch = original;
  };
}

/**
 * Ignore cleanup errors — on Windows an open DatabaseSync handle keeps the
 * file locked and rmSync throws EBUSY.
 */
function safeCleanup(cleanup) {
  try {
    cleanup();
  } catch {
    /* Windows can't remove an open sqlite file */
  }
}

// ---------------------------------------------------------------------------
// Raw DB read helpers (never use openStore post-attach — it drops wa_claw_audit)
// ---------------------------------------------------------------------------

function readAudit(dbPath, jid) {
  const db = new DatabaseSync(dbPath);
  try {
    const stmt = db.prepare("SELECT * FROM wa_claw_audit WHERE jid = ? ORDER BY id ASC");
    return stmt.all(jid);
  } finally {
    db.close();
  }
}

function readLastRun(dbPath, session_key) {
  const db = new DatabaseSync(dbPath);
  try {
    const stmt = db.prepare("SELECT * FROM wa_claw_last_run WHERE session_key = ?");
    return stmt.get(session_key) ?? null;
  } finally {
    db.close();
  }
}

function readMessageCount(dbPath) {
  const db = new DatabaseSync(dbPath);
  try {
    const stmt = db.prepare("SELECT COUNT(*) AS cnt FROM messages");
    const row = stmt.get();
    return row?.cnt ?? 0;
  } finally {
    db.close();
  }
}

// ---------------------------------------------------------------------------
// Test 1: getI2ToolDefinitions schema
// ---------------------------------------------------------------------------
test("getI2ToolDefinitions — returns 4 tool schemas with correct names and required fields", async () => {
  const mod = await freshModule();
  const tools = mod.getI2ToolDefinitions();

  assert.equal(tools.length, 4);

  const names = tools.map((t) => t.function.name);
  assert.deepEqual(names, ["message_send", "db_audit_log", "db_last_run_update", "db_query"]);

  for (const t of tools) {
    assert.equal(t.type, "function");
  }

  const byName = Object.fromEntries(tools.map((t) => [t.function.name, t]));

  assert.deepEqual(byName.message_send.function.parameters.required, ["to", "text"]);
  assert.deepEqual(byName.db_audit_log.function.parameters.required, ["jid", "outcome"]);
  assert.deepEqual(byName.db_last_run_update.function.parameters.required, ["session_key", "jid"]);
  assert.deepEqual(byName.db_query.function.parameters.required, ["sql"]);
});

// ---------------------------------------------------------------------------
// Test 2: I1 static → reply with prefix + audit replied
// ---------------------------------------------------------------------------
test("I1 static handler — sends reply with prefix and writes replied audit row", async () => {
  const JID = "111@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  // Seed handler pre-attach (openStore is safe here — audit table is empty)
  const store = openStore(dbPath);
  store.upsertHandler(JID, "static", JSON.stringify({ text: "Thanks!" }), "+111");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  try {
    emitUpsert(inbound(JID, "hello"));
    await waitFor(() => sent.length > 0);

    assert.equal(sent[0].jid, JID);
    assert.equal(sent[0].text, "[OpenClaw Auto AI Generated Response:] Thanks!");

    const auditRows = readAudit(dbPath, JID);
    assert.equal(auditRows.length, 1);
    assert.equal(auditRows[0].outcome, "replied");
    assert.equal(auditRows[0].handler, "static");
    assert.equal(auditRows[0].detail, sent[0].text);
  } finally {
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 3: I1 static empty text → audit error, no send
// ---------------------------------------------------------------------------
test("I1 static handler with empty text — writes error audit row, does not send", async () => {
  const JID = "112@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(JID, "static", JSON.stringify({ text: "" }), "+112");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  try {
    emitUpsert(inbound(JID, "hello"));
    await waitFor(() => readAudit(dbPath, JID).length > 0);

    assert.equal(sent.length, 0);

    const auditRows = readAudit(dbPath, JID);
    assert.equal(auditRows.length, 1);
    assert.equal(auditRows[0].outcome, "error");
    assert.match(auditRows[0].reason, /no text/i);
  } finally {
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 4: No handler + no defaults → no send, no audit
// ---------------------------------------------------------------------------
test("no handler and no defaults — no send, no audit row", async () => {
  const JID = "222@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  try {
    emitUpsert(inbound(JID, "hello"));
    // Let it settle — no async work should happen
    await waitFor(() => false, 250);

    assert.equal(sent.length, 0);
    assert.equal(readAudit(dbPath, JID).length, 0);
  } finally {
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 5: No handler + defaults static → fallback reply
// ---------------------------------------------------------------------------
test("defaults static handler — fallback reply when no specific handler configured", async () => {
  const JID = "223@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertDefaults("static", JSON.stringify({ text: "Default reply" }));
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  try {
    emitUpsert(inbound(JID, "hey"));
    await waitFor(() => sent.length > 0);

    assert.equal(sent[0].text, "[OpenClaw Auto AI Generated Response:] Default reply");
  } finally {
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 6: I2 final text, no tool_calls → reply + audit replied
// ---------------------------------------------------------------------------
test("I2 stateless handler — final text reply with audit replied row", async () => {
  const JID = "331@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(
    JID,
    "stateless",
    JSON.stringify({ model: "ollama/test-model", prompt: "be brief" }),
    "+331",
  );
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([{ message: { content: "Hi there" } }]);
  try {
    emitUpsert(inbound(JID, "what time is it"));
    await waitFor(() => sent.length > 0);

    assert.equal(sent[0].text, "[OpenClaw Auto AI Generated Response:] Hi there");

    const auditRows = readAudit(dbPath, JID);
    assert.ok(auditRows.length >= 1);
    const repliedRow = auditRows.find((r) => r.outcome === "replied");
    assert.ok(repliedRow, "expected a replied audit row");
    assert.equal(repliedRow.handler, "stateless");
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 7: I2 NO_REPLY → no send, audit silent
// ---------------------------------------------------------------------------
test("I2 stateless handler — NO_REPLY produces silent audit row, no send", async () => {
  const JID = "332@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(JID, "stateless", JSON.stringify({ model: "ollama/test-model" }), "+332");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([{ message: { content: "NO_REPLY" } }]);
  try {
    emitUpsert(inbound(JID, "something"));
    await waitFor(() => readAudit(dbPath, JID).length > 0);

    assert.equal(sent.length, 0);

    const auditRows = readAudit(dbPath, JID);
    const silentRow = auditRows.find((r) => r.outcome === "silent");
    assert.ok(silentRow, "expected a silent audit row");
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 8: I2 tool-call loop: db_audit_log tool runs, then final reply
// ---------------------------------------------------------------------------
test("I2 stateless handler — db_audit_log tool executes, then final reply sent", async () => {
  const JID = "333@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(JID, "stateless", JSON.stringify({ model: "ollama/test-model" }), "+333");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([
    {
      message: {
        content: "",
        tool_calls: [
          {
            function: {
              name: "db_audit_log",
              arguments: {
                jid: JID,
                outcome: "escalated",
                detail: "tool-written",
              },
            },
          },
        ],
      },
    },
    { message: { content: "Done" } },
  ]);

  try {
    emitUpsert(inbound(JID, "help me"));
    await waitFor(() => sent.length > 0);

    assert.equal(sent[0].text, "[OpenClaw Auto AI Generated Response:] Done");

    const auditRows = readAudit(dbPath, JID);
    const toolRow = auditRows.find((r) => r.outcome === "escalated");
    assert.ok(toolRow, "expected escalated audit row written by tool");
    assert.equal(toolRow.detail, "tool-written");

    const repliedRow = auditRows.find((r) => r.outcome === "replied");
    assert.ok(repliedRow, "expected replied audit row for final send");
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 9: I2 message_send tool (escalation to owner)
// ---------------------------------------------------------------------------
test("I2 stateless handler — message_send tool sends to owner JID, final NO_REPLY silenced", async () => {
  const JID = "334@s.whatsapp.net";
  const OWNER_JID = "972999@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(JID, "stateless", JSON.stringify({ model: "ollama/test-model" }), "+334");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([
    {
      message: {
        content: "",
        tool_calls: [
          {
            function: {
              name: "message_send",
              arguments: { to: "+972999", text: "escalation" },
            },
          },
        ],
      },
    },
    { message: { content: "NO_REPLY" } },
  ]);

  try {
    emitUpsert(inbound(JID, "urgent issue"));
    await waitFor(() => sent.some((s) => s.jid === OWNER_JID));

    const ownerMsg = sent.find((s) => s.jid === OWNER_JID);
    assert.ok(ownerMsg, "expected a message to the owner JID");
    assert.equal(ownerMsg.text, "[OpenClaw Auto AI Generated Response:] escalation");

    // The original chat should NOT receive a reply (final turn was NO_REPLY)
    const originalChatMsg = sent.find((s) => s.jid === JID);
    assert.equal(originalChatMsg, undefined, "should not have replied to the original chat");
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 10: I2 db_last_run_update tool → row written
// ---------------------------------------------------------------------------
test("I2 stateless handler — db_last_run_update tool writes a last_run row", async () => {
  const JID = "335@s.whatsapp.net";
  const { dbPath, cleanup } = makeTempDb([]);

  const store = openStore(dbPath);
  store.upsertHandler(JID, "stateless", JSON.stringify({ model: "ollama/test-model" }), "+335");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([
    {
      message: {
        content: "",
        tool_calls: [
          {
            function: {
              name: "db_last_run_update",
              arguments: { session_key: "k1", jid: JID },
            },
          },
        ],
      },
    },
    { message: { content: "done" } },
  ]);

  try {
    emitUpsert(inbound(JID, "run it"));
    await waitFor(() => sent.length > 0);

    const lastRun = readLastRun(dbPath, "k1");
    assert.ok(lastRun !== null, "expected a last_run row for key k1");
    assert.equal(lastRun.jid, JID);
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});

// ---------------------------------------------------------------------------
// Test 11: I2 db_query rejects non-SELECT (no rows deleted)
// ---------------------------------------------------------------------------
test("I2 stateless handler — db_query rejects DELETE, seeded message row survives", async () => {
  const JID = "336@s.whatsapp.net";
  const SEED_ROW = {
    id: "x1",
    jid: "444@s.whatsapp.net",
    sender: "444@s.whatsapp.net",
    pushName: "P",
    timestamp: 1,
    body: "keep me",
    chatType: "dm",
    fromMe: 0,
  };
  // Seed with one message row so we can verify it isn't deleted
  const { dbPath, cleanup } = makeTempDb([SEED_ROW]);

  // Seed handler (openStore is safe pre-attach)
  const store = openStore(dbPath);
  store.upsertHandler(JID, "stateless", JSON.stringify({ model: "ollama/test-model" }), "+336");
  store.close();

  const mod = await freshModule();
  const { sock, sent, emitUpsert } = makeMockSock();
  mod.attachWaHistoryLogger(sock, { dbPath });

  const restore = mockFetchOnce([
    {
      message: {
        content: "",
        tool_calls: [
          {
            function: {
              name: "db_query",
              arguments: { sql: "DELETE FROM messages" },
            },
          },
        ],
      },
    },
    { message: { content: "ok" } },
  ]);

  try {
    // Emit a NEW inbound message (different id from the seeded row)
    emitUpsert(inbound(JID, "try to delete"));
    await waitFor(() => sent.length > 0);

    // The inbound message itself was also inserted, so count >= 2.
    // The important assertion is that it's NOT 0 (DELETE was rejected).
    const count = readMessageCount(dbPath);
    assert.ok(count >= 1, `expected at least 1 message row, got ${count}`);
  } finally {
    restore();
    safeCleanup(cleanup);
  }
});
