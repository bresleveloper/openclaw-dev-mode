import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { shouldUseEnvHttpProxyForUrl } from "openclaw/plugin-sdk/fetch-runtime";
//#region extensions/llama-cpp/src/media-config.ts
const LLAMA_CPP_MEDIA_MAX_BYTES = 10485760;
const LLAMA_CPP_MEDIA_MAX_TOKENS = 2048;
const LLAMA_CPP_MEDIA_MAX_CHARS = 12e3;
const LLAMA_CPP_MEDIA_TIMEOUT_MS = 6e5;
/** Managed media never sends image bytes to an external provider endpoint. */
function isManagedLlamaCppMediaProvider(provider) {
	if (!provider?.localService || provider.request?.proxy?.mode === "explicit-proxy") return false;
	try {
		const url = new URL(provider.baseUrl);
		return url.protocol === "http:" && (url.hostname === "127.0.0.1" || url.hostname === "[::1]") && !shouldUseEnvHttpProxyForUrl(url.href) && !url.username && !url.password;
	} catch {
		return false;
	}
}
/** Saved recipe selections, never inferred from an image's prompt or filename. */
function resolveLlamaCppMediaModels(provider) {
	const models = provider?.params?.mediaModels;
	if (!isRecord(models)) return;
	const ocr = normalizeOptionalString(models.ocr);
	const vision = normalizeOptionalString(models.vision);
	return ocr && vision ? {
		ocr,
		vision
	} : void 0;
}
//#endregion
export { isManagedLlamaCppMediaProvider as a, LLAMA_CPP_MEDIA_TIMEOUT_MS as i, LLAMA_CPP_MEDIA_MAX_CHARS as n, resolveLlamaCppMediaModels as o, LLAMA_CPP_MEDIA_MAX_TOKENS as r, LLAMA_CPP_MEDIA_MAX_BYTES as t };
