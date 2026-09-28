import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as decodeTextPrefix } from "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as readResponseTextPrefix } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { a as createProviderErrorTextRedactor, m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { l as postJsonRequest, m as resolveProviderHttpRequestConfigWithOriginTrust } from "./shared-BLFkM12I.mjs";
import { r as resolveProviderTransportSsrFPolicy } from "./provider-transport-fetch-DnNw-XtJ.mjs";
//#region src/infra/http-error-body.ts
const errorBodyLog = createSubsystemLogger("http-error-body");
async function readResponseBodySnippet(response, limits) {
	const normalize = (text, truncated) => truncateUtf16Safe(limits.redact?.(text, { truncated }) ?? text, limits.maxChars);
	try {
		const body = response.body;
		if (!body || typeof body.getReader !== "function") {
			const text = await response.text();
			const encoded = new TextEncoder().encode(text);
			if (encoded.byteLength > limits.maxBytes) return normalize(decodeTextPrefix(encoded.subarray(0, limits.maxBytes), { truncated: true }), true);
			return normalize(text, false);
		}
		const prefix = await readResponseTextPrefix(response, limits.maxBytes);
		return normalize(prefix.text, prefix.truncated);
	} catch (err) {
		errorBodyLog.warn(`Failed to read response body snippet: ${formatErrorMessage(err)}`);
		return "";
	}
}
//#endregion
//#region src/agents/minimax-vlm.ts
/**
* Adapts MiniMax VLM image-understanding requests for agent image inputs.
*/
const MINIMAX_VLM_ERROR_BODY_MAX_BYTES = 8192;
const MINIMAX_VLM_ERROR_BODY_MAX_CHARS = 400;
const DEFAULT_MINIMAX_VLM_TIMEOUT_MS = 6e4;
function isMinimaxVlmProvider(provider) {
	const normalized = provider.trim().toLowerCase();
	return normalized === "minimax" || normalized === "minimax-cn" || normalized === "minimax-portal" || normalized === "minimax-portal-cn";
}
function isMinimaxVlmModel(provider, modelId) {
	return isMinimaxVlmProvider(provider) && modelId.trim() === "MiniMax-VL-01";
}
function isMinimaxCnProvider(provider) {
	const normalized = provider?.trim().toLowerCase();
	return normalized === "minimax-cn" || normalized === "minimax-portal-cn";
}
function resolveDefaultApiHost(provider) {
	return isMinimaxCnProvider(provider) ? "https://api.minimaxi.com" : "https://api.minimax.io";
}
function coerceApiHost(params) {
	const env = params.env ?? process.env;
	const defaultHost = resolveDefaultApiHost(params.provider);
	const raw = params.apiHost?.trim() || env.MINIMAX_API_HOST?.trim() || params.modelBaseUrl?.trim() || defaultHost;
	try {
		return new URL(raw).origin;
	} catch {}
	if (/^[a-z][a-z\d+.-]*:\/\//i.test(raw)) return defaultHost;
	try {
		return new URL(`https://${raw}`).origin;
	} catch {
		return defaultHost;
	}
}
function pickString(rec, key) {
	const v = rec[key];
	return typeof v === "string" ? v : "";
}
async function minimaxUnderstandImage(params) {
	const apiKey = normalizeSecretInput(params.apiKey);
	if (!apiKey) throw new Error("MiniMax VLM: apiKey required");
	const prompt = params.prompt.trim();
	if (!prompt) throw new Error("MiniMax VLM: prompt required");
	const imageDataUrl = params.imageDataUrl.trim();
	if (!imageDataUrl) throw new Error("MiniMax VLM: imageDataUrl required");
	if (!/^data:image\/(png|jpeg|webp);base64,/i.test(imageDataUrl)) throw new Error("MiniMax VLM: imageDataUrl must be a base64 data:image/(png|jpeg|webp) URL");
	const configuredHost = coerceApiHost({
		apiHost: params.apiHost,
		modelBaseUrl: params.modelBaseUrl,
		provider: params.provider
	});
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy, trustConfiguredBaseUrlOrigin } = resolveProviderHttpRequestConfigWithOriginTrust({
		baseUrl: configuredHost,
		defaultBaseUrl: resolveDefaultApiHost(params.provider),
		allowPrivateNetwork: params.allowPrivateNetwork,
		defaultHeaders: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"MM-API-Source": "OpenClaw"
		},
		request: params.request,
		provider: params.provider ?? "minimax",
		capability: "image",
		transport: "media-understanding"
	});
	const url = new URL("/v1/coding_plan/vlm", baseUrl).toString();
	const timeoutMs = resolvePositiveTimerTimeoutMs(params.timeoutMs, DEFAULT_MINIMAX_VLM_TIMEOUT_MS);
	const ssrfPolicy = resolveProviderTransportSsrFPolicy({
		baseUrl,
		url,
		allowPrivateNetwork,
		trustConfiguredBaseUrlOrigin
	});
	const guarded = await postJsonRequest({
		url,
		headers,
		body: {
			prompt,
			image_url: imageDataUrl
		},
		timeoutMs,
		...params.signal ? { signal: params.signal } : {},
		fetchFn: fetch,
		allowPrivateNetwork,
		ssrfPolicy,
		dispatcherPolicy,
		auditContext: "minimax-vlm"
	});
	const res = guarded.response;
	const redactErrorText = createProviderErrorTextRedactor({
		headers,
		request: params.request,
		defaultAuthHeader: "Authorization",
		defaultAuthPrefix: "Bearer "
	});
	try {
		const traceId = redactErrorText(res.headers.get("Trace-Id") ?? "");
		if (!res.ok) {
			const body = await readResponseBodySnippet(res, {
				maxBytes: MINIMAX_VLM_ERROR_BODY_MAX_BYTES,
				maxChars: MINIMAX_VLM_ERROR_BODY_MAX_CHARS,
				redact: redactErrorText
			});
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM request failed (${res.status} ${redactErrorText(res.statusText)}).${trace}${body ? ` Body: ${body}` : ""}`);
		}
		const responseLabel = traceId ? `MiniMax VLM response [Trace-Id=${traceId}]` : "MiniMax VLM response";
		const json = await readProviderJsonResponse(res, responseLabel);
		if (!isRecord(json)) {
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM response was not JSON.${trace}`);
		}
		const baseResp = isRecord(json.base_resp) ? json.base_resp : {};
		const code = typeof baseResp.status_code === "number" ? baseResp.status_code : -1;
		if (code !== 0) {
			const msg = redactErrorText((baseResp.status_msg ?? "").trim());
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM API error (${code})${msg ? `: ${msg}` : ""}.${trace}`);
		}
		const content = pickString(json, "content").trim();
		if (!content) {
			const trace = traceId ? ` Trace-Id: ${traceId}` : "";
			throw new Error(`MiniMax VLM returned no content.${trace}`);
		}
		return content;
	} finally {
		await guarded.release();
	}
}
//#endregion
export { readResponseBodySnippet as i, isMinimaxVlmProvider as n, minimaxUnderstandImage as r, isMinimaxVlmModel as t };
