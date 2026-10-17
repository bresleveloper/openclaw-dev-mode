import { t as safeParseJson } from "../json-coercion-pfKbZnCJ.mjs";
import { a as writeRuntimeJson, r as defaultRuntime } from "../runtime-DlO3PTAd.mjs";
import { r as resolveStateDir } from "../state-dir-BHJORNly.mjs";
import "../paths-DGIwWbpu.mjs";
import { t as UpdateSchemaRefusalError } from "../openclaw-update-schema-refusal-M64rViod.mjs";
import { r as formatCliJsonFailure } from "../failure-output-gtb9zaTk.mjs";
import { t as exitCliAfterOutput } from "../one-shot-exit-Bd4757D_.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "../kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "../kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "../node-sqlite-XIcwmOrl.mjs";
import { i as tableExists } from "../openclaw-state-db-schema-helpers-BlZefrPy.mjs";
import { t as VERSION } from "../version-BJGPJZu6.mjs";
import { l as getOpenClawDatabaseMaintenanceScope } from "../openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "../openclaw-state-db.paths-DfifnSGp.mjs";
import { t as prepareSqliteReadOnlyLocation } from "../sqlite-snapshot-source-BPapZs5n.mjs";
import "../update-post-core-context-B2x24New.mjs";
import { i as resolveUpdateRehearsalRoot } from "../update-rehearsal-paths-DTVdt0cq.mjs";
import { n as readUpdateRunDriver, r as sameUpdateRunDriver, t as inspectUpdateRunDriver } from "../update-run-driver-k0LVIIq0.mjs";
import { r as UpdateRunRecordSchema } from "../update-run-schema-DOichlUj.mjs";
import { n as openDoctorStateSchemaReadAdmission } from "../openclaw-state-db-doctor-schema-BlUz8kWR.mjs";
import { st as readStateSchemaPublicationBlocker } from "../openclaw-state-db-fast-path-CPAamWzU.mjs";
import { t as prepareDoctorDatabasePreflight } from "../doctor-database-preflight-DQeccfC9.mjs";
import { t as createDoctorRehearsalDatabaseCoverage } from "../doctor-rehearsal-databases-jWB-feGw.mjs";
import { n as recordUpdateDoctorRefusal, r as resolveUpdateDoctorGitRecovery } from "../doctor-update-refusal-CuBUilWt.mjs";
import { d as isUpdatePackageSwapInProgress } from "../update-phase-BClSJ17n.mjs";
import { lstatSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-update-schema-guard.ts
function sameSnapshotFile(left, right) {
	return left.dev !== 0 && left.ino !== 0 && left.dev === right.dev && left.ino === right.ino;
}
async function readDrivingUpdater(sharedContentUpgrade = false) {
	const snapshot = await prepareSqliteReadOnlyLocation(resolveOpenClawStateSqlitePath(), { preserveSourceArtifacts: true });
	try {
		const database = openNodeSqliteDatabase(snapshot.location, { readOnly: true });
		let closeSchemaReadAdmission;
		try {
			closeSchemaReadAdmission = openDoctorStateSchemaReadAdmission(database);
			if (sharedContentUpgrade && process.platform === "win32" && tableExists(database, "update_runs")) {
				const rows = executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("update_runs").select([
					"run_id",
					"before_json",
					"origin_json",
					"steps_json"
				]).where("status", "=", "running").orderBy("run_id")).rows;
				for (const row of rows) {
					const before = UpdateRunRecordSchema.shape.before.safeParse(safeParseJson(row.before_json));
					if (!before.success || before.data.version !== "2026.9.4") continue;
					const origin = UpdateRunRecordSchema.shape.origin.safeParse(safeParseJson(row.origin_json));
					const drivers = origin.success ? [...origin.data.driver ? [origin.data.driver] : [], ...origin.data.previousDrivers ?? []] : [];
					const steps = UpdateRunRecordSchema.shape.steps.safeParse(safeParseJson(row.steps_json));
					if (steps.success && !steps.data.some((step) => step.step === "driver:identity-unavailable") && drivers.length > 0 && drivers.every((driver) => inspectUpdateRunDriver(driver) === "dead")) continue;
					return {
						runId: row.run_id,
						version: before.data.version,
						canDeferStateSchema: false,
						earlyDoctorRunning: false,
						postCoreStarted: false,
						requiresReadableSharedContent: true
					};
				}
			}
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
	const rehearsal = options.statePublicationOnly ? void 0 : createDoctorRehearsalDatabaseCoverage(process.env);
	const schemas = options.schemas ?? await prepareDoctorDatabasePreflight(options.statePublicationOnly ? { scope: "state" } : void 0);
	rehearsal?.assertCurrent();
	if (!schemas.pendingMigrations?.length) return schemas;
	rehearsal?.admit([...schemas.pendingMigrations.filter((database) => database.kind === "agent").map((database) => database.path), ...schemas.agentDatabaseMigrationDiscovery?.discovery.targets.map((database) => database.path) ?? []]);
	let updater;
	const sharedContentUpgrade = (options.entry !== void 0 || options.statePublicationOnly === true) && schemas.pendingMigrations.some((database) => database.kind === "state" && database.supportedVersion > 17);
	try {
		updater = await readDrivingUpdater(sharedContentUpgrade);
	} catch {}
	rehearsal?.assertCurrent();
	if (options.entry === "package-lifecycle" && !updater?.requiresReadableSharedContent) return schemas;
	if (!updater) return schemas;
	const blockedMigrations = schemas.pendingMigrations.filter((database) => updater.requiresReadableSharedContent ? database.kind === "state" && database.supportedVersion > 17 : database.kind === "agent" ? !options.statePublicationOnly && !rehearsal?.excludes(database.path) : !updater.canDeferStateSchema);
	rehearsal?.assertCurrent();
	if (blockedMigrations.length === 0) return schemas;
	const postCoreRecovery = {
		message: "The update has already committed its package. Complete Doctor repair with the installed compatible build before restarting the Gateway; package rollback cannot undo migrated state.",
		commands: ["openclaw doctor --fix", "openclaw gateway start"]
	};
	const recovery = updater.postCoreStarted ? postCoreRecovery : await resolveUpdateDoctorGitRecovery();
	rehearsal?.assertCurrent();
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
				import("../backup-create-Bj7XL5w0.mjs"),
				import("../backup-verify-CkQonlxk.mjs"),
				import("../update-capture-paths-_3kPlbkf.mjs")
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
			const migrationSnapshots = snapshotFacts.filter((snapshot) => snapshot.role === "agent");
			await verifyBackupArchive(backup.archivePath, migrationSnapshots);
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
				if (!identity?.isFile() || !migrationSnapshots.some((fact) => fact.role === "agent" && fact.agentId === migration.agentId && sameSnapshotFile(identity, fact))) throw coverageRefusal([{
					kind: "agent",
					...migration
				}], "agent database physical identity changed or has no verified snapshot before schema migration.");
			});
			(options.runtime ?? defaultRuntime).log(`Verified agent-schema recovery backup retained at ${backup.archivePath}.`);
			options.onVerifiedBackup?.(requiredSnapshots);
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
	if (recovery && !options.statePublicationOnly) recordUpdateDoctorRefusal(error.message);
	if (options.json) {
		const runtime = options.runtime ?? defaultRuntime;
		writeRuntimeJson(runtime, formatCliJsonFailure(error));
		exitCliAfterOutput(runtime, 1);
	}
	throw error;
}
/** Complete a private CLI validation before bootstrap can reach any live writer. */
async function preflightUpdateDoctorCli(options) {
	const parent = readUpdateRunDriver(process.ppid);
	if (resolveUpdateRehearsalRoot(process.env)) {
		await guardUpdateDoctorSchemaUpgrade({
			...options,
			entry: "cli-bootstrap",
			statePublicationOnly: true
		});
		return;
	}
	const schemas = await guardUpdateDoctorSchemaUpgrade({
		...options,
		entry: "cli-bootstrap"
	});
	if (schemas?.updateSchemaRehearsal) {
		await rehearseDeferredUpdateDoctorSchemaForParent(schemas, defaultRuntime, parent);
		exitCliAfterOutput(defaultRuntime, 0);
	}
	return schemas;
}
/** The shipped Windows driver can still discard a failed npm stage before entering repair. */
async function preflightUpdatePackageLifecycle() {
	if (process.platform !== "win32" || process.env.OPENCLAW_UPDATE_IN_PROGRESS !== "1") return;
	let updater;
	try {
		updater = await readDrivingUpdater(true);
	} catch {}
	if (!updater?.requiresReadableSharedContent) return;
	await guardUpdateDoctorSchemaUpgrade({
		schemas: await prepareDoctorDatabasePreflight({ scope: "state" }),
		entry: "package-lifecycle"
	});
}
/** The shipped package validator may still roll back; it must never reach live Doctor writers. */
function rehearseDeferredUpdateDoctorSchema(schemas, runtime = defaultRuntime) {
	return rehearseDeferredUpdateDoctorSchemaForParent(schemas, runtime, readUpdateRunDriver(process.ppid));
}
async function rehearseDeferredUpdateDoctorSchemaForParent(schemas, runtime, parent) {
	const selected = schemas.updateSchemaRehearsal;
	if (!selected) throw new Error("Missing legacy update schema rehearsal admission.");
	if (!parent) throw new Error("The schema rehearsal parent identity is unavailable.");
	const assertParent = () => {
		const current = readUpdateRunDriver(process.ppid);
		if (!current || !sameUpdateRunDriver(current, parent)) throw new Error("The schema rehearsal parent identity changed.");
	};
	assertParent();
	const [{ createConfigIO }, { resolveOpenClawPackageRoot }, { resolveUpdateInstallKind }, { prepareUpdateCandidateRehearsal }, { resolveGatewayInstallEntrypoint }, { runUtf8CommandWithTimeout }, { resolveSqliteInspectionBudget }] = await Promise.all([
		import("../io-BM-qEheD.mjs"),
		import("../openclaw-root-Cr3tCNk3.mjs"),
		import("../update-check-D5e9uqv6.mjs"),
		import("../update-candidate-rehearsal-nNf124C8.mjs"),
		import("../gateway-entrypoint-ByuBsr2t.mjs"),
		import("../exec-C89-C-hl.mjs"),
		import("../sqlite-readonly-worker-DPlfD0t8.mjs")
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
	assertParent();
	const entry = await resolveGatewayInstallEntrypoint(root);
	if (!entry) throw new Error("Candidate Doctor entrypoint is unavailable for private schema validation.");
	const snapshot = await createConfigIO({
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshot();
	assertParent();
	const rehearsal = await prepareUpdateCandidateRehearsal({
		candidateRoot: root,
		config: snapshot.sourceConfig ?? snapshot.config,
		stateDir: resolveStateDir()
	});
	const cleanupRoots = new Map(rehearsal.cleanupDirectories.map((directory) => {
		const identity = lstatSync(directory);
		if (!identity.isDirectory() || identity.isSymbolicLink() || realpathSync(directory) !== directory) throw new Error(`Private Doctor cleanup root is not physical; retained ${directory}.`);
		return [directory, identity];
	}));
	const assertCleanupDirectory = (directory) => {
		const original = cleanupRoots.get(directory);
		const current = lstatSync(directory);
		if (!original || !sameSnapshotFile(original, current) || !current.isDirectory() || current.isSymbolicLink() || current.uid !== original.uid || realpathSync(directory) !== directory) throw new Error(`Private Doctor cleanup identity changed; inspect ${directory}.`);
	};
	let failure;
	let settled = false;
	let writerStarted = false;
	let resourceWarnings = [];
	try {
		const env = {
			...rehearsal.env,
			OPENCLAW_UPDATE_IN_PROGRESS: "0"
		};
		const { inspectPreparedDoctorRehearsal } = await import("../doctor-update-rehearsal-inventory-D45Y2ifF.mjs");
		const admitted = await inspectPreparedDoctorRehearsal({
			stateDir: rehearsal.stateDir,
			pluginCodeLinks: rehearsal.pluginCodeLinks,
			env,
			assertCurrent: assertParent
		});
		const current = await readDrivingUpdater();
		if (current?.runId !== selected.runId || !current.earlyDoctorRunning || current.postCoreStarted) throw new Error("The schema rehearsal updater changed before Doctor launch.");
		resourceWarnings = admitted.fact.warnings;
		runtime.log(JSON.stringify(admitted.fact));
		admitted.assertPrepared();
		writerStarted = true;
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
			const { redactSupportString } = await import("../diagnostic-support-redaction-qDWsXcH4.mjs");
			throw new Error(`Private Doctor schema validation failed (${result.termination}): ${redactSupportString(result.stderr, {
				env,
				stateDir: rehearsal.stateDir
			}, { maxLength: 2e3 })}`);
		}
	} catch (error) {
		failure = { error };
	}
	if (settled || !writerStarted) try {
		for (const directory of cleanupRoots.keys()) assertCleanupDirectory(directory);
		await rehearsal.cleanup(assertCleanupDirectory);
	} catch (cleanupError) {
		if (failure) runtime.error(`Warning: Private Doctor cleanup was not completed: ${String(cleanupError)}`);
		else throw cleanupError;
	}
	if (failure) throw failure.error;
	const warning = `Validated schema repair on private copies for OpenClaw ${selected.updaterVersion}; live agent databases are unchanged. Repair is deferred to the fresh post-core updater.`;
	const { UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV, writeUpdatePostInstallDoctorResult } = await import("../update-doctor-result-Co_hELNl.mjs");
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV];
	if (resultPath) await writeUpdatePostInstallDoctorResult({
		resultPath,
		result: {
			status: "ok",
			configHash: "unchanged",
			warnings: [warning, ...resourceWarnings.map((resourceWarning) => resourceWarning.message)]
		}
	});
	for (const resourceWarning of resourceWarnings) runtime.error(`Warning: ${resourceWarning.message}`);
	runtime.log(warning);
}
//#endregion
export { guardUpdateDoctorSchemaUpgrade, preflightUpdateDoctorCli, preflightUpdatePackageLifecycle, rehearseDeferredUpdateDoctorSchema };
