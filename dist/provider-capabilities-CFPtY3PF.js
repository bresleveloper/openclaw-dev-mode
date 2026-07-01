import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as addTimerTimeoutGraceMs, j as resolveTimerTimeoutMs, p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-BApvfmPs.js";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CLCyIzm6.js";
import { a as isSubagentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { f as resolveModelAuthMode } from "./model-auth-Bvz14MtI.js";
import { n as isToolAllowed } from "./tool-policy-CpCrrYL4.js";
import { M as getChannelAgentToolMeta, N as consumeAdjustedParamsForToolCall, P as consumePreExecutionBlockedToolCall, c as isToolWrappedWithBeforeToolCallHook, h as wrapToolWithBeforeToolCallHook, i as finalizeToolTerminalPresentation, m as setBeforeToolCallDiagnosticsEnabled, p as runBeforeToolCallHook } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { i as getPluginToolMeta } from "./tools-DG6VDQeD.js";
import { t as callGatewayTool } from "./gateway-BHJLRjIg.js";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-C_j_aIUe.js";
import { o as normalizeHeartbeatToolResponse } from "./heartbeat-tool-response-lbHtsids.js";
import { _ as supportsModelTools } from "./openai-transport-stream-CKFLti3C.js";
import { t as log } from "./logger-DibNup0x.js";
import { t as projectRuntimeToolInputSchema } from "./tool-schema-json-projection-DTb7YiHb.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-ugCMMoT5.js";
import "./number-runtime-DBLVDypr.js";
import "./sandbox-zxI6PEPY.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { a as isMessagingToolSendAction, r as isMessagingTool } from "./embedded-agent-messaging-C11imqyu.js";
import { _ as sanitizeToolResult, c as extractMessagingToolSendResult, f as extractToolResultMediaArtifact, m as filterToolResultMediaUrls, s as extractMessagingToolSend, v as isToolResultError } from "./embedded-agent-message-tool-source-reply-Bv3rRzLe.js";
import { i as isReplaySafeToolCall } from "./tool-mutation-BioMabQh.js";
import { t as filterProviderNormalizableTools } from "./tool-schema-projection-Bld_BaX8.js";
import { n as normalizeAgentRuntimeTools } from "./tools-Dhwc74Cy.js";
import { t as buildEmbeddedAttemptToolRunContext } from "./attempt.tool-run-context-BsQZrex8.js";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-DsdFDvXD.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt.thread-helpers-C6oRA5x8.js";
import "./routing-DGrdyZ4S.js";
import { t as formatApprovalDisplayPath } from "./approval-display-paths-DlQSsCnq.js";
import "./agent-runtime-DqzB3bun.js";
import { c as createCodexAppServerToolResultExtensionRunner } from "./agent-harness-runtime-BE2UC9cJ.js";
import { c as resolveNativeHookRelayDeferredToolApproval, n as hasNativeHookRelayInvocation, o as registerNativeHookRelay, r as invokeNativeHookRelay } from "./native-hook-relay-CR7LECs1.js";
import { n as reviewExecRequestWithConfiguredModel, t as buildExecAutoReviewInputForShellCommand } from "./agent-harness-exec-review-runtime-ILD6ABQM.js";
import "./diagnostic-runtime-BCe2Aywp.js";
import { n as isJsonObject } from "./protocol-dh-ETiNd.js";
import { C as isForcedPrivateQaCodexRuntime, S as filterCodexDynamicTools, _ as resolveCodexWebSearchPlan, w as normalizeCodexDynamicToolName, x as sanitizeInlineImageDataUrl, y as invalidInlineImageText } from "./thread-lifecycle-Dape8CUT.js";
import { c as isTrustedCodexModelBackedOpenAIProvider, u as readCodexPluginConfig } from "./config-B52T5EfS.js";
import { a as formatCodexDisplayText } from "./app-server-policy-D-Qy38y2.js";
import { u as releaseLeasedSharedCodexAppServerClient } from "./shared-client-BpxMm0zG.js";
import { i as resolveCodexNativeExecutionPolicy } from "./sandbox-guard-Bz6I90fx.js";
import { createHash } from "node:crypto";
/** Default idle timeout while waiting for app-server turn completion. */
const CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS = 6e4;
/** Short guard after apparent assistant completion. */
const CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 1e4;
const CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Guard after reasoning/commentary progress when no tool handoff occurred. */
const CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS = 5 * 6e4;
/** Long terminal idle watch for app-server turns that never send completion. */
const CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS = 30 * 6e4;
function resolvePositiveIntegerTimeoutMs(value, fallbackMs) {
	return resolveTimerTimeoutMs(value, resolveTimerTimeoutMs(fallbackMs, 1));
}
/** Runs startup work with abort and timeout handling plus optional cleanup. */
async function withCodexStartupTimeout(params) {
	if (params.signal.aborted) throw new Error("codex app-server startup aborted");
	let timeout;
	let abortCleanup;
	let timeoutError;
	let timeoutCleanup;
	try {
		return await Promise.race([params.operation(), new Promise((_, reject) => {
			const rejectOnce = (error) => {
				if (timeout) {
					clearTimeout(timeout);
					timeout = void 0;
				}
				reject(error);
			};
			timeout = setTimeout(() => {
				timeoutError = /* @__PURE__ */ new Error("codex app-server startup timed out");
				timeoutCleanup = Promise.resolve(params.onTimeout?.()).then(() => void 0, () => void 0);
				timeoutCleanup.finally(() => {
					rejectOnce(timeoutError);
				});
			}, params.timeoutMs);
			const abortListener = () => rejectOnce(/* @__PURE__ */ new Error("codex app-server startup aborted"));
			params.signal.addEventListener("abort", abortListener, { once: true });
			abortCleanup = () => params.signal.removeEventListener("abort", abortListener);
		})]);
	} catch (error) {
		if (timeoutError) {
			await timeoutCleanup;
			throw timeoutError;
		}
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
		abortCleanup?.();
	}
}
/** Resolves startup timeout while honoring the configured floor. */
function resolveCodexStartupTimeoutMs(params) {
	const timeoutFloorMs = resolvePositiveIntegerTimeoutMs(params.timeoutFloorMs, 100);
	const timeoutMs = resolvePositiveIntegerTimeoutMs(params.timeoutMs, timeoutFloorMs);
	return Math.max(timeoutFloorMs, timeoutMs);
}
/** Resolves the completion-idle timeout for an active turn. */
function resolveCodexTurnCompletionIdleTimeoutMs(value) {
	return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the short assistant-completion release timeout. */
function resolveCodexTurnAssistantCompletionIdleTimeoutMs(value) {
	return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS);
}
/** Resolves the conservative post-tool raw assistant guard timeout. */
function resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(value, fallbackMs) {
	return resolvePositiveIntegerTimeoutMs(value, Math.max(resolvePositiveIntegerTimeoutMs(void 0, fallbackMs), CODEX_POST_TOOL_RAW_ASSISTANT_COMPLETION_IDLE_TIMEOUT_MS));
}
/** Resolves the long terminal turn idle timeout. */
function resolveCodexTurnTerminalIdleTimeoutMs(value) {
	return resolvePositiveIntegerTimeoutMs(value, CODEX_TURN_TERMINAL_IDLE_TIMEOUT_MS);
}
/** Adds gateway grace time to a caller timeout without overflowing invalid values. */
function resolveCodexGatewayTimeoutWithGraceMs(timeoutMs, graceMs = 1e4) {
	const timeout = resolvePositiveIntegerTimeoutMs(timeoutMs, 1);
	return addTimerTimeoutGraceMs(timeout, resolveTimerTimeoutMs(graceMs, 0, 0)) ?? timeout;
}
//#endregion
//#region extensions/codex/src/app-server/plugin-approval-roundtrip.ts
/**
* Routes Codex app-server plugin approval prompts through OpenClaw's gateway
* approval tool and maps gateway decisions back to Codex outcomes.
*/
const DEFAULT_CODEX_APPROVAL_TIMEOUT_MS = 12e4;
const MAX_PLUGIN_APPROVAL_TITLE_LENGTH = 80;
const MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH = 256;
/** Starts a two-phase plugin approval request through the OpenClaw gateway. */
async function requestPluginApproval(params) {
	const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
	return callGatewayTool("plugin.approval.request", { timeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs) }, {
		pluginId: "openclaw-codex-app-server",
		title: truncateForGateway(params.title, MAX_PLUGIN_APPROVAL_TITLE_LENGTH),
		description: truncateForGateway(params.description, MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH),
		severity: params.severity,
		toolName: params.toolName,
		toolCallId: params.toolCallId,
		agentId: params.paramsForRun.agentId,
		sessionKey: params.paramsForRun.sessionKey,
		turnSourceChannel: params.paramsForRun.messageChannel ?? params.paramsForRun.messageProvider,
		turnSourceTo: params.paramsForRun.currentChannelId,
		turnSourceAccountId: params.paramsForRun.agentAccountId,
		turnSourceThreadId: params.paramsForRun.currentThreadTs,
		timeoutMs,
		twoPhase: true,
		...params.allowedDecisions ? { allowedDecisions: params.allowedDecisions } : {}
	}, { expectFinal: false });
}
/** Detects the gateway's explicit null-decision marker for unavailable approvals. */
function approvalRequestExplicitlyUnavailable(result) {
	if (result === null || result === void 0 || typeof result !== "object") return false;
	let descriptor;
	try {
		descriptor = Object.getOwnPropertyDescriptor(result, "decision");
	} catch {
		return false;
	}
	return descriptor !== void 0 && "value" in descriptor && descriptor.value === null;
}
/** Waits for the gateway's final approval decision, respecting turn aborts. */
async function waitForPluginApprovalDecision(params) {
	const waitPromise = callGatewayTool("plugin.approval.waitDecision", { timeoutMs: resolveCodexGatewayTimeoutWithGraceMs(DEFAULT_CODEX_APPROVAL_TIMEOUT_MS) }, { id: params.approvalId });
	if (!params.signal) return (await waitPromise)?.decision;
	let onAbort;
	const abortPromise = new Promise((_, reject) => {
		if (params.signal.aborted) {
			reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
			return;
		}
		onAbort = () => reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
		params.signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return (await Promise.race([waitPromise, abortPromise]))?.decision;
	} finally {
		if (onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
/** Converts a gateway exec approval decision into the app-server approval outcome enum. */
function mapExecDecisionToOutcome(decision) {
	if (decision === "allow-once") return "approved-once";
	if (decision === "allow-always") return "approved-session";
	if (decision === null || decision === void 0) return "unavailable";
	return "denied";
}
function truncateForGateway(value, maxLength) {
	return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
//#region extensions/codex/src/app-server/approval-bridge.ts
/**
* Bridges Codex app-server approval requests into OpenClaw policy hooks and
* plugin approval UX.
*/
const PERMISSION_DESCRIPTION_MAX_LENGTH = 700;
const PERMISSION_SAMPLE_LIMIT = 2;
const PERMISSION_VALUE_MAX_LENGTH = 48;
const COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH = 80;
const APPROVAL_PREVIEW_SCAN_MAX_LENGTH = 4096;
const APPROVAL_PREVIEW_OMITTED = "[preview truncated or unsafe content omitted]";
const ANSI_OSC_SEQUENCE_RE$1 = new RegExp(String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`, "g");
const ANSI_CONTROL_SEQUENCE_RE$1 = new RegExp(String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`, "g");
const CONTROL_CHARACTER_RE$1 = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE$1 = new RegExp(String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`, "gu");
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE$1 = new RegExp(String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`);
/**
* Handles one app-server approval request for the active thread/turn, returning
* the app-server response payload when the request belongs to this run.
*/
async function handleCodexAppServerApprovalRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!matchesCurrentTurn(requestParams, params.threadId, params.turnId)) return;
	if (!isSupportedAppServerApprovalMethod(params.method)) return unsupportedApprovalResponse();
	const context = buildApprovalContext({
		method: params.method,
		requestParams,
		paramsForRun: params.paramsForRun
	});
	try {
		const policyOutcome = await runOpenClawToolPolicyForApprovalRequest({
			method: params.method,
			requestParams,
			paramsForRun: params.paramsForRun,
			context,
			nativeHookRelay: params.nativeHookRelay,
			signal: params.signal
		});
		if (policyOutcome?.outcome === "denied") {
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "denied",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, "denied"),
				message: policyOutcome.reason
			});
			return buildApprovalResponse(params.method, context.requestParams, "denied");
		}
		if (policyOutcome?.outcome === "approved-once" || policyOutcome?.outcome === "approved-session") {
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "approved",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, policyOutcome.outcome),
				message: approvalResolutionMessage(policyOutcome.outcome)
			});
			return buildApprovalResponse(params.method, context.requestParams, policyOutcome.outcome);
		}
		if (params.autoApprove === true) {
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "approved",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, "approved-session"),
				message: "Codex app-server approval auto-approved by runtime policy."
			});
			return buildApprovalResponse(params.method, context.requestParams, "approved-session");
		}
		const autoReviewOutcome = await runInternalExecAutoReviewForApprovalRequest({
			enabled: params.internalExecAutoReview === true && params.execPolicy?.mode === "auto",
			method: params.method,
			requestParams,
			paramsForRun: params.paramsForRun,
			context,
			agentId: params.execReviewerAgentId,
			signal: params.signal
		});
		if (autoReviewOutcome?.outcome === "approved-once") {
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "approved",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, autoReviewOutcome.outcome),
				message: autoReviewOutcome.reason
			});
			return buildApprovalResponse(params.method, context.requestParams, autoReviewOutcome.outcome);
		}
		const requestResult = await requestPluginApproval({
			paramsForRun: params.paramsForRun,
			title: context.title,
			description: context.description,
			severity: context.severity,
			toolName: context.toolName,
			toolCallId: context.itemId
		});
		const approvalId = requestResult?.id;
		if (!approvalId) {
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "unavailable",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, "denied"),
				message: "Codex app-server approval route unavailable."
			});
			return buildApprovalResponse(params.method, context.requestParams, "denied");
		}
		emitApprovalEvent(params.paramsForRun, {
			phase: "requested",
			kind: context.kind,
			status: "pending",
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			message: "Codex app-server approval requested."
		});
		const outcome = mapExecDecisionToOutcome(approvalRequestExplicitlyUnavailable(requestResult) ? null : await waitForPluginApprovalDecision({
			approvalId,
			signal: params.signal
		}));
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: outcome === "denied" ? "denied" : outcome === "unavailable" ? "unavailable" : outcome === "cancelled" ? "failed" : "approved",
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			...approvalEventScope(params.method, outcome),
			message: approvalResolutionMessage(outcome)
		});
		return buildApprovalResponse(params.method, context.requestParams, outcome);
	} catch (error) {
		const cancelled = params.signal?.aborted === true;
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: cancelled ? "failed" : "unavailable",
			title: context.title,
			...context.eventDetails,
			...approvalEventScope(params.method, cancelled ? "cancelled" : "denied"),
			message: cancelled ? "Codex app-server approval cancelled because the run stopped." : `Codex app-server approval route failed: ${formatCodexDisplayText(formatErrorMessage(error))}`
		});
		return buildApprovalResponse(params.method, context.requestParams, cancelled ? "cancelled" : "denied");
	}
}
/** Converts an OpenClaw approval outcome into the app-server method response. */
function buildApprovalResponse(method, requestParams, outcome) {
	if (method === "item/commandExecution/requestApproval") return { decision: commandApprovalDecision(requestParams, outcome) };
	if (method === "item/fileChange/requestApproval") return { decision: fileChangeApprovalDecision(outcome) };
	if (method === "item/permissions/requestApproval") {
		if (outcome === "approved-session" || outcome === "approved-once") return {
			permissions: requestedPermissions(requestParams),
			scope: outcome === "approved-session" ? "session" : "turn"
		};
		return {
			permissions: {},
			scope: "turn"
		};
	}
	return unsupportedApprovalResponse();
}
function matchesCurrentTurn(requestParams, threadId, turnId) {
	if (!requestParams) return false;
	const requestThreadId = readString$1(requestParams, "threadId") ?? readString$1(requestParams, "conversationId");
	const requestTurnId = readString$1(requestParams, "turnId");
	return requestThreadId === threadId && requestTurnId === turnId;
}
function buildApprovalContext(params) {
	const itemId = readString$1(params.requestParams, "itemId") ?? readString$1(params.requestParams, "callId") ?? readString$1(params.requestParams, "approvalId");
	const commandDetailLines = params.method === "item/commandExecution/requestApproval" ? describeCommandApprovalDetails(params.requestParams) : [];
	const commandPreview = sanitizeApprovalPreview(readDisplayCommandPreview(params.requestParams), commandDetailLines.length > 0 ? COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH : 180);
	const reasonPreview = sanitizeApprovalPreview(readStringPreview(params.requestParams, "reason"), 180);
	const command = commandPreview.text;
	const reason = reasonPreview.text;
	const kind = approvalKindForMethod(params.method);
	const permissionLines = params.method === "item/permissions/requestApproval" ? describeRequestedPermissions(params.requestParams) : [];
	const title = kind === "exec" ? "Codex app-server command approval" : params.method === "item/permissions/requestApproval" ? "Codex app-server permission approval" : kind === "plugin" ? "Codex app-server file approval" : "Codex app-server approval";
	const subject = permissionLines[0] ?? (command ? `Command: ${formatApprovalPreviewSubject(command, commandPreview.omitted)}` : commandPreview.omitted ? `Command: ${APPROVAL_PREVIEW_OMITTED}` : reason ? `Reason: ${formatApprovalPreviewSubject(reason, reasonPreview.omitted)}` : reasonPreview.omitted ? `Reason: ${APPROVAL_PREVIEW_OMITTED}` : `Request method: ${params.method}`);
	return {
		kind,
		title,
		description: permissionLines.length > 0 ? joinDescriptionLinesWithinLimit(permissionLines, PERMISSION_DESCRIPTION_MAX_LENGTH) : [
			subject,
			...commandDetailLines,
			params.paramsForRun.sessionKey && `Session: ${params.paramsForRun.sessionKey}`
		].filter(Boolean).join("\n"),
		severity: kind === "exec" ? "warning" : "info",
		toolName: kind === "exec" ? "codex_command_approval" : params.method === "item/permissions/requestApproval" ? "codex_permission_approval" : "codex_file_approval",
		itemId,
		requestParams: params.requestParams,
		eventDetails: {
			...itemId ? { itemId } : {},
			...command ? { command } : {},
			...commandPreview.omitted ? { commandPreviewOmitted: true } : {},
			...reason ? { reason } : {},
			...reasonPreview.omitted ? { reasonPreviewOmitted: true } : {}
		}
	};
}
async function runInternalExecAutoReviewForApprovalRequest(params) {
	if (!params.enabled || params.method !== "item/commandExecution/requestApproval") return;
	if (hasCommandApprovalCapabilityAmendments(params.requestParams)) return;
	const input = await buildAppServerExecAutoReviewInput({
		requestParams: params.requestParams,
		paramsForRun: params.paramsForRun
	});
	if (!input) return;
	const reviewerConfig = resolveExecReviewerConfig(params.paramsForRun, params.agentId);
	if (!canUseInternalExecAutoReviewReviewer(reviewerConfig, params.paramsForRun.config, process.env, params.paramsForRun.agentDir)) return;
	const decision = await waitForInternalExecAutoReviewDecision({
		signal: params.signal,
		promise: reviewExecRequestWithConfiguredModel({
			cfg: params.paramsForRun.config,
			agentId: params.agentId ?? params.paramsForRun.agentId,
			reviewer: reviewerConfig,
			input
		})
	});
	if (decision.decision !== "allow-once") return;
	return {
		outcome: "approved-once",
		reason: `Codex app-server command approval granted by OpenClaw exec auto-reviewer: ${formatCodexDisplayText(decision.rationale)}`
	};
}
async function waitForInternalExecAutoReviewDecision(params) {
	if (!params.signal) return params.promise;
	if (params.signal.aborted) throw toCodexAppServerApprovalCancellationError(params.signal.reason);
	let onAbort;
	const abortPromise = new Promise((_, reject) => {
		onAbort = () => reject(toCodexAppServerApprovalCancellationError(params.signal?.reason));
		params.signal?.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return await Promise.race([params.promise, abortPromise]);
	} finally {
		if (onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
function toCodexAppServerApprovalCancellationError(reason) {
	if (reason instanceof Error) return reason;
	return new Error(typeof reason === "string" && reason.trim() ? reason : "Codex app-server approval cancelled.");
}
async function buildAppServerExecAutoReviewInput(params) {
	const command = readString$1(params.requestParams, "command");
	if (!command) return;
	return buildExecAutoReviewInputForShellCommand({
		command,
		cwd: readString$1(params.requestParams, "cwd") ?? params.paramsForRun.workspaceDir ?? null,
		host: "codex-app-server",
		agent: {
			id: params.paramsForRun.agentId ?? null,
			sessionKey: params.paramsForRun.sessionKey ?? null
		}
	});
}
function hasCommandApprovalCapabilityAmendments(requestParams) {
	return hasNonEmptyJsonObject(requestParams?.additionalPermissions) || hasNonEmptyJsonObject(requestParams?.networkApprovalContext) || hasNonEmptyJsonObject(requestParams?.proposedExecpolicyAmendment) || hasNonEmptyArray(requestParams?.proposedExecpolicyAmendment) || hasNonEmptyArray(requestParams?.proposedNetworkPolicyAmendments) || findAvailableCommandAmendmentDecision(requestParams) !== void 0 || commandAcceptDecisionUnavailable(requestParams);
}
function commandAcceptDecisionUnavailable(requestParams) {
	const available = requestParams?.availableDecisions;
	return Array.isArray(available) && !available.includes("accept");
}
function hasNonEmptyJsonObject(value) {
	return isJsonObject(value) && Object.keys(value).length > 0;
}
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function resolveExecReviewerConfig(params, agentId) {
	const configRoot = readUnknownRecord(params.config);
	const globalExec = readUnknownRecord(readUnknownRecord(configRoot?.tools)?.exec);
	return readUnknownRecord(resolveAgentExecConfig(configRoot, agentId ?? params.agentId)?.reviewer) ?? readUnknownRecord(globalExec?.reviewer);
}
function canUseInternalExecAutoReviewReviewer(reviewerConfig, config, env, agentDir) {
	const model = readExecReviewerModelRef(reviewerConfig);
	const slashIndex = model?.indexOf("/") ?? -1;
	if (!model || slashIndex <= 0) return false;
	if (configuredAgentModelAliasMatches(config, model)) return false;
	if (model.slice(0, slashIndex).trim().toLowerCase() !== "openai") return false;
	return isTrustedCodexModelBackedOpenAIProvider({
		config,
		env,
		agentDir,
		model: model.slice(slashIndex + 1).trim()
	});
}
function readExecReviewerModelRef(reviewerConfig) {
	const model = reviewerConfig?.model;
	if (typeof model === "string") return model.trim() || void 0;
	const primary = readUnknownRecord(model)?.primary;
	return typeof primary === "string" && primary.trim() ? primary.trim() : void 0;
}
function configuredAgentModelAliasMatches(config, modelRef) {
	const normalizedModelRef = normalizeExecReviewerAliasRef(modelRef);
	return agentModelAliasMatches(readUnknownRecord(readUnknownRecord(readUnknownRecord(config)?.agents)?.defaults), normalizedModelRef);
}
function agentModelAliasMatches(agentConfig, normalizedModelRef) {
	const models = readUnknownRecord(agentConfig?.models);
	if (!models) return false;
	for (const entry of Object.values(models)) {
		const alias = readUnknownRecord(entry)?.alias;
		if (typeof alias === "string" && normalizeExecReviewerAliasRef(alias) === normalizedModelRef) return true;
	}
	return false;
}
function normalizeExecReviewerAliasRef(modelRef) {
	const trimmed = modelRef.trim().toLowerCase();
	const slashIndex = trimmed.indexOf("/");
	const authProfileIndex = trimmed.indexOf("@", slashIndex + 1);
	return authProfileIndex > 0 ? trimmed.slice(0, authProfileIndex) : trimmed;
}
function resolveAgentExecConfig(configRoot, agentId) {
	const normalizedAgentId = agentId ? normalizeAgentId(agentId) : void 0;
	if (!normalizedAgentId) return;
	const agentList = readUnknownRecord(configRoot?.agents)?.list;
	if (!Array.isArray(agentList)) return;
	for (const entry of agentList) {
		const record = readUnknownRecord(entry);
		if (typeof record?.id !== "string" || normalizeAgentId(record.id) !== normalizedAgentId) continue;
		return readUnknownRecord(readUnknownRecord(record.tools)?.exec);
	}
}
function readUnknownRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
async function runOpenClawToolPolicyForApprovalRequest(params) {
	const policyRequest = buildOpenClawToolPolicyRequest(params.method, params.requestParams);
	if (!policyRequest) return;
	const cwd = readString$1(params.requestParams, "cwd") ?? params.paramsForRun.workspaceDir;
	const nativeRelayOutcome = await runNativeRelayToolPolicyForApprovalRequest({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		policyRequest,
		nativeHookRelay: params.nativeHookRelay,
		cwd,
		signal: params.signal
	});
	if (nativeRelayOutcome?.blocked) return {
		outcome: "denied",
		reason: nativeRelayOutcome.reason
	};
	if (nativeRelayOutcome?.outcome === "approved-once" || nativeRelayOutcome?.outcome === "approved-session") return { outcome: nativeRelayOutcome.outcome };
	if (nativeRelayOutcome?.handled) return { outcome: "no-decision" };
	const hookChannelId = buildAgentHookContextChannelFields({
		sessionKey: params.paramsForRun.sessionKey,
		messageChannel: params.paramsForRun.messageChannel,
		messageProvider: params.paramsForRun.messageProvider,
		currentChannelId: params.paramsForRun.currentChannelId,
		messageTo: params.paramsForRun.messageTo
	}).channelId;
	const outcome = await runBeforeToolCallHook({
		toolName: policyRequest.toolName,
		params: policyRequest.params,
		...params.context.itemId ? { toolCallId: params.context.itemId } : {},
		approvalMode: "request",
		signal: params.signal,
		ctx: {
			...params.paramsForRun.agentId ? { agentId: params.paramsForRun.agentId } : {},
			...params.paramsForRun.config ? { config: params.paramsForRun.config } : {},
			...cwd ? { cwd } : {},
			...params.paramsForRun.sessionKey ? { sessionKey: params.paramsForRun.sessionKey } : {},
			...params.paramsForRun.sessionId ? { sessionId: params.paramsForRun.sessionId } : {},
			...params.paramsForRun.runId ? { runId: params.paramsForRun.runId } : {},
			...hookChannelId ? { channelId: hookChannelId } : {}
		}
	});
	if (outcome.blocked) return {
		outcome: "denied",
		reason: outcome.reason
	};
	if ("params" in outcome && toolPolicyParamsWereRewritten(policyRequest.params, outcome.params)) return {
		outcome: "denied",
		reason: "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request."
	};
	if (outcome.approvalResolution) return { outcome: "approved-once" };
}
async function runNativeRelayToolPolicyForApprovalRequest(params) {
	if (params.method !== "item/commandExecution/requestApproval" || !params.nativeHookRelay?.allowedEvents.includes("pre_tool_use")) return;
	const payload = buildNativeRelayPreToolUsePayload({
		requestParams: params.requestParams,
		policyRequest: params.policyRequest,
		context: params.context,
		cwd: params.cwd
	});
	if (!payload) return;
	if (hasNativeHookRelayInvocation({
		relayId: params.nativeHookRelay.relayId,
		event: "pre_tool_use",
		toolUseId: params.context.itemId
	})) {
		const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
			relayId: params.nativeHookRelay.relayId,
			toolUseId: params.context.itemId,
			signal: params.signal
		});
		if (approvalOutcome?.outcome === "denied") return {
			handled: true,
			blocked: true,
			reason: approvalOutcome.reason
		};
		if (approvalOutcome?.outcome === "approved-once") return {
			handled: true,
			outcome: approvalOutcome.outcome
		};
		return { handled: true };
	}
	try {
		const decision = readNativeRelayPreToolUseDecision(await invokeNativeHookRelay({
			provider: "codex",
			relayId: params.nativeHookRelay.relayId,
			generation: params.nativeHookRelay.generation,
			event: "pre_tool_use",
			rawPayload: payload,
			requireGeneration: true
		}));
		if (decision.blocked) return {
			handled: true,
			blocked: true,
			reason: decision.reason
		};
		const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
			relayId: params.nativeHookRelay.relayId,
			toolUseId: params.context.itemId,
			signal: params.signal
		});
		if (approvalOutcome?.outcome === "denied") return {
			handled: true,
			blocked: true,
			reason: approvalOutcome.reason
		};
		if (approvalOutcome?.outcome === "approved-once") return {
			handled: true,
			outcome: approvalOutcome.outcome
		};
		return { handled: true };
	} catch (error) {
		return {
			handled: true,
			blocked: true,
			reason: `OpenClaw native hook relay unavailable for Codex app-server approval: ${formatCodexDisplayText(formatErrorMessage(error))}`
		};
	}
}
function buildNativeRelayPreToolUsePayload(params) {
	const command = readString$1(params.policyRequest.params, "command");
	if (!command) return;
	const turnId = readString$1(params.requestParams, "turnId");
	return {
		hook_event_name: "PreToolUse",
		openclaw_approval_mode: "report",
		tool_name: "exec_command",
		...params.context.itemId ? { tool_use_id: params.context.itemId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...turnId ? { turn_id: turnId } : {},
		tool_input: {
			...params.policyRequest.params,
			command,
			cmd: command
		}
	};
}
function readNativeRelayPreToolUseDecision(response) {
	if (!response || response.exitCode !== 0) return {
		blocked: true,
		reason: sanitizeRelayDecisionReason(response?.stderr) || sanitizeRelayDecisionReason(response?.stdout) || "OpenClaw native hook relay failed for Codex app-server approval."
	};
	const stdout = response.stdout?.trim();
	if (!stdout) return { blocked: false };
	const parsed = parseRelayJsonResponse(stdout);
	const output = isJsonObject(parsed?.hookSpecificOutput) ? parsed.hookSpecificOutput : void 0;
	if (output?.permissionDecision === "deny") return {
		blocked: true,
		reason: readString$1(output, "permissionDecisionReason") || "OpenClaw native hook policy denied Codex app-server approval."
	};
	return {
		blocked: true,
		reason: output ? "OpenClaw native hook relay returned a non-deny Codex app-server approval decision." : "OpenClaw native hook relay returned an unreadable Codex app-server approval result."
	};
}
function parseRelayJsonResponse(text) {
	try {
		const parsed = JSON.parse(text);
		return isJsonObject(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function sanitizeRelayDecisionReason(value) {
	return sanitizeApprovalPreview(value ? {
		value,
		clipped: false
	} : void 0, 240).text;
}
function buildOpenClawToolPolicyRequest(method, requestParams) {
	if (method === "item/commandExecution/requestApproval") {
		const command = readPolicyCommand(requestParams);
		return {
			toolName: "exec",
			params: {
				...command ? { command } : {},
				...readString$1(requestParams, "cwd") ? { cwd: readString$1(requestParams, "cwd") } : {},
				approval: requestParams ?? {}
			}
		};
	}
	if (method === "item/fileChange/requestApproval") return {
		toolName: "apply_patch",
		params: requestParams ?? {}
	};
	if (method === "item/permissions/requestApproval") return {
		toolName: "codex_permission_approval",
		params: requestParams ?? {}
	};
}
function toolPolicyParamsWereRewritten(original, candidate) {
	if (candidate === original) return false;
	const originalText = stableJsonText(original);
	const candidateText = stableJsonText(candidate);
	return !candidateText || candidateText !== originalText;
}
function stableJsonText(value) {
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return JSON.stringify(value);
	if (Array.isArray(value)) {
		const items = value.map((item) => stableJsonText(item));
		return items.every((item) => item !== void 0) ? `[${items.join(",")}]` : void 0;
	}
	if (isPlainRecord(value)) {
		const entries = Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => {
			const text = stableJsonText(item);
			return text === void 0 ? void 0 : `${JSON.stringify(key)}:${text}`;
		});
		return entries.every((entry) => entry !== void 0) ? `{${entries.join(",")}}` : void 0;
	}
}
function isPlainRecord(value) {
	return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function commandApprovalDecision(requestParams, outcome) {
	if (outcome === "cancelled") return commandRejectionDecision(requestParams, "cancel");
	if (outcome === "denied" || outcome === "unavailable") return commandRejectionDecision(requestParams, "decline");
	if (outcome === "approved-session") {
		if (hasAvailableDecision(requestParams, "acceptForSession")) return "acceptForSession";
		const amendmentDecision = findAvailableCommandAmendmentDecision(requestParams);
		if (amendmentDecision) return amendmentDecision;
	}
	return hasAvailableDecision(requestParams, "accept") ? "accept" : commandRejectionDecision(requestParams, "decline");
}
function fileChangeApprovalDecision(outcome) {
	if (outcome === "cancelled") return "cancel";
	if (outcome === "denied" || outcome === "unavailable") return "decline";
	return outcome === "approved-session" ? "acceptForSession" : "accept";
}
function requestedPermissions(requestParams) {
	const permissions = isJsonObject(requestParams?.permissions) ? requestParams.permissions : {};
	const granted = {};
	if (isJsonObject(permissions.network)) granted.network = permissions.network;
	if (isJsonObject(permissions.fileSystem)) granted.fileSystem = permissions.fileSystem;
	return granted;
}
function unsupportedApprovalResponse() {
	return {
		decision: "decline",
		reason: "OpenClaw codex app-server bridge does not grant native approvals yet."
	};
}
function describeRequestedPermissions(requestParams) {
	return describePermissionProfile(requestedPermissions(requestParams), "Permissions");
}
function describeCommandApprovalDetails(requestParams) {
	const lines = [];
	const additionalPermissions = isJsonObject(requestParams?.additionalPermissions) ? requestParams.additionalPermissions : void 0;
	if (additionalPermissions) lines.push(...describePermissionProfile(additionalPermissions, "Additional permissions"));
	const execpolicySummary = summarizeStringArray(requestParams?.proposedExecpolicyAmendment, "Proposed exec policy", sanitizePermissionScalar);
	if (execpolicySummary) lines.push(execpolicySummary);
	const networkAmendmentSummary = summarizeNetworkPolicyAmendments(requestParams?.proposedNetworkPolicyAmendments);
	if (networkAmendmentSummary) lines.push(networkAmendmentSummary);
	return lines;
}
function describePermissionProfile(permissions, label) {
	const lines = [];
	const kinds = [];
	const risks = /* @__PURE__ */ new Set();
	if (isJsonObject(permissions.network)) kinds.push("network");
	if (isJsonObject(permissions.fileSystem)) kinds.push("fileSystem");
	if (kinds.length > 0) lines.push(`${label}: ${kinds.join(", ")}`);
	let networkSummary;
	if (isJsonObject(permissions.network)) {
		const summaries = [summarizeNetworkEnabledPermission(permissions.network, risks), summarizePermissionRecord(permissions.network, risks, [{
			key: "allowHosts",
			label: "allowHosts",
			sanitize: sanitizePermissionHostValue,
			risksFor: permissionHostRisks
		}])].filter((summary) => Boolean(summary));
		networkSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	let fileSystemSummary;
	if (isJsonObject(permissions.fileSystem)) {
		const summaries = [summarizePermissionRecord(permissions.fileSystem, risks, [
			{
				key: "read",
				label: "read",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "write",
				label: "write",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "roots",
				label: "roots",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "readPaths",
				label: "readPaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "writePaths",
				label: "writePaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			}
		]), summarizeFileSystemEntries(permissions.fileSystem, risks)].filter((summary) => Boolean(summary));
		fileSystemSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	if (risks.size > 0) lines.push(`High-risk targets: ${[...risks].join(", ")}`);
	if (networkSummary) lines.push(`Network ${networkSummary}`);
	if (fileSystemSummary) lines.push(`File system ${fileSystemSummary}`);
	return lines;
}
function summarizeNetworkEnabledPermission(permission, risks) {
	const enabled = permission.enabled;
	if (typeof enabled !== "boolean") return;
	if (enabled) risks.add("network access");
	return `enabled: ${enabled}`;
}
function summarizeFileSystemEntries(permission, risks) {
	const entries = permission.entries;
	if (!Array.isArray(entries)) return;
	const samples = [];
	let count = 0;
	for (const entry of entries) {
		const item = isJsonObject(entry) ? entry : void 0;
		const path = typeof item?.path === "string" ? item.path.trim() : "";
		const access = typeof item?.access === "string" ? item.access.trim() : "";
		if (!path || !access) continue;
		count += 1;
		if (access !== "none") for (const risk of permissionPathRisks(path)) risks.add(risk);
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(access)} ${sanitizePermissionPathValue(path)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `entries: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizePermissionRecord(permission, risks, descriptors) {
	const details = [];
	for (const descriptor of descriptors) {
		const summary = summarizePermissionArray(permission, descriptor, risks);
		if (summary) details.push(summary);
	}
	return details.length > 0 ? details.join("; ") : void 0;
}
function summarizePermissionArray(record, descriptor, risks) {
	const values = readStringArray(record, descriptor.key);
	if (values.length === 0) return;
	for (const value of values) for (const risk of descriptor.risksFor(value)) risks.add(risk);
	const sampleValues = values.slice(0, PERMISSION_SAMPLE_LIMIT).map(descriptor.sanitize).filter(Boolean);
	if (sampleValues.length === 0) return `${descriptor.label}: ${values.length}`;
	const remaining = values.length - sampleValues.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${descriptor.label}: ${sampleValues.join(", ")}${remainderSuffix}`;
}
function summarizeStringArray(value, label, sanitize) {
	if (!Array.isArray(value)) return;
	const values = value.filter((entry) => typeof entry === "string").map((entry) => sanitize(entry)).filter(Boolean);
	if (values.length === 0) return;
	const samples = values.slice(0, PERMISSION_SAMPLE_LIMIT);
	const remaining = values.length - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${label}: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizeNetworkPolicyAmendments(value) {
	if (!Array.isArray(value)) return;
	const samples = [];
	let count = 0;
	for (const entry of value) {
		const amendment = isJsonObject(entry) ? entry : void 0;
		const host = typeof amendment?.host === "string" ? amendment.host : "";
		const action = typeof amendment?.action === "string" ? amendment.action : "";
		if (!host || !action) continue;
		count += 1;
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(action)} ${sanitizePermissionHostValue(host)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `Proposed network policy: ${samples.join(", ")}${remainderSuffix}`;
}
function readStringArray(record, key) {
	return normalizeTrimmedStringList(record[key]);
}
function sanitizePermissionHostValue(value) {
	const withoutScheme = sanitizePermissionScalar(value).toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
	const authority = withoutScheme.split(/[/?#]/, 1)[0] ?? withoutScheme;
	return truncate(authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority, PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionPathValue(value) {
	return truncate(formatApprovalDisplayPath(sanitizePermissionScalar(value)), PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionScalar(value) {
	return sanitizeVisibleScalar(value);
}
function permissionHostRisks(value) {
	const normalized = value.trim().toLowerCase();
	const risks = [];
	if (normalized.includes("*")) {
		risks.push("wildcard hosts");
		if (isPrivateNetworkHostPattern(normalized)) risks.push("private-network wildcards");
	}
	return risks;
}
function permissionPathRisks(value) {
	const normalized = sanitizePermissionScalar(value);
	const risks = [];
	if (normalized === "/" || normalized === "\\" || /^[A-Za-z]:[\\/]*$/.test(normalized)) risks.push("filesystem root");
	return risks;
}
function isPrivateNetworkHostPattern(value) {
	const wildcardStripped = value.toLowerCase().replace(/^\*\./, "");
	if (wildcardStripped === "localhost" || wildcardStripped === "local" || wildcardStripped === "internal" || wildcardStripped === "lan" || wildcardStripped === "home" || wildcardStripped === "corp" || wildcardStripped === "private" || wildcardStripped.endsWith(".local") || wildcardStripped.endsWith(".internal") || wildcardStripped.endsWith(".lan") || wildcardStripped.endsWith(".home") || wildcardStripped.endsWith(".corp") || wildcardStripped.endsWith(".private")) return true;
	if (wildcardStripped.startsWith("10.") || wildcardStripped.startsWith("127.") || wildcardStripped.startsWith("192.168.") || wildcardStripped.startsWith("169.254.")) return true;
	return /^172\.(1[6-9]|2\d|3[0-1])\./.test(wildcardStripped);
}
function hasAvailableDecision(requestParams, decision) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return true;
	return available.includes(decision);
}
function findAvailableCommandAmendmentDecision(requestParams) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return;
	return available.find((entry) => isJsonObject(entry) && (isJsonObject(entry.acceptWithExecpolicyAmendment) || isJsonObject(entry.applyNetworkPolicyAmendment)));
}
function commandRejectionDecision(requestParams, preferred) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return preferred;
	if (available.includes(preferred)) return preferred;
	const alternate = preferred === "decline" ? "cancel" : "decline";
	if (available.includes(alternate)) return alternate;
	return preferred;
}
function approvalResolutionMessage(outcome) {
	if (outcome === "approved-session") return "Codex app-server approval granted for the session.";
	if (outcome === "approved-once") return "Codex app-server approval granted for this turn.";
	if (outcome === "cancelled") return "Codex app-server approval cancelled.";
	if (outcome === "unavailable") return "Codex app-server approval unavailable.";
	return "Codex app-server approval denied.";
}
function approvalScopeForOutcome(outcome) {
	return outcome === "approved-session" ? "session" : "turn";
}
function approvalEventScope(method, outcome) {
	return method === "item/permissions/requestApproval" ? { scope: approvalScopeForOutcome(outcome) } : {};
}
function approvalKindForMethod(method) {
	if (method.includes("commandExecution") || method.includes("execCommand")) return "exec";
	if (method.includes("fileChange") || method.includes("Patch") || method.includes("permissions")) return "plugin";
	return "unknown";
}
function isSupportedAppServerApprovalMethod(method) {
	return method === "item/commandExecution/requestApproval" || method === "item/fileChange/requestApproval" || method === "item/permissions/requestApproval";
}
function emitApprovalEvent(params, data) {
	params.onAgentEvent?.({
		stream: "approval",
		data
	});
}
function readDisplayCommandPreview(record) {
	const actionCommand = readCommandActionsPreview(record);
	if (actionCommand) return actionCommand;
	return readCommandPreview(record);
}
function readPolicyCommand(record) {
	const command = record?.command;
	if (typeof command === "string") return command;
	if (Array.isArray(command) && command.every((part) => typeof part === "string")) return command.join(" ");
	const actionCommands = readCommandActions(record);
	if (actionCommands.length > 0) return actionCommands.join(" && ");
}
function readCommandActions(record) {
	const actions = record?.commandActions;
	if (!Array.isArray(actions)) return [];
	return actions.map((action) => isJsonObject(action) ? readString$1(action, "command") : void 0).filter((command) => Boolean(command));
}
function readCommandActionsPreview(record) {
	let source;
	for (const command of readCommandActions(record)) {
		source = appendPreviewPart(source, command, " && ");
		if (source.clipped) break;
	}
	return source;
}
function readCommandPreview(record) {
	const command = record?.command;
	if (typeof command === "string") return previewSource(command);
	if (!Array.isArray(command)) return;
	let source;
	for (const part of command) {
		if (typeof part !== "string") return;
		source = appendPreviewPart(source, part, " ");
		if (source.clipped) break;
	}
	return source;
}
function readStringPreview(record, key) {
	const value = readString$1(record, key);
	return value === void 0 ? void 0 : previewSource(value);
}
function readString$1(record, key) {
	const value = record?.[key];
	return typeof value === "string" ? value : void 0;
}
function truncate(value, maxLength) {
	return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
function previewSource(value) {
	return {
		value: value.slice(0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped: value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH
	};
}
function appendPreviewPart(source, part, separator) {
	const value = `${source?.value ? `${source.value}${separator}` : ""}${part}`;
	const clipped = source?.clipped === true || value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH;
	return {
		value: value.slice(0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped
	};
}
function sanitizeApprovalPreview(source, maxLength) {
	if (!source || !source.value) return { omitted: false };
	const sanitized = sanitizeVisibleScalar(source.value.replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE$1, ""));
	if (!sanitized) return { omitted: true };
	return {
		text: formatCodexDisplayText(truncate(sanitized, maxLength)),
		omitted: source.clipped
	};
}
function sanitizeVisibleScalar(value) {
	return value.replace(ANSI_OSC_SEQUENCE_RE$1, "").replace(ANSI_CONTROL_SEQUENCE_RE$1, "").replace(INVISIBLE_FORMATTING_CONTROL_RE$1, " ").replace(CONTROL_CHARACTER_RE$1, " ").replace(/\s+/g, " ").trim();
}
function formatApprovalPreviewSubject(text, omitted) {
	return omitted ? `${text} ${APPROVAL_PREVIEW_OMITTED}` : text;
}
function joinDescriptionLinesWithinLimit(lines, maxLength) {
	let description = "";
	for (const line of lines) {
		const prefix = description ? "\n" : "";
		const next = `${description}${prefix}${line}`;
		if (next.length <= maxLength) {
			description = next;
			continue;
		}
		const remaining = maxLength - description.length - prefix.length;
		if (remaining < 3) break;
		description += `${prefix}${truncate(line, remaining)}`;
		break;
	}
	return description;
}
function formatErrorMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
//#endregion
//#region extensions/codex/src/app-server/vision-tools.ts
/**
* Filters Codex dynamic tools for turns that already contain image inputs so
* models with native vision do not get redundant image-inspection tools.
*/
/** Removes the image tool when the model can directly consume inbound images. */
function filterToolsForVisionInputs(tools, params) {
	if (!params.modelHasVision || !params.hasInboundImages) return tools;
	return tools.filter((tool) => tool.name !== "image");
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build.ts
/**
* Builds the Codex app-server dynamic tool list for one turn, including
* OpenClaw-owned tools, Codex native-tool fallback rules, sandbox shell shims,
* and provider allowlist normalization.
*/
const CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch"
];
const CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW = new Set(["read", "write"]);
const CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME = "node_exec";
const CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME = "node_process";
const CODEX_NODE_EXEC_HIDDEN_PARAMETER_NAMES = new Set([
	"host",
	"security",
	"ask",
	"node"
]);
/** Splits sandbox and run session keys so tool calls can bind to both scopes when needed. */
function resolveOpenClawCodingToolsSessionKeys(params, sandboxSessionKey) {
	return {
		sessionKey: sandboxSessionKey,
		runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0
	};
}
/** Returns the canonical channel used for Codex message routing and receipts. */
function resolveCodexMessageToolProvider(params) {
	return params.messageChannel ?? params.messageProvider;
}
/** Resolves the channel id that hook events should target for this Codex app-server turn. */
function resolveCodexAppServerHookChannelId(params, sandboxSessionKey) {
	return buildAgentHookContextChannelFields({
		sessionKey: sandboxSessionKey,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId,
		messageTo: params.messageTo
	}).channelId;
}
const CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS = 1e3;
const CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS = 500;
/** Creates cheap optional timing instrumentation for the dynamic-tool hot path. */
function createCodexDynamicToolBuildStageTracker(options = {}) {
	if (!options.enabled) return {
		mark() {},
		snapshot() {
			return {
				totalMs: 0,
				stages: []
			};
		}
	};
	const startedAt = Date.now();
	let previousAt = startedAt;
	const stages = [];
	const toMs = (value) => Math.max(0, Math.round(value));
	return {
		mark(name) {
			const currentAt = Date.now();
			stages.push({
				name,
				durationMs: toMs(currentAt - previousAt),
				elapsedMs: toMs(currentAt - startedAt)
			});
			previousAt = currentAt;
		},
		snapshot() {
			return {
				totalMs: toMs(Date.now() - startedAt),
				stages: stages.slice()
			};
		}
	};
}
/** Returns true when dynamic-tool construction is slow enough to warrant a warning log. */
function shouldWarnCodexDynamicToolBuildStageSummary(summary) {
	return summary.totalMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS || summary.stages.some((stage) => stage.durationMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS);
}
/** Formats per-stage timings into the compact form used by Codex app-server logs. */
function formatCodexDynamicToolBuildStageSummary(summary) {
	return summary.stages.length > 0 ? summary.stages.map((stage) => `${stage.name}:${stage.durationMs}ms@${stage.elapsedMs}ms`).join(",") : "none";
}
/** Builds, filters, and normalizes Codex-compatible runtime tools for a single turn. */
async function buildDynamicTools(input) {
	const { params } = input;
	const messagePolicyParams = input.ignoreDisableMessageTool ? {
		...params,
		disableMessageTool: false
	} : params;
	if (params.disableTools) {
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	if (!supportsModelTools(params.model)) {
		input.onPersistentWebSearchPolicyResolved?.(false);
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	const toolBuildStages = createCodexDynamicToolBuildStageTracker({ enabled: input.profilerEnabled });
	const modelHasVision = params.model.input?.includes("image") ?? false;
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, input.sessionAgentId);
	const agentHarness = await import("./plugin-sdk/agent-harness.js");
	const createOpenClawCodingTools = agentHarness.createOpenClawCodingTools;
	toolBuildStages.mark("load-agent-harness-tools");
	const sessionKeys = resolveOpenClawCodingToolsSessionKeys(params, input.sandboxSessionKey);
	const nativeExecutionPolicy = resolveCodexNativeExecutionPolicyForDynamicTools(input);
	const allTools = createOpenClawCodingTools({
		agentId: input.sessionAgentId,
		...buildEmbeddedAttemptToolRunContext(params),
		exec: {
			...params.execOverrides,
			...resolveNodeExecToolOverrides(nativeExecutionPolicy),
			config: params.config,
			elevated: params.bashElevated
		},
		sandbox: input.sandbox,
		messageProvider: resolveCodexMessageToolProvider(params),
		toolPolicyMessageProvider: params.messageProvider ?? params.messageChannel,
		agentAccountId: params.agentAccountId,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding || isForcedPrivateQaCodexRuntime(),
		...sessionKeys,
		sessionId: params.sessionId,
		runId: params.runId,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		agentDir,
		cwd: input.effectiveCwd ?? input.effectiveWorkspace,
		workspaceDir: input.effectiveWorkspace,
		spawnWorkspaceDir: input.effectiveCwd && input.effectiveCwd !== input.effectiveWorkspace ? input.resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox: input.sandbox,
			resolvedWorkspace: input.resolvedWorkspace
		}),
		config: params.config,
		authProfileStore: params.toolAuthProfileStore ?? params.authProfileStore,
		abortSignal: input.runAbortController.signal,
		emitBeforeToolCallDiagnostics: false,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		modelCompat: params.model.compat && typeof params.model.compat === "object" ? params.model.compat : void 0,
		modelApi: params.model.api,
		modelContextWindowTokens: params.model.contextWindow,
		modelAuthMode: resolveModelAuthMode(params.model.provider, params.config, params.toolAuthProfileStore ?? params.authProfileStore, { workspaceDir: input.effectiveWorkspace }),
		suppressManagedWebSearch: false,
		currentChannelId: params.currentChannelId,
		currentMessagingTarget: params.currentMessagingTarget,
		hookChannelId: resolveCodexAppServerHookChannelId(params, input.sandboxSessionKey),
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		replyToMode: params.replyToMode,
		hasRepliedRef: params.hasRepliedRef,
		modelHasVision,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		disableMessageTool: input.ignoreDisableMessageTool ? false : params.disableMessageTool,
		forceMessageTool: shouldForceMessageTool(messagePolicyParams),
		enableHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		forceHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		onYield: (message) => {
			input.onYieldDetected();
			input.onCodexAppServerEvent?.({
				stream: "codex_app_server.tool",
				data: {
					name: "sessions_yield",
					message
				}
			});
		},
		recordToolPrepStage: (name) => {
			toolBuildStages.mark(name);
		},
		onToolOutcome: params.onToolOutcome,
		allocateToolOutcomeOrdinal: params.allocateToolOutcomeOrdinal
	});
	toolBuildStages.mark("create-openclaw-coding-tools");
	const preNormalizationDiagnostics = [];
	const readableAllToolProjection = filterProviderNormalizableTools(allTools);
	preNormalizationDiagnostics.push(...readableAllToolProjection.diagnostics);
	const webSearchPlan = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport
	});
	const readableAllTools = [...readableAllToolProjection.tools];
	const codexFilteredTools = addNodeShellDynamicToolsIfNeeded(addSandboxShellDynamicToolsIfAvailable(isCodexMemoryFlushRun(params) ? filterCodexMemoryFlushDynamicTools(readableAllTools) : filterCodexDynamicTools(readableAllTools, input.pluginConfig), readableAllTools, input), readableAllTools, input, nativeExecutionPolicy);
	toolBuildStages.mark("codex-filtering");
	const visionFilteredTools = filterToolsForVisionInputs(codexFilteredTools, {
		modelHasVision,
		hasInboundImages: (params.images?.length ?? 0) > 0
	});
	toolBuildStages.mark("vision-filtering");
	const webSearchPresent = visionFilteredTools.some((tool) => tool.name === "web_search");
	const webSearchPolicy = agentHarness.resolveWebSearchToolPolicy({
		config: params.config,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		agentId: input.sessionAgentId,
		sessionKey: input.sandboxSessionKey,
		sandboxToolPolicy: input.sandbox?.tools,
		messageProvider: resolveCodexMessageToolProvider(params),
		agentAccountId: params.agentAccountId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164
	});
	const transientWebSearchRestriction = !webSearchPolicy.allowed && webSearchPolicy.persistentAllowed || isCodexMemoryFlushRun(params);
	const persistentCodexWebSearchSurface = params.config?.tools?.web?.search?.enabled !== false && !(input.pluginConfig.codexDynamicToolsExclude ?? []).some((name) => normalizeCodexDynamicToolName(name) === "web_search");
	input.onPersistentWebSearchPolicyResolved?.(webSearchPresent || persistentCodexWebSearchSurface && transientWebSearchRestriction && webSearchPolicy.persistentAllowed);
	const filteredTools = filterCodexDynamicToolsForAllowlist(visionFilteredTools, includeForcedCodexDynamicToolAllow(params.toolsAllow, messagePolicyParams));
	toolBuildStages.mark("allowlist-filter");
	const normalizedTools = normalizeAgentRuntimeTools({
		runtimePlan: input.ignoreRuntimePlan ? void 0 : params.runtimePlan,
		tools: filteredTools,
		provider: params.provider,
		config: params.config,
		workspaceDir: input.effectiveWorkspace,
		env: process.env,
		modelId: params.modelId,
		modelApi: params.model.api,
		model: params.model,
		onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
	});
	toolBuildStages.mark("runtime-normalization");
	input.onWebSearchPolicyResolved?.(normalizedTools.some((tool) => tool.name === "web_search"));
	const exposedTools = webSearchPlan.suppressManagedWebSearch ? normalizedTools.filter((tool) => tool.name !== "web_search") : normalizedTools;
	if (preNormalizationDiagnostics.length > 0) log.warn(`codex app-server quarantined ${preNormalizationDiagnostics.length} unsupported runtime tool schema${preNormalizationDiagnostics.length === 1 ? "" : "s"} before dynamic tool registration`, {
		runId: params.runId,
		sessionId: params.sessionId,
		diagnostics: preNormalizationDiagnostics.map((diagnostic) => ({
			index: diagnostic.toolIndex,
			tool: diagnostic.toolName,
			violations: diagnostic.violations.slice(0, 12),
			violationCount: diagnostic.violations.length
		}))
	});
	const summary = toolBuildStages.snapshot();
	if (shouldWarnCodexDynamicToolBuildStageSummary(summary)) {
		const phase = input.forceHeartbeatTool ? "registered-tools" : "runtime-tools";
		log.warn(`codex app-server dynamic tool build timings runId=${params.runId} sessionId=${params.sessionId} phase=${phase} totalMs=${summary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(summary)}`, {
			runId: params.runId,
			sessionId: params.sessionId,
			phase,
			totalMs: summary.totalMs,
			stages: summary.stages,
			allToolCount: readableAllTools.length,
			codexFilteredToolCount: codexFilteredTools.length,
			visionFilteredToolCount: visionFilteredTools.length,
			filteredToolCount: filteredTools.length,
			normalizedToolCount: exposedTools.length,
			forceHeartbeatTool: input.forceHeartbeatTool === true,
			ignoreRuntimePlan: input.ignoreRuntimePlan === true,
			nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled === true
		});
	}
	return exposedTools;
}
/** Preserves delivery-critical tools when a narrow allowlist would otherwise hide them. */
function includeForcedCodexDynamicToolAllow(toolsAllow, params) {
	if (toolsAllow === void 0 || hasWildcardCodexToolsAllow(toolsAllow)) return toolsAllow;
	const forcedToolNames = shouldForceMessageTool(params) ? ["message"] : [];
	if (forcedToolNames.length === 0) return toolsAllow;
	if (toolsAllow.length === 0) return forcedToolNames;
	const normalized = new Set(toolsAllow.map((name) => normalizeCodexDynamicToolName(name)));
	const missingToolNames = forcedToolNames.filter((toolName) => !normalized.has(normalizeCodexDynamicToolName(toolName)));
	return missingToolNames.length === 0 ? toolsAllow : [...toolsAllow, ...missingToolNames];
}
/** Decides whether Codex native code mode can own shell/file tools for this turn. */
function shouldEnableCodexAppServerNativeToolSurface(params, sandbox, options = {}) {
	if (isCodexMemoryFlushRun(params)) return false;
	const toolsAllow = includeForcedCodexDynamicToolAllow(params.toolsAllow, params);
	if (toolsAllow === void 0) return canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
	return hasWildcardCodexToolsAllow(toolsAllow) && canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
}
/** Returns true when OpenClaw policy requires the Node-owned exec/process tools instead. */
function isCodexNativeExecutionBlockedByNodeExecHost(params, options = {}) {
	return !resolveCodexNativeExecutionPolicy({
		config: params.config,
		sessionKey: resolveCodexRuntimePolicySessionKey(params, options.runtimeSessionKey),
		sessionId: params.sessionId,
		agentId: options.agentId,
		execOverrides: params.execOverrides,
		sandboxAvailable: options.sandbox?.enabled,
		readRuntimeSessionEntry: true
	}).nativeToolSurfaceAllowed;
}
function resolveCodexRuntimePolicySessionKey(params, runtimeSessionKey) {
	return runtimeSessionKey?.trim() || params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
}
function canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options = {}) {
	if (!sandbox?.enabled) return true;
	if (options.sandboxExecServerEnabled === true && sandbox.backend && canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox)) return true;
	return false;
}
function canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox) {
	return CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS.every((toolName) => isToolAllowed(sandbox.tools, toolName));
}
function isCodexMemoryFlushRun(params) {
	return params?.trigger === "memory" && Boolean(params.memoryFlushWritePath?.trim());
}
function filterCodexMemoryFlushDynamicTools(tools) {
	return tools.filter((tool) => CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW.has(normalizeCodexDynamicToolName(tool.name)));
}
/** Requires a Codex sandbox environment only when native tools must run inside OpenClaw sandboxing. */
function shouldRequireCodexSandboxExecServerEnvironment(params) {
	return Boolean(params.sandbox?.enabled && params.nativeToolSurfaceEnabled && params.sandboxExecServerEnabled);
}
/** Selects the sandbox exec-server environment passed through the Codex app-server protocol. */
function resolveCodexSandboxEnvironmentSelection(environment, nativeToolSurfaceEnabled) {
	return environment && nativeToolSurfaceEnabled ? [environment] : void 0;
}
/** Chooses the cwd visible to Codex native execution after sandbox exec-server setup. */
function resolveCodexAppServerExecutionCwd(params) {
	return mapCodexAppServerRemoteWorkspacePath({
		value: params.environment && params.nativeToolSurfaceEnabled ? params.environment.cwd : params.effectiveCwd,
		localWorkspaceRoot: params.localWorkspaceRoot,
		remoteWorkspaceRoot: params.remoteWorkspaceRoot
	});
}
/** Projects a local OpenClaw workspace cwd into the remote Codex app-server workspace root. */
function mapCodexAppServerRemoteWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeRemoteWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeRemoteWorkspaceMatchPath(params.remoteWorkspaceRoot);
	const normalizedValue = normalizeRemoteWorkspaceMatchPath(params.value);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	if (normalizedValue === localRoot) return remoteRoot;
	const prefix = `${localRoot}/`;
	if (!normalizedValue.startsWith(prefix)) throw new Error(`Codex remoteWorkspaceRoot is configured but cwd ${params.value} is outside OpenClaw workspace root ${params.localWorkspaceRoot}; refusing to send a gateway-local cwd to the remote Codex app-server.`);
	return joinRemoteWorkspacePath(remoteRoot, normalizedValue.slice(prefix.length));
}
function normalizeRemoteWorkspaceMatchPath(value) {
	return trimTrailingPathSeparator(value.replace(/\\/gu, "/"));
}
function trimTrailingPathSeparator(value) {
	return value.length > 1 ? value.replace(/[\\/]+$/u, "") : value;
}
function joinRemoteWorkspacePath(remoteRoot, suffix) {
	return remoteRoot === "/" ? `/${suffix}` : `${remoteRoot}/${suffix}`;
}
/** Converts OpenClaw sandbox networking into Codex's external-sandbox policy shape. */
function resolveCodexExternalSandboxPolicyForOpenClawSandbox(sandbox) {
	return {
		type: "externalSandbox",
		networkAccess: codexNetworkAccessForOpenClawSandbox(sandbox) ? "enabled" : "restricted"
	};
}
function codexNetworkAccessForOpenClawSandbox(sandbox) {
	if (sandbox?.backendId !== "docker") return true;
	const network = sandbox?.docker?.network?.trim().toLowerCase();
	return Boolean(network && network !== "none");
}
/** Returns a Codex config copy with app-server Codex plugin loading disabled for thread tools. */
function disableCodexPluginThreadConfig(pluginConfig) {
	const config = readCodexPluginConfig(pluginConfig);
	return {
		...config,
		codexPlugins: {
			...config.codexPlugins,
			enabled: false
		}
	};
}
/** Adds sandbox_exec/process aliases when native Code Mode cannot directly honor the sandbox. */
function addSandboxShellDynamicToolsIfAvailable(filteredTools, allTools, input) {
	if (!shouldExposeSandboxExecDynamicTool(input) || isSandboxShellDynamicToolExcluded(input.pluginConfig)) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	if (!execTool || !processTool) return filteredTools;
	const sandboxExecTool = {
		...execTool,
		name: "sandbox_exec",
		description: "Run a shell command through OpenClaw's configured sandbox backend for this session. Use when OpenClaw sandboxing is active or when a command must execute in the sandbox backend, such as an SSH-backed sandbox or Docker container-path bind layout. Use Codex's native shell only when no OpenClaw sandbox is active and native Code Mode is available.",
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await execTool.execute(toolCallId, args, signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace("Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.", "Use sandbox_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.") }) : item)
			};
		}
	};
	const sandboxProcessTool = {
		...processTool,
		name: "sandbox_process",
		description: "Manage sandbox_exec sessions that were started through OpenClaw's configured sandbox backend for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for sandbox_exec follow-up; use Codex's native shell session handling only when no OpenClaw sandbox is active and native Code Mode is available."
	};
	return [
		...filteredTools,
		sandboxExecTool,
		sandboxProcessTool
	];
}
function shouldExposeSandboxExecDynamicTool(input) {
	if (isCodexMemoryFlushRun(input.params)) return false;
	if (isCodexNativeExecutionBlockedByNodeExecHost(input.params, {
		agentId: input.sessionAgentId,
		runtimeSessionKey: input.sandboxSessionKey,
		sandbox: input.sandbox
	})) return false;
	const backendId = input.sandbox?.enabled ? input.sandbox.backendId.trim().toLowerCase() : "";
	return Boolean(backendId && input.nativeToolSurfaceEnabled === false);
}
function isCodexDynamicToolExcluded(config, names) {
	const normalizedNames = new Set(names.map((name) => normalizeCodexDynamicToolName(name)));
	return (config.codexDynamicToolsExclude ?? []).some((name) => {
		const normalized = normalizeCodexDynamicToolName(name);
		return normalizedNames.has(normalized);
	});
}
function isSandboxShellDynamicToolExcluded(config) {
	return isCodexDynamicToolExcluded(config, [
		"exec",
		"sandbox_exec",
		"process",
		"sandbox_process"
	]);
}
function addNodeShellDynamicToolsIfNeeded(filteredTools, allTools, input, nodePolicy) {
	if (isCodexMemoryFlushRun(input.params)) return filteredTools;
	if (nodePolicy.effectiveExecHost !== "node") return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	if (!execTool || !processTool) return filteredTools;
	const toolsToAppend = [];
	if (!isCodexDynamicToolExcluded(input.pluginConfig, ["exec", CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME]) && !filteredTools.some((tool) => normalizeCodexDynamicToolName(tool.name) === CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME)) toolsToAppend.push(createNodeExecDynamicTool(execTool, nodePolicy.node));
	if (!isCodexDynamicToolExcluded(input.pluginConfig, ["process", CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME]) && !filteredTools.some((tool) => normalizeCodexDynamicToolName(tool.name) === CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME)) toolsToAppend.push(createNodeProcessDynamicTool(processTool));
	return toolsToAppend.length > 0 ? [...filteredTools, ...toolsToAppend] : filteredTools;
}
function createNodeExecDynamicTool(execTool, configuredNode) {
	return {
		...execTool,
		name: CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
		description: "Run a shell command on the OpenClaw configured remote node for this session. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Use node_process for follow-up on backgrounded node_exec sessions. Use Codex's native shell for local app-server work.",
		parameters: hideNodeExecDynamicToolParameters(execTool.parameters),
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await execTool.execute(toolCallId, pinNodeExecDynamicToolArgs(args, configuredNode), signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace("Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.", "Use node_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.") }) : item)
			};
		}
	};
}
function createNodeProcessDynamicTool(processTool) {
	return {
		...processTool,
		name: CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME,
		description: "Manage node_exec sessions that were started on the OpenClaw configured remote node for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for node_exec follow-up; use Codex's native shell session handling for local app-server work."
	};
}
function pinNodeExecDynamicToolArgs(args, configuredNode) {
	const { host: _host, security: _security, ask: _ask, node: _node, ...rest } = args && typeof args === "object" && !Array.isArray(args) ? args : {};
	const node = configuredNode?.trim();
	return {
		...rest,
		host: "node",
		...node ? { node } : {}
	};
}
function hideNodeExecDynamicToolParameters(parameters) {
	if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return parameters;
	const schema = parameters;
	const rawProperties = schema.properties;
	if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties)) return parameters;
	const nextProperties = Object.fromEntries(Object.entries(rawProperties).filter(([name]) => !CODEX_NODE_EXEC_HIDDEN_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name))));
	const rawRequired = schema.required;
	const nextRequired = Array.isArray(rawRequired) ? rawRequired.filter((name) => typeof name !== "string" || !CODEX_NODE_EXEC_HIDDEN_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name))) : rawRequired;
	return {
		...schema,
		properties: nextProperties,
		...Array.isArray(rawRequired) ? { required: nextRequired } : {}
	};
}
function resolveCodexNativeExecutionPolicyForDynamicTools(input) {
	return resolveCodexNativeExecutionPolicy({
		config: input.params.config,
		sessionKey: resolveCodexRuntimePolicySessionKey(input.params, input.sandboxSessionKey),
		sessionId: input.params.sessionId,
		agentId: input.sessionAgentId,
		execOverrides: input.params.execOverrides,
		sandboxAvailable: input.sandbox?.enabled,
		readRuntimeSessionEntry: true
	});
}
function resolveNodeExecToolOverrides(policy) {
	if (policy.effectiveExecHost !== "node") return;
	const node = policy.node?.trim();
	return {
		host: "node",
		...node ? { node } : {}
	};
}
/** Applies a normalized tool allowlist while preserving shell aliases for exec/process. */
function filterCodexDynamicToolsForAllowlist(tools, toolsAllow) {
	if (!toolsAllow) return tools;
	if (toolsAllow.length === 0) return [];
	if (hasWildcardCodexToolsAllow(toolsAllow)) return tools;
	const allowSet = new Set(toolsAllow.map((name) => normalizeCodexDynamicToolName(name)).filter(Boolean));
	return tools.filter((tool) => {
		const normalized = normalizeCodexDynamicToolName(tool.name);
		return allowSet.has(normalized) || normalized === "sandbox_exec" && allowSet.has("exec") || normalized === "sandbox_process" && (allowSet.has("exec") || allowSet.has("process")) || normalized === CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME && allowSet.has("exec") || normalized === CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME && (allowSet.has("exec") || allowSet.has("process"));
	});
}
/** Detects the wildcard allowlist marker after Codex tool-name normalization. */
function hasWildcardCodexToolsAllow(toolsAllow) {
	return toolsAllow.some((name) => normalizeCodexDynamicToolName(name) === "*");
}
/** Forces message delivery through the message tool when the source channel requires it. */
function shouldForceMessageTool(params) {
	return params.disableMessageTool !== true && params.sourceReplyDeliveryMode === "message_tool_only";
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-diagnostics.ts
/**
* Trusted diagnostics emitted around Codex dynamic tool execution lifecycle.
*/
/** Emits a start event for one Codex dynamic tool call. */
function emitDynamicToolStartedDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.started",
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId
	});
}
/** Emits an error event for one Codex dynamic tool call. */
function emitDynamicToolErrorDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId,
		durationMs: params.durationMs,
		errorCategory: "codex_dynamic_tool_error"
	});
}
/** Emits the terminal event matching a dynamic tool response's diagnostic type. */
function emitDynamicToolTerminalDiagnostic(params) {
	const terminalType = params.response.diagnosticTerminalType ?? (params.response.success ? "completed" : "error");
	if (terminalType === "completed") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.completed",
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			durationMs: params.durationMs
		});
		return;
	}
	if (terminalType === "blocked") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.blocked",
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			deniedReason: "plugin-before-tool-call",
			reason: "Tool call blocked"
		});
		return;
	}
	emitDynamicToolErrorDiagnostic(params);
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tools.ts
function applyCurrentMessageProvider(toolName, args, currentProvider) {
	const hasProvider = typeof args.provider === "string" && args.provider.trim().length > 0 ? true : typeof args.channel === "string" && args.channel.trim().length > 0;
	const provider = currentProvider?.trim();
	if (toolName !== "message" || hasProvider || !provider) return args;
	return {
		...args,
		provider
	};
}
/** Namespace attached to OpenClaw-owned dynamic tools exposed to Codex. */
const CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE = "openclaw";
const ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES = new Set(["sessions_yield"]);
const DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS = 16e3;
/**
* Creates dynamic tool specs and a call handler that executes OpenClaw tools,
* applies hooks/middleware, and records delivery/media telemetry.
*/
function createCodexDynamicToolBridge(params) {
	const toolResultHookContext = toToolResultHookContext(params.hookContext);
	const toolResultMaxChars = resolveCodexDynamicToolResultMaxChars(params.hookContext);
	const availableProjection = projectCodexDynamicTools(params.tools);
	const registeredProjection = params.registeredTools ? projectCodexDynamicTools(params.registeredTools) : availableProjection;
	const wrappedAvailableProjection = wrapProjectedCodexDynamicTools(availableProjection.tools, params.hookContext);
	const availableTools = wrappedAvailableProjection.tools;
	const quarantinedAvailableToolNames = new Set([...availableProjection.quarantinedTools, ...wrappedAvailableProjection.quarantinedTools].map((tool) => tool.tool));
	const registeredSpecTools = (params.registeredTools ? registeredProjection.tools : availableTools).filter((entry) => !quarantinedAvailableToolNames.has(entry.name));
	const toolMap = new Map(availableTools.map((entry) => [entry.name, entry]));
	const registeredToolNames = new Set(registeredSpecTools.map((entry) => entry.name));
	const quarantinedTools = dedupeQuarantinedDynamicTools([
		...availableProjection.quarantinedTools,
		...registeredProjection.quarantinedTools,
		...wrappedAvailableProjection.quarantinedTools
	]);
	warnQuarantinedDynamicTools(quarantinedTools);
	emitQuarantinedDynamicToolDiagnostics(quarantinedTools, params.hookContext);
	const telemetry = {
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		toolMediaUrls: [],
		toolAudioAsVoice: false,
		quarantinedTools
	};
	const middlewareRunner = createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...toolResultHookContext
	});
	const isReplaySafeToolInstance = (tool) => {
		const pluginMeta = getPluginToolMeta(tool);
		if (pluginMeta) return pluginMeta.replaySafe === true;
		return getChannelAgentToolMeta(tool) === void 0;
	};
	const legacyExtensionRunner = createCodexAppServerToolResultExtensionRunner(toolResultHookContext);
	const directToolNames = new Set([...ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES, ...params.directToolNames ?? []]);
	return {
		availableSpecs: createCodexDynamicToolSpecs({
			entries: availableTools,
			loading: params.loading ?? "searchable",
			directToolNames
		}),
		specs: createCodexDynamicToolSpecs({
			entries: registeredSpecTools,
			loading: params.loading ?? "searchable",
			directToolNames
		}),
		telemetry,
		handleToolCall: async (call, options) => {
			const toolEntry = toolMap.get(call.tool);
			if (!toolEntry) {
				const message = registeredToolNames.has(call.tool) ? `OpenClaw tool is not available for this turn: ${call.tool}` : `Unknown OpenClaw tool: ${call.tool}`;
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedToolResult(message),
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName: call.tool,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, call.tool, failedToolResult(message), true);
				if (registeredToolNames.has(call.tool)) return {
					contentItems: [{
						type: "inputText",
						text: message
					}],
					success: false
				};
				return {
					contentItems: [{
						type: "inputText",
						text: message
					}],
					success: false
				};
			}
			const { tool, name: toolName } = toolEntry;
			const args = jsonObjectToRecord(call.arguments);
			const startedAt = Date.now();
			const signal = composeAbortSignals(params.signal, options?.signal);
			let didStartExecution = false;
			let executionPrevented = false;
			let executedArgs = structuredClone(args);
			try {
				const preparedArgs = tool.prepareArguments ? tool.prepareArguments(args) : args;
				const telemetryArgs = isRecord(preparedArgs) ? preparedArgs : args;
				executedArgs = structuredClone(telemetryArgs);
				const messagingContext = {
					config: params.hookContext?.config,
					currentChannelId: params.hookContext?.currentChannelId,
					currentMessagingTarget: params.hookContext?.currentMessagingTarget,
					currentThreadId: params.hookContext?.currentThreadId,
					replyToMode: params.hookContext?.replyToMode,
					hasRepliedRef: params.hookContext?.hasRepliedRef ? { value: params.hookContext.hasRepliedRef.value } : void 0
				};
				didStartExecution = true;
				const rawResult = await tool.execute(call.callId, preparedArgs, signal);
				const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
				if (isRecord(adjustedExecutedArgs)) executedArgs = structuredClone(adjustedExecutedArgs);
				executionPrevented = consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const telemetryRawResult = sanitizeToolResult(rawResult);
				const rawIsError = isCodexToolResultError(rawResult);
				const middlewareResult = await middlewareRunner.applyToolResultMiddleware({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					isError: rawIsError,
					result: rawResult
				});
				const result = await legacyExtensionRunner.applyToolResultExtensions({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					result: middlewareResult
				});
				const resultIsError = rawIsError || isCodexToolResultError(result);
				notifyAgentToolResult(options?.onAgentToolResult, toolName, result, resultIsError);
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					result,
					startedAt
				});
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result,
					isError: resultIsError,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				const messagingTelemetryArgs = applyCurrentMessageProvider(toolName, executedArgs, params.hookContext?.currentChannelProvider);
				const messagingTarget = isMessagingTool(toolName) && isMessagingToolSendAction(toolName, executedArgs) ? extractMessagingToolSend(toolName, messagingTelemetryArgs, messagingContext) : void 0;
				const confirmedMessagingTarget = !rawIsError && messagingTarget ? extractMessagingToolSendResult(messagingTarget, telemetryRawResult) : messagingTarget;
				collectToolTelemetry({
					toolName,
					args: executedArgs,
					result,
					mediaTrustResult: telemetryRawResult,
					telemetry,
					isError: resultIsError,
					messagingTarget: confirmedMessagingTarget
				});
				const terminalType = inferToolResultDiagnosticTerminalType(result, resultIsError);
				const response = withDiagnosticTerminalType({
					contentItems: convertToolContents(result.content, toolResultMaxChars),
					success: !resultIsError
				}, terminalType);
				withDynamicToolTermination(response, rawResult.terminate === true || result.terminate === true || isToolResultYield(rawResult) || isToolResultYield(result));
				const asyncStarted = isAsyncStartedToolResult(rawResult) || isAsyncStartedToolResult(result);
				withDynamicToolAsyncStarted(response, asyncStarted);
				return withSideEffectEvidence(response, !(executionPrevented || !asyncStarted && isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs)));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
				if (isRecord(adjustedExecutedArgs)) executedArgs = structuredClone(adjustedExecutedArgs);
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const failedResult = failedToolResult(errorMessage);
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedResult,
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, toolName, failedResult, true);
				collectToolTelemetry({
					toolName,
					args: executedArgs,
					result: void 0,
					telemetry,
					isError: true
				});
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					error: errorMessage,
					startedAt
				});
				const replaySafe = !didStartExecution || executionPrevented || isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs);
				return withSideEffectEvidence(withDiagnosticTerminalType({
					contentItems: [{
						type: "inputText",
						text: errorMessage
					}],
					success: false
				}, "error"), didStartExecution && !replaySafe);
			}
		}
	};
}
function notifyAgentToolResult(observer, toolName, result, isError) {
	try {
		observer?.({
			toolName,
			result: sanitizeToolResult(result),
			isError
		});
	} catch (error) {
		log.warn(`onAgentToolResult handler failed: tool=${toolName} error=${String(error)}`);
	}
}
function failedToolResult(message) {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status: "failed",
			error: message
		}
	};
}
function wrapProjectedCodexDynamicTools(tools, hookContext) {
	const wrappedTools = [];
	const quarantinedTools = [];
	for (const entry of tools) try {
		if (isToolWrappedWithBeforeToolCallHook(entry.tool)) {
			setBeforeToolCallDiagnosticsEnabled(entry.tool, false);
			wrappedTools.push(entry);
			continue;
		}
		wrappedTools.push({
			...entry,
			tool: wrapToolWithBeforeToolCallHook(entry.tool, hookContext, { emitDiagnostics: false })
		});
	} catch {
		quarantinedTools.push({
			tool: entry.name,
			violations: [`${entry.name} could not be wrapped for before-tool-call hooks`]
		});
	}
	return {
		tools: wrappedTools,
		quarantinedTools
	};
}
function createCodexDynamicToolSpecs(params) {
	const specs = [];
	const namespaceTools = [];
	for (const entry of params.entries) {
		const functionSpec = createCodexDynamicToolFunctionSpec({ entry });
		if (params.loading === "direct" || params.directToolNames.has(entry.name)) {
			specs.push(functionSpec);
			continue;
		}
		namespaceTools.push({
			...functionSpec,
			deferLoading: true
		});
	}
	if (namespaceTools.length > 0) specs.push({
		type: "namespace",
		name: CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE,
		description: "",
		tools: namespaceTools
	});
	return specs;
}
function createCodexDynamicToolFunctionSpec(params) {
	return {
		type: "function",
		name: params.entry.name,
		description: params.entry.description,
		inputSchema: params.entry.inputSchema
	};
}
function projectCodexDynamicTools(tools) {
	const projectedTools = [];
	const quarantinedTools = [];
	let length;
	try {
		length = tools.length;
	} catch {
		return {
			tools: [],
			quarantinedTools: [{
				tool: "tool[0]",
				violations: ["tool[0] is unreadable"]
			}]
		};
	}
	for (let toolIndex = 0; toolIndex < length; toolIndex += 1) {
		let tool;
		try {
			tool = tools[toolIndex];
		} catch {
			quarantinedTools.push({
				tool: `tool[${toolIndex}]`,
				violations: [`tool[${toolIndex}] is unreadable`]
			});
			continue;
		}
		const descriptor = readCodexDynamicToolDescriptor(tool, toolIndex);
		if (!descriptor.ok) {
			quarantinedTools.push(descriptor.diagnostic);
			continue;
		}
		const projection = projectRuntimeToolInputSchema(descriptor.parameters, `${descriptor.name}.inputSchema`);
		if (projection.violations.length > 0) {
			quarantinedTools.push({
				tool: descriptor.name,
				violations: projection.violations
			});
			continue;
		}
		projectedTools.push({
			tool,
			name: descriptor.name,
			description: descriptor.description,
			inputSchema: projection.schema
		});
	}
	return {
		tools: projectedTools,
		quarantinedTools
	};
}
function readCodexDynamicToolDescriptor(tool, toolIndex) {
	const fallbackName = `tool[${toolIndex}]`;
	let name;
	try {
		const rawName = tool.name;
		if (typeof rawName !== "string" || !rawName) return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name must be a non-empty string`]
			}
		};
		name = rawName;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name is unreadable`]
			}
		};
	}
	let description;
	try {
		description = typeof tool.description === "string" ? tool.description : "";
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.description is unreadable`]
			}
		};
	}
	let parameters;
	try {
		parameters = tool.parameters;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.inputSchema is unreadable`]
			}
		};
	}
	return {
		ok: true,
		name,
		description,
		parameters
	};
}
function warnQuarantinedDynamicTools(tools) {
	if (tools.length === 0) return;
	const unique = /* @__PURE__ */ new Map();
	for (const tool of tools) unique.set(tool.tool, tool.violations);
	log.warn(`codex app-server quarantined ${unique.size} dynamic ${unique.size === 1 ? "tool" : "tools"} with unsupported input schemas: ${[...unique.keys()].join(", ")}`, { tools: [...unique.entries()].map(([tool, violations]) => ({
		tool,
		violations
	})) });
}
function emitQuarantinedDynamicToolDiagnostics(tools, ctx) {
	for (const tool of tools) emitTrustedDiagnosticEvent({
		type: "tool.execution.blocked",
		runId: ctx?.runId,
		sessionId: ctx?.sessionId,
		sessionKey: ctx?.sessionKey,
		toolName: tool.tool,
		deniedReason: "unsupported_tool_schema",
		reason: tool.violations.join(", ")
	});
}
function dedupeQuarantinedDynamicTools(tools) {
	return [...new Map(tools.map((tool) => [tool.tool, {
		tool: tool.tool,
		violations: tool.violations
	}])).values()];
}
function toToolResultHookContext(ctx) {
	const { agentId, sessionId, sessionKey, runId, channelId } = ctx ?? {};
	return {
		...agentId && { agentId },
		...sessionId && { sessionId },
		...sessionKey && { sessionKey },
		...runId && { runId },
		...channelId && { channelId }
	};
}
function resolveCodexDynamicToolResultMaxChars(ctx) {
	return resolveAgentContextLimitValue({
		config: ctx?.config,
		agentId: ctx?.agentId,
		key: "toolResultMaxChars"
	}) ?? DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS;
}
function resolveAgentContextLimitValue(params) {
	const agents = asOptionalRecord(params.config?.agents);
	const defaultValue = readPositiveInteger(asOptionalRecord(asOptionalRecord(agents?.defaults)?.contextLimits)?.[params.key]);
	if (!params.agentId) return defaultValue;
	const list = agents?.list;
	if (!Array.isArray(list)) return defaultValue;
	const normalizedAgentId = normalizeAgentId(params.agentId);
	return readPositiveInteger(asOptionalRecord(asOptionalRecord(list.find((entry) => {
		const entryId = asOptionalRecord(entry)?.id;
		return typeof entryId === "string" && normalizeAgentId(entryId) === normalizedAgentId;
	}))?.contextLimits)?.[params.key]) ?? defaultValue;
}
function composeAbortSignals(...signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	if (activeSignals.length === 0) return new AbortController().signal;
	if (activeSignals.length === 1) return activeSignals[0];
	return AbortSignal.any(activeSignals);
}
function collectToolTelemetry(params) {
	if (params.isError) return;
	if (!params.isError && params.toolName === "cron" && isCronAddAction(params.args)) params.telemetry.successfulCronAdds = (params.telemetry.successfulCronAdds ?? 0) + 1;
	if (!params.isError && params.toolName === "heartbeat_respond") {
		const response = normalizeHeartbeatToolResponse(params.result?.details);
		if (response) params.telemetry.heartbeatToolResponse = response;
	}
	if (!params.isError && params.result) {
		const media = extractToolResultMediaArtifact(params.result);
		if (media) {
			const mediaUrls = filterToolResultMediaUrls(params.toolName, media.mediaUrls, params.mediaTrustResult ?? params.result);
			const seen = new Set(params.telemetry.toolMediaUrls);
			for (const mediaUrl of mediaUrls) if (!seen.has(mediaUrl)) {
				seen.add(mediaUrl);
				params.telemetry.toolMediaUrls.push(mediaUrl);
			}
			if (media.audioAsVoice) params.telemetry.toolAudioAsVoice = true;
		}
	}
	if (!isMessagingTool(params.toolName) || !isMessagingToolSendAction(params.toolName, params.args)) return;
	params.telemetry.didSendViaMessagingTool = true;
	const sourceReplyPayload = extractInternalSourceReplyPayload(params.result?.details);
	if (sourceReplyPayload) {
		params.telemetry.messagingToolSourceReplyPayloads.push(sourceReplyPayload);
		return;
	}
	const text = readFirstString$1(params.args, [
		"text",
		"message",
		"body",
		"content"
	]);
	if (text) params.telemetry.messagingToolSentTexts.push(text);
	const mediaUrls = collectMediaUrls(params.args);
	params.telemetry.messagingToolSentMediaUrls.push(...mediaUrls);
	params.telemetry.messagingToolSentTargets.push({
		...params.messagingTarget ?? {
			tool: params.toolName,
			provider: readFirstString$1(params.args, ["provider", "channel"]) ?? params.toolName,
			accountId: readFirstString$1(params.args, ["accountId", "account_id"]),
			to: readFirstString$1(params.args, [
				"to",
				"target",
				"recipient"
			]),
			threadId: readFirstString$1(params.args, [
				"threadId",
				"thread_id",
				"messageThreadId"
			])
		},
		...text ? { text } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {}
	});
}
function extractInternalSourceReplyPayload(details) {
	if (!isRecord(details) || details.sourceReplySink !== "internal-ui") return;
	const rawPayload = details.sourceReply;
	if (!isRecord(rawPayload)) return;
	const text = readFirstString$1(rawPayload, ["text", "message"]);
	const mediaUrls = collectMediaUrls(rawPayload);
	const mediaUrl = typeof rawPayload.mediaUrl === "string" && rawPayload.mediaUrl.trim() ? rawPayload.mediaUrl.trim() : mediaUrls[0];
	const payload = {
		...text ? { text } : {},
		...mediaUrl ? { mediaUrl } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {},
		...rawPayload.audioAsVoice === true ? { audioAsVoice: true } : {},
		...isRecord(rawPayload.presentation) ? { presentation: rawPayload.presentation } : {},
		...isRecord(rawPayload.interactive) ? { interactive: rawPayload.interactive } : {},
		...isRecord(rawPayload.channelData) ? { channelData: rawPayload.channelData } : {},
		...typeof details.idempotencyKey === "string" && details.idempotencyKey.trim() ? { idempotencyKey: details.idempotencyKey.trim() } : {}
	};
	return text || mediaUrls.length > 0 || payload.presentation || payload.interactive ? payload : void 0;
}
function readPositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function isCodexToolResultError(result) {
	if (isToolResultError(result)) return true;
	const details = result.details;
	if (!isRecord(details)) return false;
	if (details.ok === true || details.success === true) return false;
	if (details.timedOut === true) return true;
	if (typeof details.exitCode === "number" && details.exitCode !== 0) return true;
	if (typeof details.status !== "string") return false;
	const status = details.status.trim().toLowerCase();
	return status !== "" && status !== "0" && status !== "ok" && status !== "success" && status !== "completed" && status !== "recorded" && status !== "pending" && status !== "started" && status !== "running" && status !== "yielded";
}
function isToolResultYield(result) {
	const details = result.details;
	if (!isRecord(details) || typeof details.status !== "string") return false;
	return details.status.trim().toLowerCase() === "yielded";
}
function isAsyncStartedToolResult(result) {
	const details = result.details;
	return isRecord(details) && details.async === true && details.status === "started";
}
function inferToolResultDiagnosticTerminalType(result, isError) {
	const details = result.details;
	if (isRecord(details) && typeof details.status === "string") {
		if (details.status.trim().toLowerCase() === "blocked") return "blocked";
	}
	return isError ? "error" : "completed";
}
function withDiagnosticTerminalType(response, terminalType) {
	Object.defineProperty(response, "diagnosticTerminalType", {
		configurable: true,
		enumerable: false,
		value: terminalType
	});
	return response;
}
function withSideEffectEvidence(response, sideEffectEvidence) {
	if (!sideEffectEvidence) return response;
	Object.defineProperty(response, "sideEffectEvidence", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function withDynamicToolTermination(response, terminate) {
	if (!terminate) return response;
	Object.defineProperty(response, "terminate", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function withDynamicToolAsyncStarted(response, asyncStarted) {
	if (!asyncStarted) return response;
	Object.defineProperty(response, "asyncStarted", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function normalizeToolResultMaxChars(maxChars) {
	return typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0 ? Math.floor(maxChars) : DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS;
}
function convertToolContents(content, toolResultMaxChars = DEFAULT_CODEX_DYNAMIC_TOOL_RESULT_MAX_CHARS) {
	const maxChars = normalizeToolResultMaxChars(toolResultMaxChars);
	const totalTextChars = content.reduce((total, item) => total + (item.type === "text" ? item.text.length : 0), 0);
	if (totalTextChars <= maxChars) return content.flatMap(convertToolContent);
	const noticeText = `...(OpenClaw truncated dynamic tool result: original ${totalTextChars} chars, showing ${maxChars}; rerun with narrower args.)`;
	const notice = `\n${noticeText}`;
	let remainingTextBudget = Math.max(0, maxChars - notice.length);
	let appendedNotice = false;
	const output = [];
	for (const item of content) {
		if (item.type !== "text") {
			output.push(...convertToolContent(item));
			continue;
		}
		if (appendedNotice) continue;
		if (notice.length >= maxChars) {
			output.push({
				type: "inputText",
				text: noticeText.slice(0, maxChars)
			});
			appendedNotice = true;
			continue;
		}
		const sliceLength = Math.min(item.text.length, remainingTextBudget);
		remainingTextBudget -= sliceLength;
		const shouldAppendNotice = remainingTextBudget <= 0;
		const text = item.text.slice(0, sliceLength);
		if (shouldAppendNotice) {
			output.push({
				type: "inputText",
				text: `${text.trimEnd()}${notice}`.slice(0, maxChars)
			});
			appendedNotice = true;
		} else if (text.length > 0) output.push({
			type: "inputText",
			text
		});
	}
	if (!appendedNotice) output.push({
		type: "inputText",
		text: noticeText.slice(0, maxChars)
	});
	return output;
}
function convertToolContent(content) {
	if (content.type === "text") return [{
		type: "inputText",
		text: content.text
	}];
	const imageUrl = sanitizeInlineImageDataUrl(`data:${content.mimeType};base64,${content.data}`);
	if (!imageUrl) return [{
		type: "inputText",
		text: invalidInlineImageText("codex dynamic tool")
	}];
	return [{
		type: "inputImage",
		imageUrl
	}];
}
function jsonObjectToRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return value;
}
function readFirstString$1(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
		if (typeof value === "number" && Number.isFinite(value)) return String(value);
	}
}
function collectMediaUrls(record) {
	const urls = [];
	const pushMediaUrl = (value) => {
		if (typeof value === "string" && value.trim()) urls.push(value.trim());
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const attachment = value;
		for (const key of [
			"media",
			"mediaUrl",
			"path",
			"filePath",
			"fileUrl",
			"url"
		]) pushMediaUrl(attachment[key]);
	};
	for (const key of [
		"media",
		"mediaUrl",
		"media_url",
		"path",
		"filePath",
		"fileUrl",
		"imageUrl",
		"image_url"
	]) {
		const value = record[key];
		pushMediaUrl(value);
	}
	for (const key of [
		"mediaUrls",
		"media_urls",
		"imageUrls",
		"image_urls"
	]) {
		const value = record[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) pushMediaUrl(entry);
	}
	const attachments = record.attachments;
	if (Array.isArray(attachments)) for (const attachment of attachments) pushAttachment(attachment);
	return urls;
}
function isCronAddAction(args) {
	const action = args.action;
	return typeof action === "string" && action.trim().toLowerCase() === "add";
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-bridge.ts
const MCP_TOOL_APPROVAL_KIND = "mcp_tool_call";
const MCP_TOOL_APPROVAL_KIND_KEY = "codex_approval_kind";
const MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY = "connector_name";
const MCP_TOOL_APPROVAL_TOOL_TITLE_KEY = "tool_title";
const MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY = "tool_description";
const MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY = "tool_params_display";
const MCP_TOOL_APPROVAL_SOURCE_KEY = "source";
const MCP_TOOL_APPROVAL_CONNECTOR_SOURCE = "connector";
const CODEX_APPS_SERVER_NAME = "codex_apps";
const COMPUTER_USE_APPROVAL_TITLE = "Computer Use approval";
const EMPTY_OBJECT_SCHEMA = {
	type: "object",
	properties: {}
};
const PLUGIN_APP_ID_META_KEYS = [
	"app_id",
	"appId",
	"codex_app_id",
	"codexAppId"
];
const PLUGIN_CONNECTOR_ID_META_KEYS = ["connector_id", "connectorId"];
const PLUGIN_NAME_META_KEYS = [
	"plugin_name",
	"pluginName",
	"codex_plugin_name",
	"codexPluginName"
];
const PLUGIN_CONFIG_KEY_META_KEYS = [
	"config_key",
	"configKey",
	"codex_config_key"
];
const PLUGIN_MARKETPLACE_NAME_META_KEYS = [
	"marketplace_name",
	"marketplaceName",
	"codex_marketplace_name",
	"codexMarketplaceName"
];
const MAX_DISPLAY_PARAM_ENTRIES = 8;
const MAX_DISPLAY_PARAM_VALUE_LENGTH = 120;
const MAX_DISPLAY_VALUE_ARRAY_ITEMS = 8;
const MAX_DISPLAY_VALUE_OBJECT_KEYS = 8;
const MAX_DISPLAY_VALUE_DEPTH = 3;
const DISPLAY_TEXT_SCAN_MAX_LENGTH = 4096;
const ANSI_OSC_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`, "g");
const ANSI_CONTROL_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`, "g");
const CONTROL_CHARACTER_RE = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE = new RegExp(String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`, "gu");
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE = new RegExp(String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`);
async function handleCodexAppServerElicitationRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!requestParams) return;
	if (!matchesCurrentThread(requestParams, params.threadId)) return;
	if (turnIdMismatches(requestParams, params.turnId)) return;
	const pluginResolution = resolvePluginElicitation({
		requestParams,
		pluginAppPolicyContext: params.pluginAppPolicyContext
	});
	if (pluginResolution.kind !== "not_plugin") {
		if (pluginResolution.kind === "decline") {
			logPluginElicitationDecline(pluginResolution.reason, requestParams);
			return declineElicitationResponse();
		}
		if (!hasExactTurnId(requestParams, params.turnId)) {
			logPluginElicitationDecline("missing_active_turn", requestParams);
			return declineElicitationResponse();
		}
		return await buildPluginPolicyElicitationResponse({
			entry: pluginResolution.entry,
			requestParams,
			paramsForRun: params.paramsForRun,
			signal: params.signal
		});
	}
	const approvalPrompt = readComputerUseApprovalElicitation(requestParams, params.computerUseMcpServerName) ?? readBridgeableApprovalElicitation(requestParams);
	if (!approvalPrompt) return;
	return buildElicitationResponse(approvalPrompt, await requestPluginApprovalOutcome({
		paramsForRun: params.paramsForRun,
		title: approvalPrompt.title,
		description: approvalPrompt.description,
		allowedDecisions: approvalPrompt.allowedDecisions,
		signal: params.signal
	}));
}
function matchesCurrentThread(requestParams, threadId) {
	if (!requestParams) return false;
	return readString(requestParams, "threadId") === threadId;
}
function turnIdMismatches(requestParams, turnId) {
	const rawTurnId = requestParams?.turnId;
	return rawTurnId !== null && rawTurnId !== void 0 && rawTurnId !== turnId;
}
function hasExactTurnId(requestParams, turnId) {
	return requestParams?.turnId === turnId;
}
function resolvePluginElicitation(params) {
	const requestParams = params.requestParams;
	if (!requestParams) return { kind: "not_plugin" };
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const context = params.pluginAppPolicyContext;
	const entries = context ? Object.values(context.apps) : [];
	const appId = readFirstString(meta, PLUGIN_APP_ID_META_KEYS) ?? readFirstString(requestParams, PLUGIN_APP_ID_META_KEYS);
	const connectorId = readFirstString(meta, PLUGIN_CONNECTOR_ID_META_KEYS);
	const isCodexConnectorApproval = isCodexConnectorApprovalElicitation(requestParams, meta);
	if (isCodexConnectorApproval && appId && connectorId && appId !== connectorId) return {
		kind: "decline",
		reason: "app_id_connector_id_mismatch"
	};
	if (appId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		const entry = context.apps[appId];
		return uniquePluginMatch(entry ? [entry] : [], "app_id");
	}
	if (isCodexConnectorApproval && connectorId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		const entry = context.apps[connectorId];
		return uniquePluginMatch(entry ? [entry] : [], "connector_id");
	}
	const serverName = readString(requestParams, "serverName");
	if (serverName && context) {
		const matches = entries.filter((entry) => entry.mcpServerNames.includes(serverName));
		if (matches.length > 0) return uniquePluginMatch(matches, "server_name");
	}
	const metadataResolution = resolvePluginStableMetadataMatch({
		meta,
		requestParams,
		entries,
		context
	});
	if (metadataResolution.kind !== "not_plugin") return metadataResolution;
	if (context && hasDisplayNameOnlyPluginMatch(meta, entries)) return {
		kind: "decline",
		reason: "display_name_only"
	};
	return { kind: "not_plugin" };
}
function isCodexConnectorApprovalElicitation(requestParams, meta) {
	return readString(requestParams, "serverName") === CODEX_APPS_SERVER_NAME && readString(meta, MCP_TOOL_APPROVAL_KIND_KEY) === MCP_TOOL_APPROVAL_KIND && readString(meta, MCP_TOOL_APPROVAL_SOURCE_KEY) === MCP_TOOL_APPROVAL_CONNECTOR_SOURCE;
}
function resolvePluginStableMetadataMatch(params) {
	const pluginName = readFirstString(params.meta, PLUGIN_NAME_META_KEYS) ?? readFirstString(params.requestParams, PLUGIN_NAME_META_KEYS);
	const configKey = readFirstString(params.meta, PLUGIN_CONFIG_KEY_META_KEYS) ?? readFirstString(params.requestParams, PLUGIN_CONFIG_KEY_META_KEYS);
	const marketplaceName = readFirstString(params.meta, PLUGIN_MARKETPLACE_NAME_META_KEYS) ?? readFirstString(params.requestParams, PLUGIN_MARKETPLACE_NAME_META_KEYS);
	if (!pluginName && !configKey) return { kind: "not_plugin" };
	if (!params.context) return {
		kind: "decline",
		reason: "missing_policy_context"
	};
	return uniquePluginMatch(params.entries.filter((entry) => {
		if (marketplaceName && entry.marketplaceName !== marketplaceName) return false;
		if (pluginName && entry.pluginName !== pluginName) return false;
		if (configKey && entry.configKey !== configKey) return false;
		return true;
	}), "metadata");
}
function uniquePluginMatch(matches, source) {
	if (matches.length === 1 && matches[0]) return {
		kind: "matched",
		entry: matches[0]
	};
	return {
		kind: "decline",
		reason: matches.length === 0 ? `${source}_not_enabled` : `${source}_ambiguous`
	};
}
function hasDisplayNameOnlyPluginMatch(meta, entries) {
	const connectorName = readString(meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY);
	if (!connectorName) return false;
	const normalized = normalizePluginIdentityText(connectorName);
	return entries.some((entry) => normalizePluginIdentityText(entry.pluginName) === normalized || normalizePluginIdentityText(entry.configKey) === normalized);
}
function normalizePluginIdentityText(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
async function buildPluginPolicyElicitationResponse(params) {
	const mode = resolvePluginDestructiveApprovalMode(params.entry);
	if (mode === "deny") {
		logPluginElicitationDecline("destructive_actions_disabled", params.requestParams);
		return declineElicitationResponse();
	}
	const approvalPrompt = readPluginApprovalElicitation(params.entry, params.requestParams);
	if (!approvalPrompt) {
		logPluginElicitationDecline("unsupported_schema", params.requestParams);
		return declineElicitationResponse();
	}
	const response = buildElicitationResponse(approvalPrompt, "approved-once");
	if (isJsonObject(response) && response.action === "accept") {
		if (mode === "allow") return response;
		return buildElicitationResponse(approvalPrompt, await requestPluginApprovalOutcome({
			paramsForRun: params.paramsForRun,
			title: approvalPrompt.title,
			description: approvalPrompt.description,
			allowedDecisions: approvalPrompt.allowedDecisions,
			signal: params.signal
		}));
	}
	logPluginElicitationDecline("unmappable_schema", params.requestParams);
	return declineElicitationResponse();
}
function resolvePluginDestructiveApprovalMode(entry) {
	return entry.destructiveApprovalMode ?? (entry.allowDestructiveActions ? "allow" : "deny");
}
function readPluginApprovalElicitation(entry, requestParams) {
	if (readString(requestParams, "mode") !== "form" || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readString(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readString(requestParams, "message") ?? "") || "Codex plugin approval";
	const descriptionMeta = { ...meta };
	if (!readString(descriptionMeta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY)) descriptionMeta[MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY] = entry.pluginName;
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: descriptionMeta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(readString(requestParams, "serverName"))
		}),
		requestedSchema,
		meta,
		persistHintsMode: "explicit",
		allowedDecisions: buildApprovalAllowedDecisions(requestedSchema, meta)
	};
}
function buildApprovalAllowedDecisions(requestedSchema, meta) {
	return canMapPersistentApproval(requestedSchema, meta) ? [
		"allow-once",
		"allow-always",
		"deny"
	] : ["allow-once", "deny"];
}
function canMapPersistentApproval(requestedSchema, meta) {
	const persistHints = readPersistHints(meta, "explicit");
	if (persistHints.length > 0) return persistHints.includes("always");
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).some(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return false;
		return isPersistField({
			name,
			schema,
			required: false
		}) && chooseAlwaysPersistOptionValue(readEnumOptions(schema)) !== void 0;
	});
}
function declineElicitationResponse() {
	return {
		action: "decline",
		content: null,
		_meta: null
	};
}
function logPluginElicitationDecline(reason, requestParams) {
	log.debug("codex plugin elicitation declined", {
		reason,
		serverName: readString(requestParams, "serverName"),
		mode: readString(requestParams, "mode")
	});
}
function readBridgeableApprovalElicitation(requestParams) {
	if (!requestParams || readString(requestParams, "mode") !== "form" || !isJsonObject(requestParams["_meta"]) || requestParams["_meta"][MCP_TOOL_APPROVAL_KIND_KEY] !== MCP_TOOL_APPROVAL_KIND || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readString(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const title = sanitizeDisplayText(readString(requestParams, "message") ?? "") || "Codex MCP tool approval";
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: requestParams["_meta"],
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(readString(requestParams, "serverName"))
		}),
		requestedSchema,
		meta: requestParams["_meta"]
	};
}
function readComputerUseApprovalElicitation(requestParams, expectedServerName) {
	const serverName = readString(requestParams, "serverName");
	if (!serverName || !expectedServerName || serverName !== expectedServerName || readString(requestParams, "mode") !== "form") return;
	const requestedSchema = isJsonObject(requestParams?.requestedSchema) ? requestParams.requestedSchema : EMPTY_OBJECT_SCHEMA;
	if (readString(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams?.["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readString(requestParams, "message") ?? "") || COMPUTER_USE_APPROVAL_TITLE;
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(serverName)
		}),
		requestedSchema,
		meta
	};
}
function buildApprovalDescription(params) {
	const connectorName = sanitizeOptionalDisplayText(readString(params.meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY));
	const toolTitle = sanitizeOptionalDisplayText(readString(params.meta, MCP_TOOL_APPROVAL_TOOL_TITLE_KEY));
	const toolDescription = sanitizeOptionalDisplayText(readString(params.meta, MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY));
	const summaryLines = [
		connectorName && `App: ${connectorName}`,
		toolTitle && `Tool: ${toolTitle}`,
		params.serverName && `MCP server: ${params.serverName}`,
		toolDescription
	].filter((line) => Boolean(line));
	const paramLines = readDisplayParamLines(params.meta);
	const propertyLines = readPropertyDescriptionLines(params.requestedSchema);
	return [
		params.title,
		summaryLines.join("\n"),
		paramLines.length > 0 ? ["Parameters:", ...paramLines].join("\n") : "",
		propertyLines.length > 0 ? ["Fields:", ...propertyLines].join("\n") : ""
	].filter(Boolean).join("\n\n");
}
function readPropertyDescriptionLines(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).map(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return;
		const propTitle = sanitizeDisplayText(readString(schema, "title") ?? "") || sanitizeDisplayText(name) || "field";
		const description = sanitizeOptionalDisplayText(readString(schema, "description"));
		return description ? `- ${propTitle}: ${description}` : `- ${propTitle}`;
	}).filter((line) => Boolean(line));
}
function readDisplayParamLines(meta) {
	const displayParams = meta[MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY];
	if (!Array.isArray(displayParams)) return [];
	const lines = displayParams.slice(0, MAX_DISPLAY_PARAM_ENTRIES).map((entry) => {
		const param = isJsonObject(entry) ? entry : void 0;
		if (!param) return;
		const name = sanitizeOptionalDisplayText(readString(param, "display_name")) ?? sanitizeOptionalDisplayText(readString(param, "name"));
		if (!name) return;
		return `- ${name}: ${formatDisplayParamValue(param.value)}`;
	}).filter((line) => Boolean(line));
	const remaining = displayParams.length - MAX_DISPLAY_PARAM_ENTRIES;
	return remaining > 0 ? [...lines, `- Additional parameters: ${remaining} more`] : lines;
}
function formatDisplayParamValue(value) {
	return truncateDisplayText(sanitizeDisplayText(typeof value === "string" ? value : formatDisplayJsonValue(value ?? null)), MAX_DISPLAY_PARAM_VALUE_LENGTH);
}
function formatDisplayJsonValue(value, depth = MAX_DISPLAY_VALUE_DEPTH) {
	if (value === null) return "null";
	if (typeof value === "string") return JSON.stringify(truncateDisplayText(sanitizeDisplayText(value), 80));
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) {
		if (depth <= 0) return "[truncated]";
		const parts = [];
		const limit = Math.min(value.length, MAX_DISPLAY_VALUE_ARRAY_ITEMS);
		for (let i = 0; i < limit; i += 1) parts.push(formatDisplayJsonValue(value[i] ?? null, depth - 1));
		if (value.length > MAX_DISPLAY_VALUE_ARRAY_ITEMS) parts.push("...");
		return `[${parts.join(",")}]`;
	}
	if (typeof value === "object") {
		if (depth <= 0) return "{truncated}";
		const parts = [];
		let count = 0;
		let truncated = false;
		for (const key in value) {
			if (!Object.hasOwn(value, key)) continue;
			if (count >= MAX_DISPLAY_VALUE_OBJECT_KEYS) {
				truncated = true;
				break;
			}
			const safeKey = truncateDisplayText(sanitizeDisplayText(key), 80);
			parts.push(`${JSON.stringify(safeKey)}:${formatDisplayJsonValue(value[key] ?? null, depth - 1)}`);
			count += 1;
		}
		if (truncated) parts.push("...");
		return `{${parts.join(",")}}`;
	}
	return "null";
}
function sanitizeOptionalDisplayText(value) {
	return (value === void 0 ? "" : sanitizeDisplayText(value)) || void 0;
}
function sanitizeDisplayText(value) {
	const scanned = value.slice(0, DISPLAY_TEXT_SCAN_MAX_LENGTH);
	const clipped = value.length > DISPLAY_TEXT_SCAN_MAX_LENGTH;
	const sanitized = scanned.replace(ANSI_OSC_SEQUENCE_RE, "").replace(ANSI_CONTROL_SEQUENCE_RE, "").replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE, "").replace(INVISIBLE_FORMATTING_CONTROL_RE, " ").replace(CONTROL_CHARACTER_RE, " ").replace(/\s+/g, " ").trim();
	const escaped = sanitized ? formatCodexDisplayText(sanitized) : "";
	return clipped && escaped ? `${escaped}...` : escaped;
}
function truncateDisplayText(value, maxLength) {
	return value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}
