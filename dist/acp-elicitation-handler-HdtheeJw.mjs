import { a as isStructuredInputRecord, i as compileStructuredInputUrl, n as compileStructuredInputForm, o as snapshotStructuredInput, t as runStructuredInput } from "./structured-input-execution-CggZ-iAA.mjs";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/acp-elicitation.ts
const MAX_CORRELATION_TEXT = 128;
/** Adapts ACP wire scope and codex-acp metadata into the shared structured-input compiler. */
function parseAcpElicitationRequest(request) {
	const snapshot = snapshotStructuredInput(request);
	if (!isStructuredInputRecord(snapshot)) return unsupported("OpenClaw declined a malformed or over-limit ACP input request.");
	const correlation = readScope(snapshot);
	if (typeof correlation === "string") return unsupported(correlation);
	const mode = readAcpElicitationString(snapshot, "mode");
	if (mode === "url") return {
		correlation,
		input: compileStructuredInputUrl({
			url: readValue(snapshot, "url"),
			elicitationId: readValue(snapshot, "elicitationId"),
			message: readValue(snapshot, "message"),
			fallbackMessage: "ACP provided a URL",
			protocolName: "ACP"
		})
	};
	if (mode !== "form") return unsupported(`OpenClaw does not support ACP elicitation mode ${JSON.stringify(mode ?? "unknown")}.`);
	return {
		correlation,
		input: compileStructuredInputForm({
			schema: readValue(snapshot, "requestedSchema"),
			message: readAcpElicitationString(snapshot, "message"),
			fallbackMessage: "ACP needs input",
			options: {
				protocolName: "ACP",
				allowEmptyForm: true,
				minimumChoiceCount: 2,
				booleanLabels: ["True", "False"],
				metadata: {
					secretPath: [
						"_meta",
						"codex",
						"isSecret"
					],
					otherAnswerPath: [
						"_meta",
						"codex",
						"isOtherAnswer"
					],
					otherQuestionIdPath: [
						"_meta",
						"codex",
						"questionId"
					]
				}
			}
		})
	};
}
function readScope(request) {
	const sessionId = readValue(request, "sessionId");
	const requestId = readValue(request, "requestId");
	const hasSession = sessionId !== void 0;
	if (hasSession === (requestId !== void 0)) return "OpenClaw declined an ACP input request with an invalid or ambiguous scope.";
	if (hasSession) {
		const normalizedSessionId = readCorrelationText(sessionId);
		if (!normalizedSessionId) return "OpenClaw declined an ACP input request with an invalid session id.";
		const toolCallId = readValue(request, "toolCallId");
		const normalizedToolCallId = toolCallId === void 0 || toolCallId === null ? toolCallId : readCorrelationText(toolCallId);
		if (toolCallId !== void 0 && toolCallId !== null && !normalizedToolCallId) return "OpenClaw declined an ACP input request with an invalid tool-call id.";
		return {
			sessionId: normalizedSessionId,
			...toolCallId === void 0 ? {} : { toolCallId: normalizedToolCallId ?? null }
		};
	}
	if (requestId === null) return { requestId };
	if (typeof requestId === "number") return { requestId };
	const normalizedRequestId = readCorrelationText(requestId);
	return normalizedRequestId ? { requestId: normalizedRequestId } : "OpenClaw declined an ACP input request with an invalid request scope.";
}
function readCorrelationText(value) {
	if (typeof value !== "string" || value.length === 0 || value.length > MAX_CORRELATION_TEXT) return;
	for (const character of value) {
		const codePoint = character.codePointAt(0) ?? 0;
		if (codePoint <= 31 || codePoint >= 127 && codePoint <= 159) return;
	}
	return value;
}
function readValue(record, key) {
	return Object.hasOwn(record, key) ? record[key] : void 0;
}
function readAcpElicitationString(record, key) {
	const value = readValue(record, key);
	return typeof value === "string" ? value : void 0;
}
function unsupported(message) {
	return { input: {
		kind: "unsupported",
		message
	} };
}
//#endregion
//#region src/auto-reply/reply/acp-elicitation-handler.ts
const DEFAULT_ELICITATION_TIMEOUT_MS = 9e5;
const MAX_REQUEST_ID_TEXT = 128;
function questionId(params) {
	return `acp_${createHash("sha256").update(JSON.stringify(params)).digest("hex").slice(0, 24)}_${params.batch}`;
}
function cancellation(message) {
	return {
		action: "cancel",
		_meta: { message }
	};
}
function decline(message) {
	return {
		action: "decline",
		...message ? { _meta: { message } } : {}
	};
}
function isContextRequestIdValid(value) {
	return value === null || typeof value === "number" && Number.isFinite(value) || typeof value === "string" && value.length > 0 && value.length <= MAX_REQUEST_ID_TEXT;
}
/** Creates the turn-owned ACP form/URL bridge used by channel delivery. */
function createAcpElicitationHandler(params) {
	const delivery = { onBlockReply: async (payload) => {
		await params.delivery.deliver("block", payload);
	} };
	return async (request, context) => {
		if (!isContextRequestIdValid(context.requestId) || context.signal.aborted || !params.isActive()) return cancellation("ACP input request is no longer active.");
		const parsed = parseAcpElicitationRequest(request);
		const result = await runStructuredInput({
			input: parsed.input,
			sessionKey: params.targetSessionKey,
			agentId: params.agentId,
			runId: params.runId,
			timeoutMs: DEFAULT_ELICITATION_TIMEOUT_MS,
			delivery,
			signal: context.signal,
			isActive: params.isActive,
			questionId: (batch) => questionId({
				contextRequestId: context.requestId,
				correlation: parsed.correlation,
				sourceSessionKey: params.sourceSessionKey,
				targetSessionKey: params.targetSessionKey,
				outerRequestId: params.outerRequestId,
				batch
			}),
			promptOptions: {
				unsupportedIntro: "ACP input request could not be shown:",
				urlIntro: "ACP needs confirmation:"
			}
		});
		if (result.status === "answered") return parsed.input.kind === "ready" && parsed.input.plan.kind === "url" ? { action: "accept" } : {
			action: "accept",
			content: result.content
		};
		if (result.status === "declined") return decline(result.message);
		if (result.status === "unsupported") return decline(result.message);
		return cancellation(result.message ?? "ACP input request was cancelled.");
	};
}
//#endregion
export { createAcpElicitationHandler };
