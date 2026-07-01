import { s as resolveDefaultAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-CNlVI3wV.js";
import { o as withFileLock } from "./file-lock-BOaqUSu6.js";
import { n as ensureAuthProfileStore } from "./store-SfOB_T2S.js";
import { t as log } from "./logger-DibNup0x.js";
import "./agent-runtime-BmugPmWq.js";
import "./agent-harness-runtime-xVYcW9Zp.js";
import { l as normalizeCodexServiceTier } from "./config-BtjLOBqH.js";
import fs from "node:fs/promises";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/codex/src/app-server/session-binding.ts
/**
* Persists and normalizes the Codex app-server thread binding associated with
* an OpenClaw session file.
*/
const CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER = "openai";
const PUBLIC_OPENAI_MODEL_PROVIDER = "openai";
const CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS = 6e4;
const CODEX_APP_SERVER_BINDING_LOCK_RETRY_INTERVAL_MS = 1e3;
const CODEX_APP_SERVER_BINDING_LOCK_OPTIONS = {
	retries: {
		retries: Math.ceil(75e3 / CODEX_APP_SERVER_BINDING_LOCK_RETRY_INTERVAL_MS),
		factor: 1,
		minTimeout: CODEX_APP_SERVER_BINDING_LOCK_RETRY_INTERVAL_MS,
		maxTimeout: CODEX_APP_SERVER_BINDING_LOCK_RETRY_INTERVAL_MS
	},
	stale: CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS * 2
};
const bindingMutationQueues = /* @__PURE__ */ new Map();
const bindingMutationContext = new AsyncLocalStorage();
/** Returns the JSON sidecar path for the Codex app-server binding beside a session file. */
function resolveCodexAppServerBindingPath(sessionFile) {
	return `${sessionFile}.codex-app-server.json`;
}
/** Serializes mutation of the Codex app-server binding sidecar for a session file. */
async function withCodexAppServerBindingLock(sessionFile, run) {
	const bindingPath = resolveCodexAppServerBindingPath(sessionFile);
	const ownedBindings = bindingMutationContext.getStore();
	if (ownedBindings?.has(bindingPath)) return await withFileLock(bindingPath, CODEX_APP_SERVER_BINDING_LOCK_OPTIONS, run);
	const previous = bindingMutationQueues.get(bindingPath) ?? Promise.resolve();
	let releaseCurrent;
	const current = new Promise((resolve) => {
		releaseCurrent = resolve;
	});
	const queued = previous.then(() => current, () => current);
	bindingMutationQueues.set(bindingPath, queued);
	await previous.catch(() => void 0);
	const nestedOwnedBindings = new Set(ownedBindings);
	nestedOwnedBindings.add(bindingPath);
	try {
		return await bindingMutationContext.run(nestedOwnedBindings, () => withFileLock(bindingPath, CODEX_APP_SERVER_BINDING_LOCK_OPTIONS, run));
	} finally {
		releaseCurrent();
		if (bindingMutationQueues.get(bindingPath) === queued) bindingMutationQueues.delete(bindingPath);
	}
}
/** Reads and normalizes a Codex app-server binding sidecar, returning undefined on stale data. */
async function readCodexAppServerBinding(sessionFile, lookup = {}) {
	const path = resolveCodexAppServerBindingPath(sessionFile);
	let raw;
	try {
		raw = await fs.readFile(path, "utf8");
	} catch (error) {
		if (isNotFound(error)) return;
		log.warn("failed to read codex app-server binding", {
			path,
			error
		});
		return;
	}
	try {
		const parsed = JSON.parse(raw);
		const schemaVersion = parsed.schemaVersion === 1 || parsed.schemaVersion === 2 ? parsed.schemaVersion : void 0;
		if (schemaVersion === void 0 || typeof parsed.threadId !== "string") return;
		const authProfileId = typeof parsed.authProfileId === "string" ? parsed.authProfileId : void 0;
		return {
			schemaVersion: 2,
			threadId: parsed.threadId,
			sessionFile,
			cwd: typeof parsed.cwd === "string" ? parsed.cwd : "",
			authProfileId,
			model: typeof parsed.model === "string" ? parsed.model : void 0,
			modelProvider: normalizeCodexAppServerBindingModelProvider({
				...lookup,
				authProfileId,
				modelProvider: typeof parsed.modelProvider === "string" ? parsed.modelProvider : void 0
			}),
			approvalPolicy: readApprovalPolicy(parsed.approvalPolicy),
			sandbox: readSandboxMode(parsed.sandbox),
			serviceTier: readServiceTier(parsed.serviceTier),
			networkProxyProfileName: typeof parsed.networkProxyProfileName === "string" ? parsed.networkProxyProfileName : void 0,
			networkProxyConfigFingerprint: typeof parsed.networkProxyConfigFingerprint === "string" ? parsed.networkProxyConfigFingerprint : void 0,
			dynamicToolsFingerprint: typeof parsed.dynamicToolsFingerprint === "string" ? parsed.dynamicToolsFingerprint : void 0,
			dynamicToolsContainDeferred: typeof parsed.dynamicToolsContainDeferred === "boolean" ? parsed.dynamicToolsContainDeferred : void 0,
			webSearchThreadConfigFingerprint: typeof parsed.webSearchThreadConfigFingerprint === "string" ? parsed.webSearchThreadConfigFingerprint : void 0,
			userMcpServersFingerprint: typeof parsed.userMcpServersFingerprint === "string" ? parsed.userMcpServersFingerprint : void 0,
			mcpServersFingerprint: typeof parsed.mcpServersFingerprint === "string" ? parsed.mcpServersFingerprint : void 0,
			nativeHookRelayGeneration: typeof parsed.nativeHookRelayGeneration === "string" && parsed.nativeHookRelayGeneration.trim() ? parsed.nativeHookRelayGeneration : void 0,
			appServerRuntimeFingerprint: typeof parsed.appServerRuntimeFingerprint === "string" && parsed.appServerRuntimeFingerprint.trim() ? parsed.appServerRuntimeFingerprint : void 0,
			pluginAppsFingerprint: typeof parsed.pluginAppsFingerprint === "string" ? parsed.pluginAppsFingerprint : void 0,
			pluginAppsInputFingerprint: typeof parsed.pluginAppsInputFingerprint === "string" ? parsed.pluginAppsInputFingerprint : void 0,
			pluginAppPolicyContext: readPluginAppPolicyContext(parsed.pluginAppPolicyContext, schemaVersion),
			contextEngine: readContextEngineBinding(parsed.contextEngine),
			environmentSelectionFingerprint: typeof parsed.environmentSelectionFingerprint === "string" ? parsed.environmentSelectionFingerprint : void 0,
			createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : (/* @__PURE__ */ new Date()).toISOString(),
			updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : (/* @__PURE__ */ new Date()).toISOString()
		};
	} catch (error) {
		log.warn("failed to parse codex app-server binding", {
			path,
			error
		});
		return;
	}
}
/** Writes the Codex app-server binding sidecar with normalized provider/auth metadata. */
async function writeCodexAppServerBinding(sessionFile, binding, lookup = {}) {
	await withCodexAppServerBindingLock(sessionFile, async () => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const payload = {
			schemaVersion: 2,
			sessionFile,
			threadId: binding.threadId,
			cwd: binding.cwd,
			authProfileId: binding.authProfileId,
			model: binding.model,
			modelProvider: normalizeCodexAppServerBindingModelProvider({
				...lookup,
				authProfileId: binding.authProfileId,
				modelProvider: binding.modelProvider
			}),
			approvalPolicy: binding.approvalPolicy,
			sandbox: binding.sandbox,
			serviceTier: binding.serviceTier,
			networkProxyProfileName: binding.networkProxyProfileName,
			networkProxyConfigFingerprint: binding.networkProxyConfigFingerprint,
			dynamicToolsFingerprint: binding.dynamicToolsFingerprint,
			dynamicToolsContainDeferred: binding.dynamicToolsContainDeferred,
			webSearchThreadConfigFingerprint: binding.webSearchThreadConfigFingerprint,
			userMcpServersFingerprint: binding.userMcpServersFingerprint,
			mcpServersFingerprint: binding.mcpServersFingerprint,
			nativeHookRelayGeneration: binding.nativeHookRelayGeneration,
			appServerRuntimeFingerprint: binding.appServerRuntimeFingerprint,
			pluginAppsFingerprint: binding.pluginAppsFingerprint,
			pluginAppsInputFingerprint: binding.pluginAppsInputFingerprint,
			pluginAppPolicyContext: binding.pluginAppPolicyContext,
			contextEngine: binding.contextEngine,
			environmentSelectionFingerprint: binding.environmentSelectionFingerprint,
			createdAt: binding.createdAt ?? now,
			updatedAt: now
		};
		await fs.writeFile(resolveCodexAppServerBindingPath(sessionFile), `${JSON.stringify(payload, null, 2)}\n`);
	});
}
function readContextEngineBinding(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (record.schemaVersion !== 1 || typeof record.engineId !== "string" || typeof record.policyFingerprint !== "string") return;
	return {
		schemaVersion: 1,
		engineId: record.engineId,
		policyFingerprint: record.policyFingerprint,
		projection: readContextEngineProjectionBinding(record.projection)
	};
}
function readContextEngineProjectionBinding(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (record.schemaVersion !== 1 || record.mode !== "thread_bootstrap" || typeof record.epoch !== "string" || !record.epoch.trim()) return;
	return {
		schemaVersion: 1,
		mode: "thread_bootstrap",
		epoch: record.epoch,
		fingerprint: typeof record.fingerprint === "string" ? record.fingerprint : void 0
	};
}
function readPluginAppPolicyContext(value, bindingSchemaVersion) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	if (typeof record.fingerprint !== "string") return;
	const apps = record.apps;
	if (!apps || typeof apps !== "object" || Array.isArray(apps)) return;
	const parsedApps = {};
	for (const [appId, rawEntry] of Object.entries(apps)) {
		if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) return;
		const entry = rawEntry;
		const destructiveApprovalMode = readDestructiveApprovalMode(entry.destructiveApprovalMode, bindingSchemaVersion);
		if ("appId" in entry || typeof entry.configKey !== "string" || entry.marketplaceName !== "openai-curated" || typeof entry.pluginName !== "string" || typeof entry.allowDestructiveActions !== "boolean" || destructiveApprovalMode === "invalid" || !Array.isArray(entry.mcpServerNames) || entry.mcpServerNames.some((serverName) => typeof serverName !== "string")) return;
		parsedApps[appId] = {
			configKey: entry.configKey,
			marketplaceName: entry.marketplaceName,
			pluginName: entry.pluginName,
			allowDestructiveActions: entry.allowDestructiveActions,
			...destructiveApprovalMode ? { destructiveApprovalMode } : {},
			mcpServerNames: entry.mcpServerNames
		};
	}
	const parsedPluginAppIds = {};
	const rawPluginAppIds = record.pluginAppIds;
	if (rawPluginAppIds && (typeof rawPluginAppIds !== "object" || Array.isArray(rawPluginAppIds))) return;
	if (rawPluginAppIds && typeof rawPluginAppIds === "object") for (const [configKey, appIds] of Object.entries(rawPluginAppIds)) {
		if (!Array.isArray(appIds) || appIds.some((appId) => typeof appId !== "string")) return;
		parsedPluginAppIds[configKey] = appIds;
	}
	return {
		fingerprint: record.fingerprint,
		apps: parsedApps,
		pluginAppIds: parsedPluginAppIds
	};
}
function readDestructiveApprovalMode(value, bindingSchemaVersion) {
	if (value === void 0) return;
	if (value === "deny") return "deny";
	if (value === "allow") return "allow";
	if (value === "auto") return bindingSchemaVersion === 1 ? "allow" : "auto";
	if (value === "on-request" && bindingSchemaVersion === 1) return "auto";
	return "invalid";
}
/** Removes the Codex app-server binding sidecar if present. */
async function clearCodexAppServerBinding(sessionFile, _lookup = {}) {
	if (!await codexAppServerBindingSidecarExists(sessionFile)) return;
	await withCodexAppServerBindingLock(sessionFile, async () => {
		await unlinkCodexAppServerBinding(sessionFile);
	});
}
async function codexAppServerBindingSidecarExists(sessionFile) {
	try {
		await fs.access(resolveCodexAppServerBindingPath(sessionFile));
		return true;
	} catch (error) {
		if (!isNotFound(error)) log.warn("failed to inspect codex app-server binding", {
			sessionFile,
			error
		});
		return false;
	}
}
async function unlinkCodexAppServerBinding(sessionFile) {
	try {
		await fs.unlink(resolveCodexAppServerBindingPath(sessionFile));
		return true;
	} catch (error) {
		if (!isNotFound(error)) log.warn("failed to clear codex app-server binding", {
			sessionFile,
			error
		});
		return false;
	}
}
/** Clears a binding only when it still points at the expected Codex thread id. */
async function clearCodexAppServerBindingForThread(sessionFile, threadId, lookup = {}) {
	if (!await readCodexAppServerBinding(sessionFile, lookup)) return false;
	return await withCodexAppServerBindingLock(sessionFile, async () => {
		const binding = await readCodexAppServerBinding(sessionFile, lookup);
		if (!binding) return false;
		if (binding.threadId !== threadId) {
			log.debug("codex app-server binding points at a different thread; preserving", {
				sessionFile,
				threadId,
				boundThreadId: binding.threadId
			});
			return false;
		}
		return await unlinkCodexAppServerBinding(sessionFile);
	});
}
function isNotFound(error) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
/** Returns true when an auth profile uses native Codex/OpenAI app-server auth. */
function isCodexAppServerNativeAuthProfile(lookup) {
	const authProfileId = lookup.authProfileId?.trim();
	if (!authProfileId) return false;
	try {
		const credential = resolveCodexAppServerAuthProfileCredential({
			...lookup,
			authProfileId
		});
		if (!credential || credential.type === "api_key") return false;
		return isOpenAiAuthProvider({
			provider: credential.provider,
			config: lookup.config
		});
	} catch (error) {
		log.debug("failed to resolve codex app-server auth profile provider", {
			authProfileId,
			error
		});
		return false;
	}
}
/** Hides redundant OpenAI provider attribution for native Codex auth bindings. */
function normalizeCodexAppServerBindingModelProvider(params) {
	const modelProvider = params.modelProvider?.trim();
	if (!modelProvider) return;
	if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === PUBLIC_OPENAI_MODEL_PROVIDER) return;
	return modelProvider;
}
function resolveCodexAppServerAuthProfileCredential(lookup) {
	const authProfileId = lookup.authProfileId?.trim();
	if (!authProfileId) return;
	return (lookup.authProfileStore ?? loadCodexAppServerAuthProfileStore({
		agentDir: lookup.agentDir,
		authProfileId,
		config: lookup.config
	})).profiles[authProfileId];
}
function loadCodexAppServerAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir?.trim() || resolveDefaultAgentDir(params.config ?? {}), {
		allowKeychainPrompt: false,
		config: params.config,
		externalCliProviderIds: [CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER],
		externalCliProfileIds: [params.authProfileId]
	});
}
function isOpenAiAuthProvider(params) {
	const provider = params.provider?.trim();
	return Boolean(provider && resolveProviderIdForAuth(provider, { config: params.config }) === CODEX_APP_SERVER_NATIVE_AUTH_PROVIDER);
}
function readApprovalPolicy(value) {
	return value === "never" || value === "on-request" || value === "on-failure" || value === "untrusted" ? value : void 0;
}
function readSandboxMode(value) {
	return value === "read-only" || value === "workspace-write" || value === "danger-full-access" ? value : void 0;
}
function readServiceTier(value) {
	return normalizeCodexServiceTier(value);
}
//#endregion
export { normalizeCodexAppServerBindingModelProvider as a, withCodexAppServerBindingLock as c, isCodexAppServerNativeAuthProfile as i, writeCodexAppServerBinding as l, clearCodexAppServerBinding as n, readCodexAppServerBinding as o, clearCodexAppServerBindingForThread as r, resolveCodexAppServerBindingPath as s, CODEX_APP_SERVER_BINDING_GUARDED_REQUEST_TIMEOUT_MS as t };
