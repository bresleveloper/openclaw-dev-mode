import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CHv_0noy.mjs";
import { O as validateAgentRunDelegatedAuthority, s as getActiveAgentRunDelegatedAuthority } from "./agent-run-registry-DO6Dg2r0.mjs";
import { r as extractAssistantTranscriptSourceText } from "./chat-message-content-D14VlZZc.mjs";
//#region src/gateway/worker-environments/placement-turn-claim-events.ts
const turnClaimReleaseWaiters = resolveGlobalMap(Symbol.for("openclaw.turnClaimReleaseWaiters"), (waitersByPath) => {
	const error = /* @__PURE__ */ new Error("Gateway lifecycle ended while waiting for turn claim release");
	for (const bySession of waitersByPath.values()) for (const waiters of bySession.values()) for (const reject of waiters) reject(error);
	waitersByPath.clear();
});
const workerTurnClaimClosedHandlers = resolveGlobalMap(Symbol.for("openclaw.workerTurnClaimClosedHandlers"), (handlersByPath) => {
	handlersByPath.clear();
});
const workerTurnOwners = resolveGlobalMap(Symbol.for("openclaw.workerTurnExecutionIdentities"), (ownersByPath) => {
	for (const owners of ownersByPath.values()) for (const owner of owners.values()) {
		owner.runtime.finishing = void 0;
		owner.runtime?.scope?.release();
	}
	ownersByPath.clear();
});
const WORKER_TURN_EXECUTION_IDENTITY_PATH = Symbol("workerTurnExecutionIdentityPath");
function claimKey(claim) {
	return JSON.stringify([
		claim.claimId,
		claim.runId,
		claim.placementGeneration,
		claim.owner.kind,
		claim.owner.kind === "worker" ? claim.owner.environmentId : null,
		claim.owner.kind === "worker" ? claim.owner.ownerEpoch : null
	]);
}
/** Bind every worker to its live run and original operator source when one exists. */
function bindWorkerTurnOwner(store, claim, token, operationalRunInstance, source, assertRunActive, prepareAssistantTranscriptMessage, operatorAuthority) {
	const scope = captureGatewayRootWorkAdmissionContinuationScope();
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const delegatedAuthority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
	if (!path || !store.validateTurnClaim(claim) || !delegatedAuthority) {
		scope?.release();
		throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	}
	const owners = workerTurnOwners.get(path) ?? /* @__PURE__ */ new Map();
	const assertActive = () => {
		assertRunActive();
		operatorAuthority?.assertCurrent();
		if (owners.get(claim.sessionId) !== owner || workerTurnOwners.get(path) !== owners || !store.validateTurnClaim(claim) || !validateAgentRunDelegatedAuthority(delegatedAuthority)) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	};
	const identity = Object.freeze({
		agentId: source.agentId,
		delegatedAuthority,
		...token ? { executionIdentityToken: token } : {},
		operationalRunInstance,
		...operatorAuthority ? { operatorAuthority } : {},
		receiptAuthority: assertActive,
		sessionKey: source.sessionKey,
		turnClaim: claim
	});
	const capability = Object.freeze({ async run(callback) {
		assertActive();
		const result = await callback(identity);
		assertActive();
		return result;
	} });
	const existing = owners.get(claim.sessionId);
	const currentClaimKey = claimKey(claim);
	if (existing) existing.runtime.finishing = void 0;
	existing?.runtime.scope?.release();
	const owner = {
		capability,
		claim,
		claimKey: currentClaimKey,
		runtime: {
			assertActive,
			delegatedAuthority,
			prepareAssistantTranscriptMessage,
			scope: scope ?? void 0,
			store
		}
	};
	owners.set(claim.sessionId, owner);
	workerTurnOwners.set(path, owners);
	return (credentialHash) => {
		assertActive();
		const finishing = owner.runtime.finishing;
		if (!finishing || !safeEqualSecret(finishing.credentialHash, credentialHash) || !finishing.isAckCurrent?.()) return;
		owner.runtime.finishing = void 0;
		return finishing.outcome;
	};
}
function getWorkerTurnExecutionIdentityCapability(store, claim) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const bound = path ? workerTurnOwners.get(path)?.get(claim.sessionId) : void 0;
	return bound && bound.claimKey === claimKey(claim) && store.validateTurnClaim(claim) ? bound.capability : void 0;
}
function resolveWorkerTurnRuntime(identity) {
	const claim = identity.turnClaim;
	if (!claim || claim.owner.kind !== "worker" || identity.sessionId !== claim.sessionId || identity.runId !== claim.runId || identity.environmentId !== claim.owner.environmentId || identity.ownerEpoch !== claim.owner.ownerEpoch) return;
	const currentClaimKey = claimKey(claim);
	let owner;
	for (const owners of workerTurnOwners.values()) {
		const candidate = owners.get(claim.sessionId);
		if (candidate?.claimKey !== currentClaimKey) continue;
		if (owner) return;
		owner = candidate;
	}
	const runtime = owner?.runtime;
	if (!owner || !runtime || !runtime.store.validateTurnClaim(owner.claim) || !validateAgentRunDelegatedAuthority(runtime.delegatedAuthority)) return;
	return runtime;
}
/** Capture before buffering; delayed events must never bind to a replacement owner. */
function captureWorkerTurnFinishing(identity, request) {
	if (request.runId !== identity.runId || request.runEpoch !== identity.ownerEpoch || request.event.kind !== "lifecycle" || request.event.payload.phase !== "finishing") return;
	const runtime = resolveWorkerTurnRuntime(identity);
	if (!runtime) return;
	const finishing = {
		credentialHash: identity.credentialHash,
		seq: request.seq,
		outcome: {
			error: request.event.payload.error,
			replayInvalid: request.event.payload.replayInvalid
		}
	};
	return () => {
		if (resolveWorkerTurnRuntime(identity) !== runtime) return;
		try {
			runtime.assertActive();
			runtime.finishing = finishing;
		} catch {}
	};
}
/** The durable ACK and its admission predicate belong to the same process turn. */
function acknowledgeWorkerTurnFinishing(identity, ackedSeq, isAckCurrent) {
	const runtime = resolveWorkerTurnRuntime(identity);
	const finishing = runtime?.finishing;
	if (!runtime || !finishing || finishing.seq > ackedSeq || !safeEqualSecret(finishing.credentialHash, identity.credentialHash)) return;
	try {
		runtime.assertActive();
		finishing.isAckCurrent = isAckCurrent;
	} catch {}
}
function runWorkerTurnAdmissionContinuation(identity, run) {
	return resolveWorkerTurnRuntime(identity)?.scope?.run(run) ?? null;
}
/** Host-owned preparation runs at append time, after any awaited transcript admission. */
function prepareWorkerTurnTranscriptMessage(identity, message) {
	return resolveWorkerTurnRuntime(identity)?.prepareAssistantTranscriptMessage?.(message, extractAssistantTranscriptSourceText(message)) ?? message;
}
function attachWorkerTurnExecutionIdentityStore(store, path) {
	Object.defineProperty(store, WORKER_TURN_EXECUTION_IDENTITY_PATH, { value: path });
}
function waitersFor(path, sessionId) {
	let bySession = turnClaimReleaseWaiters.get(path);
	if (!bySession) {
		bySession = /* @__PURE__ */ new Map();
		turnClaimReleaseWaiters.set(path, bySession);
	}
	let waiters = bySession.get(sessionId);
	if (!waiters) {
		waiters = /* @__PURE__ */ new Set();
		bySession.set(sessionId, waiters);
	}
	return waiters;
}
function signalTurnClaimRelease(path, sessionId) {
	const bySession = turnClaimReleaseWaiters.get(path);
	const waiters = bySession?.get(sessionId);
	if (!bySession || !waiters) return;
	bySession.delete(sessionId);
	if (bySession.size === 0) turnClaimReleaseWaiters.delete(path);
	for (const resolve of waiters) resolve();
}
function removeTurnClaimReleaseWaiter(path, sessionId, waiter) {
	const bySession = turnClaimReleaseWaiters.get(path);
	const waiters = bySession?.get(sessionId);
	if (!bySession || !waiters) return;
	waiters.delete(waiter);
	if (waiters.size === 0) bySession.delete(sessionId);
	if (bySession.size === 0) turnClaimReleaseWaiters.delete(path);
}
function registerWorkerTurnClaimClosedHandler(path, handler) {
	const handlers = workerTurnClaimClosedHandlers.get(path) ?? /* @__PURE__ */ new Set();
	handlers.add(handler);
	workerTurnClaimClosedHandlers.set(path, handlers);
	return () => {
		handlers.delete(handler);
		if (handlers.size === 0) workerTurnClaimClosedHandlers.delete(path);
	};
}
function signalWorkerTurnClaimClosed(path, claim) {
	signalTurnClaimRelease(path, claim.sessionId);
	const owners = workerTurnOwners.get(path);
	const owner = owners?.get(claim.sessionId);
	if (owner?.claimKey === claimKey(claim)) {
		owner.runtime.finishing = void 0;
		owner.runtime?.scope?.release();
		owners?.delete(claim.sessionId);
		if (owners?.size === 0) workerTurnOwners.delete(path);
	}
	for (const handler of workerTurnClaimClosedHandlers.get(path) ?? []) try {
		handler(claim);
	} catch {}
}
//#endregion
export { getWorkerTurnExecutionIdentityCapability as a, removeTurnClaimReleaseWaiter as c, signalWorkerTurnClaimClosed as d, waitersFor as f, captureWorkerTurnFinishing as i, runWorkerTurnAdmissionContinuation as l, attachWorkerTurnExecutionIdentityStore as n, prepareWorkerTurnTranscriptMessage as o, bindWorkerTurnOwner as r, registerWorkerTurnClaimClosedHandler as s, acknowledgeWorkerTurnFinishing as t, signalTurnClaimRelease as u };
