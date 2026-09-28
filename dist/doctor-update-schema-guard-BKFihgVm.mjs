import { t as safeParseJson } from "./json-coercion-C7YSvZ9t.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-f6PhkiZS.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-CFxglP-_.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-BO6jRFcG.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as prepareSqliteReadOnlyLocation } from "./sqlite-snapshot-source-Bu0_ELYu.mjs";
import { i as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-C6femVez.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { L as readStateSchemaPublicationBlocker } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "./openclaw-state-db-doctor-schema-Cy4xw-oI.mjs";
import { t as UpdateSchemaRefusalError } from "./openclaw-update-schema-refusal-CIfR48BB.mjs";
import { r as UpdateRunRecordSchema } from "./update-run-schema-BIZkdmqf.mjs";
import { r as formatCliJsonFailure } from "./failure-output-Cct-llrO.mjs";
import { u as isUpdatePackageSwapInProgress } from "./update-phase-DiVB4MDN.mjs";
import "./update-post-core-context-B2x24New.mjs";
import { t as prepareDoctorDatabasePreflight } from "./doctor-database-preflight-CyL9CbCh.mjs";
import { n as recordUpdateDoctorRefusal, r as resolveUpdateDoctorGitRecovery } from "./doctor-update-refusal-DrRuRaL_.mjs";
import { statSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-update-schema-guard.ts
function sameSnapshotFile(left, right) {
	return left.dev !== 0 && left.ino !== 0 && left.dev === right.dev && left.ino === right.ino;
}
async function readDrivingUpdater() {
	const snapshot = await prepareSqliteReadOnlyLocation(resolveOpenClawStateSqlitePath(), { preserveSourceArtifacts: true });
	try {
		const database = openNodeSqliteDatabase(snapshot.location, { readOnly: true });
		let closeSchemaReadAdmission;
		try {
			closeSchemaReadAdmission = openDoctorStateSchemaReadAdmission(database);
			const blocker = readStateSchemaPublicationBlocker(database);
			if (!blocker) return;
			const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("update_runs").select(["status", "steps_json"]).where("run_id", "=", blocker.runId));
			const steps = UpdateRunRecordSchema.shape.steps.safeParse(row ? safeParseJson(row.steps_json) : []);
			const stepStatus = (name) => steps.success ? steps.data.findLast((step) => step.step === name)?.status : void 0;
			return {
				runId: blocker.runId,
				version: blocker.updaterVersion,
				canDeferStateSchema: tableExists(database, "config_machine_state"),
				earlyDoctorRunning: row?.status === "running" && stepStatus("openclaw doctor") === "in_progress",
				postCoreStarted: row?.status === "running" && stepStatus("openclaw doctor") === "completed" && stepStatus("post-update verification") === "in_progress"
			};
		} finally {
			try {
				closeSchemaReadAdmission?.();
			} finally {
				clearNodeSqliteKyselyCacheForDatabase(database);
				database.close();
			}
		}
	} finally {
		await snapshot.cleanupAsync();
	}
}
/** Prepare reusable fleet facts and refuse before CLI bootstrap or Doctor can write state. */
async function guardUpdateDoctorSchemaUpgrade(options) {
	if (process.env.OPENCLAW_UPDATE_IN_PROGRESS !== "1") return;
	const schemas = options.schemas ?? await prepareDoctorDatabasePreflight();
	if (!schemas.pendingMigrations?.length) return schemas;
	let updater;
	try {
		updater = await readDrivingUpdater();
	} catch {}
	if (!updater) return schemas;
	const blockedMigrations = schemas.pendingMigrations.filter((database) => database.kind === "agent" || !updater.canDeferStateSchema);
	if (blockedMigrations.length === 0) return schemas;
	const postCoreRecovery = {
		message: "The update has already committed its package. Complete Doctor repair with the installed compatible build before restarting the Gateway; package rollback cannot undo migrated state.",
		commands: ["openclaw doctor --fix", "openclaw gateway start"]
	};
	const recovery = updater.postCoreStarted ? postCoreRecovery : await resolveUpdateDoctorGitRecovery();
	if (updater.canDeferStateSchema && blockedMigrations.every((entry) => entry.kind === "agent")) {
		const capturePending = () => blockedMigrations.map((database) => ({
			database,
			identity: statSync(database.path)
		}));
		const coverageRefusal = (uncovered, detail) => new UpdateSchemaRefusalError(uncovered, updater.version, {
			targetVersion: VERSION,
			cause: /* @__PURE__ */ new Error(`Missing recoverable canonical backup coverage: ${detail}`),
			recovery
		});
		const authority = options.postCoreSchemaRepair;
		const maintenance = getOpenClawDatabaseMaintenanceScope();
		if (authority?.runId === updater.runId && updater.postCoreStarted && maintenance?.ownsSchemaMaintenance) {
			const pending = capturePending();
			const assertCurrent = () => {
				authority.assertCurrent();
				maintenance.assertAdmission();
				const changed = pending.filter(({ database, identity }) => {
					const current = statSync(database.path, { throwIfNoEntry: false });
					return !current?.isFile() || !sameSnapshotFile(identity, current);
				});
				if (changed.length) throw coverageRefusal(changed.map(({ database }) => database), "a pending agent database changed physical identity.");
			};
			assertCurrent();
			const [{ createBackupArchive }, { verifyBackupArchive }, { resolveUpdateCaptureRoot }] = await Promise.all([
				import("./backup-create-D6mS4z57.mjs"),
				import("./backup-verify-CDR36X2Y.mjs"),
				import("./update-capture-paths-ChSKt6cr.mjs")
			]);
			assertCurrent();
			let snapshotFacts = [];
			const backup = await createBackupArchive({
				output: path.join(resolveUpdateCaptureRoot(resolveStateDir()), `agent-schema-${updater.runId}-${randomUUID()}.tar.gz`),
				includeWorkspace: false,
				onSqliteSnapshots: (facts) => {
					snapshotFacts = facts;
				}
			});
			postCoreRecovery.message += ` Archive retained for inspection at ${backup.archivePath}.`;
			assertCurrent();
			const requiredSnapshots = [];
			const uncovered = pending.filter(({ database, identity }) => {
				const fact = snapshotFacts.find((snapshot) => snapshot.role === "agent" && snapshot.agentId === database.agentId && sameSnapshotFile(identity, snapshot));
				if (!fact) return true;
				requiredSnapshots.push(fact);
				return false;
			});
			if (uncovered.length) throw coverageRefusal(uncovered.map(({ database }) => database), `the retained archive at ${backup.archivePath} has no captured canonical image for these agent databases.`);
			await verifyBackupArchive(backup.archivePath, requiredSnapshots);
			assertCurrent();
			const current = await readDrivingUpdater();
			assertCurrent();
			if (current?.runId !== updater.runId || !current.postCoreStarted) throw new UpdateSchemaRefusalError(blockedMigrations, updater.version, {
				targetVersion: VERSION,
				recovery: postCoreRecovery,
				cause: /* @__PURE__ */ new Error(`Post-core admission changed; recovery backup remains at ${backup.archivePath}.`)
			});
			maintenance.addAgentSchemaMigrationCheck((migration) => {
				authority.assertCurrent();
				const identity = statSync(migration.path, { throwIfNoEntry: false });
				if (!identity?.isFile() || !requiredSnapshots.some((fact) => fact.role === "agent" && fact.agentId === migration.agentId && sameSnapshotFile(identity, fact))) throw coverageRefusal([{
					kind: "agent",
					...migration
				}], "agent database physical identity changed or has no verified snapshot before schema migration.");
			});
			(options.runtime ?? defaultRuntime).log(`Verified agent-schema recovery backup retained at ${backup.archivePath}.`);
			return schemas;
		}
		if (!recovery && updater.earlyDoctorRunning && !updater.postCoreStarted && isUpdatePackageSwapInProgress(process.env) && process.env.OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE === "1" && process.env["OPENCLAW_UPDATE_POST_CORE"] !== "1" && process.env.OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART === "1" && process.env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR === "0" && process.env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION === "0" && process.env.OPENCLAW_SERVICE_REPAIR_POLICY === "external") {
			const pending = capturePending();
			const registered = schemas.agentDatabaseMigrationDiscovery?.registeredAgentDatabases ?? [];
			const uncovered = pending.filter(({ database, identity }) => !registered.some((entry) => {
				if (entry.agentId !== database.agentId) return false;
				const current = statSync(entry.path, { throwIfNoEntry: false });
				return current?.isFile() && sameSnapshotFile(identity, current);
			}));
			if (uncovered.length) throw coverageRefusal(uncovered.map(({ database }) => database), "these pending agent databases have no registered canonical snapshot owner.");
			return {
				...schemas,
				updateSchemaRehearsal: {
					runId: updater.runId,
					updaterVersion: updater.version
				}
			};
		}
	}
	const error = new UpdateSchemaRefusalError(blockedMigrations, updater.version, {
		targetVersion: VERSION,
		recovery
	});
	if (recovery) recordUpdateDoctorRefusal(error.message);
	if (options.json) {
		const runtime = options.runtime ?? defaultRuntime;
		writeRuntimeJson(runtime, formatCliJsonFailure(error));
		exitCliAfterOutput(runtime, 1);
	}
	throw error;
}
/** Complete a private CLI validation before bootstrap can reach any live writer. */
async function preflightUpdateDoctorCli(options) {
	const schemas = await guardUpdateDoctorSchemaUpgrade(options);
	if (schemas?.updateSchemaRehearsal) {
		await rehearseDeferredUpdateDoctorSchema(schemas);
		exitCliAfterOutput(defaultRuntime, 0);
	}
	return schemas;
}
/** The shipped package validator may still roll back; it must never reach live Doctor writers. */
async function rehearseDeferredUpdateDoctorSchema(schemas, runtime = defaultRuntime) {
	const selected = schemas.updateSchemaRehearsal;
	if (!selected) throw new Error("Missing legacy update schema rehearsal admission.");
	const [{ createConfigIO }, { resolveOpenClawPackageRoot }, { resolveUpdateInstallKind }, { prepareUpdateCandidateRehearsal }, { resolveGatewayInstallEntrypoint }, { runUtf8CommandWithTimeout }, { resolveSqliteInspectionBudget }] = await Promise.all([
		import("./io-BGyCyNbl.mjs"),
		import("./openclaw-root-C6IwoLZm.mjs"),
		import("./update-check-qj0o70b1.mjs"),
		import("./update-candidate-rehearsal-Bghm1be8.mjs"),
		import("./gateway-entrypoint-q2vsKkWK.mjs"),
		import("./exec-CBexM2Ik.mjs"),
		import("./sqlite-readonly-worker-C5WaWbM2.mjs")
	]);
	const root = await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	});
	const updater = await readDrivingUpdater();
	if (!root || await resolveUpdateInstallKind(root) !== "package" || updater?.runId !== selected.runId || !updater.earlyDoctorRunning || updater.postCoreStarted) throw new UpdateSchemaRefusalError(schemas.pendingMigrations ?? [], selected.updaterVersion, {
		targetVersion: VERSION,
		cause: /* @__PURE__ */ new Error("The shipped package-validation handoff could not be verified.")
	});
	const entry = await resolveGatewayInstallEntrypoint(root);
	if (!entry) throw new Error("Candidate Doctor entrypoint is unavailable for private schema validation.");
	const snapshot = await createConfigIO({
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	const rehearsal = await prepareUpdateCandidateRehearsal({
		candidateRoot: root,
		config: snapshot.sourceConfig ?? snapshot.config,
		stateDir: resolveStateDir()
	});
	let settled = false;
	try {
		const env = {
			...rehearsal.env,
			OPENCLAW_UPDATE_IN_PROGRESS: "0"
		};
		const result = await runUtf8CommandWithTimeout([
			process.execPath,
			entry,
			"doctor",
			"--fix",
			"--non-interactive",
			"--no-workspace-suggestions"
		], {
			cwd: root,
			baseEnv: env,
			timeoutMs: resolveSqliteInspectionBudget("legacy update schema rehearsal", rehearsal.stateDir, rehearsal.snapshotCapacity.sqliteBytes).timeoutMs,
			killProcessTree: true,
			requireProcessTreeExtinction: true,
			outputCapture: {
				stdout: "discard",
				stderr: "tail"
			},
			maxOutputBytes: { stderr: 2e4 }
		});
		settled = result.cleanup === "normal";
		if (!settled) throw new Error(`Private Doctor did not settle; rehearsal retained at ${rehearsal.stateDir}.`);
		if (result.code !== 0 || result.termination !== "exit" || result.outputLimitExceeded) {
			const { redactSupportString } = await import("./diagnostic-support-redaction-Cgpdk1xY.mjs");
			throw new Error(`Private Doctor schema validation failed (${result.termination}): ${redactSupportString(result.stderr, {
				env,
				stateDir: rehearsal.stateDir
			}, { maxLength: 2e3 })}`);
		}
	} finally {
		if (settled) await rehearsal.cleanup();
	}
	const warning = `Validated schema repair on private copies for OpenClaw ${selected.updaterVersion}; live agent databases are unchanged. Repair is deferred to the fresh post-core updater.`;
	const { UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, writeUpdatePostInstallDoctorResult } = await import("./update-doctor-result-CRMlY_wJ.mjs");
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV];
	if (resultPath) await writeUpdatePostInstallDoctorResult({
		resultPath,
		result: {
			status: "ok",
			configHash: "unchanged",
			warnings: [warning]
		}
	});
	runtime.log(warning);
}
//#endregion
export { guardUpdateDoctorSchemaUpgrade, preflightUpdateDoctorCli, rehearseDeferredUpdateDoctorSchema };
