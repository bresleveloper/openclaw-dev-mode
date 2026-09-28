//#region extensions/anthropic/openclaw.plugin.json
var modelCatalog = {
	"modelsDev": { "anthropic": "anthropic" },
	"providers": {
		"claude-cli": { "models": [
			{
				"id": "claude-opus-5-5",
				"name": "Claude Opus 5.5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"contextWindows": [{
					"id": "200k",
					"label": "200K",
					"contextWindow": 2e5
				}, {
					"id": "1m",
					"label": "1M",
					"contextWindow": 1e6
				}],
				"contextWindowDefault": "1m",
				"maxTokens": 128e3
			},
			{
				"id": "claude-opus-5",
				"name": "Claude Opus 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"contextWindows": [{
					"id": "200k",
					"label": "200K",
					"contextWindow": 2e5
				}, {
					"id": "1m",
					"label": "1M",
					"contextWindow": 1e6
				}],
				"contextWindowDefault": "1m",
				"maxTokens": 128e3
			},
			{
				"id": "claude-sonnet-5",
				"name": "Claude Sonnet 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"contextWindows": [{
					"id": "200k",
					"label": "200K",
					"contextWindow": 2e5
				}, {
					"id": "1m",
					"label": "1M",
					"contextWindow": 1e6
				}],
				"contextWindowDefault": "1m",
				"maxTokens": 128e3
			},
			{
				"id": "claude-fable-5-1",
				"name": "Claude Fable 5.1 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"contextWindows": [{
					"id": "200k",
					"label": "200K",
					"contextWindow": 2e5
				}, {
					"id": "1m",
					"label": "1M",
					"contextWindow": 1e6
				}],
				"contextWindowDefault": "1m",
				"maxTokens": 128e3
			},
			{
				"id": "claude-fable-5",
				"name": "Claude Fable 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"contextWindows": [{
					"id": "200k",
					"label": "200K",
					"contextWindow": 2e5
				}, {
					"id": "1m",
					"label": "1M",
					"contextWindow": 1e6
				}],
				"contextWindowDefault": "1m",
				"maxTokens": 128e3
			},
			{
				"id": "claude-opus-4-8",
				"name": "Claude Opus 4.8 (Claude CLI)",
				"status": "deprecated",
				"replacedBy": "claude-opus-5",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 2e5,
				"maxTokens": 128e3
			},
			{
				"id": "claude-opus-4-7",
				"name": "Claude Opus 4.7 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 2e5,
				"maxTokens": 128e3
			},
			{
				"id": "claude-sonnet-4-6",
				"name": "Claude Sonnet 4.6 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 1568,
					"preferredSidePx": 1568,
					"tokenMode": "provider"
				} },
				"contextWindow": 2e5,
				"maxTokens": 128e3
			},
			{
				"id": "claude-opus-4-6",
				"name": "Claude Opus 4.6 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 1568,
					"preferredSidePx": 1568,
					"tokenMode": "provider"
				} },
				"contextWindow": 2e5,
				"maxTokens": 128e3
			}
		] },
		"anthropic": {
			"baseUrl": "https://api.anthropic.com",
			"api": "anthropic-messages",
			"defaultUtilityModel": "claude-haiku-4-5",
			"models": [
				{
					"id": "claude-opus-5-5",
					"name": "Claude Opus 5.5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 4,
						"output": 20,
						"cacheRead": .2,
						"cacheWrite": 5
					},
					"contextWindow": 1e6,
					"contextWindows": [{
						"id": "200k",
						"label": "200K",
						"contextWindow": 2e5
					}, {
						"id": "1m",
						"label": "1M",
						"contextWindow": 1e6
					}],
					"contextWindowDefault": "1m",
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-fable-5-1",
					"name": "Claude Fable 5.1",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 10,
						"output": 50,
						"cacheRead": .25,
						"cacheWrite": 12.5
					},
					"contextWindow": 1e6,
					"contextWindows": [{
						"id": "200k",
						"label": "200K",
						"contextWindow": 2e5
					}, {
						"id": "1m",
						"label": "1M",
						"contextWindow": 1e6
					}],
					"contextWindowDefault": "1m",
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-fable-5",
					"name": "Claude Fable 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					},
					"contextWindow": 1e6,
					"contextWindows": [{
						"id": "200k",
						"label": "200K",
						"contextWindow": 2e5
					}, {
						"id": "1m",
						"label": "1M",
						"contextWindow": 1e6
					}],
					"contextWindowDefault": "1m",
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-opus-5",
					"name": "Claude Opus 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 5,
						"output": 25,
						"cacheRead": .5,
						"cacheWrite": 6.25
					},
					"contextWindow": 1e6,
					"contextWindows": [{
						"id": "200k",
						"label": "200K",
						"contextWindow": 2e5
					}, {
						"id": "1m",
						"label": "1M",
						"contextWindow": 1e6
					}],
					"contextWindowDefault": "1m",
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-sonnet-5",
					"name": "Claude Sonnet 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 2.5
					},
					"contextWindow": 1e6,
					"contextWindows": [{
						"id": "200k",
						"label": "200K",
						"contextWindow": 2e5
					}, {
						"id": "1m",
						"label": "1M",
						"contextWindow": 1e6
					}],
					"contextWindowDefault": "1m",
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-mythos-5",
					"name": "Claude Mythos 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-opus-4-8",
					"name": "Claude Opus 4.8",
					"status": "deprecated",
					"replacedBy": "claude-opus-5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-haiku-4-5",
					"name": "Claude Haiku 4.5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 1568,
						"preferredSidePx": 1568,
						"tokenMode": "provider"
					} },
					"contextWindow": 2e5,
					"maxTokens": 64e3,
					"compat": { "codeMode": "capable" }
				}
			]
		}
	},
	"discovery": {
		"claude-cli": "static",
		"anthropic": "refreshable"
	}
};
var modelIdNormalization = { "providers": { "anthropic": { "aliases": {
	"fable": "claude-fable-5-1",
	"fable-5": "claude-fable-5",
	"fable-5.1": "claude-fable-5-1",
	"fable-5-1": "claude-fable-5-1",
	"haiku": "claude-haiku-4-5",
	"opus-5.5": "claude-opus-5-5",
	"opus-5-5": "claude-opus-5-5",
	"opus-5": "claude-opus-5",
	"opus": "claude-opus-5",
	"opus-4.8": "claude-opus-4-8",
	"opus-4.7": "claude-opus-4-7",
	"opus-4.6": "claude-opus-4-6",
	"mythos-5": "claude-mythos-5",
	"sonnet-5": "claude-sonnet-5",
	"sonnet": "claude-sonnet-5",
	"sonnet-4.6": "claude-sonnet-4-6"
} } } };
//#endregion
//#region extensions/anthropic/cli-constants.ts
/**
* Shared Claude CLI constants. These identify the synthetic backend, default
* model refs, aliases, and session-id fields used across runtime and setup.
*/
/** Synthetic provider/backend id for Claude Code CLI-backed Anthropic models. */
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
/** Retired OpenClaw auth profile replaced by Claude CLI's native login. */
const CLAUDE_CLI_PROFILE_ID = `anthropic:${CLAUDE_CLI_BACKEND_ID}`;
/** Explicit thinking opt-out for Claude CLI routes unsupported by Claude Code. */
const CLAUDE_CLI_OFF_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
/** Non-secret marker telling OpenClaw that the installed Claude CLI owns auth. */
const CLAUDE_CLI_NATIVE_AUTH_MARKER = ["openclaw", "claude-cli-native-auth"].join(":");
/** Environment variables removed before launching OpenClaw-managed Claude CLI runs. */
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
/** Default Claude CLI model ref for agent defaults and live tests. */
const CLAUDE_CLI_DEFAULT_MODEL_REF = `${CLAUDE_CLI_BACKEND_ID}/claude-opus-5`;
/** Canonical model ref routed to the Claude CLI backend by Anthropic setup. */
const CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF = `anthropic/${CLAUDE_CLI_DEFAULT_MODEL_REF.slice(11)}`;
/** Default Claude CLI models allowed when setup seeds the model allowlist. */
const CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS = modelCatalog.providers[CLAUDE_CLI_BACKEND_ID].models.map(({ id }) => `${CLAUDE_CLI_BACKEND_ID}/${id}`);
/**
* Claude CLI model ids probed when detecting an existing CLI route, canonical
* default first. Route detection must not depend on which model is currently
* the default: existing configs route older Claude models, so probing only the
* default would stop advertising session creation after a default bump.
*/
const CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS = CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) => ref.slice(11));
/** Provider-owned aliases shared by setup, pricing, and native CLI selectors. */
const CLAUDE_MODEL_ID_ALIASES = new Map(Object.entries(modelIdNormalization.providers.anthropic.aliases));
/** User-facing Claude CLI model aliases normalized before execution. */
const CLAUDE_CLI_MODEL_ALIASES = {
	...Object.fromEntries(CLAUDE_MODEL_ID_ALIASES),
	...Object.fromEntries(CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS.map((id) => [id, id])),
	opus: "opus",
	sonnet: "sonnet",
	fable: "fable",
	haiku: "haiku"
};
/** JSONL fields that may contain Claude CLI session ids. */
const CLAUDE_CLI_SESSION_ID_FIELDS = [
	"session_id",
	"sessionId",
	"conversation_id",
	"conversationId"
];
//#endregion
export { CLAUDE_CLI_DEFAULT_MODEL_REF as a, CLAUDE_CLI_OFF_THINKING_PROFILE as c, CLAUDE_CLI_SESSION_ID_FIELDS as d, CLAUDE_MODEL_ID_ALIASES as f, CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS as i, CLAUDE_CLI_PROFILE_ID as l, CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF as n, CLAUDE_CLI_MODEL_ALIASES as o, modelCatalog as p, CLAUDE_CLI_CLEAR_ENV as r, CLAUDE_CLI_NATIVE_AUTH_MARKER as s, CLAUDE_CLI_BACKEND_ID as t, CLAUDE_CLI_ROUTE_PROBE_MODEL_IDS as u };
