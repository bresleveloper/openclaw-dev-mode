import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { v as DuplicateAgentError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import "./session-key-CSDERtm3.mjs";
import { i as readLegacyMigrationReceiptFromDatabase } from "./state-migrations.receipts-CikBNdPu.mjs";
//#region src/state/agent-deletion-journal-recovery.kernel.ts
const AGENT_DELETION_RECOVERY_SOURCE_KEY = "agent-deletion-journal-reconstruction";
const AGENT_DELETION_RECONSTRUCTION_DESCRIPTION = "Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete.";
function parseHolds(entries) {
	return entries.map((entry) => {
		if (!isRecord(entry) || typeof entry.agentId !== "string" || entry.agentId !== normalizeAgentId(entry.agentId) || typeof entry.path !== "string" || !entry.path.trim()) throw new Error("Invalid agent database hold in deletion journal reconstruction receipt.");
		return {
			agentId: entry.agentId,
			path: entry.path
		};
	});
}
function readReport(database) {
	const receipt = readLegacyMigrationReceiptFromDatabase(database.db, AGENT_DELETION_RECOVERY_SOURCE_KEY);
	if (!receipt) return;
	const report = JSON.parse(receipt.reportJson);
	if (!isRecord(report) || typeof report.description !== "string" || !Array.isArray(report.held)) throw new Error("Invalid agent deletion journal reconstruction receipt.");
	const held = parseHolds(report.held);
	if (report.missingJournal !== void 0 && !Array.isArray(report.missingJournal)) throw new Error("Invalid missing-journal provenance in deletion journal reconstruction receipt.");
	const missingJournal = Array.isArray(report.missingJournal) ? parseHolds(report.missingJournal) : report.description === "Reconstructed the missing agent deletion journal; held databases require explicit agent restore or delete." ? held : [];
	if (missingJournal.some((entry) => !held.some((target) => target.agentId === entry.agentId && target.path === entry.path))) throw new Error("Missing-journal provenance refers to an unheld agent database.");
	return {
		...report,
		description: report.description,
		held,
		missingJournal
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
/** Only table-absence reconstruction can grant this provenance; quarantine cannot. */
function readAgentDeletionMissingJournalHolds(database) {
	return decodeHolds(database, readReport(database)?.missingJournal ?? []);
}
function assertAgentDeletionRecoveryHoldPredicate(database, predicate) {
	if (predicate?.applies) assertAgentDeletionRecoveryHoldsMatch(readAgentDeletionRecoveryHolds(database), predicate);
}
function assertAgentDeletionRecoveryHoldsMatch(held, predicate) {
	if (predicate.applies && held.some((entry) => entry.agentId === predicate.agentId && !predicate.held.some((previous) => previous.agentId === entry.agentId && previous.path === entry.path))) throw new DuplicateAgentError(`Agent ${predicate.agentId} has held databases. Restore its original agentDir and session.store configuration, then run agents add explicitly to restore the preserved store.`);
}
//#endregion
export { decodeHolds as a, readReport as c, assertAgentDeletionRecoveryHoldsMatch as i, AGENT_DELETION_RECOVERY_SOURCE_KEY as n, readAgentDeletionMissingJournalHolds as o, assertAgentDeletionRecoveryHoldPredicate as r, readAgentDeletionRecoveryHolds as s, AGENT_DELETION_RECONSTRUCTION_DESCRIPTION as t };
