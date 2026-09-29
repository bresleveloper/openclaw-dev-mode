import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { a as writeRuntimeJson, r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as listAgentEntries } from "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir, s as isDefaultStateDir, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { a as createGatewayEnvSecretRef, l as isValidEnvSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import { p as resolveSecretInputRef } from "./types.secrets-B5xWSzLp.mjs";
import { p as redactSecrets } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BN-rPaec.mjs";
import "./io-DuIKUcsW.mjs";
import { r as replaceConfigFile } from "./mutate-CDIHLSip.mjs";
import "./config-Ciq2mxdN.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-QhifpZGP.mjs";
import "./daemon-runtime-D15REPfs.mjs";
import { n as resolveConfiguredSecretInputWithFallback } from "./resolve-configured-secret-input-string-SF_iuPva.mjs";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-U-tMi0Ou.mjs";
import { t as randomToken } from "./random-token-B1woZa_H.mjs";
import { r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-eOymVKB5.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { n as applyWizardMetadata, o as handleReset, p as waitForGatewayReachable, s as normalizeGatewayTokenInput, t as DEFAULT_WORKSPACE } from "./onboard-helpers-0ZuVvEiw.mjs";
import { a as ensureOnboardingAgentWorkspace, c as resolveOnboardingAgentTarget, l as resolveOnboardingSetupTarget } from "./onboard-agent-target-pGC2ybZv.mjs";
import { t as runGuidedOnboarding } from "./onboard-guided-B_WV5f7B.mjs";
import { t as enableDefaultOnboardingInternalHooks } from "./onboard-hooks-Ca9woCpp.mjs";
import { t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-BMHSi8fV.mjs";
import { i as resolveProviderMatch } from "./provider-auth-choice-helpers-BggS0fwD.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { o as normalizeTokenProviderInput } from "./provider-auth-input-Bs4B3uJA.mjs";
import { a as GENERIC_PROVIDER_AUTH_CHOICES, r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-CaGKkIoE.mjs";
import { t as resolveLegacyOnboardAuthChoice } from "./auth-choice-legacy-mYxKFtUF.mjs";
import { t as resolvePluginProviders } from "./provider-auth-choice.runtime-LIsU-qOe.mjs";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-DLCGsi38.mjs";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-CBeJb_wA.mjs";
import { t as validateDottedDecimalIPv4Input } from "./ipv4-CJtO5102.mjs";
import { n as validateGatewayWebSocketUrl } from "./onboard-remote-BB6eCc-t.mjs";
import { n as applySkipBootstrapConfig, r as resolveOnboardingWorkspaceConflict, t as applyLocalSetupWorkspaceConfig } from "./onboard-config-DBcYEKrB.mjs";
import { u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-LPO-VgcK.mjs";
import { n as runInteractiveSetup } from "./onboard-interactive-BENV-8Jl.mjs";
import { t as inferAuthChoiceFromFlags } from "./auth-choice-inference-OPkrHyFs.mjs";
import { n as validateOnboardingChoiceOptions, t as rejectOnboardingOption } from "./onboard-options-DxXxOWP7.mjs";
import { t as resolveNonInteractiveApiKey } from "./api-keys-AcrlcvNC.mjs";
import { t as provisionGatewayTokenStoreRef } from "./auth-token-store-ref-D2byOXhw.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/commands/onboard-non-interactive/config-write.ts
/** Commits a non-interactive onboard config update with pending plugin records handled first. */
async function commitNonInteractiveOnboardConfig(params) {
	const { writeWizardConfigFile } = await import("./setup.shared-iQVFZJd6.mjs");
	return (await writeWizardConfigFile(params.nextConfig, {
		mergeBase: params.baseConfig,
		allowConfigSizeDrop: params.reset === true,
		...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {}
	})).nextConfig;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/gateway-config.ts
/**
* Gateway config mutation for local non-interactive onboarding.
*
* This module owns port/bind/auth validation and existing-setting preservation
* before the final config write happens.
*/
/** Resolves what `gateway.auth.token` should hold once setup owns the token value. */
function resolveGeneratedTokenInput(params) {
	if (params.secretInputMode !== "ref") return params.token ?? randomToken();
	if (params.ambientEnvOnly) return createGatewayEnvSecretRef(params.config, "OPENCLAW_GATEWAY_TOKEN");
	return provisionGatewayTokenStoreRef({
		config: params.config,
		...params.token ? { token: params.token } : {}
	}).ref;
}
/** Applies gateway CLI options to the pending config and returns normalized runtime settings. */
function applyNonInteractiveGatewayConfig(params) {
	const { opts, runtime } = params;
	const gatewayPort = opts.gatewayPort;
	if (gatewayPort !== void 0 && (!Number.isFinite(gatewayPort) || gatewayPort <= 0 || gatewayPort > 65535)) {
		rejectOnboardingOption(opts, runtime, formatInvalidPortOption("--gateway-port"));
		return null;
	}
	const existingGateway = params.nextConfig.gateway;
	const port = gatewayPort ?? params.defaultPort;
	let bind = opts.gatewayBind ?? existingGateway?.bind ?? "loopback";
	const explicitAuthMode = opts.gatewayAuth;
	if (explicitAuthMode !== void 0 && explicitAuthMode !== "token" && explicitAuthMode !== "password") {
		rejectOnboardingOption(opts, runtime, "Invalid --gateway-auth. Use \"token\" or \"password\".");
		return null;
	}
	const hasExplicitTokenAuthInput = opts.gatewayToken !== void 0 || opts.gatewayTokenRefEnv !== void 0;
	let authMode = explicitAuthMode ?? (hasExplicitTokenAuthInput ? "token" : opts.gatewayPassword !== void 0 ? "password" : existingGateway?.auth?.mode) ?? "token";
	const tailscaleMode = opts.tailscale ?? existingGateway?.tailscale?.mode ?? "off";
	if ((opts.gatewayBind !== void 0 || opts.tailscale !== void 0) && tailscaleMode !== "off" && bind !== "loopback") bind = "loopback";
	if (bind === "custom") {
		const customBindHostIssue = validateDottedDecimalIPv4Input(normalizeOptionalString(existingGateway?.customBindHost ?? ""));
		if (customBindHostIssue) {
			const setCommand = formatCliCommand("openclaw config set gateway.customBindHost <ipv4>");
			const interactiveCommand = formatCliCommand("openclaw onboard");
			rejectOnboardingOption(opts, runtime, `--gateway-bind custom requires gateway.customBindHost: ${customBindHostIssue}. Set it with ${setCommand} and rerun, or run ${interactiveCommand} interactively to be prompted for it.`);
			return null;
		}
	}
	const changesAuthOrTailscale = explicitAuthMode !== void 0 || hasExplicitTokenAuthInput || opts.tailscale !== void 0;
	if (changesAuthOrTailscale && tailscaleMode === "serve" && authMode === "none") authMode = "token";
	if (changesAuthOrTailscale && tailscaleMode === "funnel" && authMode !== "password") authMode = "password";
	let nextConfig = params.nextConfig;
	const explicitGatewayToken = normalizeGatewayTokenInput(opts.gatewayToken);
	const envGatewayToken = normalizeGatewayTokenInput(process.env.OPENCLAW_GATEWAY_TOKEN);
	const existingTokenInput = nextConfig.gateway?.auth?.token;
	const existingTokenRef = resolveSecretInputRef({
		value: existingTokenInput,
		defaults: nextConfig.secrets?.defaults
	}).ref;
	const existingPlaintextToken = normalizeGatewayTokenInput(existingTokenInput);
	const gatewayToken = explicitGatewayToken || existingPlaintextToken || envGatewayToken || void 0;
	const gatewayTokenRefEnv = normalizeOptionalString(opts.gatewayTokenRefEnv ?? "") ?? "";
	if (authMode === "token") {
		if (gatewayTokenRefEnv) {
			if (!isValidEnvSecretRefId(gatewayTokenRefEnv)) {
				rejectOnboardingOption(opts, runtime, "Invalid --gateway-token-ref-env. Use an environment variable name like OPENCLAW_GATEWAY_TOKEN.");
				return null;
			}
			if (explicitGatewayToken) {
				rejectOnboardingOption(opts, runtime, "Use either --gateway-token or --gateway-token-ref-env, not both. Prefer --gateway-token-ref-env to avoid writing plaintext tokens.");
				return null;
			}
			if (!process.env[gatewayTokenRefEnv]?.trim()) {
				rejectOnboardingOption(opts, runtime, `Environment variable "${gatewayTokenRefEnv}" is missing or empty. Export it first, then rerun ${formatCliCommand("openclaw onboard --non-interactive")}.`);
				return null;
			}
			nextConfig = {
				...nextConfig,
				gateway: {
					...nextConfig.gateway,
					auth: {
						...nextConfig.gateway?.auth,
						mode: "token",
						token: createGatewayEnvSecretRef(nextConfig, gatewayTokenRefEnv)
					}
				}
			};
		} else if (!explicitGatewayToken && existingTokenRef) nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "token"
				}
			}
		};
		else {
			const tokenInput = resolveGeneratedTokenInput({
				config: nextConfig,
				secretInputMode: opts.secretInputMode,
				token: gatewayToken,
				ambientEnvOnly: !explicitGatewayToken && !existingPlaintextToken && Boolean(envGatewayToken)
			});
			nextConfig = {
				...nextConfig,
				gateway: {
					...nextConfig.gateway,
					auth: {
						...nextConfig.gateway?.auth,
						mode: "token",
						token: tokenInput
					}
				}
			};
		}
	}
	if (authMode === "password") {
		const input = opts.gatewayPassword;
		const password = input === void 0 ? nextConfig.gateway?.auth?.password ?? normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD) : normalizeOptionalString(input);
		if (!password) {
			rejectOnboardingOption(opts, runtime, "Missing --gateway-password for password auth. Pass --gateway-password or use --gateway-auth token.");
			return null;
		}
		nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				auth: {
					...nextConfig.gateway?.auth,
					mode: "password",
					...input !== void 0 ? { password: opts.secretInputMode === "ref" ? createGatewayEnvSecretRef(nextConfig, "OPENCLAW_GATEWAY_PASSWORD") : password } : {}
				}
			}
		};
	}
	nextConfig = {
		...nextConfig,
		gateway: {
			...nextConfig.gateway,
			port,
			bind,
			tailscale: {
				...nextConfig.gateway?.tailscale,
				mode: tailscaleMode
			}
		}
	};
	return {
		nextConfig,
		port,
		bind,
		authMode,
		tailscaleMode
	};
}
//#endregion
//#region src/commands/onboard-non-interactive/local/output.ts
/**
* Output helpers for non-interactive onboarding.
*
* JSON success/failure payloads and human-readable gateway health diagnostics
* are kept here so local and remote setup report failures consistently.
*/
/** Emits the JSON success payload for non-interactive onboarding when requested. */
function logNonInteractiveOnboardingJson(params) {
	if (!params.opts.json) return;
	writeRuntimeJson(params.runtime, {
		ok: true,
		mode: params.mode,
		workspace: params.workspaceDir,
		authChoice: params.authChoice,
		gateway: params.gateway,
		installDaemon: Boolean(params.installDaemon),
		daemonInstall: params.daemonInstall,
		daemonRuntime: params.daemonRuntime,
		skipSkills: Boolean(params.skipSkills),
		skipHealth: Boolean(params.skipHealth)
	});
}
function formatGatewayRuntimeSummary(diagnostics) {
	const service = diagnostics?.service;
	if (!service?.runtimeStatus) return;
	const parts = [service.runtimeStatus];
	if (typeof service.pid === "number") parts.push(`pid ${service.pid}`);
	if (service.state) parts.push(`state ${service.state}`);
	if (typeof service.lastExitStatus === "number") parts.push(`last exit ${service.lastExitStatus}`);
	if (service.lastExitReason) parts.push(`reason ${service.lastExitReason}`);
	return parts.join(", ");
}
function hasConnectionRefusedDetail(detail) {
	return /\b(?:econnrefused|connection refused|connect refused)\b/i.test(detail);
}
function classifyGatewayHealthFailure(params) {
	const detail = params.detail ?? "";
	const lastGatewayError = params.diagnostics?.lastGatewayError ?? "";
	const combined = `${detail}\n${lastGatewayError}`;
	if (/\b(?:unauthorized|forbidden|invalid token|invalid password|auth mismatch)\b/i.test(combined)) return "auth-mismatch";
	if (/\b(?:runtime[- ]deps?|runtime dependencies|cannot find (?:module|package)|(?:err_)?module_not_found|sqlite-vec|loadextension)\b/i.test(combined)) return "module-missing";
	if (params.diagnostics?.service?.loadState.status === "not-loaded" && hasConnectionRefusedDetail(detail)) return "service-missing";
	const runtimeStatus = params.diagnostics?.service?.runtimeStatus;
	if (runtimeStatus && runtimeStatus !== "running" && runtimeStatus !== "active" && hasConnectionRefusedDetail(detail)) return "service-stopped";
	if (lastGatewayError.trim()) return "startup-blocked";
	if (hasConnectionRefusedDetail(detail)) return "not-listening";
}
function recoveryHintForGatewayHealthFailure(classification) {
	switch (classification) {
		case "auth-mismatch":
		case "module-missing": return `Fix: run \`${formatCliCommand("openclaw doctor --fix")}\`.`;
		case "service-missing": return `Fix: run \`${formatCliCommand("openclaw gateway install --force")}\`.`;
		case "service-stopped": return `Fix: run \`${formatCliCommand("openclaw gateway restart")}\`.`;
		case "startup-blocked": return `Fix: run \`${formatCliCommand("openclaw gateway status --deep")}\`.`;
		case "not-listening": return `Fix: start \`${formatCliCommand("openclaw gateway run")}\`, or run \`${formatCliCommand("openclaw gateway restart")}\` for a managed gateway.`;
		default: return;
	}
}
/** Emits JSON or human-readable failure output for non-interactive onboarding. */
function logNonInteractiveOnboardingFailure(params) {
	const classification = classifyGatewayHealthFailure({
		detail: params.detail,
		diagnostics: params.diagnostics
	});
	const callerHints = params.hints?.filter(Boolean) ?? [];
	const recoveryHint = callerHints.some((hint) => hint.startsWith("Fix:")) ? void 0 : recoveryHintForGatewayHealthFailure(classification);
	const hints = [...recoveryHint ? [recoveryHint] : [], ...callerHints];
	const output = redactSecrets({
		message: params.message,
		detail: params.detail,
		hints,
		gateway: params.gateway,
		daemonInstall: params.daemonInstall,
		daemonRuntime: params.daemonRuntime,
		diagnostics: params.diagnostics
	});
	const gatewayRuntime = formatGatewayRuntimeSummary(output.diagnostics);
	const service = output.diagnostics?.service;
	const serviceLoadText = service ? service.loadState.status === "loaded" ? service.loadedText : service.loadState.status.replace("-", " ") : void 0;
	if (params.opts.json) {
		writeRuntimeJson(params.runtime, {
			ok: false,
			mode: params.mode,
			phase: params.phase,
			message: output.message,
			classification,
			detail: output.detail,
			gateway: output.gateway,
			installDaemon: Boolean(params.installDaemon),
			daemonInstall: output.daemonInstall,
			daemonRuntime: output.daemonRuntime,
			diagnostics: output.diagnostics,
			hints: output.hints.length > 0 ? output.hints : void 0
		});
		return;
	}
	const lines = [
		output.message,
		classification ? `Classification: ${classification}` : void 0,
		output.detail ? `Last probe: ${output.detail}` : void 0,
		service ? `Service: ${service.label} (${serviceLoadText})` : void 0,
		gatewayRuntime ? `Runtime: ${gatewayRuntime}` : void 0,
		output.diagnostics?.lastGatewayError ? `Last gateway error: ${output.diagnostics.lastGatewayError}` : void 0,
		output.diagnostics?.inspectError ? `Diagnostics warning: ${output.diagnostics.inspectError}` : void 0,
		output.hints.length > 0 ? output.hints.join("\n") : void 0
	].filter(Boolean).join("\n");
	if (params.informational) params.runtime.log(lines);
	else params.runtime.error(lines);
}
//#endregion
//#region src/commands/onboard-non-interactive/local/skills-config.ts
/** Applies the non-interactive skills install options to the pending config. */
function applyNonInteractiveSkillsConfig(params) {
	const { nextConfig, opts, runtime } = params;
	if (opts.skipSkills) return nextConfig;
	const nodeManager = opts.nodeManager;
	if (nodeManager !== void 0 && ![
		"npm",
		"pnpm",
		"bun"
	].includes(nodeManager)) {
		runtime.error("Invalid --node-manager. Use \"npm\", \"pnpm\", or \"bun\".");
		runtime.exit(1);
		return nextConfig;
	}
	return {
		...nextConfig,
		skills: {
			...nextConfig.skills,
			install: {
				...nextConfig.skills?.install,
				nodeManager: nodeManager ?? nextConfig.skills?.install?.nodeManager ?? "npm"
			}
		}
	};
}
//#endregion
//#region src/commands/onboard-non-interactive/local/workspace.ts
/**
* Workspace resolution for local non-interactive onboarding.
*
* CLI input wins, then existing config, then the computed default workspace,
* and the final value is expanded through the normal user-path resolver.
*/
/** Resolves the workspace directory used by local non-interactive setup. */
function resolveNonInteractiveWorkspaceDir(params) {
	const env = params.env ?? process.env;
	const requestedWorkspace = params.opts.workspace?.trim() || void 0;
	const configuredWorkspace = params.baseConfig.agents?.defaults?.workspace?.trim() || void 0;
	const workspaceOverride = env.OPENCLAW_WORKSPACE_DIR?.trim() || void 0;
	const implicitWorkspaceDir = isDefaultStateDir(env) ? params.defaultWorkspaceDir : path.join(resolveStateDir(env), "workspace");
	const raw = (requestedWorkspace ?? configuredWorkspace ?? workspaceOverride ?? implicitWorkspaceDir).trim();
	return resolveUserPath(raw, env);
}
//#endregion
//#region src/commands/onboard-non-interactive/local.ts
/**
* Local non-interactive onboarding orchestration.
*
* This entrypoint applies config changes, optionally installs the gateway
* daemon, verifies health, and emits machine-readable setup output.
*/
async function collectGatewayHealthFailureDiagnostics() {
	const diagnostics = {};
	try {
		const { readGatewayServiceState, resolveGatewayService } = await import("./service-CZPrn7FT.mjs");
		const service = resolveGatewayService();
		const env = process.env;
		const state = await readGatewayServiceState(service, { env });
		const runtime = state.runtime;
		const loaded = state.loadState.status === "unknown" ? null : state.loadState.status === "loaded";
		diagnostics.service = {
			label: service.label,
			loaded,
			loadState: state.loadState,
			loadedText: service.loadedText,
			runtimeStatus: runtime?.status,
			state: runtime?.state,
			pid: runtime?.pid,
			lastExitStatus: runtime?.lastExitStatus,
			lastExitReason: runtime?.lastExitReason
		};
	} catch (err) {
		diagnostics.inspectError = `service diagnostics failed: ${String(err)}`;
	}
	try {
		const { readLastGatewayErrorLine } = await import("./diagnostics-tpDEAc20.mjs");
		diagnostics.lastGatewayError = await readLastGatewayErrorLine(process.env) ?? void 0;
	} catch (err) {
		diagnostics.inspectError = diagnostics.inspectError ? `${diagnostics.inspectError}; log diagnostics failed: ${String(err)}` : `log diagnostics failed: ${String(err)}`;
	}
	return diagnostics.service || diagnostics.lastGatewayError || diagnostics.inspectError ? diagnostics : void 0;
}
/** Resolves the auth material used by the post-setup gateway health probe. */
async function resolveGatewayHealthProbeToken(nextConfig) {
	if (nextConfig.gateway?.auth?.mode === "password") {
		const resolved = await resolveConfiguredSecretInputWithFallback({
			config: nextConfig,
			env: process.env,
			value: nextConfig.gateway.auth.password,
			path: "gateway.auth.password",
			unresolvedReasonStyle: "detailed",
			readFallback: () => process.env.OPENCLAW_GATEWAY_PASSWORD
		});
		return {
			password: resolved.value,
			unresolvedRefReason: resolved.unresolvedRefReason
		};
	}
	const resolved = await resolveGatewayAuthToken({
		cfg: nextConfig,
		env: process.env,
		unresolvedReasonStyle: "detailed"
	});
	const probeAuth = {};
	if (resolved.token) probeAuth.token = resolved.token;
	if (resolved.unresolvedRefReason) probeAuth.unresolvedRefReason = resolved.unresolvedRefReason;
	return probeAuth;
}
function formatGatewayHealthFailureDetail(params) {
	return [params.probeDetail, params.unresolvedRefReason].filter(Boolean).join("\n") || void 0;
}
/** Runs local non-interactive setup from config mutation through health verification. */
async function runNonInteractiveLocalSetup(params) {
	const { opts, runtime, baseConfig, sourceConfigBeforeMigrations, baseHash } = params;
	const mode = "local";
	const requestedWorkspaceDir = resolveNonInteractiveWorkspaceDir({
		opts,
		baseConfig,
		defaultWorkspaceDir: DEFAULT_WORKSPACE
	});
	const hasAuthoredRoster = listAgentEntries(sourceConfigBeforeMigrations).length > 0;
	if (opts.team && hasAuthoredRoster) {
		rejectOnboardingOption(opts, runtime, "An agent roster already exists. Use `openclaw agents team create` to add a team.");
		return;
	}
	const firstAgentName = opts.agentName ?? (opts.team ? "coordinator" : "main");
	const workspaceConflict = resolveOnboardingWorkspaceConflict(sourceConfigBeforeMigrations, requestedWorkspaceDir);
	const workspaceDir = workspaceConflict?.currentWorkspaceDir ?? requestedWorkspaceDir;
	if (workspaceConflict) runtime.error([
		"Warning: existing agents keep their current workspace during non-interactive onboarding.",
		`Current workspace: ${workspaceConflict.currentWorkspaceDir}`,
		`Requested workspace: ${workspaceConflict.requestedWorkspaceDir}`,
		`Run \`${formatCliCommand("openclaw onboard --classic")}\` to confirm moving the existing agent fleet.`
	].join("\n"));
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, requestedWorkspaceDir, { allowWorkspaceChange: !hasAuthoredRoster && !workspaceConflict });
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	const authTarget = resolveOnboardingSetupTarget(nextConfig, !hasAuthoredRoster && (opts.agentName || opts.team) ? {
		name: firstAgentName,
		workspaceDir: opts.team ? path.join(workspaceDir, normalizeAgentId(firstAgentName)) : workspaceDir
	} : void 0);
	const inferredAuthChoice = opts.authChoice ? void 0 : (await import("./auth-choice-inference-B3fLSExm.mjs")).inferAuthChoiceFromFlags(opts, {
		config: nextConfig,
		workspaceDir: authTarget.workspaceDir,
		env: process.env
	});
	if (!opts.authChoice && inferredAuthChoice && inferredAuthChoice.matches.length > 1) {
		const message = [
			"Multiple API key flags were provided for non-interactive setup.",
			"Use a single provider flag or pass --auth-choice explicitly.",
			`Flags: ${inferredAuthChoice.matches.map((match) => match.label).join(", ")}`
		].join("\n");
		rejectOnboardingOption(opts, runtime, message);
		return;
	}
	const authChoice = opts.authChoice ?? inferredAuthChoice?.choice ?? "skip";
	const gatewayResult = applyNonInteractiveGatewayConfig({
		nextConfig,
		opts,
		runtime,
		defaultPort: resolveGatewayPort(baseConfig)
	});
	if (!gatewayResult) return;
	nextConfig = gatewayResult.nextConfig;
	nextConfig = applyNonInteractiveSkillsConfig({
		nextConfig,
		opts,
		runtime
	});
	if (authChoice !== "skip") {
		const { applyNonInteractiveAuthChoice } = await import("./auth-choice-CQj3nkgt.mjs");
		const nextConfigAfterAuth = await applyNonInteractiveAuthChoice({
			nextConfig,
			authChoice,
			opts,
			runtime,
			baseConfig,
			target: authTarget
		});
		if (!nextConfigAfterAuth) return;
		nextConfig = nextConfigAfterAuth;
	}
	if (!opts.skipHooks) nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	const { ensureOnboardingAgent } = await import("./onboard-agent-wGih_UzJ.mjs");
	const created = await ensureOnboardingAgent({
		config: nextConfig,
		workspace: workspaceDir,
		baseConfig,
		firstAgent: {
			name: firstAgentName,
			...opts.team ? { team: true } : {}
		},
		expectedConfigHash: baseHash ?? null
	});
	for (const warning of created.sessionMigrationWarnings ?? []) runtime.log(`Warning: ${warning}`);
	nextConfig = applyLocalSetupWorkspaceConfig(created.config, requestedWorkspaceDir);
	const effectiveBaseHash = created.configHash ?? baseHash;
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	const finalTarget = resolveOnboardingAgentTarget(nextConfig, created.agentId);
	await ensureOnboardingAgentWorkspace(finalTarget, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	});
	nextConfig = applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	nextConfig = await commitNonInteractiveOnboardConfig({
		nextConfig,
		baseConfig: created.configBase,
		baseHash: effectiveBaseHash,
		reset: opts.reset
	});
	logConfigUpdated(runtime);
	const daemonRuntimeRaw = opts.daemonRuntime ?? "node";
	let daemonInstallStatus;
	let gatewayNotRunning = false;
	if (opts.installDaemon) {
		const { installGatewayDaemonNonInteractive } = await import("./daemon-install-uSWkG4K9.mjs");
		const daemonInstall = await installGatewayDaemonNonInteractive({
			nextConfig,
			opts,
			runtime,
			port: gatewayResult.port
		});
		daemonInstallStatus = daemonInstall.installed ? {
			requested: true,
			installed: true
		} : {
			requested: true,
			installed: false,
			skippedReason: daemonInstall.skippedReason
		};
		if (!daemonInstall.installed) {
			logNonInteractiveOnboardingFailure({
				opts,
				runtime,
				mode,
				phase: "daemon-install",
				message: daemonInstall.skippedReason === "systemd-user-unavailable" ? "Gateway service install is unavailable because systemd user services are not reachable in this Linux session." : "Gateway service install did not complete successfully.",
				installDaemon: true,
				daemonInstall: {
					requested: true,
					installed: false,
					skippedReason: daemonInstall.skippedReason
				},
				daemonRuntime: daemonRuntimeRaw,
				hints: daemonInstall.skippedReason === "systemd-user-unavailable" ? ["Fix: rerun without `--install-daemon` for one-shot setup, or enable a working user-systemd session and retry.", "If your auth profile uses env-backed refs, keep those env vars set in the shell that runs `openclaw gateway run` or `openclaw agent --local`."] : [`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for more detail.`]
			});
			runtime.exit(1);
			return;
		}
	}
	if (!opts.skipHealth) {
		const { healthCommandNonExiting } = await import("./health-fawA9MaE.mjs");
		const links = resolveLocalControlUiProbeLinks({
			bind: gatewayResult.bind,
			port: gatewayResult.port,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: void 0,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const startupTiming = opts.installDaemon ? resolveGatewayStartupTiming() : { deadlineMs: 15e3 };
		const probeAuth = await resolveGatewayHealthProbeToken(nextConfig);
		const probe = await waitForGatewayReachable({
			url: links.wsUrl,
			token: probeAuth.token,
			password: probeAuth.password,
			...startupTiming
		});
		if (!probe.ok) {
			const detail = formatGatewayHealthFailureDetail({
				probeDetail: probe.detail,
				unresolvedRefReason: probeAuth.unresolvedRefReason
			});
			const diagnostics = opts.installDaemon ? await collectGatewayHealthFailureDiagnostics() : void 0;
			const explicitlySkippedAbsentGateway = opts.installDaemon === false && classifyGatewayHealthFailure({
				detail,
				diagnostics
			}) === "not-listening";
			if (explicitlySkippedAbsentGateway && !opts.json) runtime.log("Setup complete; gateway was not installed or started because daemon installation was explicitly skipped.");
			if (!explicitlySkippedAbsentGateway || !opts.json) logNonInteractiveOnboardingFailure({
				opts,
				runtime,
				mode,
				phase: "gateway-health",
				message: `Gateway did not become reachable at ${links.wsUrl}.`,
				detail,
				gateway: {
					wsUrl: links.wsUrl,
					httpUrl: links.httpUrl
				},
				installDaemon: Boolean(opts.installDaemon),
				daemonInstall: daemonInstallStatus,
				daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0,
				diagnostics,
				hints: !opts.installDaemon ? [
					"Non-interactive local setup only waits for an already-running gateway unless you pass `--install-daemon` to `openclaw onboard`.",
					`Fix: start \`${formatCliCommand("openclaw gateway run")}\`, re-run \`${formatCliCommand("openclaw onboard --install-daemon")}\`, or use \`${formatCliCommand("openclaw onboard --skip-health")}\`.`,
					process.platform === "win32" ? "Native Windows managed gateway install tries Scheduled Tasks first and falls back to a per-user Startup-folder login item when task creation is denied." : void 0
				].filter((value) => Boolean(value)) : [`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for more detail.`],
				informational: explicitlySkippedAbsentGateway
			});
			if (!explicitlySkippedAbsentGateway) {
				runtime.exit(1);
				return;
			}
			gatewayNotRunning = true;
		} else {
			const capturedHealthLines = [];
			const healthRuntime = opts.json ? {
				...runtime,
				log: (...args) => {
					capturedHealthLines.push(args.map(String).join(" "));
				}
			} : runtime;
			try {
				await healthCommandNonExiting({
					json: false,
					timeoutMs: opts.installDaemon && process.platform === "win32" ? 9e4 : 1e4,
					config: nextConfig,
					token: probeAuth.token,
					password: probeAuth.password
				}, healthRuntime);
			} catch (err) {
				const detail = err instanceof ExitError ? capturedHealthLines.join("\n") || void 0 : formatErrorMessage(err);
				logNonInteractiveOnboardingFailure({
					opts,
					runtime,
					mode,
					phase: "gateway-health",
					message: `Gateway is reachable at ${links.wsUrl}, but the health check failed.`,
					detail,
					gateway: {
						wsUrl: links.wsUrl,
						httpUrl: links.httpUrl
					},
					installDaemon: Boolean(opts.installDaemon),
					daemonInstall: daemonInstallStatus,
					daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0,
					hints: [`Run \`${formatCliCommand("openclaw health")}\` for full diagnostics.`]
				});
				runtime.exit(1);
				return;
			}
		}
	}
	logNonInteractiveOnboardingJson({
		opts,
		runtime,
		mode,
		workspaceDir: finalTarget.workspaceDir,
		authChoice,
		gateway: {
			port: gatewayResult.port,
			bind: gatewayResult.bind,
			authMode: gatewayResult.authMode,
			tailscaleMode: gatewayResult.tailscaleMode,
			...gatewayNotRunning ? { reachable: false } : {}
		},
		installDaemon: Boolean(opts.installDaemon),
		daemonInstall: daemonInstallStatus,
		daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0,
		skipSkills: Boolean(opts.skipSkills),
		skipHealth: Boolean(opts.skipHealth)
	});
	if (!opts.json) runtime.log(`Tip: run \`${formatCliCommand("openclaw configure --section web")}\` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web`);
}
//#endregion
//#region src/commands/onboard-non-interactive/remote.ts
/**
* Remote non-interactive onboarding orchestration.
*
* It writes gateway.remote config without local gateway setup, preserving the
* same config commit path as local onboarding.
*/
/** Runs non-interactive setup for clients that connect to an existing remote gateway. */
async function runNonInteractiveRemoteSetup(params) {
	const { opts, runtime, baseConfig, baseHash } = params;
	const mode = "remote";
	const remoteUrl = normalizeOptionalString(opts.remoteUrl);
	if (!remoteUrl) {
		runtime.error(`Missing --remote-url for remote mode. Example: ${formatCliCommand("openclaw onboard --non-interactive --mode remote --remote-url ws://127.0.0.1:3000")}.`);
		runtime.exit(1);
		return;
	}
	const remoteToken = normalizeOptionalString(opts.remoteToken);
	const remotePassword = normalizeOptionalString(opts.remotePassword);
	for (const [flag, input, normalized] of [[
		"--remote-token",
		opts.remoteToken,
		remoteToken
	], [
		"--remote-password",
		opts.remotePassword,
		remotePassword
	]]) if (input !== void 0 && !normalized) {
		runtime.error(`Invalid ${flag}: value cannot be empty.`);
		runtime.exit(1);
		return;
	}
	if (remoteToken && remotePassword) {
		runtime.error("Use either --remote-token or --remote-password, not both.");
		runtime.exit(1);
		return;
	}
	const existingRemote = baseConfig.gateway?.remote;
	const preservedRemote = normalizeOptionalString(existingRemote?.url) !== remoteUrl ? {} : { ...existingRemote };
	if (remoteToken) delete preservedRemote.password;
	if (remotePassword) delete preservedRemote.token;
	let nextConfig = {
		...baseConfig,
		gateway: {
			...baseConfig.gateway,
			mode: "remote",
			remote: {
				...preservedRemote,
				url: remoteUrl,
				...remoteToken ? { token: opts.secretInputMode === "ref" ? createGatewayEnvSecretRef(baseConfig, "OPENCLAW_GATEWAY_TOKEN") : remoteToken } : {},
				...remotePassword ? { password: opts.secretInputMode === "ref" ? createGatewayEnvSecretRef(baseConfig, "OPENCLAW_GATEWAY_PASSWORD") : remotePassword } : {}
			}
		}
	};
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	nextConfig = applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	await commitNonInteractiveOnboardConfig({
		nextConfig,
		baseConfig,
		baseHash,
		reset: opts.reset
	});
	logConfigUpdated(runtime);
	const payload = {
		mode,
		remoteUrl,
		auth: nextConfig.gateway?.remote?.token ? "token" : nextConfig.gateway?.remote?.password ? ["pass", "word"].join("") : "none"
	};
	if (opts.json) writeRuntimeJson(runtime, payload);
	else {
		runtime.log(`Remote gateway: ${remoteUrl}`);
		runtime.log(`Auth: ${payload.auth}`);
		runtime.log(`Tip: run \`${formatCliCommand("openclaw configure --section web")}\` to store your Brave API key for web_search. Docs: https://docs.openclaw.ai/tools/web`);
	}
}
//#endregion
//#region src/commands/onboard-non-interactive.ts
/**
* Non-interactive onboarding command dispatcher.
*
* This module validates the existing config snapshot, routes local/remote
* setup, and handles explicit migration imports without interactive prompts.
*/
function isMigrationImport(opts) {
	return Boolean(opts.importFrom || opts.importSource || opts.importSecrets || opts.flow === "import");
}
/** Runs a setup migration import with non-interactive prompt failures. */
async function runNonInteractiveMigrationImport(params) {
	const providerId = params.opts.importFrom?.trim();
	if (!providerId) {
		rejectOnboardingOption(params.opts, params.runtime, `--import-from is required for non-interactive migration import. Run ${formatCliCommand("openclaw migrate list")} to choose a provider.`);
		return;
	}
	const { detectSetupMigrationSources, runSetupMigrationImport } = await import("./setup.migration-import-jMU6Bobq.mjs");
	const discovery = await detectSetupMigrationSources({
		config: params.baseConfig,
		runtime: params.runtime
	});
	const outcome = await runSetupMigrationImport({
		opts: {
			...params.opts,
			importFrom: providerId,
			nonInteractive: true
		},
		baseConfig: params.baseConfig,
		...discovery,
		prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive migration import needs explicit flags before prompting: ${message}`),
		runtime: params.runtime,
		async readConfigFile() {
			const snapshot = await readConfigFileSnapshot();
			if (!snapshot.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor --fix` to apply supported repairs.");
			return snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
		},
		async commitConfigFile(config, expectedConfig) {
			const latest = await readConfigFileSnapshot();
			if (!latest.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor --fix` to apply supported repairs.");
			const latestConfig = latest.exists ? latest.sourceConfig ?? latest.config : {};
			if (!isDeepStrictEqual(latestConfig, expectedConfig)) throw new ConfigMutationConflictError("config changed during migration promotion");
			const committed = await replaceConfigFile({
				sourceConfig: config,
				snapshot: latest,
				...latest.hash !== void 0 ? { baseHash: latest.hash } : {},
				writeOptions: { allowConfigSizeDrop: true }
			});
			logConfigUpdated(params.runtime);
			return committed.nextConfig;
		}
	});
	if (outcome.kind === "back") throw new Error("Non-interactive migration import cannot navigate back.");
	await outcome.acknowledgePromotion?.();
}
async function runNonInteractiveSetupExclusive(opts, runtime) {
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		rejectOnboardingOption(opts, runtime, `Config invalid. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run setup.`);
		return;
	}
	const baseConfig = snapshot.valid ? snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {} : {};
	const mode = opts.mode ?? "local";
	if (mode !== "local" && mode !== "remote") {
		rejectOnboardingOption(opts, runtime, `Invalid --mode "${String(mode)}". Use "local" or "remote", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		return;
	}
	if (isMigrationImport(opts)) {
		await runNonInteractiveMigrationImport({
			opts,
			runtime,
			baseConfig
		});
		return;
	}
	if (mode === "remote") {
		await runNonInteractiveRemoteSetup({
			opts,
			runtime,
			baseConfig,
			baseHash: snapshot.hash
		});
		return;
	}
	await runNonInteractiveLocalSetup({
		opts,
		runtime,
		baseConfig,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations ?? {},
		baseHash: snapshot.hash
	});
}
/** Runs non-interactive onboarding in local, remote, or migration-import mode. */
async function runNonInteractiveSetup(opts, runtime = defaultRuntime) {
	await withSetupMigrationTargetLock(resolveStateDir(), async () => {
		if (isMigrationImport(opts)) {
			await runNonInteractiveSetupExclusive(opts, runtime);
			return;
		}
		await withOpenClawStateLease({
			scope: "core:onboarding",
			key: "global",
			database: { scope: "shared" },
			leaseMs: 3e5,
			waitMs: 6e5,
			leaseLabel: "non-interactive onboarding lease",
			operationLabel: "onboarding.non-interactive.lease"
		}, async () => await withPluginLifecycleLease({}, async () => runNonInteractiveSetupExclusive(opts, runtime)));
	});
}
//#endregion
//#region src/commands/onboard.ts
/**
* Top-level `openclaw onboard` command entrypoint.
*
* It validates global setup flags, performs optional reset handling, and then
* routes to interactive or non-interactive onboarding.
*/
const VALID_RESET_SCOPES = /* @__PURE__ */ new Set([
	"config",
	"config+creds+sessions",
	"full"
]);
function validatePreflightOptions(opts, runtime) {
	if (opts.mode !== void 0 && opts.mode !== "local" && opts.mode !== "remote") return rejectOnboardingOption(opts, runtime, `Invalid --mode "${String(opts.mode)}". Use "local" or "remote", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
	const remoteOnlyFlags = [
		opts.remoteUrl !== void 0 ? "--remote-url" : void 0,
		opts.remoteToken !== void 0 ? "--remote-token" : void 0,
		opts.remotePassword !== void 0 ? "--remote-password" : void 0
	].filter((flag) => flag !== void 0);
	if (opts.nonInteractive && (opts.mode ?? "local") === "local" && remoteOnlyFlags.length > 0) return rejectOnboardingOption(opts, runtime, `${remoteOnlyFlags.join(" and ")} ${remoteOnlyFlags.length === 1 ? "requires" : "require"} --mode remote in non-interactive setup.`);
	for (const [flag, value] of [["--remote-token", opts.remoteToken], ["--remote-password", opts.remotePassword]]) if (value !== void 0 && !value.trim()) return rejectOnboardingOption(opts, runtime, `Invalid ${flag}: value cannot be empty.`);
	if (opts.remoteToken !== void 0 && opts.remotePassword !== void 0) return rejectOnboardingOption(opts, runtime, "Use either --remote-token or --remote-password, not both.");
	if (opts.mode === "remote") {
		const localGatewayCredentials = [
			[
				"--gateway-password",
				opts.gatewayPassword,
				"--remote-password"
			],
			[
				"--gateway-token",
				opts.gatewayToken,
				"--remote-token"
			],
			[
				"--gateway-token-ref-env",
				opts.gatewayTokenRefEnv,
				"--remote-token with --secret-input-mode ref"
			]
		];
		for (const [flag, value, remoteFlag] of localGatewayCredentials) if (value !== void 0) return rejectOnboardingOption(opts, runtime, `${flag} configures local gateway auth. Use ${remoteFlag} in remote mode.`);
	}
	if (opts.nonInteractive && opts.secretInputMode === "ref") {
		const gatewayCredentials = [
			[
				"--gateway-password",
				opts.gatewayPassword,
				"OPENCLAW_GATEWAY_PASSWORD"
			],
			[
				"--remote-token",
				opts.remoteToken,
				"OPENCLAW_GATEWAY_TOKEN"
			],
			[
				"--remote-password",
				opts.remotePassword,
				"OPENCLAW_GATEWAY_PASSWORD"
			]
		];
		for (const [flag, value, envName] of gatewayCredentials) {
			if (value === void 0) continue;
			const envValue = process.env[envName]?.trim();
			if (!envValue) return rejectOnboardingOption(opts, runtime, `${flag} requires ${envName} to be set when --secret-input-mode ref is used.`);
			if (value.trim() !== envValue) return rejectOnboardingOption(opts, runtime, `${flag} does not match ${envName}. Set the environment variable to the same value or omit the flag.`);
		}
	}
	if (!validateOnboardingChoiceOptions(opts, runtime)) return false;
	if (opts.gatewayTokenRefEnv !== void 0) {
		const gatewayTokenRefEnv = opts.gatewayTokenRefEnv.trim();
		if (!isValidEnvSecretRefId(gatewayTokenRefEnv)) return rejectOnboardingOption(opts, runtime, "Invalid --gateway-token-ref-env. Use an environment variable name like OPENCLAW_GATEWAY_TOKEN.");
		if (opts.gatewayToken !== void 0) return rejectOnboardingOption(opts, runtime, "Use either --gateway-token or --gateway-token-ref-env, not both. Prefer --gateway-token-ref-env to avoid writing plaintext tokens.");
		if (!process.env[gatewayTokenRefEnv]?.trim()) return rejectOnboardingOption(opts, runtime, `Environment variable "${gatewayTokenRefEnv}" is missing or empty. Export it first, then rerun ${formatCliCommand("openclaw onboard")}.`);
	}
	if (opts.nonInteractive && opts.mode === "remote" && !opts.remoteUrl?.trim()) return rejectOnboardingOption(opts, runtime, `Missing --remote-url for remote mode. Example: ${formatCliCommand("openclaw onboard --non-interactive --accept-risk --mode remote --remote-url ws://127.0.0.1:3000")}.`);
	if (opts.nonInteractive && opts.mode === "remote" && opts.remoteUrl?.trim()) {
		const remoteUrlError = validateGatewayWebSocketUrl(opts.remoteUrl);
		if (remoteUrlError) return rejectOnboardingOption(opts, runtime, remoteUrlError);
	}
	if (opts.nonInteractive && (opts.flow === "import" || opts.importSource || opts.importSecrets) && !opts.importFrom?.trim()) return rejectOnboardingOption(opts, runtime, `--import-from is required for non-interactive migration import. Run ${formatCliCommand("openclaw migrate list")} to choose a provider.`);
	return true;
}
async function validateResetAuthChoice(params) {
	const inferredAuthChoice = params.opts.authChoice || params.opts.mode === "remote" || !params.opts.nonInteractive && !wantsClassicInteractiveSetup(params.opts) ? void 0 : inferAuthChoiceFromFlags(params.opts, {
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env
	});
	if (inferredAuthChoice && inferredAuthChoice.matches.length > 1) return rejectOnboardingOption(params.opts, params.runtime, [
		`Multiple ${params.opts.nonInteractive ? "API key" : "provider credential"} flags were provided for ${params.opts.nonInteractive ? "non-interactive" : "interactive"} setup.`,
		"Use a single provider flag or pass --auth-choice explicitly.",
		`Flags: ${inferredAuthChoice.matches.map((match) => match.label).join(", ")}`
	].join("\n"));
	if (!params.opts.nonInteractive && inferredAuthChoice) return true;
	const authChoice = params.opts.authChoice ?? inferredAuthChoice?.choice;
	if (!authChoice) return true;
	if (!new Set(formatAuthChoiceChoicesForCli({
		includeSkip: true,
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env
	}).split("|")).has(authChoice)) return rejectOnboardingOption(params.opts, params.runtime, `Auth choice "${authChoice}" was not matched to a provider setup flow. Run ${formatCliCommand("openclaw onboard")} to choose interactively.`);
	const providerAuthChoices = [...resolveManifestProviderAuthChoices({
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	}), ...resolveProviderInstallCatalogEntries({
		config: params.baseConfig,
		workspaceDir: params.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	})];
	const isGenericProviderChoice = GENERIC_PROVIDER_AUTH_CHOICES.includes(authChoice);
	const normalizedTokenProvider = normalizeTokenProviderInput(params.opts.tokenProvider);
	const inferredOptionKey = inferredAuthChoice?.matches[0]?.optionKey;
	const providerAuthChoice = isGenericProviderChoice ? providerAuthChoices.find((choice) => {
		const providerMatches = normalizedTokenProvider ? normalizeTokenProviderInput(choice.providerId) === normalizedTokenProvider || choice.providerAliases?.some((alias) => normalizeTokenProviderInput(alias) === normalizedTokenProvider) : inferredOptionKey !== void 0 && choice.optionKey === inferredOptionKey;
		const methodId = choice.methodId.toLowerCase();
		const supportsAuthKind = authChoice === "apiKey" ? methodId.includes("api") && methodId.includes("key") : authChoice === "setup-token" ? methodId === "setup-token" : methodId.includes("token");
		return providerMatches && supportsAuthKind;
	}) : providerAuthChoices.find((choice) => choice.choiceId === authChoice);
	if (params.opts.nonInteractive && isGenericProviderChoice && !normalizedTokenProvider && !inferredOptionKey) return rejectOnboardingOption(params.opts, params.runtime, `Auth choice "${authChoice}" requires --token-provider in non-interactive setup.`);
	if (params.opts.nonInteractive && (authChoice === "token" || authChoice === "setup-token") && !params.opts.token?.trim()) return rejectOnboardingOption(params.opts, params.runtime, `Auth choice "${authChoice}" requires --token in non-interactive setup.`);
	if (params.opts.nonInteractive && isGenericProviderChoice && !providerAuthChoice) return rejectOnboardingOption(params.opts, params.runtime, `Auth choice "${authChoice}" was not matched to provider "${params.opts.tokenProvider?.trim()}".`);
	if (!params.opts.nonInteractive || authChoice === "skip") return true;
	const target = resolveOnboardingSetupTarget(params.baseConfig, params.opts.agentName || params.opts.team ? {
		name: params.opts.agentName ?? "coordinator",
		workspaceDir: params.opts.team ? path.join(params.workspaceDir, normalizeAgentId(params.opts.agentName ?? "coordinator")) : params.workspaceDir
	} : void 0);
	if (authChoice === "custom-api-key") try {
		const custom = parseNonInteractiveCustomApiFlags({
			baseUrl: params.opts.customBaseUrl,
			modelId: params.opts.customModelId,
			compatibility: params.opts.customCompatibility,
			apiKey: void 0,
			providerId: params.opts.customProviderId,
			supportsImageInput: params.opts.customImageInput
		});
		const customProviderId = resolveCustomProviderId({
			config: params.baseConfig,
			baseUrl: custom.baseUrl,
			providerId: custom.providerId
		}).providerId;
		const customCredential = await resolveNonInteractiveApiKey({
			provider: customProviderId,
			cfg: params.baseConfig,
			flagValue: params.opts.customApiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			runtime: params.runtime,
			agentDir: target.agentDir,
			workspaceDir: params.workspaceDir,
			allowProfile: params.resetScope === "config",
			required: false,
			secretInputMode: params.opts.secretInputMode,
			json: params.opts.json
		});
		if (params.opts.customApiKey?.trim() && !customCredential) return false;
		applyCustomApiConfig({
			config: params.baseConfig,
			baseUrl: custom.baseUrl,
			modelId: custom.modelId,
			compatibility: custom.compatibility,
			apiKey: void 0,
			providerId: custom.providerId,
			supportsImageInput: custom.supportsImageInput
		});
	} catch (error) {
		const message = error instanceof CustomApiError && (error.code === "missing_required" || error.code === "invalid_compatibility") ? error.message : `Invalid custom provider config: ${formatErrorMessage(error)}`;
		return rejectOnboardingOption(params.opts, params.runtime, message);
	}
	if (authChoice !== "custom-api-key") {
		const runtimeMethod = (providerAuthChoice ? resolveProviderMatch(resolvePluginProviders({
			config: params.baseConfig,
			workspaceDir: params.workspaceDir,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			providerRefs: [providerAuthChoice.providerId],
			activate: true
		}), providerAuthChoice.providerId) : null)?.auth.find((method) => method.id === providerAuthChoice?.methodId || method.wizard?.choiceId === providerAuthChoice?.choiceId);
		if (!runtimeMethod?.runNonInteractive || !runtimeMethod.validateNonInteractive) {
			const reason = !runtimeMethod ? "provider unavailable" : !runtimeMethod.runNonInteractive ? "non-interactive setup unsupported" : "reset validation unavailable";
			return rejectOnboardingOption(params.opts, params.runtime, `Auth choice "${authChoice}" cannot be safely preflighted with --reset (${reason}). Choose a provider method that supports non-interactive reset validation, or run setup without --reset.`);
		}
		if (!await runtimeMethod.validateNonInteractive({
			authChoice,
			config: params.baseConfig,
			baseConfig: params.baseConfig,
			opts: params.opts,
			runtime: params.runtime,
			agentDir: target.agentDir,
			workspaceDir: params.workspaceDir,
			resolveApiKey: async (input) => await resolveNonInteractiveApiKey({
				...input,
				cfg: params.baseConfig,
				runtime: params.runtime,
				agentDir: target.agentDir,
				workspaceDir: params.workspaceDir,
				allowProfile: input.allowProfile === false ? false : params.resetScope === "config",
				secretInputMode: params.opts.secretInputMode,
				json: params.opts.json
			})
		})) return false;
	}
	return true;
}
function validateResetMigrationImport(params) {
	if (!params.opts.importFrom && !params.opts.importSource && !params.opts.importSecrets && params.opts.flow !== "import") return true;
	return rejectOnboardingOption(params.opts, params.runtime, "Migration import cannot be combined with --reset because provider input must be planned before any state is removed. Run the import without --reset.");
}
function validateResetNonInteractiveGateway(params) {
	if (!params.opts.nonInteractive || (params.opts.mode ?? "local") === "remote") return true;
	return Boolean(applyNonInteractiveGatewayConfig({
		nextConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		defaultPort: resolveGatewayPort(params.baseConfig)
	}));
}
/**
* Interactive onboarding defaults to guided setup. Any explicit
* setup flag beyond this allowlist keeps the classic wizard — those flags are
* a public automation contract and guided setup does not honor them.
* Most false booleans mean "not passed" because the command layer normalizes
* them with Boolean(). False-valued explicit choices preserve undefined when
* omitted, so daemon, Tailscale-reset, and custom-model input overrides are
* special-cased. `--modern` never reaches this dispatch; the command layer
* routes it through the inference-gated OpenClaw.
*/
const GUIDED_SAFE_ONBOARD_KEYS = /* @__PURE__ */ new Set([
	"workspace",
	"acceptRisk",
	"reset",
	"resetScope",
	"nonInteractive",
	"agentName",
	"team",
	"tui",
	"skipUi",
	"suppressGatewayTokenOutput"
]);
function wantsClassicInteractiveSetup(opts) {
	if (opts.classic === true) return true;
	if (opts.installDaemon !== void 0 || opts.customImageInput !== void 0) return true;
	for (const [key, value] of Object.entries(opts)) {
		if (GUIDED_SAFE_ONBOARD_KEYS.has(key) || key === "installDaemon") continue;
		if (value === void 0 || value === false) continue;
		return true;
	}
	return false;
}
/** Runs the onboard command after normalizing legacy flags and setup mode. */
async function setupWizardCommand(opts, runtime = defaultRuntime) {
	await assertSupportedRuntime(runtime);
	const { authChoice: normalizedAuthChoice, deprecated } = resolveLegacyOnboardAuthChoice(opts.authChoice, { env: process.env });
	if (opts.nonInteractive && deprecated) {
		rejectOnboardingOption(opts, runtime, deprecated.nonInteractiveError);
		return;
	}
	if (deprecated) runtime.log(deprecated.message);
	const flow = opts.flow === "manual" ? "advanced" : opts.flow;
	const normalizedOpts = normalizedAuthChoice === opts.authChoice && flow === opts.flow ? opts : {
		...opts,
		authChoice: normalizedAuthChoice,
		flow
	};
	if (normalizedOpts.agentName !== void 0) {
		const { validateFirstOnboardingAgentName } = await import("./onboard-agent-wGih_UzJ.mjs");
		const error = validateFirstOnboardingAgentName(normalizedOpts.agentName);
		if (error) {
			rejectOnboardingOption(normalizedOpts, runtime, `Invalid --agent-name: ${error}`);
			return;
		}
	}
	if (!validatePreflightOptions(normalizedOpts, runtime)) return;
	if (normalizedOpts.team && (normalizedOpts.mode === "remote" || normalizedOpts.importFrom || normalizedOpts.importSource || normalizedOpts.flow === "import" || !normalizedOpts.nonInteractive && wantsClassicInteractiveSetup(normalizedOpts))) {
		rejectOnboardingOption(normalizedOpts, runtime, "--team supports local guided or non-interactive onboarding. Remove classic, remote, or import options.");
		return;
	}
	if (normalizedOpts.classic && normalizedOpts.nonInteractive) {
		rejectOnboardingOption(normalizedOpts, runtime, "--classic cannot be combined with --non-interactive. Remove --non-interactive to open the classic wizard, or remove --classic for automated setup.");
		return;
	}
	if (normalizedOpts.tui && normalizedOpts.nonInteractive) {
		rejectOnboardingOption(normalizedOpts, runtime, "--tui cannot be combined with --non-interactive. Remove --tui for automation, or remove --non-interactive to open the terminal hatch.");
		return;
	}
	if (normalizedOpts.secretInputMode && normalizedOpts.secretInputMode !== "plaintext" && normalizedOpts.secretInputMode !== "ref") {
		rejectOnboardingOption(normalizedOpts, runtime, `Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for the interactive setup.`);
		return;
	}
	if (normalizedOpts.resetScope && !VALID_RESET_SCOPES.has(normalizedOpts.resetScope)) {
		rejectOnboardingOption(normalizedOpts, runtime, `Invalid --reset-scope. Use "config", "config+creds+sessions", or "full". Run ${formatCliCommand("openclaw onboard --reset --reset-scope config")} for a config-only reset.`);
		return;
	}
	if (normalizedOpts.resetScope && !normalizedOpts.reset) {
		rejectOnboardingOption(normalizedOpts, runtime, `--reset-scope requires --reset. Re-run with ${formatCliCommand(`openclaw onboard --reset --reset-scope ${normalizedOpts.resetScope}`)}.`);
		return;
	}
	if (normalizedOpts.nonInteractive && normalizedOpts.acceptRisk !== true) {
		rejectOnboardingOption(normalizedOpts, runtime, [
			"Non-interactive setup requires explicit risk acknowledgement.",
			"Read: https://docs.openclaw.ai/security",
			`Re-run with: ${formatCliCommand("openclaw onboard --non-interactive --accept-risk ...")}`
		].join("\n"));
		return;
	}
	if (!normalizedOpts.nonInteractive && !hasInteractiveOnboardingTty()) {
		rejectOnboardingOption(normalizedOpts, runtime, t("wizard.guided.ttyRequired"));
		return;
	}
	if (process.platform === "win32") runtime.log([
		"Windows detected - OpenClaw runs great on WSL2!",
		"Native Windows might be trickier.",
		"Quick setup: wsl --install (one command, one reboot)",
		"Guide: https://docs.openclaw.ai/windows"
	].join("\n"));
	const runSetup = normalizedOpts.nonInteractive ? runNonInteractiveSetup : wantsClassicInteractiveSetup(normalizedOpts) ? runInteractiveSetup : runGuidedOnboarding;
	const runSetupAfterOptionalReset = async () => {
		if (normalizedOpts.reset) {
			const snapshot = await readConfigFileSnapshot();
			const baseConfig = snapshot.sourceConfig ?? (snapshot.valid ? snapshot.config : {});
			const resetScope = normalizedOpts.resetScope ?? "config+creds+sessions";
			const setupBaseConfig = {};
			const setupWorkspaceDir = resolveUserPath(normalizedOpts.workspace ?? DEFAULT_WORKSPACE);
			const configuredWorkspace = normalizedOpts.workspace ?? baseConfig.agents?.defaults?.workspace;
			if (resetScope === "full" && normalizedOpts.workspace === void 0 && snapshot.exists && !snapshot.valid && snapshot.readError !== void 0) {
				rejectOnboardingOption(normalizedOpts, runtime, "Cannot determine the configured workspace from an unreadable config. Pass --workspace with the workspace to remove, or use a narrower --reset-scope.");
				return;
			}
			if (resetScope === "full" && configuredWorkspace !== void 0 && (typeof configuredWorkspace !== "string" || !configuredWorkspace.trim())) {
				rejectOnboardingOption(normalizedOpts, runtime, "Configured workspace is invalid. Pass --workspace with the workspace to remove, or use a narrower --reset-scope.");
				return;
			}
			const workspaceDir = resolveUserPath(typeof configuredWorkspace === "string" && configuredWorkspace.trim() ? configuredWorkspace : DEFAULT_WORKSPACE);
			if (!await validateResetAuthChoice({
				opts: normalizedOpts,
				runtime,
				baseConfig: setupBaseConfig,
				workspaceDir: setupWorkspaceDir,
				resetScope
			})) return;
			if (!validateResetNonInteractiveGateway({
				opts: normalizedOpts,
				runtime,
				baseConfig: setupBaseConfig
			})) return;
			if (!validateResetMigrationImport({
				opts: normalizedOpts,
				runtime
			})) return;
			await handleReset(resetScope, workspaceDir, runtime);
		}
		await runSetup(normalizedOpts, runtime);
	};
	await withSetupMigrationTargetLock(resolveStateDir(), runSetupAfterOptionalReset);
}
//#endregion
export { setupWizardCommand };
