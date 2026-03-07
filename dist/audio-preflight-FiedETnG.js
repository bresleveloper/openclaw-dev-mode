import "./run-with-concurrency-DbqKAYVa.js";
import "./paths-GBpjI3o0.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-CkNFbaGM.js";
import "./model-selection-DznAVfkT.js";
import "./github-copilot-token-PBo8Vdmp.js";
import "./thinking-2FUfxibY.js";
import "./accounts-BlHDa7EL.js";
import "./plugins-No9izpwe.js";
import "./accounts-Bmg9avoV.js";
import "./image-ops-A98XpKpY.js";
import "./pi-embedded-helpers-CdqR77am.js";
import "./chrome-Dcrt35X_.js";
import "./skills-BpjtGVAL.js";
import "./path-alias-guards-Cd_AwXTT.js";
import "./redact-Dhk5xXoX.js";
import "./errors-C7DAw-ep.js";
import "./fs-safe-DHzPLRKX.js";
import "./proxy-env-DQ-j4IBU.js";
import "./store-yUbrRiuu.js";
import "./accounts-DVAJLKFu.js";
import "./paths-BhqobGNC.js";
import "./tool-images-DVuRtm5X.js";
import "./image-DdQH9EFt.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-C3NhHWTx.js";
import "./fetch-D4Fz2WQK.js";
import "./fetch-guard-DkwqBBRz.js";
import "./api-key-rotation-D32RNcUC.js";
import "./proxy-fetch-D-7DrjOS.js";
//#region src/media-understanding/audio-preflight.ts
/**
* Transcribes the first audio attachment BEFORE mention checking.
* This allows voice notes to be processed in group chats with requireMention: true.
* Returns the transcript or undefined if transcription fails or no audio is found.
*/
async function transcribeFirstAudio(params) {
	const { ctx, cfg } = params;
	const audioConfig = cfg.tools?.media?.audio;
	if (!audioConfig || audioConfig.enabled === false) return;
	const attachments = normalizeMediaAttachments(ctx);
	if (!attachments || attachments.length === 0) return;
	const firstAudio = attachments.find((att) => att && isAudioAttachment(att) && !att.alreadyTranscribed);
	if (!firstAudio) return;
	if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribing attachment ${firstAudio.index} for mention check`);
	try {
		const { transcript } = await runAudioTranscription({
			ctx,
			cfg,
			attachments,
			agentDir: params.agentDir,
			providers: params.providers,
			activeModel: params.activeModel,
			localPathRoots: resolveMediaAttachmentLocalRoots({
				cfg,
				ctx
			})
		});
		if (!transcript) return;
		firstAudio.alreadyTranscribed = true;
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcribed ${transcript.length} chars from attachment ${firstAudio.index}`);
		return transcript;
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`audio-preflight: transcription failed: ${String(err)}`);
		return;
	}
}
//#endregion
export { transcribeFirstAudio };
