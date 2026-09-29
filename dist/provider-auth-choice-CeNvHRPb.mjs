import { D as withPluginCache, a as createPluginCache } from "./plugin-cache-A1nT2dqa.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir, m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { r as formatLiteralProviderPrefixedModelRef } from "./model-ref-shared-BgRrSHjn.mjs";
import { i as resolveUtilityModelSeparationError, n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-35XtW1Wg.mjs";
import "./workspace-mlzi3k1x.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as buildProviderPluginMethodChoice } from "./provider-plugin-choice-Dpa6rQvC.mjs";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { n as t } from "./i18n-BaFR7Cao.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-BNYfhiBg.mjs";
import { n as applyProviderAuthConfigPatch, t as applyDefaultModel } from "./provider-auth-choice-helpers-BggS0fwD.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CVzRzfCc.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-JPDhFb.mjs";
import { t as persistProviderAuthProfileBatch } from "./provider-auth-persistence-CqRKKZNC.mjs";
//#region src/plugins/provider-auth-choice.ts
function preparedWithoutAuthProfiles(result) {
	return {
		...result,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
}
function formatModelRefForDisplay(modelRef, provider) {
	if (!provider.preserveLiteralProviderPrefix) return modelRef;
	return formatLiteralProviderPrefixedModelRef(provider.id, modelRef);
}
function restoreConfiguredPrimaryModel(nextConfig, originalConfig) {
	const originalModel = originalConfig.agents?.defaults?.model;
	const nextAgents = nextConfig.agents;
	const nextDefaults = nextAgents?.defaults;
	if (!nextDefaults) return nextConfig;
	if (originalModel !== void 0) return {
		...nextConfig,
		agents: {
			...nextAgents,
			defaults: {
				...nextDefaults,
				model: originalModel
			}
		}
	};
	const { model: _model, ...restDefaults } = nextDefaults;
	return {
		...nextConfig,
		agents: {
			...nextAgents,
			defaults: restDefaults
		}
	};
}
function resolveConfiguredDefaultModelPrimary(cfg) {
	const model = cfg.agents?.defaults?.model;
	if (typeof model === "string") return model;
	if (model && typeof model === "object" && typeof model.primary === "string") return model.primary;
}
async function noteDefaultModelResult(params) {
	const selectedModelDisplay = params.selectedModelDisplay ?? params.selectedModel;
	if (params.preserveExistingDefaultModel === true && params.previousPrimary && params.previousPrimary !== params.selectedModel) {
		await params.prompter.note(t("wizard.model.keptExistingDefault", {
			current: params.previousPrimary,
			selected: selectedModelDisplay
		}), t("wizard.model.configuredTitle"));
		return;
	}
	await params.prompter.note(t("wizard.model.defaultSet", { model: selectedModelDisplay }), t("wizard.model.configuredTitle"));
}
async function applyDefaultModelFromAuthChoice(params) {
	const previousPrimary = resolveConfiguredDefaultModelPrimary(params.entryConfig);
	const preservesDifferentPrimary = params.preserveExistingDefaultModel === true && previousPrimary !== void 0 && previousPrimary !== params.selectedModel;
	const defaultModelBaseConfig = params.entryConfig;
	const defaultModelConfig = params.preserveExistingDefaultModel === true ? restoreConfiguredPrimaryModel(params.config, defaultModelBaseConfig) : params.config;
	let nextConfig = applyDefaultModel(defaultModelConfig, params.selectedModel, { preserveExistingPrimary: params.preserveExistingDefaultModel === true });
	if (!preservesDifferentPrimary) {
		const runtimePlugins = await import("./runtime-plugin-install-hYj4PPFV.mjs");
		const installed = await runtimePlugins.ensureModelSelectionRuntimePlugins({
			cfg: nextConfig,
			model: params.selectedModel,
			prompter: params.prompter,
			runtime: params.runtime,
			beforePersistentEffect: params.beforePersistentEffect,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
		});
		if (!installed.ok) {
			await params.prompter.note(installed.message, "Runtime unavailable");
			return null;
		}
		nextConfig = installed.cfg;
		await params.runSelectedModelHook(nextConfig);
		if (installed.codexInstalled) {
			const { offerPostInstallMigrations } = await import("./setup.post-install-migration-VrrXrVO_.mjs");
			nextConfig = (await offerPostInstallMigrations({
				config: nextConfig,
				runtime: params.runtime,
				prompter: params.prompter,
				installedPluginIds: [runtimePlugins.CODEX_RUNTIME_PLUGIN_ID]
			})).config;
		}
	}
	await noteDefaultModelResult({
		previousPrimary,
		selectedModel: params.selectedModel,
		selectedModelDisplay: params.selectedModelDisplay,
		preserveExistingDefaultModel: params.preserveExistingDefaultModel,
		prompter: params.prompter
	});
	return nextConfig;
}
async function loadPluginProviderRuntime() {
	return await import("./provider-auth-choice.runtime.js");
}
function resolveManifestAuthChoiceScope(params) {
	return resolveManifestProviderAuthChoice(params.authChoice, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
}
function withProviderPluginId(provider, pluginId) {
	return provider.pluginId === pluginId ? provider : {
		...provider,
		pluginId
	};
}
function applyProviderPluginAuthMethodResultConfig(params) {
	const { result } = params;
	let nextConfig = params.config;
	if (result.configPatch) nextConfig = applyProviderAuthConfigPatch(nextConfig, result.configPatch, { replaceDefaultModels: result.replaceDefaultModels });
	for (const profile of result.profiles) nextConfig = applyAuthProfileConfig(nextConfig, {
		profileId: profile.profileId,
		provider: profile.credential.provider,
		mode: profile.credential.type === "token" ? "token" : profile.credential.type,
		..."email" in profile.credential && profile.credential.email ? { email: profile.credential.email } : {},
		..."displayName" in profile.credential && profile.credential.displayName ? { displayName: profile.credential.displayName } : {}
	});
	return nextConfig;
}
async function runProviderPluginAuthMethod(params) {
	const prepared = await prepareProviderPluginAuthMethod(params);
	await prepared.persistAuthProfiles();
	return {
		config: prepared.config,
		...prepared.defaultModel ? { defaultModel: prepared.defaultModel } : {}
	};
}
async function prepareProviderPluginAuthMethod(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	const agentDir = params.agentDir ?? resolveAgentDir(params.config, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const result = await runProviderPluginAuthMethodUnpersisted({
		config: params.config,
		env: params.env,
		runtime: params.runtime,
		prompter: params.prompter,
		method: params.method,
		agentDir,
		workspaceDir,
		...params.signal ? { signal: params.signal } : {},
		...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
		secretInputMode: params.secretInputMode,
		allowSecretRefPrompt: params.allowSecretRefPrompt,
		opts: params.opts
	});
	if (params.emitNotes !== false && result.notes && result.notes.length > 0) await params.prompter.note(result.notes.join("\n"), "Provider notes");
	const nextConfig = applyProviderPluginAuthMethodResultConfig({
		config: params.config,
		result
	});
	const defaultModel = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : void 0;
	let profilesPersisted = false;
	const persistAuthProfiles = async (profiles = result.profiles) => {
		if (profilesPersisted) return;
		await params.beforePersistentEffect?.();
		await persistProviderAuthProfileBatch({
			profiles,
			config: nextConfig,
			agentDir,
			...params.env ? { env: params.env } : {},
			...params.env?.OPENCLAW_STATE_DIR ? { stateDir: params.env.OPENCLAW_STATE_DIR } : {}
		});
		profilesPersisted = true;
	};
	return {
		config: nextConfig,
		...defaultModel ? { defaultModel } : {},
		authProfiles: result.profiles,
		persistAuthProfiles
	};
}
/** Complete provider-dependent preparation before releasing its imported generation. */
async function prepareAuthChoiceLoadedPluginProvider(params, consume) {
	try {
		var _usingCtx$1 = _usingCtx();
		const initialCache = _usingCtx$1.a(createPluginCache());
		const installedCache = _usingCtx$1.a(createPluginCache());
		let cache = initialCache;
		const entryConfig = params.config;
		const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
		const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir();
		const { resolvePluginProviders, resolvePluginSetupProvider, resolveProviderPluginChoice, runProviderModelSelectedHook } = await loadPluginProviderRuntime();
		const prepared = await withPluginLifecycleLease({ env: params.env }, async () => withPluginCache(initialCache, async () => {
			let nextConfig = params.config;
			let pendingPluginInstalls;
			let enabledConfig = params.config;
			const manifestAuthChoice = resolveManifestAuthChoiceScope({
				authChoice: params.authChoice,
				config: nextConfig,
				workspaceDir,
				env: params.env
			});
			const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, {
				config: nextConfig,
				workspaceDir,
				env: params.env,
				includeUntrustedWorkspacePlugins: false
			});
			if ((manifestAuthChoice ?? installCatalogEntry)?.modelTarget === "utility") {
				const error = resolveUtilityModelSeparationError(params.config);
				if (error) throw new Error(error);
			}
			const resolveChoice = (providers, config) => resolveProviderPluginChoice({
				providers,
				choice: params.authChoice,
				manifestChoice: manifestAuthChoice ?? installCatalogEntry,
				resolveManifestMethodChoice: (provider, method) => provider.pluginId ? resolveManifestProviderAuthChoice(buildProviderPluginMethodChoice(provider.id, method.id), {
					config,
					workspaceDir,
					env: params.env,
					pluginId: provider.pluginId,
					includeUntrustedWorkspacePlugins: false
				}) : void 0
			});
			const choicePlugin = manifestAuthChoice ? {
				pluginId: manifestAuthChoice.pluginId,
				label: manifestAuthChoice.choiceLabel
			} : installCatalogEntry ? {
				pluginId: installCatalogEntry.pluginId,
				label: installCatalogEntry.label
			} : void 0;
			if (choicePlugin) {
				const enableResult = await enablePluginWithCapabilityConsent(nextConfig, choicePlugin.pluginId, {
					env: params.env,
					workspaceDir,
					onCapabilityConsent: createPluginCapabilityConsentPrompter(params.prompter, params.beforePersistentEffect)
				});
				if (!enableResult.enabled) {
					const safeLabel = sanitizeTerminalText(choicePlugin.label);
					await params.prompter.note(`${safeLabel} plugin is disabled (${enableResult.reason ?? "blocked"}).`, safeLabel);
					return preparedWithoutAuthProfiles({ config: nextConfig });
				}
				enabledConfig = enableResult.config;
			}
			const resolveScopedRuntimeProviders = (config, preparedInstallRecords) => {
				const request = {
					config,
					workspaceDir,
					env: params.env,
					mode: "setup",
					cache: true,
					...manifestAuthChoice ? { onlyPluginIds: [manifestAuthChoice.pluginId] } : {}
				};
				return withPluginCache(cache, () => preparedInstallRecords ? resolvePluginProviders(request, preparedInstallRecords) : resolvePluginProviders(request));
			};
			const setupProvider = manifestAuthChoice ? resolvePluginSetupProvider({
				provider: manifestAuthChoice.providerId,
				config: enabledConfig,
				workspaceDir,
				env: params.env,
				pluginIds: [manifestAuthChoice.pluginId]
			}) : void 0;
			let providers = setupProvider ? [withProviderPluginId(setupProvider, manifestAuthChoice.pluginId)] : resolveScopedRuntimeProviders(enabledConfig);
			let resolved = resolveChoice(providers, enabledConfig);
			if (!resolved && setupProvider) {
				providers = resolveScopedRuntimeProviders(enabledConfig);
				resolved = resolveChoice(providers, enabledConfig);
			}
			if (!resolved && installCatalogEntry) {
				const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-DxWQ6Pvs.mjs");
				const installResult = await ensureOnboardingPluginInstalled({
					cfg: nextConfig,
					entry: {
						pluginId: installCatalogEntry.pluginId,
						label: installCatalogEntry.label,
						install: installCatalogEntry.install,
						...installCatalogEntry.origin === "bundled" ? { trustedSourceLinkedOfficialInstall: true } : {}
					},
					prompter: params.prompter,
					runtime: params.runtime,
					workspaceDir,
					beforePersistentEffect: params.beforePersistentEffect
				});
				if (!installResult.installed) return preparedWithoutAuthProfiles({
					config: installResult.cfg,
					retrySelection: true,
					...installResult.error ? { installError: installResult.error } : {}
				});
				nextConfig = installResult.cfg;
				const installRecord = nextConfig.plugins?.installs?.[installResult.pluginId];
				if (installRecord) pendingPluginInstalls = { [installResult.pluginId]: structuredClone(installRecord) };
				cache = installedCache;
				providers = resolveScopedRuntimeProviders(nextConfig, pendingPluginInstalls);
				resolved = withPluginCache(cache, () => resolveChoice(providers, nextConfig));
			}
			if (!resolved) return nextConfig === params.config ? null : preparedWithoutAuthProfiles({
				config: nextConfig,
				retrySelection: true
			});
			if (resolved.wizard?.modelTarget === "utility") {
				const error = resolveUtilityModelSeparationError(params.config);
				if (error) throw new Error(error);
			}
			if (nextConfig === params.config && enabledConfig !== params.config) nextConfig = enabledConfig;
			return {
				nextConfig,
				resolved,
				pendingPluginInstalls
			};
		}));
		return await withPluginCache(cache, async () => {
			if (!prepared || !("resolved" in prepared)) return await consume(prepared);
			let { nextConfig } = prepared;
			const { resolved } = prepared;
			const applied = await prepareProviderPluginAuthMethod({
				config: nextConfig,
				env: params.env,
				runtime: params.runtime,
				prompter: params.prompter,
				method: resolved.method,
				agentDir: params.agentDir,
				agentId: params.agentId,
				workspaceDir,
				...params.signal ? { signal: params.signal } : {},
				...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
				beforePersistentEffect: async () => {
					if (resolved.wizard?.modelTarget === "utility") {
						const error = resolveUtilityModelSeparationError(params.config);
						if (error) throw new Error(error);
					}
					await params.beforePersistentEffect?.();
				},
				secretInputMode: params.opts?.secretInputMode,
				allowSecretRefPrompt: false,
				opts: params.opts
			});
			nextConfig = applied.config;
			let agentModelOverride;
			if (applied.defaultModel) {
				const selectedModel = applied.defaultModel;
				if (resolved.wizard?.modelTarget === "utility") return await consume({
					config: materializeUtilityModelSeparation(restoreConfiguredPrimaryModel(nextConfig, params.config), params.config).config,
					modelTarget: "utility",
					utilityModelOverride: selectedModel,
					...prepared.pendingPluginInstalls ? { pendingPluginInstalls: prepared.pendingPluginInstalls } : {},
					authProfiles: applied.authProfiles,
					persistAuthProfiles: applied.persistAuthProfiles
				}, resolved.provider);
				const selectedModelDisplay = formatModelRefForDisplay(selectedModel, resolved.provider);
				if (params.setDefaultModel) {
					const defaultModelConfig = await applyDefaultModelFromAuthChoice({
						config: nextConfig,
						entryConfig,
						selectedModel,
						selectedModelDisplay,
						preserveExistingDefaultModel: params.preserveExistingDefaultModel,
						prompter: params.prompter,
						runtime: params.runtime,
						workspaceDir,
						beforePersistentEffect: params.beforePersistentEffect,
						runSelectedModelHook: async (config) => {
							await runProviderModelSelectedHook({
								config,
								model: selectedModel,
								preparedProvider: resolved.provider,
								env: params.env,
								prompter: params.prompter,
								agentDir: params.agentDir,
								workspaceDir
							});
						}
					});
					if (!defaultModelConfig) return await consume(preparedWithoutAuthProfiles({
						config: entryConfig,
						retrySelection: true
					}));
					nextConfig = defaultModelConfig;
					return await consume({
						config: nextConfig,
						...prepared.pendingPluginInstalls ? { pendingPluginInstalls: prepared.pendingPluginInstalls } : {},
						authProfiles: applied.authProfiles,
						persistAuthProfiles: applied.persistAuthProfiles
					}, resolved.provider);
				}
				nextConfig = restoreConfiguredPrimaryModel(nextConfig, params.config);
				agentModelOverride = selectedModel;
			}
			return await consume({
				config: nextConfig,
				agentModelOverride,
				...prepared.pendingPluginInstalls ? { pendingPluginInstalls: prepared.pendingPluginInstalls } : {},
				authProfiles: applied.authProfiles,
				persistAuthProfiles: applied.persistAuthProfiles
			}, resolved.provider);
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
async function applyAuthChoiceLoadedPluginProvider(params) {
	const prepared = await prepareAuthChoiceLoadedPluginProvider(params, (result) => result);
	if (!prepared) return null;
	await prepared.persistAuthProfiles();
	return {
		config: prepared.config,
		...prepared.utilityModelOverride ? {
			utilityModelOverride: prepared.utilityModelOverride,
			modelTarget: prepared.modelTarget
		} : {},
		...prepared.agentModelOverride ? { agentModelOverride: prepared.agentModelOverride } : {},
		...prepared.retrySelection ? { retrySelection: true } : {}
	};
}
//#endregion
export { runProviderPluginAuthMethod as i, applyProviderPluginAuthMethodResultConfig as n, prepareAuthChoiceLoadedPluginProvider as r, applyAuthChoiceLoadedPluginProvider as t };
