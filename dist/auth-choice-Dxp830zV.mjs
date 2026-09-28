import { a as createLazyRuntimeSurface } from "./lazy-runtime-BPNHa36e.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { h as resolveDefaultSecretProviderAlias } from "./ref-contract-BVi3ykLT.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as resolveUtilityModelSeparationError, n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-35XtW1Wg.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { n as resolveManifestDeprecatedProviderAuthChoice, r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as buildProviderPluginMethodChoice, r as parseProviderPluginMethodChoice, t as PROVIDER_PLUGIN_CHOICE_PREFIX } from "./provider-plugin-choice-Dpa6rQvC.mjs";
import { n as resolveProviderInstallCatalogEntries, t as resolveDeprecatedProviderInstallCatalogEntry } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { o as prepareAgentModelDefaults, s as projectAgentModelDefaults } from "./onboard-agent-target-pGC2ybZv.mjs";
import { a as normalizeSecretInputModeInput } from "./provider-auth-input-Bs4B3uJA.mjs";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-CaGKkIoE.mjs";
import { t as resolveLegacyOnboardAuthChoice } from "./auth-choice-legacy-mYxKFtUF.mjs";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-B46ToLk7.mjs";
import { t as normalizeApiKeyTokenProviderAuthChoice } from "./auth-choice.apply.api-providers-BrinGSz7.mjs";
import { r as ensureModelSelectionRuntimePlugins, t as CODEX_RUNTIME_PLUGIN_ID } from "./runtime-plugin-install-B0E7RQ_S.mjs";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-DLCGsi38.mjs";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-DnTAY1TX.mjs";
import { t as rejectOnboardingOption } from "./onboard-options-DxXxOWP7.mjs";
import { t as resolveNonInteractiveApiKey } from "./api-keys-B_LeRUrn.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.ts
/**
* Applies non-interactive setup for provider plugins.
*
* This path resolves trusted plugin providers, delegates setup to their
* non-interactive method, and installs runtime plugins required by the model.
*/
async function loadPluginProviderRuntime() {
	return import("./auth-choice.plugin-providers.runtime.js");
}
const loadAuthChoicePluginProvidersRuntime = createLazyRuntimeSurface(loadPluginProviderRuntime, ({ authChoicePluginProvidersRuntime }) => authChoicePluginProvidersRuntime);
/** Applies a plugin-defined auth choice, or returns undefined when it is not plugin-backed. */
async function applyNonInteractivePluginProviderChoice(params) {
	const { agentDir, workspaceDir } = params.target;
	const reject = (message) => {
		rejectOnboardingOption(params.opts, params.runtime, message);
		return null;
	};
	let nextConfig = params.nextConfig;
	const prefixedProviderId = parseProviderPluginMethodChoice(params.authChoice)?.providerId;
	if (prefixedProviderId === "") return reject(`Auth choice ${JSON.stringify(params.authChoice)} is missing a provider id. Use "${PROVIDER_PLUGIN_CHOICE_PREFIX}<provider-id>".`);
	const preferredProviderId = prefixedProviderId || await resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
	const trustedManifestMatch = resolveManifestProviderAuthChoice(params.authChoice, {
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
	if (trustedManifestMatch) {
		if (trustedManifestMatch.modelTarget === "utility") {
			const error = resolveUtilityModelSeparationError(params.baseConfig);
			if (error) return reject(error);
		}
		const enabled = await enablePluginWithCapabilityConsent(nextConfig, trustedManifestMatch.pluginId, { workspaceDir });
		if (!enabled.enabled) return reject(enabled.reason ?? "Provider plugin could not be enabled.");
		nextConfig = enabled.config;
	}
	const { resolveOwningPluginIdsForProviderRef, resolveProviderPluginChoice, resolvePluginProviders } = await loadAuthChoicePluginProvidersRuntime();
	const owningPluginIds = preferredProviderId ? resolveOwningPluginIdsForProviderRef({
		provider: preferredProviderId,
		config: nextConfig,
		workspaceDir
	}) : void 0;
	const resolveManifestMethodChoice = (provider, method) => provider.pluginId ? resolveManifestProviderAuthChoice(buildProviderPluginMethodChoice(provider.id, method.id), {
		config: nextConfig,
		workspaceDir,
		pluginId: provider.pluginId,
		includeUntrustedWorkspacePlugins: false
	}) : void 0;
	let providerChoice = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: nextConfig,
			workspaceDir,
			onlyPluginIds: owningPluginIds,
			...preferredProviderId ? { providerRefs: [preferredProviderId] } : {},
			mode: "setup",
			includeUntrustedWorkspacePlugins: false
		}),
		choice: params.authChoice,
		manifestChoice: trustedManifestMatch,
		resolveManifestMethodChoice
	});
	if (!providerChoice) {
		if (prefixedProviderId) return reject([`Auth choice "${params.authChoice}" was not matched to a trusted provider plugin.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
		if (!trustedManifestMatch && resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: true
		})) return reject([`Auth choice "${params.authChoice}" matched a provider plugin that is not trusted or enabled for setup.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
		const normalizedChoiceId = params.authChoice.trim();
		if (!normalizedChoiceId) return;
		const installCatalog = resolveProviderInstallCatalogEntries({
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		});
		const deprecatedInstallCatalogEntry = installCatalog.find((entry) => entry.deprecatedChoiceIds?.includes(normalizedChoiceId));
		if (deprecatedInstallCatalogEntry) return reject(`${JSON.stringify(params.authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(deprecatedInstallCatalogEntry.choiceId)} instead.`);
		const installCatalogEntry = installCatalog.find((entry) => entry.choiceId === normalizedChoiceId);
		if (!installCatalogEntry) return;
		if (installCatalogEntry.modelTarget === "utility") {
			const error = resolveUtilityModelSeparationError(params.baseConfig);
			if (error) return reject(error);
		}
		const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-Di77GD0k.mjs");
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
		if (!installResult.installed) return reject(`Unable to install the ${installCatalogEntry.label} plugin for non-interactive setup.`);
		nextConfig = installResult.cfg;
		providerChoice = resolveProviderPluginChoice({
			providers: resolvePluginProviders({
				config: nextConfig,
				workspaceDir,
				onlyPluginIds: [installCatalogEntry.pluginId],
				providerRefs: [installCatalogEntry.providerId],
				mode: "setup",
				includeUntrustedWorkspacePlugins: false
			}),
			choice: params.authChoice,
			resolveManifestMethodChoice,
			manifestChoice: installCatalogEntry
		});
		if (!providerChoice) return reject(`Installed plugin "${installCatalogEntry.label}" did not expose auth choice "${params.authChoice}".`);
	}
	if (providerChoice.wizard?.modelTarget === "utility") {
		const error = resolveUtilityModelSeparationError(params.baseConfig);
		if (error) return reject(error);
	}
	const enableResult = await enablePluginWithCapabilityConsent(nextConfig, providerChoice.provider.pluginId ?? providerChoice.provider.id, { workspaceDir });
	if (!enableResult.enabled) return reject(`${providerChoice.provider.label} plugin is disabled (${enableResult.reason ?? "blocked"}).`);
	const method = providerChoice.method;
	const modelTarget = providerChoice.wizard?.modelTarget;
	if (!method.runNonInteractive) return reject([`Auth choice "${params.authChoice}" requires interactive mode.`, `The ${providerChoice.provider.label} provider plugin does not implement non-interactive setup.`].join("\n"));
	const agentScopedModels = enableResult.config.agents?.ownership === "explicit";
	const providerConfig = agentScopedModels ? prepareAgentModelDefaults(enableResult.config, params.target) : enableResult.config;
	const projectProviderResult = (updated) => {
		const projected = agentScopedModels ? projectAgentModelDefaults(enableResult.config, params.target, updated) : updated;
		return modelTarget === "utility" ? materializeUtilityModelSeparation(projected, params.baseConfig).config : projected;
	};
	const runNonInteractive = method.runNonInteractive;
	const context = {
		authChoice: params.authChoice,
		config: providerConfig,
		baseConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		agentDir,
		workspaceDir,
		resolveApiKey: params.resolveApiKey,
		toApiKeyCredential: params.toApiKeyCredential
	};
	const { isSetupCredentialReplacement, saveSetupCredential, selectSetupCredential } = await import("./setup-inference-credentials-BlvO2N_Z.mjs");
	let result;
	if (isSetupCredentialReplacement({
		provider: providerChoice.provider.id,
		baseConfig: params.baseConfig,
		agentDir
	})) {
		const [{ withAuthProfileStoreAgentDir, clearRuntimeAuthProfileStoreSnapshot }, { loadAuthProfileStoreWithoutExternalProfiles, saveAuthProfileStore }, { loadPersistedAuthProfileStore }, { closeAuthProfileReadPool }, { closeOpenClawAgentDatabases }, { splitTrailingAuthProfile }, { resolveSetupModel }, { prepareCustomSetupCredentials }] = await Promise.all([
			import("./store-Dpkt_YU9.mjs"),
			import("./store-runtime-n-zOl_kw.mjs"),
			import("./persisted-C9O4bIP7.mjs"),
			import("./sqlite-Dz_jQFeM.mjs"),
			import("./openclaw-agent-db-BrZi20Hq.mjs"),
			import("./model-ref-profile-DxMyAICZ.mjs"),
			import("./setup-inference-core-Dwrn8XcM.mjs"),
			import("./setup-inference-custom-ChBwJ3g8.mjs")
		]);
		const realStore = loadAuthProfileStoreWithoutExternalProfiles(agentDir);
		const seeded = {
			version: realStore.version,
			...realStore.order ? { order: structuredClone(realStore.order) } : {},
			profiles: Object.fromEntries(Object.entries(realStore.profiles).filter(([, credential]) => credential.type !== "oauth" && !credential.setup?.replacement))
		};
		const stagingRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-credential-"));
		const stagingAgentDir = path.join(stagingRoot, "agents", "setup", "agent");
		let savedProfileId;
		try {
			await fs.mkdir(stagingAgentDir, { recursive: true });
			result = await withAuthProfileStoreAgentDir(stagingAgentDir, stagingRoot, async () => {
				saveAuthProfileStore(seeded, stagingAgentDir, { syncExternalCli: false });
				return await runNonInteractive({
					...context,
					agentDir: stagingAgentDir,
					runtime: {
						...params.runtime,
						exit: (code) => {
							throw new Error(`Provider setup exited with code ${code}; see its error above.`);
						}
					}
				});
			});
			if (!result) return null;
			const prepared = prepareCustomSetupCredentials({
				config: structuredClone(result),
				providerId: providerChoice.provider.id
			});
			const profiles = Object.entries(loadPersistedAuthProfileStore(stagingAgentDir)?.profiles ?? {}).filter(([profileId, credential]) => !isDeepStrictEqual(credential, seeded.profiles[profileId])).map(([profileId, credential]) => ({
				profileId,
				credential
			}));
			if (!isDeepStrictEqual(result.models?.providers?.[providerChoice.provider.id]?.apiKey, providerConfig.models?.providers?.[providerChoice.provider.id]?.apiKey)) profiles.push(...prepared.profiles);
			if (profiles.length > 0) {
				const selected = modelTarget === "utility" ? result.agents?.defaults?.utilityModel?.trim() : resolveAgentModelPrimaryValue(result.agents?.defaults?.model);
				const modelRef = resolveSetupModel({
					label: providerChoice.provider.label,
					providerId: providerChoice.provider.id,
					defaultModel: selected && selectSetupCredential(profiles, selected, prepared.config) ? splitTrailingAuthProfile(selected).model : method.starterModel
				});
				if (typeof modelRef !== "string") throw new Error(modelRef.error);
				const profile = selectSetupCredential(profiles, modelRef, prepared.config);
				if (!profile) throw new Error("Provider setup did not save a replacement credential. Your connection is unchanged.");
				savedProfileId = (await saveSetupCredential({
					profile,
					config: projectProviderResult(prepared.config),
					baseConfig: params.baseConfig,
					agentDir,
					modelRef,
					authChoice: trustedManifestMatch?.choiceId ?? providerChoice.wizard?.choiceId,
					pluginId: providerChoice.provider.pluginId
				})).profile.profileId;
			}
		} finally {
			clearRuntimeAuthProfileStoreSnapshot(stagingAgentDir);
			closeAuthProfileReadPool({
				kind: "root",
				rootPath: stagingRoot
			});
			closeOpenClawAgentDatabases(stagingRoot);
			await fs.rm(stagingRoot, {
				recursive: true,
				force: true
			});
		}
		if (savedProfileId) return reject(`Replacement credential saved but inactive. Your connection is unchanged. Test and activate it with:\n${formatCliCommand(`openclaw models auth activate ${quoteCliArg(savedProfileId)} --agent ${quoteCliArg(params.target.agentId)}`)}`);
	} else result = await runNonInteractive(context);
	if (!result) return result;
	const selectedModel = modelTarget === "utility" ? result.agents?.defaults?.utilityModel?.trim() : resolveAgentModelPrimaryValue(result.agents?.defaults?.model);
	if (modelTarget === "utility") {
		if (!selectedModel) return reject("This provider did not return a utility model for setup.");
		const { model: _selectedPrimary, ...defaults } = result.agents?.defaults ?? {};
		const primary = providerConfig.agents?.defaults?.model;
		result = {
			...result,
			agents: {
				...result.agents,
				defaults: {
					...defaults,
					...primary !== void 0 ? { model: primary } : {}
				}
			}
		};
	}
	if (!selectedModel) return projectProviderResult(result);
	const runtimes = await ensureModelSelectionRuntimePlugins({
		cfg: result,
		model: selectedModel,
		prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => message),
		runtime: params.runtime,
		workspaceDir,
		output: "silent"
	});
	if (!runtimes.ok) return reject(runtimes.message);
	if (runtimes.codexInstalled) {
		const { offerPostInstallMigrations } = await import("./setup.post-install-migration-DWD0m49r.mjs");
		await offerPostInstallMigrations({
			config: runtimes.cfg,
			runtime: params.runtime,
			installedPluginIds: [CODEX_RUNTIME_PLUGIN_ID],
			nonInteractive: true
		});
	}
	return projectProviderResult(runtimes.cfg);
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
		workspaceDir: params.target.workspaceDir,
		env: process.env
	});
	const nextConfig = params.nextConfig;
	const requestedSecretInputMode = normalizeSecretInputModeInput(opts.secretInputMode);
	if (opts.secretInputMode && !requestedSecretInputMode) {
		rejectOnboardingOption(opts, runtime, `Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		return null;
	}
	const toStoredSecretInput = (paramsLocal) => {
		const { resolved } = paramsLocal;
		if (requestedSecretInputMode !== "ref") return resolved.key;
		if (resolved.source !== "env" || !resolved.envVarName) {
			const envHint = paramsLocal.envVarName ? `Set ${paramsLocal.envVarName} in env and retry` : "Set the provider API key env var and retry";
			rejectOnboardingOption(opts, runtime, [`--secret-input-mode ref requires an explicit environment variable for provider "${paramsLocal.provider}".`, `${envHint}, or use --secret-input-mode plaintext.`].join("\n"));
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
		agentDir: params.target.agentDir,
		workspaceDir: params.target.workspaceDir,
		secretInputMode: requestedSecretInputMode,
		json: opts.json
	});
	const toApiKeyCredential = (paramsLocal) => {
		const stored = toStoredSecretInput({
			resolved: paramsLocal.resolved,
			provider: paramsLocal.provider
		});
		if (!stored) return null;
		return {
			type: "api_key",
			provider: paramsLocal.provider,
			...typeof stored === "string" ? { key: stored } : { keyRef: stored },
			...paramsLocal.email ? { email: paramsLocal.email } : {},
			...paramsLocal.metadata ? { metadata: paramsLocal.metadata } : {}
		};
	};
	const legacyChoice = resolveLegacyOnboardAuthChoice(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	});
	if (legacyChoice.deprecated) {
		runtime.log(legacyChoice.deprecated.message);
		authChoice = legacyChoice.authChoice;
	}
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	});
	const deprecatedInstallChoice = deprecatedChoice ? void 0 : resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	});
	const replacementChoiceId = deprecatedChoice?.choiceId ?? deprecatedInstallChoice?.choiceId;
	if (replacementChoiceId) {
		rejectOnboardingOption(opts, runtime, `${JSON.stringify(authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(replacementChoiceId)} instead.`);
		return null;
	}
	const validAuthChoices = formatAuthChoiceChoicesForCli({
		includeSkip: true,
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	}).split("|");
	if (!validAuthChoices.includes(authChoice) && !authChoice.startsWith("provider-plugin:")) {
		rejectOnboardingOption(opts, runtime, `Unknown --auth-choice ${JSON.stringify(authChoice)}. Valid choices: ${validAuthChoices.join(", ")}.`);
		return null;
	}
	const pluginProviderChoice = await applyNonInteractivePluginProviderChoice({
		nextConfig,
		authChoice,
		opts,
		runtime,
		baseConfig,
		target: params.target,
		resolveApiKey: (input) => resolveApiKey({
			...input,
			cfg: nextConfig,
			runtime
		}),
		toApiKeyCredential
	});
	if (pluginProviderChoice !== void 0) return pluginProviderChoice;
	if (authChoice === "setup-token" || authChoice === "token") {
		rejectOnboardingOption(opts, runtime, [`Auth choice "${params.authChoice}" was not matched to a provider setup flow.`, "For Anthropic legacy token auth, use \"--auth-choice setup-token --token-provider anthropic --token <token>\" or pass \"--auth-choice token --token-provider anthropic\"."].join("\n"));
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
		const resolvedProviderId = resolveCustomProviderId({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			providerId: customAuth.providerId
		});
		const resolvedCustomApiKey = await resolveApiKey({
			provider: resolvedProviderId.providerId,
			cfg: nextConfig,
			flagValue: customAuth.apiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			envVarName: "CUSTOM_API_KEY",
			runtime,
			required: false
		});
		let customApiKeyInput;
		if (resolvedCustomApiKey && (requestedSecretInputMode !== "ref" || resolvedCustomApiKey.source !== "profile")) {
			const stored = toStoredSecretInput({
				resolved: resolvedCustomApiKey,
				provider: resolvedProviderId.providerId,
				envVarName: "CUSTOM_API_KEY"
			});
			if (!stored) return null;
			customApiKeyInput = stored;
		}
		const result = applyCustomApiConfig({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			modelId: customAuth.modelId,
			compatibility: customAuth.compatibility,
			apiKey: customApiKeyInput,
			providerId: customAuth.providerId,
			supportsImageInput: customAuth.supportsImageInput,
			target: params.target
		});
		if (result.providerIdRenamedFrom && result.providerId) runtime.log(`Custom provider ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`);
		if (customApiKeyInput !== void 0 && resolvedCustomApiKey?.source !== "profile") {
			const { isSetupCredentialReplacement, saveSetupCredential } = await import("./setup-inference-credentials-BlvO2N_Z.mjs");
			if (isSetupCredentialReplacement({
				provider: result.providerId,
				baseConfig,
				agentDir: params.target.agentDir
			})) {
				const { prepareCustomSetupCredentials } = await import("./setup-inference-custom-ChBwJ3g8.mjs");
				const prepared = prepareCustomSetupCredentials(result);
				const saved = await saveSetupCredential({
					profile: prepared.profiles[0],
					config: prepared.config,
					baseConfig,
					agentDir: params.target.agentDir,
					modelRef: `${result.providerId}/${result.modelId}`
				});
				rejectOnboardingOption(opts, runtime, `Replacement credential saved but inactive. Your connection is unchanged. Test and activate it with:\n${formatCliCommand(`openclaw models auth activate ${quoteCliArg(saved.profile.profileId)} --agent ${quoteCliArg(params.target.agentId)}`)}`);
				return null;
			}
		}
		return result.config;
	} catch (err) {
		const message = err instanceof CustomApiError && (err.code === "missing_required" || err.code === "invalid_compatibility") ? err.message : `Invalid custom provider config: ${err instanceof CustomApiError ? err.message : formatErrorMessage(err)}`;
		rejectOnboardingOption(opts, runtime, message);
		return null;
	}
	if (authChoice === "chutes" || authChoice === "minimax-global-oauth" || authChoice === "minimax-cn-oauth") {
		rejectOnboardingOption(opts, runtime, "OAuth requires interactive mode.");
		return null;
	}
	return nextConfig;
}
//#endregion
export { applyNonInteractiveAuthChoice };
