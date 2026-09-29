import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, qn as strictObject, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./routing-JKvWkBDR.mjs";
import { J as getOptionalBrowserStateRuntime, _ as readBrowserDashboardTabs, a as deleteBrowserDashboardStopIntent, b as withoutBrowserSessionTabCleanup, f as parseBrowserSessionTabRecord, g as readBrowserDashboardStopIntents, h as readBrowserDashboardStopIntent, o as deleteBrowserSessionTabIf, p as persistBrowserDashboardStopIntent, q as getBrowserStateRuntime, v as sameBrowserSessionTabRecord, y as updateBrowserSessionTab } from "./session-tab-store-CyxH9Sdj.mjs";
import { i as resolveBrowserConfig, r as isLocalManagedProfile, s as resolveProfile } from "./config-fMVye_Fl.mjs";
import { f as resolveCdpTabOwnership, r as closeTrackedCdpTarget } from "./cdp.helpers-C-PCz6N7.mjs";
import "./config-Dk-reqA4.mjs";
import { a as trackSessionBrowserTab, t as closeBrowserDashboardTabs } from "./session-tab-registry-Bl0lE-XG.mjs";
import { n as resolveCdpControlPolicy } from "./cdp-reachability-policy-BY3s_i-8.mjs";
import { C as withBrowserRequestScope, _ as browserTabs, c as browserOpenTab } from "./client-BBxUwgMu.mjs";
//#region extensions/browser/src/browser-dashboard-definition.ts
const BROWSER_DASHBOARD_WIDGET_KIND = "browser:dashboard";
const dashboardUrl = string().min(1).max(4096).transform((value, ctx) => {
	const url = URL.parse(value);
	if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password || url.href.length > 4096) {
		ctx.addIssue({
			code: "custom",
			message: "Browser dashboard URL must be HTTP(S), without embedded credentials, and at most 4096 characters"
		});
		return NEVER;
	}
	return url.href;
});
const browserDashboardPropsSchema = strictObject({
	url: dashboardUrl,
	profile: string().trim().min(1).max(128).optional()
});
const boardSnapshotSchema = object({
	sessionKey: string().min(1),
	widgets: array(object({
		name: string(),
		instanceId: string().optional(),
		revision: number().int().positive(),
		contentKind: string(),
		pluginKind: string().optional(),
		props: unknown().optional(),
		title: string().optional()
	}))
});
/** Resolve the current board instance; a saved browser target is never authority. */
async function readBrowserDashboardDefinition(request) {
	const runtime = getBrowserStateRuntime();
	if (!runtime.gateway) throw new Error("Browser dashboards require an active Gateway");
	const snapshot = boardSnapshotSchema.parse(await runtime.gateway.request("board.get", {
		sessionKey: request.sessionKey,
		...request.agentId ? { agentId: request.agentId } : {}
	}));
	if (getBrowserStateRuntime() !== runtime) throw new Error("Browser dashboard runtime changed");
	const agentId = parseAgentSessionKey(snapshot.sessionKey)?.agentId;
	if (!agentId) throw new Error("Board did not return a canonical agent-scoped session identity");
	const widget = snapshot.widgets.find((entry) => entry.name === request.name);
	if (!widget || widget.contentKind !== "plugin" || widget.pluginKind !== BROWSER_DASHBOARD_WIDGET_KIND || !widget.instanceId || request.instanceId && request.instanceId !== widget.instanceId) return;
	const parsedProps = browserDashboardPropsSchema.safeParse(widget.props);
	if (!parsedProps.success) return;
	const props = parsedProps.data;
	return {
		sessionKey: snapshot.sessionKey,
		agentId,
		name: widget.name,
		instanceId: widget.instanceId,
		revision: widget.revision,
		...widget.title ? { title: widget.title } : {},
		url: props.url,
		profile: props.profile ?? "openclaw"
	};
}
function sameBrowserDashboardDefinition(left, right) {
	return Boolean(right && left.sessionKey === right.sessionKey && left.agentId === right.agentId && left.instanceId === right.instanceId && left.name === right.name && left.url === right.url && left.profile === right.profile);
}
//#endregion
//#region extensions/browser/src/browser-dashboard.ts
const logger = createSubsystemLogger("browser");
function assertAuthority(authority) {
	authority.signal?.throwIfAborted();
	authority.assertCurrent?.();
}
function emitDashboardChanged(definition) {
	try {
		getOptionalBrowserStateRuntime()?.dashboardEvents?.emit("dashboard_changed", {
			sessionKey: definition.sessionKey,
			name: definition.name,
			instanceId: definition.instanceId
		}, { scope: "operator.admin" });
	} catch (error) {
		logger.warn(`Browser dashboard invalidation unavailable: ${String(error)}`);
	}
}
function operationKey(definition) {
	return JSON.stringify([
		definition.sessionKey,
		definition.agentId,
		definition.instanceId
	]);
}
function tabsForDefinition(definition, storageKey) {
	return readBrowserDashboardTabs(storageKey).filter((tab) => tab.dashboard?.sessionKey === definition.sessionKey && tab.dashboard?.instanceId === definition.instanceId && tab.dashboard?.agentId === definition.agentId && tab.dashboard?.name === definition.name).toSorted((left, right) => Number(right.dashboard?.state === "active") - Number(left.dashboard?.state === "active"));
}
function definitionOwnsTab(definition, tab) {
	return Boolean(definition && definition.profile === tab.profile && definition.url === tab.dashboard?.url && definition.instanceId === tab.dashboard?.instanceId && definition.sessionKey === tab.dashboard?.sessionKey);
}
function responseFor(definition, tab) {
	const paused = tab?.dashboard?.state === "stopped" || tab?.dashboard?.state === "stopping" || !tab && sameBrowserDashboardDefinition(definition, readBrowserDashboardStopIntent(definition));
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
	const { getBrowserControlState } = await import("./browser-control-state-DNhn_3YX.mjs");
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
function changeTabState(tab, state) {
	let changed;
	updateBrowserSessionTab(tab.storageKey, (raw) => {
		const current = parseBrowserSessionTabRecord(raw);
		if (!current?.dashboard || !sameBrowserSessionTabRecord(current, tab)) return;
		const record = {
			...withoutBrowserSessionTabCleanup(current),
			dashboard: {
				...current.dashboard,
				state
			}
		};
		changed = {
			...record,
			storageKey: tab.storageKey
		};
		return record;
	});
	return changed;
}
function deleteStoppedTab(tab) {
	return deleteBrowserSessionTabIf(tab.storageKey, (raw) => {
		const current = parseBrowserSessionTabRecord(raw);
		return Boolean(current && sameBrowserSessionTabRecord(current, tab));
	});
}
async function releaseTab(tab, params = {}) {
	if (tab.dashboard?.state === "stopped") return {
		released: deleteStoppedTab(tab),
		closed: 0
	};
	const released = tab.dashboard?.state === "released" ? tab : changeTabState(tab, "released");
	const closed = released ? await closeBrowserDashboardTabs([released], params) : 0;
	return {
		released: !readBrowserDashboardTabs(tab.storageKey).some((current) => current.storageKey === tab.storageKey),
		closed
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
async function closeStoppingTab(tab, definition, params = {}) {
	const closed = await closeBrowserDashboardTabs([tab], params);
	if (readBrowserDashboardTabs(tab.storageKey).some((current) => current.storageKey === tab.storageKey && current.dashboard?.state === "stopped")) emitDashboardChanged(definition);
	return closed;
}
async function materialize(definition, resume, authority) {
	const { profile, resolved, ssrfPolicy } = await resolveManagedProfile(definition);
	assertAuthority(authority);
	const stoppedIntent = readBrowserDashboardStopIntent(definition);
	const superseded = [];
	for (const tab of tabsForDefinition(definition)) {
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
			const current = tabsForDefinition(definition, tab.storageKey).find((candidate) => candidate.storageKey === tab.storageKey);
			if (!current || current.dashboard?.state !== "active") throw new Error("Dashboard tab stopped during this operation");
			return responseFor(definition, current);
		}
		superseded.push({
			tab,
			wasUnreachable: observation === "unreachable"
		});
	}
	await assertDefinitionCurrent(definition, authority);
	if (!resume && stoppedIntent && sameBrowserDashboardDefinition(stoppedIntent, definition)) return responseFor(definition);
	const opened = await browserOpenTab(void 0, definition.url, {
		profile: profile.name,
		signal: authority.signal,
		managedOnly: true
	});
	const ownership = opened.ownership;
	try {
		await assertDefinitionCurrent(definition, authority);
		if (ownership?.status !== "durable" || opened.resolvedProfile !== profile.name) throw new Error("Browser could not verify durable ownership for this dashboard tab");
		if (superseded.some(({ tab, wasUnreachable }) => wasUnreachable && tab.profileFingerprint === ownership.profileFingerprint && tab.browserInstanceFingerprint === ownership.browserInstanceFingerprint)) throw new Error(`Browser dashboard ${definition.name} was temporarily unreachable. Retry; its existing tab has been kept.`);
		for (const candidate of superseded) {
			if (candidate.tab.dashboard?.state === "stopping" && definitionOwnsTab(definition, candidate.tab)) {
				await closeStoppingTab(candidate.tab, definition);
				assertAuthority(authority);
				const stopped = tabsForDefinition(definition, candidate.tab.storageKey).find((tab) => tab.storageKey === candidate.tab.storageKey && tab.dashboard?.state === "stopped");
				if (!stopped) throw new Error("Previous dashboard tab could not stop; retry when its browser is available");
				candidate.tab = stopped;
			}
			if (candidate.tab.dashboard?.state === "stopped") continue;
			if (!(await releaseTab(candidate.tab)).released) throw new Error("Previous dashboard tab could not be released; retry when its browser is available");
			assertAuthority(authority);
		}
		await assertDefinitionCurrent(definition, authority);
		trackSessionBrowserTab({
			sessionKey: definition.sessionKey,
			targetId: ownership.nativeTargetId,
			profile: profile.name,
			ownership,
			dashboard: {
				name: definition.name,
				sessionKey: definition.sessionKey,
				instanceId: definition.instanceId,
				agentId: definition.agentId,
				url: definition.url,
				state: "active"
			}
		});
		const tab = tabsForDefinition(definition).find((candidate) => candidate.nativeTargetId === ownership.nativeTargetId && candidate.profileFingerprint === ownership.profileFingerprint && candidate.browserInstanceFingerprint === ownership.browserInstanceFingerprint);
		if (!tab) throw new Error("Browser dashboard target registration failed");
		for (const { tab: previous } of superseded) if (previous.dashboard?.state === "stopped") deleteStoppedTab(previous);
		if (stoppedIntent) deleteBrowserDashboardStopIntent(stoppedIntent);
		emitDashboardChanged(definition);
		return responseFor(definition, tab);
	} catch (error) {
		if (ownership?.status === "durable") {
			try {
				trackSessionBrowserTab({
					sessionKey: definition.sessionKey,
					targetId: ownership.nativeTargetId,
					profile: profile.name,
					ownership,
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
			const released = tabsForDefinition(definition).find((tab) => tab.nativeTargetId === ownership.nativeTargetId && tab.profileFingerprint === ownership.profileFingerprint && tab.browserInstanceFingerprint === ownership.browserInstanceFingerprint);
			if (!released || !(await releaseTab(released)).released) throw new Error("Dashboard creation failed; its retained cleanup record will retry closing the new tab", { cause: error });
		}
		throw error;
	}
}
/** Re-resolve immediately before a model action crosses into Browser's normal dispatch. */
async function assertBrowserDashboardTargetCurrent(response, agentId, authority = {}, profile) {
	const definition = await requireDefinition({
		...response,
		agentId
	}, authority);
	const target = response.browserTab;
	if (!target) throw new Error("Dashboard has no active browser target");
	const current = tabsForDefinition(definition).find((tab) => definitionOwnsTab(definition, tab) && tab.dashboard?.state === "active" && tab.nativeTargetId === target.targetId && tab.profile === target.profile);
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
		const retained = tabsForDefinition(definition, current.storageKey).find((tab) => tab.storageKey === current.storageKey && tab.dashboard?.state === "active" && definitionOwnsTab(definition, tab));
		assertAuthority(authority);
		if (!retained || ownership.status !== "durable" || ownership.profileFingerprint !== retained.profileFingerprint || ownership.browserInstanceFingerprint !== retained.browserInstanceFingerprint) throw new Error("Dashboard browser instance changed; reopen the dashboard before interacting");
	}
}
async function serializeDashboardOperation(request, kind, authority, execute) {
	const runtime = getBrowserStateRuntime();
	const boundAuthority = {
		...authority,
		assertCurrent: () => {
			assertAuthority(authority);
			if (getBrowserStateRuntime() !== runtime) throw new Error("Browser dashboard runtime changed");
		}
	};
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
async function inspectBrowserDashboard(request, authority = {}) {
	const definition = await requireDefinition(request, authority);
	return responseFor(definition, tabsForDefinition(definition).find((entry) => definitionOwnsTab(definition, entry) && entry.dashboard?.state !== "released"));
}
/** Explicit Stop follows all admitted opens and resumes before closing the owned target. */
async function stopBrowserDashboard(request, authority = {}) {
	return await serializeDashboardOperation(request, "stop", authority, stopMaterializedDashboard);
}
async function stopMaterializedDashboard(definition, authority) {
	await assertDefinitionCurrent(definition, authority);
	for (const tab of tabsForDefinition(definition)) {
		if (!definitionOwnsTab(definition, tab)) continue;
		const stopping = tab.dashboard?.state === "stopped" ? void 0 : changeTabState(tab, "stopping");
		if (!stopping && tab.dashboard?.state !== "stopped") throw new Error("Dashboard target changed while stopping; retry Stop");
		if (stopping) {
			emitDashboardChanged(definition);
			await closeStoppingTab(stopping, definition);
			assertAuthority(authority);
			if (readBrowserDashboardTabs(stopping.storageKey).some((current) => current.storageKey === stopping.storageKey && current.dashboard?.state === "stopping")) throw new Error("Dashboard is paused, but its browser tab could not close yet; cleanup will retry");
		}
	}
	await assertDefinitionCurrent(definition, authority);
	const current = tabsForDefinition(definition).find((tab) => definitionOwnsTab(definition, tab) && tab.dashboard?.state !== "released");
	if (!current) {
		persistBrowserDashboardStopIntent(definition);
		emitDashboardChanged(definition);
	}
	return responseFor(definition, current);
}
/** Existing cleanup cycle reconciles dashboard removal, replacement, and explicit stop. */
async function reconcileBrowserDashboards(params = {}) {
	if (!getOptionalBrowserStateRuntime()?.gateway) return 0;
	let closed = 0;
	for (const tab of readBrowserDashboardTabs()) {
		if (!tab.dashboard || params.sessionKeys && !params.sessionKeys.includes(tab.dashboard.sessionKey)) continue;
		try {
			const definition = await readBrowserDashboardDefinition({ ...tab.dashboard });
			if (params.isCurrent?.() === false) return closed;
			if (!definitionOwnsTab(definition, tab) || tab.dashboard.state === "released") closed += (await releaseTab(tab, params)).closed;
			else if (definition && tab.dashboard.state === "stopping") closed += await closeStoppingTab(tab, definition, params);
			else if (definition && tab.dashboard.state === "stopped" && tabsForDefinition(definition).some((candidate) => candidate.dashboard?.state === "active" && definitionOwnsTab(definition, candidate))) await releaseTab(tab, params);
		} catch (error) {
			params.onWarn?.(`Could not reconcile Browser dashboard ${tab.dashboard.name}: ${String(error)}`);
		}
	}
	for (const intent of readBrowserDashboardStopIntents()) {
		if (params.sessionKeys && !params.sessionKeys.includes(intent.sessionKey)) continue;
		try {
			const definition = await readBrowserDashboardDefinition(intent);
			if (params.isCurrent?.() === false) return closed;
			if (!sameBrowserDashboardDefinition(intent, definition) || definition && tabsForDefinition(definition).some((tab) => tab.dashboard?.state === "active" && definitionOwnsTab(definition, tab))) deleteBrowserDashboardStopIntent(intent);
		} catch (error) {
			params.onWarn?.(`Could not reconcile Browser dashboard ${intent.name}: ${String(error)}`);
		}
	}
	return closed;
}
//#endregion
export { stopBrowserDashboard as a, requestBrowserDashboard as i, inspectBrowserDashboard as n, reconcileBrowserDashboards as r, assertBrowserDashboardTargetCurrent as t };
