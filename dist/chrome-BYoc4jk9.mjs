import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { _ as redactSensitiveText, b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as ensurePortAvailable } from "./ports-CDR43XuJ.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-YCP0ajt5.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { _ as resolvePinnedHostnameWithPolicy, d as isPrivateNetworkAllowedByPolicy, p as matchesHostnameAllowlist } from "./ssrf-BQRtcdBp.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./text-utility-runtime-D7I29NA0.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./number-runtime-CGwowceO.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { n as redactCdpUrl } from "./browser-cdp-nPpqdqz_.mjs";
import "./provider-http-Dn9NddwC.mjs";
import { r as saveJsonFile, t as loadJsonFile } from "./json-store-EnZiK23B.mjs";
import { m as DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME } from "./constants-DKjTvIBP.mjs";
import { t as normalizeBrowserTimerDelayMs } from "./timer-delay-DhAs5gz8.mjs";
import { o as resolveManagedBrowserHeadlessMode, t as getManagedBrowserMissingDisplayError } from "./config-fMVye_Fl.mjs";
import { c as BrowserProfileUnavailableError, i as BrowserCdpEndpointBlockedError, n as BROWSER_ERROR_REASONS } from "./errors-CXz-2iKA.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import { t as DEFAULT_DOWNLOAD_DIR } from "./paths-BD1L9gFZ.mjs";
import { C as CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS, D as CHROME_STOP_TIMEOUT_MS, E as CHROME_STDERR_HINT_MAX_CHARS, N as assertManagedProxyAllowsCdpUrl, O as MANAGED_CDP_READY_HTTP_TIMEOUT_MS, S as CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS, _ as withCdpSocket, a as fetchJson, c as isWebSocketUrl, h as CdpSocketError, i as fetchCdpChecked, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, p as scopeCdpPolicyToConfiguredEndpoint, s as isDirectCdpWebSocketEndpoint, t as appendCdpPath, u as normalizeCdpWsUrl, w as CHROME_LAUNCH_READY_WINDOW_MS } from "./cdp.helpers-DHnECuD4.mjs";
import "./subsystem-DDeJ2N6_.mjs";
import "./utils-Cs3fQhZS.mjs";
import { t as createBoundedUtf8Tail } from "./bounded-utf8-tail-dlh7Ug_1.mjs";
import "./ssrf-policy-helpers-BmwvxBcL.mjs";
import { t as resolveBrowserExecutableForPlatform } from "./chrome.executables-Cv2wahLt.mjs";
import { t as ensureOutputDirectory } from "./output-directories-CQa36ejE.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawn } from "node:child_process";
import { isIP } from "node:net";
import os from "node:os";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { createHash } from "node:crypto";
import { once } from "node:events";
//#region extensions/browser/src/browser/browser-proxy-mode.ts
const PROXY_ROUTING_CHROME_ARGS = /* @__PURE__ */ new Set([
	"--proxy-auto-detect",
	"--proxy-pac-url",
	"--proxy-server"
]);
const PROXY_CONTROL_CHROME_ARGS = /* @__PURE__ */ new Set(["--no-proxy-server", ...PROXY_ROUTING_CHROME_ARGS]);
const CHROME_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"NO_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy",
	"no_proxy"
];
function chromeArgName(arg) {
	return arg.trim().split("=", 1)[0]?.toLowerCase() ?? "";
}
/** Return true when Chrome args contain any proxy control flag. */
function hasChromeProxyControlArg(args) {
	return args.some((arg) => PROXY_CONTROL_CHROME_ARGS.has(chromeArgName(arg)));
}
/** Return true when Chrome args route traffic through an explicit proxy. */
function hasExplicitChromeProxyRoutingArg(args) {
	return args.some((arg) => PROXY_ROUTING_CHROME_ARGS.has(chromeArgName(arg)));
}
/** Remove inherited proxy env so launched Chrome follows only configured args. */
function omitChromeProxyEnv(env) {
	const next = { ...env };
	for (const key of CHROME_PROXY_ENV_KEYS) delete next[key];
	return next;
}
/** Resolve the navigation proxy mode used by SSRF/navigation guards. */
function resolveBrowserNavigationProxyMode(params) {
	if (params.profile.driver === "openclaw" && params.profile.cdpIsLoopback && !params.profile.attachOnly && hasExplicitChromeProxyRoutingArg(params.resolved.extraArgs)) return "explicit-browser-proxy";
	return "direct";
}
//#endregion
//#region extensions/browser/src/browser/cdp-ax.ts
function axValue(v) {
	if (!v || typeof v !== "object" || !("value" in v)) return "";
	const value = v.value;
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return "";
}
//#endregion
//#region extensions/browser/src/browser/cdp-page-session.ts
/**
* CDP page-session preparation and committed-navigation observation.
*/
const CDP_TARGET_NAVIGATION_RESULT_TIMEOUT_MS = 2e3;
const CDP_TARGET_NAVIGATION_RESULT_POLL_MS = 50;
const CDP_TARGET_NAVIGATION_STABILITY_MS = 250;
function readCommittedFrameUrl(frame) {
	const unreachableUrl = typeof frame?.unreachableUrl === "string" ? frame.unreachableUrl.trim() : "";
	if (unreachableUrl) return unreachableUrl;
	const url = typeof frame?.url === "string" ? frame.url.trim() : "";
	if (url === ":") return;
	const fragment = typeof frame?.urlFragment === "string" ? frame.urlFragment.trim() : "";
	return url ? `${url}${fragment}` : void 0;
}
/** Read committed document identities together so snapshot facts share one browser observation. */
async function readCdpDocumentIdentities(send, sessionId) {
	const root = (await send("Page.getFrameTree", void 0, sessionId).catch(() => null))?.frameTree;
	const loaderId = root?.frame?.loaderId;
	const identities = { mainFrame: typeof loaderId === "string" && loaderId.trim() ? `cdp:${loaderId.trim()}` : void 0 };
	const pending = root ? [root] : [];
	const documents = [];
	while (pending.length) {
		const node = pending.pop();
		const id = node.frame?.id;
		const loader = node.frame?.loaderId;
		if (typeof id !== "string" || !id.trim() || typeof loader !== "string" || !loader.trim()) return identities;
		documents.push([id.trim(), loader.trim()]);
		for (const child of node.childFrames ?? []) pending.push(child);
	}
	if (documents.length) {
		documents.sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);
		identities.frameTree = `cdp-tree:${createHash("sha256").update(JSON.stringify(documents)).digest("hex")}`;
	}
	return identities;
}
async function waitForCdpNavigationResult(send, sessionId, requestedUrl, signal) {
	const deadline = Date.now() + CDP_TARGET_NAVIGATION_RESULT_TIMEOUT_MS;
	const requestedAboutBlank = requestedUrl.trim() === "" || requestedUrl.trim() === "about:blank";
	let stableCandidate;
	while (Date.now() < deadline) {
		signal?.throwIfAborted();
		const frameTree = await send("Page.getFrameTree", void 0, sessionId).catch(() => null);
		signal?.throwIfAborted();
		const frame = frameTree?.frameTree?.frame;
		const finalUrl = readCommittedFrameUrl(frame);
		if (requestedAboutBlank && finalUrl === "about:blank") return finalUrl;
		const loaderId = typeof frame?.loaderId === "string" ? frame.loaderId.trim() : "";
		if (finalUrl && finalUrl !== "about:blank" && loaderId) {
			const key = `${loaderId}\n${finalUrl}`;
			const now = Date.now();
			if (stableCandidate?.key === key) {
				if (now - stableCandidate.since >= CDP_TARGET_NAVIGATION_STABILITY_MS) return finalUrl;
			} else stableCandidate = {
				key,
				since: now
			};
		} else stableCandidate = void 0;
		await new Promise((resolve) => {
			setTimeout(resolve, CDP_TARGET_NAVIGATION_RESULT_POLL_MS);
		});
	}
}
/** Enable the page domains shared by target preparation and page operations. */
async function prepareCdpPageSession(send, sessionId) {
	await Promise.all([
		send("Page.enable", void 0, sessionId).catch(() => {}),
		send("Runtime.enable", void 0, sessionId).catch(() => {}),
		send("Network.enable", void 0, sessionId).catch(() => {}),
		send("DOM.enable", void 0, sessionId).catch(() => {}),
		send("Accessibility.enable", void 0, sessionId).catch(() => {})
	]);
	await send("Runtime.runIfWaitingForDebugger", void 0, sessionId).catch(() => {});
}
/** Prepare a created target and optionally observe its committed document URL. */
async function prepareCdpTargetSession(send, targetId, navigationUrl, signal) {
	const attached = await send("Target.attachToTarget", {
		targetId,
		flatten: true
	}).catch(() => null);
	const sessionId = typeof attached?.sessionId === "string" ? attached.sessionId : void 0;
	if (!sessionId) return;
	try {
		await prepareCdpPageSession(send, sessionId);
		return navigationUrl === void 0 ? void 0 : await waitForCdpNavigationResult(send, sessionId, navigationUrl, signal);
	} finally {
		await send("Target.detachFromTarget", { sessionId }).catch(() => {});
	}
}
/** Read the committed document URL from a page-level CDP WebSocket. */
async function waitForCdpCommittedNavigationUrl(opts) {
	const pinned = await assertCdpEndpointAllowed(opts.wsUrl, opts.cdpPolicy, {
		source: "discovered",
		configuredUrl: opts.configuredCdpUrl
	});
	opts.signal?.throwIfAborted();
	try {
		return await withCdpSocket(opts.wsUrl, async (send) => {
			opts.signal?.throwIfAborted();
			await send("Page.enable");
			return await waitForCdpNavigationResult(send, void 0, opts.requestedUrl, opts.signal);
		}, {
			commandTimeoutMs: opts.timeouts?.httpTimeoutMs ?? CDP_TARGET_NAVIGATION_RESULT_TIMEOUT_MS,
			handshakeTimeoutMs: opts.timeouts?.handshakeTimeoutMs,
			handshakeRetries: 0,
			lookup: pinned?.lookup
		});
	} catch {
		opts.signal?.throwIfAborted();
		return;
	}
}
//#endregion
//#region extensions/browser/src/browser/navigation-guard.ts
/**
* Browser navigation SSRF guard.
*
* Validates page navigation URLs and redirect chains before or after browser
* navigation while accounting for browser proxy routing.
*/
const NETWORK_NAVIGATION_PROTOCOLS = /* @__PURE__ */ new Set(["http:", "https:"]);
const SAFE_NON_NETWORK_URLS = /* @__PURE__ */ new Set(["about:blank"]);
const BROWSER_NAVIGATION_CREDENTIALS_BLOCKED_MESSAGE = "Navigation blocked: URL-embedded credentials are not supported for page navigation. Set HTTP Basic auth with `openclaw browser set credentials <username> <password>` or use an authenticated browser profile.";
function isAllowedNonNetworkNavigationUrl(parsed) {
	return SAFE_NON_NETWORK_URLS.has(parsed.href);
}
/** Raised when a browser navigation URL fails syntax or policy validation. */
var InvalidBrowserNavigationUrlError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "InvalidBrowserNavigationUrlError";
	}
};
/** Parse a page-navigation URL and reject credentials before any transport dispatch. */
function parseBrowserNavigationUrl(url) {
	const rawUrl = url.trim();
	if (!rawUrl) throw new InvalidBrowserNavigationUrlError("url is required");
	let parsed;
	try {
		parsed = new URL(rawUrl);
	} catch {
		throw new InvalidBrowserNavigationUrlError(`Invalid URL: ${rawUrl.includes("@") ? "[redacted credential-bearing URL]" : rawUrl}`);
	}
	if (parsed.username || parsed.password) throw new InvalidBrowserNavigationUrlError(BROWSER_NAVIGATION_CREDENTIALS_BLOCKED_MESSAGE);
	return parsed;
}
/** Build a navigation-policy object while omitting default direct proxy mode. */
function withBrowserNavigationPolicy(ssrfPolicy, opts) {
	return {
		...ssrfPolicy ? { ssrfPolicy } : {},
		...opts?.browserProxyMode && opts.browserProxyMode !== "direct" ? { browserProxyMode: opts.browserProxyMode } : {}
	};
}
/** Return true when strict policy requires redirect-chain inspection. */
function requiresInspectableBrowserNavigationRedirects(ssrfPolicy) {
	return ssrfPolicy?.dangerouslyAllowPrivateNetwork === false;
}
/** Return true when a URL needs redirect inspection under strict policy. */
function requiresInspectableBrowserNavigationRedirectsForUrl(url, ssrfPolicy) {
	if (!requiresInspectableBrowserNavigationRedirects(ssrfPolicy)) return false;
	try {
		const parsed = new URL(url);
		return NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol);
	} catch {
		return false;
	}
}
function isIpLiteralHostname(hostname) {
	return isIP(normalizeHostname(hostname)) !== 0;
}
function isExplicitlyAllowedBrowserHostname(hostname, ssrfPolicy) {
	const normalizedHostname = normalizeHostname(hostname);
	const allowedHostnames = (ssrfPolicy?.allowedHostnames ?? []).map((pattern) => normalizeHostname(pattern)).filter(Boolean);
	return allowedHostnames.length > 0 ? matchesHostnameAllowlist(normalizedHostname, allowedHostnames) : false;
}
/** Assert that a requested browser navigation URL is policy-allowed. */
async function assertBrowserNavigationAllowed(opts) {
	if (process.env.OPENCLAW_DEV_MODE === "1") return;
	opts.signal?.throwIfAborted();
	const parsed = parseBrowserNavigationUrl(opts.url);
	if (!NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol)) {
		if (isAllowedNonNetworkNavigationUrl(parsed)) return;
		throw new InvalidBrowserNavigationUrlError(`Navigation blocked: unsupported protocol "${parsed.protocol}"`);
	}
	if (opts.browserProxyMode === "explicit-browser-proxy" && !isPrivateNetworkAllowedByPolicy(opts.ssrfPolicy)) throw new InvalidBrowserNavigationUrlError("Navigation blocked: strict browser SSRF policy cannot be enforced while this browser profile is proxy-routed");
	if (opts.ssrfPolicy && opts.ssrfPolicy.dangerouslyAllowPrivateNetwork === false && !isPrivateNetworkAllowedByPolicy(opts.ssrfPolicy) && !isIpLiteralHostname(parsed.hostname) && !isExplicitlyAllowedBrowserHostname(parsed.hostname, opts.ssrfPolicy)) throw new InvalidBrowserNavigationUrlError("Navigation blocked: strict browser SSRF policy requires an IP-literal URL because browser DNS rebinding protections are unavailable for hostname-based navigation");
	await resolvePinnedHostnameWithPolicy(parsed.hostname, {
		lookupFn: opts.lookupFn,
		policy: opts.ssrfPolicy,
		signal: opts.signal
	});
}
/**
* Best-effort post-navigation guard for final page URLs.
* Only validates network URLs (http/https) and about:blank to avoid false
* positives on browser-internal error pages (e.g. chrome-error://). In strict
* mode this intentionally re-applies the hostname gate after redirects.
*/
async function assertBrowserNavigationResultAllowed(opts) {
	opts.signal?.throwIfAborted();
	const rawUrl = opts.url.trim();
	if (!rawUrl) return;
	let parsed;
	try {
		parsed = new URL(rawUrl);
	} catch {
		return;
	}
	if (NETWORK_NAVIGATION_PROTOCOLS.has(parsed.protocol) || isAllowedNonNetworkNavigationUrl(parsed)) await assertBrowserNavigationAllowed(opts);
}
/** Assert that every URL in a browser redirect chain is policy-allowed. */
async function assertBrowserNavigationRedirectChainAllowed(opts) {
	opts.signal?.throwIfAborted();
	const chain = [];
	let current = opts.request ?? null;
	while (current) {
		chain.push(current.url());
		current = current.redirectedFrom();
	}
	for (const url of chain.toReversed()) await assertBrowserNavigationAllowed({
		url,
		lookupFn: opts.lookupFn,
		ssrfPolicy: opts.ssrfPolicy,
		browserProxyMode: opts.browserProxyMode,
		signal: opts.signal
	});
}
//#endregion
//#region extensions/browser/src/browser/cdp-role-snapshot-dom.ts
async function findCursorInteractiveElements(send, sessionId) {
	const attr = "data-openclaw-cdp-ci";
	try {
		const evaluated = await send("Runtime.evaluate", {
			expression: `(() => {
          const out = [];
          const roles = new Set(["button","link","textbox","checkbox","radio","combobox","listbox","menuitem","menuitemcheckbox","menuitemradio","option","searchbox","slider","spinbutton","switch","tab","treeitem"]);
          const tags = new Set(["a","button","input","select","textarea","details","summary"]);
          document.querySelectorAll("[${attr}]").forEach((el) => el.removeAttribute("${attr}"));
          for (const el of document.body ? document.body.querySelectorAll("*") : []) {
            if (!(el instanceof HTMLElement) || el.closest("[hidden],[aria-hidden='true']")) continue;
            const tagName = el.tagName.toLowerCase();
            if (tags.has(tagName)) continue;
            const role = String(el.getAttribute("role") || "").toLowerCase();
            if (roles.has(role)) continue;
            const style = getComputedStyle(el);
            const hasCursorPointer = style.cursor === "pointer";
            const hasOnClick = el.hasAttribute("onclick") || el.onclick !== null;
            const tabIndex = el.getAttribute("tabindex");
            const hasTabIndex = tabIndex !== null && tabIndex !== "-1";
            const ce = el.getAttribute("contenteditable");
            const isEditable = ce === "" || ce === "true";
            if (!hasCursorPointer && !hasOnClick && !hasTabIndex && !isEditable) continue;
            if (hasCursorPointer && !hasOnClick && !hasTabIndex && !isEditable) {
              const parent = el.parentElement;
              if (parent && getComputedStyle(parent).cursor === "pointer") continue;
            }
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) continue;
            let hiddenInputType = "";
            const hiddenInput = el.querySelector("input[type='radio'],input[type='checkbox']");
            if (hiddenInput instanceof HTMLInputElement) {
              const hiddenStyle = getComputedStyle(hiddenInput);
              if (hiddenInput.hidden || hiddenStyle.display === "none" || hiddenStyle.visibility === "hidden") {
                hiddenInputType = hiddenInput.type;
              }
            }
            el.setAttribute("${attr}", String(out.length));
            out.push({
              text: String(el.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 101),
              tagName,
              hasCursorPointer,
              hasOnClick,
              hasTabIndex,
              isEditable,
              hiddenInputType,
            });
          }
          return out;
        })()`,
			returnByValue: true,
			awaitPromise: false
		}, sessionId).catch(() => null);
		const entries = (Array.isArray(evaluated?.result?.value) ? evaluated.result.value : []).map((value) => {
			const entry = asOptionalRecord(value);
			if (typeof entry?.text !== "string" || typeof entry.tagName !== "string") return;
			return {
				text: truncateUtf16Safe(entry.text, 100),
				tagName: entry.tagName,
				hasOnClick: entry.hasOnClick === true,
				hasCursorPointer: entry.hasCursorPointer === true,
				hasTabIndex: entry.hasTabIndex === true,
				isEditable: entry.isEditable === true,
				hiddenInputType: typeof entry.hiddenInputType === "string" ? entry.hiddenInputType : void 0
			};
		});
		if (!entries.some((entry) => entry !== void 0)) return /* @__PURE__ */ new Map();
		const rootNodeId = (await send("DOM.getDocument", { depth: 0 }, sessionId).catch(() => null))?.root?.nodeId;
		if (typeof rootNodeId !== "number") return /* @__PURE__ */ new Map();
		const queried = await send("DOM.querySelectorAll", {
			nodeId: rootNodeId,
			selector: `[${attr}]`
		}, sessionId).catch(() => null);
		const out = /* @__PURE__ */ new Map();
		await Promise.all((queried?.nodeIds ?? []).map(async (nodeId) => {
			const described = await send("DOM.describeNode", { nodeId }, sessionId).catch(() => null);
			const attrs = described?.node?.attributes ?? [];
			const attrIndex = attrs.indexOf(attr);
			const rawIndex = attrIndex >= 0 ? attrs[attrIndex + 1] : void 0;
			const index = typeof rawIndex === "string" ? Number(rawIndex) : NaN;
			const backendNodeId = described?.node?.backendNodeId;
			if (typeof backendNodeId === "number" && Number.isInteger(index) && entries[index]) out.set(backendNodeId, entries[index]);
		}));
		return out;
	} finally {
		await send("Runtime.evaluate", {
			expression: `document.querySelectorAll("[${attr}]").forEach((el) => el.removeAttribute("${attr}"))`,
			returnByValue: true
		}, sessionId).catch(() => {});
	}
}
async function resolveLinkUrls(send, refs, sessionId) {
	const out = /* @__PURE__ */ new Map();
	const linkRefs = Object.values(refs).filter((ref) => ref.role === "link" && Boolean(ref.backendDOMNodeId));
	await Promise.all(linkRefs.map(async (ref) => {
		const objectId = (await send("DOM.resolveNode", { backendNodeId: ref.backendDOMNodeId }, sessionId).catch(() => null))?.object?.objectId;
		if (!objectId) return;
		const hrefResult = await send("Runtime.callFunctionOn", {
			objectId,
			functionDeclaration: "function() { return this.href || ''; }",
			returnByValue: true
		}, sessionId).catch(() => null);
		const href = typeof hrefResult?.result?.value === "string" ? hrefResult.result.value : "";
		if (href) out.set(ref.backendDOMNodeId, href);
	}));
	return out;
}
async function resolveIframeFrameIds(send, tree, sessionId) {
	const out = /* @__PURE__ */ new Map();
	const iframeNodes = tree.filter((node) => node.role.toLowerCase() === "iframe" && Boolean(node.backendDOMNodeId));
	await Promise.all(iframeNodes.map(async (node) => {
		const described = await send("DOM.describeNode", {
			backendNodeId: node.backendDOMNodeId,
			depth: 1
		}, sessionId).catch(() => null);
		const frameId = described?.node?.contentDocument?.frameId ?? described?.node?.frameId ?? "";
		if (frameId) out.set(node.backendDOMNodeId, frameId);
	}));
	return out;
}
//#endregion
//#region extensions/browser/src/browser/snapshot-depth-limit.ts
const ROLE_SNAPSHOT_DEPTH_TRUNCATION_MARKER = "[...TRUNCATED - accessibility tree too deep]";
function appendRoleSnapshotDepthTruncationMarker(snapshot) {
	return snapshot ? `${snapshot}\n\n${ROLE_SNAPSHOT_DEPTH_TRUNCATION_MARKER}` : ROLE_SNAPSHOT_DEPTH_TRUNCATION_MARKER;
}
//#endregion
//#region extensions/browser/src/browser/snapshot-roles.ts
/**
* Shared ARIA role classification sets used by both the Playwright and Chrome MCP
* snapshot paths. Keep these in sync — divergence causes the two drivers to produce
* different snapshot output for the same page.
*/
/** Roles that represent user-interactive elements and always get a ref. */
const INTERACTIVE_ROLES = /* @__PURE__ */ new Set([
	"button",
	"checkbox",
	"combobox",
	"link",
	"listbox",
	"menuitem",
	"menuitemcheckbox",
	"menuitemradio",
	"option",
	"radio",
	"searchbox",
	"slider",
	"spinbutton",
	"switch",
	"tab",
	"textbox",
	"treeitem"
]);
/** Roles that carry meaningful content and get a ref when named. */
const CONTENT_ROLES = /* @__PURE__ */ new Set([
	"article",
	"cell",
	"columnheader",
	"gridcell",
	"heading",
	"listitem",
	"main",
	"navigation",
	"region",
	"rowheader"
]);
/** Structural/container roles — typically skipped in compact mode. */
const STRUCTURAL_ROLES = /* @__PURE__ */ new Set([
	"application",
	"directory",
	"document",
	"generic",
	"grid",
	"group",
	"ignored",
	"list",
	"menu",
	"menubar",
	"none",
	"presentation",
	"row",
	"rowgroup",
	"table",
	"tablist",
	"toolbar",
	"tree",
	"treegrid"
]);
//#endregion
//#region extensions/browser/src/browser/cdp-role-snapshot-tree.ts
function buildRoleTree(nodes, rootBackendNodeId) {
	const byId = /* @__PURE__ */ new Map();
	const tree = [];
	for (const raw of nodes) {
		const nodeId = raw.nodeId ?? "";
		if (!nodeId) continue;
		const role = axValue(raw.role) || "unknown";
		const name = axValue(raw.name);
		const normalizedRole = role.toLowerCase();
		byId.set(nodeId, tree.length);
		tree.push({
			raw,
			role,
			name,
			value: axValue(raw.value),
			backendDOMNodeId: typeof raw.backendDOMNodeId === "number" && raw.backendDOMNodeId > 0 ? Math.floor(raw.backendDOMNodeId) : void 0,
			children: [],
			depth: 0,
			...rootBackendNodeId !== void 0 ? { transparent: raw.ignored === true || [
				"none",
				"presentation",
				"fragment"
			].includes(normalizedRole) || normalizedRole === "generic" && !name } : {}
		});
	}
	for (const [index, node] of tree.entries()) for (const childId of node.raw.childIds ?? []) {
		const childIndex = byId.get(childId);
		if (childIndex === void 0) continue;
		node.children.push(childIndex);
		expectDefined(tree[childIndex], "CDP child node index").parent = index;
	}
	const roots = [];
	if (rootBackendNodeId !== void 0) {
		const rootIndex = tree.findIndex((node) => node.backendDOMNodeId === rootBackendNodeId);
		if (rootIndex < 0) throw new Error("Snapshot root is no longer present in the accessibility tree; retry.");
		roots.push(rootIndex);
	} else for (const [index, node] of tree.entries()) if (node.parent === void 0) roots.push(index);
	const stack = roots.map((index) => ({
		index,
		depth: 0
	}));
	while (stack.length) {
		const current = stack.pop();
		if (!current) break;
		const node = expectDefined(tree[current.index], "CDP traversal node index");
		node.depth = current.depth;
		for (let i = node.children.length - 1; i >= 0; i--) {
			const child = expectDefined(node.children[i], "CDP traversal child index");
			stack.push({
				index: child,
				depth: current.depth + (node.transparent ? 0 : 1)
			});
		}
	}
	return {
		tree,
		roots: roots.length ? roots : tree.length ? [0] : []
	};
}
function shouldIncludeRoleNode(node, options) {
	if (node.transparent) return false;
	const role = node.role.toLowerCase();
	if (options.interactive) return INTERACTIVE_ROLES.has(role) || role === "iframe" || Boolean(node.cursorInfo);
	if (options.compact && STRUCTURAL_ROLES.has(role) && !node.name && !node.ref) return false;
	return true;
}
function roleStateSuffix(node) {
	const properties = new Map((node.properties ?? []).map(({ name, value }) => [name, value.value]));
	return [
		"checked",
		"disabled",
		"expanded",
		"pressed",
		"selected",
		"level",
		"invalid"
	].flatMap((name) => {
		const value = properties.get(name);
		if (value === true || value === "true") return [` [${name}]`];
		if (value === "mixed" || name === "level" && typeof value === "number" || name === "invalid" && typeof value === "string" && value !== "false") return [` [${name}=${value}]`];
		return [];
	}).join("");
}
function cursorSuffix(info) {
	if (!info) return "";
	const parts = [
		info.hasCursorPointer ? "cursor:pointer" : void 0,
		info.hasOnClick ? "onclick" : void 0,
		info.hasTabIndex ? "tabindex" : void 0,
		info.isEditable ? "contenteditable" : void 0,
		info.hiddenInputType ? `hidden-${info.hiddenInputType}` : void 0
	].filter(Boolean);
	return parts.length ? ` [${parts.join(", ")}]` : "";
}
function renderRoleTree(tree, index, output, options, state, indentOffset = 0) {
	const node = tree[index];
	if (!node) return;
	if (options.maxDepth !== void 0 && node.depth > options.maxDepth) return;
	const effectiveDepth = Math.max(0, node.depth + indentOffset);
	if (effectiveDepth > 100) {
		state.truncated = true;
		return;
	}
	if (shouldIncludeRoleNode(node, options)) {
		const indent = "  ".repeat(state.flattenInteractive && options.interactive ? 0 : effectiveDepth);
		const name = node.name ? ` ${JSON.stringify(node.name)}` : "";
		const ref = node.ref ? ` [ref=${node.ref}]` : "";
		const nth = node.nth !== void 0 && node.nth > 0 ? ` [nth=${node.nth}]` : "";
		const value = node.value ? ` value=${JSON.stringify(node.value)}` : "";
		const url = node.url ? ` [url=${node.url}]` : "";
		if (state.recordIframePositions && node.ref && node.frameId) node.iframeLineIndex ??= output.length;
		output.push(`${indent}- ${node.role}${name}${ref}${nth}${roleStateSuffix(node.raw)}${value}${url}${cursorSuffix(node.cursorInfo)}`);
	}
	for (const child of node.children) renderRoleTree(tree, child, output, options, state, indentOffset);
}
//#endregion
//#region extensions/browser/src/browser/pw-role-snapshot.ts
/**
* Playwright role snapshot helpers.
*
* Preserves native AI refs and finalizes browser snapshot budgets and deltas.
*/
const ROLE_SNAPSHOT_TRUNCATION_MARKER = "[...TRUNCATED - page too large]";
/** Read formatter-owned refs without interpreting names or scalar page content. */
function findRoleSnapshotLineRef(line) {
	return parseSnapshotLine(line)?.ref;
}
function getRoleSnapshotIdentityKey(ref, value, mode) {
	return mode === "aria" ? ref : `${value.role}\0${value.name ?? ""}\0${value.nth ?? 0}`;
}
/** Build the stable identity set used for per-tab snapshot deltas. */
function getRoleSnapshotIdentityKeys(refs, mode) {
	return new Set(Object.entries(refs).map(([ref, value]) => getRoleSnapshotIdentityKey(ref, value, mode)));
}
/** Mark ref-bearing lines that were absent from the previous compatible snapshot. */
function annotateRoleSnapshotDelta(params) {
	const markedKeys = /* @__PURE__ */ new Set();
	for (const [index, line] of params.lines.entries()) {
		const ref = params.lineRefs[index];
		const value = ref && Object.hasOwn(params.refs, ref) ? params.refs[ref] : void 0;
		if (!ref || !value) continue;
		const key = getRoleSnapshotIdentityKey(ref, value, params.mode);
		if (params.previousKeys.has(key)) continue;
		params.lines[index] = `${line} [new]`;
		markedKeys.add(key);
	}
	if (markedKeys.size === 0) return false;
	params.lines.push(`${markedKeys.size} new element(s) since last snapshot`);
	return true;
}
function truncateRoleSnapshot(lines, maxChars) {
	const marker = maxChars >= 31 ? ROLE_SNAPSHOT_TRUNCATION_MARKER : "…";
	let prefix = "";
	let lineCount = 0;
	for (const line of lines) {
		const candidate = prefix ? `${prefix}\n${line}` : line;
		if (candidate.length + 2 + marker.length > maxChars) break;
		prefix = candidate;
		lineCount += 1;
	}
	return {
		snapshot: prefix ? `${prefix}\n\n${marker}` : marker,
		lineCount
	};
}
/** Apply the final output budget, then keep only refs present on complete output lines. */
function finalizeRoleSnapshot(params) {
	const normalizedMaxChars = typeof params.maxChars === "number" && Number.isFinite(params.maxChars) && params.maxChars > 0 ? Math.floor(params.maxChars) : void 0;
	const maxChars = normalizedMaxChars && normalizedMaxChars > 0 ? normalizedMaxChars : void 0;
	const delta = params.delta;
	const previousKeys = delta?.previousKeys;
	const sourceLines = params.snapshot.split("\n");
	let lineRefs;
	let annotated = false;
	if (delta && previousKeys !== void 0) {
		lineRefs = sourceLines.map(findRoleSnapshotLineRef);
		annotated = annotateRoleSnapshotDelta({
			lines: sourceLines,
			lineRefs,
			refs: params.refs,
			mode: delta.mode,
			previousKeys
		});
	}
	const sourceSnapshot = annotated ? sourceLines.join("\n") : params.snapshot;
	const truncated = maxChars !== void 0 && sourceSnapshot.length > maxChars;
	const bounded = truncated ? truncateRoleSnapshot(sourceLines, maxChars) : void 0;
	const snapshot = bounded?.snapshot ?? sourceSnapshot;
	const outputLines = truncated ? snapshot.split("\n") : sourceLines;
	const visibleRefs = /* @__PURE__ */ new Set();
	const visibleLineCount = bounded?.lineCount ?? sourceLines.length;
	for (let index = 0; index < visibleLineCount; index += 1) {
		const ref = lineRefs ? lineRefs[index] : findRoleSnapshotLineRef(sourceLines[index]);
		if (ref) visibleRefs.add(ref);
	}
	const visibleEntries = [];
	const newKeys = previousKeys !== void 0 ? /* @__PURE__ */ new Set() : void 0;
	let interactive = 0;
	for (const [ref, value] of Object.entries(params.refs)) {
		if (!visibleRefs.has(ref)) continue;
		visibleEntries.push([ref, value]);
		if (INTERACTIVE_ROLES.has(value.role)) interactive += 1;
		if (newKeys && delta && previousKeys !== void 0) {
			const key = getRoleSnapshotIdentityKey(ref, value, delta.mode);
			if (!previousKeys.has(key)) newKeys.add(key);
		}
	}
	const refs = Object.fromEntries(visibleEntries);
	const newElements = newKeys?.size;
	const result = {
		snapshot,
		refs,
		stats: {
			lines: snapshot ? outputLines.length : 0,
			chars: snapshot.length,
			refs: visibleEntries.length,
			interactive
		},
		...newElements !== void 0 ? { newElements } : {}
	};
	return truncated ? {
		...result,
		truncated: true
	} : result;
}
function getIndentLevel(line) {
	const indent = line.match(/^(\s*)/)?.[1];
	return indent === void 0 ? 0 : Math.floor(indent.length / 2);
}
function parseSnapshotLine(line) {
	const entry = line.match(/^(\s*-\s+)(.*)$/s);
	if (!entry) return null;
	const prefix = entry[1];
	const content = entry[2];
	const quoted = content.match(/^'((?:[^']|'')*)'(.*)$/s);
	const match = (quoted ? quoted[1].replaceAll("''", "'") : content).match(/^(\w+)(?:\s+("(?:\\.|[^"\\])*"))?(.*)$/s);
	if (!match) return null;
	const roleRaw = match[1];
	let nameToken = match[2];
	let suffix = match[3];
	if (nameToken === void 0 && suffix.startsWith(" /")) {
		const literal = (quoted ? suffix : suffix.split(/:(?=\s|$)/, 1)[0]).match(/^ (\/(?:.*\/)?)/s);
		if (literal) {
			nameToken = literal[1];
			suffix = suffix.slice(literal[0].length);
		}
	}
	const ref = (suffix.match(/^(?:\s+\[[^\][]*\])*/)?.[0])?.match(/\[ref=([^\][]+)\]/)?.[1];
	return {
		prefix,
		roleRaw,
		role: normalizeLowercaseStringOrEmpty(roleRaw),
		nameToken,
		ref,
		suffix: suffix + (quoted?.[2] ?? "")
	};
}
function decodeSnapshotName(nameToken) {
	return nameToken?.startsWith("\"") ? JSON.parse(nameToken) : nameToken;
}
function compactTree(lines) {
	const entries = [];
	const stack = [];
	const finishEntry = () => {
		const current = stack.pop();
		if (!current) return;
		current.keep ||= current.hasRef;
		if (current.hasRef && stack.length > 0) {
			const parent = stack.at(-1);
			if (parent !== void 0) parent.hasRef = true;
		}
	};
	for (const line of lines) {
		const indent = getIndentLevel(line);
		while (stack.length > 0) {
			if (expectDefined(stack.at(-1), "non-empty role snapshot stack").indent < indent) break;
			finishEntry();
		}
		const hasRef = Boolean(findRoleSnapshotLineRef(line));
		const entry = {
			line,
			keep: hasRef || line.includes(":") && !line.trimEnd().endsWith(":"),
			hasRef,
			indent
		};
		entries.push(entry);
		stack.push(entry);
	}
	while (stack.length > 0) finishEntry();
	return entries.filter((entry) => entry.keep).map((entry) => entry.line).join("\n") || "(empty)";
}
function buildInteractiveSnapshotLines(params) {
	const out = [];
	for (const line of params.lines) {
		if (params.options.maxDepth !== void 0 && getIndentLevel(line) > params.options.maxDepth) continue;
		const entry = parseSnapshotLine(line);
		if (!entry) continue;
		const parsed = {
			...entry,
			name: decodeSnapshotName(entry.nameToken)
		};
		if (!INTERACTIVE_ROLES.has(parsed.role)) continue;
		const resolved = params.resolveRef(parsed);
		if (!resolved?.ref) continue;
		params.refs[resolved.ref] = resolved.data;
		let enhanced = `- ${parsed.roleRaw}`;
		if (parsed.name) enhanced += ` ${JSON.stringify(parsed.name)}`;
		enhanced += ` [ref=${resolved.ref}]`;
		enhanced += params.formatSuffix(parsed.suffix, resolved.ref);
		out.push(enhanced);
	}
	return out;
}
/** Normalize a role snapshot ref accepted by browser actions. */
function parseRoleRef(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const normalized = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed.startsWith("ref=") ? trimmed.slice(4) : trimmed;
	if (/^e\d+$/i.test(normalized)) return normalized;
	if (/^\d{1,9}$/.test(normalized)) return normalized;
	return null;
}
function parseAiSnapshotRef(ref) {
	return ref && /^(?:f\d+)?e\d+$|^\d{1,9}$/i.test(ref) ? ref : null;
}
/**
* Build a role snapshot from Playwright's AI snapshot output while preserving Playwright's own
* aria-ref ids (e.g. ref=e13). This makes the refs self-resolving across calls.
*/
function buildRoleSnapshotFromAiSnapshot(aiSnapshot, suppliedOptions) {
	const options = suppliedOptions === void 0 ? {} : suppliedOptions;
	const lines = aiSnapshot.split("\n");
	const refs = {};
	if (options.interactive) return {
		snapshot: buildInteractiveSnapshotLines({
			lines,
			options,
			refs,
			resolveRef: (parsed) => {
				const ref = parseAiSnapshotRef(parsed.ref);
				return ref ? {
					ref,
					data: {
						role: parsed.role,
						...parsed.name ? { name: parsed.name } : {}
					}
				} : null;
			},
			formatSuffix: (suffix, ref) => suffix.replace(` [ref=${ref}]`, "")
		}).join("\n") || "(no interactive elements)",
		refs
	};
	const out = suppliedOptions === void 0 ? void 0 : [];
	for (const line of lines) {
		const depth = getIndentLevel(line);
		if (options.maxDepth !== void 0 && depth > options.maxDepth) continue;
		const parsed = parseSnapshotLine(line);
		if (!parsed) {
			out?.push(line);
			continue;
		}
		const { role } = parsed;
		const name = decodeSnapshotName(parsed.nameToken);
		const isStructural = STRUCTURAL_ROLES.has(role);
		if (options.compact && isStructural && !name) continue;
		const ref = parseAiSnapshotRef(parsed.ref);
		if (ref) refs[ref] = {
			role,
			...name ? { name } : {}
		};
		out?.push(line);
	}
	return {
		snapshot: options.compact ? compactTree(out ?? lines) : (out ? out.join("\n") : aiSnapshot) || "(empty)",
		refs
	};
}
//#endregion
//#region extensions/browser/src/browser/snapshot-urls.ts
/** Appends a compact numbered link list to a snapshot string. */
function appendSnapshotUrls(snapshot, urls) {
	if (urls.length === 0) return snapshot;
	return `${snapshot}\n\nLinks:\n${urls.map((entry, index) => `${index + 1}. ${entry.text} -> ${entry.url}`).join("\n")}`;
}
//#endregion
//#region extensions/browser/src/browser/cdp-role-snapshot.ts
async function readScopedAXNodes(send, backendNodeId, sessionId) {
	const queried = await send("Accessibility.queryAXTree", { backendNodeId }, sessionId);
	if (queried.nodes.some((node) => node.backendDOMNodeId === backendNodeId)) return queried.nodes;
	const partial = await send("Accessibility.getPartialAXTree", {
		backendNodeId,
		fetchRelatives: true
	}, sessionId);
	const root = partial.nodes.find((node) => node.backendDOMNodeId === backendNodeId);
	if (!root?.ignored || !root.nodeId) throw new Error("Snapshot root is no longer present in the accessibility tree; retry.");
	if (!root.childIds?.length) return [root];
	const frameId = partial.nodes.find((node) => node.frameId)?.frameId;
	if (!frameId) throw new Error("Snapshot frame identity is unavailable; retry.");
	const full = await send("Accessibility.getFullAXTree", { frameId }, sessionId);
	const byId = new Map(full.nodes.map((node) => [node.nodeId, node]));
	const nodes = [root];
	const included = /* @__PURE__ */ new Set([root.nodeId]);
	for (const node of nodes) for (const id of node.childIds ?? []) {
		const child = byId.get(id);
		if (child && !included.has(id)) {
			included.add(id);
			nodes.push(child);
		}
	}
	return nodes;
}
async function buildCdpRoleSnapshot(params) {
	const res = params.rootBackendNodeId !== void 0 ? { nodes: await readScopedAXNodes(params.send, params.rootBackendNodeId, params.sessionId) } : await params.send("Accessibility.getFullAXTree", params.frameId ? { frameId: params.frameId } : void 0, params.sessionId);
	const { tree, roots } = buildRoleTree(Array.isArray(res.nodes) ? res.nodes : [], params.rootBackendNodeId);
	const cursorElements = params.rootBackendNodeId !== void 0 ? /* @__PURE__ */ new Map() : await findCursorInteractiveElements(params.send, params.sessionId);
	for (const node of tree) if (node.backendDOMNodeId && cursorElements.has(node.backendDOMNodeId)) {
		const cursorInfo = cursorElements.get(node.backendDOMNodeId);
		node.cursorInfo = cursorInfo;
		if (!node.name && cursorInfo?.text) node.name = cursorInfo.text;
	}
	const counts = /* @__PURE__ */ new Map();
	const refs = {};
	for (const node of tree) {
		const role = node.role.toLowerCase();
		if (!(INTERACTIVE_ROLES.has(role) || CONTENT_ROLES.has(role) && Boolean(node.name) || role === "iframe" || Boolean(node.cursorInfo)) || node.transparent) continue;
		const key = `${role}:${node.name}`;
		const nth = counts.get(key) ?? 0;
		counts.set(key, nth + 1);
		const ref = `e${params.nextRef.value}`;
		params.nextRef.value += 1;
		node.ref = ref;
		node.nth = nth;
		refs[ref] = {
			role,
			...node.name ? { name: node.name } : {},
			nth,
			...node.backendDOMNodeId ? { backendDOMNodeId: node.backendDOMNodeId } : {},
			...params.frameId ? { frameId: params.frameId } : {}
		};
	}
	for (const node of tree) if (node.ref && counts.get(`${node.role.toLowerCase()}:${node.name}`) === 1) delete refs[node.ref]?.nth;
	const iframeFrameIds = await resolveIframeFrameIds(params.send, tree, params.sessionId);
	for (const node of tree) if (node.backendDOMNodeId && iframeFrameIds.has(node.backendDOMNodeId)) {
		node.frameId = iframeFrameIds.get(node.backendDOMNodeId);
		if (node.ref && refs[node.ref]) expectDefined(refs[node.ref], "owned CDP role reference").frameId = node.frameId;
	}
	if (params.urls) {
		const urls = await resolveLinkUrls(params.send, refs, params.sessionId);
		for (const node of tree) if (node.backendDOMNodeId && urls.has(node.backendDOMNodeId)) node.url = urls.get(node.backendDOMNodeId);
	}
	let lines = [];
	const renderState = {
		truncated: false,
		recordIframePositions: params.recurseIframes,
		flattenInteractive: params.rootBackendNodeId !== void 0
	};
	for (const root of roots) renderRoleTree(tree, root, lines, params.options, renderState);
	if (params.recurseIframes) {
		let childLinesByIndex;
		for (const iframe of tree) {
			if (iframe.iframeLineIndex === void 0 || !iframe.frameId) continue;
			const child = await buildCdpRoleSnapshot({
				...params,
				frameId: iframe.frameId,
				recurseIframes: false
			}).catch(() => null);
			if (!child) continue;
			renderState.truncated ||= child.truncated;
			if (!child.lines.length) continue;
			Object.assign(refs, child.refs);
			(childLinesByIndex ??= /* @__PURE__ */ new Map()).set(iframe.iframeLineIndex, child.lines);
		}
		if (childLinesByIndex) {
			const expanded = [];
			for (let index = 0; index < lines.length; index++) {
				expanded.push(lines[index]);
				const childLines = childLinesByIndex.get(index);
				if (childLines) for (const childLine of childLines) expanded.push(`  ${childLine}`);
			}
			lines = expanded;
		}
	}
	return {
		lines,
		refs,
		truncated: renderState.truncated
	};
}
/** Capture and format refs with their backend identities on the caller-owned CDP session. */
async function snapshotRoleViaCdpSession(opts) {
	await prepareCdpPageSession(opts.send);
	const built = await buildCdpRoleSnapshot({
		send: opts.send,
		rootBackendNodeId: opts.rootBackendNodeId,
		options: opts.options ?? {},
		urls: opts.urls,
		recurseIframes: opts.recurseIframes ?? true,
		nextRef: { value: 1 }
	});
	const renderedSnapshot = built.lines.join("\n").trim() || (opts.options?.interactive ? "(no interactive elements)" : opts.rootBackendNodeId !== void 0 ? "(empty)" : "(empty page)");
	const finalized = finalizeRoleSnapshot({
		snapshot: appendSnapshotUrls(built.truncated ? appendRoleSnapshotDepthTruncationMarker(renderedSnapshot) : renderedSnapshot, opts.urlEntries ?? []),
		refs: built.refs,
		maxChars: opts.maxChars,
		delta: opts.delta
	});
	return built.truncated && !finalized.truncated ? {
		...finalized,
		truncated: true
	} : finalized;
}
async function snapshotRoleViaCdp(opts) {
	return await withCdpSocket(opts.wsUrl, async (send) => await snapshotRoleViaCdpSession({
		...opts,
		send
	}), {
		commandTimeoutMs: opts.timeoutMs ?? 5e3,
		lookup: opts.lookup
	});
}
//#endregion
//#region extensions/browser/src/browser/cdp.ts
/**
* Chrome DevTools Protocol browser operations.
*
* Provides screenshots, target creation, JavaScript evaluation, ARIA/role
* snapshots, DOM text, and selector lookup on top of the CDP socket helpers.
*/
/** Read committed document identities from a page-level CDP target. */
async function getDocumentIdentitiesViaCdp(opts) {
	return await withCdpSocket(opts.wsUrl, async (send) => await readCdpDocumentIdentities(send), {
		commandTimeoutMs: opts.timeoutMs ?? 5e3,
		...opts.lookup ? { lookup: opts.lookup } : {}
	});
}
/** Capture a PNG or JPEG screenshot through CDP, optionally full-page. */
async function captureScreenshot(opts) {
	return await withCdpSocket(opts.wsUrl, async (send) => {
		await send("Page.enable");
		if (opts.headless !== false) await send("Page.bringToFront").catch(() => {});
		const format = opts.format ?? "png";
		const quality = format === "jpeg" ? Math.max(0, Math.min(100, Math.round(opts.quality ?? 85))) : void 0;
		const base64 = (await send("Page.captureScreenshot", {
			format,
			...quality !== void 0 ? { quality } : {},
			...opts.fullPage ? { captureBeyondViewport: true } : {}
		}))?.data;
		if (!base64) throw new Error("Screenshot failed: missing data");
		return Buffer.from(base64, "base64");
	}, {
		commandTimeoutMs: opts.timeoutMs,
		lookup: opts.lookup
	});
}
/** Create a new browser target after applying navigation and CDP SSRF policy. */
async function createTargetViaCdp(opts) {
	opts.signal?.throwIfAborted();
	await assertBrowserNavigationAllowed({
		url: opts.url,
		...withBrowserNavigationPolicy(opts.ssrfPolicy)
	});
	const configuredCdpPin = await assertCdpEndpointAllowed(opts.cdpUrl, opts.ssrfPolicy);
	const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(opts.cdpUrl, opts.ssrfPolicy);
	let wsUrl;
	if (isDirectCdpWebSocketEndpoint(opts.cdpUrl)) wsUrl = opts.cdpUrl;
	else {
		const discoveryUrl = isWebSocketUrl(opts.cdpUrl) ? normalizeCdpHttpBaseForJsonEndpoints(opts.cdpUrl) : opts.cdpUrl;
		let version = null;
		try {
			version = await fetchJson(appendCdpPath(discoveryUrl, "/json/version"), opts.timeouts?.httpTimeoutMs, { signal: opts.signal }, cdpControlPolicy);
		} catch (err) {
			if (!isWebSocketUrl(opts.cdpUrl)) throw err;
		}
		const wsUrlRaw = version?.webSocketDebuggerUrl?.trim() ?? "";
		if (wsUrlRaw) wsUrl = normalizeCdpWsUrl(wsUrlRaw, discoveryUrl);
		else if (isWebSocketUrl(opts.cdpUrl)) wsUrl = opts.cdpUrl;
		else throw new Error("CDP /json/version missing webSocketDebuggerUrl");
	}
	const candidateWsUrls = isWebSocketUrl(opts.cdpUrl) && wsUrl !== opts.cdpUrl ? [wsUrl, opts.cdpUrl] : [wsUrl];
	let lastError;
	for (const candidateWsUrl of candidateWsUrls) try {
		const endpointSource = candidateWsUrl === opts.cdpUrl ? { source: "configured" } : {
			source: "discovered",
			configuredUrl: opts.cdpUrl
		};
		const candidateCdpPin = candidateWsUrl === opts.cdpUrl ? configuredCdpPin : await assertCdpEndpointAllowed(candidateWsUrl, cdpControlPolicy, endpointSource);
		opts.signal?.throwIfAborted();
		return await withCdpSocket(candidateWsUrl, async (send) => {
			opts.signal?.throwIfAborted();
			const targetId = (await send("Target.createTarget", {
				url: opts.url,
				background: true
			}))?.targetId?.trim() ?? "";
			if (!targetId) throw new Error("CDP Target.createTarget returned no targetId");
			try {
				opts.signal?.throwIfAborted();
				const finalUrl = await prepareCdpTargetSession(send, targetId, opts.waitForNavigationResult ? opts.url : void 0, opts.signal);
				opts.signal?.throwIfAborted();
				return finalUrl ? {
					targetId,
					finalUrl
				} : { targetId };
			} catch (error) {
				await send("Target.closeTarget", { targetId }).catch(() => {});
				throw error;
			}
		}, {
			commandTimeoutMs: opts.timeouts?.httpTimeoutMs ?? 5e3,
			handshakeTimeoutMs: opts.timeouts?.handshakeTimeoutMs,
			lookup: candidateCdpPin?.lookup
		});
	} catch (err) {
		opts.signal?.throwIfAborted();
		lastError = err;
	}
	if (lastError instanceof Error) throw lastError;
	throw new Error("CDP Target.createTarget failed");
}
/** Prefix assigned to generated accessibility-node refs. */
const AX_REF_PREFIX = "ax";
const AX_REF_PATTERN = new RegExp(`^${AX_REF_PREFIX}\\d+$`);
/** Format raw AX nodes into bounded ARIA snapshot nodes. */
function formatAriaSnapshot(nodes, limit) {
	const byId = /* @__PURE__ */ new Map();
	for (const n of nodes) if (n.nodeId) byId.set(n.nodeId, n);
	const referenced = /* @__PURE__ */ new Set();
	for (const n of nodes) for (const c of n.childIds ?? []) referenced.add(c);
	const root = nodes.find((n) => n.nodeId && !referenced.has(n.nodeId)) ?? nodes[0];
	if (!root?.nodeId) return [];
	const out = [];
	const stack = [{
		id: root.nodeId,
		depth: 0
	}];
	while (stack.length && out.length < limit) {
		const popped = stack.pop();
		/* c8 ignore next 3 */
		if (!popped) break;
		const { id, depth } = popped;
		const n = byId.get(id);
		/* c8 ignore next 3 */
		if (!n) continue;
		const role = axValue(n.role);
		const name = axValue(n.name);
		const value = axValue(n.value);
		const description = axValue(n.description);
		const ref = `${AX_REF_PREFIX}${out.length + 1}`;
		out.push({
			ref,
			role: role || "unknown",
			name: name || "",
			...value ? { value } : {},
			...description ? { description } : {},
			...typeof n.backendDOMNodeId === "number" ? { backendDOMNodeId: n.backendDOMNodeId } : {},
			depth
		});
		const children = n.childIds ?? [];
		for (let i = children.length - 1; i >= 0; i--) {
			const child = children[i];
			if (child && byId.has(child)) stack.push({
				id: child,
				depth: depth + 1
			});
		}
	}
	return out;
}
/** Capture an accessibility-tree snapshot through CDP. */
async function snapshotAria(opts) {
	const limit = resolveIntegerOption(opts.limit, 500, {
		min: 1,
		max: 2e3
	});
	return await withCdpSocket(opts.wsUrl, async (send) => {
		await prepareCdpPageSession(send);
		const res = await send("Accessibility.getFullAXTree");
		return { nodes: formatAriaSnapshot(Array.isArray(res?.nodes) ? res.nodes : [], limit) };
	}, {
		commandTimeoutMs: opts.timeoutMs ?? 5e3,
		lookup: opts.lookup
	});
}
//#endregion
//#region extensions/browser/src/browser/chrome.diagnostics.ts
/**
* Chrome CDP diagnostics.
*
* Probes /json/version and WebSocket health, redacts sensitive endpoint data,
* and formats status output for browser doctor/status flows.
*/
function elapsedSince(startedAt) {
	return Math.max(0, Date.now() - startedAt);
}
/** Convert an error and optional cause to redacted diagnostic text. */
function safeChromeCdpErrorMessage(error) {
	const message = error instanceof Error ? error.message : String(error);
	const cause = error instanceof Error ? error.cause : void 0;
	const causeMessage = cause instanceof Error ? cause.message : typeof cause === "string" ? cause : void 0;
	if (message && causeMessage && !message.includes(causeMessage)) return redactSensitiveText(`${message}: ${causeMessage}`);
	return redactSensitiveText(message || "unknown error");
}
/** Read and validate Chrome's /json/version endpoint. */
async function readChromeVersion(cdpUrl, timeoutMs = 500, ssrfPolicy, versionPath = "/json/version", signal) {
	signal?.throwIfAborted();
	const versionUrl = appendCdpPath(cdpUrl, versionPath);
	const { response, release } = await fetchCdpChecked(versionUrl, timeoutMs, { signal }, ssrfPolicy);
	try {
		const data = await readProviderJsonResponse(response, "cdp-version");
		signal?.throwIfAborted();
		if (!data || typeof data !== "object") throw new Error("CDP /json/version returned non-object JSON");
		return data;
	} finally {
		await release();
	}
}
/** Preserve providers that expose only Playwright's trailing-slash route. */
async function readChromeVersionWithCredentialFallback(cdpUrl, timeoutMs = 500, ssrfPolicy, signal) {
	let primaryVersion;
	let primaryError;
	try {
		primaryVersion = await readChromeVersion(cdpUrl, timeoutMs, ssrfPolicy, void 0, signal);
		signal?.throwIfAborted();
		if (normalizeOptionalString(primaryVersion.webSocketDebuggerUrl)) return primaryVersion;
	} catch (error) {
		signal?.throwIfAborted();
		primaryError = error;
	}
	try {
		return await readChromeVersion(cdpUrl, timeoutMs, ssrfPolicy, "/json/version/", signal);
	} catch {
		signal?.throwIfAborted();
		if (primaryVersion) return primaryVersion;
		throw primaryError;
	}
}
function readObjectString(value, key) {
	if (!value || typeof value !== "object") return;
	return normalizeOptionalString(value[key]);
}
function chromeVersionFromCdpResult(result) {
	const browser = readObjectString(result, "Browser") ?? readObjectString(result, "product");
	const userAgent = readObjectString(result, "User-Agent") ?? readObjectString(result, "userAgent");
	if (!browser && !userAgent) return;
	return {
		Browser: browser,
		"User-Agent": userAgent
	};
}
async function diagnoseCdpHealthCommand(wsUrl, timeoutMs = 800, lookup, signal) {
	signal?.throwIfAborted();
	const timeout = normalizeBrowserTimerDelayMs(timeoutMs);
	const timerDelayMs = normalizeBrowserTimerDelayMs(timeout + Math.min(25, timeout));
	const handshake = new AbortController();
	const timer = setTimeout(() => handshake.abort(/* @__PURE__ */ new Error(`WebSocket handshake did not complete within ${timeout}ms`)), timerDelayMs);
	let opened = false;
	try {
		const result = await withCdpSocket(wsUrl, async (send) => {
			opened = true;
			clearTimeout(timer);
			return await send("Browser.getVersion");
		}, {
			handshakeTimeoutMs: timeout,
			commandTimeoutMs: timerDelayMs,
			handshakeRetries: 0,
			lookup,
			signal: signal ? AbortSignal.any([signal, handshake.signal]) : handshake.signal,
			abortScope: "operation"
		});
		return result && typeof result === "object" ? {
			ok: true,
			version: chromeVersionFromCdpResult(result)
		} : {
			ok: false,
			code: "websocket_health_command_failed",
			message: "Browser.getVersion returned no result object"
		};
	} catch (error) {
		signal?.throwIfAborted();
		const kind = error instanceof CdpSocketError ? error.kind : void 0;
		return {
			ok: false,
			code: !opened ? "websocket_handshake_failed" : kind === "timeout" ? "websocket_health_command_timeout" : "websocket_health_command_failed",
			message: kind === "timeout" ? `Browser.getVersion did not respond within ${timeout}ms` : kind === "closed" ? opened ? "WebSocket closed before Browser.getVersion completed" : "WebSocket closed before handshake completed" : kind === "protocol" ? "Browser.getVersion returned no result object" : safeChromeCdpErrorMessage(error)
		};
	} finally {
		clearTimeout(timer);
	}
}
function classifyChromeVersionError(error) {
	const message = safeChromeCdpErrorMessage(error);
	if (error instanceof BrowserCdpEndpointBlockedError) return {
		code: "ssrf_blocked",
		message
	};
	if (/^HTTP \d+/.test(message)) return {
		code: "http_status_failed",
		message
	};
	if (error instanceof SyntaxError || message.includes("cdp-version: malformed JSON response") || message.includes("non-object JSON")) return {
		code: "invalid_json",
		message
	};
	return {
		code: "http_unreachable",
		message
	};
}
/** Format a Chrome CDP diagnostic result for status and doctor output. */
function formatChromeCdpDiagnostic(diagnostic) {
	const redactedCdpUrl = redactCdpUrl(diagnostic.cdpUrl) ?? diagnostic.cdpUrl;
	const redactedWsUrl = redactCdpUrl(diagnostic.wsUrl) ?? diagnostic.wsUrl;
	if (diagnostic.ok) {
		const browser = diagnostic.browser ? ` browser=${diagnostic.browser}` : "";
		return `CDP diagnostic: ready after ${diagnostic.elapsedMs}ms; cdp=${redactedCdpUrl}; websocket=${redactedWsUrl}.${browser}`;
	}
	const websocket = redactedWsUrl ? `; websocket=${redactedWsUrl}` : "";
	const wslPortproxyHint = diagnostic.code === "http_unreachable" && isLikelyEmptyHttpReply(diagnostic.message) ? WSL_EMPTY_REPLY_PORTPROXY_HINT : "";
	return `CDP diagnostic: ${diagnostic.code} after ${diagnostic.elapsedMs}ms; cdp=${redactedCdpUrl}${websocket}; ${diagnostic.message}.${wslPortproxyHint}`;
}
const WSL_EMPTY_REPLY_PORTPROXY_HINT = " In WSL2-to-Windows Chrome setups, an empty CDP reply can mean netsh is forwarding to the wrong loopback address. On Windows, inspect `netstat -ano | findstr :9222` and `netsh interface portproxy show all`, then curl both 127.0.0.1 and [::1]. Chromium prefers 127.0.0.1 and falls back to [::1] only when the IPv4 bind fails. If svchost/iphlpsvc owns 127.0.0.1:9222, remove the 127.0.0.1:9222 -> 127.0.0.1:9222 self-loop; if chrome.exe listens only on [::1], use v4tov6 with connectaddress=::1 for the WSL2-reachable listener.";
function isLikelyEmptyHttpReply(message) {
	return /empty reply|other side closed|socket closed|connection reset|econnreset|terminated before response/i.test(message);
}
/** Run HTTP and WebSocket health diagnostics for a Chrome CDP endpoint. */
async function diagnoseChromeCdp(cdpUrl, timeoutMs = 500, handshakeTimeoutMs = 800, ssrfPolicy, signal) {
	signal?.throwIfAborted();
	const startedAt = Date.now();
	const failure = (code, message, wsUrl) => ({
		ok: false,
		cdpUrl,
		wsUrl,
		code,
		message: redactSensitiveText(message),
		elapsedMs: elapsedSince(startedAt)
	});
	const diagnoseEndpoint = async (wsUrl, lookup, version) => {
		const health = await diagnoseCdpHealthCommand(wsUrl, handshakeTimeoutMs, lookup, signal).catch((error) => {
			signal?.throwIfAborted();
			throw error;
		});
		signal?.throwIfAborted();
		return health.ok ? {
			ok: true,
			cdpUrl,
			wsUrl,
			browser: version?.Browser ?? health.version?.Browser,
			userAgent: version?.["User-Agent"] ?? health.version?.["User-Agent"],
			elapsedMs: elapsedSince(startedAt)
		} : failure(health.code, health.message, wsUrl);
	};
	let configuredPin;
	try {
		configuredPin = await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
	} catch (err) {
		signal?.throwIfAborted();
		return failure("ssrf_blocked", safeChromeCdpErrorMessage(err));
	}
	signal?.throwIfAborted();
	const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(cdpUrl, ssrfPolicy);
	const webSocket = isWebSocketUrl(cdpUrl);
	if (isDirectCdpWebSocketEndpoint(cdpUrl)) return await diagnoseEndpoint(cdpUrl, configuredPin?.lookup);
	const discoveryUrl = webSocket ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl) : cdpUrl;
	let version;
	try {
		version = await readChromeVersionWithCredentialFallback(discoveryUrl, timeoutMs, cdpControlPolicy, signal);
	} catch (err) {
		signal?.throwIfAborted();
		if (webSocket) return await diagnoseEndpoint(cdpUrl, configuredPin?.lookup);
		const classified = classifyChromeVersionError(err);
		return failure(classified.code, classified.message);
	}
	signal?.throwIfAborted();
	const wsUrlRaw = normalizeOptionalString(version.webSocketDebuggerUrl) ?? "";
	if (!wsUrlRaw) {
		if (webSocket) return await diagnoseEndpoint(cdpUrl, configuredPin?.lookup, version);
		return failure("missing_websocket_debugger_url", "CDP /json/version did not include webSocketDebuggerUrl");
	}
	let wsUrl;
	try {
		wsUrl = normalizeCdpWsUrl(wsUrlRaw, discoveryUrl);
	} catch (err) {
		return failure("websocket_handshake_failed", safeChromeCdpErrorMessage(err));
	}
	let discoveredPin;
	try {
		discoveredPin = await assertCdpEndpointAllowed(wsUrl, cdpControlPolicy, {
			source: "discovered",
			configuredUrl: cdpUrl
		});
	} catch (err) {
		signal?.throwIfAborted();
		return failure("websocket_ssrf_blocked", safeChromeCdpErrorMessage(err), wsUrl);
	}
	const diagnostic = await diagnoseEndpoint(wsUrl, discoveredPin?.lookup, version);
	if (!diagnostic.ok && webSocket && wsUrl !== cdpUrl) {
		const directDiagnostic = await diagnoseEndpoint(cdpUrl, configuredPin?.lookup, version);
		if (directDiagnostic.ok) return directDiagnostic;
	}
	return diagnostic;
}
//#endregion
//#region extensions/browser/src/browser/chrome.profile-decoration.ts
/**
* OpenClaw-managed Chrome profile decoration.
*
* Applies managed-browser policy, a stable profile name, color, download
* directory, and clean-exit markers to Chrome's profile files.
*/
const CHROME_NETWORK_PREDICTION_DISABLED = 2;
function decoratedMarkerPath(userDataDir) {
	return path.join(userDataDir, ".openclaw-profile-decorated");
}
function safeReadJson(filePath) {
	return asNullableRecord(loadJsonFile(filePath));
}
function safeWriteJson(filePath, data) {
	saveJsonFile(filePath, data);
}
function readNestedRecord(root, key) {
	return asNullableRecord(asNullableRecord(root)?.[key]);
}
function readDefaultProfileInfo(localState) {
	return readNestedRecord(readNestedRecord(asNullableRecord(localState)?.profile, "info_cache"), "Default");
}
function setDeep(obj, keys, value) {
	if (keys.length === 0) return;
	let node = obj;
	for (const key of keys.slice(0, -1)) {
		const next = node[key];
		if (typeof next !== "object" || next === null || Array.isArray(next)) node[key] = {};
		node = node[key];
	}
	const lastKey = keys.at(-1);
	if (lastKey !== void 0) node[lastKey] = value;
}
function parseHexRgbToSignedArgbInt(hex) {
	const cleaned = hex.trim().replace(/^#/, "");
	if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
	const argbUnsigned = 255 << 24 | Number.parseInt(cleaned, 16);
	return argbUnsigned > 2147483647 ? argbUnsigned - 4294967296 : argbUnsigned;
}
/** Return true when a managed Chrome profile already has desired decoration. */
function isProfileDecorated(userDataDir, desiredName, desiredColorHex, desiredDownloadDir) {
	const desiredColorInt = parseHexRgbToSignedArgbInt(desiredColorHex);
	const localStatePath = path.join(userDataDir, "Local State");
	const preferencesPath = path.join(userDataDir, "Default", "Preferences");
	const info = readDefaultProfileInfo(safeReadJson(localStatePath));
	const prefs = safeReadJson(preferencesPath);
	const browserTheme = readNestedRecord(prefs?.browser, "theme");
	const autogeneratedTheme = readNestedRecord(prefs?.autogenerated, "theme");
	const download = readNestedRecord(prefs, "download");
	const savefile = readNestedRecord(prefs, "savefile");
	const nameOk = typeof info?.name === "string" ? info.name === desiredName : true;
	const downloadOk = desiredDownloadDir ? download?.default_directory === desiredDownloadDir && download.prompt_for_download === false && download.directory_upgrade === true && savefile?.default_directory === desiredDownloadDir : true;
	if (desiredColorInt == null) return nameOk && downloadOk;
	const localSeedOk = typeof info?.profile_color_seed === "number" ? info.profile_color_seed === desiredColorInt : false;
	const prefOk = typeof browserTheme?.user_color2 === "number" && browserTheme.user_color2 === desiredColorInt || typeof autogeneratedTheme?.color === "number" && autogeneratedTheme.color === desiredColorInt;
	return nameOk && localSeedOk && prefOk && downloadOk;
}
/** Return whether this profile was initialized with Chromium's automation keychain. */
function usesOpenClawMockKeychain(userDataDir) {
	return readDefaultProfileInfo(safeReadJson(path.join(userDataDir, "Local State")))?.openclaw_mock_keychain === true;
}
/** Disable Chromium network prediction in an OpenClaw-managed Chrome profile. */
function ensureProfileNetworkPredictionDisabled(userDataDir) {
	const preferencesPath = path.join(userDataDir, "Default", "Preferences");
	const prefs = safeReadJson(preferencesPath) ?? {};
	setDeep(prefs, ["net", "network_prediction_options"], CHROME_NETWORK_PREDICTION_DISABLED);
	safeWriteJson(preferencesPath, prefs);
}
/**
* Best-effort profile decoration (name + lobster-orange). Chrome preference keys
* vary by version; we keep this conservative and idempotent.
*/
function decorateOpenClawProfile(userDataDir, opts) {
	const desiredName = opts?.name ?? "openclaw";
	const desiredColor = (opts?.color ?? "#FF4500").toUpperCase();
	const desiredColorInt = parseHexRgbToSignedArgbInt(desiredColor);
	const localStatePath = path.join(userDataDir, "Local State");
	const preferencesPath = path.join(userDataDir, "Default", "Preferences");
	const localState = safeReadJson(localStatePath) ?? {};
	setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"name"
	], desiredName);
	setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"shortcut_name"
	], desiredName);
	setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"user_name"
	], desiredName);
	if (opts?.mockKeychain) setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"openclaw_mock_keychain"
	], true);
	setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"profile_color"
	], desiredColor);
	setDeep(localState, [
		"profile",
		"info_cache",
		"Default",
		"user_color"
	], desiredColor);
	if (desiredColorInt != null) {
		setDeep(localState, [
			"profile",
			"info_cache",
			"Default",
			"profile_color_seed"
		], desiredColorInt);
		setDeep(localState, [
			"profile",
			"info_cache",
			"Default",
			"profile_highlight_color"
		], desiredColorInt);
		setDeep(localState, [
			"profile",
			"info_cache",
			"Default",
			"default_avatar_fill_color"
		], desiredColorInt);
		setDeep(localState, [
			"profile",
			"info_cache",
			"Default",
			"default_avatar_stroke_color"
		], desiredColorInt);
	}
	safeWriteJson(localStatePath, localState);
	const prefs = safeReadJson(preferencesPath) ?? {};
	setDeep(prefs, ["profile", "name"], desiredName);
	setDeep(prefs, ["profile", "profile_color"], desiredColor);
	setDeep(prefs, ["profile", "user_color"], desiredColor);
	if (desiredColorInt != null) {
		setDeep(prefs, [
			"autogenerated",
			"theme",
			"color"
		], desiredColorInt);
		setDeep(prefs, [
			"browser",
			"theme",
			"user_color2"
		], desiredColorInt);
	}
	if (opts?.downloadDir) {
		setDeep(prefs, ["download", "default_directory"], opts.downloadDir);
		setDeep(prefs, ["download", "prompt_for_download"], false);
		setDeep(prefs, ["download", "directory_upgrade"], true);
		setDeep(prefs, ["savefile", "default_directory"], opts.downloadDir);
	}
	safeWriteJson(preferencesPath, prefs);
	try {
		fs.writeFileSync(decoratedMarkerPath(userDataDir), `${Date.now()}\n`, "utf-8");
	} catch {}
}
/** Mark the managed Chrome profile as cleanly exited. */
function ensureProfileCleanExit(userDataDir) {
	const preferencesPath = path.join(userDataDir, "Default", "Preferences");
	const prefs = safeReadJson(preferencesPath) ?? {};
	setDeep(prefs, ["exit_type"], "Normal");
	setDeep(prefs, ["exited_cleanly"], true);
	safeWriteJson(preferencesPath, prefs);
}
//#endregion
//#region extensions/browser/src/browser/chrome.ts
/**
* OpenClaw-managed Chrome lifecycle and CDP helpers.
*
* Builds launch args, starts/stops managed Chrome, probes CDP readiness, and
* resolves WebSocket endpoints for browser control.
*/
const log = createSubsystemLogger("browser").child("chrome");
const CHROME_SINGLETON_LOCK_PATHS = [
	"SingletonLock",
	"SingletonSocket",
	"SingletonCookie"
];
const CHROME_SINGLETON_IN_USE_PATTERN = /profile appears to be in use by another chromium process/i;
const CHROME_MISSING_DISPLAY_PATTERN = /missing x server|\$DISPLAY/i;
const CHROME_GRACEFUL_CLOSE_COMMAND_TIMEOUT_MS = 500;
const CHROME_LAUNCH_STDERR_TAIL_MAX_BYTES = 65536;
const CHROME_HTTP_DISCOVERY_FAILURE_CODES = /* @__PURE__ */ new Set([
	"ssrf_blocked",
	"http_unreachable",
	"http_status_failed",
	"invalid_json"
]);
const TCP_LISTEN_STATE_HEX = "0A";
function diagnosticShowsChromeHttpDiscovery(diagnostic) {
	if (!diagnostic) return false;
	if (diagnostic.ok) return true;
	return !CHROME_HTTP_DISCOVERY_FAILURE_CODES.has(diagnostic.code);
}
function createChromeLaunchStderrDiagnostics(maxBytes) {
	const tail = createBoundedUtf8Tail(maxBytes);
	const signals = {
		singletonInUse: false,
		missingDisplay: false
	};
	let markerScanTail = "";
	const updateSignals = (chunkText) => {
		const scanText = `${markerScanTail}${chunkText}`;
		signals.singletonInUse ||= CHROME_SINGLETON_IN_USE_PATTERN.test(scanText);
		signals.missingDisplay ||= CHROME_MISSING_DISPLAY_PATTERN.test(scanText);
		markerScanTail = scanText.slice(-256);
	};
	return {
		append(chunk) {
			tail.append(chunk);
			const chunkText = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk;
			if (chunkText.length > 0) updateSignals(chunkText);
		},
		toString() {
			return tail.text();
		},
		signals() {
			return { ...signals };
		},
		clear() {
			tail.clear();
			signals.singletonInUse = false;
			signals.missingDisplay = false;
			markerScanTail = "";
		}
	};
}
function readSingletonLockTarget(userDataDir) {
	let target;
	try {
		target = fs.readlinkSync(path.join(userDataDir, "SingletonLock"));
	} catch (error) {
		return error instanceof Error && "code" in error && error.code === "ENOENT" ? { status: "missing" } : {
			status: "invalid",
			reason: "Chromium profile lock could not be read"
		};
	}
	const match = /^(?<lockHost>.+)-(?<pid>\d+)$/.exec(target);
	if (!match?.groups) return {
		status: "invalid",
		reason: "Chromium profile lock is malformed"
	};
	const hostname = normalizeOptionalString(match.groups.lockHost) ?? "";
	const pid = Number.parseInt(match.groups.pid ?? "", 10);
	if (!hostname || !Number.isSafeInteger(pid) || pid <= 0) return {
		status: "invalid",
		reason: "Chromium profile lock is malformed"
	};
	return {
		status: "owner",
		hostname,
		pid
	};
}
function unverifiedSingletonLockReason(lock) {
	if (lock.status === "invalid") return lock.reason;
	if (lock.status === "owner" && lock.hostname !== os.hostname()) return "Chromium profile lock names another hostname";
}
function readLinuxProcessArgv(pid) {
	let cmdline;
	try {
		cmdline = fs.readFileSync(`/proc/${pid}/cmdline`);
	} catch {
		return null;
	}
	const argv = cmdline.toString("utf8").split("\0").filter((arg) => arg.length > 0);
	return argv.length > 0 ? argv : null;
}
function readPsCommandLine(pid) {
	try {
		return normalizeOptionalString(execFileSync("ps", [
			"-ww",
			"-p",
			String(pid),
			"-o",
			"command="
		], {
			encoding: "utf8",
			timeout: 1e3,
			maxBuffer: 65536
		})) ?? null;
	} catch {
		return null;
	}
}
function readManagedProcessCommandLine(pid) {
	if (process.platform !== "linux" && process.platform !== "darwin") return null;
	const startTime = getFileLockProcessStartTime(pid);
	if (startTime === null) return null;
	const argv = process.platform === "linux" ? readLinuxProcessArgv(pid) : null;
	const text = process.platform === "linux" ? argv?.join(" ") : readPsCommandLine(pid);
	return text ? {
		argv,
		text,
		startTime
	} : null;
}
function isChromeExecutableFamilyMatch(commandText, exe) {
	const normalizedCommand = commandText.toLowerCase();
	const configuredPath = exe.path.toLowerCase();
	const configuredBase = path.basename(exe.path).toLowerCase();
	if (normalizedCommand.includes(configuredPath) || configuredBase.length > 0 && normalizedCommand.includes(configuredBase)) return true;
	if (exe.kind === "chrome" || exe.kind === "canary") return /\b(google chrome|google-chrome|chrome|chromium)\b/i.test(commandText);
	if (exe.kind === "chromium") return /\b(chromium|chromium-browser)\b/i.test(commandText);
	if (exe.kind === "brave") return /\b(brave browser|brave-browser|brave)\b/i.test(commandText);
	if (exe.kind === "edge") return /\b(microsoft edge|microsoft-edge|msedge)\b/i.test(commandText);
	return false;
}
function processCommandHasFlag(command, name, value) {
	const flag = `--${name}=`;
	if (command.argv) {
		const matches = command.argv.filter((arg) => arg.startsWith(flag));
		return matches.length === 1 && matches[0] === `${flag}${value}`;
	}
	const matches = [...command.text.matchAll(new RegExp(`(?:^|\\s)${flag}(.*?)(?=\\s--|$)`, "g"))];
	return matches.length === 1 && matches[0]?.[1] === value;
}
function commandLineMatchesManagedChrome(params) {
	return isChromeExecutableFamilyMatch(params.command.text, params.exe) && processCommandHasFlag(params.command, "remote-debugging-port", String(params.profile.cdpPort)) && processCommandHasFlag(params.command, "user-data-dir", params.userDataDir);
}
function parseLinuxTcpListenInodesForPort(table, port) {
	const expectedPort = port.toString(16).toUpperCase().padStart(4, "0");
	const inodes = /* @__PURE__ */ new Set();
	for (const line of table.split(/\r?\n/).slice(1)) {
		const fields = line.trim().split(/\s+/);
		const localAddress = fields[1] ?? "";
		const state = fields[3] ?? "";
		const inode = fields[9] ?? "";
		if (localAddress.split(":").at(-1)?.toUpperCase() === expectedPort && state === TCP_LISTEN_STATE_HEX && inode) inodes.add(inode);
	}
	return inodes;
}
function readLinuxTcpListenInodesForPort(port) {
	const inodes = /* @__PURE__ */ new Set();
	for (const tablePath of ["/proc/net/tcp", "/proc/net/tcp6"]) try {
		for (const inode of parseLinuxTcpListenInodesForPort(fs.readFileSync(tablePath, "utf8"), port)) inodes.add(inode);
	} catch {}
	return inodes;
}
function linuxPidOwnsAnySocketInode(pid, inodes) {
	if (inodes.size === 0) return false;
	let descriptors;
	try {
		descriptors = fs.readdirSync(`/proc/${pid}/fd`);
	} catch {
		return false;
	}
	for (const descriptor of descriptors) {
		let target;
		try {
			target = fs.readlinkSync(`/proc/${pid}/fd/${descriptor}`);
		} catch {
			continue;
		}
		const match = /^socket:\[(?<inode>\d+)\]$/.exec(target);
		if (match?.groups?.inode && inodes.has(match.groups.inode)) return true;
	}
	return false;
}
function linuxPidListensOnPort(pid, port) {
	return linuxPidOwnsAnySocketInode(pid, readLinuxTcpListenInodesForPort(port));
}
function lsofShowsPidListeningOnPort(pid, port) {
	try {
		return execFileSync("lsof", [
			"-nP",
			"-a",
			"-p",
			String(pid),
			`-iTCP:${port}`,
			"-sTCP:LISTEN",
			"-Fp"
		], {
			encoding: "utf8",
			timeout: 1e3,
			maxBuffer: 65536
		}).split(/\r?\n/).some((line) => line === `p${pid}`);
	} catch {
		return false;
	}
}
function pidListensOnPort(pid, port) {
	if (process.platform === "linux") return linuxPidListensOnPort(pid, port);
	if (process.platform === "darwin") return lsofShowsPidListeningOnPort(pid, port);
	return false;
}
function sameManagedChromeIdentity(a, b) {
	return a.pid === b.pid && a.commandLine === b.commandLine && a.startTime === b.startTime;
}
function readOwnedManagedChromeIdentity(params) {
	if (!isPidAlive(params.pid) || !pidListensOnPort(params.pid, params.profile.cdpPort)) return null;
	const command = readManagedProcessCommandLine(params.pid);
	if (!command || !commandLineMatchesManagedChrome({
		command,
		exe: params.exe,
		profile: params.profile,
		userDataDir: params.userDataDir
	})) return null;
	return {
		pid: params.pid,
		startTime: command.startTime,
		commandLine: command.text
	};
}
function isPortInUseError(err) {
	const errno = err?.code;
	const name = err instanceof Error ? err.name : "";
	const message = err instanceof Error ? err.message : String(err);
	return errno === "EADDRINUSE" || name === "PortInUseError" || /\bEADDRINUSE\b|already in use/i.test(message);
}
function readCurrentHostSingletonPid(userDataDir, hostname = os.hostname()) {
	const lock = readSingletonLockTarget(userDataDir);
	if (lock.status !== "owner" || lock.hostname !== hostname || !isPidAlive(lock.pid)) return null;
	return lock.pid;
}
function clearChromeSingletonArtifacts(userDataDir) {
	for (const basename of CHROME_SINGLETON_LOCK_PATHS) try {
		fs.rmSync(path.join(userDataDir, basename), { force: true });
	} catch {}
}
/** Remove stale Chrome singleton lock files from a user-data-dir. */
function clearStaleChromeSingletonLocks(userDataDir, hostname = os.hostname()) {
	const lock = readSingletonLockTarget(userDataDir);
	if (lock.status !== "owner" || lock.hostname !== hostname || isPidAlive(lock.pid)) return false;
	clearChromeSingletonArtifacts(userDataDir);
	return true;
}
async function waitForChromeProcessExit(proc, timeoutMs) {
	if (proc.exitCode != null || proc.signalCode != null) return true;
	return await new Promise((resolve) => {
		const cleanup = () => {
			clearTimeout(timer);
			proc.off("exit", onExit);
			proc.off("close", onExit);
		};
		const timer = setTimeout(() => {
			cleanup();
			resolve(false);
		}, timeoutMs);
		const onExit = () => {
			cleanup();
			resolve(true);
		};
		proc.once("exit", onExit);
		proc.once("close", onExit);
		if (proc.exitCode != null || proc.signalCode != null) onExit();
	});
}
async function signalChromeProcess(proc, signal, timeoutMs) {
	if (proc.exitCode != null || proc.signalCode != null) return true;
	try {
		proc.kill(signal);
	} catch {}
	return await waitForChromeProcessExit(proc, timeoutMs);
}
async function terminateChromeForRetry(proc, userDataDir) {
	if (!await signalChromeProcess(proc, "SIGKILL", 5e3)) return false;
	clearStaleChromeSingletonLocks(userDataDir);
	return true;
}
async function waitForPidExit(pid, timeoutMs) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (!isPidAlive(pid)) return true;
		await new Promise((resolve) => {
			setTimeout(resolve, 50);
		});
	}
	return !isPidAlive(pid);
}
async function terminateOwnedStaleChromeProcess(params, timeoutMs = CHROME_STOP_TIMEOUT_MS) {
	const readCurrentIdentity = () => readOwnedManagedChromeIdentity({
		pid: params.identity.pid,
		exe: params.exe,
		profile: params.profile,
		userDataDir: params.userDataDir
	});
	const beforeSigterm = readCurrentIdentity();
	if (!beforeSigterm || !sameManagedChromeIdentity(params.identity, beforeSigterm)) return false;
	try {
		process.kill(params.identity.pid, "SIGTERM");
	} catch {
		return false;
	}
	if (await waitForPidExit(params.identity.pid, timeoutMs)) return true;
	const beforeSigkill = readCurrentIdentity();
	if (!beforeSigkill || !sameManagedChromeIdentity(params.identity, beforeSigkill)) return false;
	try {
		process.kill(params.identity.pid, "SIGKILL");
	} catch {
		return false;
	}
	return await waitForPidExit(params.identity.pid, CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
}
function clearRecoveredChromeSingletonArtifacts(userDataDir, pid, hostname = os.hostname()) {
	const lock = readSingletonLockTarget(userDataDir);
	if (lock.status !== "owner" || lock.hostname !== hostname || lock.pid !== pid || isPidAlive(pid)) return false;
	clearChromeSingletonArtifacts(userDataDir);
	return true;
}
async function recoverOwnedStaleManagedChromeCdpListener(params) {
	params.signal?.throwIfAborted();
	if (!params.profile.cdpIsLoopback) return false;
	const pid = readCurrentHostSingletonPid(params.userDataDir);
	if (pid == null) return false;
	let diagnostic;
	try {
		diagnostic = await diagnoseChromeCdp(params.profile.cdpUrl, 500, 800, void 0, params.signal);
	} catch {
		params.signal?.throwIfAborted();
		return false;
	}
	if (diagnostic.ok || diagnostic.code !== "websocket_health_command_timeout") return false;
	const identity = readOwnedManagedChromeIdentity({
		pid,
		exe: params.exe,
		profile: params.profile,
		userDataDir: params.userDataDir
	});
	if (!identity) return false;
	params.signal?.throwIfAborted();
	if (!await terminateOwnedStaleChromeProcess({
		identity,
		exe: params.exe,
		profile: params.profile,
		userDataDir: params.userDataDir
	})) return false;
	if (!clearRecoveredChromeSingletonArtifacts(params.userDataDir, pid)) return false;
	log.warn(`Stopped stale managed Chrome CDP listener for profile "${params.profile.name}" (pid ${pid}) and retrying launch.`);
	return true;
}
async function ensureManagedChromePortAvailable(resolved, profile, userDataDir, signal) {
	const configuredHost = new URL(profile.cdpUrl).hostname.replace(/^\[|\]$/g, "");
	const probeHosts = configuredHost === "127.0.0.1" ? [configuredHost] : ["127.0.0.1", configuredHost];
	const ensureProbeHostsAvailable = async () => {
		for (const host of probeHosts) {
			signal?.throwIfAborted();
			await ensurePortAvailable(profile.cdpPort, host);
		}
	};
	try {
		await ensureProbeHostsAvailable();
		return;
	} catch (err) {
		signal?.throwIfAborted();
		const exe = resolveBrowserExecutable(resolved, profile);
		if (!isPortInUseError(err) || !exe) throw err;
		if (!await recoverOwnedStaleManagedChromeCdpListener({
			exe,
			profile,
			userDataDir,
			signal
		})) throw err;
	}
	await ensureProbeHostsAvailable();
}
function chromeLaunchHints(params) {
	const hints = [];
	if (process.platform === "linux" && !params.resolved.noSandbox) hints.push("If running in a container or as root, try setting browser.noSandbox: true.");
	const headlessMode = resolveManagedBrowserHeadlessMode(params.resolved, params.profile, params.launchOptions);
	if ((params.stderrSignals?.missingDisplay ?? CHROME_MISSING_DISPLAY_PATTERN.test(params.stderrOutput)) && !headlessMode.headless) hints.push("No DISPLAY/X server was detected. Set OPENCLAW_BROWSER_HEADLESS=1, remove the headed override, start Xvfb, or run the Gateway in a desktop session.");
	if (params.stderrSignals?.singletonInUse ?? CHROME_SINGLETON_IN_USE_PATTERN.test(params.stderrOutput)) hints.push(`The Chromium profile "${params.profile.name}" is locked. Stop the existing browser or remove stale Singleton* lock files under ~/.openclaw/browser/${params.profile.name}/user-data.`);
	return hints.length > 0 ? `\nHint: ${hints.join("\nHint: ")}` : "";
}
/** A managed child survived bounded cancellation and remains actor-owned for retry. */
var ManagedChromeCleanupError = class extends Error {
	constructor(message, running) {
		super(message);
		this.running = running;
		this.code = "MANAGED_CHROME_CLEANUP_FAILED";
		this.name = "ManagedChromeCleanupError";
	}
};
function resolveBrowserExecutable(resolved, profile) {
	return resolveBrowserExecutableForPlatform({
		...resolved,
		executablePath: profile.executablePath ?? resolved.executablePath
	}, process.platform);
}
/** Resolve the user-data-dir path for a managed OpenClaw Chrome profile. */
function resolveOpenClawUserDataDir(profileName = DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME) {
	return path.join(CONFIG_DIR, "browser", profileName, "user-data");
}
function cdpUrlForPort(cdpPort) {
	return `http://127.0.0.1:${cdpPort}`;
}
/** Build Chrome launch arguments for the managed OpenClaw browser. */
function buildOpenClawChromeLaunchArgs(params) {
	const { resolved, profile, userDataDir } = params;
	const platform = params.platform ?? process.platform;
	const headlessMode = resolveManagedBrowserHeadlessMode(resolved, profile, params);
	const args = [
		`--remote-debugging-port=${profile.cdpPort}`,
		`--user-data-dir=${userDataDir}`,
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-sync",
		"--disable-background-networking",
		"--disable-component-update",
		"--disable-features=Translate,MediaRouter",
		"--disable-session-crashed-bubble",
		"--hide-crash-restore-bubble",
		"--password-store=basic"
	];
	if (platform === "darwin" && params.useMockKeychain) args.push("--use-mock-keychain");
	if (headlessMode.headless) {
		args.push("--headless=new");
		args.push("--disable-gpu");
	}
	if (resolved.noSandbox) args.push("--no-sandbox");
	if (platform === "linux") args.push("--disable-dev-shm-usage");
	if (!hasChromeProxyControlArg(resolved.extraArgs)) args.push("--no-proxy-server");
	if (resolved.extraArgs.length > 0) args.push(...resolved.extraArgs);
	return args;
}
async function canOpenWebSocket(url, timeoutMs, lookup, signal) {
	try {
		return await withCdpSocket(url, async () => true, {
			handshakeTimeoutMs: timeoutMs,
			handshakeRetries: 0,
			lookup,
			signal
		});
	} catch {
		signal?.throwIfAborted();
		return false;
	}
}
/** Return true when a Chrome CDP endpoint is reachable over HTTP. */
async function isChromeReachable(cdpUrl, timeoutMs = 500, ssrfPolicy, signal) {
	signal?.throwIfAborted();
	try {
		const configuredPin = await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
		signal?.throwIfAborted();
		if (isDirectCdpWebSocketEndpoint(cdpUrl)) return await canOpenWebSocket(cdpUrl, timeoutMs, configuredPin?.lookup, signal);
		if (await fetchChromeVersion(isWebSocketUrl(cdpUrl) ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl) : cdpUrl, timeoutMs, ssrfPolicy, signal)) return true;
		if (isWebSocketUrl(cdpUrl)) return await canOpenWebSocket(cdpUrl, timeoutMs, configuredPin?.lookup, signal);
		return false;
	} catch {
		signal?.throwIfAborted();
		return false;
	}
}
async function fetchChromeVersion(cdpUrl, timeoutMs = 500, ssrfPolicy, signal) {
	try {
		return await readChromeVersionWithCredentialFallback(cdpUrl, timeoutMs, ssrfPolicy, signal);
	} catch {
		signal?.throwIfAborted();
		return null;
	}
}
/** Resolve a usable Chrome DevTools WebSocket endpoint from a CDP endpoint. */
async function getChromeWebSocketEndpoint(cdpUrl, timeoutMs = 500, ssrfPolicy, signal) {
	signal?.throwIfAborted();
	const configuredPin = await assertCdpEndpointAllowed(cdpUrl, ssrfPolicy);
	signal?.throwIfAborted();
	const cdpControlPolicy = scopeCdpPolicyToConfiguredEndpoint(cdpUrl, ssrfPolicy);
	if (isDirectCdpWebSocketEndpoint(cdpUrl)) return {
		url: cdpUrl,
		lookup: configuredPin?.lookup
	};
	const discoveryUrl = isWebSocketUrl(cdpUrl) ? normalizeCdpHttpBaseForJsonEndpoints(cdpUrl) : cdpUrl;
	const version = await fetchChromeVersion(discoveryUrl, timeoutMs, cdpControlPolicy, signal);
	const wsUrl = normalizeOptionalString(version?.webSocketDebuggerUrl) ?? "";
	if (!wsUrl) {
		if (isWebSocketUrl(cdpUrl)) return {
			url: cdpUrl,
			lookup: configuredPin?.lookup
		};
		return null;
	}
	const normalizedWsUrl = normalizeCdpWsUrl(wsUrl, discoveryUrl);
	const discoveredPin = await assertCdpEndpointAllowed(normalizedWsUrl, cdpControlPolicy, {
		source: "discovered",
		configuredUrl: cdpUrl
	});
	signal?.throwIfAborted();
	return {
		url: normalizedWsUrl,
		lookup: discoveredPin?.lookup
	};
}
/** Return true when a Chrome CDP endpoint has a healthy WebSocket command path. */
async function isChromeCdpReady(cdpUrl, timeoutMs = 500, handshakeTimeoutMs = 800, ssrfPolicy, options) {
	const diagnostic = await diagnoseChromeCdp(cdpUrl, timeoutMs, handshakeTimeoutMs, ssrfPolicy, options?.signal);
	options?.signal?.throwIfAborted();
	if (!diagnostic.ok) log.debug(formatChromeCdpDiagnostic(diagnostic));
	await options?.onDiagnostic?.(diagnostic);
	options?.signal?.throwIfAborted();
	return diagnostic.ok;
}
async function waitForManagedLaunchPoll(delayMs, signal) {
	signal?.throwIfAborted();
	try {
		await setTimeout$1(delayMs, void 0, signal ? { signal } : void 0);
	} catch (err) {
		signal?.throwIfAborted();
		throw err;
	}
}
/** Launch or attach to the managed OpenClaw Chrome profile. */
async function launchOpenClawChrome(resolved, profile, launchOptions = {}) {
	const { signal, ...headlessOptions } = launchOptions;
	signal?.throwIfAborted();
	if (!profile.cdpIsLoopback) throw new Error(`Profile "${profile.name}" is remote; cannot launch local Chrome.`);
	const headlessMode = resolveManagedBrowserHeadlessMode(resolved, profile, headlessOptions);
	const missingDisplayError = getManagedBrowserMissingDisplayError(resolved, profile, headlessOptions);
	if (missingDisplayError) throw new BrowserProfileUnavailableError(missingDisplayError.message, { metadata: {
		reason: BROWSER_ERROR_REASONS.noDisplayForHeadedProfile,
		details: {
			profile: profile.name,
			requestedHeadless: false,
			headlessSource: missingDisplayError.headlessSource,
			displayPresent: false
		}
	} });
	try {
		assertManagedProxyAllowsCdpUrl(profile.cdpUrl);
	} catch (err) {
		throw new BrowserProfileUnavailableError(`Browser profile "${profile.name}" cannot launch: ${err instanceof Error ? err.message : String(err)}`);
	}
	const userDataDir = resolveOpenClawUserDataDir(profile.name);
	await ensureManagedChromePortAvailable(resolved, profile, userDataDir, signal);
	signal?.throwIfAborted();
	const lock = readSingletonLockTarget(userDataDir);
	const lockReason = unverifiedSingletonLockReason(lock);
	if (lockReason || lock.status === "owner" && isPidAlive(lock.pid)) throw new BrowserProfileUnavailableError(`Cannot start browser profile "${profile.name}": ${lockReason ?? "Chromium still holds its profile lock"}. Close the browser using this profile and check its lock before retrying.`);
	const exe = resolveBrowserExecutable(resolved, profile);
	if (!exe) throw new Error("No supported browser found (Chrome/Brave/Edge/Chromium on macOS, Linux, or Windows).");
	fs.mkdirSync(userDataDir, { recursive: true });
	await ensureOutputDirectory(DEFAULT_DOWNLOAD_DIR);
	const localStatePath = path.join(userDataDir, "Local State");
	const preferencesPath = path.join(userDataDir, "Default", "Preferences");
	const profileIsNew = !fs.existsSync(localStatePath);
	const needsBootstrap = profileIsNew || !fs.existsSync(preferencesPath);
	const useMockKeychain = process.platform === "darwin" && (usesOpenClawMockKeychain(userDataDir) || profileIsNew && headlessMode.headless);
	const needsDecorate = !isProfileDecorated(userDataDir, profile.name, (profile.color ?? "#FF4500").toUpperCase(), DEFAULT_DOWNLOAD_DIR);
	const spawnOnce = async (onStderr) => {
		signal?.throwIfAborted();
		const args = buildOpenClawChromeLaunchArgs({
			resolved,
			profile,
			userDataDir,
			...headlessOptions,
			useMockKeychain
		});
		const env = {
			...omitChromeProxyEnv(process.env),
			HOME: os.homedir()
		};
		if (process.platform === "linux") {
			const chromiumStateDir = path.join(resolvePreferredOpenClawTmpDir(), ".chromium");
			env.XDG_CONFIG_HOME ??= chromiumStateDir;
			env.XDG_CACHE_HOME ??= chromiumStateDir;
		}
		const preparedSpawn = prepareOomScoreAdjustedSpawn(exe.path, args, { env });
		const proc = spawn(preparedSpawn.command, preparedSpawn.args, {
			stdio: [
				"ignore",
				"ignore",
				"pipe"
			],
			env: preparedSpawn.env
		});
		const onAbort = () => {
			try {
				proc.kill("SIGKILL");
			} catch {}
		};
		signal?.addEventListener("abort", onAbort, { once: true });
		if (signal?.aborted) onAbort();
		proc.on("error", (err) => {
			log.debug(`managed Chrome process error: ${redactToolPayloadText(String(err))}`);
		});
		if (onStderr) proc.stderr?.on("data", onStderr);
		if (proc.pid == null) try {
			await once(proc, "spawn");
		} catch (err) {
			signal?.removeEventListener("abort", onAbort);
			if (onStderr) proc.stderr?.off("data", onStderr);
			throw err;
		}
		const pid = proc.pid;
		if (pid == null) {
			signal?.removeEventListener("abort", onAbort);
			if (onStderr) proc.stderr?.off("data", onStderr);
			throw new Error("Managed Chrome process spawned without a pid.");
		}
		return {
			pid,
			proc,
			releaseAbort: () => signal?.removeEventListener("abort", onAbort)
		};
	};
	const startedAt = Date.now();
	const runningForProcess = (proc, pid) => ({
		pid,
		exe,
		userDataDir,
		cdpPort: profile.cdpPort,
		startedAt,
		proc,
		headless: headlessMode.headless,
		headlessSource: headlessMode.source
	});
	if (needsBootstrap) {
		const { pid: bootstrapPid, proc: bootstrap, releaseAbort } = await spawnOnce();
		let bootstrapError;
		try {
			const deadline = Date.now() + CHROME_BOOTSTRAP_PREFS_TIMEOUT_MS;
			while (Date.now() < deadline) {
				signal?.throwIfAborted();
				if (fs.existsSync(localStatePath) && fs.existsSync(preferencesPath)) break;
				await waitForManagedLaunchPoll(100, signal);
			}
		} catch (err) {
			bootstrapError = err instanceof Error ? err : new Error("Managed Chrome bootstrap failed.", { cause: err });
		}
		let exited = await signalChromeProcess(bootstrap, "SIGTERM", CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
		if (!exited) exited = await signalChromeProcess(bootstrap, "SIGKILL", CHROME_BOOTSTRAP_EXIT_TIMEOUT_MS);
		releaseAbort();
		if (!exited) throw new ManagedChromeCleanupError(`Managed Chrome bootstrap ${bootstrapPid} survived cleanup.`, runningForProcess(bootstrap, bootstrapPid));
		if (bootstrapError) throw bootstrapError;
	}
	signal?.throwIfAborted();
	if (needsDecorate) try {
		decorateOpenClawProfile(userDataDir, {
			name: profile.name,
			color: profile.color,
			downloadDir: DEFAULT_DOWNLOAD_DIR,
			mockKeychain: useMockKeychain
		});
		log.info(`🦞 openclaw browser profile decorated (${profile.color})`);
	} catch (err) {
		log.warn(`openclaw browser profile decoration failed: ${String(err)}`);
	}
	try {
		ensureProfileNetworkPredictionDisabled(userDataDir);
	} catch (err) {
		log.warn(`openclaw browser network-prediction prefs failed: ${String(err)}`);
	}
	try {
		ensureProfileCleanExit(userDataDir);
	} catch (err) {
		log.warn(`openclaw browser clean-exit prefs failed: ${String(err)}`);
	}
	signal?.throwIfAborted();
	const launchOnceAndWait = async (allowSingletonRecovery) => {
		const stderrDiagnostics = createChromeLaunchStderrDiagnostics(CHROME_LAUNCH_STDERR_TAIL_MAX_BYTES);
		const onStderr = (chunk) => {
			stderrDiagnostics.append(chunk);
		};
		let proc;
		let releaseSpawnAbort;
		try {
			const spawned = await spawnOnce(onStderr);
			proc = spawned.proc;
			releaseSpawnAbort = spawned.releaseAbort;
			const readyDeadline = Date.now() + (resolved.localLaunchTimeoutMs ?? CHROME_LAUNCH_READY_WINDOW_MS);
			let launchHttpReachable = false;
			while (Date.now() < readyDeadline) {
				signal?.throwIfAborted();
				if (await isChromeReachable(profile.cdpUrl, 1500, void 0, signal)) {
					launchHttpReachable = true;
					break;
				}
				await waitForManagedLaunchPoll(200, signal);
			}
			if (!launchHttpReachable) {
				signal?.throwIfAborted();
				let finalDiagnostic = null;
				let diagnosticErrorText = null;
				try {
					finalDiagnostic = await diagnoseChromeCdp(profile.cdpUrl, MANAGED_CDP_READY_HTTP_TIMEOUT_MS, 800, void 0, signal);
				} catch (err) {
					diagnosticErrorText = `CDP diagnostic failed: ${safeChromeCdpErrorMessage(err)}.`;
				}
				signal?.throwIfAborted();
				if (diagnosticShowsChromeHttpDiscovery(finalDiagnostic)) launchHttpReachable = true;
				const diagnosticText = finalDiagnostic ? formatChromeCdpDiagnostic(finalDiagnostic) : diagnosticErrorText ?? "CDP diagnostic failed.";
				if (launchHttpReachable) log.debug(diagnosticText);
				else {
					const stderrOutput = normalizeOptionalString(stderrDiagnostics.toString()) ?? "";
					const stderrSignals = stderrDiagnostics.signals();
					const redactedStderrOutput = redactToolPayloadText(stderrOutput);
					if (allowSingletonRecovery && stderrSignals.singletonInUse && clearStaleChromeSingletonLocks(userDataDir)) {
						log.warn(`Removed stale Chromium Singleton* locks for profile "${profile.name}" and retrying launch.`);
						if (!await terminateChromeForRetry(proc, userDataDir)) throw new ManagedChromeCleanupError(`Managed Chrome process ${spawned.pid} survived singleton recovery.`, runningForProcess(proc, spawned.pid));
						releaseSpawnAbort();
						releaseSpawnAbort = void 0;
						return await launchOnceAndWait(false);
					}
					const stderrHint = redactedStderrOutput ? `\nChrome stderr:\n${sliceUtf16Safe(redactedStderrOutput, -CHROME_STDERR_HINT_MAX_CHARS)}` : "";
					const launchHints = chromeLaunchHints({
						stderrOutput,
						stderrSignals,
						resolved,
						profile,
						launchOptions: headlessOptions
					});
					try {
						proc.kill("SIGKILL");
					} catch {}
					throw new Error(`Failed to start Chrome CDP on port ${profile.cdpPort} for profile "${profile.name}". ${diagnosticText}${launchHints}${stderrHint}`);
				}
			}
			signal?.throwIfAborted();
			const pid = spawned.pid;
			log.info(`🦞 openclaw browser started (${exe.kind}) profile "${profile.name}" on 127.0.0.1:${profile.cdpPort} (pid ${pid})`);
			return runningForProcess(proc, pid);
		} catch (err) {
			if (proc) {
				const pid = proc.pid;
				if (!await signalChromeProcess(proc, "SIGKILL", 5e3) && typeof pid === "number") throw new ManagedChromeCleanupError(`Managed Chrome process ${pid} survived launch cleanup.`, runningForProcess(proc, pid));
			}
			if (err instanceof ManagedChromeCleanupError) {
				if (err.running.proc !== proc) throw err;
				throw new Error(`${err.message} Exact child cleanup succeeded on retry.`, { cause: err });
			}
			throw err;
		} finally {
			releaseSpawnAbort?.();
			proc?.stderr?.off("data", onStderr);
			stderrDiagnostics.clear();
		}
	};
	return await launchOnceAndWait(true);
}
function cdpBrowserProcessId(result) {
	if (!result || typeof result !== "object" || !("processInfo" in result)) return null;
	const processInfo = result.processInfo;
	if (!Array.isArray(processInfo)) return null;
	return processInfo.find((entry) => {
		const process = entry;
		return process?.type === "browser" && typeof process.id === "number" && Number.isSafeInteger(process.id) && process.id > 0;
	})?.id ?? null;
}
function processCommandUsesHeadlessChrome(command) {
	return (command.argv ?? command.text.split(/\s+/)).some((arg) => /^['"]?--headless(?:=.*)?['"]?$/i.test(arg)) || /(?:^|[\\/])(?:chrome-headless-shell|headless_shell)(?=\s|$|["'])/i.test(command.text);
}
/** Read the mode of a browser process proven to own this host's loopback CDP port. */
async function inspectLocalChromeHeadlessMode(params) {
	params.signal?.throwIfAborted();
	if (!params.profile.cdpIsLoopback) return;
	try {
		const timeoutMs = Math.max(1, Math.min(params.timeoutMs, 800));
		const directEndpoint = isDirectCdpWebSocketEndpoint(params.profile.cdpUrl) && params.browserWebSocketUrl === params.profile.cdpUrl;
		const policy = directEndpoint ? params.ssrfPolicy : scopeCdpPolicyToConfiguredEndpoint(params.profile.cdpUrl, params.ssrfPolicy);
		const pin = await assertCdpEndpointAllowed(params.browserWebSocketUrl, policy, directEndpoint ? void 0 : {
			source: "discovered",
			configuredUrl: params.profile.cdpUrl
		});
		params.signal?.throwIfAborted();
		const result = await withCdpSocket(params.browserWebSocketUrl, async (send) => await send("SystemInfo.getProcessInfo"), {
			commandTimeoutMs: timeoutMs,
			handshakeRetries: 0,
			handshakeTimeoutMs: timeoutMs,
			lookup: pin?.lookup,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		const pid = cdpBrowserProcessId(result);
		if (!pid || !isPidAlive(pid) || !pidListensOnPort(pid, params.profile.cdpPort)) return;
		const command = readManagedProcessCommandLine(pid);
		if (!command || !processCommandHasFlag(command, "remote-debugging-port", String(params.profile.cdpPort))) return;
		return processCommandUsesHeadlessChrome(command);
	} catch {
		params.signal?.throwIfAborted();
		return;
	}
}
/** Verify that a managed CDP endpoint belongs to the exact spawned browser pid. */
async function isChromeCdpOwnedByPid(cdpUrl, pid, timeoutMs, ssrfPolicy, signal) {
	signal?.throwIfAborted();
	try {
		const endpoint = await getChromeWebSocketEndpoint(cdpUrl, timeoutMs, ssrfPolicy, signal);
		if (!endpoint) return false;
		const owned = await withCdpSocket(endpoint.url, async (send) => {
			signal?.throwIfAborted();
			return cdpBrowserProcessId(await send("SystemInfo.getProcessInfo")) === pid;
		}, {
			commandTimeoutMs: timeoutMs,
			handshakeRetries: 0,
			handshakeTimeoutMs: timeoutMs,
			lookup: endpoint.lookup,
			signal
		});
		signal?.throwIfAborted();
		return owned;
	} catch {
		signal?.throwIfAborted();
		return false;
	}
}
async function requestGracefulChromeClose(running, timeoutMs, ssrfPolicy, ownsCurrentProcess) {
	const commandTimeoutMs = Math.max(1, Math.min(timeoutMs, CHROME_GRACEFUL_CLOSE_COMMAND_TIMEOUT_MS));
	let commandSent = false;
	try {
		const endpoint = await getChromeWebSocketEndpoint(cdpUrlForPort(running.cdpPort), Math.min(commandTimeoutMs, 200), ssrfPolicy);
		if (!endpoint) return false;
		await withCdpSocket(endpoint.url, async (send) => {
			if (cdpBrowserProcessId(await send("SystemInfo.getProcessInfo")) !== running.pid || ownsCurrentProcess && !ownsCurrentProcess()) return;
			commandSent = true;
			await send("Browser.close");
		}, {
			commandTimeoutMs,
			handshakeTimeoutMs: commandTimeoutMs,
			handshakeRetries: 0,
			lookup: endpoint.lookup
		});
		return commandSent;
	} catch (err) {
		log.debug(`Chrome graceful close skipped: ${safeChromeCdpErrorMessage(err)}`);
		return commandSent;
	}
}
/** Stop only the exact managed Chrome owned by this profile across runtimes. */
async function stopOwnedOpenClawChrome(resolved, profile, timeoutMs = CHROME_STOP_TIMEOUT_MS) {
	if (!profile.cdpIsLoopback || profile.attachOnly || profile.driver !== "openclaw") return { status: "not-running" };
	const userDataDir = resolveOpenClawUserDataDir(profile.name);
	const lock = readSingletonLockTarget(userDataDir);
	const lockReason = unverifiedSingletonLockReason(lock);
	if (lockReason) return {
		status: "unverified",
		reason: lockReason
	};
	if (lock.status !== "owner" || !isPidAlive(lock.pid)) return { status: "not-running" };
	const pid = lock.pid;
	let exe;
	try {
		exe = resolveBrowserExecutable(resolved, profile);
	} catch {
		return {
			status: "unverified",
			reason: "Managed browser executable could not be resolved"
		};
	}
	if (!exe) return {
		status: "unverified",
		reason: "Managed browser executable is unavailable"
	};
	const identity = readOwnedManagedChromeIdentity({
		pid,
		exe,
		profile,
		userDataDir
	});
	if (!identity) return {
		status: "unverified",
		reason: "The active Chromium profile owner could not be verified"
	};
	if (!(await requestGracefulChromeClose({
		pid,
		cdpPort: profile.cdpPort
	}, timeoutMs, resolved.ssrfPolicy, () => {
		const current = readOwnedManagedChromeIdentity({
			pid,
			exe,
			profile,
			userDataDir
		});
		return current !== null && sameManagedChromeIdentity(identity, current);
	}) && await waitForPidExit(pid, timeoutMs)) && isPidAlive(pid) && !await terminateOwnedStaleChromeProcess({
		identity,
		exe,
		profile,
		userDataDir
	}, timeoutMs)) return {
		status: "unverified",
		reason: "The Chromium profile owner changed or did not stop"
	};
	clearRecoveredChromeSingletonArtifacts(userDataDir, pid, lock.hostname);
	const remaining = readSingletonLockTarget(userDataDir);
	const remainingReason = unverifiedSingletonLockReason(remaining);
	if (remainingReason) return {
		status: "unverified",
		reason: remainingReason
	};
	if (remaining.status === "owner" && isPidAlive(remaining.pid)) return {
		status: "unverified",
		reason: "Chromium still holds the profile lock"
	};
	return { status: "stopped" };
}
/** Stop a managed Chrome process and wait for shutdown. */
async function stopOpenClawChrome(running, timeoutMs = CHROME_STOP_TIMEOUT_MS) {
	const proc = running.proc;
	if (proc.exitCode != null || proc.signalCode != null) return;
	if (await requestGracefulChromeClose(running, timeoutMs) && await waitForChromeProcessExit(proc, timeoutMs)) return;
	if (await signalChromeProcess(proc, "SIGTERM", timeoutMs)) return;
	if (!await signalChromeProcess(proc, "SIGKILL", timeoutMs)) throw new ManagedChromeCleanupError(`Managed Chrome process ${running.pid} survived shutdown.`, running);
}
//#endregion
export { STRUCTURAL_ROLES as A, waitForCdpCommittedNavigationUrl as B, buildRoleSnapshotFromAiSnapshot as C, parseRoleRef as D, getRoleSnapshotIdentityKeys as E, assertBrowserNavigationResultAllowed as F, parseBrowserNavigationUrl as I, requiresInspectableBrowserNavigationRedirectsForUrl as L, InvalidBrowserNavigationUrlError as M, assertBrowserNavigationAllowed as N, CONTENT_ROLES as O, assertBrowserNavigationRedirectChainAllowed as P, withBrowserNavigationPolicy as R, appendSnapshotUrls as S, findRoleSnapshotLineRef as T, resolveBrowserNavigationProxyMode as V, formatAriaSnapshot as _, isChromeCdpReady as a, snapshotRoleViaCdp as b, resolveOpenClawUserDataDir as c, usesOpenClawMockKeychain as d, diagnoseChromeCdp as f, createTargetViaCdp as g, captureScreenshot as h, isChromeCdpOwnedByPid as i, appendRoleSnapshotDepthTruncationMarker as j, INTERACTIVE_ROLES as k, stopOpenClawChrome as l, AX_REF_PATTERN as m, getChromeWebSocketEndpoint as n, isChromeReachable as o, formatChromeCdpDiagnostic as p, inspectLocalChromeHeadlessMode as r, launchOpenClawChrome as s, ManagedChromeCleanupError as t, stopOwnedOpenClawChrome as u, getDocumentIdentitiesViaCdp as v, finalizeRoleSnapshot as w, snapshotRoleViaCdpSession as x, snapshotAria as y, readCdpDocumentIdentities as z };
