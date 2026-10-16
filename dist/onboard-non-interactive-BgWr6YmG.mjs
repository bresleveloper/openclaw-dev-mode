import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { a as writeRuntimeJson, r as defaultRuntime, t as ExitError } from "./runtime-DlO3PTAd.mjs";
import { p as redactSecrets } from "./redact-DJ8j6ADa.mjs";
import { a as createGatewayEnvSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort, s as isDefaultStateDir } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { n as listAgentEntries } from "./agent-roster-BXD1uMJD.mjs";
import { t as ConfigMutationConflictError } from "./mutation-conflict-Be0wSyDG.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import "./io-CUI9EWW_.mjs";
import { r as replaceConfigFile } from "./mutate-Br6nKTV_.mjs";
import "./config-CzeZu5J_.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import { n as resolveCanonicalConfiguredSecretInputWithFallback } from "./resolve-configured-secret-input-string-DYW8NiQl.mjs";
import { r as resolveLocalControlUiProbeLinks } from "./control-ui-links-CvxEAkDu.mjs";
import { n as applyWizardMetadata, p as waitForGatewayReachable, t as DEFAULT_WORKSPACE, u as probeGatewayReachable } from "./onboard-helpers-Bsi2Iqsv.mjs";
import { a as ensureOnboardingAgentWorkspace, c as resolveOnboardingAgentTarget, l as resolveOnboardingSetupTarget } from "./onboard-agent-target-DdbF_syb.mjs";
import { t as enableDefaultOnboardingInternalHooks } from "./onboard-hooks-CWFxUH6y.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { r as logConfigUpdated } from "./logging-BBc-wU1i.mjs";
import "./daemon-runtime-DLyccFUz.mjs";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-DwRGW16c.mjs";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-C7yy4gSh.mjs";
import { n as applySkipBootstrapConfig, r as resolveOnboardingWorkspaceConflict, t as applyLocalSetupWorkspaceConfig } from "./onboard-config-C_SVkFXX.mjs";
import { u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-Bw2NZurp.mjs";
import { t as rejectOnboardingOption } from "./onboard-options-CNC8ppU5.mjs";
import { t as applyNonInteractiveGatewayConfig } from "./gateway-config-BxnnuBtR.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/onboard-non-interactive/config-write.ts
/** Commits a non-interactive onboard config update with pending plugin records handled first. */
async function commitNonInteractiveOnboardConfig(params) {
	const { writeWizardConfigFile } = await import("./setup.shared-BtC-LiFr.mjs");
	return (await writeWizardConfigFile(params.nextConfig, {
		mergeBase: params.baseConfig,
		allowConfigSizeDrop: params.reset === true,
		...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {}
	})).nextConfig;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/output.ts
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
function classifyGatewayHealthFailure(params) {
	const detail = params.detail ?? "";
	const connectionRefused = /\b(?:econnrefused|connection refused|connect refused)\b/i.test(detail);
	const lastGatewayError = params.diagnostics?.lastGatewayError ?? "";
	const combined = `${detail}\n${lastGatewayError}`;
	if (/\b(?:unauthorized|forbidden|invalid token|invalid password|auth mismatch)\b/i.test(combined)) return "auth-mismatch";
	if (/\b(?:runtime[- ]deps?|runtime dependencies|cannot find (?:module|package)|(?:err_)?module_not_found|sqlite-vec|loadextension)\b/i.test(combined)) return "module-missing";
	if (params.diagnostics?.service?.loadState.status === "not-loaded" && connectionRefused) return "service-missing";
	const runtimeStatus = params.diagnostics?.service?.runtimeStatus;
	if (runtimeStatus && runtimeStatus !== "running" && runtimeStatus !== "active" && connectionRefused) return "service-stopped";
	if (lastGatewayError.trim()) return "startup-blocked";
	if (connectionRefused) return "not-listening";
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
function applyNonInteractiveSkillsConfig(params) {
	const { nextConfig, opts } = params;
	if (opts.skipSkills) return nextConfig;
	return {
		...nextConfig,
		skills: {
			...nextConfig.skills,
			install: {
				...nextConfig.skills?.install,
				nodeManager: opts.nodeManager ?? nextConfig.skills?.install?.nodeManager ?? "npm"
			}
		}
	};
}
//#endregion
//#region src/commands/onboard-non-interactive/local/workspace.ts
function resolveNonInteractiveWorkspaceDir(params) {
	const env = params.env ?? process.env;
	const implicitWorkspaceDir = isDefaultStateDir(env) ? params.defaultWorkspaceDir : path.join(resolveStateDir(env), "workspace");
	const raw = (params.opts.workspace?.trim() || params.baseConfig.agents?.defaults?.workspace?.trim() || env.OPENCLAW_WORKSPACE_DIR?.trim() || implicitWorkspaceDir).trim();
	return resolveUserPath(raw, env);
}
//#endregion
//#region src/commands/onboard-non-interactive/local.ts
async function collectGatewayHealthFailureDiagnostics() {
	const diagnostics = {};
	try {
		const { readGatewayServiceState, resolveGatewayService } = await import("./service-DKlTORHB.mjs");
		const service = resolveGatewayService();
		const state = await readGatewayServiceState(service, { env: process.env });
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
		const { readLastGatewayErrorLine } = await import("./diagnostics-BRkyS2cA.mjs");
		diagnostics.lastGatewayError = await readLastGatewayErrorLine(process.env) ?? void 0;
	} catch (err) {
		diagnostics.inspectError = diagnostics.inspectError ? `${diagnostics.inspectError}; log diagnostics failed: ${String(err)}` : `log diagnostics failed: ${String(err)}`;
	}
	return diagnostics.service || diagnostics.lastGatewayError || diagnostics.inspectError ? diagnostics : void 0;
}
/** Resolves the auth material used by the post-setup gateway health probe. */
async function resolveGatewayHealthProbeAuth(nextConfig) {
	if (nextConfig.gateway?.auth?.mode === "password" || nextConfig.gateway?.auth?.mode === "trusted-proxy") {
		const resolved = await resolveCanonicalConfiguredSecretInputWithFallback({
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
	const inferredAuthChoice = opts.authChoice ? void 0 : (await import("./auth-choice-inference-Wzfzjj98.mjs")).inferAuthChoiceFromFlags(opts, {
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
	const gatewayResult = await applyNonInteractiveGatewayConfig({
		nextConfig,
		opts,
		runtime,
		defaultPort: resolveGatewayPort(baseConfig)
	});
	if (!gatewayResult) return;
	nextConfig = gatewayResult.nextConfig;
	nextConfig = applyNonInteractiveSkillsConfig({
		nextConfig,
		opts
	});
	if (authChoice !== "skip") {
		const { applyNonInteractiveAuthChoice } = await import("./auth-choice-BPOXl4v0.mjs");
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
	const { ensureOnboardingAgent } = await import("./onboard-agent-Ck7FknBa.mjs");
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
		const { installGatewayDaemonNonInteractive } = await import("./daemon-install-DjXZ0S_k.mjs");
		const daemonInstall = await installGatewayDaemonNonInteractive({
			nextConfig,
			opts,
			runtime,
			port: gatewayResult.port
		});
		daemonInstallStatus = {
			requested: true,
			installed: daemonInstall.installed,
			...!daemonInstall.installed ? { skippedReason: daemonInstall.skippedReason } : {}
		};
		if (!daemonInstall.installed) {
			logNonInteractiveOnboardingFailure({
				opts,
				runtime,
				mode,
				phase: "daemon-install",
				message: daemonInstall.skippedReason === "systemd-user-unavailable" ? "Gateway service install is unavailable because systemd user services are not reachable in this Linux session." : "Gateway service install did not complete successfully.",
				installDaemon: true,
				daemonInstall: daemonInstallStatus,
				daemonRuntime: daemonRuntimeRaw,
				hints: daemonInstall.skippedReason === "systemd-user-unavailable" ? ["Fix: rerun without `--install-daemon` for one-shot setup, or enable a working user-systemd session and retry.", "If your auth profile uses env-backed refs, keep those env vars set in the shell that runs `openclaw gateway run` or `openclaw agent --local`."] : [`Run \`${formatCliCommand("openclaw gateway status --deep")}\` for more detail.`]
			});
			runtime.exit(1);
			return;
		}
	}
	if (!opts.skipHealth) {
		const { healthCommandNonExiting } = await import("./health-Di8Li2pp.mjs");
		const links = resolveLocalControlUiProbeLinks({
			bind: gatewayResult.bind,
			port: gatewayResult.port,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: void 0,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const healthFailureContext = {
			opts,
			runtime,
			mode,
			phase: "gateway-health",
			gateway: {
				wsUrl: links.wsUrl,
				httpUrl: links.httpUrl
			},
			installDaemon: Boolean(opts.installDaemon),
			daemonInstall: daemonInstallStatus,
			daemonRuntime: opts.installDaemon ? daemonRuntimeRaw : void 0
		};
		const startupTiming = opts.installDaemon ? resolveGatewayStartupTiming() : { deadlineMs: 15e3 };
		const probeAuth = await resolveGatewayHealthProbeAuth(nextConfig);
		const probeParams = {
			url: links.wsUrl,
			token: probeAuth.token,
			password: probeAuth.password
		};
		const probe = opts.installDaemon === false ? await probeGatewayReachable(probeParams) : await waitForGatewayReachable({
			...probeParams,
			...startupTiming
		});
		if (!probe.ok) {
			const detail = [probe.detail, probeAuth.unresolvedRefReason].filter(Boolean).join("\n") || void 0;
			const diagnostics = opts.installDaemon ? await collectGatewayHealthFailureDiagnostics() : void 0;
			const explicitlySkippedAbsentGateway = opts.installDaemon === false && classifyGatewayHealthFailure({
				detail,
				diagnostics
			}) === "not-listening";
			if (explicitlySkippedAbsentGateway && !opts.json) runtime.log("Setup complete; gateway was not installed or started because daemon installation was explicitly skipped.");
			if (!explicitlySkippedAbsentGateway || !opts.json) logNonInteractiveOnboardingFailure({
				...healthFailureContext,
				message: `Gateway did not become reachable at ${links.wsUrl}.`,
				detail,
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
					localPortOverride: gatewayResult.port,
					token: probeAuth.token,
					password: probeAuth.password
				}, healthRuntime);
			} catch (err) {
				const detail = err instanceof ExitError ? capturedHealthLines.join("\n") || void 0 : formatErrorMessage(err);
				logNonInteractiveOnboardingFailure({
					...healthFailureContext,
					message: `Gateway is reachable at ${links.wsUrl}, but the health check failed.`,
					detail,
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
	const { detectSetupMigrationSources, runSetupMigrationImport } = await import("./setup.migration-import-BJNI-Anb.mjs");
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
	const baseConfig = snapshot.valid && snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
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
		}, () => withPluginLifecycleLease({}, () => runNonInteractiveSetupExclusive(opts, runtime)));
	});
}
//#endregion
export { runNonInteractiveSetup };
