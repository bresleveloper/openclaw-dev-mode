import "./run-with-concurrency-C4XHHPgL.js";
import "./paths-DkxwiA8g.js";
import { d as logVerbose, m as shouldLogVerbose } from "./subsystem-CJA8wzR-.js";
import "./workspace-CfdKlr4m.js";
import "./logger-BbAT83Qh.js";
import "./model-selection-CjLMEx1O.js";
import "./github-copilot-token-8N63GdbE.js";
import "./legacy-names-DOSIC6ex.js";
import "./thinking-Da7Taxu9.js";
import "./accounts-DCQcJO-i.js";
import "./plugins-DOPwZyoX.js";
import "./accounts-DzbTLw_0.js";
import "./image-ops-BIl9UeOZ.js";
import "./pi-embedded-helpers-Dxu6LHG0.js";
import "./chrome-COZ7YCsN.js";
import "./frontmatter-BeGrEokt.js";
import "./skills-DNYmQKiw.js";
import "./path-alias-guards-DS7ydm_S.js";
import "./redact-42EdcDhY.js";
import "./errors-Dw6HjS62.js";
import "./fs-safe-CemWTMJt.js";
import "./proxy-env-B6RCnAA_.js";
import "./store-BQSQNPdy.js";
import "./accounts-pgrv1Qkh.js";
import "./paths-gKA8fewC.js";
import "./tool-images-Dg_vf6bo.js";
import "./image-CFUHso_v.js";
import { g as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-D_nujbp8.js";
import "./fetch-BDmqlILw.js";
import "./fetch-guard-C6jQTGKD.js";
import "./api-key-rotation-CPMSw0JH.js";
import "./proxy-fetch-DByX8_eQ.js";
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
