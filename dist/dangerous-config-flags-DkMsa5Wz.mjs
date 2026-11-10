import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./utils-gjJ-tD2q.mjs";
import { f as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries, o as tryResolveDefaultAgentId } from "./agent-roster-gkYP38su.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-BccyWLRI.mjs";
import "./workspace-default-BjEaT57h.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CYadf-lt.mjs";
import { t as resolvePluginConfigContractsById } from "./config-contracts-DRulo8kM.mjs";
import { t as collectEnabledInsecureOrDangerousFlagsFromContracts } from "./dangerous-config-flags-core-BH0aIzlX.mjs";
//#region src/security/dangerous-config-flags.ts
/** Collect enabled insecure/dangerous config flags from manifest contracts. */
function collectEnabledInsecureOrDangerousFlags(cfg) {
	const pluginEntries = cfg.plugins?.entries;
	if (!isRecord(pluginEntries)) return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg);
	const pluginIds = Object.keys(pluginEntries);
	const defaultAgentId = tryResolveDefaultAgentId(cfg);
	const workspaceDirs = /* @__PURE__ */ new Set();
	if (defaultAgentId) workspaceDirs.add(resolveAgentWorkspaceDir(cfg, defaultAgentId));
	else {
		const roster = listAgentEntries(cfg);
		let hasInheritedWorkspace = roster.length === 0;
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
