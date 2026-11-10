import { c as getPluginCache, k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as resolvePluginSourceCapturesDirectory, i as resolvePluginSourceCaptureFallbackPrefix } from "./plugin-source-capture-path-D7PBfh7S.mjs";
import { v as setActiveDegradedPlugins } from "./discovery-availability-CEoTdFoo.mjs";
import { a as assertDatabasePortStartupAllowed } from "./database-port-recovery-DeW0rW16.mjs";
import { s as recordStartupMigrationWarnings } from "./state-migrations.messages-CB0bXmSE.mjs";
import { i as throwStartupMigrationGuardRejected, r as rethrowStartupConfigFailure } from "./doctor-startup-migration-refusal-DM4p-KXA.mjs";
import { t as RetiredStateFormatError } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { t as assertNoRetiredRuntimeStateFiles } from "./state-migrations.retired-runtime-files-CwmWdny1.mjs";
import { a as measureDoctorConfigPreflightStep, i as readAdmittedConfigSnapshot, r as createConfigPreflightSnapshotReader, t as refreshStartupPluginQuarantine } from "./doctor-config-preflight-plugin-verification-DaiWSEI4.mjs";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
//#region src/commands/startup-plugin-source-captures.ts
async function hasCaptureDirectories(stateDir, directory) {
	try {
		await fs.access(directory);
		return true;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	const prefix = resolvePluginSourceCaptureFallbackPrefix(stateDir);
	try {
		for await (const entry of await fs.opendir(tmpdir())) if (entry.isDirectory() && entry.name.startsWith(prefix)) return true;
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	return false;
}
/** Reclaim retired payloads before runtime loading, using the same receipt owner as Doctor. */
async function cleanupStartupPluginSourceCaptures(env = process.env) {
	if (isArtifactPreservingStateRead()) return;
	const stateDir = resolveStateDir(env);
	const directory = resolvePluginSourceCapturesDirectory(stateDir);
	try {
		if (!await hasCaptureDirectories(stateDir, directory)) return;
		const [{ withDoctorSqliteMaintenanceLock, DoctorSqliteMaintenanceLockUnavailableError }, { pruneUnreferencedPluginNativeCaptures }, { isGatewayLifecycleContentionError }] = await Promise.all([
			import("./doctor-sqlite-maintenance-lock-KEaKrwuC.mjs"),
			import("./plugin-source-capture-report-5WYuNoav.mjs"),
			import("./gateway-lock-BLFQD0F1.mjs")
		]);
		const result = await withDoctorSqliteMaintenanceLock({
			env,
			operation: "plugin source cleanup",
			protectedPaths: [directory],
			run: (authority) => pruneUnreferencedPluginNativeCaptures(stateDir, () => authority.assertCurrent(), env, { startup: true })
		}).catch((error) => {
			if (error instanceof DoctorSqliteMaintenanceLockUnavailableError && isGatewayLifecycleContentionError(error.cause)) return;
			throw error;
		});
		if (result?.warnings.length) process.emitWarning(`Plugin source capture startup cleanup: ${result.warnings.join("; ")}`);
	} catch (error) {
		process.emitWarning(`Plugin source capture startup cleanup deferred: ${String(error)}`);
	}
}
//#endregion
//#region src/commands/startup-config-preflight.ts
const STARTUP_LEASE_ATTEMPTS = 3;
/** Prepare current runtime state; legacy imports and repair receipts belong to Doctor. */
async function runStartupConfigPreflight(options) {
	assertDatabasePortStartupAllowed(resolveStateDir(process.env));
	for (let attempt = 1;; attempt++) try {
		var _usingCtx$1 = _usingCtx();
		const snapshots = _usingCtx$1.a(createConfigPreflightSnapshotReader());
		const { withSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-B2W54074.mjs");
		try {
			const prepared = await withSqliteReadOnlyWorkerScope(() => prepareStartupConfig(options, snapshots));
			return {
				...prepared,
				pluginCache: await snapshots.takePluginCache(prepared.pluginMetadataSnapshot)
			};
		} catch (error) {
			const { StartupMigrationLeaseLostError } = await import("./startup-migration-checkpoint-mVDT3_mA.mjs");
			if (error instanceof StartupMigrationLeaseLostError && attempt < STARTUP_LEASE_ATTEMPTS) {
				recordStartupMigrationWarnings(["Startup migration lease lost; reacquiring and retrying."]);
				continue;
			}
			if (options.gateway) rethrowStartupConfigFailure(error);
			throw error;
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
function readStartupStateWarnings(env) {
	try {
		assertNoRetiredRuntimeStateFiles(resolveStateDir(env), env);
		return [];
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return [error instanceof RetiredStateFormatError && error.cause === void 0 ? `Retired runtime state was left unchanged for Doctor; no import was attempted. ${message}` : `Could not inspect retired runtime state: ${message}; run openclaw doctor`];
	}
}
async function prepareStartupConfig(options, snapshots) {
	let env = process.env;
	const measure = options.measure ?? (async (_name, run) => await run());
	const readSnapshot = (readOptions) => snapshots.read({
		purpose: "startup",
		allowCurrentPluginMetadata: false,
		includePluginMetadata: true,
		isolateEnv: readOptions?.isolateEnv,
		skipPluginValidation: false,
		observe: options.gateway ? false : options.observe,
		measure
	});
	const beforeStatePreparation = async (snapshot) => {
		if (options.beforeStatePreparation && !await options.beforeStatePreparation(snapshot)) throwStartupMigrationGuardRejected();
		return true;
	};
	if (!options.gateway) {
		const read = await readSnapshot();
		await beforeStatePreparation(read.snapshot);
		if (read.snapshot.valid && options.observe !== false) await cleanupStartupPluginSourceCaptures(env);
		recordStartupMigrationWarnings(readStartupStateWarnings(env));
		return result(read);
	}
	const readAdmitted = () => readAdmittedConfigSnapshot({
		env,
		readSnapshot,
		validateConfig: options.validateStartupConfig,
		beforeStatePreparation
	});
	let read = await readAdmitted();
	env = cloneEnvWithPlatformSemantics(process.env);
	if (!read.snapshot.valid) return result(read);
	let lease;
	let heartbeat;
	let heartbeatError;
	const assertHeartbeatCurrent = () => {
		if (heartbeatError) throw heartbeatError;
	};
	const assertLeaseCurrent = () => {
		assertHeartbeatCurrent();
		lease?.assertOwned();
	};
	try {
		if (read.recovery) {
			const { acquireStartupMigrationLeaseWithWait } = await import("./startup-migration-checkpoint-mVDT3_mA.mjs");
			lease = await measureDoctorConfigPreflightStep("migration-lease", () => acquireStartupMigrationLeaseWithWait({ env }));
			heartbeat = setInterval(() => {
				try {
					lease?.heartbeat();
				} catch (error) {
					heartbeatError = error instanceof Error ? error : new Error("OpenClaw startup lease heartbeat failed.", { cause: error });
				}
			}, 6e4);
			heartbeat.unref();
			const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-C4DiOvV_.mjs");
			await withPluginLifecycleLease({
				env,
				assertCurrent: assertLeaseCurrent,
				processBound: true
			}, async (pluginLease) => {
				read = await readAdmitted();
				if (!read.snapshot.valid) return;
				assertLeaseCurrent();
				if (read.recovery) {
					await read.recovery.apply(() => pluginLease.assertOwned());
					read = await readSnapshot();
				}
			});
			if (!read.snapshot.valid) return result(read);
		}
		const [{ initializeNativeOpenClawStateDatabase }, { isStatePostgres }] = await Promise.all([import("./openclaw-state-db-C_MWM4sr.mjs"), import("./openclaw-state-db-engine-DfdjS-Qb.mjs")]);
		await beforeStatePreparation(read.snapshot);
		assertLeaseCurrent();
		if (!isStatePostgres()) {
			const [{ withStateDatabaseColdAdmission }, { OPENCLAW_SQLITE_BUSY_TIMEOUT_MS }, { resolveOpenClawStateSqlitePath }] = await Promise.all([
				import("./gateway-state-owner-D23zOJLh.mjs"),
				import("./openclaw-state-db-contract-BI7fsyrl.mjs"),
				import("./openclaw-state-db.paths-DOpcSToL.mjs")
			]);
			withStateDatabaseColdAdmission({
				databasePath: resolveOpenClawStateSqlitePath(env),
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS
			}, () => initializeNativeOpenClawStateDatabase({ env }));
		}
		const { HISTORICAL_WEBHOOK_CHANNELS, recordUnwrittenWebhookCompletion } = await import("./legacy-webhook-pins-R1kMDU4v.mjs");
		const webhookCompletion = read.snapshot.sourceConfig.meta?.migrations?.webhookListeners;
		if (webhookCompletion !== true && !HISTORICAL_WEBHOOK_CHANNELS.every((id) => Object.hasOwn(webhookCompletion ?? {}, id))) {
			const migration = await measureDoctorConfigPreflightStep("webhook-readiness", async () => {
				const { applyPluginDoctorCompatibilityMigrations } = await import("./doctor-contract-registry-DdkKEDky.mjs");
				return applyPluginDoctorCompatibilityMigrations(read.snapshot.sourceConfig, {
					config: read.snapshot.sourceConfig,
					env,
					manifestRegistry: read.pluginMetadataSnapshot?.manifestRegistry,
					pluginIds: HISTORICAL_WEBHOOK_CHANNELS,
					historicalWebhookListeners: true,
					startup: true
				});
			});
			if (migration.warnings?.length) throw new Error(migration.warnings.join("\n"));
			if (migration.changes.length) {
				await beforeStatePreparation(read.snapshot);
				assertLeaseCurrent();
				if (!recordUnwrittenWebhookCompletion(read.snapshot, migration, env)) {
					const { StartupMaintenanceRequiredError } = await import("./startup-maintenance-required-DoHHDHhm.mjs");
					throw new StartupMaintenanceRequiredError("state-migrations", `Webhook listeners require config migration. Run \`openclaw doctor --fix\`, then restart. Startup left the config unchanged.\n${migration.changes.join("\n")}`);
				}
			}
		}
		const verification = await withPluginCache(read.pluginMetadataSnapshot ? getPluginMetadataSnapshotCache(read.pluginMetadataSnapshot) : getPluginCache(), () => refreshStartupPluginQuarantine({
			cfg: read.snapshot.sourceConfig,
			env,
			measure,
			beforePersistentEffect: async () => {
				await beforeStatePreparation(read.snapshot);
				assertLeaseCurrent();
			}
		}));
		setActiveDegradedPlugins(verification.quarantinedPlugins);
		recordStartupMigrationWarnings([
			...readStartupStateWarnings(env),
			...verification.warnings ?? [],
			...(verification.deferredPlugins ?? []).map((plugin) => `Plugin "${plugin.pluginId}": ${plugin.reason}. Run \`${plugin.command}\`.`)
		]);
		await beforeStatePreparation(read.snapshot);
		assertLeaseCurrent();
		return result(read);
	} finally {
		clearInterval(heartbeat);
		const acquiredLease = lease;
		if (acquiredLease) await measureDoctorConfigPreflightStep("migration-lease-release", () => acquiredLease.release());
	}
}
function result(read) {
	return {
		snapshot: read.snapshot,
		baseConfig: read.snapshot.sourceConfig,
		...read.pluginMetadataSnapshot ? { pluginMetadataSnapshot: read.pluginMetadataSnapshot } : {}
	};
}
//#endregion
export { runStartupConfigPreflight };
