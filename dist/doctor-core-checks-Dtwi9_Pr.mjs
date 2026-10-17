import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { o as isDefaultInstallIdentity } from "./paths-DGIwWbpu.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds, l as tryResolveSoleAgentId, n as listAgentEntries, r as listAgentEntriesWithSource } from "./agent-roster-BXD1uMJD.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CsO-mXVD.mjs";
import "./model-selection-D3_rVb38.mjs";
import { a as shellCompletionStatusToRepairEffects, i as shellCompletionStatusToHealthFindings, t as checkShellCompletionStatus } from "./doctor-completion-CChOy89c.mjs";
import { t as resolveSkillWorkshopConfig } from "./config-C8iJzbV2.mjs";
import { r as hasConfiguredCommandOwners } from "./doctor-command-owner-ZwiTw8zO.mjs";
import { n as configValidationIssuesToHealthFindings, r as configValidationWarningsToHealthFindings, t as FINAL_CONFIG_VALIDATION_CHECK_ID } from "./doctor-config-validation-findings-C1THItUh.mjs";
import { n as hasAmbiguousGatewayAuthModeConfig } from "./auth-mode-policy-DzNSJi11.mjs";
import { t as detectSkillWorkshopToolPolicyDiagnostic } from "./tool-policy-diagnostic-DWZYpqGl.mjs";
import { n as noteChromeMcpBrowserReadiness, t as maybeRepairOwnedChromeExtensionNativeHosts } from "./doctor-browser-7Dkhl7JJ.mjs";
import { t as hasActiveGatewayExecCredential } from "./doctor-gateway-exec-credential-BOJCqax_.mjs";
import { t as classifyLegacyServices } from "./doctor-gateway-legacy-services-B1MoF-54.mjs";
import { n as disableUnavailableSkillsInConfig, r as formatMissingSkillSummary } from "./doctor-skills-core-Yeo8bqi0.mjs";
import { i as uiProtocolFreshnessIssueToRepairEffects, r as uiProtocolFreshnessIssueToHealthFinding, t as detectUiProtocolFreshnessIssues } from "./doctor-ui-DQA9OJbI.mjs";
import { i as resolveKnownModelRefMigrationTarget, n as collectCodexRuntimeCompatibilityWarnings, o as collectDisabledCodexPluginRouteIssues } from "./codex-route-warnings-CGQtbALk.mjs";
import { t as detectGatewayAuthHealth } from "./doctor-gateway-auth-CfIP67c-.mjs";
import { t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-D6N0AoYe.mjs";
import { r as securityAuditFindingToHealthFinding } from "./health-check-adapter-Qbgk_amB.mjs";
import path from "node:path";
import { lstat, realpath, rm } from "node:fs/promises";
//#region src/flows/doctor-acp-agent-model-check.ts
/** Doctor advisory for ACP-runtime agents whose configured primary model is harness-owned. */
const CHECK_ID$2 = "core/doctor/acp-agent-model";
/** Explains the separate harness selection and native default without proposing a repair. */
function collectAcpAgentModelFindings(cfg) {
	const findings = [];
	for (const { entry: agent, source } of listAgentEntriesWithSource(cfg)) {
		if (agent.runtime?.type !== "acp") continue;
		const primary = resolveAgentModelPrimaryValue(agent.model)?.trim();
		const agentId = agent.id?.trim();
		if (!primary || !agentId) continue;
		const nativeDefault = resolveDefaultModelForAgent({
			cfg,
			agentId
		});
		const nativeRef = sanitizeTerminalText(`${nativeDefault.provider}/${nativeDefault.model}`);
		const agentPath = source.kind === "entries" ? appendConfigPathSegment("agents.entries", source.key) : appendConfigPathSegment("agents.list", source.index);
		const modelPath = appendConfigPathSegment(agentPath, "model");
		const path = sanitizeTerminalText(typeof agent.model === "string" ? modelPath : appendConfigPathSegment(modelPath, "primary"));
		const displayAgentId = sanitizeTerminalText(agentId);
		const harnessModel = sanitizeTerminalText(primary);
		findings.push({
			checkId: CHECK_ID$2,
			severity: "info",
			source: "doctor",
			target: displayAgentId,
			path,
			message: `Agent "${displayAgentId}" uses ACP harness model "${harnessModel}" from ${path}. Its OpenClaw native default is "${nativeRef}". Explicit native session, utility, and subagent model selections still apply.`
		});
	}
	return findings;
}
function createAcpAgentModelCheck() {
	return {
		id: CHECK_ID$2,
		kind: "core",
		description: "ACP harness models and OpenClaw native defaults are shown separately.",
		source: "doctor",
		async detect(ctx) {
			return collectAcpAgentModelFindings(ctx.cfg);
		}
	};
}
//#endregion
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
//#region src/flows/doctor-gateway-services-check.ts
const CHECK_ID$1 = "core/doctor/gateway-services/extra";
const gatewayServicesExtraCheck = {
	id: CHECK_ID$1,
	kind: "core",
	description: "Extra gateway-like services and incomplete inspection are reported as findings.",
	source: "doctor",
	async detect(ctx) {
		const { detectExtraGatewayServiceIssues } = await import("./doctor-gateway-services-CVrVF37L.mjs");
		const { services, errors } = await detectExtraGatewayServiceIssues({ deep: ctx.deep === true });
		return services.map((service) => ({
			checkId: CHECK_ID$1,
			severity: service.legacy === true ? "warning" : "info",
			message: `Other gateway-like service detected: ${service.label} (${service.scope}, ${service.detail})`,
			source: service.platform,
			target: service.label,
			fixHint: service.legacy === true ? "Run `openclaw doctor` interactively to review legacy gateway services and confirm supported cleanup." : "Run a single gateway per machine unless this extra gateway is intentional."
		})).concat(errors.map((error) => ({
			checkId: CHECK_ID$1,
			severity: "warning",
			message: `Gateway service inspection incomplete: ${error.message}`,
			source: "doctor",
			target: error.source,
			fixHint: "Restore access to the native service definition or service manager, then run `openclaw doctor --deep` again."
		})));
	},
	async repair(ctx) {
		const { detectExtraGatewayServiceIssues } = await import("./doctor-gateway-services-CVrVF37L.mjs");
		const { services } = await detectExtraGatewayServiceIssues({ deep: ctx.deep === true });
		const { darwinUserServices, linuxUserServices } = classifyLegacyServices(services.filter((service) => service.legacy === true));
		const effects = [...darwinUserServices, ...linuxUserServices].map((service) => ({
			kind: "service",
			action: "would-remove-legacy-gateway-service",
			target: service.label,
			dryRunSafe: false
		}));
		return ctx.dryRun === true ? {
			status: "repaired",
			changes: [],
			effects
		} : {
			status: "skipped",
			reason: "legacy doctor gateway service contribution owns cleanup",
			changes: [],
			effects
		};
	}
};
//#endregion
//#region src/flows/doctor-model-reference-check.ts
/** Doctor check for configured model references that have no installed provider owner. */
function createModelReferenceCheck() {
	return {
		id: "core/doctor/model-references",
		kind: "core",
		description: "Configured model references have installed or configured provider owners.",
		source: "doctor",
		async detect(ctx) {
			const { inspectConfiguredModelReferences } = await import("./model-reference-validation-Dtz5CV9c.mjs");
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
		label: `agents.entries.${agent.id}.workspace`,
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
	const runtime = await import("./doctor-tool-schema-runtime-D8TJJDdO.mjs");
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
const CODEX_SESSION_ROUTES_CHECK_ID = "core/doctor/codex-session-routes";
const GATEWAY_DAEMON_CHECK_ID = "core/doctor/gateway-daemon";
const GATEWAY_HEALTH_CHECK_ID = "core/doctor/gateway-health";
const TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID = "core/doctor/telegram-general-topic-conversations";
const SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID = "core/doctor/skill-workshop-tool-policy";
const SKILL_WORKSHOP_RELOCATION_CHECK_ID = "core/doctor/skill-workshop-relocation";
async function listGatewayCronJobsWithRuntime(ctx) {
	const { bindAgentToolGatewayRequest } = await import("./in-process-gateway-CxG76lQB.mjs");
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
const gatewayConfigCheck = {
	id: "core/doctor/gateway-config",
	description: "openclaw.jsonc gateway block is set and unambiguous.",
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
	description: "An owner account is configured for owner-only commands.",
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
	description: "Autonomous Skill Workshop capture has a callable review tool.",
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
	description: "Skill Workshop files and proposals use each agent's Workshop directory.",
	async detect(ctx) {
		const { inspectLegacySkillWorkshopMigration } = await import("./doctor-skill-workshop-sqlite-BOOxkaXc.mjs");
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
	description: "Local Gateway auth mode has a usable token or another explicit auth mode.",
	detect: detectGatewayAuthHealth
};
const hooksModelCheck = {
	id: "core/doctor/hooks-model",
	description: "hooks.gmail.model resolves to an allowed catalog model.",
	async detect(ctx) {
		const { collectHooksModelIssues } = await import("./doctor-hooks-model-CdJ-xqVF.mjs");
		return (await collectHooksModelIssues(ctx.cfg)).map(({ kind, model }) => {
			if (kind === "unresolved") return {
				checkId: "core/doctor/hooks-model",
				severity: "warning",
				path: "hooks.gmail.model",
				message: `hooks.gmail.model "${model}" could not be resolved.`
			};
			return {
				checkId: "core/doctor/hooks-model",
				severity: "warning",
				path: "hooks.gmail.model",
				message: kind === "not-allowed" ? `hooks.gmail.model "${model}" is not allowed by agents.defaults.modelPolicy.allow.` : `hooks.gmail.model "${model}" is not in the model catalog.`,
				fixHint: kind === "not-allowed" ? "Add the model or its provider wildcard to agents.defaults.modelPolicy.allow, or remove hooks.gmail.model." : "Choose a model from the configured provider catalog."
			};
		});
	}
};
const legacyStateCheck = {
	id: "core/doctor/legacy-state",
	description: "Legacy sessions, agent state, and channel auth paths have been migrated.",
	defaultEnabled: false,
	async detect(ctx) {
		const { detectLegacyStateMigrations } = await import("./state-migrations.doctor-DqvRZS5n.mjs");
		const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces-BYb0MbzB.mjs");
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
	description: "Workspace bootstrap files fit within configured injection limits.",
	async detect(ctx) {
		if (!ctx.cwd) return [];
		const { collectBootstrapFileSize } = await import("./doctor-bootstrap-size-dozq4ei1.mjs");
		const { isFixedUserCapFile } = await import("./bootstrap-budget-B-oQRBkP.mjs");
		const { USER_BOOTSTRAP_MAX_CHARS } = await import("./bootstrap-D9Li36Dx.mjs");
		const workspaceDir = ctx.cwd;
		const { analysis } = await collectBootstrapFileSize(ctx.cfg, workspaceDir, tryResolveSoleAgentId(ctx.cfg));
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
function noteTextToFinding(params) {
	const lines = params.text.split("\n");
	const first = (lines[0] ?? params.text).replace(/^- /, "").trim();
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
	description: "Claude CLI readiness is captured as structured findings.",
	async detect(ctx) {
		const { noteClaudeCliHealth } = await import("./doctor-claude-cli-CpKzgGzJ.mjs");
		const collector = createNoteCollector("core/doctor/claude-cli");
		noteClaudeCliHealth(ctx.cfg, {
			noteFn: collector.noteFn,
			...ctx.cwd ? { workspaceDir: ctx.cwd } : {}
		});
		return collector.findings;
	}
};
const openAIOAuthTlsCheck = {
	id: "core/doctor/oauth-tls",
	description: "OpenAI OAuth TLS prerequisites are satisfied before browser auth.",
	async detect(ctx) {
		const { formatOpenAIOAuthTlsPreflightFix, runOpenAIOAuthTlsPreflight, shouldRunOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-BvGL4LwC.mjs");
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
	description: "Legacy WhatsApp crontab health entries are detected as structured findings.",
	defaultEnabled: false,
	async detect() {
		const { collectLegacyWhatsAppCrontabHealthWarning } = await import("./cron-DlU_16m4.mjs");
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
	description: "Legacy cron store, run-log, and payload state is normalized.",
	defaultEnabled: false,
	async detect(ctx) {
		const { collectLegacyCronStoreHealthFindings } = await import("./cron-DlU_16m4.mjs");
		return collectLegacyCronStoreHealthFindings({ cfg: ctx.cfg });
	}
};
const staleRuntimeBuildCheck = {
	id: "core/doctor/stale-runtime-build",
	description: "The loaded runtime was built from the checkout's current commit.",
	async detect() {
		const { collectStaleRuntimeBuildFindings } = await import("./doctor-stale-runtime-build-De9w4e74.mjs");
		return collectStaleRuntimeBuildFindings();
	}
};
const codexSessionRoutesCheck = {
	id: CODEX_SESSION_ROUTES_CHECK_ID,
	description: "Codex runtime routes are compatible with the configured plugin harness.",
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
	description: "Telegram General-topic conversation bindings use the canonical chat target.",
	async detect(ctx) {
		const { detectTelegramGeneralTopicConversationRepairs } = await import("./doctor-telegram-general-topic-conversations-D6AHtbBi.mjs");
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
		const { repairTelegramGeneralTopicConversations } = await import("./doctor-telegram-general-topic-conversations-D6AHtbBi.mjs");
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
const gatewayPlatformNotesCheck = {
	id: "core/doctor/gateway-services/platform-notes",
	description: "Gateway platform notes are captured as structured findings.",
	async detect(ctx) {
		if (!isDefaultInstallIdentity(process.env)) return [];
		const { collectGatewayPlatformWarnings } = await import("./doctor-platform-notes-BQcvapah.mjs");
		return (await collectGatewayPlatformWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
			checkId: "core/doctor/gateway-services/platform-notes",
			severity: "warning",
			text: warning
		}));
	}
};
const nodeRuntimeCheck = {
	id: "core/doctor/node-runtime",
	description: "Node SQLite capabilities and version support are represented as structured findings.",
	async detect(ctx) {
		const { collectNodeRuntimeFindings } = await import("./node-runtime-diagnostics-xzLvoswX.mjs");
		return collectNodeRuntimeFindings(ctx.env);
	}
};
const browserCheck = {
	id: "core/doctor/browser",
	description: "Browser readiness is captured as structured findings.",
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
async function detectSkillsReadiness(ctx) {
	const { runWithPluginMetadataSnapshot } = ctx;
	const detect = async () => {
		if (!ctx.cwd) return [];
		const { detectUnavailableSkills } = await import("./doctor-core-checks.runtime.js");
		return detectUnavailableSkills(ctx.cfg, ctx.cwd);
	};
	if (!runWithPluginMetadataSnapshot) return await detect();
	return await runWithPluginMetadataSnapshot({
		config: ctx.cfg,
		workspaceDir: ctx.cwd
	}, detect);
}
const skillsReadinessCheck = {
	id: "core/doctor/skills-readiness",
	description: "Allowed skills are usable in the current runtime environment.",
	defaultEnabled: false,
	async detect(ctx, scope) {
		return filterUnavailableSkillsForScope(await detectSkillsReadiness(ctx), scope?.paths).map(unavailableSkillToFinding);
	},
	async repair(ctx, findings) {
		const unavailable = filterUnavailableSkillsForScope(await detectSkillsReadiness(ctx), findings.map((finding) => finding.path));
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
const shellCompletionCheck = {
	id: "core/doctor/shell-completion",
	description: "Shell completion uses the cached completion path when configured.",
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
	description: "Control UI assets are present and current with the Gateway protocol schema.",
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
const workspaceSuggestionsCheck = {
	id: "core/doctor/workspace-suggestions",
	description: "Workspace backup and memory-system suggestions are captured as structured findings.",
	defaultEnabled: false,
	async detect(ctx) {
		const scopes = resolveDoctorWorkspaceSuggestionScopes(ctx.cfg);
		const { collectWorkspaceSuggestionNotes } = await import("./doctor-workspace-suggestions-BMFbZZUp.mjs");
		return (await Promise.all(scopes.map(async ({ agentId, workspaceDir, labelAgent }) => {
			const prefix = labelAgent ? `Agent "${agentId}": ` : "";
			const notes = [];
			for await (const text of collectWorkspaceSuggestionNotes(workspaceDir)) notes.push(text);
			return notes.map((text) => noteTextToFinding({
				checkId: "core/doctor/workspace-suggestions",
				severity: "info",
				text: `${prefix}${text}`,
				...labelAgent ? { target: agentId } : {}
			}));
		}))).flat();
	}
};
function createCoreHealthChecks() {
	return [
		gatewayConfigCheck,
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
		{
			id: GATEWAY_HEALTH_CHECK_ID,
			description: "Authenticated Gateway health and degraded secret owners are structured findings.",
			defaultEnabled: false,
			async detect(ctx) {
				const { collectGatewayHealthFindings } = await import("./doctor-gateway-health-CvHWwfeC.mjs");
				return collectGatewayHealthFindings(ctx);
			}
		},
		{
			id: GATEWAY_DAEMON_CHECK_ID,
			description: "Local Gateway daemon service state is represented as structured findings.",
			defaultEnabled: false,
			async detect(ctx) {
				const { collectGatewayDaemonFindings } = await import("./doctor-core-checks.runtime.js");
				return collectGatewayDaemonFindings(ctx);
			}
		},
		nodeRuntimeCheck,
		{
			id: "core/doctor/security",
			updateReadiness: "post-plugin",
			description: "Security posture checks produce structured findings.",
			async detect(ctx) {
				const { collectSecurityWarnings } = await import("./doctor-security-C6rYK92a.mjs");
				return (await collectSecurityWarnings(ctx.cfg, ctx.env)).map(securityAuditFindingToHealthFinding);
			}
		},
		browserCheck,
		openAIOAuthTlsCheck,
		hooksModelCheck,
		bootstrapSizeCheck,
		createModelReferenceCheck(),
		createAcpAgentModelCheck(),
		{
			id: "core/doctor/provider-catalog-projection",
			description: "Provider catalog hooks project into unified text model catalog rows.",
			async detect(ctx) {
				const { collectProviderCatalogProjectionFindings } = await import("./doctor-core-checks.runtime.js");
				return collectProviderCatalogProjectionFindings(ctx.cfg, ctx.cwd);
			}
		},
		{
			id: "core/doctor/local-audio-acceleration",
			description: "Local STT auto-selection and acceleration evidence are visible.",
			async detect() {
				const { collectLocalAudioAccelerationFindings } = await import("./doctor-core-checks.runtime.js");
				return collectLocalAudioAccelerationFindings();
			}
		},
		createRuntimeToolSchemaCheck({ collectRuntimeToolSchemaFindings: collectRuntimeToolSchemaFindingsWithRuntime }),
		workspaceSuggestionsCheck,
		skillWorkshopToolPolicyCheck,
		skillWorkshopRelocationCheck,
		...isExperimentalClawsEnabled() ? [{
			id: "core/doctor/claws-state",
			description: "Claw lifecycle ownership and managed resources are consistent.",
			defaultEnabled: false,
			async detect(ctx) {
				const [{ collectClawStateHealthFindings }, { listConfiguredMcpServers }] = await Promise.all([import("./doctor-B4qF-AXD.mjs"), import("./mcp-config-D31bbM9V.mjs")]);
				return await collectClawStateHealthFindings({
					cfg: ctx.cfg,
					env: process.env,
					listMcpServers: listConfiguredMcpServers,
					cronGateway: { list: () => listGatewayCronJobsWithRuntime(ctx) }
				});
			}
		}] : [],
		commandOwnerCheck,
		skillsReadinessCheck,
		finalConfigValidationCheck
	].map((check) => Object.assign({}, check, {
		kind: "core",
		source: "doctor"
	}));
}
const CORE_HEALTH_CHECKS = createCoreHealthChecks();
//#endregion
export { CORE_HEALTH_CHECKS, createCoreHealthChecks };
