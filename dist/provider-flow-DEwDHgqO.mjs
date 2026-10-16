import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { i as resolveManifestProviderAuthChoices } from "./provider-auth-choices-BWz3K_lG.mjs";
import { n as resolveProviderInstallCatalogEntries } from "./provider-install-catalog-BC20Lo4u.mjs";
//#region src/flows/provider-flow.ts
const DEFAULT_PROVIDER_FLOW_SCOPE = "text-inference";
function includesProviderFlowScope(scopes, scope) {
	return scope === "all" || (scopes ? scopes.includes(scope) : scope === DEFAULT_PROVIDER_FLOW_SCOPE);
}
function buildProviderSetupFlowContribution(choice, source, fallbackGroupLabel) {
	const groupId = choice.groupId ?? choice.providerId;
	const groupLabel = choice.groupLabel ?? fallbackGroupLabel;
	return {
		providerId: choice.providerId,
		option: {
			value: choice.choiceId,
			...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
			label: choice.choiceLabel,
			...choice.choiceHint ? { hint: choice.choiceHint } : {},
			...choice.assistantPriority !== void 0 ? { assistantPriority: choice.assistantPriority } : {},
			...choice.assistantVisibility ? { assistantVisibility: choice.assistantVisibility } : {},
			...source === "manifest" && choice.onboardingFeatured ? { onboardingFeatured: true } : {},
			group: {
				id: groupId,
				label: groupLabel,
				...choice.groupHint ? { hint: choice.groupHint } : {}
			}
		}
	};
}
function resolveProviderSetupFlowContributions(params) {
	const scope = params?.scope ?? DEFAULT_PROVIDER_FLOW_SCOPE;
	const manifestContributions = resolveManifestProviderAuthChoices({
		...params,
		includeUntrustedWorkspacePlugins: false
	}).filter((choice) => includesProviderFlowScope(choice.onboardingScopes, scope)).map((choice) => buildProviderSetupFlowContribution(choice, "manifest", choice.choiceLabel));
	const seenOptionValues = new Set(manifestContributions.map((contribution) => contribution.option.value));
	const normalizedPluginsConfig = normalizePluginsConfig(params?.config?.plugins);
	const installCatalogContributions = resolveProviderInstallCatalogEntries({
		...params,
		includeUntrustedWorkspacePlugins: false
	}).filter((entry) => includesProviderFlowScope(entry.onboardingScopes, scope) && resolveEffectiveEnableState({
		id: entry.pluginId,
		origin: entry.origin,
		config: normalizedPluginsConfig,
		rootConfig: params?.config,
		enabledByDefault: true
	}).enabled).map((entry) => buildProviderSetupFlowContribution(entry, "install-catalog", entry.label)).filter((contribution) => !seenOptionValues.has(contribution.option.value));
	return [...manifestContributions, ...installCatalogContributions].toSorted((left, right) => left.option.label.localeCompare(right.option.label) || left.option.value.localeCompare(right.option.value));
}
//#endregion
export { resolveProviderSetupFlowContributions as t };
