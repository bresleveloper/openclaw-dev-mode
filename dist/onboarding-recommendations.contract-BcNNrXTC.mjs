import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
//#region src/state/onboarding-recommendations.contract.ts
const ONBOARDING_RECOMMENDATIONS_STATE_KEY_PREFIX = "onboarding.recommendations.";
const OnboardingRecommendationMatchSchema = object({
	appLabel: string(),
	candidateId: string(),
	tier: _enum(["recommended", "optional"]),
	reason: string(),
	candidate: object({
		id: string(),
		displayName: string(),
		summary: string(),
		source: _enum([
			"official-plugin",
			"official-channel",
			"official-provider",
			"clawhub-skill"
		]),
		downloads: number().optional()
	})
});
const OnboardingRecommendationMatchesSchema = array(OnboardingRecommendationMatchSchema);
function canonicalInventory(inventory) {
	return inventory.map((app) => ({
		label: app.label,
		...app.bundleId ? { bundleId: app.bundleId } : {}
	})).toSorted((left, right) => left.label.localeCompare(right.label, "en", { sensitivity: "base" }) || (left.bundleId ?? "").localeCompare(right.bundleId ?? ""));
}
function prepareOnboardingRecommendationOffer(params) {
	const nowMs = params.nowMs ?? Date.now();
	return {
		inventoryHash: sha256Hex(JSON.stringify(canonicalInventory(params.inventory))),
		matches: OnboardingRecommendationMatchesSchema.parse(params.matches),
		answered: params.answered,
		nowMs
	};
}
function prepareOnboardingRecommendationPending(params) {
	const nowMs = params.nowMs ?? Date.now();
	return {
		matches: OnboardingRecommendationMatchesSchema.parse(params.matches),
		expected: structuredClone(params.expected),
		nowMs
	};
}
//#endregion
export { prepareOnboardingRecommendationOffer as n, prepareOnboardingRecommendationPending as r, ONBOARDING_RECOMMENDATIONS_STATE_KEY_PREFIX as t };
