import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CuVhdCBs.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { n as SUBAGENT_EXEC_ENV_VAR, t as OPENCLAW_CLI_ENV_VAR } from "./openclaw-exec-env-Cc7ECPuD.mjs";
import { o as safeRealpathSync } from "./boundary-path-CAv_plX7.mjs";
import { r as isPathInside, s as safeStatSync } from "./path-guards-CH7noY0Z.mjs";
import { i as createAbortError$1 } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { l as emitTrustedSecurityEvent } from "./diagnostic-events-BADdmgZf.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { i as normalizePathPrepend, t as applyPathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as sanitizeHostExecEnvWithDiagnostics, n as isDangerousHostEnvOverrideVarName, o as normalizeHostOverrideEnvVarKey, r as isDangerousHostEnvVarName } from "./host-env-security-BgpkByrc.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { r as getShellPathFromLoginShell, s as resolveShellEnvFallbackTimeoutMs } from "./shell-env-DMUTR2yo.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { f as EXEC_TOOL_DISPLAY_SUMMARY, p as PROCESS_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-DyHnjiiS.mjs";
import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
import { l as resolveExecModePolicy, n as normalizeExecAsk, o as requireValidExecTarget } from "./exec-approvals-core-s7tTQC_a.mjs";
import { f as resolveExecutionTargetTrustPath, g as resolveExecWrapperTrustPlan, s as resolveApprovalAuditTrustPath } from "./exec-command-resolution-DxYxel2J.mjs";
import { n as splitCommandArgs, r as splitShellArgs } from "./shell-argv-Dy8gqirH.mjs";
import { l as hasPosixShellStartupBeforeInlineCommand, u as isBlockedShellWrapperCommand } from "./shell-wrapper-resolution-BWMoO7Nh.mjs";
import { n as APPROVALS_SCOPE, u as WRITE_SCOPE } from "./operator-scopes-DsrPoRc4.mjs";
import { t as formatDurationCompact } from "./format-duration-BIQQYTeV.mjs";
import { n as getInstallationTarget, r as installationTargetEnv, t as LOCAL_INSTALLATION_TARGET_UNSUPPORTED } from "./installation-target-context-BOfhXm_n.mjs";
import { i as logWarn, r as logInfo } from "./logger-DskmrSVa.mjs";
import { t as getGlobalHookRunner } from "./hook-runner-global-D5rL9Ed5.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission, t as GatewayDrainingError } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { n as ToolInputError } from "./tool-input-error-mjW74R8m.mjs";
import { _ as resolveExecApprovalAllowedDecisions, a as createExecApprovalPolicySnapshot, b as resolveExecApprovalsFromFileInternal, c as hasNodeCommandAllowAlwaysMarker, d as resolveAllowAlwaysPersistenceDecision, f as resolveDurableExecApprovalRequirement, g as requiresExecApproval, m as minSecurity, o as hasDurableExecApproval, p as maxAsk, s as hasExactCommandDurableExecApproval, u as resolveAllowAlwaysPatternCoverage, y as resolveExecApprovalUnavailableDecisions } from "./exec-approvals-authorization.kernel-C_vJhPCn.mjs";
import { r as loadExecApprovals } from "./exec-approvals-store-DGp2moY9.mjs";
import { n as evaluateShellAllowlistWithAuthorization, p as buildEnforcedShellCommand } from "./exec-approvals-allowlist-CU7bs0k0.mjs";
import "./exec-wrapper-resolution-DG9lx7nr.mjs";
import { c as describeInterpreterInlineEval, o as detectInlineEvalInSegments } from "./risks-C7nFiQYV.mjs";
import { t as countObsoleteGeneratedExecApprovals } from "./exec-approvals-generated-migration-CnSZXIu2.mjs";
import { n as resolveExecApprovalsLocked, r as commitExecAuthorizationLocked } from "./exec-approvals-B1rZTeax.mjs";
import { B as renderExecUpdateText, D as isExecDeniedResultText, F as appendExecTimeoutRetryGuidance, L as normalizeNotifyOutput, M as EXEC_MANUAL_COLLECTION_FOLLOW_UP, N as EXEC_RETENTION_CAP_NOTE, R as renderExecExitLabel, z as renderExecOutputText } from "./user-facing-text-DC1sCo4O.mjs";
import { t as isApprovalNotFoundError } from "./approval-errors-Ccn5PiLn.mjs";
import { n as getDiagnosticSessionState } from "./diagnostic-session-state-tX9oTPd5.mjs";
import { o as attachInternalToolResultAcknowledgement } from "./internal-hooks-Cr0v44EY.mjs";
import { n as textResult } from "./tool-results-BCM3fdVS.mjs";
import { n as failedTextResult } from "./common-Dyxcwsy8.mjs";
import { p as withoutGatewayToolCallerIdentity } from "./gateway-caller-context-DWr-fdGt.mjs";
import { D as readEnvInt, E as deriveSessionName, O as sliceLogLines, S as buildSandboxEnv, T as coerceEnv, a as compareProcessSessionStartOrder, b as tail, c as getFinishedSession, f as listFinishedSessions, g as prepareSessionPoll, k as truncateMiddle, l as getSession, m as markBackgrounded, o as deleteSession, p as listRunningSessions, t as acknowledgeNotifyOnExit, u as hasPendingPollDelivery, w as clampWithDefault } from "./bash-process-registry-BsL_e5bm.mjs";
import { r as resolveStoredSubagentCapabilities, t as isSubagentEnvelopeSession } from "./subagent-capabilities-wl-IV_LE.mjs";
import { n as assertSandboxPath } from "./sandbox-paths-Br7HP2l8.mjs";
import { n as abortable } from "./abortable-D3H_Jjyt.mjs";
import { l as stripMalformedXmlArgValueSuffixFromKeys } from "./agent-tools.before-tool-call.decision-BLLl9Umq.mjs";
import { a as resolveExecApprovalInitiatingSurfaceState } from "./exec-approval-surface-BJG9uJSO.mjs";
import { t as callGatewayTool } from "./gateway-DrhAO8Dq.mjs";
import { r as captureAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-Mz8w3cgU.mjs";
import { t as getProcessSupervisor } from "./supervisor-j9Amjrh_.mjs";
import { r as isSecretEgressProxyActive } from "./registry-BLke9iXb.mjs";
import { a as DEFAULT_PENDING_MAX_OUTPUT, c as buildApprovalPendingMessage, h as runExecProcess, i as DEFAULT_PATH, l as buildExecRuntimeErrorOutcome, m as resolveExecTarget, n as DEFAULT_APPROVAL_TIMEOUT_MS, o as ExecProcessPreflightError, p as resolveApprovalRunningNoticeMs, r as DEFAULT_MAX_OUTPUT, s as applyShellPath, u as createApprovalSlug } from "./bash-tools.exec-runtime-BETUcUuq.mjs";
import { i as processSchema, n as execSchema } from "./bash-tools.schemas-CYQpq8j2.mjs";
import { c as prepareSystemRunMutableFileBinding, g as resolveSystemRunCommandRequest, h as extractShellCommandFromArgv, u as revalidateSystemRunMutableFileBinding } from "./system-run-approval-binding-D_QCHpDn.mjs";
import { r as resolveExecSafeBinRuntimePolicy } from "./exec-safe-bin-runtime-policy-DWi4kqiG.mjs";
import { n as describeExecTool, r as describeProcessTool } from "./bash-tools.descriptions-CdVoGX1S.mjs";
import { t as getAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.mjs";
import { n as resolveExecDefaultTimeoutSec, r as resolveNodeExecTimeouts, t as createExecToolExecutionTimeoutResolver } from "./exec-tool-timeout-MN_b5T-U.mjs";
import { t as ProcessToolOutputSchema } from "./bash-tools.process-schema-Bj9Dor0l.mjs";
import { l as prepareGitHubToolEnvironment } from "./github-tool-identity-2S4ost1l.mjs";
import { n as sanitizeEnvVars } from "./sanitize-env-vars-BYC-Fvaw.mjs";
import { t as resolveEligibleNodeFromList } from "./node-resolve-CiEFPm1c.mjs";
import { a as resolveNodeIdFromList, n as listNodes } from "./nodes-utils-BMFQ12NT.mjs";
import { i as resolveRegisteredExecApprovalDecision, n as isExecApprovalRunAbortedError, r as registerExecApprovalRequestForHostOrThrow, t as buildExecApprovalTurnSourceContext } from "./bash-tools.exec-approval-request-C2QIhDnJ.mjs";
import { a as defaultExecAutoReviewer, c as resolveExecAutoReviewDecision, n as EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING, o as formatExecAutoReviewAssessment, r as EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING } from "./exec-auto-review-BrKPsT7Y.mjs";
import { a as formatExecApprovalContinuationSourceOutput, i as buildExecAutoReviewDeniedToolResult } from "./bash-tools.exec-approval-output-IG1WWW6z.mjs";
import { i as revalidateApprovedCwdSnapshot, n as APPROVAL_CWD_DRIFT_DENIED_MESSAGE, r as captureApprovedCwdSnapshotSync, t as resolveUnpinnedAutoApprovalEligibility } from "./exec-auto-approval-eligibility-BcIY0ahl.mjs";
import { n as buildReviewedShellCommandFromPlan, t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-Ci_RCvic.mjs";
import { s as buildExecApprovalUnavailableReplyPayload } from "./exec-approval-reply-CsEym-Wu.mjs";
import { o as registerExecApprovalFollowupRuntimeHandoff } from "./bash-tools.exec-approval-followup-state-CliMmGYG.mjs";
import { n as rejectUnsafeExecControlShellCommand, r as rejectUnsafeExecLiveStateSqliteShellCommand } from "./exec-control-command-guard-nnSfECQ7.mjs";
import { n as consumeCronStandingGrant, o as validateCronStandingGrant, t as buildCronExecOperationBinding } from "./operator-approval-standing-grants-pk0FVWgH.mjs";
import { t as lookupCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { t as parsePreparedSystemRunPayload } from "./system-run-approval-context-DOqFeV5G.mjs";
import { n as recordCommandPoll, r as resetCommandPollCount } from "./command-poll-backoff-C32T1x4y.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import crypto, { randomUUID } from "node:crypto";
//#region src/agents/bash-tools.exec-host-shared.ts
/**
* Shared approval helpers for gateway and node exec hosts.
* Owns pending-state construction, policy merging, unavailable-route handling,
* follow-up dispatch, and approval-pending tool result rendering.
*/
const loggedExecApprovalFollowupFailures = new LruCache(256);
function rememberExecApprovalFollowupFailureKey(key) {
	if (loggedExecApprovalFollowupFailures.peek(key)) return false;
	loggedExecApprovalFollowupFailures.set(key, true);
	return true;
}
/** Converts a raw approval decision plus fallback policy into execution state. */
function resolveBaseExecApprovalDecision(params) {
	if (params.decision === "deny") return {
		approvedByAsk: false,
		deniedReason: "user-denied",
		timedOut: false
	};
	if (!params.decision) {
		if (params.askFallback === "full") return {
			approvedByAsk: true,
			deniedReason: null,
			timedOut: true
		};
		if (params.askFallback === "deny") return {
			approvedByAsk: false,
			deniedReason: "approval-timeout",
			timedOut: true
		};
		return {
			approvedByAsk: false,
			deniedReason: null,
			timedOut: true
		};
	}
	return {
		approvedByAsk: false,
		deniedReason: null,
		timedOut: false
	};
}
/** Resolves effective exec policy for a gateway/node host. */
async function resolveExecHostApprovalContext(params) {
	const approvals = await resolveExecApprovalsLocked(params.agentId, {
		security: params.security,
		ask: params.ask
	});
	const hostSecurity = params.bypassHostApprovalFloors ? params.security : minSecurity(params.security, approvals.agent.security);
	const hostAsk = params.bypassHostApprovalFloors ? params.ask : maxAsk(params.ask, approvals.agent.ask);
	const askFallback = params.bypassHostApprovalFloors ? "deny" : minSecurity(hostSecurity, approvals.agent.askFallback);
	if (hostSecurity === "deny") throw new Error(`exec denied: host=${params.host} security=deny`);
	return {
		approvals,
		hostSecurity,
		hostAsk,
		askFallback
	};
}
/** Resolves approval delivery availability for the initiating channel/account. */
function resolveExecApprovalUnavailableState(params) {
	const initiatingSurface = resolveExecApprovalInitiatingSurfaceState({
		channel: params.turnSourceChannel,
		accountId: params.turnSourceAccountId
	});
	return {
		initiatingSurface,
		sentApproverDms: false,
		unavailableReason: params.preResolvedDecision === null ? "no-approval-route" : initiatingSurface.kind === "disabled" ? "initiating-platform-disabled" : initiatingSurface.kind === "unsupported" ? "initiating-platform-unsupported" : null
	};
}
/** Creates, registers, and normalizes a default approval request context. */
async function createAndRegisterDefaultExecApprovalRequest(params) {
	const approvalId = crypto.randomUUID();
	const defaultExpiresAtMs = resolveExpiresAtMsFromDurationMs(DEFAULT_APPROVAL_TIMEOUT_MS) ?? 0;
	const warningText = params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "";
	const approvalSlug = params.createApprovalSlug(approvalId);
	const registration = await params.register(approvalId);
	const preResolvedDecision = registration.finalDecision;
	const { initiatingSurface, sentApproverDms, unavailableReason } = resolveExecApprovalUnavailableState({
		turnSourceChannel: params.turnSourceChannel,
		turnSourceAccountId: params.turnSourceAccountId,
		preResolvedDecision
	});
	return {
		approvalId,
		approvalSlug,
		warningText,
		expiresAtMs: registration.expiresAtMs ?? defaultExpiresAtMs,
		preResolvedDecision,
		initiatingSurface,
		sentApproverDms,
		unavailableReason
	};
}
/** Resolves explicit, timeout-fallback, and strict-human approval policy in one owner. */
async function resolveExecApprovalDecisionState(params) {
	const baseDecision = resolveBaseExecApprovalDecision({
		decision: params.decision,
		askFallback: params.askFallback
	});
	let { approvedByAsk, deniedReason } = baseDecision;
	let timeoutContext;
	if (baseDecision.timedOut && params.resolveTimedOut) {
		const timedOut = await params.resolveTimedOut({
			baseDecision,
			approvedByAsk,
			deniedReason
		});
		approvedByAsk = timedOut.approvedByAsk;
		deniedReason = timedOut.deniedReason;
		timeoutContext = timedOut.context;
	} else if (params.decision === "allow-once" || params.decision === "allow-always") approvedByAsk = true;
	const requiresExplicitApproval = typeof params.requiresExplicitApproval === "function" ? params.requiresExplicitApproval(timeoutContext) : params.requiresExplicitApproval;
	if (baseDecision.timedOut && approvedByAsk && (requiresExplicitApproval || params.requiresAutoReviewHumanApproval === true)) {
		approvedByAsk = false;
		deniedReason ??= "approval-timeout";
	}
	return {
		baseDecision,
		approvedByAsk,
		deniedReason,
		timeoutContext
	};
}
/** Registers an approval and resolves terminal no-route fallback through the shared policy owner. */
async function createExecApprovalRequestRoute(params) {
	const request = await createAndRegisterDefaultExecApprovalRequest(params);
	if (request.unavailableReason !== "no-approval-route" || request.preResolvedDecision !== null) return {
		...request,
		kind: "wait"
	};
	const state = await resolveExecApprovalDecisionState({
		...params,
		decision: null
	});
	return {
		...request,
		kind: "inline",
		preResolvedDecision: null,
		state
	};
}
/** Waits for an approval and normalizes cancellation, request failure, and resolved policy. */
async function resolveExecApprovalWaitOutcome(params) {
	let decision;
	try {
		decision = await resolveRegisteredExecApprovalDecision({
			approvalId: params.approvalId,
			preResolvedDecision: params.preResolvedDecision
		});
	} catch (error) {
		return { kind: isExecApprovalRunAbortedError(error) ? "run-aborted" : "request-failed" };
	}
	if (params.signal?.aborted) return { kind: "run-aborted" };
	const state = await resolveExecApprovalDecisionState({
		...params,
		decision
	});
	return params.signal?.aborted ? { kind: "run-aborted" } : {
		kind: "resolved",
		decision,
		state
	};
}
/** Builds the denial copy for headless runs that cannot wait for approval. */
function buildHeadlessExecApprovalDeniedMessage(params) {
	const runLabel = params.trigger === "cron" ? "Automation runs" : "Headless runs";
	const approvalTarget = params.host === "node" ? "--node <id|name|ip>" : "--gateway";
	const approvalSurfaceFix = params.trigger === "cron" && params.host === "gateway" ? "- keep the Control UI or a macOS/iOS/Android app connected and answer the next run's approval card; Allow Always mints a standing grant" : "- rerun interactively and approve when prompted (Control UI or a chat channel with exec approvals)";
	return [
		`exec denied: ${runLabel} cannot wait for interactive exec approval.`,
		`Effective host exec policy: security=${params.security} ask=${params.ask} askFallback=${params.askFallback}`,
		"Stricter values from tools.exec and the execution host's approvals policy both apply.",
		"Fix one of these:",
		"- set tools.exec.mode=\"full\" and align host approvals to security=\"full\" and ask=\"off\" for trusted local automation",
		"- keep allowlist mode and add an explicit allowlist entry for this command",
		approvalSurfaceFix,
		`Tip: run "openclaw doctor" and "openclaw approvals get ${approvalTarget}" to inspect the effective policy.`
	].join("\n");
}
/** Sends async approval follow-up results with deduped warning logs on failure. */
async function sendExecApprovalFollowupResult(target, resultText) {
	const runtimeHandoff = target.direct === true || !target.sessionKey || isExecDeniedResultText(resultText) ? void 0 : registerExecApprovalFollowupRuntimeHandoff({
		approvalId: target.approvalId,
		sessionKey: target.sessionKey,
		bashElevated: target.bashElevated,
		resultText
	});
	const followup = {
		approvalId: target.approvalId,
		...target.agentId ? { agentId: target.agentId } : {},
		sessionKey: target.sessionKey,
		expectedSessionId: target.expectedSessionId,
		sessionStore: target.sessionStore,
		turnSourceChannel: target.turnSourceChannel,
		turnSourceTo: target.turnSourceTo,
		turnSourceAccountId: target.turnSourceAccountId,
		turnSourceThreadId: target.turnSourceThreadId,
		resultText,
		direct: target.direct,
		...runtimeHandoff ? {
			internalRuntimeHandoffId: runtimeHandoff.handoffId,
			idempotencyKey: runtimeHandoff.idempotencyKey
		} : {}
	};
	try {
		const { sendExecApprovalFollowup } = await import("./bash-tools.exec-approval-followup-B8Bz9FHc.mjs");
		await sendExecApprovalFollowup(followup);
	} catch (error) {
		if (isApprovalNotFoundError(error)) return;
		const message = formatErrorMessage(error);
		if (!rememberExecApprovalFollowupFailureKey(`${target.approvalId}:${message}`)) return;
		logWarn(`exec approval followup dispatch failed (id=${target.approvalId}): ${message}`);
	}
}
/** Renders an approval-pending or approval-unavailable exec tool result. */
function buildExecApprovalPendingToolResult(params) {
	const allowedDecisions = params.allowedDecisions ?? resolveExecApprovalAllowedDecisions();
	return {
		content: [{
			type: "text",
			text: params.unavailableReason !== null ? buildExecApprovalUnavailableReplyPayload({
				warningText: params.warningText,
				reason: params.unavailableReason,
				channel: params.initiatingSurface.channel,
				channelLabel: params.initiatingSurface.channelLabel,
				accountId: params.initiatingSurface.accountId,
				sentApproverDms: params.sentApproverDms,
				host: params.host,
				nodeId: params.nodeId
			}).text ?? "" : buildApprovalPendingMessage({
				warningText: params.warningText,
				approvalSlug: params.approvalSlug,
				approvalId: params.approvalId,
				allowedDecisions,
				command: params.command,
				cwd: params.cwd,
				host: params.host,
				nodeId: params.nodeId,
				processContinuationAvailable: params.processContinuationAvailable
			})
		}],
		details: params.unavailableReason !== null ? {
			status: "approval-unavailable",
			reason: params.unavailableReason,
			channel: params.initiatingSurface.channel,
			channelLabel: params.initiatingSurface.channelLabel,
			accountId: params.initiatingSurface.accountId,
			sentApproverDms: params.sentApproverDms,
			host: params.host,
			command: params.command,
			cwd: params.cwd,
			nodeId: params.nodeId,
			warningText: params.warningText
		} : {
			status: "approval-pending",
			approvalId: params.approvalId,
			approvalSlug: params.approvalSlug,
			expiresAtMs: params.expiresAtMs,
			allowedDecisions,
			host: params.host,
			command: params.command,
			cwd: params.cwd,
			nodeId: params.nodeId,
			warningText: params.warningText
		}
	};
}
//#endregion
//#region src/agents/bash-tools.exec-host-gateway.ts
/**
* Gateway-host exec approval and allowlist handling.
* Evaluates shell allowlists, auto-review, durable approvals, follow-up routing,
* and approved command execution for gateway-backed exec calls.
*/
const ONE_SHOT_ALLOW_ALWAYS = {
	kind: "one-shot",
	reasons: ["no-reusable-pattern"]
};
const MAX_GATEWAY_AUTO_REVIEW_CANDIDATES = 64;
const MAX_CONSECUTIVE_AUTO_REVIEW_DENIALS = 3;
const consecutiveAutoReviewDenials = new LruCache(256);
function recordAutoReviewDenial(sessionKey) {
	if (!sessionKey) return 1;
	const count = Math.min((consecutiveAutoReviewDenials.get(sessionKey) ?? 0) + 1, MAX_CONSECUTIVE_AUTO_REVIEW_DENIALS);
	consecutiveAutoReviewDenials.set(sessionKey, count);
	return count;
}
function publishGatewayGuardianReview(params, status, decision) {
	if (!params.toolCallId) return;
	const approvalReviewOutcome = status === "in_progress" ? "reviewing" : status === "approved" ? "approved" : "denied";
	const review = {
		id: `guardian:${params.toolCallId}`,
		label: "Guardian",
		status,
		...decision ? {
			riskLevel: decision.risk,
			rationale: decision.rationale
		} : {}
	};
	if (status !== "in_progress") params.onApprovalReview?.(review);
	if (!params.runId) return;
	emitAgentEvent({
		runId: params.runId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		stream: "tool",
		data: {
			phase: "review",
			name: "exec",
			toolCallId: params.toolCallId,
			hideFromChannelProgress: true,
			approvalReviewOutcome,
			review
		}
	});
}
function formatOutcomeExitLabel(outcome) {
	return outcome.timedOut ? "timeout" : `code ${outcome.exitCode ?? "?"}`;
}
function formatBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	return `${Math.max(0, Math.round(value))} bytes`;
}
function formatDiagnosticsContents(manifest) {
	const contents = Array.isArray(manifest.contents) ? manifest.contents : [];
	if (contents.length === 0) return [];
	const lines = [`Contents (${contents.length} files):`];
	for (const entry of contents.slice(0, 12)) {
		if (!isRecord(entry)) continue;
		const path = typeof entry.path === "string" ? entry.path : "";
		if (!path) continue;
		const bytes = formatBytes(entry.bytes);
		lines.push(`- ${bytes ? `${path} (${bytes})` : path}`);
	}
	if (contents.length > 12) lines.push(`- ... ${contents.length - 12} more`);
	return lines;
}
function formatDiagnosticsPrivacy(manifest) {
	const privacy = isRecord(manifest.privacy) ? manifest.privacy : null;
	if (!privacy) return [];
	const lines = ["Privacy:"];
	if (typeof privacy.payloadFree === "boolean") lines.push(`- payload-free: ${privacy.payloadFree ? "yes" : "no"}`);
	if (typeof privacy.rawLogsIncluded === "boolean") lines.push(`- raw logs included: ${privacy.rawLogsIncluded ? "yes" : "no"}`);
	const notes = Array.isArray(privacy.notes) ? privacy.notes.filter((note) => typeof note === "string") : [];
	for (const note of notes.slice(0, 4)) lines.push(`- ${note}`);
	return lines.length > 1 ? lines : [];
}
function formatDiagnosticsExportSuccess(aggregated) {
	const trimmed = aggregated.trim();
	if (!trimmed) return "Diagnostics export completed, but no JSON output was returned.";
	try {
		const parsed = JSON.parse(trimmed);
		if (!isRecord(parsed)) return trimmed;
		const manifest = isRecord(parsed.manifest) ? parsed.manifest : {};
		const lines = [
			"Diagnostics export created.",
			"",
			"Local Gateway bundle:"
		];
		const bundlePath = typeof parsed.path === "string" ? parsed.path : "";
		if (bundlePath) lines.push(`Path: ${bundlePath}`);
		const bytes = formatBytes(parsed.bytes);
		if (bytes) lines.push(`Size: ${bytes}`);
		if (typeof manifest.generatedAt === "string") lines.push(`Generated at: ${manifest.generatedAt}`);
		if (typeof manifest.openclawVersion === "string") lines.push(`OpenClaw version: ${manifest.openclawVersion}`);
		const contents = formatDiagnosticsContents(manifest);
		if (contents.length > 0) lines.push("", ...contents);
		const privacy = formatDiagnosticsPrivacy(manifest);
		if (privacy.length > 0) lines.push("", ...privacy);
		return lines.join("\n");
	} catch {
		return trimmed;
	}
}
function formatDiagnosticsExportFailure(params) {
	const output = normalizeNotifyOutput(tail(params.outcome.aggregated || "", 4e3));
	const lines = [`Diagnostics export failed (${params.exitLabel}).`];
	if (params.outcome.reason) lines.push(params.outcome.reason);
	if (output) lines.push("", output);
	return lines.join("\n");
}
function buildGatewayExecApprovalFollowupSummary(params) {
	const exitLabel = formatOutcomeExitLabel(params.outcome);
	let summary;
	if (params.trigger === "diagnostics") {
		const body = [params.outcome.status === "completed" && params.outcome.exitCode === 0 ? formatDiagnosticsExportSuccess(params.outcome.aggregated) : formatDiagnosticsExportFailure({
			outcome: params.outcome,
			exitLabel
		}), params.approvalFollowupText?.trim()].filter(Boolean).join("\n\n");
		summary = `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})\n${body}`;
	} else {
		const output = formatExecApprovalContinuationSourceOutput([{
			label: "output",
			value: params.outcome.aggregated
		}]);
		summary = output ? `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})\n${output}` : `Exec finished (gateway id=${params.approvalId}, session=${params.sessionId}, ${exitLabel})`;
	}
	return appendExecTimeoutRetryGuidance(summary, params.outcome.exitReason);
}
function buildGatewayExecApprovalDeniedToolResult(params) {
	const text = `Exec denied (${params.approvalId ? `gateway id=${params.approvalId}, ${params.deniedReason}` : params.deniedReason}): ${params.command}`;
	return {
		content: [{
			type: "text",
			text
		}],
		details: {
			status: "failed",
			exitCode: null,
			durationMs: 0,
			aggregated: text,
			timedOut: params.deniedReason.includes("timeout"),
			cwd: params.cwd
		}
	};
}
async function resolveGatewayExecApprovalDrift(params) {
	if (params.binding) {
		const current = await revalidateSystemRunMutableFileBinding({
			binding: params.binding,
			cwd: params.cwd
		});
		if (!current.ok) return current.message;
	}
	if (params.cwdSnapshot && !revalidateApprovedCwdSnapshot(params.cwdSnapshot)) return APPROVAL_CWD_DRIFT_DENIED_MESSAGE;
}
/** Rechecks a gateway approval binding at the caller's final spawn boundary. */
async function revalidateGatewayExecApprovalBinding(params) {
	const deniedReason = await resolveGatewayExecApprovalDrift(params);
	return deniedReason ? buildGatewayExecApprovalDeniedToolResult({
		deniedReason,
		command: params.command,
		cwd: params.cwd
	}) : void 0;
}
async function resolveGatewayExecApprovalFollowupText(params) {
	if (!params.approvalFollowup) return;
	try {
		return await params.approvalFollowup({
			approvalId: params.approvalId,
			sessionId: params.sessionId,
			trigger: params.trigger,
			outcome: params.outcome
		});
	} catch (error) {
		return `Diagnostics follow-up failed: ${error instanceof Error ? error.message : String(error)}`;
	}
}
/** Processes gateway exec policy and returns execution/approval/denial outcome. */
async function processGatewayAllowlist(params) {
	const cleanupMs = params.cleanupMs;
	const { approvals, hostSecurity, hostAsk, askFallback } = await resolveExecHostApprovalContext({
		agentId: params.agentId,
		security: params.security,
		ask: params.ask,
		bypassHostApprovalFloors: params.bypassHostApprovalFloors,
		host: "gateway"
	});
	const capturedCwd = hostSecurity === "allowlist" || hostAsk !== "off" ? captureApprovedCwdSnapshotSync(params.workdir) : void 0;
	if (capturedCwd && !capturedCwd.ok) return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
		deniedReason: capturedCwd.message,
		command: params.command,
		cwd: params.workdir
	}) };
	const approvedCwdSnapshot = capturedCwd?.snapshot;
	const evaluationPolicySnapshot = createExecApprovalPolicySnapshot({
		file: approvals.file,
		agentId: params.agentId
	});
	const fallbackSecurity = minSecurity(hostSecurity, askFallback);
	const allowlistEval = await evaluateShellAllowlistWithAuthorization({
		command: params.command,
		allowlist: approvals.allowlist,
		safeBins: params.safeBins,
		safeBinProfiles: params.safeBinProfiles,
		cwd: params.workdir,
		env: params.env,
		platform: process.platform,
		trustedSafeBinDirs: params.trustedSafeBinDirs
	});
	const allowlistMatches = allowlistEval.allowlistMatches;
	const analysisOk = allowlistEval.analysisOk;
	const allowlistSatisfied = hostSecurity === "allowlist" && analysisOk ? allowlistEval.allowlistSatisfied : false;
	const obsoleteGeneratedApprovalCount = countObsoleteGeneratedExecApprovals(approvals.file);
	if (hostSecurity === "allowlist" && !allowlistSatisfied && obsoleteGeneratedApprovalCount > 0) params.warnings.push(`${obsoleteGeneratedApprovalCount} older generated exec ${obsoleteGeneratedApprovalCount === 1 ? "approval is" : "approvals are"} inactive because they are not tied to a working directory. Run "openclaw doctor --fix", then rerun the workflow and choose "Always allow here".`);
	const durableApprovalSatisfied = hasDurableExecApproval({
		analysisOk,
		segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
		allowlist: approvals.allowlist,
		commandText: params.command
	});
	const hasAllowlistMiss = hostSecurity === "allowlist" && (!analysisOk || !allowlistSatisfied) && !durableApprovalSatisfied;
	function emitApprovalEvent(event) {
		emitTrustedSecurityEvent({
			category: "approval",
			action: event.action,
			outcome: event.outcome,
			severity: event.severity,
			actor: { kind: "agent" },
			target: {
				kind: "tool",
				name: "system.exec",
				owner: "gateway"
			},
			policy: {
				id: "exec.approval",
				decision: event.action === "exec.approval.requested" ? "ask" : event.outcome === "success" ? "allow" : "deny",
				...event.reason ? { reason: event.reason } : {}
			},
			control: {
				id: "exec.approval",
				family: "approval"
			},
			...event.reason ? { reason: event.reason } : {},
			attributes: {
				host: "gateway",
				security: hostSecurity,
				ask: hostAsk,
				segment_count: allowlistEval.segments.length,
				has_agent_id: Boolean(params.agentId?.trim()),
				...params.trigger ? { trigger: params.trigger } : {},
				...event.decision ? { decision: event.decision } : {}
			}
		});
	}
	const inlineEvalHit = params.strictInlineEval === true ? detectInlineEvalInSegments(allowlistEval.segments) : null;
	const allowAlwaysPersistence = resolveAllowAlwaysPersistenceDecision({
		segments: allowlistEval.segments,
		cwd: params.workdir,
		env: params.env,
		platform: process.platform,
		commandText: params.command,
		strictInlineEval: params.strictInlineEval === true,
		authorizationPlan: allowlistEval.authorizationPlan,
		runtimePayload: inlineEvalHit !== null
	});
	if (inlineEvalHit) params.warnings.push(`Warning: strict inline-eval mode requires reviewer or explicit approval for ${describeInterpreterInlineEval(inlineEvalHit)}.`);
	const exactCommandDurableApprovalSatisfied = hasExactCommandDurableExecApproval({
		allowlist: approvals.allowlist,
		commandText: params.command
	});
	const allowlistAuthorizationSatisfied = analysisOk && allowlistEval.allowlistSatisfied;
	const gatewayEnforcedCommand = (hostSecurity === "allowlist" || fallbackSecurity === "allowlist") && analysisOk ? process.platform === "win32" ? buildEnforcedShellCommand({
		command: params.command,
		segments: allowlistEval.segments,
		platform: process.platform
	}) : allowlistEval.authorizationPlan ? buildAuthorizedShellCommandFromPlan({
		plan: allowlistEval.authorizationPlan,
		mode: "enforced",
		segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy
	}) : {
		ok: false,
		reason: "authorization plan unavailable"
	} : null;
	let enforcedCommand;
	let allowlistPlanUnavailableReason = null;
	if (hostSecurity === "allowlist" && analysisOk && allowlistSatisfied) {
		const enforced = gatewayEnforcedCommand ?? {
			ok: false,
			reason: "authorization plan unavailable"
		};
		if (!enforced.ok || !enforced.command) allowlistPlanUnavailableReason = ("reason" in enforced ? enforced.reason : void 0) ?? "unsupported platform";
		else enforcedCommand = enforced.command;
	}
	const fallbackEnforcedCommand = fallbackSecurity === "allowlist" && allowlistAuthorizationSatisfied && gatewayEnforcedCommand?.ok === true ? gatewayEnforcedCommand.command : void 0;
	const fallbackAllowlistAuthorizationSatisfied = fallbackSecurity === "allowlist" && (allowlistAuthorizationSatisfied || exactCommandDurableApprovalSatisfied);
	const fallbackAllowlistPlanSatisfied = exactCommandDurableApprovalSatisfied || fallbackEnforcedCommand !== void 0;
	const applyTimedOutAllowlistFallback = (state) => {
		if (!state.baseDecision.timedOut || fallbackSecurity !== "allowlist") return state;
		if (!fallbackAllowlistAuthorizationSatisfied) return {
			...state,
			approvedByAsk: false,
			deniedReason: "approval-timeout: allowlist-miss"
		};
		if (!fallbackAllowlistPlanSatisfied) return {
			...state,
			approvedByAsk: false,
			deniedReason: "approval-timeout: execution-plan-miss"
		};
		return {
			...state,
			approvedByAsk: true,
			deniedReason: null
		};
	};
	let assertCommittedAuthorization;
	const assertCurrent = () => {
		if (!assertCommittedAuthorization) throw new Error("Exec authorization has not been committed");
		assertCommittedAuthorization();
	};
	const commitExecutionAuthorization = async (options) => {
		const policyAuthorization = options.source === "current-policy" || options.source === "ask-fallback";
		const durableApprovalRequired = options.source === "current-policy" ? hostSecurity === "allowlist" && durableApprovalSatisfied && (!analysisOk || !allowlistSatisfied || exactCommandDurableApprovalSatisfied && allowlistPlanUnavailableReason !== null) : options.source === "ask-fallback" ? fallbackSecurity === "allowlist" && exactCommandDurableApprovalSatisfied && fallbackEnforcedCommand === void 0 : false;
		const durableApprovalRequirement = resolveDurableExecApprovalRequirement({
			durableApprovalRequired,
			allowlist: approvals.allowlist,
			commandText: params.command
		});
		const delayedAuthorization = options.source === "explicit-approval" || options.source === "auto-review";
		assertCommittedAuthorization = await commitExecAuthorizationLocked({
			agentId: params.agentId,
			matches: allowlistMatches,
			command: params.command,
			resolvedPath: options.resolvedPath,
			authorization: {
				source: options.source,
				security: options.source === "ask-fallback" ? fallbackSecurity : hostSecurity,
				ask: hostAsk,
				bypassHostApprovalFloors: params.bypassHostApprovalFloors,
				allowlistSatisfied: allowlistAuthorizationSatisfied || durableApprovalSatisfied,
				...delayedAuthorization ? { policySnapshot: evaluationPolicySnapshot } : {},
				requireAutoAllowSkills: policyAuthorization && allowlistEval.segmentSatisfiedBy.includes("skills"),
				requireExactCommandApproval: policyAuthorization && durableApprovalRequirement === "exact-command",
				requireDurableAllowlistApproval: policyAuthorization && durableApprovalRequirement === "segment-allowlist"
			},
			...options.allowAlwaysDecision ? { allowAlwaysDecision: options.allowAlwaysDecision } : {}
		});
	};
	const hasHeredocSegment = allowlistEval.segments.some((segment) => segment.argv.some((token) => token.startsWith("<<")));
	const requiresHeredocApproval = hasHeredocSegment && hostSecurity === "allowlist" && analysisOk && allowlistSatisfied;
	const timedOutFallbackRequiresHeredocApproval = hasHeredocSegment && fallbackAllowlistAuthorizationSatisfied;
	const requiresInlineEvalApproval = inlineEvalHit !== null;
	const requiresAllowlistPlanApproval = hostSecurity === "allowlist" && analysisOk && allowlistSatisfied && !exactCommandDurableApprovalSatisfied && !enforcedCommand && allowlistPlanUnavailableReason !== null;
	const policyRequiresAsk = requiresExecApproval({
		ask: hostAsk,
		security: hostSecurity,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied
	}) || requiresAllowlistPlanApproval || requiresHeredocApproval || requiresInlineEvalApproval;
	const denyHeadlessApproval = () => {
		const text = params.approvalFollowupText ? `${params.approvalFollowupText}\nCommand: ${params.command}` : `Exec denied (approval_required): ${params.command}`;
		return { deniedResult: {
			content: [{
				type: "text",
				text
			}],
			details: {
				status: "failed",
				exitCode: null,
				failureKind: "approval_required",
				durationMs: 0,
				aggregated: text,
				timedOut: false,
				cwd: params.workdir
			}
		} };
	};
	if (requiresHeredocApproval) params.warnings.push("Warning: heredoc execution requires reviewer or explicit approval in allowlist mode.");
	if (requiresAllowlistPlanApproval) params.warnings.push(`Warning: allowlist auto-execution is unavailable on ${process.platform}; reviewer or explicit approval is required.`);
	if (policyRequiresAsk && params.nonInteractiveApproval && params.autoReview !== true) return denyHeadlessApproval();
	if (params.autoReview !== true && requiresAllowlistPlanApproval && allowlistPlanUnavailableReason === "shell expansion in enforced arguments" && hostAsk === "off" && askFallback === "deny") {
		const deniedReason = "ask-fallback-deny: execution-plan-miss";
		emitApprovalEvent({
			action: "exec.approval.denied",
			outcome: "denied",
			severity: "medium",
			reason: deniedReason
		});
		return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
			deniedReason,
			command: params.command,
			cwd: params.workdir
		}) };
	}
	let mutableFileBinding;
	const durableApprovalRequiresBinding = hostSecurity === "allowlist" && durableApprovalSatisfied && (!analysisOk || !allowlistSatisfied || exactCommandDurableApprovalSatisfied && allowlistPlanUnavailableReason !== null);
	if (policyRequiresAsk || durableApprovalRequiresBinding) {
		const prepared = await prepareSystemRunMutableFileBinding({
			command: analysisOk ? {
				kind: "segments",
				segments: allowlistEval.segments
			} : {
				kind: "shell",
				text: params.command
			},
			cwd: params.workdir,
			env: params.env
		});
		if (!prepared.ok) {
			if (policyRequiresAsk && params.nonInteractiveApproval) return denyHeadlessApproval();
			return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
				deniedReason: prepared.message,
				command: params.command,
				cwd: params.workdir
			}) };
		}
		mutableFileBinding = prepared.binding;
	}
	const mutableFileApprovalRequiresOneShot = mutableFileBinding?.operands.some((operand) => operand.kind === "mutable") ?? false;
	const cronExecutionSource = params.runId && params.agentId ? lookupCronRunExecSource(params.runId) : void 0;
	if (policyRequiresAsk && hostAsk !== "always" && hostSecurity !== "deny" && cronExecutionSource !== void 0 && cronExecutionSource.agentId === params.agentId && !mutableFileApprovalRequiresOneShot && !requiresInlineEvalApproval && !requiresHeredocApproval) {
		const grantLookup = {
			agentId: cronExecutionSource.agentId,
			cronJobId: cronExecutionSource.jobId,
			jobConfigRevision: cronExecutionSource.jobConfigRevision,
			operationBinding: buildCronExecOperationBinding({
				command: params.command,
				cwd: params.workdir,
				env: params.requestedEnv
			})
		};
		let grantCheck;
		try {
			grantCheck = validateCronStandingGrant(grantLookup);
		} catch {
			grantCheck = void 0;
		}
		if (grantCheck?.outcome === "consumed") {
			const emitGrantEvent = (approved, reason) => emitApprovalEvent({
				action: approved ? "exec.approval.approved" : "exec.approval.denied",
				outcome: approved ? "success" : "denied",
				severity: "medium",
				reason,
				decision: "standing-grant"
			});
			return {
				execCommandOverride: enforcedCommand,
				revalidateBeforeExecution: async () => {
					let grantUse;
					try {
						grantUse = consumeCronStandingGrant(grantLookup);
					} catch {
						grantUse = void 0;
					}
					if (grantUse?.outcome === "consumed") {
						emitGrantEvent(true, `standing-grant grant=${grantUse.grant.grantId} approval=${grantUse.grant.mintedByApprovalId}`);
						return;
					}
					const invalidReason = grantUse?.outcome ?? "grant-store-unavailable";
					emitGrantEvent(false, `standing-grant-invalidated ${invalidReason}`);
					return buildGatewayExecApprovalDeniedToolResult({
						deniedReason: `standing grant no longer valid (${invalidReason}); the next occurrence will prompt for approval again`,
						command: params.command,
						cwd: params.workdir
					});
				}
			};
		}
	}
	const requiresAsk = policyRequiresAsk || durableApprovalRequiresBinding && mutableFileApprovalRequiresOneShot;
	const autoReviewEnforcedCommand = gatewayEnforcedCommand?.ok === true ? gatewayEnforcedCommand.command : void 0;
	const autoReviewBlockedByShellStartup = allowlistEval.segments.some((segment) => hasPosixShellStartupBeforeInlineCommand(segment.argv));
	const dispatchEligibility = resolveUnpinnedAutoApprovalEligibility({
		authorizationPlan: allowlistEval.authorizationPlan,
		binding: mutableFileBinding
	});
	const reviewedCommand = dispatchEligibility.eligible && allowlistEval.authorizationPlan && mutableFileBinding ? buildReviewedShellCommandFromPlan({
		plan: allowlistEval.authorizationPlan,
		binding: mutableFileBinding,
		segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy
	}) : void 0;
	const boundApprovedCommand = reviewedCommand?.ok ? reviewedCommand.command : void 0;
	const approvedEnforcedCommand = boundApprovedCommand ?? autoReviewEnforcedCommand;
	const unpinnedEligibility = autoReviewEnforcedCommand !== void 0 ? { eligible: true } : dispatchEligibility.eligible && approvedEnforcedCommand === void 0 ? {
		eligible: false,
		reason: EXEC_AUTO_REVIEW_DISPATCH_IDENTITY_WARNING
	} : dispatchEligibility;
	const approvalAllowAlwaysPersistence = mutableFileApprovalRequiresOneShot || params.autoReview === true && (autoReviewBlockedByShellStartup || !unpinnedEligibility.eligible) || requiresAllowlistPlanApproval && allowAlwaysPersistence.kind === "patterns" ? ONE_SHOT_ALLOW_ALWAYS : allowAlwaysPersistence;
	const approvalAllowedDecisions = resolveExecApprovalAllowedDecisions({
		ask: hostAsk,
		allowAlwaysPersistence: approvalAllowAlwaysPersistence
	});
	const approvalUnavailableDecisions = resolveExecApprovalUnavailableDecisions({
		ask: hostAsk,
		allowAlwaysPersistence: approvalAllowAlwaysPersistence
	});
	const unavailableDecisionRequestParams = approvalUnavailableDecisions.length > 0 ? { unavailableDecisions: approvalUnavailableDecisions } : {};
	if (requiresAsk) {
		if (!mutableFileBinding) return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
			deniedReason: "SYSTEM_RUN_DENIED: mutable file approval binding is unavailable",
			command: params.command,
			cwd: params.workdir
		}) };
		const approvalMutableFileBinding = mutableFileBinding;
		const revalidateBeforeExecution = approvedCwdSnapshot || approvalMutableFileBinding.operands.length > 0 ? () => revalidateGatewayExecApprovalBinding({
			binding: approvalMutableFileBinding,
			cwdSnapshot: approvedCwdSnapshot,
			command: params.command,
			cwd: params.workdir
		}) : void 0;
		const authorizationCandidates = allowlistEval.authorizationPlan?.ok ? allowlistEval.authorizationPlan.groups.flatMap((group) => group.candidates) : [];
		const autoReviewSingleSegment = authorizationCandidates.length === 1 && allowlistEval.segmentSatisfiedBy[0] !== "safeBuiltins" ? authorizationCandidates[0]?.sourceSegment : void 0;
		const autoReviewResolvedPath = autoReviewSingleSegment ? resolveExecutionTargetTrustPath(autoReviewSingleSegment.resolution, params.workdir) : void 0;
		if (params.autoReview === true && autoReviewBlockedByShellStartup) params.warnings.push(EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING);
		const autoReviewBlockedByDispatchIdentity = !unpinnedEligibility.eligible;
		if (params.autoReview === true && !autoReviewBlockedByShellStartup && !unpinnedEligibility.eligible) params.warnings.push(unpinnedEligibility.reason);
		const canAutoReviewApprovalMiss = params.autoReview === true && hostAsk !== "always" && Math.max(authorizationCandidates.length, allowlistEval.segments.length) <= MAX_GATEWAY_AUTO_REVIEW_CANDIDATES && !autoReviewBlockedByShellStartup && !autoReviewBlockedByDispatchIdentity;
		let autoReviewRequiresHumanApproval = params.autoReview === true && autoReviewBlockedByShellStartup || params.autoReview === true && autoReviewBlockedByDispatchIdentity || params.autoReview === true && hostAsk !== "always" && !canAutoReviewApprovalMiss || requiresAllowlistPlanApproval || requiresHeredocApproval;
		if (canAutoReviewApprovalMiss) {
			const reviewer = params.autoReviewer ?? defaultExecAutoReviewer;
			publishGatewayGuardianReview(params, "in_progress");
			const pendingDecision = resolveExecAutoReviewDecision(reviewer, {
				command: params.command,
				argv: autoReviewResolvedPath ? autoReviewSingleSegment?.argv : void 0,
				resolvedPath: autoReviewResolvedPath,
				cwd: params.workdir,
				envKeys: Object.keys(params.requestedEnv ?? {}).toSorted(),
				host: "gateway",
				reason: requiresInlineEvalApproval ? "strict-inline-eval" : hasHeredocSegment ? "heredoc" : autoReviewEnforcedCommand === void 0 ? "execution-plan-miss" : hasAllowlistMiss ? "allowlist-miss" : "approval-required",
				analysis: {
					parsed: analysisOk,
					allowlistMatched: allowlistSatisfied,
					durableApprovalMatched: durableApprovalSatisfied,
					inlineEval: requiresInlineEvalApproval,
					heredoc: hasHeredocSegment
				},
				agent: {
					id: params.agentId,
					sessionKey: params.sessionKey
				}
			});
			let decision;
			try {
				decision = params.signal ? await abortable(params.signal, pendingDecision) : await pendingDecision;
				params.signal?.throwIfAborted();
			} catch (error) {
				publishGatewayGuardianReview(params, "aborted");
				throw error;
			}
			const denialEscalated = decision.decision === "deny" && recordAutoReviewDenial(params.sessionKey) >= MAX_CONSECUTIVE_AUTO_REVIEW_DENIALS;
			publishGatewayGuardianReview(params, decision.decision === "allow-once" ? "approved" : "denied", decision);
			switch (decision.decision) {
				case "allow-once": {
					if (decision.risk !== "low" && decision.risk !== "medium") break;
					if (params.sessionKey) consecutiveAutoReviewDenials.delete(params.sessionKey);
					const deniedResult = await revalidateGatewayExecApprovalBinding({
						binding: approvalMutableFileBinding,
						cwdSnapshot: approvedCwdSnapshot,
						command: params.command,
						cwd: params.workdir
					});
					if (deniedResult) return { deniedResult };
					params.warnings.push(`Exec auto-review allowed once (${formatExecAutoReviewAssessment(decision)}): ${decision.rationale}`);
					emitApprovalEvent({
						action: "exec.approval.approved",
						outcome: "success",
						severity: "medium",
						decision: "auto-review"
					});
					await commitExecutionAuthorization({
						source: "auto-review",
						resolvedPath: autoReviewResolvedPath
					});
					return {
						execCommandOverride: approvedEnforcedCommand,
						assertCurrent,
						...revalidateBeforeExecution ? { revalidateBeforeExecution } : {}
					};
				}
				case "deny":
					if (denialEscalated) {
						params.warnings.push("Exec auto-review denied 3 consecutive commands for this session; escalating to human approval");
						break;
					}
					emitApprovalEvent({
						action: "exec.approval.denied",
						outcome: "denied",
						severity: "medium",
						decision: "auto-review"
					});
					return { deniedResult: buildExecAutoReviewDeniedToolResult({
						command: params.command,
						cwd: params.workdir,
						decision,
						toolCallId: params.toolCallId
					}) };
				case "ask": break;
				default: throw new Error("Unsupported exec auto-review decision", { cause: decision });
			}
			params.warnings.push(`Exec auto-review deferred to human approval (${formatExecAutoReviewAssessment(decision)}): ${decision.rationale}`);
			autoReviewRequiresHumanApproval = true;
		}
		if (params.nonInteractiveApproval) return denyHeadlessApproval();
		const registerGatewayApproval = async (approvalId) => await registerExecApprovalRequestForHostOrThrow({
			approvalId,
			command: params.command,
			env: params.requestedEnv,
			workdir: params.workdir,
			host: "gateway",
			security: hostSecurity,
			ask: hostAsk,
			...unavailableDecisionRequestParams,
			commandHighlighting: params.commandHighlighting,
			warningText: params.warnings.join("\n").trim() || void 0,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			runId: params.runId,
			toolCallId: params.toolCallId,
			trigger: params.trigger,
			approvalReviewerDeviceIds: params.approvalReviewerDeviceId ? [params.approvalReviewerDeviceId] : void 0,
			resolvedPath: resolveApprovalAuditTrustPath(allowlistEval.segments[0]?.resolution ?? null, params.workdir),
			...buildExecApprovalTurnSourceContext(params)
		});
		const approvalRoute = await createExecApprovalRequestRoute({
			warnings: params.warnings,
			approvalRunningNoticeMs: params.approvalRunningNoticeMs,
			createApprovalSlug,
			turnSourceChannel: params.turnSourceChannel,
			turnSourceAccountId: params.turnSourceAccountId,
			register: registerGatewayApproval,
			askFallback,
			resolveTimedOut: applyTimedOutAllowlistFallback,
			requiresExplicitApproval: requiresInlineEvalApproval,
			requiresAutoReviewHumanApproval: autoReviewRequiresHumanApproval || requiresHeredocApproval || timedOutFallbackRequiresHeredocApproval
		});
		const { approvalId, approvalSlug, warningText, expiresAtMs, preResolvedDecision, initiatingSurface, sentApproverDms, unavailableReason } = approvalRoute;
		emitApprovalEvent({
			action: "exec.approval.requested",
			outcome: "success",
			severity: "low"
		});
		if (approvalRoute.kind === "inline") {
			const strictInlineEvalDecision = approvalRoute.state;
			if (strictInlineEvalDecision.deniedReason || !strictInlineEvalDecision.approvedByAsk) {
				emitApprovalEvent({
					action: "exec.approval.denied",
					outcome: "denied",
					severity: "medium",
					reason: strictInlineEvalDecision.deniedReason ?? "approval-required",
					decision: preResolvedDecision
				});
				throw new Error(buildHeadlessExecApprovalDeniedMessage({
					trigger: params.trigger,
					host: "gateway",
					security: hostSecurity,
					ask: hostAsk,
					askFallback
				}));
			}
			const deniedReason = await resolveGatewayExecApprovalDrift({
				binding: approvalMutableFileBinding,
				cwdSnapshot: approvedCwdSnapshot,
				cwd: params.workdir
			});
			if (deniedReason) return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
				approvalId,
				deniedReason,
				command: params.command,
				cwd: params.workdir
			}) };
			emitApprovalEvent({
				action: "exec.approval.approved",
				outcome: "success",
				severity: "medium",
				decision: null
			});
			await commitExecutionAuthorization({
				source: "ask-fallback",
				resolvedPath: resolveApprovalAuditTrustPath(allowlistEval.segments[0]?.resolution ?? null, params.workdir)
			});
			const execCommandOverride = fallbackSecurity === "allowlist" ? fallbackEnforcedCommand : enforcedCommand;
			return {
				execCommandOverride,
				allowWithoutEnforcedCommand: execCommandOverride === void 0,
				assertCurrent,
				...revalidateBeforeExecution ? { revalidateBeforeExecution } : {}
			};
		}
		const resolvedPath = resolveApprovalAuditTrustPath(allowlistEval.segments[0]?.resolution ?? null, params.workdir);
		const resolveApprovalForExecution = async (onFailure) => {
			const approvalOutcome = await resolveExecApprovalWaitOutcome({
				approvalId,
				preResolvedDecision,
				signal: params.signal,
				askFallback,
				resolveTimedOut: applyTimedOutAllowlistFallback,
				requiresExplicitApproval: requiresInlineEvalApproval,
				requiresAutoReviewHumanApproval: autoReviewRequiresHumanApproval || requiresHeredocApproval || timedOutFallbackRequiresHeredocApproval
			});
			if (approvalOutcome.kind === "run-aborted") return {
				deniedReason: "run-aborted",
				requestFailed: false,
				runAborted: true,
				authorizationSource: "explicit-approval",
				allowAlwaysDecision: void 0
			};
			if (approvalOutcome.kind === "request-failed") {
				await onFailure();
				emitApprovalEvent({
					action: "exec.approval.denied",
					outcome: "error",
					severity: "high",
					reason: "approval-request-failed"
				});
				return {
					deniedReason: "approval-request-failed",
					requestFailed: true,
					authorizationSource: "explicit-approval",
					allowAlwaysDecision: void 0
				};
			}
			const { decision, state: resolvedDecision } = approvalOutcome;
			if (decision !== null && params.sessionKey) consecutiveAutoReviewDenials.delete(params.sessionKey);
			const { approvedByAsk } = resolvedDecision;
			let { deniedReason } = resolvedDecision;
			if (!approvedByAsk && hasAllowlistMiss) deniedReason = deniedReason ?? "allowlist-miss";
			if (!deniedReason && approvedByAsk) {
				const bindingDenied = await resolveGatewayExecApprovalDrift({
					binding: approvalMutableFileBinding,
					cwdSnapshot: approvedCwdSnapshot,
					cwd: params.workdir
				});
				if (bindingDenied) deniedReason = bindingDenied;
			}
			emitApprovalEvent({
				action: deniedReason ? "exec.approval.denied" : "exec.approval.approved",
				outcome: deniedReason ? "denied" : "success",
				severity: "medium",
				reason: deniedReason ?? void 0,
				decision
			});
			return {
				deniedReason,
				requestFailed: false,
				authorizationSource: decision === null ? "ask-fallback" : "explicit-approval",
				allowAlwaysDecision: decision === "allow-always" && !cronExecutionSource ? approvalAllowAlwaysPersistence : void 0,
				execCommandOverride: decision === null && fallbackSecurity === "allowlist" ? fallbackEnforcedCommand : boundApprovedCommand ?? enforcedCommand
			};
		};
		if (unavailableReason === null && params.approvalFollowupMode === void 0) {
			if (params.runId) emitAgentEvent({
				runId: params.runId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				stream: "lifecycle",
				data: {
					phase: "waiting-approval",
					approvalId,
					toolCallId: params.toolCallId
				}
			});
			let approvalDecision;
			try {
				approvalDecision = await resolveApprovalForExecution(() => void 0);
			} finally {
				if (params.runId) emitAgentEvent({
					runId: params.runId,
					sessionKey: params.sessionKey,
					sessionId: params.sessionId,
					stream: "lifecycle",
					data: {
						phase: "approval-resolved",
						approvalId,
						toolCallId: params.toolCallId
					}
				});
			}
			if (approvalDecision.runAborted) params.signal?.throwIfAborted();
			if (approvalDecision.deniedReason) return { deniedResult: buildGatewayExecApprovalDeniedToolResult({
				approvalId,
				deniedReason: approvalDecision.deniedReason,
				command: params.command,
				cwd: params.workdir
			}) };
			params.signal?.throwIfAborted();
			await commitExecutionAuthorization({
				source: approvalDecision.authorizationSource,
				resolvedPath: resolvedPath ?? void 0,
				...approvalDecision.allowAlwaysDecision ? { allowAlwaysDecision: approvalDecision.allowAlwaysDecision } : {}
			});
			params.signal?.throwIfAborted();
			return {
				execCommandOverride: approvalDecision.execCommandOverride,
				allowWithoutEnforcedCommand: approvalDecision.execCommandOverride === void 0,
				assertCurrent,
				...revalidateBeforeExecution ? { revalidateBeforeExecution } : {}
			};
		}
		const effectiveTimeout = typeof params.timeoutSec === "number" ? params.timeoutSec : params.defaultTimeoutSec;
		const followupTarget = {
			approvalId,
			...params.agentId ? { agentId: params.agentId } : {},
			sessionKey: params.notifySessionKey ?? params.sessionKey,
			expectedSessionId: params.sessionId,
			sessionStore: params.sessionStore,
			bashElevated: params.bashElevated,
			turnSourceChannel: params.turnSourceChannel,
			turnSourceTo: params.turnSourceTo,
			turnSourceAccountId: params.turnSourceAccountId,
			turnSourceThreadId: params.turnSourceThreadId,
			direct: params.approvalFollowupMode === "direct"
		};
		const denyApprovalStateWriteFailure = async () => {
			emitApprovalEvent({
				action: "exec.approval.denied",
				outcome: "error",
				severity: "high",
				reason: "approval-state-write-failed"
			});
			await sendExecApprovalFollowupResult(followupTarget, `Exec denied (gateway id=${approvalId}, approval-state-write-failed): ${params.command}`);
		};
		const sendApprovalRequestFailedFollowup = async () => {
			if (!params.signal?.aborted) await sendExecApprovalFollowupResult(followupTarget, `Exec denied (gateway id=${approvalId}, approval-request-failed): ${params.command}`);
		};
		let gatewayInvocationStarted = false;
		(async () => {
			const approvalDecision = await resolveApprovalForExecution(sendApprovalRequestFailedFollowup);
			if (approvalDecision.requestFailed) return;
			if (approvalDecision.runAborted) return;
			if (params.signal?.aborted) return;
			if (approvalDecision.deniedReason) {
				await sendExecApprovalFollowupResult(followupTarget, `Exec denied (gateway id=${approvalId}, ${approvalDecision.deniedReason}): ${params.command}`);
				return;
			}
			let admitted;
			try {
				admitted = await runWithGatewayIndependentRootWorkAdmission(async () => {
					if (params.signal?.aborted) return { status: "run-aborted" };
					try {
						await commitExecutionAuthorization({
							source: approvalDecision.authorizationSource,
							resolvedPath: resolvedPath ?? void 0,
							...approvalDecision.allowAlwaysDecision ? { allowAlwaysDecision: approvalDecision.allowAlwaysDecision } : {}
						});
					} catch {
						return { status: "approval-state-write-failed" };
					}
					if (params.signal?.aborted) return { status: "run-aborted" };
					const bindingDenied = await resolveGatewayExecApprovalDrift({
						binding: approvalMutableFileBinding,
						cwdSnapshot: approvedCwdSnapshot,
						cwd: params.workdir
					});
					if (bindingDenied) return {
						status: "operand-drift",
						message: bindingDenied
					};
					let run;
					let finalBindingDenied;
					const finalBindingDeniedError = /* @__PURE__ */ new Error("gateway approval changed before spawn");
					try {
						gatewayInvocationStarted = true;
						run = await runExecProcess({
							command: params.command,
							execCommand: approvalDecision.execCommandOverride,
							workdir: params.workdir,
							env: params.env,
							secretEgressBindings: params.secretEgressBindings,
							githubProfileDir: params.githubProfileDir,
							pathPrepend: params.pathPrepend,
							sandbox: void 0,
							containerWorkdir: null,
							usePty: params.pty,
							warnings: params.warnings,
							maxOutput: params.maxOutput,
							pendingMaxOutput: params.pendingMaxOutput,
							cleanupMs,
							notifyOnExit: false,
							notifyOnExitEmptySuccess: false,
							scopeKey: params.scopeKey,
							sessionKey: params.notifySessionKey ?? params.sessionKey,
							timeoutSec: effectiveTimeout,
							startupSignal: params.signal,
							assertCurrent,
							beforeSpawn: async () => {
								finalBindingDenied = await resolveGatewayExecApprovalDrift({
									binding: approvalMutableFileBinding,
									cwdSnapshot: approvedCwdSnapshot,
									cwd: params.workdir
								});
								if (finalBindingDenied) throw finalBindingDeniedError;
							}
						});
					} catch (error) {
						if (params.signal?.aborted) return { status: "run-aborted" };
						if (error === finalBindingDeniedError && finalBindingDenied) return {
							status: "operand-drift",
							message: finalBindingDenied
						};
						return { status: "spawn-failed" };
					}
					markBackgrounded(run.session);
					return {
						status: "started",
						run
					};
				}, "exec-host:approval");
			} catch (error) {
				if (error instanceof GatewayDrainingError) {
					await sendExecApprovalFollowupResult(followupTarget, `Exec denied (gateway id=${approvalId}, gateway-draining): ${params.command}`);
					return;
				}
				admitted = { status: "spawn-failed" };
			}
			if (admitted.status === "approval-state-write-failed") {
				await denyApprovalStateWriteFailure();
				return;
			}
			if (admitted.status === "run-aborted") return;
			if (admitted.status === "operand-drift") {
				await sendExecApprovalFollowupResult(followupTarget, admitted.message);
				return;
			}
			if (admitted.status === "spawn-failed") {
				await sendExecApprovalFollowupResult(followupTarget, `Exec denied (gateway id=${approvalId}, spawn-failed): ${params.command}`);
				return;
			}
			const { run } = admitted;
			const outcome = await run.promise;
			const dynamicFollowupText = await resolveGatewayExecApprovalFollowupText({
				approvalFollowup: params.approvalFollowup,
				approvalId,
				sessionId: run.session.id,
				trigger: params.trigger,
				outcome
			});
			const approvalFollowupText = normalizeStringEntries([params.approvalFollowupText ?? "", dynamicFollowupText ?? ""]).join("\n\n");
			const summary = buildGatewayExecApprovalFollowupSummary({
				approvalId,
				sessionId: run.session.id,
				outcome,
				trigger: params.trigger,
				approvalFollowupText
			});
			await sendExecApprovalFollowupResult(followupTarget, summary);
		})().catch(async () => {
			if (gatewayInvocationStarted || params.signal?.aborted) return;
			await sendApprovalRequestFailedFollowup();
		}).catch(() => void 0);
		return { pendingResult: buildExecApprovalPendingToolResult({
			host: "gateway",
			command: params.command,
			cwd: params.workdir,
			warningText,
			approvalId,
			approvalSlug,
			expiresAtMs,
			initiatingSurface,
			sentApproverDms,
			unavailableReason,
			allowedDecisions: approvalAllowedDecisions,
			processContinuationAvailable: params.processContinuationAvailable
		}) };
	}
	if (hasAllowlistMiss) throw new Error("exec denied: allowlist miss");
	await commitExecutionAuthorization({
		source: "current-policy",
		resolvedPath: resolveApprovalAuditTrustPath(allowlistEval.segments[0]?.resolution ?? null, params.workdir)
	});
	return {
		execCommandOverride: enforcedCommand,
		assertCurrent,
		...approvedCwdSnapshot ? { revalidateBeforeExecution: () => revalidateGatewayExecApprovalBinding({
			cwdSnapshot: approvedCwdSnapshot,
			command: params.command,
			cwd: params.workdir
		}) } : {}
	};
}
//#endregion
//#region src/agents/bash-tools.exec-host-node-failure.ts
/** Only NOT_CONNECTED plus explicit pre-dispatch provenance proves a retry cannot duplicate work. */
function classifyNodeInvokeFailure(error) {
	const errorRecord = asNullableRecord(error);
	const details = asNullableRecord(errorRecord?.details);
	const nodeError = asNullableRecord(details?.nodeError);
	const code = normalizeOptionalString(nodeError?.code);
	const message = normalizeOptionalString(nodeError?.message) ?? (error instanceof Error ? error.message : normalizeOptionalString(error)) ?? "node invoke failed";
	const nodeCommandDispatched = typeof details?.nodeCommandDispatched === "boolean" ? details.nodeCommandDispatched : void 0;
	const requestSent = typeof errorRecord?.requestSent === "boolean" ? errorRecord.requestSent : void 0;
	if (code === "SYSTEM_RUN_DENIED") return {
		reason: "policy-denied",
		retrySafe: false,
		code,
		message
	};
	if (code === "NOT_CONNECTED" && nodeCommandDispatched === false) return {
		reason: "not-dispatched",
		retrySafe: true,
		code,
		message,
		nodeCommandDispatched,
		...requestSent !== void 0 ? { requestSent } : {}
	};
	return {
		reason: "outcome-unknown",
		retrySafe: false,
		...code ? { code } : {},
		message,
		...nodeCommandDispatched !== void 0 ? { nodeCommandDispatched } : {},
		...requestSent !== void 0 ? { requestSent } : {}
	};
}
function formatNodeInvokeFailureText(params) {
	return [
		...params.failure.reason === "outcome-unknown" ? [`Node command outcome is unknown for ${params.nodeId}.`, "The command may have executed. Do not rerun it automatically."] : params.failure.reason === "policy-denied" ? [`Node command was denied before execution on ${params.nodeId}.`, "Resolve the reported refusal before retrying."] : [`Node command was not dispatched to ${params.nodeId}.`, "It can be retried after the node reconnects."],
		"",
		"Command:",
		params.command,
		"",
		`Details: ${params.failure.message}`
	].join("\n");
}
function formatNodeInvokeFailureFollowup(params) {
	return `${params.failure.reason === "outcome-unknown" ? `Exec outcome unknown (node=${params.nodeId} id=${params.approvalId}, outcome-unknown)` : params.failure.reason === "policy-denied" ? `Exec denied (node=${params.nodeId} id=${params.approvalId}, policy-denied)` : `Exec not dispatched (node=${params.nodeId} id=${params.approvalId}, not-dispatched)`}\n${formatNodeInvokeFailureText(params)}`;
}
function formatNodeInvokeFailureToolResult(params) {
	const text = formatNodeInvokeFailureText(params);
	return {
		content: [{
			type: "text",
			text: renderExecUpdateText({
				tailText: text,
				warnings: params.warnings ?? []
			})
		}],
		details: {
			status: "failed",
			exitCode: null,
			failureKind: params.failure.reason,
			reason: params.failure.reason,
			nodeInvokeFailure: {
				...params.failure.code ? { failureCode: params.failure.code } : {},
				message: params.failure.message,
				...params.failure.nodeCommandDispatched !== void 0 ? { nodeCommandDispatched: params.failure.nodeCommandDispatched } : {},
				...params.failure.requestSent !== void 0 ? { requestSent: params.failure.requestSent } : {}
			},
			durationMs: Date.now() - params.startedAt,
			aggregated: text,
			cwd: params.cwd
		}
	};
}
/** Invokes node system.run and turns every non-cancellation failure into provenance-aware data. */
async function invokeNodeSystemRun(params) {
	try {
		const callOptions = params.scopes || params.signal ? {
			...params.scopes ? { scopes: params.scopes } : {},
			...params.signal ? { signal: params.signal } : {}
		} : void 0;
		const raw = await callGatewayTool("node.invoke", { timeoutMs: params.invokeWaitMs }, params.invoke, callOptions);
		if (typeof asNullableRecord(asNullableRecord(raw)?.payload)?.success !== "boolean") return {
			ok: false,
			failure: {
				reason: "outcome-unknown",
				retrySafe: false,
				message: "malformed node invoke response"
			}
		};
		return {
			ok: true,
			raw
		};
	} catch (error) {
		if (params.signal?.aborted) throw error;
		return {
			ok: false,
			failure: classifyNodeInvokeFailure(error)
		};
	}
}
//#endregion
//#region src/infra/node-shell.ts
/** Build argv for running a command through the platform default shell. */
function buildNodeShellCommand(command, platform) {
	const normalized = normalizeLowercaseStringOrEmpty((platform ?? "").trim());
	if (normalized.startsWith("win")) return [
		"cmd.exe",
		"/d",
		"/s",
		"/c",
		command
	];
	if (normalized === "darwin" || normalized.startsWith("macos")) return [
		"/bin/sh",
		"-c",
		command
	];
	return [
		"/bin/sh",
		"-lc",
		command
	];
}
//#endregion
//#region src/agents/bash-tools.exec-host-node-approval-eligibility.ts
function resolveNodeAutoApprovalEligibility(params) {
	const platform = params.platform === "win32" ? "win32" : params.platform === "darwin" ? "darwin" : "linux";
	const preparedTrustPlan = resolveExecWrapperTrustPlan(params.argv, void 0, platform);
	const pinnedDirectCommand = params.shellPayload === null && preparedTrustPlan.dispatchChain?.length === 1 && (platform === "win32" ? path.win32 : path.posix).isAbsolute(params.argv[0] ?? "");
	const expectedTransport = params.shellPayload ? buildNodeShellCommand(params.shellPayload, params.platform) : void 0;
	const payloadPlan = params.authorizationPlan;
	const payloadCandidates = payloadPlan?.ok ? payloadPlan.groups.flatMap((group) => group.candidates) : [];
	const payloadSegment = payloadCandidates[0]?.sourceSegment;
	const pinnedTransportCommand = expectedTransport !== void 0 && expectedTransport.length === params.argv.length && expectedTransport.every((arg, index) => arg === params.argv[index]) && payloadCandidates.length === 1 && payloadCandidates[0]?.transport.kind === "direct" && payloadCandidates[0]?.trustMode === "executable" && payloadSegment !== void 0 && resolveExecWrapperTrustPlan(payloadSegment.sourceArgv ?? payloadSegment.argv, void 0, platform).dispatchChain?.length === 1 && (platform === "win32" ? path.win32 : path.posix).isAbsolute(payloadSegment.argv[0] ?? "") && payloadPlan !== void 0 && buildAuthorizedShellCommandFromPlan({
		plan: payloadPlan,
		mode: "enforced",
		segmentSatisfiedBy: params.segmentSatisfiedBy
	}).ok;
	return pinnedDirectCommand || pinnedTransportCommand ? { eligible: true } : resolveUnpinnedAutoApprovalEligibility({
		authorizationPlan: params.authorizationPlan,
		binding: void 0,
		platform
	});
}
//#endregion
//#region src/agents/bash-tools.exec-host-node-phases.ts
/**
* Phase helpers for node-host exec.
* Resolves nodes, prepares `system.run` payloads, analyzes remote approval
* requirements, and formats node invoke results for the exec tool.
*/
function extractPreparedNodeShellPayload(argv) {
	const extracted = extractShellCommandFromArgv([...argv]);
	if (extracted) return extracted;
	const executable = argv[0]?.split(/[\\/]/).pop()?.toLowerCase();
	const flag = argv[1]?.trim();
	const payload = argv[2]?.trim();
	if (argv.length === 3 && executable === "sh" && flag === "-lc" && payload) return payload;
	return null;
}
function buildNodeApprovalAnalysisEnv(env) {
	return {
		...env,
		PATH: "",
		Path: ""
	};
}
function hasNodeAllowAlwaysCommandApproval(params) {
	const normalizedCommand = params.commandText.trim();
	if (!normalizedCommand) return false;
	if (params.segments.length === 0) return false;
	if (!hasNodeCommandAllowAlwaysMarker({
		allowlist: params.allowlist,
		commandText: normalizedCommand
	})) return false;
	const matchingEntries = /* @__PURE__ */ new Set();
	for (const entry of params.allowlist) {
		if (entry.source !== "allow-always") continue;
		matchingEntries.add(`${entry.pattern}\x00${entry.argPattern ?? ""}`);
	}
	const coverage = params.nodeCoverage ?? resolveAllowAlwaysPatternCoverage({
		segments: [...params.segments],
		cwd: params.cwd,
		env: params.env,
		platform: params.platform,
		strictInlineEval: params.strictInlineEval
	});
	const expectedPatterns = coverage.patterns.map((pattern) => `${pattern.pattern}\x00${pattern.argPattern ?? ""}`);
	if (!coverage.complete || expectedPatterns.length === 0) return false;
	return expectedPatterns.every((pattern) => matchingEntries.has(pattern));
}
/** Formats a raw `node.invoke system.run` response as an exec tool result. */
function formatNodeRunToolResult(params) {
	const payload = params.raw && typeof params.raw === "object" ? params.raw.payload : void 0;
	const payloadObj = payload && typeof payload === "object" ? payload : {};
	const stdout = typeof payloadObj.stdout === "string" ? payloadObj.stdout : "";
	const stderr = typeof payloadObj.stderr === "string" ? payloadObj.stderr : "";
	const errorText = typeof payloadObj.error === "string" ? payloadObj.error : "";
	const success = typeof payloadObj.success === "boolean" ? payloadObj.success : false;
	const exitCode = typeof payloadObj.exitCode === "number" ? payloadObj.exitCode : null;
	const timedOut = payloadObj.timedOut === true;
	const output = [
		stdout,
		stderr,
		errorText,
		timedOut ? appendExecTimeoutRetryGuidance("Command timed out.", "overall-timeout") : !success && exitCode !== null && exitCode !== 0 ? `(Command exited with code ${exitCode})` : ""
	].filter(Boolean).join("\n");
	return {
		content: [{
			type: "text",
			text: `Node: ${params.nodeId}\n${renderExecUpdateText({
				tailText: output,
				warnings: params.warnings ?? []
			})}`
		}],
		details: {
			status: success ? "completed" : "failed",
			exitCode,
			durationMs: Date.now() - params.startedAt,
			aggregated: output,
			nodeId: params.nodeId,
			...timedOut ? { timedOut: true } : {},
			cwd: params.cwd
		}
	};
}
/** Resolves the node id, platform, argv, env, and timeout for a node-host exec. */
async function resolveNodeExecutionTarget(params) {
	const nodes = await listNodes({});
	if (nodes.length === 0) throw new Error("exec host=node requires a paired node (none available). This requires a companion app or node host.");
	const resolvedBoundNodeId = params.boundNode ? resolveNodeIdFromList(nodes, params.boundNode) : void 0;
	let resolvedRequestedNodeId;
	if (params.requestedNode) try {
		resolvedRequestedNodeId = resolveNodeIdFromList(nodes, params.requestedNode);
	} catch (err) {
		throw new Error(`requested node not found: ${params.requestedNode} (${err instanceof Error ? err.message : String(err)})`, { cause: err });
	}
	if (resolvedBoundNodeId && resolvedRequestedNodeId && resolvedBoundNodeId !== resolvedRequestedNodeId) throw new Error(`exec node not allowed (bound to ${resolvedBoundNodeId}, requested resolved to ${resolvedRequestedNodeId})`);
	const nodeInfo = resolveEligibleNodeFromList(nodes, resolvedBoundNodeId ?? resolvedRequestedNodeId, (node) => node.connected === true && node.commands?.includes("system.run") === true, {
		ineligibleExact: (query, eligibleIds) => `exec host=node requires a connected node that supports system.run (${query} is not eligible; eligible node ids: ${eligibleIds}).`,
		nameResolveFailed: (reason, eligibleIds) => `${reason} (eligible connected system.run node ids: ${eligibleIds})`,
		noneEligible: () => "exec host=node requires a connected node that supports system.run (none available). Start or reconnect the companion app or node host.",
		multipleEligible: (eligible) => `exec host=node requires a node when multiple executable nodes are connected: ${eligible.map((node) => node.displayName ? `${node.nodeId} (${node.displayName})` : node.nodeId).join(", ")}. Set exec.node, tools.exec.node, or /exec node=...`
	});
	return {
		nodeId: nodeInfo.nodeId,
		platform: nodeInfo.platform,
		argv: buildNodeShellCommand(params.command, nodeInfo.platform),
		env: params.requestedEnv ? { ...params.requestedEnv } : void 0,
		...resolveNodeExecTimeouts(params.timeoutSec, params.defaultTimeoutSec),
		supportsSystemRunPrepare: nodeInfo.commands?.includes("system.run.prepare") === true
	};
}
/** Builds the `node.invoke` payload for `system.run`. */
function buildNodeSystemRunInvoke(params) {
	const runId = params.runId ?? crypto.randomUUID();
	return {
		nodeId: params.target.nodeId,
		command: "system.run",
		timeoutMs: params.target.invokeDeadlineMs,
		params: {
			command: params.command,
			rawCommand: params.rawCommand,
			...params.systemRunPlan ? { systemRunPlan: params.systemRunPlan } : {},
			...params.cwd != null ? { cwd: params.cwd } : {},
			env: params.target.env,
			timeoutMs: params.target.runTimeoutMs,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			...params.turnSourceChannel != null ? { turnSourceChannel: params.turnSourceChannel } : {},
			...params.turnSourceTo != null ? { turnSourceTo: params.turnSourceTo } : {},
			...params.turnSourceAccountId != null ? { turnSourceAccountId: params.turnSourceAccountId } : {},
			...params.turnSourceThreadId != null ? { turnSourceThreadId: params.turnSourceThreadId } : {},
			approved: params.approved,
			approvalDecision: params.approvalDecision ?? void 0,
			approvalSource: params.approvalSource,
			runId,
			suppressNotifyOnExit: params.suppressNotifyOnExit === true || params.notifyOnExit === false ? true : void 0
		},
		idempotencyKey: crypto.randomUUID()
	};
}
/** Dispatches an authorized run and renders its transport or execution outcome. */
async function dispatchNodeSystemRun(params) {
	const startedAt = Date.now();
	params.request.signal?.throwIfAborted();
	const result = await invokeNodeSystemRun({
		invokeWaitMs: params.target.invokeWaitMs,
		invoke: params.invoke,
		scopes: params.scopes,
		signal: params.request.signal
	});
	if (!result.ok) return formatNodeInvokeFailureToolResult({
		failure: result.failure,
		nodeId: params.target.nodeId,
		command: params.request.command,
		startedAt,
		cwd: params.request.workdir,
		warnings: [...params.request.warnings, ...params.request.foregroundWarnings ?? []]
	});
	return formatNodeRunToolResult({
		raw: result.raw,
		startedAt,
		cwd: params.request.workdir,
		nodeId: params.target.nodeId,
		warnings: [...params.request.warnings, ...params.request.foregroundWarnings ?? []]
	});
}
/** Prepares a node-host system run using remote prepare support or local fallback. */
async function prepareNodeSystemRun(params) {
	if (!params.target.supportsSystemRunPrepare) throw new Error("exec denied: node approval requires system.run.prepare support");
	const prepareRaw = await callGatewayTool("node.invoke", { timeoutMs: 15e3 }, {
		nodeId: params.target.nodeId,
		command: "system.run.prepare",
		params: {
			command: params.target.argv,
			security: params.request.security,
			ask: params.request.ask,
			rawCommand: params.request.command,
			...params.request.workdir != null ? { cwd: params.request.workdir } : {},
			...params.target.env !== void 0 ? { env: params.target.env } : {},
			...params.request.strictInlineEval === true ? { strictInlineEval: true } : {},
			agentId: params.request.agentId,
			sessionKey: params.request.sessionKey
		},
		idempotencyKey: crypto.randomUUID()
	});
	const prepared = parsePreparedSystemRunPayload(prepareRaw?.payload);
	if (!prepared) throw new Error("invalid system.run.prepare response");
	return {
		plan: prepared.plan,
		argv: prepared.plan.argv,
		rawCommand: prepared.plan.commandText,
		cwd: prepared.plan.cwd ?? params.request.workdir,
		agentId: prepared.plan.agentId ?? params.request.agentId,
		sessionKey: prepared.plan.sessionKey ?? params.request.sessionKey,
		...prepared.execPolicy ? { execPolicy: prepared.execPolicy } : {},
		allowAlwaysCoverage: prepared.allowAlwaysCoverage
	};
}
/** Analyzes whether a prepared node run satisfies node/caller approval policy. */
async function analyzeNodeApprovalRequirement(params) {
	const approvalCommand = params.prepared.rawCommand;
	const approvalCwd = params.prepared.cwd ?? params.request.workdir;
	const analysisEnv = buildNodeApprovalAnalysisEnv(params.target.env);
	const baseAllowlistEval = await evaluateShellAllowlistWithAuthorization({
		command: approvalCommand,
		allowlist: [],
		safeBins: /* @__PURE__ */ new Set(),
		cwd: approvalCwd,
		env: analysisEnv,
		platform: params.target.platform,
		trustedSafeBinDirs: params.request.trustedSafeBinDirs
	});
	const bindingCommandEvals = [{
		command: approvalCommand,
		cwd: approvalCwd,
		allowlistEval: baseAllowlistEval
	}];
	const addCommandEval = async (entries, command, cwd) => {
		const normalizedCommand = command?.trim();
		if (!normalizedCommand) return;
		if (entries.some((entry) => entry.command.trim() === normalizedCommand && entry.cwd === cwd)) return;
		entries.push({
			command: normalizedCommand,
			cwd,
			allowlistEval: await evaluateShellAllowlistWithAuthorization({
				command: normalizedCommand,
				allowlist: [],
				safeBins: /* @__PURE__ */ new Set(),
				cwd,
				env: analysisEnv,
				platform: params.target.platform,
				trustedSafeBinDirs: params.request.trustedSafeBinDirs
			})
		});
	};
	const preparedCommand = resolveSystemRunCommandRequest({
		command: params.prepared.argv,
		rawCommand: params.prepared.rawCommand
	});
	const preparedShellPayload = extractPreparedNodeShellPayload(params.prepared.argv) ?? (preparedCommand.ok ? preparedCommand.shellPayload : null);
	await addCommandEval(bindingCommandEvals, preparedShellPayload, approvalCwd);
	const autoReviewBindingCommand = preparedShellPayload?.trim() || approvalCommand;
	const autoReviewBindingEval = bindingCommandEvals.find((entry) => entry.command.trim() === autoReviewBindingCommand.trim() && entry.cwd === approvalCwd)?.allowlistEval ?? baseAllowlistEval;
	const policyCommandEvals = [...bindingCommandEvals];
	await addCommandEval(policyCommandEvals, params.prepared.plan.commandPreview, approvalCwd);
	await addCommandEval(policyCommandEvals, params.request.command, params.request.workdir);
	let analysisOk = baseAllowlistEval.analysisOk;
	let allowlistSatisfied = false;
	let durableApprovalSatisfied = false;
	let nodeApprovalsFileKnown = false;
	let obsoleteGeneratedApprovalCount = 0;
	const inlineEvalHit = params.request.strictInlineEval === true ? policyCommandEvals.map((entry) => detectInlineEvalInSegments(entry.allowlistEval.segments)).find((hit) => hit !== null) ?? null : null;
	if (inlineEvalHit) params.request.warnings.push(`Warning: strict inline-eval mode requires reviewer or explicit approval for ${describeInterpreterInlineEval(inlineEvalHit)}.`);
	if ((params.hostAsk === "always" || params.hostSecurity === "allowlist" || params.prepared.execPolicy?.security === "allowlist" || params.prepared.execPolicy?.ask === "always" || params.request.autoReview === true) && analysisOk) try {
		const approvalsSnapshot = await callGatewayTool("exec.approvals.node.get", { timeoutMs: 1e4 }, { nodeId: params.target.nodeId });
		const approvalsFile = approvalsSnapshot && typeof approvalsSnapshot === "object" ? approvalsSnapshot.file : void 0;
		if (approvalsFile && typeof approvalsFile === "object") {
			nodeApprovalsFileKnown = true;
			const resolved = resolveExecApprovalsFromFileInternal({
				file: approvalsFile,
				agentId: params.prepared.agentId,
				overrides: { security: "full" }
			});
			obsoleteGeneratedApprovalCount = countObsoleteGeneratedExecApprovals(resolved.file);
			const allowlistEvals = await Promise.all(bindingCommandEvals.map(async (entry) => {
				const allowlistEval = await evaluateShellAllowlistWithAuthorization({
					command: entry.command,
					allowlist: resolved.allowlist,
					safeBins: /* @__PURE__ */ new Set(),
					cwd: entry.cwd,
					env: analysisEnv,
					platform: params.target.platform,
					trustedSafeBinDirs: params.request.trustedSafeBinDirs
				});
				return {
					command: entry.command,
					allowlistEligible: !preparedShellPayload || entry.command.trim() === preparedShellPayload.trim(),
					exactDurableApprovalSatisfied: hasExactCommandDurableExecApproval({
						allowlist: resolved.allowlist,
						commandText: entry.command
					}),
					nodeCommandDurableApprovalSatisfied: hasNodeAllowAlwaysCommandApproval({
						allowlist: resolved.allowlist,
						commandText: params.prepared.rawCommand,
						segments: entry.allowlistEval.segments,
						cwd: entry.cwd,
						env: analysisEnv,
						platform: params.target.platform,
						strictInlineEval: params.request.strictInlineEval,
						nodeCoverage: params.prepared.allowAlwaysCoverage
					}),
					allowlistEval,
					durableApprovalSatisfied: hasDurableExecApproval({
						analysisOk: allowlistEval.analysisOk,
						segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
						allowlist: resolved.allowlist,
						commandText: entry.command
					})
				};
			}));
			durableApprovalSatisfied = allowlistEvals.some((entry) => entry.durableApprovalSatisfied && (entry.allowlistEligible || entry.exactDurableApprovalSatisfied) || entry.nodeCommandDurableApprovalSatisfied);
			allowlistSatisfied = allowlistEvals.some((entry) => entry.allowlistEligible && entry.allowlistEval.allowlistSatisfied);
			analysisOk = allowlistEvals.some((entry) => entry.allowlistEval.analysisOk);
		}
	} catch {}
	const [autoReviewSegment] = autoReviewBindingEval.segments;
	const autoReviewArgv = autoReviewBindingEval.segments.length === 1 && autoReviewSegment !== void 0 && autoReviewSegment.resolution?.policyBlocked !== true && !isBlockedShellWrapperCommand(autoReviewSegment.argv) && (autoReviewSegment.raw === void 0 || autoReviewSegment.raw.trim() === autoReviewBindingCommand.trim()) ? autoReviewSegment.argv : void 0;
	if ((params.hostSecurity === "allowlist" || params.prepared.execPolicy?.security === "allowlist") && !allowlistSatisfied && obsoleteGeneratedApprovalCount > 0) params.request.warnings.push(`${obsoleteGeneratedApprovalCount} older generated exec ${obsoleteGeneratedApprovalCount === 1 ? "approval is" : "approvals are"} inactive on this node because they are not tied to a working directory. Run "openclaw doctor --fix" on the node, then rerun the workflow and choose "Always allow here".`);
	const autoReviewEligibility = resolveNodeAutoApprovalEligibility({
		argv: params.prepared.argv,
		shellPayload: preparedShellPayload,
		platform: params.target.platform,
		authorizationPlan: autoReviewBindingEval.authorizationPlan,
		segmentSatisfiedBy: autoReviewBindingEval.segmentSatisfiedBy
	});
	const autoReviewBlockedByShellStartup = autoReviewBindingEval.segments.some((segment) => hasPosixShellStartupBeforeInlineCommand(segment.argv));
	return {
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied,
		nodeApprovalPolicyKnown: nodeApprovalsFileKnown && params.prepared.execPolicy !== void 0,
		nodeSecurity: params.prepared.execPolicy?.security,
		nodeAsk: params.prepared.execPolicy?.ask,
		inlineEvalHit,
		autoReviewBlockedByShellStartup,
		autoReviewEligibility,
		allowAlwaysPersistence: params.request.autoReview === true && (autoReviewBlockedByShellStartup || !autoReviewEligibility.eligible) ? {
			kind: "one-shot",
			reasons: ["no-reusable-pattern"]
		} : resolveAllowAlwaysPersistenceDecision({
			segments: baseAllowlistEval.segments,
			commandText: approvalCommand,
			cwd: approvalCwd,
			env: analysisEnv,
			platform: params.target.platform,
			strictInlineEval: params.request.strictInlineEval,
			authorizationPlan: baseAllowlistEval.authorizationPlan,
			runtimePayload: inlineEvalHit !== null,
			preparedCoverage: params.prepared.allowAlwaysCoverage
		}),
		autoReviewArgv
	};
}
//#endregion
//#region src/agents/bash-tools.exec-host-node-policy.ts
async function assertCurrentNodeGatewayPolicyAllowsDispatch(params) {
	if (params.request.bypassHostApprovalFloors) return;
	const current = await resolveExecHostApprovalContext({
		agentId: params.request.agentId,
		security: params.request.security,
		ask: params.request.ask,
		host: "node"
	});
	if (current.hostSecurity === "deny") throw new Error("exec denied: host=node security=deny");
	if (params.authority === "human-approval") return;
	if (params.authority === "auto-review") {
		if (current.hostAsk === "always") throw new Error("exec denied: host=node ask=always requires human approval");
		return;
	}
	if (params.authority === "ask-fallback") {
		const expected = params.fallbackPolicy;
		if (!expected || current.hostSecurity !== expected.hostSecurity || current.hostAsk !== expected.hostAsk || current.askFallback !== expected.askFallback) throw new Error("exec denied: host=node fallback policy changed before dispatch");
		return;
	}
	if (!params.currentPolicyAllows?.(current)) throw new Error("exec denied: host=node policy changed before dispatch");
}
//#endregion
//#region src/agents/bash-tools.exec-host-node.ts
/**
* Node-host exec orchestration.
* Combines local policy, remote node policy, auto-review, approval follow-ups,
* and `node.invoke system.run` execution for host=node calls.
*/
const APPROVED_NODE_INVOKE_SCOPES = [WRITE_SCOPE, APPROVALS_SCOPE];
/**
* Executes a command on a remote node, requesting approval when policy requires it.
* Node-host approval combines caller policy and remote node approval snapshots.
*/
async function executeNodeHostCommand(params) {
	const target = await resolveNodeExecutionTarget(params);
	params.signal?.throwIfAborted();
	const { hostSecurity, hostAsk, askFallback } = params.bypassHostApprovalFloors ? {
		hostSecurity: params.security,
		hostAsk: params.ask,
		askFallback: "deny"
	} : await resolveExecHostApprovalContext({
		agentId: params.agentId,
		security: params.security,
		ask: params.ask,
		host: "node"
	});
	const prepared = await prepareNodeSystemRun({
		request: {
			...params,
			security: hostSecurity,
			ask: hostAsk
		},
		target
	});
	const approvalAnalysis = await analyzeNodeApprovalRequirement({
		request: params,
		target,
		prepared,
		hostSecurity,
		hostAsk
	});
	params.signal?.throwIfAborted();
	const { analysisOk, allowlistSatisfied, durableApprovalSatisfied, nodeApprovalPolicyKnown, nodeSecurity, nodeAsk, inlineEvalHit, autoReviewBlockedByShellStartup, autoReviewEligibility, autoReviewArgv, allowAlwaysPersistence } = approvalAnalysis;
	const approvalDecisionAsk = nodeApprovalPolicyKnown && nodeAsk !== void 0 ? maxAsk(hostAsk, nodeAsk) : "always";
	const allowedDecisions = resolveExecApprovalAllowedDecisions({
		ask: approvalDecisionAsk,
		allowAlwaysPersistence
	});
	const unavailableDecisions = resolveExecApprovalUnavailableDecisions({
		ask: approvalDecisionAsk,
		allowAlwaysPersistence
	});
	const unavailableDecisionRequestParams = unavailableDecisions.length > 0 ? { unavailableDecisions } : {};
	const effectiveSecurity = nodeSecurity === void 0 ? hostSecurity : minSecurity(hostSecurity, nodeSecurity);
	const effectiveAsk = nodeAsk === void 0 ? hostAsk : maxAsk(hostAsk, nodeAsk);
	if (effectiveSecurity === "deny") throw new Error("exec denied: host=node security=deny");
	const requiresAsk = requiresExecApproval({
		ask: effectiveAsk,
		security: effectiveSecurity,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied
	}) || inlineEvalHit !== null;
	if (!requiresAsk && effectiveSecurity === "allowlist" && !(durableApprovalSatisfied || analysisOk && allowlistSatisfied)) throw new Error("exec denied: host=node allowlist miss (ask=off)");
	if (requiresAsk && params.nonInteractiveApproval) {
		const text = `Exec denied (approval_required): ${params.command}`;
		return {
			content: [{
				type: "text",
				text
			}],
			details: {
				status: "failed",
				exitCode: null,
				failureKind: "approval_required",
				durationMs: 0,
				aggregated: text,
				timedOut: false,
				cwd: prepared.cwd
			}
		};
	}
	const registerNodeApproval = async (approvalId, options = {}) => await registerExecApprovalRequestForHostOrThrow({
		approvalId,
		systemRunPlan: prepared.plan,
		env: target.env,
		workdir: prepared.cwd,
		host: "node",
		nodeId: target.nodeId,
		trigger: params.trigger,
		toolCallId: params.toolCallId,
		security: hostSecurity,
		ask: hostAsk,
		...unavailableDecisionRequestParams,
		commandHighlighting: params.commandHighlighting,
		agentId: prepared.agentId,
		sessionKey: prepared.sessionKey,
		approvalReviewerDeviceIds: params.approvalReviewerDeviceId ? [params.approvalReviewerDeviceId] : void 0,
		...options,
		...buildExecApprovalTurnSourceContext(params)
	});
	const resolveCurrentTimeoutFallback = async () => {
		try {
			const current = await resolveExecHostApprovalContext({
				agentId: params.agentId,
				security: params.security,
				ask: params.ask,
				host: "node"
			});
			if (current.askFallback === "deny") return {
				approvedByAsk: false,
				deniedReason: "approval-timeout",
				hostSecurity: current.hostSecurity,
				hostAsk: current.hostAsk,
				askFallback: current.askFallback,
				requiresExplicitApproval: false
			};
			const currentAnalysis = await analyzeNodeApprovalRequirement({
				request: {
					...params,
					warnings: []
				},
				target,
				prepared,
				hostSecurity: current.hostSecurity,
				hostAsk: current.hostAsk
			});
			const authorizationSatisfied = current.askFallback === "full" || currentAnalysis.durableApprovalSatisfied || currentAnalysis.analysisOk && currentAnalysis.allowlistSatisfied;
			return {
				approvedByAsk: authorizationSatisfied,
				deniedReason: authorizationSatisfied ? null : "approval-timeout: allowlist-miss",
				hostSecurity: current.hostSecurity,
				hostAsk: current.hostAsk,
				askFallback: current.askFallback,
				requiresExplicitApproval: currentAnalysis.inlineEvalHit !== null
			};
		} catch {
			return {
				approvedByAsk: false,
				deniedReason: "approval-timeout: policy-unavailable",
				hostSecurity: "deny",
				hostAsk,
				askFallback: "deny",
				requiresExplicitApproval: false
			};
		}
	};
	let inlineApprovedByAsk = false;
	let inlineApprovalDecision = null;
	let inlineApprovalSource;
	let inlineApprovalId;
	let inlineDispatchAuthority = "current-policy";
	let inlineFallbackPolicy;
	if (requiresAsk) {
		if (params.autoReview === true && hostAsk !== "always" && autoReviewBlockedByShellStartup) params.warnings.push(EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING);
		if (params.autoReview === true && hostAsk !== "always" && !autoReviewBlockedByShellStartup && !autoReviewEligibility.eligible) params.warnings.push(autoReviewEligibility.reason);
		const autoReviewHasBoundCommand = analysisOk && autoReviewArgv !== void 0;
		const autoReviewBlockedByNodePolicy = params.autoReview === true && hostAsk !== "always" && (!nodeApprovalPolicyKnown || nodeAsk === "always" || nodeSecurity !== void 0 && minSecurity(hostSecurity, nodeSecurity) !== hostSecurity);
		let autoReviewRequiresHumanApproval = autoReviewBlockedByNodePolicy || params.autoReview === true && autoReviewBlockedByShellStartup || params.autoReview === true && !autoReviewEligibility.eligible || params.autoReview === true && hostAsk !== "always" && !autoReviewHasBoundCommand;
		if (params.autoReview === true && hostAsk !== "always" && autoReviewHasBoundCommand && !autoReviewBlockedByNodePolicy && !autoReviewBlockedByShellStartup && autoReviewEligibility.eligible) {
			const reviewer = params.autoReviewer ?? defaultExecAutoReviewer;
			const autoReviewReason = inlineEvalHit !== null ? "strict-inline-eval" : hostSecurity === "allowlist" && (!analysisOk || !allowlistSatisfied) && !durableApprovalSatisfied ? "allowlist-miss" : "approval-required";
			const pendingDecision = resolveExecAutoReviewDecision(reviewer, {
				command: prepared.rawCommand,
				argv: autoReviewArgv,
				cwd: prepared.cwd,
				envKeys: Object.keys(params.requestedEnv ?? {}).toSorted(),
				host: "node",
				reason: autoReviewReason,
				analysis: {
					parsed: analysisOk,
					allowlistMatched: allowlistSatisfied,
					durableApprovalMatched: durableApprovalSatisfied,
					inlineEval: inlineEvalHit !== null
				},
				agent: {
					id: prepared.agentId,
					sessionKey: prepared.sessionKey
				}
			});
			const decision = params.signal ? await abortable(params.signal, pendingDecision) : await pendingDecision;
			params.signal?.throwIfAborted();
			switch (decision.decision) {
				case "deny": return buildExecAutoReviewDeniedToolResult({
					command: prepared.rawCommand,
					cwd: prepared.cwd,
					decision,
					toolCallId: params.toolCallId
				});
				case "ask": break;
				case "allow-once": {
					if (decision.risk !== "low" && decision.risk !== "medium") break;
					const approvalId = randomUUID();
					await registerNodeApproval(approvalId, {
						requireDeliveryRoute: false,
						suppressDelivery: true
					});
					await callGatewayTool("exec.approval.resolve", { timeoutMs: 15e3 }, {
						id: approvalId,
						decision: "allow-once"
					}, {
						scopes: [APPROVALS_SCOPE],
						requireAgentRuntimeIdentity: true
					});
					inlineApprovedByAsk = true;
					inlineApprovalDecision = "allow-once";
					inlineApprovalId = approvalId;
					inlineDispatchAuthority = "auto-review";
					break;
				}
				default: throw new Error("Unsupported exec auto-review decision", { cause: decision });
			}
			if (!inlineApprovedByAsk) {
				autoReviewRequiresHumanApproval = true;
				params.warnings.push(`Exec auto-review deferred to human approval (${formatExecAutoReviewAssessment(decision)}): ${decision.rationale}`);
			}
		}
		if (!inlineApprovedByAsk) {
			const approvalDecisionPolicy = {
				askFallback,
				resolveTimedOut: async () => {
					const fallback = await resolveCurrentTimeoutFallback();
					return {
						approvedByAsk: fallback.approvedByAsk,
						deniedReason: fallback.deniedReason,
						context: fallback
					};
				},
				requiresExplicitApproval: (fallback) => fallback?.requiresExplicitApproval ?? inlineEvalHit !== null,
				requiresAutoReviewHumanApproval: autoReviewRequiresHumanApproval
			};
			const approvalRoute = await createExecApprovalRequestRoute({
				warnings: params.warnings,
				approvalRunningNoticeMs: params.approvalRunningNoticeMs,
				createApprovalSlug,
				turnSourceChannel: params.turnSourceChannel,
				turnSourceAccountId: params.turnSourceAccountId,
				register: registerNodeApproval,
				...approvalDecisionPolicy
			});
			const { approvalId, approvalSlug, warningText, expiresAtMs, preResolvedDecision, initiatingSurface, sentApproverDms, unavailableReason } = approvalRoute;
			if (approvalRoute.kind === "inline") {
				const inlineDecision = approvalRoute.state;
				const currentFallback = inlineDecision.timeoutContext;
				if (inlineDecision.deniedReason || !inlineDecision.approvedByAsk) throw new Error(buildHeadlessExecApprovalDeniedMessage({
					trigger: params.trigger,
					host: "node",
					security: currentFallback?.hostSecurity ?? hostSecurity,
					ask: currentFallback?.hostAsk ?? hostAsk,
					askFallback: currentFallback?.askFallback ?? askFallback
				}));
				inlineApprovedByAsk = inlineDecision.approvedByAsk;
				inlineApprovalSource = "ask-fallback";
				inlineDispatchAuthority = "ask-fallback";
				inlineFallbackPolicy = currentFallback;
				inlineApprovalDecision = null;
				inlineApprovalId = approvalId;
			} else if (unavailableReason === null && params.approvalFollowupMode === void 0) {
				const outcome = await resolveExecApprovalWaitOutcome({
					approvalId,
					preResolvedDecision,
					signal: params.signal,
					...approvalDecisionPolicy
				});
				params.signal?.throwIfAborted();
				if (outcome.kind !== "resolved") throw new Error(`exec denied: ${outcome.kind}`);
				if (outcome.state.deniedReason || !outcome.state.approvedByAsk) throw new Error(`exec denied: ${outcome.state.deniedReason ?? "approval-required"}`);
				inlineApprovedByAsk = true;
				inlineApprovalId = approvalId;
				inlineApprovalDecision = outcome.decision === "allow-always" && inlineEvalHit === null && allowAlwaysPersistence.kind !== "one-shot" ? "allow-always" : outcome.decision === "allow-once" || outcome.decision === "allow-always" ? "allow-once" : null;
				inlineApprovalSource = outcome.decision === null ? "ask-fallback" : void 0;
				inlineDispatchAuthority = inlineApprovalSource ?? "human-approval";
				inlineFallbackPolicy = outcome.state.timeoutContext;
			} else {
				const followupTarget = {
					approvalId,
					...params.agentId ? { agentId: params.agentId } : {},
					sessionKey: params.notifySessionKey ?? params.sessionKey,
					expectedSessionId: params.sessionId,
					sessionStore: params.sessionStore,
					bashElevated: params.bashElevated,
					turnSourceChannel: params.turnSourceChannel,
					turnSourceTo: params.turnSourceTo,
					turnSourceAccountId: params.turnSourceAccountId,
					turnSourceThreadId: params.turnSourceThreadId,
					direct: params.approvalFollowupMode === "direct"
				};
				const sendApprovalRequestFailedFollowup = async () => {
					if (!params.signal?.aborted) await sendExecApprovalFollowupResult(followupTarget, `Exec denied (node=${target.nodeId} id=${approvalId}, approval-request-failed): ${params.command}`);
				};
				let nodeInvocationStarted = false;
				let nodeInvocationCompleted = false;
				(async () => {
					const approvalOutcome = await resolveExecApprovalWaitOutcome({
						approvalId,
						preResolvedDecision,
						signal: params.signal,
						...approvalDecisionPolicy
					});
					if (approvalOutcome.kind !== "resolved") {
						if (approvalOutcome.kind === "request-failed") await sendApprovalRequestFailedFollowup();
						return;
					}
					const { decision, state: resolvedDecision } = approvalOutcome;
					const { approvedByAsk, deniedReason } = resolvedDecision;
					const currentFallback = resolvedDecision.timeoutContext;
					const approvalSource = decision === null ? "ask-fallback" : void 0;
					const approvalDecision = deniedReason ? null : currentFallback ? approvedByAsk ? "allow-once" : null : decision === "allow-once" || decision === "allow-always" ? decision : null;
					if (deniedReason) {
						await sendExecApprovalFollowupResult(followupTarget, `Exec denied (node=${target.nodeId} id=${approvalId}, ${deniedReason}): ${params.command}`);
						return;
					}
					try {
						await assertCurrentNodeGatewayPolicyAllowsDispatch({
							request: params,
							authority: approvalSource ? "ask-fallback" : "human-approval",
							fallbackPolicy: currentFallback ?? void 0
						});
						if (params.signal?.aborted) return;
						nodeInvocationStarted = true;
						const invocation = await invokeNodeSystemRun({
							invokeWaitMs: target.invokeWaitMs,
							invoke: buildNodeSystemRunInvoke({
								target,
								command: prepared.argv,
								rawCommand: prepared.rawCommand,
								cwd: prepared.cwd,
								agentId: prepared.agentId,
								sessionKey: prepared.sessionKey,
								turnSourceChannel: params.turnSourceChannel,
								turnSourceTo: params.turnSourceTo,
								turnSourceAccountId: params.turnSourceAccountId,
								turnSourceThreadId: params.turnSourceThreadId,
								approved: approvalSource ? void 0 : approvedByAsk,
								approvalDecision: approvalSource ? null : approvalDecision === "allow-always" && (inlineEvalHit !== null || allowAlwaysPersistence.kind === "one-shot") ? "allow-once" : approvalDecision,
								approvalSource,
								runId: approvalId,
								suppressNotifyOnExit: true,
								notifyOnExit: params.notifyOnExit,
								systemRunPlan: prepared.plan
							}),
							scopes: APPROVED_NODE_INVOKE_SCOPES,
							signal: params.signal
						});
						nodeInvocationCompleted = true;
						if (!invocation.ok) {
							await sendExecApprovalFollowupResult(followupTarget, formatNodeInvokeFailureFollowup({
								failure: invocation.failure,
								nodeId: target.nodeId,
								approvalId,
								command: params.command
							}));
							return;
						}
						const raw = invocation.raw;
						const payload = raw?.payload && typeof raw.payload === "object" ? raw.payload : {};
						const output = formatExecApprovalContinuationSourceOutput([
							{
								label: "stdout",
								value: payload.stdout
							},
							{
								label: "stderr",
								value: payload.stderr
							},
							{
								label: "error",
								value: payload.error
							}
						]);
						const exitLabel = payload.timedOut ? "timeout" : `code ${payload.exitCode ?? "?"}`;
						const summary = output ? `Exec finished (node=${target.nodeId} id=${approvalId}, ${exitLabel})\n${output}` : `Exec finished (node=${target.nodeId} id=${approvalId}, ${exitLabel})`;
						await sendExecApprovalFollowupResult(followupTarget, summary);
					} catch {
						if (params.signal?.aborted || nodeInvocationCompleted) return;
						await sendExecApprovalFollowupResult(followupTarget, `Exec denied (node=${target.nodeId} id=${approvalId}, invoke-failed): ${params.command}`);
					}
				})().catch(async (error) => {
					if (nodeInvocationStarted || params.signal?.aborted || isExecApprovalRunAbortedError(error)) return;
					await sendApprovalRequestFailedFollowup();
				}).catch(() => void 0);
				return buildExecApprovalPendingToolResult({
					host: "node",
					command: params.command,
					cwd: params.workdir,
					warningText,
					approvalId,
					approvalSlug,
					expiresAtMs,
					initiatingSurface,
					sentApproverDms,
					unavailableReason,
					allowedDecisions,
					nodeId: target.nodeId,
					processContinuationAvailable: params.processContinuationAvailable
				});
			}
		}
	}
	params.signal?.throwIfAborted();
	const invoke = buildNodeSystemRunInvoke({
		target,
		command: prepared.argv,
		rawCommand: prepared.rawCommand,
		cwd: prepared.cwd,
		agentId: prepared.agentId,
		sessionKey: prepared.sessionKey,
		turnSourceChannel: params.turnSourceChannel,
		turnSourceTo: params.turnSourceTo,
		turnSourceAccountId: params.turnSourceAccountId,
		turnSourceThreadId: params.turnSourceThreadId,
		approved: inlineApprovalSource ? void 0 : inlineApprovedByAsk,
		approvalDecision: inlineApprovalSource ? null : inlineApprovalDecision,
		approvalSource: inlineApprovalSource,
		runId: inlineApprovalId,
		notifyOnExit: params.notifyOnExit,
		systemRunPlan: prepared.plan
	});
	await assertCurrentNodeGatewayPolicyAllowsDispatch({
		request: params,
		authority: inlineDispatchAuthority,
		fallbackPolicy: inlineFallbackPolicy,
		currentPolicyAllows: (current) => !requiresExecApproval({
			ask: current.hostAsk,
			security: current.hostSecurity,
			analysisOk,
			allowlistSatisfied,
			durableApprovalSatisfied
		}) && (current.hostSecurity !== "allowlist" || durableApprovalSatisfied || analysisOk && allowlistSatisfied) && inlineEvalHit === null
	});
	params.signal?.throwIfAborted();
	return dispatchNodeSystemRun({
		request: params,
		target,
		invoke,
		...(inlineApprovedByAsk || inlineApprovalSource) && inlineApprovalId ? { scopes: APPROVED_NODE_INVOKE_SCOPES } : {}
	});
}
//#endregion
//#region src/agents/bash-tools.exec-workdir.ts
/**
* Internal exec workdir resolver.
* Owns cwd selection and validation before exec approval, hooks, preflight, or
* process launch can observe an invalid selected working directory.
*/
function normalizeExplicitWorkdirInput(workdir) {
	if (workdir === void 0 || workdir === "") return { kind: "omitted" };
	const value = normalizeOptionalString(workdir);
	return value ? {
		kind: "specified",
		value
	} : {
		kind: "blank",
		raw: workdir
	};
}
function unavailable(requestedCwd) {
	return {
		kind: "unavailable",
		requestedCwd
	};
}
function resolveExistingHostWorkdir(workdir) {
	return safeStatSync(workdir)?.isDirectory() ? safeRealpathSync(workdir) ?? path.resolve(workdir) : null;
}
function safeCurrentCwd() {
	try {
		return process.cwd();
	} catch {
		return null;
	}
}
function mapContainerWorkdirToHost(params) {
	const workdir = normalizeContainerPath(params.workdir);
	const mappings = [...params.includeReadOnlySkillMounts ? (params.sandbox.readOnlyWorkspaceSkillMounts ?? []).map((mount) => ({
		hostRoot: path.resolve(mount.hostPath),
		containerRoot: normalizeContainerPath(mount.containerPath)
	})) : [], ...params.includePrimaryWorkspace === false ? [] : [{
		hostRoot: path.resolve(params.sandbox.workspaceDir),
		containerRoot: normalizeContainerPath(params.sandbox.containerWorkdir)
	}]].filter((mapping) => mapping.containerRoot !== ".").toSorted((left, right) => right.containerRoot.length - left.containerRoot.length);
	for (const mapping of mappings) {
		const relative = mapContainerWorkdirRelativeToRoot({
			workdir,
			root: mapping.containerRoot
		});
		if (relative === null) continue;
		return {
			hostPath: path.resolve(mapping.hostRoot, ...relative),
			hostRoot: mapping.hostRoot,
			containerRoot: mapping.containerRoot
		};
	}
}
function normalizeContainerPath(input) {
	const normalized = input.trim().replace(/\\/g, "/");
	if (!normalized) return ".";
	const posixPath = path.posix.normalize(normalized);
	return posixPath === "/" ? posixPath : posixPath.replace(/\/+$/g, "");
}
function mapContainerWorkdirRelativeToRoot(params) {
	if (params.workdir === params.root) return [];
	if (params.root === "/") return path.posix.isAbsolute(params.workdir) ? params.workdir.split("/").filter(Boolean) : null;
	if (!params.workdir.startsWith(`${params.root}/`)) return null;
	return params.workdir.slice(params.root.length + 1).split("/").filter(Boolean);
}
function joinContainerWorkdir(containerWorkdir, relative) {
	return relative ? path.posix.join(containerWorkdir, relative) : containerWorkdir;
}
function hasParentPathSegment(input) {
	return input.replace(/\\/g, "/").split("/").some((segment) => segment === "..");
}
function isContainerWorkdirInsideRoot(params) {
	const root = normalizeContainerPath(params.root);
	const workdir = normalizeContainerPath(params.workdir);
	if (root === "/") return path.posix.isAbsolute(workdir);
	return workdir === root || workdir.startsWith(`${root}/`);
}
function resolveBackendWorkdirRoots(sandbox) {
	const roots = [];
	const addRoot = (root) => {
		const normalized = normalizeContainerPath(root ?? "");
		if (normalized === "." || !path.posix.isAbsolute(normalized) || roots.includes(normalized)) return;
		roots.push(normalized);
	};
	addRoot(sandbox.containerWorkdir);
	for (const root of sandbox.workdirRoots ?? []) addRoot(root);
	return roots;
}
function resolveBackendContainerWorkdir(params) {
	const containerRoot = normalizeContainerPath(params.sandbox.containerWorkdir);
	const backendRoots = resolveBackendWorkdirRoots(params.sandbox);
	const requested = normalizeContainerPath(params.workdir);
	if (path.posix.isAbsolute(requested)) return backendRoots.some((root) => isContainerWorkdirInsideRoot({
		root,
		workdir: requested
	})) ? requested : null;
	if (requested === ".." || requested.startsWith("../")) return null;
	return joinContainerWorkdir(containerRoot, requested === "." ? "" : requested);
}
async function mapExistingHostPath(params) {
	let resolved;
	try {
		resolved = await assertSandboxPath({
			filePath: params.hostPath,
			cwd: params.hostRoot,
			root: params.hostRoot
		});
	} catch {
		return { kind: "invalid" };
	}
	const stats = safeStatSync(resolved.resolved);
	const relative = resolved.relative.split(path.sep).join(path.posix.sep);
	if (!stats) return {
		kind: "missing",
		relative
	};
	if (!stats.isDirectory()) return { kind: "invalid" };
	return {
		kind: "available",
		workdir: {
			hostCwd: resolved.resolved,
			containerCwd: joinContainerWorkdir(params.containerRoot, relative),
			scriptPreflightCwd: resolved.resolved
		}
	};
}
async function validateBackendWorkdir(params) {
	const containerCwd = await params.sandbox.validateWorkdir?.(params.workdir.containerCwd);
	return containerCwd ? {
		...params.workdir,
		containerCwd
	} : null;
}
function resolveBackendHostWorkdirCandidate(params) {
	if (!path.isAbsolute(params.workdir)) return {
		hostPath: path.resolve(params.sandbox.workspaceDir, params.workdir),
		hostRoot: path.resolve(params.sandbox.workspaceDir),
		containerRoot: normalizeContainerPath(params.sandbox.containerWorkdir),
		failIfInvalid: false
	};
	const hostPath = path.resolve(params.workdir);
	const readOnlySkillMapping = mapContainerWorkdirToHost({
		workdir: params.workdir,
		sandbox: params.sandbox,
		includeReadOnlySkillMounts: true,
		includePrimaryWorkspace: false
	});
	if (readOnlySkillMapping) return {
		...readOnlySkillMapping,
		failIfInvalid: false
	};
	if (isPathInside(path.resolve(params.sandbox.workspaceDir), hostPath)) return {
		hostPath,
		hostRoot: path.resolve(params.sandbox.workspaceDir),
		containerRoot: normalizeContainerPath(params.sandbox.containerWorkdir),
		failIfInvalid: true
	};
	const containerMappedWorkdir = mapContainerWorkdirToHost({
		workdir: params.workdir,
		sandbox: params.sandbox
	});
	return containerMappedWorkdir ? {
		...containerMappedWorkdir,
		failIfInvalid: false
	} : null;
}
async function resolveBackendValidatedSandboxWorkdir(params) {
	const workspaceHostCwd = resolveExistingHostWorkdir(params.sandbox.workspaceDir);
	if (!workspaceHostCwd) return null;
	const hostCandidate = resolveBackendHostWorkdirCandidate(params);
	if (hostCandidate) {
		const mappedWorkdir = await mapExistingHostPath(hostCandidate);
		if (mappedWorkdir.kind === "available") return await validateBackendWorkdir({
			workdir: mappedWorkdir.workdir,
			sandbox: params.sandbox
		});
		if (mappedWorkdir.kind === "missing") return await validateBackendWorkdir({
			workdir: {
				hostCwd: workspaceHostCwd,
				containerCwd: joinContainerWorkdir(hostCandidate.containerRoot, mappedWorkdir.relative),
				scriptPreflightCwd: null
			},
			sandbox: params.sandbox
		});
		if (hostCandidate.failIfInvalid) return null;
	}
	const containerCwd = resolveBackendContainerWorkdir(params);
	if (containerCwd) return await validateBackendWorkdir({
		workdir: {
			hostCwd: workspaceHostCwd,
			containerCwd,
			scriptPreflightCwd: null
		},
		sandbox: params.sandbox
	});
	return null;
}
async function resolveHostValidatedSandboxWorkdir(params) {
	const mappedHostWorkdir = mapContainerWorkdirToHost({
		workdir: params.workdir,
		sandbox: params.sandbox,
		includeReadOnlySkillMounts: true
	});
	const candidateWorkdir = mappedHostWorkdir?.hostPath ?? params.workdir;
	const candidateRoot = mappedHostWorkdir?.hostRoot ?? params.sandbox.workspaceDir;
	const containerRoot = mappedHostWorkdir?.containerRoot ?? params.sandbox.containerWorkdir;
	try {
		const resolved = await assertSandboxPath({
			filePath: candidateWorkdir,
			cwd: candidateRoot,
			root: candidateRoot
		});
		if (!(await fs$1.stat(resolved.resolved)).isDirectory()) return null;
		const containerCwd = joinContainerWorkdir(containerRoot, resolved.relative ? resolved.relative.split(path.sep).join(path.posix.sep) : "");
		return {
			hostCwd: resolved.resolved,
			containerCwd,
			scriptPreflightCwd: resolved.resolved
		};
	} catch {
		return null;
	}
}
async function resolveSandboxWorkdir(params) {
	if (hasParentPathSegment(params.workdir)) return null;
	if (params.sandbox.workdirValidation === "backend") return await resolveBackendValidatedSandboxWorkdir(params);
	return await resolveHostValidatedSandboxWorkdir(params);
}
function formatUnavailableWorkdirFailure(workdir) {
	return [
		`workdir "${workdir}" is unavailable or not a directory: command was not executed.`,
		"workdir is treated as a literal path; shell expansions such as \"~\" are not applied.",
		"Use an existing directory, omit an explicit workdir to use the default cwd, or update the configured default cwd."
	].join(" ");
}
async function resolveExecWorkdir(params) {
	const explicitWorkdir = normalizeExplicitWorkdirInput(params.workdir);
	if (explicitWorkdir.kind === "blank") return unavailable(explicitWorkdir.raw);
	if (params.host === "node") {
		const remoteCwd = explicitWorkdir.kind === "specified" ? explicitWorkdir.value : normalizeOptionalString(params.nodeCwd);
		return remoteCwd ? {
			kind: "node",
			remoteCwd
		} : { kind: "node" };
	}
	const defaultCwd = normalizeOptionalString(params.defaultCwd);
	if (params.host === "sandbox") {
		const sandbox = params.sandbox;
		if (!sandbox) throw new Error("exec internal error: sandbox workdir resolution requires sandbox config");
		const requestedCwd = explicitWorkdir.kind === "specified" ? explicitWorkdir.value : defaultCwd ?? sandbox.containerWorkdir;
		const resolved = await resolveSandboxWorkdir({
			workdir: requestedCwd,
			sandbox
		});
		return resolved ? {
			kind: "sandbox",
			...resolved
		} : unavailable(requestedCwd);
	}
	const requestedCwd = explicitWorkdir.kind === "specified" ? explicitWorkdir.value : defaultCwd ?? safeCurrentCwd();
	if (!requestedCwd) return unavailable("current working directory");
	let hostPath = requestedCwd;
	if (explicitWorkdir.kind === "specified" && defaultCwd && !path.isAbsolute(requestedCwd)) {
		const baseCwd = resolveExistingHostWorkdir(defaultCwd);
		if (!baseCwd) return unavailable(defaultCwd);
		hostPath = `${baseCwd}${path.sep}${requestedCwd}`;
	}
	const resolved = resolveExistingHostWorkdir(hostPath);
	return resolved ? {
		kind: "local",
		hostCwd: resolved
	} : unavailable(requestedCwd);
}
//#endregion
//#region src/agents/bash-tools.exec-request-preparation.ts
/** Prepares exec workdir and environment facts before policy and host dispatch. */
const CHANNEL_CONTEXT_ENV_KEY = "OPENCLAW_CHANNEL_CONTEXT";
const resolvedExecEnvPreparedStates = /* @__PURE__ */ new WeakMap();
const execHookContexts = /* @__PURE__ */ new WeakMap();
const resolvedExecWorkdirPreparedStates = /* @__PURE__ */ new WeakMap();
const XML_ARG_VALUE_EXEC_PARAM_KEYS = [
	"command",
	"workdir",
	"host",
	"ask",
	"node"
];
function assertSupportedExecParams(args) {
	if (!isRecord(args)) return;
	if (args.awaitResults !== void 0 && typeof args.awaitResults !== "boolean") throw new ToolInputError("exec awaitResults must be a boolean");
	if (args.awaitResults === true && args.background === true) throw new ToolInputError("exec with awaitResults=true cannot be detached with background=true");
	if (Object.hasOwn(args, "timeout")) throw new ToolInputError("exec parameter \"timeout\" is unsupported; use \"timeoutSeconds\" instead");
	if (Object.hasOwn(args, "cwd")) throw new ToolInputError("exec parameter \"cwd\" is unsupported; use \"workdir\" instead");
}
function buildChannelContextEnv(channelContext) {
	const senderId = normalizeOptionalString(channelContext?.sender?.id);
	const chatId = normalizeOptionalString(channelContext?.chat?.id);
	if (!senderId && !chatId) return;
	return { [CHANNEL_CONTEXT_ENV_KEY]: JSON.stringify({
		...senderId ? { sender: { id: senderId } } : {},
		...chatId ? { chat: { id: chatId } } : {}
	}) };
}
function isExecToolArgsObject(value) {
	return isRecord(value);
}
function filterPluginExecEnv(rawEnv) {
	const env = {};
	for (const [rawKey, value] of Object.entries(rawEnv)) {
		const key = normalizeHostOverrideEnvVarKey(rawKey);
		if (!key) continue;
		const upperKey = key.toUpperCase();
		if (upperKey === "PATH" || upperKey === "OPENCLAW_CLI" || isDangerousHostEnvVarName(upperKey) || isDangerousHostEnvOverrideVarName(upperKey)) continue;
		env[key] = value;
	}
	return Object.keys(env).length > 0 ? env : void 0;
}
function resolveNotifyOnExitEmptySuccess(defaults) {
	if (typeof defaults?.notifyOnExitEmptySuccess === "boolean") return defaults.notifyOnExitEmptySuccess;
	return normalizeChatChannelId(defaults?.messageProvider) !== null;
}
/** Capture notification routing and child identity before process lifetime detaches. */
function resolveExecNotificationDefaults(defaults) {
	const notifyOnExit = defaults?.notifyOnExit !== false;
	const notifyOnExitEmptySuccess = resolveNotifyOnExitEmptySuccess(defaults);
	const notifySessionKey = normalizeOptionalString(defaults?.notifySessionKey ?? defaults?.runSessionKey ?? defaults?.sessionKey);
	const notifyAgentSession = parseAgentSessionKey(notifySessionKey);
	let subagentSession;
	const resolveSubagentSession = () => subagentSession ??= (async () => {
		if (!notifySessionKey || !defaults?.config || !notifyAgentSession?.rest.startsWith("dashboard:")) return isSubagentEnvelopeSession(notifySessionKey);
		const { readSessionEntriesFromStoreInWorker } = await import("./session-entry-read-runtime-BLjA5kor.mjs");
		const read = await readSessionEntriesFromStoreInWorker({
			agentId: notifyAgentSession.agentId,
			sessionKeys: [notifySessionKey],
			storePath: resolveSessionStorePathCore(defaults.config.session?.store, { agentId: notifyAgentSession.agentId })
		});
		return isSubagentEnvelopeSession(notifySessionKey, { entry: read.entries.find(({ sessionKey }) => sessionKey === notifySessionKey)?.entry });
	})().catch(() => {
		subagentSession = void 0;
		return isSubagentEnvelopeSession(notifySessionKey);
	});
	return {
		notifyOnExit,
		notifyOnExitEmptySuccess,
		notifySessionKey,
		resolveSubagentSession,
		notifyDeliveryContext: normalizeDeliveryContext({
			channel: defaults?.messageProvider,
			to: defaults?.currentChannelId,
			accountId: defaults?.accountId,
			threadId: defaults?.currentThreadTs
		})
	};
}
function resolveExecPreparedRunEnvironment(defaults) {
	return {
		...defaults?.preparedRunEnvironment ?? prepareGitHubToolEnvironment({
			config: defaults?.config ?? {},
			agentId: defaults?.agentId ?? "main"
		}),
		localProcessEnv: installationTargetEnv(getInstallationTarget())
	};
}
function createExecRequestPreparation(params) {
	const normalizeParams = (rawArgs) => stripMalformedXmlArgValueSuffixFromKeys(rawArgs, XML_ARG_VALUE_EXEC_PARAM_KEYS);
	const prepareParamsWithResolvedExecWorkdir = async (rawArgs) => {
		if (typeof rawArgs !== "object" || rawArgs === null || Array.isArray(rawArgs)) return rawArgs;
		const execParams = normalizeParams(rawArgs);
		let host;
		try {
			host = params.resolveHostForParams(execParams);
		} catch {
			return execParams;
		}
		if (host === "sandbox" && !params.defaults?.sandbox) return execParams;
		if (host === "sandbox" && params.defaults?.sandbox?.workdirValidation === "backend") return execParams;
		const resolution = await resolveExecWorkdir({
			host,
			workdir: execParams.workdir,
			defaultCwd: params.defaults?.cwd,
			nodeCwd: params.defaults?.nodeCwd,
			sandbox: params.defaults?.sandbox
		});
		resolvedExecWorkdirPreparedStates.set(execParams, {
			host,
			inputWorkdir: execParams.workdir,
			resolution
		});
		return execParams;
	};
	const shouldDeferResolveExecEnvUntilWorkdirValidated = (execParams) => {
		try {
			return params.resolveHostForParams(execParams) === "sandbox" && params.defaults?.sandbox?.workdirValidation === "backend";
		} catch {
			return false;
		}
	};
	const prepareParamsWithResolvedExecEnv = async (rawArgs, context) => {
		const execParams = normalizeParams(rawArgs);
		if (!execParams.command) return execParams;
		if (resolvedExecEnvPreparedStates.has(execParams)) return execParams;
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("resolve_exec_env") || typeof hookRunner.runResolveExecEnv !== "function") {
			resolvedExecEnvPreparedStates.set(execParams, {});
			return execParams;
		}
		let host;
		try {
			host = params.resolveHostForParams(execParams);
		} catch {
			return execParams;
		}
		const sessionId = context?.hookContext?.sessionId ?? params.defaults?.sessionId;
		const pluginEnv = filterPluginExecEnv(await hookRunner.runResolveExecEnv({
			sessionKey: context?.hookContext?.sessionKey ?? params.defaults?.sessionKey,
			toolName: "exec",
			host
		}, {
			agentId: context?.hookContext?.agentId ?? params.agentId,
			sessionKey: context?.hookContext?.sessionKey ?? params.defaults?.sessionKey,
			...sessionId ? { sessionId } : {},
			messageProvider: params.defaults?.messageProvider,
			channelId: params.defaults?.currentChannelId ?? context?.hookContext?.channelId,
			...params.defaults?.channelContext ? { channelContext: params.defaults.channelContext } : {}
		}));
		resolvedExecEnvPreparedStates.set(execParams, {
			host,
			...pluginEnv ? { pluginEnv } : {}
		});
		return execParams;
	};
	const prepareBeforeToolCallParams = async (args, context) => {
		assertSupportedExecParams(args);
		const execParams = await prepareParamsWithResolvedExecWorkdir(args);
		if (!isExecToolArgsObject(execParams)) return execParams;
		const hookContext = context.hookContext;
		execHookContexts.set(execParams, hookContext);
		if (resolvedExecWorkdirPreparedStates.get(execParams)?.resolution.kind === "unavailable" || shouldDeferResolveExecEnvUntilWorkdirValidated(execParams)) return execParams;
		return prepareParamsWithResolvedExecEnv(execParams, { hookContext });
	};
	const finalizeBeforeToolCallParams = (rawParams, preparedParams) => {
		const envState = resolvedExecEnvPreparedStates.get(preparedParams);
		const hookContext = execHookContexts.get(preparedParams);
		const workdirState = resolvedExecWorkdirPreparedStates.get(preparedParams);
		if (!envState && !hookContext && !workdirState) return rawParams;
		if (!isExecToolArgsObject(rawParams)) return rawParams;
		const execParams = rawParams;
		const invalidatePreparedParams = () => {
			const invalidated = { ...execParams };
			execHookContexts.set(invalidated, hookContext);
			return invalidated;
		};
		let host;
		const resolveFinalHost = () => {
			host ??= params.resolveHostForParams(execParams);
			return host;
		};
		try {
			if (envState?.host && execParams.command && resolveFinalHost() !== envState.host) return invalidatePreparedParams();
			if (workdirState && (resolveFinalHost() !== workdirState.host || execParams.workdir !== workdirState.inputWorkdir)) return invalidatePreparedParams();
		} catch {
			return invalidatePreparedParams();
		}
		if (envState) resolvedExecEnvPreparedStates.set(execParams, envState);
		if (hookContext) execHookContexts.set(execParams, hookContext);
		if (workdirState) resolvedExecWorkdirPreparedStates.set(execParams, workdirState);
		return execParams;
	};
	return {
		normalizeParams,
		prepareBeforeToolCallParams,
		finalizeBeforeToolCallParams,
		prepareParamsWithResolvedExecEnv,
		isResolveExecEnvPrepared: (args) => resolvedExecEnvPreparedStates.has(args),
		getExecHookContext: (args) => execHookContexts.get(args),
		getResolvedExecWorkdirPreparedState: (args) => resolvedExecWorkdirPreparedStates.get(args),
		getResolvedExecEnvPreparedState: (args) => resolvedExecEnvPreparedStates.get(args)
	};
}
function resolvePreparedExecEnvironment(params) {
	if (params.localProcessEnv && params.host !== "gateway") throw new Error(LOCAL_INSTALLATION_TARGET_UNSUPPORTED);
	const inheritedBaseEnv = coerceEnv(process.env);
	const channelContextEnv = buildChannelContextEnv(params.channelContext);
	const explicitEnv = params.execParams.env !== void 0 || params.pluginEnv !== void 0 || channelContextEnv !== void 0 ? {
		...params.execParams.env,
		...params.pluginEnv,
		...channelContextEnv
	} : void 0;
	const storeEnvResult = params.storeEnv ? sanitizeHostExecEnvWithDiagnostics({
		baseEnv: {},
		overrides: params.storeEnv,
		blockPathOverrides: true
	}) : void 0;
	const { [OPENCLAW_CLI_ENV_VAR]: _storeMarker, ...acceptedStoreEnv } = storeEnvResult?.env ?? {};
	let storeEnv = Object.keys(acceptedStoreEnv).length > 0 ? acceptedStoreEnv : void 0;
	const rejectedStoreKeys = /* @__PURE__ */ new Set([...storeEnvResult?.rejectedOverrideBlockedKeys ?? [], ...storeEnvResult?.rejectedOverrideInvalidKeys ?? []]);
	if (params.storeEnv && Object.hasOwn(params.storeEnv, "OPENCLAW_CLI")) rejectedStoreKeys.add(OPENCLAW_CLI_ENV_VAR);
	if (params.host === "sandbox" && storeEnv) {
		const sandboxStoreEnvResult = sanitizeEnvVars(storeEnv);
		storeEnv = sandboxStoreEnvResult.allowed;
		for (const key of sandboxStoreEnvResult.blocked) rejectedStoreKeys.add(key);
		if (sandboxStoreEnvResult.warnings.length > 0) params.warnings.push(`Warning: secret store environment entries need attention: ${sandboxStoreEnvResult.warnings.join("; ")}.`);
	}
	if (rejectedStoreKeys.size > 0) params.warnings.push(`Warning: secret store environment entries were not applied for host=${params.host}: ${Array.from(rejectedStoreKeys).toSorted().join(", ")}.`);
	const untrustedRequestedEnv = storeEnv && Object.keys(storeEnv).length > 0 ? {
		...storeEnv,
		...explicitEnv
	} : explicitEnv;
	const requestedEnv = params.storeSecretEnv ? {
		...storeEnv,
		...params.storeSecretEnv,
		...explicitEnv
	} : untrustedRequestedEnv;
	const hostEnvResult = params.host === "sandbox" ? null : sanitizeHostExecEnvWithDiagnostics({
		baseEnv: inheritedBaseEnv,
		overrides: untrustedRequestedEnv,
		blockPathOverrides: true
	});
	if (hostEnvResult && untrustedRequestedEnv && (hostEnvResult.rejectedOverrideBlockedKeys.length > 0 || hostEnvResult.rejectedOverrideInvalidKeys.length > 0)) {
		const blockedKeys = hostEnvResult.rejectedOverrideBlockedKeys;
		const invalidKeys = hostEnvResult.rejectedOverrideInvalidKeys;
		const pathBlocked = blockedKeys.includes("PATH");
		if (pathBlocked && blockedKeys.length === 1 && invalidKeys.length === 0) throw new Error("Security Violation: Custom 'PATH' variable is forbidden during host execution.");
		if (blockedKeys.length === 1 && invalidKeys.length === 0) throw new Error(`Security Violation: Environment variable '${blockedKeys[0]}' is forbidden during host execution.`);
		const details = [];
		if (blockedKeys.length > 0) details.push(`blocked override keys: ${blockedKeys.join(", ")}`);
		if (invalidKeys.length > 0) details.push(`invalid non-portable override keys: ${invalidKeys.join(", ")}`);
		const suffix = details.join("; ");
		if (pathBlocked) throw new Error(`Security Violation: Custom 'PATH' variable is forbidden during host execution (${suffix}).`);
		throw new Error(`Security Violation: ${suffix}.`);
	}
	const env = params.sandbox && params.host === "sandbox" ? buildSandboxEnv({
		defaultPath: DEFAULT_PATH,
		paramsEnv: untrustedRequestedEnv,
		sandboxEnv: params.sandbox.env,
		containerWorkdir: params.containerWorkdir ?? params.sandbox.containerWorkdir
	}) : hostEnvResult?.env ?? inheritedBaseEnv;
	if (!params.sandbox && params.host === "gateway" && !requestedEnv?.PATH) {
		const shellPath = getShellPathFromLoginShell({
			env: process.env,
			timeoutMs: resolveShellEnvFallbackTimeoutMs(process.env)
		});
		applyShellPath(env, shellPath);
	}
	if (params.host === "node" && params.defaultPathPrepend.length > 0) params.warnings.push("Warning: tools.exec.pathPrepend is ignored for host=node. Configure PATH on the node host/service instead.");
	else applyPathPrepend(env, params.defaultPathPrepend);
	if (params.host === "gateway" && params.managedLocalIdentity === false) for (const name of ["GH_TOKEN", "GITHUB_TOKEN"]) {
		const value = process.env[name];
		if (typeof value === "string") env[name] = value;
	}
	if (params.storeSecretEnv) {
		for (const [key, value] of Object.entries(params.storeSecretEnv)) if (!explicitEnv || !Object.hasOwn(explicitEnv, key)) env[key] = value;
	}
	const preparedEnv = {
		...params.localProcessEnv,
		...params.credentialScrubEnv,
		...params.host === "gateway" ? params.localIdentityEnv : void 0
	};
	Object.assign(env, preparedEnv);
	const forwardedEnv = params.subagentExecution ? {
		...requestedEnv,
		[SUBAGENT_EXEC_ENV_VAR]: "1"
	} : requestedEnv;
	if (params.subagentExecution) env[SUBAGENT_EXEC_ENV_VAR] = "1";
	return {
		env,
		...params.host !== "node" && Object.keys(preparedEnv).length > 0 ? { requestedEnv: {
			...forwardedEnv,
			...preparedEnv
		} } : { requestedEnv: forwardedEnv }
	};
}
//#endregion
//#region src/agents/bash-tools.exec-script-target.ts
/** Parses direct Python and Node script targets from shell command text. */
const PREFLIGHT_ENV_OPTIONS_WITH_VALUES = /* @__PURE__ */ new Set([
	"-C",
	"-S",
	"-u",
	"--argv0",
	"--block-signal",
	"--chdir",
	"--default-signal",
	"--ignore-signal",
	"--split-string",
	"--unset"
]);
function isShellEnvAssignmentToken(token) {
	return /^[A-Za-z_][A-Za-z0-9_]*=.*$/u.test(token);
}
function stripPreflightAssignments(argv) {
	let index = 0;
	while (isShellEnvAssignmentToken(argv[index] ?? "")) index += 1;
	return argv.slice(index);
}
function parsePreflightShellSegment(rawSegment) {
	const argv = splitShellArgs(rawSegment.trim()) ?? [];
	return stripPreflightAssignments(stripPreflightEnvPrefix(/^(?:if|then|do|elif|else|while|until|time)$/i.test(argv[0] ?? "") ? argv.slice(1) : argv));
}
function isEnvExecutableToken(token) {
	if (!token) return false;
	const base = normalizeOptionalLowercaseString(token.split(/[\\/]/u).at(-1)) ?? "";
	return (base.endsWith(".exe") ? base.slice(0, -4) : base) === "env";
}
function stripPreflightEnvPrefix(argv) {
	if (argv.length === 0) return argv;
	let idx = 0;
	while (idx < argv.length && isShellEnvAssignmentToken(argv.at(idx) ?? "")) idx += 1;
	if (!isEnvExecutableToken(argv[idx])) return argv;
	idx += 1;
	while (idx < argv.length) {
		const token = argv.at(idx);
		if (token === void 0) break;
		if (token === "--") {
			idx += 1;
			break;
		}
		if (isShellEnvAssignmentToken(token)) {
			idx += 1;
			continue;
		}
		if (!token.startsWith("-") || token === "-") break;
		idx += 1;
		const equalsIndex = token.indexOf("=");
		const option = token.includes("=") ? token.slice(0, equalsIndex) : token;
		if (PREFLIGHT_ENV_OPTIONS_WITH_VALUES.has(option) && !token.includes("=") && idx < argv.length) idx += 1;
	}
	return argv.slice(idx);
}
function findFirstPythonScriptArg(tokens) {
	const optionsWithSeparateValue = /* @__PURE__ */ new Set([
		"-W",
		"-X",
		"-Q",
		"--check-hash-based-pycs"
	]);
	for (let i = 0; i < tokens.length; i += 1) {
		const token = tokens.at(i);
		if (token === void 0) break;
		if (token === "--") {
			const next = tokens.at(i + 1);
			return next && normalizeLowercaseStringOrEmpty(next).endsWith(".py") ? next : null;
		}
		if (token === "-") return null;
		if (token === "-c" || token === "-m") return null;
		if ((token.startsWith("-c") || token.startsWith("-m")) && token.length > 2) return null;
		if (optionsWithSeparateValue.has(token)) {
			i += 1;
			continue;
		}
		if (token.startsWith("-")) continue;
		return normalizeLowercaseStringOrEmpty(token).endsWith(".py") ? token : null;
	}
	return null;
}
function findNodeScriptArgs(tokens) {
	const optionsWithSeparateValue = /* @__PURE__ */ new Set([
		"-r",
		"--require",
		"--import"
	]);
	const preloadScripts = [];
	let entryScript = null;
	let hasInlineEvalOrPrint = false;
	for (let i = 0; i < tokens.length; i += 1) {
		const token = tokens.at(i);
		if (token === void 0) break;
		if (token === "--") {
			if (!hasInlineEvalOrPrint && !entryScript) {
				const next = tokens.at(i + 1);
				if (next && normalizeLowercaseStringOrEmpty(next).endsWith(".js")) entryScript = next;
			}
			break;
		}
		if (token === "-e" || token === "-p" || token === "--eval" || token === "--print" || token.startsWith("--eval=") || token.startsWith("--print=") || (token.startsWith("-e") || token.startsWith("-p")) && token.length > 2) {
			hasInlineEvalOrPrint = true;
			if (token === "-e" || token === "-p" || token === "--eval" || token === "--print") i += 1;
			continue;
		}
		if (optionsWithSeparateValue.has(token)) {
			const next = tokens.at(i + 1);
			if (next && normalizeLowercaseStringOrEmpty(next).endsWith(".js")) preloadScripts.push(next);
			i += 1;
			continue;
		}
		if (token.startsWith("-r") && token.length > 2 || token.startsWith("--require=") || token.startsWith("--import=")) {
			const inlineValue = token.startsWith("-r") ? token.slice(2) : token.slice(token.indexOf("=") + 1);
			if (normalizeLowercaseStringOrEmpty(inlineValue).endsWith(".js")) preloadScripts.push(inlineValue);
			continue;
		}
		if (token.startsWith("-")) continue;
		if (!hasInlineEvalOrPrint && !entryScript && normalizeLowercaseStringOrEmpty(token).endsWith(".js")) entryScript = token;
		break;
	}
	const targets = [...preloadScripts];
	if (entryScript) targets.push(entryScript);
	return targets;
}
function extractInterpreterScriptTargetFromArgv(argv) {
	if (!argv || argv.length === 0) return null;
	const [command, ...args] = stripPreflightAssignments(argv);
	const executable = normalizeOptionalLowercaseString(command);
	if (!executable) return null;
	if (/^python(?:3(?:\.\d+)?)?$/i.test(executable)) {
		const script = findFirstPythonScriptArg(args);
		return script ? {
			kind: "python",
			relOrAbsPaths: [script]
		} : null;
	}
	if (executable === "node") {
		const scripts = findNodeScriptArgs(args);
		return scripts.length > 0 ? {
			kind: "node",
			relOrAbsPaths: scripts
		} : null;
	}
	return null;
}
function extractInterpreterScriptPathsFromSegment(rawSegment) {
	return extractInterpreterScriptTargetFromArgv(parsePreflightShellSegment(rawSegment))?.relOrAbsPaths ?? [];
}
function extractScriptTargetFromCommand(command) {
	const raw = command.trim();
	const argv = process.platform === "win32" && /(?:^|[\s"'`])(?:[A-Za-z]:\\|\\\\|[^\s"'`|&;()<>]+\\[^\s"'`|&;()<>]+)/.test(raw) ? splitCommandArgs(raw) : splitShellArgs(raw);
	for (const attempt of [argv, argv ? stripPreflightEnvPrefix(argv) : null]) {
		const target = extractInterpreterScriptTargetFromArgv(attempt);
		if (target) return target;
	}
	return null;
}
//#endregion
//#region src/agents/bash-tools.exec-script-ambiguity.ts
/** Detects ambiguous interpreter invocations that cannot be safely preflighted. */
function extractUnquotedShellText(raw) {
	let out = "";
	let quote;
	let escaped = false;
	for (const ch of raw) {
		if (escaped) {
			if (!quote) out += `\\${ch}`;
			escaped = false;
			continue;
		}
		if (quote !== "'" && ch === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (ch === quote) quote = void 0;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			continue;
		}
		out += ch;
	}
	if (escaped || quote) return null;
	return out;
}
function splitShellSegmentsOutsideQuotes(rawText, params) {
	const segments = [];
	let buf = "";
	let quote;
	let escaped = false;
	const pushSegment = () => {
		if (buf.trim().length > 0) segments.push(buf);
		buf = "";
	};
	for (let i = 0; i < rawText.length; i += 1) {
		const ch = rawText[i];
		const next = rawText[i + 1];
		if (escaped) {
			buf += ch;
			escaped = false;
			continue;
		}
		if (quote !== "'" && ch === "\\") {
			buf += ch;
			escaped = true;
			continue;
		}
		if (quote) {
			buf += ch;
			if (ch === quote) quote = void 0;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			quote = ch;
			buf += ch;
			continue;
		}
		if (ch === "\n" || ch === "\r" || ch === ";") {
			pushSegment();
			continue;
		}
		if ((ch === "&" || ch === "|") && next === ch) {
			pushSegment();
			i += 1;
			continue;
		}
		if (params.splitPipes && ch === "|") {
			pushSegment();
			continue;
		}
		buf += ch;
	}
	pushSegment();
	return segments;
}
function isInterpreterExecutable(executable) {
	if (!executable) return false;
	return /^python(?:3(?:\.\d+)?)?$/i.test(executable) || executable === "node";
}
function hasUnescapedSequence(raw, sequence) {
	let escaped = false;
	for (let i = 0; i < raw.length; i += 1) {
		const ch = raw[i];
		if (escaped) {
			escaped = false;
			continue;
		}
		if (ch === "\\") {
			escaped = true;
			continue;
		}
		if (raw.startsWith(sequence, i)) return true;
	}
	return false;
}
function hasUnquotedScriptHint(raw) {
	let quote;
	let escaped = false;
	let token = "";
	const flushToken = () => {
		const normalizedToken = normalizeLowercaseStringOrEmpty(token);
		if (normalizedToken.endsWith(".py") || normalizedToken.endsWith(".js")) return true;
		token = "";
		return false;
	};
	for (const ch of raw) {
		if (escaped) {
			if (!quote) token += ch;
			escaped = false;
			continue;
		}
		if (quote !== "'" && ch === "\\") {
			escaped = true;
			continue;
		}
		if (quote) {
			if (ch === quote) quote = void 0;
			continue;
		}
		if (ch === "'" || ch === "\"") {
			if (flushToken()) return true;
			quote = ch;
			continue;
		}
		if (/\s/u.test(ch) || "|&;()<>".includes(ch)) {
			if (flushToken()) return true;
			continue;
		}
		token += ch;
	}
	return flushToken();
}
function resolveLeadingShellSegmentExecutable(rawSegment) {
	return normalizeOptionalLowercaseString(parsePreflightShellSegment(extractUnquotedShellText(rawSegment) ?? rawSegment)[0]);
}
function analyzeInterpreterHeuristicsFromUnquoted(raw) {
	const executables = splitShellSegmentsOutsideQuotes(raw, { splitPipes: true }).map(resolveLeadingShellSegmentExecutable);
	const hasPython = executables.some((executable) => /^python(?:3(?:\.\d+)?)?$/i.test(executable ?? ""));
	const hasNode = executables.includes("node");
	const hasProcessSubstitution = hasUnescapedSequence(raw, "<(") || hasUnescapedSequence(raw, ">(");
	return {
		hasPython,
		hasNode,
		hasComplexSyntax: hasUnescapedSequence(raw, "|") || hasUnescapedSequence(raw, "&&") || hasUnescapedSequence(raw, "||") || hasUnescapedSequence(raw, ";") || raw.includes("\n") || raw.includes("\r") || hasUnescapedSequence(raw, "$(") || hasUnescapedSequence(raw, "`") || hasProcessSubstitution,
		hasProcessSubstitution,
		hasScriptHint: hasUnquotedScriptHint(raw)
	};
}
function extractShellWrappedCommandPayload(executable, args) {
	if (!executable) return null;
	const executableBase = normalizeOptionalLowercaseString(executable.split(/[\\/]/u).at(-1)) ?? "";
	const normalizedExecutable = executableBase.endsWith(".exe") ? executableBase.slice(0, -4) : executableBase;
	if (!/^(?:bash|dash|fish|ksh|sh|zsh)$/i.test(normalizedExecutable)) return null;
	const shortOptionsWithSeparateValue = /* @__PURE__ */ new Set(["-O", "-o"]);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args.at(i);
		if (arg === void 0) break;
		if (arg === "--") return null;
		if (arg === "-c") return args.at(i + 1) ?? null;
		if (/^-[A-Za-z]+$/u.test(arg)) {
			if (arg.includes("c")) return args.at(i + 1) ?? null;
			if (shortOptionsWithSeparateValue.has(arg)) i += 1;
			continue;
		}
		if (/^--[A-Za-z0-9][A-Za-z0-9-]*(?:=.*)?$/u.test(arg)) {
			if (!arg.includes("=")) {
				const next = args.at(i + 1);
				if (next && next !== "--" && !next.startsWith("-")) i += 1;
			}
			continue;
		}
		return null;
	}
	return null;
}
function shouldFailClosedInterpreterPreflight(command) {
	const raw = command.trim();
	const rawArgv = splitShellArgs(raw);
	const [directCommandToken, ...args] = rawArgv ? stripPreflightAssignments(stripPreflightEnvPrefix(rawArgv)) : [];
	const directExecutable = normalizeOptionalLowercaseString(directCommandToken);
	const isDirectInterpreterCommand = isInterpreterExecutable(directExecutable);
	const topLevel = analyzeInterpreterHeuristicsFromUnquoted(extractUnquotedShellText(raw) ?? raw);
	const shellWrappedPayload = extractShellWrappedCommandPayload(directExecutable, args);
	const nestedUnquoted = shellWrappedPayload ? extractUnquotedShellText(shellWrappedPayload) ?? shellWrappedPayload : "";
	const nested = shellWrappedPayload ? analyzeInterpreterHeuristicsFromUnquoted(nestedUnquoted) : {
		hasPython: false,
		hasNode: false,
		hasComplexSyntax: false,
		hasProcessSubstitution: false,
		hasScriptHint: false
	};
	const hasInterpreterInvocationInSegment = (rawSegment) => isInterpreterExecutable(resolveLeadingShellSegmentExecutable(rawSegment));
	const isScriptExecutingInterpreterCommand = (rawCommand) => {
		const [commandToken, ...argsLocal] = parsePreflightShellSegment(rawCommand);
		const executable = normalizeOptionalLowercaseString(commandToken);
		if (!executable) return false;
		if (/^python(?:3(?:\.\d+)?)?$/i.test(executable)) {
			const pythonInfoOnlyFlags = /* @__PURE__ */ new Set([
				"-V",
				"--version",
				"-h",
				"--help"
			]);
			if (argsLocal.some((arg) => pythonInfoOnlyFlags.has(arg))) return false;
			if (argsLocal.some((arg) => arg === "-c" || arg === "-m" || arg.startsWith("-c") || arg.startsWith("-m") || arg === "--check-hash-based-pycs")) return false;
			return true;
		}
		if (executable === "node") {
			const nodeInfoOnlyFlags = /* @__PURE__ */ new Set([
				"-v",
				"--version",
				"-h",
				"--help",
				"-c",
				"--check"
			]);
			if (argsLocal.some((arg) => nodeInfoOnlyFlags.has(arg))) return false;
			if (argsLocal.some((arg) => arg === "-e" || arg === "-p" || arg === "--eval" || arg === "--print" || arg.startsWith("--eval=") || arg.startsWith("--print=") || (arg.startsWith("-e") || arg.startsWith("-p")) && arg.length > 2)) return false;
			return true;
		}
		return false;
	};
	const hasScriptHintInSegment = (segment) => extractInterpreterScriptPathsFromSegment(segment).length > 0 || hasUnquotedScriptHint(segment);
	const hasInterpreterAndScriptHintInSameSegment = (rawText) => {
		return splitShellSegmentsOutsideQuotes(rawText, { splitPipes: true }).some((segment) => {
			if (!isScriptExecutingInterpreterCommand(segment)) return false;
			return hasScriptHintInSegment(segment);
		});
	};
	const hasInterpreterPipelineScriptHintInSameSegment = (rawText) => {
		return splitShellSegmentsOutsideQuotes(rawText, { splitPipes: false }).some((segment) => {
			if (!splitShellSegmentsOutsideQuotes(segment, { splitPipes: true }).slice(1).some((pipelineCommand) => isScriptExecutingInterpreterCommand(pipelineCommand))) return false;
			return hasScriptHintInSegment(segment);
		});
	};
	const hasInterpreterSegmentScriptHint = hasInterpreterAndScriptHintInSameSegment(raw) || shellWrappedPayload !== null && hasInterpreterAndScriptHintInSameSegment(shellWrappedPayload);
	const hasInterpreterPipelineScriptHint = hasInterpreterPipelineScriptHintInSameSegment(raw) || shellWrappedPayload !== null && hasInterpreterPipelineScriptHintInSameSegment(shellWrappedPayload);
	const hasShellWrappedInterpreterSegmentScriptHint = shellWrappedPayload !== null && hasInterpreterAndScriptHintInSameSegment(shellWrappedPayload);
	const hasShellWrappedInterpreterInvocation = (nested.hasPython || nested.hasNode) && (hasShellWrappedInterpreterSegmentScriptHint || nested.hasScriptHint || nested.hasComplexSyntax || nested.hasProcessSubstitution);
	const hasTopLevelInterpreterInvocation = splitShellSegmentsOutsideQuotes(raw, { splitPipes: true }).some((segment) => hasInterpreterInvocationInSegment(segment));
	return {
		hasInterpreterInvocation: isDirectInterpreterCommand || hasShellWrappedInterpreterInvocation || hasTopLevelInterpreterInvocation,
		hasComplexSyntax: topLevel.hasComplexSyntax || hasShellWrappedInterpreterInvocation,
		hasProcessSubstitution: topLevel.hasProcessSubstitution || nested.hasProcessSubstitution,
		hasInterpreterSegmentScriptHint,
		hasInterpreterPipelineScriptHint,
		isDirectInterpreterCommand
	};
}
//#endregion
//#region src/agents/bash-tools.exec-script-preflight.ts
const SKIPPABLE_SCRIPT_PREFLIGHT_FS_ERROR_CODES = /* @__PURE__ */ new Set([
	"EACCES",
	"EISDIR",
	"ELOOP",
	"EINVAL",
	"ENAMETOOLONG",
	"ENOENT",
	"ENOTDIR",
	"EPERM"
]);
const SCRIPT_PREFLIGHT_MAX_BYTES = 524288;
const FS_CONSTANTS_WITH_OPTIONAL_NONBLOCK = constants;
const SCRIPT_PREFLIGHT_OPEN_FLAGS = constants.O_RDONLY | (FS_CONSTANTS_WITH_OPTIONAL_NONBLOCK.O_NONBLOCK ?? 0);
function getNodeErrorCode(error) {
	if (typeof error !== "object" || error === null || !("code" in error)) return;
	return String(error.code);
}
const fsSafeModuleLoader = createLazyImportLoader(() => import("./fs-safe-CiNZtpYL.mjs"));
function findPythonShellVariable(content) {
	const shellVariable = /\$[A-Z_][A-Z0-9_]*/y;
	const pythonIdentifierCharacter = /[\p{ID_Continue}]/u;
	const contexts = [{
		kind: "code",
		delimiters: null,
		lambda: false
	}];
	let index = 0;
	while (index < content.length) {
		const context = contexts.at(-1);
		const char = content[index];
		if (context.kind === "string") {
			const delimiter = context.quote.repeat(context.triple ? 3 : 1);
			if (content.startsWith(delimiter, index)) {
				contexts.pop();
				index += delimiter.length;
			} else if (context.formatted && char === "\\" && content[index + 1] === "{") index += 1;
			else if (char === "\\") index += content[index + 1] === "\r" && content[index + 2] === "\n" ? 3 : 2;
			else if (!context.triple && (char === "\n" || char === "\r")) {
				contexts.pop();
				index += 1;
			} else if (context.formatted && (char === "{" && content[index + 1] === "{" || char === "}" && content[index + 1] === "}")) index += 2;
			else if (context.formatted && char === "{") {
				contexts.push({
					kind: "code",
					delimiters: ["}"],
					lambda: false
				});
				index += 1;
			} else index += 1;
			continue;
		}
		if (context.kind === "format") {
			if (char === "{") contexts.push({
				kind: "code",
				delimiters: ["}"],
				lambda: false
			});
			else if (char === "}") contexts.pop();
			index += 1;
			continue;
		}
		if (char === "#") {
			const newline = content.slice(index + 1).search(/[\r\n]/);
			index = newline === -1 ? content.length : index + newline + 2;
			continue;
		}
		if (char === "'" || char === "\"") {
			const prefix = content.slice(Math.max(0, index - 3), index);
			contexts.push({
				kind: "string",
				quote: char,
				triple: content.startsWith(char.repeat(3), index),
				formatted: /(?:^|[^A-Z0-9_])(?:F|FR|RF)$/i.test(prefix)
			});
			index += content.startsWith(char.repeat(3), index) ? 3 : 1;
			continue;
		}
		if (context.delimiters) {
			if (context.delimiters.length === 1 && !pythonIdentifierCharacter.test(content.charAt(index - 1)) && content.startsWith("lambda", index) && !pythonIdentifierCharacter.test(content.charAt(index + 6))) context.lambda = true;
			const closer = char === "(" ? ")" : char === "[" ? "]" : char === "{" ? "}" : null;
			if (closer) context.delimiters.push(closer);
			else if (context.delimiters.at(-1) === char) {
				context.delimiters.pop();
				if (context.delimiters.length === 0) contexts.pop();
			} else if (char === ":" && context.delimiters.length === 1) {
				if (context.lambda) context.lambda = false;
				else contexts[contexts.length - 1] = { kind: "format" };
			}
		}
		if (char === "$") {
			shellVariable.lastIndex = index;
			const match = shellVariable.exec(content);
			if (match) return match;
		}
		index += 1;
	}
	return null;
}
function shouldSkipScriptPreflightPathError(error, FsSafeError) {
	if (error instanceof FsSafeError) return true;
	const errorCode = getNodeErrorCode(error);
	return Boolean(errorCode && SKIPPABLE_SCRIPT_PREFLIGHT_FS_ERROR_CODES.has(errorCode));
}
function resolvePreflightRelativePath(params) {
	const root = path.resolve(params.rootDir);
	const candidate = path.resolve(params.absPath);
	const relative = path.relative(root, candidate);
	if (/^\.\.(?:[\\/]|$)/u.test(relative) || path.isAbsolute(relative)) return null;
	return relative;
}
function hasLeadingTildePathSegment(relativePath) {
	return /^~(?:$|[\\/])/u.test(relativePath);
}
async function readLiteralTildePreflightScript(params) {
	let handle;
	try {
		handle = await fs$1.open(params.absPath, SCRIPT_PREFLIGHT_OPEN_FLAGS);
		const stat = await handle.stat();
		if (!stat.isFile()) throw new params.fsSafe.FsSafeError("not-file", "not a file");
		if (stat.size > SCRIPT_PREFLIGHT_MAX_BYTES) throw new params.fsSafe.FsSafeError("too-large", `file exceeds limit of ${SCRIPT_PREFLIGHT_MAX_BYTES} bytes (got ${stat.size})`);
		const realPath = await params.fsSafe.resolveOpenedFileRealPathForHandle(handle, params.absPath);
		if (!params.fsSafe.isPathInside(params.workspaceRoot.rootReal, realPath)) throw new params.fsSafe.FsSafeError("outside-workspace", "file is outside workspace root");
		const { readFileHandleBounded } = await import("@openclaw/fs-safe/advanced");
		return (await readFileHandleBounded(handle, SCRIPT_PREFLIGHT_MAX_BYTES)).toString("utf-8");
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
async function validateScriptFileForShellBleed(params) {
	const target = extractScriptTargetFromCommand(params.command);
	if (!target) {
		const { hasInterpreterInvocation, hasComplexSyntax, hasProcessSubstitution, hasInterpreterSegmentScriptHint, hasInterpreterPipelineScriptHint, isDirectInterpreterCommand } = shouldFailClosedInterpreterPreflight(params.command);
		if (hasInterpreterInvocation && hasComplexSyntax && (hasInterpreterSegmentScriptHint || hasInterpreterPipelineScriptHint || hasProcessSubstitution && isDirectInterpreterCommand)) throw new Error("exec preflight: complex interpreter invocation detected; refusing to run without script preflight validation. Use a direct `python <file>.py` or `node <file>.js` command.");
		return;
	}
	if (target.kind === "node") return;
	const fsSafe = await fsSafeModuleLoader.load();
	const { FsSafeError, root: fsRoot } = fsSafe;
	const workspaceRoot = await fsRoot(params.workdir);
	for (const relOrAbsPath of target.relOrAbsPaths) {
		const absPath = path.isAbsolute(relOrAbsPath) ? path.resolve(relOrAbsPath) : path.resolve(params.workdir, relOrAbsPath);
		const relativePath = resolvePreflightRelativePath({
			rootDir: params.workdir,
			absPath
		});
		if (!relativePath) continue;
		let content;
		try {
			content = hasLeadingTildePathSegment(relativePath) ? await readLiteralTildePreflightScript({
				absPath,
				fsSafe,
				workspaceRoot
			}) : (await workspaceRoot.read(relativePath, {
				symlinks: "follow-within-root",
				maxBytes: SCRIPT_PREFLIGHT_MAX_BYTES
			})).buffer.toString("utf-8");
		} catch (error) {
			if (shouldSkipScriptPreflightPathError(error, FsSafeError)) continue;
			throw error;
		}
		const first = findPythonShellVariable(content);
		if (first) {
			const idx = first.index;
			const line = content.slice(0, idx).split(/\r\n?|\n/).length;
			const token = first[0];
			throw new Error([
				`exec preflight: detected likely shell variable injection (${token}) in ${target.kind} script: ${path.basename(absPath)}:${line}.`,
				`In Python, use os.environ.get(${JSON.stringify(token.slice(1))}) instead of raw ${token}.`,
				"(If this is inside a string literal on purpose, escape it or restructure the code.)"
			].join("\n"));
		}
	}
}
function shouldSkipExecScriptPreflight(params) {
	return params.host === "gateway" && params.security === "full" && params.ask === "off";
}
//#endregion
//#region src/agents/bash-tools.exec-support.ts
function attachExecApprovalReview(result, review) {
	if (review) {
		result.details.approvalReviews = [review];
		result.details.approvalReviewOutcome = review.status === "approved" ? "approved" : "denied";
	}
	return result;
}
function buildExecForegroundResult(params) {
	const warningText = params.warningText?.trim() ? `${params.warningText}\n\n` : "";
	const retentionCapNote = params.aggregateOutputDropped ? EXEC_RETENTION_CAP_NOTE : "";
	if (params.outcome.status === "failed") {
		const linuxOomGuidance = params.outcome.failureKind === "signal" && params.outcome.exitReason === "signal" && params.outcome.oomScoreWrapperSelected === true && (params.outcome.exitSignal === "SIGKILL" || params.outcome.exitSignal === 9) ? "\n\nOpenClaw selected its Linux OOM-score wrapper, which attempts to set this child's oom_score_adj to 1000. SIGKILL alone does not identify whether the Linux OOM killer, an operator, or another process sent it. Check cgroup memory events or kernel logs. If they show memory pressure, narrow the command or adjust memory, concurrency, or resource limits." : "";
		const outputText = `${retentionCapNote}${warningText}${params.outcome.reason}${linuxOomGuidance}`;
		return failedTextResult(outputText, {
			status: "failed",
			exitCode: params.outcome.exitCode ?? null,
			exitSignal: params.outcome.exitSignal,
			failureKind: params.outcome.failureKind,
			exitReason: params.outcome.exitReason,
			durationMs: params.outcome.durationMs,
			aggregated: params.outcome.aggregated,
			timedOut: params.outcome.timedOut,
			noOutputTimedOut: params.outcome.noOutputTimedOut,
			cwd: params.cwd
		});
	}
	const outputText = `${retentionCapNote}${warningText}${renderExecOutputText(params.outcome.aggregated)}`;
	return textResult(outputText, {
		status: "completed",
		exitCode: params.outcome.exitCode,
		exitSignal: params.outcome.exitSignal,
		exitReason: params.outcome.exitReason,
		durationMs: params.outcome.durationMs,
		aggregated: params.outcome.aggregated,
		noOutputTimedOut: params.outcome.noOutputTimedOut,
		cwd: params.cwd
	});
}
function resolveExecReviewerDefaults(params) {
	if (params.defaults?.reviewer) return params.defaults.reviewer;
	const cfg = params.defaults?.config;
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	return (agentId && cfg ? resolveAgentConfig(cfg, agentId)?.tools?.exec : void 0)?.reviewer ?? cfg?.tools?.exec?.reviewer;
}
function resolveExecElevatedMode(defaults, requested) {
	const elevated = defaults?.elevated;
	const defaultMode = elevated?.defaultLevel === "full" ? "full" : elevated?.defaultLevel === "ask" || elevated?.defaultLevel === "on" ? "ask" : "off";
	if (typeof requested === "boolean") return requested ? defaultMode === "full" ? "full" : "ask" : "off";
	return elevated?.enabled && elevated.allowed && !defaults?.sandboxRequired ? defaultMode : "off";
}
function createExecHostResolver(defaults) {
	return (params) => {
		const elevatedMode = resolveExecElevatedMode(defaults, params.elevated);
		const requestedTarget = requireValidExecTarget(params.host);
		return resolveExecTarget({
			configuredTarget: defaults?.host,
			requestedTarget,
			elevatedRequested: elevatedMode !== "off",
			sandboxAvailable: Boolean(defaults?.sandbox),
			sandboxRequired: defaults?.sandboxRequired
		}).effectiveHost;
	};
}
//#endregion
//#region src/agents/bash-tools.exec-run.ts
/**
* Exec tool policy, host dispatch, and process lifecycle pipeline.
*/
const BACKGROUND_EXEC_FOLLOW_UP = "Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.";
/** Creates an exec tool instance with runtime defaults and approval policy wiring. */
function createExecTool(defaults) {
	const secretEgressEnabled = isSecretEgressProxyActive();
	const cleanupMs = defaults?.cleanupMs;
	const preparedRunEnvironment = resolveExecPreparedRunEnvironment(defaults);
	const subagentExecution = resolveStoredSubagentCapabilities(defaults?.runSessionKey ?? defaults?.sessionKey, { cfg: defaults?.config }).depth > 0;
	let storeEnvPromise = defaults?.preparedStoreEnvironment === void 0 ? void 0 : Promise.resolve(defaults.preparedStoreEnvironment);
	const resolveStoreEnv = () => {
		if (storeEnvPromise === void 0) {
			const context = captureOpenClawStateReadWorkerContext();
			storeEnvPromise = import("./secret-store-B-u-2GyM.mjs").then((store) => store.readSecretStoreExecEnvironment({
				includeSecretSentinels: secretEgressEnabled,
				excludeNames: preparedRunEnvironment.excludedStoreNames,
				context
			}));
		}
		return storeEnvPromise;
	};
	const defaultBackgroundMs = clampWithDefault(defaults?.backgroundMs ?? readEnvInt("OPENCLAW_BASH_YIELD_MS", "PI_BASH_YIELD_MS"), 1e4, 10, 12e4);
	const backgroundAvailable = defaults?.processToolAvailabilityRef?.value ?? defaults?.allowBackground ?? true;
	const defaultTimeoutSec = resolveExecDefaultTimeoutSec(defaults?.timeoutSec);
	const defaultPathPrepend = normalizePathPrepend(defaults?.pathPrepend);
	const { safeBins, safeBinProfiles, trustedSafeBinDirs, unprofiledSafeBins, unprofiledInterpreterSafeBins } = resolveExecSafeBinRuntimePolicy({
		local: {
			safeBins: defaults?.safeBins,
			safeBinTrustedDirs: defaults?.safeBinTrustedDirs,
			safeBinProfiles: defaults?.safeBinProfiles
		},
		onWarning: logInfo
	});
	if (unprofiledSafeBins.length > 0) logInfo(`exec: ignoring unprofiled safeBins entries (${unprofiledSafeBins.toSorted().join(", ")}); use allowlist or define tools.exec.safeBinProfiles.<bin>`);
	if (unprofiledInterpreterSafeBins.length > 0) logInfo(`exec: interpreter/runtime binaries in safeBins (${unprofiledInterpreterSafeBins.join(", ")}) are unsafe without explicit hardened profiles; prefer allowlist entries`);
	const { notifyOnExit, notifyOnExitEmptySuccess, notifySessionKey, resolveSubagentSession, notifyDeliveryContext } = resolveExecNotificationDefaults(defaults);
	const backgroundFollowUp = notifyOnExit && notifyOnExitEmptySuccess ? `Completion will wake this conversation automatically. If only waiting remains, report that the job is running and end this turn; do not keep polling. ${BACKGROUND_EXEC_FOLLOW_UP}` : notifyOnExit ? `${BACKGROUND_EXEC_FOLLOW_UP} Completion wakes this conversation on output or failure; empty successful jobs are silent (tools.exec.notifyOnExitEmptySuccess=false). Arrange continuation or collect the result before ending the turn if empty success matters.` : `${BACKGROUND_EXEC_FOLLOW_UP} ${EXEC_MANUAL_COLLECTION_FOLLOW_UP}`;
	const approvalRunningNoticeMs = resolveApprovalRunningNoticeMs(defaults?.approvalRunningNoticeMs);
	const parsedAgentSession = parseAgentSessionKey(defaults?.sessionKey);
	const agentId = defaults?.agentId ?? (parsedAgentSession ? resolveAgentIdFromSessionKey(defaults?.sessionKey) : void 0);
	const resolveHostForParams = createExecHostResolver(defaults);
	const buildUnavailableWorkdirResult = (params) => buildExecForegroundResult({
		outcome: buildExecRuntimeErrorOutcome({
			error: formatUnavailableWorkdirFailure(params.cwd),
			aggregated: "",
			durationMs: params.startedAt ? Date.now() - params.startedAt : 0
		}),
		cwd: params.cwd,
		warningText: params.warningText
	});
	const requestPreparation = createExecRequestPreparation({
		defaults,
		agentId,
		resolveHostForParams
	});
	return {
		name: "exec",
		label: "exec",
		displaySummary: EXEC_TOOL_DISPLAY_SUMMARY,
		get description() {
			return describeExecTool({
				hasCronTool: defaults?.hasCronTool === true,
				autoReview: defaults?.mode === "auto"
			});
		},
		parameters: execSchema,
		getExecutionTimeoutMs: createExecToolExecutionTimeoutResolver(defaults),
		prepareBeforeToolCallParams: requestPreparation.prepareBeforeToolCallParams,
		finalizeBeforeToolCallParams: requestPreparation.finalizeBeforeToolCallParams,
		execute: async (toolCallId, args, signal, onUpdate) => {
			signal?.throwIfAborted();
			const assertSourceActive = captureAgentToolSourceExecutionGuard(signal);
			assertSupportedExecParams(args);
			let autoReviewer = defaults?.autoReviewer;
			if (!autoReviewer) {
				const reviewerParams = {
					cfg: defaults?.config,
					agentId,
					reviewer: resolveExecReviewerDefaults({
						defaults,
						agentId
					}),
					signal
				};
				autoReviewer = async (input) => {
					const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-DhcwtwJa.mjs");
					return createModelExecAutoReviewer(reviewerParams)(input);
				};
			}
			const reviewCommand = autoReviewer;
			autoReviewer = (input) => {
				const transcript = defaults?.reviewTranscript?.();
				return reviewCommand(transcript ? {
					...input,
					transcript
				} : input);
			};
			let params = requestPreparation.normalizeParams(args);
			const allowBackground = backgroundAvailable && params.awaitResults !== true;
			const resolveExecEnvPrepared = requestPreparation.isResolveExecEnvPrepared(args);
			const hookContext = requestPreparation.getExecHookContext(params);
			const preparedWorkdirState = requestPreparation.getResolvedExecWorkdirPreparedState(params);
			const warnings = [];
			const getWarningText = () => warnings.length ? `${warnings.join("\n")}\n\n` : "";
			const approvalWarningText = normalizeOptionalString(defaults?.approvalWarningText);
			if (approvalWarningText) warnings.push(approvalWarningText);
			const startedAt = Date.now();
			let execCommandOverride;
			let gatewayApproval;
			let approvalReview;
			const foregroundFallbackWarning = !backgroundAvailable && (params.background === true || typeof params.yieldMs === "number") ? "Warning: continuation options are unavailable; running synchronously." : void 0;
			const yieldWindow = allowBackground ? params.background === true ? 0 : clampWithDefault(params.yieldMs ?? defaultBackgroundMs, defaultBackgroundMs, 10, 12e4) : null;
			const elevatedDefaults = defaults?.elevated;
			const elevatedMode = resolveExecElevatedMode(defaults, params.elevated);
			const elevatedRequested = elevatedMode !== "off";
			if (elevatedRequested) {
				if (!elevatedDefaults?.enabled || !elevatedDefaults.allowed) {
					const runtime = defaults?.sandbox ? "sandboxed" : "direct";
					const gates = [];
					const contextParts = [];
					const provider = normalizeOptionalString(defaults?.messageProvider);
					const sessionKey = normalizeOptionalString(defaults?.sessionKey);
					if (provider) contextParts.push(`provider=${provider}`);
					if (sessionKey) contextParts.push(`session=${sessionKey}`);
					if (!elevatedDefaults?.enabled) gates.push("enabled (tools.elevated.enabled / agents.entries.*.tools.elevated.enabled)");
					else gates.push("allowFrom (tools.elevated.allowFrom.<provider> / agents.entries.*.tools.elevated.allowFrom.<provider>)");
					throw new Error([
						`elevated is not available right now (runtime=${runtime}).`,
						`Failing gates: ${gates.join(", ")}`,
						contextParts.length > 0 ? `Context: ${contextParts.join(" ")}` : void 0,
						"Fix-it keys:",
						"- tools.elevated.enabled",
						"- tools.elevated.allowFrom.<provider>",
						"- agents.entries.*.tools.elevated.enabled",
						"- agents.entries.*.tools.elevated.allowFrom.<provider>"
					].filter(Boolean).join("\n"));
				}
			}
			const requestedTarget = requireValidExecTarget(params.host);
			const target = resolveExecTarget({
				configuredTarget: defaults?.host,
				requestedTarget,
				elevatedRequested,
				sandboxAvailable: Boolean(defaults?.sandbox),
				sandboxRequired: defaults?.sandboxRequired
			});
			const host = target.effectiveHost;
			const explicitSecurity = defaults?.security;
			const configuredSecurity = explicitSecurity ?? (host === "sandbox" ? "deny" : "full");
			const modePolicy = resolveExecModePolicy({
				mode: defaults?.mode,
				security: configuredSecurity,
				ask: defaults?.ask ?? "off"
			});
			const approvalPolicy = host === "sandbox" || defaults?.bypassHostApprovalFloors === true ? void 0 : resolveExecApprovalsFromFileInternal({
				file: loadExecApprovals(),
				agentId,
				overrides: {
					security: "full",
					ask: "off"
				}
			}).agent;
			const security = minSecurity(modePolicy.security, approvalPolicy?.security ?? modePolicy.security);
			if (security === "deny" && (host !== "sandbox" || defaults?.mode === "deny" || explicitSecurity === "deny")) throw new Error(`exec denied: host=${host} security=deny`);
			const hostPolicyAllowsFullBypass = (approvalPolicy?.security ?? "full") === "full" && (approvalPolicy?.ask ?? "off") === "off";
			const modePolicyAllowsFullBypass = modePolicy.security === "full" && modePolicy.ask === "off";
			const requestedAsk = normalizeExecAsk(params.ask);
			const hostAsk = maxAsk(modePolicy.ask, approvalPolicy?.ask ?? modePolicy.ask);
			const trustedAsk = defaults?.messageProvider && hostAsk === "off" ? void 0 : requestedAsk;
			let ask = maxAsk(hostAsk, trustedAsk ?? hostAsk);
			const bypassApprovals = defaults?.bypassHostApprovalFloors === true && modePolicy.ask === "off" || elevatedRequested && elevatedMode === "full" && modePolicyAllowsFullBypass && hostPolicyAllowsFullBypass;
			if (bypassApprovals) ask = "off";
			const autoReview = modePolicy.autoReview && ask === modePolicy.ask && !bypassApprovals;
			const sandbox = host === "sandbox" ? defaults?.sandbox : void 0;
			if (target.selectedTarget === "sandbox" && !sandbox) throw new Error(["exec host=sandbox requires a sandbox runtime for this session.", "Enable sandbox mode (`agents.defaults.sandbox.mode=\"non-main\"` or `\"all\"`) or use host=auto/gateway/node."].join("\n"));
			if (!params.command) throw new Error("Provide a command to start.");
			await rejectUnsafeExecControlShellCommand(params.command);
			let workdir;
			let scriptPreflightCwd = null;
			let containerWorkdir = sandbox?.containerWorkdir;
			let discardPreparedSandboxWorkdir = null;
			const workdirResolution = preparedWorkdirState?.host === host ? preparedWorkdirState.resolution : await resolveExecWorkdir({
				host,
				workdir: params.workdir,
				defaultCwd: defaults?.cwd,
				nodeCwd: defaults?.nodeCwd,
				sandbox
			});
			if (workdirResolution.kind === "unavailable") return buildUnavailableWorkdirResult({
				cwd: workdirResolution.requestedCwd,
				startedAt,
				warningText: warnings.join("\n")
			});
			if (workdirResolution.kind === "sandbox") {
				workdir = workdirResolution.hostCwd;
				containerWorkdir = workdirResolution.containerCwd;
				scriptPreflightCwd = workdirResolution.scriptPreflightCwd;
				if (sandbox?.discardPreparedWorkdir && sandbox.workdirValidation === "backend") {
					const preparedContainerWorkdir = containerWorkdir;
					discardPreparedSandboxWorkdir = () => {
						sandbox.discardPreparedWorkdir?.(preparedContainerWorkdir);
					};
				}
			} else if (workdirResolution.kind === "local") {
				workdir = workdirResolution.hostCwd;
				scriptPreflightCwd = workdirResolution.hostCwd;
			} else workdir = workdirResolution.remoteCwd;
			if (host === "gateway" && workdir) await rejectUnsafeExecLiveStateSqliteShellCommand(params.command, {
				stateDir: resolveStateDir(),
				workdir
			});
			let run;
			let settled = false;
			let effectiveTimeout;
			try {
				if (elevatedRequested) logInfo(`exec: elevated command ${truncateMiddle(params.command, 120)}`);
				if (!resolveExecEnvPrepared) params = await requestPreparation.prepareParamsWithResolvedExecEnv(params, { hookContext });
				const resolvedExecEnvState = requestPreparation.getResolvedExecEnvPreparedState(params);
				const storeEnv = await resolveStoreEnv();
				assertSourceActive();
				const useSecretEgress = secretEgressEnabled && host === "gateway";
				if (useSecretEgress) {
					if (!defaults?.operationalRunInstance) throw new Error("Secret egress proxy requires an admitted agent run instance");
					assertSourceActive();
				}
				const secretEgressBindings = useSecretEgress ? storeEnv.secretEgressBindings ?? [] : void 0;
				const { env, requestedEnv } = resolvePreparedExecEnvironment({
					execParams: params,
					host,
					sandbox,
					containerWorkdir,
					channelContext: defaults?.channelContext,
					subagentExecution,
					defaultPathPrepend,
					pluginEnv: resolvedExecEnvState?.pluginEnv,
					storeEnv: host === "gateway" ? storeEnv.env : void 0,
					storeSecretEnv: useSecretEgress ? storeEnv.secretSentinels : void 0,
					...preparedRunEnvironment,
					warnings
				});
				if (host === "node") return executeNodeHostCommand({
					command: params.command,
					toolCallId,
					workdir,
					env,
					requestedEnv,
					requestedNode: params.node?.trim(),
					boundNode: defaults?.node?.trim(),
					sessionKey: defaults?.sessionKey,
					sessionId: defaults?.sessionId,
					sessionStore: defaults?.sessionStore,
					bashElevated: elevatedDefaults,
					approvalReviewerDeviceId: defaults?.approvalReviewerDeviceId,
					nonInteractiveApproval: defaults?.nonInteractiveApproval,
					approvalFollowupMode: defaults?.approvalFollowupMode,
					turnSourceChannel: defaults?.messageProvider,
					turnSourceTo: defaults?.currentChannelId,
					turnSourceAccountId: defaults?.accountId,
					turnSourceThreadId: defaults?.currentThreadTs,
					agentId,
					security,
					ask,
					bypassHostApprovalFloors: defaults?.bypassHostApprovalFloors,
					autoReview,
					autoReviewer,
					signal,
					strictInlineEval: defaults?.strictInlineEval,
					commandHighlighting: defaults?.commandHighlighting,
					trigger: defaults?.trigger,
					timeoutSec: params.timeoutSeconds,
					defaultTimeoutSec,
					approvalRunningNoticeMs,
					warnings,
					foregroundWarnings: foregroundFallbackWarning ? [foregroundFallbackWarning] : [],
					processContinuationAvailable: false,
					notifySessionKey,
					notifyOnExit,
					trustedSafeBinDirs
				});
				if (!workdir) throw new Error("exec internal error: local execution requires a resolved workdir");
				const githubProfileDir = host === "gateway" && preparedRunEnvironment.managedLocalIdentity ? preparedRunEnvironment.localIdentityEnv.GH_CONFIG_DIR : void 0;
				if (host === "gateway" && !bypassApprovals) {
					const gatewayResult = await processGatewayAllowlist({
						command: params.command,
						workdir,
						env,
						secretEgressBindings,
						githubProfileDir,
						pathPrepend: defaultPathPrepend,
						requestedEnv,
						pty: params.pty === true && !sandbox,
						timeoutSec: params.timeoutSeconds,
						defaultTimeoutSec,
						security,
						ask,
						bypassHostApprovalFloors: defaults?.bypassHostApprovalFloors,
						autoReview,
						autoReviewer,
						signal,
						safeBins,
						safeBinProfiles,
						strictInlineEval: defaults?.strictInlineEval,
						commandHighlighting: defaults?.commandHighlighting,
						trigger: defaults?.trigger,
						agentId,
						sessionKey: defaults?.sessionKey,
						runId: defaults?.runId,
						toolCallId,
						onApprovalReview: (review) => approvalReview = review,
						sessionId: defaults?.sessionId,
						sessionStore: defaults?.sessionStore,
						bashElevated: elevatedDefaults,
						approvalReviewerDeviceId: defaults?.approvalReviewerDeviceId,
						nonInteractiveApproval: defaults?.nonInteractiveApproval,
						turnSourceChannel: defaults?.messageProvider,
						turnSourceTo: defaults?.currentChannelId,
						turnSourceAccountId: defaults?.accountId,
						turnSourceThreadId: defaults?.currentThreadTs,
						scopeKey: defaults?.scopeKey,
						approvalFollowupText: defaults?.approvalFollowupText,
						approvalFollowup: defaults?.approvalFollowup,
						approvalFollowupMode: defaults?.approvalFollowupMode,
						warnings,
						notifySessionKey,
						approvalRunningNoticeMs,
						maxOutput: DEFAULT_MAX_OUTPUT,
						pendingMaxOutput: DEFAULT_PENDING_MAX_OUTPUT,
						cleanupMs,
						processContinuationAvailable: allowBackground,
						trustedSafeBinDirs
					});
					const immediateResult = gatewayResult.pendingResult ?? gatewayResult.deniedResult;
					if (immediateResult) return attachExecApprovalReview(immediateResult, approvalReview);
					signal?.throwIfAborted();
					gatewayApproval = gatewayResult;
					execCommandOverride = gatewayResult.allowWithoutEnforcedCommand ? void 0 : gatewayResult.execCommandOverride;
				}
				if (foregroundFallbackWarning) warnings.push(foregroundFallbackWarning);
				effectiveTimeout = params.timeoutSeconds ?? defaultTimeoutSec;
				const usePty = params.pty === true && !sandbox;
				if (scriptPreflightCwd && !shouldSkipExecScriptPreflight({
					host,
					security,
					ask
				})) await validateScriptFileForShellBleed({
					command: params.command,
					workdir: scriptPreflightCwd
				});
				const subagentSession = notifyOnExit && allowBackground ? await resolveSubagentSession() : false;
				assertSourceActive();
				run = await runExecProcess({
					command: params.command,
					execCommand: execCommandOverride,
					workdir,
					env,
					secretEgressBindings,
					githubProfileDir,
					pathPrepend: defaultPathPrepend,
					sandbox,
					containerWorkdir,
					usePty,
					warnings,
					maxOutput: DEFAULT_MAX_OUTPUT,
					pendingMaxOutput: DEFAULT_PENDING_MAX_OUTPUT,
					cleanupMs,
					notifyOnExit,
					subagentSession,
					notifyOnExitEmptySuccess,
					scopeKey: defaults?.scopeKey,
					sessionKey: notifySessionKey,
					agentId,
					eventRouting: defaults?.eventRouting,
					notifyDeliveryContext,
					timeoutSec: effectiveTimeout,
					processContinuationAvailable: allowBackground,
					startupSignal: signal,
					onUpdate,
					beforeSpawn: gatewayApproval?.revalidateBeforeExecution,
					assertCurrent: gatewayApproval?.assertCurrent,
					onSettledBeforeNotify: () => {
						settled = true;
					}
				});
				discardPreparedSandboxWorkdir = null;
			} catch (error) {
				discardPreparedSandboxWorkdir?.();
				return attachExecApprovalReview(ExecProcessPreflightError.unwrap(error), approvalReview);
			}
			let yielded = false;
			let yieldTimer = null;
			let registeredAbortSignal = null;
			let toolAborted = false;
			const onAbortSignal = () => {
				run.disableUpdates();
				if (yielded || run.session.backgrounded) return;
				toolAborted = true;
				if (yieldTimer) {
					clearTimeout(yieldTimer);
					yieldTimer = null;
				}
				run.kill();
			};
			const cleanupToolRunListeners = () => {
				run.disableUpdates();
				registeredAbortSignal?.removeEventListener("abort", onAbortSignal);
				registeredAbortSignal = null;
				if (yieldTimer) {
					clearTimeout(yieldTimer);
					yieldTimer = null;
				}
			};
			if (signal?.aborted) onAbortSignal();
			else if (signal) {
				signal.addEventListener("abort", onAbortSignal, { once: true });
				registeredAbortSignal = signal;
			}
			const backgrounded = withoutGatewayToolCallerIdentity(() => createDeferredCore());
			const result = withoutGatewayToolCallerIdentity(() => Promise.race([run.promise.then((outcome) => ({
				status: "settled",
				outcome
			})), backgrounded.promise]));
			const onYieldNow = () => {
				if (yielded || toolAborted || run.session.finalizing || settled) return;
				yielded = true;
				run.disableUpdates();
				markBackgrounded(run.session);
				backgrounded.resolve({ status: "backgrounded" });
			};
			try {
				if (!toolAborted && allowBackground && yieldWindow !== null) {
					if (yieldWindow === 0) onYieldNow();
					else yieldTimer = setTimeout(onYieldNow, yieldWindow);
				}
				const completed = await result;
				if (toolAborted) throw createAbortError$1("Tool execution was aborted", { cause: signal?.reason });
				return attachExecApprovalReview(completed.status === "settled" ? buildExecForegroundResult({
					outcome: completed.outcome,
					cwd: run.session.cwd,
					warningText: getWarningText(),
					aggregateOutputDropped: run.session.totalOutputChars > run.session.aggregated.length
				}) : {
					content: [{
						type: "text",
						text: `${getWarningText()}Command still running (session ${run.session.id}, pid ${run.session.pid ?? "n/a"}). ${backgroundFollowUp}`
					}],
					details: {
						status: "running",
						sessionId: run.session.id,
						pid: run.session.pid ?? void 0,
						startedAt: run.startedAt,
						cwd: run.session.cwd,
						tail: run.session.tail,
						followUp: backgroundFollowUp
					}
				}, approvalReview);
			} catch (error) {
				if (toolAborted) throw createAbortError$1("Tool execution was aborted", { cause: signal?.reason });
				throw error;
			} finally {
				cleanupToolRunListeners();
			}
		}
	};
}
/** Default exec tool instance used by agent tool registries. */
const execTool = createExecTool();
//#endregion
//#region src/agents/bash-process-control.ts
function cancelBackgroundExecSession(sessionId) {
	const session = getSession(sessionId);
	if (!session?.backgrounded || session.exited || session.finalizing) return false;
	const supervisor = getProcessSupervisor();
	if (!session.processActivity || session.processActivity.resultSettled) return false;
	supervisor.cancel(sessionId, "manual-cancel");
	session.cancellationRequested = true;
	return true;
}
//#endregion
//#region src/agents/pty-keys.ts
/**
* Encodes terminal key, hex, literal, and paste inputs into PTY byte
* sequences. The encoder handles xterm modifiers and DECCKM application
* cursor mode.
*/
const ESC = "\x1B";
const CR = "\r";
const TAB = "	";
const BACKSPACE = "";
/** Bracketed-paste prefix emitted before pasted text. */
const BRACKETED_PASTE_START = `${ESC}[200~`;
/** Bracketed-paste suffix emitted after pasted text. */
const BRACKETED_PASTE_END = `${ESC}[201~`;
/** SS3 sequences for DECCKM application cursor key mode (smkx). */
const DECCKM_SS3_KEYS = {
	up: `${ESC}OA`,
	down: `${ESC}OB`,
	right: `${ESC}OC`,
	left: `${ESC}OD`,
	home: `${ESC}OH`,
	end: `${ESC}OF`
};
const namedKeyMap = /* @__PURE__ */ new Map([
	["enter", CR],
	["return", CR],
	["tab", TAB],
	["escape", ESC],
	["esc", ESC],
	["space", " "],
	["bspace", BACKSPACE],
	["backspace", BACKSPACE],
	["up", `${ESC}[A`],
	["down", `${ESC}[B`],
	["right", `${ESC}[C`],
	["left", `${ESC}[D`],
	["home", `${ESC}[1~`],
	["end", `${ESC}[4~`],
	["pageup", `${ESC}[5~`],
	["pgup", `${ESC}[5~`],
	["ppage", `${ESC}[5~`],
	["pagedown", `${ESC}[6~`],
	["pgdn", `${ESC}[6~`],
	["npage", `${ESC}[6~`],
	["insert", `${ESC}[2~`],
	["ic", `${ESC}[2~`],
	["delete", `${ESC}[3~`],
	["del", `${ESC}[3~`],
	["dc", `${ESC}[3~`],
	["btab", `${ESC}[Z`],
	["f1", `${ESC}OP`],
	["f2", `${ESC}OQ`],
	["f3", `${ESC}OR`],
	["f4", `${ESC}OS`],
	["f5", `${ESC}[15~`],
	["f6", `${ESC}[17~`],
	["f7", `${ESC}[18~`],
	["f8", `${ESC}[19~`],
	["f9", `${ESC}[20~`],
	["f10", `${ESC}[21~`],
	["f11", `${ESC}[23~`],
	["f12", `${ESC}[24~`],
	["kp/", `${ESC}Oo`],
	["kp*", `${ESC}Oj`],
	["kp-", `${ESC}Om`],
	["kp+", `${ESC}Ok`],
	["kp7", `${ESC}Ow`],
	["kp8", `${ESC}Ox`],
	["kp9", `${ESC}Oy`],
	["kp4", `${ESC}Ot`],
	["kp5", `${ESC}Ou`],
	["kp6", `${ESC}Ov`],
	["kp1", `${ESC}Oq`],
	["kp2", `${ESC}Or`],
	["kp3", `${ESC}Os`],
	["kp0", `${ESC}Op`],
	["kp.", `${ESC}On`],
	["kpenter", `${ESC}OM`]
]);
const modifiableNamedKeys = /* @__PURE__ */ new Set([
	"up",
	"down",
	"left",
	"right",
	"home",
	"end",
	"pageup",
	"pgup",
	"ppage",
	"pagedown",
	"pgdn",
	"npage",
	"insert",
	"ic",
	"delete",
	"del",
	"dc"
]);
/** True when request keys depend on normal vs application cursor-key mode. */
function hasCursorModeSensitiveKeys(request) {
	return request.keys?.some((raw) => {
		const token = raw.trim();
		if (!token) return false;
		const parsed = parseModifiers(token);
		if (hasAnyModifier(parsed.mods)) return false;
		return Object.hasOwn(DECCKM_SS3_KEYS, normalizeLowercaseStringOrEmpty(parsed.base));
	}) ?? false;
}
/** Encodes literal, hex, and named key tokens into one PTY byte payload. */
function encodeKeySequence(request, cursorKeyMode) {
	const warnings = [];
	const hexBytes = [];
	for (const raw of request.hex ?? []) {
		const byte = parseHexByte(raw);
		if (byte === null) {
			warnings.push(`Invalid hex byte: ${raw}`);
			continue;
		}
		hexBytes.push(byte);
	}
	const keys = request.keys?.map((token) => encodeKeyToken(token, warnings, cursorKeyMode)).join("");
	return {
		data: Buffer.concat([
			Buffer.from(request.literal ?? ""),
			Buffer.from(hexBytes),
			Buffer.from(keys ?? "")
		]),
		warnings
	};
}
/** Wraps pasted text in bracketed-paste markers when enabled. */
function encodePaste(text, bracketed = true) {
	if (!bracketed) return text;
	return `${BRACKETED_PASTE_START}${text}${BRACKETED_PASTE_END}`;
}
function encodeKeyToken(raw, warnings, cursorKeyMode) {
	const token = raw.trim();
	if (!token) return "";
	if (token.length === 2 && token.startsWith("^")) {
		const ctrl = toCtrlChar(token.charAt(1));
		if (ctrl) return ctrl;
	}
	const parsed = parseModifiers(token);
	const base = parsed.base;
	const baseLower = normalizeLowercaseStringOrEmpty(base);
	if (baseLower === "tab" && parsed.mods.shift) return `${ESC}[Z`;
	if (modifiableNamedKeys.has(baseLower) && cursorKeyMode === "application" && !hasAnyModifier(parsed.mods)) {
		const ss3Seq = DECCKM_SS3_KEYS[baseLower];
		if (ss3Seq) return ss3Seq;
	}
	const baseSeq = namedKeyMap.get(baseLower);
	if (baseSeq) {
		if (modifiableNamedKeys.has(baseLower) && hasAnyModifier(parsed.mods)) {
			const parameter = baseSeq.slice(2, -1) || "1";
			return `${ESC}[${parameter};${xtermModifier(parsed.mods)}${baseSeq.at(-1)}`;
		}
		return parsed.mods.alt ? `${ESC}${baseSeq}` : baseSeq;
	}
	if (base.length === 1) return applyCharModifiers(base, parsed.mods);
	if (hasAnyModifier(parsed.mods)) warnings.push(`Unknown key "${base}" for modifiers; sending literal.`);
	return base;
}
function parseModifiers(token) {
	const mods = {
		ctrl: false,
		alt: false,
		shift: false
	};
	let rest = token;
	while (rest.length > 2 && rest[1] === "-") {
		const mod = normalizeLowercaseStringOrEmpty(rest[0]);
		if (mod === "c") mods.ctrl = true;
		else if (mod === "m") mods.alt = true;
		else if (mod === "s") mods.shift = true;
		else break;
		rest = rest.slice(2);
	}
	return {
		mods,
		base: rest
	};
}
function applyCharModifiers(char, mods) {
	let value = char;
	if (mods.shift && value.length === 1 && /[a-z]/.test(value)) value = value.toUpperCase();
	if (mods.ctrl) {
		const ctrl = toCtrlChar(value);
		if (ctrl) value = ctrl;
	}
	if (mods.alt) value = `${ESC}${value}`;
	return value;
}
function toCtrlChar(char) {
	if (char === "?") return "";
	const code = char.toUpperCase().charCodeAt(0);
	if (code >= 64 && code <= 95) return String.fromCharCode(code & 31);
	return null;
}
function xtermModifier(mods) {
	return 1 + (mods.shift ? 1 : 0) + (mods.alt ? 2 : 0) + (mods.ctrl ? 4 : 0);
}
function hasAnyModifier(mods) {
	return mods.ctrl || mods.alt || mods.shift;
}
function parseHexByte(raw) {
	const lower = normalizeLowercaseStringOrEmpty(raw);
	const normalized = lower.startsWith("0x") ? lower.slice(2) : lower;
	if (!/^[0-9a-f]{1,2}$/.test(normalized)) return null;
	return Number.parseInt(normalized, 16);
}
//#endregion
//#region src/agents/bash-tools.process-send-keys.ts
function failText$1(text) {
	return textResult(text, {
		status: "failed",
		error: text
	});
}
async function writeProcessStdin(stdin, data) {
	await new Promise((resolve, reject) => {
		stdin.write(data, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}
/** Encode and write requested key data into a running process session. */
async function handleProcessSendKeys(params) {
	const request = {
		keys: params.keys,
		hex: params.hex,
		literal: params.literal
	};
	if (params.session.cursorKeyMode === "unknown" && hasCursorModeSensitiveKeys(request)) return failText$1(`Session ${params.sessionId} cursor key mode is not known yet. Poll or log until startup output appears, then retry send-keys.`);
	const { data, warnings } = encodeKeySequence(request, params.session.cursorKeyMode === "unknown" ? void 0 : params.session.cursorKeyMode);
	if (data.length === 0) return failText$1("No key data provided.");
	await writeProcessStdin(params.stdin, data);
	const text = `Sent ${data.length} bytes to session ${params.sessionId}.` + (warnings.length ? `\nWarnings:\n- ${warnings.join("\n- ")}` : "");
	return textResult(text, {
		status: "running",
		sessionId: params.sessionId,
		name: deriveSessionName(params.session.command)
	});
}
//#endregion
//#region src/agents/bash-tools.process.ts
/**
* Process-control tool factory.
* Lists, polls, logs, writes to, sends keys to, pastes into, kills, clears,
* and removes background exec sessions.
*/
const DEFAULT_LOG_TAIL_LINES = 200;
const DEFAULT_INPUT_WAIT_IDLE_MS = 15e3;
const MIN_INPUT_WAIT_IDLE_MS = 1e3;
const MAX_INPUT_WAIT_IDLE_MS = 6e5;
const PROCESS_TOOL_ACTIONS = processSchema.properties.action.enum;
const pollScopeByAssistantMessage = /* @__PURE__ */ new WeakMap();
function currentPollScope() {
	const assistantMessage = getAgentToolExecutionContext()?.assistantMessage;
	if (!assistantMessage) return;
	const existing = pollScopeByAssistantMessage.get(assistantMessage);
	if (existing) return existing;
	const scope = {};
	pollScopeByAssistantMessage.set(assistantMessage, scope);
	return scope;
}
function resolveLogSliceWindow(offset, limit) {
	const usingDefaultTail = offset === void 0 && limit === void 0;
	return {
		effectiveOffset: offset,
		effectiveLimit: typeof limit === "number" && Number.isFinite(limit) ? limit : usingDefaultTail ? DEFAULT_LOG_TAIL_LINES : void 0,
		usingDefaultTail
	};
}
function defaultTailNote(totalLines, usingDefaultTail) {
	if (!usingDefaultTail || totalLines <= DEFAULT_LOG_TAIL_LINES) return "";
	return `\n\n[showing last ${DEFAULT_LOG_TAIL_LINES} of ${totalLines} lines; pass offset/limit to page]`;
}
function retentionCapNote(session) {
	return session.totalOutputChars > session.aggregated.length ? EXEC_RETENTION_CAP_NOTE : "";
}
const MAX_POLL_WAIT_MS = 3e4;
function isWritableStdin(stdin) {
	if (!stdin || stdin.destroyed) return false;
	if (stdin.writable === false || stdin.writableEnded === true || stdin.writableFinished === true) return false;
	return true;
}
function resolvePollWaitMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.min(MAX_POLL_WAIT_MS, Math.floor(value)));
	if (typeof value === "string" && /^[+-]?\d+$/.test(value.trim())) {
		const parsed = Number(value.trim());
		if (Number.isSafeInteger(parsed)) return Math.max(0, Math.min(MAX_POLL_WAIT_MS, parsed));
	}
	return 0;
}
function failText(text) {
	return textResult(text, {
		status: "failed",
		error: text
	});
}
function recordPollRetrySuggestion(sessionId, hasNewOutput) {
	try {
		const sessionState = getDiagnosticSessionState({ sessionId });
		return recordCommandPoll(sessionState, sessionId, hasNewOutput);
	} catch {
		return;
	}
}
function resetPollRetrySuggestion(sessionId) {
	try {
		const sessionState = getDiagnosticSessionState({ sessionId });
		resetCommandPollCount(sessionState, sessionId);
	} catch {}
}
function isConfirmedRequestedStop(session) {
	return session.cancellationRequested === true && session.exitReason === "manual-cancel" && session.finalizationFailed !== true;
}
function finishedSessionDetails(sessionId, finished) {
	return {
		status: finished.terminalStatus === "completed" || isConfirmedRequestedStop(finished) ? "completed" : "failed",
		sessionId,
		exitCode: finished.exitCode ?? void 0,
		...finished.exitSignal != null ? { exitSignal: finished.exitSignal } : {},
		...finished.exitReason ? {
			exitReason: finished.exitReason,
			timedOut: finished.exitReason === "overall-timeout" || finished.exitReason === "no-output-timeout"
		} : {},
		...finished.noOutputTimedOut !== void 0 ? { noOutputTimedOut: finished.noOutputTimedOut } : {},
		name: deriveSessionName(finished.command)
	};
}
function finishedPollResult(sessionId, finished, pollScope) {
	resetPollRetrySuggestion(sessionId);
	const delivery = prepareSessionPoll(finished, pollScope);
	const { output: unreadOutput, outputDropped } = delivery;
	const output = unreadOutput.trim();
	const retainedOutputNote = outputDropped ? getFinishedSession(sessionId) === finished ? "[earlier output is omitted from this poll; use action=log with offset and limit to inspect retained output]\n\n" : "[earlier output is omitted from this poll; omitted output is no longer available through action=log]\n\n" : "";
	const text = appendExecTimeoutRetryGuidance(retentionCapNote(finished) + retainedOutputNote + (output || "(no new output)") + (isConfirmedRequestedStop(finished) ? `\n\nProcess stopped by request (${renderExecExitLabel(finished)}).` : `\n\nProcess exited with ${renderExecExitLabel(finished)}.`), finished.exitReason);
	return attachInternalToolResultAcknowledgement(textResult(text, {
		...finishedSessionDetails(sessionId, finished),
		aggregated: finished.aggregated
	}), () => {
		delivery.acknowledge();
		acknowledgeNotifyOnExit(finished);
	});
}
function createAbortError(reason) {
	if (reason instanceof Error) return reason;
	return createAbortError$1(typeof reason === "string" ? reason : "Aborted");
}
async function sleepPollInterval(ms, signal) {
	if (signal?.aborted) throw createAbortError(signal.reason);
	await new Promise((resolve, reject) => {
		const cleanup = () => {
			if (timer) clearTimeout(timer);
			if (onAbort) signal?.removeEventListener("abort", onAbort);
		};
		const onResolve = () => {
			cleanup();
			resolve();
		};
		const onAbort = () => {
			cleanup();
			reject(createAbortError(signal?.reason));
		};
		const timer = setTimeout(onResolve, ms);
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function assertSupportedProcessParams(args) {
	if (isRecord(args) && Object.hasOwn(args, "timeoutMs")) throw new ToolInputError("process parameter \"timeoutMs\" is unsupported; use \"timeout\" instead");
}
/** Build the process-control tool with optional scope and input-idle defaults. */
function createProcessTool(defaults) {
	const assertSourceCurrent = captureAgentToolSourceExecutionGuard();
	const scopeKey = defaults?.scopeKey;
	const inputWaitIdleMs = clampWithDefault(defaults?.inputWaitIdleMs ?? readEnvInt("OPENCLAW_PROCESS_INPUT_WAIT_IDLE_MS"), DEFAULT_INPUT_WAIT_IDLE_MS, MIN_INPUT_WAIT_IDLE_MS, MAX_INPUT_WAIT_IDLE_MS);
	const isInScope = (session) => !scopeKey || session?.scopeKey === scopeKey;
	const describeRunningSession = (session) => {
		const lastOutputAt = session.processActivity?.lastOutputAtMs ?? session.startedAt;
		const idleMs = Math.max(0, Date.now() - lastOutputAt);
		const stdinWritable = isWritableStdin(session.stdin);
		return {
			...session.notifyOnExit === false ? { followUp: EXEC_MANUAL_COLLECTION_FOLLOW_UP } : {},
			stdinWritable,
			waitingForInput: stdinWritable && idleMs >= inputWaitIdleMs,
			idleMs,
			lastOutputAt
		};
	};
	const buildInputWaitHint = (runtime) => {
		if (!runtime?.waitingForInput) return "";
		return `\n\nNo new output for ${formatDurationCompact(runtime.idleMs) ?? `${runtime.idleMs}ms`}; this session may be waiting for input. Use process write, send-keys, submit, or paste to provide input.`;
	};
	return {
		name: "process",
		label: "process",
		displaySummary: PROCESS_TOOL_DISPLAY_SUMMARY,
		description: describeProcessTool({ hasCronTool: defaults?.hasCronTool === true }),
		parameters: processSchema,
		outputSchema: ProcessToolOutputSchema,
		execute: async (_toolCallId, args, signal, _onUpdate) => {
			const assertCurrent = () => {
				signal?.throwIfAborted();
				assertSourceCurrent();
			};
			assertCurrent();
			assertSupportedProcessParams(args);
			const action = args.action;
			if (!PROCESS_TOOL_ACTIONS.includes(action)) return failText(`Invalid process action. Expected one of: ${PROCESS_TOOL_ACTIONS.join(", ")}`);
			const params = args;
			if (params.action === "list") {
				const sessions = [...listRunningSessions(), ...listFinishedSessions()].filter((s) => isInScope(s)).toSorted(compareProcessSessionStartOrder).map((s) => Object.assign({
					sessionId: s.id,
					status: s.terminalStatus ?? "running",
					startedAt: s.startedAt,
					runtimeMs: (s.endedAt ?? Date.now()) - s.startedAt,
					cwd: s.cwd,
					command: s.command,
					name: deriveSessionName(s.command),
					tail: s.tail,
					truncated: s.truncated
				}, s.endedAt !== void 0 ? {
					...finishedSessionDetails(s.id, s),
					status: s.terminalStatus ?? "running",
					endedAt: s.endedAt
				} : Object.assign({ pid: s.pid ?? void 0 }, describeRunningSession(s))));
				const lines = sessions.map((s) => {
					const label = s.name ? truncateMiddle(s.name, 80) : truncateMiddle(s.command, 120);
					const timeoutReason = "exitReason" in s && (s.exitReason === "overall-timeout" || s.exitReason === "no-output-timeout") ? s.exitReason : void 0;
					const timeoutMarker = timeoutReason ? ` [${timeoutReason}]` : "";
					const marker = "waitingForInput" in s && s.waitingForInput ? " [input-wait]" : "";
					const wakeMarker = "followUp" in s ? " [no exit wake]" : "";
					return `${s.sessionId} ${s.status.padEnd(9)} ${formatDurationCompact(s.runtimeMs) ?? "n/a"}${timeoutMarker}${marker}${wakeMarker} :: ${label}`;
				});
				const followUp = sessions.some((s) => "followUp" in s) ? `\n\n${EXEC_MANUAL_COLLECTION_FOLLOW_UP}` : "";
				return textResult((lines.join("\n") || "No running or recent sessions.") + followUp, {
					status: "completed",
					sessions
				});
			}
			if (!params.sessionId) return failText("sessionId is required for this action.");
			const session = getSession(params.sessionId);
			const finished = getFinishedSession(params.sessionId);
			const scopedSession = isInScope(session) ? session : void 0;
			const scopedFinished = isInScope(finished) ? finished : void 0;
			const resolveBackgroundedWritableStdin = () => {
				if (!scopedSession) return {
					ok: false,
					result: failText(`No active session found for ${params.sessionId}`)
				};
				if (!scopedSession.backgrounded) return {
					ok: false,
					result: failText(`Session ${params.sessionId} is not backgrounded.`)
				};
				if (scopedSession.finalizing) return {
					ok: false,
					result: failText(`Session ${params.sessionId} is finalizing.`)
				};
				const stdin = scopedSession.stdin;
				if (!isWritableStdin(stdin)) return {
					ok: false,
					result: failText(`Session ${params.sessionId} stdin is not writable.`)
				};
				return {
					ok: true,
					session: scopedSession,
					stdin
				};
			};
			const runningSessionResult = (sessionLocal, text) => textResult(text, {
				status: "running",
				sessionId: params.sessionId,
				name: deriveSessionName(sessionLocal.command)
			});
			switch (params.action) {
				case "poll": {
					const pollScope = currentPollScope();
					if (!scopedSession) {
						if (scopedFinished) return finishedPollResult(params.sessionId, scopedFinished, pollScope);
						resetPollRetrySuggestion(params.sessionId);
						return failText(`No session found for ${params.sessionId}`);
					}
					if (!scopedSession.backgrounded) return failText(`Session ${params.sessionId} is not backgrounded.`);
					const pollWaitMs = resolvePollWaitMs(params.timeout);
					if (pollWaitMs > 0 && !scopedSession.exited) {
						if (signal?.aborted) throw createAbortError(signal.reason);
						const deadline = Date.now() + pollWaitMs;
						while (!scopedSession.exited && !hasPendingPollDelivery(scopedSession) && scopedSession.pendingOutput.length === 0 && !scopedSession.pendingOutputDropped && Date.now() < deadline) await sleepPollInterval(Math.max(0, Math.min(250, deadline - Date.now())), signal);
					}
					if (scopedSession.exited) {
						if (scopedSession.endedAt !== void 0 && isInScope(scopedSession)) return finishedPollResult(params.sessionId, scopedSession, pollScope);
						resetPollRetrySuggestion(params.sessionId);
						return failText(`No session found for ${params.sessionId}`);
					}
					const delivery = prepareSessionPoll(scopedSession, pollScope);
					const { output: unreadOutput, outputDropped } = delivery;
					const output = unreadOutput.trim();
					const aggregateOutputNote = retentionCapNote(scopedSession);
					const retainedOutputNote = outputDropped ? "[earlier output is omitted from this poll; use action=log with offset and limit to inspect retained output]\n\n" : "";
					const hasNewOutput = output.length > 0;
					const retryInMs = recordPollRetrySuggestion(params.sessionId, hasNewOutput);
					const runtime = describeRunningSession(scopedSession);
					const text = aggregateOutputNote + retainedOutputNote + (output || "(no new output)") + (buildInputWaitHint(runtime) || "\n\nProcess still running.") + (runtime.followUp ? `\n\n${runtime.followUp}` : "");
					return attachInternalToolResultAcknowledgement(textResult(text, {
						status: "running",
						sessionId: params.sessionId,
						aggregated: scopedSession.aggregated,
						name: deriveSessionName(scopedSession.command),
						...runtime,
						...typeof retryInMs === "number" ? { retryInMs } : {}
					}), () => delivery.acknowledge());
				}
				case "log": {
					const record = scopedSession ?? scopedFinished;
					if (!record) return failText(`No session found for ${params.sessionId}`);
					if (scopedSession && !scopedSession.backgrounded) return failText(`Session ${params.sessionId} is not backgrounded.`);
					const window = resolveLogSliceWindow(params.offset, params.limit);
					const { slice, totalLines, totalChars } = sliceLogLines(record.aggregated, window.effectiveOffset, window.effectiveLimit);
					const runtime = scopedSession ? describeRunningSession(scopedSession) : void 0;
					const text = retentionCapNote(record) + (slice || (scopedSession ? "(no output yet)" : "(no output recorded)")) + defaultTailNote(totalLines, window.usingDefaultTail) + (isConfirmedRequestedStop(record) ? `\n\nProcess stopped by request (${renderExecExitLabel(record)}).` : "");
					const output = runtime ? text + buildInputWaitHint(runtime) + (runtime.followUp ? `\n\n${runtime.followUp}` : "") : appendExecTimeoutRetryGuidance(text, record.exitReason);
					return textResult(output, {
						...runtime ? {
							status: record.exited ? "completed" : "running",
							sessionId: params.sessionId,
							name: deriveSessionName(record.command),
							...runtime
						} : finishedSessionDetails(params.sessionId, record),
						output,
						total: totalLines,
						totalLines,
						totalChars,
						truncated: record.truncated
					});
				}
				case "write":
				case "send-keys":
				case "submit":
				case "paste": {
					const inputAction = params.action;
					const resolved = resolveBackgroundedWritableStdin();
					if (!resolved.ok) return resolved.result;
					if (inputAction === "send-keys") return await handleProcessSendKeys({
						sessionId: params.sessionId,
						session: resolved.session,
						stdin: resolved.stdin,
						keys: params.keys,
						hex: params.hex,
						literal: params.literal
					});
					const payload = inputAction === "paste" ? encodePaste(params.text ?? "", params.bracketed !== false) : inputAction === "submit" ? "\r" : params.data ?? "";
					if (inputAction === "paste" && !payload) return failText("No paste text provided.");
					await writeProcessStdin(resolved.stdin, payload);
					if (inputAction === "write" && params.eof) {
						assertCurrent();
						resolved.stdin.end();
					}
					const text = inputAction === "paste" ? `Pasted ${params.text?.length ?? 0} chars to session ${params.sessionId}.` : inputAction === "submit" ? `Submitted session ${params.sessionId} (sent CR).` : `Wrote ${Buffer.byteLength(params.data ?? "", "utf8")} bytes to session ${params.sessionId}${params.eof ? " (stdin closed)" : ""}.`;
					return runningSessionResult(resolved.session, text);
				}
				case "kill":
					if (!scopedSession) return failText(`No active session found for ${params.sessionId}`);
					if (!scopedSession.backgrounded) return failText(`Session ${params.sessionId} is not backgrounded.`);
					if (scopedSession.finalizing) return failText(`Session ${params.sessionId} is finalizing.`);
					if (!cancelBackgroundExecSession(scopedSession.id)) return failText(`Unable to terminate session ${params.sessionId}: no active supervisor cancellation handle. Use process poll to check whether it is already exiting.`);
					resetPollRetrySuggestion(params.sessionId);
					return textResult(`Termination requested for session ${params.sessionId}.`, {
						status: "completed",
						name: deriveSessionName(scopedSession.command)
					});
				case "clear":
					if (scopedFinished) {
						resetPollRetrySuggestion(params.sessionId);
						deleteSession(params.sessionId);
						return textResult(`Cleared session ${params.sessionId}.`, { status: "completed" });
					}
					return failText(`No finished session found for ${params.sessionId}`);
				case "remove":
					if (scopedSession) {
						if (!scopedSession.backgrounded) return failText(`Session ${params.sessionId} is not backgrounded.`);
						if (scopedSession.finalizing) return failText(`Session ${params.sessionId} is finalizing.`);
						if (!cancelBackgroundExecSession(scopedSession.id)) return failText(`Unable to remove session ${params.sessionId}: no active supervisor cancellation handle. Use process poll to check whether it is already exiting.`);
						scopedSession.backgrounded = false;
						deleteSession(params.sessionId);
						resetPollRetrySuggestion(params.sessionId);
						return textResult(`Removed session ${params.sessionId} (termination requested).`, {
							status: "completed",
							name: deriveSessionName(scopedSession.command)
						});
					}
					if (scopedFinished) {
						resetPollRetrySuggestion(params.sessionId);
						deleteSession(params.sessionId);
						return textResult(`Removed session ${params.sessionId}.`, { status: "completed" });
					}
					return failText(`No session found for ${params.sessionId}`);
			}
			return failText(`Unknown action ${params.action}`);
		}
	};
}
/** Shared process-control tool instance used by the default Bash tool barrel. */
const processTool = createProcessTool();
//#endregion
export { execTool as a, createExecTool as i, processTool as n, cancelBackgroundExecSession as r, createProcessTool as t };
