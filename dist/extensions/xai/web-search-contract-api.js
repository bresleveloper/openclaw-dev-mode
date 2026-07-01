import { n as buildXaiWebSearchProviderBase } from "../../web-search-provider-shared-Do7WRCaZ.js";
//#region extensions/xai/web-search-contract-api.ts
function createXaiWebSearchProvider() {
	return {
		...buildXaiWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createXaiWebSearchProvider };
