import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as APPROVALS_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { o as operatorSessionCap } from "./operator-role-policy-BNrKHiJ3.mjs";
import { E as createSessionListEntryFilter, K as resolveSessionSharingTarget } from "./session-sharing-C4w_but1.mjs";
//#region src/gateway/server-methods/approval-record-lookup.ts
const APPROVAL_NOT_FOUND_DETAILS = {
	reason: ErrorCodes.APPROVAL_NOT_FOUND,
	remediation: "Re-request the action; pending approvals are cleared after expiry or restart."
};
function normalizeApprovalIdentity(value) {
	return normalizeOptionalString(value) ?? null;
}
function normalizeApprovalIdentities(values) {
	const normalized = /* @__PURE__ */ new Set();
	for (const value of values ?? []) {
		const identity = normalizeApprovalIdentity(value);
		if (identity) normalized.add(identity);
	}
	return [...normalized];
}
function canAccessApprovalSession(params) {
	if (operatorSessionCap(params.client, params.cfg) !== "none") return true;
	const visibilityFilter = createSessionListEntryFilter({
		client: params.client,
		cfg: params.cfg
	});
	if (!visibilityFilter) return true;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	const agentId = normalizeOptionalString(params.agentId);
	const target = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey,
		...agentId ? { agentId } : {}
	});
	return Boolean(target && visibilityFilter(target.storeKey, target.entry));
}
function isApprovalRecordVisibleToClient(params) {
	const scopes = Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : [];
	if (scopes.includes("operator.admin")) return true;
	if (params.cfg) {
		const source = isRecord(params.record.request) ? params.record.request : void 0;
		if (!canAccessApprovalSession({
			cfg: params.cfg,
			client: params.client,
			sessionKey: normalizeOptionalString(source?.sessionKey),
			agentId: normalizeOptionalString(source?.agentId)
		})) return false;
	}
	const requestedByDeviceId = normalizeApprovalIdentity(params.record.requestedByDeviceId);
	const requestedByClientId = normalizeApprovalIdentity(params.record.requestedByClientId);
	const hasApprovalsScope = scopes.includes(APPROVALS_SCOPE);
	if (hasApprovalsScope && params.client?.internal?.approvalRuntime === true) return true;
	const approvalReviewerDeviceIds = normalizeApprovalIdentities(params.record.approvalReviewerDeviceIds);
	const clientDeviceId = normalizeApprovalIdentity(params.client?.connect?.device?.id);
	if (hasApprovalsScope && clientDeviceId && approvalReviewerDeviceIds.includes(clientDeviceId)) return true;
	if (requestedByDeviceId) return requestedByDeviceId === clientDeviceId;
	const requestedByConnId = normalizeApprovalIdentity(params.record.requestedByConnId);
	if (requestedByConnId) return requestedByConnId === normalizeApprovalIdentity(params.client?.connId);
	if (requestedByClientId || approvalReviewerDeviceIds.length > 0) return false;
	return true;
}
async function listVisiblePendingApprovalRequests(params) {
	const records = await params.manager.listPendingRecords();
	const cfg = params.getCfg?.() ?? params.cfg;
	return records.filter((record) => !params.client?.invalidated && isApprovalRecordVisibleToClient({
		record,
		client: params.client ?? null,
		...cfg ? { cfg } : {}
	})).map(({ id, request, createdAtMs, expiresAtMs }) => {
		const approval = {
			id,
			request,
			createdAtMs,
			expiresAtMs
		};
		return params.approvalKind ? Object.assign(approval, { approvalKind: params.approvalKind }) : approval;
	});
}
function resolveLookupError(params) {
	if (params.resolvedId.kind === "none" || params.resolvedId.kind === "ambiguous" && !params.exposeAmbiguousPrefixError) return "missing";
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "ambiguous approval id prefix; use the full id"
	};
}
async function resolveApprovalRecordForState(params, expectedState) {
	const visible = (record) => {
		const cfg = params.getCfg?.() ?? params.cfg;
		return !params.client?.invalidated && isApprovalRecordVisibleToClient({
			record,
			client: params.client ?? null,
			...cfg ? { cfg } : {}
		}) && (params.recordFilter?.(record) ?? true);
	};
	const resolvedId = await params.manager.lookupApprovalId(params.inputId, {
		includeResolved: expectedState === "resolved",
		filter: visible
	});
	if (resolvedId.kind !== "exact" && resolvedId.kind !== "prefix") return {
		ok: false,
		response: resolveLookupError({
			...params,
			resolvedId
		})
	};
	const snapshot = await params.manager.getSnapshot(resolvedId.id);
	const isResolved = snapshot?.resolvedAtMs !== void 0;
	return !snapshot || isResolved !== (expectedState === "resolved") || !visible(snapshot) ? {
		ok: false,
		response: "missing"
	} : {
		ok: true,
		approvalId: resolvedId.id,
		snapshot
	};
}
function resolvePendingApprovalRecord(params) {
	return resolveApprovalRecordForState(params, "pending");
}
function resolveResolvedApprovalRecord(params) {
	return resolveApprovalRecordForState(params, "resolved");
}
function respondUnknownOrExpiredApproval(respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown or expired approval id", { details: APPROVAL_NOT_FOUND_DETAILS }));
}
function respondPendingApprovalLookupError(params) {
	if (params.response === "missing") {
		respondUnknownOrExpiredApproval(params.respond);
		return;
	}
	params.respond(false, void 0, errorShape(params.response.code, params.response.message));
}
//#endregion
export { resolvePendingApprovalRecord as a, respondUnknownOrExpiredApproval as c, normalizeApprovalIdentities as i, isApprovalRecordVisibleToClient as n, resolveResolvedApprovalRecord as o, listVisiblePendingApprovalRequests as r, respondPendingApprovalLookupError as s, canAccessApprovalSession as t };
