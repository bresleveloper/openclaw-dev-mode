/**
 * Unit tests for oc-config.mjs — the OpenClaw config CLI wrapper,
 * JID normalization, cron classification, defaults, and reverse-mapping logic.
 *
 * Run (single file):
 *   node --test "dev-mode/openclaw-whatsapp-claw/app/test/oc-config.test.mjs"
 *
 * Run (full suite, from app dir):
 *   cd "dev-mode/openclaw-whatsapp-claw/app"; npm test
 */

import assert from "node:assert/strict";
import { test, beforeEach, afterEach, describe } from "node:test";
import { CronSubType, HandlerTaxonomyId } from "../src/enums.mjs";
import {
  setExecRunner,
  resetExecRunner,
  clearCache,
  ocConfigGet,
  ocCronList,
  normalizeJid,
  jidToPhone,
  classifyCron,
  getDefaults,
  getHandlerForJid,
} from "../src/oc-config.mjs";

// ---------------------------------------------------------------------------
// Shared test hygiene — clear the 30 s cache before/after every test.
// ---------------------------------------------------------------------------
beforeEach(() => clearCache());
afterEach(() => {
  resetExecRunner();
  clearCache();
});

// ---------------------------------------------------------------------------
// Helper: build a runner that dispatches on args.
// map.config[path]  → returned for  openclaw config get <path> --json
// map.cron          → returned for  openclaw cron list --json
// A missing key in map.config returns "" (→ ocConfigGet returns null).
// counter.calls is incremented on every invocation when provided.
// ---------------------------------------------------------------------------
function makeRunner(map, counter) {
  return (file, args) => {
    if (counter) {
      counter.calls++;
    }
    if (args[0] === "config" && args[1] === "get") {
      const path = args[2];
      if (map.config != null && Object.prototype.hasOwnProperty.call(map.config, path)) {
        const v = map.config[path];
        return JSON.stringify(v);
      }
      return ""; // missing → ocConfigGet returns null
    }
    if (args[0] === "cron" && args[1] === "list") {
      if (map.cron !== undefined) {
        return JSON.stringify(map.cron);
      }
      return "[]";
    }
    return "";
  };
}

// ---------------------------------------------------------------------------
// Helper: build a plain stub store (no real DB needed).
// ---------------------------------------------------------------------------
function makeStore({ handler = null, defaults = null } = {}) {
  return {
    getHandler: (_jid) => handler,
    getDefaults: () => defaults,
  };
}

// ===========================================================================
// 1. normalizeJid edge cases
// ===========================================================================
describe("normalizeJid", () => {
  test("E.164 +972541234567 → 972541234567@s.whatsapp.net", () => {
    assert.equal(normalizeJid("+972541234567"), "972541234567@s.whatsapp.net");
  });

  test("bare digits 972541234567 → 972541234567@s.whatsapp.net", () => {
    assert.equal(normalizeJid("972541234567"), "972541234567@s.whatsapp.net");
  });

  test("already-JID passthrough (no device suffix)", () => {
    assert.equal(normalizeJid("972541234567@s.whatsapp.net"), "972541234567@s.whatsapp.net");
  });

  test("device suffix stripped: 972541234567:12@s.whatsapp.net → 972541234567@s.whatsapp.net", () => {
    assert.equal(normalizeJid("972541234567:12@s.whatsapp.net"), "972541234567@s.whatsapp.net");
  });

  test("group JID passthrough: 1234-5678@g.us", () => {
    assert.equal(normalizeJid("1234-5678@g.us"), "1234-5678@g.us");
  });

  test("@lid JID passthrough", () => {
    assert.equal(normalizeJid("972541234567@lid"), "972541234567@lid");
  });

  test("null → null", () => {
    assert.equal(normalizeJid(null), null);
  });

  test("undefined → null", () => {
    assert.equal(normalizeJid(undefined), null);
  });

  test("empty string → null", () => {
    assert.equal(normalizeJid(""), null);
  });

  test("whitespace-only → null", () => {
    assert.equal(normalizeJid("   "), null);
  });

  test("no-digits string → null", () => {
    assert.equal(normalizeJid("abcdef"), null);
  });
});

