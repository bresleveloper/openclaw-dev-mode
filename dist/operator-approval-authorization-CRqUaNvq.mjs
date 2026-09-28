import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { t as matchesOperatorApprovalReviewerBinding } from "./operator-approval-reviewer-binding-BAnifkBq.mjs";
//#region src/gateway/operator-approval-authorization.ts
/** Whether a client may inspect safe approval projections. */
function canReviewOperatorApproval(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	if (scopes.includes("operator.admin")) return true;
	if (!scopes.includes("operator.approvals")) return false;
	return Boolean(normalizeOptionalString(client?.connect?.device?.id));
}
/** Whether a client may submit an approval verdict. */
function canResolveOperatorApproval(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	return client?.internal?.approvalRuntime === true && scopes.includes("operator.approvals") || canReviewOperatorApproval(client);
}
/** Whether a broadly authorized client may access one bound approval record. */
function canAccessOperatorApproval(params) {
	if (!(params.allowApprovalRuntime ? canResolveOperatorApproval(params.client) : canReviewOperatorApproval(params.client))) return false;
	if ((Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : []).includes("operator.admin")) return true;
	if (params.allowApprovalRuntime && params.client?.internal?.approvalRuntime === true) return true;
	return matchesOperatorApprovalReviewerBinding(params.binding, params.client?.connect?.device?.id);
}
//#endregion
export { canResolveOperatorApproval as n, canReviewOperatorApproval as r, canAccessOperatorApproval as t };
