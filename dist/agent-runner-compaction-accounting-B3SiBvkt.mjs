//#region src/auto-reply/reply/agent-runner-compaction-accounting.ts
function hasSameCompactionWriter(previous, current) {
	return previous !== void 0 && previous.agentId === current.agentId && previous.sessionKey === current.sessionKey && previous.storePath === current.storePath && previous.lifecycleRevision === current.lifecycleRevision && previous.activeWriterRunId === current.activeWriterRunId;
}
/** A later opaque candidate may lose freshness, but must never fabricate it. */
function invalidateTurnCompactionContext(compaction) {
	compaction.durable = compaction.durable.map((fact) => ({
		...fact,
		currentContextSnapshot: { tokens: void 0 }
	}));
}
/** Fold same-writer facts; only an ordered snapshot may refresh context. */
function recordTurnCompaction(compaction, fact) {
	if (fact.count < 0) return;
	compaction.count += fact.count;
	if (fact.kind !== "durable") return;
	const index = compaction.durable.findIndex(({ target }) => hasSameCompactionWriter(target, fact.target));
	const previous = compaction.durable[index];
	if (!previous && fact.count === 0) return;
	if (previous) compaction.durable.splice(index, 1);
	compaction.durable.push({
		...fact,
		count: (previous?.count ?? 0) + fact.count,
		currentContextSnapshot: fact.currentContextSnapshot ?? previous?.currentContextSnapshot
	});
}
//#endregion
export { invalidateTurnCompactionContext as n, recordTurnCompaction as r, hasSameCompactionWriter as t };
