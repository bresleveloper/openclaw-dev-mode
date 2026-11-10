import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./logging-core-CsXmxYo2.mjs";
import { A as sameVolatileSessionTab, C as withoutBrowserSessionTabCleanup, F as browserSessionTabNativeIdentity, K as captureBrowserSessionTabAuthority, L as resolveBrowserSessionKey, M as volatileSessionTabTargetKey, N as volatileTabCleanupByTarget, O as readColdNativeActivity, P as volatileTabsBySession, T as deleteVolatileRegistrations, X as readCurrentBrowserState, Y as isBrowserStateRuntimeCurrent, f as parseBrowserSessionTabRecord, g as readBrowserDashboardStopIntents, i as dispatchBrowserSessionTabIfCurrent, j as volatileRegistrationsForTarget, q as getBrowserStateRuntime, r as deleteBrowserSessionTabIf, v as sameBrowserSessionTabRecord, w as activeDurableStorageKeys, x as withBrowserSessionTabOperation, y as updateBrowserSessionTab } from "./session-tab-store-BOOOSxTp.mjs";
import "./constants-CxIE9Xhk.mjs";
import { a as trackSessionBrowserTab, i as touchSessionBrowserTab, n as readDurableTabs, o as untrackSessionBrowserTab, r as resolveVolatile, t as filterTrackedSessionBrowserTabs } from "./session-tab-tracking-DGDKzU-B.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/browser/src/browser/session-tab-cleanup-claim.ts
/**
* Durable tab cleanup owns claims, fingerprint verification, close, and retirement.
* A concurrent touch or competing sweep cannot delete another generation's row.
*/
const log = createSubsystemLogger("browser").child("service").child("session-tabs");
const deferredTabDiagnosticsSymbol = Symbol.for("openclaw.browser.session-tabs.deferred-diagnostics");
/** Defensive bound: live deferrals are already forgotten as their rows settle. */
const MAX_DEFERRED_TAB_DIAGNOSTICS = 512;
function deferredTabDiagnostics() {
	return resolveGlobalMap(deferredTabDiagnosticsSymbol);
}
/** Records a deferral, returning true when the row has not reported it yet. */
function recordDeferredTabDiagnostic(tab, reason) {
	const diagnostics = deferredTabDiagnostics();
	if (diagnostics.get(tab.storageKey) === reason) return false;
	diagnostics.delete(tab.storageKey);
	diagnostics.set(tab.storageKey, reason);
	if (diagnostics.size > MAX_DEFERRED_TAB_DIAGNOSTICS) {
		const oldest = diagnostics.keys().next();
		if (!oldest.done) diagnostics.delete(oldest.value);
	}
	return true;
}
/** Lets a settled row report the next outage instead of staying muted forever. */
function forgetDeferredTabDiagnostic(tab) {
	deferredTabDiagnostics().delete(tab.storageKey);
}
/** Warn once per deferral; repeated sweeps remain visible at debug level. */
function reportDeferredTab(params, tab, reason) {
	const message = `deferred tracked browser tab ${tab.nativeTargetId}: ${reason}`;
	if (recordDeferredTabDiagnostic(tab, reason)) {
		params.onWarn?.(message);
		return;
	}
	if (params.onDebug) {
		params.onDebug(message);
		return;
	}
	log.debug(message);
}
function isIgnorableTabCloseError(error) {
	const message = normalizeLowercaseStringOrEmpty(String(error));
	return message.includes("tab not found") || message.includes("target closed") || message.includes("target not found") || message.includes("no such target") || message.includes("no target with given id found");
}
async function claimCleanup(tab, now, kind, authority) {
	const cleanupAttemptToken = randomUUID();
	const cleanupKind = kind === "lifecycle" ? "lifecycle" : tab.cleanupKind ?? kind;
	return await updateBrowserSessionTab(tab.storageKey, (current) => {
		const record = parseBrowserSessionTabRecord(current);
		if (!record || !sameBrowserSessionTabRecord(record, tab)) return;
		return {
			...record,
			cleanupRequestedAt: now,
			cleanupAttemptToken,
			cleanupKind
		};
	}, authority) ? {
		...tab,
		cleanupRequestedAt: now,
		cleanupAttemptToken,
		cleanupKind
	} : void 0;
}
function matchesCleanupAttempt(current, tab) {
	return Boolean(current && sameBrowserSessionTabRecord({
		...current,
		lastUsedAt: tab.lastUsedAt
	}, tab));
}
async function deleteClaimedTab(tab, authority, onWarn) {
	forgetDeferredTabDiagnostic(tab);
	try {
		if (tab.dashboard?.state === "stopping") {
			await updateBrowserSessionTab(tab.storageKey, (current) => {
				const record = parseBrowserSessionTabRecord(current);
				if (!matchesCleanupAttempt(record, tab) || !record.dashboard) return;
				return {
					...withoutBrowserSessionTabCleanup(record),
					dashboard: {
						...record.dashboard,
						state: "stopped"
					}
				};
			}, authority);
			return;
		}
		await deleteBrowserSessionTabIf(tab.storageKey, (current) => matchesCleanupAttempt(parseBrowserSessionTabRecord(current), tab), authority);
	} catch (error) {
		onWarn?.(`failed to delete tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
	}
}
async function closeCurrentDurableTab(tab, closeIfCurrent, getResolvedBrowserConfig) {
	const [{ readRuntimeConfig: getRuntimeConfig }, { resolveCdpControlPolicy }, { closeTrackedCdpTarget }, config] = await Promise.all([
		import("./plugin-sdk/runtime-config-snapshot.js"),
		import("./cdp-reachability-policy-C6h8q5gj.mjs"),
		import("./cdp.helpers-B0yitF4W.mjs"),
		import("./config-GAVBatCF.mjs")
	]);
	let resolved = await getResolvedBrowserConfig?.();
	if (!resolved) {
		const cfg = getRuntimeConfig();
		resolved = config.resolveBrowserConfig(cfg.browser, cfg);
	}
	const profile = config.resolveProfile(resolved, tab.profile);
	if (!profile?.cdpUrl) return { status: "ownership-mismatch" };
	if (tab.dashboard && !config.isLocalManagedProfile(profile)) return { status: "ownership-mismatch" };
	if (profile.driver === "extension" && !resolved.extensionRelayInternalTokens[profile.name]) return {
		status: "unavailable",
		reason: "extension-relay-unavailable"
	};
	const cdpControlPolicy = resolveCdpControlPolicy(profile, resolved.ssrfPolicy);
	return await closeTrackedCdpTarget({
		profileName: profile.name,
		cdpUrl: profile.cdpUrl,
		nativeTargetId: tab.nativeTargetId,
		timeoutMs: resolved.remoteCdpTimeoutMs,
		ssrfPolicy: cdpControlPolicy,
		expectedProfileFingerprint: tab.profileFingerprint,
		expectedBrowserInstanceFingerprint: tab.browserInstanceFingerprint,
		closeIfCurrent
	});
}
async function closeDurableTab(candidate, params, now, cleanupKind) {
	if (params.prepareCurrent && !await params.prepareCurrent()) return 0;
	if (params.isCurrent?.() === false || candidate.dashboard?.state === "active" || candidate.dashboard?.state === "stopped") return 0;
	const authority = {
		...params.authority,
		runtime: params.authority?.runtime ?? getBrowserStateRuntime()
	};
	const tab = await claimCleanup(candidate, now, cleanupKind, {
		...authority,
		sessionEntryCurrent: params.sessionEntryCurrent,
		assertCurrent: () => {
			authority.assertCurrent?.();
			if (params.isCurrent?.() === false) throw new Error("Browser tab cleanup caller changed");
		}
	});
	if (!tab) return 0;
	const closeIfCurrent = async (dispatch) => await dispatchBrowserSessionTabIfCurrent(tab.storageKey, (current) => matchesCleanupAttempt(parseBrowserSessionTabRecord(current), tab), dispatch, authority) ?? { status: "cancelled" };
	let outcome;
	try {
		if (params.closeDurableTab) outcome = await params.closeDurableTab(tab, { closeIfCurrent });
		else if (params.closeTab) {
			const closeTab = params.closeTab;
			outcome = await closeIfCurrent(async () => {
				await closeTab({
					targetId: tab.nativeTargetId,
					nativeTargetId: tab.nativeTargetId,
					profile: tab.profile
				});
				return { status: "closed" };
			});
		} else outcome = await closeCurrentDurableTab(tab, closeIfCurrent, params.getResolvedBrowserConfig);
	} catch (error) {
		if (isIgnorableTabCloseError(error)) {
			await deleteClaimedTab(tab, authority, params.onWarn);
			return 0;
		}
		params.onWarn?.(`failed to close tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
		return 0;
	}
	if (outcome.status === "cancelled") return 0;
	if (outcome.status === "unavailable") {
		if (outcome.reason === "extension-relay-unavailable") {
			reportDeferredTab(params, tab, "extension relay runtime unavailable");
			return 0;
		}
		if (!tab.dashboard && now - tab.lastUsedAt >= 864e5) {
			params.onWarn?.(`retired unreachable tracked browser tab ${tab.nativeTargetId}: ${outcome.reason}`);
			await deleteClaimedTab(tab, authority, params.onWarn);
			return 0;
		}
		reportDeferredTab(params, tab, outcome.reason);
		return 0;
	}
	if (outcome.status === "ownership-mismatch") params.onWarn?.(`retired tracked browser tab ${tab.nativeTargetId}: ownership mismatch`);
	await deleteClaimedTab(tab, authority, params.onWarn);
	return outcome.status === "closed" ? 1 : 0;
}
//#endregion
//#region extensions/browser/src/browser/session-tab-sweep-selection.ts
function trackedTabIdentity(tab) {
	return tab.kind === "durable" ? `durable:${tab.storageKey}` : `volatile:${tab.sessionKey}:${volatileSessionTabTargetKey(tab)}`;
}
function selectTrackedTabsForSessions(params) {
	const volatile = [];
	for (const sessionKey of params.sessionKeys) volatile.push(...params.volatile.get(sessionKey) ?? []);
	return [...params.durable.filter((tab) => params.sessionKeys.has(tab.sessionKey)), ...volatile];
}
function selectStaleTrackedTabs(params) {
	const selected = /* @__PURE__ */ new Map();
	const activeBySession = /* @__PURE__ */ new Map();
	const nativeIdentityCounts = /* @__PURE__ */ new Map();
	const observedNativeActivity = /* @__PURE__ */ new Map();
	for (const tab of params.tabs) {
		if (tab.kind !== "durable" || tab.interactionTargetKind !== "native") continue;
		const identity = browserSessionTabNativeIdentity(tab);
		nativeIdentityCounts.set(identity, (nativeIdentityCounts.get(identity) ?? 0) + 1);
		const observedAt = readColdNativeActivity(identity);
		if (observedAt !== void 0) observedNativeActivity.set(tab.storageKey, observedAt);
	}
	const effectiveLastUsedAt = (tab) => tab.kind === "durable" ? Math.max(tab.lastUsedAt, observedNativeActivity.get(tab.storageKey) ?? 0) : tab.lastUsedAt;
	for (const tab of params.tabs) {
		if (tab.kind === "durable" && tab.dashboard) continue;
		const observedAt = tab.kind === "durable" ? observedNativeActivity.get(tab.storageKey) : void 0;
		const isActiveDurable = tab.kind === "durable" && activeDurableStorageKeys().has(tab.storageKey);
		const isUnambiguousNative = tab.kind === "durable" && tab.interactionTargetKind === "native" && nativeIdentityCounts.get(browserSessionTabNativeIdentity(tab)) === 1;
		const activitySupersedesSweep = tab.kind === "durable" && tab.cleanupKind === "sweep" && observedAt !== void 0 && observedAt >= (tab.cleanupRequestedAt ?? 0);
		if (tab.kind === "durable" && tab.cleanupAttemptToken && !activitySupersedesSweep) {
			if (tab.cleanupKind === "lifecycle" || isActiveDurable || isUnambiguousNative) selected.set(trackedTabIdentity(tab), tab);
			continue;
		}
		if (params.sessionFilter && !params.sessionFilter(tab.sessionKey)) continue;
		if (tab.kind === "durable" && !isActiveDurable && (tab.interactionTargetKind === "opaque" || !isUnambiguousNative)) continue;
		const active = activeBySession.get(tab.sessionKey) ?? [];
		active.push(tab);
		activeBySession.set(tab.sessionKey, active);
	}
	for (const tabs of activeBySession.values()) {
		tabs.sort((left, right) => effectiveLastUsedAt(left) - effectiveLastUsedAt(right) || left.trackedAt - right.trackedAt);
		if (params.idleMs && params.idleMs > 0) {
			for (const tab of tabs) if (params.now - effectiveLastUsedAt(tab) >= params.idleMs) selected.set(trackedTabIdentity(tab), tab);
		}
		const remaining = tabs.filter((tab) => !selected.has(trackedTabIdentity(tab)));
		if (params.maxTabsPerSession && params.maxTabsPerSession > 0 && remaining.length > params.maxTabsPerSession) for (const tab of remaining.slice(0, remaining.length - params.maxTabsPerSession)) selected.set(trackedTabIdentity(tab), tab);
	}
	return [...selected.values()];
}
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.ts
/**
* Session-owned browser tabs. Host-local durable ownership is canonical in
* plugin SQLite; all other tabs remain process-local.
*/
var session_tab_registry_exports = /* @__PURE__ */ __exportAll({
	closeBrowserDashboardTabs: () => closeBrowserDashboardTabs,
	closeTrackedBrowserTabsForSessions: () => closeTrackedBrowserTabsForSessions,
	filterTrackedSessionBrowserTabs: () => filterTrackedSessionBrowserTabs,
	sweepTrackedBrowserTabs: () => sweepTrackedBrowserTabs,
	touchSessionBrowserTab: () => touchSessionBrowserTab,
	trackSessionBrowserTab: () => trackSessionBrowserTab,
	untrackSessionBrowserTab: () => untrackSessionBrowserTab
});
function readVolatileTabs(sessionKeys) {
	const current = volatileTabsBySession();
	const volatile = /* @__PURE__ */ new Map();
	for (const sessionKey of sessionKeys ?? current.keys()) {
		if (resolveBrowserSessionKey(sessionKey) !== sessionKey) continue;
		const tabs = current.get(sessionKey);
		if (tabs) volatile.set(sessionKey, Array.from(tabs.values()));
	}
	return volatile;
}
async function performVolatileCleanup(candidate, params, cleanupKind) {
	const inFlight = volatileTabCleanupByTarget();
	const targetKey = volatileSessionTabTargetKey(candidate);
	const resolveCurrent = () => {
		const current = resolveVolatile(candidate)?.tab;
		return current?.registration === candidate.registration && (cleanupKind !== "sweep" || sameVolatileSessionTab(current, candidate)) ? current : void 0;
	};
	const existing = inFlight.get(targetKey);
	if (existing) {
		await existing;
		return 0;
	}
	const cleanup = Promise.resolve().then(async () => {
		if (params.prepareCurrent && !await params.prepareCurrent()) return 0;
		if (!isCleanupCurrent(params)) return 0;
		params.authority?.assertCurrent?.();
		let tab = resolveCurrent();
		if (!tab) return 0;
		const registrations = volatileRegistrationsForTarget(targetKey);
		let closeTab = params.closeTab;
		try {
			if (!closeTab && tab.route.kind === "browser-control") {
				const { browserCloseTabByRawTargetId } = await import("./client-tab-close.runtime.js");
				const latest = resolveCurrent();
				if (!latest) return 0;
				tab = latest;
				closeTab = ({ baseUrl, targetId, profile }) => browserCloseTabByRawTargetId(baseUrl, targetId, { profile });
			}
			params.authority?.assertCurrent?.();
			if (!isCleanupCurrent(params)) return 0;
			if (closeTab) await closeTab({
				targetId: tab.targetId,
				...tab.route.kind === "browser-control" && tab.route.baseUrl ? { baseUrl: tab.route.baseUrl } : {},
				...tab.route.kind === "node-proxy" ? { route: tab.route } : {},
				...tab.profile ? { profile: tab.profile } : {}
			});
			else if (tab.route.kind === "node-proxy") {
				const outcome = await tab.route.closeTarget({
					targetId: tab.targetId,
					profile: tab.profile,
					ownership: tab.ownership
				});
				if (outcome.status === "cancelled" || outcome.status === "unavailable") {
					params.onWarn?.(`deferred tracked browser tab ${tab.targetId}: ${outcome.status === "unavailable" ? outcome.reason : "cleanup cancelled"}`);
					return 0;
				}
				if (outcome.status === "ownership-mismatch") params.onWarn?.(`retired tracked browser tab ${tab.targetId}: ownership mismatch`);
				deleteVolatileRegistrations(registrations);
				return outcome.status === "closed" ? 1 : 0;
			}
		} catch (error) {
			if (closeTab && tab.route.kind === "browser-control" && isIgnorableTabCloseError(error)) {
				deleteVolatileRegistrations(registrations);
				return 0;
			}
			params.onWarn?.(`failed to close tracked browser tab ${tab.targetId}: ${String(error)}`);
			return 0;
		}
		deleteVolatileRegistrations(registrations);
		return 1;
	});
	inFlight.set(targetKey, cleanup);
	try {
		return await cleanup;
	} finally {
		inFlight.delete(targetKey);
	}
}
async function closeTrackedTabs(tabs, params) {
	let closed = 0;
	const now = params.now ?? Date.now();
	for (const tab of tabs) closed += tab.kind === "durable" ? await closeDurableTab(tab, params, now, params.cleanupKind) : await performVolatileCleanup(tab, params, params.cleanupKind);
	return closed;
}
async function withTrackedTabCleanup(authority, cleanup) {
	return authority.runtime ? await withBrowserSessionTabOperation(Symbol("cleanup"), authority, cleanup) : await cleanup();
}
function isCleanupCurrent(params) {
	return isBrowserStateRuntimeCurrent(params.authority?.runtime, params.isCurrent);
}
async function prepareTrackedTabCleanup(params) {
	let dashboardClosed = 0;
	const readDurable = () => readCurrentBrowserState(params.authority?.runtime, () => readDurableTabs(params.onWarn, params.authority), params.isCurrent);
	let durable = await readDurable();
	if (!durable) return {
		dashboardClosed,
		durable
	};
	if (durable.some((tab) => tab.dashboard) || (await readCurrentBrowserState(params.authority?.runtime, () => readBrowserDashboardStopIntents(params.authority), params.isCurrent))?.length) {
		const { reconcileBrowserDashboards } = await import("./browser-dashboard-BH-BVZme.mjs");
		if (!isCleanupCurrent(params)) return {
			dashboardClosed,
			durable: void 0
		};
		dashboardClosed = await reconcileBrowserDashboards(params);
		durable = await readDurable();
	}
	return {
		dashboardClosed,
		durable: isCleanupCurrent(params) ? durable : void 0
	};
}
async function closeTrackedBrowserTabsForSessions(input) {
	if (input.sessionEntryCurrent && typeof input.prepareCurrent !== "function") {
		input.onWarn?.("browser cleanup unavailable: sessionEntryCurrent requires prepareCurrent");
		return 0;
	}
	const params = {
		...input,
		authority: captureBrowserSessionTabAuthority(input.authority)
	};
	const sessionKeys = new Set(params.sessionKeys.map((key) => resolveBrowserSessionKey(key)).filter((key) => key !== void 0));
	if (sessionKeys.size === 0) return 0;
	const volatile = readVolatileTabs(sessionKeys);
	return await withTrackedTabCleanup(params.authority, async () => {
		if (params.isCurrent?.() === false) return 0;
		const { dashboardClosed, durable } = params.authority.runtime ? await prepareTrackedTabCleanup({
			...params,
			sessionKeys: [...sessionKeys]
		}) : {
			dashboardClosed: 0,
			durable: []
		};
		if (!durable || !isCleanupCurrent(params)) return dashboardClosed;
		return dashboardClosed + await closeTrackedTabs(selectTrackedTabsForSessions({
			durable,
			volatile,
			sessionKeys
		}), {
			...params,
			cleanupKind: "lifecycle"
		});
	});
}
/** Closes and untracks stale, pending, or excess browser tabs. */
async function sweepTrackedBrowserTabs(input) {
	const params = {
		...input,
		authority: captureBrowserSessionTabAuthority(input.authority)
	};
	const volatile = params.ordinaryCleanup === false ? [] : Array.from(readVolatileTabs().values()).flat();
	return await withTrackedTabCleanup(params.authority, async () => {
		const now = params.now ?? Date.now();
		const { dashboardClosed, durable } = params.authority.runtime ? await prepareTrackedTabCleanup(params) : {
			dashboardClosed: 0,
			durable: []
		};
		if (!durable || !isCleanupCurrent(params)) return dashboardClosed;
		const lifecycleOnly = params.ordinaryCleanup === false;
		return dashboardClosed + await closeTrackedTabs(lifecycleOnly ? durable.filter((tab) => !tab.dashboard && tab.cleanupKind === "lifecycle") : selectStaleTrackedTabs({
			tabs: [...durable, ...volatile],
			now,
			idleMs: params.idleMs,
			maxTabsPerSession: params.maxTabsPerSession,
			sessionFilter: params.sessionFilter
		}), {
			...params,
			now,
			cleanupKind: lifecycleOnly ? "lifecycle" : "sweep"
		});
	});
}
/** Browser dashboard lifetime changes reuse fingerprinted cleanup and its claim owner. */
async function closeBrowserDashboardTabs(tabs, params = {}) {
	return await closeTrackedTabs(tabs.map((tab) => ({
		...tab,
		kind: "durable"
	})), {
		...params,
		getResolvedBrowserConfig: params.getResolvedBrowserConfig ?? (async () => {
			const { getBrowserControlState } = await import("./browser-control-state-Dr2vXv8u.mjs");
			return getBrowserControlState()?.resolved ?? null;
		}),
		cleanupKind: "lifecycle"
	});
}
//#endregion
export { sweepTrackedBrowserTabs as i, closeTrackedBrowserTabsForSessions as n, session_tab_registry_exports as r, closeBrowserDashboardTabs as t };
