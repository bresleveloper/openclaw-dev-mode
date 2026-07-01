import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { C as resolveExpiresAtMsFromDurationMs, D as resolveIntegerOption, O as resolveNonNegativeIntegerOption, g as parseFiniteNumber, m as isFutureDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-aqmM_n6V.js";
import { r as sanitizeUntrustedFileName } from "./sibling-temp-CLpkwDtX.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as SsrFBlockedError } from "./ssrf-DmSIVBht.js";
import "./number-runtime-DBLVDypr.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as resolveActInteractionTimeoutMs, n as ACT_MAX_VIEWPORT_DIMENSION, o as resolveActWaitTimeoutMs, r as ACT_MAX_WAIT_TIME_MS, t as ACT_MAX_CLICK_DELAY_MS } from "./act-policy-ChvnirnB.js";
import "./sdk-security-runtime-DUaKWlYv.js";
import { S as BrowserTabNotFoundError, Y as withNoProxyForCdpUrl, c as isWebSocketUrl, d as withCdpSocket, i as fetchJson, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, o as getHeadersWithAuth, t as appendCdpPath } from "./cdp.helpers-DjkDekqM.js";
import { a as DEFAULT_DOWNLOAD_DIR, l as resolveStrictExistingUploadPaths, o as DEFAULT_TRACE_DIR } from "./config-Bq1Kc57-.js";
import "./tmp-openclaw-dir-Md827g-c.js";
import "./errors-B25hu1RS.js";
import { c as getRoleSnapshotStats, i as planAnnotations, l as parseRoleRef, m as normalizeBrowserEvaluateFunctionSource, n as buildOverlayClearScript, o as buildRoleSnapshotFromAiSnapshot, p as matchBrowserUrlPattern, r as buildOverlayInjectionScript, s as buildRoleSnapshotFromAriaSnapshot, t as appendSnapshotUrls } from "./snapshot-urls-DUxkMzy2.js";
import { C as assertBrowserNavigationRedirectChainAllowed, E as withBrowserNavigationPolicy, S as assertBrowserNavigationAllowed, f as formatAriaSnapshot, l as AX_REF_PATTERN, p as normalizeCdpWsUrl, t as getChromeWebSocketUrl, w as assertBrowserNavigationResultAllowed, x as InvalidBrowserNavigationUrlError, y as ensureOutputDirectory } from "./chrome-DsW_JBu2.js";
import { n as markPwAiLoaded } from "./pw-ai-state-B4Mk01M0.js";
import { t as isSelectableCdpBrowserTarget } from "./cdp-target-filter-BavCjeal.js";
import { createRequire } from "node:module";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/browser/src/browser/output-atomic.ts
/**
* Atomic output write helper.
*
* Ensures browser-generated files are written through a sibling temp path under
* an allowed output root before becoming visible at the target path.
*/
/** Write a file inside an output root via a caller-provided temp writer. */
async function writeViaSiblingTempPath(params) {
	await ensureOutputDirectory(params.rootDir);
	await writeExternalFileWithinRoot({
		rootDir: params.rootDir,
		path: params.targetPath,
		write: params.writeTemp
	});
}
/** Runtime playwright-core module instance. */
const playwrightCore = createRequire(import.meta.url)("playwright-core");
//#endregion
//#region extensions/browser/src/browser/pw-session.page-cdp.ts
/**
* Playwright page-scoped CDP helpers.
*
* Opens a CDP session through Playwright pages and marks backend DOM nodes with
* temporary browser refs for role-snapshot interactions.
*/
/** Attribute used to mark DOM nodes that correspond to generated browser refs. */
const BROWSER_REF_MARKER_ATTRIBUTE = "data-openclaw-browser-ref";
async function withPlaywrightPageCdpSession(page, fn) {
	const session = await page.context().newCDPSession(page);
	try {
		return await fn(session);
	} finally {
		await session.detach().catch(() => {});
	}
}
/** Run a function with a CDP send helper scoped to one Playwright page. */
async function withPageScopedCdpClient(opts) {
	return await withPlaywrightPageCdpSession(opts.page, async (session) => {
		return await opts.fn((method, params) => session.send(method, params));
	});
}
/** Mark backend DOM node ids on the page with browser ref attributes. */
async function markBackendDomRefsOnPage(opts) {
	await opts.page.locator(`[${BROWSER_REF_MARKER_ATTRIBUTE}]`).evaluateAll((elements, attr) => {
		for (const element of elements) if (element instanceof Element) element.removeAttribute(attr);
	}, BROWSER_REF_MARKER_ATTRIBUTE).catch(() => {});
	const refs = opts.refs.filter((entry) => /^ax\d+$/.test(entry.ref) && Number.isFinite(entry.backendDOMNodeId) && Math.floor(entry.backendDOMNodeId) > 0);
	const marked = /* @__PURE__ */ new Set();
	if (!refs.length) return marked;
	return await withPlaywrightPageCdpSession(opts.page, async (session) => {
		const send = async (method, params) => await session.send(method, params);
		await send("DOM.enable").catch(() => {});
		const backendNodeIds = uniqueValues(refs.map((entry) => Math.floor(entry.backendDOMNodeId)));
		const pushed = await send("DOM.pushNodesByBackendIdsToFrontend", { backendNodeIds }).catch(() => ({}));
		const nodeIds = Array.isArray(pushed.nodeIds) ? pushed.nodeIds : [];
		const nodeIdByBackendId = /* @__PURE__ */ new Map();
		for (let index = 0; index < backendNodeIds.length; index += 1) {
			const backendNodeId = backendNodeIds[index];
			const nodeId = nodeIds[index];
			if (backendNodeId && typeof nodeId === "number" && nodeId > 0) nodeIdByBackendId.set(backendNodeId, nodeId);
		}
		for (const entry of refs) {
			const nodeId = nodeIdByBackendId.get(Math.floor(entry.backendDOMNodeId));
			if (!nodeId) continue;
			try {
				await send("DOM.setAttributeValue", {
					nodeId,
					name: BROWSER_REF_MARKER_ATTRIBUTE,
					value: entry.ref
				});
				marked.add(entry.ref);
			} catch {}
		}
		return marked;
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-session.ts
/**
* Playwright browser session manager.
*
* Manages CDP-backed Playwright connections, page lookup, observed dialogs,
* console/network/page state, role refs, and safe navigation handling.
*/
const { chromium } = playwrightCore;
/** Raised when an action is blocked by an observed modal dialog. */
var BrowserObservedDialogBlockedError = class extends Error {
	constructor(browserState) {
		super("Browser action blocked by a modal dialog.");
		this.name = "BrowserObservedDialogBlockedError";
		this.browserState = browserState;
	}
};
/** Type guard for observed-dialog blocked errors. */
function isBrowserObservedDialogBlockedError(err) {
	return err instanceof BrowserObservedDialogBlockedError;
}
const pageStates = /* @__PURE__ */ new WeakMap();
const contextStates = /* @__PURE__ */ new WeakMap();
const observedContexts = /* @__PURE__ */ new WeakSet();
const observedPages = /* @__PURE__ */ new WeakSet();
const roleRefsByTarget = /* @__PURE__ */ new Map();
const MAX_ROLE_REFS_CACHE = 50;
const MAX_CONSOLE_MESSAGES = 500;
const MAX_PAGE_ERRORS = 200;
const MAX_NETWORK_REQUESTS = 500;
const MAX_RECENT_DIALOGS = 20;
const OBSERVED_DIALOG_TIMEOUT_MS = 12e4;
const cachedByCdpUrl = /* @__PURE__ */ new Map();
const connectingByCdpUrl = /* @__PURE__ */ new Map();
const blockedTargetsByCdpUrl = /* @__PURE__ */ new Set();
const blockedPageRefsByCdpUrl = /* @__PURE__ */ new Map();
function resolveObservedDialogTimeoutMs(timeoutMs) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(1, Math.floor(parsed ?? OBSERVED_DIALOG_TIMEOUT_MS));
}
function normalizeCdpUrl(raw) {
	return raw.replace(/\/$/, "");
}
function resolveCdpConnectRetryDelayMs(attempt) {
	return 250 + attempt * 250;
}
function buildManagedDownloadPath(fileName) {
	const id = crypto.randomUUID();
	const safeName = sanitizeUntrustedFileName(fileName, "download.bin");
	return path.join(DEFAULT_DOWNLOAD_DIR, `${id}-${safeName}`);
}
function hasCachedPlaywrightBrowserConnection(cdpUrl) {
	return cachedByCdpUrl.has(normalizeCdpUrl(cdpUrl));
}
function isRecoverablePlaywrightDisconnectError(err) {
	const message = formatErrorMessage(err).toLowerCase();
	return message.includes("target page, context or browser has been closed") || message.includes("browser has been closed") || message.includes("browser disconnected") || message.includes("target closed") || message.includes("connection closed") || message.includes("websocket closed") || message.includes("cdp socket closed");
}
function isRecoverableStalePageSelectionError(err, reusedCachedBrowser) {
	if (!reusedCachedBrowser) return false;
	if (err instanceof Error && err.message.includes("No pages available in the connected browser.")) return true;
	if (err instanceof BrowserTabNotFoundError) return true;
	return (err instanceof Error ? err.message : formatErrorMessage(err)).toLowerCase().includes("tab not found");
}
function findNetworkRequestById(state, id) {
	for (let i = state.requests.length - 1; i >= 0; i -= 1) {
		const candidate = state.requests[i];
		if (candidate && candidate.id === id) return candidate;
	}
}
function appendRecentDialog(state, record) {
	state.recentDialogs.push(record);
	while (state.recentDialogs.length > MAX_RECENT_DIALOGS) state.recentDialogs.shift();
}
function serializeDialogRecord(dialog) {
	return {
		id: dialog.id,
		type: dialog.type,
		message: dialog.message,
		...dialog.defaultValue !== void 0 ? { defaultValue: dialog.defaultValue } : {},
		openedAt: dialog.openedAt,
		...dialog.closedAt !== void 0 ? { closedAt: dialog.closedAt } : {},
		...dialog.closedBy !== void 0 ? { closedBy: dialog.closedBy } : {}
	};
}
function serializePendingDialog(dialog) {
	return serializeDialogRecord(dialog);
}
function serializeObservedBrowserState(state) {
	return { dialogs: {
		pending: state.pendingDialogs.map(serializePendingDialog),
		recent: state.recentDialogs.map(serializeDialogRecord)
	} };
}
function clearArmedDialogResponse(state) {
	if (state.armedDialogResponse?.timer) clearTimeout(state.armedDialogResponse.timer);
	state.armedDialogResponse = void 0;
}
function abortActionsBlockedByDialog(state) {
	if (state.dialogAbortControllers.size === 0) return;
	const err = new BrowserObservedDialogBlockedError(serializeObservedBrowserState(state));
	for (const controller of state.dialogAbortControllers) if (!controller.signal.aborted) controller.abort(err);
	state.dialogAbortControllers.clear();
}
function isNoDialogShowingError(err) {
	return (err instanceof Error ? err.message : String(err)).toLowerCase().includes("no dialog is showing");
}
async function settleObservedDialog(params) {
	const { state, pending } = params;
	state.pendingDialogs = state.pendingDialogs.filter((dialog) => dialog.id !== pending.id);
	let closedBy = params.closedBy;
	try {
		if (params.accept) await pending.dialog.accept(params.promptText);
		else await pending.dialog.dismiss();
	} catch (err) {
		if (!isNoDialogShowingError(err)) {
			if (params.closedBy === "agent") state.pendingDialogs.push(pending);
			throw err;
		}
		closedBy = "remote";
	}
	const record = {
		id: pending.id,
		type: pending.type,
		message: pending.message,
		...pending.defaultValue !== void 0 ? { defaultValue: pending.defaultValue } : {},
		openedAt: pending.openedAt,
		closedAt: (/* @__PURE__ */ new Date()).toISOString(),
		closedBy
	};
	appendRecentDialog(state, record);
	return record;
}
function observeDialog(pageState, dialog) {
	pageState.nextObservedDialogId += 1;
	const type = dialog.type();
	const defaultValue = dialog.defaultValue();
	const pending = {
		id: `d${pageState.nextObservedDialogId}`,
		type,
		message: dialog.message(),
		openedAt: (/* @__PURE__ */ new Date()).toISOString(),
		dialog,
		...type === "prompt" ? { defaultValue } : {}
	};
	pageState.pendingDialogs.push(pending);
	const armed = pageState.armedDialogResponse;
	if (armed && isFutureDateTimestampMs(armed.expiresAt)) {
		clearArmedDialogResponse(pageState);
		settleObservedDialog({
			state: pageState,
			pending,
			accept: armed.accept,
			...armed.promptText !== void 0 ? { promptText: armed.promptText } : {},
			closedBy: "armed"
		}).catch(() => {});
		return;
	}
	if (armed) clearArmedDialogResponse(pageState);
	abortActionsBlockedByDialog(pageState);
}
function targetKey(cdpUrl, targetId) {
	return `${normalizeCdpUrl(cdpUrl)}::${targetId}`;
}
function roleRefsKey(cdpUrl, targetId) {
	return targetKey(cdpUrl, targetId);
}
function isBlockedTarget(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return false;
	return blockedTargetsByCdpUrl.has(targetKey(cdpUrl, normalizedTargetId));
}
function markTargetBlocked(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return;
	blockedTargetsByCdpUrl.add(targetKey(cdpUrl, normalizedTargetId));
}
function clearBlockedTarget(cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId) ?? "";
	if (!normalizedTargetId) return;
	blockedTargetsByCdpUrl.delete(targetKey(cdpUrl, normalizedTargetId));
}
function clearBlockedTargetsForCdpUrl(cdpUrl) {
	if (!cdpUrl) {
		blockedTargetsByCdpUrl.clear();
		return;
	}
	const prefix = `${normalizeCdpUrl(cdpUrl)}::`;
	for (const key of blockedTargetsByCdpUrl) if (key.startsWith(prefix)) blockedTargetsByCdpUrl.delete(key);
}
function blockedPageRefsForCdpUrl(cdpUrl) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const existing = blockedPageRefsByCdpUrl.get(normalized);
	if (existing) return existing;
	const created = /* @__PURE__ */ new WeakSet();
	blockedPageRefsByCdpUrl.set(normalized, created);
	return created;
}
function isBlockedPageRef(cdpUrl, page) {
	return blockedPageRefsByCdpUrl.get(normalizeCdpUrl(cdpUrl))?.has(page) ?? false;
}
function markPageRefBlocked(cdpUrl, page) {
	blockedPageRefsForCdpUrl(cdpUrl).add(page);
}
function clearBlockedPageRefsForCdpUrl(cdpUrl) {
	if (!cdpUrl) {
		blockedPageRefsByCdpUrl.clear();
		return;
	}
	blockedPageRefsByCdpUrl.delete(normalizeCdpUrl(cdpUrl));
}
function clearBlockedPageRef(cdpUrl, page) {
	blockedPageRefsByCdpUrl.get(normalizeCdpUrl(cdpUrl))?.delete(page);
}
function takeCachedPlaywrightBrowserConnection(cdpUrl) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const cur = cachedByCdpUrl.get(normalized);
	cachedByCdpUrl.delete(normalized);
	connectingByCdpUrl.delete(normalized);
	if (!cur) return null;
	if (cur.onDisconnected && typeof cur.browser.off === "function") cur.browser.off("disconnected", cur.onDisconnected);
	return cur;
}
function evictStalePlaywrightBrowserConnection(cdpUrl) {
	takeCachedPlaywrightBrowserConnection(cdpUrl)?.browser.close().catch(() => {});
}
function hasBlockedTargetsForCdpUrl(cdpUrl) {
	const prefix = `${normalizeCdpUrl(cdpUrl)}::`;
	for (const key of blockedTargetsByCdpUrl) if (key.startsWith(prefix)) return true;
	return false;
}
/** Raised when a page target has been quarantined after policy denial. */
var BlockedBrowserTargetError = class extends Error {
	constructor() {
		super("Browser target is unavailable after SSRF policy blocked its navigation.");
		this.name = "BlockedBrowserTargetError";
	}
};
/** Cache role refs for a target id after a snapshot. */
function rememberRoleRefsForTarget(opts) {
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (!targetId) return;
	roleRefsByTarget.set(roleRefsKey(opts.cdpUrl, targetId), {
		refs: opts.refs,
		...opts.frameSelector ? { frameSelector: opts.frameSelector } : {},
		...opts.mode ? { mode: opts.mode } : {}
	});
	while (roleRefsByTarget.size > MAX_ROLE_REFS_CACHE) {
		const first = roleRefsByTarget.keys().next();
		if (first.done) break;
		roleRefsByTarget.delete(first.value);
	}
}
/** Store role refs on the page and target cache. */
function storeRoleRefsForTarget(opts) {
	const state = ensurePageState(opts.page);
	state.roleRefs = opts.refs;
	state.roleRefsFrameSelector = opts.frameSelector;
	state.roleRefsMode = opts.mode;
	const targetId = normalizeOptionalString(opts.targetId);
	if (!targetId) return;
	rememberRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId,
		refs: opts.refs,
		frameSelector: opts.frameSelector,
		mode: opts.mode
	});
}
/** Restore cached role refs onto a newly resolved page. */
function restoreRoleRefsForTarget(opts) {
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (!targetId) return;
	const cached = roleRefsByTarget.get(roleRefsKey(opts.cdpUrl, targetId));
	if (!cached) return;
	const state = ensurePageState(opts.page);
	if (state.roleRefs) return;
	state.roleRefs = cached.refs;
	state.roleRefsFrameSelector = cached.frameSelector;
	state.roleRefsMode = cached.mode;
}
/** Ensure and attach state listeners for a Playwright page. */
function ensurePageState(page) {
	const existing = pageStates.get(page);
	if (existing) return existing;
	const state = {
		console: [],
		errors: [],
		requests: [],
		requestIds: /* @__PURE__ */ new WeakMap(),
		nextRequestId: 0,
		armIdUpload: 0,
		armIdDownload: 0,
		downloadWaiterDepth: 0,
		nextObservedDialogId: 0,
		pendingDialogs: [],
		recentDialogs: [],
		dialogAbortControllers: /* @__PURE__ */ new Set()
	};
	pageStates.set(page, state);
	if (!observedPages.has(page)) {
		observedPages.add(page);
		page.on("console", (msg) => {
			const entry = {
				type: msg.type(),
				text: msg.text(),
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				location: msg.location()
			};
			state.console.push(entry);
			if (state.console.length > MAX_CONSOLE_MESSAGES) state.console.shift();
		});
		page.on("pageerror", (err) => {
			state.errors.push({
				message: err.message || String(err),
				name: err.name || void 0,
				stack: err.stack || void 0,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
			if (state.errors.length > MAX_PAGE_ERRORS) state.errors.shift();
		});
		page.on("request", (req) => {
			state.nextRequestId += 1;
			const id = `r${state.nextRequestId}`;
			state.requestIds.set(req, id);
			state.requests.push({
				id,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				method: req.method(),
				url: req.url(),
				resourceType: req.resourceType()
			});
			if (state.requests.length > MAX_NETWORK_REQUESTS) state.requests.shift();
		});
		page.on("response", (resp) => {
			const req = resp.request();
			const id = state.requestIds.get(req);
			if (!id) return;
			const rec = findNetworkRequestById(state, id);
			if (!rec) return;
			rec.status = resp.status();
			rec.ok = resp.ok();
		});
		page.on("requestfailed", (req) => {
			const id = state.requestIds.get(req);
			if (!id) return;
			const rec = findNetworkRequestById(state, id);
			if (!rec) return;
			rec.failureText = req.failure()?.errorText;
			rec.ok = false;
		});
		page.on("dialog", (dialog) => {
			observeDialog(state, dialog);
		});
		page.on("download", (download) => {
			if (state.downloadWaiterDepth > 0) return;
			const managedPath = buildManagedDownloadPath(sanitizeUntrustedFileName(download.suggestedFilename?.() || "download.bin", "download.bin"));
			const managedSave = (async () => {
				await writeViaSiblingTempPath({
					rootDir: DEFAULT_DOWNLOAD_DIR,
					targetPath: managedPath,
					writeTemp: async (tempPath) => {
						await download.saveAs?.(tempPath);
					}
				});
				return managedPath;
			})();
			managedSave.catch(() => {});
			download.path = async () => await managedSave;
		});
		page.on("close", () => {
			clearArmedDialogResponse(state);
			for (const controller of state.dialogAbortControllers) if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("Page closed before browser action completed."));
			state.dialogAbortControllers.clear();
			state.pendingDialogs = [];
			pageStates.delete(page);
			observedPages.delete(page);
		});
	}
	return state;
}
/** Read observed dialog state from a Playwright page. */
function getObservedBrowserStateForPage(page) {
	return serializeObservedBrowserState(ensurePageState(page));
}
/** Resolve a page and read its observed browser state. */
async function getObservedBrowserStateViaPlaywright(opts) {
	return getObservedBrowserStateForPage(await getPageForTargetId(opts));
}
function resolvePendingDialogForResponse(params) {
	const dialogId = normalizeOptionalString(params.dialogId);
	if (dialogId) {
		const found = params.state.pendingDialogs.find((dialog) => dialog.id === dialogId);
		if (found) return found;
		throw new Error(`Dialog "${dialogId}" is not pending.`);
	}
	if (params.state.pendingDialogs.length === 1) return params.state.pendingDialogs[0];
	if (params.state.pendingDialogs.length > 1) throw new Error("Multiple dialogs are pending; pass dialogId.");
	throw new Error("No dialog is pending.");
}
/** Respond to a pending observed dialog on a page. */
async function respondToObservedDialogOnPage(opts) {
	const state = ensurePageState(opts.page);
	return await settleObservedDialog({
		state,
		pending: resolvePendingDialogForResponse({
			state,
			...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {}
		}),
		accept: opts.accept,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {},
		closedBy: opts.closedBy ?? "agent"
	});
}
/** Resolve a page and respond to one of its observed dialogs. */
async function respondToObservedDialogViaPlaywright(opts) {
	return await respondToObservedDialogOnPage({
		page: await getPageForTargetId(opts),
		accept: opts.accept,
		...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {},
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	});
}
/** Mark pending observed dialogs as handled by a remote/browser-side hook. */
function markObservedDialogsHandledRemotelyForPage(page) {
	const state = ensurePageState(page);
	const pending = state.pendingDialogs.splice(0);
	const closedAt = (/* @__PURE__ */ new Date()).toISOString();
	for (const dialog of pending) appendRecentDialog(state, {
		id: dialog.id,
		type: dialog.type,
		message: dialog.message,
		...dialog.defaultValue !== void 0 ? { defaultValue: dialog.defaultValue } : {},
		openedAt: dialog.openedAt,
		closedAt,
		closedBy: "remote"
	});
	return serializeObservedBrowserState(state);
}
/** Arm a one-shot automatic dialog response for a page. */
function armObservedDialogResponseOnPage(opts) {
	const state = ensurePageState(opts.page);
	clearArmedDialogResponse(state);
	const timeoutMs = resolveObservedDialogTimeoutMs(opts.timeoutMs);
	const expiresAt = resolveExpiresAtMsFromDurationMs(timeoutMs);
	if (expiresAt === void 0) return;
	const response = {
		accept: opts.accept,
		expiresAt,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	};
	response.timer = setTimeout(() => {
		if (state.armedDialogResponse === response) state.armedDialogResponse = void 0;
	}, timeoutMs);
	state.armedDialogResponse = response;
}
/** Create an abort signal that fires while a dialog blocks the page. */
function createObservedDialogAbortSignalForPage(opts) {
	const state = ensurePageState(opts.page);
	const controller = new AbortController();
	const abortForCurrentDialog = () => {
		if (!controller.signal.aborted) controller.abort(new BrowserObservedDialogBlockedError(serializeObservedBrowserState(state)));
	};
	const abortForParent = () => {
		if (!controller.signal.aborted) controller.abort(opts.parentSignal?.reason ?? /* @__PURE__ */ new Error("aborted"));
	};
	if (state.pendingDialogs.length > 0) abortForCurrentDialog();
	else state.dialogAbortControllers.add(controller);
	if (opts.parentSignal) if (opts.parentSignal.aborted) abortForParent();
	else opts.parentSignal.addEventListener("abort", abortForParent, { once: true });
	return {
		signal: controller.signal,
		cleanup: () => {
			state.dialogAbortControllers.delete(controller);
			opts.parentSignal?.removeEventListener("abort", abortForParent);
		}
	};
}
function observeContext(context) {
	if (observedContexts.has(context)) return;
	observedContexts.add(context);
	ensureContextState(context);
	for (const page of context.pages()) ensurePageState(page);
	context.on("page", (page) => ensurePageState(page));
}
/** Ensure shared Playwright browser-context state. */
function ensureContextState(context) {
	const existing = contextStates.get(context);
	if (existing) return existing;
	const state = { traceActive: false };
	contextStates.set(context, state);
	return state;
}
function observeBrowser(browser) {
	for (const context of browser.contexts()) observeContext(context);
}
async function connectBrowser(cdpUrl, ssrfPolicy) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const cached = cachedByCdpUrl.get(normalized);
	if (cached) return cached;
	await assertCdpEndpointAllowed(normalized, ssrfPolicy);
	const connecting = connectingByCdpUrl.get(normalized);
	if (connecting) return await connecting;
	const connectWithRetry = async () => {
		let lastErr;
		for (let attempt = 0; attempt < 3; attempt += 1) try {
			const timeout = 5e3 + attempt * 2e3;
			const endpoint = await getChromeWebSocketUrl(normalized, timeout, ssrfPolicy).catch(() => null) ?? normalized;
			const connectEndpoint = async (target) => {
				const headers = getHeadersWithAuth(target);
				return await withNoProxyForCdpUrl(target, () => chromium.connectOverCDP(target, {
					timeout,
					headers
				}));
			};
			let browser;
			try {
				browser = await connectEndpoint(endpoint);
			} catch (err) {
				if (!isWebSocketUrl(normalized) || endpoint === normalized) throw err;
				browser = await connectEndpoint(normalized);
			}
			const onDisconnected = () => {
				if (cachedByCdpUrl.get(normalized)?.browser === browser) cachedByCdpUrl.delete(normalized);
			};
			const connected = {
				browser,
				cdpUrl: normalized,
				onDisconnected
			};
			cachedByCdpUrl.set(normalized, connected);
			browser.on("disconnected", onDisconnected);
			observeBrowser(browser);
			return connected;
		} catch (err) {
			lastErr = err;
			if (formatErrorMessage(err).includes("rate limit")) break;
			const delay = resolveCdpConnectRetryDelayMs(attempt);
			await new Promise((r) => {
				setTimeout(r, delay);
			});
		}
		if (lastErr instanceof Error) throw lastErr;
		const message = lastErr ? formatErrorMessage(lastErr) : "CDP connect failed";
		throw new Error(message);
	};
	const pending = connectWithRetry().finally(() => {
		connectingByCdpUrl.delete(normalized);
	});
	connectingByCdpUrl.set(normalized, pending);
	return await pending;
}
async function getAllPages(browser) {
	return browser.contexts().flatMap((c) => c.pages());
}
async function partitionAccessiblePages(opts) {
	const accessible = [];
	let blockedCount = 0;
	for (const page of opts.pages) {
		if (isBlockedPageRef(opts.cdpUrl, page)) {
			blockedCount += 1;
			continue;
		}
		const targetId = await pageTargetId(page).catch(() => null);
		if (!targetId) {
			if (hasBlockedTargetsForCdpUrl(opts.cdpUrl)) {
				blockedCount += 1;
				continue;
			}
			accessible.push(page);
			continue;
		}
		if (isBlockedTarget(opts.cdpUrl, targetId)) {
			blockedCount += 1;
			continue;
		}
		accessible.push(page);
	}
	return {
		accessible,
		blockedCount
	};
}
async function pageTargetId(page) {
	const session = await page.context().newCDPSession(page);
	try {
		return (normalizeOptionalString((await session.send("Target.getTargetInfo"))?.targetInfo?.targetId) ?? "") || null;
	} finally {
		await session.detach().catch(() => {});
	}
}
function matchPageByTargetList(pages, targets, targetId) {
	const target = targets.find((entry) => entry.id === targetId);
	if (!target) return null;
	const urlMatch = pages.filter((page) => page.url() === target.url);
	if (urlMatch.length === 1) return urlMatch[0] ?? null;
	if (urlMatch.length > 1) {
		const sameUrlTargets = targets.filter((entry) => entry.url === target.url);
		if (sameUrlTargets.length === urlMatch.length) {
			const idx = sameUrlTargets.findIndex((entry) => entry.id === targetId);
			if (idx >= 0 && idx < urlMatch.length) return urlMatch[idx] ?? null;
		}
	}
	return null;
}
async function findPageByTargetIdViaTargetList(pages, targetId, cdpUrl, ssrfPolicy) {
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(cdpUrl);
	await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
	return matchPageByTargetList(pages, await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), 2e3), targetId);
}
async function findPageByTargetId(browser, targetId, cdpUrl, ssrfPolicy) {
	const pages = await getAllPages(browser);
	let resolvedViaCdp = false;
	for (const page of pages) {
		let tid;
		try {
			tid = await pageTargetId(page);
			resolvedViaCdp = true;
		} catch {
			tid = null;
		}
		if (tid && tid === targetId) return page;
	}
	if (cdpUrl) try {
		return await findPageByTargetIdViaTargetList(pages, targetId, cdpUrl, ssrfPolicy);
	} catch {}
	if (!resolvedViaCdp && pages.length === 1) return pages[0] ?? null;
	return null;
}
async function resolvePageByTargetIdOrThrow(opts) {
	if (isBlockedTarget(opts.cdpUrl, opts.targetId)) throw new BlockedBrowserTargetError();
	const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	const page = await findPageByTargetId(browser, opts.targetId, opts.cdpUrl, opts.ssrfPolicy);
	if (!page) throw new BrowserTabNotFoundError();
	return page;
}
async function getPageForTargetIdOnce(opts) {
	if (opts.targetId && isBlockedTarget(opts.cdpUrl, opts.targetId)) throw new BlockedBrowserTargetError();
	const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	const pages = await getAllPages(browser);
	if (!pages.length) throw new Error("No pages available in the connected browser.");
	const { accessible, blockedCount } = await partitionAccessiblePages({
		cdpUrl: opts.cdpUrl,
		pages
	});
	if (!accessible.length) {
		if (blockedCount > 0) throw new BlockedBrowserTargetError();
		throw new Error("No pages available in the connected browser.");
	}
	const first = accessible[0];
	if (!opts.targetId) return first;
	const found = await findPageByTargetId(browser, opts.targetId, opts.cdpUrl, opts.ssrfPolicy);
	if (found) {
		if (isBlockedPageRef(opts.cdpUrl, found)) throw new BlockedBrowserTargetError();
		const foundTargetId = await pageTargetId(found).catch(() => null);
		if (foundTargetId && isBlockedTarget(opts.cdpUrl, foundTargetId)) throw new BlockedBrowserTargetError();
		return found;
	}
	if (pages.length === 1) return first;
	throw new BrowserTabNotFoundError();
}
/** Resolve a Playwright page by target id, reconnecting once on stale state. */
async function getPageForTargetId(opts) {
	const reusedCachedBrowser = hasCachedPlaywrightBrowserConnection(opts.cdpUrl);
	try {
		return await getPageForTargetIdOnce(opts);
	} catch (err) {
		if (!isRecoverableStalePageSelectionError(err, reusedCachedBrowser)) throw err;
		await closePlaywrightBrowserConnection({ cdpUrl: opts.cdpUrl });
		return await getPageForTargetIdOnce(opts);
	}
}
function isTopLevelNavigationRequest(page, request) {
	let sameMainFrame;
	try {
		sameMainFrame = request.frame() === page.mainFrame();
	} catch {
		sameMainFrame = true;
	}
	if (!sameMainFrame) return false;
	try {
		if (request.isNavigationRequest()) return true;
	} catch {}
	try {
		return request.resourceType() === "document";
	} catch {
		return false;
	}
}
function isSubframeDocumentNavigationRequest(page, request) {
	let sameMainFrame;
	try {
		sameMainFrame = request.frame() === page.mainFrame();
	} catch {
		return true;
	}
	if (sameMainFrame) return false;
	try {
		if (request.isNavigationRequest()) return true;
	} catch {}
	try {
		return request.resourceType() === "document";
	} catch {
		return false;
	}
}
/** Return true when an error is a browser navigation policy denial. */
function isPolicyDenyNavigationError(err) {
	return err instanceof SsrFBlockedError || err instanceof InvalidBrowserNavigationUrlError;
}
async function quarantineBlockedTarget(opts) {
	markPageRefBlocked(opts.cdpUrl, opts.page);
	const resolvedTargetId = await pageTargetId(opts.page).catch(() => null);
	const fallbackTargetId = normalizeOptionalString(opts.targetId) ?? "";
	const targetIdToBlock = resolvedTargetId || fallbackTargetId;
	if (targetIdToBlock) markTargetBlocked(opts.cdpUrl, targetIdToBlock);
}
/** Quarantine and close a tab that OpenClaw navigated to a blocked URL. */
async function closeBlockedNavigationTarget(opts) {
	await quarantineBlockedTarget(opts);
	await opts.page.close().catch(() => {});
}
/** Validate a completed page navigation and quarantine policy-denied targets. */
async function assertPageNavigationCompletedSafely(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	try {
		await assertBrowserNavigationRedirectChainAllowed({
			request: opts.response?.request(),
			...navigationPolicy
		});
		await assertBrowserNavigationResultAllowed({
			url: opts.page.url(),
			...navigationPolicy
		});
	} catch (err) {
		if (isPolicyDenyNavigationError(err)) await quarantineBlockedTarget({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			targetId: opts.targetId
		});
		throw err;
	}
}
async function continueRouteSafely(route) {
	try {
		await route.continue();
	} catch (err) {
		if ((err instanceof Error ? err.message : "").includes("Route is already handled")) return;
		throw err;
	}
}
/** Navigate a page while guarding requested URL and redirect chain. */
async function gotoPageWithNavigationGuard(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	let blockedError = null;
	const handler = async (route, request) => {
		if (blockedError) {
			await route.abort().catch(() => {});
			return;
		}
		const isTopLevel = isTopLevelNavigationRequest(opts.page, request);
		const isSubframeDocument = !isTopLevel && isSubframeDocumentNavigationRequest(opts.page, request);
		if (!isTopLevel && !isSubframeDocument) {
			await continueRouteSafely(route);
			return;
		}
		try {
			await assertBrowserNavigationAllowed({
				url: request.url(),
				...navigationPolicy
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err)) {
				if (isTopLevel) blockedError = err;
				await route.abort().catch(() => {});
				return;
			}
			throw err;
		}
		await continueRouteSafely(route);
	};
	await opts.page.route("**", handler);
	try {
		const response = await opts.page.goto(opts.url, { timeout: opts.timeoutMs });
		if (blockedError) throw toLintErrorObject$1(blockedError, "Non-Error thrown");
		return response;
	} catch (err) {
		if (blockedError) throw toLintErrorObject$1(blockedError, "Non-Error thrown");
		throw err;
	} finally {
		await opts.page.unroute("**", handler).catch(() => {});
		if (blockedError) await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			targetId: opts.targetId
		});
	}
}
/** Resolve a browser snapshot ref into a Playwright locator. */
function refLocator(page, ref) {
	const normalized = ref.startsWith("@") ? ref.slice(1) : ref.startsWith("ref=") ? ref.slice(4) : ref;
	if (/^e\d+$/.test(normalized)) {
		const state = pageStates.get(page);
		if (state?.roleRefsMode === "aria") return (state.roleRefsFrameSelector ? page.frameLocator(state.roleRefsFrameSelector) : page).locator(`aria-ref=${normalized}`);
		const info = state?.roleRefs?.[normalized];
		if (!info) throw new Error(`Unknown ref "${normalized}". Run a new snapshot and use a ref from that snapshot.`);
		const locAny = state?.roleRefsFrameSelector ? page.frameLocator(state.roleRefsFrameSelector) : page;
		const locator = info.name ? locAny.getByRole(info.role, {
			name: info.name,
			exact: true
		}) : locAny.getByRole(info.role);
		return info.nth !== void 0 ? locator.nth(info.nth) : locator;
	}
	if (AX_REF_PATTERN.test(normalized)) {
		const state = pageStates.get(page);
		const info = state?.roleRefs?.[normalized];
		if (!info) throw new Error(`Unknown ref "${normalized}". Run a new snapshot and use a ref from that snapshot.`);
		const scope = state.roleRefsFrameSelector ? page.frameLocator(state.roleRefsFrameSelector) : page;
		if (info.domMarker) return scope.locator(`[${BROWSER_REF_MARKER_ATTRIBUTE}="${normalized}"]`);
		const locAny = scope;
		const locator = info.name ? locAny.getByRole(info.role, {
			name: info.name,
			exact: true
		}) : locAny.getByRole(info.role);
		return info.nth !== void 0 ? locator.nth(info.nth) : locator;
	}
	return page.locator(`aria-ref=${normalized}`);
}
/** Close one or all cached Playwright browser connections. */
async function closePlaywrightBrowserConnection(opts) {
	const normalized = opts?.cdpUrl ? normalizeCdpUrl(opts.cdpUrl) : null;
	if (normalized) {
		clearBlockedTargetsForCdpUrl(normalized);
		clearBlockedPageRefsForCdpUrl(normalized);
		const cur = takeCachedPlaywrightBrowserConnection(normalized);
		if (!cur) return;
		await cur.browser.close().catch(() => {});
		return;
	}
	const connections = Array.from(cachedByCdpUrl.values());
	clearBlockedTargetsForCdpUrl();
	clearBlockedPageRefsForCdpUrl();
	cachedByCdpUrl.clear();
	connectingByCdpUrl.clear();
	for (const cur of connections) {
		if (cur.onDisconnected && typeof cur.browser.off === "function") cur.browser.off("disconnected", cur.onDisconnected);
		await cur.browser.close().catch(() => {});
	}
}
function cdpSocketNeedsAttach(wsUrl) {
	try {
		const pathname = new URL(wsUrl).pathname;
		return pathname === "/cdp" || pathname.endsWith("/cdp") || pathname.includes("/devtools/browser/");
	} catch {
		return false;
	}
}
async function tryTerminateExecutionViaCdp(opts) {
	await assertCdpEndpointAllowed(opts.cdpUrl, opts.ssrfPolicy);
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(opts.cdpUrl);
	const pages = await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), 2e3, void 0, opts.ssrfPolicy).catch(() => null);
	if (!pages || pages.length === 0) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	const wsUrlRaw = normalizeOptionalString(pages.find((p) => normalizeOptionalString(p.id) === targetId)?.webSocketDebuggerUrl) ?? "";
	if (!wsUrlRaw) return;
	const wsUrl = normalizeCdpWsUrl(wsUrlRaw, cdpHttpBase);
	await assertCdpEndpointAllowed(wsUrl, opts.ssrfPolicy);
	const needsAttach = cdpSocketNeedsAttach(wsUrl);
	const runWithTimeout = async (work, ms) => {
		let timer;
		const timeoutPromise = new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error("CDP command timed out")), ms);
		});
		try {
			return await Promise.race([work, timeoutPromise]);
		} finally {
			if (timer) clearTimeout(timer);
		}
	};
	await withCdpSocket(wsUrl, async (send) => {
		let sessionId;
		try {
			if (needsAttach) {
				const attachedSessionId = normalizeOptionalString((await runWithTimeout(send("Target.attachToTarget", {
					targetId: opts.targetId,
					flatten: true
				}), 1500))?.sessionId);
				if (attachedSessionId) sessionId = attachedSessionId;
			}
			await runWithTimeout(send("Runtime.terminateExecution", void 0, sessionId), 1500);
			if (sessionId) send("Target.detachFromTarget", { sessionId }).catch(() => {});
		} catch {}
	}, { handshakeTimeoutMs: 2e3 }).catch(() => {});
}
/**
* Best-effort cancellation for stuck page operations.
*
* Playwright serializes CDP commands per page; a long-running or stuck operation (notably evaluate)
* can block all subsequent commands. We cannot safely "cancel" an individual command, and we do
* not want to close the actual Chromium tab. Instead, we disconnect Playwright's CDP connection
* so in-flight commands fail fast and the next request reconnects transparently.
*
* IMPORTANT: We CANNOT call Connection.close() because Playwright shares a single Connection
* across all objects (BrowserType, Browser, etc.). Closing it corrupts the entire Playwright
* instance, preventing reconnection.
*
* Instead we:
* 1. Null out `cached` so the next call triggers a fresh connectOverCDP
* 2. Fire-and-forget browser.close() — it may hang but won't block us
* 3. The next connectBrowser() creates a completely new CDP WebSocket connection
*
* The old browser.close() eventually resolves when the in-browser evaluate timeout fires,
* or the old connection gets GC'd. Either way, it doesn't affect the fresh connection.
*/
/** Force-disconnect a Playwright connection to unblock a stuck target operation. */
async function forceDisconnectPlaywrightForTarget(opts) {
	const normalized = normalizeCdpUrl(opts.cdpUrl);
	const cur = takeCachedPlaywrightBrowserConnection(normalized);
	if (!cur) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (targetId) await tryTerminateExecutionViaCdp({
		cdpUrl: normalized,
		targetId,
		ssrfPolicy: opts.ssrfPolicy
	}).catch(() => {});
	cur.browser.close().catch(() => {});
}
async function withPlaywrightSafeReadReconnect(cdpUrl, run) {
	try {
		return await run();
	} catch (err) {
		if (!isRecoverablePlaywrightDisconnectError(err)) throw err;
		evictStalePlaywrightBrowserConnection(cdpUrl);
		return await run();
	}
}
/**
* List all pages/tabs from the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/list is ephemeral.
*/
/** List pages through the persistent Playwright connection. */
async function listPagesViaPlaywright(opts) {
	return await withPlaywrightSafeReadReconnect(opts.cdpUrl, async () => {
		const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
		const pages = await getAllPages(browser);
		const results = [];
		for (const page of pages) {
			if (isBlockedPageRef(opts.cdpUrl, page)) continue;
			let tid;
			try {
				tid = await pageTargetId(page);
			} catch (err) {
				if (isRecoverablePlaywrightDisconnectError(err)) throw err;
				tid = null;
			}
			if (tid && !isBlockedTarget(opts.cdpUrl, tid)) {
				let title = "";
				try {
					title = await page.title();
				} catch (err) {
					if (isRecoverablePlaywrightDisconnectError(err)) throw err;
				}
				let url = "";
				try {
					url = page.url();
				} catch (err) {
					if (isRecoverablePlaywrightDisconnectError(err)) throw err;
				}
				if (!isSelectableCdpBrowserTarget({ url })) continue;
				results.push({
					targetId: tid,
					title,
					url,
					type: "page"
				});
			}
		}
		return results;
	});
}
/**
* Create a new page/tab using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/new is ephemeral.
* Returns the new page's targetId and metadata.
*/
/** Create and optionally navigate a page through Playwright. */
async function createPageViaPlaywright(opts) {
	const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	const context = browser.contexts()[0] ?? await browser.newContext();
	ensureContextState(context);
	const page = await context.newPage();
	ensurePageState(page);
	clearBlockedPageRef(opts.cdpUrl, page);
	const createdTargetId = await pageTargetId(page).catch(() => null);
	clearBlockedTarget(opts.cdpUrl, createdTargetId ?? void 0);
	const targetUrl = opts.url.trim() || "about:blank";
	if (targetUrl !== "about:blank") {
		await assertBrowserNavigationAllowed({
			url: targetUrl,
			...withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode })
		});
		let response = null;
		try {
			response = await gotoPageWithNavigationGuard({
				cdpUrl: opts.cdpUrl,
				page,
				url: targetUrl,
				timeoutMs: 3e4,
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode,
				targetId: createdTargetId ?? void 0
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err) || err instanceof BlockedBrowserTargetError) throw err;
		}
		try {
			await assertPageNavigationCompletedSafely({
				cdpUrl: opts.cdpUrl,
				page,
				response,
				ssrfPolicy: opts.ssrfPolicy,
				browserProxyMode: opts.browserProxyMode,
				targetId: createdTargetId ?? void 0
			});
		} catch (err) {
			if (isPolicyDenyNavigationError(err)) await closeBlockedNavigationTarget({
				cdpUrl: opts.cdpUrl,
				page,
				targetId: createdTargetId ?? void 0
			});
			throw err;
		}
	}
	const tid = createdTargetId || await pageTargetId(page).catch(() => null);
	if (!tid) throw new Error("Failed to get targetId for new page");
	return {
		targetId: tid,
		title: await page.title().catch(() => ""),
		url: page.url(),
		type: "page"
	};
}
/**
* Close a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/close is ephemeral.
*/
/** Close a Playwright page by CDP target id. */
async function closePageByTargetIdViaPlaywright(opts) {
	await (await resolvePageByTargetIdOrThrow(opts)).close();
}
/**
* Focus a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/activate can be ephemeral.
*/
/** Bring a Playwright page to the front by CDP target id. */
async function focusPageByTargetIdViaPlaywright(opts) {
	const page = await resolvePageByTargetIdOrThrow(opts);
	try {
		await page.bringToFront();
	} catch (err) {
		try {
			await withPageScopedCdpClient({
				cdpUrl: opts.cdpUrl,
				page,
				targetId: opts.targetId,
				fn: async (send) => {
					await send("Page.bringToFront");
				}
			});
		} catch {
			throw err;
		}
	}
}
function toLintErrorObject$1(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.activity.ts
/** Returns captured page errors, optionally clearing the per-page buffer. */
async function getPageErrorsViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	const errors = [...state.errors];
	if (opts.clear) state.errors = [];
	return { errors };
}
/** Returns captured network requests, with optional URL substring filtering and clearing. */
async function getNetworkRequestsViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	const raw = [...state.requests];
	const filter = typeof opts.filter === "string" ? opts.filter.trim() : "";
	const requests = filter ? raw.filter((r) => r.url.includes(filter)) : raw;
	if (opts.clear) {
		state.requests = [];
		state.requestIds = /* @__PURE__ */ new WeakMap();
	}
	return { requests };
}
function consolePriority(level) {
	switch (level) {
		case "error": return 3;
		case "warning": return 2;
		case "info":
		case "log": return 1;
		case "debug": return 0;
		default: return 1;
	}
}
/** Returns captured console messages at or above the requested priority level. */
async function getConsoleMessagesViaPlaywright(opts) {
	const state = ensurePageState(await getPageForTargetId(opts));
	if (!opts.level) return [...state.console];
	const min = consolePriority(opts.level);
	return state.console.filter((msg) => consolePriority(msg.type) >= min);
}
//#endregion
//#region extensions/browser/src/browser/output-files.ts
/**
* Browser output file writer.
*
* Validates caller-provided output paths against a root before writing
* screenshots, PDFs, downloads, or traces to disk.
*/
/** Write a browser output file within a caller-selected output root. */
async function writeExternalFileWithinOutputRoot(params) {
	const outputPath = params.path.trim();
	if (!outputPath) throw new Error("output path is required");
	const rootDir = params.rootDir ? path.resolve(params.rootDir) : path.dirname(path.resolve(outputPath));
	await ensureOutputDirectory(rootDir);
	return (await writeExternalFileWithinRoot({
		rootDir,
		path: outputPath,
		write: params.write
	}).catch((err) => {
		if (err instanceof Error && /file not found/i.test(err.message)) throw new Error("output directory changed while writing file");
		throw err;
	})).path;
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.shared.ts
/**
* Shared validation and normalization helpers for Playwright-backed browser
* tool implementations.
*/
let nextUploadArmId = 0;
let nextDownloadArmId = 0;
/** Returns a new monotonic id for the currently armed file upload waiter. */
function bumpUploadArmId() {
	nextUploadArmId += 1;
	return nextUploadArmId;
}
/** Returns a new monotonic id for the currently armed download waiter. */
function bumpDownloadArmId() {
	nextDownloadArmId += 1;
	return nextDownloadArmId;
}
/** Normalizes role refs and raw element refs into the locator id format. */
function requireRef(value) {
	const raw = normalizeOptionalString(value) ?? "";
	const ref = (raw ? parseRoleRef(raw) : null) ?? (raw.startsWith("@") ? raw.slice(1) : raw);
	if (!ref) throw new Error("ref is required");
	return ref;
}
/** Requires either a role ref or CSS selector and returns the trimmed selector mode. */
function requireRefOrSelector(ref, selector) {
	const trimmedRef = normalizeOptionalString(ref) ?? "";
	const trimmedSelector = normalizeOptionalString(selector) ?? "";
	if (!trimmedRef && !trimmedSelector) throw new Error("ref or selector is required");
	return {
		ref: trimmedRef || void 0,
		selector: trimmedSelector || void 0
	};
}
/** Bounds user-facing timeout options to Playwright-safe limits. */
function normalizeTimeoutMs(timeoutMs, fallback) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(500, Math.min(12e4, Math.floor(parsed ?? fallback)));
}
/** Converts common Playwright locator failures into model-actionable messages. */
function toAIFriendlyError(error, selector) {
	const message = formatErrorMessage(error);
	if (message.includes("strict mode violation")) {
		const countMatch = message.match(/resolved to (\d+) elements/);
		const count = countMatch ? countMatch[1] : "multiple";
		return /* @__PURE__ */ new Error(`Selector "${selector}" matched ${count} elements. Run a new snapshot to get updated refs, or use a different ref.`);
	}
	if ((message.includes("Timeout") || message.includes("waiting for")) && (message.includes("to be visible") || message.includes("not visible") || message.includes("waiting for locator("))) return /* @__PURE__ */ new Error(`Element "${selector}" not found or not visible. Run a new snapshot to see current page elements.`);
	if (message.includes("intercepts pointer events") || message.includes("not visible") || message.includes("not receive pointer events")) return /* @__PURE__ */ new Error(`Element "${selector}" is not interactable (hidden or covered). Try scrolling it into view, closing overlays, or re-snapshotting.`);
	return error instanceof Error ? error : new Error(message);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.downloads.ts
/**
* File chooser, dialog, and download helpers for Playwright-backed browser
* tools.
*/
function buildTempDownloadPath(fileName) {
	const id = crypto.randomUUID();
	const safeName = sanitizeUntrustedFileName(fileName, "download.bin");
	return path.join(resolvePreferredOpenClawTmpDir(), "downloads", `${id}-${safeName}`);
}
function createPageDownloadWaiter(page, timeoutMs) {
	const state = ensurePageState(page);
	state.downloadWaiterDepth += 1;
	let done = false;
	let timer;
	let handler;
	let depthReleased = false;
	const cleanup = () => {
		if (!depthReleased) {
			depthReleased = true;
			state.downloadWaiterDepth = Math.max(0, state.downloadWaiterDepth - 1);
		}
		if (timer) clearTimeout(timer);
		timer = void 0;
		if (handler) {
			page.off("download", handler);
			handler = void 0;
		}
	};
	return {
		promise: new Promise((resolve, reject) => {
			handler = (download) => {
				if (done) return;
				done = true;
				cleanup();
				resolve(download);
			};
			page.on("download", handler);
			timer = setTimeout(() => {
				if (done) return;
				done = true;
				cleanup();
				reject(/* @__PURE__ */ new Error("Timeout waiting for download"));
			}, timeoutMs);
		}),
		cancel: () => {
			if (done) return;
			done = true;
			cleanup();
		}
	};
}
async function saveDownloadPayload(download, outPath, rootDir) {
	const suggested = download.suggestedFilename?.() || "download.bin";
	const requestedPath = outPath?.trim();
	const finalPath = await writeExternalFileWithinOutputRoot({
		rootDir,
		path: path.resolve(requestedPath || buildTempDownloadPath(suggested)),
		write: async (tempPath) => {
			await download.saveAs?.(tempPath);
		}
	});
	return {
		url: download.url?.() || "",
		suggestedFilename: suggested,
		path: finalPath
	};
}
async function awaitDownloadPayload(params) {
	try {
		const download = await params.waiter.promise;
		if (params.state.armIdDownload !== params.armId) throw new Error("Download was superseded by another waiter");
		return await saveDownloadPayload(download, params.outPath ?? "", params.rootDir);
	} catch (err) {
		params.waiter.cancel();
		throw err;
	}
}
/** Arms the next page file chooser and fills it with strict existing paths. */
async function armFileUploadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	state.armIdUpload = bumpUploadArmId();
	const armId = state.armIdUpload;
	page.waitForEvent("filechooser", { timeout }).then(async (fileChooser) => {
		if (state.armIdUpload !== armId) return;
		if (!opts.paths?.length) {
			try {
				await page.keyboard.press("Escape");
			} catch {}
			return;
		}
		const uploadPathsResult = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
		if (!uploadPathsResult.ok) {
			try {
				await page.keyboard.press("Escape");
			} catch {}
			return;
		}
		await fileChooser.setFiles(uploadPathsResult.paths);
		try {
			const input = typeof fileChooser.element === "function" ? await Promise.resolve(fileChooser.element()) : null;
			if (input) await input.evaluate((el) => {
				el.dispatchEvent(new Event("input", { bubbles: true }));
				el.dispatchEvent(new Event("change", { bubbles: true }));
			});
		} catch {}
	}).catch(() => {});
}
/** Accepts or dismisses a pending dialog, or arms the next matching dialog response. */
async function armDialogViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	try {
		await respondToObservedDialogOnPage({
			page,
			accept: opts.accept,
			closedBy: "agent",
			...opts.dialogId !== void 0 ? { dialogId: opts.dialogId } : {},
			...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
		});
		return;
	} catch (err) {
		if (opts.dialogId || err instanceof Error && !err.message.includes("No dialog is pending")) throw err;
	}
	armObservedDialogResponseOnPage({
		page,
		accept: opts.accept,
		timeoutMs: timeout,
		...opts.promptText !== void 0 ? { promptText: opts.promptText } : {}
	});
}
/** Waits for the next page download and writes it under the configured output root. */
async function waitForDownloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	state.armIdDownload = bumpDownloadArmId();
	const armId = state.armIdDownload;
	return await awaitDownloadPayload({
		waiter: createPageDownloadWaiter(page, timeout),
		state,
		armId,
		outPath: opts.path,
		rootDir: opts.rootDir
	});
}
/** Clicks an element ref and saves the download triggered by that click. */
async function downloadViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	const state = ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 12e4);
	const ref = requireRef(opts.ref);
	const outPath = opts.path?.trim() ?? "";
	if (!outPath) throw new Error("path is required");
	state.armIdDownload = bumpDownloadArmId();
	const armId = state.armIdDownload;
	const waiter = createPageDownloadWaiter(page, timeout);
	try {
		const locator = refLocator(page, ref);
		try {
			await locator.click({ timeout });
		} catch (err) {
			throw toAIFriendlyError(err, ref);
		}
		return await awaitDownloadPayload({
			waiter,
			state,
			armId,
			outPath,
			rootDir: opts.rootDir
		});
	} catch (err) {
		waiter.cancel();
		throw err;
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.snapshot.ts
/**
* Snapshot, navigation, viewport, close, and PDF helpers for Playwright-backed
* browser tools.
*/
function resolveBoundedTimeoutMs(timeoutMs, fallbackMs, minMs, maxMs) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(minMs, Math.min(maxMs, Math.floor(parsed ?? fallbackMs)));
}
function resolveSnapshotTimeoutMs(timeoutMs) {
	return resolveBoundedTimeoutMs(timeoutMs, 5e3, 500, 6e4);
}
function resolveNavigationTimeoutMs(timeoutMs) {
	return resolveBoundedTimeoutMs(timeoutMs, 2e4, 1e3, 12e4);
}
function resolveViewportDimension(value, label) {
	const dimension = resolveIntegerOption(value, 1, { min: 1 });
	if (dimension > 8192) throw new Error(`viewport ${label} exceeds maximum of ${ACT_MAX_VIEWPORT_DIMENSION}`);
	return dimension;
}
async function collectSnapshotUrls(page) {
	const urls = await page.evaluate(() => {
		const seen = /* @__PURE__ */ new Set();
		const out = [];
		for (const anchor of Array.from(document.querySelectorAll("a[href]"))) {
			const href = anchor instanceof HTMLAnchorElement ? anchor.href : "";
			if (!href || seen.has(href)) continue;
			const text = (anchor.textContent || anchor.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 120) || href;
			seen.add(href);
			out.push({
				text,
				url: href
			});
			if (out.length >= 100) break;
		}
		return out;
	}).catch(() => []);
	return Array.isArray(urls) ? urls : [];
}
function buildStoredAriaRefs(nodes, markedRefs) {
	const refs = {};
	const counts = /* @__PURE__ */ new Map();
	const refsByKey = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		const role = normalizeLowercaseStringOrEmpty(node.role) || "unknown";
		const name = node.name.trim() || void 0;
		const key = `${role}:${name ?? ""}`;
		const nth = counts.get(key) ?? 0;
		counts.set(key, nth + 1);
		const refsForKey = refsByKey.get(key);
		if (refsForKey) refsForKey.push(node.ref);
		else refsByKey.set(key, [node.ref]);
		refs[node.ref] = {
			role,
			...name ? { name } : {},
			...nth > 0 ? { nth } : {},
			...markedRefs.has(node.ref) ? { domMarker: true } : {}
		};
	}
	for (const refsForKey of refsByKey.values()) {
		if (refsForKey.length > 1) continue;
		const ref = refsForKey[0];
		if (ref) delete refs[ref]?.nth;
	}
	return refs;
}
/** Stores aria snapshot refs so later tool calls can resolve stable element refs. */
async function storeAriaSnapshotRefsViaPlaywright(opts) {
	const page = opts.page ?? await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	const markedRefs = await markBackendDomRefsOnPage({
		page,
		refs: opts.nodes.flatMap((node) => typeof node.backendDOMNodeId === "number" ? [{
			ref: node.ref,
			backendDOMNodeId: node.backendDOMNodeId
		}] : [])
	});
	storeRoleRefsForTarget({
		page,
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		refs: buildStoredAriaRefs(opts.nodes, markedRefs),
		mode: "role"
	});
}
async function prepareSnapshotPageViaPlaywright(opts) {
	const page = await getPageForTargetId({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId
	});
	ensurePageState(page);
	if (opts.ssrfPolicy) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	return page;
}
/** Captures a raw accessibility tree snapshot and stores matching role refs. */
async function snapshotAriaViaPlaywright(opts) {
	const limit = resolveIntegerOption(opts.limit, 500, {
		min: 1,
		max: 2e3
	});
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaTimeoutMs = typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) && opts.timeoutMs > 0 ? Math.max(500, Math.min(6e4, Math.floor(opts.timeoutMs))) : void 0;
	const collectAxTree = withPageScopedCdpClient({
		cdpUrl: opts.cdpUrl,
		page,
		targetId: opts.targetId,
		fn: async (send) => {
			await send("Accessibility.enable").catch(() => {});
			return await send("Accessibility.getFullAXTree");
		}
	});
	const res = await (ariaTimeoutMs === void 0 ? collectAxTree : (() => {
		let timer;
		const timeout = new Promise((_, reject) => {
			timer = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`Aria snapshot via Playwright timed out after ${ariaTimeoutMs}ms.`));
			}, ariaTimeoutMs);
			timer.unref?.();
		});
		return Promise.race([collectAxTree, timeout]).finally(() => {
			if (timer) clearTimeout(timer);
		});
	})());
	const formatted = formatAriaSnapshot(Array.isArray(res?.nodes) ? res.nodes : [], limit);
	await storeAriaSnapshotRefsViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		nodes: formatted,
		page
	});
	return { nodes: formatted };
}
/** Captures Playwright's AI aria snapshot with optional URL appendix and truncation. */
async function snapshotAiViaPlaywright(opts) {
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	let snapshot = await page.ariaSnapshot({
		mode: "ai",
		timeout: resolveSnapshotTimeoutMs(opts.timeoutMs)
	});
	if (opts.urls) snapshot = appendSnapshotUrls(snapshot, await collectSnapshotUrls(page));
	const maxChars = opts.maxChars;
	const limit = typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0 ? Math.floor(maxChars) : void 0;
	let truncated = false;
	if (limit && snapshot.length > limit) {
		snapshot = `${snapshot.slice(0, limit)}\n\n[...TRUNCATED - page too large]`;
		truncated = true;
	}
	const built = buildRoleSnapshotFromAiSnapshot(snapshot);
	storeRoleRefsForTarget({
		page,
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		refs: built.refs,
		mode: "aria"
	});
	return truncated ? {
		snapshot,
		truncated,
		refs: built.refs
	} : {
		snapshot,
		refs: built.refs
	};
}
async function finalizeRoleSnapshotViaPlaywright(params) {
	const snapshot = params.urls ? appendSnapshotUrls(params.built.snapshot, await collectSnapshotUrls(params.page)) : params.built.snapshot;
	storeRoleRefsForTarget({
		page: params.page,
		cdpUrl: params.cdpUrl,
		targetId: params.targetId,
		refs: params.built.refs,
		...params.frameSelector ? { frameSelector: params.frameSelector } : {},
		mode: params.mode
	});
	return {
		snapshot,
		refs: params.built.refs,
		stats: getRoleSnapshotStats(snapshot, params.built.refs)
	};
}
/** Captures a role-ref snapshot used by model-facing browser interaction tools. */
async function snapshotRoleViaPlaywright(opts) {
	const page = await prepareSnapshotPageViaPlaywright({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		ssrfPolicy: opts.ssrfPolicy
	});
	const ariaSnapshotTimeout = resolveSnapshotTimeoutMs(opts.timeoutMs);
	if (opts.refsMode === "aria") {
		if (normalizeOptionalString(opts.selector) || normalizeOptionalString(opts.frameSelector)) throw new Error("refs=aria does not support selector/frame snapshots yet.");
		const built = buildRoleSnapshotFromAiSnapshot(await page.ariaSnapshot({
			mode: "ai",
			timeout: ariaSnapshotTimeout
		}), opts.options);
		return await finalizeRoleSnapshotViaPlaywright({
			page,
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			built,
			mode: "aria",
			urls: opts.urls
		});
	}
	const frameSelector = normalizeOptionalString(opts.frameSelector) ?? "";
	const selector = normalizeOptionalString(opts.selector) ?? "";
	const built = buildRoleSnapshotFromAriaSnapshot(await (frameSelector ? selector ? page.frameLocator(frameSelector).locator(selector) : page.frameLocator(frameSelector).locator(":root") : selector ? page.locator(selector) : page.locator(":root")).ariaSnapshot({ timeout: ariaSnapshotTimeout }) ?? "", opts.options);
	return await finalizeRoleSnapshotViaPlaywright({
		page,
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		frameSelector: frameSelector || void 0,
		built,
		mode: "role",
		urls: opts.urls
	});
}
/** Navigates the target page while enforcing browser SSRF policy before and after load. */
async function navigateViaPlaywright(opts) {
	const isRetryableNavigateError = (err) => {
		const msg = typeof err === "string" ? err.toLowerCase() : err instanceof Error ? err.message.toLowerCase() : "";
		return msg.includes("frame has been detached") || msg.includes("target page, context or browser has been closed");
	};
	const url = normalizeOptionalString(opts.url) ?? "";
	if (!url) throw new Error("url is required");
	await assertBrowserNavigationAllowed({
		url,
		...withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode })
	});
	const timeout = resolveNavigationTimeoutMs(opts.timeoutMs);
	let page = await getPageForTargetId(opts);
	ensurePageState(page);
	const navigate = async () => await gotoPageWithNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page,
		url,
		timeoutMs: timeout,
		ssrfPolicy: opts.ssrfPolicy,
		browserProxyMode: opts.browserProxyMode,
		targetId: opts.targetId
	});
	let response;
	try {
		response = await navigate();
	} catch (err) {
		if (!isRetryableNavigateError(err)) throw err;
		await forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "retry navigate after detached frame"
		}).catch(() => {});
		page = await getPageForTargetId(opts);
		ensurePageState(page);
		response = await navigate();
	}
	try {
		await assertPageNavigationCompletedSafely({
			cdpUrl: opts.cdpUrl,
			page,
			response,
			ssrfPolicy: opts.ssrfPolicy,
			browserProxyMode: opts.browserProxyMode,
			targetId: opts.targetId
		});
	} catch (err) {
		if (isPolicyDenyNavigationError(err)) await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page,
			targetId: opts.targetId
		});
		throw err;
	}
	return { url: page.url() };
}
/** Resizes the target page viewport within the browser action policy bounds. */
async function resizeViewportViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.setViewportSize({
		width: resolveViewportDimension(opts.width, "width"),
		height: resolveViewportDimension(opts.height, "height")
	});
}
/** Closes the target Playwright page. */
async function closePageViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.close();
}
/** Renders the target page to a PDF buffer. */
async function pdfViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { buffer: await page.pdf({ printBackground: true }) };
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.ts
/**
* Playwright-backed browser interaction tools, including clicks, form input,
* screenshots, batch actions, and SSRF-aware post-interaction navigation checks.
*/
const INTERACTION_NAVIGATION_GRACE_MS = 250;
const pendingInteractionNavigationGuardCleanup = /* @__PURE__ */ new WeakMap();
function resolveBoundedDelayMs(value, label, maxMs) {
	const normalized = Math.floor(value ?? 0);
	if (!Number.isFinite(normalized) || normalized < 0) throw new Error(`${label} must be >= 0`);
	if (normalized > maxMs) throw new Error(`${label} exceeds maximum of ${maxMs}ms`);
	return normalized;
}
async function getRestoredPageForTarget(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	return page;
}
function toFriendlyInteractionError(err, label) {
	return isBrowserObservedDialogBlockedError(err) ? err : toAIFriendlyError(err, label);
}
function reconcileRemoteDialogAfterActionSettled(page, signal) {
	if (isBrowserObservedDialogBlockedError(signal?.reason)) markObservedDialogsHandledRemotelyForPage(page);
}
const resolveInteractionTimeoutMs = resolveActInteractionTimeoutMs;
function didCrossDocumentUrlChange(page, previousUrl) {
	const currentUrl = page.url();
	if (currentUrl === previousUrl) return false;
	try {
		const prev = new URL(previousUrl);
		const curr = new URL(currentUrl);
		if (prev.origin === curr.origin && prev.pathname === curr.pathname && prev.search === curr.search) return false;
	} catch {}
	return true;
}
function isHashOnlyNavigation(currentUrl, previousUrl) {
	if (currentUrl === previousUrl) return false;
	try {
		const prev = new URL(previousUrl);
		const curr = new URL(currentUrl);
		return prev.origin === curr.origin && prev.pathname === curr.pathname && prev.search === curr.search;
	} catch {
		return false;
	}
}
function isMainFrameNavigation(page, frame) {
	if (typeof page.mainFrame !== "function") return true;
	return frame === page.mainFrame();
}
async function assertSubframeNavigationAllowed(frameUrl, ssrfPolicy) {
	if (!ssrfPolicy || !frameUrl.startsWith("http://") && !frameUrl.startsWith("https://")) return;
	await assertBrowserNavigationResultAllowed({
		url: frameUrl,
		...withBrowserNavigationPolicy(ssrfPolicy)
	});
}
function snapshotNetworkFrameUrl(frame) {
	try {
		const frameUrl = frame.url();
		return frameUrl.startsWith("http://") || frameUrl.startsWith("https://") ? frameUrl : null;
	} catch {
		return null;
	}
}
async function assertObservedDelayedNavigations(opts) {
	let subframeError;
	try {
		for (const frameUrl of opts.observed.subframes) await assertSubframeNavigationAllowed(frameUrl, opts.ssrfPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (opts.observed.mainFrameNavigated) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toLintErrorObject(subframeError, "Non-Error thrown");
}
function observeDelayedInteractionNavigation(page, previousUrl) {
	if (didCrossDocumentUrlChange(page, previousUrl)) return Promise.resolve({
		mainFrameNavigated: true,
		subframes: []
	});
	if (typeof page.on !== "function" || typeof page.off !== "function") return Promise.resolve({
		mainFrameNavigated: false,
		subframes: []
	});
	return new Promise((resolve) => {
		const subframes = [];
		const onFrameNavigated = (frame) => {
			if (!isMainFrameNavigation(page, frame)) {
				const frameUrl = snapshotNetworkFrameUrl(frame);
				if (frameUrl) subframes.push(frameUrl);
				return;
			}
			if (isHashOnlyNavigation(page.url(), previousUrl)) return;
			cleanup();
			resolve({
				mainFrameNavigated: true,
				subframes
			});
		};
		const timeout = setTimeout(() => {
			cleanup();
			resolve({
				mainFrameNavigated: didCrossDocumentUrlChange(page, previousUrl),
				subframes
			});
		}, INTERACTION_NAVIGATION_GRACE_MS);
		const cleanup = () => {
			clearTimeout(timeout);
			page.off("framenavigated", onFrameNavigated);
		};
		page.on("framenavigated", onFrameNavigated);
	});
}
function scheduleDelayedInteractionNavigationGuard(opts) {
	if (!opts.ssrfPolicy) return Promise.resolve();
	const page = opts.page;
	if (didCrossDocumentUrlChange(page, opts.previousUrl)) return assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	if (typeof page.on !== "function" || typeof page.off !== "function") return Promise.resolve();
	pendingInteractionNavigationGuardCleanup.get(opts.page)?.();
	return new Promise((resolve, reject) => {
		const settle = (err) => {
			cleanup();
			if (err) {
				reject(toLintErrorObject(err, "Non-Error rejection"));
				return;
			}
			resolve();
		};
		const subframes = [];
		const onFrameNavigated = (frame) => {
			if (!isMainFrameNavigation(page, frame)) {
				const frameUrl = snapshotNetworkFrameUrl(frame);
				if (frameUrl) subframes.push(frameUrl);
				return;
			}
			if (isHashOnlyNavigation(page.url(), opts.previousUrl)) return;
			cleanup();
			assertObservedDelayedNavigations({
				cdpUrl: opts.cdpUrl,
				page: opts.page,
				ssrfPolicy: opts.ssrfPolicy,
				targetId: opts.targetId,
				observed: {
					mainFrameNavigated: true,
					subframes
				}
			}).then(() => settle(), settle);
		};
		const timeout = setTimeout(() => {
			cleanup();
			assertObservedDelayedNavigations({
				cdpUrl: opts.cdpUrl,
				page: opts.page,
				ssrfPolicy: opts.ssrfPolicy,
				targetId: opts.targetId,
				observed: {
					mainFrameNavigated: didCrossDocumentUrlChange(page, opts.previousUrl),
					subframes
				}
			}).then(() => settle(), settle);
		}, INTERACTION_NAVIGATION_GRACE_MS);
		const cleanup = () => {
			clearTimeout(timeout);
			page.off("framenavigated", onFrameNavigated);
			if (pendingInteractionNavigationGuardCleanup.get(opts.page) === settle) pendingInteractionNavigationGuardCleanup.delete(opts.page);
		};
		pendingInteractionNavigationGuardCleanup.set(opts.page, settle);
		page.on("framenavigated", onFrameNavigated);
	});
}
async function assertInteractionNavigationCompletedSafely(opts) {
	if (!opts.ssrfPolicy) return await opts.action();
	const navPage = opts.page;
	let navigatedDuringAction = false;
	const subframeNavigationsDuringAction = [];
	const onFrameNavigated = (frame) => {
		if (!isMainFrameNavigation(navPage, frame)) {
			const frameUrl = snapshotNetworkFrameUrl(frame);
			if (frameUrl) subframeNavigationsDuringAction.push(frameUrl);
			return;
		}
		if (!isHashOnlyNavigation(opts.page.url(), opts.previousUrl)) navigatedDuringAction = true;
	};
	if (typeof navPage.on === "function") navPage.on("framenavigated", onFrameNavigated);
	let result;
	let actionError = null;
	try {
		result = await opts.action();
	} catch (err) {
		actionError = err;
	} finally {
		if (typeof navPage.off === "function") navPage.off("framenavigated", onFrameNavigated);
	}
	const navigationObserved = navigatedDuringAction || didCrossDocumentUrlChange(opts.page, opts.previousUrl);
	let subframeError;
	try {
		for (const frameUrl of subframeNavigationsDuringAction) await assertSubframeNavigationAllowed(frameUrl, opts.ssrfPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (navigationObserved) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	else if (actionError) {
		const observed = await observeDelayedInteractionNavigation(opts.page, opts.previousUrl);
		if (observed.mainFrameNavigated || observed.subframes.length > 0) await assertObservedDelayedNavigations({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId,
			observed
		});
	} else await scheduleDelayedInteractionNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		previousUrl: opts.previousUrl,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toLintErrorObject(subframeError, "Non-Error thrown");
	if (actionError) throw toLintErrorObject(actionError, "Non-Error thrown");
	return result;
}
async function awaitActionWithAbort(actionPromise, abortPromise, onActionResolvedAfterAbort) {
	if (!abortPromise) return await actionPromise;
	try {
		return await Promise.race([actionPromise, abortPromise]);
	} catch (err) {
		actionPromise.then(() => onActionResolvedAfterAbort?.(), () => {});
		throw err;
	}
}
function createAbortPromise(signal) {
	return createAbortPromiseWithListener(signal);
}
function createAbortPromiseWithListener(signal, onAbort) {
	if (!signal) return { cleanup: () => {} };
	let abortListener;
	const abortPromise = signal.aborted ? (() => {
		onAbort?.(signal.reason);
		return Promise.reject(toLintErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
	})() : new Promise((_, reject) => {
		abortListener = () => {
			onAbort?.(signal.reason);
			reject(toLintErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
		};
		signal.addEventListener("abort", abortListener, { once: true });
	});
	abortPromise.catch(() => {});
	return {
		abortPromise,
		cleanup: () => {
			if (abortListener) signal.removeEventListener("abort", abortListener);
		}
	};
}
/** Highlights a role ref in the target page for visual inspection. */
async function highlightViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const ref = requireRef(opts.ref);
	try {
		await refLocator(page, ref).highlight();
	} catch (err) {
		throw toFriendlyInteractionError(err, ref);
	}
}
/** Clicks or double-clicks a role ref or selector with dialog and navigation guards. */
async function clickViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const timeout = resolveInteractionTimeoutMs(opts.timeoutMs);
	const previousUrl = page.url();
	const signal = opts.signal;
	let abortListener;
	let abortReject;
	let abortPromise;
	if (signal) {
		abortPromise = new Promise((_, reject) => {
			abortReject = reject;
		});
		abortPromise.catch(() => {});
		const disconnect = () => {
			if (isBrowserObservedDialogBlockedError(signal.reason)) return;
			forceDisconnectPlaywrightForTarget({
				cdpUrl: opts.cdpUrl,
				targetId: opts.targetId,
				ssrfPolicy: opts.ssrfPolicy,
				reason: "click aborted"
			}).catch(() => {});
		};
		if (signal.aborted) {
			disconnect();
			throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
		}
		abortListener = () => {
			disconnect();
			abortReject?.(signal.reason ?? /* @__PURE__ */ new Error("aborted"));
		};
		signal.addEventListener("abort", abortListener, { once: true });
		if (signal.aborted) {
			abortListener();
			throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
		}
	}
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
	try {
		await assertInteractionNavigationCompletedSafely({
			action: async () => {
				const delayMs = resolveBoundedDelayMs(opts.delayMs, "click delayMs", ACT_MAX_CLICK_DELAY_MS);
				if (delayMs > 0) {
					await awaitActionWithAbort(locator.hover({ timeout }), abortPromise, reconcileRemoteDialog);
					await new Promise((resolve) => {
						setTimeout(resolve, delayMs);
					});
				}
				if (opts.doubleClick) {
					await awaitActionWithAbort(locator.dblclick({
						timeout,
						button: opts.button,
						modifiers: opts.modifiers
					}), abortPromise, reconcileRemoteDialog);
					return;
				}
				await awaitActionWithAbort(locator.click({
					timeout,
					button: opts.button,
					modifiers: opts.modifiers
				}), abortPromise, reconcileRemoteDialog);
			},
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		if (signal && abortListener) signal.removeEventListener("abort", abortListener);
	}
}
/** Clicks absolute page coordinates with optional double-click and navigation guard. */
async function clickCoordsViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const previousUrl = page.url();
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	await assertInteractionNavigationCompletedSafely({
		action: async () => {
			await awaitActionWithAbort(page.mouse.click(opts.x, opts.y, {
				button: opts.button,
				clickCount: opts.doubleClick ? 2 : 1,
				delay: resolveBoundedDelayMs(opts.delayMs, "clickCoords delayMs", ACT_MAX_CLICK_DELAY_MS)
			}), abortPromise, reconcileRemoteDialog);
		},
		cdpUrl: opts.cdpUrl,
		page,
		previousUrl,
		ssrfPolicy: opts.ssrfPolicy,
		targetId: opts.targetId
	}).finally(cleanup);
}
/** Hovers a role ref or selector on the target page. */
async function hoverViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitActionWithAbort(locator.hover({ timeout: resolveInteractionTimeoutMs(opts.timeoutMs) }), abortPromise, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
/** Drags from one role ref or selector to another. */
async function dragViaPlaywright(opts) {
	const resolvedStart = requireRefOrSelector(opts.startRef, opts.startSelector);
	const resolvedEnd = requireRefOrSelector(opts.endRef, opts.endSelector);
	const page = await getRestoredPageForTarget(opts);
	const startLocator = resolvedStart.ref ? refLocator(page, requireRef(resolvedStart.ref)) : page.locator(resolvedStart.selector);
	const endLocator = resolvedEnd.ref ? refLocator(page, requireRef(resolvedEnd.ref)) : page.locator(resolvedEnd.selector);
	const startLabel = resolvedStart.ref ?? resolvedStart.selector;
	const endLabel = resolvedEnd.ref ?? resolvedEnd.selector;
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitActionWithAbort(startLocator.dragTo(endLocator, { timeout: resolveInteractionTimeoutMs(opts.timeoutMs) }), abortPromise, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, `${startLabel} -> ${endLabel}`);
	} finally {
		cleanup();
	}
}
/** Selects one or more option values on a select-like element. */
async function selectOptionViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	if (!opts.values?.length) throw new Error("values are required");
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const previousUrl = page.url();
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await assertInteractionNavigationCompletedSafely({
			action: async () => {
				await awaitActionWithAbort(locator.selectOption(opts.values, { timeout: resolveInteractionTimeoutMs(opts.timeoutMs) }), abortPromise, reconcileRemoteDialog);
			},
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
/** Presses a keyboard key against a ref, selector, or focused page. */
async function pressKeyViaPlaywright(opts) {
	const key = normalizeOptionalString(opts.key) ?? "";
	if (!key) throw new Error("key is required");
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const previousUrl = page.url();
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await assertInteractionNavigationCompletedSafely({
			action: async () => {
				await awaitActionWithAbort(page.keyboard.press(key, { delay: resolveNonNegativeIntegerOption(opts.delayMs, 0) }), abortPromise, reconcileRemoteDialog);
			},
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
	} finally {
		cleanup();
	}
}
/** Types text into a ref, selector, or focused page. */
async function typeViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const text = opts.text ?? "";
	const page = await getRestoredPageForTarget(opts);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const timeout = resolveInteractionTimeoutMs(opts.timeoutMs);
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		const previousUrl = page.url();
		if (opts.slowly) await assertInteractionNavigationCompletedSafely({
			action: async () => {
				await awaitActionWithAbort(locator.click({ timeout }), abortPromise, reconcileRemoteDialog);
				await awaitActionWithAbort(locator.type(text, {
					timeout,
					delay: 75
				}), abortPromise, reconcileRemoteDialog);
				if (opts.submit) await awaitActionWithAbort(locator.press("Enter", { timeout }), abortPromise, reconcileRemoteDialog);
			},
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
		else await assertInteractionNavigationCompletedSafely({
			action: async () => {
				await awaitActionWithAbort(locator.fill(text, { timeout }), abortPromise, reconcileRemoteDialog);
				if (opts.submit) await awaitActionWithAbort(locator.press("Enter", { timeout }), abortPromise, reconcileRemoteDialog);
			},
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
/** Fills multiple form fields with per-field selector/ref/type support. */
async function fillFormViaPlaywright(opts) {
	const page = await getRestoredPageForTarget(opts);
	const timeout = resolveInteractionTimeoutMs(opts.timeoutMs);
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		for (const field of opts.fields) {
			const ref = field.ref.trim();
			const type = (field.type || "text").trim() || "text";
			const rawValue = field.value;
			const value = typeof rawValue === "string" ? rawValue : typeof rawValue === "number" || typeof rawValue === "boolean" ? String(rawValue) : "";
			if (!ref) continue;
			const locator = refLocator(page, ref);
			if (type === "checkbox" || type === "radio") {
				const checked = rawValue === true || rawValue === 1 || rawValue === "1" || rawValue === "true";
				try {
					const previousUrl = page.url();
					await assertInteractionNavigationCompletedSafely({
						action: async () => {
							await awaitActionWithAbort(locator.setChecked(checked, { timeout }), abortPromise, reconcileRemoteDialog);
						},
						cdpUrl: opts.cdpUrl,
						page,
						previousUrl,
						ssrfPolicy: opts.ssrfPolicy,
						targetId: opts.targetId
					});
				} catch (err) {
					throw toFriendlyInteractionError(err, ref);
				}
				continue;
			}
			try {
				const previousUrl = page.url();
				await assertInteractionNavigationCompletedSafely({
					action: async () => {
						await awaitActionWithAbort(locator.fill(value, { timeout }), abortPromise, reconcileRemoteDialog);
					},
					cdpUrl: opts.cdpUrl,
					page,
					previousUrl,
					ssrfPolicy: opts.ssrfPolicy,
					targetId: opts.targetId
				});
			} catch (err) {
				throw toFriendlyInteractionError(err, ref);
			}
		}
	} finally {
		cleanup();
	}
}
/** Evaluates JavaScript in the page after browser action policy validation. */
async function evaluateViaPlaywright(opts) {
	const fnText = normalizeOptionalString(opts.fn) ?? "";
	if (!fnText) throw new Error("function is required");
	const fnSource = normalizeBrowserEvaluateFunctionSource(fnText, opts.ref ? { argumentName: "el" } : void 0);
	const page = await getRestoredPageForTarget(opts);
	const outerTimeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	let evaluateTimeout = Math.max(1e3, Math.min(12e4, outerTimeout - 500));
	evaluateTimeout = Math.min(evaluateTimeout, outerTimeout);
	const signal = opts.signal;
	const { abortPromise, cleanup } = createAbortPromiseWithListener(signal, (reason) => {
		if (isBrowserObservedDialogBlockedError(reason)) return;
		forceDisconnectPlaywrightForTarget({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			reason: "evaluate aborted"
		}).catch(() => {});
	});
	if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("aborted");
	try {
		const previousUrl = page.url();
		if (opts.ssrfPolicy) await assertPageNavigationCompletedSafely({
			cdpUrl: opts.cdpUrl,
			page,
			response: null,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
		if (opts.ref) {
			const locator = refLocator(page, opts.ref);
			const elementEvaluator = new Function("el", "args", `
        "use strict";
        var fnSource = args.fnSource, timeoutMs = args.timeoutMs;
        try {
          var candidate = eval("(" + fnSource + ")");
          if (typeof candidate !== "function") {
            throw new Error("evaluate source did not produce a function");
          }
          var result = candidate(el);
          if (result && typeof result.then === "function") {
            return Promise.race([
              result,
              new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("evaluate timed out after " + timeoutMs + "ms")); }, timeoutMs);
              })
            ]);
          }
          return result;
        } catch (err) {
          throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));
        }
        `);
			const evalPromise = locator.evaluate(elementEvaluator, {
				fnSource,
				timeoutMs: evaluateTimeout
			});
			const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
			return await assertInteractionNavigationCompletedSafely({
				action: () => awaitActionWithAbort(evalPromise, abortPromise, reconcileRemoteDialog),
				cdpUrl: opts.cdpUrl,
				page,
				previousUrl,
				ssrfPolicy: opts.ssrfPolicy,
				targetId: opts.targetId
			});
		}
		const browserEvaluator = new Function("args", `
        "use strict";
        var fnSource = args.fnSource, timeoutMs = args.timeoutMs;
        try {
          var candidate = eval("(" + fnSource + ")");
          if (typeof candidate !== "function") {
            throw new Error("evaluate source did not produce a function");
          }
          var result = candidate();
          if (result && typeof result.then === "function") {
            return Promise.race([
              result,
              new Promise(function(_, reject) {
                setTimeout(function() { reject(new Error("evaluate timed out after " + timeoutMs + "ms")); }, timeoutMs);
              })
            ]);
          }
          return result;
        } catch (err) {
          throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));
        }
      `);
		const evalPromise = page.evaluate(browserEvaluator, {
			fnSource,
			timeoutMs: evaluateTimeout
		});
		const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, signal);
		return await assertInteractionNavigationCompletedSafely({
			action: () => awaitActionWithAbort(evalPromise, abortPromise, reconcileRemoteDialog),
			cdpUrl: opts.cdpUrl,
			page,
			previousUrl,
			ssrfPolicy: opts.ssrfPolicy,
			targetId: opts.targetId
		});
	} finally {
		cleanup();
	}
}
/** Scrolls a role ref or selector into view. */
async function scrollIntoViewViaPlaywright(opts) {
	const resolved = requireRefOrSelector(opts.ref, opts.selector);
	const page = await getRestoredPageForTarget(opts);
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const label = resolved.ref ?? resolved.selector;
	const locator = resolved.ref ? refLocator(page, requireRef(resolved.ref)) : page.locator(resolved.selector);
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	try {
		await awaitActionWithAbort(locator.scrollIntoViewIfNeeded({ timeout }), abortPromise, reconcileRemoteDialog);
	} catch (err) {
		throw toFriendlyInteractionError(err, label);
	} finally {
		cleanup();
	}
}
/** Waits for load state, timeout, URL, text, ref, or selector conditions. */
async function waitForViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const timeout = resolveActWaitTimeoutMs(opts.timeoutMs);
	const { abortPromise, cleanup } = createAbortPromise(opts.signal);
	const reconcileRemoteDialog = () => reconcileRemoteDialogAfterActionSettled(page, opts.signal);
	const waitForStep = async (stepPromise) => {
		await awaitActionWithAbort(stepPromise, abortPromise, reconcileRemoteDialog);
	};
	try {
		if (typeof opts.timeMs === "number" && Number.isFinite(opts.timeMs)) await waitForStep(page.waitForTimeout(resolveBoundedDelayMs(opts.timeMs, "wait timeMs", ACT_MAX_WAIT_TIME_MS)));
		if (opts.text) await waitForStep(page.getByText(opts.text).first().waitFor({
			state: "visible",
			timeout
		}));
		if (opts.textGone) await waitForStep(page.getByText(opts.textGone).first().waitFor({
			state: "hidden",
			timeout
		}));
		if (opts.selector) {
			const selector = normalizeOptionalString(opts.selector) ?? "";
			if (selector) await waitForStep(page.locator(selector).first().waitFor({
				state: "visible",
				timeout
			}));
		}
		if (opts.url) {
			const url = normalizeOptionalString(opts.url) ?? "";
			if (url) await waitForStep(page.waitForURL(url, { timeout }));
		}
		if (opts.loadState) await waitForStep(page.waitForLoadState(opts.loadState, { timeout }));
		if (opts.fn) {
			const fn = normalizeOptionalString(opts.fn) ?? "";
			if (fn) await waitForStep(page.waitForFunction(fn, { timeout }));
		}
	} finally {
		cleanup();
	}
}
/** Captures a screenshot from the target page or element. */
async function takeScreenshotViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const type = opts.type ?? "png";
	if (opts.ref) {
		if (opts.fullPage) throw new Error("fullPage is not supported for element screenshots");
		return { buffer: await refLocator(page, opts.ref).screenshot({
			type,
			timeout: opts.timeoutMs
		}) };
	}
	if (opts.element) {
		if (opts.fullPage) throw new Error("fullPage is not supported for element screenshots");
		return { buffer: await page.locator(opts.element).first().screenshot({
			type,
			timeout: opts.timeoutMs
		}) };
	}
	return { buffer: await page.screenshot({
		type,
		fullPage: Boolean(opts.fullPage),
		timeout: opts.timeoutMs
	}) };
}
/** Captures a screenshot with Browser plugin labels over interactive elements. */
async function screenshotWithLabelsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	const type = opts.type ?? "png";
	const maxLabels = typeof opts.maxLabels === "number" && Number.isFinite(opts.maxLabels) ? Math.max(1, Math.floor(opts.maxLabels)) : 150;
	const refKey = normalizeOptionalString(opts.ref) ?? void 0;
	const elementSelector = normalizeOptionalString(opts.element) ?? void 0;
	const space = opts.fullPage ? "fullpage" : refKey || elementSelector ? "element" : "viewport";
	const view = await page.evaluate(() => ({
		x: window.scrollX || 0,
		y: window.scrollY || 0,
		width: window.innerWidth || 0,
		height: window.innerHeight || 0
	}));
	const scroll = {
		x: view.x,
		y: view.y
	};
	let elementRect;
	if (space === "element") {
		const box = await resolveElementBoundingBoxForLabels(page, refKey, elementSelector);
		if (!box) throw new Error(`screenshotWithLabelsViaPlaywright: element not found for ${refKey ? `ref="${refKey}"` : `selector="${elementSelector ?? ""}"`}`);
		elementRect = {
			x: box.x + scroll.x,
			y: box.y + scroll.y,
			width: box.width,
			height: box.height
		};
	}
	const refKeys = Object.keys(opts.refs ?? {});
	const inputs = [];
	let bboxFailures = 0;
	for (const ref of refKeys) {
		const box = await refLocator(page, ref).boundingBox().catch(() => null);
		if (!box) {
			bboxFailures += 1;
			continue;
		}
		inputs.push({
			ref,
			role: opts.refs[ref].role,
			name: opts.refs[ref].name,
			doc: {
				x: box.x + scroll.x,
				y: box.y + scroll.y,
				width: box.width,
				height: box.height
			}
		});
	}
	const plan = planAnnotations({
		inputs,
		space,
		scroll,
		viewport: {
			width: view.width,
			height: view.height
		},
		elementRect,
		maxLabels
	});
	try {
		if (plan.overlayItems.length > 0) {
			const captureY = space === "element" ? elementRect?.y : space === "viewport" ? scroll.y : 0;
			await page.evaluate(buildOverlayInjectionScript({
				items: plan.overlayItems,
				captureY
			}));
		}
		return {
			buffer: space === "element" ? await captureElementScreenshotForLabels(page, refKey, elementSelector, type, opts.timeoutMs) : await page.screenshot({
				type,
				fullPage: Boolean(opts.fullPage),
				timeout: opts.timeoutMs
			}),
			labels: plan.overlayItems.length,
			skipped: plan.skipped + bboxFailures,
			annotations: plan.annotations
		};
	} finally {
		await page.evaluate(buildOverlayClearScript()).catch(() => {});
	}
}
async function resolveElementBoundingBoxForLabels(page, refKey, cssSelector) {
	if (refKey) try {
		return await refLocator(page, refKey).boundingBox();
	} catch {
		return null;
	}
	if (cssSelector) try {
		return await page.locator(cssSelector).first().boundingBox();
	} catch {
		return null;
	}
	return null;
}
async function captureElementScreenshotForLabels(page, refKey, cssSelector, type, timeoutMs) {
	if (refKey) return await refLocator(page, refKey).screenshot({
		type,
		timeout: timeoutMs
	});
	if (cssSelector) return await page.locator(cssSelector).first().screenshot({
		type,
		timeout: timeoutMs
	});
	throw new Error("captureElementScreenshotForLabels: requires refKey or cssSelector");
}
/** Sets file inputs for a role ref or selector with strict existing-path checks. */
async function setInputFilesViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	restoreRoleRefsForTarget({
		cdpUrl: opts.cdpUrl,
		targetId: opts.targetId,
		page
	});
	if (!opts.paths.length) throw new Error("paths are required");
	const inputRef = normalizeOptionalString(opts.inputRef) ?? "";
	const element = normalizeOptionalString(opts.element) ?? "";
	if (inputRef && element) throw new Error("inputRef and element are mutually exclusive");
	if (!inputRef && !element) throw new Error("inputRef or element is required");
	const locator = inputRef ? refLocator(page, inputRef) : page.locator(element).first();
	const resolvedResult = await resolveStrictExistingUploadPaths({ requestedPaths: opts.paths });
	if (!resolvedResult.ok) throw new Error(resolvedResult.error);
	const resolvedPaths = resolvedResult.paths;
	try {
		await locator.setInputFiles(resolvedPaths);
	} catch (err) {
		throw toFriendlyInteractionError(err, inputRef || element);
	}
	try {
		const handle = await locator.elementHandle();
		if (handle) await handle.evaluate((el) => {
			el.dispatchEvent(new Event("input", { bubbles: true }));
			el.dispatchEvent(new Event("change", { bubbles: true }));
		});
	} catch {}
}
async function executeSingleAction(action, cdpUrl, targetId, evaluateEnabled, ssrfPolicy, depth = 0, signal) {
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	const effectiveTargetId = action.targetId ?? targetId;
	switch (action.kind) {
		case "click":
			await clickViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				doubleClick: action.doubleClick,
				button: action.button,
				modifiers: action.modifiers,
				delayMs: action.delayMs,
				timeoutMs: action.timeoutMs,
				ssrfPolicy,
				signal
			});
			break;
		case "clickCoords":
			await clickCoordsViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				x: action.x,
				y: action.y,
				doubleClick: action.doubleClick,
				button: action.button,
				delayMs: action.delayMs,
				timeoutMs: action.timeoutMs,
				ssrfPolicy,
				signal
			});
			break;
		case "type":
			await typeViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				text: action.text,
				submit: action.submit,
				slowly: action.slowly,
				timeoutMs: action.timeoutMs,
				ssrfPolicy,
				signal
			});
			break;
		case "press":
			await pressKeyViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				key: action.key,
				delayMs: action.delayMs,
				ssrfPolicy,
				signal
			});
			break;
		case "hover":
			await hoverViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs,
				signal
			});
			break;
		case "scrollIntoView":
			await scrollIntoViewViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				timeoutMs: action.timeoutMs,
				signal
			});
			break;
		case "drag":
			await dragViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				startRef: action.startRef,
				startSelector: action.startSelector,
				endRef: action.endRef,
				endSelector: action.endSelector,
				timeoutMs: action.timeoutMs,
				signal
			});
			break;
		case "select":
			await selectOptionViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ref: action.ref,
				selector: action.selector,
				values: action.values,
				timeoutMs: action.timeoutMs,
				ssrfPolicy,
				signal
			});
			break;
		case "fill":
			await fillFormViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				fields: action.fields,
				timeoutMs: action.timeoutMs,
				ssrfPolicy,
				signal
			});
			break;
		case "resize":
			await resizeViewportViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				width: action.width,
				height: action.height
			});
			break;
		case "wait":
			if (action.fn && !evaluateEnabled) throw new Error("wait --fn is disabled by config (browser.evaluateEnabled=false)");
			await waitForViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				timeMs: action.timeMs,
				text: action.text,
				textGone: action.textGone,
				selector: action.selector,
				url: action.url,
				loadState: action.loadState,
				fn: action.fn,
				timeoutMs: action.timeoutMs,
				signal
			});
			break;
		case "evaluate":
			if (!evaluateEnabled) throw new Error("act:evaluate is disabled by config (browser.evaluateEnabled=false)");
			return await evaluateViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ssrfPolicy,
				fn: action.fn,
				ref: action.ref,
				timeoutMs: action.timeoutMs,
				signal
			});
		case "close":
			await closePageViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId
			});
			break;
		case "batch":
			await batchViaPlaywright({
				cdpUrl,
				targetId: effectiveTargetId,
				ssrfPolicy,
				actions: action.actions,
				stopOnError: action.stopOnError,
				evaluateEnabled,
				depth: depth + 1,
				signal
			});
			break;
		default: throw new Error(`Unsupported batch action kind: ${action.kind}`);
	}
}
/** Executes one high-level browser act request with bounded recursive actions. */
async function executeActViaPlaywright(opts) {
	const dialogAbort = createObservedDialogAbortSignalForPage({
		page: await getPageForTargetId({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy
		}),
		parentSignal: opts.signal
	});
	try {
		if (opts.action.kind === "batch") return { results: (await batchViaPlaywright({
			cdpUrl: opts.cdpUrl,
			targetId: opts.targetId,
			ssrfPolicy: opts.ssrfPolicy,
			actions: opts.action.actions,
			stopOnError: opts.action.stopOnError,
			evaluateEnabled: opts.evaluateEnabled,
			signal: dialogAbort.signal
		})).results };
		const result = await executeSingleAction(opts.action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, opts.ssrfPolicy, 0, dialogAbort.signal);
		if (opts.action.kind === "evaluate") return { result };
		return {};
	} catch (err) {
		if (isBrowserObservedDialogBlockedError(err)) return {
			blockedByDialog: true,
			browserState: err.browserState
		};
		throw err;
	} finally {
		dialogAbort.cleanup();
	}
}
/** Executes a bounded sequence of browser actions and returns per-step results. */
async function batchViaPlaywright(opts) {
	const depth = opts.depth ?? 0;
	if (depth > 5) throw new Error(`Batch nesting depth exceeds maximum of 5`);
	if (opts.actions.length > 100) throw new Error(`Batch exceeds maximum of 100 actions`);
	const results = [];
	for (const action of opts.actions) {
		if (opts.signal?.aborted) throw opts.signal.reason ?? /* @__PURE__ */ new Error("aborted");
		try {
			await executeSingleAction(action, opts.cdpUrl, opts.targetId, opts.evaluateEnabled, opts.ssrfPolicy, depth, opts.signal);
			results.push({ ok: true });
		} catch (err) {
			if (isBrowserObservedDialogBlockedError(err)) throw err;
			const message = formatErrorMessage(err);
			results.push({
				ok: false,
				error: message
			});
			if (opts.stopOnError !== false) break;
		}
	}
	return { results };
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.responses.ts
/**
* Response-body retrieval for Playwright-backed browser tools.
*/
/** Waits for a response URL pattern and returns a bounded text body. */
async function responseBodyViaPlaywright(opts) {
	const pattern = normalizeOptionalString(opts.url) ?? "";
	if (!pattern) throw new Error("url is required");
	const maxChars = typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars) ? Math.max(1, Math.min(5e6, Math.floor(opts.maxChars))) : 2e5;
	const timeout = normalizeTimeoutMs(opts.timeoutMs, 2e4);
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const resp = await new Promise((resolve, reject) => {
		let done = false;
		let timer;
		const cleanup = () => {
			if (timer) clearTimeout(timer);
			timer = void 0;
			if (handler) page.off("response", handler);
		};
		const handler = (resp) => {
			if (done) return;
			if (!matchBrowserUrlPattern(pattern, resp.url?.() || "")) return;
			done = true;
			cleanup();
			resolve(resp);
		};
		page.on("response", handler);
		timer = setTimeout(() => {
			if (done) return;
			done = true;
			cleanup();
			reject(/* @__PURE__ */ new Error(`Response not found for url pattern "${pattern}". Run 'openclaw browser requests' to inspect recent network activity.`));
		}, timeout);
	});
	const url = resp.url?.() || "";
	const status = resp.status?.();
	const headers = resp.headers?.();
	let bodyText = "";
	try {
		if (typeof resp.text === "function") bodyText = await resp.text();
		else if (typeof resp.body === "function") {
			const buf = await resp.body();
			bodyText = new TextDecoder("utf-8").decode(buf);
		}
	} catch (err) {
		throw new Error(`Failed to read response body for "${url}": ${String(err)}`, { cause: err });
	}
	return {
		url,
		status,
		headers,
		body: bodyText.length > maxChars ? bodyText.slice(0, maxChars) : bodyText,
		truncated: bodyText.length > maxChars ? true : void 0
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.state.ts
/**
* Browser context and emulation state helpers for Playwright-backed tools.
*/
const { devices: playwrightDevices } = playwrightCore;
/** Toggles offline mode for the target page context. */
async function setOfflineViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().setOffline(opts.offline);
}
/** Replaces extra HTTP headers for the target page context. */
async function setExtraHTTPHeadersViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().setExtraHTTPHeaders(opts.headers);
}
/** Sets or clears HTTP basic-auth credentials for the target page context. */
async function setHttpCredentialsViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	if (opts.clear) {
		await page.context().setHTTPCredentials(null);
		return;
	}
	const username = opts.username ?? "";
	const password = opts.password ?? "";
	if (!username) throw new Error("username is required (or set clear=true)");
	await page.context().setHTTPCredentials({
		username,
		password
	});
}
/** Sets or clears geolocation and grants page-origin geolocation permission. */
async function setGeolocationViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const context = page.context();
	if (opts.clear) {
		await context.setGeolocation(null);
		await context.clearPermissions().catch(() => {});
		return;
	}
	if (typeof opts.latitude !== "number" || typeof opts.longitude !== "number") throw new Error("latitude and longitude are required (or set clear=true)");
	await context.setGeolocation({
		latitude: opts.latitude,
		longitude: opts.longitude,
		accuracy: typeof opts.accuracy === "number" ? opts.accuracy : void 0
	});
	const origin = normalizeOptionalString(opts.origin) || (() => {
		try {
			return new URL(page.url()).origin;
		} catch {
			return "";
		}
	})();
	if (origin) await context.grantPermissions(["geolocation"], { origin }).catch(() => {});
}
/** Emulates the requested media color scheme on the target page. */
async function emulateMediaViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.emulateMedia({ colorScheme: opts.colorScheme });
}
/** Applies a locale override through page-scoped CDP. */
async function setLocaleViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const locale = normalizeOptionalString(opts.locale) ?? "";
	if (!locale) throw new Error("locale is required");
	await withPageScopedCdpClient({
		cdpUrl: opts.cdpUrl,
		page,
		targetId: opts.targetId,
		fn: async (send) => {
			try {
				await send("Emulation.setLocaleOverride", { locale });
			} catch (err) {
				if (String(err).includes("Another locale override is already in effect")) return;
				throw err;
			}
		}
	});
}
/** Applies a timezone override through page-scoped CDP. */
async function setTimezoneViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const timezoneId = normalizeOptionalString(opts.timezoneId) ?? "";
	if (!timezoneId) throw new Error("timezoneId is required");
	await withPageScopedCdpClient({
		cdpUrl: opts.cdpUrl,
		page,
		targetId: opts.targetId,
		fn: async (send) => {
			try {
				await send("Emulation.setTimezoneOverride", { timezoneId });
			} catch (err) {
				const msg = String(err);
				if (msg.includes("Timezone override is already in effect")) return;
				if (msg.includes("Invalid timezone")) throw new Error(`Invalid timezone ID: ${timezoneId}`, { cause: err });
				throw err;
			}
		}
	});
}
/** Applies a Playwright device descriptor to viewport, user agent, and touch state. */
async function setDeviceViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const name = normalizeOptionalString(opts.name) ?? "";
	if (!name) throw new Error("device name is required");
	const descriptor = playwrightDevices[name];
	if (!descriptor) throw new Error(`Unknown device "${name}".`);
	if (descriptor.viewport) await page.setViewportSize({
		width: descriptor.viewport.width,
		height: descriptor.viewport.height
	});
	await withPageScopedCdpClient({
		cdpUrl: opts.cdpUrl,
		page,
		targetId: opts.targetId,
		fn: async (send) => {
			if (descriptor.userAgent || descriptor.locale) await send("Emulation.setUserAgentOverride", {
				userAgent: descriptor.userAgent ?? "",
				acceptLanguage: descriptor.locale ?? void 0
			});
			if (descriptor.viewport) await send("Emulation.setDeviceMetricsOverride", {
				mobile: Boolean(descriptor.isMobile),
				width: descriptor.viewport.width,
				height: descriptor.viewport.height,
				deviceScaleFactor: descriptor.deviceScaleFactor ?? 1,
				screenWidth: descriptor.viewport.width,
				screenHeight: descriptor.viewport.height
			});
			if (descriptor.hasTouch) await send("Emulation.setTouchEmulationEnabled", { enabled: true });
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.storage.ts
/**
* Cookie and Web Storage helpers for Playwright-backed browser tools.
*/
/** Returns cookies visible to the target browser context. */
async function cookiesGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	return { cookies: await page.context().cookies() };
}
/** Adds or replaces a cookie in the target browser context. */
async function cookiesSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const cookie = opts.cookie;
	if (!cookie.name || cookie.value === void 0) throw new Error("cookie name and value are required");
	const hasUrl = typeof cookie.url === "string" && cookie.url.trim();
	const hasDomainPath = typeof cookie.domain === "string" && cookie.domain.trim() && typeof cookie.path === "string" && cookie.path.trim();
	if (!hasUrl && !hasDomainPath) throw new Error("cookie requires url, or domain+path");
	await page.context().addCookies([cookie]);
}
/** Clears cookies in the target browser context. */
async function cookiesClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.context().clearCookies();
}
/** Reads localStorage or sessionStorage values from the target page. */
async function storageGetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const kind = opts.kind;
	const key = readStringValue(opts.key);
	return { values: await page.evaluate(({ kind: kind2, key: key2 }) => {
		const store = kind2 === "session" ? window.sessionStorage : window.localStorage;
		if (key2) {
			const value = store.getItem(key2);
			return value === null ? {} : { [key2]: value };
		}
		const out = {};
		for (let i = 0; i < store.length; i += 1) {
			const k = store.key(i);
			if (!k) continue;
			const v = store.getItem(k);
			if (v !== null) out[k] = v;
		}
		return out;
	}, {
		kind,
		key
	}) ?? {} };
}
/** Writes one localStorage or sessionStorage value on the target page. */
async function storageSetViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	const key = opts.key;
	if (!key) throw new Error("key is required");
	await page.evaluate(({ kind, key: k, value }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).setItem(k, value);
	}, {
		kind: opts.kind,
		key,
		value: opts.value
	});
}
/** Clears localStorage or sessionStorage on the target page. */
async function storageClearViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	ensurePageState(page);
	await page.evaluate(({ kind }) => {
		(kind === "session" ? window.sessionStorage : window.localStorage).clear();
	}, { kind: opts.kind });
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.trace.ts
/**
* Playwright trace lifecycle helpers for Browser plugin diagnostics.
*/
/** Starts Playwright tracing for the target page context. */
async function traceStartViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (ctxState.traceActive) throw new Error("Trace already running. Stop the current trace before starting a new one.");
	await context.tracing.start({
		screenshots: opts.screenshots ?? true,
		snapshots: opts.snapshots ?? true,
		sources: opts.sources ?? false
	});
	ctxState.traceActive = true;
}
/** Stops Playwright tracing and writes the trace zip atomically under trace output. */
async function traceStopViaPlaywright(opts) {
	const context = (await getPageForTargetId(opts)).context();
	const ctxState = ensureContextState(context);
	if (!ctxState.traceActive) throw new Error("No active trace. Start a trace before stopping it.");
	await writeViaSiblingTempPath({
		rootDir: DEFAULT_TRACE_DIR,
		targetPath: opts.path,
		writeTemp: async (tempPath) => {
			await context.tracing.stop({ path: tempPath });
		}
	});
	ctxState.traceActive = false;
}
//#endregion
//#region extensions/browser/src/browser/pw-ai.ts
/**
* Playwright-backed browser helper barrel.
*
* Re-exports session and action helpers used by browser routes when Playwright
* is available for managed or CDP-backed profiles.
*/
markPwAiLoaded();
//#endregion
export { armDialogViaPlaywright, armFileUploadViaPlaywright, batchViaPlaywright, clickViaPlaywright, closePageByTargetIdViaPlaywright, closePageViaPlaywright, closePlaywrightBrowserConnection, cookiesClearViaPlaywright, cookiesGetViaPlaywright, cookiesSetViaPlaywright, createObservedDialogAbortSignalForPage, createPageViaPlaywright, downloadViaPlaywright, dragViaPlaywright, emulateMediaViaPlaywright, ensurePageState, evaluateViaPlaywright, executeActViaPlaywright, fillFormViaPlaywright, focusPageByTargetIdViaPlaywright, forceDisconnectPlaywrightForTarget, getConsoleMessagesViaPlaywright, getNetworkRequestsViaPlaywright, getObservedBrowserStateForPage, getObservedBrowserStateViaPlaywright, getPageErrorsViaPlaywright, getPageForTargetId, highlightViaPlaywright, hoverViaPlaywright, isBrowserObservedDialogBlockedError, listPagesViaPlaywright, markObservedDialogsHandledRemotelyForPage, navigateViaPlaywright, pdfViaPlaywright, pressKeyViaPlaywright, refLocator, resizeViewportViaPlaywright, respondToObservedDialogOnPage, respondToObservedDialogViaPlaywright, responseBodyViaPlaywright, screenshotWithLabelsViaPlaywright, scrollIntoViewViaPlaywright, selectOptionViaPlaywright, setDeviceViaPlaywright, setExtraHTTPHeadersViaPlaywright, setGeolocationViaPlaywright, setHttpCredentialsViaPlaywright, setInputFilesViaPlaywright, setLocaleViaPlaywright, setOfflineViaPlaywright, setTimezoneViaPlaywright, snapshotAiViaPlaywright, snapshotAriaViaPlaywright, snapshotRoleViaPlaywright, storageClearViaPlaywright, storageGetViaPlaywright, storageSetViaPlaywright, storeAriaSnapshotRefsViaPlaywright, takeScreenshotViaPlaywright, traceStartViaPlaywright, traceStopViaPlaywright, typeViaPlaywright, waitForDownloadViaPlaywright, waitForViaPlaywright };
