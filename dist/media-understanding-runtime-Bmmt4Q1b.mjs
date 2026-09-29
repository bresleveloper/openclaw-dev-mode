import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as logVerbose } from "./globals-QODkv80i.mjs";
import { n as sendTranscriptEcho } from "./echo-transcript-buuj5Mkr.mjs";
import "./runtime-6t44WwNq.mjs";
//#region src/plugin-sdk/media-understanding-runtime.ts
const DEFAULT_ECHO_TRANSCRIPT_FORMAT = "📝 \"{transcript}\"";
const loadAudioPreflightRuntime = createLazyRuntimeModule(() => import("./audio-preflight-D6DWqMfG.mjs"));
function formatAudioTranscriptForAgent(transcript) {
	return `[Audio transcript (machine-generated, untrusted)]: ${JSON.stringify(transcript)}`;
}
/** Creates shared preflight transcription and deferred-echo behavior for a channel. */
function createChannelPreflightAudio(params) {
	const deferTranscriptEcho = params.deferTranscriptEcho ?? true;
	const suppress = (cfg) => {
		if (!deferTranscriptEcho) return cfg;
		const audio = cfg.tools?.media?.audio;
		if (!audio?.echoTranscript) return cfg;
		return {
			...cfg,
			tools: {
				...cfg.tools,
				media: {
					...cfg.tools?.media,
					audio: {
						...audio,
						echoTranscript: false
					}
				}
			}
		};
	};
	const format = (transcript, formatTemplate) => {
		return formatTemplate.replace("{transcript}", () => transcript);
	};
	return {
		isAudio: params.isAudio,
		suppress,
		format,
		async resolve(resolveParams) {
			if (resolveParams.abortSignal?.aborted) return;
			try {
				const transcribeFirstAudio = params.transcribeFirstAudio ?? (await loadAudioPreflightRuntime()).transcribeFirstAudio;
				if (resolveParams.abortSignal?.aborted) return;
				const transcript = await transcribeFirstAudio({
					...resolveParams.request,
					cfg: suppress(resolveParams.request.cfg)
				});
				return resolveParams.abortSignal?.aborted ? void 0 : transcript;
			} catch (err) {
				logVerbose(`${params.channel}: audio preflight transcription failed: ${String(err)}`);
				return;
			}
		},
		async send(sendParams) {
			const audio = sendParams.cfg.tools?.media?.audio;
			if (!audio?.echoTranscript) return;
			await (params.sendTranscriptEcho ?? sendTranscriptEcho)({
				ctx: {
					Provider: params.channel,
					Surface: params.channel,
					OriginatingChannel: params.channel,
					OriginatingTo: sendParams.originatingTo,
					AccountId: sendParams.accountId,
					MessageThreadId: sendParams.messageThreadId
				},
				cfg: sendParams.cfg,
				transcript: sendParams.transcript,
				format: audio.echoFormat ?? DEFAULT_ECHO_TRANSCRIPT_FORMAT,
				logSuccess: false,
				failureLogPrefix: `${params.channel}: audio transcript echo failed`
			});
		}
	};
}
//#endregion
export { formatAudioTranscriptForAgent as n, createChannelPreflightAudio as t };
