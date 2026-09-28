import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { A as tryResolveDefaultAgentId, E as listAgentEntries, l as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-BX-jIwaa.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as resolvePluginConfigContractsById } from "./config-contracts-qz7Zs8kR.mjs";
import { n as collectEnabledInsecureOrDangerousFlagsFromContracts, t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current--lXwjO9R.mjs";
//#region src/security/dangerous-config-flags.ts
/**
* Collect enabled insecure/dangerous config flags for audit and startup warnings.
* Plugin flags use current metadata when requested, then fall back to resolving manifest contracts.
*/
function collectEnabledInsecureOrDangerousFlags(cfg, options = {}) {
	const pluginEntries = cfg.plugins?.entries;
	if (!isRecord(pluginEntries)) return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg);
	const pluginIds = Object.keys(pluginEntries);
	if (options.preferCurrentPluginMetadataSnapshot) {
		const currentSnapshotFlags = collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot(cfg);
		if (currentSnapshotFlags) return currentSnapshotFlags;
	}
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const workspaceDirs = /* @__PURE__ */ new Set();
	if (defaultAgentId) workspaceDirs.add(resolveAgentWorkspaceDir(cfg, defaultAgentId));
	else {
		const roster = listAgentEntries(cfg);
		if (roster.length === 0) {
			const configuredWorkspace = cfg.agents?.defaults?.workspace?.trim();
			workspaceDirs.add(configuredWorkspace ? resolveUserPath(configuredWorkspace, process.env) : resolveDefaultAgentWorkspaceDir(process.env));
		} else {
			let hasInheritedWorkspace = false;
			for (const entry of roster) {
				const workspace = resolveAgentConfig(cfg, entry.id)?.workspace?.trim();
				if (workspace) workspaceDirs.add(resolveUserPath(workspace, process.env));
				else hasInheritedWorkspace = true;
			}
			if (hasInheritedWorkspace) {
				const inheritedWorkspace = cfg.agents?.defaults?.workspace?.trim();
				workspaceDirs.add(inheritedWorkspace ? resolveUserPath(inheritedWorkspace, process.env) : resolveDefaultAgentWorkspaceDir(process.env));
			}
		}
	}
	const flags = /* @__PURE__ */ new Set();
	for (const workspaceDir of workspaceDirs) {
		const configContracts = resolvePluginConfigContractsById({
			config: cfg,
			...workspaceDir ? { workspaceDir } : {},
			env: process.env,
			pluginIds
		});
		for (const flag of collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, {
			collectPluginConfigContractMatches,
			configContractsById: configContracts
		})) flags.add(flag);
	}
	return [...flags];
}
//#endregion
export { collectEnabledInsecureOrDangerousFlags as t };
