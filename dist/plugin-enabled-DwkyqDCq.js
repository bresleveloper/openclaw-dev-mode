import { t as collectErrorGraphCandidates } from "./errors-DCRXIYSQ.js";
import { d as registerUnhandledRejectionHandler } from "./unhandled-rejections-QMGVkiWd.js";
import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-6HQcbL-X.js";
import { a as isSubagentSessionKey, i as isCronSessionKey, n as isAcpSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { i as getRuntimeConfig } from "./io-BJfjPmGW.js";
import "./error-runtime-Ck1CsJM-.js";
import "./runtime-env-oOti2yy7.js";
import "./routing-DGrdyZ4S.js";
import { n as resolveBrowserConfig } from "./config-D088GH3E.js";
import "./config-rGSRaD_8.js";
import { n as sweepTrackedBrowserTabs } from "./session-tab-registry-BmRzpwjt.js";
import { n as getPwAiModule } from "./target-id-Drr50cuo.js";
import { n as listKnownProfileNames, t as createBrowserRouteContext } from "./server-context-DYp75lTA.js";
import { o as stopOpenClawChrome } from "./chrome-0jrMaKKx.js";
import { t as isPwAiLoaded } from "./pw-ai-state-B4Mk01M0.js";
//#region extensions/browser/src/browser/server-lifecycle.ts
/**
* Browser server lifecycle helpers for profile shutdown.
*/
/** Stops every known Browser profile during runtime shutdown. */
async function stopKnownBrowserProfiles(params) {
	const current = params.getState();
	if (!current) return;
	const ctx = createBrowserRouteContext({
		getState: params.getState,
		refreshConfigFromDisk: true
	});
	try {
		for (const name of listKnownProfileNames(current)) try {
			const runtime = current.profiles.get(name);
			if (runtime?.running) {
				await stopOpenClawChrome(runtime.running);
				runtime.running = null;
				continue;
			}
			await ctx.forProfile(name).stopRunningBrowser();
		} catch {}
	} catch (err) {
		params.onWarn(`openclaw browser stop failed: ${String(err)}`);
	}
}
//#endregion
//#region extensions/browser/src/browser/session-tab-cleanup.ts
/**
* Periodic cleanup for browser tabs tracked to primary OpenClaw sessions.
*/
const MIN_SWEEP_INTERVAL_MS = 6e4;
function minutesToMs(minutes) {
	return Math.max(0, Math.floor(minutes * 6e4));
}
/** Returns true for user-facing sessions whose tabs should be tracked for cleanup. */
function isPrimaryTrackedBrowserSessionKey(sessionKey) {
	return !isSubagentSessionKey(sessionKey) && !isCronSessionKey(sessionKey) && !isAcpSessionKey(sessionKey);
}
function resolveBrowserTabCleanupRuntimeConfig() {
	const cfg = getRuntimeConfig();
	return resolveBrowserConfig(cfg.browser, cfg).tabCleanup;
}
/** Runs one Browser tab cleanup sweep from runtime config or injected test config. */
async function runTrackedBrowserTabCleanupOnce(params) {
	const cleanup = params?.cleanup ?? resolveBrowserTabCleanupRuntimeConfig();
	if (!cleanup.enabled) return 0;
	return await sweepTrackedBrowserTabs({
		now: params?.now,
		idleMs: minutesToMs(cleanup.idleMinutes),
		maxTabsPerSession: cleanup.maxTabsPerSession,
		sessionFilter: isPrimaryTrackedBrowserSessionKey,
		closeTab: params?.closeTab,
		onWarn: params?.onWarn
	});
}
/** Starts the recurring Browser tab cleanup timer and returns its disposer. */
function startTrackedBrowserTabCleanupTimer(params) {
	let stopped = false;
	let timer = null;
	let running = null;
	const schedule = () => {
		if (stopped) return;
		let sweepMinutes = 5;
		try {
			sweepMinutes = resolveBrowserTabCleanupRuntimeConfig().sweepMinutes;
		} catch (err) {
			params.onWarn(`failed to resolve browser tab cleanup config: ${String(err)}`);
		}
		timer = setTimeout(run, Math.max(MIN_SWEEP_INTERVAL_MS, minutesToMs(sweepMinutes)));
		timer.unref?.();
	};
	const run = () => {
		if (stopped) return;
		if (!running) {
			running = runTrackedBrowserTabCleanupOnce({ onWarn: params.onWarn }).finally(() => {
				running = null;
				schedule();
			});
			return;
		}
		schedule();
	};
	schedule();
	return () => {
		stopped = true;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	};
}
//#endregion
//#region extensions/browser/src/browser/unhandled-rejections.ts
/**
* Browser-specific unhandled rejection filter for benign Playwright dialog
* races.
*/
const PLAYWRIGHT_DIALOG_METHODS = new Set(["Page.handleJavaScriptDialog", "Dialog.handleJavaScriptDialog"]);
const NO_DIALOG_MESSAGE = "no dialog is showing";
function readMessage(err) {
	if (typeof err === "string") return err;
	if (!err || typeof err !== "object") return "";
	const message = err.message;
	return typeof message === "string" ? message : "";
}
function readPlaywrightMethod(err) {
	if (!err || typeof err !== "object") return;
	const method = err.method;
	return typeof method === "string" ? method : void 0;
}
/** Detects Playwright "no dialog is showing" races that can escape as rejections. */
function isPlaywrightDialogRaceUnhandledRejection(reason) {
	for (const candidate of collectErrorGraphCandidates(reason, (current) => [
		current.cause,
		current.reason,
		current.original,
		current.error,
		current.data,
		...Array.isArray(current.errors) ? current.errors : []
	])) {
		const message = readMessage(candidate);
		if (!message.toLowerCase().includes(NO_DIALOG_MESSAGE)) continue;
		const method = readPlaywrightMethod(candidate);
		if (method && PLAYWRIGHT_DIALOG_METHODS.has(method)) return true;
		for (const playwrightMethod of PLAYWRIGHT_DIALOG_METHODS) if (message.includes(playwrightMethod)) return true;
	}
	return false;
}
/** Installs the Browser unhandled-rejection filter and returns its disposer. */
function registerBrowserUnhandledRejectionHandler() {
	return registerUnhandledRejectionHandler(isPlaywrightDialogRaceUnhandledRejection);
}
//#endregion
//#region extensions/browser/src/browser/runtime-lifecycle.ts
/** Creates Browser server state and starts runtime-wide cleanup handlers. */
async function createBrowserRuntimeState(params) {
	const state = {
		server: params.server ?? null,
		port: params.port,
		resolved: params.resolved,
		profiles: /* @__PURE__ */ new Map()
	};
	state.stopTrackedTabCleanup = startTrackedBrowserTabCleanupTimer({ onWarn: params.onWarn });
	state.stopUnhandledRejectionHandler = registerBrowserUnhandledRejectionHandler();
	return state;
}
/** Stops Browser profiles, the optional HTTP server, and loaded Playwright state. */
async function stopBrowserRuntime(params) {
	if (!params.current) return;
	try {
		params.current.stopTrackedTabCleanup?.();
		await stopKnownBrowserProfiles({
			getState: params.getState,
			onWarn: params.onWarn
		});
		if (params.closeServer && params.current.server) await new Promise((resolve) => {
			params.current?.server?.close(() => resolve());
		});
		params.clearState();
		if (!isPwAiLoaded()) return;
		try {
			await (await getPwAiModule({ mode: "soft" }))?.closePlaywrightBrowserConnection();
		} catch {}
	} finally {
		params.current.stopUnhandledRejectionHandler?.();
	}
}
//#endregion
//#region extensions/browser/src/browser-control-state.ts
let state = null;
let owner = null;
function getBrowserControlState() {
	return state;
}
/** Create a route context bound to the current shared browser runtime. */
function createBrowserControlContext() {
	return createBrowserRouteContext({
		getState: () => state,
		refreshConfigFromDisk: true
	});
}
/** Start or attach the shared browser runtime for either the server or service owner. */
async function ensureBrowserControlRuntime(params) {
	if (state) {
		if (params.server) {
			state.server = params.server;
			state.port = params.port;
			state.resolved = {
				...params.resolved,
				controlPort: params.port
			};
			owner = "server";
		}
		return state;
	}
	state = await createBrowserRuntimeState({
		server: params.server ?? null,
		port: params.port,
		resolved: params.resolved,
		onWarn: params.onWarn
	});
	owner = params.owner;
	return state;
}
/** Stop the shared browser runtime when the requesting owner is allowed to do so. */
async function stopBrowserControlRuntime(params) {
	const current = state;
	if (!current) return;
	if (params.requestedBy === "service" && current.server && owner === "server") return;
	await stopBrowserRuntime({
		current,
		getState: () => state,
		clearState: () => {
			state = null;
			owner = null;
		},
		closeServer: params.closeServer,
		onWarn: params.onWarn
	});
}
//#endregion
//#region extensions/browser/src/plugin-enabled.ts
/** Returns whether the bundled Browser plugin is effectively enabled by config. */
function isDefaultBrowserPluginEnabled(cfg) {
	return resolveEffectiveEnableState({
		id: "browser",
		origin: "bundled",
		config: normalizePluginsConfig(cfg.plugins),
		rootConfig: cfg,
		enabledByDefault: true
	}).enabled;
}
//#endregion
export { stopBrowserControlRuntime as a, getBrowserControlState as i, createBrowserControlContext as n, createBrowserRuntimeState as o, ensureBrowserControlRuntime as r, stopBrowserRuntime as s, isDefaultBrowserPluginEnabled as t };
