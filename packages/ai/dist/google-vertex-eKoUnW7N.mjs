import { o as normalizeOptionalString } from "./string-coerce-Cj8sqWHx.mjs";
import { r as getAiTransportHost } from "./host-CWt55nnF.mjs";
import { n as buildGoogleHttpOptions, t as createGoogleGenerateContentStreams } from "./google-provider-stream-BHd0cST9.mjs";
import { GoogleGenAI } from "@google/genai";
//#region packages/ai/src/providers/google-vertex.ts
const API_VERSION = "v1";
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const streams = createGoogleGenerateContentStreams("google-vertex", createClient);
const streamGoogleVertex = streams.stream;
const streamSimpleGoogleVertex = streams.streamSimple;
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
		httpOptions: buildGoogleHttpOptions(model, options?.headers, "vertex")
	});
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
