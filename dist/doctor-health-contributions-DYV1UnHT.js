import { a as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-p2Xhj7Jg.js";
import { t as normalizeHealthCheck } from "./health-check-adapter-BzEj_NKG.js";
import fs from "node:fs";
//#region src/flows/doctor-health-contributions.ts
const loadAgentDefaultsModule = async () => await import("./defaults-RurGC76M.js");
const loadAgentScopeModule = async () => await import("./agent-scope-D47Q6HJs.js");
const loadCommandFormatModule = async () => await import("./command-format-CunSoFNz.js");
const loadConfigModule = async () => await import("./config/config.js");
const loadDoctorCoreChecksModule = async () => await import("./doctor-core-checks-aW7_hOJC.js");
const loadDoctorStateIntegrityModule = async () => await import("./doctor-state-integrity-Cgoe4Wx0.js");
const loadHealthCheckRegistryModule = async () => await import("./health-check-registry-BzU8tXic.js");
const loadModelCatalogModule = async () => await import("./model-catalog-CTcoVG4G.js");
const loadModelSelectionModule = async () => await import("./model-selection-BnOgOkmR.js");
const loadNoteModule = async () => await import("./terminal-core/note.js");
const loadOnboardHelpersModule = async () => await import("./onboard-helpers-2C1mLZ5h.js");
const loadSecretTypesModule = async () => await import("./types.secrets-Bk8t-ZY6.js");
function isUpdateDoctorRun(env) {
	const value = env.OPENCLAW_UPDATE_IN_PROGRESS;
	return value === "1" || value === "true";
}
function resolveDoctorMode(cfg) {
	return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function isTruthyEnvValue(value) {
	if (!value) return false;
	const normalized = value.trim().toLowerCase();
	return normalized !== "" && normalized !== "0" && normalized !== "false" && normalized !== "no";
}
function shouldSkipLegacyUpdateDoctorConfigWrite(params) {
	if (!isTruthyEnvValue(params.env.OPENCLAW_UPDATE_IN_PROGRESS)) return false;
	if (isTruthyEnvValue(params.env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"])) return false;
	return true;
}
function createDoctorHealthContribution(params) {
	const healthChecks = normalizeHealthChecks({
		contributionId: params.id,
		healthChecks: params.healthChecks
	});
	const healthCheckIds = params.healthCheckIds ?? healthChecks.map((check) => check.id);
	if (params.run === void 0 && healthChecks.length === 0) throw new Error(`doctor contribution ${params.id} must define run or healthChecks`);
	return {
		id: params.id,
		kind: "core",
		surface: "health",
		option: {
			value: params.id,
			label: params.label,
			...params.hint ? { hint: params.hint } : {}
		},
		source: "doctor",
		healthChecks,
		healthCheckIds,
		run: params.run ?? ((ctx) => runStructuredDoctorHealthContribution({
			contributionId: params.id,
			ctx,
			checks: healthChecks
		}))
	};
}
function normalizeHealthChecks(params) {
	if (params.healthChecks === void 0) return [];
	const checks = Array.isArray(params.healthChecks) ? params.healthChecks : [params.healthChecks];
	return checks.map((check) => normalizeContributionHealthCheck({
		check,
		contributionId: params.contributionId,
		count: checks.length
	}));
}
function normalizeContributionHealthCheck(params) {
	const id = params.check.id ?? (params.count === 1 ? deriveCoreHealthCheckId(params.contributionId) : void 0);
	if (id === void 0) throw new Error(`doctor contribution ${params.contributionId} must specify health check ids when it declares multiple healthChecks`);
	return {
		...params.check,
		id,
		kind: params.check.kind ?? "core",
		source: params.check.source ?? "doctor"
	};
}
function deriveCoreHealthCheckId(contributionId) {
	if (contributionId.startsWith("doctor:")) return `core/doctor/${contributionId.slice(7)}`;
	return `core/doctor/${contributionId}`;
}
async function runStructuredDoctorHealthContribution(params) {
	if (params.checks.length === 0) throw new Error(`doctor contribution ${params.contributionId} has no structured health`);
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-BfHI6ZCN.js");
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await import("./agent-scope-D47Q6HJs.js");
	const workspaceDir = resolveAgentWorkspaceDir(params.ctx.cfg, resolveDefaultAgentId(params.ctx.cfg));
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: params.ctx.runtime,
		cfg: params.ctx.cfg,
		cwd: workspaceDir,
		configPath: params.ctx.configPath,
		dryRun: !params.ctx.prompter.shouldRepair,
		allowExecSecretRefs: params.ctx.options.allowExec === true
	}, {
		checks: params.checks,
		dryRun: !params.ctx.prompter.shouldRepair
	});
	params.ctx.cfg = result.config;
	renderStructuredHealthFindings(params.ctx, result.findings);
	for (const warning of result.warnings) params.ctx.runtime.error(warning);
	for (const change of result.changes) params.ctx.runtime.log(change);
}
function renderStructuredHealthFindings(ctx, findings) {
	for (const finding of findings) {
		(finding.severity === "error" ? ctx.runtime.error : ctx.runtime.log)(formatStructuredHealthFinding(finding));
		if (finding.fixHint !== void 0) ctx.runtime.log(`  fix: ${finding.fixHint}`);
	}
}
function formatStructuredHealthFinding(finding) {
	const where = finding.path !== void 0 ? ` ${finding.path}` : "";
	const line = finding.line !== void 0 ? `:${finding.line}` : "";
	return `[${finding.severity}] ${finding.checkId}${where}${line} - ${finding.message}`;
}
async function runGatewayConfigHealth(ctx) {
	const { formatCliCommand } = await loadCommandFormatModule();
	const { hasAmbiguousGatewayAuthModeConfig } = await import("./auth-mode-policy-DmjIlDFZ.js");
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
async function runAuthProfileHealth(ctx) {
	const { maybeRepairLegacyFlatAuthProfileStores, maybeRepairCanonicalApiKeyFieldAlias } = await import("./doctor-auth-flat-profiles-hoY5DxLS.js");
	const { maybeRepairLegacyOAuthProfileIds } = await import("./doctor-auth-legacy-oauth-Nwe1w932.js");
	const { maybeRepairLegacyOAuthSidecarProfiles } = await import("./doctor-auth-oauth-sidecar-C-qi3VX6.js");
	const { noteAuthProfileHealth, noteLegacyCodexProviderOverride } = await import("./doctor-auth-BOP7LPpz.js");
	const { buildGatewayConnectionDetails } = await import("./call-CgIJVeW0.js");
	const { note } = await loadNoteModule();
	await maybeRepairLegacyFlatAuthProfileStores({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await maybeRepairCanonicalApiKeyFieldAlias({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await maybeRepairLegacyOAuthSidecarProfiles({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	ctx.cfg = await maybeRepairLegacyOAuthProfileIds(ctx.cfg, ctx.prompter);
	await noteAuthProfileHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		allowKeychainPrompt: ctx.options.nonInteractive !== true && process.stdin.isTTY
	});
	noteLegacyCodexProviderOverride(ctx.cfg);
	ctx.gatewayDetails = buildGatewayConnectionDetails({ config: ctx.cfg });
	if (ctx.gatewayDetails.remoteFallbackNote) note(ctx.gatewayDetails.remoteFallbackNote, "Gateway");
}
async function runGatewayAuthHealth(ctx) {
	const { resolveSecretInputRef } = await loadSecretTypesModule();
	const { buildGatewayTokenSecretRefFixHint, buildGatewayTokenSecretRefUnavailableMessage } = await loadDoctorCoreChecksModule();
	const { resolveGatewayAuth } = await import("./auth-BloRIPhC.js");
	const { resolveGatewayAuthToken } = await import("./auth-token-resolution-DGYul15w.js");
	const { note } = await loadNoteModule();
	const { randomToken } = await loadOnboardHelpersModule();
	if (resolveDoctorMode(ctx.cfg) !== "local" || !ctx.sourceConfigValid) return;
	const gatewayTokenRef = resolveSecretInputRef({
		value: ctx.cfg.gateway?.auth?.token,
		defaults: ctx.cfg.secrets?.defaults
	}).ref;
	const auth = resolveGatewayAuth({
		authConfig: ctx.cfg.gateway?.auth,
		tailscaleMode: ctx.cfg.gateway?.tailscale?.mode ?? "off"
	});
	const hasInlineToken = typeof auth.token === "string" && auth.token.trim() !== "";
	if (!(auth.mode !== "password" && auth.mode !== "none" && auth.mode !== "trusted-proxy" && (auth.mode !== "token" || !hasInlineToken || Boolean(gatewayTokenRef)))) return;
	let unresolvedRefReason;
	if (gatewayTokenRef && gatewayTokenRef.source === "exec") {
		const { getSkippedExecRefStaticError } = await import("./exec-resolution-policy-DK44Su4I.js");
		if (getSkippedExecRefStaticError({
			ref: gatewayTokenRef,
			config: ctx.cfg
		})) unresolvedRefReason = void 0;
		else if (ctx.options.allowExec !== true) return;
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: ctx.env ?? process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: "never"
			});
			if (resolvedToken.source === "secretRef") return;
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
	} else {
		const resolvedToken = await resolveGatewayAuthToken({
			cfg: ctx.cfg,
			env: ctx.env ?? process.env,
			unresolvedReasonStyle: "detailed",
			envFallback: gatewayTokenRef ? "never" : "always"
		});
		if (gatewayTokenRef ? resolvedToken.source === "secretRef" : resolvedToken.token) return;
		unresolvedRefReason = resolvedToken.unresolvedRefReason;
	}
	if (gatewayTokenRef) {
		note([
			buildGatewayTokenSecretRefUnavailableMessage({
				cfg: ctx.cfg,
				ref: gatewayTokenRef,
				unresolvedRefReason
			}),
			"Doctor will not overwrite gateway.auth.token with a plaintext value.",
			buildGatewayTokenSecretRefFixHint(gatewayTokenRef)
		].join("\n"), "Gateway auth");
		return;
	}
	note("Gateway auth is off or missing a token. Token auth is now the recommended default (including loopback).", "Gateway auth");
	if (!(ctx.options.generateGatewayToken === true ? true : ctx.options.nonInteractive === true ? false : await ctx.prompter.confirmAutoFix({
		message: "Generate and configure a gateway token now?",
		initialValue: true
	}))) return;
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
async function runCommandOwnerHealth(ctx) {
	const { noteCommandOwnerHealth } = await import("./doctor-command-owner-CaucNBtq.js");
	noteCommandOwnerHealth(ctx.cfg);
}
async function runStructuredHealthRepairs(ctx) {
	if (!ctx.prompter.shouldRepair) return;
	const { registerBundledHealthChecks } = await import("./bundled-health-checks-y1mWoWLY.js");
	const { listExtensionHealthChecksForDoctor } = await loadHealthCheckRegistryModule();
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-BfHI6ZCN.js");
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
	const { note } = await loadNoteModule();
	const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
	registerBundledHealthChecks({
		cfg: ctx.cfg,
		cwd: workspaceDir
	});
	const checks = listExtensionHealthChecksForDoctor(await resolveDoctorContributionHealthChecks());
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: workspaceDir,
		configPath: ctx.configPath
	}, { checks });
	ctx.cfg = result.config;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runClaudeCliHealth(ctx) {
	const { noteClaudeCliHealth } = await import("./doctor-claude-cli-DbNY_Ttk.js");
	noteClaudeCliHealth(ctx.cfg);
}
async function runCoreContributionHealthRepair(ctx, checkIds) {
	if (!ctx.prompter.shouldRepair || checkIds.length === 0) return;
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-aW7_hOJC.js");
	const { runDoctorHealthRepairs } = await import("./doctor-repair-flow-BfHI6ZCN.js");
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await import("./agent-scope-D47Q6HJs.js");
	const { note } = await import("./terminal-core/note.js");
	const selectedIds = new Set(checkIds);
	const checks = CORE_HEALTH_CHECKS.filter((check) => selectedIds.has(check.id));
	if (checks.length === 0) return;
	const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
	const result = await runDoctorHealthRepairs({
		mode: "fix",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: workspaceDir,
		configPath: ctx.configPath
	}, { checks });
	ctx.cfg = result.config;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runLegacyStateHealth(ctx) {
	const { detectLegacyStateMigrations, runLegacyStateMigrations } = await import("./doctor-state-migrations-BUTRFw4u.js");
	const { note } = await loadNoteModule();
	const legacyState = await detectLegacyStateMigrations({ cfg: ctx.cfg });
	if (legacyState.preview.length === 0) return;
	note(legacyState.preview.join("\n"), "Legacy state detected");
	if (!(ctx.options.nonInteractive === true ? true : await ctx.prompter.confirm({
		message: "Migrate legacy state (sessions/agent/WhatsApp auth) now?",
		initialValue: true
	}))) return;
	const migrated = await runLegacyStateMigrations({
		detected: legacyState,
		recoverCorruptTargetStore: ctx.options.repair === true || ctx.options.yes === true
	});
	if (migrated.changes.length > 0) note(migrated.changes.join("\n"), "Doctor changes");
	if (migrated.warnings.length > 0) note(migrated.warnings.join("\n"), "Doctor warnings");
}
async function runLegacyPluginManifestHealth(ctx) {
	const { maybeRepairLegacyPluginManifestContracts } = await import("./doctor-plugin-manifests-DULxKpdf.js");
	await maybeRepairLegacyPluginManifestContracts({
		config: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		prompter: ctx.prompter
	});
}
async function runPluginRegistryHealth(ctx) {
	const { maybeRepairPluginRegistryState } = await import("./doctor-plugin-registry-Cnan6Y_6.js");
	ctx.cfg = await maybeRepairPluginRegistryState({
		config: ctx.cfg,
		env: process.env,
		prompter: ctx.prompter
	});
}
async function runReleaseConfiguredPluginInstallsHealth(ctx) {
	if (!ctx.sourceConfigValid) return;
	if (!ctx.prompter.shouldRepair) return;
	const { maybeRunConfiguredPluginInstallReleaseStep } = await import("./release-configured-plugin-installs-arGjretS.js");
	const { note } = await loadNoteModule();
	const { VERSION } = await import("./version-BmsGkjsI.js");
	const result = await maybeRunConfiguredPluginInstallReleaseStep({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		touchedVersion: ctx.configResult.sourceLastTouchedVersion ?? ctx.cfg.meta?.lastTouchedVersion
	});
	if (result.postInstallDoctorResult) ctx.postInstallDoctorResult = result.postInstallDoctorResult;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
	if (!result.touchedConfig) return;
	const lastTouchedVersion = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env) ? ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion || VERSION : VERSION;
	ctx.cfg = {
		...ctx.cfg,
		meta: {
			...ctx.cfg.meta,
			lastTouchedVersion,
			lastTouchedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
async function runDiskSpaceHealth(ctx) {
	const { noteDiskSpace } = await import("./doctor-disk-space-DMyyMdUX.js");
	noteDiskSpace(ctx.cfg);
}
async function runStateIntegrityHealth(ctx) {
	const { noteStateIntegrity } = await loadDoctorStateIntegrityModule();
	await noteStateIntegrity(ctx.cfg, ctx.prompter, ctx.configPath);
}
async function runCodexSessionRouteHealth(ctx) {
	const { maybeRepairCodexSessionRoutes } = await import("./codex-route-warnings-o0eWQhtT.js");
	const { note } = await loadNoteModule();
	const result = await maybeRepairCodexSessionRoutes({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runSessionLocksHealth(ctx) {
	const { noteSessionLockHealth } = await import("./doctor-session-locks-BvoF3s_p.js");
	await noteSessionLockHealth({
		shouldRepair: ctx.prompter.shouldRepair,
		config: ctx.cfg,
		env: ctx.env
	});
}
async function runSessionTranscriptsHealth(ctx) {
	const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-B-XPgzeg.js");
	await noteSessionTranscriptHealth({ shouldRepair: ctx.prompter.shouldRepair });
}
async function runSessionSnapshotsHealth(ctx) {
	const { noteSessionSnapshotHealth } = await import("./doctor-session-snapshots-DD3D7VTq.js");
	await noteSessionSnapshotHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runConfigAuditScrubHealth(ctx) {
	const { maybeScrubConfigAuditLog } = await import("./doctor-config-audit-scrub-D6ChKEvX.js");
	await maybeScrubConfigAuditLog({ shouldRepair: ctx.prompter.shouldRepair });
}
async function runLegacyCronHealth(ctx) {
	const { maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck } = await import("./cron-DQ0bILn_.js");
	await noteLegacyWhatsAppCrontabHealthCheck();
	await maybeRepairLegacyCronStore({
		cfg: ctx.cfg,
		options: ctx.options,
		prompter: ctx.prompter
	});
}
async function runSandboxHealth(ctx) {
	const { maybeRepairSandboxImages, maybeRepairSandboxRegistryFiles, noteSandboxScopeWarnings } = await import("./doctor-sandbox-BlwSqvFB.js");
	await maybeRepairSandboxRegistryFiles(ctx.prompter);
	ctx.cfg = await maybeRepairSandboxImages(ctx.cfg, ctx.runtime, ctx.prompter);
	noteSandboxScopeWarnings(ctx.cfg);
}
async function runGatewayServicesHealth(ctx) {
	const { maybeRepairGatewayServiceConfig, maybeScanExtraGatewayServices } = await import("./doctor-gateway-services-utnFh_9i.js");
	const { noteMacLaunchAgentOverrides, noteMacLaunchctlGatewayEnvOverrides, noteMacStaleOpenClawUpdateLaunchdJobs } = await import("./doctor-platform-notes-CowmzM2G.js");
	await maybeScanExtraGatewayServices(ctx.options, ctx.runtime, ctx.prompter);
	await maybeRepairGatewayServiceConfig(ctx.cfg, resolveDoctorMode(ctx.cfg), ctx.runtime, ctx.prompter, { allowExecSecretRefs: ctx.options.allowExec === true });
	await noteMacLaunchAgentOverrides();
	await noteMacStaleOpenClawUpdateLaunchdJobs();
	await noteMacLaunchctlGatewayEnvOverrides(ctx.cfg);
}
async function runStartupChannelMaintenanceHealth(ctx) {
	const { maybeRunDoctorStartupChannelMaintenance } = await import("./doctor-startup-channel-maintenance-CPU1ZZ-r.js");
	await maybeRunDoctorStartupChannelMaintenance({
		cfg: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSecurityHealth(ctx) {
	const { noteInstallPolicyHealth } = await import("./doctor-install-policy-DIkEZzUM.js");
	const { noteSecurityWarnings } = await import("./doctor-security-D0pmbMcw.js");
	await noteSecurityWarnings(ctx.cfg);
	await noteInstallPolicyHealth(ctx.cfg, {
		deep: ctx.options.deep === true,
		env: ctx.env
	});
}
async function runBrowserHealth(ctx) {
	const { noteChromeMcpBrowserReadiness } = await import("./doctor-browser-DHw_o9NU.js");
	await runCoreContributionHealthRepair(ctx, ["core/doctor/browser-clawd-profile-residue"]);
	await noteChromeMcpBrowserReadiness(ctx.cfg);
}
async function runOpenAIOAuthTlsHealth(ctx) {
	const { noteOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-eTkcfJWY.js");
	await noteOpenAIOAuthTlsPrerequisites({
		cfg: ctx.cfg,
		deep: ctx.options.deep === true
	});
}
async function runHooksModelHealth(ctx) {
	if (!ctx.cfg.hooks?.gmail?.model?.trim()) return;
	const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await loadAgentDefaultsModule();
	const { loadModelCatalog } = await loadModelCatalogModule();
	const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await loadModelSelectionModule();
	const { note } = await loadNoteModule();
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
	const warnings = [];
	if (!status.allowed) warnings.push(`- hooks.gmail.model "${status.key}" not in agents.defaults.models allowlist (will use primary instead)`);
	if (!status.inCatalog) warnings.push(`- hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
	if (warnings.length > 0) note(warnings.join("\n"), "Hooks");
}
async function runToolResultCapHealth(ctx) {
	const { resolveAgentContextLimits } = await loadAgentScopeModule();
	const { normalizeAgentId } = await import("./session-key-CKu-8uZ1.js");
	const targets = [];
	const defaultsConfiguredCap = ctx.cfg.agents?.defaults?.contextLimits?.toolResultMaxChars;
	if (ctx.options.deep === true || defaultsConfiguredCap !== void 0) targets.push({
		configuredCap: defaultsConfiguredCap,
		scopeLabel: "defaults"
	});
	for (const entry of ctx.cfg.agents?.list ?? []) {
		const normalizedAgentId = normalizeAgentId(entry.id);
		if (!normalizedAgentId || ctx.options.deep !== true && defaultsConfiguredCap === void 0 && entry.contextLimits?.toolResultMaxChars === void 0) continue;
		targets.push({
			agentId: normalizedAgentId,
			configuredCap: resolveAgentContextLimits(ctx.cfg, normalizedAgentId)?.toolResultMaxChars,
			scopeLabel: `agent "${normalizedAgentId}"`
		});
	}
	if (targets.length === 0) return;
	const { DEFAULT_CONTEXT_TOKENS } = await loadAgentDefaultsModule();
	const { loadModelCatalog, findModelCatalogEntry } = await loadModelCatalogModule();
	const { resolveContextWindowInfo } = await import("./context-window-guard-CxLnypKT.js");
	const { resolveDefaultModelForAgent, modelKey } = await loadModelSelectionModule();
	const { buildToolResultCapDoctorAdvice } = await import("./doctor-tool-result-cap-advice-CUiFL5OF.js");
	const { note } = await loadNoteModule();
	const catalog = await loadModelCatalog({ config: ctx.cfg });
	const lines = targets.flatMap((target) => {
		const modelRef = resolveDefaultModelForAgent({
			cfg: ctx.cfg,
			agentId: target.agentId
		});
		const entry = findModelCatalogEntry(catalog, {
			provider: modelRef.provider,
			modelId: modelRef.model
		});
		return buildToolResultCapDoctorAdvice({
			contextWindowTokens: resolveContextWindowInfo({
				cfg: ctx.cfg,
				provider: modelRef.provider,
				modelId: modelRef.model,
				modelContextTokens: entry?.contextTokens,
				modelContextWindow: entry?.contextWindow,
				defaultTokens: DEFAULT_CONTEXT_TOKENS
			}).tokens,
			modelKey: modelKey(modelRef.provider, modelRef.model),
			configuredCap: target.configuredCap,
			deep: ctx.options.deep === true,
			scopeLabel: target.scopeLabel
		});
	});
	if (lines.length > 0) note(lines.join("\n"), "Tool result cap");
}
async function runSystemdLingerHealth(ctx) {
	if (ctx.options.nonInteractive === true || process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local") return;
	const { resolveGatewayService } = await import("./service-D3v2TH-e.js");
	const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-CuzzITVy.js");
	const { note } = await loadNoteModule();
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch {
		loaded = false;
	}
	if (!loaded) return;
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
async function hasActiveGatewayExecCredential(ctx, mode = resolveDoctorMode(ctx.cfg)) {
	const { resolveSecretInputRef } = await loadSecretTypesModule();
	const { gatewaySecretInputPathCanWin } = await import("./credentials-secret-inputs-DPEtZGqf.js");
	const { ALL_GATEWAY_SECRET_INPUT_PATHS, readGatewaySecretInputValue } = await import("./secret-input-paths-B4b1wPE8.js");
	return ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
		if (!gatewaySecretInputPathCanWin({
			config: ctx.cfg,
			env: process.env,
			modeOverride: mode,
			path
		})) return false;
		return resolveSecretInputRef({
			value: readGatewaySecretInputValue(ctx.cfg, path),
			defaults: ctx.cfg.secrets?.defaults
		}).ref?.source === "exec";
	});
}
async function runWorkspaceStatusHealth(ctx) {
	let pluginVersionDrift;
	if (ctx.cfg.gateway?.mode !== "remote") try {
		const { gatherDaemonStatus } = await import("./status.gather-aETBHVZ_.js");
		const allowExecSecretRefs = ctx.options.allowExec === true;
		const status = await gatherDaemonStatus({
			rpc: {
				timeout: ctx.options.nonInteractive === true ? "3000" : "10000",
				json: true
			},
			probe: true,
			requireRpc: false,
			deep: ctx.options.deep === true,
			allowExecSecretRefs
		});
		const hasProbedGatewayVersion = typeof status.gateway?.version === "string" && status.gateway.version.trim() !== "";
		if (status.pluginVersionDrift && hasProbedGatewayVersion && !status.rpc?.authWarning) pluginVersionDrift = status.pluginVersionDrift;
	} catch {}
	const { noteWorkspaceStatus } = await import("./doctor-workspace-status-EFjO50-i.js");
	noteWorkspaceStatus(ctx.cfg, { pluginVersionDrift });
}
async function runSkillsHealth(ctx) {
	const { maybeRepairSkillReadiness } = await import("./doctor-skills-CKBZwGOo.js");
	ctx.cfg = await maybeRepairSkillReadiness({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
}
async function runBootstrapSizeHealth(ctx) {
	const { noteBootstrapFileSize } = await import("./doctor-bootstrap-size-BM9XT9zC.js");
	await noteBootstrapFileSize(ctx.cfg);
}
async function runHeartbeatTemplateRepairHealth(ctx) {
	const { maybeRepairHeartbeatTemplate } = await import("./doctor-heartbeat-template-repair-BV7HbNEI.js");
	await maybeRepairHeartbeatTemplate({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runShellCompletionHealth(ctx) {
	const { doctorShellCompletion } = await import("./doctor-completion-z29Qmtka.js");
	await doctorShellCompletion(ctx.runtime, ctx.prompter, { nonInteractive: ctx.options.nonInteractive });
}
async function runGatewayHealthChecks(ctx) {
	const { note } = await loadNoteModule();
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
	const { checkGatewayHealth, probeGatewayMemoryStatus } = await import("./doctor-gateway-health-C-H-3DjP.js");
	const { healthOk, authenticated, status } = await checkGatewayHealth({
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4
	});
	ctx.gatewayHealthSkipped = false;
	ctx.healthOk = healthOk;
	ctx.gatewayHealthAuthenticated = authenticated;
	ctx.gatewayStatus = status;
	ctx.gatewayMemoryProbe = authenticated ? await probeGatewayMemoryStatus({
		cfg: ctx.cfg,
		timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4
	}) : {
		checked: false,
		ready: false,
		skipped: healthOk
	};
}
async function runWhatsappResponsivenessHealth(ctx) {
	const { noteWhatsappResponsivenessHealth } = await import("./doctor-whatsapp-responsiveness-BCp0Bn9R.js");
	await noteWhatsappResponsivenessHealth({
		cfg: ctx.cfg,
		status: ctx.gatewayStatus,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runMemorySearchHealthContribution(ctx) {
	const { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth } = await import("./doctor-memory-search-CUhiXmbL.js");
	if (ctx.prompter.shouldRepair) await maybeRepairMemoryRecallHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await noteMemorySearchHealth(ctx.cfg, { gatewayMemoryProbe: ctx.gatewayMemoryProbe ?? {
		checked: false,
		ready: false,
		skipped: false
	} });
	if (ctx.options.deep === true) await noteMemoryRecallHealth(ctx.cfg);
}
async function runDevicePairingHealth(ctx) {
	const { noteDevicePairingHealth } = await import("./doctor-device-pairing-DawytRcv.js");
	await noteDevicePairingHealth({
		cfg: ctx.cfg,
		healthOk: ctx.healthOk ?? false
	});
}
async function runGatewayDaemonHealth(ctx) {
	const { maybeRepairGatewayDaemon } = await import("./doctor-gateway-daemon-flow-DlYVWxEn.js");
	await maybeRepairGatewayDaemon({
		cfg: ctx.cfg,
		runtime: ctx.runtime,
		prompter: ctx.prompter,
		options: ctx.options,
		gatewayDetailsMessage: ctx.gatewayDetails?.message ?? "",
		healthOk: ctx.healthOk ?? false,
		healthSkipped: ctx.gatewayHealthSkipped === true
	});
}
async function runWriteConfigHealth(ctx) {
	const { formatCliCommand } = await loadCommandFormatModule();
	const { applyWizardMetadata } = await loadOnboardHelpersModule();
	const { replaceConfigFile } = await loadConfigModule();
	const { logConfigUpdated } = await import("./logging-A_v9ujlt.js");
	const { shortenHomePath } = await import("./utils-B_688fa4.js");
	if (ctx.configResult.shouldWriteConfig || JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence)) {
		const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
		ctx.cfg = applyWizardMetadata(ctx.cfg, {
			command: "doctor",
			mode: resolveDoctorMode(ctx.cfg)
		});
		if (shouldSkipLegacyUpdateDoctorConfigWrite({ env: ctx.env ?? process.env })) {
			ctx.runtime.log("Skipping doctor config write during legacy update handoff.");
			return;
		}
		const legacyParentVersionOverride = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env) ? ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion : void 0;
		await replaceConfigFile({
			nextConfig: ctx.cfg,
			afterWrite: { mode: "auto" },
			writeOptions: {
				allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
				skipPluginValidation: ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
				preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
				...legacyParentVersionOverride ? { lastTouchedVersionOverride: legacyParentVersionOverride } : {}
			}
		});
		logConfigUpdated(ctx.runtime);
		const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
		if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath)) ctx.runtime.log(`Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`);
		const backupPath = `${ctx.configPath}.bak`;
		if (fs.existsSync(backupPath)) ctx.runtime.log(`Backup: ${shortenHomePath(backupPath)}`);
		return;
	}
	if (!ctx.prompter.shouldRepair) ctx.runtime.log(`Run "${formatCliCommand("openclaw doctor --fix")}" to apply changes.`);
}
async function runWorkspaceSuggestionsHealth(ctx) {
	if (ctx.options.workspaceSuggestions === false) return;
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
	const { noteWorkspaceBackupTip } = await loadDoctorStateIntegrityModule();
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await import("./doctor-workspace-BrWuv5Qj.js");
	const { note } = await loadNoteModule();
	const workspaceDir = resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg));
	noteWorkspaceBackupTip(workspaceDir);
	if (await shouldSuggestMemorySystem(workspaceDir)) note(MEMORY_SYSTEM_PROMPT, "Workspace");
}
async function runFinalConfigValidationHealth(ctx) {
	const { readConfigFileSnapshot } = await loadConfigModule();
	const finalSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: isUpdateDoctorRun(ctx.env ?? process.env),
		preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys
	});
	if (finalSnapshot.exists && !finalSnapshot.valid) {
		ctx.runtime.error("Invalid config:");
		for (const issue of finalSnapshot.issues) {
			const path = issue.path || "<root>";
			ctx.runtime.error(`- ${path}: ${issue.message}`);
		}
	}
}
function formatHealthFindings(findings) {
	return findings.map((finding) => {
		const lines = [`- ${finding.message}`];
		if (finding.path) lines.push(`  path: ${finding.path}`);
		if (finding.requirement) lines.push(`  issue: ${finding.requirement}`);
		if (finding.fixHint) lines.push(`  fix: ${finding.fixHint}`);
		return lines.join("\n");
	}).join("\n");
}
async function runProviderCatalogProjectionHealth(ctx) {
	const { registerCoreHealthChecks } = await loadDoctorCoreChecksModule();
	const { getHealthCheck } = await loadHealthCheckRegistryModule();
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
	const { note } = await loadNoteModule();
	registerCoreHealthChecks();
	const check = getHealthCheck("core/doctor/provider-catalog-projection");
	if (!check) return;
	const findings = await check.detect({
		mode: "doctor",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg)),
		configPath: ctx.configPath
	});
	if (findings.length === 0) return;
	ctx.healthOk = false;
	note(formatHealthFindings(findings), "Doctor warnings");
}
async function runRuntimeToolSchemasHealth(ctx) {
	const { registerCoreHealthChecks } = await loadDoctorCoreChecksModule();
	const { getHealthCheck } = await loadHealthCheckRegistryModule();
	const { resolveAgentWorkspaceDir, resolveDefaultAgentId } = await loadAgentScopeModule();
	const { note } = await loadNoteModule();
	registerCoreHealthChecks();
	const check = getHealthCheck("core/doctor/runtime-tool-schemas");
	if (!check) return;
	const findings = await check.detect({
		mode: "doctor",
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		cwd: resolveAgentWorkspaceDir(ctx.cfg, resolveDefaultAgentId(ctx.cfg)),
		configPath: ctx.configPath
	});
	if (findings.length === 0) return;
	ctx.healthOk = false;
	note(formatHealthFindings(findings), "Doctor warnings");
}
function resolveDoctorHealthContributions() {
	return [
		createDoctorHealthContribution({
			id: "doctor:gateway-config",
			label: "Gateway config",
			healthCheckIds: ["core/doctor/gateway-config"],
			run: runGatewayConfigHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:auth-profiles",
			label: "Auth profiles",
			run: runAuthProfileHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:claude-cli",
			label: "Claude CLI",
			healthCheckIds: ["core/doctor/claude-cli"],
			run: runClaudeCliHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-auth",
			label: "Gateway auth",
			healthCheckIds: ["core/doctor/gateway-auth"],
			run: runGatewayAuthHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:command-owner",
			label: "Command owner",
			healthCheckIds: ["core/doctor/command-owner"],
			run: runCommandOwnerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:structured-health-repairs",
			label: "Structured health repairs",
			run: runStructuredHealthRepairs
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-state",
			label: "Legacy state",
			healthCheckIds: ["core/doctor/legacy-state"],
			run: runLegacyStateHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-manifests",
			label: "Legacy plugin manifests",
			run: runLegacyPluginManifestHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:release-configured-plugin-installs",
			label: "Configured plugin repair",
			run: runReleaseConfiguredPluginInstallsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:plugin-registry",
			label: "Plugin registry",
			run: runPluginRegistryHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:ui-protocol-freshness",
			label: "UI protocol freshness",
			healthCheckIds: ["core/doctor/ui-protocol-freshness"],
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:disk-space",
			label: "Disk space",
			run: runDiskSpaceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:state-integrity",
			label: "State integrity",
			run: runStateIntegrityHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:codex-session-routes",
			label: "Codex session routes",
			healthCheckIds: ["core/doctor/codex-session-routes"],
			run: runCodexSessionRouteHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-locks",
			label: "Session locks",
			run: runSessionLocksHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcripts",
			label: "Session transcripts",
			run: runSessionTranscriptsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-snapshots",
			label: "Session snapshots",
			run: runSessionSnapshotsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:config-audit-scrub",
			label: "Config audit",
			run: runConfigAuditScrubHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-cron",
			label: "Legacy cron",
			healthCheckIds: ["core/doctor/legacy-whatsapp-crontab"],
			run: runLegacyCronHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:sandbox",
			label: "Sandbox",
			healthChecks: {
				id: "core/doctor/sandbox/registry-files",
				description: "Legacy sandbox registry files are represented in SQLite registry storage.",
				async detect() {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToHealthFinding } = await import("./doctor-sandbox-BlwSqvFB.js");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToHealthFinding);
				},
				async repair(ctx) {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToRepairEffect } = await import("./doctor-sandbox-BlwSqvFB.js");
					const effects = (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToRepairEffect);
					if (ctx.dryRun === true) return {
						status: "repaired",
						changes: [],
						effects
					};
					return {
						status: "skipped",
						reason: "legacy doctor sandbox contribution owns registry migration",
						changes: [],
						effects
					};
				}
			},
			run: runSandboxHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-services",
			label: "Gateway services",
			healthCheckIds: ["core/doctor/gateway-services/extra", "core/doctor/gateway-services/platform-notes"],
			run: runGatewayServicesHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:startup-channel-maintenance",
			label: "Startup channel maintenance",
			run: runStartupChannelMaintenanceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:security",
			label: "Security",
			healthCheckIds: ["core/doctor/security"],
			run: runSecurityHealth
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
			healthCheckIds: ["core/doctor/oauth-tls"],
			run: runOpenAIOAuthTlsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:hooks-model",
			label: "Hooks model",
			healthCheckIds: ["core/doctor/hooks-model"],
			run: runHooksModelHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:tool-result-cap",
			label: "Tool result cap",
			run: runToolResultCapHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:provider-catalog-projection",
			label: "Provider catalog projection",
			healthCheckIds: ["core/doctor/provider-catalog-projection"],
			run: runProviderCatalogProjectionHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:runtime-tool-schemas",
			label: "Runtime tool schemas",
			healthCheckIds: ["core/doctor/runtime-tool-schemas"],
			run: runRuntimeToolSchemasHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:systemd-linger",
			label: "systemd linger",
			run: runSystemdLingerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:workspace-status",
			label: "Workspace status",
			run: runWorkspaceStatusHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:skills",
			label: "Skills",
			healthCheckIds: ["core/doctor/skills-readiness"],
			run: runSkillsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:bootstrap-size",
			label: "Bootstrap size",
			healthCheckIds: ["core/doctor/bootstrap-size"],
			run: runBootstrapSizeHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-template-repair",
			label: "Heartbeat template repair",
			run: runHeartbeatTemplateRepairHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:shell-completion",
			label: "Shell completion",
			healthCheckIds: ["core/doctor/shell-completion"],
			run: runShellCompletionHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-health",
			label: "Gateway health",
			run: runGatewayHealthChecks
		}),
		createDoctorHealthContribution({
			id: "doctor:whatsapp-responsiveness",
			label: "WhatsApp responsiveness",
			run: runWhatsappResponsivenessHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:memory-search",
			label: "Memory search",
			run: runMemorySearchHealthContribution
		}),
		createDoctorHealthContribution({
			id: "doctor:device-pairing",
			label: "Device pairing",
			run: runDevicePairingHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-daemon",
			label: "Gateway daemon",
			run: runGatewayDaemonHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:write-config",
			label: "Write config",
			run: runWriteConfigHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:workspace-suggestions",
			label: "Workspace suggestions",
			healthCheckIds: ["core/doctor/workspace-suggestions"],
			run: runWorkspaceSuggestionsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:final-config-validation",
			label: "Final config validation",
			healthCheckIds: ["core/doctor/final-config-validation"],
			run: runFinalConfigValidationHealth
		})
	];
}
async function resolveDoctorContributionHealthChecks() {
	const { CORE_HEALTH_CHECKS } = await import("./doctor-core-checks-aW7_hOJC.js");
	const checksById = new Map(CORE_HEALTH_CHECKS.map((check) => [check.id, check]));
	const checks = [];
	for (const contribution of resolveDoctorHealthContributions()) {
		if (contribution.healthChecks.length > 0) {
			checks.push(...contribution.healthChecks.map(normalizeHealthCheck));
			continue;
		}
		for (const id of contribution.healthCheckIds) {
			const check = checksById.get(id);
			if (check === void 0) throw new Error(`doctor contribution ${contribution.id} references unknown core health check ${id}`);
			checks.push(check);
		}
	}
	return checks;
}
async function runDoctorHealthContributions(ctx) {
	for (const contribution of resolveDoctorHealthContributions()) await contribution.run(ctx);
}
//#endregion
export { shouldSkipLegacyUpdateDoctorConfigWrite as a, runDoctorHealthContributions as i, resolveDoctorContributionHealthChecks as n, resolveDoctorHealthContributions as r, createDoctorHealthContribution as t };
