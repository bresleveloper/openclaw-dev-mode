import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { n as resolveCodexAppServerLocalHomeDir } from "./auth-start-options-P3n7Bssz.mjs";
import { T as retainSharedCodexAppServerClientByInstanceId } from "./auth-cache-key-aTVcxfbh.mjs";
import { n as buildCodexAppServerRuntimeFingerprint, t as buildCodexAppServerConnectionFingerprint } from "./plugin-app-cache-key-CKBEird9.mjs";
import { B as readCodexClientSessionMeta, I as isCodexAppServerLiveThreadProtected } from "./shared-client-BEHXwqz5.mjs";
import { f as unsubscribeCodexThreadBestEffort, n as CODEX_APP_SERVER_UNSUBSCRIBE_TIMEOUT_MS } from "./attempt-client-cleanup-CCBoNjA1.mjs";
import { S as codexDynamicToolsFingerprint, p as attestCodexRestrictedToolSurfaceMcpServersDisabled } from "./thread-requests-AxL6-JUD.mjs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { isPathInside } from "openclaw/plugin-sdk/file-access-runtime";
import { resolveRequiredHomeDir, resolveStateDir } from "openclaw/plugin-sdk/state-paths";
import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/native-tool-catalog.ts
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
	if (binding.nativeToolPolicyRestricted === true || binding.restrictedThreadConfigFingerprint !== void 0 || params.ephemeral || params.appServer.start.transport !== "stdio" && params.appServer.start.transport !== "unix" || params.appServer.remoteWorkspaceRoot) return;
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
			inputSchema: structuredClone(value.inputSchema),
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
	const home = resolveCodexAppServerLocalHomeDir(appServer.start, agentDir);
	const runtimeIdentity = client.getRuntimeIdentity();
	const actualHome = runtimeIdentity?.codexHome;
	const runtimeFingerprint = binding.connectionScope === "supervision" ? buildCodexAppServerConnectionFingerprint(appServer, agentDir) : buildCodexAppServerRuntimeFingerprint({
		appServer,
		appServerVersion: client.getServerVersion(),
		runtimeIdentity
	});
	if (!hasCodexNativeToolCatalog(binding) && !hasProtectedManagedCatalog(binding, client) || !binding.dynamicToolsFingerprint || appServer.start.transport !== "stdio" && appServer.start.transport !== "unix" || appServer.remoteWorkspaceRoot || !actualHome || path.resolve(actualHome) !== path.resolve(home) || binding.appServerRuntimeFingerprint !== runtimeFingerprint) throw new Error("Saved Codex declarations require the original verified local binding and selected native connection; the thread is preserved.");
	const metadata = await readCodexClientSessionMeta(client, path.join(home, "sessions"), binding.rolloutPath, binding.threadId);
	const consume = () => {
		assertCurrent();
		return parseCodexNativeToolCatalog(metadata, binding.threadId, binding.dynamicToolsFingerprint);
	};
	return params.authority ? await params.authority.withCurrent(consume) : consume();
}
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-attestation.ts
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
//#endregion
//#region extensions/codex/src/app-server/native-skill-isolation.ts
const MAX_PERSONAL_SKILL_DIRECTORIES = 2e3;
const MAX_PERSONAL_SKILL_DEPTH = 6;
const MAX_PERSONAL_SKILL_ENTRIES = 1e4;
const CODEX_VISUALIZE_PLUGIN_ID = "visualize@openai-bundled";
const CODEX_VISUALIZE_LEGACY_PATH = "/plugins/cache/openai-bundled/visualize/";
const DEFAULT_STATE_SKILL_DISCOVERY_UNAVAILABLE = Symbol("default-state-skill-discovery-unavailable");
const nativeSkillIsolationByClient = /* @__PURE__ */ new WeakMap();
function isMissingPathError(error) {
	return error.code === "ENOENT";
}
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
		if (!isMissingPathError(error)) complete = false;
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
//#endregion
export { discardUnattestedCodexPluginThread as a, loadCodexNativeToolCatalog as c, checkCodexThreadAppAvailability as i, parseCodexNativeToolCatalog as l, resolveCodexNativeSkillIsolation as n, hasCodexNativeToolCatalog as o, attestCodexThreadToolSurface as r, loadCodexAttemptNativeToolCatalog as s, applyCodexNativeSkillIsolation as t };
