import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as measureGatewayBootstrapStep } from "./startup-trace-DgSoCXij.mjs";
import { d as resolveHomeDir } from "./utils-aKqR_F_U.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, b as resolveIsConfigReadOnly, f as resolveCanonicalConfigPath, p as resolveConfigPath } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as resolveCompatibilityHostVersion } from "./version-BkM1aB4w.mjs";
import { n as cloneEnvWithPlatformSemantics, v as resolveFutureConfigActionBlock } from "./config-env-vars-BHI12YH5.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { o as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { a as withArtifactPreservingStateReads, f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { _ as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-D0kh4WcK.mjs";
import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { S as setActiveDegradedPlugins, _ as describePluginAvailabilityFailure, m as buildDegradedPluginsFromVerificationFailures, p as PLUGIN_AVAILABILITY_POLICY, y as formatPluginVerificationDiagnostic } from "./discovery-D_5mAUI7.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { d as withDeferredPluginDoctorMigrations } from "./doctor-contract-registry-6tw5Ndqt.mjs";
import { a as readDeferredPluginMigrations, i as mergeDeferredPluginMigration, r as formatDeferredPluginMigration, s as recordDeferredPluginMigrations, t as DeferredPluginMigrationConflictError } from "./deferred-plugin-migrations-DZuh_dkr.mjs";
import { a as resolveDeferredPluginMigrationConfigPaths } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import "./env-vars-jrzBxc1h.mjs";
import { c as parseConfigJson5 } from "./io.read-helpers-N26RjV2V.mjs";
import { r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-ZpL2Kt9B.mjs";
import { t as createConfigIO } from "./io.factory-BWiVTxfI.mjs";
import { _ as recoverConfigFromJsonRootSuffix, c as readConfigFileSnapshot, v as recoverConfigFromLastKnownGood } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { a as evaluateAgentDatabaseAdmissions, d as readAgentDatabaseAdmissionRefusal, f as recordAgentDatabaseAdmissions, l as listAgentDatabaseAdmissionRefusals, r as canIsolateAgentDatabase } from "./agent-database-admission-BFwcs62N.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { r as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-5kPjh__X.mjs";
import { f as shouldDeferConfiguredPluginInstallRepair, p as shouldSkipLegacyUpdateDoctorConfigWrite } from "./update-phase-DiVB4MDN.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as noteDoctorConfigPreflightIssues } from "./doctor-config-analysis-Dal_uH5w.mjs";
import { n as maybeRepairPluginOpenClawHostLinks } from "./doctor-plugin-host-links-D1ohMemY.mjs";
import { c as inspectShippedPluginInstallConfigRecords, n as assertShippedPluginInstallConfigImportCurrent, s as readShippedPluginInstallConfigImportRecords } from "./plugin-registry-migration-_3JB5Vnw.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-A1bI1F7Q.mjs";
import { a as resolveStartupConfigSnapshot, i as planAutomaticConfigRepair, n as importAutomaticConfigRepairInstallRecords, t as commitAutomaticConfigRepair } from "./automatic-startup-config-repair-BYJPaT3C.mjs";
import { t as describeConfigSnapshotInputChange } from "./snapshot-inputs-BkJOhimI.mjs";
import { c as throwIfDoctorStateMigrationRefused, r as formatStartupMigrationFailure, s as recordStartupMigrationWarnings, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-B6_AgnV2.mjs";
import { a as shouldSkipPluginValidationForDoctorConfigPreflight, c as migrationCheckpointIdentitiesMatch, i as readDoctorConfigPreflightSnapshot, l as resolveMigrationCheckpointIdentity, n as needsRefreshedPluginIndexPersistence, o as checkpointIdentityForSnapshot, r as persistRefreshedPluginIndex, s as keepStartupMigrationLeaseAlive, t as createDoctorRehearsalSnapshotPreparation, u as resolveStateMigrationConfigInput } from "./doctor-config-preflight-plugin-index-BK7wmAcq.mjs";
import { n as createDoctorPluginMetadataSnapshotScope } from "./plugin-metadata-snapshot-scope-DbWx53-a.mjs";
import { t as inspectPluginMigrationAvailability } from "./plugin-migration-availability-BSaNl28A.mjs";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/commands/doctor-config-preflight-legacy-config.ts
function createDoctorConfigRepairPlanner(params) {
	const planScopedConfigRepair = (snapshot) => {
		const installRecords = params.hasImportedPluginConfig() ? loadInstalledPluginIndexInstallRecordsSync() : void 0;
		return params.runWithPluginMetadataSnapshot({ config: snapshot.sourceConfig ?? snapshot.config ?? {} }, () => planAutomaticConfigRepair(snapshot, { installRecords }));
	};
	const planAdmittedConfigRepair = (snapshot, prepared = null) => (params.gatewayStartupCheckpointRequired || params.options.repairPrefixedConfig === true || params.stateMigrationsRequested && params.options.migrateLegacyConfig !== false) && !snapshot.valid && !params.skipLegacyParentConfigWrite && (params.options.repairPrefixedConfig === true || !shouldSkipPluginValidationForDoctorConfigPreflight()) && !resolveIsConfigReadOnly(process.env) && !resolveFutureConfigActionBlock({
		action: "normalize legacy config",
		snapshot
	}) ? prepared ?? planScopedConfigRepair(snapshot) : null;
	return {
		planScopedConfigRepair,
		planAdmittedConfigRepair
	};
}
function createDoctorLegacyConfigMigration(params) {
	let complete = false;
	return async () => {
		if (complete || !params.enabled) return;
		complete = true;
		const changes = await params.measure("legacy-config-migration", maybeMigrateLegacyConfig);
		if (changes.length > 0) note(changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
	};
}
/** Repair active legacy bytes before considering an older backup. */
async function prepareDoctorConfigRecovery(params) {
	let snapshotRead = params.snapshotRead;
	let snapshot = snapshotRead.snapshot;
	let activeConfigRepair = null;
	if (params.enabled && snapshot.exists && !snapshot.valid) {
		const pendingPluginInstallConfig = inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig).status !== "missing";
		activeConfigRepair = typeof snapshot.raw === "string" && parseConfigJson5(snapshot.raw).ok ? params.planRepair(snapshot) : null;
		let configRepaired = false;
		if (!activeConfigRepair && await recoverConfigFromJsonRootSuffix(snapshot)) {
			note("Removed non-JSON prefix from openclaw.json.", "Config");
			configRepaired = true;
		} else if (!activeConfigRepair && !pendingPluginInstallConfig && await recoverConfigFromLastKnownGood({
			snapshot,
			reason: "doctor-invalid-config"
		})) {
			note("Restored openclaw.json from last-known-good; original saved as .clobbered.*.", "Config");
			configRepaired = true;
		}
		if (configRepaired) {
			snapshotRead = await params.readSnapshot();
			snapshot = snapshotRead.snapshot;
		}
		if (!snapshot.valid && typeof snapshot.raw === "string" && !parseConfigJson5(snapshot.raw).ok) throw new Error(`Config at ${snapshot.path} is not parseable and cannot be repaired automatically. The file remains unchanged. Inspect the exact parse error with ${formatCliCommand("openclaw config validate")}, then hand-edit the file; or move it aside and run ${formatCliCommand("openclaw onboard")} to generate a fresh config.`);
	}
	return {
		snapshotRead,
		activeConfigRepair
	};
}
async function maybeMigrateLegacyConfig() {
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetPath = resolveCanonicalConfigPath();
	const targetDir = path.dirname(targetPath);
	try {
		await fs$1.access(targetPath);
		return changes;
	} catch {}
	const legacyCandidates = [path.join(home, ".clawdbot", "clawdbot.json")];
	let legacyPath = null;
	for (const candidate of legacyCandidates) try {
		await fs$1.access(candidate);
		legacyPath = candidate;
		break;
	} catch {}
	if (!legacyPath) return changes;
	await fs$1.mkdir(targetDir, { recursive: true });
	try {
		await fs$1.copyFile(legacyPath, targetPath, fs$1.constants.COPYFILE_EXCL);
		changes.push(`Migrated legacy config: ${legacyPath} -> ${targetPath}`);
	} catch (error) {
		if ((error && typeof error === "object" && "code" in error ? error.code : void 0) !== "EEXIST") throw new Error(`Failed to migrate legacy config ${legacyPath} -> ${targetPath}: ${formatErrorMessage(error)}`, { cause: error });
	}
	return changes;
}
//#endregion
//#region src/commands/doctor-config-preflight-measure.ts
async function measureDoctorConfigPreflightStep(name, run, measure, metrics) {
	const tracedRun = () => measureGatewayBootstrapStep(`cli.bootstrap.${name}`, run, metrics);
	return measure ? await measure(`doctor.config-preflight.${name}`, tracedRun) : await tracedRun();
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-migrations.ts
/** One preflight retains unavailable owners until their migration reports completion. */
function createDoctorPluginMigrationPreparation(params) {
	const previousById = /* @__PURE__ */ new Map();
	let deferred = [];
	let expectedPending = [];
	let refreshSnapshot = false;
	let previousLoaded = false;
	const loadPrevious = async (snapshot) => {
		if (previousLoaded) return;
		const env = cloneEnvWithPlatformSemantics(params.env());
		if (!(snapshot?.exists ?? existsSync(resolveConfigPath(env)))) return;
		deferred = await withArtifactPreservingStateReads(() => withOpenClawStateDatabaseReadSnapshot(async () => readDeferredPluginMigrations({ env }), { env }));
		expectedPending = structuredClone(deferred);
		for (const entry of deferred) previousById.set(entry.pluginId, entry);
		previousLoaded = true;
	};
	let prepared = false;
	const completedIds = /* @__PURE__ */ new Set();
	const reported = /* @__PURE__ */ new Map();
	let statelessPluginIds = /* @__PURE__ */ new Set();
	let runtimePluginAliases = /* @__PURE__ */ new Set();
	const inspectedStatelessPluginIds = /* @__PURE__ */ new Set();
	const learn = (inspection) => {
		if (!inspection) return;
		statelessPluginIds = new Set(inspection.statelessPluginIds);
		runtimePluginAliases = new Set(inspection.runtimePluginAliases);
		for (const pluginId of inspection.requiredPluginIds) {
			const pending = previousById.get(pluginId);
			if (pending) previousById.set(pluginId, {
				...pending,
				requiresStateMigration: true
			});
		}
		for (const pluginId of inspection.inspectionRequiredPluginIds) {
			const pending = previousById.get(pluginId);
			if (pending) previousById.set(pluginId, {
				...pending,
				requiresDoctorInspection: true
			});
		}
	};
	const retain = (pending) => mergeDeferredPluginMigration(previousById.get(pending.pluginId), pending);
	const remember = () => {
		for (const pending of deferred) previousById.set(pending.pluginId, pending);
	};
	const prepare = async (snapshot) => {
		await loadPrevious(snapshot);
		if (!snapshot.exists) return [...previousById.values()];
		if (!prepared && params.enabled) {
			const availability = await inspectPluginMigrationAvailability({
				cfg: snapshot.sourceConfig,
				env: params.env(),
				installRecords: readShippedPluginInstallConfigImportRecords(snapshot, { env: params.env() }),
				retainedPluginIds: [...previousById.keys()],
				deferInstallation: shouldDeferConfiguredPluginInstallRepair(params.env())
			});
			learn(availability);
			deferred = availability.pending.map(retain);
			remember();
			prepared = true;
		}
		return [...previousById.values()];
	};
	const reportPending = (plugin) => {
		const warning = formatDeferredPluginMigration(plugin, params.env());
		const previous = reported.get(plugin.pluginId);
		if (previous?.warnings[0] === warning) return;
		params.report({
			changes: [],
			warnings: [warning],
			warningDisposition: "recoverable",
			outcome: "deferred"
		});
		if (previous) {
			previous.warnings = [warning];
			return;
		}
		const receipt = {
			id: `plugin:${plugin.pluginId}`,
			phase: "final",
			source: [{
				kind: "owner",
				id: plugin.pluginId
			}],
			target: [{
				kind: "owner",
				id: plugin.pluginId
			}],
			requiredness: "conditional",
			reversibility: "checkpoint-required",
			outcome: "deferred",
			changes: [],
			warnings: [warning]
		};
		reported.set(plugin.pluginId, receipt);
		params.recordReceipt(receipt);
	};
	const persistPending = (pending, resolvedPluginIds) => {
		params.beforePersistentEffect();
		try {
			const committed = recordDeferredPluginMigrations({
				env: params.env(),
				pending,
				...resolvedPluginIds ? { resolvedPluginIds } : {},
				expectedPending
			});
			if (committed) expectedPending = structuredClone(committed);
			return true;
		} catch (error) {
			if (!(error instanceof DeferredPluginMigrationConflictError)) throw error;
			expectedPending = structuredClone(error.pending);
			previousById.clear();
			deferred = error.pending;
			completedIds.clear();
			statelessPluginIds.clear();
			runtimePluginAliases.clear();
			inspectedStatelessPluginIds.clear();
			refreshSnapshot = true;
			for (const plugin of deferred) {
				previousById.set(plugin.pluginId, plugin);
				reportPending(plugin);
			}
			return false;
		}
	};
	return {
		deferred: () => deferred,
		hasPending: () => previousById.size > 0,
		prepare,
		snapshotOptions: async () => {
			await loadPrevious();
			return {
				preparePluginMigrations: !prepared && params.enabled ? prepare : void 0,
				deferredPluginMigrations: [...previousById.values()]
			};
		},
		async migrate(config) {
			const { autoMigrateLegacyPluginDoctorState } = await import("./state-migrations.plugin-doctor-C5waNaBh.mjs");
			params.report(await params.measure("plugin-doctor-migrations", () => params.runWithPluginMetadataSnapshot({ config }, () => autoMigrateLegacyPluginDoctorState({
				config,
				env: params.env(),
				log: params.log,
				...params.doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {}
			}))));
		},
		converged(pending, snapshot, metadata, inspection) {
			learn(inspection);
			deferred = pending.map((plugin) => retain(Object.assign(resolveDeferredPluginMigrationConfigPaths({
				config: snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig,
				pluginId: plugin.pluginId,
				compatibilityMigrationPaths: metadata?.plugins.find((record) => record.id === plugin.pluginId)?.configContracts?.compatibilityMigrationPaths
			}), plugin)));
			remember();
			if (!persistPending([...previousById.values()])) return;
			for (const plugin of deferred) reportPending(plugin);
		},
		observe(result) {
			for (const pluginId of result.requiredPluginIds ?? []) {
				const pending = previousById.get(pluginId);
				if (pending) previousById.set(pluginId, {
					...pending,
					requiresStateMigration: true
				});
			}
			for (const pluginId of result.statelessPluginIds ?? []) inspectedStatelessPluginIds.add(pluginId);
			for (const pluginId of result.completedPluginIds ?? []) completedIds.add(pluginId);
		},
		complete() {
			if (!params.enabled) return false;
			const unavailableIds = new Set(deferred.map((plugin) => plugin.pluginId));
			const resolvedPluginIds = [...previousById.values()].filter((plugin) => {
				if (completedIds.has(plugin.pluginId)) return true;
				if (plugin.requiresStateMigration || unavailableIds.has(plugin.pluginId)) return false;
				if (inspectedStatelessPluginIds.has(plugin.pluginId)) return true;
				if (plugin.requiresDoctorInspection) return false;
				return statelessPluginIds.has(plugin.pluginId) || runtimePluginAliases.has(plugin.pluginId) && !plugin.validationExcludedPaths?.length && (plugin.configPaths ?? []).every((segments) => segments.length === 2 && segments[0] === "session" && segments[1] === "store");
			}).map((plugin) => plugin.pluginId);
			const resolvedIds = new Set(resolvedPluginIds);
			const pending = [...previousById.values()].filter((plugin) => !resolvedIds.has(plugin.pluginId)).map((plugin) => unavailableIds.has(plugin.pluginId) ? plugin : Object.assign(plugin, {
				reason: "The installed plugin has not confirmed that its saved data and settings are ready for this version. If Doctor cannot finish the upgrade, report this warning to the plugin maintainer.",
				command: "openclaw doctor --fix"
			}));
			if (resolvedPluginIds.length === 0 && pending.length === 0) return refreshSnapshot;
			if (!persistPending(pending, resolvedPluginIds)) return true;
			for (const pluginId of resolvedPluginIds) previousById.delete(pluginId);
			for (const plugin of pending) {
				previousById.set(plugin.pluginId, plugin);
				reportPending(plugin);
			}
			return refreshSnapshot || resolvedPluginIds.length > 0;
		}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight-plugin-verification.ts
async function planStartupPluginVerification(params) {
	const { planStartupPluginConvergence } = await measureDoctorConfigPreflightStep("plugin-plan-import", () => import("./startup-plugin-convergence-plan-BF7ViuPW.mjs"), params.measure);
	return await measureDoctorConfigPreflightStep("plugin-plan", () => planStartupPluginConvergence({
		config: params.cfg,
		env: params.env
	}), params.measure);
}
function isStartupPluginVerificationFailureActive(params) {
	return resolveEffectiveEnableState({
		id: params.failure.pluginId,
		origin: "global",
		config: normalizePluginsConfig(params.cfg.plugins),
		rootConfig: params.cfg
	}).enabled;
}
function buildStartupPluginQuarantine(params) {
	return buildDegradedPluginsFromVerificationFailures(params.failures.filter((failure) => isStartupPluginVerificationFailureActive({
		cfg: params.cfg,
		failure
	})));
}
function formatStartupPluginSmokeFailure(failure) {
	return describePluginAvailabilityFailure(failure.pluginId, formatPluginVerificationDiagnostic({
		kind: "plugin-verification",
		reason: failure.reason,
		detail: failure.detail,
		...failure.installPath ? { installPath: failure.installPath } : {}
	})).message;
}
async function runDoctorPluginConvergence(params) {
	const plan = await planStartupPluginVerification(params);
	if (!plan.required) return { quarantinedPlugins: [] };
	const { inspectPluginMigrationAvailability } = await import("./plugin-migration-availability-Dww6xZVn.mjs");
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
	const { runPostCorePluginConvergence } = await measureDoctorConfigPreflightStep("plugin-convergence-import", () => import("./post-core-plugin-convergence-4cmwX6Ae.mjs"), params.measure);
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
	const { runActivePluginPayloadSmokeCheck } = await measureDoctorConfigPreflightStep("plugin-payload-verification-import", () => import("./active-payload-verification-CY_njyLg.mjs"), params.measure);
	const smoke = await measureDoctorConfigPreflightStep("plugin-payload-verification", () => runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records,
		env: params.env
	}), params.measure);
	const result = mapStartupPluginQuarantineRefresh({
		cfg: params.cfg,
		failures: smoke.failures
	});
	if (result.quarantinedPlugins.length > 0) note(result.quarantinedPlugins.map((plugin) => `- ${formatStartupPluginSmokeFailure({
		pluginId: plugin.pluginId,
		reason: plugin.diagnostic.reason,
		detail: plugin.diagnostic.detail,
		...plugin.diagnostic.installPath ? { installPath: plugin.diagnostic.installPath } : {}
	})}`).join("\n"), `Doctor ${PLUGIN_AVAILABILITY_POLICY.severity}s`);
	return result;
}
function mapStartupPluginQuarantineRefresh(params) {
	const quarantinedPlugins = buildStartupPluginQuarantine(params);
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
//#region src/commands/doctor-startup-migration-refusal.ts
function throwStartupMigrationRefusal(message, cause) {
	console.error(message);
	throw Object.assign(new ExitError(78, message), { cause });
}
function throwStartupMigrationGuardRejected() {
	throw new Error("OpenClaw startup migrations were skipped because the selected config changed during startup; refusing to report the gateway ready. Retry startup so the new config can be validated.");
}
function throwStartupMigrationIdentityChanged(reason) {
	throwStartupMigrationRefusal(`OpenClaw migration inputs changed during startup${reason ? ` (${reason})` : ""}; refusing to report the gateway ready. Restart OpenClaw so state migrations run against the final config and plugin inventory.`);
}
/**
* A gateway startup that will refuse readiness must stay side-effect-free: a live owner of
* this state directory means every pending startup write (config-health recovery, sidecar
* quarantine, automatic migrations) would mutate its files before the runtime lock refuses.
* Probe-only: the runtime lock stays owned by the gateway run loop's restart lifecycle.
* Test runs skip the probe like acquireGatewayLock does (locks are disabled under Vitest).
* Returns the refusal message so each mutation boundary can report through its own runtime.
*/
async function describeLiveGatewayOwnerStartupBlocker(env) {
	if (env.VITEST || env.NODE_ENV === "test") return;
	const { readActiveGatewayLockIdentity } = await import("./gateway-lock-Iihe0f2N.mjs");
	const activeGateway = await readActiveGatewayLockIdentity({ env });
	if (!activeGateway) return;
	return `Another gateway (pid ${activeGateway.pid}) already owns this state directory; refusing to run automatic startup migrations or report the gateway ready. Stop it with "openclaw gateway stop" (or select a different OPENCLAW_STATE_DIR), then retry startup.`;
}
async function refuseStartupMigrationsForLiveGatewayOwner(env) {
	const blocker = await describeLiveGatewayOwnerStartupBlocker(env);
	if (blocker) throwStartupMigrationRefusal(blocker);
}
//#endregion
//#region src/commands/doctor-config-preflight-startup.ts
/** Admit the same config and state before the lease and again before migration writes. */
async function readStartupMigrationSnapshot(params) {
	return await withArtifactPreservingStateReads(async () => {
		await measureDoctorConfigPreflightStep("admission.live-owner", () => refuseStartupMigrationsForLiveGatewayOwner(params.env));
		try {
			const selected = await measureDoctorConfigPreflightStep("admission.core-config", () => readConfigFileSnapshot({
				observe: false,
				isolateEnv: true,
				pluginValidation: "core-only",
				deferredPluginMigrations: params.deferredPluginMigrations
			}));
			const recoveryOptions = {
				configPath: selected.path,
				observe: false,
				env: params.env
			};
			const coreRecovery = await measureDoctorConfigPreflightStep("admission.core-recovery", () => createConfigIO({
				...recoveryOptions,
				pluginValidation: "core-only",
				deferredPluginMigrations: params.deferredPluginMigrations
			}).prepareConfigRecovery(selected));
			const candidate = coreRecovery?.snapshot ?? selected;
			const startupConfig = resolveStartupConfigSnapshot(candidate);
			const { prepareDoctorDatabasePreflight } = await import("./doctor-database-preflight-l8VsfrNH.mjs");
			const databases = await prepareDoctorDatabasePreflight({ cfg: startupConfig?.sourceConfig ?? candidate.sourceConfig ?? candidate.config });
			const deferredPluginMigrations = await measureDoctorConfigPreflightStep("admission.plugin-migrations", () => params.preparePluginMigrations?.(candidate));
			if (startupConfig) await params.validateConfig?.(startupConfig);
			let read = await withDeferredPluginDoctorMigrations(deferredPluginMigrations?.map((entry) => entry.pluginId) ?? [], () => withOpenClawStateDatabaseReadSnapshot(async () => coreRecovery || deferredPluginMigrations?.length ? {
				...await createConfigIO({
					...recoveryOptions,
					env: cloneEnvWithPlatformSemantics(params.env),
					...deferredPluginMigrations ? { deferredPluginMigrations } : {}
				}).readConfigFileSnapshotWithPluginMetadata({ allowCurrentPluginMetadata: false }),
				pluginMigrationFingerprint: null
			} : await params.readSnapshot(), { env: params.env }));
			assertStartupConfigUnchanged(selected, read.snapshot);
			const recovery = await measureDoctorConfigPreflightStep("admission.config-recovery", () => createConfigIO(recoveryOptions).prepareConfigRecovery(read.snapshot));
			if (Boolean(coreRecovery) !== Boolean(recovery)) throwStartupMigrationIdentityChanged();
			if (recovery) {
				assertStartupConfigUnchanged(candidate, recovery.snapshot);
				read = {
					snapshot: recovery.snapshot,
					pluginMetadataSnapshot: recovery.pluginMetadataSnapshot,
					pluginMigrationFingerprint: recovery.pluginMetadataSnapshot?.configFingerprint?.trim() || null
				};
			}
			const repair = read.snapshot.valid ? null : params.planRepair(read);
			if (!read.snapshot.valid && !repair) throw new Error("OpenClaw config is invalid; run \"openclaw doctor --fix\" before startup.");
			await params.validateConfig?.(repair?.snapshot ?? read.snapshot);
			if (params.beforeStateMigrations && !await measureDoctorConfigPreflightStep("admission.config-guard", () => params.beforeStateMigrations?.(read.snapshot))) throwStartupMigrationGuardRejected();
			return {
				...read,
				pendingDatabasePaths: databases.pendingMigrations?.map((database) => database.path) ?? [],
				...recovery ? { recovery } : {}
			};
		} catch (error) {
			if (error instanceof ExitError) throw error;
			return throwStartupMigrationRefusal(formatErrorMessage(error), error);
		}
	});
}
/** Preserve the old database generation before image replacement advances its schemas. */
async function backupStartupMigrationDatabases(params) {
	const { detectOpenClawStateDatabaseSchemaMigrations } = await import("./openclaw-state-db-schema-discovery-BW__9RA2.mjs");
	const sharedPath = resolveOpenClawStateSqlitePath(params.env);
	const pending = new Set(params.pendingDatabasePaths);
	if (detectOpenClawStateDatabaseSchemaMigrations({ env: params.env }).length > 0) pending.add(sharedPath);
	if (pending.size === 0) return {
		changes: [],
		warnings: []
	};
	if (existsSync(sharedPath)) pending.add(sharedPath);
	const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-D-OIQRA4.mjs");
	const { sanitizeOpenClawStateLeaseRows } = await import("./openclaw-state-snapshot-sanitizer-DE6aWVeK.mjs");
	const backupId = randomUUID();
	const changes = [];
	for (const sourcePath of new Set([...pending].map((pathname) => realpathSync.native(pathname)))) {
		params.lease.heartbeat();
		const backup = await createVerifiedSqliteSnapshot({
			sourcePath,
			targetPath: `${sourcePath}.pre-startup-migration-${backupId}.bak`,
			preserveRowIds: true,
			transform: sanitizeOpenClawStateLeaseRows,
			beforePublish: () => params.lease.heartbeat()
		});
		params.lease.heartbeat();
		changes.push(`Saved pre-migration SQLite backup: ${backup.path}`);
	}
	return {
		changes,
		warnings: []
	};
}
function assertStartupConfigUnchanged(before, after) {
	const change = describeConfigSnapshotInputChange(before, after);
	if (change) throwStartupMigrationIdentityChanged(change);
}
/** Runtime readiness is checked after the leased Doctor migration has completed. */
async function assertStartupStateMigrationReady(params) {
	const { assertOpenClawDatabasesReady } = await measureDoctorConfigPreflightStep("admission.database-runtime-import", () => import("./openclaw-database-preflight-DwZaE6VW.mjs"));
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
		import("./startup-migration-BiLXyJka.mjs"),
		import("./targets-D9kWQ1Aj.mjs"),
		import("./openclaw-agent-db-registry-BwwhvyvB.mjs")
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
		targets,
		registeredDatabases
	}), void 0, () => ({ targetCount: targets.length }));
	recordStartupMigrationWarnings(listAgentDatabaseAdmissionRefusals({ env: params.env }).filter((refusal) => canIsolateAgentDatabase(params.cfg, refusal.agentId)).map((refusal) => `${refusal.reason}\n${refusal.repairHint}`));
	const { assertConfiguredWorkspaceStateReady } = await measureDoctorConfigPreflightStep("admission.workspace-runtime-import", () => import("./workspace-state-dirs-C5SXBV5U.mjs"));
	await measureDoctorConfigPreflightStep("admission.workspace-readiness", () => assertConfiguredWorkspaceStateReady(params), void 0, () => ({ agentCount }));
}
/** Settle package repairs before state migrations select their plugin owners. */
async function prepareDoctorMigrationPlugins(params) {
	if (params.converge) params.lease?.heartbeat();
	const convergence = await (params.converge ? runDoctorPluginConvergence : refreshStartupPluginQuarantine)(params);
	setActiveDegradedPlugins(convergence.quarantinedPlugins);
	params.onWarnings(convergence.warnings ?? []);
	params.lease?.heartbeat();
	params.onDeferredPlugins(convergence.deferredPlugins ?? [], convergence.migrationInspection);
	if (!params.converge) return params.snapshotRead;
	const refreshed = await params.readRefreshedSnapshot();
	assertStartupConfigUnchanged(params.snapshotRead.snapshot, refreshed.snapshot);
	if (params.beforeStateMigrations && !await measureDoctorConfigPreflightStep("converged-config-guard", () => params.beforeStateMigrations?.(refreshed.snapshot), params.measure)) throwStartupMigrationGuardRejected();
	return refreshed;
}
/** Completes startup verification and returns the accepted config and metadata generation. */
async function completeStartupMigrationPreflight(params) {
	let snapshotRead = params.snapshotRead;
	const snapshot = snapshotRead.snapshot;
	if (params.gatewayStartupCheckpointRequired && snapshot.valid) await assertStartupStateMigrationReady({
		cfg: snapshot.runtimeConfig ?? snapshot.config,
		env: params.startupMigrationEnv
	});
	if ((params.shouldRecordStateCheckpoint || params.shouldRecordStartupCheckpoint) && params.startupMigrationHeartbeatError) throw params.startupMigrationHeartbeatError instanceof Error ? params.startupMigrationHeartbeatError : /* @__PURE__ */ new Error("OpenClaw startup migration lease heartbeat failed.");
	if (params.shouldRecordStateCheckpoint && params.stateMigrationsAllowed && params.freshConfigGuardAllowed && params.startupMigrationWarnings.length === 0 && snapshot.valid) {
		if (!params.migrationCheckpoint) throw new Error("OpenClaw state migration checkpoint module was not loaded.");
		params.migrationCheckpoint.recordSuccessfulStateMigrations({
			env: params.startupMigrationEnv,
			identity: params.migrationCheckpointIdentity,
			lease: params.startupMigrationLease
		});
	}
	if (params.gatewayStartupCheckpointRequired) {
		if (snapshot.valid && params.shouldRecordStartupCheckpoint) {
			const convergedSnapshotRead = await params.readConfigSnapshotForPreflight(false);
			const convergedBaseConfig = convergedSnapshotRead.snapshot.sourceConfig ?? convergedSnapshotRead.snapshot.config ?? {};
			const convergedIdentity = resolveMigrationCheckpointIdentity({
				snapshot: convergedSnapshotRead.snapshot,
				baseConfig: convergedBaseConfig,
				pluginMigrationFingerprint: convergedSnapshotRead.pluginMigrationFingerprint
			});
			if (params.hasPendingPluginMigrations && !params.migrationCheckpointIdentity && !convergedIdentity) assertStartupConfigUnchanged(snapshot, convergedSnapshotRead.snapshot);
			else if (!migrationCheckpointIdentitiesMatch(params.migrationCheckpointIdentity, convergedIdentity)) throwStartupMigrationIdentityChanged();
			snapshotRead = convergedSnapshotRead;
		}
		recordStartupMigrationWarnings(params.startupMigrationWarnings);
	}
	if (params.shouldRecordStartupCheckpoint && params.startupMigrationWarnings.length === 0) {
		if (!params.migrationCheckpoint) throw new Error("OpenClaw startup migration checkpoint module was not loaded.");
		params.migrationCheckpoint.recordSuccessfulStartupMigrations({
			env: params.startupMigrationEnv,
			identity: params.migrationCheckpointIdentity,
			lease: params.startupMigrationLease
		});
	}
	return snapshotRead;
}
async function completeDoctorPreflightMigrations(params) {
	const scopedRefusals = params.stepReceipts.filter((receipt) => receipt.outcome === "refused" && (receipt.refusal?.code === "agent-database-ownership-mismatch" || receipt.refusal?.code === "blocked-by-agent-database-refusal") && receipt.refusedAgentDatabasePaths?.length);
	const admissions = scopedRefusals.length > 0 ? await evaluateAgentDatabaseAdmissions(params.cfg) : [];
	if (scopedRefusals.length > 0) recordAgentDatabaseAdmissions(admissions, { source: getAgentDatabaseStartupAdmission() ? "startup" : "diagnostic" });
	const isolatedPaths = new Set(admissions.filter((refusal) => refusal.code !== "agent-database-ownership-mismatch" || canIsolateAgentDatabase(params.cfg, refusal.agentId)).flatMap((refusal) => refusal.paths.map((pathname) => path.resolve(pathname))));
	for (const receipt of scopedRefusals) if (receipt.refusedAgentDatabasePaths?.every((pathname) => isolatedPaths.has(path.resolve(pathname)))) receipt.outcome = "warning";
	try {
		throwIfDoctorStateMigrationRefused(params.stepReceipts);
		if (params.startup) {
			params.startup.lease?.heartbeat();
			const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-DBgiScpz.mjs");
			await noteSessionTranscriptHealth({
				cfg: params.cfg,
				env: params.startup.env,
				shouldRepair: true,
				postSessionPluginMigration: params.startup.postSessionPluginMigration,
				postSessionPluginMigrationPlanBound: true,
				onStepReceipt: (receipt) => params.stepReceipts.push(receipt)
			});
			throwIfDoctorStateMigrationRefused(params.stepReceipts);
		}
	} catch (error) {
		if (error instanceof DoctorStateMigrationRefusalError) {
			const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-C5SXBV5U.mjs");
			try {
				await assertConfiguredWorkspaceStateReady({
					cfg: params.cfg,
					operation: "doctor"
				});
			} catch (workspaceError) {
				params.report({
					changes: [],
					warnings: [String(workspaceError)]
				});
			}
		}
		throw error;
	}
}
function noteStateMigrationResult(result, collectedWarnings, quietWarnings = false) {
	collectedWarnings?.push(...result.warnings);
	for (const key of [
		"changes",
		"notices",
		"warnings"
	]) {
		if (key === "warnings" && quietWarnings) continue;
		if (result[key]?.length) note(result[key].map((entry) => `- ${entry}`).join("\n"), `Doctor ${key}`);
	}
}
//#endregion
//#region src/commands/doctor-config-preflight-worker-scope.ts
async function withDoctorConfigPreflightWorkerScope(options, run) {
	if (options.migrateState !== false && (options.requireStartupMigrationCheckpoint === true || options.doctorOnlyStateMigrations === true)) {
		const { withSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-C5WaWbM2.mjs");
		return await withSqliteReadOnlyWorkerScope(async () => {
			if (!options.requireStartupMigrationCheckpoint) return run(options);
			try {
				const { beginDoctorMaintenance } = await import("./doctor-maintenance-DotE60K-.mjs");
				const maintenance = await beginDoctorMaintenance({
					options: {
						repair: true,
						nonInteractive: true
					},
					root: null,
					runtime: defaultRuntime
				});
				if (!maintenance) throw new Error("Startup state migration requires Doctor maintenance ownership.");
				try {
					return await maintenance.run(() => run({
						...options,
						doctorOnlyStateMigrations: true,
						invocationPurpose: "startup"
					}));
				} finally {
					await maintenance.release();
				}
			} catch (error) {
				if (error instanceof ExitError) throw error;
				const message = error instanceof DoctorStateMigrationRefusalError ? formatStartupMigrationFailure(error.stepReceipts.filter((receipt) => receipt.outcome === "refused").flatMap((receipt) => receipt.warnings)) : formatErrorMessage(error);
				return throwStartupMigrationRefusal(message, new StartupMaintenanceRequiredError("state-migrations", message, { cause: error }));
			}
		});
	}
	return await run(options);
}
//#endregion
//#region src/commands/doctor-config-preflight.cron.ts
/** Preserve a retired partition selector even when other config cannot drive core migrations. */
async function migrateRetainedStore(params) {
	const cfg = retainStoreConfig(params.config);
	if (!cfg) return;
	const { repairLegacyCronStoreWithoutPrompt } = await params.measure("cron-repair-import", () => import("./legacy-repair-BVTO_tra.mjs"));
	params.report(await params.measure("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
		cfg,
		migrateCodexModelRefs: false
	})));
	const { migrateLegacyConfigMachineState } = await import("./state-migrations.config-machine-state-DunIbWu6.mjs");
	params.report(migrateLegacyConfigMachineState({
		config: params.config,
		env: params.env
	}));
}
/** Restores retired cron migration inputs that canonical config migration intentionally strips. */
function withLegacyConfig(config, legacyConfig) {
	const legacyCron = legacyConfig?.cron;
	if (!legacyCron || !Object.hasOwn(legacyCron, "store") && !Object.hasOwn(legacyCron, "webhook")) return config;
	return {
		...config,
		cron: {
			...config.cron,
			...Object.hasOwn(legacyCron, "store") ? { store: legacyCron.store } : {},
			...Object.hasOwn(legacyCron, "webhook") ? { webhook: legacyCron.webhook } : {}
		}
	};
}
/** Isolates the trusted partition selector from a partially valid legacy config. */
function retainStoreConfig(config) {
	const cron = config?.cron;
	if (typeof cron?.store !== "string" || !cron.store.trim()) return;
	return { cron: {
		store: cron.store,
		...Object.hasOwn(cron, "webhook") ? { webhook: cron.webhook } : {}
	} };
}
//#endregion
//#region src/commands/doctor-update-run.ts
/** Startup and proven-pristine preflights do not need a public ledger snapshot. */
async function noteStaleUpdateRuns(options) {
	if (options.requireStartupMigrationCheckpoint || options.skipPristineStartupStateMigrations) return;
	const [{ staleUpdateRunGuidance }, { listUpdateRunsAsync }, { renderUpdateRunReport }, { updateRunWarningMessages }, { readInstalledUpdateCandidate, reconcileInterruptedUpdateRuns }, { isAcknowledgedAbandonedUpdateRun }] = await Promise.all([
		import("./update-run-activity-DmOL6PSU.mjs"),
		import("./update-run-reader-L6zLrVuS.mjs"),
		import("./update-run-report-B66hJNts.mjs"),
		import("./update-run-step-DNyIdJae.mjs"),
		import("./update-run-interruption-Dk7JNxjg.mjs"),
		import("./update-run-record-D5N5LnfR.mjs")
	]);
	if (options.migrateState !== false) try {
		for (const run of await reconcileInterruptedUpdateRuns()) note(`Update ${run.runId}: recorded succeeded after verifying the installed and serving candidate build ${run.after.buildId}; its updater exited before recording completion.`, "Update history");
	} catch (error) {
		note(`Update history reconciliation could not complete: ${String(error)}`, "Update history");
	}
	for (const run of await listUpdateRunsAsync({
		active: true,
		limit: 100
	})) {
		const guidance = staleUpdateRunGuidance(run);
		if (guidance) note(`Update ${run.runId}: ${guidance}`, "Update history");
	}
	const history = await listUpdateRunsAsync({ limit: 100 });
	for (const run of history) if (run.status === "failed" && run.reason === "abandoned" && !isAcknowledgedAbandonedUpdateRun(run)) {
		const reason = readInstalledUpdateCandidate(run) ? "the recorded candidate has not been verified as installed and serving" : "the target build was not recorded, so current version equality cannot prove this update completed";
		note(`Update ${run.runId} remains abandoned: ${reason}. Run \`openclaw update repair\` to repair the installation and reconcile its history.`, "Update history");
	}
	const [latest] = history;
	if (latest) {
		if (latest.status === "failed" && latest.reason && (latest.reason === "update-activation-timeout" || UPDATE_ENVIRONMENT_FAILURE_REASONS.has(latest.reason))) note(`Update ${latest.runId}: ${renderUpdateRunReport(latest).markdown}`, "Update history");
		const warnings = updateRunWarningMessages(latest.steps);
		if (warnings.length) note(`Recorded warnings from update ${latest.runId} (a later repair may have resolved them):\n${warnings.slice(-3).join("\n")}`, "Update history");
	}
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for doctor: legacy config/state migration, recovery, and snapshot loading. */
const loadState = createLazyRuntimeModule(() => import("./state-migrations.state-dir-CfL7PZpw.mjs"));
const loadCronRepair = createLazyRuntimeModule(() => import("./legacy-repair-BVTO_tra.mjs"));
/**
* Runs early doctor config checks before the main config repair flow.
*
* It may migrate legacy state/config paths, recover corrupt target config when requested, and
* returns the best-effort config snapshot used by later doctor checks.
*/
async function runDoctorConfigPreflight(options = {}) {
	return await withDoctorConfigPreflightWorkerScope(options, runDoctorConfigPreflightOperation);
}
async function runDoctorConfigPreflightOperation(options) {
	const stateMigrationsRequested = options.migrateState !== false;
	const skipLegacyParentConfigWrite = shouldSkipLegacyUpdateDoctorConfigWrite(process.env);
	const gatewayStartupCheckpointRequired = options.requireStartupMigrationCheckpoint === true;
	const migrationLog = gatewayStartupCheckpointRequired ? {
		info() {},
		warn() {}
	} : void 0;
	if (stateMigrationsRequested) await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(process.env),
		env: process.env,
		recoverOrphanedSidecars: !gatewayStartupCheckpointRequired
	});
	await noteStaleUpdateRuns(options);
	const measurePreflightStep = (name, run) => measureDoctorConfigPreflightStep(name, run, options.measure);
	let migrationCheckpoint = gatewayStartupCheckpointRequired || options.requireStateMigrationCheckpoint === true ? await measurePreflightStep("startup-checkpoint-import", () => import("./startup-migration-checkpoint-DhDQMo4-.mjs")) : void 0;
	let startupMigrationEnv = process.env;
	let shouldRecordStateCheckpoint = false;
	let shouldRecordStartupCheckpoint = false;
	let shouldPersistRefreshedPluginIndex = false;
	let migrationCheckpointIdentity = null;
	let skipPristineStartupStateMigrations = options.skipPristineStartupStateMigrations === true;
	let skipPristineCoreStateMigrations = skipPristineStartupStateMigrations || options.skipPristineCoreStateMigrations === true;
	let startupMigrationLease;
	let startupMigrationHeartbeat;
	const startupMigrationWarnings = [];
	let modelBillingRouteMigrationSource;
	const cronCodexRuntimePolicyTargets = [];
	const stateMigrationStepReceipts = [];
	let postSessionPluginMigration;
	let postSessionPluginMigrationPlanBound = false;
	let doctorMediaPersistenceAttempted = false;
	let configSnapshotRead;
	let pluginInstallConfigImport;
	const pluginMigrations = createDoctorPluginMigrationPreparation({
		enabled: stateMigrationsRequested,
		env: () => startupMigrationEnv,
		beforePersistentEffect: () => startupMigrationLease?.heartbeat(),
		report: (result) => noteStartupStateMigrationResult(result),
		recordReceipt: (receipt) => stateMigrationStepReceipts.push(receipt),
		measure: measurePreflightStep,
		runWithPluginMetadataSnapshot: (scope, run) => pluginMetadata.run(scope, run),
		doctorOnlyStateMigrations: options.doctorOnlyStateMigrations === true,
		log: migrationLog
	});
	const hasPendingPluginInstallConfig = (snapshot) => !skipLegacyParentConfigWrite && inspectShippedPluginInstallConfigRecords(snapshot.sourceConfig).status === "valid";
	const pluginMetadata = createDoctorPluginMetadataSnapshotScope({
		getBaseSnapshot: () => configSnapshotRead?.pluginMetadataSnapshot,
		env: process.env,
		getDeferredPluginIds: () => pluginMigrations.deferred().map((pending) => pending.pluginId)
	});
	const refreshMigrationCheckpoint = (checkpoint, snapshotRead, inspectedStatus) => {
		const { snapshot } = snapshotRead;
		migrationCheckpointIdentity = checkpointIdentityForSnapshot(snapshotRead);
		shouldRecordStateCheckpoint = stateMigrationsRequested;
		shouldRecordStartupCheckpoint = gatewayStartupCheckpointRequired;
		if (shouldRecordStateCheckpoint || shouldRecordStartupCheckpoint) {
			const checkpointStatus = inspectedStatus ?? checkpoint.readMigrationCheckpointStatus({
				env: startupMigrationEnv,
				identity: migrationCheckpointIdentity
			});
			shouldRecordStateCheckpoint &&= checkpointStatus === "stale";
			shouldRecordStartupCheckpoint &&= checkpointStatus !== "startup-current";
		}
		shouldRecordStartupCheckpoint ||= gatewayStartupCheckpointRequired && hasPendingPluginInstallConfig(snapshot);
		shouldPersistRefreshedPluginIndex = needsRefreshedPluginIndexPersistence(snapshotRead);
	};
	const ensureStartupMigrationLease = async () => {
		if (startupMigrationHeartbeat || !migrationCheckpoint) return;
		startupMigrationLease ??= await migrationCheckpoint.acquireStartupMigrationLeaseWithWait({ env: startupMigrationEnv });
		startupMigrationHeartbeat = keepStartupMigrationLeaseAlive(startupMigrationLease, migrationCheckpoint.STARTUP_MIGRATION_HEARTBEAT_INTERVAL_MS);
		configSnapshotRead = gatewayStartupCheckpointRequired ? await readAdmittedStartupSnapshot() : await readConfigSnapshotForPreflight(false);
		refreshMigrationCheckpoint(migrationCheckpoint, configSnapshotRead);
		if (!shouldRecordStateCheckpoint && !shouldRecordStartupCheckpoint && !shouldPersistRefreshedPluginIndex && !hasPendingPluginInstallConfig(configSnapshotRead.snapshot) && !configSnapshotRead.recovery) {
			startupMigrationHeartbeat.stop();
			startupMigrationHeartbeat = void 0;
			startupMigrationLease.release();
			startupMigrationLease = void 0;
			return;
		}
		if (gatewayStartupCheckpointRequired) noteStartupStateMigrationResult(await backupStartupMigrationDatabases({
			env: startupMigrationEnv,
			lease: startupMigrationLease,
			pendingDatabasePaths: configSnapshotRead.pendingDatabasePaths ?? []
		}));
		await configSnapshotRead.recovery?.apply(startupMigrationLease.heartbeat);
	};
	const noteStartupStateMigrationResult = (result) => {
		pluginMigrations.observe(result);
		noteStateMigrationResult(result, startupMigrationWarnings, gatewayStartupCheckpointRequired);
	};
	const getSnapshotPreparation = createDoctorRehearsalSnapshotPreparation(noteStartupStateMigrationResult);
	const { planScopedConfigRepair, planAdmittedConfigRepair } = createDoctorConfigRepairPlanner({
		options,
		gatewayStartupCheckpointRequired,
		stateMigrationsRequested,
		skipLegacyParentConfigWrite,
		hasImportedPluginConfig: () => pluginInstallConfigImport !== void 0,
		runWithPluginMetadataSnapshot: pluginMetadata.run
	});
	const migrateLegacyConfigIfNeeded = createDoctorLegacyConfigMigration({
		enabled: options.migrateLegacyConfig !== false,
		measure: measurePreflightStep
	});
	const readConfigSnapshotForPreflight = async (allowCurrentPluginMetadata = true) => await measurePreflightStep("config-snapshot", async () => readDoctorConfigPreflightSnapshot({
		allowCurrentPluginMetadata,
		includePluginMetadata: Boolean(migrationCheckpoint) || options.preparePluginMetadataSnapshot === true,
		measure: options.measure,
		observe: gatewayStartupCheckpointRequired ? false : options.observe,
		preparePluginMetadataSnapshot: options.preparePluginMetadataSnapshot === true,
		skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight(),
		prepareSnapshot: getSnapshotPreparation(options.doctorOnlyStateMigrations === true),
		...await pluginMigrations.snapshotOptions()
	}));
	const readAdmittedStartupSnapshot = async () => readStartupMigrationSnapshot({
		env: startupMigrationEnv,
		readSnapshot: () => readConfigSnapshotForPreflight(false),
		planRepair: (read) => {
			configSnapshotRead = read;
			return shouldSkipPluginValidationForDoctorConfigPreflight() ? null : planScopedConfigRepair(read.snapshot);
		},
		validateConfig: options.validateStartupConfig,
		beforeStateMigrations: options.beforeStateMigrations,
		preparePluginMigrations: pluginMigrations.prepare,
		deferredPluginMigrations: (await pluginMigrations.snapshotOptions()).deferredPluginMigrations
	});
	try {
		if (migrationCheckpoint && !skipPristineStartupStateMigrations) {
			const { planPristineStartupStateMigrations } = await measurePreflightStep("pristine-state-plan-import", () => import("./pristine-startup-state-DgJs0k6t.mjs"));
			const pristineStatePlan = await measurePreflightStep("pristine-state-plan", () => planPristineStartupStateMigrations(process.env));
			skipPristineStartupStateMigrations = pristineStatePlan.skipAllStateMigrations;
			skipPristineCoreStateMigrations ||= pristineStatePlan.skipCoreStateMigrations;
		}
		if (skipPristineStartupStateMigrations && !gatewayStartupCheckpointRequired) migrationCheckpoint = void 0;
		const stateMigrationsAllowed = !stateMigrationsRequested || gatewayStartupCheckpointRequired || options.beforeStateMigrations === void 0 || await measurePreflightStep("state-migration-guard", () => withArtifactPreservingStateReads(() => options.beforeStateMigrations?.()));
		if (migrationCheckpoint) {
			if (!gatewayStartupCheckpointRequired) await migrateLegacyConfigIfNeeded();
			configSnapshotRead = gatewayStartupCheckpointRequired ? await readAdmittedStartupSnapshot() : await readConfigSnapshotForPreflight();
			startupMigrationEnv = cloneEnvWithPlatformSemantics(process.env);
			const inspected = await migrationCheckpoint.inspectStartupMigrationCheckpointWithLease({
				env: startupMigrationEnv,
				identity: checkpointIdentityForSnapshot(configSnapshotRead),
				stateMigrations: stateMigrationsRequested,
				startupMigrations: gatewayStartupCheckpointRequired,
				forceLease: needsRefreshedPluginIndexPersistence(configSnapshotRead) || hasPendingPluginInstallConfig(configSnapshotRead.snapshot) || Boolean(configSnapshotRead.recovery)
			});
			startupMigrationLease = inspected.lease;
			refreshMigrationCheckpoint(migrationCheckpoint, configSnapshotRead, inspected.status);
			if (startupMigrationLease) await ensureStartupMigrationLease();
		}
		let stateDirMigrations = stateMigrationsRequested && (!migrationCheckpoint || shouldRecordStateCheckpoint) && !skipPristineStartupStateMigrations ? await measurePreflightStep("state-migrations-import", loadState) : void 0;
		if (stateDirMigrations && stateMigrationsAllowed) {
			const { autoMigrateLegacyStateDir } = stateDirMigrations;
			noteStartupStateMigrationResult(await measurePreflightStep("state-dir-migrations", () => autoMigrateLegacyStateDir({
				env: process.env,
				log: migrationLog
			})));
		}
		await migrateLegacyConfigIfNeeded();
		if (!configSnapshotRead || stateDirMigrations) configSnapshotRead = await readConfigSnapshotForPreflight(!stateDirMigrations);
		const recovery = await prepareDoctorConfigRecovery({
			enabled: options.repairPrefixedConfig === true && !skipLegacyParentConfigWrite,
			snapshotRead: configSnapshotRead,
			planRepair: planScopedConfigRepair,
			readSnapshot: () => readConfigSnapshotForPreflight(false)
		});
		configSnapshotRead = recovery.snapshotRead;
		let snapshot = configSnapshotRead.snapshot;
		const activeConfigRepair = recovery.activeConfigRepair;
		noteDoctorConfigPreflightIssues(snapshot, {
			invalidConfigNote: options.invalidConfigNote,
			activeRepair: activeConfigRepair !== null
		});
		let baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		let automaticConfigRepair = planAdmittedConfigRepair(snapshot, activeConfigRepair);
		shouldPersistRefreshedPluginIndex = migrationCheckpoint !== void 0 && needsRefreshedPluginIndexPersistence(configSnapshotRead);
		if (shouldPersistRefreshedPluginIndex) await ensureStartupMigrationLease();
		const freshConfigGuardAllowed = !(stateDirMigrations !== void 0 || shouldRecordStateCheckpoint || shouldRecordStartupCheckpoint || shouldPersistRefreshedPluginIndex || automaticConfigRepair !== null && hasPendingPluginInstallConfig(snapshot)) || !stateMigrationsAllowed || options.beforeStateMigrations === void 0 || await measurePreflightStep("fresh-config-guard", () => options.beforeStateMigrations?.(snapshot));
		if (gatewayStartupCheckpointRequired && !freshConfigGuardAllowed) throwStartupMigrationGuardRejected();
		if (options.doctorOnlyStateMigrations === true && stateDirMigrations && stateMigrationsAllowed && freshConfigGuardAllowed && !skipPristineCoreStateMigrations) {
			const { prepareLegacyStateDatabaseSchema } = await import("./state-migrations.doctor-B8VFRySh.mjs");
			const receipt = await measurePreflightStep("state-schema", () => prepareLegacyStateDatabaseSchema(startupMigrationEnv));
			if (receipt.outcome !== "skipped") {
				stateMigrationStepReceipts.push(receipt);
				noteStartupStateMigrationResult({
					changes: receipt.changes,
					warnings: receipt.warnings,
					notices: receipt.notices
				});
				throwIfDoctorStateMigrationRefused(stateMigrationStepReceipts);
			}
		}
		if (automaticConfigRepair && hasPendingPluginInstallConfig(snapshot) && stateMigrationsAllowed && freshConfigGuardAllowed) {
			startupMigrationLease?.heartbeat();
			pluginInstallConfigImport = await importAutomaticConfigRepairInstallRecords(snapshot);
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			assertShippedPluginInstallConfigImportCurrent(snapshot, pluginInstallConfigImport);
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			automaticConfigRepair = planAdmittedConfigRepair(snapshot);
			if (!automaticConfigRepair) throw new Error("Config changed after plugin install migration; retry startup.");
			if (migrationCheckpoint) {
				refreshMigrationCheckpoint(migrationCheckpoint, configSnapshotRead);
				if (pluginInstallConfigImport?.pluginInventoryChanged && stateMigrationsRequested) {
					shouldRecordStateCheckpoint = true;
					if (!stateDirMigrations && !skipPristineStartupStateMigrations) stateDirMigrations = await measurePreflightStep("state-migrations-import", loadState);
				}
			}
		}
		if ((gatewayStartupCheckpointRequired || stateDirMigrations) && stateMigrationsAllowed && freshConfigGuardAllowed && (!gatewayStartupCheckpointRequired || snapshot.valid || automaticConfigRepair)) {
			const refreshed = await prepareDoctorMigrationPlugins({
				cfg: automaticConfigRepair?.config ?? baseConfig,
				env: startupMigrationEnv,
				measure: options.measure,
				converge: !gatewayStartupCheckpointRequired || shouldRecordStartupCheckpoint,
				lease: startupMigrationLease,
				snapshotRead: {
					...configSnapshotRead,
					snapshot
				},
				readRefreshedSnapshot: () => readConfigSnapshotForPreflight(false),
				beforeStateMigrations: options.beforeStateMigrations,
				onWarnings: (warnings) => startupMigrationWarnings.push(...warnings),
				onDeferredPlugins: (pending, inspection) => pluginMigrations.converged(pending, snapshot, configSnapshotRead?.pluginMetadataSnapshot, inspection)
			});
			if (!gatewayStartupCheckpointRequired || shouldRecordStartupCheckpoint) {
				if (migrationCheckpoint && stateMigrationsRequested && configSnapshotRead.pluginMigrationFingerprint !== refreshed.pluginMigrationFingerprint) {
					shouldRecordStateCheckpoint = true;
					if (!stateDirMigrations && !skipPristineStartupStateMigrations) stateDirMigrations = await measurePreflightStep("state-migrations-import", loadState);
				}
				configSnapshotRead = refreshed;
				pluginMetadata.invalidate();
				shouldPersistRefreshedPluginIndex = migrationCheckpoint !== void 0 && needsRefreshedPluginIndexPersistence(refreshed);
				snapshot = refreshed.snapshot;
				baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
				automaticConfigRepair = planAdmittedConfigRepair(snapshot);
			}
		}
		const stateMigrationInput = resolveStateMigrationConfigInput({
			snapshot,
			baseConfig
		});
		if (migrationCheckpoint) migrationCheckpointIdentity = checkpointIdentityForSnapshot({
			...configSnapshotRead,
			snapshot
		}, baseConfig);
		startupMigrationHeartbeat?.throwIfFailed();
		startupMigrationLease?.heartbeat();
		if (stateDirMigrations && stateMigrationsAllowed && freshConfigGuardAllowed) {
			const pluginDoctorOnlyConfig = stateMigrationInput?.pluginDoctorConfig ?? stateMigrationInput?.cfg;
			const pluginDoctorOnly = skipPristineCoreStateMigrations && pluginDoctorOnlyConfig && !retainStoreConfig(pluginDoctorOnlyConfig);
			if (options.doctorOnlyStateMigrations === true && (!stateMigrationInput?.cfg || pluginDoctorOnly)) {
				const { detectLegacyExecApprovals, migrateLegacyExecApprovals } = await import("./state-migrations.exec-approvals-398iYBkj.mjs");
				const stateDir = resolveStateDir(process.env);
				noteStartupStateMigrationResult(await measurePreflightStep("exec-approvals-migration", () => migrateLegacyExecApprovals({
					detected: detectLegacyExecApprovals({
						stateDir,
						doctorOnlyStateMigrations: true
					}),
					stateDir,
					env: process.env
				})));
			}
			if (gatewayStartupCheckpointRequired && (snapshot.valid || automaticConfigRepair)) {
				if (!startupMigrationLease) throw new Error("Startup plugin host-link repair requires the startup migration lease.");
				await measurePreflightStep("plugin-host-link-repair", () => maybeRepairPluginOpenClawHostLinks({
					env: startupMigrationEnv,
					prompter: { shouldRepair: true }
				}));
			}
			const { autoMigrateLegacyTaskStateSidecars } = stateDirMigrations;
			const migrateTaskStateSidecars = async () => noteStartupStateMigrationResult(await measurePreflightStep("task-sidecar-migrations", () => autoMigrateLegacyTaskStateSidecars({
				env: process.env,
				log: migrationLog
			})));
			if (stateMigrationInput) {
				if (pluginDoctorOnly) await pluginMigrations.migrate(pluginDoctorOnlyConfig);
				else if (stateMigrationInput.cfg) {
					const { autoMigrateLegacyState } = await import("./state-migrations.doctor-B8VFRySh.mjs");
					const migrationConfig = stateMigrationInput.cfg;
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					const { collectCronCodexRuntimePolicyTargetsReadOnly, repairLegacyCronStoreWithoutPrompt } = await measurePreflightStep("cron-repair-import", loadCronRepair);
					noteStartupStateMigrationResult(await measurePreflightStep("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
						cfg: withLegacyConfig(migrationConfig, pluginDoctorConfig),
						migrateCodexModelRefs: false
					})));
					if (options.repairPrefixedConfig === true) {
						const cronCodexPlan = await measurePreflightStep("cron-policy-scan", () => collectCronCodexRuntimePolicyTargetsReadOnly({ cfg: migrationConfig }));
						cronCodexRuntimePolicyTargets.push(...cronCodexPlan.targets);
						noteStartupStateMigrationResult({
							changes: [],
							warnings: cronCodexPlan.warnings
						});
					}
					const legacyStateResult = await measurePreflightStep("legacy-state-migrations", () => pluginMetadata.run({ config: pluginDoctorConfig ?? migrationConfig }, () => autoMigrateLegacyState({
						cfg: migrationConfig,
						...pluginDoctorConfig ? { pluginDoctorConfig } : {},
						configIncludedPaths: snapshot.includedPaths ?? [],
						env: process.env,
						log: migrationLog,
						recoverCorruptTargetStore: options.recoverCorruptTargetStore,
						doctorOnlyStateMigrations: options.doctorOnlyStateMigrations,
						invocationPurpose: options.invocationPurpose,
						...options.agentDatabaseMigrationDiscovery ? { agentDatabaseMigrationDiscovery: options.agentDatabaseMigrationDiscovery } : {},
						beforeWorkspaceStateMigration: options.beforeWorkspaceStateMigration,
						onStepReceipt: (receipt) => stateMigrationStepReceipts.push(receipt),
						...gatewayStartupCheckpointRequired ? { allowLegacyDeviceIdentityImport: true } : {}
					})));
					postSessionPluginMigration = legacyStateResult.postSessionPluginMigration;
					postSessionPluginMigrationPlanBound = options.doctorOnlyStateMigrations === true;
					doctorMediaPersistenceAttempted = options.doctorOnlyStateMigrations === true;
					noteStartupStateMigrationResult(legacyStateResult);
					if (options.doctorOnlyStateMigrations === true) await completeDoctorPreflightMigrations({
						cfg: migrationConfig,
						stepReceipts: stateMigrationStepReceipts,
						report: noteStartupStateMigrationResult,
						...gatewayStartupCheckpointRequired ? { startup: {
							env: startupMigrationEnv,
							lease: startupMigrationLease,
							postSessionPluginMigration
						} } : {}
					});
				} else if (stateMigrationInput.pluginDoctorConfig) {
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					await migrateRetainedStore({
						config: pluginDoctorConfig,
						env: process.env,
						measure: measurePreflightStep,
						report: noteStartupStateMigrationResult
					});
					await pluginMigrations.migrate(pluginDoctorConfig);
					await migrateTaskStateSidecars();
				}
			} else await migrateTaskStateSidecars();
		}
		if (stateDirMigrations && stateMigrationsAllowed && freshConfigGuardAllowed && options.doctorOnlyStateMigrations === true && !doctorMediaPersistenceAttempted) {
			const { migrateLegacyMediaPersistence } = await import("./state-migrations.media-persistence-tNdA4aYp.mjs");
			noteStartupStateMigrationResult(await measurePreflightStep("media-persistence-migration", () => migrateLegacyMediaPersistence({ env: process.env })));
		}
		if (stateMigrationsAllowed && freshConfigGuardAllowed && pluginMigrations.complete()) {
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			automaticConfigRepair = planAdmittedConfigRepair(snapshot);
		}
		if (automaticConfigRepair && !skipLegacyParentConfigWrite && stateMigrationsAllowed && freshConfigGuardAllowed) {
			if (gatewayStartupCheckpointRequired && !startupMigrationLease) throw new Error("Automatic startup config repair requires the startup migration lease.");
			if (!(options.beforeStateMigrations === void 0 || await measurePreflightStep("startup-config-repair-guard", () => options.beforeStateMigrations?.()))) throwStartupMigrationGuardRejected();
			modelBillingRouteMigrationSource ??= snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
			startupMigrationLease?.heartbeat();
			await measurePreflightStep("automatic-config-repair", () => pluginInstallConfigImport ? commitAutomaticConfigRepair(automaticConfigRepair, snapshot, pluginInstallConfigImport) : pluginMetadata.run({ config: automaticConfigRepair.config }, () => commitAutomaticConfigRepair(automaticConfigRepair, snapshot)));
			note(`Migrated legacy config keys${gatewayStartupCheckpointRequired ? " at startup" : " in the active openclaw.json"}:\n${automaticConfigRepair.changes.map((entry) => `- ${entry}`).join("\n")}`, "Doctor changes");
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			if (migrationCheckpoint) refreshMigrationCheckpoint(migrationCheckpoint, configSnapshotRead);
		}
		if (migrationCheckpoint && configSnapshotRead.pluginMetadataSnapshot && configSnapshotRead.pluginMetadataSnapshot.policyHash !== resolveInstalledPluginIndexPolicyHash(baseConfig, startupMigrationEnv)) {
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			refreshMigrationCheckpoint(migrationCheckpoint, configSnapshotRead);
		}
		if (shouldPersistRefreshedPluginIndex && stateMigrationsAllowed && freshConfigGuardAllowed && snapshot.valid) {
			const persisted = await persistRefreshedPluginIndex({
				env: startupMigrationEnv,
				lease: startupMigrationLease,
				measure: measurePreflightStep,
				readPersistedSnapshot: () => readConfigSnapshotForPreflight(false),
				snapshotRead: configSnapshotRead,
				expectedIdentity: migrationCheckpointIdentity
			});
			configSnapshotRead = persisted.snapshotRead;
			migrationCheckpointIdentity = persisted.checkpointIdentity;
		}
		configSnapshotRead = await completeStartupMigrationPreflight({
			freshConfigGuardAllowed,
			gatewayStartupCheckpointRequired,
			migrationCheckpoint,
			migrationCheckpointIdentity,
			readConfigSnapshotForPreflight,
			shouldRecordStartupCheckpoint,
			shouldRecordStateCheckpoint,
			snapshotRead: configSnapshotRead,
			startupMigrationEnv,
			startupMigrationHeartbeatError: startupMigrationHeartbeat?.error,
			startupMigrationLease,
			startupMigrationWarnings,
			hasPendingPluginMigrations: pluginMigrations.hasPending(),
			stateMigrationsAllowed
		});
		snapshot = configSnapshotRead.snapshot;
		baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		const deferredPluginMigrations = pluginMigrations.deferred();
		return {
			snapshot,
			baseConfig,
			...deferredPluginMigrations.length > 0 ? { deferredPluginMigrations } : {},
			...modelBillingRouteMigrationSource ? { modelBillingRouteMigrationSource } : {},
			...configSnapshotRead.pluginMetadataSnapshot ? { pluginMetadataSnapshot: configSnapshotRead.pluginMetadataSnapshot } : {},
			...cronCodexRuntimePolicyTargets.length > 0 ? { cronCodexRuntimePolicyTargets } : {},
			...stateMigrationStepReceipts.length > 0 ? { stateMigrationStepReceipts } : {},
			...postSessionPluginMigration ? { postSessionPluginMigration } : {},
			...postSessionPluginMigrationPlanBound ? { postSessionPluginMigrationPlanBound: true } : {}
		};
	} finally {
		startupMigrationHeartbeat?.stop();
		startupMigrationLease?.release();
	}
}
//#endregion
export { runDoctorConfigPreflight as t };
