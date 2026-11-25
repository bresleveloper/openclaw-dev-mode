import { n as flattenCodexDynamicToolFunctions, r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { T as resolveCodexAppServerVerifiedLocalHomeDir } from "./config-options-ZyoXdPOW.mjs";
import { A as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-DS0mnvrR.mjs";
import { n as buildCodexAppServerRuntimeFingerprint, t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-C1YmeiUB.mjs";
import { r as isMessageOnlyCodexSourceReply } from "./dynamic-tool-profile-Cl_HKG4m.mjs";
import { K as isCodexAppServerLiveThreadProtected, ot as readCodexWorkspaceSessionMeta, tt as withCodexClientWorkspace } from "./shared-client-DhJ31S_8.mjs";
import { f as unsubscribeCodexThreadBestEffort, n as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS } from "./attempt-client-cleanup-B9YyH0aT.mjs";
import { T as codexDynamicToolsFingerprint, m as attestCodexRestrictedToolSurfaceMcpServersDisabled } from "./thread-requests-BMazAevT.mjs";
import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import path from "node:path";
import { hasNodeErrorCode } from "openclaw/plugin-sdk/path-existence-runtime";
import { resolveRequiredHomeDir, resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import os from "node:os";
import fs from "node:fs/promises";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { buildAgentWorkspaceInstructionSnapshot, buildBootstrapContextForFiles, embeddedAgentLog, prepareAgentWorkspaceContext } from "openclaw/plugin-sdk/agent-harness-runtime";
import { resolveAgentWorkspaceMemoryRouting, shouldIncludeAgentHarnessRuntimeContext } from "openclaw/plugin-sdk/agent-harness-attempt-runtime";
import { resolveBootstrapFilesForPreparation } from "openclaw/plugin-sdk/codex-mcp-projection";
// extensions/codex/src/app-server/attempt-workspace-context.ts
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = /* @__PURE__ */ new Set(["agents.md"]);
const CODEX_MEMORY_CONTEXT_BASENAME = "memory.md";
const CODEX_MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
const CODEX_BOOTSTRAP_CONTEXT_ORDER = /* @__PURE__ */ new Map([
	["soul.md", 10],
	["identity.md", 20],
	["user.md", 30],
	["bootstrap.md", 50],
	["memory.md", 60]
]);
/** A child baseline reads the bounded workspace snapshot without invoking admission hooks. */
async function prepareCodexWorkspaceDeveloperInstructions(params) {
	if (path.resolve(params.workspaceDir) === path.resolve(params.cwd)) return;
	const files = await resolveBootstrapFilesForPreparation(params);
	const contextFiles = buildBootstrapContextForFiles(files, {
		config: params.config,
		agentId: params.agentId
	});
	return buildAgentWorkspaceInstructionSnapshot(contextFiles, params.workspaceDir).instructions;
}
async function buildCodexWorkspaceBootstrapContext(params) {
	const availableToolNames = new Set(flattenCodexDynamicToolFunctions(params.tools).map((tool) => normalizeLowercaseStringOrEmpty(tool.name)));
	const inheritsAgentWorkspace = (params.executionWorkspace ?? params.resolvedWorkspace) !== params.resolvedWorkspace;
	const injectOpenClawContext = shouldIncludeAgentHarnessRuntimeContext(params.params);
	const restrictedProjectDocNeedsOpenClawCarrier = params.params.pluginHarnessToolPolicyRestricted === true && !params.params.disableTools && !isMessageOnlyCodexSourceReply(params.params) && params.params.bootstrapContextMode !== "lightweight";
	const includeAgentWorkspaceInstructions = injectOpenClawContext && !params.ringZeroActive && (inheritsAgentWorkspace || restrictedProjectDocNeedsOpenClawCarrier);
	try {
		const promptWorkspace = inheritsAgentWorkspace ? params.resolvedWorkspace : params.effectiveWorkspace;
		const { memoryToolNames, memoryToolRouted } = resolveAgentWorkspaceMemoryRouting({
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			workspaceDir: promptWorkspace,
			toolNames: availableToolNames
		});
		const prepared = await prepareAgentWorkspaceContext({
			scope: "full",
			workspaceDir: params.resolvedWorkspace,
			config: params.params.config,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			bootstrapUserProfileId: params.params.bootstrapUserProfileId,
			chatType: params.params.chatType,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => embeddedAgentLog.warn(message),
			contextMode: params.params.bootstrapContextMode,
			runKind: params.params.bootstrapContextRunKind,
			memoryToolRouted,
			onMemoryPreparationError: (error) => embeddedAgentLog.warn("failed to prepare codex memory recall instructions", { error }),
			memoryTools: injectOpenClawContext ? {
				toolNames: [...availableToolNames],
				citationsMode: params.params.config?.memory?.citations,
				sandboxed: params.sandboxed
			} : void 0,
			projectPath: (filePath) => remapCodexContextFilePath({
				filePath,
				sourceWorkspaceDir: params.resolvedWorkspace,
				targetWorkspaceDir: promptWorkspace
			}),
			nativeProjectDocBasenames: CODEX_NATIVE_PROJECT_DOC_BASENAMES,
			contextFileOrder: CODEX_BOOTSTRAP_CONTEXT_ORDER,
			promptMemoryWorkspaceDir: params.effectiveWorkspace
		});
		const { bootstrapFiles, contextFiles, promptContextFiles, memoryReferenceFiles, memoryToolRoutedBootstrapFiles, instructionSnapshot } = prepared;
		return {
			bootstrapFiles,
			contextFiles,
			promptContextFiles,
			threadDeveloperInstructionFiles: includeAgentWorkspaceInstructions ? instructionSnapshot.files : [],
			personaFiles: injectOpenClawContext ? prepared.personaFiles : [],
			memoryReferenceFiles,
			memoryToolRoutedBootstrapFiles,
			memoryToolNames,
			memoryToolRouted,
			promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
			threadDeveloperInstructions: includeAgentWorkspaceInstructions ? instructionSnapshot.instructions || params.agentWorkspaceDeveloperInstructions || "" : void 0,
			personaInstructions: injectOpenClawContext ? prepared.personaInstructions : void 0,
			sharedPersonaInstructions: injectOpenClawContext ? prepared.sharedPersonaInstructions : void 0,
			memoryInstructions: injectOpenClawContext ? renderCodexWorkspaceMemoryInstructions({
				files: memoryReferenceFiles,
				toolNames: memoryToolNames,
				memoryRecallInstructions: prepared.memoryRecallInstructions
			}) : void 0
		};
	} catch (error) {
		embeddedAgentLog.warn("failed to load codex workspace bootstrap instructions", { error });
		return {
			bootstrapFiles: [],
			contextFiles: [],
			threadDeveloperInstructions: includeAgentWorkspaceInstructions ? params.agentWorkspaceDeveloperInstructions : void 0
		};
	}
}
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
	if (contextFiles.length === 0) return;
	return [
		"OpenClaw loaded these user-editable workspace files for the current turn. Codex loads project-local AGENTS.md natively. When execution uses another folder, OpenClaw supplies the agent workspace AGENTS.md as thread-level developer instructions. SOUL.md, IDENTITY.md, and USER.md are prepared separately from user input and are not repeated here.",
		"",
		"# Project Context",
		"",
		"The following project context files have been loaded:",
		"",
		...contextFiles.flatMap((file) => [
			`## ${file.path}`,
			"",
			file.content,
			""
		])
	].join("\n").trim();
}
function renderCodexWorkspaceMemoryInstructions(params) {
	const sections = [params.memoryRecallInstructions ? [params.memoryRecallInstructions, renderCodexMemoryToolSearchBridge(params.toolNames)].filter(isNonEmptyString).join("\n").trim() : void 0];
	if (params.files.length > 0) {
		const toolNames = params.toolNames.length ? params.toolNames : Array.from(CODEX_MEMORY_TOOL_NAMES);
		sections.push([
			"## OpenClaw Workspace Memory",
			"",
			`MEMORY.md exists in the active agent workspace as a memory file, not an instruction file. OpenClaw does not paste its contents into native Codex turns; use ${toolNames.join(" or ")} when durable memory is relevant and the tools are available.`,
			"",
			...params.files.map((file) => `- ${file.path}`)
		].join("\n").trim());
	}
	return sections.filter(isNonEmptyString).join("\n\n") || void 0;
}
function renderCodexMemoryToolSearchBridge(toolNames) {
	const memoryToolNames = toolNames.map(normalizeLowercaseStringOrEmpty).filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name)).toSorted();
	if (memoryToolNames.length === 0) return;
	return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/**
* Remaps bootstrap file paths from the resolved workspace to the effective Codex
* workspace while preserving platform path separators.
*/
function remapCodexContextFilePath(params) {
	const relativePath = path.relative(params.sourceWorkspaceDir, params.filePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || params.sourceWorkspaceDir === params.targetWorkspaceDir) return params.filePath;
	const targetUsesPosixSeparators = params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
	const normalizedRelativePath = targetUsesPosixSeparators ? relativePath.replaceAll("\\", "/") : relativePath.replaceAll("/", "\\");
	return targetUsesPosixSeparators ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath) : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath);
}
function normalizeCodexContextFilePath(filePath) {
	return filePath.trim().replaceAll("\\", "/").toLowerCase();
}
function getCodexContextFileDisplayBasename(filePath) {
	return filePath.trim().replaceAll("\\", "/").split("/").pop()?.trim() ?? "";
}
function getCodexContextFileBasename(filePath) {
	return normalizeCodexContextFilePath(filePath).split("/").pop() ?? "";
}
function isNonEmptyString(value) {
	return Boolean(value);
}
// extensions/codex/src/app-server/native-tool-catalog.ts
function hasCodexNativeToolCatalog(binding) {
	return binding?.connectionScope === "supervision" && !binding.pendingSupervisionBranch;
}
function hasProtectedManagedCatalog(binding, client) {
	return binding.connectionScope !== "supervision" && !binding.pendingSupervisionBranch && binding.clientId === client.getInstanceId() && isCodexAppServerLiveThreadProtected(client, binding.threadId);
}
/** Native declarations outlive a caller's executors while its children still own the parent. */
async function loadCodexAttemptNativeToolCatalog(params) {
	const { binding } = params;
	if (!binding) return;
	params.signal.throwIfAborted();
	params.assertCurrent();
	if (hasCodexNativeToolCatalog(binding)) {
		const client = await params.acquireClient();
		try {
			return await loadCodexNativeToolCatalog({
				...params,
				binding,
				client
			});
		} finally {
			await params.releaseClient(client);
		}
	}
	if (binding.restrictedThreadConfigFingerprint || params.ephemeral || params.appServer.start.transport !== "stdio" && params.appServer.start.transport !== "unix" || params.appServer.remoteWorkspaceRoot) return;
	const retained = await retainSharedCodexAppServerClientByInstanceId(binding.clientId, {
		signal: params.signal,
		waitForExit: false
	});
	try {
		params.signal.throwIfAborted();
		params.assertCurrent();
		if (!retained || !hasProtectedManagedCatalog(binding, retained.client)) return;
		return await loadCodexNativeToolCatalog({
			...params,
			binding,
			client: retained.client
		});
	} finally {
		await retained?.release();
	}
}
/** Pinned serde omits empty catalogs and false deferLoading; declarations remain native-owned. */
function parseCodexNativeToolCatalog(metadata, threadId, fingerprint) {
	const fail = () => /* @__PURE__ */ new Error("The saved Codex native tool catalog is missing, corrupt, or changed; the thread is preserved. Reconnect and inspect its native metadata before retrying.");
	if (!isJsonObject(metadata) || metadata.id !== threadId) throw fail();
	const catalog = metadata.dynamic_tools ?? [];
	if (!Array.isArray(catalog) || Buffer.byteLength(JSON.stringify(catalog)) > 1048576) throw fail();
	const names = /* @__PURE__ */ new Set();
	const namespaces = /* @__PURE__ */ new Set();
	const validName = (name) => typeof name === "string" && /^[a-zA-Z0-9_-]{1,128}$/u.test(name);
	const readFunction = (value) => {
		if (!isJsonObject(value) || value.type !== "function" || !validName(value.name) || typeof value.description !== "string" || !isJsonObject(value.inputSchema) || value.deferLoading !== void 0 && typeof value.deferLoading !== "boolean" || Object.keys(value).some((key) => ![
			"type",
			"name",
			"description",
			"inputSchema",
			"deferLoading"
		].includes(key)) || names.has(value.name) || names.size >= 2e3) throw fail();
		names.add(value.name);
		return {
			type: "function",
			name: value.name,
			description: value.description,
			inputSchema: value.inputSchema,
			...value.deferLoading === true ? { deferLoading: true } : {}
		};
	};
	const tools = catalog.map((value) => {
		if (!isJsonObject(value) || value.type !== "namespace") return readFunction(value);
		if (!validName(value.name) || namespaces.has(value.name) || typeof value.description !== "string" || !Array.isArray(value.tools) || !value.tools.length || Object.keys(value).some((key) => ![
			"type",
			"name",
			"description",
			"tools"
		].includes(key))) throw fail();
		namespaces.add(value.name);
		return {
			type: "namespace",
			name: value.name,
			description: value.description,
			tools: value.tools.map(readFunction)
		};
	});
	if (fingerprint !== void 0 && codexDynamicToolsFingerprint(tools) !== fingerprint) throw fail();
	return tools;
}
/** Existing supervised bindings identify data, never authorize an executor or a new adoption. */
async function loadCodexNativeToolCatalog(params) {
	const { binding, client, appServer, agentDir, assertCurrent } = params;
	assertCurrent();
	const runtimeIdentity = client.getRuntimeIdentity();
	const home = resolveCodexAppServerVerifiedLocalHomeDir(appServer, agentDir, runtimeIdentity?.codexHome);
	const runtimeFingerprint = binding.connectionScope === "supervision" ? buildCodexAppServerConnectionFingerprint(appServer, agentDir) : buildCodexAppServerRuntimeFingerprint({
		appServer,
		appServerVersion: client.getServerVersion(),
		runtimeIdentity
	});
	if (!hasCodexNativeToolCatalog(binding) && !hasProtectedManagedCatalog(binding, client) || !binding.dynamicToolsFingerprint || !home || binding.appServerRuntimeFingerprint !== runtimeFingerprint) throw new Error("Saved Codex declarations require the original verified local binding and selected native connection; the thread is preserved.");
	const metadata = await withCodexClientWorkspace(client, (state, maxCachedSessions) => readCodexWorkspaceSessionMeta(client, state, path.join(home, "sessions"), binding.rolloutPath, binding.threadId, maxCachedSessions));
	const consume = () => {
		assertCurrent();
		return parseCodexNativeToolCatalog(metadata, binding.threadId, binding.dynamicToolsFingerprint);
	};
	return params.authority ? await params.authority.withCurrent(consume) : consume();
}
// extensions/codex/src/app-server/plugin-thread-attestation.ts
/**
* Checks app availability and enforces restricted MCP surfaces before a turn.
*/
/** Every admission path checks the same surface; its lifecycle owner keeps the claim fenced. */
async function attestCodexThreadToolSurface(params) {
	if (params.appIds.length === 0 && !params.restrictedToolSurface) {
		params.signal?.throwIfAborted();
		params.assertCurrent();
		return;
	}
	if (params.withCurrent) await params.withCurrent(params.assertCurrent);
	else params.assertCurrent();
	if (params.appIds.length > 0) {
		await params.lifecycleTiming.measure("plugin-app-attestation", () => checkCodexThreadAppAvailability(params));
		if (params.withCurrent) await params.withCurrent(params.assertCurrent);
		else params.assertCurrent();
	}
	if (params.restrictedToolSurface) {
		await params.lifecycleTiming.measure("restricted-tool-surface-mcp-attestation", () => attestCodexRestrictedToolSurfaceMcpServersDisabled(params.client, params.threadId, params.threadConfig, params.signal, params.appIds.length > 0 ? ["codex_apps"] : []));
		if (params.withCurrent) await params.withCurrent(params.assertCurrent);
		else params.assertCurrent();
	}
}
var CodexPluginThreadAppAttestationError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexPluginThreadAppAttestationError";
	}
};
/** Reads the existing runtime snapshot with the started thread's effective app policy. */
async function checkCodexThreadAppAvailability(params) {
	const appIds = Array.from(new Set(params.appIds.filter(Boolean))).toSorted();
	if (appIds.length === 0) return;
	let response;
	try {
		response = await params.client.request("app/installed", {
			threadId: params.threadId,
			forceRefresh: false
		}, {
			signal: params.signal,
			withCurrent: params.withCurrent
		});
	} catch (error) {
		params.signal?.throwIfAborted();
		throw new CodexPluginThreadAppAttestationError(`Codex could not confirm admitted apps for thread ${params.threadId}`, { cause: error });
	}
	params.signal?.throwIfAborted();
	const installedById = new Map(response.apps.map((app) => [app.id, app]));
	const failures = appIds.flatMap((appId) => {
		const app = installedById.get(appId);
		if (!app) return [`${appId}:missing`];
		if (!app.enabled) return [`${appId}:disabled`];
		return app.callable ? [] : [`${appId}:not-callable`];
	});
	if (failures.length > 0) embeddedAgentLog.warn("codex apps unavailable; continuing with remaining tools", {
		threadId: params.threadId,
		failures
	});
}
/** Deletes a persistent pre-turn thread; ephemeral threads can only be unsubscribed. */
async function discardUnattestedCodexPluginThread(params) {
	const { ephemeral } = params;
	if (!ephemeral) try {
		await params.client.request("thread/delete", { threadId: params.threadId }, { timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS });
		return true;
	} catch (error) {
		embeddedAgentLog.debug("codex plugin app attestation thread deletion failed", {
			threadId: params.threadId,
			error
		});
	}
	const unsubscribed = await unsubscribeCodexThreadBestEffort(params.client, {
		threadId: params.threadId,
		timeoutMs: CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS
	});
	return ephemeral && unsubscribed;
}
// extensions/codex/src/app-server/native-skill-isolation.ts
const MAX_PERSONAL_SKILL_DIRECTORIES = 2e3;
const MAX_PERSONAL_SKILL_DEPTH = 6;
const MAX_PERSONAL_SKILL_ENTRIES = 1e4;
const CODEX_VISUALIZE_PLUGIN_ID = "visualize@openai-bundled";
const CODEX_VISUALIZE_LEGACY_PATH = "/plugins/cache/openai-bundled/visualize/";
const DEFAULT_STATE_SKILL_DISCOVERY_UNAVAILABLE = Symbol("default-state-skill-discovery-unavailable");
const nativeSkillIsolationByClient = /* @__PURE__ */ new WeakMap();
function isUnsupportedCodexVisualizeSkill(skill) {
	if (skill.pluginId) return skill.pluginId === CODEX_VISUALIZE_PLUGIN_ID;
	return (skill.name === "visualize" || skill.name === "visualize:visualize") && skill.path.replaceAll("\\", "/").includes(CODEX_VISUALIZE_LEGACY_PATH);
}
async function canonicalizeExistingPath(candidate) {
	try {
		return await fs.realpath(candidate);
	} catch {
		return path.resolve(candidate);
	}
}
async function usesDefaultStateDir() {
	if (!process.env.OPENCLAW_STATE_DIR?.trim()) return true;
	const home = resolveRequiredHomeDir();
	const [stateDir, defaultStateDir] = await Promise.all([canonicalizeExistingPath(resolveStateDir()), canonicalizeExistingPath(path.join(home, ".openclaw"))]);
	return stateDir === defaultStateDir;
}
async function collectPersonalSkillRealPaths(homes, codexHome) {
	const realStateDir = await canonicalizeExistingPath(resolveStateDir());
	const roots = [];
	for (const home of homes) {
		for (const dir of [".agents", ".claude"]) roots.push({
			dir: path.join(home, dir, "skills"),
			onlyEscapedStateTargets: false
		});
		const defaultCodexHome = path.join(home, ".codex");
		const realDefaultCodexHome = await canonicalizeExistingPath(defaultCodexHome);
		roots.push({
			dir: path.join(defaultCodexHome, "skills"),
			onlyEscapedStateTargets: isPathInside(realStateDir, realDefaultCodexHome)
		});
	}
	const configuredCodexHome = codexHome?.trim() || process.env.CODEX_HOME?.trim();
	if (configuredCodexHome) {
		const realCodexHome = await canonicalizeExistingPath(configuredCodexHome);
		const stateOwned = isPathInside(realStateDir, realCodexHome);
		roots.push({
			dir: path.join(configuredCodexHome, "skills"),
			onlyEscapedStateTargets: stateOwned
		});
	}
	const skillPaths = /* @__PURE__ */ new Set();
	let complete = true;
	const seenDirectories = /* @__PURE__ */ new Set();
	const queue = roots.map((root) => ({
		dir: root.dir,
		onlyEscapedStateTargets: root.onlyEscapedStateTargets,
		depth: 0
	}));
	let entryCount = 0;
	const recordScanError = (error) => {
		if (!hasNodeErrorCode(error, "ENOENT")) complete = false;
	};
	const recordSkillFile = async (filePath, onlyEscapedStateTargets) => {
		try {
			const skillRealPath = await fs.realpath(filePath);
			if (!onlyEscapedStateTargets || !isPathInside(realStateDir, skillRealPath)) skillPaths.add(skillRealPath);
		} catch (error) {
			recordScanError(error);
		}
	};
	for (const current of queue) {
		let realDir;
		try {
			realDir = await fs.realpath(current.dir);
		} catch (error) {
			recordScanError(error);
			continue;
		}
		if (seenDirectories.has(realDir)) continue;
		seenDirectories.add(realDir);
		if (seenDirectories.size > MAX_PERSONAL_SKILL_DIRECTORIES) {
			complete = false;
			break;
		}
		let directory;
		try {
			directory = await fs.opendir(current.dir);
		} catch (error) {
			recordScanError(error);
			continue;
		}
		try {
			for await (const entry of directory) {
				entryCount += 1;
				if (entryCount > MAX_PERSONAL_SKILL_ENTRIES) {
					complete = false;
					queue.length = 0;
					break;
				}
				if (entry.name.startsWith(".")) continue;
				const entryPath = path.join(current.dir, entry.name);
				let isFile = entry.isFile();
				let isDirectory = entry.isDirectory();
				if (entry.isSymbolicLink()) try {
					const stat = await fs.stat(entryPath);
					isFile = stat.isFile();
					isDirectory = stat.isDirectory();
				} catch (error) {
					recordScanError(error);
					continue;
				}
				if (entry.name === "SKILL.md" && isFile) {
					await recordSkillFile(entryPath, current.onlyEscapedStateTargets);
					continue;
				}
				if (isDirectory) {
					if (current.depth >= MAX_PERSONAL_SKILL_DEPTH) complete = false;
					else queue.push({
						dir: entryPath,
						depth: current.depth + 1,
						onlyEscapedStateTargets: current.onlyEscapedStateTargets
					});
				}
			}
		} catch (error) {
			recordScanError(error);
		}
	}
	return {
		complete,
		skillPaths
	};
}
/** Resolves native skill rules required by the OpenClaw thread boundary. */
async function resolveCodexNativeSkillIsolation(params) {
	params.signal?.throwIfAborted();
	const key = JSON.stringify([
		path.resolve(resolveStateDir()),
		path.resolve(params.cwd),
		params.codexHome?.trim() || process.env.CODEX_HOME?.trim() || "",
		params.home?.trim() || process.env.HOME?.trim() || "",
		params.userProfile?.trim() || process.env.USERPROFILE?.trim() || ""
	]);
	let cache = nativeSkillIsolationByClient.get(params.client);
	if (!cache) {
		cache = { revision: 0 };
		nativeSkillIsolationByClient.set(params.client, cache);
		const clientCache = cache;
		params.client.addNotificationHandler((notification) => {
			if (notification.method === "skills/changed") {
				clientCache.revision += 1;
				clientCache.snapshot = void 0;
			}
		});
	}
	for (;;) {
		params.signal?.throwIfAborted();
		let snapshot = cache.snapshot;
		if (snapshot?.key !== key || !snapshot.settled && snapshot.signal !== params.signal) {
			snapshot = {
				key,
				revision: cache.revision,
				result: resolveUncachedCodexNativeSkillIsolation(params),
				settled: false,
				signal: params.signal
			};
			cache.snapshot = snapshot;
		}
		try {
			const isolation = await snapshot.result;
			snapshot.settled = true;
			params.signal?.throwIfAborted();
			if (snapshot.revision === cache.revision) {
				if (isolation === DEFAULT_STATE_SKILL_DISCOVERY_UNAVAILABLE) {
					cache.snapshot = void 0;
					return;
				}
				return isolation;
			}
		} catch (error) {
			if (cache.snapshot === snapshot) cache.snapshot = void 0;
			throw error;
		}
	}
}
async function resolveUncachedCodexNativeSkillIsolation(params) {
	const defaultStateDir = await usesDefaultStateDir();
	let response;
	let skillPaths;
	try {
		response = await params.client.request("skills/list", {
			cwds: [params.cwd],
			forceReload: true
		}, { signal: params.signal });
		if (response.data.some((entry) => entry.errors.length > 0)) throw new Error("Codex native skill discovery returned errors");
		skillPaths = /* @__PURE__ */ new Set();
		for (const entry of response.data) for (const skill of entry.skills) if (isUnsupportedCodexVisualizeSkill(skill)) skillPaths.add(skill.path);
	} catch (error) {
		params.signal?.throwIfAborted();
		if (!defaultStateDir) throw error;
		return DEFAULT_STATE_SKILL_DISCOVERY_UNAVAILABLE;
	}
	if (defaultStateDir && skillPaths.size === 0) return;
	if (!defaultStateDir) {
		const homes = [params.home?.trim() || process.env.HOME?.trim() || process.env.USERPROFILE?.trim() || os.homedir()];
		if (process.platform === "win32") homes.push(params.userProfile?.trim() || os.homedir());
		const personalSkills = await collectPersonalSkillRealPaths([...new Set(homes.map((home) => path.resolve(home)))], params.codexHome);
		for (const skillPath of personalSkills.skillPaths) skillPaths.add(skillPath);
		if (!personalSkills.complete) {
			for (const entry of response.data) for (const skill of entry.skills) if (skill.scope === "user") skillPaths.add(skill.path);
		}
	}
	return {
		disabledUserSkillPaths: [...skillPaths].toSorted((left, right) => left.localeCompare(right)),
		suppressNativeSkillInstructions: !defaultStateDir
	};
}
/** Applies path-exact rules and non-default-state catalog isolation after caller config. */
function applyCodexNativeSkillIsolation(config, isolation) {
	if (!isolation) return config;
	const existingRules = config?.["skills.config"];
	if (existingRules !== void 0 && !Array.isArray(existingRules)) throw new Error("Codex thread skills.config must be an array");
	const disabledRules = isolation.disabledUserSkillPaths.map((skillPath) => ({
		path: skillPath,
		enabled: false
	}));
	return {
		...config,
		...isolation.suppressNativeSkillInstructions ? { "skills.include_instructions": false } : {},
		"skills.config": [...existingRules ?? [], ...disabledRules]
	};
}
export { prepareCodexWorkspaceDeveloperInstructions as _, discardUnattestedCodexPluginThread as a, loadCodexNativeToolCatalog as c, CODEX_NATIVE_PROJECT_DOC_BASENAMES as d, buildCodexWorkspaceBootstrapContext as f, normalizeCodexContextFilePath as g, isNonEmptyString as h, checkCodexThreadAppAvailability as i, parseCodexNativeToolCatalog as l, getCodexContextFileDisplayBasename as m, resolveCodexNativeSkillIsolation as n, hasCodexNativeToolCatalog as o, getCodexContextFileBasename as p, attestCodexThreadToolSurface as r, loadCodexAttemptNativeToolCatalog as s, applyCodexNativeSkillIsolation as t, CODEX_MEMORY_CONTEXT_BASENAME as u };
