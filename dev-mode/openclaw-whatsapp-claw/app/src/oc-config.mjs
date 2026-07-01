import { execFileSync } from "node:child_process";
import { CronSubType, CustomHandlerType, DefaultHandlerType, HandlerTaxonomyId } from "./enums.mjs";

/** Cache TTL in milliseconds. */
const CACHE_TTL_MS = 30_000;

/** In-memory result cache: key → { value, expires }. */
const cache = new Map();

/**
 * Default CLI runner. Executes `openclaw` (or any file) with the given args
 * and returns stdout as a string. Throws on non-zero exit or ENOENT.
 * @param {string} file
 * @param {string[]} args
 * @returns {string}
 */
const defaultRunner = (file, args) =>
  execFileSync(file, args, { encoding: "utf8", timeout: 10_000 });

/** Active runner — replaced by setExecRunner() in tests. */
let runner = defaultRunner;

/**
 * Override the CLI runner used by ocConfigGet / ocCronList.
 * fn signature: (file: string, args: string[]) => string (returns stdout, throws to simulate failure).
 * @param {(file: string, args: string[]) => string} fn
 */
export function setExecRunner(fn) {
  runner = fn;
}

/** Restore the default execFileSync-based runner. */
export function resetExecRunner() {
  runner = defaultRunner;
}

/** Empty the internal result cache (used by tests). */
export function clearCache() {
  cache.clear();
}

/**
 * Read a cached entry. Returns the stored value if present and not expired,
 * otherwise returns the sentinel `MISS` symbol.
 * @param {string} key
 * @returns {unknown}
 */
const MISS = Symbol("MISS");

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) {
    return MISS;
  }
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return MISS;
  }
  return entry.value;
}

/**
 * Store a value in the cache with the standard TTL.
 * @param {string} key
 * @param {unknown} value
 */
function cacheSet(key, value) {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
}

/**
 * Run `openclaw config get <path> --json`, parse the result as JSON, and
 * return the parsed value. Results are cached for 30 seconds per path key.
 * On any error (command not found, non-zero exit, empty stdout, JSON parse
 * failure) returns `null` without caching so the next call can retry.
 * @param {string} path  Dot-notation config path, e.g. `"agents.list"`.
 * @returns {unknown}
 */
export function ocConfigGet(path) {
  const key = `config:${path}`;
  const cached = cacheGet(key);
  if (cached !== MISS) {
    return cached;
  }
  try {
    const stdout = runner("openclaw", ["config", "get", path, "--json"]);
    if (!stdout || !stdout.trim()) {
      return null;
    }
    const value = JSON.parse(stdout);
    cacheSet(key, value);
    return value;
  } catch {
    return null;
  }
}

/**
 * Run `openclaw cron list --json`, parse the result as JSON, and return the
 * cron job array. Results are cached for 30 seconds. On any error returns `[]`
 * without caching. If the parsed value is a wrapping object (e.g.
 * `{ crons: [...] }` or `{ jobs: [...] }`), unwraps the inner array.
 * @returns {unknown[]}
 */
export function ocCronList() {
  const key = "cron:list";
  const cached = cacheGet(key);
  if (cached !== MISS) {
    return /** @type {unknown[]} */ (cached);
  }
  try {
    const stdout = runner("openclaw", ["cron", "list", "--json"]);
    if (!stdout || !stdout.trim()) {
      return [];
    }
    const parsed = JSON.parse(stdout);
    let value;
    if (Array.isArray(parsed)) {
      value = parsed;
    } else if (parsed && typeof parsed === "object") {
      // Unwrap known wrapper shapes: { crons: [...] } or { jobs: [...] }.
      if (Array.isArray(parsed.crons)) {
        value = parsed.crons;
      } else if (Array.isArray(parsed.jobs)) {
        value = parsed.jobs;
      } else {
        value = [];
      }
    } else {
      value = [];
    }
    cacheSet(key, value);
    return value;
  } catch {
    return [];
  }
}

