import { c as BrowserProfileUnavailableError } from "./errors-CXz-2iKA.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import { t as getLoadedPwAiModule } from "./pw-ai-module-CQKXgko2.mjs";
import { l as stopOpenClawChrome, u as stopOwnedOpenClawChrome } from "./chrome-BHS7REtN.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/browser/src/browser/chrome-mcp.runtime.ts
/** Import the Chrome MCP adapter module on demand. */
async function getChromeMcpModule() {
	return await import("./chrome-mcp-CPgMUWRT.mjs");
}
//#endregion
//#region extensions/browser/src/browser/server-context.lifecycle.ts
/**
* Per-profile Browser lifecycle actor.
*
* Starts and destructive transitions share one settled serial tail. Ordinary
* tab/action work uses generation leases, so it remains concurrent while a
* transition can still abort and drain all previously admitted work.
*/
const profileLeaseStorage = new AsyncLocalStorage();
const profileLifecycles = /* @__PURE__ */ new WeakMap();
const stoppingBrowserRuntimes = /* @__PURE__ */ new WeakSet();
function createProfileLifecycleActor() {
	return {
		generation: 0,
		configRevision: 0,
		controller: new AbortController(),
		tail: Promise.resolve(),
		starts: /* @__PURE__ */ new Map(),
		leases: /* @__PURE__ */ new Set(),
		handles: /* @__PURE__ */ new Set(),
		cleanupChromeMcp: /* @__PURE__ */ new Set(),
		cleanupPlaywright: /* @__PURE__ */ new Map(),
		cleanupRelays: /* @__PURE__ */ new Set(),
		terminal: null,
		transitionReason: null,
		blockedReason: null
	};
}
/** Internal lifecycle state stays outside the public Browser runtime API shape. */
function getProfileLifecycle(runtime) {
	let actor = profileLifecycles.get(runtime);
	if (!actor) {
		actor = createProfileLifecycleActor();
		profileLifecycles.set(runtime, actor);
	}
	return actor;
}
function isBrowserRuntimeRunning(state) {
	return !stoppingBrowserRuntimes.has(state);
}
function markBrowserRuntimeStopping(state) {
	stoppingBrowserRuntimes.add(state);
}
/** Internal control flow: an owned unhealthy process needs a destructive fence. */
var ProfileRestartRequiredError = class extends Error {
	constructor() {
		super("Managed browser restart requires a lifecycle transition.");
		this.name = "ProfileRestartRequiredError";
	}
};
function isProfileRestartRequiredError(err) {
	return err instanceof ProfileRestartRequiredError;
}
function isWithinProfileOperationLease(runtime) {
	return profileLeaseStorage.getStore()?.has(runtime) === true;
}
function lifecycleError(profileName, detail) {
	return new BrowserProfileUnavailableError(`Browser profile "${profileName}" lifecycle changed while work was pending (${detail}).`);
}
function toLifecycleError(value, message) {
	return value instanceof Error ? value : new Error(message, { cause: value });
}
function assertRuntimeAdmission(state) {
	if (!isBrowserRuntimeRunning(state)) throw new BrowserProfileUnavailableError("Browser runtime is stopping.");
}
function assertProfileCurrent(params) {
	assertRuntimeAdmission(params.state);
	const actor = getProfileLifecycle(params.runtime);
	if (actor.terminal) throw lifecycleError(params.runtime.profile.name, actor.terminal);
	if (actor.blockedReason && !params.allowBlocked) throw lifecycleError(params.runtime.profile.name, actor.blockedReason);
	if (actor.configRevision !== params.configRevision) throw lifecycleError(params.runtime.profile.name, "profile config changed");
	if (params.generation != null && actor.generation !== params.generation) throw lifecycleError(params.runtime.profile.name, "operation superseded");
}
/** Allow a lifecycle retry to repair a failed cleanup while fencing stale config. */
function assertProfileLifecycleContext(params) {
	assertProfileCurrent({
		...params,
		allowBlocked: true
	});
}
function combineSignals(lifecycleSignal, callerSignal) {
	if (!callerSignal || callerSignal === lifecycleSignal) return lifecycleSignal;
	return AbortSignal.any([lifecycleSignal, callerSignal]);
}
/** Observe shared lifecycle work without transferring cancellation ownership. */
function waitForProfileOperation(promise, signal) {
	if (!signal) return promise;
	signal.throwIfAborted();
	let onAbort;
	return new Promise((resolve, reject) => {
		onAbort = () => reject(toLifecycleError(signal.reason, "Browser operation aborted."));
		signal.addEventListener("abort", onAbort, { once: true });
		promise.then(resolve, reject);
	}).finally(() => signal.removeEventListener("abort", onAbort));
}
function createLease(actor) {
	let release;
	const settled = new Promise((resolve) => {
		release = resolve;
	});
	actor.leases.add(settled);
	return () => {
		actor.leases.delete(settled);
		release();
	};
}
/** Create the single lifecycle owner for one resolved Browser profile. */
function createProfileRuntimeState(profile) {
	const runtime = {
		profile,
		running: null,
		lastTargetId: null
	};
	profileLifecycles.set(runtime, createProfileLifecycleActor());
	return runtime;
}
/** Return the current runtime object; terminal tombstones stay until exact cleanup removes them. */
function getOrCreateProfileRuntime(state, profile) {
	assertRuntimeAdmission(state);
	const current = state.profiles.get(profile.name);
	if (current) {
		getProfileLifecycle(current);
		return current;
	}
	const created = createProfileRuntimeState(profile);
	state.profiles.set(profile.name, created);
	return created;
}
/** Track an exact managed-process handle before it can be adopted or retired. */
function registerProfileHandle(runtime, running) {
	getProfileLifecycle(runtime).handles.add(running);
	running.proc.on("exit", () => releaseProfileHandle(runtime, running));
	if (running.proc.exitCode != null || running.proc.signalCode != null) {
		releaseProfileHandle(runtime, running);
		return false;
	}
	return true;
}
/** Release only the exact managed-process handle that completed cleanup. */
function releaseProfileHandle(runtime, running) {
	getProfileLifecycle(runtime).handles.delete(running);
	if (runtime.running === running) runtime.running = null;
}
/** True only while a captured start still owns the current profile generation. */
function isProfileGenerationCurrent(params) {
	const actor = getProfileLifecycle(params.runtime);
	return isBrowserRuntimeRunning(params.state) && !actor.terminal && !actor.blockedReason && actor.configRevision === params.configRevision && actor.generation === params.generation;
}
/**
* Run ordinary profile work under a concurrent generation lease.
*
* Passing the current lifecycle signal denotes nested work already covered by
* an outer lease; this avoids self-deadlock while preserving cancellation.
*/
async function withProfileOperationLease(params) {
	params.signal?.throwIfAborted();
	const actor = getProfileLifecycle(params.runtime);
	const inherited = profileLeaseStorage.getStore();
	const parent = params.ownership === "lifecycle" ? void 0 : inherited?.get(params.runtime);
	if (parent) {
		const signal = combineSignals(parent.signal, params.signal);
		signal.throwIfAborted();
		assertProfileCurrent({
			...params,
			generation: parent.generation
		});
		const result = await params.run(signal);
		signal.throwIfAborted();
		assertProfileCurrent({
			...params,
			generation: parent.generation
		});
		await params.commit?.(result);
		return result;
	}
	const requestedGeneration = actor.generation;
	assertProfileCurrent({
		...params,
		generation: requestedGeneration
	});
	for (;;) {
		const ready = actor.tail;
		await waitForProfileOperation(ready, params.signal);
		if (actor.tail === ready) break;
	}
	assertProfileCurrent({
		...params,
		generation: requestedGeneration
	});
	const generation = requestedGeneration;
	const lifecycleSignal = actor.controller.signal;
	const signal = params.ownership === "lifecycle" ? lifecycleSignal : combineSignals(lifecycleSignal, params.signal);
	signal.throwIfAborted();
	const release = createLease(actor);
	try {
		const leases = new Map(inherited);
		leases.set(params.runtime, {
			generation,
			signal
		});
		const result = await profileLeaseStorage.run(leases, async () => await params.run(signal));
		signal.throwIfAborted();
		assertProfileCurrent({
			...params,
			generation
		});
		await params.commit?.(result);
		return result;
	} finally {
		release();
	}
}
/** Queue one lifecycle-owned start, coalescing callers with the same start key. */
function enqueueProfileStart(params) {
	assertProfileCurrent(params);
	params.signal?.throwIfAborted();
	const actor = getProfileLifecycle(params.runtime);
	const existing = actor.starts.get(params.key);
	if (existing) return waitForProfileOperation(existing, params.signal);
	const generation = actor.generation;
	const signal = actor.controller.signal;
	const promise = actor.tail.then(async () => {
		assertProfileCurrent({
			...params,
			generation
		});
		signal.throwIfAborted();
		const owned = new Map(profileLeaseStorage.getStore());
		owned.set(params.runtime, {
			generation,
			signal
		});
		await profileLeaseStorage.run(owned, async () => await params.run(signal, generation));
		assertProfileCurrent({
			...params,
			generation
		});
		signal.throwIfAborted();
	});
	actor.starts.set(params.key, promise);
	const settleStart = () => {
		if (actor.starts.get(params.key) === promise) actor.starts.delete(params.key);
	};
	actor.tail = promise.then(settleStart, settleStart);
	return waitForProfileOperation(promise, params.signal);
}
function capturePlaywrightRetirement(actor, cdpUrl) {
	const retained = actor.cleanupPlaywright.get(cdpUrl);
	if (retained) {
		retained.refresh?.();
		return retained;
	}
	const retirement = getLoadedPwAiModule()?.retirePlaywrightBrowserConnectionExact({ cdpUrl }) ?? null;
	if (retirement?.retired) actor.cleanupPlaywright.set(cdpUrl, retirement);
	return retirement;
}
async function cleanupProfileResources(params) {
	const { runtime } = params;
	let stopped = params.hadPendingWork;
	if (params.eagerMcpClose) stopped = await params.eagerMcpClose || stopped;
	let firstError;
	const actor = getProfileLifecycle(runtime);
	const managedHandles = new Set(actor.handles);
	if (runtime.running) managedHandles.add(runtime.running);
	for (const running of managedHandles) try {
		await stopOpenClawChrome(running);
		releaseProfileHandle(runtime, running);
		stopped = true;
	} catch (err) {
		firstError ??= toLifecycleError(err, "Managed browser cleanup failed.");
	}
	if (actor.cleanupChromeMcp.size > 0) try {
		const { closeChromeMcpSession } = await getChromeMcpModule();
		for (const profileName of actor.cleanupChromeMcp) {
			stopped = await closeChromeMcpSession(profileName) || stopped;
			actor.cleanupChromeMcp.delete(profileName);
		}
	} catch (err) {
		firstError ??= toLifecycleError(err, "Chrome MCP cleanup failed.");
	}
	stopped = actor.cleanupPlaywright.size > 0 || stopped;
	for (const [cdpUrl, retirement] of actor.cleanupPlaywright) try {
		await retirement.close();
		actor.cleanupPlaywright.delete(cdpUrl);
	} catch (err) {
		firstError ??= toLifecycleError(err, "Playwright cleanup failed.");
	}
	for (const relay of actor.cleanupRelays) try {
		await relay.close();
		actor.cleanupRelays.delete(relay);
		if (params.state.extensionRelays?.get(runtime.profile.name) === relay) {
			params.state.extensionRelays.delete(runtime.profile.name);
			const tokens = { ...params.state.resolved.extensionRelayInternalTokens };
			delete tokens[runtime.profile.name];
			params.state.resolved = {
				...params.state.resolved,
				extensionRelayInternalTokens: tokens
			};
		}
	} catch (err) {
		firstError ??= toLifecycleError(err, "Browser relay cleanup failed.");
	}
	if (firstError) throw firstError;
	if (params.managedChrome) {
		const { mode, profile, resolved } = params.managedChrome;
		const result = await stopOwnedOpenClawChrome(resolved, profile);
		if (mode === "release-profile-data" && result.status === "unverified") throw new BrowserProfileUnavailableError(`Cannot release browser profile "${profile.name}" data: ${result.reason}. Close that browser and retry.`);
		stopped = result.status === "stopped" || stopped;
	}
	return { stopped };
}
/**
* Synchronously invalidate the current generation, eagerly begin owned adapter
* teardown, then serialize exact-handle cleanup behind older starts and leases.
*/
function beginProfileTransition(params) {
	const actor = getProfileLifecycle(params.runtime);
	const ownerProfile = params.runtime.profile;
	const managedChrome = params.managedChrome && ownerProfile.driver === "openclaw" && ownerProfile.cdpIsLoopback && !ownerProfile.attachOnly ? {
		mode: params.managedChrome,
		profile: ownerProfile,
		resolved: params.state.resolved
	} : void 0;
	const hadPendingWork = actor.starts.size > 0 || actor.leases.size > 0 || actor.handles.size > 0;
	const reason = lifecycleError(params.runtime.profile.name, params.reason);
	actor.generation += 1;
	params.runtime.externalBrowserMode = void 0;
	if (params.advanceConfigRevision) actor.configRevision += 1;
	actor.controller.abort(reason);
	actor.controller = new AbortController();
	actor.starts.clear();
	if (params.terminal) actor.terminal = params.terminal;
	actor.transitionReason = params.exposeReason ? params.reason : null;
	const closeSharedAdapters = params.closeSharedAdapters !== false;
	const usesChromeMcp = getBrowserProfileCapabilities(ownerProfile).usesChromeMcp;
	if (closeSharedAdapters && usesChromeMcp) actor.cleanupChromeMcp.add(ownerProfile.name);
	const shouldClosePlaywright = closeSharedAdapters && params.captureProfileResources !== false && !usesChromeMcp;
	const eagerPlaywrightRetirement = shouldClosePlaywright ? capturePlaywrightRetirement(actor, ownerProfile.cdpUrl) : null;
	if (params.closeRelay) {
		const relay = params.state.extensionRelays?.get(params.runtime.profile.name);
		if (relay) actor.cleanupRelays.add(relay);
	}
	const eagerMcpClose = closeSharedAdapters && usesChromeMcp ? getChromeMcpModule().then(({ closeChromeMcpSession }) => closeChromeMcpSession(ownerProfile.name)).catch(() => false) : null;
	const transitionGeneration = actor.generation;
	let cleanupCompleted = false;
	const transition = actor.tail.then(async () => {
		await Promise.allSettled(actor.leases);
		if (shouldClosePlaywright && hadPendingWork) capturePlaywrightRetirement(actor, ownerProfile.cdpUrl);
		if (params.closeRelay) {
			const relay = params.state.extensionRelays?.get(params.runtime.profile.name);
			if (relay) actor.cleanupRelays.add(relay);
		}
		const result = await cleanupProfileResources({
			state: params.state,
			runtime: params.runtime,
			eagerMcpClose,
			hadPendingWork: hadPendingWork || Boolean(eagerPlaywrightRetirement?.retired),
			managedChrome
		});
		cleanupCompleted = true;
		await params.afterCleanup?.();
		if (actor.generation === transitionGeneration) actor.blockedReason = null;
		return result;
	}).catch((err) => {
		if (actor.generation === transitionGeneration) {
			if (cleanupCompleted) {
				if (params.rollbackTerminalOnFailure) actor.terminal = null;
				actor.blockedReason = null;
			} else actor.blockedReason = `${params.reason} cleanup failed`;
		}
		throw err;
	});
	const settleTransition = () => {
		if (actor.generation === transitionGeneration) actor.transitionReason = null;
	};
	actor.tail = transition.then(settleTransition, settleTransition);
	return transition;
}
//#endregion
export { getOrCreateProfileRuntime as a, isProfileGenerationCurrent as c, markBrowserRuntimeStopping as d, registerProfileHandle as f, getChromeMcpModule as g, withProfileOperationLease as h, enqueueProfileStart as i, isProfileRestartRequiredError as l, waitForProfileOperation as m, assertProfileLifecycleContext as n, getProfileLifecycle as o, releaseProfileHandle as p, beginProfileTransition as r, isBrowserRuntimeRunning as s, ProfileRestartRequiredError as t, isWithinProfileOperationLease as u };
