import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import { r as readFiniteSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { n as assertOpenClawStateWriteAllowed } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import "./openclaw-state-db-BtDOU_3j.mjs";
import { u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { t as DoctorMaintenanceRefusalError } from "./update-doctor-result-oZ38327j.mjs";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { n as assertDoctorSqliteMaintenancePathsNotAliased } from "./doctor-sqlite-maintenance-lock-DU0BUhr6.mjs";
import { n as compactDoctorSqliteFile, t as DoctorSqliteCompactionDeferredError } from "./doctor-sqlite-compact-Dy6gYKlq.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { setImmediate } from "node:timers/promises";
//#region src/commands/doctor-sqlite-reclamation.ts
var ReclamationDeferred = class extends Error {};
function pragmaNumber(database, name) {
	const value = readFiniteSqliteNumber(database.prepare(`PRAGMA ${name}`).get()?.[name]);
	if (value === void 0 || value < 0) throw new Error(`SQLite PRAGMA ${name} returned an invalid result.`);
	return value;
}
/** VACUUM may place its temporary database on a different volume from its WAL. */
function assertVacuumSpace(sqlitePath, bytes, env) {
	const databaseDirectory = path.dirname(sqlitePath);
	const candidates = /* @__PURE__ */ new Set([
		databaseDirectory,
		...[
			env.SQLITE_TMPDIR,
			env.TMPDIR,
			env.TMP,
			env.TEMP,
			os.tmpdir()
		].filter((candidate) => Boolean(candidate?.trim())),
		...process.platform === "win32" ? [] : [
			"/var/tmp",
			"/usr/tmp",
			"/tmp",
			process.cwd()
		]
	]);
	const devices = /* @__PURE__ */ new Set();
	const required = bytes * 2 + 67108864;
	for (const candidate of candidates) {
		let stat;
		try {
			stat = fs.statSync(candidate, { bigint: true });
			if (!stat.isDirectory()) continue;
			fs.accessSync(candidate, fs.constants.W_OK | fs.constants.X_OK);
		} catch (cause) {
			if (candidate === databaseDirectory) throw new ReclamationDeferred("the database directory is not writable", { cause });
			continue;
		}
		if (stat.dev > 0n && devices.has(stat.dev)) continue;
		const space = tryReadDiskSpace(candidate);
		if (!space || space.availableBytes < required) throw new ReclamationDeferred(`${formatDiskSpaceBytes(required)} of temporary space is needed near ${candidate}; ${space ? `${formatDiskSpaceBytes(space.availableBytes)} available` : "free space could not be measured"}`);
		devices.add(stat.dev);
	}
	if (devices.size === 0) throw new ReclamationDeferred("database and SQLite temporary storage could not be verified");
}
/** The existing Doctor owner calls this only after its readers and writers have drained. */
async function enableDoctorSqliteReclamation(params) {
	const targets = [{
		path: resolveOpenClawStateSqlitePath(params.env),
		agentId: void 0
	}, ...params.agents.map((agent) => ({
		path: agent.path,
		agentId: agent.agentId
	}))];
	const warnings = [];
	const visited = /* @__PURE__ */ new Set();
	const assertAdmission = () => {
		params.signal.throwIfAborted();
		params.assertCurrent();
	};
	for (const target of targets) {
		await setImmediate();
		assertAdmission();
		const sqlitePath = path.resolve(target.path);
		if (visited.has(sqlitePath)) continue;
		visited.add(sqlitePath);
		const identity = fs.lstatSync(sqlitePath, {
			bigint: true,
			throwIfNoEntry: false
		});
		if (!identity) continue;
		const assertIdentity = () => {
			const current = fs.lstatSync(sqlitePath, {
				bigint: true,
				throwIfNoEntry: false
			});
			if (!current?.isFile() || current.dev !== identity.dev || current.ino !== identity.ino) throw new ReclamationDeferred("the database file identity changed");
			try {
				assertDoctorSqliteMaintenancePathsNotAliased("automatic SQLite reclamation", resolveSqliteDatabaseFilePaths(sqlitePath), [path.parse(sqlitePath).root]);
			} catch (cause) {
				throw new ReclamationDeferred(formatErrorMessage(cause), { cause });
			}
		};
		const validate = (database) => {
			assertAdmission();
			assertIdentity();
			if (target.agentId === void 0) {
				assertOpenClawStateWriteAllowed({
					database,
					databasePath: sqlitePath,
					env: params.env
				});
				assertOpenClawStateDatabaseForMaintenance(database, { pathname: sqlitePath });
			} else assertOpenClawAgentDatabaseForMaintenance(database, {
				pathname: sqlitePath,
				agentId: target.agentId
			});
		};
		let admitted = false;
		let verified = false;
		try {
			assertIdentity();
			const database = openNodeSqliteDatabase(sqlitePath, { readOnly: true });
			let requiresConversion = false;
			try {
				requiresConversion = pragmaNumber(database, "auto_vacuum") === 0;
				if (requiresConversion) {
					validate(database);
					assertVacuumSpace(sqlitePath, Math.max(Number(identity.size), pragmaNumber(database, "page_count") * pragmaNumber(database, "page_size")), params.env);
				}
			} finally {
				database.close();
			}
			assertAdmission();
			assertIdentity();
			if (!requiresConversion) continue;
			if (target.agentId !== void 0) invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(sqlitePath);
			params.log(`Enabling incremental SQLite reclamation once: ${sqlitePath}`);
			const result = compactDoctorSqliteFile({
				sqlitePath,
				requireExisting: true,
				busyTimeoutMs: 0,
				validateBeforeMutation(writable) {
					validate(writable);
					admitted = true;
				},
				afterSuccess: assertIdentity
			});
			if (result.after.autoVacuum !== 2) throw new Error("SQLite compaction did not enable incremental reclamation.");
			verified = true;
			params.assertCurrent();
			params.log(`Enabled incremental SQLite reclamation: ${sqlitePath}; reclaimed ${formatDiskSpaceBytes(result.reclaimedBytes)}; integrity verified.`);
		} catch (error) {
			if (admitted && !verified && !(error instanceof DoctorSqliteCompactionDeferredError)) {
				let cause = error;
				try {
					assertAdmission();
				} catch (admissionError) {
					cause = new AggregateError([error, admissionError], "SQLite reclamation failed during interruption.");
				}
				throw new DoctorMaintenanceRefusalError(`SQLite reclamation did not finish verified for ${sqlitePath}: ${formatErrorMessage(error)}. Inspect this database before restarting the Gateway.`, {
					kind: "data-at-risk",
					reason: "incomplete-migration"
				}, { cause });
			}
			assertAdmission();
			if (!(error instanceof ReclamationDeferred) && !(error instanceof DoctorSqliteCompactionDeferredError)) throw error;
			const command = target.agentId === void 0 ? "openclaw doctor --state-sqlite compact" : "openclaw doctor --session-sqlite compact --session-sqlite-all-agents";
			warnings.push(`Automatic SQLite reclamation deferred for ${sqlitePath}: ${error.message}. The update can continue; after resolving this condition, run ${command} while the Gateway is stopped.`);
		}
	}
	await setImmediate();
	assertAdmission();
	return { warnings };
}
//#endregion
export { enableDoctorSqliteReclamation };
