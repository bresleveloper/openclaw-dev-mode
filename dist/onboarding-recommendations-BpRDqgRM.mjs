import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-CmGr5k4K.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as executeOpenClawStateWorker } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as prepareOnboardingRecommendationOffer, r as prepareOnboardingRecommendationPending } from "./onboarding-recommendations.contract.js";
//#region src/state/onboarding-recommendations.ts
function createOnboardingRecommendationsStore(params) {
	const configKey = `onboarding.recommendations.${resolveWorkspaceStateIdentity(params.workspaceDir).workspaceKey}`;
	const database = params.database ?? {};
	return {
		async read() {
			const result = await executeExistingOpenClawStateRead(database, {
				type: "onboardingRecommendations.read",
				configKey
			});
			if (result === void 0) return null;
			if (result.ok && result.type === "onboardingRecommendations.read") return result.record;
			throw new Error("Unexpected onboarding recommendations read result");
		},
		writeOffer(offer) {
			const captured = prepareOnboardingRecommendationOffer(offer);
			const context = captureOpenClawStateWorkerContext(database);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.writeOffer",
				input: {
					configKey,
					params: captured
				}
			});
		},
		acknowledge(options = {}) {
			const context = captureOpenClawStateWorkerContext(database);
			const captured = structuredClone({
				...options,
				nowMs: options.nowMs ?? Date.now()
			});
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.acknowledge",
				input: {
					configKey,
					params: captured
				}
			});
		},
		updatePending(options) {
			const captured = prepareOnboardingRecommendationPending(options);
			const context = captureOpenClawStateWorkerContext(database);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.updatePending",
				input: {
					configKey,
					params: captured
				}
			});
		},
		clearPending(options) {
			const context = captureOpenClawStateWorkerContext(database);
			const captured = structuredClone(options);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.clearPending",
				input: {
					configKey,
					params: captured
				}
			});
		},
		clear() {
			return executeOpenClawStateWorker(captureOpenClawStateWorkerContext(database), {
				type: "onboardingRecommendations.clear",
				input: { configKey }
			});
		}
	};
}
//#endregion
export { createOnboardingRecommendationsStore as t };
