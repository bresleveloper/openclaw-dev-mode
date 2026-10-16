import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
//#region packages/acp-core/src/runtime/session-identity.ts
/** Normalize an identity object and infer pending/resolved state from stable ids. */
function normalizeIdentity(identity) {
	if (!identity) return;
	const state = identity.state === "pending" || identity.state === "resolved" ? identity.state : void 0;
	const source = identity.source === "ensure" || identity.source === "status" || identity.source === "event" ? identity.source : void 0;
	const acpxRecordId = normalizeOptionalString(identity.acpxRecordId);
	const acpxSessionId = normalizeOptionalString(identity.acpxSessionId);
	const agentSessionId = normalizeOptionalString(identity.agentSessionId);
	const lastUpdatedAt = asFiniteNumber(identity.lastUpdatedAt);
	if (!state && !source && !Boolean(acpxRecordId || acpxSessionId || agentSessionId) && lastUpdatedAt === void 0) return;
	return {
		state: state ?? (Boolean(acpxSessionId || agentSessionId) ? "resolved" : "pending"),
		...acpxRecordId ? { acpxRecordId } : {},
		...acpxSessionId ? { acpxSessionId } : {},
		...agentSessionId ? { agentSessionId } : {},
		source: source ?? "status",
		lastUpdatedAt: lastUpdatedAt ?? Date.now()
	};
}
function readIdentityIdsFromHandle(handle) {
	return {
		acpxRecordId: normalizeOptionalString(handle.acpxRecordId),
		acpxSessionId: normalizeOptionalString(handle.backendSessionId),
		agentSessionId: normalizeOptionalString(handle.agentSessionId)
	};
}
/** Build an identity only when at least one stable id is known. */
function buildSessionIdentity(params) {
	const { acpxRecordId, acpxSessionId, agentSessionId } = params.ids;
	if (!acpxRecordId && !acpxSessionId && !agentSessionId) return;
	return {
		state: params.state,
		...acpxRecordId ? { acpxRecordId } : {},
		...acpxSessionId ? { acpxSessionId } : {},
		...agentSessionId ? { agentSessionId } : {},
		source: params.source,
		lastUpdatedAt: params.now
	};
}
/** Resolve normalized ACP identity from persisted session metadata. */
function resolveSessionIdentityFromMeta(meta) {
	return normalizeIdentity(meta?.identity);
}
/** Return true when an identity has a backend or agent session id. */
function identityHasStableSessionId(identity) {
	return Boolean(identity?.acpxSessionId || identity?.agentSessionId);
}
/** Resolve the runtime resume id, preferring agent session id over ACP backend id. */
function resolveRuntimeResumeSessionId(identity) {
	return normalizeOptionalString(identity?.agentSessionId) ?? normalizeOptionalString(identity?.acpxSessionId);
}
/** Return true when identity is absent or still pending. */
function isSessionIdentityPending(identity) {
	return !identity || identity.state === "pending";
}
/** Compare identities ignoring lastUpdatedAt timestamp churn. */
function identityEquals(left, right) {
	const a = normalizeIdentity(left);
	const b = normalizeIdentity(right);
	if (!a && !b) return true;
	if (!a || !b) return false;
	return a.state === b.state && a.acpxRecordId === b.acpxRecordId && a.acpxSessionId === b.acpxSessionId && a.agentSessionId === b.agentSessionId && a.source === b.source;
}
/** Merge current and incoming identity observations without downgrading resolved ids. */
function mergeSessionIdentity(params) {
	const current = normalizeIdentity(params.current);
	const incoming = normalizeIdentity(params.incoming);
	if (!current) {
		if (!incoming) return;
		return {
			...incoming,
			lastUpdatedAt: params.now
		};
	}
	if (!incoming) return current;
	const currentResolved = current.state === "resolved";
	const incomingResolved = incoming.state === "resolved";
	const allowIncomingValue = !currentResolved || incomingResolved;
	const nextRecordId = allowIncomingValue && incoming.acpxRecordId ? incoming.acpxRecordId : current.acpxRecordId;
	const nextAcpxSessionId = allowIncomingValue && incoming.acpxSessionId ? incoming.acpxSessionId : current.acpxSessionId;
	const nextAgentSessionId = allowIncomingValue && incoming.agentSessionId ? incoming.agentSessionId : current.agentSessionId;
	const nextState = Boolean(nextAcpxSessionId || nextAgentSessionId) || currentResolved ? "resolved" : incoming.state;
	const nextSource = allowIncomingValue ? incoming.source : current.source;
	return {
		state: nextState,
		...nextRecordId ? { acpxRecordId: nextRecordId } : {},
		...nextAcpxSessionId ? { acpxSessionId: nextAcpxSessionId } : {},
		...nextAgentSessionId ? { agentSessionId: nextAgentSessionId } : {},
		source: nextSource,
		lastUpdatedAt: params.now
	};
}
/** Create a pending identity from an ensure-session handle. */
function createIdentityFromEnsure(params) {
	return buildSessionIdentity({
		ids: readIdentityIdsFromHandle(params.handle),
		state: "pending",
		source: "ensure",
		now: params.now
	});
}
/** Create an identity from a runtime event handle. */
function createIdentityFromHandleEvent(params) {
	const ids = readIdentityIdsFromHandle(params.handle);
	return buildSessionIdentity({
		ids,
		state: ids.agentSessionId ? "resolved" : "pending",
		source: "event",
		now: params.now
	});
}
/** Create an identity from runtime status output. */
function createIdentityFromStatus(params) {
	if (!params.status) return;
	const details = params.status.details;
	const acpxRecordId = normalizeOptionalString(params.status.acpxRecordId) ?? normalizeOptionalString(details?.acpxRecordId);
	const acpxSessionId = normalizeOptionalString(params.status.backendSessionId) ?? normalizeOptionalString(details?.backendSessionId) ?? normalizeOptionalString(details?.acpxSessionId);
	const agentSessionId = normalizeOptionalString(params.status.agentSessionId) ?? normalizeOptionalString(details?.agentSessionId);
	return buildSessionIdentity({
		ids: {
			acpxRecordId,
			acpxSessionId,
			agentSessionId
		},
		state: acpxSessionId || agentSessionId ? "resolved" : "pending",
		source: "status",
		now: params.now
	});
}
/** Convert ACP identity ids into runtime handle resume identifiers. */
function resolveRuntimeHandleIdentifiersFromIdentity(identity) {
	if (!identity) return {};
	return {
		...identity.acpxSessionId ? { backendSessionId: identity.acpxSessionId } : {},
		...identity.agentSessionId ? { agentSessionId: identity.agentSessionId } : {}
	};
}
//#endregion
export { identityHasStableSessionId as a, resolveRuntimeHandleIdentifiersFromIdentity as c, identityEquals as i, resolveRuntimeResumeSessionId as l, createIdentityFromHandleEvent as n, isSessionIdentityPending as o, createIdentityFromStatus as r, mergeSessionIdentity as s, createIdentityFromEnsure as t, resolveSessionIdentityFromMeta as u };
