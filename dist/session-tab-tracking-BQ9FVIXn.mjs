import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { $ as getOptionalBrowserStateRuntime, A as readColdNativeActivity, B as hasDurableTabExact, C as withBrowserSessionTabOperation, E as activeDurableStorageKeys, G as resolveDurableTabAlias, H as hasVolatileTabExact, I as volatileTabsBySession, J as resolveVolatileTabExact, K as resolveDurableTabExact, L as clearDurableTabAliases, O as deleteVolatileSessionTab, P as volatileSessionTabTargetKey, R as forgetVolatileTabAlias, S as withBrowserSessionTabNativeActivity, T as withoutBrowserSessionTabCleanup, U as rememberDurableTabAliases, V as hasVolatileTabAlias, W as rememberVolatileTabAliases, X as assertBrowserSessionTabAuthority, Z as captureBrowserSessionTabAuthority, a as deleteBrowserSessionTabIf, b as sameBrowserSessionTabRecord, d as getOptionalBrowserSessionTabStore, j as rememberColdNativeActivity, k as forgetColdNativeActivity, l as ensureBrowserSessionTabStoreReady, m as parseBrowserSessionTabRecord, n as browserSessionTabStorageKey, p as parseBrowserDashboardStopIntent, q as resolveVolatileTabAlias, r as compareBrowserSessionTabProfileAliases, t as browserSessionTabNativeIdentity, w as withBrowserSessionTabSelection, x as updateBrowserSessionTab, z as hasDurableTabAlias } from "./session-tab-store-D3MRWtH0.mjs";
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
function normalizeProfileAliases(values) {
	return [...new Set((values ?? []).map(normalizeOptionalLowercaseString).filter((value) => Boolean(value)))].toSorted(compareBrowserSessionTabProfileAliases);
}
function resolveInteractionIdentity(params) {
	const sessionKey = normalizeOptionalLowercaseString(params.sessionKey);
	const targetId = params.targetId?.trim();
	if (!sessionKey || !targetId) return;
	const profile = normalizeOptionalLowercaseString(params.profile);
	return {
		sessionKey,
		targetId,
		route: params.route ?? { kind: "browser-control" },
		...profile ? { profile } : {}
	};
}
function isVolatileRoute(route) {
	return route.kind === "node-proxy" || Boolean(route.baseUrl);
}
function durableOwnership(params) {
	return params.ownership?.status === "durable" ? params.ownership : void 0;
}
async function deleteInvalidRecord(key, authority, onWarn) {
	try {
		await deleteBrowserSessionTabIf(key, (current) => {
			if (parseBrowserDashboardStopIntent(key, current)) return false;
			const record = parseBrowserSessionTabRecord(current);
			return !record || browserSessionTabStorageKey(record) !== key;
		}, authority);
	} catch (error) {
		onWarn?.(`failed to delete invalid browser session tab record: ${String(error)}`);
		return;
	}
	onWarn?.("deleted invalid browser session tab record");
}
async function readDurableTabs(onWarn, suppliedAuthority = {}) {
	const authority = captureBrowserSessionTabAuthority(suppliedAuthority);
	const store = getOptionalBrowserSessionTabStore(authority);
	if (!store) return [];
	await ensureBrowserSessionTabStoreReady(authority.runtime);
	const tabs = [];
	for (const entry of await store.entries()) {
		if (parseBrowserDashboardStopIntent(entry.key, entry.value)) continue;
		const record = parseBrowserSessionTabRecord(entry.value);
		if (!record || browserSessionTabStorageKey(record) !== entry.key) {
			await deleteInvalidRecord(entry.key, authority, onWarn);
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
function resolveVolatile(identity, options) {
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
		if (!options?.readOnly && !hasVolatileTabAlias(identity)) forgetVolatileTabAlias(identity);
		return;
	}
	const tab = target.sessionKey === identity.sessionKey ? tabs?.get(target.tabKey) : void 0;
	if (!tab) {
		if (!options?.readOnly) forgetVolatileTabAlias(identity);
		return;
	}
	return {
		tab,
		tabKey: target.tabKey,
		isExact: Boolean(exactTarget)
	};
}
async function readDurableTabsReadOnly(suppliedAuthority = {}) {
	const authority = captureBrowserSessionTabAuthority(suppliedAuthority);
	const store = getOptionalBrowserSessionTabStore(authority);
	if (!store) {
		authority.assertCurrent?.();
		return [];
	}
	await ensureBrowserSessionTabStoreReady(authority.runtime);
	assertBrowserSessionTabAuthority(authority);
	const entries = await store.entries();
	assertBrowserSessionTabAuthority(authority);
	return entries.flatMap(({ key, value }) => {
		const record = parseBrowserSessionTabRecord(value);
		return record && browserSessionTabStorageKey(record) === key ? [{
			...record,
			kind: "durable",
			storageKey: key
		}] : [];
	});
}
/** Reads session membership without changing activity, aliases, or cleanup state. */
async function filterTrackedSessionBrowserTabs(params) {
	const sessionKey = normalizeOptionalLowercaseString(params.sessionKey);
	if (!sessionKey || params.tabs.length === 0) return [];
	const route = params.route ?? { kind: "browser-control" };
	const profile = normalizeOptionalLowercaseString(params.profile);
	const durableKeys = /* @__PURE__ */ new Set();
	const nativeIdentities = /* @__PURE__ */ new Set();
	if (!isVolatileRoute(route) && profile) for (const record of await readDurableTabsReadOnly(params.authority)) {
		if (record.sessionKey !== sessionKey || record.profile !== profile && !record.profileAliases?.includes(profile)) continue;
		durableKeys.add(record.storageKey);
		nativeIdentities.add(browserSessionTabNativeIdentity({
			...record,
			profile
		}));
	}
	return params.tabs.filter((tab) => [tab.targetId, tab.tabId].some((targetId) => {
		const identity = resolveInteractionIdentity({
			sessionKey,
			route,
			profile,
			targetId
		});
		if (!identity) return false;
		if (resolveVolatile(identity, { readOnly: true })) return true;
		const storageKey = resolveDurableTabExact(identity) ?? resolveDurableTabAlias(identity);
		return storageKey !== void 0 && durableKeys.has(storageKey) || profile !== void 0 && nativeIdentities.has(browserSessionTabNativeIdentity({
			sessionKey,
			profile,
			nativeTargetId: identity.targetId
		}));
	}));
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
async function clearDurableForVolatile(identity, authority, onCleared) {
	const mappedKey = resolveDurableTabExact(identity);
	if (!mappedKey) {
		if (authority.runtime) assertBrowserSessionTabAuthority(authority);
		onCleared();
		return true;
	}
	return await withBrowserSessionTabSelection(mappedKey, authority, async (tab) => {
		const record = parseBrowserSessionTabRecord(await tab.lookup());
		assertBrowserSessionTabAuthority(authority);
		if (record) {
			if (!await tab.deleteIf((current) => {
				const selected = parseBrowserSessionTabRecord(current);
				return Boolean(selected && sameBrowserSessionTabRecord(selected, record));
			})) return false;
		} else {
			clearDurableTabAliases(mappedKey);
			activeDurableStorageKeys().delete(mappedKey);
		}
		assertBrowserSessionTabAuthority(authority);
		onCleared();
		return true;
	});
}
function withBrowserDashboardRegistration(targetId, profile, authority, register) {
	if (authority.dashboardRegistration) return register(authority);
	const registration = {
		kind: "dashboard-registration",
		targetId,
		profile
	};
	const current = {
		...authority,
		dashboardRegistration: registration,
		assertCurrent: () => {
			authority.assertCurrent?.();
			if (registration.closeDispatched) throw new Error("Browser dashboard close was dispatched during registration");
		}
	};
	return withBrowserSessionTabOperation(registration, current, () => register(current));
}
async function trackSessionBrowserTab(input) {
	const params = {
		...input,
		authority: captureBrowserSessionTabAuthority(input.authority)
	};
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const ownership = durableOwnership(params);
	const profileAliases = normalizeProfileAliases(params.profileAliases);
	const now = params.now ?? Date.now();
	if (isVolatileRoute(identity.route)) {
		upsertVolatile(identity, params.aliases ?? [], profileAliases, params.ownership, now);
		return;
	}
	const register = async (authority) => {
		await ensureBrowserSessionTabStoreReady(authority.runtime);
		if (!ownership) {
			if (!await clearDurableForVolatile(identity, authority, () => {
				upsertVolatile(identity, params.aliases ?? [], profileAliases, params.ownership, now);
			})) throw new Error("durable browser tab changed during non-durable transition");
			return;
		}
		if (!identity.profile) throw new Error("durable browser tab tracking requires an explicit profile");
		const profile = identity.profile;
		const storageKey = browserSessionTabStorageKey({
			...ownership,
			sessionKey: identity.sessionKey
		});
		const registered = await updateBrowserSessionTab(storageKey, (current) => {
			const existing = parseBrowserSessionTabRecord(current);
			const persistedProfileAliases = normalizeProfileAliases([
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
		}, {
			...authority,
			onCommitted: (record) => {
				rememberDurableTabAliases(identity, params.aliases ?? [], storageKey, record.profileAliases);
				activeDurableStorageKeys().add(storageKey);
				deleteVolatileSessionTab(identity.sessionKey, volatileSessionTabTargetKey(identity));
			}
		});
		return registered ? {
			...registered,
			kind: "durable",
			storageKey
		} : void 0;
	};
	return params.dashboard && ownership ? await withBrowserDashboardRegistration(ownership.nativeTargetId, identity.profile, params.authority, register) : await register(params.authority);
}
function canonicalStorageKey(params, identity) {
	const ownership = durableOwnership(params);
	if (ownership && !identity.profile) return;
	return ownership ? browserSessionTabStorageKey({
		...ownership,
		sessionKey: identity.sessionKey
	}) : resolveDurableTabAlias(identity);
}
async function touchSessionBrowserTab(input) {
	const params = {
		...input,
		authority: captureBrowserSessionTabAuthority(input.authority)
	};
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const now = params.now ?? Date.now();
	const volatile = resolveVolatile(identity);
	if (volatile) volatileTabsBySession().get(identity.sessionKey)?.set(volatile.tabKey, {
		...volatile.tab,
		lastUsedAt: now
	});
	if (isVolatileRoute(identity.route) || !getOptionalBrowserSessionTabStore()) return;
	await ensureBrowserSessionTabStoreReady(params.authority.runtime);
	const key = canonicalStorageKey(params, identity);
	if (key && await withBrowserSessionTabSelection(key, params.authority, async (tab) => {
		const candidate = parseBrowserSessionTabRecord(await tab.lookup());
		if (!candidate) return false;
		await tab.update((current) => {
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
		}, () => activeDurableStorageKeys().add(key));
		return true;
	})) return;
	if (identity.profile) {
		const nativeTargetId = params.nativeTargetId?.trim() || identity.targetId;
		const coldIdentity = browserSessionTabNativeIdentity({
			sessionKey: identity.sessionKey,
			profile: identity.profile,
			nativeTargetId
		});
		await withBrowserSessionTabNativeActivity(coldIdentity, params.authority, async (store) => {
			if (readColdNativeActivity(coldIdentity) !== void 0 || (await store.entries()).some(({ key: entryKey, value }) => {
				const tab = parseBrowserSessionTabRecord(value);
				return tab?.interactionTargetKind === "native" && browserSessionTabNativeIdentity(tab) === coldIdentity && browserSessionTabStorageKey(tab) === entryKey;
			})) {
				if (getOptionalBrowserStateRuntime() === params.authority.runtime) rememberColdNativeActivity(coldIdentity, now);
			}
		});
	}
}
async function untrackSessionBrowserTab(input) {
	const params = {
		...input,
		authority: captureBrowserSessionTabAuthority(input.authority)
	};
	const identity = resolveInteractionIdentity(params);
	if (!identity) return;
	const initialVolatile = resolveVolatile(identity);
	if (isVolatileRoute(identity.route) || !getOptionalBrowserSessionTabStore()) {
		if (initialVolatile) deleteVolatileSessionTab(identity.sessionKey, initialVolatile.tabKey);
		return;
	}
	await ensureBrowserSessionTabStoreReady(params.authority.runtime);
	const key = canonicalStorageKey(params, identity);
	const untrack = async (tab) => {
		const record = tab ? parseBrowserSessionTabRecord(await tab.lookup()) : void 0;
		assertBrowserSessionTabAuthority(params.authority);
		const volatile = resolveVolatile(identity);
		const deleteSelected = async () => {
			if (tab && record) await tab.deleteIf((current) => {
				const selected = parseBrowserSessionTabRecord(current);
				return Boolean(selected && sameBrowserSessionTabRecord(selected, record));
			});
		};
		if (record && durableOwnership(params)) {
			await deleteSelected();
			return;
		}
		const selection = selectSessionTabToUntrack({
			volatileAvailable: Boolean(volatile),
			durableAvailable: Boolean(record),
			hasVolatileCandidate: Boolean(volatile) || hasVolatileTabAlias(identity),
			hasDurableCandidate: Boolean(record) || hasDurableTabAlias(identity),
			volatileIsExact: volatile?.isExact ?? false,
			durableIsExact: Boolean(record && resolveDurableTabExact(identity) === key),
			hasVolatileExactCandidate: hasVolatileTabExact(identity),
			hasDurableExactCandidate: hasDurableTabExact(identity)
		});
		if (selection === "volatile" && volatile) deleteVolatileSessionTab(identity.sessionKey, volatile.tabKey);
		else if (selection === "durable") await deleteSelected();
		else if (selection === "missing" && identity.profile) {
			const identityKey = browserSessionTabNativeIdentity({
				sessionKey: identity.sessionKey,
				profile: identity.profile,
				nativeTargetId: params.nativeTargetId?.trim() || identity.targetId
			});
			await withBrowserSessionTabNativeActivity(identityKey, params.authority, async () => {
				forgetColdNativeActivity(identityKey);
			});
		}
	};
	if (key) await withBrowserSessionTabSelection(key, params.authority, untrack);
	else await untrack();
}
//#endregion
export { trackSessionBrowserTab as a, touchSessionBrowserTab as i, readDurableTabs as n, untrackSessionBrowserTab as o, resolveVolatile as r, withBrowserDashboardRegistration as s, filterTrackedSessionBrowserTabs as t };
