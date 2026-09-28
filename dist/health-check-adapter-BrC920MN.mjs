//#region src/flows/health-check-adapter.ts
function copyHealthCheck(check) {
	return { ...check };
}
function normalizeHealthCheck(check) {
	return {
		id: check.id,
		kind: check.kind,
		description: check.description,
		source: check.source,
		defaultEnabled: check.defaultEnabled,
		updateReadiness: check.updateReadiness,
		detect: (ctx, scope) => check.detect(ctx, scope),
		repair: check.repair === void 0 ? void 0 : (ctx, findings) => check.repair?.(ctx, findings) ?? Promise.resolve({ changes: [] })
	};
}
function securityAuditFindingToHealthFinding(finding) {
	const [firstDetail, ...detailLines] = finding.detail.split("\n");
	const fixHint = [...detailLines, ...finding.remediation?.split("\n") ?? []].join("\n");
	return {
		checkId: "core/doctor/security",
		requirement: finding.checkId,
		severity: finding.severity === "critical" ? "error" : finding.severity === "warn" ? "warning" : "info",
		message: `${finding.title}${firstDetail ? `: ${firstDetail}` : ""}`,
		...fixHint ? { fixHint } : {}
	};
}
//#endregion
export { normalizeHealthCheck as n, securityAuditFindingToHealthFinding as r, copyHealthCheck as t };
