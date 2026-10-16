import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { A as validateAgentRunDelegatedAuthority, c as getActiveAgentRunDelegatedAuthority, n as claimAgentRunApprovalAuthority } from "./agent-run-registry-BaxMDLZF.mjs";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { r as extractAssistantTranscriptSourceText } from "./chat-message-content-C-d0FKNG.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
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
	for (const owners of ownersByPath.values()) for (const owner of owners.values()) closeBoundOwner(owner);
	ownersByPath.clear();
});
const WORKER_TURN_EXECUTION_IDENTITY_PATH = Symbol("workerTurnExecutionIdentityPath");
function claimKey(claim) {
	return JSON.stringify([
		claim.sessionId,
		claim.claimId,
		claim.runId,
		claim.placementGeneration,
		claim.owner.kind,
		claim.owner.environmentId ?? null,
		claim.owner.ownerEpoch ?? null
	]);
}
/** Bind every worker to its live run and original operator source when one exists. */
async function bindWorkerTurnOwner(store, requestedClaim, token, operationalRunInstance, requestedSource, assertRunActive, prepareAssistantTranscriptMessage, operatorAuthority, assertPresenceSourceCurrent, promptCacheContext) {
	let claim = structuredClone(requestedClaim);
	const sessionTarget = Object.freeze({ ...requestedSource });
	const preparedPromptCacheContext = promptCacheContext ? Object.freeze({ ...promptCacheContext }) : void 0;
	const scope = captureGatewayRootWorkAdmissionContinuationScope();
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const runAuthority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
	if (!path || !runAuthority) {
		scope?.release();
		throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	}
	let claimAuthority;
	const approvalLifetime = new AbortController();
	let delegatedAuthority;
	try {
		const prepared = await store.prepareTurnClaimAuthority(claim);
		claimAuthority = prepared;
		const assertPreparedCurrent = () => {
			if (!prepared.isCurrent() || !validateAgentRunDelegatedAuthority(runAuthority) || sessionTarget.sessionId !== claim.sessionId || prepared.identity.agentId !== sessionTarget.agentId || prepared.identity.sessionKey !== sessionTarget.sessionKey) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
		};
		assertPreparedCurrent();
		assertRunActive();
		operatorAuthority?.assertCurrent();
		assertPreparedCurrent();
		delegatedAuthority = claimAgentRunApprovalAuthority(runAuthority, [approvalLifetime.signal]);
	} catch (error) {
		approvalLifetime.abort();
		claimAuthority?.release();
		scope?.release();
		throw error;
	}
	const authority = claimAuthority;
	claim = authority.claim;
	const owners = workerTurnOwners.get(path) ?? /* @__PURE__ */ new Map();
	const assertOwnerCurrent = () => {
		if (owners.get(claim.sessionId) !== owner || workerTurnOwners.get(path) !== owners || !authority.isCurrent() || !validateAgentRunDelegatedAuthority(delegatedAuthority)) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	};
	const assertActive = () => {
		assertOwnerCurrent();
		assertRunActive();
		operatorAuthority?.assertCurrent();
		assertOwnerCurrent();
	};
	const identity = Object.freeze({
		agentId: sessionTarget.agentId,
		delegatedAuthority,
		...token ? { executionIdentityToken: token } : {},
		operationalRunInstance,
		...operatorAuthority ? { operatorAuthority } : {},
		...assertPresenceSourceCurrent ? { assertPresenceSourceCurrent } : {},
		receiptAuthority: assertActive,
		sessionKey: sessionTarget.sessionKey,
		sessionTarget,
		turnClaim: claim
	});
	const capability = Object.freeze({
		sessionTarget,
		receiptAuthority: assertActive,
		...assertPresenceSourceCurrent ? { assertPresenceSourceCurrent } : {},
		async run(callback) {
			assertActive();
			const result = await callback(identity);
			assertActive();
			return result;
		}
	});
	const existing = owners.get(claim.sessionId);
	const owner = {
		capability,
		claimKey: claimKey(claim),
		runtime: {
			assertActive,
			delegatedAuthority,
			approvalLifetime,
			prepareAssistantTranscriptMessage,
			promptCacheContext: preparedPromptCacheContext,
			scope: scope ?? void 0,
			claimAuthority: authority
		}
	};
	const closeOwner = () => {
		if (owners.get(claim.sessionId) === owner) {
			owners.delete(claim.sessionId);
			if (owners.size === 0 && workerTurnOwners.get(path) === owners) workerTurnOwners.delete(path);
		}
		closeBoundOwner(owner);
	};
	try {
		if (existing) closeBoundOwner(existing);
		owners.set(claim.sessionId, owner);
		workerTurnOwners.set(path, owners);
		owner.runtime.stopWatchingAuthority = authority.onRevoked(closeOwner);
		assertActive();
	} catch (error) {
		closeOwner();
		throw error;
	}
	const takeFinishingOutcome = (credentialHash) => {
		assertActive();
		const finishing = owner.runtime.finishing;
		if (!finishing || !safeEqualSecret(finishing.credentialHash, credentialHash) || !finishing.isAckCurrent?.()) return;
		owner.runtime.finishing = void 0;
		return finishing.outcome;
	};
	return Object.freeze({
		capability,
		takeFinishingOutcome
	});
}
function getWorkerTurnExecutionIdentityCapability(store, claim) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const bound = path ? workerTurnOwners.get(path)?.get(claim.sessionId) : void 0;
	return bound && bound.claimKey === claimKey(claim) && bound.runtime.claimAuthority.isCurrent() ? bound.capability : void 0;
}
/** Retain this operational owner's claim incarnation across an approval's awaited work. */
function captureWorkerTurnClaimCurrentness(store, claim, delegatedAuthority) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const owners = path ? workerTurnOwners.get(path) : void 0;
	const bound = owners?.get(claim.sessionId);
	const capturedKey = claimKey(claim);
	if (!path || !bound || bound.claimKey !== capturedKey || !bound.runtime.claimAuthority.isCurrent()) return;
	const isBoundCurrent = () => claimKey(claim) === capturedKey && workerTurnOwners.get(path) === owners && owners?.get(claim.sessionId) === bound && bound.runtime.claimAuthority.isCurrent();
	return () => isBoundCurrent() && validateAgentRunDelegatedAuthority(delegatedAuthority, bound.runtime.delegatedAuthority) && isBoundCurrent();
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
	if (!owner || !runtime || !runtime.claimAuthority.isCurrent() || !validateAgentRunDelegatedAuthority(runtime.delegatedAuthority)) return;
	return runtime;
}
/** Cache identity follows the Gateway's admitted transcript, never worker-supplied history. */
function readWorkerTurnPromptCacheContext(identity) {
	return resolveWorkerTurnRuntime(identity)?.promptCacheContext;
}
function bindWorkerTurnCapabilities(store, claim, capabilities) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const owner = path ? workerTurnOwners.get(path)?.get(claim.sessionId) : void 0;
	if (!owner || owner.claimKey !== claimKey(claim) || !owner.runtime.claimAuthority.isCurrent() || !validateAgentRunDelegatedAuthority(owner.runtime.delegatedAuthority)) throw new Error("Worker turn has no admitted tool surface owner");
	owner.runtime.toolSurface?.abort();
	Object.assign(owner.runtime, capabilities);
}
function captureWorkerReplyMedia(identity) {
	return resolveWorkerTurnRuntime(identity)?.prepareReplyMedia;
}
function getWorkerTurnToolSurface(identity) {
	return resolveWorkerTurnRuntime(identity)?.toolSurface;
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
function closeBoundOwner(owner) {
	owner.runtime.toolSurface?.abort();
	owner.runtime.approvalLifetime.abort();
	owner.runtime.finishing = void 0;
	owner.runtime.stopWatchingAuthority?.();
	owner.runtime.stopWatchingAuthority = void 0;
	try {
		owner.runtime.scope?.release();
	} finally {
		owner.runtime.claimAuthority.release();
	}
}
function closeWorkerTurnClaim(path, claim, expectedOwner) {
	signalTurnClaimRelease(path, claim.sessionId);
	const owners = workerTurnOwners.get(path);
	const owner = owners?.get(claim.sessionId);
	if (owner && owner === expectedOwner && owner.claimKey === claimKey(claim)) {
		closeBoundOwner(owner);
		owners?.delete(claim.sessionId);
		if (owners?.size === 0) workerTurnOwners.delete(path);
	}
	for (const handler of workerTurnClaimClosedHandlers.get(path) ?? []) try {
		handler(claim);
	} catch {}
}
function prepareWorkerTurnClaimClosed(path, claim) {
	const captured = structuredClone(claim);
	const owner = workerTurnOwners.get(path)?.get(claim.sessionId);
	return () => closeWorkerTurnClaim(path, captured, owner);
}
function deferWorkerTurnClaimClosed(db, path, claim) {
	if (!deferSqlitePostCommitPublication(db, prepareWorkerTurnClaimClosed(path, claim))) throw new Error("Worker turn closure requires its owning transaction");
}
function deferTurnClaimRelease(db, path, sessionId) {
	if (!deferSqlitePostCommitPublication(db, () => signalTurnClaimRelease(path, sessionId))) throw new Error("Worker turn release requires its owning transaction");
}
//#endregion
export { runWorkerTurnAdmissionContinuation as _, captureWorkerReplyMedia as a, deferTurnClaimRelease as c, getWorkerTurnToolSurface as d, prepareWorkerTurnClaimClosed as f, removeTurnClaimReleaseWaiter as g, registerWorkerTurnClaimClosedHandler as h, bindWorkerTurnOwner as i, deferWorkerTurnClaimClosed as l, readWorkerTurnPromptCacheContext as m, attachWorkerTurnExecutionIdentityStore as n, captureWorkerTurnClaimCurrentness as o, prepareWorkerTurnTranscriptMessage as p, bindWorkerTurnCapabilities as r, captureWorkerTurnFinishing as s, acknowledgeWorkerTurnFinishing as t, getWorkerTurnExecutionIdentityCapability as u, waitersFor as v };
