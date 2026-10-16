import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { randomUUID } from "node:crypto";
//#region packages/acp-core/src/session.ts
const DEFAULT_MAX_SESSIONS = 5e3;
const DEFAULT_IDLE_TTL_MS = 864e5;
/** Creates the bounded in-memory ACP session registry used by local ACP runtime clients. */
function createInMemorySessionStore(options = {}) {
	const maxSessions = resolveIntegerOption(options.maxSessions, DEFAULT_MAX_SESSIONS, { min: 1 });
	const idleTtlMs = resolveIntegerOption(options.idleTtlMs, DEFAULT_IDLE_TTL_MS, { min: 1e3 });
	const now = options.now ?? Date.now;
	const onSessionRemoved = options.onSessionRemoved;
	const sessions = /* @__PURE__ */ new Map();
	const removeSession = (sessionId) => {
		const session = sessions.get(sessionId);
		if (!session) return false;
		session.abortController?.abort();
		sessions.delete(sessionId);
		onSessionRemoved?.(sessionId);
		return true;
	};
	const reapIdleSessions = (nowMs) => {
		const idleBefore = nowMs - idleTtlMs;
		for (const [sessionId, session] of sessions.entries()) {
			if (session.activeRunId || session.abortController) continue;
			if (session.lastTouchedAt > idleBefore) continue;
			removeSession(sessionId);
		}
	};
	const evictOldestIdleSession = () => {
		let oldestSessionId = null;
		let oldestLastTouchedAt = Number.POSITIVE_INFINITY;
		for (const [sessionId, session] of sessions.entries()) {
			if (session.activeRunId || session.abortController) continue;
			if (session.lastTouchedAt >= oldestLastTouchedAt) continue;
			oldestLastTouchedAt = session.lastTouchedAt;
			oldestSessionId = sessionId;
		}
		if (!oldestSessionId) return false;
		return removeSession(oldestSessionId);
	};
	const createSession = (params) => {
		const nowMs = now();
		const sessionId = params.sessionId ?? randomUUID();
		const existingSession = sessions.get(sessionId);
		if (existingSession) {
			existingSession.sessionKey = params.sessionKey;
			if ("ledgerSessionId" in params) existingSession.ledgerSessionId = params.ledgerSessionId;
			existingSession.cwd = params.cwd;
			existingSession.lastTouchedAt = nowMs;
			return existingSession;
		}
		reapIdleSessions(nowMs);
		if (sessions.size >= maxSessions && !evictOldestIdleSession()) throw new Error(`ACP session limit reached (max ${maxSessions}). Close idle ACP clients and retry.`);
		const session = {
			sessionId,
			sessionKey: params.sessionKey,
			...params.ledgerSessionId ? { ledgerSessionId: params.ledgerSessionId } : {},
			cwd: params.cwd,
			createdAt: nowMs,
			lastTouchedAt: nowMs,
			abortController: null,
			activeRunId: null
		};
		sessions.set(sessionId, session);
		return session;
	};
	const getSession = (sessionId) => {
		const session = sessions.get(sessionId);
		if (session) session.lastTouchedAt = now();
		return session;
	};
	const setActiveRun = (sessionId, runId, abortController) => {
		const session = sessions.get(sessionId);
		if (!session) return;
		session.activeRunId = runId;
		session.abortController = abortController;
		session.lastTouchedAt = now();
	};
	const releaseActiveRun = (session) => {
		session.activeRunId = null;
		session.abortController = null;
		session.lastTouchedAt = now();
	};
	const clearActiveRun = (sessionId, expectedRunId) => {
		const session = sessions.get(sessionId);
		if (session && (expectedRunId === void 0 || session.activeRunId === expectedRunId)) releaseActiveRun(session);
	};
	const cancelActiveRun = (sessionId, expectedRunId) => {
		const session = sessions.get(sessionId);
		if (!session?.abortController || expectedRunId !== void 0 && session.activeRunId !== expectedRunId) return false;
		session.abortController.abort();
		releaseActiveRun(session);
		return true;
	};
	const dispose = () => {
		for (const session of sessions.values()) session.abortController?.abort();
		const removed = [...sessions.keys()];
		sessions.clear();
		for (const sessionId of removed) onSessionRemoved?.(sessionId);
	};
	return {
		createSession,
		hasSession: (sessionId) => sessions.has(sessionId),
		getSession,
		setActiveRun,
		clearActiveRun,
		cancelActiveRun,
		deleteSession: removeSession,
		dispose
	};
}
//#endregion
export { createInMemorySessionStore as t };
