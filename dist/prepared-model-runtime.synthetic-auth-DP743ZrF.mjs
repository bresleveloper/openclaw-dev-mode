import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { H as prepareSyntheticAuthWithProvider } from "./provider-runtime-DZ8luukj.mjs";
//#region src/agents/prepared-model-runtime.fingerprint.ts
const fingerprintPreparedRuntimeFacts = (value) => sha256Base64Url(stableStringify(value));
//#endregion
//#region src/agents/prepared-model-runtime.synthetic-auth.ts
/** Synthetic-auth provider ref selection and prepared-catalog resolution for model-runtime builds. */
/** Auth refresh owns the requested providers and their separate native auth namespaces. */
function preparedSyntheticAuthProviderScope(providerIds) {
	const scoped = new Set(providerIds.map((id) => normalizeProviderId(id)));
	if (scoped.has("openai")) scoped.add("codex");
	if (scoped.has("anthropic")) scoped.add("claude-cli");
	return scoped;
}
function scopeSyntheticAuthProviderRefs(refs, providerDiscoveryProviderIds) {
	const scope = providerDiscoveryProviderIds && preparedSyntheticAuthProviderScope(providerDiscoveryProviderIds);
	return refs.filter((ref) => !scope || scope.has(normalizeProviderId(ref)));
}
function listPreparedSyntheticAuthProviderRefs(providers) {
	return [...new Set(providers.flatMap((provider) => provider.resolveSyntheticAuth || provider.prepareSyntheticAuth ? [
		provider.id,
		...provider.aliases ?? [],
		...provider.hookAliases ?? []
	] : []))].toSorted((left, right) => left.localeCompare(right));
}
function listRegistrySyntheticAuthProviderRefs(registry) {
	return listPreparedSyntheticAuthProviderRefs(registry?.providers.map(({ provider }) => provider) ?? []);
}
async function prepareSyntheticAuth(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const providerPlugin = params.providers.find((candidate) => [
		candidate.id,
		...candidate.aliases ?? [],
		...candidate.hookAliases ?? []
	].some((ref) => normalizeProviderId(ref) === normalizedProvider));
	const context = {
		config: params.config,
		provider: params.provider,
		providerConfig: Object.entries(params.config.models?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[1]
	};
	return providerPlugin ? await prepareSyntheticAuthWithProvider(providerPlugin, context, params) : void 0;
}
//#endregion
export { scopeSyntheticAuthProviderRefs as a, preparedSyntheticAuthProviderScope as i, listRegistrySyntheticAuthProviderRefs as n, fingerprintPreparedRuntimeFacts as o, prepareSyntheticAuth as r, listPreparedSyntheticAuthProviderRefs as t };
