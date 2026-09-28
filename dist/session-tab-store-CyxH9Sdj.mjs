import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Sn as looseObject, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as createPluginRuntimeStore } from "./runtime-store-Mt8Rbmwz.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region extensions/browser/src/browser-runtime-state.ts
const { setRuntime: setBrowserStateRuntime, getRuntime: getBrowserStateRuntime, tryGetRuntime: getOptionalBrowserStateRuntime } = createPluginRuntimeStore({
	pluginId: "browser",
	errorMessage: "Browser state runtime not initialized"
});
//#endregion
//#region extensions/browser/src/browser/session-tab-route.ts
function browserSessionTabRouteKey(route) {
	return route.kind === "node-proxy" ? `node:${route.nodeId}` : `control:${route.baseUrl ?? ""}`;
}
function parseBrowserSessionTabCloseResult(value) {
	const status = asNullableRecord(value)?.status;
	if (status === "cancelled" || status === "closed" || status === "missing" || status === "ownership-mismatch") return { status };
	if (status === "unavailable") return {
		status,
		reason: "target-close-failed"
	};
	return {
		status: "unavailable",
		reason: "target-close-failed"
	};
}
//#endregion
//#region extensions/browser/src/browser/session-tab-ephemeral-aliases.ts
/**
* Process-local aliases for durable storage keys and non-durable tab rows.
*/
const durableAliasStateSymbol = Symbol.for("openclaw.browser.session-tabs.interaction-storage-keys");
const durableExactStateSymbol = Symbol.for("openclaw.browser.session-tabs.exact-interaction-storage-keys");
const volatileAliasStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile-aliases");
const volatileExactStateSymbol = Symbol.for("openclaw.browser.session-tabs.exact-volatile-aliases");
function interactionKey(identity) {
	const route = identity.route ? browserSessionTabRouteKey(identity.route) : browserSessionTabRouteKey({ kind: "browser-control" });
	return `${identity.sessionKey}\u0000${route}\u0000${identity.profile ?? ""}\u0000${identity.targetId}`;
}
function normalizedTargetIds(identity, aliases) {
	return /* @__PURE__ */ new Set([identity.targetId, ...aliases.flatMap((alias) => {
		const targetId = alias?.trim();
		return targetId ? [targetId] : [];
	})]);
}
function normalizedProfiles(identity, aliases) {
	const profiles = /* @__PURE__ */ new Set([identity.profile]);
	for (const alias of aliases) {
		const profile = alias?.trim();
		if (profile) profiles.add(profile);
	}
	return profiles;
}
function durableKeysByInteraction() {
	const state = globalThis;
	state[durableAliasStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[durableAliasStateSymbol];
}
function durableExactKeysByInteraction() {
	const state = globalThis;
	state[durableExactStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[durableExactStateSymbol];
}
function removeStorageKey(mappings, storageKey) {
	for (const [key, storageKeys] of mappings) {
		storageKeys.delete(storageKey);
		if (storageKeys.size === 0) mappings.delete(key);
	}
}
function resetDurableTabAliases() {
	durableKeysByInteraction().clear();
	durableExactKeysByInteraction().clear();
}
function clearDurableTabAliases(storageKey) {
	removeStorageKey(durableKeysByInteraction(), storageKey);
	removeStorageKey(durableExactKeysByInteraction(), storageKey);
}
function rememberDurableTabAliases(identity, aliases, storageKey, profileAliases = []) {
	clearDurableTabAliases(storageKey);
	const mappings = durableKeysByInteraction();
	const exactMappings = durableExactKeysByInteraction();
	for (const profile of normalizedProfiles(identity, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactStorageKeys = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Set();
		exactStorageKeys.add(storageKey);
		exactMappings.set(exactKey, exactStorageKeys);
		for (const targetId of normalizedTargetIds(identity, aliases)) {
			const key = interactionKey({
				...identity,
				profile,
				targetId
			});
			const storageKeys = mappings.get(key) ?? /* @__PURE__ */ new Set();
			storageKeys.add(storageKey);
			mappings.set(key, storageKeys);
		}
	}
}
function resolveDurableTabAlias(identity) {
	const storageKeys = durableKeysByInteraction().get(interactionKey(identity));
	return storageKeys?.size === 1 ? storageKeys.values().next().value : void 0;
}
function hasDurableTabAlias(identity) {
	return (durableKeysByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function resolveDurableTabExact(identity) {
	const storageKeys = durableExactKeysByInteraction().get(interactionKey(identity));
	return storageKeys?.size === 1 ? storageKeys.values().next().value : void 0;
}
function hasDurableTabExact(identity) {
	return (durableExactKeysByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function volatileAliasTargetKey(target) {
	return JSON.stringify([target.sessionKey, target.tabKey]);
}
function volatileAliasesByInteraction() {
	const state = globalThis;
	state[volatileAliasStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileAliasStateSymbol];
}
function volatileExactTargetsByInteraction() {
	const state = globalThis;
	state[volatileExactStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileExactStateSymbol];
}
function removeVolatileTarget(mappings, targetKey) {
	for (const [key, targets] of mappings) {
		targets.delete(targetKey);
		if (targets.size === 0) mappings.delete(key);
	}
}
function clearVolatileTabAliases(sessionKey, tabKey) {
	const targetKey = volatileAliasTargetKey({
		sessionKey,
		tabKey
	});
	removeVolatileTarget(volatileAliasesByInteraction(), targetKey);
	removeVolatileTarget(volatileExactTargetsByInteraction(), targetKey);
}
function rememberVolatileTabAliases(identity, aliases, tabKey, profileAliases = []) {
	clearVolatileTabAliases(identity.sessionKey, tabKey);
	const target = {
		sessionKey: identity.sessionKey,
		tabKey
	};
	const mappings = volatileAliasesByInteraction();
	const exactMappings = volatileExactTargetsByInteraction();
	for (const profile of normalizedProfiles(identity, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactTargets = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Map();
		exactTargets.set(volatileAliasTargetKey(target), target);
		exactMappings.set(exactKey, exactTargets);
		for (const targetId of normalizedTargetIds(identity, aliases)) {
			const key = interactionKey({
				...identity,
				profile,
				targetId
			});
			const targets = mappings.get(key) ?? /* @__PURE__ */ new Map();
			targets.set(volatileAliasTargetKey(target), target);
			mappings.set(key, targets);
		}
	}
}
function resolveVolatileTabAlias(identity) {
	const targets = volatileAliasesByInteraction().get(interactionKey(identity));
	return targets?.size === 1 ? targets.values().next().value : void 0;
}
function hasVolatileTabAlias(identity) {
	return (volatileAliasesByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function resolveVolatileTabExact(identity) {
	const targets = volatileExactTargetsByInteraction().get(interactionKey(identity));
	return targets?.size === 1 ? targets.values().next().value : void 0;
}
function hasVolatileTabExact(identity) {
	return (volatileExactTargetsByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function forgetVolatileTabAlias(identity) {
	volatileAliasesByInteraction().delete(interactionKey(identity));
	volatileExactTargetsByInteraction().delete(interactionKey(identity));
}
//#endregion
//#region extensions/browser/src/browser/session-tab-process-state.ts
function normalizeBrowserSessionKey(value) {
	return normalizeOptionalLowercaseString(value);
}
function volatileSessionTabTargetKey(identity) {
	return `${identity.targetId}\u0000${browserSessionTabRouteKey(identity.route)}\u0000${identity.profile ?? ""}`;
}
function sameVolatileSessionTab(left, right) {
	return volatileSessionTabTargetKey(left) === volatileSessionTabTargetKey(right) && left.sessionKey === right.sessionKey && left.trackedAt === right.trackedAt && left.lastUsedAt === right.lastUsedAt;
}
const volatileStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile");
const volatileCleanupStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile-cleanup");
const activeDurableStateSymbol = Symbol.for("openclaw.browser.session-tabs.active-durable-keys");
const coldNativeActivityStateSymbol = Symbol.for("openclaw.browser.session-tabs.cold-native-activity");
function activeDurableStorageKeys() {
	const state = globalThis;
	state[activeDurableStateSymbol] ??= /* @__PURE__ */ new Set();
	return state[activeDurableStateSymbol];
}
function volatileTabsBySession() {
	const state = globalThis;
	state[volatileStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileStateSymbol];
}
/** Keeps one in-flight volatile target close shared across Browser plugin bundles. */
function volatileTabCleanupByTarget() {
	const state = globalThis;
	state[volatileCleanupStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileCleanupStateSymbol];
}
function volatileRegistrationsForTarget(targetKey) {
	const result = [];
	for (const tabs of volatileTabsBySession().values()) for (const tab of tabs.values()) if (volatileSessionTabTargetKey(tab) === targetKey) result.push(tab);
	return result;
}
function deleteVolatileRegistrations(tabs) {
	for (const tab of tabs) {
		const targetKey = volatileSessionTabTargetKey(tab);
		if ((volatileTabsBySession().get(tab.sessionKey)?.get(targetKey))?.registration === tab.registration) deleteVolatileSessionTab(tab.sessionKey, targetKey);
	}
}
function deleteVolatileSessionTab(sessionKey, tabKey) {
	const state = volatileTabsBySession();
	const tabs = state.get(sessionKey);
	tabs?.delete(tabKey);
	clearVolatileTabAliases(sessionKey, tabKey);
	if (tabs?.size === 0) state.delete(sessionKey);
}
function coldNativeActivity() {
	const state = globalThis;
	state[coldNativeActivityStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[coldNativeActivityStateSymbol];
}
function rememberColdNativeActivity(identity, now) {
	coldNativeActivity().set(identity, now);
}
function forgetColdNativeActivity(identity) {
	coldNativeActivity().delete(identity);
}
function readColdNativeActivity(identity) {
	return coldNativeActivity().get(identity);
}
//#endregion
//#region extensions/browser/src/browser/session-tab-store.ts
const BROWSER_SESSION_TABS_NAMESPACE = "browser.session-tabs";
const BROWSER_SESSION_TABS_MAX_ENTRIES = 5e3;
const browserSessionTimestampSchema = number().finite().nonnegative();
const browserDashboardStopIntentSchema = strictObject({
	kind: literal("dashboard-stop"),
	version: literal(1),
	stopId: uuid(),
	sessionKey: string().min(1),
	agentId: string().min(1),
	name: string().min(1).max(64),
	instanceId: string().min(1),
	url: string().min(1).max(4096),
	profile: string().min(1)
});
const browserProfileAliasSchema = string().min(1).refine((value) => value === value.trim().toLowerCase());
const browserSessionTabRecordSchema = looseObject({
	version: literal(1),
	sessionKey: string().min(1),
	nativeTargetId: string().min(1),
	profile: string().min(1),
	profileAliases: array(browserProfileAliasSchema).min(1).optional(),
	profileFingerprint: string().min(1),
	browserInstanceFingerprint: string().min(1),
	interactionTargetKind: _enum(["native", "opaque"]),
	trackedAt: browserSessionTimestampSchema,
	lastUsedAt: browserSessionTimestampSchema,
	dashboard: object({
		name: string().min(1).max(64),
		sessionKey: string().min(1),
		instanceId: string().min(1),
		agentId: string().min(1).optional(),
		url: string().min(1).max(4096),
		state: _enum([
			"active",
			"stopping",
			"stopped",
			"released"
		])
	}).optional(),
	cleanupRequestedAt: browserSessionTimestampSchema.optional(),
	cleanupAttemptToken: string().min(1).optional(),
	cleanupKind: _enum(["lifecycle", "sweep"]).optional()
}).superRefine((record, context) => {
	if (record.profileAliases) {
		const canonical = [...new Set(record.profileAliases)].toSorted(compareBrowserSessionTabProfileAliases);
		if (canonical.includes(record.profile) || !canonical.every((entry, index) => entry === record.profileAliases?.[index])) context.addIssue({
			code: "custom",
			message: "profile aliases must be canonical"
		});
	}
	const cleanupFieldCount = [
		record.cleanupRequestedAt,
		record.cleanupAttemptToken,
		record.cleanupKind
	].filter((value) => value !== void 0).length;
	if (cleanupFieldCount !== 0 && cleanupFieldCount !== 3) context.addIssue({
		code: "custom",
		message: "cleanup fields must be all present or absent"
	});
	if (Object.hasOwn(record, "baseUrl") || Object.hasOwn(record, "interactionTargetId")) context.addIssue({
		code: "custom",
		message: "retired browser tab fields are not allowed"
	});
});
function browserDashboardStopIntentKey(identity) {
	return `dashboard-stop:${createHash("sha256").update(JSON.stringify([
		identity.sessionKey,
		identity.agentId,
		identity.instanceId,
		identity.name
	])).digest("hex")}`;
}
function parseBrowserDashboardStopIntent(key, value) {
	const parsed = browserDashboardStopIntentSchema.safeParse(value);
	return parsed.success && browserDashboardStopIntentKey(parsed.data) === key ? parsed.data : void 0;
}
function readBrowserDashboardStopIntent(identity) {
	const key = browserDashboardStopIntentKey(identity);
	return parseBrowserDashboardStopIntent(key, getOptionalBrowserSessionTabStore()?.lookup(key));
}
function readBrowserDashboardStopIntents() {
	return (getOptionalBrowserSessionTabStore()?.entries() ?? []).flatMap(({ key, value }) => {
		const intent = parseBrowserDashboardStopIntent(key, value);
		return intent ? [intent] : [];
	});
}
function persistBrowserDashboardStopIntent(identity) {
	const { sessionKey, agentId, name, instanceId, url, profile } = identity;
	const intent = {
		kind: "dashboard-stop",
		version: 1,
		stopId: randomUUID(),
		sessionKey,
		agentId,
		name,
		instanceId,
		url,
		profile
	};
	getBrowserSessionTabStore().register(browserDashboardStopIntentKey(intent), intent);
}
function deleteBrowserDashboardStopIntent(intent) {
	const key = browserDashboardStopIntentKey(intent);
	return deleteBrowserSessionTabIf(key, (current) => parseBrowserDashboardStopIntent(key, current)?.stopId === intent.stopId);
}
/** Opens and publishes Browser's canonical durable tab store during plugin registration. */
function initializeBrowserSessionTabStore(runtime) {
	const options = {
		namespace: BROWSER_SESSION_TABS_NAMESPACE,
		maxEntries: BROWSER_SESSION_TABS_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	};
	const sessionTabs = runtime.state.openSyncKeyedStore(options);
	const state = {
		sessionTabs,
		sessionTabDiscovery: runtime.state.openKeyedStore(options),
		get gateway() {
			return runtime.gateway;
		},
		dashboardOperations: /* @__PURE__ */ new Map()
	};
	setBrowserStateRuntime(state);
	resetDurableTabAliases();
	for (const entry of sessionTabs.entries()) {
		const record = parseBrowserSessionTabRecord(entry.value);
		if (!record || browserSessionTabStorageKey(record) !== entry.key) continue;
		rememberDurableTabAliases({
			sessionKey: record.sessionKey,
			targetId: record.nativeTargetId,
			profile: record.profile
		}, [], entry.key, record.profileAliases);
	}
	return state;
}
function getBrowserSessionTabStore() {
	return getBrowserStateRuntime().sessionTabs;
}
function getOptionalBrowserSessionTabStore() {
	return getOptionalBrowserStateRuntime()?.sessionTabs;
}
function readBrowserDashboardTabs(storageKey) {
	const store = getOptionalBrowserSessionTabStore();
	return (storageKey === void 0 ? store?.entries() ?? [] : [{
		key: storageKey,
		value: store?.lookup(storageKey)
	}]).flatMap(({ key, value }) => {
		const tab = parseBrowserDashboardTab(key, value);
		return tab ? [tab] : [];
	});
}
function parseBrowserDashboardTab(key, value) {
	const record = parseBrowserSessionTabRecord(value);
	return record?.dashboard && browserSessionTabStorageKey(record) === key ? {
		...record,
		storageKey: key
	} : void 0;
}
/** Discovery only; reconciliation rereads current authority after awaited work. */
async function readBrowserDashboardSessionOwners() {
	const entries = await getOptionalBrowserStateRuntime()?.sessionTabDiscovery.entries() ?? [];
	const dashboards = entries.flatMap(({ key, value }) => {
		const tab = parseBrowserDashboardTab(key, value);
		return tab?.dashboard ? [tab.dashboard] : [];
	});
	const stopIntents = entries.flatMap(({ key, value }) => {
		const intent = parseBrowserDashboardStopIntent(key, value);
		return intent ? [intent] : [];
	});
	return [...dashboards, ...stopIntents];
}
/** Ordinary close commands cannot discard a dashboard's retained page. */
function findRetainedBrowserDashboardTab(targetId, profile, tabs = readBrowserDashboardTabs()) {
	return tabs.find((tab) => tab.nativeTargetId === targetId && (!profile || tab.profile === profile) && (tab.dashboard?.state === "active" || tab.dashboard?.state === "stopping"));
}
function assertBrowserDashboardTabCanClose(targetId, profile) {
	const retained = findRetainedBrowserDashboardTab(targetId, profile);
	if (retained) throw new Error(`This tab belongs to dashboard ${retained.dashboard.name}. Stop it from the dashboard or use browser action=close dashboard=${retained.dashboard.name}.`);
}
function browserSessionTabStorageKey(record) {
	return `sha256:${createHash("sha256").update(JSON.stringify([
		record.sessionKey,
		record.nativeTargetId,
		record.profileFingerprint,
		record.browserInstanceFingerprint
	])).digest("hex")}`;
}
function browserSessionTabNativeIdentity(record) {
	return `${record.sessionKey}\u0000${record.profile}\u0000${record.nativeTargetId}`;
}
function compareBrowserSessionTabProfileAliases(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function parseBrowserSessionTabRecord(value) {
	const parsed = browserSessionTabRecordSchema.safeParse(value);
	return parsed.success ? parsed.data : void 0;
}
function sameBrowserSessionTabRecord(left, right) {
	return left.version === right.version && left.sessionKey === right.sessionKey && left.nativeTargetId === right.nativeTargetId && left.profile === right.profile && (left.profileAliases?.length ?? 0) === (right.profileAliases?.length ?? 0) && (left.profileAliases ?? []).every((alias, index) => alias === right.profileAliases?.[index]) && left.profileFingerprint === right.profileFingerprint && left.browserInstanceFingerprint === right.browserInstanceFingerprint && left.interactionTargetKind === right.interactionTargetKind && left.trackedAt === right.trackedAt && left.lastUsedAt === right.lastUsedAt && left.dashboard?.name === right.dashboard?.name && left.dashboard?.sessionKey === right.dashboard?.sessionKey && left.dashboard?.instanceId === right.dashboard?.instanceId && left.dashboard?.agentId === right.dashboard?.agentId && left.dashboard?.url === right.dashboard?.url && left.dashboard?.state === right.dashboard?.state && left.cleanupRequestedAt === right.cleanupRequestedAt && left.cleanupAttemptToken === right.cleanupAttemptToken && left.cleanupKind === right.cleanupKind;
}
function withoutBrowserSessionTabCleanup(record) {
	const active = { ...record };
	delete active.cleanupRequestedAt;
	delete active.cleanupAttemptToken;
	delete active.cleanupKind;
	return active;
}
function retireColdNativeActivityIfUnowned(store, identity) {
	if (!identity || readColdNativeActivity(identity) === void 0) return;
	if (!store.entries().some(({ key, value }) => {
		const record = parseBrowserSessionTabRecord(value);
		return record?.interactionTargetKind === "native" && browserSessionTabNativeIdentity(record) === identity && browserSessionTabStorageKey(record) === key;
	})) forgetColdNativeActivity(identity);
}
function updateBrowserSessionTab(key, update) {
	const store = getBrowserSessionTabStore();
	const updateStore = store.update;
	if (!updateStore) throw new Error("Browser session tab store requires atomic update support");
	let retiredIdentity;
	const updated = updateStore(key, (current) => {
		const previous = parseBrowserSessionTabRecord(current);
		const next = update(current);
		if (previous?.interactionTargetKind === "native" && (next?.interactionTargetKind !== "native" || browserSessionTabNativeIdentity(previous) !== browserSessionTabNativeIdentity(next))) retiredIdentity = browserSessionTabNativeIdentity(previous);
		return next;
	});
	if (updated) retireColdNativeActivityIfUnowned(store, retiredIdentity);
	return updated;
}
function deleteBrowserSessionTabIf(key, predicate) {
	const store = getBrowserSessionTabStore();
	const deleteIf = store.deleteIf;
	if (!deleteIf) throw new Error("Browser session tab store requires atomic deleteIf support");
	let removed;
	const deleted = deleteIf(key, (current) => {
		if (!predicate(current)) return false;
		removed = parseBrowserSessionTabRecord(current);
		return true;
	});
	if (deleted) {
		clearDurableTabAliases(key);
		activeDurableStorageKeys().delete(key);
		retireColdNativeActivityIfUnowned(store, removed?.interactionTargetKind === "native" ? browserSessionTabNativeIdentity(removed) : void 0);
	}
	return deleted;
}
//#endregion
export { volatileSessionTabTargetKey as A, rememberDurableTabAliases as B, deleteVolatileSessionTab as C, rememberColdNativeActivity as D, readColdNativeActivity as E, forgetVolatileTabAlias as F, resolveVolatileTabExact as G, resolveDurableTabAlias as H, hasDurableTabAlias as I, getOptionalBrowserStateRuntime as J, parseBrowserSessionTabCloseResult as K, hasDurableTabExact as L, volatileTabsBySession as M, clearDurableTabAliases as N, sameVolatileSessionTab as O, clearVolatileTabAliases as P, hasVolatileTabAlias as R, deleteVolatileRegistrations as S, normalizeBrowserSessionKey as T, resolveDurableTabExact as U, rememberVolatileTabAliases as V, resolveVolatileTabAlias as W, readBrowserDashboardTabs as _, deleteBrowserDashboardStopIntent as a, withoutBrowserSessionTabCleanup as b, getBrowserSessionTabStore as c, parseBrowserDashboardStopIntent as d, parseBrowserSessionTabRecord as f, readBrowserDashboardStopIntents as g, readBrowserDashboardStopIntent as h, compareBrowserSessionTabProfileAliases as i, volatileTabCleanupByTarget as j, volatileRegistrationsForTarget as k, getOptionalBrowserSessionTabStore as l, readBrowserDashboardSessionOwners as m, browserSessionTabNativeIdentity as n, deleteBrowserSessionTabIf as o, persistBrowserDashboardStopIntent as p, getBrowserStateRuntime as q, browserSessionTabStorageKey as r, findRetainedBrowserDashboardTab as s, assertBrowserDashboardTabCanClose as t, initializeBrowserSessionTabStore as u, sameBrowserSessionTabRecord as v, forgetColdNativeActivity as w, activeDurableStorageKeys as x, updateBrowserSessionTab as y, hasVolatileTabExact as z };
