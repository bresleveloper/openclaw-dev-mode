import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-CPayZwJR.mjs";
import { c as resolveWorkerPlacementArchiveRestoreError } from "./session-placement-lifecycle-D5GPja58.mjs";
import { s as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-CuE1uM7x.mjs";
import { o as resolveWorkerPlacementSessionRuntimeCapabilities } from "./placement-session-runtime-D5yJBcMK.mjs";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DrLraxiU.mjs";
import "./session-utils-N4Q5NAko.mjs";
import "./session-log-BRT6fN7h.mjs";
//#region src/gateway/server-methods/sessions-shared.ts
function resolveSessionWorkerPlacementPatchError(params) {
	const placement = params.entry?.sessionId ? params.context.workerSessionPlacementService?.getMany([params.entry.sessionId]).get(params.entry.sessionId) : void 0;
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
	const { executionMode } = resolveWorkerPlacementSessionRuntimeCapabilities({
		cfg: params.cfg,
		entry: params.entry,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (executionMode === placement.executionMode) return;
	return executionMode ? `Session ${params.key} cannot change cloud placement execution mode while placement is ${placement.state}.` : `Session ${params.key} cannot select a runtime without cloud placement support while cloud worker placement is ${placement.state}.`;
}
const loadSessionsRuntimeModule = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function requireSessionKey(key, respond) {
	const normalized = normalizeOptionalString(typeof key === "string" || typeof key === "number" || typeof key === "bigint" ? String(key) : void 0);
	if (!normalized) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
		return null;
	}
	return normalized;
}
function loadAccessorSessionEntryForGatewayTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		exactRead: true,
		...params.clone === false ? { clone: false } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return {
		target,
		storePath: target.storePath,
		store: target.store,
		entry: isInternalSessionEffectsKey(target.canonicalKey) ? void 0 : resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys),
		canonicalKey: target.canonicalKey,
		sessionStoreKey: target.canonicalKey
	};
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
export { loadSessionsRuntimeModule as a, resolveSessionWorkerPlacementPatchError as c, loadAccessorSessionEntryForGatewayTarget as i, isAgentMainSessionKey as n, requireSessionKey as o, isWorkerDispatchInputError as r, resolveProtectedSessionVisibilityError as s, emitSessionOperation as t };
