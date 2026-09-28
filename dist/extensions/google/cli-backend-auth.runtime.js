import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-BSb3HetY.mjs";
import { n as replaceFileAtomic } from "../../replace-file-DJtj9VLX.mjs";
import { t as tempWorkspace } from "../../private-temp-workspace-DQFTMfun.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../security-runtime-HdPo6iAV.mjs";
import { t as CliBackendAuthProfilePreparationError } from "../../cli-backend-errors-ngojFnXq.mjs";
import "../../temp-path-PENdksor.mjs";
import { n as resolveGeminiCliProfileHome$1, t as GOOGLE_GEMINI_CLI_PROVIDER_ID } from "../../gemini-cli-auth-home-CXgkYWW_.mjs";
import { a as readGeminiCliJsonObject, i as isolatedCompletionUnsupportedError, n as assertGeminiCliLiteralIsolatedPrompt, o as resolveGeminiCliAmbientAuth, r as isolatedCompletionInputError, s as resolveGeminiCliTrustedTransportEnv, t as GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS } from "../../cli-backend-isolated-auth.runtime-BCW95vta.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/google/cli-backend-auth.runtime.ts
const GEMINI_CLI_PROVIDER_ID = GOOGLE_GEMINI_CLI_PROVIDER_ID;
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
	if (credential.provider !== GEMINI_CLI_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
	throw new Error(`Gemini CLI execution requires a Google AI Studio API-key profile or a previously configured valid Gemini CLI OAuth profile. ${GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE}`);
}
function requireGeminiOAuthCredential(credential) {
	if (!credential) return null;
	if (credential.type !== "oauth") return null;
	if (credential.provider !== GEMINI_CLI_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
	const access = normalizeOptionalString(credential.access);
	const refresh = normalizeOptionalString(credential.refresh);
	if (!access || !refresh || typeof credential.expires !== "number" || !Number.isFinite(credential.expires)) throw new CliBackendAuthProfilePreparationError(`Gemini CLI OAuth profile is incomplete and cannot be repaired by OpenClaw. ${GEMINI_CLI_SUPPORTED_AUTH_GUIDANCE}`);
	return {
		...credential,
		type: "oauth",
		provider: GEMINI_CLI_PROVIDER_ID,
		access,
		refresh,
		expires: credential.expires,
		idToken: normalizeOptionalString(credential.idToken),
		projectId: normalizeOptionalString(credential.projectId)
	};
}
function requireGeminiApiKeyCredential(credential) {
	if (!credential) return null;
	if (credential.type !== "api_key") return null;
	if (credential.provider !== GEMINI_CLI_PROVIDER_ID && credential.provider !== GOOGLE_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
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
function buildGeminiCliAuthSettings(selectedType) {
	return { security: { auth: { selectedType } } };
}
async function buildGeminiCliSystemSettings(ctx, selectedType, ambientSafeSettings = {}) {
	const base = await readGeminiCliJsonObject(ctx.systemSettingsPath);
	const ambientPrivacy = isRecord(ambientSafeSettings.privacy) ? ambientSafeSettings.privacy : void 0;
	const basePrivacy = isRecord(base.privacy) ? base.privacy : void 0;
	const ambientTelemetry = isRecord(ambientSafeSettings.telemetry) ? ambientSafeSettings.telemetry : void 0;
	const baseTelemetry = isRecord(base.telemetry) ? base.telemetry : void 0;
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
		const security = isRecord(settings.security) ? { ...settings.security } : {};
		const auth = isRecord(security.auth) ? { ...security.auth } : {};
		const enforcedType = normalizeOptionalString(typeof auth.enforcedType === "string" ? auth.enforcedType : void 0);
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
	const general = isRecord(base.general) ? { ...base.general } : {};
	const experimental = isRecord(base.experimental) ? { ...base.experimental } : {};
	const telemetry = isRecord(base.telemetry) ? { ...base.telemetry } : {};
	const exactModelResolution = { default: modelId };
	return {
		...base,
		general: {
			...general,
			maxAttempts: 1,
			retryFetchErrors: false
		},
		experimental: {
			...experimental,
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
			...telemetry,
			logPrompts: false
		}
	};
}
function applyGeminiCliToolAvailability(base, availability) {
	if (availability.native.length > 0) throw new Error("Gemini CLI cannot expose backend-native tools in an exact restricted run.");
	const mcpServers = isRecord(base.mcpServers) ? { ...base.mcpServers } : {};
	const exposesOpenClawTools = availability.openClaw.length > 0;
	let restrictedMcpServers = {};
	if (exposesOpenClawTools) {
		const openClawMcpServer = mcpServers.openclaw;
		if (!isRecord(openClawMcpServer)) throw new Error("Gemini CLI exact tool availability requires the OpenClaw MCP server.");
		restrictedMcpServers = { openclaw: {
			...openClawMcpServer,
			includeTools: [...availability.openClaw]
		} };
	}
	const { allowed: _allowedTools, core: _coreTools, discoveryCommand: _discoveryCommand, callCommand: _callCommand, ...nonAuthorityToolSettings } = isRecord(base.tools) ? { ...base.tools } : {};
	const { serverCommand: _serverCommand, ...nonAuthorityMcpSettings } = isRecord(base.mcp) ? { ...base.mcp } : {};
	const allowedMcpServers = exposesOpenClawTools ? ["openclaw"] : [crypto.randomUUID()];
	const experimental = isRecord(base.experimental) ? { ...base.experimental } : {};
	const agents = isRecord(base.agents) ? { ...base.agents } : {};
	const agentOverrides = isRecord(agents.overrides) ? { ...agents.overrides } : {};
	const hooksConfig = isRecord(base.hooksConfig) ? { ...base.hooksConfig } : {};
	const skills = isRecord(base.skills) ? { ...base.skills } : {};
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
			...experimental,
			enableAgents: false
		},
		agents: {
			...agents,
			overrides: {
				...agentOverrides,
				codebase_investigator: {
					...isRecord(agentOverrides.codebase_investigator) ? agentOverrides.codebase_investigator : {},
					enabled: false
				},
				cli_help: {
					...isRecord(agentOverrides.cli_help) ? agentOverrides.cli_help : {},
					enabled: false
				}
			}
		},
		hooksConfig: {
			...hooksConfig,
			enabled: false
		},
		skills: {
			...skills,
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
	const settings = buildGeminiCliAuthSettings(selectedType);
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
async function prepareGeminiCliOAuthHome(ctx, credential) {
	const oauth = requireGeminiOAuthCredential(credential);
	if (!oauth) return null;
	if (ctx.toolAvailability !== void 0) {
		const message = "Gemini CLI exact tool availability does not support OAuth; Code Assist auth can inject administrator-required tools.";
		throw ctx.isolatedCompletionSystemPrompt === void 0 ? /* @__PURE__ */ new Error(message) : isolatedCompletionUnsupportedError(message);
	}
	const profileHome = await prepareGeminiCliProfileHome(ctx, "oauth-personal");
	const idToken = normalizeOptionalString(oauth.idToken);
	const oauthCreds = {
		access_token: oauth.access,
		refresh_token: oauth.refresh,
		expiry_date: oauth.expires,
		token_type: "Bearer"
	};
	if (idToken) oauthCreds.id_token = idToken;
	return {
		env: {
			GEMINI_CLI_HOME: profileHome.home,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: profileHome.systemSettingsPath,
			GEMINI_FORCE_FILE_STORAGE: "true",
			...buildGeminiCliProjectEnv(oauth.projectId),
			...profileHome.isolatedSystemPromptPath ? { GEMINI_SYSTEM_MD: profileHome.isolatedSystemPromptPath } : {},
			...profileHome.isolatedSystemPromptPath ? { GEMINI_TELEMETRY_LOG_PROMPTS: "false" } : {}
		},
		clearEnv: [
			...GEMINI_CLI_PROFILE_AUTH_ENV,
			...GEMINI_CLI_PROFILE_SETTINGS_ENV,
			...profileHome.isolatedSystemPromptPath ? [
				"GEMINI_SYSTEM_MD",
				"GEMINI_CLI_HOME",
				"GEMINI_TELEMETRY_LOG_PROMPTS"
			] : []
		],
		beforeExecution: async () => {
			await profileHome.beforeExecution();
			await clearGeminiCliCachedCredentials(profileHome.geminiDir);
			await writeGeminiCliJson(path.join(profileHome.geminiDir, "oauth_creds.json"), oauthCreds);
		},
		cleanup: profileHome.cleanup
	};
}
async function prepareGeminiCliApiKeyHome(ctx, credential) {
	const apiKey = requireGeminiApiKeyCredential(credential);
	if (!apiKey) return null;
	const isolatedCompletionEnforced = assertGeminiCliLiteralIsolatedPrompt(ctx);
	const exactToolAvailability = ctx.toolAvailability !== void 0;
	const restrictedTransportEnv = exactToolAvailability ? await resolveGeminiCliTrustedTransportEnv(ctx) : void 0;
	const profileHome = await prepareGeminiCliProfileHome(ctx, "gemini-api-key");
	return {
		env: {
			GEMINI_CLI_HOME: profileHome.home,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: profileHome.systemSettingsPath,
			GEMINI_FORCE_FILE_STORAGE: "true",
			GEMINI_API_KEY: apiKey.key,
			...exactToolAvailability ? GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS : {},
			...restrictedTransportEnv,
			...profileHome.isolatedSystemPromptPath ? { GEMINI_SYSTEM_MD: profileHome.isolatedSystemPromptPath } : {},
			...profileHome.isolatedSystemPromptPath ? { GEMINI_TELEMETRY_LOG_PROMPTS: "false" } : {}
		},
		clearEnv: [
			...GEMINI_CLI_PROFILE_AUTH_ENV,
			...GEMINI_CLI_PROFILE_SETTINGS_ENV,
			...exactToolAvailability ? ["GEMINI_CLI_HOME"] : [],
			...profileHome.isolatedSystemPromptPath ? ["GEMINI_SYSTEM_MD", "GEMINI_TELEMETRY_LOG_PROMPTS"] : [],
			...exactToolAvailability ? Object.keys(GEMINI_CLI_EXACT_TOOL_ENV_BARRIERS) : [],
			...Object.keys(restrictedTransportEnv ?? {})
		],
		beforeExecution: async () => {
			await profileHome.beforeExecution();
			await Promise.all([fs.rm(path.join(profileHome.geminiDir, "oauth_creds.json"), { force: true }), clearGeminiCliCachedCredentials(profileHome.geminiDir)]);
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
	const prepared = await prepareGeminiCliOAuthHome(ctx, authCredential) ?? await prepareGeminiCliApiKeyHome(ctx, authCredential);
	if (prepared) return ctx.toolAvailability ? {
		...prepared,
		toolAvailabilityEnforced: true
	} : prepared;
	if (normalizeOptionalString(ctx.authProfileId)) throwUnstageableSelectedGeminiProfile(ctx, authCredential);
	return ctx.toolAvailability ? await prepareGeminiCliRestrictedSystemSettings(ctx) : null;
}
//#endregion
export { prepareGeminiCliExecution };
