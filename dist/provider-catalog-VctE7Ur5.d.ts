import { m as ModelProviderDeclarationConfig } from "./types.models-Nc1Z-tAz.js";
//#region extensions/minimax/provider-catalog.d.ts
declare function resolveMinimaxCatalogBaseUrl(env?: NodeJS.ProcessEnv): string;
declare function buildMinimaxProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
declare function buildMinimaxPortalProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
//#endregion
export { buildMinimaxProvider as n, resolveMinimaxCatalogBaseUrl as r, buildMinimaxPortalProvider as t };