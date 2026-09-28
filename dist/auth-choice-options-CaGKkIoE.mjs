import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { n as isFeaturedProviderAuthChoiceGroup, t as compareProviderAuthChoiceGroups } from "./provider-auth-choice-order-BXPE9pfe.mjs";
import { t as resolveProviderSetupFlowContributions } from "./provider-flow-C-lFUm_o.mjs";
//#region src/commands/auth-choice-options.static.ts
const CORE_AUTH_CHOICE_OPTIONS = [{
	value: "custom-api-key",
	label: "Custom Provider",
	hint: "Any OpenAI or Anthropic compatible endpoint",
	groupId: "custom",
	groupLabel: "Custom Provider",
	groupHint: "Any OpenAI or Anthropic compatible endpoint"
}];
/**
* Provider-agnostic auth choices that `--token-provider` binds to a concrete
* provider method. They stay out of `CORE_AUTH_CHOICE_OPTIONS` because the
* interactive picker only offers self-contained choices, but every CLI surface
* must advertise and accept them even when no manifest contributes the same id.
*/
const GENERIC_PROVIDER_AUTH_CHOICES = [
	"setup-token",
	"token",
	"apiKey"
];
/** Format static auth-choice values for Commander help/validation text. */
function formatStaticAuthChoiceChoicesForCli(params) {
	const includeSkip = params?.includeSkip ?? true;
	const values = [...CORE_AUTH_CHOICE_OPTIONS.map((opt) => opt.value), ...GENERIC_PROVIDER_AUTH_CHOICES];
	if (includeSkip) values.push("skip");
	return values.join("|");
}
//#endregion
//#region src/commands/auth-choice-options.ts
function compareOptionLabels(a, b) {
	return a.label.localeCompare(b.label);
}
/** Keep the first-tier provider list stable; every other group belongs under More. */
function isFeaturedAuthChoiceGroup(group) {
	return isFeaturedProviderAuthChoiceGroup(group.value);
}
function compareAssistantOptions(a, b) {
	return (a.assistantPriority ?? 0) - (b.assistantPriority ?? 0) || compareOptionLabels(a, b);
}
/** Sort auth-choice groups with featured providers first, then stable labels. */
function compareAuthChoiceGroups(a, b) {
	return compareProviderAuthChoiceGroups({
		id: a.value,
		label: a.label
	}, {
		id: b.value,
		label: b.label
	});
}
function resolveProviderChoiceOptions(params) {
	return resolveProviderSetupFlowContributions({
		...params,
		scope: "text-inference"
	}).map((contribution) => Object.assign({}, {
		value: contribution.option.value,
		label: contribution.option.label
	}, { providerId: contribution.providerId }, contribution.option.modelTarget ? { modelTarget: contribution.option.modelTarget } : {}, contribution.option.hint ? { hint: contribution.option.hint } : {}, contribution.option.assistantPriority !== void 0 ? { assistantPriority: contribution.option.assistantPriority } : {}, contribution.option.assistantVisibility ? { assistantVisibility: contribution.option.assistantVisibility } : {}, contribution.option.group ? {
		groupId: contribution.option.group.id,
		groupLabel: contribution.option.group.label,
		...contribution.option.group.hint ? { groupHint: contribution.option.group.hint } : {}
	} : {}, contribution.option.onboardingFeatured ? { onboardingFeatured: true } : {}));
}
/**
* Format every accepted `--auth-choice` value for CLI help and validation.
*
* This is the single owner of that set: help text, onboard preflight, and the
* non-interactive dispatcher all render it, so an advertised value is always an
* accepted one. Deprecated aliases stay out; `auth-choice-legacy.ts` normalizes
* them before any surface sees them.
*/
function formatAuthChoiceChoicesForCli(params) {
	const values = [...formatStaticAuthChoiceChoicesForCli(params).split("|"), ...resolveProviderSetupFlowContributions({
		...params,
		scope: "all"
	}).map((contribution) => contribution.option.value)];
	return uniqueStrings(values).join("|");
}
/** Build flat auth-choice options from core choices plus provider setup flows. */
function buildAuthChoiceOptions(params) {
	const optionByValue = /* @__PURE__ */ new Map();
	for (const option of CORE_AUTH_CHOICE_OPTIONS) optionByValue.set(option.value, option);
	for (const option of resolveProviderChoiceOptions({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	})) optionByValue.set(option.value, option);
	const detectedProviders = new Set([...params.detectedProviderIds ?? []].map(normalizeProviderId));
	const options = Array.from(optionByValue.values()).toSorted(compareOptionLabels).filter((option) => option.assistantVisibility !== "detected-only" || option.providerId !== void 0 && detectedProviders.has(normalizeProviderId(option.providerId))).filter((option) => params.assistantVisibleOnly ? option.assistantVisibility !== "manual-only" : true);
	if (params.includeSkip) options.push({
		value: "skip",
		label: "Skip for now"
	});
	return options;
}
/** Build grouped auth choices, filtering manual-only methods by default. */
function buildAuthChoiceGroups(params) {
	const options = buildAuthChoiceOptions({
		...params,
		includeSkip: false,
		assistantVisibleOnly: params.assistantVisibleOnly ?? true
	});
	const groupsById = /* @__PURE__ */ new Map();
	for (const option of options) {
		if (!option.groupId || !option.groupLabel) continue;
		const existing = groupsById.get(option.groupId);
		if (existing) {
			existing.options.push(option);
			if (option.providerId) existing.providerIds = uniqueStrings([...existing.providerIds ?? [], option.providerId]);
			continue;
		}
		const providerIds = option.providerId ? [option.providerId] : [];
		groupsById.set(option.groupId, {
			value: option.groupId,
			label: option.groupLabel,
			...option.groupHint ? { hint: option.groupHint } : {},
			...providerIds.length > 0 ? { providerIds } : {},
			options: [option]
		});
	}
	return {
		groups: Array.from(groupsById.values()).map((group) => {
			group.options = group.options.toSorted(compareAssistantOptions);
			return group;
		}).toSorted(compareAuthChoiceGroups),
		skipOption: params.includeSkip ? {
			value: "skip",
			label: "Skip for now"
		} : void 0
	};
}
//#endregion
export { GENERIC_PROVIDER_AUTH_CHOICES as a, isFeaturedAuthChoiceGroup as i, compareAuthChoiceGroups as n, formatAuthChoiceChoicesForCli as r, buildAuthChoiceGroups as t };
