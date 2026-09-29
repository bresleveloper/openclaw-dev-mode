import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { r as extensionForMime } from "../../mime-1zBUMwu6.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { h as resolveProviderOperationTimeoutMs, r as createProviderOperationDeadline } from "../../shared-BLFkM12I.mjs";
import "../../media-mime-D8SxWw0k.mjs";
import { a as resolveApiKeyForProvider } from "../../provider-auth-runtime-CYwZwijM.mjs";
import "../../provider-http-Dn9NddwC.mjs";
import { r as generatedMusicAssetFromBase64 } from "../../music-generation-RVbN53b4.mjs";
import { n as resolveGoogleGenerativeAiApiOrigin } from "../../provider-policy-BWkzSuhk.mjs";
import { p as createGoogleMusicGenerationProviderMetadata } from "../../generation-provider-metadata-B7IbWlRp.mjs";
import "../../api-hbN_YyfC.mjs";
import { n as toStandardGoogleProviderBase64 } from "../../base64-m7hzKALO.mjs";
import { t as createGoogleGenAI } from "../../google-genai-runtime-I16xkIJE.mjs";
//#region extensions/google/music-generation-provider.ts
const DEFAULT_TIMEOUT_MS = 18e4;
function resolveConfiguredGoogleMusicBaseUrl(req) {
	const configured = normalizeOptionalString(req.cfg?.models?.providers?.google?.baseUrl);
	return configured ? resolveGoogleGenerativeAiApiOrigin(configured) : void 0;
}
function buildMusicPrompt(req) {
	const parts = [req.prompt.trim()];
	const lyrics = normalizeOptionalString(req.lyrics);
	if (req.instrumental === true) parts.push("Instrumental only. No vocals, no sung lyrics, no spoken word.");
	if (lyrics) parts.push(`Lyrics:\n${lyrics}`);
	return parts.join("\n\n");
}
function resolveSupportedFormats(model) {
	return model === "lyria-3-pro-preview" ? ["mp3", "wav"] : ["mp3"];
}
function resolveTrackFileName(params) {
	const ext = extensionForMime(params.mimeType)?.replace(/^\./u, "") || (params.model === "lyria-3-pro-preview" ? "wav" : "mp3");
	return `track-${params.index + 1}.${ext}`;
}
function extractTracks(params) {
	const lyrics = [];
	const tracks = [];
	for (const candidate of params.payload.candidates ?? []) for (const part of candidate.content?.parts ?? []) {
		const text = normalizeOptionalString(part.text);
		if (text) {
			lyrics.push(text);
			continue;
		}
		const inline = part.inlineData ?? part.inline_data;
		const data = normalizeOptionalString(inline?.data);
		if (!data) continue;
		const mimeType = normalizeOptionalString(inline?.mimeType) || normalizeOptionalString(inline?.mime_type) || "audio/mpeg";
		const standardAudio = toStandardGoogleProviderBase64(data);
		if (!standardAudio) throw new Error("Generated music asset contains malformed base64 audio data");
		tracks.push(generatedMusicAssetFromBase64({
			base64: standardAudio,
			mimeType,
			fileName: resolveTrackFileName({
				index: tracks.length,
				mimeType,
				model: params.model
			})
		}));
	}
	return {
		tracks,
		lyrics
	};
}
function resolveTerminalNoAudioReason(payload) {
	const blockReason = normalizeOptionalString(payload.promptFeedback?.blockReason);
	if (blockReason && !blockReason.endsWith("_UNSPECIFIED")) return `prompt blocked (${blockReason})`;
	for (const candidate of payload.candidates ?? []) {
		const finishReason = normalizeOptionalString(candidate.finishReason);
		if (finishReason && finishReason !== "STOP" && finishReason !== "FINISH_REASON_UNSPECIFIED") return `generation stopped (${finishReason})`;
	}
}
function buildGoogleMusicGenerationProvider() {
	return {
		...createGoogleMusicGenerationProviderMetadata(),
		async generateMusic(req) {
			if ((req.inputImages?.length ?? 0) > 10) throw new Error(`Google music generation supports at most 10 reference images.`);
			const auth = await resolveApiKeyForProvider({
				provider: "google",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!auth.apiKey) throw new Error("Google API key missing");
			const model = normalizeOptionalString(req.model) || "lyria-3-clip-preview";
			if (req.format) {
				const supportedFormats = resolveSupportedFormats(model);
				if (!supportedFormats.includes(req.format)) throw new Error(`Google music generation model ${model} supports ${supportedFormats.join(", ")} output.`);
			}
			const configuredBaseUrl = resolveConfiguredGoogleMusicBaseUrl(req);
			const operationTimeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;
			const deadline = createProviderOperationDeadline({
				timeoutMs: operationTimeoutMs,
				label: "Google music generation"
			});
			let generated;
			for (let attempt = 0; attempt < 2; attempt += 1) {
				const response = await createGoogleGenAI({
					apiKey: auth.apiKey,
					httpOptions: {
						...configuredBaseUrl ? { baseUrl: configuredBaseUrl } : {},
						timeout: resolveProviderOperationTimeoutMs({
							deadline,
							defaultTimeoutMs: operationTimeoutMs
						})
					}
				}).models.generateContent({
					model,
					contents: [{ text: buildMusicPrompt(req) }, ...(req.inputImages ?? []).map((image) => ({ inlineData: {
						mimeType: normalizeOptionalString(image.mimeType) || "image/png",
						data: image.buffer?.toString("base64") ?? ""
					} }))],
					config: { responseModalities: ["AUDIO", "TEXT"] }
				});
				generated = extractTracks({
					payload: response,
					model
				});
				if (generated.tracks.length > 0) break;
				const terminalReason = resolveTerminalNoAudioReason(response);
				if (terminalReason) throw new Error(`Google music generation returned no audio: ${terminalReason}`);
			}
			if (!generated || generated.tracks.length === 0) throw new Error("Google music generation response missing audio data");
			const { tracks, lyrics } = generated;
			return {
				tracks,
				...lyrics.length > 0 ? { lyrics } : {},
				model,
				metadata: {
					inputImageCount: req.inputImages?.length ?? 0,
					instrumental: req.instrumental === true,
					...normalizeOptionalString(req.lyrics) ? { requestedLyrics: true } : {},
					...req.format ? { requestedFormat: req.format } : {}
				}
			};
		}
	};
}
//#endregion
export { buildGoogleMusicGenerationProvider };