// ===========================================================================
// 2. jidToPhone edge cases
// ===========================================================================
describe("jidToPhone", () => {
  test("@s.whatsapp.net JID → +E164", () => {
    assert.equal(jidToPhone("972541234567@s.whatsapp.net"), "+972541234567");
  });

  test("@s.whatsapp.net JID with :NN device suffix stripped", () => {
    assert.equal(jidToPhone("972541234567:12@s.whatsapp.net"), "+972541234567");
  });

  test("bare E.164 +972... → +972...", () => {
    assert.equal(jidToPhone("+972541234567"), "+972541234567");
  });

  test("bare digits 972... → +972...", () => {
    assert.equal(jidToPhone("972541234567"), "+972541234567");
  });

  test("group @g.us → null", () => {
    assert.equal(jidToPhone("1234-5678@g.us"), null);
  });

  test("@lid → null", () => {
    assert.equal(jidToPhone("972541234567@lid"), null);
  });

  test("null → null", () => {
    assert.equal(jidToPhone(null), null);
  });

  test("undefined → null", () => {
    assert.equal(jidToPhone(undefined), null);
  });

  test("@s.whatsapp.net with no digits → null", () => {
    // contrived, but ensures the branch is covered
    assert.equal(jidToPhone("@s.whatsapp.net"), null);
  });
});

// ===========================================================================
// 3. classifyCron
// ===========================================================================
describe("classifyCron", () => {
  test("systemEvent → Agent (CronSubType.Agent)", () => {
    assert.equal(classifyCron({ payload: { kind: "systemEvent" } }), CronSubType.Agent);
  });

  test("systemEvent + lightContext:true → Agent (systemEvent takes precedence)", () => {
    assert.equal(
      classifyCron({ payload: { kind: "systemEvent", lightContext: true } }),
      CronSubType.Agent,
    );
  });

  test("agentTurn + lightContext:true → Stupid", () => {
    assert.equal(
      classifyCron({ payload: { kind: "agentTurn", lightContext: true } }),
      CronSubType.Stupid,
    );
  });

  test("agentTurn + lightContext:false → Smart", () => {
    assert.equal(
      classifyCron({ payload: { kind: "agentTurn", lightContext: false } }),
      CronSubType.Smart,
    );
  });

  test("agentTurn + no lightContext → Smart", () => {
    assert.equal(classifyCron({ payload: { kind: "agentTurn" } }), CronSubType.Smart);
  });

  test("missing payload → Smart", () => {
    assert.equal(classifyCron({}), CronSubType.Smart);
  });

  test("payload is undefined → Smart", () => {
    assert.equal(classifyCron({ payload: undefined }), CronSubType.Smart);
  });
});

