// Pure, browser-safe helpers. No DOM access — also imported by Node tests.

/** @type {Record<string, string>} */
const TAXONOMY_LABELS = {
  I1: "Static Reply (I1)",
  I2: "Stateless AI (I2)",
  I3: "Thin Agent (I3)",
  I4: "Full Agent (I4)",
  S1a: "Stupid Cron (S1a)",
  S1b: "Smart Cron (S1b)",
  S1c: "Agent Cron (S1c)",
  S2: "Heartbeat (S2)",
};

/**
 * Filter chats by a search query against displayName and jid.
 * @param {Array<{jid:string, displayName:string}>} chats
 * @param {string} query
 */
export function filterChats(chats, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) {
    return chats;
  }
  return chats.filter(
    (c) => c.displayName.toLowerCase().includes(q) || c.jid.toLowerCase().includes(q),
  );
}

/**
 * Format a timestamp as "YYYY-MM-DD HH:MM" (UTC).
 * Accepts unix-seconds (number) OR an ISO/datetime string (from SQLite TEXT columns).
 * Returns "" for falsy input.
 * @param {number|string} ts
 */
export function formatTimestamp(ts) {
  if (!ts) {
    return "";
  }
  if (typeof ts === "string") {
    const d = new Date(ts.includes("T") ? ts : ts + "Z");
    return isNaN(d.getTime()) ? ts : d.toISOString().replace("T", " ").slice(0, 16);
  }
  return new Date(ts * 1000).toISOString().replace("T", " ").slice(0, 16);
}

/**
 * CSS class for a message line based on its direction.
 * @param {{fromMe:boolean}} msg
 */
export function messageLineClass(msg) {
  return msg.fromMe ? "msg msg-out" : "msg msg-in";
}

/**
 * Return the human-readable label for a taxonomy id.
 * Unknown ids are returned as-is; falsy input returns "-".
 * @param {string} id
 */
export function taxonomyLabel(id) {
  if (!id) {
    return "-";
  }
  return TAXONOMY_LABELS[id] || id;
}

/**
 * Truncate text to at most `max` characters. Null/undefined become "".
 * Uses ASCII "..." (three dots), never a Unicode ellipsis.
 * @param {string|null|undefined} text
 * @param {number} max
 */
function excerpt(text, max) {
  const s = text == null ? "" : String(text);
  if (s.length > max) {
    return s.slice(0, max) + "...";
  }
  return s;
}

/**
 * Build the POST body object for creating or updating a custom handler.
 * @param {"static"|"stateless"} handlerType
 * @param {{ text?: string, model?: string, prompt?: string }} values
 * @returns {{ handler_type: string, config_json: object }}
 */
export function buildHandlerPayload(handlerType, values) {
  if (handlerType === "static") {
    return {
      handler_type: "static",
      config_json: { text: String(values.text ?? "") },
    };
  }
  if (handlerType === "stateless") {
    /** @type {{ prompt: string, model?: string }} */
    const config_json = { prompt: String(values.prompt ?? "") };
    if (values.model) {
      config_json.model = values.model;
    }
    return { handler_type: "stateless", config_json };
  }
  throw new Error("unknown handler type: " + handlerType);
}

/**
 * Parse a raw GET /api/claw/handler row into pre-fill values for the editor.
 * @param {object|null|undefined} clawRow
 * @returns {{ handlerType: string, config: object }}
 */
export function parseHandlerConfig(clawRow) {
  if (clawRow == null) {
    return { handlerType: "static", config: {} };
  }
  const handlerType = clawRow.handler_type || "static";
  const raw = clawRow.config_json;
  let config = {};
  if (raw != null) {
    if (typeof raw === "object") {
      config = raw;
    } else {
      try {
        config = JSON.parse(raw);
      } catch {
        config = {};
      }
    }
  }
  return { handlerType, config };
}

/**
 * Human label for a wa_claw_defaults handler_type.
 * none -> "None"; static -> "Static Reply (I1)"; stateless -> "Stateless AI (I2)".
 * Unknown/falsy -> "None".
 * @param {string|null|undefined} type
 * @returns {string}
 */
export function defaultHandlerLabel(type) {
  if (type === "static") {
    return "Static Reply (I1)";
  }
  if (type === "stateless") {
    return "Stateless AI (I2)";
  }
  return "None";
}

/**
 * Parse a raw GET /api/claw/defaults row into { handlerType, config } for the editor.
 * Null row -> { handlerType: "none", config: {} }.
 * config_json may be a JSON string or already an object; bad JSON -> {}.
 * @param {object|null|undefined} row
 * @returns {{ handlerType: string, config: object }}
 */
export function parseDefaultsConfig(row) {
  if (row == null) {
    return { handlerType: "none", config: {} };
  }
  const handlerType = row.handler_type || "none";
  const raw = row.config_json;
  let config = {};
  if (raw != null) {
    if (typeof raw === "object") {
      config = raw;
    } else {
      try {
        config = JSON.parse(raw);
      } catch {
        config = {};
      }
    }
  }
  return { handlerType, config };
}

/**
 * Build the POST body for /api/claw/defaults.
 * @param {"none"|"static"|"stateless"} handlerType
 * @param {{ model?:string, ownerPhone?:string, text?:string, prompt?:string }} values
 * @returns {{ handler_type: string, config_json: object }}
 * Include only non-empty fields in config_json.
 * Throw on unknown handlerType.
 */
