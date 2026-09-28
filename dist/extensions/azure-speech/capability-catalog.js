import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asFiniteNumber, asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
/** Default telephony output format. */
const DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT = "raw-8khz-8bit-mono-mulaw";
const DEFAULT_AZURE_SPEECH_MAX_BYTES = 16777216;
const DEFAULT_AZURE_SPEECH_VOICE_LIST_TIMEOUT_MS = 3e4;
/** Resolve and normalize the Azure Speech base URL from endpoint or region. */
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
/** Build escaped SSML for one Azure Speech synthesis request. */
function buildAzureSpeechSsml(params) {
	return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${escapeXmlAttr(normalizeOptionalString(params.lang) ?? "en-US")}"><voice name="${escapeXmlAttr(params.voice)}">${escapeXmlText(params.text)}</voice></speak>`;
}
/** Infer the generated audio file extension from Azure output format. */
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
/** Return whether an Azure output format is voice-note compatible. */
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
/** List non-deprecated voices from the Azure Speech voices API. */
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
/** Synthesize text to audio bytes using Azure Speech TTS. */
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
/**
* Azure Speech provider descriptor. It reads config/env defaults, parses speech
* directives, lists voices, and calls the Azure TTS runtime helper.
*/
function readAzureSpeechEnvApiKey() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_KEY) ?? normalizeOptionalString(process.env.AZURE_SPEECH_API_KEY) ?? normalizeOptionalString(process.env.SPEECH_KEY);
}
function readAzureSpeechEnvRegion() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_REGION) ?? normalizeOptionalString(process.env.SPEECH_REGION);
}
function readAzureSpeechEnvEndpoint() {
	return normalizeOptionalString(process.env.AZURE_SPEECH_ENDPOINT);
}
function resolveAzureSpeechConfigRecord(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	return asOptionalRecord(providers?.["azure-speech"]) ?? asOptionalRecord(providers?.azure) ?? asOptionalRecord(rawConfig["azure-speech"]) ?? asOptionalRecord(rawConfig.azure);
}
function normalizeAzureSpeechProviderConfig(rawConfig) {
	const raw = resolveAzureSpeechConfigRecord(rawConfig);
	const region = normalizeOptionalString(raw?.region) ?? readAzureSpeechEnvRegion();
	const endpoint = normalizeOptionalString(raw?.endpoint) ?? readAzureSpeechEnvEndpoint();
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
function readAzureSpeechOverrides(overrides) {
	if (!overrides) return {};
	return {
		voice: normalizeOptionalString(overrides.voice ?? overrides.voiceId),
		lang: normalizeOptionalString(overrides.lang ?? overrides.languageCode),
		outputFormat: normalizeOptionalString(overrides.outputFormat)
	};
}
function parseDirectiveToken(ctx) {
	switch (ctx.key) {
		case "voice":
		case "voiceid":
		case "voice_id":
		case "azure_voice":
		case "azurevoice":
		case "azure_speech_voice":
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: {
					...ctx.currentOverrides,
					voice: ctx.value
				}
			};
		case "lang":
		case "language":
		case "language_code":
		case "languagecode":
		case "azure_lang":
		case "azure_language":
			if (!ctx.policy.allowVoiceSettings) return { handled: true };
			return {
				handled: true,
				overrides: {
					...ctx.currentOverrides,
					lang: ctx.value
				}
			};
		case "output_format":
		case "outputformat":
		case "azure_format":
		case "azure_output_format":
			if (!ctx.policy.allowVoiceSettings) return { handled: true };
			return {
				handled: true,
				overrides: {
					...ctx.currentOverrides,
					outputFormat: ctx.value
				}
			};
		default: return { handled: false };
	}
}
function resolveApiKey(...candidates) {
	return resolveSpeechProviderApiKey(...candidates, readAzureSpeechEnvApiKey());
}
function resolveTimeoutMs(config, timeoutMs) {
	return config.timeoutMs ?? timeoutMs;
}
/** Build the Azure Speech provider descriptor for the speech-core runtime. */
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
				...apiKey === void 0 ? {} : { apiKey },
				...region === void 0 ? {} : { region },
				...endpoint === void 0 ? {} : { endpoint },
				...baseUrl === void 0 ? {} : { baseUrl },
				...normalizeOptionalString(talkProviderConfig.voiceId) == null ? {} : { voice: normalizeOptionalString(talkProviderConfig.voiceId) },
				...normalizeOptionalString(talkProviderConfig.languageCode) == null ? {} : { lang: normalizeOptionalString(talkProviderConfig.languageCode) },
				...normalizeOptionalString(talkProviderConfig.outputFormat) == null ? {} : { outputFormat: normalizeOptionalString(talkProviderConfig.outputFormat) }
			};
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId) == null ? {} : { voice: normalizeOptionalString(params.voiceId) },
			...normalizeOptionalString(params.languageCode) == null ? {} : { lang: normalizeOptionalString(params.languageCode) },
			...normalizeOptionalString(params.outputFormat) == null ? {} : { outputFormat: normalizeOptionalString(params.outputFormat) }
		}),
		listVoices: async (req) => {
			const config = req.providerConfig ? readAzureSpeechProviderConfig(req.providerConfig) : void 0;
			const requestValue = req.apiKey;
			const configValue = config?.apiKey;
			const apiKey = resolveApiKey(requestValue, configValue);
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
			const config = readAzureSpeechProviderConfig(req.providerConfig);
			const overrides = readAzureSpeechOverrides(req.providerOverrides);
			const apiKey = resolveApiKey(config.apiKey);
			if (!apiKey) throw new Error("Azure Speech API key missing");
			const outputFormat = overrides.outputFormat ?? (req.target === "voice-note" ? config.voiceNoteOutputFormat : config.outputFormat);
			const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
			return {
				audioBuffer: await azureSpeechTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					endpoint: config.endpoint,
					region: config.region,
					voice: overrides.voice ?? config.voice,
					lang: overrides.lang ?? config.lang,
					outputFormat,
					timeoutMs: resolveTimeoutMs(config, req.timeoutMs),
					maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
				}),
				outputFormat,
				fileExtension: inferAzureSpeechFileExtension(outputFormat),
				voiceCompatible: isAzureSpeechVoiceCompatible(outputFormat)
			};
		},
		synthesizeTelephony: async (req) => {
			const config = readAzureSpeechProviderConfig(req.providerConfig);
			const overrides = readAzureSpeechOverrides(req.providerOverrides);
			const apiKey = resolveApiKey(config.apiKey);
			if (!apiKey) throw new Error("Azure Speech API key missing");
			const sampleRate = 8e3;
			const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
			return {
				audioBuffer: await azureSpeechTTS({
					text: req.text,
					apiKey,
					baseUrl: config.baseUrl,
					endpoint: config.endpoint,
					region: config.region,
					voice: overrides.voice ?? config.voice,
					lang: overrides.lang ?? config.lang,
					outputFormat: DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT,
					timeoutMs: resolveTimeoutMs(config, req.timeoutMs),
					maxBytes: resolveGeneratedMediaMaxBytes(req.cfg, "audio")
				}),
				outputFormat: DEFAULT_AZURE_SPEECH_TELEPHONY_FORMAT,
				sampleRate
			};
		}
	};
}
//#endregion
//#region extensions/azure-speech/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildAzureSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
