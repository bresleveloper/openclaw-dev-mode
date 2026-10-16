import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./history-limit-CbktwEI_.mjs";
import { a as mergeTelegramAccountConfig, n as listTelegramAccountIds } from "./account-selection-DV4XVSJR.mjs";
import { o as normalizeChannelAccounts } from "./legacy-private-network-migration-BUrNiN1z.mjs";
import { o as createLegacyWebhookListenerDoctorContract, u as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-4UZBewWQ.mjs";
import { n as resolveTelegramGatewayWebhookUrl, r as resolveTelegramWebhookPathConflict } from "./webhook-route-DWBIkdIz.mjs";
//#region extensions/telegram/src/doctor-contract.ts
const webhookListenerMigration = createLegacyWebhookListenerDoctorContract({
	channelKey: "telegram",
	defaultPort: 8787,
	defaultHost: "127.0.0.1"
});
const { historicalWebhookListener } = webhookListenerMigration;
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
function hasRetiredTelegramGroupHistoryContextConfig(value) {
	return asNullableRecord(value)?.includeGroupHistoryContext !== void 0;
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
const legacyConfigRules = [
	...webhookListenerMigration.legacyConfigRules,
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
	}
];
function normalizeHistoricalWebhookConfig({ cfg }) {
	const historicalWebhookAccountIds = cfg.channels?.telegram?.enabled === false ? [] : listTelegramAccountIds(cfg).filter((accountId) => {
		const account = mergeTelegramAccountConfig(cfg, accountId);
		if (account.enabled === false || !account.webhookUrl?.trim()) return false;
		const path = account.webhookPath ?? "/telegram-webhook";
		const gatewayUrl = resolveTelegramGatewayWebhookUrl(cfg, path);
		return !gatewayUrl || URL.parse(account.webhookUrl)?.href !== gatewayUrl || resolveTelegramWebhookPathConflict(path) !== void 0;
	});
	return {
		...webhookListenerMigration.normalizeCompatibilityConfig({ cfg }),
		historicalWebhookAccountIds
	};
}
function normalizeCompatibilityConfig({ cfg }) {
	const webhook = normalizeHistoricalWebhookConfig({ cfg });
	const { historicalWebhookAccountIds } = webhook;
	const changes = [...webhook.changes];
	const rawEntry = asNullableRecord(webhook.config.channels?.telegram);
	if (!rawEntry) return {
		config: cfg,
		changes: [],
		historicalWebhookAccountIds
	};
	const tuningKnobs = stripRetiredTelegramTuning(rawEntry, "channel");
	let updated = tuningKnobs.entry;
	let changed = webhook.config !== cfg || tuningKnobs.changed;
	if (tuningKnobs.changed) changes.push("Removed retired Telegram tuning knobs.");
	const rootGroupHistoryContextMode = updated.includeGroupHistoryContext;
	const rootGroupHistoryLimitBeforeMigration = typeof updated.historyLimit === "number" ? updated.historyLimit : cfg.messages?.groupChat?.historyLimit ?? 50;
	const retired = removeRetiredTelegramGroupHistoryContextConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = retired.entry;
	changed = changed || retired.changed;
	const accounts = normalizeChannelAccounts({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes,
		normalizeAccount: ({ account, pathPrefix, changes: accountChanges }) => removeRetiredTelegramGroupHistoryContextConfig({
			entry: account,
			pathPrefix,
			changes: accountChanges,
			...rootGroupHistoryContextMode === "none" ? { preserveRecentHistoryLimit: rootGroupHistoryLimitBeforeMigration } : {}
		})
	});
	updated = accounts.entry;
	changed = changed || accounts.changed;
	if (!changed && changes.length === 0) return {
		config: cfg,
		changes: [],
		historicalWebhookAccountIds
	};
	return {
		config: {
			...webhook.config,
			channels: {
				...webhook.config.channels,
				telegram: updated
			}
		},
		changes,
		historicalWebhookAccountIds
	};
}
//#endregion
export { normalizeHistoricalWebhookConfig as i, legacyConfigRules as n, normalizeCompatibilityConfig as r, historicalWebhookListener as t };
