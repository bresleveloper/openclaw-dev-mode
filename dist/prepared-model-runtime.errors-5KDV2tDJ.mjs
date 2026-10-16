import { k as PluginInstanceUnavailableError } from "./plugin-cache-BABafcXD.mjs";
//#region src/agents/prepared-model-runtime.errors.ts
/** Reports unavailable owner facts, distinguishing admission refusal from a missing owner. */
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.admissionBlocked = options?.admissionBlocked === true;
	}
};
/** Only missing owners permit activation or catalog fallback; refused admission must settle work. */
function isPreparedModelRuntimeMissingOwnerError(error) {
	return error instanceof PreparedModelRuntimeOwnerNotPublishedError && !error.admissionBlocked;
}
var PreparedModelRuntimePublicationSupersededError = class extends PreparedModelRuntimeOwnerNotPublishedError {};
var PreparedModelRuntimePluginGenerationRetiredError = class extends Error {};
function isPreparedModelRuntimePluginLifecycleFailure(error) {
	return error instanceof PluginInstanceUnavailableError || error instanceof PreparedModelRuntimePluginGenerationRetiredError || error instanceof PreparedModelRuntimePublicationSupersededError;
}
function assertPreparedModelRuntimeInputCurrent(input, isCurrent) {
	if (isCurrent && !isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
}
function assertPreparedModelRuntimeCandidatesCurrent(candidates) {
	for (const candidate of candidates) assertPreparedModelRuntimeInputCurrent(candidate.input, candidate.isBuildCurrent);
}
//#endregion
export { assertPreparedModelRuntimeInputCurrent as a, assertPreparedModelRuntimeCandidatesCurrent as i, PreparedModelRuntimePluginGenerationRetiredError as n, isPreparedModelRuntimeMissingOwnerError as o, PreparedModelRuntimePublicationSupersededError as r, isPreparedModelRuntimePluginLifecycleFailure as s, PreparedModelRuntimeOwnerNotPublishedError as t };
