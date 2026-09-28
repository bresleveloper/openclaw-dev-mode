import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
//#region src/infra/agent-event-execution-context.ts
function getAgentEventExecutionContext() {
	return resolveGlobalSingleton(Symbol.for("openclaw.agentEvents.executionContext"), () => new AsyncLocalStorage());
}
/** Registration owns routing updates; cancellation may clear live authority before callbacks settle. */
function recordAgentEventRouting(runId, context, predecessor) {
	const scope = getAgentEventExecutionContext().getStore();
	if (!scope || scope.lifecycleGeneration !== context.lifecycleGeneration) return;
	const routing = {
		agentId: context.agentId,
		sessionKey: context.sessionKey,
		sessionId: context.sessionId,
		completionSource: context.completionSource,
		isControlUiVisible: context.isControlUiVisible,
		projectSessionLifecycle: context.projectSessionLifecycle,
		projectSessionMessages: context.projectSessionMessages,
		mainSessionRestartRecovery: context.mainSessionRestartRecovery,
		lifecycleStartedAt: context.lifecycleStartedAt,
		lifecycleGeneration: context.lifecycleGeneration,
		isHeartbeat: context.isHeartbeat,
		verboseLevel: context.verboseLevel,
		registeredAt: context.registeredAt
	};
	const routingByRun = scope.routingByRun ??= /* @__PURE__ */ new Map();
	const record = routingByRun.get(runId);
	const previousOwner = record?.owner.deref();
	if (record && (previousOwner === context || predecessor !== void 0 && previousOwner === predecessor && record.routing.lifecycleGeneration !== context.lifecycleGeneration)) {
		if (previousOwner !== context) record.owner = new WeakRef(context);
		record.routing = routing;
	} else routingByRun.set(runId, {
		owner: new WeakRef(context),
		routing
	});
}
//#endregion
//#region src/infra/agent-run-approval-leases.ts
/** Owns subordinate claims and signal listeners; the registry validates their admitted parent. */
var AgentRunApprovalLeases = class {
	constructor(onClose) {
		this.onClose = onClose;
		this.leases = /* @__PURE__ */ new Map();
	}
	claim(parent, inputSignals) {
		const signals = Object.freeze([...new Set(inputSignals)]);
		for (const signal of signals) signal.throwIfAborted();
		for (const lease of this.leases.values()) if (lease.parent === parent && lease.signals.length === signals.length && signals.every((signal) => lease.signals.includes(signal))) return lease.authority;
		const authority = Object.freeze({
			...parent,
			claimId: randomUUID()
		});
		const close = (reason = "approval-scope-closed") => {
			if (!this.leases.delete(authority.claimId)) return;
			for (const signal of signals) signal.removeEventListener("abort", onAbort);
			this.onClose(authority, reason);
		};
		const onAbort = () => close();
		this.leases.set(authority.claimId, {
			authority,
			parent,
			signals,
			close
		});
		for (const signal of signals) signal.addEventListener("abort", onAbort, { once: true });
		return authority;
	}
	isActive(parent, claimId) {
		const lease = this.leases.get(claimId);
		return lease?.parent === parent && lease.signals.every((signal) => !signal.aborted);
	}
	release(claimId) {
		const lease = this.leases.get(claimId);
		lease?.close();
		return lease !== void 0;
	}
	close(parent) {
		for (const lease of this.leases.values()) if (!parent || lease.parent === parent) lease.close("run-aborted");
	}
};
//#endregion
//#region src/infra/agent-run-projection.ts
function projectedRunIdentity(agentId, value) {
	return `${normalizeAgentId(agentId)}\0${value}`;
}
/** Activity selected by a session key must belong to the agent encoded in that key. */
function* iterateProjectedAgentRunSessionKeys(index) {
	for (const identity of index.sessionKeys.keys()) {
		const key = identity.slice(identity.indexOf("\0") + 1);
		const agentId = parseAgentSessionKey(key)?.agentId;
		if (agentId && identity === projectedRunIdentity(agentId, key)) yield key;
	}
}
function areAgentRunModelsEqual(left, right) {
	return left?.provider === right?.provider && left?.model === right?.model;
}
/** Canonicalizes every run-context field consumed by the session projection. */
function projectedAgentRunInputKey(context) {
	const agentId = context.agentId ?? parseAgentSessionKey(context.sessionKey)?.agentId;
	return JSON.stringify([
		context.lifecycleGeneration ?? null,
		agentId ? normalizeAgentId(agentId) : null,
		context.sessionId ?? null,
		context.sessionKey ?? null,
		context.projectSessionActive ?? null,
		context.projectSessionLifecycle ?? null,
		context.isControlUiVisible ?? null,
		(context.capacityWaits?.size ?? 0) > 0,
		context.activeModel?.provider ?? null,
		context.activeModel?.model ?? null
	]);
}
function buildAgentRunProjectionIndex(params) {
	const modelsBySessionId = /* @__PURE__ */ new Map();
	const pendingModelSessionIds = /* @__PURE__ */ new Set();
	const sessionKeys = /* @__PURE__ */ new Map();
	const sessionIds = /* @__PURE__ */ new Map();
	const ownerlessSessionKeys = /* @__PURE__ */ new Map();
	const ownerlessSessionIds = /* @__PURE__ */ new Map();
	const add = (index, key, status) => {
		const previous = index.get(key);
		if (previous !== "running" && !(previous === "queued" && status === "capacity-wait")) index.set(key, status);
	};
	for (const context of params.contexts) {
		const queued = (context.capacityWaits?.size ?? 0) > 0;
		const agentId = context.agentId ?? parseAgentSessionKey(context.sessionKey)?.agentId;
		if (context.lifecycleGeneration === params.lifecycleGeneration && agentId && context.sessionId && context.sessionKey && context.projectSessionActive !== false && context.projectSessionLifecycle !== false && context.isControlUiVisible !== false) {
			const key = projectedRunIdentity(agentId, context.sessionId);
			pendingModelSessionIds.add(key);
			if (!queued && (context.activeModel !== void 0 || context.projectSessionActive === true)) {
				const model = context.activeModel ?? null;
				const previous = modelsBySessionId.get(key);
				modelsBySessionId.set(key, previous === void 0 || areAgentRunModelsEqual(previous, model) ? model : null);
			}
		}
		if (context.lifecycleGeneration !== params.lifecycleGeneration || context.projectSessionActive !== true && (!queued || context.projectSessionActive === false || context.projectSessionLifecycle === false)) continue;
		const status = !queued ? "running" : context.projectSessionActive === true ? "queued" : "capacity-wait";
		if (context.sessionKey !== void 0 && agentId) add(sessionKeys, projectedRunIdentity(agentId, context.sessionKey), status);
		else if (context.sessionKey !== void 0) add(ownerlessSessionKeys, context.sessionKey, status);
		if (context.sessionId !== void 0 && agentId) add(sessionIds, projectedRunIdentity(agentId, context.sessionId), status);
		else if (context.sessionId !== void 0) add(ownerlessSessionIds, context.sessionId, status);
	}
	for (const key of pendingModelSessionIds) if (!modelsBySessionId.has(key)) modelsBySessionId.set(key, null);
	return {
		modelsBySessionId,
		sessionKeys,
		sessionIds,
		ownerlessSessionKeys,
		ownerlessSessionIds
	};
}
//#endregion
//#region src/infra/agent-run-registry-state.ts
const AGENT_RUN_REGISTRY_STATE_KEY = Symbol.for("openclaw.agentRunRegistry.state");
function getAgentRunRegistryState() {
	return resolveGlobalSingleton(AGENT_RUN_REGISTRY_STATE_KEY, () => ({
		contexts: /* @__PURE__ */ new Map(),
		owners: /* @__PURE__ */ new Map(),
		lifecycleGeneration: randomUUID(),
		version: 0
	}));
}
function bumpAgentRunIndexVersion(context, previous) {
	getAgentRunRegistryState().version += 1;
	for (const target of previous && (previous.sessionKey !== context?.sessionKey || previous.agentId !== context?.agentId) ? [previous, context] : [context]) {
		const { sessionKey, agentId } = target ?? {};
		sessionChanges.emit(sessionKey ? {
			sessionKey,
			agentId,
			scope: "runtime"
		} : {
			all: true,
			scope: "agent-runs"
		});
	}
}
//#endregion
//#region src/infra/agent-run-usage.ts
const usageByRun = /* @__PURE__ */ new Map();
/** Adds one completed model call and emits the new generation-scoped total. */
function recordAgentRunOutputTokens(params) {
	const outputTokens = Math.floor(params.outputTokens);
	if (!Number.isFinite(outputTokens) || outputTokens <= 0) return;
	const usageByGeneration = usageByRun.get(params.runId) ?? /* @__PURE__ */ new Map();
	const usage = { outputTokens: (usageByGeneration.get(params.lifecycleGeneration)?.outputTokens ?? 0) + outputTokens };
	if (!params.emit(usage)) return;
	usageByGeneration.set(params.lifecycleGeneration, usage);
	usageByRun.set(params.runId, usageByGeneration);
	return usage;
}
function clearAgentRunUsage(runId, lifecycleGeneration) {
	if (lifecycleGeneration === void 0) {
		usageByRun.delete(runId);
		return;
	}
	const usageByGeneration = usageByRun.get(runId);
	usageByGeneration?.delete(lifecycleGeneration);
	if (usageByGeneration?.size === 0) usageByRun.delete(runId);
}
function resetAgentRunUsageForTest() {
	usageByRun.clear();
}
//#endregion
//#region src/infra/agent-run-registry.ts
/** Reads the process-local version of the active-run projection inputs. */
function readAgentRunIndexVersion() {
	return getAgentRunRegistryState().version;
}
function getAgentRunLifecycleGeneration() {
	return getAgentRunRegistryState().lifecycleGeneration;
}
function rotateAgentRunRegistryLifecycleGeneration() {
	const state = getAgentRunRegistryState();
	for (const context of state.contexts.values()) {
		const authority = context.delegatedAuthority;
		if (authority) {
			delete context.delegatedAuthority;
			delete context.assertSourceCurrent;
			notifyDelegatedAuthorityClosed(state, authority);
		}
	}
	state.lifecycleGeneration = randomUUID();
	bumpAgentRunIndexVersion();
	return state.lifecycleGeneration;
}
function notifyDelegatedAuthorityClosed(state, authority, approvalReason) {
	if (!approvalReason) state.contexts.get(authority.operationalRunInstance.runId)?.approvalLeases?.close(authority);
	for (const handler of state.delegatedAuthorityClosedHandlers ?? []) try {
		handler(authority, approvalReason);
	} catch {}
}
/** Observe exact delegated-authority closure without displacing other lifecycle owners. */
function registerAgentRunDelegatedAuthorityClosedHandler(handler) {
	const handlers = getAgentRunRegistryState().delegatedAuthorityClosedHandlers ??= /* @__PURE__ */ new Set();
	return registerListener(handlers, handler);
}
/** Connects registry cleanup to the event sequencer without reversing ownership. */
function registerAgentRunSequenceResetHandler(handler) {
	getAgentRunRegistryState().sequenceResetHandler = handler;
}
function storeRunContext(runId, context, predecessor) {
	context.capacityWaits = void 0;
	context.registeredAt ??= Date.now();
	getAgentRunRegistryState().contexts.set(runId, context);
	recordAgentEventRouting(runId, context, predecessor);
}
/** Registers or merges per-run context used by later agent event emissions. */
function registerAgentRunContext(runId, context, claimId) {
	if (!runId) return;
	const state = getAgentRunRegistryState();
	const lifecycleGeneration = context.lifecycleGeneration ?? state.lifecycleGeneration;
	const owners = state.owners.get(runId);
	if (owners?.lifecycleGeneration === lifecycleGeneration && owners.exclusiveClaimId && (owners.exclusiveClaimId !== claimId || owners.clearRequested)) return;
	const existing = state.contexts.get(runId);
	if (!existing) {
		storeRunContext(runId, {
			...context,
			lifecycleGeneration
		});
		bumpAgentRunIndexVersion(context);
		return;
	}
	if (context.lifecycleGeneration && existing.lifecycleGeneration && context.lifecycleGeneration !== existing.lifecycleGeneration) return;
	const runIndexInputBefore = projectedAgentRunInputKey(existing);
	const previous = {
		sessionKey: existing.sessionKey,
		agentId: existing.agentId
	};
	if (context.sessionKey && existing.sessionKey !== context.sessionKey) existing.sessionKey = context.sessionKey;
	if (context.sessionId && existing.sessionId !== context.sessionId) existing.sessionId = context.sessionId;
	if (context.agentId && existing.agentId !== context.agentId) existing.agentId = context.agentId;
	if (context.verboseLevel && existing.verboseLevel !== context.verboseLevel) existing.verboseLevel = context.verboseLevel;
	existing.completionSource ??= context.completionSource;
	if (context.isControlUiVisible !== void 0) existing.isControlUiVisible = context.isControlUiVisible;
	if (context.projectSessionActive !== void 0 && existing.projectSessionActive !== context.projectSessionActive) existing.projectSessionActive = context.projectSessionActive;
	if (context.projectSessionLifecycle !== void 0) existing.projectSessionLifecycle = context.projectSessionLifecycle;
	if (context.projectSessionMessages !== void 0) existing.projectSessionMessages = context.projectSessionMessages;
	if (context.mainSessionRestartRecovery === true) existing.mainSessionRestartRecovery = true;
	if (context.cronRunsByJobId !== void 0) {
		existing.cronRunsByJobId ??= /* @__PURE__ */ new Map();
		for (const [jobId, cronRun] of context.cronRunsByJobId) existing.cronRunsByJobId.set(jobId, cronRun);
	}
	if (context.isHeartbeat !== void 0 && existing.isHeartbeat !== context.isHeartbeat) existing.isHeartbeat = context.isHeartbeat;
	if (context.registeredAt !== void 0) existing.registeredAt = context.registeredAt;
	if (context.lastActiveAt !== void 0) existing.lastActiveAt = context.lastActiveAt;
	recordAgentEventRouting(runId, existing);
	if (runIndexInputBefore !== projectedAgentRunInputKey(existing)) bumpAgentRunIndexVersion(existing, previous);
}
/** Claims a run id for a newly admitted execution, replacing stale ownership. */
function claimAgentRunContext(runId, context, options = {}) {
	if (!runId) return;
	const state = getAgentRunRegistryState();
	const lifecycleGeneration = context.lifecycleGeneration ?? state.lifecycleGeneration;
	const existing = state.contexts.get(runId);
	const existingOwners = state.owners.get(runId);
	const currentOwners = existingOwners?.lifecycleGeneration === lifecycleGeneration ? existingOwners : void 0;
	const adoptsExistingUnowned = options.exclusive === true && options.adoptExistingUnowned === true && existing?.lifecycleGeneration === lifecycleGeneration && currentOwners === void 0;
	if (currentOwners?.exclusiveClaimId || options.exclusive && (existing?.lifecycleGeneration === lifecycleGeneration && !adoptsExistingUnowned || currentOwners !== void 0)) return;
	let claimId;
	if (options.trackOwner) {
		claimId = randomUUID();
		if (currentOwners) {
			currentOwners.claimIds.add(claimId);
			if (options.protectFromSweep) currentOwners.sweepProtectedClaimIds.add(claimId);
			if (options.ownsContext) currentOwners.preserveAfterRelease = false;
			if (options.onClearRequested) {
				currentOwners.clearListeners ??= /* @__PURE__ */ new Map();
				currentOwners.clearListeners.set(claimId, options.onClearRequested);
			}
		} else state.owners.set(runId, {
			lifecycleGeneration,
			claimIds: /* @__PURE__ */ new Set([claimId]),
			sweepProtectedClaimIds: new Set(options.protectFromSweep ? [claimId] : []),
			preserveAfterRelease: options.ownsContext !== true && existing?.lifecycleGeneration === lifecycleGeneration,
			clearRequested: false,
			...options.exclusive ? { exclusiveClaimId: claimId } : {},
			...options.onClearRequested ? { clearListeners: /* @__PURE__ */ new Map([[claimId, options.onClearRequested]]) } : {}
		});
	} else if (existingOwners?.lifecycleGeneration !== lifecycleGeneration) state.owners.delete(runId);
	if (existing?.lifecycleGeneration === lifecycleGeneration) {
		const versionBeforeRegister = readAgentRunIndexVersion();
		registerAgentRunContext(runId, {
			...context,
			lifecycleGeneration
		}, claimId);
		if (readAgentRunIndexVersion() === versionBeforeRegister) bumpAgentRunIndexVersion(existing);
		return claimId;
	}
	storeRunContext(runId, {
		...context,
		lifecycleGeneration
	}, existing);
	state.sequenceResetHandler?.(runId);
	clearAgentRunUsage(runId);
	bumpAgentRunIndexVersion(context, existing);
	return claimId;
}
/** Returns the currently registered context for a run, if it has not been cleared or swept. */
function getAgentRunContext(runId) {
	return getAgentRunRegistryState().contexts.get(runId);
}
/** Holds an existing run context only while its current execution awaits lane admission. */
function retainQueuedAgentRunContext(runId, lifecycleGeneration) {
	const state = getAgentRunRegistryState();
	const context = state.contexts.get(runId);
	if (!context || context.lifecycleGeneration !== lifecycleGeneration || state.lifecycleGeneration !== lifecycleGeneration) return;
	const wasLive = hasLiveAgentRunContext(runId);
	const leases = state.queuedRunContextLeases ??= /* @__PURE__ */ new WeakMap();
	leases.set(context, (leases.get(context) ?? 0) + 1);
	if (!wasLive) bumpAgentRunIndexVersion(context);
	let released = false;
	return (outcome) => {
		if (released) return;
		released = true;
		const remaining = (leases.get(context) ?? 0) - 1;
		if (remaining > 0) leases.set(context, remaining);
		else leases.delete(context);
		if (state.contexts.get(runId) === context && context.lifecycleGeneration === lifecycleGeneration && state.lifecycleGeneration === lifecycleGeneration) {
			if (outcome === "admitted") context.lastActiveAt = Date.now();
			if (!hasLiveAgentRunContext(runId)) bumpAgentRunIndexVersion(context);
		}
	};
}
function getAgentRunContextOwnership(runId) {
	return getAgentRunRegistryState().owners.get(runId);
}
/** Records the latest next-check proposal on the matching paced cron run. */
function recordCronNextCheckProposal(runId, jobId, delayMs) {
	const cronRun = getAgentRunContext(runId)?.cronRunsByJobId?.get(jobId);
	if (!cronRun) throw new Error("cron next_check is only available to the currently running job");
	if (!cronRun.pacingEnabled) throw new Error("cron next_check requires pacing on the current job");
	cronRun.nextCheckMs = delayMs;
}
/** Consumes one successful cron run's proposal so it cannot affect a later run. */
function consumeCronNextCheckProposal(runId, jobId) {
	const context = getAgentRunContext(runId);
	const cronRuns = context?.cronRunsByJobId;
	const cronRun = cronRuns?.get(jobId);
	if (!cronRun) return;
	cronRuns?.delete(jobId);
	if (cronRuns?.size === 0 && context) delete context.cronRunsByJobId;
	return cronRun.nextCheckMs;
}
function getAgentRunContextOwnerStatus(runId, claimId, lifecycleGeneration) {
	const state = getAgentRunRegistryState();
	const owners = state.owners.get(runId);
	if (lifecycleGeneration !== state.lifecycleGeneration || owners?.lifecycleGeneration !== lifecycleGeneration || !owners.claimIds.has(claimId)) return;
	return owners.clearRequested ? "clear-requested" : "active";
}
/** Claims approval authority for the exact admitted operational execution. */
function claimAgentRunDelegatedAuthority(operationalRunInstance, assertSourceCurrent) {
	const instanceId = operationalRunInstance.instanceId.trim();
	const runId = operationalRunInstance.runId.trim();
	if (!instanceId || !runId) throw new Error("agent run delegated authority requires an operational run instance");
	const state = getAgentRunRegistryState();
	const currentInstance = operationalRunInstance.instanceId === instanceId && operationalRunInstance.runId === runId ? operationalRunInstance : Object.freeze({
		instanceId,
		runId
	});
	const bound = state.contexts.get(runId);
	if (bound?.delegatedAuthority?.operationalRunInstance.instanceId === instanceId && bound.assertSourceCurrent !== assertSourceCurrent) throw new Error("agent run source authority is already bound");
	assertSourceCurrent?.();
	const lifecycleGeneration = state.lifecycleGeneration;
	const active = getActiveAgentRunDelegatedAuthority(currentInstance);
	if (active) return active;
	const existing = state.contexts.get(runId)?.delegatedAuthority;
	if (existing) releaseAgentRunContext(runId, existing.claimId);
	const claimId = claimAgentRunContext(runId, {
		lifecycleGeneration,
		lastActiveAt: Date.now()
	}, {
		trackOwner: true,
		protectFromSweep: true,
		onClearRequested: (requestedClaimId) => {
			releaseAgentRunContext(runId, requestedClaimId);
		}
	});
	if (!claimId) throw new Error("agent run delegated authority could not claim the operational execution");
	const authority = Object.freeze({
		operationalRunInstance: currentInstance,
		lifecycleGeneration,
		claimId
	});
	const context = state.contexts.get(runId);
	if (!context || context.lifecycleGeneration !== lifecycleGeneration) {
		releaseAgentRunContext(runId, claimId);
		throw new Error("agent run delegated authority lost its lifecycle during admission");
	}
	context.delegatedAuthority = authority;
	context.assertSourceCurrent = assertSourceCurrent;
	return authority;
}
/** Returns authority only while the exact lifecycle owner still holds its claim. */
function getActiveAgentRunDelegatedAuthority(operationalRunInstance) {
	const context = getAgentRunRegistryState().contexts.get(operationalRunInstance.runId);
	const authority = context?.delegatedAuthority;
	if (!context || !authority || authority.operationalRunInstance.instanceId !== operationalRunInstance.instanceId || authority.operationalRunInstance.runId !== operationalRunInstance.runId || getAgentRunContextOwnerStatus(operationalRunInstance.runId, authority.claimId, authority.lifecycleGeneration) === void 0) return;
	try {
		context.assertSourceCurrent?.();
		return getAgentRunContext(operationalRunInstance.runId) === context && context.delegatedAuthority === authority && getAgentRunContextOwnerStatus(operationalRunInstance.runId, authority.claimId, authority.lifecycleGeneration) !== void 0 ? authority : void 0;
	} catch {
		releaseAgentRunContext(operationalRunInstance.runId, authority.claimId);
		return;
	}
}
function validateAgentRunDelegatedAuthority(authority) {
	const active = getActiveAgentRunDelegatedAuthority(authority.operationalRunInstance);
	if (!active || active.lifecycleGeneration !== authority.lifecycleGeneration) return false;
	const leases = getAgentRunContext(authority.operationalRunInstance.runId)?.approvalLeases;
	return active.claimId === authority.claimId || leases?.isActive(active, authority.claimId) === true;
}
/** Narrows an admitted run to one live tool generation without replacing its outer claim. */
function claimAgentRunApprovalAuthority(parent, inputSignals) {
	const state = getAgentRunRegistryState();
	const context = state.contexts.get(parent.operationalRunInstance.runId);
	if (context?.delegatedAuthority !== parent || !validateAgentRunDelegatedAuthority(parent)) throw new Error("agent run approval authority is no longer active");
	return (context.approvalLeases ??= new AgentRunApprovalLeases((authority, reason) => notifyDelegatedAuthorityClosed(state, authority, reason))).claim(parent, inputSignals);
}
/** Compare-releases only the exact authority owned by one admitted execution. */
function releaseAgentRunDelegatedAuthority(authority) {
	const { runId, instanceId } = authority.operationalRunInstance;
	const context = getAgentRunContext(runId);
	const active = context?.delegatedAuthority;
	if (!context || !active || active.operationalRunInstance.instanceId !== instanceId || active.lifecycleGeneration !== authority.lifecycleGeneration || getAgentRunContextOwnerStatus(runId, active.claimId, active.lifecycleGeneration) === void 0) return false;
	if (active.claimId !== authority.claimId) return context.approvalLeases?.release(authority.claimId) === true;
	releaseAgentRunContext(runId, authority.claimId);
	return true;
}
/** Exact execution claims and scheduler queue leases, excluding UI projection metadata. */
function hasAgentRunContextExecutionOwner(runId) {
	const state = getAgentRunRegistryState();
	const context = state.contexts.get(runId);
	if (!context || context.lifecycleGeneration !== state.lifecycleGeneration) return false;
	const owners = state.owners.get(runId);
	return owners?.lifecycleGeneration === state.lifecycleGeneration && owners.claimIds.size > 0 || (state.queuedRunContextLeases?.get(context) ?? 0) > 0;
}
/** Live display projection also includes a producer's active-session marker. */
function hasLiveAgentRunContext(runId) {
	const state = getAgentRunRegistryState();
	const context = state.contexts.get(runId);
	return context?.lifecycleGeneration === state.lifecycleGeneration && (hasAgentRunContextExecutionOwner(runId) || context.projectSessionActive === true);
}
/** Lists registered runs bound to one current session identity. */
function listAgentRunsForSession(params) {
	const state = getAgentRunRegistryState();
	const runs = [];
	for (const [runId, context] of state.contexts) if (context.sessionKey === params.sessionKey && (!context.sessionId || context.sessionId === params.sessionId) && context.lifecycleGeneration === state.lifecycleGeneration) runs.push({
		runId,
		lifecycleGeneration: context.lifecycleGeneration
	});
	return runs.toSorted((a, b) => a.runId.localeCompare(b.runId));
}
function recordAgentRunModel(runId, model) {
	const context = getAgentRunContext(runId);
	if (!context || context.lifecycleGeneration !== getAgentRunLifecycleGeneration()) return;
	if (areAgentRunModelsEqual(context.activeModel, model)) return;
	if (model) context.activeModel = model;
	else delete context.activeModel;
	bumpAgentRunIndexVersion(context);
}
function resolveProjectedAgentRunModel(params) {
	return params.sessionId === void 0 ? void 0 : (params.index ?? buildProjectedAgentRunIndex()).modelsBySessionId.get(projectedRunIdentity(params.agentId, params.sessionId));
}
function buildProjectedAgentRunIndex() {
	const { contexts, lifecycleGeneration } = getAgentRunRegistryState();
	return buildAgentRunProjectionIndex({
		contexts: contexts.values(),
		lifecycleGeneration
	});
}
function resolveProjectedAgentRunProgressState(params) {
	const index = params.index ?? buildProjectedAgentRunIndex();
	const agentId = params.agentId ?? params.sessionKeys.flatMap((key) => parseAgentSessionKey(key)?.agentId ?? [])[0] ?? params.defaultAgentId;
	if (!agentId) return;
	const mayAdoptOwnerless = params.defaultAgentId !== void 0 && normalizeAgentId(agentId) === normalizeAgentId(params.defaultAgentId);
	const statuses = params.sessionKeys.flatMap((sessionKey) => [index.sessionKeys.get(projectedRunIdentity(agentId, sessionKey)), ...mayAdoptOwnerless ? [index.ownerlessSessionKeys.get(sessionKey)] : []]);
	if (params.sessionId !== void 0) {
		statuses.push(index.sessionIds.get(projectedRunIdentity(agentId, params.sessionId)));
		if (mayAdoptOwnerless) statuses.push(index.ownerlessSessionIds.get(params.sessionId));
	}
	return statuses.includes("running") ? "running" : statuses.includes("queued") ? "queued" : statuses.includes("capacity-wait") ? "capacity-wait" : void 0;
}
/** Clears context state for a run that has ended or been discarded. */
function clearAgentRunContext(runId, lifecycleGeneration, claimId) {
	const state = getAgentRunRegistryState();
	const existing = state.contexts.get(runId);
	if (lifecycleGeneration && existing && existing.lifecycleGeneration !== lifecycleGeneration) return;
	const owners = state.owners.get(runId);
	if (claimId && (!owners || lifecycleGeneration && owners.lifecycleGeneration !== lifecycleGeneration || !owners.claimIds.has(claimId))) return;
	if (owners?.exclusiveClaimId && owners.exclusiveClaimId !== claimId) return;
	if (owners?.claimIds.size) {
		if (!lifecycleGeneration || owners.lifecycleGeneration === lifecycleGeneration) {
			const wasClearRequested = owners.clearRequested;
			owners.clearRequested = true;
			for (const [ownerClaimId, listener] of owners.clearListeners ?? []) {
				if (ownerClaimId === existing?.delegatedAuthority?.claimId) continue;
				listener(ownerClaimId);
			}
			if (!wasClearRequested) bumpAgentRunIndexVersion(existing);
		}
		return;
	}
	const removed = state.contexts.delete(runId);
	state.sequenceResetHandler?.(runId);
	clearAgentRunUsage(runId, lifecycleGeneration ?? existing?.lifecycleGeneration);
	if (removed) bumpAgentRunIndexVersion(existing);
}
/** Releases one tracked owner and clears its context after the final owner exits. */
function releaseAgentRunContext(runId, claimId) {
	if (!runId || !claimId) return;
	const state = getAgentRunRegistryState();
	const owners = state.owners.get(runId);
	if (!owners?.claimIds.delete(claimId)) return;
	const context = state.contexts.get(runId);
	const authority = context?.delegatedAuthority;
	if (context && authority?.claimId === claimId) {
		delete context.delegatedAuthority;
		delete context.assertSourceCurrent;
		notifyDelegatedAuthorityClosed(state, authority);
	}
	owners.sweepProtectedClaimIds.delete(claimId);
	const versionBeforeRelease = readAgentRunIndexVersion();
	owners.clearListeners?.delete(claimId);
	if (owners.exclusiveClaimId === claimId) owners.exclusiveClaimId = void 0;
	if (owners.claimIds.size > 0) {
		bumpAgentRunIndexVersion(context);
		return;
	}
	state.owners.delete(runId);
	if (owners.clearRequested || !owners.preserveAfterRelease) clearAgentRunContext(runId, owners.lifecycleGeneration);
	if (readAgentRunIndexVersion() === versionBeforeRelease) bumpAgentRunIndexVersion(context);
}
/** Sweeps orphaned run contexts that exceeded the given TTL. */
function sweepStaleRunContexts(maxAgeMs = 18e5) {
	const state = getAgentRunRegistryState();
	const now = Date.now();
	let swept = 0;
	for (const [runId, context] of state.contexts) {
		if (context.lifecycleGeneration === state.lifecycleGeneration && (state.queuedRunContextLeases?.get(context) ?? 0) > 0) continue;
		const owners = state.owners.get(runId);
		if (owners?.lifecycleGeneration === state.lifecycleGeneration && owners.sweepProtectedClaimIds.size > 0) continue;
		const lastSeen = context.lastActiveAt ?? context.registeredAt;
		if ((lastSeen ? now - lastSeen : Infinity) > maxAgeMs) {
			state.contexts.delete(runId);
			state.sequenceResetHandler?.(runId);
			clearAgentRunUsage(runId, context.lifecycleGeneration);
			state.owners.delete(runId);
			swept += 1;
		}
	}
	if (swept > 0) bumpAgentRunIndexVersion();
	return swept;
}
function resetAgentRunRegistryForTest() {
	const state = getAgentRunRegistryState();
	const hadRunContexts = state.contexts.size > 0;
	for (const context of state.contexts.values()) context.approvalLeases?.close();
	resetAgentRunUsageForTest();
	state.contexts.clear();
	state.owners.clear();
	state.queuedRunContextLeases = void 0;
	if (hadRunContexts) bumpAgentRunIndexVersion();
}
//#endregion
export { bumpAgentRunIndexVersion as A, resolveProjectedAgentRunModel as C, sweepStaleRunContexts as D, rotateAgentRunRegistryLifecycleGeneration as E, getAgentEventExecutionContext as M, recordAgentEventRouting as N, validateAgentRunDelegatedAuthority as O, resetAgentRunRegistryForTest as S, retainQueuedAgentRunContext as T, registerAgentRunContext as _, clearAgentRunContext as a, releaseAgentRunContext as b, getAgentRunContext as c, getAgentRunLifecycleGeneration as d, hasAgentRunContextExecutionOwner as f, recordCronNextCheckProposal as g, recordAgentRunModel as h, claimAgentRunDelegatedAuthority as i, iterateProjectedAgentRunSessionKeys as j, recordAgentRunOutputTokens as k, getAgentRunContextOwnerStatus as l, listAgentRunsForSession as m, claimAgentRunApprovalAuthority as n, consumeCronNextCheckProposal as o, hasLiveAgentRunContext as p, claimAgentRunContext as r, getActiveAgentRunDelegatedAuthority as s, buildProjectedAgentRunIndex as t, getAgentRunContextOwnership as u, registerAgentRunDelegatedAuthorityClosedHandler as v, resolveProjectedAgentRunProgressState as w, releaseAgentRunDelegatedAuthority as x, registerAgentRunSequenceResetHandler as y };
