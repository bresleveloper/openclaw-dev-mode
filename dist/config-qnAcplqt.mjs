import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
//#region src/transcripts/config.ts
const DEFAULT_TRANSCRIPTS_MAX_UTTERANCES = 2e3;
function resolveAutoStart(raw) {
	if (!Array.isArray(raw)) return [];
	return raw.map((entry) => {
		const config = entry && typeof entry === "object" ? entry : {};
		const providerId = normalizeOptionalString(config.providerId);
		if (!providerId) return;
		return {
			providerId,
			whenOccupied: config.whenOccupied === true,
			sessionId: config.whenOccupied === true ? void 0 : normalizeOptionalString(config.sessionId),
			title: normalizeOptionalString(config.title),
			accountId: normalizeOptionalString(config.accountId),
			guildId: normalizeOptionalString(config.guildId),
			channelId: normalizeOptionalString(config.channelId),
			meetingUrl: normalizeOptionalString(config.meetingUrl)
		};
	}).filter((entry) => entry !== void 0);
}
/** Normalize raw transcripts config into runtime settings. */
function resolveTranscriptsConfig(raw) {
	const config = raw && typeof raw === "object" ? raw : {};
	return {
		enabled: config.enabled !== false,
		maxUtterances: DEFAULT_TRANSCRIPTS_MAX_UTTERANCES,
		autoStart: resolveAutoStart(config.autoStart)
	};
}
//#endregion
export { resolveTranscriptsConfig as t };
