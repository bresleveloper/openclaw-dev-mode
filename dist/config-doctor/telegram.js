import { a as asNullableRecord } from "./string-coerce-Dyy0qgLy.js";
import { c as normalizeChannelAccounts, s as defineChannelAliasMigration, x as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-8XPPImoy.js";
//#region extensions/telegram/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "telegram",
	streaming: {
		defaultMode: "partial",
		includePreviewChunk: true
	}
});
const RETIRED_TUNING_KEYS = /* @__PURE__ */ new Set([
	"timeoutSeconds",
	"mediaGroupFlushMs",
	"pollingStallThresholdMs",
	"retry",
	"errorCooldownMs"
]);
function stripRetiredTelegramTuning(entry, scope) {
	let changed = false;
	const updated = { ...entry };
	for (const key of scope === "channel" || scope === "account" ? RETIRED_TUNING_KEYS : ["errorCooldownMs"]) if (Object.hasOwn(updated, key)) {
		delete updated[key];
		changed = true;
	}
	const maps = scope === "topic" ? [] : scope === "chat" ? ["topics"] : ["groups", "direct"];
	if (scope === "channel") maps.push("accounts");
	for (const key of maps) {
		const entries = asNullableRecord(entry[key]);
		if (!entries) continue;
		const nextEntries = { ...entries };
		for (const [id, value] of Object.entries(entries)) {
			const child = asNullableRecord(value);
			if (!child) continue;
			const next = stripRetiredTelegramTuning(child, key === "accounts" ? "account" : key === "topics" ? "topic" : "chat");
			if (next.changed) {
				nextEntries[id] = next.entry;
				updated[key] = nextEntries;
				changed = true;
			}
		}
	}
	return {
		entry: changed ? updated : entry,
		changed
	};
}
function hasRetiredTelegramDmConfig(value) {
	const entry = asNullableRecord(value);
	if (!entry) return false;
	if (asNullableRecord(entry.dm)) return true;
	return Object.values(asNullableRecord(entry.direct) ?? {}).some((direct) => asNullableRecord(direct)?.threadReplies !== void 0);
}
function hasRetiredTelegramNativeDraftConfig(value) {
	const entry = asNullableRecord(value);
	const streaming = asNullableRecord(entry?.streaming);
	const preview = asNullableRecord(streaming?.preview);
	return preview?.nativeToolProgress !== void 0 || preview?.nativeToolProgressAllowFrom !== void 0;
}
function hasRetiredTelegramGroupHistoryContextConfig(value) {
	return asNullableRecord(value)?.includeGroupHistoryContext !== void 0;
}
function removeRetiredTelegramDmConfig(params) {
	let updated = params.entry;
	let changed = false;
	const dm = asNullableRecord(updated.dm);
	if (dm) {
		const { dm: _ignored, ...rest } = updated;
		updated = rest;
		params.changes.push(dm.threadReplies === void 0 ? `Removed ${params.pathPrefix}.dm.` : `Removed ${params.pathPrefix}.dm.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`);
		changed = true;
	}
	const direct = asNullableRecord(updated.direct);
	if (direct) {
		let directChanged = false;
		const nextDirect = { ...direct };
		for (const [chatId, rawDirectConfig] of Object.entries(direct)) {
			const directConfig = asNullableRecord(rawDirectConfig);
			if (!directConfig || directConfig.threadReplies === void 0) continue;
			const nextDirectConfig = { ...directConfig };
			delete nextDirectConfig.threadReplies;
			nextDirect[chatId] = nextDirectConfig;
			params.changes.push(`Removed ${params.pathPrefix}.direct.${chatId}.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`);
			directChanged = true;
		}
		if (directChanged) {
			updated = {
				...updated,
				direct: nextDirect
			};
			changed = true;
		}
	}
	return {
		entry: updated,
		changed
	};
}
function removeRetiredTelegramNativeDraftConfig(params) {
	const streaming = asNullableRecord(params.entry.streaming);
	const preview = asNullableRecord(streaming?.preview);
	if (!streaming || !preview || preview.nativeToolProgress === void 0 && preview.nativeToolProgressAllowFrom === void 0) return {
		entry: params.entry,
		changed: false
	};
	const nextPreview = { ...preview };
	delete nextPreview.nativeToolProgress;
	delete nextPreview.nativeToolProgressAllowFrom;
	const nextStreaming = { ...streaming };
	if (Object.keys(nextPreview).length > 0) nextStreaming.preview = nextPreview;
	else delete nextStreaming.preview;
	const updated = Object.keys(nextStreaming).length > 0 ? {
		...params.entry,
		streaming: nextStreaming
	} : Object.fromEntries(Object.entries(params.entry).filter(([key]) => key !== "streaming"));
	params.changes.push(`Removed ${params.pathPrefix}.streaming.preview native draft keys; Telegram previews now use rich send/edit messages.`);
	return {
		entry: updated,
		changed: true
	};
}
function removeRetiredTelegramGroupHistoryContextConfig(params) {
	if (params.entry.includeGroupHistoryContext === void 0) return {
		entry: params.entry,
		changed: false
	};
	const { includeGroupHistoryContext, ...rest } = params.entry;
	let updated = includeGroupHistoryContext === "none" ? {
		...rest,
		historyLimit: 0
	} : rest;
	if (includeGroupHistoryContext === "recent" && params.preserveRecentHistoryLimit !== void 0 && updated.historyLimit === void 0) updated = {
		...updated,
		historyLimit: params.preserveRecentHistoryLimit
	};
	const historyLimitNote = includeGroupHistoryContext === "none" ? " and set historyLimit to 0" : includeGroupHistoryContext === "recent" && params.preserveRecentHistoryLimit !== void 0 && params.entry.historyLimit === void 0 ? ` and set historyLimit to ${params.preserveRecentHistoryLimit}` : "";
	params.changes.push(`Removed ${params.pathPrefix}.includeGroupHistoryContext${historyLimitNote}; Telegram group history is always on for groups and bounded by historyLimit.`);
	return {
		entry: updated,
		changed: true
	};
}
function resolveCompatibleDefaultGroupEntry(section) {
	const existingGroups = section.groups;
	if (existingGroups !== void 0 && !asNullableRecord(existingGroups)) return null;
	const groups = asNullableRecord(existingGroups) ?? {};
	const existingEntry = groups["*"];
	if (existingEntry !== void 0 && !asNullableRecord(existingEntry)) return null;
	return {
		groups,
		entry: asNullableRecord(existingEntry) ?? {}
	};
}
const legacyConfigRules = [
	{
		path: [
			"channels",
			"telegram",
			"groupMentionsOnly"
		],
		message: "channels.telegram.groupMentionsOnly was removed; use channels.telegram.groups.\"*\".requireMention instead. Run \"openclaw doctor --fix\"."
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramDmConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramDmConfig)
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramNativeDraftConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramNativeDraftConfig)
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramGroupHistoryContextConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramGroupHistoryContextConfig)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg,
		changes
	});
	const rawEntry = asNullableRecord(aliases.config.channels?.telegram);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	const tuningKnobs = stripRetiredTelegramTuning(rawEntry, "channel");
	let updated = tuningKnobs.entry;
	let changed = aliases.config !== cfg || tuningKnobs.changed;
	if (tuningKnobs.changed) changes.push("Removed retired Telegram tuning knobs.");
	const rootGroupHistoryContextMode = updated.includeGroupHistoryContext;
	const rootGroupHistoryLimitBeforeMigration = typeof updated.historyLimit === "number" ? updated.historyLimit : cfg.messages?.groupChat?.historyLimit ?? 50;
	const removedThreadReplies = removeRetiredTelegramDmConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedThreadReplies.entry;
	changed = changed || removedThreadReplies.changed;
	const removedNativeDraft = removeRetiredTelegramNativeDraftConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedNativeDraft.entry;
	changed = changed || removedNativeDraft.changed;
	const removedGroupHistoryContext = removeRetiredTelegramGroupHistoryContextConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedGroupHistoryContext.entry;
	changed = changed || removedGroupHistoryContext.changed;
	if (updated.groupMentionsOnly !== void 0) {
		const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(updated);
		if (!defaultGroupEntry) changes.push("Skipped channels.telegram.groupMentionsOnly migration because channels.telegram.groups already has an incompatible shape; fix remaining issues manually.");
		else {
			const { groups, entry } = defaultGroupEntry;
			if (entry.requireMention === void 0) {
				entry.requireMention = updated.groupMentionsOnly;
				groups["*"] = entry;
				updated = {
					...updated,
					groups
				};
				changes.push("Moved channels.telegram.groupMentionsOnly → channels.telegram.groups.\"*\".requireMention.");
			} else changes.push("Removed channels.telegram.groupMentionsOnly (channels.telegram.groups.\"*\" already set).");
			const { groupMentionsOnly: _ignored, ...rest } = updated;
			updated = rest;
			changed = true;
		}
	}
	const accounts = normalizeChannelAccounts({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes,
		normalizeAccount: ({ account, pathPrefix, changes: accountChanges }) => {
			const dm = removeRetiredTelegramDmConfig({
				entry: account,
				pathPrefix,
				changes: accountChanges
			});
			const nativeDraft = removeRetiredTelegramNativeDraftConfig({
				entry: dm.entry,
				pathPrefix,
				changes: accountChanges
			});
			const history = removeRetiredTelegramGroupHistoryContextConfig({
				entry: nativeDraft.entry,
				pathPrefix,
				changes: accountChanges,
				...rootGroupHistoryContextMode === "none" ? { preserveRecentHistoryLimit: rootGroupHistoryLimitBeforeMigration } : {}
			});
			return {
				entry: history.entry,
				changed: dm.changed || nativeDraft.changed || history.changed
			};
		}
	});
	updated = accounts.entry;
	changed = changed || accounts.changed;
	if (!changed && changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...aliases.config,
			channels: {
				...aliases.config.channels,
				telegram: updated
			}
		},
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
