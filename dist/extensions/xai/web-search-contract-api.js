import { t as buildXaiWebSearchProviderBase } from "../../web-search-provider-shared-De7A137G.mjs";
//#region extensions/xai/web-search-contract-api.ts
function createXaiWebSearchProvider() {
	return {
		...buildXaiWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createXaiWebSearchProvider };
