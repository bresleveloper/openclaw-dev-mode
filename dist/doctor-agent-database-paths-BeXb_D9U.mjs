import { a as resolveOpenClawRegisteredAgentDatabasePath, i as resolveOpenClawAgentDatabaseStoredPath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as isPostgresSqlConnection } from "./sql-connection-DmQzXTVz.mjs";
import { t as admitSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { r as requireNativeDatabaseFile } from "./physical-facts-Cvtfrs3r.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as readMainTableList } from "./sqlite-strict-CTENSqnV.mjs";
import { a as invalidateRegisteredAgentDatabasesMemo } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { f as isUpdateDoctorLintPass } from "./update-phase-M5rvMZiC.mjs";
import { i as readActiveUpdateRun } from "./update-run-read.kernel-C7evz-Ne.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-db-path-repair.ts
/** The caller retains shared-state write admission through this synchronous repair. */
function repairOpenClawAgentDatabasePaths(database) {
	const { db, path: pathname } = database;
	if (isPostgresSqlConnection(db)) requireNativeDatabaseFile("postgres", "repair");
	assertOpenClawStateDatabaseForMaintenance(db, { pathname });
	const active = readActiveUpdateRun(db);
	if (active) return {
		repaired: 0,
		warnings: [`Skipped agent database path repair while update ${active.runId} is in progress. Run openclaw doctor --fix after the update finishes.`]
	};
	const queries = getNodeSqliteKysely(db);
	const rows = executeSqliteQuerySync(db, queries.selectFrom("agent_databases").selectAll().orderBy("last_seen_at", "desc").orderBy("path")).rows;
	const agents = /* @__PURE__ */ new Map();
	const warnings = [];
	let repaired = 0;
	for (const row of rows) {
		const stored = resolveOpenClawAgentDatabaseStoredPath(pathname, resolveOpenClawRegisteredAgentDatabasePath(pathname, row.path));
		const key = `${row.agent_id}\0${stored}`;
		const group = agents.get(key) ?? {
			stored,
			aliases: []
		};
		group.aliases.push(row);
		agents.set(key, group);
	}
	for (const { stored, aliases } of agents.values()) {
		const newest = aliases[0];
		const registeredPath = resolveOpenClawRegisteredAgentDatabasePath(pathname, newest.path);
		const name = path.basename(registeredPath).replace(/\.\d+(?=\.sqlite$)/, "");
		const sentinel = name === "(multiple).sqlite" || name === `(multiple).${newest.agent_id}.sqlite`;
		if (sentinel) try {
			const files = resolveSqliteDatabaseFilePaths(registeredPath);
			const stats = files.map((file) => fs.lstatSync(file, { throwIfNoEntry: false }));
			if ([stats[1], stats[3]].some((stat) => stat?.size)) throw new Error("database or sidecar needs inspection");
			if (stats[0]?.size) try {
				var _usingCtx$1 = _usingCtx();
				const source = _usingCtx$1.u(openNodeSqliteDatabase(resolveImmutableSqliteFileUri(registeredPath), { readOnly: true }));
				admitSqliteSchema(source);
				const query = getNodeSqliteKysely(source);
				const metadata = /* @__PURE__ */ new Set([
					"schema_meta",
					"session_key_contract",
					"memory_index_state"
				]);
				for (const { type, name: table } of readMainTableList(source)) {
					if (type === "shadow" || metadata.has(table)) continue;
					const entry = query.selectFrom(table).selectAll().limit(1);
					if (executeSqliteQuerySync(source, entry).rows.length) throw new Error("contains user rows");
				}
			} catch (_) {
				_usingCtx$1.e = _;
			} finally {
				_usingCtx$1.d();
			}
			for (const file of files) fs.rmSync(file, { force: true });
		} catch (error) {
			warnings.push(`Removed invalid agent database registration; kept ${registeredPath} for inspection (${String(error)}).`);
		}
		else {
			if (process.platform !== "win32" || path.isAbsolute(stored) || !aliases.some((row) => row.path.startsWith("\\\\?\\"))) continue;
			const canonical = {
				...newest,
				path: stored
			};
			executeSqliteQuerySync(db, queries.insertInto("agent_databases").values(canonical).onConflict((conflict) => conflict.columns(["agent_id", "path"]).doUpdateSet(canonical)));
		}
		const obsolete = aliases.map((alias) => alias.path).filter((alias) => sentinel || alias !== stored);
		executeSqliteQuerySync(db, queries.deleteFrom("agent_databases").where("agent_id", "=", newest.agent_id).where("path", "in", obsolete));
		repaired += sentinel ? aliases.length : 1;
	}
	return {
		repaired,
		warnings
	};
}
//#endregion
//#region src/commands/doctor-agent-database-paths.ts
/** Repair the inventory only before an updater captures its exact-path baseline. */
function noteDoctorAgentDatabasePathHealth(params) {
	if (!params.shouldRepair) return [];
	const report = runOpenClawStateWriteTransaction((database) => isUpdateDoctorLintPass(params.env) ? {
		repaired: 0,
		warnings: ["Skipped agent database path repair during update Doctor. Run openclaw doctor --fix to repair agent database paths."]
	} : repairOpenClawAgentDatabasePaths(database), { env: params.env }, { operationLabel: "doctor.agent-database-paths" });
	if (report.repaired > 0) {
		invalidateRegisteredAgentDatabasesMemo({ env: params.env });
		note(`Repaired ${report.repaired} agent database path registration(s).`, "Doctor changes");
	}
	if (report.warnings.length > 0) note(report.warnings.join("\n"), "Doctor warnings");
	return report.warnings;
}
//#endregion
export { noteDoctorAgentDatabasePathHealth };
