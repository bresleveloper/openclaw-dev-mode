import { o as buildBuzzTarget, u as parseBuzzTarget } from "./account-config-BKcQfUTN.mjs";
import { i as resolveBuzzAccount, t as applyBuzzDirectoryQueryAndLimit } from "./directory-query-Dzs2hVjW.mjs";
// extensions/buzz/src/directory-config.ts
async function listBuzzDirectoryPeersFromConfig(_params) {
	return [];
}
async function listBuzzDirectoryGroupsFromConfig(params) {
	const account = resolveBuzzAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const entries = Object.entries(account.config.groups ?? {}).filter(([, config]) => config.enabled !== false).map(([roomId]) => {
		const id = parseBuzzTarget(roomId);
		return {
			kind: "group",
			id: buildBuzzTarget(id),
			name: id,
			raw: { roomId: id }
		};
	}).toSorted((a, b) => a.id.localeCompare(b.id));
	return applyBuzzDirectoryQueryAndLimit(entries, params);
}
export { listBuzzDirectoryPeersFromConfig as n, listBuzzDirectoryGroupsFromConfig as t };
