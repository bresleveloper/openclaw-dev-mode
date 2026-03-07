import "./run-with-concurrency-CagkUg6Q.js";
import "./model-auth-B04m8qGj.js";
import { B as shouldLogVerbose, R as logVerbose } from "./logger-BBZgPX6j.js";
import "./paths-akVZbnot.js";
import "./github-copilot-token-CjEwwa4e.js";
import "./thinking-BI0IBIGa.js";
import "./ssrf-C2awOn_i.js";
import "./fetch-guard-DszwxhzV.js";
import "./accounts-CgCfsoQ4.js";
import "./plugins-DaSsW_u1.js";
import "./image-ops-ruHe4odZ.js";
import "./pi-embedded-helpers-BupgJUdk.js";
import "./accounts-Xc09ip3g.js";
import "./accounts-CrNsyKCh.js";
import "./paths-Cfsz2AMI.js";
import { i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, p as isAudioAttachment, t as runAudioTranscription } from "./audio-transcription-runner-DgzruCqa.js";
import "./image-BKUmaJb8.js";
import "./chrome-Bfjt9LC3.js";
import "./skills-DKf-tH5e.js";
import "./path-alias-guards-vW-Cy1pv.js";
import "./redact-_TAQ2z7y.js";
import "./errors-rkr2phrh.js";
import "./fs-safe-CSlW5-1l.js";
import "./store-BHBj7GL1.js";
import "./tool-images-CW2xzz3T.js";
import "./api-key-rotation-uqYfSpIU.js";
import "./local-roots-E9f6zSQ0.js";
import "./proxy-fetch-CEoqeTJ9.js";
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
