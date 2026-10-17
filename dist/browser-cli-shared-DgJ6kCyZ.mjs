import { C as parseStrictNonNegativeInteger, a as addTimerTimeoutGraceMs, w as parseStrictPositiveInteger } from "./number-coercion-CuVhdCBs.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-Cl_Z2Z7Q.mjs";
import { t as danger } from "./globals-BXbZ1A_g.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./gateway-runtime-DMDKFL1_.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
import "./cli-runtime-DRAjv9MR.mjs";
import { r as BROWSER_REQUEST_GATEWAY_SCOPES, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-WuzRejvY.mjs";
import { t as normalizeBrowserTimerDelayMs } from "./timer-delay-DhAs5gz8.mjs";
import "./act-policy-PVRotc-k.mjs";
import { n as resolveBrowserProxyTimeouts } from "./browser-proxy-timeouts-l1Xf3Ykq.mjs";
//#region extensions/browser/src/cli/browser-cli-shared.ts
const BROWSER_TAB_REFERENCE_HELP = "Tab reference: suggested target id, tab id, label, raw target id, or unique raw prefix";
/** Adds gateway slack to a Browser action timeout so route work can finish cleanly. */
function withBrowserActionTimeoutSlack(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs ?? 2e4, 5e3) ?? 1;
}
async function runBrowserCliCommand(action, errorPolicy = "runtime") {
	const reportError = (error) => {
		defaultRuntime.error(danger(String(error)));
		defaultRuntime.exit(1);
	};
	if (errorPolicy === "runtime") {
		await runCommandWithRuntime(defaultRuntime, action, reportError);
		return;
	}
	try {
		await action();
	} catch (error) {
		reportError(error);
	}
}
/** Execute a scoped request with the command family's existing error and output policy. */
async function runBrowserCliRequest(params) {
	const action = async () => {
		const profile = params.profile === null ? void 0 : params.profile ?? params.parent.browserProfile;
		const result = await callBrowserRequest(params.parent, {
			method: params.method ?? "POST",
			path: params.path,
			query: resolveBrowserProfileQuery(profile, params.query),
			body: params.body
		}, { timeoutMs: params.timeoutMs });
		if (params.parent.json) defaultRuntime.writeJson(params.json ? params.json(result) : result);
		else if (params.print) params.print(result);
		else if (params.successMessage !== void 0) defaultRuntime.log(typeof params.successMessage === "function" ? params.successMessage(result) : params.successMessage);
	};
	await runBrowserCliCommand(action, params.errorPolicy);
}
function printBrowserJsonResult(parent, payload) {
	if (!parent?.json) return false;
	defaultRuntime.writeJson(payload);
	return true;
}
function resolveBrowserProfileQuery(profile, extra) {
	const query = {
		...profile ? { profile } : {},
		...extra
	};
	return Object.keys(query).length > 0 ? query : void 0;
}
function normalizeQuery(query) {
	if (!query) return;
	const out = {};
	for (const [key, value] of Object.entries(query)) {
		if (value === void 0) continue;
		out[key] = String(value);
	}
	return Object.keys(out).length ? out : void 0;
}
function parseBrowserPositiveIntegerOption(raw, flag) {
	const parsed = parseStrictPositiveInteger(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
function parseBrowserNonNegativeIntegerOption(raw, flag) {
	const parsed = parseStrictNonNegativeInteger(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
	return parsed;
}
async function callBrowserRequest(opts, params, extra) {
	const resolvedTimeout = typeof extra?.timeoutMs === "number" && Number.isFinite(extra.timeoutMs) ? normalizeBrowserTimerDelayMs(extra.timeoutMs) : typeof opts.timeout === "string" ? normalizeBrowserTimerDelayMs(parseBrowserPositiveIntegerOption(opts.timeout, "--timeout")) : void 0;
	const budgets = resolvedTimeout === void 0 ? void 0 : resolveBrowserProxyTimeouts(resolvedTimeout);
	const payload = await callGatewayFromCli(BROWSER_REQUEST_GATEWAY_METHOD, {
		...opts,
		timeout: budgets ? String(budgets.gatewayTimeoutMs) : opts.timeout
	}, {
		method: params.method,
		path: params.path,
		query: normalizeQuery(params.query),
		body: params.body,
		timeoutMs: budgets?.proxyTimeoutMs
	}, {
		progress: extra?.progress,
		scopes: [...BROWSER_REQUEST_GATEWAY_SCOPES]
	});
	if (payload === void 0) throw new Error("Unexpected browser.request response");
	return payload;
}
//#endregion
export { printBrowserJsonResult as a, runBrowserCliRequest as c, parseBrowserPositiveIntegerOption as i, withBrowserActionTimeoutSlack as l, callBrowserRequest as n, resolveBrowserProfileQuery as o, parseBrowserNonNegativeIntegerOption as r, runBrowserCliCommand as s, BROWSER_TAB_REFERENCE_HELP as t };
