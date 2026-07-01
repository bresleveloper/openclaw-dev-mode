import { t as createCodexWebSearchProviderBase } from "../../web-search-provider.shared-C7eio53H.js";
//#region extensions/codex/web-search-contract-api.ts
function createCodexWebSearchProvider() {
	return {
		...createCodexWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createCodexWebSearchProvider };
