import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-CPS8QEIp.mjs";
import { i as tableExists } from "./openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { n as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-BPapZs5n.mjs";
import { l as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as openOpenClawStateReadConnection } from "./openclaw-state-db-read-connection-C62_-Nv8.mjs";
import { u as readRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { c as validateSkillProposalRecord } from "./store-record-CSGbu9Vk.mjs";
import { r as readAppliedSkillProposalEvents } from "./store-sqlite-event-cIKxZIdh.mjs";
import fs from "node:fs";
//#region src/commands/doctor-db-bloat.read.ts
function readSqliteBloatStats(pathname) {
	let fileBytes;
	try {
		fileBytes = fs.statSync(pathname, { throwIfNoEntry: false })?.size ?? 0;
	} catch {
		return null;
	}
	if (fileBytes <= 0) return null;
	let connection;
	try {
		connection = openOpenClawStateReadConnection(pathname, prepareSqliteReadOnlyLocationSync(pathname));
		const db = connection.database.db;
		const pageSize = readPragmaNumber(db, "page_size") ?? 4096;
		const freelistCount = readPragmaNumber(db, "freelist_count") ?? 0;
		const autoVacuum = readPragmaNumber(db, "auto_vacuum") ?? 0;
		return {
			fileBytes,
			freeBytes: freelistCount * pageSize,
			incrementalAutoVacuum: autoVacuum === 2
		};
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError) throw error;
		return null;
	} finally {
		connection?.close();
	}
}
function readPragmaNumber(db, pragma) {
	const row = db.prepare(`PRAGMA ${pragma}`).get();
	return asFiniteNumber(row?.[pragma]) ?? null;
}
function readSqliteDatabaseBloat(params) {
	const results = [];
	const stateStats = readSqliteBloatStats(params.path);
	if (stateStats) results.push({
		label: "state DB",
		stats: stateStats
	});
	const registered = withArtifactPreservingStateReads(() => readRegisteredAgentDatabases(params, false));
	for (const entry of registered) {
		const stats = readSqliteBloatStats(entry.path);
		if (stats) results.push({
			label: `agent DB (${entry.agentId})`,
			stats
		});
	}
	return results;
}
//#endregion
//#region src/commands/doctor-skill-workshop-read.kernel.ts
function readWorkshopMigrationRecordsInDatabase(database, includeEvents) {
	let records = [];
	let appliedEvents = [];
	if (tableExists(database, "skill_workshop_proposals")) {
		const kysely = getNodeSqliteKysely(database);
		records = executeSqliteQuerySync(database, kysely.selectFrom("skill_workshop_proposals").select(["record_json", "owner_agent_id"])).rows.flatMap((row) => {
			try {
				const parsed = validateSkillProposalRecord(JSON.parse(row.record_json));
				return parsed.ok ? [{
					record: parsed.value,
					ownerAgentId: row.owner_agent_id
				}] : [];
			} catch {
				return [];
			}
		});
		if (includeEvents && tableExists(database, "skill_workshop_proposal_events")) appliedEvents = readAppliedSkillProposalEvents(database);
	}
	return {
		records,
		appliedEvents
	};
}
//#endregion
//#region src/commands/doctor-state.worker.ts
const doctorOperations = {
	"doctor.databaseBloat": (_input, { stateOptions }) => readSqliteDatabaseBloat(stateOptions()),
	"doctor.workshopMigrationRecords.read": (input, { stateOptions }) => withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readWorkshopMigrationRecordsInDatabase(db, input.includeEvents), stateOptions())
};
//#endregion
export { doctorOperations };
