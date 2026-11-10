import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as resolveProviderIdForAuth } from "./provider-auth-aliases-DCRcDae6.mjs";
import { o as getPreparedRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { a as normalizeOptionalAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { r as resolveProviderModelCatalogId } from "./provider-model-routes-CmpBxrCV.mjs";
import { r as resolveModelRuntimePolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { m as resolveExplicitAuthOrderSelection } from "./order-CElLtwMu.mjs";
import { c as resolveCliRuntimeModelBackendBinding, i as listCliRuntimeProviderIds, n as isCliRuntimeModelBackendForProvider, r as listCliRuntimeModelBackendBindings, s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-BzVT3JSM.mjs";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-BO2hiLXD.mjs";
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
		includeSetupRegistry: params.config !== void 0
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
		includeSetupRegistry: options.config !== void 0
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
/**
* Resolves an entry's twin route during owner-scoped preparation; model-id equivalence is plugin
* policy, so reads must not recompute it. A runtime chosen only by a session override has no
* twin: choosing that canonical row can reset to a different configured route.
*/
function resolveCliRuntimeTwinRoute(entry, scope) {
	const provider = normalizeProviderId(entry.provider);
	const aliasOf = scope.cliRuntimeBindings.find(({ runtime }) => runtime === provider)?.provider;
	const runtime = aliasOf ? provider : normalizeOptionalAgentRuntimeId(resolveModelRuntimePolicy({
		config: scope.config,
		agentId: scope.agentId,
		provider: entry.provider,
		modelId: entry.id
	}).policy?.id);
	if (!runtime || !scope.cliRuntimeBindings.some((binding) => binding.runtime === runtime)) return;
	const canonical = aliasOf ?? provider;
	return {
		key: `${canonical}/${resolveProviderModelCatalogId({
			provider: canonical,
			modelId: entry.id
		}) ?? entry.id}\0${runtime}`,
		runtime,
		alias: aliasOf !== void 0
	};
}
/**
* Drops CLI runtime rows whose canonical twin is listed on the same runtime, so one model and
* route appear once. An alias stays when a selection policy (the agent's manual policy or a
* Gateway role) allows it but not its canonical twin.
*/
function omitCliRuntimeAliasTwins(rows, selectionPolicies) {
	const canonicalRows = /* @__PURE__ */ new Map();
	for (const { row, twin } of rows) if (twin && !twin.alias && row.agentRuntime?.id === twin.runtime) canonicalRows.set(twin.key, row);
	return rows.flatMap(({ row, twin }) => {
		const canonical = twin?.alias ? canonicalRows.get(twin.key) : void 0;
		return canonical && selectionPolicies.every((policy) => !policy.allows({
			provider: row.provider,
			model: row.id
		}) || policy.allows({
			provider: canonical.provider,
			model: canonical.id
		})) ? [] : [row];
	});
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
export { isCliRuntimeProvider as a, resolveCliRuntimeExecutionProvider as c, isCliRuntimeAliasForProvider as i, resolveCliRuntimeTwinRoute as l, createModelPickerVisibleProviderPredicate as n, isRetiredModelPickerProvider as o, isCliRuntimeAlias as r, omitCliRuntimeAliasTwins as s, areRuntimeModelRefsEquivalent as t, shouldPreferActiveRuntimeAliasAuthLabel as u };
