import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { n as validateToolCall, t as validateToolArguments } from "./validation-Dw7cb6BV.mjs";
import { r as resolveEnvNodeProxyUrlForTarget, t as createFixedNodeProxyAgentPair } from "./node-proxy-agent-DS6ACVaa.mjs";
import { i as streamSimple, n as completeSimple, r as stream, t as complete } from "./stream-V1Shd8lY.mjs";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@openclaw/ai/internal/shared";
import { calculateCost, clampThinkingLevel as clampThinkingLevel$1, createToolArgumentPreviewSchedule as createToolArgumentPreviewSchedule$1, getApiProvider, getApiProviders, getEnvApiKey as getEnvApiKey$1, parseStreamingJson as parseStreamingJson$1, sanitizeSurrogates as sanitizeSurrogates$1 } from "@openclaw/ai/internal/runtime";
//#region packages/llm-core/src/utils/event-stream.ts
const thinkingAppends = /* @__PURE__ */ new WeakMap();
const eventStreamCompletions = /* @__PURE__ */ new WeakMap();
/** Generic async-iterable event stream with a separately awaited final result. */
var EventStream = class {
	constructor(isComplete, extractResult) {
		this.queue = [];
		this.queueHead = 0;
		this.waiting = [];
		this.done = false;
		this.resultSettled = false;
		this.isComplete = isComplete;
		this.extractResult = extractResult;
		this.finalResultPromise = new Promise((resolve, reject) => {
			this.resolveFinalResult = resolve;
			this.rejectFinalResult = reject;
		});
		eventStreamCompletions.set(this, this.finalResultPromise);
	}
	push(event) {
		if (this.done) return;
		if (this.isComplete(event)) {
			this.done = true;
			this.resultSettled = true;
			this.resolveFinalResult(this.extractResult(event));
		}
		const waiter = this.waiting.shift();
		if (waiter) waiter({
			value: event,
			done: false
		});
		else this.queue.push(event);
	}
	end(result) {
		this.done = true;
		if (result !== void 0) {
			this.resultSettled = true;
			this.resolveFinalResult(result);
		} else if (!this.resultSettled) {
			this.resultSettled = true;
			this.finalResultPromise.catch(() => {});
			this.rejectFinalResult(/* @__PURE__ */ new Error("event stream ended without a terminal event or final result"));
		}
		while (this.waiting.length > 0) {
			const waiter = this.waiting.shift();
			if (!waiter) break;
			waiter({
				value: void 0,
				done: true
			});
		}
	}
	async *[Symbol.asyncIterator]() {
		while (true) if (this.queueHead < this.queue.length) {
			const event = this.queue[this.queueHead];
			this.queue[this.queueHead] = void 0;
			this.queueHead += 1;
			if (this.queueHead >= 1024 && this.queueHead * 2 >= this.queue.length) {
				this.queue = this.queue.slice(this.queueHead);
				this.queueHead = 0;
			}
			yield event;
		} else if (this.done) return;
		else {
			const result = await new Promise((resolve) => {
				this.waiting.push(resolve);
			});
			if (result.done) return;
			yield result.value;
		}
	}
	result() {
		return this.finalResultPromise;
	}
};
/** Assistant-message event stream that resolves on done/error terminal events. */
var AssistantMessageEventStream = class extends EventStream {
	push(event) {
		if (event.type === "thinking_delta" || event.type === "thinking_end") {
			const block = event.partial.content[event.contentIndex];
			if (block?.type === "thinking") {
				if (this.done || event.type === "thinking_end") {
					thinkingAppends.delete(block);
					this.activeThinkingBlocks?.delete(block);
				} else if (thinkingAppends.has(block)) (this.activeThinkingBlocks ??= /* @__PURE__ */ new Set()).add(block);
			}
		}
		if (event.type === "done" || event.type === "error") this.clearThinkingAppends(event.type === "done" ? event.message : event.error);
		super.push(event);
	}
	end(result) {
		this.clearThinkingAppends(result);
		super.end(result);
	}
	clearThinkingAppends(message) {
		for (const block of message?.content ?? []) if (block.type === "thinking") thinkingAppends.delete(block);
		for (const block of this.activeThinkingBlocks ?? []) thinkingAppends.delete(block);
		this.activeThinkingBlocks = void 0;
	}
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			else if (event.type === "error") return event.error;
			throw new Error("Unexpected event type for final result");
		});
	}
};
/** Creates an assistant-message stream for provider and plugin adapters. */
function createAssistantMessageEventStream() {
	return new AssistantMessageEventStream();
}
//#endregion
//#region packages/ai/src/provider-types.ts
const PROVIDER_CONTEXT_HANDOFF = Symbol("providerContextHandoff");
/** Resolves provider-only context without widening the canonical call contract. */
async function resolveProviderContext(context, options) {
	return options?.[PROVIDER_CONTEXT_HANDOFF]?.() ?? context;
}
//#endregion
//#region src/llm/utils/node-http-proxy.ts
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
function createHttpProxyAgentsForTarget(targetUrl) {
	const proxyUrl = resolveEnvNodeProxyUrlForTarget(targetUrl);
	if (!proxyUrl) return;
	return createFixedNodeProxyAgentPair(proxyUrl);
}
//#endregion
//#region src/plugin-sdk/llm.ts
var llm_exports = /* @__PURE__ */ __exportAll({
	AssistantMessageEventStream: () => AssistantMessageEventStream,
	adjustMaxTokensForThinking: () => adjustMaxTokensForThinking,
	buildBaseOptions: () => buildBaseOptions,
	calculateCost: () => calculateCost,
	clampReasoning: () => clampReasoning,
	clampThinkingLevel: () => clampThinkingLevel$1,
	complete: () => complete,
	completeSimple: () => completeSimple,
	createAssistantMessageEventStream: () => createAssistantMessageEventStream,
	createHttpProxyAgentsForTarget: () => createHttpProxyAgentsForTarget,
	createToolArgumentPreviewSchedule: () => createToolArgumentPreviewSchedule$1,
	getApiProvider: () => getApiProvider,
	getApiProviders: () => getApiProviders,
	getEnvApiKey: () => getEnvApiKey$1,
	parseStreamingJson: () => parseStreamingJson$1,
	resolveProviderContext: () => resolveProviderContext,
	sanitizeSurrogates: () => sanitizeSurrogates$1,
	stream: () => stream,
	streamSimple: () => streamSimple,
	transformMessages: () => transformMessages,
	validateToolArguments: () => validateToolArguments,
	validateToolCall: () => validateToolCall
});
//#endregion
export { AssistantMessageEventStream as _, clampThinkingLevel$1 as a, getApiProviders as c, parseStreamingJson$1 as d, sanitizeSurrogates$1 as f, resolveProviderContext as g, PROVIDER_CONTEXT_HANDOFF as h, clampReasoning as i, getEnvApiKey$1 as l, createHttpProxyAgentsForTarget as m, buildBaseOptions as n, createToolArgumentPreviewSchedule$1 as o, transformMessages as p, calculateCost as r, getApiProvider as s, adjustMaxTokensForThinking as t, llm_exports as u, createAssistantMessageEventStream as v };
