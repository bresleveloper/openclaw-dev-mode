import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-15nvbxqy.mjs";
import { r as resolveProviderModelCatalogId } from "./provider-model-routes-BXIDiDZZ.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-Bz7NzEHI.mjs";
import { s as getPreparedRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-CSLjByUx.mjs";
import { m as resolveExplicitAuthOrderSelection } from "./order-B7W96aON.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DmZI0WMx.mjs";
import { c as resolveCliRuntimeModelBackendBinding, i as listCliRuntimeProviderIds, n as isCliRuntimeModelBackendForProvider, r as listCliRuntimeModelBackendBindings, s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-CEoVwGbW.mjs";
//#region src/agents/model-runtime-aliases.ts
/**
* Resolves CLI runtime aliases to provider/model auth labels and execution ids.
*/
const RETIRED_MODEL_PICKER_PROVIDERS = /* @__PURE__ */ new Set(["codex", "codex-cli"]);
/** True for retired provider ids that should stay out of model selection surfaces. */
function isRetiredModelPickerProvider(provider) {
	return RETIRED_MODEL_PICKER_PROVIDERS.has(normalizeProviderId(provider));
}
/** Creates a provider visibility predicate for model picker rendering. */
function createModelPickerVisibleProviderPredicate(params = {}) {
	const cliRuntimeProviders = new Set(listCliRuntimeProviderIds({
		config: params.config,
		env: params.env,
		includeSetupRegistry: params.includeSetupRegistry ?? false
	}));
	return (provider) => {
		const normalized = normalizeProviderId(provider);
		return !isRetiredModelPickerProvider(normalized) && !cliRuntimeProviders.has(normalized);
	};
}
/** True for CLI runtime provider ids such as `claude-cli` and `google-gemini-cli`. */
function isCliRuntimeProvider(provider, params = {}) {
	const normalized = normalizeProviderId(provider);
	return listCliRuntimeProviderIds({
		config: params.config,
		env: params.env,
		includeSetupRegistry: params.includeSetupRegistry ?? (params.config !== void 0 || params.env !== void 0)
	}).includes(normalized);
}
function isCliRuntimeAlias(runtime) {
	const normalized = normalizeProviderId(runtime ?? "");
	return normalized ? listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === normalized) : false;
}
function isCliRuntimeAliasForProvider(params) {
	return isCliRuntimeModelBackendForProvider({
		provider: params.provider,
		runtime: params.runtime,
		config: params.cfg
	});
}
function canonicalizeRuntimeAliasProvider(provider, options = {}) {
	return resolveCliRuntimeCanonicalProvider({
		runtime: provider,
		config: options.config,
		env: options.env,
		includeSetupRegistry: options.includeSetupRegistry ?? (options.config !== void 0 || options.env !== void 0)
	}) ?? provider;
}
function normalizeRuntimeModelRefForComparison(raw, options = {}) {
	const trimmed = raw.trim();
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return normalizeProviderId(canonicalizeRuntimeAliasProvider(trimmed, options));
	const canonicalProvider = normalizeProviderId(canonicalizeRuntimeAliasProvider(parsed.provider, options));
	return `${canonicalProvider}/${resolveProviderModelCatalogId({
		provider: canonicalProvider,
		modelId: parsed.modelId
	}) ?? parsed.modelId}`;
}
function normalizeRuntimeModelRefWithoutAlias(raw) {
	const trimmed = raw.trim();
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return normalizeProviderId(trimmed);
	return `${parsed.provider}/${parsed.modelId}`;
}
function areRuntimeModelRefsEquivalent(left, right, options = {}) {
	if (normalizeRuntimeModelRefWithoutAlias(left) === normalizeRuntimeModelRefWithoutAlias(right)) return true;
	return normalizeRuntimeModelRefForComparison(left, options) === normalizeRuntimeModelRefForComparison(right, options);
}
function shouldPreferActiveRuntimeAliasAuthLabel(params) {
	if (!params.runtimeAliasModelEquivalent) return false;
	const selectedAuth = normalizeOptionalLowercaseString(params.selectedAuthLabel);
	const activeAuth = normalizeOptionalLowercaseString(params.activeAuthLabel);
	if (!activeAuth || activeAuth === "unknown") return false;
	return selectedAuth === "unknown" || Boolean(selectedAuth?.startsWith("api-key")) && (activeAuth.startsWith("oauth") || activeAuth.startsWith("token") || activeAuth.startsWith("native"));
}
function resolveRuntimeAuthProvider(provider, params, storedCredential = false) {
	return resolveProviderIdForAuth(provider, {
		config: params.cfg,
		storedCredential,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	});
}
function resolveProfileRuntimeAlias(params) {
	const provider = normalizeProviderId(params.provider);
	const profileProvider = normalizeProviderId(params.profileProvider ?? "");
	if (!provider || !profileProvider) return;
	if (resolveRuntimeAuthProvider(provider, params) !== resolveRuntimeAuthProvider(profileProvider, params, true)) return;
	if (profileProvider === provider) return;
	return resolveCliRuntimeModelBackendBinding({
		config: params.cfg,
		provider,
		runtime: profileProvider
	})?.runtime;
}
function resolveCliRuntimeFromAuthProfile(params) {
	const configuredProfiles = params.cfg?.auth?.profiles ?? {};
	const env = params.preparedAuthDirectories?.env ?? process.env;
	const store = params.preparedAuthStore ?? getPreparedRuntimeAuthProfileStoreSnapshotCore(params.preparedAuthDirectories?.agentDir ?? (params.agentId ? resolveAgentDir(params.cfg ?? {}, params.agentId) : void 0), resolveLegacyInheritedAuthDir(params.cfg ?? {}, env, () => params.preparedAuthDirectories?.inheritedAuthDir), env);
	if (params.authProfileId?.trim()) {
		const profileId = params.authProfileId.trim();
		return resolveProfileRuntimeAlias({
			...params,
			provider: params.provider,
			profileProvider: (configuredProfiles[profileId] ?? store?.profiles[profileId])?.provider
		});
	}
	const provider = normalizeProviderId(params.provider);
	const providerAuthKey = resolveRuntimeAuthProvider(provider, params);
	const selection = resolveExplicitAuthOrderSelection({
		storeOrder: store?.order,
		configuredOrder: params.cfg?.auth?.order,
		providerKey: provider,
		providerAuthKey
	});
	for (const profileId of selection.order ?? []) {
		const profile = configuredProfiles[profileId] ?? store?.profiles[profileId];
		if (!profile?.provider) continue;
		if (resolveRuntimeAuthProvider(profile.provider, params, true) !== providerAuthKey) continue;
		return resolveProfileRuntimeAlias({
			...params,
			provider,
			profileProvider: profile.provider
		});
	}
	if (selection.order !== void 0 && (selection.order.length === 0 || selection.order.some((profileId) => store?.profiles[profileId] !== void 0))) return;
	const compatibleProfileIds = Object.entries(configuredProfiles).filter(([, profile]) => {
		if (!profile?.provider) return false;
		return resolveRuntimeAuthProvider(profile.provider, params) === providerAuthKey;
	}).map(([profileId]) => profileId);
	if (compatibleProfileIds.length !== 1) return;
	const [profileId] = compatibleProfileIds;
	return profileId ? resolveProfileRuntimeAlias({
		...params,
		provider,
		profileProvider: configuredProfiles[profileId]?.provider
	}) : void 0;
}
function resolveCliRuntimeExecutionProvider(params) {
	const provider = normalizeProviderId(params.provider);
	const { policy, matchedProvider } = resolveModelRuntimePolicy({
		config: params.cfg,
		provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	const runtime = policy?.id?.trim() || void 0;
	if (runtime === "openclaw") return;
	if (!runtime || runtime === "auto") return resolveCliRuntimeFromAuthProfile({
		...params,
		provider
	});
	const effectiveProvider = provider || normalizeProviderId(matchedProvider ?? "");
	if (!effectiveProvider) return;
	return resolveCliRuntimeModelBackendBinding({
		config: params.cfg,
		provider: effectiveProvider,
		runtime
	})?.runtime;
}
//#endregion
export { isCliRuntimeProvider as a, shouldPreferActiveRuntimeAliasAuthLabel as c, isCliRuntimeAliasForProvider as i, createModelPickerVisibleProviderPredicate as n, isRetiredModelPickerProvider as o, isCliRuntimeAlias as r, resolveCliRuntimeExecutionProvider as s, areRuntimeModelRefsEquivalent as t };
