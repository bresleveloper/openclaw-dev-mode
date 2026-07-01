import assert from "node:assert/strict";
import test from "node:test";
import {
  filterChats,
  formatTimestamp,
  messageLineClass,
  taxonomyLabel,
  buildHandlerSections,
  buildHandlerPayload,
  parseHandlerConfig,
  defaultHandlerLabel,
  parseDefaultsConfig,
  buildDefaultsPayload,
  HANDLER_FLOW_CHARTS,
} from "../public/lib.js";

test("filterChats matches displayName and jid, case-insensitive", () => {
  const chats = [
    { jid: "111@s.whatsapp.net", displayName: "Mom" },
    { jid: "999@g.us", displayName: "Group 999" },
  ];
  assert.equal(filterChats(chats, "mom").length, 1);
  assert.equal(filterChats(chats, "999").length, 1);
  assert.equal(filterChats(chats, "").length, 2);
  assert.equal(filterChats(chats, "   ").length, 2);
});

test("formatTimestamp formats unix seconds and handles 0", () => {
  assert.equal(formatTimestamp(0), "");
  assert.equal(formatTimestamp(1000), "1970-01-01 00:16");
});

test("messageLineClass reflects message direction", () => {
  assert.equal(messageLineClass({ fromMe: true }), "msg msg-out");
  assert.equal(messageLineClass({ fromMe: false }), "msg msg-in");
});

// ---- taxonomyLabel ----

test("taxonomyLabel: known ids map to human labels", () => {
  assert.equal(taxonomyLabel("I1"), "Static Reply (I1)");
  assert.equal(taxonomyLabel("I2"), "Stateless AI (I2)");
  assert.equal(taxonomyLabel("I3"), "Thin Agent (I3)");
  assert.equal(taxonomyLabel("I4"), "Full Agent (I4)");
  assert.equal(taxonomyLabel("S1a"), "Stupid Cron (S1a)");
  assert.equal(taxonomyLabel("S1b"), "Smart Cron (S1b)");
  assert.equal(taxonomyLabel("S1c"), "Agent Cron (S1c)");
  assert.equal(taxonomyLabel("S2"), "Heartbeat (S2)");
});

test("taxonomyLabel: unknown id returns itself", () => {
  assert.equal(taxonomyLabel("UNKNOWN"), "UNKNOWN");
  assert.equal(taxonomyLabel("X99"), "X99");
});

test("taxonomyLabel: falsy input returns '-'", () => {
  assert.equal(taxonomyLabel(""), "-");
  assert.equal(taxonomyLabel(null), "-");
  assert.equal(taxonomyLabel(undefined), "-");
});

// ---- buildHandlerSections ----

test("buildHandlerSections: returns [] for null", () => {
  assert.deepEqual(buildHandlerSections(null), []);
});

test("buildHandlerSections: returns [] for {}", () => {
  assert.deepEqual(buildHandlerSections({}), []);
});

test("buildHandlerSections: returns [] for {handlers: []}", () => {
  assert.deepEqual(buildHandlerSections({ handlers: [] }), []);
});

