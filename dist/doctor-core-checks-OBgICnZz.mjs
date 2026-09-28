import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { E as listAgentEntries, M as tryResolveSoleAgentId, O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, o as isDefaultInstallIdentity } from "./paths-DehQwyE0.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as hasAmbiguousGatewayAuthModeConfig } from "./auth-mode-policy-CfUfLe1u.mjs";
import { a as shellCompletionStatusToRepairEffects, i as shellCompletionStatusToHealthFindings, t as checkShellCompletionStatus } from "./doctor-completion-shHFSS_8.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-CYRu5kQ6.mjs";
import { r as hasConfiguredCommandOwners } from "./doctor-command-owner-C0KlUKKP.mjs";
import { n as configValidationIssuesToHealthFindings, r as configValidationWarningsToHealthFindings, t as FINAL_CONFIG_VALIDATION_CHECK_ID } from "./doctor-config-validation-findings-C_Hn54WY.mjs";
import { t as detectSkillWorkshopToolPolicyDiagnostic } from "./tool-policy-diagnostic-CAb76869.mjs";
import { i as noteChromeMcpBrowserReadiness, n as maybeArchiveLegacyClawdBrowserProfileResidue, r as maybeRepairOwnedChromeExtensionNativeHosts, t as detectLegacyClawdBrowserProfileResidue } from "./doctor-browser-C8tmlGx0.mjs";
import { t as hasActiveGatewayExecCredential } from "./doctor-gateway-exec-credential-B1VJk7ba.mjs";
import { n as disableUnavailableSkillsInConfig, r as formatMissingSkillSummary } from "./doctor-skills-core-DZQVCoNO.mjs";
import { i as uiProtocolFreshnessIssueToRepairEffects, r as uiProtocolFreshnessIssueToHealthFinding, t as detectUiProtocolFreshnessIssues } from "./doctor-ui-D3E951Oy.mjs";
import { i as resolveKnownModelRefMigrationTarget, n as collectCodexRuntimeCompatibilityWarnings, o as collectDisabledCodexPluginRouteIssues } from "./codex-route-warnings-D0xKh2dA.mjs";
import { t as detectGatewayAuthHealth } from "./doctor-gateway-auth-BV8IRkVw.mjs";
import { t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-B2wDiBjA.mjs";
import { r as securityAuditFindingToHealthFinding, t as copyHealthCheck } from "./health-check-adapter-BrC920MN.mjs";
import path from "node:path";
import { lstat, realpath, rm } from "node:fs/promises";
//#region src/flows/doctor-config-validation-check.ts
const finalConfigValidationCheck = {
	id: FINAL_CONFIG_VALIDATION_CHECK_ID,
	updateReadiness: "post-plugin",
	kind: "core",
	description: "Active openclaw.jsonc parses and conforms to the config schema.",
	source: "doctor",
	async detect(ctx) {
		let snap = ctx.mode === "lint" ? ctx.lintConfigSnapshot : void 0;
		if (!snap) {
			const { readConfigFileSnapshot } = await import("./config/config.js");
			snap = await readConfigFileSnapshot({ observe: false });
		}
		if (!snap.exists) return [];
		return [...configValidationIssuesToHealthFindings(snap.issues), ...configValidationWarningsToHealthFindings(snap.warnings)];
	}
};
//#endregion
//#region src/flows/doctor-removed-workspaces-state-check.ts
const CHECK_ID = "core/doctor/removed-workspaces-state";
function resolveRemovedWorkspacesStateDir() {
	return path.join(resolveStateDir(process.env), "workspaces");
}
async function pathKind(target) {
	try {
		const stats = await lstat(target);
		if (stats.isDirectory()) return "directory";
		return stats.isFile() ? "file" : null;
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function hasRemovedWorkspacesFingerprint(target) {
	if (await pathKind(target) !== "directory") return false;
	if (await pathKind(path.join(target, "workspaces.sqlite")) === "file") return true;
	const [widgetsKind, dataKind] = await Promise.all([pathKind(path.join(target, "widgets")), pathKind(path.join(target, "data"))]);
	return widgetsKind === "directory" && dataKind === "directory";
}
async function canonicalPath(target) {
	const resolved = path.resolve(target);
	try {
		return await realpath(resolved);
	} catch (error) {
		const code = error.code;
		if (code === "ENOENT" || code === "ENOTDIR") return resolved;
		throw error;
	}
}
async function configuredAgentWorkspaceCollisions(cfg, target) {
	const configured = [{
		label: "agents.defaults.workspace",
		workspace: cfg.agents?.defaults?.workspace
	}, ...listAgentEntries(cfg).map((agent) => ({
		label: `agents.list.${agent.id}.workspace`,
		workspace: agent.workspace
	}))];
	const resolvedTarget = await canonicalPath(target);
	return (await Promise.all(configured.filter((entry) => typeof entry.workspace === "string" && entry.workspace.trim().length > 0).map(async (entry) => ({
		label: entry.label,
		resolvedWorkspace: await canonicalPath(resolveUserPath(entry.workspace, process.env))
	})))).filter((entry) => isPathInside(resolvedTarget, entry.resolvedWorkspace) || isPathInside(entry.resolvedWorkspace, resolvedTarget)).map((entry) => entry.label);
}
function collisionWarning(target, collisions) {
	return `Retired Workspaces plugin fingerprints remain at ${target}, but ${collisions.join(", ")} resolves to that directory or an overlapping path. Automatic removal is disabled.`;
}
function repairEffect(target, dryRun) {
	return {
		kind: "state",
		action: dryRun ? "would-remove-retired-workspaces-state" : "remove-retired-workspaces-state",
		target,
		dryRunSafe: false
	};
}
const removedWorkspacesStateCheck = {
	id: CHECK_ID,
	kind: "core",
	description: "State from the retired experimental Workspaces plugin has been removed.",
	source: "doctor",
	async detect(ctx, scope) {
		const target = resolveRemovedWorkspacesStateDir();
		const scopedPaths = new Set(scope?.paths ?? []);
		if (scopedPaths.size > 0 && !scopedPaths.has(target) || !await hasRemovedWorkspacesFingerprint(target)) return [];
		const collisions = await configuredAgentWorkspaceCollisions(ctx.cfg, target);
		if (collisions.length > 0) return [{
			checkId: CHECK_ID,
			severity: "warning",
			message: collisionWarning(target, collisions),
			path: target
		}];
		return [{
			checkId: CHECK_ID,
			severity: "warning",
			message: `Retired Workspaces plugin state remains at ${target}.`,
			path: target,
			fixHint: "Run `openclaw doctor --fix` to remove the stale plugin state."
		}];
	},
	async repair(ctx) {
		const target = resolveRemovedWorkspacesStateDir();
		if (!await hasRemovedWorkspacesFingerprint(target)) return {
			status: "skipped",
			reason: "retired Workspaces plugin fingerprints are absent",
			changes: []
		};
		const collisions = await configuredAgentWorkspaceCollisions(ctx.cfg, target);
		if (collisions.length > 0) {
			const warning = collisionWarning(target, collisions);
			return {
				status: "skipped",
				reason: warning,
				changes: [],
				warnings: [warning]
			};
		}
		const dryRun = ctx.dryRun === true;
		const effects = [repairEffect(target, dryRun)];
		if (dryRun) return {
			changes: [`Would remove retired Workspaces plugin state at ${target}.`],
			effects
		};
		await rm(target, {
			force: true,
			recursive: true
		});
		return {
			changes: [`Removed retired Workspaces plugin state at ${target}.`],
			effects
		};
	}
};
//#endregion
//#region src/flows/doctor-tool-schema-check.ts
async function collectRuntimeToolSchemaFindingsWithRuntime(ctx) {
	const runtime = await import("./doctor-tool-schema-runtime-DoRcwInC.mjs");
	const { runWithPluginMetadataSnapshot, deferInspectionDisposal } = ctx;
	return runtime.collectRuntimeToolSchemaFindings(ctx.cfg, {
		mode: ctx.mode,
		env: ctx.env,
		...runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot } : {},
		...deferInspectionDisposal ? { deferInspectionDisposal } : {}
	});
}
function createRuntimeToolSchemaCheck(deps) {
	return {
		id: "core/doctor/runtime-tool-schemas",
		kind: "core",
		description: "Active agent tool schemas project into model/runtime-compatible tool inputs.",
		source: "doctor",
		async detect(ctx) {
			return deps.collectRuntimeToolSchemaFindings(ctx);
		}
	};
}
//#endregion
//#region src/flows/doctor-core-checks.ts
const BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID = "core/doctor/browser-clawd-profile-residue";
const CODEX_SESSION_ROUTES_CHECK_ID = "core/doctor/codex-session-routes";
const GATEWAY_DAEMON_CHECK_ID = "core/doctor/gateway-daemon";
const GATEWAY_HEALTH_CHECK_ID = "core/doctor/gateway-health";
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
const TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID = "core/doctor/telegram-general-topic-conversations";
const SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID = "core/doctor/skill-workshop-tool-policy";
const SKILL_WORKSHOP_RELOCATION_CHECK_ID = "core/doctor/skill-workshop-relocation";
const loadDoctorCoreChecksRuntimeModule = async () => await import("./doctor-core-checks.runtime.js");
const loadDoctorWorkspaceModule = async () => await import("./doctor-workspace-6cPem3kK.mjs");
async function detectUnavailableSkillsWithRuntime(ctx) {
	const runtime = await loadDoctorCoreChecksRuntimeModule();
	return ctx.cwd ? runtime.detectUnavailableSkills(ctx.cfg, ctx.cwd) : [];
}
async function collectSecurityWarningsWithRuntime(cfg, env) {
	const { collectSecurityWarnings } = await import("./doctor-security-D98B-Cnj.mjs");
	return collectSecurityWarnings(cfg, env);
}
async function collectWorkspaceSuggestionNotesWithRuntime(workspaceDir) {
	const { collectWorkspaceBackupTip } = await import("./doctor-state-integrity-DDlTMUk3.mjs");
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await loadDoctorWorkspaceModule();
	const notes = [];
	const backupTip = collectWorkspaceBackupTip(workspaceDir);
	if (backupTip) notes.push(backupTip);
	if (await shouldSuggestMemorySystem(workspaceDir)) notes.push(MEMORY_SYSTEM_PROMPT);
	return notes;
}
async function collectProviderCatalogProjectionFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectProviderCatalogProjectionFindings(ctx.cfg, ctx.cwd);
}
async function collectLocalAudioAccelerationFindingsWithRuntime() {
	return (await loadDoctorCoreChecksRuntimeModule()).collectLocalAudioAccelerationFindings();
}
async function collectGatewayHealthFindingsWithRuntime(ctx) {
	return (await import("./doctor-gateway-health-lvRAqbec.mjs")).collectGatewayHealthFindings(ctx);
}
async function collectGatewayDaemonFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectGatewayDaemonFindings(ctx);
}
async function listGatewayCronJobsWithRuntime(ctx) {
	const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-DdV5mpN0.mjs");
	const requestGateway = bindAgentToolGatewayRequest({ hostedOnly: true });
	if (await hasActiveGatewayExecCredential({ cfg: ctx.cfg }) && ctx.allowExecSecretRefs !== true) throw new Error("Gateway cron inventory skipped because credentials use an exec SecretRef; rerun doctor with --allow-exec.");
	const jobs = [];
	let offset = 0;
	let snapshotRevision;
	let total;
	while (total === void 0 || offset < total) {
		const page = await requestGateway({
			method: "cron.list",
			params: {
				includeDisabled: true,
				limit: 200,
				offset
			},
			timeoutMs: 3e3,
			config: ctx.cfg,
			deviceIdentity: null
		});
		if (!(Array.isArray(page.jobs) && typeof page.snapshotRevision === "string" && page.snapshotRevision.length > 0 && Number.isSafeInteger(page.total) && page.total >= 0 && page.offset === offset && Number.isSafeInteger(page.limit) && page.limit > 0 && typeof page.hasMore === "boolean" && (page.nextOffset === null || Number.isSafeInteger(page.nextOffset)))) throw new Error("Gateway returned an invalid cron inventory response.");
		if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) throw new Error("Gateway cron inventory changed while doctor was reading it.");
		snapshotRevision ??= page.snapshotRevision;
		total ??= page.total;
		jobs.push(...page.jobs);
		if (!page.hasMore) {
			if (page.nextOffset !== null || jobs.length !== total) throw new Error("Gateway returned an inconsistent cron inventory response.");
			return jobs;
		}
		const expectedNextOffset = offset + page.jobs.length;
		if (page.nextOffset !== expectedNextOffset || expectedNextOffset <= offset || expectedNextOffset >= total) throw new Error("Gateway returned an invalid cron inventory cursor.");
		offset = expectedNextOffset;
	}
	throw new Error("Gateway returned an incomplete cron inventory response.");
}
const defaultCoreHealthCheckDeps = {
	detectUnavailableSkills: detectUnavailableSkillsWithRuntime,
	collectSecurityWarnings: collectSecurityWarningsWithRuntime,
	collectWorkspaceSuggestionNotes: collectWorkspaceSuggestionNotesWithRuntime,
	collectRuntimeToolSchemaFindings: collectRuntimeToolSchemaFindingsWithRuntime,
	collectProviderCatalogProjectionFindings: collectProviderCatalogProjectionFindingsWithRuntime,
	collectLocalAudioAccelerationFindings: collectLocalAudioAccelerationFindingsWithRuntime,
	collectGatewayHealthFindings: collectGatewayHealthFindingsWithRuntime,
	collectGatewayDaemonFindings: collectGatewayDaemonFindingsWithRuntime,
	listGatewayCronJobs: listGatewayCronJobsWithRuntime
};
const gatewayConfigCheck = {
	id: "core/doctor/gateway-config",
	kind: "core",
	description: "openclaw.jsonc gateway block is set and unambiguous.",
	source: "doctor",
	async detect(ctx) {
		const findings = [];
		if (!ctx.cfg.gateway?.mode) findings.push({
			checkId: "core/doctor/gateway-config",
			severity: "warning",
			message: "gateway.mode is unset; gateway start will be blocked.",
			path: "gateway.mode",
			fixHint: "Run `openclaw configure` and set Gateway mode (local/remote), or `openclaw config set gateway.mode local`."
		});
		if (ctx.cfg.gateway?.mode !== "remote" && hasAmbiguousGatewayAuthModeConfig(ctx.cfg)) findings.push({
			checkId: "core/doctor/gateway-config",
			severity: "warning",
			message: "gateway.auth.token and gateway.auth.password are both configured while gateway.auth.mode is unset; auth selection is ambiguous.",
			path: "gateway.auth.mode",
			fixHint: "Set an explicit mode: `openclaw config set gateway.auth.mode token` or `... password`."
		});
		return findings;
	}
};
const commandOwnerCheck = {
	id: "core/doctor/command-owner",
	kind: "core",
	description: "An owner account is configured for owner-only commands.",
	source: "doctor",
	async detect(ctx) {
		if (hasConfiguredCommandOwners(ctx.cfg)) return [];
		return [{
			checkId: "core/doctor/command-owner",
			severity: "info",
			message: "No command owner is configured. Owner-only commands (/diagnostics, /export-trajectory, /config, exec approvals) have no allowed sender.",
			path: "commands.ownerAllowFrom",
			fixHint: "Set commands.ownerAllowFrom to your channel user id, e.g. `openclaw config set commands.ownerAllowFrom '[\"telegram:123456789\"]'`."
		}];
	}
};
const skillWorkshopToolPolicyCheck = {
	id: SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID,
	kind: "core",
	description: "Autonomous Skill Workshop capture has a callable review tool.",
	source: "doctor",
	async detect(ctx) {
		const workshopEnabled = resolveSkillWorkshopConfig(ctx.cfg).autonomous.mode !== "off";
		const listedAgentIds = listAgentIds(ctx.cfg);
		return (listedAgentIds.length > 0 ? listedAgentIds : [void 0]).flatMap((agentId) => {
			const diagnostic = detectSkillWorkshopToolPolicyDiagnostic({
				config: ctx.cfg,
				workshopEnabled,
				...agentId ? { agentId } : {}
			});
			return diagnostic ? [diagnostic] : [];
		}).map((diagnostic) => ({
			checkId: SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID,
			severity: "warning",
			message: diagnostic.detail,
			path: diagnostic.source,
			target: diagnostic.agentId,
			requirement: "Autonomous Skill Workshop review requires the skill_workshop tool.",
			fixHint: diagnostic.fix
		}));
	}
};
const skillWorkshopRelocationCheck = {
	id: SKILL_WORKSHOP_RELOCATION_CHECK_ID,
	kind: "core",
	description: "Skill Workshop files and proposals use each agent's Workshop directory.",
	source: "doctor",
	async detect(ctx) {
		const { inspectLegacySkillWorkshopMigration } = await import("./doctor-skill-workshop-sqlite-q_gVjCyQ.mjs");
		const inspection = await inspectLegacySkillWorkshopMigration({
			config: ctx.cfg,
			env: ctx.env,
			stateEnv: process.env
		});
		const automationFindings = (inspection.automationReferences ?? []).map((reference) => ({
			checkId: SKILL_WORKSHOP_RELOCATION_CHECK_ID,
			severity: "warning",
			target: reference.automationId,
			path: reference.field,
			message: reference.message,
			fixHint: reference.fixHint
		}));
		if (inspection.externalProposalCount === 0 && inspection.legacyBackupRootCount === 0) return automationFindings;
		const fixHints = [];
		if (inspection.externalProposalCount > 0 || inspection.legacyBackupRootCount > inspection.preservedLegacyBackupRootCount) fixHints.push(ctx.mode === "doctor" ? "If Workshop repair has not run, use `openclaw doctor --fix`. Otherwise review the remaining targets and migration warnings above. Resolve their ownership or recovery blockers before retrying Doctor; repeating the same repair alone will not resolve them." : "Run `openclaw doctor --fix` to process eligible Workshop relocations and legacy collection backups.");
		if (inspection.preservedLegacyBackupRootCount > 0) fixHints.push("Preserved roots need manual review of workspace ownership, backup manifests, and workspace migration blockers; Doctor leaves them untouched until resolved. Do not delete backups to clear this warning.");
		return [...automationFindings, {
			checkId: SKILL_WORKSHOP_RELOCATION_CHECK_ID,
			severity: "warning",
			message: `Skill Workshop has ${inspection.externalProposalCount} proposal target${inspection.externalProposalCount === 1 ? "" : "s"} outside agent directories (${Object.entries(inspection.externalProposalCountsByAgent).map(([agentId, count]) => `${agentId}: ${count}`).join(", ")}) and ${inspection.legacyBackupRootCount} legacy collection backup root${inspection.legacyBackupRootCount === 1 ? "" : "s"} (${inspection.preservedLegacyBackupRootCount} preserved for review).${inspection.externalProposalDetails?.length ? `\nRemaining proposal targets (showing ${inspection.externalProposalDetails.length} of ${inspection.externalProposalCount}):\n${inspection.externalProposalDetails.join("\n")}` : ""}`,
			path: "skills.workshop",
			fixHint: fixHints.join(" ")
		}];
	}
};
const gatewayAuthCheck = {
	id: "core/doctor/gateway-auth",
	kind: "core",
	description: "Local Gateway auth mode has a usable token or another explicit auth mode.",
	source: "doctor",
	detect: detectGatewayAuthHealth
};
const hooksModelCheck = {
	id: "core/doctor/hooks-model",
	kind: "core",
	description: "hooks.gmail.model resolves to an allowed catalog model.",
	source: "doctor",
	async detect(ctx) {
		if (!ctx.cfg.hooks?.gmail?.model?.trim()) return [];
		const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-D-l0Kfsa.mjs");
		const { readPreparedModelCatalog } = await import("./prepared-model-catalog-CHKgcpJj.mjs");
		const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-ElLkT79C.mjs");
		const hooksModelRef = resolveHooksGmailModel({
			cfg: ctx.cfg,
			defaultProvider: DEFAULT_PROVIDER
		});
		if (!hooksModelRef) return [{
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${ctx.cfg.hooks.gmail.model}" could not be resolved.`,
			path: "hooks.gmail.model"
		}];
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
		const findings = [];
		if (!status.allowed) findings.push({
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${status.key}" is not allowed by agents.defaults.modelPolicy.allow.`,
			path: "hooks.gmail.model",
			fixHint: "Add the model or its provider wildcard to agents.defaults.modelPolicy.allow, or remove hooks.gmail.model."
		});
		if (!status.inCatalog) findings.push({
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${status.key}" is not in the model catalog.`,
			path: "hooks.gmail.model",
			fixHint: "Choose a model from the configured provider catalog."
		});
		return findings;
	}
};
const legacyStateCheck = {
	id: "core/doctor/legacy-state",
	kind: "core",
	description: "Legacy sessions, agent state, and channel auth paths have been migrated.",
	source: "doctor",
	defaultEnabled: false,
	async detect(ctx) {
		const { detectLegacyStateMigrations } = await import("./state-migrations.doctor-B8VFRySh.mjs");
		const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces-BplCg4st.mjs");
		const legacySessionSurfaces = prepareLegacySessionSurfaces({ config: ctx.cfg });
		const detected = await detectLegacyStateMigrations({
			cfg: ctx.cfg,
			doctorOnlyStateMigrations: true,
			legacySessionSurfaces
		});
		return [...detected.preview.map((line) => ({
			checkId: "core/doctor/legacy-state",
			severity: "warning",
			message: line.replace(/^- /, ""),
			path: detected.stateDir,
			fixHint: "Run `openclaw doctor --fix` to migrate legacy state."
		})), ...detected.warnings.map((warning) => ({
			checkId: "core/doctor/legacy-state",
			severity: "warning",
			message: warning,
			path: detected.stateDir,
			fixHint: "Resolve the warning, then rerun `openclaw doctor --fix`."
		}))];
	}
};
const bootstrapSizeCheck = {
	id: "core/doctor/bootstrap-size",
	kind: "core",
	description: "Workspace bootstrap files fit within configured injection limits.",
	source: "doctor",
	async detect(ctx) {
		if (!ctx.cwd) return [];
		const { buildBootstrapInjectionStats, analyzeBootstrapBudget, isFixedUserCapFile } = await import("./bootstrap-budget-8v7Cg1kH.mjs");
		const { resolveBootstrapContextForDiagnostics } = await import("./bootstrap-files-diagnostics-CBWnwNC7.mjs");
		const { resolveBootstrapMaxChars, resolveBootstrapTotalMaxChars } = await import("./embedded-agent-helpers-Bj7XYHxq.mjs");
		const { USER_BOOTSTRAP_MAX_CHARS } = await import("./bootstrap-DpfVAufQ.mjs");
		const defaultAgentId = tryResolveSoleAgentId(ctx.cfg);
		const workspaceDir = ctx.cwd;
		const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForDiagnostics({
			workspaceDir,
			config: ctx.cfg,
			agentId: defaultAgentId
		});
		const analysis = analyzeBootstrapBudget({
			files: buildBootstrapInjectionStats({
				bootstrapFiles,
				injectedFiles: contextFiles
			}),
			bootstrapMaxChars: resolveBootstrapMaxChars(ctx.cfg, defaultAgentId),
			bootstrapTotalMaxChars: resolveBootstrapTotalMaxChars(ctx.cfg, defaultAgentId)
		});
		const fixedCapHint = `Reduce the file size; USER.md has a fixed ${USER_BOOTSTRAP_MAX_CHARS.toLocaleString("en-US")}-character bootstrap cap that \`bootstrapMaxChars\` cannot raise.`;
		const findings = [];
		for (const file of analysis.truncatedFiles) {
			let fixHint = "Reduce the file size or tune `agents.entries.*.bootstrapMaxChars` / `bootstrapTotalMaxChars` for this agent, or the corresponding `agents.defaults.*` fallback.";
			if (file.causes.includes("per-file-limit") && isFixedUserCapFile(file)) {
				fixHint = fixedCapHint;
				if (file.causes.includes("total-limit")) fixHint += " Also reduce total bootstrap size or tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback.";
			}
			findings.push({
				checkId: "core/doctor/bootstrap-size",
				severity: "warning",
				message: `${file.name} exceeds bootstrap limits and will be truncated.`,
				path: file.path,
				fixHint
			});
		}
		for (const file of analysis.nearLimitFiles) {
			if (file.truncated) continue;
			findings.push({
				checkId: "core/doctor/bootstrap-size",
				severity: "info",
				message: `${file.name} is near the configured bootstrap file limit.`,
				path: file.path,
				fixHint: isFixedUserCapFile(file) ? fixedCapHint : "Reduce the file size or tune `agents.entries.*.bootstrapMaxChars` for this agent, or `agents.defaults.bootstrapMaxChars` as fallback, for per-file limits."
			});
		}
		if (analysis.totalNearLimit) findings.push({
			checkId: "core/doctor/bootstrap-size",
			severity: analysis.hasTruncation ? "warning" : "info",
			message: "Total bootstrap context is near the configured total limit.",
			path: workspaceDir,
			fixHint: "Reduce bootstrap file sizes or tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback."
		});
		return findings;
	}
};
function createProviderCatalogProjectionCheck(deps) {
	return {
		id: "core/doctor/provider-catalog-projection",
		kind: "core",
		description: "Provider catalog hooks project into unified text model catalog rows.",
		source: "doctor",
		async detect(ctx) {
			return deps.collectProviderCatalogProjectionFindings(ctx);
		}
	};
}
function createModelReferenceCheck() {
	return {
		id: "core/doctor/model-references",
		kind: "core",
		description: "Configured model references have installed or configured provider owners.",
		source: "doctor",
		async detect(ctx) {
			const { inspectConfiguredModelReferences } = await import("./model-reference-validation-Cpq9T09X.mjs");
			return inspectConfiguredModelReferences({
				cfg: ctx.cfg,
				env: ctx.env,
				workspaceDir: ctx.cwd
			}).flatMap((inspection) => {
				const migrationTarget = resolveKnownModelRefMigrationTarget(ctx.cfg, inspection.ref);
				const migrationFinding = migrationTarget ? {
					message: `Configured model "${inspection.ref}" is a legacy reference. Doctor can migrate it to "${migrationTarget}".`,
					requirement: `canonical model reference "${migrationTarget}"`,
					fixHint: `Run \`openclaw doctor --fix\` to migrate this model reference to "${migrationTarget}".`
				} : void 0;
				if (inspection.status === "unknown-provider") return [{
					checkId: "core/doctor/model-references",
					severity: "warning",
					source: "doctor",
					target: inspection.ref,
					...migrationFinding ?? {
						message: `Configured model "${inspection.ref}" uses unknown provider "${inspection.provider}". No installed plugin manifest or models.providers entry declares it.`,
						requirement: "an installed plugin manifest or models.providers configuration",
						fixHint: "Install a plugin that declares this provider, configure it under models.providers, or remove the model reference."
					}
				}];
				if (inspection.status === "uncatalogued-provider" && !migrationFinding) return [];
				if ((inspection.status === "unknown-model" || inspection.status === "uncatalogued-provider") && inspection.active) return [{
					checkId: "core/doctor/model-references",
					severity: "info",
					source: "doctor",
					target: inspection.ref,
					...migrationFinding ?? {
						message: `Configured model "${inspection.ref}" uses a known provider but is not in the local model catalog. It may be newly released or self-hosted.`,
						requirement: "a provider-supported model id",
						fixHint: "Verify the model id with the provider, or rerun with --severity-min info after refreshing the local catalog."
					}
				}];
				return [];
			});
		}
	};
}
function normalizeDoctorNoteLine(line) {
	return line.replace(/^- /, "").trim();
}
function noteTextToFinding(params) {
	const lines = params.text.split("\n");
	const first = normalizeDoctorNoteLine(lines[0] ?? params.text);
	const rest = lines.slice(1).join("\n");
	return {
		checkId: params.checkId,
		severity: params.severity,
		message: first,
		...params.target ? { target: params.target } : {},
		...rest ? { fixHint: rest } : {}
	};
}
function inferCapturedNoteSeverity(text) {
	if (text.includes("CRITICAL")) return "error";
	if (text.includes("- Fix:") || text.includes("unavailable") || text.includes("not found") || text.includes("missing") || text.includes("not readable") || text.includes("not writable") || text.includes("readonly")) return "warning";
	return "info";
}
function createNoteCollector(checkId) {
	const findings = [];
	const noteFn = (message) => {
		const text = noteMessageToText(message);
		if (!text.trim()) return;
		const severity = inferCapturedNoteSeverity(text);
		if (severity === "info") return;
		findings.push(noteTextToFinding({
			checkId,
			severity,
			text
		}));
	};
	return {
		findings,
		noteFn
	};
}
function noteMessageToText(message) {
	if (message instanceof Error) return message.message;
	if (message == null) return "";
	if (typeof message === "string") return message;
	if (typeof message === "number" || typeof message === "boolean" || typeof message === "bigint") return String(message);
	try {
		return JSON.stringify(message) ?? "";
	} catch {
		return "";
	}
}
const claudeCliCheck = {
	id: "core/doctor/claude-cli",
	kind: "core",
	description: "Claude CLI readiness is captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const { noteClaudeCliHealth } = await import("./doctor-claude-cli-UX6sKlh4.mjs");
		const collector = createNoteCollector("core/doctor/claude-cli");
		noteClaudeCliHealth(ctx.cfg, {
			noteFn: collector.noteFn,
			...ctx.cwd ? { workspaceDir: ctx.cwd } : {}
		});
		return collector.findings;
	}
};
function createSecurityCheck(deps) {
	return {
		id: "core/doctor/security",
		updateReadiness: "post-plugin",
		kind: "core",
		description: "Security posture checks produce structured findings.",
		source: "doctor",
		async detect(ctx) {
			return (await deps.collectSecurityWarnings(ctx.cfg, ctx.env)).map(securityAuditFindingToHealthFinding);
		}
	};
}
const openAIOAuthTlsCheck = {
	id: "core/doctor/oauth-tls",
	kind: "core",
	description: "OpenAI OAuth TLS prerequisites are satisfied before browser auth.",
	source: "doctor",
	async detect(ctx) {
		const { formatOpenAIOAuthTlsPreflightFix, runOpenAIOAuthTlsPreflight, shouldRunOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-CKm5vp2Y.mjs");
		if (!shouldRunOpenAIOAuthTlsPrerequisites({
			cfg: ctx.cfg,
			deep: ctx.mode === "doctor"
		})) return [];
		const result = await runOpenAIOAuthTlsPreflight({ timeoutMs: 4e3 });
		if (result.ok || result.kind !== "tls-cert") return [];
		return [noteTextToFinding({
			checkId: "core/doctor/oauth-tls",
			severity: "warning",
			text: formatOpenAIOAuthTlsPreflightFix(result)
		})];
	}
};
const legacyWhatsAppCrontabCheck = {
	id: "core/doctor/legacy-whatsapp-crontab",
	kind: "core",
	description: "Legacy WhatsApp crontab health entries are detected as structured findings.",
	source: "doctor",
	defaultEnabled: false,
	async detect() {
		const { collectLegacyWhatsAppCrontabHealthWarning } = await import("./cron-ClZzUJRq.mjs");
		const warning = await collectLegacyWhatsAppCrontabHealthWarning();
		if (!warning) return [];
		return [noteTextToFinding({
			checkId: "core/doctor/legacy-whatsapp-crontab",
			severity: "warning",
			text: warning
		})];
	}
};
const legacyCronStoreCheck = {
	id: "core/doctor/legacy-cron-store",
	kind: "core",
	description: "Legacy cron store, run-log, and payload state is normalized.",
	source: "doctor",
	defaultEnabled: false,
	async detect(ctx) {
		const { collectLegacyCronStoreHealthFindings } = await import("./cron-ClZzUJRq.mjs");
		return collectLegacyCronStoreHealthFindings({ cfg: ctx.cfg });
	}
};
const staleRuntimeBuildCheck = {
	id: "core/doctor/stale-runtime-build",
	kind: "core",
	description: "The loaded runtime was built from the checkout's current commit.",
	source: "doctor",
	async detect() {
		const { collectStaleRuntimeBuildFindings } = await import("./doctor-stale-runtime-build-Cz1hGvU-.mjs");
		return collectStaleRuntimeBuildFindings();
	}
};
const codexSessionRoutesCheck = {
	id: CODEX_SESSION_ROUTES_CHECK_ID,
	kind: "core",
	description: "Codex runtime routes are compatible with the configured plugin harness.",
	source: "doctor",
	async detect(ctx) {
		const disabledPluginFindings = collectDisabledCodexPluginRouteIssues(ctx.cfg, ctx.env).map((issue) => ({
			checkId: CODEX_SESSION_ROUTES_CHECK_ID,
			severity: "warning",
			message: [`${issue.path} routes ${issue.modelRef} to ${issue.canonicalModel}`, "with Codex runtime, but the Codex plugin is disabled by config."].join(" "),
			path: issue.path,
			target: issue.canonicalModel,
			requirement: "Codex plugin enabled for routes that use the Codex runtime.",
			fixHint: issue.repairBlocked ? ["Enable plugins.entries.codex and plugin loading, and remove codex from plugins.deny;", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ") : ["Run `openclaw doctor --fix`: it enables plugins.entries.codex,", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ")
		}));
		const compatibilityFindings = collectCodexRuntimeCompatibilityWarnings(ctx.cfg, ctx.env).map((text) => noteTextToFinding({
			checkId: CODEX_SESSION_ROUTES_CHECK_ID,
			severity: "warning",
			text
		}));
		return [...disabledPluginFindings, ...compatibilityFindings];
	}
};
const telegramGeneralTopicConversationsCheck = {
	id: TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID,
	kind: "core",
	description: "Telegram General-topic conversation bindings use the canonical chat target.",
	source: "doctor",
	async detect(ctx) {
		const { detectTelegramGeneralTopicConversationRepairs } = await import("./doctor-telegram-general-topic-conversations-BVvR4gsF.mjs");
		return detectTelegramGeneralTopicConversationRepairs({
			cfg: ctx.cfg,
			...ctx.env ? { env: ctx.env } : {}
		}).map((repair) => ({
			checkId: TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID,
			severity: "warning",
			message: `Agent ${repair.agentId} has a stale Telegram General-topic conversation identity.`,
			target: repair.agentId,
			requirement: "One canonical chat-scoped conversation binding for Telegram General topic.",
			fixHint: "Run `openclaw doctor --fix` to merge the stale topic-qualified identity."
		}));
	},
	async repair(ctx) {
		const { repairTelegramGeneralTopicConversations } = await import("./doctor-telegram-general-topic-conversations-BVvR4gsF.mjs");
		const effect = {
			kind: "state",
			action: ctx.dryRun ? "would-merge-stale-bindings" : "merge-stale-bindings",
			target: "Telegram General topic conversations",
			dryRunSafe: false
		};
		if (ctx.dryRun) return {
			changes: ["Would merge stale Telegram General-topic identities."],
			effects: [effect]
		};
		const repaired = await repairTelegramGeneralTopicConversations({
			cfg: ctx.cfg,
			...ctx.env ? { env: ctx.env } : {}
		});
		return {
			changes: [`Merged ${repaired} stale Telegram General-topic conversation identity row(s).`],
			effects: repaired > 0 ? [effect] : []
		};
	}
};
const gatewayServicesExtraCheck = {
	id: GATEWAY_SERVICES_EXTRA_CHECK_ID,
	kind: "core",
	description: "Extra gateway-like services are represented as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToHealthFinding } = await import("./doctor-gateway-services-8w4Yza_h.mjs");
		return (await detectExtraGatewayServiceIssues({ deep: coreCtx.deep === true })).map(extraGatewayServiceToHealthFinding);
	},
	async repair(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToRepairEffects } = await import("./doctor-gateway-services-8w4Yza_h.mjs");
		const effects = (await detectExtraGatewayServiceIssues({ deep: coreCtx.deep === true })).flatMap(extraGatewayServiceToRepairEffects);
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor gateway service contribution owns cleanup",
			changes: [],
			effects
		};
	}
};
const gatewayPlatformNotesCheck = {
	id: "core/doctor/gateway-services/platform-notes",
	kind: "core",
	description: "Gateway platform notes are captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		if (!isDefaultInstallIdentity(process.env)) return [];
		const { collectGatewayPlatformWarnings } = await import("./doctor-platform-notes-3BZ1Afe1.mjs");
		return (await collectGatewayPlatformWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
			checkId: "core/doctor/gateway-services/platform-notes",
			severity: "warning",
			text: warning
		}));
	}
};
function createGatewayHealthCheck(deps) {
	return {
		id: GATEWAY_HEALTH_CHECK_ID,
		kind: "core",
		description: "Authenticated Gateway health and degraded secret owners are structured findings.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx) {
			return deps.collectGatewayHealthFindings(ctx);
		}
	};
}
function createGatewayDaemonCheck(deps) {
	return {
		id: GATEWAY_DAEMON_CHECK_ID,
		kind: "core",
		description: "Local Gateway daemon service state is represented as structured findings.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx) {
			return deps.collectGatewayDaemonFindings(ctx);
		}
	};
}
const nodeRuntimeCheck = {
	id: "core/doctor/node-runtime",
	kind: "core",
	description: "Node SQLite capabilities and version support are represented as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-CKngz57Q.mjs");
		return collectNodeRuntimeFindings(ctx.env);
	}
};
const browserCheck = {
	id: "core/doctor/browser",
	kind: "core",
	description: "Browser readiness is captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const collector = createNoteCollector("core/doctor/browser");
		await noteChromeMcpBrowserReadiness(ctx.cfg, { noteFn: collector.noteFn });
		return collector.findings;
	},
	async repair(ctx) {
		if (ctx.dryRun === true) return {
			status: "skipped",
			reason: "native-host repair requires filesystem writes",
			changes: []
		};
		const result = await maybeRepairOwnedChromeExtensionNativeHosts();
		return {
			...result.status ? {
				status: result.status,
				reason: result.reason
			} : result.changes.length === 0 && result.warnings.length > 0 ? {
				status: "failed",
				reason: result.warnings.join("; ")
			} : {},
			changes: result.changes,
			warnings: result.warnings
		};
	}
};
function createSkillsReadinessCheck(deps) {
	const detectUnavailableSkills = async (ctx) => {
		const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
		const detect = ctx.cwd ? () => deps.detectUnavailableSkills(ctx) : async () => [];
		if (!runWithPluginMetadataSnapshot) return await detect();
		return await runWithPluginMetadataSnapshot({
			config: ctx.cfg,
			workspaceDir: ctx.cwd
		}, detect);
	};
	return {
		id: "core/doctor/skills-readiness",
		kind: "core",
		description: "Allowed skills are usable in the current runtime environment.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx, scope) {
			return filterUnavailableSkillsForScope(await detectUnavailableSkills(ctx), scope?.paths).map(unavailableSkillToFinding);
		},
		async repair(ctx, findings) {
			const unavailable = filterUnavailableSkillsForScope(await detectUnavailableSkills(ctx), findings.map((finding) => finding.path));
			if (unavailable.length === 0) return { changes: [] };
			return {
				config: disableUnavailableSkillsInConfig(ctx.cfg, unavailable),
				changes: unavailable.map((skill) => `Disabled unavailable skill ${skill.name}.`),
				effects: unavailable.map((skill) => ({
					kind: "config",
					action: ctx.dryRun === true ? "would-disable-skill" : "disable-skill",
					target: skillReadinessPath(skill),
					dryRunSafe: true
				}))
			};
		}
	};
}
function unavailableSkillToFinding(skill) {
	return {
		checkId: "core/doctor/skills-readiness",
		severity: "warning",
		message: `${skill.name} is allowed but unavailable: ${formatMissingSkillSummary(skill)}.`,
		path: skillReadinessPath(skill),
		fixHint: "Install/configure the missing requirement, or run `openclaw doctor --fix` to disable unused unavailable skills."
	};
}
function filterUnavailableSkillsForScope(unavailable, paths) {
	const scopedPaths = new Set(paths?.filter((pathLocal) => pathLocal !== void 0) ?? []);
	if (scopedPaths.size === 0) return [...unavailable];
	return unavailable.filter((skill) => scopedPaths.has(skillReadinessPath(skill)));
}
function skillReadinessPath(skill) {
	return `skills.entries.${skill.skillKey}.enabled`;
}
function browserResidueDeps(ctx) {
	return ctx.configPath ? { configDir: path.dirname(ctx.configPath) } : {};
}
function browserResidueFinding(residue) {
	return {
		checkId: BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID,
		severity: "warning",
		message: `Legacy managed browser profile residue was found at ${residue.legacyProfileDir}.`,
		path: residue.legacyProfileDir,
		ocPath: "oc://state/browser/clawd",
		fixHint: "Run `openclaw doctor --fix` to archive the stale clawd profile safely instead of deleting it in place."
	};
}
function formatWouldArchiveBrowserResidue(residue) {
	return [
		"Would archive legacy clawd managed browser profile residue.",
		`- legacy profile: ${residue.legacyProfileDir}`,
		`- canonical profile: ${residue.canonicalUserDataDir}`
	].join("\n");
}
const browserClawdProfileResidueCheck = {
	id: BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID,
	kind: "core",
	description: "Legacy clawd managed browser profile residue has been archived after the OpenClaw rename.",
	source: "doctor",
	async detect(ctx, scope) {
		const residue = await detectLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (!residue) return [];
		const scopedPaths = new Set(scope?.paths ?? []);
		if (scopedPaths.size > 0 && !scopedPaths.has(residue.legacyProfileDir)) return [];
		return [browserResidueFinding(residue)];
	},
	async repair(ctx) {
		const residue = await detectLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (!residue) return {
			status: "skipped",
			reason: "legacy clawd browser profile residue no longer exists",
			changes: []
		};
		const effect = {
			kind: "state",
			action: ctx.dryRun === true ? "would-archive-legacy-browser-profile-residue" : "archive-legacy-browser-profile-residue",
			target: residue.legacyProfileDir,
			dryRunSafe: false
		};
		if (ctx.dryRun === true) return {
			changes: [formatWouldArchiveBrowserResidue(residue)],
			effects: [effect]
		};
		const result = await maybeArchiveLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (result.changes.length === 0 && result.warnings.length > 0) return {
			status: "failed",
			reason: result.warnings.join("; "),
			changes: [],
			warnings: result.warnings,
			effects: []
		};
		return {
			changes: result.changes,
			warnings: result.warnings,
			effects: result.changes.length > 0 ? [effect] : []
		};
	}
};
const shellCompletionCheck = {
	id: "core/doctor/shell-completion",
	kind: "core",
	description: "Shell completion uses the cached completion path when configured.",
	source: "doctor",
	async detect() {
		return shellCompletionStatusToHealthFindings(await checkShellCompletionStatus());
	},
	async repair(ctx) {
		const status = await checkShellCompletionStatus();
		const effects = shellCompletionStatusToRepairEffects(status);
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor shell-completion repair owns real mutations",
			changes: [],
			effects
		};
	}
};
const uiProtocolFreshnessCheck = {
	id: "core/doctor/ui-protocol-freshness",
	kind: "core",
	description: "Control UI assets are present and current with the Gateway protocol schema.",
	source: "doctor",
	async detect() {
		return (await detectUiProtocolFreshnessIssues()).map(uiProtocolFreshnessIssueToHealthFinding);
	},
	async repair(ctx) {
		const effects = (await detectUiProtocolFreshnessIssues()).flatMap(uiProtocolFreshnessIssueToRepairEffects);
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor UI freshness repair owns real mutations",
			changes: [],
			effects
		};
	}
};
function createWorkspaceSuggestionsCheck(deps) {
	return {
		id: "core/doctor/workspace-suggestions",
		kind: "core",
		description: "Workspace backup and memory-system suggestions are captured as structured findings.",
		defaultEnabled: false,
		source: "doctor",
		async detect(ctx) {
			const scopes = resolveDoctorWorkspaceSuggestionScopes(ctx.cfg);
			return (await Promise.all(scopes.map(async ({ agentId, workspaceDir, labelAgent }) => {
				const prefix = labelAgent ? `Agent "${agentId}": ` : "";
				return (await deps.collectWorkspaceSuggestionNotes(workspaceDir)).map((text) => noteTextToFinding({
					checkId: "core/doctor/workspace-suggestions",
					severity: "info",
					text: `${prefix}${text}`,
					...labelAgent ? { target: agentId } : {}
				}));
			}))).flat();
		}
	};
}
function createConvertedWorkflowChecks(deps) {
	return [
		claudeCliCheck,
		gatewayAuthCheck,
		legacyStateCheck,
		removedWorkspacesStateCheck,
		legacyWhatsAppCrontabCheck,
		legacyCronStoreCheck,
		staleRuntimeBuildCheck,
		codexSessionRoutesCheck,
		telegramGeneralTopicConversationsCheck,
		shellCompletionCheck,
		uiProtocolFreshnessCheck,
		gatewayServicesExtraCheck,
		gatewayPlatformNotesCheck,
		createGatewayHealthCheck(deps),
		createGatewayDaemonCheck(deps),
		nodeRuntimeCheck,
		createSecurityCheck(deps),
		browserCheck,
		openAIOAuthTlsCheck,
		hooksModelCheck,
		bootstrapSizeCheck,
		createModelReferenceCheck(),
		createProviderCatalogProjectionCheck(deps),
		{
			id: "core/doctor/local-audio-acceleration",
			kind: "core",
			description: "Local STT auto-selection and acceleration evidence are visible.",
			source: "doctor",
			async detect() {
				return await deps.collectLocalAudioAccelerationFindings();
			}
		},
		createRuntimeToolSchemaCheck(deps),
		createWorkspaceSuggestionsCheck(deps),
		skillWorkshopToolPolicyCheck,
		skillWorkshopRelocationCheck,
		...isExperimentalClawsEnabled() ? [{
			id: "core/doctor/claws-state",
			kind: "core",
			description: "Claw lifecycle ownership and managed resources are consistent.",
			defaultEnabled: false,
			source: "doctor",
			async detect(ctx) {
				const [{ collectClawStateHealthFindings }, { listConfiguredMcpServers }] = await Promise.all([import("./doctor-ChKaHjKx.mjs"), import("./mcp-config-Cze35l6b.mjs")]);
				return await collectClawStateHealthFindings({
					cfg: ctx.cfg,
					env: process.env,
					listMcpServers: listConfiguredMcpServers,
					cronGateway: { list: async () => await deps.listGatewayCronJobs(ctx) }
				});
			}
		}] : []
	];
}
function createCoreHealthChecks(deps = defaultCoreHealthCheckDeps) {
	return [
		gatewayConfigCheck,
		...createConvertedWorkflowChecks(deps),
		commandOwnerCheck,
		createSkillsReadinessCheck(deps),
		browserClawdProfileResidueCheck,
		finalConfigValidationCheck
	].map(copyHealthCheck);
}
const CORE_HEALTH_CHECKS = createCoreHealthChecks();
//#endregion
export { CORE_HEALTH_CHECKS, createCoreHealthChecks };
