import { N as clampThinkingLevel, v as sanitizeSurrogates } from "./host-yTvBrYM2.mjs";
import { m as stripSystemPromptCacheBoundary } from "./simple-options-np1XPuhm.mjs";
import { m as notifyProviderStreamOpened, n as assignTransportErrorDetails, v as transportAbortError } from "./transport-stream-shared-B5RioB_Q.mjs";
import { a as googleFlashSupportsMinimalThinking, i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, t as convertGoogleTools } from "./google-messages-DB7GKkDk.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-BTocjCRs.mjs";
import { FunctionCallingConfigMode, ThinkingLevel } from "@google/genai";
//#region packages/ai/src/providers/google-shared.ts
/**
* Shared utilities for Google Generative AI and Google Vertex providers.
*/
function convertMessages(model, context) {
	return projectGoogleMessages({
		model,
		messages: transformProviderMessages(context.messages, model, (id) => requiresGoogleToolCallId(model.id) ? id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) : id),
		replay: "signed-parts",
		requiresToolCallSignature: model.provider !== "google-gemini-cli" && (isGemini3ProModel(model) || isGemini3FlashModel(model))
	});
}
/**
* Map tool choice string to Gemini FunctionCallingConfigMode.
* @internal Directly tested provider implementation detail.
*/
function mapToolChoice(choice) {
	switch (choice) {
		case "auto": return FunctionCallingConfigMode.AUTO;
		case "none": return FunctionCallingConfigMode.NONE;
		case "any": return FunctionCallingConfigMode.ANY;
		default: return FunctionCallingConfigMode.AUTO;
	}
}
async function runGoogleGenerateContentLifecycle(params) {
	const { stream, model, output, options } = params;
	try {
		const client = params.createClient();
		let requestParams = params.buildParams();
		const nextParams = await options?.onPayload?.(requestParams, model);
		if (nextParams !== void 0) requestParams = nextParams;
		const googleIterator = (await client.models.generateContentStream(requestParams))[Symbol.asyncIterator]();
		await notifyProviderStreamOpened({
			options,
			cancelStream: async () => {
				await googleIterator.return?.();
			}
		});
		await consumeGoogleGenerateContentStream({
			chunks: { [Symbol.asyncIterator]: () => googleIterator },
			model,
			output,
			stream,
			signal: options?.signal,
			nextToolCallId: params.nextToolCallId
		});
	} catch (error) {
		for (const block of output.content) if ("index" in block) delete block.index;
		const failure = options?.signal?.aborted ? transportAbortError(options.signal) : error;
		assignTransportErrorDetails(output, failure, options?.signal);
		stream.push({
			type: "error",
			reason: output.stopReason === "aborted" ? "aborted" : "error",
			error: output
		});
		stream.end();
	}
}
function buildGoogleGenerateContentParams(model, context, options = {}) {
	const contents = convertMessages(model, context);
	const generationConfig = {};
	if (options.temperature !== void 0) generationConfig.temperature = options.temperature;
	if (options.maxTokens !== void 0) generationConfig.maxOutputTokens = options.maxTokens;
	if (options.stop !== void 0 && options.stop.length > 0) generationConfig.stopSequences = options.stop;
	const config = {
		...Object.keys(generationConfig).length > 0 && generationConfig,
		...context.systemPrompt && { systemInstruction: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt)) },
		...context.tools && context.tools.length > 0 && { tools: convertGoogleTools(context.tools) }
	};
	if (context.tools && context.tools.length > 0 && options.toolChoice) config.toolConfig = { functionCallingConfig: { mode: mapToolChoice(options.toolChoice) } };
	else config.toolConfig = void 0;
	if (options.thinking?.enabled && model.reasoning) {
		const thinkingConfig = { includeThoughts: true };
		if (options.thinking.level !== void 0) thinkingConfig.thinkingLevel = ThinkingLevel[options.thinking.level];
		else if (options.thinking.budgetTokens !== void 0) thinkingConfig.thinkingBudget = options.thinking.budgetTokens;
		config.thinkingConfig = thinkingConfig;
	} else if (model.reasoning && options.thinking && !options.thinking.enabled) {
		const disabledThinkingConfig = getDisabledGoogleThinkingConfig(model);
		if (Object.keys(disabledThinkingConfig).length > 0) config.thinkingConfig = disabledThinkingConfig;
	}
	if (options.signal) {
		if (options.signal.aborted) throw new Error("Request aborted");
		config.abortSignal = options.signal;
	}
	return {
		model: model.id,
		contents,
		config
	};
}
function isAdaptiveGoogleReasoningLevel(value) {
	return value === "adaptive";
}
function buildGoogleSimpleThinking(model, options) {
	if (!options?.reasoning || options.reasoning === "off") return { enabled: false };
	if (isAdaptiveGoogleReasoningLevel(options.reasoning)) {
		if (!model.reasoning) return { enabled: false };
		if (isGemma4Model(model)) return {
			enabled: true,
			level: ThinkingLevel.HIGH
		};
		return isGemini3ProModel(model) || isGemini3FlashModel(model) ? { enabled: true } : {
			enabled: true,
			budgetTokens: -1
		};
	}
	const clampedReasoning = clampThinkingLevel(model, options.reasoning);
	if (clampedReasoning === "off") return { enabled: false };
	const effort = clampedReasoning === "max" ? "high" : clampedReasoning;
	if (isGemini3ProModel(model) || isGemini3FlashModel(model) || isGemma4Model(model)) return {
		enabled: true,
		level: getGoogleThinkingLevel(effort, model)
	};
	return {
		enabled: true,
		budgetTokens: getGoogleBudget(model, effort, options.thinkingBudgets)
	};
}
function getDisabledGoogleThinkingConfig(model) {
	if (isGemini3ProModel(model)) return { thinkingLevel: ThinkingLevel.LOW };
	if (isGemini3FlashModel(model)) return { thinkingLevel: googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW };
	if (isGemma4Model(model) || model.id.toLowerCase().includes("gemini-2.5-pro")) return {};
	return { thinkingBudget: 0 };
}
/** @internal Directly tested provider implementation detail. */
function isGemma4Model(model) {
	return /gemma-?4/.test(model.id.toLowerCase());
}
function isGemini3ProModel(model) {
	return /gemini-(?:3(?:\.\d+)?-pro|pro-latest)/.test(model.id.toLowerCase());
}
function isGemini3FlashModel(model) {
	return /gemini-(?:3(?:\.\d+)?-flash|flash(?:-lite)?-latest)/.test(model.id.toLowerCase());
}
function getGoogleThinkingLevel(effort, model) {
	if (isGemini3ProModel(model)) switch (effort) {
		case "minimal":
		case "low": return ThinkingLevel.LOW;
		case "medium":
		case "high": return ThinkingLevel.HIGH;
	}
	if (isGemma4Model(model)) switch (effort) {
		case "minimal":
		case "low": return ThinkingLevel.MINIMAL;
		case "medium":
		case "high": return ThinkingLevel.HIGH;
	}
	switch (effort) {
		case "minimal": return isGemini3FlashModel(model) && !googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL;
		case "low": return ThinkingLevel.LOW;
		case "medium": return ThinkingLevel.MEDIUM;
		case "high": return ThinkingLevel.HIGH;
	}
	return ThinkingLevel.HIGH;
}
function getGoogleBudget(model, effort, customBudgets) {
	if (customBudgets?.[effort] !== void 0) return customBudgets[effort];
	if (model.id.includes("2.5-pro")) return {
		minimal: 128,
		low: 2048,
		medium: 8192,
		high: 32768
	}[effort];
	if (model.id.includes("2.5-flash-lite")) return {
		minimal: 512,
		low: 2048,
		medium: 8192,
		high: 24576
	}[effort];
	if (model.id.includes("2.5-flash")) return {
		minimal: 128,
		low: 2048,
		medium: 8192,
		high: 24576
	}[effort];
	return -1;
}
//#endregion
export { buildGoogleSimpleThinking as n, runGoogleGenerateContentLifecycle as r, buildGoogleGenerateContentParams as t };
