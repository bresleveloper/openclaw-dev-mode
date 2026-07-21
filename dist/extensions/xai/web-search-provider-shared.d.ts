import { Ru as WebSearchProviderPlugin } from "../../types-BpDhk2ev.js";
//#region extensions/xai/web-search-provider-shared.d.ts
declare const XAI_WEB_SEARCH_CREDENTIAL_PATH = "plugins.entries.xai.config.webSearch.apiKey";
declare function buildXaiWebSearchProviderBase(): Omit<WebSearchProviderPlugin, "createTool" | "runSetup">;
//#endregion
export { XAI_WEB_SEARCH_CREDENTIAL_PATH, buildXaiWebSearchProviderBase };