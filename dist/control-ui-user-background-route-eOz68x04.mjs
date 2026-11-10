import { i as isBackgroundAssetId } from "./background-preferences-C24XmTL3.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
//#region src/gateway/control-ui-user-background-route.ts
const PREFIX = "/__openclaw__/users/background/";
function parseControlUiUserBackgroundPath(pathname, basePath) {
	const base = normalizeControlUiBasePath(basePath);
	const path = base && pathname.startsWith(base + PREFIX) ? pathname.slice(base.length) : pathname;
	if (!path.startsWith(PREFIX)) return { matched: false };
	const assetId = path.slice(31);
	return {
		matched: true,
		assetId: isBackgroundAssetId(assetId) ? assetId : void 0
	};
}
//#endregion
export { parseControlUiUserBackgroundPath as t };
