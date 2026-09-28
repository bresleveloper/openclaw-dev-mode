Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_resolve_allowlist = require("./.setup/resolve-allowlist-CHzaaWiC.cjs");
let openclaw_plugin_sdk_directory_runtime = require("openclaw/plugin-sdk/directory-runtime");
const msteamsDirectoryContractPlugin = {
	id: "msteams",
	directory: {
		self: async ({ cfg }) => {
			const creds = require_resolve_allowlist.resolveMSTeamsCredentials(cfg.channels?.msteams);
			return creds ? {
				kind: "user",
				id: creds.appId,
				name: creds.appId
			} : null;
		},
		listPeers: async ({ cfg, query, limit }) => (0, openclaw_plugin_sdk_directory_runtime.listDirectoryEntriesFromSources)({
			kind: "user",
			sources: [cfg.channels?.msteams?.allowFrom ?? [], Object.keys(cfg.channels?.msteams?.dms ?? {})],
			query,
			limit,
			normalizeId: (raw) => {
				const normalized = require_resolve_allowlist.normalizeMSTeamsMessagingTarget(raw) ?? raw;
				const lowered = normalized.toLowerCase();
				return lowered.startsWith("user:") || lowered.startsWith("conversation:") ? normalized : `user:${normalized}`;
			}
		}),
		listGroups: async ({ cfg, query, limit }) => (0, openclaw_plugin_sdk_directory_runtime.listDirectoryEntriesFromSources)({
			kind: "group",
			sources: [Object.values(cfg.channels?.msteams?.teams ?? {}).flatMap((team) => Object.keys(team.channels ?? {}))],
			query,
			limit,
			normalizeId: (raw) => `conversation:${raw.replace(/^conversation:/i, "").trim()}`
		})
	}
};
//#endregion
exports.msteamsDirectoryContractPlugin = msteamsDirectoryContractPlugin;
