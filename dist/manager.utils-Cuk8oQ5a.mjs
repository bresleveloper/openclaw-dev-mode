import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import "./errors-O33D01XW.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-C09ow4h0.mjs";
import { n as AcpRuntimeError, t as ACP_ERROR_CODES } from "./errors-m4L_1YUz.mjs";
import "./errors-DDGkdHjR.mjs";
import { n as buildAcpDatabaseSessionKey } from "./session-meta-keys-Bj_FyJ-3.mjs";
import { n as resolveSessionStorePathForAcp } from "./session-meta-store-C2kPc7n-.mjs";
//#region src/acp/control-plane/manager.utils.ts
function resolveAcpAgentFromSessionKey(sessionKey, fallback = "main") {
	const parsed = parseAgentSessionKey(sessionKey);
	return normalizeAgentId(parsed?.agentId ?? fallback);
}
function resolveMissingMetaError(sessionKey) {
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP metadata is missing for ${sessionKey}. Recreate this ACP session with /acp spawn and rebind the thread.`);
}
/** Project the selected store result without reopening storage. */
function resolveStoredAcpSession(target, stored) {
	if (stored?.acp) return {
		kind: "ready",
		...target,
		meta: stored.acp,
		entry: stored.entry
	};
	return isAcpSessionKey(target.sessionKey) ? {
		kind: "stale",
		...target,
		error: resolveMissingMetaError(target.sessionKey)
	} : {
		kind: "none",
		...target
	};
}
function resolveAcpSessionResolutionError(resolution) {
	if (resolution.kind === "ready") return null;
	if (resolution.kind === "stale") return resolution.error;
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `Session is not ACP-enabled: ${resolution.sessionKey}`);
}
function requireReadySessionMeta(resolution) {
	if (resolution.kind === "ready") return resolution.meta;
	throw toErrorObject(resolveAcpSessionResolutionError(resolution), "Non-Error thrown");
}
/** Resolve ownership before main aliases can erase the encoded agent namespace. */
function resolveAcpSessionTarget(params) {
	const normalized = normalizeLowercaseStringOrEmpty(params.sessionKey);
	if (!normalized) throw new AcpRuntimeError("ACP_SESSION_INIT_FAILED", "ACP session key is required.");
	const { agentId, storeSessionKey: sessionKey } = resolveSessionStorePathForAcp({
		...params,
		sessionKey: normalized
	});
	return {
		agentId,
		sessionKey
	};
}
/** Components normalize before encoding; base64url itself is case-sensitive. */
function acpSessionActorKey(target) {
	return buildAcpDatabaseSessionKey(normalizeLowercaseStringOrEmpty(target.sessionKey), target.agentId);
}
function normalizeAcpErrorCode(code) {
	if (!code) return "ACP_TURN_FAILED";
	const normalized = code.trim().toUpperCase();
	return ACP_ERROR_CODES.find((allowed) => allowed === normalized) ?? "ACP_TURN_FAILED";
}
function createUnsupportedControlError(params) {
	return new AcpRuntimeError("ACP_BACKEND_UNSUPPORTED_CONTROL", `ACP backend "${params.backend}" does not support ${params.control}.`);
}
function hasLegacyAcpIdentityProjection(meta) {
	const raw = meta;
	return Object.hasOwn(raw, "backendSessionId") || Object.hasOwn(raw, "agentSessionId") || Object.hasOwn(raw, "sessionIdsProvisional");
}
const SESSION_ACTOR_SUPERSEDED_DETAIL_CODE = "SESSION_ACTOR_SUPERSEDED";
function createSupersededActorError(sessionKey) {
	return new AcpRuntimeError("ACP_SESSION_INIT_FAILED", `ACP session actor was superseded during runtime initialization for ${sessionKey}.`, { detailCode: SESSION_ACTOR_SUPERSEDED_DETAIL_CODE });
}
function isSupersededActorError(error) {
	return error instanceof AcpRuntimeError && error.detailCode === SESSION_ACTOR_SUPERSEDED_DETAIL_CODE;
}
function assertCurrentAcpActor(current, sessionKey) {
	if (!current) throw createSupersededActorError(sessionKey);
}
//#endregion
export { hasLegacyAcpIdentityProjection as a, requireReadySessionMeta as c, resolveAcpSessionTarget as d, resolveStoredAcpSession as f, createUnsupportedControlError as i, resolveAcpAgentFromSessionKey as l, assertCurrentAcpActor as n, isSupersededActorError as o, createSupersededActorError as r, normalizeAcpErrorCode as s, acpSessionActorKey as t, resolveAcpSessionResolutionError as u };
