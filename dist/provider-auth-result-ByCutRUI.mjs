import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.mjs";
import { a as normalizeConfiguredProviderCatalogModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { i as normalizeAgentModelSelectionForConfig, n as normalizeAgentModelMapForConfig, r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
import { t as buildAuthProfileId } from "./identity-C0n2rHTU.mjs";
//#region src/plugin-sdk/provider-auth-result.ts
function normalizeProviderConfigModelIdsForAuthResult(provider, providerConfig) {
	const models = providerConfig.models;
	if (!Array.isArray(models) || models.length === 0) return providerConfig;
	let mutated = false;
	const nextModels = models.map((model) => {
		const id = normalizeConfiguredProviderCatalogModelId(provider, model.id);
		if (id === model.id) return model;
		mutated = true;
		return Object.assign({}, model, { id });
	});
	return mutated ? {
		...providerConfig,
		models: nextModels
	} : providerConfig;
}
function normalizeProviderAuthConfigPatchModelRefs(patch) {
	let next = patch;
	const defaults = patch.agents?.defaults;
	if (defaults) {
		let nextDefaults = defaults;
		if (defaults.model !== void 0) {
			const model = normalizeAgentModelSelectionForConfig(defaults.model);
			if (model !== defaults.model) nextDefaults = {
				...nextDefaults,
				model
			};
		}
		if (defaults.models) {
			const models = normalizeAgentModelMapForConfig(defaults.models);
			if (models !== defaults.models) nextDefaults = {
				...nextDefaults,
				models
			};
		}
		if (nextDefaults !== defaults) next = {
			...next,
			agents: {
				...next.agents,
				defaults: nextDefaults
			}
		};
	}
	const providers = patch.models?.providers;
	if (!providers) return next;
	let mutated = false;
	const nextProviders = { ...providers };
	for (const [provider, providerConfig] of Object.entries(providers)) {
		const normalized = normalizeProviderConfigModelIdsForAuthResult(provider, providerConfig);
		if (normalized === providerConfig) continue;
		nextProviders[provider] = normalized;
		mutated = true;
	}
	return mutated ? {
		...next,
		models: {
			...next.models,
			providers: nextProviders
		}
	} : next;
}
/**
* Builds the standard auth result payload for OAuth-style provider login flows.
*
* The helper emits both the credential profile and the config patch expected by setup callers,
* while normalizing model refs so OAuth imports do not persist retired catalog ids.
*/
function buildOauthProviderAuthResult(params) {
	const email = params.email ?? void 0;
	const displayName = params.displayName ?? void 0;
	const defaultModel = normalizeAgentModelRefForConfig(params.defaultModel);
	const profileId = buildAuthProfileId({
		providerId: params.providerId,
		profilePrefix: params.profilePrefix,
		profileName: params.profileName ?? email
	});
	const expires = asDateTimestampMs(params.expires);
	return {
		profiles: [{
			profileId,
			credential: {
				type: "oauth",
				provider: params.providerId,
				access: params.access,
				...params.refresh ? { refresh: params.refresh } : {},
				...expires !== void 0 ? { expires } : {},
				...email ? { email } : {},
				...displayName ? { displayName } : {},
				...params.credentialExtra
			}
		}],
		configPatch: normalizeProviderAuthConfigPatchModelRefs(params.configPatch ?? { agents: { defaults: { models: { [defaultModel]: {} } } } }),
		defaultModel,
		notes: params.notes
	};
}
//#endregion
export { buildOauthProviderAuthResult as t };