export function buildDefaultsPayload(handlerType, values) {
  if (handlerType !== "none" && handlerType !== "static" && handlerType !== "stateless") {
    throw new Error("unknown handler type: " + handlerType);
  }
  /** @type {object} */
  const config = {};
  const model = values.model;
  const ownerPhone = values.ownerPhone;
  const text = values.text;
  const prompt = values.prompt;
  if (model) {
    config.model = model;
  }
  if (ownerPhone) {
    config.owner_phone = ownerPhone;
  }
  if (handlerType === "static" && text) {
    config.text = text;
  }
  if (handlerType === "stateless" && prompt) {
    config.prompt = prompt;
  }
  return { handler_type: handlerType, config_json: config };
}

// Handler-path flow charts for the Tutorial page (spec §9.4).
// Each handler's `flow` is a single string; the UI splits it on " → " into boxes.
export const HANDLER_FLOW_CHARTS = [
  {
    group: "Instant Handlers",
    handlers: [
      { id: "I1", name: "Static Reply", flow: "Message in → DB lookup → static text → send reply" },
      {
        id: "I2",
        name: "Stateless AI",
        flow: "Message in → DB lookup → Ollama agent turn (with tools) → reply / NO_REPLY / escalate+NO_REPLY",
      },
      {
        id: "I3",
        name: "OC Thin Agent",
        flow: "Message in → OC binding → thin agent (IDENTITY.md only) → reply / NO_REPLY",
      },
      {
        id: "I4",
        name: "OC Full Agent",
        flow: "Message in → OC binding → full agent (all bootstrap) → reply / NO_REPLY",
      },
    ],
  },
  {
    group: "Scheduled Handlers",
    handlers: [
      { id: "S1a", name: "Stupid Cron", flow: "Timer → lightContext:true → isolated → zero files" },
      {
        id: "S1b",
        name: "Smart Cron",
        flow: "Timer → lightContext:false → isolated → full bootstrap",
      },
      { id: "S1c", name: "Agent Cron", flow: "Timer → systemEvent → full agent session + history" },
      { id: "S2", name: "Heartbeat", flow: "Heartbeat timer → HEARTBEAT.md tasks → agent session" },
    ],
  },
];

/**
 * Convert a /api/oc/handler response into an array of section descriptors.
 * Each descriptor: { title, taxonomy, source, readOnly, rows: Array<[label, value]> }
 * @param {object|null} ocData
 * @returns {Array<{title:string, taxonomy:string, source:string, readOnly:boolean, rows:Array<[string,string]>}>}
 */
export function buildHandlerSections(ocData) {
  if (!ocData || !Array.isArray(ocData.handlers)) {
    return [];
  }
  const sections = [];
  for (const h of ocData.handlers) {
    if (h.source === "custom" || h.source === "defaults") {
      const rows = [];
      rows.push(["Type", taxonomyLabel(h.taxonomy)]);
      if (h.taxonomy === "I1") {
        rows.push(["Model", "(none -- static)"]);
        rows.push([
          "Text",
          h.config && h.config.text != null ? excerpt(h.config.text, 200) : "(empty)",
        ]);
      } else {
        rows.push(["Model", (h.config && h.config.model) || "(default)"]);
        rows.push(["Prompt", excerpt(h.config && h.config.prompt, 200)]);
      }
      sections.push({
        title: "Instant Handler",
        taxonomy: h.taxonomy,
        source: h.source === "custom" ? "WA Claw (custom handler)" : "WA Claw (default)",
        readOnly: false,
        rows,
      });
    } else if (h.source === "binding") {
      const rows = [];
      rows.push(["Type", taxonomyLabel(h.taxonomy)]);
      rows.push(["Agent", h.agentName || h.agentId || "(unknown)"]);
      rows.push(["Model", h.model || "(inherits default)"]);
      if (h.systemPromptOverride) {
        rows.push(["System prompt", excerpt(h.systemPromptOverride, 200)]);
      } else {
        rows.push(["System prompt", "(full agent -- all bootstrap)"]);
      }
      rows.push(["Session", h.sessionScope || "(default)"]);
      if (h.channelWide) {
        rows.push(["Scope", "channel-wide"]);
      }
      sections.push({
        title: "OC Binding",
        taxonomy: h.taxonomy,
        source: "OC config (read-only)",
        readOnly: true,
        rows,
      });
    } else if (h.source === "heartbeat") {
      const rows = [];
      rows.push(["Type", taxonomyLabel(h.taxonomy)]);
      rows.push(["Agent", h.agentName || h.agentId || "(unknown)"]);
      rows.push(["Every", h.every || "(unknown)"]);
      if (h.to) {
        rows.push(["Target", h.to]);
      }
      sections.push({
        title: "Scheduled",
        taxonomy: h.taxonomy,
        source: "OC heartbeat (read-only)",
        readOnly: true,
        rows,
      });
    } else if (h.source === "cron") {
      const rows = [];
      rows.push(["Type", taxonomyLabel(h.taxonomy)]);
      rows.push(["Cron", h.name || h.cronId || "(unnamed)"]);
      if (h.schedule) {
        rows.push([
          "Schedule",
          typeof h.schedule === "string" ? h.schedule : JSON.stringify(h.schedule),
        ]);
      }
      rows.push(["Agent", h.agentId || "(default)"]);
      rows.push(["Session", h.sessionTarget || "(default)"]);
      if (h.payloadPreview) {
        rows.push(["Payload", excerpt(h.payloadPreview, 200)]);
      }
      sections.push({
        title: "Scheduled",
        taxonomy: h.taxonomy,
        source: "OC cron (read-only)",
        readOnly: true,
        rows,
      });
    }
    // Any other source: skip it.
  }
  return sections;
}
