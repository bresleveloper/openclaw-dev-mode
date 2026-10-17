import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { r as emitDiagnosticEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { S as isCronSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-CqBAHB04.mjs";
import { n as isGatewayMessageChannel } from "./message-channel-normalize-DeTO1ikE.mjs";
import "./message-channel-j-k-Nup3.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-DjT1nXRD.mjs";
import { D as isExecDeniedResultText, E as formatExecDeniedUserMessage, O as parseExecApprovalResultText, n as renderUserFacingText } from "./user-facing-text-DC1sCo4O.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as callGatewayTool } from "./gateway-DrhAO8Dq.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cl-1FBey.mjs";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-CkLHXrp-.mjs";
import { t as sendMessage } from "./message-DCHawM3w.mjs";
import { n as buildExecApprovalContinuationFallbackPrompt } from "./bash-tools.exec-approval-output-IG1WWW6z.mjs";
import { i as isExecApprovalFollowupSessionRebound, o as registerExecApprovalFollowupRuntimeHandoff, t as buildExecApprovalFollowupIdempotencyKey } from "./bash-tools.exec-approval-followup-state-CliMmGYG.mjs";
//#region src/agents/bash-tools.exec-approval-followup.ts
/**
* Delivery orchestration for async exec approval follow-ups.
* Resumes the originating agent session when possible and falls back to safe
* direct delivery only when session resume is unavailable.
*/
const log = createSubsystemLogger("agents/exec-approval-followup");
const DIRECT_FOLLOWUP_MAX_UTF16_UNITS = 4e3;
const DIRECT_FOLLOWUP_TRUNCATION_MARKER = "[... earlier command output omitted ...]";
const DIRECT_FOLLOWUP_COMPLETION_RETENTION = {
	idPrefix: "exec-approval-followup:",
	maxAgeMs: 864e5,
	maxEntries: 2e3
};
const AGENT_FOLLOWUP_WAIT_TIMEOUT_MS = 6e4;
const AGENT_FOLLOWUP_WAIT_RETRY_DELAY_MS = 1e3;
const AGENT_FOLLOWUP_OBSERVATION_TIMEOUT_MS = 36e4;
async function callExecApprovalFollowupGateway(method, timeoutMs, params) {
	const gatewayRuntime = getGatewayRecoveryRuntime();
	if (gatewayRuntime) return method === "agent" ? await gatewayRuntime.dispatchAgent(params, timeoutMs) : await gatewayRuntime.waitForAgent(params, timeoutMs);
	return await callGatewayTool(method, { timeoutMs }, params);
}
function buildExecDeniedFollowupPrompt(resultText) {
	return [
		"An async command did not run.",
		"Do not run the command again.",
		"There is no new command output.",
		"Do not mention, summarize, or reuse output from any earlier run in this session.",
		"",
		"Exact completion details:",
		resultText.trim(),
		"",
		"Reply to the user in a helpful way.",
		"Explain that the command did not run and why.",
		"Do not claim there is new command output."
	].join("\n");
}
function formatUnknownError(error) {
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return "unknown error";
	}
}
function shouldSuppressExecDeniedFollowup(sessionKey) {
	return isSubagentSessionKey(sessionKey) || isCronSessionKey(sessionKey);
}
/**
* Direct/denied followups bypass the gateway agent dispatch, so the gateway
* rebind guard never sees them. Resolve the session key's current sessionId and
* report whether it was rebound away from the approval-time session by `/new`
* or `/reset` (#59349). Failure to resolve is treated as "not rebound" so a
* real result is never suppressed by accident.
*/
function isExecApprovalFollowupDirectDeliveryStale(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const expectedSessionId = normalizeOptionalString(params.expectedSessionId);
	if (!sessionKey || !expectedSessionId) return false;
	try {
		const storePath = resolveSessionStorePathCore(normalizeOptionalString(params.sessionStore), { agentId: params.agentId ?? resolveAgentIdFromSessionKey(sessionKey) });
		const resolvedSessionId = normalizeOptionalString(loadSessionEntryReadOnly({
			agentId: params.agentId,
			storePath,
			sessionKey,
			clone: false
		})?.sessionId);
		return isExecApprovalFollowupSessionRebound({
			expectedSessionId,
			resolvedSessionId
		});
	} catch (err) {
		log.debug(`exec approval followup session-rebind check skipped for ${sessionKey}; delivering: ${formatUnknownError(err)}`);
		return false;
	}
}
function formatDirectExecApprovalFollowupText(resultText, opts = {}) {
	const parsed = parseExecApprovalResultText(resultText);
	if (parsed.kind === "other" && !parsed.raw) return null;
	if (parsed.kind === "denied") return opts.allowDenied ? formatExecDeniedUserMessage(parsed.raw) : null;
	if (parsed.kind === "finished") {
		const metadata = normalizeLowercaseStringOrEmpty(parsed.metadata);
		return redactToolPayloadText(renderUserFacingText(parsed.body, { errorContext: !metadata.includes("code 0") })).trim() || (metadata.includes("code 0") ? "Background command finished." : metadata.includes("signal") ? "Background command stopped unexpectedly." : "Background command finished with an error.");
	}
	if (parsed.kind === "completed") return redactToolPayloadText(renderUserFacingText(parsed.body, { errorContext: true })).trim() || "Background command finished.";
	return redactToolPayloadText(renderUserFacingText(parsed.raw, { errorContext: true })).trim() || null;
}
function readGatewayStatus(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? normalizeOptionalString(value.status) : void 0;
}
function readGatewayRunId(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? normalizeOptionalString(value.runId) : void 0;
}
function buildFollowupWaitError(params) {
	const suffix = typeof params.error === "string" && params.error.trim() ? `: ${params.error.trim()}` : params.status ? `: ${params.status}` : "";
	return /* @__PURE__ */ new Error(`exec approval followup session resume failed${suffix}`);
}
function hasTerminalFollowupEvidence(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const record = value;
	return typeof record.endedAt === "number" || typeof record.error === "string" || typeof record.stopReason === "string" || record.livenessState === "terminal";
}
async function waitForAgentFollowupRun(params) {
	const observationDeadline = Date.now() + AGENT_FOLLOWUP_OBSERVATION_TIMEOUT_MS;
	let consecutiveTransportErrors = 0;
	let transportErrors = 0;
	for (;;) {
		const remainingMs = observationDeadline - Date.now();
		if (remainingMs <= 0) return {
			status: "observation_ended",
			reason: "deadline",
			transportErrors
		};
		const waitTimeoutMs = Math.max(1, Math.min(params.timeoutMs, remainingMs));
		let wait;
		try {
			wait = await callExecApprovalFollowupGateway("agent.wait", waitTimeoutMs + 2e3, {
				runId: params.runId,
				timeoutMs: waitTimeoutMs
			});
		} catch {
			consecutiveTransportErrors += 1;
			transportErrors += 1;
			const retryDelayMs = Math.min(AGENT_FOLLOWUP_WAIT_RETRY_DELAY_MS, observationDeadline - Date.now());
			if (retryDelayMs <= 0) return {
				status: "observation_ended",
				reason: "deadline",
				transportErrors
			};
			if (consecutiveTransportErrors > 1) await new Promise((resolve) => {
				setTimeout(resolve, retryDelayMs).unref?.();
			});
			continue;
		}
		consecutiveTransportErrors = 0;
		const status = readGatewayStatus(wait);
		if (status === "ok") return { status: "completed" };
		if (hasTerminalFollowupEvidence(wait)) throw buildFollowupWaitError({
			status,
			error: wait.error
		});
	}
}
function shouldPrefixDirectFollowupWithSessionResumeFailure(params) {
	if (!params.sessionError) return false;
	const parsed = parseExecApprovalResultText(params.resultText);
	if (parsed.kind !== "finished") return true;
	return !normalizeLowercaseStringOrEmpty(parsed.metadata).includes("code 0");
}
function buildAgentFollowupArgs(params) {
	const { deliveryTarget, sessionOnlyOriginChannel } = params;
	const fallbackChannel = sessionOnlyOriginChannel ?? params.turnSourceChannel;
	const isDenied = isExecDeniedResultText(params.resultText.trim());
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey,
		message: isDenied ? buildExecDeniedFollowupPrompt(params.resultText) : buildExecApprovalContinuationFallbackPrompt(params.resultText),
		inputProvenance: {
			kind: "inter_session",
			sourceSessionKey: params.sessionKey,
			sourceTool: "exec_approval_followup"
		},
		deliver: deliveryTarget.deliver,
		...deliveryTarget.deliver ? { bestEffortDeliver: true } : {},
		channel: deliveryTarget.deliver ? deliveryTarget.channel : fallbackChannel,
		to: deliveryTarget.deliver ? deliveryTarget.to : params.turnSourceTo,
		accountId: deliveryTarget.deliver ? deliveryTarget.accountId : params.turnSourceAccountId,
		threadId: deliveryTarget.deliver ? deliveryTarget.threadId : stringifyRouteThreadId(params.turnSourceThreadId),
		idempotencyKey: params.idempotencyKey ?? buildExecApprovalFollowupIdempotencyKey({ approvalId: params.approvalId }),
		...params.expectedSessionId ? { execApprovalFollowupExpectedSessionId: params.expectedSessionId } : {},
		...params.internalRuntimeHandoffId ? { internalRuntimeHandoffId: params.internalRuntimeHandoffId } : {}
	};
}
async function sendDirectFollowupFallback(params) {
	const directText = formatDirectExecApprovalFollowupText(params.resultText, { allowDenied: params.allowDenied ?? params.sessionError !== null });
	if (!params.deliveryTarget.deliver || !directText) return false;
	const prefix = !params.allowDenied && shouldPrefixDirectFollowupWithSessionResumeFailure(params) ? "Automatic session resume failed, so sending the status directly.\n\n" : "";
	const availableBodyUnits = DIRECT_FOLLOWUP_MAX_UTF16_UNITS - prefix.length - 40 - 1;
	const content = `${prefix}${directText}`.length <= DIRECT_FOLLOWUP_MAX_UTF16_UNITS ? `${prefix}${directText}` : `${prefix}${DIRECT_FOLLOWUP_TRUNCATION_MARKER}\n${sliceUtf16Safe(directText, Math.max(0, directText.length - Math.max(1, availableBodyUnits)))}`;
	const deliveryIntentId = `exec-approval-followup:${params.approvalId}`;
	const sendResult = await sendMessage({
		channel: params.deliveryTarget.channel,
		to: params.deliveryTarget.to ?? "",
		accountId: params.deliveryTarget.accountId,
		threadId: params.deliveryTarget.threadId,
		content,
		agentId: params.agentId,
		gatewayOwnedDelivery: true,
		idempotencyKey: deliveryIntentId,
		deliveryIntentId,
		reusePendingDeliveryIntent: true,
		completionRetention: DIRECT_FOLLOWUP_COMPLETION_RETENTION
	});
	if (sendResult.deliveryStatus === "suppressed") {
		if (sendResult.suppressionReason === "adapter_returned_no_identity") throw new Error("exec approval followup delivery could not be confirmed: adapter returned no identity");
		throw new Error(`exec approval followup delivery was suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
	}
	return true;
}
/** Sends an exec approval follow-up via session resume or safe direct delivery. */
async function sendExecApprovalFollowup(params) {
	const sessionKey = params.sessionKey?.trim();
	const trimmedResultText = params.resultText.trim();
	if (!trimmedResultText) return false;
	const resultText = params.resultText;
	const isDenied = isExecDeniedResultText(trimmedResultText);
	let internalRuntimeHandoffId = params.internalRuntimeHandoffId;
	let idempotencyKey = params.idempotencyKey;
	if (!isDenied && sessionKey && params.direct !== true && !internalRuntimeHandoffId) {
		const runtimeHandoff = registerExecApprovalFollowupRuntimeHandoff({
			approvalId: params.approvalId,
			sessionKey,
			resultText
		});
		internalRuntimeHandoffId = runtimeHandoff?.handoffId;
		idempotencyKey = runtimeHandoff?.idempotencyKey;
	}
	const deliveryTarget = resolveExternalBestEffortDeliveryTarget({
		channel: params.turnSourceChannel,
		to: params.turnSourceTo,
		accountId: params.turnSourceAccountId,
		threadId: params.turnSourceThreadId
	});
	const normalizedTurnSourceChannel = normalizeMessageChannel(params.turnSourceChannel);
	const sessionOnlyOriginChannel = normalizedTurnSourceChannel && isGatewayMessageChannel(normalizedTurnSourceChannel) ? normalizedTurnSourceChannel : void 0;
	let sessionError = null;
	if (isDenied && (!sessionKey || shouldSuppressExecDeniedFollowup(sessionKey))) return false;
	if (sessionKey && params.direct !== true) try {
		const agentArgs = buildAgentFollowupArgs({
			approvalId: params.approvalId,
			agentId: params.agentId,
			sessionKey,
			expectedSessionId: params.expectedSessionId,
			resultText,
			deliveryTarget,
			sessionOnlyOriginChannel,
			turnSourceChannel: params.turnSourceChannel,
			turnSourceTo: params.turnSourceTo,
			turnSourceAccountId: params.turnSourceAccountId,
			turnSourceThreadId: params.turnSourceThreadId,
			internalRuntimeHandoffId,
			idempotencyKey
		});
		const accepted = await callExecApprovalFollowupGateway("agent", 6e4, agentArgs);
		const status = readGatewayStatus(accepted);
		if (status === "ok") return true;
		if (status === "accepted" || status === "in_flight" || status === "pending") {
			const runId = readGatewayRunId(accepted) ?? normalizeOptionalString(agentArgs.idempotencyKey);
			if (!runId) throw buildFollowupWaitError({ status: "missing-run-id" });
			const waitResult = await waitForAgentFollowupRun({
				runId,
				timeoutMs: AGENT_FOLLOWUP_WAIT_TIMEOUT_MS
			});
			if (waitResult.status === "observation_ended") {
				emitDiagnosticEvent({
					type: "log.record",
					level: "WARN",
					message: "Exec approval followup observation ended",
					loggerName: "agents/exec-approval-followup",
					attributes: {
						approvalId: params.approvalId,
						runId,
						reason: waitResult.reason,
						transportErrors: waitResult.transportErrors,
						deliveryOwner: "accepted_agent_run"
					}
				});
				log.warn(`Stopped observing accepted exec approval followup ${params.approvalId} after its bounded wait window; run ${runId} remains the sole delivery owner`);
			}
			return true;
		}
		throw buildFollowupWaitError({
			status,
			error: accepted.error
		});
	} catch (err) {
		sessionError = err;
	}
	if (isExecApprovalFollowupDirectDeliveryStale({
		agentId: params.agentId,
		sessionKey,
		expectedSessionId: params.expectedSessionId,
		sessionStore: params.sessionStore
	})) {
		emitDiagnosticEvent({
			type: "exec.approval.followup_suppressed",
			approvalId: params.approvalId,
			reason: "session_rebound",
			phase: "direct_delivery"
		});
		log.info(isDenied ? `Dropping stale denied exec approval followup ${params.approvalId}: session ${sessionKey ?? ""} was rebound before the approval resolved` : `Dropping stale exec approval followup ${params.approvalId} direct fallback: session ${sessionKey ?? ""} was rebound before the approval resolved`);
		return false;
	}
	if (await sendDirectFollowupFallback({
		approvalId: params.approvalId,
		agentId: params.agentId,
		deliveryTarget,
		resultText,
		sessionError,
		...isDenied ? { allowDenied: true } : {}
	})) return true;
	if (sessionError) throw new Error(`Session followup failed: ${formatUnknownError(sessionError)}`);
	if (isDenied) return false;
	throw new Error("Session key or deliverable origin route is required");
}
//#endregion
export { sendExecApprovalFollowup };
