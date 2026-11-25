import { asNullableRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/google-meet/src/config-compat.ts
function hasLegacyGoogleRealtimeProvider(value) {
	const realtime = asNullableRecord(value);
	if (!realtime || normalizeOptionalLowercaseString(realtime.provider) !== "google") return false;
	return !Object.hasOwn(realtime, "voiceProvider") || !Object.hasOwn(realtime, "transcriptionProvider");
}
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"google-meet",
		"config",
		"realtime"
	],
	message: "plugins.entries.google-meet.config.realtime.provider=\"google\" is legacy for Gemini Live bidi mode; use realtime.voiceProvider=\"google\" and realtime.transcriptionProvider=\"openai\". Run \"openclaw doctor --fix\".",
	match: hasLegacyGoogleRealtimeProvider
}];
function normalizeCompatibilityConfig({ cfg: config }) {
	const rawEntry = asNullableRecord(config.plugins?.entries?.["google-meet"]);
	const rawPluginConfig = asNullableRecord(rawEntry?.config);
	const rawRealtime = asNullableRecord(rawPluginConfig?.realtime);
	if (!rawRealtime || !hasLegacyGoogleRealtimeProvider(rawRealtime)) return {
		config,
		changes: []
	};
	const nextRealtime = {
		...rawRealtime,
		provider: "openai"
	};
	if (!Object.hasOwn(nextRealtime, "transcriptionProvider")) nextRealtime.transcriptionProvider = "openai";
	if (!Object.hasOwn(nextRealtime, "voiceProvider")) nextRealtime.voiceProvider = "google";
	return {
		config: {
			...config,
			plugins: {
				...config.plugins,
				entries: {
					...config.plugins?.entries,
					"google-meet": {
						...rawEntry,
						config: {
							...rawPluginConfig,
							realtime: nextRealtime
						}
					}
				}
			}
		},
		changes: ["Moved Google Meet legacy realtime.provider=\"google\" intent to realtime.voiceProvider=\"google\" and realtime.transcriptionProvider=\"openai\"."]
	};
}
export { legacyConfigRules, normalizeCompatibilityConfig };
