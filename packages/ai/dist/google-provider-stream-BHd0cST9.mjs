import { t as AssistantMessageEventStream } from "./event-stream-X2gmsUWv.mjs";
import { a as asRecord } from "./record-coerce-CNDovvft.mjs";
import { a as resolveAiTransportHeaderSentinels } from "./host-CWt55nnF.mjs";
import { n as buildManagedModelFetch } from "./host-policy-Dm7PM6AD.mjs";
import { n as buildBaseOptions } from "./simple-options-xJkqrG_E.mjs";
import { f as mergeTransportHeaders } from "./transport-stream-shared-lhgkTOz3.mjs";
import { t as createAssistantOutput } from "./assistant-output-BnQm3fov.mjs";
import { i as runGoogleGenerateContentLifecycle, r as buildGoogleSimpleThinking, t as buildGoogleGenerateContentParams } from "./google-shared-vtag8bj5.mjs";
import { ResourceScope } from "@google/genai";
//#region packages/ai/src/providers/google-http-options.ts
function buildGoogleHttpOptions(model, optionsHeaders, profile) {
	const httpOptions = {};
	const fetcher = buildManagedModelFetch(model);
	if (fetcher) httpOptions.fetch = fetcher;
	if (profile === "vertex") {
		const baseUrl = model.baseUrl.trim();
		if (baseUrl && !baseUrl.includes("{location}")) {
			httpOptions.baseUrl = baseUrl;
			httpOptions.baseUrlResourceScope = ResourceScope.COLLECTION;
			const url = URL.parse(baseUrl);
			if (url ? url.pathname.split("/").some((part) => /^v\d+(?:beta\d*)?$/.test(part)) : /(?:^|\/)v\d+(?:beta\d*)?(?:\/|$)/.test(baseUrl)) httpOptions.apiVersion = "";
		}
	} else if (model.baseUrl) {
		httpOptions.baseUrl = model.baseUrl;
		httpOptions.apiVersion = "";
	} else httpOptions.apiVersion = "v1beta";
	if (model.headers || optionsHeaders) httpOptions.headers = resolveAiTransportHeaderSentinels(profile === "vertex" ? {
		...model.headers,
		...optionsHeaders
	} : mergeTransportHeaders(model.headers, optionsHeaders));
	return Object.keys(httpOptions).length > 0 ? httpOptions : void 0;
}
//#endregion
//#region packages/ai/src/providers/google-provider-stream.ts
function createGoogleGenerateContentStreams(api, createClient, resolveSimpleApiKey) {
	let toolCallCounter = 0;
	const stream = (model, context, options) => {
		const events = new AssistantMessageEventStream();
		runGoogleGenerateContentLifecycle({
			stream: events,
			model,
			output: createAssistantOutput(model, api),
			options,
			createClient: () => createClient(model, options),
			buildParams: () => buildGoogleGenerateContentParams(model, context, options),
			nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
		});
		return events;
	};
	return {
		stream,
		streamSimple: (model, context, options) => {
			const topP = asRecord(options).topP;
			return stream(model, context, {
				...buildBaseOptions(model, options, resolveSimpleApiKey?.(model, options)),
				...typeof topP === "number" ? { topP } : {},
				thinking: buildGoogleSimpleThinking(model, options)
			});
		}
	};
}
//#endregion
export { buildGoogleHttpOptions as n, createGoogleGenerateContentStreams as t };
