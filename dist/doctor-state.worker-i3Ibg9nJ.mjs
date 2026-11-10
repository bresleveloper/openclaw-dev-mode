import { s as asFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as SqliteSnapshotCleanupError } from "./sqlite-readonly-location-cleanup-zmu6YCue.mjs";
import { i as prepareSqliteReadOnlyLocationSync } from "./sqlite-snapshot-source-DQdkM3YQ.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as openOpenClawStateReadConnection } from "./openclaw-state-db-read-connection-D53a_-IZ.mjs";
import { f as readRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
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
//#region src/commands/doctor-state.worker.ts
const doctorOperations = { "doctor.databaseBloat": (_input, { stateOptions }) => readSqliteDatabaseBloat(stateOptions()) };
//#endregion
export { doctorOperations };