test("buildHandlerSections: custom static I1 handler -> Instant Handler section", () => {
  const ocData = {
    handlers: [
      {
        source: "custom",
        taxonomy: "I1",
        writable: true,
        handlerType: "static",
        config: { text: "Thanks, I'll reply later." },
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  assert.equal(sec.title, "Instant Handler");
  assert.equal(sec.source, "WA Claw (custom handler)");
  assert.equal(sec.readOnly, false);
  assert.equal(sec.taxonomy, "I1");
  const typeRow = sec.rows.find(([l]) => l === "Type");
  assert.ok(typeRow, "has Type row");
  assert.equal(typeRow[1], "Static Reply (I1)");
  const modelRow = sec.rows.find(([l]) => l === "Model");
  assert.ok(modelRow, "has Model row");
  assert.equal(modelRow[1], "(none -- static)");
  const textRow = sec.rows.find(([l]) => l === "Text");
  assert.ok(textRow, "has Text row");
  assert.equal(textRow[1], "Thanks, I'll reply later.");
});

test("buildHandlerSections: custom stateless I2 handler -> Prompt and Model rows", () => {
  const ocData = {
    handlers: [
      {
        source: "custom",
        taxonomy: "I2",
        writable: true,
        handlerType: "stateless",
        config: { model: "ollama/llama3", prompt: "You are a helpful assistant." },
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  assert.equal(sec.title, "Instant Handler");
  const modelRow = sec.rows.find(([l]) => l === "Model");
  assert.ok(modelRow, "has Model row");
  assert.equal(modelRow[1], "ollama/llama3");
  const promptRow = sec.rows.find(([l]) => l === "Prompt");
  assert.ok(promptRow, "has Prompt row");
  assert.equal(promptRow[1], "You are a helpful assistant.");
});

test("buildHandlerSections: binding I3 with systemPromptOverride -> System prompt row", () => {
  const ocData = {
    handlers: [
      {
        source: "binding",
        taxonomy: "I3",
        writable: false,
        channelWide: false,
        agentId: "thin-agent-alice",
        agentName: "thin-agent-alice",
        model: "ollama/kimi-k2.6:cloud",
        systemPromptOverride: "You are Alice's assistant.",
        sessionScope: "per-peer",
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  assert.equal(sec.title, "OC Binding");
  assert.equal(sec.source, "OC config (read-only)");
  assert.equal(sec.readOnly, true);
  const spRow = sec.rows.find(([l]) => l === "System prompt");
  assert.ok(spRow, "has System prompt row");
  assert.equal(spRow[1], "You are Alice's assistant.");
});

test("buildHandlerSections: binding I4 without systemPromptOverride -> bootstrap label", () => {
  const ocData = {
    handlers: [
      {
        source: "binding",
        taxonomy: "I4",
        writable: false,
        channelWide: false,
        agentId: "main-agent",
        agentName: "main-agent",
        model: "ollama/kimi-k2.6:cloud",
        systemPromptOverride: null,
        sessionScope: "per-peer",
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  const spRow = sec.rows.find(([l]) => l === "System prompt");
  assert.ok(spRow, "has System prompt row");
  assert.equal(spRow[1], "(full agent -- all bootstrap)");
});

test("buildHandlerSections: cron S1a handler -> Scheduled section", () => {
  const ocData = {
    handlers: [
      {
        source: "cron",
        taxonomy: "S1a",
        writable: false,
        cronId: "cron-1",
        name: "Check Alice",
        schedule: "*/30 * * * *",
        agentId: "default",
        sessionTarget: "isolated",
        payloadPreview: null,
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  assert.equal(sec.title, "Scheduled");
  assert.equal(sec.source, "OC cron (read-only)");
  assert.equal(sec.readOnly, true);
  const cronRow = sec.rows.find(([l]) => l === "Cron");
  assert.ok(cronRow, "has Cron row");
  assert.equal(cronRow[1], "Check Alice");
});

test("buildHandlerSections: heartbeat S2 handler -> Scheduled section", () => {
  const ocData = {
    handlers: [
      {
        source: "heartbeat",
        taxonomy: "S2",
        writable: false,
        agentId: "main-agent",
        agentName: "main-agent",
        every: "30m",
        target: "self",
        to: "+972501234567",
        lightContext: false,
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  const sec = sections[0];
  assert.equal(sec.title, "Scheduled");
  assert.equal(sec.source, "OC heartbeat (read-only)");
  assert.equal(sec.readOnly, true);
  const everyRow = sec.rows.find(([l]) => l === "Every");
  assert.ok(everyRow, "has Every row");
  assert.equal(everyRow[1], "30m");
});

test("buildHandlerSections: multiple handlers -> sections in same order", () => {
  const ocData = {
    handlers: [
      { source: "custom", taxonomy: "I1", config: { text: "hi" }, record: {} },
      {
        source: "binding",
        taxonomy: "I3",
        agentId: "a",
        agentName: "a",
        model: "m",
        systemPromptOverride: "sp",
        sessionScope: "per-peer",
        channelWide: false,
        record: {},
      },
      { source: "cron", taxonomy: "S1a", name: "job", agentId: "a", record: {} },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 3);
  assert.equal(sections[0].title, "Instant Handler");
  assert.equal(sections[1].title, "OC Binding");
  assert.equal(sections[2].title, "Scheduled");
});

test("buildHandlerSections: defaults-source static handler -> source 'WA Claw (default)'", () => {
  const ocData = {
    handlers: [
      {
        source: "defaults",
        taxonomy: "I1",
        writable: true,
        handlerType: "static",
        config: { text: "Default reply." },
        record: {},
      },
    ],
  };
  const sections = buildHandlerSections(ocData);
  assert.equal(sections.length, 1);
  assert.equal(sections[0].source, "WA Claw (default)");
});

// ---- buildHandlerPayload ----

test("buildHandlerPayload: static with text", () => {
  assert.deepEqual(buildHandlerPayload("static", { text: "hi" }), {
    handler_type: "static",
    config_json: { text: "hi" },
  });
});

test("buildHandlerPayload: static with missing text coerces to empty string", () => {
  const result = buildHandlerPayload("static", {});
  assert.deepEqual(result, { handler_type: "static", config_json: { text: "" } });
});

test("buildHandlerPayload: stateless with model and prompt", () => {
  assert.deepEqual(buildHandlerPayload("stateless", { model: "ollama/llama3", prompt: "p" }), {
    handler_type: "stateless",
    config_json: { model: "ollama/llama3", prompt: "p" },
  });
});

test("buildHandlerPayload: stateless with no model key omits model", () => {
  const result = buildHandlerPayload("stateless", { prompt: "p" });
  assert.deepEqual(result, { handler_type: "stateless", config_json: { prompt: "p" } });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "model"),
    "model key must be absent",
  );
});

test("buildHandlerPayload: stateless with empty string model omits model", () => {
  const result = buildHandlerPayload("stateless", { model: "", prompt: "p" });
  assert.deepEqual(result, { handler_type: "stateless", config_json: { prompt: "p" } });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "model"),
    "model key must be absent",
  );
});

test("buildHandlerPayload: unknown type throws", () => {
  assert.throws(() => buildHandlerPayload("bogus", {}), /unknown handler type: bogus/);
});

// ---- parseHandlerConfig ----

test("parseHandlerConfig: null input returns sensible default", () => {
  assert.deepEqual(parseHandlerConfig(null), { handlerType: "static", config: {} });
});

test("parseHandlerConfig: undefined input returns sensible default", () => {
  assert.deepEqual(parseHandlerConfig(undefined), { handlerType: "static", config: {} });
});

test("parseHandlerConfig: static row with JSON string config_json", () => {
  assert.deepEqual(parseHandlerConfig({ handler_type: "static", config_json: '{"text":"hi"}' }), {
    handlerType: "static",
    config: { text: "hi" },
  });
});

test("parseHandlerConfig: stateless row with JSON string config_json", () => {
  assert.deepEqual(
    parseHandlerConfig({ handler_type: "stateless", config_json: '{"model":"m","prompt":"p"}' }),
    { handlerType: "stateless", config: { model: "m", prompt: "p" } },
  );
});

test("parseHandlerConfig: invalid JSON config_json returns empty config without throwing", () => {
  const result = parseHandlerConfig({ handler_type: "static", config_json: "not json" });
  assert.equal(result.handlerType, "static");
  assert.deepEqual(result.config, {});
});

test("parseHandlerConfig: config_json already an object is used as-is", () => {
  assert.deepEqual(
    parseHandlerConfig({ handler_type: "stateless", config_json: { already: "object" } }),
    { handlerType: "stateless", config: { already: "object" } },
  );
});

test("parseHandlerConfig: null config_json yields empty config", () => {
  const result = parseHandlerConfig({ handler_type: "static", config_json: null });
  assert.equal(result.handlerType, "static");
  assert.deepEqual(result.config, {});
});

// ---- defaultHandlerLabel ----

test("defaultHandlerLabel: 'static' returns 'Static Reply (I1)'", () => {
  assert.equal(defaultHandlerLabel("static"), "Static Reply (I1)");
});

test("defaultHandlerLabel: 'stateless' returns 'Stateless AI (I2)'", () => {
  assert.equal(defaultHandlerLabel("stateless"), "Stateless AI (I2)");
});

test("defaultHandlerLabel: 'none' returns 'None'", () => {
  assert.equal(defaultHandlerLabel("none"), "None");
});

test("defaultHandlerLabel: null returns 'None'", () => {
  assert.equal(defaultHandlerLabel(null), "None");
});

test("defaultHandlerLabel: undefined returns 'None'", () => {
  assert.equal(defaultHandlerLabel(undefined), "None");
});

test("defaultHandlerLabel: unknown string returns 'None'", () => {
  assert.equal(defaultHandlerLabel("bogus"), "None");
});

// ---- parseDefaultsConfig ----

test("parseDefaultsConfig: null row returns { handlerType: 'none', config: {} }", () => {
  assert.deepEqual(parseDefaultsConfig(null), { handlerType: "none", config: {} });
});

test("parseDefaultsConfig: undefined row returns { handlerType: 'none', config: {} }", () => {
  assert.deepEqual(parseDefaultsConfig(undefined), { handlerType: "none", config: {} });
});

test("parseDefaultsConfig: row with config_json as JSON string parses it", () => {
  const row = { handler_type: "static", config_json: '{"text":"hi","model":"m"}' };
  assert.deepEqual(parseDefaultsConfig(row), {
    handlerType: "static",
    config: { text: "hi", model: "m" },
  });
});

test("parseDefaultsConfig: row with config_json already an object uses it as-is", () => {
  const row = { handler_type: "stateless", config_json: { prompt: "p", model: "m" } };
  assert.deepEqual(parseDefaultsConfig(row), {
    handlerType: "stateless",
    config: { prompt: "p", model: "m" },
  });
});

test("parseDefaultsConfig: invalid JSON config_json yields empty config without throwing", () => {
  const row = { handler_type: "static", config_json: "not-json{{" };
  const result = parseDefaultsConfig(row);
  assert.equal(result.handlerType, "static");
  assert.deepEqual(result.config, {});
});

test("parseDefaultsConfig: null config_json yields empty config", () => {
  const row = { handler_type: "none", config_json: null };
  const result = parseDefaultsConfig(row);
  assert.equal(result.handlerType, "none");
  assert.deepEqual(result.config, {});
});

test("parseDefaultsConfig: missing handler_type falls back to 'none'", () => {
  const row = { config_json: '{"model":"m"}' };
  const result = parseDefaultsConfig(row);
  assert.equal(result.handlerType, "none");
  assert.deepEqual(result.config, { model: "m" });
});

// ---- buildDefaultsPayload ----

test("buildDefaultsPayload: type 'none' with no optional fields returns empty config_json", () => {
  const result = buildDefaultsPayload("none", {});
  assert.deepEqual(result, { handler_type: "none", config_json: {} });
});

test("buildDefaultsPayload: type 'static' with text included", () => {
  const result = buildDefaultsPayload("static", { text: "Hi there" });
  assert.deepEqual(result, { handler_type: "static", config_json: { text: "Hi there" } });
});

test("buildDefaultsPayload: type 'stateless' with prompt included", () => {
  const result = buildDefaultsPayload("stateless", { prompt: "You are a bot." });
  assert.deepEqual(result, {
    handler_type: "stateless",
    config_json: { prompt: "You are a bot." },
  });
});

test("buildDefaultsPayload: model included for all types when non-empty", () => {
  const result = buildDefaultsPayload("none", { model: "ollama/kimi" });
  assert.deepEqual(result, { handler_type: "none", config_json: { model: "ollama/kimi" } });
});

test("buildDefaultsPayload: ownerPhone included when non-empty", () => {
  const result = buildDefaultsPayload("none", { ownerPhone: "+97250111" });
  assert.deepEqual(result, { handler_type: "none", config_json: { owner_phone: "+97250111" } });
});

test("buildDefaultsPayload: empty model and ownerPhone omitted from config_json", () => {
  const result = buildDefaultsPayload("static", { model: "", ownerPhone: "", text: "hi" });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "model"),
    "model must be absent",
  );
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "owner_phone"),
    "owner_phone must be absent",
  );
  assert.equal(result.config_json.text, "hi");
});

test("buildDefaultsPayload: static type ignores prompt field", () => {
  const result = buildDefaultsPayload("static", { text: "hi", prompt: "ignored" });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "prompt"),
    "prompt must be absent for static",
  );
});

test("buildDefaultsPayload: stateless type ignores text field", () => {
  const result = buildDefaultsPayload("stateless", { text: "ignored", prompt: "p" });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "text"),
    "text must be absent for stateless",
  );
});

test("buildDefaultsPayload: static with empty text omits text from config_json", () => {
  const result = buildDefaultsPayload("static", { text: "" });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "text"),
    "empty text must be omitted",
  );
});

test("buildDefaultsPayload: stateless with empty prompt omits prompt from config_json", () => {
  const result = buildDefaultsPayload("stateless", { prompt: "" });
  assert.ok(
    !Object.prototype.hasOwnProperty.call(result.config_json, "prompt"),
    "empty prompt must be omitted",
  );
});

test("buildDefaultsPayload: unknown type throws", () => {
  assert.throws(() => buildDefaultsPayload("bogus", {}), /unknown handler type: bogus/);
});

// ---- HANDLER_FLOW_CHARTS ----

test("HANDLER_FLOW_CHARTS: has exactly 2 groups", () => {
  assert.equal(HANDLER_FLOW_CHARTS.length, 2);
});

test("HANDLER_FLOW_CHARTS: group names are 'Instant Handlers' and 'Scheduled Handlers'", () => {
  assert.equal(HANDLER_FLOW_CHARTS[0].group, "Instant Handlers");
  assert.equal(HANDLER_FLOW_CHARTS[1].group, "Scheduled Handlers");
});

test("HANDLER_FLOW_CHARTS: exactly 8 handlers total across both groups", () => {
  const total = HANDLER_FLOW_CHARTS.reduce((sum, g) => sum + g.handlers.length, 0);
  assert.equal(total, 8);
});

test("HANDLER_FLOW_CHARTS: handler ids in order are I1, I2, I3, I4, S1a, S1b, S1c, S2", () => {
  const ids = HANDLER_FLOW_CHARTS.flatMap((g) => g.handlers.map((h) => h.id));
  assert.deepEqual(ids, ["I1", "I2", "I3", "I4", "S1a", "S1b", "S1c", "S2"]);
});

test("HANDLER_FLOW_CHARTS: every handler has non-empty id, name, and flow strings", () => {
  for (const group of HANDLER_FLOW_CHARTS) {
    for (const handler of group.handlers) {
      assert.ok(
        typeof handler.id === "string" && handler.id.length > 0,
        `handler.id must be non-empty (got: ${handler.id})`,
      );
      assert.ok(
        typeof handler.name === "string" && handler.name.length > 0,
        `handler.name must be non-empty for id=${handler.id}`,
      );
      assert.ok(
        typeof handler.flow === "string" && handler.flow.length > 0,
        `handler.flow must be non-empty for id=${handler.id}`,
      );
    }
  }
});
