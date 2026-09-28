import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { parse as parse$1 } from "dotenv";
//#region extensions/google/cli-backend-isolated-auth.runtime.ts
const GEMINI_CLI_AMBIENT_AUTH_ENV = /* @__PURE__ */ new Set([
	"GEMINI_API_KEY",
	"GOOGLE_API_KEY",
	"GOOGLE_GENAI_USE_VERTEXAI",
	"GOOGLE_APPLICATION_CREDENTIALS",
	"GOOGLE_CLOUD_PROJECT",
	"GOOGLE_CLOUD_PROJECT_ID",
	"GOOGLE_CLOUD_QUOTA_PROJECT",
	"GOOGLE_CLOUD_LOCATION"
]);
const GEMINI_CLI_UNSAFE_AUTH_ENV = [
	"GOOGLE_GENAI_USE_GCA",
	"CLOUD_SHELL",
	"GEMINI_CLI_USE_COMPUTE_ADC"
];
const GEMINI_CLI_AUTH_SELECTOR_ENV = /* @__PURE__ */ new Set([
	"GEMINI_API_KEY",
	"GOOGLE_GENAI_USE_GCA",
	"GOOGLE_GENAI_USE_VERTEXAI",
	"CLOUD_SHELL",
	"GEMINI_CLI_USE_COMPUTE_ADC"
]);
const GEMINI_CLI_TRUSTED_TRANSPORT_ENV = /* @__PURE__ */ new Set([
	"GOOGLE_GEMINI_BASE_URL",
	"GOOGLE_VERTEX_BASE_URL",
	"GEMINI_CLI_CUSTOM_HEADERS",
	"GEMINI_API_KEY_AUTH_MECHANISM",
	"GOOGLE_GENAI_API_VERSION"
]);
const GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS = {
	GOOGLE_GENAI_USE_GCA: "false",
	CLOUD_SHELL: "false",
	GEMINI_CLI_USE_COMPUTE_ADC: "false",
	GEMINI_TELEMETRY_LOG_PROMPTS: "false",
	GEMINI_WRITE_SYSTEM_MD: "false"
};
const GEMINI_CLI_AT_INCLUDE_PATTERN = /(?<!\\)@(?:(?:"(?:[^"]*)")|(?:\\.|[^ \t\n\r,;!?()[\]{}.]|\.(?!$|[ \t\n\r])))+/u;
function isolatedCompletionInputError(message) {
	const error = new Error(message);
	error.name = "IsolatedCompletionInputError";
	error.code = "input-rejected";
	return error;
}
function isolatedCompletionUnsupportedError(message) {
	const error = new Error(message);
	error.name = "IsolatedCompletionUnsupportedError";
	error.code = "unsupported";
	return error;
}
function unsupportedExactToolAuthError(ctx, message) {
	return ctx.isolatedCompletionSystemPrompt === void 0 ? new Error(message) : isolatedCompletionUnsupportedError(message);
}
function assertGeminiCliLiteralIsolatedPrompt(ctx) {
	if (ctx.isolatedCompletionSystemPrompt === void 0) return false;
	const prompt = ctx.isolatedCompletionPrompt;
	if (prompt === void 0) return false;
	if (GEMINI_CLI_AT_INCLUDE_PATTERN.test(prompt)) throw isolatedCompletionInputError("Gemini CLI isolated completion cannot safely pass native @-include syntax.");
	if (prompt.startsWith("/") && !prompt.startsWith("//") && !prompt.startsWith("/*")) throw isolatedCompletionInputError("Gemini CLI isolated completion cannot safely pass native /command syntax.");
	return true;
}
async function readGeminiCliJsonObject(filePath) {
	const normalized = normalizeOptionalString(filePath);
	if (!normalized) return {};
	try {
		const parsed = JSON.parse(await fs.readFile(normalized, "utf8"));
		if (!isRecord(parsed)) throw new Error(`Gemini CLI system settings must be a JSON object: ${normalized}`);
		return { ...parsed };
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
		throw error;
	}
}
function projectGeminiCliSafeSettings(settings) {
	const projected = {};
	const privacy = isRecord(settings.privacy) ? settings.privacy : void 0;
	if (typeof privacy?.usageStatisticsEnabled === "boolean") projected.privacy = { usageStatisticsEnabled: privacy.usageStatisticsEnabled };
	const telemetry = isRecord(settings.telemetry) ? settings.telemetry : void 0;
	const safeTelemetry = {};
	if (typeof telemetry?.enabled === "boolean") safeTelemetry.enabled = telemetry.enabled;
	if (typeof telemetry?.logPrompts === "boolean") safeTelemetry.logPrompts = telemetry.logPrompts;
	if (Object.keys(safeTelemetry).length > 0) projected.telemetry = safeTelemetry;
	return projected;
}
function resolveGeminiCliAmbientHome(ctx) {
	return normalizeOptionalString(ctx.baseEnv?.GEMINI_CLI_HOME) ?? normalizeOptionalString(process.env.GEMINI_CLI_HOME) ?? os.homedir();
}
function projectGeminiCliTrustedTransportEnv(ctx, ambientEnv) {
	return Object.fromEntries([...GEMINI_CLI_TRUSTED_TRANSPORT_ENV].map((name) => [name, normalizeOptionalString(ctx.baseEnv?.[name]) ?? normalizeOptionalString(process.env[name]) ?? normalizeOptionalString(ambientEnv.transport[name]) ?? ""]));
}
async function readGeminiCliAmbientAuthEnv(filePath) {
	try {
		const parsed = parse$1(await fs.readFile(filePath, "utf8"));
		const telemetryValue = parsed.GEMINI_TELEMETRY_ENABLED?.trim().toLowerCase();
		return {
			auth: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_AMBIENT_AUTH_ENV.has(key))),
			transport: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_TRUSTED_TRANSPORT_ENV.has(key))),
			unsafeAuth: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_UNSAFE_AUTH_ENV.includes(key))),
			...telemetryValue ? { telemetryEnabled: telemetryValue === "true" || telemetryValue === "1" } : {}
		};
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
		throw error;
	}
}
async function loadGeminiCliAmbientEnv(ctx) {
	const home = resolveGeminiCliAmbientHome(ctx);
	for (const candidate of [path.join(home, ".gemini", ".env"), path.join(home, ".env")]) {
		const env = await readGeminiCliAmbientAuthEnv(candidate);
		if (env !== void 0) return env;
	}
	return {
		auth: {},
		transport: {},
		unsafeAuth: {}
	};
}
async function resolveGeminiCliTrustedTransportEnv(ctx) {
	return projectGeminiCliTrustedTransportEnv(ctx, await loadGeminiCliAmbientEnv(ctx));
}
async function resolveGeminiCliAmbientAuth(ctx) {
	const home = resolveGeminiCliAmbientHome(ctx);
	const settings = await readGeminiCliJsonObject(path.join(home, ".gemini", "settings.json"));
	const systemSettings = await readGeminiCliJsonObject(ctx.systemSettingsPath);
	const userSecurity = isRecord(settings.security) ? settings.security : void 0;
	const userAuth = userSecurity && isRecord(userSecurity.auth) ? userSecurity.auth : void 0;
	const systemSecurity = isRecord(systemSettings.security) ? systemSettings.security : void 0;
	const systemAuth = systemSecurity && isRecord(systemSecurity.auth) ? systemSecurity.auth : void 0;
	const ambientEnv = await loadGeminiCliAmbientEnv(ctx);
	const preparedSelectorOwnsAuth = [...GEMINI_CLI_AUTH_SELECTOR_ENV].some((name) => {
		const value = normalizeOptionalString(ctx.baseEnv?.[name]);
		return value !== void 0 && value !== "false" && value !== "0";
	});
	const systemSelectedType = normalizeOptionalString(typeof systemAuth?.selectedType === "string" ? systemAuth.selectedType : void 0);
	const userSelectedType = normalizeOptionalString(typeof userAuth?.selectedType === "string" ? userAuth.selectedType : void 0);
	const selectedType = systemSelectedType ?? (preparedSelectorOwnsAuth ? void 0 : userSelectedType);
	const enforcedType = normalizeOptionalString(typeof systemAuth?.enforcedType === "string" ? systemAuth.enforcedType : void 0);
	if (enforcedType && enforcedType !== "gemini-api-key" && enforcedType !== "vertex-ai") throw unsupportedExactToolAuthError(ctx, "Gemini CLI exact tool availability supports only API-key or Vertex auth; Code Assist auth can inject administrator-required tools.");
	const envValue = (name) => {
		const prepared = normalizeOptionalString(ctx.baseEnv?.[name]);
		if (prepared !== void 0) return prepared;
		if (preparedSelectorOwnsAuth && GEMINI_CLI_AUTH_SELECTOR_ENV.has(name)) return;
		return normalizeOptionalString(process.env[name]) ?? normalizeOptionalString(ambientEnv.auth[name]) ?? normalizeOptionalString(ambientEnv.unsafeAuth[name]);
	};
	const effectiveAuthType = selectedType ?? (envValue("GOOGLE_GENAI_USE_GCA") === "true" ? "oauth-personal" : envValue("GOOGLE_GENAI_USE_VERTEXAI") === "true" ? "vertex-ai" : envValue("GEMINI_API_KEY") ? "gemini-api-key" : envValue("CLOUD_SHELL") === "true" || envValue("GEMINI_CLI_USE_COMPUTE_ADC") === "true" ? "compute-default-credentials" : void 0);
	if (effectiveAuthType !== "gemini-api-key" && effectiveAuthType !== "vertex-ai") throw unsupportedExactToolAuthError(ctx, "Gemini CLI exact tool availability supports only API-key or Vertex auth; Code Assist auth can inject administrator-required tools.");
	if (enforcedType !== void 0 && enforcedType !== effectiveAuthType) throw new Error(`Gemini CLI system settings enforce ${enforcedType} auth, but exact tool availability resolved ${effectiveAuthType}.`);
	const envOverrides = {
		...Object.fromEntries([...GEMINI_CLI_AMBIENT_AUTH_ENV].map((name) => [name, ""])),
		...GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS,
		...projectGeminiCliTrustedTransportEnv(ctx, ambientEnv)
	};
	for (const name of GEMINI_CLI_AMBIENT_AUTH_ENV) {
		const value = envValue(name);
		if (value) envOverrides[name] = value;
	}
	const applicationCredentials = normalizeOptionalString(envOverrides.GOOGLE_APPLICATION_CREDENTIALS);
	if (applicationCredentials && !path.isAbsolute(applicationCredentials)) {
		const workspaceDir = normalizeOptionalString(ctx.workspaceDir);
		if (!workspaceDir) throw new Error("Gemini exact tool availability cannot resolve relative GOOGLE_APPLICATION_CREDENTIALS without a workspace.");
		envOverrides.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(workspaceDir, applicationCredentials);
	}
	const safeSettings = projectGeminiCliSafeSettings(settings);
	if (ambientEnv.telemetryEnabled === false) safeSettings.telemetry = {
		...isRecord(safeSettings.telemetry) ? safeSettings.telemetry : {},
		enabled: false
	};
	return {
		selectedType,
		envOverrides,
		safeSettings
	};
}
//#endregion
export { readGeminiCliJsonObject as a, isolatedCompletionUnsupportedError as i, assertGeminiCliLiteralIsolatedPrompt as n, resolveGeminiCliAmbientAuth as o, isolatedCompletionInputError as r, resolveGeminiCliTrustedTransportEnv as s, GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS as t };
