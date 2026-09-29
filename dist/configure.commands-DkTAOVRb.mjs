import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as defaultRuntime, t as ExitError } from "./runtime-BC29JSZp.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { O as listAgentIds, S as tryResolveLegacyCompatibilityAgentId, b as tryResolveAmbientOwnerAgentId, g as resolveMutableAgentEntry } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as CONFIG_PATH, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { c as isSecretRef, h as resolveDefaultSecretProviderAlias, l as isValidEnvSecretRefId } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { o as resolvePluginContributionOwners } from "./plugin-registry-contributions-CHC0CCKR.mjs";
import "./plugin-registry-CVPVm6lt.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { y as parseIpAddressOrCidr } from "./ip-CDH5BTTD.mjs";
import { r as listChatChannels } from "./chat-meta-CrZhPtTU.mjs";
import { r as getRuntimeConfig, u as readConfigFileSnapshotForWrite } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { _ as isNonFatalSystemdInstallProbeError } from "./systemd-service-files-tGuARbbA.mjs";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-Bky3P_UA.mjs";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-D15REPfs.mjs";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-DvAunsR_.mjs";
import { a as isLoopbackAddress, d as isTrustedProxyAddress } from "./net-DU4aWKLv.mjs";
import { r as findTailscaleBinary } from "./tailscale-BRIsmHIP.mjs";
import { r as isInvalidGatewaySecret } from "./known-weak-gateway-secrets-BzNXiOK5.mjs";
import { t as randomToken } from "./random-token-B1woZa_H.mjs";
import { a as resolveGatewayService, t as describeGatewayServiceRestart } from "./service-BCULlL85.mjs";
import "./systemd-j8mO8n69.mjs";
import { o as formatPortRangeHint } from "./error-format-B21fL1a_.mjs";
import { t as parsePort } from "./parse-port-BGoDUr--.mjs";
import { r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.mjs";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-BaSdm1-m.mjs";
import { t as resolveGatewayStartupTiming } from "./gateway-startup-timing-D9NqKiRl.mjs";
import { t as formatWindowsGatewayFirewallGuidance } from "./windows-gateway-firewall-diagnostics-COhnqzT6.mjs";
import { r as resolveLocalControlUiProbeLinks, t as resolveAdvertisedControlUiLinks } from "./control-ui-links-eOymVKB5.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
import { t as describeCodexNativeWebSearch } from "./codex-native-web-search.shared-ZWu7Abre.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { a as guardCancel, d as summarizeExistingConfig, f as validateGatewayPasswordInput, n as applyWizardMetadata, p as waitForGatewayReachable, s as normalizeGatewayTokenInput, t as DEFAULT_WORKSPACE, u as probeGatewayReachable } from "./onboard-helpers-0ZuVvEiw.mjs";
import { a as ensureOnboardingAgentWorkspace, c as resolveOnboardingAgentTarget, i as applyOnboardingWorkspace, n as applyOnboardingPrimaryModel, r as applyOnboardingUtilityModel, t as applyAgentModelDefaults } from "./onboard-agent-target-pGC2ybZv.mjs";
import { l as writeWizardConfigFile } from "./setup.shared-Co1UMZxa.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { r as withProgress } from "./progress-BQygak_O.mjs";
import { t as createClackPrompter } from "./clack-prompter-D8DhCvTT.mjs";
import { r as logConfigUpdated } from "./logging-DLCoHZv9.mjs";
import { a as outro, c as select, i as intro, l as text, n as CONFIGURE_WIZARD_SECTIONS, o as parseConfigureWizardSections, r as confirm, s as password, t as CONFIGURE_SECTION_OPTIONS } from "./configure.shared-DOWYdaU1.mjs";
import { i as setupChannels, n as createChannelSetupHooks } from "./onboard-channels-FjF6isyj.mjs";
import { n as promptAuthChoiceGrouped } from "./auth-choice-prompt-DBmMCjkm.mjs";
import { i as applyAuthChoice } from "./auth-choice-BlSCrVae.mjs";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-Bw-b8O_1.mjs";
import { t as resolveGatewaySetupRuntime } from "./gateway-setup-runtime-CE2bR8AJ.mjs";
import { t as ensureSystemdUserLingerInteractive } from "./systemd-linger-BtC6vBIB.mjs";
import { i as promptModelAllowlist, n as applyModelFallbacksFromSelection, r as promptDefaultModel, t as applyModelAllowlist } from "./model-picker-CJCbw3h8.mjs";
import { t as loadStaticManifestCatalogRowsForList } from "./list.manifest-catalog-SEV8-eAe.mjs";
import { t as promptCustomApiConfig } from "./onboard-custom-DRsNJAZJ.mjs";
import { t as validateDottedDecimalIPv4Input } from "./ipv4-CJtO5102.mjs";
import { i as maybeAddTailnetOriginToControlUiAllowedOrigins, n as TAILSCALE_EXPOSURE_OPTIONS, r as TAILSCALE_MISSING_BIN_NOTE_LINES, t as TAILSCALE_DOCS_LINES } from "./gateway-config-prompts.shared-Dd6tegNp.mjs";
import { i as formatHealthCheckFailure } from "./health-format-dbbKwHdv.mjs";
import { a as healthCommandNonExiting } from "./health-UMPZgcnB.mjs";
import { t as promptRemoteGatewayConfig } from "./onboard-remote-BB6eCc-t.mjs";
import { t as setupSkills } from "./onboard-skills-ZH9ZGSgH.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/configure.channels.ts
const RESERVED_CHANNEL_CONFIG_KEYS = /* @__PURE__ */ new Set(["defaults", "modelByChannel"]);
const DONE_VALUE = { kind: "done" };
function listConfiguredChannelRemovalChoices(cfg) {
	const channels = cfg.channels;
	if (!channels) return [];
	const labelsById = new Map(listChatChannels().map((meta) => [meta.id, formatChannelRemovalLabel(meta.label, meta.id)]));
	return Object.keys(channels).filter((id) => !RESERVED_CHANNEL_CONFIG_KEYS.has(id)).filter((id) => !isBlockedObjectKey(id)).map((id) => ({
		id,
		label: labelsById.get(id) ?? formatUnknownChannelRemovalLabel(id)
	})).toSorted(compareChannelRemovalChoices);
}
function formatChannelRemovalLabel(label, fallback) {
	return sanitizeTerminalText(label) || formatUnknownChannelRemovalLabel(fallback);
}
function formatUnknownChannelRemovalLabel(id) {
	return sanitizeTerminalText(id) || "<invalid channel key>";
}
function compareChannelRemovalChoices(left, right) {
	return left.label.localeCompare(right.label, void 0, {
		numeric: true,
		sensitivity: "base"
	}) || left.id.localeCompare(right.id, void 0, {
		numeric: true,
		sensitivity: "base"
	});
}
/** Prompt for configured channel sections to remove from openclaw.json. */
async function removeChannelConfigWizard(cfg, runtime) {
	const next = { ...cfg };
	while (true) {
		const configured = listConfiguredChannelRemovalChoices(next);
		if (configured.length === 0) {
			note(["No channel config found in openclaw.json.", `Tip: \`${formatCliCommand("openclaw channels status")}\` shows what is configured and enabled.`].join("\n"), "Remove channel");
			return next;
		}
		const channelOptions = configured.map((meta) => ({
			value: {
				kind: "channel",
				id: meta.id
			},
			label: meta.label,
			hint: "Deletes tokens + settings from config (credentials stay on disk)"
		}));
		const doneOption = {
			value: DONE_VALUE,
			label: "Done"
		};
		const options = [...channelOptions, doneOption];
		const choice = guardCancel(await select({
			message: "Remove which channel config?",
			options
		}), runtime, 1);
		if (choice.kind === "done") return next;
		const channel = choice.id;
		const label = configured.find((entry) => entry.id === channel)?.label ?? channel;
		if (!guardCancel(await confirm({
			message: `Delete ${label} configuration from ${shortenHomePath(CONFIG_PATH)}?`,
			initialValue: false
		}), runtime, 1)) continue;
		const nextChannels = { ...next.channels };
		delete nextChannels[channel];
		if (Object.keys(nextChannels).length) next.channels = nextChannels;
		else delete next.channels;
		note([`${label} selected for removal from config.`, "Note: credentials/sessions on disk are unchanged."].join("\n"), "Channel removal");
	}
}
//#endregion
//#region src/commands/configure.daemon.ts
/** Prompt to install, reinstall, restart, or skip the local Gateway service. */
async function maybeInstallDaemon(params) {
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch (error) {
		if (!isNonFatalSystemdInstallProbeError(error)) throw error;
		loaded = false;
	}
	let shouldCheckLinger = false;
	let shouldInstall = true;
	if (loaded) {
		const action = guardCancel(await select({
			message: "Gateway service already installed",
			options: [
				{
					value: "restart",
					label: "Restart"
				},
				{
					value: "reinstall",
					label: "Reinstall"
				},
				{
					value: "skip",
					label: "Skip"
				}
			]
		}), params.runtime, 1);
		if (action === "restart") {
			await withProgress({
				label: "Gateway service",
				indeterminate: true,
				delayMs: 0
			}, async (progress) => {
				progress.setLabel("Restarting Gateway service…");
				const restartResult = await service.restart({
					env: process.env,
					stdout: process.stdout
				});
				progress.setLabel(describeGatewayServiceRestart("Gateway", restartResult).progressMessage);
			});
			shouldCheckLinger = true;
			shouldInstall = false;
		}
		if (action === "skip") return "skipped";
	}
	if (shouldInstall) {
		let installError = null;
		const existingCommand = await service.readCommand(process.env);
		const selection = await resolveGatewaySetupRuntime({
			env: process.env,
			existingCommand,
			runtime: params.daemonRuntime,
			selectRuntime: async () => {
				if (GATEWAY_DAEMON_RUNTIME_OPTIONS.length === 1) return GATEWAY_DAEMON_RUNTIME_OPTIONS[0]?.value ?? "node";
				return guardCancel(await select({
					message: "Gateway service runtime",
					options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
					initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME
				}), params.runtime, 1);
			}
		});
		await withProgress({
			label: "Gateway service",
			indeterminate: true,
			delayMs: 0
		}, async (progress) => {
			progress.setLabel("Preparing Gateway service…");
			const cfg = getRuntimeConfig();
			const tokenResolution = await resolveGatewayInstallToken({
				config: cfg,
				env: process.env
			});
			for (const warning of tokenResolution.warnings) note(warning, "Gateway");
			if (tokenResolution.unavailableReason) {
				installError = [
					"Gateway install blocked:",
					tokenResolution.unavailableReason,
					"Fix gateway auth config/token input and rerun configure."
				].join(" ");
				progress.setLabel("Gateway service install blocked.");
				return;
			}
			const plan = await buildGatewayInstallPlan({
				env: selection.env,
				port: params.port,
				runtime: selection.runtime,
				pinnedRuntimePath: selection.pinnedRuntimePath,
				existingCommand,
				warn: (message, title) => note(message, title),
				config: cfg
			});
			progress.setLabel("Installing Gateway service…");
			try {
				await service.install({
					env: process.env,
					stdout: process.stdout,
					...plan,
					runtimePinUpdate: selection.runtimePinUpdate
				});
				progress.setLabel("Gateway service installed.");
			} catch (err) {
				installError = formatErrorMessage(err);
				progress.setLabel("Gateway service install failed.");
			}
		});
		if (installError) {
			note("Gateway service install failed: ".concat(installError), "Gateway");
			note(gatewayInstallErrorHint(), "Gateway");
			return "failed";
		}
		shouldCheckLinger = true;
	}
	if (shouldCheckLinger) await ensureSystemdUserLingerInteractive({
		runtime: params.runtime,
		prompter: {
			confirm: async (p) => guardCancel(await confirm(p), params.runtime, 1),
			note
		},
		reason: "Linux installs use a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
		requireConfirm: true
	});
	return "succeeded";
}
//#endregion
//#region src/commands/configure.gateway-auth.ts
async function resolveProviderChoiceModelPrompt(params) {
	const { resolvePluginProviders, resolveProviderPluginChoice } = await import("./provider-auth-choice.runtime.js");
	const resolved = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			mode: "setup"
		}),
		choice: params.authChoice,
		manifestChoice: resolveManifestProviderAuthChoice(params.authChoice, {
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			includeUntrustedWorkspacePlugins: false
		})
	});
	const wizard = resolved?.provider.wizard?.setup;
	if (!wizard) return resolved?.provider.id ? { provider: resolved.provider.id } : void 0;
	return {
		provider: resolved.provider.id,
		...wizard.modelAllowlist,
		...wizard.modelSelection?.promptWhenAuthChoiceProvided === true ? { loadCatalog: true } : {}
	};
}
function hasConfiguredProviderModels(cfg, provider) {
	if (!provider) return false;
	if ((cfg.models?.providers?.[provider]?.models?.length ?? 0) > 0) return true;
	const providerPrefix = `${provider}/`;
	return Object.keys(cfg.agents?.defaults?.models ?? {}).some((key) => key.trim().startsWith(providerPrefix));
}
function hasStaticManifestCatalogRows(cfg, provider) {
	if (!provider) return false;
	return loadStaticManifestCatalogRowsForList({
		cfg,
		providerFilter: provider
	}).length > 0;
}
function listConfiguredModelProviders(cfg) {
	return Object.entries(cfg.models?.providers ?? {}).filter(([, provider]) => (provider.models?.length ?? 0) > 0).map(([provider]) => provider);
}
function resolveSingleConfiguredProvider(cfg) {
	const configuredProviders = listConfiguredModelProviders(cfg);
	return configuredProviders.length === 1 ? configuredProviders[0] : void 0;
}
function resolveProviderFromModelRef(model) {
	const trimmed = model?.trim();
	const slashIndex = trimmed?.indexOf("/") ?? -1;
	return slashIndex > 0 ? trimmed?.slice(0, slashIndex) : void 0;
}
function resolveCanonicalOpenAISelectionForLegacyCodexPrimary(cfg, target, selectedModels) {
	const currentModel = resolveMutableAgentEntry(cfg, target.agentId)?.model ?? cfg.agents?.defaults?.model;
	const primary = typeof currentModel === "string" ? currentModel.trim() : currentModel && typeof currentModel === "object" && typeof currentModel.primary === "string" ? currentModel.primary.trim() : void 0;
	const modelId = primary?.startsWith("codex/") ? primary.slice(6).trim() : "";
	if (!modelId) return;
	const canonical = `openai/${modelId}`;
	return selectedModels.find((model) => model.trim() === canonical);
}
function resolveConfiguredProviderFromAuthChange(params) {
	if (hasConfiguredProviderModels(params.after, params.preferredProvider)) return params.preferredProvider;
	const beforeProviders = params.before.models?.providers ?? {};
	const configuredProviders = listConfiguredModelProviders(params.after);
	const changedProviders = configuredProviders.filter((provider) => {
		const beforeCount = beforeProviders[provider]?.models?.length ?? 0;
		return (params.after.models?.providers?.[provider]?.models?.length ?? 0) > beforeCount;
	});
	if (changedProviders.length === 1) return changedProviders[0];
	return params.preferredProvider ?? (configuredProviders.length === 1 ? configuredProviders[0] : void 0);
}
/** Preserve unrelated auth policy; replace mode-owned credentials and proxy settings. */
function buildGatewayAuthConfig(params) {
	const base = { ...params.existing };
	delete base.token;
	delete base.password;
	delete base.trustedProxy;
	if (params.mode === "token") {
		if (isSecretRef(params.token)) return {
			...base,
			mode: "token",
			token: params.token
		};
		const token = typeof params.token === "string" && !isInvalidGatewaySecret(params.token) ? params.token.trim() : randomToken();
		return {
			...base,
			mode: "token",
			token
		};
	}
	if (params.mode === "password") {
		const password = params.password?.trim();
		return {
			...base,
			mode: "password",
			...password && { password }
		};
	}
	if (params.mode === "trusted-proxy") {
		if (!params.trustedProxy) throw new Error(`trustedProxy config is required when mode is trusted-proxy. Run ${formatCliCommand("openclaw configure --section gateway")} to configure Gateway auth interactively.`);
		return {
			...base,
			mode: "trusted-proxy",
			trustedProxy: params.trustedProxy
		};
	}
	return base;
}
/** Prompt for model provider credentials and explicit default model policy settings. */
async function promptAuthConfig(cfg, runtime, prompter, target = resolveOnboardingAgentTarget(cfg)) {
	let next = cfg;
	let authChoice = "skip";
	let preferredProvider;
	while (true) {
		authChoice = await promptAuthChoiceGrouped({
			prompter,
			includeSkip: true,
			config: next
		});
		preferredProvider = authChoice === "skip" ? void 0 : await resolvePreferredProviderForAuthChoice({
			choice: authChoice,
			config: next
		});
		if (authChoice === "custom-api-key") {
			next = (await promptCustomApiConfig({
				prompter,
				runtime,
				config: next,
				target,
				setAsPrimary: !resolveAgentEffectiveModelPrimary(next, target.agentId)
			})).config;
			break;
		}
		if (authChoice === "skip") {
			const modelSelection = await promptDefaultModel({
				config: next,
				prompter,
				allowKeep: true,
				ignoreAllowlist: true,
				includeProviderPluginSetups: false,
				loadCatalog: true,
				browseCatalogOnDemand: true,
				preferredProvider,
				agentId: target.agentId,
				agentDir: target.agentDir,
				workspaceDir: target.workspaceDir,
				runtime
			});
			if (modelSelection.config) next = modelSelection.config;
			if (modelSelection.model) {
				next = applyOnboardingPrimaryModel(next, target, modelSelection.model);
				preferredProvider = resolveProviderFromModelRef(modelSelection.model) ?? preferredProvider;
			}
			break;
		}
		const beforeAuthConfig = next;
		const applied = await applyAuthChoice({
			authChoice,
			config: next,
			prompter,
			runtime,
			agentId: target.agentId,
			agentDir: target.agentDir,
			setDefaultModel: false,
			preserveExistingDefaultModel: true
		});
		next = applied.config;
		if (applied.utilityModelOverride) return applyOnboardingUtilityModel(next, target, applied.utilityModelOverride);
		if (applied.agentModelOverride && !resolveAgentEffectiveModelPrimary(beforeAuthConfig, target.agentId)) next = applyOnboardingPrimaryModel(next, target, applied.agentModelOverride);
		preferredProvider = resolveConfiguredProviderFromAuthChange({
			before: beforeAuthConfig,
			after: next,
			preferredProvider
		});
		if (applied.retrySelection) continue;
		break;
	}
	if (authChoice !== "custom-api-key") {
		const modelPrompt = await resolveProviderChoiceModelPrompt({
			authChoice,
			config: next,
			workspaceDir: target.workspaceDir,
			env: process.env
		});
		const promptProvider = modelPrompt?.provider ?? preferredProvider ?? resolveSingleConfiguredProvider(next);
		const hasPromptProviderConfiguredModels = hasConfiguredProviderModels(next, promptProvider);
		const hasPromptProviderStaticManifestRows = hasStaticManifestCatalogRows(next, promptProvider);
		const shouldLoadModelCatalog = modelPrompt?.loadCatalog ?? (hasPromptProviderConfiguredModels || hasPromptProviderStaticManifestRows);
		const useProviderScopedCatalog = Boolean(promptProvider && shouldLoadModelCatalog && (modelPrompt?.loadCatalog === true || hasPromptProviderConfiguredModels));
		const allowlistSelection = await promptModelAllowlist({
			config: next,
			prompter,
			agentId: target.agentId,
			agentDir: target.agentDir,
			workspaceDir: target.workspaceDir,
			env: process.env,
			allowedKeys: modelPrompt?.allowedKeys,
			initialSelections: modelPrompt?.initialSelections,
			message: modelPrompt?.message,
			preferredProvider: promptProvider,
			providerScopedCatalog: useProviderScopedCatalog,
			loadCatalog: shouldLoadModelCatalog
		});
		if (allowlistSelection.models) {
			const selectedModels = allowlistSelection.models;
			const canonicalPrimary = resolveCanonicalOpenAISelectionForLegacyCodexPrimary(next, target, selectedModels);
			if (canonicalPrimary) next = applyOnboardingPrimaryModel(next, target, canonicalPrimary);
			next = applyAgentModelDefaults(next, target, (projected) => applyModelAllowlist(applyModelFallbacksFromSelection(projected, selectedModels, { scopeKeys: allowlistSelection.scopeKeys }), selectedModels, { scopeKeys: allowlistSelection.scopeKeys }));
		}
	}
	return next;
}
//#endregion
//#region src/commands/configure.gateway.ts
function validateGatewayPortInput$1(value) {
	if (parsePort(value) === null) return formatPortRangeHint();
}
/** Prompt for local Gateway network/auth settings and return config plus call token. */
async function promptGatewayConfig(cfg, runtime) {
	const portRaw = guardCancel(await text({
		message: "Gateway port",
		initialValue: String(resolveGatewayPort(cfg)),
		validate: validateGatewayPortInput$1
	}), runtime, 1);
	const port = parsePort(portRaw) ?? resolveGatewayPort(cfg);
	let bind = guardCancel(await select({
		message: "Gateway bind mode",
		options: [
			{
				value: "loopback",
				label: "Loopback (Local only)",
				hint: "Bind to 127.0.0.1 - secure, local-only access"
			},
			{
				value: "tailnet",
				label: "Tailnet (Tailscale IP)",
				hint: "Bind to your Tailscale IP plus local loopback"
			},
			{
				value: "auto",
				label: "Auto (Loopback → LAN)",
				hint: "Prefer loopback; fall back to all interfaces if unavailable"
			},
			{
				value: "lan",
				label: "LAN (All interfaces)",
				hint: "Bind to 0.0.0.0 - accessible from anywhere on your network"
			},
			{
				value: "custom",
				label: "Custom IP",
				hint: "Specific IPv4s also bind 127.0.0.1"
			}
		]
	}), runtime, 1);
	let customBindHost;
	if (bind === "custom") {
		const input = guardCancel(await text({
			message: "Custom IP address",
			placeholder: "192.168.1.100",
			validate: validateDottedDecimalIPv4Input
		}), runtime, 1);
		customBindHost = readStringValue(input);
	}
	let authMode = guardCancel(await select({
		message: "Gateway access protection",
		options: [
			{
				value: "token",
				label: "Token (recommended)",
				hint: "Recommended default"
			},
			{
				value: "password",
				label: "Password"
			},
			{
				value: "trusted-proxy",
				label: "Trusted Proxy",
				hint: "Behind reverse proxy (Pomerium, Caddy, Traefik, etc.)"
			}
		],
		initialValue: "token"
	}), runtime, 1);
	let tailscaleMode = guardCancel(await select({
		message: "Tailscale exposure",
		options: [...TAILSCALE_EXPOSURE_OPTIONS]
	}), runtime, 1);
	let tailscaleBin = null;
	if (tailscaleMode !== "off") {
		tailscaleBin = await findTailscaleBinary();
		if (!tailscaleBin) note(TAILSCALE_MISSING_BIN_NOTE_LINES.join("\n"), "Tailscale Warning");
	}
	if (tailscaleMode !== "off") note(TAILSCALE_DOCS_LINES.join("\n"), "Tailscale");
	if (tailscaleMode !== "off" && bind !== "loopback") {
		note("Tailscale requires bind=loopback. Adjusting bind to loopback.", "Note");
		bind = "loopback";
	}
	if (tailscaleMode === "funnel" && authMode !== "password") {
		note("Tailscale funnel requires password auth.", "Note");
		authMode = "password";
	}
	if (authMode === "trusted-proxy" && tailscaleMode !== "off") {
		note("Trusted proxy auth is incompatible with Tailscale serve/funnel. Disabling Tailscale.", "Note");
		tailscaleMode = "off";
	}
	let gatewayToken;
	let gatewayTokenForCalls;
	let gatewayPassword;
	let trustedProxyConfig;
	let trustedProxies;
	let next = cfg;
	if (authMode === "token") {
		if (guardCancel(await select({
			message: "Gateway token source",
			options: [{
				value: "plaintext",
				label: "Generate/store plaintext token",
				hint: "Default"
			}, {
				value: "ref",
				label: "Use SecretRef",
				hint: "Store an env-backed reference instead of plaintext"
			}],
			initialValue: "plaintext"
		}), runtime, 1) === "ref") {
			const envVar = guardCancel(await text({
				message: "Gateway token env var",
				initialValue: "OPENCLAW_GATEWAY_TOKEN",
				placeholder: "OPENCLAW_GATEWAY_TOKEN",
				validate: (value) => {
					const candidate = normalizeOptionalString(value) ?? "";
					if (!isValidEnvSecretRefId(candidate)) return "Use an env var name like OPENCLAW_GATEWAY_TOKEN.";
					if (!process.env[candidate]?.trim()) return `Environment variable "${candidate}" is missing or empty in this session.`;
				}
			}), runtime, 1);
			const envVarName = normalizeOptionalString(envVar) ?? "";
			gatewayToken = {
				source: "env",
				provider: resolveDefaultSecretProviderAlias(cfg, "env", { preferFirstProviderForSource: true }),
				id: envVarName
			};
			note(`Validated ${envVarName}. OpenClaw will store a token SecretRef.`, "Gateway token");
		} else {
			const tokenInput = guardCancel(await password({ message: "Gateway token (blank to generate)" }), runtime, 1);
			gatewayTokenForCalls = normalizeGatewayTokenInput(tokenInput) || randomToken();
			gatewayToken = gatewayTokenForCalls;
		}
	}
	if (authMode === "password") {
		const passwordInput = guardCancel(await password({
			message: "Gateway password",
			validate: validateGatewayPasswordInput
		}), runtime, 1);
		gatewayPassword = normalizeOptionalString(passwordInput) ?? "";
	}
	if (authMode === "trusted-proxy") {
		note([
			"Trusted proxy mode: OpenClaw trusts user identity from a reverse proxy.",
			"The proxy must authenticate users and pass identity via headers.",
			"Only requests from specified proxy IPs will be trusted.",
			"",
			"Common use cases: Pomerium, Caddy + OAuth, Traefik + forward auth",
			"Docs: https://docs.openclaw.ai/gateway/trusted-proxy-auth"
		].join("\n"), "Trusted Proxy Auth");
		const userHeader = guardCancel(await text({
			message: "Header containing user identity",
			placeholder: "x-forwarded-user",
			initialValue: "x-forwarded-user",
			validate: (value) => value?.trim() ? void 0 : "User header is required"
		}), runtime, 1);
		const requiredHeadersRaw = guardCancel(await text({
			message: "Required headers (comma-separated, optional)",
			placeholder: "x-forwarded-proto,x-forwarded-host"
		}), runtime, 1);
		const requiredHeaders = requiredHeadersRaw ? normalizeStringEntries(requiredHeadersRaw.split(",")) : [];
		const allowUsersRaw = guardCancel(await text({
			message: "Allowed users (comma-separated, blank = all authenticated users)",
			placeholder: "nick@example.com,admin@company.com"
		}), runtime, 1);
		const allowUsers = allowUsersRaw ? normalizeStringEntries(allowUsersRaw.split(",")) : [];
		const trustedProxiesRaw = guardCancel(await text({
			message: "Trusted proxy IPs (comma-separated)",
			placeholder: "10.0.1.10,192.168.1.5",
			validate: (value) => (value ?? "").split(",").every((address) => parseIpAddressOrCidr(address)) ? void 0 : "Enter comma-separated IPv4 or IPv6 addresses or CIDR ranges (e.g. 10.0.0.1, ::1, 10.0.0.0/24); no empty entries."
		}), runtime, 1);
		trustedProxies = normalizeStringEntries(trustedProxiesRaw.split(","));
		const existingProxy = cfg.gateway?.auth?.mode === "trusted-proxy" ? cfg.gateway.auth.trustedProxy : void 0;
		let allowLoopback = existingProxy?.allowLoopback;
		if (trustedProxies.some((address) => {
			return [
				parseIpAddressOrCidr(address)?.[0].toString(),
				"127.0.0.1",
				"::1"
			].some((peer) => isLoopbackAddress(peer) && isTrustedProxyAddress(peer, [address]));
		})) {
			const title = t("wizard.gateway.trustedProxyLoopbackTitle");
			note(t("wizard.gateway.trustedProxyLoopbackWarning"), title);
			allowLoopback = guardCancel(await confirm({
				message: t("wizard.gateway.trustedProxyAllowLoopback"),
				initialValue: allowLoopback === true
			}), runtime, 1) || void 0;
			if (!allowLoopback) note(t("wizard.gateway.trustedProxyLoopbackRefused"), title);
		}
		trustedProxyConfig = {
			...existingProxy,
			userHeader: normalizeOptionalString(userHeader) ?? "",
			requiredHeaders: requiredHeaders.length > 0 ? requiredHeaders : void 0,
			allowUsers: allowUsers.length > 0 ? allowUsers : void 0,
			allowLoopback
		};
	}
	const authConfig = buildGatewayAuthConfig({
		existing: next.gateway?.auth,
		mode: authMode,
		token: gatewayToken,
		password: gatewayPassword,
		trustedProxy: trustedProxyConfig
	});
	next = {
		...next,
		gateway: {
			...next.gateway,
			mode: "local",
			port,
			bind,
			auth: authConfig,
			...customBindHost && { customBindHost },
			...trustedProxies && { trustedProxies },
			tailscale: {
				...next.gateway?.tailscale,
				mode: tailscaleMode
			}
		}
	};
	next = await maybeAddTailnetOriginToControlUiAllowedOrigins({
		config: next,
		tailscaleMode,
		tailscaleBin
	});
	return {
		config: next,
		port,
		token: gatewayTokenForCalls
	};
}
//#endregion
//#region src/commands/configure.wizard.ts
const GATEWAY_HINT_PROBE_TIMEOUT_MS = 300;
const loadSetupPluginConfigModule = createLazyPromise(() => import("./setup.plugin-config-Cg7Xdi_o.mjs"));
function validateGatewayPortInput(value) {
	if (parsePort(value) === null) return formatPortRangeHint();
}
async function runGatewayHealthCheck(params) {
	const localLinks = resolveLocalControlUiProbeLinks({
		bind: params.cfg.gateway?.bind ?? "loopback",
		port: params.port,
		customBindHost: params.cfg.gateway?.customBindHost,
		basePath: void 0,
		tlsEnabled: params.cfg.gateway?.tls?.enabled === true
	});
	const remoteUrl = params.cfg.gateway?.remote?.url?.trim();
	const remoteWsUrl = params.cfg.gateway?.mode === "remote" ? remoteUrl : void 0;
	const probeMode = remoteWsUrl ? "remote" : "local";
	const wsUrl = remoteWsUrl ?? localLinks.wsUrl;
	let token;
	let password;
	if (probeMode === "remote") {
		const remoteProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: params.cfg,
			env: process.env,
			mode: "remote"
		});
		if (remoteProbeAuth.warning) {
			const hasResolvedRemoteAuth = Boolean(remoteProbeAuth.auth.token || remoteProbeAuth.auth.password);
			note([
				"Could not resolve remote gateway SecretRef for health check.",
				remoteProbeAuth.warning,
				...hasResolvedRemoteAuth ? ["Continuing with the other configured remote credential."] : ["Health check skipped to avoid falling back to ambient credentials.", `Fix the SecretRef, then run \`${formatCliCommand("openclaw health")}\` again.`]
			].join("\n"), "Gateway auth");
			if (!hasResolvedRemoteAuth) return "skipped";
		}
		({token, password} = remoteProbeAuth.auth);
	} else {
		const localProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: params.cfg,
			env: process.env,
			mode: "local",
			localPrecedence: "env-first"
		});
		if (localProbeAuth.warning) {
			note([
				"Could not resolve local gateway SecretRef for health check.",
				localProbeAuth.warning,
				"Health check skipped to avoid falling back to ambient credentials.",
				`Fix the SecretRef, then run \`${formatCliCommand("openclaw health")}\` again.`
			].join("\n"), "Gateway auth");
			return "skipped";
		}
		({token, password} = localProbeAuth.auth);
	}
	try {
		const gatewayProbe = await waitForGatewayReachable({
			url: wsUrl,
			...probeMode === "remote" ? {
				config: params.cfg,
				originScopedDeviceAuth: true
			} : {},
			token,
			password,
			...params.daemonSetupOutcome === "succeeded" ? resolveGatewayStartupTiming() : { deadlineMs: 15e3 }
		});
		if (!gatewayProbe.ok) throw new Error(gatewayProbe.detail ?? `gateway did not become reachable at ${wsUrl}`);
		await healthCommandNonExiting({
			json: false,
			timeoutMs: 1e4,
			config: params.cfg,
			token,
			password,
			...probeMode === "local" ? { localPortOverride: params.port } : { ignoreEnvUrlOverride: true }
		}, params.runtime);
	} catch (err) {
		if (!(err instanceof ExitError)) params.runtime.error(formatHealthCheckFailure(err));
		note([
			"Docs:",
			"https://docs.openclaw.ai/gateway/health",
			"https://docs.openclaw.ai/gateway/troubleshooting"
		].join("\n"), "Health check help");
		return "failed";
	}
	return "succeeded";
}
async function promptConfigureSection(runtime, hasSelection) {
	return guardCancel(await select({
		message: "What do you want to configure?",
		options: [...CONFIGURE_SECTION_OPTIONS, {
			value: "__continue",
			label: hasSelection ? "Done" : "Skip for now"
		}],
		initialValue: CONFIGURE_SECTION_OPTIONS[0]?.value
	}), runtime, 1);
}
async function promptChannelMode(runtime) {
	return guardCancel(await select({
		message: "Channel setup",
		options: [{
			value: "configure",
			label: "Add or update channels",
			hint: "Configure accounts and disable unselected accounts"
		}, {
			value: "remove",
			label: "Remove channel config",
			hint: "Delete channel tokens/settings from openclaw.json"
		}],
		initialValue: "configure"
	}), runtime, 1);
}
async function promptWebToolsConfig(nextConfig, runtime, prompter) {
	const existingSearch = nextConfig.tools?.web?.search;
	const existingFetch = nextConfig.tools?.web?.fetch;
	const { isCodexNativeWebSearchRelevant } = await import("./codex-native-web-search-DDy_bs5I.mjs");
	const hasManagedSearchProviders = resolvePluginContributionOwners({
		config: nextConfig,
		contribution: "contracts",
		matches: "webSearchProviders"
	}).length > 0;
	note([
		"Web search lets your agent look things up online using the `web_search` tool.",
		"Codex-capable models can use native Codex web search.",
		"Other models use a separate web search provider, which you can configure here.",
		"Docs: https://docs.openclaw.ai/tools/web"
	].join("\n"), "Web search");
	const enableSearch = guardCancel(await confirm({
		message: "Enable the web_search tool?",
		initialValue: existingSearch?.enabled ?? hasManagedSearchProviders
	}), runtime, 1);
	let nextSearch = {
		...existingSearch,
		enabled: enableSearch
	};
	let workingConfig = nextConfig;
	if (enableSearch) {
		const codexRelevant = isCodexNativeWebSearchRelevant({ config: nextConfig });
		let configureManagedProvider = true;
		if (codexRelevant) {
			note([
				"Codex-capable models can use native Codex web search instead of a separate provider.",
				"Other models need a separate web search provider.",
				"If you do not choose one, OpenClaw can select a provider from available credentials; otherwise other models may not have web search.",
				...describeCodexNativeWebSearch(nextConfig) ? [describeCodexNativeWebSearch(nextConfig)] : []
			].join("\n"), "Codex native search");
			if (guardCancel(await confirm({
				message: "Enable native Codex web search for Codex-capable models?",
				initialValue: existingSearch?.openaiCodex?.enabled === true
			}), runtime, 1)) {
				const codexMode = guardCancel(await select({
					message: "Native Codex web search mode",
					options: [{
						value: "cached",
						label: "cached (recommended)",
						hint: "Uses cached web content"
					}, {
						value: "live",
						label: "live",
						hint: "Allows live external web access"
					}],
					initialValue: existingSearch?.openaiCodex?.mode ?? "cached"
				}), runtime, 1);
				nextSearch = {
					...nextSearch,
					openaiCodex: {
						...existingSearch?.openaiCodex,
						enabled: true,
						mode: codexMode
					}
				};
				configureManagedProvider = guardCancel(await confirm({
					message: existingSearch?.provider ? `Change the separate web search provider (currently ${existingSearch.provider})?` : "Also configure a separate web search provider for other models?",
					initialValue: Boolean(existingSearch?.provider)
				}), runtime, 1);
			} else nextSearch = {
				...nextSearch,
				openaiCodex: {
					...existingSearch?.openaiCodex,
					enabled: false
				}
			};
		}
		if (configureManagedProvider) {
			const { resolveSearchProviderOptions, runSearchSetupFlow } = await import("./search-setup-Clessnlk.mjs");
			if (resolveSearchProviderOptions(nextConfig).length === 0) {
				note([
					"No web search providers are currently available under this plugin policy.",
					"Enable plugins or remove deny rules, then rerun configure.",
					"Docs: https://docs.openclaw.ai/tools/web"
				].join("\n"), "Web search");
				if (nextSearch.openaiCodex?.enabled !== true) nextSearch = {
					...existingSearch,
					enabled: false
				};
			} else {
				workingConfig = (await runSearchSetupFlow(workingConfig, runtime, prompter, { preserveDisabledSearchState: false })).config;
				const selectedSearch = workingConfig.tools?.web?.search;
				nextSearch = {
					...selectedSearch,
					enabled: selectedSearch?.enabled ?? (selectedSearch?.provider ? true : existingSearch?.enabled),
					openaiCodex: {
						...existingSearch?.openaiCodex,
						...nextSearch.openaiCodex
					}
				};
			}
		}
	}
	note(["`web_fetch` is a separate tool for reading a specific URL.", "It does not require an API key and works independently of web search providers, including Codex."].join("\n"), "Web fetch");
	const enableFetch = guardCancel(await confirm({
		message: "Enable the web_fetch tool?",
		initialValue: existingFetch?.enabled ?? true
	}), runtime, 1);
	const nextFetch = {
		...workingConfig.tools?.web?.fetch,
		enabled: enableFetch
	};
	return {
		...workingConfig,
		tools: {
			...workingConfig.tools,
			web: {
				...workingConfig.tools?.web,
				search: nextSearch,
				fetch: nextFetch
			}
		}
	};
}
/** Run the configure/update wizard, optionally limited to selected sections. */
async function runConfigureWizard(opts, runtime = defaultRuntime) {
	try {
		intro(opts.command === "update" ? "OpenClaw update wizard" : "OpenClaw configure");
		const prompter = createClackPrompter();
		const prepared = await readConfigFileSnapshotForWrite();
		const snapshot = prepared.snapshot;
		const configWriteOwnership = {
			...prepared.writeOptions.assertConfigPathForWrite ? { assertConfigPathForWrite: prepared.writeOptions.assertConfigPathForWrite } : {},
			expectedConfigPath: prepared.writeOptions.expectedConfigPath,
			ownedConfigPathForWrite: prepared.writeOptions.ownedConfigPathForWrite
		};
		const currentBaseHash = snapshot.hash;
		const baseConfig = snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
		if (snapshot.exists) {
			const title = snapshot.valid ? "Existing config detected" : "Invalid config";
			note(summarizeExistingConfig(baseConfig), title);
			if (!snapshot.valid && snapshot.issues.length > 0) note([
				...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
				"",
				"Docs: https://docs.openclaw.ai/gateway/configuration"
			].join("\n"), "Config issues");
			if (!snapshot.valid) {
				outro(`Config invalid. Run \`${formatCliCommand("openclaw doctor --fix")}\` to apply supported repairs, then re-run configure.`);
				runtime.exit(1);
				return;
			}
		}
		const selectedSections = opts.sections;
		const shouldPromptGatewayRunMode = !selectedSections || selectedSections.includes("gateway") || selectedSections.includes("daemon") || selectedSections.includes("health");
		const promptGatewayRunMode = async () => {
			const localUrl = `ws://127.0.0.1:${resolveGatewayPort(baseConfig)}`;
			const remoteUrl = normalizeOptionalString(baseConfig.gateway?.remote?.url) ?? "";
			const localProbePromise = (async () => {
				const localProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
					cfg: baseConfig,
					env: process.env,
					mode: "local",
					localPrecedence: "env-first"
				});
				if (localProbeAuth.warning) return {
					ok: false,
					authUnavailable: true
				};
				return probeGatewayReachable({
					url: localUrl,
					token: localProbeAuth.auth.token,
					password: localProbeAuth.auth.password,
					timeoutMs: GATEWAY_HINT_PROBE_TIMEOUT_MS
				});
			})();
			const remoteProbePromise = remoteUrl ? (async () => {
				const remoteProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
					cfg: baseConfig,
					env: process.env,
					mode: "remote"
				});
				return probeGatewayReachable({
					url: remoteUrl,
					config: baseConfig,
					originScopedDeviceAuth: true,
					token: remoteProbeAuth.auth.token,
					...remoteProbeAuth.auth.password ? { password: remoteProbeAuth.auth.password } : {},
					timeoutMs: GATEWAY_HINT_PROBE_TIMEOUT_MS
				});
			})() : Promise.resolve(null);
			const [localProbe, remoteProbe] = await Promise.all([localProbePromise, remoteProbePromise]);
			return guardCancel(await select({
				message: "Where will the Gateway run?",
				options: [{
					value: "local",
					label: "Local (this machine)",
					hint: localProbe.ok ? `Gateway reachable (${localUrl})` : "authUnavailable" in localProbe ? `Gateway auth unavailable; probe skipped (${localUrl})` : `No gateway detected (${localUrl})`
				}, {
					value: "remote",
					label: "Remote (info-only)",
					hint: !remoteUrl ? "No remote URL configured yet" : remoteProbe?.ok ? `Gateway reachable (${remoteUrl})` : `Configured but unreachable (${remoteUrl})`
				}]
			}), runtime, 1);
		};
		const mode = shouldPromptGatewayRunMode ? await promptGatewayRunMode() : "local";
		const metadataMode = shouldPromptGatewayRunMode || baseConfig.gateway?.mode !== "remote" ? mode : "remote";
		const shouldSkipGatewaySummary = !shouldPromptGatewayRunMode;
		if (shouldPromptGatewayRunMode && mode === "remote") {
			let remoteConfig = await promptRemoteGatewayConfig(baseConfig, prompter);
			remoteConfig = applyWizardMetadata(remoteConfig, {
				command: opts.command,
				mode: metadataMode
			});
			remoteConfig = (await writeWizardConfigFile(remoteConfig, {
				mergeBase: baseConfig,
				...currentBaseHash !== void 0 ? { baseHash: currentBaseHash } : {},
				writeOptions: configWriteOwnership
			})).nextConfig;
			logConfigUpdated(runtime);
			if (selectedSections?.includes("health")) {
				const healthCheckOutcome = await runGatewayHealthCheck({
					cfg: remoteConfig,
					runtime,
					port: resolveGatewayPort(remoteConfig)
				});
				outro(healthCheckOutcome === "succeeded" ? "Remote gateway configured and health check completed." : healthCheckOutcome === "failed" ? "Remote gateway configured, but health check failed." : "Remote gateway configured; health check skipped.");
			} else outro("Remote gateway configured.");
			return;
		}
		let nextConfig = { ...baseConfig };
		let mergeBaseConfig = structuredClone(baseConfig);
		let hasPendingConfig = shouldPromptGatewayRunMode && nextConfig.gateway?.mode !== "local";
		if (hasPendingConfig) nextConfig = {
			...nextConfig,
			gateway: {
				...nextConfig.gateway,
				mode: "local"
			}
		};
		let setupAgentId;
		const resolveSetupTarget = async () => {
			if (nextConfig.agents?.ownership !== "explicit") inheritLegacyDefaultAgentId(baseConfig, nextConfig);
			setupAgentId ??= nextConfig.agents?.ownership === "explicit" ? tryResolveAmbientOwnerAgentId(nextConfig) : tryResolveLegacyCompatibilityAgentId(nextConfig);
			const agentIds = listAgentIds(nextConfig);
			if (!setupAgentId && agentIds.length > 1) setupAgentId = guardCancel(await select({
				message: "Which agent do you want to configure?",
				options: agentIds.map((id) => ({
					value: id,
					label: id
				}))
			}), runtime, 1);
			return resolveOnboardingAgentTarget(nextConfig, setupAgentId);
		};
		let gatewayPort = resolveGatewayPort(baseConfig);
		let didPersistConfig = false;
		let daemonSetupOutcome;
		let healthCheckOutcome;
		const channelSetup = createChannelSetupHooks({ runtime });
		const persistPendingConfig = async () => {
			if (!hasPendingConfig) return;
			nextConfig = applyWizardMetadata(nextConfig, {
				command: opts.command,
				mode: metadataMode
			});
			const committed = await writeWizardConfigFile(nextConfig, {
				mergeBase: mergeBaseConfig,
				writeOptions: configWriteOwnership
			});
			mergeBaseConfig = structuredClone(committed.nextConfig);
			await channelSetup.runPostWriteHooks(committed.path);
			nextConfig = committed.nextConfig;
			hasPendingConfig = false;
			didPersistConfig = true;
			logConfigUpdated(runtime);
		};
		const configureWorkspace = async () => {
			const target = await resolveSetupTarget();
			const workspaceInput = guardCancel(await text({
				message: "Workspace directory",
				initialValue: target.workspaceDir
			}), runtime, 1);
			const workspaceDir = resolveUserPath(normalizeOptionalString(workspaceInput ?? "") || DEFAULT_WORKSPACE);
			if (!snapshot.exists) {
				const indicators = [
					"MEMORY.md",
					"memory",
					".git"
				].map((name) => path.join(workspaceDir, name));
				if ((await Promise.all(indicators.map(async (candidate) => {
					try {
						await fs.access(candidate);
						return true;
					} catch {
						return false;
					}
				}))).some(Boolean)) note([`Existing workspace detected at ${workspaceDir}`, "Existing files are preserved. Missing templates may be created, never overwritten."].join("\n"), "Existing workspace");
			}
			nextConfig = applyOnboardingWorkspace(nextConfig, target, workspaceDir);
			await ensureOnboardingAgentWorkspace(await resolveSetupTarget(), runtime, {
				skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
				skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
			});
		};
		const configureChannelsSection = async () => {
			if (await promptChannelMode(runtime) === "configure") {
				const target = await resolveSetupTarget();
				nextConfig = await setupChannels(nextConfig, runtime, prompter, {
					workspaceDir: target.workspaceDir,
					allowDisable: true,
					allowIMessageInstall: true,
					allowSignalInstall: true,
					deferStatusUntilSelection: true,
					skipConfirm: true,
					skipStatusNote: true,
					onPostWriteHook: channelSetup.onPostWriteHook
				});
			} else nextConfig = await removeChannelConfigWizard(nextConfig, runtime);
		};
		const promptDaemonPort = async () => {
			const portInput = guardCancel(await text({
				message: "Gateway port for service install",
				initialValue: String(gatewayPort),
				validate: validateGatewayPortInput
			}), runtime, 1);
			gatewayPort = parsePort(portInput) ?? gatewayPort;
		};
		let didConfigureGateway = false;
		const sectionActions = {
			workspace: configureWorkspace,
			model: async () => {
				nextConfig = await promptAuthConfig(nextConfig, runtime, prompter, await resolveSetupTarget());
			},
			web: async () => {
				nextConfig = await promptWebToolsConfig(nextConfig, runtime, prompter);
			},
			gateway: async () => {
				const gateway = await promptGatewayConfig(nextConfig, runtime);
				nextConfig = gateway.config;
				gatewayPort = gateway.port;
				didConfigureGateway = true;
			},
			channels: configureChannelsSection,
			plugins: async () => {
				const { configurePluginConfig } = await loadSetupPluginConfigModule();
				nextConfig = await configurePluginConfig({
					config: nextConfig,
					prompter,
					workspaceDir: (await resolveSetupTarget()).workspaceDir
				});
			},
			skills: async () => {
				nextConfig = await setupSkills(nextConfig, (await resolveSetupTarget()).workspaceDir, runtime, prompter);
			},
			daemon: async () => {
				if (!didConfigureGateway) await promptDaemonPort();
				daemonSetupOutcome = await maybeInstallDaemon({
					runtime,
					port: gatewayPort
				});
			},
			health: async () => {
				healthCheckOutcome = await runGatewayHealthCheck({
					cfg: nextConfig,
					runtime,
					port: gatewayPort,
					daemonSetupOutcome
				});
			}
		};
		if (selectedSections) {
			if (selectedSections.length === 0) {
				outro("No configuration changes selected.");
				return;
			}
			for (const section of [
				"workspace",
				"model",
				"web",
				"gateway",
				"channels",
				"plugins",
				"skills"
			]) if (selectedSections.includes(section)) {
				await sectionActions[section]();
				hasPendingConfig = true;
			}
			await persistPendingConfig();
			for (const section of ["daemon", "health"]) if (selectedSections.includes(section)) await sectionActions[section]();
		} else {
			let ranSection = false;
			while (true) {
				const choice = await promptConfigureSection(runtime, ranSection);
				if (choice === "__continue") break;
				ranSection = true;
				if (choice === "daemon" || choice === "health") await persistPendingConfig();
				await sectionActions[choice]();
				if (choice !== "daemon" && choice !== "health") {
					hasPendingConfig = true;
					await persistPendingConfig();
				}
			}
			if (!ranSection) {
				if (hasPendingConfig) {
					await persistPendingConfig();
					outro("Gateway mode set to local.");
					return;
				}
				outro("No configuration changes selected.");
				return;
			}
		}
		const failedSideEffects = [...daemonSetupOutcome === "failed" ? ["daemon setup"] : [], ...healthCheckOutcome === "failed" ? ["health check"] : []];
		let completionMessage = didPersistConfig ? "Configuration updated." : "No configuration changes selected.";
		if (failedSideEffects.length > 0) completionMessage = `${didPersistConfig ? "Configuration updated" : "Configuration unchanged"}, but ${failedSideEffects.join(" and ")} failed.`;
		else if (!didPersistConfig && healthCheckOutcome) completionMessage = `Health check ${healthCheckOutcome === "succeeded" ? "completed" : "skipped"}.`;
		else if (!didPersistConfig && daemonSetupOutcome) completionMessage = `Daemon setup ${daemonSetupOutcome === "succeeded" ? "completed" : "skipped"}.`;
		if (shouldSkipGatewaySummary) {
			const remoteUrl = normalizeOptionalString(nextConfig.gateway?.remote?.url);
			if (remoteUrl) note([
				"Remote Gateway:",
				remoteUrl,
				"Docs: https://docs.openclaw.ai/gateway/remote"
			].join("\n"), "Gateway");
			outro(completionMessage);
			return;
		}
		const bind = nextConfig.gateway?.bind ?? "loopback";
		const displayLinks = await resolveAdvertisedControlUiLinks({
			bind,
			port: gatewayPort,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: nextConfig.gateway?.controlUi?.basePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const probeLinks = resolveLocalControlUiProbeLinks({
			bind,
			port: gatewayPort,
			customBindHost: nextConfig.gateway?.customBindHost,
			basePath: nextConfig.gateway?.controlUi?.basePath,
			tlsEnabled: nextConfig.gateway?.tls?.enabled === true
		});
		const probeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
			cfg: nextConfig,
			env: process.env,
			mode: "local",
			localPrecedence: "env-first"
		});
		const probe = daemonSetupOutcome === "succeeded" ? waitForGatewayReachable : probeGatewayReachable;
		let gatewayProbe = probeAuth.warning ? {
			ok: false,
			detail: "auth unavailable; probe skipped"
		} : await probe({
			...daemonSetupOutcome === "succeeded" ? resolveGatewayStartupTiming() : {},
			url: probeLinks.wsUrl,
			token: probeAuth.auth.token,
			password: probeAuth.auth.password
		});
		if (!gatewayProbe.ok && !probeAuth.warning && baseConfig.gateway?.auth?.password) {
			const oldProbeAuth = await resolveGatewayProbeAuthSafeWithSecretInputs({
				cfg: baseConfig,
				env: process.env,
				mode: "local",
				localPrecedence: "env-first"
			});
			if (!oldProbeAuth.warning && oldProbeAuth.auth.password && probeAuth.auth.password !== oldProbeAuth.auth.password) gatewayProbe = await probeGatewayReachable({
				url: probeLinks.wsUrl,
				token: probeAuth.auth.token,
				password: oldProbeAuth.auth.password
			});
		}
		const gatewayStatusLine = probeAuth.warning ? "Gateway: auth unavailable (probe skipped)" : gatewayProbe.ok ? "Gateway: reachable" : `Gateway: not detected${gatewayProbe.detail ? ` (${gatewayProbe.detail})` : ""}`;
		const windowsFirewallLines = formatWindowsGatewayFirewallGuidance({ bind });
		note([
			`Web UI: ${displayLinks.httpUrl}`,
			`Gateway WS: ${displayLinks.wsUrl}`,
			gatewayStatusLine,
			...windowsFirewallLines,
			"Docs: https://docs.openclaw.ai/web/control-ui"
		].join("\n"), "Control UI");
		outro(completionMessage);
	} catch (err) {
		if (err instanceof WizardCancelledError) {
			runtime.exit(1);
			return;
		}
		throw err;
	}
}
//#endregion
//#region src/commands/configure.commands.ts
/**
* Non-interactive config subcommands surfaced when the wizard cannot run.
* Mirrors the real `openclaw config <sub>` surface so the message only ever
* points users at commands that exist (see `src/cli/config-cli.ts`).
*/
const CONFIGURE_NON_TTY_HINT = [
	"Interactive configuration requires an interactive terminal (TTY).",
	"For non-interactive setup, use these subcommands instead:",
	`  ${formatCliCommand("openclaw config set <path> <value>")}  write a config entry`,
	`  ${formatCliCommand("openclaw config get <path>")}          read a config entry`,
	`  ${formatCliCommand("openclaw config patch")}              apply a JSON patch`,
	`  ${formatCliCommand("openclaw config validate")}           validate configuration`
].join("\n");
/**
* Refuses to launch the interactive wizard without a TTY.
*
* `interactive` lets callers/tests override the detected terminal state
* (mirrors the `params.interactive ?? process.stdin.isTTY` pattern used by
* `src/commands/gateway-readiness.ts`), so the fail-closed path is exercisable
* without mutating the global `process` streams. Both stdin and stdout must be
* TTYs: the wizard reads from stdin and renders prompts to stdout, so either
* being piped means it cannot run correctly.
*
* Returns true when the wizard may proceed.
*/
function assertInteractiveConfigureTerminal(runtime, interactive) {
	if (interactive ?? isTerminalInteractive()) return true;
	runtime.error(CONFIGURE_NON_TTY_HINT);
	runtime.exit(1);
	return false;
}
/** Parse `--section` input and run the requested configure wizard sections. */
async function configureCommandFromSectionsArg(rawSections, runtime = defaultRuntime, options) {
	const { sections, invalid } = parseConfigureWizardSections(rawSections);
	if (invalid.length > 0) {
		runtime.error(`Invalid --section: ${invalid.map((section) => section || "\"\"").join(", ")}. Expected one of: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}. Run ${formatCliCommand("openclaw configure")} without --section to use the full wizard.`);
		runtime.exit(1);
		return;
	}
	if (!assertInteractiveConfigureTerminal(runtime, options?.interactive)) return;
	await runConfigureWizard({
		command: "configure",
		...sections.length > 0 ? { sections } : {}
	}, runtime);
}
//#endregion
export { configureCommandFromSectionsArg as t };
