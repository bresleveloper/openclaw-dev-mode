//#region src/talk/output-activity-tracker.ts
/** Create a fresh output activity tracker for a realtime voice session. */
function createRealtimeVoiceOutputActivityTracker(options = {}) {
	const now = options.now ?? Date.now;
	let audioMs = 0;
	let chunks = 0;
	let sourceAudioBytes = 0;
	let sinkAudioBytes = 0;
	let playbackStarted = false;
	let streamEnding = false;
	let lastAudioAt;
	let playbackStartedAt;
	const snapshot = () => ({
		audioMs,
		chunks,
		sourceAudioBytes,
		sinkAudioBytes,
		playbackStarted,
		streamEnding,
		...lastAudioAt === void 0 ? {} : { lastAudioAt },
		...playbackStartedAt === void 0 ? {} : { playbackStartedAt }
	});
	return {
		markStreamOpened() {
			streamEnding = false;
			playbackStarted = false;
			playbackStartedAt = void 0;
			lastAudioAt = void 0;
		},
		markStreamEnding() {
			streamEnding = true;
		},
		markPlaybackStarted() {
			if (playbackStarted) return;
			playbackStarted = true;
			playbackStartedAt = now();
		},
		markAudio(delta) {
			audioMs += Math.max(0, delta.audioMs ?? 0);
			sourceAudioBytes += Math.max(0, delta.sourceAudioBytes ?? 0);
			sinkAudioBytes += Math.max(0, delta.sinkAudioBytes ?? 0);
			chunks += 1;
			lastAudioAt = now();
		},
		reset() {
			audioMs = 0;
			chunks = 0;
			sourceAudioBytes = 0;
			sinkAudioBytes = 0;
			playbackStarted = false;
			streamEnding = false;
			lastAudioAt = void 0;
			playbackStartedAt = void 0;
		},
		isActive(sinkActive = false) {
			return sinkActive || chunks > 0;
		},
		isInterruptible(sinkActive = false) {
			return sinkActive || chunks > 0 || audioMs > 0;
		},
		elapsedPlaybackMs() {
			return playbackStartedAt === void 0 ? 0 : now() - playbackStartedAt;
		},
		playbackWatchdogDelayMs({ marginMs, minMs = 1e3 }) {
			if (playbackStartedAt === void 0 || audioMs <= 0) return;
			return Math.max(minMs, audioMs - (now() - playbackStartedAt) + marginMs);
		},
		snapshot
	};
}
//#endregion
export { createRealtimeVoiceOutputActivityTracker as t };