/**
 * Run `openclaw models list --json`, parse the result, and return available models.
 * Results are cached for 30 seconds. On error returns empty defaults.
 * @returns {{ defaultModel: string|null, available: Array<{id: string, tags: string[], available: boolean}> }}
 */
export function ocModelsList() {
  const key = "models:list";
  const cached = cacheGet(key);
  if (cached !== MISS) {
    return /** @type {{ defaultModel: string|null, available: Array<{id: string, tags: string[], available: boolean}> }} */ (
      cached
    );
  }
  try {
    const stdout = runner("openclaw", ["models", "list", "--json"]);
    if (!stdout || !stdout.trim()) {
      return { defaultModel: null, available: [] };
    }
    const parsed = JSON.parse(stdout);
    const models = Array.isArray(parsed) ? parsed : [];
    const defaultEntry = models.find((m) => Array.isArray(m.tags) && m.tags.includes("default"));
    const result = {
      defaultModel: defaultEntry ? defaultEntry.id : null,
      available: models.map((m) => ({
        id: String(m.id ?? ""),
        tags: Array.isArray(m.tags) ? m.tags : [],
        available: m.available === true,
      })),
    };
    cacheSet(key, result);
    return result;
  } catch {
    return { defaultModel: null, available: [] };
  }
}

/**
 * Convert a phone number or WhatsApp JID into a canonical JID string.
 * - Falsy / empty → `null`.
 * - Already a JID (contains `@`): strip any device suffix like `:12` that
 *   appears immediately before the `@`. Group (`@g.us`) and `@lid` pass through.
 * - Bare phone number: strip every non-digit character, then return
 *   `<digits>@s.whatsapp.net`. Returns `null` if no digits remain.
 * @param {string|null|undefined} input
 * @returns {string|null}
 */
export function normalizeJid(input) {
  if (!input) {
    return null;
  }
  const s = String(input).trim();
  if (!s) {
    return null;
  }
  if (s.includes("@")) {
    // Strip optional device-suffix `:NN` right before the `@`.
    return s.replace(/:\d+(?=@)/, "");
  }
  const digits = s.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  return `${digits}@s.whatsapp.net`;
}

/**
 * Convert a WhatsApp JID (or bare phone) to an E.164 phone string.
 * - Falsy → `null`.
 * - DM JID ending with `@s.whatsapp.net`: strip the suffix and any trailing
 *   `:NN` device part, strip non-digits, return `+<digits>` or `null`.
 * - Bare phone matching `/^\+?\d+$/` → `+<digits>`.
 * - Group (`@g.us`), `@lid`, or anything else → `null`.
 * @param {string|null|undefined} jid
 * @returns {string|null}
 */
export function jidToPhone(jid) {
  if (!jid) {
    return null;
  }
  const s = String(jid).trim();
  if (s.endsWith("@s.whatsapp.net")) {
    const local = s.slice(0, -"@s.whatsapp.net".length).replace(/:\d+$/, "");
    const digits = local.replace(/\D/g, "");
    return digits ? `+${digits}` : null;
  }
  if (/^\+?\d+$/.test(s)) {
    const digits = s.replace(/\D/g, "");
    return digits ? `+${digits}` : null;
  }
  return null;
}

/**
 * Internal map from CronSubType → HandlerTaxonomyId.
 * Used by classifyCron callers that need the taxonomy id.
 */
const CRON_SUBTYPE_TO_TAXONOMY = Object.freeze({
  [CronSubType.Stupid]: HandlerTaxonomyId.S1a,
  [CronSubType.Smart]: HandlerTaxonomyId.S1b,
  [CronSubType.Agent]: HandlerTaxonomyId.S1c,
});

/**
 * Classify an OpenClaw cron job into one of three sub-types (spec §3.1).
 *
 * Rules:
 *  - `payload.kind === "systemEvent"` → `CronSubType.Agent` (S1c)
 *  - `payload.kind === "agentTurn"` (or missing/other) AND `payload.lightContext === true` → `CronSubType.Stupid` (S1a)
 *  - `payload.kind === "agentTurn"` (or missing/other) AND lightContext not strictly true → `CronSubType.Smart` (S1b)
 *
 * @param {Record<string, unknown>} cronJob  A cron job object from ocCronList().
 * @returns {string}  One of the CronSubType values.
 */
