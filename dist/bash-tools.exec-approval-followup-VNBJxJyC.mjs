import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { r as emitDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { S as isCronSessionKey, l as resolveAgentIdFromSessionKey, w as isSubagentSessionKey } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as normalizeMessageChannel } from "./message-channel-core-BBQx3_oI.mjs";
import { n as isGatewayMessageChannel } from "./message-channel-normalize-CsnAJK7x.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { d as stringifyRouteThreadId } from "./channel-route-2bD3dZs2.mjs";
import { n as renderUserFacingText } from "./user-facing-text-BNFEPbYx.mjs";
import { D as formatExecDeniedUserMessage, O as isExecDeniedResultText, k as parseExecApprovalResultText } from "./user-copy-BAz4s3EV.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { r as getGatewayRecoveryRuntime } from "./server-recovery-runtime-context-7AOYu6JQ.mjs";
import { t as resolveExternalBestEffortDeliveryTarget } from "./best-effort-delivery-C0AupLCM.mjs";
import { t as sendMessage } from "./message-CUtguTA0.mjs";
import { n as buildExecApprovalContinuationFallbackPrompt } from "./bash-tools.exec-approval-output-BqQWG-4m.mjs";
import { i as isExecApprovalFollowupSessionRebound, o as registerExecApprovalFollowupRuntimeHandoff, t as buildExecApprovalFollowupIdempotencyKey } from "./bash-tools.exec-approval-followup-state-BqTxtUdJ.mjs";
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
async function isExecApprovalFollowupDirectDeliveryStale(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	const expectedSessionId = normalizeOptionalString(params.expectedSessionId);
	if (!sessionKey || !expectedSessionId) return false;
	try {
		if (params.source) {
			const source = params.source;
			const entry = readCapturedSessionActorEntry(source, sessionKey);
			return !entry || entry.sessionId !== expectedSessionId || entry.lifecycleRevision !== params.expectedLifecycleRevision;
		}
		const storePath = resolveSessionStorePathCore(normalizeOptionalString(params.sessionStore), { agentId: params.agentId ?? resolveAgentIdFromSessionKey(sessionKey) });
		const resolvedSessionId = normalizeOptionalString((await readSessionEntryReadOnlyInWorker({
			agentId: params.agentId,
			storePath,
			sessionKey,
			clone: false
		}))?.sessionId);
		return isExecApprovalFollowupSessionRebound({
			expectedSessionId,
			resolvedSessionId
		});
	} catch (err) {
		if (params.source) {
			log.debug(`exec approval followup source retired for ${sessionKey}; suppressing delivery`);
			return true;
		}
		log.debug(`exec approval followup session-rebind check skipped for ${sessionKey}; delivering: ${formatUnknownError(err)}`);
		return false;
	}
}
function formatDirectExecApprovalFollowupText(resultText, opts = {}) {
	const parsed = parseExecApprovalResultText(resultText);
	if (parsed.kind === "other" && !parsed.raw) return null;
	if (parsed.kind === "denied") return opts.allowDenied ? formatExecDeniedUserMessage(parsed.raw) : null;
	const metadata = parsed.kind === "finished" ? normalizeLowercaseStringOrEmpty(parsed.metadata) : "";
	const body = renderUserFacingText(parsed.kind === "finished" || parsed.kind === "completed" ? parsed.body : parsed.raw, { errorContext: !metadata.includes("code 0") }).trim();
	if (parsed.kind === "finished") return body || (metadata.includes("code 0") ? "Background command finished." : metadata.includes("signal") ? "Background command stopped unexpectedly." : "Background command finished with an error.");
	return body || (parsed.kind === "completed" ? "Background command finished." : null);
}
function readGatewayString(value, key) {
	return isRecord(value) ? normalizeOptionalString(value[key]) : void 0;
}
function buildFollowupWaitError(params) {
	const suffix = typeof params.error === "string" && params.error.trim() ? `: ${params.error.trim()}` : params.status ? `: ${params.status}` : "";
	return /* @__PURE__ */ new Error(`exec approval followup session resume failed${suffix}`);
}
function hasTerminalFollowupEvidence(value) {
	if (!isRecord(value)) return false;
	return typeof value.endedAt === "number" || typeof value.error === "string" || typeof value.stopReason === "string" || value.livenessState === "terminal";
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
			if (consecutiveTransportErrors > 1) await sleepWithAbort(retryDelayMs, void 0, { ref: false });
			continue;
		}
		consecutiveTransportErrors = 0;
		const status = readGatewayString(wait, "status");
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
	if (sendResult.deliveryStatus === "suppressed") throw new Error(sendResult.suppressionReason === "adapter_returned_no_identity" ? "exec approval followup delivery could not be confirmed: adapter returned no identity" : `exec approval followup delivery was suppressed: ${sendResult.suppressionReason ?? "unknown reason"}`);
	return true;
}
/** Sends an exec approval follow-up via session resume or safe direct delivery. */
async function sendExecApprovalFollowup(params) {
	const sessionKey = params.sessionKey?.trim();
	const source = sessionKey ? captureSessionActorStorageOwner({
		agentId: params.agentId,
		sessionKey
	}, {
		assertCurrent() {},
		authorize() {}
	}) : void 0;
	const expectedLifecycleRevision = source && sessionKey ? readCapturedSessionActorEntry(source, sessionKey)?.lifecycleRevision : void 0;
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
		const status = readGatewayString(accepted, "status");
		if (status === "ok") return true;
		if (status === "accepted" || status === "in_flight" || status === "pending") {
			const runId = readGatewayString(accepted, "runId") ?? normalizeOptionalString(agentArgs.idempotencyKey);
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
	if (await isExecApprovalFollowupDirectDeliveryStale({
		agentId: params.agentId,
		sessionKey,
		expectedSessionId: params.expectedSessionId,
		sessionStore: params.sessionStore,
		source,
		expectedLifecycleRevision
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
