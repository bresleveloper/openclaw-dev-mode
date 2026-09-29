import { C as parseStrictNonNegativeInteger, a as addTimerTimeoutGraceMs, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as danger } from "./globals-QODkv80i.mjs";
import { n as callGatewayFromCli } from "./gateway-rpc-DXO3PHhc.mjs";
import "./number-runtime-CGwowceO.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-CPCW_T04.mjs";
import { r as BROWSER_REQUEST_GATEWAY_SCOPES, t as BROWSER_REQUEST_GATEWAY_METHOD } from "./browser-gateway-contract-B6OC_gCs.mjs";
import { t as normalizeBrowserTimerDelayMs } from "./timer-delay-DhAs5gz8.mjs";
import "./act-policy-3Ku82pq-.mjs";
import { n as resolveBrowserProxyTimeouts } from "./browser-proxy-timeouts-Bk8MhInd.mjs";
import "./core-api-C-ygP6nL.mjs";
//#region extensions/browser/src/cli/browser-cli-shared.ts
/**
* Shared Browser CLI option parsing and gateway request helpers.
*/
/** Help text for user-facing tab references accepted by Browser CLI commands. */
const BROWSER_TAB_REFERENCE_HELP = "Tab reference: suggested target id, tab id, label, raw target id, or unique raw prefix";
/** Adds gateway slack to a Browser action timeout so route work can finish cleanly. */
function withBrowserActionTimeoutSlack(timeoutMs) {
	return addTimerTimeoutGraceMs(timeoutMs ?? 2e4, 5e3) ?? 1;
}
/** Runs a Browser CLI command with the standard runtime error handling. */
function runBrowserCliCommand(action) {
	return runCommandWithRuntime(defaultRuntime, action, (error) => {
		defaultRuntime.error(danger(String(error)));
		defaultRuntime.exit(1);
	});
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
	if (params.errorPolicy !== "inline") {
		await runBrowserCliCommand(action);
		return;
	}
	try {
		await action();
	} catch (err) {
		defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	}
}
/** Writes a Browser command result when structured output was requested. */
function printBrowserJsonResult(parent, payload) {
	if (!parent?.json) return false;
	defaultRuntime.writeJson(payload);
	return true;
}
/** Combines the selected Browser profile with optional request query fields. */
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
/** Parses a positive integer value for Browser CLI options. */
function parseBrowserPositiveIntegerValue(value) {
	return parseStrictPositiveInteger(value);
}
/** Parses a non-negative integer value for Browser CLI options. */
function parseBrowserNonNegativeIntegerValue(value) {
	return parseStrictNonNegativeInteger(value);
}
/** Parses and validates a required positive integer CLI option. */
function parseBrowserPositiveIntegerOption(raw, flag) {
	const parsed = parseBrowserPositiveIntegerValue(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
	return parsed;
}
/** Parses and validates a required non-negative integer CLI option. */
function parseBrowserNonNegativeIntegerOption(raw, flag) {
	const parsed = parseBrowserNonNegativeIntegerValue(raw);
	if (parsed === void 0) throw new Error(`${flag} must be a non-negative integer.`);
	return parsed;
}
/** Calls the Browser gateway request method with normalized timeout/query options. */
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
export { parseBrowserPositiveIntegerOption as a, resolveBrowserProfileQuery as c, withBrowserActionTimeoutSlack as d, parseBrowserNonNegativeIntegerValue as i, runBrowserCliCommand as l, callBrowserRequest as n, parseBrowserPositiveIntegerValue as o, parseBrowserNonNegativeIntegerOption as r, printBrowserJsonResult as s, BROWSER_TAB_REFERENCE_HELP as t, runBrowserCliRequest as u };