export function classifyCron(cronJob) {
  const payload = cronJob?.payload ?? {};
  if (payload.kind === "systemEvent") {
    return CronSubType.Agent;
  }
  if (payload.lightContext === true) {
    return CronSubType.Stupid;
  }
  return CronSubType.Smart;
}

/**
 * Return the WA-Claw default behavior row merged with OpenClaw's agent defaults (spec §5).
 *
 * @param {object|null|undefined} store  wa-store instance with a `getDefaults()` method.
 * @returns {{ waClaw: object|null, oc: unknown }}
 */
export function getDefaults(store) {
  const row = store?.getDefaults?.() ?? null;
  let parsedConfig = {};
  if (row) {
    try {
      parsedConfig = JSON.parse(row.config_json);
    } catch {
      parsedConfig = {};
    }
  }
  const ocDefaults = ocConfigGet("agents.defaults");
  return {
    waClaw: row
      ? {
          handler_type: row.handler_type,
          config: parsedConfig,
          enabled: row.enabled,
          updated_at: row.updated_at,
        }
      : null,
    oc: ocDefaults ?? null,
  };
}

/**
 * Reverse-map a WhatsApp JID to all handlers that cover it (spec §8.1).
 *
 * Checks custom handlers, OC bindings, cron jobs, and heartbeats — collecting ALL
 * matches (spec §8.2). The defaults row is used ONLY as a final fallback when no
 * specific handler matched in steps 1-4.
 *
 * @param {string} jid  Phone number, bare JID, or canonical JID.
 * @param {object|null|undefined} store  wa-store instance with `getHandler(jid)` and `getDefaults()`.
 * @returns {{ jid: string|null, phone: string|null, handlers: object[], taxonomy: string[], usingDefaults: boolean }}
 */
