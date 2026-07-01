import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import { s as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-D93_HOsR.js";
import { d as isPrivateNetworkAllowedByPolicy } from "./ssrf-DmSIVBht.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { n as redactCdpUrl } from "./browser-config-BPzc9xWq.js";
import { A as CHROME_MCP_ATTACH_READY_WINDOW_MS, C as BrowserTargetAmbiguousError, F as usesFastLoopbackCdpProbeClass, N as PROFILE_ATTACH_RETRY_TIMEOUT_MS, P as resolveCdpReachabilityTimeouts, S as BrowserTabNotFoundError, T as toBrowserErrorResponse, V as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS, a as fetchOk, b as BrowserResetUnsupportedError, i as fetchJson, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, p as withAllowedHostname, t as appendCdpPath, v as BrowserProfileNotFoundError, y as BrowserProfileUnavailableError } from "./cdp.helpers-C19acCN_.js";
import { i as resolveProfile, n as resolveBrowserConfig } from "./config-D088GH3E.js";
import "./config-rGSRaD_8.js";
import "./errors-DZViAlX5.js";
import { t as movePathToTrash } from "./trash-00aTYAZz.js";
import { n as getPwAiModule, r as getBrowserProfileCapabilities, t as resolveTargetIdFromTabs } from "./target-id-Drr50cuo.js";
import { h as listChromeMcpTabs } from "./chrome-mcp-IwziLVq6.js";
import { E as withBrowserNavigationPolicy, S as assertBrowserNavigationAllowed, T as requiresInspectableBrowserNavigationRedirectsForUrl, a as resolveOpenClawUserDataDir, b as resolveBrowserNavigationProxyMode, c as formatChromeCdpDiagnostic, d as createTargetViaCdp, i as launchOpenClawChrome, n as isChromeCdpReady, o as stopOpenClawChrome, p as normalizeCdpWsUrl, r as isChromeReachable, s as diagnoseChromeCdp, w as assertBrowserNavigationResultAllowed, x as InvalidBrowserNavigationUrlError } from "./chrome-0jrMaKKx.js";
import { t as isSelectableCdpBrowserTarget } from "./cdp-target-filter-BavCjeal.js";
import fs from "node:fs";
//#region extensions/browser/src/browser/config-refresh-source.ts
/**
* Browser runtime config refresh source.
*
* Loads the source-backed runtime config snapshot when available so long-lived
* browser routes can refresh from disk without changing config ownership.
*/
/** Load the best available config object for browser route runtime refresh. */
function loadBrowserConfigForRuntimeRefresh() {
	return getRuntimeConfigSourceSnapshot() ?? getRuntimeConfig();
}
//#endregion
//#region extensions/browser/src/browser/cdp-reachability-policy.ts
/**
* SSRF policy adjustments for Chrome DevTools Protocol reachability checks.
*
* CDP control-plane probes may target loopback even when page navigation policy
* is stricter, so this module scopes the exception to browser control only.
*/
function withCdpHostnameAllowed(profile, ssrfPolicy) {
	if (!ssrfPolicy || !profile.cdpHost) return ssrfPolicy;
	if (isPrivateNetworkAllowedByPolicy(ssrfPolicy)) return ssrfPolicy;
	return withAllowedHostname(ssrfPolicy, profile.cdpHost);
}
function resolveCdpReachabilityPolicy(profile, ssrfPolicy) {
	if (!getBrowserProfileCapabilities(profile).isRemote && profile.cdpIsLoopback && profile.driver === "openclaw") return;
	return withCdpHostnameAllowed(profile, ssrfPolicy);
}
/** Alias used by callers that treat reachability and control as one CDP policy. */
const resolveCdpControlPolicy = resolveCdpReachabilityPolicy;
//#endregion
//#region extensions/browser/src/browser/resolved-config-refresh.ts
/**
* Runtime config refresh helpers for Browser profiles that can be hot-reloaded
* without restarting the whole Browser plugin server.
*/
function changedProfileInvariants(current, next) {
	const changed = [];
	const currentUsesLocalManagedLaunch = current.driver === "openclaw" && !current.attachOnly && current.cdpIsLoopback;
	const nextUsesLocalManagedLaunch = next.driver === "openclaw" && !next.attachOnly && next.cdpIsLoopback;
	if (current.cdpUrl !== next.cdpUrl) changed.push("cdpUrl");
	if (current.cdpPort !== next.cdpPort) changed.push("cdpPort");
	if (current.driver !== next.driver) changed.push("driver");
	if (currentUsesLocalManagedLaunch && nextUsesLocalManagedLaunch && current.headless !== next.headless) changed.push("headless");
	if (currentUsesLocalManagedLaunch && nextUsesLocalManagedLaunch && current.executablePath !== next.executablePath) changed.push("executablePath");
	if (current.attachOnly !== next.attachOnly) changed.push("attachOnly");
	if (current.cdpIsLoopback !== next.cdpIsLoopback) changed.push("cdpIsLoopback");
	if ((current.userDataDir ?? "") !== (next.userDataDir ?? "")) changed.push("userDataDir");
	return changed;
}
function applyResolvedConfig(current, freshResolved) {
	current.resolved = {
		...freshResolved,
		evaluateEnabled: current.resolved.evaluateEnabled
	};
	for (const [name, runtime] of current.profiles) {
		const nextProfile = resolveProfile(freshResolved, name);
		if (nextProfile) {
			const changed = changedProfileInvariants(runtime.profile, nextProfile);
			if (changed.length > 0) {
				runtime.reconcile = {
					previousProfile: runtime.profile,
					reason: `profile invariants changed: ${changed.join(", ")}`
				};
				runtime.lastTargetId = null;
			}
			runtime.profile = nextProfile;
			continue;
		}
		runtime.reconcile = {
			previousProfile: runtime.profile,
			reason: "profile removed from config"
		};
		runtime.lastTargetId = null;
		if (!runtime.running) current.profiles.delete(name);
	}
}
/** Refreshes the Browser runtime's resolved config from disk when hot reload is enabled. */
function refreshResolvedBrowserConfigFromDisk(params) {
	if (!params.refreshConfigFromDisk) return;
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const freshResolved = resolveBrowserConfig(cfg.browser, cfg);
	applyResolvedConfig(params.current, freshResolved);
}
/** Resolves a profile after an optional cached/fresh config reload. */
function resolveBrowserProfileWithHotReload(params) {
	refreshResolvedBrowserConfigFromDisk({
		current: params.current,
		refreshConfigFromDisk: params.refreshConfigFromDisk,
		mode: "cached"
	});
	let profile = resolveProfile(params.current.resolved, params.name);
	if (profile) return profile;
	refreshResolvedBrowserConfigFromDisk({
		current: params.current,
		refreshConfigFromDisk: params.refreshConfigFromDisk,
		mode: "fresh"
	});
	profile = resolveProfile(params.current.resolved, params.name);
	return profile;
}
//#endregion
//#region extensions/browser/src/browser/chrome-mcp.runtime.ts
/** Import the Chrome MCP adapter module on demand. */
async function getChromeMcpModule() {
	return await import("./chrome-mcp-BT9CoDiq.js");
}
//#endregion
//#region extensions/browser/src/browser/server-context.constants.ts
/**
* Timing and size constants for Browser profile/tab runtime operations.
*/
const OPEN_TAB_DISCOVERY_WINDOW_MS = 2e3;
const CDP_READY_AFTER_LAUNCH_WINDOW_MS = DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS;
//#endregion
//#region extensions/browser/src/browser/server-context.lifecycle.ts
/** Resolves how an idle stop should behave for local, remote, or attach-only profiles. */
function resolveIdleProfileStopOutcome(profile) {
	const capabilities = getBrowserProfileCapabilities(profile);
	if (profile.attachOnly || capabilities.isRemote) return {
		stopped: true,
		closePlaywright: true
	};
	return {
		stopped: false,
		closePlaywright: false
	};
}
/** Closes cached Playwright CDP connections for one profile without requiring the module. */
async function closePlaywrightBrowserConnectionForProfile(cdpUrl) {
	try {
		await (await getPwAiModule({ mode: "soft" }))?.closePlaywrightBrowserConnection(cdpUrl ? { cdpUrl } : void 0);
	} catch {}
}
//#endregion
//#region extensions/browser/src/browser/server-context.availability.ts
/**
* Browser profile availability operations: reachability probes, managed Chrome
* launch/restart, Chrome MCP attach, and profile stop handling.
*/
const MANAGED_LAUNCH_FAILURE_THRESHOLD = 3;
const MANAGED_LAUNCH_COOLDOWN_BASE_MS = 3e4;
const MANAGED_LAUNCH_COOLDOWN_MAX_MS = 5 * 6e4;
function launchOptionsForEnsure(options) {
	return typeof options?.headless === "boolean" ? { headlessOverride: options.headless } : void 0;
}
function ensureOptionsKey(options) {
	return typeof options?.headless === "boolean" ? `headless:${options.headless}` : "default";
}
function formatLocalPortOwnershipHint(profile) {
	const resetHint = `If OpenClaw should own this local profile, run action=reset-profile profile=${profile.name} to stop the conflicting process.`;
	if (!profile.cdpIsLoopback) return resetHint;
	return `${resetHint} If this port is an externally managed CDP service such as Browserless, set browser.profiles.${profile.name}.attachOnly=true so OpenClaw attaches without trying to manage the local process. For Browserless Docker, set EXTERNAL to the same WebSocket endpoint OpenClaw can reach via browser.profiles.<name>.cdpUrl.`;
}
function normalizeFailureMessage(err) {
	return (err instanceof Error ? err.message : String(err)).trim() || "unknown browser launch failure";
}
function resetManagedLaunchFailure(profileState) {
	profileState.managedLaunchFailure = void 0;
}
function recordManagedLaunchFailure(profileState, err) {
	const consecutiveFailures = (profileState.managedLaunchFailure?.consecutiveFailures ?? 0) + 1;
	const exponent = Math.max(0, consecutiveFailures - MANAGED_LAUNCH_FAILURE_THRESHOLD);
	const cooldownMs = consecutiveFailures >= MANAGED_LAUNCH_FAILURE_THRESHOLD ? Math.min(MANAGED_LAUNCH_COOLDOWN_MAX_MS, MANAGED_LAUNCH_COOLDOWN_BASE_MS * 2 ** exponent) : 0;
	const now = Date.now();
	profileState.managedLaunchFailure = {
		consecutiveFailures,
		lastFailureAt: now,
		...cooldownMs > 0 ? { cooldownUntil: now + cooldownMs } : {},
		lastError: normalizeFailureMessage(err)
	};
}
function assertManagedLaunchNotCoolingDown(profileName, profileState) {
	const failure = profileState.managedLaunchFailure;
	if (!failure || failure.consecutiveFailures < MANAGED_LAUNCH_FAILURE_THRESHOLD) return;
	const remainingMs = (failure.cooldownUntil ?? 0) - Date.now();
	if (remainingMs <= 0) return;
	const retrySeconds = Math.max(1, Math.ceil(remainingMs / 1e3));
	throw new BrowserProfileUnavailableError(`Browser launch for profile "${profileName}" is cooling down after ${failure.consecutiveFailures} consecutive managed Chrome launch failures. Retry in ${retrySeconds}s after fixing Chrome startup, or set browser.enabled=false if the browser tool is not needed. Last error: ${failure.lastError}`);
}
/** Builds reachability, ensure, and stop operations for one resolved browser profile. */
function createProfileAvailability({ opts, profile, state, getProfileState, setProfileRunning }) {
	const redactedProfileCdpUrl = redactCdpUrl(profile.cdpUrl) ?? profile.cdpUrl;
	const capabilities = getBrowserProfileCapabilities(profile);
	const resolveTimeouts = (timeoutMs) => resolveCdpReachabilityTimeouts({
		profileIsLoopback: profile.cdpIsLoopback,
		attachOnly: profile.attachOnly,
		timeoutMs,
		remoteHttpTimeoutMs: state().resolved.remoteCdpTimeoutMs,
		remoteHandshakeTimeoutMs: state().resolved.remoteCdpHandshakeTimeoutMs
	});
	const getCdpReachabilityPolicy = () => resolveCdpReachabilityPolicy(profile, state().resolved.ssrfPolicy);
	const isReachable = async (timeoutMs, options) => {
		if (capabilities.usesChromeMcp) {
			const { listChromeMcpTabs } = await getChromeMcpModule();
			const callOptions = {};
			if (timeoutMs != null) callOptions.timeoutMs = timeoutMs;
			if (options?.ephemeral) callOptions.ephemeral = true;
			if (options?.signal) callOptions.signal = options.signal;
			await listChromeMcpTabs(profile.name, profile, callOptions);
			return true;
		}
		const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
		return await isChromeCdpReady(profile.cdpUrl, httpTimeoutMs, wsTimeoutMs, getCdpReachabilityPolicy());
	};
	const isTransportAvailable = async (timeoutMs) => {
		if (capabilities.usesChromeMcp) {
			const { ensureChromeMcpAvailable } = await getChromeMcpModule();
			await ensureChromeMcpAvailable(profile.name, profile, {
				ephemeral: true,
				timeoutMs
			});
			return true;
		}
		return await isReachable(timeoutMs);
	};
	const isHttpReachable = async (timeoutMs) => {
		if (capabilities.usesChromeMcp) return await isTransportAvailable(timeoutMs);
		const { httpTimeoutMs } = resolveTimeouts(timeoutMs);
		return await isChromeReachable(profile.cdpUrl, httpTimeoutMs, getCdpReachabilityPolicy());
	};
	const describeCdpFailure = async (timeoutMs) => {
		const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
		return formatChromeCdpDiagnostic(await diagnoseChromeCdp(profile.cdpUrl, httpTimeoutMs, wsTimeoutMs, getCdpReachabilityPolicy()));
	};
	const attachRunning = (running) => {
		setProfileRunning(running);
		running.proc.on("exit", () => {
			if (!opts.getState()) return;
			if (getProfileState().running?.pid === running.pid) setProfileRunning(null);
		});
	};
	const formatChromeMcpAttachFailure = (lastError) => {
		const detail = lastError instanceof Error ? ` Last error: ${lastError.message}` : "";
		const message = lastError instanceof Error ? lastError.message : "";
		if (message.includes("DevToolsActivePort") || message.includes("Could not connect to Chrome")) return `Chrome MCP existing-session attach for profile "${profile.name}" could not connect to Chrome. Enable remote debugging in the browser inspect page, keep the browser open, approve the attach prompt, and retry. If you do not need your signed-in browser session, use the managed "openclaw" profile instead.` + detail;
		return `Chrome MCP existing-session attach for profile "${profile.name}" timed out waiting for tabs to become available. Approve the browser attach prompt, keep the browser open, and retry.${detail}`;
	};
	const reconcileProfileRuntime = async () => {
		const profileState = getProfileState();
		const reconcile = profileState.reconcile;
		if (!reconcile) return;
		profileState.reconcile = null;
		profileState.lastTargetId = null;
		const previousProfile = reconcile.previousProfile;
		resetManagedLaunchFailure(profileState);
		if (profileState.running) {
			await stopOpenClawChrome(profileState.running).catch(() => {});
			setProfileRunning(null);
		}
		if (getBrowserProfileCapabilities(previousProfile).usesChromeMcp) {
			const { closeChromeMcpSession } = await getChromeMcpModule();
			await closeChromeMcpSession(previousProfile.name).catch(() => false);
		}
		await closePlaywrightBrowserConnectionForProfile(previousProfile.cdpUrl);
		if (previousProfile.cdpUrl !== profile.cdpUrl) await closePlaywrightBrowserConnectionForProfile(profile.cdpUrl);
	};
	const waitForCdpReadyAfterLaunch = async () => {
		const deadlineMs = Date.now() + (state().resolved.localCdpReadyTimeoutMs ?? CDP_READY_AFTER_LAUNCH_WINDOW_MS);
		while (Date.now() < deadlineMs) {
			const remainingMs = Math.max(0, deadlineMs - Date.now());
			if (await isReachable(Math.max(75, Math.min(250, remainingMs)))) return;
			await new Promise((r) => {
				setTimeout(r, 100);
			});
		}
		throw new Error(`Chrome CDP websocket for profile "${profile.name}" is not reachable after start. ${await describeCdpFailure(250)}`);
	};
	const waitForChromeMcpReadyAfterAttach = async () => {
		const deadlineMs = Date.now() + CHROME_MCP_ATTACH_READY_WINDOW_MS;
		let lastError;
		while (Date.now() < deadlineMs) {
			try {
				const { listChromeMcpTabs } = await getChromeMcpModule();
				await listChromeMcpTabs(profile.name, profile);
				return;
			} catch (err) {
				lastError = err;
			}
			await new Promise((r) => {
				setTimeout(r, 200);
			});
		}
		throw new BrowserProfileUnavailableError(formatChromeMcpAttachFailure(lastError));
	};
	const launchManagedChrome = async (profileState, current, launchOptions) => {
		assertManagedLaunchNotCoolingDown(profile.name, profileState);
		try {
			return await launchOpenClawChrome(current.resolved, profile, launchOptions);
		} catch (err) {
			recordManagedLaunchFailure(profileState, err);
			throw err;
		}
	};
	const ensureBrowserAvailableOnce = async (options) => {
		await reconcileProfileRuntime();
		if (capabilities.usesChromeMcp) {
			if (profile.userDataDir && !fs.existsSync(profile.userDataDir)) throw new BrowserProfileUnavailableError(`Browser user data directory not found for profile "${profile.name}": ${profile.userDataDir}`);
			const { ensureChromeMcpAvailable } = await getChromeMcpModule();
			await ensureChromeMcpAvailable(profile.name, profile);
			await waitForChromeMcpReadyAfterAttach();
			return;
		}
		const current = state();
		const remoteCdp = capabilities.isRemote;
		const attachOnly = profile.attachOnly;
		const profileState = getProfileState();
		const httpReachable = await isHttpReachable();
		const launchOptions = launchOptionsForEnsure(options);
		if (!httpReachable) {
			if ((attachOnly || remoteCdp) && opts.onEnsureAttachTarget) {
				await opts.onEnsureAttachTarget(profile);
				if (await isHttpReachable(1200)) return;
			}
			if (!attachOnly && !remoteCdp && profile.cdpIsLoopback && !profileState.running) {
				if (await isHttpReachable(1200) && await isReachable(1200)) {
					resetManagedLaunchFailure(profileState);
					return;
				}
			}
			if (attachOnly || remoteCdp) throw new BrowserProfileUnavailableError(remoteCdp ? `Remote CDP for profile "${profile.name}" is not reachable at ${redactedProfileCdpUrl}.` : `Browser attachOnly is enabled and profile "${profile.name}" is not running.`);
			const launched = await launchManagedChrome(profileState, current, launchOptions);
			attachRunning(launched);
			try {
				await waitForCdpReadyAfterLaunch();
				resetManagedLaunchFailure(profileState);
			} catch (err) {
				await stopOpenClawChrome(launched).catch(() => {});
				setProfileRunning(null);
				recordManagedLaunchFailure(profileState, err);
				throw err;
			}
			return;
		}
		if (await isReachable()) {
			resetManagedLaunchFailure(profileState);
			return;
		}
		if (attachOnly || remoteCdp) {
			if (opts.onEnsureAttachTarget) {
				await opts.onEnsureAttachTarget(profile);
				if (await isReachable(1200)) return;
			}
			if (remoteCdp && await isReachable(1200)) return;
			const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS);
			throw new BrowserProfileUnavailableError(remoteCdp ? `Remote CDP websocket for profile "${profile.name}" is not reachable. ${detail}` : `Browser attachOnly is enabled and CDP websocket for profile "${profile.name}" is not reachable. ${detail}`);
		}
		if (!profileState.running) {
			const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS);
			throw new BrowserProfileUnavailableError(`Port ${profile.cdpPort} is in use for profile "${profile.name}" but not by openclaw. ${formatLocalPortOwnershipHint(profile)} ${detail}`);
		}
		await stopOpenClawChrome(profileState.running);
		setProfileRunning(null);
		attachRunning(await launchManagedChrome(profileState, current, launchOptions));
		if (!await isReachable(600)) {
			const err = /* @__PURE__ */ new Error(`Chrome CDP websocket for profile "${profile.name}" is not reachable after restart. ${await describeCdpFailure(600)}`);
			recordManagedLaunchFailure(profileState, err);
			throw err;
		}
		resetManagedLaunchFailure(profileState);
	};
	const ensureBrowserAvailable = async (options) => {
		const key = ensureOptionsKey(options);
		const profileState = getProfileState();
		for (;;) {
			const current = profileState.ensureBrowserAvailable;
			if (!current) break;
			if (current.key === key) return current.promise;
			await current.promise.catch(() => {});
		}
		const promise = ensureBrowserAvailableOnce(options).finally(() => {
			if (profileState.ensureBrowserAvailable?.promise === promise) profileState.ensureBrowserAvailable = null;
		});
		profileState.ensureBrowserAvailable = {
			key,
			promise
		};
		return promise;
	};
	const stopRunningBrowser = async () => {
		await reconcileProfileRuntime();
		if (capabilities.usesChromeMcp) {
			const { closeChromeMcpSession } = await getChromeMcpModule();
			return { stopped: await closeChromeMcpSession(profile.name) };
		}
		const profileState = getProfileState();
		resetManagedLaunchFailure(profileState);
		if (!profileState.running) {
			const idleStop = resolveIdleProfileStopOutcome(profile);
			if (idleStop.closePlaywright) await closePlaywrightBrowserConnectionForProfile(profile.cdpUrl);
			return { stopped: idleStop.stopped };
		}
		await stopOpenClawChrome(profileState.running);
		setProfileRunning(null);
		return { stopped: true };
	};
	return {
		isHttpReachable,
		isTransportAvailable,
		isReachable,
		ensureBrowserAvailable,
		stopRunningBrowser
	};
}
//#endregion
//#region extensions/browser/src/browser/server-context.reset.ts
/**
* Browser profile reset operations for local managed profiles.
*/
/** Builds the reset-profile operation for one resolved browser profile. */
function createProfileResetOps({ profile, getProfileState, stopRunningBrowser, isHttpReachable, resolveOpenClawUserDataDir }) {
	const capabilities = getBrowserProfileCapabilities(profile);
	const resetProfile = async () => {
		if (!capabilities.supportsReset) throw new BrowserResetUnsupportedError(`reset-profile is only supported for local profiles (profile "${profile.name}" is remote).`);
		const userDataDir = resolveOpenClawUserDataDir(profile.name);
		const profileState = getProfileState();
		profileState.managedLaunchFailure = void 0;
		profileState.ensureBrowserAvailable = null;
		if (await isHttpReachable(300) && !profileState.running) await closePlaywrightBrowserConnectionForProfile(profile.cdpUrl);
		if (profileState.running) await stopRunningBrowser();
		await closePlaywrightBrowserConnectionForProfile(profile.cdpUrl);
		if (!fs.existsSync(userDataDir)) return {
			moved: false,
			from: userDataDir
		};
		return {
			moved: true,
			from: userDataDir,
			to: await movePathToTrash(userDataDir)
		};
	};
	return { resetProfile };
}
//#endregion
//#region extensions/browser/src/browser/server-context.selection.ts
/**
* Browser tab selection operations for default tab choice, focus, and close.
*/
function mergeOpenedTabSnapshot(tabs, openedTab) {
	if (!openedTab) return tabs;
	const index = tabs.findIndex((tab) => tab.targetId === openedTab.targetId);
	if (index < 0) return [...tabs, openedTab];
	const listedTab = tabs[index];
	if (!listedTab || listedTab.wsUrl || !openedTab.wsUrl) return tabs;
	const merged = tabs.slice();
	merged[index] = {
		...listedTab,
		wsUrl: openedTab.wsUrl
	};
	return merged;
}
function waitForTabDiscoveryPoll() {
	return new Promise((resolve) => {
		setTimeout(resolve, 100);
	});
}
/** Builds tab selection/focus/close operations for one resolved browser profile. */
function createProfileSelectionOps({ profile, getProfileState, getCdpControlPolicy, ensureBrowserAvailable, listTabs, openTab }) {
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(profile.cdpUrl);
	const capabilities = getBrowserProfileCapabilities(profile);
	const ensureTabAvailable = async (targetId, options) => {
		await ensureBrowserAvailable();
		const profileState = getProfileState();
		let lastNonEmptyTabs = [];
		let lastListError;
		let sawSuccessfulList = false;
		let openedTab;
		const readTabs = async () => {
			try {
				const tabs = await listTabs();
				sawSuccessfulList = true;
				if (tabs.length > 0) lastNonEmptyTabs = tabs;
				return tabs;
			} catch (err) {
				lastListError = err;
				return [];
			}
		};
		const openWhenConfirmedEmpty = async (tabs) => {
			if (!openedTab && sawSuccessfulList && lastNonEmptyTabs.length === 0 && tabs.length === 0) openedTab = await openTab("about:blank");
		};
		const candidateTabs = (tabs) => capabilities.supportsPerTabWs ? tabs.filter((tab) => Boolean(tab.wsUrl)) : tabs;
		const canResolveSelection = (tabs) => {
			const desiredTargetId = targetId ?? openedTab?.targetId ?? normalizeOptionalString(profileState.lastTargetId) ?? void 0;
			if (!desiredTargetId) return tabs.length > 0;
			const resolved = resolveTargetIdFromTabs(desiredTargetId, tabs);
			return resolved.ok || resolved.reason === "ambiguous";
		};
		await openWhenConfirmedEmpty(await readTabs());
		let listedTabs = await readTabs();
		await openWhenConfirmedEmpty(listedTabs);
		let unfilteredTabs = mergeOpenedTabSnapshot(listedTabs, openedTab);
		let candidates = candidateTabs(unfilteredTabs);
		const preservedCanResolveSelection = () => canResolveSelection(mergeOpenedTabSnapshot(lastNonEmptyTabs, openedTab));
		if (capabilities.supportsPerTabWs && !canResolveSelection(candidates) && (candidates.length === 0 || canResolveSelection(unfilteredTabs) || preservedCanResolveSelection())) {
			const deadline = Date.now() + OPEN_TAB_DISCOVERY_WINDOW_MS;
			while (Date.now() < deadline) {
				await waitForTabDiscoveryPoll();
				listedTabs = await readTabs();
				await openWhenConfirmedEmpty(listedTabs);
				unfilteredTabs = mergeOpenedTabSnapshot(listedTabs, openedTab);
				candidates = candidateTabs(unfilteredTabs);
				if (canResolveSelection(candidates)) break;
			}
		}
		if (!canResolveSelection(candidates)) {
			const preservedTabs = mergeOpenedTabSnapshot(lastNonEmptyTabs, openedTab);
			const preservedCandidates = candidateTabs(preservedTabs);
			if (canResolveSelection(preservedCandidates)) candidates = preservedCandidates;
			else if (options?.allowPlaywrightFallback && canResolveSelection(preservedTabs)) candidates = preservedTabs;
		}
		if (candidates.length === 0 && !sawSuccessfulList && lastListError) throw lastListError instanceof Error ? lastListError : new Error(formatErrorMessage(lastListError));
		const resolveById = (raw) => {
			const resolved = resolveTargetIdFromTabs(raw, candidates);
			if (!resolved.ok) {
				if (resolved.reason === "ambiguous") return "AMBIGUOUS";
				return null;
			}
			return candidates.find((t) => t.targetId === resolved.targetId) ?? null;
		};
		const pickDefault = () => {
			const last = normalizeOptionalString(profileState.lastTargetId) ?? "";
			const lastResolved = last ? resolveById(last) : null;
			if (lastResolved && lastResolved !== "AMBIGUOUS") return lastResolved;
			return candidates.find((t) => (t.type ?? "page") === "page") ?? candidates.at(0) ?? null;
		};
		const chosen = targetId ? resolveById(targetId) : pickDefault();
		if (chosen === "AMBIGUOUS") throw new BrowserTargetAmbiguousError();
		if (!chosen) throw new BrowserTabNotFoundError(targetId ? { input: targetId } : void 0);
		profileState.lastTargetId = chosen.targetId;
		return chosen;
	};
	const resolveTargetIdOrThrow = async (targetId) => {
		const resolved = resolveTargetIdFromTabs(targetId, await listTabs());
		if (!resolved.ok) {
			if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
			throw new BrowserTabNotFoundError({ input: targetId });
		}
		return resolved.targetId;
	};
	const focusTab = async (targetId) => {
		const resolvedTargetId = await resolveTargetIdOrThrow(targetId);
		if (capabilities.usesChromeMcp) {
			const { focusChromeMcpTab } = await getChromeMcpModule();
			await focusChromeMcpTab(profile.name, resolvedTargetId, profile);
			const profileState = getProfileState();
			profileState.lastTargetId = resolvedTargetId;
			return;
		}
		if (capabilities.usesPersistentPlaywright) {
			const focusPageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.focusPageByTargetIdViaPlaywright;
			if (typeof focusPageByTargetIdViaPlaywright === "function") {
				await focusPageByTargetIdViaPlaywright({
					cdpUrl: profile.cdpUrl,
					targetId: resolvedTargetId,
					ssrfPolicy: getCdpControlPolicy()
				});
				const profileState = getProfileState();
				profileState.lastTargetId = resolvedTargetId;
				return;
			}
		}
		await fetchOk(appendCdpPath(cdpHttpBase, `/json/activate/${resolvedTargetId}`), void 0, void 0, getCdpControlPolicy());
		const profileState = getProfileState();
		profileState.lastTargetId = resolvedTargetId;
	};
	const closeTab = async (targetId) => {
		const resolvedTargetId = await resolveTargetIdOrThrow(targetId);
		if (capabilities.usesChromeMcp) {
			const { closeChromeMcpTab } = await getChromeMcpModule();
			await closeChromeMcpTab(profile.name, resolvedTargetId, profile);
			return;
		}
		if (capabilities.usesPersistentPlaywright) {
			const closePageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.closePageByTargetIdViaPlaywright;
			if (typeof closePageByTargetIdViaPlaywright === "function") {
				await closePageByTargetIdViaPlaywright({
					cdpUrl: profile.cdpUrl,
					targetId: resolvedTargetId,
					ssrfPolicy: getCdpControlPolicy()
				});
				return;
			}
		}
		await fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${resolvedTargetId}`), void 0, void 0, getCdpControlPolicy());
	};
	return {
		ensureTabAvailable,
		focusTab,
		closeTab
	};
}
//#endregion
//#region extensions/browser/src/browser/server-context.tab-ops.ts
/**
* Browser tab listing, opening, labeling, and alias management for one profile.
*/
/**
* Normalize a CDP WebSocket URL to use the correct base URL.
*/
function normalizeWsUrl(raw, cdpBaseUrl) {
	if (!raw) return;
	try {
		return normalizeCdpWsUrl(raw, cdpBaseUrl);
	} catch {
		return raw;
	}
}
const TAB_LABEL_PATTERN = /^[A-Za-z0-9_.:-]{1,64}$/;
function normalizeTabLabel(label) {
	const trimmed = label.trim();
	if (!TAB_LABEL_PATTERN.test(trimmed)) throw new Error("tab label must be 1-64 chars and use only letters, numbers, _, ., :, or -");
	return trimmed;
}
function getTabAliasState(profileState) {
	profileState.tabAliases ??= {
		nextTabNumber: 1,
		byTargetId: {}
	};
	return profileState.tabAliases;
}
function assignTabAlias(params) {
	const aliases = getTabAliasState(params.profileState);
	let entry = aliases.byTargetId[params.tab.targetId];
	if (!entry) {
		entry = { tabId: `t${aliases.nextTabNumber}` };
		aliases.nextTabNumber += 1;
		aliases.byTargetId[params.tab.targetId] = entry;
	}
	if (params.label) {
		const label = normalizeTabLabel(params.label);
		for (const [targetId, current] of Object.entries(aliases.byTargetId)) if (targetId !== params.tab.targetId && current.label === label) delete current.label;
		entry.label = label;
	}
	entry.url = params.tab.url;
	const labelFields = entry.label ? { label: entry.label } : {};
	return {
		...params.tab,
		suggestedTargetId: entry.label ?? entry.tabId,
		tabId: entry.tabId,
		...labelFields
	};
}
function isConfidentReplacement(params) {
	const staleUrl = params.staleEntry.url?.trim();
	const tabUrl = params.tab.url?.trim();
	if (staleUrl && tabUrl && staleUrl === tabUrl) return true;
	return params.staleCount === 1 && params.newCandidateCount === 1;
}
function assignTabAliases(profileState, tabs) {
	const aliases = getTabAliasState(profileState);
	const liveTargetIds = new Set(tabs.map((tab) => tab.targetId));
	const staleEntries = Object.entries(aliases.byTargetId).filter(([targetId]) => !liveTargetIds.has(targetId));
	const newCandidates = tabs.filter((tab) => !aliases.byTargetId[tab.targetId]);
	const claimedTargetIds = /* @__PURE__ */ new Set();
	for (const [oldTargetId, staleEntry] of staleEntries) {
		const candidate = newCandidates.find((tab) => !claimedTargetIds.has(tab.targetId) && isConfidentReplacement({
			staleEntry,
			tab,
			staleCount: staleEntries.length,
			newCandidateCount: newCandidates.length
		}));
		if (!candidate) continue;
		aliases.byTargetId[candidate.targetId] = staleEntry;
		delete aliases.byTargetId[oldTargetId];
		claimedTargetIds.add(candidate.targetId);
		if (profileState.lastTargetId === oldTargetId) profileState.lastTargetId = candidate.targetId;
	}
	for (const targetId of Object.keys(aliases.byTargetId)) if (!liveTargetIds.has(targetId)) delete aliases.byTargetId[targetId];
	return tabs.map((tab) => assignTabAlias({
		profileState,
		tab
	}));
}
/** Builds list/open/label tab operations for one resolved browser profile. */
function createProfileTabOps({ profile, state, getProfileState }) {
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(profile.cdpUrl);
	const capabilities = getBrowserProfileCapabilities(profile);
	const getCdpControlPolicy = () => resolveCdpControlPolicy(profile, state().resolved.ssrfPolicy);
	const getNavigationPolicy = () => withBrowserNavigationPolicy(state().resolved.ssrfPolicy, { browserProxyMode: resolveBrowserNavigationProxyMode({
		resolved: state().resolved,
		profile
	}) });
	const getRemoteCdpActionTimeouts = () => {
		if (profile.cdpIsLoopback && !profile.attachOnly) return;
		const resolved = state().resolved;
		return {
			httpTimeoutMs: resolved.remoteCdpTimeoutMs,
			handshakeTimeoutMs: resolved.remoteCdpHandshakeTimeoutMs
		};
	};
	const readTabs = async () => {
		if (capabilities.usesChromeMcp) {
			const { listChromeMcpTabs } = await getChromeMcpModule();
			return await listChromeMcpTabs(profile.name, profile);
		}
		if (capabilities.usesPersistentPlaywright) {
			const listPagesViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.listPagesViaPlaywright;
			if (typeof listPagesViaPlaywright === "function") {
				const ssrfPolicy = getCdpControlPolicy();
				await assertCdpEndpointAllowed(profile.cdpUrl, ssrfPolicy);
				return (await listPagesViaPlaywright({
					cdpUrl: profile.cdpUrl,
					ssrfPolicy
				})).filter(isSelectableCdpBrowserTarget).map((p) => ({
					targetId: p.targetId,
					title: p.title,
					url: p.url,
					type: p.type
				}));
			}
		}
		const raw = await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), void 0, void 0, getCdpControlPolicy());
		const cdpControlPolicy = getCdpControlPolicy();
		const tabs = [];
		for (const t of raw) {
			const tab = {
				targetId: t.id ?? "",
				title: t.title ?? "",
				url: t.url ?? "",
				wsUrl: normalizeWsUrl(t.webSocketDebuggerUrl, profile.cdpUrl),
				type: t.type
			};
			if (!tab.targetId || !isSelectableCdpBrowserTarget(tab)) continue;
			if (tab.wsUrl) await assertCdpEndpointAllowed(tab.wsUrl, cdpControlPolicy);
			tabs.push(tab);
		}
		return tabs;
	};
	const listTabs = async () => {
		const tabs = await readTabs();
		return assignTabAliases(getProfileState(), tabs);
	};
	const enforceManagedTabLimit = async (keepTargetId) => {
		const profileState = getProfileState();
		if (!capabilities.supportsManagedTabLimit || state().resolved.attachOnly || !profileState.running) return;
		const pageTabs = await listTabs().then((tabs) => tabs.filter((tab) => (tab.type ?? "page") === "page")).catch(() => []);
		if (pageTabs.length <= 8) return;
		const candidates = pageTabs.filter((tab) => tab.targetId !== keepTargetId);
		const excessCount = pageTabs.length - 8;
		for (const tab of candidates.slice(0, excessCount)) fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${tab.targetId}`), void 0, void 0, getCdpControlPolicy()).catch(() => {});
	};
	const triggerManagedTabLimit = (keepTargetId) => {
		enforceManagedTabLimit(keepTargetId).catch(() => {});
	};
	const openTab = async (url, opts) => {
		const ssrfPolicyOpts = getNavigationPolicy();
		if (capabilities.usesChromeMcp) {
			await assertBrowserNavigationAllowed({
				url,
				...ssrfPolicyOpts
			});
			const { openChromeMcpTab } = await getChromeMcpModule();
			const page = await openChromeMcpTab(profile.name, url, profile);
			const profileState = getProfileState();
			profileState.lastTargetId = page.targetId;
			await assertBrowserNavigationResultAllowed({
				url: page.url,
				...ssrfPolicyOpts
			});
			return assignTabAlias({
				profileState,
				tab: page,
				label: opts?.label
			});
		}
		if (capabilities.usesPersistentPlaywright) {
			const createPageViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.createPageViaPlaywright;
			if (typeof createPageViaPlaywright === "function") {
				const page = await createPageViaPlaywright({
					cdpUrl: profile.cdpUrl,
					url,
					...ssrfPolicyOpts
				});
				const profileState = getProfileState();
				profileState.lastTargetId = page.targetId;
				triggerManagedTabLimit(page.targetId);
				return assignTabAlias({
					profileState,
					label: opts?.label,
					tab: {
						targetId: page.targetId,
						title: page.title,
						url: page.url,
						type: page.type
					}
				});
			}
		}
		if (requiresInspectableBrowserNavigationRedirectsForUrl(url, state().resolved.ssrfPolicy)) throw new InvalidBrowserNavigationUrlError("Navigation blocked: strict browser SSRF policy requires Playwright-backed redirect-hop inspection");
		await assertBrowserNavigationAllowed({
			url,
			...ssrfPolicyOpts
		});
		const cdpActionTimeouts = getRemoteCdpActionTimeouts();
		const createTargetOpts = {
			cdpUrl: profile.cdpUrl,
			url,
			ssrfPolicy: getCdpControlPolicy()
		};
		if (cdpActionTimeouts) createTargetOpts.timeouts = cdpActionTimeouts;
		const createdViaCdp = await createTargetViaCdp(createTargetOpts).then((r) => r.targetId).catch(() => null);
		if (createdViaCdp) {
			const profileState = getProfileState();
			profileState.lastTargetId = createdViaCdp;
			const deadline = Date.now() + OPEN_TAB_DISCOVERY_WINDOW_MS;
			while (Date.now() < deadline) {
				const found = (await listTabs().catch(() => [])).find((t) => t.targetId === createdViaCdp);
				if (found) {
					await assertBrowserNavigationResultAllowed({
						url: found.url,
						...ssrfPolicyOpts
					});
					triggerManagedTabLimit(found.targetId);
					return assignTabAlias({
						profileState,
						tab: found,
						label: opts?.label
					});
				}
				await new Promise((r) => {
					setTimeout(r, 100);
				});
			}
			triggerManagedTabLimit(createdViaCdp);
			return assignTabAlias({
				profileState,
				tab: {
					targetId: createdViaCdp,
					title: "",
					url,
					type: "page"
				},
				label: opts?.label
			});
		}
		const encoded = encodeURIComponent(url);
		const endpointUrl = new URL(appendCdpPath(cdpHttpBase, "/json/new"));
		const endpoint = endpointUrl.search ? (() => {
			endpointUrl.searchParams.set("url", url);
			return endpointUrl.toString();
		})() : `${endpointUrl.toString()}?${encoded}`;
		const created = await fetchJson(endpoint, cdpActionTimeouts?.httpTimeoutMs ?? 1500, { method: "PUT" }, getCdpControlPolicy()).catch(async (err) => {
			if (String(err).includes("HTTP 405")) return await fetchJson(endpoint, cdpActionTimeouts?.httpTimeoutMs ?? 1500, void 0, getCdpControlPolicy());
			throw err;
		});
		if (!created.id) throw new Error("Failed to open tab (missing id)");
		const profileState = getProfileState();
		profileState.lastTargetId = created.id;
		const resolvedUrl = created.url ?? url;
		await assertBrowserNavigationResultAllowed({
			url: resolvedUrl,
			...ssrfPolicyOpts
		});
		const wsUrl = normalizeWsUrl(created.webSocketDebuggerUrl, profile.cdpUrl);
		if (wsUrl) await assertCdpEndpointAllowed(wsUrl, getCdpControlPolicy());
		triggerManagedTabLimit(created.id);
		return assignTabAlias({
			profileState,
			label: opts?.label,
			tab: {
				targetId: created.id,
				title: created.title ?? "",
				url: resolvedUrl,
				wsUrl,
				type: created.type
			}
		});
	};
	const labelTab = async (targetId, label) => {
		const normalizedLabel = normalizeTabLabel(label);
		const tabs = await listTabs();
		const resolved = resolveTargetIdFromTabs(targetId, tabs);
		if (!resolved.ok) {
			if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
			throw new BrowserTabNotFoundError({ input: targetId });
		}
		const tab = tabs.find((candidate) => candidate.targetId === resolved.targetId);
		if (!tab) throw new BrowserTabNotFoundError({ input: targetId });
		return assignTabAlias({
			profileState: getProfileState(),
			tab,
			label: normalizedLabel
		});
	};
	return {
		listTabs,
		openTab,
		labelTab
	};
}
//#endregion
//#region extensions/browser/src/browser/server-context.ts
/**
* Browser route context factory that wires profile-scoped runtime operations for
* the Browser control server.
*/
/** Lists configured and runtime-known Browser profile names without duplicates. */
function listKnownProfileNames(state) {
	const names = new Set(Object.keys(state.resolved.profiles));
	for (const name of state.profiles.keys()) names.add(name);
	return [...names];
}
/**
* Create a profile-scoped context for browser operations.
*/
function createProfileContext(opts, profile) {
	const state = () => {
		const current = opts.getState();
		if (!current) throw new Error("Browser server not started");
		return current;
	};
	const getProfileState = () => {
		const current = state();
		let profileState = current.profiles.get(profile.name);
		if (!profileState) {
			profileState = {
				profile,
				running: null,
				lastTargetId: null,
				reconcile: null
			};
			current.profiles.set(profile.name, profileState);
		}
		return profileState;
	};
	const setProfileRunning = (running) => {
		const profileState = getProfileState();
		profileState.running = running;
	};
	const { listTabs, openTab, labelTab } = createProfileTabOps({
		profile,
		state,
		getProfileState
	});
	const { ensureBrowserAvailable, isHttpReachable, isTransportAvailable, isReachable, stopRunningBrowser } = createProfileAvailability({
		opts,
		profile,
		state,
		getProfileState,
		setProfileRunning
	});
	const { ensureTabAvailable, focusTab, closeTab } = createProfileSelectionOps({
		profile,
		getProfileState,
		getCdpControlPolicy: () => resolveCdpControlPolicy(profile, state().resolved.ssrfPolicy),
		ensureBrowserAvailable,
		listTabs,
		openTab
	});
	const { resetProfile } = createProfileResetOps({
		profile,
		getProfileState,
		stopRunningBrowser,
		isHttpReachable,
		resolveOpenClawUserDataDir
	});
	return {
		profile,
		ensureBrowserAvailable,
		ensureTabAvailable,
		isHttpReachable,
		isTransportAvailable,
		isReachable,
		listTabs,
		openTab,
		labelTab,
		focusTab,
		closeTab,
		stopRunningBrowser,
		resetProfile
	};
}
/** Creates the Browser route context used by control-server route handlers. */
function createBrowserRouteContext(opts) {
	const refreshConfigFromDisk = opts.refreshConfigFromDisk === true;
	const state = () => {
		const current = opts.getState();
		if (!current) throw new Error("Browser server not started");
		return current;
	};
	const forProfile = (profileName) => {
		const current = state();
		const name = profileName ?? current.resolved.defaultProfile;
		const profile = resolveBrowserProfileWithHotReload({
			current,
			refreshConfigFromDisk,
			name
		});
		if (!profile) throw new BrowserProfileNotFoundError(`Profile "${name}" not found. Available profiles: ${Object.keys(current.resolved.profiles).join(", ") || "(none)"}`);
		return createProfileContext(opts, profile);
	};
	const listProfiles = async () => {
		const current = state();
		refreshResolvedBrowserConfigFromDisk({
			current,
			refreshConfigFromDisk,
			mode: "cached"
		});
		const result = [];
		for (const name of listKnownProfileNames(current)) {
			const profileState = current.profiles.get(name);
			const profile = resolveProfile(current.resolved, name) ?? profileState?.profile;
			if (!profile) continue;
			const capabilities = getBrowserProfileCapabilities(profile);
			let tabCount = 0;
			let running = false;
			const profileCtx = createProfileContext(opts, profile);
			if (capabilities.usesChromeMcp) try {
				running = await profileCtx.isTransportAvailable(300);
				if (running) tabCount = (await listChromeMcpTabs(profile.name, profile, { ephemeral: true }).catch(() => [])).filter((t) => t.type === "page").length;
			} catch {}
			else if (profileState?.running) {
				running = true;
				try {
					tabCount = (await profileCtx.listTabs()).filter((t) => t.type === "page").length;
				} catch {}
			} else try {
				const probeTimeoutMs = usesFastLoopbackCdpProbeClass({
					profileIsLoopback: profile.cdpIsLoopback,
					attachOnly: profile.attachOnly
				}) ? 200 : current.resolved.remoteCdpTimeoutMs;
				if (await isChromeReachable(profile.cdpUrl, probeTimeoutMs, resolveCdpReachabilityPolicy(profile, current.resolved.ssrfPolicy))) {
					running = true;
					tabCount = (await profileCtx.listTabs().catch(() => [])).filter((t) => t.type === "page").length;
				}
			} catch {}
			result.push({
				name,
				transport: capabilities.usesChromeMcp ? "chrome-mcp" : "cdp",
				cdpPort: capabilities.usesChromeMcp ? null : profile.cdpPort,
				cdpUrl: profile.cdpUrl ? redactCdpUrl(profile.cdpUrl) ?? null : null,
				color: profile.color,
				driver: profile.driver,
				running,
				tabCount,
				isDefault: name === current.resolved.defaultProfile,
				isRemote: !profile.cdpIsLoopback,
				missingFromConfig: !(name in current.resolved.profiles) || void 0,
				reconcileReason: profileState?.reconcile?.reason ?? null
			});
		}
		return result;
	};
	const getDefaultContext = () => forProfile();
	const mapTabError = (err) => {
		const browserMapped = toBrowserErrorResponse(err);
		if (browserMapped) return browserMapped;
		return null;
	};
	return {
		state,
		forProfile,
		listProfiles,
		ensureBrowserAvailable: () => getDefaultContext().ensureBrowserAvailable(),
		ensureTabAvailable: (targetId, options) => getDefaultContext().ensureTabAvailable(targetId, options),
		isHttpReachable: (timeoutMs) => getDefaultContext().isHttpReachable(timeoutMs),
		isTransportAvailable: (timeoutMs) => getDefaultContext().isTransportAvailable(timeoutMs),
		isReachable: (timeoutMs, options) => getDefaultContext().isReachable(timeoutMs, options),
		listTabs: () => getDefaultContext().listTabs(),
		openTab: (url, optsLocal) => getDefaultContext().openTab(url, optsLocal),
		labelTab: (targetId, label) => getDefaultContext().labelTab(targetId, label),
		focusTab: (targetId) => getDefaultContext().focusTab(targetId),
		closeTab: (targetId) => getDefaultContext().closeTab(targetId),
		stopRunningBrowser: () => getDefaultContext().stopRunningBrowser(),
		resetProfile: () => getDefaultContext().resetProfile(),
		mapTabError
	};
}
//#endregion
export { listKnownProfileNames as n, loadBrowserConfigForRuntimeRefresh as r, createBrowserRouteContext as t };
