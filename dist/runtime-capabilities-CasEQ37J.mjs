import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { d as normalizeStringEntries, f as normalizeStringEntriesLower } from "./string-normalization-D6DKCpwE.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import "./registry-DqsL4UWB.mjs";
import { t as normalizeAnyChannelId } from "./registry-normalize-DKVgg-js.mjs";
import "./message-channel-constants-B3vfipkP.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import "./message-channel-normalize-CsnAJK7x.mjs";
import { t as getChannelPlugin } from "./registry-B91r5qN6.mjs";
import "./plugins-CCVkYF8m.mjs";
import { r as resolveChannelAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { N as supportsThreadBindingSpawn } from "./session-binding-service-ByKk9LiJ.mjs";
import { a as resolveChannelReactionGuidance, i as resolveChannelPromptCapabilities, r as resolveChannelMessageToolHints } from "./channel-tools-IvDct8QI.mjs";
import { c as resolveThreadBindingSpawnPolicy } from "./thread-bindings-policy-Hq7cocye.mjs";
//#region src/config/channel-capabilities.ts
const isStringArray = (value) => Array.isArray(value) && value.every((entry) => typeof entry === "string");
function normalizeCapabilities(capabilities) {
	if (!isStringArray(capabilities)) return;
	const normalized = normalizeStringEntries(capabilities);
	return normalized.length > 0 ? normalized : void 0;
}
function resolveChannelCapabilities(params) {
	const cfg = params.cfg;
	const channel = normalizeAnyChannelId(params.channel);
	if (!cfg || !channel) return;
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const accounts = channelConfig.accounts;
	return normalizeCapabilities((accounts && typeof accounts === "object" ? resolveChannelAccountEntry(accounts, normalizedAccountId, channel) : void 0)?.capabilities) ?? normalizeCapabilities(channelConfig.capabilities);
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
	const internalChannelCapabilities = params.channel === "webchat" ? ["markdownDetails"] : [];
	const threadSpawnCapabilities = [];
	if (params.cfg && supportsThreadBindingSpawn(params.channel)) for (const [kind, capability] of [["subagent", THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY], ["acp", THREAD_BOUND_ACP_SPAWN_CAPABILITY]]) {
		const policy = resolveThreadBindingSpawnPolicy({
			cfg: params.cfg,
			channel: params.channel,
			accountId: params.accountId ?? void 0,
			kind
		});
		if (policy.enabled && policy.spawnEnabled) threadSpawnCapabilities.push(capability);
	}
	const channelPromptCapabilities = params.cfg ? resolveChannelPromptCapabilities(params) : [];
	return mergeRuntimeCapabilities(resolveChannelCapabilities(params), [
		...channelPromptCapabilities,
		...internalChannelCapabilities,
		...threadSpawnCapabilities
	]);
}
/** Shared channel facts for ordinary and compaction system prompts. */
function resolveRuntimeChannelPromptContext(params) {
	const runtimeChannel = normalizeMessageChannel(params.channel);
	const context = {
		cfg: params.cfg,
		channel: runtimeChannel,
		accountId: params.accountId
	};
	const runtimeCapabilities = collectRuntimeChannelCapabilities(context);
	return {
		runtimeChannel,
		...runtimeChannel && getChannelPlugin(runtimeChannel)?.agentPrompt?.customInlineButtonHint ? { customInlineButtonHint: true } : {},
		runtimeCapabilities,
		reactionGuidance: runtimeChannel && params.cfg ? resolveChannelReactionGuidance(context) : void 0,
		messageToolHints: runtimeChannel ? resolveChannelMessageToolHints(context) : void 0
	};
}
//#endregion
export { resolveRuntimeChannelPromptContext as t };
