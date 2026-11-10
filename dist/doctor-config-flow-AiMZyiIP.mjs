import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { S as resolveIsConfigReadOnly, m as resolveConfigPath, p as resolveCanonicalConfigPath, t as CONFIG_PATH } from "./paths-orClZ-2Z.mjs";
import { r as cloneEnvWithPlatformSemantics, y as resolveFutureConfigActionBlock } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { E as setAppliedRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as withOpenClawStateDatabaseReadSnapshot } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as tryResolveSoleAgentId, n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { v as setActiveDegradedPlugins } from "./discovery-availability-CEoTdFoo.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { i as hashConfigRaw, s as parseConfigJson5, t as coerceConfig } from "./io.read-helpers-KYk5dB53.mjs";
import { l as evaluateAgentDatabaseAdmissions, m as listAgentDatabaseAdmissionRefusals, r as canIsolateAgentDatabase, v as recordAgentDatabaseAdmissions } from "./agent-database-admission-CeDA0ojh.mjs";
import { n as getAgentDatabaseStartupAdmission } from "./agent-database-startup-DQZqWc4z.mjs";
import { c as recoverConfigFromLastKnownGoodCore, l as createConfigIoContext, n as prepareConfigRecoveryFromContext, t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import { r as createInvalidConfigError } from "./io.invalid-config-CsqYoW4w.mjs";
import { p as readRecentConfigAuditRecords } from "./io.audit-CCHda99t.mjs";
import { c as assertBaseSnapshotStillCurrent, r as withConfigSourceLocks } from "./write-lock-BlX1pI0w.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { c as readDeferredPluginMigrations, i as mergeDeferredPluginMigration, r as formatDeferredPluginMigration, t as DeferredPluginMigrationConflictError, u as recordDeferredPluginMigrations } from "./deferred-plugin-migrations-CSwavNpj.mjs";
import { a as preserveDeferredPluginMigrationConfig, r as hasDeferredPluginMigrationConfig, s as resolveDeferredPluginMigrationConfigPaths } from "./deferred-plugin-migration-config-Cc7gzBuJ.mjs";
import { h as LEGACY_AGENT_ROSTER_RULES, n as findLegacyConfigRuleIssues } from "./legacy-B7HUu-GS.mjs";
import { i as tryGetLegacyDefaultAgentId, r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-Blrs2q29.mjs";
import { r as resolveLegacyAgentRosterOwner } from "./legacy.roster-BkkM_O4n.mjs";
import { t as classifyOtelGrpcMigrationOwnership } from "./include-migration-ownership-KfGWiqXu.mjs";
import "./env-vars-BA28GJYb.mjs";
import { t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-COeXJqiY.mjs";
import { r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-DLbo5ecI.mjs";
import { _ as recoverConfigFromJsonRootSuffix } from "./io.runtime-Ds5uC0Bf.mjs";
import "./io-DIF-KW3P.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { r as resolveCronJobsStorePathFromConfig } from "./paths-C7jZRDkL.mjs";
import { g as shouldSkipLegacyUpdateDoctorConfigWrite, h as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-M5rvMZiC.mjs";
import { t as readRetiredDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-DinUPp8o.mjs";
import { t as findRetiredConfigUpgradeRequirement } from "./retired-config-formats-IQqBZGMl.mjs";
import { f as resolvePluginDoctorProviderRenames } from "./doctor-contract-registry-CPMSf5LC.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as sanitizeDoctorNote, t as emitDoctorNotes } from "./emit-notes-4SxaFD1H.mjs";
import { a as migrateLegacyConfig, c as noteDoctorConfigPreflightIssues, d as noteMcpOriginWarning, f as noteMediaCliModelWarnings, h as noteSandboxOriginProxyWarning, l as noteDoctorHookConfigWarnings, m as noteOpencodeProviderOverrides, n as applyUnknownConfigKeyStep, o as applyLegacyDoctorMigrations, p as noteMissingDefaultAgentOwner, r as prepareDoctorConfigReferenceSource, t as applyLegacyCompatibilityStep, u as noteImplicitFallbackClobberWarnings } from "./config-flow-steps-BrBOplUM.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-C-CNDuxu.mjs";
import { n as planProviderRenames } from "./provider-rename-CzX16E87.mjs";
import { r as callGateway } from "./call-b1jzw5fz.mjs";
import { c as throwIfDoctorStateMigrationRefused, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CB0bXmSE.mjs";
import { r as withProgress } from "./progress-BIOeyA3T.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-P722AY9p.mjs";
import { t as describeConfigSnapshotInputChange } from "./snapshot-inputs-BhvzjvE-.mjs";
import { n as commitAutomaticConfigRepair, r as planAutomaticConfigRepair, t as canPlanAutomaticConfigRepair } from "./automatic-config-repair-BmDzqlSM.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-C6dUPU8_.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths } from "./doctor-auth-legacy-paths-BW9Ya4su.mjs";
import { t as listRetiredCronStateFiles } from "./state-migrations.retired-cron-files-D7G9YHVA.mjs";
import { n as resolveDoctorRepairMode } from "./doctor-repair-mode-CGb0a8nw.mjs";
import { a as measureDoctorConfigPreflightStep, n as runDoctorPluginConvergence, r as createConfigPreflightSnapshotReader } from "./doctor-config-preflight-plugin-verification-DaiWSEI4.mjs";
import { t as inspectPluginMigrationAvailability } from "./plugin-migration-availability-CWXsc9uR.mjs";
import { t as noteDoctorMigrationResult } from "./doctor-migration-notes-BeR2Nugl.mjs";
import { t as assertDoctorRetiredStateAdmission } from "./doctor-retired-state-admission-Bi6keNFs.mjs";
import { t as createDoctorPluginMetadataSnapshotScope } from "./plugin-metadata-snapshot-scope-Chaaplry.mjs";
import { n as createWorkspaceAliasMigrationRepair } from "./doctor-workspace-alias-CYFtYRTD.mjs";
import { r as cronCodexRuntimePolicyTargetKey } from "./store-migration-CKhoP7Q9.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-BoUI31s1.mjs";
import { t as normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate-BSJAxfpx.mjs";
import { t as canWriteDoctorInclude } from "./roster-include-write-DR4tWIpD.mjs";
import fs, { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor-config-preflight-plugin-index.ts
/** Returns true during updater-managed config rewrites where plugin validation may be stale. */
function shouldSkipPluginValidationForDoctorConfigPreflight(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS);
}
/** One preflight owns completion; each read still checks the current update phase. */
function createDoctorRehearsalSnapshotPreparation(report) {
	let completed = false;
	const prepareSnapshot = async (snapshot) => {
		if (completed) return;
		const { completeUpdateCandidatePluginRehearsal } = await import("./update-candidate-plugin-repair-CvQzmoLX.mjs");
		const result = await completeUpdateCandidatePluginRehearsal({
			config: snapshot.sourceConfig ?? snapshot.config ?? {},
			env: process.env,
			installRecords: loadInstalledPluginIndexInstallRecordsSync({ env: process.env })
		});
		completed = true;
		report({
			changes: result.copiedFiles > 0 ? [`Update rehearsal: copied ${result.copiedFiles} missing plugin dependency files.`] : [],
			warnings: result.warnings
		});
	};
	return (enabled) => enabled && resolveUpdateRehearsalRoot(process.env) && process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? prepareSnapshot : void 0;
}
//#endregion
//#region src/commands/doctor/shared/config-recovery.ts
const transformDoctorRecoveryCandidate = (params) => {
	const ownership = classifyOtelGrpcMigrationOwnership({
		snapshot: {
			path: params.configPath,
			includeProvenance: params.includeProvenance
		},
		authoredConfig: params.candidate.parsed,
		resolvedConfig: params.resolvedConfig
	});
	if (ownership && ownership.kind !== "direct") throw createInvalidConfigError(params.configPath, ownership.kind === "resolved-only" ? "candidate migration cannot persist an env-resolved diagnostics.otel.protocol repair" : "candidate migration requires an include-owned diagnostics.otel.protocol repair");
	const migration = applyLegacyDoctorMigrations(params.candidate.parsed, {
		sourceConfigBeforeMigrations: params.resolvedConfig,
		context: {
			authoredRaw: params.candidate.parsed,
			resolvedRaw: params.resolvedConfig
		}
	});
	return migration.next ? preserveDeferredPluginMigrationConfig({
		sourceConfig: params.candidate.parsed,
		nextConfig: migration.next,
		pending: params.deferredPluginMigrations
	}) : params.candidate.parsed;
};
function prepareDoctorConfigRecoverySnapshot(options, snapshot) {
	return prepareConfigRecoveryFromContext(createConfigIoContext(options, transformDoctorRecoveryCandidate), snapshot);
}
function recoverDoctorConfigFromLastKnownGood(params) {
	const context = createConfigIoContext({ configPath: params.snapshot.path }, transformDoctorRecoveryCandidate);
	return recoverConfigFromLastKnownGoodCore({
		...params,
		deps: context.deps,
		prepareCandidate: context.prepareRecoveryBackupCandidate
	});
}
//#endregion
//#region src/commands/doctor-config-preflight-legacy-config.ts
function createDoctorConfigRepairPlanner(params) {
	const planScopedConfigRepair = (snapshot) => params.runWithPluginMetadataSnapshot({ config: snapshot.sourceConfig ?? snapshot.config ?? {} }, () => planAutomaticConfigRepair(snapshot));
	const planAdmittedConfigRepair = (snapshot, prepared = null) => (params.options.repairPrefixedConfig === true || params.stateMigrationsRequested && params.options.migrateLegacyConfig !== false) && canPlanAutomaticConfigRepair(snapshot) && !params.skipLegacyParentConfigWrite && (params.options.repairPrefixedConfig === true || !shouldSkipPluginValidationForDoctorConfigPreflight()) && !resolveIsConfigReadOnly(process.env) && !resolveFutureConfigActionBlock({
		action: "normalize legacy config",
		snapshot
	}) ? prepared ?? planScopedConfigRepair(snapshot) : null;
	return {
		planScopedConfigRepair,
		planAdmittedConfigRepair
	};
}
async function migrateLegacyDoctorConfig(params) {
	if (!params.enabled || resolveIsConfigReadOnly(process.env)) return;
	const changes = await params.measure("legacy-config-migration", maybeMigrateLegacyConfig);
	if (changes.length > 0) note(changes.map((entry) => `- ${entry}`).join("\n"), "Doctor changes");
}
/** Repair active legacy bytes before considering an older backup. */
async function prepareDoctorConfigRecovery(params) {
	let snapshotRead = params.snapshotRead;
	let snapshot = snapshotRead.snapshot;
	const assertSupportedConfig = (config) => {
		const retired = findRetiredConfigUpgradeRequirement(config);
		if (retired) throw new Error(`${retired.message} ${retired.nextAction}`);
		assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(process.env, coerceConfig(config)));
	};
	assertSupportedConfig(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig);
	assertNoRetiredStateFiles("Cron state", await listRetiredCronStateFiles(resolveCronJobsStorePathFromConfig(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig ?? snapshot.config)));
	let activeConfigRepair = null;
	const recoveryEnabled = params.enabled && !resolveFutureConfigActionBlock({
		action: "recover config",
		snapshot
	});
	if (recoveryEnabled && snapshot.valid) {
		const recovery = await prepareDoctorConfigRecoverySnapshot({ configPath: snapshot.path }, snapshot);
		if (recovery) {
			await recovery.apply();
			snapshotRead = await params.readSnapshot();
			snapshot = snapshotRead.snapshot;
		}
	}
	if (recoveryEnabled && snapshot.exists && !snapshot.valid) {
		activeConfigRepair = typeof snapshot.raw === "string" && parseConfigJson5(snapshot.raw).ok ? await params.planRepair(snapshot) : null;
		let configRepaired = false;
		if (!activeConfigRepair && await recoverConfigFromJsonRootSuffix(snapshot, assertSupportedConfig)) {
			note("Removed non-JSON prefix from openclaw.json.", "Config");
			configRepaired = true;
		} else if (!activeConfigRepair && await recoverDoctorConfigFromLastKnownGood({
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
	if (process.env.OPENCLAW_STATE_DIR?.trim() || process.env.OPENCLAW_HOME?.trim() || process.env.OPENCLAW_CONFIG_PATH?.trim()) return [];
	const { renameLegacyConfigFile } = await import("./state-migrations.state-dir-UfQKyj03.mjs");
	return renameLegacyConfigFile(path.dirname(resolveCanonicalConfigPath()));
}
//#endregion
//#region src/commands/doctor-config-preflight-migrations.ts
/** Settle package repairs before state migrations select their plugin owners. */
async function prepareDoctorMigrationPlugins(params) {
	const convergence = await runDoctorPluginConvergence(params);
	setActiveDegradedPlugins(convergence.quarantinedPlugins);
	await params.onDeferredPlugins(convergence.deferredPlugins ?? [], convergence.migrationInspection);
	return {
		snapshotRead: await params.readRefreshedSnapshot(),
		warnings: convergence.warnings ?? []
	};
}
async function assertDoctorPreflightMigrationsComplete(params) {
	const scopedRefusals = params.stepReceipts.filter((receipt) => receipt.outcome === "refused" && (receipt.refusal?.code === "agent-database-ownership-mismatch" || receipt.refusal?.code === "blocked-by-agent-database-refusal") && receipt.refusedAgentDatabasePaths?.length);
	const admissions = scopedRefusals.length > 0 ? getAgentDatabaseStartupAdmission() ? listAgentDatabaseAdmissionRefusals() : await evaluateAgentDatabaseAdmissions(params.cfg) : [];
	if (scopedRefusals.length > 0) recordAgentDatabaseAdmissions(admissions);
	const isolatedPaths = new Set(admissions.filter((refusal) => refusal.code !== "agent-database-ownership-mismatch" || canIsolateAgentDatabase(params.cfg, refusal.agentId)).flatMap((refusal) => refusal.paths.map((pathname) => path.resolve(pathname))));
	for (const receipt of scopedRefusals) if (receipt.refusedAgentDatabasePaths?.every((pathname) => isolatedPaths.has(path.resolve(pathname)))) receipt.outcome = "warning";
	try {
		throwIfDoctorStateMigrationRefused(params.stepReceipts);
	} catch (error) {
		if (error instanceof DoctorStateMigrationRefusalError) {
			const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-BTAEPnuh.mjs");
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
//#endregion
//#region src/commands/doctor-config-preflight-plugin-migrations.ts
/** One preflight retains unavailable owners until their migration reports completion. */
function createDoctorPluginMigrationPreparation(params) {
	const shouldDeferInstallation = () => Boolean(resolveUpdateRehearsalRoot(params.env())) || shouldDeferConfiguredPluginInstallRepair(params.env());
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
		remember();
		previousLoaded = true;
	};
	let prepared = false;
	const completedIds = /* @__PURE__ */ new Set();
	const reported = /* @__PURE__ */ new Map();
	let statelessPlugins = /* @__PURE__ */ new Map();
	let runtimePluginAliases = /* @__PURE__ */ new Set();
	let unavailablePluginIds = /* @__PURE__ */ new Set();
	let discoveryBlockedPluginIds = /* @__PURE__ */ new Set();
	let replacementPluginIds = {};
	let sourceSnapshot;
	const inspectedStatelessPluginIds = /* @__PURE__ */ new Set();
	const requirePlugins = (pluginIds, requirement) => {
		for (const pluginId of pluginIds) {
			const pending = previousById.get(pluginId);
			if (pending) previousById.set(pluginId, {
				...pending,
				[requirement]: true
			});
		}
	};
	const learn = (inspection) => {
		if (!inspection) return;
		statelessPlugins = new Map(inspection.statelessPlugins.map(({ id, version }) => [id, version]));
		runtimePluginAliases = new Set(inspection.runtimePluginAliases);
		unavailablePluginIds = new Set(inspection.unavailablePluginIds);
		discoveryBlockedPluginIds = new Set(inspection.discoveryBlockedPluginIds);
		replacementPluginIds = inspection.replacementPluginIds ?? {};
		requirePlugins(inspection.requiredPluginIds, "requiresStateMigration");
		requirePlugins(inspection.inspectionRequiredPluginIds, "requiresDoctorInspection");
	};
	const retain = (pending) => mergeDeferredPluginMigration(previousById.get(pending.pluginId), pending);
	const remember = () => {
		for (const pending of deferred) previousById.set(pending.pluginId, pending);
	};
	const prepare = async (snapshot) => {
		sourceSnapshot = snapshot;
		await loadPrevious(snapshot);
		if (!snapshot.exists) return [...previousById.values()];
		if (!prepared && params.enabled) {
			const availability = await inspectPluginMigrationAvailability({
				cfg: snapshot.sourceConfig,
				env: params.env(),
				retainedPluginIds: [...previousById.keys()],
				deferInstallation: shouldDeferInstallation()
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
	const persistPending = async (pending, resolvedPluginIds, settlements) => {
		try {
			const committed = await recordDeferredPluginMigrations({
				env: params.env(),
				pending,
				...resolvedPluginIds ? { resolvedPluginIds } : {},
				...settlements ? { settlements } : {},
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
			statelessPlugins.clear();
			runtimePluginAliases.clear();
			unavailablePluginIds.clear();
			discoveryBlockedPluginIds.clear();
			replacementPluginIds = {};
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
		retainedPluginIds: () => [...previousById.keys()],
		prepare,
		snapshotOptions: async () => {
			await loadPrevious();
			return {
				preparePluginMigrations: !prepared && params.enabled ? prepare : void 0,
				deferredPluginMigrations: [...previousById.values()]
			};
		},
		async migrate(config) {
			const { autoMigrateLegacyPluginDoctorState } = await import("./state-migrations.plugin-doctor-BtU2jm0a.mjs");
			params.report(await params.measure("plugin-doctor-migrations", () => params.runWithPluginMetadataSnapshot({ config }, () => autoMigrateLegacyPluginDoctorState({
				config,
				env: params.env(),
				log: params.log,
				...params.doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {}
			}))));
		},
		async converged(pending, snapshot, metadata, inspection) {
			sourceSnapshot = snapshot;
			learn(inspection);
			deferred = pending.map((plugin) => retain(Object.assign(resolveDeferredPluginMigrationConfigPaths({
				config: snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig,
				pluginId: plugin.pluginId,
				compatibilityMigrationPaths: metadata?.plugins.find((record) => record.id === plugin.pluginId)?.configContracts?.compatibilityMigrationPaths
			}), plugin)));
			remember();
			if (!await persistPending([...previousById.values()])) return;
			for (const plugin of deferred) reportPending(plugin);
		},
		observe(result) {
			requirePlugins(result.requiredPluginIds ?? [], "requiresStateMigration");
			for (const pluginId of result.statelessPluginIds ?? []) inspectedStatelessPluginIds.add(pluginId);
			for (const pluginId of result.completedPluginIds ?? []) completedIds.add(pluginId);
		},
		async complete() {
			if (!params.enabled) return false;
			const unavailableIds = new Set(deferred.map((plugin) => plugin.pluginId));
			const installationDeferred = shouldDeferInstallation();
			const sourceConfig = sourceSnapshot?.sourceConfigBeforeMigrations ?? sourceSnapshot?.sourceConfig;
			const settlements = [];
			const warnings = [];
			const resolvedPluginIds = [...previousById.values()].filter((plugin) => {
				if (completedIds.has(plugin.pluginId)) return true;
				if (unavailablePluginIds.has(plugin.pluginId) && sourceSnapshot?.valid && sourceConfig && !installationDeferred && !hasDeferredPluginMigrationConfig(sourceConfig, plugin)) {
					const successor = replacementPluginIds[plugin.pluginId];
					if (successor && completedIds.has(successor)) {
						settlements.push({
							pluginId: plugin.pluginId,
							status: "superseded",
							reason: `Superseded by plugin "${successor}", which completed its migration. Existing state has been kept.`
						});
						return true;
					}
					if (!(sourceConfig.plugins?.entries?.[plugin.pluginId]?.enabled === true && passesManifestOwnerBasePolicy({
						plugin: { id: plugin.pluginId },
						normalizedConfig: normalizePluginsConfig(sourceConfig.plugins)
					})) && !plugin.requiresStateMigration && !plugin.requiresDoctorInspection) {
						settlements.push({
							pluginId: plugin.pluginId,
							status: "completed",
							reason: "Not applicable: the plugin owner is unavailable and there is no protected config to migrate. Existing state has been kept."
						});
						return true;
					}
				}
				if (plugin.requiresStateMigration || unavailableIds.has(plugin.pluginId)) return false;
				if (inspectedStatelessPluginIds.has(plugin.pluginId)) return true;
				if (statelessPlugins.has(plugin.pluginId)) {
					const reason = `Plugin "${plugin.pluginId}" version "${statelessPlugins.get(plugin.pluginId) ?? "unknown"}": no plugin migration contract. No migration ran; existing data and settings have been kept.`;
					settlements.push({
						pluginId: plugin.pluginId,
						status: "completed",
						reason
					});
					warnings.push(reason);
					return true;
				}
				if (plugin.requiresDoctorInspection) return false;
				return runtimePluginAliases.has(plugin.pluginId) && !plugin.validationExcludedPaths?.length && (plugin.configPaths ?? []).every((segments) => segments.length === 2 && segments[0] === "session" && segments[1] === "store");
			}).map((plugin) => plugin.pluginId);
			const resolvedIds = new Set(resolvedPluginIds);
			const pending = [...previousById.values()].filter((plugin) => !resolvedIds.has(plugin.pluginId)).map((plugin) => unavailablePluginIds.has(plugin.pluginId) && !discoveryBlockedPluginIds.has(plugin.pluginId) && !installationDeferred ? Object.assign(plugin, { reason: `The migration owner is unavailable. Install or enable plugin "${plugin.pluginId}" to migrate its retained data and settings. For a retired plugin, ask its maintainer for a supported migration or recovery path.` }) : unavailableIds.has(plugin.pluginId) ? plugin : Object.assign(plugin, {
				reason: "The installed plugin has not confirmed that its saved data and settings are ready for this version. If Doctor cannot finish the upgrade, report this warning to the plugin maintainer.",
				command: "openclaw doctor --fix"
			}));
			if (resolvedPluginIds.length === 0 && pending.length === 0) return refreshSnapshot;
			const persist = () => persistPending(pending, resolvedPluginIds, settlements);
			let committed;
			if (settlements.length > 0 && sourceSnapshot) {
				const env = cloneEnvWithPlatformSemantics(params.env());
				const { snapshot, writeOptions } = await createConfigIO({
					env,
					observe: false,
					pluginValidation: "core-only",
					deferredPluginMigrations: expectedPending,
					shellEnvFallback: "defer"
				}).readConfigFileSnapshotForWrite();
				if (!snapshot.valid || describeConfigSnapshotInputChange(sourceSnapshot, snapshot, { compareResolvedConfig: false })) throw new ConfigMutationConflictError("Plugin migration source config changed or could not be read; rerun Doctor.");
				const includeGraph = {
					hashes: writeOptions.includeFileHashesForWrite ?? {},
					targets: writeOptions.includeFileTargetsForWrite ?? {}
				};
				const assertCurrent = () => assertBaseSnapshotStillCurrent(snapshot, resolveConfigPath(env), fs, includeGraph);
				committed = await withPluginLifecycleLease({
					env,
					assertCurrent
				}, () => withConfigSourceLocks([snapshot.path, ...Object.entries(includeGraph.targets).flat()], persist, env, assertCurrent));
			} else committed = await persist();
			if (!committed) return true;
			for (const pluginId of resolvedPluginIds) {
				previousById.delete(pluginId);
				const receipt = reported.get(pluginId);
				if (receipt) {
					receipt.outcome = "completed";
					receipt.warnings = [];
				}
			}
			deferred = deferred.filter((plugin) => !resolvedIds.has(plugin.pluginId));
			if (settlements.length > 0) params.report({
				changes: [],
				warnings,
				warningDisposition: "recoverable",
				notices: settlements.filter((entry) => !statelessPlugins.has(entry.pluginId)).map((entry) => `Plugin "${entry.pluginId}": ${entry.reason}`)
			});
			for (const plugin of pending) {
				previousById.set(plugin.pluginId, plugin);
				reportPending(plugin);
			}
			return refreshSnapshot || resolvedPluginIds.length > 0;
		}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight.cron.ts
/** Preserve a retired partition selector even when other config cannot drive core migrations. */
async function migrateRetainedStore(params) {
	const cfg = retainStoreConfig(params.config);
	if (!cfg) return;
	const { repairLegacyCronStoreWithoutPrompt } = await params.measure("cron-repair-import", () => import("./legacy-repair-D8uyiY-k.mjs"));
	params.report(await params.measure("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
		cfg,
		migrateCodexModelRefs: false
	})));
	const { migrateLegacyConfigMachineState } = await import("./state-migrations.config-machine-state-DE5n7WcO.mjs");
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
async function noteStaleUpdateRuns(options = {}) {
	const warnings = /* @__PURE__ */ new Set();
	const reportReconciliationError = (error) => {
		if (hasCommandProcessCleanupError(error)) throw error;
		warnings.add(`Update history reconciliation could not complete: ${String(error)}`);
	};
	try {
		await inspectStaleUpdateRuns(options, reportReconciliationError);
	} catch (error) {
		reportReconciliationError(error);
	}
	for (const warning of warnings) note(warning, "Update history");
	if (warnings.size && options.migrateState !== false) try {
		await recordUpdateHistoryWarning([...warnings].join("\n"));
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		note(`Update history warning could not be saved: ${String(error)}`, "Update history");
	}
}
async function recordUpdateHistoryWarning(detail) {
	const [{ runExistingOpenClawStateWriteTransaction }, { executeSqliteQuerySync, executeSqliteQueryTakeFirstSync, getNodeSqliteKysely }, { decodeRun }, { encodeRun }, { updateRunLedgerSchema }, { upsertStep }] = await Promise.all([
		import("./openclaw-state-db-existing-write-Cqw5Y1T9.mjs"),
		import("./kysely-sync-CFcZ_sLF.mjs"),
		import("./update-run-read.kernel-DIkYI8ec.mjs"),
		import("./update-run-codec-DxR7c6jW.mjs"),
		import("./update-run-write-BzhdaoqE.mjs"),
		import("./update-run-step-upsert-CC2U2XlZ.mjs")
	]);
	runExistingOpenClawStateWriteTransaction(({ db }) => {
		const latest = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().orderBy("created_at_ms", "desc").orderBy("run_id", "desc").limit(1));
		if (!latest) return;
		const record = decodeRun(latest);
		upsertStep(record, {
			step: "warning:update-history-reconciliation",
			status: "completed",
			detail
		});
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("update_runs").set({ steps_json: encodeRun(record, {}).steps_json }).where("run_id", "=", record.runId));
	}, {}, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.history.warning"
	});
}
async function inspectStaleUpdateRuns(options, reportReconciliationError) {
	const [{ staleUpdateRunGuidance }, { listUpdateRunsAsync }, { renderUpdateRunReport }, { updateRunWarningMessages }, { readInstalledUpdateCandidate, reconcileInterruptedUpdateRuns }, { isAcknowledgedAbandonedUpdateRun }, { readInterruptedUpdateCandidateAsync }] = await Promise.all([
		import("./update-run-activity-WgkOEzlW.mjs"),
		import("./update-run-reader-qYXGmbxF.mjs"),
		import("./update-run-report-D6JXfo82.mjs"),
		import("./update-run-step-CH4yw9xR.mjs"),
		import("./update-run-interruption-DZH4jQzd.mjs"),
		import("./update-run-record-BdaKzDzT.mjs"),
		import("./update-run-interruption-worker-1mbVzY4h.mjs")
	]);
	const discovered = await withArtifactPreservingStateReads(() => withOpenClawStateDatabaseReadSnapshot(async () => {
		let candidate;
		if (options.migrateState !== false) try {
			candidate = await readInterruptedUpdateCandidateAsync({});
		} catch (error) {
			reportReconciliationError(error);
		}
		return {
			candidate,
			active: await listUpdateRunsAsync({
				active: true,
				limit: 100
			}),
			history: await listUpdateRunsAsync({ limit: 100 })
		};
	}));
	let { active, history } = discovered;
	let reconciled = [];
	if (discovered.candidate) try {
		reconciled = await reconcileInterruptedUpdateRuns({ candidate: discovered.candidate });
		for (const run of reconciled) note(`Update ${run.runId}: recorded succeeded after verifying the installed and serving candidate build ${run.after.buildId}; its updater exited before recording completion.`, "Update history");
	} catch (error) {
		reportReconciliationError(error);
	}
	if (reconciled.length) {
		active = await listUpdateRunsAsync({
			active: true,
			limit: 100
		});
		history = await listUpdateRunsAsync({ limit: 100 });
	}
	for (const run of active) {
		const guidance = staleUpdateRunGuidance(run);
		if (guidance) note(`Update ${run.runId}: ${guidance}`, "Update history");
	}
	for (const run of history) if (run.status === "failed" && run.reason === "abandoned" && !isAcknowledgedAbandonedUpdateRun(run)) {
		const reason = readInstalledUpdateCandidate(run) ? "the recorded candidate has not been verified as installed and serving" : "the target build was not recorded, so current version equality cannot prove this update completed";
		note(`Update ${run.runId} remains abandoned: ${reason}. Run \`openclaw update repair\` to repair the installation and reconcile its history.`, "Update history");
	}
	const [latest] = history;
	if (latest) {
		if (latest.status === "failed" && latest.reason && (latest.reason === "update-activation-timeout" || UPDATE_ENVIRONMENT_FAILURE_REASONS.has(latest.reason))) note(`Update ${latest.runId}: ${renderUpdateRunReport(latest).markdown}`, "Update history");
		const retiredWarnings = await readRetiredDeferredPluginMigrationWarnings(latest.steps.map((step) => step.detail));
		const warnings = updateRunWarningMessages(latest.steps.filter((step) => !retiredWarnings.has(step.detail ?? "")));
		if (warnings.length) note(`Recorded warnings from update ${latest.runId} (a later repair may have resolved them):\n${warnings.slice(-3).join("\n")}`, "Update history");
	}
}
//#endregion
//#region src/commands/doctor/shared/legacy-config-state-migration-input.ts
function resolveStateMigrationConfigInput(params) {
	const pluginDoctorConfig = params.snapshot.sourceConfig ?? params.snapshot.config ?? params.snapshot.parsed;
	const sourceConfigBeforeMigrations = params.snapshot.sourceConfigBeforeMigrations ?? pluginDoctorConfig;
	const context = {
		sourceConfigBeforeMigrations,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
	if (params.postConvergenceConfig) return {
		cfg: params.postConvergenceConfig,
		...context
	};
	if (params.snapshot.valid) return params.snapshot.legacyIssues.length > 0 && pluginDoctorConfig !== void 0 ? {
		cfg: params.baseConfig,
		pluginDoctorConfig,
		sourceConfigBeforeMigrations
	} : {
		cfg: params.baseConfig,
		sourceConfigBeforeMigrations
	};
	const migrationSource = pluginDoctorConfig ?? params.snapshot.parsed;
	if (params.snapshot.legacyIssues.length === 0 || migrationSource === void 0) return null;
	const migrated = migrateLegacyConfig(migrationSource, { sourceConfigBeforeMigrations: params.snapshot.sourceConfigBeforeMigrations });
	if (!migrated.config || migrated.partiallyValid) return { pluginDoctorConfig: pluginDoctorConfig ?? migrationSource };
	return {
		cfg: migrated.config,
		...context
	};
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for Doctor: legacy migration, recovery, and snapshot loading. */
const loadState = createLazyRuntimeModule(() => import("./state-migrations.state-dir-UfQKyj03.mjs"));
const loadCronRepair = createLazyRuntimeModule(() => import("./legacy-repair-D8uyiY-k.mjs"));
/** Preserve retired state inputs before the main Doctor config repair flow. */
async function runDoctorConfigPreflight(options = {}) {
	try {
		var _usingCtx$2 = _usingCtx();
		const snapshots = _usingCtx$2.a(createConfigPreflightSnapshotReader());
		let result;
		if (options.migrateState !== false && options.doctorOnlyStateMigrations === true) {
			const { withSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-B2W54074.mjs");
			result = await withSqliteReadOnlyWorkerScope(() => runDoctorConfigPreflightOperation(options, snapshots));
		} else result = await runDoctorConfigPreflightOperation(options, snapshots);
		return {
			...result,
			pluginCache: await snapshots.takePluginCache(result.pluginMetadataSnapshot)
		};
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
}
async function runDoctorConfigPreflightOperation(options, snapshots) {
	try {
		var _usingCtx3 = _usingCtx();
		if (!options.retiredStateAdmitted) assertDoctorRetiredStateAdmission();
		const stateMigrationsRequested = options.migrateState !== false;
		const skipLegacyParentConfigWrite = shouldSkipLegacyUpdateDoctorConfigWrite(process.env);
		const measurePreflightStep = (name, run) => measureDoctorConfigPreflightStep(name, run, options.measure);
		if (stateMigrationsRequested) await measurePreflightStep("state-write-admission", () => assertOpenClawStateWriteAllowedAtPath({
			databasePath: resolveOpenClawStateSqlitePath(process.env),
			env: process.env,
			recoverOrphanedSidecars: true
		}));
		await measurePreflightStep("stale-update-runs", () => noteStaleUpdateRuns({ migrateState: stateMigrationsRequested }));
		let modelBillingRouteMigrationSource;
		const cronCodexRuntimePolicyTargets = [];
		const stateMigrationStepReceipts = [];
		let postSessionPluginMigration;
		let postSessionPluginMigrationPlanBound = false;
		let doctorMediaPersistenceAttempted = false;
		let configSnapshotRead;
		const pluginMigrations = createDoctorPluginMigrationPreparation({
			enabled: stateMigrationsRequested,
			env: () => process.env,
			report: (result) => noteDoctorStateMigrationResult(result),
			recordReceipt: (receipt) => stateMigrationStepReceipts.push(receipt),
			measure: measurePreflightStep,
			runWithPluginMetadataSnapshot: (scope, run) => pluginMetadata.run(scope, run),
			doctorOnlyStateMigrations: options.doctorOnlyStateMigrations === true
		});
		const pluginMetadata = _usingCtx3.a(createDoctorPluginMetadataSnapshotScope({
			getBaseSnapshot: () => configSnapshotRead?.pluginMetadataSnapshot,
			env: process.env,
			getDeferredPluginIds: () => pluginMigrations.deferred().map((pending) => pending.pluginId)
		}));
		const noteDoctorStateMigrationResult = (result) => {
			pluginMigrations.observe(result);
			noteDoctorMigrationResult(result, { prefix: "- " });
		};
		const getSnapshotPreparation = createDoctorRehearsalSnapshotPreparation(noteDoctorStateMigrationResult);
		const { planScopedConfigRepair, planAdmittedConfigRepair } = createDoctorConfigRepairPlanner({
			options,
			stateMigrationsRequested,
			skipLegacyParentConfigWrite,
			runWithPluginMetadataSnapshot: pluginMetadata.run
		});
		const readConfigSnapshotForPreflight = async (allowCurrentPluginMetadata = true) => await measurePreflightStep("config-snapshot", async () => snapshots.read({
			purpose: "doctor",
			allowCurrentPluginMetadata,
			includePluginMetadata: options.preparePluginMetadataSnapshot === true,
			measure: options.measure,
			observe: options.observe,
			skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight(),
			prepareSnapshot: getSnapshotPreparation(options.doctorOnlyStateMigrations === true),
			...await pluginMigrations.snapshotOptions()
		}));
		const stateDirMigrations = stateMigrationsRequested ? await measurePreflightStep("state-migrations-import", loadState) : void 0;
		if (stateDirMigrations) noteDoctorStateMigrationResult(await measurePreflightStep("state-dir-migrations", () => stateDirMigrations.autoMigrateLegacyStateDir({ env: process.env })));
		await migrateLegacyDoctorConfig({
			enabled: options.migrateLegacyConfig !== false,
			measure: measurePreflightStep
		});
		configSnapshotRead = await readConfigSnapshotForPreflight(!stateDirMigrations);
		const recovery = await prepareDoctorConfigRecovery({
			enabled: options.repairPrefixedConfig === true && !skipLegacyParentConfigWrite,
			snapshotRead: configSnapshotRead,
			planRepair: planScopedConfigRepair,
			readSnapshot: () => readConfigSnapshotForPreflight(false)
		});
		configSnapshotRead = recovery.snapshotRead;
		let snapshot = configSnapshotRead.snapshot;
		const rosterMigrationSource = snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
		const activeConfigRepair = recovery.activeConfigRepair;
		noteDoctorConfigPreflightIssues(snapshot, {
			invalidConfigNote: options.invalidConfigNote,
			activeRepair: activeConfigRepair !== null
		});
		let baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		let automaticConfigRepair = await planAdmittedConfigRepair(snapshot, activeConfigRepair);
		if (options.doctorOnlyStateMigrations === true && stateDirMigrations) {
			const { prepareLegacyStateDatabaseSchema } = await import("./state-migrations.doctor-CxSGwF1E.mjs");
			const receipt = options.stateSchemaPreparation ?? await measurePreflightStep("state-schema", () => prepareLegacyStateDatabaseSchema(process.env));
			if (receipt.outcome !== "skipped") {
				stateMigrationStepReceipts.push(receipt);
				noteDoctorStateMigrationResult({
					changes: receipt.changes,
					warnings: receipt.warnings,
					notices: receipt.notices
				});
				throwIfDoctorStateMigrationRefused(stateMigrationStepReceipts);
			}
		}
		if (options.invocationPurpose === "doctor" || options.doctorOnlyStateMigrations === true) {
			const { repairLegacySessionEntryStates } = await import("./doctor-session-delivery-state-uoYeeQFq.mjs");
			const repair = options.doctorOnlyStateMigrations === true && stateDirMigrations !== void 0;
			const entryState = await measurePreflightStep("session-entry-state", () => repairLegacySessionEntryStates({
				apply: repair,
				cfg: automaticConfigRepair?.config ?? baseConfig,
				env: process.env,
				deferSchemaRepair: repair
			}));
			if (!repair && entryState.found > 0) {
				const { SessionStoreMigrationRequiredError } = await import("./migration-required-L_lcLtt4.mjs");
				throw new SessionStoreMigrationRequiredError(`Found ${entryState.found} session rows with legacy entry state. Run openclaw doctor --fix before further session inspection; no rows were changed.`);
			}
		}
		let postConvergenceStateConfig;
		let pluginConvergenceWarnings = [];
		if (stateDirMigrations) {
			const refreshed = await prepareDoctorMigrationPlugins({
				cfg: automaticConfigRepair?.config ?? baseConfig,
				env: process.env,
				retainedPluginIds: pluginMigrations.retainedPluginIds(),
				deferPackageRepair: options.deferPluginPackageRepair,
				measure: options.measure,
				snapshotRead: {
					...configSnapshotRead,
					snapshot
				},
				readRefreshedSnapshot: () => readConfigSnapshotForPreflight(false),
				onDeferredPlugins: (pending, inspection) => pluginMigrations.converged(pending, snapshot, configSnapshotRead?.pluginMetadataSnapshot, inspection)
			});
			pluginConvergenceWarnings = refreshed.warnings;
			configSnapshotRead = refreshed.snapshotRead;
			pluginMetadata.invalidate();
			snapshot = refreshed.snapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			automaticConfigRepair = await planAdmittedConfigRepair(snapshot);
			postConvergenceStateConfig = automaticConfigRepair?.snapshot.config;
		}
		const stateMigrationInput = resolveStateMigrationConfigInput({
			snapshot,
			baseConfig,
			postConvergenceConfig: postConvergenceStateConfig
		});
		const rosterMigrationOwnerId = stateMigrationInput?.cfg ? tryGetLegacyDefaultAgentId(stateMigrationInput.cfg) : void 0;
		if (stateDirMigrations) {
			if (options.doctorOnlyStateMigrations === true && !stateMigrationInput?.cfg) {
				const { detectLegacyExecApprovals, migrateLegacyExecApprovals } = await import("./state-migrations.exec-approvals-BIgPAYNs.mjs");
				const stateDir = resolveStateDir(process.env);
				noteDoctorStateMigrationResult(await measurePreflightStep("exec-approvals-migration", () => migrateLegacyExecApprovals({
					detected: detectLegacyExecApprovals({
						stateDir,
						doctorOnlyStateMigrations: true
					}),
					stateDir,
					env: process.env
				})));
			}
			if (stateMigrationInput) {
				if (stateMigrationInput.cfg) {
					const { autoMigrateLegacyState } = await import("./state-migrations.doctor-CxSGwF1E.mjs");
					const migrationConfig = stateMigrationInput.cfg;
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					const { collectCronCodexRuntimePolicyTargetsReadOnly, repairLegacyCronStoreWithoutPrompt } = await measurePreflightStep("cron-repair-import", loadCronRepair);
					noteDoctorStateMigrationResult(await measurePreflightStep("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
						cfg: withLegacyConfig(migrationConfig, pluginDoctorConfig),
						migrateCodexModelRefs: false
					})));
					if (options.repairPrefixedConfig === true) {
						const cronCodexPlan = await measurePreflightStep("cron-policy-scan", () => collectCronCodexRuntimePolicyTargetsReadOnly({ cfg: migrationConfig }));
						cronCodexRuntimePolicyTargets.push(...cronCodexPlan.targets);
						noteDoctorStateMigrationResult({
							changes: [],
							warnings: cronCodexPlan.warnings
						});
					}
					const legacyStateResult = await measurePreflightStep("legacy-state-migrations", () => pluginMetadata.run({ config: pluginDoctorConfig ?? migrationConfig }, () => autoMigrateLegacyState({
						cfg: migrationConfig,
						sourceConfigBeforeMigrations: stateMigrationInput.sourceConfigBeforeMigrations,
						...pluginDoctorConfig ? { pluginDoctorConfig } : {},
						configIncludedPaths: snapshot.includedPaths ?? [],
						env: process.env,
						doctorOnlyStateMigrations: options.doctorOnlyStateMigrations,
						invocationPurpose: options.invocationPurpose,
						...options.agentDatabaseMigrationDiscovery ? { agentDatabaseMigrationDiscovery: options.agentDatabaseMigrationDiscovery } : {},
						beforeWorkspaceStateMigration: options.beforeWorkspaceStateMigration,
						onStepReceipt: (receipt) => stateMigrationStepReceipts.push(receipt)
					})));
					postSessionPluginMigration = legacyStateResult.postSessionPluginMigration;
					postSessionPluginMigrationPlanBound = options.doctorOnlyStateMigrations === true;
					doctorMediaPersistenceAttempted = options.doctorOnlyStateMigrations === true;
					noteDoctorStateMigrationResult(legacyStateResult);
					if (options.doctorOnlyStateMigrations === true) await assertDoctorPreflightMigrationsComplete({
						cfg: migrationConfig,
						stepReceipts: stateMigrationStepReceipts,
						report: noteDoctorStateMigrationResult
					});
				} else if (stateMigrationInput.pluginDoctorConfig) {
					const pluginDoctorConfig = stateMigrationInput.pluginDoctorConfig;
					await migrateRetainedStore({
						config: pluginDoctorConfig,
						env: process.env,
						measure: measurePreflightStep,
						report: noteDoctorStateMigrationResult
					});
					await pluginMigrations.migrate(pluginDoctorConfig);
				}
			}
		}
		if (stateDirMigrations && options.doctorOnlyStateMigrations === true && !doctorMediaPersistenceAttempted) {
			const { migrateLegacyMediaPersistence } = await import("./state-migrations.media-persistence-C1495jcJ.mjs");
			noteDoctorStateMigrationResult(await measurePreflightStep("media-persistence-migration", () => migrateLegacyMediaPersistence({ env: process.env })));
			const { repairLegacySessionEntryStates } = await import("./doctor-session-delivery-state-uoYeeQFq.mjs");
			await repairLegacySessionEntryStates({
				apply: true,
				cfg: automaticConfigRepair?.config ?? baseConfig,
				env: process.env
			});
		}
		if (await pluginMigrations.complete()) {
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
			automaticConfigRepair = await planAdmittedConfigRepair(snapshot);
		}
		if (stateDirMigrations && options.doctorOnlyStateMigrations === true) {
			const { repairRelativeSessionStores } = await import("./doctor-relative-session-store-Cf6Gsu72.mjs");
			noteDoctorStateMigrationResult(await measurePreflightStep("relative-session-store", () => repairRelativeSessionStores({
				cfg: automaticConfigRepair?.config ?? baseConfig,
				env: process.env,
				registeredDatabases: options.agentDatabaseMigrationDiscovery?.registeredAgentDatabases
			})));
		}
		if (automaticConfigRepair && !skipLegacyParentConfigWrite) {
			modelBillingRouteMigrationSource ??= snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
			await measurePreflightStep("automatic-config-repair", () => pluginMetadata.run({ config: automaticConfigRepair.config }, () => commitAutomaticConfigRepair(automaticConfigRepair, snapshot)));
			note(`Migrated legacy config keys in the active openclaw.json:\n${automaticConfigRepair.changes.map((entry) => `- ${entry}`).join("\n")}`, "Doctor changes");
			configSnapshotRead = await readConfigSnapshotForPreflight(false);
			snapshot = configSnapshotRead.snapshot;
			baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		}
		const deferredPluginMigrations = pluginMigrations.deferred();
		return {
			snapshot,
			baseConfig,
			...pluginConvergenceWarnings.length > 0 ? { warnings: pluginConvergenceWarnings } : {},
			rosterMigrationSource,
			...rosterMigrationOwnerId ? { rosterMigrationOwnerId } : {},
			...deferredPluginMigrations.length > 0 ? { deferredPluginMigrations } : {},
			...modelBillingRouteMigrationSource ? { modelBillingRouteMigrationSource } : {},
			...configSnapshotRead.pluginMetadataSnapshot ? { pluginMetadataSnapshot: configSnapshotRead.pluginMetadataSnapshot } : {},
			...cronCodexRuntimePolicyTargets.length > 0 ? { cronCodexRuntimePolicyTargets } : {},
			...stateMigrationStepReceipts.length > 0 ? { stateMigrationStepReceipts } : {},
			...postSessionPluginMigration ? { postSessionPluginMigration } : {},
			...postSessionPluginMigrationPlanBound ? { postSessionPluginMigrationPlanBound: true } : {},
			...postSessionPluginMigrationPlanBound && deferredPluginMigrations.length === 0 && isDeepStrictEqual(stateMigrationInput?.cfg, baseConfig) && stateMigrationStepReceipts.every((receipt) => receipt.id === "plugin-doctor-post-session-state" || (receipt.outcome === "completed" || receipt.outcome === "skipped") && receipt.warnings.length === 0) ? { preflightLegacyStateConfig: baseConfig } : {}
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		await _usingCtx3.d();
	}
}
//#endregion
//#region src/commands/doctor/changes-panel-sink.ts
function createDoctorChangesPanelSink(shouldRepair) {
	const pending = [];
	return {
		emit: (changeLines, options = {}) => {
			if (changeLines.length === 0) return;
			const body = changeLines.join("\n");
			const message = options.sanitize ? sanitizeDoctorNote(body) : body;
			if (shouldRepair) {
				pending.push(message);
				return;
			}
			note(message, "Doctor changes preview");
		},
		drain: () => pending.splice(0)
	};
}
//#endregion
//#region src/commands/doctor/finalize-config-flow.ts
async function finalizeDoctorConfigFlow(params) {
	const confirmedConfigSource = {
		path: params.snapshot.path,
		hash: params.snapshot.hash ?? hashConfigRaw(params.snapshot.raw)
	};
	let cfg = params.cfg;
	let shouldWriteConfig = params.shouldRepair && params.pendingChanges;
	if (!params.shouldRepair && params.pendingChanges) {
		shouldWriteConfig = await params.confirm({
			message: "Apply recommended config repairs now?",
			initialValue: true
		});
		if (shouldWriteConfig) cfg = params.candidate;
		else if (params.fixHints.length > 0) params.note(params.fixHints.join("\n"), "Doctor");
	}
	return {
		cfg,
		shouldWriteConfig,
		confirmedConfigSource
	};
}
//#endregion
//#region src/commands/doctor/shared/config-migration-result.ts
/** Preserve migration provenance before repairs, then prepare the post-write health handoff. */
function prepareDoctorConfigMigrationResult(preflight, snapshot) {
	const sourceVersion = snapshot.sourceConfig.meta?.lastTouchedVersion;
	const sourceLastTouchedVersion = typeof sourceVersion === "string" ? sourceVersion : void 0;
	const billingRouteSource = preflight.modelBillingRouteMigrationSource ?? snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	return async (params) => {
		let modelBillingRouteWarnings = [];
		if ((params.shouldWriteConfig || preflight.modelBillingRouteMigrationSource) && (!isDeepStrictEqual(billingRouteSource.agents, params.cfg.agents) || !isDeepStrictEqual(billingRouteSource.models, params.cfg.models))) {
			const { collectModelBillingRouteMigrationWarnings } = await import("./model-billing-route-migration-7_VU082-.mjs");
			modelBillingRouteWarnings = params.runWithCurrentPluginMetadata(params.cfg, () => collectModelBillingRouteMigrationWarnings({
				before: billingRouteSource,
				after: params.cfg,
				metadataSnapshot: params.metadataSnapshot
			}));
		}
		let receipts = preflight.stateMigrationStepReceipts;
		let postSession = preflight.postSessionPluginMigration;
		const planBound = preflight.postSessionPluginMigrationPlanBound;
		if (planBound && params.pluginInventoryChanged && postSession) {
			const { preparePostSessionPluginMigration } = await import("./state-migrations.plugin-plan-BOk6qV7D.mjs");
			const { resolveLivePluginDoctorStateMigrationInventory } = await import("./doctor-contract-registry-DdkKEDky.mjs");
			postSession = params.runWithCurrentPluginMetadata(params.cfg, () => preparePostSessionPluginMigration({
				mode: "doctor",
				inventory: resolveLivePluginDoctorStateMigrationInventory({
					config: params.cfg,
					env: process.env
				})
			}));
			if (postSession.step.refusal) {
				const { createLegacyStateMigrationStepReceipt } = await import("./state-migrations.messages-2aF4-Shb.mjs");
				receipts = [...receipts ?? [], createLegacyStateMigrationStepReceipt(postSession.step, {
					changes: [],
					warnings: [postSession.step.refusal.message]
				})];
				postSession = void 0;
			}
		}
		return {
			...sourceLastTouchedVersion ? { sourceLastTouchedVersion } : {},
			...modelBillingRouteWarnings.length > 0 ? { modelBillingRouteWarnings } : {},
			...params.metadataSnapshot ? { pluginMetadataSnapshot: params.metadataSnapshot } : {},
			...receipts ? { stateMigrationStepReceipts: receipts } : {},
			...postSession ? { postSessionPluginMigration: postSession } : {},
			...planBound ? { postSessionPluginMigrationPlanBound: true } : {},
			...!params.shouldWriteConfig && !params.pluginInventoryChanged && isDeepStrictEqual(preflight.preflightLegacyStateConfig, params.cfg) ? { preflightLegacyStateConfig: preflight.preflightLegacyStateConfig } : {}
		};
	};
}
//#endregion
//#region src/commands/doctor-config-flow.ts
async function refreshGatewayAuthStateAfterAuthProfileRepair() {
	for (const request of [{
		method: "secrets.reload",
		params: {}
	}, {
		method: "models.authStatus",
		params: { refresh: true }
	}]) try {
		await callGateway({
			...request,
			timeoutMs: 3e3
		});
	} catch {}
}
async function loadAndMaybeMigrateDoctorConfig(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const preparingResources = _usingCtx$1.a(new AsyncDisposableStack());
		const { shouldRepair, nonInteractive } = resolveDoctorRepairMode(params.options);
		const preflight = await withProgress({
			label: "Checking OpenClaw state…",
			enabled: params.options.nonInteractive !== true && params.options.json !== true,
			delayMs: 200
		}, (progress) => runDoctorConfigPreflight({
			retiredStateAdmitted: params.retiredStateAdmitted,
			stateSchemaPreparation: params.stateSchemaPreparation,
			observe: false,
			invocationPurpose: "doctor",
			repairPrefixedConfig: shouldRepair,
			doctorOnlyStateMigrations: shouldRepair,
			deferPluginPackageRepair: nonInteractive && !shouldRepair,
			preparePluginMetadataSnapshot: true,
			agentDatabaseMigrationDiscovery: params.agentDatabaseMigrationDiscovery,
			beforeWorkspaceStateMigration: createWorkspaceAliasMigrationRepair(params.prompter, progress.done),
			measure: async (name, run) => {
				progress.setLabel(`${name.slice(name.lastIndexOf(".") + 1).replaceAll("-", " ")}…`);
				return await run();
			}
		}));
		const { snapshot, baseConfig: baseCfg } = preflight;
		preparingResources.use(preflight.pluginCache);
		if (!snapshot.exists || snapshot.valid) await setAppliedRuntimeConfigSnapshot(snapshot.runtimeConfig, snapshot.sourceConfig);
		const referenceSource = prepareDoctorConfigReferenceSource(snapshot);
		const pluginMetadataSnapshotState = { current: preflight.pluginMetadataSnapshot };
		const { createDoctorPluginMetadataSnapshotScope } = await import("./plugin-metadata-snapshot-scope-DcFL8x0C.mjs");
		const pluginMetadataSnapshotScope = preparingResources.use(createDoctorPluginMetadataSnapshotScope({
			getBaseSnapshot: () => pluginMetadataSnapshotState.current,
			env: process.env,
			getDeferredPluginIds: () => preflight.deferredPluginMigrations?.map((pending) => pending.pluginId) ?? []
		}));
		const runWithPluginMetadataSnapshot = pluginMetadataSnapshotScope.run;
		const invalidatePluginMetadataSnapshot = () => {
			delete configResult.preflightLegacyStateConfig;
			pluginMetadataSnapshotState.current = void 0;
			pluginMetadataSnapshotScope.invalidate();
		};
		const runWithCurrentPluginMetadata = (config, run) => {
			const soleAgentId = tryResolveSoleAgentId(config);
			return runWithPluginMetadataSnapshot({
				config,
				workspaceDir: soleAgentId ? resolveAgentWorkspaceDir(config, soleAgentId) : void 0
			}, run);
		};
		let state = {
			cfg: baseCfg,
			candidate: structuredClone(baseCfg),
			pendingChanges: false,
			fixHints: []
		};
		const explicitSetPaths = [];
		let shouldRepairCronCodexModelRefsAfterConfigWrite = false;
		let openAICodexAuthProfileIdMap;
		let modelRetirementRepairRan = false;
		let retiredModelRefConfig;
		const doctorFixCommand = formatCliCommand("openclaw doctor --fix");
		const changesPanelSink = createDoctorChangesPanelSink(shouldRepair);
		const configRepairWarnings = [...preflight.warnings ?? []];
		const applyConfigMutation = (mutation, fixHint, options = {}) => {
			changesPanelSink.emit(mutation.changes, options.sanitize ? { sanitize: true } : {});
			if (options.emitWarnings !== false && mutation.warnings?.length) {
				emitDoctorNotes({
					note,
					warningNotes: mutation.warnings
				});
				configRepairWarnings.push(...mutation.warnings);
			}
			state = applyDoctorConfigMutation({
				state,
				mutation,
				shouldRepair,
				fixHint
			});
		};
		const finalizeMigrationResult = prepareDoctorConfigMigrationResult(preflight, snapshot);
		const plannedProviderRenames = runWithCurrentPluginMetadata(state.candidate, () => planProviderRenames(snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig, resolvePluginDoctorProviderRenames({ config: state.candidate })));
		const sourceRosterConfig = snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
		const rosterMigrationNeeded = findLegacyConfigRuleIssues(sourceRosterConfig, LEGACY_AGENT_ROSTER_RULES).length > 0 || listAgentEntries(sourceRosterConfig).length === 0 || baseCfg.agents?.ownership === void 0 && listAgentEntries(baseCfg).length > 1;
		const legacyStep = runWithCurrentPluginMetadata(state.candidate, () => applyLegacyCompatibilityStep({
			snapshot,
			state,
			shouldRepair,
			doctorFixCommand
		}));
		state = legacyStep.state;
		const legacyDefaultAgentId = preflight.rosterMigrationOwnerId ?? tryGetLegacyDefaultAgentId(state.candidate) ?? resolveLegacyAgentRosterOwner(preflight.rosterMigrationSource ?? sourceRosterConfig);
		if (legacyDefaultAgentId) {
			retainLegacyDefaultAgentId(state.cfg, legacyDefaultAgentId);
			retainLegacyDefaultAgentId(state.candidate, legacyDefaultAgentId);
		}
		const includeOwnsRoster = configIncludeOwnsAgentRoster(snapshot);
		const persistCanonicalAgentRoster = snapshot.exists && rosterMigrationNeeded && !includeOwnsRoster;
		if (persistCanonicalAgentRoster) {
			applyConfigMutation({
				config: state.candidate,
				changes: ["Prepared the agent roster for persistence."]
			}, `Run "${doctorFixCommand}" to persist the explicit agent roster.`, { emitWarnings: false });
			if (state.candidate.agents?.ownership === "explicit") explicitSetPaths.push(["agents", "ownership"]);
		}
		const { prepareSessionStoreOwnerRecovery } = await import("./doctor-session-store-owner-D67cTsuP.mjs");
		const sessionStoreOwnerRecovery = await prepareSessionStoreOwnerRecovery({
			config: state.candidate,
			snapshot,
			prompter: params.prompter
		});
		applyConfigMutation(sessionStoreOwnerRecovery, `Run "${doctorFixCommand}" to review session-store ownership recovery.`, { sanitize: true });
		const { collectBlockedLegacyOpenAICodexProviderPlan } = await import("./legacy-config-migrations.runtime.models-DSxUkbbC.mjs");
		const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
		const blockedCodexModelIdentities = new Set(blockedCodexProviderPlan.blockedModelIdentities);
		if (preflight.cronCodexRuntimePolicyTargets?.length) {
			const { repairCronCodexRuntimePolicies } = await import("./runtime-policy-migration-D6e8GilW.mjs");
			const cronRuntimeRepair = repairCronCodexRuntimePolicies({
				cfg: state.candidate,
				targets: preflight.cronCodexRuntimePolicyTargets,
				blockedModelIdentities: blockedCodexModelIdentities
			});
			applyConfigMutation(cronRuntimeRepair, `Run "${doctorFixCommand}" to preserve migrated cron runtime policy.`);
			const blockedTargets = new Set(cronRuntimeRepair.blockedTargets.map(cronCodexRuntimePolicyTargetKey));
			shouldRepairCronCodexModelRefsAfterConfigWrite = preflight.cronCodexRuntimePolicyTargets.some((target) => !blockedTargets.has(cronCodexRuntimePolicyTargetKey(target)));
		}
		const pluginLegacyIssues = await (async () => {
			if (snapshot.parsed === snapshot.sourceConfig) return [];
			const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-CJxMWAAM.mjs");
			return runWithCurrentPluginMetadata(state.candidate, () => findDoctorLegacyConfigIssues(snapshot.parsed, snapshot.parsed));
		})();
		const seenLegacyIssues = new Set(snapshot.legacyIssues.map((issue) => `${issue.path}:${issue.message}`));
		const pluginIssueLines = pluginLegacyIssues.filter((issue) => {
			const key = `${issue.path}:${issue.message}`;
			if (seenLegacyIssues.has(key)) return false;
			seenLegacyIssues.add(key);
			return true;
		}).map((issue) => `- ${issue.path}: ${issue.message}`);
		const legacyIssueLines = [...legacyStep.issueLines, ...pluginIssueLines];
		if (pluginIssueLines.length > 0 && !shouldRepair && !state.fixHints.includes(`Run "${doctorFixCommand}" to migrate legacy config keys.`)) state.fixHints.push(`Run "${doctorFixCommand}" to migrate legacy config keys.`);
		if (legacyIssueLines.length > 0) note(legacyIssueLines.join("\n"), "Legacy config keys detected");
		changesPanelSink.emit(legacyStep.changeLines);
		const { MODEL_METADATA_CORRUPTION_AUDIT_LIMIT, repairGeneratedModelMetadataCorruption } = await import("./model-metadata-corruption-repair-d4qRy8tY.mjs");
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => repairGeneratedModelMetadataCorruption({
			config: state.candidate,
			authoredRoot: snapshot.parsed,
			configPath: snapshot.path,
			currentHash: hashConfigRaw(snapshot.raw),
			auditRecords: readRecentConfigAuditRecords({
				env: process.env,
				homedir,
				limit: MODEL_METADATA_CORRUPTION_AUDIT_LIMIT
			})
		})), `Run "${doctorFixCommand}" to remove audit-proven generated model metadata.`);
		noteDoctorHookConfigWarnings(state.cfg, snapshot.path);
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => normalizeCompatibilityConfigValues(state.candidate, {
			blockedModelIdentities: blockedCodexModelIdentities,
			sourceRaw: snapshot.parsed
		})), `Run "${doctorFixCommand}" to apply these changes.`);
		const { recoverCommandOwnerTargetKinds } = await import("./doctor-command-owner-recovery-DYHg3QMa.mjs");
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => recoverCommandOwnerTargetKinds({
			config: state.candidate,
			snapshot
		})), `Run "${doctorFixCommand}" to restore recorded command-owner target kinds.`, { sanitize: true });
		const { repairUnownedChannelAccountBindings } = await import("./legacy-config-binding-repair-BtV5RQEw.mjs");
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => repairUnownedChannelAccountBindings({
			config: state.candidate,
			sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations
		})), `Run "${doctorFixCommand}" to preserve channel account ownership.`);
		const { collectTailscaleConfigWarnings } = await import("./doctor-tailscale-DhDGysqS.mjs");
		const tailscaleWarnings = await collectTailscaleConfigWarnings({
			cfg: state.candidate,
			env: process.env
		});
		emitDoctorNotes({
			note,
			warningNotes: tailscaleWarnings
		});
		configRepairWarnings.push(...tailscaleWarnings);
		const { prepareRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-CeVuBhuT.mjs");
		const retiredPhoneControlCleanup = await prepareRetiredPhoneControlCleanup({
			cfg: state.candidate,
			env: process.env
		});
		applyConfigMutation({
			config: retiredPhoneControlCleanup.config,
			changes: retiredPhoneControlCleanup.configChanges,
			warnings: retiredPhoneControlCleanup.warnings
		}, `Run "${doctorFixCommand}" to retire Phone Control lease configuration.`);
		if (retiredPhoneControlCleanup.cleanupPending && !shouldRepair) note(`Retired Phone Control lease state remains. Run "${doctorFixCommand}" to archive it.`, "Legacy state detected");
		const { recoverInstalledPluginConfigIds } = await import("./installed-plugin-id-recovery-BSECgX5c.mjs");
		const installedPluginRecovery = await recoverInstalledPluginConfigIds(state.candidate, process.env);
		applyConfigMutation({
			...installedPluginRecovery,
			warnings: installedPluginRecovery.notices
		}, `Run "${doctorFixCommand}" to apply these changes.`);
		if (referenceSource) referenceSource.installedPluginIdRecovery = installedPluginRecovery.recovery;
		const pluginActivationSourceConfig = state.candidate;
		const { collectCodexPluginActivationWarnings } = await import("./codex-plugin-activation-warning-cn_i_J1A.mjs");
		emitDoctorNotes({
			note,
			warningNotes: collectCodexPluginActivationWarnings(pluginActivationSourceConfig)
		});
		const { applyPluginAutoEnable } = await import("./plugin-auto-enable-Bu_LNzrn.mjs");
		applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => applyPluginAutoEnable({
			config: state.candidate,
			env: process.env
		})), `Run "${doctorFixCommand}" to apply these changes.`, { emitWarnings: false });
		if (!shouldRepair) {
			const { repairStaleAgentModelRefs } = await import("./stale-agent-model-ref-repair-co6lyeBq.mjs");
			const staleAgentModelRepair = runWithCurrentPluginMetadata(state.candidate, () => repairStaleAgentModelRefs(state.candidate, { env: process.env }));
			retiredModelRefConfig = staleAgentModelRepair.retiredModelRefConfig;
			applyConfigMutation(staleAgentModelRepair, `Run "${doctorFixCommand}" to remove stale agent model references.`, { sanitize: true });
		}
		const [{ collectPluginToolAllowlistWarnings }, { collectGitHubUpgradeWarnings }, { normalizePluginsConfig }] = await Promise.all([
			import("./plugin-tool-allowlist-warnings-Qcc8LgIQ.mjs"),
			import("./github-preview-upgrade-BTKR_0AG.mjs"),
			import("./config-state-CyfjMBXR.mjs")
		]);
		const pluginWarnings = [...runWithCurrentPluginMetadata(state.candidate, () => collectPluginToolAllowlistWarnings({
			cfg: state.candidate,
			env: process.env
		})), ...collectGitHubUpgradeWarnings(normalizePluginsConfig(state.candidate.plugins))];
		if (pluginWarnings.length > 0) note(sanitizeDoctorNote(pluginWarnings.join("\n")), "Doctor warnings");
		const hasConfiguredChannels = listDoctorConfiguredChannelIds(state.candidate, { configEntryPolicy: "raw" }).length > 0;
		let collectMutableAllowlistWarnings;
		if (hasConfiguredChannels) {
			const channelDoctor = await import("./channel-doctor-CD3cyZRn.mjs");
			collectMutableAllowlistWarnings = channelDoctor.collectChannelDoctorMutableAllowlistWarnings;
			const channelDoctorSequence = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.runChannelDoctorConfigSequences({
				cfg: state.candidate,
				env: process.env,
				shouldRepair
			}));
			emitDoctorNotes({
				note,
				changeNotes: channelDoctorSequence.changeNotes,
				infoNotes: channelDoctorSequence.infoNotes,
				warningNotes: channelDoctorSequence.warningNotes
			});
			const staleChannelCleanups = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.collectChannelDoctorStaleConfigMutations(state.candidate, { env: process.env }));
			for (const staleCleanup of staleChannelCleanups) applyConfigMutation(staleCleanup, `Run "${doctorFixCommand}" to remove stale channel plugin references.`, { sanitize: true });
		}
		const { repairHooksTokenReuseGatewayAuth } = await import("./hooks-token-reuse-repair-pTRKJIET.mjs");
		applyConfigMutation(await repairHooksTokenReuseGatewayAuth(state.candidate, process.env), `Run "${doctorFixCommand}" to rotate hooks.token away from Gateway auth.`, { emitWarnings: false });
		if (shouldRepair) {
			const { runDoctorRepairSequence } = await import("./repair-sequencing-CLHL1gMx.mjs");
			const prompter = params.prompter;
			const repairSequence = await runDoctorRepairSequence({
				state,
				installedPluginIdRecovery: installedPluginRecovery.recovery,
				doctorFixCommand,
				env: process.env,
				blockedCodexProviderPlan,
				pluginMetadataSnapshotState,
				runWithPluginMetadataSnapshot,
				...prompter ? { onCapabilityConsent: createPluginCapabilityConsentPrompter({
					note: async (message, title) => note(message, title),
					confirm: (confirmation) => prompter.confirmRuntimeRepair({
						...confirmation,
						requiresInteractiveConfirmation: true
					})
				}) } : {}
			});
			state = repairSequence.state;
			configRepairWarnings.push(...repairSequence.warningNotes);
			if (referenceSource) referenceSource.installedPluginIdRecovery = new Map([...installedPluginRecovery.recovery, ...repairSequence.installedPluginIdRecovery]);
			pluginMetadataSnapshotState.current = repairSequence.pluginMetadataSnapshot;
			openAICodexAuthProfileIdMap = repairSequence.openAICodexAuthProfileIdMap;
			retiredModelRefConfig = repairSequence.retiredModelRefConfig;
			modelRetirementRepairRan = repairSequence.modelRetirementRepairRan;
			if (repairSequence.authProfilesRepaired) await refreshGatewayAuthStateAfterAuthProfileRepair();
			emitDoctorNotes({
				note,
				changeNotes: repairSequence.changeNotes,
				warningNotes: repairSequence.warningNotes
			});
			for (const configChange of repairSequence.configChangeNotes ?? []) changesPanelSink.emit([configChange]);
		} else {
			const { collectDoctorPreviewNotes } = await import("./preview-warnings-C7VfPXk9.mjs");
			const previewNotes = await runWithCurrentPluginMetadata(state.candidate, () => collectDoctorPreviewNotes({
				cfg: state.candidate,
				activationSourceConfig: pluginActivationSourceConfig,
				doctorFixCommand,
				env: process.env,
				allowExec: params.options.allowExec === true,
				blockedCodexProviderPlan
			}));
			emitDoctorNotes({
				note,
				infoNotes: previewNotes.infoNotes,
				warningNotes: previewNotes.warningNotes
			});
		}
		const mutableAllowlistWarnings = collectMutableAllowlistWarnings ? await runWithCurrentPluginMetadata(state.candidate, () => collectMutableAllowlistWarnings({
			cfg: state.candidate,
			env: process.env
		})) : [];
		if (mutableAllowlistWarnings.length > 0) note(sanitizeDoctorNote(mutableAllowlistWarnings.join("\n")), "Doctor warnings");
		const unknownStep = applyUnknownConfigKeyStep({
			state,
			shouldRepair,
			doctorFixCommand
		});
		state = unknownStep.state;
		if (unknownStep.removed.length > 0 || unknownStep.repairs.length > 0) {
			const lines = [...unknownStep.removed.map((pathLocal) => `- ${pathLocal}`), ...unknownStep.repairs.map((change) => `- ${change}`)];
			if (shouldRepair) changesPanelSink.emit(lines);
			else note(lines.join("\n"), "Unknown config keys");
		}
		if (unknownStep.warnings.length > 0) note(unknownStep.warnings.join("\n"), "Doctor warnings");
		const finalized = await finalizeDoctorConfigFlow({
			...state,
			snapshot,
			shouldRepair,
			confirm: params.confirm,
			note
		});
		const cfg = finalized.cfg;
		const shouldWriteConfig = finalized.shouldWriteConfig && legacyStep.blocksWrite !== true;
		const includeBoundaryWrite = shouldWriteConfig && canWriteDoctorInclude(snapshot, cfg, {
			persistCanonicalAgentRoster,
			explicitSetPaths
		}, referenceSource?.installedPluginIdRecovery);
		const configuredOpencodePluginIds = [cfg.models?.providers?.opencode || cfg.models?.providers?.["opencode-zen"] ? "opencode" : void 0, cfg.models?.providers?.["opencode-go"] ? "opencode-go" : void 0].filter((pluginId) => pluginId !== void 0);
		let activeOpencodePluginIds = [];
		if (configuredOpencodePluginIds.length > 0) {
			const { resolveEnabledProviderPluginIds } = await import("./providers-BlOZCwS6.mjs");
			activeOpencodePluginIds = runWithCurrentPluginMetadata(cfg, () => resolveEnabledProviderPluginIds({
				config: cfg,
				onlyPluginIds: configuredOpencodePluginIds
			}));
		}
		noteOpencodeProviderOverrides(cfg, {
			opencodePluginActive: activeOpencodePluginIds.includes("opencode"),
			opencodeGoPluginActive: activeOpencodePluginIds.includes("opencode-go")
		});
		noteImplicitFallbackClobberWarnings(cfg);
		noteSandboxOriginProxyWarning(cfg);
		noteMcpOriginWarning(cfg);
		noteMediaCliModelWarnings(cfg);
		noteMissingDefaultAgentOwner(cfg);
		const migrationResult = await finalizeMigrationResult({
			cfg,
			shouldWriteConfig,
			pluginInventoryChanged: pluginMetadataSnapshotState.inventoryChanged,
			metadataSnapshot: pluginMetadataSnapshotState.current,
			runWithCurrentPluginMetadata
		});
		const pendingChangePanels = changesPanelSink.drain();
		const providerRenames = legacyStep.blocksWrite ? [] : plannedProviderRenames;
		await setAppliedRuntimeConfigSnapshot(cfg, cfg);
		const resources = preparingResources.move();
		const configResult = {
			[Symbol.asyncDispose]: () => resources.disposeAsync(),
			...finalized,
			...shouldWriteConfig && sessionStoreOwnerRecovery.changes.length > 0 ? { confirmedConfigSource: {
				path: snapshot.path,
				hash: snapshot.hash ?? hashConfigRaw(snapshot.raw)
			} } : {},
			...referenceSource ? { referenceSource } : {},
			path: snapshot.path ?? CONFIG_PATH,
			shouldWriteConfig,
			...configRepairWarnings.length ? { warnings: [...new Set(configRepairWarnings)] } : {},
			...shouldWriteConfig && pendingChangePanels.length > 0 ? { pendingChangePanels } : {},
			sourceConfigValid: snapshot.valid,
			...legacyStep.partiallyValid === true ? { skipPluginValidationOnWrite: true } : {},
			...shouldWriteConfig && explicitSetPaths.length > 0 ? { explicitSetPaths } : {},
			...shouldWriteConfig && persistCanonicalAgentRoster ? { persistCanonicalAgentRoster: true } : {},
			...includeBoundaryWrite ? { skipWizardMetadataForIncludeWrite: true } : {},
			...shouldRepairCronCodexModelRefsAfterConfigWrite ? { shouldRepairCronCodexModelRefsAfterConfigWrite: true } : {},
			...shouldRepair && retiredPhoneControlCleanup.cleanupPending && retiredPhoneControlCleanup.cleanupSafe ? { retiredPhoneControlStateCleanupPending: true } : {},
			...blockedCodexProviderPlan.blockedModelIdentities.length > 0 ? { blockedCodexModelIdentities: blockedCodexProviderPlan.blockedModelIdentities } : {},
			...openAICodexAuthProfileIdMap ? { openAICodexAuthProfileIdMap } : {},
			...retiredModelRefConfig ? { retiredModelRefConfig } : {},
			...providerRenames.length > 0 ? { providerRenames } : {},
			modelRetirementRepairRan: modelRetirementRepairRan && !legacyStep.blocksWrite && (shouldWriteConfig || snapshot.valid),
			...migrationResult,
			runWithPluginMetadataSnapshot,
			invalidatePluginMetadataSnapshot
		};
		return configResult;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { loadAndMaybeMigrateDoctorConfig };
