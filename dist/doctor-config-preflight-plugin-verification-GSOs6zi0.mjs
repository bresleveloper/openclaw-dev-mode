import { D as withPluginCache, a as createPluginCache, o as getPluginCache } from "./plugin-cache-BABafcXD.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { a as measureGatewayBootstrapStep } from "./startup-trace-C4xndCPa.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { a as isConfigReadFailure, n as createConfigReadError } from "./io.invalid-config-BzeD3bi5.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BJGPJZu6.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot, o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { p as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-BClSJ17n.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { b as formatPluginVerificationDiagnostic, h as buildDegradedPluginsFromVerificationFailures, m as PLUGIN_AVAILABILITY_POLICY, v as describePluginAvailabilityFailure } from "./discovery-Dma3bVNk.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import { c as readConfigFileSnapshot, d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-BSum32pK.mjs";
import "./io-B0OAIqw3.mjs";
import { g as readAgentDatabaseAdmissionRefusal, m as listAgentDatabaseAdmissionRefusals } from "./agent-database-admission-dWNS6Rcs.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { m as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-BSHZeoyM.mjs";
import { t as describeConfigSnapshotInputChange } from "./snapshot-inputs-BFAy-z4j.mjs";
import { a as throwStartupMigrationIdentityChanged, i as throwStartupMigrationGuardRejected, n as refuseStartupMigrationsForLiveGatewayOwner, r as rethrowStartupConfigFailure } from "./doctor-startup-migration-refusal-DjdEjvdn.mjs";
import { t as addDoctorLegacyIssues } from "./legacy-config-issues-BWZ_nhfc.mjs";
import { s as recordStartupMigrationWarnings } from "./state-migrations.messages-CXxBVY0a.mjs";
import { t as completeDoctorPluginMetadataSnapshot } from "./plugin-metadata-snapshot-scope-CfKv3vs4.mjs";
//#region src/commands/doctor-config-preflight-measure.ts
async function measureDoctorConfigPreflightStep(name, run, measure, metrics) {
	const tracedRun = () => measureGatewayBootstrapStep(`cli.bootstrap.${name}`, run, metrics);
	return measure ? await measure(`doctor.config-preflight.${name}`, tracedRun) : await tracedRun();
}
//#endregion
//#region src/commands/config-preflight-snapshot.ts
const loadInstalledPluginIndexStoreWrite = createLazyRuntimeModule(() => import("./installed-plugin-index-store-write-BPlky50c.mjs"));
function throwPluginRegistryPersistenceFailed(reason, repair = "Run \"openclaw doctor --fix\" and retry.") {
	throw new Error(`OpenClaw refreshed the plugin registry but could not verify the persisted replacement (${reason}); refusing to accept the plugin registry. ${repair}`);
}
function formatPluginRegistryDifferences(snapshot) {
	const differences = new Map(snapshot?.registryDiagnostics.flatMap((diagnostic) => diagnostic.differences ?? []).map((difference) => [JSON.stringify(difference), difference]));
	if (differences.size === 0) return;
	return [...differences.values()].toSorted((left, right) => [
		left.pluginId,
		left.persistedSource,
		left.derivedSource
	].join("\0").localeCompare([
		right.pluginId,
		right.persistedSource,
		right.derivedSource
	].join("\0"))).map((difference) => `${sanitizeTerminalText(difference.pluginId)} (${difference.changed.join("+")} changed; persisted source: ${JSON.stringify(difference.persistedSource)}; derived source: ${JSON.stringify(difference.derivedSource)})`).join(", ");
}
async function readConfigPreflightSnapshot(params) {
	const cache = params.allowCurrentPluginMetadata ? getPluginCache() : createPluginCache();
	return withPluginCache(cache, async () => {
		const sharedOptions = {
			...params.isolateEnv ? { isolateEnv: true } : {},
			...params.observe === false ? { observe: false } : {},
			...params.measure ? { measure: params.measure } : {},
			...params.allowCurrentPluginMetadata ? {} : { allowCurrentPluginMetadata: false }
		};
		let deferred = params.deferredPluginMigrations;
		if (params.preparePluginMigrations) {
			const core = await readConfigFileSnapshot({
				...sharedOptions,
				pluginValidation: "core-only",
				deferredPluginMigrations: deferred
			});
			await params.prepareSnapshot?.(core);
			deferred = await params.preparePluginMigrations(core);
		}
		const readOptions = {
			...sharedOptions,
			deferredPluginMigrations: deferred
		};
		const withLegacyIssues = (snapshot, metadata) => params.purpose === "doctor" || !snapshot.valid ? addDoctorLegacyIssues(snapshot, metadata) : snapshot;
		return withDeferredPluginDoctorMigrations(deferred?.map((entry) => entry.pluginId) ?? [], async () => {
			if (params.includePluginMetadata && !params.skipPluginValidation) {
				const result = await readConfigFileSnapshotWithPluginMetadata(readOptions);
				const pluginMetadataSnapshot = params.preparePluginMetadataSnapshot ? completeDoctorPluginMetadataSnapshot({
					snapshot: result.pluginMetadataSnapshot,
					config: result.snapshot.sourceConfig ?? result.snapshot.config ?? {}
				}) : result.pluginMetadataSnapshot;
				return {
					snapshot: withLegacyIssues(result.snapshot, pluginMetadataSnapshot),
					...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
				};
			}
			const snapshot = await readConfigFileSnapshot({
				...readOptions,
				skipPluginValidation: params.skipPluginValidation
			});
			if (!params.preparePluginMigrations) await params.prepareSnapshot?.(snapshot);
			return { snapshot: withLegacyIssues(snapshot) };
		});
	});
}
function needsRefreshedPluginIndexPersistence(snapshotRead) {
	return snapshotRead.pluginMetadataSnapshot?.registrySource === "derived";
}
async function persistRefreshedPluginIndex(params) {
	const lease = params.lease;
	if (!lease) throwPluginRegistryPersistenceFailed("startup migration lease was not acquired");
	const { withPluginLifecycleLease } = await import("./plugin-lifecycle-lease-D_2q8UjY.mjs");
	return await withPluginLifecycleLease({
		env: params.env,
		assertCurrent: params.assertCurrent,
		processBound: true
	}, async (pluginLease) => {
		const fresh = await params.readPersistedSnapshot();
		assertPreflightConfigUnchanged(params.snapshotRead.snapshot, fresh.snapshot);
		pluginLease.assertOwned();
		if (!needsRefreshedPluginIndexPersistence(fresh)) {
			if (fresh.pluginMetadataSnapshot?.registrySource !== "persisted") throwPluginRegistryPersistenceFailed("fresh metadata was not persisted or derived");
			return { snapshotRead: fresh };
		}
		const derivedPluginMetadataSnapshot = fresh.pluginMetadataSnapshot;
		if (!derivedPluginMetadataSnapshot?.configFingerprint?.trim()) throwPluginRegistryPersistenceFailed("derived metadata was incomplete");
		const { writePersistedInstalledPluginIndexWithLeaseSync } = await params.measure("plugin-index-store-import", loadInstalledPluginIndexStoreWrite);
		await params.measure("plugin-index-persistence", () => writePersistedInstalledPluginIndexWithLeaseSync(derivedPluginMetadataSnapshot.registryIndex, {
			env: params.env,
			lease: { assertOwnedInTransaction(database) {
				lease.assertOwnedInTransaction(database);
				pluginLease.assertOwnedInTransaction(database);
			} }
		}));
		const persistedSnapshotRead = await params.readPersistedSnapshot();
		const persistedPluginMetadataSnapshot = persistedSnapshotRead.pluginMetadataSnapshot;
		if (persistedPluginMetadataSnapshot?.registrySource !== "persisted") {
			const diagnosticCodes = persistedPluginMetadataSnapshot?.registryDiagnostics.map((diagnostic) => diagnostic.code);
			const differences = formatPluginRegistryDifferences(persistedPluginMetadataSnapshot);
			throwPluginRegistryPersistenceFailed(`reread source was ${persistedPluginMetadataSnapshot?.registrySource ?? "missing"}${differences ? `; differences: ${differences}` : ""}${diagnosticCodes?.length ? `; diagnostics: ${diagnosticCodes.join(", ")}` : ""}`, "Stop plugin package changes, run \"openclaw plugins registry --refresh\", then retry.");
		}
		assertPreflightConfigUnchanged(params.snapshotRead.snapshot, persistedSnapshotRead.snapshot);
		return { snapshotRead: persistedSnapshotRead };
	});
}
/** Admit the same config and state before the lease and again before persistent writes. */
async function readAdmittedConfigSnapshot(params) {
	return await withArtifactPreservingStateReads(async () => {
		await measureDoctorConfigPreflightStep("admission.live-owner", () => refuseStartupMigrationsForLiveGatewayOwner(params.env));
		try {
			const selected = await measureDoctorConfigPreflightStep("admission.core-config", () => readConfigFileSnapshot({
				observe: false,
				isolateEnv: true,
				pluginValidation: "core-only"
			}));
			if (isConfigReadFailure(selected) || selected.issues.some((issue) => issue.errorCode === "CONFIG_SOURCE_INVALID")) return { snapshot: selected };
			const recoveryOptions = {
				configPath: selected.path,
				observe: false,
				env: params.env
			};
			const coreRecovery = await measureDoctorConfigPreflightStep("admission.core-recovery", () => createConfigIO({
				...recoveryOptions,
				pluginValidation: "core-only"
			}).prepareConfigRecovery(selected));
			const candidate = coreRecovery?.snapshot ?? selected;
			await assertStartupStateReady({
				cfg: candidate.sourceConfig ?? candidate.config,
				env: params.env
			});
			if (candidate.valid) {
				await params.validateConfig?.(candidate);
				const { loadDeviceIdentityIfPresent } = await import("./device-identity-BzQH6fpe.mjs");
				loadDeviceIdentityIfPresent({ env: params.env });
			}
			let read = await withOpenClawStateDatabaseReadSnapshot(() => params.readSnapshot(coreRecovery ? { isolateEnv: true } : void 0), { env: params.env });
			assertPreflightConfigUnchanged(selected, read.snapshot);
			const recovery = await measureDoctorConfigPreflightStep("admission.config-recovery", () => createConfigIO(recoveryOptions).prepareConfigRecovery(read.snapshot));
			if (Boolean(coreRecovery) !== Boolean(recovery)) throwStartupMigrationIdentityChanged();
			if (recovery) {
				assertPreflightConfigUnchanged(candidate, recovery.snapshot);
				read = {
					snapshot: recovery.snapshot,
					pluginMetadataSnapshot: recovery.pluginMetadataSnapshot
				};
			}
			if (read.snapshot.valid) await params.validateConfig?.(read.snapshot);
			if (params.beforeStatePreparation && !await measureDoctorConfigPreflightStep("admission.config-guard", () => params.beforeStatePreparation?.(read.snapshot))) throwStartupMigrationGuardRejected();
			if (read.snapshot.valid) {
				const { loadDeviceIdentityIfPresent } = await import("./device-identity-BzQH6fpe.mjs");
				loadDeviceIdentityIfPresent({ env: params.env });
			}
			return {
				...read,
				...recovery ? { recovery } : {}
			};
		} catch (error) {
			return rethrowStartupConfigFailure(error);
		}
	});
}
function assertPreflightConfigUnchanged(before, after) {
	const unreadable = [before, after].find(isConfigReadFailure);
	if (unreadable) throw createConfigReadError(unreadable);
	const change = describeConfigSnapshotInputChange(before, after);
	if (change) throwStartupMigrationIdentityChanged(change);
}
/** Admission runs before lease acquisition: even acquiring a lease commits SQLite writes. */
async function assertStartupStateReady(params) {
	const { assertOpenClawDatabasesReady } = await measureDoctorConfigPreflightStep("admission.database-runtime-import", () => import("./openclaw-database-preflight-ClnnU5e8.mjs"));
	const agentCount = listAgentIds(params.cfg).length;
	const admissionMetrics = { agentCount };
	await measureDoctorConfigPreflightStep("admission.database-readiness", () => assertOpenClawDatabasesReady({
		env: params.env,
		config: params.cfg,
		operation: "gateway-startup",
		onAgentInspection: (stats) => {
			Object.assign(admissionMetrics, stats);
		}
	}), void 0, () => admissionMetrics);
	const [{ assertSessionStoreMigrationComplete }, { resolveAllAgentSessionStoreCandidateTargetsSync }, { inspectOpenClawRegisteredAgentDatabases }] = await measureDoctorConfigPreflightStep("admission.session-runtime-import", () => Promise.all([
		import("./startup-migration-Dci0ffgl.mjs"),
		import("./targets-Be8sKF4o.mjs"),
		import("./openclaw-agent-db-registry-B10y6xrP.mjs")
	]));
	const registeredDatabases = await measureDoctorConfigPreflightStep("admission.agent-inventory", () => inspectOpenClawRegisteredAgentDatabases({
		env: params.env,
		includeIncompatibleSchemaVersions: true
	}));
	const targets = await measureDoctorConfigPreflightStep("admission.session-targets", () => resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, {
		env: params.env,
		registeredDatabases
	}).filter((target) => !readAgentDatabaseAdmissionRefusal(target.agentId, { env: params.env })), void 0, () => ({
		agentCount,
		registeredDatabaseCount: registeredDatabases.length
	}));
	await measureDoctorConfigPreflightStep("admission.session-readiness", () => assertSessionStoreMigrationComplete({
		...params,
		targets
	}), void 0, () => ({ targetCount: targets.length }));
	recordStartupMigrationWarnings(listAgentDatabaseAdmissionRefusals({ env: params.env }).map((refusal) => `${refusal.reason}\n${refusal.repairHint}`));
	const { assertConfiguredWorkspaceStateReady } = await measureDoctorConfigPreflightStep("admission.workspace-runtime-import", () => import("./workspace-state-dirs-C3i8yrXw.mjs"));
	await measureDoctorConfigPreflightStep("admission.workspace-readiness", () => assertConfiguredWorkspaceStateReady(params), void 0, () => ({ agentCount }));
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-verification.ts
async function planStartupPluginVerification(params) {
	const { planStartupPluginConvergence } = await measureDoctorConfigPreflightStep("plugin-plan-import", () => import("./startup-plugin-convergence-plan-D_oYYhzy.mjs"), params.measure);
	return await measureDoctorConfigPreflightStep("plugin-plan", () => planStartupPluginConvergence({
		config: params.cfg,
		env: params.env
	}), params.measure);
}
function buildStartupPluginQuarantine(params) {
	return buildDegradedPluginsFromVerificationFailures(params.failures.filter((failure) => resolveEffectiveEnableState({
		id: failure.pluginId,
		origin: "global",
		config: normalizePluginsConfig(params.cfg.plugins),
		rootConfig: params.cfg
	}).enabled));
}
async function runDoctorPluginConvergence(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return { quarantinedPlugins: [] };
	const { inspectPluginMigrationAvailability } = await import("./plugin-migration-availability-Jy7avAsi.mjs");
	const isUpdateRehearsal = Boolean(resolveUpdateRehearsalRoot(params.env));
	if (isUpdateRehearsal) note("Plugin refresh deferred to live update finalization; the canary verifies copied plugin payloads without downloading replacements.", `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	if (isUpdateRehearsal || shouldDeferConfiguredPluginInstallRepair(params.env)) {
		const payloads = await verifyStartupPluginPayloads(params, plan.installRecords);
		const { pending, ...migrationInspection } = await inspectPluginMigrationAvailability({
			...params,
			installRecords: plan.installRecords,
			deferInstallation: true
		});
		return {
			...payloads,
			migrationInspection,
			deferredPlugins: [...new Map([...payloads.deferredPlugins ?? [], ...pending].map((entry) => [entry.pluginId, entry])).values()]
		};
	}
	const { runPostCorePluginConvergence } = await measureDoctorConfigPreflightStep("plugin-convergence-import", () => import("./post-core-plugin-convergence-ikIV99pF.mjs"), params.measure);
	const convergence = await measureDoctorConfigPreflightStep("plugin-convergence", () => runPostCorePluginConvergence({
		cfg: params.cfg,
		env: params.env,
		compatibilityHostVersion: resolveCompatibilityHostVersion(params.env)
	}), params.measure);
	if (convergence.changes.length > 0) note(convergence.changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	const notices = convergence.notices ?? [];
	if (notices.length > 0) note(notices.map((notice) => `- ${notice.message} ${notice.guidance.join(" ")}`.trim()).join("\n"), "Doctor notices");
	const warnings = convergence.warnings.map((warning) => `${warning.message} ${warning.guidance.join(" ")}`.trim());
	if (warnings.length > 0) note(warnings.map((warning) => `- ${warning}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: convergence.smokeFailures
	});
	const { pending, ...migrationInspection } = await inspectPluginMigrationAvailability({
		...params,
		installRecords: convergence.installRecords,
		deferInstallation: false
	});
	const deferredPlugins = new Map(pending.map((plugin) => [plugin.pluginId, plugin]));
	for (const warning of convergence.warnings) if (warning.pluginId) deferredPlugins.set(warning.pluginId, {
		...deferredPlugins.get(warning.pluginId),
		pluginId: warning.pluginId,
		reason: warning.reason,
		command: "openclaw update repair"
	});
	for (const plugin of quarantinedPlugins) deferredPlugins.set(plugin.pluginId, {
		...deferredPlugins.get(plugin.pluginId),
		pluginId: plugin.pluginId,
		reason: plugin.diagnostic.detail,
		command: "openclaw update repair"
	});
	return {
		...warnings.length > 0 ? { warnings } : {},
		quarantinedPlugins,
		...migrationInspection.requiredPluginIds.length > 0 || migrationInspection.inspectionRequiredPluginIds.length > 0 || migrationInspection.statelessPluginIds.length > 0 ? { migrationInspection } : {},
		...deferredPlugins.size > 0 ? { deferredPlugins: [...deferredPlugins.values()] } : {}
	};
}
async function refreshStartupPluginQuarantine(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return { quarantinedPlugins: [] };
	return verifyStartupPluginPayloads(params, plan.installRecords);
}
async function verifyStartupPluginPayloads(params, records) {
	const { runActivePluginPayloadSmokeCheck } = await measureDoctorConfigPreflightStep("plugin-payload-verification-import", () => import("./active-payload-verification-ZUWxLTxd.mjs"), params.measure);
	const smoke = await measureDoctorConfigPreflightStep("plugin-payload-verification", () => runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records,
		env: params.env
	}), params.measure);
	const quarantinedPlugins = buildStartupPluginQuarantine({
		cfg: params.cfg,
		failures: smoke.failures
	});
	if (quarantinedPlugins.length > 0) note(quarantinedPlugins.map((plugin) => `- ${describePluginAvailabilityFailure(plugin.pluginId, formatPluginVerificationDiagnostic(plugin.diagnostic)).message}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	return {
		quarantinedPlugins,
		deferredPlugins: quarantinedPlugins.map((plugin) => ({
			pluginId: plugin.pluginId,
			reason: plugin.diagnostic.detail,
			command: "openclaw update repair"
		}))
	};
}
//#endregion
export { persistRefreshedPluginIndex as a, measureDoctorConfigPreflightStep as c, needsRefreshedPluginIndexPersistence as i, runDoctorPluginConvergence as n, readAdmittedConfigSnapshot as o, assertPreflightConfigUnchanged as r, readConfigPreflightSnapshot as s, refreshStartupPluginQuarantine as t };
