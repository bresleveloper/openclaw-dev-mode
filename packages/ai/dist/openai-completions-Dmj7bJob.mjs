import { n as getEnvApiKey, r as __exportAll } from "./env-api-keys-DrgeBuva.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { N as clampThinkingLevel } from "./host-yTvBrYM2.mjs";
import { i as resolveOpenAICompletionsCompat } from "./openai-completions-compat-CUollwl6.mjs";
import { t as resolveCacheRetention } from "./cache-retention-0x979a5V.mjs";
import { n as buildBaseOptions, o as reasoningTagTextPolicy } from "./simple-options-np1XPuhm.mjs";
import { C as isOpenAICompletionsThinkingEnabled, b as createOpenAIProviderAcceptanceHook } from "./openai-transport-params-DZKOTSfH.mjs";
import { b as withProviderResponseHook, n as assignTransportErrorDetails, v as transportAbortError } from "./transport-stream-shared-B5RioB_Q.mjs";
import { a as tagUnresolvedTextAsCommentary, t as clearPendingCommentaryText } from "./assistant-text-phase-C20rxWwP.mjs";
import { t as createAssistantOutput } from "./assistant-output-DM1JBNs1.mjs";
import { a as convertMessages, i as buildOpenAICompletionsRequest, s as finalizeOpenAICompletionsToolCalls, t as processCompletionsStream } from "./openai-completions-stream-BEkpKWMC.mjs";
import { i as getFirstStreamEventTimeoutMs, r as getFirstStreamEventTimeoutHandler, t as createFirstStreamEventAbortController } from "./stream-first-event-timeout-BeptfRL6.mjs";
import { n as resolveProviderSimpleCompletionHeaders } from "./provider-transport-turn-state-lrXEFkYr.mjs";
import { n as hasCopilotVisionInput, t as buildCopilotDynamicHeaders } from "./github-copilot-headers-B37TB3rB.mjs";
import { t as createOpenAIProviderClient } from "./openai-provider-client-BP8J1aeg.mjs";
//#region packages/ai/src/providers/openai-completions.ts
var openai_completions_exports = /* @__PURE__ */ __exportAll({
	convertMessages: () => convertMessages,
	streamOpenAICompletions: () => streamOpenAICompletions,
	streamSimpleOpenAICompletions: () => streamSimpleOpenAICompletions
});
const streamOpenAICompletions = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	(async () => {
		const output = createAssistantOutput(model);
		const provisionalCommentaryTags = /* @__PURE__ */ new Map();
		let firstEventAbort;
		try {
			const apiKey = options?.apiKey || getEnvApiKey(model.provider) || "";
			const compat = resolveOpenAICompletionsCompat(model);
			const shouldEmitReasoning = Boolean(model.reasoning && options?.reasoningEffort && isOpenAICompletionsThinkingEnabled(options.reasoningEffort));
			const cacheRetention = resolveCacheRetention(options?.cacheRetention);
			const cacheSessionId = cacheRetention === "none" ? void 0 : options?.sessionId;
			const client = createClient(model, context, apiKey, resolveProviderSimpleCompletionHeaders(model, options), cacheSessionId, compat);
			let params = buildOpenAICompletionsRequest(model, context, options, {
				mode: "direct",
				compat,
				cacheRetention
			});
			const nextParams = await options?.onPayload?.(params, model);
			if (nextParams !== void 0) params = nextParams;
			firstEventAbort = createFirstStreamEventAbortController(options?.signal);
			const requestOptions = {
				signal: firstEventAbort.signal,
				...options?.timeoutMs !== void 0 ? { timeout: options.timeoutMs } : {},
				maxRetries: 0
			};
			const { data: openaiStream, response } = await client.chat.completions.create(params, requestOptions).withResponse();
			const hookedOpenAIStream = withProviderResponseHook({
				stream: openaiStream,
				signal: firstEventAbort.signal,
				abort: firstEventAbort.abort,
				hook: createOpenAIProviderAcceptanceHook(options, response, model),
				onReady: () => stream.push({
					type: "start",
					partial: output
				})
			});
			const finishedBlocks = /* @__PURE__ */ new Set();
			const contentIndices = /* @__PURE__ */ new WeakMap();
			let openTextBlock;
			let openThinkingBlock;
			const finishBlock = (block) => {
				const contentIndex = contentIndices.get(block);
				if (contentIndex === void 0 || finishedBlocks.has(block)) return;
				finishedBlocks.add(block);
				if (block.type === "text") {
					openTextBlock = void 0;
					stream.push({
						type: "text_end",
						contentIndex,
						content: block.text,
						partial: output
					});
				} else if (block.type === "thinking") {
					openThinkingBlock = void 0;
					stream.push({
						type: "thinking_end",
						contentIndex,
						content: block.thinking,
						partial: output
					});
				} else if (block.type === "toolCall") stream.push({
					type: "toolcall_end",
					contentIndex,
					toolCall: block,
					partial: output
				});
			};
			const directEventStream = { push(event) {
				if (event.type === "text_start" || event.type === "thinking_start" || event.type === "toolcall_start") {
					const block = output.content[event.contentIndex];
					if (block) {
						contentIndices.set(block, event.contentIndex);
						if (block.type === "text") openTextBlock = block;
						else if (block.type === "thinking") openThinkingBlock = block;
					}
				}
				stream.push(event);
			} };
			try {
				await processCompletionsStream(hookedOpenAIStream, output, model, directEventStream, {
					mode: "direct",
					beforeContentBlock(nextType) {
						if (openThinkingBlock) finishBlock(openThinkingBlock);
						if (openTextBlock && nextType !== "toolCall") finishBlock(openTextBlock);
					},
					provisionalCommentaryTags,
					signal: options?.signal,
					emitReasoning: shouldEmitReasoning,
					strictReasoningTags: reasoningTagTextPolicy.isStrict(options),
					firstEventTimeoutMs: getFirstStreamEventTimeoutMs(options),
					abortFirstEventStream: firstEventAbort.abort,
					onFirstEventTimeout: getFirstStreamEventTimeoutHandler(options)
				});
				if (options?.signal?.aborted) throw transportAbortError(options.signal);
				if (output.stopReason === "aborted" || output.stopReason === "error") throw new Error(output.errorMessage || (output.stopReason === "aborted" ? "Request was aborted" : "Provider returned an invalid tool call"));
			} catch (error) {
				for (const block of output.content) if (block.type !== "toolCall") finishBlock(block);
				throw error;
			}
			for (const block of output.content) if (block.type !== "toolCall" || output.stopReason === "toolUse") finishBlock(block);
			stream.push({
				type: "done",
				reason: output.stopReason,
				message: output
			});
			stream.end();
		} catch (error) {
			const terminal = assignTransportErrorDetails(output, error, options?.signal);
			finalizeOpenAICompletionsToolCalls(output, { allowSilentToolCallPromotion: false });
			clearPendingCommentaryText(provisionalCommentaryTags);
			tagUnresolvedTextAsCommentary(output);
			for (const block of output.content) {
				delete block.index;
				delete block.partialArgs;
				delete block.streamIndex;
			}
			stream.push({
				type: "error",
				reason: terminal.stopReason,
				error: output
			});
			stream.end();
		} finally {
			firstEventAbort?.dispose();
		}
	})();
	return stream;
};
const streamSimpleOpenAICompletions = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	const clampedReasoning = options?.reasoning ? clampThinkingLevel(model, options.reasoning) : void 0;
	const toolChoice = options?.toolChoice;
	return streamOpenAICompletions(model, context, {
		...base,
		reasoningEffort: clampedReasoning,
		toolChoice
	});
};
function createClient(model, context, apiKey, optionsHeaders, sessionId, compat = resolveOpenAICompletionsCompat(model)) {
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const headers = { ...model.headers };
	if (model.provider === "github-copilot") {
		const hasImages = hasCopilotVisionInput(context.messages);
		const copilotHeaders = buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages
		});
		Object.assign(headers, copilotHeaders);
	}
	if (sessionId && compat.sessionAffinity !== "none") {
		if (compat.sessionAffinity === "openrouter") headers["x-session-id"] = sessionId;
		else {
			headers.session_id = sessionId;
			headers["x-client-request-id"] = sessionId;
			headers["x-session-affinity"] = sessionId;
		}
	}
	return createOpenAIProviderClient(model, apiKey, headers, optionsHeaders);
}
//#endregion
export { streamOpenAICompletions as n, streamSimpleOpenAICompletions as r, openai_completions_exports as t };
