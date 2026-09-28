import "./src-CZ2wJvNB.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES } from "./worker-admission-BB3C4gz4.mjs";
import { s as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES } from "./worker-protocol-primitives-vA8IesMt.mjs";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-DpEbBPqt.mjs";
import { t as isWorkerTranscriptFrameWithinBudget } from "./worker-transcript-budget-D99fl0AU.mjs";
//#region src/worker/assistant-message-projection.ts
function projectWorkerAssistantContent(part) {
	if (part.type === "text") return {
		type: "text",
		text: part.text,
		...part.textSignature ? { textSignature: part.textSignature } : {}
	};
	if (part.type === "thinking") return {
		type: "thinking",
		thinking: part.thinking,
		...part.thinkingSignature ? { thinkingSignature: part.thinkingSignature } : {},
		...part.redacted !== void 0 ? { redacted: part.redacted } : {}
	};
	return {
		type: "toolCall",
		id: part.id,
		name: part.name,
		arguments: structuredClone(part.arguments),
		...part.thoughtSignature ? { thoughtSignature: part.thoughtSignature } : {},
		...part.executionMode ? { executionMode: part.executionMode } : {}
	};
}
function projectWorkerTokenUsage(usage) {
	return {
		input: usage.input,
		output: usage.output,
		cacheRead: usage.cacheRead,
		cacheWrite: usage.cacheWrite,
		totalTokens: usage.totalTokens,
		cost: {
			input: usage.cost.input,
			output: usage.cost.output,
			cacheRead: usage.cost.cacheRead,
			cacheWrite: usage.cost.cacheWrite,
			total: usage.cost.total,
			...usage.cost.totalOrigin ? { totalOrigin: usage.cost.totalOrigin } : {}
		}
	};
}
//#endregion
//#region src/worker/transcript-message.ts
const SIZE_FRAME_ID = "00000000-0000-4000-8000-000000000000";
const WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE = "Cloud worker could not preserve authoritative provider replay. Stop or reclaim the cloud worker, then retry locally.";
function cloneTextContent(part) {
	return {
		type: "text",
		text: part.text,
		...part.textSignature ? { textSignature: part.textSignature } : {}
	};
}
function cloneImageContent(part) {
	return {
		type: "image",
		data: part.data,
		mimeType: part.mimeType
	};
}
function providerReplayUnavailable(details) {
	return {
		kind: "provider-replay-unavailable",
		details
	};
}
function cloneProviderReplay(state) {
	return {
		v: state.v,
		type: state.type,
		...state.id === void 0 ? {} : { id: state.id },
		data: state.data,
		...state.replayIndex === void 0 ? {} : { replayIndex: state.replayIndex },
		provider: state.provider,
		api: state.api,
		model: state.model,
		...state.baseUrlHash === void 0 ? {} : { baseUrlHash: state.baseUrlHash },
		...state.sessionHash === void 0 ? {} : { sessionHash: state.sessionHash },
		...state.authProfileHash === void 0 ? {} : { authProfileHash: state.authProfileHash }
	};
}
function redactWorkerDiagnosticText(value) {
	const redacted = redactAgentDiagnosticPayload(value);
	return typeof redacted === "string" ? redacted : "[unreadable diagnostic text]";
}
function projectWorkerDiagnostic(diagnostic) {
	const details = asOptionalRecord(redactAgentDiagnosticPayload(diagnostic.details));
	const error = diagnostic.error;
	return {
		type: diagnostic.type,
		timestamp: diagnostic.timestamp,
		...error ? { error: {
			message: redactWorkerDiagnosticText(error.message),
			...error.name ? { name: redactWorkerDiagnosticText(error.name) } : {},
			...error.stack ? { stack: redactWorkerDiagnosticText(error.stack) } : {},
			...error.code === void 0 ? {} : { code: error.code }
		} } : {},
		...details ? { details } : {}
	};
}
function workerTranscriptMessageFrame(message) {
	return {
		type: "req",
		id: SIZE_FRAME_ID,
		method: "worker.transcript.commit",
		params: {
			runEpoch: Number.MAX_SAFE_INTEGER,
			seq: Number.MAX_SAFE_INTEGER,
			baseLeafId: "x".repeat(256),
			messages: [message]
		}
	};
}
function workerTranscriptMessageFrameBytes(message) {
	try {
		return Buffer.byteLength(JSON.stringify(workerTranscriptMessageFrame(message)), "utf8");
	} catch {
		return;
	}
}
function projectWorkerProviderReplay(params) {
	if (!params.providerReplay) return {
		kind: "complete",
		message: params.message
	};
	const dataBytes = Buffer.byteLength(params.providerReplay.data, "utf8");
	if (dataBytes > WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES) return providerReplayUnavailable({
		bytes: dataBytes,
		limitBytes: WORKER_PROVIDER_REPLAY_MAX_DATA_BYTES,
		reason: "provider-replay-data-budget"
	});
	const candidate = {
		...params.message,
		providerReplay: cloneProviderReplay(params.providerReplay)
	};
	if (params.purpose === "inference") return {
		kind: "complete",
		message: candidate
	};
	const frameBytes = workerTranscriptMessageFrameBytes(candidate);
	if (frameBytes === void 0 || frameBytes > 65536) return providerReplayUnavailable({
		bytes: frameBytes ?? 65537,
		limitBytes: WORKER_PROTOCOL_MAX_PAYLOAD_BYTES,
		reason: "transcript-commit-frame-budget"
	});
	return {
		kind: "complete",
		message: candidate
	};
}
function toWorkerAssistantMessage(message) {
	return {
		role: "assistant",
		content: message.content.map(projectWorkerAssistantContent),
		api: message.api,
		provider: message.provider,
		model: message.model,
		...message.responseModel ? { responseModel: message.responseModel } : {},
		...message.responseId ? { responseId: message.responseId } : {},
		...message.diagnostics ? { diagnostics: message.diagnostics.map(projectWorkerDiagnostic) } : {},
		usage: {
			...projectWorkerTokenUsage(message.usage),
			...message.usage.contextUsage ? { contextUsage: structuredClone(message.usage.contextUsage) } : {}
		},
		stopReason: message.stopReason,
		...message.errorMessage ? { errorMessage: redactWorkerDiagnosticText(message.errorMessage) } : {},
		...message.errorCode ? { errorCode: message.errorCode } : {},
		...message.errorType ? { errorType: message.errorType } : {},
		...message.errorBody ? { errorBody: redactWorkerDiagnosticText(message.errorBody) } : {},
		timestamp: message.timestamp
	};
}
function toWorkerTranscriptMessage(message, purpose) {
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? [{
				type: "text",
				text: message.content
			}] : message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			timestamp: message.timestamp
		}
	};
	if (message.role === "assistant") return projectWorkerProviderReplay({
		message: toWorkerAssistantMessage(message),
		providerReplay: message.providerReplay,
		purpose
	});
	if (message.role === "toolResult") return {
		kind: "complete",
		message: {
			role: "toolResult",
			toolCallId: message.toolCallId,
			toolName: message.toolName,
			content: message.content.map((part) => part.type === "text" ? cloneTextContent(part) : cloneImageContent(part)),
			...message.details === void 0 ? {} : { details: redactAgentDiagnosticPayload(message.details) },
			isError: message.isError,
			timestamp: message.timestamp
		}
	};
}
function isWorkerTranscriptMessageFrameSafe(message) {
	return isWorkerTranscriptFrameWithinBudget(workerTranscriptMessageFrame(message));
}
//#endregion
export { projectWorkerProviderReplay as a, projectWorkerTokenUsage as c, isWorkerTranscriptMessageFrameSafe as i, cloneImageContent as n, toWorkerTranscriptMessage as o, cloneTextContent as r, projectWorkerAssistantContent as s, WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE as t };
