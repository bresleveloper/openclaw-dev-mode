import { j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { L as MAX_SETUP_GRACE_TIMEOUT_MS, N as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW, O as DEFAULT_TIMEOUT_MS, R as MAX_TIMEOUT_MS, S as DEFAULT_QUERY_MODE, _ as DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS, c as ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW, d as DEFAULT_ACTIVE_MEMORY_MODE, f as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, h as DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS, k as DEFAULT_TRANSCRIPT_DIR, m as DEFAULT_CACHE_TTL_MS } from "./types-DgEaE0BK.mjs";
import path from "node:path";
//#region extensions/active-memory/config.ts
let minimumTimeoutMs = 250;
let setupGraceTimeoutMs = 0;
function parseOptionalPositiveInt(value, fallback) {
	const parsed = typeof value === "number" ? value : typeof value === "string" ? parseStrictPositiveInteger(value) : NaN;
	return parsed !== void 0 && Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function clampInt(value, fallback, min, max) {
	return resolveIntegerOption(value, fallback, {
		min,
		max
	});
}
function normalizeTranscriptDir(value) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (!raw) return DEFAULT_TRANSCRIPT_DIR;
	const safeParts = raw.replace(/\\/g, "/").split("/").map((part) => part.trim()).filter((part) => part.length > 0 && part !== "." && part !== "..");
	return safeParts.length > 0 ? path.join(...safeParts) : DEFAULT_TRANSCRIPT_DIR;
}
function normalizeChatIdList(value) {
	return uniqueStrings(normalizeTrimmedStringList(value).map((entry) => entry.toLowerCase()));
}
function normalizeConfiguredToolsAllow(value) {
	if (!Array.isArray(value)) return;
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const entry of value) {
		if (typeof entry !== "string") continue;
		const normalized = normalizeLowercaseStringOrEmpty(entry);
		if (!normalized || isReservedActiveMemoryToolsAllowEntry(normalized) || seen.has(normalized)) continue;
		seen.add(normalized);
		out.push(normalized);
		if (out.length >= 32) break;
	}
	return out.length > 0 ? out : void 0;
}
function isReservedActiveMemoryToolsAllowEntry(value) {
	const normalized = value.trim().toLowerCase();
	return normalized.startsWith("group:") || ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW.has(normalized);
}
function resolveDefaultToolsAllow(cfg) {
	return cfg?.plugins?.slots?.memory === "memory-lancedb" ? [...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW] : [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW];
}
function resolveToolsAllow(params) {
	return normalizeConfiguredToolsAllow(params.pluginToolsAllow) ?? resolveDefaultToolsAllow(params.cfg);
}
function hasDeprecatedModelFallbackPolicy(pluginConfig) {
	const raw = asOptionalRecord(pluginConfig);
	return raw ? Object.hasOwn(raw, "modelFallbackPolicy") : false;
}
function resolveSafeTranscriptDir(baseSessionsDir, transcriptDir) {
	const normalized = transcriptDir.trim();
	if (!normalized || normalized.includes(":") || path.isAbsolute(normalized)) return path.resolve(baseSessionsDir, DEFAULT_TRANSCRIPT_DIR);
	const resolvedBase = path.resolve(baseSessionsDir);
	const candidate = path.resolve(resolvedBase, normalized);
	if (!isPathInside(resolvedBase, candidate)) return path.resolve(resolvedBase, DEFAULT_TRANSCRIPT_DIR);
	return candidate;
}
function toSafeTranscriptAgentDirName(agentId) {
	const encoded = encodeURIComponent(agentId.trim());
	return encoded ? encoded : "unknown-agent";
}
function resolvePersistentTranscriptBaseDir(api, agentId) {
	return path.join(api.runtime.state.resolveStateDir(), "plugins", "active-memory", "transcripts", "agents", toSafeTranscriptAgentDirName(agentId));
}
function formatRuntimeToolsAllowSource(toolsAllow) {
	return `runtime toolsAllow: ${toolsAllow.join(", ")}`;
}
function isMissingRegisteredMemoryToolsError(error, toolsAllow = DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW) {
	if (!(error instanceof Error)) return false;
	const message = error.message.trim();
	if (!message.startsWith("No callable tools remain after resolving explicit tool allowlist (") || !message.endsWith("); no registered tools matched. Fix the allowlist or enable the plugin that registers the requested tool.")) return false;
	const sources = message.slice(66, -105);
	const runtimeSource = formatRuntimeToolsAllowSource(toolsAllow);
	return sources.split(";").map((source) => source.trim()).filter(Boolean).includes(runtimeSource);
}
function normalizePluginConfig(pluginConfig, cfg) {
	const raw = pluginConfig && typeof pluginConfig === "object" ? pluginConfig : {};
	const allowedChatTypes = Array.isArray(raw.allowedChatTypes) ? raw.allowedChatTypes.filter((value) => value === "direct" || value === "group" || value === "channel" || value === "explicit") : [];
	return {
		enabled: raw.enabled !== false,
		mode: raw.mode === "always" || raw.mode === "off" || raw.mode === "escalate" ? raw.mode : DEFAULT_ACTIVE_MEMORY_MODE,
		agents: Array.isArray(raw.agents) ? normalizeStringEntries(raw.agents) : [],
		model: normalizeOptionalString(raw.model),
		modelFallback: normalizeOptionalString(raw.modelFallback),
		allowedChatTypes: allowedChatTypes.length > 0 ? allowedChatTypes : ["direct"],
		allowedChatIds: normalizeChatIdList(raw.allowedChatIds),
		deniedChatIds: normalizeChatIdList(raw.deniedChatIds),
		thinking: resolveThinkingLevel(raw.thinking),
		fastMode: normalizeActiveMemoryFastMode(raw.fastMode),
		promptStyle: resolvePromptStyle(raw.promptStyle, raw.queryMode),
		toolsAllow: resolveToolsAllow({
			pluginToolsAllow: raw.toolsAllow,
			cfg
		}),
		promptOverride: normalizeOptionalString(raw.promptOverride),
		promptAppend: normalizeOptionalString(raw.promptAppend),
		timeoutMs: clampInt(parseOptionalPositiveInt(raw.timeoutMs, DEFAULT_TIMEOUT_MS), DEFAULT_TIMEOUT_MS, minimumTimeoutMs, MAX_TIMEOUT_MS),
		timeoutMsIsDefault: raw.timeoutMs === void 0 || raw.timeoutMs === null,
		setupGraceTimeoutMs: clampInt(raw.setupGraceTimeoutMs, setupGraceTimeoutMs, 0, MAX_SETUP_GRACE_TIMEOUT_MS),
		queryMode: raw.queryMode === "message" || raw.queryMode === "recent" || raw.queryMode === "full" ? raw.queryMode : DEFAULT_QUERY_MODE,
		maxSummaryChars: clampInt(raw.maxSummaryChars, 220, 40, 1e3),
		recentUserTurns: clampInt(raw.recentUserTurns, 2, 0, 4),
		recentAssistantTurns: clampInt(raw.recentAssistantTurns, 1, 0, 3),
		recentUserChars: clampInt(raw.recentUserChars, 220, 40, 1e3),
		recentAssistantChars: clampInt(raw.recentAssistantChars, 180, 40, 1e3),
		logging: raw.logging === true,
		cacheTtlMs: clampInt(raw.cacheTtlMs, DEFAULT_CACHE_TTL_MS, 1e3, 12e4),
		circuitBreakerMaxTimeouts: clampInt(raw.circuitBreakerMaxTimeouts, 3, 1, 20),
		circuitBreakerCooldownMs: clampInt(raw.circuitBreakerCooldownMs, DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS, 5e3, 6e5),
		persistTranscripts: raw.persistTranscripts === true,
		transcriptDir: normalizeTranscriptDir(raw.transcriptDir)
	};
}
function readActiveMemoryConfig(api) {
	try {
		return api.runtime.config?.current?.() ?? api.config;
	} catch {
		return api.config;
	}
}
function resolveThinkingLevel(thinking) {
	if (thinking === "off" || thinking === "minimal" || thinking === "low" || thinking === "medium" || thinking === "high" || thinking === "xhigh" || thinking === "adaptive" || thinking === "max") return thinking;
	return "off";
}
function normalizeActiveMemoryFastMode(fastMode) {
	return fastMode === true || fastMode === false || fastMode === "auto" ? fastMode : void 0;
}
function resolvePromptStyle(promptStyle, queryMode) {
	if (promptStyle === "balanced" || promptStyle === "strict" || promptStyle === "contextual" || promptStyle === "recall-heavy" || promptStyle === "precision-heavy" || promptStyle === "preference-only") return promptStyle;
	if (queryMode === "message") return "strict";
	if (queryMode === "full") return "contextual";
	return "balanced";
}
function resetActiveMemoryConfigForTests() {
	minimumTimeoutMs = 250;
	setupGraceTimeoutMs = 0;
}
function setMinimumTimeoutMsForTests(value) {
	minimumTimeoutMs = value;
}
function setSetupGraceTimeoutMsForTests(value) {
	setupGraceTimeoutMs = Math.max(0, Math.floor(value));
}
/**
* Recalls eligible for CLI-backend dispatch run a fresh CLI process, which
* measured runs place at 9-20s — over the plain 15s default. Eligibility is
* the runner's own dispatch decision (route, registered backend, stored
* credential mode), so API-key setups that keep the direct passthrough also
* keep the plain default. Explicit operator timeoutMs config always wins.
*/
function applyCliRuntimeRecallTimeoutDefault(config, cliDispatchEligible) {
	if (!config.timeoutMsIsDefault || config.timeoutMs >= 45e3) return config;
	return cliDispatchEligible ? {
		...config,
		timeoutMs: DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS
	} : config;
}
//#endregion
export { normalizeActiveMemoryFastMode as a, resetActiveMemoryConfigForTests as c, setMinimumTimeoutMsForTests as d, setSetupGraceTimeoutMsForTests as f, isMissingRegisteredMemoryToolsError as i, resolvePersistentTranscriptBaseDir as l, clampInt as n, normalizePluginConfig as o, hasDeprecatedModelFallbackPolicy as r, readActiveMemoryConfig as s, applyCliRuntimeRecallTimeoutDefault as t, resolveSafeTranscriptDir as u };
