import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./runtime-config-snapshot-DlrhEsA8.mjs";
import { $ as getOptionalBrowserStateRuntime, Q as getBrowserStateRuntime, T as withoutBrowserSessionTabCleanup, _ as readBrowserDashboardStopIntent, a as deleteBrowserSessionTabIf, b as sameBrowserSessionTabRecord, et as isBrowserStateRuntimeCurrent, h as persistBrowserDashboardStopIntent, i as deleteBrowserDashboardStopIntent, m as parseBrowserSessionTabRecord, tt as readCurrentBrowserState, v as readBrowserDashboardStopIntents, x as updateBrowserSessionTab, y as readBrowserDashboardTabs } from "./session-tab-store-D3MRWtH0.mjs";
import { i as resolveBrowserConfig, r as isLocalManagedProfile, s as resolveProfile } from "./config-DQZ6ubGi.mjs";
import { n as resolveCdpControlPolicy } from "./cdp-reachability-policy-38poFoxo.mjs";
import { f as resolveCdpTabOwnership, r as closeTrackedCdpTarget } from "./cdp.helpers-r6708sL2.mjs";
import { a as trackSessionBrowserTab, s as withBrowserDashboardRegistration } from "./session-tab-tracking-BQ9FVIXn.mjs";
import { t as closeBrowserDashboardTabs } from "./session-tab-registry-2huxYiIa.mjs";
import { o as withBrowserRequestScope } from "./client-request-B7F7uOcw.mjs";
import { a as browserOpenTab, f as browserTabs } from "./client-JPKXYOWI.mjs";
import { n as sameBrowserDashboardDefinition, t as readBrowserDashboardDefinition } from "./browser-dashboard-definition-BDAe-mpi.mjs";
//#region extensions/browser/src/browser-dashboard-records.ts
const logger = createSubsystemLogger("browser");
function emitDashboardChanged(definition, authority) {
	try {
		authority.runtime?.dashboardEvents?.emit("dashboard_changed", {
			sessionKey: definition.sessionKey,
			name: definition.name,
			instanceId: definition.instanceId
		}, { scope: "operator.admin" });
	} catch (error) {
		logger.warn(`Browser dashboard invalidation unavailable: ${String(error)}`);
	}
}
async function tabsForDefinition(definition, authority, storageKey) {
	return (await readBrowserDashboardTabs(storageKey, authority)).filter((tab) => tab.dashboard?.sessionKey === definition.sessionKey && tab.dashboard?.instanceId === definition.instanceId && tab.dashboard?.agentId === definition.agentId && tab.dashboard?.name === definition.name).toSorted((left, right) => Number(right.dashboard?.state === "active") - Number(left.dashboard?.state === "active"));
}
function definitionOwnsTab(definition, tab) {
	return Boolean(definition && definition.profile === tab.profile && definition.url === tab.dashboard?.url && definition.instanceId === tab.dashboard?.instanceId && definition.sessionKey === tab.dashboard?.sessionKey);
}
async function changeTabState(tab, state, authority) {
	const updated = await updateBrowserSessionTab(tab.storageKey, (raw) => {
		const current = parseBrowserSessionTabRecord(raw);
		if (!current?.dashboard || !sameBrowserSessionTabRecord(current, tab)) return;
		return {
			...withoutBrowserSessionTabCleanup(current),
			dashboard: {
				...current.dashboard,
				state
			}
		};
	}, authority);
	return updated ? {
		...updated,
		storageKey: tab.storageKey
	} : void 0;
}
async function deleteStoppedTab(tab, authority) {
	return await deleteBrowserSessionTabIf(tab.storageKey, (raw) => {
		const current = parseBrowserSessionTabRecord(raw);
		return Boolean(current && sameBrowserSessionTabRecord(current, tab));
	}, authority);
}
async function releaseTab(tab, authority, params = {}) {
	if (params.prepareCurrent && !await params.prepareCurrent() || params.isCurrent?.() === false) return {
		released: false,
		closed: 0
	};
	const releaseAuthority = {
		...authority,
		...params.sessionEntryCurrent ? { sessionEntryCurrent: params.sessionEntryCurrent } : {},
		assertCurrent: () => {
			authority.assertCurrent?.();
			if (params.isCurrent?.() === false) throw new Error("Browser dashboard cleanup caller changed");
		}
	};
	if (tab.dashboard?.state === "stopped") return {
		released: await deleteStoppedTab(tab, releaseAuthority),
		closed: 0
	};
	const released = tab.dashboard?.state === "released" ? tab : await changeTabState(tab, "released", releaseAuthority);
	const closed = released ? await closeBrowserDashboardTabs([released], {
		...params,
		authority
	}) : 0;
	return {
		released: (await readBrowserDashboardTabs(tab.storageKey, { runtime: authority.runtime })).length === 0,
		closed
	};
}
async function closeStoppingTab(tab, definition, authority, params = {}) {
	const closed = await closeBrowserDashboardTabs([tab], {
		...params,
		authority
	});
	if ((await readBrowserDashboardTabs(tab.storageKey, { runtime: authority.runtime })).some((current) => current.dashboard?.state === "stopped")) emitDashboardChanged(definition, authority);
	return closed;
}
//#endregion
//#region extensions/browser/src/browser-dashboard.ts
function assertAuthority(authority) {
	authority.signal?.throwIfAborted();
	authority.assertCurrent?.();
}
function bindDashboardAuthority(authority) {
	const runtime = authority.runtime ?? getBrowserStateRuntime();
	return {
		...authority,
		runtime,
		assertCurrent: () => {
			assertAuthority(authority);
			if (getOptionalBrowserStateRuntime() !== runtime) throw new Error("Browser dashboard runtime changed");
		}
	};
}
function operationKey(definition) {
	return JSON.stringify([
		definition.sessionKey,
		definition.agentId,
		definition.instanceId
	]);
}
function responseFor(definition, tab, stopped = false) {
	const paused = tab?.dashboard?.state === "stopped" || tab?.dashboard?.state === "stopping" || !tab && stopped;
	return {
		sessionKey: definition.sessionKey,
		name: definition.name,
		instanceId: definition.instanceId,
		revision: definition.revision,
		paused,
		stopping: tab?.dashboard?.state === "stopping",
		url: definition.url,
		...definition.title ? { title: definition.title } : {},
		...tab?.dashboard?.state === "active" ? { browserTab: {
			target: "host",
			profile: tab.profile,
			targetId: tab.nativeTargetId
		} } : {}
	};
}
async function requireDefinition(request, authority) {
	assertAuthority(authority);
	const definition = await readBrowserDashboardDefinition(request);
	assertAuthority(authority);
	if (!definition) throw new Error(`Browser dashboard ${request.name} is missing, invalid, or was replaced. Read the dashboard; repair it with widget_put using an HTTP(S) URL and a local managed profile, or remove the widget.`);
	return definition;
}
async function assertDefinitionCurrent(definition, authority) {
	const current = await readBrowserDashboardDefinition(definition);
	assertAuthority(authority);
	if (!sameBrowserDashboardDefinition(definition, current)) throw new Error(`Browser dashboard ${definition.name} changed during this operation. Retry with its current definition.`);
}
async function resolveManagedProfile(definition) {
	const { getBrowserControlState } = await import("./browser-control-state-BcYPh-Fr.mjs");
	const state = getBrowserControlState();
	const config = state ? void 0 : getRuntimeConfig();
	const resolved = state?.resolved ?? resolveBrowserConfig(config?.browser, config);
	const profile = resolveProfile(resolved, definition.profile);
	if (!profile || !isLocalManagedProfile(profile)) throw new Error(`Browser dashboard ${definition.name} requires a local managed profile; ${definition.profile} cannot be attached or routed to another host.`);
	return {
		profile,
		resolved,
		ssrfPolicy: resolveCdpControlPolicy(profile, resolved.ssrfPolicy)
	};
}
async function observeExistingTab(definition, tab, authority) {
	const { profile, resolved, ssrfPolicy } = await resolveManagedProfile(definition);
	assertAuthority(authority);
	const tabs = await browserTabs(void 0, {
		profile: profile.name,
		signal: authority.signal
	});
	assertAuthority(authority);
	if (!tabs.running) return "unreachable";
	if (!tabs.tabs.some((candidate) => candidate.targetId === tab.nativeTargetId)) return "missing";
	const ownership = await resolveCdpTabOwnership({
		profileName: profile.name,
		cdpUrl: profile.cdpUrl,
		nativeTargetId: tab.nativeTargetId,
		ssrfPolicy,
		timeoutMs: resolved.remoteCdpTimeoutMs,
		signal: authority.signal
	});
	assertAuthority(authority);
	if (ownership.status !== "durable") throw new Error(`Could not verify the current browser instance for dashboard ${definition.name}. Retry when the browser is available; its existing tab has been kept.`);
	return ownership.profileFingerprint === tab.profileFingerprint && ownership.browserInstanceFingerprint === tab.browserInstanceFingerprint ? "present" : "different-browser";
}
async function materialize(definition, resume, authority) {
	const { profile, resolved, ssrfPolicy } = await resolveManagedProfile(definition);
	assertAuthority(authority);
	const stoppedIntent = await readBrowserDashboardStopIntent(definition, authority);
	assertAuthority(authority);
	const superseded = [];
	const tabs = await tabsForDefinition(definition, authority);
	assertAuthority(authority);
	for (const tab of tabs) {
		if (!definitionOwnsTab(definition, tab) || tab.dashboard?.state === "released") {
			superseded.push({
				tab,
				wasUnreachable: false
			});
			continue;
		}
		if (tab.dashboard?.state === "stopping" || tab.dashboard?.state === "stopped") {
			if (!resume) {
				await assertDefinitionCurrent(definition, authority);
				return responseFor(definition, tab);
			}
			superseded.push({
				tab,
				wasUnreachable: false
			});
			continue;
		}
		const observation = await observeExistingTab(definition, tab, authority);
		if (observation === "present") {
			await assertDefinitionCurrent(definition, authority);
			const current = (await tabsForDefinition(definition, authority, tab.storageKey))[0];
			assertAuthority(authority);
			if (!current || current.dashboard?.state !== "active") throw new Error("Dashboard tab stopped during this operation");
			return responseFor(definition, current);
		}
		superseded.push({
			tab,
			wasUnreachable: observation === "unreachable"
		});
	}
	await assertDefinitionCurrent(definition, authority);
	if (!resume && stoppedIntent && sameBrowserDashboardDefinition(stoppedIntent, definition)) return responseFor(definition, void 0, true);
	const opened = await browserOpenTab(void 0, definition.url, {
		profile: profile.name,
		signal: authority.signal,
		managedOnly: true
	});
	const ownership = opened.ownership;
	let materialized;
	try {
		if (ownership?.status !== "durable" || opened.resolvedProfile !== profile.name) throw new Error("Browser could not verify durable ownership for this dashboard tab");
		materialized = await withBrowserDashboardRegistration(ownership.nativeTargetId, profile.name, authority, async (registrationAuthority) => {
			await assertDefinitionCurrent(definition, registrationAuthority);
			if (superseded.some(({ tab, wasUnreachable }) => wasUnreachable && tab.profileFingerprint === ownership.profileFingerprint && tab.browserInstanceFingerprint === ownership.browserInstanceFingerprint)) throw new Error(`Browser dashboard ${definition.name} was temporarily unreachable. Retry; its existing tab has been kept.`);
			for (const candidate of superseded) {
				if (candidate.tab.dashboard?.state === "stopping" && definitionOwnsTab(definition, candidate.tab)) {
					await closeStoppingTab(candidate.tab, definition, registrationAuthority);
					assertAuthority(registrationAuthority);
					const stopped = (await tabsForDefinition(definition, registrationAuthority, candidate.tab.storageKey)).find((tab) => tab.dashboard?.state === "stopped");
					assertAuthority(registrationAuthority);
					if (!stopped) throw new Error("Previous dashboard tab could not stop; retry when its browser is available");
					candidate.tab = stopped;
				}
				if (candidate.tab.dashboard?.state === "stopped") continue;
				if (!(await releaseTab(candidate.tab, registrationAuthority)).released) throw new Error("Previous dashboard tab could not be released; retry when its browser is available");
				assertAuthority(registrationAuthority);
			}
			await assertDefinitionCurrent(definition, registrationAuthority);
			const tab = await trackSessionBrowserTab({
				sessionKey: definition.sessionKey,
				targetId: ownership.nativeTargetId,
				profile: profile.name,
				ownership,
				authority: registrationAuthority,
				dashboard: {
					name: definition.name,
					sessionKey: definition.sessionKey,
					instanceId: definition.instanceId,
					agentId: definition.agentId,
					url: definition.url,
					state: "active"
				}
			});
			if (!tab) throw new Error("Browser dashboard target registration failed");
			return tab;
		});
	} catch (error) {
		if (ownership?.status === "durable") {
			const cleanupAuthority = { runtime: authority.runtime };
			try {
				await trackSessionBrowserTab({
					sessionKey: definition.sessionKey,
					targetId: ownership.nativeTargetId,
					profile: profile.name,
					ownership,
					authority: cleanupAuthority,
					dashboard: {
						sessionKey: definition.sessionKey,
						agentId: definition.agentId,
						name: definition.name,
						instanceId: definition.instanceId,
						url: definition.url,
						state: "released"
					}
				});
			} catch (trackingError) {
				const outcome = await closeTrackedCdpTarget({
					profileName: profile.name,
					cdpUrl: profile.cdpUrl,
					nativeTargetId: ownership.nativeTargetId,
					expectedProfileFingerprint: ownership.profileFingerprint,
					expectedBrowserInstanceFingerprint: ownership.browserInstanceFingerprint,
					timeoutMs: resolved.remoteCdpTimeoutMs,
					ssrfPolicy
				});
				if (outcome.status === "unavailable" || outcome.status === "cancelled") throw new AggregateError([error, trackingError], "Dashboard creation failed and its new tab could neither be retained nor closed", { cause: trackingError });
				throw error;
			}
			const released = (await tabsForDefinition(definition, cleanupAuthority)).find((tab) => tab.nativeTargetId === ownership.nativeTargetId && tab.profileFingerprint === ownership.profileFingerprint && tab.browserInstanceFingerprint === ownership.browserInstanceFingerprint);
			if (!released || !(await releaseTab(released, cleanupAuthority)).released) throw new Error("Dashboard creation failed; its retained cleanup record will retry closing the new tab", { cause: error });
		}
		throw error;
	}
	assertAuthority(authority);
	emitDashboardChanged(definition, authority);
	for (const { tab: previous } of superseded) if (previous.dashboard?.state === "stopped") await deleteStoppedTab(previous, authority);
	if (stoppedIntent) await deleteBrowserDashboardStopIntent(stoppedIntent, authority);
	assertAuthority(authority);
	return responseFor(definition, materialized);
}
/** Re-resolve immediately before a model action crosses into Browser's normal dispatch. */
async function assertBrowserDashboardTargetCurrent(response, agentId, suppliedAuthority = {}, profile) {
	const authority = bindDashboardAuthority(suppliedAuthority);
	const definition = await requireDefinition({
		...response,
		agentId
	}, authority);
	const target = response.browserTab;
	if (!target) throw new Error("Dashboard has no active browser target");
	const current = (await tabsForDefinition(definition, authority)).find((tab) => definitionOwnsTab(definition, tab) && tab.dashboard?.state === "active" && tab.nativeTargetId === target.targetId && tab.profile === target.profile);
	assertAuthority(authority);
	if (!current) throw new Error("Dashboard browser target changed or stopped; resolve the dashboard again");
	if (profile) {
		if (profile.name !== current.profile || !isLocalManagedProfile(profile)) throw new Error("Dashboard browser profile changed; resolve the dashboard again");
		const ownership = await resolveCdpTabOwnership({
			profileName: profile.name,
			cdpUrl: profile.cdpUrl,
			nativeTargetId: current.nativeTargetId,
			signal: authority.signal
		});
		await assertDefinitionCurrent(definition, authority);
		const retained = (await tabsForDefinition(definition, authority, current.storageKey)).find((tab) => tab.dashboard?.state === "active" && definitionOwnsTab(definition, tab));
		assertAuthority(authority);
		if (!retained || ownership.status !== "durable" || ownership.profileFingerprint !== retained.profileFingerprint || ownership.browserInstanceFingerprint !== retained.browserInstanceFingerprint) throw new Error("Dashboard browser instance changed; reopen the dashboard before interacting");
	}
}
async function serializeDashboardOperation(request, kind, authority, execute) {
	const boundAuthority = bindDashboardAuthority(authority);
	const runtime = boundAuthority.runtime;
	const definition = await requireDefinition(request, boundAuthority);
	const operations = runtime.dashboardOperations;
	const key = operationKey(definition);
	const previous = operations.get(key);
	let materializationFailure;
	const promise = (async () => {
		await previous?.promise.catch(() => void 0);
		if (kind === "materialize") materializationFailure = previous?.materializationFailure;
		const current = await requireDefinition(definition, boundAuthority);
		if (materializationFailure && !materializationFailure.callerCancelled && sameBrowserDashboardDefinition(materializationFailure.definition, current)) throw materializationFailure.error;
		materializationFailure = void 0;
		try {
			return await execute(current, boundAuthority);
		} catch (error) {
			if (kind === "materialize") {
				let callerCancelled = false;
				try {
					assertAuthority(boundAuthority);
				} catch {
					callerCancelled = true;
				}
				materializationFailure = {
					error,
					definition: current,
					callerCancelled
				};
			}
			throw error;
		}
	})();
	const pending = {
		promise,
		get materializationFailure() {
			return materializationFailure;
		}
	};
	operations.set(key, pending);
	try {
		return await promise;
	} finally {
		if (operations.get(key) === pending) operations.delete(key);
	}
}
/** Materialize once per board instance; hidden views do not own the target lifetime. */
async function requestBrowserDashboard(request, authority = {}) {
	return await serializeDashboardOperation(request, "materialize", authority, (definition, current) => withBrowserRequestScope({
		managedOnly: true,
		assertCurrent: () => assertDefinitionCurrent(definition, current)
	}, async () => await materialize(definition, request.resume === true, current)));
}
/** Read saved Browser lifetime without opening or resuming a target. */
async function inspectBrowserDashboard(request, suppliedAuthority = {}) {
	const authority = bindDashboardAuthority(suppliedAuthority);
	const definition = await requireDefinition(request, authority);
	const stoppedIntent = await readBrowserDashboardStopIntent(definition, authority);
	const tab = (await tabsForDefinition(definition, authority)).find((entry) => definitionOwnsTab(definition, entry) && entry.dashboard?.state !== "released");
	assertAuthority(authority);
	return responseFor(definition, tab, sameBrowserDashboardDefinition(definition, stoppedIntent));
}
/** Explicit Stop follows all admitted opens and resumes before closing the owned target. */
async function stopBrowserDashboard(request, authority = {}) {
	return await serializeDashboardOperation(request, "stop", authority, stopMaterializedDashboard);
}
async function stopMaterializedDashboard(definition, authority) {
	await assertDefinitionCurrent(definition, authority);
	const tabs = await tabsForDefinition(definition, authority);
	assertAuthority(authority);
	for (const tab of tabs) {
		if (!definitionOwnsTab(definition, tab)) continue;
		const stopping = tab.dashboard?.state === "stopped" ? void 0 : await changeTabState(tab, "stopping", authority);
		assertAuthority(authority);
		if (!stopping && tab.dashboard?.state !== "stopped") throw new Error("Dashboard target changed while stopping; retry Stop");
		if (stopping) {
			emitDashboardChanged(definition, authority);
			await closeStoppingTab(stopping, definition, authority);
			assertAuthority(authority);
			if ((await readBrowserDashboardTabs(stopping.storageKey, authority)).some((current) => current.dashboard?.state === "stopping")) throw new Error("Dashboard is paused, but its browser tab could not close yet; cleanup will retry");
		}
	}
	await assertDefinitionCurrent(definition, authority);
	const current = (await tabsForDefinition(definition, authority)).find((tab) => definitionOwnsTab(definition, tab) && tab.dashboard?.state !== "released");
	assertAuthority(authority);
	if (!current) {
		await persistBrowserDashboardStopIntent(definition, authority);
		assertAuthority(authority);
		emitDashboardChanged(definition, authority);
	}
	return responseFor(definition, current, !current);
}
/** Existing cleanup cycle reconciles dashboard removal, replacement, and explicit stop. */
async function reconcileBrowserDashboards(params = {}) {
	const runtime = getOptionalBrowserStateRuntime();
	if (!runtime?.gateway) return 0;
	const isCurrent = () => isBrowserStateRuntimeCurrent(runtime, params.isCurrent);
	const authority = {
		runtime,
		assertCurrent: () => {
			if (!isBrowserStateRuntimeCurrent(runtime)) throw new Error("Browser dashboard cleanup is no longer current");
		}
	};
	let closed = 0;
	if (!isCurrent()) return closed;
	const tabs = await readCurrentBrowserState(runtime, () => readBrowserDashboardTabs(void 0, { runtime }), params.isCurrent);
	if (!tabs || !isCurrent()) return closed;
	for (const tab of tabs) {
		if (!tab.dashboard || params.sessionKeys && !params.sessionKeys.includes(tab.dashboard.sessionKey)) continue;
		try {
			const definition = await readBrowserDashboardDefinition({ ...tab.dashboard });
			if (!isCurrent()) return closed;
			if (!definitionOwnsTab(definition, tab) || tab.dashboard.state === "released") closed += (await releaseTab(tab, authority, params)).closed;
			else if (definition && tab.dashboard.state === "stopping") closed += await closeStoppingTab(tab, definition, authority, params);
			else if (definition && tab.dashboard.state === "stopped" && (await tabsForDefinition(definition, authority)).some((candidate) => candidate.dashboard?.state === "active" && definitionOwnsTab(definition, candidate))) await releaseTab(tab, authority, params);
		} catch (error) {
			if (!isCurrent()) return closed;
			params.onWarn?.(`Could not reconcile Browser dashboard ${tab.dashboard.name}: ${String(error)}`);
		}
	}
	if (!isCurrent()) return closed;
	const intents = await readCurrentBrowserState(runtime, () => readBrowserDashboardStopIntents({ runtime }), params.isCurrent);
	if (!intents || !isCurrent()) return closed;
	for (const intent of intents) {
		if (params.sessionKeys && !params.sessionKeys.includes(intent.sessionKey)) continue;
		try {
			const definition = await readBrowserDashboardDefinition(intent);
			if (!isCurrent()) return closed;
			if (!sameBrowserDashboardDefinition(intent, definition) || definition && (await tabsForDefinition(definition, authority)).some((tab) => tab.dashboard?.state === "active" && definitionOwnsTab(definition, tab))) {
				if (params.prepareCurrent && !await params.prepareCurrent() || !isCurrent()) return closed;
				await deleteBrowserDashboardStopIntent(intent, {
					...authority,
					sessionEntryCurrent: params.sessionEntryCurrent,
					assertCurrent: () => {
						authority.assertCurrent?.();
						if (!isCurrent()) throw new Error("Browser dashboard cleanup caller changed");
					}
				});
			}
		} catch (error) {
			if (!isCurrent()) return closed;
			params.onWarn?.(`Could not reconcile Browser dashboard ${intent.name}: ${String(error)}`);
		}
	}
	return closed;
}
//#endregion
export { assertBrowserDashboardTargetCurrent, inspectBrowserDashboard, reconcileBrowserDashboards, requestBrowserDashboard, stopBrowserDashboard };
