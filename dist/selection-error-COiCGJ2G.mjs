import { t as FailoverError } from "./error-ON38hPhx.mjs";
//#region src/agents/auth-profiles/selection-error.ts
/** Keeps missing explicit credentials actionable across model and auth preparation. */
function createSelectedAuthProfileUnavailableError(params) {
	return new FailoverError(`Selected auth profile "${params.profileId}" is unavailable.`, {
		reason: "auth",
		code: "selected_auth_profile_unavailable",
		provider: params.provider,
		model: params.modelId,
		profileId: params.profileId
	});
}
//#endregion
export { createSelectedAuthProfileUnavailableError as t };
