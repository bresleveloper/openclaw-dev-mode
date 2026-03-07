import { l as shouldLogVerbose, o as logVerbose } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-gyYFUuWS.js";
import "./agent-scope-Cp0IkEKB.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./dock-DXYDVeNl.js";
import "./accounts-CCmToVwr.js";
import "./plugins-BlxnRrWB.js";
import "./logging-DE_Gv8EN.js";
import "./accounts-D9cGmSBd.js";
import "./image-ops-ChuMRt4V.js";
import "./message-channel-CBxyiPG1.js";
import "./pi-embedded-helpers-B5Fkq6oo.js";
import "./sandbox-D8HChyNU.js";
import "./tool-catalog-CFg6jrp9.js";
import "./chrome-C9-sDY0x.js";
import "./tailscale-DUAiX-L-.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./auth-yZ8XbKKh.js";
import "./server-context-3Ig2duxc.js";
import "./frontmatter-BXR2CPEl.js";
import "./env-overrides-0y0M3S6P.js";
import "./path-alias-guards-CNI693yM.js";
import "./skills-BNw7KbKP.js";
import "./paths-SRstzZpm.js";
import "./redact-DWAErDjv.js";
import "./errors-LFbAe3gQ.js";
import "./fs-safe-DmQzjIXC.js";
import "./proxy-env-BMOu-Lae.js";
import "./store-CEVnidlh.js";
import "./ports-B4ivsR6D.js";
import "./trash-sFfWaYz5.js";
import "./server-middleware-CNN87dgY.js";
import "./sessions-BzabF1Rs.js";
import "./accounts-B9MZJeQz.js";
import "./paths-m-ckvfYo.js";
import "./chat-envelope-BCgyDMmT.js";
import "./tool-images-DCz3azK8.js";
import "./thinking-WUzZvd36.js";
import "./models-config-ZJ7RlkpC.js";
import "./model-catalog-Cht1UAhe.js";
import "./fetch-BhsN1WTe.js";
import { _ as isAudioAttachment, i as normalizeMediaAttachments, o as resolveMediaAttachmentLocalRoots, t as runAudioTranscription } from "./audio-transcription-runner-Vpl4r9ni.js";
import "./fetch-guard-NqpaSn2l.js";
import "./image-DP_4KiO7.js";
import "./tool-display-Cg06RH6E.js";
import "./api-key-rotation-CgROanRn.js";
import "./proxy-fetch-D31pCVr7.js";
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
