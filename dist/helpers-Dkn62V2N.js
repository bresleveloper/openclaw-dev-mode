import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as tempWorkspace } from "./private-temp-workspace-MCwLg_M9.js";
import { m as writeJson, o as tryReadJson } from "./json-files-2umMHm0W.js";
import { t as privateFileStore } from "./private-file-store-BAvApZYp.js";
import { t as applyMergePatch } from "./merge-patch-C_IYaUrT.js";
import { t as extractMcpServerMap } from "./bundle-mcp-Dw2VSzjb.js";
import { N as listRegisteredPluginAgentPromptGuidance } from "./command-registration-DbqkNaUv.js";
import "./constants-Mf57IYS0.js";
import { r as extensionForMime } from "./mime-C8mVE2Bw.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { t as detectRuntimeShell } from "./shell-utils-DKmnHE0C.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-Ckmdd15z.js";
import { n as sanitizeImageBlocks } from "./tool-images-BariNQM5.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Nofb8bX9.js";
import { a as stripSystemPromptCacheBoundary } from "./system-prompt-cache-boundary-ewprF4Mn.js";
import { n as toCliBundleMcpServerConfig, t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-CNYc0tEm.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-41kUPP9V.js";
import { t as buildSystemPromptParams } from "./system-prompt-params-CGngRDsr.js";
import { n as detectImageReferences, r as loadImageFromRef } from "./images-B51Ejz41.js";
import { a as decodeHeaderEnvPlaceholder, i as applyCommonServerConfig, o as normalizeStringRecord } from "./codex-mcp-config-BoXfq0NH.js";
import { n as injectCodexMcpConfigArgs, r as formatTomlConfigOverride } from "./bundle-mcp-codex-Br-lf4tL.js";
import { n as CLI_RESUME_WATCHDOG_DEFAULTS, r as CLI_WATCHDOG_MIN_TIMEOUT_MS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-CzmnkdzO.js";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
//#region src/agents/cli-runner/bundle-mcp-claude.ts
/**
* Claude CLI argument helpers for OpenClaw-managed bundle MCP config.
*/
/** Find an existing Claude `--mcp-config` argument value. */
function findClaudeMcpConfigPath(args) {
	if (!args?.length) return;
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		if (arg === "--mcp-config") return normalizeOptionalString(args[i + 1]);
		if (arg.startsWith("--mcp-config=")) return normalizeOptionalString(arg.slice(13));
	}
}
/** Return Claude args with OpenClaw's strict MCP config path injected. */
function injectClaudeMcpConfigArgs(args, mcpConfigPath) {
	const next = [];
	for (let i = 0; i < (args?.length ?? 0); i += 1) {
		const arg = args?.[i] ?? "";
		if (arg === "--strict-mcp-config") continue;
		if (arg === "--mcp-config") {
			i += 1;
			continue;
		}
		if (arg.startsWith("--mcp-config=")) continue;
		next.push(arg);
	}
	next.push("--strict-mcp-config", "--mcp-config", mcpConfigPath);
	return next;
}
/** Writes the active per-attempt capture token into OpenClaw's generated Claude MCP config. */
async function writeClaudeMcpCaptureConfig(params) {
	const raw = JSON.parse(await fs.readFile(params.mcpConfigPath, "utf-8"));
	if (!isRecord(raw)) throw new Error("Claude MCP capture requires an object config");
	const mcpServers = isRecord(raw.mcpServers) ? raw.mcpServers : {};
	const openclaw = isRecord(mcpServers.openclaw) ? mcpServers.openclaw : void 0;
	if (!openclaw) throw new Error("Claude MCP capture requires an openclaw server config");
	const headers = isRecord(openclaw.headers) ? openclaw.headers : {};
	await fs.writeFile(params.mcpConfigPath, `${JSON.stringify({
		...raw,
		mcpServers: {
			...mcpServers,
			openclaw: {
				...openclaw,
				headers: {
					...headers,
					"x-openclaw-cli-capture-key": params.captureKey
				}
			}
		}
	}, null, 2)}\n`, "utf-8");
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-gemini.ts
/**
* Gemini CLI bundle MCP adapter that writes temporary system settings files.
*/
async function readJsonObject(filePath) {
	const raw = await tryReadJson(filePath);
	return raw && typeof raw === "object" && !Array.isArray(raw) ? { ...raw } : {};
}
function resolveEnvPlaceholder(value, inheritedEnv) {
	const decoded = decodeHeaderEnvPlaceholder(value);
	if (!decoded) return value;
	const resolved = inheritedEnv?.[decoded.envVar] ?? process.env[decoded.envVar] ?? "";
	return decoded.bearer ? `Bearer ${resolved}` : resolved;
}
function normalizeGeminiServerConfig(server, inheritedEnv) {
	const next = {};
	applyCommonServerConfig(next, server);
	if (typeof server.type === "string") next.type = server.type;
	const headers = normalizeStringRecord(server.headers);
	if (headers) next.headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, resolveEnvPlaceholder(value, inheritedEnv)]));
	if (typeof server.trust === "boolean") next.trust = server.trust;
	return next;
}
/** Writes merged Gemini system settings and returns env plus cleanup hook. */
async function writeGeminiSystemSettings(mergedConfig, inheritedEnv) {
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-gemini-mcp-"));
	const settingsPath = path.join(tempDir, "settings.json");
	const existingSettingsPath = inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH ?? process.env.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	const base = typeof existingSettingsPath === "string" && existingSettingsPath.trim() ? await readJsonObject(existingSettingsPath) : {};
	const normalizedConfig = { mcpServers: Object.fromEntries(Object.entries(mergedConfig.mcpServers).map(([name, server]) => [name, normalizeGeminiServerConfig(server, inheritedEnv)])) };
	const settings = applyMergePatch(base, {
		mcp: { allowed: Object.keys(normalizedConfig.mcpServers) },
		mcpServers: normalizedConfig.mcpServers
	});
	if (!isRecord(settings.mcp) || !isRecord(settings.mcpServers)) throw new Error("Gemini MCP settings merge produced an invalid object");
	await writeJson(settingsPath, settings, { trailingNewline: true });
	return {
		env: {
			...inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: settingsPath
		},
		cleanup: async () => {
			await fs.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
/** Writes per-attempt Gemini settings with the active loopback capture token. */
async function writeGeminiMcpCaptureSettings(params) {
	const existingSettingsPath = params.inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	if (!existingSettingsPath) throw new Error("Gemini MCP capture requires prepared system settings");
	const settings = await readJsonObject(existingSettingsPath);
	const mcpServers = isRecord(settings.mcpServers) ? settings.mcpServers : {};
	const openclaw = isRecord(mcpServers.openclaw) ? mcpServers.openclaw : {};
	const headers = normalizeStringRecord(openclaw.headers) ?? {};
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-gemini-mcp-attempt-"));
	const settingsPath = path.join(tempDir, "settings.json");
	await writeJson(settingsPath, {
		...settings,
		mcpServers: {
			...mcpServers,
			openclaw: {
				...openclaw,
				headers: {
					...headers,
					"x-openclaw-cli-capture-key": params.captureKey
				}
			}
		}
	}, { trailingNewline: true });
	return {
		env: {
			...params.inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: settingsPath
		},
		cleanup: async () => {
			await fs.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp.ts
/**
* Prepares bundled MCP configuration for CLI runner backends.
*/
function resolveBundleMcpMode(mode) {
	return mode ?? "claude-config-file";
}
async function readExternalMcpConfig(configPath) {
	return { mcpServers: extractMcpServerMap(await tryReadJson(configPath)) };
}
function sortJsonValue(value) {
	if (Array.isArray(value)) return value.map((entry) => sortJsonValue(entry));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.keys(value).toSorted().map((key) => [key, sortJsonValue(value[key])]));
}
function normalizeOpenClawLoopbackUrl(value) {
	const match = /^(http:\/\/(?:127\.0\.0\.1|localhost|\[::1\])):\d+(\/mcp)$/.exec(value.trim()) ?? void 0;
	if (!match) return value;
	return `${match[1]}:<openclaw-loopback>${match[2]}`;
}
function canonicalizeBundleMcpConfigForResume(config) {
	return { mcpServers: sortJsonValue(Object.fromEntries(Object.entries(config.mcpServers).map(([name, server]) => {
		if (name !== "openclaw" || typeof server.url !== "string") return [name, sortJsonValue(server)];
		return [name, sortJsonValue({
			...server,
			url: normalizeOpenClawLoopbackUrl(server.url)
		})];
	}))) };
}
const OPENCLAW_MCP_ENV_TEMPLATE_PATTERN = /\$\{(OPENCLAW_MCP_[A-Z0-9_]+)\}/g;
function resolveOpenClawMcpEnvTemplates(value, env) {
	if (!env) return value;
	if (typeof value === "string") return value.replace(OPENCLAW_MCP_ENV_TEMPLATE_PATTERN, (match, name) => {
		return Object.hasOwn(env, name) ? env[name] : match;
	});
	if (Array.isArray(value)) return value.map((entry) => resolveOpenClawMcpEnvTemplates(entry, env));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveOpenClawMcpEnvTemplates(entry, env)]));
}
async function prepareModeSpecificBundleMcpConfig(params) {
	const serializedConfig = `${JSON.stringify(params.mergedConfig, null, 2)}\n`;
	const mcpConfigHash = crypto.createHash("sha256").update(serializedConfig).digest("hex");
	const serializedResumeConfig = `${JSON.stringify(canonicalizeBundleMcpConfigForResume(params.mergedConfig), null, 2)}\n`;
	const mcpResumeHash = crypto.createHash("sha256").update(serializedResumeConfig).digest("hex");
	if (params.mode === "codex-config-overrides") return {
		backend: {
			...params.backend,
			args: injectCodexMcpConfigArgs(params.backend.args, params.mergedConfig),
			resumeArgs: injectCodexMcpConfigArgs(params.backend.resumeArgs ?? params.backend.args ?? [], params.mergedConfig)
		},
		mcpConfigHash,
		mcpResumeHash,
		env: params.env
	};
	if (params.mode === "gemini-system-settings") {
		const settings = await writeGeminiSystemSettings(params.mergedConfig, params.env);
		return {
			backend: params.backend,
			mcpConfigHash,
			mcpResumeHash,
			env: settings.env,
			cleanup: settings.cleanup
		};
	}
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-cli-mcp-"));
	const mcpConfigPath = path.join(tempDir, "mcp.json");
	const runtimeConfig = resolveOpenClawMcpEnvTemplates(params.mergedConfig, params.env);
	await fs.writeFile(mcpConfigPath, `${JSON.stringify(runtimeConfig, null, 2)}\n`, "utf-8");
	return {
		backend: {
			...params.backend,
			args: injectClaudeMcpConfigArgs(params.backend.args, mcpConfigPath),
			resumeArgs: injectClaudeMcpConfigArgs(params.backend.resumeArgs ?? params.backend.args ?? [], mcpConfigPath)
		},
		mcpConfigHash,
		mcpResumeHash,
		env: params.env,
		cleanup: async () => {
			await fs.rm(tempDir, {
				recursive: true,
				force: true
			});
		}
	};
}
/** Prepare backend args/env/cleanup for bundle MCP injection into a CLI run. */
async function prepareCliBundleMcpConfig(params) {
	if (!params.enabled) return {
		backend: params.backend,
		env: params.env
	};
	const mode = resolveBundleMcpMode(params.mode);
	const existingMcpConfigPath = mode === "claude-config-file" ? findClaudeMcpConfigPath(params.backend.resumeArgs) ?? findClaudeMcpConfigPath(params.backend.args) : void 0;
	let mergedConfig = { mcpServers: {} };
	if (existingMcpConfigPath) {
		const resolvedExistingPath = path.isAbsolute(existingMcpConfigPath) ? existingMcpConfigPath : path.resolve(params.workspaceDir, existingMcpConfigPath);
		mergedConfig = applyMergePatch(mergedConfig, await readExternalMcpConfig(resolvedExistingPath));
	}
	const bundleConfig = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		mapConfiguredServer: toCliBundleMcpServerConfig
	});
	for (const diagnostic of bundleConfig.diagnostics) params.warn?.(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	mergedConfig = applyMergePatch(mergedConfig, bundleConfig.config);
	if (params.additionalConfig) mergedConfig = applyMergePatch(mergedConfig, params.additionalConfig);
	return await prepareModeSpecificBundleMcpConfig({
		mode,
		backend: params.backend,
		mergedConfig,
		env: params.env
	});
}
/** Prepares a per-attempt capture token without changing resume compatibility hashes. */
async function prepareCliBundleMcpCaptureAttempt(params) {
	if (!params.captureKey) return { env: params.env };
	if (resolveBundleMcpMode(params.mode) === "gemini-system-settings") return await writeGeminiMcpCaptureSettings({
		inheritedEnv: params.env,
		captureKey: params.captureKey
	});
	if (resolveBundleMcpMode(params.mode) === "claude-config-file") {
		const mcpConfigPath = findClaudeMcpConfigPath(params.backend?.args) ?? findClaudeMcpConfigPath(params.backend?.resumeArgs);
		if (mcpConfigPath) await writeClaudeMcpCaptureConfig({
			mcpConfigPath,
			captureKey: params.captureKey
		});
	}
	return { env: {
		...params.env,
		OPENCLAW_MCP_CLI_CAPTURE_KEY: params.captureKey
	} };
}
//#endregion
//#region src/agents/cli-runner/reliability.ts
/**
* Watchdog and supervisor key helpers for CLI runner reliability.
*/
function pickWatchdogProfile(backend, useResume, trigger, hasExplicitRunTimeout) {
	const configured = useResume ? backend.reliability?.watchdog?.resume : backend.reliability?.watchdog?.fresh;
	const defaults = useResume && !configured && (trigger === "cron" || hasExplicitRunTimeout === true) ? CLI_FRESH_WATCHDOG_DEFAULTS : useResume ? CLI_RESUME_WATCHDOG_DEFAULTS : CLI_FRESH_WATCHDOG_DEFAULTS;
	const ratio = (() => {
		const value = configured?.noOutputTimeoutRatio;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.noOutputTimeoutRatio;
		return Math.max(.05, Math.min(.95, value));
	})();
	const minMs = (() => {
		const value = configured?.minMs;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.minMs;
		return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
	})();
	const maxMs = (() => {
		const value = configured?.maxMs;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.maxMs;
		return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
	})();
	return {
		noOutputTimeoutMs: typeof configured?.noOutputTimeoutMs === "number" && Number.isFinite(configured.noOutputTimeoutMs) ? Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(configured.noOutputTimeoutMs)) : void 0,
		noOutputTimeoutRatio: ratio,
		minMs: Math.min(minMs, maxMs),
		maxMs: Math.max(minMs, maxMs)
	};
}
/** Resolves the no-output watchdog timeout for a fresh or resumed CLI run. */
function resolveCliNoOutputTimeoutMs(params) {
	const hasExplicitRunTimeout = typeof params.runTimeoutOverrideMs === "number" && Number.isFinite(params.runTimeoutOverrideMs) && params.runTimeoutOverrideMs > 0;
	const profile = pickWatchdogProfile(params.backend, params.useResume, params.trigger, hasExplicitRunTimeout);
	const cap = Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, params.timeoutMs - 1e3);
	if (profile.noOutputTimeoutMs !== void 0) return Math.min(profile.noOutputTimeoutMs, cap);
	const computed = Math.floor(params.timeoutMs * profile.noOutputTimeoutRatio);
	const bounded = Math.min(profile.maxMs, Math.max(profile.minMs, computed));
	return Math.min(bounded, cap);
}
function resolveCliRunTimeoutOverrideMs(params) {
	if (params.runTimeoutOverrideMs !== void 0) return params.runTimeoutOverrideMs;
	const configuredTimeoutSeconds = params.config?.agents?.defaults?.timeoutSeconds;
	return params.lane !== AGENT_LANE_SUBAGENT && typeof configuredTimeoutSeconds === "number" && Number.isFinite(configuredTimeoutSeconds) && configuredTimeoutSeconds > 0 ? params.timeoutMs : void 0;
}
/** Builds a supervisor scope key for session-owned CLI processes. */
function buildCliSupervisorScopeKey(params) {
	const commandToken = normalizeLowercaseStringOrEmpty(path.basename(params.backend.command ?? ""));
	const backendToken = normalizeLowercaseStringOrEmpty(params.backendId);
	const sessionToken = params.cliSessionId?.trim();
	if (!sessionToken) return;
	return `cli:${backendToken}:${commandToken}:${sessionToken}`;
}
//#endregion
//#region src/agents/cli-runner/helpers.ts
/**
* Shared helpers for CLI runner prompts, args, queueing, sessions, and image
* payload preparation.
*/
const CLI_RUN_QUEUE = new KeyedAsyncQueue();
function isClaudeCliProvider(providerId) {
	return normalizeOptionalLowercaseString(providerId) === "claude-cli";
}
/** Enqueues a CLI run under a backend/session key to prevent unsafe overlap. */
function enqueueCliRun(key, task) {
	return CLI_RUN_QUEUE.enqueue(key, task);
}
/**
* Hashes the (account, agent, auth-profile, session) tuple to a stable owner key
* shared between the CLI run queue (`resolveCliRunQueueKey`) and the Claude live
* session map (`buildClaudeLiveKey`). The two paths must agree byte-for-byte
* within a single process so a fresh queued turn picks up the same live session
* the registry already holds; the golden-hash test below pins the encoding.
*/
function buildClaudeOwnerKey(input) {
	return crypto.createHash("sha256").update(JSON.stringify({
		agentAccountId: input.agentAccountId,
		agentId: input.agentId,
		authProfileId: input.authProfileId,
		sessionId: input.sessionId,
		sessionKey: input.sessionKey
	})).digest("hex");
}
/** Resolves the serialization key for a CLI backend run. */
function resolveCliRunQueueKey(params) {
	const requiresLiveSessionSerialization = isClaudeCliProvider(params.backendId) && params.liveSession === "claude-stdio";
	if (params.serialize === false && !requiresLiveSessionSerialization) return `${params.backendId}:${params.runId}`;
	if (isClaudeCliProvider(params.backendId)) {
		const ownerKey = params.ownerKey?.trim();
		if (requiresLiveSessionSerialization && ownerKey) return `${params.backendId}:owner:${ownerKey}`;
		const sessionId = params.cliSessionId?.trim();
		if (sessionId) return `${params.backendId}:session:${sessionId}`;
		if (ownerKey) return `${params.backendId}:owner:${ownerKey}`;
		const workspaceDir = params.workspaceDir.trim();
		if (workspaceDir) return `${params.backendId}:workspace:${workspaceDir}`;
	}
	return params.backendId;
}
/** Builds the system prompt sent to a CLI-backed agent runtime. */
function buildCliAgentSystemPrompt(params) {
	const runtimeWorkspaceDir = params.cwd?.trim() || params.workspaceDir;
	const defaultModelRef = resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	const defaultModelLabel = `${defaultModelRef.provider}/${defaultModelRef.model}`;
	const { runtimeInfo, userTimezone, userTime, userTimeFormat } = buildSystemPromptParams({
		config: params.config,
		agentId: params.agentId,
		workspaceDir: runtimeWorkspaceDir,
		cwd: runtimeWorkspaceDir,
		runtime: {
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			host: "openclaw",
			os: `${os.type()} ${os.release()}`,
			arch: os.arch(),
			node: process.version,
			model: params.modelDisplay,
			defaultModel: defaultModelLabel,
			shell: detectRuntimeShell(),
			channel: params.runtimeChannel,
			chatType: params.runtimeChatType,
			capabilities: params.runtimeCapabilities
		}
	});
	return buildConfiguredAgentSystemPrompt({
		config: params.config,
		agentId: params.agentId,
		workspaceDir: runtimeWorkspaceDir,
		defaultThinkLevel: params.defaultThinkLevel,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		silentReplyPromptMode: params.silentReplyPromptMode,
		ownerNumbers: params.ownerNumbers,
		reasoningTagHint: false,
		heartbeatPrompt: params.heartbeatPrompt,
		docsPath: params.docsPath,
		sourcePath: params.sourcePath,
		acpEnabled: isAcpRuntimeSpawnAvailable({ config: params.config }),
		promptSurface: "cli_backend",
		nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: "cli_backend" }),
		runtimeInfo,
		toolNames: params.tools.map((tool) => tool.name),
		skillsPrompt: params.skillsPrompt,
		userTimezone,
		userTime,
		userTimeFormat,
		contextFiles: params.contextFiles
	});
}
/** Applies backend model aliases to a requested CLI model id. */
function normalizeCliModel(modelId, backend) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	const direct = backend.modelAliases?.[trimmed];
	if (direct) return direct;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const mapped = backend.modelAliases?.[lower];
	if (mapped) return mapped;
	return trimmed;
}
/** Decides whether a system prompt should be sent for this CLI turn. */
function resolveSystemPromptUsage(params) {
	const systemPrompt = params.systemPrompt?.trim();
	if (!systemPrompt) return null;
	const when = params.backend.systemPromptWhen ?? "first";
	if (when === "never") return null;
	if (when === "first" && !params.isNewSession) return null;
	if (!params.backend.systemPromptArg?.trim() && !params.backend.systemPromptFileArg?.trim() && !params.backend.systemPromptFileConfigKey?.trim()) return null;
	return systemPrompt;
}
/** Resolves the CLI session id to send and whether the turn starts a new session. */
function resolveSessionIdToSend(params) {
	const mode = params.backend.sessionMode ?? "always";
	const existing = params.cliSessionId?.trim();
	if (mode === "none") return {
		sessionId: void 0,
		isNew: !existing
	};
	if (mode === "existing") return {
		sessionId: existing,
		isNew: !existing
	};
	if (existing) return {
		sessionId: existing,
		isNew: false
	};
	return {
		sessionId: crypto.randomUUID(),
		isNew: true
	};
}
/** Routes prompt text to argv or stdin based on backend input policy. */
function resolvePromptInput(params) {
	if ((params.backend.input ?? "arg") === "stdin") return { stdin: params.prompt };
	if (params.backend.maxPromptArgChars && params.prompt.length > params.backend.maxPromptArgChars) return { stdin: params.prompt };
	return { argsPrompt: params.prompt };
}
function resolveCliImagePath(image) {
	const ext = extensionForMime(image.mimeType) ?? ".bin";
	const digest = crypto.createHash("sha256").update(image.mimeType).update("\0").update(image.data).digest("hex");
	return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images", `${digest}${ext}`);
}
function resolveCliImageRoot(params) {
	if (params.backend.imagePathScope === "workspace") return path.join(params.workspaceDir, ".openclaw-cli-images");
	return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images");
}
function appendImagePathsToPrompt(prompt, paths, prefix = "") {
	if (!paths.length) return prompt;
	const trimmed = prompt.trimEnd();
	return `${trimmed}${trimmed ? "\n\n" : ""}${paths.map((entry) => `${prefix}${entry}`).join("\n")}`;
}
/** Loads and sanitizes image references found in prompt text. */
async function loadPromptRefImages(params) {
	const refs = detectImageReferences(params.prompt);
	if (refs.length === 0) return [];
	const maxBytes = params.maxBytes ?? 6291456;
	const seen = /* @__PURE__ */ new Set();
	const images = [];
	for (const ref of refs) {
		const key = `${ref.type}:${ref.resolved}`;
		if (seen.has(key)) continue;
		seen.add(key);
		const image = await loadImageFromRef(ref, params.workspaceDir, {
			maxBytes,
			workspaceOnly: params.workspaceOnly,
			sandbox: params.sandbox
		});
		if (image) images.push(image);
	}
	const { images: sanitizedImages } = await sanitizeImageBlocks(images, "prompt:images", { maxBytes });
	return sanitizedImages;
}
/** Writes CLI image payloads to private paths and returns their file paths. */
async function writeCliImages(params) {
	const imageRoot = resolveCliImageRoot({
		backend: params.backend,
		workspaceDir: params.workspaceDir
	});
	await fs.mkdir(imageRoot, {
		recursive: true,
		mode: 448
	});
	const store = privateFileStore(imageRoot);
	const paths = [];
	for (const image of params.images) {
		const fileName = path.basename(resolveCliImagePath(image));
		const buffer = Buffer.from(image.data, "base64");
		await store.writeText(fileName, buffer);
		paths.push(store.path(fileName));
	}
	const cleanup = async () => {};
	return {
		paths,
		cleanup
	};
}
/** Writes a temporary system prompt file when the backend needs file-based prompts. */
async function writeCliSystemPromptFile(params) {
	if (!params.backend.systemPromptFileArg?.trim() && !params.backend.systemPromptFileConfigKey?.trim()) return { cleanup: async () => {} };
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-cli-system-prompt-"
	});
	return {
		filePath: await workspace.write("system-prompt.md", stripSystemPromptCacheBoundary(params.systemPrompt)),
		cleanup: async () => await workspace.cleanup()
	};
}
/** Prepares prompt text and image paths for a CLI backend run. */
async function prepareCliPromptImagePayload(params) {
	let prompt = params.prompt;
	const resolvedImages = params.images && params.images.length > 0 ? params.images : await loadPromptRefImages({
		prompt,
		workspaceDir: params.workspaceDir
	});
	if (resolvedImages.length === 0) return { prompt };
	const imagePayload = await writeCliImages({
		backend: params.backend,
		workspaceDir: params.workspaceDir,
		images: resolvedImages
	});
	const imagePaths = imagePayload.paths;
	if (!params.backend.imageArg || params.backend.input === "stdin" || params.backend.imageArg === "@") prompt = appendImagePathsToPrompt(prompt, imagePaths, params.backend.imageArg === "@" ? "@" : "");
	return {
		prompt,
		imagePaths,
		cleanupImages: imagePayload.cleanup
	};
}
/** Builds final CLI argv from backend config and prepared prompt/session inputs. */
function buildCliArgs(params) {
	const args = [...params.baseArgs];
	if (params.backend.modelArg && params.modelId) args.push(params.backend.modelArg, params.modelId);
	if ((!params.useResume || params.backend.systemPromptWhen === "always") && params.systemPrompt && params.systemPromptFilePath && params.backend.systemPromptFileArg) args.push(params.backend.systemPromptFileArg, params.systemPromptFilePath);
	else if ((!params.useResume || params.backend.systemPromptWhen === "always") && params.systemPrompt && params.systemPromptFilePath && params.backend.systemPromptFileConfigKey) args.push(params.backend.systemPromptFileConfigArg ?? "-c", formatTomlConfigOverride(params.backend.systemPromptFileConfigKey, params.systemPromptFilePath));
	else if ((!params.useResume || params.backend.systemPromptWhen === "always") && params.systemPrompt && params.backend.systemPromptArg) args.push(params.backend.systemPromptArg, stripSystemPromptCacheBoundary(params.systemPrompt));
	if (!params.useResume && params.sessionId) {
		if (params.backend.sessionArgs && params.backend.sessionArgs.length > 0) for (const entry of params.backend.sessionArgs) args.push(entry.replaceAll("{sessionId}", params.sessionId));
		else if (params.backend.sessionArg) args.push(params.backend.sessionArg, params.sessionId);
	}
	if (params.promptArg !== void 0) {
		let replacedPromptPlaceholder = false;
		for (let i = 0; i < args.length; i += 1) if (args[i] === "{prompt}") {
			args[i] = params.promptArg;
			replacedPromptPlaceholder = true;
		}
		if (!replacedPromptPlaceholder) args.push(params.promptArg);
	}
	if (params.imagePaths && params.imagePaths.length > 0) {
		const mode = params.backend.imageMode ?? "repeat";
		const imageArg = params.backend.imageArg;
		if (imageArg && imageArg !== "@") if (mode === "list") args.push(imageArg, params.imagePaths.join(","));
		else for (const imagePath of params.imagePaths) args.push(imageArg, imagePath);
	}
	return args;
}
//#endregion
export { normalizeCliModel as a, resolvePromptInput as c, writeCliSystemPromptFile as d, buildCliSupervisorScopeKey as f, prepareCliBundleMcpConfig as g, prepareCliBundleMcpCaptureAttempt as h, enqueueCliRun as i, resolveSessionIdToSend as l, resolveCliRunTimeoutOverrideMs as m, buildCliAgentSystemPrompt as n, prepareCliPromptImagePayload as o, resolveCliNoOutputTimeoutMs as p, buildCliArgs as r, resolveCliRunQueueKey as s, buildClaudeOwnerKey as t, resolveSystemPromptUsage as u };
