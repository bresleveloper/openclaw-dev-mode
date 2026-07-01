import { cn as ProviderPlugin } from "../../types-BVLQjFJF.js";
import { g as OpenClawPluginApi } from "../../plugin-entry-DpILbQ7M.js";
//#region extensions/minimax/provider-registration.d.ts
declare function buildMinimaxApiProviderPlugin(): ProviderPlugin;
declare function buildMinimaxPortalProviderPlugin(): ProviderPlugin;
declare function registerMinimaxProviders(api: OpenClawPluginApi): void;
//#endregion
export { buildMinimaxApiProviderPlugin, buildMinimaxPortalProviderPlugin, registerMinimaxProviders };