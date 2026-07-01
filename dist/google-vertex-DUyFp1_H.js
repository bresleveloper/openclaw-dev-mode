import { t as AssistantMessageEventStream } from "./event-stream-ReMmOTzX.js";
import { s as buildBaseOptions } from "./sanitize-unicode-DcA7E1vi.js";
import { a as runGoogleGenerateContentLifecycle, i as getDisabledGoogleThinkingConfig, n as buildGoogleSimpleThinking, r as createGoogleAssistantOutput, t as buildGoogleGenerateContentParams } from "./google-shared-cZOTQdZo.js";
import { GoogleGenAI, ResourceScope, ThinkingLevel } from "@google/genai";
//#region src/llm/providers/google-vertex.ts
const API_VERSION = "v1";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const THINKING_LEVEL_MAP = {
	THINKING_LEVEL_UNSPECIFIED: ThinkingLevel.THINKING_LEVEL_UNSPECIFIED,
	MINIMAL: ThinkingLevel.MINIMAL,
	LOW: ThinkingLevel.LOW,
	MEDIUM: ThinkingLevel.MEDIUM,
	HIGH: ThinkingLevel.HIGH
};
let toolCallCounter = 0;
const streamGoogleVertex = (model, context, options) => {
	const stream = new AssistantMessageEventStream();
	runGoogleGenerateContentLifecycle({
		stream,
		model,
		output: createGoogleAssistantOutput(model, "google-vertex"),
		options,
		createClient: () => {
			const apiKey = resolveApiKey(options);
			return apiKey ? createClientWithApiKey(model, apiKey, options?.headers) : createClient(model, resolveProject(options), resolveLocation(options), options?.headers);
		},
		buildParams: () => buildParams(model, context, options),
		nextToolCallId: (name) => `${name}_${Date.now()}_${++toolCallCounter}`
	});
	return stream;
};
const streamSimpleGoogleVertex = (model, context, options) => {
	return streamGoogleVertex(model, context, {
		...buildBaseOptions(model, options, void 0),
		thinking: buildGoogleSimpleThinking(model, options)
	});
};
function createClient(model, project, location, optionsHeaders) {
	return new GoogleGenAI({
		vertexai: true,
		project,
		location,
		apiVersion: API_VERSION,
		httpOptions: buildHttpOptions(model, optionsHeaders)
	});
}
function createClientWithApiKey(model, apiKey, optionsHeaders) {
	return new GoogleGenAI({
		vertexai: true,
		apiKey,
		apiVersion: API_VERSION,
		httpOptions: buildHttpOptions(model, optionsHeaders)
	});
}
function buildHttpOptions(model, optionsHeaders) {
	const httpOptions = {};
	const baseUrl = resolveCustomBaseUrl(model.baseUrl);
	if (baseUrl) {
		httpOptions.baseUrl = baseUrl;
		httpOptions.baseUrlResourceScope = ResourceScope.COLLECTION;
		if (baseUrlIncludesApiVersion(baseUrl)) httpOptions.apiVersion = "";
	}
	if (model.headers || optionsHeaders) httpOptions.headers = {
		...model.headers,
		...optionsHeaders
	};
	return Object.keys(httpOptions).length > 0 ? httpOptions : void 0;
}
function resolveCustomBaseUrl(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed || trimmed.includes("{location}")) return;
	return trimmed;
}
function baseUrlIncludesApiVersion(baseUrl) {
	try {
		return new URL(baseUrl).pathname.split("/").some((part) => /^v\d+(?:beta\d*)?$/.test(part));
	} catch {
		return /(?:^|\/)v\d+(?:beta\d*)?(?:\/|$)/.test(baseUrl);
	}
}
function resolveApiKey(options) {
	const apiKey = options?.apiKey?.trim() || process.env.GOOGLE_CLOUD_API_KEY?.trim();
	if (!apiKey || apiKey === GCP_VERTEX_CREDENTIALS_MARKER || isPlaceholderApiKey(apiKey)) return;
	return apiKey;
}
function isPlaceholderApiKey(apiKey) {
	return /^<[^>]+>$/.test(apiKey);
}
function resolveProject(options) {
	const project = options?.project || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
	if (!project) throw new Error("Vertex AI requires a project ID. Set GOOGLE_CLOUD_PROJECT/GCLOUD_PROJECT or pass project in options.");
	return project;
}
function resolveLocation(options) {
	const location = options?.location || process.env.GOOGLE_CLOUD_LOCATION;
	if (!location) throw new Error("Vertex AI requires a location. Set GOOGLE_CLOUD_LOCATION or pass location in options.");
	return location;
}
function buildParams(model, context, options = {}) {
	return buildGoogleGenerateContentParams(model, context, options, {
		mapThinkingLevel: mapVertexThinkingLevel,
		getDisabledThinkingConfig: (modelLocal) => getDisabledGoogleThinkingConfig(modelLocal, { mapThinkingLevel: mapVertexThinkingLevel })
	});
}
function mapVertexThinkingLevel(level) {
	return THINKING_LEVEL_MAP[level];
}
//#endregion
export { streamGoogleVertex, streamSimpleGoogleVertex };
