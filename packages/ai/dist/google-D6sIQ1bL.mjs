import { n as getEnvApiKey } from "./env-api-keys-CtMlqaQ4.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.mjs";
import { n as getAiTransportHost, r as resolveAiTransportHeaderSentinels } from "./host-4t713IeR.mjs";
import { o as buildBaseOptions } from "./transform-messages-BhGF_fF4.mjs";
import { a as runGoogleGenerateContentLifecycle, i as getDisabledGoogleThinkingConfig, n as buildGoogleSimpleThinking, r as createGoogleAssistantOutput, t as buildGoogleGenerateContentParams } from "./google-shared-ZPSl2qTi.mjs";
import { GoogleGenAI } from "@google/genai";
//#region packages/ai/src/providers/google.ts
let toolCallCounter = 0;
const streamGoogle = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	runGoogleGenerateContentLifecycle({
		stream,
		model,
		output: createGoogleAssistantOutput(model, "google-generative-ai"),
		options,
		createClient: () => {
			return createClient(model, options?.apiKey || getEnvApiKey(model.provider) || "", options?.headers);
		},
		buildParams: () => buildParams(model, context, options),
		nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
	});
	return stream;
};
const streamSimpleGoogle = (model, context, options) => {
	const apiKey = options?.apiKey || getEnvApiKey(model.provider);
	if (!apiKey) throw new Error(`No API key for provider: ${model.provider}`);
	const base = buildBaseOptions(model, options, apiKey);
	return streamGoogle(model, context, {
		...base,
		thinking: buildGoogleSimpleThinking(model, options, {
			includeGemma4ThinkingLevel: true,
			useFlashLiteBudgets: true
		})
	});
};
function createClient(model, apiKey, optionsHeaders) {
	const httpOptions = {};
	if (model.baseUrl) {
		httpOptions.baseUrl = model.baseUrl;
		httpOptions.apiVersion = "";
	}
	if (model.headers || optionsHeaders) httpOptions.headers = resolveAiTransportHeaderSentinels({
		...model.headers,
		...optionsHeaders
	});
	return new GoogleGenAI({
		apiKey: apiKey ? getAiTransportHost().resolveSecretSentinel(apiKey) : void 0,
		httpOptions: Object.keys(httpOptions).length > 0 ? httpOptions : void 0
	});
}
function buildParams(model, context, options = {}) {
	return buildGoogleGenerateContentParams(model, context, options, { getDisabledThinkingConfig: (modelLocal) => getDisabledGoogleThinkingConfig(modelLocal, { includeGemma4: true }) });
}
//#endregion
export { streamGoogle, streamSimpleGoogle };
