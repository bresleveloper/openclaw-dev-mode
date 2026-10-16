import { i as resolveBuzzAccount, m as parseBuzzTarget, u as buildBuzzTarget } from "./types-DRUZMyTx.mjs";
import { t as applyBuzzDirectoryQueryAndLimit } from "./directory-query-D1BNu8nO.mjs";
//#region extensions/buzz/src/directory-config.ts
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
//#endregion
export { listBuzzDirectoryPeersFromConfig as n, listBuzzDirectoryGroupsFromConfig as t };
