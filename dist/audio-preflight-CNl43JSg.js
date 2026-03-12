import "./paths-C-KFRgN3.js";
import "./paths-DkxwiA8g.js";
import { f as logVerbose, h as shouldLogVerbose } from "./subsystem-CZTbUHS8.js";
import "./workspace-Cd7X7wJE.js";
import "./logger-Bza9HxLB.js";
import "./model-selection-BpzcW6do.js";
import "./github-copilot-token-8N63GdbE.js";
import "./boolean-C7Ct_klp.js";
import "./proxy-env-D49LgOsT.js";
import "./frontmatter-DiMBhUTH.js";
import "./image-DMxFPUco.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription, v as isAudioAttachment } from "./audio-transcription-runner-CVOeTiYX.js";
import "./fetch-DaO4TUeC.js";
import "./fetch-guard-DYY4RUUK.js";
import "./api-key-rotation-CkUVZIcp.js";
import "./proxy-fetch-DezimVDd.js";
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
