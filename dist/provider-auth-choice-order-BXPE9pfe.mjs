//#region src/plugins/provider-auth-choice-order.ts
const FEATURED_PROVIDER_AUTH_GROUP_ORDER = /* @__PURE__ */ new Map([
	["openai", 0],
	["openrouter", 1],
	["xai", 2],
	["google", 3],
	["anthropic", 4]
]);
const providerAuthGroupCollator = new Intl.Collator(void 0, { sensitivity: "base" });
/** Keep native and CLI onboarding on one first-tier provider order. */
function isFeaturedProviderAuthChoiceGroup(groupId) {
	return FEATURED_PROVIDER_AUTH_GROUP_ORDER.has(groupId);
}
function compareProviderAuthChoiceGroups(a, b) {
	return (FEATURED_PROVIDER_AUTH_GROUP_ORDER.get(a.id) ?? Number.POSITIVE_INFINITY) - (FEATURED_PROVIDER_AUTH_GROUP_ORDER.get(b.id) ?? Number.POSITIVE_INFINITY) || providerAuthGroupCollator.compare(a.label, b.label) || providerAuthGroupCollator.compare(a.id, b.id);
}
//#endregion
export { isFeaturedProviderAuthChoiceGroup as n, compareProviderAuthChoiceGroups as t };
