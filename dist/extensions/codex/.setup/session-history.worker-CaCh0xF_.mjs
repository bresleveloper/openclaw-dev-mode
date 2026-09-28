import { i as readUpstreamUserText, r as readMirrorIdentity } from "./upstream-prompt-provenance-LphB8slG.mjs";
import { t as CodexHistoryRejection } from "./history-rejection-B4nOXNXF.mjs";
import { n as readCodexNativeHistory } from "./session-history-read-B3ZfSUbF.mjs";
import { l as serializeCodexMirrorSourceEvidence } from "./transcript-mirror-attestation-CzM-94NC.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Buffer } from "node:buffer";
import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
//#region extensions/codex/src/app-server/settled-turn-projection.ts
const MAX_RESPONSE_ITEMS = 200;
const MAX_PROJECTION_BYTES = 524288;
const MAX_TEXT_BYTES = 65536;
const TOOL_NAME_PATTERN = /^[a-zA-Z0-9._-]{1,128}$/u;
const TOOL_ERROR_STATUS_PREFIX = "[Tool result status: error]\n";
function readBoundedText(value, projection, maxBytes = MAX_TEXT_BYTES) {
	if (typeof value !== "string" || !value.trim()) return;
	if (Buffer.byteLength(value, "utf8") > maxBytes) projection.exceedLimit("field_limit");
	return value;
}
function requireBoundedText(value, projection, maxBytes = MAX_TEXT_BYTES) {
	const text = readBoundedText(value, projection, maxBytes);
	if (!text) throw new CodexHistoryRejection("invalid_content");
	return text;
}
function responseItemBytes(item) {
	return Buffer.byteLength(JSON.stringify(item), "utf8");
}
function requireCallId(value) {
	const callId = normalizeOptionalString(value);
	if (!callId || callId.length > 256) throw new CodexHistoryRejection("invalid_content");
	return callId;
}
function requireToolName(value) {
	const name = normalizeOptionalString(value);
	if (!name || !TOOL_NAME_PATTERN.test(name)) throw new CodexHistoryRejection("invalid_content");
	return name;
}
function serializeToolArguments(value, projection) {
	if (typeof value === "string") {
		let parsed;
		try {
			parsed = JSON.parse(value);
		} catch {
			throw new CodexHistoryRejection("invalid_content");
		}
		if (!isRecord(parsed)) throw new CodexHistoryRejection("invalid_content");
		return requireBoundedText(value, projection);
	}
	if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
	let serialized;
	try {
		serialized = JSON.stringify(value);
	} catch {
		throw new CodexHistoryRejection("invalid_content");
	}
	return requireBoundedText(serialized, projection);
}
function projectUserMessage(message, projection) {
	const upstreamUserText = readUpstreamUserText(message);
	if (typeof message.content === "string") {
		const text = upstreamUserText ? requireBoundedText(upstreamUserText, projection, MAX_PROJECTION_BYTES) : requireBoundedText(message.content, projection);
		if (!projection.omitted) projection.appendItem({
			type: "message",
			role: "user",
			content: [{
				type: "input_text",
				text
			}]
		});
		return;
	}
	if (!Array.isArray(message.content)) throw new CodexHistoryRejection("unsupported_content");
	const content = [];
	let hasText = false;
	let bytes = responseItemBytes({
		type: "message",
		role: "user",
		content
	});
	for (const value of message.content) {
		if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
		if (value.type !== "text") throw new CodexHistoryRejection(value.type === "image" ? "unsupported_user_image" : "unsupported_content");
		const text = readBoundedText(value.text, projection);
		if (text) {
			hasText = true;
			if (projection.omitted) {
				content.length = 0;
				continue;
			}
			const part = {
				type: "input_text",
				text
			};
			bytes += responseItemBytes(part) + (content.length > 0 ? 1 : 0);
			if (bytes > MAX_PROJECTION_BYTES) projection.exceedLimit("byte_limit");
			if (projection.omitted) content.length = 0;
			else content.push(part);
		}
	}
	if (!hasText) throw new CodexHistoryRejection("invalid_content");
	if (!projection.omitted) projection.appendItem({
		type: "message",
		role: "user",
		content
	});
}
function projectAssistantMessage(message, projection) {
	const values = typeof message.content === "string" ? [{
		type: "text",
		text: message.content
	}] : message.content;
	if (!Array.isArray(values)) throw new CodexHistoryRejection("unsupported_content");
	for (const value of values) {
		if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
		if (value.type === "text") {
			const text = readBoundedText(value.text, projection);
			if (text && !projection.omitted) projection.appendItem({
				type: "message",
				role: "assistant",
				content: [{
					type: "output_text",
					text
				}]
			});
			continue;
		}
		if (value.type === "toolCall") {
			const id = requireCallId(value.id ?? value.toolCallId);
			const name = requireToolName(value.name ?? value.toolName);
			const args = serializeToolArguments(value.arguments ?? value.input, projection);
			projection.recordCall(id, name);
			if (!projection.omitted) projection.appendItem({
				type: "function_call",
				call_id: id,
				name,
				arguments: args
			});
			continue;
		}
		if (value.type === "thinking" || value.type === "reasoning") continue;
		throw new CodexHistoryRejection("unsupported_content");
	}
}
function projectToolResult(message, projection) {
	const id = requireCallId(message.toolCallId);
	const name = requireToolName(message.toolName);
	if (!Array.isArray(message.content)) throw new CodexHistoryRejection("unsupported_content");
	const isErrorValue = message.isError;
	if (isErrorValue !== void 0 && typeof isErrorValue !== "boolean") throw new CodexHistoryRejection("invalid_content");
	const isError = isErrorValue === true;
	const parts = [];
	let bytes = 0;
	const appendText = (text) => {
		if (projection.omitted) {
			parts.length = 0;
			return;
		}
		bytes += Buffer.byteLength(text, "utf8") + (parts.length > 0 ? 1 : 0);
		if (bytes > MAX_TEXT_BYTES) projection.exceedLimit("field_limit");
		if (projection.omitted) parts.length = 0;
		else parts.push(text);
	};
	for (const value of message.content) {
		if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
		if (value.type === "image") {
			appendText(`[Image tool result: ${normalizeOptionalString(value.mimeType) ?? "unknown type"}]`);
			continue;
		}
		if (value.type !== "text" && value.type !== "toolResult") throw new CodexHistoryRejection("invalid_content");
		const text = value.type === "text" ? readBoundedText(value.text, projection) : readBoundedText(value.content ?? value.text, projection);
		if (text) appendText(text);
	}
	if (projection.omitted) {
		projection.recordResult(id, name);
		return;
	}
	const resultText = parts.join("\n") || (isError ? "Tool failed without textual output." : "Tool completed without textual output.");
	const output = requireBoundedText(isError ? `${TOOL_ERROR_STATUS_PREFIX}${resultText}` : resultText, projection, isError ? MAX_TEXT_BYTES + Buffer.byteLength(TOOL_ERROR_STATUS_PREFIX, "utf8") : MAX_TEXT_BYTES);
	projection.recordResult(id, name);
	projection.appendItem({
		type: "function_call_output",
		call_id: id,
		output
	});
}
var HistoryProjection = class {
	constructor(seenCallIds, oversized) {
		this.seenCallIds = seenCallIds;
		this.oversized = oversized;
		this.items = [];
		this.pending = /* @__PURE__ */ new Map();
		this.completedResults = 0;
		this.omitted = false;
		this.bytes = 0;
	}
	append(message) {
		if (message.role === "user") projectUserMessage(message, this);
		else if (message.role === "assistant") projectAssistantMessage(message, this);
		else if (message.role === "toolResult") projectToolResult(message, this);
		else throw new CodexHistoryRejection("unsupported_content");
	}
	recordCall(id, name) {
		if (this.seenCallIds.has(id)) throw new CodexHistoryRejection("invalid_pairing");
		this.seenCallIds.add(id);
		this.pending.set(id, name);
	}
	recordResult(id, name) {
		if (this.pending.get(id) !== name) throw new CodexHistoryRejection("invalid_pairing");
		this.pending.delete(id);
		this.completedResults += 1;
	}
	exceedLimit(reason) {
		if (this.oversized === "reject") throw new CodexHistoryRejection(reason);
		this.omitted = true;
		this.items.length = 0;
		this.bytes = 0;
	}
	appendItem(item) {
		if (this.omitted) return;
		if (this.items.length === MAX_RESPONSE_ITEMS) {
			this.exceedLimit("item_limit");
			return;
		}
		this.bytes += responseItemBytes(item);
		if (this.bytes > MAX_PROJECTION_BYTES) {
			this.exceedLimit("byte_limit");
			return;
		}
		this.items.push(item);
	}
	finish() {
		if (this.pending.size) throw new CodexHistoryRejection("incomplete_pairing");
	}
};
/** Current-turn evidence must be complete; it is never trimmed to fit a budget. */
function projectSettledCodexMessages(messages, seenCallIds = /* @__PURE__ */ new Set()) {
	const projection = new HistoryProjection(seenCallIds, "reject");
	for (const message of messages) projection.append(message);
	projection.finish();
	if (projection.completedResults === 0) throw new CodexHistoryRejection("incomplete_pairing");
	return projection.items;
}
const OMITTED_HISTORY = {
	type: "message",
	role: "user",
	content: [{
		type: "input_text",
		text: "[Earlier conversation was omitted from this bounded recovery context. The current turn's evidence is complete. Do not infer missing earlier facts; state uncertainty when the available context is insufficient.]"
	}]
};
/** Keep the nearest whole prior turns, reserving the budget for current evidence. */
var SettledTurnPriorContext = class {
	constructor(seenCallIds) {
		this.seenCallIds = seenCallIds;
		this.groups = [];
		this.omitted = false;
		this.count = 0;
		this.bytes = 0;
		this.active = new HistoryProjection(seenCallIds, "omit");
	}
	append(message) {
		if (message.role === "user" && this.active.pending.size === 0) {
			this.finishGroup();
			this.active = new HistoryProjection(this.seenCallIds, "omit");
		}
		const wasOmitted = this.active.omitted;
		this.active.append(message);
		if (!wasOmitted && this.active.omitted) {
			this.groups = [];
			this.count = 0;
			this.bytes = 0;
			this.omitted = true;
		}
	}
	finishGroup() {
		this.active.finish();
		if (this.active.items.length) {
			this.groups.push(this.active);
			this.count += this.active.items.length;
			this.bytes += this.active.bytes;
			this.trim(0, 0);
		}
	}
	trim(currentCount, currentBytes) {
		while (this.count + currentCount + (this.omitted ? 1 : 0) > MAX_RESPONSE_ITEMS || this.bytes + currentBytes + (this.omitted ? responseItemBytes(OMITTED_HISTORY) : 0) > MAX_PROJECTION_BYTES) {
			const oldest = this.groups.shift();
			if (!oldest) return false;
			this.count -= oldest.items.length;
			this.bytes -= oldest.bytes;
			this.omitted = true;
		}
		return this.omitted;
	}
	prependTo(current) {
		this.finishGroup();
		return [
			...this.trim(current.length, current.reduce((bytes, item) => bytes + responseItemBytes(item), 0)) ? [OMITTED_HISTORY] : [],
			...this.groups.flatMap((group) => group.items),
			...current
		];
	}
};
//#endregion
//#region extensions/codex/src/app-server/settled-turn-evidence.ts
function rejectEvidence() {
	throw new CodexHistoryRejection("provenance_rejected");
}
/** The worker consumes this verifier lazily; rejection never acquires the remaining payloads. */
function projectVerifiedSettledCodexMessages(history, params) {
	const seenCallIds = /* @__PURE__ */ new Set();
	const prior = new SettledTurnPriorContext(seenCallIds);
	const current = projectSettledCodexMessages(verifiedSettledMessages(history, params, prior), seenCallIds);
	return prior.prependTo(current);
}
/** Yields only the settled prefix, but exhausts suffix identity checks before accepting it. */
function* verifiedSettledMessages(history, params, prior) {
	const promptIdentity = `${params.turnId}:prompt`;
	const boundaryIndex = params.settledMessages.findLastIndex((message) => message.role === "toolResult");
	const boundary = params.settledMessages[boundaryIndex];
	const boundaryIdentity = boundary && readMirrorIdentity(boundary);
	const requiredIds = params.settledMessages.slice(0, boundaryIndex + 1).flatMap((message) => readMirrorIdentity(message) ?? []);
	if (!boundaryIdentity?.startsWith(`${params.turnId}:tool:`) || requiredIds.length !== boundaryIndex + 1 || new Set(requiredIds).size !== requiredIds.length || !requiredIds.includes(promptIdentity)) rejectEvidence();
	const mirrored = params.mirroredMessages;
	const mirroredIds = mirrored.flatMap((message) => readMirrorIdentity(message) ?? []);
	const mirroredBoundaryIndex = mirrored.findIndex((message) => readMirrorIdentity(message) === boundaryIdentity);
	if (new Set(mirroredIds).size !== mirroredIds.length || mirroredBoundaryIndex + 1 !== requiredIds.length || requiredIds.some((id, index) => readMirrorIdentity(mirrored[index]) !== id)) rejectEvidence();
	const required = new Map(requiredIds.map((id, index) => [id, mirrored[index]]));
	const seen = /* @__PURE__ */ new Set();
	let matched = 0;
	let throughBoundary = false;
	let currentStarted = false;
	for (const message of history) {
		const identity = readMirrorIdentity(message);
		if (identity) {
			if (seen.has(identity)) rejectEvidence();
			seen.add(identity);
			const expected = required.get(identity);
			if (expected) {
				if (identity !== requiredIds[matched] || serializeCodexMirrorSourceEvidence(message) !== serializeCodexMirrorSourceEvidence(expected)) rejectEvidence();
				matched += 1;
			}
		}
		currentStarted ||= identity === promptIdentity;
		if (!currentStarted) prior.append(message);
		else if (!throughBoundary) yield message;
		throughBoundary ||= identity === boundaryIdentity;
	}
	if (!throughBoundary || matched !== requiredIds.length) rejectEvidence();
}
//#endregion
//#region extensions/codex/session-history.worker.ts
async function runCodexHistoryWorkerInput(input) {
	const request = input;
	let version;
	const onSnapshot = (value) => {
		version = value;
	};
	return {
		result: await readCodexNativeHistory(request.target, request.sessionId, (messages) => projectVerifiedSettledCodexMessages(messages, request.evidence), request.admission, onSnapshot),
		version
	};
}
serveWorkerTasks(runCodexHistoryWorkerInput);
//#endregion
export { runCodexHistoryWorkerInput as t };
