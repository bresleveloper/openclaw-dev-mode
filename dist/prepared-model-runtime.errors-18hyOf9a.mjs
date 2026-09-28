//#region src/agents/prepared-model-runtime.errors.ts
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {};
var PreparedModelRuntimePublicationSupersededError = class extends PreparedModelRuntimeOwnerNotPublishedError {};
function assertPreparedModelRuntimeInputCurrent(input, isCurrent) {
	if (isCurrent && !isCurrent()) throw new PreparedModelRuntimePublicationSupersededError(`prepared model runtime publication was superseded for ${input.agentDir}`);
}
function assertPreparedModelRuntimeCandidatesCurrent(candidates) {
	for (const candidate of candidates) assertPreparedModelRuntimeInputCurrent(candidate.input, candidate.isBuildCurrent);
}
//#endregion
export { assertPreparedModelRuntimeInputCurrent as i, PreparedModelRuntimePublicationSupersededError as n, assertPreparedModelRuntimeCandidatesCurrent as r, PreparedModelRuntimeOwnerNotPublishedError as t };