export function getHandlerForJid(jid, store) {
  const canonical = normalizeJid(jid);
  const phone = jidToPhone(jid);
  const handlers = [];

  /**
   * Returns true if `target` (any of E.164 / bare digits / JID) refers to this chat.
   * @param {string|null|undefined} target
   * @returns {boolean}
   */
  const sameTarget = (target) => {
    if (!target || !canonical) {
      return false;
    }
    return normalizeJid(target) === canonical;
  };

  // ── Step 1: custom handler via wa_claw_handlers ─────────────────────────
  const custom = store?.getHandler?.(canonical ?? jid);
  if (custom && custom.enabled !== 0) {
    let config = {};
    try {
      config = JSON.parse(custom.config_json);
    } catch {
      config = {};
    }
    let taxonomy = null;
    if (custom.handler_type === CustomHandlerType.Static) {
      taxonomy = HandlerTaxonomyId.I1;
    } else if (custom.handler_type === CustomHandlerType.Stateless) {
      taxonomy = HandlerTaxonomyId.I2;
    }
    handlers.push({
      source: "custom",
      taxonomy,
      writable: true,
      handlerType: custom.handler_type,
      config,
      record: custom,
    });
  }

  // ── Step 2: OC bindings ──────────────────────────────────────────────────
  const bindings = ocConfigGet("bindings");
  if (Array.isArray(bindings)) {
    const agentsList = ocConfigGet("agents.list");
    const ocDefaults = ocConfigGet("agents.defaults");
    for (const binding of bindings) {
      if (binding?.match?.channel !== "whatsapp") {
        continue;
      }
      const hasPeer = binding.match?.peer?.id != null;
      const peerMatches = hasPeer && sameTarget(binding.match.peer.id);
      const channelWide = !hasPeer;
      if (!peerMatches && !channelWide) {
        continue;
      }
      // Find the agent entry for this binding.
      const agent = Array.isArray(agentsList)
        ? (agentsList.find((a) => a?.id === binding.agentId) ?? null)
        : null;
      // Resolve systemPromptOverride: agent's own, then fallback to defaults.
      const agentOverride = agent?.systemPromptOverride ?? null;
      const defaultsOverride = ocDefaults?.systemPromptOverride ?? null;
      const rawOverride = agentOverride != null ? agentOverride : defaultsOverride;
      const resolvedOverride =
        typeof rawOverride === "string" && rawOverride.trim().length > 0 ? rawOverride : null;
      const taxonomy = resolvedOverride ? HandlerTaxonomyId.I3 : HandlerTaxonomyId.I4;
      handlers.push({
        source: "binding",
        taxonomy,
        writable: false,
        channelWide,
        agentId: binding.agentId ?? null,
        agentName: agent?.name ?? null,
        model: agent?.model ?? null,
        systemPromptOverride: resolvedOverride,
        sessionScope: binding.session?.dmScope ?? null,
        record: binding,
      });
    }
  }

  // ── Step 3: cron jobs ────────────────────────────────────────────────────
  const crons = ocCronList();
  for (const cron of crons) {
    if (!sameTarget(cron?.delivery?.to)) {
      continue;
    }
    const subType = classifyCron(cron);
    const taxonomy = CRON_SUBTYPE_TO_TAXONOMY[subType] ?? null;
    const rawPreview = cron?.payload?.message ?? cron?.payload?.text ?? null;
    const payloadPreview = typeof rawPreview === "string" ? rawPreview.slice(0, 200) : null;
    handlers.push({
      source: "cron",
      taxonomy,
      writable: false,
      subType,
      cronId: cron?.id ?? null,
      name: cron?.name ?? null,
      schedule: cron?.schedule ?? null,
      agentId: cron?.agentId ?? null,
      sessionTarget: cron?.sessionTarget ?? null,
      lightContext: cron?.payload?.lightContext === true,
      payloadKind: cron?.payload?.kind ?? null,
      payloadPreview,
      record: cron,
    });
  }

  // ── Step 4: heartbeats ───────────────────────────────────────────────────
  const agentsForHeartbeat = ocConfigGet("agents.list");
  if (Array.isArray(agentsForHeartbeat)) {
    for (const agent of agentsForHeartbeat) {
      if (!agent?.heartbeat?.to) {
        continue;
      }
      if (!sameTarget(agent.heartbeat.to)) {
        continue;
      }
      handlers.push({
        source: "heartbeat",
        taxonomy: HandlerTaxonomyId.S2,
        writable: false,
        agentId: agent?.id ?? null,
        agentName: agent?.name ?? null,
        every: agent.heartbeat.every ?? null,
        target: agent.heartbeat.target ?? null,
        to: agent.heartbeat.to ?? null,
        lightContext: agent.heartbeat.lightContext === true,
        record: agent.heartbeat,
      });
    }
  }

  // ── Step 5: defaults fallback (only when no specific handler matched) ────
  let usingDefaults = false;
  if (handlers.length === 0) {
    usingDefaults = true;
    const def = store?.getDefaults?.() ?? null;
    if (def && def.handler_type !== DefaultHandlerType.None) {
      let config = {};
      try {
        config = JSON.parse(def.config_json);
      } catch {
        config = {};
      }
      let taxonomy = null;
      if (def.handler_type === DefaultHandlerType.Static) {
        taxonomy = HandlerTaxonomyId.I1;
      } else if (def.handler_type === DefaultHandlerType.Stateless) {
        taxonomy = HandlerTaxonomyId.I2;
      } else if (def.handler_type === DefaultHandlerType.Cron) {
        taxonomy = HandlerTaxonomyId.S1a;
      } else if (def.handler_type === DefaultHandlerType.Heartbeat) {
        taxonomy = HandlerTaxonomyId.S2;
      }
      const writable =
        def.handler_type === DefaultHandlerType.Static ||
        def.handler_type === DefaultHandlerType.Stateless;
      handlers.push({
        source: "defaults",
        taxonomy,
        writable,
        handlerType: def.handler_type,
        config,
        record: def,
      });
    }
  }

  return {
    jid: canonical,
    phone,
    handlers,
    taxonomy: handlers.map((h) => h.taxonomy).filter(Boolean),
    usingDefaults,
  };
}
