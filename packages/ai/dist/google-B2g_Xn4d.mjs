import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { n as buildManagedModelFetch } from "./host-policy-BwhNNGQR.mjs";
import { f as mergeTransportHeaders } from "./transport-stream-shared-CCR7hSW0.mjs";
import { n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { n as getEnvApiKey } from "./env-api-keys-CyX4VKGO.mjs";
import { t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { n as resolveOpencodeSessionHeaders } from "./session-affinity-DA4WHv1h.mjs";
import { t as requireApiKey } from "./required-api-key-D4kn3252.mjs";
import { i as runGoogleGenerateContentLifecycle, r as buildGoogleSimpleThinking, t as buildGoogleGenerateContentParams } from "./google-shared-V8jogVPq.mjs";
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
		buildParams: () => buildGoogleGenerateContentParams(model, context, options),
		nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
	});
	return stream;
};
const streamSimpleGoogle = (model, context, options) => {
	const apiKey = requireApiKey(model.provider, options?.apiKey);
	const base = buildBaseOptions(model, options, apiKey);
	return streamGoogle(model, context, {
		...base,
		thinking: buildGoogleSimpleThinking(model, options)
	});
};
function createClient(model, apiKey, optionsHeaders) {
	const httpOptions = {};
	const fetcher = buildManagedModelFetch(model);
	if (fetcher) httpOptions.fetch = fetcher;
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
//#endregion
export { streamGoogle, streamSimpleGoogle };
