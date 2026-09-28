import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs, b as parseFiniteNumber, g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { a as asOptionalRecord, u as readStringField } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { b as uniqueValues } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { t as SsrFBlockedError } from "./ssrf-BQRtcdBp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./number-runtime-CGwowceO.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import "./time-runtime-BNzd4jag.mjs";
import { a as createDeferred } from "./extension-shared-N0S3ppSB.mjs";
import "./webhook-ingress-CLBPfE22.mjs";
import { _ as readBrowserDashboardTabs, t as assertBrowserDashboardTabCanClose } from "./session-tab-store-CyxH9Sdj.mjs";
import { i as DEFAULT_BROWSER_ACTION_TIMEOUT_MS } from "./constants-DKjTvIBP.mjs";
import "./act-policy-3Ku82pq-.mjs";
import { d as BrowserTabNotFoundError, o as BrowserError, r as BrowserActionError } from "./errors-CXz-2iKA.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import "./errors-DS4y5mrd.mjs";
import { D as parseRoleRef, F as assertBrowserNavigationResultAllowed, M as InvalidBrowserNavigationUrlError, N as assertBrowserNavigationAllowed, P as assertBrowserNavigationRedirectChainAllowed, R as withBrowserNavigationPolicy, m as AX_REF_PATTERN, n as getChromeWebSocketEndpoint, z as readCdpDocumentIdentities } from "./chrome-BYoc4jk9.mjs";
import { t as DEFAULT_DOWNLOAD_DIR } from "./paths-BD1L9gFZ.mjs";
import { F as withNoProxyForCdpUrl, P as withManagedProxyForCdpUrl, _ as withCdpSocket, a as fetchJson, b as stripCdpUrlCredentials, c as isWebSocketUrl, d as redactCdpErrorText, g as openCdpWebSocket, k as PLAYWRIGHT_TARGET_INFO_TIMEOUT_MS, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, p as scopeCdpPolicyToConfiguredEndpoint, t as appendCdpPath, u as normalizeCdpWsUrl, v as getPlaywrightCore, y as getHeadersWithAuth } from "./cdp.helpers-DHnECuD4.mjs";
import "./ssrf-policy-helpers-BmwvxBcL.mjs";
import "./sdk-setup-tools-Cu4qMD1_.mjs";
import { t as writeExternalFileWithinOutputRoot } from "./output-files-Dg5F90BE.mjs";
import { t as getBorrowedRelayCdpAccess } from "./relay-access-B8A24s4S.mjs";
import { stripVTControlCharacters } from "node:util";
import path from "node:path";
import crypto, { randomUUID } from "node:crypto";
import { Script } from "node:vm";
//#region extensions/browser/src/browser/evaluate-source.ts
const FUNCTION_SOURCE_PATTERN = /^(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/;
const EXPRESSION_RESULT_NAME = "__openclawEvaluateExpressionResult";
function canParseAsExpression(source) {
	try {
		new Script(`"use strict";\n(${source});`);
		return true;
	} catch {
		return false;
	}
}
function normalizeBrowserEvaluateFunctionSource(source, params = {}) {
	const trimmed = source.trim();
	if (!trimmed) return "";
	if (FUNCTION_SOURCE_PATTERN.test(trimmed) && canParseAsExpression(trimmed)) return trimmed;
	const argumentName = params.argumentName;
	const args = argumentName ? `(${argumentName})` : "()";
	if (canParseAsExpression(trimmed)) {
		const invokeArgs = argumentName ? argumentName : "";
		return [
			`${args} => {`,
			`const ${EXPRESSION_RESULT_NAME} = (${trimmed});`,
			`return typeof ${EXPRESSION_RESULT_NAME} === "function" ? ${EXPRESSION_RESULT_NAME}(${invokeArgs}) : ${EXPRESSION_RESULT_NAME};`,
			"}"
		].join("\n");
	}
	return `async ${args} => {\n${trimmed}\n}`;
}
//#endregion
//#region extensions/browser/src/browser/url-pattern.ts
/**
* URL pattern matching for Browser response and wait tools.
*/
function wildcardPatternToRegExp(pattern) {
	let source = "^";
	for (let index = 0; index < pattern.length; index += 1) {
		const char = pattern[index] ?? "";
		if (char === "*") {
			if (pattern[index + 1] === "*") {
				source += ".*";
				index += 1;
			} else source += "[^/]*";
			continue;
		}
		source += char.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&");
	}
	source += "$";
	return new RegExp(source, "u");
}
/** Matches exact, wildcard, or substring URL patterns against a browser URL. */
function matchBrowserUrlPattern(pattern, url) {
	const trimmedPattern = pattern.trim();
	if (!trimmedPattern) return false;
	if (trimmedPattern === url) return true;
	if (trimmedPattern === "*") return true;
	if (trimmedPattern.includes("*")) return wildcardPatternToRegExp(trimmedPattern).test(url);
	return url.includes(trimmedPattern);
}
//#endregion
//#region extensions/browser/src/browser/screenshot-annotate.ts
const ANNOTATION_OVERLAY_ATTR = "data-openclaw-labels";
const ANNOTATION_OVERLAY_ROOT_ID = "__openclaw-annotations__";
function refToNumber(ref) {
	const match = ref.match(/(\d+)/);
	if (!match) return 0;
	const n = Number(match[1]);
	return Number.isFinite(n) ? n : 0;
}
function planAnnotations(params) {
	const maxLabels = params.maxLabels ?? 150;
	if (params.space === "viewport" && !params.scroll) throw new Error("planAnnotations: scroll is required when space is 'viewport'");
	if (params.space === "element" && !params.elementRect) throw new Error("planAnnotations: elementRect is required when space is 'element'");
	let kept = params.inputs;
	if (params.space === "element" && params.elementRect) {
		const er = params.elementRect;
		kept = params.inputs.filter((input) => rectsOverlap(input.doc, er));
	}
	const viewportRect = params.space === "viewport" && params.scroll && params.viewport ? {
		x: params.scroll.x,
		y: params.scroll.y,
		width: params.viewport.width,
		height: params.viewport.height
	} : void 0;
	const overlayItems = [];
	const annotations = [];
	let skipped = 0;
	for (const input of kept) {
		if (viewportRect && !rectsOverlap(input.doc, viewportRect)) {
			skipped += 1;
			annotations.push(toAnnotation(input, params));
			continue;
		}
		if (overlayItems.length >= maxLabels) {
			skipped += 1;
			continue;
		}
		overlayItems.push({
			ref: input.ref,
			x: input.doc.x,
			y: input.doc.y,
			w: input.doc.width,
			h: input.doc.height
		});
		annotations.push(toAnnotation(input, params));
	}
	return {
		overlayItems,
		annotations,
		skipped
	};
}
function toAnnotation(input, params) {
	return {
		ref: input.ref,
		number: refToNumber(input.ref),
		role: input.role,
		...input.name ? { name: input.name } : {},
		box: projectBox(input.doc, params)
	};
}
function projectBox(doc, params) {
	if (params.space === "viewport") {
		const scroll = params.scroll;
		return {
			x: doc.x - scroll.x,
			y: doc.y - scroll.y,
			width: doc.width,
			height: doc.height
		};
	}
	if (params.space === "element") {
		const er = params.elementRect;
		return {
			x: doc.x - er.x,
			y: doc.y - er.y,
			width: doc.width,
			height: doc.height
		};
	}
	return {
		x: doc.x,
		y: doc.y,
		width: doc.width,
		height: doc.height
	};
}
function rectsOverlap(a, b) {
	return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
function buildOverlayInjectionScript(params) {
	const itemsJson = JSON.stringify(params.items.map((it) => ({
		ref: it.ref,
		x: round(it.x),
		y: round(it.y),
		w: Math.max(1, round(it.w)),
		h: Math.max(1, round(it.h))
	})));
	const attr = ANNOTATION_OVERLAY_ATTR;
	const rootId = ANNOTATION_OVERLAY_ROOT_ID;
	return `(() => {
  var items = ${itemsJson};
  var captureY = ${Number.isFinite(params.captureY) ? round(params.captureY ?? 0) : 0};
  var existing = document.querySelectorAll("[${attr}]");
  for (var k = 0; k < existing.length; k++) existing[k].remove();
  var root = document.createElement("div");
  root.id = ${JSON.stringify(rootId)};
  root.setAttribute("${attr}", "1");
  root.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:2147483647;font-family:'SF Mono','SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;";
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var box = document.createElement("div");
    box.setAttribute("${attr}", "1");
    box.style.cssText = "position:absolute;left:" + it.x + "px;top:" + it.y + "px;width:" + it.w + "px;height:" + it.h + "px;border:2px solid #ffb020;box-sizing:border-box;pointer-events:none;";
    var tag = document.createElement("div");
    tag.setAttribute("${attr}", "1");
    tag.textContent = String(it.ref);
    var relativeY = it.y - captureY;
    var labelTop = relativeY < 14 ? (it.y + 2) : (it.y - 14);
    tag.style.cssText = "position:absolute;left:" + it.x + "px;top:" + labelTop + "px;background:#ffb020;color:#1a1a1a;font:bold 11px/14px monospace;padding:0 4px;border-radius:2px;white-space:nowrap;pointer-events:none;";
    root.appendChild(box);
    root.appendChild(tag);
  }
  document.documentElement.appendChild(root);
  return true;
})();`;
}
function buildOverlayClearScript() {
	return `(() => {
  var existing = document.querySelectorAll("[${ANNOTATION_OVERLAY_ATTR}]");
  for (var k = 0; k < existing.length; k++) existing[k].remove();
  return true;
})();`;
}
/**
* Translate the capture origin before scaling boxes into image pixels.
* Also used for subsequent output resizing; inputs remain unchanged.
*/
function scaleAnnotations(items, scaleX, scaleY, offset = {
	x: 0,
	y: 0
}) {
	if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY) || scaleX <= 0 || scaleY <= 0) return items.map((it) => ({
		...it,
		box: { ...it.box }
	}));
	if (scaleX === 1 && scaleY === 1 && offset.x === 0 && offset.y === 0) return items.map((it) => ({
		...it,
		box: { ...it.box }
	}));
	return items.map((it) => ({
		...it,
		box: {
			x: round((it.box.x - offset.x) * scaleX),
			y: round((it.box.y - offset.y) * scaleY),
			width: Math.max(1, round(it.box.width * scaleX)),
			height: Math.max(1, round(it.box.height * scaleY))
		}
	}));
}
function round(v) {
	return Math.round(v);
}
//#endregion
//#region extensions/browser/src/browser/pw-session-contracts.ts
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
const cachedByCdpUrl = /* @__PURE__ */ new Map();
const connectingByCdpUrl = /* @__PURE__ */ new Map();
const retainedClosingByCdpUrl = /* @__PURE__ */ new Map();
const closeConnectionPromises = /* @__PURE__ */ new WeakMap();
const PLAYWRIGHT_CONNECTION_CLOSE_TIMEOUT_MS = 2e3;
const blockedTargetsByCdpUrl = /* @__PURE__ */ new Set();
const blockedPageRefsByCdpUrl = /* @__PURE__ */ new Map();
//#endregion
//#region extensions/browser/src/browser/pw-download-capture.ts
/** Shared Playwright download capture and output handling. */
function buildManagedDownloadPath(rootDir, fileName) {
	const id = crypto.randomUUID();
	const safeName = sanitizeUntrustedFileName(fileName, "download.bin");
	return path.join(rootDir, `${id}-${safeName}`);
}
/** Validate metadata and atomically save one Playwright download. */
async function saveBrowserDownload(download, opts = {}, onReadyToPublish) {
	const suggestedFilename = download.suggestedFilename?.() || "download.bin";
	const candidate = {
		url: download.url?.() || "",
		suggestedFilename
	};
	try {
		await opts.beforeSave?.(candidate);
	} catch (error) {
		if (!opts.signal?.aborted && opts.cancelOnBeforeSaveError?.(error)) await download.cancel?.().catch(() => {});
		throw error;
	}
	opts.signal?.throwIfAborted();
	const saveAs = download.saveAs?.bind(download);
	if (!saveAs) throw new Error("Download cannot be saved");
	const requestedPath = opts.outputPath?.trim();
	const implicitRoot = opts.outputRoot ?? DEFAULT_DOWNLOAD_DIR;
	const managedPath = requestedPath || buildManagedDownloadPath(implicitRoot, suggestedFilename);
	const savedPath = await writeExternalFileWithinOutputRoot({
		rootDir: requestedPath ? opts.outputRoot : implicitRoot,
		path: managedPath,
		write: async (tempPath) => {
			await saveAs(tempPath);
			opts.signal?.throwIfAborted();
			onReadyToPublish?.();
		}
	}).catch((error) => {
		if (!opts.signal?.aborted) download.cancel?.().catch(() => {});
		throw error;
	});
	return {
		...candidate,
		path: savedPath
	};
}
/** Arm one page download while maintaining explicit/passive ownership depth. */
function createDownloadCaptureForPage(page, state, timeoutMs, opts = {}) {
	if (opts.mode !== "explicit" && state.downloadWaiterDepth > 0) return {
		armed: false,
		promise: new Promise(() => {}),
		cancel: () => {}
	};
	state.downloadWaiterDepth += 1;
	const operation = new AbortController();
	let done = false;
	let timer;
	let handler;
	let activeDownload;
	let abort = () => {};
	const releaseWaiter = () => {
		if (handler) {
			state.downloadWaiterDepth = Math.max(0, state.downloadWaiterDepth - 1);
			page.off("download", handler);
			handler = void 0;
		}
	};
	const retireDeadline = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	};
	const cleanup = () => {
		done = true;
		releaseWaiter();
		retireDeadline();
		opts.signal?.removeEventListener("abort", abort);
	};
	return {
		armed: true,
		promise: new Promise((resolve, reject) => {
			const rejectCapture = (reason) => {
				if (done) return;
				operation.abort(reason);
				cleanup();
				activeDownload?.cancel?.().catch(() => {});
				reject(reason);
			};
			handler = (download) => {
				if (done) return;
				activeDownload = download;
				releaseWaiter();
				saveBrowserDownload(activeDownload, {
					...opts,
					signal: operation.signal
				}, () => {
					opts.signal?.removeEventListener("abort", abort);
					retireDeadline();
				}).finally(cleanup).then(resolve, reject);
			};
			page.on("download", handler);
			timer = setTimeout(() => {
				rejectCapture(new Error(opts.timeoutMessage ?? "Timeout waiting for download"));
			}, Math.max(1, timeoutMs));
			timer.unref?.();
			abort = () => {
				const reason = opts.signal?.reason;
				rejectCapture(reason instanceof Error ? reason : /* @__PURE__ */ new Error("Download wait was cancelled"));
			};
			opts.signal?.addEventListener("abort", abort, { once: true });
			if (opts.signal?.aborted) abort();
		}),
		cancel: () => {
			if (done || activeDownload) return;
			cleanup();
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-dialogs.ts
function resolveObservedDialogTimeoutMs(timeoutMs) {
	const parsed = parseFiniteNumber(timeoutMs);
	return Math.max(1, Math.floor(parsed ?? 12e4));
}
function recordClosedDialog(state, dialog, closedBy) {
	const record = {
		...serializeDialogRecord(dialog),
		closedAt: (/* @__PURE__ */ new Date()).toISOString(),
		closedBy
	};
	state.recentDialogs.push(record);
	while (state.recentDialogs.length > 20) state.recentDialogs.shift();
	return record;
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
function serializeObservedBrowserState(state) {
	return { dialogs: {
		pending: state.pendingDialogs.map(serializeDialogRecord),
		recent: state.recentDialogs.map(serializeDialogRecord)
	} };
}
function clearArmedDialogResponse(state) {
	if (state.armedDialogResponse?.timer) clearTimeout(state.armedDialogResponse.timer);
	state.armedDialogResponse = void 0;
}
function abortActionsBlockedByDialog(state, reason) {
	if (state.dialogAbortControllers.size === 0) return;
	const err = reason ?? new BrowserObservedDialogBlockedError(serializeObservedBrowserState(state));
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
		if (!isNoDialogShowingError(err)) throw err;
		closedBy = "remote";
	}
	return recordClosedDialog(state, pending, closedBy);
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
		}).catch((err) => abortActionsBlockedByDialog(pageState, err));
		return;
	}
	if (armed) clearArmedDialogResponse(pageState);
	abortActionsBlockedByDialog(pageState);
}
function resolvePendingDialogForResponse(params) {
	const dialogId = normalizeOptionalString(params.dialogId);
	if (dialogId) {
		const found = params.state.pendingDialogs.find((dialog) => dialog.id === dialogId);
		if (found) return found;
		throw new Error(`Dialog "${dialogId}" is not pending.`);
	}
	if (params.state.pendingDialogs.length === 1) return expectDefined(params.state.pendingDialogs.at(0), "single pending browser dialog");
	if (params.state.pendingDialogs.length > 1) throw new Error("Multiple dialogs are pending; pass dialogId.");
	throw new Error("No dialog is pending.");
}
/** Respond to a pending observed dialog on a page. */
//#endregion
//#region extensions/browser/src/browser/pw-session-state.ts
const roleRefsByTarget = /* @__PURE__ */ new Map();
const MAX_ROLE_REFS_CACHE = 50;
let roleRefsCacheGeneration = 0;
const MAX_OBSERVED_PAGE_TEXT_CHARS = 2048;
function truncateObservedPageText(value) {
	return truncateUtf16Safe(value, MAX_OBSERVED_PAGE_TEXT_CHARS);
}
function normalizeCdpUrl(raw) {
	return raw.replace(/\/$/, "");
}
function targetKey(cdpUrl, targetId) {
	return `${normalizeCdpUrl(cdpUrl)}::${targetId}`;
}
function bindRoleRefsTarget(page, cdpUrl, targetId) {
	const normalizedTargetId = normalizeOptionalString(targetId ?? void 0);
	if (!normalizedTargetId) return;
	const state = ensurePageState(page);
	const key = targetKey(cdpUrl, normalizedTargetId);
	const invalidBeforeGeneration = state.roleRefsInvalidBeforeGeneration;
	const ariaInvalidBeforeGeneration = state.roleRefsAriaInvalidBeforeGeneration;
	const cached = roleRefsByTarget.get(key);
	if (cached && (invalidBeforeGeneration !== void 0 && cached.generation <= invalidBeforeGeneration || ariaInvalidBeforeGeneration !== void 0 && cached.mode === "aria" && cached.generation <= ariaInvalidBeforeGeneration)) roleRefsByTarget.delete(key);
	state.roleRefsInvalidBeforeGeneration = void 0;
	state.roleRefsAriaInvalidBeforeGeneration = void 0;
	state.roleRefsTargetKey = key;
	if (!state.roleRefs) state.roleRefsTargetGeneration = roleRefsByTarget.get(key)?.generation;
}
/** Store role refs on the page and target cache. */
function storeRoleRefsForTarget(opts) {
	if (opts.frameSelector && !opts.frame) throw new Error("Frame-scoped role refs require their resolved frame.");
	const state = ensurePageState(opts.page);
	state.roleRefs = opts.refs;
	state.roleRefsFrameSelector = opts.frameSelector;
	state.roleRefsFrame = opts.frame;
	state.roleRefsMode = opts.mode;
	const targetId = normalizeOptionalString(opts.targetId);
	if (!targetId) {
		state.roleRefsTargetKey = void 0;
		state.roleRefsTargetGeneration = void 0;
		return;
	}
	bindRoleRefsTarget(opts.page, opts.cdpUrl, targetId);
	const key = targetKey(opts.cdpUrl, targetId);
	if (opts.frameSelector) {
		roleRefsByTarget.delete(key);
		state.roleRefsTargetGeneration = void 0;
		return;
	}
	const generation = ++roleRefsCacheGeneration;
	roleRefsByTarget.set(key, {
		refs: opts.refs,
		mode: opts.mode,
		generation
	});
	pruneMapToMaxSize(roleRefsByTarget, MAX_ROLE_REFS_CACHE);
	state.roleRefsTargetGeneration = generation;
}
function clearRoleRefs(state) {
	if (state.roleRefsTargetKey) {
		if (roleRefsByTarget.get(state.roleRefsTargetKey)?.generation === state.roleRefsTargetGeneration) roleRefsByTarget.delete(state.roleRefsTargetKey);
	}
	state.roleRefs = void 0;
	state.roleRefsMode = void 0;
	state.roleRefsFrameSelector = void 0;
	state.roleRefsFrame = void 0;
	state.roleRefsTargetKey = void 0;
	state.roleRefsTargetGeneration = void 0;
}
function currentTargetRoleRefsMode(state) {
	if (!state.roleRefsTargetKey) return;
	const cached = roleRefsByTarget.get(state.roleRefsTargetKey);
	return cached && cached.generation === state.roleRefsTargetGeneration ? cached.mode : void 0;
}
/** Restore cached role refs onto a newly resolved page. */
function restoreRoleRefsForTarget(opts) {
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (!targetId) return;
	const cacheKey = targetKey(opts.cdpUrl, targetId);
	bindRoleRefsTarget(opts.page, opts.cdpUrl, targetId);
	const cached = roleRefsByTarget.get(cacheKey);
	if (!cached) return;
	const state = ensurePageState(opts.page);
	if (state.roleRefs) return;
	state.roleRefsTargetKey = cacheKey;
	state.roleRefsTargetGeneration = cached.generation;
	state.roleRefs = cached.refs;
	state.roleRefsMode = cached.mode;
}
/** Ensure and attach state listeners for a Playwright page. */
function ensurePageState(page) {
	const existing = pageStates.get(page);
	if (existing) return existing;
	const state = {
		console: [],
		errors: [],
		requests: /* @__PURE__ */ new Map(),
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
	page.on("console", (msg) => {
		const location = msg.location();
		const entry = {
			type: truncateObservedPageText(msg.type()),
			text: truncateObservedPageText(msg.text()),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			location: {
				...location,
				url: truncateObservedPageText(location.url)
			}
		};
		state.console.push(entry);
		if (state.console.length > 500) state.console.shift();
	});
	page.on("pageerror", (err) => {
		state.errors.push({
			message: truncateObservedPageText(err.message || String(err)),
			name: err.name ? truncateObservedPageText(err.name) : void 0,
			stack: err.stack ? truncateObservedPageText(err.stack) : void 0,
			timestamp: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (state.errors.length > 200) state.errors.shift();
	});
	page.on("request", (req) => {
		state.nextRequestId += 1;
		const id = `r${state.nextRequestId}`;
		state.requestIds.set(req, id);
		state.requests.set(id, {
			id,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			method: req.method(),
			url: truncateObservedPageText(req.url()),
			resourceType: req.resourceType()
		});
		pruneMapToMaxSize(state.requests, 500);
	});
	page.on("response", (resp) => {
		const req = resp.request();
		const id = state.requestIds.get(req);
		if (!id) return;
		const rec = state.requests.get(id);
		if (!rec) return;
		rec.status = resp.status();
		rec.ok = resp.ok();
	});
	page.on("requestfailed", (req) => {
		const id = state.requestIds.get(req);
		if (!id) return;
		const rec = state.requests.get(id);
		if (!rec) return;
		const failureText = req.failure()?.errorText;
		rec.failureText = failureText ? truncateObservedPageText(failureText) : void 0;
		rec.ok = false;
	});
	page.on("dialog", (dialog) => {
		observeDialog(state, dialog);
	});
	page.on("download", (download) => {
		if (state.downloadWaiterDepth > 0) return;
		const actionCapture = state.actionDownloadCapture;
		const beforeSave = actionCapture?.beforeSave;
		const managedSave = saveBrowserDownload(download, actionCapture && beforeSave ? { beforeSave: (candidate) => {
			const validation = Promise.resolve().then(() => beforeSave(candidate));
			actionCapture.validations.push(validation);
			return validation;
		} } : void 0);
		managedSave.catch(() => {});
		download.path = async () => (await managedSave).path;
		if (actionCapture) actionCapture.lastEventAtMs = Date.now();
		actionCapture?.pending.push(managedSave);
		for (const finish of actionCapture?.waiters.splice(0) ?? []) finish();
	});
	const invalidateFrameRefs = (frame, navigated) => {
		const isMainFrame = frame === page.mainFrame();
		if (!state.roleRefsTargetKey) {
			if (isMainFrame) state.roleRefsInvalidBeforeGeneration = roleRefsCacheGeneration;
			else state.roleRefsAriaInvalidBeforeGeneration = roleRefsCacheGeneration;
		}
		const pageWideAriaRefs = state.roleRefsMode === "aria" || currentTargetRoleRefsMode(state) === "aria";
		if (navigated && isMainFrame || pageWideAriaRefs || frame === state.roleRefsFrame) clearRoleRefs(state);
	};
	page.on("framenavigated", (frame) => invalidateFrameRefs(frame, true));
	page.on("framedetached", (frame) => invalidateFrameRefs(frame, false));
	page.on("close", () => {
		const emulationSession = state.emulation?.session;
		state.emulation = void 0;
		emulationSession?.then((session) => session.detach()).catch(() => {});
		clearArmedDialogResponse(state);
		for (const controller of state.dialogAbortControllers) if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("Page closed before browser action completed."));
		state.dialogAbortControllers.clear();
		state.pendingDialogs = [];
		pageStates.delete(page);
	});
	return state;
}
/** Read observed dialog state from a Playwright page. */
function getObservedBrowserStateForPage(page) {
	return serializeObservedBrowserState(ensurePageState(page));
}
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
/** Mark pending observed dialogs as handled by a remote/browser-side hook. */
function markObservedDialogsHandledRemotelyForPage(page, dialogs) {
	const state = ensurePageState(page);
	const ids = new Set(dialogs.map((dialog) => dialog.id));
	const pending = state.pendingDialogs.filter((dialog) => ids.has(dialog.id));
	state.pendingDialogs = state.pendingDialogs.filter((dialog) => !ids.has(dialog.id));
	for (const dialog of pending) recordClosedDialog(state, dialog, "remote");
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
	if (opts.parentSignal) {
		if (opts.parentSignal.aborted) abortForParent();
		else opts.parentSignal.addEventListener("abort", abortForParent, { once: true });
	}
	return {
		signal: controller.signal,
		cleanup: () => {
			state.dialogAbortControllers.delete(controller);
			opts.parentSignal?.removeEventListener("abort", abortForParent);
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-downloads.ts
function isDownloadStartingNavigationError(err, expectedUrl) {
	const message = formatErrorMessage(err).toLowerCase();
	if (message.includes("download is starting")) return true;
	const normalizedUrl = normalizeOptionalString(expectedUrl)?.toLowerCase();
	return Boolean(normalizedUrl && message.includes("net::err_aborted") && message.includes(normalizedUrl));
}
/** Capture downloads started synchronously by one Browser action. */
function beginActionDownloadCaptureOnPage(page, opts = {}) {
	const state = ensurePageState(page);
	const capture = {
		pending: [],
		validations: [],
		waiters: [],
		...opts.beforeSave ? { beforeSave: opts.beforeSave } : {}
	};
	state.actionDownloadCapture = capture;
	const detach = () => {
		if (state.actionDownloadCapture === capture) state.actionDownloadCapture = void 0;
		for (const finish of capture.waiters.splice(0)) finish();
	};
	return {
		drain: async (drainOpts = {}) => {
			const waitForEvent = async (timeoutMs) => {
				await new Promise((resolve) => {
					const finish = () => {
						clearTimeout(timer);
						capture.waiters = capture.waiters.filter((waiter) => waiter !== finish);
						resolve();
					};
					const timer = setTimeout(finish, timeoutMs);
					capture.waiters.push(finish);
				});
			};
			const firstEventGraceMs = Math.max(0, drainOpts.firstEventGraceMs ?? 0);
			const maxWaitMs = Math.max(0, drainOpts.maxWaitMs ?? Number.POSITIVE_INFINITY);
			const deadlineAtMs = Date.now() + maxWaitMs;
			const remainingBudgetMs = () => Math.max(0, deadlineAtMs - Date.now());
			if (capture.pending.length === 0 && firstEventGraceMs > 0) await waitForEvent(Math.min(firstEventGraceMs, remainingBudgetMs()));
			const quietMs = Math.max(0, drainOpts.quietMs ?? 0);
			if (quietMs > 0) while (capture.lastEventAtMs !== void 0) {
				const remainingQuietMs = Math.min(quietMs - (Date.now() - capture.lastEventAtMs), remainingBudgetMs());
				if (remainingQuietMs <= 0) break;
				await waitForEvent(remainingQuietMs);
			}
			detach();
			const pending = capture.pending.slice();
			await Promise.all(capture.validations.slice());
			const downloads = await Promise.all(pending);
			return downloads.length > 0 ? downloads : void 0;
		},
		dispose: detach
	};
}
//#endregion
//#region extensions/browser/src/browser/lightpanda-cdp.ts
const MAX_PENDING_TARGET_COMMANDS = 4096;
const MAX_ATTACHED_PAGE_SESSIONS = 4096;
const ROOT_REPLIES = /* @__PURE__ */ new Set([
	"Target.getTargetInfo",
	"Target.getTargets",
	"Target.getBrowserContexts"
]);
/** Normalize the session-routing omissions observed in Lightpanda 0.4.1. */
function createLightpandaCdpNormalizer() {
	const pendingSessions = /* @__PURE__ */ new Map();
	const targetBySession = /* @__PURE__ */ new Map();
	return {
		send(message) {
			const command = asOptionalRecord(message);
			const method = readStringField(command, "method");
			const sessionId = readStringField(command, "sessionId");
			if (!command || !sessionId || !ROOT_REPLIES.has(method ?? "")) return message;
			if (typeof command.id === "number") {
				if (pendingSessions.size >= MAX_PENDING_TARGET_COMMANDS) throw new Error("Lightpanda has too many unanswered target commands; reconnect.");
				pendingSessions.set(command.id, sessionId);
			}
			const params = asOptionalRecord(command.params);
			const targetId = targetBySession.get(sessionId);
			if (method === "Target.getTargetInfo" && !readStringField(params, "targetId") && targetId) return {
				...command,
				params: {
					...params,
					targetId
				}
			};
			return message;
		},
		receive(message) {
			const params = asOptionalRecord(message.params);
			const sessionId = readStringField(params, "sessionId");
			if (message.method === "Target.attachedToTarget" && sessionId) {
				const target = asOptionalRecord(params?.targetInfo);
				const targetId = readStringField(target, "targetId");
				if (sessionId === "STARTUP" && targetId === "TID-STARTUP" && readStringField(target, "browserContextId") === "BID-STARTUP") return;
				if (readStringField(target, "type") === "page" && targetId) {
					if (targetBySession.size >= MAX_ATTACHED_PAGE_SESSIONS) throw new Error("Lightpanda has too many attached page sessions; reconnect.");
					targetBySession.set(sessionId, targetId);
				}
			} else if (message.method === "Target.detachedFromTarget" && sessionId) targetBySession.delete(sessionId);
			if (typeof message.id === "number") {
				const expectedSessionId = pendingSessions.get(message.id);
				pendingSessions.delete(message.id);
				if (expectedSessionId && !readStringField(message, "sessionId")) return {
					...message,
					sessionId: expectedSessionId
				};
			}
			return message;
		},
		clear() {
			pendingSessions.clear();
			targetBySession.clear();
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/pw-session-cdp-transport.ts
const FIRST_INTERNAL_COMMAND_ID = -1e4;
function contextlessTargetParams(message) {
	if (readStringField(message, "method") !== "Target.attachedToTarget") return;
	const params = asOptionalRecord(message.params);
	const targetInfo = asOptionalRecord(params?.targetInfo);
	if (readStringField(message, "sessionId") || readStringField(targetInfo, "type") === "browser" || readStringField(targetInfo, "browserContextId")) return;
	return params ?? {};
}
async function openCdpTransportSocket(connectionUrl, opts) {
	const resolvedConnectionUrl = isWebSocketUrl(connectionUrl) ? connectionUrl : await opts.resolveWebSocketUrl?.();
	if (!resolvedConnectionUrl) throw new Error("CDP endpoint did not expose a usable WebSocket URL.");
	const ws = openCdpWebSocket(resolvedConnectionUrl, {
		headers: opts.headers,
		handshakeTimeoutMs: opts.timeout,
		lookup: opts.lookup,
		playwrightTransportDefaults: true
	});
	try {
		await new Promise((resolve, reject) => {
			ws.once("open", () => resolve());
			ws.once("error", reject);
			ws.once("close", () => reject(/* @__PURE__ */ new Error("CDP socket closed")));
		});
	} catch (error) {
		ws.close();
		throw error;
	}
	const wire = {
		send: (message) => ws.send(JSON.stringify(message)),
		close: () => {
			ws.close();
			setTimeout(() => {
				if (ws.readyState !== WebSocket.CLOSED) ws.terminate();
			}, 100).unref?.();
		}
	};
	ws.on("message", (raw) => {
		try {
			const parsed = asOptionalRecord(JSON.parse(rawDataToString(raw)));
			if (!parsed) {
				wire.close();
				return;
			}
			wire.onmessage?.(parsed);
		} catch {
			wire.close();
		}
	});
	ws.on("close", () => wire.onclose?.("CDP socket closed"));
	ws.on("error", (error) => wire.onclose?.(formatErrorMessage(error)));
	return wire;
}
async function connectOverCdpTransport(connectionUrl, opts) {
	const wire = opts.preparedTransport ?? await openCdpTransportSocket(connectionUrl, opts);
	const lightpanda = opts.engine === "lightpanda" ? createLightpandaCdpNormalizer() : void 0;
	try {
		let onMessage;
		let onClose;
		const pendingMessages = [];
		let pendingCloseReason;
		let transportClosed = false;
		let closingReason;
		let transportCloseScheduled = false;
		let nextInternalCommandId = FIRST_INTERNAL_COMMAND_ID;
		const pendingContextlessTargetResumes = /* @__PURE__ */ new Map();
		const notifyTransportClosed = (reason) => {
			if (transportClosed) return;
			transportClosed = true;
			lightpanda?.clear();
			if (onClose) {
				onClose(reason);
				return;
			}
			pendingCloseReason = reason;
		};
		const scheduleTransportClosed = (reason) => {
			if (transportClosed || transportCloseScheduled) return;
			transportCloseScheduled = true;
			setImmediate(() => {
				transportCloseScheduled = false;
				notifyTransportClosed(reason);
			});
		};
		const closeTransportSocket = (reason = "CDP socket closed") => {
			closingReason = reason;
			lightpanda?.clear();
			wire.close();
		};
		const sendInternalCommand = (method, params, sessionId) => {
			const id = nextInternalCommandId--;
			wire.send({
				id,
				method,
				...params ? { params } : {},
				sessionId
			});
			return id;
		};
		const releaseContextlessTarget = (params) => {
			const sessionId = readStringField(params, "sessionId");
			if (!sessionId) return;
			const resumeId = sendInternalCommand("Runtime.runIfWaitingForDebugger", void 0, sessionId);
			pendingContextlessTargetResumes.set(resumeId, sessionId);
		};
		const scheduleMessage = (message) => {
			setImmediate(() => {
				if (transportClosed || closingReason) return;
				if (!onMessage) {
					pendingMessages.push(message);
					return;
				}
				try {
					Promise.resolve(onMessage(message)).catch((error) => {
						closeTransportSocket(formatErrorMessage(error));
					});
				} catch (error) {
					closeTransportSocket(formatErrorMessage(error));
				}
			});
		};
		const transport = {
			send: (message) => {
				if (closingReason || transportClosed) throw new Error("CDP transport closed");
				try {
					wire.send(lightpanda?.send(message) ?? message);
				} catch (error) {
					closeTransportSocket(formatErrorMessage(error));
					throw error;
				}
			},
			close: () => {
				closeTransportSocket();
			},
			get onmessage() {
				return onMessage;
			},
			set onmessage(handler) {
				onMessage = handler;
				if (!handler) return;
				while (pendingMessages.length > 0) {
					const pending = pendingMessages.shift();
					if (pending) scheduleMessage(pending);
				}
			},
			get onclose() {
				return onClose;
			},
			set onclose(handler) {
				onClose = handler;
				if (handler && pendingCloseReason !== void 0) {
					const reason = pendingCloseReason;
					pendingCloseReason = void 0;
					handler(reason);
				}
			}
		};
		Object.assign(wire, {
			onmessage: (message) => {
				try {
					const received = asOptionalRecord(message);
					if (!received) {
						closeTransportSocket();
						return;
					}
					const parsed = lightpanda ? lightpanda.receive(received) : received;
					if (!parsed) return;
					const id = parsed.id;
					if (typeof id === "number" && id <= FIRST_INTERNAL_COMMAND_ID) {
						const targetSessionId = pendingContextlessTargetResumes.get(id);
						if (targetSessionId) {
							pendingContextlessTargetResumes.delete(id);
							sendInternalCommand("Target.detachFromTarget", { sessionId: targetSessionId });
						}
						return;
					}
					const contextlessParams = contextlessTargetParams(parsed);
					if (contextlessParams) {
						releaseContextlessTarget(contextlessParams);
						return;
					}
					scheduleMessage(parsed);
				} catch {
					closeTransportSocket();
				}
			},
			onclose: (reason) => scheduleTransportClosed(closingReason ?? reason ?? "CDP socket closed")
		});
		return await getPlaywrightCore().chromium.connectOverCDP(transport, { timeout: opts.timeout });
	} catch (error) {
		lightpanda?.clear();
		wire.close();
		throw error;
	}
}
//#endregion
//#region extensions/browser/src/browser/extension-relay/owner-playwright.ts
const operationConnections = /* @__PURE__ */ new WeakMap();
async function closeRelayOperationConnection(reference) {
	const pending = operationConnections.get(reference);
	if (!pending) return;
	await (await pending).close();
	if (operationConnections.get(reference) === pending) operationConnections.delete(reference);
}
async function connectRelayBrowser(relay, cdpUrl, reference) {
	const existing = reference && operationConnections.get(reference);
	if (existing) {
		const browser = await existing;
		relay.client.assertCurrent();
		if (!await reference.resolve()) throw new Error("Captured relay connection was superseded");
		return browser;
	}
	const pending = (async () => {
		const browser = await connectOverCdpTransport(cdpUrl, {
			timeout: 5e3,
			headers: {},
			preparedTransport: await (reference ? reference.openTransport() : relay.client.openTransport())
		});
		try {
			if (getBorrowedRelayCdpAccess(cdpUrl) !== relay || reference && !await reference.resolve()) throw new Error("Captured relay connection was superseded");
			return browser;
		} catch (error) {
			await browser.close();
			throw error;
		}
	})();
	if (reference) {
		operationConnections.set(reference, pending);
		pending.catch(() => {
			if (operationConnections.get(reference) === pending) operationConnections.delete(reference);
		});
	}
	return await pending;
}
//#endregion
//#region extensions/browser/src/browser/pw-session-page-target.ts
const targetInfoReads = /* @__PURE__ */ new WeakMap();
async function readPageTargetInfo(page) {
	let session;
	let timer;
	let timedOut = false;
	let detachStarted = false;
	const detach = () => {
		if (!session || detachStarted) return;
		detachStarted = true;
		session.detach().catch(() => {});
	};
	const timeout = new Promise((resolve) => {
		timer = setTimeout(() => {
			timedOut = true;
			detach();
			resolve(null);
		}, PLAYWRIGHT_TARGET_INFO_TIMEOUT_MS);
		timer.unref?.();
	});
	const read = (async () => {
		session = await page.context().newCDPSession(page);
		if (timedOut) {
			detach();
			return null;
		}
		try {
			const { targetInfo } = await session.send("Target.getTargetInfo");
			const targetId = normalizeOptionalString(targetInfo.targetId) ?? "";
			if (!targetId) return null;
			return {
				targetId,
				title: targetInfo.title
			};
		} finally {
			detach();
		}
	})();
	try {
		return await Promise.race([read, timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
function pageTargetInfo(page) {
	const existing = targetInfoReads.get(page);
	if (existing) return existing;
	const pending = readPageTargetInfo(page);
	targetInfoReads.set(page, pending);
	const evict = () => {
		if (targetInfoReads.get(page) === pending) targetInfoReads.delete(page);
	};
	pending.then(evict, evict);
	return pending;
}
//#endregion
//#region extensions/browser/src/browser/pw-session-connection.ts
function resolveCdpConnectRetryDelayMs(attempt) {
	return 250 + attempt * 250;
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
	const pending = connectingByCdpUrl.get(normalized);
	if (pending) pending.attempt.cancelled = true;
	connectingByCdpUrl.delete(normalized);
	if (!cur) return null;
	if (cur.onDisconnected && typeof cur.browser.off === "function") cur.browser.off("disconnected", cur.onDisconnected);
	return cur;
}
/** Raised when a page target has been quarantined after policy denial. */
var BlockedBrowserTargetError = class extends Error {
	constructor() {
		super("Browser target is unavailable after SSRF policy blocked its navigation.");
		this.name = "BlockedBrowserTargetError";
	}
};
function retainClosingPlaywrightConnection(connection) {
	const retained = retainedClosingByCdpUrl.get(connection.cdpUrl) ?? /* @__PURE__ */ new Set();
	retained.add(connection);
	retainedClosingByCdpUrl.set(connection.cdpUrl, retained);
}
function releaseClosingPlaywrightConnection(connection) {
	const retained = retainedClosingByCdpUrl.get(connection.cdpUrl);
	retained?.delete(connection);
	if (retained?.size === 0) retainedClosingByCdpUrl.delete(connection.cdpUrl);
}
async function closeTrackedPlaywrightConnection(connection) {
	const existing = closeConnectionPromises.get(connection);
	if (existing) return await existing;
	retainClosingPlaywrightConnection(connection);
	const closing = (async () => {
		try {
			await connection.browser.close();
			releaseClosingPlaywrightConnection(connection);
		} catch (error) {
			closeConnectionPromises.delete(connection);
			throw error;
		}
	})();
	closeConnectionPromises.set(connection, closing);
	return await closing;
}
async function withPlaywrightCloseTimeout(task) {
	let timer;
	try {
		await Promise.race([task, new Promise((_, reject) => {
			timer = setTimeout(() => reject(/* @__PURE__ */ new Error("Playwright adapter disconnect timed out.")), PLAYWRIGHT_CONNECTION_CLOSE_TIMEOUT_MS);
			timer.unref?.();
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
/** Capture and retire only the adapter handles currently owned by one lifecycle transition. */
function retirePlaywrightBrowserConnectionExact(opts) {
	const normalized = normalizeCdpUrl(opts.cdpUrl);
	clearBlockedTargetsForCdpUrl(normalized);
	clearBlockedPageRefsForCdpUrl(normalized);
	const connections = /* @__PURE__ */ new Map();
	const pendingCollections = /* @__PURE__ */ new Set();
	let retired = false;
	const captureConnection = (connection) => {
		const existing = connections.get(connection);
		if (existing) return existing;
		const closing = closeTrackedPlaywrightConnection(connection);
		connections.set(connection, closing);
		closing.catch(() => {});
		return closing;
	};
	const capture = () => {
		const pending = connectingByCdpUrl.get(normalized);
		const cached = takeCachedPlaywrightBrowserConnection(normalized);
		for (const connection of retainedClosingByCdpUrl.get(normalized) ?? []) captureConnection(connection);
		if (cached) captureConnection(cached);
		if (pending) {
			const collection = pending.promise.then((connection) => {
				captureConnection(connection);
			}, () => {
				if (pending.attempt.retired) captureConnection(pending.attempt.retired);
			});
			pendingCollections.add(collection);
			collection.then(() => {
				pendingCollections.delete(collection);
			});
		}
		const captured = Boolean(pending || connections.size > 0);
		retired ||= captured;
		return captured;
	};
	capture();
	return {
		get retired() {
			return retired;
		},
		refresh: capture,
		close: async () => {
			await withPlaywrightCloseTimeout((async () => {
				for (const connection of connections.keys()) captureConnection(connection);
				await Promise.all(pendingCollections);
				const attempts = [...connections.keys()].map((connection) => [connection, captureConnection(connection)]);
				const results = await Promise.allSettled(attempts.map(([, closing]) => closing));
				let firstError;
				for (const [index, result] of results.entries()) {
					if (result.status !== "rejected") continue;
					const [connection, closing] = attempts[index];
					if (connections.get(connection) === closing) connections.set(connection, void 0);
					firstError ??= toErrorObject(result.reason, "Playwright adapter disconnect failed.");
				}
				if (firstError) throw firstError;
			})());
		}
	};
}
/** Retire a scoped adapter immediately; its CDP disconnect may settle later. */
function retirePlaywrightBrowserConnection(opts) {
	return retirePlaywrightBrowserConnectionExact(opts).retired;
}
function evictStalePlaywrightBrowserConnection(cdpUrl, expectedBrowser) {
	const current = cachedByCdpUrl.get(normalizeCdpUrl(cdpUrl));
	if (expectedBrowser && current?.browser !== expectedBrowser) return;
	const cur = takeCachedPlaywrightBrowserConnection(cdpUrl);
	if (cur) closeTrackedPlaywrightConnection(cur).catch(() => {});
}
function hasBlockedTargetsForCdpUrl(cdpUrl) {
	const prefix = `${normalizeCdpUrl(cdpUrl)}::`;
	for (const key of blockedTargetsByCdpUrl) if (key.startsWith(prefix)) return true;
	return false;
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
async function connectBrowser(cdpUrl, ssrfPolicy, relayReference) {
	const normalized = normalizeCdpUrl(cdpUrl);
	const relay = getBorrowedRelayCdpAccess(normalized);
	if (relayReference) {
		if (!relay) throw new Error("Captured relay connection is unavailable");
		const browser = await connectRelayBrowser(relay, normalized, relayReference);
		observeBrowser(browser);
		return {
			browser,
			cdpUrl: normalized
		};
	}
	const cached = cachedByCdpUrl.get(normalized);
	if (cached) return cached;
	const configuredPin = await assertCdpEndpointAllowed(normalized, ssrfPolicy);
	const connectedDuringPolicyCheck = cachedByCdpUrl.get(normalized);
	if (connectedDuringPolicyCheck) return connectedDuringPolicyCheck;
	const connecting = connectingByCdpUrl.get(normalized);
	if (connecting) return await connecting.promise;
	const connectionAttempt = { cancelled: false };
	const connectWithRetry = async () => {
		let lastErr;
		for (let attempt = 0; attempt < 3; attempt += 1) {
			if (connectionAttempt.cancelled) break;
			try {
				const timeout = 5e3 + attempt * 2e3;
				let endpointDiscoveryError;
				const resolvedEndpoint = relay ? null : await getChromeWebSocketEndpoint(normalized, timeout, ssrfPolicy).catch((err) => {
					endpointDiscoveryError = err;
					return null;
				});
				const hasUrlCredentials = stripCdpUrlCredentials(normalized) !== normalized;
				const configuredIsWebSocket = isWebSocketUrl(normalized);
				if (!relay && !resolvedEndpoint && !configuredIsWebSocket) {
					if (hasUrlCredentials) throw new Error("Authenticated CDP HTTP endpoint did not expose a usable WebSocket URL.");
					const detail = endpointDiscoveryError ? ` Reason: ${redactCdpErrorText(formatErrorMessage(endpointDiscoveryError))}` : "";
					if (ssrfPolicy) throw new Error(`Guarded CDP endpoint did not expose a usable WebSocket URL.${detail}`);
				}
				const normalizedCdpHostname = new URL(normalized).hostname;
				const needsPinnedDependencyConnect = Boolean(configuredPin?.lookup) && !isLoopbackHost(normalizedCdpHostname);
				const endpointUrl = resolvedEndpoint?.url ?? normalized;
				const endpointLookup = resolvedEndpoint?.lookup ?? (needsPinnedDependencyConnect ? configuredPin?.lookup : void 0);
				const connectEndpoint = async (target, lookup) => {
					const headers = getHeadersWithAuth(target);
					const connectionUrl = stripCdpUrlCredentials(target);
					const resolveWebSocketUrl = isWebSocketUrl(connectionUrl) ? void 0 : async () => (await getChromeWebSocketEndpoint(connectionUrl, timeout))?.url;
					return await withManagedProxyForCdpUrl(connectionUrl, () => withNoProxyForCdpUrl(connectionUrl, async () => {
						return await connectOverCdpTransport(connectionUrl, {
							timeout,
							headers,
							lookup,
							resolveWebSocketUrl
						});
					}));
				};
				let browser;
				try {
					browser = relay ? await connectRelayBrowser(relay, normalized) : await connectEndpoint(endpointUrl, endpointLookup);
					if (relay && getBorrowedRelayCdpAccess(normalized) !== relay) {
						await browser.close();
						throw new Error("Relay connection was superseded");
					}
				} catch (err) {
					if (!configuredIsWebSocket || endpointUrl === normalized) throw err;
					browser = await connectEndpoint(normalized, configuredPin?.lookup);
				}
				if (connectionAttempt.cancelled) {
					connectionAttempt.retired = {
						browser,
						cdpUrl: normalized
					};
					closeTrackedPlaywrightConnection(connectionAttempt.retired).catch(() => {});
					throw new Error("Playwright connection attempt was superseded.");
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
				if (connectionAttempt.cancelled || relay) break;
				if (formatErrorMessage(err).includes("rate limit")) break;
				const delay = resolveCdpConnectRetryDelayMs(attempt);
				await new Promise((r) => {
					setTimeout(r, delay);
				});
			}
		}
		const message = lastErr ? formatErrorMessage(lastErr) : "CDP connect failed";
		throw new Error(redactCdpErrorText(message));
	};
	const pending = connectWithRetry().finally(() => {
		if (connectingByCdpUrl.get(normalized)?.attempt === connectionAttempt) connectingByCdpUrl.delete(normalized);
	});
	connectingByCdpUrl.set(normalized, {
		attempt: connectionAttempt,
		promise: pending
	});
	return await pending;
}
async function getAllPages(browser) {
	return browser.contexts().flatMap((c) => c.pages());
}
async function partitionAccessiblePages(opts) {
	const accessible = [];
	let blockedCount = 0;
	const candidates = await Promise.all(opts.pages.map(async (page) => {
		if (isBlockedPageRef(opts.cdpUrl, page)) return {
			page,
			targetId: null
		};
		ensurePageState(page);
		return {
			page,
			targetId: (await pageTargetInfo(page).catch(() => null))?.targetId ?? null
		};
	}));
	for (const { page, targetId } of candidates) {
		if (isBlockedPageRef(opts.cdpUrl, page)) {
			blockedCount += 1;
			continue;
		}
		if (!targetId) {
			if (hasBlockedTargetsForCdpUrl(opts.cdpUrl)) {
				blockedCount += 1;
				continue;
			}
			accessible.push({
				page,
				targetId: null
			});
			continue;
		}
		if (isBlockedTarget(opts.cdpUrl, targetId)) {
			blockedCount += 1;
			continue;
		}
		bindRoleRefsTarget(page, opts.cdpUrl, targetId);
		accessible.push({
			page,
			targetId
		});
	}
	return {
		accessible,
		blockedCount
	};
}
async function getPageForTargetIdOnce(opts) {
	if (opts.targetId && isBlockedTarget(opts.cdpUrl, opts.targetId)) throw new BlockedBrowserTargetError();
	const { browser } = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy, opts.relayReference);
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
	const first = expectDefined(accessible.at(0), "non-empty accessible browser pages");
	if (!opts.targetId) {
		bindRoleRefsTarget(first.page, opts.cdpUrl, first.targetId);
		return first.page;
	}
	const found = accessible.find((entry) => entry.targetId === opts.targetId);
	if (found) {
		bindRoleRefsTarget(found.page, opts.cdpUrl, found.targetId);
		return found.page;
	}
	throw new BrowserTabNotFoundError();
}
/** Resolve a Playwright page by target id, reconnecting once on stale state. */
async function getPageForTargetId(opts) {
	const cachedBrowser = cachedByCdpUrl.get(normalizeCdpUrl(opts.cdpUrl))?.browser;
	try {
		return await getPageForTargetIdOnce(opts);
	} catch (err) {
		if (!isRecoverableStalePageSelectionError(err, Boolean(cachedBrowser))) throw err;
		if (opts.relayReference) await closeRelayOperationConnection(opts.relayReference);
		else evictStalePlaywrightBrowserConnection(opts.cdpUrl, cachedBrowser);
		return await getPageForTargetIdOnce(opts);
	}
}
//#endregion
//#region extensions/browser/src/browser/pw-session-navigation.ts
/** Classify requests that can navigate the selected page or one of its frames. */
function classifyBrowserDocumentNavigationRequest(page, request) {
	let kind;
	let frameResolutionFailed = false;
	try {
		kind = request.frame() === page.mainFrame() ? "top-level" : "subframe";
	} catch {
		kind = "top-level";
		frameResolutionFailed = true;
	}
	try {
		if (request.isNavigationRequest()) return kind;
	} catch {}
	try {
		if (request.resourceType() === "document") return kind;
	} catch {}
	return frameResolutionFailed ? "subframe" : null;
}
/** Return true when an error is a browser navigation policy denial. */
function isPolicyDenyNavigationError(err) {
	return err instanceof SsrFBlockedError || err instanceof InvalidBrowserNavigationUrlError;
}
async function quarantineBlockedNavigationTarget(opts) {
	markPageRefBlocked(opts.cdpUrl, opts.page);
	const resolvedTargetId = (await pageTargetInfo(opts.page).catch(() => null))?.targetId ?? null;
	const fallbackTargetId = normalizeOptionalString(opts.targetId) ?? "";
	const targetIdToBlock = resolvedTargetId || fallbackTargetId;
	if (targetIdToBlock) markTargetBlocked(opts.cdpUrl, targetIdToBlock);
}
/** Quarantine and close a tab that OpenClaw navigated to a blocked URL. */
async function closeBlockedNavigationTarget(opts) {
	await quarantineBlockedNavigationTarget(opts);
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
		if (isPolicyDenyNavigationError(err)) await quarantineBlockedNavigationTarget({
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
async function fallbackRouteSafely(route) {
	try {
		await route.fallback();
	} catch (err) {
		if ((err instanceof Error ? err.message : "").includes("Route is already handled")) return;
		throw err;
	}
}
const sourcePreservedPolicyDenials = /* @__PURE__ */ new WeakSet();
async function removePageNavigationRequestGuard(page, handler) {
	try {
		await page.unroute("**", handler);
	} catch (err) {
		try {
			if (page.isClosed()) return;
		} catch {}
		return err;
	}
}
/** Return true when policy denial left the selected page on its source document. */
function wasBrowserNavigationSourcePreservedAfterPolicyDenial(err) {
	return typeof err === "object" && err !== null && sourcePreservedPolicyDenials.has(err);
}
/** Run one selected-page action while guarding document requests. */
async function withPageNavigationRequestGuard(opts) {
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode) return await opts.action(opts.page.url());
	const inFlight = /* @__PURE__ */ new Set();
	let hasGuardError = false;
	let firstGuardError;
	let deniedDocumentCount = 0;
	let fulfilledDeniedDocumentCount = 0;
	let pendingDeniedDocumentCount = 0;
	let unpreservedDocumentCount = 0;
	let policyDeniedDetected = false;
	let lastNotifiedSourcePreserved;
	const recordGuardError = (err) => {
		if (hasGuardError) {
			if (!isPolicyDenyNavigationError(firstGuardError) && isPolicyDenyNavigationError(err)) firstGuardError = err;
			return;
		}
		hasGuardError = true;
		firstGuardError = err;
	};
	const emitPolicyDenied = (event) => {
		try {
			opts.onPolicyDenied?.(event);
		} catch {}
	};
	const updateImmediateSourcePreservation = () => {
		if (typeof firstGuardError !== "object" || firstGuardError === null) return;
		let sourcePreserved;
		if (unpreservedDocumentCount > 0) sourcePreserved = false;
		else if (isPolicyDenyNavigationError(firstGuardError) && deniedDocumentCount > 0 && pendingDeniedDocumentCount === 0 && fulfilledDeniedDocumentCount === deniedDocumentCount) sourcePreserved = true;
		if (sourcePreserved === void 0) {
			sourcePreservedPolicyDenials.delete(firstGuardError);
			return;
		}
		if (sourcePreserved) sourcePreservedPolicyDenials.add(firstGuardError);
		else sourcePreservedPolicyDenials.delete(firstGuardError);
		if (policyDeniedDetected && sourcePreserved !== lastNotifiedSourcePreserved) {
			lastNotifiedSourcePreserved = sourcePreserved;
			emitPolicyDenied({
				state: "handled",
				error: firstGuardError,
				sourcePreserved
			});
		}
	};
	const notifyPolicyDeniedDetected = () => {
		if (policyDeniedDetected || !isPolicyDenyNavigationError(firstGuardError)) return;
		policyDeniedDetected = true;
		emitPolicyDenied({
			state: "detected",
			error: firstGuardError
		});
	};
	const stopGuardedRoute = async (route, preserveDocument, requestError) => {
		if (preserveDocument && isPolicyDenyNavigationError(requestError)) {
			deniedDocumentCount += 1;
			pendingDeniedDocumentCount += 1;
			try {
				await route.fulfill({
					status: 204,
					body: ""
				});
				fulfilledDeniedDocumentCount += 1;
				pendingDeniedDocumentCount -= 1;
				updateImmediateSourcePreservation();
				return;
			} catch {
				pendingDeniedDocumentCount -= 1;
			}
		}
		if (preserveDocument) {
			unpreservedDocumentCount += 1;
			updateImmediateSourcePreservation();
		}
		await route.abort().catch(() => {});
	};
	const handleRoute = async (route, request) => {
		if (!classifyBrowserDocumentNavigationRequest(opts.page, request)) {
			try {
				await fallbackRouteSafely(route);
			} catch (err) {
				recordGuardError(err);
				await stopGuardedRoute(route, false, err);
			}
			return;
		}
		const policyCheck = assertBrowserNavigationAllowed({
			url: request.url(),
			...navigationPolicy
		});
		try {
			opts.onPolicyCheckStarted?.(policyCheck);
		} catch {}
		try {
			await policyCheck;
		} catch (err) {
			recordGuardError(err);
			notifyPolicyDeniedDetected();
			await stopGuardedRoute(route, true, err);
			return;
		}
		try {
			await fallbackRouteSafely(route);
		} catch (err) {
			recordGuardError(err);
			await stopGuardedRoute(route, true, err);
		}
	};
	const handler = (route, request) => {
		const operation = handleRoute(route, request).catch(async (err) => {
			recordGuardError(err);
			await stopGuardedRoute(route, true, err);
		});
		inFlight.add(operation);
		operation.finally(() => inFlight.delete(operation));
		return operation;
	};
	try {
		await opts.page.route("**", handler);
	} catch (err) {
		await removePageNavigationRequestGuard(opts.page, handler);
		throw err;
	}
	let result;
	let actionFailed = false;
	let actionError;
	try {
		let baselineUrl = opts.page.url();
		await assertBrowserNavigationResultAllowed({
			url: baselineUrl,
			...navigationPolicy
		});
		const latestUrl = opts.page.url();
		if (latestUrl !== baselineUrl) {
			await assertBrowserNavigationResultAllowed({
				url: latestUrl,
				...navigationPolicy
			});
			baselineUrl = latestUrl;
		}
		result = await opts.action(baselineUrl);
	} catch (err) {
		actionFailed = true;
		actionError = err;
		if (isPolicyDenyNavigationError(err)) {
			recordGuardError(err);
			notifyPolicyDeniedDetected();
			unpreservedDocumentCount += 1;
			updateImmediateSourcePreservation();
		}
	}
	const cleanupError = await removePageNavigationRequestGuard(opts.page, handler);
	while (inFlight.size > 0) await Promise.allSettled(inFlight);
	if (hasGuardError) {
		const sourcePreserved = isPolicyDenyNavigationError(firstGuardError) && deniedDocumentCount > 0 && fulfilledDeniedDocumentCount === deniedDocumentCount && unpreservedDocumentCount === 0 && !(actionFailed && isPolicyDenyNavigationError(actionError)) && typeof firstGuardError === "object" && firstGuardError !== null;
		if (typeof firstGuardError === "object" && firstGuardError !== null) {
			if (sourcePreserved) sourcePreservedPolicyDenials.add(firstGuardError);
			else sourcePreservedPolicyDenials.delete(firstGuardError);
		}
		throw toErrorObject(firstGuardError, "Non-Error thrown");
	}
	if (actionFailed) throw toErrorObject(actionError, "Non-Error thrown");
	if (cleanupError !== void 0) throw toErrorObject(cleanupError, "Non-Error thrown");
	return result;
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
		const requestKind = classifyBrowserDocumentNavigationRequest(opts.page, request);
		if (!requestKind) {
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
				if (requestKind === "top-level") blockedError = err;
				await route.abort().catch(() => {});
				return;
			}
			throw err;
		}
		await continueRouteSafely(route);
	};
	try {
		await opts.page.route("**", handler);
	} catch (err) {
		await removePageNavigationRequestGuard(opts.page, handler);
		throw err;
	}
	let response = null;
	let navigationFailed = false;
	let navigationError;
	try {
		await opts.assertPageCurrent?.();
		response = await opts.page.goto(opts.url, { timeout: opts.timeoutMs });
	} catch (err) {
		navigationFailed = true;
		navigationError = err;
	}
	const cleanupError = await removePageNavigationRequestGuard(opts.page, handler);
	if (blockedError) {
		await closeBlockedNavigationTarget({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			targetId: opts.targetId
		});
		throw toErrorObject(blockedError, "Non-Error thrown");
	}
	if (navigationFailed) throw navigationError;
	if (cleanupError !== void 0) throw toErrorObject(cleanupError, "Non-Error thrown");
	return response;
}
/** Resolve a browser snapshot ref into a Playwright locator. */
//#endregion
//#region extensions/browser/src/browser/pw-session.page-cdp.ts
/** Attribute used to mark DOM nodes that correspond to generated browser refs. */
const BROWSER_REF_MARKER_ATTRIBUTE = "data-openclaw-browser-ref";
async function withPlaywrightPageCdpSession(page, fn, timeoutMs, frame) {
	let session;
	let released = false;
	let detach;
	const releaseSession = () => {
		if (session) detach ??= session.detach().catch(() => {});
		return detach;
	};
	const operation = (async () => {
		let ownerFrame = frame;
		for (;;) try {
			session = await page.context().newCDPSession(ownerFrame ?? page);
			break;
		} catch (error) {
			if (!ownerFrame || !(error instanceof Error) || !error.message.includes("does not have a separate CDP session")) throw error;
			ownerFrame = ownerFrame.parentFrame() ?? void 0;
		}
		try {
			if (released) throw new Error("Page CDP operation has already expired.");
			return await fn(session);
		} finally {
			await releaseSession();
		}
	})();
	try {
		return await withTimeout(operation, timeoutMs ?? 0, "Page CDP operation");
	} finally {
		released = true;
		releaseSession();
	}
}
/** Run a function with a CDP send helper scoped to one Playwright page. */
async function withPageScopedCdpClient(opts) {
	return await withPlaywrightPageCdpSession(opts.page, async (session) => await opts.fn(session.send.bind(session)), opts.timeoutMs, opts.frame);
}
/** Bind the already-resolved selector element to its native DOM identity, including shadow roots. */
async function withCdpSnapshotRoot(opts) {
	const attribute = `data-openclaw-capture-${randomUUID()}`;
	let searchId;
	try {
		await opts.root.evaluate((element, name) => element.setAttribute(name, ""), attribute);
		await opts.send("DOM.getDocument", { depth: 0 });
		const search = await opts.send("DOM.performSearch", {
			query: `[${attribute}]`,
			includeUserAgentShadowDOM: true
		});
		searchId = search.searchId;
		if (search.resultCount !== 1) throw new Error("Snapshot root changed before native capture; retry.");
		const { nodeIds } = await opts.send("DOM.getSearchResults", {
			searchId,
			fromIndex: 0,
			toIndex: 1
		});
		const { node } = await opts.send("DOM.describeNode", { nodeId: nodeIds[0] });
		return await opts.run(node.backendNodeId);
	} finally {
		if (searchId) await opts.send("DOM.discardSearchResults", { searchId }).catch(() => {});
		await opts.root.evaluate((element, name) => element.removeAttribute(name), attribute).catch(() => {});
	}
}
/** Read the browser-owned loader identity for a Playwright page's main frame. */
async function readMainFrameDocumentIdentityForPage(page, timeoutMs) {
	return (await readDocumentIdentitiesForPage(page, timeoutMs)).mainFrame;
}
/** Read committed document identities through one bounded page session. */
async function readDocumentIdentitiesForPage(page, timeoutMs) {
	return await withPlaywrightPageCdpSession(page, async (session) => await readCdpDocumentIdentities(session.send.bind(session)), resolveTimerTimeoutMs(timeoutMs, 5e3));
}
/** Mark backend DOM node ids on the page with browser ref attributes. */
async function markBackendDomRefsOnPage(opts) {
	const refs = opts.refs.filter((entry) => /^(?:e|ax)\d+$/.test(entry.ref) && Number.isFinite(entry.backendDOMNodeId) && Math.floor(entry.backendDOMNodeId) > 0);
	const marked = /* @__PURE__ */ new Set();
	const mark = async (send) => {
		opts.assertCurrent();
		const { root } = await send("DOM.getDocument", { depth: 0 });
		opts.assertCurrent();
		const { object } = await send("DOM.resolveNode", { backendNodeId: opts.rootBackendNodeId ?? root.backendNodeId });
		try {
			opts.assertCurrent();
			if (!object.objectId) throw new Error("Snapshot document changed before refs were bound; retry.");
			const cleared = await send("Runtime.callFunctionOn", {
				objectId: object.objectId,
				functionDeclaration: `function(attribute) {
          const roots = [this.ownerDocument || this];
          for (const root of roots) {
            for (const element of root.querySelectorAll("*")) {
              if (element.hasAttribute(attribute)) element.removeAttribute(attribute);
              if (element.shadowRoot) roots.push(element.shadowRoot);
            }
          }
        }`,
				arguments: [{ value: BROWSER_REF_MARKER_ATTRIBUTE }]
			});
			opts.assertCurrent();
			if (cleared.exceptionDetails) throw new Error("Snapshot markers could not be cleared; retry.");
		} finally {
			if (object.objectId) await send("Runtime.releaseObject", { objectId: object.objectId }).catch(() => {});
		}
		opts.assertCurrent();
		if (!refs.length) return marked;
		const backendNodeIds = uniqueValues(refs.map((entry) => Math.floor(entry.backendDOMNodeId)));
		const pushed = await send("DOM.pushNodesByBackendIdsToFrontend", { backendNodeIds }).catch(() => ({ nodeIds: [] }));
		opts.assertCurrent();
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
			opts.assertCurrent();
			try {
				await send("DOM.setAttributeValue", {
					nodeId,
					name: BROWSER_REF_MARKER_ATTRIBUTE,
					value: entry.ref
				});
				marked.add(entry.ref);
			} catch {}
			opts.assertCurrent();
		}
		return marked;
	};
	return opts.send ? await mark(opts.send) : await withPageScopedCdpClient({
		page: opts.page,
		frame: opts.frame,
		fn: mark
	});
}
//#endregion
//#region extensions/browser/src/browser/pw-session-actions.ts
async function getObservedBrowserStateViaPlaywright(opts) {
	return getObservedBrowserStateForPage(await getPageForTargetId(opts));
}
/** Resolve a page and read its committed document identities. */
async function getDocumentIdentitiesViaPlaywright(opts) {
	return await readDocumentIdentitiesForPage(await getPageForTargetId(opts), opts.timeoutMs);
}
function refLocator(page, ref) {
	const normalized = ref.startsWith("@") ? ref.slice(1) : ref.startsWith("ref=") ? ref.slice(4) : ref;
	const isRoleRef = /^e\d+$/.test(normalized);
	if (isRoleRef || AX_REF_PATTERN.test(normalized)) {
		const state = pageStates.get(page);
		if (isRoleRef && state?.roleRefsMode === "aria") return (state.roleRefsFrame ?? page).locator(`aria-ref=${normalized}`);
		const info = state?.roleRefs?.[normalized];
		if (!info) throw new Error(`Unknown ref "${normalized}". Run a new snapshot and use a ref from that snapshot.`);
		const scope = state?.roleRefsFrame ?? page;
		if (info.domMarker) return scope.locator(`[${BROWSER_REF_MARKER_ATTRIBUTE}="${normalized}"]`);
		const locator = scope.getByRole(info.role, {
			name: info.name ?? /^$|^.{901,}$/s,
			exact: true
		});
		return info.nth !== void 0 ? locator.nth(info.nth) : locator;
	}
	return page.locator(`aria-ref=${normalized}`);
}
/** Close one or all cached Playwright browser connections. */
async function closePlaywrightBrowserConnection(opts) {
	const normalized = opts?.cdpUrl ? normalizeCdpUrl(opts.cdpUrl) : null;
	if (normalized) {
		await retirePlaywrightBrowserConnectionExact({ cdpUrl: normalized }).close();
		return;
	}
	const cdpUrls = /* @__PURE__ */ new Set([
		...cachedByCdpUrl.keys(),
		...connectingByCdpUrl.keys(),
		...retainedClosingByCdpUrl.keys()
	]);
	clearBlockedTargetsForCdpUrl();
	clearBlockedPageRefsForCdpUrl();
	const failed = (await Promise.allSettled([...cdpUrls].map(async (cdpUrl) => await retirePlaywrightBrowserConnectionExact({ cdpUrl }).close()))).find((result) => result.status === "rejected");
	if (failed) throw failed.reason;
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
	const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(opts.cdpUrl, opts.ssrfPolicy);
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(opts.cdpUrl);
	const listUrl = appendCdpPath(cdpHttpBase, "/json/list");
	const pages = await fetchJson(listUrl, 2e3, void 0, cdpControlPolicy).catch(() => null);
	if (!pages || pages.length === 0 || !opts.isCurrent()) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	const target = pages.find((p) => normalizeOptionalString(p.id) === targetId);
	const wsUrlRaw = normalizeOptionalString(target?.webSocketDebuggerUrl) ?? "";
	if (!wsUrlRaw) return;
	const wsUrl = normalizeCdpWsUrl(wsUrlRaw, cdpHttpBase);
	const wsPin = await assertCdpEndpointAllowed(wsUrl, cdpControlPolicy, {
		source: "discovered",
		configuredUrl: opts.cdpUrl
	});
	const needsAttach = cdpSocketNeedsAttach(wsUrl);
	if (!opts.isCurrent()) return;
	await withCdpSocket(wsUrl, async (send) => {
		let sessionId;
		try {
			if (needsAttach) {
				const attached = await send("Target.attachToTarget", {
					targetId: opts.targetId,
					flatten: true
				});
				sessionId = normalizeOptionalString(attached?.sessionId);
			}
			if (opts.isCurrent()) await send("Runtime.terminateExecution", void 0, sessionId);
			if (sessionId) send("Target.detachFromTarget", { sessionId }).catch(() => {});
		} catch {}
	}, {
		handshakeTimeoutMs: 2e3,
		commandTimeoutMs: 1500,
		lookup: wsPin?.lookup
	}).catch(() => {});
}
/** Force-disconnect a Playwright connection to unblock a stuck target operation. */
async function forceDisconnectPlaywrightForTarget(opts) {
	const normalized = normalizeCdpUrl(opts.cdpUrl);
	const browser = opts.page.context().browser();
	const cur = cachedByCdpUrl.get(normalized);
	if (!browser || cur?.browser !== browser) return;
	const targetId = normalizeOptionalString(opts.targetId) ?? "";
	if (targetId) await tryTerminateExecutionViaCdp({
		cdpUrl: normalized,
		targetId,
		ssrfPolicy: opts.ssrfPolicy,
		isCurrent: () => cachedByCdpUrl.get(normalized) === cur
	}).catch(() => {});
	evictStalePlaywrightBrowserConnection(normalized, browser);
}
async function withPlaywrightSafeReadReconnect(opts, run) {
	const connected = await connectBrowser(opts.cdpUrl, opts.ssrfPolicy);
	try {
		return await run(connected.browser);
	} catch (err) {
		if (!isRecoverablePlaywrightDisconnectError(err) || opts.signal.aborted) throw err;
		evictStalePlaywrightBrowserConnection(opts.cdpUrl, connected.browser);
		if (opts.signal.aborted) throw err;
		return await run((await connectBrowser(opts.cdpUrl, opts.ssrfPolicy)).browser);
	}
}
async function readPagesViaPlaywright(opts, signal) {
	return await withPlaywrightSafeReadReconnect({
		cdpUrl: opts.cdpUrl,
		ssrfPolicy: opts.ssrfPolicy,
		signal
	}, async (browser) => {
		signal.throwIfAborted();
		const contexts = opts.requireCompleteTargetList ? browser.contexts() : [];
		let publication = createDeferred();
		const wake = () => publication.resolve();
		const observedPages = /* @__PURE__ */ new Set();
		let nativeTargetsChanged = false;
		const onPageClosed = () => {
			nativeTargetsChanged = true;
			wake();
		};
		const observePage = (page) => {
			if (!observedPages.has(page)) {
				observedPages.add(page);
				page.on("close", onPageClosed);
			}
		};
		const onPage = (page) => {
			observePage(page);
			wake();
		};
		let disconnected = false;
		const onDisconnected = () => {
			disconnected = true;
			wake();
		};
		for (const context of contexts) {
			context.on("page", onPage);
			for (const page of context.pages()) observePage(page);
		}
		browser.on("disconnected", onDisconnected);
		signal.addEventListener("abort", wake, { once: true });
		try {
			const readNativeTargetIds = async () => {
				const session = browser.newBrowserCDPSession();
				let detaching;
				const detach = () => {
					detaching ??= session.then((owned) => owned.detach()).catch(() => {});
				};
				const cancelled = createDeferred();
				const onAbort = () => {
					cancelled.reject(signal.reason);
					detach();
				};
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
				try {
					const read = session.then((owned) => {
						signal.throwIfAborted();
						return owned.send("Target.getTargets");
					});
					const result = await Promise.race([read, cancelled.promise]);
					signal.throwIfAborted();
					if (!Array.isArray(result.targetInfos)) throw new Error("Browser target enumeration was unavailable.");
					return new Set(result.targetInfos.filter((info) => info.type === "page" && !isBlockedTarget(opts.cdpUrl, info.targetId)).map((info) => info.targetId));
				} finally {
					signal.removeEventListener("abort", onAbort);
					detach();
				}
			};
			let nativeTargetIds = opts.requireCompleteTargetList ? await readNativeTargetIds() : void 0;
			for (;;) {
				publication = createDeferred();
				signal.throwIfAborted();
				if (disconnected) throw new Error("Browser disconnected during page enumeration.");
				const candidatePages = (await getAllPages(browser)).filter((page) => !isBlockedPageRef(opts.cdpUrl, page));
				const pageResults = await Promise.all(candidatePages.map(async (page) => {
					let targetInfo;
					try {
						targetInfo = await pageTargetInfo(page);
					} catch (err) {
						if (isRecoverablePlaywrightDisconnectError(err)) {
							if (page.isClosed() && browser.isConnected()) return { status: "closed" };
							throw err;
						}
						targetInfo = null;
					}
					if (!targetInfo) return { status: "unresolved" };
					if (isBlockedTarget(opts.cdpUrl, targetInfo.targetId)) return { status: "blocked" };
					let url = "";
					try {
						url = page.url();
					} catch (err) {
						if (isRecoverablePlaywrightDisconnectError(err)) throw err;
					}
					return {
						status: "available",
						page: {
							targetId: targetInfo.targetId,
							title: targetInfo.title,
							url,
							type: "page"
						}
					};
				}));
				signal.throwIfAborted();
				if (disconnected) throw new Error("Browser disconnected during page enumeration.");
				if (nativeTargetIds && (nativeTargetsChanged || pageResults.some((result) => result.status === "closed"))) {
					nativeTargetsChanged = false;
					nativeTargetIds = await readNativeTargetIds();
				}
				const remainingTargetIds = nativeTargetIds ? new Set(nativeTargetIds) : void 0;
				const resolvedPages = pageResults.flatMap((result) => result.status === "available" && (!remainingTargetIds || remainingTargetIds.delete(result.page.targetId)) ? [result.page] : []);
				if ((opts.requireCompleteTargetList || resolvedPages.length === 0) && pageResults.some((result) => result.status === "unresolved")) return {
					status: "unavailable",
					reason: "target-identity-unresolved"
				};
				if (!remainingTargetIds?.size) return {
					status: "available",
					pages: resolvedPages
				};
				await publication.promise;
			}
		} finally {
			for (const context of contexts) context.off("page", onPage);
			for (const page of observedPages) page.off("close", onPageClosed);
			browser.off("disconnected", onDisconnected);
			signal.removeEventListener("abort", wake);
		}
	});
}
/** List pages through the persistent Playwright connection. */
async function listPagesViaPlaywright(opts) {
	const timeoutMs = typeof opts.timeoutMs === "number" && Number.isFinite(opts.timeoutMs) ? Math.max(1, Math.floor(opts.timeoutMs)) : opts.requireCompleteTargetList ? DEFAULT_BROWSER_ACTION_TIMEOUT_MS : void 0;
	let timer;
	const controller = new AbortController();
	const cancelled = createDeferred();
	const onCancelled = () => cancelled.reject(controller.signal.reason);
	controller.signal.addEventListener("abort", onCancelled, { once: true });
	const onAbort = () => controller.abort(opts.signal?.reason instanceof Error ? opts.signal.reason : /* @__PURE__ */ new Error("Playwright page enumeration was aborted."));
	opts.signal?.addEventListener("abort", onAbort, { once: true });
	if (opts.signal?.aborted) onAbort();
	if (timeoutMs !== void 0) {
		timer = setTimeout(() => {
			controller.abort(/* @__PURE__ */ new Error(`Playwright page enumeration timed out after ${timeoutMs}ms`));
		}, timeoutMs);
		timer.unref?.();
	}
	try {
		const enumeration = await Promise.race([readPagesViaPlaywright(opts, controller.signal), cancelled.promise]);
		if (enumeration.status === "unavailable") throw new Error("Playwright page target identities are temporarily unavailable.");
		return enumeration.pages;
	} finally {
		if (timer) clearTimeout(timer);
		opts.signal?.removeEventListener("abort", onAbort);
		controller.signal.removeEventListener("abort", onCancelled);
	}
}
/** Create a page and hand its exact cleanup operation to the adopting owner. */
async function createPageViaPlaywright(opts) {
	opts.signal?.throwIfAborted();
	const targetUrl = opts.url.trim() || "about:blank";
	const navigationPolicy = withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
	await assertBrowserNavigationAllowed({
		url: targetUrl,
		...navigationPolicy,
		signal: opts.signal
	});
	opts.signal?.throwIfAborted();
	const { browser } = await connectBrowser(opts.cdpUrl, opts.cdpPolicy ?? opts.ssrfPolicy);
	opts.signal?.throwIfAborted();
	const context = browser.contexts()[0] ?? await browser.newContext();
	opts.signal?.throwIfAborted();
	ensureContextState(context);
	const page = await context.newPage();
	const close = async () => {
		await page.close();
	};
	let navigationClosedBlockedTarget = false;
	try {
		opts.signal?.throwIfAborted();
		ensurePageState(page);
		clearBlockedPageRef(opts.cdpUrl, page);
		const createdTargetId = (await pageTargetInfo(page).catch(() => null))?.targetId ?? null;
		opts.signal?.throwIfAborted();
		clearBlockedTarget(opts.cdpUrl, createdTargetId ?? void 0);
		if (targetUrl !== "about:blank") {
			let response;
			try {
				response = await gotoPageWithNavigationGuard({
					cdpUrl: opts.cdpUrl,
					page,
					url: targetUrl,
					timeoutMs: 3e4,
					...navigationPolicy,
					targetId: createdTargetId ?? void 0,
					assertPageCurrent: () => opts.signal?.throwIfAborted()
				});
			} catch (error) {
				navigationClosedBlockedTarget = isPolicyDenyNavigationError(error);
				throw error;
			}
			opts.signal?.throwIfAborted();
			await assertPageNavigationCompletedSafely({
				cdpUrl: opts.cdpUrl,
				page,
				response,
				...navigationPolicy,
				targetId: createdTargetId ?? void 0
			});
		}
		const tid = createdTargetId ?? (await pageTargetInfo(page).catch(() => null))?.targetId ?? null;
		opts.signal?.throwIfAborted();
		if (!tid) throw new Error("Failed to get targetId for new page");
		const title = await page.title().catch(() => "");
		opts.signal?.throwIfAborted();
		return {
			targetId: tid,
			title,
			url: page.url(),
			type: "page",
			close
		};
	} catch (error) {
		if (!navigationClosedBlockedTarget) await close().catch(() => {});
		throw error;
	}
}
/**
* Close a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/close is ephemeral.
*/
async function closePageByTargetIdViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	opts.signal?.throwIfAborted();
	if (readBrowserDashboardTabs().length > 0) {
		const targetId = (await pageTargetInfo(page))?.targetId;
		opts.signal?.throwIfAborted();
		if (!targetId) throw new Error("Cannot verify that this page is not retained by a dashboard");
		assertBrowserDashboardTabCanClose(targetId);
	}
	await page.close();
}
/**
* Focus a page/tab by targetId using the persistent Playwright connection.
* Used for remote profiles where HTTP-based /json/activate can be ephemeral.
*/
async function focusPageByTargetIdViaPlaywright(opts) {
	const page = await getPageForTargetId(opts);
	if (opts.assertCurrent) await opts.assertCurrent();
	opts.signal?.throwIfAborted();
	await page.bringToFront();
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
	if (error instanceof BrowserError) return error;
	const message = stripVTControlCharacters(formatErrorMessage(error));
	const headline = (message.split("\n", 1)[0] ?? message).replace(/^(?:Error:\s*)?(?:locator\.\w+:\s*)?(?:Error:\s*)?/, "");
	const locatorTimeout = /^Timeout \d+ms exceeded\./.test(headline);
	const label = truncateUtf16Safe(selector, 200);
	const failure = (detail) => new BrowserActionError(detail, 500, { cause: error });
	if (headline.startsWith("strict mode violation")) {
		const countMatch = headline.match(/resolved to (\d+) elements/);
		return failure(`Selector "${label}" matched ${countMatch ? countMatch[1] : "multiple"} elements. Run a new snapshot to get updated refs, or use a different ref.`);
	}
	for (const [pattern, detail] of [
		[/^Element is not an <input>/i, "is not editable: this control does not support text input. Use an editable input, textarea, or contenteditable element."],
		[/^Cannot type text into input\[type=number\]/i, "requires a numeric value. Use a valid number instead of text."],
		[/^Input of type "[^"]+" cannot be filled/i, "has an input type that cannot be filled. Use the interaction appropriate for this control."],
		[/^Malformed value/i, "rejected the value format. Use a value supported by this input type."]
	]) if (pattern.test(headline)) return failure(`Element "${label}" ${detail}`);
	for (const line of locatorTimeout ? message.split("\n").toReversed() : [headline]) {
		const diagnostic = line.trim().replace(/^(?:-\s*|\d+\s*×\s*)/, "");
		const state = diagnostic.match(/^element is not (editable|enabled|visible|stable)$/i)?.[1]?.toLowerCase();
		if (state === "editable") return failure(`Element "${label}" is not editable (for example, read-only). Use an editable control.`);
		if (state === "enabled") return failure(`Element "${label}" is not enabled. Complete any prerequisites that enable the control.`);
		if (state === "stable") return failure(`Element "${label}" is not stable. Wait for movement or animation to finish before interacting.`);
		if (state === "visible" || /^<.*>.*intercepts pointer events$/.test(diagnostic) || /^Element is not (?:receiving|receive) pointer events/i.test(diagnostic)) return failure(`Element "${label}" is not interactable (${state === "visible" ? "not visible" : "covered; another element intercepts pointer events"}). Try scrolling it into view, closing overlays, or re-snapshotting.`);
	}
	if (locatorTimeout && !message.includes("locator resolved to") && (message.includes("to be visible") || message.includes("waiting for locator(") || message.includes("waiting for getByRole("))) return failure(`Element "${label}" not found or not visible. Run a new snapshot to see current page elements.`);
	return error instanceof Error ? error : new Error(message);
}
//#endregion
//#region extensions/browser/src/browser/pw-tools-core.interactions.navigation.ts
var BrowserInteractionAuthorityError = class extends Error {
	constructor(error) {
		const cause = toErrorObject(error, "Browser interaction authority changed");
		super(cause.message, { cause });
		this.name = "BrowserInteractionAuthorityError";
	}
};
async function assertInteractionCurrent(opts) {
	try {
		await opts.assertCurrent?.();
	} catch (error) {
		throw new BrowserInteractionAuthorityError(error);
	}
}
function interactionNavigationPolicy(opts) {
	return withBrowserNavigationPolicy(opts.ssrfPolicy, { browserProxyMode: opts.browserProxyMode });
}
function hasInteractionNavigationPolicy(policy) {
	return Boolean(policy.ssrfPolicy || policy.browserProxyMode);
}
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
	return isBrowserObservedDialogBlockedError(err) || err instanceof BrowserInteractionAuthorityError ? err : toAIFriendlyError(err, label);
}
function reconcileRemoteDialogAfterActionSettled(page, signal) {
	if (isBrowserObservedDialogBlockedError(signal?.reason)) markObservedDialogsHandledRemotelyForPage(page, signal.reason.browserState.dialogs.pending);
}
function throwIfInteractionAborted(signal) {
	if (signal?.aborted) throw toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection");
}
async function runCancellablePageInteraction(page, opts, action, errorLabel) {
	const cancellation = new AbortController();
	const interruption = new AbortController();
	const onAbort = () => {
		(isBrowserObservedDialogBlockedError(opts.signal?.reason) ? interruption : cancellation).abort(opts.signal?.reason);
	};
	opts.signal?.addEventListener("abort", onAbort, { once: true });
	if (opts.signal?.aborted) onAbort();
	const { abortPromise, cleanup } = createAbortPromiseWithListener(interruption.signal);
	try {
		const result = await awaitNavigationGuardedInteraction({
			action: () => action(cancellation.signal),
			cdpUrl: opts.cdpUrl,
			page,
			...interactionNavigationPolicy(opts),
			targetId: opts.targetId,
			assertCurrent: opts.assertCurrent
		}, abortPromise, opts.signal, () => reconcileRemoteDialogAfterActionSettled(page, opts.signal));
		throwIfInteractionAborted(opts.signal);
		return result;
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError" && error.cause === cancellation.signal.reason) throwIfInteractionAborted(cancellation.signal);
		throw errorLabel === void 0 ? error : toFriendlyInteractionError(error, errorLabel);
	} finally {
		opts.signal?.removeEventListener("abort", onAbort);
		cleanup();
	}
}
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
async function assertSubframeNavigationAllowed(frameUrl, navigationPolicy) {
	if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode || !frameUrl.startsWith("http://") && !frameUrl.startsWith("https://")) return;
	await assertBrowserNavigationResultAllowed({
		url: frameUrl,
		...navigationPolicy
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
	const navigationPolicy = interactionNavigationPolicy(opts);
	let subframeError;
	try {
		for (const frameUrl of opts.observed.subframes) await assertSubframeNavigationAllowed(frameUrl, navigationPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (opts.observed.mainFrameNavigated) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toErrorObject(subframeError, "Non-Error thrown");
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
		}, 250);
		const cleanup = () => {
			clearTimeout(timeout);
			page.off("framenavigated", onFrameNavigated);
		};
		page.on("framenavigated", onFrameNavigated);
	});
}
function scheduleDelayedInteractionNavigationGuard(opts) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	if (!hasInteractionNavigationPolicy(navigationPolicy)) return Promise.resolve();
	const page = opts.page;
	if (didCrossDocumentUrlChange(page, opts.previousUrl)) return assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (typeof page.on !== "function" || typeof page.off !== "function") return Promise.resolve();
	pendingInteractionNavigationGuardCleanup.get(opts.page)?.();
	return new Promise((resolve, reject) => {
		const settle = (err) => {
			cleanup();
			if (err) {
				reject(toErrorObject(err, "Non-Error rejection"));
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
				...navigationPolicy,
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
				...navigationPolicy,
				targetId: opts.targetId,
				observed: {
					mainFrameNavigated: didCrossDocumentUrlChange(page, opts.previousUrl),
					subframes
				}
			}).then(() => settle(), settle);
		}, 250);
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
	const navigationPolicy = interactionNavigationPolicy(opts);
	if (!hasInteractionNavigationPolicy(navigationPolicy)) return await opts.action();
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
		for (const frameUrl of subframeNavigationsDuringAction) await assertSubframeNavigationAllowed(frameUrl, navigationPolicy);
	} catch (err) {
		subframeError = err;
	}
	if (navigationObserved) await assertPageNavigationCompletedSafely({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		response: null,
		...navigationPolicy,
		targetId: opts.targetId
	});
	else if (actionError) {
		const observed = await observeDelayedInteractionNavigation(opts.page, opts.previousUrl);
		if (observed.mainFrameNavigated || observed.subframes.length > 0) await assertObservedDelayedNavigations({
			cdpUrl: opts.cdpUrl,
			page: opts.page,
			...navigationPolicy,
			targetId: opts.targetId,
			observed
		});
	} else await scheduleDelayedInteractionNavigationGuard({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		previousUrl: opts.previousUrl,
		...navigationPolicy,
		targetId: opts.targetId
	});
	if (subframeError) throw toErrorObject(subframeError, "Non-Error thrown");
	if (actionError) throw toErrorObject(actionError, "Non-Error thrown");
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
async function awaitNavigationGuardedInteraction(opts, abortPromise, signal, onActionResolvedAfterAbort) {
	const navigationPolicy = interactionNavigationPolicy(opts);
	const hasNavigationPolicy = hasInteractionNavigationPolicy(navigationPolicy);
	let observedPolicyError;
	const activePolicyChecks = /* @__PURE__ */ new Set();
	let unsafeSourceQuarantine;
	const quarantineUnsafeSource = () => unsafeSourceQuarantine ??= quarantineBlockedNavigationTarget({
		cdpUrl: opts.cdpUrl,
		page: opts.page,
		targetId: opts.targetId
	});
	const guardedAction = withPageNavigationRequestGuard({
		page: opts.page,
		...navigationPolicy,
		onPolicyCheckStarted: (check) => {
			const tracked = check.then(() => ({ state: "allowed" }), (error) => ({
				state: "failed",
				error
			}));
			activePolicyChecks.add(tracked);
			tracked.then((outcome) => {
				if (outcome.state === "allowed") activePolicyChecks.delete(tracked);
			});
		},
		onPolicyDenied: (event) => {
			observedPolicyError = event.error;
			if (event.state === "handled" && !event.sourcePreserved) quarantineUnsafeSource().catch(() => {});
		},
		action: async (baselineUrl) => {
			let actionSettledAtMs;
			try {
				return await assertInteractionNavigationCompletedSafely({
					...opts,
					action: async () => {
						try {
							if (opts.assertCurrent) await assertInteractionCurrent(opts);
							throwIfInteractionAborted(signal);
							return await opts.action();
						} finally {
							actionSettledAtMs = Date.now();
						}
					},
					previousUrl: baselineUrl
				});
			} finally {
				if (hasNavigationPolicy && actionSettledAtMs !== void 0) {
					const elapsedMs = Math.max(0, Date.now() - actionSettledAtMs);
					const remainingMs = Math.max(0, 250 - elapsedMs);
					if (remainingMs > 0) await new Promise((resolve) => {
						setTimeout(resolve, remainingMs);
					});
					await assertPageNavigationCompletedSafely({
						cdpUrl: opts.cdpUrl,
						page: opts.page,
						response: null,
						...navigationPolicy,
						targetId: opts.targetId
					});
				}
			}
		}
	}).catch(async (err) => {
		if (isPolicyDenyNavigationError(err) && !wasBrowserNavigationSourcePreservedAfterPolicyDenial(err)) await quarantineUnsafeSource();
		throw err;
	});
	try {
		return await awaitActionWithAbort(guardedAction, abortPromise, onActionResolvedAfterAbort);
	} catch (err) {
		if (observedPolicyError === void 0 && activePolicyChecks.size > 0) observedPolicyError = (await Promise.all(activePolicyChecks)).find((outcome) => outcome.state === "failed" && isPolicyDenyNavigationError(outcome.error))?.error;
		if (observedPolicyError !== void 0) {
			await guardedAction;
			throw toErrorObject(observedPolicyError, "Non-Error thrown");
		}
		throw err;
	}
}
function createAbortPromiseWithListener(signal, onAbort) {
	if (!signal) return { cleanup: () => {} };
	let abortListener;
	const abortPromise = signal.aborted ? (() => {
		onAbort?.(signal.reason);
		return Promise.reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
	})() : new Promise((_, reject) => {
		abortListener = () => {
			onAbort?.(signal.reason);
			reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
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
//#endregion
export { getObservedBrowserStateForPage as $, readMainFrameDocumentIdentityForPage as A, connectBrowser as B, focusPageByTargetIdViaPlaywright as C, listPagesViaPlaywright as D, getObservedBrowserStateViaPlaywright as E, gotoPageWithNavigationGuard as F, retirePlaywrightBrowserConnectionExact as G, getPageForTargetId as H, isPolicyDenyNavigationError as I, beginActionDownloadCaptureOnPage as J, pageTargetInfo as K, quarantineBlockedNavigationTarget as L, withPageScopedCdpClient as M, assertPageNavigationCompletedSafely as N, refLocator as O, closeBlockedNavigationTarget as P, ensurePageState as Q, wasBrowserNavigationSourcePreservedAfterPolicyDenial as R, createPageViaPlaywright as S, getDocumentIdentitiesViaPlaywright as T, hasCachedPlaywrightBrowserConnection as U, ensureContextState as V, retirePlaywrightBrowserConnection as W, armObservedDialogResponseOnPage as X, isDownloadStartingNavigationError as Y, createObservedDialogAbortSignalForPage as Z, requireRef as _, createAbortPromiseWithListener as a, isBrowserObservedDialogBlockedError as at, closePageByTargetIdViaPlaywright as b, interactionNavigationPolicy as c, planAnnotations as ct, runCancellablePageInteraction as d, normalizeBrowserEvaluateFunctionSource as dt, markObservedDialogsHandledRemotelyForPage as et, throwIfInteractionAborted as f, normalizeTimeoutMs as g, bumpUploadArmId as h, awaitNavigationGuardedInteraction as i, createDownloadCaptureForPage as it, withCdpSnapshotRoot as j, markBackendDomRefsOnPage as k, reconcileRemoteDialogAfterActionSettled as l, scaleAnnotations as lt, bumpDownloadArmId as m, assertInteractionCurrent as n, restoreRoleRefsForTarget as nt, getRestoredPageForTarget as o, buildOverlayClearScript as ot, toFriendlyInteractionError as p, closeRelayOperationConnection as q, awaitActionWithAbort as r, storeRoleRefsForTarget as rt, hasInteractionNavigationPolicy as s, buildOverlayInjectionScript as st, BrowserInteractionAuthorityError as t, respondToObservedDialogOnPage as tt, resolveBoundedDelayMs as u, matchBrowserUrlPattern as ut, requireRefOrSelector as v, forceDisconnectPlaywrightForTarget as w, closePlaywrightBrowserConnection as x, toAIFriendlyError as y, withPageNavigationRequestGuard as z };
