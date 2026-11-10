import { k as clampThinkingLevel } from "./host-CWt55nnF.mjs";
import { t as sanitizeSurrogates } from "./sanitize-unicode-CRGuMONI.mjs";
import { w as stripSystemPromptCacheBoundary } from "./simple-options-xJkqrG_E.mjs";
import { b as transportAbortError, c as failTransportStream, h as notifyProviderStreamOpened } from "./transport-stream-shared-lhgkTOz3.mjs";
import { n as transformProviderMessages } from "./assistant-output-BnQm3fov.mjs";
import { isGoogleGemini3ProModel, isGoogleGemini3ThinkingLevelModel } from "./internal/google-model-family.mjs";
import { a as googleFlashSupportsMinimalThinking, i as consumeGoogleGenerateContentStream, n as projectGoogleMessages, r as requiresGoogleToolCallId, t as convertGoogleTools } from "./google-messages-DQMgG5yG.mjs";
import { FunctionCallingConfigMode, ThinkingLevel } from "@google/genai";
//#region packages/ai/src/providers/google-shared.ts
function convertMessages(model, context) {
	return projectGoogleMessages({
		model,
		messages: transformProviderMessages(context.messages, model, (id) => requiresGoogleToolCallId(model.id) ? id.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) : id),
		replay: "signed-parts",
		requiresToolCallSignature: model.provider !== "google-gemini-cli" && isGoogleGemini3ThinkingLevelModel(model.id)
	});
}
function mapToolChoice(choice) {
	return choice === "none" ? FunctionCallingConfigMode.NONE : choice === "any" ? FunctionCallingConfigMode.ANY : FunctionCallingConfigMode.AUTO;
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
	const contents = convertMessages(model, context);
	const config = {
		...options.temperature !== void 0 && { temperature: options.temperature },
		...options.topP !== void 0 && { topP: options.topP },
		...options.maxTokens !== void 0 && { maxOutputTokens: options.maxTokens },
		...options.stop !== void 0 && options.stop.length > 0 && { stopSequences: options.stop },
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
	return {
		enabled: true,
		budgetTokens: getGoogleBudget(model, effort, options.thinkingBudgets)
	};
}
function buildGoogleSimpleThinking(model, options) {
	return buildGoogleThinking(model, options, false);
}
function buildGoogleInteractionsSimpleThinking(model, options) {
	return buildGoogleThinking(model, options, true);
}
function getDisabledGoogleThinkingConfig(model) {
	if (isGoogleGemini3ProModel(model.id)) return { thinkingLevel: ThinkingLevel.LOW };
	if (isGoogleGemini3ThinkingLevelModel(model.id)) return { thinkingLevel: googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW };
	if (isGemma4Model(model) || model.id.toLowerCase().includes("gemini-2.5-pro")) return {};
	return { thinkingBudget: 0 };
}
/** @internal Directly tested provider implementation detail. */
function isGemma4Model(model) {
	return /gemma-?4/.test(model.id.toLowerCase());
}
function getGoogleThinkingLevel(effort, model) {
	const lowEffort = effort === "minimal" || effort === "low";
	if (isGoogleGemini3ProModel(model.id)) return lowEffort ? ThinkingLevel.LOW : ThinkingLevel.HIGH;
	if (isGemma4Model(model)) return lowEffort ? ThinkingLevel.MINIMAL : ThinkingLevel.HIGH;
	switch (effort) {
		case "minimal": return googleFlashSupportsMinimalThinking(model.id) ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;
		case "low": return ThinkingLevel.LOW;
		case "medium": return ThinkingLevel.MEDIUM;
		case "high": return ThinkingLevel.HIGH;
	}
	return ThinkingLevel.HIGH;
}
function getGoogleBudget(model, effort, customBudgets) {
	if (customBudgets?.[effort] !== void 0) return customBudgets[effort];
	const isPro = model.id.includes("2.5-pro");
	if (isPro || model.id.includes("2.5-flash")) return {
		minimal: !isPro && model.id.includes("2.5-flash-lite") ? 512 : 128,
		low: 2048,
		medium: 8192,
		high: isPro ? 32768 : 24576
	}[effort];
	return -1;
}
//#endregion
export { runGoogleGenerateContentLifecycle as i, buildGoogleInteractionsSimpleThinking as n, buildGoogleSimpleThinking as r, buildGoogleGenerateContentParams as t };
