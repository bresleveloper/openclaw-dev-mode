Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_resolve_allowlist = require("./.setup/resolve-allowlist-gI34MnpE.cjs");
let openclaw_plugin_sdk_directory_runtime = require("openclaw/plugin-sdk/directory-runtime");
const msteamsDirectoryContractPlugin = {
	id: "msteams",
	directory: {
		self: async ({ cfg, accountId }) => {
			const { credentials: creds } = require_resolve_allowlist.resolveMSTeamsRuntimeAccount({
				cfg,
				accountId
			});
			return creds ? {
				kind: "user",
				id: creds.appId,
				name: creds.appId
			} : null;
		},
		listPeers: async ({ cfg, accountId, query, limit }) => {
			const msteamsCfg = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId);
			return (0, openclaw_plugin_sdk_directory_runtime.listDirectoryEntriesFromSources)({
				kind: "user",
				sources: [msteamsCfg.allowFrom ?? [], Object.keys(msteamsCfg.dms ?? {})],
				query,
				limit,
				normalizeId: (raw) => {
					const normalized = require_resolve_allowlist.normalizeMSTeamsMessagingTarget(raw) ?? raw;
					const lowered = normalized.toLowerCase();
					return lowered.startsWith("user:") || lowered.startsWith("conversation:") ? normalized : `user:${normalized}`;
				}
			});
		},
		listGroups: async ({ cfg, accountId, query, limit }) => {
			const msteamsCfg = require_resolve_allowlist.resolveMSTeamsAccountConfig(cfg, accountId);
			return (0, openclaw_plugin_sdk_directory_runtime.listDirectoryEntriesFromSources)({
				kind: "group",
				sources: [Object.values(msteamsCfg.teams ?? {}).flatMap((team) => Object.keys(team.channels ?? {}))],
				query,
				limit,
				normalizeId: (raw) => `conversation:${raw.replace(/^conversation:/i, "").trim()}`
			});
		}
	}
};
//#endregion
exports.msteamsDirectoryContractPlugin = msteamsDirectoryContractPlugin;
