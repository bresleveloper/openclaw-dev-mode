import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { i as isPluginMetadataSnapshotCompatible } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { o as sanitizeServerName } from "./agent-bundle-mcp-names-CFVETBL6.mjs";
import { n as matchesAnyGlobPattern, t as compileGlobPatterns } from "./glob-pattern-DuaaJ-nB.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import { t as createMcpServerToolDenyMatcher } from "./tool-policy-match--5jlhAPZ.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-BD-xidlv.mjs";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-BO9Yzg8f.mjs";
import { t as hasManifestToolAvailability } from "./manifest-tool-availability-Dc0qse6d.mjs";
//#region src/agents/tool-policy-declared-context.ts
function buildDeclaredToolAllowlistContext(params) {
	const servers = normalizeConfiguredMcpServers(params.config?.mcp?.servers);
	const isDenied = createMcpServerToolDenyMatcher(params.toolDenylist);
	const usedServerNames = /* @__PURE__ */ new Set();
	const mcpServerNames = [];
	for (const [name, value] of Object.entries(servers)) {
		if (!isRecord(value) || value.enabled === false || !name.trim()) continue;
		const safeServerName = sanitizeServerName(name, usedServerNames);
		if (!isDenied(safeServerName)) mcpServerNames.push(safeServerName);
	}
	const pluginIds = /* @__PURE__ */ new Set();
	const pluginToolNames = /* @__PURE__ */ new Set();
	if (params.config?.plugins?.enabled !== false) {
		const env = params.env ?? process.env;
		const snapshot = (params.metadataSnapshot && params.metadataSnapshot.pluginIds === void 0 && isPluginMetadataSnapshotCompatible({
			snapshot: params.metadataSnapshot,
			config: params.config,
			env,
			workspaceDir: params.workspaceDir
		}) ? params.metadataSnapshot : void 0) ?? getCurrentPluginMetadataSnapshot({
			config: params.config,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			env
		});
		if (snapshot) {
			const normalizedPlugins = normalizePluginsConfig(params.config?.plugins);
			const denylist = compileGlobPatterns({
				raw: params.toolDenylist,
				normalize: normalizeToolPolicyName
			});
			const denylistBlocksName = (name) => {
				const normalized = normalizeToolPolicyName(name);
				return normalized ? matchesAnyGlobPattern(normalized, denylist) : false;
			};
			for (const plugin of snapshot.manifestRegistry.plugins) {
				if (!isManifestPluginAvailableForControlPlane({
					snapshot,
					plugin,
					config: params.config,
					normalizedConfig: normalizedPlugins
				}) || denylistBlocksName(plugin.id) || matchesAnyGlobPattern("group:plugins", denylist)) continue;
				const availableToolNames = (plugin.contracts?.tools ?? []).filter((toolName) => !denylistBlocksName(toolName)).filter((toolName) => hasManifestToolAvailability({
					plugin,
					toolNames: [toolName],
					config: params.config,
					env
				})).map(normalizeToolPolicyName).filter(Boolean);
				if (availableToolNames.length > 0) {
					pluginIds.add(plugin.id);
					for (const toolName of availableToolNames) pluginToolNames.add(toolName);
				}
			}
		}
	}
	if (mcpServerNames.length === 0 && pluginIds.size === 0 && pluginToolNames.size === 0) return;
	return {
		...pluginIds.size > 0 ? { pluginIds: [...pluginIds] } : {},
		...pluginToolNames.size > 0 ? { pluginToolNames: [...pluginToolNames] } : {},
		...mcpServerNames.length > 0 ? { mcpServerNames } : {}
	};
}
//#endregion
export { buildDeclaredToolAllowlistContext as t };
