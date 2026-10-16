import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asFiniteNumber, asOptionalRecord, filterStringRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
const DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT = "raw-8khz-8bit-mono-mulaw";
const DEFAULT_AZURE_SPEECH_MAX_BYTES = 16777216;
const DEFAULT_AZURE_SPEECH_VOICE_LIST_TIMEOUT_MS = 3e4;
function normalizeAzureSpeechBaseUrl(params) {
	const configured = normalizeOptionalString(params.baseUrl) ?? normalizeOptionalString(params.endpoint);
	if (configured) return configured.replace(/\/+$/, "").replace(/\/cognitiveservices\/v1$/i, "");
	const region = normalizeOptionalString(params.region);
	return region ? `https://${region}.tts.speech.microsoft.com` : void 0;
}
function azureSpeechUrl(params) {
	const baseUrl = normalizeAzureSpeechBaseUrl(params);
	if (!baseUrl) throw new Error("Azure Speech region or endpoint missing");
	return `${baseUrl}${params.path}`;
}
function escapeXmlText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeXmlAttr(value) {
	return escapeXmlText(value).replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function buildAzureSpeechSsml(params) {
	return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${escapeXmlAttr(normalizeOptionalString(params.lang) ?? "en-US")}"><voice name="${escapeXmlAttr(params.voice)}">${escapeXmlText(params.text)}</voice></speak>`;
}
function inferAzureSpeechFileExtension(outputFormat) {
	const normalized = outputFormat.toLowerCase();
	if (normalized.includes("mp3")) return ".mp3";
	if (normalized.startsWith("ogg-")) return ".ogg";
	if (normalized.startsWith("webm-")) return ".webm";
	if (normalized.startsWith("riff-")) return ".wav";
	if (normalized.startsWith("raw-")) return ".pcm";
	if (normalized.startsWith("amr-")) return ".amr";
	return ".audio";
}
function isAzureSpeechVoiceCompatible(outputFormat) {
	const normalized = outputFormat.toLowerCase();
	return normalized.startsWith("ogg-") && normalized.includes("opus");
}
function readAzureVoiceTagStrings(value) {
	return Array.isArray(value) ? value.filter((entry) => normalizeOptionalString(entry) !== void 0) : void 0;
}
function formatVoiceDescription(tailoredScenarios, personalities) {
	const parts = [...tailoredScenarios ?? [], ...personalities ?? []];
	return parts.length > 0 ? parts.join(", ") : void 0;
}
function isDeprecatedVoice(entry) {
	if (entry.IsDeprecated === true) return true;
	if (typeof entry.IsDeprecated === "string" && entry.IsDeprecated.toLowerCase() === "true") return true;
	const status = normalizeOptionalString(entry.Status)?.toLowerCase();
	return status === "deprecated" || status === "retired" || status === "disabled";
}
async function listAzureSpeechVoices(params) {
	const url = azureSpeechUrl({
		...params,
		path: "/cognitiveservices/voices/list"
	});
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "GET",
			headers: { "Ocp-Apim-Subscription-Key": params.apiKey }
		},
		timeoutMs: params.timeoutMs ?? DEFAULT_AZURE_SPEECH_VOICE_LIST_TIMEOUT_MS,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(url),
		auditContext: "azure-speech.voices"
	});
	try {
		await assertOkOrThrowProviderError(response, "Azure Speech voices API error");
		const voices = await readProviderJsonResponse(response, "azure-speech.voices");
		return Array.isArray(voices) ? voices.flatMap((value) => {
			const voice = asOptionalRecord(value);
			const id = normalizeOptionalString(voice?.ShortName);
			if (!voice || !id || isDeprecatedVoice(voice)) return [];
			const voiceTag = asOptionalRecord(voice.VoiceTag);
			const tailoredScenarios = readAzureVoiceTagStrings(voiceTag?.TailoredScenarios);
			const personalities = readAzureVoiceTagStrings(voiceTag?.VoicePersonalities);
			return [{
				id,
				name: normalizeOptionalString(voice.DisplayName) ?? normalizeOptionalString(voice.LocalName),
				description: formatVoiceDescription(tailoredScenarios, personalities),
				locale: normalizeOptionalString(voice.Locale),
				gender: normalizeOptionalString(voice.Gender),
				personalities
			}];
		}) : [];
	} finally {
		await release();
	}
}
async function azureSpeechTTS(params) {
	const voice = normalizeOptionalString(params.voice) ?? "en-US-JennyNeural";
	const outputFormat = normalizeOptionalString(params.outputFormat) ?? "audio-24khz-48kbitrate-mono-mp3";
	const url = azureSpeechUrl({
		...params,
		path: "/cognitiveservices/v1"
	});
	const { assertOkOrThrowProviderError, readProviderBinaryResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/ssml+xml",
				"Ocp-Apim-Subscription-Key": params.apiKey,
				"X-Microsoft-OutputFormat": outputFormat,
				"User-Agent": "OpenClaw"
			},
			body: buildAzureSpeechSsml({
				text: params.text,
				voice,
				lang: params.lang
			})
		},
		timeoutMs: params.timeoutMs,
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(url),
		auditContext: "azure-speech.tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "Azure Speech TTS API error");
		return await readProviderBinaryResponse(response, "Azure Speech TTS API error", "audio", {
			maxBytes: params.maxBytes ?? DEFAULT_AZURE_SPEECH_MAX_BYTES,
			onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Azure Speech TTS audio response exceeds ${maxBytes} bytes`)
		});
	} finally {
		await release();
	}
}
//#endregion
//#region extensions/azure-speech/speech-provider.ts
function readAzureSpeechEnvApiKey() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_KEY) ?? normalizeOptionalString(process.env.AZURE_SPEECH_API_KEY) ?? normalizeOptionalString(process.env.SPEECH_KEY);
}
function readAzureSpeechEnvRegion() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_REGION) ?? normalizeOptionalString(process.env.SPEECH_REGION);
}
function resolveAzureSpeechConfigRecord(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	return asOptionalRecord(providers?.["azure-speech"]) ?? asOptionalRecord(providers?.azure) ?? asOptionalRecord(rawConfig["azure-speech"]) ?? asOptionalRecord(rawConfig.azure);
}
function normalizeAzureSpeechProviderConfig(rawConfig) {
	const raw = resolveAzureSpeechConfigRecord(rawConfig);
	const region = normalizeOptionalString(raw?.region) ?? readAzureSpeechEnvRegion();
	const endpoint = normalizeOptionalString(raw?.endpoint) ?? normalizeOptionalString(process.env.AZURE_SPEECH_ENDPOINT);
	const baseUrl = normalizeAzureSpeechBaseUrl({
		baseUrl: normalizeOptionalString(raw?.baseUrl),
		endpoint,
		region
	});
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.azure-speech.apiKey"
		}),
		region,
		endpoint,
		baseUrl,
		voice: normalizeOptionalString(raw?.voice ?? raw?.voiceId) ?? "en-US-JennyNeural",
		lang: normalizeOptionalString(raw?.lang ?? raw?.languageCode) ?? "en-US",
		outputFormat: normalizeOptionalString(raw?.outputFormat) ?? "audio-24khz-48kbitrate-mono-mp3",
		voiceNoteOutputFormat: normalizeOptionalString(raw?.voiceNoteOutputFormat) ?? "ogg-24khz-16bit-mono-opus",
		timeoutMs: asFiniteNumber(raw?.timeoutMs)
	};
}
function readAzureSpeechProviderConfig(config) {
	const defaults = normalizeAzureSpeechProviderConfig({});
	const region = normalizeOptionalString(config.region) ?? defaults.region;
	const endpoint = normalizeOptionalString(config.endpoint) ?? defaults.endpoint;
	const baseUrl = normalizeAzureSpeechBaseUrl({
		baseUrl: normalizeOptionalString(config.baseUrl) ?? defaults.baseUrl,
		endpoint,
		region
	});
	return {
		apiKey: normalizeOptionalString(config.apiKey) ?? defaults.apiKey,
		region,
		endpoint,
		baseUrl,
		voice: normalizeOptionalString(config.voice ?? config.voiceId) ?? defaults.voice,
		lang: normalizeOptionalString(config.lang ?? config.languageCode) ?? defaults.lang,
		outputFormat: normalizeOptionalString(config.outputFormat) ?? defaults.outputFormat,
		voiceNoteOutputFormat: normalizeOptionalString(config.voiceNoteOutputFormat) ?? defaults.voiceNoteOutputFormat,
		timeoutMs: asFiniteNumber(config.timeoutMs) ?? defaults.timeoutMs
	};
}
function parseDirectiveToken(ctx) {
	const key = [
		"voice",
		"voiceid",
		"voice_id",
		"azure_voice",
		"azurevoice",
		"azure_speech_voice"
	].includes(ctx.key) ? "voice" : [
		"lang",
		"language",
		"language_code",
		"languagecode",
		"azure_lang",
		"azure_language"
	].includes(ctx.key) ? "lang" : [
		"output_format",
		"outputformat",
		"azure_format",
		"azure_output_format"
	].includes(ctx.key) ? "outputFormat" : void 0;
	if (!key) return { handled: false };
	return (key === "voice" ? ctx.policy.allowVoice : ctx.policy.allowVoiceSettings) ? {
		handled: true,
		overrides: {
			...ctx.currentOverrides,
			[key]: ctx.value
		}
	} : { handled: true };
}
function resolveApiKey(...candidates) {
	return resolveSpeechProviderApiKey(...candidates, readAzureSpeechEnvApiKey());
}
async function resolveAzureSpeechTtsRequest(req, outputFormatOverride) {
	const config = readAzureSpeechProviderConfig(req.providerConfig);
	const overrides = req.providerOverrides;
	const voice = normalizeOptionalString(overrides?.voice ?? overrides?.voiceId);
	const lang = normalizeOptionalString(overrides?.lang ?? overrides?.languageCode);
	const outputFormat = normalizeOptionalString(overrides?.outputFormat);
	const apiKey = resolveApiKey(config.apiKey);
	if (!apiKey) throw new Error("Azure Speech API key missing");
	const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
	return {
		text: req.text,
		apiKey,
		baseUrl: config.baseUrl,
		endpoint: config.endpoint,
		region: config.region,
		voice: voice ?? config.voice,
		lang: lang ?? config.lang,
		outputFormat: outputFormatOverride ?? outputFormat ?? (req.target === "voice-note" ? config.voiceNoteOutputFormat : config.outputFormat),
		timeoutMs: config.timeoutMs ?? req.timeoutMs,
		maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
	};
}
function buildAzureSpeechProvider() {
	return {
		id: "azure-speech",
		label: "Azure Speech",
		aliases: ["azure"],
		autoSelectOrder: 30,
		resolveConfig: ({ rawConfig }) => normalizeAzureSpeechProviderConfig(rawConfig),
		parseDirectiveToken,
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeAzureSpeechProviderConfig(baseTtsConfig);
			const apiKey = talkProviderConfig.apiKey === void 0 ? void 0 : normalizeResolvedSecretInputString({
				value: talkProviderConfig.apiKey,
				path: "talk.providers.azure-speech.apiKey"
			});
			const region = normalizeOptionalString(talkProviderConfig.region);
			const endpoint = normalizeOptionalString(talkProviderConfig.endpoint ?? talkProviderConfig.baseUrl);
			const baseUrl = normalizeAzureSpeechBaseUrl({
				baseUrl: normalizeOptionalString(talkProviderConfig.baseUrl),
				endpoint,
				region: region ?? base.region
			});
			return {
				...base,
				...filterStringRecord({
					apiKey,
					region,
					endpoint,
					baseUrl,
					voice: normalizeOptionalString(talkProviderConfig.voiceId),
					lang: normalizeOptionalString(talkProviderConfig.languageCode),
					outputFormat: normalizeOptionalString(talkProviderConfig.outputFormat)
				})
			};
		},
		resolveTalkOverrides: ({ params }) => filterStringRecord({
			voice: normalizeOptionalString(params.voiceId),
			lang: normalizeOptionalString(params.languageCode),
			outputFormat: normalizeOptionalString(params.outputFormat)
		}) ?? {},
		listVoices: async (req) => {
			const config = req.providerConfig ? readAzureSpeechProviderConfig(req.providerConfig) : void 0;
			const apiKey = resolveApiKey(req.apiKey, config?.apiKey);
			if (!apiKey) throw new Error("Azure Speech API key missing");
			return listAzureSpeechVoices({
				apiKey,
				baseUrl: req.baseUrl ?? config?.baseUrl,
				endpoint: config?.endpoint,
				region: config?.region ?? readAzureSpeechEnvRegion(),
				timeoutMs: config?.timeoutMs ?? req.timeoutMs
			});
		},
		isConfigured: ({ providerConfig }) => {
			const config = readAzureSpeechProviderConfig(providerConfig);
			return Boolean(resolveApiKey(config.apiKey) && (config.baseUrl || config.region || config.endpoint));
		},
		synthesize: async (req) => {
			const params = await resolveAzureSpeechTtsRequest(req);
			const audioBuffer = await azureSpeechTTS(params);
			const outputFormat = params.outputFormat;
			return {
				audioBuffer,
				outputFormat,
				fileExtension: inferAzureSpeechFileExtension(outputFormat),
				voiceCompatible: isAzureSpeechVoiceCompatible(outputFormat)
			};
		},
		synthesizeTelephony: async (req) => {
			return {
				audioBuffer: await azureSpeechTTS(await resolveAzureSpeechTtsRequest({
					...req,
					target: "telephony"
				}, DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT)),
				outputFormat: DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT,
				sampleRate: 8e3
			};
		}
	};
}
//#endregion
//#region extensions/azure-speech/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildAzureSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
