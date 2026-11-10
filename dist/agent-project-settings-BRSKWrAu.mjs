import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as freezeJsonSnapshot } from "./immutable-data-DqJSDH8t.mjs";
import { C as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-C2eV0eNq.mjs";
import { b as normalizePluginsConfigWithResolverCore, v as resolvePluginActivationStateShared } from "./config-state-DkDfCu7E.mjs";
import { o as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as applyMergePatch } from "./merge-patch-D-eANYlX.mjs";
import { r as readBundleJsonObject } from "./bundle-config-shared-Dw2g469y.mjs";
import { r as loadEmbeddedAgentMcpConfig } from "./agent-bundle-mcp-runtime-config-BY_ItTpJ.mjs";
import { t as SettingsManager } from "./settings-manager-D9ggLoN1.mjs";
import "./sessions-DcS9dd33.mjs";
import { r as applyAgentCompactionSettingsFromConfig } from "./agent-settings-p_B_SpGc.mjs";
import path from "node:path";
//#region src/agents/agent-project-settings-snapshot.ts
/** Builds embedded-agent settings snapshots from global, bundle, and project settings. */
const log = createSubsystemLogger("embedded-agent-settings");
const DEFAULT_EMBEDDED_AGENT_PROJECT_SETTINGS_POLICY = "sanitize";
const SANITIZED_PROJECT_AGENT_KEYS = ["shellPath", "shellCommandPrefix"];
function sanitizeAgentSettingsSnapshot(settings) {
	const sanitized = { ...settings };
	for (const key of SANITIZED_PROJECT_AGENT_KEYS) delete sanitized[key];
	return sanitized;
}
/** Merge enabled bundle settings for one embedded-agent workspace. */
function loadEnabledBundleAgentSettingsSnapshot(params) {
	const workspaceDir = params.cwd.trim();
	if (!workspaceDir) return {};
	const config = params.cfg ?? {};
	const env = params.env ?? process.env;
	const metadataSnapshot = params.pluginMetadataSnapshot ?? loadPluginMetadataSnapshot({
		workspaceDir,
		config,
		env
	});
	return withPluginCache(getPluginMetadataSnapshotCache(metadataSnapshot), () => {
		const { plugins } = metadataSnapshot.manifestRegistry;
		if (plugins.length === 0) return {};
		const normalizedPlugins = normalizePluginsConfigWithResolverCore(config.plugins, metadataSnapshot.normalizePluginId);
		let snapshot = {};
		for (const record of plugins) {
			const settingsFiles = record.settingsFiles ?? [];
			if (record.format !== "bundle" || settingsFiles.length === 0) continue;
			if (!resolvePluginActivationStateShared({
				id: record.id,
				origin: record.origin,
				channelIds: record.channels,
				config: normalizedPlugins,
				rootConfig: config
			}).activated) continue;
			for (const relativePath of settingsFiles) {
				const absolutePath = path.join(record.rootDir, relativePath);
				const result = readBundleJsonObject({
					rootDir: record.rootDir,
					relativePath,
					allowMissing: false
				});
				if (!result.ok) {
					const message = result.reason === "open" ? "skipping unsafe bundle settings file" : result.error;
					log.warn(`${message}: ${absolutePath}`);
					continue;
				}
				snapshot = applyMergePatch(snapshot, sanitizeAgentSettingsSnapshot(result.raw));
			}
		}
		const embeddedAgentMcp = loadEmbeddedAgentMcpConfig({
			workspaceDir,
			cfg: config,
			manifestRegistry: metadataSnapshot.manifestRegistry
		});
		for (const diagnostic of embeddedAgentMcp.diagnostics) log.warn(`bundle MCP skipped for ${diagnostic.pluginId}: ${diagnostic.message}`);
		if (Object.keys(embeddedAgentMcp.mcpServers).length > 0) snapshot = applyMergePatch(snapshot, { mcpServers: embeddedAgentMcp.mcpServers });
		return snapshot;
	});
}
/** Resolves the configured project-settings trust policy for embedded agents. */
function resolveEmbeddedAgentProjectSettingsPolicy(cfg) {
	const raw = cfg?.agents?.defaults?.embeddedAgent?.projectSettingsPolicy;
	if (raw === "trusted" || raw === "sanitize" || raw === "ignore") return raw;
	return DEFAULT_EMBEDDED_AGENT_PROJECT_SETTINGS_POLICY;
}
/** Merges global, plugin, and project settings according to the selected trust policy. */
function buildEmbeddedAgentSettingsSnapshot(params) {
	const effectiveProjectSettings = params.policy === "ignore" ? {} : params.policy === "sanitize" ? sanitizeAgentSettingsSnapshot(params.projectSettings) : params.projectSettings;
	const withPluginSettings = applyMergePatch(params.globalSettings, sanitizeAgentSettingsSnapshot(params.pluginSettings ?? {}));
	return applyMergePatch(withPluginSettings, effectiveProjectSettings);
}
//#endregion
//#region src/agents/agent-project-settings.ts
const preparedSessionSettings = /* @__PURE__ */ new Map();
const MAX_PREPARED_SESSION_SETTINGS = 64;
registerPluginMetadataProcessMemoLifecycleClear(() => preparedSessionSettings.clear());
function clearPreparedEmbeddedAgentSettings(sessionIds) {
	for (const sessionId of sessionIds) if (sessionId) preparedSessionSettings.delete(sessionId);
}
function createPreparedEmbeddedAgentSettingsManager(params) {
	const configKey = params.cfg ? resolveRuntimeConfigCacheKey(params.cfg) : void 0;
	let prepared = preparedSessionSettings.get(params.sessionId);
	if (!prepared || prepared.cwd !== params.cwd || prepared.agentDir !== params.agentDir || prepared.configKey !== configKey || prepared.pluginMetadataSnapshot !== params.pluginMetadataSnapshot) {
		const fileSettingsManager = SettingsManager.create(params.cwd, params.agentDir);
		prepared = {
			cwd: params.cwd,
			agentDir: params.agentDir,
			configKey,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot,
			snapshot: freezeJsonSnapshot(buildEmbeddedAgentSettingsSnapshot({
				globalSettings: fileSettingsManager.getGlobalSettings(),
				pluginSettings: loadEnabledBundleAgentSettingsSnapshot(params),
				projectSettings: fileSettingsManager.getProjectSettings(),
				policy: resolveEmbeddedAgentProjectSettingsPolicy(params.cfg)
			}))
		};
	}
	preparedSessionSettings.delete(params.sessionId);
	preparedSessionSettings.set(params.sessionId, prepared);
	pruneMapToMaxSize(preparedSessionSettings, MAX_PREPARED_SESSION_SETTINGS);
	const settingsManager = SettingsManager.inMemory(prepared.snapshot);
	applyAgentCompactionSettingsFromConfig({
		settingsManager,
		cfg: params.cfg,
		contextTokenBudget: params.contextTokenBudget
	});
	settingsManager.setRetryEnabled(false);
	return settingsManager;
}
//#endregion
export { createPreparedEmbeddedAgentSettingsManager as n, clearPreparedEmbeddedAgentSettings as t };
