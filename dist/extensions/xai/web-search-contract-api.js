import { t as buildXaiWebSearchProviderBase } from "../../web-search-provider-shared-Dx3y6IjJ.mjs";
//#region extensions/xai/web-search-contract-api.ts
function createXaiWebSearchProvider() {
	return {
		...buildXaiWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createXaiWebSearchProvider };
