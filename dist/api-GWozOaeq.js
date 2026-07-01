import { p as readStringValue, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { l as normalizeProviderId } from "./provider-model-shared-pp09751S.js";
import "./model-compat-N1xYTYJ8.js";
import "./model-definitions-hIIFNOdb.js";
import "./provider-catalog-D0xI-Af_.js";
import "./onboard-Qeg0j1Ze.js";
import "./image-generation-provider-Avimmg4J.js";
import "./runtime-model-compat-U00nJ5fY.js";
import "./provider-models-DgtUsS5J.js";
//#region extensions/xai/api.ts
const XAI_NATIVE_ENDPOINT_HOSTS = new Set(["api.x.ai"]);
function resolveHostname(value) {
	try {
		return new URL(value).hostname.toLowerCase();
	} catch {
		return;
	}
}
function isXaiNativeEndpoint(baseUrl) {
	return typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "");
}
function isXaiModelHint(modelId) {
	return getModelProviderHint(modelId) === "x-ai";
}
function getModelProviderHint(modelId) {
	const trimmed = normalizeOptionalLowercaseString(modelId);
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return null;
	return trimmed.slice(0, slashIndex) || null;
}
function shouldUseXaiResponsesTransport(params) {
	if (params.api !== "openai-completions") return false;
	if (isXaiNativeEndpoint(params.baseUrl)) return true;
	return normalizeProviderId(params.provider) === "xai" && !params.baseUrl;
}
function resolveXaiTransport(params) {
	if (!shouldUseXaiResponsesTransport(params)) return;
	return {
		api: "openai-responses",
		baseUrl: readStringValue(params.baseUrl)
	};
}
function resolveXaiBaseUrl(baseUrlOrConfig) {
	let candidate = baseUrlOrConfig;
	if (baseUrlOrConfig && typeof baseUrlOrConfig === "object" && !Array.isArray(baseUrlOrConfig) && "cfg" in baseUrlOrConfig) candidate = baseUrlOrConfig.cfg?.models?.providers?.xai?.baseUrl ?? baseUrlOrConfig;
	return readStringValue(candidate) || "https://api.x.ai/v1";
}
//#endregion
export { resolveXaiBaseUrl as n, resolveXaiTransport as r, isXaiModelHint as t };
