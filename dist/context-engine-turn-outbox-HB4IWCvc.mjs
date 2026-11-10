//#region src/agents/harness/context-engine-turn-outbox.ts
function isRetryableContextEngineTurnReadFailure(kind) {
	return kind === "projection-unavailable";
}
async function drainContextEngineTurnOutbox(params) {
	return params.store.retain ? params.store.retain(() => drainRetainedContextEngineTurnOutbox(params)) : drainRetainedContextEngineTurnOutbox(params);
}
async function drainRetainedContextEngineTurnOutbox(params) {
	const { store } = params;
	const filter = {
		engineId: params.engineId,
		ownerPluginId: params.ownerPluginId
	};
	if (typeof params.engine.commitTurn !== "function") return { pending: false };
	let remaining = Math.max(0, params.limit ?? 16);
	if (remaining === 0) return { pending: await store.hasPending({
		...filter,
		sessionId: params.sessionId
	}) };
	let activeSessionIds = await store.listPendingSessions({
		...filter,
		sessionId: params.sessionId,
		limit: remaining
	});
	while (remaining > 0 && activeSessionIds.length > 0) {
		const continuingSessionIds = [];
		for (const sessionId of activeSessionIds) {
			if (remaining === 0) break;
			const row = await store.readNextPending({
				...filter,
				sessionId
			});
			if (!row) continue;
			remaining -= 1;
			if (await commitPendingContextEngineTurn({
				...params,
				store,
				row
			})) continuingSessionIds.push(sessionId);
		}
		activeSessionIds = continuingSessionIds;
	}
	return { pending: await store.hasPending({
		...filter,
		sessionId: params.sessionId
	}) };
}
async function commitPendingContextEngineTurn(params) {
	const { row } = params;
	try {
		const payload = JSON.parse(row.payload_json);
		if (payload.state !== "ready") return false;
		const commonParams = {
			advancementKey: row.advancement_key,
			admission: payload.boundary.admission,
			terminal: payload.boundary.terminal,
			messages: payload.messages,
			sessionId: payload.boundary.admission.sessionId,
			sessionKey: payload.boundary.admission.sessionKey,
			sessionTarget: {
				agentId: payload.boundary.admission.agentId,
				sessionId: payload.boundary.admission.sessionId,
				sessionKey: payload.boundary.admission.sessionKey,
				storePath: payload.boundary.admission.storePath
			},
			isHeartbeat: payload.isHeartbeat,
			...payload.runtimeContext ? { runtimeContext: payload.runtimeContext } : {}
		};
		params.store.assertReadable?.();
		const result = await params.engine.commitTurn?.(commonParams);
		if (!result) throw new Error("context engine does not implement commitTurn");
		if (result.status !== "committed" && result.status !== "duplicate") throw new Error(`invalid commitTurn result status: ${String(result.status)}`);
		await params.store.complete(row.advancement_key);
		try {
			params.store.assertReadable?.();
			params.onCommitted?.(commonParams);
		} catch (error) {
			params.warn(`[context-engine] committed turn notification failed: ${error instanceof Error ? error.message : String(error)}`);
		}
		return true;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		await params.store.recordFailure(row.advancement_key, message, Date.now());
		params.warn(`[context-engine] durable turn advancement remains queued: ${row.advancement_key}: ${message}`);
		return false;
	}
}
//#endregion
export { isRetryableContextEngineTurnReadFailure as n, drainContextEngineTurnOutbox as t };
