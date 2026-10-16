import { a as defineChannelAliasMigration, b as hasLegacyAccountStreamingAliases, k as asNullableRecord, o as stripRetiredChannelKeys, x as normalizeChannelAccounts } from "./runtime-doctor-migrations-BhouWAUC.js";
import "./src-BRYbjtIr.js";
function realtimeVoiceActivationNameWordCount(value) {
	return Array.from(value.matchAll(/[a-z0-9]+/gi)).length;
}
/** Extract the supported leading activation-name prefix from a longer phrase. */
function normalizeRealtimeVoiceActivationNamePrefix(value, maxWords = 2) {
	const words = Array.from(value.matchAll(/[a-z0-9]+/gi), (match) => match[0]);
	if (words.length === 0) return;
	return words.slice(0, maxWords).join(" ");
}
function isSupportedRealtimeVoiceActivationName(value, maxWords = 2) {
	const wordCount = realtimeVoiceActivationNameWordCount(value);
	return wordCount >= 1 && wordCount <= maxWords;
}
//#endregion
//#region extensions/discord/src/doctor-contract.ts
const RETIRED_TUNING_KEYS = /* @__PURE__ */ new Set([
	"gatewayInfoTimeoutMs",
	"gatewayReadyTimeoutMs",
	"gatewayRuntimeReadyTimeoutMs",
	"eventQueue",
	"retry"
]);
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "discord",
	streaming: {
		defaultMode: "off",
		includePreviewChunk: true
	},
	accountStreamingReplacesRoot: true,
	dm: {
		root: true,
		accounts: true
	}
});
function hasUnsupportedRealtimeWakeNamesInVoice(value) {
	const voice = asNullableRecord(value);
	const wakeNames = asNullableRecord(voice?.realtime)?.wakeNames;
	return Array.isArray(wakeNames) ? wakeNames.length === 0 || wakeNames.some((wakeName) => typeof wakeName === "string" && !isSupportedRealtimeVoiceActivationName(wakeName)) : false;
}
function hasUnsupportedDiscordRealtimeWakeNames(value) {
	return hasUnsupportedRealtimeWakeNamesInVoice(asNullableRecord(value)?.voice);
}
function normalizeUnsupportedRealtimeWakeNames(entry, pathPrefix, changes) {
	const voice = asNullableRecord(entry.voice);
	const realtime = asNullableRecord(voice?.realtime);
	const wakeNames = realtime?.wakeNames;
	if (!voice || !realtime || !Array.isArray(wakeNames)) return {
		entry,
		changed: false
	};
	let normalized = 0;
	let removed = 0;
	const nextWakeNames = wakeNames.flatMap((wakeName) => {
		if (typeof wakeName !== "string" || isSupportedRealtimeVoiceActivationName(wakeName)) return [wakeName];
		const nextWakeName = normalizeRealtimeVoiceActivationNamePrefix(wakeName);
		if (!nextWakeName) {
			removed += 1;
			return [];
		}
		normalized += 1;
		return [nextWakeName];
	});
	if (wakeNames.length > 0 && normalized === 0 && removed === 0) return {
		entry,
		changed: false
	};
	const dedupedWakeNames = Array.from(new Set(nextWakeNames));
	if (wakeNames.length === 0) changes.push(`Removed empty ${pathPrefix}.voice.realtime.wakeNames; unset wake names use the default agent/OpenClaw fallback.`);
	const nextRealtime = { ...realtime };
	if (dedupedWakeNames.length > 0) nextRealtime.wakeNames = dedupedWakeNames;
	else delete nextRealtime.wakeNames;
	if (normalized > 0) changes.push(`Shortened ${normalized} unsupported ${pathPrefix}.voice.realtime.wakeNames entries to one or two words.`);
	if (removed > 0) changes.push(`Removed ${removed} unsupported ${pathPrefix}.voice.realtime.wakeNames entries with no usable words.`);
	return {
		entry: {
			...entry,
			voice: {
				...voice,
				realtime: nextRealtime
			}
		},
		changed: true
	};
}
const legacyConfigRules = [
	{
		path: ["channels", "discord"],
		message: "channels.discord.voice.realtime.wakeNames entries longer than two words are unsupported; use one- or two-word activation names. Run \"openclaw doctor --fix\".",
		match: hasUnsupportedDiscordRealtimeWakeNames
	},
	{
		path: [
			"channels",
			"discord",
			"accounts"
		],
		message: "channels.discord.accounts.<id>.voice.realtime.wakeNames entries longer than two words are unsupported; use one- or two-word activation names. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasUnsupportedDiscordRealtimeWakeNames)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg,
		changes
	});
	const tuningKnobs = stripRetiredChannelKeys({
		cfg: aliases.config,
		channelId: "discord",
		keys: RETIRED_TUNING_KEYS,
		scope: "root-and-accounts"
	});
	const rawEntry = asNullableRecord(tuningKnobs.config.channels?.discord);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	let updated = rawEntry;
	let changed = tuningKnobs.config !== cfg;
	if (tuningKnobs.changed) changes.push("Removed retired Discord tuning knobs.");
	const accounts = normalizeChannelAccounts({
		entry: updated,
		pathPrefix: "channels.discord",
		changes,
		normalizeAccount: ({ account, pathPrefix, changes: accountChanges }) => normalizeUnsupportedRealtimeWakeNames(account, pathPrefix, accountChanges)
	});
	updated = accounts.entry;
	changed = changed || accounts.changed;
	const normalizedWakeNames = normalizeUnsupportedRealtimeWakeNames(updated, "channels.discord", changes);
	updated = normalizedWakeNames.entry;
	changed = changed || normalizedWakeNames.changed;
	if (!changed) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...tuningKnobs.config,
			channels: {
				...tuningKnobs.config.channels,
				discord: updated
			}
		},
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
