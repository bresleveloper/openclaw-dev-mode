import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BWYV5Pqz.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-BHKiDwaq.js";
import "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DhGzPxbH.js";
import { n as enablePluginInConfig } from "./enable-BS06nvHE.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import "./auth-profiles-DWHvUh-t.js";
import { n as resolveApiKeyForProfile } from "./oauth-De-NOeYf.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-JuG5HlWn.js";
import { i as resolveAuthProfileOrder } from "./order-DO7M8GzY.js";
import { t as resolveEnvApiKey } from "./model-auth-env-W5zTaRQi.js";
import "./model-auth-Bvz14MtI.js";
import "./workspace-DP5mE--D.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-D-7_JraP.js";
import { r as resolveManifestProviderAuthChoice, t as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-D_D_9_cf.js";
import { a as normalizeSecretInputModeInput } from "./provider-auth-input-Bxx5NKk7.js";
import { r as resolveProviderInstallCatalogEntry, t as resolveDeprecatedProviderInstallCatalogEntry } from "./provider-install-catalog-pG-7GzQG.js";
import { i as resolveDeprecatedAuthChoiceReplacement, n as isDeprecatedAuthChoice, t as formatDeprecatedNonInteractiveAuthChoiceError } from "./auth-choice-legacy-CFqQBG_e.js";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-sw9yuMtG.js";
import { t as normalizeApiKeyTokenProviderAuthChoice } from "./auth-choice.apply.api-providers-BRbbBj7A.js";
import { n as ensureCodexRuntimePluginForModelSelection, t as CODEX_RUNTIME_PLUGIN_ID } from "./codex-runtime-plugin-install-jzhiJ8xH.js";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-Dw4tBzkk.js";
import { n as ensureCopilotRuntimePluginForModelSelection } from "./copilot-runtime-plugin-install-BuaB6RTV.js";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-DLCGsi38.js";
//#region src/commands/onboard-non-interactive/api-keys.ts
/**
* API-key resolution for non-interactive onboarding.
*
* The resolver keeps flag, environment, and auth-profile precedence consistent
* across provider setup paths while preserving secret-ref mode constraints.
*/
function parseEnvVarNameFromSourceLabel(source) {
	if (!source) return;
	return /^(?:shell env: |env: )([A-Z][A-Z0-9_]*)$/.exec(source.trim())?.[1];
}
async function resolveApiKeyFromProfiles(params) {
	const store = ensureAuthProfileStore(params.agentDir);
	const order = resolveAuthProfileOrder({
		cfg: params.cfg,
		store,
		provider: params.provider
	});
	for (const profileId of order) {
		if (store.profiles[profileId]?.type !== "api_key") continue;
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store,
			profileId,
			agentDir: params.agentDir
		});
		if (resolved?.apiKey) return resolved.apiKey;
	}
	return null;
}
/** Resolves an API key for non-interactive setup without prompting the user. */
async function resolveNonInteractiveApiKey(params) {
	const flagKey = normalizeOptionalSecretInput(params.flagValue);
	const explicitEnvVar = params.envVarName?.trim() || params.envVar.trim();
	const resolveExplicitEnvKey = () => normalizeOptionalSecretInput(process.env[explicitEnvVar]);
	const resolveEnvKey = () => {
		const envResolved = resolveEnvApiKey(params.provider);
		const explicitEnvKey = explicitEnvVar ? normalizeOptionalSecretInput(process.env[explicitEnvVar]) : void 0;
		return {
			key: envResolved?.apiKey ?? explicitEnvKey,
			envVarName: parseEnvVarNameFromSourceLabel(envResolved?.source) ?? explicitEnvVar
		};
	};
	const useSecretRefMode = params.secretInputMode === "ref";
	if (useSecretRefMode && flagKey) {
		const explicitEnvKey = resolveExplicitEnvKey();
		if (explicitEnvKey) return {
			key: explicitEnvKey,
			source: "env",
			envVarName: explicitEnvVar
		};
		params.runtime.error([`${params.flagName} cannot be used with --secret-input-mode ref unless ${params.envVar} is set in env.`, `Set ${params.envVar} in env and omit ${params.flagName}, or use --secret-input-mode plaintext.`].join("\n"));
		params.runtime.exit(1);
		return null;
	}
	if (useSecretRefMode) {
		const resolvedEnv = resolveEnvKey();
		if (resolvedEnv.key) {
			if (!resolvedEnv.envVarName) {
				params.runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${params.provider}".`, `Set ${params.envVar} in env and retry, or use --secret-input-mode plaintext.`].join("\n"));
				params.runtime.exit(1);
				return null;
			}
			return {
				key: resolvedEnv.key,
				source: "env",
				envVarName: resolvedEnv.envVarName
			};
		}
	}
	if (flagKey) return {
		key: flagKey,
		source: "flag"
	};
	const resolvedEnv = resolveEnvKey();
	if (resolvedEnv.key) return {
		key: resolvedEnv.key,
		source: "env",
		envVarName: resolvedEnv.envVarName
	};
	if (params.allowProfile ?? true) {
		const profileKey = await resolveApiKeyFromProfiles({
			provider: params.provider,
			cfg: params.cfg,
			agentDir: params.agentDir
		});
		if (profileKey) return {
			key: profileKey,
			source: "profile"
		};
	}
	if (params.required === false) return null;
	const profileHint = params.allowProfile === false ? "" : `, or existing ${params.provider} API-key profile`;
	params.runtime.error(`Missing ${params.flagName} (or ${params.envVar} in env${profileHint}). Export ${params.envVar}, pass ${params.flagName}, or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
	params.runtime.exit(1);
	return null;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.ts
/**
* Applies non-interactive setup for provider plugins.
*
* This path resolves trusted plugin providers, delegates setup to their
* non-interactive method, and installs runtime plugins required by the model.
*/
const PROVIDER_PLUGIN_CHOICE_PREFIX = "provider-plugin:";
async function loadPluginProviderRuntime() {
	return import("./auth-choice.plugin-providers.runtime.js");
}
const loadAuthChoicePluginProvidersRuntime = createLazyRuntimeSurface(loadPluginProviderRuntime, ({ authChoicePluginProvidersRuntime }) => authChoicePluginProvidersRuntime);
/** Applies a plugin-defined auth choice, or returns undefined when it is not plugin-backed. */
async function applyNonInteractivePluginProviderChoice(params) {
	const agentId = resolveDefaultAgentId(params.nextConfig);
	const agentDir = resolveAgentDir(params.nextConfig, agentId);
	const workspaceDir = resolveAgentWorkspaceDir(params.nextConfig, agentId) ?? resolveDefaultAgentWorkspaceDir();
	let nextConfig = params.nextConfig;
	const prefixedProviderId = params.authChoice.startsWith(PROVIDER_PLUGIN_CHOICE_PREFIX) ? params.authChoice.slice(16).split(":", 1)[0]?.trim() : void 0;
	const preferredProviderId = prefixedProviderId || await resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
	const { resolveOwningPluginIdsForProviderRef, resolveProviderPluginChoice, resolvePluginProviders } = await loadAuthChoicePluginProvidersRuntime();
	const owningPluginIds = preferredProviderId ? resolveOwningPluginIdsForProviderRef({
		provider: preferredProviderId,
		config: nextConfig,
		workspaceDir
	}) : void 0;
	let providerChoice = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: nextConfig,
			workspaceDir,
			onlyPluginIds: owningPluginIds,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false
		}),
		choice: params.authChoice
	});
	if (!providerChoice) {
		if (prefixedProviderId) {
			params.runtime.error([`Auth choice "${params.authChoice}" was not matched to a trusted provider plugin.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
			params.runtime.exit(1);
			return null;
		}
		if (!resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		}) && resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: true
		})) {
			params.runtime.error([`Auth choice "${params.authChoice}" matched a provider plugin that is not trusted or enabled for setup.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
			params.runtime.exit(1);
			return null;
		}
		const installCatalogParams = {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		};
		const deprecatedInstallCatalogEntry = resolveDeprecatedProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (deprecatedInstallCatalogEntry) {
			params.runtime.error(`${JSON.stringify(params.authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(deprecatedInstallCatalogEntry.choiceId)} instead.`);
			params.runtime.exit(1);
			return null;
		}
		const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (!installCatalogEntry) return;
		const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-DKrUsz7s.js");
		const installResult = await ensureOnboardingPluginInstalled({
			cfg: nextConfig,
			entry: {
				pluginId: installCatalogEntry.pluginId,
				label: installCatalogEntry.label,
				install: installCatalogEntry.install,
				...installCatalogEntry.origin === "bundled" ? { trustedSourceLinkedOfficialInstall: true } : {}
			},
			prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive setup cannot prompt for plugin install: ${message}`),
			runtime: params.runtime,
			workspaceDir,
			promptInstall: false
		});
		if (!installResult.installed) {
			params.runtime.error(`Unable to install the ${installCatalogEntry.label} plugin for non-interactive setup.`);
			params.runtime.exit(1);
			return null;
		}
		nextConfig = installResult.cfg;
		providerChoice = resolveProviderPluginChoice({
			providers: resolvePluginProviders({
				config: nextConfig,
				workspaceDir,
				onlyPluginIds: [installCatalogEntry.pluginId],
				mode: "setup",
				includeUntrustedWorkspacePlugins: false
			}),
			choice: params.authChoice
		});
		if (!providerChoice) {
			params.runtime.error(`Installed plugin "${installCatalogEntry.label}" did not expose auth choice "${params.authChoice}".`);
			params.runtime.exit(1);
			return null;
		}
	}
	const enableResult = enablePluginInConfig(nextConfig, providerChoice.provider.pluginId ?? providerChoice.provider.id);
	if (!enableResult.enabled) {
		params.runtime.error(`${providerChoice.provider.label} plugin is disabled (${enableResult.reason ?? "blocked"}).`);
		params.runtime.exit(1);
		return null;
	}
	const method = providerChoice.method;
	if (!method.runNonInteractive) {
		params.runtime.error([`Auth choice "${params.authChoice}" requires interactive mode.`, `The ${providerChoice.provider.label} provider plugin does not implement non-interactive setup.`].join("\n"));
		params.runtime.exit(1);
		return null;
	}
	const result = await method.runNonInteractive({
		authChoice: params.authChoice,
		config: enableResult.config,
		baseConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		agentDir,
		workspaceDir,
		resolveApiKey: params.resolveApiKey,
		toApiKeyCredential: params.toApiKeyCredential
	});
	if (!result) return result;
	const selectedModel = resolveAgentModelPrimaryValue(result.agents?.defaults?.model);
	if (!selectedModel) return result;
	const nonInteractivePrompter = createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive setup cannot prompt for plugin install: ${message}`);
	const codexInstall = await ensureCodexRuntimePluginForModelSelection({
		cfg: result,
		model: selectedModel,
		prompter: nonInteractivePrompter,
		runtime: params.runtime,
		workspaceDir
	});
	if (codexInstall.installed) {
		const { offerPostInstallMigrations } = await import("./setup.post-install-migration-C26pQRH6.js");
		await offerPostInstallMigrations({
			config: codexInstall.cfg,
			runtime: params.runtime,
			installedPluginIds: [CODEX_RUNTIME_PLUGIN_ID],
			nonInteractive: true
		});
	}
	return (await ensureCopilotRuntimePluginForModelSelection({
		cfg: codexInstall.cfg,
		model: selectedModel,
		prompter: nonInteractivePrompter,
		runtime: params.runtime,
		workspaceDir
	})).cfg;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.ts
/** Applies a local non-interactive auth choice to the pending OpenClaw config. */
async function applyNonInteractiveAuthChoice(params) {
	const { opts, runtime, baseConfig } = params;
	let authChoice = normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: opts.tokenProvider,
		config: params.nextConfig,
		env: process.env
	});
	const nextConfig = params.nextConfig;
	const requestedSecretInputMode = normalizeSecretInputModeInput(opts.secretInputMode);
	if (opts.secretInputMode && !requestedSecretInputMode) {
		runtime.error(`Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		runtime.exit(1);
		return null;
	}
	const toStoredSecretInput = (resolved) => {
		if (requestedSecretInputMode !== "ref") return resolved.key;
		if (resolved.source !== "env") return resolved.key;
		if (!resolved.envVarName) {
			runtime.error([`Unable to determine which environment variable to store as a ref for provider "${authChoice}".`, "Set an explicit provider env var and retry, or use --secret-input-mode plaintext."].join("\n"));
			runtime.exit(1);
			return null;
		}
		return {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
			id: resolved.envVarName
		};
	};
	const resolveApiKey = (input) => resolveNonInteractiveApiKey({
		...input,
		secretInputMode: requestedSecretInputMode
	});
	const toApiKeyCredential = (paramsLocal) => {
		if (requestedSecretInputMode === "ref" && paramsLocal.resolved.source === "env") {
			if (!paramsLocal.resolved.envVarName) {
				runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${paramsLocal.provider}".`, "Set the provider API key env var and retry, or use --secret-input-mode plaintext."].join("\n"));
				runtime.exit(1);
				return null;
			}
			return {
				type: "api_key",
				provider: paramsLocal.provider,
				keyRef: {
					source: "env",
					provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
					id: paramsLocal.resolved.envVarName
				},
				...paramsLocal.email ? { email: paramsLocal.email } : {},
				...paramsLocal.metadata ? { metadata: paramsLocal.metadata } : {}
			};
		}
		return {
			type: "api_key",
			provider: paramsLocal.provider,
			key: paramsLocal.resolved.key,
			...paramsLocal.email ? { email: paramsLocal.email } : {},
			...paramsLocal.metadata ? { metadata: paramsLocal.metadata } : {}
		};
	};
	if (isDeprecatedAuthChoice(authChoice, {
		config: nextConfig,
		env: process.env
	})) {
		const replacement = resolveDeprecatedAuthChoiceReplacement(authChoice, {
			config: nextConfig,
			env: process.env
		});
		if (replacement) {
			runtime.log(replacement.message);
			authChoice = replacement.normalized;
		} else {
			runtime.error(formatDeprecatedNonInteractiveAuthChoiceError(authChoice, {
				config: nextConfig,
				env: process.env
			}));
			runtime.exit(1);
			return null;
		}
	}
	const pluginProviderChoice = await applyNonInteractivePluginProviderChoice({
		nextConfig,
		authChoice,
		opts,
		runtime,
		baseConfig,
		resolveApiKey: (input) => resolveApiKey({
			...input,
			cfg: baseConfig,
			runtime
		}),
		toApiKeyCredential
	});
	if (pluginProviderChoice !== void 0) return pluginProviderChoice;
	if (authChoice === "setup-token" || authChoice === "token") {
		runtime.error([`Auth choice "${params.authChoice}" was not matched to a provider setup flow.`, "For Anthropic legacy token auth, use \"--auth-choice setup-token --token-provider anthropic --token <token>\" or pass \"--auth-choice token --token-provider anthropic\"."].join("\n"));
		runtime.exit(1);
		return null;
	}
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: nextConfig,
		env: process.env
	});
	if (deprecatedChoice) {
		runtime.error(`${JSON.stringify(authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(deprecatedChoice.choiceId)} instead.`);
		runtime.exit(1);
		return null;
	}
	if (authChoice === "custom-api-key") try {
		const customAuth = parseNonInteractiveCustomApiFlags({
			baseUrl: opts.customBaseUrl,
			modelId: opts.customModelId,
			compatibility: opts.customCompatibility,
			apiKey: opts.customApiKey,
			providerId: opts.customProviderId,
			supportsImageInput: opts.customImageInput
		});
		const resolvedCustomApiKey = await resolveApiKey({
			provider: resolveCustomProviderId({
				config: nextConfig,
				baseUrl: customAuth.baseUrl,
				providerId: customAuth.providerId
			}).providerId,
			cfg: baseConfig,
			flagValue: customAuth.apiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			envVarName: "CUSTOM_API_KEY",
			runtime,
			required: false
		});
		let customApiKeyInput;
		if (resolvedCustomApiKey) if (requestedSecretInputMode === "ref") {
			const stored = toStoredSecretInput(resolvedCustomApiKey);
			if (!stored) return null;
			customApiKeyInput = stored;
		} else customApiKeyInput = resolvedCustomApiKey.key;
		const result = applyCustomApiConfig({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			modelId: customAuth.modelId,
			compatibility: customAuth.compatibility,
			apiKey: customApiKeyInput,
			providerId: customAuth.providerId,
			supportsImageInput: customAuth.supportsImageInput
		});
		if (result.providerIdRenamedFrom && result.providerId) runtime.log(`Custom provider ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`);
		return result.config;
	} catch (err) {
		if (err instanceof CustomApiError) {
			switch (err.code) {
				case "missing_required":
				case "invalid_compatibility":
					runtime.error(err.message);
					break;
				default:
					runtime.error(`Invalid custom provider config: ${err.message}`);
					break;
			}
			runtime.exit(1);
			return null;
		}
		const reason = formatErrorMessage(err);
		runtime.error(`Invalid custom provider config: ${reason}`);
		runtime.exit(1);
		return null;
	}
	if (authChoice === "oauth" || authChoice === "chutes" || authChoice === "minimax-global-oauth" || authChoice === "minimax-cn-oauth") {
		runtime.error(authChoice === "oauth" ? "Auth choice \"oauth\" is no longer supported directly. Use \"--auth-choice setup-token --token-provider anthropic\" for Anthropic legacy token auth, or a provider-specific OAuth choice." : "OAuth requires interactive mode.");
		runtime.exit(1);
		return null;
	}
	return nextConfig;
}
//#endregion
export { applyNonInteractiveAuthChoice };
