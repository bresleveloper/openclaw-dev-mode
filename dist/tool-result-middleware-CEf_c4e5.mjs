import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isToolResultError } from "./tool-result-error-IpvGgAny.mjs";
import { i as isMessagingToolSendAction } from "./embedded-agent-messaging-BHfhPlTk.mjs";
import { c as readEmbeddedMessageDeliveryFact } from "./embedded-agent-message-delivery-DeQ0PPQm.mjs";
import { n as isDeliveredMessagingToolResult } from "./embedded-agent-message-tool-source-reply-CiWOpEbo.mjs";
//#region src/agents/harness/tool-result-middleware.ts
const log = createSubsystemLogger("agents/harness");
const MAX_MIDDLEWARE_CONTENT_BLOCKS = 200;
const MAX_MIDDLEWARE_TEXT_CHARS = 1e5;
const MAX_MIDDLEWARE_CONTENT_DEPTH = 20;
const NESTED_TOOL_RESULT_BLOCK_TYPES = /* @__PURE__ */ new Set(["toolresult", "tool_result"]);
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
function coerceMiddlewareText(value, depth) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (!isRecord(value) || depth >= MAX_MIDDLEWARE_CONTENT_DEPTH) return;
	for (const key of [
		"text",
		"output",
		"result",
		"message"
	]) {
		const text = coerceMiddlewareText(value[key], depth + 1);
		if (text !== void 0) return text;
	}
	if (Array.isArray(value.content)) return coerceMiddlewareContentArray(value.content, depth + 1).flatMap((block) => block.type === "text" && block.text ? [block.text] : []).join("\n") || void 0;
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
function coerceMiddlewareContentArray(content, depth, level = "nested") {
	const blocks = [];
	for (const entry of content.slice(0, MAX_MIDDLEWARE_CONTENT_BLOCKS)) {
		if (blocks.length >= MAX_MIDDLEWARE_CONTENT_BLOCKS) break;
		const coerced = coerceMiddlewareContentBlocks(entry, depth);
		if (level === "result") {
			blocks.push(...coerced.slice(0, MAX_MIDDLEWARE_CONTENT_BLOCKS - blocks.length));
			continue;
		}
		const text = coerced.length === 0 ? coerceMiddlewareText(entry, depth) : void 0;
		for (const block of text ? [{
			type: "text",
			text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
		}] : coerced) appendMiddlewareContentBlock(blocks, block);
	}
	return blocks;
}
function coerceMiddlewareContentBlocks(value, depth) {
	if (!isRecord(value) || typeof value.type !== "string") return [];
	if (value.type === "text" && typeof value.text === "string") return [{
		...value,
		type: "text",
		text: truncateUtf16Safe(value.text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
	if (value.type === "image" && typeof value.data === "string" && typeof value.mimeType === "string") return [{
		...value,
		type: "image",
		data: value.data,
		mimeType: value.mimeType
	}];
	const normalizedType = value.type.toLowerCase();
	if (!NESTED_TOOL_RESULT_BLOCK_TYPES.has(normalizedType)) return [];
	const content = value.content;
	if (Array.isArray(content) && content.length > 0) return depth < MAX_MIDDLEWARE_CONTENT_DEPTH ? coerceMiddlewareContentArray(content, depth + 1) : [];
	const text = coerceMiddlewareText(content, depth) ?? coerceMiddlewareText(value, depth);
	if (!text) return [];
	return [{
		type: "text",
		text: truncateUtf16Safe(text, MAX_MIDDLEWARE_TEXT_CHARS)
	}];
}
/** Older native runtimes wrap content in toolResult blocks (issue #82912). */
function normalizeNativeToolResult(value) {
	if (!Array.isArray(value.content) || !value.content.some((block) => isRecord(block) && typeof block.type === "string" && NESTED_TOOL_RESULT_BLOCK_TYPES.has(block.type.toLowerCase()))) return value;
	const content = coerceMiddlewareContentArray(value.content, 0, "result");
	if (content.length === 0) throw new Error("Native tool result contains no usable content");
	return {
		...value,
		content
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
	const resolvedHandlersLoader = createLazyPromiseLoader(async () => {
		const { loadAgentToolResultMiddlewaresForRuntime } = await import("./agent-tool-result-middleware-loader-DChEgNX3.mjs");
		return loadAgentToolResultMiddlewaresForRuntime({ runtime: ctx.runtime });
	});
	return { async applyToolResultMiddleware(event) {
		const handlersForRun = await (handlers ?? resolvedHandlersLoader.load());
		if (handlersForRun.length === 0) return event.result;
		const deliveredMessagingFallback = buildDeliveredMessagingFailureFallback(event, event.result);
		const fail = (message) => {
			log.warn(`[${ctx.runtime}] ${message} for ${truncateUtf16Safe(event.toolName, 120)}`);
			return reconcileDeliveredMessagingFailure(buildMiddlewareFailureResult(), deliveredMessagingFallback);
		};
		try {
			let current = normalizeNativeToolResult(event.result);
			for (const handler of handlersForRun) current = normalizeNativeToolResult((await handler({
				...event,
				result: current
			}, ctx))?.result ?? current);
			return reconcileDeliveredMessagingFailure(current, deliveredMessagingFallback);
		} catch {
			return fail("tool result middleware failed");
		}
	} };
}
//#endregion
export { createAgentToolResultMiddlewareRunner as t };
