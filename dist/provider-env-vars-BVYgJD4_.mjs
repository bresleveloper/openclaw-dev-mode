import { n as buildPluginMetadataProviderFacts } from "./plugin-metadata-provider-facts-VzYAAmcr.mjs";
import { o as resolveProviderAuthEnvVarCandidatesCore, r as listKnownProviderAuthEnvVarNamesCore, t as getProviderEnvVarsCore } from "./provider-env-vars-BM4XH1SL.mjs";
//#region src/plugin-sdk/provider-env-vars.ts
function hasPreparedLookupParams(params) {
	const snapshot = params.metadataSnapshot;
	return snapshot === void 0 || "providerAuthContributions" in snapshot.owners && snapshot.owners.providerAuthContributions !== void 0;
}
function prepareLookupParams(params) {
	if (!params || hasPreparedLookupParams(params)) return params;
	const snapshot = params.metadataSnapshot;
	return {
		...params,
		metadataSnapshot: {
			...snapshot,
			owners: {
				...snapshot.owners,
				providerAuthContributions: buildPluginMetadataProviderFacts(snapshot.plugins).providerAuthContributions
			}
		}
	};
}
function getProviderEnvVars(providerId, params) {
	return getProviderEnvVarsCore(providerId, prepareLookupParams(params));
}
function listKnownProviderAuthEnvVarNames(params) {
	return listKnownProviderAuthEnvVarNamesCore(prepareLookupParams(params));
}
function resolveProviderAuthEnvVarCandidates(params) {
	return resolveProviderAuthEnvVarCandidatesCore(prepareLookupParams(params));
}
//#endregion
export { listKnownProviderAuthEnvVarNames as n, resolveProviderAuthEnvVarCandidates as r, getProviderEnvVars as t };
