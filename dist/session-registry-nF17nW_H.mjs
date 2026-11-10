import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { o as runWithSqliteWorkerStateContext, t as captureSqliteWorkerStateContext } from "./sqlite-worker-state-context-QuvwmAax.mjs";
import { t as runBestEffortCleanup } from "./non-fatal-cleanup-BoCq8AND.mjs";
import { u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/talk/client-voice-session-lifecycle.ts
const current = new AsyncLocalStorage();
const lifetimes = /* @__PURE__ */ new Map();
function createLifetime({ admission }) {
	let work = new AsyncWorkScope();
	const scopes = /* @__PURE__ */ new Set([work]);
	let gateways = 0;
	let closing = false;
	const drain = (scope) => AsyncWorkScope.runWhenAllIdle(() => [scope], async () => {
		await scope.drain();
		scopes.delete(scope);
	});
	const owner = {
		matchesDatabase(context) {
			const identity = context.admission.identity;
			return admission.identity.key === identity.key && admission.identity.birthtime === identity.birthtime;
		},
		retainGateway() {
			if (closing) {
				work = new AsyncWorkScope();
				scopes.add(work);
				closing = false;
			}
			gateways += 1;
			let released = false;
			let pending;
			const beginClose = () => {
				if (!released) {
					released = true;
					if (--gateways === 0) {
						closing = true;
						pending = drain(work);
					}
				}
			};
			return {
				beginClose,
				drain: () => {
					beginClose();
					return pending ?? Promise.resolve();
				}
			};
		},
		assertOpen(inherited) {
			if (closing && !inherited) throw new Error("Voice session persistence admission is closed");
		},
		scope: () => work
	};
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) {
			closing = true;
			await Promise.all([...scopes].map(drain));
			if (gateways > 0) {
				work = new AsyncWorkScope();
				scopes.add(work);
				closing = false;
			} else {
				for (const [key, candidate] of lifetimes) if (candidate === owner) lifetimes.delete(key);
				unregister();
			}
		}
	} });
	return owner;
}
function lifetime(context) {
	let owner = lifetimes.get(context.admission.coordinationKey);
	if (!owner) {
		owner = [...lifetimes.values()].find((candidate) => candidate.matchesDatabase(context));
		owner ??= createLifetime(context);
		lifetimes.set(context.admission.coordinationKey, owner);
	}
	return owner;
}
/** Retain the original owner for later admissions without retaining an accepted permit. */
function captureClientVoiceSessionSettlementContext(env) {
	const inherited = current.getStore()?.context;
	const selected = inherited && inherited.environment.OPENCLAW_STATE_DIR === env.OPENCLAW_STATE_DIR ? inherited : captureOpenClawStateWorkerContext({ env });
	return {
		...captureSqliteWorkerStateContext(selected),
		admission: selected.admission
	};
}
/** Retain accepted work before a bounded queue or provider can yield. */
function captureClientVoiceSessionSettlement(source) {
	const inherited = current.getStore();
	const selected = source ?? inherited?.context ?? captureOpenClawStateWorkerContext();
	const inheritedSource = inherited && matchesSettlementContext(inherited.context, selected) ? inherited : void 0;
	if (inheritedSource && !inheritedSource.active) throw new Error("Voice session persistence lost its accepted owner");
	selected.admission.assertCurrent();
	const context = inheritedSource?.context ?? {
		...captureSqliteWorkerStateContext(selected),
		admission: selected.admission
	};
	const owner = lifetime(context);
	owner.assertOpen(Boolean(inheritedSource));
	const scope = inheritedSource?.scope ?? owner.scope();
	const settled = createDeferredCore();
	scope.track(() => settled.promise);
	const operation = {
		context,
		scope,
		active: true
	};
	return {
		run(run) {
			if (!operation.active) throw new Error("Voice session persistence lost its accepted owner");
			context.admission.assertCurrent();
			return scope.run(() => current.run(operation, () => runWithSqliteWorkerStateContext(context, run)));
		},
		release() {
			operation.active = false;
			settled.resolve();
		}
	};
}
async function withClientVoiceSessionSettlement(run, onAdmissionFailure, source) {
	let accepted;
	let entered = false;
	try {
		accepted = captureClientVoiceSessionSettlement(source);
		return await accepted.run(() => {
			entered = true;
			return run();
		});
	} catch (error) {
		if (!entered && onAdmissionFailure) return await onAdmissionFailure(error);
		throw error;
	} finally {
		accepted?.release();
	}
}
function matchesSettlementContext(left, right) {
	return left.admission.coordinationKey === right.admission.coordinationKey && left.admission.identity.key === right.admission.identity.key && left.admission.identity.birthtime === right.admission.identity.birthtime;
}
function assertClientVoiceSessionSettlementCurrent(source) {
	const accepted = current.getStore();
	if (accepted && (!source || matchesSettlementContext(accepted.context, source))) {
		if (!accepted.active) throw new Error("Voice session persistence lost its accepted owner");
		accepted.context.admission.assertCurrent();
	}
}
function prepareClientVoiceSessionClose() {
	return lifetime(captureOpenClawStateWorkerContext()).retainGateway();
}
/** Await all cleanup without making an acknowledged operation appear replayable. */
async function withClientVoiceSessionResources(resources, operation) {
	const errors = [];
	const release = () => releaseSessionSourceAuthorities(typeof resources === "function" ? resources() : resources, errors);
	try {
		return await operation();
	} catch (error) {
		errors.push(error);
		throw error;
	} finally {
		if (errors.length > 0) await release();
		else await runBestEffortCleanup({
			cleanup: release,
			onError: (error) => console.warn("[talk] voice session operation completed before cleanup failed", error)
		});
	}
}
//#endregion
//#region src/gateway/talk/session-registry.ts
const unifiedTalkSessions = resolveGlobalMap(Symbol.for("openclaw.unifiedTalkSessions"), "close-and-restart");
const talkConnectionCleanups = resolveGlobalMap(Symbol.for("openclaw.talkConnectionCleanups"), (connections) => closeTalkConnections(connections.keys()), "close-and-restart");
function runTalkConnectionCleanup(connId, kind, cleanup) {
	if (cleanup.pending) return cleanup.pending;
	if (talkConnectionCleanups.get(connId)?.get(kind) !== cleanup) return;
	const completed = () => {
		cleanup.pending = void 0;
		cleanup.failed = false;
		const cleanups = talkConnectionCleanups.get(connId);
		if (cleanups?.get(kind) === cleanup) {
			cleanups.delete(kind);
			if (cleanups.size === 0 && talkConnectionCleanups.get(connId) === cleanups) talkConnectionCleanups.delete(connId);
		}
	};
	const failed = (error) => {
		cleanup.pending = void 0;
		cleanup.failed = true;
		throw error;
	};
	try {
		const run = cleanup.run;
		const result = run();
		if (result) {
			cleanup.pending = Promise.resolve(result).then(completed, failed);
			return cleanup.pending;
		}
		return completed();
	} catch (error) {
		return failed(error);
	}
}
/** Keeps failed cleanup under its original owner until a successful retry. */
function registerTalkConnectionCleanup(connId, kind, cleanup) {
	const cleanups = talkConnectionCleanups.get(connId) ?? /* @__PURE__ */ new Map();
	const previous = cleanups.get(kind);
	if (!previous?.pending && !previous?.failed) cleanups.set(kind, {
		run: cleanup,
		failed: false
	});
	talkConnectionCleanups.set(connId, cleanups);
}
/** Starts cleanup without blocking the socket callback and reports asynchronous failures. */
function cleanupTalkConnection(connId, log) {
	const cleanups = talkConnectionCleanups.get(connId);
	if (!cleanups) return;
	const snapshot = [...cleanups];
	for (const [kind, cleanup] of snapshot) {
		if (cleanup.pending) continue;
		const report = (error) => {
			log.warn(`failed to run ${kind} Talk cleanup after connection disconnect: ${formatErrorMessage(error)}`);
		};
		try {
			const pending = runTalkConnectionCleanup(connId, kind, cleanup);
			if (pending) pending.catch(report);
		} catch (error) {
			report(error);
		}
	}
}
function prepareTalkConnectionClose(clients, log) {
	const persistence = prepareClientVoiceSessionClose();
	let pending;
	const beginClose = () => {
		if (pending) return;
		const connIds = Array.from(clients, (client) => client.connId);
		const cleanup = () => closeTalkConnections(connIds);
		pending = withClientVoiceSessionSettlement(cleanup, async (error) => {
			try {
				await cleanup();
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Talk cleanup failed", { cause: cleanupError });
			}
			throw error;
		});
		pending.catch((error) => log.warn(`Talk cleanup failed: ${formatErrorMessage(error)}`));
		persistence.beginClose();
	};
	return {
		beginClose,
		async drain() {
			try {
				beginClose();
				await pending;
			} finally {
				await persistence.drain();
			}
		}
	};
}
async function closeTalkConnections(connIds) {
	const pending = [];
	for (const connId of connIds) {
		const cleanups = [...talkConnectionCleanups.get(connId) ?? []];
		for (const [kind, cleanup] of cleanups) try {
			pending.push(Promise.resolve(runTalkConnectionCleanup(connId, kind, cleanup)));
		} catch (error) {
			pending.push(Promise.reject(error instanceof Error ? error : new Error(String(error))));
		}
	}
	const failures = (await Promise.allSettled(pending)).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Talk provider cleanup did not complete");
}
function rememberUnifiedTalkSession(sessionId, session) {
	unifiedTalkSessions.set(sessionId, session);
}
function getUnifiedTalkSession(sessionId) {
	const session = unifiedTalkSessions.get(sessionId.trim());
	if (!session) throw new Error("Unknown Talk session");
	return session;
}
/** Retains the realtime relay's admitted target without reinterpreting current defaults. */
function resolveUnifiedTalkSessionTarget(sessionId, connId) {
	const id = sessionId.trim();
	const session = unifiedTalkSessions.get(id);
	if (session?.kind !== "realtime-relay") return;
	requireUnifiedTalkSessionConn(session, connId);
	const target = session.sessionTarget;
	return {
		target,
		isCurrent: () => unifiedTalkSessions.get(id) === session && session.connId === connId && session.sessionTarget === target
	};
}
function forgetUnifiedTalkSession(sessionId) {
	unifiedTalkSessions.delete(sessionId.trim());
}
function requireUnifiedTalkSessionConn(session, connId) {
	if (!connId || session.connId !== connId) throw new Error("Talk session is not owned by this connection");
	return connId;
}
//#endregion
export { registerTalkConnectionCleanup as a, resolveUnifiedTalkSessionTarget as c, captureClientVoiceSessionSettlementContext as d, withClientVoiceSessionResources as f, prepareTalkConnectionClose as i, assertClientVoiceSessionSettlementCurrent as l, forgetUnifiedTalkSession as n, rememberUnifiedTalkSession as o, withClientVoiceSessionSettlement as p, getUnifiedTalkSession as r, requireUnifiedTalkSessionConn as s, cleanupTalkConnection as t, captureClientVoiceSessionSettlement as u };
