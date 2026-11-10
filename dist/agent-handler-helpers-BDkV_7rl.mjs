import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { a as resolveSessionWorkStartError } from "./session-work-start-Sz_vqYld.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as getCliSessionBinding } from "./cli-session-binding-Dx1VbkI8.mjs";
import { l as resolveAgentHarnessSessionContextError, u as resolveAgentHarnessSessionIdMismatchError } from "./agent-harness-session-key-zbrcLVpT.mjs";
import "./sessions-CnzPI1yx.mjs";
import "./model-selection-DdQ-ffuG.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { t as setSafeTimeout } from "./timer-delay-CaN6-bja.mjs";
import { o as prepareDeletedAgentSessionCheck } from "./session-utils-store-lW7Wu3P0.mjs";
import "./cli-session-CBCjrsL6.mjs";
import "./internal-event-contract-pF6FHp8g.mjs";
import "./session-utils-CGx9I2of.mjs";
//#region src/gateway/agent-turn/agent-handler-helpers.ts
const CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS = [
	250,
	1e3,
	4e3,
	15e3
];
function canPrepareAgentSessionWorktree(sessionKey, entry) {
	return Boolean(sessionKey && entry?.pendingWorktree) && entry?.pendingProjectGitUrl === void 0;
}
function resolveAgentSessionWorkStartError(sessionKey, entry) {
	return resolveSessionWorkStartError(sessionKey, entry, canPrepareAgentSessionWorktree(sessionKey, entry) ? { allowPendingWorkspace: true } : void 0);
}
function respondDeletedAgentSession(params) {
	const deletedAgentId = prepareDeletedAgentSessionCheck({
		cfg: params.cfg,
		sessionKey: params.canonicalKey,
		entry: params.entry,
		acpMetadataSessionKey: params.acpMetadataSessionKey,
		assertCurrent: params.assertCurrent
	});
	const respond = (agentId) => {
		if (agentId === null) return false;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${agentId}" no longer exists in configuration`));
		return true;
	};
	return deletedAgentId instanceof Promise ? deletedAgentId.then((agentId) => {
		params.assertCurrent?.();
		return respond(agentId);
	}) : respond(deletedAgentId);
}
function respondUnavailableAgentSession(params) {
	const { cfg, entry, canonicalKey, legacyKey } = params.loaded;
	const deleted = respondDeletedAgentSession({
		cfg,
		canonicalKey,
		entry,
		acpMetadataSessionKey: legacyKey,
		respond: params.respond,
		assertCurrent: params.assertCurrent
	});
	const respondUnavailable = (isDeleted) => {
		if (isDeleted) return true;
		const sessionError = resolveAgentHarnessSessionContextError(canonicalKey, entry) || resolveAgentHarnessSessionIdMismatchError(entry, params.requestedSessionId) || (params.isRawModelRun && entry?.modelSelectionLocked === true ? "Agent harness-owned sessions cannot be used for one-shot model runs." : void 0) || resolveAgentSessionWorkStartError(canonicalKey, entry);
		if (!sessionError) return false;
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, sessionError));
		return true;
	};
	return deleted instanceof Promise ? deleted.then((isDeleted) => {
		params.assertCurrent?.();
		return respondUnavailable(isDeleted);
	}) : respondUnavailable(deleted);
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
function shouldSuppressAgentPromptPersistence(params) {
	return params.inputProvenance?.kind === "inter_session" && params.inputProvenance.sourceTool === "subagent_announce" && params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
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
export { respondDeletedAgentSession as a, waitForCronContinuationReleaseRecovery as c, resolveAgentSessionWorkStartError as i, withoutCronRunContinuation as l, canPrepareAgentSessionWorktree as n, respondUnavailableAgentSession as o, cronContinuationHasReusableRuntime as r, shouldSuppressAgentPromptPersistence as s, CRON_CONTINUATION_RELEASE_RECOVERY_DELAYS_MS as t, yieldAfterAgentAcceptedAck as u };
