//#region extensions/active-memory/types.ts
const DEFAULT_TIMEOUT_MS = 15e3;
const DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS = 45e3;
const DEFAULT_AGENT_ID = "main";
const DEFAULT_MAX_SUMMARY_CHARS = 220;
const DEFAULT_RECENT_USER_TURNS = 2;
const DEFAULT_RECENT_ASSISTANT_TURNS = 1;
const DEFAULT_RECENT_USER_CHARS = 220;
const DEFAULT_RECENT_ASSISTANT_CHARS = 180;
const DEFAULT_CACHE_TTL_MS = 15e3;
const DEFAULT_MAX_CACHE_ENTRIES = 1e3;
const CACHE_SWEEP_INTERVAL_MS = 1e3;
const DEFAULT_MIN_TIMEOUT_MS = 250;
const DEFAULT_SETUP_GRACE_TIMEOUT_MS = 0;
const MAX_TIMEOUT_MS = 12e4;
const MAX_SETUP_GRACE_TIMEOUT_MS = 3e4;
const DEFAULT_QUERY_MODE = "recent";
const DEFAULT_ACTIVE_MEMORY_MODE = "escalate";
const DEFAULT_TRANSCRIPT_DIR = "active-memory";
const ACTIVE_MEMORY_RECALL_LANE = "active-memory";
const ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS = [
	0,
	50,
	250
];
const DEFAULT_CIRCUIT_BREAKER_MAX_TIMEOUTS = 3;
const DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS = 6e4;
const DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW = ["memory_search", "memory_get"];
const LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW = ["memory_recall"];
const MAX_ACTIVE_MEMORY_TOOLS_ALLOW = 32;
const STRUCTURED_MEMORY_FAILURE_STATUSES = /* @__PURE__ */ new Set([
	"error",
	"failed",
	"failure",
	"timeout",
	"timed_out",
	"denied",
	"cancelled",
	"canceled",
	"aborted",
	"killed",
	"invalid",
	"forbidden",
	"unavailable",
	"disabled",
	"blocked"
]);
const STRUCTURED_MEMORY_EMPTY_STATUSES = /* @__PURE__ */ new Set([
	"not_found",
	"empty",
	"no_results",
	"no_matches"
]);
const ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW = /* @__PURE__ */ new Set([
	"*",
	"agents_list",
	"apply_patch",
	"browser",
	"canvas",
	"cron",
	"edit",
	"exec",
	"gateway",
	"heartbeat_respond",
	"heartbeat_response",
	"image",
	"image_generate",
	"message",
	"music_generate",
	"nodes",
	"pdf",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_send",
	"sessions_spawn",
	"sessions_yield",
	"subagents",
	"tts",
	"progress_card",
	"video_generate",
	"web_fetch",
	"web_search",
	"write"
]);
const DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS = 32e3;
const DEFAULT_TRANSCRIPT_READ_MAX_LINES = 2e3;
const DEFAULT_TRANSCRIPT_READ_MAX_BYTES = 52428800;
const TIMEOUT_PARTIAL_DATA_GRACE_MS = 500;
const HOOK_TIMEOUT_RECOVERY_GRACE_MS = 1500;
const TRIGGER_LOOKUP_SETTLE_RESERVE_MS = 50;
const MAX_ACTIVE_MEMORY_SEARCH_QUERY_CHARS = 480;
const TERMINAL_MEMORY_SEARCH_POLL_INTERVAL_MS = 25;
const NO_RECALL_VALUES = /* @__PURE__ */ new Set([
	"",
	"none",
	"no_reply",
	"no reply",
	"nothing useful",
	"no relevant memory",
	"no relevant memories",
	"timeout",
	"timed out",
	"request timed out",
	"llm request timed out",
	"the llm request timed out",
	"[]",
	"{}",
	"null",
	"n/a"
]);
const TIMEOUT_BOILERPLATE_PATTERNS = [/^(?:error:\s*)?(?:the\s+)?(?:llm|model|request|operation|agent)\s+(?:request\s+)?timed out\b/i, /^(?:error:\s*)?active-memory timeout after \d+ms\b/i];
const RECALLED_CONTEXT_LINE_PATTERNS = [
	/^🧩\s*active memory:/i,
	/^🔎\s*active memory debug:/i,
	/^🧠\s*memory search:/i,
	/^memory search:/i,
	/^active memory debug:/i,
	/^active memory:/i
];
const ACTIVE_MEMORY_STATUS_PREFIX = "🧩 Active Memory:";
const ACTIVE_MEMORY_DEBUG_PREFIX = "🔎 Active Memory Debug:";
const ACTIVE_MEMORY_PLUGIN_TAG = "active_memory_plugin";
const ACTIVE_MEMORY_CONTEXT_HEADER = "Context:";
const ACTIVE_MEMORY_OPEN_TAG = `<${ACTIVE_MEMORY_PLUGIN_TAG}>`;
const ACTIVE_MEMORY_CLOSE_TAG = `</${ACTIVE_MEMORY_PLUGIN_TAG}>`;
const MAX_LOG_VALUE_CHARS = 300;
//#endregion
export { DEFAULT_TRANSCRIPT_READ_MAX_BYTES as A, RECALLED_CONTEXT_LINE_PATTERNS as B, DEFAULT_RECENT_ASSISTANT_CHARS as C, DEFAULT_SETUP_GRACE_TIMEOUT_MS as D, DEFAULT_RECENT_USER_TURNS as E, MAX_ACTIVE_MEMORY_TOOLS_ALLOW as F, TIMEOUT_PARTIAL_DATA_GRACE_MS as G, STRUCTURED_MEMORY_FAILURE_STATUSES as H, MAX_LOG_VALUE_CHARS as I, TRIGGER_LOOKUP_SETTLE_RESERVE_MS as K, MAX_SETUP_GRACE_TIMEOUT_MS as L, HOOK_TIMEOUT_RECOVERY_GRACE_MS as M, LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW as N, DEFAULT_TIMEOUT_MS as O, MAX_ACTIVE_MEMORY_SEARCH_QUERY_CHARS as P, MAX_TIMEOUT_MS as R, DEFAULT_QUERY_MODE as S, DEFAULT_RECENT_USER_CHARS as T, TERMINAL_MEMORY_SEARCH_POLL_INTERVAL_MS as U, STRUCTURED_MEMORY_EMPTY_STATUSES as V, TIMEOUT_BOILERPLATE_PATTERNS as W, DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS as _, ACTIVE_MEMORY_OPEN_TAG as a, DEFAULT_MIN_TIMEOUT_MS as b, ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW as c, DEFAULT_ACTIVE_MEMORY_MODE as d, DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW as f, DEFAULT_CIRCUIT_BREAKER_MAX_TIMEOUTS as g, DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS as h, ACTIVE_MEMORY_DEBUG_PREFIX as i, DEFAULT_TRANSCRIPT_READ_MAX_LINES as j, DEFAULT_TRANSCRIPT_DIR as k, ACTIVE_MEMORY_STATUS_PREFIX as l, DEFAULT_CACHE_TTL_MS as m, ACTIVE_MEMORY_CLOSE_TAG as n, ACTIVE_MEMORY_PLUGIN_TAG as o, DEFAULT_AGENT_ID as p, ACTIVE_MEMORY_CONTEXT_HEADER as r, ACTIVE_MEMORY_RECALL_LANE as s, ACTIVE_MEMORY_CLEANUP_RETRY_DELAYS_MS as t, CACHE_SWEEP_INTERVAL_MS as u, DEFAULT_MAX_CACHE_ENTRIES as v, DEFAULT_RECENT_ASSISTANT_TURNS as w, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS as x, DEFAULT_MAX_SUMMARY_CHARS as y, NO_RECALL_VALUES as z };
