import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { n as parseToolsBySenderTypedKey } from "./types.tools-rqp14r00.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CxyiAx1U.mjs";
import { i as resolveChannelAccountKey, r as resolveChannelAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { n as resolveMergedAccountConfig } from "./channel-account-config-DBuJQlcg.mjs";
//#region src/config/channel-groups.ts
function resolveChannelGroups(cfg, channel, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	return resolveMergedAccountConfig({
		channelConfig,
		channelId: channel,
		accounts: channelConfig.accounts,
		accountId: normalizedAccountId,
		inheritEmptyKeys: Object.keys(channelConfig.accounts ?? {}).length > 1 ? {} : { groups: "object" }
	}).groups;
}
//#endregion
//#region src/config/tools-by-sender.ts
const warnedLegacyToolsBySenderKeys = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
const compiledToolsBySenderCache = /* @__PURE__ */ new WeakMap();
function normalizeSenderKey(value, options = {}) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	const withoutAt = options.stripLeadingAt && trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
	return normalizeLowercaseStringOrEmpty(withoutAt);
}
function normalizeTypedSenderKey(value, type) {
	if (type === "channel") return normalizeChannelSenderKey(value);
	return normalizeSenderKey(value, { stripLeadingAt: type === "username" });
}
function normalizeSenderPolicyChannel(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "";
	return normalizeMessageChannel(trimmed) ?? normalizeSenderKey(trimmed);
}
function normalizeChannelSenderKey(value) {
	const trimmed = value.trim();
	const separatorIndex = trimmed.indexOf(":");
	if (separatorIndex <= 0 || separatorIndex === trimmed.length - 1) return "";
	const channel = normalizeSenderPolicyChannel(trimmed.slice(0, separatorIndex));
	const senderId = normalizeTypedSenderKey(trimmed.slice(separatorIndex + 1), "id");
	if (!channel || !senderId) return "";
	return `${channel}:${senderId}`;
}
function normalizeLegacySenderKey(value) {
	return normalizeSenderKey(value, { stripLeadingAt: true });
}
function warnLegacyToolsBySenderKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed || warnedLegacyToolsBySenderKeys.check(trimmed)) return;
	process.emitWarning(`toolsBySender key "${trimmed}" is deprecated. Use explicit prefixes (channel:, id:, e164:, username:, name:). Legacy unprefixed keys are matched as id only.`, {
		type: "DeprecationWarning",
		code: "OPENCLAW_TOOLS_BY_SENDER_UNTYPED_KEY"
	});
}
function parseSenderPolicyKey(rawKey) {
	const trimmed = rawKey.trim();
	if (!trimmed) return;
	if (trimmed === "*") return { kind: "wildcard" };
	const typed = parseToolsBySenderTypedKey(trimmed);
	if (typed) {
		const key = normalizeTypedSenderKey(typed.value, typed.type);
		if (!key) return;
		return {
			kind: "typed",
			type: typed.type,
			key
		};
	}
	warnLegacyToolsBySenderKey(trimmed);
	const key = normalizeLegacySenderKey(trimmed);
	if (!key) return;
	return {
		kind: "typed",
		type: "id",
		key
	};
}
function createSenderPolicyBuckets() {
	return {
		channel: /* @__PURE__ */ new Map(),
		id: /* @__PURE__ */ new Map(),
		e164: /* @__PURE__ */ new Map(),
		username: /* @__PURE__ */ new Map(),
		name: /* @__PURE__ */ new Map()
	};
}
function compileToolsBySenderPolicy(toolsBySender) {
	const entries = Object.entries(toolsBySender);
	if (entries.length === 0) return;
	const buckets = createSenderPolicyBuckets();
	let wildcard;
	for (const [rawKey, policy] of entries) {
		if (!policy) continue;
		const parsed = parseSenderPolicyKey(rawKey);
		if (!parsed) continue;
		if (parsed.kind === "wildcard") {
			wildcard = policy;
			continue;
		}
		const bucket = buckets[parsed.type];
		if (!bucket.has(parsed.key)) bucket.set(parsed.key, policy);
	}
	return {
		buckets,
		wildcard
	};
}
function resolveCompiledToolsBySenderPolicy(toolsBySender) {
	const cached = compiledToolsBySenderCache.get(toolsBySender);
	if (cached) return cached;
	const compiled = compileToolsBySenderPolicy(toolsBySender);
	if (!compiled) return;
	compiledToolsBySenderCache.set(toolsBySender, compiled);
	return compiled;
}
function normalizeCandidate(value, type) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "";
	return normalizeTypedSenderKey(trimmed, type);
}
function normalizeSenderIdCandidates(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return [];
	const typed = normalizeTypedSenderKey(trimmed, "id");
	const legacy = normalizeLegacySenderKey(trimmed);
	if (!typed) return legacy ? [legacy] : [];
	if (!legacy || legacy === typed) return [typed];
	return [typed, legacy];
}
function matchToolsBySenderPolicy(compiled, params) {
	const senderIdCandidates = normalizeSenderIdCandidates(params.senderId);
	const channel = normalizeSenderPolicyChannel(params.messageProvider);
	if (channel) for (const senderIdCandidate of senderIdCandidates) {
		const match = compiled.buckets.channel.get(`${channel}:${senderIdCandidate}`);
		if (match) return match;
	}
	for (const senderIdCandidate of senderIdCandidates) {
		const match = compiled.buckets.id.get(senderIdCandidate);
		if (match) return match;
	}
	const senderE164 = normalizeCandidate(params.senderE164, "e164");
	if (senderE164) {
		const match = compiled.buckets.e164.get(senderE164);
		if (match) return match;
	}
	const senderUsername = normalizeCandidate(params.senderUsername, "username");
	if (senderUsername) {
		const match = compiled.buckets.username.get(senderUsername);
		if (match) return match;
	}
	const senderName = normalizeCandidate(params.senderName, "name");
	if (senderName) {
		const match = compiled.buckets.name.get(senderName);
		if (match) return match;
	}
	return compiled.wildcard;
}
function resolveToolsBySender(params) {
	const toolsBySender = params.toolsBySender;
	if (!toolsBySender) return;
	const compiled = resolveCompiledToolsBySenderPolicy(toolsBySender);
	if (!compiled) return;
	return matchToolsBySenderPolicy(compiled, params);
}
//#endregion
//#region src/config/group-scope-tree.ts
const encodeScopeSegment = (value) => `${value.length}:${value}`;
function scopeKey(...segments) {
	return segments.map(([prefix, value]) => `${prefix}:${encodeScopeSegment(value)}`).join("/");
}
function buildChannelGroupsScopeTree(cfg, channel, accountId) {
	const { "*": defaults, ...scopes } = resolveChannelGroups(cfg, channel, accountId) ?? {};
	return {
		defaults,
		scopes
	};
}
function resolveScopeKeyCaseInsensitive(tree, key) {
	if (!key) return;
	if (Object.hasOwn(tree.scopes, key)) return key;
	const target = normalizeLowercaseStringOrEmpty(key);
	return Object.keys(tree.scopes).find((candidate) => normalizeLowercaseStringOrEmpty(candidate) === target);
}
function resolveFromScopes(params) {
	for (let index = params.path.length - 1; index >= 0; index -= 1) {
		const key = params.path[index];
		if (key === void 0 || !Object.hasOwn(params.tree.scopes, key)) continue;
		const node = params.tree.scopes[key];
		if (!node) continue;
		const value = params.resolveNode(node);
		if (value !== void 0) return value;
	}
	return params.tree.defaults ? params.resolveNode(params.tree.defaults) : void 0;
}
function resolveScopeRequireMention(params) {
	const { requireMentionOverride, overrideOrder = "after-config" } = params;
	const configuredMention = resolveFromScopes({
		tree: params.tree,
		path: params.path,
		resolveNode: (node) => node.requireMention
	});
	if (overrideOrder === "before-config" && typeof requireMentionOverride === "boolean") return requireMentionOverride;
	if (typeof configuredMention === "boolean") return configuredMention;
	if (overrideOrder !== "before-config" && typeof requireMentionOverride === "boolean") return requireMentionOverride;
	if (params.configuredScopeDefaultsToNoMention && params.path.some((key) => Object.hasOwn(params.tree.scopes, key))) return false;
	return true;
}
function resolveScopeToolsPolicy(params) {
	return resolveFromScopes({
		tree: params.tree,
		path: params.path,
		resolveNode: (node) => (params.senderPolicyMode === "never" ? void 0 : resolveToolsBySender({
			toolsBySender: node.toolsBySender,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			messageProvider: params.messageProvider
		})) ?? node.tools
	});
}
function resolveScopeIntroHint(params) {
	return resolveFromScopes({
		tree: params.tree,
		path: params.path,
		resolveNode: (node) => node.introHint
	});
}
//#endregion
//#region src/config/group-policy.ts
function resolveChannelGroupConfig(groups, groupId, caseInsensitive = false) {
	if (!groups) return;
	const direct = groups[groupId];
	if (direct) return direct;
	if (!caseInsensitive) return;
	const target = normalizeLowercaseStringOrEmpty(groupId);
	const matchedKey = Object.keys(groups).find((key) => key !== "*" && normalizeLowercaseStringOrEmpty(key) === target);
	if (!matchedKey) return;
	return groups[matchedKey];
}
/** Locate the authored map selected by the channel owner without changing its inheritance rules. */
function resolveChannelGroupsConfigPath(params) {
	const rootPath = `channels.${params.channel}.groups`;
	const accounts = (params.cfg.channels?.[params.channel])?.accounts;
	if (!accounts) return rootPath;
	const accountId = normalizeAccountId(params.accountId);
	const accountKey = resolveChannelAccountKey(accounts, accountId, params.channel);
	const account = accountKey ? accounts[accountKey] : void 0;
	if (!account || params.groups !== void 0 && params.groups !== account.groups) return rootPath;
	return accountKey ? `channels.${params.channel}.accounts[${JSON.stringify(accountKey)}].groups` : rootPath;
}
function resolveChannelGroupPolicyMode(cfg, channel, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const channelConfig = cfg.channels?.[channel];
	if (!channelConfig) return;
	return resolveChannelAccountEntry(channelConfig.accounts, normalizedAccountId, channel)?.groupPolicy ?? channelConfig.groupPolicy;
}
function resolveChannelGroupPolicy(params) {
	const { cfg, channel } = params;
	const groups = resolveChannelGroups(cfg, channel, params.accountId);
	const groupPolicy = resolveChannelGroupPolicyMode(cfg, channel, params.accountId);
	const hasGroups = Boolean(groups && Object.keys(groups).length > 0);
	const allowlistEnabled = groupPolicy === "allowlist" || hasGroups;
	const normalizedId = params.groupId?.trim();
	const groupConfig = normalizedId ? resolveChannelGroupConfig(groups, normalizedId, params.groupIdCaseInsensitive) : void 0;
	const defaultConfig = groups?.["*"];
	const allowAll = allowlistEnabled && Boolean(groups && Object.hasOwn(groups, "*"));
	const senderFilterBypass = groupPolicy === "allowlist" && !hasGroups && Boolean(params.hasGroupAllowFrom);
	return {
		allowlistEnabled,
		allowed: groupPolicy === "disabled" ? false : !allowlistEnabled || allowAll || Boolean(groupConfig) || senderFilterBypass,
		groupConfig,
		defaultConfig
	};
}
function buildSelectedGroupScope(groupConfig, defaultConfig) {
	const project = (node) => ({
		requireMention: typeof node.requireMention === "boolean" ? node.requireMention : void 0,
		tools: node.tools || void 0,
		toolsBySender: node.toolsBySender
	});
	return {
		tree: {
			scopes: groupConfig ? { selected: project(groupConfig) } : {},
			defaults: defaultConfig ? project(defaultConfig) : void 0
		},
		path: groupConfig ? ["selected"] : []
	};
}
function resolveChannelGroupRequireMention(params) {
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy(params);
	return resolveScopeRequireMention({
		...buildSelectedGroupScope(groupConfig, defaultConfig),
		requireMentionOverride: params.requireMentionOverride,
		overrideOrder: params.overrideOrder,
		configuredScopeDefaultsToNoMention: params.configuredGroupDefaultsToNoMention
	});
}
function resolveChannelGroupToolsPolicy(params) {
	const groups = resolveChannelGroups(params.cfg, params.channel, params.accountId);
	const groupIds = [params.groupId, ...Array.isArray(params.groupIdCandidates) ? params.groupIdCandidates : []];
	let groupConfig;
	for (const rawGroupId of groupIds) {
		const groupId = rawGroupId?.trim();
		if (!groupId) continue;
		groupConfig = resolveChannelGroupConfig(groups, groupId, params.groupIdCaseInsensitive);
		if (groupConfig) break;
	}
	return resolveScopeToolsPolicy({
		...params,
		...buildSelectedGroupScope(groupConfig, groups?.["*"]),
		messageProvider: params.messageProvider ?? params.channel
	});
}
//#endregion
export { buildChannelGroupsScopeTree as a, resolveScopeKeyCaseInsensitive as c, scopeKey as d, resolveToolsBySender as f, resolveChannelGroupsConfigPath as i, resolveScopeRequireMention as l, resolveChannelGroupRequireMention as n, encodeScopeSegment as o, resolveChannelGroups as p, resolveChannelGroupToolsPolicy as r, resolveScopeIntroHint as s, resolveChannelGroupPolicy as t, resolveScopeToolsPolicy as u };
