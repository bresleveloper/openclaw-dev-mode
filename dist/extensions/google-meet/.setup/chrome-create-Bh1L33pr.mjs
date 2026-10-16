import { r as GoogleMeetBrowserManualActionError, t as GOOGLE_MEET_BROWSER_NODE_ADAPTER } from "./google-meet-platform-constants-CnRfrYX7.mjs";
import { asFiniteNumber, asOptionalObjectRecord, asRecord, filterStringEntries, readStringValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { asMeetingBrowserTabs, callMeetingBrowserProxyOnNode, readMeetingBrowserTab, resolveMeetingBrowserNode, resolveMeetingBrowserNodeInfo } from "openclaw/plugin-sdk/meeting-runtime";
import { sleep } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/google-meet/src/transports/chrome-browser-proxy.ts
async function resolveChromeNodeInfo(params) {
	return await resolveMeetingBrowserNodeInfo({
		...params,
		adapter: GOOGLE_MEET_BROWSER_NODE_ADAPTER
	});
}
async function resolveChromeNode(params) {
	return await resolveMeetingBrowserNode({
		...params,
		adapter: GOOGLE_MEET_BROWSER_NODE_ADAPTER
	});
}
async function callBrowserProxyOnNode(params) {
	return await callMeetingBrowserProxyOnNode({
		...params,
		adapter: GOOGLE_MEET_BROWSER_NODE_ADAPTER
	});
}
//#endregion
//#region extensions/google-meet/src/transports/google-meet-urls.ts
function forceMeetEnglishUi(url) {
	try {
		const parsed = new URL(url);
		parsed.searchParams.set("hl", "en");
		return parsed.toString();
	} catch {
		return url;
	}
}
function normalizeMeetUrlForReuse(url) {
	if (!url) return;
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" || parsed.hostname.toLowerCase() !== "meet.google.com") return;
		const match = parsed.pathname.match(/^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:\/)?$/i);
		if (!match?.[1]) return;
		return `https://meet.google.com/${match[1].toLowerCase()}`;
	} catch {
		return;
	}
}
function isSameMeetUrlForReuse(a, b) {
	const normalizedA = normalizeMeetUrlForReuse(a);
	const normalizedB = normalizeMeetUrlForReuse(b);
	return Boolean(normalizedA && normalizedB && normalizedA === normalizedB);
}
function isEnglishMeetTab(url) {
	if (!url) return false;
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === "meet.google.com" && parsed.searchParams.get("hl")?.toLowerCase() === "en";
	} catch {
		return false;
	}
}
function readMeetAuthUser(url) {
	if (!url) return;
	try {
		return new URL(url).searchParams.get("authuser") ?? void 0;
	} catch {
		return;
	}
}
function isRecoverableMeetTab(tab, url) {
	if (url) return isSameMeetUrlForReuse(tab.url, url);
	if (normalizeMeetUrlForReuse(tab.url)) return true;
	return (tab.url ?? "").startsWith("https://accounts.google.com/") && /sign in|google accounts|meet/i.test(tab.title ?? "");
}
//#endregion
//#region extensions/google-meet/src/transports/chrome-create.ts
const GOOGLE_MEET_NEW_URL = "https://meet.google.com/new";
const GOOGLE_MEET_BROWSER_CREATE_TIMEOUT_MS = 6e4;
const GOOGLE_MEET_BROWSER_STEP_TIMEOUT_MS = 1e4;
const GOOGLE_MEET_BROWSER_NAVIGATION_RETRY_MS = 1e3;
const GOOGLE_MEET_BROWSER_POLL_MS = 500;
function formatBrowserAutomationError(error) {
	if (error instanceof Error) return error.message;
	try {
		return JSON.stringify(error);
	} catch {
		return "unknown error";
	}
}
function isBrowserNavigationInterruption(error) {
	return /execution context was destroyed|navigation|target closed/i.test(formatBrowserAutomationError(error));
}
function isGoogleMeetCreateTab(tab) {
	const url = tab.url ?? "";
	if (/^https:\/\/meet\.google\.com\/(?:new|[a-z]{3}-[a-z]{4}-[a-z]{3})(?:$|[/?#])/i.test(url)) return true;
	return url.startsWith("https://accounts.google.com/") && /sign in|google accounts|meet/i.test(tab.title ?? "");
}
function readBrowserManualAction(value) {
	const action = asRecord(value);
	return typeof action.reason === "string" && typeof action.message === "string" ? {
		reason: action.reason,
		message: action.message
	} : void 0;
}
function readBrowserCreateResult(result) {
	const record = asRecord(result);
	const nested = asOptionalObjectRecord(record.result) ?? record;
	return {
		meetingUri: readStringValue(nested.meetingUri),
		browserUrl: readStringValue(nested.browserUrl),
		browserTitle: readStringValue(nested.browserTitle),
		manualAction: readBrowserManualAction(nested.manualAction),
		notes: Array.isArray(nested.notes) ? filterStringEntries(nested.notes) : void 0,
		retryAfterMs: asFiniteNumber(nested.retryAfterMs)
	};
}
const CREATE_MEET_FROM_BROWSER_SCRIPT = `async () => {
  const meetUrlPattern = /^https:\\/\\/meet\\.google\\.com\\/[a-z]{3}-[a-z]{4}-[a-z]{3}(?:$|[/?#])/i;
  const text = (node) => (node?.innerText || node?.textContent || "").trim();
  const current = () => location.href;
  const notes = [];
  const manualActionFor = (reason, message, browserUrl = current()) => ({
    manualAction: { reason, message },
    browserUrl,
    browserTitle: document.title,
    notes,
  });
  const findButton = (pattern) =>
    [...document.querySelectorAll("button")].find((button) => {
      const label = [
        button.getAttribute("aria-label"),
        button.getAttribute("data-tooltip"),
        text(button),
      ]
        .filter(Boolean)
        .join(" ");
      return pattern.test(label) && !button.disabled;
    });
  const clickButton = (pattern, note) => {
    const button = findButton(pattern);
    if (!button) {
      return false;
    }
    button.click();
    notes.push(note);
    return true;
  };
  if (!current().startsWith("https://meet.google.com/")) {
    return manualActionFor("google-login-required", "Sign in to Google in the OpenClaw browser profile, then retry meeting creation.");
  }
  const href = current();
  if (meetUrlPattern.test(href)) {
    // The /new redirect keeps the hl=en param we open with; strip query/hash so the
    // meeting link handed to users stays canonical instead of forcing English on them.
    return { meetingUri: href.split(/[?#]/)[0], browserUrl: href, browserTitle: document.title, notes };
  }
  const pageText = text(document.body);
  if (
    clickButton(/\\buse microphone\\b/i, "Accepted Meet microphone prompt with browser automation.") ||
    clickButton(
      /continue without microphone/i,
      "Continued through Meet microphone prompt with browser automation.",
    )
  ) {
    return { browserUrl: href, browserTitle: document.title, notes, retryAfterMs: 1000 };
  }
  if (/do you want people to hear you in the meeting/i.test(pageText)) {
    return manualActionFor("meet-audio-choice-required", "Meet is showing the microphone choice. Click Use microphone in the OpenClaw browser profile, then retry meeting creation.", href);
  }
  if (/allow.*(microphone|camera)|blocked.*(microphone|camera)|permission.*(microphone|camera)/i.test(pageText)) {
    return manualActionFor("meet-permission-required", "Allow microphone/camera permissions for Meet in the OpenClaw browser profile, then retry meeting creation.", href);
  }
  if (/couldn't create|unable to create/i.test(pageText)) {
    return manualActionFor("browser-control-unavailable", "Resolve the Google Meet page prompt in the OpenClaw browser profile, then retry meeting creation.", href);
  }
  if (location.hostname.toLowerCase() === "accounts.google.com" || /use your google account|to continue to google meet|choose an account|sign in to (join|continue)/i.test(pageText)) {
    return manualActionFor("google-login-required", "Sign in to Google in the OpenClaw browser profile, then retry meeting creation.", href);
  }
  return {
    retryAfterMs: 500,
    browserUrl: current(),
    browserTitle: document.title,
    notes,
  };
}`;
async function createMeetWithBrowserProxyOnNode(params) {
	const nodeId = await resolveChromeNode({
		runtime: params.runtime,
		requestedNode: params.config.chromeNode.node
	});
	const timeoutMs = Math.max(GOOGLE_MEET_BROWSER_CREATE_TIMEOUT_MS, params.config.chrome.joinTimeoutMs);
	const stepTimeoutMs = Math.min(timeoutMs, GOOGLE_MEET_BROWSER_STEP_TIMEOUT_MS);
	let openedByPlugin = false;
	let tab = asMeetingBrowserTabs(await callBrowserProxyOnNode({
		runtime: params.runtime,
		nodeId,
		method: "GET",
		path: "/tabs",
		timeoutMs: stepTimeoutMs
	})).find(isGoogleMeetCreateTab);
	if (tab?.targetId) {
		await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: "POST",
			path: "/tabs/focus",
			body: { targetId: tab.targetId },
			timeoutMs: stepTimeoutMs
		});
		const reusedUrl = tab.url ?? "";
		const englishUrl = (/^https:\/\/meet\.google\.com\/new(?:$|[/?#])/i.test(reusedUrl) || reusedUrl.startsWith("https://accounts.google.com/")) && reusedUrl ? forceMeetEnglishUi(reusedUrl) : void 0;
		if (englishUrl && englishUrl !== reusedUrl) tab = readMeetingBrowserTab(await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: "POST",
			path: "/navigate",
			body: {
				targetId: tab.targetId,
				url: englishUrl
			},
			timeoutMs: stepTimeoutMs
		})) ?? tab;
	} else {
		tab = readMeetingBrowserTab(await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: "POST",
			path: "/tabs/open",
			body: { url: forceMeetEnglishUi(GOOGLE_MEET_NEW_URL) },
			timeoutMs: stepTimeoutMs
		}));
		openedByPlugin = Boolean(tab?.targetId);
	}
	const targetId = tab?.targetId;
	if (!targetId) throw new Error("Browser fallback opened Google Meet but did not return a targetId.");
	const notes = /* @__PURE__ */ new Set();
	let lastResult;
	let lastError;
	const deadline = Date.now() + timeoutMs;
	while (Date.now() <= deadline) try {
		const result = readBrowserCreateResult(await callBrowserProxyOnNode({
			runtime: params.runtime,
			nodeId,
			method: "POST",
			path: "/act",
			body: {
				kind: "evaluate",
				targetId,
				fn: CREATE_MEET_FROM_BROWSER_SCRIPT
			},
			timeoutMs: stepTimeoutMs
		}));
		lastResult = result;
		for (const note of result.notes ?? []) notes.add(note);
		if (result.meetingUri) return {
			source: "browser",
			nodeId,
			targetId,
			openedByPlugin,
			meetingUri: result.meetingUri,
			browserUrl: result.browserUrl,
			browserTitle: result.browserTitle,
			notes: [...notes]
		};
		if (result.manualAction) throw new GoogleMeetBrowserManualActionError({
			manualAction: result.manualAction,
			browser: {
				nodeId,
				targetId,
				browserUrl: result.browserUrl,
				browserTitle: result.browserTitle,
				notes: [...notes]
			}
		});
		await sleep(result.retryAfterMs ?? GOOGLE_MEET_BROWSER_POLL_MS);
	} catch (error) {
		lastError = error;
		if (!isBrowserNavigationInterruption(error)) throw error;
		await sleep(GOOGLE_MEET_BROWSER_NAVIGATION_RETRY_MS);
	}
	throw new Error(lastResult?.manualAction?.message ?? `Google Meet did not return a meeting URL from the browser create flow before timeout.${lastError ? ` Last browser automation error: ${formatBrowserAutomationError(lastError)}` : ""}`);
}
//#endregion
export { isSameMeetUrlForReuse as a, callBrowserProxyOnNode as c, isRecoverableMeetTab as i, resolveChromeNode as l, forceMeetEnglishUi as n, normalizeMeetUrlForReuse as o, isEnglishMeetTab as r, readMeetAuthUser as s, createMeetWithBrowserProxyOnNode as t, resolveChromeNodeInfo as u };
