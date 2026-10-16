import os from "node:os";
import path from "node:path";
import { asOptionalRecord, isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { CliBackendAuthProfilePreparationError } from "openclaw/plugin-sdk/cli-backend";
import { replaceFileAtomic } from "openclaw/plugin-sdk/security-runtime";
import { resolvePreferredOpenClawTmpDir, tempWorkspace } from "openclaw/plugin-sdk/temp-path";
import { parse } from "dotenv";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
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
		if (extractErrorCode(error) === "ENOENT") return {};
		throw error;
	}
}
function projectGeminiCliSafeSettings(settings) {
	const projected = {};
	const privacy = asOptionalRecord(settings.privacy);
	if (typeof privacy?.usageStatisticsEnabled === "boolean") projected.privacy = { usageStatisticsEnabled: privacy.usageStatisticsEnabled };
	const telemetry = asOptionalRecord(settings.telemetry);
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
		const parsed = parse(await fs.readFile(filePath, "utf8"));
		const telemetryValue = parsed.GEMINI_TELEMETRY_ENABLED?.trim().toLowerCase();
		return {
			auth: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_AMBIENT_AUTH_ENV.has(key))),
			transport: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_TRUSTED_TRANSPORT_ENV.has(key))),
			unsafeAuth: Object.fromEntries(Object.entries(parsed).filter(([key]) => GEMINI_CLI_UNSAFE_AUTH_ENV.includes(key))),
			...telemetryValue ? { telemetryEnabled: telemetryValue === "true" || telemetryValue === "1" } : {}
		};
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
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
	const userAuth = asOptionalRecord(asOptionalRecord(settings.security)?.auth);
	const systemAuth = asOptionalRecord(asOptionalRecord(systemSettings.security)?.auth);
	const ambientEnv = await loadGeminiCliAmbientEnv(ctx);
	const preparedSelectorOwnsAuth = [...GEMINI_CLI_AUTH_SELECTOR_ENV].some((name) => {
		const value = normalizeOptionalString(ctx.baseEnv?.[name]);
		return value !== void 0 && value !== "false" && value !== "0";
	});
	const systemSelectedType = normalizeOptionalString(systemAuth?.selectedType);
	const userSelectedType = normalizeOptionalString(userAuth?.selectedType);
	const selectedType = systemSelectedType ?? (preparedSelectorOwnsAuth ? void 0 : userSelectedType);
	const enforcedType = normalizeOptionalString(systemAuth?.enforcedType);
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
		...asOptionalRecord(safeSettings.telemetry),
		enabled: false
	};
	return {
		selectedType,
		envOverrides,
		safeSettings
	};
}
//#endregion
//#region extensions/google/gemini-cli-auth-home.ts
const GOOGLE_GEMINI_CLI_PROVIDER_ID = "google-gemini-cli";
function resolveGeminiCliProfileHome$1(agentDir, profileId) {
	const profileHash = crypto.createHash("sha256").update(profileId).digest("hex").slice(0, 24);
	return path.join(agentDir, `${GOOGLE_GEMINI_CLI_PROVIDER_ID}-home`, "profiles", profileHash);
}
//#endregion
//#region extensions/google/cli-backend-auth.runtime.ts
const GOOGLE_PROVIDER_ID = "google";
const VERCEL_AI_GATEWAY_PROVIDER_ID = "vercel-ai-gateway";
const GEMINI_CLI_CREDENTIALS_FILENAME = "gemini-credentials.json";
const GEMINI_CLI_PROFILE_AUTH_ENV = [...[
	...[
		"GOOGLE_GENAI_USE_GCA",
		"GOOGLE_CLOUD_ACCESS_TOKEN",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"GEMINI_FORCE_ENCRYPTED_FILE_STORAGE",
		"GEMINI_FORCE_FILE_STORAGE"
	],
	"GOOGLE_GENAI_USE_VERTEXAI",
	"GOOGLE_API_KEY",
	"GOOGLE_CLOUD_PROJECT",
	"GOOGLE_CLOUD_PROJECT_ID",
	"GOOGLE_CLOUD_QUOTA_PROJECT",
	"GOOGLE_CLOUD_LOCATION",
	"GOOGLE_GEMINI_BASE_URL",
	"GEMINI_CLI_CUSTOM_HEADERS",
	"GEMINI_API_KEY_AUTH_MECHANISM"
], "GEMINI_API_KEY"];
const GEMINI_CLI_PROFILE_SETTINGS_ENV = ["GEMINI_CLI_SYSTEM_SETTINGS_PATH"];
const GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE = "Open Models settings and connect Google with an AI Studio API key, then select that profile for this model.";
function throwUnsupportedGeminiCredential(credential) {
	if (credential.provider === VERCEL_AI_GATEWAY_PROVIDER_ID) throw new Error("Gemini CLI execution cannot use a vercel-ai-gateway auth profile. Use the OpenClaw vercel-ai-gateway provider instead.");
	throw new Error("Gemini CLI execution requires a google-gemini-cli auth profile.");
}
function throwUnstageableSelectedGeminiProfile(ctx, credential) {
	if (!normalizeOptionalString(ctx.authProfileId)) throw new Error("Gemini CLI execution requires a selected auth profile.");
	if (!credential) throw new CliBackendAuthProfilePreparationError(`Gemini CLI auth profile was selected but no credential material was found. ${GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE}`);
	if (credential.provider !== "google-gemini-cli") throwUnsupportedGeminiCredential(credential);
	throw new Error(`Gemini CLI execution requires a Google AI Studio API-key profile or a previously configured valid Gemini CLI OAuth profile. ${GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE}`);
}
function requireGeminiOAuthCredential(credential) {
	if (credential?.type !== "oauth") return null;
	if (credential.provider !== "google-gemini-cli") throwUnsupportedGeminiCredential(credential);
	const access = normalizeOptionalString(credential.access);
	const refresh = normalizeOptionalString(credential.refresh);
	if (!access || !refresh || typeof credential.expires !== "number" || !Number.isFinite(credential.expires)) throw new CliBackendAuthProfilePreparationError(`Gemini CLI OAuth profile is incomplete and cannot be repaired by OpenClaw. ${GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE}`);
	return {
		...credential,
		type: "oauth",
		provider: GOOGLE_GEMINI_CLI_PROVIDER_ID,
		access,
		refresh,
		expires: credential.expires,
		idToken: normalizeOptionalString(credential.idToken),
		projectId: normalizeOptionalString(credential.projectId)
	};
}
function requireGeminiApiKeyCredential(credential) {
	if (credential?.type !== "api_key") return null;
	if (credential.provider !== "google-gemini-cli" && credential.provider !== GOOGLE_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
	const key = normalizeOptionalString(credential.key);
	if (!key) throw new CliBackendAuthProfilePreparationError("Gemini CLI API-key profile is missing usable key material.");
	return {
		...credential,
		type: "api_key",
		provider: credential.provider,
		key
	};
}
function resolveGeminiCliProfileHome(ctx) {
	const agentDir = normalizeOptionalString(ctx.agentDir);
	if (!agentDir) throw new Error("Gemini CLI auth profile execution requires an agent directory.");
	const authProfileId = normalizeOptionalString(ctx.authProfileId);
	if (!authProfileId) throw new Error("Gemini CLI auth profile execution requires a selected auth profile.");
	const home = resolveGeminiCliProfileHome$1(agentDir, authProfileId);
	return {
		home,
		geminiDir: path.join(home, ".gemini")
	};
}
function readGeminiAuthProfileCredential(credential) {
	if (!isRecord(credential)) return;
	return credential;
}
async function buildGeminiCliSystemSettings(ctx, selectedType, ambientSafeSettings = {}) {
	const base = await readGeminiCliJsonObject(ctx.systemSettingsPath);
	const ambientPrivacy = asOptionalRecord(ambientSafeSettings.privacy);
	const basePrivacy = asOptionalRecord(base.privacy);
	const ambientTelemetry = asOptionalRecord(ambientSafeSettings.telemetry);
	const baseTelemetry = asOptionalRecord(base.telemetry);
	let settings = {
		...ambientSafeSettings,
		...base,
		...ambientPrivacy || basePrivacy ? { privacy: {
			...ambientPrivacy,
			...basePrivacy
		} } : {},
		...ambientTelemetry || baseTelemetry ? { telemetry: {
			...ambientTelemetry,
			...baseTelemetry
		} } : {}
	};
	if (selectedType) {
		const security = { ...asOptionalRecord(settings.security) };
		const auth = { ...asOptionalRecord(security.auth) };
		const enforcedType = normalizeOptionalString(auth.enforcedType);
		if (enforcedType && enforcedType !== selectedType) throw new Error(`Gemini CLI system settings enforce ${enforcedType} auth, but the selected OpenClaw profile requires ${selectedType}.`);
		security.auth = {
			...auth,
			selectedType
		};
		settings = {
			...settings,
			security
		};
	}
	return applyGeminiCliIsolatedCompletionSettings(ctx.toolAvailability ? applyGeminiCliToolAvailability(settings, ctx.toolAvailability) : settings, ctx);
}
function applyGeminiCliIsolatedCompletionSettings(base, ctx) {
	if (ctx.isolatedCompletionSystemPrompt === void 0) return base;
	const modelId = normalizeOptionalString(ctx.isolatedCompletionModelId);
	if (!modelId || modelId === "auto" || modelId.startsWith("auto-")) throw isolatedCompletionInputError("Gemini isolated completion requires one concrete model id.");
	const policy = {
		model: modelId,
		isLastResort: true,
		actions: {
			terminal: "prompt",
			transient: "prompt",
			not_found: "prompt",
			unknown: "prompt"
		},
		stateTransitions: {
			terminal: "terminal",
			transient: "terminal",
			not_found: "terminal",
			unknown: "terminal"
		}
	};
	const exactModelResolution = { default: modelId };
	return {
		...base,
		general: {
			...asOptionalRecord(base.general),
			maxAttempts: 1,
			retryFetchErrors: false
		},
		experimental: {
			...asOptionalRecord(base.experimental),
			dynamicModelConfiguration: true,
			gemmaModelRouter: { enabled: false }
		},
		modelConfigs: {
			aliases: {},
			customAliases: {},
			overrides: [],
			customOverrides: [],
			modelIdResolutions: { [modelId]: exactModelResolution },
			classifierIdResolutions: {
				flash: exactModelResolution,
				pro: exactModelResolution
			},
			modelChains: {
				preview: [policy],
				default: [policy],
				lite: [policy],
				[modelId]: [policy]
			}
		},
		context: {
			includeDirectoryTree: false,
			discoveryMaxDirs: 1,
			memoryBoundaryMarkers: [],
			includeDirectories: [],
			loadMemoryFromIncludeDirectories: false
		},
		telemetry: {
			...asOptionalRecord(base.telemetry),
			logPrompts: false
		}
	};
}
function applyGeminiCliToolAvailability(base, availability) {
	if (availability.native.length > 0) throw new Error("Gemini CLI cannot expose backend-native tools in an exact restricted run.");
	const mcpServers = asOptionalRecord(base.mcpServers);
	const exposesOpenClawTools = availability.openClaw.length > 0;
	let restrictedMcpServers = {};
	if (exposesOpenClawTools) {
		const openClawMcpServer = mcpServers?.openclaw;
		if (!isRecord(openClawMcpServer)) throw new Error("Gemini CLI exact tool availability requires the OpenClaw MCP server.");
		restrictedMcpServers = { openclaw: {
			...openClawMcpServer,
			includeTools: [...availability.openClaw]
		} };
	}
	const { allowed: _allowedTools, core: _coreTools, discoveryCommand: _discoveryCommand, callCommand: _callCommand, ...nonAuthorityToolSettings } = asOptionalRecord(base.tools) ?? {};
	const { serverCommand: _serverCommand, ...nonAuthorityMcpSettings } = asOptionalRecord(base.mcp) ?? {};
	const allowedMcpServers = exposesOpenClawTools ? ["openclaw"] : [crypto.randomUUID()];
	const agents = asOptionalRecord(base.agents);
	const agentOverrides = asOptionalRecord(agents?.overrides);
	return {
		...base,
		tools: {
			...nonAuthorityToolSettings,
			core: exposesOpenClawTools ? ["mcp_openclaw_*"] : [],
			discoveryCommand: "",
			callCommand: ""
		},
		mcp: {
			...nonAuthorityMcpSettings,
			allowed: allowedMcpServers,
			serverCommand: ""
		},
		mcpServers: restrictedMcpServers,
		experimental: {
			...asOptionalRecord(base.experimental),
			enableAgents: false
		},
		agents: {
			...agents,
			overrides: {
				...agentOverrides,
				codebase_investigator: {
					...asOptionalRecord(agentOverrides?.codebase_investigator),
					enabled: false
				},
				cli_help: {
					...asOptionalRecord(agentOverrides?.cli_help),
					enabled: false
				}
			}
		},
		hooksConfig: {
			...asOptionalRecord(base.hooksConfig),
			enabled: false
		},
		skills: {
			...asOptionalRecord(base.skills),
			enabled: false
		}
	};
}
async function writeGeminiCliJson(filePath, value) {
	await writeGeminiCliPrivateFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
async function writeGeminiCliPrivateFile(filePath, value) {
	const directory = await fs.realpath(path.dirname(filePath));
	await replaceFileAtomic({
		filePath: path.join(directory, path.basename(filePath)),
		content: value
	});
}
async function stageGeminiCliIsolatedCwd(ctx) {
	const cwd = normalizeOptionalString(ctx.isolatedCompletionCwd);
	if (!cwd) return;
	await writeGeminiCliPrivateFile(path.join(cwd, ".env"), "");
}
async function prepareGeminiCliProfileHome(ctx, selectedType) {
	const settings = { security: { auth: { selectedType } } };
	const systemSettings = await buildGeminiCliSystemSettings(ctx, selectedType);
	const isolated = ctx.isolatedCompletionSystemPrompt !== void 0;
	const exactToolAvailability = ctx.toolAvailability !== void 0;
	const persistentProfileHome = isolated || exactToolAvailability ? void 0 : resolveGeminiCliProfileHome(ctx);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-gemini-cli-"
	});
	const { home, geminiDir } = persistentProfileHome ?? {
		home: path.join(workspace.dir, "home"),
		geminiDir: path.join(workspace.dir, "home", ".gemini")
	};
	const systemSettingsPath = workspace.path("settings.json");
	const isolatedSystemPrompt = ctx.isolatedCompletionSystemPrompt;
	const isolatedSystemPromptPath = isolated ? workspace.path("system.md") : void 0;
	return {
		home,
		geminiDir,
		systemSettingsPath,
		...isolatedSystemPromptPath ? { isolatedSystemPromptPath } : {},
		beforeExecution: async () => {
			await stageGeminiCliIsolatedCwd(ctx);
			await fs.mkdir(geminiDir, {
				recursive: true,
				mode: 448
			});
			await fs.chmod(home, 448);
			await fs.chmod(geminiDir, 448);
			await Promise.all([
				writeGeminiCliJson(path.join(geminiDir, "settings.json"), settings),
				writeGeminiCliJson(path.join(home, "settings.json"), settings),
				writeGeminiCliJson(systemSettingsPath, systemSettings),
				...isolatedSystemPromptPath && isolatedSystemPrompt !== void 0 ? [writeGeminiCliPrivateFile(isolatedSystemPromptPath, isolatedSystemPrompt)] : []
			]);
		},
		cleanup: workspace[Symbol.asyncDispose]
	};
}
async function clearGeminiCliCachedCredentials(geminiDir) {
	await fs.rm(path.join(geminiDir, GEMINI_CLI_CREDENTIALS_FILENAME), { force: true });
}
function buildGeminiCliProjectEnv(projectId) {
	const normalized = normalizeOptionalString(projectId);
	if (!normalized) return {};
	return {
		GOOGLE_CLOUD_PROJECT: normalized,
		GOOGLE_CLOUD_PROJECT_ID: normalized,
		GOOGLE_CLOUD_QUOTA_PROJECT: normalized
	};
}
async function prepareGeminiCliCredentialHome(ctx, credential) {
	const auth = requireGeminiOAuthCredential(credential) ?? requireGeminiApiKeyCredential(credential);
	if (!auth) return null;
	const oauth = auth.type === "oauth";
	const exactToolAvailability = ctx.toolAvailability !== void 0;
	if (oauth && exactToolAvailability) {
		const message = "Gemini CLI exact tool availability does not support OAuth; Code Assist auth can inject administrator-required tools.";
		throw ctx.isolatedCompletionSystemPrompt === void 0 ? /* @__PURE__ */ new Error(message) : isolatedCompletionUnsupportedError(message);
	}
	const isolatedCompletionEnforced = !oauth && assertGeminiCliLiteralIsolatedPrompt(ctx);
	const restrictedTransportEnv = exactToolAvailability ? await resolveGeminiCliTrustedTransportEnv(ctx) : void 0;
	const profileHome = await prepareGeminiCliProfileHome(ctx, oauth ? "oauth-personal" : "gemini-api-key");
	return {
		env: {
			GEMINI_CLI_HOME: profileHome.home,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: profileHome.systemSettingsPath,
			GEMINI_FORCE_FILE_STORAGE: "true",
			...oauth ? buildGeminiCliProjectEnv(auth.projectId) : { GEMINI_API_KEY: auth.key },
			...exactToolAvailability ? GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS : {},
			...restrictedTransportEnv,
			...profileHome.isolatedSystemPromptPath ? {
				GEMINI_SYSTEM_MD: profileHome.isolatedSystemPromptPath,
				GEMINI_TELEMETRY_LOG_PROMPTS: "false"
			} : {}
		},
		clearEnv: [
			...GEMINI_CLI_PROFILE_AUTH_ENV,
			...GEMINI_CLI_PROFILE_SETTINGS_ENV,
			...exactToolAvailability ? ["GEMINI_CLI_HOME"] : [],
			...profileHome.isolatedSystemPromptPath ? [
				"GEMINI_SYSTEM_MD",
				...oauth ? ["GEMINI_CLI_HOME"] : [],
				"GEMINI_TELEMETRY_LOG_PROMPTS"
			] : [],
			...exactToolAvailability ? Object.keys(GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS) : [],
			...Object.keys(restrictedTransportEnv ?? {})
		],
		beforeExecution: async () => {
			await profileHome.beforeExecution();
			const credentialsPath = path.join(profileHome.geminiDir, "oauth_creds.json");
			if (oauth) {
				await clearGeminiCliCachedCredentials(profileHome.geminiDir);
				await writeGeminiCliJson(credentialsPath, {
					access_token: auth.access,
					refresh_token: auth.refresh,
					expiry_date: auth.expires,
					token_type: "Bearer",
					...auth.idToken ? { id_token: auth.idToken } : {}
				});
			} else await Promise.all([fs.rm(credentialsPath, { force: true }), clearGeminiCliCachedCredentials(profileHome.geminiDir)]);
		},
		cleanup: profileHome.cleanup,
		...isolatedCompletionEnforced ? { isolatedCompletionEnforced: true } : {}
	};
}
async function prepareGeminiCliRestrictedSystemSettings(ctx) {
	const isolated = ctx.isolatedCompletionSystemPrompt !== void 0;
	const isolatedCompletionEnforced = assertGeminiCliLiteralIsolatedPrompt(ctx);
	const ambientAuth = await resolveGeminiCliAmbientAuth(ctx);
	const settings = await buildGeminiCliSystemSettings(ctx, ambientAuth.selectedType, ambientAuth.safeSettings);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-gemini-cli-policy-"
	});
	const systemSettingsPath = workspace.path("settings.json");
	const isolatedSystemPrompt = ctx.isolatedCompletionSystemPrompt;
	const isolatedSystemPromptPath = isolated ? workspace.path("system.md") : void 0;
	const restrictedHome = path.join(workspace.dir, "home");
	return {
		env: {
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: systemSettingsPath,
			GEMINI_CLI_HOME: restrictedHome,
			...isolatedSystemPromptPath ? { GEMINI_SYSTEM_MD: isolatedSystemPromptPath } : {},
			...isolated ? { GEMINI_TELEMETRY_LOG_PROMPTS: "false" } : {},
			...ambientAuth.envOverrides
		},
		clearEnv: [
			...GEMINI_CLI_PROFILE_AUTH_ENV,
			...GEMINI_CLI_PROFILE_SETTINGS_ENV,
			"GEMINI_CLI_HOME",
			...isolatedSystemPromptPath ? ["GEMINI_SYSTEM_MD", "GEMINI_TELEMETRY_LOG_PROMPTS"] : [],
			...Object.keys(ambientAuth.envOverrides)
		],
		beforeExecution: async () => {
			await stageGeminiCliIsolatedCwd(ctx);
			await fs.mkdir(restrictedHome, {
				recursive: true,
				mode: 448
			});
			await fs.chmod(restrictedHome, 448);
			await Promise.all([writeGeminiCliJson(systemSettingsPath, settings), ...isolatedSystemPromptPath && isolatedSystemPrompt !== void 0 ? [writeGeminiCliPrivateFile(isolatedSystemPromptPath, isolatedSystemPrompt)] : []]);
		},
		cleanup: workspace[Symbol.asyncDispose],
		toolAvailabilityEnforced: true,
		...isolatedCompletionEnforced ? { isolatedCompletionEnforced: true } : {}
	};
}
async function prepareGeminiCliExecution(ctx, credential) {
	const authCredential = readGeminiAuthProfileCredential(credential);
	const prepared = await prepareGeminiCliCredentialHome(ctx, authCredential);
	if (prepared) return ctx.toolAvailability ? {
		...prepared,
		toolAvailabilityEnforced: true
	} : prepared;
	if (normalizeOptionalString(ctx.authProfileId)) throwUnstageableSelectedGeminiProfile(ctx, authCredential);
	return ctx.toolAvailability ? await prepareGeminiCliRestrictedSystemSettings(ctx) : null;
}
//#endregion
export { prepareGeminiCliExecution };
