import "./paths-BJV7vkaX.js";
import { l as shouldLogVerbose, o as logVerbose } from "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./thinking-BYwvlJ3S.js";
import "./agent-scope-BJ-A8vSB.js";
import "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./dock-Comp2gJ6.js";
import "./message-channel-DQep2kbh.js";
import "./plugins-C0pOwMtf.js";
import "./sessions-HiopsrVS.js";
import { d as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-D-V7O4fK.js";
import "./image-C-Zw0oaM.js";
import "./models-config-BEpJKGMR.js";
import "./pi-embedded-helpers-CVA4fQUQ.js";
import "./sandbox-CoGpmvXW.js";
import "./tool-catalog-DE9Q8xiB.js";
import "./chrome-tXGLEhE5.js";
import "./tailscale-Cb--SHEE.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./auth-32YLiXaF.js";
import "./server-context-CpZq_krd.js";
import "./frontmatter-BNgDHC-E.js";
import "./env-overrides-Dsk7pgN4.js";
import "./path-alias-guards-C7fuvY3a.js";
import "./skills-C12GSy0o.js";
import "./paths-Ds-H_wj4.js";
import "./redact-BuHVrHGi.js";
import "./errors-lgWRdCyT.js";
import "./fs-safe-ByGe0qYX.js";
import "./proxy-env-Ce3yMsLG.js";
import "./image-ops-CVsEAuQZ.js";
import "./store-BCGAnbcB.js";
import "./ports-BFNjqMt6.js";
import "./trash-kZ6uvO8p.js";
import "./server-middleware-Cel4wU9c.js";
import "./accounts-82c5Tbng.js";
import "./accounts-CvmhVLij.js";
import "./logging-T8IDvLh2.js";
import "./accounts-CoSHDMaf.js";
import "./paths-CrgdtCHd.js";
import "./chat-envelope-DyXtQzoD.js";
import "./tool-images-BkNIdbzz.js";
import "./tool-display-C6selhgh.js";
import "./fetch-guard-NL9A0Guz.js";
import "./api-key-rotation-DwF99nSy.js";
import "./local-roots-C8vp-IWv.js";
import "./model-catalog-W6R6I2rN.js";
import "./proxy-fetch-WnO0dYIx.js";
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
