import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { n as normalizeGooglePreviewModelId } from "./provider-model-id-normalize-DjenOxD2.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { l as resolveFamilyForwardCompatModel } from "./provider-model-shared-B_4afNJ5.mjs";
import "./provider-catalog-shared-Di2nlF3g.mjs";
import { t as stripGoogleProviderPrefix } from "./model-id-B1FKGbAg.mjs";
import { a as isOfficialGoogleAiStudioBaseUrl } from "./google-api-base-url-BSKc6KBi.mjs";
//#region extensions/google/provider-models.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
const GOOGLE_ANTIGRAVITY_PROVIDER_ID = "google-antigravity";
const GEMINI_3_PRO_RE = /^gemini-3(?:\.\d+)?-pro(?:-|$)/;
const GEMINI_3_FLASH_LITE_RE = /^gemini-3(?:\.\d+)?-flash-lite(?:-|$)/;
const GEMINI_3_FLASH_RE = /^gemini-3(?:\.\d+)?-flash(?:-|$)/;
const GEMINI_4_RE = /^gemini-4(?:[.-]|$)/;
const GEMINI_PRO_LATEST_ID = "gemini-pro-latest";
const GEMINI_FLASH_LATEST_ID = "gemini-flash-latest";
const GEMINI_FLASH_LITE_LATEST_ID = "gemini-flash-lite-latest";
const GEMMA_PREFIX = "gemma-";
const GEMINI_3_1_PRO_TEMPLATE_IDS = ["gemini-3.1-pro-preview", "gemini-3-pro-preview"];
const GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS = ["gemini-3.1-flash-lite"];
const GEMINI_3_1_FLASH_TEMPLATE_IDS = ["gemini-3-flash-preview", "gemini-2.5-flash"];
const GEMINI_3_FLASH_ANTIGRAVITY_TEMPLATE_IDS = ["gemini-3-flash"];
const GEMINI_4_TEMPLATE_IDS = ["gemini-4-argon"];
const GOOGLE_PROVIDER_PREFIX = "google/";
const GOOGLE_NON_TEXT_MODEL_ID_MARKERS = [
	"-image",
	"-tts",
	"-live",
	"-embedding",
	"native-audio"
];
function normalizeGeminiProRequestId(id) {
	if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
		const modelId = id.slice(7);
		const normalizedModelId = normalizeGeminiProRequestId(modelId);
		return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
	}
	if (id === "gemini-3-pro" || id === "gemini-3-pro-preview" || id === "gemini-3.1-pro") return "gemini-3.1-pro-preview";
	if (id === "gemma-4-26b") return normalizeGooglePreviewModelId(id);
	return id;
}
function googleFamilyModelId(id) {
	const unqualified = id.startsWith(GOOGLE_PROVIDER_PREFIX) ? id.slice(7) : id;
	return unqualified.startsWith("models/") ? unqualified.slice(7) : unqualified;
}
function isGoogleTextGenerationModelId(id) {
	const lower = normalizeOptionalLowercaseString(googleFamilyModelId(id)) ?? "";
	if (GOOGLE_NON_TEXT_MODEL_ID_MARKERS.some((marker) => lower.includes(marker))) return false;
	return GOOGLE_FORWARD_COMPAT_CASES.some((entry) => entry.match(lower));
}
function isGoogleFlashTextModelId(id) {
	const lower = normalizeOptionalLowercaseString(googleFamilyModelId(id)) ?? "";
	return isGoogleTextGenerationModelId(lower) && /^gemini-(?:\d+(?:\.\d+)?-)?flash(?:-|$)/.test(lower);
}
function resolveGoogleModelApi(params) {
	if (params.provider !== "google") return params.api;
	const models = params.providerConfig?.models;
	const model = models?.find((entry) => entry.id === params.modelId) ?? models?.find((entry) => normalizeGooglePreviewModelId(stripGoogleProviderPrefix(entry.id)) === normalizeGooglePreviewModelId(stripGoogleProviderPrefix(params.modelId)));
	const explicitApi = model?.api ?? params.providerConfig?.api;
	if (explicitApi) return explicitApi;
	if (params.api !== "google-generative-ai" && params.api !== "google-interactions") return params.api;
	const baseUrl = model?.baseUrl ?? params.providerConfig?.baseUrl ?? params.baseUrl;
	return isOfficialGoogleAiStudioBaseUrl(baseUrl) && isGoogleFlashTextModelId(params.modelId) ? "google-interactions" : "google-generative-ai";
}
function isGoogleNativeVideoModelId(id) {
	const normalized = normalizeOptionalLowercaseString(googleFamilyModelId(id)) ?? "";
	return normalized.startsWith("gemini-") && isGoogleTextGenerationModelId(normalized);
}
function isGoogleGeminiCliProvider(providerId) {
	return normalizeOptionalLowercaseString(providerId) === GOOGLE_GEMINI_CLI_PROVIDER_ID;
}
function isGoogleAntigravityProvider(providerId) {
	return normalizeOptionalLowercaseString(providerId) === GOOGLE_ANTIGRAVITY_PROVIDER_ID;
}
function templateIdsForProvider(templateProviderId, family) {
	if (isGoogleGeminiCliProvider(templateProviderId)) return family[1];
	if (isGoogleAntigravityProvider(templateProviderId)) return family[2] ?? family[0];
	return family[0];
}
function buildGoogleTemplateSources(params) {
	const defaultTemplateProviderId = params.templateProviderId?.trim() ? params.templateProviderId : isGoogleGeminiCliProvider(params.providerId) ? "google" : GOOGLE_GEMINI_CLI_PROVIDER_ID;
	const orderedTemplateProviderIds = isGoogleGeminiCliProvider(params.providerId) && params.family[3] === true ? [defaultTemplateProviderId, params.providerId] : [params.providerId, defaultTemplateProviderId];
	return normalizeUniqueTrimmedStringList(orderedTemplateProviderIds).map((providerId) => ({
		providerId,
		templateIds: templateIdsForProvider(providerId, params.family)
	}));
}
const GOOGLE_FORWARD_COMPAT_CASES = [
	{
		match: (id) => id.startsWith("gemini-2.5-pro"),
		family: [
			["gemini-2.5-pro"],
			GEMINI_3_1_PRO_TEMPLATE_IDS,
			void 0,
			true
		]
	},
	{
		match: (id) => id.startsWith("gemini-2.5-flash-lite"),
		family: [
			["gemini-2.5-flash-lite"],
			GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS,
			void 0,
			true
		]
	},
	{
		match: (id) => id.startsWith("gemini-2.5-flash"),
		family: [
			["gemini-2.5-flash"],
			GEMINI_3_1_FLASH_TEMPLATE_IDS,
			void 0,
			true
		]
	},
	{
		match: (id) => GEMINI_3_PRO_RE.test(id) || id === GEMINI_PRO_LATEST_ID,
		family: [
			GEMINI_3_1_PRO_TEMPLATE_IDS,
			GEMINI_3_1_PRO_TEMPLATE_IDS,
			["gemini-3-pro-low", "gemini-3-pro-high"]
		],
		patch: ({ providerId }) => providerId === "google" || providerId === GOOGLE_GEMINI_CLI_PROVIDER_ID ? { reasoning: true } : void 0
	},
	{
		match: (id) => GEMINI_3_FLASH_LITE_RE.test(id) || id === GEMINI_FLASH_LITE_LATEST_ID,
		family: [
			GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS,
			GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS,
			GEMINI_3_FLASH_ANTIGRAVITY_TEMPLATE_IDS
		]
	},
	{
		match: (id) => GEMINI_3_FLASH_RE.test(id) || id === GEMINI_FLASH_LATEST_ID,
		family: [
			GEMINI_3_1_FLASH_TEMPLATE_IDS,
			GEMINI_3_1_FLASH_TEMPLATE_IDS,
			GEMINI_3_FLASH_ANTIGRAVITY_TEMPLATE_IDS
		]
	},
	{
		match: (id) => GEMINI_4_RE.test(id),
		family: [GEMINI_4_TEMPLATE_IDS, GEMINI_4_TEMPLATE_IDS]
	},
	{
		match: (id) => id.startsWith(GEMMA_PREFIX),
		family: [GEMINI_3_1_FLASH_TEMPLATE_IDS, GEMINI_3_1_FLASH_TEMPLATE_IDS],
		patch: ({ normalizedModelId }) => normalizedModelId.startsWith("gemma-4") ? { reasoning: true } : void 0
	}
];
function resolveGoogleStaticModelId(id, staticIds) {
	const canonical = normalizeGooglePreviewModelId(id);
	if (staticIds.has(canonical)) return canonical;
	const dateless = canonical.replace(/(?:-preview)?-\d{2}-\d{2}$/, "");
	if (dateless !== canonical) {
		const canonicalDateless = normalizeGooglePreviewModelId(dateless);
		if (staticIds.has(canonicalDateless)) return canonicalDateless;
	}
	if (!(canonical === GEMINI_PRO_LATEST_ID || canonical === GEMINI_FLASH_LATEST_ID || canonical === GEMINI_FLASH_LITE_LATEST_ID)) return;
	return GOOGLE_FORWARD_COMPAT_CASES.find((entry) => entry.match(canonical))?.family[0].find((templateId) => staticIds.has(templateId));
}
function resolveGoogleGeminiForwardCompatModel(params) {
	const trimmed = normalizeGeminiProRequestId(params.ctx.modelId.trim());
	const lower = normalizeOptionalLowercaseString(googleFamilyModelId(trimmed)) ?? "";
	return resolveFamilyForwardCompatModel({
		providerId: params.providerId,
		modelId: trimmed,
		normalizedModelId: isGoogleTextGenerationModelId(lower) ? lower : "",
		ctx: params.ctx,
		patch: { provider: params.providerId },
		cases: GOOGLE_FORWARD_COMPAT_CASES.map(({ family, match, patch }) => ({
			match,
			get templateSources() {
				return buildGoogleTemplateSources({
					providerId: params.providerId,
					templateProviderId: params.templateProviderId,
					family
				});
			},
			patch: (context) => ({
				...typeof patch === "function" ? patch(context) : patch,
				...params.providerId === "google" ? { api: resolveGoogleModelApi({
					provider: params.providerId,
					modelId: trimmed,
					api: "google-generative-ai",
					baseUrl: context.template?.baseUrl,
					providerConfig: params.ctx.providerConfig ?? resolveMergedModelProviderConfig(params.ctx.config, params.providerId)
				}) } : context.template?.api === "google-interactions" ? { api: "google-generative-ai" } : {}
			})
		}))
	});
}
function isModernGoogleModel(modelId) {
	const lower = normalizeOptionalLowercaseString(modelId) ?? "";
	return lower.startsWith("gemini-2.5") || lower.startsWith("gemini-3") || GEMINI_4_RE.test(lower) || lower === GEMINI_PRO_LATEST_ID || lower === GEMINI_FLASH_LATEST_ID || lower === GEMINI_FLASH_LITE_LATEST_ID || lower.startsWith(GEMMA_PREFIX);
}
//#endregion
export { resolveGoogleGeminiForwardCompatModel as a, isModernGoogleModel as i, isGoogleNativeVideoModelId as n, resolveGoogleModelApi as o, isGoogleTextGenerationModelId as r, resolveGoogleStaticModelId as s, isGoogleFlashTextModelId as t };
