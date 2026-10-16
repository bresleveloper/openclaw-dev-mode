import { i as normalizeProviderIdForAuth } from "./provider-id-D1VImdKk.mjs";
import { t as canonicalizeProviderModelId } from "./provider-model-route-BpciAISP.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { n as ensureAuthProfileStore } from "./store-runtime-CzCCJ_Oe.mjs";
import "./model-selection-C1qxt1eY.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-BB6wFir2.mjs";
import { t as createModelAuthAvailabilityResolver } from "./model-auth-availability-Cv_2tZ2X.mjs";
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
	const warnings = [];
	const authStatus = resolveDefaultModelAuthStatus(config, options);
	if (authStatus.status === "missing") warnings.push(`No auth configured for provider "${authStatus.provider}". The agent may fail until credentials are added. ${buildProviderAuthRecoveryHint({
		provider: authStatus.provider,
		config,
		includeEnvVar: authStatus.authRequirement !== "subscription"
	})}`);
	else if (authStatus.status === "incompatible") warnings.push(`Model route is incompatible for "${authStatus.provider}/${authStatus.model}": ${authStatus.message}`);
	else if (authStatus.status === "indeterminate") warnings.push(`Auth readiness could not be confirmed for "${authStatus.provider}/${authStatus.model}". Verify the selected model route and credential source before continuing.`);
	if (warnings.length > 0) await prompter.note(warnings.join("\n"), "Model check");
}
//#endregion
export { resolveDefaultModelCatalogFacts as n, warnIfModelConfigLooksOff as r, resolveDefaultModelAuthStatus as t };
