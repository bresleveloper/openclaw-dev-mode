import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { n as isErrno } from "./errno-FR4CRyya.mjs";
import { i as readResponseWithLimit, r as readResponseTextSnippet, t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { t as parseRetryAfterHeaderSeconds } from "./retry-after-D_Ri68m5.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/clawhub-retry.ts
const CLAWHUB_RETRY_DELAYS_MS = [
	1e3,
	3e3,
	1e4
];
const CLAWHUB_MAX_RETRY_AFTER_MS = 6e4;
var RetryableClawHubResponse = class extends Error {
	constructor(result) {
		super(`ClawHub request returned retryable status ${result.response.status}`);
		this.result = result;
	}
};
function isRetryableClawHubStatus(status, retryRateLimit) {
	return retryRateLimit && status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}
function parseRetryAfterMs(headers) {
	const retryAfterSeconds = parseRetryAfterHeaderSeconds(headers.get("retry-after"));
	if (retryAfterSeconds === void 0) return;
	const delayMs = retryAfterSeconds * 1e3;
	return delayMs <= CLAWHUB_MAX_RETRY_AFTER_MS ? delayMs : void 0;
}
/**
* Retries idempotent ClawHub reads on transient HTTP and transport failures.
* Callers retain the final response so their existing body limits and errors apply.
*/
async function retryClawHubRead(request, options) {
	try {
		return await retryAsync(async () => {
			const result = await request();
			if (isRetryableClawHubStatus(result.response.status, options.retryRateLimit === true)) throw new RetryableClawHubResponse(result);
			return result;
		}, {
			attempts: CLAWHUB_RETRY_DELAYS_MS.length + 1,
			minDelayMs: 0,
			maxDelayMs: CLAWHUB_MAX_RETRY_AFTER_MS,
			delayMs: ({ attempt }) => CLAWHUB_RETRY_DELAYS_MS[attempt - 1] ?? 0,
			retryAfterMs: (error) => error instanceof RetryableClawHubResponse ? parseRetryAfterMs(error.result.response.headers) : void 0,
			onRetry: async ({ err }) => {
				if (err instanceof RetryableClawHubResponse) await options.disposeRetry(err.result);
			},
			sleep: options.sleep
		});
	} catch (error) {
		if (error instanceof RetryableClawHubResponse) return error.result;
		throw error;
	}
}
//#endregion
//#region src/infra/clawhub-client.ts
const DEFAULT_CLAWHUB_URL = "https://clawhub.ai";
const DEFAULT_FETCH_TIMEOUT_MS = 3e4;
const CLAWHUB_ARCHIVE_MAX_BYTES = 268435456;
const CLAWHUB_JSON_MAX_BYTES = 16777216;
const CLAWHUB_ERROR_BODY_MAX_BYTES = 8192;
const CLAWHUB_ERROR_BODY_MAX_CHARS = 400;
function resolveClawHubRequestTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_FETCH_TIMEOUT_MS);
}
var ClawHubRequestError = class extends Error {
	constructor(params) {
		super(`ClawHub ${params.path} failed (${params.status}): ${params.body}`);
		this.name = "ClawHubRequestError";
		this.status = params.status;
		this.requestPath = params.path;
		this.responseBody = params.body;
	}
};
/** Resolves the configured ClawHub base URL, falling back to the default public host. */
function resolveClawHubBaseUrl(baseUrl) {
	const envValue = normalizeOptionalString(process.env.OPENCLAW_CLAWHUB_URL) || normalizeOptionalString(process.env.CLAWHUB_URL) || DEFAULT_CLAWHUB_URL;
	return (normalizeOptionalString(baseUrl) || envValue).replace(/\/+$/, "") || DEFAULT_CLAWHUB_URL;
}
function resolveClawHubImageUrl(value, baseUrl) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	try {
		const registryUrl = new URL(`${resolveClawHubBaseUrl(baseUrl)}/`);
		const url = new URL(normalized, registryUrl);
		if (url.origin !== registryUrl.origin || url.username || url.password || url.search || url.hash || !/^\/api\/v1\/skill-icons\/[a-f\d]{64}$/u.test(url.pathname)) return;
		return url.toString();
	} catch {
		return;
	}
}
function extractTokenFromClawHubConfig(value) {
	if (!value || typeof value !== "object") return;
	const record = value;
	return normalizeOptionalString(record.accessToken) ?? normalizeOptionalString(record.authToken) ?? normalizeOptionalString(record.apiToken) ?? normalizeOptionalString(record.token) ?? extractTokenFromClawHubConfig(record.auth) ?? extractTokenFromClawHubConfig(record.session) ?? extractTokenFromClawHubConfig(record.credentials) ?? extractTokenFromClawHubConfig(record.user);
}
function resolveClawHubConfigPathsIn(configHome) {
	return ["clawhub", "clawdhub"].map((directory) => path.join(configHome, directory, "config.json"));
}
function resolveClawHubConfigPaths() {
	const explicit = normalizeOptionalString(process.env.CLAWHUB_CONFIG_PATH) || normalizeOptionalString(process.env.CLAWDHUB_CONFIG_PATH);
	if (explicit) return [explicit];
	const xdgConfigHome = normalizeOptionalString(process.env.XDG_CONFIG_HOME);
	const configPaths = resolveClawHubConfigPathsIn(xdgConfigHome ?? path.join(os.homedir(), ".config"));
	if (process.platform === "darwin") return [...resolveClawHubConfigPathsIn(path.join(os.homedir(), "Library", "Application Support")), ...configPaths];
	const appData = normalizeOptionalString(process.env.APPDATA);
	if (process.platform === "win32" && !xdgConfigHome && appData) return [...resolveClawHubConfigPathsIn(appData), ...configPaths];
	return configPaths;
}
async function resolveClawHubAuthToken() {
	const envToken = normalizeOptionalString(process.env.CLAWHUB_TOKEN) || normalizeOptionalString(process.env.CLAWHUB_AUTH_TOKEN);
	if (envToken) return envToken;
	for (const configPath of resolveClawHubConfigPaths()) try {
		const raw = await fs.readFile(configPath, "utf8");
		return extractTokenFromClawHubConfig(JSON.parse(raw));
	} catch (error) {
		if (!isErrno(error) || error.code !== "ENOENT") return;
	}
}
function buildUrl(params) {
	let url;
	if (params.url) url = new URL(params.url, `${resolveClawHubBaseUrl(params.baseUrl)}/`);
	else {
		if (!params.path) throw new Error("ClawHub request path is required");
		url = new URL(`${resolveClawHubBaseUrl(params.baseUrl)}/`);
		const basePath = url.pathname.replace(/\/+$/, "");
		const requestPath = params.path.startsWith("/") ? params.path : `/${params.path}`;
		url.pathname = `${basePath}${requestPath}`;
	}
	for (const [key, value] of Object.entries(params.search ?? {})) {
		if (!value) continue;
		url.searchParams.set(key, value);
	}
	return url;
}
async function requestClawHub(params) {
	const url = buildUrl(params);
	const token = params.skipAuth ? void 0 : normalizeOptionalString(params.token) || await resolveClawHubAuthToken();
	const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
	const headers = {
		...token ? { Authorization: `Bearer ${token}` } : {},
		...params.json === void 0 ? {} : { "Content-Type": "application/json" },
		...params.headers
	};
	const init = {};
	if (params.method) init.method = params.method;
	if (Object.keys(headers).length > 0) init.headers = headers;
	if (params.json !== void 0) init.body = JSON.stringify(params.json);
	const request = async () => {
		const controller = new AbortController();
		let timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`ClawHub request timed out after ${timeoutMs}ms`)), timeoutMs);
		const releaseDeadline = () => {
			if (timeout !== void 0) {
				clearTimeout(timeout);
				timeout = void 0;
			}
		};
		try {
			return {
				response: await (params.fetchImpl ?? fetch)(url, {
					...init,
					signal: controller.signal
				}),
				url,
				hasToken: Boolean(token),
				releaseDeadline
			};
		} catch (error) {
			releaseDeadline();
			throw error;
		}
	};
	if ((params.method ?? "GET") !== "GET" || params.retryTransientReads === false) return await request();
	return await retryClawHubRead(request, { disposeRetry: async ({ response, releaseDeadline }) => {
		releaseDeadline();
		await cancelUnreadResponseBody(response);
	} });
}
async function withClawHubResponse(params, consume) {
	const result = await requestClawHub(params);
	try {
		return await consume(result);
	} finally {
		result.releaseDeadline();
		await cancelUnreadResponseBody(result.response);
	}
}
async function readErrorBody(response, timeoutMs) {
	try {
		return await readResponseTextSnippet(response, {
			maxBytes: CLAWHUB_ERROR_BODY_MAX_BYTES,
			maxChars: CLAWHUB_ERROR_BODY_MAX_CHARS,
			chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs)
		}) || response.statusText || `HTTP ${response.status}`;
	} catch {
		return response.statusText || `HTTP ${response.status}`;
	}
}
async function createClawHubError(response, url, hasToken, timeoutMs) {
	let body = await readErrorBody(response, timeoutMs);
	if (response.status === 429) {
		const suffix = formatRateLimitSuffix(response.headers, hasToken);
		if (suffix) body = `${body} ${suffix}`;
	}
	return new ClawHubRequestError({
		path: url.pathname,
		status: response.status,
		body
	});
}
function formatRateLimitSuffix(headers, hasToken) {
	const resetSeconds = parseRateLimitDeltaSeconds(headers.get("RateLimit-Reset")) ?? parseRateLimitDeltaSeconds(headers.get("Retry-After"));
	const segments = [];
	if (resetSeconds !== void 0) segments.push(`(resets in ${resetSeconds}s)`);
	if (!hasToken) segments.push("Sign in for higher rate limits.");
	return segments.join(" ");
}
function parseRateLimitDeltaSeconds(value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized || !/^\d+$/.test(normalized)) return;
	return parseStrictNonNegativeInteger(normalized);
}
function decodeClawHubResponseBody(buffer) {
	return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
}
async function fetchClawHubJson(params) {
	return await withClawHubResponse(params, async ({ response, url, hasToken }) => {
		if (!response.ok) throw await createClawHubError(response, url, hasToken, params.timeoutMs);
		return parseClawHubJsonBody(response, url, params.timeoutMs, params.maxResponseBytes);
	});
}
async function parseClawHubJsonBody(response, url, timeoutMs, maxResponseBytes = CLAWHUB_JSON_MAX_BYTES) {
	const buffer = await readResponseWithLimit(response, maxResponseBytes, {
		chunkTimeoutMs: resolveClawHubRequestTimeoutMs(timeoutMs),
		onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`ClawHub ${url.pathname} response exceeded ${maxBytes} bytes (${size} bytes received)`),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`ClawHub ${url.pathname} response stalled after ${chunkTimeoutMs}ms`)
	});
	try {
		return JSON.parse(decodeClawHubResponseBody(buffer));
	} catch (cause) {
		throw new Error(`ClawHub ${url.pathname} returned malformed JSON`, { cause });
	}
}
async function readClawHubBytes(params) {
	const timeoutMs = resolveClawHubRequestTimeoutMs(params.timeoutMs);
	const maxBytes = params.maxBytes ?? CLAWHUB_ARCHIVE_MAX_BYTES;
	const contentEncoding = normalizeOptionalString(params.response.headers.get("content-encoding"));
	const declaredSize = !contentEncoding || contentEncoding.toLowerCase() === "identity" ? parseStrictNonNegativeInteger(params.response.headers.get("content-length")) : void 0;
	if (declaredSize !== void 0 && declaredSize > maxBytes) {
		await params.response.body?.cancel().catch(() => void 0);
		throw createClawHubBodyLimitError(params.resourceLabel, declaredSize, maxBytes, "declared");
	}
	return await readResponseWithLimit(params.response, maxBytes, {
		chunkTimeoutMs: timeoutMs,
		onOverflow: ({ size, maxBytes: limitBytes }) => createClawHubBodyLimitError(params.resourceLabel, size, limitBytes),
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`ClawHub ${params.resourceLabel} body stalled after ${chunkTimeoutMs}ms`)
	});
}
function createClawHubBodyLimitError(resourceLabel, size, maxBytes, measurement = "received") {
	return /* @__PURE__ */ new Error(`ClawHub ${resourceLabel} exceeded ${maxBytes} bytes (${size} bytes ${measurement})`);
}
function readClawHubStringField(source, field, context) {
	const value = source[field];
	if (value === void 0 || value === null || typeof value === "string") return value;
	throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a string or null.`);
}
/** Validate optional strings, omitting absent, null, and empty values. */
function readClawHubNonEmptyStringFields(source, fields, context) {
	const result = {};
	for (const field of fields) {
		const value = readClawHubStringField(source, field, context);
		if (value) result[field] = value;
	}
	return result;
}
function readRequiredClawHubBooleanField(source, field, context) {
	const value = source[field];
	if (typeof value === "boolean") return value;
	throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a boolean.`);
}
function readRequiredClawHubStringArrayField(source, field, context) {
	const value = source[field];
	if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) return value;
	throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a string array.`);
}
function readRequiredClawHubStringField(source, field, context) {
	const value = source[field];
	if (typeof value === "string" && value.length > 0) return value;
	throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a non-empty string.`);
}
function readRequiredClawHubNumberField(source, field, context) {
	const value = source[field];
	if (typeof value === "number" && Number.isFinite(value)) return value;
	throw new Error(`Malformed ClawHub ${context}: expected ${field} to be a number.`);
}
function readClawHubBooleanField(source, field, context) {
	return source[field] === void 0 ? void 0 : readRequiredClawHubBooleanField(source, field, context);
}
function readClawHubStringArrayField(source, field, context) {
	return source[field] === void 0 ? void 0 : readRequiredClawHubStringArrayField(source, field, context);
}
function isDefaultClawHubBaseUrl(baseUrl) {
	return resolveClawHubBaseUrl(baseUrl) === resolveClawHubBaseUrl(DEFAULT_CLAWHUB_URL);
}
function isClawHubTelemetryDisabled() {
	const raw = normalizeOptionalString(process.env.CLAWHUB_DISABLE_TELEMETRY) ?? normalizeOptionalString(process.env.CLAWDHUB_DISABLE_TELEMETRY);
	if (!raw) return false;
	return isTruthyEnvValue(raw);
}
//#endregion
export { resolveClawHubAuthToken as _, isClawHubTelemetryDisabled as a, withClawHubResponse as b, readClawHubBooleanField as c, readClawHubStringArrayField as d, readClawHubStringField as f, readRequiredClawHubStringField as g, readRequiredClawHubStringArrayField as h, fetchClawHubJson as i, readClawHubBytes as l, readRequiredClawHubNumberField as m, createClawHubError as n, isDefaultClawHubBaseUrl as o, readRequiredClawHubBooleanField as p, decodeClawHubResponseBody as r, parseClawHubJsonBody as s, ClawHubRequestError as t, readClawHubNonEmptyStringFields as u, resolveClawHubBaseUrl as v, resolveClawHubImageUrl as y };
