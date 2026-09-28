import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { i as normalizeProviderIdForAuth } from "./provider-id-DCtsDflE.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-D-_CCdkJ.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCVI_rv.mjs";
import "./auth-profiles-BFAOd5yW.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BwajCekE.mjs";
import { r as prepareAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-CUHd4Ibi.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-DgxB_kPc.mjs";
import "./provider-auth-choice-preference-B46ToLk7.mjs";
//#region src/commands/auth-choice.apply.ts
async function normalizeLegacyChoice(authChoice, params) {
	if (authChoice === "oauth") return "setup-token";
	if (typeof authChoice !== "string") return authChoice;
	const { resolveLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-CronbEHe.mjs");
	return resolveLegacyOnboardAuthChoice(authChoice, params).authChoice;
}
async function normalizeTokenProviderChoice(params) {
	if (!params.source.opts?.tokenProvider) return params.authChoice;
	if (params.authChoice !== "apiKey" && params.authChoice !== "token" && params.authChoice !== "setup-token") return params.authChoice;
	const { normalizeApiKeyTokenProviderAuthChoice } = await import("./auth-choice.apply.api-providers-CPaMkVp6.mjs");
	return normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: params.source.opts.tokenProvider,
		config: params.source.config,
		workspaceDir: params.source.workspaceDir,
		env: params.source.env
	});
}
async function formatDeprecatedProviderChoiceError(authChoice, params) {
	if (typeof authChoice !== "string") return;
	const { resolveManifestDeprecatedProviderAuthChoice } = await import("./provider-auth-choices-CELvXWSf.mjs");
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, params);
	if (deprecatedChoice) return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
	const { resolveDeprecatedProviderInstallCatalogEntry } = await import("./provider-install-catalog-D6zZsFWi.mjs");
	const externalDeprecatedChoice = resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		...params,
		includeUntrustedWorkspacePlugins: false
	});
	if (!externalDeprecatedChoice) return;
	return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(externalDeprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
}
/** Prepare a selected auth choice without writing its returned provider profiles. */
async function prepareAuthChoice(params) {
	const normalizedProviderAuthChoice = await normalizeTokenProviderChoice({
		authChoice: await normalizeLegacyChoice(params.authChoice, params) ?? params.authChoice,
		source: params
	});
	const normalizedParams = normalizedProviderAuthChoice === params.authChoice ? params : {
		...params,
		authChoice: normalizedProviderAuthChoice
	};
	const result = await prepareAuthChoiceLoadedPluginProvider(normalizedParams, (prepared) => prepared);
	if (result) return result;
	const deprecatedProviderChoiceError = await formatDeprecatedProviderChoiceError(normalizedParams.authChoice, normalizedParams);
	if (deprecatedProviderChoiceError) throw new Error(deprecatedProviderChoiceError);
	if (normalizedParams.authChoice === "token" || normalizedParams.authChoice === "setup-token") throw new Error([`Auth choice "${normalizedParams.authChoice}" was not matched to a provider setup flow.`, `Run ${formatCliCommand("openclaw models auth login --provider <provider>")} for provider auth, or rerun ${formatCliCommand("openclaw onboard")} to choose interactively.`].join("\n"));
	if (normalizedParams.authChoice === "oauth") throw new Error(`Auth choice "oauth" is no longer supported directly. Use a provider-specific auth entry, or run ${formatCliCommand("openclaw models auth login --provider <provider>")}.`);
	return {
		config: normalizedParams.config,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
}
/** Apply a selected auth choice, returning the mutated config or retry/model override signals. */
async function applyAuthChoice(params) {
	const prepared = await prepareAuthChoice(params);
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
//#region src/commands/auth-choice.model-check.ts
/**
* Resolve the default model ref and its auth readiness. A catalog observation
* makes transport-specific auth exact; absent observations remain
* indeterminate when provider facts cannot choose one route. Shared by the
* onboarding model check and the finalize hatch gating.
*/
function resolveDefaultModelAuthStatus(config, options) {
	const ref = resolveDefaultModelForAgent({
		cfg: config,
		agentId: options?.agentId
	});
	const store = ensureAuthProfileStore(options?.agentDir, {
		allowKeychainPrompt: false,
		config,
		...ref.provider === "openai" ? { externalCliProviderIds: ["openai"] } : {},
		readOnly: true
	});
	const pendingAuthProfiles = options?.pendingAuthProfiles ?? [];
	const authStore = pendingAuthProfiles.length ? {
		...store,
		profiles: { ...store.profiles }
	} : store;
	for (const { profileId, credential } of pendingAuthProfiles) authStore.profiles[profileId] = credential;
	const evaluation = createModelAuthAvailabilityResolver({
		cfg: config,
		agentId: options?.agentId,
		authStore,
		...options?.agentDir ? { agentDir: options.agentDir } : {},
		...options?.env ? { env: options.env } : {}
	}).evaluateModelAuth(ref.provider, {
		modelId: ref.model,
		...options?.observedRoutes?.length ? { observedRoutes: options.observedRoutes } : {}
	});
	if (evaluation.routeResolution?.kind === "incompatible") return {
		provider: ref.provider,
		model: ref.model,
		status: "incompatible",
		hasAuth: false,
		code: evaluation.routeResolution.code,
		message: evaluation.routeResolution.message
	};
	const availability = evaluation.availability;
	const authRequirement = evaluation.selectedRoute?.authRequirement;
	if (availability === true) return {
		provider: ref.provider,
		model: ref.model,
		status: "ready",
		hasAuth: true
	};
	if (availability === void 0 && (normalizeProviderIdForAuth(ref.provider) === "openai" || evaluation.routeResolution !== null || evaluation.evidence !== void 0)) return {
		provider: ref.provider,
		model: ref.model,
		status: "indeterminate",
		hasAuth: false
	};
	return {
		provider: ref.provider,
		model: ref.model,
		status: "missing",
		hasAuth: false,
		...authRequirement ? { authRequirement } : {}
	};
}
function catalogRouteObservation(entry) {
	if (!entry) return;
	const baseUrl = entry.baseUrl;
	if (entry.api === void 0 && baseUrl === void 0) return;
	return {
		...entry.api !== void 0 ? { api: entry.api } : {},
		...baseUrl !== void 0 ? { baseUrl } : {}
	};
}
/** Resolve logical model identity and every physical route represented by a catalog. */
function resolveDefaultModelCatalogFacts(config, catalog, options) {
	const ref = resolveDefaultModelForAgent({
		cfg: config,
		agentId: options?.agentId
	});
	const provider = normalizeProviderIdForAuth(ref.provider);
	const modelId = canonicalizeProviderModelId(provider, ref.model);
	const matches = (entry) => normalizeProviderIdForAuth(entry.provider) === provider && canonicalizeProviderModelId(provider, entry.id) === modelId;
	const observedRoutes = (options?.routeVariants ?? catalog).filter(matches).map(catalogRouteObservation).filter((route) => route !== void 0);
	return observedRoutes.length > 0 ? { observedRoutes } : {};
}
/** Warn when the selected default model does not have confirmed usable credentials. */
async function warnIfModelConfigLooksOff(config, prompter, options) {
	const ref = resolveDefaultModelForAgent({
		cfg: config,
		agentId: options?.agentId
	});
	const warnings = [];
	const authStatus = resolveDefaultModelAuthStatus(config, {
		...options?.agentId ? { agentId: options.agentId } : {},
		...options?.agentDir ? { agentDir: options.agentDir } : {},
		...options?.env ? { env: options.env } : {},
		...options?.observedRoutes ? { observedRoutes: options.observedRoutes } : {},
		...options?.pendingAuthProfiles ? { pendingAuthProfiles: options.pendingAuthProfiles } : {}
	});
	if (authStatus.status === "missing") warnings.push(`No auth configured for provider "${ref.provider}". The agent may fail until credentials are added. ${buildProviderAuthRecoveryHint({
		provider: ref.provider,
		config,
		includeEnvVar: authStatus.authRequirement !== "subscription"
	})}`);
	else if (authStatus.status === "incompatible") warnings.push(`Model route is incompatible for "${ref.provider}/${ref.model}": ${authStatus.message}`);
	else if (authStatus.status === "indeterminate") warnings.push(`Auth readiness could not be confirmed for "${ref.provider}/${ref.model}". Verify the selected model route and credential source before continuing.`);
	if (warnings.length > 0) await prompter.note(warnings.join("\n"), "Model check");
}
//#endregion
export { prepareAuthChoice as a, applyAuthChoice as i, resolveDefaultModelCatalogFacts as n, warnIfModelConfigLooksOff as r, resolveDefaultModelAuthStatus as t };
