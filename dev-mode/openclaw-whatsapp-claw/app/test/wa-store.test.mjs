import assert from "node:assert/strict";
import test from "node:test";
import { openStore } from "../src/wa-store.mjs";
import { makeTempDb, SAMPLE_ROWS } from "../test-helpers/make-temp-db.mjs";

test("openStore throws a clear error when the db file is missing", () => {
  assert.throws(() => openStore("/no/such/openclaw-whatsapp-claw.db"), /not found/i);
});

test("listChats groups messages into chats, newest first", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const chats = store.listChats();
    assert.equal(chats.length, 2);
    // group 999@g.us has the newest message (ts 1002) -> first
    assert.equal(chats[0].jid, "999@g.us");
    assert.equal(chats[0].chatType, "group");
    assert.equal(chats[0].messageCount, 1);
    const dm = chats.find((c) => c.jid === "111@s.whatsapp.net");
    assert.equal(dm.chatType, "dm");
    assert.equal(dm.messageCount, 2);
    assert.equal(dm.displayName, "Mom"); // newest inbound push_name
    assert.equal(dm.lastTimestamp, 1001);
  } finally {
    store.close();
    cleanup();
  }
});

test("getMessages returns a chat's messages oldest-first with boolean fromMe", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const msgs = store.getMessages("111@s.whatsapp.net");
    assert.equal(msgs.length, 2);
    assert.equal(msgs[0].body, "hi");
    assert.equal(msgs[0].fromMe, false);
    assert.equal(msgs[1].body, "hello mom");
    assert.equal(msgs[1].fromMe, true);
  } finally {
    store.close();
    cleanup();
  }
});

test("getMessages limit keeps the most recent messages, not the oldest", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const page = store.getMessages("111@s.whatsapp.net", 1);
    assert.equal(page.length, 1);
    // the page is the LAST message in the chat, not the first
    assert.equal(page[0].body, "hello mom");
  } finally {
    store.close();
    cleanup();
  }
});

test("listChats uses the group name from the chats table when present", () => {
  const { dbPath, cleanup } = makeTempDb(SAMPLE_ROWS, [
    { jid: "999@g.us", name: "Project Falcon" },
  ]);
  const store = openStore(dbPath);
  try {
    const group = store.listChats().find((c) => c.jid === "999@g.us");
    assert.equal(group.displayName, "Project Falcon");
  } finally {
    store.close();
    cleanup();
  }
});

test("listChats falls back to a short label for groups with no stored name", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const group = store.listChats().find((c) => c.jid === "999@g.us");
    assert.equal(group.displayName, "Group 999");
  } finally {
    store.close();
    cleanup();
  }
});

test("the audit table is created and getAudit returns an empty array initially", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.deepEqual(store.getAudit("111@s.whatsapp.net"), []);
  } finally {
    store.close();
    cleanup();
  }
});

test("getHandler returns null when no handler exists", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.equal(store.getHandler("111@s.whatsapp.net"), null);
  } finally {
    store.close();
    cleanup();
  }
});

test("upsertHandler then getHandler returns the inserted row with correct fields", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const cfg = JSON.stringify({ text: "hello" });
    store.upsertHandler("111@s.whatsapp.net", "static", cfg, "+972501234567");
    const row = store.getHandler("111@s.whatsapp.net");
    assert.notEqual(row, null);
    assert.equal(row.jid, "111@s.whatsapp.net");
    assert.equal(row.phone_e164, "+972501234567");
    assert.equal(row.handler_type, "static");
    assert.equal(row.config_json, cfg);
    assert.equal(row.enabled, 1);
  } finally {
    store.close();
    cleanup();
  }
});

test("upsertHandler replaces an existing handler on second insert", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const cfg1 = JSON.stringify({ text: "first" });
    const cfg2 = JSON.stringify({ text: "second" });
    store.upsertHandler("111@s.whatsapp.net", "static", cfg1, "+972501234567");
    store.upsertHandler("111@s.whatsapp.net", "static", cfg2, "+972501234567");
    const row = store.getHandler("111@s.whatsapp.net");
    assert.equal(row.config_json, cfg2);
  } finally {
    store.close();
    cleanup();
  }
});

test("deleteHandler removes an existing handler", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    store.upsertHandler("111@s.whatsapp.net", "static", JSON.stringify({ text: "hi" }), null);
    store.deleteHandler("111@s.whatsapp.net");
    assert.equal(store.getHandler("111@s.whatsapp.net"), null);
  } finally {
    store.close();
    cleanup();
  }
});

test("getDefaults returns null when not set", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.equal(store.getDefaults(), null);
  } finally {
    store.close();
    cleanup();
  }
});

test("upsertDefaults then getDefaults returns the row; second upsert replaces it", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    const cfg1 = JSON.stringify({ text: "default1" });
    store.upsertDefaults("static", cfg1);
    const row = store.getDefaults();
    assert.notEqual(row, null);
    assert.equal(row.id, 1);
    assert.equal(row.handler_type, "static");
    assert.equal(row.config_json, cfg1);
    assert.equal(row.enabled, 1);

    const cfg2 = JSON.stringify({ text: "default2" });
    store.upsertDefaults("dynamic", cfg2);
    const row2 = store.getDefaults();
    assert.equal(row2.handler_type, "dynamic");
    assert.equal(row2.config_json, cfg2);
  } finally {
    store.close();
    cleanup();
  }
});

test("getLastRun returns null when no row exists", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    assert.equal(store.getLastRun("missing-key"), null);
  } finally {
    store.close();
    cleanup();
  }
});

test("logAudit inserts a row that getAudit can read", () => {
  const { dbPath, cleanup } = makeTempDb();
  const store = openStore(dbPath);
  try {
    store.logAudit(
      "111@s.whatsapp.net",
      "msg-1",
      "static",
      "replied",
      null,
      "test detail",
      "+972501234567",
    );
    const rows = store.getAudit("111@s.whatsapp.net");
    assert.equal(rows.length, 1);
    assert.equal(rows[0].handler, "static");
    assert.equal(rows[0].outcome, "replied");
    assert.equal(rows[0].detail, "test detail");
  } finally {
    store.close();
    cleanup();
  }
});
