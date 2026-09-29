import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { u as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import { n as redactCdpUrl } from "./browser-cdp-nPpqdqz_.mjs";
import { _ as readBrowserDashboardTabs, s as findRetainedBrowserDashboardTab, t as assertBrowserDashboardTabCanClose } from "./session-tab-store-CyxH9Sdj.mjs";
import { c as DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS } from "./constants-DKjTvIBP.mjs";
import { i as resolveBrowserConfig, n as getOwnBrowserProfile, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { c as BrowserProfileUnavailableError, d as BrowserTabNotFoundError, f as BrowserTargetAmbiguousError, h as toBrowserErrorResponse, l as BrowserResetUnsupportedError, n as BROWSER_ERROR_REASONS, s as BrowserProfileNotFoundError } from "./errors-CXz-2iKA.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import { t as getExtensionRelayModule } from "./extension-relay.runtime.js";
import "./errors-DS4y5mrd.mjs";
import { n as getPwAiModule } from "./pw-ai-module-CQKXgko2.mjs";
import { a as getOrCreateProfileRuntime, c as isProfileGenerationCurrent, f as registerProfileHandle, g as getChromeMcpModule, h as withProfileOperationLease, i as enqueueProfileStart, l as isProfileRestartRequiredError, m as waitForProfileOperation, n as assertProfileLifecycleContext, o as getProfileLifecycle, p as releaseProfileHandle, r as beginProfileTransition, s as isBrowserRuntimeRunning, t as ProfileRestartRequiredError, u as isWithinProfileOperationLease } from "./server-context.lifecycle-WXgkDTmm.mjs";
import { B as waitForCdpCommittedNavigationUrl, F as assertBrowserNavigationResultAllowed, L as requiresInspectableBrowserNavigationRedirectsForUrl, M as InvalidBrowserNavigationUrlError, N as assertBrowserNavigationAllowed, R as withBrowserNavigationPolicy, V as resolveBrowserNavigationProxyMode, a as isChromeCdpReady, c as resolveOpenClawUserDataDir, f as diagnoseChromeCdp, g as createTargetViaCdp, i as isChromeCdpOwnedByPid, l as stopOpenClawChrome, o as isChromeReachable, p as formatChromeCdpDiagnostic, r as inspectLocalChromeHeadlessMode, s as launchOpenClawChrome, t as ManagedChromeCleanupError } from "./chrome-BHS7REtN.mjs";
import { A as PROFILE_ATTACH_RETRY_TIMEOUT_MS, M as usesFastLoopbackCdpProbeClass, O as MANAGED_CDP_READY_HTTP_TIMEOUT_MS, T as CHROME_MCP_ATTACH_READY_WINDOW_MS, a as fetchJson, f as resolveCdpTabOwnership, j as resolveCdpReachabilityTimeouts, l as normalizeCdpHttpBaseForJsonEndpoints, n as assertCdpEndpointAllowed, o as fetchOk, t as appendCdpPath, u as normalizeCdpWsUrl } from "./cdp.helpers-C-PCz6N7.mjs";
import "./config-Dk-reqA4.mjs";
import { t as movePathToTrash } from "./trash-CAu63IBo.mjs";
import { n as resolveCdpControlPolicy, r as resolveCdpReachabilityPolicy, t as assertChromeMcpCdpTransportAllowed } from "./cdp-reachability-policy-BY3s_i-8.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { setTimeout } from "node:timers/promises";
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
//#region extensions/browser/src/browser/resolved-config-refresh.ts
/**
* Runtime config refresh helpers for Browser profiles that can be hot-reloaded
* without restarting the whole Browser plugin server.
*/
function changedProfileInvariants(current, next, previousConfig, nextConfig) {
	const changed = [];
	const currentUsesLocalManagedLaunch = current.driver === "openclaw" && !current.attachOnly && current.cdpIsLoopback;
	const nextUsesLocalManagedLaunch = next.driver === "openclaw" && !next.attachOnly && next.cdpIsLoopback;
	if (current.cdpUrl !== next.cdpUrl) changed.push("cdpUrl");
	if (current.cdpPort !== next.cdpPort) changed.push("cdpPort");
	if (current.driver !== next.driver) changed.push("driver");
	if (currentUsesLocalManagedLaunch && nextUsesLocalManagedLaunch) {
		if (current.headless !== next.headless) changed.push("headless");
		if (current.executablePath !== next.executablePath) changed.push("executablePath");
		if (previousConfig.noSandbox !== nextConfig.noSandbox) changed.push("noSandbox");
		if (!isDeepStrictEqual(previousConfig.extraArgs, nextConfig.extraArgs)) changed.push("extraArgs");
	}
	if (current.attachOnly !== next.attachOnly) changed.push("attachOnly");
	if (current.cdpIsLoopback !== next.cdpIsLoopback) changed.push("cdpIsLoopback");
	if ((current.userDataDir ?? "") !== (next.userDataDir ?? "")) changed.push("userDataDir");
	if ((current.mcpCommand ?? "") !== (next.mcpCommand ?? "")) changed.push("mcpCommand");
	if (!isDeepStrictEqual(current.mcpArgs, next.mcpArgs)) changed.push("mcpArgs");
	return changed;
}
function queueRemovedProfileCleanup(params) {
	const actor = getProfileLifecycle(params.runtime);
	if (!params.initial && (!actor.blockedReason || actor.transitionReason)) return;
	params.runtime.lastTargetId = null;
	beginProfileTransition({
		state: params.current,
		runtime: params.runtime,
		reason: params.initial ? "profile removed from config" : "profile removal cleanup retry",
		terminal: "config-removed",
		advanceConfigRevision: params.initial,
		closeRelay: params.runtime.profile.driver === "extension",
		exposeReason: true
	}).then(() => {
		if (params.current.profiles.get(params.name) === params.runtime) params.current.profiles.delete(params.name);
	}).catch(() => {});
}
function applyResolvedConfig(current, freshResolved) {
	const previousResolved = current.resolved;
	const extensionRelayInternalTokens = {};
	for (const [name, relay] of current.extensionRelays ?? []) {
		const runtime = current.profiles.get(name);
		const lifecycle = runtime && getProfileLifecycle(runtime);
		const profile = resolveProfile(freshResolved, name);
		if (runtime?.profile.driver === "extension" && !lifecycle?.terminal && !lifecycle?.transitionReason && !lifecycle?.cleanupRelays.has(relay) && profile?.driver === "extension" && profile.cdpPort === relay.port && relay.ownership !== "borrowed") extensionRelayInternalTokens[name] = relay.internalToken;
	}
	current.resolved = {
		...freshResolved,
		enabled: previousResolved.enabled,
		evaluateEnabled: previousResolved.evaluateEnabled,
		ssrfPolicy: previousResolved.ssrfPolicy,
		extensionRelay: previousResolved.extensionRelay,
		extensionRelayInternalTokens,
		extensionRelayToken: previousResolved.extensionRelayToken
	};
	for (const [name, runtime] of current.profiles) {
		const actor = getProfileLifecycle(runtime);
		if (actor.terminal === "config-removed") {
			queueRemovedProfileCleanup({
				current,
				name,
				runtime,
				initial: false
			});
			continue;
		}
		if (actor.terminal) continue;
		const nextProfile = resolveProfile(current.resolved, name);
		if (nextProfile) {
			if (actor.blockedReason && !actor.transitionReason) {
				beginProfileTransition({
					state: current,
					runtime,
					reason: "profile invariant cleanup retry",
					captureProfileResources: false,
					exposeReason: true
				}).catch(() => {});
				continue;
			}
			const changed = changedProfileInvariants(runtime.profile, nextProfile, previousResolved, freshResolved);
			if (changed.length > 0) {
				const previousProfile = runtime.profile;
				const reason = `profile invariants changed: ${changed.join(", ")}`;
				beginProfileTransition({
					state: current,
					runtime,
					reason,
					advanceConfigRevision: true,
					closeRelay: previousProfile.driver === "extension",
					exposeReason: true
				}).catch(() => {});
				runtime.lastTargetId = null;
			}
			runtime.profile = nextProfile;
			continue;
		}
		queueRemovedProfileCleanup({
			current,
			name,
			runtime,
			initial: true
		});
	}
}
/** Refreshes the Browser runtime's resolved config from disk when hot reload is enabled. */
function refreshResolvedBrowserConfigFromDisk(params) {
	if (!params.refreshConfigFromDisk) return;
	const cfg = loadBrowserConfigForRuntimeRefresh();
	const freshResolved = resolveBrowserConfig(cfg.browser, cfg);
	applyResolvedConfig(params.current, freshResolved);
}
//#endregion
//#region extensions/browser/src/browser/server-context.constants.ts
/**
* Timing and size constants for Browser profile/tab runtime operations.
*/
const OPEN_TAB_DISCOVERY_WINDOW_MS = 2e3;
const CDP_READY_AFTER_LAUNCH_WINDOW_MS = DEFAULT_BROWSER_LOCAL_CDP_READY_TIMEOUT_MS;
//#endregion
//#region extensions/browser/src/browser/server-context.availability.ts
/**
* Browser profile availability operations: reachability probes, managed Chrome
* launch/restart, Chrome MCP attach, and profile stop handling.
*/
const MANAGED_LAUNCH_FAILURE_THRESHOLD = 3;
const MANAGED_LAUNCH_COOLDOWN_BASE_MS = 3e4;
const MANAGED_LAUNCH_COOLDOWN_MAX_MS = 3e5;
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
function createProfileAvailability({ opts, profile, state, runtime, configRevision }) {
	const redactedProfileCdpUrl = redactCdpUrl(profile.cdpUrl) ?? profile.cdpUrl;
	const capabilities = getBrowserProfileCapabilities(profile);
	const resolveTimeouts = (timeoutMs) => resolveCdpReachabilityTimeouts({
		profileIsLoopback: profile.cdpIsLoopback,
		attachOnly: profile.attachOnly,
		timeoutMs: timeoutMs ?? (runtime.running && capabilities.mode === "local-managed" ? 1500 : void 0),
		remoteHttpTimeoutMs: state().resolved.remoteCdpTimeoutMs,
		remoteHandshakeTimeoutMs: state().resolved.remoteCdpHandshakeTimeoutMs
	});
	const getCdpReachabilityPolicy = () => resolveCdpReachabilityPolicy(profile, state().resolved.ssrfPolicy);
	const observeExternalBrowserMode = async (diagnostic, timeoutMs, signal) => {
		signal?.throwIfAborted();
		if (!diagnostic.ok) {
			runtime.externalBrowserMode = void 0;
			return;
		}
		if (runtime.externalBrowserMode?.browserWebSocketUrl !== diagnostic.wsUrl) {
			const observation = {
				browserWebSocketUrl: diagnostic.wsUrl,
				headless: inspectLocalChromeHeadlessMode({
					profile,
					browserWebSocketUrl: diagnostic.wsUrl,
					timeoutMs,
					signal: getProfileLifecycle(runtime).controller.signal,
					ssrfPolicy: getCdpReachabilityPolicy()
				}).then((headless) => {
					if (headless === void 0 && runtime.externalBrowserMode === observation) runtime.externalBrowserMode = void 0;
					return headless;
				})
			};
			runtime.externalBrowserMode = observation;
		}
		await waitForProfileOperation(runtime.externalBrowserMode.headless, signal);
	};
	const ensureExtensionRelay = async (signal) => {
		signal?.throwIfAborted();
		if (capabilities.mode !== "local-extension") return;
		const { ensureExtensionRelayForProfile } = await getExtensionRelayModule();
		const relay = await ensureExtensionRelayForProfile(state(), profile, signal);
		signal?.throwIfAborted();
		return relay;
	};
	const isReachable = async (timeoutMs, options) => {
		const relay = await ensureExtensionRelay(options?.signal);
		if (relay?.ownership === "borrowed") {
			const ready = await relay.client.status();
			options?.signal?.throwIfAborted();
			return ready.ready && state().extensionRelays?.get(profile.name) === relay;
		}
		if (capabilities.usesChromeMcp) {
			assertChromeMcpCdpTransportAllowed(profile, getCdpReachabilityPolicy());
			const { countChromeMcpTabs } = await getChromeMcpModule();
			await countChromeMcpTabs(profile.name, profile, {
				...timeoutMs != null ? { timeoutMs } : {},
				...options?.ephemeral ? { ephemeral: true } : {},
				...options?.signal ? { signal: options.signal } : {}
			});
			return true;
		}
		const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
		return await isChromeCdpReady(profile.cdpUrl, httpTimeoutMs, wsTimeoutMs, getCdpReachabilityPolicy(), {
			signal: options?.signal,
			...profile.attachOnly && capabilities.supportsPerTabWs ? { onDiagnostic: async (diagnostic) => await observeExternalBrowserMode(diagnostic, wsTimeoutMs, options?.signal) } : {}
		});
	};
	const isTransportAvailable = async (timeoutMs, signal, pageProbe) => {
		if (capabilities.usesChromeMcp) {
			assertChromeMcpCdpTransportAllowed(profile, getCdpReachabilityPolicy());
			const { ensureChromeMcpAvailable } = await getChromeMcpModule();
			await ensureChromeMcpAvailable(profile.name, profile, {
				ephemeral: true,
				timeoutMs,
				signal,
				...pageProbe ? { pageProbe } : {}
			});
			return true;
		}
		return await isReachable(timeoutMs, { signal });
	};
	const isHttpReachable = async (timeoutMs, signal) => {
		if (capabilities.usesChromeMcp) return await isTransportAvailable(timeoutMs, signal);
		const relay = await ensureExtensionRelay(signal);
		if (relay?.ownership === "borrowed") {
			const ready = await relay.client.status();
			signal?.throwIfAborted();
			return ready.ready && state().extensionRelays?.get(profile.name) === relay;
		}
		const { httpTimeoutMs } = resolveTimeouts(timeoutMs);
		return await isChromeReachable(profile.cdpUrl, httpTimeoutMs, getCdpReachabilityPolicy(), signal);
	};
	const describeCdpFailure = async (timeoutMs, signal) => {
		const { httpTimeoutMs, wsTimeoutMs } = resolveTimeouts(timeoutMs);
		const diagnostic = await diagnoseChromeCdp(profile.cdpUrl, httpTimeoutMs, wsTimeoutMs, getCdpReachabilityPolicy(), signal);
		return formatChromeCdpDiagnostic(diagnostic);
	};
	const stopExactRunning = async (running) => {
		try {
			await stopOpenClawChrome(running);
			releaseProfileHandle(runtime, running);
		} catch (err) {
			getProfileLifecycle(runtime).blockedReason = "managed Chrome cleanup failed";
			throw err;
		}
	};
	const adoptRunning = (running, generation, signal) => {
		const actor = getProfileLifecycle(runtime);
		if (!isProfileGenerationCurrent({
			state: state(),
			runtime,
			configRevision,
			generation
		})) {
			signal.throwIfAborted();
			throw new BrowserProfileUnavailableError(`Browser start for profile "${profile.name}" was superseded.`);
		}
		if (!actor.handles.has(running) || running.proc.exitCode != null || running.proc.signalCode != null) throw new BrowserProfileUnavailableError(`Managed Chrome for profile "${profile.name}" exited before adoption.`);
		runtime.running = running;
	};
	const formatChromeMcpAttachFailure = (lastError) => {
		const detail = lastError instanceof Error ? ` Last error: ${lastError.message}` : "";
		const message = lastError instanceof Error ? lastError.message : "";
		if (message.includes("DevToolsActivePort") || message.includes("Could not connect to Chrome")) return `Chrome MCP existing-session attach for profile "${profile.name}" could not connect to Chrome. Enable remote debugging in the browser inspect page, keep the browser open, approve the attach prompt, and retry. If you do not need your signed-in browser session, use the managed "openclaw" profile instead.` + detail;
		return `Chrome MCP existing-session attach for profile "${profile.name}" timed out waiting for tabs to become available. Approve the browser attach prompt, keep the browser open, and retry.${detail}`;
	};
	const waitForPoll = async (delayMs, signal) => {
		signal.throwIfAborted();
		await setTimeout(delayMs, void 0, { signal }).catch((error) => {
			throw signal.aborted ? signal.reason instanceof Error ? signal.reason : new Error("Browser availability wait aborted.", { cause: signal.reason }) : error;
		});
	};
	const waitForCdpReadyAfterLaunch = async (signal, running) => {
		const deadlineMs = Date.now() + (state().resolved.localCdpReadyTimeoutMs ?? CDP_READY_AFTER_LAUNCH_WINDOW_MS);
		while (Date.now() < deadlineMs) {
			const remainingMs = Math.max(0, deadlineMs - Date.now());
			const attemptTimeoutMs = Math.max(75, Math.min(MANAGED_CDP_READY_HTTP_TIMEOUT_MS, remainingMs));
			signal.throwIfAborted();
			if (await isReachable(attemptTimeoutMs, { signal })) {
				const ownsEndpoint = await isChromeCdpOwnedByPid(profile.cdpUrl, running.pid, attemptTimeoutMs, getCdpReachabilityPolicy(), signal);
				signal.throwIfAborted();
				if (!ownsEndpoint) throw new BrowserProfileUnavailableError(`Managed Chrome for profile "${profile.name}" did not own its CDP endpoint.`);
				return;
			}
			await waitForPoll(100, signal);
		}
		throw new Error(`Chrome CDP websocket for profile "${profile.name}" is not reachable after start. ${await describeCdpFailure(MANAGED_CDP_READY_HTTP_TIMEOUT_MS, signal)}`);
	};
	const waitForChromeMcpReadyAfterAttach = async (signal) => {
		const deadlineMs = Date.now() + CHROME_MCP_ATTACH_READY_WINDOW_MS;
		let lastError;
		while (Date.now() < deadlineMs) {
			try {
				const { listChromeMcpTabs } = await getChromeMcpModule();
				await listChromeMcpTabs(profile.name, profile, { signal });
				return;
			} catch (err) {
				lastError = err;
			}
			signal.throwIfAborted();
			await waitForPoll(200, signal);
		}
		throw new BrowserProfileUnavailableError(formatChromeMcpAttachFailure(lastError));
	};
	const launchManagedChrome = async (current, launchOptions, signal) => {
		assertManagedLaunchNotCoolingDown(profile.name, runtime);
		try {
			return await launchOpenClawChrome(current.resolved, profile, {
				...launchOptions,
				signal
			});
		} catch (err) {
			if (err instanceof ManagedChromeCleanupError) {
				if (registerProfileHandle(runtime, err.running)) getProfileLifecycle(runtime).blockedReason = "managed Chrome cleanup failed";
				throw err;
			}
			if (signal.aborted) throw err;
			if (!(err instanceof BrowserProfileUnavailableError && err.metadata?.reason === BROWSER_ERROR_REASONS.noDisplayForHeadedProfile)) recordManagedLaunchFailure(runtime, err);
			throw err;
		}
	};
	const ensureBrowserAvailableOnce = async (signal, generation, options) => {
		signal.throwIfAborted();
		if (capabilities.usesChromeMcp) {
			if (profile.userDataDir && !fs.existsSync(profile.userDataDir)) throw new BrowserProfileUnavailableError(`Browser user data directory not found for profile "${profile.name}": ${profile.userDataDir}`);
			assertChromeMcpCdpTransportAllowed(profile, getCdpReachabilityPolicy());
			const { ensureChromeMcpAvailable } = await getChromeMcpModule();
			await ensureChromeMcpAvailable(profile.name, profile, { signal });
			await waitForChromeMcpReadyAfterAttach(signal);
			return;
		}
		const current = state();
		const remoteCdp = capabilities.isRemote;
		const attachOnly = profile.attachOnly;
		if (runtime.running && capabilities.mode === "local-managed" && !attachOnly) {
			if (await isReachable(void 0, { signal })) {
				resetManagedLaunchFailure(runtime);
				return;
			}
			throw new ProfileRestartRequiredError();
		}
		let httpReachable;
		if (capabilities.mode === "local-extension") {
			const { ensureExtensionRelayForProfile } = await getExtensionRelayModule();
			const relay = await ensureExtensionRelayForProfile(current, profile, signal);
			const connected = relay.ownership === "borrowed" ? (await waitForProfileOperation(relay.client.status(CHROME_MCP_ATTACH_READY_WINDOW_MS), signal)).ready : await relay.bridge.waitForExtensionConnection(signal, CHROME_MCP_ATTACH_READY_WINDOW_MS);
			signal.throwIfAborted();
			httpReachable = connected && current.extensionRelays?.get(profile.name) === relay && await isHttpReachable(void 0, signal);
		} else httpReachable = await isHttpReachable(void 0, signal);
		const launchOptions = launchOptionsForEnsure(options);
		if (!httpReachable) {
			if ((attachOnly || remoteCdp) && opts.onEnsureAttachTarget) {
				await opts.onEnsureAttachTarget(profile);
				signal.throwIfAborted();
				if (await isHttpReachable(1200, signal)) return;
			}
			if (!attachOnly && !remoteCdp && profile.cdpIsLoopback) {
				if (await isHttpReachable(1200, signal) && await isReachable(1200, { signal })) {
					resetManagedLaunchFailure(runtime);
					return;
				}
			}
			if (attachOnly || remoteCdp) {
				if (capabilities.mode === "local-extension") {
					const { EXTENSION_PAIRING_HINT } = await getExtensionRelayModule();
					throw new BrowserProfileUnavailableError(`The OpenClaw Chrome extension is not connected for profile "${profile.name}". Open Chrome on this machine and check the extension popup shows "Connected". ${EXTENSION_PAIRING_HINT}`);
				}
				throw new BrowserProfileUnavailableError(remoteCdp ? `Remote CDP for profile "${profile.name}" is not reachable at ${redactedProfileCdpUrl}.` : `Browser attachOnly is enabled and profile "${profile.name}" is not running.`);
			}
			const launched = await launchManagedChrome(current, launchOptions, signal);
			if (!registerProfileHandle(runtime, launched)) throw new BrowserProfileUnavailableError(`Managed Chrome for profile "${profile.name}" exited before adoption.`);
			try {
				await waitForCdpReadyAfterLaunch(signal, launched);
				adoptRunning(launched, generation, signal);
				resetManagedLaunchFailure(runtime);
			} catch (err) {
				await stopExactRunning(launched);
				if (!signal.aborted) recordManagedLaunchFailure(runtime, err);
				throw err;
			}
			return;
		}
		if (await isReachable(void 0, { signal })) {
			resetManagedLaunchFailure(runtime);
			return;
		}
		if (attachOnly || remoteCdp) {
			if (opts.onEnsureAttachTarget) {
				await opts.onEnsureAttachTarget(profile);
				signal.throwIfAborted();
				if (await isReachable(1200, { signal })) return;
			}
			if (remoteCdp && await isReachable(1200, { signal })) return;
			if (capabilities.mode === "local-extension") {
				const { EXTENSION_PAIRING_HINT } = await getExtensionRelayModule();
				throw new BrowserProfileUnavailableError(`The extension relay for profile "${profile.name}" is running but the OpenClaw Chrome extension is not connected. ${EXTENSION_PAIRING_HINT}`);
			}
			const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS, signal);
			throw new BrowserProfileUnavailableError(remoteCdp ? `Remote CDP websocket for profile "${profile.name}" is not reachable. ${detail}` : `Browser attachOnly is enabled and CDP websocket for profile "${profile.name}" is not reachable. ${detail}`);
		}
		const detail = await describeCdpFailure(PROFILE_ATTACH_RETRY_TIMEOUT_MS, signal);
		throw new BrowserProfileUnavailableError(`Port ${profile.cdpPort} is in use for profile "${profile.name}" but not by openclaw. ${formatLocalPortOwnershipHint(profile)} ${detail}`);
	};
	const ensureBrowserAvailable = async (options) => {
		if (capabilities.mode === "local-extension") {
			await withProfileOperationLease({
				state: state(),
				runtime,
				configRevision,
				signal: options?.signal,
				run: async (signal) => await ensureBrowserAvailableOnce(signal, getProfileLifecycle(runtime).generation, options)
			});
			return;
		}
		const key = ensureOptionsKey(options);
		for (;;) try {
			await enqueueProfileStart({
				state: state(),
				runtime,
				configRevision,
				key,
				signal: options?.signal,
				run: async (signal, generation) => {
					await ensureBrowserAvailableOnce(signal, generation, options);
				}
			});
			return;
		} catch (err) {
			if (!isProfileRestartRequiredError(err)) throw err;
			if (isWithinProfileOperationLease(runtime)) throw err;
			await beginProfileTransition({
				state: state(),
				runtime,
				reason: "managed Chrome restart required"
			});
		}
	};
	const stopRunningBrowser = async () => {
		const current = state();
		assertProfileLifecycleContext({
			state: current,
			runtime,
			configRevision
		});
		resetManagedLaunchFailure(runtime);
		return { stopped: (await beginProfileTransition({
			state: current,
			runtime,
			reason: "stop requested",
			managedChrome: "stop"
		})).stopped || profile.attachOnly || capabilities.isRemote };
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
function createProfileResetOps({ profile, state, runtime, configRevision, resolveOpenClawUserDataDir }) {
	const capabilities = getBrowserProfileCapabilities(profile);
	const resetProfile = async () => {
		if (!capabilities.supportsReset) throw new BrowserResetUnsupportedError(`reset-profile is only supported for local profiles (profile "${profile.name}" is remote).`);
		const userDataDir = resolveOpenClawUserDataDir(profile.name);
		assertProfileLifecycleContext({
			state: state(),
			runtime,
			configRevision
		});
		runtime.managedLaunchFailure = void 0;
		let result = {
			moved: false,
			from: userDataDir
		};
		await beginProfileTransition({
			state: state(),
			runtime,
			reason: "profile reset requested",
			managedChrome: "release-profile-data",
			afterCleanup: async () => {
				if (!fs.existsSync(userDataDir)) return;
				const moved = await movePathToTrash(userDataDir);
				result = {
					moved: true,
					from: userDataDir,
					to: moved
				};
			}
		});
		return result;
	};
	return { resetProfile };
}
//#endregion
//#region extensions/browser/src/browser/target-id.ts
/**
* Target id resolution helpers for Browser tab aliases and user-facing ids.
*/
const TAB_LABEL_PATTERN = /^[A-Za-z0-9_.:-]{1,64}$/;
/** Validate and normalize a user-facing tab label before browser mutation. */
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
/** Assign a stable friendly id and optional validated label to one tab. */
function assignTabAlias(params) {
	const label = params.label === void 0 ? void 0 : normalizeTabLabel(params.label);
	const aliases = getTabAliasState(params.profileState);
	let entry = aliases.byTargetId[params.tab.targetId];
	if (!entry) {
		entry = { tabId: `t${aliases.nextTabNumber}` };
		aliases.nextTabNumber += 1;
		aliases.byTargetId[params.tab.targetId] = entry;
	}
	if (label) {
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
function normalizeReplacementUrl(url) {
	return url?.trim() || void 0;
}
function findConfidentReplacement(params) {
	const { staleEntry, staleEntries, newCandidates } = params;
	if (staleEntries.length === 1 && newCandidates.length === 1) return newCandidates[0];
	const url = normalizeReplacementUrl(staleEntry.url);
	if (!url) return;
	const staleMatches = staleEntries.filter(([, entry]) => normalizeReplacementUrl(entry.url) === url);
	const candidates = newCandidates.filter((tab) => normalizeReplacementUrl(tab.url) === url);
	return staleMatches.length === 1 && candidates.length === 1 ? candidates[0] : void 0;
}
/** Reconcile stable aliases with the latest authoritative browser tab list. */
function assignTabAliases(profileState, tabs, migrateReplacements) {
	const aliases = getTabAliasState(profileState);
	const liveTargetIds = new Set(tabs.map((tab) => tab.targetId));
	const staleEntries = Object.entries(aliases.byTargetId).filter(([targetId]) => !liveTargetIds.has(targetId));
	const newCandidates = tabs.filter((tab) => !aliases.byTargetId[tab.targetId]);
	if (migrateReplacements) for (const [oldTargetId, staleEntry] of staleEntries) {
		const candidate = findConfidentReplacement({
			staleEntry,
			staleEntries,
			newCandidates
		});
		if (!candidate) continue;
		aliases.byTargetId[candidate.targetId] = staleEntry;
		delete aliases.byTargetId[oldTargetId];
		if (profileState.lastTargetId === oldTargetId) profileState.lastTargetId = candidate.targetId;
	}
	for (const targetId of Object.keys(aliases.byTargetId)) if (!liveTargetIds.has(targetId)) delete aliases.byTargetId[targetId];
	return tabs.map((tab) => assignTabAlias({
		profileState,
		tab
	}));
}
/** Resolves exact tab references first, then unique raw target-id prefixes. */
function resolveTargetIdFromTabs(input, tabs) {
	const needle = input.trim();
	if (!needle) return {
		ok: false,
		reason: "not_found"
	};
	const exactMatches = [...new Set(tabs.filter((tab) => tab.targetId === needle || tab.suggestedTargetId === needle || tab.tabId === needle || tab.label === needle).map((tab) => tab.targetId))];
	const onlyExact = exactMatches[0];
	if (exactMatches.length === 1 && onlyExact !== void 0) return {
		ok: true,
		targetId: onlyExact
	};
	if (exactMatches.length > 1) return {
		ok: false,
		reason: "ambiguous",
		matches: exactMatches
	};
	const lower = normalizeLowercaseStringOrEmpty(needle);
	const matches = tabs.map((t) => t.targetId).filter((id) => normalizeLowercaseStringOrEmpty(id).startsWith(lower));
	const only = matches.length === 1 ? matches[0] : void 0;
	if (only) return {
		ok: true,
		targetId: only
	};
	if (matches.length === 0) return {
		ok: false,
		reason: "not_found"
	};
	return {
		ok: false,
		reason: "ambiguous",
		matches
	};
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
		wsUrl: openedTab.wsUrl,
		...openedTab.wsLookup ? { wsLookup: openedTab.wsLookup } : {}
	};
	return merged;
}
/** Builds tab selection/focus/close operations for one resolved browser profile. */
function createProfileSelectionOps({ profile, runtime, getCdpControlPolicy, listTabs, openTab }) {
	const cdpHttpBase = normalizeCdpHttpBaseForJsonEndpoints(profile.cdpUrl);
	const capabilities = getBrowserProfileCapabilities(profile);
	const ensureTabAvailable = async (targetId, options) => {
		options?.signal?.throwIfAborted();
		let lastNonEmptyTabs = [];
		let lastListError;
		let sawSuccessfulList = false;
		let openedTab;
		const readTabs = async () => {
			try {
				const tabs = await listTabs(options);
				options?.signal?.throwIfAborted();
				sawSuccessfulList = true;
				if (tabs.length > 0) lastNonEmptyTabs = tabs;
				return tabs;
			} catch (err) {
				options?.signal?.throwIfAborted();
				lastListError = err;
				return [];
			}
		};
		const openWhenConfirmedEmpty = async (tabs) => {
			if (targetId !== void 0) return;
			if (!openedTab && sawSuccessfulList && lastNonEmptyTabs.length === 0 && tabs.length === 0) openedTab = await openTab("about:blank", options);
		};
		const candidateTabs = (tabs) => capabilities.supportsPerTabWs ? tabs.filter((tab) => Boolean(tab.wsUrl)) : tabs;
		const canResolveSelection = (tabs) => {
			const desiredTargetId = targetId ?? openedTab?.targetId ?? normalizeOptionalString(runtime.lastTargetId) ?? void 0;
			if (!desiredTargetId) return tabs.length > 0;
			if (targetId === void 0) return tabs.some((tab) => tab.targetId === desiredTargetId);
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
				await sleepWithAbort(100, options?.signal);
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
		const resolveById = (raw, targetOptions) => {
			if (targetOptions?.exactTargetId) return candidates.find((tab) => tab.targetId === raw) ?? null;
			const resolved = resolveTargetIdFromTabs(raw, candidates);
			if (!resolved.ok) {
				if (resolved.reason === "ambiguous") return "AMBIGUOUS";
				return null;
			}
			return candidates.find((t) => t.targetId === resolved.targetId) ?? null;
		};
		const stickyTargetId = normalizeOptionalString(runtime.lastTargetId);
		const pickDefault = () => {
			const last = stickyTargetId ?? "";
			const lastResolved = last ? resolveById(last, { exactTargetId: true }) : null;
			if (lastResolved && lastResolved !== "AMBIGUOUS") return lastResolved;
			if (last) return null;
			return candidates.find((t) => (t.type ?? "page") === "page") ?? candidates.at(0) ?? null;
		};
		const chosen = targetId ? resolveById(targetId) : pickDefault();
		if (chosen === "AMBIGUOUS") throw new BrowserTargetAmbiguousError();
		if (!chosen) throw new BrowserTabNotFoundError({ input: targetId ?? stickyTargetId });
		runtime.lastTargetId = chosen.targetId;
		return chosen;
	};
	const resolveTargetIdOrThrow = async (targetId, options) => {
		const tabs = await listTabs(options);
		if (options?.exactTargetId) {
			const exactTarget = tabs.find((tab) => tab.targetId === targetId);
			if (!exactTarget) throw new BrowserTabNotFoundError({ input: targetId });
			return exactTarget.targetId;
		}
		const resolved = resolveTargetIdFromTabs(targetId, tabs);
		if (!resolved.ok) {
			if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
			throw new BrowserTabNotFoundError({ input: targetId });
		}
		return resolved.targetId;
	};
	const focusTab = async (targetId, options) => {
		const resolvedTargetId = await resolveTargetIdOrThrow(targetId, options);
		if (capabilities.usesChromeMcp) {
			assertChromeMcpCdpTransportAllowed(profile, getCdpControlPolicy());
			const { focusChromeMcpTab } = await getChromeMcpModule();
			options?.signal?.throwIfAborted();
			await focusChromeMcpTab(profile.name, resolvedTargetId, profile, options);
			runtime.lastTargetId = resolvedTargetId;
			return;
		}
		if (capabilities.usesPersistentPlaywright || options?.assertCurrent) {
			const focusPageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.focusPageByTargetIdViaPlaywright;
			if (typeof focusPageByTargetIdViaPlaywright === "function") {
				options?.signal?.throwIfAborted();
				await focusPageByTargetIdViaPlaywright({
					cdpUrl: profile.cdpUrl,
					targetId: resolvedTargetId,
					ssrfPolicy: getCdpControlPolicy(),
					...options?.signal ? { signal: options.signal } : {},
					...options?.assertCurrent ? { assertCurrent: options.assertCurrent } : {}
				});
				runtime.lastTargetId = resolvedTargetId;
				return;
			}
			if (options?.assertCurrent) throw new Error("Playwright focus is unavailable for this dashboard tab");
		}
		options?.signal?.throwIfAborted();
		await fetchOk(appendCdpPath(cdpHttpBase, `/json/activate/${resolvedTargetId}`), void 0, options?.signal ? { signal: options.signal } : void 0, getCdpControlPolicy());
		runtime.lastTargetId = resolvedTargetId;
	};
	const closeTab = async (targetId, options) => {
		const resolvedTargetId = await resolveTargetIdOrThrow(targetId, options);
		assertBrowserDashboardTabCanClose(resolvedTargetId, profile.name);
		if (capabilities.usesChromeMcp) {
			assertChromeMcpCdpTransportAllowed(profile, getCdpControlPolicy());
			const { closeChromeMcpTab } = await getChromeMcpModule();
			options?.signal?.throwIfAborted();
			await closeChromeMcpTab(profile.name, resolvedTargetId, profile, options);
		} else {
			let closedViaPlaywright = false;
			if (capabilities.usesPersistentPlaywright) {
				const closePageByTargetIdViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.closePageByTargetIdViaPlaywright;
				if (typeof closePageByTargetIdViaPlaywright === "function") {
					options?.signal?.throwIfAborted();
					assertBrowserDashboardTabCanClose(resolvedTargetId, profile.name);
					await closePageByTargetIdViaPlaywright({
						cdpUrl: profile.cdpUrl,
						targetId: resolvedTargetId,
						ssrfPolicy: getCdpControlPolicy(),
						...options?.signal ? { signal: options.signal } : {}
					});
					closedViaPlaywright = true;
				}
			}
			if (!closedViaPlaywright) {
				options?.signal?.throwIfAborted();
				assertBrowserDashboardTabCanClose(resolvedTargetId, profile.name);
				await fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${resolvedTargetId}`), void 0, options?.signal ? { signal: options.signal } : void 0, getCdpControlPolicy());
			}
		}
		if (runtime.lastTargetId === resolvedTargetId) runtime.lastTargetId = null;
		return resolvedTargetId;
	};
	return {
		ensureTabAvailable,
		focusTab,
		closeTab
	};
}
//#endregion
//#region extensions/browser/src/browser/cdp-target-filter.ts
/**
* CDP target filtering helpers.
*
* Browser-internal pages cannot be reliably automated as user content, so tab
* selection filters them before exposing targets to browser actions.
*/
const BROWSER_INTERNAL_TARGET_URL_PREFIXES = [
	"chrome://",
	"chrome-untrusted://",
	"devtools://",
	"edge://",
	"brave://",
	"vivaldi://",
	"opera://"
];
/** Return true for browser-owned chrome/devtools/internal URLs. */
function isBrowserInternalTargetUrl(url) {
	const normalized = url?.trim().toLowerCase() ?? "";
	return BROWSER_INTERNAL_TARGET_URL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}
/** Return true when a CDP page target should be selectable by user-facing actions. */
function isSelectableCdpBrowserTarget(target) {
	return target.type === "page" && !isBrowserInternalTargetUrl(target.url);
}
//#endregion
//#region extensions/browser/src/browser/server-context.tab-ops.ts
/**
* Browser tab listing, opening, labeling, and alias management for one profile.
*/
/** Normalize a reported CDP WebSocket URL against the configured endpoint. */
function normalizeWsUrl(raw, cdpBaseUrl) {
	if (!raw) return;
	try {
		return normalizeCdpWsUrl(raw, cdpBaseUrl);
	} catch {
		return raw;
	}
}
/** Builds list/open/label tab operations for one resolved browser profile. */
function createProfileTabOps({ profile, state, runtime }) {
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
	const readTabs = async (options) => {
		if (capabilities.usesChromeMcp) {
			assertChromeMcpCdpTransportAllowed(profile, getCdpControlPolicy());
			const { listChromeMcpTabs } = await getChromeMcpModule();
			return await listChromeMcpTabs(profile.name, profile, options);
		}
		if (capabilities.usesPersistentPlaywright) {
			const listPagesViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.listPagesViaPlaywright;
			if (typeof listPagesViaPlaywright === "function") {
				const ssrfPolicy = getCdpControlPolicy();
				const resolved = state().resolved;
				const enumerationBudgetMs = typeof options?.timeoutMs === "number" && Number.isFinite(options.timeoutMs) ? options.timeoutMs : resolved.actionTimeoutMs;
				const timeoutMs = Math.max(enumerationBudgetMs, resolved.remoteCdpHandshakeTimeoutMs);
				await assertCdpEndpointAllowed(profile.cdpUrl, ssrfPolicy);
				const pages = await listPagesViaPlaywright({
					cdpUrl: profile.cdpUrl,
					ssrfPolicy,
					timeoutMs,
					...capabilities.requiresCompleteTargetEnumeration ? { requireCompleteTargetList: true } : {},
					...options?.signal ? { signal: options.signal } : {}
				});
				const webExtensionTabIds = profile.driver === "extension" ? await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), Math.min(timeoutMs, resolved.remoteCdpTimeoutMs), options?.signal ? { signal: options.signal } : void 0, ssrfPolicy).then((targets) => new Map(targets.flatMap((target) => typeof target.id === "string" && typeof target.tabId === "number" && Number.isSafeInteger(target.tabId) && target.tabId >= 0 ? [[target.id, target.tabId]] : []))).catch(() => {
					options?.signal?.throwIfAborted();
					return /* @__PURE__ */ new Map();
				}) : void 0;
				return pages.filter(isSelectableCdpBrowserTarget).map((p) => {
					const webExtensionTabId = webExtensionTabIds?.get(p.targetId);
					const tab = {
						targetId: p.targetId,
						title: p.title,
						url: p.url,
						type: p.type
					};
					if (webExtensionTabId !== void 0) tab.webExtensionTabId = webExtensionTabId;
					return tab;
				});
			}
		}
		const raw = await fetchJson(appendCdpPath(cdpHttpBase, "/json/list"), options?.timeoutMs, options?.signal ? { signal: options.signal } : void 0, getCdpControlPolicy());
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
			if (tab.wsUrl) {
				const wsPin = await assertCdpEndpointAllowed(tab.wsUrl, cdpControlPolicy, {
					source: "discovered",
					configuredUrl: profile.cdpUrl
				});
				if (wsPin?.lookup) tab.wsLookup = wsPin.lookup;
			}
			tabs.push(tab);
		}
		return tabs;
	};
	const listTabs = async (options) => {
		const tabs = await readTabs(options);
		options?.signal?.throwIfAborted();
		return assignTabAliases(runtime, tabs, !capabilities.usesChromeMcp);
	};
	const enforceManagedTabLimit = async (keepTargetId, options) => {
		if (!capabilities.supportsManagedTabLimit || state().resolved.attachOnly || !runtime.running) return;
		const pageTabs = await listTabs(options).then((tabs) => tabs.filter((tab) => (tab.type ?? "page") === "page")).catch(() => []);
		if (pageTabs.length <= 8) return;
		const retained = readBrowserDashboardTabs();
		const candidates = pageTabs.filter((tab) => tab.targetId !== keepTargetId && !findRetainedBrowserDashboardTab(tab.targetId, profile.name, retained));
		const excessCount = pageTabs.length - 8;
		for (const tab of candidates.slice(0, excessCount)) {
			options?.signal?.throwIfAborted();
			if (findRetainedBrowserDashboardTab(tab.targetId, profile.name)) continue;
			await fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${tab.targetId}`), void 0, void 0, getCdpControlPolicy()).catch(() => {});
		}
	};
	const triggerManagedTabLimit = (keepTargetId, options) => {
		enforceManagedTabLimit(keepTargetId, options).catch(() => {});
	};
	const adoptValidatedTab = (tab, options) => {
		options?.signal?.throwIfAborted();
		const adopted = assignTabAlias({
			profileState: runtime,
			tab,
			label: options?.label
		});
		runtime.lastTargetId = tab.targetId;
		triggerManagedTabLimit(tab.targetId, options);
		return adopted;
	};
	const withTabOwnership = async (tab, options) => {
		const cdpTimeouts = getRemoteCdpActionTimeouts();
		const ownership = await resolveCdpTabOwnership({
			profileName: profile.name,
			cdpUrl: profile.cdpUrl,
			nativeTargetId: tab.targetId,
			signal: options?.signal,
			timeoutMs: cdpTimeouts?.httpTimeoutMs,
			ssrfPolicy: getCdpControlPolicy()
		});
		if (options?.requireDurableOwnership && ownership.status !== "durable") throw new Error("Browser could not verify durable ownership for the new dashboard tab");
		return {
			...tab,
			ownership
		};
	};
	const openTab = async (url, opts) => {
		opts?.signal?.throwIfAborted();
		const normalizedLabel = opts?.label === void 0 ? void 0 : normalizeTabLabel(opts.label);
		const ssrfPolicyOpts = getNavigationPolicy();
		const cdpPolicy = getCdpControlPolicy();
		const cleanupTimeoutMs = state().resolved.remoteCdpTimeoutMs;
		if (capabilities.usesChromeMcp) {
			await assertBrowserNavigationAllowed({
				url,
				...ssrfPolicyOpts
			});
			assertChromeMcpCdpTransportAllowed(profile, cdpPolicy);
			const { openChromeMcpTab } = await getChromeMcpModule();
			const cdpTimeouts = getRemoteCdpActionTimeouts();
			const page = await openChromeMcpTab(profile.name, url, profile, {
				signal: opts?.signal,
				timeoutMs: opts?.timeoutMs,
				cdpPolicy,
				...cdpTimeouts ? { cdpTimeouts } : {}
			});
			await assertBrowserNavigationResultAllowed({
				url: page.url,
				...ssrfPolicyOpts
			});
			return adoptValidatedTab(page, {
				...opts,
				label: normalizedLabel
			});
		}
		let createdTargetId;
		let closeCreatedPage;
		try {
			if (capabilities.usesPersistentPlaywright) {
				const createPageViaPlaywright = (await getPwAiModule({ mode: "strict" }))?.createPageViaPlaywright;
				if (typeof createPageViaPlaywright === "function") {
					const page = await createPageViaPlaywright({
						cdpUrl: profile.cdpUrl,
						url,
						cdpPolicy,
						...opts?.signal ? { signal: opts.signal } : {},
						...ssrfPolicyOpts
					});
					closeCreatedPage = page.close;
					createdTargetId = page.targetId;
					return adoptValidatedTab(await withTabOwnership({
						targetId: page.targetId,
						title: page.title,
						url: page.url,
						type: page.type
					}, opts), {
						...opts,
						label: normalizedLabel
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
				ssrfPolicy: cdpPolicy,
				waitForNavigationResult: true
			};
			if (cdpActionTimeouts) createTargetOpts.timeouts = cdpActionTimeouts;
			if (opts?.signal) createTargetOpts.signal = opts.signal;
			const createdViaCdp = await createTargetViaCdp(createTargetOpts).catch(() => null);
			createdTargetId = createdViaCdp?.targetId;
			opts?.signal?.throwIfAborted();
			if (createdViaCdp) {
				if (!createdViaCdp.finalUrl) return await withTabOwnership({
					targetId: createdViaCdp.targetId,
					title: "",
					url,
					type: "page"
				}, opts);
				await assertBrowserNavigationResultAllowed({
					url: createdViaCdp.finalUrl,
					...ssrfPolicyOpts
				});
				const deadline = Date.now() + OPEN_TAB_DISCOVERY_WINDOW_MS;
				while (Date.now() < deadline) {
					opts?.signal?.throwIfAborted();
					const found = (await readTabs(opts).catch(() => [])).find((t) => t.targetId === createdViaCdp.targetId);
					if (found) {
						await assertBrowserNavigationResultAllowed({
							url: found.url,
							...ssrfPolicyOpts
						});
						return adoptValidatedTab(await withTabOwnership({
							...found,
							url: createdViaCdp.finalUrl
						}, opts), {
							...opts,
							label: normalizedLabel
						});
					}
					await sleepWithAbort(100, opts?.signal);
				}
				opts?.signal?.throwIfAborted();
				return await withTabOwnership({
					targetId: createdViaCdp.targetId,
					title: "",
					url: createdViaCdp.finalUrl,
					type: "page"
				}, opts);
			}
			const encoded = encodeURIComponent(url);
			const endpointUrl = new URL(appendCdpPath(cdpHttpBase, "/json/new"));
			const endpoint = endpointUrl.search ? (() => {
				endpointUrl.searchParams.set("url", url);
				return endpointUrl.toString();
			})() : `${endpointUrl.toString()}?${encoded}`;
			opts?.signal?.throwIfAborted();
			const created = await fetchJson(endpoint, cdpActionTimeouts?.httpTimeoutMs ?? 1500, { method: "PUT" }, getCdpControlPolicy()).catch(async (err) => {
				if (String(err).includes("HTTP 405")) return await fetchJson(endpoint, cdpActionTimeouts?.httpTimeoutMs ?? 1500, void 0, getCdpControlPolicy());
				throw err;
			});
			createdTargetId = created.id;
			opts?.signal?.throwIfAborted();
			if (!created.id) throw new Error("Failed to open tab (missing id)");
			const resolvedUrl = created.url ?? url;
			if (!isSelectableCdpBrowserTarget({
				url: resolvedUrl,
				type: created.type
			})) throw new Error("Failed to open tab (non-selectable target)");
			await assertBrowserNavigationResultAllowed({
				url: resolvedUrl,
				...ssrfPolicyOpts
			});
			const wsUrl = normalizeWsUrl(created.webSocketDebuggerUrl, profile.cdpUrl);
			const wsPin = wsUrl ? await assertCdpEndpointAllowed(wsUrl, getCdpControlPolicy(), {
				source: "discovered",
				configuredUrl: profile.cdpUrl
			}) : void 0;
			const committedUrl = wsUrl ? await waitForCdpCommittedNavigationUrl({
				wsUrl,
				configuredCdpUrl: profile.cdpUrl,
				cdpPolicy: getCdpControlPolicy(),
				requestedUrl: url,
				signal: opts?.signal,
				timeouts: cdpActionTimeouts
			}) : void 0;
			opts?.signal?.throwIfAborted();
			if (!committedUrl) return await withTabOwnership({
				targetId: created.id,
				title: created.title ?? "",
				url: resolvedUrl,
				wsUrl,
				...wsPin?.lookup ? { wsLookup: wsPin.lookup } : {},
				type: created.type
			}, opts);
			await assertBrowserNavigationResultAllowed({
				url: committedUrl,
				...ssrfPolicyOpts
			});
			return adoptValidatedTab(await withTabOwnership({
				targetId: created.id,
				title: created.title ?? "",
				url: committedUrl,
				wsUrl,
				...wsPin?.lookup ? { wsLookup: wsPin.lookup } : {},
				type: created.type
			}, opts), {
				...opts,
				label: normalizedLabel
			});
		} catch (openError) {
			if (closeCreatedPage) await closeCreatedPage().catch(() => {});
			else if (createdTargetId) await fetchOk(appendCdpPath(cdpHttpBase, `/json/close/${encodeURIComponent(createdTargetId)}`), cleanupTimeoutMs, void 0, cdpPolicy).catch(() => {});
			throw openError;
		}
	};
	const labelTab = async (targetId, label, options) => {
		const normalizedLabel = normalizeTabLabel(label);
		const tabs = await listTabs(options);
		const resolved = resolveTargetIdFromTabs(targetId, tabs);
		if (!resolved.ok) {
			if (resolved.reason === "ambiguous") throw new BrowserTargetAmbiguousError();
			throw new BrowserTabNotFoundError({ input: targetId });
		}
		const tab = tabs.find((candidate) => candidate.targetId === resolved.targetId);
		if (!tab) throw new BrowserTabNotFoundError({ input: targetId });
		return assignTabAlias({
			profileState: runtime,
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
const profileOperationRunners = /* @__PURE__ */ new WeakMap();
/** Internal actor lease entrypoint; not part of the public Browser runtime API. */
function runProfileContextOperation(profileCtx, signal, run, options) {
	const runner = profileOperationRunners.get(profileCtx);
	if (!runner) throw new BrowserProfileUnavailableError("Browser profile context is no longer active.");
	return runner(signal, run, options);
}
/** Preserve custom route contexts while leasing contexts created by this runtime. */
function withProfileContextOperation(profileCtx, signal, run) {
	const runner = profileOperationRunners.get(profileCtx);
	if (!runner) return run(signal ?? new AbortController().signal);
	return runner(signal, async (leasedSignal) => await run(leasedSignal));
}
/**
* Create a profile-scoped context for browser operations.
*/
function createProfileContext(opts, runtimeState, profileState, profile) {
	const state = () => {
		if (opts.getState() !== runtimeState || !isBrowserRuntimeRunning(runtimeState)) throw new BrowserProfileUnavailableError("Browser runtime changed or is stopping.");
		return runtimeState;
	};
	const configRevision = getProfileLifecycle(profileState).configRevision;
	const rawTabOps = createProfileTabOps({
		profile,
		state,
		runtime: profileState
	});
	const rawAvailability = createProfileAvailability({
		opts,
		profile,
		state,
		runtime: profileState,
		configRevision
	});
	const rawSelection = createProfileSelectionOps({
		profile,
		runtime: profileState,
		getCdpControlPolicy: () => resolveCdpControlPolicy(profile, state().resolved.ssrfPolicy),
		listTabs: rawTabOps.listTabs,
		openTab: rawTabOps.openTab
	});
	const rawReset = createProfileResetOps({
		profile,
		state,
		runtime: profileState,
		configRevision,
		resolveOpenClawUserDataDir
	});
	const withLease = async (callerSignal, run, options) => await withProfileOperationLease({
		state: state(),
		runtime: profileState,
		configRevision,
		signal: callerSignal,
		run: async (lifecycleSignal) => await run(lifecycleSignal, profileState),
		commit: options?.commit
	});
	const { ensureBrowserAvailable, stopRunningBrowser } = rawAvailability;
	const context = {
		profile,
		ensureBrowserAvailable,
		ensureTabAvailable: async (targetId, options) => {
			if (targetId === void 0) await ensureBrowserAvailable({ signal: options?.signal });
			return await withLease(options?.signal, async (signal) => {
				if (targetId !== void 0 && !await rawAvailability.isReachable(void 0, { signal })) throw new BrowserProfileUnavailableError(`Browser profile "${profile.name}" is not running. Start the browser or open a new tab, then select a current target.`);
				return await rawSelection.ensureTabAvailable(targetId, {
					...options,
					signal
				});
			});
		},
		isHttpReachable: async (timeoutMs, callerSignal) => await withLease(callerSignal, async (signal) => await rawAvailability.isHttpReachable(timeoutMs, signal)),
		isTransportAvailable: async (timeoutMs, callerSignal, pageProbe) => await withLease(callerSignal, async (signal) => await rawAvailability.isTransportAvailable(timeoutMs, signal, pageProbe)),
		isReachable: async (timeoutMs, options) => await withLease(options?.signal, async (signal) => await rawAvailability.isReachable(timeoutMs, {
			...options,
			signal
		})),
		listTabs: async (options) => await withLease(options?.signal, async (signal) => await rawTabOps.listTabs({
			...options,
			signal
		})),
		openTab: async (url, options) => await withLease(options?.signal, async (signal) => await rawTabOps.openTab(url, {
			...options,
			signal
		})),
		labelTab: async (targetId, label) => await withLease(void 0, async (signal) => await rawTabOps.labelTab(targetId, label, { signal })),
		focusTab: async (targetId, options) => await withLease(options?.signal, async (signal) => await rawSelection.focusTab(targetId, {
			...options,
			signal
		})),
		closeTab: async (targetId, options) => await withLease(options?.signal, async (signal) => await rawSelection.closeTab(targetId, {
			...options,
			signal
		})),
		stopRunningBrowser,
		resetProfile: rawReset.resetProfile
	};
	profileOperationRunners.set(context, withLease);
	return context;
}
/** Creates the Browser route context used by control-server route handlers. */
function createBrowserRouteContext(opts) {
	const refreshConfigFromDisk = opts.refreshConfigFromDisk === true;
	const state = () => {
		const current = opts.getState();
		if (!current) throw new BrowserProfileUnavailableError("Browser server not started.");
		if (!isBrowserRuntimeRunning(current)) throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
		refreshResolvedBrowserConfigFromDisk({
			current,
			refreshConfigFromDisk
		});
		return current;
	};
	const forProfile = (profileName) => {
		const current = state();
		const name = profileName ?? current.resolved.defaultProfile;
		const profile = resolveProfile(current.resolved, name);
		if (!profile) {
			const available = Object.keys(current.resolved.profiles).join(", ");
			throw new BrowserProfileNotFoundError(`Profile "${name}" not found. Available profiles: ${available || "(none)"}`);
		}
		return createProfileContext(opts, current, getOrCreateProfileRuntime(current, profile), profile);
	};
	const listProfiles = async () => {
		const current = state();
		const result = [];
		for (const name of listKnownProfileNames(current)) {
			let profileState = current.profiles.get(name);
			const profile = resolveProfile(current.resolved, name) ?? profileState?.profile;
			if (!profile) continue;
			profileState ??= getOrCreateProfileRuntime(current, profile);
			let statusProfile = profile;
			let unavailableReason = null;
			let running = false;
			let tabCount = 0;
			for (let attempt = 0; attempt < 2; attempt += 1) {
				statusProfile = profileState.profile;
				const profileCtx = createProfileContext(opts, current, profileState, statusProfile);
				try {
					const snapshot = await runProfileContextOperation(profileCtx, void 0, async (signal, runtime) => {
						const activeProfile = runtime.profile;
						const capabilities = getBrowserProfileCapabilities(activeProfile);
						let activeRunning;
						let activeTabCount = 0;
						if (capabilities.usesChromeMcp) try {
							activeRunning = await profileCtx.isTransportAvailable(300, signal, { onResult: (observedTabCount) => activeTabCount = observedTabCount ?? 0 });
						} catch {
							activeRunning = false;
						}
						else if (runtime.running) {
							activeRunning = true;
							try {
								activeTabCount = (await profileCtx.listTabs({ signal })).filter((tab) => tab.type === "page").length;
							} catch {}
						} else try {
							const probeTimeoutMs = usesFastLoopbackCdpProbeClass({
								profileIsLoopback: activeProfile.cdpIsLoopback,
								attachOnly: activeProfile.attachOnly
							}) ? 200 : current.resolved.remoteCdpTimeoutMs;
							activeRunning = capabilities.mode === "local-extension" ? await profileCtx.isTransportAvailable(probeTimeoutMs, signal) : await isChromeReachable(activeProfile.cdpUrl, probeTimeoutMs, resolveCdpReachabilityPolicy(activeProfile, current.resolved.ssrfPolicy), signal);
							if (activeRunning) activeTabCount = (await profileCtx.listTabs({ signal }).catch(() => [])).filter((tab) => tab.type === "page").length;
						} catch {
							activeRunning = false;
						}
						signal.throwIfAborted();
						return {
							profile: activeProfile,
							running: activeRunning,
							tabCount: activeTabCount
						};
					});
					statusProfile = snapshot.profile;
					running = snapshot.running;
					tabCount = snapshot.tabCount;
					break;
				} catch (err) {
					if (attempt === 0) continue;
					statusProfile = profileState.profile;
					const actor = getProfileLifecycle(profileState);
					unavailableReason = actor.blockedReason ?? actor.transitionReason ?? actor.terminal;
					if (!unavailableReason && !toBrowserErrorResponse(err)) throw err;
					running = Boolean(profileState.running);
					tabCount = 0;
				}
			}
			const capabilities = getBrowserProfileCapabilities(statusProfile);
			result.push({
				name,
				transport: capabilities.usesChromeMcp ? "chrome-mcp" : capabilities.mode === "local-extension" ? "extension" : "cdp",
				cdpPort: capabilities.usesChromeMcp ? null : statusProfile.cdpPort,
				cdpUrl: statusProfile.cdpUrl ? redactCdpUrl(statusProfile.cdpUrl) ?? null : null,
				color: statusProfile.color,
				driver: statusProfile.driver,
				running,
				tabCount,
				isDefault: name === current.resolved.defaultProfile,
				isRemote: !statusProfile.cdpIsLoopback,
				missingFromConfig: getOwnBrowserProfile(current.resolved.profiles, name) === void 0 || void 0,
				reconcileReason: unavailableReason
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
		ensureBrowserAvailable: (options) => getDefaultContext().ensureBrowserAvailable(options),
		ensureTabAvailable: (targetId, options) => getDefaultContext().ensureTabAvailable(targetId, options),
		isHttpReachable: (timeoutMs, signal) => getDefaultContext().isHttpReachable(timeoutMs, signal),
		isTransportAvailable: (timeoutMs, signal, pageProbe) => getDefaultContext().isTransportAvailable(timeoutMs, signal, pageProbe),
		isReachable: (timeoutMs, options) => getDefaultContext().isReachable(timeoutMs, options),
		listTabs: (options) => getDefaultContext().listTabs(options),
		openTab: (url, optsLocal) => getDefaultContext().openTab(url, optsLocal),
		labelTab: (targetId, label) => getDefaultContext().labelTab(targetId, label),
		focusTab: (targetId, options) => getDefaultContext().focusTab(targetId, options),
		closeTab: (targetId, options) => getDefaultContext().closeTab(targetId, options),
		stopRunningBrowser: () => getDefaultContext().stopRunningBrowser(),
		resetProfile: () => getDefaultContext().resetProfile(),
		mapTabError
	};
}
//#endregion
export { loadBrowserConfigForRuntimeRefresh as a, resolveTargetIdFromTabs as i, runProfileContextOperation as n, withProfileContextOperation as r, createBrowserRouteContext as t };
