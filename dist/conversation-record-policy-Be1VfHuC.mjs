//#region src/config/sessions/conversation-record-policy.ts
function normalizeStoredConversationRef(value) {
	const normalized = value.trim().toLowerCase();
	if (!/^conv_[a-f0-9]{32}$/u.test(normalized)) throw new Error(`Invalid conversationRef: ${value}`);
	return normalized;
}
/** Newest activity orders the catalogue; current associations own its routing facts. */
function selectUniqueConversationRows(rows, options) {
	const unique = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const existing = unique.get(options.conversationRef(row));
		if (existing?.associationIsCurrent) continue;
		const mapped = options.map(row);
		if (!mapped) continue;
		if (!existing) {
			unique.set(mapped.record.conversationRef, mapped);
			continue;
		}
		if (mapped.associationIsCurrent && mapped.record.sessionId && mapped.record.sessionKey && mapped.record.role) {
			const { routeContext: _context, routeContextObserved: _observed, ...previous } = existing.record;
			unique.set(mapped.record.conversationRef, {
				associationIsCurrent: true,
				record: {
					...previous,
					sessionId: mapped.record.sessionId,
					sessionKey: mapped.record.sessionKey,
					role: mapped.record.role,
					...mapped.record.routeContextObserved ? { routeContextObserved: true } : {},
					...mapped.record.routeContext ? { routeContext: mapped.record.routeContext } : {}
				}
			});
		}
	}
	const values = [...unique.values()].map(({ record }) => record);
	return options.limit === void 0 ? values : values.slice(0, options.limit);
}
//#endregion
export { selectUniqueConversationRows as n, normalizeStoredConversationRef as t };