// ===========================================================================
// 4. Cache behavior
// ===========================================================================
describe("cache behavior", () => {
  test("ocConfigGet: runner invoked once; second call served from cache", () => {
    const counter = { calls: 0 };
    setExecRunner(makeRunner({ config: { "agents.list": [{ id: "a1" }] } }, counter));

    const first = ocConfigGet("agents.list");
    const second = ocConfigGet("agents.list");

    assert.equal(counter.calls, 1);
    assert.deepEqual(first, [{ id: "a1" }]);
    assert.deepEqual(second, [{ id: "a1" }]);
  });

  test("ocConfigGet: clearCache causes runner to be invoked again", () => {
    const counter = { calls: 0 };
    setExecRunner(makeRunner({ config: { "agents.list": [{ id: "a2" }] } }, counter));

    ocConfigGet("agents.list");
    clearCache();
    ocConfigGet("agents.list");

    assert.equal(counter.calls, 2);
  });

  test("ocConfigGet: null result (runner throws) is NOT cached — second call retries", () => {
    const counter = { calls: 0 };
    let shouldThrow = true;
    setExecRunner((file, args) => {
      counter.calls++;
      if (shouldThrow) {
        throw new Error("ENOENT");
      }
      return JSON.stringify({ value: 42 });
    });

    const first = ocConfigGet("some.path");
    assert.equal(first, null);
    assert.equal(counter.calls, 1);

    // Now let the runner succeed on the second call.
    shouldThrow = false;
    const second = ocConfigGet("some.path");
    assert.deepEqual(second, { value: 42 });
    assert.equal(counter.calls, 2);
  });

  test("ocCronList: runner invoked once; second call served from cache", () => {
    const counter = { calls: 0 };
    setExecRunner(makeRunner({ cron: [{ id: "cron1" }] }, counter));

    const first = ocCronList();
    const second = ocCronList();

    assert.equal(counter.calls, 1);
    assert.deepEqual(first, [{ id: "cron1" }]);
    assert.deepEqual(second, [{ id: "cron1" }]);
  });

  test("ocCronList: [] error result is NOT cached — second call retries", () => {
    const counter = { calls: 0 };
    let shouldThrow = true;
    setExecRunner((file, args) => {
      counter.calls++;
      if (shouldThrow) {
        throw new Error("fail");
      }
      return JSON.stringify([{ id: "c1" }]);
    });

    const first = ocCronList();
    assert.deepEqual(first, []);
    assert.equal(counter.calls, 1);

    shouldThrow = false;
    const second = ocCronList();
    assert.deepEqual(second, [{ id: "c1" }]);
    assert.equal(counter.calls, 2);
  });
});

// ===========================================================================
// 5. ocConfigGet / ocCronList parsing
// ===========================================================================
describe("ocConfigGet parsing", () => {
  test("valid JSON returned → parsed value", () => {
    setExecRunner(makeRunner({ config: { "agents.list": [{ id: "x" }] } }));
    assert.deepEqual(ocConfigGet("agents.list"), [{ id: "x" }]);
  });

  test("empty stdout → null", () => {
    setExecRunner((_file, _args) => "");
    assert.equal(ocConfigGet("agents.list"), null);
  });

  test("whitespace-only stdout → null", () => {
    setExecRunner((_file, _args) => "   \n  ");
    assert.equal(ocConfigGet("agents.list"), null);
  });

  test("invalid JSON stdout → null", () => {
    setExecRunner((_file, _args) => "not-valid-json{");
    assert.equal(ocConfigGet("agents.list"), null);
  });

  test("runner throws → null", () => {
    setExecRunner((_file, _args) => {
      throw new Error("ENOENT");
    });
    assert.equal(ocConfigGet("agents.list"), null);
  });
});

describe("ocCronList parsing", () => {
  test("plain array → returned as-is", () => {
    setExecRunner(makeRunner({ cron: [{ id: "j1" }, { id: "j2" }] }));
    assert.deepEqual(ocCronList(), [{ id: "j1" }, { id: "j2" }]);
  });

  test("{crons:[...]} wrapper → inner array", () => {
    setExecRunner((_file, _args) => JSON.stringify({ crons: [{ id: "c1" }] }));
    assert.deepEqual(ocCronList(), [{ id: "c1" }]);
  });

  test("{jobs:[...]} wrapper → inner array", () => {
    setExecRunner((_file, _args) => JSON.stringify({ jobs: [{ id: "j3" }] }));
    assert.deepEqual(ocCronList(), [{ id: "j3" }]);
  });

  test("{} empty object (no known wrapper key) → []", () => {
    setExecRunner((_file, _args) => JSON.stringify({}));
    assert.deepEqual(ocCronList(), []);
  });

  test("invalid JSON → []", () => {
    setExecRunner((_file, _args) => "bad{{json");
    assert.deepEqual(ocCronList(), []);
  });

  test("runner throws → []", () => {
    setExecRunner((_file, _args) => {
      throw new Error("fail");
    });
    assert.deepEqual(ocCronList(), []);
  });
});