async function requestPluginApprovalOutcome(params) {
	try {
		const requestResult = await requestPluginApproval({
			paramsForRun: params.paramsForRun,
			title: params.title,
			description: params.description,
			severity: "warning",
			toolName: "codex_mcp_tool_approval",
			allowedDecisions: params.allowedDecisions
		});
		const approvalId = requestResult?.id;
		if (!approvalId) return "unavailable";
		return mapExecDecisionToOutcome(approvalRequestExplicitlyUnavailable(requestResult) ? null : await waitForPluginApprovalDecision({
			approvalId,
			signal: params.signal
		}));
	} catch {
		return params.signal?.aborted ? "cancelled" : "denied";
	}
}
function buildElicitationResponse(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	if (outcome === "cancelled") return {
		action: "cancel",
		content: null,
		_meta: null
	};
	if (outcome === "denied" || outcome === "unavailable") return {
		action: "decline",
		content: null,
		_meta: null
	};
	const content = buildAcceptedContent(approvalPrompt, outcome);
	if (!content) {
		if (hasNoSchemaProperties(requestedSchema)) return {
			action: "accept",
			content: null,
			_meta: buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy")
		};
		log.warn("codex MCP approval elicitation approved without a mappable response", {
			approvalKind: meta[MCP_TOOL_APPROVAL_KIND_KEY],
			fields: Object.keys(requestedSchema.properties ?? {}),
			outcome
		});
		return {
			action: "decline",
			content: null,
			_meta: null
		};
	}
	return {
		action: "accept",
		content,
		_meta: buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy")
	};
}
function buildAcceptedContent(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : void 0;
	if (!properties) return;
	const required = Array.isArray(requestedSchema.required) ? new Set(requestedSchema.required.filter((entry) => typeof entry === "string")) : /* @__PURE__ */ new Set();
	const content = {};
	let sawApprovalField = false;
	for (const [name, value] of Object.entries(properties)) {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) continue;
		const property = {
			name,
			schema,
			required: required.has(name)
		};
		const next = readApprovalFieldValue(property, outcome) ?? readPersistFieldValue(property, meta, outcome, approvalPrompt.persistHintsMode ?? "legacy") ?? readFallbackFieldValue(property, outcome);
		if (next === void 0) {
			if (isApprovalField(property)) sawApprovalField = true;
			if (property.required) return;
			continue;
		}
		if (isApprovalField(property)) sawApprovalField = true;
		content[name] = next;
	}
	return sawApprovalField ? content : void 0;
}
function readApprovalFieldValue(property, outcome) {
	if (!isApprovalField(property)) return;
	if (readString(property.schema, "type") === "boolean") return true;
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const sessionChoice = options.find((option) => isSessionApprovalOption(option));
	const acceptChoice = options.find((option) => isPositiveApprovalOption(option));
	if (outcome === "approved-session") return sessionChoice?.value ?? acceptChoice?.value;
	return acceptChoice?.value ?? sessionChoice?.value;
}
function readPersistFieldValue(property, meta, outcome, persistHintsMode) {
	if (!isPersistField(property) || outcome !== "approved-session") return;
	const persistHints = readPersistHints(meta, persistHintsMode);
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const preferred = choosePersistHint(persistHints);
	if (preferred) return options.find((option) => option.value === preferred || option.label === preferred)?.value;
	if (persistHintsMode === "explicit") return chooseAlwaysPersistOptionValue(options);
}
function readDefaultValue(schema) {
	return schema.default;
}
function readFallbackFieldValue(property, outcome) {
	if (outcome === "approved-once" && isPersistField(property)) return;
	return readDefaultValue(property.schema);
}
function isApprovalField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(approve|approval|allow|accept|decision)\b/.test(haystack);
}
function isPersistField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(persist|session|always|scope)\b/.test(haystack);
}
function propertyText(property) {
	return [
		property.name,
		readString(property.schema, "title"),
		readString(property.schema, "description")
	].filter(Boolean).join(" ");
}
function readPersistHints(meta, mode = "legacy") {
	const raw = meta.persist;
	if (typeof raw === "string") return [raw];
	if (Array.isArray(raw)) return raw.filter((entry) => typeof entry === "string");
	return mode === "legacy" ? ["session", "always"] : [];
}
function buildAcceptedMeta(meta, outcome, persistHintsMode) {
	if (outcome !== "approved-session") return null;
	const persist = choosePersistHint(readPersistHints(meta, persistHintsMode));
	return persist ? { persist } : null;
}
function choosePersistHint(persistHints) {
	if (persistHints.includes("always")) return "always";
	if (persistHints.includes("session")) return "session";
}
function chooseAlwaysPersistOptionValue(options) {
	return options.find((option) => optionMatchesPersist(option, "always"))?.value;
}
function optionMatchesPersist(option, persist) {
	return option.value.toLowerCase() === persist || option.label.toLowerCase() === persist;
}
function hasNoSchemaProperties(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.keys(properties).length === 0;
}
function readEnumOptions(schema) {
	if (Array.isArray(schema.enum)) {
		const values = schema.enum.filter((entry) => typeof entry === "string");
		const labels = Array.isArray(schema.enumNames) ? schema.enumNames.filter((entry) => typeof entry === "string") : [];
		return values.map((value, index) => ({
			value,
			label: labels[index] ?? value
		}));
	}
	if (Array.isArray(schema.oneOf)) return schema.oneOf.map((entry) => {
		const option = isJsonObject(entry) ? entry : void 0;
		const value = readString(option, "const");
		if (!value) return;
		return {
			value,
			label: readString(option, "title") ?? value
		};
	}).filter((entry) => Boolean(entry));
	return [];
}
function isPositiveApprovalOption(option) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return /\b(allow|approve|accept|yes|continue|proceed|true)\b/.test(haystack);
}
function isSessionApprovalOption(option) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return /\b(session|always|persistent)\b/.test(haystack) && /\b(allow|approve|accept)\b/.test(haystack);
}
function readString(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readFirstString(record, keys) {
	for (const key of keys) {
		const value = readString(record, key);
		if (value) return value;
	}
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay.ts
/**
* Bridges Codex native hook callbacks into OpenClaw's native hook relay so
* app-server tool events can still run OpenClaw policy and diagnostics.
*/
/** Codex hook events that can be registered through OpenClaw's native relay. */
const CODEX_NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
const CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS = CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS = 30 * 6e4;
/** Extra relay lifetime after the expected turn budget, preventing late hook drops. */
const CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 5 * 6e4;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS = 250;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS = 1e3;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS = 1e4;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS = 5e3;
const pendingCodexNativeHookRelayUnregisters = /* @__PURE__ */ new Set();
/** Defers relay unregister so late native hook subprocesses can still resolve. */
function scheduleCodexNativeHookRelayUnregister(params) {
	let pending;
	const unregister = () => {
		if (!pending) return;
		const current = pending;
		pending = void 0;
		if (!pendingCodexNativeHookRelayUnregisters.delete(current)) return;
		params.relay.unregister();
	};
	const timeout = setTimeout(unregister, resolveCodexNativeHookRelayUnregisterGraceMs(params.hookTimeoutSec));
	pending = {
		timeout,
		unregister
	};
	pendingCodexNativeHookRelayUnregisters.add(pending);
	timeout.unref();
}
/** Computes the delayed unregister window from Codex's hook timeout. */
function resolveCodexNativeHookRelayUnregisterGraceMs(hookTimeoutSec) {
	const hookTimeoutMs = typeof hookTimeoutSec === "number" && Number.isFinite(hookTimeoutSec) && hookTimeoutSec > 0 ? finiteSecondsToTimerSafeMilliseconds(Math.ceil(hookTimeoutSec)) ?? 0 : 0;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS, addTimerTimeoutGraceMs(hookTimeoutMs, CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS) ?? 0);
}
/** Registers an OpenClaw native hook relay for a Codex app-server turn. */
function createCodexNativeHookRelay(params) {
	if (params.options?.enabled === false) return;
	return registerNativeHookRelay({
		provider: "codex",
		relayId: buildCodexNativeHookRelayId({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		}),
		...params.generation ? { generation: params.generation } : {},
		...params.generationMismatchGraceMs ? { generationMismatchGraceMs: params.generationMismatchGraceMs } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.config ? { config: params.config } : {},
		runId: params.runId,
		...params.channelId ? { channelId: params.channelId } : {},
		allowedEvents: params.events,
		ttlMs: resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: params.options?.ttlMs,
			attemptTimeoutMs: params.attemptTimeoutMs,
			startupTimeoutMs: params.startupTimeoutMs,
			turnStartTimeoutMs: params.turnStartTimeoutMs
		}),
		signal: params.signal,
		command: {
			nice: 10,
			timeoutMs: params.options?.gatewayTimeoutMs
		}
	});
}
/** Selects the native hook events Codex should install for the current approval mode. */
function resolveCodexNativeHookRelayEvents(params) {
	if (params.configuredEvents?.length) return params.configuredEvents;
	return params.appServer.approvalPolicy === "never" ? CODEX_NATIVE_HOOK_RELAY_EVENTS : CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
/** Derives the native hook relay TTL from the turn budget unless explicitly configured. */
function resolveCodexNativeHookRelayTtlMs(params) {
	if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
	const relayBudgetMs = params.attemptTimeoutMs + params.startupTimeoutMs + params.turnStartTimeoutMs + CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
/** Builds a stable relay id scoped to the agent and session identity. */
function buildCodexNativeHookRelayId(params) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:native-hook-relay:v1");
	hash.update("\0");
	hash.update(params.agentId?.trim() || "");
	hash.update("\0");
	hash.update(params.sessionKey?.trim() || params.sessionId);
	return `codex-${hash.digest("hex").slice(0, 40)}`;
}
const CODEX_HOOK_EVENT_BY_NATIVE_EVENT = {
	pre_tool_use: "PreToolUse",
	post_tool_use: "PostToolUse",
	permission_request: "PermissionRequest",
	before_agent_finalize: "Stop"
};
const CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT = {
	pre_tool_use: "pre_tool_use",
	post_tool_use: "post_tool_use",
	permission_request: "permission_request",
	before_agent_finalize: "stop"
};
const CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS = ["/<session-flags>/config.toml", "<session-flags>/config.toml"];
/** Builds the Codex config overlay that installs trusted command hooks for relay events. */
function buildCodexNativeHookRelayConfig(params) {
	const events = params.events?.length ? params.events : CODEX_NATIVE_HOOK_RELAY_EVENTS;
	const selectedEvents = new Set(events);
	const config = { "features.hooks": true };
	const hookState = {};
	for (const event of CODEX_NATIVE_HOOK_RELAY_EVENTS) {
		const codexEvent = CODEX_HOOK_EVENT_BY_NATIVE_EVENT[event];
		const selected = selectedEvents.has(event);
		const shouldRelay = params.relay.shouldRelayEvent(event);
		if (!selected || !shouldRelay && !(selected && event === "pre_tool_use" && !shouldRelay)) {
			if (selected || params.clearOmittedEvents) config[`hooks.${codexEvent}`] = [];
			if (params.clearOmittedEvents) for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = { enabled: false };
			continue;
		}
		const timeout = normalizeHookTimeoutSec(params.hookTimeoutSec);
		const command = params.relay.commandForEvent(event, { timeoutMs: resolveCodexNativeHookRelayCommandTimeoutMs(timeout) });
		config[`hooks.${codexEvent}`] = [{ hooks: [{
			type: "command",
			command,
			timeout,
			async: false,
			statusMessage: "OpenClaw native hook relay"
		}] }];
		const state = {
			enabled: true,
			trusted_hash: codexCommandHookTrustedHash({
				event,
				command,
				timeout,
				statusMessage: "OpenClaw native hook relay"
			})
		};
		for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = state;
	}
	config["hooks.state"] = hookState;
	return config;
}
/** Builds a Codex config overlay that disables native hooks and clears hook arrays. */
function buildCodexNativeHookRelayDisabledConfig() {
	return {
		"features.hooks": false,
		"hooks.PreToolUse": [],
		"hooks.PostToolUse": [],
		"hooks.PermissionRequest": [],
		"hooks.Stop": []
	};
}
function normalizeHookTimeoutSec(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.ceil(value) : 5;
}
function resolveCodexNativeHookRelayCommandTimeoutMs(hookTimeoutSec) {
	const parentTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 5e3;
	const parentMarginMs = Math.min(CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS, Math.max(CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS, Math.floor(parentTimeoutMs / 5)));
	return Math.max(1, parentTimeoutMs - parentMarginMs);
}
function codexCommandHookTrustedHash(params) {
	const identity = {
		event_name: CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[params.event],
		hooks: [{
			async: false,
			command: params.command,
			statusMessage: params.statusMessage,
			timeout: params.timeout,
			type: "command"
		}]
	};
	return `sha256:${createHash("sha256").update(JSON.stringify(sortJsonValue(identity))).digest("hex")}`;
}
function sortJsonValue(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(sortJsonValue);
	const sorted = {};
	for (const key of Object.keys(value).toSorted()) sorted[key] = sortJsonValue(value[key]);
	return sorted;
}
//#endregion
//#region extensions/codex/src/app-server/provider-capabilities.ts
async function readConfiguredProviderWebSearchSupport(params) {
	return (await params.client.request("modelProvider/capabilities/read", {}, {
		timeoutMs: params.timeoutMs,
		signal: params.signal
	})).webSearch ? "supported" : "unsupported";
}
async function resolveCodexProviderWebSearchSupportForClient(params) {
	const modelProviderOverride = params.modelProviderOverride?.trim().toLowerCase();
	if (modelProviderOverride === "openai") return "supported";
	if (modelProviderOverride) return "unsupported";
	try {
		return await readConfiguredProviderWebSearchSupport(params);
	} catch {
		return "unknown";
	}
}
async function resolveCodexProviderWebSearchSupport(params) {
	let client;
	try {
		client = await params.clientFactory(params.appServer.start, params.authProfileId, params.agentDir, params.config, { timeoutMs: params.appServer.requestTimeoutMs });
		return await resolveCodexProviderWebSearchSupportForClient({
			client,
			timeoutMs: params.appServer.requestTimeoutMs,
			modelProviderOverride: params.modelProviderOverride,
			signal: params.signal
		});
	} catch {
		return "unknown";
	} finally {
		if (client) releaseLeasedSharedCodexAppServerClient(client);
	}
}
//#endregion
export { CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS as A, resolveCodexMessageToolProvider as C, shouldWarnCodexDynamicToolBuildStageSummary as D, shouldRequireCodexSandboxExecServerEnvironment as E, resolveCodexTurnTerminalIdleTimeoutMs as F, withCodexStartupTimeout as I, resolveCodexStartupTimeoutMs as M, resolveCodexTurnAssistantCompletionIdleTimeoutMs as N, filterToolsForVisionInputs as O, resolveCodexTurnCompletionIdleTimeoutMs as P, resolveCodexExternalSandboxPolicyForOpenClawSandbox as S, shouldEnableCodexAppServerNativeToolSurface as T, createCodexDynamicToolBuildStageTracker as _, buildCodexNativeHookRelayConfig as a, resolveCodexAppServerExecutionCwd as b, resolveCodexNativeHookRelayEvents as c, handleCodexAppServerElicitationRequest as d, createCodexDynamicToolBridge as f, buildDynamicTools as g, emitDynamicToolTerminalDiagnostic as h, CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS as i, resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs as j, handleCodexAppServerApprovalRequest as k, resolveCodexNativeHookRelayTtlMs as l, emitDynamicToolStartedDiagnostic as m, resolveCodexProviderWebSearchSupportForClient as n, buildCodexNativeHookRelayDisabledConfig as o, emitDynamicToolErrorDiagnostic as p, CODEX_NATIVE_HOOK_RELAY_EVENTS as r, createCodexNativeHookRelay as s, resolveCodexProviderWebSearchSupport as t, scheduleCodexNativeHookRelayUnregister as u, disableCodexPluginThreadConfig as v, resolveCodexSandboxEnvironmentSelection as w, resolveCodexAppServerHookChannelId as x, formatCodexDynamicToolBuildStageSummary as y };
