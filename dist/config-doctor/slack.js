import { a as asNullableRecord, i as normalizeOptionalString, t as normalizeLowercaseStringOrEmpty } from "./string-coerce-Dyy0qgLy.js";
import { l as normalizeChannelConfigEntries, n as defineKeyMoveMigration, s as defineChannelAliasMigration, u as stripRetiredChannelKeys, x as hasLegacyAccountStreamingAliases, y as asBoolean } from "./runtime-doctor-migrations-8XPPImoy.js";
import "./string-coerce-runtime-BSQ-eR6f.js";
//#region src/channels/streaming-config-readers.ts
function getChannelStreamingConfigObject(entry) {
	const streaming = asNullableRecord(entry?.streaming);
	return streaming ? streaming : void 0;
}
function resolveChannelStreamingNativeTransport(entry) {
	return asBoolean(getChannelStreamingConfigObject(entry)?.nativeTransport);
}
//#endregion
//#region extensions/slack/src/streaming-compat.ts
function normalizeStreamingMode(value) {
	if (typeof value !== "string") return null;
	return (normalizeOptionalString(value) == null ? "" : normalizeLowercaseStringOrEmpty(value)) || null;
}
function parseStreamingMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress") return normalized;
	return null;
}
function parseSlackLegacyDraftStreamMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "replace" || normalized === "status_final" || normalized === "append") return normalized;
	return null;
}
function mapSlackLegacyDraftStreamModeToStreaming(mode) {
	if (mode === "append") return "block";
	if (mode === "status_final") return "progress";
	return "partial";
}
function resolveSlackStreamingMode(params = {}) {
	const parsedStreaming = parseStreamingMode(getChannelStreamingConfigObject(params)?.mode ?? params.streaming);
	if (parsedStreaming) return parsedStreaming;
	const legacyStreamMode = parseSlackLegacyDraftStreamMode(params.streamMode);
	if (legacyStreamMode) return mapSlackLegacyDraftStreamModeToStreaming(legacyStreamMode);
	if (typeof params.streaming === "boolean") return params.streaming ? "partial" : "off";
	return "progress";
}
function resolveSlackNativeStreaming(params = {}) {
	const canonical = resolveChannelStreamingNativeTransport(params);
	if (typeof canonical === "boolean") return canonical;
	if (typeof params.nativeStreaming === "boolean") return params.nativeStreaming;
	if (typeof params.streaming === "boolean") return params.streaming;
	return true;
}
//#endregion
//#region extensions/slack/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "slack",
	streaming: {
		defaultMode: "partial",
		resolveMode: resolveSlackStreamingMode,
		resolveNativeTransport: resolveSlackNativeStreaming
	},
	dm: {
		root: true,
		accounts: true
	}
});
const dmReplyModeMigration = defineKeyMoveMigration({
	from: ["dm", "replyToMode"],
	to: ["replyToModeByChatType", "direct"]
});
const threadMentionPolicyMigration = defineKeyMoveMigration({
	from: ["thread", "requireExplicitMention"],
	to: ["implicitMentions", "threadParticipation"],
	map: (value) => typeof value === "boolean" ? { value: !value } : null,
	pruneEmptySource: true,
	movedMessage: ({ sourcePath, targetPath, mappedValue }) => `Moved ${sourcePath} → ${targetPath} (${String(mappedValue)}).`
});
const channelAllowMigration = defineKeyMoveMigration({
	scope: ["channels", "*"],
	from: ["allow"],
	to: ["enabled"]
});
function hasInteractiveRepliesCapability(value) {
	const capabilities = asNullableRecord(value)?.capabilities;
	if (Array.isArray(capabilities)) return capabilities.some((entry) => typeof entry === "string" && entry.trim().toLowerCase() === "interactivereplies");
	const capabilitiesRecord = asNullableRecord(capabilities);
	return Boolean(capabilitiesRecord && (Object.keys(capabilitiesRecord).length === 0 || Object.hasOwn(capabilitiesRecord, "interactiveReplies")));
}
function hasEnterpriseOrgInstall(value) {
	return Object.hasOwn(asNullableRecord(value) ?? {}, "enterpriseOrgInstall");
}
function removeInteractiveRepliesCapability(params) {
	const capabilities = params.entry.capabilities;
	let nextCapabilities;
	let removedEmptyObject = false;
	if (Array.isArray(capabilities)) {
		nextCapabilities = capabilities.filter((entry) => !(typeof entry === "string" && entry.trim().toLowerCase() === "interactivereplies"));
		if (nextCapabilities.length === capabilities.length) return {
			entry: params.entry,
			changed: false
		};
	} else {
		const capabilitiesRecord = asNullableRecord(capabilities);
		if (!capabilitiesRecord || Object.keys(capabilitiesRecord).length > 0 && !Object.hasOwn(capabilitiesRecord, "interactiveReplies")) return {
			entry: params.entry,
			changed: false
		};
		removedEmptyObject = Object.keys(capabilitiesRecord).length === 0;
		const { interactiveReplies: _retired, ...rest } = capabilitiesRecord;
		nextCapabilities = rest;
	}
	const entry = { ...params.entry };
	if (Array.isArray(nextCapabilities) ? nextCapabilities.length === 0 : Object.keys(nextCapabilities).length === 0) delete entry.capabilities;
	else entry.capabilities = nextCapabilities;
	params.changes.push(removedEmptyObject ? `Removed retired empty ${params.pathPrefix}.capabilities object; use typed presentation actions instead.` : `Removed retired ${params.pathPrefix}.capabilities.interactiveReplies; use typed presentation actions instead.`);
	return {
		entry,
		changed: true
	};
}
const legacyConfigRules = [
	...streamingAliasMigration.legacyConfigRules,
	{
		path: [
			"channels",
			"slack",
			"enterpriseOrgInstall"
		],
		message: "channels.slack.enterpriseOrgInstall is retired; Slack now detects org-wide installations automatically. Run \"openclaw doctor --fix\"."
	},
	{
		path: [
			"channels",
			"slack",
			"accounts"
		],
		message: "channels.slack.accounts.<id>.enterpriseOrgInstall is retired; Slack now detects org-wide installations automatically. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasEnterpriseOrgInstall)
	},
	{
		path: ["channels", "slack"],
		message: "channels.slack.capabilities.interactiveReplies is retired; use typed presentation actions instead. Run \"openclaw doctor --fix\".",
		match: hasInteractiveRepliesCapability
	},
	{
		path: [
			"channels",
			"slack",
			"accounts"
		],
		message: "channels.slack.accounts.<id>.capabilities.interactiveReplies is retired; use typed presentation actions instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasInteractiveRepliesCapability)
	},
	{
		path: ["channels", "slack"],
		message: "channels.slack.dm.replyToMode moved to replyToModeByChatType.direct. Run \"openclaw doctor --fix\".",
		match: dmReplyModeMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"slack",
			"accounts"
		],
		message: "channels.slack.accounts.<id>.dm.replyToMode moved to replyToModeByChatType.direct. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, dmReplyModeMigration.hasLegacy)
	},
	{
		path: ["channels", "slack"],
		message: "channels.slack.thread.requireExplicitMention is legacy; use channels.slack.implicitMentions.threadParticipation instead. Run \"openclaw doctor --fix\".",
		match: threadMentionPolicyMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"slack",
			"accounts"
		],
		message: "channels.slack.accounts.<id>.thread.requireExplicitMention is legacy; use channels.slack.accounts.<id>.implicitMentions.threadParticipation instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, threadMentionPolicyMigration.hasLegacy)
	},
	{
		path: ["channels", "slack"],
		message: "channels.slack.channels.<id>.allow is legacy; use channels.slack.channels.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: channelAllowMigration.hasLegacy
	},
	{
		path: [
			"channels",
			"slack",
			"accounts"
		],
		message: "channels.slack.accounts.<id>.channels.<id>.allow is legacy; use channels.slack.accounts.<id>.channels.<id>.enabled instead. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, channelAllowMigration.hasLegacy)
	}
];
function normalizeSlackEntry(params) {
	const retiredInteractiveReplies = removeInteractiveRepliesCapability(params);
	const dm = dmReplyModeMigration.normalize({
		...params,
		entry: retiredInteractiveReplies.entry
	});
	const thread = threadMentionPolicyMigration.normalize({
		...params,
		entry: dm.entry
	});
	const channels = channelAllowMigration.normalize({
		...params,
		entry: thread.entry
	});
	return {
		entry: channels.entry,
		changed: retiredInteractiveReplies.changed || dm.changed || thread.changed || channels.changed
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const retired = stripRetiredChannelKeys({
		cfg,
		channelId: "slack",
		keys: /* @__PURE__ */ new Set(["enterpriseOrgInstall"]),
		scope: "root-and-accounts",
		onRemove: ({ key, pathPrefix }) => changes.push(`Removed retired ${pathPrefix}.${key}; Slack detects org-wide installations automatically.`)
	});
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg: retired.config,
		changes
	});
	return normalizeChannelConfigEntries({
		cfg: aliases.config,
		channelId: "slack",
		changes,
		normalizeEntry: normalizeSlackEntry
	});
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
