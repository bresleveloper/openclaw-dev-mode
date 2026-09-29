import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { A as volatileSessionTabTargetKey, B as rememberDurableTabAliases, C as deleteVolatileSessionTab, D as rememberColdNativeActivity, E as readColdNativeActivity, F as forgetVolatileTabAlias, G as resolveVolatileTabExact, H as resolveDurableTabAlias, I as hasDurableTabAlias, L as hasDurableTabExact, M as volatileTabsBySession, N as clearDurableTabAliases, O as sameVolatileSessionTab, P as clearVolatileTabAliases, R as hasVolatileTabAlias, S as deleteVolatileRegistrations, T as normalizeBrowserSessionKey, U as resolveDurableTabExact, V as rememberVolatileTabAliases, W as resolveVolatileTabAlias, b as withoutBrowserSessionTabCleanup, c as getBrowserSessionTabStore, d as parseBrowserDashboardStopIntent, f as parseBrowserSessionTabRecord, g as readBrowserDashboardStopIntents, i as compareBrowserSessionTabProfileAliases, j as volatileTabCleanupByTarget, k as volatileRegistrationsForTarget, l as getOptionalBrowserSessionTabStore, n as browserSessionTabNativeIdentity, o as deleteBrowserSessionTabIf, r as browserSessionTabStorageKey, v as sameBrowserSessionTabRecord, w as forgetColdNativeActivity, x as activeDurableStorageKeys, y as updateBrowserSessionTab, z as hasVolatileTabExact } from "./session-tab-store-CyxH9Sdj.mjs";
import "./constants-DKjTvIBP.mjs";
import { randomUUID } from "node:crypto";
//#region extensions/browser/src/browser/session-tab-cleanup-claim.ts
/**
* Durable tab cleanup owns claims, fingerprint verification, close, and retirement.
* A concurrent touch or competing sweep cannot delete another generation's row.
*/
function isIgnorableTabCloseError(error) {
	const message = normalizeLowercaseStringOrEmpty(String(error));
	return message.includes("tab not found") || message.includes("target closed") || message.includes("target not found") || message.includes("no such target") || message.includes("no target with given id found");
}
function claimCleanup(tab, now, kind) {
	const cleanupAttemptToken = randomUUID();
	const cleanupKind = kind === "lifecycle" ? "lifecycle" : tab.cleanupKind ?? kind;
	return updateBrowserSessionTab(tab.storageKey, (current) => {
		const record = parseBrowserSessionTabRecord(current);
		if (!record || !sameBrowserSessionTabRecord(record, tab)) return;
		return {
			...record,
			cleanupRequestedAt: now,
			cleanupAttemptToken,
			cleanupKind
		};
	}) ? {
		...tab,
		cleanupRequestedAt: now,
		cleanupAttemptToken,
		cleanupKind
	} : void 0;
}
function matchesCleanupAttempt(current, tab) {
	return Boolean(current && current.cleanupAttemptToken === tab.cleanupAttemptToken && current.cleanupRequestedAt === tab.cleanupRequestedAt && current.cleanupKind === tab.cleanupKind && sameBrowserSessionTabRecord({
		...current,
		lastUsedAt: tab.lastUsedAt
	}, tab));
}
function ownsCleanupAttempt(tab) {
	return matchesCleanupAttempt(parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(tab.storageKey)), tab);
}
function deleteClaimedTab(tab, onWarn) {
	try {
		if (tab.dashboard?.state === "stopping") {
			updateBrowserSessionTab(tab.storageKey, (current) => {
				const record = parseBrowserSessionTabRecord(current);
				if (!matchesCleanupAttempt(record, tab) || !record.dashboard) return;
				const { cleanupRequestedAt: _requested, cleanupAttemptToken: _token, cleanupKind: _kind, ...settled } = record;
				return {
					...settled,
					dashboard: {
						...record.dashboard,
						state: "stopped"
					}
				};
			});
			return;
		}
		deleteBrowserSessionTabIf(tab.storageKey, (current) => {
			return matchesCleanupAttempt(parseBrowserSessionTabRecord(current), tab);
		});
	} catch (error) {
		onWarn?.(`failed to delete tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
	}
}
async function closeCurrentDurableTab(tab, shouldClose, getResolvedBrowserConfig) {
	const [{ getRuntimeConfig }, { resolveCdpControlPolicy }, { closeTrackedCdpTarget }, config] = await Promise.all([
		import("./config-Cj70ygwT.mjs"),
		import("./cdp-reachability-policy-C9dLqHOG.mjs"),
		import("./cdp.helpers-BU5XE7Uz.mjs"),
		import("./config-ib5hLimZ.mjs")
	]);
	let resolved = await getResolvedBrowserConfig?.();
	if (!shouldClose()) return { status: "cancelled" };
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
		shouldClose
	});
}
async function closeDurableTab(candidate, params, now, cleanupKind) {
	if (params.isCurrent?.() === false || candidate.dashboard?.state === "active" || candidate.dashboard?.state === "stopped") return 0;
	const tab = claimCleanup(candidate, now, cleanupKind);
	if (!tab) return 0;
	const shouldClose = () => ownsCleanupAttempt(tab);
	let outcome;
	try {
		if (params.closeDurableTab) outcome = await params.closeDurableTab(tab, { shouldClose });
		else if (params.closeTab) {
			if (!shouldClose()) return 0;
			await params.closeTab({
				targetId: tab.nativeTargetId,
				nativeTargetId: tab.nativeTargetId,
				profile: tab.profile
			});
			outcome = { status: "closed" };
		} else outcome = await closeCurrentDurableTab(tab, shouldClose, params.getResolvedBrowserConfig);
	} catch (error) {
		if (isIgnorableTabCloseError(error)) {
			deleteClaimedTab(tab, params.onWarn);
			return 0;
		}
		params.onWarn?.(`failed to close tracked browser tab ${tab.nativeTargetId}: ${String(error)}`);
		return 0;
	}
	if (outcome.status === "cancelled") return 0;
	if (outcome.status === "unavailable") {
		if (outcome.reason === "extension-relay-unavailable") {
			params.onWarn?.(`deferred tracked browser tab ${tab.nativeTargetId}: extension relay runtime unavailable`);
			return 0;
		}
		if (!tab.dashboard && now - tab.lastUsedAt >= 864e5) {
			params.onWarn?.(`retired unreachable tracked browser tab ${tab.nativeTargetId}: ${outcome.reason}`);
			deleteClaimedTab(tab, params.onWarn);
			return 0;
		}
		params.onWarn?.(`deferred tracked browser tab ${tab.nativeTargetId}: ${outcome.reason}`);
		return 0;
	}
	if (outcome.status === "ownership-mismatch") {
		params.onWarn?.(`retired tracked browser tab ${tab.nativeTargetId}: ownership mismatch`);
		deleteClaimedTab(tab, params.onWarn);
		return 0;
	}
	deleteClaimedTab(tab, params.onWarn);
	return outcome.status === "closed" ? 1 : 0;
}
//#endregion
//#region extensions/browser/src/browser/session-tab-sweep-selection.ts
function trackedTabIdentity(tab) {
	return tab.kind === "durable" ? `durable:${tab.storageKey}` : `volatile:${tab.sessionKey}:${volatileSessionTabTargetKey(tab)}`;
}
function selectTrackedTabsForSessions(params) {
	const sessionKeys = new Set(params.sessionKeys.map((key) => normalizeBrowserSessionKey(key)).filter((key) => key !== void 0));
	const volatile = [];
	for (const sessionKey of sessionKeys) volatile.push(...volatileTabsBySession().get(sessionKey)?.values() ?? []);
	return [...params.durable.filter((tab) => sessionKeys.has(tab.sessionKey)), ...volatile];
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
//#region extensions/browser/src/browser/session-tab-untrack-selection.ts
function selectSessionTabToUntrack(params) {
	if (params.volatileIsExact && !params.hasDurableExactCandidate) return "volatile";
	if (params.durableIsExact && !params.hasVolatileExactCandidate) return "durable";
	if (params.hasVolatileCandidate && params.hasDurableCandidate) return "ambiguous";
	if (params.volatileAvailable) return "volatile";
	if (params.durableAvailable) return "durable";
	if (params.hasVolatileCandidate || params.hasDurableCandidate) return "ambiguous";
	return "missing";
}
//#endregion
//#region extensions/browser/src/browser/session-tab-tracking.ts
function normalizeProfile(value) {
	return normalizeOptionalLowercaseString(value);
}
function normalizeProfileAliases(values) {
	return [...new Set((values ?? []).map(normalizeProfile).filter((value) => Boolean(value)))].toSorted(compareBrowserSessionTabProfileAliases);
}
function resolveInteractionIdentity(params) {
	const sessionKey = params.sessionKey?.trim();
	const targetId = params.targetId?.trim();
	if (!sessionKey || !targetId) return;
	return {
		sessionKey: normalizeBrowserSessionKey(sessionKey) ?? "",
		targetId,
		route: params.route ?? { kind: "browser-control" },
		...normalizeProfile(params.profile) ? { profile: normalizeProfile(params.profile) } : {}
	};
}
function isVolatileRoute(route) {
	return route.kind === "node-proxy" || Boolean(route.baseUrl);
}
function durableOwnership(params) {
	return params.ownership?.status === "durable" ? params.ownership : void 0;
}
function deleteInvalidRecord(key, onWarn) {
	try {
		deleteBrowserSessionTabIf(key, (current) => {
			if (parseBrowserDashboardStopIntent(key, current)) return false;
			const record = parseBrowserSessionTabRecord(current);
			return !record || browserSessionTabStorageKey(record) !== key;
		});
	} catch (error) {
		onWarn?.(`failed to delete invalid browser session tab record: ${String(error)}`);
		return;
	}
	onWarn?.("deleted invalid browser session tab record");
}
function readDurableTabs(onWarn) {
	const store = getOptionalBrowserSessionTabStore();
	if (!store) return [];
	const tabs = [];
	for (const entry of store.entries()) {
		if (parseBrowserDashboardStopIntent(entry.key, entry.value)) continue;
		const record = parseBrowserSessionTabRecord(entry.value);
		if (!record || browserSessionTabStorageKey(record) !== entry.key) {
			deleteInvalidRecord(entry.key, onWarn);
			continue;
		}
		tabs.push({
			...record,
			kind: "durable",
			storageKey: entry.key
		});
	}
	return tabs;
}
function deleteVolatileMatching(identity) {
	const state = volatileTabsBySession();
	const tabs = state.get(identity.sessionKey);
	if (!tabs) return;
	for (const [key, tab] of tabs) if (volatileSessionTabTargetKey(tab) === volatileSessionTabTargetKey(identity)) {
		tabs.delete(key);
		clearVolatileTabAliases(identity.sessionKey, key);
	}
	if (tabs.size === 0) state.delete(identity.sessionKey);
}
function resolveVolatile(identity) {
	const tabs = volatileTabsBySession().get(identity.sessionKey);
	const exactKey = volatileSessionTabTargetKey(identity);
	const exact = tabs?.get(exactKey);
	if (exact) return {
		tab: exact,
		tabKey: exactKey,
		isExact: true
	};
	const exactTarget = resolveVolatileTabExact(identity);
	if (!exactTarget && hasVolatileTabExact(identity)) return;
	const target = exactTarget ?? resolveVolatileTabAlias(identity);
	if (!target) {
		if (!hasVolatileTabAlias(identity)) forgetVolatileTabAlias(identity);
		return;
	}
	if (target.sessionKey !== identity.sessionKey) {
		forgetVolatileTabAlias(identity);
		return;
	}
	const tab = tabs?.get(target.tabKey);
	if (!tab) {
		forgetVolatileTabAlias(identity);
		return;
	}
	return {
		tab,
		tabKey: target.tabKey,
		isExact: Boolean(exactTarget)
	};
}
function upsertVolatile(identity, aliases, profileAliases, ownership, now) {
	const state = volatileTabsBySession();
	const tabs = state.get(identity.sessionKey) ?? /* @__PURE__ */ new Map();
	const key = volatileSessionTabTargetKey(identity);
	const existing = tabs.get(key);
	tabs.set(key, {
		...identity,
		kind: "volatile",
		registration: {},
		...ownership ? { ownership } : {},
		trackedAt: existing?.trackedAt ?? now,
		lastUsedAt: now
	});
	state.set(identity.sessionKey, tabs);
	rememberVolatileTabAliases(identity, aliases, key, profileAliases);
}
function deleteDurableCandidate(tab) {
	return deleteBrowserSessionTabIf(tab.storageKey, (current) => {
		const record = parseBrowserSessionTabRecord(current);
		return Boolean(record && sameBrowserSessionTabRecord(record, tab));
	});
}
function clearDurableForVolatile(identity) {
	const mappedKey = resolveDurableTabExact(identity);
	if (!mappedKey) return true;
	const record = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(mappedKey));
	if (record) return deleteDurableCandidate({
		...record,
		kind: "durable",
		storageKey: mappedKey
	});
	clearDurableTabAliases(mappedKey);
	activeDurableStorageKeys().delete(mappedKey);
	return true;
}
/** Starts tracking a browser tab for later session cleanup. */
function trackSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const ownership = durableOwnership(params);
	const profileAliases = normalizeProfileAliases(params.profileAliases);
	const now = params.now ?? Date.now();
	if (isVolatileRoute(identity.route)) {
		upsertVolatile(identity, params.aliases ?? [], profileAliases, params.ownership, now);
		return;
	}
	if (!ownership) {
		if (!clearDurableForVolatile(identity)) throw new Error("durable browser tab changed during non-durable transition");
		upsertVolatile(identity, params.aliases ?? [], profileAliases, params.ownership, now);
		return;
	}
	if (!identity.profile) throw new Error("durable browser tab tracking requires an explicit profile");
	const profile = identity.profile;
	const storageKey = browserSessionTabStorageKey({
		sessionKey: identity.sessionKey,
		nativeTargetId: ownership.nativeTargetId,
		profileFingerprint: ownership.profileFingerprint,
		browserInstanceFingerprint: ownership.browserInstanceFingerprint
	});
	let persistedProfileAliases = [];
	updateBrowserSessionTab(storageKey, (current) => {
		const existing = parseBrowserSessionTabRecord(current);
		persistedProfileAliases = normalizeProfileAliases([
			...existing?.profileAliases ?? [],
			existing?.profile,
			...profileAliases
		]).filter((alias) => alias !== profile);
		return {
			version: 1,
			sessionKey: identity.sessionKey,
			nativeTargetId: ownership.nativeTargetId,
			profile,
			...persistedProfileAliases.length > 0 ? { profileAliases: persistedProfileAliases } : {},
			profileFingerprint: ownership.profileFingerprint,
			browserInstanceFingerprint: ownership.browserInstanceFingerprint,
			interactionTargetKind: identity.targetId === ownership.nativeTargetId ? "native" : "opaque",
			trackedAt: existing?.trackedAt ?? now,
			lastUsedAt: now,
			...params.dashboard ? { dashboard: params.dashboard } : existing?.dashboard ? { dashboard: existing.dashboard } : {}
		};
	});
	rememberDurableTabAliases(identity, params.aliases ?? [], storageKey, persistedProfileAliases);
	activeDurableStorageKeys().add(storageKey);
	deleteVolatileMatching(identity);
}
function canonicalCandidate(params, identity) {
	const ownership = durableOwnership(params);
	if (!ownership) {
		const mappedKey = resolveDurableTabAlias(identity);
		if (mappedKey) {
			const mappedRecord = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(mappedKey));
			if (mappedRecord) return {
				...mappedRecord,
				kind: "durable",
				storageKey: mappedKey
			};
		}
		return;
	}
	if (!identity.profile) return;
	const key = browserSessionTabStorageKey({
		sessionKey: identity.sessionKey,
		nativeTargetId: ownership.nativeTargetId,
		profileFingerprint: ownership.profileFingerprint,
		browserInstanceFingerprint: ownership.browserInstanceFingerprint
	});
	const record = parseBrowserSessionTabRecord(getBrowserSessionTabStore().lookup(key));
	return record ? {
		...record,
		kind: "durable",
		storageKey: key
	} : void 0;
}
/** Updates last-used time for an existing tracked browser tab. */
function touchSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const now = params.now ?? Date.now();
	const volatile = resolveVolatile(identity);
	if (volatile) volatileTabsBySession().get(identity.sessionKey)?.set(volatile.tabKey, {
		...volatile.tab,
		lastUsedAt: now
	});
	if (isVolatileRoute(identity.route)) return;
	if (!getOptionalBrowserSessionTabStore()) return;
	const candidate = canonicalCandidate(params, identity);
	if (candidate) {
		activeDurableStorageKeys().add(candidate.storageKey);
		updateBrowserSessionTab(candidate.storageKey, (current) => {
			const record = parseBrowserSessionTabRecord(current);
			if (!record || !sameBrowserSessionTabRecord(record, candidate)) return;
			if (record.cleanupKind === "sweep") return {
				...withoutBrowserSessionTabCleanup(record),
				lastUsedAt: now
			};
			return {
				...record,
				lastUsedAt: now
			};
		});
		return;
	}
	if (identity.profile) {
		const nativeTargetId = params.nativeTargetId?.trim() || identity.targetId;
		const coldIdentity = browserSessionTabNativeIdentity({
			sessionKey: identity.sessionKey,
			profile: identity.profile,
			nativeTargetId
		});
		if (readColdNativeActivity(coldIdentity) !== void 0 || readDurableTabs().some((tab) => tab.interactionTargetKind === "native" && browserSessionTabNativeIdentity(tab) === coldIdentity)) rememberColdNativeActivity(coldIdentity, now);
	}
}
/** Removes a browser tab from session cleanup tracking. */
function untrackSessionBrowserTab(params) {
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const volatile = resolveVolatile(identity);
	if (isVolatileRoute(identity.route)) {
		if (volatile) deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	if (!getOptionalBrowserSessionTabStore()) {
		if (volatile) deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	const durable = canonicalCandidate(params, identity);
	if (durable && durableOwnership(params)) {
		deleteDurableCandidate(durable);
		return;
	}
	const selection = selectSessionTabToUntrack({
		volatileAvailable: Boolean(volatile),
		durableAvailable: Boolean(durable),
		hasVolatileCandidate: Boolean(volatile) || hasVolatileTabAlias(identity),
		hasDurableCandidate: Boolean(durable) || hasDurableTabAlias(identity),
		volatileIsExact: volatile?.isExact ?? false,
		durableIsExact: Boolean(durable && resolveDurableTabExact(identity) === durable.storageKey),
		hasVolatileExactCandidate: hasVolatileTabExact(identity),
		hasDurableExactCandidate: hasDurableTabExact(identity)
	});
	if (selection === "volatile" && volatile) {
		deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		return;
	}
	if (selection === "durable" && durable) {
		deleteDurableCandidate(durable);
		return;
	}
	if (selection !== "missing") return;
	if (identity.profile) forgetColdNativeActivity(browserSessionTabNativeIdentity({
		sessionKey: identity.sessionKey,
		profile: identity.profile,
		nativeTargetId: params.nativeTargetId?.trim() || identity.targetId
	}));
}
//#endregion
//#region extensions/browser/src/browser/session-tab-registry.ts
/**
* Session-owned browser tabs. Host-local durable ownership is canonical in
* plugin SQLite; all other tabs remain process-local.
*/
async function performVolatileCleanup(candidate, params, cleanupKind) {
	const inFlight = volatileTabCleanupByTarget();
	const targetKey = volatileSessionTabTargetKey(candidate);
	const resolveCurrent = () => {
		const current = resolveVolatile(candidate)?.tab;
		return current?.registration === candidate.registration && (cleanupKind !== "sweep" || sameVolatileSessionTab(current, candidate)) ? current : void 0;
	};
	while (true) {
		if (params.isCurrent?.() === false) return 0;
		const current = resolveCurrent();
		if (!current) return 0;
		const existing = inFlight.get(targetKey);
		if (existing) {
			await existing.promise;
			if (existing.registrations.some((owned) => owned.registration === candidate.registration)) return 0;
			continue;
		}
		let complete;
		const cleanup = new Promise((resolve) => {
			complete = resolve;
		});
		const owner = {
			registrations: volatileRegistrationsForTarget(targetKey),
			promise: cleanup
		};
		const performClose = async () => {
			let tab = current;
			let closeTab = params.closeTab;
			try {
				if (!closeTab && tab.route.kind === "browser-control") {
					const { browserCloseTabByRawTargetId } = await import("./client-Ds8JT2pv.mjs");
					const latest = resolveCurrent();
					if (!latest) {
						owner.registrations = [];
						return 0;
					}
					tab = latest;
					closeTab = ({ baseUrl, targetId, profile }) => browserCloseTabByRawTargetId(baseUrl, targetId, { profile });
				}
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
					deleteVolatileRegistrations(owner.registrations);
					return outcome.status === "closed" ? 1 : 0;
				}
			} catch (error) {
				if (closeTab && tab.route.kind === "browser-control" && isIgnorableTabCloseError(error)) {
					deleteVolatileRegistrations(owner.registrations);
					return 0;
				}
				params.onWarn?.(`failed to close tracked browser tab ${tab.targetId}: ${String(error)}`);
				return 0;
			}
			deleteVolatileRegistrations(owner.registrations);
			return 1;
		};
		inFlight.set(targetKey, owner);
		try {
			complete(performClose());
			return await cleanup;
		} finally {
			if (inFlight.get(targetKey) === owner) inFlight.delete(targetKey);
		}
	}
}
async function closeTrackedTabs(tabs, params) {
	let closed = 0;
	const now = params.now ?? Date.now();
	for (const tab of tabs) closed += tab.kind === "durable" ? await closeDurableTab(tab, params, now, params.cleanupKind) : await performVolatileCleanup(tab, params, params.cleanupKind);
	return closed;
}
/** Closes and untracks tabs for the supplied session keys. */
async function closeTrackedBrowserTabsForSessions(params) {
	if (params.isCurrent?.() === false) return 0;
	let dashboardClosed = 0;
	if (readDurableTabs(params.onWarn).some((tab) => tab.dashboard) || readBrowserDashboardStopIntents().length > 0) {
		const { reconcileBrowserDashboards } = await import("./browser-dashboard-DNcxpcr3.mjs");
		dashboardClosed = await reconcileBrowserDashboards(params);
	}
	if (params.isCurrent?.() === false) return dashboardClosed;
	const tabs = selectTrackedTabsForSessions({
		durable: readDurableTabs(params.onWarn),
		sessionKeys: params.sessionKeys
	});
	return dashboardClosed + await closeTrackedTabs(tabs, {
		...params,
		cleanupKind: "lifecycle"
	});
}
/** Closes and untracks stale, pending, or excess browser tabs. */
async function sweepTrackedBrowserTabs(params) {
	const now = params.now ?? Date.now();
	let dashboardClosed = 0;
	if (readDurableTabs(params.onWarn).some((tab) => tab.dashboard) || readBrowserDashboardStopIntents().length > 0) {
		const { reconcileBrowserDashboards } = await import("./browser-dashboard-DNcxpcr3.mjs");
		dashboardClosed = await reconcileBrowserDashboards(params);
	}
	if (params.ordinaryCleanup === false) return dashboardClosed + await closeTrackedTabs(readDurableTabs(params.onWarn).filter((tab) => !tab.dashboard && tab.cleanupKind === "lifecycle"), {
		...params,
		now,
		cleanupKind: "lifecycle"
	});
	const volatile = [];
	for (const tabs of volatileTabsBySession().values()) volatile.push(...tabs.values());
	return dashboardClosed + await closeTrackedTabs(selectStaleTrackedTabs({
		tabs: [...readDurableTabs(params.onWarn), ...volatile],
		now,
		idleMs: params.idleMs,
		maxTabsPerSession: params.maxTabsPerSession,
		sessionFilter: params.sessionFilter
	}), {
		...params,
		now,
		cleanupKind: "sweep"
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
			const { getBrowserControlState } = await import("./browser-control-state-DNhn_3YX.mjs");
			return getBrowserControlState()?.resolved ?? null;
		}),
		cleanupKind: "lifecycle"
	});
}
//#endregion
export { trackSessionBrowserTab as a, touchSessionBrowserTab as i, closeTrackedBrowserTabsForSessions as n, untrackSessionBrowserTab as o, sweepTrackedBrowserTabs as r, closeBrowserDashboardTabs as t };
