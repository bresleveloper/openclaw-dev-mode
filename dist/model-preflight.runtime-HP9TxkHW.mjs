import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DnjwnOju.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { t as isLocalProviderBaseUrl } from "./model-provider-local-BgnUkLMP.mjs";
//#region src/cron/isolated-agent/model-preflight.runtime.ts
/** Preflights local model-provider endpoints before scheduled cron runner startup. */
const PREFLIGHT_CACHE_TTL_MS = 3e5;
const PREFLIGHT_TIMEOUT_MS = 2500;
const MAX_PREFLIGHT_ERROR_CAUSE_DEPTH = 8;
const MAX_PREFLIGHT_ERROR_CHARS = 1e3;
const preflightCache = /* @__PURE__ */ new Map();
function resolveProviderConfig(cfg, provider) {
	const providers = cfg.models?.providers;
	if (!providers) return;
	const direct = providers[provider];
	if (direct) return direct;
	const normalized = normalizeProviderId(provider);
	return Object.entries(providers).find(([key]) => normalizeProviderId(key) === normalized)?.[1];
}
function normalizeBaseUrl(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim().replace(/\/+$/, "");
	return trimmed ? trimmed : void 0;
}
function normalizeProbeApi(providerConfig) {
	const api = normalizeLowercaseStringOrEmpty(providerConfig.api);
	return api === "ollama" || api === "openai-completions" ? api : void 0;
}
function buildProbeUrl(api, baseUrl) {
	if (api === "ollama") return `${baseUrl}/api/tags`;
	return `${baseUrl}/models`;
}
function buildLocalProviderSsrFPolicy(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return {
			hostnameAllowlist: [parsed.hostname],
			allowPrivateNetwork: true
		};
	} catch {
		return;
	}
}
function readErrorProperty(error, key) {
	if (typeof error !== "object" && typeof error !== "function" || error === null) return;
	try {
		return error[key];
	} catch {
		return;
	}
}
function collectPreflightErrorCauseChain(error) {
	const chain = [];
	const seen = /* @__PURE__ */ new Set();
	let current = error;
	while (current !== void 0 && current !== null && chain.length < MAX_PREFLIGHT_ERROR_CAUSE_DEPTH && !seen.has(current)) {
		seen.add(current);
		chain.push(current);
		current = readErrorProperty(current, "cause");
	}
	return chain;
}
function formatPreflightError(error) {
	const causeChain = collectPreflightErrorCauseChain(error);
	const causeDetails = formatErrorMessageWithCode(error);
	const classified = causeChain.some((candidate) => readErrorProperty(candidate, "name") === "TimeoutError") ? `Local provider preflight exceeded its configured ${PREFLIGHT_TIMEOUT_MS}ms deadline | ${causeDetails}` : causeDetails;
	return classified.length <= MAX_PREFLIGHT_ERROR_CHARS ? classified : `${truncateUtf16Safe(classified, 999)}…`;
}
function formatUnavailableReason(params) {
	return [
		`This automation uses ${params.provider}/${params.model} but the local provider preflight failed at ${params.baseUrl}.`,
		`The candidate is unavailable for this run; OpenClaw will retry its provider preflight on a later scheduled run.`,
		`Last error: ${formatPreflightError(params.error)}`
	].join(" ");
}
function buildUnavailableResult(params) {
	return {
		status: "unavailable",
		provider: params.provider,
		model: params.model,
		baseUrl: params.baseUrl,
		retryAfterMs: PREFLIGHT_CACHE_TTL_MS,
		reason: formatUnavailableReason({
			provider: params.provider,
			model: params.model,
			baseUrl: params.baseUrl,
			error: params.error
		})
	};
}
async function probeLocalProviderEndpoint(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: buildProbeUrl(params.api, params.baseUrl),
		init: { method: "GET" },
		policy: buildLocalProviderSsrFPolicy(params.baseUrl),
		timeoutMs: PREFLIGHT_TIMEOUT_MS,
		auditContext: "cron-model-provider-preflight"
	});
	try {
		response.status;
	} finally {
		if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
		await release();
	}
}
/** Checks local model-provider reachability before a scheduled cron run starts. */
async function preflightCronModelProvider(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (!providerConfig) return { status: "available" };
	const baseUrl = normalizeBaseUrl(providerConfig.baseUrl);
	const api = normalizeProbeApi(providerConfig);
	if (!baseUrl || !api || !isLocalProviderBaseUrl(baseUrl)) return { status: "available" };
	const nowMs = params.nowMs ?? Date.now();
	const cacheKey = `${api}\0${baseUrl}`;
	const cached = preflightCache.get(cacheKey);
	if (cached && nowMs - cached.checkedAtMs < PREFLIGHT_CACHE_TTL_MS) {
		if (cached.result.status === "available") return { status: "available" };
		return buildUnavailableResult({
			provider: params.provider,
			model: params.model,
			baseUrl,
			error: cached.result.error
		});
	}
	let result;
	try {
		await probeLocalProviderEndpoint({
			api,
			baseUrl
		});
		result = { status: "available" };
	} catch (error) {
		result = {
			status: "unavailable",
			error
		};
	}
	preflightCache.set(cacheKey, {
		checkedAtMs: nowMs,
		result
	});
	if (result.status === "available") return { status: "available" };
	return buildUnavailableResult({
		provider: params.provider,
		model: params.model,
		baseUrl,
		error: result.error
	});
}
/** Clears the local-provider preflight cache for deterministic tests. */
function resetCronModelProviderPreflightCacheForTest() {
	preflightCache.clear();
}
//#endregion
export { preflightCronModelProvider, resetCronModelProviderPreflightCacheForTest };
