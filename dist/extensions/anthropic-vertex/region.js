import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { homedir, platform } from "node:os";
import { join } from "node:path";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
//#region extensions/anthropic-vertex/region.ts
/**
* Anthropic Vertex region, project, and ADC auth detection helpers. They keep
* credential probing local to the provider plugin.
*/
const ANTHROPIC_VERTEX_DEFAULT_REGION = "global";
const ANTHROPIC_VERTEX_REGION_RE = /^[a-z0-9-]+$/;
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
const ANTHROPIC_VERTEX_ADC_FILE_MAX_BYTES = 1048576;
/** Resolve the configured Vertex region, defaulting to global. */
function resolveAnthropicVertexRegion(env = process.env) {
	const region = normalizeOptionalString(env.GOOGLE_CLOUD_LOCATION) || normalizeOptionalString(env.CLOUD_ML_REGION);
	return region && ANTHROPIC_VERTEX_REGION_RE.test(region) ? region : ANTHROPIC_VERTEX_DEFAULT_REGION;
}
/** Resolve the Vertex project id from explicit env or ADC files. */
function resolveAnthropicVertexProjectId(env = process.env) {
	return normalizeOptionalString(env.ANTHROPIC_VERTEX_PROJECT_ID) || normalizeOptionalString(env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalString(env.GOOGLE_CLOUD_PROJECT_ID) || resolveAnthropicVertexProjectIdFromAdc(env);
}
function hasAnthropicVertexMetadataServerAdc(env = process.env) {
	const explicitMetadataOptIn = normalizeOptionalString(env.ANTHROPIC_VERTEX_USE_GCP_METADATA);
	return explicitMetadataOptIn === "1" || normalizeLowercaseStringOrEmpty(explicitMetadataOptIn) === "true";
}
function resolveAnthropicVertexHomeDir(env = process.env) {
	return normalizeOptionalString(env.HOME) || normalizeOptionalString(env.USERPROFILE) || homedir();
}
function resolveAnthropicVertexDefaultAdcPath(env = process.env) {
	return platform() === "win32" ? join(normalizeOptionalString(env.APPDATA) ?? join(resolveAnthropicVertexHomeDir(env), "AppData", "Roaming"), "gcloud", "application_default_credentials.json") : join(resolveAnthropicVertexHomeDir(env), ".config", "gcloud", "application_default_credentials.json");
}
function resolveAnthropicVertexAdcCredentialsPathCandidate(env = process.env) {
	const explicit = normalizeOptionalString(env.GOOGLE_APPLICATION_CREDENTIALS);
	if (explicit) return explicit;
	return resolveAnthropicVertexDefaultAdcPath(env);
}
function resolveAnthropicVertexAdcCredentials(env = process.env) {
	const credentialsPath = resolveAnthropicVertexAdcCredentialsPathCandidate(env);
	const text = tryReadSecretFileSync(credentialsPath, "Anthropic Vertex ADC credentials", {
		maxBytes: ANTHROPIC_VERTEX_ADC_FILE_MAX_BYTES,
		rejectHardlinks: false
	});
	if (!text) return;
	const parsed = JSON.parse(text);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`Anthropic Vertex ADC credentials must be a JSON object: ${credentialsPath}`);
	return parsed;
}
function canReadAnthropicVertexAdc(env = process.env) {
	try {
		return resolveAnthropicVertexAdcCredentials(env) !== void 0;
	} catch {
		return false;
	}
}
function resolveAnthropicVertexProjectIdFromAdc(env = process.env) {
	try {
		const parsed = resolveAnthropicVertexAdcCredentials(env);
		if (!parsed) return;
		return normalizeOptionalString(parsed.project_id) || normalizeOptionalString(parsed.quota_project_id);
	} catch {
		return;
	}
}
/** Return whether ADC credentials or metadata-server auth are available. */
function hasAnthropicVertexCredentials(env = process.env) {
	return hasAnthropicVertexMetadataServerAdc(env) || canReadAnthropicVertexAdc(env);
}
/** Return whether Anthropic Vertex has usable auth for implicit registration. */
function hasAnthropicVertexAvailableAuth(env = process.env) {
	return hasAnthropicVertexCredentials(env);
}
/** Resolve the synthetic config API key marker for Anthropic Vertex auth. */
function resolveAnthropicVertexConfigApiKey(env = process.env) {
	return hasAnthropicVertexAvailableAuth(env) ? GCP_VERTEX_CREDENTIALS_MARKER : void 0;
}
//#endregion
export { hasAnthropicVertexAvailableAuth, hasAnthropicVertexCredentials, resolveAnthropicVertexAdcCredentials, resolveAnthropicVertexConfigApiKey, resolveAnthropicVertexProjectId, resolveAnthropicVertexRegion };
