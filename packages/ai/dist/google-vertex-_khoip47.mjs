import { t as AssistantMessageEventStream } from "./event-stream-C5AbCAaZ.mjs";
import { a as normalizeOptionalString } from "./string-coerce-CtgOVOSv.mjs";
import { a as resolveAiTransportHeaderSentinels, r as getAiTransportHost } from "./host-u3o8XiAp.mjs";
import { n as buildManagedModelFetch } from "./host-policy-BwhNNGQR.mjs";
import { n as buildBaseOptions } from "./simple-options-7QuSKriJ.mjs";
import { t as createAssistantOutput } from "./assistant-output-D5762GPH.mjs";
import { i as runGoogleGenerateContentLifecycle, r as buildGoogleSimpleThinking, t as buildGoogleGenerateContentParams } from "./google-shared-V8jogVPq.mjs";
import { GoogleGenAI, ResourceScope } from "@google/genai";
//#region packages/ai/src/providers/google-vertex.ts
const API_VERSION = "v1";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
let toolCallCounter = 0;
const streamGoogleVertex = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	const output = createAssistantOutput(model, "google-vertex");
	runGoogleGenerateContentLifecycle({
		stream,
		model,
		output,
		options,
		createClient: () => createClient(model, options),
		buildParams: () => buildGoogleGenerateContentParams(model, context, options),
		nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
	});
	return stream;
};
const streamSimpleGoogleVertex = (model, context, options) => {
	const base = buildBaseOptions(model, options, void 0);
	return streamGoogleVertex(model, context, {
		...base,
		thinking: buildGoogleSimpleThinking(model, options)
	});
};
function createClient(model, options) {
	const apiKey = resolveApiKey(options);
	const credentials = apiKey ? { apiKey: getAiTransportHost().resolveSecretSentinel(apiKey) } : {
		project: resolveProject(options),
		location: resolveLocation(options)
	};
	return new GoogleGenAI({
		vertexai: true,
		...credentials,
		apiVersion: API_VERSION,
		httpOptions: buildHttpOptions(model, options?.headers)
	});
}
function buildHttpOptions(model, optionsHeaders) {
	const httpOptions = {};
	const fetcher = buildManagedModelFetch(model);
	if (fetcher) httpOptions.fetch = fetcher;
	const baseUrl = resolveCustomBaseUrl(model.baseUrl);
	if (baseUrl) {
		httpOptions.baseUrl = baseUrl;
		httpOptions.baseUrlResourceScope = ResourceScope.COLLECTION;
		if (baseUrlIncludesApiVersion(baseUrl)) httpOptions.apiVersion = "";
	}
	if (model.headers || optionsHeaders) httpOptions.headers = resolveAiTransportHeaderSentinels({
		...model.headers,
		...optionsHeaders
	});
	return Object.keys(httpOptions).length > 0 ? httpOptions : void 0;
}
function resolveCustomBaseUrl(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed || trimmed.includes("{location}")) return;
	return trimmed;
}
function baseUrlIncludesApiVersion(baseUrl) {
	const url = URL.parse(baseUrl);
	return url ? url.pathname.split("/").some((part) => /^v\d+(?:beta\d*)?$/.test(part)) : /(?:^|\/)v\d+(?:beta\d*)?(?:\/|$)/.test(baseUrl);
}
function resolveApiKey(options) {
	const apiKey = options?.apiKey?.trim() || process.env.GOOGLE_CLOUD_API_KEY?.trim();
	if (!apiKey || apiKey === GCP_VERTEX_CREDENTIALS_MARKER || /^<[^>]+>$/.test(apiKey)) return;
	return apiKey;
}
function resolveProject(options) {
	const project = normalizeOptionalString(options?.project) || normalizeOptionalString(process.env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalString(process.env.GCLOUD_PROJECT);
	if (!project) throw new Error("Vertex AI requires a project ID. Set GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT or pass project in options.");
	return project;
}
function resolveLocation(options) {
	const location = normalizeOptionalString(options?.location) || normalizeOptionalString(process.env.GOOGLE_CLOUD_LOCATION);
	if (!location) throw new Error("Vertex AI requires a location. Set GOOGLE_CLOUD_LOCATION or pass location in options.");
	return location;
}
//#endregion
export { streamGoogleVertex, streamSimpleGoogleVertex };
