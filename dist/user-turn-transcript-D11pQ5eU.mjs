import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
//#region src/system-agent/user-turn-transcript.ts
/** System-agent runtimes persist caller-owned transcripts without a durable target. */
function createSystemAgentUserTurnRecorder(prompt) {
	const recorder = createUserTurnTranscriptRecorder({
		input: { text: prompt },
		target: () => void 0
	});
	delete recorder.captureModelPromptProjection;
	return recorder;
}
//#endregion
export { createSystemAgentUserTurnRecorder as t };
