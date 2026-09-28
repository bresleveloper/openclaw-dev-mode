//#region extensions/openai/realtime-session-retirement.ts
const REALTIME_CLEANUP_RETRY_DELAYS_MS = [1e3, 5e3];
function createOpenAIRealtimeSessionLease(params) {
	const activeSessions = /* @__PURE__ */ new Map();
	const retiringSessions = /* @__PURE__ */ new Map();
	const activeSessionLease = {
		adopt: (token, wire) => {
			const session = {
				token,
				...wire
			};
			activeSessions.set(token, session);
			return session;
		},
		close: (session, disposition = "abort", error, retry = false) => {
			if (session.closing) return session.closing;
			if (activeSessions.get(session.token) !== session && retiringSessions.get(session.token) !== session) return Promise.resolve();
			clearTimeout(session.retryTimer);
			if (!retry) session.retryIndex = 0;
			clearTimeout(session.timer);
			let resolve;
			let reject;
			const closing = new Promise((accept, fail) => {
				resolve = accept;
				reject = fail;
			});
			session.closing = closing;
			let retirement = void 0;
			if (activeSessions.delete(session.token)) {
				session.initialRetirement = closing;
				retiringSessions.set(session.token, session);
				try {
					if (disposition === "detach") session.detach?.();
					retirement = session.retire?.(error);
				} catch {
					params.logger.warn("OpenAI realtime local retirement failed; attempting remote cleanup");
				}
			}
			const complete = () => {
				retiringSessions.delete(session.token);
				params.releaseReservation(session.token);
				session.closing = void 0;
				resolve();
				params.onSettled();
			};
			const failed = (failure) => {
				session.closing = void 0;
				const delay = REALTIME_CLEANUP_RETRY_DELAYS_MS[session.retryIndex ?? 0];
				if (delay !== void 0) {
					session.retryIndex = (session.retryIndex ?? 0) + 1;
					session.retryTimer = setTimeout(() => {
						activeSessionLease.close(session, "abort", void 0, true).catch(() => void 0);
					}, delay);
					session.retryTimer.unref?.();
					params.logger.warn("OpenAI realtime remote cleanup failed; retry remains scheduled");
				} else params.logger.warn("OpenAI realtime cleanup INCOMPLETE after three attempts; capacity remains reserved. A later broker/plugin cleanup can retry. Restarting loses this in-memory obligation.");
				reject(failure);
			};
			const dispose = () => {
				try {
					const disposal = session.dispose?.();
					if (disposal) Promise.resolve(disposal).then(complete, failed);
					else complete();
				} catch (failure) {
					failed(failure);
				}
			};
			if (retirement) retirement.then(dispose, () => {
				params.logger.warn("OpenAI realtime local retirement failed; attempting remote cleanup");
				dispose();
			});
			else dispose();
			return closing;
		},
		expireIn: (session, ttlMs) => {
			clearTimeout(session.timer);
			session.timer = setTimeout(() => void activeSessionLease.close(session).catch(() => void 0), Math.max(0, ttlMs));
			session.timer.unref?.();
		},
		deliverAnswer: async (session, signal, deliver) => {
			if (!await deliver() || signal.aborted) await (session.initialRetirement ?? activeSessionLease.close(session));
		}
	};
	return {
		...activeSessionLease,
		activeSessions,
		retiringSessions
	};
}
//#endregion
export { createOpenAIRealtimeSessionLease as t };
