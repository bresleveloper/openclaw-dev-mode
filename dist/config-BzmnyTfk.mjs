import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries, p as normalizeTrimmedStringList, y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./file-access-runtime-BMp89X4Y.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import { L as MAX_SETUP_GRACE_TIMEOUT_MS, N as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW, O as DEFAULT_TIMEOUT_MS, R as MAX_TIMEOUT_MS, S as DEFAULT_QUERY_MODE, _ as DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS, c as ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW, d as DEFAULT_ACTIVE_MEMORY_MODE, f as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, h as DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS, k as DEFAULT_TRANSCRIPT_DIR, m as DEFAULT_CACHE_TTL_MS } from "./types-DgEaE0BK.mjs";
import path from "node:path";
//#region extensions/active-memory/config.ts
let minimumTimeoutMs = 250;
let setupGraceTimeoutMs = 0;
function parseOptionalPositiveInt(value, fallback) {
	const parsed = typeof value === "number" ? value : typeof value === "string" ? parseStrictPositiveInteger(value) : NaN;
	return parsed !== void 0 && Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function resolveChoice(value, choices, fallback) {
	return choices.find((choice) => choice === value) ?? fallback;
}
function normalizeTranscriptDir(value) {
	const raw = typeof value === "string" ? value.trim() : "";
	if (!raw) return DEFAULT_TRANSCRIPT_DIR;
	const safeParts = raw.replace(/\\/g, "/").split("/").map((part) => part.trim()).filter((part) => part.length > 0 && part !== "." && part !== "..");
	return safeParts.length > 0 ? path.join(...safeParts) : DEFAULT_TRANSCRIPT_DIR;
}
function normalizeIdentifierList(value) {
	return uniqueStrings(normalizeTrimmedStringList(value).map((entry) => entry.toLowerCase()));
}
function normalizeConfiguredToolsAllow(value) {
	if (!Array.isArray(value)) return;
	const tools = normalizeIdentifierList(value).filter((name) => !name.startsWith("group:") && !ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW.has(name)).slice(0, 32);
	return tools.length > 0 ? tools : void 0;
}
function resolveDefaultToolsAllow(cfg, recallToolNames) {
	const providerTools = normalizeIdentifierList(recallToolNames);
	if (providerTools.length > 0) return providerTools;
	return cfg?.plugins?.slots?.memory === "memory-lancedb" ? [...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW] : [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW];
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
function resolvePersistentTranscriptBaseDir(api, agentId) {
	return path.join(api.runtime.state.resolveStateDir(), "plugins", "active-memory", "transcripts", "agents", encodeURIComponent(agentId.trim()) || "unknown-agent");
}
function isMissingRegisteredMemoryToolsError(error, toolsAllow = DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW) {
	if (!(error instanceof Error)) return false;
	const message = error.message.trim();
	if (!message.startsWith("No callable tools remain after resolving explicit tool allowlist (") || !message.endsWith("); no registered tools matched. Fix the allowlist or enable the plugin that registers the requested tool.")) return false;
	return message.slice(66, -105).split(";").map((source) => source.trim()).filter(Boolean).includes(`runtime toolsAllow: ${toolsAllow.join(", ")}`);
}
function normalizePluginConfig(pluginConfig, cfg, recallToolNames) {
	const raw = pluginConfig && typeof pluginConfig === "object" ? pluginConfig : {};
	const allowedChatTypes = Array.isArray(raw.allowedChatTypes) ? raw.allowedChatTypes.filter((value) => value === "direct" || value === "group" || value === "channel" || value === "explicit") : [];
	return {
		enabled: raw.enabled !== false,
		mode: resolveChoice(raw.mode, [
			"always",
			"off",
			"escalate"
		], DEFAULT_ACTIVE_MEMORY_MODE),
		agents: Array.isArray(raw.agents) ? normalizeStringEntries(raw.agents) : [],
		model: normalizeOptionalString(raw.model),
		modelFallback: normalizeOptionalString(raw.modelFallback),
		allowedChatTypes: allowedChatTypes.length > 0 ? allowedChatTypes : ["direct"],
		allowedChatIds: normalizeIdentifierList(raw.allowedChatIds),
		deniedChatIds: normalizeIdentifierList(raw.deniedChatIds),
		thinking: resolveChoice(raw.thinking, [
			"off",
			"minimal",
			"low",
			"medium",
			"high",
			"xhigh",
			"adaptive",
			"max"
		], "off"),
		fastMode: normalizeActiveMemoryFastMode(raw.fastMode),
		promptStyle: resolveChoice(raw.promptStyle, [
			"balanced",
			"strict",
			"contextual",
			"recall-heavy",
			"precision-heavy",
			"preference-only"
		], raw.queryMode === "message" ? "strict" : raw.queryMode === "full" ? "contextual" : "balanced"),
		toolsAllow: normalizeConfiguredToolsAllow(raw.toolsAllow) ?? resolveDefaultToolsAllow(cfg, recallToolNames),
		promptOverride: normalizeOptionalString(raw.promptOverride),
		promptAppend: normalizeOptionalString(raw.promptAppend),
		timeoutMs: resolveIntegerOption(parseOptionalPositiveInt(raw.timeoutMs, DEFAULT_TIMEOUT_MS), DEFAULT_TIMEOUT_MS, {
			min: minimumTimeoutMs,
			max: MAX_TIMEOUT_MS
		}),
		timeoutMsIsDefault: raw.timeoutMs === void 0 || raw.timeoutMs === null,
		setupGraceTimeoutMs: resolveIntegerOption(raw.setupGraceTimeoutMs, setupGraceTimeoutMs, {
			min: 0,
			max: MAX_SETUP_GRACE_TIMEOUT_MS
		}),
		queryMode: resolveChoice(raw.queryMode, [
			"message",
			"recent",
			"full"
		], DEFAULT_QUERY_MODE),
		maxSummaryChars: resolveIntegerOption(raw.maxSummaryChars, 220, {
			min: 40,
			max: 1e3
		}),
		recentUserTurns: resolveIntegerOption(raw.recentUserTurns, 2, {
			min: 0,
			max: 4
		}),
		recentAssistantTurns: resolveIntegerOption(raw.recentAssistantTurns, 1, {
			min: 0,
			max: 3
		}),
		recentUserChars: resolveIntegerOption(raw.recentUserChars, 220, {
			min: 40,
			max: 1e3
		}),
		recentAssistantChars: resolveIntegerOption(raw.recentAssistantChars, 180, {
			min: 40,
			max: 1e3
		}),
		logging: raw.logging === true,
		cacheTtlMs: resolveIntegerOption(raw.cacheTtlMs, DEFAULT_CACHE_TTL_MS, {
			min: 1e3,
			max: 12e4
		}),
		circuitBreakerMaxTimeouts: resolveIntegerOption(raw.circuitBreakerMaxTimeouts, 3, {
			min: 1,
			max: 20
		}),
		circuitBreakerCooldownMs: resolveIntegerOption(raw.circuitBreakerCooldownMs, DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS, {
			min: 5e3,
			max: 6e5
		}),
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
function normalizeActiveMemoryFastMode(fastMode) {
	return fastMode === true || fastMode === false || fastMode === "auto" ? fastMode : void 0;
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
function applyCliRuntimeRecallTimeoutDefault(config, cliDispatchEligible) {
	if (!config.timeoutMsIsDefault || config.timeoutMs >= 45e3) return config;
	return cliDispatchEligible ? {
		...config,
		timeoutMs: DEFAULT_CLI_RUNTIME_RECALL_TIMEOUT_MS
	} : config;
}
//#endregion
export { normalizePluginConfig as a, resolvePersistentTranscriptBaseDir as c, setSetupGraceTimeoutMsForTests as d, normalizeActiveMemoryFastMode as i, resolveSafeTranscriptDir as l, hasDeprecatedModelFallbackPolicy as n, readActiveMemoryConfig as o, isMissingRegisteredMemoryToolsError as r, resetActiveMemoryConfigForTests as s, applyCliRuntimeRecallTimeoutDefault as t, setMinimumTimeoutMsForTests as u };
