import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord, s as filterStringRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries } from "./string-normalization-CECOqf64.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { d as writeJson, l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { t as applyMergePatch } from "./merge-patch-C4XTCka4.mjs";
import { n as acquireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-CsCOZa1-.mjs";
import { f as releaseSessionMcpRuntime } from "./mcp-app-model-context-XPQPOrco.mjs";
import { t as extractMcpServerMap } from "./bundle-mcp-B0gcrw-D.mjs";
import { i as toCliBundleMcpServerConfig, r as prepareOwnedBundleMcpDataDirs, t as loadMergedBundleMcpConfig } from "./bundle-mcp-config-CNRt7XB0.mjs";
import { h as labelRuntimeContextText } from "./types-CQc6JNG4.mjs";
import { u as projectRuntimeContextFragments } from "./internal-runtime-context-CAWYwg4i.mjs";
import { r as resolveMcpBearerBundleConfig } from "./mcp-auth-profile-CEl_bToU.mjs";
import { r as buildCliSessionDriftNote } from "./cli-session-B9R5wqcb.mjs";
import { a as resolveQuestionTimeoutMs } from "./ask-user-tool-normalization-F7IQTaTx.mjs";
import { a as prepareActiveNodeContext, t as buildActiveNodeContextText } from "./active-node-context-DpQMef3G.mjs";
import { c as buildMediaTaskRuntimeContext } from "./media-generation-task-status-2HywbS4t.mjs";
import { i as buildRuntimeContextCustomMessage } from "./runtime-context-prompt-CKrto4c6.mjs";
import { t as buildProactiveSubagentOrchestrationSection } from "./ultra-orchestration-KhJuvQWv.mjs";
import { n as composeSystemPromptWithHookContext } from "./attempt-thread-helpers-gZl1Udg3.mjs";
import { t as resolveSessionGitCoauthorPrompt } from "./git-coauthor-prompt-hoIUHaT4.mjs";
import { n as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV, t as OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV } from "./openclaw-tools-serve-config-BTwSHtye.mjs";
import { n as normalizeBundleMcpServerConfig, t as decodeHeaderEnvPlaceholder } from "./bundle-mcp-adapter-DfH5O5-o.mjs";
import { a as applyPreparedNativeMcpPolicy, o as prepareNativeMcpPolicy, r as injectCodexMcpConfigArgs, s as preparedNativeMcpDenials } from "./bundle-mcp-codex-DQTL1lFU.mjs";
import { n as cliBackendLog } from "./log-C-xabBWt.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/agents/cli-runner/bundle-mcp-runtime.ts
function injectBundleMcpBackendArgs(backend, inject) {
	return {
		...backend,
		args: inject(backend.args),
		resumeArgs: inject(backend.resumeArgs ?? backend.args ?? [])
	};
}
async function writeTemporaryBundleMcpJson(prefix, value, fileName = "settings.json", atomic = true) {
	const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
	const filePath = path.join(tempDir, fileName);
	if (atomic) await writeJson(filePath, value, { trailingNewline: true });
	else await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
	return {
		filePath,
		cleanup: () => fs.rm(tempDir, {
			recursive: true,
			force: true
		})
	};
}
function withOpenClawMcpCaptureHeader(config, captureKey, missingServerError) {
	const mcpServers = isRecord(config.mcpServers) ? config.mcpServers : {};
	if (!(isRecord(mcpServers.openclaw) ? mcpServers.openclaw : void 0) && missingServerError) throw new Error(missingServerError);
	return applyMergePatch(config, { mcpServers: { openclaw: { headers: { "x-openclaw-cli-capture-key": captureKey } } } });
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-claude.ts
const CLAUDE_MANAGED_MCP_TIMEOUT_MS = resolveQuestionTimeoutMs(3600);
function applyClaudeManagedMcpTimeout(config) {
	return {
		...config,
		mcpServers: {
			...config.mcpServers,
			openclaw: {
				...config.mcpServers.openclaw,
				timeout: CLAUDE_MANAGED_MCP_TIMEOUT_MS
			}
		}
	};
}
function extractClaudeVariadicArgs(args, names) {
	const next = [];
	const values = [];
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i] ?? "";
		const equalsIndex = arg.indexOf("=");
		const name = equalsIndex < 0 ? arg : arg.slice(0, equalsIndex);
		if (!names.includes(name)) next.push(arg);
		else if (equalsIndex >= 0) values.push(arg.slice(equalsIndex + 1));
		else while (typeof args[i + 1] === "string" && !args[i + 1]?.startsWith("-")) {
			i += 1;
			values.push(args[i] ?? "");
		}
	}
	return {
		args: next,
		values
	};
}
function findClaudeMcpConfigPaths(args) {
	return extractClaudeVariadicArgs(args ?? [], ["--mcp-config"]).values.map(normalizeOptionalString).filter((value) => value !== void 0);
}
function mergeClaudeDisallowedTools(args, deniedTools) {
	if (deniedTools.length === 0) return args;
	const { args: next, values } = extractClaudeVariadicArgs(args, ["--disallowedTools", "--disallowed-tools"]);
	next.push("--disallowedTools", [.../* @__PURE__ */ new Set([...values, ...deniedTools])].join(","));
	return next;
}
function normalizeClaudeMcpIdentifierPart(value) {
	return value.replaceAll(/[^a-zA-Z0-9_-]/g, "_");
}
function injectClaudeWebSearchDisabledArgs(args) {
	return mergeClaudeDisallowedTools(args ?? [], ["WebSearch"]);
}
function injectClaudeMcpConfigArgs(args, mcpConfigPath, mcpToolsDeny, webSearchEnabled) {
	const next = extractClaudeVariadicArgs(args ?? [], ["--mcp-config"]).args.filter((arg) => arg !== "--strict-mcp-config");
	next.push("--strict-mcp-config", "--mcp-config", mcpConfigPath);
	const deniedTools = Object.entries(mcpToolsDeny ?? {}).flatMap(([serverName, toolNames]) => toolNames.map((toolName) => `mcp__${normalizeClaudeMcpIdentifierPart(serverName)}__${normalizeClaudeMcpIdentifierPart(toolName)}`));
	if (webSearchEnabled === false) deniedTools.push("WebSearch");
	return mergeClaudeDisallowedTools(next, deniedTools.toSorted());
}
/** Writes the active per-attempt capture token into OpenClaw's generated Claude MCP config. */
async function writeClaudeMcpCaptureConfig(params) {
	const raw = JSON.parse(await fs.readFile(params.mcpConfigPath, "utf-8"));
	if (!isRecord(raw)) throw new Error("Claude MCP capture requires an object config");
	await fs.writeFile(params.mcpConfigPath, `${JSON.stringify(withOpenClawMcpCaptureHeader(raw, params.captureKey, "Claude MCP capture requires an openclaw server config"), null, 2)}\n`, "utf-8");
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp-gemini.ts
const GEMINI_MCP_SERVER_FIELDS = {
	strings: ["type"],
	booleans: ["trust"]
};
async function readJsonObject(filePath) {
	const raw = await tryReadJson(filePath);
	return isRecord(raw) ? { ...raw } : {};
}
async function readGeminiBaseSettings(inheritedEnv) {
	const settingsPath = inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH ?? process.env.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	return typeof settingsPath === "string" && settingsPath.trim() ? await readJsonObject(settingsPath) : {};
}
function mergeGeminiWebSearchDisabled(base) {
	const existing = filterStringEntries(isRecord(base.tools) ? base.tools.exclude : void 0);
	return applyMergePatch(base, { tools: { exclude: [.../* @__PURE__ */ new Set([...existing, "google_web_search"])] } });
}
async function writeGeminiSettings(settings, inheritedEnv) {
	const temporary = await writeTemporaryBundleMcpJson("openclaw-gemini-mcp-", settings);
	return {
		env: {
			...inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: temporary.filePath
		},
		cleanup: temporary.cleanup
	};
}
async function writeGeminiWebSearchDisabledSettings(inheritedEnv) {
	return await writeGeminiSettings(mergeGeminiWebSearchDisabled(await readGeminiBaseSettings(inheritedEnv)), inheritedEnv);
}
function resolveEnvPlaceholder(value, inheritedEnv) {
	const decoded = decodeHeaderEnvPlaceholder(value);
	if (!decoded) return value;
	const resolved = inheritedEnv?.[decoded.envVar] ?? process.env[decoded.envVar] ?? "";
	return decoded.bearer ? `Bearer ${resolved}` : resolved;
}
function normalizeGeminiServerConfig(server, inheritedEnv, deniedTools) {
	const next = normalizeBundleMcpServerConfig(server, GEMINI_MCP_SERVER_FIELDS);
	const headers = filterStringRecord(server.headers);
	if (headers) next.headers = Object.fromEntries(Object.entries(headers).map(([name, value]) => [name, resolveEnvPlaceholder(value, inheritedEnv)]));
	const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
	const included = filterStringEntries(toolFilter.include);
	if (included.length > 0) {
		const existing = filterStringEntries(server.includeTools);
		const finalIncluded = existing.length > 0 ? included.filter((name) => existing.includes(name)).toSorted() : [...new Set(included)].toSorted();
		if (finalIncluded.length === 0) return;
		next.includeTools = finalIncluded;
	}
	const filteredDenied = filterStringEntries(toolFilter.exclude);
	if (deniedTools?.length || filteredDenied.length > 0) {
		const existing = filterStringEntries(server.excludeTools);
		next.excludeTools = [.../* @__PURE__ */ new Set([
			...existing,
			...filteredDenied,
			...deniedTools ?? []
		])].toSorted();
	}
	return next;
}
async function writeGeminiSystemSettings(mergedConfig, inheritedEnv, mcpToolsDeny, webSearchEnabled) {
	const base = await readGeminiBaseSettings(inheritedEnv);
	const mcpServers = Object.fromEntries(Object.entries(mergedConfig.mcpServers).flatMap(([name, server]) => {
		const normalized = normalizeGeminiServerConfig(server, inheritedEnv, mcpToolsDeny && Object.hasOwn(mcpToolsDeny, name) ? mcpToolsDeny[name] : void 0);
		return normalized ? [[name, normalized]] : [];
	}));
	return await writeGeminiSettings(applyMergePatch(webSearchEnabled === false ? mergeGeminiWebSearchDisabled(base) : base, {
		mcp: { allowed: Object.keys(mcpServers) },
		mcpServers
	}), inheritedEnv);
}
/** Writes per-attempt Gemini settings with the active loopback capture token. */
async function writeGeminiMcpCaptureSettings(params) {
	const existingSettingsPath = params.inheritedEnv?.GEMINI_CLI_SYSTEM_SETTINGS_PATH;
	if (!existingSettingsPath) throw new Error("Gemini MCP capture requires prepared system settings");
	const temporary = await writeTemporaryBundleMcpJson("openclaw-gemini-mcp-attempt-", withOpenClawMcpCaptureHeader(await readJsonObject(existingSettingsPath), params.captureKey));
	return {
		env: {
			...params.inheritedEnv,
			GEMINI_CLI_SYSTEM_SETTINGS_PATH: temporary.filePath
		},
		cleanup: temporary.cleanup
	};
}
//#endregion
//#region src/agents/cli-runner/bundle-mcp.ts
/** A managed provider pin replaces native search without disabling OpenClaw's MCP tool. */
function resolveCliNativeWebSearchEnabled(params, backend) {
	if (params.toolOverrides?.webSearch === false) return false;
	if (!backend.bundleMcp && !backend.bundleMcpMode) return true;
	const search = params.config?.tools?.web?.search;
	return search?.enabled !== false && !search?.provider?.trim();
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
function canonicalizeSystemAgentTurnStateForResume(server) {
	if (!isRecord(server.env) || server.env["OPENCLAW_TOOLS_MCP_TOOLS"] !== "openclaw") return server;
	return {
		...server,
		env: {
			...server.env,
			[OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_APPROVAL_ARMED_ENV]: "<openclaw-turn-state>",
			[OPENCLAW_TOOLS_MCP_SYSTEM_AGENT_PROPOSAL_ENV]: "<openclaw-turn-state>"
		}
	};
}
function canonicalizeBundleMcpConfigForResume(config) {
	return { mcpServers: sortJsonValue(Object.fromEntries(Object.entries(config.mcpServers).map(([name, server]) => {
		const canonicalServer = canonicalizeSystemAgentTurnStateForResume(server);
		if (name !== "openclaw" || typeof canonicalServer.url !== "string") return [name, canonicalServer];
		return [name, {
			...canonicalServer,
			url: normalizeOpenClawLoopbackUrl(canonicalServer.url)
		}];
	}))) };
}
const OPENCLAW_MCP_ENV_TEMPLATE_PATTERN = /\$\{(OPENCLAW_MCP_[A-Z0-9_]+)\}/g;
function normalizeMcpToolDenials(value) {
	const entries = Object.entries(value ?? {}).map(([serverName, toolNames]) => [serverName, [...new Set(toolNames)].toSorted()]).filter(([, toolNames]) => toolNames.length > 0).toSorted(([left], [right]) => left.localeCompare(right));
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
function applyCodexMcpToolDenials(config, denials) {
	if (!denials) return config;
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).map(([serverName, server]) => {
		const denied = Object.hasOwn(denials, serverName) ? denials[serverName] : void 0;
		if (!denied?.length) return [serverName, server];
		const toolFilter = isRecord(server.toolFilter) ? server.toolFilter : {};
		const existing = filterStringEntries(toolFilter.exclude);
		return [serverName, {
			...server,
			toolFilter: {
				...toolFilter,
				exclude: [.../* @__PURE__ */ new Set([...existing, ...denied])].toSorted()
			}
		}];
	})) };
}
function applyMcpServerOverrides(config, overrides) {
	return overrides ? { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).filter(([serverName]) => !Object.hasOwn(overrides, serverName) || overrides[serverName] !== false)) } : config;
}
function selectBundleMcpServers(config, selected) {
	return { mcpServers: Object.fromEntries(Object.entries(config.mcpServers).filter(([name]) => Object.hasOwn(selected.mcpServers, name))) };
}
function resolveOpenClawMcpEnvTemplates(value, env) {
	if (!env) return value;
	if (typeof value === "string") return value.replace(OPENCLAW_MCP_ENV_TEMPLATE_PATTERN, (match, name) => {
		const replacement = env[name];
		return Object.hasOwn(env, name) && replacement !== void 0 ? replacement : match;
	});
	if (Array.isArray(value)) return value.map((entry) => resolveOpenClawMcpEnvTemplates(entry, env));
	if (!isRecord(value)) return value;
	return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveOpenClawMcpEnvTemplates(entry, env)]));
}
async function prepareModeSpecificBundleMcpConfig(params) {
	const mcpToolsDeny = normalizeMcpToolDenials(params.mcpToolsDeny);
	const webSearchDisabled = params.webSearchEnabled === false;
	const cliConfig = { mcpServers: Object.fromEntries(Object.entries(params.mergedConfig.mcpServers).map(([name, server]) => [name, toCliBundleMcpServerConfig(server)])) };
	const hashConfig = (config) => sha256Hex(`${JSON.stringify(mcpToolsDeny || webSearchDisabled ? {
		config,
		mcpToolsDeny,
		webSearchDisabled
	} : config, null, 2)}\n`);
	const fingerprints = {
		mcpConfigHash: hashConfig(cliConfig),
		mcpResumeHash: hashConfig(canonicalizeBundleMcpConfigForResume(cliConfig))
	};
	if (params.mode === "codex-config-overrides") {
		const codexConfig = applyCodexMcpToolDenials(cliConfig, mcpToolsDeny);
		return {
			backend: injectBundleMcpBackendArgs(params.backend, (args) => webSearchDisabled ? [
				...injectCodexMcpConfigArgs(args, codexConfig),
				"-c",
				"web_search=\"disabled\""
			] : injectCodexMcpConfigArgs(args, codexConfig)),
			...fingerprints,
			env: params.env
		};
	}
	if (params.mode === "gemini-system-settings") {
		const settings = await writeGeminiSystemSettings(cliConfig, params.env, mcpToolsDeny, params.webSearchEnabled);
		return {
			backend: params.backend,
			...fingerprints,
			env: settings.env,
			cleanup: settings.cleanup
		};
	}
	const runtimeConfig = resolveOpenClawMcpEnvTemplates(cliConfig, params.env);
	const temporary = await writeTemporaryBundleMcpJson("openclaw-cli-mcp-", { mcpServers: Object.fromEntries(Object.entries(runtimeConfig.mcpServers).map(([name, server]) => {
		const { toolFilter: _toolFilter, ...nativeServer } = server;
		return [name, nativeServer];
	})) }, "mcp.json", false);
	return {
		backend: injectBundleMcpBackendArgs(params.backend, (args) => injectClaudeMcpConfigArgs(args, temporary.filePath, mcpToolsDeny, params.webSearchEnabled)),
		...fingerprints,
		env: params.env,
		cleanup: temporary.cleanup
	};
}
async function prepareCliWebSearchDisabled(params) {
	const fingerprint = sha256Hex("web-search-disabled-v1");
	if (params.mode === "gemini-system-settings") {
		const settings = await writeGeminiWebSearchDisabledSettings(params.env);
		return {
			backend: params.backend,
			env: settings.env,
			cleanup: settings.cleanup,
			mcpConfigHash: fingerprint,
			mcpResumeHash: fingerprint
		};
	}
	return {
		backend: injectBundleMcpBackendArgs(params.backend, (args) => params.mode === "codex-config-overrides" ? [
			...args ?? [],
			"-c",
			"web_search=\"disabled\""
		] : injectClaudeWebSearchDisabledArgs(args)),
		env: params.env,
		mcpConfigHash: fingerprint,
		mcpResumeHash: fingerprint
	};
}
/** Prepare backend args/env/cleanup for bundle MCP injection into a CLI run. */
async function prepareCliBundleMcpConfig(params) {
	const nativeWebSearchEnabled = resolveCliNativeWebSearchEnabled(params, {
		bundleMcp: params.enabled,
		bundleMcpMode: params.mode
	});
	if (!params.enabled) return !nativeWebSearchEnabled ? await prepareCliWebSearchDisabled({
		mode: params.mode ?? "claude-config-file",
		backend: params.backend,
		env: params.env
	}) : {
		backend: params.backend,
		env: params.env
	};
	const mode = params.mode ?? "claude-config-file";
	if (params.exclusiveConfig) return await prepareModeSpecificBundleMcpConfig({
		mode,
		backend: params.backend,
		mergedConfig: applyMcpServerOverrides(params.exclusiveConfig, params.toolOverrides?.mcpServers),
		env: params.env,
		mcpToolsDeny: params.toolOverrides?.mcpToolsDeny,
		webSearchEnabled: nativeWebSearchEnabled
	});
	const resumeMcpConfigPaths = mode === "claude-config-file" ? findClaudeMcpConfigPaths(params.backend.resumeArgs) : [];
	const existingMcpConfigPaths = mode === "claude-config-file" && resumeMcpConfigPaths.length > 0 ? resumeMcpConfigPaths : mode === "claude-config-file" ? findClaudeMcpConfigPaths(params.backend.args) : [];
	let mergedConfig = { mcpServers: {} };
	for (const existingMcpConfigPath of existingMcpConfigPaths) {
		const resolvedExistingPath = path.isAbsolute(existingMcpConfigPath) ? existingMcpConfigPath : path.resolve(params.workspaceDir, existingMcpConfigPath);
		mergedConfig = applyMergePatch(mergedConfig, { mcpServers: extractMcpServerMap(await tryReadJson(resolvedExistingPath)) });
	}
	const bundleConfig = loadMergedBundleMcpConfig({
		workspaceDir: params.workspaceDir,
		cfg: params.config,
		toolOverrides: params.toolOverrides
	});
	for (const diagnostic of bundleConfig.diagnostics) params.warn?.(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	mergedConfig = applyMergePatch(mergedConfig, bundleConfig.config);
	const prepareDataDirsByServer = { ...bundleConfig.prepareDataDirsByServer };
	const additionalServerNames = new Set(Object.keys(params.additionalConfig?.mcpServers ?? {}));
	if (params.additionalConfig) {
		mergedConfig = applyMergePatch(mergedConfig, params.additionalConfig);
		for (const serverName of Object.keys(params.additionalConfig.mcpServers)) delete prepareDataDirsByServer[serverName];
	}
	const warnUnavailableOAuthServer = (serverName, error) => params.warn?.(`bundle MCP skipped unavailable OAuth server ${serverName}: ${formatErrorMessage(error)}`);
	const resolvedBearerConfig = await resolveMcpBearerBundleConfig({
		config: mergedConfig,
		cfg: params.config,
		agentDir: params.agentDir,
		env: params.env,
		omitUnavailableOAuthServers: true,
		onServerUnavailable: warnUnavailableOAuthServer
	});
	const preparedDataDirs = prepareOwnedBundleMcpDataDirs({
		config: applyMcpServerOverrides(resolvedBearerConfig.config, params.toolOverrides?.mcpServers),
		prepareDataDirsByServer
	});
	for (const diagnostic of preparedDataDirs.diagnostics) params.warn?.(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
	let effectiveConfig = preparedDataDirs.config;
	let effectiveEnv = resolvedBearerConfig.env;
	let effectiveDenials = params.toolOverrides?.mcpToolsDeny;
	const policyConfig = { mcpServers: Object.fromEntries(Object.entries(effectiveConfig.mcpServers).filter(([serverName]) => !additionalServerNames.has(serverName))) };
	if (params.nativeMcpPolicy && Object.keys(policyConfig.mcpServers).length > 0) {
		const nativePolicyConfig = selectBundleMcpServers(mergedConfig, policyConfig);
		const runtimeConfig = {
			...params.config,
			mcp: {
				...params.config?.mcp,
				servers: nativePolicyConfig.mcpServers
			}
		};
		const acquisition = await acquireSessionMcpRuntime({
			sessionId: params.nativeMcpPolicy.sessionId,
			sessionKey: params.nativeMcpPolicy.sessionKey,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			cfg: runtimeConfig,
			toolOverrides: params.toolOverrides,
			toolDenylist: params.nativeMcpPolicy.capabilityProfile.policy.explicitToolDenylist
		});
		let retainedServerNames;
		try {
			const policy = await prepareNativeMcpPolicy({
				runtime: acquisition.runtime,
				config: params.config,
				workspaceDir: params.workspaceDir,
				capabilityProfile: params.nativeMcpPolicy.capabilityProfile,
				runtimeToolsAllow: params.nativeMcpPolicy.runtimeToolsAllow,
				warn: params.warn ?? (() => {})
			});
			effectiveConfig = { mcpServers: {
				...applyPreparedNativeMcpPolicy(policyConfig, policy).mcpServers,
				...Object.fromEntries(Object.entries(effectiveConfig.mcpServers).filter(([serverName]) => additionalServerNames.has(serverName)))
			} };
			const preservedAdditionalDenials = Object.fromEntries(Object.entries(params.toolOverrides?.mcpToolsDeny ?? {}).filter(([serverName]) => additionalServerNames.has(serverName)));
			const combinedDenials = {
				...preparedNativeMcpDenials(policy),
				...preservedAdditionalDenials
			};
			effectiveDenials = Object.keys(combinedDenials).length > 0 ? combinedDenials : void 0;
			const refreshedBearerConfig = await resolveMcpBearerBundleConfig({
				config: selectBundleMcpServers(mergedConfig, effectiveConfig),
				cfg: params.config,
				agentDir: params.agentDir,
				env: params.env,
				omitUnavailableOAuthServers: true,
				onServerUnavailable: warnUnavailableOAuthServer
			});
			effectiveConfig = selectBundleMcpServers(effectiveConfig, refreshedBearerConfig.config);
			effectiveEnv = refreshedBearerConfig.env;
			retainedServerNames = new Set(Object.keys(effectiveConfig.mcpServers));
		} finally {
			await releaseSessionMcpRuntime(acquisition, retainedServerNames);
		}
	}
	return await prepareModeSpecificBundleMcpConfig({
		mode,
		backend: params.backend,
		mergedConfig: effectiveConfig,
		env: effectiveEnv,
		mcpToolsDeny: effectiveDenials,
		webSearchEnabled: nativeWebSearchEnabled
	});
}
/** Prepares a per-attempt capture token without changing resume compatibility hashes. */
async function prepareCliBundleMcpCaptureAttempt(params) {
	if (!params.captureKey) return { env: params.env };
	if ((params.mode ?? "claude-config-file") === "gemini-system-settings") return await writeGeminiMcpCaptureSettings({
		inheritedEnv: params.env,
		captureKey: params.captureKey
	});
	if ((params.mode ?? "claude-config-file") === "claude-config-file") {
		const mcpConfigPath = findClaudeMcpConfigPaths(params.backend?.args)[0] ?? findClaudeMcpConfigPaths(params.backend?.resumeArgs)[0];
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
//#region src/agents/cli-runner/prompt-context.ts
/** Current-turn facts stay outside native prompts that are retained across CLI turns. */
async function buildCliTurnAppendContext(params) {
	const { resolveSystemPromptUsage } = await import("./helpers-DfhbIpFF.mjs");
	const mediaTaskContext = await buildMediaTaskRuntimeContext({
		capabilityToolNames: params.capabilityToolNames,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		includeEmptySnapshots: true
	});
	const mediaTaskMessage = buildRuntimeContextCustomMessage(mediaTaskContext);
	await prepareActiveNodeContext(params.requesterProfileId);
	return [
		...params.context,
		params.runtimeContextFragments?.length ? labelRuntimeContextText(projectRuntimeContextFragments(params.runtimeContextFragments)) : void 0,
		buildProactiveSubagentOrchestrationSection({
			enabled: params.thinkLevel === "ultra",
			hasSessionsSpawn: params.capabilityToolNames.has("sessions_spawn")
		}).join("\n"),
		mediaTaskMessage ? labelRuntimeContextText(mediaTaskMessage.content) : void 0,
		resolveSystemPromptUsage(params) ? void 0 : buildActiveNodeContextText(params.requesterProfileId)
	].filter((value) => Boolean(value?.trim())).join("\n\n");
}
async function prepareCliTurnPromptContext(params) {
	let systemPrompt = params.systemPrompt;
	let prependContext = "";
	let appendContext = params.deliveryGuidance ?? "";
	try {
		const preparedPrependContext = params.prependContext.filter((value) => Boolean(value?.trim())).join("\n\n");
		const preparedAppendContext = await buildCliTurnAppendContext({
			...params,
			context: [...params.context, params.deliveryGuidance]
		});
		prependContext = preparedPrependContext;
		appendContext = preparedAppendContext;
		const hookSystemPrompt = params.hookResult?.systemPrompt?.trim();
		if (hookSystemPrompt) systemPrompt = hookSystemPrompt;
		systemPrompt = composeSystemPromptWithHookContext({
			baseSystemPrompt: systemPrompt,
			prependSystemContext: params.hookResult?.prependSystemContext,
			appendSystemContext: params.hookResult?.appendSystemContext
		}) ?? systemPrompt;
	} catch (error) {
		cliBackendLog.warn(`cli prompt-build hook preparation failed: ${String(error)}`);
	}
	const logicalPrompt = composeCliPromptContext(params.prompt, {
		prependContext,
		appendContext
	});
	if ((prependContext || appendContext) && params.privateContext) return {
		prompt: params.prompt,
		systemPrompt,
		promptContext: {
			...prependContext ? { prependContext } : {},
			...appendContext ? { appendContext } : {}
		},
		promptForHooks: logicalPrompt
	};
	return {
		prompt: logicalPrompt,
		systemPrompt
	};
}
/** Logical input for raw transports, policy hooks, and bounded diagnostics. */
function composeCliPromptContext(prompt, context) {
	const prepended = context?.prependContext ? `${context.prependContext}\n\n${prompt}` : prompt;
	return context?.appendContext ? `${prepended}\n\n${context.appendContext}` : prepended;
}
async function prepareCliSystemPrompt(params) {
	const { buildCliAgentSystemPrompt } = await import("./helpers-DfhbIpFF.mjs");
	let preparedModelRuntime;
	if (params.config) {
		const { getPreparedModelRuntimeBorrowedSnapshot, getPreparedModelRuntimePluginGeneration } = await import("./prepared-model-runtime-generation-scope-BE7GAnv9.mjs");
		const generation = getPreparedModelRuntimePluginGeneration();
		const borrowed = generation ? getPreparedModelRuntimeBorrowedSnapshot(generation) : void 0;
		if (borrowed?.config === params.config && borrowed.agentId === params.agentId && borrowed.workspaceDir === params.workspaceDir) preparedModelRuntime = borrowed;
		else {
			const { getPreparedModelCatalogOwnerSnapshot } = await import("./prepared-model-catalog-sffagvF9.mjs");
			preparedModelRuntime = getPreparedModelCatalogOwnerSnapshot({
				config: params.config,
				agentId: params.agentId,
				workspaceDir: params.workspaceDir
			});
		}
	}
	await prepareActiveNodeContext(params.requesterProfileId);
	const preparedGitCoauthorPrompt = await resolveSessionGitCoauthorPrompt({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {}
	});
	return buildCliAgentSystemPrompt({
		...params,
		preparedModelRuntime,
		preparedGitCoauthorPrompt
	});
}
function prependCliSessionDriftUserContext(context, reusableCliSession) {
	if (reusableCliSession.mode !== "reuse-with-drift") return context;
	const note = buildCliSessionDriftNote(reusableCliSession.drift.reasons);
	if (!context) return { text: note };
	return {
		...context,
		text: [note, context.text].join("\n\n"),
		...context.resumableText ? { resumableText: [note, context.resumableText].join("\n\n") } : {}
	};
}
//#endregion
export { prepareCliBundleMcpCaptureAttempt as a, CLAUDE_MANAGED_MCP_TIMEOUT_MS as c, prependCliSessionDriftUserContext as i, applyClaudeManagedMcpTimeout as l, prepareCliSystemPrompt as n, prepareCliBundleMcpConfig as o, prepareCliTurnPromptContext as r, resolveCliNativeWebSearchEnabled as s, composeCliPromptContext as t };
