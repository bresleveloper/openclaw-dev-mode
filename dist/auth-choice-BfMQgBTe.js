import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { i as listOpenAIAuthProfileProvidersForAgentRuntime, o as openAIProviderUsesCodexRuntimeByDefault } from "./openai-routing-DXJmS9CT.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes-CA3PNIDt.js";
import { n as ensureAuthProfileStore } from "./store-9jfx-1KO.js";
import "./auth-profiles-aoLBSIs2.js";
import { n as listProfilesForProvider } from "./profile-list-DcdGY7PM.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-CFL1kjzt.js";
import { t as resolveEnvApiKey } from "./model-auth-env-CPrCZe_2.js";
import { n as loadModelCatalog } from "./model-catalog-CJwDdG-7.js";
import { d as hasUsableCustomProviderApiKey } from "./model-auth-Cg-0So6j.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-fT6f0Ok9.js";
import { t as applyAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-Ck1mIsoq.js";
import "./provider-auth-choice-preference-C5lHkfoa.js";
//#region src/commands/auth-choice.apply.ts
async function normalizeLegacyChoice(authChoice, params) {
	if (authChoice === "oauth") return "setup-token";
	if (typeof authChoice !== "string") return authChoice;
	const { normalizeLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-CAGrOglA.js");
	return normalizeLegacyOnboardAuthChoice(authChoice, params);
}
async function normalizeTokenProviderChoice(params) {
	if (!params.source.opts?.tokenProvider) return params.authChoice;
	if (params.authChoice !== "apiKey" && params.authChoice !== "token" && params.authChoice !== "setup-token") return params.authChoice;
	const { normalizeApiKeyTokenProviderAuthChoice } = await import("./auth-choice.apply.api-providers-DWpPxq_H.js");
	return normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: params.source.opts.tokenProvider,
		config: params.source.config,
		env: params.source.env
	});
}
async function formatDeprecatedProviderChoiceError(authChoice, params) {
	if (typeof authChoice !== "string") return;
	const { resolveManifestDeprecatedProviderAuthChoice } = await import("./provider-auth-choices-BfBwgWRY.js");
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: params.config,
		env: params.env
	});
	if (deprecatedChoice) return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
	const { resolveDeprecatedProviderInstallCatalogEntry } = await import("./provider-install-catalog-9ljWQWlw.js");
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
	return [.../* @__PURE__ */ new Set([params.provider, ...listOpenAIAuthProfileProvidersForAgentRuntime({
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
/**
* Resolve the default model ref and whether any usable credentials exist for
* it (auth profiles, provider env keys, or custom provider API keys). Shared
* by the onboarding model check and the finalize hatch gating.
*/
function resolveDefaultModelAuthStatus(config, options) {
	const ref = resolveDefaultModelForAgent({
		cfg: config,
		agentId: options?.agentId
	});
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
	const hasAuth = authProviders.some((provider) => hasProfileForProvider({
		store,
		provider,
		acceptedTypes
	})) || authProviders.some((provider) => resolveEnvApiKey(provider)) || authProviders.some((provider) => hasUsableCustomProviderApiKey(config, provider));
	return {
		provider: ref.provider,
		model: ref.model,
		hasAuth
	};
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
	const { hasAuth } = resolveDefaultModelAuthStatus(config, {
		...options?.agentId ? { agentId: options.agentId } : {},
		...options?.agentDir ? { agentDir: options.agentDir } : {}
	});
	if (!hasAuth) warnings.push(`No auth configured for provider "${ref.provider}". The agent may fail until credentials are added. ${buildProviderAuthRecoveryHint({
		provider: ref.provider,
		config,
		includeEnvVar: true
	})}`);
	if (warnings.length > 0) await prompter.note(warnings.join("\n"), "Model check");
}
//#endregion
export { warnIfModelConfigLooksOff as n, applyAuthChoice as r, resolveDefaultModelAuthStatus as t };
