import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./constants-C-i9f6FL.mjs";
import { n as postBrowserJson, r as requestBrowserJson, t as browserClientTimeout } from "./client-request-wUP6Yv8y.mjs";
//#region extensions/browser/src/browser/client.ts
const BROWSER_STATUS_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DOCTOR_REQUEST_TIMEOUT_MS = 7500;
const BROWSER_DEEP_DOCTOR_REQUEST_TIMEOUT_MS = 1e4;
async function sendProfilePost(baseUrl, path, opts, fallbackTimeoutMs) {
	await requestBrowserJson(baseUrl, path, {
		profile: opts?.profile,
		method: "POST",
		timeoutMs: browserClientTimeout(baseUrl, opts?.timeoutMs, fallbackTimeoutMs),
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
	await sendProfilePost(baseUrl, "/start", opts, 15e3);
}
async function browserStop(baseUrl, opts) {
	await sendProfilePost(baseUrl, "/stop", opts, 15e3);
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
	return await postBrowserJson(baseUrl, "/tabs/open", {
		url,
		...opts?.label ? { label: opts.label } : {},
		...opts?.managedOnly ? { managedOnly: true } : {}
	}, browserClientTimeout(baseUrl, opts?.timeoutMs, 15e3), opts);
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
export { browserOpenTab as a, browserStart as c, browserSystemProfiles as d, browserTabs as f, browserImportProfile as i, browserStatus as l, browserDoctor as n, browserProfiles as o, browserFocusTab as r, browserSnapshot as s, browserCloseTab as t, browserStop as u };
