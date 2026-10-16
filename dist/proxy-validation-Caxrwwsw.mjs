import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { a as resolveManagedProxyCaFileForUrl, r as loadManagedProxyTlsOptions } from "./managed-proxy-undici-Dp2zTdjV.mjs";
import { r as createHttp1ProxyAgent } from "./undici-runtime-DnsVgrv0.mjs";
import { n as fetchWithRuntimeDispatcher } from "./runtime-fetch-BUtybS_l.mjs";
import { o as probeApnsHttp2ReachabilityViaProxy } from "./push-apns-http2-wDCXSE5n.mjs";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
//#region src/infra/net/proxy/proxy-validation.ts
const DEFAULT_PROXY_VALIDATION_ALLOWED_URLS = ["https://example.com/"];
const DEFAULT_PROXY_VALIDATION_APNS_AUTHORITY = "https://api.sandbox.push.apple.com";
const DEFAULT_PROXY_VALIDATION_TIMEOUT_MS = 5e3;
const DENIED_CANARY_HEADER = "x-openclaw-proxy-validation-canary";
const APNS_REACHABILITY_REASON = "InvalidProviderToken";
function validateProxyUrl(value) {
	if (!value) return ["proxy validation requires proxy.proxyUrl, --proxy-url, or OPENCLAW_PROXY_URL"];
	if (!isHttpUrl(value)) return ["proxyUrl must use http:// or https://"];
	return [];
}
/** Resolves validation config precedence: explicit override, config, then env. */
function resolveProxyValidationConfig(options) {
	const overrideUrl = normalizeOptionalString(options.proxyUrlOverride);
	const configUrl = normalizeOptionalString(options.config?.proxyUrl);
	const proxyUrl = overrideUrl ?? configUrl ?? normalizeOptionalString(options.env?.OPENCLAW_PROXY_URL);
	if (proxyUrl) {
		const enabled = Boolean(overrideUrl) || options.config?.enabled !== false;
		const proxyCaFile = resolveManagedProxyCaFileForUrl({
			proxyUrl,
			config: overrideUrl ? void 0 : options.config,
			caFileOverride: options.proxyCaFileOverride
		});
		return {
			enabled,
			proxyUrl,
			...proxyCaFile ? { proxyCaFile } : {},
			source: overrideUrl ? "override" : configUrl ? "config" : "env",
			errors: enabled ? validateProxyUrl(proxyUrl) : ["proxy validation is disabled by proxy.enabled=false"]
		};
	}
	if (options.config?.enabled === true) return {
		enabled: true,
		source: "missing",
		errors: validateProxyUrl(void 0)
	};
	return {
		enabled: false,
		source: "disabled",
		errors: ["proxy validation requires proxy.proxyUrl, OPENCLAW_PROXY_URL, or --proxy-url"]
	};
}
async function defaultProxyValidationFetchCheck({ proxyUrl, proxyTls, targetUrl, timeoutMs }) {
	const dispatcher = createHttp1ProxyAgent({
		uri: proxyUrl,
		...proxyTls ? { proxyTls } : {}
	}, timeoutMs);
	try {
		const response = await fetchWithRuntimeDispatcher(targetUrl, {
			dispatcher,
			redirect: "manual"
		});
		response.body?.cancel().catch(() => void 0);
		return {
			ok: response.ok,
			status: response.status,
			deniedCanaryToken: response.headers.get(DENIED_CANARY_HEADER) ?? void 0
		};
	} finally {
		await dispatcher.close();
	}
}
async function defaultProxyValidationApnsCheck(params) {
	const result = await probeApnsHttp2ReachabilityViaProxy(params);
	return {
		status: result.status,
		apnsId: result.responseHeaders?.["apns-id"],
		apnsReason: parseApnsErrorReason(result.body)
	};
}
function parseApnsErrorReason(body) {
	try {
		const parsed = JSON.parse(body);
		if (!parsed || typeof parsed !== "object") return;
		const reason = parsed.reason;
		return typeof reason === "string" && reason.trim() ? reason : void 0;
	} catch {
		return;
	}
}
function hasApnsReachabilityProof(result) {
	if (result.apnsId) return true;
	return result.status === 403 && result.apnsReason === APNS_REACHABILITY_REASON;
}
function normalizeTimeoutMs(value) {
	if (value === void 0 || !Number.isFinite(value) || value <= 0) return DEFAULT_PROXY_VALIDATION_TIMEOUT_MS;
	return Math.floor(value);
}
function closeServer(server) {
	return new Promise((resolve, reject) => {
		server.close((err) => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}
async function createLoopbackValidationCanary() {
	const token = randomUUID();
	const server = createServer((_request, response) => {
		response.writeHead(204, {
			[DENIED_CANARY_HEADER]: token,
			"cache-control": "no-store"
		});
		response.end();
	});
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(0, "127.0.0.1", () => {
			server.off("error", reject);
			resolve();
		});
	});
	const address = server.address();
	if (typeof address === "string" || address === null) {
		await closeServer(server);
		throw new Error("Unable to start loopback proxy validation canary");
	}
	return {
		url: `http://127.0.0.1:${address.port}/`,
		token,
		close: () => closeServer(server)
	};
}
/** Probes the active runtime route, independently of explicit proxy-denial checks. */
async function probeManagedProxyLoopback(options) {
	const config = resolveProxyValidationConfig(options);
	if (!config.enabled || !config.proxyUrl || config.errors.length > 0) return null;
	const canary = await createLoopbackValidationCanary();
	try {
		const response = await fetchWithRuntimeDispatcher(canary.url, {
			redirect: "manual",
			signal: AbortSignal.timeout(DEFAULT_PROXY_VALIDATION_TIMEOUT_MS)
		});
		response.body?.cancel().catch(() => void 0);
		return response.ok && response.headers.get(DENIED_CANARY_HEADER) === canary.token;
	} catch {
		return false;
	} finally {
		await canary.close();
	}
}
async function resolveDeniedTargets(deniedUrls) {
	if (deniedUrls !== void 0) return {
		targets: deniedUrls.map((url) => ({ url })),
		close: async () => void 0
	};
	const canary = await createLoopbackValidationCanary();
	return {
		targets: [{
			url: canary.url,
			expectedCanaryToken: canary.token
		}],
		close: canary.close
	};
}
async function runValidationCheck(kind, url, run) {
	try {
		return {
			kind,
			url,
			...await run()
		};
	} catch (err) {
		return {
			kind,
			url,
			ok: false,
			error: coerceErrorMessage(err)
		};
	}
}
async function runProxyValidation(options) {
	const config = resolveProxyValidationConfig(options);
	if (config.errors.length > 0 || !config.proxyUrl) return {
		ok: false,
		config,
		checks: []
	};
	const proxyUrl = config.proxyUrl;
	const timeoutMs = normalizeTimeoutMs(options.timeoutMs);
	let proxyTls;
	try {
		proxyTls = await loadManagedProxyTlsOptions(config.proxyCaFile);
	} catch (err) {
		return {
			ok: false,
			config: {
				...config,
				errors: [...config.errors, coerceErrorMessage(err)]
			},
			checks: []
		};
	}
	const fetchCheck = options.fetchCheck ?? defaultProxyValidationFetchCheck;
	const apnsCheck = options.apnsCheck ?? defaultProxyValidationApnsCheck;
	const apnsAuthority = options.apnsAuthority ?? DEFAULT_PROXY_VALIDATION_APNS_AUTHORITY;
	const allowedUrls = options.allowedUrls ?? DEFAULT_PROXY_VALIDATION_ALLOWED_URLS;
	const deniedTargets = await resolveDeniedTargets(options.deniedUrls);
	const checks = [];
	const checkDestination = (kind, target) => runValidationCheck(kind, target.url, async () => {
		if (!isHttpUrl(target.url)) return {
			ok: false,
			error: `Invalid ${kind} destination URL`
		};
		try {
			const result = await fetchCheck({
				proxyUrl,
				...proxyTls ? { proxyTls } : {},
				targetUrl: target.url,
				timeoutMs
			});
			if (kind === "allowed") return result.ok ? {
				ok: true,
				status: result.status
			} : {
				ok: false,
				status: result.status,
				error: `Allowed destination returned HTTP ${result.status}`
			};
			if (target.expectedCanaryToken !== void 0 && result.deniedCanaryToken !== target.expectedCanaryToken) return result.ok ? {
				ok: false,
				status: result.status,
				error: `Denied loopback canary returned HTTP ${result.status} without the validation token`
			} : {
				ok: true,
				status: result.status
			};
			return {
				ok: false,
				status: result.status,
				error: target.expectedCanaryToken === void 0 ? `Denied destination returned HTTP ${result.status}; expected the proxy to block the connection` : `Denied loopback canary was reachable through the proxy with HTTP ${result.status}`
			};
		} catch (err) {
			if (kind === "allowed") throw err;
			const message = coerceErrorMessage(err);
			return target.expectedCanaryToken !== void 0 ? {
				ok: true,
				error: message
			} : {
				ok: false,
				error: `Denied destination failed without a verifiable proxy-deny signal: ${message}`
			};
		}
	});
	try {
		for (const url of allowedUrls) checks.push(await checkDestination("allowed", { url }));
		for (const target of deniedTargets.targets) checks.push(await checkDestination("denied", target));
		if (options.apnsReachability === true) checks.push(await runValidationCheck("apns", apnsAuthority, async () => {
			const result = await apnsCheck({
				proxyUrl,
				...proxyTls ? { proxyTls } : {},
				authority: apnsAuthority,
				timeoutMs
			});
			return hasApnsReachabilityProof(result) ? {
				ok: true,
				status: result.status
			} : {
				ok: false,
				error: "APNs reachability check failed: response did not include an apns-id header or APNs InvalidProviderToken body. The proxy may be intercepting the connection instead of tunneling it."
			};
		}));
	} finally {
		await deniedTargets.close();
	}
	return {
		ok: checks.every((check) => check.ok),
		config,
		checks
	};
}
//#endregion
export { runProxyValidation as n, probeManagedProxyLoopback as t };
