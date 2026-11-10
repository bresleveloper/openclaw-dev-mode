import { M as PluginInstanceUnavailableError } from "./plugin-cache-BbahpD-b.mjs";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime-admission-errors-DFzPwru3.mjs";
//#region src/agents/prepared-model-runtime.errors.ts
/** The embedded runner refused its initial admission before executing a generation. */
var PreparedModelRuntimeInitialRunAdmissionError = class extends PreparedModelRuntimeOwnerNotPublishedError {
	constructor(error) {
		super(error.message, {
			cause: error,
			admissionBlocked: true
		});
	}
};
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
export { assertPreparedModelRuntimeInputCurrent as a, assertPreparedModelRuntimeCandidatesCurrent as i, PreparedModelRuntimePluginGenerationRetiredError as n, isPreparedModelRuntimeMissingOwnerError as o, PreparedModelRuntimePublicationSupersededError as r, isPreparedModelRuntimePluginLifecycleFailure as s, PreparedModelRuntimeInitialRunAdmissionError as t };
