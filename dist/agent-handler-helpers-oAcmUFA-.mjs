import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as ADMIN_SCOPE } from "./operator-scopes-D-CL26h0.mjs";
import { r as GATEWAY_CLIENT_MODES } from "./client-info-B_ICKCYw.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { t as setSafeTimeout } from "./timer-delay-DjFOGnXg.mjs";
import "./method-scopes-C7g7eSZh.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as isCliProvider } from "./model-selection-CaFyCMqp.mjs";
import { n as getCliSessionBinding } from "./cli-session-binding-BhV_HbVa.mjs";
import { l as resolveAgentHarnessSessionContextError, t as AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE, u as resolveAgentHarnessSessionIdMismatchError } from "./agent-harness-session-key-CQ6tTBOH.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import "./sessions-DE4llkPV.mjs";
import { d as resolveSessionWorkStartError } from "./lifecycle-WWQJH57y.mjs";
import "./cli-session-Cg8Oaz0V.mjs";
import { l as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import "./internal-event-contract-pF6FHp8g.mjs";
import { i as emitGatewaySessionStartPluginHook, r as emitGatewaySessionEndPluginHook } from "./session-reset-service-DQXUfzbH.mjs";
//#region src/gateway/agent-turn/agent-handler-helpers.ts
const CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS = [
	250,
	1e3,
	4e3,
	15e3
];
function clientHasAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function respondDeletedAgentSession(params) {
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(params.cfg, params.canonicalKey, params.entry, { acpMetadataSessionKey: params.acpMetadataSessionKey ?? params.canonicalKey });
	if (deletedAgentId === null) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
	return true;
}
function respondUnavailableAgentSessionForKey(params) {
	const { cfg, entry, canonicalKey, legacyKey } = loadGatewaySessionEntry(params.sessionKey, {
		...params.agentId ? { agentId: params.agentId } : {},
		clone: false,
		projection: "list"
	});
	if (respondDeletedAgentSession({
		cfg,
		canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		respond: params.respond
	})) return true;
	const harnessSessionError = resolveAgentHarnessSessionContextError(canonicalKey, entry);
	if (harnessSessionError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionError));
		return true;
	}
	const harnessSessionIdError = resolveAgentHarnessSessionIdMismatchError(entry, params.requestedSessionId);
	if (harnessSessionIdError) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, harnessSessionIdError));
		return true;
	}
	if (params.isRawModelRun && entry?.modelSelectionLocked === true) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, AGENT_HARNESS_MODEL_RUN_FORBIDDEN_MESSAGE));
		return true;
	}
	const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
	if (!archivedSessionError) return false;
	params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
	return true;
}
function resolveAllowModelOverrideFromClient(client) {
	return clientHasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function resolveCanUseInternalRuntimeHandoff(client) {
	return client?.connect?.client?.mode === GATEWAY_CLIENT_MODES.BACKEND;
}
function resolveCanUseCronRunContinuation(client) {
	return client?.internal?.cronRunContinuation === true;
}
function cronContinuationHasReusableRuntime(params) {
	const executionProvider = resolveCliRuntimeExecutionProvider({
		provider: params.provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: params.model
	}) ?? params.provider;
	return !isCliProvider(executionProvider, params.cfg) || Boolean(getCliSessionBinding(params.entry, executionProvider)?.sessionId);
}
function withoutCronRunContinuation(entry) {
	const { cronRunContinuation: _cronRunContinuation, ...baseEntry } = entry;
	return baseEntry;
}
function emitAgentSendSessionLifecycleTransition(transition) {
	if (!transition) return;
	if (transition.previousSessionId) emitGatewaySessionEndPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.previousSessionFile,
		agentId: transition.agentId,
		workspaceDir: transition.workspaceDir,
		reason: transition.previousEndReason ?? "unknown",
		nextSessionId: transition.sessionId,
		nextSessionKey: transition.sessionKey
	});
	emitGatewaySessionStartPluginHook({
		cfg: transition.cfg,
		sessionKey: transition.sessionKey,
		sessionId: transition.sessionId,
		resumedFrom: transition.previousSessionId,
		storePath: transition.storePath,
		sessionFile: transition.sessionFile,
		agentId: transition.agentId
	});
}
function shouldSuppressAgentPromptPersistence(params) {
	return params.inputProvenance?.kind === "inter_session" && params.inputProvenance.sourceTool === "subagent_announce" && params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
}
function withSqliteSessionFileMarker(params) {
	if (!(params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey))) return params.entry;
	return params.entry;
}
function yieldAfterAgentAcceptedAck() {
	return new Promise((resolve) => {
		setTimeout(resolve, 10);
	});
}
function waitForCronContinuationReleaseRecovery(delayMs) {
	return new Promise((resolve) => {
		setSafeTimeout(resolve, delayMs).unref?.();
	});
}
//#endregion
export { resolveAllowModelOverrideFromClient as a, respondDeletedAgentSession as c, waitForCronContinuationReleaseRecovery as d, withSqliteSessionFileMarker as f, emitAgentSendSessionLifecycleTransition as i, respondUnavailableAgentSessionForKey as l, yieldAfterAgentAcceptedAck as m, clientHasAdminScope as n, resolveCanUseCronRunContinuation as o, withoutCronRunContinuation as p, cronContinuationHasReusableRuntime as r, resolveCanUseInternalRuntimeHandoff as s, CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS as t, shouldSuppressAgentPromptPersistence as u };
