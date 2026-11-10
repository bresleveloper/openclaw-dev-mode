import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList, p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { f as readProviderJsonArrayFieldResponse, n as assertOkOrThrowHttpError } from "./provider-http-errors-CjVOxCE5.mjs";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-WdycwKIG.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { h as resolveProviderHttpRequestConfig } from "./shared-BMUa_P4s.mjs";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-CMRSW7VK.mjs";
import "./provider-http-BuV15s4V.mjs";
import { r as getCachedLiveCatalogValue } from "./provider-catalog-shared-Di2nlF3g.mjs";
import { t as OPENROUTER_BASE_URL } from "./provider-defaults-ilQX6q3J.mjs";
import "./provider-catalog-CNn8GbrF.mjs";
import { t as fetchOpenRouterVideoGet } from "./video-http-D46yDKf3.mjs";
//#region extensions/openrouter/video-model-catalog.ts
const DEFAULT_HTTP_TIMEOUT_MS = 6e4;
function normalizeNumberArray(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "number" && Number.isFinite(entry)) : [];
}
function normalizeResolutionArray(value) {
	return normalizeTrimmedStringList(value).map((entry) => entry.toUpperCase());
}
function normalizeFrameImageRoles(value) {
	return normalizeUniqueTrimmedStringList(value).filter((entry) => entry === "first_frame" || entry === "last_frame");
}
function normalizeStringRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = {};
	for (const [key, raw] of Object.entries(value)) {
		const normalized = normalizeOptionalString(raw);
		if (normalized) record[key] = normalized;
	}
	return Object.keys(record).length > 0 ? record : void 0;
}
function buildOpenRouterVideoModeCapabilities(params) {
	return {
		maxVideos: 1,
		...params.durations.length > 0 ? { supportedDurationSeconds: params.durations } : {},
		...params.aspectRatios.length > 0 ? {
			supportsAspectRatio: true,
			aspectRatios: params.aspectRatios
		} : {},
		...params.resolutions.length > 0 ? {
			supportsResolution: true,
			resolutions: params.resolutions
		} : {},
		...params.sizes.length > 0 ? {
			supportsSize: true,
			sizes: params.sizes
		} : {},
		...params.supportsAudio === void 0 ? {} : { supportsAudio: params.supportsAudio }
	};
}
function buildOpenRouterVideoModelCapabilities(model) {
	const aspectRatios = normalizeTrimmedStringList(model.supported_aspect_ratios);
	const durations = normalizeNumberArray(model.supported_durations);
	const frameImages = normalizeFrameImageRoles(model.supported_frame_images);
	const resolutions = normalizeResolutionArray(model.supported_resolutions);
	const sizes = normalizeTrimmedStringList(model.supported_sizes);
	const allowedPassthroughParameters = normalizeTrimmedStringList(model.allowed_passthrough_parameters);
	const modeCapabilities = buildOpenRouterVideoModeCapabilities({
		durations,
		aspectRatios,
		resolutions,
		sizes,
		supportsAudio: typeof model.generate_audio === "boolean" ? model.generate_audio : void 0
	});
	const capabilities = {
		providerOptions: {
			callback_url: "string",
			seed: "number"
		},
		generate: modeCapabilities,
		imageToVideo: {
			enabled: frameImages.length > 0,
			...modeCapabilities,
			...frameImages.length > 0 ? { maxInputImages: frameImages.length } : {}
		},
		videoToVideo: { enabled: false }
	};
	const canonicalSlug = normalizeOptionalString(model.canonical_slug);
	if (canonicalSlug) capabilities.canonicalSlug = canonicalSlug;
	const description = normalizeOptionalString(model.description);
	if (description) capabilities.description = description;
	if (typeof model.created === "number" && Number.isFinite(model.created)) capabilities.created = model.created;
	const pricingSkus = normalizeStringRecord(model.pricing_skus);
	if (pricingSkus) capabilities.pricingSkus = pricingSkus;
	if (allowedPassthroughParameters.length > 0) capabilities.allowedPassthroughParameters = allowedPassthroughParameters;
	return capabilities;
}
function projectOpenRouterVideoModelsToCatalogEntries(models) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const model of models) {
		if (!isRecord(model)) continue;
		const id = normalizeOptionalString(model.id);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const entry = {
			kind: "video_generation",
			provider: "openrouter",
			model: id,
			source: "live",
			capabilities: buildOpenRouterVideoModelCapabilities(model)
		};
		const name = normalizeOptionalString(model.name);
		if (name) entry.label = name;
		entries.push(entry);
	}
	return entries;
}
async function fetchOpenRouterVideoModels(params) {
	const request = sanitizeConfiguredModelProviderRequest(params.request);
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } = resolveProviderHttpRequestConfig({
		provider: "openrouter",
		capability: "video",
		baseUrl: params.baseUrl,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		defaultHeaders: { Authorization: `Bearer ${params.apiKey}` },
		request
	});
	return await getCachedLiveCatalogValue({
		keyParts: [
			"openrouter",
			"video-models",
			baseUrl,
			params.apiKey,
			request ?? null
		],
		load: async () => {
			const { response, release } = await fetchOpenRouterVideoGet({
				url: "videos/models",
				baseUrl,
				headers,
				timeoutMs: params.timeoutMs,
				allowPrivateNetwork,
				dispatcherPolicy,
				auditContext: "openrouter-video-models"
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter video models request failed");
				return await readProviderJsonArrayFieldResponse(response, "OpenRouter video models request failed", "data");
			} finally {
				await release();
			}
		}
	});
}
async function listOpenRouterVideoModelCatalog(ctx) {
	const { discoveryApiKey: apiKey } = ctx.resolveProviderApiKey("openrouter");
	if (!apiKey) return null;
	return projectOpenRouterVideoModelsToCatalogEntries(await fetchOpenRouterVideoModels({
		baseUrl: ctx.config.models?.providers?.openrouter?.baseUrl,
		apiKey,
		request: ctx.config.models?.providers?.openrouter?.request,
		timeoutMs: ctx.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS
	}));
}
async function resolveOpenRouterVideoModelCapabilities(ctx) {
	const auth = await resolveApiKeyForProvider({
		provider: "openrouter",
		cfg: ctx.cfg,
		agentDir: ctx.agentDir,
		store: ctx.authStore
	});
	if (!auth.apiKey) return;
	const model = (await fetchOpenRouterVideoModels({
		baseUrl: ctx.cfg?.models?.providers?.openrouter?.baseUrl,
		apiKey: auth.apiKey,
		request: ctx.cfg?.models?.providers?.openrouter?.request,
		timeoutMs: ctx.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS
	})).find((row) => {
		const id = isRecord(row) ? normalizeOptionalString(row.id) : void 0;
		return id !== void 0 && id === ctx.model;
	});
	return isRecord(model) ? buildOpenRouterVideoModelCapabilities(model) : void 0;
}
//#endregion
export { resolveOpenRouterVideoModelCapabilities as n, listOpenRouterVideoModelCatalog as t };
