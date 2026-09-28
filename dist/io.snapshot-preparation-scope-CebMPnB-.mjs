import { AsyncLocalStorage } from "node:async_hooks";
//#region src/config/io.snapshot-preparation-scope.ts
const preparationScopes = new AsyncLocalStorage();
/** Bootstrap lends read preparation without claiming runtime write or activation ownership. */
async function withConfigSnapshotPreparation(params, run) {
	let active = true;
	const scope = {
		...params,
		isCurrent: () => active
	};
	try {
		return await preparationScopes.run([...preparationScopes.getStore() ?? [], scope], run);
	} finally {
		active = false;
	}
}
function getScopedConfigSnapshotPreparation(configPath) {
	return preparationScopes.getStore()?.findLast((scope) => scope.configPath === configPath && scope.isCurrent());
}
//#endregion
export { withConfigSnapshotPreparation as n, getScopedConfigSnapshotPreparation as t };
