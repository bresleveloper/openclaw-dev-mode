import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as normalizeUniqueTrimmedStringList } from "./string-normalization-CECOqf64.mjs";
import { a as resolveOpenAIThinkingApi } from "./model-catalog-types-BUOf2O4u.mjs";
import { _ as runtimeContextContentToText, f as hasRuntimeContextMarker, p as isRuntimeContextMessage } from "./types-CQc6JNG4.mjs";
import { n as validateToolCall, t as validateToolArguments } from "./validation-Rta7w8wz.mjs";
import { r as resolveEnvNodeProxyUrlForTarget, t as createFixedNodeProxyAgentPair } from "./node-proxy-agent-D_aqMs2B.mjs";
import { i as streamSimple, n as completeSimple, r as stream, t as complete } from "./stream-CL_UFGCU.mjs";
import { adjustMaxTokensForThinking, buildBaseOptions, clampReasoning, transformMessages } from "@openclaw/ai/internal/shared";
import { calculateCost, clampThinkingLevel as clampThinkingLevel$1, createToolArgumentPreviewSchedule as createToolArgumentPreviewSchedule$1, getApiProvider, getApiProviders, getEnvApiKey, parseStreamingJson as parseStreamingJson$1, sanitizeSurrogates as sanitizeSurrogates$1 } from "@openclaw/ai/internal/runtime";
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
		if (!this.done && event.type === "text_delta" && !event.partial) {
			const previous = this.queue[this.queue.length - 1];
			if (previous?.type === "text_delta" && !previous.partial && previous.contentIndex === event.contentIndex) {
				this.queue[this.queue.length - 1] = {
					...event,
					delta: previous.delta + event.delta
				};
				return;
			}
		}
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
//#region packages/ai/src/providers/openai-reasoning-effort.ts
/**
* OpenAI-compatible reasoning-effort normalization. Different GPT families
* expose different accepted effort enums, so callers map requested values here
* before constructing provider payloads.
*/
const ENABLED_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_5_REASONING_EFFORTS = [
	"minimal",
	"low",
	"medium",
	"high"
];
const GPT_51_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high"
];
const GPT_52_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_56_REASONING_EFFORTS = [
	"none",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_6_MANDATORY_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
const GPT_CODEX_REASONING_EFFORTS = [
	"low",
	"medium",
	"high",
	"xhigh"
];
const GPT_PRO_REASONING_EFFORTS = [
	"medium",
	"high",
	"xhigh"
];
const GPT_5_PRO_REASONING_EFFORTS = ["high"];
const GPT_51_CODEX_MAX_REASONING_EFFORTS = [
	"none",
	"medium",
	"high",
	"xhigh"
];
const GPT_51_CODEX_MINI_REASONING_EFFORTS = ["medium"];
const CANONICAL_REASONING_EFFORTS = /* @__PURE__ */ new Set([
	"none",
	...ENABLED_REASONING_EFFORTS,
	"off"
]);
function normalizeModelId(id) {
	return normalizeLowercaseStringOrEmpty(id ?? "").replace(/-\d{4}-\d{2}-\d{2}$/u, "");
}
/** Return whether a model has a known GPT-6 reasoning and sampling contract. */
function isOpenAIGpt6Model(model) {
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	return id === "gpt-6-astra" || id === "gpt-6-sol" || id === "gpt-6-luna" || id === "gpt-6.1-sol";
}
/** Normalize user-facing reasoning effort names to API effort names. */
function normalizeOpenAIReasoningEffort(effort) {
	const trimmed = effort.trim();
	const folded = trimmed.toLowerCase();
	return CANONICAL_REASONING_EFFORTS.has(folded) ? folded : trimmed;
}
function readCompatReasoningEfforts(compat) {
	if (!compat || typeof compat !== "object") return;
	if (compat.supportsReasoningEffort === false) return [];
	const raw = compat.supportedReasoningEfforts;
	if (!Array.isArray(raw)) return;
	return normalizeUniqueTrimmedStringList(raw);
}
/** Read a declared or known model contract, leaving unknown compatible models unspecified. */
function resolveOpenAIModelReasoningEfforts(model) {
	const compatEfforts = readCompatReasoningEfforts(model.compat);
	if (compatEfforts) return compatEfforts;
	const id = normalizeModelId(typeof model.id === "string" ? model.id : void 0);
	const api = resolveOpenAIThinkingApi(model.api);
	const supportsMax = api !== "openai-completions";
	if (isOpenAIGpt6Model(model) && api !== "azure-openai-responses") {
		if (id === "gpt-6-astra" || id === "gpt-6.1-sol") return supportsMax ? GPT_6_MANDATORY_REASONING_EFFORTS : GPT_CODEX_REASONING_EFFORTS;
		return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	}
	if (/^gpt-5\.6(?:-|$)/u.test(id)) return supportsMax ? GPT_56_REASONING_EFFORTS : GPT_52_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-mini") return GPT_51_CODEX_MINI_REASONING_EFFORTS;
	if (id === "gpt-5.1-codex-max") return GPT_51_CODEX_MAX_REASONING_EFFORTS;
	if (/^gpt-5(?:\.\d+)?-codex(?:-|$)/u.test(id)) return GPT_CODEX_REASONING_EFFORTS;
	if (id === "gpt-5-pro") return GPT_5_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?-pro(?:-|$)/u.test(id)) return GPT_PRO_REASONING_EFFORTS;
	if (/^gpt-5\.[2-9](?:\.\d+)?(?:-|$)/u.test(id)) return GPT_52_REASONING_EFFORTS;
	if (/^gpt-5\.1(?:-|$)/u.test(id)) return GPT_51_REASONING_EFFORTS;
	if (/^gpt-5(?:-|$)/u.test(id)) return GPT_5_REASONING_EFFORTS;
}
/** Read provider mappings without folding provider-native labels. */
function resolveOpenAIReasoningEffortMapping(effort, mapping) {
	const requested = normalizeOpenAIReasoningEffort(effort);
	return mapping?.[requested] ?? (mapping && CANONICAL_REASONING_EFFORTS.has(requested) ? Object.entries(mapping).find(([key]) => normalizeOpenAIReasoningEffort(key) === requested)?.[1] : void 0);
}
//#endregion
//#region packages/ai/src/transports/openai-reasoning-compat.ts
/** Explicit model reasoning-effort compatibility metadata. */
function readCompatReasoningEffortMap(compat) {
	const rawMap = asOptionalObjectRecord(asOptionalObjectRecord(compat)?.reasoningEffortMap);
	if (!rawMap) return {};
	return Object.fromEntries(Object.entries(rawMap).filter((entry) => typeof entry[1] === "string"));
}
/** Resolves the reasoning effort remap for an OpenAI-compatible model. */
function resolveOpenAIReasoningEffortMap(model, fallbackMap = {}) {
	return {
		...fallbackMap,
		...readCompatReasoningEffortMap(model.compat)
	};
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
	getEnvApiKey: () => getEnvApiKey,
	hasRuntimeContextMarker: () => hasRuntimeContextMarker,
	isRuntimeContextMessage: () => isRuntimeContextMessage,
	parseStreamingJson: () => parseStreamingJson$1,
	resolveOpenAIModelReasoningEfforts: () => resolveOpenAIModelReasoningEfforts,
	resolveOpenAIReasoningEffortMap: () => resolveOpenAIReasoningEffortMap,
	resolveOpenAIReasoningEffortMapping: () => resolveOpenAIReasoningEffortMapping,
	resolveProviderContext: () => resolveProviderContext,
	runtimeContextContentToText: () => runtimeContextContentToText,
	sanitizeSurrogates: () => sanitizeSurrogates$1,
	stream: () => stream,
	streamSimple: () => streamSimple,
	transformMessages: () => transformMessages,
	validateToolArguments: () => validateToolArguments,
	validateToolCall: () => validateToolCall
});
//#endregion
export { resolveOpenAIReasoningEffortMapping as _, clampThinkingLevel$1 as a, AssistantMessageEventStream as b, getApiProviders as c, parseStreamingJson$1 as d, sanitizeSurrogates$1 as f, resolveOpenAIModelReasoningEfforts as g, resolveOpenAIReasoningEffortMap as h, clampReasoning as i, getEnvApiKey as l, createHttpProxyAgentsForTarget as m, buildBaseOptions as n, createToolArgumentPreviewSchedule$1 as o, transformMessages as p, calculateCost as r, getApiProvider as s, adjustMaxTokensForThinking as t, llm_exports as u, PROVIDER_CONTEXT_HANDOFF as v, createAssistantMessageEventStream as x, resolveProviderContext as y };
