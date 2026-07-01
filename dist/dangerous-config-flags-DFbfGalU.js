import { c as isRecord } from "./utils-BApvfmPs.js";
import "./agent-scope-CDZXADgT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CxGHASZV.js";
import { t as resolvePluginConfigContractsById } from "./config-contracts-DRnPzwa7.js";
import { n as collectEnabledInsecureOrDangerousFlagsFromContracts, t as collectEnabledInsecureOrDangerousFlagsFromCurrentSnapshot } from "./dangerous-config-flags-current-DR_GNcc7.js";
//#region src/security/dangerous-config-flags.ts
/**
* Collect enabled insecure/dangerous config flags for audit warnings and gateway tool previews.
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
	return collectEnabledInsecureOrDangerousFlagsFromContracts(cfg, {
		collectPluginConfigContractMatches,
		configContractsById: resolvePluginConfigContractsById({
			config: cfg,
			workspaceDir: resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)),
			env: process.env,
			pluginIds
		})
	});
}
//#endregion
export { collectEnabledInsecureOrDangerousFlags as t };
