import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { r as appendSessionTranscriptMessageByIdentityStrict } from "./session-transcript-runtime-tIU02hJq.mjs";
import { i as createAgentHarnessToolResultMessage, r as createAgentHarnessToolCallMessage } from "./agent-harness-attempt-runtime-CuLbs8yz.mjs";
import { i as agentsApiNativeToolOutput, n as agentsApiNativeToolDetails, r as agentsApiNativeToolOutcome, t as agentsApiNativeTool } from "./agentsapi-native-items-BguXUanQ.mjs";
import { t as requireAgentsApiSessionTarget } from "./agentsapi-target-ClP2ww2I.mjs";
//#region extensions/agentsapi/agentsapi-transcript.ts
/** Canonical native facts use the same durable identities during live and historical repair. */
async function recordAgentsApiNativeToolTranscript(params, sessionId, turnId, item, assertCurrent, nextTimestamp, options = {}) {
	assertCurrent();
	const tool = agentsApiNativeTool(item, params);
	if (!tool || ![
		"completed",
		"failed",
		"incomplete"
	].includes(item.status ?? "")) return false;
	const id = `agentsapi:${sessionId}:${turnId}:${item.id}`;
	const outcome = agentsApiNativeToolOutcome(item, options.enclosingStatus);
	const output = agentsApiNativeToolOutput(item, options.capturedOutput);
	const details = agentsApiNativeToolDetails(sessionId, turnId, item, outcome, options.capturedOutput);
	const text = output ?? (item.type === "web_search_call" ? `Web search ${outcome.status}; native search results are unavailable.` : outcome.error ?? `${tool.name} ${outcome.status}`);
	await recordAgentsApiNativeToolInvocation(params, sessionId, turnId, item, assertCurrent, nextTimestamp);
	await appendAgentsApiTranscriptMessage(params, {
		...createAgentHarnessToolResultMessage({
			id,
			name: tool.name,
			text,
			isError: outcome.isError,
			details
		}, nextTimestamp()),
		__openclaw: {
			toolOutput: {
				source: "execution",
				modelInput: "unverified",
				...outcome.outcomeUnknown ? { outcome: "unknown" } : {},
				...options.captureTruncated ? { captureTruncated: true } : {}
			},
			...item.type === "web_search_call" ? { resultContentSource: "network" } : {}
		},
		idempotencyKey: `${id}:result`
	}, assertCurrent);
	return true;
}
/** Canonical invocation facts can precede completion of the native tool. */
async function recordAgentsApiNativeToolInvocation(params, sessionId, turnId, item, assertCurrent, nextTimestamp) {
	assertCurrent();
	const tool = agentsApiNativeTool(item, params);
	if (!tool || !canRecordAgentsApiNativeToolInvocation(item)) return false;
	const id = `agentsapi:${sessionId}:${turnId}:${item.id}`;
	await appendAgentsApiTranscriptMessage(params, {
		...createAgentHarnessToolCallMessage({
			api: "openai-agents",
			provider: "openai",
			modelId: params.model.id
		}, {
			id,
			name: tool.name,
			arguments: tool.args
		}, nextTimestamp()),
		idempotencyKey: `${id}:call`
	}, assertCurrent);
	return true;
}
/** Persist host tool evidence before its result is acknowledged by the native session. */
async function recordAgentsApiToolTranscript(params, call, result, isError, assertCurrent) {
	const identity = `agentsapi:tool:${call.turn_id}:${call.call_id}`;
	const attribution = {
		api: "openai-agents",
		provider: "openai",
		modelId: params.model.id
	};
	const toolCall = {
		...createAgentHarnessToolCallMessage(attribution, {
			id: call.call_id,
			name: call.name,
			arguments: asOptionalRecord(call.arguments) ?? {}
		}, Date.now()),
		idempotencyKey: `${identity}:call`
	};
	const toolResult = {
		...createAgentHarnessToolResultMessage({
			id: call.call_id,
			name: call.name,
			content: result.content,
			details: result.details,
			isError
		}, Date.now()),
		idempotencyKey: `${identity}:result`
	};
	await appendAgentsApiTranscriptMessage(params, toolCall, assertCurrent);
	await appendAgentsApiTranscriptMessage(params, toolResult, assertCurrent);
}
async function appendAgentsApiTranscriptMessage(params, message, assertCurrent) {
	assertCurrent();
	const append = await appendSessionTranscriptMessageByIdentityStrict({
		...requireAgentsApiSessionTarget(params),
		config: params.config,
		message,
		prepareMessageAfterIdempotencyCheck: (prepared) => {
			assertCurrent();
			return prepared;
		}
	});
	assertCurrent();
	if (append.kind !== "result") throw new Error("Agents API transcript append was refused");
	return append.result.message;
}
/** Walk the retrieved native prefix without another transcript queue or cursor. */
function* iterateAgentsApiTranscriptItems(turnId, items, enclosingStatus, terminalTurn, recordedGatewayCallIds, hasObservedCompletion) {
	let transcriptReady = true;
	let deferredFinalSeen = false;
	for (const item of items) {
		if (item.turn_id && item.turn_id !== turnId) throw new Error("Agents API saved item belongs to a different turn");
		const completionObserved = hasObservedCompletion(item.id);
		const terminal = terminalTurn || [
			"completed",
			"failed",
			"incomplete"
		].includes(item.status ?? "") || item.status == null && completionObserved;
		if (transcriptReady && (deferredFinalSeen && hasAgentsApiTranscriptRecord(item) || !canRecordAgentsApiTranscriptItem(turnId, item, enclosingStatus, recordedGatewayCallIds, completionObserved))) transcriptReady = false;
		deferredFinalSeen ||= isAgentsApiDeferredFinalText(item);
		yield {
			item,
			terminal,
			transcriptReady
		};
	}
}
/** Nonterminal calls require retrieved invocation fields, rather than streamed guesses. */
function canRecordAgentsApiNativeToolInvocation(item) {
	if ([
		"completed",
		"failed",
		"incomplete"
	].includes(item.status ?? "")) return [
		"command_execution",
		"mcp_call",
		"web_search_call"
	].includes(item.type);
	if (item.type === "command_execution") return typeof item.command === "string" && (item.cwd === null || typeof item.cwd === "string");
	return false;
}
/** Backend publication stops before invocation or text facts that are still incomplete. */
function canRecordAgentsApiTranscriptItem(turnId, item, enclosingStatus, recordedGatewayCallIds, completionObserved = false) {
	if ([
		"command_execution",
		"mcp_call",
		"web_search_call"
	].includes(item.type)) return canRecordAgentsApiNativeToolInvocation(item);
	if (item.type === "function_call") return typeof item.call_id === "string" && recordedGatewayCallIds.has(`${turnId}:${item.call_id}`);
	if (item.type === "reasoning" || item.type === "message" && item.role === "assistant" && item.phase === "commentary") return canRecordAgentsApiTranscriptText(item, enclosingStatus, completionObserved);
	return true;
}
function canRecordAgentsApiTranscriptText(item, enclosingStatus, completionObserved = false) {
	if ([
		"completed",
		"failed",
		"incomplete"
	].includes(item.status ?? "")) return true;
	return item.status == null && (completionObserved || item.type === "reasoning" && enclosingStatus === "completed");
}
function isAgentsApiDeferredFinalText(item) {
	return item.type === "message" && item.role === "assistant" && item.phase !== "commentary" && item.status === "completed" && Boolean(item.content?.some((part) => part.type === "output_text" && part.text));
}
function hasAgentsApiTranscriptRecord(item) {
	return [
		"command_execution",
		"mcp_call",
		"web_search_call",
		"function_call"
	].includes(item.type) || item.type === "reasoning" && Boolean(item.summary?.some((part) => part.type === "summary_text" && part.text)) || item.type === "message" && item.role === "assistant" && item.phase === "commentary" && Boolean(item.content?.some((part) => part.type === "output_text" && part.text));
}
function readTextParts(parts, type) {
	const texts = /* @__PURE__ */ new Map();
	parts?.forEach((part, index) => {
		if (part.type === type) texts.set(index, part.text ?? "");
	});
	return texts;
}
function joinTextParts(parts) {
	return [...parts.entries()].toSorted(([left], [right]) => left - right).map(([, text]) => text).join("");
}
//#endregion
export { readTextParts as a, recordAgentsApiToolTranscript as c, joinTextParts as i, canRecordAgentsApiTranscriptText as n, recordAgentsApiNativeToolInvocation as o, iterateAgentsApiTranscriptItems as r, recordAgentsApiNativeToolTranscript as s, appendAgentsApiTranscriptMessage as t };
