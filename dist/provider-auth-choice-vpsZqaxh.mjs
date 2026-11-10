import { k as withPluginCache, s as createPluginCache } from "./plugin-cache-BbahpD-b.mjs";
import { r as formatLiteralProviderPrefixedModelRef } from "./model-ref-shared-BRJ3VRZV.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { _ as resolveDefaultAgentId, a as resolveAgentDir, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-CeM8o97s.mjs";
import { i as resolveUtilityModelSeparationError, n as materializeUtilityModelSeparation } from "./utility-model-separation-migration-CmYYNsY8.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { r as enablePluginWithCapabilityConsent } from "./enable-yRbPluWX.mjs";
import { a as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DMHFOAei.mjs";
import { g as loadAuthProfileStoreWithoutExternalProfilesAsync } from "./store-runtime-CwqGD12G.mjs";
import { r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-D2ZKE-Sc.mjs";
import { n as buildProviderPluginMethodChoice } from "./provider-plugin-choice-BugOkW_k.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-a08sP-.mjs";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-BJ9XbGmI.mjs";
import { r as t } from "./i18n-CwUnB3fI.mjs";
import { t as applyPrimaryModel } from "./provider-model-primary-4ptnbByb.mjs";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-P722AY9p.mjs";
import { i as restoreAgentsDefaultsModel, t as applyProviderAuthConfigPatch } from "./provider-auth-choice-helpers-HmDkCc1z.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-olPFvVdo.mjs";
import { t as persistProviderAuthProfileBatch } from "./provider-auth-persistence-3GlMaVWE.mjs";
//#region src/plugins/provider-auth-choice.ts
function preparedWithoutAuthProfiles(result) {
	return {
		...result,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
}
function restoreConfiguredPrimaryModel(nextConfig, originalConfig) {
	return nextConfig.agents?.defaults ? restoreAgentsDefaultsModel(nextConfig, originalConfig.agents?.defaults?.model) : nextConfig;
}
function resolveConfiguredDefaultModelPrimary(cfg) {
	const model = cfg.agents?.defaults?.model;
	if (typeof model === "string") return model;
	if (model && typeof model === "object" && typeof model.primary === "string") return model.primary;
}
function withProviderPluginId(provider, pluginId) {
	return provider.pluginId === pluginId ? provider : {
		...provider,
		pluginId
	};
}
function assertUtilityModelSeparation(config, modelTarget) {
	if (modelTarget === "utility") {
		const error = resolveUtilityModelSeparationError(config);
		if (error) throw new Error(error);
	}
}
function applyProviderPluginAuthMethodResultConfig(params) {
	const { result } = params;
	let nextConfig = params.config;
	if (result.configPatch) nextConfig = applyProviderAuthConfigPatch(nextConfig, result.configPatch, { replaceDefaultModels: result.replaceDefaultModels });
	for (const profile of result.profiles) nextConfig = applyAuthProfileConfig(nextConfig, {
		profileId: profile.profileId,
		provider: profile.credential.provider,
		mode: profile.credential.type,
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
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId);
	const store = await loadAuthProfileStoreWithoutExternalProfilesAsync(agentDir);
	const existingProfiles = Object.entries(store.profiles).filter(([, credential]) => credential.provider === params.providerId).map(([profileId, credential]) => ({
		profileId,
		credential
	}));
	const result = await runProviderPluginAuthMethodUnpersisted({
		config: params.config,
		existingProfiles,
		env: params.env,
		runtime: params.runtime,
		prompter: params.prompter,
		method: params.method,
		agentDir,
		workspaceDir,
		...params.signal ? { signal: params.signal } : {},
		assertCurrent: params.assertCurrent,
		...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
		secretInputMode: params.secretInputMode,
		allowSecretRefPrompt: params.allowSecretRefPrompt,
		opts: params.opts
	});
	if (result.notes && result.notes.length > 0) await params.prompter.note(result.notes.join("\n"), "Provider notes");
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
		const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId);
		const { resolvePluginProviders, resolvePluginSetupProvider, resolveProviderPluginChoice, runProviderModelSelectedHook } = await import("./provider-auth-choice.runtime.js");
		const leaseOptions = {
			env: params.env,
			signal: params.signal,
			assertCurrent: params.assertCurrent
		};
		const prepared = await withPluginLifecycleLease(leaseOptions, async () => withPluginCache(initialCache, async () => {
			let nextConfig = params.config;
			let pendingPluginInstalls;
			let enabledConfig = params.config;
			const manifestAuthChoice = resolveManifestProviderAuthChoice(params.authChoice, {
				config: nextConfig,
				workspaceDir,
				env: params.env,
				includeUntrustedWorkspacePlugins: false
			});
			const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, {
				config: nextConfig,
				workspaceDir,
				env: params.env,
				includeUntrustedWorkspacePlugins: false
			});
			assertUtilityModelSeparation(params.config, (manifestAuthChoice ?? installCatalogEntry)?.modelTarget);
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
					onCapabilityConsent: createPluginCapabilityConsentPrompter(params.prompter, params.beforePersistentEffect),
					beforePersistentApply: params.assertCurrent
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
				const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-B3WrPhvj.mjs");
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
					beforePersistentEffect: params.beforePersistentEffect,
					beforePersistentApply: params.assertCurrent
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
			assertUtilityModelSeparation(params.config, resolved.wizard?.modelTarget);
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
				providerId: resolved.provider.id,
				env: params.env,
				runtime: params.runtime,
				prompter: params.prompter,
				method: resolved.method,
				agentDir: params.agentDir,
				agentId: params.agentId,
				workspaceDir,
				...params.signal ? { signal: params.signal } : {},
				assertCurrent: params.assertCurrent,
				...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
				beforePersistentEffect: async () => {
					assertUtilityModelSeparation(params.config, resolved.wizard?.modelTarget);
					await params.beforePersistentEffect?.();
				},
				secretInputMode: params.opts?.secretInputMode,
				allowSecretRefPrompt: false,
				opts: params.opts
			});
			const consumeAuthenticated = (result) => consume({
				...result,
				...prepared.pendingPluginInstalls ? { pendingPluginInstalls: prepared.pendingPluginInstalls } : {},
				authProfiles: applied.authProfiles,
				persistAuthProfiles: applied.persistAuthProfiles
			}, resolved.provider);
			nextConfig = applied.config;
			let agentModelOverride;
			if (applied.defaultModel) {
				const selectedModel = applied.defaultModel;
				if (resolved.wizard?.modelTarget === "utility") return await consumeAuthenticated({
					config: materializeUtilityModelSeparation(restoreConfiguredPrimaryModel(nextConfig, params.config), params.config).config,
					modelTarget: "utility",
					utilityModelOverride: selectedModel
				});
				const selectedModelDisplay = resolved.provider.preserveLiteralProviderPrefix ? formatLiteralProviderPrefixedModelRef(resolved.provider.id, selectedModel) : selectedModel;
				if (params.setDefaultModel) {
					const previousPrimary = resolveConfiguredDefaultModelPrimary(entryConfig);
					const preservesDifferentPrimary = params.preserveExistingDefaultModel === true && previousPrimary !== void 0 && previousPrimary !== selectedModel;
					const defaultModelConfig = params.preserveExistingDefaultModel === true ? restoreConfiguredPrimaryModel(nextConfig, entryConfig) : nextConfig;
					nextConfig = applyPrimaryModel(defaultModelConfig, selectedModel, { preserveExistingPrimary: params.preserveExistingDefaultModel === true });
					if (!preservesDifferentPrimary) {
						const runtimePlugins = await import("./runtime-plugin-install-C2kmPBmi.mjs");
						const installed = await runtimePlugins.ensureModelSelectionRuntimePlugins({
							cfg: nextConfig,
							model: selectedModel,
							prompter: params.prompter,
							runtime: params.runtime,
							beforePersistentEffect: params.beforePersistentEffect,
							beforePersistentApply: params.assertCurrent,
							...workspaceDir !== void 0 ? { workspaceDir } : {}
						});
						if (!installed.ok) {
							await params.prompter.note(installed.message, "Runtime unavailable");
							return await consume(preparedWithoutAuthProfiles({
								config: entryConfig,
								retrySelection: true
							}));
						}
						nextConfig = installed.cfg;
						await runProviderModelSelectedHook({
							config: nextConfig,
							model: selectedModel,
							preparedProvider: resolved.provider,
							env: params.env,
							prompter: params.prompter,
							agentDir: params.agentDir,
							workspaceDir
						});
						if (installed.codexInstalled) {
							const { offerPostInstallMigrations } = await import("./setup.post-install-migration-BvSGDVEV.mjs");
							nextConfig = (await offerPostInstallMigrations({
								config: nextConfig,
								runtime: params.runtime,
								prompter: params.prompter,
								installedPluginIds: [runtimePlugins.CODEX_RUNTIME_PLUGIN_ID]
							})).config;
						}
					}
					await params.prompter.note(preservesDifferentPrimary && previousPrimary ? t("wizard.model.keptExistingDefault", {
						current: previousPrimary,
						selected: selectedModelDisplay
					}) : t("wizard.model.defaultSet", { model: selectedModelDisplay }), t("wizard.model.configuredTitle"));
					return await consumeAuthenticated({ config: nextConfig });
				}
				nextConfig = restoreConfiguredPrimaryModel(nextConfig, params.config);
				agentModelOverride = selectedModel;
			}
			return await consumeAuthenticated({
				config: nextConfig,
				agentModelOverride
			});
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