// ===========================================================================
// 6. getDefaults
// ===========================================================================
describe("getDefaults", () => {
  test("store row present → waClaw populated with parsed config + oc from agents.defaults", () => {
    const row = {
      handler_type: "static",
      config_json: JSON.stringify({ text: "hi" }),
      enabled: 1,
      updated_at: 1700000000,
    };
    setExecRunner(makeRunner({ config: { "agents.defaults": { model: "gpt-4o" } } }));
    const result = getDefaults(makeStore({ defaults: row }));

    assert.ok(result.waClaw !== null);
    assert.equal(result.waClaw.handler_type, "static");
    assert.deepEqual(result.waClaw.config, { text: "hi" });
    assert.equal(result.waClaw.enabled, 1);
    assert.equal(result.waClaw.updated_at, 1700000000);
    assert.deepEqual(result.oc, { model: "gpt-4o" });
  });

  test("store returns null → waClaw:null, oc from agents.defaults", () => {
    setExecRunner(makeRunner({ config: { "agents.defaults": { model: "mistral" } } }));
    const result = getDefaults(makeStore({ defaults: null }));

    assert.equal(result.waClaw, null);
    assert.deepEqual(result.oc, { model: "mistral" });
  });

  test("store returns null AND agents.defaults missing → { waClaw:null, oc:null }", () => {
    setExecRunner(makeRunner({ config: {} }));
    const result = getDefaults(makeStore({ defaults: null }));

    assert.equal(result.waClaw, null);
    assert.equal(result.oc, null);
  });

  test("bad config_json in store row → waClaw.config is {}", () => {
    const row = {
      handler_type: "stateless",
      config_json: "INVALID_JSON{{{",
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {} }));
    const result = getDefaults(makeStore({ defaults: row }));

    assert.ok(result.waClaw !== null);
    assert.deepEqual(result.waClaw.config, {});
  });

  test("null store → { waClaw:null, oc:null }", () => {
    setExecRunner(makeRunner({ config: {} }));
    const result = getDefaults(null);

    assert.equal(result.waClaw, null);
    assert.equal(result.oc, null);
  });
});

// ===========================================================================
// 7. getHandlerForJid — reverse mapping
// ===========================================================================

const JID = "972541234567@s.whatsapp.net";
const PHONE = "+972541234567";

describe("getHandlerForJid — custom handler", () => {
  test("custom static handler → source:custom, taxonomy I1, writable:true", () => {
    const store = makeStore({
      handler: {
        handler_type: "static",
        config_json: JSON.stringify({ text: "hello" }),
        enabled: 1,
      },
    });
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, store);

    assert.equal(result.jid, JID);
    assert.equal(result.phone, PHONE);
    assert.equal(result.usingDefaults, false);
    assert.equal(result.handlers.length, 1);
    const h = result.handlers[0];
    assert.equal(h.source, "custom");
    assert.equal(h.taxonomy, HandlerTaxonomyId.I1);
    assert.equal(h.writable, true);
    assert.equal(h.handlerType, "static");
    assert.deepEqual(h.config, { text: "hello" });
    assert.ok(result.taxonomy.includes(HandlerTaxonomyId.I1));
  });

  test("custom stateless handler → source:custom, taxonomy I2", () => {
    const store = makeStore({
      handler: {
        handler_type: "stateless",
        config_json: JSON.stringify({ model: "ollama/test" }),
        enabled: 1,
      },
    });
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, store);

    assert.equal(result.handlers.length, 1);
    assert.equal(result.handlers[0].taxonomy, HandlerTaxonomyId.I2);
    assert.equal(result.handlers[0].source, "custom");
  });

  test("custom handler with enabled=0 → ignored", () => {
    const store = makeStore({
      handler: {
        handler_type: "static",
        config_json: JSON.stringify({ text: "ignored" }),
        enabled: 0,
      },
    });
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, store);

    // No custom match; usingDefaults=true because nothing else matched.
    assert.equal(result.usingDefaults, true);
    assert.equal(result.handlers.filter((h) => h.source === "custom").length, 0);
  });
});

