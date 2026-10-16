import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
//#region src/gateway/talk/session-registry.ts
/**
* Process-local registry that lets Talk protocol methods resolve opaque
* `sessionId` values to the concrete relay or managed-room backend.
*/
const unifiedTalkSessions = resolveGlobalMap(Symbol.for("openclaw.unifiedTalkSessions"), "close-and-restart");
const talkConnectionCleanups = resolveGlobalMap(Symbol.for("openclaw.talkConnectionCleanups"), async (connections) => {
	const failures = (await Promise.allSettled([...connections].flatMap(([connId, cleanups]) => [...cleanups].map(async ([kind, cleanup]) => {
		await runTalkConnectionCleanup(connId, kind, cleanup);
	})))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Talk provider cleanup did not complete");
}, "close-and-restart");
function runTalkConnectionCleanup(connId, kind, cleanup) {
	if (cleanup.pending) return cleanup.pending;
	if (talkConnectionCleanups.get(connId)?.get(kind) !== cleanup) return;
	const completion = createDeferredCore();
	cleanup.pending = completion.promise;
	const completed = () => {
		cleanup.pending = void 0;
		cleanup.failed = false;
		const cleanups = talkConnectionCleanups.get(connId);
		if (cleanups?.get(kind) === cleanup) {
			if (cleanup.nextRun) {
				cleanup.run = cleanup.nextRun;
				cleanup.nextRun = void 0;
				return runTalkConnectionCleanup(connId, kind, cleanup);
			}
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
		if (isPromiseLike(result)) {
			completion.resolve(Promise.resolve(result).then(completed, failed));
			return completion.promise;
		}
		const next = completed();
		completion.resolve(next);
		return next;
	} catch (error) {
		completion.reject(error);
		completion.promise.catch(() => {});
		return failed(error);
	}
}
/** Keeps failed cleanup under its original owner until a successful retry. */
function registerTalkConnectionCleanup(connId, kind, cleanup) {
	const cleanups = talkConnectionCleanups.get(connId) ?? /* @__PURE__ */ new Map();
	const previous = cleanups.get(kind);
	if (previous?.pending || previous?.failed) previous.nextRun = cleanup;
	else cleanups.set(kind, {
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
function rememberUnifiedTalkSession(sessionId, session) {
	unifiedTalkSessions.set(sessionId, session);
}
function getUnifiedTalkSession(sessionId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (!session) throw new Error("Unknown Talk session");
	return session;
}
/** Retains the realtime relay's admitted target without reinterpreting current defaults. */
function resolveUnifiedTalkSessionTarget(sessionId, connId) {
	const session = unifiedTalkSessions.get(sessionId);
	if (session?.kind !== "realtime-relay") return;
	requireUnifiedTalkSessionConn(session, connId);
	const target = session.sessionTarget;
	return {
		target,
		isCurrent: () => unifiedTalkSessions.get(sessionId) === session && session.connId === connId && session.sessionTarget === target
	};
}
function forgetUnifiedTalkSession(sessionId) {
	unifiedTalkSessions.delete(sessionId);
}
function requireUnifiedTalkSessionConn(session, connId) {
	if (!connId || session.connId !== connId) throw new Error("Talk session is not owned by this connection");
	return connId;
}
//#endregion
export { rememberUnifiedTalkSession as a, registerTalkConnectionCleanup as i, forgetUnifiedTalkSession as n, requireUnifiedTalkSessionConn as o, getUnifiedTalkSession as r, resolveUnifiedTalkSessionTarget as s, cleanupTalkConnection as t };
