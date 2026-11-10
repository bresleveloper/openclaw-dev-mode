import { C as runSessionCollaborationWrite, b as publishSessionCollaborationChanges } from "./session-accessor-Czw4l8kI.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-metadata-write.async.ts
function assignSessionOwnerInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone({
		...params,
		assignedAt: params.assignedAt ?? Date.now()
	});
	return runSessionCollaborationWrite(scope, {
		type: "owner.assign",
		input: {
			scope,
			params: capturedParams
		}
	}, (result, location, database, currentKeys) => {
		if (result.value && (!currentKeys || currentKeys.has(location.sessionKey))) publishSessionCollaborationChanges([result.facts ? {
			...location,
			facts: result.facts
		} : {
			...location,
			factsInvalidated: true
		}], database);
		return result.value;
	}, assertCurrent);
}
function addSessionSuggestionInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone({
		...params,
		id: params.id ?? randomUUID(),
		createdAt: params.createdAt ?? Date.now()
	});
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.add",
		input: {
			scope,
			params: capturedParams
		}
	}, (result) => result, assertCurrent);
}
function claimSessionSuggestionDispatchInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.claim",
		input: {
			scope,
			params: capturedParams
		}
	}, (result) => result, assertCurrent);
}
function releaseSessionSuggestionDispatchInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.release",
		input: {
			scope,
			params: capturedParams
		}
	}, (result) => result, assertCurrent);
}
function finalizeSessionSuggestionClaimInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.finalize",
		input: {
			scope,
			params: capturedParams
		}
	}, (result) => result, assertCurrent);
}
//#endregion
export { releaseSessionSuggestionDispatchInWorker as a, finalizeSessionSuggestionClaimInWorker as i, assignSessionOwnerInWorker as n, claimSessionSuggestionDispatchInWorker as r, addSessionSuggestionInWorker as t };
