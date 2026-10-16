import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import "./code-mode-control-tools-CpOmDfxq.mjs";
import { f as isMainSessionRestartRecoveryInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as AGENT_RUN_RESTART_ABORT_ERROR, r as AGENT_RUN_RESTART_ABORT_ERROR_CODE } from "./run-termination-DGv2EKii.mjs";
import { n as getTranscriptMessageRole, o as isIntermediateAssistantTranscriptMessage, s as isMeaningfulTranscriptMessage, u as readTerminalSourceReplyDeliveryMirror } from "./message-visibility-D9way_Lv.mjs";
import { r as isAgentToolReplaySafe } from "./tool-replay-safety-QHsbda6j.mjs";
//#region src/agents/main-session-recovery/main-session-restart-recovery-resume-policy.ts
function readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId) {
	if (!expectedSourceTurnId) return;
	for (const message of messages.toReversed()) {
		if (getTranscriptMessageRole(message) !== "assistant") continue;
		const mirror = readTerminalSourceReplyDeliveryMirror(message);
		if (mirror?.sourceTurnId === expectedSourceTurnId) return mirror.toolCallId;
	}
}
function readCodeModeWaitCall(message) {
	const record = asOptionalObjectRecord(message);
	if (getTranscriptMessageRole(message) !== "assistant" || record?.stopReason !== "toolUse") return;
	const content = record.content;
	if (!Array.isArray(content)) return;
	const supportedTypes = /* @__PURE__ */ new Set([
		"text",
		"thinking",
		"toolCall",
		"toolUse",
		"tool_use"
	]);
	if (content.some((block) => !block || typeof block !== "object" || !supportedTypes.has(String(block.type)) || block.type === "text" && Boolean(normalizeOptionalString(block.text)))) return;
	const toolCalls = content.filter((block) => {
		const type = block.type;
		return type === "toolCall" || type === "toolUse" || type === "tool_use";
	});
	if (toolCalls.length !== 1) return;
	const block = toolCalls[0];
	if (normalizeOptionalString(block.name) !== "wait") return;
	const args = asOptionalObjectRecord(block.arguments ?? block.input);
	const runId = normalizeOptionalString(args?.runId);
	if (!runId) return;
	const toolCallId = normalizeOptionalString(block.id);
	return {
		runId,
		...toolCallId ? { toolCallId } : {}
	};
}
function isResumableTailMessage(message) {
	const role = getTranscriptMessageRole(message);
	return role === "user" || role === "tool" || role === "toolResult";
}
function readPendingAssistantContent(message) {
	const record = asOptionalObjectRecord(message);
	return getTranscriptMessageRole(message) === "assistant" && normalizeOptionalString(record?.stopReason) === "toolUse" && Array.isArray(record?.content) ? record.content : void 0;
}
function isPendingAssistantToolCall(message) {
	const content = readPendingAssistantContent(message);
	if (!content) return false;
	let hasToolCall = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const type = normalizeOptionalString(block.type);
		if (type === "toolCall" || type === "toolUse" || type === "tool_use") {
			hasToolCall = true;
			continue;
		}
		if (type === "thinking") continue;
		if (type === "text" && !normalizeOptionalString(block.text)) continue;
		return false;
	}
	return hasToolCall;
}
function classifyDanglingToolCalls(content) {
	if (!Array.isArray(content)) return;
	let allReplaySafe = true;
	let hasToolCall = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return;
		const type = normalizeOptionalString(block.type);
		if (type !== "toolCall" && type !== "toolUse" && type !== "tool_use") continue;
		const name = normalizeOptionalString(block.name);
		if (name === "exec" || name === "wait") return { kind: "code-mode" };
		if (!isAgentToolReplaySafe({ name })) allReplaySafe = false;
		hasToolCall = true;
	}
	return hasToolCall ? {
		kind: "resumable",
		forceRestartSafeTools: !allReplaySafe
	} : { kind: "none" };
}
function readCodeModeCheckpoint(message) {
	const record = asOptionalObjectRecord(message);
	const role = getTranscriptMessageRole(message);
	if (!record || role !== "tool" && role !== "toolResult") return;
	const toolName = normalizeOptionalString(record.toolName);
	if (toolName !== "exec" && toolName !== "wait") return;
	const content = record.content;
	if (!Array.isArray(content)) return;
	const textBlock = content.find((block) => block && typeof block === "object" && block.type === "text");
	const text = normalizeOptionalString(textBlock?.text);
	if (!text) return;
	try {
		const result = JSON.parse(text);
		if (result.status === "completed" || result.status === "failed") return { replaySafe: result.replaySafe === true };
		const runId = normalizeOptionalString(result.runId);
		return result.status === "waiting" && runId ? {
			replaySafe: result.replaySafe === true,
			runId
		} : void 0;
	} catch {
		return;
	}
}
function hasReplaySafeCodeModeCheckpointInCurrentTurn(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (getTranscriptMessageRole(message) === "user" && !isMainSessionRestartRecoveryInputProvenance(asOptionalRecord(message)?.provenance)) return false;
		if (readCodeModeCheckpoint(message)?.replaySafe === true) return true;
	}
	return false;
}
const LEGACY_RESTART_ABORT_ERROR_MESSAGES = /* @__PURE__ */ new Set([
	"Request was aborted",
	"This operation was aborted",
	AGENT_RUN_RESTART_ABORT_ERROR
]);
const CODE_MODE_RESTART_ABORT_ERROR = "code mode execution aborted";
function isRestartAbortAssistantMessage(message) {
	const record = asOptionalObjectRecord(message);
	if (!record || getTranscriptMessageRole(message) !== "assistant") return false;
	const stopReason = normalizeOptionalString(record.stopReason);
	if (stopReason === "aborted") return true;
	if (stopReason !== "error") return false;
	const errorCode = normalizeOptionalString(record.errorCode);
	if (errorCode !== void 0) return errorCode === AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	const errorMessage = normalizeOptionalString(record.errorMessage);
	return errorMessage !== void 0 && LEGACY_RESTART_ABORT_ERROR_MESSAGES.has(errorMessage);
}
function isRestartAbortTailArtifact(message) {
	if (!isRestartAbortAssistantMessage(message)) return false;
	const content = message.content;
	return Array.isArray(content) && content.length === 0;
}
function isRestartAbortedWaitFailure(message) {
	const record = asOptionalObjectRecord(message);
	if (!record || getTranscriptMessageRole(message) !== "toolResult") return false;
	if (normalizeOptionalString(record.toolName) !== "wait" || record.isError !== true) return false;
	const details = asOptionalObjectRecord(record.details);
	if (details?.status !== "failed") return false;
	const content = record.content;
	const contentText = Array.isArray(content) ? content.filter((block) => block && typeof block === "object" && block.type === "text").map((block) => normalizeOptionalString(block.text) ?? "").join("\n") : "";
	const errorText = normalizeOptionalString(details.error) ?? normalizeOptionalString(contentText);
	const code = normalizeOptionalString(details.code);
	if (code === "aborted") return errorText === CODE_MODE_RESTART_ABORT_ERROR;
	if (code !== "internal_error") return false;
	return /^(?:(?:Abort)?Error:\s*)?(?:The|This) operation was aborted\.?$/u.test(errorText ?? "");
}
function isRestartAbortedWaitResultArtifact(message, waitMessage) {
	if (!isRestartAbortedWaitFailure(message)) return false;
	const toolCallId = normalizeOptionalString(message.toolCallId);
	const waitCall = readCodeModeWaitCall(waitMessage);
	return Boolean(toolCallId && waitCall?.toolCallId === toolCallId);
}
function requiresRestartSafeToolResult(message) {
	const record = asOptionalObjectRecord(message);
	if (!record || getTranscriptMessageRole(message) !== "toolResult") return false;
	const details = asOptionalObjectRecord(record.details);
	return details?.reason === "missing_tool_result" || details?.status === "approval-pending";
}
function resolveMainSessionResumePolicy(messages, forceRestartSafeTools = false, expectedSourceTurnId, beforeAgentReplyState, deliveryReceiptState, deliveryToolCallId, fullAccess = false) {
	const mirroredToolCallId = readDeliveredTerminalSourceReplyToolCallId(messages, expectedSourceTurnId);
	if (mirroredToolCallId) return {
		action: "complete",
		reason: "delivered-terminal",
		toolCallId: mirroredToolCallId
	};
	if (deliveryReceiptState === "delivered-terminal") return deliveryToolCallId ? {
		action: "complete",
		reason: "delivered-terminal-receipt",
		toolCallId: deliveryToolCallId
	} : {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (deliveryReceiptState === "terminal-pending") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (beforeAgentReplyState === "handled-silent") return {
		action: "complete",
		reason: "handled-silent"
	};
	if (beforeAgentReplyState === "pending" || beforeAgentReplyState === "handled-reply" || beforeAgentReplyState === "handled-unrecoverable") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (fullAccess && !hasReplaySafeCodeModeCheckpointInCurrentTurn(messages)) return {
		action: "resume",
		forceRestartSafeTools: false
	};
	const meaningfulMessages = messages.toReversed().filter((message) => isMeaningfulTranscriptMessage(message) && !isIntermediateAssistantTranscriptMessage(message));
	if (isRestartAbortAssistantMessage(meaningfulMessages[0])) {
		const dangling = classifyDanglingToolCalls(meaningfulMessages[0].content);
		if (dangling?.kind === "resumable") return {
			action: "resume",
			forceRestartSafeTools: dangling.forceRestartSafeTools
		};
		if (dangling?.kind === "none") meaningfulMessages.shift();
	}
	if (isRestartAbortedWaitResultArtifact(meaningfulMessages[0], meaningfulMessages[1])) meaningfulMessages.shift();
	const lastMeaningful = meaningfulMessages[0];
	if (forceRestartSafeTools && isPendingAssistantToolCall(lastMeaningful) || isRestartAbortedWaitFailure(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: true
	};
	const waitCall = readCodeModeWaitCall(lastMeaningful);
	const checkpoint = readCodeModeCheckpoint(meaningfulMessages[waitCall ? 1 : 0]);
	if (waitCall || checkpoint) return checkpoint?.replaySafe === true && (!waitCall || checkpoint.runId === waitCall.runId) ? {
		action: "resume",
		forceRestartSafeTools: true,
		forceCodeModeTools: true
	} : {
		action: "resume",
		forceRestartSafeTools: true
	};
	const pendingToolCallTail = classifyDanglingToolCalls(readPendingAssistantContent(lastMeaningful));
	if (pendingToolCallTail?.kind === "resumable") return {
		action: "resume",
		forceRestartSafeTools: pendingToolCallTail.forceRestartSafeTools
	};
	if ((lastMeaningful && typeof lastMeaningful === "object" ? classifyDanglingToolCalls(lastMeaningful.content) : void 0)?.kind === "code-mode") return {
		action: "resume",
		forceRestartSafeTools: true
	};
	if (!lastMeaningful || !isResumableTailMessage(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: false
	};
	if (requiresRestartSafeToolResult(lastMeaningful)) return {
		action: "resume",
		forceRestartSafeTools: true
	};
	const forceCodeModeTools = hasReplaySafeCodeModeCheckpointInCurrentTurn(messages);
	return {
		action: "resume",
		forceRestartSafeTools: forceCodeModeTools,
		...forceCodeModeTools ? { forceCodeModeTools: true } : {}
	};
}
//#endregion
export { isRestartAbortTailArtifact as n, resolveMainSessionResumePolicy as r, hasReplaySafeCodeModeCheckpointInCurrentTurn as t };
