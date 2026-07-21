import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries, u as normalizeStringEntriesLower } from "./string-normalization-CRyoFBPt.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { a as normalizeAnyChannelId } from "./registry-BUWrOy2m.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { p as resolveChannelPromptCapabilities } from "./gateway-CmPZGwyr.js";
import { f as supportsAutomaticThreadBindingSpawn, u as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-DuqhAvqy.js";
//#region src/config/channel-capabilities.ts
const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
function normalizeCapabilities(capabilities) {
	if (!isStringArray(capabilities)) return;
	const normalized = normalizeStringEntries(capabilities);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveAccountCapabilities(params) {
	const cfg = params.cfg;
	if (!cfg) return;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const accounts = cfg.accounts;
	if (accounts && typeof accounts === "object") {
		const match = resolveAccountEntry(accounts, normalizedAccountId);
		if (match) return normalizeCapabilities(match.capabilities) ?? normalizeCapabilities(cfg.capabilities);
	}
	return normalizeCapabilities(cfg.capabilities);
}
/** Resolves normalized string capabilities for a channel/account config pair. */
function resolveChannelCapabilities(params) {
	const cfg = params.cfg;
	const channel = normalizeAnyChannelId(params.channel);
	if (!cfg || !channel) return;
	return resolveAccountCapabilities({
		cfg: cfg.channels?.[channel] ?? cfg[channel],
		accountId: params.accountId
	});
}
//#endregion
//#region src/agents/runtime-capabilities.ts
/**
* Runtime channel capability collector.
*
* Agent startup uses this to merge configured channel capabilities with prompt
* tools and thread-bound spawn features that depend on channel policy.
*/
const THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY = "threadbound-subagent-spawn";
const THREAD_BOUND_ACP_SPAWN_CAPABILITY = "threadbound-acp-spawn";
function mergeRuntimeCapabilities(base, additions = []) {
	const merged = [...base ?? []];
	const seen = new Set(normalizeStringEntriesLower(merged));
	for (const capability of additions) {
		const normalizedCapability = normalizeOptionalLowercaseString(capability);
		if (!normalizedCapability || seen.has(normalizedCapability)) continue;
		seen.add(normalizedCapability);
		merged.push(capability);
	}
	return merged.length > 0 ? merged : void 0;
}
/** Collects the effective runtime capabilities for a channel/account pair. */
function collectRuntimeChannelCapabilities(params) {
	if (!params.channel) return;
	const threadSpawnCapabilities = [];
	if (params.cfg && supportsAutomaticThreadBindingSpawn(params.channel)) for (const [kind, capability] of [["subagent", THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY], ["acp", THREAD_BOUND_ACP_SPAWN_CAPABILITY]]) {
		const policy = resolveThreadBindingSpawnPolicy({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId ?? void 0,
			kind
		});
		if (policy.enabled && policy.spawnEnabled) threadSpawnCapabilities.push(capability);
	}
	return mergeRuntimeCapabilities(resolveChannelCapabilities(params), params.cfg ? [...resolveChannelPromptCapabilities(params), ...threadSpawnCapabilities] : threadSpawnCapabilities);
}
//#endregion
export { collectRuntimeChannelCapabilities as t };
