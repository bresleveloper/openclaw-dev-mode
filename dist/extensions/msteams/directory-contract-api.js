import "../../directory-runtime-0snnWeh8.js";
import { a as listDirectoryEntriesFromSources } from "../../directory-config-helpers-BvNam8sN.js";
import { h as resolveMSTeamsCredentials } from "../../graph-users-DCQwnO0t.js";
import { n as normalizeMSTeamsMessagingTarget } from "../../resolve-allowlist-D3DUYJxc.js";
const msteamsDirectoryContractPlugin = {
	id: "msteams",
	directory: {
		self: async ({ cfg }) => {
			const creds = resolveMSTeamsCredentials(cfg.channels?.msteams);
			return creds ? {
				kind: "user",
				id: creds.appId,
				name: creds.appId
			} : null;
		},
		listPeers: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
			kind: "user",
			sources: [cfg.channels?.msteams?.allowFrom ?? [], Object.keys(cfg.channels?.msteams?.dms ?? {})],
			query,
			limit,
			normalizeId: (raw) => {
				const normalized = normalizeMSTeamsMessagingTarget(raw) ?? raw;
				const lowered = normalized.toLowerCase();
				return lowered.startsWith("user:") || lowered.startsWith("conversation:") ? normalized : `user:${normalized}`;
			}
		}),
		listGroups: async ({ cfg, query, limit }) => listDirectoryEntriesFromSources({
			kind: "group",
			sources: [Object.values(cfg.channels?.msteams?.teams ?? {}).flatMap((team) => Object.keys(team.channels ?? {}))],
			query,
			limit,
			normalizeId: (raw) => `conversation:${raw.replace(/^conversation:/i, "").trim()}`
		})
	}
};
//#endregion
export { msteamsDirectoryContractPlugin };
