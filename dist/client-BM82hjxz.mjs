import { F as resolveTimerTimeoutMs, a as addTimerTimeoutGraceMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./constants-CxIE9Xhk.mjs";
import { d as resolveBrowserNavigationTimeoutMs, u as resolveBrowserActRequestTimeoutMs } from "./act-policy-BRluzhGf.mjs";
import { n as postBrowserJson, r as requestBrowserJson, t as browserClientTimeout } from "./client-request-6qZ3JlH4.mjs";
//#region extensions/browser/src/browser/client-actions.ts
function resolveBrowserOperationRequestTimeoutMs(timeoutMs) {
	const operationTimeoutMs = clampPositiveTimerTimeoutMs(timeoutMs) ?? 12e4;
	return addTimerTimeoutGraceMs(operationTimeoutMs, 5e3) ?? 1;
}
function projectBrowserOptions(opts, fields) {
	return Object.fromEntries(fields.map((key) => [key, opts[key]]));
}
async function browserNavigate(baseUrl, opts) {
	const timeoutMs = resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	return await postBrowserJson(baseUrl, "/navigate", {
		url: opts.url,
		targetId: opts.targetId,
		timeoutMs
	}, resolveBrowserOperationRequestTimeoutMs(timeoutMs), opts);
}
function createBrowserOperation(path, fields, timeoutScope) {
	return async (baseUrl, opts) => await postBrowserJson(baseUrl, path, projectBrowserOptions(opts, fields), timeoutScope === "local" ? browserClientTimeout(baseUrl, void 0, resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs)) : resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs), opts);
}
const browserArmDialog = createBrowserOperation("/hooks/dialog", [
	"accept",
	"promptText",
	"dialogId",
	"targetId",
	"timeoutMs"
], "local");
const browserArmFileChooser = createBrowserOperation("/hooks/file-chooser", [
	"paths",
	"ref",
	"inputRef",
	"element",
	"targetId",
	"timeoutMs"
], "local");
const browserWaitForDownload = createBrowserOperation("/wait/download", [
	"targetId",
	"path",
	"timeoutMs"
], "all");
const browserDownload = createBrowserOperation("/download", [
	"targetId",
	"ref",
	"path",
	"timeoutMs"
], "all");
async function browserAct(baseUrl, req, opts) {
	return await postBrowserJson(baseUrl, "/act", req, resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req)), opts);
}
async function browserScreenshotAction(baseUrl, opts) {
	const effectiveTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	return await postBrowserJson(baseUrl, "/screenshot", {
		...projectBrowserOptions(opts, [
			"targetId",
			"fullPage",
			"ref",
			"element",
			"type",
			"labels"
		]),
		timeoutMs: effectiveTimeoutMs
	}, effectiveTimeoutMs, opts);
}
function buildQuery(params) {
	return Object.fromEntries(Object.entries(params).filter(([, value]) => typeof value === "boolean" || typeof value === "string" && value.length > 0));
}
function readBrowserPageJson(baseUrl, path, opts, query) {
	return requestBrowserJson(baseUrl, path, {
		query,
		profile: opts.profile,
		timeoutMs: browserClientTimeout(baseUrl, void 0, 2e4),
		signal: opts.signal
	});
}
async function browserConsoleMessages(baseUrl, opts = {}) {
	return await readBrowserPageJson(baseUrl, "/console", opts, buildQuery({
		level: opts.level,
		targetId: opts.targetId
	}));
}
async function browserRequests(baseUrl, opts = {}) {
	return await readBrowserPageJson(baseUrl, "/requests", opts, buildQuery({
		filter: opts.filter,
		clear: opts.clear,
		targetId: opts.targetId
	}));
}
async function browserErrors(baseUrl, opts = {}) {
	return await readBrowserPageJson(baseUrl, "/errors", opts, buildQuery({
		clear: opts.clear,
		targetId: opts.targetId
	}));
}
/** Read bounded visible text without executing page-supplied code. */
async function browserPageText(baseUrl, opts) {
	return await readBrowserPageJson(baseUrl, "/text", opts, {
		...buildQuery({
			targetId: opts.targetId,
			selector: opts.selector
		}),
		maxChars: opts.maxChars
	});
}
async function browserEmulateSetting(baseUrl, opts) {
	return await postBrowserJson(baseUrl, `/set/${opts.setting}`, opts.body, browserClientTimeout(baseUrl, void 0, 2e4), opts);
}
async function browserPdfSave(baseUrl, opts = {}) {
	return await postBrowserJson(baseUrl, "/pdf", { targetId: opts.targetId }, browserClientTimeout(baseUrl, void 0, 2e4), opts);
}
//#endregion
//#region extensions/browser/src/browser/client.ts
const BROWSER_STATUS_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DOCTOR_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS = 1e4;
async function sendProfilePost(baseUrl, path, opts) {
	await requestBrowserJson(baseUrl, path, {
		profile: opts?.profile,
		method: "POST",
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 15e3),
		signal: opts?.signal
	});
}
async function browserStatus(baseUrl, opts) {
	return await requestBrowserJson(baseUrl, "/", {
		profile: opts?.profile,
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, BROWSER_STATUS_REQUEST_TIMEOUT_MS),
		signal: opts?.signal
	});
}
async function browserDoctor(baseUrl, opts) {
	return await requestBrowserJson(baseUrl, "/doctor", {
		profile: opts?.profile,
		query: opts?.deep ? { deep: "true" } : void 0,
		timeoutMs: browserClientTimeout(baseUrl, void 0, opts?.deep ? BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS : BROWSER_DOCTOR_REQUEST_TIMEOUT_MS),
		signal: opts?.signal
	});
}
async function browserProfiles(baseUrl, opts) {
	return (await requestBrowserJson(baseUrl, "/profiles", {
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 3e3),
		signal: opts?.signal
	})).profiles ?? [];
}
async function browserSystemProfiles(baseUrl, opts) {
	return (await requestBrowserJson(baseUrl, "/system-profiles", {
		query: opts?.browser ? { browser: opts.browser } : void 0,
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 3e3),
		signal: opts?.signal
	})).systemProfiles ?? [];
}
async function browserImportProfile(baseUrl, opts) {
	return await postBrowserJson(baseUrl, "/profiles/import", {
		browser: opts.browser,
		systemProfile: opts.systemProfile,
		into: opts.into,
		domains: opts.domains
	}, 12e4, { signal: opts.signal });
}
async function browserStart(baseUrl, opts) {
	await sendProfilePost(baseUrl, "/start", opts);
}
async function browserStop(baseUrl, opts) {
	await sendProfilePost(baseUrl, "/stop", opts);
}
function normalizeBrowserTabsResult(value) {
	const result = asNullableRecord(value);
	if (result?.running === false) return {
		running: false,
		tabs: []
	};
	return {
		running: true,
		tabs: Array.isArray(result?.tabs) ? result.tabs : []
	};
}
async function browserTabs(baseUrl, opts) {
	return normalizeBrowserTabsResult(await requestBrowserJson(baseUrl, "/tabs", {
		profile: opts?.profile,
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 3e3),
		signal: opts?.signal
	}));
}
async function browserOpenTab(baseUrl, url, opts) {
	const timeoutMs = opts?.timeoutMs === void 0 ? void 0 : resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	return await postBrowserJson(baseUrl, "/tabs/open", {
		url,
		...opts?.label ? { label: opts.label } : {},
		...opts?.managedOnly ? { managedOnly: true } : {},
		...timeoutMs === void 0 ? {} : { timeoutMs }
	}, Math.max(clampPositiveTimerTimeoutMs(opts?.requestTimeoutMs) ?? 0, resolveBrowserOperationRequestTimeoutMs(timeoutMs ?? 3e4)), opts);
}
async function browserFocusTab(baseUrl, targetId, opts) {
	return await postBrowserJson(baseUrl, "/tabs/focus", { targetId }, browserClientTimeout(baseUrl, opts?.timeoutMs, 5e3), opts);
}
async function browserCloseTab(baseUrl, targetId, opts) {
	const path = `/tabs/${encodeURIComponent(targetId)}`;
	return await requestBrowserJson(baseUrl, path, {
		profile: opts?.profile,
		method: "DELETE",
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, 5e3),
		signal: opts?.signal
	});
}
async function browserSnapshot(baseUrl, opts) {
	const resolvedTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	return await requestBrowserJson(baseUrl, "/snapshot", {
		query: {
			...opts.format ? { format: opts.format } : {},
			...opts.targetId ? { targetId: opts.targetId } : {},
			...typeof opts.limit === "number" ? { limit: opts.limit } : {},
			...typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars) ? { maxChars: opts.maxChars } : {},
			...opts.refs === "aria" || opts.refs === "role" ? { refs: opts.refs } : {},
			...typeof opts.interactive === "boolean" ? { interactive: opts.interactive } : {},
			...typeof opts.compact === "boolean" ? { compact: opts.compact } : {},
			...typeof opts.depth === "number" && Number.isFinite(opts.depth) ? { depth: opts.depth } : {},
			...opts.selector?.trim() ? { selector: opts.selector.trim() } : {},
			...opts.frame?.trim() ? { frame: opts.frame.trim() } : {},
			...opts.labels === true ? { labels: "1" } : {},
			...opts.urls === true ? { urls: "1" } : {},
			...opts.mode ? { mode: opts.mode } : {},
			timeoutMs: resolvedTimeoutMs
		},
		profile: opts.profile,
		timeoutMs: resolvedTimeoutMs,
		signal: opts.signal
	});
}
//#endregion
export { browserRequests as C, browserPdfSave as S, browserWaitForDownload as T, browserDownload as _, browserOpenTab as a, browserNavigate as b, browserStart as c, browserSystemProfiles as d, browserTabs as f, browserConsoleMessages as g, browserArmFileChooser as h, browserImportProfile as i, browserStatus as l, browserArmDialog as m, browserDoctor as n, browserProfiles as o, browserAct as p, browserFocusTab as r, browserSnapshot as s, browserCloseTab as t, browserStop as u, browserEmulateSetting as v, browserScreenshotAction as w, browserPageText as x, browserErrors as y };
