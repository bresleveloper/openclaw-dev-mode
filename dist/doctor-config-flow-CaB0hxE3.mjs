import { n as containsAuthoredInclude } from "./include-migration-ownership-D1fnTYxB.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries, M as tryResolveSoleAgentId, k as readAgentRosterProperty, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as CONFIG_PATH } from "./paths-DehQwyE0.mjs";
import { r as retainLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as listDoctorConfiguredChannelIds } from "./configured-channel-ids-DxxfdkXT.mjs";
import { t as migratePersistedImplicitMainRoster } from "./legacy.roster-zIYbDm7V.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { f as readRecentConfigAuditRecords } from "./io.audit-CcH6Zt2-.mjs";
import { a as hashConfigRaw } from "./io.read-helpers-N26RjV2V.mjs";
import { t as configIncludeOwnsAgentRoster } from "./agent-roster-provenance-BPJp3Uyw.mjs";
import { o as callGateway } from "./call-C_MP4_Gs.mjs";
import { a as withoutPluginInstallRecords } from "./installed-plugin-index-records-Clh203og.mjs";
import { p as shouldSkipLegacyUpdateDoctorConfigWrite } from "./update-phase-DiVB4MDN.mjs";
import { n as applyUnknownConfigKeyStep, r as prepareDoctorConfigReferenceSource, t as applyLegacyCompatibilityStep } from "./config-flow-steps-JyDeZDer.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { n as sanitizeDoctorNote, t as emitDoctorNotes } from "./emit-notes-BF8NdCNQ.mjs";
import { a as noteMcpOriginWarning, c as noteOpencodeProviderOverrides, i as noteImplicitFallbackClobberWarnings, l as noteSandboxOriginProxyWarning, o as noteMediaCliModelWarnings, r as noteDoctorHookConfigWarnings, s as noteMissingDefaultAgentOwner } from "./doctor-config-analysis-Duwgmi-u.mjs";
import { c as inspectShippedPluginInstallConfigRecords } from "./plugin-registry-migration-DAi_aKIb.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-CnvT_nvI.mjs";
import { a as shouldSkipPluginValidationForDoctorConfigPreflight } from "./doctor-config-preflight-plugin-index-CqfkNkct.mjs";
import { t as runDoctorConfigPreflight } from "./doctor-config-preflight-JrIczDNP.mjs";
import { n as createWorkspaceAliasMigrationRepair } from "./doctor-workspace-alias-B5xGebon.mjs";
import { n as cronCodexRuntimePolicyTargetKey } from "./store-migration-BYXGlu9d.mjs";
import { t as applyDoctorConfigMutation } from "./config-mutation-state-Dw7MiJi5.mjs";
import { t as normalizeCompatibilityConfigValues } from "./legacy-config-core-migrate-CI0FaT1s.mjs";
import { t as canWriteDoctorInclude } from "./roster-include-write-gLu1f7Zv.mjs";
import { isDeepStrictEqual } from "node:util";
import { homedir } from "node:os";
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
			const { collectModelBillingRouteMigrationWarnings } = await import("./model-billing-route-migration-DC20yMbh.mjs");
			modelBillingRouteWarnings = params.runWithCurrentPluginMetadata(params.cfg, () => collectModelBillingRouteMigrationWarnings({
				before: billingRouteSource,
				after: params.cfg,
				metadataSnapshot: params.metadataSnapshot
			}));
		}
		const receipts = preflight.stateMigrationStepReceipts;
		const postSession = preflight.postSessionPluginMigration;
		const planBound = preflight.postSessionPluginMigrationPlanBound;
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
/** Main doctor config flow: preflight, migrations, previews, repairs, and final write decision. */
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
/**
* Loads config, runs doctor migrations/repairs, and returns the config write plan.
*
* This is the config-side orchestration boundary for doctor; it keeps preview notes, repair
* mutations, gateway auth refreshes, and final write confirmation in one ordered flow.
*/
async function loadAndMaybeMigrateDoctorConfig(params) {
	const shouldRepair = params.options.repair === true || params.options.yes === true;
	let preflight = await withProgress({
		label: "Checking OpenClaw state…",
		enabled: params.options.nonInteractive !== true && params.options.json !== true,
		delayMs: 200
	}, (progress) => runDoctorConfigPreflight({
		observe: false,
		invocationPurpose: "doctor",
		repairPrefixedConfig: shouldRepair,
		recoverCorruptTargetStore: shouldRepair,
		doctorOnlyStateMigrations: shouldRepair,
		preparePluginMetadataSnapshot: true,
		...params.agentDatabaseMigrationDiscovery ? { agentDatabaseMigrationDiscovery: params.agentDatabaseMigrationDiscovery } : {},
		beforeWorkspaceStateMigration: createWorkspaceAliasMigrationRepair(params.prompter, progress.done),
		measure: async (name, run) => {
			progress.setLabel(`${name.slice(name.lastIndexOf(".") + 1).replaceAll("-", " ")}…`);
			return await run();
		}
	}));
	const { importShippedPluginInstallConfigForDoctor } = await import("./plugin-registry-migration-C9RzTNA_.mjs");
	const pluginInstallConfigImport = !shouldSkipLegacyUpdateDoctorConfigWrite(process.env) && inspectShippedPluginInstallConfigRecords(preflight.snapshot.sourceConfig).status === "valid" ? await importShippedPluginInstallConfigForDoctor(preflight.snapshot) : void 0;
	if (pluginInstallConfigImport?.pluginInventoryChanged) {
		const { readDoctorConfigPreflightSnapshot } = await import("./doctor-config-preflight-plugin-index-Y69BJPD_.mjs");
		const refreshed = await readDoctorConfigPreflightSnapshot({
			allowCurrentPluginMetadata: false,
			includePluginMetadata: true,
			preparePluginMetadataSnapshot: true,
			skipPluginValidation: shouldSkipPluginValidationForDoctorConfigPreflight()
		});
		preflight = {
			...preflight,
			snapshot: refreshed.snapshot,
			baseConfig: refreshed.snapshot.sourceConfig,
			pluginMetadataSnapshot: refreshed.pluginMetadataSnapshot
		};
	}
	const { snapshot, baseConfig: baseCfg } = preflight;
	const referenceSource = prepareDoctorConfigReferenceSource(snapshot);
	const pluginMetadataSnapshotState = { current: preflight.pluginMetadataSnapshot };
	const { createDoctorPluginMetadataSnapshotScope } = await import("./plugin-metadata-snapshot-scope-Co0NzNM4.mjs");
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
	const rawRosterMigrations = [snapshot.sourceConfigBeforeMigrations, snapshot.parsed].filter((source) => source !== void 0).map((source) => migratePersistedImplicitMainRoster(source));
	const rosterMigrations = rawRosterMigrations.filter((migration) => migration.changed);
	const rosterMigrationNeeded = rosterMigrations.length > 0 || baseCfg.agents?.ownership === void 0 && listAgentEntries(baseCfg).length > 1;
	const legacyDefaultAgentId = rawRosterMigrations.map((migration) => migration.retainedLegacyDefaultAgentId).find((agentId) => agentId !== void 0);
	const legacyStep = runWithCurrentPluginMetadata(state.candidate, () => applyLegacyCompatibilityStep({
		snapshot,
		state,
		shouldRepair,
		doctorFixCommand
	}));
	state = legacyStep.state;
	if (legacyDefaultAgentId) {
		retainLegacyDefaultAgentId(state.cfg, legacyDefaultAgentId);
		retainLegacyDefaultAgentId(state.candidate, legacyDefaultAgentId);
	}
	const includeOwnsRoster = configIncludeOwnsAgentRoster(snapshot);
	const persistCanonicalAgentRoster = snapshot.exists && rosterMigrationNeeded && !includeOwnsRoster;
	if (persistCanonicalAgentRoster) {
		const migrated = migratePersistedImplicitMainRoster(state.candidate, { materializeWorkspace: true }).config;
		const migratedRoster = readAgentRosterProperty(migrated);
		const migratedEntries = migratedRoster?.kind === "entries" ? migratedRoster.value : void 0;
		const { list: _legacyList, ...candidateAgents } = migrated.agents ?? {};
		const stampsExplicitOwnership = Object.keys(migratedEntries ?? {}).length > 1;
		applyConfigMutation({
			config: {
				...migrated,
				agents: {
					...candidateAgents,
					...stampsExplicitOwnership ? { ownership: "explicit" } : {},
					entries: migratedEntries
				}
			},
			changes: [...new Set(rosterMigrations.flatMap((migration) => migration.diagnostics).concat("Prepared the canonical agent roster without retired default markers for persistence.", ...stampsExplicitOwnership ? ["Stamped the multi-agent roster for explicit per-surface ownership."] : []))]
		}, { fixHint: `Run "${doctorFixCommand}" to persist the explicit agent roster.` });
		if (stampsExplicitOwnership) explicitSetPaths.push(["agents", "ownership"]);
	}
	const { prepareSessionStoreOwnerRecovery } = await import("./doctor-session-store-owner-BWCdPkhq.mjs");
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
	const { collectBlockedLegacyOpenAICodexProviderPlan } = await import("./legacy-config-migrations.runtime.models-EK726xvy.mjs");
	const blockedCodexProviderPlan = collectBlockedLegacyOpenAICodexProviderPlan(state.candidate);
	const blockedCodexModelIdentities = new Set(blockedCodexProviderPlan.blockedModelIdentities);
	if (preflight.cronCodexRuntimePolicyTargets?.length) {
		const { repairCronCodexRuntimePolicies } = await import("./runtime-policy-migration-B9-KbA0T.mjs");
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
		const { findDoctorLegacyConfigIssues } = await import("./legacy-config-issues-DtME0IL7.mjs");
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
	const { MODEL_METADATA_CORRUPTION_AUDIT_LIMIT, repairGeneratedModelMetadataCorruption } = await import("./model-metadata-corruption-repair-CxBNMals.mjs");
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
		sourceRaw: snapshot.parsed,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations
	})), {
		fixHint: `Run "${doctorFixCommand}" to apply these changes.`,
		emitWarnings: true
	});
	const { repairUnownedChannelAccountBindings } = await import("./legacy-config-binding-repair-JM1n8XQV.mjs");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => repairUnownedChannelAccountBindings({
		config: state.candidate,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations
	})), {
		fixHint: `Run "${doctorFixCommand}" to preserve channel account ownership.`,
		emitWarnings: true
	});
	const { prepareTailscaleConfigMigration } = await import("./doctor-tailscale-CCqBksNG.mjs");
	applyConfigMutation(await prepareTailscaleConfigMigration({
		cfg: state.candidate,
		env: process.env
	}), {
		fixHint: `Run "${doctorFixCommand}" to apply safe Tailscale configuration migrations.`,
		emitWarnings: true
	});
	const { prepareRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-YBL02QSY.mjs");
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
	const { recoverInstalledPluginConfigIds } = await import("./installed-plugin-id-recovery-BXy8bulF.mjs");
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
	const { collectCodexPluginActivationWarnings } = await import("./codex-plugin-activation-warning-BjJglm3P.mjs");
	emitDoctorNotes({
		note,
		warningNotes: collectCodexPluginActivationWarnings(pluginActivationSourceConfig)
	});
	const { applyPluginAutoEnable } = await import("./plugin-auto-enable-BRkc-I-g.mjs");
	applyConfigMutation(runWithCurrentPluginMetadata(state.candidate, () => applyPluginAutoEnable({
		config: state.candidate,
		env: process.env
	})), { fixHint: `Run "${doctorFixCommand}" to apply these changes.` });
	if (!shouldRepair) {
		const { repairStaleAgentModelRefs } = await import("./stale-agent-model-ref-repair-DDc4p9Xy.mjs");
		const staleAgentModelRepair = runWithCurrentPluginMetadata(state.candidate, () => repairStaleAgentModelRefs(state.candidate, { env: process.env }));
		retiredModelRefConfig = staleAgentModelRepair.retiredModelRefConfig;
		applyConfigMutation(staleAgentModelRepair, {
			fixHint: `Run "${doctorFixCommand}" to remove stale agent model references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const [{ collectPluginToolAllowlistWarnings }, { collectGitHubUpgradeWarnings }, { normalizePluginsConfig }] = await Promise.all([
		import("./plugin-tool-allowlist-warnings-Dv_A9EeY.mjs"),
		import("./github-preview-upgrade-CTzjuSo_.mjs"),
		import("./config-state-BvP0JMJs.mjs")
	]);
	const pluginWarnings = [...runWithCurrentPluginMetadata(state.candidate, () => collectPluginToolAllowlistWarnings({
		cfg: state.candidate,
		env: process.env
	})), ...collectGitHubUpgradeWarnings(normalizePluginsConfig(state.candidate.plugins))];
	if (pluginWarnings.length > 0) note(sanitizeDoctorNote(pluginWarnings.join("\n")), "Doctor warnings");
	const hasConfiguredChannels = listDoctorConfiguredChannelIds(state.candidate, { configEntryPolicy: "raw" }).length > 0;
	let collectMutableAllowlistWarnings;
	if (hasConfiguredChannels) {
		const channelDoctor = await import("./channel-doctor-DB-sAB4c.mjs");
		collectMutableAllowlistWarnings = channelDoctor.collectChannelDoctorMutableAllowlistWarnings;
		const channelDoctorSequence = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.runChannelDoctorConfigSequences({
			cfg: state.candidate,
			env: process.env,
			shouldRepair
		}));
		emitDoctorNotes({
			note,
			changeNotes: channelDoctorSequence.changeNotes,
			warningNotes: channelDoctorSequence.warningNotes
		});
		const staleChannelCleanups = await runWithCurrentPluginMetadata(state.candidate, () => channelDoctor.collectChannelDoctorStaleConfigMutations(state.candidate, { env: process.env }));
		for (const staleCleanup of staleChannelCleanups) applyConfigMutation(staleCleanup, {
			fixHint: `Run "${doctorFixCommand}" to remove stale channel plugin references.`,
			sanitize: true,
			emitWarnings: true
		});
	}
	const { repairHooksTokenReuseGatewayAuth } = await import("./hooks-token-reuse-repair-B5xxP1Gt.mjs");
	applyConfigMutation(await repairHooksTokenReuseGatewayAuth(state.candidate, process.env), { fixHint: `Run "${doctorFixCommand}" to rotate hooks.token away from Gateway auth.` });
	if (shouldRepair) {
		const { runDoctorRepairSequence } = await import("./repair-sequencing-O__PmJ-t.mjs");
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
		const { collectDoctorPreviewNotes } = await import("./preview-warnings-cEjKRY-I.mjs");
		const collectPreviewNotes = async () => await collectDoctorPreviewNotes({
			cfg: state.candidate,
			activationSourceConfig: pluginActivationSourceConfig,
			doctorFixCommand,
			env: process.env,
			allowExec: params.options.allowExec === true,
			blockedCodexProviderPlan
		});
		const previewNotes = await runWithCurrentPluginMetadata(state.candidate, collectPreviewNotes);
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
	if (inspectShippedPluginInstallConfigRecords(state.candidate).status === "valid") applyConfigMutation({
		config: withoutPluginInstallRecords(state.candidate, { preserveEmptyPlugins: containsAuthoredInclude(snapshot.parsed) }),
		changes: ["Removed retired plugins.installs after preserving plugin install records."]
	}, { fixHint: `Run "${doctorFixCommand}" to migrate retired plugin install records.` });
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
		const { resolveEnabledProviderPluginIds } = await import("./providers-Bh2PqLxI.mjs");
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
		...pluginInstallConfigImport ? { pluginInstallConfigImport } : {},
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
