import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { l as isAgentRunDirectAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/exec-request-context.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.execRequestContext"), () => ({
	context: new AsyncLocalStorage(),
	turns: /* @__PURE__ */ new Set()
}));
const EVENT_OWNERS = Symbol.for("openclaw.execRequestEventOwners");
function createExecRequestOwner(identity) {
	const controller = new AbortController();
	return {
		identity: Object.freeze({ ...identity }),
		turnRunIds: new Set(identity.runId ? [identity.runId] : []),
		controller,
		signal: controller.signal,
		pendingProcesses: /* @__PURE__ */ new Set(),
		cleanupUncertain: false
	};
}
function cancelExecRequestOwners(owners) {
	for (const owner of owners) if (!owner.controller.signal.aborted) {
		const reason = createAbortError("The request that owns this command was stopped");
		owner.controller.abort(reason);
	}
}
function execRequestMatches(owner, target) {
	return (target.runId === void 0 || owner.turnRunIds.has(target.runId)) && (target.sessionKey === void 0 || owner.identity.sessionKey === target.sessionKey) && (target.sessionId === void 0 || owner.identity.sessionId === target.sessionId) && (target.agentId === void 0 || owner.identity.agentId === target.agentId);
}
/** Capture at tool construction: Code Mode invokes the bound tool from a later callback. */
function captureExecRequestOwners(identity) {
	const turn = state.context.getStore();
	return turn && turn.identity.runId === identity.runId && turn.identity.sessionId === identity.sessionId ? turn.owners : void 0;
}
function captureExecRequestCustody(identity) {
	const owners = captureExecRequestOwners(identity);
	return owners?.length ? Object.freeze({ [EVENT_OWNERS]: Object.freeze([...owners]) }) : void 0;
}
/** Selection retains owner references, including their admitted continuation aliases. */
function captureExecRequestCustodySelection(owners, origin) {
	const selected = new Set(owners);
	return (custody) => custody?.[EVENT_OWNERS]?.some((owner) => selected.has(owner) || Boolean(origin && execRequestMatches(owner, origin.target) && origin.acceptsRequest(owner.identity))) === true;
}
function activeExecRequestOwners(target, accept) {
	return Array.from(new Set([...state.turns].flatMap(({ identity, owners }) => {
		const active = (target.runId === void 0 || identity.runId === target.runId) && (target.sessionKey === void 0 || identity.sessionKey === target.sessionKey) && (target.sessionId === void 0 || identity.sessionId === target.sessionId) && (target.agentId === void 0 || identity.agentId === target.agentId);
		const hasBoundActor = Boolean(identity.ownerConnId?.trim() || identity.ownerDeviceId?.trim());
		return owners.filter((owner) => {
			const current = hasBoundActor ? identity : {
				...owner.identity,
				...identity
			};
			return active && accept(current) || execRequestMatches(owner, target) && accept(owner.identity);
		});
	})));
}
/** Only the accepted session binding or compaction owner updates request identity. */
function adoptExecRequestSession(params) {
	const active = state.context.getStore();
	if (active?.identity.runId !== params.runId || active.identity.sessionId !== params.previousSessionId) return;
	for (const turn of state.turns) if (turn.owners === active.owners && turn.identity.runId === params.runId && turn.identity.sessionId === params.previousSessionId) turn.identity = {
		...turn.identity,
		sessionId: params.sessionId
	};
	for (const owner of active.owners) if (owner.identity.sessionId === params.previousSessionId) owner.identity = Object.freeze({
		...owner.identity,
		sessionId: params.sessionId
	});
}
/** Native process finalization owns settlement; normal turn completion does not join it. */
function retainExecRequestProcess(owners, settlement) {
	if (!owners?.length) return;
	for (const owner of owners) owner.pendingProcesses.add(settlement);
	const release = () => {
		for (const owner of owners) owner.pendingProcesses.delete(settlement);
	};
	settlement.then(release, release);
}
/** A continuation inherits only its selected events; ordinary human turns start fresh. */
async function withExecRequestTurn(params, run) {
	const outer = state.context.getStore();
	const sameTurn = outer?.identity.runId === params.identity.runId && outer?.identity.sessionId === params.identity.sessionId ? outer : void 0;
	const identity = sameTurn?.identity ?? params.identity;
	const inherited = params.owners ?? sameTurn?.owners;
	const owners = inherited?.length ? inherited : [createExecRequestOwner(identity)];
	for (const owner of owners) {
		owner.signal.throwIfAborted();
		if (params.identity.runId) owner.turnRunIds.add(params.identity.runId);
	}
	const turn = {
		identity,
		owners
	};
	const stop = () => {
		if (isAgentRunDirectAbortReason(params.abortSignal?.reason)) cancelExecRequestOwners(owners);
	};
	state.turns.add(turn);
	params.abortSignal?.addEventListener("abort", stop, { once: true });
	if (params.abortSignal?.aborted) stop();
	try {
		return await state.context.run(turn, run);
	} finally {
		try {
			await Promise.all(owners.flatMap((owner) => owner.signal.aborted ? Array.from(owner.pendingProcesses) : []));
		} finally {
			state.turns.delete(turn);
			params.abortSignal?.removeEventListener("abort", stop);
		}
	}
}
/** Enumerable symbol metadata survives internal option/event copies, but never JSON. */
function withExecRequestOwners(value, owners) {
	return owners?.length ? {
		...value,
		[EVENT_OWNERS]: owners
	} : value;
}
function readExecRequestOwners(value) {
	return value[EVENT_OWNERS];
}
function execRequestAbortSignal(owners, signal) {
	if (!owners?.length) return signal;
	const signals = owners.map((owner) => owner.signal);
	return AbortSignal.any(signal ? [signal, ...signals] : signals);
}
//#endregion
export { captureExecRequestCustodySelection as a, execRequestMatches as c, withExecRequestOwners as d, withExecRequestTurn as f, captureExecRequestCustody as i, readExecRequestOwners as l, adoptExecRequestSession as n, captureExecRequestOwners as o, cancelExecRequestOwners as r, execRequestAbortSignal as s, activeExecRequestOwners as t, retainExecRequestProcess as u };
