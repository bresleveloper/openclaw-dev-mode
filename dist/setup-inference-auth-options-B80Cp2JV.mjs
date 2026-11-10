import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { t as compareProviderAuthChoiceGroups } from "./provider-auth-choice-order-BXPE9pfe.mjs";
//#region src/system-agent/setup-inference-auth-options.ts
function projectChoicePresentation(choice, id = choice.choiceId.trim()) {
	return {
		id,
		...choice.modelTarget ? { modelTarget: choice.modelTarget } : {},
		brandId: choice.providerId,
		label: choice.choiceLabel,
		...choice.choiceHint?.trim() ? { hint: choice.choiceHint.trim() } : {},
		...choice.icon ? { icon: choice.icon } : {},
		...choice.website ? { website: choice.website } : {}
	};
}
function compareSetupInferenceOptions(a, b) {
	return Number(b.featured) - Number(a.featured) || compareProviderAuthChoiceGroups({
		id: a.brandId ?? a.id,
		label: a.groupLabel ?? a.label
	}, {
		id: b.brandId ?? b.id,
		label: b.groupLabel ?? b.label
	}) || a.label.localeCompare(b.label, "en") || a.id.localeCompare(b.id, "en");
}
function listSetupInferenceChoices(params) {
	const options = /* @__PURE__ */ new Map();
	for (const choice of params.choices) {
		const id = choice.choiceId.trim();
		if (!id || options.has(id) || choice.assistantVisibility === "detected-only" || !supportsSetupTextInference(choice.onboardingScopes) || !params.include(choice)) continue;
		options.set(id, {
			metadata: choice,
			option: params.project(choice, id)
		});
	}
	if (params.compare) return [...options.values()].map(({ option }) => option).toSorted(params.compare);
	return [...options.values()].toSorted((a, b) => Number(b.option.featured) - Number(a.option.featured) || compareProviderAuthChoiceGroups({
		id: a.metadata.groupId ?? a.metadata.providerId,
		label: a.metadata.groupLabel ?? a.metadata.choiceLabel
	}, {
		id: b.metadata.groupId ?? b.metadata.providerId,
		label: b.metadata.groupLabel ?? b.metadata.choiceLabel
	}) || (a.metadata.assistantPriority ?? 0) - (b.metadata.assistantPriority ?? 0) || a.option.label.localeCompare(b.option.label, "en") || a.option.id.localeCompare(b.option.id, "en")).map(({ option }) => option);
}
function listSetupInferenceInstallOptions(entries, installedChoices) {
	const installed = new Set(installedChoices.map((choice) => choice.choiceId));
	const options = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (installed.has(entry.choiceId) || options.has(entry.choiceId) || entry.assistantVisibility === "detected-only" || !supportsSetupTextInference(entry.onboardingScopes)) continue;
		options.set(entry.choiceId, {
			...projectChoicePresentation({
				choiceId: entry.choiceId,
				...entry.modelTarget ? { modelTarget: entry.modelTarget } : {},
				providerId: entry.providerId,
				choiceLabel: entry.choiceLabel,
				choiceHint: entry.choiceHint
			}),
			...entry.groupLabel?.trim() ? { groupLabel: entry.groupLabel.trim() } : {},
			kind: "install",
			featured: false
		});
	}
	return [...options.values()].toSorted(compareSetupInferenceOptions);
}
function supportsSetupTextInference(scopes) {
	return !scopes || scopes.includes("text-inference");
}
function supportsSetupManualSecret(choice) {
	return supportsSetupTextInference(choice.onboardingScopes) && choice.appGuidedSecret === true;
}
function listSetupInferenceManualProviders(authChoices) {
	return listSetupInferenceChoices({
		choices: authChoices,
		include: supportsSetupManualSecret,
		project: (choice, id) => ({
			...projectChoicePresentation(choice, id),
			...choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {}
		}),
		compare: compareSetupInferenceOptions
	});
}
function listSetupInferenceAuthOptions(authChoices) {
	return listSetupInferenceChoices({
		choices: authChoices,
		include: (choice) => Boolean(choice.appGuidedAuth) || choice.appGuidedSecret !== true && choice.appGuidedDiscovery !== true,
		project: (choice, id) => ({
			...projectChoicePresentation(choice, id),
			...choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {},
			kind: choice.appGuidedAuth ?? "install",
			featured: choice.onboardingFeatured === true
		})
	});
}
function listSetupInferenceEnableOptions(choices) {
	return choices.filter((choice) => choice.assistantVisibility !== "detected-only" && supportsSetupTextInference(choice.onboardingScopes)).map((choice) => Object.assign(projectChoicePresentation(choice, choice.choiceId), {
		kind: "install",
		featured: choice.onboardingFeatured === true
	}, choice.groupLabel?.trim() ? { groupLabel: choice.groupLabel.trim() } : {})).toSorted(compareSetupInferenceOptions);
}
function listSetupInferencePrepareOptions(authChoices) {
	return listSetupInferenceChoices({
		choices: authChoices,
		include: (choice) => choice.appGuidedDiscovery === true,
		project: (choice, id) => ({
			...projectChoicePresentation(choice, id),
			...choice.appGuidedActionLabel?.trim() ? { actionLabel: choice.appGuidedActionLabel.trim() } : {}
		})
	});
}
function findSetupCredentialChoice(choices, credential) {
	const saved = credential.setup;
	return choices.find((choice) => saved?.authChoice ? choice.choiceId === saved.authChoice && choice.pluginId === saved.pluginId : normalizeProviderId(choice.providerId) === normalizeProviderId(credential.provider) && supportsSetupTextInference(choice.onboardingScopes) && (credential.type === "oauth" ? Boolean(choice.appGuidedAuth) : choice.appGuidedSecret === true));
}
//#endregion
export { listSetupInferenceManualProviders as a, supportsSetupTextInference as c, listSetupInferenceInstallOptions as i, listSetupInferenceAuthOptions as n, listSetupInferencePrepareOptions as o, listSetupInferenceEnableOptions as r, supportsSetupManualSecret as s, findSetupCredentialChoice as t };
