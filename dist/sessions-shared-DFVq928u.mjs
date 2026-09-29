import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-De-bcoks.mjs";
import { t as isInternalSessionEffectsKey } from "./internal-session-key-Xwd1VHk2.mjs";
import { c as resolveWorkerPlacementArchiveRestoreError } from "./session-placement-lifecycle-DAKgxrlj.mjs";
import { a as resolveGatewaySessionStoreTarget, o as resolveGatewaySessionStoreTargetWithStore } from "./session-utils-store-lookup-EioWBMfl.mjs";
import { a as resolveWorkerPlacementSessionRuntimeCapabilities } from "./placement-session-runtime-SEjvmv7N.mjs";
import { s as resolveCanonicalSessionEntryFromStoreKeys } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
//#region src/gateway/server-methods/sessions-shared.ts
const sessionLog = createSubsystemLogger("gateway/sessions");
function respondSessionWorkerPlacementMutationError(error, respond) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
}
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
	const normalized = normalizeOptionalString(typeof key === "string" ? key : typeof key === "number" ? String(key) : typeof key === "bigint" ? String(key) : "") ?? "";
	if (!normalized) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
		return null;
	}
	return normalized;
}
function resolveGatewaySessionTargetFromKey(key, cfg, opts) {
	const target = resolveGatewaySessionStoreTarget({
		cfg,
		key,
		...opts?.agentId ? { agentId: opts.agentId } : {}
	});
	return {
		cfg,
		target,
		storePath: target.storePath
	};
}
function loadAccessorSessionEntryForGatewayTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		exactRead: true,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	return {
		target,
		storePath: target.storePath,
		entry: isInternalSessionEffectsKey(target.canonicalKey) ? void 0 : resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys),
		canonicalKey: target.canonicalKey,
		sessionStoreKey: target.canonicalKey
	};
}
function loadSessionEntriesForTarget(params) {
	const target = resolveGatewaySessionStoreTargetWithStore({
		cfg: params.cfg,
		key: params.key,
		clone: false,
		exactRead: true,
		includeStoreChildEntries: params.includeStoreChildEntries,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const store = target.store;
	const entry = isInternalSessionEffectsKey(target.canonicalKey) ? void 0 : resolveCanonicalSessionEntryFromStoreKeys(store, target.storeKeys);
	return {
		target,
		storePath: target.storePath,
		store,
		entry
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
//#endregion
export { loadSessionEntriesForTarget as a, resolveGatewaySessionTargetFromKey as c, sessionLog as d, loadAccessorSessionEntryForGatewayTarget as i, resolveSessionWorkerPlacementPatchError as l, isAgentMainSessionKey as n, loadSessionsRuntimeModule as o, isWorkerDispatchInputError as r, requireSessionKey as s, emitSessionOperation as t, respondSessionWorkerPlacementMutationError as u };
