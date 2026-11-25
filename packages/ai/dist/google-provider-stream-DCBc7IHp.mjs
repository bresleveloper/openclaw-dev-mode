import "./src-Ii137Gdc.mjs";
import { a as asRecord } from "./record-coerce-BgUo6bj4.mjs";
import { t as omitNullRequestHeaders } from "./request-headers-DJ4QrMC_.mjs";
import { t as AssistantMessageEventStream } from "./event-stream-Bf6cK7-d.mjs";
import { a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-Dm4e6L6R.mjs";
import { n as buildManagedModelFetch } from "./host-policy-fDXTduGF.mjs";
import { n as buildBaseOptions } from "./simple-options-Bet1Zroc.mjs";
import { m as mergeTransportHeaders } from "./transport-stream-shared-DPUASGj0.mjs";
import { t as createAssistantOutput } from "./assistant-output-DPK9pdyx.mjs";
import { a as runGoogleGenerateContentLifecycle, i as buildGoogleSimpleThinking, t as buildGoogleGenerateContentParams } from "./google-shared-CbxPxwgm.mjs";
import { ResourceScope } from "@google/genai";
// packages/ai/src/providers/google-http-options.ts
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
	const headers = profile === "vertex" ? mergeTransportHeaders(model.headers, optionsHeaders) : getAiTransportHost().resolveProviderRequestHeaders({
		provider: model.provider,
		api: model.api,
		baseUrl: model.baseUrl,
		callerHeaders: mergeTransportHeaders(model.headers, optionsHeaders),
		precedence: "caller-wins",
		model
	});
	if (headers) httpOptions.headers = omitNullRequestHeaders(resolveAiTransportHeaderSentinels(headers));
	return Object.keys(httpOptions).length > 0 ? httpOptions : void 0;
}
// packages/ai/src/providers/google-provider-stream.ts
function createGoogleGenerateContentStreams(api, createClient, resolveSimpleApiKey) {
	let toolCallCounter = 0;
	const stream = (model, context, options) => {
		const events = new AssistantMessageEventStream();
		runGoogleGenerateContentLifecycle({
			stream: events,
			model,
			tools: context.tools,
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
			const { topP, seed } = asRecord(options);
			return stream(model, context, {
				...buildBaseOptions(model, options, resolveSimpleApiKey?.(model, options)),
				...typeof topP === "number" ? { topP } : {},
				...typeof seed === "number" ? { seed } : {},
				thinking: buildGoogleSimpleThinking(model, options)
			});
		}
	};
}
export { buildGoogleHttpOptions as n, createGoogleGenerateContentStreams as t };
