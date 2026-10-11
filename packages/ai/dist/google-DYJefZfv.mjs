import { n as getEnvApiKey } from "./env-api-keys-DrgeBuva.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-D8PARQfL.mjs";
import { n as getAiTransportHost, r as resolveAiTransportHeaderSentinels } from "./host-yTvBrYM2.mjs";
import { n as buildBaseOptions } from "./simple-options-np1XPuhm.mjs";
import { u as mergeTransportHeaders } from "./transport-stream-shared-B5RioB_Q.mjs";
import { t as createAssistantOutput } from "./assistant-output-DM1JBNs1.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-Bcunsn4I.mjs";
import { n as buildGoogleSimpleThinking, r as runGoogleGenerateContentLifecycle, t as buildGoogleGenerateContentParams } from "./google-shared-Bok4I6zB.mjs";
import { GoogleGenAI } from "@google/genai";
//#region packages/ai/src/providers/google.ts
let toolCallCounter = 0;
const streamGoogle = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output = createAssistantOutput(model, "google-generative-ai");
	runGoogleGenerateContentLifecycle({
		stream,
		model,
		output,
		options,
		createClient: () => {
			return createClient(model, options?.apiKey || getEnvApiKey(model.provider) || "", resolveOpencodeSessionHeaders(model, options));
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
		thinking: buildGoogleSimpleThinking(model, options)
	});
};
function createClient(model, apiKey, optionsHeaders) {
	const httpOptions = {};
	if (model.baseUrl) {
		httpOptions.baseUrl = model.baseUrl;
		httpOptions.apiVersion = "";
	}
	if (model.headers || optionsHeaders) httpOptions.headers = resolveAiTransportHeaderSentinels(mergeTransportHeaders(model.headers, optionsHeaders));
	const resolvedApiKey = apiKey ? getAiTransportHost().resolveSecretSentinel(apiKey) : void 0;
	return new GoogleGenAI({
		apiKey: resolvedApiKey,
		httpOptions: Object.keys(httpOptions).length > 0 ? httpOptions : void 0
	});
}
function buildParams(model, context, options = {}) {
	return buildGoogleGenerateContentParams(model, context, options);
}
//#endregion
export { streamGoogle, streamSimpleGoogle };
