import { t as createCodexWebSearchProviderBase } from "./.setup/web-search-provider.shared-CICsH-KY.mjs";
// extensions/codex/web-search-contract-api.ts
function createCodexWebSearchProvider() {
	return {
		...createCodexWebSearchProviderBase(),
		createTool: () => null
	};
}
export { createCodexWebSearchProvider };
