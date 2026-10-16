import { t as runtime_doctor_migrations_exports } from "./runtime-doctor-migrations-BPV-R4G9.mjs";
import { isSupportedRealtimeVoiceActivationName, normalizeRealtimeVoiceActivationNamePrefix } from "openclaw/plugin-sdk/realtime-voice-activation";
//#region extensions/discord/src/doctor-contract.ts
const RETIRED_TUNING_KEYS = /* @__PURE__ */ new Set([
	"gatewayInfoTimeoutMs",
	"gatewayReadyTimeoutMs",
	"gatewayRuntimeReadyTimeoutMs",
	"eventQueue",
	"retry"
]);
const streamingAliasMigration = (0, runtime_doctor_migrations_exports.defineChannelAliasMigration)({
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
	const voice = (0, runtime_doctor_migrations_exports.asObjectRecord)(value);
	const wakeNames = (0, runtime_doctor_migrations_exports.asObjectRecord)(voice?.realtime)?.wakeNames;
	return Array.isArray(wakeNames) ? wakeNames.length === 0 || wakeNames.some((wakeName) => typeof wakeName === "string" && !isSupportedRealtimeVoiceActivationName(wakeName)) : false;
}
function hasUnsupportedDiscordRealtimeWakeNames(value) {
	return hasUnsupportedRealtimeWakeNamesInVoice((0, runtime_doctor_migrations_exports.asObjectRecord)(value)?.voice);
}
function normalizeUnsupportedRealtimeWakeNames(entry, pathPrefix, changes) {
	const voice = (0, runtime_doctor_migrations_exports.asObjectRecord)(entry.voice);
	const realtime = (0, runtime_doctor_migrations_exports.asObjectRecord)(voice?.realtime);
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
		match: (value) => (0, runtime_doctor_migrations_exports.hasLegacyAccountStreamingAliases)(value, hasUnsupportedDiscordRealtimeWakeNames)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const aliases = streamingAliasMigration.normalizeChannelConfig({
		cfg,
		changes
	});
	const tuningKnobs = (0, runtime_doctor_migrations_exports.stripRetiredChannelKeys)({
		cfg: aliases.config,
		channelId: "discord",
		keys: RETIRED_TUNING_KEYS,
		scope: "root-and-accounts"
	});
	const rawEntry = (0, runtime_doctor_migrations_exports.asObjectRecord)(tuningKnobs.config.channels?.discord);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	let updated = rawEntry;
	let changed = tuningKnobs.config !== cfg;
	if (tuningKnobs.changed) changes.push("Removed retired Discord tuning knobs.");
	const accounts = (0, runtime_doctor_migrations_exports.normalizeChannelAccounts)({
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
export { normalizeCompatibilityConfig as n, legacyConfigRules as t };
