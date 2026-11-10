import { i as parseConcreteConfigPathTokens } from "./dot-path-CVD5Jolm.mjs";
import { i as getPluginRegistryForContext } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as resolveWebSearchInstallCatalogEntries } from "./web-search-install-catalog-D_H3kjvG.mjs";
import { n as resolveBundledExplicitWebFetchProvidersFromPublicArtifacts, r as resolveBundledExplicitWebSearchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts.explicit-CW0AzPFG.mjs";
//#region src/plugins/credential-descriptors.ts
function projectPluginCredentialDescriptors(pluginId, providers) {
	const fields = /* @__PURE__ */ new Map();
	for (const provider of providers) {
		if (!provider.credentialPath || !provider.credentialLabel) continue;
		let path;
		try {
			path = parseConcreteConfigPathTokens(provider.credentialPath);
		} catch {
			continue;
		}
		if (path.length < 5 || path.length > 32 || path[0] !== "plugins" || path[1] !== "entries" || path[2] !== pluginId || path[3] !== "config") continue;
		const key = JSON.stringify(path);
		if (fields.has(key)) continue;
		const signupProtocol = provider.signupUrl && URL.parse(provider.signupUrl)?.protocol;
		const signupUrl = signupProtocol === "https:" || signupProtocol === "http:" ? provider.signupUrl : void 0;
		fields.set(key, {
			path,
			label: provider.credentialLabel,
			envVars: [...provider.envVars],
			...provider.placeholder ? { placeholder: provider.placeholder } : {},
			...signupUrl ? { signupUrl } : {},
			...provider.requiresCredential !== void 0 ? { requiresCredential: provider.requiresCredential } : {}
		});
	}
	return [...fields.values()];
}
/** Metadata inspection must never enable or activate a plugin to discover a key field. */
function resolvePluginCredentialDescriptors(manifest) {
	const registry = getPluginRegistryForContext();
	const providers = [...registry?.webSearchProviders ?? [], ...registry?.webFetchProviders ?? []].filter((entry) => entry.pluginId === manifest.id).map((entry) => entry.provider);
	if (manifest.origin === "bundled") {
		const scope = { onlyPluginIds: [manifest.id] };
		if (manifest.contracts?.webSearchProviders?.length) providers.push(...resolveBundledExplicitWebSearchProvidersFromPublicArtifacts(scope) ?? []);
		if (manifest.contracts?.webFetchProviders?.length) providers.push(...resolveBundledExplicitWebFetchProvidersFromPublicArtifacts(scope) ?? []);
	} else if (manifest.trustedOfficialInstall) providers.push(...resolveWebSearchInstallCatalogEntries().filter((entry) => entry.pluginId === manifest.id).map((entry) => entry.provider));
	return projectPluginCredentialDescriptors(manifest.id, providers);
}
//#endregion
export { resolvePluginCredentialDescriptors as t };
