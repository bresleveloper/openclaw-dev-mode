import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { r as prepareAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-vpsZqaxh.mjs";
//#region src/commands/auth-choice.apply.ts
/** Prepare a selected auth choice without writing its returned provider profiles. */
async function prepareAuthChoice(params) {
	let authChoice = params.authChoice;
	if (authChoice === "oauth") authChoice = "setup-token";
	else {
		const { resolveLegacyOnboardAuthChoice } = await import("./auth-choice-legacy-l6NJHDqZ.mjs");
		authChoice = resolveLegacyOnboardAuthChoice(authChoice, params).authChoice ?? authChoice;
	}
	if (params.opts?.tokenProvider && (authChoice === "apiKey" || authChoice === "token" || authChoice === "setup-token")) {
		const { normalizeApiKeyTokenProviderAuthChoice } = await import("./auth-choice.apply.api-providers-Bp_sTYRq.mjs");
		authChoice = normalizeApiKeyTokenProviderAuthChoice({
			authChoice,
			tokenProvider: params.opts.tokenProvider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		});
	}
	const normalizedParams = authChoice === params.authChoice ? params : {
		...params,
		authChoice
	};
	const result = await prepareAuthChoiceLoadedPluginProvider(normalizedParams, (prepared) => prepared);
	if (result) return result;
	const { resolveManifestDeprecatedProviderAuthChoice } = await import("./provider-auth-choices-CGNnbyqd.mjs");
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, normalizedParams) ?? (await import("./provider-install-catalog-DuAfqDPT.mjs")).resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		...normalizedParams,
		includeUntrustedWorkspacePlugins: false
	});
	if (deprecatedChoice) throw new Error(`Auth choice ${JSON.stringify(authChoice)} is no longer supported. Use ${JSON.stringify(deprecatedChoice.choiceId)} instead, or run ${formatCliCommand("openclaw onboard")} to choose interactively.`);
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
