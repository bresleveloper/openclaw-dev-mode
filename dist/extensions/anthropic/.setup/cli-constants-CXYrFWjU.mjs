//#region extensions/anthropic/openclaw.plugin.json
var modelIdNormalization = { "providers": { "anthropic": { "aliases": {
	"fable": "claude-fable-5-1",
	"fable-5": "claude-fable-5",
	"fable-5.1": "claude-fable-5-1",
	"fable-5-1": "claude-fable-5-1",
	"haiku": "claude-haiku-5-5",
	"haiku-5.5": "claude-haiku-5-5",
	"haiku-5-5": "claude-haiku-5-5",
	"opus-5.5": "claude-opus-5-5",
	"opus-5-5": "claude-opus-5-5",
	"opus-5": "claude-opus-5",
	"opus": "claude-opus-5-5",
	"opus-4.8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"mythos-5": "claude-mythos-5",
	"sonnet-5.5": "claude-sonnet-5-5",
	"sonnet-5-5": "claude-sonnet-5-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet": "claude-sonnet-5-5",
	"sonnet-4.6": "claude-sonnet-4-6"
} } } };
//#endregion
//#region extensions/anthropic/cli-constants.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Non-secret marker telling OpenClaw that the installed Claude CLI owns auth. */
const CLAUDE_CLI_NATIVE_AUTH_MARKER = ["openclaw", "claude-cli-native-auth"].join(":");
const CLAUDE_CLI_CLEAR_ENV = [
	"ANTHROPIC_API_KEY",
	"ANTHROPIC_API_KEY_OLD",
	"ANTHROPIC_API_TOKEN",
	"ANTHROPIC_AUTH_TOKEN",
	"ANTHROPIC_BASE_URL",
	"ANTHROPIC_CUSTOM_HEADERS",
	"ANTHROPIC_OAUTH_TOKEN",
	"ANTHROPIC_UNIX_SOCKET",
	"CLAUDE_CODE_AUTO_COMPACT_WINDOW",
	"CLAUDE_CODE_DISABLE_1M_CONTEXT",
	"CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING",
	"MAX_THINKING_TOKENS",
	"CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
	"CLAUDE_CODE_ENTRYPOINT",
	"CLAUDE_CODE_OAUTH_REFRESH_TOKEN",
	"CLAUDE_CODE_OAUTH_SCOPES",
	"CLAUDE_CODE_OAUTH_TOKEN",
	"CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
	"CLAUDE_CODE_PLUGIN_CACHE_DIR",
	"CLAUDE_CODE_PLUGIN_SEED_DIR",
	"CLAUDE_CODE_REMOTE",
	"CLAUDE_CODE_USE_COWORK_PLUGINS",
	"CLAUDE_CODE_USE_BEDROCK",
	"CLAUDE_CODE_USE_FOUNDRY",
	"CLAUDE_CODE_USE_VERTEX",
	"OTEL_EXPORTER_OTLP_ENDPOINT",
	"OTEL_EXPORTER_OTLP_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_LOGS_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_METRICS_HEADERS",
	"OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
	"OTEL_EXPORTER_OTLP_PROTOCOL",
	"OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
	"OTEL_EXPORTER_OTLP_TRACES_HEADERS",
	"OTEL_EXPORTER_OTLP_TRACES_PROTOCOL",
	"OTEL_LOGS_EXPORTER",
	"OTEL_METRICS_EXPORTER",
	"OTEL_SDK_DISABLED",
	"OTEL_TRACES_EXPORTER"
];
const CLAUDE_CLI_DEFAULT_MODEL_REF = `${CLAUDE_CLI_BACKEND_ID}/claude-opus-5-5`;
const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID = CLAUDE_CLI_DEFAULT_MODEL_REF.slice(11);
`${CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID}`;
/**
* Claude CLI model ids probed when detecting an existing CLI route, canonical
* default first. Route detection must not depend on which model is currently
* the default: existing configs route older Claude models, so probing only the
* default would stop advertising session creation after a default bump.
*/
const CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS = [.../* @__PURE__ */ new Set([CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID, ...Object.values(modelIdNormalization.providers.anthropic.aliases)])];
/** Provider-owned aliases shared by setup, pricing, and native CLI selectors. */
const CLAUDE_MODEL_ID_ALIASES = new Map(Object.entries(modelIdNormalization.providers.anthropic.aliases));
const CLAUDE_CLI_MODEL_ALIASES = {
	...Object.fromEntries(CLAUDE_MODEL_ID_ALIASES),
	...Object.fromEntries(CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS.map((id) => [id, id])),
	opus: "opus",
	sonnet: "sonnet",
	fable: "fable",
	haiku: "haiku"
};
const CLAUDE_CLI_SESSION_ID_FIELDS = [
	"session_id",
	"sessionId",
	"conversation_id",
	"conversationId"
];
/** Claude Code registers bundled OpenClaw MCP tools under this name prefix. */
const OPENCLAW_MCP_TOOL_PREFIX = "mcp__openclaw__";
//#endregion
export { CLAUDE_CLI_NATIVE_AUTH_MARKER as a, CLAUDE_CLI_MODEL_ALIASES as i, CLAUDE_CLI_CLEAR_ENV as n, CLAUDE_CLI_SESSION_ID_FIELDS as o, CLAUDE_CLI_DEFAULT_MODEL_REF as r, OPENCLAW_MCP_TOOL_PREFIX as s, CLAUDE_CLI_BACKEND_ID as t };
