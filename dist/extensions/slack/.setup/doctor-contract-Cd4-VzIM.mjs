import { n as __reExport, t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getChannelStreamingConfigObject, resolveChannelStreamingNativeTransport } from "openclaw/plugin-sdk/channel-streaming-config";
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord$1(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord$1(value) ? value : null;
}
//#endregion
//#region src/config/channel-config-normalization.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries$1(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
//#endregion
//#region src/plugin-sdk/legacy-webhook-listener-migration.ts
/** Preserve explicitly configured webhook listeners while moving ingress onto Gateway routes. */
function createLegacyWebhookListenerDoctorContract(params) {
	const portKey = params.portKey ?? "webhookPort";
	const hostKey = params.hostKey === void 0 ? "webhookHost" : params.hostKey;
	const source = (entry) => params.webhookKey ? asNullableRecord(entry[params.webhookKey]) : entry;
	const hasLegacy = (value) => {
		const entry = asNullableRecord(value);
		const listener = entry && source(entry);
		return Boolean(listener && (Object.hasOwn(listener, portKey) || hostKey && Object.hasOwn(listener, hostKey)));
	};
	const prefix = `channels.${params.channelKey}`;
	return {
		historicalWebhookListener: {
			channelId: params.channelKey,
			port: params.defaultPort,
			preserveAuthoredActivation: params.preserveAuthoredActivation,
			...params.defaultHost === void 0 ? {} : { host: params.defaultHost }
		},
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${prefix} webhook listeners moved to Gateway routes. Run "openclaw doctor --fix" to preserve explicitly configured listener settings as legacyWebhook.`,
			match: (value) => {
				const accounts = asNullableRecord(asNullableRecord(value)?.accounts);
				return hasLegacy(value) || Object.values(accounts ?? {}).some(hasLegacy);
			}
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			const root = asNullableRecord(asNullableRecord(cfg.channels)?.[params.channelKey]);
			const inherited = root && source(root);
			const canonicalRoot = asNullableRecord(root?.legacyWebhook);
			return normalizeChannelConfigEntries$1({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: ({ entry, accountId, pathPrefix, changes }) => {
					const listener = source(entry);
					if (!listener || !hasLegacy(entry)) return {
						entry,
						changed: false
					};
					const next = { ...entry };
					const port = Object.hasOwn(listener, portKey) ? listener[portKey] : (accountId ? canonicalRoot?.port ?? inherited?.[portKey] : void 0) ?? params.defaultPort;
					const inheritedHost = accountId ? canonicalRoot ? canonicalRoot.host : (hostKey ? inherited?.[hostKey] : void 0) ?? params.defaultHost : params.defaultHost;
					const host = hostKey ? listener[hostKey] ?? inheritedHost : inheritedHost;
					const legacyPath = [pathPrefix, params.webhookKey].filter(Boolean).join(".");
					if (Object.hasOwn(entry, "legacyWebhook")) changes.push(`Removed ${legacyPath} legacy listener keys; ${pathPrefix}.legacyWebhook is already configured.`);
					else if (accountId && root?.legacyWebhook === false) changes.push(`Removed ${legacyPath} legacy listener keys; ${prefix}.legacyWebhook: false keeps this account's inherited listener disabled.`);
					else {
						next.legacyWebhook = {
							port,
							...host !== void 0 ? { host } : {}
						};
						changes.push(`Moved ${legacyPath} listener settings to ${pathPrefix}.legacyWebhook. Point the external callback or reverse proxy at the Gateway port and webhook path, verify delivery, then set legacyWebhook: false to disable legacy forwarding.`);
					}
					const updated = params.webhookKey ? { ...listener } : next;
					delete updated[portKey];
					if (hostKey) delete updated[hostKey];
					if (params.webhookKey) {
						if (Object.keys(updated).length) next[params.webhookKey] = updated;
						else delete next[params.webhookKey];
					}
					return {
						entry: next,
						changed: true
					};
				}
			});
		}
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/runtime-doctor-migrations
var runtime_doctor_migrations_exports = /* @__PURE__ */ __exportAll({ createLegacyWebhookListenerDoctorContract: () => createLegacyWebhookListenerDoctorContract });
import * as import_openclaw_plugin_sdk_runtime_doctor_migrations from "openclaw/plugin-sdk/runtime-doctor-migrations";
__reExport(runtime_doctor_migrations_exports, import_openclaw_plugin_sdk_runtime_doctor_migrations);
//#endregion
//#region extensions/slack/src/streaming-compat.ts
function resolveSlackStreamingMode(params = {}) {
	const mode = normalizeLowercaseStringOrEmpty(getChannelStreamingConfigObject(params)?.mode ?? params.streaming);
	if (mode === "off" || mode === "partial" || mode === "block" || mode === "progress") return mode;
	switch (normalizeLowercaseStringOrEmpty(params.streamMode)) {
		case "append": return "block";
		case "status_final": return "progress";
		case "replace": return "partial";
		default: return typeof params.streaming === "boolean" ? params.streaming ? "partial" : "off" : "progress";
	}
}
function resolveSlackNativeStreaming(params = {}) {
	return resolveChannelStreamingNativeTransport(params) ?? (typeof params.nativeStreaming === "boolean" ? params.nativeStreaming : typeof params.streaming === "boolean" ? params.streaming : true);
}
//#endregion
//#region extensions/slack/src/doctor-contract.ts
const streamingAliasMigration = (0, runtime_doctor_migrations_exports.defineChannelAliasMigration)({
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
const dmReplyModeMigration = (0, runtime_doctor_migrations_exports.defineKeyMoveMigration)({
	from: ["dm", "replyToMode"],
	to: ["replyToModeByChatType", "direct"]
});
const threadMentionPolicyMigration = (0, runtime_doctor_migrations_exports.defineKeyMoveMigration)({
	from: ["thread", "requireExplicitMention"],
	to: ["implicitMentions", "threadParticipation"],
	map: (value) => typeof value === "boolean" ? { value: !value } : null,
	pruneEmptySource: true,
	movedMessage: ({ sourcePath, targetPath, mappedValue }) => `Moved ${sourcePath} → ${targetPath} (${String(mappedValue)}).`
});
function hasInteractiveRepliesCapability(value) {
	const capabilities = (0, runtime_doctor_migrations_exports.asObjectRecord)(value)?.capabilities;
	if (Array.isArray(capabilities)) return capabilities.some((entry) => typeof entry === "string" && entry.trim().toLowerCase() === "interactivereplies");
	const capabilitiesRecord = (0, runtime_doctor_migrations_exports.asObjectRecord)(capabilities);
	return Boolean(capabilitiesRecord && (Object.keys(capabilitiesRecord).length === 0 || Object.hasOwn(capabilitiesRecord, "interactiveReplies")));
}
function hasEnterpriseOrgInstall(value) {
	return Object.hasOwn((0, runtime_doctor_migrations_exports.asObjectRecord)(value) ?? {}, "enterpriseOrgInstall");
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
		const capabilitiesRecord = (0, runtime_doctor_migrations_exports.asObjectRecord)(capabilities);
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
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, hasEnterpriseOrgInstall)
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
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, hasInteractiveRepliesCapability)
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
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, dmReplyModeMigration.hasLegacy)
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
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, threadMentionPolicyMigration.hasLegacy)
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
	return {
		entry: thread.entry,
		changed: retiredInteractiveReplies.changed || dm.changed || thread.changed
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const retired = (0, runtime_doctor_migrations_exports.stripRetiredChannelKeys)({
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
	return (0, runtime_doctor_migrations_exports.normalizeChannelConfigEntries)({
		cfg: aliases.config,
		channelId: "slack",
		changes,
		normalizeEntry: normalizeSlackEntry
	});
}
//#endregion
export { normalizeCompatibilityConfig as n, runtime_doctor_migrations_exports as r, legacyConfigRules as t };
