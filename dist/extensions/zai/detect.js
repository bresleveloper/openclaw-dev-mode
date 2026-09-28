import { i as ZAI_CODING_GLOBAL_BASE_URL, n as ZAI_CODING_CN_BASE_URL, o as ZAI_DEFAULT_MODEL_ID, r as ZAI_CODING_DEFAULT_MODEL_ID, s as ZAI_GLOBAL_BASE_URL, t as ZAI_CN_BASE_URL } from "./.setup/model-definitions-GiWvkL3t.mjs";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { createProviderOperationDeadline, createProviderOperationTimeoutResolver, readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
//#region extensions/zai/detect.ts
const UNSUPPORTED_MODEL_ERROR_CODES = /* @__PURE__ */ new Set(["1211", "1311"]);
/** Cap for the Z.AI probe error body; bounds untrusted error responses to avoid unbounded buffering/OOM. */
const ZAI_DETECT_ERROR_BODY_MAX_BYTES = 16777216;
function isUnsupportedModelResult(result) {
	if (result.ok) return false;
	if (result.status === 404) return true;
	if (result.errorCode && UNSUPPORTED_MODEL_ERROR_CODES.has(result.errorCode)) return true;
	if (result.status !== 400) return false;
	const detail = `${result.errorCode ?? ""} ${result.errorMessage ?? ""}`.toLowerCase();
	return /\bmodel\b.*\b(not found|unavailable|unsupported|does not exist)\b/.test(detail) || /模型.*(不存在|不支持|不可用)/.test(detail);
}
async function probeZaiChatCompletions(params) {
	const deadline = createProviderOperationDeadline({
		timeoutMs: params.timeoutMs,
		label: "Z.AI endpoint probe"
	});
	const resolveTimeoutMs = createProviderOperationTimeoutResolver({
		deadline,
		defaultTimeoutMs: params.timeoutMs
	});
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), params.timeoutMs);
	timeout.unref?.();
	let res;
	try {
		res = await (params.fetchFn ?? globalThis.fetch)(`${params.baseUrl}/chat/completions`, {
			method: "POST",
			headers: {
				authorization: `Bearer ${params.apiKey}`,
				"content-type": "application/json"
			},
			body: JSON.stringify({
				model: params.modelId,
				stream: false,
				max_tokens: 1,
				messages: [{
					role: "user",
					content: "ping"
				}]
			}),
			signal: controller.signal
		});
		if (res.ok) return { ok: true };
		let errorCode;
		let errorMessage;
		try {
			const json = await readProviderJsonResponse(res, "Z.AI endpoint probe", {
				maxBytes: ZAI_DETECT_ERROR_BODY_MAX_BYTES,
				timeoutMs: resolveTimeoutMs,
				chunkTimeoutMs: 0,
				onTimeout: ({ timeoutMs }) => /* @__PURE__ */ new Error(`Z.AI probe error body timed out after ${timeoutMs}ms`),
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Z.AI probe error body exceeded size limit (${maxBytes} bytes)`)
			});
			const code = json?.error?.code ?? json?.code;
			const msg = json?.error?.message ?? json?.msg ?? json?.message;
			if (typeof code === "string") errorCode = code;
			else if (typeof code === "number") errorCode = String(code);
			if (typeof msg === "string") errorMessage = msg;
		} catch {}
		return {
			ok: false,
			status: res.status,
			errorCode,
			errorMessage
		};
	} catch {
		return { ok: false };
	} finally {
		clearTimeout(timeout);
		if (res?.bodyUsed !== true) await res?.body?.cancel().catch(() => void 0);
	}
}
async function detectZaiEndpoint(params) {
	if (process.env.VITEST && !params.fetchFn) return null;
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 5e3);
	const probeCandidates = (() => {
		const general = [{
			endpoint: "global",
			baseUrl: ZAI_GLOBAL_BASE_URL,
			modelId: ZAI_DEFAULT_MODEL_ID,
			note: "Verified GLM-5.2 on global endpoint."
		}, {
			endpoint: "cn",
			baseUrl: ZAI_CN_BASE_URL,
			modelId: ZAI_DEFAULT_MODEL_ID,
			note: "Verified GLM-5.2 on cn endpoint."
		}];
		const codingModels = [
			{
				endpoint: "coding-global",
				baseUrl: ZAI_CODING_GLOBAL_BASE_URL,
				modelId: ZAI_CODING_DEFAULT_MODEL_ID,
				note: "Verified GLM-5.3 on coding-global endpoint."
			},
			{
				endpoint: "coding-global",
				baseUrl: ZAI_CODING_GLOBAL_BASE_URL,
				modelId: "glm-5.1",
				note: "Verified GLM-5.1 on coding-global endpoint; GLM-5.3 is unavailable.",
				fallback: true
			},
			{
				endpoint: "coding-cn",
				baseUrl: ZAI_CODING_CN_BASE_URL,
				modelId: ZAI_CODING_DEFAULT_MODEL_ID,
				note: "Verified GLM-5.3 on coding-cn endpoint."
			},
			{
				endpoint: "coding-cn",
				baseUrl: ZAI_CODING_CN_BASE_URL,
				modelId: "glm-5.1",
				note: "Verified GLM-5.1 on coding-cn endpoint; GLM-5.3 is unavailable.",
				fallback: true
			}
		];
		const codingFallback = [{
			endpoint: "coding-global",
			baseUrl: ZAI_CODING_GLOBAL_BASE_URL,
			modelId: "glm-4.7",
			note: "Coding Plan endpoint verified, but this key/plan does not expose GLM-5.3 or GLM-5.1 there. Defaulting to GLM-4.7.",
			fallback: true
		}, {
			endpoint: "coding-cn",
			baseUrl: ZAI_CODING_CN_BASE_URL,
			modelId: "glm-4.7",
			note: "Coding Plan CN endpoint verified, but this key/plan does not expose GLM-5.3 or GLM-5.1 there. Defaulting to GLM-4.7.",
			fallback: true
		}];
		switch (params.endpoint) {
			case "global": return general.filter((candidate) => candidate.endpoint === "global");
			case "cn": return general.filter((candidate) => candidate.endpoint === "cn");
			case "coding-global": return [...codingModels.filter((candidate) => candidate.endpoint === "coding-global"), ...codingFallback.filter((candidate) => candidate.endpoint === "coding-global")];
			case "coding-cn": return [...codingModels.filter((candidate) => candidate.endpoint === "coding-cn"), ...codingFallback.filter((candidate) => candidate.endpoint === "coding-cn")];
			default: return [
				...general,
				...codingModels,
				...codingFallback
			];
		}
	})();
	const resultsByEndpoint = /* @__PURE__ */ new Map();
	for (const candidate of probeCandidates) {
		const priorResults = resultsByEndpoint.get(candidate.endpoint) ?? [];
		if (candidate.fallback && (priorResults.length === 0 || !priorResults.every(isUnsupportedModelResult))) continue;
		const result = await probeZaiChatCompletions({
			baseUrl: candidate.baseUrl,
			apiKey: params.apiKey,
			modelId: candidate.modelId,
			timeoutMs,
			fetchFn: params.fetchFn
		});
		if (result.ok) return {
			endpoint: candidate.endpoint,
			baseUrl: candidate.baseUrl,
			modelId: candidate.modelId,
			note: candidate.note
		};
		resultsByEndpoint.set(candidate.endpoint, [...priorResults, result]);
	}
	return null;
}
//#endregion
export { detectZaiEndpoint };
