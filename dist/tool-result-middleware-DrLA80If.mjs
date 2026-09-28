import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import "./utils-aKqR_F_U.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { r as isToolResultError } from "./tool-result-error-CWadvCKd.mjs";
import { a as isMessagingToolSendAction } from "./embedded-agent-messaging-D4Zw3sB3.mjs";
import { c as readEmbeddedMessageDeliveryFact } from "./embedded-agent-message-delivery-BkG-vmHL.mjs";
import { n as isDeliveredMessagingToolResult } from "./embedded-agent-message-tool-source-reply-D3_TCT19.mjs";
//#region src/agents/harness/tool-result-middleware.ts
/**
* Runs native harness tool-result middleware around tool execution results.
*/
const log = createSubsystemLogger("agents/harness");
const MAX_MIDDLEWARE_CONTENT_BLOCKS = 200;
const MAX_MIDDLEWARE_TEXT_CHARS = 1e5;
const MAX_MIDDLEWARE_IMAGE_DATA_CHARS = 5e6;
const MAX_MIDDLEWARE_CONTENT_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_BYTES = 1e5;
const MAX_MIDDLEWARE_DETAILS_DEPTH = 20;
const MAX_MIDDLEWARE_DETAILS_KEYS = 1e3;
const NESTED_TOOL_RESULT_BLOCK_TYPES = /* @__PURE__ */ new Set(["toolresult", "tool_result"]);
function isValidMiddlewareContentBlock(value) {
	if (!isRecord(value) || typeof value.type !== "string") return false;
	if (value.type === "text") return typeof value.text === "string" && value.text.length <= MAX_MIDDLEWARE_TEXT_CHARS;
	if (value.type === "image") return typeof value.mimeType === "string" && value.mimeType.trim().length > 0 && typeof value.data === "string" && value.data.length <= MAX_MIDDLEWARE_IMAGE_DATA_CHARS;
	return false;
}
function hasValidMiddlewareDetailsShape(value, state = {
	keys: 0,
	seen: /* @__PURE__ */ new WeakSet()
}, depth = 0) {
	if (value === void 0 || value === null) return true;
	if (depth > MAX_MIDDLEWARE_DETAILS_DEPTH) return false;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
	if (typeof value !== "object" || state.seen.has(value)) return false;
	state.seen.add(value);
	const entries = Array.isArray(value) ? value : Object.values(value);
	state.keys += entries.length;
	return state.keys <= MAX_MIDDLEWARE_DETAILS_KEYS && entries.every((entry) => hasValidMiddlewareDetailsShape(entry, state, depth + 1));
}
function isValidMiddlewareDetails(value) {
	if (value === void 0) return true;
	if (!hasValidMiddlewareDetailsShape(value)) return false;
	const size = boundedJsonUtf8Bytes(value, MAX_MIDDLEWARE_DETAILS_BYTES);
	return size.complete && size.bytes <= MAX_MIDDLEWARE_DETAILS_BYTES;
}
function isValidMiddlewareToolResult(value) {
	if (!isRecord(value) || !Array.isArray(value.content)) return false;
	if (value.content.length > MAX_MIDDLEWARE_CONTENT_BLOCKS) return false;
	return value.content.every(isValidMiddlewareContentBlock) && isValidMiddlewareDetails(value.details);
}
function descendMiddlewareContentCoerceState(value, state) {
	if (state.depth >= MAX_MIDDLEWARE_CONTENT_DEPTH) return;
	if (value === null || typeof value !== "object") return {
		depth: state.depth + 1,
		seen: state.seen
	};
	return state.seen.has(value) ? void 0 : {
		depth: state.depth + 1,
		seen: /* @__PURE__ */ new Set([...state.seen, value])
	};
}
function serializeMiddlewareValue(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		return JSON.stringify(value, (_key, val) => {
			if (typeof val === "bigint") return val.toString();
			if (typeof val === "function" || typeof val === "symbol" || val === void 0) return;
			if (val !== null && typeof val === "object") {
				if (seen.has(val)) return;
				seen.add(val);
			}
			return val;
		});
	} catch {
		return;
	}
}
function coerceMiddlewareText(value, state, options = {}) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (!isRecord(value)) return;
	const nextState = descendMiddlewareContentCoerceState(value, state);
	if (!nextState) return;
	for (const key of [
		"text",
		"output",
		"result",
		"message"
	]) {
		const text = coerceMiddlewareText(value[key], nextState, options);
		if (text !== void 0) return text;
	}
	if (Array.isArray(value.content)) return coerceMiddlewareContentArray(value.content, nextState, options).flatMap((block) => block.type === "text" && block.text ? [block.text] : []).join("\n") || void 0;
	return serializeMiddlewareValue(value);
}
function appendMiddlewareContentBlock(blocks, block) {
	if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) return;
	if (block.type !== "text") {
		blocks.push(block);
		return;
	}
	if (!block.text) return;
	const previous = blocks.at(-1);
	if (previous?.type !== "text") {
		blocks.push({
			type: "text",
			text: truncateUtf16Safe(block.text, MAX_MIDDLEWARE_TEXT_CHARS)
		});
		return;
	}
	const remainingChars = MAX_MIDDLEWARE_TEXT_CHARS - previous.text.length - 1;
	if (remainingChars > 0) previous.text = `${previous.text}\n${truncateUtf16Safe(block.text, remainingChars)}`;
}
function coerceMiddlewareContentArray(content, state, options = {}) {
	const blocks = [];
	for (const entry of content.slice(0, MAX_MIDDLEWARE_CONTENT_BLOCKS)) {
		if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
		const coerced = coerceMiddlewareContentBlocks(entry, state, options);
		const text = coerced.length === 0 ? coerceMiddlewareText(entry, state, options) : void 0;
		for (const block of text ? [{
			type: "text",
			text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
		}] : coerced) appendMiddlewareContentBlock(blocks, block);
	}
	return blocks;
}
function coerceMiddlewareContentBlocks(value, state, options = {}) {
	if (isValidMiddlewareContentBlock(value)) return [value];
	if (options.sanitizeContent === true && isRecord(value) && value.type === "text" && typeof value.text === "string") return [{
		type: "text",
		text: truncateUtf16Safe(value.text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
	if (!isRecord(value) || typeof value.type !== "string") return [];
	const normalizedType = value.type.toLowerCase();
	if (!NESTED_TOOL_RESULT_BLOCK_TYPES.has(normalizedType)) return [];
	const content = value.content;
	if (Array.isArray(content) && content.length > 0) {
		const nextState = descendMiddlewareContentCoerceState(value, state);
		return nextState ? coerceMiddlewareContentArray(content, nextState, options) : [];
	}
	const text = coerceMiddlewareText(content, state, options) ?? coerceMiddlewareText(value, state, options);
	if (!text) return [];
	return [{
		type: "text",
		text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
}
function coerceMiddlewareToolResult(value, options = {}) {
	if (isValidMiddlewareToolResult(value)) return value;
	if (!isRecord(value) || !Array.isArray(value.content)) return;
	const state = {
		depth: 0,
		seen: /* @__PURE__ */ new Set()
	};
	const content = [];
	for (const block of value.content.slice(0, MAX_MIDDLEWARE_CONTENT_BLOCKS)) {
		for (const coerced of coerceMiddlewareContentBlocks(block, state, options)) {
			if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
			content.push(coerced);
		}
		if (content.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
	}
	if (content.length === 0) return;
	const details = isValidMiddlewareDetails(value.details) ? value.details : options.sanitizeDetails === true ? sanitizeMiddlewareDetailsValue(value.details) : void 0;
	if (details === void 0 && !isValidMiddlewareDetails(value.details)) return;
	const result = {
		...value,
		content,
		details
	};
	return isValidMiddlewareToolResult(result) ? result : void 0;
}
function sanitizeMiddlewareDetailsValue(value) {
	const serialized = serializeMiddlewareValue(value);
	if (serialized === void 0) return null;
	const bytes = Buffer.byteLength(serialized, "utf8");
	if (bytes <= MAX_MIDDLEWARE_DETAILS_BYTES) {
		const parsed = JSON.parse(serialized);
		if (hasValidMiddlewareDetailsShape(parsed)) return parsed;
	}
	return {
		truncated: true,
		originalSizeBytes: bytes
	};
}
/**
* Coerce an incoming tool result into a shape the validator will accept,
* before any middleware runs. Tool emitters legitimately produce raw
* dependency payloads on `details` (channel SDK objects with methods, exec
* traces with cycles back to the runner, large attachment metadata). The
* harness owes a registered middleware a JSON-safe view of that payload;
* subsequent middleware-side mutations are still validated strictly.
*/
function sanitizeToolResultForMiddleware(result) {
	const coerced = coerceMiddlewareToolResult(result, {
		sanitizeContent: true,
		sanitizeDetails: true
	});
	if (coerced) return coerced;
	return result.details == null || isValidMiddlewareDetails(result.details) ? result : {
		...result,
		details: sanitizeMiddlewareDetailsValue(result.details)
	};
}
function buildMiddlewareFailureResult() {
	return {
		content: [{
			type: "text",
			text: "Tool output unavailable due to post-processing error."
		}],
		details: {
			status: "error",
			middlewareError: true
		}
	};
}
function buildDeliveredMessagingFailureFallback(event, result) {
	const deliveryFact = readEmbeddedMessageDeliveryFact(isRecord(result.details) ? result.details.messageDelivery : void 0);
	const delivered = deliveryFact ? deliveryFact.status === "settled" : isDeliveredMessagingToolResult({
		toolName: event.toolName,
		args: event.args,
		result,
		requirePluginDeliveryId: true
	});
	if (event.isError === true || isToolResultError(result) || !isMessagingToolSendAction(event.toolName, event.args) || !delivered) return;
	return {
		content: [{
			type: "text",
			text: "Message delivered, but result post-processing failed."
		}],
		details: {
			ok: true,
			deliveryStatus: "sent",
			middlewareWarning: "post-processing failed"
		}
	};
}
function reconcileDeliveredMessagingFailure(result, fallback) {
	return fallback && isRecord(result.details) && result.details.middlewareError === true ? fallback : result;
}
function createAgentToolResultMiddlewareRunner(ctx, handlers) {
	let resolvedHandlers = handlers;
	const resolvedHandlersLoader = createLazyPromiseLoader(async () => {
		const { loadAgentToolResultMiddlewaresForRuntime } = await import("./agent-tool-result-middleware-loader-HJIxo7CP.mjs");
		return loadAgentToolResultMiddlewaresForRuntime({ runtime: ctx.runtime });
	});
	const resolveHandlers = async () => {
		if (resolvedHandlers) return resolvedHandlers;
		resolvedHandlers = await resolvedHandlersLoader.load();
		return resolvedHandlers;
	};
	return { async applyToolResultMiddleware(event) {
		const handlersForRun = await resolveHandlers();
		if (handlersForRun.length === 0) return event.result;
		const deliveredMessagingFallback = buildDeliveredMessagingFailureFallback(event, event.result);
		let current = sanitizeToolResultForMiddleware(event.result);
		for (const handler of handlersForRun) try {
			const coercedCandidate = coerceMiddlewareToolResult((await handler({
				...event,
				result: current
			}, ctx))?.result ?? current);
			if (coercedCandidate) current = coercedCandidate;
			else {
				log.warn(`[${ctx.runtime}] discarded invalid tool result middleware output for ${truncateUtf16Safe(event.toolName, 120)}`);
				return reconcileDeliveredMessagingFailure(buildMiddlewareFailureResult(), deliveredMessagingFallback);
			}
		} catch {
			log.warn(`[${ctx.runtime}] tool result middleware failed for ${truncateUtf16Safe(event.toolName, 120)}`);
			return reconcileDeliveredMessagingFailure(buildMiddlewareFailureResult(), deliveredMessagingFallback);
		}
		return reconcileDeliveredMessagingFailure(current, deliveredMessagingFallback);
	} };
}
//#endregion
export { createAgentToolResultMiddlewareRunner as t };
