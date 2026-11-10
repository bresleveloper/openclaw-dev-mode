import "./operator-scopes-BO7_XQCg.mjs";
import { n as operatorScopeSatisfied } from "./operator-scope-compat-Ci6GBcmU.mjs";
//#region src/gateway/question-access.ts
function usesOwnRunQuestionAccess(client) {
	return Boolean(client?.connect && !operatorScopeSatisfied("operator.questions", client.connect.scopes ?? []));
}
/** Select the original person before liveness reads; full session authorization still follows. */
function canSelectQuestion(manager, id, client) {
	const decisionAccess = manager.observe(id)?.authorizeClient;
	if (decisionAccess) return decisionAccess(client);
	return !usesOwnRunQuestionAccess(client) || manager.observe(id)?.sessionAccess?.canSelect(client) === true;
}
//#endregion
export { usesOwnRunQuestionAccess as n, canSelectQuestion as t };
