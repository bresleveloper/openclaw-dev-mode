import { a as resolveGlobalSingleton, r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number, Sn as looseObject, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./global-singleton-yHEs_vfD.mjs";
import { t as createPluginRuntimeStore } from "./runtime-store-USWE9VtE.mjs";
import { createHash, randomUUID } from "node:crypto";
//#region extensions/browser/src/browser-runtime-state.ts
const { setRuntime: setBrowserStateRuntime, getRuntime: getBrowserStateRuntime, tryGetRuntime: getOptionalBrowserStateRuntime } = createPluginRuntimeStore({
	pluginId: "browser",
	errorMessage: "Browser state runtime not initialized"
});
function assertBrowserSessionTabAuthority(authority) {
	const runtime = authority.runtime ?? getBrowserStateRuntime();
	if (getOptionalBrowserStateRuntime() !== runtime) throw new Error("Browser session tab store owner changed");
	authority.assertCurrent?.();
}
function captureBrowserSessionTabAuthority(authority = {}) {
	return {
		...authority,
		runtime: authority.runtime ?? getOptionalBrowserStateRuntime() ?? void 0
	};
}
function isBrowserStateRuntimeCurrent(runtime, isCurrent) {
	return (!runtime || getOptionalBrowserStateRuntime() === runtime) && isCurrent?.() !== false;
}
async function readCurrentBrowserState(runtime, read, isCurrent) {
	if (!isBrowserStateRuntimeCurrent(runtime, isCurrent)) return;
	try {
		const value = await read();
		return isBrowserStateRuntimeCurrent(runtime, isCurrent) ? value : void 0;
	} catch (error) {
		if (!isBrowserStateRuntimeCurrent(runtime, isCurrent)) return;
		throw error;
	}
}
function getPendingBrowserDashboardRegistrations(runtime, targetId, profile) {
	return [...runtime.sessionTabOperations].flatMap(([key, settled]) => typeof key === "object" && key.kind === "dashboard-registration" && (!targetId || key.targetId === targetId) && (!profile || key.profile === profile) ? [{
		registration: key,
		settled
	}] : []);
}
//#endregion
//#region extensions/browser/src/browser/session-tab-route.ts
function browserSessionTabRouteKey(route) {
	return route.kind === "node-proxy" ? `node:${route.nodeId}` : `control:${route.baseUrl ?? ""}`;
}
function parseBrowserSessionTabCloseResult(value) {
	const status = asNullableRecord(value)?.status;
	if (status === "cancelled" || status === "closed" || status === "missing" || status === "ownership-mismatch") return { status };
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
	const route = browserSessionTabRouteKey(identity.route ?? { kind: "browser-control" });
	return `${identity.sessionKey}\u0000${route}\u0000${identity.profile ?? ""}\u0000${identity.targetId}`;
}
function normalizedAliases(primary, aliases) {
	return /* @__PURE__ */ new Set([primary, ...aliases.flatMap((alias) => {
		const value = alias?.trim();
		return value ? [value] : [];
	})]);
}
function durableKeysByInteraction() {
	return resolveGlobalMap(durableAliasStateSymbol);
}
function durableExactKeysByInteraction() {
	return resolveGlobalMap(durableExactStateSymbol);
}
function removeAliasTarget(mappings, targetKey) {
	for (const [key, targets] of mappings) {
		targets.delete(targetKey);
		if (targets.size === 0) mappings.delete(key);
	}
}
function resetDurableTabAliases() {
	durableKeysByInteraction().clear();
	durableExactKeysByInteraction().clear();
}
function clearDurableTabAliases(storageKey) {
	removeAliasTarget(durableKeysByInteraction(), storageKey);
	removeAliasTarget(durableExactKeysByInteraction(), storageKey);
}
function rememberDurableTabAliases(identity, aliases, storageKey, profileAliases = []) {
	clearDurableTabAliases(storageKey);
	const mappings = durableKeysByInteraction();
	const exactMappings = durableExactKeysByInteraction();
	for (const profile of normalizedAliases(identity.profile, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactStorageKeys = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Set();
		exactStorageKeys.add(storageKey);
		exactMappings.set(exactKey, exactStorageKeys);
		for (const targetId of normalizedAliases(identity.targetId, aliases)) {
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
	return resolveGlobalMap(volatileAliasStateSymbol);
}
function volatileExactTargetsByInteraction() {
	return resolveGlobalMap(volatileExactStateSymbol);
}
function clearVolatileTabAliases(sessionKey, tabKey) {
	const targetKey = volatileAliasTargetKey({
		sessionKey,
		tabKey
	});
	removeAliasTarget(volatileAliasesByInteraction(), targetKey);
	removeAliasTarget(volatileExactTargetsByInteraction(), targetKey);
}
function rememberVolatileTabAliases(identity, aliases, tabKey, profileAliases = []) {
	clearVolatileTabAliases(identity.sessionKey, tabKey);
	const target = {
		sessionKey: identity.sessionKey,
		tabKey
	};
	const mappings = volatileAliasesByInteraction();
	const exactMappings = volatileExactTargetsByInteraction();
	for (const profile of normalizedAliases(identity.profile, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactTargets = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Map();
		exactTargets.set(volatileAliasTargetKey(target), target);
		exactMappings.set(exactKey, exactTargets);
		for (const targetId of normalizedAliases(identity.targetId, aliases)) {
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
	return resolveGlobalSingleton(activeDurableStateSymbol, () => /* @__PURE__ */ new Set());
}
function volatileTabsBySession() {
	return resolveGlobalMap(volatileStateSymbol);
}
/** Keeps one in-flight volatile target close shared across Browser plugin bundles. */
function volatileTabCleanupByTarget() {
	return resolveGlobalMap(volatileCleanupStateSymbol);
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
	return resolveGlobalMap(coldNativeActivityStateSymbol);
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
const logger = createSubsystemLogger("browser");
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
async function readBrowserDashboardStopIntent(identity, authority = {}) {
	const key = browserDashboardStopIntentKey(identity);
	return parseBrowserDashboardStopIntent(key, await getOptionalBrowserSessionTabStore(authority)?.lookup(key));
}
async function readBrowserDashboardStopIntents(authority = {}) {
	return (await getOptionalBrowserSessionTabStore(authority)?.entries() ?? []).flatMap(({ key, value }) => {
		const intent = parseBrowserDashboardStopIntent(key, value);
		return intent ? [intent] : [];
	});
}
async function persistBrowserDashboardStopIntent(identity, authority = {}) {
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
	await withBrowserSessionTabOperation(browserDashboardStopIntentKey(intent), authority, async (store) => {
		await store.register(browserDashboardStopIntentKey(intent), intent);
	});
}
async function deleteBrowserDashboardStopIntent(intent, authority = {}) {
	const key = browserDashboardStopIntentKey(intent);
	return deleteBrowserSessionTabIf(key, (current) => parseBrowserDashboardStopIntent(key, current)?.stopId === intent.stopId, authority);
}
/** Opens and publishes Browser's canonical durable tab store during plugin registration. */
function initializeBrowserSessionTabStore(runtime) {
	const state = {
		sessionTabs: runtime.state.openKeyedStore({
			namespace: BROWSER_SESSION_TABS_NAMESPACE,
			maxEntries: BROWSER_SESSION_TABS_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		}),
		sessionTabOperations: /* @__PURE__ */ new Map(),
		get gateway() {
			return runtime.gateway;
		},
		dashboardOperations: /* @__PURE__ */ new Map()
	};
	setBrowserStateRuntime(state);
	resetDurableTabAliases();
	return state;
}
async function ensureBrowserSessionTabStoreReady(runtime = getOptionalBrowserStateRuntime()) {
	if (!runtime) return;
	const initialization = runtime.sessionTabInitialization ??= (async () => {
		const entries = await getBrowserSessionTabStore({ runtime }).entries();
		assertBrowserSessionTabAuthority({ runtime });
		for (const entry of entries) {
			const record = parseBrowserSessionTabRecord(entry.value);
			if (!record || browserSessionTabStorageKey(record) !== entry.key) continue;
			rememberDurableTabAliases({
				sessionKey: record.sessionKey,
				targetId: record.nativeTargetId,
				profile: record.profile
			}, [], entry.key, record.profileAliases);
		}
	})();
	try {
		await initialization;
	} catch (error) {
		if (runtime.sessionTabInitialization === initialization) runtime.sessionTabInitialization = void 0;
		throw error;
	}
	assertBrowserSessionTabAuthority({ runtime });
}
async function drainBrowserSessionTabStore(runtime) {
	await runtime.sessionTabInitialization?.catch(() => {});
	while (runtime.sessionTabOperations.size > 0 || runtime.dashboardOperations.size > 0) await Promise.allSettled([...runtime.sessionTabOperations.values(), ...[...runtime.dashboardOperations.values()].map(({ promise }) => promise)]);
}
function getBrowserSessionTabStore(authority = {}) {
	const runtime = authority.runtime ?? getBrowserStateRuntime();
	const withCurrent = runtime.sessionTabs.withCurrent;
	if (!withCurrent) throw new Error("Browser session tab store requires worker comparison support");
	return withCurrent({
		assertCurrent: () => assertBrowserSessionTabAuthority({
			...authority,
			runtime
		}),
		sessionEntryCurrent: authority.sessionEntryCurrent
	});
}
function getOptionalBrowserSessionTabStore(authority = {}) {
	return authority.runtime || getOptionalBrowserStateRuntime() ? getBrowserSessionTabStore(authority) : void 0;
}
async function withBrowserSessionTabOperation(keys, authority, operation, dependencies = []) {
	const runtime = authority.runtime ?? getBrowserStateRuntime();
	const store = getBrowserSessionTabStore({
		...authority,
		runtime
	});
	const selected = Array.isArray(keys) ? [...new Set(keys)] : [keys];
	const previous = selected.flatMap((key) => runtime.sessionTabOperations.get(key) ?? []);
	const pending = Promise.all([...previous, ...dependencies]).then(async () => {
		assertBrowserSessionTabAuthority({
			...authority,
			runtime
		});
		return await operation(store);
	});
	const settled = pending.then(() => {}, () => {});
	for (const key of selected) runtime.sessionTabOperations.set(key, settled);
	try {
		return await pending;
	} finally {
		for (const key of selected) if (runtime.sessionTabOperations.get(key) === settled) runtime.sessionTabOperations.delete(key);
	}
}
/** Hold same-process mutation admission through the fresh read and synchronous effect dispatch. */
async function dispatchBrowserSessionTabIfCurrent(key, predicate, dispatch, authority = {}) {
	const captured = {
		...authority,
		runtime: authority.runtime ?? getBrowserStateRuntime()
	};
	return await (await withBrowserSessionTabOperation(key, captured, async (store) => {
		if (!predicate(await store.lookup(key))) return;
		assertBrowserSessionTabAuthority(captured);
		return { result: dispatch() };
	}))?.result;
}
async function readBrowserDashboardTabs(storageKey, authority = {}) {
	const store = getOptionalBrowserSessionTabStore(authority);
	return (storageKey === void 0 ? await store?.entries() ?? [] : [{
		key: storageKey,
		value: await store?.lookup(storageKey)
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
	const entries = await getOptionalBrowserSessionTabStore()?.entries() ?? [];
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
function findRetainedBrowserDashboardTab(targetId, profile, tabs) {
	return tabs.find((tab) => tab.nativeTargetId === targetId && (!profile || tab.profile === profile) && (tab.dashboard?.state === "active" || tab.dashboard?.state === "stopping"));
}
const dashboardTargetLane = "dashboard-target:";
const unidentifiedDashboardCloseLane = "dashboard-close:unidentified";
function withDashboardTabAdmission(targets, authority, operation) {
	const runtime = authority.runtime ?? getBrowserStateRuntime();
	const operations = runtime.sessionTabOperations;
	const dependencies = targets ? [operations.get(unidentifiedDashboardCloseLane)].filter((entry) => entry !== void 0) : [...operations].flatMap(([key, pending]) => typeof key === "string" && key.startsWith(dashboardTargetLane) ? [pending] : []);
	return withBrowserSessionTabOperation(targets ? targets.map((target) => `${dashboardTargetLane}${target}`) : unidentifiedDashboardCloseLane, {
		...authority,
		runtime
	}, operation, dependencies);
}
async function dispatchBrowserTabClose(targetId, profile, dispatch, options = {}) {
	const runtime = getOptionalBrowserStateRuntime();
	if (!runtime) {
		const assertion = options.assertCurrent?.();
		if (assertion) await assertion;
		return await dispatch();
	}
	const registrations = getPendingBrowserDashboardRegistrations(runtime, targetId, profile);
	if (registrations.length > 0) await Promise.all(registrations.map(({ settled }) => settled));
	return await (await withDashboardTabAdmission(targetId ? [targetId] : void 0, { runtime }, async (store) => {
		const tabs = (await store.entries()).flatMap(({ key, value }) => {
			const tab = parseBrowserDashboardTab(key, value);
			return tab ? [tab] : [];
		});
		assertBrowserSessionTabAuthority({ runtime });
		if (!targetId && tabs.length > 0) throw new Error("Cannot verify that this page is not retained by a dashboard");
		const retained = targetId ? findRetainedBrowserDashboardTab(targetId, profile, tabs) : void 0;
		if (retained && options.skipRetained) return;
		if (retained) throw new Error(`This tab belongs to dashboard ${retained.dashboard.name}. Stop it from the dashboard or use browser action=close dashboard=${retained.dashboard.name}.`);
		const assertion = options.assertCurrent?.();
		if (assertion) await assertion;
		assertBrowserSessionTabAuthority({ runtime });
		const pending = getPendingBrowserDashboardRegistrations(runtime, targetId, profile);
		for (const { registration } of pending) registration.closeDispatched = true;
		return { result: dispatch() };
	}))?.result;
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
async function retireColdNativeActivityIfUnowned(store, identity, authority) {
	if (!identity || readColdNativeActivity(identity) === void 0) return;
	const entries = await store.entries().catch((error) => {
		logger.warn(`Could not retire Browser tab activity: ${String(error)}`);
	});
	if (!entries) return;
	if (!entries.some(({ key, value }) => {
		const record = parseBrowserSessionTabRecord(value);
		return record?.interactionTargetKind === "native" && browserSessionTabNativeIdentity(record) === identity && browserSessionTabStorageKey(record) === key;
	}) && getOptionalBrowserStateRuntime() === authority.runtime) forgetColdNativeActivity(identity);
}
async function withBrowserSessionTabSelection(key, authority, select) {
	const captured = {
		...authority,
		runtime: authority.runtime ?? getBrowserStateRuntime()
	};
	return await withBrowserSessionTabOperation(key, captured, async (store) => await select({
		lookup: () => store.lookup(key),
		update: (update, onCommitted) => updateBrowserSessionTabInOperation(store, key, update, {
			...captured,
			onCommitted
		}),
		deleteIf: (predicate) => deleteBrowserSessionTabInOperation(store, key, predicate, captured)
	}));
}
async function updateBrowserSessionTab(key, update, authority = {}) {
	return await withBrowserSessionTabSelection(key, authority, (tab) => tab.update(update, authority.onCommitted));
}
async function deleteBrowserSessionTabIf(key, predicate, authority = {}) {
	return await withBrowserSessionTabSelection(key, authority, (tab) => tab.deleteIf(predicate));
}
async function withBrowserSessionTabNativeActivity(identity, authority, operation) {
	return await withBrowserSessionTabOperation(`native:${identity}`, authority, operation);
}
async function withBrowserSessionTabNativeIdentities(records, authority, operation) {
	const dashboardTargets = records.flatMap((record) => record?.dashboard ? [record.nativeTargetId] : []);
	const runOperation = () => dashboardTargets.length > 0 ? withDashboardTabAdmission(dashboardTargets, authority, operation) : operation();
	const identities = [...new Set(records.flatMap((record) => record?.interactionTargetKind === "native" ? [browserSessionTabNativeIdentity(record)] : []))].toSorted();
	const run = async (index) => {
		const identity = identities[index];
		return identity === void 0 ? await runOperation() : await withBrowserSessionTabNativeActivity(identity, authority, () => run(index + 1));
	};
	return await run(0);
}
async function updateBrowserSessionTabInOperation(store, key, update, authority) {
	let observed = await store.observe(key);
	while (true) {
		const next = update(observed.value);
		const previous = parseBrowserSessionTabRecord(observed.value);
		const outcome = await withBrowserSessionTabNativeIdentities([previous, next], authority, async () => {
			const result = await store.compareAndApply(key, observed.comparison, next ? {
				operation: "update",
				action: "set",
				value: next
			} : {
				operation: "update",
				action: "keep"
			});
			if (result.status === "conflict" || !next || getOptionalBrowserStateRuntime() !== authority.runtime) return result;
			authority.onCommitted?.(next);
			if (previous?.interactionTargetKind === "native" && (next.interactionTargetKind !== "native" || browserSessionTabNativeIdentity(previous) !== browserSessionTabNativeIdentity(next))) await retireColdNativeActivityIfUnowned(store, browserSessionTabNativeIdentity(previous), authority);
			return result;
		});
		if (outcome.status === "conflict") {
			observed = outcome.current;
			continue;
		}
		return next;
	}
}
async function deleteBrowserSessionTabInOperation(store, key, predicate, authority) {
	let observed = await store.observe(key);
	while (true) {
		const shouldDelete = observed.value !== void 0 && predicate(observed.value);
		const removed = parseBrowserSessionTabRecord(observed.value);
		const outcome = await withBrowserSessionTabNativeIdentities([removed], authority, async () => {
			const result = await store.compareAndApply(key, observed.comparison, {
				operation: "delete",
				action: shouldDelete ? "delete" : "keep"
			});
			if (result.status === "conflict" || !shouldDelete || getOptionalBrowserStateRuntime() !== authority.runtime) return result;
			clearDurableTabAliases(key);
			activeDurableStorageKeys().delete(key);
			await retireColdNativeActivityIfUnowned(store, removed?.interactionTargetKind === "native" ? browserSessionTabNativeIdentity(removed) : void 0, authority);
			return result;
		});
		if (outcome.status === "conflict") {
			observed = outcome.current;
			continue;
		}
		return shouldDelete;
	}
}
//#endregion
export { getOptionalBrowserStateRuntime as $, readColdNativeActivity as A, hasDurableTabExact as B, withBrowserSessionTabOperation as C, deleteVolatileRegistrations as D, activeDurableStorageKeys as E, volatileTabCleanupByTarget as F, resolveDurableTabAlias as G, hasVolatileTabExact as H, volatileTabsBySession as I, resolveVolatileTabExact as J, resolveDurableTabExact as K, clearDurableTabAliases as L, sameVolatileSessionTab as M, volatileRegistrationsForTarget as N, deleteVolatileSessionTab as O, volatileSessionTabTargetKey as P, getBrowserStateRuntime as Q, forgetVolatileTabAlias as R, withBrowserSessionTabNativeActivity as S, withoutBrowserSessionTabCleanup as T, rememberDurableTabAliases as U, hasVolatileTabAlias as V, rememberVolatileTabAliases as W, assertBrowserSessionTabAuthority as X, parseBrowserSessionTabCloseResult as Y, captureBrowserSessionTabAuthority as Z, readBrowserDashboardStopIntent as _, deleteBrowserSessionTabIf as a, sameBrowserSessionTabRecord as b, drainBrowserSessionTabStore as c, getOptionalBrowserSessionTabStore as d, isBrowserStateRuntimeCurrent as et, initializeBrowserSessionTabStore as f, readBrowserDashboardSessionOwners as g, persistBrowserDashboardStopIntent as h, deleteBrowserDashboardStopIntent as i, rememberColdNativeActivity as j, forgetColdNativeActivity as k, ensureBrowserSessionTabStoreReady as l, parseBrowserSessionTabRecord as m, browserSessionTabStorageKey as n, dispatchBrowserSessionTabIfCurrent as o, parseBrowserDashboardStopIntent as p, resolveVolatileTabAlias as q, compareBrowserSessionTabProfileAliases as r, dispatchBrowserTabClose as s, browserSessionTabNativeIdentity as t, readCurrentBrowserState as tt, findRetainedBrowserDashboardTab as u, readBrowserDashboardStopIntents as v, withBrowserSessionTabSelection as w, updateBrowserSessionTab as x, readBrowserDashboardTabs as y, hasDurableTabAlias as z };
