import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { r as createInvalidConfigError } from "./io.invalid-config-BzeD3bi5.mjs";
import { d as resolveHomeDir } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { S as resolveIsConfigReadOnly, m as resolveConfigPath, p as resolveCanonicalConfigPath, t as CONFIG_PATH } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-DTVdt0cq.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { r as cloneEnvWithPlatformSemantics, y as resolveFutureConfigActionBlock } from "./config-env-vars-DjPHKieF.mjs";
import { m as withOpenClawStateDatabaseReadSnapshot, o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-ownership-BDcUGGMF.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { l as tryResolveSoleAgentId, n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { i as hashConfigRaw, s as parseConfigJson5, t as coerceConfig } from "./io.read-helpers-Bvdjf9tk.mjs";
import { r as UPDATE_ENVIRONMENT_FAILURE_REASONS } from "./update-outcome-BHX5xsqd.mjs";
import { m as shouldSkipLegacyUpdateDoctorConfigWrite, p as shouldDeferConfiguredPluginInstallRepair } from "./update-phase-BClSJ17n.mjs";
import { c as readDeferredPluginMigrations, i as mergeDeferredPluginMigration, r as formatDeferredPluginMigration, t as DeferredPluginMigrationConflictError, u as recordDeferredPluginMigrations } from "./deferred-plugin-migrations-by1ypkxx.mjs";
import { C as setActiveDegradedPlugins } from "./discovery-Dma3bVNk.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-C4Wdbs53.mjs";
import { c as recoverConfigFromLastKnownGoodCore, l as createConfigIoContext, n as prepareConfigRecoveryFromContext } from "./io.factory-DWrU5KGJ.mjs";
import { f as readRecentConfigAuditRecords } from "./io.audit-BXzMurur.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { a as resolveDeferredPluginMigrationConfigPaths, i as preserveDeferredPluginMigrationConfig } from "./deferred-plugin-migration-config-Db8uALnk.mjs";
import { h as LEGACY_AGENT_ROSTER_RULES, n as findLegacyConfigRuleIssues } from "./legacy-Bu4WPgr_.mjs";
import { i as tryGetLegacyDefaultAgentId, r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { r as resolveLegacyAgentRosterOwner } from "./legacy.roster-D0lEOcPT.mjs";
import { t as classifyOtelGrpcMigrationOwnership } from "./include-migration-ownership-jJubBWXv.mjs";
import "./env-vars-Bcb14_jq.mjs";
import { t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-CHtmWQjc.mjs";
import { h as readCurrentConfigForResolution, y as recoverConfigFromJsonRootSuffix } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { _ as recordAgentDatabaseAdmissions, l as evaluateAgentDatabaseAdmissions, m as listAgentDatabaseAdmissionRefusals, r as canIsolateAgentDatabase } from "./agent-database-admission-dWNS6Rcs.mjs";
import "./installed-plugin-index-records-VCj98mZ6.mjs";
import { t as findRetiredConfigUpgradeRequirement } from "./retired-config-formats-yKg5AICE.mjs";
import { t as note } from "./note-Byxgt4MB.mjs";
import { n as sanitizeDoctorNote, t as emitDoctorNotes } from "./emit-notes-CPyL1dzc.mjs";
import { a as migrateLegacyConfig, c as noteDoctorConfigPreflightIssues, d as noteMcpOriginWarning, f as noteMediaCliModelWarnings, h as noteSandboxOriginProxyWarning, l as noteDoctorHookConfigWarnings, m as noteOpencodeProviderOverrides, n as applyUnknownConfigKeyStep, o as applyLegacyDoctorMigrations, p as noteMissingDefaultAgentOwner, r as prepareDoctorConfigReferenceSource, t as applyLegacyCompatibilityStep, u as noteImplicitFallbackClobberWarnings } from "./config-flow-steps-ZXEVMxo9.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-Ce74V-mJ.mjs";
import { r as callGateway } from "./call-DnqhP17M.mjs";
import { t as getAgentDatabaseStartupAdmission } from "./agent-database-startup-n_PGS5Sj.mjs";
import { n as resolveCronJobsStorePathFromConfig } from "./paths-C7ju4So0.mjs";
import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-CGgxPHve.mjs";
import { n as commitAutomaticConfigRepair, r as planAutomaticConfigRepair, t as canPlanAutomaticConfigRepair } from "./automatic-config-repair-DyG5q8Ux.mjs";
import { n as assertNoRetiredStateFiles } from "./state-migrations.retired-files-Dlsbs5FH.mjs";
import { r as listReferencedLegacyOAuthSidecarPaths, t as assertNoRetiredOAuthSidecarsBeforeConfigRecovery } from "./doctor-auth-legacy-paths-CYXKyNhX.mjs";
import { t as listRetiredCronStateFiles } from "./state-migrations.retired-cron-files-BfwwvNnu.mjs";
import { t as readRetiredDeferredPluginMigrationWarnings } from "./deferred-plugin-migration-warnings-Bi1cLcKC.mjs";
import { c as throwIfDoctorStateMigrationRefused, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CXxBVY0a.mjs";
import { c as measureDoctorConfigPreflightStep, n as runDoctorPluginConvergence, r as assertPreflightConfigUnchanged, s as readConfigPreflightSnapshot } from "./doctor-config-preflight-plugin-verification-D6-8QRyL.mjs";
import { n as createDoctorPluginMetadataSnapshotScope } from "./plugin-metadata-snapshot-scope-DlqQbiDN.mjs";
import { t as inspectPluginMigrationAvailability } from "./plugin-migration-availability-4rKUejlI.mjs";
import { n as createWorkspaceAliasMigrationRepair } from "./doctor-workspace-alias-BScvQzRT.mjs";
import { r as cronCodexRuntimePolicyTargetKey } from "./store-migration-bjHoqgkQ.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-T3qeDQIp.mjs";
import { t as normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate-DbMfBGRb.mjs";
import { t as canWriteDoctorInclude } from "./roster-include-write-eqsRxyY4.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
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
		const { completeUpdateCandidatePluginRehearsal } = await import("./update-candidate-plugin-repair-BCX2_maY.mjs");
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
	const planScopedConfigRepair = (snapshot) => {
		return params.runWithPluginMetadataSnapshot({ config: snapshot.sourceConfig ?? snapshot.config ?? {} }, () => planAutomaticConfigRepair(snapshot));
	};
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
		activeConfigRepair = typeof snapshot.raw === "string" && parseConfigJson5(snapshot.raw).ok ? params.planRepair(snapshot) : null;
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
	const changes = [];
	const home = resolveHomeDir();
	if (!home) return changes;
	const targetPath = resolveCanonicalConfigPath();
	const targetDir = path.dirname(targetPath);
	try {
		await fs$1.access(targetPath);
		return changes;
	} catch {}
	const legacyPath = path.join(home, ".clawdbot", "clawdbot.json");
	try {
		await fs$1.access(legacyPath);
	} catch {
		return changes;
	}
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
//#region src/commands/doctor-config-preflight-migrations.ts
/** Settle package repairs before state migrations select their plugin owners. */
async function prepareDoctorMigrationPlugins(params) {
	const convergence = await runDoctorPluginConvergence(params);
	setActiveDegradedPlugins(convergence.quarantinedPlugins);
	await params.onDeferredPlugins(convergence.deferredPlugins ?? [], convergence.migrationInspection);
	const refreshed = await params.readRefreshedSnapshot();
	assertPreflightConfigUnchanged(params.snapshotRead.snapshot, refreshed.snapshot);
	return refreshed;
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
			const { assertConfiguredWorkspaceStateReady } = await import("./workspace-state-dirs-C4Mg9nzg.mjs");
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
function noteStateMigrationResult(result) {
	for (const key of [
		"changes",
		"notices",
		"warnings"
	]) if (result[key]?.length) note(result[key].map((entry) => `- ${entry}`).join("\n"), `Doctor ${key}`);
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
	const persistPending = async (pending, resolvedPluginIds) => {
		try {
			const committed = await recordDeferredPluginMigrations({
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
			const { autoMigrateLegacyPluginDoctorState } = await import("./state-migrations.plugin-doctor-C2nN3y97.mjs");
			params.report(await params.measure("plugin-doctor-migrations", () => params.runWithPluginMetadataSnapshot({ config }, () => autoMigrateLegacyPluginDoctorState({
				config,
				env: params.env(),
				log: params.log,
				...params.doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {}
			}))));
		},
		async converged(pending, snapshot, metadata, inspection) {
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
		async complete() {
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
			if (!await persistPending(pending, resolvedPluginIds)) return true;
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
//#region src/commands/doctor-config-preflight.cron.ts
/** Preserve a retired partition selector even when other config cannot drive core migrations. */
async function migrateRetainedStore(params) {
	const cfg = retainStoreConfig(params.config);
	if (!cfg) return;
	const { repairLegacyCronStoreWithoutPrompt } = await params.measure("cron-repair-import", () => import("./legacy-repair-DVFs_EKh.mjs"));
	params.report(await params.measure("cron-repair", () => repairLegacyCronStoreWithoutPrompt({
		cfg,
		migrateCodexModelRefs: false
	})));
	const { migrateLegacyConfigMachineState } = await import("./state-migrations.config-machine-state-BGq4_GMW.mjs");
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
	const [{ runExistingOpenClawStateWriteTransaction }, { executeSqliteQuerySync, executeSqliteQueryTakeFirstSync, getNodeSqliteKysely }, { decodeRun }, { encodeRun }, { updateRunLedgerSchema, upsertStep }] = await Promise.all([
		import("./openclaw-state-db-existing-write-D14qTgJt.mjs"),
		import("./kysely-sync-CoevGH3_.mjs"),
		import("./update-run-read.kernel-NF8yjkI7.mjs"),
		import("./update-run-codec-BtYThXHP.mjs"),
		import("./update-run-write-QAXTZ_hR.mjs")
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
		import("./update-run-activity-C6JhZrSC.mjs"),
		import("./update-run-reader-C-3VhFcB.mjs"),
		import("./update-run-report-S-g6zEkF.mjs"),
		import("./update-run-step-CGy-iIV_.mjs"),
		import("./update-run-interruption-B4IjvrGc.mjs"),
		import("./update-run-record-D0bE4SF0.mjs"),
		import("./update-run-interruption-worker-CPCqEDrt.mjs")
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
	if (params.postConvergenceConfig) return {
		cfg: params.postConvergenceConfig,
		sourceConfigBeforeMigrations,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
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
		sourceConfigBeforeMigrations,
		...pluginDoctorConfig ? { pluginDoctorConfig } : {}
	};
}
//#endregion
//#region src/commands/doctor-config-preflight.ts
/** Config preflight for Doctor: legacy migration, recovery, and snapshot loading. */
const loadState = createLazyRuntimeModule(() => import("./state-migrations.state-dir-CcLE5N3u.mjs"));
const loadCronRepair = createLazyRuntimeModule(() => import("./legacy-repair-DVFs_EKh.mjs"));
/** Preserve retired state inputs before the main Doctor config repair flow. */
async function runDoctorConfigPreflight(options = {}) {
	if (options.migrateState !== false && options.doctorOnlyStateMigrations === true) {
		const { withSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-DPlfD0t8.mjs");
		return await withSqliteReadOnlyWorkerScope(() => runDoctorConfigPreflightOperation(options));
	}
	return await runDoctorConfigPreflightOperation(options);
}
async function runDoctorConfigPreflightOperation(options) {
	assertNoRetiredOAuthSidecarsBeforeConfigRecovery({ env: process.env });
	const { config: inspectionConfig, env: inspectionEnv } = readCurrentConfigForResolution();
	assertNoRetiredStateFiles("OAuth credential sidecars", listReferencedLegacyOAuthSidecarPaths(inspectionEnv, inspectionConfig));
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
	const pluginMetadata = createDoctorPluginMetadataSnapshotScope({
		getBaseSnapshot: () => configSnapshotRead?.pluginMetadataSnapshot,
		env: process.env,
		getDeferredPluginIds: () => pluginMigrations.deferred().map((pending) => pending.pluginId)
	});
	const noteDoctorStateMigrationResult = (result) => {
		pluginMigrations.observe(result);
		noteStateMigrationResult(result);
	};
	const getSnapshotPreparation = createDoctorRehearsalSnapshotPreparation(noteDoctorStateMigrationResult);
	const { planScopedConfigRepair, planAdmittedConfigRepair } = createDoctorConfigRepairPlanner({
		options,
		stateMigrationsRequested,
		skipLegacyParentConfigWrite,
		runWithPluginMetadataSnapshot: pluginMetadata.run
	});
	const readConfigSnapshotForPreflight = async (allowCurrentPluginMetadata = true) => await measurePreflightStep("config-snapshot", async () => readConfigPreflightSnapshot({
		purpose: "doctor",
		allowCurrentPluginMetadata,
		includePluginMetadata: options.preparePluginMetadataSnapshot === true,
		measure: options.measure,
		observe: options.observe,
		preparePluginMetadataSnapshot: options.preparePluginMetadataSnapshot === true,
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
	let automaticConfigRepair = planAdmittedConfigRepair(snapshot, activeConfigRepair);
	if (options.doctorOnlyStateMigrations === true && stateDirMigrations) {
		const { prepareLegacyStateDatabaseSchema } = await import("./state-migrations.doctor-Cz_VEwpW.mjs");
		const receipt = await measurePreflightStep("state-schema", () => prepareLegacyStateDatabaseSchema(process.env));
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
		const { repairLegacySessionEntryStates } = await import("./doctor-session-delivery-state-BiFPaS42.mjs");
		const repair = options.doctorOnlyStateMigrations === true && stateDirMigrations !== void 0;
		const entryState = await measurePreflightStep("session-entry-state", () => repairLegacySessionEntryStates({
			apply: repair,
			cfg: automaticConfigRepair?.config ?? baseConfig,
			env: process.env,
			deferSchemaRepair: repair
		}));
		if (!repair && entryState.found > 0) {
			const { SessionStoreMigrationRequiredError } = await import("./migration-required-BVCOqvE2.mjs");
			throw new SessionStoreMigrationRequiredError(`Found ${entryState.found} session rows with legacy entry state. Run openclaw doctor --fix before further session inspection; no rows were changed.`);
		}
	}
	let postConvergenceStateConfig;
	if (stateDirMigrations) {
		const refreshed = await prepareDoctorMigrationPlugins({
			cfg: automaticConfigRepair?.config ?? baseConfig,
			env: process.env,
			retainedPluginIds: pluginMigrations.retainedPluginIds(),
			measure: options.measure,
			snapshotRead: {
				...configSnapshotRead,
				snapshot
			},
			readRefreshedSnapshot: () => readConfigSnapshotForPreflight(false),
			onDeferredPlugins: (pending, inspection) => pluginMigrations.converged(pending, snapshot, configSnapshotRead?.pluginMetadataSnapshot, inspection)
		});
		configSnapshotRead = refreshed;
		pluginMetadata.invalidate();
		snapshot = refreshed.snapshot;
		baseConfig = snapshot.sourceConfig ?? snapshot.config ?? {};
		automaticConfigRepair = planAdmittedConfigRepair(snapshot);
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
			const { detectLegacyExecApprovals, migrateLegacyExecApprovals } = await import("./state-migrations.exec-approvals-DMnMX8tw.mjs");
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
				const { autoMigrateLegacyState } = await import("./state-migrations.doctor-Cz_VEwpW.mjs");
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
		const { migrateLegacyMediaPersistence } = await import("./state-migrations.media-persistence-8y8JwGUf.mjs");
		noteDoctorStateMigrationResult(await measurePreflightStep("media-persistence-migration", () => migrateLegacyMediaPersistence({ env: process.env })));
		const { repairLegacySessionEntryStates } = await import("./doctor-session-delivery-state-BiFPaS42.mjs");
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
		automaticConfigRepair = planAdmittedConfigRepair(snapshot);
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
		rosterMigrationSource,
		...rosterMigrationOwnerId ? { rosterMigrationOwnerId } : {},
		...deferredPluginMigrations.length > 0 ? { deferredPluginMigrations } : {},
		...modelBillingRouteMigrationSource ? { modelBillingRouteMigrationSource } : {},
		...configSnapshotRead.pluginMetadataSnapshot ? { pluginMetadataSnapshot: configSnapshotRead.pluginMetadataSnapshot } : {},
		...cronCodexRuntimePolicyTargets.length > 0 ? { cronCodexRuntimePolicyTargets } : {},
		...stateMigrationStepReceipts.length > 0 ? { stateMigrationStepReceipts } : {},
		...postSessionPluginMigration ? { postSessionPluginMigration } : {},
		...postSessionPluginMigrationPlanBound ? { postSessionPluginMigrationPlanBound: true } : {}
	};
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
/** Decide whether doctor should write the repaired candidate config or only print hints. */
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
			const { collectModelBillingRouteMigrationWarnings } = await import("./model-billing-route-migration-CFhOiVhM.mjs");
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
			const { resolveLivePluginDoctorStateMigrationInventory } = await import("./doctor-contract-registry-DhIX_eR4.mjs");
			postSession = params.runWithCurrentPluginMetadata(params.cfg, () => preparePostSessionPluginMigration({
				mode: "doctor",
				inventory: resolveLivePluginDoctorStateMigrationInventory({
					config: params.cfg,
					env: process.env
				})
			}));
			if (postSession.step.refusal) {
				const { createLegacyStateMigrationStepReceipt } = await import("./state-migrations.messages-CHAbDmBr.mjs");
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
			...planBound ? { postSessionPluginMigrationPlanBound: true } : {}
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
	const shouldRepair = params.options.repair === true || params.options.yes === true;
	const preflight = await withProgress({
		label: "Checking OpenClaw state…",
		enabled: params.options.nonInteractive !== true && params.options.json !== true,
		delayMs: 200
	}, (progress) => runDoctorConfigPreflight({
		observe: false,
		invocationPurpose: "doctor",
		repairPrefixedConfig: shouldRepair,
		doctorOnlyStateMigrations: shouldRepair,
		preparePluginMetadataSnapshot: true,
		...params.agentDatabaseMigrationDiscovery ? { agentDatabaseMigrationDiscovery: params.agentDatabaseMigrationDiscovery } : {},
		beforeWorkspaceStateMigration: createWorkspaceAliasMigrationRepair(params.prompter, progress.done),
		measure: async (name, run) => {
			progress.setLabel(`${name.slice(name.lastIndexOf(".") + 1).replaceAll("-", " ")}…`);
			return await run();
		}
	}));
	const { snapshot, baseConfig: baseCfg } = preflight;
	const referenceSource = prepareDoctorConfigReferenceSource(snapshot);
	const pluginMetadataSnapshotState = { current: preflight.pluginMetadataSnapshot };
	const { createDoctorPluginMetadataSnapshotScope } = await import("./plugin-metadata-snapshot-scope-DzRmGxhx.mjs");
	const pluginMetadataSnapshotScope = createDoctorPluginMetadataSnapshotScope({
		getBaseSnapshot: () => pluginMetadataSnapshotState.current,
		env: process.env,
		getDeferredPluginIds: () => preflight.deferredPluginMigrations?.map((pending) => pending.pluginId) ?? []
	});
	const runWithPluginMetadataSnapshot = pluginMetadataSnapshotScope.run;
	const invalidatePluginMetadataSnapshot = () => {
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
	const configRepairWarnings = [];
	const applyConfigMutation = (mutation, options) => {
		changesPanelSink.emit(mutation.changes, options.sanitize ? { sanitize: true } : {});
		if (options.emitWarnings && mutation.warnings?.length) {
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
			fixHint: options.fixHint
		});
	};
	const finalizeMigrationResult = prepareDoctorConfigMigrationResult(preflight, snapshot);
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
			changes: ["Prepared the canonical agent roster for persistence."]
		}, { fixHint: `Run "${doctorFixCommand}" to persist the explicit agent roster.` });
		if (state.candidate.agents?.ownership === "explicit") explicitSetPaths.push(["agents", "ownership"]);
	}
	const { prepareSessionStoreOwnerRecovery } = await import("./doctor-session-store-owner-CoHtW2Xv.mjs");
	const sessionStoreOwnerRecovery = await prepareSessionStoreOwnerRecovery({
		config: state.candidate,
		snapshot,
		prompter: params.prompter
	});
	applyConfigMutation(sessionStoreOwnerRecovery, {
		fixHint: `Run "${doctorFixCommand}" to review session-store ownership recovery.`,
		sanitize: true,
		emitWarnings: true
	});
	const { collectBlockedLegacyOpenAICodexProviderPlan } = await import("./legacy-config-migrations.runtime.models-Fh87EjLd.mjs");
	const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
	const blockedCodexModelIdentities = new Set(blockedCodexProviderPlan.blockedModelIdentities);
	if (preflight.cronCodexRuntimePolicyTargets?.length) {
		const { repairCronCodexRuntimePolicies } = await import("./runtime-policy-migration-Dcbm0y8R.mjs");
		const cronRuntimeRepair = repairCronCodexRuntimePolicies({
			cfg: state.candidate,
			targets: preflight.cronCodexRuntimePolicyTargets,
			blockedModelIdentities: blockedCodexModelIdentities
		});
		applyConfigMutation(cronRuntimeRepair, {
			fixHint: `Run "${doctorFixCommand}" to preserve migrated cron runtime policy.`,
			emitWarnings: true
		});
		const blockedTargets = new Set(cronRuntimeRepair.blockedTargets.map(cronCodexRuntimePolicyTargetKey));
		shouldRepairCronCodexModelRefsAfterConfigWrite = preflight.cronCodexRuntimePolicyTargets.some((target) => !blockedTargets.has(cronCodexRuntimePolicyTargetKey(target)));
	}
	const pluginLegacyIssues = await (async () => {
		if (snapshot.parsed === snapshot.sourceConfig) return [];
		const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-BJlBoyB2.mjs");
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
	const { MODEL_METADATA_CORRUPTION_AUDIT_LIMIT, repairGeneratedModelMetadataCorruption } = await import("./model-metadata-corruption-repair-DM2q9PGA.mjs");
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
	})), {
		fixHint: `Run "${doctorFixCommand}" to remove audit-proven generated model metadata.`,
		emitWarnings: true
	});
	noteDoctorHookConfigWarnings(state.cfg, snapshot.path);
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => normalizeCompatibilityConfigValues(state.candidate, {
		blockedModelIdentities: blockedCodexModelIdentities,
		sourceRaw: snapshot.parsed
	})), {
		fixHint: `Run "${doctorFixCommand}" to apply these changes.`,
		emitWarnings: true
	});
	const { repairUnownedChannelAccountBindings } = await import("./legacy-config-binding-repair-DLlpByKD.mjs");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => repairUnownedChannelAccountBindings({
		config: state.candidate,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations
	})), {
		fixHint: `Run "${doctorFixCommand}" to preserve channel account ownership.`,
		emitWarnings: true
	});
	const { prepareTailscaleConfigMigration } = await import("./doctor-tailscale-DAngWyfx.mjs");
	applyConfigMutation(await prepareTailscaleConfigMigration({
		cfg: state.candidate,
		env: process.env
	}), {
		fixHint: `Run "${doctorFixCommand}" to apply safe Tailscale configuration migrations.`,
		emitWarnings: true
	});
	const { prepareRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-B7TieL3q.mjs");
	const retiredPhoneControlCleanup = await prepareRetiredPhoneControlCleanup({
		cfg: state.candidate,
		env: process.env
	});
	applyConfigMutation({
		config: retiredPhoneControlCleanup.config,
		changes: retiredPhoneControlCleanup.configChanges,
		warnings: retiredPhoneControlCleanup.warnings
	}, {
		fixHint: `Run "${doctorFixCommand}" to retire Phone Control lease configuration.`,
		emitWarnings: true
	});
	if (retiredPhoneControlCleanup.cleanupPending && !shouldRepair) note(`Retired Phone Control lease state remains. Run "${doctorFixCommand}" to archive it.`, "Legacy state detected");
	const { recoverInstalledPluginConfigIds } = await import("./installed-plugin-id-recovery-22DD48Ak.mjs");
	const installedPluginRecovery = await recoverInstalledPluginConfigIds(state.candidate, process.env);
	applyConfigMutation({
		...installedPluginRecovery,
		warnings: installedPluginRecovery.notices
	}, {
		fixHint: `Run "${doctorFixCommand}" to apply these changes.`,
		emitWarnings: true
	});
	if (referenceSource) referenceSource.installedPluginIdRecovery = installedPluginRecovery.recovery;
	const pluginActivationSourceConfig = state.candidate;
	const { collectCodexPluginActivationWarnings } = await import("./codex-plugin-activation-warning-cn_i_J1A.mjs");
	emitDoctorNotes({
		note,
		warningNotes: collectCodexPluginActivationWarnings(pluginActivationSourceConfig)
	});
	const { applyPluginAutoEnable } = await import("./plugin-auto-enable-4wzHdlRH.mjs");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => applyPluginAutoEnable({
		config: state.candidate,
		env: process.env
	})), { fixHint: `Run "${doctorFixCommand}" to apply these changes.` });
	if (!shouldRepair) {
		const { repairStaleAgentModelRefs } = await import("./stale-agent-model-ref-repair-sHxBnCX0.mjs");
		const staleAgentModelRepair = runWithCurrentPluginMetadata(state.candidate, () => repairStaleAgentModelRefs(state.candidate, { env: process.env }));
		retiredModelRefConfig = staleAgentModelRepair.retiredModelRefConfig;
		applyConfigMutation(staleAgentModelRepair, {
			fixHint: `Run "${doctorFixCommand}" to remove stale agent model references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const [{ collectPluginToolAllowlistWarnings }, { collectGitHubUpgradeWarnings }, { normalizePluginsConfig }] = await Promise.all([
		import("./plugin-tool-allowlist-warnings-C8gNR-Ew.mjs"),
		import("./github-preview-upgrade-DnWfUUgI.mjs"),
		import("./config-state-CNnS6siP.mjs")
	]);
	const pluginWarnings = [...runWithCurrentPluginMetadata(state.candidate, () => collectPluginToolAllowlistWarnings({
		cfg: state.candidate,
		env: process.env
	})), ...collectGitHubUpgradeWarnings(normalizePluginsConfig(state.candidate.plugins))];
	if (pluginWarnings.length > 0) note(sanitizeDoctorNote(pluginWarnings.join("\n")), "Doctor warnings");
	const hasConfiguredChannels = listDoctorConfiguredChannelIds(state.candidate, { configEntryPolicy: "raw" }).length > 0;
	let collectMutableAllowlistWarnings;
	if (hasConfiguredChannels) {
		const channelDoctor = await import("./channel-doctor-DIGtFNGK.mjs");
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
		for (const staleCleanup of staleChannelCleanups) applyConfigMutation(staleCleanup, {
			fixHint: `Run "${doctorFixCommand}" to remove stale channel plugin references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const { repairHooksTokenReuseGatewayAuth } = await import("./hooks-token-reuse-repair-BBMEaACf.mjs");
	applyConfigMutation(await repairHooksTokenReuseGatewayAuth(state.candidate, process.env), { fixHint: `Run "${doctorFixCommand}" to rotate hooks.token away from Gateway auth.` });
	if (shouldRepair) {
		const { runDoctorRepairSequence } = await import("./repair-sequencing-DFQtyL98.mjs");
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
		const { collectDoctorPreviewNotes } = await import("./preview-warnings-SZQemyeH.mjs");
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
		const { resolveEnabledProviderPluginIds } = await import("./providers-BBHK8PNX.mjs");
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
	return {
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
		modelRetirementRepairRan: modelRetirementRepairRan && !legacyStep.blocksWrite && (shouldWriteConfig || snapshot.valid),
		...migrationResult,
		runWithPluginMetadataSnapshot,
		invalidatePluginMetadataSnapshot
	};
}
//#endregion
export { loadAndMaybeMigrateDoctorConfig };
