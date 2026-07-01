import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/plugin-sdk/approval-approvers.ts
/**
* Public SDK helper for deriving normalized approval approver ids.
*/
function dedupeDefined(values) {
	return uniqueStrings(values.filter((value) => Boolean(value)));
}
/** Resolves explicit approvers first, then allow-from/default fallbacks with dedupe. */
function resolveApprovalApprovers(params) {
	const explicit = dedupeDefined((params.explicit ?? []).map((entry) => params.normalizeApprover(entry)));
	if (explicit.length > 0) return explicit;
	return dedupeDefined([
		...(params.allowFrom ?? []).map((entry) => params.normalizeApprover(entry)),
		...(params.extraAllowFrom ?? []).map((entry) => params.normalizeApprover(entry)),
		...params.defaultTo?.trim() ? [(params.normalizeDefaultTo ?? ((value) => params.normalizeApprover(value)))(params.defaultTo.trim())] : []
	]);
}
//#endregion
export { resolveApprovalApprovers as t };
