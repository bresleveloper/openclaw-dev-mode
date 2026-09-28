import { C as parseStrictNonNegativeInteger, S as parseStrictInteger, p as clampPositiveTimerTimeoutMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue, l as normalizeOptionalString, m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as filterStringEntries, y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { c as isImageProcessorUnavailableError, f as resizeToJpeg, n as buildImageResizeSideGrid, o as getImageMetadata, t as IMAGE_REDUCE_QUALITY_STEPS } from "./image-ops-CU4vxSlO.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { a as ensureMediaDir, f as saveMediaBuffer } from "./store-BrX2xbJz.mjs";
import "./number-runtime-CGwowceO.mjs";
import { t as pathScope } from "./security-runtime-HdPo6iAV.mjs";
import { n as redactCdpUrl, t as parseBrowserHttpUrl } from "./browser-cdp-nPpqdqz_.mjs";
import { n as DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS, r as DEFAULT_AI_SNAPSHOT_MAX_CHARS, u as DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS } from "./constants-DKjTvIBP.mjs";
import { t as normalizeBrowserTimerDelayMs } from "./timer-delay-DhAs5gz8.mjs";
import { a as EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS, d as resolveBrowserNavigationTimeoutMs, f as resolveExistingSessionActTimeouts, n as ACT_MAX_VIEWPORT_DIMENSION, r as ACT_MAX_WAIT_TIME_MS, s as normalizeActBoundedNonNegativeMs, t as ACT_MAX_CLICK_DELAY_MS } from "./act-policy-3Ku82pq-.mjs";
import { i as resolveBrowserConfig, n as getOwnBrowserProfile, o as resolveManagedBrowserHeadlessMode, r as isLocalManagedProfile, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { a as BrowserConflictError, c as BrowserProfileUnavailableError, d as BrowserTabNotFoundError, f as BrowserTargetAmbiguousError, h as toBrowserErrorResponse, o as BrowserError, p as BrowserValidationError, s as BrowserProfileNotFoundError, t as BROWSER_ACT_ERROR_CODES } from "./errors-CXz-2iKA.mjs";
import { i as shouldUsePlaywrightForScreenshot, n as resolveDefaultSnapshotFormat, r as shouldUsePlaywrightForAriaSnapshot, t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import { a as resolveSuggestedImportTarget, i as recordSystemProfileImport, n as dismissSystemProfileImportPrompt, r as readSystemProfileImportState } from "./system-profile-import-state-DFy4mHBX.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import "./errors-DS4y5mrd.mjs";
import { n as getPwAiModule$1, t as getLoadedPwAiModule } from "./pw-ai-module-CkFmw8wA.mjs";
import { r as mintBrowserScreencastToken } from "./tokens-6QA9aAzN.mjs";
import { a as getOrCreateProfileRuntime, c as isProfileGenerationCurrent, l as isProfileRestartRequiredError, o as getProfileLifecycle, r as beginProfileTransition } from "./server-context.lifecycle-NJR9GfQj.mjs";
import { A as STRUCTURAL_ROLES, E as getRoleSnapshotIdentityKeys, F as assertBrowserNavigationResultAllowed, N as assertBrowserNavigationAllowed, O as CONTENT_ROLES, R as withBrowserNavigationPolicy, S as appendSnapshotUrls, V as resolveBrowserNavigationProxyMode, b as snapshotRoleViaCdp, c as resolveOpenClawUserDataDir, h as captureScreenshot, j as appendRoleSnapshotDepthTruncationMarker, k as INTERACTIVE_ROLES, n as getChromeWebSocketEndpoint, v as getDocumentIdentitiesViaCdp, w as finalizeRoleSnapshot, y as snapshotAria } from "./chrome-BYoc4jk9.mjs";
import { i as resolveExistingUploadPaths, n as DEFAULT_TRACE_DIR, t as DEFAULT_DOWNLOAD_DIR } from "./paths-BD1L9gFZ.mjs";
import { _ as withCdpSocket, d as redactCdpErrorText, n as assertCdpEndpointAllowed } from "./cdp.helpers-DHnECuD4.mjs";
import "./utils-Cs3fQhZS.mjs";
import { t as resolveBrowserExecutableForPlatform } from "./chrome.executables-Cv2wahLt.mjs";
import { t as ensureOutputDirectory } from "./output-directories-CQa36ejE.mjs";
import "./config-Cs3fQhZS.mjs";
import { r as isValidProfileName } from "./profiles-CQrkMz7M.mjs";
import { i as setDefaultBrowserProfile, n as deleteBrowserProfileConfig, t as createBrowserProfileConfig } from "./config-mutations-D2mQeaT-.mjs";
import { t as movePathToTrash } from "./trash-CAu63IBo.mjs";
import "./sdk-setup-tools-Cu4qMD1_.mjs";
import { n as resolveCdpControlPolicy } from "./cdp-reachability-policy-BY3s_i-8.mjs";
import { dt as normalizeBrowserEvaluateFunctionSource, lt as scaleAnnotations, n as assertInteractionCurrent, t as BrowserInteractionAuthorityError, ut as matchBrowserUrlPattern } from "./pw-tools-core.interactions.navigation-C9zSccia.mjs";
import { n as importSystemProfileCookies, r as listSystemProfiles, s as parseSystemProfileDomains } from "./system-profiles-BTo99j-k.mjs";
import { i as resolveTargetIdFromTabs, r as withProfileContextOperation } from "./server-context-A9sD7-b4.mjs";
import { C as withChromeMcpDocument, D as extractJsonMessage, E as withChromeMcpTarget, F as ChromeMcpDocumentUnavailableError, I as rethrowChromeMcpDocumentError, S as uploadChromeMcpFile, T as resolveChromeMcpSnapshotRef, a as clickChromeMcpCoords, b as takeChromeMcpScreenshotOnTarget, c as dragChromeMcpElement, d as fillChromeMcpForm, g as resizeChromeMcpPage, h as pressChromeMcpKey, k as getChromeMcpPid, l as evaluateChromeMcpScript, m as navigateChromeMcpPage, o as clickChromeMcpElement, p as hoverChromeMcpElement, u as fillChromeMcpElement, v as selectChromeMcpOption, w as callTool, x as takeChromeMcpSnapshot, y as takeChromeMcpScreenshot } from "./chrome-mcp-7T-yR2EY.mjs";
import { i as normalizeBrowserFormFields } from "./form-fields-PPIIbhqD.mjs";
import { n as getCachedChromeGraphicsDiagnostics, r as inspectChromeGraphicsDiagnostics, t as formatBrowserGraphicsSummary } from "./chrome.graphics-su7Tu3ZP.mjs";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import crypto, { randomUUID } from "node:crypto";
//#region extensions/browser/src/browser/screenshot.ts
/**
* Browser screenshot normalization helpers that bound screenshots for media
* transport and model input.
*/
const DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = 2e3;
const DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = 5242880;
/** Downscales/re-encodes screenshots to fit Browser plugin byte and dimension caps. */
async function normalizeBrowserScreenshot(buffer, opts) {
	const maxSide = Math.max(1, Math.round(opts?.maxSide ?? 2e3));
	const maxBytes = Math.max(1, Math.round(opts?.maxBytes ?? 5242880));
	const meta = await getImageMetadata(buffer);
	const width = meta?.width ?? 0;
	const height = meta?.height ?? 0;
	const maxDim = Math.max(width, height);
	if (buffer.byteLength <= maxBytes && (maxDim === 0 || width <= maxSide && height <= maxSide)) return {
		buffer,
		sourceDimensions: meta
	};
	const sideGrid = buildImageResizeSideGrid(maxSide, maxDim > 0 ? Math.min(maxSide, maxDim) : maxSide);
	let smallestSize;
	let processorUnavailableError;
	for (const side of sideGrid) {
		for (const quality of IMAGE_REDUCE_QUALITY_STEPS) {
			let out;
			try {
				out = await resizeToJpeg({
					buffer,
					maxSide: side,
					quality,
					withoutEnlargement: true
				});
			} catch (err) {
				if (isImageProcessorUnavailableError(err)) {
					processorUnavailableError = err;
					break;
				}
				throw err;
			}
			if (smallestSize === void 0 || out.byteLength < smallestSize) smallestSize = out.byteLength;
			if (out.byteLength <= maxBytes) return {
				buffer: out,
				contentType: "image/jpeg",
				sourceDimensions: meta
			};
		}
		if (processorUnavailableError) break;
	}
	if (processorUnavailableError) throw toErrorObject(processorUnavailableError, "Non-Error thrown");
	const bestSize = smallestSize ?? buffer.byteLength;
	throw new Error(`Browser screenshot could not be reduced below ${(maxBytes / 1048576).toFixed(0)}MB (got ${(bestSize / 1048576).toFixed(2)}MB)`);
}
//#endregion
//#region extensions/browser/src/browser/request-policy.ts
/**
* Request policy helpers for profile-aware Browser control server routes.
*/
function isManagedOnlyBrowserRequest(params) {
	return params.query?.managedOnly === true || params.query?.managedOnly === "true" || asNullableRecord(params.body)?.managedOnly === true;
}
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
	if (method === "POST" && (normalizedPath === "/profiles/create" || normalizedPath === "/profiles/import" || normalizedPath === "/reset-profile")) return true;
	return method === "DELETE" && /^\/profiles\/[^/]+$/.test(normalizedPath);
}
/**
* Returns true for the system-profile cookie import route. Import must run where
* the user's Keychain lives, so it is exempt from the host-local persistent
* mutation block while remaining blocked over a node proxy.
*/
function isBrowserSystemProfileImport(method, path) {
	return method === "POST" && normalizeBrowserRequestPath(path) === "/profiles/import";
}
/**
* Returns true for routes that only make sense on the host that owns the local
* Keychain and Chrome-family profiles: system-profile listing and import. These
* must be dispatched host-local and never proxied to a browser node.
*/
function isBrowserHostLocalRoute(method, path) {
	if (isBrowserSystemProfileImport(method, path)) return true;
	const normalizedPath = normalizeBrowserRequestPath(path);
	return method === "GET" && (normalizedPath === "/system-profiles" || normalizedPath === "/system-profile-import/status") || method === "POST" && normalizedPath === "/system-profile-import/dismiss";
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
//#region extensions/browser/src/browser/snapshot-delta-cache.ts
/**
* Process-local snapshot delta state owned by one browser control runtime.
* Each tab/options family keeps one previous-key slot; restart or tab close drops it.
*/
const SNAPSHOT_DELTA_CACHE_MAX_ENTRIES = 32;
const cacheByState = /* @__PURE__ */ new WeakMap();
function getCache(ctx) {
	const existing = cacheByState.get(ctx.state());
	if (existing) return existing;
	const cache = /* @__PURE__ */ new Map();
	cacheByState.set(ctx.state(), cache);
	return cache;
}
function cacheKey(params) {
	return JSON.stringify([
		params.profile,
		params.targetId,
		params.family
	]);
}
function getPreviousSnapshotKeys(ctx, params) {
	const cache = getCache(ctx);
	const key = cacheKey(params);
	const entry = cache.get(key);
	if (!entry) return;
	if (entry.documentIdentity !== params.documentIdentity) {
		cache.delete(key);
		return;
	}
	cache.delete(key);
	cache.set(key, entry);
	return entry.keys;
}
function recordSnapshotKeys(ctx, params) {
	const cache = getCache(ctx);
	const key = cacheKey(params);
	cache.delete(key);
	cache.set(key, {
		profile: params.profile,
		targetId: params.targetId,
		documentIdentity: params.documentIdentity,
		keys: getRoleSnapshotIdentityKeys(params.refs, params.family.identity)
	});
	while (cache.size > SNAPSHOT_DELTA_CACHE_MAX_ENTRIES) {
		const oldest = cache.keys().next().value;
		if (oldest === void 0) break;
		cache.delete(oldest);
	}
}
function clearSnapshotKeysForTab(ctx, profile, targetId) {
	const cache = cacheByState.get(ctx.state());
	if (!cache) return;
	for (const [key, entry] of cache) if (entry.profile === profile && entry.targetId === targetId) cache.delete(key);
}
//#endregion
//#region extensions/browser/src/browser/routes/utils.ts
/**
* Browser route utility functions.
*
* Profile lookup, JSON errors, and route value coercion shared across browser
* control endpoints.
*/
/**
* Extract profile name from query string or body and get profile context.
* Query string takes precedence over body for consistency with GET routes.
*/
/** Resolve the profile context requested by query/profile parameters. */
function getProfileContext(req, ctx) {
	try {
		const profile = ctx.forProfile(resolveRequestedBrowserProfile(req));
		if (isManagedOnlyBrowserRequest(req) && !isLocalManagedProfile(profile.profile)) return {
			error: "This dashboard requires a local managed browser profile",
			status: 400
		};
		return profile;
	} catch (err) {
		const mapped = ctx.mapTabError(err);
		return mapped ? {
			error: mapped.message,
			status: mapped.status
		} : {
			error: String(err),
			status: 404
		};
	}
}
/** Run one profile-scoped route transaction, restarting an unhealthy owned browser once. */
async function runProfileRouteOperation(params) {
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		return await withProfileContextOperation(params.profileCtx, params.signal, async (signal) => {
			if (params.assertCurrent) await params.assertCurrent(params.profileCtx.profile);
			signal.throwIfAborted();
			return await params.run(signal);
		});
	} catch (err) {
		if (!isProfileRestartRequiredError(err)) throw err;
		if (attempt !== 0) throw new BrowserProfileUnavailableError(`Browser profile "${params.profileCtx.profile.name}" could not stabilize after restart.`);
		try {
			await params.profileCtx.ensureBrowserAvailable({ signal: params.signal });
		} catch (restartErr) {
			if (isProfileRestartRequiredError(restartErr)) throw new BrowserProfileUnavailableError(`Browser profile "${params.profileCtx.profile.name}" could not restart.`);
			throw restartErr;
		}
	}
	throw new Error("browser profile could not stabilize");
}
/** Send a simple JSON error response. */
function jsonError(res, status, message) {
	res.status(status).json({ error: message });
}
/** Send a mapped browser-domain error while preserving validated metadata. */
function jsonBrowserError(res, error) {
	res.status(error.status).json({
		error: error.message,
		...error.code ? { code: error.code } : {},
		..."reason" in error ? { reason: error.reason } : {},
		..."details" in error ? { details: error.details } : {}
	});
}
/** Coerce route values to strings while treating nullish values as empty. */
function toStringOrEmpty(value) {
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return normalizeOptionalString(String(value)) ?? "";
	return "";
}
/** Return a canonical HTTP origin, or null when the route value is absent or invalid. */
function readHttpOrigin(value) {
	const raw = toStringOrEmpty(value);
	if (!raw) return null;
	try {
		const url = new URL(raw);
		return url.protocol === "http:" || url.protocol === "https:" ? url.origin : null;
	} catch {
		return null;
	}
}
/** Coerce route boolean values from booleans or common string forms. */
function toBoolean(value) {
	if (typeof value === "boolean") return value;
	if (typeof value !== "string" && typeof value !== "number") return;
	const normalized = String(value).trim().toLowerCase();
	if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
	if (normalized === "false" || normalized === "0" || normalized === "no") return false;
}
/** Coerce a route value to a string array when every entry is a string. */
function toStringArray(value) {
	if (!Array.isArray(value)) return;
	const strings = value.map((v) => toStringOrEmpty(v)).filter(Boolean);
	return strings.length ? strings : void 0;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.shared.ts
/**
* Shared browser route helpers.
*
* Centralizes body/query parsing, profile resolution, error mapping, Playwright
* availability checks, and tab-context guards for route modules.
*/
const SELECTOR_UNSUPPORTED_MESSAGE = [
	"Error: 'selector' is not supported. Use 'ref' from snapshot instead.",
	"",
	"Example workflow:",
	"1. snapshot action to get page state with refs",
	"2. act with ref: \"e123\" to interact with element",
	"",
	"This is more reliable for modern SPAs."
].join("\n");
/** Return a safe object body for routes that accept JSON payloads. */
function readBody(req) {
	const body = req.body;
	if (!body || typeof body !== "object" || Array.isArray(body)) return {};
	return body;
}
/** Read an optional targetId from a request body. */
function resolveTargetIdFromBody(body) {
	return (normalizeOptionalString(body.targetId) ?? "") || void 0;
}
/** Read an optional targetId from a query object. */
function resolveTargetIdFromQuery(query) {
	return (normalizeOptionalString(query.targetId) ?? "") || void 0;
}
/** Map route-level browser errors to HTTP JSON responses. */
function handleRouteError(ctx, res, err) {
	if (isProfileRestartRequiredError(err)) throw err;
	const mapped = ctx.mapTabError(err);
	if (mapped) return jsonBrowserError(res, mapped);
	const browserMapped = toBrowserErrorResponse(err);
	if (browserMapped) return jsonBrowserError(res, browserMapped);
	jsonError(res, 500, redactCdpErrorText(String(err)));
}
/** Resolve the requested browser profile and respond with JSON on failure. */
function resolveProfileContext(req, res, ctx) {
	const profileCtx = getProfileContext(req, ctx);
	if ("error" in profileCtx) {
		jsonError(res, profileCtx.status, profileCtx.error);
		return null;
	}
	return profileCtx;
}
/** Build navigation guard policy for a profile and current resolved config. */
function browserNavigationPolicyForProfile(ctx, profileCtx) {
	return withBrowserNavigationPolicy(ctx.state().resolved.ssrfPolicy, { browserProxyMode: resolveBrowserNavigationProxyMode({
		resolved: ctx.state().resolved,
		profile: profileCtx.profile
	}) });
}
/** Load the optional Playwright bridge module in soft-fail mode. */
async function getPwAiModule() {
	return await getPwAiModule$1({ mode: "soft" });
}
/** Require Playwright support for a route feature, returning a 501 when absent. */
async function requirePwAi(res, feature) {
	const mod = await getPwAiModule();
	if (mod) return mod;
	jsonError(res, 501, [
		`Playwright is not available in this gateway build; '${feature}' is unsupported.`,
		"Reinstall or update OpenClaw so the core browser runtime dependency is present, then restart the gateway. In Docker, also install Chromium with the bundled playwright-core CLI.",
		"Docs: /tools/browser-control#playwright-requirement"
	].join("\n"));
	return null;
}
/** Resolve profile and tab context, optionally enforcing current URL policy. */
async function withRouteTabContext(params) {
	const profileCtx = params.profileCtx ?? resolveProfileContext(params.req, params.res, params.ctx);
	if (!profileCtx) return;
	const requestAssertCurrent = params.req.assertCurrent;
	const assertCurrent = requestAssertCurrent ? () => requestAssertCurrent(profileCtx.profile) : void 0;
	try {
		return await runProfileRouteOperation({
			profileCtx,
			signal: params.req.signal,
			assertCurrent: params.req.assertCurrent,
			run: async (signal) => {
				const tab = await profileCtx.ensureTabAvailable(params.targetId, {
					allowPlaywrightFallback: true,
					signal,
					timeoutMs: params.ctx.state().resolved.actionTimeoutMs
				});
				if (params.enforceCurrentUrlAllowed) await assertBrowserNavigationResultAllowed({
					url: tab.url,
					signal,
					...browserNavigationPolicyForProfile(params.ctx, profileCtx)
				});
				if (assertCurrent) await assertCurrent();
				return await params.run({
					profileCtx,
					tab,
					cdpUrl: profileCtx.profile.cdpUrl,
					signal,
					...assertCurrent ? { assertCurrent } : {},
					resolveTabUrl: (fallbackUrl) => resolveSafeRouteTabUrl({
						ctx: params.ctx,
						profileCtx,
						targetId: tab.targetId,
						fallbackUrl,
						signal,
						timeoutMs: params.ctx.state().resolved.actionTimeoutMs
					})
				});
			}
		});
	} catch (err) {
		if (isProfileRestartRequiredError(err)) throw err;
		handleRouteError(params.ctx, params.res, err);
		return;
	}
}
/**
* Response-only URL redaction. This swallows policy failures and must not be used as
* an execution gate; use enforceCurrentUrlAllowed on the route helper instead.
*/
async function resolveSafeRouteTabUrl(params) {
	let tabs;
	try {
		tabs = await params.profileCtx.listTabs({
			signal: params.signal,
			timeoutMs: params.timeoutMs
		});
	} catch {
		params.signal?.throwIfAborted();
		tabs = [];
	}
	const candidateUrl = tabs.find((tab) => tab.targetId === params.targetId)?.url ?? params.fallbackUrl;
	if (!candidateUrl) return;
	try {
		await assertBrowserNavigationResultAllowed({
			url: candidateUrl,
			signal: params.signal,
			...browserNavigationPolicyForProfile(params.ctx, params.profileCtx)
		});
		return candidateUrl;
	} catch {
		params.signal?.throwIfAborted();
		return;
	}
}
/** Resolve profile, tab, and Playwright context for Playwright-only routes. */
async function withPlaywrightRouteContext(params) {
	return await withRouteTabContext({
		req: params.req,
		res: params.res,
		ctx: params.ctx,
		...params.profileCtx ? { profileCtx: params.profileCtx } : {},
		targetId: params.targetId,
		enforceCurrentUrlAllowed: params.enforceCurrentUrlAllowed,
		run: async (routeCtx) => {
			const pw = await requirePwAi(params.res, params.feature);
			if (!pw) return;
			return await params.run({
				...routeCtx,
				pw
			});
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/existing-session-limits.ts
/**
* Existing-session browser capability-limit messages.
*
* Centralizes unsupported-operation text so route responses and tests stay
* stable while Chrome MCP support grows incrementally.
*/
/** User-facing messages for existing-session route limitations. */
const EXISTING_SESSION_LIMITS = {
	act: {
		clickSelector: "existing-session click does not support selector targeting yet; use ref.",
		clickButtonOrModifiers: "existing-session click currently supports left-click only (no button overrides/modifiers).",
		coordinateButtonOrDelay: "existing-session coordinate clicks support left-click only and no delayMs; use a managed browser profile for other buttons or click delays.",
		typeSelector: "existing-session type does not support selector targeting yet; use ref.",
		typeSlowly: "existing-session type does not support slowly=true; use fill/press instead.",
		typeTimeout: "existing-session type does not support timeoutMs overrides.",
		insertText: "Paste is not supported for existing-session browser profiles. Use a managed browser profile.",
		pressDelay: "existing-session press does not support delayMs.",
		hoverSelector: "existing-session hover does not support selector targeting yet; use ref.",
		hoverTimeout: "existing-session hover does not support timeoutMs overrides.",
		scrollSelector: "existing-session scrollIntoView does not support selector targeting yet; use ref.",
		scrollTimeout: "existing-session scrollIntoView does not support timeoutMs overrides.",
		dragSelector: "existing-session drag does not support selector targeting yet; use startRef/endRef.",
		dragTimeout: "existing-session drag does not support timeoutMs overrides.",
		selectSelector: "existing-session select does not support selector targeting yet; use ref.",
		selectSingleValue: "existing-session select currently supports a single value only.",
		selectTimeout: "existing-session select does not support timeoutMs overrides.",
		fillTimeout: "existing-session fill does not support timeoutMs overrides.",
		waitNetworkIdle: "existing-session wait does not support loadState=networkidle yet.",
		batch: "existing-session batch is not supported yet; send actions individually."
	},
	hooks: {
		uploadElement: "existing-session file uploads do not support element selectors; use ref/inputRef.",
		uploadRefRequired: "existing-session file uploads require ref or inputRef.",
		dialogId: "existing-session dialog handling does not support dialogId.",
		dialogTimeout: "existing-session dialog handling does not support timeoutMs."
	},
	download: {
		waitUnsupported: "download waiting is not supported for existing-session profiles yet.",
		downloadUnsupported: "downloads are not supported for existing-session profiles yet."
	},
	snapshot: {
		pdfUnsupported: "pdf is not supported for existing-session profiles yet; use screenshot/snapshot instead.",
		screenshotElement: "element screenshots are not supported for existing-session profiles; use ref from snapshot.",
		snapshotSelector: "selector/frame snapshots are not supported for existing-session profiles; snapshot the whole page and use refs."
	},
	responseBody: "response body is not supported for existing-session profiles yet.",
	errors: "errors is not supported for existing-session profiles; use a managed browser profile to collect page errors, or snapshot to inspect the current page.",
	requests: "requests is not supported for existing-session profiles; use a managed browser profile to collect network requests, or snapshot to inspect the current page.",
	text: "text is not supported for existing-session profiles; use snapshot to read the page, or switch to a managed browser profile for text extraction.",
	emulation: "emulate is not supported for existing-session profiles; use a managed browser profile for device, media, timezone, or locale settings."
};
/** Explain unsupported action shapes before existing-session dispatch. */
function getExistingSessionUnsupportedMessage(action) {
	switch (action.kind) {
		case "click":
			if (action.selector) return EXISTING_SESSION_LIMITS.act.clickSelector;
			if (action.button && action.button !== "left" || Array.isArray(action.modifiers) && action.modifiers.length > 0) return EXISTING_SESSION_LIMITS.act.clickButtonOrModifiers;
			return null;
		case "clickCoords": return action.button && action.button !== "left" || action.delayMs ? EXISTING_SESSION_LIMITS.act.coordinateButtonOrDelay : null;
		case "type":
			if (action.selector) return EXISTING_SESSION_LIMITS.act.typeSelector;
			if (action.slowly) return EXISTING_SESSION_LIMITS.act.typeSlowly;
			return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.typeTimeout : null;
		case "insertText": return EXISTING_SESSION_LIMITS.act.insertText;
		case "press": return action.delayMs ? EXISTING_SESSION_LIMITS.act.pressDelay : null;
		case "hover":
			if (action.selector) return EXISTING_SESSION_LIMITS.act.hoverSelector;
			return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.hoverTimeout : null;
		case "scrollIntoView":
			if (action.selector) return EXISTING_SESSION_LIMITS.act.scrollSelector;
			return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.scrollTimeout : null;
		case "drag":
			if (action.startSelector || action.endSelector) return EXISTING_SESSION_LIMITS.act.dragSelector;
			return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.dragTimeout : null;
		case "select":
			if (action.selector) return EXISTING_SESSION_LIMITS.act.selectSelector;
			if (action.values.length !== 1) return EXISTING_SESSION_LIMITS.act.selectSingleValue;
			return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.selectTimeout : null;
		case "fill": return action.timeoutMs ? EXISTING_SESSION_LIMITS.act.fillTimeout : null;
		case "wait": return action.loadState === "networkidle" ? EXISTING_SESSION_LIMITS.act.waitNetworkIdle : null;
		case "evaluate": return null;
		case "batch": return EXISTING_SESSION_LIMITS.act.batch;
		case "resize":
		case "close": return null;
	}
	throw new Error("Unsupported browser act kind");
}
//#endregion
//#region extensions/browser/src/browser/routes/output-paths.ts
/**
* Browser route output-path helpers.
*
* Validates writable output paths against a route-specific root before any
* screenshot, trace, or download route writes to disk.
*/
/** Ensure a browser output root exists before resolving child write paths. */
async function ensureOutputRootDir(rootDir) {
	await ensureOutputDirectory(rootDir);
}
/** Resolve a writable output path or send a 400 JSON response on scope errors. */
async function resolveWritableOutputPathOrRespond(params) {
	if (params.ensureRootDir) await ensureOutputRootDir(params.rootDir);
	const pathResult = await pathScope(params.rootDir, { label: params.scopeLabel }).writable(params.requestedPath, { defaultName: params.defaultFileName });
	if (!pathResult.ok) {
		params.res.status(400).json({ error: pathResult.error });
		return null;
	}
	return pathResult.path;
}
//#endregion
//#region extensions/browser/src/browser/routes/route-numeric.ts
/**
* Strict numeric parsers for browser route input.
*
* Converts query/body values into finite integer/timeout numbers while
* preserving route-specific error messages for JSON responses.
*/
function hasRouteInputValue(value) {
	return value != null;
}
/** Read an optional finite number route field. */
function readRouteFiniteNumber(value, fieldName) {
	const parsed = parseStrictFiniteNumber(value);
	if (parsed === void 0 && hasRouteInputValue(value)) throw new Error(`${fieldName} must be a finite number.`);
	return parsed;
}
/** Read an optional finite number, treating blank strings as absent. */
function readOptionalRouteFiniteNumber(value, fieldName) {
	if (typeof value === "string" && value.trim() === "") return;
	return readRouteFiniteNumber(value, fieldName);
}
/** Read an optional integer route field. */
function readRouteInteger(value, fieldName, options) {
	const parsed = parseStrictInteger(value);
	if (parsed === void 0 && hasRouteInputValue(value)) throw new Error(options?.invalidMessage ?? `${fieldName} must be an integer.`);
	return parsed;
}
/** Read an optional positive integer route field. */
function readRoutePositiveInteger(value, fieldName, options) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0 && hasRouteInputValue(value)) throw new Error(options?.invalidMessage ?? `${fieldName} must be a positive integer.`);
	return parsed;
}
/** Read and normalize an optional positive timeout value. */
function readRouteTimerTimeoutMs(value, fieldName = "timeoutMs", opts) {
	const parsed = readRoutePositiveInteger(value, fieldName, opts);
	return parsed === void 0 ? void 0 : normalizeBrowserTimerDelayMs(parsed, opts);
}
/** Read an optional non-negative integer route field. */
function readRouteNonNegativeInteger(value, fieldName, options) {
	const parsed = parseStrictNonNegativeInteger(value);
	if (parsed === void 0 && hasRouteInputValue(value)) throw new Error(options?.invalidMessage ?? `${fieldName} must be a non-negative integer.`);
	return parsed;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.download.ts
/**
* Browser agent action routes for download handling.
*
* Registers endpoints that wait for a pending download or trigger a referenced
* page download while keeping files scoped to the configured downloads root.
*/
function buildDownloadRequestBase(cdpUrl, targetId, timeoutMs) {
	return {
		cdpUrl,
		targetId,
		timeoutMs: timeoutMs ?? void 0
	};
}
/** Register download action endpoints on the browser control server. */
function registerBrowserAgentActDownloadRoutes(app, ctx) {
	app.post("/wait/download", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const out = toStringOrEmpty(body.path) || "";
		let timeoutMs;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, assertCurrent }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(res, 501, EXISTING_SESSION_LIMITS.download.waitUnsupported);
				const pw = await requirePwAi(res, "wait for download");
				if (!pw) return;
				await ensureOutputRootDir(DEFAULT_DOWNLOAD_DIR);
				let downloadPath;
				if (out.trim()) {
					const resolvedDownloadPath = await resolveWritableOutputPathOrRespond({
						res,
						rootDir: DEFAULT_DOWNLOAD_DIR,
						requestedPath: out,
						scopeLabel: "downloads directory"
					});
					if (!resolvedDownloadPath) return;
					downloadPath = resolvedDownloadPath;
				}
				const requestBase = buildDownloadRequestBase(cdpUrl, tab.targetId, timeoutMs);
				const result = await pw.waitForDownloadViaPlaywright({
					...requestBase,
					...browserNavigationPolicyForProfile(ctx, profileCtx),
					path: downloadPath,
					rootDir: DEFAULT_DOWNLOAD_DIR,
					signal,
					...assertCurrent ? { assertCurrent } : {}
				});
				res.json({
					ok: true,
					targetId: tab.targetId,
					download: result
				});
			}
		});
	});
	app.post("/download", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const ref = toStringOrEmpty(body.ref);
		const out = toStringOrEmpty(body.path);
		const currentDocument = body.currentDocument === true;
		const expectedUrl = typeof body.expectedUrl === "string" ? body.expectedUrl : "";
		let timeoutMs;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		if (body.currentDocument !== void 0 && typeof body.currentDocument !== "boolean") return jsonError(res, 400, "currentDocument must be a boolean");
		if (currentDocument && (body.ref !== void 0 || body.path !== void 0)) return jsonError(res, 400, "currentDocument cannot be combined with ref or path");
		if (currentDocument && !expectedUrl.trim()) return jsonError(res, 400, "expectedUrl is required for currentDocument");
		if (!currentDocument && body.expectedUrl !== void 0) return jsonError(res, 400, "expectedUrl requires currentDocument");
		if (!currentDocument && !ref) return jsonError(res, 400, "ref is required");
		if (!currentDocument && !out) return jsonError(res, 400, "path is required");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, assertCurrent }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(res, 501, EXISTING_SESSION_LIMITS.download.downloadUnsupported);
				const pw = await requirePwAi(res, "download");
				if (!pw) return;
				await ensureOutputRootDir(DEFAULT_DOWNLOAD_DIR);
				const requestBase = buildDownloadRequestBase(cdpUrl, tab.targetId, timeoutMs);
				if (currentDocument) {
					const result = await pw.downloadCurrentDocumentViaPlaywright({
						...requestBase,
						...browserNavigationPolicyForProfile(ctx, profileCtx),
						expectedUrl,
						rootDir: DEFAULT_DOWNLOAD_DIR,
						signal,
						...assertCurrent ? { assertCurrent } : {}
					});
					res.json({
						ok: true,
						targetId: tab.targetId,
						download: result
					});
					return;
				}
				const downloadPath = await resolveWritableOutputPathOrRespond({
					res,
					rootDir: DEFAULT_DOWNLOAD_DIR,
					requestedPath: out,
					scopeLabel: "downloads directory"
				});
				if (!downloadPath) return;
				const result = await pw.downloadViaPlaywright({
					...requestBase,
					...browserNavigationPolicyForProfile(ctx, profileCtx),
					ref,
					path: downloadPath,
					rootDir: DEFAULT_DOWNLOAD_DIR,
					signal,
					...assertCurrent ? { assertCurrent } : {}
				});
				res.json({
					ok: true,
					targetId: tab.targetId,
					download: result
				});
			}
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.errors.ts
const ACT_ERROR_CODES = BROWSER_ACT_ERROR_CODES;
/** Send a browser action JSON error with a stable action error code. */
function jsonActError(res, status, code, message) {
	res.status(status).json({
		error: message,
		code
	});
}
/** Build the config-disabled message for JavaScript evaluation actions. */
function browserEvaluateDisabledMessage(action) {
	return [action === "wait" ? "wait --fn is disabled by config (browser.evaluateEnabled=false)." : "act:evaluate is disabled by config (browser.evaluateEnabled=false).", "Docs: /tools/browser/configuration#configuration"].join("\n");
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.existing-session.ts
/** Existing-session action waits, navigation verification, and deadline ownership. */
/** Abort nested operations without racing the route's response/error owner. */
function createExistingSessionDeadline(timeoutMs, parentSignal, label) {
	const controller = new AbortController();
	const signal = parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal;
	const error = typeof label === "string" ? /* @__PURE__ */ new Error(`${label} timed out after ${timeoutMs}ms`) : label;
	const deadlineAt = Date.now() + timeoutMs;
	const timer = setTimeout(() => controller.abort(error), timeoutMs);
	timer.unref?.();
	return {
		signal,
		remainingMs: () => Math.max(0, deadlineAt - Date.now()),
		throwIfAborted: () => {
			if (Date.now() >= deadlineAt && !signal.aborted) controller.abort(error);
			signal.throwIfAborted();
		},
		cleanup: () => clearTimeout(timer)
	};
}
async function readExistingSessionLocationHref(params) {
	const currentUrl = await evaluateChromeMcpScript({
		...params,
		fn: "() => window.location.href"
	});
	if (typeof currentUrl !== "string") throw new Error("Location probe returned a non-string result");
	const normalizedUrl = currentUrl.trim();
	if (!normalizedUrl) throw new Error("Location probe returned an empty URL");
	return normalizedUrl;
}
async function assertExistingSessionPostInteractionNavigationAllowed(params) {
	const navigationPolicy = withBrowserNavigationPolicy(params.ssrfPolicy, { browserProxyMode: params.browserProxyMode });
	if (!navigationPolicy.ssrfPolicy && !navigationPolicy.browserProxyMode) return;
	const listTabs = params.listTabs;
	const initialTabTargetIds = params.initialTabTargetIds;
	const assertNewTabsAllowed = async () => {
		const tabs = await listTabs();
		for (const tab of tabs) {
			if (initialTabTargetIds.has(tab.targetId)) continue;
			await assertBrowserNavigationResultAllowed({
				url: tab.url,
				signal: params.signal,
				...navigationPolicy
			});
		}
	};
	let lastObservedUrl;
	let sawStableAllowedUrl = false;
	for (const delayMs of EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS) {
		if (delayMs > 0) await setTimeout$1(delayMs, void 0, { signal: params.signal });
		let currentUrl;
		try {
			currentUrl = await readExistingSessionLocationHref(params);
		} catch {
			params.signal?.throwIfAborted();
			sawStableAllowedUrl = false;
			continue;
		}
		await assertBrowserNavigationResultAllowed({
			url: currentUrl,
			signal: params.signal,
			...navigationPolicy
		});
		if (currentUrl === lastObservedUrl) sawStableAllowedUrl = true;
		else sawStableAllowedUrl = false;
		lastObservedUrl = currentUrl;
	}
	if (sawStableAllowedUrl) {
		await assertNewTabsAllowed();
		return;
	}
	if (lastObservedUrl) {
		const lastDelay = EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS[EXISTING_SESSION_NAVIGATION_RECHECK_DELAYS_MS.length - 1];
		await setTimeout$1(lastDelay, void 0, { signal: params.signal });
		try {
			const followUpUrl = await readExistingSessionLocationHref(params);
			await assertBrowserNavigationResultAllowed({
				url: followUpUrl,
				signal: params.signal,
				...navigationPolicy
			});
			if (followUpUrl === lastObservedUrl) {
				await assertNewTabsAllowed();
				return;
			}
		} catch {
			params.signal?.throwIfAborted();
		}
	}
	throw new Error("Unable to verify stable post-interaction navigation");
}
function buildExistingSessionWaitPredicate(params) {
	return [
		params.text && `Boolean(document.body?.innerText?.includes(${JSON.stringify(params.text)}))`,
		params.textGone && `!document.body?.innerText?.includes(${JSON.stringify(params.textGone)})`,
		params.selector && `(function visible(node) {
      if (!node) return false;
      if (node.nodeType === 1) {
        // Like managed waits, display:contents is visible through rendered children.
        if (getComputedStyle(node).display === "contents") {
          return Array.from(node.childNodes).some(visible);
        }
        if (!node.checkVisibility({ visibilityProperty: true })) return false;
      } else if (node.nodeType !== 3) {
        return false;
      }
      const range = document.createRange();
      range.selectNode(node);
      const rect = node.nodeType === 1 ? node.getBoundingClientRect() : range.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })(document.querySelector(${JSON.stringify(params.selector)}))`,
		params.loadState === "domcontentloaded" && `document.readyState === "interactive" || document.readyState === "complete"`,
		params.loadState === "load" && `document.readyState === "complete"`,
		params.fn && `Boolean(await (${normalizeBrowserEvaluateFunctionSource(params.fn)})())`
	].filter(Boolean).map((check) => `(${check})`).join(" && ") || null;
}
async function waitForExistingSessionCondition(params) {
	if (params.timeMs && params.timeMs > 0) await setTimeout$1(params.timeMs, void 0, { signal: params.signal });
	const predicate = buildExistingSessionWaitPredicate(params);
	if (!predicate && !params.url) return;
	const timeoutMs = Math.max(250, params.timeoutMs ?? 1e4);
	const timeoutError = /* @__PURE__ */ new Error("Timed out waiting for condition");
	const deadline = createExistingSessionDeadline(timeoutMs, params.signal, timeoutError);
	const { signal } = deadline;
	try {
		while (deadline.remainingMs() > 0) {
			try {
				const ready = await withChromeMcpDocument({
					...params,
					signal
				}, async (document) => {
					deadline.throwIfAborted();
					const readAllowedUrl = async () => {
						deadline.throwIfAborted();
						const url = await document.evaluate(`(root) => {
            const boundDocument = root?.nodeType === 9 ? root : root?.ownerDocument;
            return boundDocument === document ? location.href : null;
          }`);
						deadline.throwIfAborted();
						if (typeof url !== "string" || !url.trim()) return null;
						await assertBrowserNavigationResultAllowed({
							url,
							signal,
							...withBrowserNavigationPolicy(params.ssrfPolicy, { browserProxyMode: params.browserProxyMode })
						});
						return url;
					};
					const currentUrl = await readAllowedUrl();
					if (!currentUrl) return false;
					if (params.url && !matchBrowserUrlPattern(params.url, currentUrl)) return false;
					if (!predicate) return true;
					deadline.throwIfAborted();
					const outcome = await document.evaluate(`async (root) => {
          const boundDocument = root?.nodeType === 9 ? root : root?.ownerDocument;
          if (boundDocument !== document || location.href !== ${JSON.stringify(currentUrl)}) {
            return { kind: "navigation" };
          }
          try {
            return { kind: "result", ready: Boolean(await (${predicate})) };
          } catch (error) {
            const message = error && typeof error === "object" && "message" in error
              ? String(error.message)
              : String(error);
            return { kind: "error", message };
          }
        }`);
					deadline.throwIfAborted();
					if (!outcome || typeof outcome !== "object") throw new Error("Document-bound wait returned an invalid result");
					if ("kind" in outcome && outcome.kind === "error") throw new Error("message" in outcome && typeof outcome.message === "string" ? outcome.message : "Wait predicate failed");
					const predicateReady = "kind" in outcome && outcome.kind === "result" && "ready" in outcome && outcome.ready === true;
					if (!predicateReady || !params.url) return predicateReady;
					const finalUrl = await readAllowedUrl();
					return finalUrl !== null && matchBrowserUrlPattern(params.url, finalUrl);
				});
				deadline.throwIfAborted();
				if (ready) return;
			} catch (error) {
				deadline.throwIfAborted();
				if (!(error instanceof ChromeMcpDocumentUnavailableError)) throw error;
			}
			await setTimeout$1(Math.min(250, deadline.remainingMs()), void 0, { signal }).catch((error) => {
				deadline.throwIfAborted();
				throw error;
			});
		}
		throw timeoutError;
	} finally {
		deadline.cleanup();
	}
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.hooks.ts
/**
* Browser agent action hook routes.
*
* Handles file chooser and dialog interception for both Playwright-backed
* OpenClaw profiles and Chrome MCP existing-session profiles.
*/
/** Register file chooser and dialog hook endpoints on the browser control server. */
function registerBrowserAgentActHookRoutes(app, ctx) {
	app.post("/hooks/file-chooser", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const ref = toStringOrEmpty(body.ref) || void 0;
		const inputRef = toStringOrEmpty(body.inputRef) || void 0;
		const element = toStringOrEmpty(body.element) || void 0;
		const paths = toStringArray(body.paths) ?? [];
		let timeoutMs;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		if (!paths.length) return jsonError(res, 400, "paths are required");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, assertCurrent }) => {
				const resolvedResult = await resolveExistingUploadPaths({ requestedPaths: paths });
				if (!resolvedResult.ok) {
					res.status(400).json({ error: resolvedResult.error });
					return;
				}
				const resolvedPaths = resolvedResult.paths;
				const capabilities = getBrowserProfileCapabilities(profileCtx.profile);
				if (capabilities.usesChromeMcp) {
					if (element) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.uploadElement);
					const uid = inputRef || ref;
					if (!uid) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.uploadRefRequired);
					if (assertCurrent) await assertCurrent();
					await uploadChromeMcpFile({
						profileName: profileCtx.profile.name,
						profile: profileCtx.profile,
						targetId: tab.targetId,
						uid,
						filePaths: resolvedPaths,
						timeoutMs: timeoutMs ?? ctx.state().resolved.actionTimeoutMs,
						signal
					});
					return res.json({ ok: true });
				}
				const pw = await requirePwAi(res, "file chooser hook");
				if (!pw) return;
				const browserFilesystemLocal = capabilities.browserFilesystemLocal;
				if (inputRef || element) {
					if (ref) return jsonError(res, 400, "ref cannot be combined with inputRef/element");
					await pw.setInputFilesViaPlaywright({
						cdpUrl,
						browserFilesystemLocal,
						targetId: tab.targetId,
						inputRef,
						element,
						paths: resolvedPaths,
						timeoutMs,
						ssrfPolicy: ctx.state().resolved.ssrfPolicy,
						signal,
						...assertCurrent ? { assertCurrent } : {}
					});
				} else if (ref) await pw.uploadViaPlaywright({
					cdpUrl,
					browserFilesystemLocal,
					targetId: tab.targetId,
					paths: resolvedPaths,
					timeoutMs: timeoutMs ?? void 0,
					ssrfPolicy: ctx.state().resolved.ssrfPolicy,
					ref,
					signal,
					...assertCurrent ? { assertCurrent } : {}
				});
				else await pw.armFileUploadViaPlaywright({
					cdpUrl,
					browserFilesystemLocal,
					targetId: tab.targetId,
					paths: resolvedPaths,
					timeoutMs: timeoutMs ?? void 0,
					ssrfPolicy: ctx.state().resolved.ssrfPolicy,
					...assertCurrent ? { assertCurrent } : {}
				});
				res.json({ ok: true });
			}
		});
	});
	app.post("/hooks/dialog", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const accept = toBoolean(body.accept);
		const promptText = readStringValue(body.promptText);
		let timeoutMs;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		const dialogId = toStringOrEmpty(body.dialogId) || void 0;
		if (accept === void 0) return jsonError(res, 400, "accept is required");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, assertCurrent }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
					if (dialogId) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.dialogId);
					if (timeoutMs) return jsonError(res, 501, EXISTING_SESSION_LIMITS.hooks.dialogTimeout);
					if (assertCurrent) await assertCurrent();
					await evaluateChromeMcpScript({
						profileName: profileCtx.profile.name,
						profile: profileCtx.profile,
						targetId: tab.targetId,
						timeoutMs: ctx.state().resolved.actionTimeoutMs,
						signal,
						fn: `() => {
              const state = (window.__openclawDialogHook ??= {});
              if (!state.originals) {
                state.originals = {
                  alert: window.alert.bind(window),
                  confirm: window.confirm.bind(window),
                  prompt: window.prompt.bind(window),
                };
              }
              const originals = state.originals;
              const restore = () => {
                window.alert = originals.alert;
                window.confirm = originals.confirm;
                window.prompt = originals.prompt;
                delete window.__openclawDialogHook;
              };
              window.alert = (...args) => {
                try {
                  return undefined;
                } finally {
                  restore();
                }
              };
              window.confirm = (...args) => {
                try {
                  return ${accept ? "true" : "false"};
                } finally {
                  restore();
                }
              };
              window.prompt = (...args) => {
                try {
                  return ${accept ? JSON.stringify(promptText ?? "") : "null"};
                } finally {
                  restore();
                }
              };
              return true;
            }`
					});
					return res.json({ ok: true });
				}
				const pw = await requirePwAi(res, "dialog hook");
				if (!pw) return;
				await pw.armDialogViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					dialogId,
					accept,
					promptText,
					timeoutMs: timeoutMs ?? void 0,
					...assertCurrent ? { assertCurrent } : {}
				});
				res.json({ ok: true });
			}
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.shared.ts
/**
* Shared browser action enums and parsers.
*
* Keeps route normalization, schema tests, and action dispatch using the same
* action names, mouse buttons, and keyboard modifier vocabulary.
*/
const ACT_KINDS = [
	"batch",
	"click",
	"clickCoords",
	"close",
	"drag",
	"evaluate",
	"fill",
	"hover",
	"insertText",
	"scrollIntoView",
	"press",
	"resize",
	"select",
	"type",
	"wait"
];
/** Return true when a raw value names a supported browser action kind. */
function isActKind(value) {
	if (typeof value !== "string") return false;
	return ACT_KINDS.includes(value);
}
const ALLOWED_CLICK_MODIFIERS = /* @__PURE__ */ new Set([
	"Alt",
	"Control",
	"ControlOrMeta",
	"Meta",
	"Shift"
]);
/** Parse a model/client mouse button string into the supported click button set. */
function parseClickButton(raw) {
	if (raw === "left" || raw === "right" || raw === "middle") return raw;
}
/** Parse and validate click modifier names accepted by Playwright actions. */
function parseClickModifiers(raw) {
	if (raw.filter((m) => !ALLOWED_CLICK_MODIFIERS.has(m)).length) return { error: "modifiers must be Alt|Control|ControlOrMeta|Meta|Shift" };
	return { modifiers: raw.length ? raw : void 0 };
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.normalize.ts
/**
* Browser action request normalization.
*
* Converts loosely typed route bodies into the closed BrowserActRequest union
* used by Playwright and Chrome MCP action executors.
*/
const KEY_ALIASES = /* @__PURE__ */ new Map([
	["esc", "Escape"],
	["return", "Enter"],
	["del", "Delete"],
	["ctrl", "Control"],
	["cmd", "Meta"],
	["space", "Space"]
]);
/**
* KeyboardEvent.key for Space is the literal " ". Map that exact whole value
* before trim so Browser panel Space presses survive. Keep trim-first chord
* splitting for every other input so whitespace-padded Plus (`" + "`, `"+ "`)
* still normalizes to `"+"`; use named `Ctrl+Space` for Space chords.
*/
function normalizePressKeyChord(raw) {
	if (raw === " ") return "Space";
	return toStringOrEmpty(raw).split("+").map((part) => KEY_ALIASES.get(part.toLowerCase()) ?? part).join("+");
}
function countBatchActions(actions) {
	let count = 0;
	for (const action of actions) {
		count += 1;
		if (action.kind === "batch") count += countBatchActions(action.actions);
	}
	return count;
}
/** Keep nested action overrides inside the route-selected tab. */
function canonicalizeActTargetIds(action, tab, tabs = [tab], batched = false) {
	if (action.targetId) {
		const resolved = resolveTargetIdFromTabs(action.targetId, batched ? tabs : [tab]);
		if (!resolved.ok || resolved.targetId !== tab.targetId) return batched ? "batched action targetId must match request targetId" : "action targetId must match request targetId";
		action.targetId = tab.targetId;
	}
	if (action.kind === "batch") for (const subAction of action.actions) {
		const error = canonicalizeActTargetIds(subAction, tab, tabs, true);
		if (error) return error;
	}
	return null;
}
function normalizeFields(rawFields) {
	return normalizeBrowserFormFields(Array.isArray(rawFields) ? rawFields : []);
}
function normalizeBatchAction(value, depth) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("batch actions must be objects");
	return normalizeActRequest(value, {
		source: "batch",
		depth
	});
}
function readActionNonNegativeInteger(body, key) {
	return readRouteNonNegativeInteger(body[key], key);
}
function readActionTimeoutMs(body) {
	return readRouteTimerTimeoutMs(body.timeoutMs);
}
function readBoundedActionDurationMs(body, key, fieldName, maxMs) {
	return normalizeActBoundedNonNegativeMs(readActionNonNegativeInteger(body, key), fieldName, maxMs);
}
function readResizeDimension(body, key) {
	const value = readRouteInteger(body[key], key, { invalidMessage: "resize requires positive width and height" });
	if (value === void 0 && Object.hasOwn(body, key)) throw new Error("resize requires positive width and height");
	return value;
}
function definedAction(action) {
	for (const key in action) if (action[key] === void 0) delete action[key];
	return action;
}
/** Normalize one model/client action payload into a BrowserActRequest. */
function normalizeActRequest(body, options) {
	const source = options?.source ?? "request";
	const depth = options?.depth ?? 0;
	const kind = toStringOrEmpty(body.kind);
	if (!isActKind(kind)) throw new Error("kind is required");
	const targetId = toStringOrEmpty(body.targetId) || void 0;
	switch (kind) {
		case "click": {
			const ref = toStringOrEmpty(body.ref) || void 0;
			const selector = toStringOrEmpty(body.selector) || void 0;
			if (!ref && !selector) throw new Error("click requires ref or selector");
			const buttonRaw = toStringOrEmpty(body.button);
			const button = buttonRaw ? parseClickButton(buttonRaw) : void 0;
			if (buttonRaw && !button) throw new Error("click button must be left|right|middle");
			const parsedModifiers = parseClickModifiers(toStringArray(body.modifiers) ?? []);
			if (parsedModifiers.error) throw new Error(parsedModifiers.error);
			const doubleClick = toBoolean(body.doubleClick);
			const delayMs = readBoundedActionDurationMs(body, "delayMs", "click delayMs", ACT_MAX_CLICK_DELAY_MS);
			const timeoutMs = readActionTimeoutMs(body);
			return definedAction({
				kind,
				ref,
				selector,
				targetId,
				doubleClick,
				button,
				modifiers: parsedModifiers.modifiers,
				delayMs,
				timeoutMs
			});
		}
		case "clickCoords": {
			const x = readRouteFiniteNumber(body.x, "x");
			const y = readRouteFiniteNumber(body.y, "y");
			if (x === void 0 || y === void 0 || x < 0 || y < 0) throw new Error("clickCoords requires non-negative x and y");
			const buttonRaw = toStringOrEmpty(body.button);
			const button = buttonRaw ? parseClickButton(buttonRaw) : void 0;
			if (buttonRaw && !button) throw new Error("clickCoords button must be left|right|middle");
			return definedAction({
				kind,
				x,
				y,
				targetId,
				doubleClick: toBoolean(body.doubleClick),
				button,
				delayMs: readBoundedActionDurationMs(body, "delayMs", "clickCoords delayMs", ACT_MAX_CLICK_DELAY_MS),
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "type": {
			const ref = toStringOrEmpty(body.ref) || void 0;
			const selector = toStringOrEmpty(body.selector) || void 0;
			const text = body.text;
			if (!ref && !selector) throw new Error("type requires ref or selector");
			if (typeof text !== "string") throw new Error("type requires text");
			return definedAction({
				kind,
				ref,
				selector,
				text,
				targetId,
				submit: toBoolean(body.submit),
				slowly: toBoolean(body.slowly),
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "insertText":
			if (typeof body.text !== "string") throw new Error("insertText requires text");
			return definedAction({
				kind,
				text: body.text,
				targetId
			});
		case "press": {
			const key = normalizePressKeyChord(body.key);
			if (!key) throw new Error("press requires key");
			return definedAction({
				kind,
				key,
				targetId,
				delayMs: readActionNonNegativeInteger(body, "delayMs")
			});
		}
		case "hover":
		case "scrollIntoView": {
			const ref = toStringOrEmpty(body.ref) || void 0;
			const selector = toStringOrEmpty(body.selector) || void 0;
			if (!ref && !selector) throw new Error(`${kind} requires ref or selector`);
			return definedAction({
				kind,
				ref,
				selector,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "drag": {
			const startRef = toStringOrEmpty(body.startRef) || void 0;
			const startSelector = toStringOrEmpty(body.startSelector) || void 0;
			const endRef = toStringOrEmpty(body.endRef) || void 0;
			const endSelector = toStringOrEmpty(body.endSelector) || void 0;
			if (!startRef && !startSelector) throw new Error("drag requires startRef or startSelector");
			if (!endRef && !endSelector) throw new Error("drag requires endRef or endSelector");
			return definedAction({
				kind,
				startRef,
				startSelector,
				endRef,
				endSelector,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "select": {
			const ref = toStringOrEmpty(body.ref) || void 0;
			const selector = toStringOrEmpty(body.selector) || void 0;
			const values = filterStringEntries(body.values);
			if (!ref && !selector || !values.length) throw new Error("select requires ref/selector and values");
			return definedAction({
				kind,
				ref,
				selector,
				values,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "fill": {
			const fields = normalizeFields(body.fields);
			if (!fields.length) throw new Error("fill requires fields");
			return definedAction({
				kind,
				fields,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "resize": {
			const width = readResizeDimension(body, "width");
			const height = readResizeDimension(body, "height");
			if (width === void 0 || height === void 0 || width <= 0 || height <= 0) throw new Error("resize requires positive width and height");
			if (width > 8192 || height > 8192) throw new Error(`resize width and height must not exceed ${ACT_MAX_VIEWPORT_DIMENSION}`);
			return definedAction({
				kind,
				width,
				height,
				targetId
			});
		}
		case "wait": {
			const loadStateRaw = toStringOrEmpty(body.loadState);
			const loadState = loadStateRaw === "load" || loadStateRaw === "domcontentloaded" || loadStateRaw === "networkidle" ? loadStateRaw : void 0;
			const timeMs = readBoundedActionDurationMs(body, "timeMs", "wait timeMs", ACT_MAX_WAIT_TIME_MS);
			const text = toStringOrEmpty(body.text) || void 0;
			const textGone = toStringOrEmpty(body.textGone) || void 0;
			const selector = toStringOrEmpty(body.selector) || void 0;
			const url = toStringOrEmpty(body.url) || void 0;
			const fn = toStringOrEmpty(body.fn) || void 0;
			if (timeMs === void 0 && !text && !textGone && !selector && !url && !loadState && !fn) throw new Error("wait requires at least one of: timeMs, text, textGone, selector, url, loadState, fn");
			return definedAction({
				kind,
				timeMs,
				text,
				textGone,
				selector,
				url,
				loadState,
				fn,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "evaluate": {
			const fn = toStringOrEmpty(body.fn);
			if (!fn) throw new Error("evaluate requires fn");
			return definedAction({
				kind,
				fn,
				ref: toStringOrEmpty(body.ref) || void 0,
				targetId,
				timeoutMs: readActionTimeoutMs(body)
			});
		}
		case "close": return definedAction({
			kind,
			targetId
		});
		case "batch": {
			if (depth > 5) throw new Error(`batch nesting exceeds maximum depth of 5`);
			const actions = Array.isArray(body.actions) ? body.actions.map((action) => normalizeBatchAction(action, depth + 1)) : [];
			if (!actions.length) throw new Error(source === "batch" ? "batch requires actions" : "actions are required");
			if (countBatchActions(actions) > 100) throw new Error(`batch exceeds maximum of 100 actions`);
			return definedAction({
				kind,
				actions,
				targetId,
				stopOnError: toBoolean(body.stopOnError)
			});
		}
	}
	throw new Error("Unsupported browser act kind");
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot-target.ts
/** Pin capture at the actual bridge; a failed capture must never enable generic recovery. */
async function captureBrowserOperationTarget(opts) {
	const state = opts.ctx.state();
	const relay = state.extensionRelays?.get(opts.profileName);
	if (!relay) return;
	const runtime = state.profiles.get(opts.profileName);
	if (!runtime) throw new Error("Browser operation profile is unavailable");
	const lifecycle = getProfileLifecycle(runtime);
	const generation = lifecycle.generation;
	let released = false;
	const isCurrent = () => !released && opts.ctx.state() === state && state.extensionRelays?.get(opts.profileName) === relay && state.profiles.get(opts.profileName) === runtime && lifecycle.generation === generation;
	const reference = relay.ownership === "borrowed" ? await relay.client.capture(opts.targetId, () => {
		if (!isCurrent()) throw new Error("Browser operation generation was superseded");
	}) : void 0;
	const resolveTarget = relay.ownership === "borrowed" ? reference?.resolve : relay.bridge.captureOperationTarget(opts.targetId);
	const resolve = async () => {
		if (!isCurrent()) return;
		const target = await resolveTarget?.();
		return isCurrent() ? target : void 0;
	};
	return Object.assign(resolve, {
		reference,
		release: async () => {
			released = true;
			await reference?.release();
		}
	});
}
/** Report the acted-on target if its exact owner no longer exposes a replacement. */
async function resolveOperationTargetOutcome(opts) {
	return opts.resolveRelayTarget ? await opts.resolveRelayTarget() ?? opts.actedOnTargetId : opts.operationTargetId ?? opts.actedOnTargetId;
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.act.ts
/**
* Browser agent action route registration and existing-session execution.
*
* Dispatches normalized actions to either Playwright-backed OpenClaw browser
* control or Chrome MCP existing-session operations with navigation guards.
*/
const SELECTOR_ALLOWED_KINDS = /* @__PURE__ */ new Set([
	"batch",
	"click",
	"drag",
	"hover",
	"scrollIntoView",
	"select",
	"type",
	"wait"
]);
function shouldEnforceCurrentUrlForAct(action) {
	return action.kind !== "resize" && action.kind !== "close";
}
/** Register browser action endpoints, including hook and download subroutes. */
function registerBrowserAgentActRoutes(app, ctx) {
	app.post("/act", async (req, res) => {
		const body = readBody(req);
		const kindRaw = toStringOrEmpty(body.kind);
		if (!isActKind(kindRaw)) return jsonActError(res, 400, ACT_ERROR_CODES.kindRequired, "kind is required");
		const kind = kindRaw;
		let action;
		try {
			action = normalizeActRequest(body);
		} catch (err) {
			return jsonActError(res, 400, ACT_ERROR_CODES.invalidRequest, formatErrorMessage(err));
		}
		const targetId = resolveTargetIdFromBody(body);
		if (Object.hasOwn(body, "selector") && !SELECTOR_ALLOWED_KINDS.has(kind)) return jsonActError(res, 400, ACT_ERROR_CODES.selectorUnsupported, SELECTOR_UNSUPPORTED_MESSAGE);
		const earlyFn = action.kind === "wait" || action.kind === "evaluate" ? action.fn : "";
		if ((action.kind === "evaluate" || action.kind === "wait" && earlyFn) && !ctx.state().resolved.evaluateEnabled) return jsonActError(res, 403, ACT_ERROR_CODES.evaluateDisabled, browserEvaluateDisabledMessage(action.kind === "evaluate" ? "evaluate" : "wait"));
		const profileCtx = resolveProfileContext(req, res, ctx);
		if (!profileCtx) return;
		const isExistingSession = getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp;
		const existingSessionTimeouts = resolveExistingSessionActTimeouts(action);
		const requestDeadline = isExistingSession ? createExistingSessionDeadline(existingSessionTimeouts.requestTimeoutMs, req.signal, "Browser action request") : void 0;
		try {
			await withRouteTabContext({
				req: requestDeadline ? {
					...req,
					signal: requestDeadline.signal
				} : req,
				res,
				ctx,
				profileCtx,
				targetId,
				enforceCurrentUrlAllowed: shouldEnforceCurrentUrlForAct(action),
				run: async ({ cdpUrl, tab, signal, resolveTabUrl, assertCurrent }) => {
					const evaluateEnabled = ctx.state().resolved.evaluateEnabled;
					const navigationPolicy = browserNavigationPolicyForProfile(ctx, profileCtx);
					let verificationDeadline;
					const existingSessionCallOptions = {
						timeoutMs: existingSessionTimeouts.timeoutMs,
						signal
					};
					const hasNavigationResultPolicy = Boolean(navigationPolicy.ssrfPolicy || navigationPolicy.browserProxyMode);
					let resolveRelayTarget;
					try {
						requestDeadline?.throwIfAborted();
						resolveRelayTarget = await captureBrowserOperationTarget({
							ctx,
							profileName: profileCtx.profile.name,
							targetId: tab.targetId
						});
						const jsonOk = async (extra, options) => {
							const responseTargetId = options?.resolveCurrentTarget && (!isExistingSession || hasNavigationResultPolicy) ? await resolveOperationTargetOutcome({
								actedOnTargetId: tab.targetId,
								operationTargetId: options?.operationTargetId,
								resolveRelayTarget
							}) : tab.targetId;
							const url = !isExistingSession && responseTargetId === tab.targetId ? await resolveTabUrl(tab.url) : await resolveSafeRouteTabUrl({
								ctx,
								profileCtx,
								targetId: responseTargetId,
								fallbackUrl: tab.url,
								...isExistingSession ? {
									...existingSessionCallOptions,
									timeoutMs: responseTargetId === tab.targetId ? ctx.state().resolved.actionTimeoutMs : existingSessionCallOptions.timeoutMs,
									signal: verificationDeadline?.signal ?? signal
								} : {}
							});
							verificationDeadline?.throwIfAborted();
							requestDeadline?.throwIfAborted();
							if (isExistingSession) signal.throwIfAborted();
							return res.json({
								ok: true,
								targetId: responseTargetId,
								...url ? { url } : {},
								...extra
							});
						};
						const actionTabs = action.kind === "batch" && !isExistingSession ? await profileCtx.listTabs() : [tab];
						if (!actionTabs.some((candidate) => candidate.targetId === tab.targetId)) actionTabs.unshift(tab);
						const targetIdError = canonicalizeActTargetIds(action, tab, actionTabs);
						if (targetIdError) return jsonActError(res, 403, ACT_ERROR_CODES.targetIdMismatch, targetIdError);
						const profileName = profileCtx.profile.name;
						if (isExistingSession) {
							const unsupportedMessage = getExistingSessionUnsupportedMessage(action);
							if (unsupportedMessage) return jsonActError(res, 501, ACT_ERROR_CODES.unsupportedForExistingSession, unsupportedMessage);
							const existingSessionTarget = {
								profileName,
								profile: profileCtx.profile,
								targetId: tab.targetId,
								...existingSessionCallOptions
							};
							const initialTabTargetIds = hasNavigationResultPolicy && existingSessionTimeouts.verificationTimeoutMs > 0 ? new Set((await profileCtx.listTabs(existingSessionCallOptions)).map((currentTab) => currentTab.targetId)) : /* @__PURE__ */ new Set();
							const runGuardedAction = async (execute) => {
								const bodyDeadline = existingSessionTimeouts.bodyTimeoutMs === void 0 ? void 0 : createExistingSessionDeadline(existingSessionTimeouts.bodyTimeoutMs, signal, "Browser action");
								const checkDeadline = () => {
									requestDeadline?.throwIfAborted();
									signal.throwIfAborted();
									bodyDeadline?.throwIfAborted();
								};
								let outcome;
								try {
									checkDeadline();
									const result = await execute({
										...existingSessionTarget,
										signal: bodyDeadline?.signal ?? signal
									}, checkDeadline);
									checkDeadline();
									outcome = { result };
								} catch (error) {
									outcome = { error: bodyDeadline?.signal.aborted ? bodyDeadline.signal.reason : error };
								} finally {
									bodyDeadline?.cleanup();
								}
								if (existingSessionTimeouts.verificationTimeoutMs > 0) {
									verificationDeadline = createExistingSessionDeadline(existingSessionTimeouts.verificationTimeoutMs, signal, "Browser navigation verification");
									verificationDeadline.throwIfAborted();
									const verificationOptions = {
										...existingSessionCallOptions,
										signal: verificationDeadline.signal
									};
									await assertExistingSessionPostInteractionNavigationAllowed({
										...existingSessionTarget,
										...verificationOptions,
										...navigationPolicy,
										listTabs: () => profileCtx.listTabs(verificationOptions),
										initialTabTargetIds
									});
								}
								if ("error" in outcome) throw toErrorObject(outcome.error, "Non-Error thrown");
								return outcome.result;
							};
							switch (action.kind) {
								case "click":
									await runGuardedAction((target) => clickChromeMcpElement({
										...target,
										uid: action.ref,
										doubleClick: action.doubleClick ?? false
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "clickCoords":
									await runGuardedAction((target) => clickChromeMcpCoords({
										...target,
										x: action.x,
										y: action.y,
										doubleClick: action.doubleClick ?? false
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "type":
									await runGuardedAction(async (target, checkDeadline) => {
										await fillChromeMcpElement({
											...target,
											uid: action.ref,
											value: action.text
										});
										if (action.submit) {
											checkDeadline();
											await pressChromeMcpKey({
												...target,
												key: "Enter"
											});
										}
									});
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "press":
									await runGuardedAction((target) => pressChromeMcpKey({
										...target,
										key: action.key
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "hover":
									await runGuardedAction((target) => hoverChromeMcpElement({
										...target,
										uid: action.ref
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "scrollIntoView":
									await runGuardedAction((target) => evaluateChromeMcpScript({
										...target,
										fn: `(el) => { el.scrollIntoView({ block: "center", inline: "center" }); return true; }`,
										args: [action.ref]
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "drag":
									await runGuardedAction((target) => dragChromeMcpElement({
										...target,
										fromUid: action.startRef,
										toUid: action.endRef
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "select":
									await runGuardedAction((target) => selectChromeMcpOption({
										...target,
										uid: action.ref,
										value: action.values[0] ?? ""
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "fill":
									await runGuardedAction((target) => fillChromeMcpForm({
										...target,
										elements: action.fields.map((field) => ({
											uid: field.ref,
											value: String(field.value ?? "")
										}))
									}));
									return await jsonOk(void 0, { resolveCurrentTarget: true });
								case "resize":
									await runGuardedAction((target) => resizeChromeMcpPage({
										...target,
										width: action.width,
										height: action.height
									}));
									return await jsonOk();
								case "wait":
									await runGuardedAction((target) => waitForExistingSessionCondition({
										...target,
										timeMs: action.timeMs,
										text: action.text,
										textGone: action.textGone,
										selector: action.selector,
										url: action.url,
										loadState: action.loadState,
										fn: action.fn,
										...navigationPolicy
									}));
									return await jsonOk();
								case "evaluate": return await jsonOk({ result: await runGuardedAction((target) => evaluateChromeMcpScript({
									...target,
									fn: normalizeBrowserEvaluateFunctionSource(action.fn, action.ref ? { argumentName: "el" } : void 0),
									args: action.ref ? [action.ref] : void 0
								})) }, { resolveCurrentTarget: true });
								case "close":
									await runGuardedAction((target) => profileCtx.closeTab(tab.targetId, {
										timeoutMs: target.timeoutMs,
										signal: target.signal,
										exactTargetId: true
									}));
									clearSnapshotKeysForTab(ctx, profileCtx.profile.name, tab.targetId);
									return await jsonOk();
								case "insertText":
								case "batch": return jsonActError(res, 501, ACT_ERROR_CODES.unsupportedForExistingSession, EXISTING_SESSION_LIMITS.act[action.kind]);
							}
						}
						const pw = await requirePwAi(res, `act:${kind}`);
						if (!pw) return;
						if (assertCurrent) await assertCurrent();
						const result = await pw.executeActViaPlaywright({
							cdpUrl,
							action,
							targetId: tab.targetId,
							evaluateEnabled,
							...navigationPolicy,
							signal,
							...assertCurrent ? { assertCurrent } : {}
						});
						const resultTargetOptions = {
							resolveCurrentTarget: true,
							operationTargetId: result.targetId
						};
						if (result.blockedByDialog) return await jsonOk({
							blockedByDialog: true,
							browserState: result.browserState
						});
						const downloads = result.downloads;
						if (action.kind === "close" || result.aborted?.reason === "closed") clearSnapshotKeysForTab(ctx, profileCtx.profile.name, tab.targetId);
						switch (action.kind) {
							case "batch": return await jsonOk({
								results: result.results ?? [],
								...result.aborted ? { aborted: result.aborted } : {},
								...downloads ? { downloads } : {}
							}, {
								...resultTargetOptions,
								resolveCurrentTarget: result.aborted?.reason !== "closed"
							});
							case "evaluate": return await jsonOk({
								result: result.result,
								...downloads ? { downloads } : {}
							}, resultTargetOptions);
							case "click":
							case "clickCoords": return await jsonOk(downloads ? { downloads } : void 0, resultTargetOptions);
							case "resize":
							case "close": return await jsonOk(downloads ? { downloads } : void 0);
							default: return await jsonOk(downloads ? { downloads } : void 0, resultTargetOptions);
						}
					} catch (error) {
						verificationDeadline?.throwIfAborted();
						requestDeadline?.throwIfAborted();
						throw error;
					} finally {
						verificationDeadline?.cleanup();
						await resolveRelayTarget?.release();
					}
				}
			});
		} finally {
			requestDeadline?.cleanup();
		}
	});
	registerBrowserAgentActHookRoutes(app, ctx);
	registerBrowserAgentActDownloadRoutes(app, ctx);
	app.post("/response/body", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const url = toStringOrEmpty(body.url);
		let timeoutMs;
		let maxChars;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
			maxChars = readRoutePositiveInteger(body.maxChars, "maxChars");
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		if (!url) return jsonError(res, 400, "url is required");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, resolveTabUrl }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(res, 501, EXISTING_SESSION_LIMITS.responseBody);
				const pw = await requirePwAi(res, "response body");
				if (!pw) return;
				const result = await pw.responseBodyViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					signal,
					url,
					timeoutMs: timeoutMs ?? void 0,
					maxChars: maxChars ?? void 0
				});
				signal.throwIfAborted();
				const currentUrl = await resolveTabUrl(tab.url);
				res.json({
					ok: true,
					targetId: tab.targetId,
					...currentUrl ? { url: currentUrl } : {},
					response: result
				});
			}
		});
	});
	app.post("/highlight", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const ref = toStringOrEmpty(body.ref);
		if (!ref) return jsonError(res, 400, "ref is required");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, cdpUrl, tab, signal, resolveTabUrl }) => {
				const jsonOk = async () => {
					const currentUrl = await resolveTabUrl(tab.url);
					return res.json({
						ok: true,
						targetId: tab.targetId,
						...currentUrl ? { url: currentUrl } : {}
					});
				};
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
					await evaluateChromeMcpScript({
						profileName: profileCtx.profile.name,
						profile: profileCtx.profile,
						targetId: tab.targetId,
						args: [ref],
						timeoutMs: ctx.state().resolved.actionTimeoutMs,
						signal,
						fn: `(el) => {
              if (!(el instanceof Element)) {
                return false;
              }
              el.scrollIntoView({ block: "center", inline: "center" });
              const previousOutline = el.style.outline;
              const previousOffset = el.style.outlineOffset;
              el.style.outline = "3px solid #FF4500";
              el.style.outlineOffset = "2px";
              setTimeout(() => {
                el.style.outline = previousOutline;
                el.style.outlineOffset = previousOffset;
              }, 2000);
              return true;
            }`
					});
					return await jsonOk();
				}
				const pw = await requirePwAi(res, "highlight");
				if (!pw) return;
				await pw.highlightViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					ref
				});
				await jsonOk();
			}
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.debug.ts
/**
* Browser debug and trace routes.
*
* Exposes console messages, page errors, network requests, dialog state, and
* Playwright tracing scoped to the selected browser tab.
*/
function browserDebugTargetPayload(targetId, url) {
	return {
		ok: true,
		targetId,
		...url ? { url } : {}
	};
}
async function sendPlaywrightDebugCollection(params) {
	const profileCtx = resolveProfileContext(params.req, params.res, params.ctx);
	if (!profileCtx) return;
	if (params.existingSessionUnsupported && getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(params.res, 501, params.existingSessionUnsupported);
	await withPlaywrightRouteContext({
		req: params.req,
		res: params.res,
		ctx: params.ctx,
		profileCtx,
		targetId: params.targetId,
		feature: params.feature,
		enforceCurrentUrlAllowed: true,
		run: async ({ cdpUrl, tab, pw, resolveTabUrl, signal }) => {
			const result = await params.collect({
				cdpUrl,
				targetId: tab.targetId,
				pw,
				signal
			});
			const url = await resolveTabUrl(tab.url);
			params.res.json({
				...browserDebugTargetPayload(tab.targetId, url),
				...result
			});
		}
	});
}
/** Register browser debug endpoints on the control server. */
function registerBrowserAgentDebugRoutes(app, ctx) {
	app.get("/console", async (req, res) => {
		const targetId = resolveTargetIdFromQuery(req.query);
		const level = typeof req.query.level === "string" ? req.query.level : "";
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId,
			feature: "console messages",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
				const messages = await pw.getConsoleMessagesViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					level: normalizeOptionalString(level)
				});
				const url = await resolveTabUrl(tab.url);
				res.json({
					...browserDebugTargetPayload(tab.targetId, url),
					messages
				});
			}
		});
	});
	app.get("/errors", async (req, res) => {
		const targetId = resolveTargetIdFromQuery(req.query);
		const clear = toBoolean(req.query.clear) ?? false;
		await sendPlaywrightDebugCollection({
			req,
			res,
			ctx,
			targetId,
			feature: "page errors",
			existingSessionUnsupported: EXISTING_SESSION_LIMITS.errors,
			collect: async ({ cdpUrl, targetId: targetIdValue, pw }) => await pw.getPageErrorsViaPlaywright({
				cdpUrl,
				targetId: targetIdValue,
				clear
			})
		});
	});
	app.get("/requests", async (req, res) => {
		const targetId = resolveTargetIdFromQuery(req.query);
		const filter = typeof req.query.filter === "string" ? req.query.filter : "";
		const clear = toBoolean(req.query.clear) ?? false;
		await sendPlaywrightDebugCollection({
			req,
			res,
			ctx,
			targetId,
			feature: "network requests",
			existingSessionUnsupported: EXISTING_SESSION_LIMITS.requests,
			collect: async ({ cdpUrl, targetId: targetIdLocal, pw }) => await pw.getNetworkRequestsViaPlaywright({
				cdpUrl,
				targetId: targetIdLocal,
				filter: normalizeOptionalString(filter),
				clear
			})
		});
	});
	app.get("/text", async (req, res) => {
		const targetId = resolveTargetIdFromQuery(req.query);
		const selector = normalizeOptionalString(req.query.selector);
		let maxChars;
		try {
			maxChars = readRoutePositiveInteger(req.query.maxChars, "maxChars");
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		await sendPlaywrightDebugCollection({
			req,
			res,
			ctx,
			targetId,
			feature: "page text",
			existingSessionUnsupported: EXISTING_SESSION_LIMITS.text,
			collect: async ({ cdpUrl, targetId: textTargetId, pw, signal }) => await pw.getPageTextViaPlaywright({
				cdpUrl,
				targetId: textTargetId,
				selector,
				maxChars,
				signal
			})
		});
	});
	app.get("/dialogs", async (req, res) => {
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId: resolveTargetIdFromQuery(req.query),
			feature: "dialog state",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
				const browserState = await pw.getObservedBrowserStateViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					ssrfPolicy: ctx.state().resolved.ssrfPolicy
				});
				const url = await resolveTabUrl(tab.url);
				res.json({
					...browserDebugTargetPayload(tab.targetId, url),
					browserState
				});
			}
		});
	});
	app.post("/trace/start", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const screenshots = toBoolean(body.screenshots) ?? void 0;
		const snapshots = toBoolean(body.snapshots) ?? void 0;
		const sources = toBoolean(body.sources) ?? void 0;
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId,
			feature: "trace start",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
				await pw.traceStartViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					screenshots,
					snapshots,
					sources
				});
				const url = await resolveTabUrl(tab.url);
				res.json(browserDebugTargetPayload(tab.targetId, url));
			}
		});
	});
	app.post("/trace/stop", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const out = toStringOrEmpty(body.path) || "";
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId,
			feature: "trace stop",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, resolveTabUrl }) => {
				const id = crypto.randomUUID();
				const tracePath = await resolveWritableOutputPathOrRespond({
					res,
					rootDir: DEFAULT_TRACE_DIR,
					requestedPath: out,
					scopeLabel: "trace directory",
					defaultFileName: `browser-trace-${id}.zip`,
					ensureRootDir: true
				});
				if (!tracePath) return;
				const committedTracePath = await pw.traceStopViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					path: tracePath
				});
				const url = await resolveTabUrl(tab.url);
				res.json({
					...browserDebugTargetPayload(tab.targetId, url),
					path: committedTracePath
				});
			}
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.screencast.ts
function clampScreencastOption(value, min, max, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value))) : fallback;
}
function registerBrowserAgentScreencastRoutes(app, ctx) {
	app.post("/screencast", async (req, res) => {
		const requesterGone = () => {
			if (!req.requester || req.requester.isCurrent()) return false;
			res.status(401).json({
				error: "The Gateway connection that requested the screencast has ended.",
				code: "SCREENCAST_REQUESTER_GONE"
			});
			return true;
		};
		if (requesterGone()) return;
		const body = readBody(req);
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId: resolveTargetIdFromBody(body),
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, tab, cdpUrl, signal, resolveTabUrl }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
					res.status(501).json({
						error: "Browser screencast is not available for existing-session profiles.",
						code: "SCREENCAST_UNSUPPORTED",
						reason: "existing-session"
					});
					return;
				}
				if (!await getPwAiModule()) {
					res.status(501).json({
						error: "Browser screencast requires Playwright in this gateway build.",
						code: "SCREENCAST_UNSUPPORTED",
						reason: "playwright"
					});
					return;
				}
				const state = ctx.state();
				const profileName = profileCtx.profile.name;
				const runtime = state.profiles.get(profileName);
				if (!runtime) throw new BrowserProfileUnavailableError("Browser profile is no longer available.");
				const lifecycle = getProfileLifecycle(runtime);
				const generation = lifecycle.generation;
				const configRevision = lifecycle.configRevision;
				const assertCurrent = () => {
					if (state.profiles.get(profileName) !== runtime || !isProfileGenerationCurrent({
						state,
						runtime,
						generation,
						configRevision
					})) throw new BrowserProfileUnavailableError("Browser screencast target was superseded.");
				};
				const url = await resolveTabUrl(tab.url);
				signal.throwIfAborted();
				assertCurrent();
				if (requesterGone()) return;
				const { token, expiresAtMs } = mintBrowserScreencastToken({
					profileName,
					targetId: tab.targetId,
					cdpUrl,
					ssrfPolicy: state.resolved.ssrfPolicy,
					maxWidth: clampScreencastOption(body.maxWidth, 320, 2e3, 1280),
					maxHeight: clampScreencastOption(body.maxHeight, 320, 2e3, 1280),
					quality: clampScreencastOption(body.quality, 30, 90, 70),
					lifecycleGeneration: generation,
					lifecycleSignal: lifecycle.controller.signal,
					requesterSignal: req.requester?.signal,
					isRequesterCurrent: req.requester?.isCurrent,
					assertCurrent,
					checkNavigationAllowed: async (nextUrl) => {
						await assertBrowserNavigationResultAllowed({
							url: nextUrl,
							...browserNavigationPolicyForProfile(ctx, profileCtx)
						});
					}
				});
				res.json({
					token,
					wsPath: `/browser/screencast?token=${token}`,
					expiresAtMs,
					targetId: tab.targetId,
					url
				});
			}
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp.snapshot-page.ts
const CHROME_MCP_OVERLAY_ATTR = "data-openclaw-mcp-overlay";
async function collectChromeMcpSnapshotUrls(params) {
	const result = await evaluateChromeMcpScript({
		...params,
		fn: `() => {
      const seen = new Set();
      const out = [];
      for (const anchor of document.querySelectorAll("a[href]")) {
        const href = anchor.href || "";
        if (!href || seen.has(href)) continue;
        const text = (anchor.innerText || anchor.textContent || anchor.getAttribute("aria-label") || "")
          .replace(/\\s+/g, " ")
          .trim()
          .slice(0, 121) || href;
        seen.add(href);
        out.push({ text, url: href });
        if (out.length >= 100) break;
      }
      return out;
    }`
	}).catch(() => []);
	return Array.isArray(result) ? result.filter((entry) => isRecord(entry) && typeof entry.text === "string" && typeof entry.url === "string").map((entry) => {
		entry.text = truncateUtf16Safe(entry.text, 120) || entry.url;
		return entry;
	}) : [];
}
/** Keep labels, capture, and document cleanup in one target operation. */
async function withChromeMcpLabels(params, capture) {
	return await withChromeMcpTarget(params, async (target) => {
		const documents = /* @__PURE__ */ new Map();
		for (const ref of params.refs) {
			const binding = resolveChromeMcpSnapshotRef(target.lease.session, params.targetId, ref);
			if (!binding.documentUid) throw new Error("Snapshot ref has no owning document. Take a new snapshot before labeling.");
			let group = documents.get(binding.documentUid);
			if (!group) {
				group = {
					refs: [],
					uids: []
				};
				documents.set(binding.documentUid, group);
			}
			group.refs.push(ref);
			group.uids.push(binding.uid);
		}
		const token = randomUUID();
		const touchedDocuments = [];
		const evaluate = async (documentUid, fn, uids = []) => {
			try {
				return extractJsonMessage(await callTool(params.profileName, target.profileOptions, "evaluate_script", {
					pageId: target.pageId,
					function: fn,
					args: [documentUid, ...uids]
				}, { timeoutMs: params.timeoutMs }, target.lease));
			} catch (error) {
				return rethrowChromeMcpDocumentError(error);
			}
		};
		let labels = 0;
		let captured;
		let cleanup;
		try {
			for (const [documentUid, group] of documents) {
				params.signal?.throwIfAborted();
				touchedDocuments.push(documentUid);
				const count = await evaluate(documentUid, `(documentRoot, ...elements) => {
          const doc = documentRoot.nodeType === 9 ? documentRoot : documentRoot.ownerDocument;
          const refs = ${JSON.stringify(group.refs)};
          const clipToRef = ${params.clipToRef === true};
          if (clipToRef && elements[0] instanceof Element) {
            elements[0].scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
          }
          const root = doc.createElement("div");
          root.setAttribute("${CHROME_MCP_OVERLAY_ATTR}", ${JSON.stringify(token)});
          root.style.position = "fixed";
          root.style.inset = "0";
          root.style.pointerEvents = "none";
          root.style.zIndex = "2147483647";
          let labels = 0;
          elements.forEach((el, index) => {
            if (!(el instanceof Element)) return;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;
            labels += 1;
            const badge = doc.createElement("div");
            badge.setAttribute("${CHROME_MCP_OVERLAY_ATTR}", "label");
            badge.textContent = refs[index];
            badge.style.position = "fixed";
            badge.style.left = \`\${Math.max(0, rect.left)}px\`;
            badge.style.top = \`\${Math.max(0, rect.top + (clipToRef ? 2 : 0))}px\`;
            badge.style.transform = clipToRef ? "none" : "translateY(-100%)";
            badge.style.padding = "2px 6px";
            badge.style.borderRadius = "999px";
            badge.style.background = "#FF4500";
            badge.style.color = "#fff";
            badge.style.font = "600 12px ui-monospace, SFMono-Regular, Menlo, monospace";
            badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
            badge.style.whiteSpace = "nowrap";
            root.appendChild(badge);
          });
          doc.documentElement.appendChild(root);
          return labels;
        }`, group.uids);
				if (typeof count !== "number") throw new Error("Chrome MCP label rendering returned an invalid count");
				labels += count;
			}
			params.signal?.throwIfAborted();
			captured = await capture({
				labels,
				skipped: params.refs.length - labels
			}, async (options) => {
				params.signal?.throwIfAborted();
				const buffer = await takeChromeMcpScreenshotOnTarget({
					...params,
					...options,
					signal: void 0
				}, target);
				params.signal?.throwIfAborted();
				return buffer;
			});
		} finally {
			cleanup = await Promise.allSettled(touchedDocuments.map((documentUid) => evaluate(documentUid, `(documentRoot) => {
          const doc = documentRoot.nodeType === 9 ? documentRoot : documentRoot.ownerDocument;
          doc.querySelectorAll('[${CHROME_MCP_OVERLAY_ATTR}="${token}"]').forEach((node) => node.remove());
        }`)));
		}
		for (const result of cleanup) if (result.status === "rejected" && !(result.reason instanceof ChromeMcpDocumentUnavailableError)) throw toErrorObject(result.reason, "Chrome MCP label cleanup failed");
		return captured;
	});
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp.snapshot.ts
/**
* Chrome MCP snapshot conversion helpers.
*
* Converts chrome-devtools-mcp structured snapshots into OpenClaw ARIA nodes
* and compact AI snapshots with stable refs and duplicate tracking.
*/
function normalizeSnapshotString(value) {
	if (typeof value === "string") return value.trim() || void 0;
	return typeof value === "number" || typeof value === "boolean" ? String(value) : void 0;
}
function normalizeRole(node) {
	return normalizeLowercaseStringOrEmpty(node.role) || "generic";
}
function shouldIncludeNode(params) {
	if (params.options?.interactive && !INTERACTIVE_ROLES.has(params.role)) return false;
	if (params.options?.compact && STRUCTURAL_ROLES.has(params.role) && !params.name) return false;
	return true;
}
function shouldCreateRef(role, name) {
	return INTERACTIVE_ROLES.has(role) || CONTENT_ROLES.has(role) && Boolean(name);
}
/** Build ARIA nodes while preserving whether a traversal ceiling omitted input. */
function flattenChromeMcpSnapshotToAriaResult(root, limit = 500) {
	const boundedLimit = Math.max(1, Math.min(2e3, Math.floor(limit)));
	const out = [];
	let truncated = false;
	const visit = (node, depth) => {
		if (out.length >= boundedLimit) {
			truncated = true;
			return;
		}
		if (depth > 100) {
			truncated = true;
			return;
		}
		const ref = normalizeSnapshotString(node.id);
		if (ref) out.push({
			ref,
			role: normalizeRole(node),
			name: normalizeSnapshotString(node.name) ?? "",
			value: normalizeSnapshotString(node.value),
			description: normalizeSnapshotString(node.description),
			depth
		});
		const children = node.children ?? [];
		for (const [index, child] of children.entries()) {
			visit(child, depth + 1);
			if (out.length >= boundedLimit) {
				truncated ||= index + 1 < children.length;
				return;
			}
		}
	};
	visit(root, 0);
	return truncated ? {
		nodes: out,
		truncated: true
	} : { nodes: out };
}
/** Build a compact text snapshot and ref map from a Chrome MCP snapshot tree. */
function buildAiSnapshotFromChromeMcpSnapshot(params) {
	const refs = {};
	const counts = /* @__PURE__ */ new Map();
	const lines = [];
	const maxDepth = Math.min(params.options?.maxDepth ?? 100, 100);
	const hardLimitApplied = params.options?.maxDepth === void 0 || params.options.maxDepth >= 100;
	let truncated = false;
	const visit = (node, depth) => {
		if (depth > maxDepth) {
			truncated ||= hardLimitApplied;
			return;
		}
		const role = normalizeRole(node);
		const name = normalizeSnapshotString(node.name);
		const value = normalizeSnapshotString(node.value);
		const description = normalizeSnapshotString(node.description);
		if (shouldIncludeNode({
			role,
			name,
			options: params.options
		})) {
			let line = `${"  ".repeat(depth)}- ${role}`;
			if (name) line += ` ${JSON.stringify(name)}`;
			const ref = normalizeSnapshotString(node.id);
			if (ref && shouldCreateRef(role, name)) {
				const key = `${role}:${name ?? ""}`;
				const nth = counts.get(key);
				counts.set(key, (nth ?? 0) + 1);
				refs[ref] = nth === void 0 ? {
					role,
					name
				} : {
					role,
					name,
					nth
				};
				line += ` [ref=${ref}]`;
			}
			if (value) line += ` value=${JSON.stringify(value)}`;
			if (description) line += ` description=${JSON.stringify(description)}`;
			lines.push(line);
		}
		for (const child of node.children ?? []) visit(child, depth + 1);
	};
	visit(params.root, 0);
	const result = {
		snapshot: lines.join("\n"),
		refs
	};
	return truncated ? {
		...result,
		truncated: true
	} : result;
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp.snapshot-result.ts
function buildChromeMcpRouteSnapshot(params) {
	const built = buildAiSnapshotFromChromeMcpSnapshot(params);
	return built.truncated ? {
		...built,
		snapshot: appendRoleSnapshotDepthTruncationMarker(built.snapshot),
		truncated: true
	} : built;
}
function flattenChromeMcpRouteSnapshot(root, limit = 500) {
	return flattenChromeMcpSnapshotToAriaResult(root, limit);
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot.plan.ts
/**
* Snapshot planning for browser route handlers.
*
* Resolves requested snapshot mode, format, limits, refs, labels, and driver
* choice before the route talks to Playwright or Chrome MCP.
*/
/** Resolve a normalized snapshot plan from query parameters and profile caps. */
function resolveSnapshotPlan(params) {
	const mode = params.query.mode === "efficient" ? "efficient" : void 0;
	const labels = toBoolean(params.query.labels) ?? void 0;
	const urls = toBoolean(params.query.urls) ?? void 0;
	const explicitFormat = params.query.format === "aria" ? "aria" : params.query.format === "ai" ? "ai" : void 0;
	const format = resolveDefaultSnapshotFormat({
		profile: params.profile,
		hasPlaywright: params.hasPlaywright,
		explicitFormat,
		mode
	});
	const limit = parseStrictPositiveInteger(params.query.limit);
	const hasMaxChars = Object.hasOwn(params.query, "maxChars");
	const maxCharsRaw = parseStrictNonNegativeInteger(params.query.maxChars);
	const resolvedMaxChars = format === "ai" ? hasMaxChars ? maxCharsRaw === void 0 ? mode === "efficient" ? DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS : DEFAULT_AI_SNAPSHOT_MAX_CHARS : maxCharsRaw !== void 0 && maxCharsRaw > 0 ? maxCharsRaw : void 0 : mode === "efficient" ? DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS : DEFAULT_AI_SNAPSHOT_MAX_CHARS : void 0;
	const interactiveRaw = toBoolean(params.query.interactive);
	const compactRaw = toBoolean(params.query.compact);
	const depthRaw = parseStrictNonNegativeInteger(params.query.depth);
	const refsModeRaw = toStringOrEmpty(params.query.refs).trim();
	const refsMode = refsModeRaw === "aria" ? "aria" : refsModeRaw === "role" ? "role" : void 0;
	const interactive = interactiveRaw ?? (mode === "efficient" ? true : void 0);
	const compact = compactRaw ?? (mode === "efficient" ? true : void 0);
	const depth = depthRaw ?? (mode === "efficient" ? 6 : void 0);
	const selectorValue = normalizeOptionalString(toStringOrEmpty(params.query.selector));
	const frameSelectorValue = normalizeOptionalString(toStringOrEmpty(params.query.frame));
	const timeoutMsRaw = parseStrictPositiveInteger(params.query.timeoutMs);
	return {
		format,
		mode,
		labels,
		urls,
		limit,
		resolvedMaxChars,
		interactive,
		compact,
		depth,
		refsMode,
		selectorValue,
		frameSelectorValue,
		timeoutMs: timeoutMsRaw !== void 0 ? normalizeBrowserTimerDelayMs(timeoutMsRaw) : void 0,
		wantsRoleSnapshot: labels === true || urls === true || mode === "efficient" || interactive === true || compact === true || depth !== void 0 || Boolean(selectorValue) || Boolean(frameSelectorValue)
	};
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.snapshot.ts
async function saveBrowserMedia(buffer, contentType, maxBytes) {
	await ensureMediaDir();
	const saved = await saveMediaBuffer(buffer, contentType, "browser", maxBytes);
	return path.resolve(saved.path);
}
async function saveBrowserScreenshot(capture, type) {
	const normalized = await normalizeBrowserScreenshot(capture.buffer, {
		maxSide: DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
		maxBytes: DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES
	});
	const annotations = await rescaleAnnotationsForNormalization({
		annotations: capture.annotations,
		originalBuffer: capture.buffer,
		normalized
	});
	return {
		imagePath: await saveBrowserMedia(normalized.buffer, normalized.contentType ?? `image/${type}`, DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES),
		imageType: normalized.contentType?.includes("jpeg") ? "jpeg" : type,
		...typeof capture.labels === "number" ? {
			labels: true,
			labelsCount: capture.labels
		} : {},
		...typeof capture.skipped === "number" ? { labelsSkipped: capture.skipped } : {},
		...capture.truncated ? { truncated: true } : {},
		...annotations?.length ? { annotations } : {}
	};
}
async function rescaleAnnotationsForNormalization(params) {
	if (!params.annotations || params.annotations.length === 0) return params.annotations;
	const orig = params.normalized.sourceDimensions;
	if (params.originalBuffer === params.normalized.buffer || !orig?.width || !orig?.height) return params.annotations;
	const next = await getImageMetadata(params.normalized.buffer);
	if (!next?.width || !next?.height) return params.annotations;
	if (next.width === orig.width && next.height === orig.height) return params.annotations;
	return scaleAnnotations(params.annotations, next.width / orig.width, next.height / orig.height);
}
/** Register snapshot, screenshot, and navigation endpoints. */
function registerBrowserAgentSnapshotRoutes(app, ctx) {
	app.post("/navigate", async (req, res) => {
		const body = readBody(req);
		const url = toStringOrEmpty(body.url);
		const targetId = toStringOrEmpty(body.targetId) || void 0;
		if (!url) return jsonError(res, 400, "url is required");
		let timeoutMs;
		try {
			const requestedTimeoutMs = readRouteTimerTimeoutMs(body.timeoutMs);
			timeoutMs = requestedTimeoutMs === void 0 ? void 0 : resolveBrowserNavigationTimeoutMs(requestedTimeoutMs);
		} catch (err) {
			return jsonError(res, 400, String(err instanceof Error ? err.message : err));
		}
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			run: async ({ profileCtx, tab, cdpUrl, signal, assertCurrent }) => {
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
					const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
					await assertBrowserNavigationAllowed({
						url,
						...ssrfPolicyOpts
					});
					const result = await navigateChromeMcpPage({
						profileName: profileCtx.profile.name,
						profile: profileCtx.profile,
						targetId: tab.targetId,
						url,
						timeoutMs,
						signal
					});
					await assertBrowserNavigationResultAllowed({
						url: result.url,
						...ssrfPolicyOpts
					});
					return res.json({
						ok: true,
						targetId: tab.targetId,
						...result
					});
				}
				const pw = await requirePwAi(res, "navigate");
				if (!pw) return;
				const resolveRelayTarget = await captureBrowserOperationTarget({
					ctx,
					profileName: profileCtx.profile.name,
					targetId: tab.targetId
				});
				try {
					const result = await pw.navigateViaPlaywright({
						cdpUrl,
						targetId: tab.targetId,
						url,
						timeoutMs,
						...assertCurrent ? { assertCurrent } : {},
						...resolveRelayTarget ? {
							resolveOperationTarget: resolveRelayTarget,
							relayReference: resolveRelayTarget.reference
						} : {},
						...browserNavigationPolicyForProfile(ctx, profileCtx)
					});
					const currentTargetId = await resolveOperationTargetOutcome({
						actedOnTargetId: tab.targetId,
						operationTargetId: result.targetId,
						resolveRelayTarget
					});
					res.json({
						ok: true,
						...result,
						targetId: currentTargetId
					});
				} finally {
					await resolveRelayTarget?.release();
				}
			}
		});
	});
	app.post("/pdf", async (req, res) => {
		const targetId = toStringOrEmpty(readBody(req).targetId) || void 0;
		const profileCtx = resolveProfileContext(req, res, ctx);
		if (!profileCtx) return;
		if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(res, 501, EXISTING_SESSION_LIMITS.snapshot.pdfUnsupported);
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			profileCtx,
			targetId,
			feature: "pdf",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw }) => {
				const pdf = await pw.pdfViaPlaywright({
					cdpUrl,
					targetId: tab.targetId
				});
				const pdfPath = await saveBrowserMedia(pdf.buffer, "application/pdf", pdf.buffer.byteLength);
				res.json({
					ok: true,
					path: pdfPath,
					targetId: tab.targetId,
					url: tab.url
				});
			}
		});
	});
	app.post("/screenshot", async (req, res) => {
		const body = readBody(req);
		const targetId = toStringOrEmpty(body.targetId) || void 0;
		const fullPage = toBoolean(body.fullPage) ?? false;
		const ref = toStringOrEmpty(body.ref) || void 0;
		const element = toStringOrEmpty(body.element) || void 0;
		const labels = toBoolean(body.labels) ?? false;
		const type = body.type === "jpeg" ? "jpeg" : "png";
		let timeoutMs;
		try {
			const timeoutMsRaw = readRoutePositiveInteger(body.timeoutMs, "timeoutMs");
			timeoutMs = timeoutMsRaw !== void 0 ? normalizeBrowserTimerDelayMs(timeoutMsRaw) : DEFAULT_BROWSER_SCREENSHOT_TIMEOUT_MS;
		} catch (err) {
			return jsonError(res, 400, String(err instanceof Error ? err.message : err));
		}
		if (fullPage && (ref || element)) return jsonError(res, 400, "fullPage is not supported for element screenshots");
		await withRouteTabContext({
			req,
			res,
			ctx,
			targetId,
			enforceCurrentUrlAllowed: true,
			run: async ({ profileCtx, tab, cdpUrl, signal }) => {
				const jsonScreenshot = (image) => {
					const { imagePath, imageType: _imageType, ...details } = image;
					res.json({
						ok: true,
						path: imagePath,
						targetId: tab.targetId,
						url: tab.url,
						...details
					});
				};
				if (getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) {
					const operation = {
						profileName: profileCtx.profile.name,
						profile: profileCtx.profile,
						targetId: tab.targetId,
						timeoutMs,
						signal
					};
					const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
					if (ssrfPolicyOpts.ssrfPolicy) await assertBrowserNavigationResultAllowed({
						url: tab.url,
						...ssrfPolicyOpts
					});
					if (element) return jsonError(res, 400, EXISTING_SESSION_LIMITS.snapshot.screenshotElement);
					if (labels) {
						const built = ref ? void 0 : buildChromeMcpRouteSnapshot({ root: await takeChromeMcpSnapshot(operation) });
						return jsonScreenshot(await withChromeMcpLabels({
							...operation,
							refs: ref ? [ref] : Object.keys(built?.refs ?? {}),
							clipToRef: Boolean(ref)
						}, async (labelResult, capture) => {
							return await saveBrowserScreenshot({
								buffer: await capture({
									uid: ref,
									fullPage,
									format: type
								}),
								...labelResult,
								truncated: built?.truncated
							}, type);
						}));
					}
					jsonScreenshot(await saveBrowserScreenshot({ buffer: await takeChromeMcpScreenshot({
						...operation,
						uid: ref,
						fullPage,
						format: type
					}) }, type));
					return;
				}
				let capture;
				if (labels || getLoadedPwAiModule()?.hasCachedPlaywrightBrowserConnection(cdpUrl) || shouldUsePlaywrightForScreenshot({
					profile: profileCtx.profile,
					wsUrl: tab.wsUrl,
					ref,
					element
				})) {
					const pw = await requirePwAi(res, "screenshot");
					if (!pw) return;
					if (labels) {
						const snap = ref ? void 0 : await pw.snapshotRoleViaPlaywright({
							cdpUrl,
							targetId: tab.targetId,
							ssrfPolicy: ctx.state().resolved.ssrfPolicy,
							timeoutMs,
							signal
						});
						capture = await pw.screenshotWithLabelsViaPlaywright({
							cdpUrl,
							targetId: tab.targetId,
							refs: snap?.refs,
							type,
							timeoutMs,
							fullPage,
							ref,
							element,
							signal
						});
					} else capture = await pw.takeScreenshotViaPlaywright({
						cdpUrl,
						targetId: tab.targetId,
						ref,
						element,
						fullPage,
						type,
						timeoutMs,
						signal
					});
				} else {
					const profileRuntime = ctx.state().profiles.get(profileCtx.profile.name);
					capture = { buffer: await captureScreenshot({
						wsUrl: tab.wsUrl ?? "",
						...tab.wsLookup ? { lookup: tab.wsLookup } : {},
						fullPage,
						format: type,
						quality: type === "jpeg" ? 85 : void 0,
						timeoutMs,
						headless: profileRuntime?.running?.headless ?? await profileRuntime?.externalBrowserMode?.headless
					}) };
				}
				jsonScreenshot(await saveBrowserScreenshot(capture, type));
			}
		});
	});
	app.get("/snapshot", async (req, res) => {
		const profileCtx = resolveProfileContext(req, res, ctx);
		if (!profileCtx) return;
		const targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
		const pwModule = await getPwAiModule();
		const hasPlaywright = Boolean(pwModule);
		const plan = resolveSnapshotPlan({
			profile: profileCtx.profile,
			query: req.query,
			hasPlaywright
		});
		const usesChromeMcp = getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp;
		if ((plan.labels || plan.mode === "efficient") && plan.format === "aria") return jsonError(res, 400, "labels/mode=efficient require format=ai");
		if (usesChromeMcp && (plan.selectorValue || plan.frameSelectorValue)) return jsonError(res, 400, EXISTING_SESSION_LIMITS.snapshot.snapshotSelector);
		try {
			await runProfileRouteOperation({
				profileCtx,
				signal: req.signal,
				assertCurrent: req.assertCurrent,
				run: async (signal) => {
					const tab = await profileCtx.ensureTabAvailable(targetId || void 0, {
						allowPlaywrightFallback: hasPlaywright,
						signal,
						timeoutMs: plan.timeoutMs
					});
					const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
					if (ssrfPolicyOpts.ssrfPolicy) await assertBrowserNavigationResultAllowed({
						url: tab.url,
						...ssrfPolicyOpts
					});
					await req.assertCurrent?.(profileCtx.profile);
					const jsonSnapshot = (snapshot) => res.json({
						ok: true,
						format: plan.format,
						targetId: tab.targetId,
						url: tab.url,
						...snapshot
					});
					const deltaFamily = plan.format === "ai" ? {
						identity: usesChromeMcp ? "aria" : plan.wantsRoleSnapshot ? plan.refsMode === "aria" ? "aria" : "role" : pwModule ? "aria" : "role",
						interactive: plan.interactive,
						compact: plan.compact,
						depth: plan.depth,
						selector: plan.selectorValue,
						frame: plan.frameSelectorValue,
						urls: plan.urls,
						maxChars: plan.resolvedMaxChars
					} : void 0;
					const createDeltaState = (documentIdentity) => {
						const previousKeys = deltaFamily && documentIdentity ? getPreviousSnapshotKeys(ctx, {
							profile: profileCtx.profile.name,
							targetId: tab.targetId,
							documentIdentity,
							family: deltaFamily
						}) : void 0;
						return {
							delta: deltaFamily && previousKeys !== void 0 ? {
								mode: deltaFamily.identity,
								previousKeys
							} : void 0,
							record: (refs) => {
								if (!deltaFamily || !documentIdentity) return;
								recordSnapshotKeys(ctx, {
									profile: profileCtx.profile.name,
									targetId: tab.targetId,
									documentIdentity,
									family: deltaFamily,
									refs
								});
							}
						};
					};
					if (usesChromeMcp) {
						const operation = {
							profileName: profileCtx.profile.name,
							profile: profileCtx.profile,
							targetId: tab.targetId,
							timeoutMs: plan.timeoutMs,
							signal
						};
						const snapshot = await takeChromeMcpSnapshot(operation);
						if (plan.format === "aria") return jsonSnapshot(flattenChromeMcpRouteSnapshot(snapshot, plan.limit));
						const built = buildChromeMcpRouteSnapshot({
							root: snapshot,
							options: {
								interactive: plan.interactive ?? void 0,
								compact: plan.compact ?? void 0,
								maxDepth: plan.depth ?? void 0
							}
						});
						const builtWithUrls = plan.urls ? {
							...built,
							snapshot: appendSnapshotUrls(built.snapshot, await collectChromeMcpSnapshotUrls(operation))
						} : built;
						const finalizedBase = finalizeRoleSnapshot({
							...builtWithUrls,
							maxChars: plan.resolvedMaxChars
						});
						const finalized = built.truncated && !finalizedBase.truncated ? {
							...finalizedBase,
							truncated: true
						} : finalizedBase;
						if (plan.labels) return jsonSnapshot({
							...await withChromeMcpLabels({
								...operation,
								refs: Object.keys(finalized.refs)
							}, async (labelResult, capture) => {
								return await saveBrowserScreenshot({
									buffer: await capture({ format: "png" }),
									...labelResult
								}, "png");
							}),
							...finalized
						});
						return jsonSnapshot(finalized);
					}
					const readPlaywrightDocumentIdentities = pwModule?.getDocumentIdentitiesViaPlaywright;
					let observedBrowserState;
					if (pwModule) observedBrowserState = await pwModule.getObservedBrowserStateViaPlaywright({
						cdpUrl: profileCtx.profile.cdpUrl,
						targetId: tab.targetId,
						ssrfPolicy: ctx.state().resolved.ssrfPolicy
					}).catch(() => void 0);
					const browserStateFields = observedBrowserState && (observedBrowserState.dialogs.pending.length || observedBrowserState.dialogs.recent.length) ? { browserState: observedBrowserState } : {};
					if (observedBrowserState?.dialogs.pending.length) return jsonSnapshot({
						blockedByDialog: true,
						...browserStateFields,
						...plan.format === "aria" ? { nodes: [] } : {
							snapshot: "",
							refs: {}
						}
					});
					const readDocumentIdentities = async () => {
						const playwrightIdentities = readPlaywrightDocumentIdentities ? await readPlaywrightDocumentIdentities({
							cdpUrl: profileCtx.profile.cdpUrl,
							targetId: tab.targetId,
							timeoutMs: plan.timeoutMs
						}).catch(() => void 0) : void 0;
						if (playwrightIdentities?.mainFrame || !tab.wsUrl) return playwrightIdentities ?? {};
						return await getDocumentIdentitiesViaCdp({
							wsUrl: tab.wsUrl,
							...tab.wsLookup ? { lookup: tab.wsLookup } : {},
							timeoutMs: plan.timeoutMs
						}).catch(() => ({}));
					};
					const initialIdentities = await readDocumentIdentities();
					const initialDocumentIdentity = initialIdentities.mainFrame;
					const snapshotSpansFrames = plan.format === "ai" && !plan.frameSelectorValue && (plan.refsMode === "aria" || !pwModule || !plan.wantsRoleSnapshot);
					const deltaState = createDeltaState(snapshotSpansFrames || plan.frameSelectorValue ? initialIdentities.frameTree : initialDocumentIdentity);
					const assertDocumentIdentityUnchanged = async () => {
						if (!initialDocumentIdentity) return;
						const finalIdentities = await readDocumentIdentities();
						if (finalIdentities.mainFrame !== initialDocumentIdentity || snapshotSpansFrames && initialIdentities.frameTree && finalIdentities.frameTree !== initialIdentities.frameTree) throw new Error("Frame changed while its browser snapshot was being captured; retry.");
					};
					if (plan.format === "ai") {
						const roleSnapshotArgs = {
							cdpUrl: profileCtx.profile.cdpUrl,
							targetId: tab.targetId,
							selector: plan.selectorValue,
							frameSelector: plan.frameSelectorValue,
							refsMode: plan.refsMode,
							ssrfPolicy: ctx.state().resolved.ssrfPolicy,
							urls: plan.urls,
							timeoutMs: plan.timeoutMs,
							maxChars: plan.resolvedMaxChars,
							signal,
							options: {
								interactive: plan.interactive ?? void 0,
								compact: plan.compact ?? void 0,
								maxDepth: plan.depth ?? void 0
							},
							delta: deltaState.delta
						};
						const cdpRoleWsUrl = plan.refsMode !== "aria" && !plan.selectorValue && !plan.frameSelectorValue ? tab.wsUrl : null;
						let usedCdpRoleSnapshot = false;
						let cdpCaptureDeadlineMs;
						const cdpRoleSnapshot = async (recurseIframes = true) => {
							if (!cdpRoleWsUrl) return null;
							cdpCaptureDeadlineMs = performance.now() + (plan.timeoutMs ?? 5e3);
							const snapshot = await snapshotRoleViaCdp({
								wsUrl: cdpRoleWsUrl,
								...tab.wsLookup ? { lookup: tab.wsLookup } : {},
								urls: plan.urls,
								recurseIframes,
								timeoutMs: plan.timeoutMs,
								maxChars: plan.resolvedMaxChars,
								options: {
									interactive: plan.interactive ?? void 0,
									compact: plan.compact ?? void 0,
									maxDepth: plan.depth ?? void 0
								},
								delta: deltaState.delta
							});
							usedCdpRoleSnapshot = true;
							return snapshot;
						};
						const pw = pwModule;
						const cdpFirstPw = pw && plan.wantsRoleSnapshot && cdpRoleWsUrl ? pw : null;
						const snap = plan.wantsRoleSnapshot ? cdpFirstPw ? await cdpRoleSnapshot(false).catch(async () => {
							signal.throwIfAborted();
							return await cdpFirstPw.snapshotRoleViaPlaywright(roleSnapshotArgs);
						}) : pw ? await pw.snapshotRoleViaPlaywright(roleSnapshotArgs) : await cdpRoleSnapshot() : pw ? await pw.snapshotRoleViaPlaywright({
							cdpUrl: profileCtx.profile.cdpUrl,
							targetId: tab.targetId,
							refsMode: "aria",
							ssrfPolicy: ctx.state().resolved.ssrfPolicy,
							urls: plan.urls,
							timeoutMs: plan.timeoutMs,
							signal,
							...typeof plan.resolvedMaxChars === "number" ? { maxChars: plan.resolvedMaxChars } : {},
							delta: deltaState.delta
						}) : await cdpRoleSnapshot();
						if (!snap) {
							await requirePwAi(res, "ai snapshot");
							return;
						}
						if (usedCdpRoleSnapshot && pw && "refs" in snap) {
							await assertDocumentIdentityUnchanged();
							await pw.storeSnapshotRefsViaPlaywright({
								cdpUrl: profileCtx.profile.cdpUrl,
								targetId: tab.targetId,
								refs: snap.refs,
								signal,
								deadlineMs: cdpCaptureDeadlineMs,
								...initialDocumentIdentity ? { expectedDocumentIdentity: initialDocumentIdentity } : {}
							});
						}
						let image;
						if (plan.labels) {
							if (!pw) return jsonError(res, 501, "Snapshot labels require Playwright.");
							image = await saveBrowserScreenshot(await pw.screenshotWithLabelsViaPlaywright({
								cdpUrl: profileCtx.profile.cdpUrl,
								targetId: tab.targetId,
								refs: "refs" in snap ? snap.refs : {},
								type: "png",
								timeoutMs: plan.timeoutMs,
								signal
							}), "png");
						}
						await assertDocumentIdentityUnchanged();
						deltaState.record(snap.refs ?? {});
						return jsonSnapshot({
							...browserStateFields,
							...image,
							...snap
						});
					}
					const usePlaywrightAriaSnapshot = shouldUsePlaywrightForAriaSnapshot({
						profile: profileCtx.profile,
						wsUrl: tab.wsUrl
					});
					let resolved;
					if (usePlaywrightAriaSnapshot) {
						const pw = await requirePwAi(res, "aria snapshot");
						if (!pw) return;
						resolved = await pw.snapshotAriaViaPlaywright({
							cdpUrl: profileCtx.profile.cdpUrl,
							targetId: tab.targetId,
							limit: plan.limit,
							timeoutMs: plan.timeoutMs,
							ssrfPolicy: ctx.state().resolved.ssrfPolicy,
							signal
						});
					} else {
						const captureDeadlineMs = performance.now() + (plan.timeoutMs ?? 5e3);
						resolved = await snapshotAria({
							wsUrl: tab.wsUrl ?? "",
							...tab.wsLookup ? { lookup: tab.wsLookup } : {},
							limit: plan.limit,
							timeoutMs: plan.timeoutMs
						});
						await assertDocumentIdentityUnchanged();
						await pwModule?.storeSnapshotRefsViaPlaywright?.({
							cdpUrl: profileCtx.profile.cdpUrl,
							targetId: tab.targetId,
							nodes: resolved.nodes,
							signal,
							deadlineMs: captureDeadlineMs,
							...initialDocumentIdentity ? { expectedDocumentIdentity: initialDocumentIdentity } : {}
						});
					}
					await assertDocumentIdentityUnchanged();
					return jsonSnapshot({
						...browserStateFields,
						...resolved
					});
				}
			});
		} catch (err) {
			handleRouteError(ctx, res, err);
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.storage.ts
/**
* Browser storage and context mutation routes.
*
* Parses and applies cookies, local/session storage, geolocation, permissions,
* and related browser-context mutations for the selected profile/tab.
*/
/** Parse the supported browser storage bucket names. */
function parseStorageKind(raw) {
	if (raw === "local" || raw === "session") return raw;
	return null;
}
/** Parse storage mutations once at the request boundary. */
function parseStorageMutationFromRequest(req, res) {
	const body = readBody(req);
	const kind = parseStorageKind(toStringOrEmpty(req.params.kind));
	const targetId = resolveTargetIdFromBody(body);
	if (!kind) {
		jsonError(res, 400, "kind must be local|session");
		return null;
	}
	return {
		body,
		parsed: {
			kind,
			targetId
		}
	};
}
function assertRange(value, fieldName, min, max) {
	if (value === void 0) return;
	if (value < min || value > max) throw new Error(`${fieldName} must be between ${min} and ${max}.`);
	return value;
}
function readOptionalHttpOrigin(raw) {
	const value = toStringOrEmpty(raw);
	if (!value) return;
	const origin = readHttpOrigin(value);
	if (!origin) throw new Error("origin must be an http(s) origin");
	return origin;
}
/** Parse cookie options accepted by browser storage mutation routes. */
function parseCookieSetOptions(cookie) {
	return {
		name: toStringOrEmpty(cookie.name),
		value: toStringOrEmpty(cookie.value),
		url: toStringOrEmpty(cookie.url) || void 0,
		domain: toStringOrEmpty(cookie.domain) || void 0,
		path: toStringOrEmpty(cookie.path) || void 0,
		expires: readOptionalRouteFiniteNumber(cookie.expires, "cookie.expires"),
		httpOnly: toBoolean(cookie.httpOnly) ?? void 0,
		secure: toBoolean(cookie.secure) ?? void 0,
		sameSite: cookie.sameSite === "Lax" || cookie.sameSite === "None" || cookie.sameSite === "Strict" ? cookie.sameSite : void 0
	};
}
/** Parse geolocation override options accepted by context mutation routes. */
function parseGeolocationOptions(body) {
	const clear = toBoolean(body.clear) ?? false;
	if (clear) return { clear };
	const origin = readOptionalHttpOrigin(body.origin);
	const latitude = assertRange(readRouteFiniteNumber(body.latitude, "latitude"), "latitude", -90, 90);
	const longitude = assertRange(readRouteFiniteNumber(body.longitude, "longitude"), "longitude", -180, 180);
	const accuracy = readRouteFiniteNumber(body.accuracy, "accuracy");
	if (accuracy !== void 0 && accuracy < 0) throw new Error("accuracy must be non-negative.");
	if (!clear && (latitude === void 0 || longitude === void 0)) throw new Error("latitude and longitude are required (or set clear=true)");
	return {
		clear,
		latitude,
		longitude,
		accuracy,
		origin
	};
}
/** Register storage and browser-context mutation endpoints. */
function registerBrowserAgentStorageRoutes(app, ctx) {
	const runMutation = async (req, res, targetId, feature, run, existingSessionUnsupported) => {
		const profileCtx = existingSessionUnsupported ? resolveProfileContext(req, res, ctx) : void 0;
		if (profileCtx === null) return;
		if (existingSessionUnsupported && profileCtx && getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return jsonError(res, 501, existingSessionUnsupported);
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			profileCtx,
			targetId,
			feature,
			run: async (context) => {
				const result = await run(context.pw, {
					...context.assertCurrent ? { assertCurrent: context.assertCurrent } : {},
					cdpUrl: context.cdpUrl,
					targetId: context.tab.targetId
				}, context.signal);
				context.signal.throwIfAborted();
				res.json({
					ok: true,
					targetId: context.tab.targetId,
					...result
				});
			}
		});
	};
	app.get("/cookies", async (req, res) => {
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId: resolveTargetIdFromQuery(req.query),
			feature: "cookies",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, signal }) => {
				const result = await pw.cookiesGetViaPlaywright({
					cdpUrl,
					targetId: tab.targetId
				});
				signal.throwIfAborted();
				res.json({
					ok: true,
					targetId: tab.targetId,
					...result
				});
			}
		});
	});
	app.post("/cookies/set", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const cookie = asNullableRecord(body.cookie);
		if (!cookie) return jsonError(res, 400, "cookie is required");
		let parsedCookie;
		try {
			parsedCookie = parseCookieSetOptions(cookie);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		await runMutation(req, res, targetId, "cookies set", async (pw, target) => {
			await pw.cookiesSetViaPlaywright({
				...target,
				cookie: parsedCookie
			});
		});
	});
	app.post("/cookies/set-many", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const rawCookies = body.cookies;
		if (!Array.isArray(rawCookies) || rawCookies.length === 0) return jsonError(res, 400, "cookies must be a non-empty array");
		const cookieRecords = [];
		for (const cookie of rawCookies) {
			if (!cookie || typeof cookie !== "object" || Array.isArray(cookie)) return jsonError(res, 400, "cookies must contain only cookie objects");
			cookieRecords.push(cookie);
		}
		let cookies;
		try {
			cookies = cookieRecords.map((cookie) => parseCookieSetOptions(cookie));
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		await runMutation(req, res, targetId, "cookies set-many", async (pw, target, signal) => {
			const { added } = await pw.cookiesSetManyViaPlaywright({
				...target,
				cookies,
				signal
			});
			return { added };
		});
	});
	app.post("/cookies/clear", async (req, res) => {
		const targetId = resolveTargetIdFromBody(readBody(req));
		await runMutation(req, res, targetId, "cookies clear", async (pw, target) => {
			await pw.cookiesClearViaPlaywright(target);
		});
	});
	app.get("/storage/:kind", async (req, res) => {
		const kind = parseStorageKind(toStringOrEmpty(req.params.kind));
		if (!kind) return jsonError(res, 400, "kind must be local|session");
		const targetId = resolveTargetIdFromQuery(req.query);
		const key = readNonBlankString(readStringValue(req.query.key) ?? toStringOrEmpty(req.query.key));
		await withPlaywrightRouteContext({
			req,
			res,
			ctx,
			targetId,
			feature: "storage get",
			enforceCurrentUrlAllowed: true,
			run: async ({ cdpUrl, tab, pw, signal }) => {
				const result = await pw.storageGetViaPlaywright({
					cdpUrl,
					targetId: tab.targetId,
					kind,
					key
				});
				signal.throwIfAborted();
				res.json({
					ok: true,
					targetId: tab.targetId,
					...result
				});
			}
		});
	});
	app.post("/storage/:kind/set", async (req, res) => {
		const mutation = parseStorageMutationFromRequest(req, res);
		if (!mutation) return;
		const key = readNonBlankString(readStringValue(mutation.body.key) ?? toStringOrEmpty(mutation.body.key));
		if (!key) return jsonError(res, 400, "key is required");
		const value = typeof mutation.body.value === "string" ? mutation.body.value : "";
		await runMutation(req, res, mutation.parsed.targetId, "storage set", async (pw, target) => {
			await pw.storageSetViaPlaywright({
				...target,
				kind: mutation.parsed.kind,
				key,
				value
			});
		});
	});
	app.post("/storage/:kind/clear", async (req, res) => {
		const mutation = parseStorageMutationFromRequest(req, res);
		if (!mutation) return;
		await runMutation(req, res, mutation.parsed.targetId, "storage clear", async (pw, target) => {
			await pw.storageClearViaPlaywright({
				...target,
				kind: mutation.parsed.kind
			});
		});
	});
	app.post("/set/offline", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const offline = toBoolean(body.offline);
		if (offline === void 0) return jsonError(res, 400, "offline is required");
		await runMutation(req, res, targetId, "offline", async (pw, target) => {
			await pw.setOfflineViaPlaywright({
				...target,
				offline
			});
		});
	});
	app.post("/set/headers", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const headers = body.headers && typeof body.headers === "object" && !Array.isArray(body.headers) ? body.headers : null;
		if (!headers) return jsonError(res, 400, "headers is required");
		const parsed = {};
		for (const [k, v] of Object.entries(headers)) if (typeof v === "string") parsed[k] = v;
		await runMutation(req, res, targetId, "headers", async (pw, target) => {
			await pw.setExtraHTTPHeadersViaPlaywright({
				...target,
				headers: parsed
			});
		});
	});
	app.post("/set/credentials", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const clear = toBoolean(body.clear) ?? false;
		const username = toStringOrEmpty(body.username) || void 0;
		const password = readStringValue(body.password);
		await runMutation(req, res, targetId, "http credentials", async (pw, target) => {
			await pw.setHttpCredentialsViaPlaywright({
				...target,
				username,
				password,
				clear
			});
		});
	});
	app.post("/set/geolocation", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		let geolocation;
		try {
			geolocation = parseGeolocationOptions(body);
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		await runMutation(req, res, targetId, "geolocation", async (pw, target) => {
			await pw.setGeolocationViaPlaywright({
				...target,
				...geolocation
			});
		});
	});
	app.post("/set/media", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const schemeRaw = toStringOrEmpty(body.colorScheme);
		const colorScheme = schemeRaw === "dark" || schemeRaw === "light" || schemeRaw === "no-preference" ? schemeRaw : schemeRaw === "none" ? null : void 0;
		if (colorScheme === void 0) return jsonError(res, 400, "colorScheme must be dark|light|no-preference|none");
		await runMutation(req, res, targetId, "media emulation", async (pw, target) => {
			await pw.emulateMediaViaPlaywright({
				...target,
				colorScheme
			});
		}, EXISTING_SESSION_LIMITS.emulation);
	});
	app.post("/set/timezone", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const timezoneId = toStringOrEmpty(body.timezoneId);
		if (!timezoneId) return jsonError(res, 400, "timezoneId is required");
		await runMutation(req, res, targetId, "timezone", async (pw, target) => {
			await pw.setTimezoneViaPlaywright({
				...target,
				timezoneId
			});
		}, EXISTING_SESSION_LIMITS.emulation);
	});
	app.post("/set/locale", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const locale = toStringOrEmpty(body.locale);
		if (!locale) return jsonError(res, 400, "locale is required");
		await runMutation(req, res, targetId, "locale", async (pw, target) => {
			await pw.setLocaleViaPlaywright({
				...target,
				locale
			});
		}, EXISTING_SESSION_LIMITS.emulation);
	});
	app.post("/set/device", async (req, res) => {
		const body = readBody(req);
		const targetId = resolveTargetIdFromBody(body);
		const name = toStringOrEmpty(body.name);
		if (!name) return jsonError(res, 400, "name is required");
		await runMutation(req, res, targetId, "device emulation", async (pw, target, signal) => {
			await pw.setDeviceViaPlaywright({
				...target,
				name,
				signal
			});
		}, EXISTING_SESSION_LIMITS.emulation);
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/agent.ts
/** Register all agent-facing browser route groups. */
function registerBrowserAgentRoutes(app, ctx) {
	registerBrowserAgentSnapshotRoutes(app, ctx);
	registerBrowserAgentScreencastRoutes(app, ctx);
	registerBrowserAgentActRoutes(app, ctx);
	registerBrowserAgentDebugRoutes(app, ctx);
	registerBrowserAgentStorageRoutes(app, ctx);
}
//#endregion
//#region extensions/browser/chrome-extension/manifest.json
var version = "2.3.0";
//#endregion
//#region extensions/browser/src/browser/doctor.ts
/**
* Browser doctor report builder.
*
* Turns BrowserStatus into profile-aware diagnostic checks and fix hints for
* CLI, tool, and HTTP doctor responses.
*/
function isChromeExtensionVersion(value) {
	if (typeof value !== "string") return false;
	const components = value.split(".");
	return components.length <= 4 && components.every((component) => /^(?:0|[1-9]\d{0,4})$/.test(component) && Number(component) <= 65535) && components.some((component) => component !== "0");
}
/** Build a browser doctor report from a status response and environment facts. */
function buildBrowserDoctorReport(params) {
	const status = params.status;
	const checks = [];
	const transport = status.transport === "chrome-mcp" ? "chrome-mcp" : status.transport === "extension" ? "extension" : "cdp";
	checks.push({
		id: "plugin-enabled",
		label: "Browser plugin",
		status: status.enabled ? "pass" : "fail",
		summary: status.enabled ? "enabled" : "disabled",
		...status.enabled ? {} : { fixHint: "Enable the browser plugin and restart the Gateway." }
	});
	checks.push({
		id: "profile",
		label: "Profile",
		status: "pass",
		summary: `${status.profile ?? "openclaw"} via ${transport}`
	});
	if (transport === "chrome-mcp") checks.push({
		id: "attach-target",
		label: "Existing browser attach",
		status: status.running ? "pass" : "fail",
		summary: status.running ? "Chrome MCP target is reachable" : "Chrome MCP target is not reachable",
		...status.running ? {} : { fixHint: "Keep the matching Chromium browser running, enable remote debugging in chrome://inspect, and accept the attach prompt." }
	});
	else if (transport === "extension") {
		checks.push({
			id: "extension-relay",
			label: "Chrome extension relay",
			status: status.running ? "pass" : "fail",
			summary: status.running ? "OpenClaw Chrome extension is connected" : "OpenClaw Chrome extension is not connected",
			...status.running ? {} : { fixHint: "Install the OpenClaw Chrome extension (openclaw browser extension path), run openclaw browser extension pair, and paste the pairing string into the extension popup." }
		});
		const runningVersion = isChromeExtensionVersion(params.extensionVersion) ? params.extensionVersion : void 0;
		const bundledVersion = isChromeExtensionVersion(version) ? version : void 0;
		const mismatch = Boolean(runningVersion && bundledVersion && runningVersion.replace(/(?:\.0)+$/, "") !== bundledVersion.replace(/(?:\.0)+$/, ""));
		checks.push({
			id: "extension-version",
			label: "Chrome extension version",
			status: !runningVersion || !bundledVersion ? "info" : mismatch ? "warn" : "pass",
			summary: runningVersion && bundledVersion ? `running ${runningVersion}; bundled ${bundledVersion} (${mismatch ? "mismatch" : "match"})` : "version data unavailable",
			...mismatch ? { fixHint: "Reload the OpenClaw extension from chrome://extensions. If the versions still differ, fully quit and reopen Chrome." } : {}
		});
	} else {
		checks.push({
			id: "managed-executable",
			label: "Chromium executable",
			status: status.detectError ? "fail" : status.detectedExecutablePath ? "pass" : "warn",
			summary: status.detectError ? status.detectError : status.detectedExecutablePath ? `${status.detectedBrowser ?? "chromium"} at ${status.detectedExecutablePath}` : "No Chromium executable detected",
			...status.detectedExecutablePath || status.detectError ? {} : { fixHint: "Install Chrome/Chromium/Brave/Edge or set browser.executablePath." }
		});
		const platform = params.platform ?? process.platform;
		const env = params.env ?? process.env;
		const uid = params.uid ?? process.getuid?.();
		const missingDisplay = platform === "linux" && !status.headless && !env.DISPLAY && !env.WAYLAND_DISPLAY;
		if (status.headlessSource === "linux-display-fallback") checks.push({
			id: "headless-mode",
			label: "Headless mode",
			status: "pass",
			summary: "Linux no-display fallback selected headless mode"
		});
		if (missingDisplay) checks.push({
			id: "display",
			label: "Display",
			status: "warn",
			summary: `No DISPLAY or WAYLAND_DISPLAY is set while headed mode is selected (${status.headlessSource ?? "unknown"})`,
			fixHint: "Use a desktop session, Xvfb, set OPENCLAW_BROWSER_HEADLESS=1, or remove the headed override."
		});
		if (platform === "linux" && uid === 0 && !status.noSandbox) checks.push({
			id: "linux-sandbox",
			label: "Linux sandbox",
			status: "warn",
			summary: "Gateway is running as root while browser.noSandbox is false",
			fixHint: "Set browser.noSandbox: true for container/root Chromium runtimes."
		});
		checks.push({
			id: "cdp-http",
			label: "CDP HTTP",
			status: status.cdpHttp ? "pass" : status.running ? "fail" : "info",
			summary: status.cdpHttp ? "CDP HTTP endpoint is reachable" : status.running ? "CDP HTTP endpoint is not reachable" : "Browser is not currently running",
			...status.cdpHttp || !status.running ? {} : { fixHint: "Run openclaw browser start or inspect browser.cdpUrl/CDP port reachability." }
		});
		checks.push({
			id: "cdp-websocket",
			label: "CDP WebSocket",
			status: status.cdpReady ? "pass" : status.running ? "fail" : "info",
			summary: status.cdpReady ? "CDP WebSocket is reachable" : status.running ? "CDP WebSocket is not reachable" : "Browser is launchable but not running",
			...status.cdpReady || !status.running ? {} : { fixHint: "Check Chrome launch logs, stale locks, proxy env, and port conflicts." }
		});
		if (status.graphics) {
			const graphicsStatus = status.graphics.status === "unavailable" ? "warn" : status.graphics.acceleration === "hardware" ? "pass" : "info";
			checks.push({
				id: "graphics",
				label: "Graphics",
				status: graphicsStatus,
				summary: formatBrowserGraphicsSummary(status.graphics)
			});
		}
	}
	return {
		ok: checks.every((check) => check.status !== "fail"),
		profile: status.profile ?? "openclaw",
		transport,
		checks,
		status
	};
}
//#endregion
//#region extensions/browser/src/browser/profiles-service.ts
/**
* Browser profile service.
*
* Implements profile listing, creation, and deletion using browser config
* mutation helpers and route context runtime state.
*/
const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
/** Create a profile service bound to one browser route context. */
function createBrowserProfilesService(ctx) {
	const listProfiles = async () => {
		return await ctx.listProfiles();
	};
	const createProfile = async (params) => {
		const name = params.name.trim();
		const rawCdpUrl = normalizeOptionalString(params.cdpUrl);
		const rawUserDataDir = normalizeOptionalString(params.userDataDir);
		const normalizedUserDataDir = rawUserDataDir ? resolveUserPath(rawUserDataDir) : void 0;
		const driver = params.driver === "existing-session" ? "existing-session" : void 0;
		if (!isValidProfileName(name)) throw new BrowserValidationError("invalid profile name: use lowercase letters, numbers, and hyphens only");
		const state = ctx.state();
		const resolvedProfiles = state.resolved.profiles;
		if (getOwnBrowserProfile(resolvedProfiles, name)) throw new BrowserConflictError(`profile "${name}" already exists`);
		const rawProfiles = getRuntimeConfig().browser?.profiles ?? {};
		if (getOwnBrowserProfile(rawProfiles, name)) throw new BrowserConflictError(`profile "${name}" already exists`);
		const explicitProfileColor = params.color && HEX_COLOR_RE.test(params.color) ? params.color : void 0;
		let parsedCdpUrl;
		if (normalizedUserDataDir && driver !== "existing-session") throw new BrowserValidationError("driver=existing-session is required when userDataDir is provided");
		if (normalizedUserDataDir && !fs.existsSync(normalizedUserDataDir)) throw new BrowserValidationError(`browser user data directory not found: ${normalizedUserDataDir}`);
		if (rawCdpUrl) {
			let parsed;
			try {
				parsed = parseBrowserHttpUrl(rawCdpUrl, "browser.profiles.cdpUrl");
				await assertCdpEndpointAllowed(parsed.normalized, state.resolved.ssrfPolicy);
			} catch (err) {
				throw new BrowserValidationError(formatErrorMessage(err));
			}
			parsedCdpUrl = parsed.normalized;
		}
		const profileConfig = await createBrowserProfileConfig({
			name,
			resolved: state.resolved,
			...explicitProfileColor ? { color: explicitProfileColor } : {},
			...parsedCdpUrl ? { parsedCdpUrl } : {},
			...normalizedUserDataDir ? { userDataDir: normalizedUserDataDir } : {},
			...driver ? { driver } : {}
		});
		if (!profileConfig) throw new BrowserProfileNotFoundError(`profile "${name}" not found after creation`);
		state.resolved.profiles[name] = profileConfig;
		const resolved = resolveProfile(state.resolved, name);
		if (!resolved) throw new BrowserProfileNotFoundError(`profile "${name}" not found after creation`);
		const capabilities = getBrowserProfileCapabilities(resolved);
		return {
			ok: true,
			profile: name,
			transport: capabilities.usesChromeMcp ? "chrome-mcp" : "cdp",
			cdpPort: capabilities.usesChromeMcp ? null : resolved.cdpPort,
			cdpUrl: resolved.cdpUrl ? redactCdpUrl(resolved.cdpUrl) ?? null : null,
			userDataDir: resolved.userDataDir ?? null,
			color: resolved.color,
			isRemote: !resolved.cdpIsLoopback
		};
	};
	const listSystemProfiles$1 = async (browser) => {
		if (process.platform !== "darwin") return [];
		return listSystemProfiles(browser);
	};
	const importSystemProfile = async (params, options) => {
		const state = ctx.state();
		return await importSystemProfileCookies(params, {
			ctx,
			createProfile,
			signal: options?.signal,
			finalize: async (result) => {
				if (result.cookies.imported === 0) {
					if (params.makeDefault) throw new BrowserValidationError("no cookies could be imported from the selected profile");
					return;
				}
				if (params.makeDefault) {
					await setDefaultBrowserProfile(result.into);
					state.resolved.defaultProfile = result.into;
				}
				await recordSystemProfileImport({
					browser: result.browser,
					systemProfile: result.systemProfile,
					targetProfile: result.into
				});
			}
		});
	};
	const getSystemProfileImportStatus = async () => {
		const enabled = process.platform === "darwin" && getRuntimeConfig().browser?.allowSystemProfileImport !== false;
		const [systemProfiles, state, profiles] = await Promise.all([
			enabled ? listSystemProfiles$1() : Promise.resolve([]),
			readSystemProfileImportState(),
			listProfiles()
		]);
		return {
			enabled,
			systemProfiles,
			state: state ?? null,
			suggestedTarget: resolveSuggestedImportTarget({
				profileNames: profiles.map((profile) => profile.name),
				state
			})
		};
	};
	const deleteProfile = async (nameRaw) => {
		const name = nameRaw.trim();
		if (!name) throw new BrowserValidationError("profile name is required");
		if (!isValidProfileName(name)) throw new BrowserValidationError("invalid profile name");
		const state = ctx.state();
		const cfg = getRuntimeConfig();
		const profiles = cfg.browser?.profiles ?? {};
		if (name === (cfg.browser?.defaultProfile ?? state.resolved.defaultProfile)) throw new BrowserValidationError(`cannot delete the default profile "${name}"; change browser.defaultProfile first`);
		const runtimeProfile = getOwnBrowserProfile(profiles, name);
		if (!runtimeProfile) throw new BrowserProfileNotFoundError(`profile "${name}" not found`);
		const sourceProfile = getOwnBrowserProfile(getRuntimeConfigSourceSnapshot()?.browser?.profiles, name);
		const expected = structuredClone(sourceProfile ?? runtimeProfile);
		let deleted = false;
		const resolved = resolveProfile(resolveBrowserConfig(cfg.browser, cfg), name) ?? state.profiles.get(name)?.profile;
		const runtime = resolved ? getOrCreateProfileRuntime(state, resolved) : void 0;
		const persistDelete = async () => {
			await deleteBrowserProfileConfig({
				name,
				expected
			});
			delete state.resolved.profiles[name];
			try {
				if (resolved?.cdpIsLoopback && resolved.driver === "openclaw" && !resolved.attachOnly) {
					const userDataDir = resolveOpenClawUserDataDir(name);
					const profileDir = path.dirname(userDataDir);
					if (fs.existsSync(profileDir)) try {
						await movePathToTrash(profileDir);
						deleted = true;
					} catch {}
				}
			} finally {
				if (!runtime || state.profiles.get(name) === runtime) state.profiles.delete(name);
			}
		};
		if (resolved && runtime) await beginProfileTransition({
			state,
			runtime,
			reason: "profile deletion requested",
			terminal: "deleted",
			advanceConfigRevision: true,
			closeRelay: resolved.driver === "extension",
			managedChrome: "release-profile-data",
			afterCleanup: persistDelete,
			rollbackTerminalOnFailure: true
		});
		else await persistDelete();
		return {
			ok: true,
			profile: name,
			deleted
		};
	};
	return {
		listProfiles,
		listSystemProfiles: listSystemProfiles$1,
		createProfile,
		importSystemProfile,
		getSystemProfileImportStatus,
		deleteProfile
	};
}
//#endregion
//#region extensions/browser/src/browser/routes/basic.ts
/**
* Basic browser control routes.
*
* Serves status, doctor, start/stop, profile management, and simple health
* endpoints for the browser control server.
*/
const STATUS_CDP_HTTP_TIMEOUT_MS = 300;
const STATUS_CDP_TRANSPORT_TIMEOUT_MS = 600;
const STATUS_GRAPHICS_COMMAND_TIMEOUT_MS = 1e3;
const STATUS_CHROME_MCP_TOTAL_TIMEOUT_MS = 7e3;
const STATUS_CHROME_MCP_TRANSPORT_TIMEOUT_MS = 5e3;
function remainingChromeMcpStatusTimeoutMs(startedAtMs) {
	return Math.max(1, STATUS_CHROME_MCP_TOTAL_TIMEOUT_MS - (Date.now() - startedAtMs));
}
function handleBrowserRouteError(res, err) {
	if (isProfileRestartRequiredError(err)) throw err;
	const mapped = toBrowserErrorResponse(err);
	if (mapped) return jsonBrowserError(res, mapped);
	jsonError(res, 500, String(err));
}
async function sendBasicJsonResponse(params) {
	try {
		params.res.json(await params.run());
	} catch (err) {
		return handleBrowserRouteError(params.res, err);
	}
}
async function withBasicProfileRoute(params) {
	const profileCtx = resolveProfileContext(params.req, params.res, params.ctx);
	if (!profileCtx) return;
	try {
		await withBasicRequestAdmission(params.req, () => params.run(profileCtx), profileCtx.profile);
	} catch (err) {
		return handleBrowserRouteError(params.res, err);
	}
}
async function withBasicRequestAdmission(req, run, profile) {
	const assertRequesterCurrent = () => {
		req.signal?.throwIfAborted();
		req.requester?.signal.throwIfAborted();
		if (req.requester?.isCurrent() === false) throw new BrowserError("The Gateway connection that requested the browser operation has ended.", 401);
	};
	assertRequesterCurrent();
	await req.assertCurrent?.(profile);
	assertRequesterCurrent();
	return await run();
}
function registerBasicProfilePost(app, ctx, path, run) {
	app.post(path, async (req, res) => {
		await withBasicProfileRoute({
			req,
			res,
			ctx,
			run: async (profileCtx) => await run({
				req,
				res,
				profileCtx
			})
		});
	});
}
async function withProfilesServiceMutation(params) {
	try {
		const result = await withBasicRequestAdmission(params.req, () => params.run(createBrowserProfilesService(params.ctx)));
		params.res.json(result);
	} catch (err) {
		return handleBrowserRouteError(params.res, err);
	}
}
async function buildBrowserStatus(ctx, profileCtx, signal) {
	signal.throwIfAborted();
	let current;
	try {
		current = ctx.state();
	} catch {
		throw new BrowserError("browser server not started", 503);
	}
	const capabilities = getBrowserProfileCapabilities(profileCtx.profile);
	const [cdpHttp, cdpReady, pageReady] = capabilities.usesChromeMcp ? await (async () => {
		const statusStartedAtMs = Date.now();
		let pageReachable = false;
		const transportReady = await profileCtx.isTransportAvailable(STATUS_CHROME_MCP_TRANSPORT_TIMEOUT_MS, signal, {
			timeoutMs: () => remainingChromeMcpStatusTimeoutMs(statusStartedAtMs),
			onResult: (tabCount) => pageReachable = tabCount !== null
		});
		return [
			transportReady,
			transportReady,
			pageReachable
		];
	})() : await (async () => {
		const [http, ready] = await Promise.all([profileCtx.isHttpReachable(STATUS_CDP_HTTP_TIMEOUT_MS, signal), profileCtx.isTransportAvailable(STATUS_CDP_TRANSPORT_TIMEOUT_MS, signal)]);
		return [
			http,
			ready,
			ready
		];
	})();
	const profileState = current.profiles.get(profileCtx.profile.name);
	const lifecycle = profileState ? getProfileLifecycle(profileState) : null;
	const running = profileState?.running;
	const graphics = capabilities.mode === "local-managed" && cdpReady && running && !lifecycle?.transitionReason && !lifecycle?.blockedReason && running.cdpPort === profileCtx.profile.cdpPort ? await getCachedChromeGraphicsDiagnostics(running, async () => await inspectChromeGraphicsDiagnostics(`http://127.0.0.1:${running.cdpPort}`, {
		httpTimeoutMs: STATUS_CDP_HTTP_TIMEOUT_MS,
		handshakeTimeoutMs: STATUS_CDP_TRANSPORT_TIMEOUT_MS,
		commandTimeoutMs: STATUS_GRAPHICS_COMMAND_TIMEOUT_MS,
		ssrfPolicy: current.resolved.ssrfPolicy
	})) : null;
	let detected = null;
	let detectError = null;
	try {
		detected = resolveBrowserExecutableForPlatform(capabilities.mode === "local-managed" && capabilities.browserFilesystemLocal ? {
			...current.resolved,
			executablePath: profileCtx.profile.executablePath
		} : current.resolved, process.platform);
	} catch (err) {
		detectError = String(err);
	}
	const configuredHeadlessMode = resolveManagedBrowserHeadlessMode(current.resolved, profileCtx.profile);
	const headlessMode = typeof profileState?.running?.headless === "boolean" ? {
		headless: profileState.running.headless,
		source: profileState.running.headlessSource ?? configuredHeadlessMode.source
	} : configuredHeadlessMode;
	signal.throwIfAborted();
	return {
		enabled: current.resolved.enabled,
		profile: profileCtx.profile.name,
		driver: profileCtx.profile.driver,
		transport: capabilities.usesChromeMcp ? "chrome-mcp" : capabilities.mode === "local-extension" ? "extension" : "cdp",
		running: cdpReady,
		cdpReady,
		cdpHttp,
		pageReady,
		pid: capabilities.usesChromeMcp ? getChromeMcpPid(profileCtx.profile.name) : profileState?.running?.pid ?? null,
		cdpPort: capabilities.usesChromeMcp ? null : profileCtx.profile.cdpPort,
		cdpUrl: profileCtx.profile.cdpUrl ? redactCdpUrl(profileCtx.profile.cdpUrl) ?? null : null,
		chosenBrowser: profileState?.running?.exe.kind ?? null,
		detectedBrowser: detected?.kind ?? null,
		detectedExecutablePath: detected?.path ?? null,
		detectError,
		userDataDir: profileState?.running?.userDataDir ?? profileCtx.profile.userDataDir ?? null,
		color: profileCtx.profile.color,
		headless: headlessMode.headless,
		headlessSource: headlessMode.source,
		noSandbox: current.resolved.noSandbox,
		executablePath: profileCtx.profile.executablePath ?? null,
		attachOnly: profileCtx.profile.attachOnly,
		graphics
	};
}
async function runBrowserLiveProbe(profileCtx, signal) {
	const capabilities = getBrowserProfileCapabilities(profileCtx.profile);
	try {
		const tab = await profileCtx.ensureTabAvailable(void 0, { signal });
		if (capabilities.usesChromeMcp) {
			await takeChromeMcpSnapshot({
				profileName: profileCtx.profile.name,
				profile: profileCtx.profile,
				targetId: tab.targetId,
				signal
			});
			return {
				id: "live-snapshot",
				label: "Live snapshot",
				status: "pass",
				summary: `Chrome MCP snapshot succeeded on ${tab.suggestedTargetId ?? tab.targetId}`
			};
		}
		if (!tab.wsUrl) return {
			id: "live-snapshot",
			label: "Live snapshot",
			status: "warn",
			summary: "No per-tab CDP WebSocket available for the lightweight live snapshot probe"
		};
		const snap = await snapshotAria({
			wsUrl: tab.wsUrl,
			...tab.wsLookup ? { lookup: tab.wsLookup } : {},
			limit: 25
		});
		return {
			id: "live-snapshot",
			label: "Live snapshot",
			status: snap.nodes.length > 0 ? "pass" : "warn",
			summary: snap.nodes.length > 0 ? `CDP accessibility snapshot returned ${snap.nodes.length} nodes on ${tab.suggestedTargetId ?? tab.targetId}` : `CDP accessibility snapshot returned no nodes on ${tab.suggestedTargetId ?? tab.targetId}`
		};
	} catch (err) {
		if (isProfileRestartRequiredError(err)) throw err;
		return {
			id: "live-snapshot",
			label: "Live snapshot",
			status: "fail",
			summary: String(err),
			fixHint: "Run openclaw browser start, then retry with openclaw browser doctor --deep."
		};
	}
}
function hasQueryKey(query, key) {
	return Object.hasOwn(query ?? {}, key);
}
function parseHeadlessStartOverride(params) {
	if (!hasQueryKey(params.req.query, "headless")) return { ok: true };
	const headless = toBoolean(params.req.query.headless);
	if (typeof headless !== "boolean") {
		jsonError(params.res, 400, "Invalid headless value. Use \"true\" or \"false\".");
		return { ok: false };
	}
	const capabilities = getBrowserProfileCapabilities(params.profileCtx.profile);
	if (params.profileCtx.profile.driver !== "openclaw" || params.profileCtx.profile.attachOnly || capabilities.isRemote) {
		jsonError(params.res, 400, `Headless start override is only supported for locally launched openclaw profiles. Profile "${params.profileCtx.profile.name}" is attach-only, remote, or existing-session.`);
		return { ok: false };
	}
	return {
		ok: true,
		headless
	};
}
/** Register basic browser lifecycle, status, doctor, and profile endpoints. */
function registerBrowserBasicRoutes(app, ctx) {
	app.get("/system-profiles", async (req, res) => {
		await sendBasicJsonResponse({
			res,
			run: async () => {
				return { systemProfiles: await createBrowserProfilesService(ctx).listSystemProfiles(toStringOrEmpty(req.query.browser) || void 0) };
			}
		});
	});
	app.get("/system-profile-import/status", async (_req, res) => {
		await sendBasicJsonResponse({
			res,
			run: async () => await createBrowserProfilesService(ctx).getSystemProfileImportStatus()
		});
	});
	app.post("/system-profile-import/dismiss", async (_req, res) => {
		await sendBasicJsonResponse({
			res,
			run: async () => {
				await dismissSystemProfileImportPrompt();
				return { ok: true };
			}
		});
	});
	app.get("/profiles", async (_req, res) => {
		try {
			const profiles = await createBrowserProfilesService(ctx).listProfiles();
			res.json({ profiles });
		} catch (err) {
			return handleBrowserRouteError(res, err);
		}
	});
	app.get("/", async (req, res) => {
		const profileCtx = resolveProfileContext(req, res, ctx);
		if (!profileCtx) return;
		try {
			const status = await runProfileRouteOperation({
				profileCtx,
				signal: req.signal,
				assertCurrent: req.assertCurrent,
				run: async (signal) => await buildBrowserStatus(ctx, profileCtx, signal)
			});
			res.json(status);
		} catch (err) {
			return handleBrowserRouteError(res, err);
		}
	});
	app.get("/doctor", async (req, res) => {
		const profileCtx = resolveProfileContext(req, res, ctx);
		if (!profileCtx) return;
		try {
			const report = await runProfileRouteOperation({
				profileCtx,
				signal: req.signal,
				assertCurrent: req.assertCurrent,
				run: async (signal) => {
					const status = await buildBrowserStatus(ctx, profileCtx, signal);
					const relay = ctx.state().extensionRelays?.get(profileCtx.profile.name);
					const identity = relay?.ownership === "borrowed" ? (await relay.client.status()).identity : relay?.bridge.identity;
					const doctorReport = buildBrowserDoctorReport({
						status,
						extensionVersion: status.transport === "extension" ? identity?.extensionVersion : void 0
					});
					if (toBoolean(req.query.deep) === true || toBoolean(req.query.live) === true) {
						doctorReport.checks.push(await runBrowserLiveProbe(profileCtx, signal));
						doctorReport.ok = doctorReport.checks.every((check) => check.status !== "fail");
					}
					return doctorReport;
				}
			});
			res.json(report);
		} catch (err) {
			return handleBrowserRouteError(res, err);
		}
	});
	registerBasicProfilePost(app, ctx, "/start", async ({ req, res, profileCtx }) => {
		const headlessOverride = parseHeadlessStartOverride({
			req,
			res,
			profileCtx
		});
		if (!headlessOverride.ok) return;
		await profileCtx.ensureBrowserAvailable({
			headless: headlessOverride.headless,
			...req.signal ? { signal: req.signal } : {}
		});
		res.json({
			ok: true,
			profile: profileCtx.profile.name
		});
	});
	registerBasicProfilePost(app, ctx, "/stop", async ({ res, profileCtx }) => {
		const result = await profileCtx.stopRunningBrowser();
		res.json({
			ok: true,
			stopped: result.stopped,
			profile: profileCtx.profile.name
		});
	});
	registerBasicProfilePost(app, ctx, "/reset-profile", async ({ res, profileCtx }) => {
		const result = await profileCtx.resetProfile();
		res.json({
			ok: true,
			profile: profileCtx.profile.name,
			...result
		});
	});
	app.post("/profiles/create", async (req, res) => {
		const name = toStringOrEmpty(req.body?.name);
		const color = toStringOrEmpty(req.body?.color);
		const cdpUrl = toStringOrEmpty(req.body?.cdpUrl);
		const userDataDir = toStringOrEmpty(req.body?.userDataDir);
		const driver = toStringOrEmpty(req.body?.driver);
		if (!name) return jsonError(res, 400, "name is required");
		if (driver && driver !== "openclaw" && driver !== "clawd" && driver !== "existing-session") return jsonError(res, 400, `unsupported profile driver "${driver}"; use "openclaw", "clawd", or "existing-session"`);
		await withProfilesServiceMutation({
			req,
			res,
			ctx,
			run: async (service) => await service.createProfile({
				name,
				color: color || void 0,
				cdpUrl: cdpUrl || void 0,
				userDataDir: userDataDir || void 0,
				driver: driver === "existing-session" ? "existing-session" : driver === "openclaw" || driver === "clawd" ? "openclaw" : void 0
			})
		});
	});
	app.post("/profiles/import", async (req, res) => {
		const body = req.body ?? {};
		let domains;
		try {
			domains = parseSystemProfileDomains(body.domains);
		} catch (err) {
			return jsonError(res, 400, err instanceof Error ? err.message : "invalid domains");
		}
		await withProfilesServiceMutation({
			req,
			res,
			ctx,
			run: async (service) => await service.importSystemProfile({
				browser: toStringOrEmpty(body.browser) || void 0,
				systemProfile: toStringOrEmpty(body.systemProfile) || void 0,
				into: toStringOrEmpty(body.into) || void 0,
				domains,
				makeDefault: toBoolean(body.makeDefault) ?? false
			}, { signal: req.signal })
		});
	});
	app.delete("/profiles/:name", async (req, res) => {
		const name = toStringOrEmpty(req.params.name);
		if (!name) return jsonError(res, 400, "profile name is required");
		await withProfilesServiceMutation({
			req,
			res,
			ctx,
			run: async (service) => await service.deleteProfile(name)
		});
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/permissions.ts
/**
* Browser permission routes.
*
* Grants required and optional browser permissions for an origin, preferring
* Playwright context APIs when available and falling back to raw CDP.
*/
function readPermissions(raw) {
	if (!Array.isArray(raw)) return null;
	const permissions = raw.map((value) => typeof value === "string" ? value.trim() : "").filter(Boolean);
	if (permissions.length !== raw.length) return null;
	return uniqueStrings(permissions);
}
async function grantPermissions(params) {
	params.signal.throwIfAborted();
	const allPermissions = [.../* @__PURE__ */ new Set([...params.requiredPermissions, ...params.optionalPermissions])];
	const playwrightRequiredPermissions = params.requiredPermissions.map(toPlaywrightPermission);
	if (playwrightRequiredPermissions.every((value) => Boolean(value)) && params.requiredPermissions.length > 0) {
		const pw = await getPwAiModule$1({ mode: "soft" });
		if (pw) try {
			const page = await pw.getPageForTargetId({
				cdpUrl: params.profileCtx.profile.cdpUrl,
				targetId: params.targetId,
				ssrfPolicy: params.ssrfPolicy
			});
			if (params.assertCurrent) {
				await assertInteractionCurrent(params);
				params.signal.throwIfAborted();
			}
			await page.context().grantPermissions(playwrightRequiredPermissions, { origin: params.origin });
			return {
				grantedPermissions: params.requiredPermissions,
				unsupportedPermissions: params.optionalPermissions,
				grantMethod: "playwright"
			};
		} catch (error) {
			if (error instanceof BrowserInteractionAuthorityError) throw error;
			params.signal.throwIfAborted();
		}
	}
	params.signal.throwIfAborted();
	let unsupportedPermissions = [];
	await withCdpSocket(params.wsUrl, async (send) => {
		if (params.assertCurrent) {
			await assertInteractionCurrent(params);
			params.signal.throwIfAborted();
		}
		try {
			await send("Browser.grantPermissions", {
				origin: params.origin,
				permissions: allPermissions
			});
			return;
		} catch (error) {
			if (params.optionalPermissions.length === 0) throw error;
		}
		if (params.assertCurrent) {
			await assertInteractionCurrent(params);
			params.signal.throwIfAborted();
		}
		await send("Browser.grantPermissions", {
			origin: params.origin,
			permissions: params.requiredPermissions
		});
		unsupportedPermissions = params.optionalPermissions;
	}, {
		commandTimeoutMs: params.timeoutMs,
		lookup: params.wsLookup,
		signal: params.signal
	});
	params.signal.throwIfAborted();
	return {
		grantedPermissions: allPermissions.filter((value) => !unsupportedPermissions.includes(value)),
		unsupportedPermissions,
		grantMethod: "cdp"
	};
}
function toPlaywrightPermission(permission) {
	switch (permission) {
		case "audioCapture": return "microphone";
		case "videoCapture": return "camera";
		default: return;
	}
}
/** Register permission grant endpoints on the browser control server. */
function registerBrowserPermissionRoutes(app, ctx) {
	app.post("/permissions/grant", async (req, res) => {
		const body = req.body ?? {};
		const origin = readHttpOrigin(body.origin);
		if (!origin) return jsonError(res, 400, "origin must be an http(s) origin");
		const requiredPermissions = readPermissions(body.permissions);
		if (!requiredPermissions || requiredPermissions.length === 0) return jsonError(res, 400, "permissions must be a non-empty string array");
		const optionalPermissions = readPermissions(body.optionalPermissions ?? []) ?? [];
		const targetId = toStringOrEmpty(body.targetId) || void 0;
		let timeoutMs;
		try {
			timeoutMs = readRouteTimerTimeoutMs(body.timeoutMs, "timeoutMs", { minMs: 1e3 }) ?? 5e3;
		} catch (err) {
			return jsonError(res, 400, formatErrorMessage(err));
		}
		const profileCtx = getProfileContext(req, ctx);
		if ("error" in profileCtx) return jsonError(res, profileCtx.status, profileCtx.error);
		const requestAssertCurrent = req.assertCurrent;
		const assertCurrent = requestAssertCurrent ? () => requestAssertCurrent(profileCtx.profile) : void 0;
		try {
			const granted = await runProfileRouteOperation({
				profileCtx,
				signal: req.signal,
				assertCurrent: req.assertCurrent,
				run: async (signal) => {
					await profileCtx.ensureBrowserAvailable({ signal });
					const cdpPolicy = resolveCdpControlPolicy(profileCtx.profile, ctx.state().resolved.ssrfPolicy);
					const endpoint = await getChromeWebSocketEndpoint(profileCtx.profile.cdpUrl, timeoutMs, cdpPolicy);
					signal.throwIfAborted();
					if (!endpoint) throw new BrowserProfileUnavailableError("browser CDP WebSocket unavailable");
					return await grantPermissions({
						profileCtx,
						targetId,
						wsUrl: endpoint.url,
						wsLookup: endpoint.lookup,
						origin,
						requiredPermissions,
						optionalPermissions,
						timeoutMs,
						ssrfPolicy: cdpPolicy,
						signal,
						...assertCurrent ? { assertCurrent } : {}
					});
				}
			});
			return res.json({
				ok: true,
				origin,
				...granted
			});
		} catch (error) {
			if (isProfileRestartRequiredError(error)) throw error;
			const mapped = toBrowserErrorResponse(error);
			if (mapped) return jsonBrowserError(res, mapped);
			return jsonError(res, 500, error instanceof Error ? error.message : String(error));
		}
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/tabs.ts
/**
* Browser tab management routes.
*
* Lists, opens, focuses, closes, and mutates tabs while applying navigation
* policy checks and profile reachability probes.
*/
const DEFAULT_TAB_REACHABILITY_TIMEOUT_MS = 300;
const TAB_REACHABILITY_RETRY_DELAY_MS = 250;
function handleTabsRouteError(ctx, res, err, opts) {
	if (isProfileRestartRequiredError(err)) throw err;
	if (opts?.mapTabError) {
		const mapped = ctx.mapTabError(err);
		if (mapped) return jsonBrowserError(res, mapped);
	}
	return jsonError(res, 500, String(err));
}
async function runTabsProfileRoute(params) {
	const profileCtx = resolveProfileContext(params.req, params.res, params.ctx);
	if (!profileCtx) return;
	try {
		return await runProfileRouteOperation({
			profileCtx,
			signal: params.req.signal,
			assertCurrent: params.req.assertCurrent,
			run: async (signal) => await params.run(profileCtx, signal)
		});
	} catch (err) {
		handleTabsRouteError(params.ctx, params.res, err, { mapTabError: params.mapTabError });
		return;
	}
}
function resolveTabReachabilityTimeoutMs(ctx, profileCtx) {
	if (!getBrowserProfileCapabilities(profileCtx.profile).usesChromeMcp) return DEFAULT_TAB_REACHABILITY_TIMEOUT_MS;
	return clampPositiveTimerTimeoutMs(ctx.state().resolved.actionTimeoutMs) ?? DEFAULT_TAB_REACHABILITY_TIMEOUT_MS;
}
async function checkTabReachability(ctx, profileCtx, signal) {
	const timeoutMs = resolveTabReachabilityTimeoutMs(ctx, profileCtx);
	return signal ? await profileCtx.isReachable(timeoutMs, { signal }) : await profileCtx.isReachable(timeoutMs);
}
async function ensureBrowserRunning(ctx, profileCtx, signal) {
	let isReachable = await checkTabReachability(ctx, profileCtx, signal);
	if (!isReachable && !signal?.aborted) {
		await new Promise((resolve) => {
			setTimeout(resolve, TAB_REACHABILITY_RETRY_DELAY_MS);
		});
		signal?.throwIfAborted();
		isReachable = await checkTabReachability(ctx, profileCtx, signal);
	}
	if (!isReachable) throw new BrowserProfileUnavailableError("browser not running");
}
async function redactBlockedTabUrls(params) {
	if (!params.navigationPolicy.ssrfPolicy) return params.tabs;
	const redactedTabs = [];
	for (const tab of params.tabs) try {
		await assertBrowserNavigationResultAllowed({
			url: tab.url,
			...params.navigationPolicy
		});
		redactedTabs.push(tab);
	} catch (error) {
		const failure = toBrowserErrorResponse(error);
		redactedTabs.push({
			...tab,
			url: "",
			urlUnavailableReason: failure && "reason" in failure && failure.reason === "navigation_blocked" ? "navigation_blocked" : "navigation_check_failed"
		});
	}
	return redactedTabs;
}
function resolveIndexedTab(tabs, index) {
	return typeof index === "number" ? tabs[index] : tabs.at(0);
}
function parseRequiredTargetId(res, rawTargetId) {
	const targetId = toStringOrEmpty(rawTargetId);
	if (!targetId) {
		jsonError(res, 400, "targetId is required");
		return null;
	}
	return targetId;
}
function readOptionalTabLabel(body) {
	return toStringOrEmpty(body?.label) || void 0;
}
function readTabIndex(res, body, opts) {
	const record = body && typeof body === "object" ? body : {};
	if (!Object.hasOwn(record, "index")) {
		if (opts?.required) {
			jsonError(res, 400, "index is required");
			return null;
		}
		return;
	}
	if (record.index == null) {
		jsonError(res, 400, "index must be a non-negative integer");
		return null;
	}
	try {
		return readRouteNonNegativeInteger(record.index, "index", { invalidMessage: "index must be a non-negative integer" });
	} catch (error) {
		jsonError(res, 400, error instanceof Error ? error.message : String(error));
		return null;
	}
}
async function runTabTargetMutation(params) {
	const result = await runTabsProfileRoute({
		req: params.req,
		res: params.res,
		ctx: params.ctx,
		mapTabError: true,
		run: async (profileCtx, signal) => {
			await ensureBrowserRunning(params.ctx, profileCtx, signal);
			const canonicalTargetId = await params.mutate(profileCtx, params.targetId, signal);
			return {
				ok: true,
				...canonicalTargetId ? { targetId: canonicalTargetId } : {}
			};
		}
	});
	if (result) params.res.json(result);
}
/** Register tab listing and mutation endpoints on the browser control server. */
function registerBrowserTabRoutes(app, ctx) {
	app.get("/tabs", async (req, res) => {
		const result = await runTabsProfileRoute({
			req,
			res,
			ctx,
			run: async (profileCtx, signal) => {
				if (!await checkTabReachability(ctx, profileCtx, signal)) return {
					running: false,
					tabs: []
				};
				const tabs = await redactBlockedTabUrls({
					tabs: await profileCtx.listTabs({ signal }),
					navigationPolicy: browserNavigationPolicyForProfile(ctx, profileCtx)
				});
				signal.throwIfAborted();
				return {
					running: true,
					tabs
				};
			}
		});
		if (result) res.json(result);
	});
	app.post("/tabs/open", async (req, res) => {
		const url = toStringOrEmpty(req.body?.url);
		const label = readOptionalTabLabel(req.body);
		if (!url) return jsonError(res, 400, "url is required");
		const result = await runTabsProfileRoute({
			req,
			res,
			ctx,
			mapTabError: true,
			run: async (profileCtx, signal) => {
				await assertBrowserNavigationAllowed({
					url,
					...browserNavigationPolicyForProfile(ctx, profileCtx)
				});
				await profileCtx.ensureBrowserAvailable({ signal });
				await req.assertCurrent?.(profileCtx.profile);
				return {
					...await profileCtx.openTab(url, {
						label,
						signal,
						...isManagedOnlyBrowserRequest(req) ? { requireDurableOwnership: true } : {}
					}),
					resolvedProfile: profileCtx.profile.name
				};
			}
		});
		if (result) res.json(result);
	});
	app.post("/tabs/focus", async (req, res) => {
		const targetId = parseRequiredTargetId(res, req.body?.targetId);
		if (!targetId) return;
		await runTabTargetMutation({
			req,
			res,
			ctx,
			targetId,
			mutate: async (profileCtx, id, signal) => {
				const tabs = await profileCtx.listTabs({ signal });
				const resolved = resolveTargetIdFromTabs(id, tabs);
				if (!resolved.ok) {
					if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
					throw new BrowserTabNotFoundError({ input: id });
				}
				const tab = tabs.find((currentTab) => currentTab.targetId === resolved.targetId);
				if (!tab) throw new BrowserTabNotFoundError({ input: id });
				const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
				if (ssrfPolicyOpts.ssrfPolicy) await assertBrowserNavigationResultAllowed({
					url: tab.url,
					...ssrfPolicyOpts
				});
				signal.throwIfAborted();
				const requestAssertCurrent = req.assertCurrent;
				await profileCtx.focusTab(resolved.targetId, {
					exactTargetId: true,
					signal,
					...requestAssertCurrent ? { assertCurrent: () => requestAssertCurrent(profileCtx.profile) } : {}
				});
				return resolved.targetId;
			}
		});
	});
	app.delete("/tabs/:targetId", async (req, res) => {
		const targetId = parseRequiredTargetId(res, req.params.targetId);
		if (!targetId) return;
		const targetIdMode = toStringOrEmpty(req.query.targetIdMode);
		if (targetIdMode && targetIdMode !== "raw") return jsonError(res, 400, "targetIdMode must be \"raw\"");
		await runTabTargetMutation({
			req,
			res,
			ctx,
			targetId,
			mutate: async (profileCtx, id, signal) => {
				signal.throwIfAborted();
				const canonicalTargetId = await profileCtx.closeTab(id, {
					...targetIdMode === "raw" ? { exactTargetId: true } : {},
					signal
				});
				clearSnapshotKeysForTab(ctx, profileCtx.profile.name, canonicalTargetId);
				return canonicalTargetId;
			}
		});
	});
	app.post("/tabs/action", async (req, res) => {
		const action = toStringOrEmpty(req.body?.action);
		if (action !== "list" && action !== "new" && action !== "label" && action !== "close" && action !== "select") return jsonError(res, 400, "unknown tab action");
		const targetId = action === "label" ? parseRequiredTargetId(res, req.body?.targetId) : void 0;
		if (action === "label" && !targetId) return;
		const label = action === "label" || action === "new" ? readOptionalTabLabel(req.body) : void 0;
		if (action === "label" && !label) return jsonError(res, 400, "label is required");
		const index = action === "close" ? readTabIndex(res, req.body) : action === "select" ? readTabIndex(res, req.body, { required: true }) : void 0;
		if (action === "close" && index === null || action === "select" && index == null) return;
		const result = await runTabsProfileRoute({
			req,
			res,
			ctx,
			mapTabError: true,
			run: async (profileCtx, signal) => {
				if (action === "list") {
					if (!await checkTabReachability(ctx, profileCtx, signal)) return {
						ok: true,
						tabs: []
					};
					const tabs = await redactBlockedTabUrls({
						tabs: await profileCtx.listTabs({ signal }),
						navigationPolicy: browserNavigationPolicyForProfile(ctx, profileCtx)
					});
					signal.throwIfAborted();
					return {
						ok: true,
						tabs
					};
				}
				if (action === "new") {
					await profileCtx.ensureBrowserAvailable({ signal });
					return {
						ok: true,
						tab: await profileCtx.openTab("about:blank", {
							label,
							signal
						})
					};
				}
				if (action === "label") {
					await ensureBrowserRunning(ctx, profileCtx, signal);
					return {
						ok: true,
						tab: await profileCtx.labelTab(targetId, label)
					};
				}
				if (action === "close") {
					await ensureBrowserRunning(ctx, profileCtx, signal);
					const target = resolveIndexedTab(await profileCtx.listTabs({ signal }), index);
					if (!target) throw new BrowserTabNotFoundError();
					signal.throwIfAborted();
					await profileCtx.closeTab(target.targetId, {
						exactTargetId: true,
						signal
					});
					clearSnapshotKeysForTab(ctx, profileCtx.profile.name, target.targetId);
					return {
						ok: true,
						targetId: target.targetId
					};
				}
				await ensureBrowserRunning(ctx, profileCtx, signal);
				const target = (await profileCtx.listTabs({ signal }))[index];
				if (!target) throw new BrowserTabNotFoundError();
				const ssrfPolicyOpts = browserNavigationPolicyForProfile(ctx, profileCtx);
				if (ssrfPolicyOpts.ssrfPolicy) await assertBrowserNavigationResultAllowed({
					url: target.url,
					...ssrfPolicyOpts
				});
				signal.throwIfAborted();
				const requestAssertCurrent = req.assertCurrent;
				await profileCtx.focusTab(target.targetId, {
					exactTargetId: true,
					signal,
					...requestAssertCurrent ? { assertCurrent: () => requestAssertCurrent(profileCtx.profile) } : {}
				});
				return {
					ok: true,
					targetId: target.targetId
				};
			}
		});
		if (result) res.json(result);
	});
}
//#endregion
//#region extensions/browser/src/browser/routes/index.ts
/** Register every browser control route group. */
function registerBrowserRoutes(app, ctx) {
	registerBrowserBasicRoutes(app, ctx);
	registerBrowserTabRoutes(app, ctx);
	registerBrowserPermissionRoutes(app, ctx);
	registerBrowserAgentRoutes(app, ctx);
}
//#endregion
export { resolveRequestedBrowserProfile as a, normalizeBrowserScreenshot as c, normalizeBrowserRequestPath as i, isBrowserHostLocalRoute as n, DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES as o, isPersistentBrowserProfileMutation as r, DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE as s, registerBrowserRoutes as t };
