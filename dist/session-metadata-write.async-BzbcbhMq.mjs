import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { r as publishSessionEntryCacheInvalidation } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { t as assignSessionOwner } from "./session-accessor.sqlite-owner-ylhcUaWK.mjs";
import { i as releaseSessionSuggestionDispatch, n as claimSessionSuggestionDispatch, r as finalizeSessionSuggestionClaim, t as addSessionSuggestion } from "./session-suggestion-store-Ds6yg9Y3.mjs";
import { T as runSessionCollaborationWrite } from "./session-accessor-CQ-g9yb2.mjs";
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
	}, (capturedScope) => assignSessionOwner(capturedScope, capturedParams), (result, location, database) => {
		if (result.value) {
			if (result.facts) publishSessionEntryCacheInvalidation({
				...database,
				agentId: location.agentId
			}, {
				sessionKey: location.sessionKey,
				facts: result.facts
			});
			else sessionChanges.emit({
				...location,
				factsInvalidated: true
			});
		}
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
	}, (capturedScope) => addSessionSuggestion(capturedScope, capturedParams), (result) => result, assertCurrent);
}
function claimSessionSuggestionDispatchInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.claim",
		input: {
			scope,
			params: capturedParams
		}
	}, (capturedScope) => claimSessionSuggestionDispatch(capturedScope, capturedParams), (result) => result, assertCurrent);
}
function releaseSessionSuggestionDispatchInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.release",
		input: {
			scope,
			params: capturedParams
		}
	}, (capturedScope) => releaseSessionSuggestionDispatch(capturedScope, capturedParams), (result) => result, assertCurrent);
}
function finalizeSessionSuggestionClaimInWorker(scope, params, assertCurrent) {
	const capturedParams = structuredClone(params);
	return runSessionCollaborationWrite(scope, {
		type: "suggestion.finalize",
		input: {
			scope,
			params: capturedParams
		}
	}, (capturedScope) => finalizeSessionSuggestionClaim(capturedScope, capturedParams), (result) => result, assertCurrent);
}
//#endregion
export { releaseSessionSuggestionDispatchInWorker as a, finalizeSessionSuggestionClaimInWorker as i, assignSessionOwnerInWorker as n, claimSessionSuggestionDispatchInWorker as r, addSessionSuggestionInWorker as t };
