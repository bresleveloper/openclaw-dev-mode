import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { s as buildBaseOptions } from "./sanitize-unicode-DcA7E1vi.js";
import { n as getEnvApiKey } from "./env-api-keys-8q9bEA0v.js";
import { a as runGoogleGenerateContentLifecycle, i as getDisabledGoogleThinkingConfig, n as buildGoogleSimpleThinking, r as createGoogleAssistantOutput, t as buildGoogleGenerateContentParams } from "./google-shared-cZOTQdZo.js";
import { GoogleGenAI } from "@google/genai";
//#region src/llm/providers/google.ts
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
	return streamGoogle(model, context, {
		...buildBaseOptions(model, options, apiKey),
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
	if (model.headers || optionsHeaders) httpOptions.headers = {
		...model.headers,
		...optionsHeaders
	};
	return new GoogleGenAI({
		apiKey,
		httpOptions: Object.keys(httpOptions).length > 0 ? httpOptions : void 0
	});
}
function buildParams(model, context, options = {}) {
	return buildGoogleGenerateContentParams(model, context, options, { getDisabledThinkingConfig: (modelLocal) => getDisabledGoogleThinkingConfig(modelLocal, { includeGemma4: true }) });
}
//#endregion
export { streamGoogle, streamSimpleGoogle };
