//#region extensions/codex/src/session-upstream-marker.ts
function lastIdentifiableTurn(thread, normalizeTurnId) {
	for (let index = (thread.turns?.length ?? 0) - 1; index >= 0; index -= 1) {
		const turn = thread.turns?.[index];
		const turnId = normalizeTurnId(turn?.id);
		if (turn && turnId) return {
			...turn,
			id: turnId
		};
	}
}
function codexUpstreamBaseline(thread, normalizeTurnId) {
	const turn = lastIdentifiableTurn(thread, normalizeTurnId);
	return {
		turnId: turn?.id ?? null,
		userMessageCount: turn?.items.filter((item) => item.type === "userMessage").length ?? 0
	};
}
function codexLastTerminalTurnId(thread, normalizeTurnId) {
	for (let index = (thread.turns?.length ?? 0) - 1; index >= 0; index -= 1) {
		const turn = thread.turns?.[index];
		const turnId = normalizeTurnId(turn?.id);
		if (!turn || !turnId) continue;
		if (turn.status === "completed" || turn.status === "interrupted" || turn.status === "failed") return turnId;
	}
}
/** Build the upstream link seed for a continued Codex session, if a baseline exists. */
function codexUpstreamContinueResult(sessionKey, threadId, baseline) {
	if (!baseline) return { sessionKey };
	return {
		sessionKey,
		upstream: {
			kind: "codex-app-server",
			ref: {
				connectionFingerprint: baseline.connectionFingerprint,
				threadId
			},
			marker: {
				turnId: baseline.turnId,
				userMessageCount: baseline.userMessageCount
			}
		}
	};
}
//#endregion
export { codexUpstreamBaseline as n, codexUpstreamContinueResult as r, codexLastTerminalTurnId as t };
