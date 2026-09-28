//#region src/gateway/operator-approval-snapshot.ts
/** Project one durable row into the reviewer-safe public approval shape. */
function projectOperatorApprovalSnapshot(record, controlUiBasePath) {
	const common = {
		id: record.id,
		status: record.status,
		presentation: record.presentation,
		urlPath: `${controlUiBasePath}/approve/${encodeURIComponent(record.id)}`,
		createdAtMs: record.createdAtMs,
		expiresAtMs: record.expiresAtMs
	};
	if (record.status === "pending") return common;
	if (record.resolvedAtMs === null || record.terminalReason === null) return null;
	const terminal = {
		...common,
		resolvedAtMs: record.resolvedAtMs,
		reason: record.terminalReason
	};
	if (record.status === "allowed") {
		if (record.decision !== "allow-once" && record.decision !== "allow-always") return null;
		return {
			...terminal,
			decision: record.decision
		};
	}
	if (record.status === "denied") return {
		...terminal,
		decision: "deny"
	};
	return terminal;
}
//#endregion
export { projectOperatorApprovalSnapshot as t };
