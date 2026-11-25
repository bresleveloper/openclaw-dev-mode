import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { DEFAULT_GRADIUM_VOICE_ID, buildGradiumSpeechRequestBody, createSpeechDirectiveParser, resolveSpeechProviderApiKey } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/gradium/speech-provider.ts
const DEFAULT_GRADIUM_BASE_URL = "https://api.gradium.ai";
const GRADIUM_API_HOSTNAME = "api.gradium.ai";
const GRADIUM_VOICES = [
	{
		id: "YTpq7expH9539ERJ",
		name: "Emma"
	},
	{
		id: "LFZvm12tW_z0xfGo",
		name: "Kent"
	},
	{
		id: "Eu9iL_CYe8N-Gkx_",
		name: "Tiffany"
	},
	{
		id: "2H4HY2CBNyJHBCrP",
		name: "Christina"
	},
	{
		id: "jtEKaLYNn6iif5PR",
		name: "Sydney"
	},
	{
		id: "KWJiFWu2O9nMPYcR",
		name: "John"
	},
	{
		id: "3jUdJyOi9pgbxBTK",
		name: "Arthur"
	}
];
function normalizeGradiumBaseUrl(baseUrl) {
	const raw = baseUrl?.trim() || DEFAULT_GRADIUM_BASE_URL;
	const url = URL.parse(raw);
	if (!url) throw new Error("Gradium baseUrl must be a valid https URL");
	url.username = "";
	url.password = "";
	url.search = "";
	url.hash = "";
	if (url.protocol !== "https:") throw new Error("Gradium baseUrl must use https");
	if (url.hostname.toLowerCase() !== GRADIUM_API_HOSTNAME) throw new Error("Gradium baseUrl must target api.gradium.ai");
	return url.toString().replace(/\/+$/, "");
}
function normalizeGradiumProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const raw = asOptionalRecord(providers?.gradium);
	return {
		apiKey: normalizeResolvedSecretInputString({
			value: raw?.apiKey,
			path: "tts.providers.gradium.apiKey"
		}),
		baseUrl: normalizeGradiumBaseUrl(normalizeOptionalString(raw?.baseUrl)),
		voiceId: normalizeOptionalString(raw?.voiceId) ?? DEFAULT_GRADIUM_VOICE_ID
	};
}
function readGradiumProviderConfig(config) {
	return normalizeGradiumProviderConfig({ providers: { gradium: {
		...config,
		apiKey: normalizeOptionalString(config.apiKey)
	} } });
}
function resolveGradiumApiKey(configApiKey) {
	return resolveSpeechProviderApiKey(normalizeOptionalString(configApiKey), process.env.GRADIUM_API_KEY);
}
async function synthesizeGradium(req, outputFormat) {
	const config = readGradiumProviderConfig(req.providerConfig);
	const apiKey = resolveGradiumApiKey(config.apiKey);
	if (!apiKey) throw new Error("Gradium API key missing");
	const { resolveGeneratedMediaMaxBytes } = await import("openclaw/plugin-sdk/media-generation-runtime");
	const text = req.text;
	const voiceId = normalizeOptionalString(req.providerOverrides?.voiceId) ?? config.voiceId;
	const timeoutMs = req.timeoutMs;
	const maxBytes = resolveGeneratedMediaMaxBytes(req.cfg, "audio");
	const url = `${config.baseUrl}/api/post/speech/tts`;
	const { assertOkOrThrowProviderError, readProviderBinaryResponse } = await import("openclaw/plugin-sdk/provider-http");
	const { fetchWithSsrFGuard } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: {
			method: "POST",
			headers: {
				"x-api-key": apiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(buildGradiumSpeechRequestBody({
				text,
				voiceId,
				outputFormat
			}))
		},
		timeoutMs,
		requireHttps: true,
		policy: { hostnameAllowlist: [GRADIUM_API_HOSTNAME] },
		auditContext: "gradium.tts"
	});
	try {
		await assertOkOrThrowProviderError(response, "Gradium API error", { requestHeaders: { "x-api-key": apiKey } });
		return await readProviderBinaryResponse(response, "Gradium API error", "audio", {
			maxBytes,
			onOverflow: ({ maxBytes: maxBytesLocal }) => /* @__PURE__ */ new Error(`Gradium TTS audio response exceeds ${maxBytesLocal} bytes`)
		});
	} finally {
		await release();
	}
}
function isGradiumProviderConfigured(config) {
	if (!resolveGradiumApiKey(config.apiKey)) return false;
	try {
		normalizeGradiumBaseUrl(normalizeOptionalString(config.baseUrl));
		return true;
	} catch {
		return false;
	}
}
const parseDirectiveToken = createSpeechDirectiveParser({ voiceId: ["allowVoice", [
	"voice",
	"voice_id",
	"voiceid",
	"gradium_voice",
	"gradiumvoice"
]] });
function buildGradiumSpeechProvider() {
	const isConfigured = ({ providerConfig }) => isGradiumProviderConfigured(providerConfig);
	return {
		id: "gradium",
		label: "Gradium",
		autoSelectOrder: 30,
		voices: GRADIUM_VOICES.map((v) => v.id),
		resolveConfig: ({ rawConfig }) => normalizeGradiumProviderConfig(rawConfig),
		parseDirectiveToken,
		listVoices: async () => GRADIUM_VOICES.map((v) => ({
			id: v.id,
			name: v.name
		})),
		isConfigured,
		isConfiguredAsync: async (ctx) => isConfigured(ctx),
		synthesize: async (req) => {
			const wantsVoiceNote = req.target === "voice-note";
			const outputFormat = wantsVoiceNote ? "opus" : "wav";
			return {
				audioBuffer: await synthesizeGradium(req, outputFormat),
				outputFormat,
				fileExtension: wantsVoiceNote ? ".opus" : ".wav",
				voiceCompatible: wantsVoiceNote
			};
		},
		synthesizeTelephony: async (req) => ({
			audioBuffer: await synthesizeGradium(req, "ulaw_8000"),
			outputFormat: "ulaw_8000",
			sampleRate: 8e3
		})
	};
}
export { buildGradiumSpeechProvider };
