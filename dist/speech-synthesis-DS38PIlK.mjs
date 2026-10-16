import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { a as assertSupportedGoogleTtsModel, i as GOOGLE_TTS_SAMPLE_RATE, o as isGoogleInteractionsTtsModel } from "./speech-models-C0BKgLl9.mjs";
import { r as splitGoogleTtsDialogue, t as buildGoogleInteractionsTtsBody } from "./speech-dialogue-CfuQrPCc.mjs";
//#region extensions/google/speech-synthesis.ts
const GOOGLE_TTS_CHANNELS = 1;
const GOOGLE_TTS_BITS_PER_SAMPLE = 16;
var GoogleTtsRetryableError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "GoogleTtsRetryableError";
	}
};
function isGoogleTtsRetryableError(err) {
	if (err instanceof GoogleTtsRetryableError) return true;
	if (!(err instanceof Error)) return false;
	if (err.name === "AbortError") return true;
	const message = err.message.toLowerCase();
	return message.includes("aborted") || message.includes("timeout") || message.includes("fetch failed") || message.includes("network");
}
function composeGoogleTtsText(params) {
	return [
		normalizeOptionalString(params.audioProfile),
		normalizeOptionalString(params.speakerName) ? `Speaker name: ${params.speakerName}` : void 0,
		params.text
	].filter((part) => part !== void 0).join("\n\n");
}
function normalizePromptSectionText(value) {
	const trimmed = normalizeOptionalString(value?.replace(/\r\n?/g, "\n"));
	if (!trimmed) return;
	return trimmed.replace(/\p{Cc}/gu, (char) => "	\n\r".includes(char) || char.charCodeAt(0) > 127 ? char : "");
}
function isOpenClawGoogleAudioProfilePrompt(text) {
	return text.includes("# AUDIO PROFILE:") && text.includes("### TRANSCRIPT") && text.startsWith("Synthesize speech from the TRANSCRIPT section only.");
}
function renderGoogleAudioProfilePrompt(params) {
	const transcript = params.text.replace(/\r\n?/g, "\n").trim();
	const personaPrompt = normalizePromptSectionText(params.personaPrompt);
	const label = normalizePromptSectionText(params.persona?.label) ?? normalizePromptSectionText(params.persona?.id);
	const sections = [[
		"Synthesize speech from the TRANSCRIPT section only. Use the other sections only",
		"as performance direction. Do not read section titles, notes, labels, or",
		"configuration aloud."
	].join("\n")];
	if (label) sections.push(`# AUDIO PROFILE: ${label}`);
	if (personaPrompt) sections.push([
		"### DIRECTOR'S NOTES",
		"Provider notes:",
		personaPrompt
	].join("\n"));
	sections.push(["### TRANSCRIPT", transcript].join("\n"));
	return sections.join("\n\n");
}
function wrapPcm16MonoToWav(pcm, sampleRate = GOOGLE_TTS_SAMPLE_RATE) {
	const byteRate = sampleRate * GOOGLE_TTS_CHANNELS * (GOOGLE_TTS_BITS_PER_SAMPLE / 8);
	const blockAlign = GOOGLE_TTS_CHANNELS * (GOOGLE_TTS_BITS_PER_SAMPLE / 8);
	const header = Buffer.alloc(44);
	header.write("RIFF", 0, "ascii");
	header.writeUInt32LE(36 + pcm.length, 4);
	header.write("WAVE", 8, "ascii");
	header.write("fmt ", 12, "ascii");
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(GOOGLE_TTS_CHANNELS, 22);
	header.writeUInt32LE(sampleRate, 24);
	header.writeUInt32LE(byteRate, 28);
	header.writeUInt16LE(blockAlign, 32);
	header.writeUInt16LE(GOOGLE_TTS_BITS_PER_SAMPLE, 34);
	header.write("data", 36, "ascii");
	header.writeUInt32LE(pcm.length, 40);
	return Buffer.concat([header, pcm]);
}
function extractOpenClawGoogleAudioProfileTranscript(text) {
	if (!isOpenClawGoogleAudioProfilePrompt(text)) return;
	const match = /\n\n### TRANSCRIPT(?:\n|$)/u.exec(text);
	if (!match) return;
	return text.slice(match.index + match[0].length).trim() || void 0;
}
function prepareGoogleInteractionsSynthesis(text) {
	const transcript = extractOpenClawGoogleAudioProfileTranscript(text);
	return transcript ? { text: transcript } : void 0;
}
function stripWavContainerToPcm(audio) {
	if (audio.subarray(0, 4).toString("ascii") !== "RIFF" || audio.subarray(8, 12).toString("ascii") !== "WAVE") return audio;
	let offset = 12;
	while (offset + 8 <= audio.length) {
		const chunkId = audio.subarray(offset, offset + 4).toString("ascii");
		const chunkSize = audio.readUInt32LE(offset + 4);
		const dataStart = offset + 8;
		if (chunkId === "data") return audio.subarray(dataStart, Math.min(dataStart + chunkSize, audio.length));
		offset = dataStart + chunkSize + chunkSize % 2;
	}
	throw new Error("Google TTS WAV response missing PCM data");
}
function readGoogleInteractionsAudioData(payload) {
	const direct = normalizeOptionalString(payload.output_audio?.data ?? payload.outputAudio?.data);
	if (direct) return direct;
	for (const step of payload.steps ?? []) for (const block of step.content ?? []) {
		const mime = block.mimeType ?? block.mime_type;
		if (block.type !== "audio" && !mime?.startsWith("audio/")) continue;
		const data = normalizeOptionalString(block.data);
		if (data) return data;
	}
}
async function synthesizeGoogleTtsPcmOnce(params) {
	assertSupportedGoogleTtsModel(params.model);
	const interactions = isGoogleInteractionsTtsModel(params.model);
	if (!interactions && params.speakers && splitGoogleTtsDialogue(params.text, params.speakers)) throw new Error("Google TTS multi-speaker dialogue requires gemini-3.8-flash-tts or gemini-3.8-flash-lite-tts.");
	const { assertOkOrThrowProviderError, postJsonRequest, readProviderJsonResponse } = await import("./plugin-sdk/provider-http.js");
	const { resolveGoogleGenerativeAiHttpRequestConfig } = await import("./extensions/google/http-request.js");
	const { canonicalizeGoogleProviderBase64 } = await import("./extensions/google/base64.js");
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveGoogleGenerativeAiHttpRequestConfig({
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		request: params.request,
		capability: "audio",
		transport: "http"
	});
	const { response: res, release } = await postJsonRequest({
		url: interactions ? `${baseUrl}/interactions` : `${baseUrl}/models/${params.model}:generateContent`,
		headers,
		body: interactions ? buildGoogleInteractionsTtsBody(params) : {
			contents: [{
				role: "user",
				parts: [{ text: composeGoogleTtsText({
					text: params.text,
					audioProfile: params.audioProfile,
					speakerName: params.speakerName
				}) }]
			}],
			generationConfig: {
				responseModalities: ["AUDIO"],
				speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: params.voiceName } } }
			}
		},
		timeoutMs: params.timeoutMs,
		fetchFn: fetch,
		pinDns: false,
		allowPrivateNetwork,
		dispatcherPolicy
	});
	try {
		if (!res.ok) try {
			await assertOkOrThrowProviderError(res, "Google TTS failed");
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (res.status >= 500 && res.status < 600) throw new GoogleTtsRetryableError(message);
			throw err;
		}
		try {
			const payload = await readProviderJsonResponse(res, "Google TTS response");
			const encoded = interactions ? readGoogleInteractionsAudioData(payload) : payload.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => normalizeOptionalString((part.inlineData ?? part.inline_data)?.data)).find((data) => data !== void 0);
			if (!encoded) throw new Error("Google TTS response missing audio data");
			const canonicalAudio = canonicalizeGoogleProviderBase64(encoded);
			if (!canonicalAudio) throw new Error("Google TTS response returned malformed base64 audio data");
			return stripWavContainerToPcm(Buffer.from(canonicalAudio, "base64"));
		} catch (err) {
			throw new GoogleTtsRetryableError(err instanceof Error ? err.message : String(err));
		}
	} finally {
		await release();
	}
}
//#endregion
export { synthesizeGoogleTtsPcmOnce as a, renderGoogleAudioProfilePrompt as i, isOpenClawGoogleAudioProfilePrompt as n, wrapPcm16MonoToWav as o, prepareGoogleInteractionsSynthesis as r, isGoogleTtsRetryableError as t };
