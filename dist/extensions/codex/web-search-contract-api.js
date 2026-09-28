import { t as createCodexWebSearchProviderBase } from "./.setup/web-search-provider.shared-BrZmlqyR.mjs";
//#region extensions/codex/web-search-contract-api.ts
function createCodexWebSearchProvider() {
	return {
		...createCodexWebSearchProviderBase(),
		createTool: () => null
	};
}
//#endregion
export { createCodexWebSearchProvider };
