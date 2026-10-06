import { r as resolveManifestProviderAuthChoice } from "./provider-auth-choices-CBoGKnJX.mjs";
import { t as resolveLegacyOnboardAuthChoice } from "./auth-choice-legacy-mYxKFtUF.mjs";
//#region src/plugins/provider-auth-choice-preference.ts
/** Resolves preferred provider auth choices from config and plugin metadata. */
async function resolvePreferredProviderForAuthChoice(params) {
	const choice = resolveLegacyOnboardAuthChoice(params.choice, { env: params.env }).authChoice ?? params.choice;
	const manifestResolved = resolveManifestProviderAuthChoice(choice, params);
	if (manifestResolved) return manifestResolved.providerId;
	const { resolveProviderPluginChoice, resolvePluginProviders } = await import("./provider-auth-choice.runtime.js");
	const pluginResolved = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			mode: "setup",
			includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins
		}),
		choice
	});
	if (pluginResolved) return pluginResolved.provider.id;
	if (choice === "custom-api-key") return "custom";
}
//#endregion
export { resolvePreferredProviderForAuthChoice as t };
