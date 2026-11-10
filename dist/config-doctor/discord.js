import { P as asNullableRecord, T as normalizeChannelAccounts, a as defineChannelAliasMigration, o as stripRetiredChannelKeys, w as hasLegacyAccountStreamingAliases } from "./runtime-doctor-migrations-Bq3PkBbD.js";
import "./src-RA80L32l.js";
//#region src/talk/activation-name.ts
const REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS = 2;
/** Extract the supported leading activation-name prefix from a longer phrase. */
function normalizeRealtimeVoiceActivationNamePrefix(value, maxWords = REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS) {
	const words = Array.from(value.matchAll(/[a-z0-9]+/gi), (match) => match[0]);
	if (words.length === 0) return;
	return words.slice(0, maxWords).join(" ");
}
function isSupportedRealtimeVoiceActivationName(value, maxWords = REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS) {
	const wordCount = Array.from(value.matchAll(/[a-z0-9]+/gi)).length;
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
		defaultMode: "progress",
		includePreviewChunk: true
	},
	accountStreamingReplacesRoot: true,
	dm: {
		root: true,
		accounts: true
	}
});
function hasUnsupportedDiscordRealtimeWakeNames(value) {
	const voice = asNullableRecord(asNullableRecord(value)?.voice);
	const wakeNames = asNullableRecord(voice?.realtime)?.wakeNames;
	return Array.isArray(wakeNames) ? wakeNames.length === 0 || wakeNames.some((wakeName) => typeof wakeName === "string" && !isSupportedRealtimeVoiceActivationName(wakeName)) : false;
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
	if (tuningKnobs.changed) changes.push("Removed retired Discord tuning knobs.");
	const accounts = normalizeChannelAccounts({
		entry: rawEntry,
		pathPrefix: "channels.discord",
		changes,
		normalizeAccount: ({ account, pathPrefix, changes: accountChanges }) => normalizeUnsupportedRealtimeWakeNames(account, pathPrefix, accountChanges)
	});
	const normalizedWakeNames = normalizeUnsupportedRealtimeWakeNames(accounts.entry, "channels.discord", changes);
	if (tuningKnobs.config === cfg && !accounts.changed && !normalizedWakeNames.changed) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...tuningKnobs.config,
			channels: {
				...tuningKnobs.config.channels,
				discord: normalizedWakeNames.entry
			}
		},
		changes
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
