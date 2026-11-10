import { t as note } from "./note-CmoIRLec.mjs";
import { n as selectDatabaseEngine, t as listDatabaseEngineStores } from "./registry-Pq69ANKA.mjs";
//#region src/commands/doctor-database-engine.ts
function collectDatabaseEngineHealthFindings(cfg) {
	if (cfg.database?.engine !== "postgres") return [];
	return [{
		checkId: "core/doctor/database-engine",
		severity: "warning",
		source: "doctor",
		path: "database.engine",
		message: "The PostgreSQL database engine is experimental. Stores without a registered PostgreSQL schema remain on SQLite.",
		fixHint: "Review the store engine selections and https://docs.openclaw.ai/reference/database-engines before using this configuration."
	}];
}
function noteDatabaseEngines(cfg) {
	const lines = listDatabaseEngineStores().map((store) => `${store.label}: ${selectDatabaseEngine(store, cfg)}`);
	for (const finding of collectDatabaseEngineHealthFindings(cfg)) lines.push("", finding.message, finding.fixHint ?? "");
	note(lines.join("\n"), "Database engines");
}
//#endregion
export { collectDatabaseEngineHealthFindings, noteDatabaseEngines };
