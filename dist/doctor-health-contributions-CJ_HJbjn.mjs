import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { a as writeConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { t as ConfigWritePostCommitError } from "./io.write-errors-C28rym6a.mjs";
import { f as shouldDeferConfiguredPluginInstallRepair, s as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-DiVB4MDN.mjs";
import { t as emitDoctorNotes } from "./emit-notes-BF8NdCNQ.mjs";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-CBAGGfGW.mjs";
import { c as throwIfDoctorStateMigrationRefused, t as DoctorStateMigrationRefusalError } from "./state-migrations.messages-Sd7IFIbe.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-B56mlGZD.mjs";
import { t as hasActiveGatewayExecCredential } from "./doctor-gateway-exec-credential-B1VJk7ba.mjs";
import { n as resolveDoctorUpdateBudget, t as admitDoctorUpdateInspection } from "./doctor-update-budget-CbIqjzIo.mjs";
import { n as noteBackupDoctorHint } from "./backup-health-C6zTF_2P.mjs";
import { t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-B2wDiBjA.mjs";
import { n as normalizeHealthCheck } from "./health-check-adapter-BrC920MN.mjs";
import { n as resolveDoctorMode, r as resolveDoctorWorkspaceDir, t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-BmAjb2e7.mjs";
import { n as recordDoctorHealthWarnings, t as createDoctorHealthContribution } from "./doctor-health-contribution-ByX5IM87.mjs";
import { n as runCoreHealthFindingNote, r as runStructuredHealthRepairs, t as runCoreContributionHealth } from "./doctor-health-contribution-core-CGUf2BQR.mjs";
import { a as runWriteConfigHealth, n as runFinalConfigValidationHealth, r as runInitialConfigWriteHealth, t as collectWriteConfigHealthFindings } from "./doctor-health-contribution-runners.config-DvPPRn4c.mjs";
import { a as runGatewayDaemonHealth, c as runHostDesktopHealth, d as runStartupChannelMaintenanceHealth, f as runWebFetchProxyHealth, i as runDevicePairingHealth, l as runOpenAIOAuthTlsHealth, n as runClaudeCliHealth, o as runGatewayServicesHealth, p as runWhatsappResponsivenessHealth, r as runCommandOwnerHealth, s as runGitHubProjectHealth, t as runBrowserHealth, u as runSecurityHealth } from "./doctor-health-contribution-runners.gateway-C1XdTNQJ.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/flows/doctor-auth-health.ts
async function runAuthProfileMigration(ctx) {
	ctx.authProfileHealthReady = false;
	const sharedAuth = ctx.configResult.stateMigrationStepReceipts?.find((receipt) => receipt.id === "shared-auth-store");
	if (sharedAuth?.outcome === "skipped" && sharedAuth.warnings.length > 0) return;
	const { repairAuthProfileMigration } = await import("./auth-profile-repair-CVahAfR5.mjs");
	const { maybeRepairLegacyOAuthProfileIds } = await import("./doctor-auth-legacy-oauth-vdXaC6Ej.mjs");
	const { maybeRepairLegacyOAuthSidecarProfiles } = await import("./doctor-auth-oauth-sidecar-DV_AREt6.mjs");
	const { maybeMigrateLegacyPluginModelCatalogs } = await import("./doctor-plugin-model-catalog-Cb-Rvse4.mjs");
	const { buildGatewayConnectionDetails } = await import("./call-bfuNQIMk.mjs");
	const { note } = await import("./terminal-core/note.js");
	await maybeRepairLegacyOAuthSidecarProfiles({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
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
	await maybeMigrateLegacyPluginModelCatalogs({
		cfg: ctx.cfg,
		...ctx.env ? { env: ctx.env } : {},
		prompter: ctx.prompter,
		runtime: ctx.runtime
	});
	const modelsBeforeRepair = ctx.cfg.agents?.defaults?.models;
	const legacyOAuthRepair = await maybeRepairLegacyOAuthProfileIds(ctx.cfg, ctx.prompter);
	ctx.cfg = legacyOAuthRepair.config;
	if (legacyOAuthRepair.retiredProfileCleanupPlans.length > 0) ctx.configResult.retiredAuthProfileCleanupPlans = [...ctx.configResult.retiredAuthProfileCleanupPlans ?? [], ...legacyOAuthRepair.retiredProfileCleanupPlans];
	if (!isDeepStrictEqual(modelsBeforeRepair, ctx.cfg.agents?.defaults?.models)) ctx.configResult.explicitSetPaths = [...ctx.configResult.explicitSetPaths ?? [], [
		"agents",
		"defaults",
		"models"
	]];
	const { maybeMigrateModelCatalogCredentials } = await import("./doctor-model-catalog-credentials-CM_8UzSW.mjs");
	await maybeMigrateModelCatalogCredentials({
		cfg: ctx.cfg,
		...ctx.env ? { env: ctx.env } : {},
		prompter: ctx.prompter,
		runtime: ctx.runtime
	});
	let authProfileHealthReady = true;
	if (ctx.configResult.retiredAuthProfileCleanupPlans?.length || ctx.configResult.openAICodexAuthProfileIdMap?.size) {
		const { runRetiredAuthProfileCleanup, runWriteConfigHealth } = await import("./doctor-health-contribution-runners.config-Pj2OICcS.mjs");
		await runWriteConfigHealth(ctx, { runPostWriteRepairs: false });
		authProfileHealthReady = !ctx.configWriteRefusal && isDeepStrictEqual(ctx.cfg, ctx.cfgForPersistence);
		if (authProfileHealthReady) await runRetiredAuthProfileCleanup(ctx);
	}
	ctx.authProfileHealthReady = authProfileHealthReady;
	ctx.gatewayDetails = buildGatewayConnectionDetails({ config: ctx.cfg });
	if (ctx.gatewayDetails.remoteFallbackNote) note(ctx.gatewayDetails.remoteFallbackNote, "Gateway");
}
async function runAuthProfileDiagnostics(ctx) {
	const { noteAuthProfileHealth, noteCopilotAmbientToken, noteLegacyCodexProviderOverride, noteSharedAuthStoreStatus } = await import("./doctor-auth-C16yLKGD.mjs");
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
const loadDoctorStateIntegrityModule$1 = async () => await import("./doctor-state-integrity-BfdWURyl.mjs");
async function runHooksModelHealth(ctx) {
	if (!ctx.cfg.hooks?.gmail?.model?.trim()) return;
	const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-D-l0Kfsa.mjs");
	const { readPreparedModelCatalog } = await import("./prepared-model-catalog-CFgw7dXn.mjs");
	const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-D5bTO0w2.mjs");
	const { note } = await import("./terminal-core/note.js");
	const hooksModelRef = resolveHooksGmailModel({
		cfg: ctx.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	if (!hooksModelRef) {
		note(`- hooks.gmail.model "${ctx.cfg.hooks.gmail.model}" could not be resolved`, "Hooks");
		return;
	}
	const { provider: defaultProvider, model: defaultModel } = resolveConfiguredModelRef({
		cfg: ctx.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const catalog = await readPreparedModelCatalog({
		config: ctx.cfg,
		readOnly: true,
		providerDiscoveryProviderIds: []
	});
	const status = getModelRefStatus({
		cfg: ctx.cfg,
		catalog,
		ref: hooksModelRef,
		defaultProvider,
		defaultModel: {
			provider: defaultProvider,
			model: defaultModel
		}
	});
	const warnings = [];
	if (!status.allowed) warnings.push(`- hooks.gmail.model "${status.key}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)`);
	if (!status.inCatalog) warnings.push(`- hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
	if (warnings.length > 0) note(warnings.join("\n"), "Hooks");
}
async function collectWorkspaceStatusPluginVersionReadiness(params) {
	if (params.cfg.gateway?.mode === "remote" || !await shouldManageGatewayService()) return;
	try {
		const { gatherDaemonStatus } = await import("./status.gather-C2WbsWk7.mjs");
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
			const { resolvePluginVersionDriftTargets } = await import("./plugin-version-drift-C4eoGoMJ.mjs");
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
	const { noteWorkspaceStatus } = await import("./doctor-workspace-status-CCvXUi3X.mjs");
	noteWorkspaceStatus(ctx.cfg, {
		pluginVersionReadiness,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runWorkspaceAliasHealth(ctx) {
	const { collectRepointedWorkspaceAliasFindings } = await import("./doctor-workspace-alias-CoCocfJM.mjs");
	const findings = await collectRepointedWorkspaceAliasFindings(ctx.cfg);
	if (findings.length > 0) {
		const { note } = await import("./terminal-core/note.js");
		note(findings.map((finding) => `${finding.message} ${finding.fixHint}`).join("\n"), "Workspace");
	}
}
async function runSkillsHealth(ctx) {
	const { maybeRepairSkillReadiness } = await import("./doctor-skills-Cf621qlz.mjs");
	ctx.cfg = await maybeRepairSkillReadiness({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runBootstrapSizeHealth(ctx) {
	const { noteBootstrapFileSize } = await import("./doctor-bootstrap-size-sfs3aoek.mjs");
	await noteBootstrapFileSize(ctx.cfg);
}
async function runHeartbeatCadenceMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatCadenceToCron } = await import("./doctor-heartbeat-cadence-migration-BVCb8yeS.mjs");
	await maybeMigrateHeartbeatCadenceToCron({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runHeartbeatScratchMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatFilesToScratch } = await import("./doctor-heartbeat-scratch-migration-DR8oJ0mw.mjs");
	await maybeMigrateHeartbeatFilesToScratch({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runToolsMdMigrationHealth(ctx) {
	const { maybeMigrateToolsMd } = await import("./doctor-tools-md-migration-Dby0Vib3.mjs");
	await maybeMigrateToolsMd({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runHeartbeatTaskMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatTasksToCron } = await import("./doctor-heartbeat-task-migration-jksujHkW.mjs");
	await maybeMigrateHeartbeatTasksToCron({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runMemorySearchHealthContribution(ctx) {
	const { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth } = await import("./doctor-memory-search-Clt7s0W7.mjs");
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
function memorySearchNoteToFinding(message) {
	const lines = message.split("\n");
	const firstLine = (lines[0] ?? message).trim();
	if (firstLine === "Memory search is explicitly disabled (enabled: false).") return null;
	const fixHint = lines.slice(1).map((line) => line.trimEnd()).join("\n").trim();
	let path = "memory.search.provider";
	if (firstLine.includes("No active memory plugin")) path = "plugins.slots.memory";
	else if (firstLine.includes("OpenAI-compatible embeddings endpoint")) path = "memory.search.remote.baseUrl";
	else if (firstLine.includes("OpenAI-compatible embedding model")) path = "memory.search.model";
	return {
		checkId: "core/doctor/memory-search",
		severity: "warning",
		message: firstLine,
		path,
		...fixHint ? { fixHint } : {}
	};
}
async function collectMemorySearchHealthFindings(ctx) {
	const { noteMemorySearchHealth } = await import("./doctor-memory-search-Clt7s0W7.mjs");
	const notes = [];
	await noteMemorySearchHealth(ctx.cfg, {
		env: ctx.env,
		includeWorkspaceMemoryHealth: false,
		skipAuthProfileResolution: true,
		gatewayMemoryProbe: {
			checked: false,
			ready: false,
			skipped: true
		},
		noteFn: (message) => notes.push(String(message))
	});
	return notes.flatMap((message) => {
		const finding = memorySearchNoteToFinding(message);
		return finding ? [finding] : [];
	});
}
async function runWorkspaceSuggestionsHealth(ctx) {
	if (ctx.options.workspaceSuggestions === false) return;
	const { collectWorkspaceBackupTip } = await loadDoctorStateIntegrityModule$1();
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await import("./doctor-workspace-6cPem3kK.mjs");
	const { note } = await import("./terminal-core/note.js");
	for (const { agentId, workspaceDir, labelAgent } of resolveDoctorWorkspaceSuggestionScopes(ctx.cfg)) {
		const prefix = labelAgent ? `Agent "${agentId}": ` : "";
		const backupTip = collectWorkspaceBackupTip(workspaceDir);
		if (backupTip) note(`${prefix}${backupTip}`, "Workspace");
		if (await shouldSuggestMemorySystem(workspaceDir)) note(`${prefix}${MEMORY_SYSTEM_PROMPT}`, "Workspace");
	}
}
//#endregion
//#region src/flows/doctor-health-contributions-final.ts
const CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID = "core/doctor/channel-package-state-capabilities";
function resolveFinalDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution({
			id: "doctor:gateway-services",
			label: "Gateway services",
			healthCheckIds: ["core/doctor/gateway-services/extra", "core/doctor/gateway-services/platform-notes"],
			run: runGatewayServicesHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:host-desktop",
			label: "Host desktop",
			healthChecks: {
				description: "Gateway-host desktop enablement, reachability, and RFB security state.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectHostDesktopHealthFindings } = await import("./doctor-host-desktop-DPlm1FUH.mjs");
					return collectHostDesktopHealthFindings(ctx.cfg);
				}
			},
			run: runHostDesktopHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:default-account-routing",
			label: "Default account routing",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthChecks: {
				description: "Multi-account channels have explicit default routing or complete bindings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectMissingDefaultAccountBindingWarnings, collectMissingExplicitDefaultAccountWarnings } = await import("./default-account-warnings-Jt-yMBXd.mjs");
					return [...collectMissingDefaultAccountBindingWarnings(ctx.cfg), ...collectMissingExplicitDefaultAccountWarnings(ctx.cfg)].map((message) => ({
						checkId: "core/doctor/default-account-routing",
						severity: "warning",
						message: message.replace(/^- /, "").trim()
					}));
				}
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:channel-package-state-capabilities",
			label: "Channel package-state capabilities",
			healthChecks: {
				id: CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID,
				description: "Declared channel package-state checker modules must load.",
				defaultEnabled: true,
				async detect(ctx) {
					if (shouldDeferConfiguredPluginInstallRepair(ctx.env ?? process.env)) return [];
					const { collectBundledChannelPackageStateLoadFailures } = await import("./package-state-probes-BBO7DD2v.mjs");
					return collectBundledChannelPackageStateLoadFailures().map((failure) => ({
						checkId: CHANNEL_PACKAGE_STATE_CAPABILITIES_CHECK_ID,
						severity: "warning",
						message: `Plugin ${failure.pluginId} declared ${failure.metadataKey}, but its checker failed to load: ${failure.detail}`,
						target: failure.pluginId,
						requirement: "declared-channel-package-state-capability-loadable",
						fixHint: `Rebuild or reinstall plugin ${failure.pluginId}, then rerun \`openclaw doctor\`.`
					}));
				}
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:startup-channel-maintenance",
			label: "Startup channel maintenance",
			healthChecks: [{
				id: "core/doctor/channel-plugin-blockers",
				description: "Configured channels must have loadable backing channel plugins.",
				defaultEnabled: false,
				async detect(ctx) {
					const { channelPluginBlockerHitToHealthFinding, scanConfiguredChannelPluginBlockers } = await import("./channel-plugin-blockers-CQ9MKNgh.mjs");
					return scanConfiguredChannelPluginBlockers(ctx.cfg, process.env).map(channelPluginBlockerHitToHealthFinding);
				}
			}, {
				id: "core/doctor/channel-preview-warnings",
				description: "Channel doctor preview warnings are captured as structured findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectChannelPreviewWarningHealthFindings } = await import("./doctor-startup-channel-maintenance-CSnZqA92.mjs");
					return collectChannelPreviewWarningHealthFindings({
						cfg: ctx.cfg,
						allowExec: ctx.allowExecSecretRefs === true
					});
				}
			}],
			run: runStartupChannelMaintenanceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:security",
			label: "Security",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/security"],
			run: runSecurityHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:web-fetch-proxy",
			label: "Web fetch proxy",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			run: runWebFetchProxyHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:github-projects",
			label: "GitHub projects",
			updateWork: { kind: "standalone" },
			run: runGitHubProjectHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:browser",
			label: "Browser",
			healthCheckIds: ["core/doctor/browser", "core/doctor/browser-clawd-profile-residue"],
			run: runBrowserHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:oauth-tls",
			label: "OAuth TLS",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/oauth-tls"],
			run: runOpenAIOAuthTlsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:hooks-model",
			label: "Hooks model",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/hooks-model"],
			run: runHooksModelHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:model-references",
			label: "Model references",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/model-references"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/model-references")
		}),
		createDoctorHealthContribution({
			id: "doctor:provider-catalog-projection",
			label: "Provider catalog projection",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/provider-catalog-projection"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/provider-catalog-projection")
		}),
		createDoctorHealthContribution({
			id: "doctor:local-audio-acceleration",
			label: "Local audio acceleration",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/local-audio-acceleration"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/local-audio-acceleration")
		}),
		createDoctorHealthContribution({
			id: "doctor:runtime-tool-schemas",
			label: "Runtime tool schemas",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/runtime-tool-schemas"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/runtime-tool-schemas")
		}),
		createDoctorHealthContribution({
			id: "doctor:skill-workshop-tool-policy",
			label: "Skill Workshop tool policy",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/skill-workshop-tool-policy"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/skill-workshop-tool-policy")
		}),
		createDoctorHealthContribution({
			id: "doctor:skill-workshop-relocation",
			label: "Skill Workshop relocation",
			healthCheckIds: ["core/doctor/skill-workshop-relocation"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/skill-workshop-relocation")
		}),
		createDoctorHealthContribution({
			id: "doctor:systemd-linger",
			label: "systemd linger",
			healthChecks: {
				description: "Disabled systemd user lingering is reported as a finding.",
				defaultEnabled: false,
				detect: params.detectSystemdLingerFindings
			},
			run: params.runSystemdLingerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:workspace-status",
			label: "Workspace status",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Workspace plugin/status diagnostics are exposed as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWorkspaceStatusHealthFindings } = await import("./doctor-workspace-status-CCvXUi3X.mjs");
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
		...isExperimentalClawsEnabled() ? [createDoctorHealthContribution({
			id: "doctor:claws-state",
			label: "Claws state",
			healthCheckIds: ["core/doctor/claws-state"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/claws-state")
		})] : [],
		createDoctorHealthContribution({
			id: "doctor:workspace-alias",
			label: "Workspace alias",
			healthChecks: {
				description: "Persisted workspace aliases must resolve to the canonical target that owns their stored state.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectRepointedWorkspaceAliasFindings } = await import("./doctor-workspace-alias-CoCocfJM.mjs");
					return collectRepointedWorkspaceAliasFindings(ctx.cfg);
				}
			},
			run: runWorkspaceAliasHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:skills",
			label: "Skills",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/skills-readiness"],
			run: runSkillsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:bootstrap-size",
			label: "Bootstrap size",
			updateWork: { kind: "standalone" },
			healthCheckIds: ["core/doctor/bootstrap-size"],
			run: runBootstrapSizeHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-cadence-migration",
			label: "Heartbeat cadence migration",
			healthChecks: {
				description: "Heartbeat cadence config must be materialized in cron monitor rows.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatCadenceMigrationFindings } = await import("./doctor-heartbeat-cadence-migration-BVCb8yeS.mjs");
					return collectHeartbeatCadenceMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatCadenceMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-scratch-migration",
			label: "Heartbeat scratch migration",
			healthChecks: {
				description: "Workspace HEARTBEAT.md files must migrate into cron-owned scratch.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatScratchMigrationFindings } = await import("./doctor-heartbeat-scratch-migration-DR8oJ0mw.mjs");
					return collectHeartbeatScratchMigrationFindings(ctx.cfg);
				}
			},
			run: runHeartbeatScratchMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:tools-md-migration",
			label: "TOOLS.md migration",
			healthChecks: {
				description: "Workspace TOOLS.md notes must migrate into the AGENTS.md Tools section.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectToolsMdMigrationFindings } = await import("./doctor-tools-md-migration-Dby0Vib3.mjs");
					return collectToolsMdMigrationFindings(ctx.cfg);
				}
			},
			run: runToolsMdMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-task-cron-migration",
			label: "Heartbeat task cron migration",
			healthChecks: {
				description: "Heartbeat scratch task blocks must migrate into automations.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatTaskMigrationFindings } = await import("./doctor-heartbeat-task-migration-jksujHkW.mjs");
					return collectHeartbeatTaskMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatTaskMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:shell-completion",
			label: "Shell completion",
			healthCheckIds: ["core/doctor/shell-completion"],
			run: params.runShellCompletionHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-health",
			label: "Gateway health",
			healthCheckIds: ["core/doctor/gateway-health"],
			run: params.runGatewayHealthChecks
		}),
		createDoctorHealthContribution({
			id: "doctor:whatsapp-responsiveness",
			label: "WhatsApp responsiveness",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthChecks: {
				description: "Gateway pressure and local TUI observations when WhatsApp is enabled.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWhatsappResponsivenessHealthFindings } = await import("./doctor-whatsapp-responsiveness-CT-5c7wg.mjs");
					const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CSMvBDM8.mjs");
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
		createDoctorHealthContribution({
			id: "doctor:memory-search",
			label: "Memory search",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Memory search provider and backend readiness are captured as findings.",
				defaultEnabled: false,
				detect: collectMemorySearchHealthFindings
			},
			run: runMemorySearchHealthContribution
		}),
		createDoctorHealthContribution({
			id: "doctor:device-pairing",
			label: "Device pairing",
			healthChecks: {
				description: "Device pairing requests and stale device-auth records are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectDevicePairingHealthFindings } = await import("./doctor-device-pairing-Cwwudvt2.mjs");
					return collectDevicePairingHealthFindings({
						cfg: ctx.cfg,
						healthOk: false,
						env: ctx.env
					});
				}
			},
			run: runDevicePairingHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-daemon",
			label: "Gateway daemon",
			healthCheckIds: ["core/doctor/gateway-daemon"],
			run: runGatewayDaemonHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:write-config",
			label: "Write config",
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
		createDoctorHealthContribution({
			id: "doctor:workspace-suggestions",
			label: "Workspace suggestions",
			updateWork: { kind: "standalone" },
			healthCheckIds: ["core/doctor/workspace-suggestions"],
			run: runWorkspaceSuggestionsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:final-config-validation",
			label: "Final config validation",
			updateWork: { kind: "finalize" },
			healthCheckIds: ["core/doctor/final-config-validation"],
			run: runFinalConfigValidationHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.state.ts
const loadDoctorStateIntegrityModule = async () => await import("./doctor-state-integrity-BfdWURyl.mjs");
async function runLegacyPluginManifestHealth(ctx) {
	const { maybeRepairLegacyPluginManifestContracts } = await import("./doctor-plugin-manifests-Byr5bhcE.mjs");
	if (await maybeRepairLegacyPluginManifestContracts({
		config: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		prompter: ctx.prompter
	})) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runPluginRegistryHealth(ctx) {
	const { maybeRepairPluginRegistryState } = await import("./doctor-plugin-registry-ajth92V0.mjs");
	const result = await maybeRepairPluginRegistryState({
		config: ctx.cfg,
		env: process.env,
		prompter: ctx.prompter
	});
	ctx.cfg = result.config;
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runLegacyPluginSourceCapturesHealth(ctx) {
	const { noteLegacyPluginSourceCaptures } = await import("./doctor-plugin-source-captures-B-BYmtEF.mjs");
	await noteLegacyPluginSourceCaptures(ctx.env ?? process.env, ctx.prompter.shouldRepair);
}
async function runReleaseConfiguredPluginInstallsHealth(ctx) {
	if (!ctx.sourceConfigValid || !ctx.prompter.shouldRepair) return;
	const { maybeRunConfiguredPluginInstallReleaseStep } = await import("./release-configured-plugin-installs-Bz2PKocR.mjs");
	const { note } = await import("./terminal-core/note.js");
	const { VERSION } = await import("./version-ATx9WpZZ.mjs");
	const result = await maybeRunConfiguredPluginInstallReleaseStep({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		touchedVersion: ctx.configResult.sourceLastTouchedVersion ?? ctx.cfg.meta?.lastTouchedVersion
	});
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
	if (result.postInstallDoctorResult) ctx.postInstallDoctorResult = result.postInstallDoctorResult;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
	if (!result.touchedConfig) return;
	const lastTouchedVersion = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env) ? ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion || VERSION : VERSION;
	ctx.cfg = {
		...ctx.cfg,
		meta: {
			...ctx.cfg.meta,
			lastTouchedVersion
		}
	};
	writeConfigMachineState("config.lastTouchedAt", (/* @__PURE__ */ new Date()).toISOString());
}
async function runDiskSpaceHealth() {
	const { noteDiskSpace } = await import("./doctor-disk-space-TuUUAkaA.mjs");
	noteDiskSpace();
}
async function runDatabaseBloatHealth() {
	const { noteSqliteDatabaseBloat } = await import("./doctor-db-bloat-DusN4nn3.mjs");
	await noteSqliteDatabaseBloat();
}
async function runAgentMemorySchemaHealth(ctx) {
	const { noteDoctorAgentMemorySchemaHealth } = await import("./doctor-agent-memory-schema-Br6Q8Ske.mjs");
	await noteDoctorAgentMemorySchemaHealth({
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runChannelIngressDeadLettersHealth() {
	const { noteChannelIngressDeadLetters } = await import("./doctor-channel-ingress-Dbx3BvRn.mjs");
	noteChannelIngressDeadLetters();
}
async function runStateIntegrityHealth(ctx) {
	const { noteDoctorAgentDatabasePathHealth } = await import("./doctor-agent-database-paths-CQPr4u_D.mjs");
	const warnings = noteDoctorAgentDatabasePathHealth({
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
	if (warnings.length > 0) {
		ctx.updateWarnings ??= [];
		ctx.updateWarnings.push(...warnings);
	}
	const { noteStateIntegrity } = await loadDoctorStateIntegrityModule();
	await noteStateIntegrity(ctx.cfg, ctx.prompter, ctx.configPath, { stateDirExistedAtStart: ctx.stateDirExistedAtStart });
	await noteBackupDoctorHint(ctx.env ?? process.env);
	const { noteBackupScratchHealth } = await import("./doctor-backup-scratch-CM8iakdY.mjs");
	await noteBackupScratchHealth(ctx.env ?? process.env, ctx.prompter.shouldRepair);
}
async function runCodexSessionRouteHealth(ctx) {
	const { maybeRepairCodexSessionRoutes } = await import("./codex-route-warnings-IHoYqQpC.mjs");
	const { note } = await import("./terminal-core/note.js");
	const result = await maybeRepairCodexSessionRoutes({
		cfg: ctx.cfg,
		...ctx.configResult.retiredModelRefConfig ? { retiredModelRefConfig: ctx.configResult.retiredModelRefConfig } : {},
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {},
		...ctx.configResult.openAICodexAuthProfileIdMap?.size ? {
			authProfileIdMap: ctx.configResult.openAICodexAuthProfileIdMap,
			...!ctx.prompter.shouldRepair ? { authProfileOnly: true } : {}
		} : {}
	});
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runSessionTranscriptsHealth(ctx) {
	const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-DOHoCmMx.mjs");
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
	const { noteSessionTranscriptHeaderHealth } = await import("./doctor-session-transcript-headers-B_2YsVfv.mjs");
	await noteSessionTranscriptHeaderHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionTranscriptLabelsHealth(ctx) {
	const { noteSessionTranscriptLabelHealth } = await import("./doctor-session-transcript-labels-BiL5p7Zu.mjs");
	await noteSessionTranscriptLabelHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionSnapshotsHealth(ctx) {
	const { noteSessionSnapshotHealth } = await import("./doctor-session-snapshots-RA0_EGqt.mjs");
	await noteSessionSnapshotHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runConfigAuditScrubHealth(ctx) {
	const { maybeRepairLegacyRuntimeFiles } = await import("./doctor-usage-cost-cache-CpET1LM5.mjs");
	await maybeRepairLegacyRuntimeFiles(ctx.prompter.shouldRepair, ctx.env);
}
async function runLegacyCronHealth(ctx) {
	const { maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck } = await import("./cron-DKUv7QnP.mjs");
	await noteLegacyWhatsAppCrontabHealthCheck();
	await maybeRepairLegacyCronStore({
		cfg: ctx.cfg,
		options: ctx.options,
		prompter: ctx.prompter
	});
}
async function runSandboxHealth(ctx) {
	const { maybeRepairSandboxImages, maybeRepairSandboxRegistryFiles, noteSandboxScopeWarnings } = await import("./doctor-sandbox-BpYyIYpd.mjs");
	await maybeRepairSandboxRegistryFiles(ctx.prompter);
	ctx.cfg = await maybeRepairSandboxImages(ctx.cfg, ctx.runtime, ctx.prompter);
	noteSandboxScopeWarnings(ctx.cfg);
}
//#endregion
//#region src/flows/doctor-health-contributions-initial.ts
function legacyOwnedRepair(collectEffects, reason) {
	return async (ctx) => {
		const effects = await collectEffects(ctx);
		return ctx.dryRun === true ? {
			status: "repaired",
			changes: [],
			effects
		} : {
			status: "skipped",
			reason,
			changes: [],
			effects
		};
	};
}
async function runStaleRuntimeBuildHealth(ctx) {
	const { runCoreContributionHealth } = await import("./doctor-health-contribution-core-gMhNuTTI.mjs");
	await runCoreContributionHealth(ctx, ["core/doctor/stale-runtime-build"]);
}
async function runTelegramGeneralTopicConversationHealth(ctx) {
	const { runCoreContributionHealth } = await import("./doctor-health-contribution-core-gMhNuTTI.mjs");
	await runCoreContributionHealth(ctx, ["core/doctor/telegram-general-topic-conversations"]);
}
function resolveInitialDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution({
			id: "doctor:write-config-migrations",
			label: "Write config migrations",
			required: true,
			run: runInitialConfigWriteHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:agent-database-admission",
			label: "Agent database admission",
			healthChecks: {
				description: "Agent databases with mismatched ownership are isolated until repaired.",
				async detect(ctx) {
					const { evaluateAgentDatabaseAdmissions } = await import("./agent-database-admission-9YJceL-Q.mjs");
					return (ctx.agentDatabaseRefusals ?? await evaluateAgentDatabaseAdmissions(ctx.cfg, { env: ctx.env })).map((refusal) => ({
						checkId: "core/doctor/agent-database-admission",
						severity: "warning",
						target: refusal.agentId,
						requirement: refusal.code,
						message: `Agent ${refusal.agentId} is degraded. ${refusal.reason}`,
						fixHint: refusal.repairHint
					}));
				}
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:node-runtime",
			label: "Node runtime",
			healthCheckIds: ["core/doctor/node-runtime"],
			async run(ctx) {
				const { runCoreHealthFindingNote } = await import("./doctor-health-contribution-core-gMhNuTTI.mjs");
				await runCoreHealthFindingNote(ctx, "core/doctor/node-runtime");
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-config",
			label: "Gateway config",
			healthCheckIds: ["core/doctor/gateway-config"],
			run: params.runGatewayConfigHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:auth-profile-migration",
			label: "Auth profile migration",
			updateWork: { kind: "startup" },
			run: params.runAuthProfileMigration
		}),
		createDoctorHealthContribution({
			id: "doctor:auth-profiles",
			label: "Auth profiles",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Auth profile cooldown, expiry, missing credential, and legacy override state",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectAuthProfileHealthFindings } = await import("./doctor-auth-C16yLKGD.mjs");
					return collectAuthProfileHealthFindings({
						cfg: ctx.cfg,
						allowKeychainPrompt: false
					});
				}
			},
			run: params.runAuthProfileHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:claude-cli",
			label: "Claude CLI",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthCheckIds: ["core/doctor/claude-cli"],
			run: runClaudeCliHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-auth",
			label: "Gateway auth",
			healthCheckIds: ["core/doctor/gateway-auth"],
			run: params.runGatewayAuthHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:node-hosting-preconditions",
			label: "Node hosting preconditions",
			healthChecks: {
				description: "Gateway config can authenticate and onboard node and worker hosts.",
				async detect(ctx) {
					const { collectNodeHostingPreconditionFindings } = await import("./doctor-node-hosting-preconditions-BArdI81J.mjs");
					return collectNodeHostingPreconditionFindings(ctx.cfg);
				}
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:command-owner",
			label: "Command owner",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			healthCheckIds: ["core/doctor/command-owner"],
			run: runCommandOwnerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:structured-health-repairs",
			label: "Plugin health inspection and repair",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			run: params.runStructuredHealthRepairs
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-state",
			label: "Legacy state",
			healthCheckIds: ["core/doctor/legacy-state", "core/doctor/removed-workspaces-state"],
			run: params.runLegacyStateHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcripts",
			label: "Session transcripts",
			healthChecks: {
				description: "Legacy or branchy session transcript files are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToHealthFinding } = await import("./doctor-session-transcripts-DOHoCmMx.mjs");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToRepairEffect } = await import("./doctor-session-transcripts-DOHoCmMx.mjs");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToRepairEffect);
				}, "legacy doctor session transcript contribution owns transcript rewrites")
			},
			run: runSessionTranscriptsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:agent-memory-schema",
			label: "Agent memory schema",
			run: runAgentMemorySchemaHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-manifests",
			label: "Legacy plugin manifests",
			healthChecks: {
				description: "Legacy plugin manifest capability keys are reported as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectLegacyPluginManifestContractMigrations, legacyPluginManifestContractMigrationToHealthFinding } = await import("./doctor-plugin-manifests-Byr5bhcE.mjs");
					return collectLegacyPluginManifestContractMigrations({
						config: ctx.cfg,
						env: process.env
					}).map(legacyPluginManifestContractMigrationToHealthFinding);
				}
			},
			run: runLegacyPluginManifestHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-dependencies",
			label: "Legacy plugin dependencies",
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
		createDoctorHealthContribution({
			id: "doctor:stale-plugin-runtime-symlinks",
			label: "Stale plugin runtime symlinks",
			healthChecks: {
				description: "Stale plugin-runtime symlinks are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { collectStalePluginRuntimeSymlinkHealthFindings } = await import("./plugin-runtime-symlinks-DM9Rm0zN.mjs");
					return collectStalePluginRuntimeSymlinkHealthFindings();
				}
			},
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:release-configured-plugin-installs",
			label: "Configured plugin repair",
			healthChecks: {
				id: "core/doctor/configured-plugin-installs",
				description: "Configured plugin install records and package payloads are repairable.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToHealthFinding } = await import("./missing-configured-plugin-install-di9zPRI2.mjs");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToRepairEffect } = await import("./missing-configured-plugin-install-di9zPRI2.mjs");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToRepairEffect);
				}, "legacy doctor configured plugin install repair owns package mutation")
			},
			run: runReleaseConfiguredPluginInstallsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:plugin-registry",
			label: "Plugin registry",
			healthChecks: {
				description: "Plugin registry migration, stale shadow, and peer-link issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToHealthFinding } = await import("./doctor-plugin-registry-ajth92V0.mjs");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToRepairEffect } = await import("./doctor-plugin-registry-ajth92V0.mjs");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToRepairEffect);
				}, "legacy doctor plugin registry contribution owns registry repairs")
			},
			run: runPluginRegistryHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-source-captures",
			label: "Legacy plugin captures",
			updateWork: { kind: "startup" },
			run: runLegacyPluginSourceCapturesHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:ui-protocol-freshness",
			label: "UI protocol freshness",
			healthCheckIds: ["core/doctor/ui-protocol-freshness"],
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:stale-runtime-build",
			label: "Stale runtime build",
			healthCheckIds: ["core/doctor/stale-runtime-build"],
			run: runStaleRuntimeBuildHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:disk-space",
			label: "Disk space",
			healthChecks: {
				description: "Low disk space around the OpenClaw state directory is a finding.",
				defaultEnabled: false,
				async detect() {
					const { collectDiskSpaceHealthFindings } = await import("./doctor-disk-space-TuUUAkaA.mjs");
					return collectDiskSpaceHealthFindings();
				}
			},
			run: runDiskSpaceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:project-clone-shape",
			label: "Project clones",
			updateWork: { kind: "standalone" },
			healthChecks: {
				description: "Partial and shallow registry-owned project clones need manual repair.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectProjectCloneShapeHealthFindings } = await import("./doctor-project-clone-shape-Bo9956wI.mjs");
					return await collectProjectCloneShapeHealthFindings(ctx.cfg);
				}
			},
			async run(ctx) {
				const { noteProjectCloneShape } = await import("./doctor-project-clone-shape-Bo9956wI.mjs");
				await noteProjectCloneShape(ctx.cfg);
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:db-bloat",
			label: "SQLite database size",
			updateWork: { kind: "standalone" },
			run: runDatabaseBloatHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:channel-ingress-dead-letters",
			label: "Channel ingress dead letters",
			updateWork: {
				kind: "inspection",
				scope: "run"
			},
			run: runChannelIngressDeadLettersHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:state-integrity",
			label: "State integrity",
			healthChecks: {
				description: "State directory, config permission, and runtime state issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToHealthFinding } = await import("./doctor-state-integrity-BfdWURyl.mjs");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: ctx.env ?? process.env
					}).map(stateIntegrityIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToRepairEffect } = await import("./doctor-state-integrity-BfdWURyl.mjs");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: ctx.env ?? process.env
					}).map(stateIntegrityIssueToRepairEffect);
				}, "legacy doctor state integrity contribution owns state repairs")
			},
			run: runStateIntegrityHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:codex-session-routes",
			label: "Codex session routes",
			healthCheckIds: ["core/doctor/codex-session-routes"],
			run: runCodexSessionRouteHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:telegram-general-topic-conversations",
			label: "Telegram General-topic conversations",
			healthCheckIds: ["core/doctor/telegram-general-topic-conversations"],
			run: runTelegramGeneralTopicConversationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcript-headers",
			label: "Session transcript headers",
			run: runSessionTranscriptHeadersHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcript-labels",
			label: "Session transcript labels",
			run: runSessionTranscriptLabelsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-snapshots",
			label: "Session snapshots",
			updateWork: {
				kind: "inspection",
				scope: "agent"
			},
			healthChecks: {
				description: "Stale cached session snapshot paths are represented as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToHealthFinding } = await import("./doctor-session-snapshots-RA0_EGqt.mjs");
					return (await detectSessionSnapshotHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(sessionSnapshotIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToRepairEffect } = await import("./doctor-session-snapshots-RA0_EGqt.mjs");
					return (await detectSessionSnapshotHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(sessionSnapshotIssueToRepairEffect);
				}, "legacy doctor session snapshot contribution owns snapshot rewrites")
			},
			run: runSessionSnapshotsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:config-audit-scrub",
			label: "Config audit",
			healthChecks: {
				description: "Historical config-audit argv redaction gaps are represented as structured findings.",
				defaultEnabled: false,
				async detect() {
					const { configAuditScrubToHealthFinding, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-DO254wYt.mjs");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToHealthFinding(result)] : [];
				},
				repair: legacyOwnedRepair(async () => {
					const { configAuditScrubToRepairEffect, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-DO254wYt.mjs");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToRepairEffect(result)] : [];
				}, "legacy doctor config audit contribution owns cleanup")
			},
			run: runConfigAuditScrubHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-cron",
			label: "Legacy cron",
			healthCheckIds: ["core/doctor/legacy-whatsapp-crontab", "core/doctor/legacy-cron-store"],
			run: runLegacyCronHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:sandbox",
			label: "Sandbox",
			healthChecks: {
				id: "core/doctor/sandbox/registry-files",
				description: "Legacy sandbox registry files are represented in SQLite registry storage.",
				async detect() {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToHealthFinding } = await import("./doctor-sandbox-BpYyIYpd.mjs");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToRepairEffect } = await import("./doctor-sandbox-BpYyIYpd.mjs");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToRepairEffect);
				}, "legacy doctor sandbox contribution owns registry migration")
			},
			run: runSandboxHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contributions.ts
const loadCommandFormatModule = async () => await import("./command-format-BWFOOPTU.mjs");
const loadNoteModule = async () => await import("./terminal-core/note.js");
const loadOnboardHelpersModule = async () => await import("./onboard-helpers-Bs3xm5rG.mjs");
const loadSecretTypesModule = async () => await import("./types.secrets-DieHS7xT.mjs");
const MAX_DEFERRED_LEGACY_STATE_DETAILS = 20;
async function reportDeferredLegacyState(ctx) {
	if (ctx.options.repair !== true && ctx.options.yes !== true) return;
	const [{ detectLegacyStateMigrations }, { prepareLegacySessionSurfaces }] = await Promise.all([import("./state-migrations.doctor-xlBT7F2D.mjs"), import("./legacy-session-surfaces--zzIt7mK.mjs")]);
	const legacyState = await detectLegacyStateMigrations({
		cfg: ctx.cfg,
		doctorOnlyStateMigrations: true,
		...ctx.env ? { env: ctx.env } : {},
		legacySessionSurfaces: prepareLegacySessionSurfaces({ config: ctx.cfg })
	});
	const pendingDetails = [...legacyState.warnings.map((warning) => warning.startsWith("- ") ? warning : `- ${warning}`), ...legacyState.preview];
	if (pendingDetails.length === 0) return;
	const { note } = await loadNoteModule();
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
	const { formatCliCommand } = await loadCommandFormatModule();
	const { hasAmbiguousGatewayAuthModeConfig } = await import("./auth-mode-policy-CqbXjw5e.mjs");
	const { note } = await loadNoteModule();
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
	const { detectGatewayAuthHealth } = await import("./doctor-gateway-auth-BryneMCM.mjs");
	const [finding] = await detectGatewayAuthHealth({
		cfg: ctx.cfg,
		env: ctx.env,
		allowExecSecretRefs: ctx.options.allowExec
	});
	const { resolveSecretInputRef } = await loadSecretTypesModule();
	const { note } = await loadNoteModule();
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
			const { readSecretStoreValue, writeSecretStoreEntryWithRollback } = await import("./secret-store-BYFWlksY.mjs");
			const { createVerifiedSqliteSnapshot } = await import("./sqlite-snapshot-D-OIQRA4.mjs");
			const { resolveOpenClawStateSqlitePath } = await import("./openclaw-state-db.paths-_PY4_faP.mjs");
			const { randomToken } = await loadOnboardHelpersModule();
			const database = { env: ctx.env ?? process.env };
			const entry = {
				scope: { kind: "team" },
				name: gatewayTokenRef.id,
				database
			};
			let rollback;
			try {
				const current = readSecretStoreValue(entry);
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
				({rollback} = writeSecretStoreEntryWithRollback({
					...entry,
					value: nextToken,
					expectedValue: current.value,
					kind: "secret",
					updatedBy: "doctor"
				}));
				const repaired = readSecretStoreValue(entry);
				if (!repaired.ok || repaired.value !== nextToken) throw new Error("the replacement token could not be verified");
				rollback = void 0;
				note(`Regenerated Gateway token in secret store entry "${entry.name}"; gateway.auth.token remains a SecretRef. Backup: ${backup.path}\nRestart the Gateway, then reconnect or re-pair devices with the new token.`, "Gateway auth");
			} catch (error) {
				let recovery = "";
				try {
					if (rollback) recovery = rollback() ? " The previous entry was restored." : " The entry changed again and was left untouched.";
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
	const { randomToken } = await loadOnboardHelpersModule();
	const nextToken = randomToken();
	ctx.cfg = {
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
	note("Gateway token configured.", "Gateway auth");
}
async function runLegacyStateHealth(ctx) {
	const { detectLegacyStateMigrations, runLegacyStateMigrations } = await import("./state-migrations.doctor-xlBT7F2D.mjs");
	const { note } = await loadNoteModule();
	await runCoreContributionHealth(ctx, ["core/doctor/removed-workspaces-state"]);
	const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces--zzIt7mK.mjs");
	const legacySessionSurfaces = prepareLegacySessionSurfaces({ config: ctx.cfg });
	const doctorOnlyStateMigrations = ctx.options.repair === true || ctx.options.yes === true;
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
				recoverCorruptTargetStore: ctx.options.repair === true || ctx.options.yes === true,
				legacySessionSurfaces
			});
			recordDoctorHealthWarnings(ctx, [], migrated.stepReceipts.flatMap((receipt) => receipt.outcome === "warning" || receipt.outcome === "deferred" ? receipt.warnings : []));
			if (migrated.changes.length > 0) note(migrated.changes.join("\n"), "Doctor changes");
			const notices = migrated.notices ?? [];
			if (notices.length > 0) note(notices.join("\n"), "Doctor notices");
			if (migrated.warnings.length > 0) note(migrated.warnings.join("\n"), "Doctor warnings");
		}
	}
	if (!doctorOnlyStateMigrations) return;
	const { repairObsoleteGeneratedExecApprovals } = await import("./exec-approvals-generated-migration-B9XH3EZS.mjs");
	const { ExecApprovalsMigrationRequiredError } = await import("./exec-approvals-migration-gate-BiILHzF9.mjs");
	let removedExecApprovals;
	try {
		removedExecApprovals = repairObsoleteGeneratedExecApprovals();
	} catch (error) {
		if (error instanceof ExecApprovalsMigrationRequiredError) return;
		throw error;
	}
	if (removedExecApprovals > 0) note(`Exec approvals updated: removed ${removedExecApprovals} older generated ${removedExecApprovals === 1 ? "approval" : "approvals"} that were not tied to a working directory. Manual allowlist rules were not changed. Rerun affected workflows and choose "Always allow here" when prompted.`, "Doctor changes");
}
async function hasUserScopedSystemdGatewayService(env) {
	const { findInstalledSystemdGatewayScope } = await import("./systemd-Dwmu25L4.mjs");
	return (await findInstalledSystemdGatewayScope(env))?.scope === "user";
}
async function runSystemdLingerHealth(ctx) {
	if (ctx.options.nonInteractive === true || process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local" || !await shouldManageGatewayService(ctx.env ?? process.env) || !await hasUserScopedSystemdGatewayService(ctx.env ?? process.env)) return;
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CZPrn7FT.mjs");
	const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-Br0q2pO3.mjs");
	const { note } = await loadNoteModule();
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
	if (process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local" || !await shouldManageGatewayService(ctx.env ?? process.env) || !await hasUserScopedSystemdGatewayService(ctx.env ?? process.env)) return [];
	const { readGatewayServiceState, resolveGatewayService } = await import("./service-CZPrn7FT.mjs");
	if ((await readGatewayServiceState(resolveGatewayService(), { env: process.env })).loadState.status !== "loaded") return [];
	const { isSystemdUserServiceAvailable, readSystemdUserLingerStatus, resolveSystemdUserServiceAccount } = await import("./systemd-Dwmu25L4.mjs");
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
	const { doctorShellCompletion } = await import("./doctor-completion-DROMprJZ.mjs");
	await doctorShellCompletion(ctx.prompter, { nonInteractive: ctx.options.nonInteractive });
}
async function runGatewayHealthChecks(ctx) {
	const { note } = await loadNoteModule();
	if (ctx.gatewayMaintenanceActive) {
		note("Gateway health will be checked after Doctor repair.", "Gateway");
		ctx.gatewayHealthSkipped = true;
		ctx.gatewayMemoryProbe = {
			checked: false,
			ready: false,
			skipped: true
		};
		return;
	}
	if (await hasActiveGatewayExecCredential(ctx) && ctx.options.allowExec !== true) {
		note("Gateway health probes skipped because gateway credentials use an exec SecretRef. Run `openclaw doctor --allow-exec` to verify Gateway health with exec SecretRefs.", "Gateway");
		ctx.gatewayHealthSkipped = true;
		ctx.gatewayMemoryProbe = {
			checked: false,
			ready: false,
			skipped: true
		};
		return;
	}
	const { checkGatewayHealth, probeGatewayMemoryStatus } = await import("./doctor-gateway-health-CEEtJ5UT.mjs");
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
async function resolveDoctorContributionHealthChecks() {
	const { createCoreHealthChecks } = await import("./doctor-core-checks-qVEm1JDw.mjs");
	const checksById = new Map(createCoreHealthChecks().map((check) => [check.id, check]));
	const checks = [];
	for (const contribution of resolveDoctorHealthContributions()) {
		if (contribution.healthChecks.length > 0) {
			checks.push(...contribution.healthChecks.map((check) => ({
				...normalizeHealthCheck(check),
				updateWork: contribution.updateWork
			})));
			continue;
		}
		for (const id of contribution.healthCheckIds) {
			const check = checksById.get(id);
			if (check === void 0) throw new Error(`doctor contribution ${contribution.id} references unknown core health check ${id}`);
			checks.push({
				...check,
				updateWork: contribution.updateWork
			});
		}
	}
	return checks;
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
	const deferred = updateDoctorRun ? contributions.filter((contribution) => contribution.updateWork?.kind === "standalone") : [];
	if (deferred.length > 0) {
		const { note } = await loadNoteModule();
		note(`Omitted during update: ${deferred.map((contribution) => contribution.option.label).join(", ")}.\nRun \`openclaw doctor\` after the update to inspect these diagnostics.`, "Update Doctor scope");
	}
	const ordered = ctx.updateBudget ? [
		...contributions.filter((entry) => entry.updateWork === void 0 || entry.updateWork.kind === "startup" || entry.updateWork.kind === "standalone"),
		...contributions.filter((entry) => entry.updateWork?.kind === "inspection"),
		...contributions.filter((entry) => entry.updateWork?.kind === "finalize")
	] : contributions;
	try {
		for (const contribution of ordered) {
			if (updateDoctorRun && contribution.updateWork?.kind === "standalone") continue;
			if (contribution.updateWork?.kind === "inspection" && !admitDoctorUpdateInspection(ctx.updateBudget, contribution.updateWork.scope, (contribution.healthCheckIds.length ? contribution.healthCheckIds : [`core/doctor/${contribution.id.replace(/^doctor:/, "")}`]).map((id) => ({
				id,
				label: contribution.option.label
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
				if (!runWithPluginMetadataSnapshot) await run();
				else {
					const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
					await runWithPluginMetadataSnapshot({
						config: ctx.cfg,
						workspaceDir
					}, run);
				}
				if (ctx.configWriteRefusal) return;
			} catch (error) {
				if (contribution.required || error instanceof DoctorStateMigrationRefusalError || error instanceof ConfigWritePostCommitError) throw error;
				const { note } = await loadNoteModule();
				const message = `${contribution.id} run failed: ${scrubDoctorErrorMessage(error)}`;
				note(message, "Doctor warnings");
				recordDoctorHealthWarnings(ctx, [], [message]);
			}
		}
	} finally {
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
