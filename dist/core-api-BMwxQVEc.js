import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { a as addTimerTimeoutGraceMs, d as clampPositiveTimerTimeoutMs, j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as detectMime } from "./mime-C8mVE2Bw.js";
import { u as saveMediaBuffer } from "./store-MjA3hYFB.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as redactCdpUrl } from "./browser-config-BPzc9xWq.js";
import { n as withTimeout } from "./sdk-security-runtime-DUaKWlYv.js";
import "./server-middleware-Bc37Bra2.js";
import "./bridge-server-BEMxQLiA.js";
import { R as DEFAULT_BROWSER_ACTION_TIMEOUT_MS } from "./cdp.helpers-DjkDekqM.js";
import { n as resolveBrowserConfig } from "./config-BwszNDug.js";
import "./control-auth-0bU-zNYW.js";
import "./chrome.executables-DvH2zS5y.js";
import "./trash-00aTYAZz.js";
import "./sdk-setup-tools-CKCfhyIA.js";
import { S as withBaseUrl, b as fetchBrowserJson, x as buildProfileQuery } from "./session-tab-registry-BNVZla4V.js";
import "./routes-DQMAUwTL.js";
import { r as loadBrowserConfigForRuntimeRefresh } from "./server-context-DwVo9jGQ.js";
import "./snapshot-urls-CLhdz2UV.js";
import { t as createBrowserRouteDispatcher } from "./dispatcher-C69QruQB.js";
import { n as createBrowserControlContext } from "./plugin-enabled-BIIoxdhd.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-D2Vwg9Y3.js";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/client-actions-core.ts
/**
* Browser client action helpers.
*
* Wraps browser-control action endpoints for navigation, dialog/file hooks,
* screenshots, and element actions used by the Browser agent tool.
*/
const BROWSER_ACT_REQUEST_TIMEOUT_SLACK_MS = 5e3;
function normalizePositiveTimeoutMs(value) {
	return clampPositiveTimerTimeoutMs(value);
}
function resolveBrowserActRequestTimeoutMs(req) {
	const explicitTimeout = normalizePositiveTimeoutMs(req.timeoutMs);
	const candidateTimeouts = explicitTimeout === void 0 ? [DEFAULT_BROWSER_ACTION_TIMEOUT_MS] : [addTimerTimeoutGraceMs(explicitTimeout, BROWSER_ACT_REQUEST_TIMEOUT_SLACK_MS) ?? 1];
	if (req.kind === "wait") {
		const waitDuration = normalizePositiveTimeoutMs(req.timeMs);
		if (waitDuration !== void 0) candidateTimeouts.push(addTimerTimeoutGraceMs(waitDuration, BROWSER_ACT_REQUEST_TIMEOUT_SLACK_MS) ?? 1);
	}
	return Math.max(...candidateTimeouts);
}
/** Navigate a browser tab through the control server. */
async function browserNavigate(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/navigate${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			url: opts.url,
			targetId: opts.targetId
		}),
		timeoutMs: 2e4
	});
}
/** Arm a one-shot browser dialog handler. */
async function browserArmDialog(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/hooks/dialog${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			accept: opts.accept,
			promptText: opts.promptText,
			dialogId: opts.dialogId,
			targetId: opts.targetId,
			timeoutMs: opts.timeoutMs
		}),
		timeoutMs: 2e4
	});
}
/** Arm or execute a browser file chooser upload. */
async function browserArmFileChooser(baseUrl, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/hooks/file-chooser${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			paths: opts.paths,
			ref: opts.ref,
			inputRef: opts.inputRef,
			element: opts.element,
			targetId: opts.targetId,
			timeoutMs: opts.timeoutMs
		}),
		timeoutMs: 2e4
	});
}
/** Execute one normalized browser action request. */
async function browserAct(baseUrl, req, opts) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/act${buildProfileQuery(opts?.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(req),
		timeoutMs: resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req))
	});
}
/** Capture a screenshot through the browser control server. */
async function browserScreenshotAction(baseUrl, opts) {
	const q = buildProfileQuery(opts.profile);
	const effectiveTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/screenshot${q}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			targetId: opts.targetId,
			fullPage: opts.fullPage,
			ref: opts.ref,
			element: opts.element,
			type: opts.type,
			labels: opts.labels,
			timeoutMs: effectiveTimeoutMs
		}),
		timeoutMs: effectiveTimeoutMs
	});
}
//#endregion
//#region extensions/browser/src/browser/client-actions-observe.ts
function buildQuerySuffix(params) {
	const query = new URLSearchParams();
	for (const [key, value] of params) {
		if (typeof value === "boolean") {
			query.set(key, String(value));
			continue;
		}
		if (typeof value === "string" && value.length > 0) query.set(key, value);
	}
	const encoded = query.toString();
	return encoded.length > 0 ? `?${encoded}` : "";
}
/** Read browser console messages for a tab. */
async function browserConsoleMessages(baseUrl, opts = {}) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/console${buildQuerySuffix([
		["level", opts.level],
		["targetId", opts.targetId],
		["profile", opts.profile]
	])}`), { timeoutMs: 2e4 });
}
/** Save the current page as PDF through browser control. */
async function browserPdfSave(baseUrl, opts = {}) {
	return await fetchBrowserJson(withBaseUrl(baseUrl, `/pdf${buildProfileQuery(opts.profile)}`), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ targetId: opts.targetId }),
		timeoutMs: 2e4
	});
}
//#endregion
//#region extensions/browser/src/browser/proxy-files.ts
/**
* Browser proxy file helpers.
*
* Persists files returned by node-hosted browser proxy calls and rewrites
* proxied result paths to local saved media paths.
*/
/** Persist proxy-returned files and return a remote-path to local-path map. */
async function persistBrowserProxyFiles(files) {
	if (!files || files.length === 0) return /* @__PURE__ */ new Map();
	const mapping = /* @__PURE__ */ new Map();
	for (const file of files) {
		const saved = await saveMediaBuffer(Buffer.from(file.base64, "base64"), file.mimeType, "browser");
		mapping.set(file.path, saved.path);
	}
	return mapping;
}
/** Rewrite result.path when it points at a persisted proxy file. */
function applyBrowserProxyPaths(result, mapping) {
	if (!result || typeof result !== "object") return;
	const obj = result;
	if (typeof obj.path === "string" && mapping.has(obj.path)) obj.path = mapping.get(obj.path);
	if (typeof obj.imagePath === "string" && mapping.has(obj.imagePath)) obj.imagePath = mapping.get(obj.imagePath);
	const download = obj.download;
	if (download && typeof download === "object") {
		const d = download;
		if (typeof d.path === "string" && mapping.has(d.path)) d.path = mapping.get(d.path);
	}
}
//#endregion
//#region extensions/browser/src/browser/request-policy.ts
/**
* Request policy helpers for profile-aware Browser control server routes.
*/
/** Normalizes route paths so mutation-policy checks compare stable slash forms. */
function normalizeBrowserRequestPath(value) {
	const trimmed = value.trim();
	if (!trimmed) return trimmed;
	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	if (withLeadingSlash.length <= 1) return withLeadingSlash;
	return withLeadingSlash.replace(/\/+$/, "");
}
/** Returns true when a control request mutates persistent browser profile state. */
function isPersistentBrowserProfileMutation(method, path) {
	const normalizedPath = normalizeBrowserRequestPath(path);
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
/** Resolves the requested profile from query, body, or route defaults. */
function resolveRequestedBrowserProfile(params) {
	const queryProfile = normalizeOptionalString(params.query?.profile);
	if (queryProfile) return queryProfile;
	if (params.body && typeof params.body === "object") {
		const bodyProfile = "profile" in params.body ? normalizeOptionalString(params.body.profile) : void 0;
		if (bodyProfile) return bodyProfile;
	}
	return normalizeOptionalString(params.profile);
}
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.ts
/**
* Node-host browser.proxy command implementation for delegated Browser control
* requests.
*/
const BROWSER_PROXY_MAX_FILE_BYTES = 10 * 1024 * 1024;
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_STATUS_TIMEOUT_MS = 750;
function normalizeProfileAllowlist(raw) {
	return Array.isArray(raw) ? normalizeStringEntries(raw) : [];
}
function resolveBrowserProxyConfig() {
	const proxy = loadBrowserConfigForRuntimeRefresh().nodeHost?.browserProxy;
	const allowProfiles = normalizeProfileAllowlist(proxy?.allowProfiles);
	return {
		enabled: proxy?.enabled !== false,
		allowProfiles
	};
}
let browserControlReady = null;
async function ensureBrowserControlService() {
	if (browserControlReady) return browserControlReady;
	browserControlReady = (async () => {
		const cfg = loadBrowserConfigForRuntimeRefresh();
		if (!resolveBrowserConfig(cfg.browser, cfg).enabled) throw new Error("browser control disabled");
		if (!await startBrowserControlServiceFromConfig()) throw new Error("browser control disabled");
	})();
	return browserControlReady;
}
function isProfileAllowed(params) {
	const { allowProfiles, profile } = params;
	if (!allowProfiles.length) return true;
	if (!profile) return false;
	return allowProfiles.includes(profile.trim());
}
function collectBrowserProxyPaths(payload) {
	const paths = /* @__PURE__ */ new Set();
	const obj = typeof payload === "object" && payload !== null ? payload : null;
	if (!obj) return [];
	if (typeof obj.path === "string" && obj.path.trim()) paths.add(obj.path.trim());
	if (typeof obj.imagePath === "string" && obj.imagePath.trim()) paths.add(obj.imagePath.trim());
	const download = obj.download;
	if (download && typeof download === "object") {
		const dlPath = download.path;
		if (typeof dlPath === "string" && dlPath.trim()) paths.add(dlPath.trim());
	}
	return [...paths];
}
async function readBrowserProxyFile(filePath) {
	const stat = await fs.stat(filePath).catch(() => null);
	if (!stat || !stat.isFile()) return null;
	if (stat.size > BROWSER_PROXY_MAX_FILE_BYTES) throw new Error(`browser proxy file exceeds ${Math.round(BROWSER_PROXY_MAX_FILE_BYTES / (1024 * 1024))}MB`);
	const buffer = await fs.readFile(filePath);
	const mimeType = await detectMime({
		buffer,
		filePath
	});
	return {
		path: filePath,
		base64: buffer.toString("base64"),
		mimeType
	};
}
function decodeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	return JSON.parse(raw);
}
function resolveBrowserProxyTimeout(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_BROWSER_PROXY_TIMEOUT_MS);
}
function isBrowserProxyTimeoutError(err) {
	return String(err).includes("browser proxy request timed out");
}
function isWsBackedBrowserProxyPath(path) {
	return path === "/act" || path === "/navigate" || path === "/pdf" || path === "/screenshot" || path === "/snapshot";
}
async function readBrowserProxyStatus(params) {
	const query = params.profile ? { profile: params.profile } : {};
	try {
		const response = await withTimeout((signal) => params.dispatcher.dispatch({
			method: "GET",
			path: "/",
			query,
			signal
		}), BROWSER_PROXY_STATUS_TIMEOUT_MS, "browser proxy status");
		if (response.status >= 400 || !response.body || typeof response.body !== "object") return null;
		const body = response.body;
		return {
			running: body.running,
			transport: body.transport,
			cdpHttp: body.cdpHttp,
			cdpReady: body.cdpReady,
			cdpUrl: body.cdpUrl
		};
	} catch {
		return null;
	}
}
function formatBrowserProxyTimeoutMessage(params) {
	const parts = [`browser proxy timed out for ${params.method} ${params.path} after ${params.timeoutMs}ms`, params.wsBacked ? "ws-backed browser action" : "browser action"];
	if (params.profile) parts.push(`profile=${params.profile}`);
	if (params.status) {
		const statusParts = [
			`running=${String(params.status.running)}`,
			`cdpHttp=${String(params.status.cdpHttp)}`,
			`cdpReady=${String(params.status.cdpReady)}`
		];
		if (typeof params.status.transport === "string" && params.status.transport.trim()) statusParts.push(`transport=${params.status.transport}`);
		if (typeof params.status.cdpUrl === "string" && params.status.cdpUrl.trim()) statusParts.push(`cdpUrl=${redactCdpUrl(params.status.cdpUrl)}`);
		parts.push(`status(${statusParts.join(", ")})`);
	}
	return parts.join("; ");
}
/** Executes a serialized browser.proxy command and returns a serialized result payload. */
async function runBrowserProxyCommand(paramsJSON) {
	const params = decodeParams(paramsJSON);
	const pathValue = typeof params.path === "string" ? params.path.trim() : "";
	if (!pathValue) throw new Error("INVALID_REQUEST: path required");
	const proxyConfig = resolveBrowserProxyConfig();
	if (!proxyConfig.enabled) throw new Error("UNAVAILABLE: node browser proxy disabled");
	await ensureBrowserControlService();
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const method = typeof params.method === "string" ? params.method.toUpperCase() : "GET";
	const path = normalizeBrowserRequestPath(pathValue);
	const body = params.body;
	const requestedProfile = resolveRequestedBrowserProfile({
		query: params.query,
		body,
		profile: params.profile
	}) ?? "";
	const allowedProfiles = proxyConfig.allowProfiles;
	if (isPersistentBrowserProfileMutation(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot mutate persistent browser profiles");
	if (allowedProfiles.length > 0) {
		if (path !== "/profiles") {
			if (!isProfileAllowed({
				allowProfiles: allowedProfiles,
				profile: requestedProfile || resolved.defaultProfile
			})) throw new Error("INVALID_REQUEST: browser profile not allowed");
		} else if (requestedProfile) {
			if (!isProfileAllowed({
				allowProfiles: allowedProfiles,
				profile: requestedProfile
			})) throw new Error("INVALID_REQUEST: browser profile not allowed");
		}
	}
	const timeoutMs = resolveBrowserProxyTimeout(params.timeoutMs);
	const query = {};
	const rawQuery = params.query ?? {};
	for (const [key, value] of Object.entries(rawQuery)) {
		if (value === void 0 || value === null) continue;
		query[key] = typeof value === "string" ? value : String(value);
	}
	if (requestedProfile) query.profile = requestedProfile;
	const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	let response;
	try {
		response = await withTimeout((signal) => dispatcher.dispatch({
			method: method === "DELETE" ? "DELETE" : method === "POST" ? "POST" : "GET",
			path,
			query,
			body,
			signal
		}), timeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		const profileForStatus = requestedProfile || resolved.defaultProfile;
		const status = await readBrowserProxyStatus({
			dispatcher,
			profile: path === "/profiles" ? void 0 : profileForStatus
		});
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: path === "/profiles" ? void 0 : profileForStatus || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status
		}), { cause: err });
	}
	if (response.status >= 400) {
		const message = response.body && typeof response.body === "object" && "error" in response.body ? String(response.body.error) : `HTTP ${response.status}`;
		throw new Error(message);
	}
	const result = response.body;
	if (allowedProfiles.length > 0 && path === "/profiles") {
		const obj = typeof result === "object" && result !== null ? result : {};
		obj.profiles = (Array.isArray(obj.profiles) ? obj.profiles : []).filter((entry) => {
			if (!entry || typeof entry !== "object") return false;
			const name = entry.name;
			return typeof name === "string" && allowedProfiles.includes(name);
		});
	}
	let files;
	const paths = collectBrowserProxyPaths(result);
	if (paths.length > 0) {
		const loaded = await Promise.all(paths.map(async (p) => {
			try {
				const file = await readBrowserProxyFile(p);
				if (!file) throw new Error("file not found");
				return file;
			} catch (err) {
				throw new Error(`browser proxy file read failed for ${p}: ${String(err)}`, { cause: err });
			}
		}));
		if (loaded.length > 0) files = loaded;
	}
	return JSON.stringify(files ? {
		result,
		files
	} : { result });
}
//#endregion
export { applyBrowserProxyPaths as a, browserPdfSave as c, browserArmFileChooser as d, browserNavigate as f, resolveRequestedBrowserProfile as i, browserAct as l, isPersistentBrowserProfileMutation as n, persistBrowserProxyFiles as o, browserScreenshotAction as p, normalizeBrowserRequestPath as r, browserConsoleMessages as s, runBrowserProxyCommand as t, browserArmDialog as u };
