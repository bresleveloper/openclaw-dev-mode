import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-CBoGKnJX.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-Dthg1dSQ.mjs";
import { t as sortFlowContributionsByLabel } from "./types-CnTXyUgM.mjs";
//#region src/flows/provider-flow.ts
const DEFAULT_PROVIDER_FLOW_SCOPE = "text-inference";
function includesProviderFlowScope(scopes, scope) {
	return scope === "all" || (scopes ? scopes.includes(scope) : scope === DEFAULT_PROVIDER_FLOW_SCOPE);
}
function resolveInstallCatalogProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	const normalizedPluginsConfig = normalizePluginsConfig(params?.config?.plugins);
	return resolveProviderInstallCatalogEntries({
		...params,
		includeUntrustedWorkspacePlugins: false
	}).filter((entry) => includesProviderFlowScope(entry.onboardingScopes, scope) && resolveEffectiveEnableState({
		id: entry.pluginId,
		origin: entry.origin,
		config: normalizedPluginsConfig,
		rootConfig: params?.config,
		enabledByDefault: true
	}).enabled).map((entry) => {
		const groupId = entry.groupId ?? entry.providerId;
		const groupLabel = entry.groupLabel ?? entry.label;
		return Object.assign({
			id: `provider:setup:${entry.choiceId}`,
			kind: `provider`,
			surface: `setup`,
			providerId: entry.providerId,
			pluginId: entry.pluginId,
			option: {
				value: entry.choiceId,
				...entry.modelTarget ? { modelTarget: entry.modelTarget } : {},
				label: entry.choiceLabel,
				...entry.choiceHint ? { hint: entry.choiceHint } : {},
				...entry.assistantPriority !== void 0 ? { assistantPriority: entry.assistantPriority } : {},
				...entry.assistantVisibility ? { assistantVisibility: entry.assistantVisibility } : {},
				group: {
					id: groupId,
					label: groupLabel,
					...entry.groupHint ? { hint: entry.groupHint } : {}
				}
			}
		}, entry.onboardingScopes ? { onboardingScopes: [...entry.onboardingScopes] } : {}, { source: `install-catalog` });
	});
}
function resolveManifestProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	return resolveManifestProviderAuthChoices({
		...params,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => includesProviderFlowScope(choice.onboardingScopes, scope)).map((choice) => {
		const groupId = choice.groupId ?? choice.providerId;
		const groupLabel = choice.groupLabel ?? choice.choiceLabel;
		return Object.assign({
			id: `provider:setup:${choice.choiceId}`,
			kind: `provider`,
			surface: `setup`,
			providerId: choice.providerId,
			pluginId: choice.pluginId,
			option: {
				value: choice.choiceId,
				...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
				label: choice.choiceLabel,
				...choice.choiceHint ? { hint: choice.choiceHint } : {},
				...choice.assistantPriority !== void 0 ? { assistantPriority: choice.assistantPriority } : {},
				...choice.assistantVisibility ? { assistantVisibility: choice.assistantVisibility } : {},
				...choice.onboardingFeatured ? { onboardingFeatured: true } : {},
				group: {
					id: groupId,
					label: groupLabel,
					...choice.groupHint ? { hint: choice.groupHint } : {}
				}
			}
		}, choice.onboardingScopes ? { onboardingScopes: [...choice.onboardingScopes] } : {}, { source: `manifest` });
	});
}
function resolveProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	const manifestContributions = resolveManifestProviderSetupFlowContributions({
		...params,
		scope
	});
	const seenOptionValues = new Set(manifestContributions.map((contribution) => contribution.option.value));
	const installCatalogContributions = resolveInstallCatalogProviderSetupFlowContributions({
		...params,
		scope
	}).filter((contribution) => !seenOptionValues.has(contribution.option.value));
	return sortFlowContributionsByLabel([...manifestContributions, ...installCatalogContributions]);
}
//#endregion
export { resolveProviderSetupFlowContributions as t };
