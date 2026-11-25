import { N as clampThinkingLevel } from "./host-Dm4e6L6R.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-B3kUqQ-q.mjs";
import { t as adjustMaxTokensForThinking, w as stripSystemPromptCacheBoundary } from "./simple-options-Bet1Zroc.mjs";
import { S as transportAbortError, _ as notifyProviderStreamOpened, l as failTransportStream, r as awaitProviderLifecycleCallback } from "./transport-stream-shared-DPUASGj0.mjs";
import { t as transformProviderMessages } from "./provider-transcript-transform-Ca0a3iL1.mjs";
import { isGoogleGemini3ThinkingLevelModel } from "./internal/google-model-family.mjs";
import { i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, s as googleFlashSupportsMinimalThinking, t as convertGoogleTools } from "./google-messages-DsCHuWeT.mjs";
import { FunctionCallingConfigMode, ThinkingLevel } from "@google/genai";
// packages/ai/src/providers/google-shared.ts
async function runGoogleGenerateContentLifecycle(params) {
	const { stream, model, output, options } = params;
	try {
		const client = params.createClient();
		let requestParams = params.buildParams();
		const nextParams = await awaitProviderLifecycleCallback(options?.onPayload ? () => options.onPayload?.(requestParams, model) : void 0, options?.signal);
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
			tools: params.tools,
			stream,
			signal: options?.signal,
			nextToolCallId: params.nextToolCallId
		});
	} catch (error) {
		const failure = options?.signal?.aborted ? transportAbortError(options.signal) : error;
		failTransportStream({
			stream,
			output,
			error: failure,
			signal: options?.signal
		});
	}
}
function buildGoogleGenerateContentParams(model, context, options = {}) {
	const contents = projectGoogleMessages({
		model,
		messages: transformProviderMessages(context.messages, model, (id) => requiresGoogleToolCallId(model.id) ? id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) : id),
		tools: context.tools,
		replay: "signed-parts",
		requiresToolCallSignature: model.provider !== "google-gemini-cli" && isGoogleGemini3ThinkingLevelModel(model.id)
	});
	const config = {
		...options.temperature !== void 0 && { temperature: options.temperature },
		...options.topP !== void 0 && { topP: options.topP },
		...options.seed !== void 0 && { seed: options.seed },
		...buildGoogleGenerationConfig(model, options.thinking, options.maxTokens),
		...options.stop !== void 0 && options.stop.length > 0 && { stopSequences: options.stop },
		...context.systemPrompt && { systemInstruction: sanitizeSurrogates(stripSystemPromptCacheBoundary(context.systemPrompt)) },
		...context.tools && context.tools.length > 0 && { tools: convertGoogleTools(context.tools) }
	};
	if (context.tools && context.tools.length > 0 && options.toolChoice) {
		const choice = options.toolChoice;
		config.toolConfig = { functionCallingConfig: { mode: choice === "none" ? FunctionCallingConfigMode.NONE : choice === "any" ? FunctionCallingConfigMode.ANY : FunctionCallingConfigMode.AUTO } };
	} else config.toolConfig = void 0;
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
/** Shared wire policy for the Gemini API and Vertex, with or without the Google SDK. */
function buildGoogleGenerationConfig(model, thinking, maxTokens) {
	let thinkingConfig;
	if (model.reasoning && thinking) {
		if (thinking.enabled) {
			thinkingConfig = { includeThoughts: true };
			if (thinking.level !== void 0) {
				const level = {
					MINIMAL: "minimal",
					LOW: "low",
					MEDIUM: "medium",
					HIGH: "high",
					THINKING_LEVEL_UNSPECIFIED: void 0
				}[thinking.level];
				thinkingConfig.thinkingLevel = level ? getGoogleThinkingLevel(level, model) : ThinkingLevel.THINKING_LEVEL_UNSPECIFIED;
			} else if (thinking.budgetTokens !== void 0) {
				if (isGoogleGemini3ThinkingLevelModel(model.id) && thinking.budgetTokens >= 0) {
					const budget = thinking.budgetTokens;
					thinkingConfig.thinkingLevel = getGoogleThinkingLevel(budget === 0 ? "minimal" : budget <= 2048 ? "low" : budget <= 8192 ? "medium" : "high", model);
				} else thinkingConfig.thinkingBudget = thinking.budgetTokens;
			}
		} else thinkingConfig = getDisabledGoogleThinkingConfig(model);
		if (model.id.toLowerCase().includes("gemini-2.5-pro") && thinkingConfig.thinkingBudget === 0) delete thinkingConfig.thinkingBudget;
	}
	let maxOutputTokens = maxTokens;
	if (maxTokens !== void 0 && model.reasoning) {
		if (model.id.toLowerCase().includes("gemini-2.5-pro") && thinking?.enabled === false) thinkingConfig = { thinkingBudget: 128 };
		else if (model.id.toLowerCase().includes("gemini-2.5-pro") && thinking?.budgetTokens === 0 && thinkingConfig) thinkingConfig.thinkingBudget = 128;
		const budget = thinkingConfig?.thinkingBudget;
		if (thinkingConfig && budget !== void 0 && budget >= 0) {
			const adjusted = adjustMaxTokensForThinking(maxTokens, model.maxTokens, "low", { low: budget });
			maxOutputTokens = adjusted.maxTokens;
			thinkingConfig.thinkingBudget = adjusted.thinkingBudget;
		}
	}
	return {
		...maxOutputTokens !== void 0 && { maxOutputTokens },
		...thinkingConfig && Object.keys(thinkingConfig).length > 0 && { thinkingConfig }
	};
}
function isAdaptiveGoogleReasoningLevel(value) {
	return value === "adaptive";
}
function buildGoogleThinking(model, options, interactions) {
	const disabled = () => {
		const level = interactions && model.reasoning ? getDisabledGoogleThinkingConfig(model).thinkingLevel : void 0;
		return {
			enabled: false,
			...level ? { level } : {}
		};
	};
	if (!options?.reasoning || options.reasoning === "off") return disabled();
	if (isAdaptiveGoogleReasoningLevel(options.reasoning)) {
		if (!model.reasoning) return { enabled: false };
		if (isGemma4Model(model)) return {
			enabled: true,
			level: ThinkingLevel.HIGH
		};
		return isGoogleGemini3ThinkingLevelModel(model.id) ? { enabled: true } : {
			enabled: true,
			budgetTokens: -1
		};
	}
	const clampedReasoning = clampThinkingLevel(model, options.reasoning);
	if (clampedReasoning === "off") return disabled();
	const effort = clampedReasoning === "max" ? "high" : clampedReasoning;
	if (interactions || isGoogleGemini3ThinkingLevelModel(model.id) || isGemma4Model(model)) return {
		enabled: true,
		level: getGoogleThinkingLevel(effort, model)
	};
	const customBudgets = options.thinkingBudgets;
	let budgetTokens;
	if (customBudgets?.[effort] !== void 0) budgetTokens = customBudgets[effort];
	else {
		const isPro = model.id.includes("2.5-pro");
		if (isPro || model.id.includes("2.5-flash")) budgetTokens = {
			minimal: !isPro && model.id.includes("2.5-flash-lite") ? 512 : 128,
			low: 2048,
			medium: 8192,
			high: isPro ? 32768 : 24576
		}[effort];
	}
	return {
		enabled: true,
		budgetTokens
	};
}
function buildGoogleSimpleThinking(model, options) {
	return buildGoogleThinking(model, options, false);
}
function buildGoogleInteractionsSimpleThinking(model, options) {
	return buildGoogleThinking(model, options, true);
}
function getDisabledGoogleThinkingConfig(model) {
	if (isGoogleGemini3ThinkingLevelModel(model.id)) return { thinkingLevel: googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW };
	if (isGemma4Model(model) || model.id.toLowerCase().includes("gemini-2.5-pro")) return {};
	return { thinkingBudget: 0 };
}
/** @internal Directly tested provider implementation detail. */
function isGemma4Model(model) {
	return /gemma-?4/.test(model.id.toLowerCase());
}
function getGoogleThinkingLevel(effort, model) {
	if (isGemma4Model(model)) return effort === "minimal" || effort === "low" ? ThinkingLevel.MINIMAL : ThinkingLevel.HIGH;
	switch (effort) {
		case "minimal": return googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
		case "low": return ThinkingLevel.LOW;
		case "medium": return ThinkingLevel.MEDIUM;
		case "high": return ThinkingLevel.HIGH;
	}
	return ThinkingLevel.HIGH;
}
export { runGoogleGenerateContentLifecycle as a, buildGoogleSimpleThinking as i, buildGoogleGenerationConfig as n, buildGoogleInteractionsSimpleThinking as r, buildGoogleGenerateContentParams as t };
