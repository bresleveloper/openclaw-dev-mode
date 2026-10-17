import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as prepareAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-Piu1KX0Y.mjs";
//#region src/commands/auth-choice.apply.ts
async function normalizeLegacyChoice(authChoice, params) {
	if (authChoice === "oauth") return "setup-token";
	if (typeof authChoice !== "string") return authChoice;
	const { resolveLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-_-l9rCQj.mjs");
	return resolveLegacyOnboardAuthChoice(authChoice, params).authChoice;
}
async function normalizeTokenProviderChoice(authChoice, params) {
	if (!params.opts?.tokenProvider) return authChoice;
	if (authChoice !== "apiKey" && authChoice !== "token" && authChoice !== "setup-token") return authChoice;
	const { normalizeApiKeyTokenProviderAuthChoice } = await import("./auth-choice.apply.api-providers-D_t7Ueid.mjs");
	return normalizeApiKeyTokenProviderAuthChoice({
		authChoice,
		tokenProvider: params.opts.tokenProvider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
}
async function formatDeprecatedProviderChoiceError(authChoice, params) {
	if (typeof authChoice !== "string") return;
	const { resolveManifestDeprecatedProviderAuthChoice } = await import("./provider-auth-choices-DnVdJH4W.mjs");
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, params) ?? (await import("./provider-install-catalog-BIu1hV1B.mjs")).resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		...params,
		includeUntrustedWorkspacePlugins: false
	});
	if (!deprecatedChoice) return;
	return `Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`;
}
/** Prepare a selected auth choice without writing its returned provider profiles. */
async function prepareAuthChoice(params) {
	const normalizedProviderAuthChoice = await normalizeTokenProviderChoice(await normalizeLegacyChoice(params.authChoice, params) ?? params.authChoice, params);
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
export { prepareAuthChoice as n, applyAuthChoice as t };
