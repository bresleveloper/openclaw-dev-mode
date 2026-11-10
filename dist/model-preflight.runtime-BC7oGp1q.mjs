import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-AfCp6rSy.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5Nd20RhP.mjs";
import { p as resolvePinnedHostnameWithPolicy } from "./ssrf-K50Tjeok.mjs";
import { a as isManagedProxyActive } from "./fetch-guard-DRapCKeS.mjs";
import { t as isLocalProviderBaseUrl } from "./model-provider-local-BR8C9R-6.mjs";
import net from "node:net";
import { once } from "node:events";
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
function normalizeProbeApi(providerConfig) {
	const api = normalizeLowercaseStringOrEmpty(providerConfig.api);
	return api === "ollama" || api === "openai-completions" ? api : void 0;
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
function isPreflightTimeout(error) {
	return collectPreflightErrorCauseChain(error).some((candidate) => readErrorProperty(candidate, "name") === "TimeoutError");
}
function formatPreflightError(error) {
	const causeDetails = formatErrorMessageWithCode(error);
	const classified = isPreflightTimeout(error) ? `Local provider preflight exceeded its configured ${PREFLIGHT_TIMEOUT_MS}ms deadline | ${causeDetails}` : causeDetails;
	return classified.length <= MAX_PREFLIGHT_ERROR_CHARS ? classified : `${truncateUtf16Safe(classified, 999)}…`;
}
function buildUnavailableResult(params) {
	return {
		status: "unavailable",
		provider: params.provider,
		model: params.model,
		baseUrl: params.baseUrl,
		retryAfterMs: PREFLIGHT_CACHE_TTL_MS,
		reason: [
			`This automation uses ${params.provider}/${params.model} but the local provider preflight failed at ${params.baseUrl}.`,
			`Start the local provider or correct its configured endpoint; OpenClaw will retry its provider preflight on a later scheduled run.`,
			`Last error: ${formatPreflightError(params.error)}`
		].join(" ")
	};
}
async function probeLocalProviderEndpoint(baseUrl) {
	const url = new URL(baseUrl);
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`Unsupported local provider protocol: ${url.protocol}`);
	const { signal, cleanup } = buildTimeoutAbortSignal({
		timeoutMs: PREFLIGHT_TIMEOUT_MS,
		operation: "cron-model-provider-preflight",
		url: baseUrl
	});
	try {
		const pinned = await resolvePinnedHostnameWithPolicy(url.hostname, {
			policy: {
				hostnameAllowlist: [url.hostname],
				allowPrivateNetwork: true
			},
			signal
		});
		const socket = net.connect({
			host: pinned.hostname,
			port: Number(url.port || (url.protocol === "https:" ? 443 : 80)),
			lookup: pinned.lookup
		});
		const closed = new Promise((resolve) => {
			socket.once("close", () => resolve());
		});
		try {
			await once(socket, "connect", { signal });
		} finally {
			socket.destroy();
			await closed;
		}
	} finally {
		cleanup();
	}
}
/** Checks local model-provider reachability before a scheduled cron run starts. */
async function preflightCronModelProvider(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (!providerConfig) return { status: "available" };
	const baseUrl = normalizeOptionalString(providerConfig.baseUrl)?.replace(/\/+$/, "");
	const api = normalizeProbeApi(providerConfig);
	if (!baseUrl || !api || !isLocalProviderBaseUrl(baseUrl) || isManagedProxyActive() && shouldUseEnvHttpProxyForUrl(baseUrl)) return { status: "available" };
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
		await probeLocalProviderEndpoint(baseUrl);
		result = { status: "available" };
	} catch (error) {
		result = {
			status: "unavailable",
			error
		};
	}
	if (result.status === "available" || !isPreflightTimeout(result.error)) preflightCache.set(cacheKey, {
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
