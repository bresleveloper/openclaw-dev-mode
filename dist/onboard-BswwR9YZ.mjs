import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { l as isValidEnvSecretRefId } from "./ref-contract-D0kWy5jy.mjs";
import "./types.secrets-DsPRn9Dz.mjs";
import "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { b as resolveGatewayPort } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { t as assertSupportedRuntime } from "./runtime-guard-BoZCdLcu.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import "./config-9720xhC5.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BWz3K_lG.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BC20Lo4u.mjs";
import { r as t } from "./i18n-Cuh2pEdZ.mjs";
import { o as handleReset, t as DEFAULT_WORKSPACE } from "./onboard-helpers-BpPrDUJb.mjs";
import { l as resolveOnboardingSetupTarget } from "./onboard-agent-target-B6YZOGfo.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import "./onboard-interactive-runner-D9V_M8I4.mjs";
import { r as resolveProviderMatch } from "./provider-auth-choice-helpers-0TooT_a6.mjs";
import { o as normalizeTokenProviderInput } from "./provider-auth-input-RxRibHGK.mjs";
import { a as GENERIC_PROVIDER_AUTH_CHOICES, r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-MNCvEMJL.mjs";
import { t as resolveLegacyOnboardAuthChoice } from "./auth-choice-legacy-Cgr33jHu.mjs";
import { n as validateGatewayWebSocketUrl } from "./onboard-remote-B6VpgZCq.mjs";
import { u as withSetupMigrationTargetLock } from "./setup.migration-snapshot-Bw2NZurp.mjs";
import { n as validateOnboardingChoiceOptions, t as rejectOnboardingOption } from "./onboard-options-CNC8ppU5.mjs";
import { t as applyNonInteractiveGatewayConfig } from "./gateway-config-Bokao-Bh.mjs";
import { t as inferAuthChoiceFromFlags } from "./auth-choice-inference-DnJBD4R_.mjs";
import path from "node:path";
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
	const { resolveNonInteractiveApiKey: resolveNonInteractiveCredential } = await import("./api-keys-BdH3z-OJ.mjs");
	const target = resolveOnboardingSetupTarget(params.baseConfig, params.opts.agentName || params.opts.team ? {
		name: params.opts.agentName ?? "coordinator",
		workspaceDir: params.opts.team ? path.join(params.workspaceDir, normalizeAgentId(params.opts.agentName ?? "coordinator")) : params.workspaceDir
	} : void 0);
	if (authChoice === "custom-api-key") {
		const { applyCustomApiConfig, CustomApiError, parseNonInteractiveCustomApiFlags, resolveCustomProviderId } = await import("./onboard-custom-config-C1qIpPO8.mjs");
		try {
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
			const customCredential = await resolveNonInteractiveCredential({
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
				...custom,
				config: params.baseConfig,
				apiKey: void 0
			});
		} catch (error) {
			const message = error instanceof CustomApiError && (error.code === "missing_required" || error.code === "invalid_compatibility") ? error.message : `Invalid custom provider config: ${formatErrorMessage(error)}`;
			return rejectOnboardingOption(params.opts, params.runtime, message);
		}
	} else {
		const runtimeMethod = (providerAuthChoice ? resolveProviderMatch((await import("./provider-auth-choice.runtime.js")).resolvePluginProviders({
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
			resolveApiKey: async (input) => await resolveNonInteractiveCredential({
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
	return Object.entries(opts).some(([key, value]) => !GUIDED_SAFE_ONBOARD_KEYS.has(key) && value !== void 0 && value !== false);
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
		const { validateFirstOnboardingAgentName } = await import("./onboard-agent-DJcd-H9Y.mjs");
		const error = validateFirstOnboardingAgentName(normalizedOpts.agentName);
		if (error) {
			rejectOnboardingOption(normalizedOpts, runtime, `Invalid --agent-name: ${error}`);
			return;
		}
	}
	if (!validatePreflightOptions(normalizedOpts, runtime)) return;
	if (normalizedOpts.workspace?.trim()) {
		const { validateSetupWorkspacePath } = await import("./setup.workspace-CY-Vz6XF.mjs");
		const error = validateSetupWorkspacePath(normalizedOpts.workspace.trim());
		if (error) {
			rejectOnboardingOption(normalizedOpts, runtime, `Invalid --workspace: ${error}`);
			return;
		}
	}
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
	if (!normalizedOpts.nonInteractive && !isTerminalInteractive()) {
		rejectOnboardingOption(normalizedOpts, runtime, t("wizard.guided.ttyRequired"));
		return;
	}
	if (process.platform === "win32") runtime.log([
		"Windows detected - OpenClaw runs great on WSL2!",
		"Native Windows might be trickier.",
		"Quick setup: wsl --install (one command, one reboot)",
		"Guide: https://docs.openclaw.ai/windows"
	].join("\n"));
	const runSetup = normalizedOpts.nonInteractive ? (await import("./onboard-non-interactive-jGNxBpfE.mjs")).runNonInteractiveSetup : wantsClassicInteractiveSetup(normalizedOpts) ? (await import("./onboard-interactive-D0mOGOVd.mjs")).runInteractiveSetup : (await import("./commands/onboard-guided.js")).runGuidedOnboarding;
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
			if (normalizedOpts.nonInteractive && (normalizedOpts.mode ?? "local") !== "remote" && !await applyNonInteractiveGatewayConfig({
				nextConfig: setupBaseConfig,
				opts: normalizedOpts,
				runtime,
				defaultPort: resolveGatewayPort(setupBaseConfig)
			})) return;
			if (normalizedOpts.importFrom || normalizedOpts.importSource || normalizedOpts.importSecrets || normalizedOpts.flow === "import") {
				rejectOnboardingOption(normalizedOpts, runtime, "Migration import cannot be combined with --reset because provider input must be planned before any state is removed. Run the import without --reset.");
				return;
			}
			await handleReset(resetScope, workspaceDir, runtime);
		}
		await runSetup(normalizedOpts, runtime);
	};
	await withSetupMigrationTargetLock(resolveStateDir(), runSetupAfterOptionalReset);
}
//#endregion
export { setupWizardCommand };
