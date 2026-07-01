import { g as resolveSecretInputRef } from "./types.secrets-lIZQEgMF.js";
import "./agent-scope-CDZXADgT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as hasAmbiguousGatewayAuthModeConfig } from "./auth-mode-policy-zOoXt9uz.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-CdlfbTNH.js";
import "./auth-C2Z6iDLc.js";
import { n as resolveGatewayAuth } from "./auth-resolve-DgsdN2lA.js";
import { n as maybeArchiveLegacyClawdBrowserProfileResidue, r as noteChromeMcpBrowserReadiness, t as detectLegacyClawdBrowserProfileResidue } from "./doctor-browser-BkwE-DCL.js";
import { n as hasConfiguredCommandOwners } from "./doctor-command-owner-D_N8_gmF.js";
import { a as shellCompletionStatusToRepairEffects, i as shellCompletionStatusToHealthFindings, t as checkShellCompletionStatus } from "./doctor-completion-BAqhzdPS.js";
import { n as disableUnavailableSkillsInConfig, r as formatMissingSkillSummary } from "./doctor-skills-core-DZQVCoNO.js";
import { i as uiProtocolFreshnessIssueToRepairEffects, r as uiProtocolFreshnessIssueToHealthFinding, t as detectUiProtocolFreshnessIssues } from "./doctor-ui-BWh1UdlQ.js";
import { n as collectDisabledCodexPluginRouteIssues } from "./codex-route-warnings-CMbLJeIU.js";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-DJSvo54j.js";
import { o as registerHealthCheck } from "./health-check-registry-CBs_fO63.js";
import path from "node:path";
//#region src/flows/doctor-core-checks.ts
const BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID = "core/doctor/browser-clawd-profile-residue";
const CODEX_SESSION_ROUTES_CHECK_ID = "core/doctor/codex-session-routes";
const FINAL_CONFIG_VALIDATION_CHECK_ID = "core/doctor/final-config-validation";
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
const loadDoctorCoreChecksRuntimeModule = async () => await import("./doctor-core-checks.runtime.js");
const loadDoctorWorkspaceModule = async () => await import("./doctor-workspace-BrWuv5Qj.js");
async function detectUnavailableSkillsWithRuntime(cfg) {
	return (await loadDoctorCoreChecksRuntimeModule()).detectUnavailableSkills(cfg);
}
async function collectSecurityWarningsWithRuntime(cfg) {
	const { collectSecurityWarnings } = await import("./doctor-security-D0pmbMcw.js");
	return collectSecurityWarnings(cfg);
}
async function collectWorkspaceSuggestionNotesWithRuntime(workspaceDir) {
	const { collectWorkspaceBackupTip } = await import("./doctor-state-integrity-Cr9CqpXl.js");
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await loadDoctorWorkspaceModule();
	const notes = [];
	const backupTip = collectWorkspaceBackupTip(workspaceDir);
	if (backupTip) notes.push(backupTip);
	if (await shouldSuggestMemorySystem(workspaceDir)) notes.push(MEMORY_SYSTEM_PROMPT);
	return notes;
}
async function collectRuntimeToolSchemaFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectRuntimeToolSchemaFindings(ctx.cfg);
}
async function collectProviderCatalogProjectionFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectProviderCatalogProjectionFindings(ctx.cfg);
}
const defaultCoreHealthCheckDeps = {
	detectUnavailableSkills: detectUnavailableSkillsWithRuntime,
	collectSecurityWarnings: collectSecurityWarningsWithRuntime,
	collectWorkspaceSuggestionNotes: collectWorkspaceSuggestionNotesWithRuntime,
	collectRuntimeToolSchemaFindings: collectRuntimeToolSchemaFindingsWithRuntime,
	collectProviderCatalogProjectionFindings: collectProviderCatalogProjectionFindingsWithRuntime
};
function configValidationIssuesToHealthFindings(issues) {
	return issues.map((issue) => ({
		checkId: FINAL_CONFIG_VALIDATION_CHECK_ID,
		severity: "error",
		message: issue.message,
		path: issue.path || "<root>"
	}));
}
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
function resolveDoctorMode(cfg) {
	return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function buildGatewayTokenSecretRefUnavailableMessage(params) {
	if (params.unresolvedRefReason) return `Gateway token SecretRef could not be resolved: ${params.unresolvedRefReason}`;
	if (params.ref.source === "exec") {
		const staticError = getSkippedExecRefStaticError({
			ref: params.ref,
			config: params.cfg
		});
		if (staticError) return `Gateway token SecretRef could not be verified: ${staticError}`;
		return "Gateway token SecretRef uses an exec provider and did not resolve.";
	}
	return "Gateway token is managed via SecretRef and is currently unavailable.";
}
function buildGatewayTokenSecretRefFixHint(ref) {
	if (ref.source === "exec") return "Run `openclaw doctor --allow-exec` to verify exec SecretRefs during doctor, or `openclaw secrets audit --allow-exec` to audit all exec SecretRefs.";
	return "Resolve or rotate the external secret source, then rerun doctor.";
}
const gatewayAuthCheck = {
	id: "core/doctor/gateway-auth",
	kind: "core",
	description: "Local Gateway auth mode has a usable token or another explicit auth mode.",
	source: "doctor",
	async detect(ctx) {
		if (resolveDoctorMode(ctx.cfg) !== "local") return [];
		const gatewayTokenRef = resolveSecretInputRef({
			value: ctx.cfg.gateway?.auth?.token,
			defaults: ctx.cfg.secrets?.defaults
		}).ref;
		const auth = resolveGatewayAuth({
			authConfig: ctx.cfg.gateway?.auth,
			tailscaleMode: ctx.cfg.gateway?.tailscale?.mode ?? "off"
		});
		const hasInlineToken = typeof auth.token === "string" && auth.token.trim() !== "";
		if (!(auth.mode !== "password" && auth.mode !== "none" && auth.mode !== "trusted-proxy" && (auth.mode !== "token" || !hasInlineToken || Boolean(gatewayTokenRef)))) return [];
		let unresolvedRefReason;
		if (gatewayTokenRef && gatewayTokenRef.source === "exec") if (getSkippedExecRefStaticError({
			ref: gatewayTokenRef,
			config: ctx.cfg
		})) unresolvedRefReason = void 0;
		else if (ctx.allowExecSecretRefs !== true) return [];
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: "never"
			});
			if (resolvedToken.source === "secretRef") return [];
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: gatewayTokenRef ? "never" : "always"
			});
			if (gatewayTokenRef ? resolvedToken.source === "secretRef" : resolvedToken.token) return [];
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
		if (gatewayTokenRef) return [{
			checkId: "core/doctor/gateway-auth",
			severity: "warning",
			message: buildGatewayTokenSecretRefUnavailableMessage({
				cfg: ctx.cfg,
				ref: gatewayTokenRef,
				unresolvedRefReason
			}),
			path: "gateway.auth.token",
			fixHint: buildGatewayTokenSecretRefFixHint(gatewayTokenRef)
		}];
		return [{
			checkId: "core/doctor/gateway-auth",
			severity: "warning",
			message: "Gateway auth is off or missing a token.",
			path: "gateway.auth",
			fixHint: "Run `openclaw doctor --fix --generate-gateway-token` to generate a token."
		}];
	}
};
const hooksModelCheck = {
	id: "core/doctor/hooks-model",
	kind: "core",
	description: "hooks.gmail.model resolves to an allowed catalog model.",
	source: "doctor",
	async detect(ctx) {
		if (!ctx.cfg.hooks?.gmail?.model?.trim()) return [];
		const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-RurGC76M.js");
		const { loadModelCatalog } = await import("./model-catalog-CTcoVG4G.js");
		const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-BnOgOkmR.js");
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
		const catalog = await loadModelCatalog({
			config: ctx.cfg,
			readOnly: true
		});
		const status = getModelRefStatus({
			cfg: ctx.cfg,
			catalog,
			ref: hooksModelRef,
			defaultProvider,
			defaultModel
		});
		const findings = [];
		if (!status.allowed) findings.push({
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${status.key}" is not in agents.defaults.models allowlist.`,
			path: "hooks.gmail.model",
			fixHint: "Add the model to agents.defaults.models or remove hooks.gmail.model."
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
	async detect(ctx) {
		const { detectLegacyStateMigrations } = await import("./doctor-state-migrations-BUTRFw4u.js");
		const detected = await detectLegacyStateMigrations({ cfg: ctx.cfg });
		return detected.preview.map((line) => ({
			checkId: "core/doctor/legacy-state",
			severity: "warning",
			message: line.replace(/^- /, ""),
			path: detected.stateDir,
			fixHint: "Run `openclaw doctor --fix` to migrate legacy state."
		}));
	}
};
const bootstrapSizeCheck = {
	id: "core/doctor/bootstrap-size",
	kind: "core",
	description: "Workspace bootstrap files fit within configured injection limits.",
	source: "doctor",
	async detect(ctx) {
		const { buildBootstrapInjectionStats, analyzeBootstrapBudget } = await import("./bootstrap-budget-BSpyOjMp.js");
		const { resolveBootstrapContextForRun } = await import("./bootstrap-files-KAEnV9MD.js");
		const { resolveBootstrapMaxChars, resolveBootstrapTotalMaxChars } = await import("./embedded-agent-helpers-cTvTP9FD.js");
		const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
		const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForRun({
			workspaceDir,
			config: ctx.cfg
		});
		const analysis = analyzeBootstrapBudget({
			files: buildBootstrapInjectionStats({
				bootstrapFiles,
				injectedFiles: contextFiles
			}),
			bootstrapMaxChars: resolveBootstrapMaxChars(ctx.cfg),
			bootstrapTotalMaxChars: resolveBootstrapTotalMaxChars(ctx.cfg)
		});
		const findings = [];
		for (const file of analysis.truncatedFiles) findings.push({
			checkId: "core/doctor/bootstrap-size",
			severity: "warning",
			message: `${file.name} exceeds bootstrap limits and will be truncated.`,
			path: file.path,
			fixHint: "Reduce the file size or tune agents.defaults.bootstrapMaxChars/TotalMaxChars."
		});
		for (const file of analysis.nearLimitFiles) {
			if (file.truncated) continue;
			findings.push({
				checkId: "core/doctor/bootstrap-size",
				severity: "info",
				message: `${file.name} is near the configured bootstrap file limit.`,
				path: file.path,
				fixHint: "Reduce the file size or tune agents.defaults.bootstrapMaxChars."
			});
		}
		if (analysis.totalNearLimit) findings.push({
			checkId: "core/doctor/bootstrap-size",
			severity: analysis.hasTruncation ? "warning" : "info",
			message: "Total bootstrap context is near the configured total limit.",
			path: workspaceDir,
			fixHint: "Reduce bootstrap file sizes or tune agents.defaults.bootstrapTotalMaxChars."
		});
		return findings;
	}
};
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
		const { noteClaudeCliHealth } = await import("./doctor-claude-cli-DbNY_Ttk.js");
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
		kind: "core",
		description: "Security posture checks produce structured findings.",
		source: "doctor",
		async detect(ctx) {
			return (await deps.collectSecurityWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
				checkId: "core/doctor/security",
				severity: warning.includes("CRITICAL") ? "error" : "warning",
				text: warning
			}));
		}
	};
}
const openAIOAuthTlsCheck = {
	id: "core/doctor/oauth-tls",
	kind: "core",
	description: "OpenAI OAuth TLS prerequisites are satisfied before browser auth.",
	source: "doctor",
	async detect(ctx) {
		const { formatOpenAIOAuthTlsPreflightFix, runOpenAIOAuthTlsPreflight, shouldRunOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-eTkcfJWY.js");
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
	async detect() {
		const { collectLegacyWhatsAppCrontabHealthWarning } = await import("./cron-DQ0bILn_.js");
		const warning = await collectLegacyWhatsAppCrontabHealthWarning();
		if (!warning) return [];
		return [noteTextToFinding({
			checkId: "core/doctor/legacy-whatsapp-crontab",
			severity: "warning",
			text: warning
		})];
	}
};
const codexSessionRoutesCheck = {
	id: CODEX_SESSION_ROUTES_CHECK_ID,
	kind: "core",
	description: "Codex runtime routes have a registered Codex plugin harness before sessions run.",
	source: "doctor",
	async detect(ctx) {
		return collectDisabledCodexPluginRouteIssues(ctx.cfg).map((issue) => ({
			checkId: CODEX_SESSION_ROUTES_CHECK_ID,
			severity: "warning",
			message: [`${issue.path} routes ${issue.modelRef} to ${issue.canonicalModel}`, "with Codex runtime, but the Codex plugin is disabled by config."].join(" "),
			path: issue.path,
			target: issue.canonicalModel,
			requirement: "Codex plugin enabled for routes that use the Codex runtime.",
			fixHint: issue.blockedOutsideEntry ? ["Enable plugin loading and remove codex from plugins.deny,", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ") : ["Run `openclaw doctor --fix`: it enables plugins.entries.codex,", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ")
		}));
	}
};
const gatewayServicesExtraCheck = {
	id: GATEWAY_SERVICES_EXTRA_CHECK_ID,
	kind: "core",
	description: "Extra gateway-like services are represented as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToHealthFinding } = await import("./doctor-gateway-services-utnFh_9i.js");
		return (await detectExtraGatewayServiceIssues({ deep: coreCtx.deep === true })).map(extraGatewayServiceToHealthFinding);
	},
	async repair(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToRepairEffects } = await import("./doctor-gateway-services-utnFh_9i.js");
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
		const { collectMacGatewayPlatformWarnings } = await import("./doctor-platform-notes-CowmzM2G.js");
		return (await collectMacGatewayPlatformWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
			checkId: "core/doctor/gateway-services/platform-notes",
			severity: "warning",
			text: warning
		}));
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
	}
};
function createSkillsReadinessCheck(deps) {
	return {
		id: "core/doctor/skills-readiness",
		kind: "core",
		description: "Allowed skills are usable in the current runtime environment.",
		source: "doctor",
		async detect(ctx, scope) {
			return filterUnavailableSkillsForScope(await deps.detectUnavailableSkills(ctx.cfg), scope?.paths).map(unavailableSkillToFinding);
		},
		async repair(ctx, findings) {
			const unavailable = filterUnavailableSkillsForScope(await deps.detectUnavailableSkills(ctx.cfg), findings.map((finding) => finding.path));
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
const finalConfigValidationCheck = {
	id: FINAL_CONFIG_VALIDATION_CHECK_ID,
	kind: "core",
	description: "Active openclaw.jsonc parses and conforms to the config schema.",
	source: "doctor",
	async detect() {
		const { readConfigFileSnapshot } = await import("./config/config.js");
		const snap = await readConfigFileSnapshot({ observe: false });
		if (!snap.exists || snap.valid) return [];
		return configValidationIssuesToHealthFindings(snap.issues);
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
		const effects = shellCompletionStatusToRepairEffects(await checkShellCompletionStatus());
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
		source: "doctor",
		async detect(ctx) {
			const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
			return (await deps.collectWorkspaceSuggestionNotes(workspaceDir)).map((text) => noteTextToFinding({
				checkId: "core/doctor/workspace-suggestions",
				severity: "info",
				text
			}));
		}
	};
}
function createConvertedWorkflowChecks(deps) {
	return [
		claudeCliCheck,
		gatewayAuthCheck,
		legacyStateCheck,
		legacyWhatsAppCrontabCheck,
		codexSessionRoutesCheck,
		shellCompletionCheck,
		uiProtocolFreshnessCheck,
		gatewayServicesExtraCheck,
		gatewayPlatformNotesCheck,
		createSecurityCheck(deps),
		browserCheck,
		openAIOAuthTlsCheck,
		hooksModelCheck,
		bootstrapSizeCheck,
		createProviderCatalogProjectionCheck(deps),
		createRuntimeToolSchemaCheck(deps),
		createWorkspaceSuggestionsCheck(deps)
	];
}
let registered = false;
/** @deprecated Core doctor flows use ordered doctor contributions; keep this only for SDK compatibility. */
function registerCoreHealthChecks() {
	if (registered) return;
	for (const check of CORE_HEALTH_CHECKS) registerHealthCheck(check);
	registered = true;
}
function resetCoreHealthChecksForTest() {
	registered = false;
}
function createCoreHealthChecks(deps = defaultCoreHealthCheckDeps) {
	return [
		gatewayConfigCheck,
		...createConvertedWorkflowChecks(deps),
		commandOwnerCheck,
		createSkillsReadinessCheck(deps),
		browserClawdProfileResidueCheck,
		finalConfigValidationCheck
	];
}
const CORE_HEALTH_CHECKS = createCoreHealthChecks();
//#endregion
export { createCoreHealthChecks as a, configValidationIssuesToHealthFindings as i, buildGatewayTokenSecretRefFixHint as n, registerCoreHealthChecks as o, buildGatewayTokenSecretRefUnavailableMessage as r, resetCoreHealthChecksForTest as s, CORE_HEALTH_CHECKS as t };
