import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { d as normalizeResolvedSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import "./secret-input-CHX7JVid.mjs";
//#region src/tts/openai-compatible-speech-provider.ts
function resolveConfiguredSpeechVoice(config) {
	return normalizeOptionalString(config?.speakerVoice) ?? normalizeOptionalString(config?.speakerVoiceId) ?? normalizeOptionalString(config?.voice) ?? normalizeOptionalString(config?.voiceId);
}
function trimTrailingBaseUrl(value, fallback) {
	return (normalizeOptionalString(value) ?? fallback).replace(/\/+$/u, "");
}
function readModelProviderConfig(cfg, providerConfigKey) {
	const root = asOptionalRecord(cfg);
	const models = asOptionalRecord(root?.models);
	const providers = asOptionalRecord(models?.providers);
	return asOptionalRecord(providers?.[providerConfigKey]);
}
function parseDirectiveToken(ctx, providerConfigKey) {
	const compactProviderKey = providerConfigKey.replace(/[^a-z0-9]+/giu, "").toLowerCase();
	switch (ctx.key) {
		case "voice":
		case "voice_id":
		case "voiceid":
		case `${providerConfigKey}_voice`:
		case `${compactProviderKey}voice`:
			if (!ctx.policy.allowVoice) return { handled: true };
			return {
				handled: true,
				overrides: { voice: ctx.value }
			};
		case "model":
		case "model_id":
		case "modelid":
		case `${providerConfigKey}_model`:
		case `${compactProviderKey}model`:
			if (!ctx.policy.allowModelId) return { handled: true };
			return {
				handled: true,
				overrides: { model: ctx.value }
			};
		default: return { handled: false };
	}
}
function buildExtraJsonBodyFields(config, fields) {
	const body = {};
	for (const field of fields ?? []) {
		const value = config[field.configKey];
		if (value != null) body[field.requestKey ?? field.configKey] = value;
	}
	return body;
}
/** Build a complete SpeechProviderPlugin for OpenAI-compatible speech endpoints. */
function createOpenAiCompatibleSpeechProvider(options) {
	const providerConfigKey = options.configKey ?? options.id;
	const normalizeModel = options.normalizeModel ?? ((value, fallback) => normalizeOptionalString(value) ?? fallback);
	const readExtraConfig = options.readExtraConfig ?? (() => ({}));
	function normalizeResponseFormat(value) {
		const next = normalizeOptionalLowercaseString(value);
		if (next && !options.responseFormats.includes(next)) throw new Error(`Invalid ${options.label} speech responseFormat: ${next}`);
		return next;
	}
	function normalizeBaseUrl(value) {
		const normalized = trimTrailingBaseUrl(value, options.defaultBaseUrl);
		const policy = options.baseUrlPolicy;
		if (policy?.kind !== "canonical") return normalized;
		const canonical = trimTrailingBaseUrl(options.defaultBaseUrl, options.defaultBaseUrl);
		const aliases = [canonical, ...policy.aliases ?? []];
		return !policy.allowCustom || aliases.some((entry) => trimTrailingBaseUrl(entry, canonical) === normalized) ? canonical : normalized;
	}
	function normalizeConfig(rawConfig) {
		const raw = asOptionalRecord(asOptionalRecord(rawConfig.providers)?.[providerConfigKey]) ?? asOptionalRecord(rawConfig[providerConfigKey]);
		return readProviderConfig(raw, {
			model: options.defaultModel,
			voice: options.defaultVoice,
			apiKey: normalizeResolvedSecretInputString({
				value: raw?.apiKey,
				path: `${appendConfigPathSegment("tts.providers", providerConfigKey)}.apiKey`
			})
		});
	}
	function readProviderConfig(config, normalized = normalizeConfig({})) {
		return {
			apiKey: normalizeOptionalString(config?.apiKey) ?? normalized.apiKey,
			baseUrl: normalizeOptionalString(config?.baseUrl) == null ? normalized.baseUrl : normalizeBaseUrl(config?.baseUrl),
			model: normalizeModel(normalizeOptionalString(config?.model ?? config?.modelId), normalized.model),
			voice: resolveConfiguredSpeechVoice(config) ?? normalized.voice,
			speed: asFiniteNumber(config?.speed) ?? normalized.speed,
			responseFormat: normalizeResponseFormat(config?.responseFormat) ?? normalized.responseFormat,
			...readExtraConfig(config)
		};
	}
	function resolveApiKey(params) {
		return params.providerConfig.apiKey ?? normalizeResolvedSecretInputString({
			value: readModelProviderConfig(params.cfg, providerConfigKey)?.apiKey,
			path: `${appendConfigPathSegment("models.providers", providerConfigKey)}.apiKey`
		}) ?? normalizeOptionalString(process.env[options.envKey]);
	}
	return {
		id: options.id,
		label: options.label,
		autoSelectOrder: options.autoSelectOrder,
		defaultModel: options.defaultModel,
		defaultTimeoutMs: options.defaultTimeoutMs,
		models: [...options.models],
		voices: [...options.voices],
		resolveConfig: ({ rawConfig }) => normalizeConfig(rawConfig),
		parseDirectiveToken: (ctx) => parseDirectiveToken(ctx, providerConfigKey),
		resolveTalkConfig: ({ baseTtsConfig, talkProviderConfig }) => {
			const base = normalizeConfig(baseTtsConfig);
			const responseFormat = normalizeResponseFormat(talkProviderConfig.responseFormat);
			const next = { ...base };
			if (talkProviderConfig.apiKey !== void 0) next.apiKey = normalizeResolvedSecretInputString({
				value: talkProviderConfig.apiKey,
				path: `${appendConfigPathSegment("talk.providers", providerConfigKey)}.apiKey`
			});
			const baseUrl = normalizeOptionalString(talkProviderConfig.baseUrl);
			if (baseUrl !== void 0) next.baseUrl = normalizeBaseUrl(baseUrl);
			const modelId = normalizeOptionalString(talkProviderConfig.modelId);
			if (modelId !== void 0) next.model = normalizeModel(modelId, options.defaultModel);
			next.voice = resolveConfiguredSpeechVoice(talkProviderConfig) ?? base.voice;
			const speed = asFiniteNumber(talkProviderConfig.speed);
			if (speed !== void 0) next.speed = speed;
			if (responseFormat !== void 0) next.responseFormat = responseFormat;
			return next;
		},
		resolveTalkOverrides: ({ params }) => ({
			...normalizeOptionalString(params.voiceId ?? params.voice) == null ? {} : { voice: normalizeOptionalString(params.voiceId ?? params.voice) },
			...normalizeOptionalString(params.modelId ?? params.model) == null ? {} : { model: normalizeOptionalString(params.modelId ?? params.model) },
			...asFiniteNumber(params.speed) == null ? {} : { speed: asFiniteNumber(params.speed) }
		}),
		listVoices: async () => options.voices.map((voice) => ({
			id: voice,
			name: voice
		})),
		isConfigured: ({ cfg, providerConfig }) => Boolean(resolveApiKey({
			cfg,
			providerConfig: readProviderConfig(providerConfig)
		})),
		synthesize: async (req) => {
			const config = readProviderConfig(req.providerConfig);
			const overrides = req.providerOverrides;
			const model = normalizeOptionalString(overrides?.model ?? overrides?.modelId);
			const voice = normalizeOptionalString(overrides?.voice ?? overrides?.voiceId);
			const speed = asFiniteNumber(overrides?.speed) ?? config.speed;
			const apiKey = resolveApiKey({
				cfg: req.cfg,
				providerConfig: config
			});
			if (!apiKey) throw new Error(options.missingApiKeyError ?? `${options.label} API key missing`);
			const baseUrl = normalizeBaseUrl(config.baseUrl ?? readModelProviderConfig(req.cfg, providerConfigKey)?.baseUrl);
			const responseFormat = config.responseFormat ?? options.defaultResponseFormat;
			const { assertOkOrThrowHttpError, postJsonRequest, readProviderBinaryResponse, resolveProviderHttpRequestConfig } = await import("./plugin-sdk/provider-http.js");
			const { allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl,
				defaultBaseUrl: options.defaultBaseUrl,
				allowPrivateNetwork: false,
				defaultHeaders: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
					...options.extraHeaders
				},
				provider: options.id,
				capability: "audio",
				transport: "http"
			});
			const { response, release } = await postJsonRequest({
				url: `${baseUrl}/audio/speech`,
				headers,
				body: {
					model: normalizeModel(model ?? config.model, options.defaultModel),
					input: req.text,
					voice: voice ?? config.voice,
					response_format: responseFormat,
					...speed == null ? {} : { speed },
					...buildExtraJsonBodyFields(config, options.extraJsonBodyFields)
				},
				timeoutMs: req.timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork,
				dispatcherPolicy
			});
			try {
				await assertOkOrThrowHttpError(response, options.apiErrorLabel ?? `${options.label} TTS API error`);
				return {
					audioBuffer: await readProviderBinaryResponse(response, options.apiErrorLabel ?? `${options.label} TTS API error`, "audio"),
					outputFormat: responseFormat,
					fileExtension: `.${responseFormat}`,
					voiceCompatible: options.voiceCompatibleResponseFormats.includes(responseFormat)
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { createOpenAiCompatibleSpeechProvider as t };