describe("getHandlerForJid — OC bindings", () => {
  test("peer-matched binding with agent systemPromptOverride → taxonomy I3", () => {
    const bindings = [
      {
        agentId: "agent1",
        match: { channel: "whatsapp", peer: { id: JID } },
        session: {},
      },
    ];
    const agentsList = [
      {
        id: "agent1",
        name: "Agent One",
        model: "ollama/test",
        systemPromptOverride: "You are helpful.",
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          bindings,
          "agents.list": agentsList,
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    const binding = result.handlers.find((h) => h.source === "binding");
    assert.ok(binding, "expected a binding handler");
    assert.equal(binding.taxonomy, HandlerTaxonomyId.I3);
    assert.equal(binding.writable, false);
    assert.equal(binding.agentId, "agent1");
    assert.equal(binding.agentName, "Agent One");
    assert.equal(binding.systemPromptOverride, "You are helpful.");
    assert.equal(binding.channelWide, false);
  });

  test("peer-matched binding without systemPromptOverride → taxonomy I4", () => {
    const bindings = [
      {
        agentId: "agent2",
        match: { channel: "whatsapp", peer: { id: JID } },
        session: {},
      },
    ];
    const agentsList = [{ id: "agent2", name: "Agent Two", model: "ollama/test" }];
    setExecRunner(
      makeRunner({
        config: {
          bindings,
          "agents.list": agentsList,
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    const binding = result.handlers.find((h) => h.source === "binding");
    assert.ok(binding, "expected a binding handler");
    assert.equal(binding.taxonomy, HandlerTaxonomyId.I4);
    assert.equal(binding.systemPromptOverride, null);
  });

  test("channel-wide binding (no peer) → matches + channelWide:true", () => {
    const bindings = [
      {
        agentId: "agent3",
        match: { channel: "whatsapp" }, // no peer
        session: {},
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          bindings,
          "agents.list": [],
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    const binding = result.handlers.find((h) => h.source === "binding");
    assert.ok(binding, "expected a channel-wide binding handler");
    assert.equal(binding.channelWide, true);
  });

  test("binding for different channel (not whatsapp) → not matched", () => {
    const bindings = [
      {
        agentId: "agent4",
        match: { channel: "discord", peer: { id: JID } },
        session: {},
      },
    ];
    setExecRunner(
      makeRunner({
        config: { bindings, "agents.list": [], "agents.defaults": {} },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());
    assert.equal(result.handlers.filter((h) => h.source === "binding").length, 0);
  });

  test("binding with E.164 peer.id matches JID chat", () => {
    // peer.id stored as E.164 — normalizeJid should map it to the same canonical JID
    const bindings = [
      {
        agentId: "agent5",
        match: { channel: "whatsapp", peer: { id: PHONE } },
        session: {},
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          bindings,
          "agents.list": [],
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    assert.equal(result.handlers.filter((h) => h.source === "binding").length, 1);
  });
});

describe("getHandlerForJid — cron jobs", () => {
  test("cron delivery.to matching the JID, systemEvent → source:cron, taxonomy S1c", () => {
    const crons = [
      {
        id: "cron-agent",
        name: "agent cron",
        schedule: "0 * * * *",
        delivery: { to: JID },
        payload: { kind: "systemEvent" },
      },
    ];
    setExecRunner(makeRunner({ config: {}, cron: crons }));

    const result = getHandlerForJid(JID, makeStore());

    const cron = result.handlers.find((h) => h.source === "cron");
    assert.ok(cron, "expected a cron handler");
    assert.equal(cron.taxonomy, HandlerTaxonomyId.S1c);
    assert.equal(cron.subType, CronSubType.Agent);
    assert.equal(cron.cronId, "cron-agent");
  });

  test("cron delivery.to matching via E.164, lightContext:true → S1a", () => {
    const crons = [
      {
        id: "cron-stupid",
        name: "stupid cron",
        schedule: "*/5 * * * *",
        delivery: { to: PHONE }, // stored as E.164
        payload: { kind: "agentTurn", lightContext: true },
      },
    ];
    setExecRunner(makeRunner({ config: {}, cron: crons }));

    const result = getHandlerForJid(JID, makeStore());

    const cron = result.handlers.find((h) => h.source === "cron");
    assert.ok(cron, "expected cron handler via E.164 delivery.to");
    assert.equal(cron.taxonomy, HandlerTaxonomyId.S1a);
    assert.equal(cron.subType, CronSubType.Stupid);
  });

  test("cron delivery.to matching, lightContext:false → S1b", () => {
    const crons = [
      {
        id: "cron-smart",
        name: "smart cron",
        schedule: "0 9 * * *",
        delivery: { to: JID },
        payload: { kind: "agentTurn", lightContext: false },
      },
    ];
    setExecRunner(makeRunner({ config: {}, cron: crons }));

    const result = getHandlerForJid(JID, makeStore());

    const cron = result.handlers.find((h) => h.source === "cron");
    assert.ok(cron, "expected cron handler");
    assert.equal(cron.taxonomy, HandlerTaxonomyId.S1b);
    assert.equal(cron.subType, CronSubType.Smart);
  });

  test("cron with non-matching delivery.to → not included", () => {
    const crons = [
      {
        id: "cron-other",
        delivery: { to: "999999999@s.whatsapp.net" },
        payload: { kind: "agentTurn" },
      },
    ];
    setExecRunner(makeRunner({ config: {}, cron: crons }));

    const result = getHandlerForJid(JID, makeStore());
    assert.equal(result.handlers.filter((h) => h.source === "cron").length, 0);
  });
});

describe("getHandlerForJid — heartbeat", () => {
  test("agents.list entry with heartbeat.to matching → source:heartbeat, taxonomy S2", () => {
    const agentsList = [
      {
        id: "heart-agent",
        name: "Heartbeat Agent",
        model: "ollama/test",
        heartbeat: {
          to: JID,
          every: "1h",
          target: "main",
          lightContext: false,
        },
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          "agents.list": agentsList,
          bindings: [],
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    const hb = result.handlers.find((h) => h.source === "heartbeat");
    assert.ok(hb, "expected a heartbeat handler");
    assert.equal(hb.taxonomy, HandlerTaxonomyId.S2);
    assert.equal(hb.writable, false);
    assert.equal(hb.agentId, "heart-agent");
    assert.equal(hb.agentName, "Heartbeat Agent");
    assert.equal(hb.every, "1h");
    assert.equal(hb.to, JID);
  });

  test("heartbeat.to as E.164 matching chat JID", () => {
    const agentsList = [
      {
        id: "heart-agent2",
        name: "HB2",
        heartbeat: { to: PHONE },
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          "agents.list": agentsList,
          bindings: [],
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    assert.equal(result.handlers.filter((h) => h.source === "heartbeat").length, 1);
  });

  test("heartbeat.to not matching → not included", () => {
    const agentsList = [
      {
        id: "heart-agent3",
        heartbeat: { to: "999@s.whatsapp.net" },
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          "agents.list": agentsList,
          bindings: [],
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());
    assert.equal(result.handlers.filter((h) => h.source === "heartbeat").length, 0);
  });
});

describe("getHandlerForJid — defaults fallback", () => {
  test("no specific match + store.getDefaults returns static row → usingDefaults:true, source:defaults, taxonomy I1", () => {
    const defRow = {
      handler_type: "static",
      config_json: JSON.stringify({ text: "Default" }),
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: defRow }));

    assert.equal(result.usingDefaults, true);
    assert.equal(result.handlers.length, 1);
    const h = result.handlers[0];
    assert.equal(h.source, "defaults");
    assert.equal(h.taxonomy, HandlerTaxonomyId.I1);
    assert.deepEqual(h.config, { text: "Default" });
  });

  test("no specific match + store.getDefaults returns stateless row → taxonomy I2", () => {
    const defRow = {
      handler_type: "stateless",
      config_json: JSON.stringify({ model: "x" }),
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: defRow }));

    assert.equal(result.usingDefaults, true);
    assert.equal(result.handlers[0].taxonomy, HandlerTaxonomyId.I2);
  });

  test("no specific match + store.getDefaults returns cron row → taxonomy S1a", () => {
    const defRow = {
      handler_type: "cron",
      config_json: "{}",
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: defRow }));

    assert.equal(result.handlers[0].taxonomy, HandlerTaxonomyId.S1a);
  });

  test("no specific match + store.getDefaults returns heartbeat row → taxonomy S2", () => {
    const defRow = {
      handler_type: "heartbeat",
      config_json: "{}",
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: defRow }));

    assert.equal(result.handlers[0].taxonomy, HandlerTaxonomyId.S2);
  });

  test("no specific match + store.getDefaults returns null → handlers:[], usingDefaults:true, taxonomy:[]", () => {
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: null }));

    assert.equal(result.usingDefaults, true);
    assert.equal(result.handlers.length, 0);
    assert.deepEqual(result.taxonomy, []);
  });

  test("no specific match + getDefaults returns handler_type:'none' → handlers:[], usingDefaults:true", () => {
    const defRow = {
      handler_type: "none",
      config_json: "{}",
      enabled: 1,
      updated_at: 0,
    };
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, makeStore({ defaults: defRow }));

    assert.equal(result.usingDefaults, true);
    assert.equal(result.handlers.length, 0);
  });
});

describe("getHandlerForJid — multiple handlers", () => {
  test("custom handler + matching cron → handlers.length===2, both taxonomies present, usingDefaults:false", () => {
    const store = makeStore({
      handler: {
        handler_type: "static",
        config_json: JSON.stringify({ text: "hi" }),
        enabled: 1,
      },
    });
    const crons = [
      {
        id: "multi-cron",
        delivery: { to: JID },
        payload: { kind: "agentTurn", lightContext: true },
      },
    ];
    setExecRunner(makeRunner({ config: {}, cron: crons }));

    const result = getHandlerForJid(JID, store);

    assert.equal(result.usingDefaults, false);
    assert.equal(result.handlers.length, 2);

    const sources = result.handlers.map((h) => h.source);
    assert.ok(sources.includes("custom"), "expected custom source");
    assert.ok(sources.includes("cron"), "expected cron source");

    assert.ok(result.taxonomy.includes(HandlerTaxonomyId.I1));
    assert.ok(result.taxonomy.includes(HandlerTaxonomyId.S1a));
  });

  test("binding + heartbeat both matching → handlers.length===2, usingDefaults:false", () => {
    const bindings = [
      {
        agentId: "a1",
        match: { channel: "whatsapp", peer: { id: JID } },
        session: {},
      },
    ];
    const agentsList = [
      {
        id: "a1",
        name: "A1",
        heartbeat: { to: JID, every: "2h" },
      },
    ];
    setExecRunner(
      makeRunner({
        config: {
          bindings,
          "agents.list": agentsList,
          "agents.defaults": {},
        },
        cron: [],
      }),
    );

    const result = getHandlerForJid(JID, makeStore());

    assert.equal(result.usingDefaults, false);
    assert.equal(result.handlers.length, 2);

    const sources = result.handlers.map((h) => h.source);
    assert.ok(sources.includes("binding"));
    assert.ok(sources.includes("heartbeat"));
  });

  test("when specific handlers matched, defaults fallback is NOT used even if store.getDefaults returns a row", () => {
    const store = makeStore({
      handler: {
        handler_type: "static",
        config_json: JSON.stringify({ text: "specific" }),
        enabled: 1,
      },
      defaults: {
        handler_type: "stateless",
        config_json: "{}",
        enabled: 1,
        updated_at: 0,
      },
    });
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(JID, store);

    // Custom handler matched → defaults NOT applied.
    assert.equal(result.usingDefaults, false);
    assert.equal(result.handlers.filter((h) => h.source === "defaults").length, 0);
    assert.equal(result.handlers.length, 1);
  });
});

describe("getHandlerForJid — jid / phone fields", () => {
  test("querying with E.164 phone → jid normalized, phone set", () => {
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(PHONE, makeStore());

    assert.equal(result.jid, JID);
    assert.equal(result.phone, PHONE);
  });

  test("querying with group JID → jid is group, phone is null", () => {
    const groupJid = "1234-5678@g.us";
    setExecRunner(makeRunner({ config: {}, cron: [] }));

    const result = getHandlerForJid(groupJid, makeStore());

    assert.equal(result.jid, groupJid);
    assert.equal(result.phone, null);
  });
});
