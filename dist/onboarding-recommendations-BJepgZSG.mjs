import { c as resolveWorkspaceStateIdentity } from "./workspace-state-identity-hZ7UINpz.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as prepareOnboardingRecommendationOffer, r as prepareOnboardingRecommendationPending, t as ONBOARDING_RECOMMENDATIONS_STATE_KEY_PREFIX } from "./onboarding-recommendations.contract.js";
//#region src/state/onboarding-recommendations.ts
function createOnboardingRecommendationsStore(params) {
	const { workspaceKey } = resolveWorkspaceStateIdentity(params.workspaceDir);
	const configKey = `${ONBOARDING_RECOMMENDATIONS_STATE_KEY_PREFIX}${workspaceKey}`;
	const database = params.database ?? {};
	return {
		read: async () => {
			const result = await executeExistingOpenClawStateRead(database, {
				type: "onboardingRecommendations.read",
				configKey
			});
			if (result === void 0) return null;
			return result.record;
		},
		writeOffer: (offer) => {
			const captured = prepareOnboardingRecommendationOffer(offer);
			const context = captureOpenClawStateWorkerContext(database);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.writeOffer",
				input: {
					workspaceKey,
					params: captured
				}
			});
		},
		acknowledge: (options = {}) => {
			const context = captureOpenClawStateWorkerContext(database);
			const captured = structuredClone({
				...options,
				nowMs: options.nowMs ?? Date.now()
			});
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.acknowledge",
				input: {
					workspaceKey,
					params: captured
				}
			});
		},
		updatePending: (options) => {
			const captured = prepareOnboardingRecommendationPending(options);
			const context = captureOpenClawStateWorkerContext(database);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.updatePending",
				input: {
					workspaceKey,
					params: captured
				}
			});
		},
		clearPending: (options) => {
			const context = captureOpenClawStateWorkerContext(database);
			const captured = structuredClone(options);
			return executeOpenClawStateWorker(context, {
				type: "onboardingRecommendations.clearPending",
				input: {
					workspaceKey,
					params: captured
				}
			});
		},
		clear: () => {
			return executeOpenClawStateWorker(captureOpenClawStateWorkerContext(database), {
				type: "onboardingRecommendations.clear",
				input: { workspaceKey }
			});
		}
	};
}
//#endregion
export { createOnboardingRecommendationsStore as t };
