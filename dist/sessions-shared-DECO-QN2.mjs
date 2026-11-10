import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { t as resolveWorkerPlacementCapabilities } from "./placement-capabilities-B7Dg_n0B.mjs";
import { d as resolveWorkerPlacementArchiveRestoreError } from "./session-placement-lifecycle-CAT_zN-p.mjs";
import { t as prepareWorkerPlacementSessionRuntime } from "./placement-session-runtime-preparation-DFaRx79O.mjs";
import "./session-log-BKA9lku6.mjs";
//#region src/gateway/server-methods/sessions-shared.ts
/** Prepare placement and inherited model facts; commit validation consumes their current owners. */
async function prepareSessionWorkerPlacementPatchValidation(params) {
	const validatesRuntime = params.validateModelRuntime && (params.patch.model !== void 0 || params.patch.agentRuntime !== void 0 || params.patch.nativeRuntimeConsent !== void 0);
	if (params.patch.archived !== false && !("permissionMode" in params.patch) && !validatesRuntime) return {
		validate: () => void 0,
		release() {}
	};
	const entry = params.entry;
	const placement = entry?.sessionId ? await params.context.workerSessionPlacementService?.prepareSessionPlacement?.(entry.sessionId) : void 0;
	try {
		const currentPlacement = placement?.current();
		const runtime = currentPlacement && currentPlacement.state !== "local" && entry?.sessionId && validatesRuntime ? await prepareWorkerPlacementSessionRuntime({
			cfg: params.cfg,
			entry,
			agentId: params.agentId,
			sessionKey: params.sessionKey
		}) : void 0;
		return {
			validate: () => resolveSessionWorkerPlacementPatchError(params, {
				placement: placement?.current(),
				readRuntime: runtime && entry ? () => resolveWorkerPlacementCapabilities(runtime(params.cfg, entry)) : void 0
			}),
			release: () => {
				placement?.release();
			}
		};
	} catch (error) {
		placement?.release();
		throw error;
	}
}
function resolveSessionWorkerPlacementPatchError(params, prepared) {
	const placement = prepared.placement;
	if (!placement || placement.state === "local") return;
	if ("permissionMode" in params.patch && placement.executionMode === "worker-turn" && placement.turnClaim) return "This remote worker cannot apply permissions while active. Stop the worker run, then change permissions.";
	if (params.patch.archived === false) {
		const restoreError = resolveWorkerPlacementArchiveRestoreError({
			context: params.context,
			key: params.key,
			placement
		});
		if (restoreError) return restoreError;
	}
	if (!params.validateModelRuntime || params.patch.model === void 0 && params.patch.agentRuntime === void 0 && params.patch.nativeRuntimeConsent === void 0 || !params.entry?.sessionId) return;
	const runtime = prepared.readRuntime?.();
	if (!runtime) throw new Error("Session worker placement runtime validation was not prepared");
	const { executionMode } = runtime;
	if (executionMode === placement.executionMode) return;
	return executionMode ? `Session ${params.key} cannot change cloud placement execution mode while placement is ${placement.state}.` : `Session ${params.key} cannot select a runtime without cloud placement support while cloud worker placement is ${placement.state}.`;
}
function requireSessionKey(key, respond) {
	const normalized = normalizeOptionalString(typeof key === "string" || typeof key === "number" || typeof key === "bigint" ? String(key) : void 0);
	if (!normalized) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
		return null;
	}
	return normalized;
}
function emitSessionOperation(context, payload) {
	const connIds = context.getSessionEventSubscriberConnIds();
	if (connIds.size === 0) return;
	context.broadcastToConnIds("session.operation", {
		...payload,
		ts: Date.now()
	}, connIds, { dropIfSlow: true });
}
function isWorkerDispatchInputError(error) {
	if (typeof error !== "object" || error === null || !("code" in error)) return false;
	const code = error.code;
	return code === "invalid_profile" || code === "profile_not_found" || code === "invalid_state";
}
function isAgentMainSessionKey(cfg, sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return false;
	return sessionKey === resolveAgentMainSessionKey({
		cfg,
		agentId: parsed.agentId
	});
}
function resolveProtectedSessionVisibilityError(cfg, canonicalKey, action) {
	if (canonicalKey === "unknown") return errorShape(ErrorCodes.INVALID_REQUEST, `Cannot ${action} the unknown session sentinel.`);
	if (canonicalKey === "global" || isAgentMainSessionKey(cfg, canonicalKey)) return errorShape(ErrorCodes.INVALID_REQUEST, `Cannot ${action} an agent's main session.`);
}
//#endregion
export { requireSessionKey as a, prepareSessionWorkerPlacementPatchValidation as i, isAgentMainSessionKey as n, resolveProtectedSessionVisibilityError as o, isWorkerDispatchInputError as r, emitSessionOperation as t };
