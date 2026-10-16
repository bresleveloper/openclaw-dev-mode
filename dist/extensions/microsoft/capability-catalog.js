import { readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { CHROMIUM_FULL_VERSION, TRUSTED_CLIENT_TOKEN, generateSecMsGecToken } from "node-edge-tts/dist/drm.js";
import { asBoolean, asFiniteNumber, asOptionalRecord, filterStringRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { mkdir } from "node:fs/promises";
//#region extensions/microsoft/tts.ts
function inferEdgeExtension(outputFormat) {
	const normalized = normalizeLowercaseStringOrEmpty(outputFormat);
	if (normalized.includes("webm")) return ".webm";
	if (normalized.includes("ogg")) return ".ogg";
	if (normalized.includes("opus")) return ".opus";
	if (normalized.includes("wav") || normalized.includes("riff") || normalized.includes("pcm")) return ".wav";
	return ".mp3";
}
async function edgeTTS(params, ttsOverride) {
	const { text, outputPath, config, timeoutMs } = params;
	if (text.trim().length === 0) throw new Error("Microsoft TTS text cannot be empty");
	const { writeExternalFileWithinRoot } = await import("openclaw/plugin-sdk/security-runtime");
	const tts = ttsOverride ?? new (await (import("node-edge-tts"))).EdgeTTS({
		voice: config.voice,
		lang: config.lang,
		outputFormat: config.outputFormat,
		saveSubtitles: config.saveSubtitles,
		proxy: config.proxy,
		rate: config.rate,
		pitch: config.pitch,
		volume: config.volume,
		timeout: config.timeoutMs ?? timeoutMs
	});
	await mkdir(path.dirname(outputPath), { recursive: true });
	for (let attempt = 0; attempt < 2; attempt += 1) {
		let outputSize = 0;
		await writeExternalFileWithinRoot({
			rootDir: path.dirname(outputPath),
			path: path.basename(outputPath),
			write: async (tempPath) => {
				writeFileSync(tempPath, "");
				await tts.ttsPromise(text, tempPath);
				outputSize = statSync(tempPath).size;
			}
		});
		if (outputSize > 0) return;
	}
	throw new Error("Edge TTS produced empty audio file after retry");
}
//#endregion
//#region extensions/microsoft/speech-provider.ts
const DEFAULT_EDGE_VOICE = "en-US-MichelleNeural";
const DEFAULT_EDGE_LANG = "en-US";
const DEFAULT_EDGE_OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";
const DEFAULT_MICROSOFT_VOICE_LIST_TIMEOUT_MS = 3e4;
function normalizeMicrosoftProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	const rawEdge = asOptionalRecord(rawConfig.edge);
	const rawMicrosoft = asOptionalRecord(rawConfig.microsoft);
	const rawProviderMicrosoft = asOptionalRecord(providers?.microsoft);
	const raw = {
		...rawEdge,
		...rawMicrosoft,
		...rawProviderMicrosoft
	};
	return readMicrosoftProviderConfig({
		...raw,
		outputFormatConfigured: Boolean(normalizeOptionalString(raw.outputFormat))
	});
}
function readMicrosoftProviderConfig(config) {
	return {
		enabled: asBoolean(config.enabled) ?? true,
		voice: normalizeOptionalString(config.voice) ?? DEFAULT_EDGE_VOICE,
		lang: normalizeOptionalString(config.lang) ?? DEFAULT_EDGE_LANG,
		outputFormat: normalizeOptionalString(config.outputFormat) ?? DEFAULT_EDGE_OUTPUT_FORMAT,
		outputFormatConfigured: asBoolean(config.outputFormatConfigured) ?? false,
		pitch: normalizeOptionalString(config.pitch),
		rate: normalizeOptionalString(config.rate),
		volume: normalizeOptionalString(config.volume),
		saveSubtitles: asBoolean(config.saveSubtitles) ?? false,
		proxy: normalizeOptionalString(config.proxy),
		timeoutMs: asFiniteNumber(config.timeoutMs)
	};
}
function buildMicrosoftVoiceHeaders() {
	const major = CHROMIUM_FULL_VERSION.split(".")[0] || "0";
	return {
		Authority: "speech.platform.bing.com",
		Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
		Accept: "*/*",
		"User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Safari/537.36 Edg/${major}.0.0.0`,
		"Sec-MS-GEC": generateSecMsGecToken(),
		"Sec-MS-GEC-Version": `1-${CHROMIUM_FULL_VERSION}`
	};
}
function readMicrosoftVoiceTagStrings(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string" && entry.trim().length > 0) : void 0;
}
function isCjkDominant(text) {
	const stripped = text.replace(/\s+/g, "");
	if (stripped.length === 0) return false;
	let cjkCount = 0;
	for (const ch of stripped) {
		const code = ch.codePointAt(0) ?? 0;
		if (code >= 19968 && code <= 40959 || code >= 13312 && code <= 19903 || code >= 12288 && code <= 12351 || code >= 65280 && code <= 65519) cjkCount += 1;
	}
	return cjkCount / stripped.length > .3;
}
const DEFAULT_CHINESE_EDGE_VOICE = "zh-CN-XiaoxiaoNeural";
const DEFAULT_CHINESE_EDGE_LANG = "zh-CN";
async function listMicrosoftVoices(timeoutMs = DEFAULT_MICROSOFT_VOICE_LIST_TIMEOUT_MS) {
	const { assertOkOrThrowProviderError, readProviderJsonResponse } = await import("openclaw/plugin-sdk/provider-http");
	const proxyCaptureSdk = await import("openclaw/plugin-sdk/proxy-capture");
	const captureHost = proxyCaptureSdk;
	const { fetchWithSsrFGuard, ssrfPolicyFromHttpBaseUrlAllowedHostname } = await import("openclaw/plugin-sdk/ssrf-runtime");
	const url = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/voices/list?trustedclienttoken=${TRUSTED_CLIENT_TOKEN}`;
	const headers = buildMicrosoftVoiceHeaders();
	const { response, release } = await fetchWithSsrFGuard({
		url,
		init: { headers },
		policy: ssrfPolicyFromHttpBaseUrlAllowedHostname("https://speech.platform.bing.com"),
		auditContext: "microsoft.speech.voices",
		timeoutMs
	});
	try {
		if (!proxyCaptureSdk.isDebugProxyGlobalFetchPatchInstalled()) captureHost.captureHttpExchangeAsync?.({
			url,
			method: "GET",
			requestHeaders: headers,
			response,
			transport: "http",
			meta: {
				provider: "microsoft",
				capability: "speech-voices"
			}
		}).catch(() => {});
		await assertOkOrThrowProviderError(response, "Microsoft voices API error");
		const voices = await readProviderJsonResponse(response, "microsoft.speech-voices");
		return Array.isArray(voices) ? voices.flatMap((value) => {
			const voice = asOptionalRecord(value);
			const id = normalizeOptionalString(voice?.ShortName);
			if (!voice || !id) return [];
			const voiceTag = asOptionalRecord(voice.VoiceTag);
			const categories = readMicrosoftVoiceTagStrings(voiceTag?.ContentCategories);
			const personalities = readMicrosoftVoiceTagStrings(voiceTag?.VoicePersonalities);
			return [{
				id,
				name: normalizeOptionalString(voice.FriendlyName) ?? id,
				category: categories?.[0],
				description: personalities?.length ? personalities.join(", ") : void 0,
				locale: normalizeOptionalString(voice.Locale),
				gender: normalizeOptionalString(voice.Gender),
				personalities
			}];
		}) : [];
	} finally {
		await release();
	}
}
function buildMicrosoftSpeechProvider() {
	return {
		id: "microsoft",
		label: "Microsoft",
		aliases: ["edge"],
		autoSelectOrder: 30,
		resolveConfig: ({ rawConfig }) => normalizeMicrosoftProviderConfig(rawConfig),
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			return {
				...normalizeMicrosoftProviderConfig(baseTtsConfig),
				enabled: true,
				...filterStringRecord({
					voice: normalizeOptionalString(talkProviderConfig.voiceId),
					lang: normalizeOptionalString(talkProviderConfig.languageCode),
					outputFormat: normalizeOptionalString(talkProviderConfig.outputFormat),
					pitch: normalizeOptionalString(talkProviderConfig.pitch),
					rate: normalizeOptionalString(talkProviderConfig.rate),
					volume: normalizeOptionalString(talkProviderConfig.volume),
					proxy: normalizeOptionalString(talkProviderConfig.proxy)
				}),
				...asFiniteNumber(talkProviderConfig.timeoutMs) == null ? {} : { timeoutMs: asFiniteNumber(talkProviderConfig.timeoutMs) }
			};
		},
		resolveTalkOverrides: ({ params }) => filterStringRecord({
			voice: normalizeOptionalString(params.voiceId),
			outputFormat: normalizeOptionalString(params.outputFormat)
		}) ?? {},
		listVoices: async (req) => {
			return await listMicrosoftVoices(readMicrosoftProviderConfig(req.providerConfig ?? {}).timeoutMs ?? req.timeoutMs);
		},
		isConfigured: ({ providerConfig }) => readMicrosoftProviderConfig(providerConfig).enabled,
		synthesize: async (req) => {
			const config = readMicrosoftProviderConfig(req.providerConfig);
			const { isVoiceMessageCompatibleAudio } = await import("openclaw/plugin-sdk/media-runtime");
			const { tempWorkspace, resolvePreferredOpenClawTmpDir } = await import("openclaw/plugin-sdk/temp-path");
			const temp = await tempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "tts-microsoft-"
			});
			const tempDir = temp.dir;
			const overrideVoice = normalizeOptionalString(req.providerOverrides?.voice);
			let voice = overrideVoice ?? config.voice;
			let lang = config.lang;
			const outputFormat = normalizeOptionalString(req.providerOverrides?.outputFormat) ?? config.outputFormat;
			const fallbackOutputFormat = outputFormat !== DEFAULT_EDGE_OUTPUT_FORMAT ? DEFAULT_EDGE_OUTPUT_FORMAT : void 0;
			if (!overrideVoice && voice === DEFAULT_EDGE_VOICE && isCjkDominant(req.text)) {
				voice = DEFAULT_CHINESE_EDGE_VOICE;
				lang = DEFAULT_CHINESE_EDGE_LANG;
			}
			try {
				const runEdge = async (format) => {
					const fileExtension = inferEdgeExtension(format);
					const outputPath = path.join(tempDir, `speech${fileExtension}`);
					await edgeTTS({
						text: req.text,
						outputPath,
						config: {
							...config,
							voice,
							lang,
							outputFormat: format
						},
						timeoutMs: req.timeoutMs
					});
					return {
						audioBuffer: readFileSync(outputPath),
						outputFormat: format,
						fileExtension,
						voiceCompatible: isVoiceMessageCompatibleAudio({ fileName: outputPath })
					};
				};
				try {
					return await runEdge(outputFormat);
				} catch (error) {
					if (!fallbackOutputFormat) throw error;
					return await runEdge(fallbackOutputFormat);
				}
			} finally {
				await temp.cleanup();
			}
		}
	};
}
//#endregion
//#region extensions/microsoft/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildMicrosoftSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
