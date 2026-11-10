import { a as readUpstreamUserText, i as readMirrorIdentity } from "./upstream-prompt-provenance-Ccd9MFRJ.mjs";
import { t as CodexHistoryRejection } from "./history-rejection-B4nOXNXF.mjs";
import { a as isCodexDurableCustomMessage } from "./context-engine-projection-PIeLSnR-.mjs";
import { u as serializeCodexMirrorSourceEvidence } from "./transcript-mirror-attestation-BzUXnrvv.mjs";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { Buffer } from "node:buffer";
import { convertToLlm } from "openclaw/plugin-sdk/agent-core";
//#region extensions/codex/src/app-server/settled-turn-projection.ts
const MAX_RESPONSE_ITEMS = 200;
const MAX_PROJECTION_BYTES = 524288;
const MAX_TEXT_BYTES = 65536;
const TOOL_NAME_PATTERN = /^[a-zA-Z0-9._-]{1,128}$/u;
const TOOL_ERROR_STATUS_PREFIX = "[Tool result status: error]\n";
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
	readBoundedText(value, maxBytes = MAX_TEXT_BYTES) {
		if (typeof value !== "string" || !value.trim()) return;
		if (Buffer.byteLength(value, "utf8") > maxBytes) this.exceedLimit("field_limit");
		return value;
	}
	requireBoundedText(value, maxBytes = MAX_TEXT_BYTES) {
		const text = this.readBoundedText(value, maxBytes);
		if (!text) throw new CodexHistoryRejection("invalid_content");
		return text;
	}
	serializeToolArguments(value) {
		let serialized;
		try {
			const parsed = typeof value === "string" ? JSON.parse(value) : value;
			if (!isRecord(parsed)) throw new CodexHistoryRejection("invalid_content");
			serialized = typeof value === "string" ? value : JSON.stringify(value);
		} catch {
			throw new CodexHistoryRejection("invalid_content");
		}
		return this.requireBoundedText(serialized);
	}
	projectUserMessage(message) {
		const upstreamUserText = readUpstreamUserText(message);
		if (typeof message.content === "string") {
			const text = upstreamUserText ? this.requireBoundedText(upstreamUserText, MAX_PROJECTION_BYTES) : this.requireBoundedText(message.content);
			this.appendItem({
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
			const text = this.readBoundedText(value.text);
			if (text) {
				hasText = true;
				if (this.omitted) {
					content.length = 0;
					continue;
				}
				const part = {
					type: "input_text",
					text
				};
				bytes += responseItemBytes(part) + (content.length > 0 ? 1 : 0);
				if (bytes > MAX_PROJECTION_BYTES) this.exceedLimit("byte_limit");
				if (this.omitted) content.length = 0;
				else content.push(part);
			}
		}
		if (!hasText) throw new CodexHistoryRejection("invalid_content");
		this.appendItem({
			type: "message",
			role: "user",
			content
		});
	}
	projectAssistantMessage(message) {
		const values = typeof message.content === "string" ? [{
			type: "text",
			text: message.content
		}] : message.content;
		if (!Array.isArray(values)) throw new CodexHistoryRejection("unsupported_content");
		for (const value of values) {
			if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
			if (value.type === "text") {
				const text = this.readBoundedText(value.text);
				if (text) this.appendItem({
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
				const args = this.serializeToolArguments(value.arguments ?? value.input);
				this.recordCall(id, name);
				this.appendItem({
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
	projectToolResult(message) {
		const id = requireCallId(message.toolCallId);
		const name = requireToolName(message.toolName);
		if (!Array.isArray(message.content)) throw new CodexHistoryRejection("unsupported_content");
		const isErrorValue = message.isError;
		if (isErrorValue !== void 0 && typeof isErrorValue !== "boolean") throw new CodexHistoryRejection("invalid_content");
		const isError = isErrorValue === true;
		const parts = [];
		let bytes = 0;
		for (const value of message.content) {
			if (!isRecord(value)) throw new CodexHistoryRejection("invalid_content");
			let text;
			if (value.type === "image") text = `[Image tool result: ${normalizeOptionalString(value.mimeType) ?? "unknown type"}]`;
			else {
				if (value.type !== "text" && value.type !== "toolResult") throw new CodexHistoryRejection("invalid_content");
				text = this.readBoundedText(value.type === "text" ? value.text : value.content ?? value.text);
			}
			if (!text) continue;
			if (!this.omitted) {
				bytes += Buffer.byteLength(text, "utf8") + (parts.length > 0 ? 1 : 0);
				if (bytes > MAX_TEXT_BYTES) this.exceedLimit("field_limit");
			}
			if (this.omitted) parts.length = 0;
			else parts.push(text);
		}
		if (this.omitted) {
			this.recordResult(id, name);
			return;
		}
		const resultText = parts.join("\n") || (isError ? "Tool failed without textual output." : "Tool completed without textual output.");
		const output = this.requireBoundedText(isError ? `${TOOL_ERROR_STATUS_PREFIX}${resultText}` : resultText, isError ? MAX_TEXT_BYTES + Buffer.byteLength(TOOL_ERROR_STATUS_PREFIX, "utf8") : MAX_TEXT_BYTES);
		this.recordResult(id, name);
		this.appendItem({
			type: "function_call_output",
			call_id: id,
			output
		});
	}
	append(message) {
		if (message.role === "user") this.projectUserMessage(message);
		else if (message.role === "assistant") this.projectAssistantMessage(message);
		else if (message.role === "toolResult") this.projectToolResult(message);
		else if (message.role === "custom" || message.role === "bashExecution" || message.role === "branchSummary" || message.role === "compactionSummary") {
			if (message.role === "custom" && !isCodexDurableCustomMessage(message)) return;
			for (const converted of convertToLlm([message])) this.append(converted);
		} else throw new CodexHistoryRejection("unsupported_content");
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
	const promptIdentity = params.promptIdentity ?? `${params.turnId}:prompt`;
	const boundaryIndex = params.settledMessages.findLastIndex((message) => message.role === "toolResult");
	const boundary = params.settledMessages[boundaryIndex];
	const boundaryIdentity = boundary && readMirrorIdentity(boundary);
	const requiredIds = params.settledMessages.slice(0, boundaryIndex + 1).flatMap((message) => readMirrorIdentity(message) ?? []);
	const anchorIdentity = params.promptSuppressed ? requiredIds[0] : promptIdentity;
	const hasPrompt = requiredIds.includes(promptIdentity);
	if (!boundaryIdentity?.startsWith(`${params.turnId}:tool:`) || requiredIds.length !== boundaryIndex + 1 || new Set(requiredIds).size !== requiredIds.length || (params.promptSuppressed ? hasPrompt || !anchorIdentity?.startsWith(`${params.turnId}:`) : !hasPrompt)) rejectEvidence();
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
		currentStarted ||= identity === anchorIdentity;
		if (!currentStarted) prior.append(message);
		else if (!throughBoundary) yield message;
		throughBoundary ||= identity === boundaryIdentity;
	}
	if (!throughBoundary || matched !== requiredIds.length) rejectEvidence();
}
//#endregion
export { projectVerifiedSettledCodexMessages as t };
