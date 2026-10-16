import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { f as DuplicateAgentError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as readLegacyMigrationReceiptFromDatabase } from "./state-migrations.receipts-gEcgM3Aq.mjs";
//#region src/state/agent-deletion-journal-recovery.kernel.ts
const AGENT_DELETION_RECOVERY_SOURCE_KEY = "agent-deletion-journal-reconstruction";
function readReport(database) {
	const receipt = readLegacyMigrationReceiptFromDatabase(database.db, AGENT_DELETION_RECOVERY_SOURCE_KEY);
	if (!receipt) return;
	const report = JSON.parse(receipt.reportJson);
	if (!isRecord(report) || typeof report.description !== "string" || !Array.isArray(report.held)) throw new Error("Invalid agent deletion journal reconstruction receipt.");
	const held = report.held.map((entry) => {
		if (!isRecord(entry) || typeof entry.agentId !== "string" || entry.agentId !== normalizeAgentId(entry.agentId) || typeof entry.path !== "string" || !entry.path.trim()) throw new Error("Invalid agent database hold in deletion journal reconstruction receipt.");
		return {
			agentId: entry.agentId,
			path: entry.path
		};
	});
	return {
		description: report.description,
		held
	};
}
function decodeHolds(database, held) {
	return held.map((entry) => ({
		agentId: entry.agentId,
		path: resolveOpenClawRegisteredAgentDatabasePath(database.path, entry.path)
	}));
}
/** Read recovery facts from this exact shared-state generation without opening another database. */
function readAgentDeletionRecoveryHolds(database) {
	return decodeHolds(database, readReport(database)?.held ?? []);
}
function assertAgentDeletionRecoveryHoldPredicate(database, predicate) {
	if (predicate?.applies && readAgentDeletionRecoveryHolds(database).some((entry) => entry.agentId === predicate.agentId && !predicate.held.some((previous) => previous.agentId === entry.agentId && previous.path === entry.path))) throw new DuplicateAgentError(`Agent ${predicate.agentId} has held databases. Restore its original agentDir and session.store configuration, then run agents add explicitly to restore the preserved store.`);
}
//#endregion
export { readReport as a, readAgentDeletionRecoveryHolds as i, assertAgentDeletionRecoveryHoldPredicate as n, decodeHolds as r, AGENT_DELETION_RECOVERY_SOURCE_KEY as t };
