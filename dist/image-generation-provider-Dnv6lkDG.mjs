import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { r as extensionForMime } from "./mime-CGDYrRzL.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import { t as bufferToBlobPart } from "./blob-runtime-CBGGTQ96.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./provider-onboard-CF3Sw4qH.mjs";
import { i as isPrivateNetworkOptInEnabled } from "./ssrf-policy-CWFvb6PK.mjs";
import "./media-mime-DLFR6fqC.mjs";
import { n as OPENAI_CODEX_RESPONSES_BASE_URL, o as isOpenAICodexBaseUrl, r as canonicalizeCodexResponsesBaseUrl } from "./base-url-BUR_8zW8.mjs";
import { i as OPENAI_DEFAULT_IMAGE_MODEL, t as OPENAI_CODEX_DEFAULT_MODEL } from "./default-models-CYEf1QuY.mjs";
import { t as resolveModelAuthPolicy } from "./model-auth-policy-CDWi63wg.mjs";
import "./provider-policy-api-DaHQqwNU.mjs";
import { r as resolveConfiguredOpenAIBaseUrl } from "./shared-C588ZwAA.mjs";
import path from "node:path";
//#region extensions/openai/image-generation-provider.ts
const DEFAULT_OPENAI_IMAGE_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_OPENAI_CODEX_IMAGE_BASE_URL = OPENAI_CODEX_RESPONSES_BASE_URL;
const OPENAI_MODEL_REF_PREFIX = "openai/";
const DEFAULT_OPENAI_CODEX_IMAGE_RESPONSES_MODEL = OPENAI_CODEX_DEFAULT_MODEL.slice(7);
const OPENAI_CODEX_IMAGE_INSTRUCTIONS = "You are an image generation assistant.";
const OPENAI_TRANSPARENT_BACKGROUND_IMAGE_MODEL = "gpt-image-1.5";
const DEFAULT_OPENAI_IMAGE_TIMEOUT_MS = 18e4;
const DEFAULT_AZURE_OPENAI_IMAGE_TIMEOUT_MS = 6e5;
const DEFAULT_OUTPUT_MIME = "image/png";
const DEFAULT_SIZE = "1024x1024";
const OPENAI_SUPPORTED_SIZES = [
	"1024x1024",
	"1536x1024",
	"1024x1536",
	"2048x2048",
	"2048x1152",
	"3840x2160",
	"2160x3840"
];
const OPENAI_LEGACY_IMAGE_SIZES = [
	"1024x1024",
	"1536x1024",
	"1024x1536"
];
const OPENAI_MAX_INPUT_IMAGES = 5;
const OPENAI_MAX_IMAGE_RESULTS = 4;
const LOG_VALUE_MAX_CHARS = 256;
const MOCK_OPENAI_PROVIDER_ID = "mock-openai";
const OPENAI_OUTPUT_FORMATS = [
	"png",
	"jpeg",
	"webp"
];
const OPENAI_BACKGROUNDS = [
	"transparent",
	"opaque",
	"auto"
];
const OPENAI_QUALITIES = [
	"low",
	"medium",
	"high",
	"auto"
];
const OPENAI_IMAGE_25_MODELS = ["gpt-image-2.5-flare", "gpt-image-2.5-sunburst"];
const OPENAI_IMAGE_25_QUALITIES = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max",
	"auto"
];
const OPENAI_IMAGE_MODELS = [
	OPENAI_DEFAULT_IMAGE_MODEL,
	...OPENAI_IMAGE_25_MODELS,
	OPENAI_TRANSPARENT_BACKGROUND_IMAGE_MODEL,
	"gpt-image-1",
	"gpt-image-1-mini"
];
const OPENAI_FLEXIBLE_IMAGE_MODELS = [
	OPENAI_DEFAULT_IMAGE_MODEL,
	...OPENAI_IMAGE_25_MODELS,
	"gpt-image-2-2026-04-21"
];
const AZURE_HOSTNAME_SUFFIXES = [
	".openai.azure.com",
	".services.ai.azure.com",
	".cognitiveservices.azure.com"
];
const DEFAULT_AZURE_OPENAI_API_VERSION = "2024-12-01-preview";
function sanitizeLogValue(value) {
	const cleaned = (typeof value === "string" ? value : typeof value === "number" || typeof value === "boolean" ? String(value) : "").replace(/[\r\n\u2028\u2029]+/g, " ").replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gi, "").replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim();
	if (!cleaned) return "unknown";
	return cleaned.length > LOG_VALUE_MAX_CHARS ? `${truncateUtf16Safe(cleaned, LOG_VALUE_MAX_CHARS)}...` : cleaned;
}
function resolveOpenAIImageTimeoutMs(timeoutMs, options) {
	return timeoutMs ?? (options?.isAzure ? DEFAULT_AZURE_OPENAI_IMAGE_TIMEOUT_MS : DEFAULT_OPENAI_IMAGE_TIMEOUT_MS);
}
function isPublicOpenAIImageBaseUrl(baseUrl) {
	const parsed = URL.parse(baseUrl.trim());
	if (!parsed) return false;
	const pathName = parsed.pathname.replace(/\/+$/, "");
	return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === "api.openai.com" && parsed.port === "" && parsed.username === "" && parsed.password === "" && parsed.search === "" && parsed.hash === "" && pathName === "/v1";
}
function isAzureOpenAIBaseUrl(baseUrl) {
	const hostname = URL.parse(baseUrl?.trim() ?? "")?.hostname.toLowerCase();
	return hostname !== void 0 && AZURE_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}
