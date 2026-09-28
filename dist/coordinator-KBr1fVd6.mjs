import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-CHv_0noy.mjs";
import { h as registerAgentEventLifecycleRotationHandler, l as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-maintenance/coordinator.ts
const log = createSubsystemLogger("agents/session-maintenance");
function recordPhase(sessionKey, owner, phase) {
	if (owner.preemptible) log.debug("session maintenance lifecycle", {
		event: "session_maintenance",
		phase,
		sessionKey,
		maintenanceId: owner.sequence,
		lifecycleGeneration: owner.lifecycleGeneration
	});
}
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessionMaintenance"), () => ({
	sequence: 0,
	sessions: /* @__PURE__ */ new Map(),
	current: new AsyncLocalStorage()
}), (current) => {
	for (const session of current.sessions.values()) for (const owner of session.owners) owner.controller.abort(createAbortError("Session maintenance stopped with its host"));
});
function sessionState(key) {
	let session = state.sessions.get(key);
	if (!session) {
		session = {
			owners: /* @__PURE__ */ new Set(),
			foreground: 0,
			wake: /* @__PURE__ */ new Set()
		};
		state.sessions.set(key, session);
	}
	return session;
}
function releaseSessionState(key, session) {
	if (!session.foreground && !session.owners.size && state.sessions.get(key) === session) state.sessions.delete(key);
}
function independentOwners(session, current) {
	const blocked = new Set(current);
	return [...session?.owners ?? []].filter((owner) => {
		if (blocked.has(owner) || owner.predecessors.some((predecessor) => !predecessor.writesReleased && blocked.has(predecessor))) {
			blocked.add(owner);
			return false;
		}
		return true;
	});
}
registerAgentEventLifecycleRotationHandler("session-maintenance", () => {
	for (const session of state.sessions.values()) for (const owner of session.owners) owner.controller.abort(createAbortError("Session maintenance retired with its lifecycle"));
});
/** Tracks a producer's real completion; cancellation never releases a writer early. */
function createSessionMaintenanceOwner(params) {
	const key = params.sessionKey.trim();
	const session = sessionState(key);
	const generation = getAgentEventLifecycleGeneration();
	const ancestors = state.current.getStore() ?? /* @__PURE__ */ new Set();
	const controller = new AbortController();
	const signal = AbortSignal.any([
		controller.signal,
		getGatewayRestartDrainSignal(),
		...params.abortSignal ? [params.abortSignal] : []
	]);
	let finish = () => {};
	const done = new Promise((resolve) => {
		finish = resolve;
	});
	let finishWrites = () => {};
	const writesDone = new Promise((resolve) => {
		finishWrites = resolve;
	});
	const releaseWrites = () => {
		owner.writesReleased = true;
		owner.predecessors = [];
		finishWrites();
	};
	const owner = {
		sequence: state.sequence++,
		lifecycleGeneration: generation,
		controller,
		done,
		writesDone,
		writesReleased: false,
		predecessors: independentOwners(session, ancestors),
		preemptible: params.preemptible === true,
		running: params.preemptible !== true
	};
	session.owners.add(owner);
	recordPhase(key, owner, "pending");
	const assertCurrent = () => {
		signal.throwIfAborted();
		assertAgentRunLifecycleGenerationCurrent(generation);
		if (owner.writesReleased || !session.owners.has(owner)) throw createAbortError("Session maintenance owner is closed");
	};
	return {
		signal,
		done,
		assertCurrent,
		releaseWrites,
		run: async (run) => {
			await Promise.all(owner.predecessors.map((predecessor) => predecessor.writesDone));
			if (owner.preemptible) {
				while (session.foreground > 0) {
					let wake = () => {};
					const available = new Promise((resolve) => {
						wake = resolve;
					});
					session.wake.add(wake);
					try {
						await racePromiseWithAbortSignal(available, signal);
					} finally {
						session.wake.delete(wake);
					}
				}
				assertCurrent();
				owner.running = true;
				recordPhase(key, owner, "started");
			}
			return state.current.run(/* @__PURE__ */ new Set([...ancestors, owner]), run);
		},
		track: (work) => work.finally(() => {
			releaseWrites();
			session.owners.delete(owner);
			recordPhase(key, owner, "settled");
			finish();
			releaseSessionState(key, session);
		})
	};
}
/** Reserve foreground priority before queueing so optional work cannot seize its lane. */
async function beginForegroundSessionMaintenance(sessionKey) {
	const key = sessionKey?.trim();
	if (!key) return () => {};
	const session = sessionState(key);
	session.foreground += 1;
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		session.foreground -= 1;
		if (!session.foreground) for (const wake of session.wake) wake();
		releaseSessionState(key, session);
	};
	const existing = independentOwners(session, state.current.getStore());
	const optional = existing.filter((owner) => owner.preemptible);
	for (const owner of optional) {
		recordPhase(key, owner, "foreground_preemption_requested");
		owner.controller.abort(createAbortError("Session maintenance yielded to a foreground turn"));
	}
	await Promise.all(existing.filter((owner) => owner.running || owner.preemptible).map((owner) => owner.done));
	return release;
}
/** Read checkpoint shared by foreground and nested maintenance inference. */
async function waitForSessionMaintenance(sessionKey) {
	const session = sessionKey ? state.sessions.get(sessionKey.trim()) : void 0;
	const current = state.current.getStore();
	await Promise.all(independentOwners(session, current).filter((owner) => owner.running || session?.foreground === 0).map((owner) => current?.size ? owner.writesDone : owner.done));
}
//#endregion
export { createSessionMaintenanceOwner as n, waitForSessionMaintenance as r, beginForegroundSessionMaintenance as t };
