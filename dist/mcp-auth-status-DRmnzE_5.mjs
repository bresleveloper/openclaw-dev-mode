import { k as withPluginCache, p as getPluginMetadataSnapshotCache } from "./plugin-cache-BbahpD-b.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { C as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-BBYDJbw9.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-_nMiaWKV.mjs";
import { i as loadEnabledBundleMcpConfig } from "./bundle-mcp-dtpQHFMr.mjs";
import { r as mergeConfiguredBundleMcpServers, u as partitionMcpServersByConnectionScope } from "./bundle-mcp-config-BEIeeWHy.mjs";
import { n as operatorMcpOAuthIdentity } from "./mcp-oauth-identity-0fgjEqV6.mjs";
//#region src/agents/mcp-operator-auth.ts
/** The shared operator OAuth connection that Settings may inspect and sign in. */
function resolveOperatorMcpOAuthConfig(serverName, server) {
	const raw = asOptionalObjectRecord(server);
	if (!raw || raw.enabled === false) return;
	const config = resolveMcpTransportConfig(serverName, raw, { logWarnings: false });
	return config?.kind === "http" && config.auth === "oauth" && !config.oauth?.authProfileId && Object.hasOwn(partitionMcpServersByConnectionScope({ [serverName]: raw }).staticServers, serverName) ? config : void 0;
}
//#endregion
//#region src/plugins/mcp-auth-status.ts
function resolvePluginMcpAuthDeclarations(config, metadata) {
	const cache = getPluginMetadataSnapshotCache(metadata);
	let byConfig = cache.metadata.mcpAuthDeclarations.get(metadata);
	if (!byConfig) {
		byConfig = /* @__PURE__ */ new WeakMap();
		cache.metadata.mcpAuthDeclarations.set(metadata, byConfig);
	}
	const configKey = resolveRuntimeConfigCacheKey(config);
	const cached = byConfig.get(config);
	if (cached?.configKey === configKey) return cached.declarations;
	const bundled = withPluginCache(cache, () => loadEnabledBundleMcpConfig({
		cfg: config,
		workspaceDir: metadata.workspaceDir ?? "",
		manifestRegistry: metadata.manifestRegistry
	}));
	const byPluginId = /* @__PURE__ */ new Map();
	for (const [serverName, pluginId] of Object.entries(bundled.pluginIdsByServer).toSorted(([a], [b]) => a.localeCompare(b))) {
		const transport = resolveMcpTransportConfig(serverName, bundled.config.mcpServers[serverName], { logWarnings: false });
		if (transport?.kind === "http") {
			const servers = byPluginId.get(pluginId) ?? [];
			servers.push({
				serverName,
				url: transport.url
			});
			byPluginId.set(pluginId, servers);
		}
	}
	const declarations = {
		byPluginId,
		bundled
	};
	byConfig.set(config, {
		configKey,
		declarations
	});
	return declarations;
}
/** Select sign-in from the caller's active inventory, with explicit config taking precedence. */
function resolveOperatorMcpOAuthConnection(params) {
	const server = params.metadata ? mergeConfiguredBundleMcpServers(resolvePluginMcpAuthDeclarations(params.config, params.metadata).bundled, { cfg: params.config }).config.mcpServers[params.serverName] : params.config.mcp?.servers?.[params.serverName];
	const config = resolveOperatorMcpOAuthConfig(params.serverName, server);
	return config && server ? {
		config,
		server
	} : void 0;
}
/** Project stored auth state only for a plugin's matching, operator-owned connections. */
async function readPluginMcpAuthStatus(params) {
	const declarations = resolvePluginMcpAuthDeclarations(params.config, params.metadata);
	const servers = mergeConfiguredBundleMcpServers(declarations.bundled, { cfg: params.config }).config.mcpServers;
	const identities = (declarations.byPluginId.get(params.pluginId) ?? []).flatMap(({ serverName: name, url }) => {
		const configured = resolveOperatorMcpOAuthConfig(name, servers[name]);
		return configured && configured.url === url ? [operatorMcpOAuthIdentity(name, configured.url)] : [];
	});
	if (identities.length === 0) return;
	const { readMcpOAuthCredentialsStatuses } = await import("./mcp-oauth-CXL2rQxA.mjs");
	const statuses = await readMcpOAuthCredentialsStatuses(identities);
	return identities.map((identity, index) => ({
		serverName: identity.serverName,
		state: statuses[index].state
	}));
}
//#endregion
export { resolveOperatorMcpOAuthConnection as n, readPluginMcpAuthStatus as t };