function resolveAzureApiVersion() {
	return process.env.AZURE_OPENAI_API_VERSION?.trim() || DEFAULT_AZURE_OPENAI_API_VERSION;
}
function buildAzureImageUrl(rawBaseUrl, model, action) {
	return `${rawBaseUrl.replace(/\/+$/, "").replace(/\/openai\/v1$/, "").replace(/\/v1$/, "")}/openai/deployments/${model}/images/${action}?api-version=${resolveAzureApiVersion()}`;
}
function resolveOutputMime(outputFormat) {
	switch (outputFormat) {
		case "jpeg": return {
			mimeType: "image/jpeg",
			extension: "jpg"
		};
		case "webp": return {
			mimeType: "image/webp",
			extension: "webp"
		};
		default: return {
			mimeType: DEFAULT_OUTPUT_MIME,
			extension: "png"
		};
	}
}
function resolveOpenAIImageOptions(req) {
	const openai = req.providerOptions?.openai;
	const background = openai?.background ?? req.background;
	const outputCompression = req.outputFormat === "jpeg" || req.outputFormat === "webp" ? openai?.outputCompression : void 0;
	return {
		...req.quality !== void 0 ? { quality: req.quality } : {},
		...req.outputFormat !== void 0 ? { output_format: req.outputFormat } : {},
		...background !== void 0 ? { background } : {},
		...openai?.moderation !== void 0 ? { moderation: openai.moderation } : {},
		...outputCompression !== void 0 ? { output_compression: outputCompression } : {}
	};
}
function resolveOpenAIImageRequestModel(req, options) {
	const model = req.model || "gpt-image-2";
	if (options?.allowTransparentDefaultReroute === true && model === "gpt-image-2" && (req.providerOptions?.openai?.background ?? req.background) === "transparent") return OPENAI_TRANSPARENT_BACKGROUND_IMAGE_MODEL;
	return model;
}
function resolveNativeOpenAIImageSizesForModel(model) {
	switch (model) {
		case "gpt-image-1":
		case "gpt-image-1-mini": return OPENAI_LEGACY_IMAGE_SIZES;
		default: return OPENAI_SUPPORTED_SIZES;
	}
}
function isValidFlexibleOpenAIImageSize(model, size) {
	if (!OPENAI_FLEXIBLE_IMAGE_MODELS.some((candidate) => candidate === model)) return false;
	if (size === "auto") return OPENAI_IMAGE_25_MODELS.some((candidate) => candidate === model);
	const dimensions = /^(\d+)x(\d+)$/.exec(size ?? "");
	if (!dimensions) return false;
	const width = Number(dimensions[1]);
	const height = Number(dimensions[2]);
	const pixels = width * height;
	return width > 0 && height > 0 && width % 16 === 0 && height % 16 === 0 && Math.max(width, height) <= 3840 && pixels >= 655360 && pixels <= 8294400 && width <= height * 3 && height <= width * 3;
}
function resolveConfiguredOpenAIImageBaseUrl(cfg, model) {
	const modelId = model.trim().replace(/^openai\//u, "");
	return cfg?.models?.providers?.openai?.models?.find((candidate) => candidate.id.trim().replace(/^openai\//u, "") === modelId)?.baseUrl?.trim() || resolveConfiguredOpenAIBaseUrl(cfg);
}
function resolveOpenAIImageRequestSize(params, resolveSize) {
	const requestedSize = params.requestedSize ?? DEFAULT_SIZE;
	if (!params.applyNativeLimits) return { size: requestedSize };
	const size = resolveSize({
		requestedSize,
		supportedSizes: resolveNativeOpenAIImageSizesForModel(params.model)
	}) ?? DEFAULT_SIZE;
	if (size === requestedSize) return { size };
	return {
		size,
		metadata: {
			requestedSize,
			normalizedSize: size
		}
	};
}
function shouldAllowPrivateImageEndpoint(req) {
	if (req.provider === MOCK_OPENAI_PROVIDER_ID) return true;
	if (isPrivateNetworkOptInEnabled(req.cfg?.browser?.ssrfPolicy)) return true;
	const baseUrl = resolveConfiguredOpenAIImageBaseUrl(req.cfg, req.model);
	if (!baseUrl.startsWith("http://127.0.0.1:") && !baseUrl.startsWith("http://localhost:")) return false;
	return process.env.OPENCLAW_QA_ALLOW_LOCAL_IMAGE_PROVIDER === "1";
}
function resolveRequestAuthStore(req, modelAuth) {
	if (req.authStore) return req.authStore;
	const agentDir = req.agentDir?.trim();
	if (!agentDir) return;
	return modelAuth.ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
}
function hasDirectOpenAIImageApiKeyAuth(params, modelAuth) {
	if (hasExplicitOpenAIImageApiKeyConfig(params.cfg)) return true;
	if (process.env.OPENAI_API_KEY?.trim()) return true;
	const store = params.agentDir ? modelAuth.ensureAuthProfileStore(params.agentDir, { allowKeychainPrompt: false }) : void 0;
	if (!store) return false;
	const profileIds = modelAuth.listProfilesForProvider(store, "openai");
	if (profileIds.length === 0) return false;
	return profileIds.some((profileId) => store.profiles[profileId]?.type === "api_key");
}
function hasCodexResponseTransportProfileConfigured(req, modelAuth) {
	const store = resolveRequestAuthStore(req, modelAuth);
	if (!store) return false;
	return modelAuth.listProfilesForProvider(store, "openai").some((profileId) => {
		const credential = store.profiles[profileId];
		return (credential?.type === "oauth" || credential?.type === "token") && resolveModelAuthPolicy({
			provider: "openai",
			mode: credential.type,
			authFlow: credential.type === "oauth" ? credential.authFlow : void 0,
			capability: "image-generation"
		})?.compatible === true;
	});
}
function hasExplicitOpenAIImageApiKeyConfig(cfg) {
	const providerConfig = cfg?.models?.providers?.openai;
	return providerConfig?.apiKey !== void 0 || providerConfig?.auth === "api-key";
}
function hasExplicitDirectOpenAIImageConfig(cfg) {
	const providerConfig = cfg?.models?.providers?.openai;
	if (!providerConfig) return false;
	return hasExplicitOpenAIImageApiKeyConfig(cfg) || providerConfig.headers !== void 0 || providerConfig.authHeader !== void 0 || providerConfig.request !== void 0 || providerConfig.api !== void 0 && providerConfig.api !== "openai-chatgpt-responses";
}
function hasChatGPTImageRouteConfig(cfg) {
	const providerConfig = cfg?.models?.providers?.openai;
	return isOpenAICodexBaseUrl(resolveConfiguredOpenAIBaseUrl(cfg)) || providerConfig?.api === "openai-chatgpt-responses";
}
function forceOpenAIImageApiKeyAuth(cfg) {
	if (!hasExplicitOpenAIImageApiKeyConfig(cfg)) return cfg;
	const providerConfig = cfg?.models?.providers?.openai;
	if (!providerConfig) return cfg;
	return {
		...cfg,
		models: {
			...cfg?.models,
			providers: {
				...cfg?.models?.providers,
				openai: {
					...providerConfig,
					auth: "api-key"
				}
			}
		}
	};
}
function isCodexSubscriptionAuthMode(mode) {
	return mode === "oauth" || mode === "token";
}
function inferImageUploadFileName(params) {
	const fileName = params.fileName?.trim();
	if (fileName) return path.basename(fileName);
	const mimeType = params.mimeType?.trim().toLowerCase() || DEFAULT_OUTPUT_MIME;
	const ext = extensionForMime(mimeType)?.slice(1) ?? "png";
	return `image-${params.index + 1}.${ext}`;
}
async function resolveOptionalApiKeyForProvider(params) {
	const { resolveApiKeyForProvider } = await import("./plugin-sdk/provider-auth-runtime.js");
	try {
		return await resolveApiKeyForProvider(params);
	} catch (error) {
		const provider = params?.provider ?? "";
		if (!(error instanceof Error ? error.message : "").startsWith(`No API key found for provider "${provider}".`)) throw error;
		return null;
	}
}
function resolveCodexImageResponsesModels(cfg) {
	const agentModel = cfg?.agents?.defaults?.model;
	const retryModels = /* @__PURE__ */ new Set();
	for (const ref of [resolveAgentModelPrimaryValue(agentModel), ...resolveAgentModelFallbackValues(agentModel)]) {
		const modelRef = ref?.trim();
		const modelId = modelRef?.startsWith(OPENAI_MODEL_REF_PREFIX) ? modelRef.slice(7) : void 0;
		if (modelId && modelId !== DEFAULT_OPENAI_CODEX_IMAGE_RESPONSES_MODEL) retryModels.add(modelId);
	}
	return [DEFAULT_OPENAI_CODEX_IMAGE_RESPONSES_MODEL, ...retryModels];
}
async function logCodexImageAuthSelected(params) {
	const { createSubsystemLogger } = await import("./plugin-sdk/logging-core.js");
	const log = createSubsystemLogger("image-generation/openai");
	const model = resolveOpenAIImageRequestModel(params.req, { allowTransparentDefaultReroute: true });
	log.info(`image auth selected: provider=openai mode=${sanitizeLogValue(params.authMode)} transport=codex-responses requestedModel=${sanitizeLogValue(model)} responsesModel=${DEFAULT_OPENAI_CODEX_IMAGE_RESPONSES_MODEL} timeoutMs=${params.timeoutMs}`);
}
function isCodexModelUnavailableBody(body, model) {
	if (!body) return false;
	try {
		const payload = JSON.parse(body);
		return typeof payload === "object" && payload !== null && "detail" in payload && payload.detail === `The '${model}' model is not supported when using Codex with a ChatGPT account.`;
	} catch {
		return false;
	}
}
async function generateOpenAICodexImage(params) {
	const [{ ProviderHttpError, assertOkOrThrowHttpError, postJsonRequest, resolveProviderHttpRequestConfig, sanitizeConfiguredModelProviderRequest }, { toImageDataUrl }, { resolveClosestSize }, { readCodexImageGenerationResponse }] = await Promise.all([
		import("./plugin-sdk/provider-http.js"),
		import("./plugin-sdk/image-generation.js"),
		import("./plugin-sdk/media-generation-runtime.js"),
		import("./extensions/openai/image-generation-codex-response.js")
	]);
	const { req, apiKey } = params;
	const inputImages = req.inputImages ?? [];
	const openAIProviderConfig = req.cfg?.models?.providers?.openai;
	const codexProviderConfig = openAIProviderConfig?.api === "openai-chatgpt-responses" ? openAIProviderConfig : void 0;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		baseUrl: canonicalizeCodexResponsesBaseUrl(codexProviderConfig?.baseUrl),
		defaultBaseUrl: DEFAULT_OPENAI_CODEX_IMAGE_BASE_URL,
		defaultHeaders: {
			Authorization: `Bearer ${apiKey}`,
			Accept: "text/event-stream"
		},
		request: sanitizeConfiguredModelProviderRequest(codexProviderConfig?.request),
		provider: "openai",
		api: "openai-chatgpt-responses",
		capability: "image",
		transport: "http"
	});
	const model = resolveOpenAIImageRequestModel(req, { allowTransparentDefaultReroute: true });
	const count = resolveIntegerOption(req.count, 1, {
		min: 1,
		max: OPENAI_MAX_IMAGE_RESULTS
	});
	const sizeResolution = resolveOpenAIImageRequestSize({
		model,
		requestedSize: req.size,
		applyNativeLimits: true
	}, resolveClosestSize);
	const size = sizeResolution.size;
	const timeoutMs = resolveOpenAIImageTimeoutMs(req.timeoutMs);
	headers.set("Content-Type", "application/json");
	const content = [{
		type: "input_text",
		text: req.prompt
	}, ...inputImages.map((image) => ({
		type: "input_image",
		image_url: toImageDataUrl({
			buffer: image.buffer,
			mimeType: image.mimeType
		}),
		detail: "auto"
	}))];
	const requestImage = async (responsesModel) => {
		const { response, release } = await postJsonRequest({
			url: `${baseUrl}/responses`,
			headers,
			body: {
				model: responsesModel,
				input: [{
					role: "user",
					content
				}],
				instructions: OPENAI_CODEX_IMAGE_INSTRUCTIONS,
				tools: [{
					type: "image_generation",
					model,
					size,
					...resolveOpenAIImageOptions(req)
				}],
				tool_choice: { type: "image_generation" },
				stream: true,
				store: false
			},
			timeoutMs,
			fetchFn: fetch,
			allowPrivateNetwork,
			ssrfPolicy: req.ssrfPolicy,
			dispatcherPolicy
		});
		try {
			await assertOkOrThrowHttpError(response, "OpenAI Codex image generation failed");
			return await readCodexImageGenerationResponse(response, {
				model,
				...resolveOutputMime(req.outputFormat)
			});
		} finally {
			await release();
		}
	};
	const [defaultResponsesModel, ...retryResponsesModels] = resolveCodexImageResponsesModels(req.cfg);
	let responsesModel = defaultResponsesModel;
	const results = [];
	for (let index = 0; index < count; index += 1) for (;;) try {
		results.push(await requestImage(responsesModel));
		break;
	} catch (error) {
		const nextResponsesModel = retryResponsesModels.shift();
		if (!nextResponsesModel || !(error instanceof ProviderHttpError) || error.status !== 400 || !isCodexModelUnavailableBody(error.errorBody, responsesModel)) throw error;
		const { createSubsystemLogger } = await import("./plugin-sdk/logging-core.js");
		createSubsystemLogger("image-generation/openai").info(`codex image responses model unavailable: responsesModel=${sanitizeLogValue(responsesModel)} retryResponsesModel=${sanitizeLogValue(nextResponsesModel)}`);
		responsesModel = nextResponsesModel;
	}
	const images = results.flatMap((result) => result.images);
	const output = resolveOutputMime(req.outputFormat);
	return {
		images: images.map((image, index) => Object.assign({}, image, { fileName: `image-${index + 1}.${output.extension}` })),
		model,
		metadata: {
			...sizeResolution.metadata,
			responses: results.map((result) => result.metadata).filter(Boolean)
		}
	};
}
function buildOpenAIImageGenerationProvider(modelAuth) {
	return {
		id: "openai",
		label: "OpenAI",
		defaultModel: OPENAI_DEFAULT_IMAGE_MODEL,
		models: [...OPENAI_IMAGE_MODELS],
		capabilities: {
			generate: {
				maxCount: 4,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			edit: {
				enabled: true,
				maxCount: 4,
				maxInputImages: OPENAI_MAX_INPUT_IMAGES,
				supportsSize: true,
				supportsAspectRatio: false,
				supportsResolution: false
			},
			geometry: {
				sizes: [...OPENAI_SUPPORTED_SIZES],
				sizesByModel: Object.fromEntries(OPENAI_FLEXIBLE_IMAGE_MODELS.map((model) => [model, []]))
			},
			output: {
				formats: [...OPENAI_OUTPUT_FORMATS],
				qualities: [...OPENAI_QUALITIES],
				qualitiesByModel: Object.fromEntries(OPENAI_IMAGE_25_MODELS.map((model) => [model, [...OPENAI_IMAGE_25_QUALITIES]])),
				backgrounds: [...OPENAI_BACKGROUNDS]
			}
		},
		isConfigured: ({ cfg, agentDir }) => modelAuth.isProviderApiKeyConfigured({
			provider: "openai",
			agentDir,
			cfg,
			capability: "image-generation"
		}) && (isPublicOpenAIImageBaseUrl(resolveConfiguredOpenAIBaseUrl(cfg)) || hasDirectOpenAIImageApiKeyAuth({
			cfg,
			agentDir
		}, modelAuth) || hasChatGPTImageRouteConfig(cfg) && hasCodexResponseTransportProfileConfigured({ agentDir }, modelAuth)),
		async generateImage(req) {
			const inputImages = req.inputImages ?? [];
			const isEdit = inputImages.length > 0;
			const rawBaseUrl = resolveConfiguredOpenAIImageBaseUrl(req.cfg, req.model);
			const publicOpenAIBaseUrl = isPublicOpenAIImageBaseUrl(rawBaseUrl);
			const chatGPTBaseUrl = isOpenAICodexBaseUrl(rawBaseUrl);
			const codexResponsesConfigured = req.cfg?.models?.providers?.openai?.api === "openai-chatgpt-responses";
			const explicitOpenAIApiKeyConfig = hasExplicitOpenAIImageApiKeyConfig(req.cfg);
			const explicitDirectOpenAIConfig = !chatGPTBaseUrl && !codexResponsesConfigured && hasExplicitDirectOpenAIImageConfig(req.cfg);
			const useCodexResponseTransportRoute = (publicOpenAIBaseUrl || chatGPTBaseUrl || codexResponsesConfigured) && !explicitDirectOpenAIConfig && hasCodexResponseTransportProfileConfigured(req, modelAuth);
			let preResolvedImageAuth;
			if (explicitOpenAIApiKeyConfig) {
				const directAuth = await resolveOptionalApiKeyForProvider({
					provider: "openai",
					capability: "image-generation",
					cfg: forceOpenAIImageApiKeyAuth(req.cfg),
					agentDir: req.agentDir,
					store: req.authStore,
					credentialPrecedence: "env-first"
				});
				preResolvedImageAuth = directAuth?.apiKey && (directAuth.mode === void 0 || directAuth.mode === "api-key") ? directAuth : null;
			}
			if (useCodexResponseTransportRoute) {
				const codexAuth = await resolveOptionalApiKeyForProvider({
					provider: "openai",
					capability: "image-generation",
					cfg: req.cfg,
					agentDir: req.agentDir,
					store: req.authStore
				});
				if (!codexAuth?.apiKey) throw new Error("OpenAI Codex OAuth missing");
				if (codexAuth.mode === "api-key") preResolvedImageAuth = codexAuth;
				else {
					const timeoutMs = resolveOpenAIImageTimeoutMs(req.timeoutMs);
					await logCodexImageAuthSelected({
						req,
						authMode: codexAuth.mode,
						timeoutMs
					});
					return generateOpenAICodexImage({
						req,
						apiKey: codexAuth.apiKey
					});
				}
			}
			let imageAuth = preResolvedImageAuth !== void 0 ? preResolvedImageAuth : await resolveOptionalApiKeyForProvider({
				provider: "openai",
				capability: "image-generation",
				cfg: req.cfg,
				agentDir: req.agentDir,
				store: req.authStore
			});
			if (!explicitDirectOpenAIConfig && imageAuth?.apiKey && isCodexSubscriptionAuthMode(imageAuth.mode)) {
				if (publicOpenAIBaseUrl) {
					const timeoutMs = resolveOpenAIImageTimeoutMs(req.timeoutMs);
					await logCodexImageAuthSelected({
						req,
						authMode: imageAuth.mode,
						timeoutMs
					});
					return generateOpenAICodexImage({
						req,
						apiKey: imageAuth.apiKey
					});
				}
				imageAuth = void 0;
			}
			if (!imageAuth?.apiKey) {
				if (!publicOpenAIBaseUrl) throw new Error("OpenAI API key missing");
				throw new Error("OpenAI API key or Codex OAuth missing");
			}
			const [{ assertOkOrThrowHttpError, postJsonRequest, postMultipartRequest, readProviderJsonResponse, resolveProviderHttpRequestConfig, sanitizeConfiguredModelProviderRequest }, { parseOpenAiCompatibleImageResponse, resolveInlineImageJsonResponseMaxBytes }, { resolveClosestSize, resolveGeneratedMediaMaxBytes }] = await Promise.all([
				import("./plugin-sdk/provider-http.js"),
				import("./plugin-sdk/image-generation.js"),
				import("./plugin-sdk/media-generation-runtime.js")
			]);
			const isAzure = isAzureOpenAIBaseUrl(rawBaseUrl);
			const openAIProviderConfig = req.cfg?.models?.providers?.openai;
			const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
				baseUrl: rawBaseUrl,
				defaultBaseUrl: DEFAULT_OPENAI_IMAGE_BASE_URL,
				allowPrivateNetwork: shouldAllowPrivateImageEndpoint(req),
				headers: filterStringRecord(openAIProviderConfig?.headers),
				request: sanitizeConfiguredModelProviderRequest(openAIProviderConfig?.request),
				api: openAIProviderConfig?.api,
				defaultHeaders: isAzure ? { "api-key": imageAuth.apiKey } : { Authorization: `Bearer ${imageAuth.apiKey}` },
				provider: "openai",
				capability: "image",
				transport: "http"
			});
			const model = resolveOpenAIImageRequestModel(req, { allowTransparentDefaultReroute: publicOpenAIBaseUrl });
			const count = resolveIntegerOption(req.count, 1, {
				min: 1,
				max: OPENAI_MAX_IMAGE_RESULTS
			});
			const timeoutMs = resolveOpenAIImageTimeoutMs(req.timeoutMs, { isAzure });
			const sizeResolution = isValidFlexibleOpenAIImageSize(model, req.size) ? { size: req.size } : resolveOpenAIImageRequestSize({
				model,
				requestedSize: req.size,
				applyNativeLimits: publicOpenAIBaseUrl || isAzure
			}, resolveClosestSize);
			const size = sizeResolution.size;
			const url = isAzure ? buildAzureImageUrl(rawBaseUrl, model, isEdit ? "edits" : "generations") : `${baseUrl}/images/${isEdit ? "edits" : "generations"}`;
			const body = {
				...!isAzure ? { model } : {},
				prompt: req.prompt,
				n: count,
				size,
				...resolveOpenAIImageOptions(req),
				...req.providerOptions?.openai?.user !== void 0 ? { user: req.providerOptions.openai.user } : {}
			};
			const requestOptions = {
				url,
				headers: new Headers(headers),
				timeoutMs,
				fetchFn: fetch,
				allowPrivateNetwork,
				ssrfPolicy: req.ssrfPolicy,
				dispatcherPolicy
			};
			const form = isEdit ? new FormData() : void 0;
			if (form) {
				for (const [key, value] of Object.entries(body)) form.set(key, String(value));
				for (const [index, image] of inputImages.entries()) {
					const mimeType = image.mimeType?.trim() || DEFAULT_OUTPUT_MIME;
					form.append("image[]", new Blob([bufferToBlobPart(image.buffer)], { type: mimeType }), inferImageUploadFileName({
						fileName: image.fileName,
						mimeType,
						index
					}));
				}
				requestOptions.headers.delete("Content-Type");
			} else requestOptions.headers.set("Content-Type", "application/json");
			const { response, release } = form ? await postMultipartRequest({
				...requestOptions,
				body: form
			}) : await postJsonRequest({
				...requestOptions,
				body
			});
			try {
				await assertOkOrThrowHttpError(response, isEdit ? "OpenAI image edit failed" : "OpenAI image generation failed");
				const data = await readProviderJsonResponse(response, "openai.image-generation", { maxBytes: resolveInlineImageJsonResponseMaxBytes(count, resolveGeneratedMediaMaxBytes(req.cfg, "image")) });
				const output = resolveOutputMime(req.outputFormat);
				const images = parseOpenAiCompatibleImageResponse(data, {
					defaultMimeType: output.mimeType,
					malformedResponseError: isEdit ? "OpenAI image edit response malformed" : "OpenAI image generation response malformed"
				}).map((image, index) => Object.assign(image, { fileName: `image-${index + 1}.${output.extension}` }));
				if (images.length === 0) throw new Error(isEdit ? "OpenAI image edit response missing image data" : "OpenAI image generation response missing image data");
				return {
					images,
					model,
					...sizeResolution.metadata ? { metadata: sizeResolution.metadata } : {}
				};
			} finally {
				await release();
			}
		}
	};
}
//#endregion
export { buildOpenAIImageGenerationProvider as t };
