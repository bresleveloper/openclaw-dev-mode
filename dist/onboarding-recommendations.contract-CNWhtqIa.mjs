import { Et as _enum, Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
//#region src/state/onboarding-recommendations.contract.ts
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
function hashOnboardingRecommendationInventory(inventory) {
	return sha256Hex(JSON.stringify(canonicalInventory(inventory)));
}
function prepareOnboardingRecommendationOffer(params) {
	const nowMs = params.nowMs ?? Date.now();
	return {
		inventoryHash: hashOnboardingRecommendationInventory(params.inventory),
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
function isOnboardingRecommendationWriteCommand(command) {
	switch (command.type) {
		case "onboardingRecommendations.writeOffer":
		case "onboardingRecommendations.acknowledge":
		case "onboardingRecommendations.updatePending":
		case "onboardingRecommendations.clearPending":
		case "onboardingRecommendations.clear": return true;
		default: return false;
	}
}
//#endregion
export { prepareOnboardingRecommendationOffer as n, prepareOnboardingRecommendationPending as r, isOnboardingRecommendationWriteCommand as t };
