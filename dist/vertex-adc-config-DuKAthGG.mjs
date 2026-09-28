import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { s as readSecretFileSync } from "./secret-file-BqGFHdII.mjs";
import "./secret-file-runtime-C-pb0auB.mjs";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
//#region extensions/google/vertex-adc-config.ts
const GCP_VERTEX_CREDENTIALS_MARKER = "gcp-vertex-credentials";
function isGoogleVertexCredentialsMarker(apiKey) {
	return apiKey === void 0 || apiKey === GCP_VERTEX_CREDENTIALS_MARKER;
}
function hasGoogleVertexProjectEnv(env) {
	return Boolean(normalizeOptionalString(env.GOOGLE_CLOUD_PROJECT) || normalizeOptionalString(env.GCLOUD_PROJECT));
}
function hasGoogleVertexLocationEnv(env) {
	return Boolean(normalizeOptionalString(env.GOOGLE_CLOUD_LOCATION));
}
function resolveGoogleApplicationCredentialsPath(env = process.env) {
	const explicit = normalizeOptionalString(env.GOOGLE_APPLICATION_CREDENTIALS);
	if (explicit) return existsSync(explicit) ? explicit : void 0;
	const cloudSdkDir = normalizeOptionalString(env.CLOUDSDK_CONFIG);
	if (cloudSdkDir) {
		const cloudSdkFallback = path.join(cloudSdkDir, "application_default_credentials.json");
		return existsSync(cloudSdkFallback) ? cloudSdkFallback : void 0;
	}
	const homeDir = normalizeOptionalString(env.HOME) ?? os.homedir();
	const homeFallback = path.join(homeDir, ".config", "gcloud", "application_default_credentials.json");
	if (existsSync(homeFallback)) return homeFallback;
	const appDataDir = normalizeOptionalString(env.APPDATA);
	if (!appDataDir) return;
	const appDataFallback = path.join(appDataDir, "gcloud", "application_default_credentials.json");
	return existsSync(appDataFallback) ? appDataFallback : void 0;
}
const GOOGLE_VERTEX_ADC_FILE_MAX_BYTES = 1048576;
function readGoogleAdcCredentials(adcPath) {
	const text = readSecretFileSync(adcPath, "Google Vertex ADC credentials", {
		maxBytes: GOOGLE_VERTEX_ADC_FILE_MAX_BYTES,
		rejectHardlinks: false
	});
	const parsed = JSON.parse(text);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`Google Vertex ADC credentials must be a JSON object: ${adcPath}`);
	return parsed;
}
function readGoogleAdcCredentialsTypeSync(credentialsPath) {
	try {
		const type = readGoogleAdcCredentials(credentialsPath).type;
		return typeof type === "string" ? type : void 0;
	} catch {
		return;
	}
}
function hasGoogleVertexAdcSync(env = process.env) {
	const credentialsPath = resolveGoogleApplicationCredentialsPath(env);
	if (credentialsPath) {
		const type = readGoogleAdcCredentialsTypeSync(credentialsPath);
		if (type === "authorized_user" || type === "external_account" || type === "service_account") return true;
	}
	return false;
}
function resolveGoogleVertexConfigApiKey(env = process.env) {
	return hasGoogleVertexProjectEnv(env) && hasGoogleVertexLocationEnv(env) && hasGoogleVertexAdcSync(env) ? GCP_VERTEX_CREDENTIALS_MARKER : void 0;
}
//#endregion
export { resolveGoogleVertexConfigApiKey as i, readGoogleAdcCredentials as n, resolveGoogleApplicationCredentialsPath as r, isGoogleVertexCredentialsMarker as t };
