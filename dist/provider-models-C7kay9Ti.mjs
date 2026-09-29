import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { d as resolveFamilyForwardCompatModel } from "./provider-model-shared-DwrT_ZjA.mjs";
import { n as normalizeGoogleModelId } from "./model-id-CAmKILzd.mjs";
//#region extensions/google/provider-models.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
const GOOGLE_ANTIGRAVITY_PROVIDER_ID = "google-antigravity";
const GEMINI_2_5_PRO_PREFIX = "gemini-2.5-pro";
const GEMINI_2_5_FLASH_LITE_PREFIX = "gemini-2.5-flash-lite";
const GEMINI_2_5_FLASH_PREFIX = "gemini-2.5-flash";
const GEMINI_3_PRO_RE = /^gemini-3(?:\.\d+)?-pro(?:-|$)/;
const GEMINI_3_FLASH_LITE_RE = /^gemini-3(?:\.\d+)?-flash-lite(?:-|$)/;
const GEMINI_3_FLASH_RE = /^gemini-3(?:\.\d+)?-flash(?:-|$)/;
const GEMINI_PRO_LATEST_ID = "gemini-pro-latest";
const GEMINI_FLASH_LATEST_ID = "gemini-flash-latest";
const GEMINI_FLASH_LITE_LATEST_ID = "gemini-flash-lite-latest";
const GEMMA_PREFIX = "gemma-";
const GEMINI_2_5_PRO_TEMPLATE_IDS = ["gemini-2.5-pro"];
const GEMINI_2_5_FLASH_LITE_TEMPLATE_IDS = ["gemini-2.5-flash-lite"];
const GEMINI_2_5_FLASH_TEMPLATE_IDS = ["gemini-2.5-flash"];
const GEMINI_3_1_PRO_TEMPLATE_IDS = ["gemini-3.1-pro-preview", "gemini-3-pro-preview"];
const GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS = ["gemini-3.1-flash-lite"];
const GEMINI_3_1_FLASH_TEMPLATE_IDS = ["gemini-3-flash-preview", "gemini-2.5-flash"];
const GEMINI_3_PRO_ANTIGRAVITY_TEMPLATE_IDS = ["gemini-3-pro-low", "gemini-3-pro-high"];
const GEMINI_3_FLASH_ANTIGRAVITY_TEMPLATE_IDS = ["gemini-3-flash"];
const GEMMA_TEMPLATE_IDS = GEMINI_3_1_FLASH_TEMPLATE_IDS;
const GOOGLE_PROVIDER_PREFIX = "google/";
const GOOGLE_NON_TEXT_MODEL_ID_MARKERS = [
	"-image",
	"-tts",
	"-live",
	"native-audio"
];
function normalizeGeminiProRequestId(id) {
	if (id.startsWith(GOOGLE_PROVIDER_PREFIX)) {
		const modelId = id.slice(7);
		const normalizedModelId = normalizeGeminiProRequestId(modelId);
		return normalizedModelId === modelId ? id : `${GOOGLE_PROVIDER_PREFIX}${normalizedModelId}`;
	}
	if (id === "gemini-3-pro" || id === "gemini-3-pro-preview" || id === "gemini-3.1-pro") return "gemini-3.1-pro-preview";
	if (id === "gemma-4-26b") return normalizeGoogleModelId(id);
	return id;
}
function googleFamilyModelId(id) {
	const unqualified = id.startsWith(GOOGLE_PROVIDER_PREFIX) ? id.slice(7) : id;
	return unqualified.startsWith("models/") ? unqualified.slice(7) : unqualified;
}
function isGoogleTextGenerationModelId(id) {
	const lower = normalizeOptionalLowercaseString(googleFamilyModelId(id)) ?? "";
	if (GOOGLE_NON_TEXT_MODEL_ID_MARKERS.some((marker) => lower.includes(marker))) return false;
	return lower.startsWith(GEMINI_2_5_PRO_PREFIX) || lower.startsWith(GEMINI_2_5_FLASH_LITE_PREFIX) || lower.startsWith(GEMINI_2_5_FLASH_PREFIX) || GEMINI_3_PRO_RE.test(lower) || GEMINI_3_FLASH_LITE_RE.test(lower) || GEMINI_3_FLASH_RE.test(lower) || lower === GEMINI_PRO_LATEST_ID || lower === GEMINI_FLASH_LATEST_ID || lower === GEMINI_FLASH_LITE_LATEST_ID || lower.startsWith(GEMMA_PREFIX);
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
	const seen = /* @__PURE__ */ new Set();
	const sources = [];
	for (const providerId of orderedTemplateProviderIds) {
		const trimmed = providerId?.trim();
		if (!trimmed || seen.has(trimmed)) continue;
		seen.add(trimmed);
		sources.push({
			providerId: trimmed,
			templateIds: templateIdsForProvider(trimmed, params.family)
		});
	}
	return sources;
}
const GOOGLE_FORWARD_COMPAT_CASES = [
	{
		match: (id) => id.startsWith(GEMINI_2_5_PRO_PREFIX),
		family: [
			GEMINI_2_5_PRO_TEMPLATE_IDS,
			GEMINI_3_1_PRO_TEMPLATE_IDS,
			void 0,
			true
		]
	},
	{
		match: (id) => id.startsWith(GEMINI_2_5_FLASH_LITE_PREFIX),
		family: [
			GEMINI_2_5_FLASH_LITE_TEMPLATE_IDS,
			GEMINI_3_1_FLASH_LITE_TEMPLATE_IDS,
			void 0,
			true
		]
	},
	{
		match: (id) => id.startsWith(GEMINI_2_5_FLASH_PREFIX),
		family: [
			GEMINI_2_5_FLASH_TEMPLATE_IDS,
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
			GEMINI_3_PRO_ANTIGRAVITY_TEMPLATE_IDS
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
		match: (id) => id.startsWith(GEMMA_PREFIX),
		family: [GEMMA_TEMPLATE_IDS, GEMMA_TEMPLATE_IDS],
		patch: ({ normalizedModelId }) => normalizedModelId.startsWith("gemma-4") ? { reasoning: true } : void 0
	}
];
function resolveGoogleStaticModelId(id, staticIds) {
	const canonical = normalizeGoogleModelId(id);
	if (staticIds.has(canonical)) return canonical;
	const dateless = canonical.replace(/(?:-preview)?-\d{2}-\d{2}$/, "");
	if (dateless !== canonical) {
		const canonicalDateless = normalizeGoogleModelId(dateless);
		if (staticIds.has(canonicalDateless)) return canonicalDateless;
	}
	if (!(canonical === GEMINI_PRO_LATEST_ID || canonical === GEMINI_FLASH_LATEST_ID || canonical === GEMINI_FLASH_LITE_LATEST_ID)) return;
	return GOOGLE_FORWARD_COMPAT_CASES.find((entry) => typeof entry.match === "function" ? entry.match(canonical) : entry.match.includes(canonical))?.family[0].find((templateId) => staticIds.has(templateId));
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
			patch
		}))
	});
}
function isModernGoogleModel(modelId) {
	const lower = normalizeOptionalLowercaseString(modelId) ?? "";
	return lower.startsWith("gemini-2.5") || lower.startsWith("gemini-3") || lower === GEMINI_PRO_LATEST_ID || lower === GEMINI_FLASH_LATEST_ID || lower === GEMINI_FLASH_LITE_LATEST_ID || lower.startsWith(GEMMA_PREFIX);
}
//#endregion
export { resolveGoogleStaticModelId as a, resolveGoogleGeminiForwardCompatModel as i, isGoogleTextGenerationModelId as n, isModernGoogleModel as r, isGoogleNativeVideoModelId as t };
