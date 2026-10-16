import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { a as resolveOpenClawRegisteredAgentDatabasePath, i as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { b as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-CPAamWzU.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { u as isUpdateDoctorLintPass } from "./update-phase-BClSJ17n.mjs";
import { i as readActiveUpdateRun } from "./update-run-read.kernel-D2osBKAZ.mjs";
import { a as invalidateRegisteredAgentDatabasesMemo } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import path from "node:path";
//#region src/state/openclaw-agent-db-path-repair.ts
/** The caller retains shared-state write admission through this synchronous repair. */
function repairOpenClawAgentDatabasePathAliases(database) {
	const { db, path: pathname } = database;
	assertOpenClawStateDatabaseForMaintenance(db, { pathname });
	const active = readActiveUpdateRun(db);
	if (active) return {
		repaired: 0,
		warnings: [`Skipped agent database path repair while update ${active.runId} is in progress. Run openclaw doctor --fix after the update finishes.`]
	};
	const queries = getNodeSqliteKysely(db);
	const rows = executeSqliteQuerySync(db, queries.selectFrom("agent_databases").selectAll().orderBy("last_seen_at", "desc").orderBy("path")).rows;
	const agents = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const stored = resolveOpenClawAgentDatabaseStoredPath(pathname, resolveOpenClawRegisteredAgentDatabasePath(pathname, row.path));
		if (path.isAbsolute(stored)) continue;
		let paths = agents.get(row.agent_id);
		if (!paths) {
			paths = /* @__PURE__ */ new Map();
			agents.set(row.agent_id, paths);
		}
		const aliases = paths.get(stored) ?? [];
		aliases.push(row);
		paths.set(stored, aliases);
	}
	let repaired = 0;
	for (const [agentId, paths] of agents) for (const [stored, aliases] of paths) {
		if (!aliases.some((row) => row.path.startsWith("\\\\?\\"))) continue;
		const newest = aliases[0];
		executeSqliteQuerySync(db, queries.insertInto("agent_databases").values({
			...newest,
			path: stored
		}).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet({
			last_seen_at: newest.last_seen_at,
			schema_version: newest.schema_version,
			size_bytes: newest.size_bytes
		})));
		for (const alias of aliases) if (alias.path !== stored) executeSqliteQuerySync(db, queries.deleteFrom("agent_databases").where("agent_id", "=", agentId).where("path", "=", alias.path));
		repaired += 1;
	}
	return {
		repaired,
		warnings: []
	};
}
//#endregion
//#region src/commands/doctor-agent-database-paths.ts
/** Repair inventory aliases only before an updater captures its exact-path baseline. */
function noteDoctorAgentDatabasePathHealth(params) {
	if (!params.shouldRepair || process.platform !== "win32") return [];
	const report = runOpenClawStateWriteTransaction((database) => isUpdateDoctorLintPass(params.env) ? {
		repaired: 0,
		warnings: ["Skipped agent database path repair during update Doctor. Run openclaw doctor --fix after the update finishes."]
	} : repairOpenClawAgentDatabasePathAliases(database), { env: params.env }, { operationLabel: "doctor.agent-database-paths" });
	if (report.repaired > 0) {
		invalidateRegisteredAgentDatabasesMemo({ env: params.env });
		note(`Repaired ${report.repaired} agent database path registration(s), preserving the newest facts.`, "Doctor changes");
	}
	if (report.warnings.length > 0) note(report.warnings.join("\n"), "Doctor warnings");
	return report.warnings;
}
//#endregion
export { noteDoctorAgentDatabasePathHealth };
