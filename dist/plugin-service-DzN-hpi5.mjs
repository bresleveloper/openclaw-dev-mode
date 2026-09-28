import { F as resolveTimerTimeoutMs, N as resolveOptionalIntegerOption, a as addTimerTimeoutGraceMs, m as clampTimerTimeoutMs, p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { Fn as object, Jn as string, Lt as boolean } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import { t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-B-fhY8wF.mjs";
import { a as wrapExternalContent, i as truncateSanitizedExternalContent } from "./external-content-CLufk6dK.mjs";
import { t as jsonResult } from "./tool-results-BCM3fdVS.mjs";
import { d as readPositiveIntegerParam, h as readToolStringParam, i as imageResultFromFile, l as readNonNegativeIntegerParam } from "./common-XfKigJno.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { f as saveMediaBuffer } from "./store-BrX2xbJz.mjs";
import { t as callGatewayTool } from "./gateway-DVDJurQC.mjs";
import { o as hasGatewayToolRoutingContext } from "./in-process-gateway-BvSta947.mjs";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-CnGfXM76.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CdKXjEQN.mjs";
import "./media-runtime-CPk2kXLr.mjs";
import "./media-store-3sV8Wgz8.mjs";
import { t as startLazyPluginServiceModule } from "./plugin-runtime-BUxbDDeH.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { r as parseGatewayPayload, t as respondUnavailableOnNodeInvokeError } from "./nodes.helpers-i6ZoxrHI.mjs";
import { n as redactCdpUrl } from "./browser-cdp-nPpqdqz_.mjs";
import { t as describeImageFile } from "./runtime-CSaGrQ8c.mjs";
import "./param-readers-BfezLD6d.mjs";
import { K as parseBrowserSessionTabCloseResult } from "./session-tab-store-CyxH9Sdj.mjs";
import { a as applyBrowserTabToolBinding, c as BROWSER_PROXY_UPLOAD_COMMAND, i as describeBrowserTool, l as browserProxyUploadUnavailableMessage, n as createBrowserToolSchema, o as parseBrowserTabToolBinding, r as resolveBrowserToolCapabilities, s as BROWSER_PROXY_COMMAND, t as BrowserToolOutputSchema } from "./browser-tool.schema-fgykLlsu.mjs";
import { i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS } from "./constants-DKjTvIBP.mjs";
import { d as resolveBrowserNavigationTimeoutMs, o as EXISTING_SESSION_TIMEOUT_OVERRIDE_KINDS, u as resolveBrowserActRequestTimeoutMs } from "./act-policy-3Ku82pq-.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import "./server-middleware-BdaDaWET.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import "./errors-DS4y5mrd.mjs";
import { I as parseBrowserNavigationUrl, T as findRoleSnapshotLineRef, w as finalizeRoleSnapshot } from "./chrome-BYoc4jk9.mjs";
import { i as resolveExistingUploadPaths } from "./paths-BD1L9gFZ.mjs";
import { r as closeTrackedCdpTarget } from "./cdp.helpers-DHnECuD4.mjs";
import "./sdk-config-gK490kvN.mjs";
import "./chrome.executables-Cv2wahLt.mjs";
import "./runtime-lifecycle-C9_Tgi94.mjs";
import { a as trackSessionBrowserTab, i as touchSessionBrowserTab, o as untrackSessionBrowserTab } from "./session-tab-registry-BJ4WvzwC.mjs";
import "./bridge-server-CxbA2QZC.mjs";
import { i as withTimeout } from "./control-auth-C64SeqmO.mjs";
import "./trash-CAu63IBo.mjs";
import "./sdk-setup-tools-Cu4qMD1_.mjs";
import { a as stopBrowserDashboard, i as requestBrowserDashboard, n as inspectBrowserDashboard, t as assertBrowserDashboardTargetCurrent } from "./browser-dashboard-BuFSvl9t.mjs";
import { n as resolveCdpControlPolicy } from "./cdp-reachability-policy-BY3s_i-8.mjs";
import { C as withBrowserRequestScope, S as fetchBrowserJson, _ as browserTabs, a as browserDoctor, b as requestBrowserJson, c as browserOpenTab, d as browserSnapshot, f as browserStart, h as browserSystemProfiles, l as browserProfiles, m as browserStop, o as browserFocusTab, p as browserStatus, s as browserImportProfile, t as browserCloseTab, v as browserClientTimeout, x as BrowserServiceError, y as postBrowserJson } from "./client-D6ttU4nJ.mjs";
import { a as prepareBrowserProxyUploadRequest, c as BROWSER_PROXY_MAX_FILE_BYTES, d as assertBrowserProxyFileCountWithinLimit, f as createBrowserProxyFailure, h as visitBrowserProxyFilePaths, i as isBrowserProxyUploadRequest, l as BROWSER_PROXY_OWNED_TAB_CLOSE_PATH, m as parseBrowserProxyRoute, n as ensureBrowserProxyUploadCleanup, o as stageBrowserProxyUploadRequest, p as parseBrowserProxyFailure, r as hasBrowserProxyUploadWork, s as BROWSER_PROXY_ERROR_ENVELOPE, t as discardStagedBrowserProxyUpload, u as assertBrowserProxyFileBytesWithinLimits } from "./browser-proxy-upload-C3uTYsDf.mjs";
import { n as resolveBrowserProxyTimeouts, t as resolveBrowserProxyTimeoutMs } from "./browser-proxy-timeouts-Bk8MhInd.mjs";
import { a as resolveRequestedBrowserProfile, c as normalizeBrowserScreenshot, i as normalizeBrowserRequestPath, n as isBrowserHostLocalRoute, o as DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES, r as isPersistentBrowserProfileMutation } from "./routes-DmirL8fe.mjs";
import { s as parseSystemProfileDomains } from "./system-profiles-BTo99j-k.mjs";
import { a as loadBrowserConfigForRuntimeRefresh } from "./server-context-A9sD7-b4.mjs";
import { i as hasBrowserControlWork, r as getBrowserControlState, t as createBrowserControlContext } from "./browser-control-state-CUAhFG1B.mjs";
import "./form-fields-PPIIbhqD.mjs";
import { t as createBrowserRouteDispatcher } from "./dispatcher-BdY-KfnC.mjs";
import { t as describeBrowserControlUnavailable } from "./plugin-enabled-0m53a7Un.mjs";
import { t as startBrowserControlServiceFromConfig } from "./control-service-BY6XWalP.mjs";
import { toUSVString } from "node:util";
import path from "node:path";
import fs, { readFile } from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/browser/src/browser-node-fallback.ts
/**
* Browser-node fallback classification.
*
* Only the node host's explicit pre-dispatch reachability failure is safe to
* retry on the Gateway host. Other failures may follow a mutating action.
*/
const BROWSER_CONTROL_HOST_UNREACHABLE = /\bbrowser control host is not reachable\b/i;
function isBrowserControlHostUnavailableError(value) {
	const seen = /* @__PURE__ */ new Set();
	const visit = (candidate, depth) => {
		if (typeof candidate === "string") return BROWSER_CONTROL_HOST_UNREACHABLE.test(candidate);
		if (!candidate || typeof candidate !== "object" || depth > 3 || seen.has(candidate)) return false;
		seen.add(candidate);
		const record = candidate;
		if (typeof record.message === "string" && BROWSER_CONTROL_HOST_UNREACHABLE.test(record.message)) return true;
		return [
			record.error,
			record.cause,
			record.details,
			record.nodeError
		].some((entry) => visit(entry, depth + 1));
	};
	return visit(value, 0);
}
//#endregion
//#region extensions/browser/src/browser/client-actions-core.ts
/**
* Browser client action helpers.
*
* Wraps browser-control action endpoints for navigation, dialog/file hooks,
* screenshots, and element actions used by the Browser agent tool.
*/
function resolveBrowserOperationRequestTimeoutMs(timeoutMs) {
	const operationTimeoutMs = clampPositiveTimerTimeoutMs(timeoutMs) ?? 12e4;
	return addTimerTimeoutGraceMs(operationTimeoutMs, 5e3) ?? 1;
}
/** Navigate a browser tab through the control server. */
async function browserNavigate(baseUrl, opts) {
	const timeoutMs = resolveBrowserNavigationTimeoutMs(opts.timeoutMs);
	return await postBrowserJson(baseUrl, "/navigate", {
		url: opts.url,
		targetId: opts.targetId,
		timeoutMs
	}, resolveBrowserOperationRequestTimeoutMs(timeoutMs), opts);
}
/** Arm a one-shot browser dialog handler. */
async function browserArmDialog(baseUrl, opts) {
	return await postBrowserJson(baseUrl, "/hooks/dialog", {
		accept: opts.accept,
		promptText: opts.promptText,
		dialogId: opts.dialogId,
		targetId: opts.targetId,
		timeoutMs: opts.timeoutMs
	}, browserClientTimeout(baseUrl, void 0, resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs)), opts);
}
/** Arm or execute a browser file chooser upload. */
async function browserArmFileChooser(baseUrl, opts) {
	return await postBrowserJson(baseUrl, "/hooks/file-chooser", {
		paths: opts.paths,
		ref: opts.ref,
		inputRef: opts.inputRef,
		element: opts.element,
		targetId: opts.targetId,
		timeoutMs: opts.timeoutMs
	}, browserClientTimeout(baseUrl, void 0, resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs)), opts);
}
/** Wait for the next managed browser download and save it under the guarded download root. */
async function browserWaitForDownload(baseUrl, opts) {
	return await postBrowserJson(baseUrl, "/wait/download", {
		targetId: opts.targetId,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs), opts);
}
/** Click a snapshot ref and save its download under the guarded download root. */
async function browserDownload(baseUrl, opts) {
	return await postBrowserJson(baseUrl, "/download", {
		targetId: opts.targetId,
		ref: opts.ref,
		path: opts.path,
		timeoutMs: opts.timeoutMs
	}, resolveBrowserOperationRequestTimeoutMs(opts.timeoutMs), opts);
}
/** Execute one normalized browser action request. */
async function browserAct(baseUrl, req, opts) {
	return await postBrowserJson(baseUrl, "/act", req, resolveTimerTimeoutMs(opts?.timeoutMs, resolveBrowserActRequestTimeoutMs(req)), opts);
}
/** Capture a screenshot through the browser control server. */
async function browserScreenshotAction(baseUrl, opts) {
	const effectiveTimeoutMs = clampPositiveTimerTimeoutMs(opts.timeoutMs) ?? 2e4;
	return await postBrowserJson(baseUrl, "/screenshot", {
		targetId: opts.targetId,
		fullPage: opts.fullPage,
		ref: opts.ref,
		element: opts.element,
		type: opts.type,
		labels: opts.labels,
		timeoutMs: effectiveTimeoutMs
	}, effectiveTimeoutMs, opts);
}
//#endregion
//#region extensions/browser/src/browser/client-actions-observe.ts
function buildQuery(params) {
	const query = {};
	for (const [key, value] of params) {
		if (typeof value === "boolean") {
			query[key] = value;
			continue;
		}
		if (typeof value === "string" && value.length > 0) query[key] = value;
	}
	return query;
}
/** Read browser console messages for a tab. */
async function browserConsoleMessages(baseUrl, opts = {}) {
	const query = buildQuery([["level", opts.level], ["targetId", opts.targetId]]);
	return await requestBrowserJson(baseUrl, "/console", {
		query,
		profile: opts.profile,
		timeoutMs: browserClientTimeout(baseUrl, void 0, 2e4),
		signal: opts.signal
	});
}
/** Read the collected network request log for a tab. */
async function browserRequests(baseUrl, opts = {}) {
	const query = buildQuery([
		["filter", opts.filter],
		["clear", opts.clear],
		["targetId", opts.targetId]
	]);
	return await requestBrowserJson(baseUrl, "/requests", {
		query,
		profile: opts.profile,
		timeoutMs: browserClientTimeout(baseUrl, void 0, 2e4),
		signal: opts.signal
	});
}
/** Read the collected page error log for a tab. */
async function browserErrors(baseUrl, opts = {}) {
	const query = buildQuery([["clear", opts.clear], ["targetId", opts.targetId]]);
	return await requestBrowserJson(baseUrl, "/errors", {
		query,
		profile: opts.profile,
		timeoutMs: browserClientTimeout(baseUrl, void 0, 2e4),
		signal: opts.signal
	});
}
/** Read bounded visible text without executing page-supplied code. */
async function browserPageText(baseUrl, opts) {
	const query = {
		...buildQuery([["targetId", opts.targetId], ["selector", opts.selector]]),
		maxChars: opts.maxChars
	};
	return await requestBrowserJson(baseUrl, "/text", {
		query,
		profile: opts.profile,
		timeoutMs: browserClientTimeout(baseUrl, void 0, 2e4),
		signal: opts.signal
	});
}
/** Apply one of the browser control service's existing emulation settings. */
async function browserEmulateSetting(baseUrl, opts) {
	return await postBrowserJson(baseUrl, `/set/${opts.setting}`, opts.body, browserClientTimeout(baseUrl, void 0, 2e4), opts);
}
/** Save the current page as PDF through browser control. */
async function browserPdfSave(baseUrl, opts = {}) {
	return await postBrowserJson(baseUrl, "/pdf", { targetId: opts.targetId }, browserClientTimeout(baseUrl, void 0, 2e4), opts);
}
//#endregion
//#region extensions/browser/src/browser/proxy-files.ts
/**
* Browser proxy file helpers.
*
* Persists files returned by node-hosted browser proxy calls and rewrites
* proxied result paths to local saved media paths.
*/
const INVALID_BROWSER_PROXY_FILE_ENVELOPE = "browser proxy returned an invalid file envelope";
function invalidBrowserProxyFileEnvelope() {
	throw new Error(INVALID_BROWSER_PROXY_FILE_ENVELOPE);
}
function collectBrowserProxyResultPaths(result) {
	const paths = /* @__PURE__ */ new Set();
	visitBrowserProxyFilePaths(result, (filePath) => {
		paths.add(filePath);
		assertBrowserProxyFileCountWithinLimit(paths.size);
	});
	return paths;
}
function validateBrowserProxyFiles(result, files) {
	const referencedPaths = collectBrowserProxyResultPaths(result);
	const candidates = files === void 0 ? [] : files;
	if (!Array.isArray(candidates)) return invalidBrowserProxyFileEnvelope();
	assertBrowserProxyFileCountWithinLimit(candidates.length);
	const validated = [];
	for (const value of candidates) {
		const file = asNullableRecord(value);
		if (!file || typeof file.path !== "string" || !file.path.trim() || typeof file.base64 !== "string" || file.mimeType !== void 0 && typeof file.mimeType !== "string" || !referencedPaths.delete(file.path)) return invalidBrowserProxyFileEnvelope();
		validated.push({
			path: file.path,
			base64: file.base64,
			...file.mimeType === void 0 ? {} : { mimeType: file.mimeType }
		});
	}
	if (referencedPaths.size > 0) return invalidBrowserProxyFileEnvelope();
	return validated;
}
function decodeBrowserProxyFileBase64(file, totalBytes) {
	const estimatedBytes = estimateBase64DecodedBytes(file.base64);
	assertBrowserProxyFileBytesWithinLimits(estimatedBytes, totalBytes + estimatedBytes);
	const canonicalBase64 = file.base64 === "" ? "" : canonicalizeBase64(file.base64);
	if (canonicalBase64 === void 0) throw new Error("browser proxy file contains malformed base64 data");
	const buffer = Buffer.from(canonicalBase64, "base64");
	assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
	return buffer;
}
/** Validate, persist, and rewrite every route-owned file in a node result. */
async function persistBrowserProxyResultFiles(result, files) {
	const validatedFiles = validateBrowserProxyFiles(result, files);
	if (validatedFiles.length === 0) return result;
	const decoded = [];
	let totalBytes = 0;
	for (const file of validatedFiles) {
		const buffer = decodeBrowserProxyFileBase64(file, totalBytes);
		totalBytes += buffer.byteLength;
		decoded.push({
			file,
			buffer
		});
	}
	const mapping = /* @__PURE__ */ new Map();
	for (const { file, buffer } of decoded) {
		const saved = await saveMediaBuffer(buffer, file.mimeType, "browser", BROWSER_PROXY_MAX_FILE_BYTES, file.path);
		mapping.set(file.path, saved.path);
	}
	visitBrowserProxyFilePaths(result, (filePath) => mapping.get(filePath));
	return result;
}
//#endregion
//#region extensions/browser/src/browser/screenshot-sharing.ts
/** Stages a bounded screenshot copy in the sandbox-authorized outbound store. */
async function stageBrowserScreenshotForSharing(filePath, maxDimensionPx) {
	const source = await readFile(filePath);
	const normalized = await normalizeBrowserScreenshot(source, {
		maxSide: maxDimensionPx ?? 2e3,
		maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES
	});
	return (await saveMediaBuffer(normalized.buffer, normalized.contentType, "outbound", DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES, path.basename(filePath))).path;
}
//#endregion
//#region extensions/browser/src/browser-tool.runtime.ts
/**
* Runtime dependency barrel for the Browser agent tool.
*
* Kept separate from browser-tool.ts so tests can mock the tool boundary while
* production still imports SDK helpers and browser client actions lazily.
*/
/** Resolve global image downscaling for screenshots returned to agent tools. */
function resolveRuntimeImageSanitization() {
	const maxDimensionPx = resolveOptionalIntegerOption(getRuntimeConfig().agents?.defaults?.imageMaxDimensionPx, { min: 1 });
	if (maxDimensionPx === void 0) return;
	return { maxDimensionPx };
}
//#endregion
//#region extensions/browser/src/browser-node-proxy.ts
const logger$1 = createSubsystemLogger("browser");
var BrowserNodeSafeFallbackError = class extends Error {
	constructor(message, cause) {
		super(message, cause === void 0 ? void 0 : { cause });
		this.name = "BrowserNodeSafeFallbackError";
	}
};
function unwrapBrowserProxyPayload(payload) {
	if (payload?.payload !== void 0) return payload.payload;
	if (typeof payload?.payloadJSON !== "string" || !payload.payloadJSON.trim()) return null;
	try {
		return JSON.parse(payload.payloadJSON);
	} catch {
		return null;
	}
}
async function callBrowserProxy(params) {
	const { proxyTimeoutMs, nodeInvokeTimeoutMs, gatewayTimeoutMs } = resolveBrowserProxyTimeouts(params.timeoutMs);
	if (isBrowserProxyUploadRequest(params) && !params.declaredCommands.includes("browser.proxy.upload.v1")) throw new BrowserNodeSafeFallbackError(browserProxyUploadUnavailableMessage(params.pendingDeclaredCommands));
	const preparedUpload = await prepareBrowserProxyUploadRequest({
		method: params.method,
		path: params.path,
		body: params.body,
		signal: params.signal
	});
	const command = preparedUpload.upload ? BROWSER_PROXY_UPLOAD_COMMAND : BROWSER_PROXY_COMMAND;
	let payload;
	try {
		payload = await callGatewayTool("node.invoke", { timeoutMs: gatewayTimeoutMs }, {
			nodeId: params.nodeId,
			command,
			timeoutMs: nodeInvokeTimeoutMs,
			params: {
				method: params.method,
				path: params.path,
				query: params.query,
				body: preparedUpload.body,
				upload: preparedUpload.upload,
				timeoutMs: proxyTimeoutMs,
				profile: params.profile,
				errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE
			},
			idempotencyKey: crypto.randomUUID()
		}, {
			scopes: ["operator.admin"],
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.allowAutomaticHostFallback && isBrowserControlHostUnavailableError(error)) throw new BrowserNodeSafeFallbackError("browser node control host unavailable", error);
		throw error;
	}
	const parsed = unwrapBrowserProxyPayload(payload);
	if (!parsed || typeof parsed !== "object" || !("result" in parsed) && !parseBrowserProxyFailure(parsed)) {
		const selectedNode = truncateUtf16Safe(params.nodeLabel?.trim() || params.nodeId, 256);
		throw new Error(`Browser proxy returned an invalid response from node ${JSON.stringify(selectedNode)}. Retry with action=status target="host" to check Gateway host browser control.`);
	}
	return parsed;
}
async function callLocalBrowserControl(params) {
	const url = new URL(params.path, "http://localhost");
	for (const [key, value] of Object.entries(params.query ?? {})) if (value !== void 0) url.searchParams.set(key, String(value));
	if (params.profile) url.searchParams.set("profile", params.profile);
	return await fetchBrowserJson(`${url.pathname}${url.search}`, {
		method: params.method,
		body: params.body === void 0 ? void 0 : JSON.stringify(params.body),
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
function createBrowserNodeProxyRequest(params) {
	let target = params.allowAutomaticHostFallback ? "auto" : "node";
	let route;
	const dispatch = async (request) => {
		const requestWithSignal = request.signal || params.signal ? {
			...request,
			signal: request.signal ?? params.signal
		} : request;
		if (target === "host") return await callLocalBrowserControl(requestWithSignal);
		try {
			const proxy = await callBrowserProxy({
				nodeId: params.nodeTarget.nodeId,
				nodeLabel: params.nodeTarget.label,
				declaredCommands: params.nodeTarget.commands ?? [],
				pendingDeclaredCommands: params.nodeTarget.pendingDeclaredCommands ?? [],
				allowAutomaticHostFallback: target === "auto",
				...requestWithSignal
			});
			target = "node";
			route = parseBrowserProxyRoute(proxy);
			const failure = parseBrowserProxyFailure(proxy);
			if (failure) {
				const { status, body } = failure.error;
				throw new BrowserServiceError(body.error, body, status);
			}
			if (!("result" in proxy)) throw new Error("Browser proxy returned a failure without an error payload.");
			return await persistBrowserProxyResultFiles(proxy.result, proxy.files);
		} catch (error) {
			if (target !== "auto" || !(error instanceof BrowserNodeSafeFallbackError)) throw error;
			target = "host";
			route = void 0;
			logger$1.warn(`browser node ${params.nodeTarget.label ?? params.nodeTarget.nodeId} unavailable before dispatch (${error.message}); falling back to Gateway host`);
			return await callLocalBrowserControl(requestWithSignal);
		}
	};
	return Object.assign(dispatch, {
		isHostFallbackActive: () => target === "host",
		route: () => route
	});
}
function createBrowserNodeSessionTabRoute(nodeTarget) {
	return {
		kind: "node-proxy",
		nodeId: nodeTarget.nodeId,
		closeTarget: async (tab) => {
			const cleanupProxy = createBrowserNodeProxyRequest({
				nodeTarget,
				allowAutomaticHostFallback: false
			});
			if (tab.ownership?.status === "durable") return parseBrowserSessionTabCloseResult(await cleanupProxy({
				method: "POST",
				path: BROWSER_PROXY_OWNED_TAB_CLOSE_PATH,
				body: { ownership: tab.ownership },
				profile: tab.profile
			}));
			await cleanupProxy({
				method: "DELETE",
				path: `/tabs/${encodeURIComponent(tab.targetId)}`,
				query: { targetIdMode: "raw" },
				profile: tab.profile
			});
			return { status: "closed" };
		}
	};
}
//#endregion
//#region extensions/browser/src/browser-tool-session-tabs.ts
/**
* Session tracking for tabs created through the browser tool.
*/
function readOpenedTab(result) {
	if (!result || typeof result !== "object" || Array.isArray(result)) return { aliases: [] };
	const opened = result;
	const targetId = normalizeOptionalString(opened.targetId);
	const aliases = [
		targetId,
		normalizeOptionalString(opened.tabId),
		normalizeOptionalString(opened.label),
		normalizeOptionalString(opened.suggestedTargetId)
	].filter((alias) => Boolean(alias));
	const profile = normalizeOptionalString(opened.resolvedProfile);
	const rawOwnership = opened.ownership && typeof opened.ownership === "object" ? opened.ownership : void 0;
	const ownership = rawOwnership?.status === "durable" && !profile ? void 0 : rawOwnership;
	return {
		targetId,
		aliases: [...new Set(aliases)],
		profile,
		ownership
	};
}
function stripBrowserOpenInternalMetadata(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return value;
	const { ownership: _ownership, resolvedProfile: _resolvedProfile, ...agentVisible } = value;
	return agentVisible;
}
async function trackOpenedBrowserTab(params) {
	const opened = readOpenedTab(params.result);
	const profile = opened.profile ?? params.fallbackProfile;
	try {
		params.track({
			sessionKey: params.sessionKey,
			targetId: opened.targetId,
			route: params.route,
			profile,
			...params.fallbackProfile && opened.profile && opened.profile !== params.fallbackProfile ? { profileAliases: [params.fallbackProfile] } : {},
			ownership: params.route.kind === "browser-control" && params.route.baseUrl ? void 0 : opened.ownership,
			aliases: opened.aliases
		});
	} catch (trackingError) {
		if (!opened.targetId) throw trackingError;
		try {
			await params.closeTab(opened.targetId, profile);
		} catch (closeError) {
			throw Object.assign(new Error("Failed to register browser tab cleanup and close the newly opened tab", { cause: closeError }), {
				name: "BrowserTabTrackingCompensationError",
				errors: [trackingError, closeError]
			});
		}
		throw trackingError;
	}
}
function createBrowserToolSessionTabs(params) {
	const trackedRoute = () => params.nodeRoute && !params.isHostFallbackActive?.() ? params.nodeRoute : {
		kind: "browser-control",
		...params.baseUrl ? { baseUrl: params.baseUrl } : {}
	};
	const trackedProfile = (route) => route.kind === "node-proxy" ? params.routeProfile?.() ?? params.requestedProfile : route.baseUrl && !params.requestedProfile ? void 0 : params.requestedProfile ?? params.defaultProfile;
	const identity = (targetId) => {
		const route = trackedRoute();
		return {
			sessionKey: params.sessionKey,
			targetId,
			route,
			profile: trackedProfile(route)
		};
	};
	return {
		touch: (targetId) => {
			if (targetId) params.registry.touchSessionBrowserTab(identity(targetId));
		},
		untrack: (targetId) => {
			if (targetId) params.registry.untrackSessionBrowserTab(identity(targetId));
		},
		trackOpened: async (result, closeTab) => {
			const route = trackedRoute();
			const profile = trackedProfile(route);
			await trackOpenedBrowserTab({
				result,
				sessionKey: params.sessionKey,
				fallbackProfile: profile,
				route,
				track: params.registry.trackSessionBrowserTab,
				closeTab
			});
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/vision.ts
/**
* Browser screenshot description helpers built on the shared media image
* understanding contract. No browser-specific model registry lives here.
*/
/** Default prompt for turning browser screenshots into text-only page context. */
const DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT = "Describe what is visible in this browser screenshot. Capture page layout, headings, primary content blocks, visible text, and notable interactive elements so a text-only assistant can reason about the page.";
function normalizeActiveModel(activeModel) {
	const provider = activeModel?.provider?.trim();
	if (!provider) return;
	const model = activeModel?.model?.trim();
	return model ? {
		provider,
		model
	} : { provider };
}
async function resolveImageUnderstandingFilePath(ctx, deps) {
	const maxDimensionPx = ctx.imageSanitization?.maxDimensionPx;
	if (typeof maxDimensionPx !== "number" || !Number.isFinite(maxDimensionPx)) return ctx.filePath;
	const source = await readFile(ctx.filePath);
	const normalized = await deps.normalizeBrowserScreenshot(source, { maxSide: Math.max(1, Math.floor(maxDimensionPx)) });
	if (normalized.buffer === source) return ctx.filePath;
	return (await deps.saveMediaBuffer(normalized.buffer, normalized.contentType ?? "image/jpeg", "browser")).path;
}
/** Produces a text description for a browser screenshot, or null when no text was produced. */
async function describeBrowserScreenshot(ctx, deps) {
	const filePath = await resolveImageUnderstandingFilePath(ctx, deps);
	const agentId = ctx.agentDir ? void 0 : (await import("./plugin-sdk/agent-scope-runtime.js")).resolveSessionAgentIdStrict({
		agentId: ctx.agentId,
		sessionKey: ctx.mediaScope?.sessionKey,
		config: ctx.cfg
	});
	const described = await deps.describeImageFile({
		filePath,
		cfg: ctx.cfg,
		prompt: DEFAULT_BROWSER_SCREENSHOT_DESCRIPTION_PROMPT,
		...agentId ? { agentId } : {},
		agentDir: ctx.agentDir,
		workspaceDir: ctx.workspaceDir,
		activeModel: normalizeActiveModel(ctx.activeModel),
		scopeContext: ctx.mediaScope
	});
	const text = described.text?.trim();
	if (!text) return null;
	return {
		text,
		provider: described.provider,
		model: described.model,
		decision: described.decision
	};
}
/** Neutralizes model-generated MEDIA directives before feeding text back to tools. */
function neutralizeMediaDirectives(text) {
	if (!text || !/media:/i.test(text)) return text;
	const lines = text.split("\n");
	let changed = false;
	for (const [i, line] of lines.entries()) {
		const leading = line.length - line.trimStart().length;
		const rest = line.slice(leading);
		if (/^MEDIA:/i.test(rest)) {
			lines[i] = `${line.slice(0, leading)}[neutralized] ${rest}`;
			changed = true;
		}
	}
	return changed ? lines.join("\n") : text;
}
//#endregion
//#region extensions/browser/src/browser-tool.snapshot.ts
const BROWSER_EXTERNAL_JSON_TRUNCATION_MARKERS = {
	snapshot: "\n[truncated — retry with a smaller maxChars or limit]",
	console: "\n[truncated — retry with a stricter level or targetId]",
	requests: "\n[truncated — retry with a narrower filter or smaller limit]",
	errors: "\n[truncated — retry with a smaller limit]",
	tabs: "\n[truncated — retry with action=snapshot and a specific targetId]",
	act: "\n[truncated — inspect the affected targetId with action=snapshot]",
	download: "\n[truncated — retry with a specific targetId and download ref]"
};
function truncateBrowserToolText(value, marker, maxChars) {
	const bounded = truncateSanitizedExternalContent(value, maxChars);
	if (!bounded.truncated) return bounded;
	if (marker.length > maxChars) return bounded;
	return {
		text: `${truncateSanitizedExternalContent(value, Math.max(0, maxChars - marker.length)).text}${marker}`,
		truncated: true
	};
}
/** Bound and wrap browser-originated text before it reaches the model. */
function wrapBrowserExternalText(params) {
	const wrap = (value) => wrapExternalContent(value, {
		source: "browser",
		includeWarning: params.includeWarning
	});
	const prefix = params.prefix ? `${params.prefix}\n` : "";
	const wrapperOverhead = prefix.length + wrap("").length;
	let maxInnerChars = Math.max(0, Math.min(params.maxChars ?? Infinity, DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS - wrapperOverhead));
	const value = neutralizeMediaDirectives(params.value);
	let bounded = truncateBrowserToolText(value, params.marker, maxInnerChars);
	let wrappedText = prefix + wrap(bounded.text);
	if (wrappedText.length > 16e3) {
		maxInnerChars = Math.max(0, maxInnerChars - (wrappedText.length - DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS));
		bounded = truncateBrowserToolText(value, params.marker, maxInnerChars);
		wrappedText = prefix + wrap(bounded.text);
	}
	return {
		text: wrappedText,
		boundedText: bounded.text,
		truncated: bounded.truncated
	};
}
/** Wrap page-controlled JSON payloads as untrusted browser content. */
function wrapBrowserExternalJson(params) {
	const wrapped = wrapBrowserExternalText({
		value: JSON.stringify(params.payload, (_key, value) => typeof value === "string" ? neutralizeMediaDirectives(value) : value, 2) ?? "null",
		marker: BROWSER_EXTERNAL_JSON_TRUNCATION_MARKERS[params.kind],
		includeWarning: params.includeWarning ?? true
	});
	return {
		wrappedText: wrapped.text,
		truncated: wrapped.truncated,
		safeDetails: {
			ok: true,
			externalContent: {
				untrusted: true,
				source: "browser",
				kind: params.kind,
				wrapped: true
			}
		}
	};
}
/** Keep debug log counts aligned with complete records inside the output budget. */
function formatBrowserDebugLogResult(kind, result, entries, limit) {
	const total = entries.length;
	let records = entries.slice(-limit);
	const details = () => ({
		ok: result.ok,
		targetId: result.targetId,
		url: result.url,
		total,
		returned: records.length,
		truncated: records.length < total
	});
	const wrap = () => wrapBrowserExternalJson({
		kind,
		payload: {
			...details(),
			[kind]: records
		},
		includeWarning: false
	});
	let wrapped = wrap();
	if (wrapped.truncated && records.length > 0) {
		const initialRecords = records;
		let lower = 1;
		let upper = initialRecords.length;
		while (lower < upper) {
			const middle = Math.floor((lower + upper) / 2);
			records = initialRecords.slice(middle);
			wrapped = wrap();
			if (wrapped.truncated) lower = middle + 1;
			else upper = middle;
		}
		if (records.length !== initialRecords.length - lower) {
			records = initialRecords.slice(lower);
			wrapped = wrap();
		}
	}
	return {
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}],
		details: {
			...wrapped.safeDetails,
			...details(),
			truncated: records.length < total || wrapped.truncated
		}
	};
}
function isAriaRefsUnsupportedError(err) {
	const msg = String(err).toLowerCase();
	return msg.includes("refs=aria") && msg.includes("not support");
}
function withRoleRefsFallback(snapshotQuery) {
	return {
		...snapshotQuery,
		refs: "role"
	};
}
/** Execute and format browser snapshots for agent consumption. */
async function executeSnapshotAction(params) {
	const { input, baseUrl, profile, proxyRequest } = params;
	const snapshotDefaults = getRuntimeConfig().browser?.snapshotDefaults;
	const format = input.snapshotFormat === "ai" ? "ai" : input.snapshotFormat === "aria" ? "aria" : void 0;
	const formatExplicit = format !== void 0;
	const mode = input.mode === "efficient" ? "efficient" : !formatExplicit && format !== "aria" && snapshotDefaults?.mode === "efficient" ? "efficient" : void 0;
	const labels = typeof input.labels === "boolean" ? input.labels : void 0;
	const urls = typeof input.urls === "boolean" ? input.urls : void 0;
	const refs = input.refs === "aria" || input.refs === "role" ? input.refs : void 0;
	const hasMaxChars = Object.hasOwn(input, "maxChars");
	const targetId = normalizeOptionalString(input.targetId);
	const limit = readPositiveIntegerParam(input, "limit", { message: "limit must be a positive integer." });
	const maxCharsRaw = readNonNegativeIntegerParam(input, "maxChars", { message: "maxChars must be a non-negative integer." });
	const maxChars = maxCharsRaw !== void 0 && maxCharsRaw > 0 ? maxCharsRaw : void 0;
	const interactive = typeof input.interactive === "boolean" ? input.interactive : void 0;
	const compact = typeof input.compact === "boolean" ? input.compact : void 0;
	const depth = readNonNegativeIntegerParam(input, "depth", { message: "depth must be a non-negative integer." });
	const selector = normalizeOptionalString(input.selector);
	const frame = normalizeOptionalString(input.frame);
	const resolvedMaxChars = format === "ai" ? hasMaxChars ? maxChars : mode === "efficient" ? void 0 : DEFAULT_AI_SNAPSHOT_MAX_CHARS : hasMaxChars ? maxChars : void 0;
	const snapshotTimeoutMs = readPositiveIntegerParam(input, "timeoutMs", { message: "timeoutMs must be a positive integer." }) ?? 2e4;
	const snapshotQuery = {
		...format ? { format } : {},
		targetId,
		limit,
		...typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {},
		refs,
		interactive,
		compact,
		depth,
		selector,
		frame,
		labels,
		urls,
		mode,
		timeoutMs: snapshotTimeoutMs
	};
	let refsFallback;
	const readSnapshot = async (query) => await browserSnapshot(proxyRequest ?? baseUrl, {
		...query,
		profile,
		signal: params.signal
	});
	let snapshot;
	try {
		snapshot = await readSnapshot(snapshotQuery);
	} catch (err) {
		if (refs !== "aria" || !isAriaRefsUnsupportedError(err)) throw err;
		refsFallback = "role";
		snapshot = await readSnapshot(withRoleRefsFallback(snapshotQuery));
	}
	params.onTabActivity?.(readStringValue(snapshot.targetId) ?? targetId);
	const query = normalizeOptionalString(input.query);
	if (query && !snapshot.blockedByDialog) {
		const tokens = query.toLowerCase().split(/\s+/);
		const matches = (snapshot.format === "ai" ? snapshot.snapshot : snapshot.nodes.map((node) => `- ${node.role} ${JSON.stringify(node.name)} [ref=${node.ref}]${node.value ? ` value=${JSON.stringify(node.value)}` : ""}${node.description ? ` description=${JSON.stringify(node.description)}` : ""}`).join("\n")).split("\n").filter((line) => {
			const lower = line.toLowerCase();
			return tokens.every((token) => lower.includes(token));
		});
		const matchedText = matches.join("\n");
		const matchCount = matches.length;
		const summary = matchCount ? `${matchCount} matching line(s) in the returned snapshot${snapshot.truncated ? " (source truncated)" : ""}.` : "No matching lines in the returned snapshot. Refine the query or take a broader snapshot.";
		const wrapped = wrapBrowserExternalText({
			value: matchedText,
			marker: BROWSER_EXTERNAL_JSON_TRUNCATION_MARKERS.snapshot,
			maxChars: maxChars ?? 4e4,
			includeWarning: true,
			prefix: summary
		});
		const snapshotRefs = snapshot.format === "ai" ? snapshot.refs ?? {} : Object.fromEntries(snapshot.nodes.map((node) => [node.ref, {
			role: node.role,
			name: node.name
		}]));
		const filtered = finalizeRoleSnapshot({
			snapshot: wrapped.boundedText,
			refs: snapshotRefs
		});
		const newElements = filtered.snapshot.split("\n").filter((line) => line.endsWith(" [new]") && findRoleSnapshotLineRef(line)).length;
		const result = {
			content: [{
				type: "text",
				text: wrapped.text
			}],
			details: {
				ok: snapshot.ok,
				format: snapshot.format,
				targetId: snapshot.targetId,
				url: snapshot.url,
				matchCount,
				stats: filtered.stats,
				refs: filtered.stats.refs,
				...snapshot.format === "ai" && snapshot.newElements !== void 0 ? { newElements } : {},
				truncated: snapshot.truncated || wrapped.truncated || void 0,
				...snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {},
				...snapshot.format === "ai" ? {
					labels: snapshot.labels,
					labelsCount: snapshot.labelsCount,
					labelsSkipped: snapshot.labelsSkipped,
					annotations: snapshot.annotations,
					imagePath: snapshot.imagePath,
					imageType: snapshot.imageType,
					refsFallback
				} : {},
				externalContent: {
					untrusted: true,
					source: "browser",
					kind: "snapshot",
					format: snapshot.format,
					wrapped: true
				}
			}
		};
		if (labels && snapshot.format === "ai" && snapshot.imagePath) return await imageResultFromFile({
			label: "browser:snapshot",
			path: snapshot.imagePath,
			extraText: result.content.filter((item) => item.type === "text").map((item) => item.text).join("\n"),
			details: {
				...result.details,
				media: { outbound: false }
			},
			imageSanitization: resolveRuntimeImageSanitization()
		});
		return result;
	}
	if (snapshot.format === "ai") {
		const dialogStateFields = {
			...snapshot.blockedByDialog ? { blockedByDialog: true } : {},
			...snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {}
		};
		if (snapshot.blockedByDialog) {
			const wrapped = wrapBrowserExternalJson({
				kind: "snapshot",
				payload: {
					format: snapshot.format,
					targetId: snapshot.targetId,
					url: snapshot.url,
					...dialogStateFields
				}
			});
			return {
				content: [{
					type: "text",
					text: wrapped.wrappedText
				}],
				details: {
					...wrapped.safeDetails,
					format: snapshot.format,
					targetId: snapshot.targetId,
					url: snapshot.url,
					...dialogStateFields
				}
			};
		}
		const boundedSnapshot = wrapBrowserExternalText({
			value: snapshot.snapshot ?? "",
			marker: BROWSER_EXTERNAL_JSON_TRUNCATION_MARKERS.snapshot,
			includeWarning: true
		});
		const safeDetails = {
			ok: true,
			format: snapshot.format,
			targetId: snapshot.targetId,
			url: snapshot.url,
			truncated: snapshot.truncated || boundedSnapshot.truncated ? true : void 0,
			newElements: snapshot.newElements,
			stats: snapshot.stats,
			refs: snapshot.refs ? Object.keys(snapshot.refs).length : void 0,
			labels: snapshot.labels,
			labelsCount: snapshot.labelsCount,
			labelsSkipped: snapshot.labelsSkipped,
			annotations: snapshot.annotations,
			imagePath: snapshot.imagePath,
			imageType: snapshot.imageType,
			refsFallback,
			...dialogStateFields,
			externalContent: {
				untrusted: true,
				source: "browser",
				kind: "snapshot",
				format: "ai",
				wrapped: true
			}
		};
		if (labels && snapshot.imagePath) return await imageResultFromFile({
			label: "browser:snapshot",
			path: snapshot.imagePath,
			extraText: boundedSnapshot.text,
			details: {
				...safeDetails,
				media: { outbound: false }
			},
			imageSanitization: resolveRuntimeImageSanitization()
		});
		return {
			content: [{
				type: "text",
				text: boundedSnapshot.text
			}],
			details: safeDetails
		};
	}
	{
		const wrapped = wrapBrowserExternalJson({
			kind: "snapshot",
			payload: snapshot
		});
		return {
			content: [{
				type: "text",
				text: wrapped.wrappedText
			}],
			details: {
				...wrapped.safeDetails,
				format: "aria",
				targetId: snapshot.targetId,
				url: snapshot.url,
				nodeCount: snapshot.nodes.length,
				...snapshot.blockedByDialog ? { blockedByDialog: true } : {},
				...snapshot.browserState !== void 0 ? { browserState: snapshot.browserState } : {},
				externalContent: {
					untrusted: true,
					source: "browser",
					kind: "snapshot",
					format: "aria",
					wrapped: true
				}
			}
		};
	}
}
function withPageStateUnavailableHint(result, reason) {
	return {
		...result,
		content: [...result.content, {
			type: "text",
			text: `[page snapshot unavailable: ${reason}. Use action=snapshot to read the page.]`
		}]
	};
}
/**
* Attach fresh page state to the result of an action that changed the page
* document (navigate, act that navigated). The model can act on the new page
* without a follow-up snapshot call. The inline state uses the efficient
* interactive tier so the unsolicited payload stays bounded on every profile
* (mode=efficient forces the capped ai format even where the profile default
* would be an uncapped aria tree); a full snapshot stays one explicit call away.
*/
async function appendNavigatedPageState(params) {
	let snapshot;
	try {
		snapshot = await executeSnapshotAction({
			input: {
				targetId: params.targetId,
				mode: "efficient"
			},
			baseUrl: params.baseUrl,
			profile: params.profile,
			proxyRequest: params.proxyRequest,
			signal: params.signal
		});
	} catch (err) {
		params.signal?.throwIfAborted();
		if (err instanceof Error && err.name === "AbortError") throw err;
		return withPageStateUnavailableHint(params.result, wrapExternalContent(neutralizeMediaDirectives(formatErrorMessage(err)), {
			source: "browser",
			includeWarning: false
		}));
	}
	const baseDetails = params.result.details && typeof params.result.details === "object" ? params.result.details : {};
	return {
		content: [...params.result.content, ...snapshot.content],
		details: {
			...baseDetails,
			pageState: snapshot.details
		}
	};
}
//#endregion
//#region extensions/browser/src/browser-tool.actions.ts
function normalizePositiveTimeoutMs(value) {
	return readPositiveIntegerParam({ value }, "value", { message: "timeoutMs must be a positive integer." });
}
function normalizeNonNegativeDurationMs(value) {
	return readNonNegativeIntegerParam({ value }, "value", { message: "timeMs must be a non-negative integer." });
}
function withLocalActTimeout(request, usesChromeMcp) {
	if (normalizePositiveTimeoutMs("timeoutMs" in request ? request.timeoutMs : void 0) !== void 0 || usesChromeMcp && !EXISTING_SESSION_TIMEOUT_OVERRIDE_KINDS.has(request.kind)) return request;
	switch (request.kind) {
		case "click":
		case "type":
		case "hover":
		case "scrollIntoView":
		case "drag":
		case "select":
		case "fill":
		case "evaluate":
		case "wait": return {
			...request,
			timeoutMs: DEFAULT_BROWSER_ACTION_TIMEOUT_MS
		};
		default: return request;
	}
}
function formatAgentTab(tab) {
	if (!tab || typeof tab !== "object") return { value: tab };
	const source = tab;
	const targetId = readStringValue(source.targetId);
	const tabId = readStringValue(source.tabId);
	const webExtensionTabId = typeof source.webExtensionTabId === "number" && Number.isSafeInteger(source.webExtensionTabId) && source.webExtensionTabId >= 0 ? source.webExtensionTabId : void 0;
	const label = readStringValue(source.label);
	const suggestedTargetId = readStringValue(source.suggestedTargetId) ?? label ?? tabId ?? targetId;
	return {
		...suggestedTargetId ? { suggestedTargetId } : {},
		...tabId ? { tabId } : {},
		...webExtensionTabId !== void 0 ? { webExtensionTabId } : {},
		...label ? { label } : {},
		title: source.title,
		url: source.url,
		...source.urlUnavailableReason === "navigation_blocked" || source.urlUnavailableReason === "navigation_check_failed" ? { urlUnavailableReason: source.urlUnavailableReason } : {},
		type: source.type,
		...targetId ? { targetId } : {},
		...source.wsUrl ? { wsUrl: source.wsUrl } : {}
	};
}
function formatTabsToolResult(result) {
	const formattedTabs = result.tabs.map((tab) => formatAgentTab(tab));
	const wrapped = wrapBrowserExternalJson({
		kind: "tabs",
		payload: {
			running: result.running,
			tabs: formattedTabs
		},
		includeWarning: false
	});
	return {
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}],
		details: {
			...wrapped.safeDetails,
			running: result.running,
			tabCount: formattedTabs.length,
			tabs: formattedTabs
		}
	};
}
/** Protect page-controlled model text while preserving the shipped structured result contract. */
function formatBrowserExternalToolResult(params) {
	return {
		content: [{
			type: "text",
			text: wrapBrowserExternalJson({
				kind: params.kind,
				payload: params.payload,
				includeWarning: false
			}).wrappedText
		}],
		details: params.payload
	};
}
function formatConsoleToolResult(result) {
	const wrapped = wrapBrowserExternalJson({
		kind: "console",
		payload: result,
		includeWarning: false
	});
	return {
		content: [{
			type: "text",
			text: wrapped.wrappedText
		}],
		details: {
			...wrapped.safeDetails,
			targetId: readStringValue(result.targetId),
			url: readStringValue(result.url),
			messageCount: Array.isArray(result.messages) ? result.messages.length : void 0
		}
	};
}
function isChromeStaleTargetError(usesChromeMcp, err) {
	const status = err && typeof err === "object" && "status" in err ? err.status : null;
	const msg = String(err);
	const isTabNotFound = (status === 404 || msg.includes("404:")) && msg.includes("tab not found");
	return usesChromeMcp && isTabNotFound;
}
function replaceStaleTargetIdInActRequest(request, targetId) {
	if (!normalizeOptionalString(request.targetId) || !targetId) return null;
	return {
		...request,
		targetId
	};
}
function canRetryChromeActAfterSoleTargetRefresh(request) {
	if (request.kind !== "wait" || normalizeNonNegativeDurationMs(request.timeMs) === void 0) return false;
	return [
		request.fn,
		request.text,
		request.textGone,
		request.selector,
		request.url,
		request.loadState
	].every((value) => !normalizeOptionalString(value));
}
async function executeTabsAction(params) {
	const { baseUrl, profile, timeoutMs, proxyRequest } = params;
	const result = await browserTabs(proxyRequest ?? baseUrl, {
		profile,
		timeoutMs,
		signal: params.signal
	});
	const tabs = result.running ? result.tabs.filter((tab) => !params.targetId || readStringValue(tab.targetId) === params.targetId) : [];
	return formatTabsToolResult({
		running: result.running,
		tabs
	});
}
/** Validate the /act wire payload's abort summary once for note and page-state decisions. */
function readBrowserBatchAbort(result) {
	if (!result || typeof result !== "object") return null;
	const aborted = result.aborted;
	if (!aborted || typeof aborted !== "object") return null;
	const { reason, afterAction, url, skipped } = aborted;
	if (reason !== "navigation" && reason !== "closed" || typeof afterAction !== "number" || typeof url !== "string" || typeof skipped !== "number") return null;
	return {
		reason,
		afterAction,
		url,
		skipped
	};
}
/** True when an /act response reports a cross-document navigation. */
function actObservedNavigation(result, aborted) {
	if (aborted?.reason === "navigation") return true;
	const results = result?.results;
	return Array.isArray(results) && results.some((entry) => entry?.navigated === true);
}
/** Execute browser console retrieval and wrap page-controlled messages. */
async function executeConsoleAction(params) {
	const { input, baseUrl, profile, proxyRequest } = params;
	const query = {
		level: normalizeOptionalString(input.level),
		targetId: normalizeOptionalString(input.targetId)
	};
	return formatConsoleToolResult(await browserConsoleMessages(proxyRequest ?? baseUrl, {
		...query,
		profile,
		signal: params.signal
	}));
}
/** Read recent network requests, keeping counts aligned with the bounded payload. */
async function executeRequestsAction(params) {
	const { input, baseUrl, profile, proxyRequest, signal } = params;
	const targetId = normalizeOptionalString(input.targetId);
	const filter = normalizeOptionalString(input.filter);
	const clear = typeof input.clear === "boolean" ? input.clear : void 0;
	const limit = readPositiveIntegerParam(input, "limit", { message: "limit must be a positive integer." }) ?? 50;
	const result = await browserRequests(proxyRequest ?? baseUrl, {
		targetId,
		filter,
		clear,
		profile,
		signal
	});
	return formatBrowserDebugLogResult("requests", result, result.requests, limit);
}
/** Read recent page errors, keeping counts aligned with the bounded payload. */
async function executeErrorsAction(params) {
	const { input, baseUrl, profile, proxyRequest, signal } = params;
	const targetId = normalizeOptionalString(input.targetId);
	const clear = typeof input.clear === "boolean" ? input.clear : void 0;
	const limit = readPositiveIntegerParam(input, "limit", { message: "limit must be a positive integer." }) ?? 50;
	const result = await browserErrors(proxyRequest ?? baseUrl, {
		targetId,
		clear,
		profile,
		signal
	});
	return formatBrowserDebugLogResult("errors", result, result.errors, limit);
}
/** Extract visible page prose with the same trust boundary as snapshots. */
async function executeTextAction(params) {
	const { input, baseUrl, profile, proxyRequest, signal } = params;
	const targetId = normalizeOptionalString(input.targetId);
	const selector = normalizeOptionalString(input.selector);
	const maxChars = Math.min(readPositiveIntegerParam(input, "maxChars", { message: "maxChars must be a positive integer." }) ?? 4e4, DEFAULT_AI_SNAPSHOT_MAX_CHARS);
	const result = await browserPageText(proxyRequest ?? baseUrl, {
		targetId,
		selector,
		maxChars,
		profile,
		signal
	});
	const wrapped = wrapBrowserExternalText({
		value: result.text,
		marker: "\n[truncated — retry with a narrower selector]",
		includeWarning: true,
		maxChars,
		prefix: result.truncated ? "Page text was truncated. Retry with a narrower selector." : void 0
	});
	return {
		content: [{
			type: "text",
			text: wrapped.text
		}],
		details: {
			ok: result.ok,
			targetId: result.targetId,
			url: result.url,
			truncated: result.truncated || wrapped.truncated,
			externalContent: {
				untrusted: true,
				source: "browser",
				kind: "text",
				wrapped: true
			}
		}
	};
}
/** Apply settings in order and pin later changes to the first resolved tab. */
async function executeEmulateAction(params) {
	const { input, baseUrl, profile, proxyRequest, signal } = params;
	const requested = [
		[
			"device",
			"device",
			"name"
		],
		[
			"colorScheme",
			"media",
			"colorScheme"
		],
		[
			"timezoneId",
			"timezone",
			"timezoneId"
		],
		[
			"locale",
			"locale",
			"locale"
		]
	].flatMap(([field, setting, key]) => {
		const value = normalizeOptionalString(input[field]);
		return value ? [{
			field,
			setting,
			key,
			value
		}] : [];
	});
	if (requested.length === 0) throw new Error("emulate requires at least one of device, colorScheme, timezoneId, or locale.");
	const colorScheme = requested.find(({ field }) => field === "colorScheme")?.value;
	if (colorScheme && ![
		"dark",
		"light",
		"no-preference",
		"none"
	].includes(colorScheme)) throw new Error("colorScheme must be dark|light|no-preference|none.");
	let targetId = normalizeOptionalString(input.targetId);
	const applied = [];
	for (const { field, setting, key, value } of requested) {
		targetId = (await browserEmulateSetting(proxyRequest ?? baseUrl, {
			setting,
			body: {
				targetId,
				[key]: value
			},
			profile,
			signal
		})).targetId ?? targetId;
		applied.push(field);
	}
	return jsonResult({
		ok: true,
		targetId,
		applied
	});
}
/** Execute explicit Browser download operations through the local or node-host path. */
async function executeDownloadAction(params) {
	const { action, input, baseUrl, profile, proxyRequest } = params;
	const targetId = normalizeOptionalString(input.targetId);
	const timeoutMs = normalizePositiveTimeoutMs(input.timeoutMs);
	const request = action === "download" ? {
		kind: "download",
		body: {
			ref: readToolStringParam(input, "ref", { required: true }),
			path: readToolStringParam(input, "path", { required: true }),
			targetId,
			timeoutMs
		}
	} : {
		kind: "waitfordownload",
		body: {
			path: readToolStringParam(input, "path"),
			targetId,
			timeoutMs
		}
	};
	const result = request.kind === "download" ? await browserDownload(proxyRequest ?? baseUrl, {
		...request.body,
		profile,
		signal: params.signal
	}) : await browserWaitForDownload(proxyRequest ?? baseUrl, {
		...request.body,
		profile,
		signal: params.signal
	});
	params.onTabActivity?.(readStringValue(result.targetId) ?? targetId);
	return formatBrowserExternalToolResult({
		kind: "download",
		payload: result
	});
}
/** Execute browser actions with route-owned timeout semantics and stale-tab recovery. */
async function executeActAction(params) {
	const { request, baseUrl, profile, proxyRequest } = params;
	if ("timeoutMs" in request && request.timeoutMs !== void 0) normalizePositiveTimeoutMs(request.timeoutMs);
	const effectiveRequest = proxyRequest ? request : withLocalActTimeout(request, params.usesChromeMcp);
	const finishActResult = async (result, resolvedTargetId) => {
		const aborted = readBrowserBatchAbort(result);
		(effectiveRequest.kind === "close" || aborted?.reason === "closed" ? params.onTabClose : params.onTabActivity)?.(resolvedTargetId);
		const formatted = formatActToolResult(result, aborted);
		if (!actObservedNavigation(result, aborted)) return formatted;
		return await appendNavigatedPageState({
			result: formatted,
			targetId: resolvedTargetId,
			baseUrl,
			profile,
			proxyRequest,
			signal: params.signal
		});
	};
	const dispatchAndFinishAct = async (actionRequest) => {
		const result = await browserAct(proxyRequest ?? baseUrl, actionRequest, {
			profile,
			signal: params.signal
		});
		return await finishActResult(result, readStringValue(result.targetId) ?? readStringValue(actionRequest.targetId));
	};
	try {
		return await dispatchAndFinishAct(effectiveRequest);
	} catch (err) {
		const proxyRoute = proxyRequest?.route();
		const usesChromeMcp = proxyRequest ? proxyRoute?.status === "resolved" && proxyRoute.driver === "existing-session" : params.usesChromeMcp;
		const recoveryProfile = proxyRoute?.status === "resolved" ? proxyRoute.profile : profile ?? "default";
		if (isChromeStaleTargetError(usesChromeMcp, err)) {
			let tabRefreshError;
			const availability = await browserTabs(proxyRequest ?? baseUrl, {
				profile,
				signal: params.signal
			}).catch((refreshError) => {
				params.signal?.throwIfAborted();
				tabRefreshError = refreshError;
				return {
					running: false,
					tabs: []
				};
			});
			const tabs = availability.tabs;
			const freshTargetId = tabs.length === 1 ? readStringValue(tabs[0]?.targetId) : void 0;
			const retryRequest = freshTargetId ? replaceStaleTargetIdInActRequest(effectiveRequest, freshTargetId) : null;
			if (retryRequest && canRetryChromeActAfterSoleTargetRefresh(effectiveRequest) && tabs.length === 1) return await dispatchAndFinishAct(retryRequest);
			if (tabRefreshError) throw new Error(`Chrome tab not found for profile="${recoveryProfile}", and refreshing tabs failed: ${formatErrorMessage(tabRefreshError)}. Run action=tabs profile="${recoveryProfile}" and retry with a returned targetId.`, { cause: err });
			if (!availability.running) throw new Error(`Browser tabs are unavailable for profile="${recoveryProfile}". Reconnect or start that browser profile, then run action=tabs and retry.`, { cause: err });
			if (!tabs.length) throw new Error(`No browser tabs found for profile="${recoveryProfile}". Make sure the configured Chromium-based browser (v144+) is running and has open tabs, then retry.`, { cause: err });
			throw new Error(`Chrome tab not found (stale targetId?). Run action=tabs profile="${recoveryProfile}" and use one of the returned targetIds.`, { cause: err });
		}
		throw err;
	}
}
function formatActToolResult(result, aborted) {
	const formatted = formatBrowserExternalToolResult({
		kind: "act",
		payload: result
	});
	if (!aborted) return formatted;
	const note = aborted.reason === "navigation" ? `Batch aborted after action ${aborted.afterAction} because the page navigated; ${aborted.skipped} remaining action(s) skipped. Earlier refs are stale.` : `Batch aborted after action ${aborted.afterAction} because the page or browser context closed; ${aborted.skipped} remaining action(s) skipped. Take a new snapshot before continuing.`;
	return {
		...formatted,
		content: [...formatted.content, {
			type: "text",
			text: note
		}]
	};
}
//#endregion
//#region extensions/browser/src/browser-tool.screenshot.ts
function formatScreenshotShareHint(filePath) {
	return `[Screenshot saved to ${JSON.stringify(filePath)}. A sanitized outbound copy is ready at this path for explicit sharing.]`;
}
const SCREENSHOT_SHARE_UNAVAILABLE = "[Screenshot sharing is unavailable because an outbound copy could not be prepared.]";
async function executeScreenshotAction({ input: params, baseUrl, profile, requestedTimeoutMs, proxyRequest, signal, onTabActivity, opts }) {
	const targetId = readToolStringParam(params, "targetId");
	const fullPage = Boolean(params.fullPage);
	const ref = readToolStringParam(params, "ref");
	const element = readToolStringParam(params, "element");
	const labels = typeof params.labels === "boolean" ? params.labels : void 0;
	const type = params.type === "jpeg" ? "jpeg" : "png";
	const result = await browserScreenshotAction(proxyRequest ?? baseUrl, {
		targetId,
		fullPage,
		ref,
		element,
		type,
		labels,
		timeoutMs: requestedTimeoutMs ?? 2e4,
		profile,
		signal
	});
	onTabActivity(readStringValue(result.targetId) ?? targetId);
	if (opts?.screenshotResultMode === "path") {
		const artifactPath = opts.persistScreenshot ? await opts.persistScreenshot({
			sourcePath: result.path,
			type,
			targetId: readStringValue(result.targetId) ?? targetId
		}) : result.path;
		if (artifactPath.length > 4096) throw new Error("Browser screenshot artifact path exceeds 4096 characters");
		const resultTargetId = readStringValue(result.targetId) ?? targetId;
		const resultUrl = readStringValue(result.url);
		return jsonResult({
			ok: result.ok,
			path: artifactPath,
			...resultTargetId ? { targetId: truncateUtf16Safe(resultTargetId, 256) } : {},
			...resultUrl ? { url: truncateUtf16Safe(resultUrl, 2048) } : {},
			...Array.isArray(result.annotations) ? { annotationCount: result.annotations.length } : {},
			media: { outbound: false }
		});
	}
	const screenshotPath = result.path;
	const screenshotCfg = getRuntimeConfig();
	const imageSanitization = resolveRuntimeImageSanitization();
	let shareHint = SCREENSHOT_SHARE_UNAVAILABLE;
	try {
		shareHint = formatScreenshotShareHint(await stageBrowserScreenshotForSharing(screenshotPath, imageSanitization?.maxDimensionPx));
	} catch {}
	const screenshotDetails = {
		...result,
		media: { outbound: false }
	};
	let extraText = shareHint;
	try {
		const described = await describeBrowserScreenshot({
			cfg: screenshotCfg,
			filePath: screenshotPath,
			agentDir: opts?.agentDir,
			agentId: opts?.agentId,
			workspaceDir: opts?.workspaceDir,
			activeModel: opts?.activeModel,
			mediaScope: opts?.mediaScope,
			imageSanitization
		}, {
			describeImageFile,
			normalizeBrowserScreenshot,
			saveMediaBuffer
		});
		if (described) return {
			content: [{
				type: "text",
				text: `[analyzed by ${described.provider && described.model ? `${described.provider}/${described.model}` : "media image understanding"}]\n${wrapExternalContent(neutralizeMediaDirectives(described.text.trim()), {
					source: "browser",
					includeWarning: true
				})}\n${shareHint}`
			}],
			details: {
				...result,
				vision: {
					provider: described.provider,
					model: described.model,
					decision: described.decision
				}
			}
		};
	} catch (err) {
		const rawReason = err instanceof Error ? err.message : String(err);
		extraText = `[browser screenshot vision failed: ${wrapExternalContent(neutralizeMediaDirectives(rawReason), {
			source: "browser",
			includeWarning: false
		})}]\n${shareHint}`;
	}
	return await imageResultFromFile({
		label: "browser:screenshot",
		path: screenshotPath,
		extraText,
		details: screenshotDetails,
		imageSanitization
	});
}
//#endregion
//#region extensions/browser/src/browser-tool-dispatch.ts
function readOptionalTargetAndTimeout(params) {
	return {
		targetId: normalizeOptionalString(params.targetId),
		timeoutMs: readPositiveIntegerParam(params, "timeoutMs", { message: "timeoutMs must be a positive integer." })
	};
}
function readTargetUrlParam(params) {
	const targetUrl = readToolStringParam(params, "targetUrl") ?? readToolStringParam(params, "url", {
		required: true,
		label: "targetUrl"
	});
	parseBrowserNavigationUrl(targetUrl);
	return targetUrl;
}
/** Run tab actions against the prepared host, node, or sandbox route. */
async function executeBrowserTabAction(context) {
	const { action, params, baseUrl, profile, proxyRequest, nodeRoute, sessionTabs, capabilities, isUserBrowserProfile, toolTimeoutMs, requestedTimeoutMs, signal, opts } = context;
	const touchTab = (targetId) => {
		sessionTabs.touch(targetId);
		context.onTabActivity(targetId);
	};
	const trackedTabResult = (result, targetId) => {
		touchTab(readStringValue(asNullableRecord(result)?.targetId) ?? targetId);
		return jsonResult(result);
	};
	switch (action) {
		case "tabs": return await executeTabsAction({
			baseUrl,
			profile,
			timeoutMs: toolTimeoutMs,
			proxyRequest,
			targetId: context.boundTargetId,
			signal
		});
		case "open": {
			const targetUrl = readTargetUrlParam(params);
			const label = normalizeOptionalString(params.label);
			const opened = await browserOpenTab(proxyRequest ?? baseUrl, targetUrl, {
				profile,
				label,
				timeoutMs: toolTimeoutMs,
				signal
			});
			const closeOpenedTab = async (targetId, openedProfile) => {
				if (nodeRoute && !proxyRequest?.isHostFallbackActive()) {
					await nodeRoute.closeTarget({
						targetId,
						profile: openedProfile
					});
					return;
				}
				await browserCloseTab(baseUrl, targetId, {
					profile: openedProfile,
					timeoutMs: toolTimeoutMs
				});
			};
			await sessionTabs.trackOpened(opened, closeOpenedTab);
			context.onTabActivity(readStringValue(asNullableRecord(opened)?.targetId), readStringValue(asNullableRecord(opened)?.resolvedProfile));
			return formatBrowserExternalToolResult({
				kind: "tabs",
				payload: stripBrowserOpenInternalMetadata(opened)
			});
		}
		case "focus": {
			const targetId = readToolStringParam(params, "targetId", { required: true });
			return trackedTabResult(await browserFocusTab(proxyRequest ?? baseUrl, targetId, {
				profile,
				timeoutMs: toolTimeoutMs,
				signal
			}), targetId);
		}
		case "close": {
			const targetId = readToolStringParam(params, "targetId");
			const result = targetId ? await browserCloseTab(proxyRequest ?? baseUrl, targetId, {
				profile,
				timeoutMs: toolTimeoutMs,
				signal
			}) : await browserAct(proxyRequest ?? baseUrl, { kind: "close" }, {
				profile,
				timeoutMs: toolTimeoutMs,
				signal
			});
			sessionTabs.untrack(readStringValue(asNullableRecord(result)?.targetId) ?? targetId);
			return jsonResult(result);
		}
		case "snapshot": return await executeSnapshotAction({
			input: params,
			baseUrl,
			profile,
			proxyRequest,
			signal,
			onTabActivity: touchTab
		});
		case "screenshot": return await executeScreenshotAction({
			input: params,
			baseUrl,
			profile,
			requestedTimeoutMs,
			proxyRequest,
			signal,
			onTabActivity: touchTab,
			opts
		});
		case "navigate": {
			const targetUrl = readTargetUrlParam(params);
			const targetId = readToolStringParam(params, "targetId");
			const result = await browserNavigate(proxyRequest ?? baseUrl, {
				url: targetUrl,
				targetId,
				timeoutMs: requestedTimeoutMs,
				profile,
				signal
			});
			const navigatedTargetId = readStringValue(asNullableRecord(result)?.targetId) ?? targetId;
			touchTab(navigatedTargetId);
			const formatted = formatBrowserExternalToolResult({
				kind: asNullableRecord(result)?.download ? "download" : "act",
				payload: result
			});
			if (asNullableRecord(result)?.download) return formatted;
			return await appendNavigatedPageState({
				result: formatted,
				targetId: navigatedTargetId,
				baseUrl,
				profile,
				proxyRequest,
				signal
			});
		}
		case "console": {
			const result = await executeConsoleAction({
				input: params,
				baseUrl,
				profile,
				proxyRequest,
				signal
			});
			const targetId = readToolStringParam(params, "targetId");
			touchTab(readStringValue(asNullableRecord(result.details)?.targetId) ?? targetId);
			return result;
		}
		case "requests":
		case "errors":
		case "text":
		case "emulate": {
			const execute = {
				requests: executeRequestsAction,
				errors: executeErrorsAction,
				text: executeTextAction,
				emulate: executeEmulateAction
			}[action];
			const result = await execute({
				input: params,
				baseUrl,
				profile,
				proxyRequest,
				signal
			});
			touchTab(readStringValue(asNullableRecord(result.details)?.targetId) ?? readStringValue(params.targetId));
			return result;
		}
		case "pdf": {
			const targetId = normalizeOptionalString(params.targetId);
			const result = await browserPdfSave(proxyRequest ?? baseUrl, {
				targetId,
				profile,
				signal
			});
			touchTab(readStringValue(result.targetId) ?? targetId);
			return {
				content: [{
					type: "text",
					text: `FILE:${result.path}`
				}],
				details: result
			};
		}
		case "download":
		case "waitfordownload": return await executeDownloadAction({
			action,
			input: params,
			baseUrl,
			profile,
			proxyRequest,
			signal,
			onTabActivity: touchTab
		});
		case "upload": {
			const paths = Array.isArray(params.paths) ? params.paths.map((p) => String(p)) : [];
			if (paths.length === 0) throw new Error("paths required");
			const resolvedResult = await resolveExistingUploadPaths({ requestedPaths: paths });
			if (!resolvedResult.ok) throw new Error(resolvedResult.error);
			const normalizedPaths = resolvedResult.paths;
			const ref = readToolStringParam(params, "ref");
			const inputRef = readToolStringParam(params, "inputRef");
			const element = readToolStringParam(params, "element");
			const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
			return trackedTabResult(await browserArmFileChooser(proxyRequest ?? baseUrl, {
				paths: normalizedPaths,
				ref,
				inputRef,
				element,
				targetId,
				timeoutMs,
				profile,
				signal
			}), targetId);
		}
		case "dialog": {
			const accept = Boolean(params.accept);
			const promptText = readStringValue(params.promptText);
			const dialogId = readStringValue(params.dialogId);
			const { targetId, timeoutMs } = readOptionalTargetAndTimeout(params);
			return trackedTabResult(await browserArmDialog(proxyRequest ?? baseUrl, {
				accept,
				promptText,
				dialogId,
				targetId,
				timeoutMs,
				profile,
				signal
			}), targetId);
		}
		case "act": {
			const request = context.actRequest;
			if (!request) throw new Error("request required");
			if (!capabilities.actKinds.some((kind) => kind === request.kind)) throw new Error(`browser act kind ${JSON.stringify(request.kind)} is unavailable for this run`);
			return await executeActAction({
				request,
				baseUrl,
				profile,
				usesChromeMcp: isUserBrowserProfile,
				proxyRequest,
				signal,
				onTabActivity: touchTab,
				onTabClose: sessionTabs.untrack
			});
		}
		default: throw new Error(`Unknown action: ${action}`);
	}
}
//#endregion
//#region extensions/browser/src/browser-node-routing.ts
/** Select the same authorized browser-capable node on every request surface. */
async function resolveBrowserNodeTarget(params) {
	const policy = params.config.gateway?.nodes?.browser;
	const mode = policy?.mode ?? "auto";
	const explicit = params.explicitTarget || Boolean(params.requestedNode?.trim());
	if (mode === "off") {
		if (explicit) throw new Error("Node browser proxy is disabled (gateway.nodes.browser.mode=off).");
		return null;
	}
	const requested = params.requestedNode?.trim() || policy?.node?.trim();
	if (mode === "manual" && !explicit && !requested) return null;
	if (!explicit && !requested) {
		const { isBrowserHostAvailable } = await import("./browser-host-availability-pcuDUNc4.mjs");
		if (await isBrowserHostAvailable(params.config, params.profile)) return null;
	}
	const browserNodes = (await params.nodes()).filter((node) => {
		if (params.requireConnected && !node.connected) return false;
		return node.caps?.includes("browser") || node.commands?.includes("browser.proxy");
	});
	if (browserNodes.length === 0) {
		if (explicit || requested) throw new Error("No connected browser-capable nodes.");
		return null;
	}
	if (requested) {
		const nodeId = resolveNodeIdFromList(browserNodes, requested, false, { allowCompactDisplayName: true });
		return browserNodes.find((node) => node.nodeId === nodeId) ?? null;
	}
	if (browserNodes.length === 1) return browserNodes[0] ?? null;
	if (explicit) throw new Error(`Multiple browser-capable nodes connected (${browserNodes.length}). Set gateway.nodes.browser.node or pass node=<id>.`);
	return null;
}
//#endregion
//#region extensions/browser/src/browser-tool.routing.ts
/** Browser tool host, sandbox, and node target resolution. */
async function resolveBrowserToolNodeTarget(params) {
	if (params.allowHostControl === false) {
		if (params.target === "node" || params.requestedNode) throw new Error("Node browser control is disabled by sandbox policy.");
		return null;
	}
	const cfg = getRuntimeConfig();
	const policy = cfg.gateway?.nodes?.browser;
	const explicitTarget = params.target === "node";
	const requestedNode = params.requestedNode?.trim();
	if (policy?.mode === "off") {
		await resolveBrowserNodeTarget({
			nodes: () => [],
			config: cfg,
			requestedNode,
			explicitTarget
		});
		return null;
	}
	if (params.sandboxBridgeUrl?.trim() && !explicitTarget && !requestedNode) return null;
	if (params.target && !explicitTarget) return null;
	if (!explicitTarget && !requestedNode && !policy?.node?.trim() && (policy?.mode === "manual" || policy?.mode !== "auto" && !hasGatewayToolRoutingContext() && cfg.gateway?.mode !== "remote" && !cfg.gateway?.remote?.url?.trim() && !process.env.OPENCLAW_GATEWAY_URL?.trim())) return null;
	const node = await resolveBrowserNodeTarget({
		nodes: () => listNodes({}, params.signal),
		config: cfg,
		profile: params.profile,
		requestedNode,
		explicitTarget,
		requireConnected: true
	});
	params.signal?.throwIfAborted();
	return node ? {
		nodeId: node.nodeId,
		label: node.displayName ?? node.remoteIp ?? node.nodeId,
		commands: node.commands ?? [],
		pendingDeclaredCommands: node.pendingDeclaredCommands ?? []
	} : null;
}
function resolveBrowserBaseUrl(params) {
	const cfg = getRuntimeConfig();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	const normalizedSandbox = params.sandboxBridgeUrl?.trim() ?? "";
	if ((params.target ?? (normalizedSandbox ? "sandbox" : "host")) === "sandbox") {
		if (!normalizedSandbox) throw new Error("Sandbox browser is unavailable. Enable agents.defaults.sandbox.browser.enabled or use target=\"host\" if allowed.");
		return normalizedSandbox.replace(/\/$/, "");
	}
	if (params.allowHostControl === false) throw new Error("Host browser control is disabled by sandbox policy.");
	if (!resolved.enabled) throw new Error("Browser control is disabled. Set browser.enabled=true in ~/.openclaw/openclaw.json.");
}
const DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS = 45e3;
const EXISTING_SESSION_MANAGE_ACTIONS = /* @__PURE__ */ new Set([
	"status",
	"start",
	"stop",
	"profiles",
	"tabs",
	"open",
	"focus",
	"close"
]);
const PERSISTENT_TAB_ACTIONS = /* @__PURE__ */ new Set([
	"profiles",
	"tabs",
	"open",
	"focus",
	"close"
]);
function hasExistingSessionProfile(resolved) {
	return Object.keys(resolved.profiles).some((name) => {
		const candidate = resolveProfile(resolved, name);
		return candidate ? getBrowserProfileCapabilities(candidate).usesChromeMcp : false;
	});
}
function resolveBrowserToolTimeoutMs({ requestedTimeoutMs, action, isUserBrowserProfile, usesPersistentPlaywright, isNodeProxy, resolvedBrowser }) {
	if (requestedTimeoutMs !== void 0) return requestedTimeoutMs;
	if (EXISTING_SESSION_MANAGE_ACTIONS.has(action) && (isUserBrowserProfile || action === "profiles" && hasExistingSessionProfile(resolvedBrowser))) return DEFAULT_EXISTING_SESSION_MANAGE_TIMEOUT_MS;
	if (PERSISTENT_TAB_ACTIONS.has(action) && (usesPersistentPlaywright || isNodeProxy)) return resolvedBrowser.actionTimeoutMs;
}
//#endregion
//#region extensions/browser/src/browser-tool.lifecycle.ts
const unavailableSystemProfiles = (unavailableReason) => ({
	profiles: [],
	unavailableReason
});
/**
* Read importable system profiles from the host control server. Discovery must
* match where import runs (host-local), so it never uses a node proxy or the
* sandbox base URL. Other profile sources remain useful when host discovery
* is unavailable, so failures become an explicit degradation fact.
*/
async function readHostSystemProfiles(params) {
	if (params.allowHostControl === false) return unavailableSystemProfiles("Host system profile discovery is disabled by sandbox policy; enable host control to discover importable system profiles.");
	let hostBaseUrl;
	try {
		hostBaseUrl = resolveBrowserBaseUrl({
			target: "host",
			sandboxBridgeUrl: params.sandboxBridgeUrl,
			allowHostControl: params.allowHostControl
		});
	} catch {
		return unavailableSystemProfiles("Host browser control is unavailable; enable it and retry action=profiles target=\"host\".");
	}
	try {
		return {
			profiles: await browserSystemProfiles(hostBaseUrl, {
				timeoutMs: params.timeoutMs,
				signal: params.signal
			}),
			unavailableReason: void 0
		};
	} catch {
		params.signal?.throwIfAborted();
		return unavailableSystemProfiles("Host system profile discovery failed; retry action=profiles target=\"host\" after host browser control is available.");
	}
}
async function executeBrowserLifecycleAction({ action, input: params, baseUrl, profile, timeoutMs: toolTimeoutMs, proxyRequest, allowHostControl, sandboxBridgeUrl, signal }) {
	const readBrowserStatus = async () => await browserStatus(proxyRequest ?? baseUrl, {
		profile,
		timeoutMs: toolTimeoutMs,
		signal
	});
	switch (action) {
		case "doctor": return jsonResult(await browserDoctor(proxyRequest ?? baseUrl, {
			profile,
			signal
		}));
		case "status": return jsonResult(await readBrowserStatus());
		case "start":
		case "stop":
			await (action === "start" ? browserStart : browserStop)(proxyRequest ?? baseUrl, {
				profile,
				timeoutMs: toolTimeoutMs,
				signal
			});
			return jsonResult(await readBrowserStatus());
		case "profiles": {
			const { profiles: systemProfiles, unavailableReason: systemProfilesUnavailable } = await readHostSystemProfiles({
				allowHostControl,
				sandboxBridgeUrl,
				timeoutMs: toolTimeoutMs,
				signal
			});
			if (proxyRequest) {
				const result = await proxyRequest({
					method: "GET",
					path: "/profiles",
					timeoutMs: toolTimeoutMs
				});
				return jsonResult({
					...result && typeof result === "object" ? result : { profiles: result },
					systemProfiles,
					...systemProfilesUnavailable ? { systemProfilesUnavailable } : {}
				});
			}
			return jsonResult({
				profiles: await browserProfiles(baseUrl, {
					timeoutMs: toolTimeoutMs,
					signal
				}),
				systemProfiles,
				...systemProfilesUnavailable ? { systemProfilesUnavailable } : {}
			});
		}
		case "importprofile": {
			if (proxyRequest) throw new Error("system profile import must run on the browser host");
			const domains = parseSystemProfileDomains(params.domains);
			return jsonResult(await browserImportProfile(baseUrl, {
				browser: normalizeOptionalString(params.browser) ?? "chrome",
				systemProfile: normalizeOptionalString(params.systemProfile) ?? "Default",
				into: normalizeOptionalString(params.into) ?? "imported",
				domains,
				signal
			}));
		}
		default: throw new Error(`Unknown action: ${String(action)}`);
	}
}
//#endregion
//#region extensions/browser/src/browser-tool.ts
function isBrowserRouteIdentifier(value, maxChars) {
	return typeof value === "string" && value.length > 0 && value.length <= maxChars && value.trim() === value;
}
function resolveBrowserTabIdentity(params) {
	if (params.baseUrl || !isBrowserRouteIdentifier(params.targetId, 128) || !isBrowserRouteIdentifier(params.profile, 128)) return;
	if (params.target === "node") return isBrowserRouteIdentifier(params.node, 256) ? {
		targetId: params.targetId,
		profile: params.profile,
		target: "node",
		node: params.node
	} : void 0;
	return {
		targetId: params.targetId,
		profile: params.profile,
		target: "host"
	};
}
function withBrowserTabDetails(result, identity) {
	const details = asNullableRecord(result.details);
	if (!identity || !details || details.ok === false || details.isError === true || Array.isArray(details.results) && details.results.some((entry) => asNullableRecord(entry)?.ok === false) || asNullableRecord(details.aborted)?.reason === "closed") return result;
	const url = readStringValue(details.url);
	const protocol = url ? URL.parse(url)?.protocol : void 0;
	const title = readStringValue(details.title);
	return {
		...result,
		details: {
			...details,
			browserTab: {
				...identity,
				...url && (protocol === "http:" || protocol === "https:") ? { url: truncateUtf16Safe(url, 2048) } : {},
				...title ? { title: truncateUtf16Safe(title, 512) } : {}
			}
		}
	};
}
const LEGACY_BROWSER_ACT_REQUEST_KEYS = [
	"kind",
	"actions",
	"stopOnError",
	"targetId",
	"ref",
	"doubleClick",
	"button",
	"modifiers",
	"x",
	"y",
	"text",
	"submit",
	"slowly",
	"key",
	"delayMs",
	"startRef",
	"endRef",
	"values",
	"fields",
	"width",
	"height",
	"timeMs",
	"textGone",
	"selector",
	"url",
	"loadState",
	"fn",
	"timeoutMs"
];
const LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS = /* @__PURE__ */ new Set(["targetId"]);
function readActRequestParam(params) {
	const requestParam = params.request;
	if (requestParam && typeof requestParam === "object") {
		const request = { ...requestParam };
		const hasMismatchedKind = typeof request.kind === "string" && typeof params.kind === "string" && request.kind !== params.kind;
		for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
			if (Object.hasOwn(request, key) || !Object.hasOwn(params, key)) continue;
			if (hasMismatchedKind && !LEGACY_BROWSER_ACT_SHARED_REQUEST_KEYS.has(key)) continue;
			request[key] = params[key];
		}
		return request;
	}
	if (!readToolStringParam(params, "kind")) return;
	const request = {};
	for (const key of LEGACY_BROWSER_ACT_REQUEST_KEYS) {
		if (!Object.hasOwn(params, key)) continue;
		request[key] = params[key];
	}
	return request;
}
function readToolTimeoutMs(params) {
	return readPositiveIntegerParam(params, "timeoutMs", { message: "timeoutMs must be a positive integer." });
}
/** Create the Browser tool exposed to agents. */
function createBrowserTool(opts) {
	const bindingResult = opts?.runToolBinding === void 0 ? void 0 : parseBrowserTabToolBinding(opts.runToolBinding);
	if (bindingResult && !bindingResult.ok) throw new Error(`invalid browser run binding: ${bindingResult.error}`);
	const capabilities = opts?.toolCapabilities ?? (() => {
		const config = getRuntimeConfig();
		const boundProfile = bindingResult?.ok && bindingResult.binding.target === "host" ? resolveProfile(resolveBrowserConfig(config.browser, config), bindingResult.binding.profile) : void 0;
		return resolveBrowserToolCapabilities({
			tabBound: bindingResult?.ok,
			evaluateEnabled: config.browser?.evaluateEnabled !== false,
			...boundProfile ? { profileCapabilities: getBrowserProfileCapabilities(boundProfile) } : {}
		});
	})();
	const targetDefault = opts?.sandboxBridgeUrl ? "sandbox" : "host";
	const hostHint = opts?.allowHostControl === false ? "Host target blocked by policy." : "Host target allowed.";
	return {
		label: "Browser",
		name: "browser",
		resultContentSource: "network",
		description: describeBrowserTool({
			targetDefault,
			hostHint,
			capabilities
		}),
		parameters: createBrowserToolSchema(capabilities),
		outputSchema: BrowserToolOutputSchema,
		execute: async (_toolCallId, args, signal) => {
			let params = bindingResult?.ok ? applyBrowserTabToolBinding(args, bindingResult.binding) : args;
			const action = readToolStringParam(params, "action", { required: true });
			if (!capabilities.actions.some((candidate) => candidate === action)) throw new Error(`browser action ${JSON.stringify(action)} is unavailable for this run; use an available action such as snapshot, or select a managed browser profile in an unbound run.`);
			const dashboardName = readToolStringParam(params, "dashboard");
			let browserDashboard;
			if (dashboardName) {
				if (bindingResult || !opts?.agentSessionKey || opts.allowHostControl === false || params.target && params.target !== "host" || params.node) throw new Error("Browser dashboard requires this session's unbound host-browser capability");
				const request = {
					sessionKey: opts.agentSessionKey,
					agentId: opts.agentId,
					name: dashboardName
				};
				if (params.profile !== void 0 || params.targetId !== void 0) throw new Error("A dashboard selector owns its browser profile and tab. Omit profile and targetId.");
				const callDashboard = async (method, resume = false) => {
					signal?.throwIfAborted();
					const dashboard = await callGatewayTool("browser.request", { timeoutMs: readToolTimeoutMs(params) }, {
						target: "host",
						method,
						path: "/dashboard",
						body: {
							...request,
							...resume ? { resume: true } : {}
						}
					}, {
						scopes: ["operator.admin"],
						signal
					});
					signal?.throwIfAborted();
					return dashboard;
				};
				if (action === "close") return jsonResult({ browserDashboard: await callDashboard("DELETE") });
				if (action === "open") {
					if (params.targetUrl !== void 0 || params.url !== void 0) throw new Error("Update the dashboard widget URL with dashboard widget_put before opening it");
					return jsonResult({ browserDashboard: await callDashboard("POST", true) });
				}
				if ([
					"doctor",
					"status",
					"start",
					"stop",
					"profiles",
					"importprofile"
				].includes(action)) throw new Error("Use browser tab actions with a dashboard selector; open resumes it and close pauses it");
				const dashboard = await callDashboard("POST");
				browserDashboard = dashboard;
				if (!dashboard.browserTab) throw new Error(`Dashboard ${dashboardName} is paused. Use action=open with dashboard=${dashboardName} to resume it.`);
				params = applyBrowserTabToolBinding(params, {
					kind: "tab",
					tabId: 0,
					...dashboard.browserTab
				});
			}
			const requestedProfile = readToolStringParam(params, "profile");
			const requestedNode = readToolStringParam(params, "node");
			const requestedTimeoutMs = readToolTimeoutMs(params);
			let target = readToolStringParam(params, "target");
			const runtimeConfig = getRuntimeConfig();
			const resolvedBrowser = resolveBrowserConfig(runtimeConfig.browser, runtimeConfig);
			const effectiveProfile = requestedProfile ?? resolvedBrowser.defaultProfile;
			const resolvedProfile = resolveProfile(resolvedBrowser, effectiveProfile);
			const profileCapabilities = resolvedProfile ? getBrowserProfileCapabilities(resolvedProfile) : void 0;
			let profile = profileCapabilities?.usesChromeMcp ? effectiveProfile : requestedProfile;
			const configuredNode = runtimeConfig.gateway?.nodes?.browser?.node?.trim();
			if (requestedNode && target && target !== "node") throw new Error("node is only supported with target=\"node\".");
			if (action === "importprofile") {
				if (target === "sandbox" || target === "node" || requestedNode) throw new Error("system profile import must run on the host; omit target or use target=\"host\".");
				target = "host";
			}
			const isUserBrowserProfile = profileCapabilities?.usesChromeMcp === true;
			if (isUserBrowserProfile) {
				if (target === "sandbox") throw new Error(`profile="${profile}" cannot use the sandbox browser; use target="host" or omit target.`);
			}
			let nodeTarget = null;
			try {
				nodeTarget = await resolveBrowserToolNodeTarget({
					requestedNode: requestedNode ?? void 0,
					profile: requestedProfile,
					target,
					sandboxBridgeUrl: opts?.sandboxBridgeUrl,
					allowHostControl: opts?.allowHostControl,
					signal
				});
			} catch (error) {
				signal?.throwIfAborted();
				if (!(isUserBrowserProfile && !target && !requestedNode && !configuredNode)) throw error;
			}
			if (isUserBrowserProfile && !target && !requestedNode && !nodeTarget) target = "host";
			const baseUrl = nodeTarget ? void 0 : resolveBrowserBaseUrl({
				target: target === "node" ? void 0 : target,
				sandboxBridgeUrl: opts?.sandboxBridgeUrl,
				allowHostControl: opts?.allowHostControl
			});
			const allowAutomaticHostFallback = Boolean(nodeTarget && !target && !requestedNode && !configuredNode && opts?.allowHostControl !== false);
			const proxyRequest = nodeTarget ? createBrowserNodeProxyRequest({
				nodeTarget,
				allowAutomaticHostFallback,
				signal
			}) : null;
			if (proxyRequest) profile = requestedProfile;
			if (!proxyRequest && isUserBrowserProfile && [
				"requests",
				"errors",
				"text",
				"emulate"
			].includes(action)) throw new Error(`action=${action} is not supported for existing-session profiles; use action=snapshot to inspect this page, or select a managed browser profile for ${action}.`);
			const nodeRoute = nodeTarget ? createBrowserNodeSessionTabRoute(nodeTarget) : void 0;
			const toolTimeoutMs = resolveBrowserToolTimeoutMs({
				requestedTimeoutMs,
				action,
				isUserBrowserProfile,
				usesPersistentPlaywright: profileCapabilities?.usesPersistentPlaywright === true,
				isNodeProxy: proxyRequest !== null,
				resolvedBrowser
			});
			const sessionTabs = createBrowserToolSessionTabs({
				sessionKey: opts?.agentSessionKey,
				requestedProfile: profile,
				defaultProfile: resolvedBrowser.defaultProfile,
				baseUrl,
				nodeRoute,
				routeProfile: () => {
					const route = proxyRequest?.route();
					return route?.status === "resolved" ? route.profile : void 0;
				},
				isHostFallbackActive: proxyRequest?.isHostFallbackActive,
				registry: {
					touchSessionBrowserTab,
					trackSessionBrowserTab,
					untrackSessionBrowserTab
				}
			});
			switch (action) {
				case "doctor":
				case "status":
				case "start":
				case "stop":
				case "profiles":
				case "importprofile": return await executeBrowserLifecycleAction({
					action,
					input: params,
					baseUrl,
					profile,
					timeoutMs: toolTimeoutMs,
					proxyRequest,
					allowHostControl: opts?.allowHostControl,
					sandboxBridgeUrl: opts?.sandboxBridgeUrl,
					signal
				});
			}
			let tabIdentity;
			if (browserDashboard) await assertBrowserDashboardTargetCurrent(browserDashboard, opts?.agentId, { signal });
			const dispatchTabAction = () => executeBrowserTabAction({
				action,
				actRequest: action === "act" ? readActRequestParam(params) : void 0,
				params,
				baseUrl,
				profile,
				proxyRequest,
				nodeRoute,
				sessionTabs,
				capabilities,
				isUserBrowserProfile,
				toolTimeoutMs,
				requestedTimeoutMs,
				signal,
				opts,
				boundTargetId: bindingResult?.ok ? bindingResult.binding.targetId : dashboardName ? readToolStringParam(params, "targetId") : void 0,
				onTabActivity: (targetId, openedProfile) => {
					const route = proxyRequest?.route();
					const onNode = proxyRequest && !proxyRequest.isHostFallbackActive();
					const routeProfile = onNode ? route?.status === "resolved" ? route.profile : void 0 : profile ?? resolvedBrowser.defaultProfile;
					tabIdentity = resolveBrowserTabIdentity({
						targetId,
						baseUrl,
						profile: openedProfile ?? routeProfile,
						target: onNode ? "node" : "host",
						node: onNode && route?.status === "resolved" ? nodeTarget?.nodeId : void 0
					});
				}
			});
			const dashboardTarget = browserDashboard;
			const result = dashboardTarget ? await withBrowserRequestScope({
				managedOnly: true,
				assertCurrent: (admittedProfile) => assertBrowserDashboardTargetCurrent(dashboardTarget, opts?.agentId, { signal }, admittedProfile)
			}, dispatchTabAction) : await dispatchTabAction();
			if (browserDashboard) return {
				...result,
				details: {
					...asNullableRecord(result.details),
					browserDashboard
				}
			};
			return [
				"open",
				"focus",
				"navigate",
				"screenshot",
				"snapshot",
				"text",
				"requests",
				"errors",
				"console",
				"emulate",
				"act"
			].includes(action) ? withBrowserTabDetails(result, tabIdentity) : result;
		}
	};
}
//#endregion
//#region extensions/browser/src/node-host/invoke-browser.ts
/**
* Node-host browser.proxy command implementation for delegated Browser control
* requests.
*/
function readOwnedTabCloseRequest(value) {
	const record = asNullableRecord(value);
	const ownership = asNullableRecord(record?.ownership);
	if (ownership?.status !== "durable" || typeof ownership.nativeTargetId !== "string" || !ownership.nativeTargetId.trim() || typeof ownership.profileFingerprint !== "string" || !ownership.profileFingerprint.trim() || typeof ownership.browserInstanceFingerprint !== "string" || !ownership.browserInstanceFingerprint.trim()) throw new Error("INVALID_REQUEST: valid durable tab ownership required");
	return { ownership: {
		status: "durable",
		nativeTargetId: ownership.nativeTargetId.trim(),
		profileFingerprint: ownership.profileFingerprint.trim(),
		browserInstanceFingerprint: ownership.browserInstanceFingerprint.trim()
	} };
}
const BROWSER_PROXY_STATUS_TIMEOUT_MS = 750;
const BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES = 25165824;
function countBrowserProxyEncodedPayloadBytes(serialized) {
	let bytes = Buffer.byteLength(serialized, "utf8") + 2;
	for (const character of "\"\\") {
		const code = character.charCodeAt(0);
		let index = serialized.indexOf(character);
		while (index !== -1) {
			const end = Math.min(index + 128, serialized.length);
			for (; index < end; index++) if (serialized.charCodeAt(index) === code) bytes++;
			index = serialized.indexOf(character, index);
		}
	}
	const wellFormed = toUSVString(serialized);
	if (wellFormed !== serialized) {
		for (let index = wellFormed.indexOf("�"); index !== -1; index = wellFormed.indexOf("�", index + 1)) if (serialized.charCodeAt(index) !== 65533) bytes += 3;
	}
	return bytes;
}
function normalizeProfileAllowlist(raw) {
	return Array.isArray(raw) ? normalizeStringEntries(raw) : [];
}
function resolveBrowserProxyConfig(cfg = loadBrowserConfigForRuntimeRefresh()) {
	const proxy = cfg.nodeHost?.browserProxy;
	if (proxy?.enabled === false) throw new Error("UNAVAILABLE: node browser proxy disabled");
	return { allowProfiles: normalizeProfileAllowlist(proxy?.allowProfiles) };
}
let browserControlReady = null;
let admittedBrowserControlState = null;
function hasBrowserNodeHostWork() {
	return hasBrowserControlWork() || hasBrowserProxyUploadWork();
}
async function ensureBrowserControlService() {
	const current = getBrowserControlState();
	if (current && current === admittedBrowserControlState) return;
	if (browserControlReady) return browserControlReady;
	const sharedStartup = (async () => {
		const cfg = loadBrowserConfigForRuntimeRefresh();
		if (!resolveBrowserConfig(cfg.browser, cfg).enabled) throw new Error(await describeBrowserControlUnavailable(cfg));
		const started = await startBrowserControlServiceFromConfig();
		if (!started) throw new Error(await describeBrowserControlUnavailable(cfg));
		admittedBrowserControlState = started;
	})().finally(() => {
		if (browserControlReady === sharedStartup) browserControlReady = null;
	});
	browserControlReady = sharedStartup;
	return sharedStartup;
}
function isProfileAllowed(params) {
	const { allowProfiles, profile } = params;
	if (!allowProfiles.length) return true;
	if (!profile) return false;
	return allowProfiles.includes(profile.trim());
}
function collectBrowserProxyPaths(payload) {
	const paths = /* @__PURE__ */ new Set();
	visitBrowserProxyFilePaths(payload, (filePath) => {
		paths.add(filePath.trim());
		assertBrowserProxyFileCountWithinLimit(paths.size);
	});
	return [...paths];
}
async function readBrowserProxyFiles(filePaths) {
	const files = [];
	let totalBytes = 0;
	for (const filePath of filePaths) try {
		const stat = await fs.stat(filePath).catch(() => null);
		if (!stat || !stat.isFile()) throw new Error("file not found");
		assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
		const buffer = await fs.readFile(filePath);
		assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
		totalBytes += buffer.byteLength;
		const mimeType = await detectMime({
			buffer,
			filePath
		});
		files.push({
			path: filePath,
			base64: buffer.toString("base64"),
			mimeType
		});
	} catch (err) {
		throw new Error(`browser proxy file read failed for ${filePath}: ${String(err)}`, { cause: err });
	}
	return files;
}
function decodeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	return JSON.parse(raw);
}
function isBrowserProxyTimeoutError(err) {
	return String(err).includes("browser proxy request timed out");
}
function combineBrowserProxySignals(timeoutSignal, invocationSignal) {
	if (timeoutSignal && invocationSignal) return AbortSignal.any([timeoutSignal, invocationSignal]);
	return timeoutSignal ?? invocationSignal;
}
function isWsBackedBrowserProxyPath(path) {
	return path === "/act" || path === "/download" || path === "/navigate" || path === "/pdf" || path === "/screenshot" || path === "/snapshot" || path === "/wait/download";
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
async function runBrowserProxyCommand(paramsJSON, command = BROWSER_PROXY_COMMAND, invocationSignal) {
	invocationSignal?.throwIfAborted();
	ensureBrowserProxyUploadCleanup();
	const params = decodeParams(paramsJSON);
	if (command === "browser.proxy" && params.upload !== void 0) throw new Error("INVALID_REQUEST: browser.proxy does not accept upload envelopes");
	if (command === "browser.proxy.upload.v1" && !params.upload) throw new Error("INVALID_REQUEST: browser.proxy.upload.v1 requires an upload envelope");
	if (command !== "browser.proxy" && command !== "browser.proxy.upload.v1") throw new Error(`INVALID_REQUEST: unsupported browser proxy command: ${command}`);
	const pathValue = typeof params.path === "string" ? params.path.trim() : "";
	if (!pathValue) throw new Error("INVALID_REQUEST: path required");
	resolveBrowserProxyConfig();
	const method = typeof params.method === "string" ? params.method.trim().toUpperCase() : "GET";
	const path = normalizeBrowserRequestPath(pathValue);
	if (method !== "GET" && method !== "POST" && method !== "DELETE") throw new Error("INVALID_REQUEST: method must be GET, POST, or DELETE");
	if (path === "/__openclaw/session-tab/close-owned" && method !== "POST") throw new Error("INVALID_REQUEST: owned tab close requires POST");
	await ensureBrowserControlService();
	invocationSignal?.throwIfAborted();
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const resolved = resolveBrowserConfig(cfg.browser, cfg);
	let body = params.body;
	const requestedProfile = resolveRequestedBrowserProfile({
		query: params.query,
		body,
		profile: params.profile
	}) ?? "";
	const effectiveProfile = path === "/profiles" ? "" : requestedProfile || resolved.defaultProfile;
	const effectiveResolvedProfile = effectiveProfile ? resolveProfile(resolved, effectiveProfile) : null;
	const route = effectiveResolvedProfile ? {
		status: "resolved",
		profile: effectiveProfile,
		driver: effectiveResolvedProfile.driver
	} : { status: "unavailable" };
	const includeRoute = params.errorEnvelope === BROWSER_PROXY_ERROR_ENVELOPE;
	const allowedProfiles = resolveBrowserProxyConfig(cfg).allowProfiles;
	if (isPersistentBrowserProfileMutation(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot mutate persistent browser profiles");
	if (isBrowserHostLocalRoute(method, path)) throw new Error("INVALID_REQUEST: browser.proxy cannot run host-local browser routes");
	const assertCurrent = (profile) => {
		invocationSignal?.throwIfAborted();
		const current = resolveBrowserProxyConfig();
		const selected = profile?.name || effectiveProfile || requestedProfile;
		if ((path !== "/profiles" || selected) && !isProfileAllowed({
			allowProfiles: current.allowProfiles,
			profile: selected
		})) throw new Error("INVALID_REQUEST: browser profile not allowed");
	};
	assertCurrent();
	const timeoutMs = resolveBrowserProxyTimeoutMs(params.timeoutMs);
	const deadlineAt = Date.now() + timeoutMs;
	const query = {};
	const rawQuery = params.query ?? {};
	for (const [key, value] of Object.entries(rawQuery)) {
		if (value === void 0 || value === null) continue;
		query[key] = typeof value === "string" ? value : String(value);
	}
	if (effectiveProfile || requestedProfile) query.profile = effectiveProfile || requestedProfile;
	if (path === "/__openclaw/session-tab/close-owned") {
		const request = readOwnedTabCloseRequest(body);
		const liveResolved = getBrowserControlState()?.resolved ?? resolved;
		const profile = resolveProfile(liveResolved, effectiveProfile);
		assertCurrent(profile ?? void 0);
		const result = profile?.cdpUrl && effectiveProfile ? await closeTrackedCdpTarget({
			profileName: effectiveProfile,
			cdpUrl: profile.cdpUrl,
			nativeTargetId: request.ownership.nativeTargetId,
			expectedProfileFingerprint: request.ownership.profileFingerprint,
			expectedBrowserInstanceFingerprint: request.ownership.browserInstanceFingerprint,
			timeoutMs: liveResolved.remoteCdpTimeoutMs,
			ssrfPolicy: resolveCdpControlPolicy(profile, liveResolved.ssrfPolicy),
			signal: invocationSignal,
			shouldClose: () => {
				assertCurrent(profile);
				return true;
			}
		}) : { status: "ownership-mismatch" };
		return JSON.stringify({
			result,
			...includeRoute ? { route } : {}
		});
	}
	const dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	let stagedUpload;
	try {
		stagedUpload = await withTimeout((timeoutSignal) => stageBrowserProxyUploadRequest({
			method,
			path,
			body,
			upload: params.upload,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal)
		}), timeoutMs, "browser proxy request");
	} catch (err) {
		if (!isBrowserProxyTimeoutError(err)) throw err;
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: requestedProfile || resolved.defaultProfile || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status: null
		}), { cause: err });
	}
	body = stagedUpload.body;
	try {
		assertCurrent();
	} catch (error) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		throw error;
	}
	const remainingTimeoutMs = deadlineAt - Date.now();
	if (remainingTimeoutMs <= 0) {
		await discardStagedBrowserProxyUpload(stagedUpload);
		throw new Error(formatBrowserProxyTimeoutMessage({
			method,
			path,
			profile: requestedProfile || resolved.defaultProfile || void 0,
			timeoutMs,
			wsBacked: isWsBackedBrowserProxyPath(path),
			status: null
		}));
	}
	let response;
	try {
		response = await withTimeout((timeoutSignal) => dispatcher.dispatch({
			method,
			path,
			query,
			body,
			signal: combineBrowserProxySignals(timeoutSignal, invocationSignal),
			assertCurrent: async (profile) => {
				assertCurrent(profile);
			}
		}), remainingTimeoutMs, "browser proxy request");
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
		await discardStagedBrowserProxyUpload(stagedUpload);
		if (params.errorEnvelope === "browser-v1") return JSON.stringify(createBrowserProxyFailure(response.status, response.body, route));
		const detail = response.body && typeof response.body === "object" && "error" in response.body ? String(response.body.error).trim() : "";
		throw new Error(detail ? `${response.status}: ${detail}` : `HTTP ${response.status}`);
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
	const paths = collectBrowserProxyPaths(result);
	const files = paths.length > 0 ? await readBrowserProxyFiles(paths) : void 0;
	const payload = files ? {
		result,
		files,
		...includeRoute ? { route } : {}
	} : {
		result,
		...includeRoute ? { route } : {}
	};
	const serialized = JSON.stringify(payload);
	if (countBrowserProxyEncodedPayloadBytes(serialized) > BROWSER_PROXY_MAX_ENCODED_PAYLOAD_BYTES) throw new Error("browser proxy payload exceeds 24 MiB encoded limit");
	return serialized;
}
//#endregion
//#region extensions/browser/src/gateway/browser-request.ts
/**
* Gateway handler for browser.request, including optional node-host proxy
* dispatch and local Browser control route dispatch.
*/
const logger = createSubsystemLogger("browser");
const dashboardRequestSchema = object({
	sessionKey: string().trim().min(1),
	agentId: string().trim().min(1).optional(),
	name: string().regex(/^[a-z0-9][a-z0-9._-]{0,63}$/),
	instanceId: string().min(1).optional()
});
/** Handles one browser.request gateway call and streams a success/error response. */
async function handleBrowserGatewayRequest({ params, respond, context, client, signal: invocationSignal, hasCurrentClientAuthority }) {
	const typed = params;
	const methodRaw = (normalizeOptionalString(typed.method) ?? "").toUpperCase();
	const path = normalizeBrowserRequestPath(normalizeOptionalString(typed.path) ?? "");
	let query = typed.query && typeof typed.query === "object" ? typed.query : void 0;
	let body = typed.body;
	const timeoutMs = clampTimerTimeoutMs(typed.timeoutMs);
	const explicitNode = typed.target === "node";
	const requestedNode = normalizeOptionalString(typed.node);
	const connectionSignal = client?.connectionSignal;
	const requestSignal = invocationSignal && connectionSignal && invocationSignal !== connectionSignal ? AbortSignal.any([invocationSignal, connectionSignal]) : invocationSignal ?? connectionSignal;
	const isRequesterCurrent = () => !requestSignal?.aborted && !client?.invalidated && !client?.connectionSignal?.aborted && hasCurrentClientAuthority?.() !== false;
	const assertRequesterCurrent = () => {
		requestSignal?.throwIfAborted();
		if (!isRequesterCurrent()) throw new Error("Browser requester is no longer active");
	};
	if (typed.target !== void 0 && typed.target !== "host" && !explicitNode || typed.node !== void 0 && (!explicitNode || !requestedNode || typeof typed.node !== "string" || typed.node.length > 256)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "target must be \"host\" or \"node\"; node requires target=\"node\" and a nonempty selector of at most 256 characters"));
		return;
	}
	if (!methodRaw || !path) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "method and path are required"));
		return;
	}
	if (methodRaw !== "GET" && methodRaw !== "POST" && methodRaw !== "DELETE") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "method must be GET, POST, or DELETE"));
		return;
	}
	if (path === "/dashboard") {
		if (typed.target === "node" || requestedNode) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Browser dashboards use a local managed browser on the Gateway host"));
			return;
		}
		const request = dashboardRequestSchema.extend({ resume: boolean().optional() }).safeParse(methodRaw === "GET" ? query : body);
		if (!request.success) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Browser dashboard requires sessionKey and a stable widget name"));
			return;
		}
		try {
			respond(true, await (methodRaw === "DELETE" ? stopBrowserDashboard : methodRaw === "GET" ? inspectBrowserDashboard : requestBrowserDashboard)(request.data, {
				signal: requestSignal,
				assertCurrent: assertRequesterCurrent
			}));
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(error)));
		}
		return;
	}
	let assertDashboardCurrent;
	if (typed.dashboard !== void 0) {
		const scope = dashboardRequestSchema.safeParse(typed.dashboard);
		if (!scope.success || explicitNode || requestedNode) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Dashboard requests require a valid local dashboard identity"));
			return;
		}
		try {
			const authority = {
				signal: requestSignal,
				assertCurrent: assertRequesterCurrent
			};
			const dashboard = await inspectBrowserDashboard(scope.data, authority);
			const tab = dashboard.browserTab;
			if (!tab || dashboard.paused) throw new Error("Dashboard browser is paused or unavailable. Resume the dashboard first.");
			if (path === "/tabs/open" || path === "/tabs/action" || path === "/start" || path === "/stop" || path === "/reset-profile" || path.startsWith("/profiles") || path.startsWith("/system-")) throw new Error("Use the dashboard controls to open or stop its retained tab");
			if (methodRaw === "DELETE" && path.startsWith("/tabs/") && decodeURIComponent(path.slice(6)) !== tab.targetId) throw new Error("Dashboard request cannot address another browser tab");
			const binding = {
				kind: "tab",
				tabId: 0,
				...tab
			};
			query = {
				...applyBrowserTabToolBinding(query ?? {}, binding),
				managedOnly: true
			};
			const bodyRecord = asNullableRecord(body);
			if (bodyRecord || methodRaw === "POST") body = applyBrowserTabToolBinding(bodyRecord ?? {}, binding);
			assertDashboardCurrent = (profile) => assertBrowserDashboardTargetCurrent(dashboard, scope.data.agentId, authority, profile);
			await assertDashboardCurrent();
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, String(error)));
			return;
		}
	}
	const cfg = getRuntimeConfig();
	const configuredNode = normalizeOptionalString(cfg.gateway?.nodes?.browser?.node);
	const forceHostLocal = Boolean(assertDashboardCurrent) || isBrowserHostLocalRoute(methodRaw, path);
	if (forceHostLocal && explicitNode) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "this browser route must run on the Gateway host"));
		return;
	}
	let nodeTarget = null;
	if (!forceHostLocal && typed.target !== "host") try {
		nodeTarget = await resolveBrowserNodeTarget({
			nodes: () => context.nodeRegistry.listConnected(),
			config: cfg,
			profile: resolveRequestedBrowserProfile({
				query,
				body
			}),
			explicitTarget: explicitNode,
			requestedNode
		});
		assertRequesterCurrent();
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	if (nodeTarget && path === "/screencast") {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "browser screencast is not available over a node proxy", { details: {
			code: "SCREENCAST_UNSUPPORTED",
			reason: "node"
		} }));
		return;
	}
	if (nodeTarget && isPersistentBrowserProfileMutation(methodRaw, path)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "browser.request cannot mutate persistent browser profiles over a node proxy"));
		return;
	}
	let preparedUpload = null;
	let proxyCommand = BROWSER_PROXY_COMMAND;
	if (nodeTarget) {
		if (isBrowserProxyUploadRequest({
			method: methodRaw,
			path,
			body
		}) && !nodeTarget.commands?.includes("browser.proxy.upload.v1")) {
			const message = browserProxyUploadUnavailableMessage(nodeTarget.declaredCommands);
			if (explicitNode || configuredNode) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message));
				return;
			}
			logger.warn(`browser node ${nodeTarget.displayName ?? nodeTarget.nodeId} lacks ${BROWSER_PROXY_UPLOAD_COMMAND}; falling back to Gateway host`);
			nodeTarget = null;
		}
	}
	if (nodeTarget) {
		try {
			assertRequesterCurrent();
			preparedUpload = await prepareBrowserProxyUploadRequest({
				method: methodRaw,
				path,
				body,
				signal: requestSignal
			});
			assertRequesterCurrent();
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
			return;
		}
		if (preparedUpload.upload) proxyCommand = BROWSER_PROXY_UPLOAD_COMMAND;
	}
	if (nodeTarget && preparedUpload) {
		const allowlist = resolveNodeCommandAllowlist(cfg, nodeTarget);
		const allowed = isNodeCommandAllowed({
			command: proxyCommand,
			declaredCommands: nodeTarget.commands,
			allowlist
		});
		if (!allowed.ok) {
			const platform = nodeTarget.platform ?? "unknown";
			const hint = `node command not allowed: ${allowed.reason} (platform: ${platform}, command: ${proxyCommand})`;
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, hint, { details: {
				reason: allowed.reason,
				command: proxyCommand
			} }));
			return;
		}
		const { proxyTimeoutMs, nodeInvokeTimeoutMs } = resolveBrowserProxyTimeouts(timeoutMs);
		const proxyParams = {
			method: methodRaw,
			path,
			query,
			body: preparedUpload.body,
			upload: preparedUpload.upload,
			timeoutMs: proxyTimeoutMs,
			profile: resolveRequestedBrowserProfile({
				query,
				body
			}),
			errorEnvelope: BROWSER_PROXY_ERROR_ENVELOPE
		};
		let res;
		try {
			assertRequesterCurrent();
			res = await context.nodeRegistry.invoke({
				nodeId: nodeTarget.nodeId,
				command: proxyCommand,
				params: proxyParams,
				timeoutMs: nodeInvokeTimeoutMs,
				signal: requestSignal,
				isDispatchAuthorized: isRequesterCurrent,
				idempotencyKey: crypto.randomUUID()
			});
			assertRequesterCurrent();
		} catch (error) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(error)));
			return;
		}
		if (!explicitNode && !configuredNode && isBrowserControlHostUnavailableError(res.error) && !res.ok) logger.warn(`browser node ${nodeTarget.displayName ?? nodeTarget.nodeId} control host unavailable; falling back to Gateway host`);
		else {
			if (!respondUnavailableOnNodeInvokeError(respond, res)) return;
			const payload = res.payloadJSON ? parseGatewayPayload(res.payloadJSON) : res.payload;
			const failure = parseBrowserProxyFailure(payload);
			if (failure) {
				const { status, body: errorBody } = failure.error;
				const code = status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST;
				respond(false, void 0, errorShape(code, errorBody.error, { details: errorBody }));
				return;
			}
			const proxy = payload && typeof payload === "object" ? payload : null;
			if (!proxy || !("result" in proxy)) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser proxy failed"));
				return;
			}
			const success = proxy;
			try {
				const result = await persistBrowserProxyResultFiles(success.result, success.files);
				assertRequesterCurrent();
				respond(true, result);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "browser proxy file transfer failed"));
			}
			return;
		}
	}
	if (!await startBrowserControlServiceFromConfig()) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, await describeBrowserControlUnavailable()));
		return;
	}
	let dispatcher;
	try {
		dispatcher = createBrowserRouteDispatcher(createBrowserControlContext());
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	const requesterSignal = connectionSignal;
	const requester = client && requesterSignal ? {
		connId: client.connId,
		signal: requesterSignal,
		isCurrent: () => client.invalidated !== true && !requesterSignal.aborted && hasCurrentClientAuthority?.() !== false
	} : void 0;
	const assertCurrent = async (profile) => {
		assertRequesterCurrent();
		await assertDashboardCurrent?.(profile);
		assertRequesterCurrent();
	};
	let result;
	try {
		await assertCurrent();
		result = timeoutMs ? await withTimeout((timeoutSignal) => dispatcher.dispatch({
			method: methodRaw,
			path,
			query,
			body,
			signal: timeoutSignal && requestSignal ? AbortSignal.any([timeoutSignal, requestSignal]) : timeoutSignal ?? requestSignal,
			...requester ? { requester } : {},
			assertCurrent
		}), timeoutMs, "browser request") : await dispatcher.dispatch({
			method: methodRaw,
			path,
			query,
			body,
			signal: requestSignal,
			...requester ? { requester } : {},
			assertCurrent
		});
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
		return;
	}
	if (result.status >= 400) {
		const message = result.body && typeof result.body === "object" && "error" in result.body ? String(result.body.error) : `browser request failed (${result.status})`;
		const code = result.status >= 500 ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST;
		respond(false, void 0, errorShape(code, message, { details: result.body }));
		return;
	}
	respond(true, result.body);
}
/** Gateway request handler map contributed by the Browser plugin. */
const browserHandlers = { "browser.request": handleBrowserGatewayRequest };
//#endregion
//#region extensions/browser/src/plugin-service.ts
/**
* Browser plugin service factory that lazily starts the control server.
*/
const EAGER_BROWSER_CONTROL_SERVICE_ENV = "OPENCLAW_EAGER_BROWSER_CONTROL_SERVER";
const UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER = /^(?:data|http|https|node):/i;
function validateBrowserControlOverrideSpecifier(specifier) {
	const trimmed = specifier.trim();
	if (UNSAFE_BROWSER_CONTROL_OVERRIDE_SPECIFIER.test(trimmed)) throw new Error(`Refusing unsafe browser control override specifier: ${trimmed}`);
	return trimmed;
}
/** Creates the Browser plugin service registered by the plugin entrypoint. */
function createBrowserPluginService(params) {
	let handle = null;
	return {
		id: "browser-control",
		start: async () => {
			if (!isTruthyEnvValue(process.env[EAGER_BROWSER_CONTROL_SERVICE_ENV])) return;
			if (handle) return;
			handle = await startLazyPluginServiceModule({
				skipEnvVar: "OPENCLAW_SKIP_BROWSER_CONTROL_SERVER",
				overrideEnvVar: "OPENCLAW_BROWSER_CONTROL_MODULE",
				validateOverrideSpecifier: validateBrowserControlOverrideSpecifier,
				loadDefaultModule: async () => await import("./server-441btGgc.mjs"),
				startExportNames: ["startBrowserControlServiceFromConfig", "startBrowserControlServerFromConfig"],
				stopExportNames: ["stopBrowserControlService", "stopBrowserControlServer"]
			});
		},
		stop: async () => {
			const current = handle;
			if (current) {
				await current.stop();
				if (handle === current) handle = null;
				return;
			}
			await params.stopOnDemand();
		}
	};
}
//#endregion
export { runBrowserProxyCommand as a, browserPdfSave as c, browserArmFileChooser as d, browserNavigate as f, hasBrowserNodeHostWork as i, browserAct as l, browserHandlers as n, createBrowserTool as o, browserScreenshotAction as p, handleBrowserGatewayRequest as r, browserConsoleMessages as s, createBrowserPluginService as t, browserArmDialog as u };
