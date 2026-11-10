import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as hasSqliteCommitReceiptCoverage } from "./sqlite-commit-receipt-DafgyYOc.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
//#region src/gateway/worker-environments/local-workspace-publication.ts
function isRow(value) {
	return isRecord(value) && [
		"worktree_id",
		"agent_id",
		"session_key",
		"session_id",
		"projection_path",
		"base_commit",
		"source_paths_json"
	].every((key) => typeof value[key] === "string") && [
		"lifecycle_revision",
		"baseline_json",
		"baseline_ref",
		"pending_ref",
		"pending_target",
		"journal_json",
		"paused_runtimes_json"
	].every((key) => value[key] === null || typeof value[key] === "string") && (value.journal_pack === null || value.journal_pack instanceof Uint8Array) && typeof value.created_at_ms === "number" && typeof value.revision === "number";
}
const localWorkspacePublication = createStateDomainPublication({
	domain: "local-workspace",
	keyOf: (value) => value.worktree_id,
	isValue: isRow
});
function readLocalWorkspaceCommit(value, operationId, id) {
	if (!isRecord(value) || value.operationId !== operationId || !isRecord(value.receipt)) throw new Error("Local workspace has no committed receipt");
	const receipt = value.receipt;
	if (!isRecord(receipt.source) || typeof receipt.source.identity !== "string" || typeof receipt.source.incarnation !== "string" || !hasSqliteCommitReceiptCoverage(receipt, {
		source: {
			identity: receipt.source.identity,
			incarnation: receipt.source.incarnation
		},
		domain: "local-workspace",
		keys: [id]
	}) || !(receipt.facts instanceof Map)) throw new Error("Local workspace commit coverage is incomplete");
	const fact = receipt.facts.get(id);
	if (isRecord(fact) && fact.kind === "absent") return;
	if (isRecord(fact) && fact.kind === "postimage" && isRow(fact.value) && fact.value.worktree_id === id) return Object.freeze(fact.value);
	throw new Error("Local workspace committed row is invalid");
}
//#endregion
export { readLocalWorkspaceCommit as n, localWorkspacePublication as t };
