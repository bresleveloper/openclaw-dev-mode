import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { a as measureGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import { i as resolveUpdateRehearsalRoot } from "./update-rehearsal-paths-CRhoE25Z.mjs";
import { a as copyConfigResolutionFactsThroughRewrite } from "./resolution-facts-D_pto3MV.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CmW-lLFq.mjs";
import { b as recordUpdateDoctorDeferredInspectionChecks } from "./update-doctor-result-oZ38327j.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-BBNhGTcQ.mjs";
import { d as isUpdateDoctorInspectionReportMode, h as shouldDeferConfiguredPluginInstallRepair, l as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-M5rvMZiC.mjs";
import { t as emitDoctorNotes } from "./emit-notes-4SxaFD1H.mjs";
import { c as throwIfDoctorStateMigrationRefused, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-CB0bXmSE.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { i as resolveDoctorWorkspaceDir, n as noteDoctorRepairResult, r as resolveDoctorMode, t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-kJXoi_AZ.mjs";
import { n as legacyOwnedRepair, r as recordDoctorHealthWarnings, t as createDoctorHealthContribution } from "./doctor-health-contribution-CswduPyS.mjs";
import { i as runFinalConfigValidationHealth } from "./doctor-config-validation-findings-BKpzgT9b.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-BmU6tTrJ.mjs";
import { t as hasActiveGatewayExecCredential } from "./doctor-gateway-exec-credential-CfEE-9u7.mjs";
import { n as resolveDoctorUpdateBudget, t as admitDoctorUpdateInspection } from "./doctor-update-budget-Bf-myTlJ.mjs";
import { n as noteBackupDoctorHint } from "./backup-health-Bu0eVbKi.mjs";
import { t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-ClHPRGuJ.mjs";
import { n as normalizeHealthCheck } from "./health-check-adapter-Qbgk_amB.mjs";
import { n as runCoreHealthFindingNote, r as runStructuredHealthRepairs, t as runCoreContributionHealth } from "./doctor-health-contribution-core-DJELOaCb.mjs";
import { i as runWriteConfigHealth, n as runInitialConfigWriteHealth, t as collectWriteConfigHealthFindings } from "./doctor-health-contribution-runners.config-BQl1hQqU.mjs";
import { a as runDevicePairingHealth, c as runGitHubProjectHealth, d as runSecurityHealth, f as runStartupChannelMaintenanceHealth, i as runCommandOwnerHealth, l as runHostDesktopHealth, m as runWhatsappResponsivenessHealth, n as runBundleLspEnvHealth, o as runGatewayDaemonHealth, p as runWebFetchProxyHealth, r as runClaudeCliHealth, s as runGatewayServicesHealth, t as runBrowserHealth, u as runOpenAIOAuthTlsHealth } from "./doctor-health-contribution-runners.gateway-CapKcycC.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/flows/doctor-auth-health.ts
async function runAuthProfileMigration(ctx) {
	ctx.authProfileHealthReady = false;
	const sharedAuth = ctx.configResult.stateMigrationStepReceipts?.find((receipt) => receipt.id === "shared-auth-store");
	if (sharedAuth?.outcome === "skipped" && sharedAuth.warnings.length > 0) return;
	const { repairAuthProfileMigration } = await import("./auth-profile-repair-Cn6jR8DZ.mjs");
	const { maybeRepairLegacyOAuthProfileIds } = await import("./doctor-auth-legacy-oauth-G23VdAyA.mjs");
	const { maybeMigrateLegacyPluginModelCatalogs } = await import("./doctor-plugin-model-catalog-C4KeWT5f.mjs");
	const { buildGatewayConnectionDetails } = await import("./call-BvbeEASg.mjs");
	const { note } = await import("./terminal-core/note.js");
	if (ctx.configResult.openAICodexAuthProfileIdMap === void 0) {
		const authRepair = await repairAuthProfileMigration({
			cfg: ctx.cfg,
			env: ctx.env,
			prompter: ctx.prompter
		});
		emitDoctorNotes({
			note,
			changeNotes: authRepair.storeChanges,
			warningNotes: authRepair.warnings
		});
		ctx.cfg = authRepair.config;
		ctx.configResult.openAICodexAuthProfileIdMap = authRepair.profileIdMap;
		if (authRepair.changes.length > 0) ctx.configResult.pendingChangePanels = [...ctx.configResult.pendingChangePanels ?? [], authRepair.changes.join("\n")];
	}
	const migrationContext = () => ({
		cfg: ctx.cfg,
		...ctx.env ? { env: ctx.env } : {},
		prompter: ctx.prompter,
		runtime: ctx.runtime
	});
	await maybeMigrateLegacyPluginModelCatalogs(migrationContext());
	const modelsBeforeRepair = ctx.cfg.agents?.defaults?.models;
	const legacyOAuthRepair = await maybeRepairLegacyOAuthProfileIds(ctx.cfg, ctx.prompter);
	ctx.cfg = legacyOAuthRepair.config;
	if (legacyOAuthRepair.retiredProfileCleanupPlans.length > 0) ctx.configResult.retiredAuthProfileCleanupPlans = [...ctx.configResult.retiredAuthProfileCleanupPlans ?? [], ...legacyOAuthRepair.retiredProfileCleanupPlans];
	if (!isDeepStrictEqual(modelsBeforeRepair, ctx.cfg.agents?.defaults?.models)) ctx.configResult.explicitSetPaths = [...ctx.configResult.explicitSetPaths ?? [], [
		"agents",
		"defaults",
		"models"
	]];
	const { maybeMigrateModelCatalogCredentials } = await import("./doctor-model-catalog-credentials-Do2Fyhz5.mjs");
	await maybeMigrateModelCatalogCredentials(migrationContext());
	let authProfileHealthReady = true;
	if (ctx.configResult.retiredAuthProfileCleanupPlans?.length || ctx.configResult.openAICodexAuthProfileIdMap?.size) {
		const { runRetiredAuthProfileCleanup, runWriteConfigHealth } = await import("./doctor-health-contribution-runners.config-Bo_blWra.mjs");
		authProfileHealthReady = await runWriteConfigHealth(ctx, { runPostWriteRepairs: false }) && !ctx.configWriteRefusal && isDeepStrictEqual(ctx.cfg, ctx.cfgForPersistence);
		if (authProfileHealthReady) await runRetiredAuthProfileCleanup(ctx);
	}
	ctx.authProfileHealthReady = authProfileHealthReady;
	ctx.gatewayDetails = buildGatewayConnectionDetails({ config: ctx.cfg });
	if (ctx.gatewayDetails.remoteFallbackNote) note(ctx.gatewayDetails.remoteFallbackNote, "Gateway");
}
async function runAuthProfileDiagnostics(ctx) {
	const { noteAuthProfileHealth, noteCopilotAmbientToken, noteLegacyCodexProviderOverride, noteSharedAuthStoreStatus } = await import("./doctor-auth-C1teGH_y.mjs");
	if (ctx.authProfileHealthReady !== false) await noteAuthProfileHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		allowKeychainPrompt: ctx.options.nonInteractive !== true && process.stdin.isTTY
	});
	noteLegacyCodexProviderOverride(ctx.cfg);
	noteSharedAuthStoreStatus(ctx.env);
	noteCopilotAmbientToken(ctx.cfg, ctx.env);
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.workspace.ts
async function runHooksModelHealth(ctx) {
	const { collectHooksModelIssues } = await import("./doctor-hooks-model-Bm3laBHg.mjs");
	const issues = await collectHooksModelIssues(ctx.cfg);
	if (issues.length === 0) return;
	const { note } = await import("./terminal-core/note.js");
	note(issues.map(({ kind, model }) => kind === "unresolved" ? `- hooks.gmail.model "${model}" could not be resolved` : kind === "not-allowed" ? `- hooks.gmail.model "${model}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)` : `- hooks.gmail.model "${model}" not in the model catalog (may fail at runtime)`).join("\n"), "Hooks");
}
async function collectWorkspaceStatusPluginVersionReadiness(params) {
	if (params.cfg.gateway?.mode === "remote" || !await shouldManageGatewayService()) return;
	try {
		const { gatherDaemonStatus } = await import("./status.gather-DTGkFxw8.mjs");
		const status = await gatherDaemonStatus({
			rpc: {
				timeout: params.options?.nonInteractive === true ? "3000" : "10000",
				json: true
			},
			probe: true,
			requireRpc: false,
			deep: params.options?.deep === true,
			allowExecSecretRefs: params.options?.allowExec === true,
			pluginVersionTarget: "restart"
		});
		if (status.pluginVersionRestartReadiness?.status === "resolved") {
			const { resolvePluginVersionDriftTargets } = await import("./plugin-version-drift-BPguy39Y.mjs");
			return {
				...status.pluginVersionRestartReadiness,
				report: await resolvePluginVersionDriftTargets(status.pluginVersionRestartReadiness.report)
			};
		}
		return status.pluginVersionRestartReadiness;
	} catch {
		return;
	}
}
async function runWorkspaceStatusHealth(ctx) {
	const pluginVersionReadiness = await collectWorkspaceStatusPluginVersionReadiness({
		cfg: ctx.cfg,
		options: ctx.options
	});
	const { noteWorkspaceStatus } = await import("./doctor-workspace-status-b2y7YkO5.mjs");
	noteWorkspaceStatus(ctx.cfg, {
		pluginVersionReadiness,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runWorkspaceAliasHealth(ctx) {
	const { collectRepointedWorkspaceAliasFindings } = await import("./doctor-workspace-alias-DwzFfjWY.mjs");
	const findings = await collectRepointedWorkspaceAliasFindings(ctx.cfg);
	if (findings.length > 0) {
		const { note } = await import("./terminal-core/note.js");
		note(findings.map((finding) => `${finding.message} ${finding.fixHint}`).join("\n"), "Workspace");
	}
}
async function runSkillsHealth(ctx) {
	const { maybeRepairSkillReadiness } = await import("./doctor-skills-C8ZRwrdI.mjs");
	ctx.cfg = await maybeRepairSkillReadiness({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runBootstrapSizeHealth(ctx) {
	const { noteBootstrapFileSize } = await import("./doctor-bootstrap-size-BsY9YJWa.mjs");
	await noteBootstrapFileSize(ctx.cfg);
}
function workspaceMigration(load) {
	return async (ctx) => {
		await (await load())({
			cfg: ctx.cfg,
			shouldRepair: ctx.prompter.shouldRepair,
			env: ctx.env
		});
	};
}
const runHeartbeatCadenceMigrationHealth = workspaceMigration(async () => {
	const { maybeMigrateHeartbeatCadenceToCron } = await import("./doctor-heartbeat-cadence-migration-CKcXjcFY.mjs");
	return maybeMigrateHeartbeatCadenceToCron;
});
const runHeartbeatScratchMigrationHealth = workspaceMigration(async () => {
	const { maybeMigrateHeartbeatFilesToScratch } = await import("./doctor-heartbeat-scratch-migration-C2hypNHy.mjs");
	return maybeMigrateHeartbeatFilesToScratch;
});
const runToolsMdMigrationHealth = workspaceMigration(async () => {
	const { maybeMigrateToolsMd } = await import("./doctor-tools-md-migration-C_XOvfeV.mjs");
	return maybeMigrateToolsMd;
});
const runHeartbeatTaskMigrationHealth = workspaceMigration(async () => {
	const { maybeMigrateHeartbeatTasksToCron } = await import("./doctor-heartbeat-task-migration--6dmGlKZ.mjs");
	return maybeMigrateHeartbeatTasksToCron;
});
async function runMemorySearchHealthContribution(ctx) {
	const { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth } = await import("./doctor-memory-recall-HWtA9La5.mjs");
	const { noteMemorySearchHealth } = await import("./doctor-memory-search-BNL4u6TM.mjs");
	if (ctx.prompter.shouldRepair) await maybeRepairMemoryRecallHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await noteMemorySearchHealth(ctx.cfg, {
		env: ctx.env,
		gatewayMemoryProbe: ctx.gatewayMemoryProbe ?? {
			checked: false,
			ready: false,
			skipped: false
		}
	});
	if (ctx.options.deep === true) await noteMemoryRecallHealth(ctx.cfg);
}
async function runWorkspaceSuggestionsHealth(ctx) {
	if (ctx.options.workspaceSuggestions === false) return;
	const { collectWorkspaceSuggestionNotes } = await import("./doctor-workspace-suggestions-Bd7Pj7Cw.mjs");
	const { note } = await import("./terminal-core/note.js");
	for (const { agentId, workspaceDir, labelAgent } of resolveDoctorWorkspaceSuggestionScopes(ctx.cfg)) {
		const prefix = labelAgent ? `Agent "${agentId}": ` : "";
		for await (const suggestion of collectWorkspaceSuggestionNotes(workspaceDir)) note(`${prefix}${suggestion}`, "Workspace");
	}
}
//#endregion
//#region src/flows/doctor-health-contributions-final.ts
const CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID = "core/doctor/channel-package-state-capabilities";
function resolveFinalDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution("doctor:gateway-services", "Gateway services", {
			healthCheckIds: ["core/doctor/gateway-services/extra", "core/doctor/gateway-services/platform-notes"],
			run: runGatewayServicesHealth
		}),
		createDoctorHealthContribution("doctor:host-desktop", "Host desktop", {
			healthChecks: {
				description: "Gateway-host desktop enablement, reachability, and RFB security state.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectHostDesktopHealthFindings } = await import("./doctor-host-desktop-DCnkSPH-.mjs");
					return collectHostDesktopHealthFindings(ctx.cfg);
				}
			},
			run: runHostDesktopHealth
		}),
		createDoctorHealthContribution("doctor:default-account-routing", "Default account routing", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthChecks: {
				description: "Multi-account channels have explicit default routing or complete bindings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectMissingDefaultAccountBindingWarnings, collectMissingExplicitDefaultAccountWarnings } = await import("./default-account-warnings-CiBjz1xG.mjs");
					return [...collectMissingDefaultAccountBindingWarnings(ctx.cfg), ...collectMissingExplicitDefaultAccountWarnings(ctx.cfg)].map((message) => ({
						checkId: "core/doctor/default-account-routing",
						severity: "warning",
						message: message.replace(/^- /, "").trim()
					}));
				}
			}
		}),
		createDoctorHealthContribution("doctor:channel-package-state-capabilities", "Channel package-state capabilities", { healthChecks: {
			id: CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID,
			description: "Declared channel package-state checker modules must load.",
			defaultEnabled: true,
			async detect(ctx) {
				if (shouldDeferConfiguredPluginInstallRepair(ctx.env ?? process.env)) return [];
				const { collectBundledChannelPackageStateLoadFailures } = await import("./package-state-probes-MGGSGiWm.mjs");
				return collectBundledChannelPackageStateLoadFailures().map((failure) => ({
					checkId: CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID,
					severity: "warning",
					message: `Plugin ${failure.pluginId} declared ${failure.metadataKey}, but its checker failed to load: ${failure.detail}`,
					target: failure.pluginId,
					requirement: "declared-channel-package-state-capability-loadable",
					fixHint: `Rebuild or reinstall plugin ${failure.pluginId}, then rerun \`openclaw doctor\`.`
				}));
			}
		} }),
		createDoctorHealthContribution("doctor:startup-channel-maintenance", "Startup channel maintenance", {
			healthChecks: [{
				id: "core/doctor/channel-plugin-blockers",
				description: "Configured channels must have loadable backing channel plugins.",
				defaultEnabled: false,
				async detect(ctx) {
					const { channelPluginBlockerHitToHealthFinding, scanConfiguredChannelPluginBlockers } = await import("./channel-plugin-blockers-DiuofGtH.mjs");
					return scanConfiguredChannelPluginBlockers(ctx.cfg, process.env).map(channelPluginBlockerHitToHealthFinding);
				}
			}, {
				id: "core/doctor/channel-preview-warnings",
				description: "Channel doctor preview warnings are captured as structured findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectChannelPreviewWarningHealthFindings } = await import("./doctor-startup-channel-maintenance-Br4urgyM.mjs");
					return collectChannelPreviewWarningHealthFindings({
						cfg: ctx.cfg,
						allowExec: ctx.allowExecSecretRefs === true
					});
				}
			}],
			run: runStartupChannelMaintenanceHealth
		}),
		createDoctorHealthContribution("doctor:security", "Security", {
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/security"],
			run: runSecurityHealth
		}),
		createDoctorHealthContribution("doctor:web-fetch-proxy", "Web fetch proxy", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			run: runWebFetchProxyHealth
		}),
		createDoctorHealthContribution("doctor:bundle-lsp-env", "Bundle LSP environment", {
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			run: runBundleLspEnvHealth
		}),
		createDoctorHealthContribution("doctor:github-projects", "GitHub projects", {
			updateWork: { kind: "standalone" },
			run: runGitHubProjectHealth
		}),
		createDoctorHealthContribution("doctor:browser", "Browser", {
			healthCheckIds: ["core/doctor/browser"],
			run: runBrowserHealth
		}),
		createDoctorHealthContribution("doctor:oauth-tls", "OAuth TLS", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/oauth-tls"],
			run: runOpenAIOAuthTlsHealth
		}),
		createDoctorHealthContribution("doctor:hooks-model", "Hooks model", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/hooks-model"],
			run: runHooksModelHealth
		}),
		createDoctorHealthContribution("doctor:legacy-output-cap", "Saved model output caps", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/legacy-output-cap"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/legacy-output-cap")
		}),
		...[
			[
				"model-references",
				"Model references",
				"agent"
			],
			[
				"acp-agent-model",
				"ACP agent model",
				"agent"
			],
			[
				"provider-catalog-projection",
				"Provider catalog projection",
				"run"
			],
			[
				"local-audio-acceleration",
				"Local audio acceleration",
				"run"
			],
			[
				"runtime-tool-schemas",
				"Runtime tool schemas",
				"agent"
			],
			[
				"skill-workshop-tool-policy",
				"Skill Workshop tool policy",
				"agent"
			]
		].map(([name, label, scope]) => createDoctorHealthContribution(`doctor:${name}`, label, {
			updateWork: {
				kind: "inspection",
				scope
			},
			healthCheckIds: [`core/doctor/${name}`],
			run: (ctx) => runCoreHealthFindingNote(ctx, `core/doctor/${name}`)
		})),
		createDoctorHealthContribution("doctor:systemd-linger", "systemd linger", {
			healthChecks: {
				description: "Disabled systemd user lingering is reported as a finding.",
				defaultEnabled: false,
				detect: params.detectSystemdLingerFindings
			},
			run: params.runSystemdLingerHealth
		}),
		createDoctorHealthContribution("doctor:workspace-status", "Workspace status", {
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Workspace plugin/status diagnostics are exposed as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWorkspaceStatusHealthFindings } = await import("./doctor-workspace-status-b2y7YkO5.mjs");
					const pluginVersionReadiness = await collectWorkspaceStatusPluginVersionReadiness({
						cfg: ctx.cfg,
						options: {
							nonInteractive: true,
							allowExec: ctx.allowExecSecretRefs === true
						}
					});
					const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
					return collectWorkspaceStatusHealthFindings(ctx.cfg, {
						pluginVersionReadiness,
						...runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot } : {}
					});
				}
			},
			run: runWorkspaceStatusHealth
		}),
		...isExperimentalClawsEnabled() ? [createDoctorHealthContribution("doctor:claws-state", "Claws state", {
			healthCheckIds: ["core/doctor/claws-state"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/claws-state")
		})] : [],
		createDoctorHealthContribution("doctor:workspace-alias", "Workspace alias", {
			healthChecks: {
				description: "Persisted workspace aliases must resolve to the resolved target that owns their stored state.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectRepointedWorkspaceAliasFindings } = await import("./doctor-workspace-alias-DwzFfjWY.mjs");
					return collectRepointedWorkspaceAliasFindings(ctx.cfg);
				}
			},
			run: runWorkspaceAliasHealth
		}),
		createDoctorHealthContribution("doctor:skills", "Skills", {
			updateWork: {
				kind: "inspection",
				scope: "agent",
				repairs: true
			},
			healthCheckIds: ["core/doctor/skills-readiness"],
			run: runSkillsHealth
		}),
		createDoctorHealthContribution("doctor:bootstrap-size", "Bootstrap size", {
			updateWork: { kind: "standalone" },
			healthCheckIds: ["core/doctor/bootstrap-size"],
			run: runBootstrapSizeHealth
		}),
		createDoctorHealthContribution("doctor:heartbeat-cadence-migration", "Heartbeat cadence migration", {
			healthChecks: {
				description: "Heartbeat cadence config must be materialized in cron monitor rows.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatCadenceMigrationFindings } = await import("./doctor-heartbeat-cadence-migration-CKcXjcFY.mjs");
					return collectHeartbeatCadenceMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatCadenceMigrationHealth
		}),
		createDoctorHealthContribution("doctor:heartbeat-scratch-migration", "Heartbeat scratch migration", {
			healthChecks: {
				description: "Workspace HEARTBEAT.md files must migrate into cron-owned scratch.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatScratchMigrationFindings } = await import("./doctor-heartbeat-scratch-migration-C2hypNHy.mjs");
					return collectHeartbeatScratchMigrationFindings(ctx.cfg);
				}
			},
			run: runHeartbeatScratchMigrationHealth
		}),
		createDoctorHealthContribution("doctor:tools-md-migration", "TOOLS.md migration", {
			healthChecks: {
				description: "Workspace TOOLS.md notes must migrate into the AGENTS.md Tools section.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectToolsMdMigrationFindings } = await import("./doctor-tools-md-migration-C_XOvfeV.mjs");
					return collectToolsMdMigrationFindings(ctx.cfg);
				}
			},
			run: runToolsMdMigrationHealth
		}),
		createDoctorHealthContribution("doctor:heartbeat-task-cron-migration", "Heartbeat task cron migration", {
			healthChecks: {
				description: "Heartbeat scratch task blocks must migrate into automations.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatTaskMigrationFindings } = await import("./doctor-heartbeat-task-migration--6dmGlKZ.mjs");
					return collectHeartbeatTaskMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatTaskMigrationHealth
		}),
		createDoctorHealthContribution("doctor:shell-completion", "Shell completion", {
			healthCheckIds: ["core/doctor/shell-completion"],
			run: params.runShellCompletionHealth
		}),
		createDoctorHealthContribution("doctor:gateway-health", "Gateway health", {
			healthCheckIds: ["core/doctor/gateway-health"],
			run: params.runGatewayHealthChecks
		}),
		createDoctorHealthContribution("doctor:whatsapp-responsiveness", "WhatsApp responsiveness", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthChecks: {
				description: "Gateway pressure and local TUI observations when WhatsApp is enabled.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWhatsappResponsivenessHealthFindings } = await import("./doctor-whatsapp-responsiveness-D_Fybjsm.mjs");
					const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CeT6JtgV.mjs");
					const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
					let status;
					if (!(await hasActiveGatewayExecCredential({ cfg: ctx.cfg }) && ctx.allowExecSecretRefs !== true)) status = await requestGateway({
						method: "status",
						params: { includeChannelSummary: false },
						timeoutMs: 3e3,
						config: ctx.cfg,
						deviceIdentity: null
					}).catch(() => void 0);
					return collectWhatsappResponsivenessHealthFindings({
						cfg: ctx.cfg,
						status
					});
				}
			},
			run: runWhatsappResponsivenessHealth
		}),
		createDoctorHealthContribution("doctor:memory-search", "Memory search", {
			updateWork: {
				kind: "inspection",
				scope: "agent",
				repairs: true
			},
			healthChecks: {
				description: "Memory search provider and backend readiness are captured as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectMemorySearchHealthFindings } = await import("./doctor-memory-search-BNL4u6TM.mjs");
					return collectMemorySearchHealthFindings(ctx);
				}
			},
			run: runMemorySearchHealthContribution
		}),
		createDoctorHealthContribution("doctor:device-pairing", "Device pairing", {
			healthChecks: {
				description: "Device pairing requests and stale device-auth records are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectDevicePairingHealthFindings } = await import("./doctor-device-pairing-CK9XIF15.mjs");
					return collectDevicePairingHealthFindings({
						cfg: ctx.cfg,
						healthOk: false,
						env: ctx.env
					});
				}
			},
			run: runDevicePairingHealth
		}),
		createDoctorHealthContribution("doctor:gateway-daemon", "Gateway daemon", {
			healthCheckIds: ["core/doctor/gateway-daemon"],
			run: runGatewayDaemonHealth
		}),
		createDoctorHealthContribution("doctor:write-config", "Write config", {
			updateWork: { kind: "finalize" },
			healthChecks: {
				description: "Config write blockers are findings before doctor repair writes.",
				defaultEnabled: false,
				detect: collectWriteConfigHealthFindings
			},
			async run(ctx) {
				await runWriteConfigHealth(ctx);
			}
		}),
		createDoctorHealthContribution("doctor:workspace-suggestions", "Workspace suggestions", {
			updateWork: { kind: "standalone" },
			healthCheckIds: ["core/doctor/workspace-suggestions"],
			run: runWorkspaceSuggestionsHealth
		}),
		createDoctorHealthContribution("doctor:final-config-validation", "Final config validation", {
			updateWork: { kind: "finalize" },
			healthCheckIds: ["core/doctor/final-config-validation"],
			run: runFinalConfigValidationHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.state.ts
async function runLegacyPluginManifestHealth(ctx) {
	const { maybeRepairLegacyPluginManifestContracts } = await import("./doctor-plugin-manifests-Bq6YhTo6.mjs");
	if (await maybeRepairLegacyPluginManifestContracts({
		config: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		prompter: ctx.prompter
	})) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runPluginRegistryHealth(ctx) {
	const { maybeRepairPluginRegistryState } = await import("./doctor-plugin-registry-DMKhajXa.mjs");
	const result = await maybeRepairPluginRegistryState({
		config: ctx.cfg,
		env: process.env,
		prompter: ctx.prompter
	});
	ctx.cfg = result.config;
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runLegacyPluginSourceCapturesHealth(ctx) {
	const { noteLegacyPluginSourceCaptures } = await import("./doctor-plugin-source-captures-BHw2HhxH.mjs");
	await noteLegacyPluginSourceCaptures(ctx.env ?? process.env, ctx.prompter.shouldRepair);
}
async function runRetainedUpdateRuntimesHealth(ctx) {
	if (ctx.gatewayMaintenanceActive && ctx.prompter.shouldRepair) return;
	const { prepareRetainedUpdateRuntimeCleanup } = await import("./doctor-retained-runtime-BFw-TQMQ.mjs");
	await (await prepareRetainedUpdateRuntimeCleanup(ctx.env ?? process.env))(ctx.prompter.shouldRepair);
}
async function runReleaseConfiguredPluginInstallsHealth(ctx) {
	if (!ctx.sourceConfigValid || !ctx.prompter.shouldRepair) return;
	const { maybeRunConfiguredPluginInstallReleaseStep } = await import("./release-configured-plugin-installs-D_zRDAm_.mjs");
	const { note } = await import("./terminal-core/note.js");
	const { VERSION } = await import("./version-Dhb_IK_3.mjs");
	const result = await maybeRunConfiguredPluginInstallReleaseStep({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		touchedVersion: ctx.configResult.sourceLastTouchedVersion ?? ctx.cfg.meta?.lastTouchedVersion
	});
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
	if (result.postInstallDoctorResult) ctx.postInstallDoctorResult = result.postInstallDoctorResult;
	noteDoctorRepairResult(result, note);
	if (!result.touchedConfig) return;
	const lastTouchedVersion = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env) ? ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion || VERSION : VERSION;
	const config = {
		...ctx.cfg,
		meta: {
			...ctx.cfg.meta,
			lastTouchedVersion
		}
	};
	copyConfigResolutionFactsThroughRewrite(ctx.cfg, config);
	ctx.cfg = config;
	writeConfigMachineState("config.lastTouchedAt", (/* @__PURE__ */ new Date()).toISOString());
}
async function runDiskSpaceHealth() {
	const { noteDiskSpace } = await import("./doctor-disk-space-D4f0ZlS9.mjs");
	noteDiskSpace();
}
async function runDatabaseBloatHealth() {
	const { noteSqliteDatabaseBloat } = await import("./doctor-db-bloat-BE8L8OiH.mjs");
	await noteSqliteDatabaseBloat();
}
async function runAgentMemorySchemaHealth(ctx) {
	const { noteDoctorAgentMemorySchemaHealth } = await import("./doctor-agent-memory-schema-CwLyk57F.mjs");
	await noteDoctorAgentMemorySchemaHealth({
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runChannelIngressDeadLettersHealth() {
	const { noteChannelIngressDeadLetters } = await import("./doctor-channel-ingress-BflVX8x2.mjs");
	await noteChannelIngressDeadLetters();
}
async function runStateIntegrityHealth(ctx) {
	const { noteDoctorAgentDatabasePathHealth } = await import("./doctor-agent-database-paths-BeXb_D9U.mjs");
	const warnings = noteDoctorAgentDatabasePathHealth({
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
	if (warnings.length > 0) {
		ctx.updateWarnings ??= [];
		ctx.updateWarnings.push(...warnings);
	}
	const { noteStateIntegrity } = await import("./doctor-state-integrity-BVNglioH.mjs");
	await noteStateIntegrity(ctx.cfg, ctx.prompter, ctx.configPath, { stateDirExistedAtStart: ctx.stateDirExistedAtStart });
	await noteBackupDoctorHint(ctx.env ?? process.env, ctx.cfg);
	const { noteBackupScratchHealth } = await import("./doctor-backup-scratch-DJJPPi9b.mjs");
	await noteBackupScratchHealth(ctx.env ?? process.env, ctx.prompter.shouldRepair);
}
async function runCodexSessionRouteHealth(ctx) {
	const { maybeRepairCodexSessionRoutes } = await import("./codex-route-warnings-Hv8e33on.mjs");
	const { note } = await import("./terminal-core/note.js");
	const result = await maybeRepairCodexSessionRoutes({
		cfg: ctx.cfg,
		...ctx.configResult.retiredModelRefConfig ? { retiredModelRefConfig: ctx.configResult.retiredModelRefConfig } : {},
		env: ctx.env ?? process.env,
		...!ctx.prompter.shouldRepair && ctx.configResult.providerRenames?.length ? { providerRenames: ctx.configResult.providerRenames } : {},
		shouldRepair: ctx.prompter.shouldRepair,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {},
		...ctx.configResult.openAICodexAuthProfileIdMap?.size ? {
			authProfileIdMap: ctx.configResult.openAICodexAuthProfileIdMap,
			...!ctx.prompter.shouldRepair ? { authProfileOnly: true } : {}
		} : {}
	});
	noteDoctorRepairResult(result, note);
}
async function runSessionTranscriptsHealth(ctx) {
	const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-DblmYbDQ.mjs");
	await noteSessionTranscriptHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair,
		onWarnings: (warnings) => recordDoctorHealthWarnings(ctx, [], warnings),
		...ctx.configResult.postSessionPluginMigration ? { postSessionPluginMigration: ctx.configResult.postSessionPluginMigration } : {},
		...ctx.configResult.postSessionPluginMigrationPlanBound ? { postSessionPluginMigrationPlanBound: true } : {},
		onStepReceipt: (receipt) => {
			ctx.configResult.stateMigrationStepReceipts ??= [];
			ctx.configResult.stateMigrationStepReceipts.push(receipt);
		}
	});
}
async function runSessionTranscriptHeadersHealth(ctx) {
	const { noteSessionTranscriptHeaderHealth } = await import("./doctor-session-transcript-headers-CoGNeJk8.mjs");
	await noteSessionTranscriptHeaderHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionTranscriptLabelsHealth(ctx) {
	const { noteSessionTranscriptLabelHealth } = await import("./doctor-session-transcript-labels-7juYbUZf.mjs");
	await noteSessionTranscriptLabelHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionSnapshotsHealth(ctx) {
	const { noteSessionSnapshotHealth } = await import("./doctor-session-snapshots-Bc72EQrK.mjs");
	await noteSessionSnapshotHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env
	});
}
async function runConfigAuditScrubHealth(ctx) {
	const { maybeRepairLegacyRuntimeFiles } = await import("./doctor-usage-cost-cache-mn0RLgrK.mjs");
	const warnings = await maybeRepairLegacyRuntimeFiles(ctx.prompter.shouldRepair, ctx.env);
	recordDoctorHealthWarnings(ctx, [], warnings);
}
async function runLegacyCronHealth(ctx) {
	const { maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck } = await import("./cron-c5clpoJM.mjs");
	await noteLegacyWhatsAppCrontabHealthCheck();
	await maybeRepairLegacyCronStore({
		cfg: ctx.cfg,
		options: ctx.options,
		prompter: ctx.prompter
	});
	const { maybeRepairCronInferenceBindings } = await import("./inference-binding-migration-CqzzF6E4.mjs");
	const inference = await maybeRepairCronInferenceBindings({
		cfg: ctx.cfg,
		env: ctx.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
	const { note } = await import("./terminal-core/note.js");
	noteDoctorRepairResult(inference, note);
	recordDoctorHealthWarnings(ctx, [], inference.warnings);
}
async function runSandboxHealth(ctx) {
	const { maybeRepairSandboxImages, maybeRepairSandboxRegistryFiles, noteSandboxScopeWarnings } = await import("./doctor-sandbox-DIW4uK3d.mjs");
	await maybeRepairSandboxRegistryFiles(ctx.prompter);
	await maybeRepairSandboxImages(ctx.cfg, ctx.runtime, ctx.prompter);
	noteSandboxScopeWarnings(ctx.cfg);
}
async function runCodexBwrapHealth(ctx) {
	const { noteCodexBwrapNamespaceWarnings } = await import("./doctor-sandbox-DIW4uK3d.mjs");
	await noteCodexBwrapNamespaceWarnings(ctx.cfg, {
		env: ctx.env,
		cwd: resolveDoctorWorkspaceDir(ctx.cfg, ctx.env)
	});
}
//#endregion
//#region src/flows/doctor-native-status-check.ts
const CHECK_ID = "core/doctor/native-status";
const nativeStatusCheck = {
	id: CHECK_ID,
	kind: "core",
	source: "doctor",
	description: "Native filesystem and process helpers are available for this runtime.",
	async detect() {
		const [{ getFsSafeNativeStatus }, { getProcSafeNativeStatus }] = await Promise.all([import("@openclaw/fs-safe"), import("@openclaw/proc-safe")]);
		return (await Promise.all([getFsSafeNativeStatus({ probe: true }), getProcSafeNativeStatus({ probe: true })])).map((status, index) => {
			const library = index === 0 ? "fs-safe" : "proc-safe";
			return {
				checkId: CHECK_ID,
				severity: status.loaded || status.mode === "off" ? "info" : "warning",
				message: `${library}: ${status.reason}`,
				fixHint: status.guidance
			};
		});
	}
};
const appContainerSpawnCheck = {
	id: "core/doctor/appcontainer-spawn",
	kind: "core",
	source: "doctor",
	description: "The Windows runtime can create child pipes inside an AppContainer.",
	async detect() {
		const { assertAppContainerSpawnSupported, AppContainerSpawnUnsupportedError } = await import("./windows-appcontainer-spawn-C-FZOvZv.mjs");
		try {
			assertAppContainerSpawnSupported();
			return [];
		} catch (error) {
			if (!(error instanceof AppContainerSpawnUnsupportedError)) throw error;
			return [{
				checkId: "core/doctor/appcontainer-spawn",
				severity: "error",
				errorCode: error.code,
				message: error.message
			}];
		}
	}
};
//#endregion
//#region src/flows/doctor-health-contributions-initial.ts
function coreHealthRunner(checkId) {
	return async (ctx) => {
		const { runCoreContributionHealth } = await import("./doctor-health-contribution-core-DD__vwVu.mjs");
		await runCoreContributionHealth(ctx, [checkId]);
	};
}
const runStaleRuntimeBuildHealth = coreHealthRunner("core/doctor/stale-runtime-build");
const runTelegramGeneralTopicConversationHealth = coreHealthRunner("core/doctor/telegram-general-topic-conversations");
function resolveInitialDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution("doctor:write-config-migrations", "Write config migrations", {
			required: true,
			run: runInitialConfigWriteHealth
		}),
		createDoctorHealthContribution("doctor:agent-database-admission", "Agent database admission", { healthChecks: {
			description: "Agent databases with mismatched ownership are isolated until repaired.",
			async detect(ctx) {
				const { evaluateAgentDatabaseAdmissions } = await import("./agent-database-admission-0YPxJQR-.mjs");
				return (ctx.agentDatabaseRefusals ?? await evaluateAgentDatabaseAdmissions(ctx.cfg, { env: ctx.env })).map((refusal) => ({
					checkId: "core/doctor/agent-database-admission",
					severity: "warning",
					target: refusal.agentId,
					requirement: refusal.code,
					message: `Agent ${refusal.agentId} is degraded. ${refusal.reason}`,
					fixHint: refusal.repairHint
				}));
			}
		} }),
		createDoctorHealthContribution("doctor:native-status", "Native helpers and child pipes", { healthChecks: [appContainerSpawnCheck, nativeStatusCheck] }),
		createDoctorHealthContribution("doctor:node-runtime", "Node runtime", {
			healthCheckIds: ["core/doctor/node-runtime"],
			async run(ctx) {
				const { runCoreHealthFindingNote } = await import("./doctor-health-contribution-core-DD__vwVu.mjs");
				await runCoreHealthFindingNote(ctx, "core/doctor/node-runtime");
			}
		}),
		createDoctorHealthContribution("doctor:gateway-config", "Gateway config", {
			healthCheckIds: ["core/doctor/gateway-config"],
			run: params.runGatewayConfigHealth
		}),
		createDoctorHealthContribution("doctor:database-engine", "Database engines", {
			healthChecks: {
				description: "Selected database engines and experimental PostgreSQL limitations.",
				async detect(ctx) {
					const { collectDatabaseEngineHealthFindings } = await import("./doctor-database-engine-BMdwyyTo.mjs");
					return collectDatabaseEngineHealthFindings(ctx.cfg);
				}
			},
			async run(ctx) {
				const { noteDatabaseEngines, collectDatabaseEngineHealthFindings } = await import("./doctor-database-engine-BMdwyyTo.mjs");
				noteDatabaseEngines(ctx.cfg);
				recordDoctorHealthWarnings(ctx, collectDatabaseEngineHealthFindings(ctx.cfg));
			}
		}),
		createDoctorHealthContribution("doctor:auth-profile-migration", "Auth profile migration", {
			updateWork: { kind: "startup" },
			run: params.runAuthProfileMigration
		}),
		createDoctorHealthContribution("doctor:auth-profiles", "Auth profiles", {
			updateWork: {
				kind: "inspection",
				scope: "agent",
				repairs: true
			},
			healthChecks: {
				description: "Auth profile cooldown, expiry, missing credential, and legacy override state",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectAuthProfileHealthFindings } = await import("./doctor-auth-C1teGH_y.mjs");
					return collectAuthProfileHealthFindings({
						cfg: ctx.cfg,
						allowKeychainPrompt: false
					});
				}
			},
			run: params.runAuthProfileHealth
		}),
		createDoctorHealthContribution("doctor:claude-cli", "Claude CLI", {
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/claude-cli"],
			run: runClaudeCliHealth
		}),
		createDoctorHealthContribution("doctor:gateway-auth", "Gateway auth", {
			healthCheckIds: ["core/doctor/gateway-auth"],
			run: params.runGatewayAuthHealth
		}),
		createDoctorHealthContribution("doctor:node-hosting-preconditions", "Node hosting preconditions", { healthChecks: {
			description: "Gateway config can authenticate and onboard node and worker hosts.",
			async detect(ctx) {
				const { collectNodeHostingPreconditionFindings } = await import("./doctor-node-hosting-preconditions-VXNQ5pds.mjs");
				const findings = await collectNodeHostingPreconditionFindings(ctx.cfg);
				return resolveUpdateRehearsalRoot(ctx.env ?? process.env) ? findings.filter((finding) => finding.requirement !== "node-onboarding-url") : findings;
			}
		} }),
		createDoctorHealthContribution("doctor:command-owner", "Command owner", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/command-owner"],
			run: runCommandOwnerHealth
		}),
		createDoctorHealthContribution("doctor:structured-health-repairs", "Plugin health inspection and repair", {
			updateWork: {
				kind: "inspection",
				scope: "agent",
				repairs: true
			},
			run: params.runStructuredHealthRepairs
		}),
		createDoctorHealthContribution("doctor:legacy-state", "Legacy state", {
			healthCheckIds: ["core/doctor/legacy-state", "core/doctor/removed-workspaces-state"],
			run: params.runLegacyStateHealth
		}),
		createDoctorHealthContribution("doctor:session-transcripts", "Session transcripts", {
			healthChecks: {
				description: "Legacy or branchy session transcript files are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToHealthFinding } = await import("./doctor-session-transcripts-DblmYbDQ.mjs");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToRepairEffect } = await import("./doctor-session-transcripts-DblmYbDQ.mjs");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToRepairEffect);
				}, "legacy doctor session transcript contribution owns transcript rewrites")
			},
			run: runSessionTranscriptsHealth
		}),
		createDoctorHealthContribution("doctor:agent-memory-schema", "Agent memory schema", runAgentMemorySchemaHealth),
		createDoctorHealthContribution("doctor:legacy-plugin-manifests", "Legacy plugin manifests", {
			healthChecks: {
				description: "Legacy plugin manifest capability keys are reported as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectLegacyPluginManifestContractMigrations, legacyPluginManifestContractMigrationToHealthFinding } = await import("./doctor-plugin-manifests-Bq6YhTo6.mjs");
					return collectLegacyPluginManifestContractMigrations({
						config: ctx.cfg,
						env: process.env
					}).map(legacyPluginManifestContractMigrationToHealthFinding);
				}
			},
			run: runLegacyPluginManifestHealth
		}),
		createDoctorHealthContribution("doctor:legacy-plugin-dependencies", "Legacy plugin dependencies", {
			healthChecks: {
				description: "Deprecated shared plugin dependency cleanup check.",
				defaultEnabled: false,
				async detect() {
					return [{
						checkId: "core/doctor/legacy-plugin-dependencies",
						severity: "info",
						message: "Deprecated check: Doctor preserves shared plugin runtime caches and no longer scans them for removal."
					}];
				}
			},
			run: async () => {}
		}),
		createDoctorHealthContribution("doctor:stale-plugin-runtime-symlinks", "Stale plugin runtime symlinks", {
			healthChecks: {
				description: "Stale plugin-runtime symlinks are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { collectStalePluginRuntimeSymlinkHealthFindings } = await import("./plugin-runtime-symlinks-B6jF22OT.mjs");
					return collectStalePluginRuntimeSymlinkHealthFindings();
				}
			},
			run: async () => {}
		}),
		createDoctorHealthContribution("doctor:release-configured-plugin-installs", "Configured plugin repair", {
			healthChecks: {
				id: "core/doctor/configured-plugin-installs",
				description: "Configured plugin install records and package payloads are repairable.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToHealthFinding } = await import("./missing-configured-plugin-install-BTp4wRrU.mjs");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToRepairEffect } = await import("./missing-configured-plugin-install-BTp4wRrU.mjs");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToRepairEffect);
				}, "legacy doctor configured plugin install repair owns package mutation")
			},
			run: runReleaseConfiguredPluginInstallsHealth
		}),
		createDoctorHealthContribution("doctor:plugin-registry", "Plugin registry", {
			healthChecks: {
				description: "Plugin registry migration, stale shadow, and peer-link issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToHealthFinding } = await import("./doctor-plugin-registry-DMKhajXa.mjs");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToRepairEffect } = await import("./doctor-plugin-registry-DMKhajXa.mjs");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToRepairEffect);
				}, "legacy doctor plugin registry contribution owns registry repairs")
			},
			run: runPluginRegistryHealth
		}),
		createDoctorHealthContribution("doctor:legacy-plugin-source-captures", "Legacy plugin captures", {
			updateWork: { kind: "startup" },
			run: runLegacyPluginSourceCapturesHealth
		}),
		createDoctorHealthContribution("doctor:retained-update-runtimes", "Updater runtimes", {
			updateWork: { kind: "startup" },
			run: runRetainedUpdateRuntimesHealth
		}),
		createDoctorHealthContribution("doctor:update-snapshots", "Retained update database snapshots", {
			updateWork: { kind: "standalone" },
			healthChecks: {
				description: "Retained npm update database snapshots need operator review before removal.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectUpdateSnapshotHealthFindings } = await import("./doctor-update-snapshots-Bgl379KY.mjs");
					return collectUpdateSnapshotHealthFindings(ctx.env);
				}
			}
		}),
		createDoctorHealthContribution("doctor:ui-protocol-freshness", "UI protocol freshness", {
			healthCheckIds: ["core/doctor/ui-protocol-freshness"],
			run: async () => {}
		}),
		createDoctorHealthContribution("doctor:stale-runtime-build", "Stale runtime build", {
			healthCheckIds: ["core/doctor/stale-runtime-build"],
			run: runStaleRuntimeBuildHealth
		}),
		createDoctorHealthContribution("doctor:disk-space", "Disk space", {
			healthChecks: {
				description: "Low disk space around the OpenClaw state directory is a finding.",
				defaultEnabled: false,
				async detect() {
					const { collectDiskSpaceHealthFindings } = await import("./doctor-disk-space-D4f0ZlS9.mjs");
					return collectDiskSpaceHealthFindings();
				}
			},
			run: runDiskSpaceHealth
		}),
		createDoctorHealthContribution("doctor:project-clone-shape", "Project clones", {
			updateWork: { kind: "standalone" },
			healthChecks: {
				description: "Partial and shallow registry-owned project clones need manual repair.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectProjectCloneShapeHealthFindings } = await import("./doctor-project-clone-shape-C8RFymfm.mjs");
					return await collectProjectCloneShapeHealthFindings(ctx.cfg);
				}
			},
			async run(ctx) {
				const { noteProjectCloneShape } = await import("./doctor-project-clone-shape-C8RFymfm.mjs");
				await noteProjectCloneShape(ctx.cfg);
			}
		}),
		createDoctorHealthContribution("doctor:db-bloat", "SQLite database size", {
			updateWork: { kind: "standalone" },
			run: runDatabaseBloatHealth
		}),
		createDoctorHealthContribution("doctor:channel-ingress-dead-letters", "Channel ingress dead letters", {
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			run: runChannelIngressDeadLettersHealth
		}),
		createDoctorHealthContribution("doctor:state-integrity", "State integrity", {
			healthChecks: {
				description: "State directory, config permission, and runtime state issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToHealthFinding } = await import("./doctor-state-integrity-BVNglioH.mjs");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: ctx.env ?? process.env
					}).map(stateIntegrityIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToRepairEffect } = await import("./doctor-state-integrity-BVNglioH.mjs");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: ctx.env ?? process.env
					}).map(stateIntegrityIssueToRepairEffect);
				}, "legacy doctor state integrity contribution owns state repairs")
			},
			run: runStateIntegrityHealth
		}),
		createDoctorHealthContribution("doctor:codex-session-routes", "Codex session routes", {
			healthCheckIds: ["core/doctor/codex-session-routes"],
			run: runCodexSessionRouteHealth
		}),
		createDoctorHealthContribution("doctor:telegram-general-topic-conversations", "Telegram General-topic conversations", {
			healthCheckIds: ["core/doctor/telegram-general-topic-conversations"],
			run: runTelegramGeneralTopicConversationHealth
		}),
		createDoctorHealthContribution("doctor:session-transcript-headers", "Session transcript headers", runSessionTranscriptHeadersHealth),
		createDoctorHealthContribution("doctor:session-transcript-labels", "Session transcript labels", runSessionTranscriptLabelsHealth),
		createDoctorHealthContribution("doctor:session-snapshots", "Session snapshots", {
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Historical session snapshot paths are advisory findings; originals are preserved.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToHealthFinding } = await import("./doctor-session-snapshots-Bc72EQrK.mjs");
					return (await detectSessionSnapshotHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(sessionSnapshotIssueToHealthFinding);
				}
			},
			run: runSessionSnapshotsHealth
		}),
		createDoctorHealthContribution("doctor:config-audit-scrub", "Config audit", {
			healthChecks: {
				description: "Historical config-audit argv redaction gaps are represented as structured findings.",
				defaultEnabled: false,
				async detect() {
					const { configAuditScrubToHealthFinding, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-ByTNojV0.mjs");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToHealthFinding(result)] : [];
				},
				repair: legacyOwnedRepair(async () => {
					const { configAuditScrubToRepairEffect, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-ByTNojV0.mjs");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToRepairEffect(result)] : [];
				}, "legacy doctor config audit contribution owns cleanup")
			},
			run: runConfigAuditScrubHealth
		}),
		createDoctorHealthContribution("doctor:legacy-cron", "Legacy cron", {
			healthCheckIds: ["core/doctor/legacy-whatsapp-crontab", "core/doctor/legacy-cron-store"],
			run: runLegacyCronHealth
		}),
		createDoctorHealthContribution("doctor:sandbox", "Sandbox", {
			healthChecks: {
				id: "core/doctor/sandbox/registry-files",
				description: "Legacy sandbox registry files are represented in SQLite registry storage.",
				async detect() {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToHealthFinding } = await import("./doctor-sandbox-DIW4uK3d.mjs");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToRepairEffect } = await import("./doctor-sandbox-DIW4uK3d.mjs");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToRepairEffect);
				}, "legacy doctor sandbox contribution owns registry migration")
			},
			run: runSandboxHealth
		}),
		createDoctorHealthContribution("doctor:codex-bwrap", "Codex bwrap sandbox", {
			updateWork: { kind: "standalone" },
			run: runCodexBwrapHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contributions.ts
const MAX_DEFERRED_LEGACY_STATE_DETAILS = 20;
async function reportDeferredLegacyState(ctx) {
	if (ctx.options.repair !== true && ctx.options.yes !== true) return;
	const [{ detectLegacyStateMigrations }, { prepareLegacySessionSurfaces }] = await Promise.all([import("./state-migrations.doctor-CxSGwF1E.mjs"), import("./legacy-session-surfaces-BqClEY-t.mjs")]);
	const legacyState = await detectLegacyStateMigrations({
		cfg: ctx.cfg,
		doctorOnlyStateMigrations: true,
		...ctx.env ? { env: ctx.env } : {},
		legacySessionSurfaces: prepareLegacySessionSurfaces({ config: ctx.cfg })
	});
	const pendingDetails = [...legacyState.warnings.map((warning) => warning.startsWith("- ") ? warning : `- ${warning}`), ...legacyState.preview];
	if (pendingDetails.length === 0) return;
	const { note } = await import("./terminal-core/note.js");
	const displayedDetails = pendingDetails.slice(0, MAX_DEFERRED_LEGACY_STATE_DETAILS);
	const omittedDetailCount = pendingDetails.length - displayedDetails.length;
	const remediation = ctx.configWriteRefusal === "validation" ? "Fix the config errors above." : ctx.configWriteRefusal === "include-ownership" ? "Repair the include boundary named above by hand." : "Resolve the Gateway or cron-store condition above.";
	note([
		"Pending owners and blockers:",
		...displayedDetails,
		...omittedDetailCount > 0 ? [`${omittedDetailCount} additional pending entries were omitted from this report.`] : [],
		"No listed legacy source was removed.",
		remediation
	].join("\n"), "Legacy state deferred");
}
async function runGatewayConfigHealth(ctx) {
	const { formatCliCommand } = await import("./command-format-Blfiiv-c.mjs");
	const { hasAmbiguousGatewayAuthModeConfig } = await import("./auth-mode-policy-BeRbtjFX.mjs");
	const { note } = await import("./terminal-core/note.js");
	if (!ctx.cfg.gateway?.mode) {
		const lines = [
			"gateway.mode is unset; gateway start will be blocked.",
			`Fix: run ${formatCliCommand("openclaw configure")} and set Gateway mode (local/remote).`,
			`Or set directly: ${formatCliCommand("openclaw config set gateway.mode local")}`
		];
		if (!fs.existsSync(ctx.configPath)) lines.push(`Missing config: run ${formatCliCommand("openclaw setup")} first.`);
		note(lines.join("\n"), "Gateway");
	}
	if (resolveDoctorMode(ctx.cfg) === "local" && hasAmbiguousGatewayAuthModeConfig(ctx.cfg)) note([
		"gateway.auth.token and gateway.auth.password are both configured while gateway.auth.mode is unset.",
		"Set an explicit mode to avoid ambiguous auth selection and startup/runtime failures.",
		`Set token mode: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`,
		`Set password mode: ${formatCliCommand("openclaw config set gateway.auth.mode password")}`
	].join("\n"), "Gateway auth");
}
async function runGatewayAuthHealth(ctx) {
	if (!ctx.sourceConfigValid) return;
	const { detectGatewayAuthHealth } = await import("./doctor-gateway-auth-DIfibyoY.mjs");
	const [finding] = await detectGatewayAuthHealth({
		cfg: ctx.cfg,
		env: ctx.env,
		allowExecSecretRefs: ctx.options.allowExec
	});
	const { resolveSecretInputRef } = await import("./types.secrets-lw2AHHZJ.mjs");
	const { note } = await import("./terminal-core/note.js");
	const gatewayTokenRef = resolveSecretInputRef({
		value: ctx.cfg.gateway?.auth?.token,
		defaults: ctx.cfg.secrets?.defaults
	}).ref;
	if (!finding) {
		if (gatewayTokenRef && ctx.options.generateGatewayToken === true) note(`Gateway token generation skipped because gateway.auth.token is managed by SecretRef ${gatewayTokenRef.source}:${gatewayTokenRef.provider}:${gatewayTokenRef.id}. The referenced credential was left unchanged.`, "Gateway auth");
		return;
	}
	note([finding.message, finding.fixHint].filter(Boolean).join("\n"), "Gateway auth");
	if (finding.path !== "gateway.auth.token") {
		recordDoctorHealthWarnings(ctx, [finding]);
		return;
	}
	if (gatewayTokenRef) {
		if (gatewayTokenRef.source === "store" && finding.requirement === "SECRET_REF_REDACTED_VALUE" && (ctx.options.generateGatewayToken === true || ctx.options.repair === true || ctx.options.yes === true)) {
			const { isRedactedSecretValue } = await import("./redact-sentinel-C4AzDkW4.mjs");
			const { readSecretStoreValue, writeSecretStoreEntryWithRollback } = await import("./secret-store-DgsUJeG_.mjs");
			const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-BjQFcr9G.mjs");
			const { resolveOpenClawStateSqlitePath } = await import("./openclaw-state-db.paths-DOpcSToL.mjs");
			const { randomToken } = await import("./onboard-helpers-G-2HeHvm.mjs");
			const database = { env: ctx.env ?? process.env };
			const entry = {
				scope: { kind: "team" },
				name: gatewayTokenRef.id,
				database
			};
			let rollback;
			try {
				const current = await readSecretStoreValue(entry);
				if (!current.ok || !isRedactedSecretValue(current.value)) {
					note(`Secret store entry "${entry.name}" changed; rerun Doctor to inspect it.`, "Gateway auth");
					return;
				}
				const databasePath = resolveOpenClawStateSqlitePath(database.env);
				const backup = await createVerifiedSqliteSnapshot({
					sourcePath: databasePath,
					targetPath: `${databasePath}.doctor-gateway-token.${randomUUID()}.bak`,
					preserveRowIds: true
				});
				const nextToken = randomToken();
				({rollback} = await writeSecretStoreEntryWithRollback({
					...entry,
					value: nextToken,
					expectedValue: current.value,
					kind: "secret",
					updatedBy: "doctor"
				}));
				const repaired = await readSecretStoreValue(entry);
				if (!repaired.ok || repaired.value !== nextToken) throw new Error("the replacement token could not be verified");
				rollback = void 0;
				note(`Regenerated Gateway token in secret store entry "${entry.name}"; gateway.auth.token remains a SecretRef. Backup: ${backup.path}\nRestart the Gateway, then reconnect or re-pair devices with the new token.`, "Gateway auth");
			} catch (error) {
				let recovery = "";
				try {
					if (rollback) recovery = await rollback() ? " The previous entry was restored." : " The entry changed again and was left untouched.";
				} catch (rollbackError) {
					recovery = ` Rollback failed: ${scrubDoctorErrorMessage(rollbackError)}.`;
				}
				const warning = `Could not repair Gateway token in secret store entry "${entry.name}": ${scrubDoctorErrorMessage(error)}.${recovery} Rerun \`openclaw doctor --fix\` after resolving the reported problem.`;
				note(warning, "Gateway auth");
				recordDoctorHealthWarnings(ctx, [], [warning]);
			}
			return;
		}
		note(`${ctx.options.generateGatewayToken === true ? "Gateway token generation skipped because a SecretRef is configured. " : ""}Doctor will not overwrite gateway.auth.token with a plaintext value.`, "Gateway auth");
		return;
	}
	if (!(ctx.options.generateGatewayToken === true ? true : ctx.options.nonInteractive === true ? false : await ctx.prompter.confirmAutoFix({
		message: "Generate and configure a gateway token now?",
		initialValue: true
	}))) return;
	const { randomToken } = await import("./onboard-helpers-G-2HeHvm.mjs");
	const nextToken = randomToken();
	const config = {
		...ctx.cfg,
		gateway: {
			...ctx.cfg.gateway,
			auth: {
				...ctx.cfg.gateway?.auth,
				mode: "token",
				token: nextToken
			}
		}
	};
	copyConfigResolutionFactsThroughRewrite(ctx.cfg, config);
	ctx.cfg = config;
	note("Gateway token configured.", "Gateway auth");
}
async function runLegacyStateHealth(ctx) {
	const { note } = await import("./terminal-core/note.js");
	await runCoreContributionHealth(ctx, ["core/doctor/removed-workspaces-state"]);
	const doctorOnlyStateMigrations = ctx.options.repair === true || ctx.options.yes === true;
	if (!doctorOnlyStateMigrations || !isDeepStrictEqual(ctx.configResult.preflightLegacyStateConfig, ctx.cfg)) {
		const { detectLegacyStateMigrations, runLegacyStateMigrations } = await import("./state-migrations.doctor-CxSGwF1E.mjs");
		const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces-BqClEY-t.mjs");
		const legacySessionSurfaces = prepareLegacySessionSurfaces({ config: ctx.cfg });
		const legacyState = await detectLegacyStateMigrations({
			cfg: ctx.cfg,
			...doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {},
			legacySessionSurfaces
		});
		if (legacyState.warnings.length > 0) note(legacyState.warnings.join("\n"), "Doctor warnings");
		if (legacyState.notices.length > 0) note(legacyState.notices.join("\n"), "Doctor notices");
		if (legacyState.preview.length > 0) {
			note(legacyState.preview.join("\n"), "Legacy state detected");
			if (ctx.options.nonInteractive === true ? true : await ctx.prompter.confirm({
				message: "Migrate detected legacy state now?",
				initialValue: true
			})) {
				const migrated = await runLegacyStateMigrations({
					detected: legacyState,
					config: ctx.cfg,
					...doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {},
					legacySessionSurfaces
				});
				recordDoctorHealthWarnings(ctx, [], migrated.stepReceipts.flatMap((receipt) => receipt.outcome === "warning" || receipt.outcome === "deferred" ? receipt.warnings : []));
				if (migrated.changes.length > 0) note(migrated.changes.join("\n"), "Doctor changes");
				const notices = migrated.notices ?? [];
				if (notices.length > 0) note(notices.join("\n"), "Doctor notices");
				if (migrated.warnings.length > 0) note(migrated.warnings.join("\n"), "Doctor warnings");
			}
		}
	}
	if (!doctorOnlyStateMigrations) return;
	const { repairObsoleteGeneratedExecApprovals } = await import("./exec-approvals-generated-migration-RkumfMCB.mjs");
	const { ExecApprovalsMigrationRequiredError } = await import("./exec-approvals-migration-gate-C_f5UQ3b.mjs");
	let removedExecApprovals;
	try {
		removedExecApprovals = repairObsoleteGeneratedExecApprovals();
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) return;
		throw error;
	}
	if (removedExecApprovals > 0) note(`Exec approvals updated: removed ${removedExecApprovals} older generated ${removedExecApprovals === 1 ? "approval" : "approvals"} that were not tied to a working directory. Manual allowlist rules were not changed. Rerun affected workflows and choose "Always allow here" when prompted.`, "Doctor changes");
}
async function shouldInspectSystemdLinger(ctx) {
	if (process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local" || !await shouldManageGatewayService(ctx.env ?? process.env)) return false;
	const env = ctx.env ?? process.env;
	const { findInstalledSystemdGatewayScope } = await import("./systemd-CgbtuC9F.mjs");
	return (await findInstalledSystemdGatewayScope(env))?.scope === "user";
}
async function runSystemdLingerHealth(ctx) {
	if (ctx.options.nonInteractive === true || !await shouldInspectSystemdLinger(ctx)) return;
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CtDX9tgS.mjs");
	const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-H7VQmWIw.mjs");
	const { note } = await import("./terminal-core/note.js");
	if ((await readGatewayServiceState(resolveGatewayService(), { env: process.env })).loadState.status !== "loaded") return;
	await ensureSystemdUserLingerInteractive({
		runtime: ctx.runtime,
		prompter: {
			confirm: async (p) => ctx.prompter.confirm(p),
			note
		},
		reason: "Gateway runs as a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
		requireConfirm: true
	});
}
async function detectSystemdLingerFindings(ctx) {
	if (!await shouldInspectSystemdLinger(ctx)) return [];
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CtDX9tgS.mjs");
	if ((await readGatewayServiceState(resolveGatewayService(), { env: process.env })).loadState.status !== "loaded") return [];
	const { isSystemdUserServiceAvailable, readSystemdUserLingerStatus, resolveSystemdUserServiceAccount } = await import("./systemd-CgbtuC9F.mjs");
	if (!await isSystemdUserServiceAvailable(process.env)) return [];
	const user = resolveSystemdUserServiceAccount(process.env);
	if (!user) return [];
	const status = await readSystemdUserLingerStatus({
		env: process.env,
		user
	});
	if (!status || status.linger === "yes") return [];
	return [{
		checkId: "core/doctor/systemd-linger",
		severity: "warning",
		source: "doctor",
		message: `Systemd lingering is disabled for ${status.user}.`,
		target: `systemd.user.${status.user}`,
		requirement: "systemd user lingering enabled",
		fixHint: `Run: sudo loginctl enable-linger ${status.user}`
	}];
}
async function runShellCompletionHealth(ctx) {
	const { doctorShellCompletion } = await import("./doctor-completion-B--zlFR_.mjs");
	await doctorShellCompletion(ctx.prompter, { nonInteractive: ctx.options.nonInteractive });
}
async function runGatewayHealthChecks(ctx) {
	const { note } = await import("./terminal-core/note.js");
	const skipReason = ctx.gatewayMaintenanceActive ? "Gateway health will be checked after Doctor repair." : await hasActiveGatewayExecCredential(ctx) && ctx.options.allowExec !== true ? "Gateway health checks skipped because gateway credentials use an exec SecretRef. Run `openclaw doctor --allow-exec` to verify Gateway health with exec SecretRefs." : void 0;
	if (skipReason) {
		note(skipReason, "Gateway");
		ctx.gatewayHealthSkipped = true;
		ctx.gatewayMemoryProbe = {
			checked: false,
			ready: false,
			skipped: true
		};
		return;
	}
	const { checkGatewayHealth, probeGatewayMemoryStatus } = await import("./doctor-gateway-health-C-lZLCc3.mjs");
	const { healthOk, authenticated, status } = await checkGatewayHealth({
		runtime: ctx.runtime,
		cfg: ctx.cfg
	});
	ctx.gatewayHealthSkipped = false;
	ctx.healthOk = healthOk;
	ctx.gatewayHealthAuthenticated = authenticated;
	ctx.gatewayStatus = status;
	ctx.gatewayMemoryProbe = authenticated ? await probeGatewayMemoryStatus({ cfg: ctx.cfg }) : {
		checked: false,
		ready: false,
		skipped: healthOk
	};
}
function shouldDeferPostActivationInspections(env) {
	return isUpdateDoctorRun(env) && !resolveUpdateRehearsalRoot(env) && isUpdateDoctorInspectionReportMode(env);
}
function resolveDoctorHealthContributions() {
	return [...resolveInitialDoctorHealthContributions({
		runStructuredHealthRepairs: (ctx) => runStructuredHealthRepairs(ctx, resolveDoctorContributionHealthChecks),
		runGatewayConfigHealth,
		runAuthProfileMigration,
		runAuthProfileHealth: runAuthProfileDiagnostics,
		runGatewayAuthHealth,
		runLegacyStateHealth
	}), ...resolveFinalDoctorHealthContributions({
		runSystemdLingerHealth,
		detectSystemdLingerFindings,
		runShellCompletionHealth,
		runGatewayHealthChecks
	})];
}
async function loadCoreHealthChecksById() {
	const { createCoreHealthChecks } = await import("./doctor-core-checks-B5a7njx2.mjs");
	return new Map(createCoreHealthChecks().map((check) => [check.id, check]));
}
function resolveContributionHealthChecks(contribution, checksById) {
	if (contribution.healthChecks.length > 0) return contribution.healthChecks.map((check) => ({
		...normalizeHealthCheck(check),
		updateWork: contribution.updateWork
	}));
	return contribution.healthCheckIds.map((id) => {
		const check = checksById.get(id);
		if (check === void 0) throw new Error(`doctor contribution ${contribution.id} references unknown core health check ${id}`);
		return {
			...check,
			updateWork: contribution.updateWork
		};
	});
}
async function resolveDoctorContributionHealthChecks() {
	const checksById = await loadCoreHealthChecksById();
	return resolveDoctorHealthContributions().flatMap((contribution) => resolveContributionHealthChecks(contribution, checksById));
}
/**
* Optional inspections whose every finding `doctor --lint` reproduces, so an
* updater can run them after the restarted Gateway is ready. Repairs, readiness
* checks and inspections without a lint check stay in the stopped window.
*/
async function selectPostActivationInspections(contributions) {
	const checksById = await loadCoreHealthChecksById();
	return contributions.flatMap((contribution) => {
		if (contribution.required || contribution.updateWork?.kind !== "inspection" || contribution.updateWork.repairs) return [];
		if (contribution.id === "doctor:session-snapshots" || contribution.id === "doctor:workspace-status") return [];
		const checks = resolveContributionHealthChecks(contribution, checksById);
		return checks.length > 0 && checks.every((check) => check.updateReadiness === void 0 && check.repair === void 0) ? [{
			contribution,
			checks
		}] : [];
	});
}
async function runDoctorHealthContributionList(ctx, contributions) {
	const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
	throwIfDoctorStateMigrationRefused(ctx.configResult.stateMigrationStepReceipts);
	const env = ctx.env ?? process.env;
	ctx.updateBudget ??= await resolveDoctorUpdateBudget({
		cfg: ctx.cfg,
		env,
		preparedAgentCount: ctx.preparedAgentCount
	});
	const updateDoctorRun = isUpdateDoctorRun(env);
	const rehearsalRoot = resolveUpdateRehearsalRoot(env);
	const rehearsalInspections = new Set(rehearsalRoot ? contributions.filter((entry) => !entry.required && entry.updateWork?.kind === "inspection" && !entry.updateWork.repairs) : []);
	let deferredCheckIds = shouldDeferPostActivationInspections(env) ? recordUpdateDoctorDeferredInspectionChecks([]) : void 0;
	const postActivationInspections = new Map(deferredCheckIds ? (await selectPostActivationInspections(contributions)).map(({ contribution, checks }) => [contribution, checks.map((check) => check.id)]) : []);
	const deferred = updateDoctorRun ? contributions.filter((contribution) => contribution.updateWork?.kind === "standalone") : [];
	if (deferred.length > 0) {
		const { note } = await import("./terminal-core/note.js");
		note(`Omitted during update: ${deferred.map((contribution) => contribution.label).join(", ")}.\nRun \`openclaw doctor\` after the update to inspect these diagnostics.`, "Update Doctor scope");
	}
	const ordered = ctx.updateBudget ? [
		...contributions.filter((entry) => entry.updateWork === void 0 || entry.updateWork.kind === "startup" || entry.updateWork.kind === "standalone"),
		...contributions.filter((entry) => entry.updateWork?.kind === "inspection"),
		...contributions.filter((entry) => entry.updateWork?.kind === "finalize")
	] : contributions;
	try {
		for (const contribution of ordered) {
			const inspectionIds = postActivationInspections.get(contribution);
			if (inspectionIds) {
				deferredCheckIds = recordUpdateDoctorDeferredInspectionChecks(inspectionIds);
				continue;
			}
			if (rehearsalInspections.has(contribution) || updateDoctorRun && contribution.updateWork?.kind === "standalone") continue;
			if (contribution.updateWork?.kind === "inspection" && !admitDoctorUpdateInspection(ctx.updateBudget, contribution.updateWork.scope, (contribution.healthCheckIds.length ? contribution.healthCheckIds : [`core/doctor/${contribution.id.replace(/^doctor:/, "")}`]).map((id) => ({
				id,
				label: contribution.label
			})))) continue;
			try {
				const run = async () => {
					try {
						await contribution.run(ctx);
					} finally {
						throwIfDoctorStateMigrationRefused(ctx.configResult.stateMigrationStepReceipts);
					}
					if (ctx.configWriteRefusal) await reportDeferredLegacyState(ctx);
				};
				await measureGatewayBootstrapStep(`doctor.contribution.${contribution.id}`, async () => {
					if (!runWithPluginMetadataSnapshot) await run();
					else {
						const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
						await runWithPluginMetadataSnapshot({
							config: ctx.cfg,
							workspaceDir
						}, run);
					}
				});
				if (ctx.configWriteRefusal) return;
			} catch (error) {
				if (contribution.required || error instanceof DoctorStateMigrationRefusalError || error instanceof ConfigWritePostCommitError) throw error;
				const { note } = await import("./terminal-core/note.js");
				const message = `${contribution.id} run failed: ${scrubDoctorErrorMessage(error)}`;
				note(message, "Doctor warnings");
				recordDoctorHealthWarnings(ctx, [], [message]);
			}
		}
	} finally {
		if (rehearsalInspections.size > 0) ctx.runtime.log(`Deferred advisory inspections during copied-state rehearsal: ${[...rehearsalInspections].map((entry) => entry.id).join(", ")}. The live post-swap Doctor retains these checks.`);
		if (deferredCheckIds?.length) ctx.runtime.log(`Deferred advisory inspections until the restarted Gateway is ready: ${deferredCheckIds.join(", ")}. The updater runs their \`openclaw doctor --lint\` checks after restart.`);
		const findings = [...ctx.updateBudget?.deferred.values() ?? []];
		recordDoctorHealthWarnings(ctx, findings, [], { prepend: true });
		for (const finding of findings) ctx.runtime.log(`[warning] ${finding.checkId} [${finding.errorCode}]: ${finding.message}`);
		if (findings.length > 0) ctx.runtime.log("Run `openclaw doctor --fix` after activation to complete deferred checks and repairs.");
	}
}
async function runDoctorHealthContributions(ctx) {
	await runDoctorHealthContributionList(ctx, resolveDoctorHealthContributions());
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.doctorHealthContributionsTestApi")] = {
	resolveDoctorHealthContributions,
	runDoctorHealthContributionList
};
//#endregion
export { resolveDoctorContributionHealthChecks, runDoctorHealthContributions };
