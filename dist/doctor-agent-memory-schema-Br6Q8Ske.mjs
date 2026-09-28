import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { r as migrateOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-D--tx1ak.mjs";
import { a as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { h as withAgentDatabaseMaintenanceLease } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as listOpenClawRegisteredAgentDatabases, r as invalidateRegisteredAgentDatabasesMemo } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { i as withDoctorSqliteMaintenanceLock, t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-7TRGuHpb.mjs";
import fs from "node:fs";
//#region src/commands/doctor-agent-memory-schema.ts
const LEGACY_MEMORY_RECALL_METADATA_COLUMNS = [
	"importance",
	"triggers",
	"project_key"
];
const LEGACY_MEMORY_PROVENANCE_TRIGGER = "memory_index_chunk_provenance_after_insert";
const MEMORY_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
function readMemoryRecallMetadataMigrationState(database) {
	const rows = database.prepare("PRAGMA table_info(memory_index_chunks)").all();
	if (rows.length === 0) return null;
	const columns = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return {
		columns: LEGACY_MEMORY_RECALL_METADATA_COLUMNS.filter((column) => columns.has(column)),
		hasMetadataTable: Boolean(database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(MEMORY_RECALL_METADATA_TABLE)),
		hasProvenanceTrigger: Boolean(database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = ?").get(LEGACY_MEMORY_PROVENANCE_TRIGGER))
	};
}
function inspectAgentMemoryRecallMetadataMigration(pathname) {
	if (!fs.lstatSync(pathname).isFile()) throw new Error(`OpenClaw agent database is not a regular file: ${pathname}`);
	const database = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		return readMemoryRecallMetadataMigrationState(database);
	} finally {
		database.close();
	}
}
function needsAgentMemorySchemaMaintenance(env) {
	try {
		invalidateRegisteredAgentDatabasesMemo({ env });
		return listOpenClawRegisteredAgentDatabases({
			env,
			includeIncompatibleSchemaVersions: true
		}).some((entry) => {
			if (readAgentDatabaseAdmissionRefusal(entry.agentId, { env })) return false;
			const state = inspectAgentMemoryRecallMetadataMigration(entry.path);
			return Boolean(state && (state.columns.length > 0 || state.hasProvenanceTrigger));
		});
	} catch {
		return true;
	}
}
/** Move the unreleased inline metadata shape into rollback-safe additive tables. */
async function repairDoctorAgentMemorySchemas(options, maintenance) {
	const env = options.env ?? process.env;
	maintenance.assertOwned();
	invalidateRegisteredAgentDatabasesMemo({ env });
	const repaired = [];
	const warnings = [];
	let registered;
	try {
		registered = listOpenClawRegisteredAgentDatabases({
			env,
			includeIncompatibleSchemaVersions: true
		});
	} catch (error) {
		return {
			repaired,
			warnings: [`Could not inspect registered agent databases: ${formatErrorMessage(error)}`]
		};
	}
	for (const entry of registered) {
		if (readAgentDatabaseAdmissionRefusal(entry.agentId, { env })) continue;
		maintenance.assertOwned();
		try {
			const before = inspectAgentMemoryRecallMetadataMigration(entry.path);
			if (!before || before.columns.length === 0 && !before.hasProvenanceTrigger) continue;
			closeOpenClawAgentDatabaseByPath(entry.path);
			await migrateOpenClawAgentDatabaseForMaintenance({
				agentId: entry.agentId,
				pathname: entry.path
			}, maintenance);
			maintenance.assertOwned();
			const after = inspectAgentMemoryRecallMetadataMigration(entry.path);
			if (after === null || after.columns.length > 0 || after.hasProvenanceTrigger || !after.hasMetadataTable) throw new Error("memory recall metadata did not converge on rollback-safe additive storage");
			repaired.push({
				agentId: entry.agentId,
				columns: before.columns,
				path: entry.path,
				removedTrigger: before.hasProvenanceTrigger
			});
		} catch (error) {
			warnings.push(`Agent ${entry.agentId} database ${shortenHomePath(entry.path)}: ${formatErrorMessage(error)}`);
		}
	}
	return {
		repaired,
		warnings
	};
}
async function noteDoctorAgentMemorySchemaHealth(params, deps = {}) {
	const writeNote = deps.note ?? note;
	if (!params.shouldRepair) return {
		repaired: [],
		warnings: []
	};
	let report;
	try {
		report = await withDoctorSqliteMaintenanceLock({
			env: params.env,
			operation: "agent memory schema repair",
			run: () => {
				if (!needsAgentMemorySchemaMaintenance(params.env ?? process.env)) return {
					repaired: [],
					warnings: []
				};
				return withAgentDatabaseMaintenanceLease({ env: params.env }, (maintenance) => repairDoctorAgentMemorySchemas({ env: params.env }, maintenance));
			}
		});
	} catch (error) {
		if (!(error instanceof DoctorSqliteMaintenanceLockUnavailableError)) throw error;
		report = {
			repaired: [],
			warnings: [error.message]
		};
	}
	if (report.repaired.length > 0) writeNote(report.repaired.map((repair) => {
		const changes = [repair.columns.length > 0 ? `moved ${repair.columns.map((column) => `memory_index_chunks.${column}`).join(", ")} to additive storage` : null, repair.removedTrigger ? `removed ${LEGACY_MEMORY_PROVENANCE_TRIGGER}` : null].filter((change) => change !== null);
		return `- Agent ${repair.agentId}: ${changes.join("; ")} (${shortenHomePath(repair.path)}).`;
	}).join("\n"), "Doctor changes");
	if (report.warnings.length > 0) writeNote(report.warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	return report;
}
//#endregion
export { noteDoctorAgentMemorySchemaHealth };
