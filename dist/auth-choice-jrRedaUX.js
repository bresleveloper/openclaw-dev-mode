import { t as formatCliCommand } from "./command-format-2N79m0dg.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime, o as openAIProviderUsesCodexRuntimeByDefault } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import "./auth-profiles-DWHvUh-t.js";
import { n as listProfilesForProvider } from "./profile-list-CtT2BW_g.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { t as resolveEnvApiKey } from "./model-auth-env-W5zTaRQi.js";
import { n as loadModelCatalog } from "./model-catalog-DD_dq4PJ.js";
import { u as hasUsableCustomProviderApiKey } from "./model-auth-Bvz14MtI.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-vNAgIP1r.js";
import { t as applyAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-BZG2FlP5.js";
import "./provider-auth-choice-preference-sw9yuMtG.js";
//#region src/commands/auth-choice.apply.ts
async function normalizeLegacyChoice(authChoice, params) {
	if (authChoice === "oauth") return "setup-token";
	if (typeof authChoice !== "string") return authChoice;
	const { normalizeLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-DoD1np7z.js");
	return normalizeLegacyOnboardAuthChoice(authChoice, params);
}
async function normalizeTokenProviderChoice(params) {
	if (!params.source.opts?.tokenProvider) return params.authChoice;
	if (params.authChoice !== "apiKey" && params.authChoice !== "token" && params.authChoice !== "setup-token") return params.authChoice;
	const { normalizeApiKeyTokenProviderAuthChoice } = await import("./auth-choice.apply.api-providers-SJxMqYts.js");
	return normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: params.source.opts.tokenProvider,
		config: params.source.config,
		env: params.source.env
	});
}
async function formatDeprecatedProviderChoiceError(authChoice, params) {
	if (typeof authChoice !== "string") return;
	const { resolveManifestDeprecatedProviderAuthChoice } = await import("./provider-auth-choices-CFd_mvIz.js");
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: params.config,
		env: params.env
	});
	if (deprecatedChoice) return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
	const { resolveDeprecatedProviderInstallCatalogEntry } = await import("./provider-install-catalog-C_s4u8Ss.js");
	const externalDeprecatedChoice = resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		config: params.config,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
	if (!externalDeprecatedChoice) return;
	return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(externalDeprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
}
/** Apply a selected auth choice, returning the mutated config or retry/model override signals. */
async function applyAuthChoice(params) {
	const normalizedProviderAuthChoice = await normalizeTokenProviderChoice({
		authChoice: await normalizeLegacyChoice(params.authChoice, {
			config: params.config,
			env: params.env
		}) ?? params.authChoice,
		source: params
	});
	const normalizedParams = normalizedProviderAuthChoice === params.authChoice ? params : {
		...params,
		authChoice: normalizedProviderAuthChoice
	};
	const result = await applyAuthChoiceLoadedPluginProvider(normalizedParams);
	if (result) return result;
	const deprecatedProviderChoiceError = await formatDeprecatedProviderChoiceError(normalizedParams.authChoice, {
		config: normalizedParams.config,
		env: normalizedParams.env
	});
	if (deprecatedProviderChoiceError) throw new Error(deprecatedProviderChoiceError);
	if (normalizedParams.authChoice === "token" || normalizedParams.authChoice === "setup-token") throw new Error([`Auth choice "${normalizedParams.authChoice}" was not matched to a provider setup flow.`, `Run ${formatCliCommand("openclaw models auth login --provider <provider>")} for provider auth, or rerun ${formatCliCommand("openclaw onboard")} to choose interactively.`].join("\n"));
	if (normalizedParams.authChoice === "oauth") throw new Error(`Auth choice "oauth" is no longer supported directly. Use a provider-specific auth entry, or run ${formatCliCommand("openclaw models auth login --provider <provider>")}.`);
	return { config: normalizedParams.config };
}
//#endregion
//#region src/commands/auth-choice.model-check.ts
function resolveAuthProviderCandidates(params) {
	const harnessPolicy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		agentId: params.agentId
	});
	return [...new Set([params.provider, ...listOpenAIAuthProfileProvidersForAgentRuntime({
		provider: params.provider,
		harnessRuntime: harnessPolicy.runtime,
		config: params.config
	})])];
}
function resolveAcceptedAuthProfileTypes(params) {
	if (openAIProviderUsesCodexRuntimeByDefault({
		provider: params.provider,
		config: params.config
	})) return;
	return params.provider === "openai" ? ["api_key"] : void 0;
}
function hasProfileForProvider(params) {
	const profileIds = listProfilesForProvider(params.store, params.provider);
	if (!params.acceptedTypes) return profileIds.length > 0;
	const acceptedTypes = new Set(params.acceptedTypes);
	return profileIds.some((profileId) => {
		const profile = params.store.profiles[profileId];
		return profile ? acceptedTypes.has(profile.type) : false;
	});
}
/** Warn when the selected default model is unknown or has no usable credentials. */
async function warnIfModelConfigLooksOff(config, prompter, options) {
	const ref = resolveDefaultModelForAgent({
		cfg: config,
		agentId: options?.agentId
	});
	const warnings = [];
	if (options?.validateCatalog !== false) {
		const catalog = await loadModelCatalog({
			config,
			useCache: false
		});
		if (catalog.length > 0) {
			if (!catalog.some((entry) => entry.provider === ref.provider && entry.id === ref.model)) warnings.push(`Model not found: ${ref.provider}/${ref.model}. Update agents.defaults.model or run /models list.`);
		}
	}
	const store = ensureAuthProfileStore(options?.agentDir);
	const authProviders = resolveAuthProviderCandidates({
		config,
		provider: ref.provider,
		modelId: ref.model,
		agentId: options?.agentId
	});
	const acceptedTypes = resolveAcceptedAuthProfileTypes({
		config,
		provider: ref.provider
	});
	if (!(authProviders.some((provider) => hasProfileForProvider({
		store,
		provider,
		acceptedTypes
	})) || authProviders.some((provider) => resolveEnvApiKey(provider)) || authProviders.some((provider) => hasUsableCustomProviderApiKey(config, provider)))) warnings.push(`No auth configured for provider "${ref.provider}". The agent may fail until credentials are added. ${buildProviderAuthRecoveryHint({
		provider: ref.provider,
		config,
		includeEnvVar: true
	})}`);
	if (warnings.length > 0) await prompter.note(warnings.join("\n"), "Model check");
}
//#endregion
export { applyAuthChoice as n, warnIfModelConfigLooksOff as t };
