import "./config-machine-state-DR7LQrw2.mjs";
import { r as updateConfigMachineState, t as deleteConfigMachineState } from "./config-machine-state-write-pMcF7uIi.mjs";
import "./onboarding-recommendations.contract.js";
//#region src/state/onboarding-recommendations.kernel.ts
function matchesExpectedOnboardingRecommendations(current, expected) {
	return current.inventoryHash === expected.inventoryHash && JSON.stringify(current.matches) === JSON.stringify(expected.matches) && current.offeredAt === expected.offeredAt && current.acceptedAt === expected.acceptedAt && current.updatedAt === expected.updatedAt;
}
function writeOnboardingRecommendationsOffer(configKey, params, databaseOptions) {
	const nowMs = params.nowMs;
	const inventoryHash = params.inventoryHash;
	const matches = params.matches;
	const acceptedAt = params.answered ? nowMs : null;
	return updateConfigMachineState(configKey, (existing) => {
		if (typeof existing?.acceptedAt === "number") return existing;
		return {
			inventoryHash,
			matches,
			offeredAt: nowMs,
			acceptedAt,
			updatedAt: nowMs
		};
	}, databaseOptions);
}
function acknowledgeOnboardingRecommendations(configKey, params, databaseOptions) {
	const nowMs = params.nowMs ?? Date.now();
	let acknowledged = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing) return;
		if (params.expected && !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		acknowledged = typeof existing.acceptedAt === "number" ? existing : {
			...existing,
			acceptedAt: nowMs,
			updatedAt: nowMs
		};
		return acknowledged;
	}, databaseOptions);
	return acknowledged;
}
function updatePendingOnboardingRecommendations(configKey, params, databaseOptions) {
	const nowMs = params.nowMs;
	const matches = params.matches;
	let updated = null;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || typeof existing.acceptedAt === "number" || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		updated = {
			...existing,
			matches,
			updatedAt: nowMs
		};
		return updated;
	}, databaseOptions);
	return updated;
}
function clearPendingOnboardingRecommendations(configKey, params, databaseOptions) {
	let cleared = false;
	updateConfigMachineState(configKey, (existing) => {
		if (!existing || existing.acceptedAt !== null || !matchesExpectedOnboardingRecommendations(existing, params.expected)) return existing;
		cleared = true;
	}, databaseOptions);
	return cleared;
}
function recommendationOperation(operation) {
	return ({ configKey, params }, { open, stateOptions }) => operation(configKey, params, {
		database: open(),
		...stateOptions()
	});
}
const onboardingRecommendationOperations = {
	"onboardingRecommendations.writeOffer": recommendationOperation(writeOnboardingRecommendationsOffer),
	"onboardingRecommendations.acknowledge": recommendationOperation(acknowledgeOnboardingRecommendations),
	"onboardingRecommendations.updatePending": recommendationOperation(updatePendingOnboardingRecommendations),
	"onboardingRecommendations.clearPending": recommendationOperation(clearPendingOnboardingRecommendations),
	"onboardingRecommendations.clear": ({ configKey }, { open, stateOptions }) => deleteConfigMachineState(configKey, {
		database: open(),
		...stateOptions()
	})
};
//#endregion
export { onboardingRecommendationOperations };
