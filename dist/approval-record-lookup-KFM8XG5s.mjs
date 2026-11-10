import { l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as APPROVALS_SCOPE } from "./operator-scopes-BO7_XQCg.mjs";
import "./method-scopes-Bcx3NDQr.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { o as operatorSessionCap } from "./operator-role-policy-Coro3qc5.mjs";
import { a as resolveSessionStoreIdentity } from "./session-store-key-DKpto8R6.mjs";
import { t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
//#region src/gateway/server-methods/approval-record-lookup.ts
const APPROVAL_NOT_FOUND_DETAILS = {
	reason: ErrorCodes.APPROVAL_NOT_FOUND,
	remediation: "Re-request the action; pending approvals are cleared after expiry or restart."
};
function canAccessApprovalSession(params) {
	if (operatorSessionCap(params.client, params.cfg) !== "none") return true;
	const visibilityFilter = params.prepared ? params.prepared.sharing.entryFilter : createSessionListEntryFilter({
		client: params.client,
		cfg: params.cfg
	});
	if (!visibilityFilter) return true;
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	const agentId = normalizeOptionalString(params.agentId);
	const target = params.prepared ? params.prepared.target(sessionKey, agentId) : params.readTarget?.(sessionKey, agentId);
	return Boolean(target && visibilityFilter(target.storeKey, target.entry));
}
/** Retain receipt-updated sharing facts while approval I/O yields. */
async function prepareApprovalSessionAccess(params) {
	const reads = /* @__PURE__ */ new Map();
	const sourceKey = (sessionKey, agentId) => JSON.stringify([sessionKey, agentId ?? null]);
	const release = () => {
		for (const read of reads.values()) read.release();
	};
	try {
		const cfg = params.getCfg?.() ?? params.cfg;
		if (cfg && operatorSessionCap(params.client, cfg) === "none") for (const source of params.sources) {
			const sessionKey = normalizeOptionalString(source.sessionKey);
			const requestedAgentId = normalizeOptionalString(source.agentId);
			if (!sessionKey || reads.has(sourceKey(sessionKey, requestedAgentId))) continue;
			const { agentId } = resolveSessionStoreIdentity({
				cfg,
				sessionKey,
				agentId: requestedAgentId
			});
			reads.set(sourceKey(sessionKey, requestedAgentId), await prepareSessionMutationFacts({
				cfg,
				sessionKey,
				agentId,
				allowMissing: true
			}));
		}
		return {
			canAccess: (source) => {
				const currentCfg = params.getCfg?.() ?? params.cfg;
				return !currentCfg || canAccessApprovalSession({
					cfg: currentCfg,
					client: params.client,
					...source,
					readTarget: (sessionKey, agentId) => reads.get(sourceKey(sessionKey, agentId))?.readCurrent(currentCfg).target ?? null
				});
			},
			[Symbol.dispose]: release
		};
	} catch (error) {
		release();
		throw error;
	}
}
/** Payloads are kind-specific; every approval kind carries its source session in the same fields. */
function readApprovalRequestSource(record) {
	const source = isRecord(record.request) ? record.request : void 0;
	return {
		sessionKey: normalizeOptionalString(source?.sessionKey),
		agentId: normalizeOptionalString(source?.agentId)
	};
}
function isApprovalRecordVisibleToClient(params) {
	const scopes = Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : [];
	if (scopes.includes("operator.admin")) return true;
	if (params.cfg && !(params.sessionAccess?.canAccess(readApprovalRequestSource(params.record)) ?? canAccessApprovalSession({
		cfg: params.cfg,
		client: params.client,
		...readApprovalRequestSource(params.record),
		prepared: params.prepared
	}))) return false;
	const requestedByDeviceId = normalizeNullableString(params.record.requestedByDeviceId);
	const requestedByClientId = normalizeNullableString(params.record.requestedByClientId);
	const hasApprovalsScope = scopes.includes(APPROVALS_SCOPE);
	if (hasApprovalsScope && params.client?.internal?.approvalRuntime === true) return true;
	const approvalReviewerDeviceIds = normalizeUniqueTrimmedStringList(params.record.approvalReviewerDeviceIds);
	const clientDeviceId = normalizeNullableString(params.client?.connect?.device?.id);
	if (hasApprovalsScope && clientDeviceId && approvalReviewerDeviceIds.includes(clientDeviceId)) return true;
	if (requestedByDeviceId) return requestedByDeviceId === clientDeviceId;
	const requestedByConnId = normalizeNullableString(params.record.requestedByConnId);
	if (requestedByConnId) return requestedByConnId === normalizeNullableString(params.client?.connId);
	return !requestedByClientId && approvalReviewerDeviceIds.length === 0;
}
async function listVisiblePendingApprovalRequests(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const records = await params.manager.listPendingRecords(params.authority);
		params.authority?.assertCurrent();
		const sessionAccess = _usingCtx$1.u(await prepareApprovalSessionAccess({
			...params,
			client: params.client ?? null,
			sources: records.map(readApprovalRequestSource)
		}));
		params.authority?.assertCurrent();
		const cfg = params.getCfg?.() ?? params.cfg;
		return records.filter((record) => !params.client?.invalidated && isApprovalRecordVisibleToClient({
			record,
			client: params.client ?? null,
			...cfg ? { cfg } : {},
			sessionAccess
		})).map(({ id, request, createdAtMs, expiresAtMs }) => {
			const approval = {
				id,
				request,
				createdAtMs,
				expiresAtMs
			};
			return params.approvalKind ? Object.assign(approval, { approvalKind: params.approvalKind }) : approval;
		});
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function resolveApprovalRecordForState(params, expectedState) {
	try {
		var _usingCtx3 = _usingCtx();
		await params.manager.listPendingRecords(params.authority);
		params.authority?.assertCurrent();
		const candidates = [];
		params.manager.lookupLocalApprovalId(params.inputId, {
			includeResolved: expectedState === "resolved",
			filter: (record) => {
				candidates.push(record);
				return true;
			}
		});
		const sessionAccess = _usingCtx3.u(await prepareApprovalSessionAccess({
			...params,
			client: params.client ?? null,
			sources: candidates.map(readApprovalRequestSource)
		}));
		params.authority?.assertCurrent();
		const visible = async (record) => {
			const cfg = params.getCfg?.() ?? params.cfg;
			return !params.client?.invalidated && isApprovalRecordVisibleToClient({
				record,
				client: params.client ?? null,
				...cfg ? { cfg } : {},
				sessionAccess
			}) && (await params.recordFilter?.(record) ?? true);
		};
		const resolvedId = await params.manager.lookupApprovalId(params.inputId, {
			includeResolved: expectedState === "resolved",
			filter: visible,
			authority: params.authority
		});
		params.authority?.assertCurrent();
		if (resolvedId.kind !== "exact" && resolvedId.kind !== "prefix") return {
			ok: false,
			response: resolvedId.kind === "none" || !params.exposeAmbiguousPrefixError ? "missing" : {
				code: ErrorCodes.INVALID_REQUEST,
				message: "ambiguous approval id prefix; use the full id"
			}
		};
		const snapshot = await params.manager.getSnapshot(resolvedId.id, params.authority);
		params.authority?.assertCurrent();
		const isResolved = snapshot?.resolvedAtMs !== void 0;
		if (!snapshot || isResolved !== (expectedState === "resolved") || !await visible(snapshot)) return {
			ok: false,
			response: "missing"
		};
		params.authority?.bindSource(readApprovalRequestSource(snapshot));
		return {
			ok: true,
			approvalId: resolvedId.id,
			snapshot
		};
	} catch (_) {
		_usingCtx3.e = _;
	} finally {
		_usingCtx3.d();
	}
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
export { readApprovalRequestSource as a, respondPendingApprovalLookupError as c, prepareApprovalSessionAccess as i, respondUnknownOrExpiredApproval as l, isApprovalRecordVisibleToClient as n, resolvePendingApprovalRecord as o, listVisiblePendingApprovalRequests as r, resolveResolvedApprovalRecord as s, canAccessApprovalSession as t };
