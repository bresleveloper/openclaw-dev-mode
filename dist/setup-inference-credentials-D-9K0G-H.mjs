import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { d as resolveAmbientOwnerAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as resolveUtilityModelSeparationError } from "./utility-model-separation-migration-CoAPHAUL.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-IbIjya7U.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DKt99_dy.mjs";
import { t as applyMergePatch } from "./merge-patch-C1--BlNd.mjs";
import { l as loadAuthProfileStoreWithoutExternalProfiles } from "./store-runtime-BcoYkagW.mjs";
import { i as resolveManifestProviderAuthChoices, r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { C as validateSetupModelTarget, a as SetupInferenceCancelledError, g as resolveSetupModel, l as parseInferenceRef, w as waitForProviderAuth, y as throwIfSetupInferenceCancelled } from "./setup-inference-core-CJd1l_r5.mjs";
import { c as supportsSetupTextInference, s as supportsSetupManualSecret, t as choiceMatchesCredential } from "./setup-inference-auth-options-D3RRexV_.mjs";
import { n as createQuickstartNotePrompter } from "./setup-apply-C6KfQziD.mjs";
import { t as runProviderPluginAuthMethodUnpersisted } from "./provider-auth-method-B-JPDhFb.mjs";
import { n as persistProviderAuthProfilesAfterLogin } from "./provider-auth-persistence-CqRKKZNC.mjs";
import { n as applyProviderPluginAuthMethodResultConfig, r as prepareAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-CeNvHRPb.mjs";
import { t as prepareCustomSetupCredentials } from "./setup-inference-custom-B5IzFJVi.mjs";
import { r as projectSetupInferenceConfig } from "./setup-model-selection-DGROJp4Z.mjs";
import { t as withSetupProviderAuthMethod } from "./setup-provider-method-Di_cXGou.mjs";
import { randomUUID } from "node:crypto";
//#region src/system-agent/setup-inference-credentials.ts
function assertUtilitySeparation(ctx, modelTarget) {
	if (modelTarget !== "utility") return;
	const error = resolveUtilityModelSeparationError(ctx.cfg);
	if (error) throw new Error(error);
}
function selectSetupCredential(profiles, modelRef, config) {
	const provider = resolveProviderIdForAuth(parseInferenceRef(modelRef).provider, { config });
	return profiles.find((profile) => resolveProviderIdForAuth(profile.credential.provider, {
		config,
		storedCredential: true
	}) === provider);
}
function isSetupCredentialReplacement(params) {
	const store = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir);
	const provider = resolveProviderIdForAuth(params.provider, {
		config: params.baseConfig,
		storedCredential: true
	});
	return Object.values(store.profiles).some((credential) => !credential.setup && resolveProviderIdForAuth(credential.provider, {
		config: params.baseConfig,
		storedCredential: true
	}) === provider) || Boolean(params.baseConfig.models?.providers?.[provider]?.apiKey) || parseInferenceRef(resolveAgentEffectiveModelPrimary(params.baseConfig, resolveAmbientOwnerAgentId(params.baseConfig)) ?? "").provider === provider;
}
async function saveSetupCredential(params) {
	const replacement = isSetupCredentialReplacement({
		...params,
		provider: params.profile.credential.provider
	});
	const candidate = {
		...params.profile,
		profileId: `${normalizeProviderId(params.profile.credential.provider)}:setup-${randomUUID()}`,
		credential: { ...params.profile.credential }
	};
	const prepared = applyProviderPluginAuthMethodResultConfig({
		config: params.config,
		result: { profiles: [candidate] }
	});
	const retryConfig = projectSetupInferenceConfig({
		base: {},
		prepared,
		modelRef: params.modelRef,
		agentId: resolveAmbientOwnerAgentId(params.baseConfig),
		profileId: candidate.profileId,
		credential: candidate.credential,
		pluginId: params.pluginId
	});
	const runtimePlugin = params.agentRuntimeId ? prepared.plugins?.entries?.[params.agentRuntimeId] : void 0;
	if (params.agentRuntimeId && runtimePlugin) ((retryConfig.plugins ??= {}).entries ??= {})[params.agentRuntimeId] = structuredClone(runtimePlugin);
	if (prepared.plugins?.installs) (retryConfig.plugins ??= {}).installs = prepared.plugins.installs;
	const providerConfig = retryConfig.models?.providers?.[parseInferenceRef(params.modelRef).provider];
	const apiKeyHeader = Boolean(providerConfig?.headers?.["api-key"]);
	if (apiKeyHeader && providerConfig?.headers) delete providerConfig.headers["api-key"];
	candidate.credential.setup = {
		replacement,
		modelRef: params.modelRef,
		configJson: JSON.stringify(retryConfig),
		authChoice: params.authChoice,
		pluginId: params.pluginId,
		agentRuntimeId: params.agentRuntimeId,
		...apiKeyHeader ? { apiKeyHeader: true } : {}
	};
	await params.beforePersistentEffect?.();
	if (params.persistAuthProfiles) {
		await params.persistAuthProfiles([candidate]);
		const credential = loadAuthProfileStoreWithoutExternalProfiles(params.agentDir).profiles[candidate.profileId];
		if (!credential) throw new Error("The saved setup credential could not be read. Check Model Setup before retrying.");
		return {
			profile: {
				...candidate,
				credential
			},
			config: prepared
		};
	}
	return {
		profile: (await persistProviderAuthProfilesAfterLogin({
			profiles: [candidate],
			config: prepared,
			agentDir: params.agentDir
		}))[0],
		config: prepared
	};
}
async function stagePreparedCandidate(ctx, params) {
	const modelTarget = params.choice?.modelTarget ?? params.modelTarget;
	const roleError = validateSetupModelTarget(modelTarget, ctx.params.modelTarget);
	if (roleError) return roleError;
	assertUtilitySeparation(ctx, modelTarget);
	const resolvedModel = resolveSetupModel({
		label: params.provider?.label ?? params.choice?.choiceLabel ?? "Custom provider",
		providerId: params.provider?.id ?? params.choice?.providerId ?? parseInferenceRef(params.result.defaultModel ?? "").provider,
		defaultModel: params.result.defaultModel,
		modelRef: params.modelRef ?? ctx.params.modelRef
	});
	if (typeof resolvedModel !== "string") return resolvedModel;
	const ref = parseInferenceRef(resolvedModel);
	const normalizedModel = params.provider?.normalizeModelId?.({
		provider: ref.provider,
		modelId: ref.model
	})?.trim();
	const modelRef = normalizedModel ? `${ref.provider}/${normalizedModel}` : resolvedModel;
	let profile = selectSetupCredential(params.result.profiles, modelRef, params.config);
	if (params.result.profiles.length > 0 && !profile) return { error: `${params.provider?.label ?? ref.provider} did not return credentials for "${modelRef}".` };
	const pluginId = params.pluginId ?? params.choice?.pluginId ?? params.provider?.pluginId;
	let preparedConfig = params.config;
	if (profile && params.credentialState === "new") {
		const saved = await saveSetupCredential({
			profile,
			config: preparedConfig,
			baseConfig: ctx.cfg,
			modelRef,
			pluginId,
			authChoice: params.choice?.choiceId,
			agentRuntimeId: params.agentRuntimeId,
			agentDir: ctx.agentDir,
			beforePersistentEffect: () => {
				assertUtilitySeparation(ctx, modelTarget);
				return ctx.beforePersistentEffect("credential");
			}
		});
		ctx.credentialsSaved = true;
		profile = saved.profile;
		preparedConfig = saved.config;
	}
	const config = projectSetupInferenceConfig({
		base: ctx.cfg,
		prepared: preparedConfig,
		modelRef,
		sourceModelRef: resolvedModel,
		agentId: ctx.routeAgentId,
		profileId: profile?.profileId,
		credential: profile?.credential,
		pluginId
	});
	return {
		modelRef,
		...modelTarget ? { modelTarget } : {},
		config,
		agentRuntimeId: params.agentRuntimeId ?? resolveModelRuntimePolicy({
			config,
			provider: ref.provider,
			modelId: parseInferenceRef(modelRef).model,
			agentId: ctx.routeAgentId
		}).policy?.id ?? "openclaw",
		authProfileId: profile?.profileId,
		pluginId,
		pendingPluginInstalls: params.pendingPluginInstalls
	};
}
async function stageSavedAuthCandidate(ctx, profileId) {
	const credential = loadAuthProfileStoreWithoutExternalProfiles(ctx.agentDir).profiles[profileId];
	if (!credential) return { error: "That saved sign-in is no longer available. Open Model Setup and choose again." };
	const saved = credential.setup;
	const choices = (ctx.deps.resolveManifestProviderAuthChoices ?? resolveManifestProviderAuthChoices)({
		config: ctx.cfg,
		workspaceDir: ctx.workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	});
	const choice = saved?.authChoice ? choices.find((entry) => entry.choiceId === saved.authChoice && entry.pluginId === saved.pluginId) : choices.find((entry) => choiceMatchesCredential(entry, credential));
	if (saved?.authChoice && !choice) return { error: "The saved sign-in's provider is no longer available. Review installed providers." };
	const roleError = validateSetupModelTarget(choice?.modelTarget, ctx.params.modelTarget);
	if (roleError) return roleError;
	assertUtilitySeparation(ctx, choice?.modelTarget);
	const materialize = async (loaded) => {
		if (!saved && !loaded) return { error: "Choose this provider's endpoint and model again. Your saved sign-in is still available." };
		const modelRef = saved?.modelRef ?? loaded?.method.starterModel;
		const { validateConfigObjectRaw } = await import("./validation-core-7nsrb1Tl.mjs");
		const storedConfig = saved ? validateConfigObjectRaw(applyMergePatch(ctx.cfg, JSON.parse(saved.configJson))) : void 0;
		if (storedConfig && !storedConfig.ok) return { error: "The saved connection settings are no longer valid. Choose the provider settings again." };
		const config = applyProviderPluginAuthMethodResultConfig({
			config: storedConfig?.ok ? storedConfig.config : loaded?.config ?? ctx.cfg,
			result: { profiles: [{
				profileId,
				credential
			}] }
		});
		if (saved?.apiKeyHeader && credential.type === "api_key") {
			const providerConfig = config.models?.providers?.[parseInferenceRef(saved.modelRef).provider];
			const key = credential.keyRef ?? credential.key;
			if (providerConfig && key) (providerConfig.headers ??= {})["api-key"] = key;
		}
		ctx.credentialsSaved = true;
		return await stagePreparedCandidate(ctx, {
			result: {
				profiles: [{
					profileId,
					credential
				}],
				defaultModel: modelRef
			},
			config,
			credentialState: "saved",
			choice,
			provider: loaded?.provider,
			pluginId: saved?.pluginId,
			agentRuntimeId: saved?.agentRuntimeId,
			pendingPluginInstalls: config.plugins?.installs
		});
	};
	return choice ? withSetupProviderAuthMethod({
		...ctx,
		choice,
		activation: ctx.params
	}, materialize) : materialize();
}
async function stageProviderAutoCandidate(ctx, choiceId) {
	const choice = (ctx.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(choiceId, {
		config: ctx.cfg,
		workspaceDir: ctx.workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	});
	if (!choice || choice.appGuidedDiscovery !== true || !supportsSetupTextInference(choice.onboardingScopes)) return { error: "That detected provider is no longer available on this Gateway." };
	const roleError = validateSetupModelTarget(choice.modelTarget, ctx.params.modelTarget);
	if (roleError) return roleError;
	assertUtilitySeparation(ctx, choice.modelTarget);
	return await withSetupProviderAuthMethod({
		...ctx,
		choice,
		activation: ctx.params
	}, async (loaded) => {
		const guidedSetup = loaded.method.appGuidedSetup;
		const modelRef = ctx.params.modelRef?.trim();
		if (!guidedSetup || !modelRef) return { error: "The detected provider model is missing. Run detection again." };
		const prepared = await guidedSetup.prepare({
			config: loaded.config,
			env: process.env,
			workspaceDir: ctx.workspace,
			modelRef,
			...ctx.params.signal ? { signal: ctx.params.signal } : {}
		});
		if (!prepared || normalizeAgentModelRefForConfig(prepared.defaultModel ?? "") !== modelRef) return { error: `${choice.choiceLabel} could not prepare the detected model. Run detection again.` };
		return await stagePreparedCandidate(ctx, {
			result: prepared,
			config: applyProviderPluginAuthMethodResultConfig({
				config: loaded.config,
				result: prepared
			}),
			choice,
			modelRef,
			credentialState: "new"
		});
	});
}
async function stageProviderAuthCandidate(ctx, interactive, agentRuntimeId) {
	const { params } = ctx;
	const apiKey = params.apiKey?.trim();
	if (!interactive && !apiKey) return { error: "Enter an API key or token first." };
	const authChoice = params.authChoice?.trim();
	if (interactive && authChoice === "custom-api-key") {
		const roleError = validateSetupModelTarget(void 0, params.modelTarget);
		if (roleError) return roleError;
		if (params.isRemoteProviderAuth ?? params.surface === "gateway") return { error: "For a custom provider, run openclaw onboard --auth-choice custom-api-key on the Gateway host, then return here and refresh connections." };
		if (!params.prompter) return { error: "Custom provider setup requires an interactive setup session." };
		const { promptCustomApiConfig } = await import("./onboard-custom-CVY7cQma.mjs");
		const prepared = await waitForProviderAuth(promptCustomApiConfig({
			config: ctx.cfg,
			runtime: params.runtime,
			prompter: params.prompter,
			target: {
				agentId: ctx.routeAgentId,
				agentDir: ctx.agentDir,
				workspaceDir: ctx.workspace
			},
			setAsPrimary: false,
			verification: "deferred"
		}), params.signal);
		throwIfSetupInferenceCancelled(params);
		const { config, profiles } = prepareCustomSetupCredentials(prepared);
		return await stagePreparedCandidate(ctx, {
			result: {
				profiles,
				defaultModel: `${prepared.providerId}/${prepared.modelId}`
			},
			config,
			credentialState: "new",
			agentRuntimeId
		});
	}
	const choice = authChoice ? (ctx.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(authChoice, {
		config: ctx.cfg,
		workspaceDir: ctx.workspace,
		includeUntrustedWorkspacePlugins: false,
		includeWorkspacePlugins: false
	}) : void 0;
	const installEntry = authChoice ? resolveProviderInstallCatalogEntry(authChoice, {
		config: ctx.cfg,
		workspaceDir: ctx.workspace,
		includeUntrustedWorkspacePlugins: false
	}) : void 0;
	const managedWizardChoice = !choice ? installEntry && supportsSetupTextInference(installEntry.onboardingScopes) ? installEntry : void 0 : supportsSetupTextInference(choice.onboardingScopes) && (choice.appGuidedSecret === true || !choice.appGuidedAuth && choice.appGuidedDiscovery !== true) ? {
		pluginId: choice.pluginId,
		label: choice.groupLabel ?? choice.choiceLabel
	} : void 0;
	const roleError = validateSetupModelTarget(choice?.modelTarget ?? installEntry?.modelTarget, params.modelTarget);
	if (roleError) return roleError;
	assertUtilitySeparation(ctx, choice?.modelTarget ?? installEntry?.modelTarget);
	if (interactive && authChoice && managedWizardChoice) {
		if (!params.prompter) return { error: "Installing this provider requires an interactive setup session." };
		return await prepareAuthChoiceLoadedPluginProvider({
			authChoice,
			config: ctx.cfg,
			runtime: params.runtime,
			prompter: params.prompter,
			agentDir: ctx.agentDir,
			agentId: ctx.routeAgentId,
			workspaceDir: ctx.workspace,
			setDefaultModel: false,
			preserveExistingDefaultModel: true,
			signal: params.signal,
			isRemote: params.isRemoteProviderAuth ?? params.surface === "gateway",
			beforePersistentEffect: ctx.beforePersistentEffect
		}, async (prepared, provider) => {
			throwIfSetupInferenceCancelled(params);
			const selectedModel = prepared?.utilityModelOverride ?? prepared?.agentModelOverride;
			if (!prepared || prepared.retrySelection || !selectedModel?.trim()) return { error: prepared?.installError || `${managedWizardChoice.label} was not installed and configured. Review the installer details and try again.` };
			return await stagePreparedCandidate(ctx, {
				result: {
					profiles: prepared.authProfiles,
					defaultModel: selectedModel
				},
				...prepared.modelTarget ? { modelTarget: prepared.modelTarget } : {},
				config: prepared.config,
				credentialState: "new",
				choice,
				provider,
				pendingPluginInstalls: prepared.pendingPluginInstalls,
				agentRuntimeId
			});
		});
	}
	const unavailable = interactive ? "That provider setup is not available on this Gateway." : "That key-based provider is not available on this Gateway.";
	if (!choice || !supportsSetupTextInference(choice.onboardingScopes) || !interactive && !supportsSetupManualSecret(choice) || interactive && (choice.assistantVisibility === "manual-only" || !choice.appGuidedAuth && choice.appGuidedDiscovery !== true)) return { error: unavailable };
	return await withSetupProviderAuthMethod({
		...ctx,
		choice,
		activation: params
	}, async (loaded) => {
		const { method } = loaded;
		if (interactive && choice.appGuidedDiscovery !== true && method.kind !== "oauth" && method.kind !== "device_code") return { error: unavailable };
		try {
			if (interactive && !params.prompter) return { error: "This provider login requires an interactive setup session." };
			throwIfSetupInferenceCancelled(params);
			let result = await waitForProviderAuth(runProviderPluginAuthMethodUnpersisted({
				config: loaded.config,
				runtime: params.runtime,
				method,
				agentDir: ctx.agentDir,
				workspaceDir: ctx.workspace,
				prompter: params.prompter ?? createQuickstartNotePrompter(params.runtime),
				signal: params.signal,
				assertCurrent: () => throwIfSetupInferenceCancelled(params),
				isRemote: params.isRemoteProviderAuth ?? params.surface === "gateway",
				...!interactive ? {
					secretInputMode: "plaintext",
					allowSecretRefPrompt: false,
					opts: {
						token: apiKey,
						tokenProvider: loaded.provider.id,
						...choice.optionKey ? { [choice.optionKey]: apiKey } : {},
						...params.modelRef ? { customModelId: parseInferenceRef(params.modelRef).model } : {}
					}
				} : {}
			}), params.signal);
			throwIfSetupInferenceCancelled(params);
			let config = applyProviderPluginAuthMethodResultConfig({
				config: loaded.config,
				result
			});
			if (interactive && choice.appGuidedDiscovery === true) {
				const guided = method.appGuidedSetup;
				if (!guided) return { error: unavailable };
				const selectedModel = params.modelRef?.trim() || result.defaultModel;
				const selected = selectedModel ? { modelRef: selectedModel } : await guided.detect({
					config,
					env: process.env,
					workspaceDir: ctx.workspace,
					signal: params.signal
				});
				if (!selected) return { error: `${loaded.provider.label} setup completed, but no compatible model was found. Add a compatible model and try again.` };
				const prepared = await guided.prepare({
					config,
					env: process.env,
					workspaceDir: ctx.workspace,
					modelRef: selected.modelRef,
					signal: params.signal
				});
				if (!prepared || normalizeAgentModelRefForConfig(prepared.defaultModel ?? "") !== selected.modelRef) return { error: `${loaded.provider.label} could not prepare its detected model. Try setup again.` };
				config = applyProviderPluginAuthMethodResultConfig({
					config,
					result: prepared
				});
				result = {
					...prepared,
					profiles: [...new Map([...result.profiles, ...prepared.profiles].map((profile) => [profile.profileId, profile])).values()]
				};
			}
			return await stagePreparedCandidate(ctx, {
				result,
				config,
				choice,
				credentialState: "new",
				...choice.appGuidedDiscovery ? {} : { provider: loaded.provider },
				agentRuntimeId,
				pendingPluginInstalls: config.plugins?.installs
			});
		} catch (error) {
			if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return { error: "Provider login was cancelled." };
			return { error: `${loaded.provider.label} could not prepare this ${interactive ? "login" : "credential"} for app-guided setup: ${formatErrorMessage(error)}` };
		}
	});
}
//#endregion
export { stageProviderAutoCandidate as a, stageProviderAuthCandidate as i, saveSetupCredential as n, stageSavedAuthCandidate as o, selectSetupCredential as r, isSetupCredentialReplacement as t };
