//#region extensions/discord/src/voice/output-activity.ts
function resolveDiscordOutputAudioDelta(previous, sourceAudioBytes) {
	const sinkAudioBytes = Math.floor((previous.sourceAudioBytes + sourceAudioBytes) / 2) * 8 - previous.sinkAudioBytes;
	return {
		audioMs: sinkAudioBytes / 192,
		sourceAudioBytes,
		sinkAudioBytes
	};
}
//#endregion
export { resolveDiscordOutputAudioDelta as t };
